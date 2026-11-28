"""Bilder för sociala medier i rätt storlekar, med den vita logotypen på mörk bakgrund.
Kör efter scripts/brand.py: python3 scripts/brand-social.py. Skriver brand/sociala-medier/ och en zip-fil."""
import os, base64, zipfile
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
LOGO = os.path.join(ROOT, "brand", "logo")
OUT = os.path.join(ROOT, "brand", "sociala-medier"); os.makedirs(OUT, exist_ok=True)

def data(path, mime):
    return f"data:{mime};base64," + base64.b64encode(open(path, "rb").read()).decode()

STAPLAD = data(f"{LOGO}/skalco-staplad-vit.svg", "image/svg+xml")
LIGGANDE = data(f"{LOGO}/skalco-liggande-vit.svg", "image/svg+xml")
PROFIL = data(f"{LOGO}/skalco-profil.svg", "image/svg+xml")
HERO = data(os.path.join(ROOT, "docs", "assets", "hero-end.webp"), "image/webp")
FONT = data(os.path.join(ROOT, "brand", "typsnitt", "fraunces-300.ttf"), "font/ttf")

CSS = f"""@font-face{{font-family:F;src:url({FONT})}}
*{{margin:0;box-sizing:border-box}}
body{{width:var(--w);height:var(--h);background:#141110;overflow:hidden;position:relative;font-family:F,serif;color:#fff}}
.bg{{position:absolute;inset:0;background:url({HERO}) center/cover;opacity:.62}}
.fade{{position:absolute;inset:0;background:radial-gradient(60% 70% at 50% 50%,rgba(20,17,16,.72),rgba(20,17,16,.35))}}
.glow{{position:absolute;inset:0;background:radial-gradient(55% 60% at 50% 42%,rgba(196,154,94,.16),transparent 70%)}}
.c{{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:calc(var(--h)*.05)}}
.tag{{font-size:var(--t);letter-spacing:.04em;color:#f3e9d8;opacity:.92}}
"""

# (fil, bredd, höjd, innehåll)
def banner(logo_h, tag_size, img=True):
    return (('<div class="bg"></div><div class="fade"></div>' if img else '<div class="glow"></div>') +
            f'<div class="c"><img src="{LIGGANDE}" style="height:{logo_h}px"><div class="tag" style="--t:{tag_size}px">Rätt glas för varje skål</div></div>')
def stacked(logo_w, tag_size=None, img=False):
    t = f'<div class="tag" style="--t:{tag_size}px">Rätt glas för varje skål</div>' if tag_size else ""
    return (('<div class="bg"></div><div class="fade"></div>' if img else '<div class="glow"></div>') +
            f'<div class="c"><img src="{STAPLAD}" style="width:{logo_w}px">{t}</div>')

JOBS = [
    ("profilbild-1080.png", 1080, 1080, f'<img src="{PROFIL}" style="width:1080px;height:1080px;display:block">'),
    ("facebook-omslag-1640x624.png", 1640, 624, banner(104, 38)),
    ("linkedin-foretag-omslag-1128x191.png", 1128, 191, banner(52, 0).replace('<div class="tag" style="--t:0px">Rätt glas för varje skål</div>', "")),
    ("linkedin-omslag-1584x396.png", 1584, 396, banner(80, 30)),
    ("x-omslag-1500x500.png", 1500, 500, banner(92, 34)),
    ("youtube-omslag-2560x1440.png", 2560, 1440, banner(150, 54)),
    ("instagram-inlagg-1080x1080.png", 1080, 1080, stacked(560, 40)),
    ("instagram-inlagg-bild-1080x1350.png", 1080, 1350, stacked(560, 42, img=True)),
    ("instagram-story-1080x1920.png", 1080, 1920, stacked(640, 48, img=True)),
    ("delningsbild-1200x630.png", 1200, 630, banner(96, 36)),
]

with sync_playwright() as p:
    b = p.chromium.launch()
    for name, w, h, body in JOBS:
        pg = b.new_page(viewport={"width": w, "height": h})
        pg.set_content(f'<html><head><style>{CSS}</style></head><body style="--w:{w}px;--h:{h}px">{body}</body></html>')
        pg.wait_for_timeout(400)
        pg.screenshot(path=os.path.join(OUT, name))
        pg.close()
    b.close()

# Delningsbilden används också av sajten när någon delar en länk
import shutil
shutil.copy(os.path.join(OUT, "delningsbild-1200x630.png"), os.path.join(ROOT, "docs", "assets", "delningsbild.png"))

# Zip med allt: sociala medier, logotyper och ikoner
z = os.path.join(ROOT, "brand", "SKAL-CO-logotyp-och-sociala-medier.zip")
with zipfile.ZipFile(z, "w", zipfile.ZIP_DEFLATED) as f:
    for folder, arc in [(OUT, "sociala-medier"), (LOGO, "logotyp")]:
        for root, _, files in os.walk(folder):
            for fn in files:
                full = os.path.join(root, fn)
                f.write(full, os.path.join(arc, os.path.relpath(full, folder)))
    f.write(os.path.join(ROOT, "brand", "README.md"), "LÄS MIG.md")
print("Klart:", len(JOBS), "bilder och", os.path.relpath(z, ROOT))
