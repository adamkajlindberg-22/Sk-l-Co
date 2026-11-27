# Shopify

Sajten är förberedd för Shopify som handelsmotor (headless). Så länge `SHOPIFY` i `src/js/01-core.js` är tomt körs visningsversionen med priserna i `P`. När den är ifylld hämtas pris, jämförpris och lagerstatus från Shopify, och kassan är Shopifys egen.

## Koppla på

1. Skapa en butik. En utvecklarbutik via Shopify Partners kostar inget och kan byggas klart innan företaget finns.
2. Importera exempelprodukterna: `npm run shopify:csv` skapar `shopify/produkter.csv`. I Shopify: Produkter, Importera. Allt importeras som utkast med leverantören "Exempel (visningsversion)".
3. Skapa metafälten under Inställningar, Anpassade data, Produkter, med namnrymden `skal` (volym, hojd, diameter, antal, material med flera). Annars hoppar importen över dem.
4. Installera kanalen Headless och skapa en publik Storefront-token. Ge den rätt att läsa produkter och skapa varukorgar.
5. Fyll i `SHOPIFY` i `src/js/01-core.js`:
   ```js
   const SHOPIFY={domain:"skal-co.myshopify.com",token:"<publik storefront-token>",version:"2025-07"};
   ```
   Storefront-token är publik och får ligga i koden. Admin-nycklar och hemliga nycklar får aldrig ligga i det här repot.
6. Publicera produkterna till kanalen Headless. Ett glas som inte finns där visas som "Slut just nu" och går inte att köpa.
7. Kör `npm run build` och `npm run test:all`.

## Så hänger det ihop

- Produktens handle i Shopify är samma som `id` i `P`, till exempel `bourgogne`.
- Gravyr och presentinslagning säljs som egna produkter med handle `gravyr` och `presentinslagning`. Provlådan heter `provlada`. Gravyrtexten följer med som radattribut.
- Saknas en produkt i Shopify stoppas kassan med ett tydligt meddelande. Varukorgen finns kvar.
- Betalning, moms, frakt och orderbekräftelse sköts av Shopify. Kontrollera vilka betalsätt som finns för Sverige (kort, Klarna, Apple Pay, Google Pay, Swish via app) när butiken skapas.
- `tests/shopify.py` testar kopplingen mot en låtsasbutik.

## Innan något säljs

Exempelglasen ska bytas mot leverantörens verifierade produktdata. Vikt, bly, ursprung och diskmaskinstålighet gissas aldrig.
