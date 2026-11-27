"""Riktiga adresser: direkt inladdning, klick utan omladdning, bakåt, gamla #-länkar och 404."""
import os
from playwright.sync_api import sync_playwright

B = "http://localhost:8765/"
errs = []

def check(cond, msg):
    if not cond:
        raise AssertionError(msg)

def visible_view(pg):
    return pg.evaluate("document.querySelector('[data-view]:not([hidden])').dataset.view")

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get("CHROME") or None)
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("response", lambda r: errs.append("404 " + r.url) if r.status == 404 and r.url.startswith(B) else None)
    pg.add_init_script("try{localStorage.setItem('skal-consent','no')}catch(e){}")

    # Direkt till en undersida: rätt vy, rätt titel, stilmallen laddad
    pg.goto(B + "handla/", wait_until="networkidle")
    check(visible_view(pg) == "handla", "handla visas inte")
    check("Handla" in pg.title(), pg.title())
    check(pg.evaluate("getComputedStyle(document.body).backgroundColor") != "rgba(0, 0, 0, 0)", "CSS saknas")
    check(pg.evaluate("document.querySelectorAll('#products [data-open]').length") > 0, "inga produkter")

    # Klick i menyn byter sida utan omladdning
    pg.evaluate("window.__still=1")
    pg.click(".nav-links a[href='glasguiden/']")
    pg.wait_for_timeout(300)
    check(pg.url == B + "glasguiden/", pg.url)
    check(pg.evaluate("window.__still") == 1, "sidan laddades om")
    check(visible_view(pg) == "glasguiden", "glasguiden visas inte")
    check(pg.get_attribute(".nav-links a[href='glasguiden/']", "aria-current") == "page", "aria-current saknas")

    # Bakåt
    pg.go_back(); pg.wait_for_timeout(300)
    check(pg.url == B + "handla/" and visible_view(pg) == "handla", "bakåt fungerar inte: " + pg.url)

    # Produkt från ett kort, stäng tillbaka till handla
    pg.click("#products [data-open]")
    pg.wait_for_timeout(500)
    check("/glas/" in pg.url, "produktadress saknas: " + pg.url)
    check(pg.evaluate("document.querySelector('#modal').classList.contains('open')"), "produkten öppnades inte")
    pg.keyboard.press("Escape"); pg.wait_for_timeout(400)
    check(pg.url == B + "handla/", "stängd produkt gav " + pg.url)
    check(pg.evaluate("window.__still") == 1, "sidan laddades om")

    # Bilder och filer laddas från rätt adress även efter sidbyten
    for v in ["hem", "glasvaggen", "barstudion", "glasskap", "journal"]:
        pg.evaluate(f"document.querySelector('a[href=\\'{'./' if v == 'hem' else v + '/'}\\']').click()"); pg.wait_for_timeout(500)
    pg.evaluate("window.scrollTo(0,document.body.scrollHeight)"); pg.wait_for_timeout(600)
    pg.goto(B + "handla/", wait_until="networkidle"); pg.evaluate("window.__still=1")

    # Hoppa till innehållet stannar på sidan
    pg.focus(".skip"); pg.keyboard.press("Enter"); pg.wait_for_timeout(200)
    check(pg.url.startswith(B + "handla/") and pg.evaluate("window.__still") == 1, "skip-länken lämnade sidan: " + pg.url)

    # Direkt till en produkt
    pg.goto(B + "glas/bourgogne/", wait_until="networkidle")
    check(pg.evaluate("document.querySelector('#modal').classList.contains('open')"), "produktsidan öppnades inte")
    check("Kupa Bourgogne" in pg.title(), pg.title())
    pg.keyboard.press("Escape"); pg.wait_for_timeout(300)
    check(pg.url == B and visible_view(pg) == "hem", "stängd direktprodukt gav " + pg.url)

    # Gamla #-adresser flyttas
    pg.goto("about:blank"); pg.goto(B + "#handla", wait_until="networkidle"); pg.wait_for_timeout(300)
    check(pg.url == B + "handla/" and visible_view(pg) == "handla", "#handla gav " + pg.url)
    pg.goto("about:blank"); pg.goto(B + "#p-perla", wait_until="networkidle"); pg.wait_for_timeout(300)
    check(pg.url == B + "glas/perla/", "#p-perla gav " + pg.url)

    # Privata länkar har kvar #
    pg.goto("about:blank"); pg.goto(B + "#tillsammans", wait_until="networkidle"); pg.wait_for_timeout(300)
    check(pg.url == B + "#tillsammans" and visible_view(pg) == "upptack", "#tillsammans gav " + pg.url)

    # Kategorisidor: filtret sätts av adressen och adressen följer filtret
    pg.goto(B + "handla/vinglas/", wait_until="networkidle")
    check(visible_view(pg) == "handla" and "Vinglas" in pg.title(), "kategorisidan: " + pg.title())
    check("Vinglas" in pg.inner_text("#shopTitle"), pg.inner_text("#shopTitle"))
    pg.click("#activeF [data-fx]"); pg.wait_for_timeout(300)
    check(pg.url == B + "handla/", "filter bort gav " + pg.url)
    pg.goto(B, wait_until="networkidle")
    pg.click("#cats a[href='handla/whiskyglas/']"); pg.wait_for_timeout(400)
    check(pg.url == B + "handla/whiskyglas/" and "Whisky" in pg.inner_text("#shopTitle"), "kategorikort gav " + pg.url)

    # Mobil: menyn byter sida
    m = b.new_page(viewport={"width": 390, "height": 844})
    m.on("pageerror", lambda e: errs.append(str(e)))
    m.goto(B + "om/", wait_until="networkidle")
    m.click("#menuBtn"); m.wait_for_timeout(700)
    m.click(".mmenu a[href='dukning/']"); m.wait_for_timeout(500)
    check(m.url == B + "dukning/" and visible_view(m) == "dukning", "mobilmenyn gav " + m.url)

    print("adresser ok", errs)
    check(not errs, errs)
    b.close()
