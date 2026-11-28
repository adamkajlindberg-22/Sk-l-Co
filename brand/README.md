# SKÅL & CO, logotyp

Logotypen heter **Rent valv**: ett tulpanglas med gyllene dryck, utställt i ett valv, med namnet och "Glas · Koppar · Karaffer" under. Valvet är samma form som fönstren i Mitt glasskåp.

## Filer (`brand/logo/`)

| Fil | Används till |
|---|---|
| `skalco-staplad-mork.svg` / `-ljus.svg` | Huvudlogga. Valv, namn och rad under. För mörk respektive ljus bakgrund |
| `skalco-liggande-mork.svg` / `-ljus.svg` | Enkel ikon och namn på en rad. Menyrad, e-post, kvitton |
| `skalco-mark-mork.svg` / `-ljus.svg` | Valvet med det detaljerade glaset, utan text |
| `skalco-ikon-mork.svg` / `-ljus.svg` | Enkel ikon för små storlekar, utan bakgrund |
| `skalco-app.svg`, `favicon.svg` | Ikon i mörk ruta för app, favicon och profilbild |
| `png/` | Samma i PNG: logotyper 1200 px, märket 800 px, profilbild 1000 px |

Webbikonerna ligger i `docs/assets/` (`favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`) och `docs/site.webmanifest`.

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
