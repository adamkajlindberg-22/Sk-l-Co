// Skapar shopify/produkter.csv för Shopifys produktimport (Admin, Produkter, Importera).
// Alla rader blir utkast och märks som exempel, så att inget publiceras av misstag.
// Byt ut mot leverantörens verifierade data innan något säljs. Vikt och mått som saknas lämnas tomma.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const SITE = (process.env.SITE || "https://adamkajlindberg-22.github.io/Sk-l-Co/").replace(/\/?$/, "/");
const core = readFileSync(new URL("../src/js/01-core.js", import.meta.url), "utf8");
const start = core.indexOf("const P=[");
const P = new Function("return " + core.slice(start + 8, core.indexOf("\n];", start) + 2))();

const NS = "skal"; // metafält i Shopify: skal.volym, skal.hojd ...
const META = [
  ["Volym cl", "volym", p => p.vol], ["Höjd cm", "hojd", p => p.h], ["Diameter cm", "diameter", p => p.d],
  ["Antal i förpackningen", "antal", p => p.pack], ["Material", "material", p => p.mat], ["Serie", "serie", p => p.series],
  ["Form", "form", p => p.shape], ["Drycker", "drycker", p => p.drinks.join(", ")], ["Tillfällen", "tillfallen", p => p.occ.join(", ")],
  ["Stil", "stil", p => p.style.join(", ")], ["Egenskaper", "egenskaper", p => p.props.join(", ")],
  ["Leverantörsgrupp", "leverantor", p => p.sup], ["Varför formen fungerar", "varfor", p => p.why],
];
const cols = ["Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags", "Published", "Status",
  "Option1 Name", "Option1 Value", "Variant SKU", "Variant Price", "Variant Compare At Price",
  "Variant Inventory Policy", "Variant Requires Shipping", "Variant Taxable", "Image Src", "Image Position", "Image Alt Text",
  ...META.map(([label, key]) => `${label} (product.metafields.${NS}.${key})`)];

const esc = v => { const s = v == null ? "" : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const html = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const VENDOR = "Exempel (visningsversion)";
const rows = [];

for (const p of P) {
  const base = {
    Handle: p.id, Title: p.name,
    "Body (HTML)": `<p>${html(p.why)}</p><p>${html(p.story)}</p><p><em>Exempelprodukt. Ersätts med leverantörens verifierade uppgifter.</em></p>`,
    Vendor: VENDOR, Type: p.cat, Tags: ["exempel", p.cat, ...p.drinks, ...p.style, ...p.props].join(", "),
    Published: "FALSE", Status: "draft", "Option1 Name": "Title", "Option1 Value": "Default Title",
    "Variant SKU": "EX-" + p.id.toUpperCase(), "Variant Price": p.price.toFixed(2),
    "Variant Compare At Price": p.was ? p.was.toFixed(2) : "",
    "Variant Inventory Policy": "deny", "Variant Requires Shipping": "TRUE", "Variant Taxable": "TRUE",
    "Image Src": `${SITE}assets/p-${p.img}.webp`, "Image Position": 1, "Image Alt Text": `${p.name}, kvällsljus`,
  };
  META.forEach(([label, key, get]) => base[`${label} (product.metafields.${NS}.${key})`] = get(p));
  rows.push(base);
  rows.push({ Handle: p.id, "Image Src": `${SITE}assets/d-${p.img}.webp`, "Image Position": 2, "Image Alt Text": `${p.name}, dagsljus` });
}

// Tillägg och Provlådan, med samma priser som sajten visar i dag
for (const [handle, title, price, body] of [
  ["gravyr", "Gravyr på foten", 149, "Gravyr på glasets fot. Text anges i varukorgen."],
  ["presentinslagning", "Presentinslagning med kort", 49, "Presentinslagning och hälsningskort."],
  ["provlada", "Provlåda", 149, "Tre glas att prova hemma. Dras av när du köper ett set."],
]) rows.push({
  Handle: handle, Title: title, "Body (HTML)": `<p>${body}</p><p><em>Exempel. Kontrollera att leverantören erbjuder detta.</em></p>`,
  Vendor: VENDOR, Type: "tillagg", Tags: "exempel, tillagg", Published: "FALSE", Status: "draft",
  "Option1 Name": "Title", "Option1 Value": "Default Title", "Variant SKU": "EX-" + handle.toUpperCase(),
  "Variant Price": price.toFixed(2), "Variant Inventory Policy": "continue", "Variant Requires Shipping": handle !== "gravyr" ? "TRUE" : "FALSE", "Variant Taxable": "TRUE",
});

mkdirSync(new URL("../shopify/", import.meta.url), { recursive: true });
writeFileSync(new URL("../shopify/produkter.csv", import.meta.url), [cols.join(","), ...rows.map(r => cols.map(c => esc(r[c])).join(","))].join("\n") + "\n");
console.log(`shopify/produkter.csv: ${P.length} glas och 3 tillägg, alla som utkast`);
