import type { ReactNode } from "react";

/**
 * Minimal markdown for our own guides (trusted files in content/, still rendered as React text, never
 * as raw HTML). Supports front matter, #-###, paragraphs, - and 1. lists, | tables, **bold**, *italic*,
 * `code` and [links](https://...). Links are limited to http(s) and site-relative paths.
 */

export type Doc = { meta: Record<string, string>; blocks: Block[] };
type Block =
  | { t: "h"; level: 1 | 2 | 3; text: string; id: string }
  | { t: "p"; text: string }
  | { t: "ul" | "ol"; items: string[] }
  | { t: "table"; head: string[]; rows: string[][] };

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 60);

export function parseMarkdown(src: string): Doc {
  const meta: Record<string, string> = {};
  let body = src.replace(/\r\n/g, "\n");
  const fm = body.match(/^---\n([\s\S]*?)\n---\n/);
  if (fm) {
    for (const line of fm[1].split("\n")) {
      const m = line.match(/^(\w+):\s*"?(.*?)"?\s*$/);
      if (m) meta[m[1]] = m[2];
    }
    body = body.slice(fm[0].length);
  }
  const lines = body.split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    const h = l.match(/^(#{1,3})\s+(.*)$/);
    if (h) { blocks.push({ t: "h", level: h[1].length as 1 | 2 | 3, text: h[2].trim(), id: slug(h[2]) }); i++; continue; }
    if (/^\|/.test(l)) {
      const rows: string[][] = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        const cells = lines[i].trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells);
        i++;
      }
      blocks.push({ t: "table", head: rows[0] ?? [], rows: rows.slice(1) });
      continue;
    }
    if (/^[-*]\s+/.test(l) || /^\d+\.\s+/.test(l)) {
      const ordered = /^\d+\.\s+/.test(l);
      const items: string[] = [];
      while (i < lines.length && (ordered ? /^\d+\.\s+/ : /^[-*]\s+/).test(lines[i])) {
        let item = lines[i].replace(ordered ? /^\d+\.\s+/ : /^[-*]\s+/, "");
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i])) item += " " + lines[i++].trim();
        items.push(item);
      }
      blocks.push({ t: ordered ? "ol" : "ul", items });
      continue;
    }
    let text = l.trim();
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|[-*]\s|\d+\.\s|\|)/.test(lines[i])) text += " " + lines[i++].trim();
    blocks.push({ t: "p", text });
  }
  return { meta, blocks };
}

const safeHref = (h: string) => (/^https?:\/\//.test(h) || /^\/[\w/#?=&.-]*$/.test(h) ? h : null);

export function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\[([^\]]+)\]\(([^)\s]+)\))|(\*\*([^*]+)\*\*)|(`([^`]+)`)|(\*([^*]+)\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) {
      const href = safeHref(m[3]);
      out.push(href ? <a key={k++} href={href} className="link" rel={href.startsWith("http") ? "noopener" : undefined}>{m[2]}</a> : m[2]);
    } else if (m[4]) out.push(<strong key={k++} className="font-[600]">{m[5]}</strong>);
    else if (m[6]) out.push(<code key={k++} className="t-code rounded-[4px] bg-stone-2 px-1 py-0.5 text-[0.85em]">{m[7]}</code>);
    else if (m[8]) out.push(<em key={k++}>{m[9]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ blocks, skipH1 = true }: { blocks: Block[]; skipH1?: boolean }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.t === "h") {
          if (b.level === 1 && skipH1) return null;
          if (b.level === 2) return <h2 key={i} id={b.id} className="mt-14 scroll-mt-24 text-[1.75rem] font-[600] leading-tight tracking-[-0.022em]">{inline(b.text)}</h2>;
          return <h3 key={i} id={b.id} className="mt-9 scroll-mt-24 text-[1.25rem] font-[600] tracking-[-0.014em]">{inline(b.text)}</h3>;
        }
        if (b.t === "p") return <p key={i} className="mt-5 [overflow-wrap:anywhere] text-[1.0938rem] leading-[1.7] text-ink-2">{inline(b.text)}</p>;
        if (b.t !== "table") {
          const L = b.t === "ul" ? "ul" : "ol";
          return (
            <L key={i} className={`mt-5 grid [overflow-wrap:anywhere] gap-2.5 pl-5 text-[1.0625rem] leading-[1.65] text-ink-2 ${b.t === "ul" ? "list-disc marker:text-muted" : "list-decimal marker:text-muted marker:tabular-nums"}`}>
              {b.items.map((it, j) => <li key={j} className="pl-1">{inline(it)}</li>)}
            </L>
          );
        }
        return (
          <div key={i} className="mt-7 relative overflow-x-auto" tabIndex={0} role="region" aria-label="Table (scrolls sideways on small screens)">
            <table className="w-full min-w-[34rem] border-collapse text-left text-[0.9375rem]">
              <thead>
                <tr className="border-b border-rule-strong">{b.head.map((h, j) => <th key={j} scope="col" className="py-2.5 pr-4 font-[600]">{inline(h)}</th>)}</tr>
              </thead>
              <tbody>
                {b.rows.map((r, j) => (
                  <tr key={j} className="border-b border-rule align-top">{r.map((c, x) => <td key={x} className="py-2.5 pr-4 text-ink-2">{inline(c)}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
}

