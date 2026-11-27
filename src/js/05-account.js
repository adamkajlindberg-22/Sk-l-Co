
/* ---------- Mitt glasskåp ---------- */
const fmtDate=ts=>new Date(ts).toLocaleDateString("sv-SE",{day:"numeric",month:"short"});
const silBox=sh=>`<span class="sil">${sil(sh,"currentColor",6)}</span>`;
let photoState=null;
const GSVG=`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.6 2.3 2.3 6.6 2.3 12s4.3 9.7 9.7 9.7c5.6 0 9.3-3.9 9.3-9.5 0-.6-.1-1.1-.2-1.6H12z"/></svg>`;
let gkTab="oversikt";
let gkGuest=false;try{gkGuest=sessionStorage.getItem("skal-gk-guest")==="1"}catch(e){}
const GKTABS=[["oversikt","Översikt"],["glas","Mina glas"],["sparat","Sparat"],["kop","Köp"],["konto","Konto"]];
const gkGate=()=>authOn()&&!AUTH.user&&!gkGuest;
function gkLanding(){
  const local=S.favs.length+S.owned.length+S.saved.length+S.lists.reduce((n,l)=>n+l.items.length,0)+(S.profile?1:0)+S.orders.length;
  const arch=["perla","bourgogne","whisky"].map(id=>byId[id]).filter(Boolean);
  const perks=[["Din stil","Swipea eller svara på Glasguiden. Vi lär oss vad du gillar och visar glas som passar dig över hela sidan."],["Dina glas hemma","Lägg in glasen du har. Se vad som saknas i serien och ersätt ett trasigt glas på två klick."],["Favoriter och listor","Spara glas, gör en önskelista eller en bröllopslista och dela den med gästerna."],["Dukningar och barkit","Spara bordet du byggt i Dukningsstudion och kiten från Barstudion."],["Presentkalendern","Spara födelsedagar och bröllop. Vi påminner i god tid med förslag."],["Kvitton och skålpoäng","Alla köp, krossgarantier och poäng samlade på ett ställe."]];
  const roman=["I","II","III","IV","V","VI"];
  return `<section class="gkl">
    <div class="gkl-copy">
      <span class="mono">Mitt glasskåp</span>
      <h1>Ditt eget glasskåp.<em>Alltid med dig.</em></h1>
      <p class="lead">Logga in så lär vi oss din stil, sparar dina glas och listor och visar det som passar just dig. På alla dina enheter.</p>
      <div class="gkl-cta"><button class="btn btn-google" data-login="google">${GSVG} Fortsätt med Google</button><button class="btn btn-ghost" data-login="in">Logga in med e-post</button></div>
      <p class="gkl-small">Ny här? <button class="linkbtn" data-login="up">Skapa ett konto med e-post</button>. Gratis, och bara du ser ditt glasskåp.</p>
      ${local?`<p class="gkl-local"><i></i>Du har ${local} ${local===1?"sak":"saker"} sparade i den här webbläsaren. De följer med in när du loggar in.</p>`:""}
    </div>
    <div class="gkl-art" aria-hidden="true">${arch.map((p,i)=>`<div class="arch a${i}"><img src="${img(p,true)}" data-pimg="${p.id}" alt=""></div>`).join("")}<div class="shelf"></div></div>
  </section>
  <section class="gkl-perks"><div class="gkl-perks-head"><span class="mono">Det här finns i ditt glasskåp</span><h2>Allt som gör glasen till dina.</h2></div>
    <ol>${perks.map((p,i)=>`<li><span class="num">${roman[i]}</span><h3>${p[0]}</h3><p>${p[1]}</p></li>`).join("")}</ol>
  </section>
  <p class="gkl-guest"><button class="linkbtn" data-guest>Fortsätt utan konto</button><span>Allt fungerar, men det du sparar stannar i den här webbläsaren.</span></p>`;
}
function renderGlasskap(){
  const el=$("#gk");if(!el)return;
  el.classList.toggle("gk-gate",gkGate());
  if(gkGate()){el.innerHTML=gkLanding();return}
  const prof=S.profile;
  const owned=S.owned;
  const ownedIds=new Set(owned.map(o=>o.id).filter(Boolean));
  const missing=[...new Set(owned.map(o=>byId[o.id]?.series).filter(Boolean))].flatMap(s=>P.filter(p=>p.series===s&&!ownedIds.has(p.id)));
  const recs=recommend(3,[...ownedIds]);
  const upcoming=S.dates.map(d=>({...d,days:Math.ceil((new Date(d.date)-new Date().setHours(0,0,0,0))/864e5)})).sort((a,b)=>a.days-b.days);
  const readNext=ART.map((a,i)=>({a,i})).filter(x=>!S.read.includes(x.i)).sort((x,y)=>score(y.a)-score(x.a)).slice(0,3);
  function score(a){let s=0;if(S.finder&&a[0]===S.finder.drink)s+=2;if(owned.some(o=>byId[o.id]&&(byId[o.id].cat===a[0]||byId[o.id].drinks.includes(a[0]))))s+=1.5;if(a[0]==="skotsel"&&owned.length)s+=1;return s}
  const u=AUTH.user;
  const name=cloud.name?cloud.name.split(" ")[0]:"";
  const status=cloud.on?(cloud.provider==="firebase"?"Sparas på ditt konto":"Sparas på ditt Claude-konto"):"Sparas i den här webbläsaren";
  const nGlas=owned.reduce((n,o)=>n+o.count,0);
  const head=`<header class="gkd-head">
    <div class="gkd-id"><span class="gkd-av" aria-hidden="true">${name?esc(name[0].toUpperCase()):`<svg viewBox="0 0 24 24"><path d="M5.5 21V10.5a6.5 6.5 0 0 1 13 0V21"/><path d="M3.5 21h17"/><path d="M9.8 9.5h4.4c0 2.4-1 3.6-2.2 3.6s-2.2-1.2-2.2-3.6z"/><path d="M12 13.1v3.6M10.4 16.7h3.2"/></svg>`}</span>
      <div><span class="mono">Mitt glasskåp</span><h1>${name?"Hej "+esc(name)+".":"Välkommen."}</h1><p class="gkd-sub ${cloud.on?"on":""}"><i></i>${status}</p></div></div>
    <dl class="gkd-stats"><div><dt>Favoriter</dt><dd>${S.favs.length}</dd></div><div><dt>Glas hemma</dt><dd>${nGlas}</dd></div><div><dt>Skålpoäng</dt><dd>${S.points||0}</dd></div></dl>
  </header>`;
  const guestBar=authOn()&&!u?`<div class="gkd-guest"><p><b>Du använder glasskåpet utan konto.</b> Logga in så sparas din stil och allt du sparat på kontot.</p><div class="pdp-actions"><button class="btn btn-google btn-sm" data-login="google">${GSVG} Fortsätt med Google</button><button class="small-btn" data-login="in">E-post</button></div></div>`:"";
  const tabs=`<div class="gkd-tabs" role="group" aria-label="Delar av Mitt glasskåp">${GKTABS.map(([k,v])=>`<button type="button" data-gtab="${k}" aria-pressed="${gkTab===k}">${v}</button>`).join("")}</div>`;
  const T={};
  T.oversikt=`<section class="gk span8 gk-feature"><span class="mono">Din stil</span>${prof?`<h2 class="gk-h">${esc(prof.name)}</h2><p style="color:var(--ink2)">Du gillar ${esc(prof.summary)}.</p>`:`<h2 class="gk-h">Vi känner dig inte än.</h2><p style="color:var(--ink2)">Swipea tio bilder eller svara på Glasguiden. Sedan anpassas förslagen på hela sidan efter dig.</p>`}
    ${S.finder?`<p class="note">Glasguiden: ${esc(finderSummary(S.finder))}. <a href="#glasguiden">Se förslagen</a></p>`:""}
    <div class="pdp-actions"><a class="small-btn" href="#upptack">${prof?"Swipea igen":"Starta Glas-swipe"}</a><a class="small-btn" href="#glasguiden">Glasguiden</a></div>
    ${recs.length&&(prof||S.finder||owned.length)?`<div class="gk-list">${recs.map(r=>`<div class="gk-item" data-open="${r.p.id}" style="cursor:pointer"><img src="${img(r.p,true)}" data-pimg="${r.p.id}" alt=""><div><b>${esc(r.p.name)}</b><small>${esc(r.why||r.p.why)}</small></div><span>${kr(r.p.price)}</span></div>`).join("")}</div>`:""}
  </section>
  <section class="gk span4"><span class="mono">Skålpoäng</span><div class="points" style="margin:10px 0 6px">${S.points||0}</div><p style="color:var(--ink2)">500 poäng ger fri gravyr. 300 poäng ger presentinslagning.</p>
    <div class="gk-list">${S.pointsLog.slice(0,3).map(l=>`<div style="display:flex;justify-content:space-between;font-size:14px;color:var(--ink2)"><span>${esc(l.why)}</span><span>+${l.n}</span></div>`).join("")||'<p class="gk-empty">Du får poäng när du handlar, skriver recensioner och delar dukningar.</p>'}</div>
    <p class="note">Poängvärdet är ett exempel i visningsversionen.</p>
  </section>
  <section class="gk wide g-gk"><div><span class="mono">Swipea tillsammans</span><h2 class="gk-h">${(S.rooms||[]).length?"Dina grupper":"Välj glas ihop med andra."}</h2>${(S.rooms||[]).length?`<div class="g-mine">${S.rooms.slice(0,4).map(r=>`<a class="g-room" href="#rum-${esc(r.code)}"><span><b>${esc(r.name)}</b><small>Kod ${esc(r.code)}</small></span><span aria-hidden="true">→</span></a>`).join("")}</div>`:`<p style="color:var(--ink2)">Bjud in familj eller vänner, swipea samma glas och se vilka ni alla gillar. Perfekt inför bröllop, flytt eller julbord.</p>`}</div><a class="btn btn-ghost" href="#tillsammans">${(S.rooms||[]).length?"Ny grupp":"Starta en grupp"}</a></section>
  <section class="gk"><span class="mono">Kalender</span><h2 class="gk-h">Kommande presenter</h2>
    <div class="gk-list">${upcoming.map(d=>`<div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><span>${esc(d.name)}<small style="display:block;color:var(--muted)">${d.days>=0?(d.days===0?"I dag":"Om "+d.days+" dagar"):"Har passerat"} · ${esc(d.date)}</small></span><span style="display:flex;gap:6px"><a class="small-btn" href="#present">Hitta present</a><button class="small-btn" data-ddel="${S.dates.indexOf(S.dates.find(x=>x.name===d.name&&x.date===d.date))}" aria-label="Ta bort">×</button></span></div>`).join("")||'<p class="gk-empty">Spara födelsedagar och bröllop i Presentguiden.</p>'}</div>
    <p class="note">I butiken får du en påminnelse två veckor innan.</p>
  </section>
  <section class="gk"><span class="mono">Läsning för dig</span><h2 class="gk-h">Utvalt utifrån dina glas</h2>
    <div class="gk-list">${readNext.map(x=>`<button class="small-btn" data-art="${x.i}" style="justify-content:flex-start;text-align:left">${esc(x.a[2])}</button>`).join("")||'<p class="gk-empty">Du har läst allt. Snyggt.</p>'}</div>
  </section>`;
  T.glas=`<section class="gk span7"><span class="mono">Mina glas</span><h2 class="gk-h">Det du redan har.</h2><p style="color:var(--ink2)">Lägg till glasen du har hemma. Då ser du vad som saknas i serien, och om något går sönder ersätter du det på två klick.</p>
    <div class="gk-list">${owned.map((o,i)=>{const p=byId[o.id];return `<div class="gk-item">${p?`<img src="${img(p,true)}" data-pimg="${p.id}" alt="">`:silBox(o.shape)}<div><b>${esc(o.name)}</b><small>${o.count} st${p?" · serie "+esc(p.series):" · "+esc(SHNAME[o.shape]||"eget glas")}</small></div><div class="acts"><button class="small-btn" data-broke="${i}">Ett gick sönder</button><button class="small-btn" data-ocount="${i}~1" aria-label="En till">+</button><button class="small-btn" data-ocount="${i}~-1" aria-label="En färre">−</button></div></div>`}).join("")||'<p class="gk-empty">Inga glas än. Lägg till från vårt sortiment eller ett eget glas nedan.</p>'}</div>
    <form class="inline-form" id="ownAdd"><select id="ownSel" aria-label="Välj glas"><option value="">Lägg till ett glas från sortimentet</option>${P.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join("")}</select><input id="ownCnt" type="number" min="1" max="48" value="2" aria-label="Antal" style="max-width:90px"><button class="small-btn">Lägg till</button></form>
    <form class="inline-form" id="ownCustom"><input id="ownName" placeholder="Eller ett eget glas, till exempel Mormors vinglas" aria-label="Namn på eget glas"><select id="ownShape" aria-label="Form">${Object.entries(SHNAME).map(([k,v])=>`<option value="${k}">${v}</option>`).join("")}</select><button class="small-btn">Lägg till eget</button></form>
    ${missing.length?`<div style="margin-top:20px"><span class="mono">Saknas i serien</span><div class="gk-list">${missing.map(p=>`<div class="gk-item" data-open="${p.id}" style="cursor:pointer"><img src="${img(p,true)}" data-pimg="${p.id}" alt=""><div><b>${esc(p.name)}</b><small>Samma serie som dina glas</small></div><span>${kr(p.price)}</span></div>`).join("")}</div></div>`:""}
  </section>
  <section class="gk span5"><span class="mono">Fotografera ditt glas</span><h2 class="gk-h">Vilket glas är det här?</h2><p style="color:var(--ink2)">Ta en bild på ett glas du har. Vi känner igen formen och föreslår glas som matchar eller kompletterar.</p>
    <div class="photo-drop" id="photoDrop" tabindex="0" role="button">${photoState?.url?`<img src="${photoState.url}" alt="Ditt foto">`:`<span>Klicka för att välja eller ta en bild</span>`}</div>
    <div id="photoOut"></div>
  </section>`;
  T.sparat=`<section class="gk"><span class="mono">Favoriter</span><h2 class="gk-h">${S.favs.length?S.favs.length+" sparade":"Inga favoriter än"}</h2>
    <div class="gk-list">${S.favs.map(id=>byId[id]).filter(Boolean).map(p=>`<div class="gk-item"><img src="${img(p,true)}" data-pimg="${p.id}" alt="" data-open="${p.id}" style="cursor:pointer"><div><b>${esc(p.name)}</b><small>${kr(p.price)}</small></div><div class="acts"><button class="small-btn" data-add="${p.id}">Köp</button><button class="small-btn" data-fav="${p.id}" aria-pressed="true" aria-label="Ta bort favorit">${heartSvg}</button></div></div>`).join("")||'<p class="gk-empty">Tryck på hjärtat på ett glas, eller swipea uppåt i Glas-swipe.</p>'}</div>
  </section>
  <section class="gk"><span class="mono">Listor</span><h2 class="gk-h">Önskelistor och bröllopslistor.</h2>
    ${S.lists.map(l=>`<div style="margin-top:14px"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b>${esc(l.name)}</b><span class="acts" style="display:flex;gap:6px;flex-wrap:wrap">${l.pub?`<a class="small-btn" href="#lista-${esc(l.pub)}">${(n=>n==null?"Öppna":n+" av "+l.items.length+" köpta")(listBought(l.pub))}</a>`:""}<button class="small-btn" data-lpub="${esc(l.id)}">${l.pub?"Dela igen":"Dela länk"}</button>${l.id!=="onske"?`<button class="small-btn" data-ldel="${esc(l.id)}">Ta bort</button>`:""}</span></div><div class="gk-list">${l.items.map(id=>byId[id]).filter(Boolean).map(p=>`<div class="gk-item"><img src="${img(p,true)}" data-pimg="${p.id}" alt=""><div><b>${esc(p.name)}</b><small>${kr(p.price)}</small></div><button class="small-btn" data-lrm="${esc(l.id)}~${p.id}">Ta bort</button></div>`).join("")||'<p class="gk-empty">Tom. Spara glas hit från produktsidan.</p>'}</div></div>`).join("")}
    <form class="inline-form" id="listNew"><input id="listName" placeholder="Ny lista, till exempel Bröllop 2027" aria-label="Namn på ny lista"><button class="small-btn">Skapa</button></form>
    <p class="note">Dela länken, så kan gästerna köpa glas och markera dem. Alla ser vad som redan är köpt.</p>
  </section>
  <section class="gk"><span class="mono">Sparade val</span><h2 class="gk-h">Dukningar, kit och förslag.</h2>
    <div class="gk-list">${S.saved.slice(0,8).map((s,i)=>`<div class="gk-item"><span class="sil">${sil(s.type==="dukning"?"rott":s.type==="kit"?"whisky":s.type==="swipe"?"coupe":"vitt","currentColor",6)}</span><div><b>${esc(s.title)}</b><small>${fmtDate(s.ts)}</small></div><div class="acts">${s.bord?`<a class="small-btn" href="#bord-${esc(s.bord)}">Röster</a>`:""}<button class="small-btn" data-sopen="${i}">Öppna</button><button class="small-btn" data-sdel="${i}" aria-label="Ta bort">×</button></div></div>`).join("")||'<p class="gk-empty">Spara en dukning, ett barkit eller dina förslag från Glasguiden.</p>'}</div>
  </section>
  <section class="gk"><span class="mono">Bevakningar</span><h2 class="gk-h">Serier du följer</h2>
    <div class="gk-list">${S.watches.map((w,i)=>`<div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><span>${esc(w.series)}<small style="display:block;color:var(--muted)">Nyheter och prisändringar</small></span><button class="small-btn" data-wdel="${i}">Sluta</button></div>`).join("")||'<p class="gk-empty">Bevaka en serie från produktsidan.</p>'}</div>
  </section>`;
  T.kop=`<section class="gk wide"><span class="mono">Kvitton</span><h2 class="gk-h">${S.orders.length?"Dina köp":"Inga köp än"}</h2>
    <div class="gk-list">${S.orders.map(o=>`<div style="display:flex;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid var(--line);font-size:15px"><span><b>${esc(o.id)}</b> · ${fmtDate(o.ts)}<small style="display:block;color:var(--muted)">${o.lines.map(l=>l.id==="provlada"?"Provlåda":esc(byId[l.id]?.name||"")).join(", ")}</small></span><span style="text-align:right">${kr(o.total)}<br>${o.withdrawn?`<small style="color:var(--muted)">Ångrat ${fmtDate(o.withdrawn)}</small>`:Date.now()-o.ts<60*864e5?`<button class="small-btn" data-anger="${esc(o.id)}" style="margin-top:6px">Ångra köpet</button>`:""}</span></div>`).join("")||'<p class="gk-empty">Dina kvitton och krossgarantier samlas här.</p>'}</div>
  </section>`;
  const acct=authOn()?(u?`<section class="gk wide acct"><div><span class="mono">Ditt konto</span><h2 class="gk-h">${esc(u.displayName||"Inloggad")}</h2><p style="color:var(--ink2)">${esc(u.email||"")}${u.email&&!u.emailVerified&&u.providerData[0]?.providerId==="password"?" · bekräfta e-posten via länken vi skickade":""}</p></div><div class="pdp-actions"><button class="small-btn" data-logout>Logga ut</button><button class="small-btn" data-delacc>Radera konto</button></div></section>`
    :`<section class="gk wide acct acct-out"><div><span class="mono">Konto</span><h2 class="gk-h">Spara ditt glasskåp på alla enheter.</h2><p style="color:var(--ink2)">Logga in med Google eller e-post. Det du redan sparat här följer med in på kontot.</p></div><div class="pdp-actions"><button class="btn btn-google" data-login="google">${GSVG} Fortsätt med Google</button><button class="btn btn-ghost" data-login="in">Logga in med e-post</button></div></section>`)
    :`<section class="gk wide acct"><div><span class="mono">Ditt konto</span><h2 class="gk-h">${window.claude?"Inloggad via Claude":"Inloggning kommer snart"}</h2><p style="color:var(--ink2)">${window.claude?"Glasskåpet sparas på ditt Claude-konto.":"Tills dess sparas allt i den här webbläsaren."}</p></div></section>`;
  T.konto=acct+`<section class="gk wide" style="display:flex;justify-content:space-between;gap:20px;align-items:center;flex-wrap:wrap"><div><span class="mono">Din data</span><p style="color:var(--ink2);margin-top:6px">${cloud.on?"Sparas privat på ditt konto. Bara du kan se den.":"Sparas bara i den här webbläsaren. Logga in för att spara på ditt konto."}</p></div><button class="small-btn" id="gkWipe">Radera all min data</button></section>`;
  el.innerHTML=head+guestBar+tabs+`<div class="gk-grid" id="gkPanel">${T[gkTab]||T.oversikt}</div>`;
  if(gkTab==="glas")renderPhotoOut();
}
document.addEventListener("click",e=>{
  const g=e.target.closest("[data-gtab]");
  if(g){gkTab=g.dataset.gtab;if(curView==="glasskap"&&!gkGate()){renderGlasskap();const t=$(`#gk [data-gtab="${gkTab}"]`);if(t&&g.closest("#gk"))t.focus()}}
  if(e.target.closest("[data-guest]")){gkGuest=true;try{sessionStorage.setItem("skal-gk-guest","1")}catch(x){}renderGlasskap();scrollTo({top:0,behavior:"smooth"})}
  const m=e.target.closest("[data-mm]");
  if(m){closeMenu();if(m.dataset.mm==="search")setTimeout(()=>$("#searchBtn").click(),250);else $("#skinBtn").click()}
});
/* Mjuk påminnelse om inloggning när något sparas utan konto. Visas en gång per besök. */
const NUDGE={stil:["Din stil är klar.","Logga in så sparas den på ditt konto och följer med dig. Då anpassas sidan efter dig på alla enheter."],fav:["Spara dina favoriter.","Logga in så finns favoriterna kvar i Mitt glasskåp, på alla dina enheter."],sparat:["Sparat i webbläsaren.","Logga in så följer det med dig till Mitt glasskåp på alla dina enheter."]};
function nudgeLogin(kind){
  if(!authOn()||AUTH.user||!AUTH.api)return;
  try{if(sessionStorage.getItem("skal-nudge"))return;sessionStorage.setItem("skal-nudge","1")}catch(e){}
  const [h,p]=NUDGE[kind]||NUDGE.sparat;
  setTimeout(()=>{if(!modal.classList.contains("open"))openLogin("in",{h,p})},kind==="stil"?900:300);
}
onState(()=>{if(curView==="glasskap")renderGlasskap()});
$("#gk").addEventListener("click",e=>{
  const t=e.target;
  const br=t.closest("[data-broke]");if(br){breakFlow(+br.dataset.broke);return}
  const oc=t.closest("[data-ocount]");if(oc){const [i,d]=oc.dataset.ocount.split("~").map(Number);const o=S.owned[i];o.count+=d;if(o.count<=0)S.owned.splice(i,1);save();return}
  const ls=t.closest("[data-lshare]");if(ls){const L=S.lists.find(l=>l.id===ls.dataset.lshare);copy(`${L.name} hos SKÅL & CO:\n`+L.items.map(id=>byId[id]).filter(Boolean).map(p=>`${p.name}, ${kr(p.price)}`).join("\n"),"Listan är kopierad");return}
  const ld=t.closest("[data-ldel]");if(ld){S.lists=S.lists.filter(l=>l.id!==ld.dataset.ldel);save();return}
  const lr=t.closest("[data-lrm]");if(lr){const [lid,pid]=lr.dataset.lrm.split("~");const L=S.lists.find(l=>l.id===lid);L.items=L.items.filter(x=>x!==pid);save();return}
  const so=t.closest("[data-sopen]");if(so){const s=S.saved[+so.dataset.sopen];
    if(s.type==="dukning"){location.hash="dukning";setTimeout(()=>loadDukning(s.data),0)}
    else if(s.type==="kit"){kit=s.data.kit;renderKit();location.hash="barstudion"}
    else if(s.type==="guide"){openModal(`<div class="co"><span class="mono">Sparade förslag</span><h2 style="margin:8px 0 16px">${esc(s.title)}</h2><div class="gk-list">${s.data.ids.map(id=>byId[id]).filter(Boolean).map(p=>{const packs=Math.ceil(s.data.count/p.pack);return `<div class="gk-item"><img src="${img(p,true)}" alt=""><div><b>${esc(p.name)}</b><small>${packs} × ${packTxt(p)}</small></div><button class="small-btn" data-add="${p.id}" data-qty="${packs}">Köp</button></div>`}).join("")}</div></div>`,"Sparade förslag","saved")}
    else if(s.type==="grupp"&&s.data&&s.data.code)location.hash="rum-"+s.data.code;
    else location.hash="upptack";
    return}
  const sd=t.closest("[data-sdel]");if(sd){S.saved.splice(+sd.dataset.sdel,1);save();return}
  const wd=t.closest("[data-wdel]");if(wd){S.watches.splice(+wd.dataset.wdel,1);save();return}
  const dd=t.closest("[data-ddel]");if(dd){S.dates.splice(+dd.dataset.ddel,1);save();return}
  if(t.closest("#photoDrop")){$("#photoIn").click();return}
  const pa=t.closest("[data-photoadd]");if(pa){S.owned.push({name:photoState.name||SHNAME[pa.dataset.photoadd],shape:pa.dataset.photoadd,count:1});save();toast("Glaset finns nu i ditt glasskåp");return}
  const ps=t.closest("[data-pshape]");if(ps){photoState.shape=ps.dataset.pshape;renderPhotoOut();return}
  if(t.closest("#gkWipe")){openModal(`<div class="co"><span class="mono">Radera data</span><h2 style="margin:8px 0 12px">Radera allt i Mitt glasskåp?</h2><p class="lead">Favoriter, listor, glas, sparade val, poäng och kvitton tas bort${cloud.on?" från ditt konto och den här webbläsaren":" från den här webbläsaren"}. Det går inte att ångra.</p><div class="pdp-actions" style="margin-top:20px"><button class="btn btn-primary" id="wipeYes">Ja, radera allt</button><button class="btn btn-ghost" data-mclose>Avbryt</button></div></div>`,"Radera data","wipe");
    $("#wipeYes").addEventListener("click",()=>{S=DEF();save();closeModal();toast("All din data är raderad")});}
});
$("#gk").addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.id==="photoDrop")$("#photoIn").click()});
$("#gk").addEventListener("submit",e=>{e.preventDefault();
  if(e.target.id==="ownAdd"){const id=$("#ownSel").value,n=Math.max(1,+$("#ownCnt").value||1);if(!id){toast("Välj ett glas");return}const p=byId[id],o=S.owned.find(x=>x.id===id);if(o)o.count+=n;else S.owned.push({id,name:p.name,shape:p.shape,count:n});save()}
  if(e.target.id==="ownCustom"){const n=$("#ownName").value.trim();if(!n){toast("Ge glaset ett namn");return}S.owned.push({name:n.slice(0,50),shape:$("#ownShape").value,count:1});save()}
  if(e.target.id==="listNew"){const n=$("#listName").value.trim();if(!n)return;S.lists.push({id:"l"+Date.now(),name:n.slice(0,40),type:/bröllop/i.test(n)?"brollop":"egen",items:[]});save()}
});
function breakFlow(i){
  const o=S.owned[i],p=byId[o.id];
  const bought=p&&S.orders.some(ord=>ord.lines.some(l=>l.id===p.id));
  openModal(`<div class="co"><span class="mono">Ersätt ett glas</span><h2 style="margin:8px 0 12px">Tråkigt med ${esc(o.name)}.</h2>
  ${bought?`<p class="lead">Glaset är köpt hos oss, så krossgarantin gäller. Skicka en bild, så skickar vi ett nytt utan kostnad.</p><div class="pdp-actions" style="margin-top:18px"><button class="btn btn-primary" id="brClaim">Skicka bild och beställ ersättning</button></div>`
  :p?`<p class="lead">Du kan köpa ett enstaka glas i serien ${esc(p.series)}, så blir setet helt igen.</p><div class="pdp-actions" style="margin-top:18px"><button class="btn btn-primary" id="brBuy">Köp ett enstaka glas, ${kr(Math.ceil(per(p)))}</button></div>`
  :`<p class="lead">Det här glaset finns inte i vårt sortiment. Här är glas med samma form.</p><div class="gk-list">${P.filter(x=>FAMILY[x.shape]===FAMILY[o.shape]).slice(0,3).map(x=>`<div class="gk-item" data-open="${x.id}" style="cursor:pointer"><img src="${img(x,true)}" alt=""><div><b>${esc(x.name)}</b><small>${kr(per(x))} per glas</small></div></div>`).join("")}</div>`}
  <p class="note" style="margin-top:14px">Visningsversion: ingen beställning skickas.</p></div>`,"Ersätt ett glas","break");
  $("#brClaim")?.addEventListener("click",()=>{$("#mbody").innerHTML=`<div class="co" style="text-align:center"><h2 style="margin:12px 0">Ersättningen är beställd.</h2><p class="lead" style="margin:0 auto">Ett nytt ${esc(o.name)} skickas inom ett dygn. Skärvorna behöver vi inte. (Visning.)</p><div class="pdp-actions" style="justify-content:center;margin-top:20px"><button class="btn btn-ghost" data-mclose>Stäng</button></div></div>`;save()});
  $("#brBuy")?.addEventListener("click",()=>{addCart(p.id,1,true);toast("Ett enstaka "+p.name+" ligger i varukorgen (visas som förpackning i visningsversionen)");closeModal()});
}
/* Foto av eget glas */
$("#photoIn").addEventListener("change",async e=>{
  const f=e.target.files[0];e.target.value="";if(!f)return;
  if(photoState?.url)URL.revokeObjectURL(photoState.url);
  photoState={url:URL.createObjectURL(f),blob:f,shape:null,name:"",busy:true,ai:false};
  renderGlasskap();renderPhotoOut();
  const sample=await getSample();
  if(sample){try{
    const lim=await sample.limits();
    if(lim&&lim.images){
      const out=await sample.json(`Titta på bilden av ett dricksglas eller en kopp. Välj den form som stämmer bäst bland ${JSON.stringify(Object.keys(SHNAME))}. Svara bara med JSON: {"shape":"...","name":"kort svensk beskrivning av glaset, max fem ord","note":"en kort mening på svenska utan tankstreck om vad du ser"}. Om bilden inte visar ett glas, sätt shape till null.`,{images:[f],modelTier:"quick"});
      if(out&&SH[out.shape]){photoState.shape=out.shape;photoState.name=String(out.name||"").slice(0,50);photoState.note=String(out.note||"").slice(0,160);photoState.ai=true}
      else if(out&&out.shape===null)photoState.note="Vi ser inget glas på bilden. Välj formen själv nedan.";
    }
  }catch(err){if(err&&err.code==="not_granted")aiOff=true}}
  photoState.busy=false;track("tool_use",{tool:"fotografera-glas",ai:photoState.ai});renderPhotoOut();
});
function renderPhotoOut(){
  const out=$("#photoOut");if(!out||!photoState)return;
  if(photoState.busy){out.innerHTML='<p class="ai-note"><i class="spin"></i>Tittar på bilden</p>';return}
  const sh=photoState.shape;
  const match=sh?P.filter(p=>p.shape===sh):[];const fam=sh?P.filter(p=>p.shape!==sh&&FAMILY[p.shape]===FAMILY[sh]):[];
  out.innerHTML=`${photoState.note?`<p class="note">${esc(photoState.note)}</p>`:""}
  ${sh?`<p style="margin-top:10px">${photoState.ai?"Det ser ut som":"Du valde"}: <b>${esc(photoState.name||SHNAME[sh])}</b> (${esc(SHNAME[sh].toLowerCase())})</p>`:`<p class="note" style="margin-top:10px">Välj formen som liknar ditt glas mest:</p>`}
  <div class="shape-pick">${["rott","vitt","coupe","cocktail","whisky","tumbler","kaffe","dubbel"].map(k=>`<button data-pshape="${k}" aria-pressed="${k===sh}">${sil(k,"currentColor",6)}${SHNAME[k]}</button>`).join("")}</div>
  ${sh?`<div class="pdp-actions" style="margin-top:12px"><button class="small-btn" data-photoadd="${sh}">Lägg till i Mina glas</button></div>
  ${match.length||fam.length?`<div class="gk-list">${[...match,...fam].slice(0,3).map(p=>`<div class="gk-item" data-open="${p.id}" style="cursor:pointer"><img src="${img(p,true)}" alt=""><div><b>${esc(p.name)}</b><small>${p.shape===sh?"Samma form":"Kompletterar"}</small></div><span>${kr(p.price)}</span></div>`).join("")}</div>`:""}`:""}`;
}

/* ---------- Glassommelieren: Claude med verktyg, annars regler ---------- */
let samplePromise=null, aiOff=false;
function getSample(){
  if(aiOff||!window.claude||typeof window.claude.use!=="function")return Promise.resolve(null);
  if(!samplePromise)samplePromise=window.claude.use("sample").catch(()=>null);
  return samplePromise;
}
const conc=$("#conc"),msgs=$("#msgs");
let convo=[],busy=false;
function botBubble(){const d=document.createElement("div");d.className="msg bot";msgs.appendChild(d);return d}
function meSay(t){const d=document.createElement("div");d.className="msg me";d.textContent=t;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight}
function prodMini(p,qty){return `<div class="mp"><img src="${img(p,true)}" alt="" data-open="${p.id}" style="cursor:pointer"><div><b>${esc(p.name)}</b><small>${esc(p.mat)} · ${p.vol} cl · ${p.cat==="karaff"?kr(p.price):kr(per(p))+"/glas"}${p.props.includes("diskmaskin")?" · tål diskmaskin":""}</small></div><button class="round" data-add="${p.id}" ${qty?`data-qty="${qty}"`:""} aria-label="Lägg ${esc(p.name)} i varukorgen">+</button></div>`}
function renderAI(text){
  const parts=String(text).split(/\[\[([a-z]+)\]\]/);
  return parts.map((s,i)=>i%2?(byId[s]?prodMini(byId[s]):""):esc(s).trim().replace(/\n{2,}/g,"<br><br>").replace(/\n/g,"<br>").replace(/\*\*(.+?)\*\*/g,"<b>$1</b>")).join("");
}
const NUM={två:2,tre:3,fyra:4,fem:5,sex:6,sju:7,åtta:8,tio:10,tolv:12};
/* Glassommelieren läser stilen och setet från Glasguiden och Glas-swipe */
function setAdvice(){
  const picks=((S.finder&&S.finder.picks)||[]).map(id=>byId[id]).filter(Boolean),owned=S.owned.map(o=>byId[o.id]).filter(Boolean),have=[...picks,...owned],ids=new Set(have.map(p=>p.id)),cats=new Set(have.map(p=>p.cat));
  if(!have.length&&!S.profile)return "Jag vet inte din stil än. Gör Glasguiden eller Glas-swipe, så kan jag komplettera ditt set. Eller berätta vad du dricker, så föreslår jag något direkt.";
  const out=[],add=(p,why)=>{if(p&&!ids.has(p.id)&&!out.some(o=>o.p.id===p.id))out.push({p,why})};
  const best=f=>recommend(P.length,[...ids]).map(r=>r.p).find(f);
  if((cats.has("vin")||cats.has("champagne"))&&!cats.has("karaff"))add(byId.karaff,"Ger vinet luft och samlar bordet.");
  if(!cats.has("vatten")&&have.length)add(best(p=>p.cat==="vatten"),"Ett vattenglas vid varje kuvert gör setet komplett.");
  if(cats.has("vin")&&!cats.has("champagne")&&S.finder&&(S.finder.occ==="fest"||S.finder.occ==="middag"))add(best(p=>p.cat==="champagne"),"Till skålen innan middagen.");
  if(cats.has("whisky")&&!cats.has("cocktail"))add(best(p=>p.cat==="cocktail"),"För hemmabaren när någon vill ha något annat än whisky.");
  recommend(4,[...ids]).forEach(r=>add(r.p,r.why?r.why+".":"Passar din stil."));
  const intro=picks.length?`Ditt set från Glasguiden är ${picks.map(p=>p.name).join(", ")}${S.profile?`, och din stil är ${S.profile.name.toLowerCase()}`:""}. Det här skulle jag lägga till:`:S.profile?`Din stil är ${S.profile.name.toLowerCase()}: du gillar ${S.profile.summary}. Det här passar dig:`:"Utifrån glasen du har skulle jag lägga till:";
  return esc(intro)+out.slice(0,3).map(o=>prodMini(o.p)+`<p class="note" style="margin:2px 0 8px">${esc(o.why)}</p>`).join("");
}
function answer(raw){
  const t=raw.toLowerCase();
  if(/bly|blyfri|ursprung|tillverkas i|vilket land/.test(t))return "Den uppgiften har vi inte verifierad i produktdatan än, så jag vill inte gissa. Vi lägger bara upp fakta från tillverkaren.";
  const drinks=VOCAB.filter(([k,,r])=>k==="drink"&&r.test(t)).map(([,v])=>v);
  const b=t.match(/(\d[\d\s]{1,6})\s*(kr|kronor|:-)/); const budget=b?+b[1].replace(/\s/g,""):null;
  let cnt=null;const c=t.match(/(\d+)\s*(st|glas|koppar)/);if(c)cnt=+c[1];else for(const [w,v] of Object.entries(NUM))if(hasWord(t,w))cnt=v;
  const wantDish=/diskmaskin/.test(t), thin=/tunn|elegant|lätt|munblås/.test(t), gift=/present|bröllop|gåva/.test(t), mine=/mitt glasskåp|jag har|mina glas|saknas/.test(t);
  if(/mitt set|min stil|komplettera|lägga till|vad mer|passar mig/.test(t))return setAdvice();
  if(mine){const r=recommend(3,S.owned.map(o=>o.id));return (S.owned.length?`Du har ${S.owned.length} sorters glas i Mitt glasskåp. Det här kompletterar dem:`:"Du har inga glas i Mitt glasskåp än. Det här är bra att börja med:")+r.map(x=>prodMini(x.p)).join("")}
  let L=P.filter(p=>!drinks.length||drinks.some(d=>p.drinks.includes(d)||p.cat===d));
  if(!/karaff|kanna/.test(t))L=L.filter(p=>p.cat!=="karaff");
  if(wantDish)L=L.filter(p=>p.props.includes("diskmaskin"));
  if(thin)L.sort((a,b)=>(b.props.includes("munblast")+b.props.includes("kristall"))-(a.props.includes("munblast")+a.props.includes("kristall")));
  if(gift)L.sort((a,b)=>b.occ.includes("present")-a.occ.includes("present"));
  const named=P.find(p=>t.includes(p.name.toLowerCase())||t.includes(p.series.toLowerCase()));
  if(named&&!drinks.length)return `${esc(named.name)}: ${esc(named.why)} ${named.props.includes("diskmaskin")?"Tål diskmaskin enligt tillverkaren.":"Tillverkaren rekommenderar handdisk."}`+prodMini(named);
  if(!drinks.length&&!budget&&!wantDish&&!gift)return "Berätta gärna vad du ska dricka, hur många glas du behöver och ungefär vad du vill lägga. Till exempel: sex champagneglas till nyår för 1 500 kr.";
  L=L.slice(0,3);
  if(!L.length)return "Det har jag inget bra svar på i visningsversionens sortiment. Prova att beskriva drycken, så hittar jag närmaste alternativ.";
  const n=cnt||2;
  const intro=budget?`För ${n} glas och ${kr(budget)} blir det ${kr(budget/n)} per glas. Det här passar:`:`Här är ${L.length===1?"ett förslag":L.length+" förslag"}${cnt?" för "+cnt+" glas":""}:`;
  return intro+L.map(p=>{const packs=Math.ceil(n/p.pack),cost=packs*p.price,ok=!budget||cost<=budget;return prodMini(p,packs).replace("</small>",`${budget?(ok?` · ${kr(cost)} totalt`:` · ${kr(cost)}, över budget`):""}</small>`)}).join("")+`<p style="margin-top:8px">${esc(L[0].why)}</p>`;
}
const SYS=`Du är Glassommelieren hos SKÅL & CO, en svensk webbutik som säljer glas, koppar och karaffer från europeiska glasbruk. Det här är en visningsversion med ett litet exempelsortiment.
Regler:
1. Svara kort och vänligt på enkel svenska, högst 110 ord. Använd aldrig tankstreck.
2. Använd bara fakta som verktygen ger. Gissa aldrig material, bly, ursprung, vikt eller diskmaskin. Saknas en uppgift, säg att den inte är verifierad än.
3. Visa en produkt genom att skriva [[produkt-id]] på en egen rad, till exempel [[bourgogne]]. Högst tre produkter per svar.
4. Räkna förpackningar: antal glas delat med förpackningens storlek, avrundat uppåt.
5. Lägg bara något i varukorgen när kunden uttryckligen ber om det.
6. Har kunden en stil eller ett set i Mitt glasskåp: hämta det med my_glasskap och utgå från det. Föreslå det som saknas, inte det kunden redan har.
7. Frågor som inte handlar om glas, dryck, dukning eller butiken: svara artigt att du bara kan hjälpa till med det.`;
const pub=p=>({id:p.id,namn:p.name,material:p.mat,serie:p.series,volym_cl:p.vol,hojd_cm:p.h,diameter_cm:p.d,forpackning:p.pack,pris_kr:p.price,pris_per_glas:Math.round(per(p)),diskmaskin:p.props.includes("diskmaskin")?"ja enligt tillverkaren":"nej, handdisk",egenskaper:p.props.map(x=>PROPS[x]),passar_till:p.drinks.map(d=>DRINKN[d]),stil:p.style.map(s=>STYLEN[s]),tillfallen:p.occ,varfor:p.why});
const TOOLS_AI=[
 {name:"search_products",description:"Sök i sortimentet. Alla fält är frivilliga.",inputSchema:{type:"object",properties:{drink:{type:"string",enum:Object.keys(DRINKN)},max_per_glass:{type:"number"},dishwasher:{type:"boolean"},style:{type:"string",enum:Object.keys(STYLEN)},occasion:{type:"string",enum:["vardag","middag","fest","hemmabar","frukost","present"]}}},
  execute:(i={})=>{let L=P.filter(p=>(!i.drink||p.drinks.includes(i.drink)||p.cat===i.drink)&&(!i.max_per_glass||per(p)<=i.max_per_glass)&&(i.dishwasher!==true||p.props.includes("diskmaskin"))&&(!i.style||p.style.includes(i.style))&&(!i.occasion||p.occ.includes(i.occasion)));if(i.drink!=="karaff")L=L.filter(p=>p.cat!=="karaff"||i.drink==="karaff");return {antal:L.length,produkter:L.map(pub)}}},
 {name:"get_product",description:"Hämta alla fakta om en produkt med dess id.",inputSchema:{type:"object",properties:{id:{type:"string"}},required:["id"]},execute:i=>{const p=byId[i&&i.id];if(!p)throw new Error("Okänt id");return {...pub(p),berattelse:p.story}}},
 {name:"add_to_cart",description:"Lägg en produkt i kundens varukorg. Använd bara när kunden ber om det. qty är antal förpackningar.",inputSchema:{type:"object",properties:{id:{type:"string"},qty:{type:"integer",minimum:1,maximum:12}},required:["id"]},execute:i=>{const p=byId[i&&i.id];if(!p)throw new Error("Okänt id");const q=Math.min(12,Math.max(1,parseInt(i.qty)||1));addCart(p.id,q,true);return {ok:true,lagt_till:q+" × "+p.name}}},
 {name:"my_glasskap",description:"Kundens sparade glas, favoriter och smakprofil från Mitt glasskåp.",inputSchema:{type:"object",properties:{}},execute:()=>({glas_hemma:S.owned.map(o=>({namn:o.name,form:SHNAME[o.shape],antal:o.count,id:o.id||null})),favoriter:S.favs,smakprofil:S.profile?S.profile.name+": "+S.profile.summary:null,glasguiden:S.finder?{sammanfattning:finderSummary(S.finder),valda_glas:S.finder.picks||[],krav:S.finder.must||[],budget_per_glas:S.finder.budget||null}:null})}
];
async function ask(q){
  if(busy)return;busy=true;$("#sugg").hidden=true;
  meSay(q);
  const sample=await getSample();track("tool_use",{tool:"glassommelieren",ai:!!sample});
  const bub=botBubble();
  if(!sample){bub.innerHTML='<span class="spin"></span>';await new Promise(r=>setTimeout(r,reduce?0:400));bub.innerHTML=answer(q);msgs.scrollTop=msgs.scrollHeight;busy=false;return}
  convo.push({role:"user",content:q});convo=convo.slice(-10);
  const messages=convo.map((m,i)=>i===0?{role:"user",content:SYS+"\n\nKunden skriver: "+m.content}:m);
  bub.innerHTML='<span class="spin"></span>';
  try{
    const res=await sample(messages,{tools:TOOLS_AI,cache:false,modelTier:"default",onText:({text})=>{bub.innerHTML=renderAI(text);msgs.scrollTop=msgs.scrollHeight}});
    const text=res&&res.text?res.text:"";
    bub.innerHTML=renderAI(text)||"Jag fick inget svar. Prova att fråga igen.";
    convo.push({role:"assistant",content:text||"(inget svar)"});
  }catch(e){
    convo.pop();
    if(e&&e.code==="not_granted"){aiOff=true;setConcMode()}
    bub.innerHTML=(e&&e.code==="rate_limited"?"Många frågor just nu. Här är ett snabbt svar så länge:<br>":"")+answer(q);
  }
  msgs.scrollTop=msgs.scrollHeight;busy=false;
}
const SUG=["Fyra tunna vinglas för 1 000 kr","Vad passar till glasen jag har?","Present till en whiskyälskare","Är glasen blyfria?"];
function renderSugg(){const own=[];if(S.finder&&S.finder.picks&&S.finder.picks.length)own.push("Vad passar till mitt set?");else if(S.profile)own.push("Glas som passar min stil");$("#sugg").innerHTML=[...own,...SUG].slice(0,4).map(s=>`<button>${s}</button>`).join("")}
renderSugg();
$("#sugg").addEventListener("click",e=>{const b=e.target.closest("button");if(b)ask(b.textContent)});
$("#concForm").addEventListener("submit",e=>{e.preventDefault();const v=$("#concIn").value.trim();if(v){ask(v.slice(0,500));$("#concIn").value=""}});
async function setConcMode(){const s=await getSample();$("#concMode").textContent=s?"Drivs av Claude. Svarar bara utifrån vårt sortiment.":"Svarar utifrån vårt sortiment. Visningsversion."}
function openConc(q){
  conc.inert=false;conc.classList.add("open");conc.setAttribute("aria-hidden","false");$("#concBtn").style.opacity=0;
  if(!msgs.children.length){const b=botBubble(),pk=(S.finder&&S.finder.picks||[]).length;
    b.textContent=S.profile||pk?`Hej${cloud.name?" "+cloud.name.split(" ")[0]:""}! ${S.profile?"Din stil är "+S.profile.name.toLowerCase()+". ":""}${pk?"Jag ser ditt set från Glasguiden. ":""}Vill du att jag kompletterar det, eller letar du efter något annat?`:"Hej! Jag hjälper dig hitta rätt glas. Vad ska du dricka, hur många glas behöver du och vad får det kosta?";
    renderSugg();setConcMode()}
  if(q)ask(q);else setTimeout(()=>$("#concIn").focus(),200);
}
$("#concBtn").addEventListener("click",()=>openConc());
$("#concX").addEventListener("click",()=>{conc.classList.remove("open");conc.setAttribute("aria-hidden","true");conc.inert=true;$("#concBtn").style.opacity=1});

/* ---------- Mörkt och ljust läge ---------- */
function setSkin(s){root.dataset.skin=s;try{localStorage.setItem("skal-skin",s)}catch(e){}$("#skinBtn").setAttribute("aria-label",s==="dark"?"Byt till ljust läge":"Byt till mörkt läge");document.querySelector('meta[name="theme-color"]').content=s==="dark"?"#141110":"#f3eee6";refreshImages();if(curView==="glasvaggen")renderWall()}
$("#skinBtn").addEventListener("click",()=>{setSkin(root.dataset.skin==="dark"?"light":"dark");if(modal.classList.contains("open")&&modal.dataset.kind==="product"&&pState.tab==="foto"){pState.lightOn=light();renderStage()}});

/* ---------- Meny ---------- */
const mm=$("#mmenu");
function closeMenu(){mm.classList.remove("open");mm.setAttribute("aria-hidden","true");mm.inert=true;$("#menuBtn").setAttribute("aria-expanded","false")}
$("#menuBtn").addEventListener("click",()=>{const o=!mm.classList.contains("open");mm.classList.toggle("open",o);mm.setAttribute("aria-hidden",String(!o));mm.inert=!o;$("#menuBtn").setAttribute("aria-expanded",String(o));onScroll()});
mm.addEventListener("click",e=>{if(e.target.closest("a"))closeMenu()});
document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;
  if(!mega.hidden){closeMega();megaBtn.focus()}else if(modal.classList.contains("open"))closeModal();else if($("#search").classList.contains("open"))openSearch(false);else if(drawer.classList.contains("open"))openCart(false);else if(conc.classList.contains("open"))$("#concX").click();else closeMenu()});

/* ---------- Avslöjanden ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12,rootMargin:"0px 0px -6% 0px"});

/* ---------- Hjälte: film som följer scrollen ---------- */
const hero=$("#hero"),video=$("#heroVideo"),bands=$$(".band"),cue=$("#cue"),loader=$("#loader"),bar=$("#loaderBar"),endImg=$(".hero-media img.end");
let staticMode=reduce||(navigator.connection&&navigator.connection.saveData)||location.protocol==="file:";
const heroPortrait=()=>matchMedia("(max-aspect-ratio: 1/1)").matches;
let duration=0,target=0,shown=0,ready=false,raf=0,heroStarted=false;
const lastOp=new Map();
function progress(){const r=hero.getBoundingClientRect();return Math.min(1,Math.max(0,-r.top/(hero.offsetHeight-innerHeight)))}
function updateBands(p){
  const wide=innerWidth>640;
  bands.forEach(b=>{const a=+b.dataset.in,z=+b.dataset.out,w=Math.min((z-a)*.28,.1);
    let o=p<a?0:p<a+w?(p-a)/w:p<z-w?1:p<z?(z-p)/w:0; if(a===0&&p<w)o=1; o=Math.round(o*100)/100;
    if(lastOp.get(b)!==o){lastOp.set(b,o);b.style.opacity=o;b.style.transform=(wide?"translateY(calc(-50% + ":"translateY(calc(0% + ")+((1-o)*18)+"px))"}});
  const c=p>.03?"0":"1";if(cue.style.opacity!==c)cue.style.opacity=c;
  if(staticMode)endImg.style.opacity=Math.min(1,Math.max(0,(p-.1)/.6)).toFixed(2);
}
function tick(){raf=0;const d=target-shown;shown+=Math.abs(d)<.002?d:d*.14;
  if(ready&&!video.seeking&&Math.abs(video.currentTime-shown)>.012){try{video.currentTime=shown}catch(e){}}
  if(Math.abs(target-shown)>.0005)raf=requestAnimationFrame(tick)}
function onScroll(){
  const home=curView==="hem";
  nav.classList.toggle("solid",!home||mm.classList.contains("open")||!mega.hidden||scrollY>hero.offsetHeight-innerHeight*.6);
  if(!home)return;
  const p=progress();updateBands(p);
  if(ready){target=p*Math.max(0,duration-.04);if(!raf)raf=requestAnimationFrame(tick)}
}
addEventListener("scroll",onScroll,{passive:true});addEventListener("resize",onScroll);
video.addEventListener("seeked",()=>{if(!raf&&Math.abs(target-shown)>.0005)raf=requestAnimationFrame(tick)});
async function loadVideo(){
  loader.classList.add("on");
  const res=await fetch((heroPortrait()?"assets/hero-m.mp4":innerWidth*(devicePixelRatio||1)>=1400?"assets/hero.mp4":"assets/hero-1280.mp4")+"?v=5");if(!res.ok)throw new Error("video "+res.status);
  const len=+res.headers.get("content-length")||0;let blob;
  if(res.body&&len){const rd=res.body.getReader(),parts=[];let got=0;for(;;){const {done,value}=await rd.read();if(done)break;parts.push(value);got+=value.length;bar.style.strokeDashoffset=113-113*got/len}blob=new Blob(parts,{type:"video/mp4"})}
  else blob=await res.blob();
  video.src=URL.createObjectURL(blob);
  video.muted=true;video.playsInline=true;video.preload="auto";video.load();
  /* iOS visar inga bildrutor förrän filmen har spelats en gång. Spela och pausa direkt. */
  const p=video.play();if(p&&p.then)p.then(()=>video.pause()).catch(()=>{});
  await new Promise((ok,no)=>{if(video.readyState>=2)return ok();video.addEventListener("loadeddata",ok,{once:true});video.addEventListener("error",no,{once:true})});
  video.pause();video.currentTime=0;
  duration=video.duration||6;ready=true;video.classList.add("ready");loader.classList.remove("on");onScroll();
}
function startHero(){if(heroStarted)return;heroStarted=true;
  if(staticMode)root.classList.add("static");
  else loadVideo().catch(()=>{staticMode=true;root.classList.add("static");loader.classList.remove("on");onScroll()});
}

/* ---------- Svävande partiklar ---------- */
const cv=$("#motes");
if(!reduce&&cv.getContext){
  const ctx=cv.getContext("2d"),dpr=Math.min(1.5,devicePixelRatio||1),N=innerWidth<700?16:34,m=[];let W,H;
  const size=()=>{W=cv.width=innerWidth*dpr;H=cv.height=innerHeight*dpr;cv.style.width=innerWidth+"px";cv.style.height=innerHeight+"px"};
  size();addEventListener("resize",size);
  for(let i=0;i<N;i++)m.push({x:Math.random(),y:Math.random(),r:(Math.random()*1.4+.4)*dpr,v:Math.random()*.00012+.00004,a:Math.random()*.32+.08,ph:Math.random()*6.28});
  let last=0,rgb="214,180,120";
  const mo=new MutationObserver(()=>{rgb=getComputedStyle(root).getPropertyValue("--mote").trim()||rgb});mo.observe(root,{attributes:true,attributeFilter:["data-skin"]});
  rgb=getComputedStyle(root).getPropertyValue("--mote").trim()||rgb;
  const loop=t=>{requestAnimationFrame(loop);if(t-last<33||document.hidden)return;last=t;ctx.clearRect(0,0,W,H);
    for(const p of m){p.y-=p.v;p.x+=Math.sin(t*.0003+p.ph)*.00008;if(p.y<-.02){p.y=1.02;p.x=Math.random()}
      ctx.beginPath();ctx.arc(p.x*W,p.y*H,p.r,0,6.283);ctx.fillStyle=`rgba(${rgb},${p.a*(.6+.4*Math.sin(t*.001+p.ph))})`;ctx.fill()}};
  requestAnimationFrame(loop);
}

/* ---------- Start ---------- */
viewHooks.hem=()=>{startHero();renderForDig();renderToday();renderRecent();renderTre()};
viewHooks.handla=renderShop;
viewHooks.glasguiden=()=>{if(!$("#gLine").getAttribute("d"))drawShape("rott","Bourgogne")};
viewHooks.upptack=()=>{if(swI<SWDECK.length)renderDeck()};
viewHooks.glasvaggen=renderWall;
viewHooks.dukning=()=>{if(pendingSeason){applySeason(pendingSeason);pendingSeason=null}else renderTable()};
viewHooks.provladan=renderTrial;
viewHooks.present=renderGift;
viewHooks.glasskap=renderGlasskap;
viewHooks.journal=renderJournal;
viewHooks.varumarken=renderBrands;
onState(()=>{if(curView==="hem"){renderForDig()}});
setSkin(root.dataset.skin||"dark");
renderSeason();renderJournal();renderFinder();renderKit();renderCart();refreshHearts();
try{const ld=document.createElement("script");ld.type="application/ld+json";ld.textContent=JSON.stringify({"@context":"https://schema.org","@type":"ItemList","name":"Glas hos SKÅL & CO","itemListElement":P.map((p,i)=>({"@type":"ListItem","position":i+1,"item":{"@type":"Product","name":p.name,"image":"assets/p-"+p.img+".webp","description":p.why,"material":p.mat,"category":DRINKN[p.cat]||p.cat,"offers":{"@type":"Offer","price":p.price,"priceCurrency":"SEK","availability":"https://schema.org/InStock"}}}))}).replace(/</g,"\\u003c");document.head.appendChild(ld)}catch(e){}
$$(".rv").forEach(el=>io.observe(el));
route();
connectCloud();
initAuth();
setConcMode();
})();
