# Swipea tillsammans med en låtsas-Firebase (tests/fake-firebase.js). Kräver: npm run dev i ett annat fönster.
from playwright.sync_api import sync_playwright
import os
FAKE=open(os.path.join(os.path.dirname(__file__),"fake-firebase.js")).read()
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=os.environ.get("CHROME","/usr/bin/google-chrome"))
    c=b.new_context(viewport={'width':1280,'height':860})
    c.add_init_script("localStorage.setItem('skal-consent','{\"stat\":false,\"ts\":1}');window.__fuser={uid:'u1',displayName:'Test Testsson',email:'t@x.se',emailVerified:true,providerData:[{providerId:'google.com'}]};navigator.share=undefined")
    c.route("https://www.gstatic.com/**",lambda r:r.fulfill(status=200,content_type="application/javascript",body=FAKE))
    pg=c.new_page();errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto("http://localhost:8765/#tillsammans");pg.wait_for_timeout(1000)
    pg.fill("#gName","Testgrupp");pg.click('[data-gtheme="middag"]');pg.click("#gNew .btn-primary");pg.wait_for_timeout(1000)
    code=pg.evaluate("location.hash")[5:];assert len(code)==6,code
    pg.evaluate(f"window.__fset('rum/{code}/folk/u2',{{name:'Gäst Två',ts:1,votes:{{bourgogne:1,vitvin:2}}}})")
    for k in ["yes","yes","no","no","no","no"]:pg.click(f'[data-sw="{k}"]');pg.wait_for_timeout(320)
    pg.wait_for_timeout(400)
    txt=pg.inner_text("#profile");assert "alla gillar" in txt.lower(),txt
    print("grupp ok",code,errs);assert not errs
    b.close()
