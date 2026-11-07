/**
 * Prospect-list CSV import. RFC 4180-style parsing (quotes, escaped quotes, CRLF), column mapping,
 * row limits, and spreadsheet formula-injection neutralisation: a cell that starts with = + - @
 * tab or CR is stored with a leading apostrophe so it can never execute when exported again.
 */
export const MAX_ROWS = 500;
export const REQUIRED = ["name", "zip"] as const;
export const KNOWN = ["name", "website", "street", "city", "state", "zip", "category", "sqft", "contact_name", "contact_role", "contact_email", "notes"] as const;
export type Column = (typeof KNOWN)[number];
export type ProspectRow = Partial<Record<Column, string>> & { name: string; zip: string; __line: number };
export type ParseIssue = { line: number; message: string };
export type ParseResult = { rows: ProspectRow[]; issues: ParseIssue[]; columns: string[] };

const ALIASES: Record<string, Column> = {
  company: "name", business: "name", "business name": "name", "company name": "name", name: "name",
  website: "website", url: "website", domain: "website",
  address: "street", street: "street", "street address": "street",
  city: "city", state: "state", zip: "zip", "zip code": "zip", postcode: "zip", "postal code": "zip",
  category: "category", type: "category", industry: "category",
  sqft: "sqft", "square feet": "sqft", "sq ft": "sqft", "facility sqft": "sqft",
  contact: "contact_name", "contact name": "contact_name", contact_name: "contact_name",
  role: "contact_role", title: "contact_role", contact_role: "contact_role",
  email: "contact_email", "contact email": "contact_email", contact_email: "contact_email",
  notes: "notes", note: "notes",
};

export function neutralizeFormula(v: string) {
  return /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
}

export function parseCsvText(text: string): string[][] {
  const out: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"' && cell === "") q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((x) => x.trim() !== "")) out.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim() !== "")) out.push(row);
  return out;
}

export function parseProspectCsv(text: string): ParseResult {
  const issues: ParseIssue[] = [];
  if (text.length > 2_000_000) return { rows: [], issues: [{ line: 0, message: "File is larger than 2 MB." }], columns: [] };
  const grid = parseCsvText(text.replace(/^﻿/, ""));
  if (grid.length === 0) return { rows: [], issues: [{ line: 0, message: "The file is empty." }], columns: [] };
  const header = grid[0].map((h) => h.trim().toLowerCase());
  const map = header.map((h) => ALIASES[h] ?? null);
  for (const r of REQUIRED) if (!map.includes(r)) issues.push({ line: 1, message: `Missing a "${r}" column.` });
  if (issues.length) return { rows: [], issues, columns: header };
  const rows: ProspectRow[] = [];
  grid.slice(1).forEach((cells, i) => {
    const line = i + 2;
    if (rows.length >= MAX_ROWS) {
      if (rows.length === MAX_ROWS) issues.push({ line, message: `Only the first ${MAX_ROWS} rows are imported.` });
      return;
    }
    const r: Record<string, string> = {};
    map.forEach((col, j) => {
      if (col && cells[j] !== undefined) r[col] = neutralizeFormula(cells[j].trim()).slice(0, 2000);
    });
    if (!r.name) return issues.push({ line, message: "Row has no business name; skipped." });
    if (!r.zip || !/^'?\d{5}(-\d{4})?$/.test(r.zip)) return issues.push({ line, message: `"${r.name}" has no valid ZIP code; skipped.` });
    rows.push({ ...(r as unknown as ProspectRow), zip: r.zip.replace(/^'/, "").slice(0, 5), __line: line });
  });
  return { rows, issues, columns: header };
}
