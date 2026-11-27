# SKÅL & CO, instruktioner för Claude Code

Webbutik för glas, koppar och karaffer utan eget lager. Vi säljer andras glas på ett unikt sätt: guidning från dryck och tillfälle till rätt glas, över alla varumärken.

**Status:** visningsversion 5 (27 nov 2026). 16 exempelglas med AI-bilder, påhittade priser och betyg, kassan är inte kopplad. Ingen riktig produkt säljs än.

## Kommandon

```bash
npm run build      # slår ihop src/js/*.js till docs/assets/site.js
npm run check      # bygg och syntaxkontrollera
npm run dev        # bygg och starta lokal server på http://localhost:8765
npm test           # Playwright-tester (kräver: pip install playwright && playwright install chromium)
npm run test:a11y  # axe-granskning av alla sidor (kräver npm install)
```

Ändra alltid i `src/js/`, aldrig direkt i `docs/assets/site.js`. Kör `npm run build` efter varje ändring.

## Struktur

```
docs/                 Publicerad sajt (GitHub Pages läser härifrån)
  index.html          All markup, en <div class="view" data-view="..."> per sida
  assets/site.css     All CSS (bas + tillägg per version längst ner)
  assets/site.js      BYGGD fil, redigera inte
  assets/*.webp       Bilder. p-* kvällsljus, d-* dagsljus, -480 för kort, -800 för rutnät
  assets/hero*.mp4    Hjältefilmen som scrubbas med scroll. hero.mp4 är 1920 (crf 20), hero-1280.mp4 för skärmar under 1400 fysiska pixlar
src/js/               Källkod, sätts ihop i denna ordning:
  01-core.js          Hjälpfunktioner, glasformer (SH, FILL), produktdata (P), lagring (S), produktkort
  02-pages.js         Sidor och adresser, startsida, Handla med filter, varumärken, megameny, sök
  03-product.js       Produktsida, Form och storlek, 3D (three.js), varukorg, kassa
  04-tools.js         Glasguiden, Glas-swipe, Glasväggen, Dukningsstudion, Barstudion, Provlådan, Present, Journal
  045-legal.js        Villkor, samtycke, mätpunkter (track), ångerfunktion
  046-auth.js         Inloggning till Mitt glasskåp (Firebase: Google och e-post)
  047-tillsammans.js  Swipea tillsammans: grupper med kod och länk (#rum-KOD, #tillsammans)
  048-delat.js        Delade listor (#lista-ID), röstning på dukning (#bord-ID), påminnelser i grupper
  05-account.js       Mitt glasskåp, glassommelieren (AI), tema, meny, hjältefilm, start
scripts/build.mjs     Byggskript
tests/                Playwright och axe
```

## Arkitektur

- **En sida, flera vyer.** `route()` läser `location.hash` (`#handla`, `#glasskap`, `#p-bourgogne` för produkt). `showView()` visar en vy och kör `viewHooks[vy]`. Produktsidan är en modal.
- **Allt i en IIFE**, ingen ramverk, ingen byggkedja utöver sammanslagning. Funktioner anropas mellan filerna, så ordningen i build.mjs spelar roll.
- **Tillstånd:** objektet `S` (favoriter, listor, egna glas, sparade val, ordrar, poäng, profil, sökhistorik) sparas i `localStorage` under `skal-glasskap-v1`. Ändra via `save()`, som också meddelar lyssnare (`onState`).
- **Claude-förmågor:** när sajten körs som Claude-artefakt finns `window.claude.use("db" | "user" | "sample")`. Då synkas Mitt glasskåp till kontot och AI-funktionerna går via Claude. Utanför Claude (GitHub Pages, Hostinger) är `window.claude` odefinierat och allt faller tillbaka: lagring i webbläsaren och regelbaserade svar. **Varje AI-funktion ska ha en reserv.** Inför lansering ersätts `getSample()` med ett eget API.
- **Inloggning (Mitt glasskåp):** Firebase Authentication (Google och e-post med lösenord) laddas från gstatic när `FIREBASE_CONFIG` i `046-auth.js` är ifyllt. Projektet heter `skal-co` och använder Realtime Database (europe-west1, `FIREBASE_DB="rtdb"`). Glasskåpet sparas som JSON under `glasskap/{uid}`, och reglerna släpper bara in ägaren (`auth.uid === $uid`). Koden stödjer även Firestore. Lagt till domäner i Firebase: `adamkajlindberg-22.github.io` (lägg till egen domän vid lansering). Vid utloggning töms webbläsarens kopia. Inne i Claude används `claude.use("db")` i stället.
- **Mitt glasskåp utan inloggning:** `#glasskap` visar en inloggningssida (`gkLanding`) tills man loggar in eller väljer "Fortsätt utan konto" (`gkGuest`, sparas i sessionStorage). Inloggad vy har flikar (`gkTab`: översikt, glas, sparat, köp, konto). Allt på sajten fungerar utan konto. När något sparas utan konto visas en mjuk inloggningsruta en gång per besök (`nudgeLogin`). Knappen "Mitt glasskåp" i menyn är `#userBtn` (`.gk-btn`). På mobil ligger sök, favoriter och ljust läge i menyn.
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
- **Hjältefilmen "Svävet"** (mörk, åtta glasmodeller med dryck svävar i luften och en kupa häller ut bubbel på sten) hämtas som Blob och scrubbas med `requestAnimationFrame`. Statiskt läge (bild som tonas) på mobil, med reducerad rörelse och vid sparat data-läge.

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
- **Samtycke:** inget mäts utan ja i samtyckesrutan. Mätpunkter via `track(namn, data)` med GA4-namn (view_item, add_to_cart, begin_checkout, purchase, search, add_to_wishlist, refund_request). De hamnar i `window.dataLayer` först efter samtycke.
- **Ångerfunktionen** ("Ångra avtalet här") krävs enligt distansavtalslagen sedan 19 juni 2026. Den ska finnas i sidfoten och vid varje köp, kräva bekräftelse och ge kvitto med tidpunkt.

## Design

- Mörkt läge är standard, ljust läge via knappen (`data-skin` på `<html>`, inte `data-theme`).
- Mörkt: `--bg #141110`, `--surface #221c18`, `--ink #eee5d6`, `--accent #c49a5e`, `--vin #7c1e2c`.
- Ljust: `--bg #f3eee6`, `--ink #22201d`, `--accent #765c2f` (mörkare än tidigare för kontrastens skull), oliv `#6D7156`.
- Typsnitt: Fraunces (rubriker), Hanken Grotesk (text), IBM Plex Mono (små etiketter).
- Känsla: lugn lyx, som ett galleri. Produkterna är färgen, resten är dovt.

## Bilder

AI-skapade i Higgsfield, modell `gpt_image_2_6`, 4:5, 2k, hög kvalitet (2 krediter styck). Samma stil för alla produkter:

- **Kvällsljus (p-):** "Premium editorial product photograph of two [glas] standing on a rough dark slate stone, one filled with [dryck], the other empty. Warm amber smoky backdrop, low-key cinematic lighting with soft rim light, controlled reflections, shallow depth of field. Photorealistic, centered composition, no text, no logos."
- **Dagsljus (d-):** samma glas "on a pale travertine stone block. Warm ivory plaster wall with soft natural window daylight and a diagonal window shadow, airy and calm".

Exportera 880x1100 och 480x600 i WebP (kvalitet cirka 80).

## Nästa steg (i ordning)

1. Riktiga produkter från leverantör (MYFUSION, Orrefors/Kosta Boda B2B, Barkonsult med flera), med verifierad produktdata.
2. Shopify headless: produkter, priser, lager och kassa via Storefront API. Bygg inte om kassan själv.
3. Eget API för AI-funktionerna och kundkonton (ersätter `claude.use`).
4. Riktiga adresser per sida och filter (History API eller server) för SEO.
5. Juristgranskning av villkoren, riktiga företagsuppgifter, test i Safari och på iPhone.
6. Koppla statistik (till exempel Google Tag Manager som läser dataLayer).

## Dokument

Planeringsdokumenten (research, byggprompt, genomgång och färdplan) ligger privat i Claude-projektet "Glas", inte i det här repot, eftersom repot är publikt.
