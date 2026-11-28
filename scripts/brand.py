"""Bygger SKÅL & CO:s logofiler från en och samma ritning (logotypen "Rent valv").
Texten görs om till vektorformer, så filerna ser likadana ut utan typsnitt installerade.
Kräver: pip install fonttools, och typsnitten i brand/typsnitt/ (Fraunces 300 och 400, IBM Plex Mono 400).
Kör: python3 scripts/brand.py   (PNG-filerna görs av scripts/brand-png.py)"""
import os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = os.path.join(os.path.dirname(__file__), "..")
FONTS = os.path.join(ROOT, "brand", "typsnitt")
OUT = os.path.join(ROOT, "brand", "logo")
os.makedirs(OUT, exist_ok=True)

THEMES = {
    # för mörk bakgrund: ljust bläck, guld
    "mork": {"ink": "#eee5d6", "acc": "#c49a5e", "edge": "rgba(238,229,214,.92)", "thin": "rgba(238,229,214,.35)", "bg": "#141110"},
    # för ljus bakgrund: mörkt bläck, mörkare guld för kontrast
    "ljus": {"ink": "#22201d", "acc": "#765c2f", "edge": "rgba(34,32,29,.92)", "thin": "rgba(34,32,29,.3)", "bg": "#f3eee6"},
}

_fonts = {}
def font(name):
    if name not in _fonts:
        f = TTFont(os.path.join(FONTS, name))
        _fonts[name] = (f, f.getGlyphSet(), f.getBestCmap(), f["hmtx"], f["head"].unitsPerEm)
    return _fonts[name]

def text_path(name, text, size, spacing_em, x, y, anchor="middle"):
    """Ger (svg-path, bredd). x,y är baslinjen; anchor middle centrerar."""
    f, gs, cmap, hmtx, upm = font(name)
    s = size / upm
    adv = []
    for ch in text:
        g = cmap[ord(ch)]
        adv.append((g, hmtx[g][0] * s))
    width = sum(a for _, a in adv) + spacing_em * size * (len(adv) - 1)
    cx = x - width / 2 if anchor == "middle" else x
    parts = []
    for g, a in adv:
        pen = SVGPathPen(gs)
        gs[g].draw(TransformPen(pen, (s, 0, 0, -s, cx, y)))
        d = pen.getCommands()
        if d: parts.append(d)
        cx += a + spacing_em * size
    return " ".join(parts), width

def fmt(n): return f"{n:.2f}".rstrip("0").rstrip(".")

def wordmark(x, y, size, t):
    """SKÅL & CO med & i guld och lättare vikt. Returnerar (svg, bredd)."""
    sp = 0.2
    a, wa = text_path("fraunces-400.ttf", "SKÅL", size, sp, 0, 0, "start")
    b, wb = text_path("fraunces-300.ttf", "&", size, 0, 0, 0, "start")
    c, wc = text_path("fraunces-400.ttf", "CO", size, sp, 0, 0, "start")
    gap = sp * size + size * 0.26   # bokstavsavstånd plus mellanslag
    total = wa + gap + wb + gap + wc
    x0 = x - total / 2
    svg = (f'<path transform="translate({fmt(x0)} {fmt(y)})" fill="{t["ink"]}" d="{a}"/>'
           f'<path transform="translate({fmt(x0 + wa + gap)} {fmt(y)})" fill="{t["acc"]}" d="{b}"/>'
           f'<path transform="translate({fmt(x0 + wa + gap + wb + gap)} {fmt(y)})" fill="{t["ink"]}" d="{c}"/>')
    return svg, total

def tagline(x, y, size, t):
    d, w = text_path("plexmono-400.ttf", "GLAS · KOPPAR · KARAFFER", size, 0.32, x, y)
    return f'<path fill="{t["ink"]}" fill-opacity=".72" d="{d}"/>', w

def defs(t, p):
    """Toningar för glas och dryck. p = unikt prefix."""
    return f'''<defs>
<linearGradient id="{p}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1d396"/><stop offset=".5" stop-color="#d4a253"/><stop offset="1" stop-color="#9a6a2a"/></linearGradient>
<linearGradient id="{p}y" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f6e0ad"/><stop offset=".5" stop-color="#fff4d6"/><stop offset="1" stop-color="#e8c685"/></linearGradient>
<linearGradient id="{p}r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
</defs>'''

def glass(t, p):
    """Tulpanglaset i detaljerad version. Mittlinje x=0, kant y=0, fot y=96."""
    e, th = t["edge"], t["thin"]
    return f'''<path d="M-30 0 C-33 44 -18 60 0 60 C18 60 33 44 30 0 Z" fill="#fff" fill-opacity=".06"/>
<path d="M-30.4 24 C-29 50 -15 58.5 0 58.5 C15 58.5 29 50 30.4 24 Z" fill="url(#{p}d)"/>
<ellipse cx="0" cy="24" rx="30.4" ry="4.4" fill="url(#{p}y)"/>
<ellipse cx="-9" cy="23.4" rx="10" ry="1.2" fill="#fff" opacity=".6"/>
<g fill="#fff6dc" opacity=".75"><circle cx="-4" cy="52" r="1.2"/><circle cx="-1" cy="45" r=".9"/><circle cx="-5" cy="38" r=".8"/><circle cx="5" cy="53" r="1"/><circle cx="7" cy="45" r=".7"/></g>
<g fill="none" stroke-linecap="round" stroke-linejoin="round">
<ellipse cx="0" cy="0" rx="30" ry="4.6" stroke="{e}" stroke-width="2"/>
<path d="M-30 0 C-33 44 -18 60 0 60 C18 60 33 44 30 0" stroke="{e}" stroke-width="2.4"/>
<path d="M-27.6 2.6 C-30 42 -16.6 57 0 57 C16.6 57 30 42 27.6 2.6" stroke="{th}" stroke-width="1"/>
</g>
<path d="M-24 6 C-25 24 -22 38 -15 48" stroke="url(#{p}r)" stroke-width="2.6" fill="none" stroke-linecap="round"/>
<path d="M24 8 C24.5 18 23 26 20 32" stroke="#fff" stroke-opacity=".5" stroke-width="1.4" fill="none" stroke-linecap="round"/>
<path d="M-2.2 59 C-1 70 -1.2 82 -1.4 92 L1.4 92 C1.2 82 1 70 2.2 59 Z" fill="#fff" fill-opacity=".25" stroke="{e}" stroke-width="1.3"/>
<ellipse cx="0" cy="95" rx="18" ry="3.4" fill="#fff" fill-opacity=".06" stroke="{e}" stroke-width="1.8"/>'''

def mark(t, p):
    """Valvet med glaset. Ritad i 200x220."""
    return f'<path d="M40 206 V92 A60 60 0 0 1 160 92 V206 Z" fill="none" stroke="{t["ink"]}" stroke-width="3"/><g transform="translate(100 92) scale(1.06)">{glass(t, p)}</g>'

def icon(t, bg=None, radius=0, pad=1.0):
    """Enkel ikon för små storlekar (favicon, app). Ritad i 100x100. pad < 1 ger luft runt ikonen i en ruta."""
    b = f'<rect width="100" height="100" rx="{radius}" fill="{bg}"/>' if bg else ""
    i, a = t["ink"], t["acc"]
    g = f'<g transform="translate({fmt(50 - 50 * pad)} {fmt(50 - 52 * pad)}) scale({pad})">' if pad != 1 else "<g>"
    return (f'{b}{g}<path d="M20 94 V44 A30 30 0 0 1 80 44 V94 Z" fill="none" stroke="{i}" stroke-width="5.5"/>'
            f'<g fill="none" stroke="{i}" stroke-width="5" stroke-linecap="round"><path d="M35 36 C34 60 42 67 50 67 C58 67 66 60 65 36"/><path d="M50 67 V83"/><path d="M41 86 H59"/></g>'
            f'<path d="M35.4 49 H64.6 C63.5 60 57 65.5 50 65.5 C43 65.5 36.5 60 35.4 49 Z" fill="{a}"/></g>')

def write(name, w, h, body, title):
    title = title.replace("&", "&amp;")
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(w)} {fmt(h)}" width="{fmt(w)}" height="{fmt(h)}" role="img" aria-label="{title}">'
           f'<title>{title}</title>{body}</svg>\n')
    open(os.path.join(OUT, name), "w").write(svg)

for key, t in THEMES.items():
    p = "s" + key[0]
    # Staplad: valv, namn, rad under
    W = 440
    name_svg, nw = wordmark(W / 2, 520, 56, t)
    tag_svg, tw = tagline(W / 2, 566, 17, t)
    W = max(W, nw + 40, tw + 40)
    name_svg, _ = wordmark(W / 2, 520, 56, t)
    tag_svg, _ = tagline(W / 2, 566, 17, t)
    body = defs(t, p) + f'<g transform="translate({fmt(W / 2 - 200)} 0) scale(2)">{mark(t, p)}</g>' + name_svg + tag_svg
    write(f"skalco-staplad-{key}.svg", W, 584, body, "SKÅL & CO")
    # Liggande: enkel ikon och namn, för menyrad och e-post
    name_svg, nw = wordmark(0, 0, 40, t)
    H = 64
    body = f'<g transform="scale(.64)">{icon(t)}</g>' + wordmark(64 + 20 + nw / 2, 46, 40, t)[0]
    write(f"skalco-liggande-{key}.svg", 64 + 20 + nw + 4, H, body, "SKÅL & CO")
    # Märket ensamt, detaljerat
    write(f"skalco-mark-{key}.svg", 200, 220, defs(t, p + "m") + mark(t, p + "m"), "SKÅL & CO")
    # Enkel ikon, transparent
    write(f"skalco-ikon-{key}.svg", 100, 100, icon(t), "SKÅL & CO")

# App-ikon och favicon: mörk ruta, ljust valv, guld dryck
write("skalco-app.svg", 100, 100, icon(THEMES["mork"], "#141110", 22, .74), "SKÅL & CO")
write("favicon.svg", 100, 100, icon(THEMES["mork"], "#141110", 20, .86), "SKÅL & CO")
print("Klart:", sorted(os.listdir(OUT)))
