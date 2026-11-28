# SKÅL & CO, instruktioner för Claude Code

Webbutik för glas, koppar och karaffer utan eget lager. Vi säljer andras glas på ett unikt sätt: guidning från dryck och tillfälle till rätt glas, över alla varumärken.

**Status:** visningsversion 11 (27 nov 2026). Sajten ligger på https://adamkajlindberg-22.github.io/Sk-l-Co/ (GitHub Pages från `main`, mappen `docs`). 14 exempelglas med AI-bilder, påhittade priser och betyg. Kassan är inte kopplad och inget säljs. Shopify och Google Tag Manager är förberedda men inte påslagna (tomma `SHOPIFY` och `GTM_ID`). Inloggning, grupper, delade listor och röstning går mot en riktig Firebase-databas.

## Kom igång (Claude Code)

```bash
git clone https://github.com/adamkajlindberg-22/Sk-l-Co.git && cd Sk-l-Co
npm install                                   # axe-core för tillgänglighetstestet
pip install playwright pillow && playwright install chromium
npm run dev                                   # http://localhost:8765
npm run test:all                              # bygger, startar server om ingen körs, kör alla tester
```

Kräver Node 18 eller senare, Python 3 och ffmpeg (bara för `npm run hero`).

**Arbetssätt:** ändra i `src/js/`, `docs/index.html` och `docs/assets/site.css`. Kör `npm run test:all` innan du pushar. Allt som pushas till `main` publiceras på GitHub Pages inom någon minut. Byt `?v=` på filer i `docs/assets` som byts ut med samma namn, annars visar webbläsare gamla kopior.

**Externa tjänster (ingen nyckel ligger i repot utom Firebase-konfigurationen, som är offentlig):**
- **Firebase**, projekt `skal-co`: inloggning (Google, e-post) och Realtime Database. Reglerna finns längre ner och ska klistras in under Realtime Database, Rules när de ändras. Lägg till nya domäner under Authentication, Settings, Authorized domains.
- **Higgsfield**: alla bilder och filmen. Original för hjältefilmen ligger i `media/` (se `media/README.md`).
- **GitHub Pages**: Settings, Pages, Deploy from branch `main`, mappen `/docs`.
- **Shopify** (förberett): fyll i `SHOPIFY` i `01-core.js`, se `shopify/README.md`. Bara den publika Storefront-token får ligga i repot.
- **Google Tag Manager** (förberett): fyll i `GTM_ID` i `045-legal.js`. Uppdatera då cookietexten i villkoren, som i dag säger att ingen statistiktjänst är kopplad.
- **Planeringsdokument** ligger privat i Claude-projektet "Glas", inte här, eftersom repot är publikt.

## Kommandon

```bash
npm run build      # slår ihop src/js/*.js till docs/assets/site.js
npm run check      # bygg och syntaxkontrollera
npm run dev        # bygg och starta lokal server på http://localhost:8765
npm test           # Playwright-tester (kräver: pip install playwright && playwright install chromium)
npm run test:a11y  # axe-granskning av alla sidor (kräver npm install)
npm run test:all   # allt ovan, med egen server
npm run hero       # gör om hjältefilmens filer från media/ (kräver ffmpeg)
npm run shopify:csv  # produktfil för Shopifys import (shopify/produkter.csv)
```

Testerna kräver att `npm run dev` körs (utom `test:all`, som startar servern själv). `CHROME=/sökväg` väljer en egen webbläsare. `BROWSER=webkit python3 tests/routes.py` kör adresstestet i Safaris motor.

Tester: `routes.py` (adresser), `i18n.py` (engelska), `flows.py`, `legal_and_consent.py`, `group.py` och `shared.py` (låtsas-Firebase), `shopify.py` (låtsasbutik), `tools.py` (Glass Match och Presentguiden), `a11y.py` (axe).

Ändra alltid i `src/js/`, aldrig direkt i `docs/assets/site.js`. Kör `npm run build` efter varje ändring.

## Struktur

```
docs/                 Publicerad sajt (GitHub Pages läser härifrån)
  index.html          All markup, en <div class="view" data-view="..."> per sida. Mallen för alla sidor
  handla/, glas/ ...  BYGGDA kopior av index.html, en per adress (scripts/pages.mjs). Redigera inte
  sitemap.xml, robots.txt, 404.html  Byggda
  assets/site.css     All CSS (bas + tillägg per version längst ner)
  assets/site.js      BYGGD fil, redigera inte
  assets/*.webp       Bilder. p-* kvällsljus, d-* dagsljus, -480 för kort, -800 för rutnät
  assets/hero*.mp4    Hjältefilmen från 4K-originalet (Higgsfield, Topaz). Väljs efter fysiska pixlar: hero-2560 (2560x1440) från 2200, hero (1920) från 1400, annars hero-1280. Stående skärmar (mobil) får hero-m.mp4, ett stående utsnitt i 1080x1920, och egna stillbilder (hero-start-m, hero-end-m). Alla startbilder tas från filmens första ruta, så att inget zoomar eller hoppar när filmen tonas in. Kodade med nyckelbild var sjätte ruta och utan B-rutor (-g 6 -bf 0) så att scrollningen går lätt, CRF 20, aq-mode=3 och lätt skärpning. Se scripts/hero.sh
src/js/               Källkod, sätts ihop i denna ordning:
  01-core.js          Hjälpfunktioner, glasformer (SH, FILL), produktdata (P), lagring (S), produktkort
  02-pages.js         Sidor och adresser, startsida, Handla med filter, varumärken, megameny, sök
  03-product.js       Produktsida, Form och storlek, 3D (three.js), varukorg, kassa
  04-tools.js         Glasguiden, Glas-swipe, Glasväggen, Dukningsstudion, Barstudion, Provlådan, Present, Journal
  045-legal.js        Villkor, samtycke, mätpunkter (track), ångerfunktion
  046-auth.js         Inloggning till Mitt glasskåp (Firebase: Google och e-post)
  047-tillsammans.js  Swipea tillsammans: grupper med kod och länk (#rum-KOD, #tillsammans)
  048-delat.js        Delade listor (#lista-ID), röstning på dukning (#bord-ID), påminnelser i grupper
  049-shopify.js      Shopify Storefront API: priser, lager och kassa när SHOPIFY är ifyllt
  05-account.js       Mitt glasskåp, glassommelieren (AI), tema, meny, hjältefilm, start
  06-i18n.js          Engelska: språkknappen och översättningen av allt som visas. Stänger funktionen som omsluter allt
scripts/build.mjs     Byggskript. Kör också pages.mjs
scripts/pages.mjs     En HTML-fil per sida, kategori och produkt med egen titel, beskrivning, kanonisk adress och strukturerad data. SITE=https://... byter domän
scripts/shopify-csv.mjs  Produktfil för Shopify, alla som utkast och märkta som exempel
shopify/              Guide och importfil för Shopify
i18n/en.json          Engelska översättningar, svensk mening som nyckel. delar.txt har delmeningar
scripts/i18n-*.py     Samla texter, göra nycklar, slå ihop översättningar (se Språk nedan)
brand/                Logotypen Rent valv: SVG, PNG, typsnitt och koncept (se brand/README.md). Byggs med scripts/brand.py och scripts/brand-png.py
scripts/hero.sh       Gör om hjältefilmens filer från media/
scripts/test-all.sh   Bygger, startar server och kör alla tester
media/                Original för hjältefilmen (4K-film och startbild), används inte av sajten
tests/                Playwright och axe. Skärmbilder hamnar i tests/out/ (ignoreras av git)
```

## Arkitektur

- **En sida, flera vyer, riktiga adresser.** Varje vy har en adress (`handla/`, `glasskap/`), kategorier `handla/vinglas/` (`CATPAGE` i 02-pages.js) och produkter `glas/bourgogne/`. `route()` läser adressen, `goto(nyckel)` byter sida med `pushState`, `urlFor()` och `keyOf()` översätter. Interna länkar skrivs som `href="handla/"` och fångas av en klicklyssnare, så sidan laddas inte om. `<base>` görs absolut i `<head>` så att `assets/` alltid pekar rätt. Gamla `#handla` och `#p-id` flyttas till den nya adressen. Privata länkar (`#rum-`, `#lista-`, `#bord-`, `#tillsammans`) har kvar `#`. `showView()` visar en vy och kör `viewHooks[vy]`. Produktsidan är en modal.
- **Nya sidor eller kategorier** läggs till i `VIEWS` eller `CATPAGE` och `CATINTRO`. `npm run build` skapar HTML-filen och sitemapen.
- **Språk (svenska och engelska).** Svenska är grundspråket i all kod. Knappen EN/SV (`[data-lang]`, i menyraden, mobilmenyn och sidfoten) sparar valet i `localStorage` (`skal-lang`). På engelska hämtas `docs/assets/i18n-en.json` och `06-i18n.js` byter varje text och attribut (placeholder, aria-label, title, alt) som visas, även sådant som skapas senare (MutationObserver). Originalet sparas så att bytet tillbaka blir exakt. Siffror, glasnamn, veckodagar och månader blir platshållare `{n0}`, `{p0}`, `{d0}`, `{m0}`. Saknas en mening delas den vid " · ", ". " och ", ". Glassommelieren (AI) svarar på engelska. Element med `data-notr` översätts inte. Inga egna engelska adresser än.
- **Ny text på sajten** ska få engelsk översättning: `npm run dev`, sedan `python3 scripts/i18n-collect.py` och `python3 scripts/i18n-keys.py` (listar saknade i `i18n/nycklar.json`). Skriv `i18n/tr-1.txt` med "radnummer<TAB>engelska", kör `python3 scripts/i18n-merge.py` och ta bort tr-filen. `tests/i18n.py` larmar om svensk text blir kvar.
- **Allt i en IIFE**, ingen ramverk, ingen byggkedja utöver sammanslagning. Funktioner anropas mellan filerna, så ordningen i build.mjs spelar roll.
- **Tillstånd:** objektet `S` (favoriter, listor, egna glas, sparade val, ordrar, poäng, profil, sökhistorik) sparas i `localStorage` under `skal-glasskap-v1`. Ändra via `save()`, som också meddelar lyssnare (`onState`).
- **Claude-förmågor:** när sajten körs som Claude-artefakt finns `window.claude.use("db" | "user" | "sample")`. Då synkas Mitt glasskåp till kontot och AI-funktionerna går via Claude. Utanför Claude (GitHub Pages, Hostinger) är `window.claude` odefinierat och allt faller tillbaka: lagring i webbläsaren och regelbaserade svar. **Varje AI-funktion ska ha en reserv.** Inför lansering ersätts `getSample()` med ett eget API.
- **Inloggning (Mitt glasskåp):** Firebase Authentication (Google och e-post med lösenord) laddas från gstatic när `FIREBASE_CONFIG` i `046-auth.js` är ifyllt. Projektet heter `skal-co` och använder Realtime Database (europe-west1, `FIREBASE_DB="rtdb"`). Glasskåpet sparas som JSON under `glasskap/{uid}`, och reglerna släpper bara in ägaren (`auth.uid === $uid`). Koden stödjer även Firestore. Lagt till domäner i Firebase: `adamkajlindberg-22.github.io` (lägg till egen domän vid lansering). Vid utloggning töms webbläsarens kopia. Inne i Claude används `claude.use("db")` i stället.
- **Mitt glasskåp utan inloggning:** `#glasskap` visar en inloggningssida (`gkLanding`) tills man loggar in eller väljer "Fortsätt utan konto" (`gkGuest`, sparas i sessionStorage). Inloggad vy har flikar (`gkTab`: översikt, glas, sparat, köp, konto). Allt på sajten fungerar utan konto. När något sparas utan konto visas en mjuk inloggningsruta en gång per besök (`nudgeLogin`). Knappen "Mitt glasskåp" i menyn är `#userBtn` (`.gk-btn`), och antalet favoriter visas som en siffra på den (`#favBadge`). På mobil ligger sök, favoriter och ljust läge i menyn.
- **Glasguiden** har flerval (drycker, tillfällen, stilar, krav). Resultatet är ett glas per dryck med matchprocent och skäl, knappar för att byta glas och snabbjusteringar. `S.finder` har `drinks[]`, `styles[]`, `must[]`, `picks[]` och `drink` (första drycken) för äldre kod.
- **Swipea tillsammans** (`047-tillsammans.js`): kräver inloggning. `rum/{KOD}` har `meta` (bara skaparen skriver), `folk/{uid}/votes` (var och en sin egen rad) och `paminn/{uid}` (skaparen påminner). Matchning = alla deltagare gillar. Grupperna sparas i `S.rooms`.
- **Delat** (`048-delat.js`): en lista i Mitt glasskåp delas som länk (`listor/{ID}`). Gäster behöver inget konto för att se listan och markera ett glas som köpt, och ett köpt glas kan bara ändras av ägaren. Dukningar delas för röstning (`bord/{ID}`, kräver inloggning). Vid inloggning kollas grupperna och en notis visar påminnelser, "alla är klara" och glas som är kvar. Glassommelieren läser stilen och setet från Glasguiden (`setAdvice`).
- **Test med låtsas-Firebase:** `tests/group.py` och `tests/shared.py` byter ut gstatic-modulerna mot `tests/fake-firebase.js`.
- **Databasreglerna** (Realtime Database, Rules):
  ```json
  {"rules":{
    "glasskap":{"$uid":{".read":"auth != null && auth.uid === $uid",".write":"auth != null && auth.uid === $uid"}},
    "rum":{"$rid":{
      ".read":"auth != null && $rid.matches(/^[A-Z0-9]{6}$/)",
      "meta":{".write":"auth != null && (!data.exists() || data.child('host').val() === auth.uid) && newData.child('host').val() === auth.uid"},
      "folk":{"$uid":{".write":"auth != null && auth.uid === $uid"}},
      "paminn":{"$uid":{".write":"auth != null && root.child('rum').child($rid).child('meta').child('host').val() === auth.uid"}}
    }},
    "listor":{"$lid":{
      ".read":"$lid.matches(/^[A-Za-z0-9]{10}$/)",
      "meta":{".write":"auth != null && (!data.exists() || data.child('owner').val() === auth.uid) && newData.child('owner').val() === auth.uid"},
      "kopt":{"$pid":{
        ".write":"(!data.exists() && newData.exists()) || (auth != null && root.child('listor').child($lid).child('meta').child('owner').val() === auth.uid)",
        ".validate":"$pid.matches(/^[a-z]{2,20}$/) && newData.child('name').isString() && newData.child('name').val().length <= 40 && newData.child('ts').isNumber()"
      }}
    }},
    "bord":{"$bid":{
      ".read":"auth != null && $bid.matches(/^[A-Za-z0-9]{10}$/)",
      "meta":{".write":"auth != null && (!data.exists() || data.child('owner').val() === auth.uid) && newData.child('owner').val() === auth.uid"},
      "rost":{"$uid":{
        ".write":"auth != null && auth.uid === $uid",
        ".validate":"newData.child('v').isNumber() && (!newData.child('c').exists() || (newData.child('c').isString() && newData.child('c').val().length <= 200))"
      }}
    }}
  }}
  ```
- **3D** laddas först när fliken öppnas, från `cdn.jsdelivr.net/npm/three@0.160.0`. LatheGeometry från profilerna i `PROF`, inga tillägg.
- **Hjältefilmen "Svävet"** (mörk, åtta glasmodeller med dryck svävar i luften och en kupa häller ut bubbel på sten). På dator (liggande skärm) hämtas den som Blob och scrubbas med scrollen (`requestAnimationFrame`). På mobil och andra stående skärmar (`heroPortrait()`, `startLoop()`) är startbilden en skärm hög: filmen rullar av sig själv i 0,7 gångers fart och tonas mjukt över till början, och texterna visas efter varandra tills den sista med knapparna ligger kvar (`html.hero-loop`). Reducerad rörelse visar stillbilden och den sista texten direkt. Sparat data-läge på dator ger stillbild som tonas.

## Produktdata (`P` i 01-core.js)

`{id, name, mat, series, cat, shape, drinks[], occ[], style[], props[], vol(cl), h(cm), d(cm), pack, price, was?, img, tag, rating, reviews, isNew, pop, sup(A|B|C), colors?, why, story}`

`shape` styr silhuetten (`SH`), 3D-profilen (`PROF`) och familjen (`FAMILY`). `img` är filnamnets stam: `p-{img}.webp`, `d-{img}.webp`, `-480`. Nya kategorier läggs till i `DRINKN`, `CATS`, `FACETS`, `CATINTRO`.

## Regler för all text och kod

- **Enkel svenska.** Kort, vänligt, konkret.
- **Inga tankstreck** (varken långa eller korta med mellanslag). Använd punkt, komma eller "till" i intervall.
- **Inga klyschord:** leverage, seamless, empower, unlock, robust, actionable, data-driven, solutions (och svenska motsvarigheter som "sömlös").
- **Produktfakta gissas aldrig.** Saknas en uppgift (vikt, bly, ursprung, diskmaskin) skriver vi det. Glassommelieren får bara använda fakta från verktygen.
- **Ärlighetsetiketter:** allt som är exempel eller visning ska stå som det. Inga påhittade omdömen. Strukturerad data har inga betyg.
- **Värden från användare, Claude eller lagring** sätts med `textContent` eller går genom `esc()` innan de hamnar i HTML.
- **Tillgänglighet:** stängda paneler har `inert`. Rubriknivåer i ordning (h1 per sida, h2 för avsnitt). Kontrast minst 4,5:1 i båda lägena. Kör `npm run test:a11y` innan du publicerar.
- **Prestanda:** bilder i WebP, kort använder `-480`, rutnät `-800`. Ladda tunga saker först när de behövs.
- **Samtycke:** inget mäts utan ja i samtyckesrutan. Mätpunkter via `track(namn, data)` med GA4-namn (page_view, view_item, view_item_list, add_to_cart, remove_from_cart, begin_checkout, purchase, search, add_to_wishlist, sign_up, refund_request) och egna (compare_items, tool_use, tool_complete, tool_add_all, filter_apply). De hamnar i `window.dataLayer` först efter samtycke. GTM laddas bara efter samtycke, med annonslagring nekad.
- **Ångerfunktionen** ("Ångra avtalet här") krävs enligt distansavtalslagen sedan 19 juni 2026. Den ska finnas i sidfoten och vid varje köp, kräva bekräftelse och ge kvitto med tidpunkt.

## Design

- Mörkt läge är standard, ljust läge via knappen (`data-skin` på `<html>`, inte `data-theme`).
- Mörkt: `--bg #141110`, `--surface #221c18`, `--ink #eee5d6`, `--accent #c49a5e`, `--vin #7c1e2c`.
- Ljust: `--bg #f3eee6`, `--ink #22201d`, `--accent #765c2f` (mörkare än tidigare för kontrastens skull), oliv `#6D7156`.
- Typsnitt: Fraunces (rubriker), Hanken Grotesk (text), IBM Plex Mono (små etiketter).
- Logotyp: Rent valv (tulpanglas med gyllene dryck i ett valv). I menyraden och sidfoten som enkel ikon (`.logo-mark`, inline SVG) plus namnet. Favicon och appikoner i `docs/assets`. Se `brand/README.md`.
- Känsla: lugn lyx, som ett galleri. Produkterna är färgen, resten är dovt.

## Bilder

AI-skapade i Higgsfield, modell `gpt_image_2_6`, 4:5, 2k, hög kvalitet (2 krediter styck). Samma stil för alla produkter:

- **Kvällsljus (p-):** "Premium editorial product photograph of two [glas] standing on a rough dark slate stone, one filled with [dryck], the other empty. Warm amber smoky backdrop, low-key cinematic lighting with soft rim light, controlled reflections, shallow depth of field. Photorealistic, centered composition, no text, no logos."
- **Dagsljus (d-):** samma glas "on a pale travertine stone block. Warm ivory plaster wall with soft natural window daylight and a diagonal window shadow, airy and calm".

Exportera 880x1100 och 480x600 i WebP (kvalitet cirka 80).

## Nästa steg (i ordning)

Företaget sätts upp först. Det som går utan företag är gjort i version 11: riktiga adresser, kategorisidor, sitemap, Shopify och GTM förberedda, Glass Match, Presentguiden.

1. Riktiga produkter från leverantör (MYFUSION, Orrefors/Kosta Boda B2B, Barkonsult med flera), med verifierad produktdata. Lägg till märke (brand) i P.
2. Shopify: skapa butiken, importera, fyll i `SHOPIFY` (se `shopify/README.md`). Bygg inte om kassan själv.
3. Eget API för AI-funktionerna och kundkonton (ersätter `claude.use`). Glassommelieren ska söka i katalogen och aldrig hitta på pris, lager, leveranstid eller omdömen.
4. Egen domän: `SITE=https://... npm run build`, lägg till domänen i Firebase och Search Console, skicka in sitemap.xml.
5. Juristgranskning av villkoren, riktiga företagsuppgifter, test i Safari och på iPhone (WebKit kunde inte laddas ner i molnmiljön).
6. Koppla statistik: fyll i `GTM_ID` och uppdatera cookietexten.
7. Senare (kräver backend): leverantörsflöden och lagersynk, orderuppdelning per leverantör, adminpanel, skadeanmälan med bild, flera språk och valutor, AI-agenter med godkännande och logg.

## Dokument

Planeringsdokumenten (research, byggprompt, genomgång och färdplan) ligger privat i Claude-projektet "Glas", inte i det här repot, eftersom repot är publikt.
