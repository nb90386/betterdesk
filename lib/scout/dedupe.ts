/** Normalisation for duplicate detection: website domain first, then name + ZIP. */
const SUFFIX = /\b(inc|llc|l\.l\.c|ltd|co|corp|corporation|company|pllc|pc|group|the)\b/g;

export function normalizeDomain(v: string | null | undefined): string | null {
  if (!v) return null;
  const d = v.trim().toLowerCase().replace(/^'/, "").replace(/^[a-z]+:\/\//, "").replace(/^www\./, "").split(/[/?#]/)[0];
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(d) ? d : null;
}

export function normalizeName(v: string) {
  return v.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9 ]/g, " ").replace(SUFFIX, " ").replace(/\s+/g, " ").trim();
}

export function dedupeKey(name: string, zip: string, website?: string | null) {
  const d = normalizeDomain(website);
  return d ? `d:${d}` : `n:${normalizeName(name)}|${zip.slice(0, 5)}`;
}

/** Secondary keys so "Acme Dental, LLC" with a website still matches "Acme Dental" without one in the same ZIP. */
export function matchKeys(name: string, zip: string, website?: string | null) {
  const keys = [`n:${normalizeName(name)}|${zip.slice(0, 5)}`];
  const d = normalizeDomain(website);
  if (d) keys.push(`d:${d}`);
  return keys;
}
