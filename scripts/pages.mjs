// Skapar en HTML-fil per sida och produkt från docs/index.html, så att varje adress
// (till exempel /handla/ och /glas/bourgogne/) har egen titel, beskrivning och kanonisk adress.
// Skapar också sitemap.xml, robots.txt och 404.html. Körs av build.mjs.
// Egen domän: sätt SITE, till exempel SITE=https://skalco.se/ npm run build
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const SITE = (process.env.SITE || "https://adamkajlindberg-22.github.io/Sk-l-Co/").replace(/\/?$/, "/");
const docs = new URL("../docs/", import.meta.url);
const tpl = readFileSync(new URL("index.html", docs), "utf8");

// Produktdata läses ur 01-core.js, så att den bara finns på ett ställe
const core = readFileSync(new URL("../src/js/01-core.js", import.meta.url), "utf8");
const start = core.indexOf("const P=[");
const end = core.indexOf("\n];", start);
const P = new Function("return " + core.slice(start + 8, end + 2))();

const VIEWS = {
  handla: "Handla glas", glasguiden: "Glasguiden", upptack: "Glas-swipe", glasvaggen: "Glasväggen",
  dukning: "Dukningsstudion", barstudion: "Barstudion", provladan: "Provlådan", present: "Presentguiden",
  glasskap: "Mitt glasskåp", journal: "Glasjournalen", om: "Om oss och kontakt",
  varumarken: "Varumärken A till Ö", villkor: "Villkor och integritet",
};
const NOT_IN_SITEMAP = new Set(["glasskap"]);
// För sidor vars ingress skrivs av JavaScript
const DESC = {
  handla: "Vinglas, champagneglas, whiskyglas, cocktailglas, vardagsglas, koppar och karaffer. Kombinera dryck, tillfälle, stil, egenskaper, prisnivå och storlek.",
  glasskap: "Dina glas, favoriter, listor och dukningar på ett ställe. Logga in med Google eller e-post, eller fortsätt utan konto.",
};

const attr = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const plain = s => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

// Ingressen under sidans rubrik blir beskrivningen
function lead(view) {
  const i = tpl.indexOf(`data-view="${view}"`);
  const j = tpl.indexOf("data-view=", i + 10);
  const m = tpl.slice(i, j < 0 ? undefined : j).match(/<p class="lead"[^>]*>([\s\S]*?)<\/p>/);
  return m ? plain(m[1]) : "";
}

function replaceTag(html, re, tag) {
  if (!re.test(html)) throw new Error("Hittar inte " + re + " i docs/index.html");
  return html.replace(re, tag);
}

function page({ depth, title, desc, url, image, show, extraHead = "", noindex = false, base }) {
  let h = tpl;
  const b = base || "../".repeat(depth);
  // <base> görs absolut direkt, så att den inte räknas om när adressen byts med pushState
  h = replaceTag(h, /<base href="\.\/">/, `<base href="${b}">\n<!-- Byggd av scripts/pages.mjs från docs/index.html. Ändra i docs/index.html, inte här. -->`);
  h = replaceTag(h, /<title>[^<]*<\/title>/, `<title>${attr(title)}</title>`);
  h = replaceTag(h, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${attr(desc)}">`);
  h = replaceTag(h, /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${attr(title)}">`);
  h = replaceTag(h, /<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${attr(desc)}">`);
  h = replaceTag(h, /<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  h = replaceTag(h, /<link rel="canonical" href="[^"]*">/, noindex ? `<meta name="robots" content="noindex">` : `<link rel="canonical" href="${url}">`);
  if (image) h = replaceTag(h, /<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${image}">`);
  if (show !== "hem") {
    // Hjältens bilder behövs inte på andra sidor
    h = h.replace(/<link rel="preload" as="image"[^>]*>\n?/g, "");
    h = h.replace('data-view="hem">', 'data-view="hem" hidden>');
    h = h.replace(`data-view="${show}" hidden>`, `data-view="${show}">`);
  }
  if (extraHead) h = h.replace("</head>", extraHead + "\n</head>");
  return h;
}

function write(rel, html) {
  const u = new URL(rel, docs);
  mkdirSync(new URL(".", u), { recursive: true });
  writeFileSync(u, html);
}

const urls = [SITE];
for (const [v, name] of Object.entries(VIEWS)) {
  const url = SITE + v + "/";
  write(v + "/index.html", page({ depth: 1, title: `SKÅL & CO · ${name}`, desc: lead(v) || DESC[v] || name, url, show: v }));
  if (!NOT_IN_SITEMAP.has(v)) urls.push(url);
}

for (const p of P) {
  const url = SITE + "glas/" + p.id + "/";
  const image = SITE + "assets/p-" + p.img + ".webp";
  const desc = `${p.name}. ${p.mat}, ${p.vol} cl, ${p.pack === 1 ? "1 st" : p.pack + " st i förpackningen"}. ${p.why}`;
  // Samma uppgifter som produktsidan visar. Inga betyg i strukturerad data.
  const ld = {
    "@context": "https://schema.org", "@type": "Product", name: p.name, sku: p.id, url, image, description: p.why,
    material: p.mat,
    offers: { "@type": "Offer", price: p.price, priceCurrency: "SEK", availability: "https://schema.org/InStock", url },
  };
  write(`glas/${p.id}/index.html`, page({
    depth: 2, title: `${p.name} · SKÅL & CO`, desc, url, image, show: "hem",
    extraHead: `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`,
  }));
  urls.push(url);
}

// GitHub Pages visar 404.html för okända adresser. Sidan startar sajten, som visar startsidan.
write("404.html", page({
  base: new URL(SITE).pathname, title: "SKÅL & CO · Sidan finns inte", desc: "Sidan finns inte.", url: SITE, show: "hem", noindex: true,
}));

writeFileSync(new URL("sitemap.xml", docs),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${u}</loc></url>`).join("\n") + `\n</urlset>\n`);
writeFileSync(new URL("robots.txt", docs), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);

console.log(`${Object.keys(VIEWS).length} sidor, ${P.length} produkter, sitemap med ${urls.length} adresser (${SITE})`);
