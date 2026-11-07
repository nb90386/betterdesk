// Bundled FICTIONAL sample site (clearline.example is a reserved TLD) used for the Presence demo.
// runSampleAudit() runs the REAL analyzer over these fixtures: nothing about the findings is hard-coded.
// Pure: no node imports, safe to import from client components.

import { analyzeSnapshot } from "./analyze.ts";
import type { AuditInputs, PageSnapshot, PresenceReport, Snapshot } from "./types.ts";

export const SAMPLE_ORIGIN = "https://clearline.example";

export const SAMPLE_INPUTS: AuditInputs = {
  url: SAMPLE_ORIGIN,
  businessName: "Clearline Commercial Cleaning",
  serviceArea: "Central and east Denver",
  serviceCategory: "Commercial cleaning",
  profileUrls: [],
  competitors: [],
  questions: [
    "commercial cleaning company serving central Denver",
    "medical office cleaning in Denver",
    "nightly office cleaning near me",
  ],
};

const SHARED_DESC = "Clearline provides cleaning services for offices and facilities. Contact us for a quote.";

type PageDef = { title: string; desc: string; canonical?: string; robots?: string; h1: string; body: string; jsonLd?: string };

function render(p: PageDef): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${p.title}</title>
<meta name="description" content="${p.desc}">
${p.canonical ? `<link rel="canonical" href="${p.canonical}">` : ""}
${p.robots ? `<meta name="robots" content="${p.robots}">` : ""}
<meta property="og:site_name" content="Clearline Commercial Cleaning">
${p.jsonLd ? `<script type="application/ld+json">${p.jsonLd}</script>` : ""}
<style>body{font-family:sans-serif}</style>
</head>
<body>
<header><nav>
<a href="/">Clearline</a>
<a href="/services">Services</a>
<a href="/services/medical-office-cleaning">Medical offices</a>
<a href="/services/floor-care">Floor care</a>
<a href="/about">About</a>
<a href="/contact">Contact</a>
</nav></header>
<main>
<h1>${p.h1}</h1>
${p.body}
</main>
<footer><p>Clearline Commercial Cleaning &middot; 1200 Example St, Suite 4, Denver, CO 80204 &middot; (303) 555-0187</p></footer>
</body>
</html>`;
}

const ORG_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Clearline Commercial Cleaning",
  url: `${SAMPLE_ORIGIN}/`,
  telephone: "+1-303-555-0142",
});

const PAGES: Record<string, { html: string; headers?: { xRobotsTag?: string | null } }> = {
  "/": {
    html: render({
      title: "Home | Clearline",
      desc: SHARED_DESC,
      canonical: `${SAMPLE_ORIGIN}/`,
      h1: "Welcome to Clearline",
      jsonLd: ORG_LD,
      body: `<p>Clearline Commercial Cleaning keeps offices, clinics and shared workspaces clean so your team can focus on the work. We have been providing commercial cleaning for more than a decade, with background-checked crews who follow a written checklist for every visit.</p>
<h2>What we do</h2>
<p>Most of our clients choose nightly office cleaning, so the space is ready before the first person arrives. We also handle medical and dental office cleaning, floor care such as stripping, waxing and carpet extraction, and day porter service for buildings that need a presence during business hours.</p>
<h2>How it works</h2>
<p>We walk the space with you, agree a scope in writing, and start within two weeks. A named supervisor checks each site every week and you always have a direct line to the owner. Our crews work across the Denver metro and bring their own supplies and equipment, so there is nothing for your office manager to coordinate.</p>
<h2>Ask for a walkthrough</h2>
<p>Tell us about your space and we will send a written proposal within two business days. There is no contract lock-in on the first ninety days.</p>`,
    }),
  },
  "/services": {
    html: render({
      title: "Cleaning Services | Clearline Commercial Cleaning",
      desc: SHARED_DESC,
      canonical: `${SAMPLE_ORIGIN}/services`,
      h1: "Commercial cleaning services",
      body: `<p>Every Clearline contract starts with a written scope, so you know exactly what is cleaned, how often and by whom. These are the services our clients use most.</p>
<h2>Nightly office cleaning</h2>
<p>Trash and recycling, restrooms, kitchens and break rooms, vacuuming and damp mopping, and desk-surface wipe-downs, completed after hours with a signed checklist left at reception.</p>
<h2>Medical and dental office cleaning</h2>
<p>Cleaning built around infection-control routines for exam rooms and waiting areas. <a href="/services/medical-office-cleaning">See medical office cleaning</a>.</p>
<h2>Floor care</h2>
<p>Strip and wax, burnishing, tile and grout restoration and carpet extraction scheduled around your hours. <a href="/services/floor-care">See floor care</a>.</p>
<h2>Day porter service</h2>
<p>A trained porter on site during business hours to keep restrooms stocked, lobbies tidy and spills handled before anyone notices them.</p>
<p>Not sure which mix fits your building? <a href="/contact">Ask for a walkthrough</a> and we will recommend a scope.</p>`,
    }),
  },
  "/services/medical-office-cleaning": {
    html: render({
      title: "Medical and Dental Office Cleaning | Clearline",
      desc: SHARED_DESC,
      canonical: `${SAMPLE_ORIGIN}/services/medical-office-cleaning`,
      h1: "Medical and dental office cleaning",
      body: `<p>We clean medical and dental offices.</p><p>Call us for a quote.</p>`,
    }),
  },
  "/services/floor-care": {
    html: render({
      title: "Floor Care: Strip, Wax and Carpet Extraction | Clearline",
      desc: "Strip and wax, burnishing, tile restoration and carpet extraction for office and retail floors, scheduled outside your opening hours.",
      h1: "Floor care for offices and retail spaces",
      body: `<p>Floors take the most abuse in any building and show it first. Our floor care crews restore and protect hard floors and carpets on a schedule that keeps them looking right between deep cleans.</p>
<h2>Hard floors</h2>
<p>We strip old finish, apply multiple coats of wax or sealer, and burnish to a consistent shine. Vinyl composition tile, terrazzo and sealed concrete each get the process suited to the material, with test patches on request.</p>
<h2>Carpet</h2>
<p>Hot-water extraction removes embedded soil, and we treat high-traffic lanes and spots before the main pass. Carpets are usually walkable the same night.</p>
<h2>Scheduling</h2>
<p>Most floor care happens on weekends or overnight. We agree dates with your office manager and confirm the day before, so nobody is surprised.</p>`,
    }),
  },
  "/about": {
    html: render({
      title: "About Clearline Commercial Cleaning",
      desc: "Meet the owner-led team behind Clearline: how we hire, train and supervise our cleaning crews.",
      canonical: `${SAMPLE_ORIGIN}/about`,
      robots: "noindex, nofollow",
      h1: "About Clearline Commercial Cleaning",
      body: `<p>Clearline was started by Dana Ortiz after years managing facilities for a property company and seeing how often cleaning contracts failed on communication rather than effort.</p>
<h2>How we hire</h2>
<p>Every crew member is background-checked, trained on our checklists and paired with an experienced lead for the first month. Supervisors visit every site weekly.</p>
<h2>What we promise</h2>
<p>A written scope, a named supervisor, and a direct line to the owner. If something is missed, we send a crew back the same day at no charge.</p>`,
    }),
  },
  "/contact": {
    html: render({
      title: "Contact Clearline Commercial Cleaning | Request a Quote",
      desc: "Request a written cleaning proposal from Clearline. Tell us about your space and we will reply within two business days.",
      canonical: `${SAMPLE_ORIGIN}/contact`,
      h1: "Request a quote",
      body: `<p>Tell us about your space and we will send a written proposal within two business days.</p>
<form action="/contact" method="post">
<label>Name <input name="name"></label>
<label>Email <input name="email" type="email"></label>
<label>About your space <textarea name="message"></textarea></label>
<button type="submit">Send request</button>
</form>`,
    }),
  },
};

const ROBOTS_TXT = `# Copied from a "block AI bots" snippet
User-agent: *
Allow: /

User-agent: OAI-SearchBot
Disallow: /

User-agent: GPTBot
Disallow: /

Sitemap: ${SAMPLE_ORIGIN}/sitemap.xml
`;

const SITEMAP_URLS = ["/", "/services", "/services/medical-office-cleaning", "/about", "/contact"].map((p) => SAMPLE_ORIGIN + p);

const toSnap = (path: string): PageSnapshot => {
  const def = PAGES[path];
  return {
    url: SAMPLE_ORIGIN + path,
    finalUrl: SAMPLE_ORIGIN + path,
    status: 200,
    headers: { xRobotsTag: def.headers?.xRobotsTag ?? null, contentType: "text/html; charset=utf-8" },
    html: def.html,
  };
};

export const SAMPLE_FETCHED_AT = "2026-11-07T16:00:00.000Z";

export function sampleSnapshot(now?: number | Date): Snapshot {
  const at = now === undefined ? SAMPLE_FETCHED_AT : new Date(now).toISOString();
  return {
    method: "sample",
    inputs: SAMPLE_INPUTS,
    fetchedAt: at,
    home: toSnap("/"),
    pages: ["/services", "/services/medical-office-cleaning", "/services/floor-care", "/about", "/contact"].map(toSnap),
    robots: { status: 200, body: ROBOTS_TXT },
    sitemap: { url: `${SAMPLE_ORIGIN}/sitemap.xml`, status: 200, urls: SITEMAP_URLS },
    notes: ["This is a bundled sample site (clearline.example), not a live audit."],
  };
}

export function runSampleAudit(now?: number | Date): PresenceReport {
  return analyzeSnapshot(sampleSnapshot(now));
}
