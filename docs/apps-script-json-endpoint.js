const SOURCES = [
  {
    id: "ops-brief",
    name: "Operations Brief",
    docId: "PASTE_GOOGLE_DOC_ID"
  }
];

function doGet() {
  const payload = {
    generatedAt: new Date().toISOString(),
    sources: [],
    tasks: []
  };

  SOURCES.forEach((source) => {
    const doc = DocumentApp.openById(source.docId);
    const sourcePayload = {
      id: source.id,
      name: source.name,
      url: doc.getUrl(),
      lastUpdated: new Date().toISOString(),
      status: "connected"
    };

    payload.sources.push(sourcePayload);
    payload.tasks = payload.tasks.concat(readTasksFromDoc(doc, sourcePayload));
  });

  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function readTasksFromDoc(doc, source) {
  const body = doc.getBody();
  const tableTasks = readTables(body, source);
  if (tableTasks.length) {
    return tableTasks;
  }
  return readChecklistLines(body.getText(), source);
}

function readTables(body, source) {
  const tasks = [];
  const tables = body.getTables();

  tables.forEach((table) => {
    if (table.getNumRows() < 2) {
      return;
    }

    const headers = [];
    const headerRow = table.getRow(0);
    for (let c = 0; c < headerRow.getNumCells(); c += 1) {
      headers.push(normalizeHeader(headerRow.getCell(c).getText()));
    }

    if (!headers.includes("title") || !headers.includes("dueDate")) {
      return;
    }

    for (let r = 1; r < table.getNumRows(); r += 1) {
      const row = table.getRow(r);
      const record = {};
      for (let c = 0; c < row.getNumCells(); c += 1) {
        record[headers[c]] = row.getCell(c).getText().trim();
      }
      tasks.push(normalizeTask(record, source, tasks.length));
    }
  });

  return tasks.filter((task) => task.title);
}

function readChecklistLines(text, source) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line)
    .map((line, index) => parseTaskLine(line, source, index))
    .filter((task) => task);
}

function parseTaskLine(line, source, index) {
  const isChecklist = /^[-*]\s+\[[ xX-]\]\s+/.test(line);
  const hasFields = /\b(due|deadline|owner|assignee|priority|status|area):/i.test(line);
  if (!isChecklist && !hasFields) {
    return null;
  }

  const statusFromCheckbox = isChecklist && /\[[xX]\]/.test(line) ? "Done" : "Open";
  const stripped = line.replace(/^[-*]\s+\[[ xX-]\]\s+/, "").trim();
  const fields = {};
  const pattern = /\b(due|deadline|owner|assignee|priority|status|area|notes|link):\s*("[^"]+"|'[^']+'|[^\|,;]+)/gi;
  let match;

  while ((match = pattern.exec(stripped))) {
    fields[match[1].toLowerCase()] = match[2].replace(/^['"]|['"]$/g, "").trim();
  }

  const title = stripped
    .replace(/\b(due|deadline|owner|assignee|priority|status|area|notes|link):\s*("[^"]+"|'[^']+'|[^\|,;]+)/gi, "")
    .replace(/[|,;]\s*$/, "")
    .trim();

  return normalizeTask({
    title: title,
    dueDate: fields.due || fields.deadline || "",
    owner: fields.owner || fields.assignee || "",
    status: fields.status || statusFromCheckbox,
    priority: fields.priority || "",
    area: fields.area || "",
    notes: fields.notes || "",
    link: fields.link || ""
  }, source, index);
}

function normalizeTask(task, source, index) {
  const title = task.title || task.task || task.action || task.name || "";
  const dueDate = task.dueDate || task.due || task.date || task.deadline || "";
  return {
    id: task.id || makeTaskId(source.id, title, dueDate, index),
    title: String(title).trim(),
    owner: String(task.owner || task.assignee || "Unassigned").trim(),
    area: String(task.area || task.project || task.category || "General").trim(),
    dueDate: String(dueDate).trim(),
    status: String(task.status || "Open").trim(),
    priority: String(task.priority || "Medium").trim(),
    sourceId: source.id,
    sourceName: source.name,
    link: String(task.link || task.url || source.url || "").trim(),
    notes: String(task.notes || task.description || "").trim()
  };
}

function normalizeHeader(header) {
  const normalized = String(header)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, function (_, char) {
      return char.toUpperCase();
    })
    .replace(/[^a-z0-9]/g, "");

  const aliases = {
    task: "title",
    action: "title",
    date: "dueDate",
    due: "dueDate",
    deadline: "dueDate",
    assignee: "owner",
    assignedTo: "owner",
    project: "area",
    category: "area",
    note: "notes",
    description: "notes",
    url: "link"
  };

  return aliases[normalized] || normalized;
}

function makeTaskId(sourceId, title, dueDate, index) {
  const raw = sourceId + "|" + title + "|" + dueDate + "|" + index;
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_1, raw);
  return sourceId + "-" + bytes
    .slice(0, 6)
    .map(function (byte) {
      const value = (byte + 256) % 256;
      return ("0" + value.toString(16)).slice(-2);
    })
    .join("");
}
