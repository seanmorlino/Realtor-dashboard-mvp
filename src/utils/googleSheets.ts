export function normalizeSpreadsheetUrl(rawUrl: string): string {
  const url = rawUrl.trim();
  if (!url) return "";

  if (url.includes("output=csv") || url.endsWith(".csv")) {
    return url;
  }

  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/spreadsheets\/d\/([^/]+)/);
    if (!match) return url;

    const sheetId = match[1];
    const gid = parsed.searchParams.get("gid") || "0";

    if (parsed.pathname.includes("/pub")) {
      const exportUrl = new URL(`https://docs.google.com/spreadsheets/d/${sheetId}/pub`);
      exportUrl.searchParams.set("gid", gid);
      exportUrl.searchParams.set("single", "true");
      exportUrl.searchParams.set("output", "csv");
      return exportUrl.toString();
    }

    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  } catch {
    return url;
  }
}

export function isLikelySheetUrl(url: string): boolean {
  return /docs\.google\.com\/spreadsheets\/d\//.test(url);
}
