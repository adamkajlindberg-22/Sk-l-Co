
/* ---------- Sidor och adresser ---------- */
// Varje sida har en riktig adress: handla/, glas/bourgogne/. Bygget skapar en HTML-fil per adress (scripts/pages.mjs).
// Privata länkar (grupper, delade listor, röstning) har kvar #-formen och syns inte för sökmotorer.
// Gamla #-adresser (#handla, #p-bourgogne) flyttas till den riktiga adressen.
const VIEWS=$$("[data-view]").map(v=>v.dataset.view);
const nav=$("#nav");
let curView="hem", openedByUs=false;
const viewHooks={};
const BASE=new URL(".",document.baseURI).href;
const PRIVATE=/^(rum-[A-Za-z0-9]{6}|lista-[A-Za-z0-9]{10}|bord-[A-Za-z0-9]{10}|tillsammans)$/;
function urlFor(k){
  if(!k||k==="hem"||k==="top")return BASE;
  if(PRIVATE.test(k))return BASE+"#"+k;
  if(k.startsWith("p-"))return BASE+"glas/"+encodeURIComponent(k.slice(2))+"/";
  return BASE+k+"/";
}
// Ger vyn (eller "p-id") för en adress inom sajten, "" för en okänd sida och null utanför sajten
function keyOf(u){
  const url=new URL(u,BASE),bp=new URL(BASE).pathname;
  if(url.origin!==location.origin||!url.pathname.startsWith(bp))return null;
  const rel=decodeURIComponent(url.pathname.slice(bp.length)).replace(/(^|\/)index\.html$/,"").replace(/\/$/,"");
  if(rel==="")return "hem";
  if(/\.[a-z0-9]+$/i.test(rel))return null;
  const m=rel.match(/^glas\/([a-z]+)$/);if(m)return byId[m[1]]?"p-"+m[1]:"";
  const c=rel.match(/^handla\/([a-z]+)$/);if(c)return CATPAGE[c[1]]?"handla/"+c[1]:"";
  return VIEWS.includes(rel)&&rel!=="lista"?rel:"";
}
function route(){
  const h=decodeURIComponent(location.hash.slice(1));
  if(/^rum-[A-Za-z0-9]{6}$/.test(h)){showView("upptack");gOpen(h.slice(4).toUpperCase());return}
  if(/^lista-[A-Za-z0-9]{10}$/.test(h)){showView("lista");openList(h.slice(6));return}
  if(/^bord-[A-Za-z0-9]{10}$/.test(h)){showView("dukning");openBord(h.slice(5));return}
  if(h==="tillsammans"){showView("upptack");setSwMode("group");return}
  if(h==="top"||VIEWS.includes(h)||(h.startsWith("p-")&&byId[h.slice(2)]))history.replaceState(null,"",urlFor(h));
  const k=keyOf(location.href);
  if(k&&k.startsWith("p-")){
    if(!$("[data-view]:not([hidden])"))showView("hem");
    openProduct(k.slice(2));return;
  }
  if(modal.classList.contains("open")&&modal.dataset.kind==="product")closeModal(true);
  if(k&&k.startsWith("handla/")){const [t,f]=CATPAGE[k.slice(7)];FACETS.forEach(x=>F[x[0]].clear());F[t].add(f);showView("handla");return}
  if(!k){
    history.replaceState(null,"",BASE);showView("hem");
    toast("Sidan finns inte längre. Här är startsidan.");return;
  }
  showView(k);
}
function showView(v){
  const changed=v!==curView||!$(`[data-view="${v}"]:not([hidden])`);
  $$("[data-view]").forEach(el=>el.hidden=el.dataset.view!==v);
  curView=v;
  document.body.classList.toggle("view-home",v==="hem");
  $$(".nav-links a,.mmenu a").forEach(a=>{if(keyOf(a.href)===v)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
  const titles={hem:"Rätt glas för varje skål",handla:"Handla glas",glasguiden:"Glasguiden",upptack:"Glas-swipe",glasvaggen:"Glasväggen",dukning:"Dukningsstudion",barstudion:"Barstudion",provladan:"Provlådan",present:"Presentguiden",glasskap:"Mitt glasskåp",journal:"Glasjournalen",om:"Om oss och kontakt",varumarken:"Varumärken A till Ö",lista:"Önskelista",villkor:"Villkor och integritet"};
  document.title="SKÅL & CO · "+(titles[v]||"");
  if(changed)window.scrollTo(0,0);
  if(viewHooks[v])viewHooks[v]();
  if(changed)track("page_view",{page:v,page_location:location.href});
  closeMenu();closeMega();onScroll();
}
addEventListener("hashchange",route);
addEventListener("popstate",route);
function goto(k){const u=urlFor(k);if(location.href!==u)history.pushState(null,"",u);route()}
// Länkar inom sajten byter sida utan att ladda om
addEventListener("click",e=>{
  if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const a=e.target.closest("a[href]");if(!a||a.target||a.hasAttribute("download"))return;
  const href=a.getAttribute("href");
  if(href.startsWith("#")){
    const k=decodeURIComponent(href.slice(1));e.preventDefault();
    if(PRIVATE.test(k)||k==="top"||VIEWS.includes(k)||k.startsWith("p-")){goto(k);return}
    // Ankare på samma sida. <base> skulle annars skicka länken till startsidan.
    const t=document.getElementById(k);if(!t)return;
    if(!t.hasAttribute("tabindex"))t.setAttribute("tabindex","-1");
    t.scrollIntoView();t.focus({preventScroll:true});return;
  }
  const k=keyOf(a.href);if(!k)return;
  e.preventDefault();goto(k);
});

// Kategorisidor med egen adress: handla/vinglas/. Samma lista finns i scripts/pages.mjs via CATPAGE.
const CATPAGE={vinglas:["dryck","vin"],champagneglas:["dryck","champagne"],whiskyglas:["dryck","whisky"],cocktailglas:["dryck","cocktail"],vardagsglas:["dryck","vatten"],kaffeglas:["dryck","kaffe"],teglas:["dryck","te"],olglas:["dryck","ol"],dessertglas:["dryck","dessert"],karaffer:["dryck","karaff"],kristallglas:["egenskap","kristall"]};
const CATSLUG=Object.fromEntries(Object.entries(CATPAGE).map(([s,[t,f]])=>[t+":"+f,s]));
function shopHref(g){return CATSLUG[g]?"handla/"+CATSLUG[g]+"/":"handla/"}

/* ---------- Kategorier, kollektioner, verktyg ---------- */
const CATS=[["vin","Vinglas","Bourgogne, Bordeaux, vitt","assets/l-middag-800.webp"],["whisky","Whisky och sprit","Provglas, tumbler, cognac","assets/l-bar-800.webp"],["champagne","Champagneglas","Flöjt, coupe, tulpan","assets/p-coupe.webp"],["cocktail","Cocktail och drink","Nick & Nora, highball","assets/p-nicknora.webp"],["vatten","Vardagsglas","Vatten, tumbler, färgat","assets/p-gron.webp"],["kaffe","Kaffe","Espresso, latte, koppar","assets/l-kaffe-800.webp"],["te","Te","Teglas, koppar och fat","assets/p-te.webp"],["dessert","Dessertglas","Skålar och coupes","assets/p-dessert.webp"],["ol","Ölglas","IPA, provning, pilsner","assets/p-ol.webp"],["karaff","Karaffer","Vin och vatten","assets/p-karaff.webp"]];
$("#cats").innerHTML=CATS.map((c,i)=>`<a class="cat rv d${i%3}" href="${shopHref("dryck:"+c[0])}" data-go="dryck:${c[0]}"><img src="${c[3]}" alt="" loading="lazy"><span class="t"><b>${c[1]}</b><small>${c[2]}</small></span></a>`).join("");
$("#miniCats").innerHTML=[["egenskap:kristall","Kristallglas"],["egenskap:munblast","Handgjort glas"],["egenskap:fargat","Färgat glas"],["antal:4","Glas i set"],["tillfalle:present","Presenter"],["stil:vintage","Vintage"]].map(c=>`<a class="chip" href="${shopHref(c[0])}" data-go="${c[0]}" style="text-decoration:none">${c[1]}</a>`).join("");
const COLL=[["Whiskysamlingen","Hemmabar","assets/l-bar-800.webp","dryck:whisky"],["Skandinavisk glasdesign","Stil","assets/s-tre-glas-800.webp","stil:skandinavisk"],["Konsten att dricka vin","Vin","assets/l-middag-800.webp","dryck:vin"],["Vardagsfavoriter","Vardag","assets/p-gron.webp","tillfalle:vardag"],["Modern cocktailkultur","Cocktail","assets/p-nicknora.webp","dryck:cocktail"],["Kristallurvalet","Egenskap","assets/p-karaff.webp","egenskap:kristall"]];
$("#collections").innerHTML=COLL.map((c,i)=>`<a class="coll rv d${i%3}" href="${shopHref(c[3])}" data-go="${c[3]}"><img src="${c[2]}" alt="" loading="lazy"><span class="t"><span class="mono">${c[1]}</span><b>${c[0]}</b></span></a>`).join("");
const I={
 guide:'<svg viewBox="0 0 48 48"><path d="M16 44h16M24 44V30M24 30c-8 0-11-6-11-12 0-5 1-9 2-12h18c1 3 2 7 2 12 0 6-3 12-11 12z"/><path d="M14 20h20"/></svg>',
 swipe:'<svg viewBox="0 0 48 48"><rect x="12" y="8" width="20" height="30" rx="4" transform="rotate(-8 22 23)"/><rect x="18" y="10" width="20" height="30" rx="4" transform="rotate(8 28 25)"/></svg>',
 wall:'<svg viewBox="0 0 48 48"><path d="M6 42h36M10 42V22h6v20M21 42V12h6v30M32 42V28h6v14"/></svg>',
 table:'<svg viewBox="0 0 48 48"><ellipse cx="24" cy="26" rx="18" ry="8"/><circle cx="12" cy="26" r="3"/><circle cx="24" cy="30" r="3"/><circle cx="36" cy="26" r="3"/><circle cx="24" cy="22" r="3"/></svg>',
 bar:'<svg viewBox="0 0 48 48"><path d="M14 10h20l-2 26H16zM16 22h16M20 42h8"/></svg>',
 box:'<svg viewBox="0 0 48 48"><path d="M6 16l18-8 18 8v18l-18 8-18-8zM6 16l18 8 18-8M24 24v18"/></svg>',
 gift:'<svg viewBox="0 0 48 48"><rect x="8" y="18" width="32" height="24" rx="2"/><path d="M6 18h36M24 18v24M24 18c-4-8-12-8-12-3s8 3 12 3c4 0 12 2 12-3s-8-5-12 3"/></svg>',
 home:'<svg viewBox="0 0 48 48"><path d="M8 40V18L24 8l16 10v22zM18 40V28h12v12"/></svg>'
};
const TOOLS=[["glasguiden","guide","Glasguiden","Flera drycker och stilar. Ett glas för varje."],["upptack","swipe","Glas-swipe","Swipea själv eller tillsammans med vänner."],["glasvaggen","wall","Glasväggen","Alla glas i skala, mot hand, flaska och hylla."],["dukning","table","Dukningsstudion","Bygg bordet, från sidan eller ovanifrån."],["barstudion","bar","Barstudion","Färdiga kit för hemmabaren."],["provladan","box","Provlådan","Tre glas hem att känna på först."],["present","gift","Presentguiden","Rätt present, och en påminnelse i tid."],["glasskap","home","Mitt glasskåp","Dina glas, listor och ersättningar."]];
$("#tools").innerHTML=TOOLS.map(t=>`<a class="tool" href="${t[0]}/">${I[t[1]]}<b>${t[2]}</b><span>${t[3]}</span><span class="go">Öppna →</span></a>`).join("");

/* ---------- Dagens glas, för dig, senast visade ---------- */
function dayOfYear(){const d=new Date();return Math.floor((d-new Date(d.getFullYear(),0,0))/864e5)}
function renderToday(){
  const p=P[dayOfYear()%P.length];
  $("#today").innerHTML=`<div class="ph" data-open="${p.id}"><img src="${img(p)}" data-pimg="${p.id}" alt="${esc(p.name)}" loading="lazy"></div><div class="txt"><span class="mono">Dagens glas · ${new Date().toLocaleDateString("sv-SE",{day:"numeric",month:"long"})}</span><h2>${esc(p.name)}</h2><p class="lead">${esc(p.why)}</p><p style="margin-top:14px;color:var(--ink2)">${esc(p.story)}</p><div class="ctas" style="margin-top:26px;display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-primary" data-open="${p.id}">Se glaset</button><button class="btn btn-ghost" data-fav="${p.id}" aria-pressed="${isFav(p.id)}">Spara</button></div></div>`;
}
function renderRecent(){
  const L=S.recent.map(id=>byId[id]).filter(Boolean);
  $("#recentWrap").hidden=L.length<2;
  $("#recent").innerHTML=L.map(p=>card(p)).join("");
}
function renderForDig(){
  const prof=S.profile;
  if(!prof){
    $("#forDigTitle").textContent="Glas som passar din smak.";
    $("#forDigCta").textContent="Swipea fram din stil";
    $("#forDigBody").innerHTML=`<p class="lead" style="margin-bottom:24px">Swipea tio bilder i Glas-swipe eller svara på Glasguiden, så visar vi glas som passar just dig här. Under tiden: våra mest sparade.</p><div class="row-scroll">${[...P].sort((a,b)=>b.pop-a.pop).slice(0,4).map(p=>card(p)).join("")}</div>`;
    return;
  }
  $("#forDigTitle").textContent="För dig, "+prof.name.toLowerCase()+".";
  $("#forDigCta").textContent="Swipea igen";
  const recs=recommend(4);
  $("#forDigBody").innerHTML=`<p class="reason">${I.swipe.replace('<svg','<svg width="18" height="18" style="stroke:var(--accent);fill:none;stroke-width:2"')} Utifrån din stil: ${esc(prof.summary)}</p><div class="row-scroll">${recs.map(r=>card(r.p,r.why)).join("")}</div>`;
}
/* Rekommendationer från smakprofil, favoriter och sparade svar */
function recommend(n=3,exclude=[]){
  const w=(S.profile&&S.profile.w)||{};
  const favSet=new Set(S.favs);
  const ownedShapes=new Set(S.owned.map(o=>o.shape));
  return P.filter(p=>!exclude.includes(p.id)).map(p=>{
    let s=p.pop*.05;const why=[];
    p.style.forEach(st=>{if(w["s:"+st]){s+=w["s:"+st];}});
    p.drinks.forEach(d=>{if(w["d:"+d])s+=w["d:"+d]*.8});
    if(w["t:"+tier(p)])s+=w["t:"+tier(p)]*.6;
    if(p.props.includes("fargat")&&w["c:farg"])s+=w["c:farg"];
    if(!p.props.includes("fargat")&&w["c:klar"])s+=w["c:klar"]*.5;
    const topStyle=p.style.filter(st=>(w["s:"+st]||0)>0).sort((a,b)=>w["s:"+b]-w["s:"+a])[0];
    if(topStyle)why.push("din "+STYLEADJ[topStyle]+" stil");
    if(favSet.has(p.id)){s-=1.5}
    if(ownedShapes.has(p.shape)){s-=2}else if(S.owned.length){why.push("saknas i ditt glasskåp")}
    if(S.finder&&(S.finder.drinks||[S.finder.drink]).some(d=>p.drinks.includes(d)||p.cat===d||(d==="rott"||d==="vitt")&&p.cat==="vin")){s+=1.5;why.push("passar det du dricker")}
    return {p,s,why:why.length?"Passar "+why.slice(0,2).join(" och "):""};
  }).sort((a,b)=>b.s-a.s).slice(0,n);
}
const STYLEADJ={skandinavisk:"skandinaviska",klassisk:"klassiska",modern:"moderna",fargstark:"färgstarka",vintage:"vintageinspirerade",lyx:"lyxiga",rustik:"rustika"};
const tier=p=>per(p)<170?"low":per(p)<300?"mid":"high";

/* ---------- Säsong ---------- */
function seasonKey(){const m=new Date().getMonth();return m>=10||m===0?"julbord":m<5?"middag":m<8?"midsommar":"krafta"}
function seasonName(){return {julbord:"Julbord",middag:"Vårmiddag",midsommar:"Midsommar",krafta:"Kräftskiva"}[seasonKey()]}
function renderSeason(){
  const m=new Date().getMonth();
  const s=m>=10||m===0?["Julbord","julbord","Ett julbord för tolv","Vin, bubbel och vatten per kuvert, och karaffen mitt på bordet. Öppna dukningen och byt det du vill.","assets/l-middag.webp"]:m<5?["Påsk och vår","middag","Vårens middagar","Ljusa viner och färgade vattenglas.","assets/s-tre-glas.webp"]:m<8?["Midsommar","midsommar","Midsommarbordet","Tumblers i färg, bubbel och snapsglas.","assets/p-gron.webp"]:["Kräftskiva","krafta","Kräftskivan","Öl, snaps och vatten i tåliga glas.","assets/l-bar.webp"];
  $("#season").innerHTML=`<div class="ph"><img src="${s[4]}" alt="" loading="lazy"></div><div class="txt"><span class="mono">Säsongen · ${s[0]}</span><h2>${s[2]}.</h2><p class="lead">${s[3]}</p><div><a class="btn btn-primary" href="dukning/" data-season="${s[1]}">Öppna dukningen</a></div></div>`;
}
document.addEventListener("click",e=>{const s=e.target.closest("[data-season]");if(s)pendingSeason=s.dataset.season});
let pendingSeason=null;

/* ---------- Handla: filter som går att kombinera ---------- */
const FACETS=[
 ["dryck","Dryck",[["vin","Vin"],["champagne","Champagne"],["whisky","Whisky"],["cocktail","Cocktail"],["vatten","Vatten"],["kaffe","Kaffe"],["te","Te"],["ol","Öl"],["dessert","Dessert"],["karaff","Karaffer"]],p=>[...p.drinks,p.cat]],
 ["tillfalle","Tillfälle",[["vardag","Vardag"],["middag","Middagsbjudning"],["fest","Fest"],["hemmabar","Hemmabar"],["frukost","Frukost"],["present","Present"]],p=>p.occ],
 ["stil","Stil",Object.entries(STYLEN),p=>p.style],
 ["egenskap","Egenskap",Object.entries(PROPS),p=>p.props],
 ["niva","Prisnivå",[["low","Vardag, under 170 kr per glas"],["mid","Design, 170 till 300 kr"],["high","Premium, över 300 kr"]],p=>[tier(p)]],
 ["volym","Volym",[["s","Under 20 cl"],["m","20 till 40 cl"],["l","Över 40 cl"]],p=>[p.vol<20?"s":p.vol<=40?"m":"l"]],
 ["antal","Antal i förpackningen",[["1","1 st"],["2","2 st"],["4","4 st"]],p=>[String(p.pack)]]
];
const FMAP=Object.fromEntries(FACETS.map(f=>[f[0],f]));
const F={};FACETS.forEach(f=>F[f[0]]=new Set());
let sortBy="rek", facetsOpen=false;
const CATINTRO={
 kristall:["Kristallglas","Klart, tunt och klingande.","Kristallglas är klarare och kan blåsas tunnare än vanligt glas. Om glaset tål diskmaskin står på varje produktsida."],
 vin:["Vinglas","Hitta rätt vinglas.","En bred kupa för röda viner med mycket doft, en smalare tulpan för vitt och rosé. Två former räcker långt."],
 champagne:["Champagneglas","Glas för fest och middag.","Flöjten håller bubblorna längst, skålen är festligast och ett vitvinsglas ger mest doft. Välj efter hur du skålar."],
 whisky:["Whiskyglas","Glas med rätt näsa.","Ett tulpanformat provglas samlar doften. En tumbler passar is och drinkar."],
 cocktail:["Cocktailglas","Glas till hemmabaren.","Nick & Nora för martini och sours, highball för long drinks, coupe för allt som skakas."],
 vatten:["Vardagsglas","Glas du tar fram varje dag.","Tåliga, stapelbara och gärna i färg. Glas som klarar diskmaskin och barnkalas."],
 kaffe:["Kaffeglas och koppar","Kaffe man vill titta på.","Dubbelväggat glas håller värmen och visar lagren i en latte. Stengods för den som vill ha tyngd i handen."],
 te:["Tekoppar och teglas","Se teet ta färg.","Värmetåligt glas visar teets färg, och fatet tar droppar och tepåse."],
 ol:["Ölglas","Rätt glas lyfter ölet.","En tulpan samlar humlens doft och håller skummet. Bra till IPA och belgiska öl."],
 dessert:["Dessertglas","Servera dessert med stil.","Låg fot och bred skål, så syns desserten och skeden når ända ner."],
 karaff:["Karaffer och kannor","Ge vinet luft.","En bred botten låter vinet andas. En karaff på bordet gör vatten till en del av dukningen."]
};
function matchF(p,skip){return FACETS.every(([k,,,get])=>k===skip||!F[k].size||get(p).some(v=>F[k].has(v)))}
function activeCount(){return FACETS.reduce((a,f)=>a+F[f[0]].size,0)}
function renderShop(){
  const only=activeCount()===1?FACETS.map(f=>[f[0],[...F[f[0]]][0]]).find(x=>x[1]):null;
  const slug=only?CATSLUG[only[0]+":"+only[1]]:null;
  const one=slug?CATINTRO[only[1]]:null;
  // Adressen följer en ensam kategori, så att länken går att dela
  if(curView==="handla"&&!modal.classList.contains("open")&&(keyOf(location.href)||"").startsWith("handla")){
    const u=urlFor(slug?"handla/"+slug:"handla");if(location.href!==u)history.replaceState(null,"",u);
    document.title=one?one[0]+" · SKÅL & CO":"SKÅL & CO · Handla glas";
  }
  $("#shopKicker").textContent=one?"Handla · "+one[0]:"Handla";
  $("#shopTitle").textContent=one?one[0]+". "+one[1]:"Handla som du vill.";
  $("#shopLead").textContent=one?one[2]:"Kombinera dryck, tillfälle, stil, egenskaper, prisnivå och storlek. Eller beskriv vad du letar efter i sökfältet.";
  $("#facets").innerHTML=FACETS.map(([k,label,opts,get])=>{
    return `<details ${F[k].size||["dryck","tillfalle","niva"].includes(k)?"open":""}><summary>${label}${F[k].size?` · ${F[k].size}`:""}</summary><div class="fl">${opts.map(([v,l])=>{const n=P.filter(p=>matchF(p,k)&&get(p).includes(v)).length;return `<button data-fk="${k}" data-fv="${v}" aria-pressed="${F[k].has(v)}" ${!n&&!F[k].has(v)?"disabled":""}><span>${esc(l)}</span><small>${n}</small></button>`}).join("")}</div></details>`}).join("")
    +`<p class="note" style="margin-top:16px">Varumärken hittar du under <a href="varumarken/">Varumärken A till Ö</a>.</p>`;
  $("#facets").classList.toggle("open",facetsOpen);
  const act=[];FACETS.forEach(([k,,opts])=>F[k].forEach(v=>act.push([k,v,(opts.find(o=>o[0]===v)||[,v])[1]])));
  $("#activeF").innerHTML=act.map(([k,v,l])=>`<span class="ichip">${esc(l.split(",")[0])}<button data-fx="${k}~${v}" aria-label="Ta bort filtret ${esc(l)}">×</button></span>`).join("")+(act.length>1?`<button class="small-btn" data-fclear>Rensa alla</button>`:"");
  $("#fToggle").textContent="Filter"+(act.length?` (${act.length})`:"");
  let list=P.filter(p=>matchF(p));
  const rate=p=>parseFloat(p.rating.replace(",","."));
  const recScore=Object.fromEntries(recommend(P.length).map((r,i)=>[r.p.id,P.length-i]));
  const s={rek:(a,b)=>recScore[b.id]-recScore[a.id],pop:(a,b)=>b.pop-a.pop,new:(a,b)=>(b.isNew-a.isNew)||(b.pop-a.pop),low:(a,b)=>a.price-b.price,high:(a,b)=>b.price-a.price,rate:(a,b)=>rate(b)-rate(a)||b.reviews-a.reviews}[sortBy];
  list=[...list].sort(s);
  $("#count").textContent=list.length+(list.length===1?" produkt":" produkter")+(act.length?" · filtrerat":"");
  $("#products").innerHTML=list.length?list.map((p,i)=>card(p,"",i<2)).join(""):`<div class="empty-grid">Inget glas matchar alla filter. Ta bort ett filter, eller fråga glassommelieren.</div>`;
}
$("#facets").addEventListener("click",e=>{const b=e.target.closest("[data-fk]");if(!b)return;const set=F[b.dataset.fk],v=b.dataset.fv;set.has(v)?set.delete(v):(set.add(v),track("filter_apply",{filter:b.dataset.fk,value:v}));renderShop()});
$("#activeF").addEventListener("click",e=>{const x=e.target.closest("[data-fx]");if(x){const [k,v]=x.dataset.fx.split("~");F[k].delete(v);renderShop()}if(e.target.closest("[data-fclear]")){FACETS.forEach(f=>F[f[0]].clear());renderShop()}});
$("#fToggle").addEventListener("click",()=>{facetsOpen=!facetsOpen;$("#facets").classList.toggle("open",facetsOpen);$("#fToggle").setAttribute("aria-expanded",String(facetsOpen))});
$("#sort").addEventListener("change",e=>{sortBy=e.target.value;renderShop()});
function go(str){const [t,f]=str.split(":");if(FMAP[t]){FACETS.forEach(x=>F[x[0]].clear());F[t].add(f);sortBy=$("#sort").value;if(curView==="handla")renderShop()}}
document.addEventListener("click",e=>{const g=e.target.closest("[data-go]");if(!g)return;go(g.dataset.go);closeMega();if(g.tagName!=="A")goto("handla")});

/* ---------- Varumärken A till Ö ---------- */
const BRANDS=[["Baccarat","Frankrike","Lyx och dramatisk kristall sedan 1764."],["Bormioli Rocco","Italien","Tåliga vardagsglas för hem och restaurang."],["Broste Copenhagen","Danmark","Nordisk form med jordnära färger."],["Eva Solo","Danmark","Funktionell skandinavisk design."],["Ferm Living","Danmark","Mjuka former och dova färger."],["Frederik Bagger","Danmark","Munblåst kristall med modern profil."],["Georg Jensen","Danmark","Dansk design med lång historia."],["Holmegaard","Danmark","Klassiskt danskt glas sedan 1825."],["Iittala","Finland","Sammanhängande serier för vardagen."],["Kosta Boda","Sverige","Konstglas och färg från Småland."],["Libbey","USA","Bar- och vardagsglas i stor bredd."],["LSA International","Storbritannien","Munblåst glas med fin materialkänsla."],["Luigi Bormioli","Italien","Hållbart kristallin för vin och bar."],["Magnor","Norge","Norskt glas med enkla linjer."],["Maison Balzac","Australien","Färg, personlighet och lekfulla former."],["Nachtmann","Tyskland","Slipad kristall och mönster."],["Nude","Turkiet","Modern minimalistisk kristall."],["Orrefors","Sverige","Hantverk och designhistoria sedan 1898."],["Pasabahçe","Turkiet","Brett sortiment till bra pris."],["RCR Cristalleria Italiana","Italien","Kristall för vardag och fest."],["Riedel","Österrike","Glas formade efter druvan."],["Serax","Belgien","Konstnärliga samarbeten och ovanliga former."],["Spiegelau","Tyskland","Tunt och tåligt, även för öl."],["Waterford","Irland","Slipad kristall och exklusiva presenter."],["Zwiesel Glas","Tyskland","Slagtåligt glas för proffs och hem."]];
function renderBrands(){
  const letters=[...new Set(BRANDS.map(b=>b[0][0].toUpperCase()))];
  $("#brandIdx").innerHTML="ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ".split("").map(l=>letters.includes(l)?`<a href="varumarken/" data-letter="${l}">${l}</a>`:`<span>${l}</span>`).join("");
  $("#brandList").innerHTML=letters.map(l=>`<section class="bgroup" id="b-${l}"><h2 class="bg-h">${l}</h2><div class="bgrid">${BRANDS.filter(b=>b[0][0].toUpperCase()===l).map(b=>{const w=S.watches.some(x=>x.series===b[0]);return `<div class="bcard"><b>${esc(b[0])}</b><span class="mono" style="font-size:11px">${esc(b[1])}</span><p>${esc(b[2])}</p><button class="small-btn" data-bwatch="${esc(b[0])}" aria-pressed="${w}">${w?"Bevakas":"Bevaka"}</button></div>`}).join("")}</div></section>`).join("");
}
document.addEventListener("click",e=>{
  const l=e.target.closest("[data-letter]");if(l){e.preventDefault();const g=$("#b-"+l.dataset.letter);if(g)g.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"});return}
  const w=e.target.closest("[data-bwatch]");if(w){const n=w.dataset.bwatch,i=S.watches.findIndex(x=>x.series===n);if(i>=0)S.watches.splice(i,1);else{S.watches.push({series:n,brand:true,ts:Date.now()});toast("Du får veta när "+n+" finns hos oss")}save();renderBrands()}
});

/* ---------- Megameny ---------- */
const mega=$("#mega"),megaBtn=$("#megaBtn");let megaT=0;
function renderMega(){
  const trend=[...P].sort((a,b)=>b.pop-a.pop).slice(0,2);
  mega.innerHTML=`<div class="mega-in">
  <div><span class="mono">Kategorier</span><ul>${CATS.map(c=>`<li><a href="${shopHref("dryck:"+c[0])}" data-go="dryck:${c[0]}">${c[1]}</a></li>`).join("")}</ul></div>
  <div><span class="mono">Handla efter</span><ul>${[["tillfalle:middag","Middagsbjudning"],["tillfalle:hemmabar","Hemmabar"],["tillfalle:present","Presenter"],["stil:skandinavisk","Skandinavisk stil"],["stil:lyx","Modern lyx"],["egenskap:kristall","Kristallglas"],["egenskap:munblast","Handgjort glas"],["egenskap:fargat","Färgat glas"],["antal:4","Glas i set"]].map(x=>`<li><a href="${shopHref(x[0])}" data-go="${x[0]}">${x[1]}</a></li>`).join("")}</ul></div>
  <div><span class="mono">Kollektioner</span><ul>${COLL.map(c=>`<li><a href="${shopHref(c[3])}" data-go="${c[3]}">${c[0]}</a></li>`).join("")}<li><a href="varumarken/">Varumärken A till Ö</a></li></ul></div>
  <div class="mega-feat"><a class="mega-card" href="dukning/" data-season="${seasonKey()}"><img src="assets/l-middag-800.webp" alt="" loading="lazy"><span><span class="mono">Säsongen</span><b>Duka ${seasonName().toLowerCase()} på tio minuter</b></span></a>
   <span class="mono" style="display:block;margin:16px 0 8px">Trendar nu</span>${trend.map(p=>`<a class="mega-p" href="glas/${p.id}/" data-open="${p.id}"><img src="${img(p,true)}" data-pimg="${p.id}" alt=""><span><b>${esc(p.name)}</b><small>${kr(p.price)}</small></span></a>`).join("")}</div></div>`;
}
function openMega(on){mega.hidden=!on;megaBtn.setAttribute("aria-expanded",String(on));nav.classList.toggle("mega-open",on);if(on)renderMega();onScroll()}
function closeMega(){if(!mega.hidden)openMega(false)}
megaBtn.addEventListener("click",()=>openMega(mega.hidden));
const megaLi=megaBtn.parentElement;
if(matchMedia("(hover:hover)").matches){
  megaLi.addEventListener("mouseenter",()=>{clearTimeout(megaT);megaT=setTimeout(()=>openMega(true),120)});
  nav.addEventListener("mouseleave",()=>{clearTimeout(megaT);megaT=setTimeout(closeMega,220)});
  mega.addEventListener("mouseenter",()=>clearTimeout(megaT));
}
mega.addEventListener("click",e=>{if(e.target.closest("a"))closeMega()});

/* ---------- En dryck, tre glas ---------- */
const TRE={
 bubbel:["Bubbel",[["perla","Flöjten","Håller bubblorna längst och är klassisk till fest."],["coupe","Champagneskålen","Festligast och mest vintage. Bubblorna försvinner lite fortare."],["vitvin","Vitvinsglaset","Ger mest doft. Ett bra val till fin champagne."]]],
 gt:["Gin & tonic",[["boljahigh","Highballen","Hög och smal, så kolsyran håller längre."],["bolja","Tumblern","Kort och stabil. Mer is, mindre tonic."],["bourgogne","Ballongglaset","Spansk stil med stor kupa som samlar doften av gin och garnityr."]]],
 kaffe:["Kaffe",[["svavar","Dubbelväggat","Håller espresson varm och fingrarna svala."],["kaffe","Stengodskoppen","Tyngd i handen och värme som stannar."],["anga","Teglaset med fat","Visar lagren i en latte och är lätt att hålla."]]]
};
let treKey="bubbel";
function renderTre(){
  const [name,L]=TRE[treKey];
  $("#treTabs").innerHTML=Object.entries(TRE).map(([k,v])=>`<button class="chip" data-tre="${k}" aria-pressed="${k===treKey}">${v[0]}</button>`).join("");
  $("#treGrid").innerHTML=L.map(([id,t,txt])=>{const p=byId[id];return `<article class="tre" data-open="${id}"><div class="ph"><img src="${img(p,true)}" data-pimg="${id}" alt="${esc(p.name)}" loading="lazy"></div><span class="mono">${esc(name)} i</span><h3>${t}</h3><p>${txt}</p><span class="more">${esc(p.name)} · ${kr(p.price)} →</span></article>`}).join("");
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-tre]");if(b){treKey=b.dataset.tre;renderTre()}});

/* ---------- Nyhetsbrev ---------- */
document.addEventListener("submit",e=>{const f=e.target.closest("[data-news]");if(!f)return;e.preventDefault();const em=$("input",f).value.trim();if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){toast("Skriv en giltig e-postadress");return}S.newsletter=true;save(true);track("sign_up",{method:"nyhetsbrev"});$("input",f).value="";toast("Tack! Visningsversion, så inget utskick görs.")});

/* ---------- Jämför ---------- */
document.addEventListener("change",e=>{const c=e.target.closest("[data-cmp]");if(!c)return;
  if(c.checked){if(cmpSet.size>=3){c.checked=false;toast("Du kan jämföra tre glas åt gången");return}cmpSet.add(c.dataset.cmp)}else cmpSet.delete(c.dataset.cmp);
  $$(`[data-cmp="${c.dataset.cmp}"]`).forEach(x=>x.checked=c.checked);
  $("#cmpTxt").textContent=cmpSet.size+" av 3 valda";$("#cmpbar").classList.toggle("on",cmpSet.size>0)});
$("#cmpGo").addEventListener("click",()=>{
  if(cmpSet.size<2){toast("Välj minst två glas att jämföra");return}
  const L=[...cmpSet].map(id=>byId[id]);
  const rows=[["Material",p=>p.mat],["Volym",p=>p.vol+" cl"],["Höjd",p=>cm(p.h)],["Diameter",p=>cm(p.d)],["Förpackning",p=>p.pack===1?"1 st":p.pack+" st"],["Pris per glas",p=>kr(per(p))],["Diskmaskin",p=>p.props.includes("diskmaskin")?"Ja, enligt tillverkaren":"Handdisk"],["Passar till",p=>p.drinks.map(d=>DRINKN[d]||d).join(", ")]];
  const maxH=Math.max(...L.map(p=>p.h));
  openModal(`<div style="padding:clamp(20px,3vw,40px)"><span class="mono">Jämför glas</span><h2 style="margin:8px 0 22px;font-size:clamp(28px,3vw,40px)">Sida vid sida.</h2><div style="overflow-x:auto"><table class="cmptable"><thead><tr><th></th>${L.map(p=>`<td><img src="${img(p,true)}" alt=""><b style="font-family:var(--serif);font-weight:400;font-size:19px;display:block">${esc(p.name)}</b>${kr(p.price)}</td>`).join("")}</tr></thead><tbody><tr><th>Storlek i skala</th>${L.map(p=>`<td><div style="height:120px;display:flex;align-items:flex-end;color:var(--ink)"><div style="height:${p.h/maxH*120}px;width:${p.h/maxH*80}px">${sil(p.shape,"currentColor",5)}</div></div></td>`).join("")}</tr>${rows.map(([l,f])=>`<tr><th>${l}</th>${L.map(p=>`<td>${esc(f(p))}</td>`).join("")}</tr>`).join("")}<tr><th></th>${L.map(p=>`<td><button class="btn btn-ink" data-add="${p.id}">Lägg i varukorg</button></td>`).join("")}</tr></tbody></table></div></div>`,"Jämför glas","cmp");
});

/* ---------- Modal med fokusfälla ---------- */
const modal=$("#modal"); let lastFocus=null;
function openModal(html,label,kind){
  if(!modal.classList.contains("open"))lastFocus=document.activeElement;
  $("#mbody").innerHTML=html;$(".box",modal).setAttribute("aria-label",label);modal.dataset.kind=kind||"";
  modal.inert=false;modal.classList.add("open");modal.setAttribute("aria-hidden","false");$(".box",modal).scrollTop=0;$(".x",modal).focus();
}
function closeModal(fromRoute){
  if(!modal.classList.contains("open"))return;
  const wasProduct=modal.dataset.kind==="product";
  modal.classList.remove("open");modal.setAttribute("aria-hidden","true");modal.inert=true;stop3d();
  if(wasProduct&&!fromRoute&&(keyOf(location.href)||"").startsWith("p-")){
    if(openedByUs){openedByUs=false;history.back()}else history.replaceState(null,"",urlFor(curView));
  }
  if(lastFocus&&document.contains(lastFocus))lastFocus.focus();
}
modal.addEventListener("click",e=>{if(e.target.closest("[data-mclose]"))closeModal()});
function trap(e,box){
  if(e.key!=="Tab")return;
  const f=$$('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])',box).filter(el=>el.offsetParent!==null);
  if(!f.length)return;const a=f[0],z=f[f.length-1];
  if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}
}
document.addEventListener("keydown",e=>{
  if(modal.classList.contains("open"))trap(e,$(".box",modal));
  else if($("#drawer").classList.contains("open"))trap(e,$("#drawer .panel"));
  else if($("#search").classList.contains("open"))trap(e,$("#search .sbox"));
});

/* ---------- Smart sök ---------- */
const search=$("#search"), sIn=$("#sIn");
let sFilters=[], sTimer=0, sAbort=null;
function openSearch(on){
  search.classList.toggle("open",on);search.setAttribute("aria-hidden",String(!on));search.inert=!on;
  if(on){lastFocus=document.activeElement;sIn.value="";sFilters=[];renderSearch();setTimeout(()=>sIn.focus(),60)}
  else if(lastFocus)lastFocus.focus();
}
$("#searchBtn").addEventListener("click",()=>openSearch(true));
search.addEventListener("click",e=>{if(e.target.closest("[data-sclose]"))openSearch(false)});
const VOCAB=[
 ["drink","vin",/vin|rött|rödvin|bourgogne|bordeaux|pinot/],["drink","vin",/vitt|vitvin/],["drink","champagne",/champagne|bubbel|mousserande|prosecco|cava|nyår/],["drink","whisky",/whisk|cognac|rom\b|sprit/],["drink","cocktail",/cocktail|drink|martini|gin|sour/],["drink","kaffe",/kaffe|espresso|latte|cappuccino/],["drink","te",/\bte\b|teglas|tekopp/],["drink","vatten",/vatten|vardag|dricksglas|juice/],["drink","karaff",/karaff|kanna/],["drink","ol",/(^|[^a-zåäö])öl|ipa|pilsner|stout/],["drink","dessert",/dessert|glass|panna cotta|efterrätt/],
 ["prop","diskmaskin",/diskmaskin/],["prop","kristall",/kristall|tunn|elegant|lätt/],["prop","munblast",/munblås|handblås/],["prop","fargat",/färg|grön|bärnsten/],["prop","stapelbart",/stapel/],["prop","dubbelvaggat",/dubbelvägg|varm/],
 ["style","skandinavisk",/skandinav|nordisk/],["style","vintage",/vintage|retro|1920/],["style","lyx",/lyx|exklusiv/],["style","rustik",/rustik/],["style","modern",/modern/],
 ["occ","present",/present|gåva|bröllop|födelsedag/],["occ","fest",/fest|kalas/],["occ","hemmabar",/hemmabar|bar\b/],["occ","frukost",/frukost|morgon/]
];
const FNAME=(k,v)=>k==="max"?"Max "+kr(v)+" per glas":k==="drink"?DRINKN[v]||v:k==="prop"?PROPS[v]||v:k==="style"?STYLEN[v]||v:k==="occ"?{present:"Present",fest:"Fest",hemmabar:"Hemmabar",frukost:"Frukost",middag:"Middag",vardag:"Vardag"}[v]||v:v;
function parseQuery(q){
  const t=q.toLowerCase(), out=[];
  VOCAB.forEach(([k,v,r])=>{if(r.test(t)&&!out.some(f=>f.k===k&&f.v===v))out.push({k,v})});
  const m=t.match(/(?:under|max|högst|upp till|för)?\s*(\d[\d\s]{1,5})\s*(?:kr|kronor|:-)/);
  if(m){let n=+m[1].replace(/\s/g,"");const c=t.match(/(\d+|två|tre|fyra|sex|åtta|tolv)\s*(?:st|glas)/);const cnt=c?(+c[1]||{två:2,tre:3,fyra:4,sex:6,åtta:8,tolv:12}[c[1]]):0;if(cnt>1&&!/per glas|styck/.test(t))n=n/cnt;out.push({k:"max",v:Math.round(n)})}
  return out;
}
function applyFilters(fl){
  return P.map(p=>{let ok=0,miss=0;
    fl.forEach(f=>{const hit=f.k==="drink"?(p.drinks.includes(f.v)||p.cat===f.v):f.k==="prop"?p.props.includes(f.v):f.k==="style"?p.style.includes(f.v):f.k==="occ"?p.occ.includes(f.v):f.k==="max"?per(p)<=f.v:false;hit?ok++:miss++});
    if(!fl.some(f=>f.k==="drink"&&f.v==="karaff")&&p.cat==="karaff"&&fl.length)miss+=.5;
    return {p,ok,miss};
  });
}
function textHits(q){const t=q.toLowerCase().trim();if(!t)return[];return P.filter(p=>(p.name+" "+p.mat+" "+p.series+" "+SHNAME[p.shape]).toLowerCase().includes(t))}
function renderSearch(note){
  let q=sIn.value.trim();const box=$("#sRes");let fixed=null;
  if(q&&!textHits(q).length&&!parseQuery(q).length){const f=fuzzy(q);if(f){fixed=f;q=f;sFilters=parseQuery(f)}}
  if(!q&&!sFilters.length){
    box.innerHTML=`${(S.searches||[]).length?`<span class="mono">Dina senaste sökningar</span><div class="sugg2" style="margin:12px 0 20px">${S.searches.slice(0,5).map(q=>`<button class="chip" data-sq="${esc(q)}">${esc(q)}</button>`).join("")}</div>`:""}<span class="mono">Populära sökningar</span><div class="sugg2" style="margin-top:12px">${["Tunna vinglas under 300 kr","Present till whiskyvän","Glas som tål diskmaskin","Färgade vattenglas","Bubbel till nyår","Ölglas för IPA"].map(s=>`<button class="chip" data-sq="${s}">${s}</button>`).join("")}</div><span class="mono" style="display:block;margin-top:20px">Kategorier</span><div class="sugg2" style="margin-top:12px">${CATS.map(c=>`<button class="chip" data-scat="${c[0]}">${c[1]}</button>`).join("")}</div>${S.recent.length?`<div style="margin-top:22px"><span class="mono">Senast visade</span><div style="margin-top:8px">${S.recent.slice(0,3).map(id=>hit(byId[id])).join("")}</div></div>`:""}`;
    return;
  }
  const scored=applyFilters(sFilters);
  const txt=textHits(q).map(p=>p.id);
  let exact=sFilters.length?scored.filter(r=>r.miss===0).map(r=>r.p):[];
  txt.forEach(id=>{if(!exact.includes(byId[id]))exact.unshift(byId[id])});
  const near=exact.length?[]:scored.filter(r=>r.ok>0).sort((a,b)=>(b.ok-b.miss)-(a.ok-a.miss)).slice(0,3).map(r=>r.p);
  const tq=q.toLowerCase();
  const catHits=tq.length>=2?CATS.filter(c=>c[1].toLowerCase().includes(tq)||c[0].startsWith(tq)||sFilters.some(f=>f.k==="drink"&&f.v===c[0])):[];
  box.innerHTML=`${fixed?`<p class="note" style="margin:0 0 10px">Visar resultat för <b>${esc(fixed)}</b>. <button class="small-btn" data-sfix="${esc(fixed)}">Sök på det i stället</button></p>`:""}${catHits.length?`<div class="sugg2" style="margin-bottom:14px">${catHits.slice(0,4).map(c=>`<button class="chip" data-scat="${c[0]}">${c[1]} →</button>`).join("")}</div>`:""}${sFilters.length?`<div class="chips">${sFilters.map((f,i)=>`<span class="ichip">${esc(FNAME(f.k,f.v))}<button data-sx="${i}" aria-label="Ta bort filtret">×</button></span>`).join("")}</div>`:""}
  ${exact.length?`<span class="mono">${exact.length} träffar</span><div style="margin-top:8px">${exact.map(hit).join("")}</div>`:near.length?`<p class="note" style="margin:0 0 8px">Inget matchar allt. Närmast är:</p>${near.map(hit).join("")}`:`<p class="note">Vi hittar inget som matchar. Prova att beskriva drycken, eller fråga glassommelieren.</p>`}
  ${note?`<div class="ai-note">${note}</div>`:""}
  ${exact.length||near.length?`<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap"><button class="small-btn" data-sall>Visa i butiken</button><button class="small-btn" data-sask>Fråga glassommelieren om detta</button></div>`:`<div style="margin-top:14px"><button class="small-btn" data-sask>Fråga glassommelieren</button></div>`}`;
}
const DICT=[...new Set([...P.flatMap(p=>(p.name+" "+p.series).toLowerCase().split(/\s+/)),"vinglas","vitvin","rödvin","champagne","champagneglas","bubbel","flöjt","coupe","whisky","whiskyglas","cocktail","martini","tumbler","highball","vattenglas","kaffe","espresso","latte","teglas","tekopp","ölglas","dessert","dessertglas","karaff","kristall","diskmaskin","munblåst","present","bröllop","färgat","stapelbart"])].filter(w=>w.length>3);
function lev(a,b){const m=a.length,n=b.length;if(Math.abs(m-n)>2)return 9;let prev=Array.from({length:n+1},(_,i)=>i);for(let i=1;i<=m;i++){const cur=[i];for(let j=1;j<=n;j++)cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=cur}return prev[n]}
function fuzzy(q){let changed=false;const out=q.toLowerCase().split(/\s+/).map(w=>{if(w.length<4||DICT.includes(w))return w;let best=null,bd=3;DICT.forEach(d=>{const x=lev(w,d);if(x<bd){bd=x;best=d}});if(best&&bd<=(w.length>6?2:1)){changed=true;return best}return w});return changed?out.join(" "):null}
function logSearch(q){q=String(q||"").trim();if(q.length<2)return;track("search",{search_term:q});S.searches=[q,...(S.searches||[]).filter(x=>x!==q)].slice(0,8);save(true)}
function hit(p){return `<div class="hit" tabindex="0" data-open="${p.id}"><img src="${img(p,true)}" data-pimg="${p.id}" alt=""><div><b>${esc(p.name)}</b><small>${esc(p.mat)} · ${p.vol} cl · ${kr(per(p))} per glas</small></div><span>${kr(p.price)}</span></div>`}
sIn.addEventListener("input",()=>{
  sFilters=parseQuery(sIn.value);renderSearch();
  clearTimeout(sTimer);
  if(sIn.value.trim().split(/\s+/).length>=3)sTimer=setTimeout(aiParse,900);
});
$("#sForm").addEventListener("submit",e=>{e.preventDefault();clearTimeout(sTimer);logSearch(sIn.value);aiParse()});
$("#sRes").addEventListener("click",e=>{
  const sq=e.target.closest("[data-sq]");if(sq){sIn.value=sq.dataset.sq;sFilters=parseQuery(sIn.value);renderSearch();aiParse();return}
  const sx=e.target.closest("[data-sx]");if(sx){sFilters.splice(+sx.dataset.sx,1);renderSearch();return}
  if(e.target.closest("[data-sall]")){FACETS.forEach(x=>F[x[0]].clear());const map={drink:"dryck",prop:"egenskap",style:"stil",occ:"tillfalle"};sFilters.forEach(f=>{if(map[f.k])F[map[f.k]].add(f.v);if(f.k==="max")F.niva.add(f.v<170?"low":f.v<=300?"mid":"high")});logSearch(sIn.value);openSearch(false);goto("handla");return}
  const sc=e.target.closest("[data-scat]");if(sc){go("dryck:"+sc.dataset.scat);logSearch(sIn.value);openSearch(false);goto("handla");return}
  const sfix=e.target.closest("[data-sfix]");if(sfix){sIn.value=sfix.dataset.sfix;sFilters=parseQuery(sIn.value);renderSearch();return}
  if(e.target.closest("[data-sask]")){const q=sIn.value.trim();openSearch(false);openConc(q||null);return}
  if(e.target.closest("[data-open]")){logSearch(sIn.value);openSearch(false)}
});
$("#sRes").addEventListener("keydown",e=>{if(e.key==="Enter"){const h=e.target.closest("[data-open]");if(h){openSearch(false);showProduct(h.dataset.open)}}});
async function aiParse(){
  const q=sIn.value.trim();if(q.split(/\s+/).length<3)return;
  const sample=await getSample();if(!sample)return;
  if(sAbort)sAbort.abort();sAbort=new AbortController();
  renderSearch('<i class="spin"></i>Tolkar din sökning');
  try{
    const allowed={drink:Object.keys(DRINKN),prop:Object.keys(PROPS),style:Object.keys(STYLEN),occ:["vardag","middag","fest","hemmabar","frukost","present"]};
    const out=await sample.json(`Du tolkar en sökning i en svensk glasbutik. Svara bara med JSON: {"drink":[],"prop":[],"style":[],"occ":[],"maxPerGlass":null}. Använd endast dessa värden: ${JSON.stringify(allowed)}. maxPerGlass är högsta pris per glas i kronor som ett tal, eller null. Om användaren anger totalbudget och antal glas, dela budgeten med antalet. Sökning: """${q.slice(0,300)}"""`,{signal:sAbort.signal,modelTier:"quick"});
    if(sIn.value.trim()!==q)return;
    const fl=[];
    ["drink","prop","style","occ"].forEach(k=>(Array.isArray(out&&out[k])?out[k]:[]).forEach(v=>{if(allowed[k].includes(v)&&!fl.some(f=>f.k===k&&f.v===v))fl.push({k,v})}));
    if(out&&typeof out.maxPerGlass==="number"&&out.maxPerGlass>0)fl.push({k:"max",v:Math.round(out.maxPerGlass)});
    if(fl.length)sFilters=fl;
    renderSearch('Tolkad av Claude. Ta bort ett filter om något blev fel.');
  }catch(e){if(e&&e.name==="AbortError")return;if(e&&e.code==="not_granted")aiOff=true;renderSearch()}
}
