"""Shopify-kopplingen mot en låtsasbutik: priser och lager från Shopify, kassan går till Shopify."""
import json, os
from playwright.sync_api import sync_playwright

B = "http://localhost:8765/"
SRC = open("docs/assets/site.js").read().replace('const SHOPIFY={domain:"",token:"",', 'const SHOPIFY={domain:"test.myshopify.com",token:"publik-test",', 1)
assert "test.myshopify.com" in SRC, "SHOPIFY-raden har ändrats, uppdatera testet"
sent = []

def node(handle, price, avail=True, was=None):
    return {"handle": handle, "availableForSale": avail, "variants": {"nodes": [{"id": "gid://shopify/ProductVariant/" + handle,
            "availableForSale": avail, "price": {"amount": str(price), "currencyCode": "SEK"}, "compareAtPrice": {"amount": str(was)} if was else None}]}}

def api(route):
    body = json.loads(route.request.post_data)
    assert route.request.headers.get("x-shopify-storefront-access-token") == "publik-test"
    if "cartCreate" in body["query"]:
        sent.append(body["variables"]["input"])
        data = {"cartCreate": {"cart": {"checkoutUrl": "https://test.myshopify.com/cart/c/abc"}, "userErrors": []}}
    else:
        nodes = [node("bourgogne", 749, was=799), node("karaff", 899, avail=False), node("perla", 499)]
        data = {"products": {"pageInfo": {"hasNextPage": False, "endCursor": None}, "nodes": nodes}}
    route.fulfill(status=200, content_type="application/json", body=json.dumps({"data": data}))

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get("CHROME") or None)
    pg = b.new_page(); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.add_init_script("localStorage.setItem('skal-consent','no');localStorage.removeItem('skal-cart')")
    pg.route("**/assets/site.js*", lambda r: r.fulfill(status=200, content_type="application/javascript", body=SRC))
    pg.route("https://test.myshopify.com/api/**", api)
    pg.route("https://test.myshopify.com/cart/**", lambda r: r.fulfill(status=200, content_type="text/html", body="<title>Shopify kassa</title>"))

    pg.goto(B + "glas/bourgogne/", wait_until="networkidle"); pg.wait_for_timeout(400)
    txt = pg.inner_text("#modal")
    assert "749" in txt, "priset från Shopify syns inte"
    pg.click("#pAdd"); pg.keyboard.press("Escape"); pg.wait_for_timeout(300)

    # Slut i Shopify och glas som saknas i Shopify går inte att lägga i varukorgen
    pg.evaluate("location.hash='p-karaff'"); pg.wait_for_timeout(400)
    assert "Slut just nu" in pg.inner_text("#modal"), "slutsålt syns inte"
    pg.click("#pAdd"); pg.keyboard.press("Escape"); pg.wait_for_timeout(300)
    assert pg.evaluate("JSON.parse(localStorage.getItem('skal-cart')).length") == 1, "slutsålt hamnade i varukorgen"

    pg.click("#cartBtn"); pg.wait_for_timeout(300)
    assert "749" in pg.inner_text("#total"), pg.inner_text("#total")
    with pg.expect_navigation(url="https://test.myshopify.com/cart/c/abc"):
        pg.click("#checkout")
    lines = sent[0]["lines"]
    assert lines[0]["merchandiseId"].endswith("/bourgogne") and lines[0]["quantity"] == 1, lines
    print("shopify ok", lines, errs)
    assert not errs, errs
    b.close()
