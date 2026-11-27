# Delade listor, röstning på dukning, glassommelieren och påminnelser, med låtsas-Firebase. Kräver: npm run dev.
from playwright.sync_api import sync_playwright
import json
import os
os.makedirs("tests/out",exist_ok=True)
FAKE=open(os.path.join(os.path.dirname(__file__),'fake-firebase.js')).read()
U="window.__fuser={uid:'u1',displayName:'Adam Lindberg',email:'a@x.se',emailVerified:true,providerData:[{providerId:'google.com'}]};"
BASE="localStorage.setItem('skal-consent','{\"stat\":false,\"ts\":1}');navigator.share=undefined;"
def ctx(b,init,w=1440,h=900):
    c=b.new_context(viewport={'width':w,'height':h});c.add_init_script(BASE+init)
    c.route("https://www.gstatic.com/**",lambda r:r.fulfill(status=200,content_type="application/javascript",body=FAKE));return c
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=os.environ.get("CHROME") or None)
    pg=ctx(b,U).new_page();errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8765/#tillsammans');pg.wait_for_timeout(1000)
    pg.fill('#gName','Bröllopet');pg.click('[data-gtheme="middag"]');pg.click('#gNew .btn-primary');pg.wait_for_timeout(1000)
    code=pg.evaluate("location.hash")[5:]
    pg.evaluate(f"window.__fset('rum/{code}/folk/u2',{{name:'Sara Berg',ts:1,votes:{{bourgogne:1,vitvin:2}}}})")
    for k in ["yes","save","no"]: pg.click(f'[data-sw="{k}"]');pg.wait_for_timeout(330)
    pg.wait_for_timeout(300);pg.screenshot(path='tests/out/shared-group.png')
    pg.click('[data-gremind="u2"]');pg.wait_for_timeout(300)
    print("paminn",pg.evaluate(f"JSON.stringify(window.__fdb.data.rum['{code}'].paminn)"))
    pg.click('[data-glist]');pg.wait_for_timeout(600)
    st=json.loads(pg.evaluate("localStorage.getItem('skal-glasskap-v1')"));L=[l for l in st['lists'] if l.get('pub')][0];print("lista",L)
    pg.evaluate(f"window.__fset('listor/{L['pub']}/kopt/vitvin',{{name:'Moster Eva',ts:1}})")
    pg.goto(f"http://localhost:8765/#lista-{L['pub']}");pg.wait_for_timeout(800);pg.screenshot(path='tests/out/shared-lista.png',full_page=True)
    pg.goto('http://localhost:8765/#dukning');pg.wait_for_timeout(600);pg.click('#tShare');pg.wait_for_timeout(800)
    bid=pg.evaluate("location.hash")[6:];print("bord",bid)
    pg.evaluate(f"window.__fset('bord/{bid}/rost/u2',{{name:'Sara',v:-1,c:'Ta coupe i stället för flöjt',ts:2}})");pg.wait_for_timeout(300)
    pg.screenshot(path='tests/out/shared-bord.png')
    pg.goto('http://localhost:8765/#glasguiden');pg.wait_for_timeout(400)
    for a in ["rott","whisky","#fNext","middag","#fNext","#fSkip","#fSkip","300","6"]:
        pg.click(a if a.startswith("#") else f"[data-fa='{a}']");pg.wait_for_timeout(120)
    pg.click('#concBtn');pg.wait_for_timeout(400);pg.click('#sugg button');pg.wait_for_timeout(900);pg.screenshot(path='tests/out/shared-somm.png')
    pg.goto('http://localhost:8765/#glasskap');pg.wait_for_timeout(500);pg.click('#gk [data-gtab="sparat"]');pg.wait_for_timeout(600);pg.screenshot(path='tests/out/shared-gk.png',full_page=True)
    print("ägare",errs);assert not errs
    # gäst utan konto
    seed={"listor":{L['pub']:pg.evaluate(f"window.__fdb.data.listor['{L['pub']}']")}}
    g=ctx(b,"window.__fdb={data:"+json.dumps(seed)+",subs:[]};",390,844).new_page();e2=[];g.on("pageerror",lambda e:e2.append(str(e)))
    g.goto(f"http://localhost:8765/#lista-{L['pub']}");g.wait_for_timeout(900)
    g.click('[data-lvbuy]');g.fill('#lvName','Kusin Ola');g.click('#lvForm .btn-primary');g.wait_for_timeout(500)
    g.screenshot(path='tests/out/shared-gast.png',full_page=True);print("gäst",e2,g.evaluate(f"JSON.stringify(window.__fdb.data.listor['{L['pub']}'].kopt)"))
    # notis: alla klara
    room={"meta":{"host":"u2","hostName":"Sara","name":"Julbordet","theme":"bar","deck":["whisky","nora"],"ts":1},"folk":{"u1":{"name":"Adam","votes":{"whisky":1,"nora":1}},"u2":{"name":"Sara","votes":{"whisky":1,"nora":-1}}}}
    n=ctx(b,U+"window.__fdb={data:{rum:{QWERTY:"+json.dumps(room)+"}},subs:[]};localStorage.setItem('skal-glasskap-v1',JSON.stringify({ts:1,rooms:[{code:'QWERTY',name:'Julbordet',theme:'bar',ts:1}]}))").new_page()
    n.goto('http://localhost:8765/#handla');n.wait_for_timeout(3500);n.screenshot(path='tests/out/shared-notis.png');assert 'klara' in n.inner_text('#notis');print('notis ok')
    b.close()
