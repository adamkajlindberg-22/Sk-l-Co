import asyncio,json,collections
from playwright.async_api import async_playwright
AXE=open("node_modules/axe-core/axe.min.js").read()
VIEWS=["hem","handla","glasguiden","upptack","glasvaggen","dukning","barstudion","provladan","present","glasskap","journal","om","varumarken","villkor"]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        agg=collections.defaultdict(lambda:{"n":0,"impact":"","help":"","where":set(),"ex":[]})
        for skin in ["dark","light"]:
            pg=await b.new_page(viewport={"width":1280,"height":900})
            await pg.goto("http://localhost:8765/",wait_until="networkidle")
            await pg.evaluate(f"localStorage.setItem('skal-skin','{skin}');localStorage.setItem('skal-consent','no')")
            await pg.reload(wait_until="networkidle")
            await pg.add_script_tag(content=AXE)
            targets=[(v,f"location.hash='{v}'") for v in VIEWS]+[("pdp","location.hash='p-bourgogne'"),("search","location.hash='handla';document.querySelector('#searchBtn').click()"),("cart","document.querySelector('[data-sclose]')?.click();document.querySelector('#cartBtn').click()"),("mega","document.querySelector('[data-close]').click();location.hash='journal';document.querySelector('#megaBtn').click()")]
            for name,js in targets:
                await pg.evaluate(js);await pg.wait_for_timeout(700)
                if name=="hem": await pg.evaluate("window.scrollTo(0,document.body.scrollHeight)");await pg.wait_for_timeout(1500);
                res=await pg.evaluate("axe.run(document,{resultTypes:['violations']}).then(r=>r.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.map(n=>n.target.join(' ')+' :: '+(n.failureSummary||'').slice(0,160))})))")
                for v in res:
                    a=agg[v["id"]];a["n"]+=len(v["nodes"]);a["impact"]=v["impact"];a["help"]=v["help"];a["where"].add(f"{skin}:{name}")
                    for n in v["nodes"][:3]:
                        if len(a["ex"])<6:a["ex"].append(n)
                if name=="hem": await pg.evaluate("window.scrollTo(0,0)")
            await pg.close()
        for k,a in agg.items():
            print(f"\n## {k} [{a['impact']}] x{a['n']} :: {a['help']}\n  where: {sorted(a['where'])[:12]}")
            for e in a["ex"]: print("   -",e[:230])
        await b.close()
asyncio.run(main())
