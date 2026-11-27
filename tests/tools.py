"""Glass Match och Presentguiden: bara riktiga glas, budgeten hålls, allt går att lägga i varukorgen."""
import os, re
from playwright.sync_api import sync_playwright

B = "http://localhost:8765/"
errs = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get("CHROME") or None)
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.add_init_script("localStorage.setItem('skal-consent','no');localStorage.removeItem('skal-cart')")
    pg.goto(B + "handla/", wait_until="networkidle")
    names = set(pg.evaluate("[...document.querySelectorAll('#products h3')].map(h=>h.textContent)"))

    # Glass Match: max fyra, skillnader i ord, lägg alla
    for i in range(5):
        pg.locator("#products [data-cmp]").nth(i).dispatch_event("click")
    assert pg.inner_text("#cmpTxt") == "4 av 4 valda", pg.inner_text("#cmpTxt")
    pg.click("#cmpGo"); pg.wait_for_timeout(400)
    cols = pg.evaluate("[...document.querySelectorAll('.cmptable thead b')].map(b=>b.textContent)")
    assert len(cols) == 4 and set(cols) <= names, cols
    notes = pg.locator(".match-notes li").all_inner_texts()
    assert notes and all(any(n in t for n in cols) or t.startswith("Alla") for t in notes), notes
    assert "rott" not in " ".join(notes), notes
    pg.check("#cmpOnly")
    assert pg.evaluate("[...document.querySelectorAll('.cmptable tr.same')].every(r=>getComputedStyle(r).display==='none')")
    pg.click("[data-addall]"); pg.wait_for_timeout(200)
    assert pg.inner_text("#badge") == "4", pg.inner_text("#badge")
    pg.keyboard.press("Escape")
    pg.click("#cmpClear"); assert pg.inner_text("#cmpTxt") == "0 av 4 valda"

    # Presentguiden: alla kombinationer ger glas ur katalogen inom budget
    pg.goto(B + "present/", wait_until="networkidle")
    opts = lambda sel: pg.evaluate(f"[...document.querySelectorAll('{sel} option')].map(o=>o.value)")
    checked = 0
    for who in opts("#gWho"):
        for occ in opts("#gOcc"):
            for bud in opts("#gBud"):
                for mode in ["en", "set"]:
                    pg.select_option("#gWho", who); pg.select_option("#gOcc", occ); pg.select_option("#gBud", bud); pg.select_option("#gSet", mode)
                    res = pg.evaluate("""()=>{const r=document.querySelector('#gRes');
                      const g=[...r.querySelectorAll('.g')].map(x=>({n:x.querySelector('b').textContent,pr:+x.querySelector('div').childNodes[1].textContent.replace(/\\D/g,'')}));
                      const s=[...r.querySelectorAll('.g-set')].map(x=>({ids:x.querySelector('[data-addall]').dataset.addall.split(','),sum:+x.querySelector('.g-set-foot b').textContent.replace(/\\D/g,'')}));
                      return {g,s,txt:r.textContent}}""")
                    for it in res["g"]:
                        assert it["n"] in names and it["pr"] <= int(bud), (who, occ, bud, it)
                    for st in res["s"]:
                        assert 2 <= len(st["ids"]) <= 3 and st["sum"] <= int(bud), (who, occ, bud, st)
                    assert res["g"] or res["s"] or "budget" in res["txt"].lower(), (who, occ, bud, mode, res["txt"])
                    checked += 1
    pg.select_option("#gWho", "vin"); pg.select_option("#gOcc", "brollop"); pg.select_option("#gBud", "3000"); pg.select_option("#gSet", "set")
    ids = pg.get_attribute("#gRes [data-addall]", "data-addall").split(",")
    before = int(pg.inner_text("#badge") or 0)
    pg.click("#gRes [data-addall]"); pg.wait_for_timeout(200)
    assert int(pg.inner_text("#badge")) == before + len(ids)
    print("verktyg ok", checked, "presentval", errs)
    assert not errs, errs
    b.close()
