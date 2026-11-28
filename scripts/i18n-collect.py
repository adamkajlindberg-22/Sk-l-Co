"""Samlar alla svenska texter som sajten visar, så att de kan översättas.
Går igenom alla sidor, produkter, verktyg och rutor och fångar varje text som någon gång syns.
Skriver i18n/samlat.json. Kräver npm run dev. Kör: python3 scripts/i18n-collect.py"""
import json, os
from playwright.sync_api import sync_playwright

B = "http://localhost:8765/"
CAPTURE = r"""
(()=>{window.__T=new Set();const A=["placeholder","aria-label","title","alt"];
const add=s=>{s=(s||"").replace(/\s+/g," ").trim();if(s&&/[A-Za-zÅÄÖåäö]/.test(s))window.__T.add(s)};
const walk=n=>{if(n.nodeType===3){const p=n.parentElement;if(p&&!/^(SCRIPT|STYLE|NOSCRIPT)$/.test(p.tagName))add(n.nodeValue);return}
 if(n.nodeType!==1)return;A.forEach(a=>n.hasAttribute&&n.hasAttribute(a)&&add(n.getAttribute(a)));
 if(n.tagName==="OPTION")add(n.textContent);n.childNodes.forEach(walk)};
const go=()=>{walk(document.body);new MutationObserver(ms=>ms.forEach(m=>{if(m.type==="characterData")walk(m.target);else if(m.type==="attributes")A.includes(m.attributeName)&&add(m.target.getAttribute(m.attributeName));else m.addedNodes.forEach(walk)})).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:A})};
if(document.body)go();else addEventListener("DOMContentLoaded",go);
const t0=document.title;window.__titles=new Set([t0]);setInterval(()=>window.__titles.add(document.title),200)})();
"""

def run(pg, js, wait=350):
    try:
        pg.evaluate(js); pg.wait_for_timeout(wait)
    except Exception as e:
        print("hoppar:", js[:60], str(e)[:80])

def click(pg, sel, wait=250):
    try:
        if pg.locator(sel).count():
            pg.locator(sel).first.click(timeout=2000); pg.wait_for_timeout(wait)
    except Exception as e:
        print("hoppar klick:", sel, str(e)[:60])

texts, titles = set(), set()
with sync_playwright() as p:
    b = p.chromium.launch()
    for vp, skin in [({"width": 1440, "height": 900}, "dark"), ({"width": 390, "height": 844}, "light")]:
        pg = b.new_page(viewport=vp)
        pg.add_init_script(CAPTURE)
        pg.add_init_script(f"localStorage.setItem('skal-skin','{skin}')")
        pg.goto(B, wait_until="networkidle"); pg.wait_for_timeout(800)
        # samtycke
        click(pg, "[data-consent='no']")
        views = pg.evaluate("[...document.querySelectorAll('[data-view]')].map(v=>v.dataset.view)")
        for v in views:
            run(pg, f"location.hash='{v}'", 500)
            run(pg, "window.scrollTo(0,document.body.scrollHeight)", 600)
        ids = pg.evaluate("[...new Set([...document.querySelectorAll('[data-open]')].map(e=>e.dataset.open))]")
        for i in ids:
            run(pg, f"location.hash='p-{i}'", 500)
            for t in ["Form och storlek", "3D"]:
                click(pg, f"#modal button:has-text('{t}')", 400)
            click(pg, "#modal [data-light='day'], #modal button:has-text('Dagsljus')")
            pg.keyboard.press("Escape"); pg.wait_for_timeout(200)
        # varukorg och kassa
        run(pg, "location.hash='handla'")
        for k in range(3):
            click(pg, f"#products [data-add] >> nth={k}")
        click(pg, "#cartBtn", 400); click(pg, "[data-q$='~1']"); click(pg, "[data-q$='~-1']")
        click(pg, "#checkout", 600)
        click(pg, "#coForm button[type=submit], #coForm .btn-primary", 800)
        pg.keyboard.press("Escape")
        # filter, sortering, jämför
        for fk in ["dryck", "tillfalle", "stil", "egenskap", "niva", "volym", "antal"]:
            click(pg, f"[data-fk='{fk}']")
        click(pg, "[data-fclear]")
        for s in ["pop", "new", "low", "high", "rate"]:
            run(pg, f"document.querySelector('#sort').value='{s}';document.querySelector('#sort').dispatchEvent(new Event('change'))", 150)
        for k in range(3):
            run(pg, f"document.querySelectorAll('#products [data-cmp]')[{k}].click()", 100)
        click(pg, "#cmpGo", 500); click(pg, "#cmpOnly"); pg.keyboard.press("Escape"); click(pg, "#cmpClear")
        # sök
        click(pg, "#searchBtn", 400)
        for q in ["tunna vinglas under 300 kr", "whisky", "xyzq", "vinglass"]:
            try:
                pg.fill("#search input", q); pg.wait_for_timeout(400)
            except Exception: pass
        pg.keyboard.press("Escape")
        # megameny och mobilmeny
        click(pg, "#megaBtn", 400); pg.keyboard.press("Escape")
        click(pg, "#menuBtn", 400); click(pg, "#menuBtn", 300)
        # glasguiden
        run(pg, "location.hash='glasguiden'")
        for a in ["rott", "vitt", "whisky", "#fNext", "middag", "#fNext", "#fSkip", "#fSkip", "300", "4"]:
            click(pg, a if a.startswith("#") else f"[data-fa='{a}']", 150)
        for q in ["billigare", "lyx", "disk", "farg"]:
            click(pg, f"[data-fquick='{q}']", 200)
        click(pg, "[data-fswap]"); click(pg, "#fSave"); click(pg, "#fShare"); click(pg, "#fRestart")
        # glas-swipe
        run(pg, "location.hash='upptack'")
        for k in ["yes", "no", "save", "yes", "yes", "no", "yes", "save", "yes", "no", "yes", "yes", "no", "yes", "yes", "yes", "yes"]:
            click(pg, f"[data-sw='{k}']", 200)
        click(pg, "[data-swmode='group']", 400); click(pg, "[data-swmode='solo']")
        # glasväggen
        run(pg, "location.hash='glasvaggen'")
        for sel in ["#wallCats .chip", "#wallRef .chip"]:
            n = pg.locator(sel).count()
            for k in range(n):
                click(pg, f"{sel} >> nth={k}", 120)
        # dukning
        run(pg, "location.hash='dukning'")
        for grp in ["data-occ", "data-tstyle", "data-top"]:
            n = pg.locator(f"[{grp}]").count()
            for k in range(n):
                click(pg, f"[{grp}] >> nth={k}", 120)
        click(pg, "button:has-text('Ovanifrån')"); click(pg, "button:has-text('Kopiera inköpslista')")
        click(pg, "button:has-text('Spara dukning')")
        try:
            pg.fill("textarea", "åtta personer, lamm och rödvin, bubbel till förrätt"); click(pg, "button:has-text('Föreslå dukning')", 800)
        except Exception: pass
        # barstudion
        run(pg, "location.hash='barstudion'")
        n = pg.locator("#barChips .chip").count()
        for k in range(n):
            click(pg, f"#barChips .chip >> nth={k}", 150)
        click(pg, "button:has-text('Spara kitet')")
        # provlådan
        run(pg, "location.hash='provladan'")
        for k in range(4):
            run(pg, f"document.querySelectorAll('[data-trial]')[{k}]&&document.querySelectorAll('[data-trial]')[{k}].click()", 120)
        # present
        run(pg, "location.hash='present'")
        for sel in ["#gWho", "#gOcc", "#gBud", "#gSet", "#gFor", "#gStyle"]:
            for v in pg.evaluate(f"[...document.querySelectorAll('{sel} option')].map(o=>o.value)"):
                try: pg.select_option(sel, v); pg.wait_for_timeout(60)
                except Exception: pass
        click(pg, "#dateForm button")
        # journal
        run(pg, "location.hash='journal'")
        n = pg.locator("[data-art]").count()
        for k in range(n):
            click(pg, f"[data-art] >> nth={k}", 300); pg.keyboard.press("Escape")
        # glasskåp
        run(pg, "location.hash='glasskap'")
        click(pg, "[data-guest]", 500)
        for t in ["oversikt", "glas", "sparat", "kop", "konto"]:
            click(pg, f"#gk [data-gtab='{t}']", 300)
        click(pg, "button:has-text('Logga in med e-post')", 400); pg.keyboard.press("Escape")
        # villkor och ånger
        run(pg, "location.hash='villkor'")
        click(pg, "button:has-text('Ångra avtalet här'), a:has-text('Ångra avtalet här')", 500)
        pg.keyboard.press("Escape")
        click(pg, "#trackShow", 400); pg.keyboard.press("Escape")
        # glassommelieren
        click(pg, "#concBtn", 400)
        n = pg.locator("#sugg button").count()
        for k in range(n):
            click(pg, f"#sugg button >> nth={k}", 700)
        for q in ["Vilket glas till IPA?", "Present till whiskyvän under 500 kr", "Tål glasen diskmaskin?", "hej"]:
            try:
                pg.fill("#concIn", q); pg.keyboard.press("Enter"); pg.wait_for_timeout(700)
            except Exception: pass
        # nyhetsbrev
        try:
            f = pg.locator("[data-news] input").first; f.fill("x"); f.press("Enter"); pg.wait_for_timeout(300)
            f.fill("a@b.se"); f.press("Enter"); pg.wait_for_timeout(300)
        except Exception: pass
        texts |= set(pg.evaluate("[...window.__T]")); titles |= set(pg.evaluate("[...window.__titles]"))
        pg.close()
    b.close()

os.makedirs("i18n", exist_ok=True)
out = sorted(texts | {t for t in titles if t})
json.dump(out, open("i18n/samlat.json", "w"), ensure_ascii=False, indent=0)
print(len(out), "texter,", sum(len(t) for t in out), "tecken")
