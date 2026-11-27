import asyncio
from playwright.async_api import async_playwright
import os
os.makedirs("tests/out",exist_ok=True)
O="tests/out/legal-"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        for name,vp in [("desk",{"width":1440,"height":900}),("mob",{"width":390,"height":844})]:
            ctx=await b.new_context(viewport=vp,is_mobile=(name=="mob"),has_touch=(name=="mob"));pg=await ctx.new_page();errs=[]
            pg.on("pageerror",lambda e: errs.append(str(e)))
            await pg.goto("http://localhost:8765/",wait_until="networkidle");await pg.wait_for_timeout(500)
            await pg.screenshot(path=O+name+"-consent.png")
            await pg.click("[data-consent='yes']")
            await pg.evaluate("location.hash='villkor'");await pg.wait_for_timeout(400);await pg.screenshot(path=O+name+"-villkor.png")
            await pg.click(".legal-toc [data-lj='l-anger']");await pg.wait_for_timeout(700);await pg.screenshot(path=O+name+"-anger-sec.png")
            await pg.evaluate("location.hash='p-bourgogne'");await pg.wait_for_timeout(500);await pg.click("#pAdd");await pg.keyboard.press("Escape")
            await pg.click("#cartBtn");await pg.wait_for_timeout(300);await pg.click("#checkout");await pg.wait_for_timeout(300)
            await pg.screenshot(path=O+name+"-checkout.png")
            await pg.click("#coForm .btn-primary");await pg.wait_for_timeout(300);await pg.keyboard.press("Escape")
            await pg.evaluate("location.hash='glasskap'");await pg.wait_for_timeout(400)
            if await pg.query_selector("#gk [data-guest]"):await pg.click("#gk [data-guest]");await pg.wait_for_timeout(200)
            await pg.click('#gk [data-gtab="kop"]');await pg.wait_for_timeout(200)
            await pg.click("#gk [data-anger]");await pg.wait_for_timeout(300)
            await pg.fill("#aName","Adam Test");await pg.click("[name=aForm][value=fil]");await pg.click("#angerForm .btn-primary");await pg.wait_for_timeout(200)
            await pg.screenshot(path=O+name+"-anger-confirm.png")
            await pg.click("#aYes");await pg.wait_for_timeout(200);await pg.screenshot(path=O+name+"-anger-kvitto.png")
            await pg.keyboard.press("Escape")
            await pg.evaluate("location.hash='om'");await pg.wait_for_timeout(300);await pg.click("#trackShow");await pg.wait_for_timeout(300)
            await pg.screenshot(path=O+name+"-track.png")
            dl=await pg.evaluate("(window.dataLayer||[]).length")
            print(name,"dataLayer",dl,"errors",errs)
            await ctx.close()
        await b.close()
asyncio.run(main())
