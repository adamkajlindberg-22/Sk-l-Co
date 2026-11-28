"""Engelska: knappen byter språk, valet sparas, svenska återställs exakt och inga svenska meningar blir kvar."""
import os, re
from playwright.sync_api import sync_playwright

B = "http://localhost:8765/"
# Svenska småord som inte ska synas i engelsk text (egennamn som Kupa och Näsa är okej)
SV = re.compile(r"\b(och|för|inte|är|du|vi|med|eller|till|på|av|som|glaset|glasen)\b")
VIEWS = ["hem", "handla", "glasguiden", "upptack", "glasvaggen", "dukning", "barstudion", "provladan", "present", "glasskap", "journal", "om", "varumarken", "villkor"]
errs = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get("CHROME") or None)
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.add_init_script("localStorage.setItem('skal-consent','no')")
    pg.goto(B + "handla/", wait_until="networkidle")
    sv = pg.inner_text("main")
    pg.click(".nav-tools [data-lang]"); pg.wait_for_timeout(800)
    assert pg.evaluate("document.documentElement.lang") == "en"
    assert pg.inner_text(".nav-tools [data-lang]") == "SV"
    assert "Shop" in pg.title(), pg.title()
    leftovers = []
    for v in VIEWS:
        pg.evaluate(f"location.hash='{v}'"); pg.wait_for_timeout(400)
        txt = pg.inner_text(f"[data-view='{v}']")
        for line in txt.split("\n"):
            if SV.search(line) and not re.search(r"@|SKÅL & CO AB", line):
                leftovers.append((v, line[:90]))
    pg.evaluate("location.hash='p-bourgogne'"); pg.wait_for_timeout(500)
    assert "Add to cart" in pg.inner_text("#modal"), "produktsidan är inte översatt"
    pg.keyboard.press("Escape")
    # Valet sparas
    pg.goto(B + "handla/", wait_until="networkidle"); pg.wait_for_timeout(600)
    assert pg.evaluate("document.documentElement.lang") == "en" and "Shop your way." in pg.inner_text("main")
    # Tillbaka till svenska blir exakt som förut
    pg.click(".nav-tools [data-lang]"); pg.wait_for_timeout(500)
    assert pg.inner_text("main") == sv, "svenska återställdes inte exakt"
    assert pg.evaluate("document.documentElement.lang") == "sv"
    print("språk ok", len(leftovers), "svenska rader kvar", leftovers[:8], errs)
    assert not leftovers, leftovers
    assert not errs, errs
    b.close()
