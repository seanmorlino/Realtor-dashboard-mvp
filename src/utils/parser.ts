import * as XLSX from "xlsx";
import type { ParseResult, Priority, Task } from "../types";
import { parseSpreadsheetDate } from "./dates";

type Row = Record<string, unknown>;
type FieldName =
  | "clientName"
  | "propertyAddress"
  | "task"
  | "dueDate"
  | "status"
  | "priority"
  | "notes"
  | "transactionStage"
  | "assignedTo";

const aliases: Record<FieldName, string[]> = {
  clientName: ["clientname", "client", "customer", "contact", "buyer", "seller"],
  propertyAddress: ["propertyaddress", "address", "listingaddress", "homeaddress", "property"],
  task: ["task", "action", "todo", "item", "title", "activity"],
  dueDate: ["duedate", "due", "deadline", "closingdate", "date"],
  status: ["status", "state"],
  priority: ["priority", "importance", "urgency"],
  notes: ["notes", "note", "details", "comments"],
  transactionStage: ["transactionstage", "stage", "phase", "dealstage", "pipeline", "transaction"],
  assignedTo: ["assignedto", "assignee", "owner", "agent", "responsible"]
};

const priorityOrder: Priority[] = ["Critical", "High", "Medium", "Low", "Unspecified"];

export async function parseWorkbookFile(file: File, sourceId: string, sourceName: string): Promise<ParseResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    return { tasks: [], errors: ["Empty workbook. Add at least one sheet with task rows."], warnings: [] };
  }

  const rows = XLSX.utils.sheet_to_json<Row>(workbook.Sheets[sheetName], {
    defval: "",
    raw: false
  });

  return normalizeRows(rows, sourceId, sourceName);
}

export function parseCsvText(csvText: string, sourceId: string, sourceName: string): ParseResult {
  const workbook = XLSX.read(csvText, { type: "string" });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    return { tasks: [], errors: ["The CSV source was empty."], warnings: [] };
  }

  const rows = XLSX.utils.sheet_to_json<Row>(workbook.Sheets[sheetName], {
    defval: "",
    raw: false
  });

  return normalizeRows(rows, sourceId, sourceName);
}

function normalizeRows(rows: Row[], sourceId: string, sourceName: string): ParseResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (rows.length === 0) {
    return { tasks: [], errors: ["No rows were found in the spreadsheet."], warnings };
  }

  const headers = Object.keys(rows[0]);
  const mapping = mapHeaders(headers);

  if (!mapping.dueDate) {
    return {
      tasks: [],
      errors: ["Missing due date column. Use Due Date, Due, Deadline, Closing Date, or Date."],
      warnings
    };
  }

  if (!mapping.task) {
    warnings.push("No task column was found. Row labels were generated from client and stage values.");
  }

  const importedAt = new Date().toISOString();
  let invalidDates = 0;

  const tasks = rows
    .map((row, index) => {
      const dueValue = read(row, mapping.dueDate);
      const dueDate = parseSpreadsheetDate(dueValue);
      if (hasValue(dueValue) && !dueDate) invalidDates += 1;

      const taskText = text(read(row, mapping.task));
      const clientName = text(read(row, mapping.clientName)) || "Unknown client";
      const transactionStage = text(read(row, mapping.transactionStage)) || "Unstaged";

      return {
        id: `${sourceId}-${index + 1}-${slug(clientName || taskText || "task")}`,
        clientName,
        propertyAddress: text(read(row, mapping.propertyAddress)) || "No address",
        task: taskText || `Review ${transactionStage.toLowerCase()} task`,
        dueDate,
        status: text(read(row, mapping.status)) || "Open",
        priority: normalizePriority(read(row, mapping.priority)),
        notes: text(read(row, mapping.notes)),
        transactionStage,
        assignedTo: text(read(row, mapping.assignedTo)) || "Unassigned",
        sourceId,
        sourceName,
        importedAt
      } satisfies Task;
    })
    .filter((task) => hasRenderableTask(task));

  if (invalidDates > 0) {
    warnings.push(`${invalidDates} row${invalidDates === 1 ? "" : "s"} had invalid date values and were kept with no due date.`);
  }

  if (tasks.length === 0) {
    errors.push("No usable task rows were found. Check that the spreadsheet has headers and task data.");
  }

  return { tasks, errors, warnings };
}

function mapHeaders(headers: string[]): Partial<Record<FieldName, string>> {
  const normalizedHeaders = new Map(headers.map((header) => [normalizeHeader(header), header]));
  const mapping: Partial<Record<FieldName, string>> = {};

  for (const field of Object.keys(aliases) as FieldName[]) {
    const match = aliases[field].find((alias) => normalizedHeaders.has(alias));
    if (match) {
      mapping[field] = normalizedHeaders.get(match);
    }
  }

  return mapping;
}

function normalizeHeader(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function read(row: Row, key?: string): unknown {
  return key ? row[key] : "";
}

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function hasValue(value: unknown): boolean {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function normalizePriority(value: unknown): Priority {
  const normalized = text(value).toLowerCase();
  if (["critical", "urgent", "p0"].includes(normalized)) return "Critical";
  if (["high", "p1"].includes(normalized)) return "High";
  if (["medium", "med", "normal", "p2"].includes(normalized)) return "Medium";
  if (["low", "p3"].includes(normalized)) return "Low";
  return "Unspecified";
}

function hasRenderableTask(task: Task): boolean {
  return Boolean(task.task || task.clientName !== "Unknown client" || task.propertyAddress !== "No address");
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 32);
}

export function priorityRank(priority: Priority): number {
  return priorityOrder.indexOf(priority);
}
