const MS_PER_DAY = 86_400_000;

export function toDateOnly(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseISODate(value: string | null): Date | null {
  if (!value) return null;
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

export function dateDiffInDays(date: string | null, today = toDateOnly()): number | null {
  const parsed = parseISODate(date);
  const parsedToday = parseISODate(today);
  if (!parsed || !parsedToday) return null;
  return Math.round((parsed.getTime() - parsedToday.getTime()) / MS_PER_DAY);
}

export function formatDate(date: string | null): string {
  const parsed = parseISODate(date);
  if (!parsed) return "No date";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(parsed);
}

export function formatRelativeDue(date: string | null, today = toDateOnly()): string {
  const diff = dateDiffInDays(date, today);
  if (diff === null) return "No due date";
  if (diff < 0) return `${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"} overdue`;
  if (diff === 0) return "Due today";
  if (diff === 1) return "Due tomorrow";
  return `Due in ${diff} days`;
}

export function parseSpreadsheetDate(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return toDateOnly(value);
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const utcDays = Math.floor(value - 25569);
    const date = new Date(utcDays * MS_PER_DAY);
    return toDateOnly(new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }

  const text = String(value).trim();
  if (!text) return null;

  const iso = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (iso) {
    const [, y, m, d] = iso;
    return normalizeDateParts(Number(y), Number(m), Number(d));
  }

  const us = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (us) {
    const [, m, d, y] = us;
    const fullYear = Number(y.length === 2 ? `20${y}` : y);
    return normalizeDateParts(fullYear, Number(m), Number(d));
  }

  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) {
    return toDateOnly(parsed);
  }

  return null;
}

function normalizeDateParts(year: number, month: number, day: number): string | null {
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return toDateOnly(date);
}
