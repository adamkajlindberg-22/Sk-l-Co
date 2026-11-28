# SKÅL & CO, logotyp

Logotypen heter **Rent valv**: ett tulpanglas med gyllene dryck, utställt i ett valv, med namnet och "Glas · Koppar · Karaffer" under. Valvet är samma form som fönstren i Mitt glasskåp.

## Filer (`brand/logo/`)

| Fil | Används till |
|---|---|
| `skalco-staplad-mork.svg` / `-ljus.svg` | Huvudlogga. Valv, namn och rad under. För mörk respektive ljus bakgrund |
| `skalco-liggande-mork.svg` / `-ljus.svg` | Enkel ikon och namn på en rad. Menyrad, e-post, kvitton |
| `skalco-mark-mork.svg` / `-ljus.svg` | Valvet med det detaljerade glaset, utan text |
| `skalco-ikon-mork.svg` / `-ljus.svg` | Enkel ikon för små storlekar, utan bakgrund |
| `skalco-app.svg` | App-ikon: vit logga på mörk, fyrkantig ruta. Telefonen rundar hörnen själv |
| `skalco-app-detalj.svg` | App-ikon med det detaljerade glaset, för stora storlekar som en butikssida |
| `skalco-profil.svg` | Profilbild med extra luft för runda ramar |
| `favicon.svg` | Favicon med rundade hörn |
| `*-vit.svg` | Samma logotyper i rent vitt, för mörka bilder och bakgrunder |
| `png/` | Samma i PNG: logotyper 1200 px, märket 800 px, profilbild 1000 px |

Webbikonerna ligger i `docs/assets/` (`favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`) och `docs/site.webmanifest`.

## Sociala medier (`brand/sociala-medier/`)

Vit logga på mörk bakgrund med de svävande glasen. Byggs med `python3 scripts/brand-social.py`.

| Fil | Var |
|---|---|
| `profilbild-1080.png` | Profilbild på Instagram, Facebook, LinkedIn, TikTok, X och YouTube. Fungerar i rund ram |
| `facebook-omslag-1640x624.png` | Omslagsbild på Facebook |
| `linkedin-omslag-1584x396.png` | Omslag för en personlig LinkedIn-profil |
| `linkedin-foretag-omslag-1128x191.png` | Omslag för LinkedIn-företagssida |
| `x-omslag-1500x500.png` | Omslag på X |
| `youtube-omslag-2560x1440.png` | Kanalbild på YouTube. Loggan ligger i den del som syns på alla skärmar |
| `instagram-inlagg-1080x1080.png` | Första inlägget eller fäst inlägg |
| `instagram-inlagg-bild-1080x1350.png` | Inlägg i stående format, med glasen bakom |
| `instagram-story-1080x1920.png` | Story eller höjdpunkt |
| `delningsbild-1200x630.png` | Bilden som visas när någon delar en länk till sajten (används i `docs/assets/delningsbild.png`) |

Skriptet skapar också `SKAL-CO-logotyp-och-sociala-medier.zip` med allt samlat. Den sparas inte i git.

## Regler

- **Mörk bakgrund:** ljust bläck `#eee5d6`, guld `#c49a5e`. **Ljus bakgrund:** mörkt bläck `#22201d`, guld `#765c2f`.
- Under cirka 48 px används den enkla ikonen, inte det detaljerade glaset. Detaljerna försvinner annars.
- Ge loggan luft: minst valvets halva bredd runt om.
- Texten är omvandlad till vektorformer, så filerna kräver inga typsnitt.

## Ändra eller bygga om

```bash
python3 scripts/brand.py       # SVG-filerna från ritningen
python3 scripts/brand-png.py   # PNG-filer och webbikoner
```

Ritningen (valv, glas, färger, avstånd) finns i `scripts/brand.py`. Koncepten som ledde fram till loggan ligger i `koncept*.html` och `koncept*.png`.

## Typsnitt

`typsnitt/` innehåller Fraunces (300 och 400) och IBM Plex Mono (400). Båda har licensen SIL Open Font License 1.1, som tillåter att de används och delas, även kommersiellt.
