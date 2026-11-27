// Slår ihop delarna i src/js till docs/assets/site.js i rätt ordning.
import { readFileSync, writeFileSync } from "node:fs";
const parts = ["01-core.js", "02-pages.js", "03-product.js", "04-tools.js", "045-legal.js", "05-account.js"];
const out = parts.map(p => readFileSync(new URL(`../src/js/${p}`, import.meta.url), "utf8")).join("");
writeFileSync(new URL("../docs/assets/site.js", import.meta.url), out);
console.log(`docs/assets/site.js byggd (${(out.length / 1024).toFixed(0)} kB)`);
