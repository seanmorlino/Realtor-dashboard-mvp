import { Database, FileSpreadsheet, RefreshCw, Trash2, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import type { AppStateSnapshot, DataSource } from "../types";
import { normalizeSpreadsheetUrl } from "../utils/googleSheets";
import { parseCsvText, parseWorkbookFile } from "../utils/parser";
import { clearTaskData, restoreDemoData } from "../utils/storage";

interface DataSourcesPageProps {
  dataSource: DataSource;
  onSnapshotLoaded: (snapshot: AppStateSnapshot) => void;
}

export function DataSourcesPage({ dataSource, onSnapshotLoaded }: DataSourcesPageProps) {
  const [sheetUrl, setSheetUrl] = useState(dataSource.url || "");
  const [errors, setErrors] = useState<string[]>(dataSource.errors || []);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const expectedColumns = useMemo(
    () => ["Client Name", "Property Address", "Task", "Due Date", "Status", "Priority", "Notes", "Transaction Stage", "Assigned To"],
    []
  );

  async function handleWorkbook(file: File | undefined) {
    if (!file) return;
    setIsLoading(true);
    setErrors([]);
    setWarnings([]);

    try {
      const sourceId = `excel-${Date.now()}`;
      const result = await parseWorkbookFile(file, sourceId, file.name);
      if (result.errors.length > 0) {
        setErrors(result.errors);
        setWarnings(result.warnings);
        return;
      }

      onSnapshotLoaded({
        tasks: result.tasks,
        dataSource: {
          id: sourceId,
          type: "excel",
          name: file.name,
          loadedAt: new Date().toISOString(),
          rowCount: result.tasks.length,
          errors: result.warnings
        }
      });
      setWarnings(result.warnings);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Could not parse the workbook."]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSheetLoad() {
    const csvUrl = normalizeSpreadsheetUrl(sheetUrl);
    if (!csvUrl) {
      setErrors(["Paste a public Google Sheets URL or published CSV link."]);
      return;
    }

    setIsLoading(true);
    setErrors([]);
    setWarnings([]);

    try {
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error(`Source returned ${response.status}. Share or publish the sheet so Version 1 can read the CSV.`);
      }

      const text = await response.text();
      if (!text.trim() || text.trim().startsWith("<!DOCTYPE html")) {
        throw new Error("The sheet could not be read as CSV. Public sharing or published CSV access is required for Version 1.");
      }

      const sourceId = `sheet-${Date.now()}`;
      const result = parseCsvText(text, sourceId, "Google Sheet");
      if (result.errors.length > 0) {
        setErrors(result.errors);
        setWarnings(result.warnings);
        return;
      }

      onSnapshotLoaded({
        tasks: result.tasks,
        dataSource: {
          id: sourceId,
          type: csvUrl.includes("docs.google.com") ? "google-sheet" : "csv",
          name: csvUrl.includes("docs.google.com") ? "Google Sheet" : "Published CSV",
          url: csvUrl,
          loadedAt: new Date().toISOString(),
          rowCount: result.tasks.length,
          errors: result.warnings
        }
      });
      setWarnings(result.warnings);
      setSheetUrl(csvUrl);
    } catch (error) {
      setErrors([
        error instanceof Error
          ? error.message
          : "The source could not be loaded. Public or published Google Sheets CSV access is required for Version 1."
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleDemoRestore() {
    const snapshot = restoreDemoData();
    onSnapshotLoaded(snapshot);
    setErrors([]);
    setWarnings([]);
    setSheetUrl("");
  }

  function handleClearData() {
    const snapshot = clearTaskData();
    onSnapshotLoaded(snapshot);
    setErrors([]);
    setWarnings(["Source deleted and tasks reset."]);
    setSheetUrl("");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-normal text-ink">Data Sources</h2>
          <p className="text-sm text-slate-500">Load Excel workbooks or public spreadsheet CSV data.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-line bg-paper p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-sky-50 p-2 text-sky-700">
                <Upload className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-ink">Upload workbook</h3>
                <p className="text-sm text-slate-500">Accepts .xlsx and .xls files.</p>
              </div>
            </div>
            <label className="mt-4 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line bg-slate-50 p-4 text-center hover:bg-slate-100">
              <FileSpreadsheet className="h-8 w-8 text-slate-400" aria-hidden="true" />
              <span className="mt-2 text-sm font-semibold text-ink">Choose spreadsheet</span>
              <input
                className="sr-only"
                type="file"
                accept=".xlsx,.xls"
                onChange={(event) => void handleWorkbook(event.target.files?.[0])}
              />
            </label>
          </div>

          <div className="rounded-lg border border-line bg-paper p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                <Database className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-ink">Google Sheets or CSV</h3>
                <p className="text-sm text-slate-500">Public links can be refreshed from here.</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <input
                className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                value={sheetUrl}
                onChange={(event) => setSheetUrl(event.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                type="url"
              />
              <button
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                type="button"
                disabled={isLoading}
                onClick={() => void handleSheetLoad()}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />
                Load source
              </button>
            </div>
          </div>
        </div>

        {(errors.length > 0 || warnings.length > 0) && (
          <div className="space-y-2">
            {errors.map((error) => (
              <div key={error} className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ))}
            {warnings.map((warning) => (
              <div key={warning} className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                {warning}
              </div>
            ))}
          </div>
        )}

        <div className="rounded-lg border border-line bg-paper p-4 shadow-sm">
          <h3 className="font-semibold text-ink">Expected spreadsheet format</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {expectedColumns.map((column) => (
              <span key={column} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {column}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Common variants such as Client, Address, Deadline, Stage, Owner, and Assignee are accepted.
          </p>
        </div>
      </section>

      <aside className="space-y-4">
        <section className="rounded-lg border border-line bg-paper p-4 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-normal text-slate-500">Loaded source</p>
          <h3 className="mt-2 text-lg font-semibold text-ink">{dataSource.name}</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Type</dt>
              <dd className="font-semibold text-ink">{dataSource.type}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Rows</dt>
              <dd className="font-semibold text-ink">{dataSource.rowCount}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Loaded</dt>
              <dd className="font-semibold text-ink">{new Date(dataSource.loadedAt).toLocaleString()}</dd>
            </div>
          </dl>
          <button
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-md border border-line px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            type="button"
            onClick={handleDemoRestore}
          >
            Restore demo data
          </button>
          <button
            className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-red-200 px-3 text-sm font-semibold text-red-700 hover:bg-red-50"
            type="button"
            onClick={handleClearData}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete source / reset tasks
          </button>
        </section>
      </aside>
    </div>
  );
}
