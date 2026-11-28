"""Gör PNG-filer av logotyperna i brand/logo och lägger webbikonerna i docs/assets.
Kör efter scripts/brand.py: python3 scripts/brand-png.py"""
import os, json, base64
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
LOGO = os.path.join(ROOT, "brand", "logo")
PNG = os.path.join(LOGO, "png"); os.makedirs(PNG, exist_ok=True)
ASSETS = os.path.join(ROOT, "docs", "assets")

# (källa, utfil, bredd, bakgrund eller None för genomskinlig)
JOBS = [
    ("skalco-staplad-mork.svg", f"{PNG}/skalco-staplad-mork.png", 1200, None),
    ("skalco-staplad-ljus.svg", f"{PNG}/skalco-staplad-ljus.png", 1200, None),
    ("skalco-staplad-mork.svg", f"{PNG}/skalco-staplad-pa-svart.png", 1200, "#141110"),
    ("skalco-liggande-mork.svg", f"{PNG}/skalco-liggande-mork.png", 1200, None),
    ("skalco-liggande-ljus.svg", f"{PNG}/skalco-liggande-ljus.png", 1200, None),
    ("skalco-mark-mork.svg", f"{PNG}/skalco-mark-mork.png", 800, None),
    ("skalco-mark-ljus.svg", f"{PNG}/skalco-mark-ljus.png", 800, None),
    ("skalco-app.svg", f"{PNG}/skalco-app-1024.png", 1024, None),
    ("skalco-app-detalj.svg", f"{PNG}/skalco-app-detalj-1024.png", 1024, None),
    ("skalco-profil.svg", f"{PNG}/skalco-profilbild.png", 1000, None),
    ("skalco-app.svg", f"{ASSETS}/apple-touch-icon.png", 180, None),
    ("skalco-app.svg", f"{ASSETS}/icon-192.png", 192, None),
    ("skalco-app.svg", f"{ASSETS}/icon-512.png", 512, None),
    ("favicon.svg", f"{ASSETS}/favicon-32.png", 32, None),
]

with sync_playwright() as p:
    b = p.chromium.launch()
    for src, out, w, bg in JOBS:
        svg = open(os.path.join(LOGO, src)).read()
        vb = [float(x) for x in svg.split('viewBox="')[1].split('"')[0].split()]
        h = round(w * vb[3] / vb[2])
        pad = round(w * .08) if bg else 0
        pg = b.new_page(viewport={"width": w + 2 * pad, "height": h + 2 * pad})
        pg.set_content(f'<html><body style="margin:0;background:{bg or "transparent"}"><div style="padding:{pad}px">'
                       f'<img src="data:image/svg+xml;base64,{base64.b64encode(svg.encode()).decode()}" width="{w}" height="{h}" style="display:block"></div></body></html>')
        pg.wait_for_timeout(150)
        pg.screenshot(path=out, omit_background=bg is None)
        pg.close()
    b.close()

# Favicon som SVG till sajten
open(f"{ASSETS}/favicon.svg", "w").write(open(f"{LOGO}/favicon.svg").read())
json.dump({"name": "SKÅL & CO", "short_name": "SKÅL & CO", "start_url": "./", "display": "standalone",
           "background_color": "#141110", "theme_color": "#141110",
           "icons": [{"src": "assets/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable"},
                     {"src": "assets/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}]},
          open(os.path.join(ROOT, "docs", "site.webmanifest"), "w"), ensure_ascii=False, indent=1)
print("Klart:", len(JOBS), "PNG-filer")
