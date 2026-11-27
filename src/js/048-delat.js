/* ---------- Delat: önskelistor gäster kan köpa från, dukningar man röstar på, påminnelser i grupper ----------
   listor/{ID}/meta {owner, ownerName, name, type, items:[id], ts}   ägaren skriver. Alla med länken kan läsa.
   listor/{ID}/kopt/{produktid} {name, ts}                           vem som helst kan markera köpt en gång. Ägaren kan ångra.
   bord/{ID}/meta {owner, ownerName, title, data, ts}                ägaren skriver. Inloggade med länken kan läsa.
   bord/{ID}/rost/{uid} {name, v: 1|-1, c, ts}                       var och en skriver sin egen röst.
   rum/{KOD}/paminn/{uid} tidpunkt                                    den som skapade gruppen kan påminna. */
const id10=()=>{const A="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";let s="";for(let i=0;i<10;i++)s+=A[Math.floor(Math.random()*A.length)];return s};
const idOk=s=>/^[A-Za-z0-9]{10}$/.test(s||"");
const shareLink=h=>urlFor(h);
const firstName=()=>gMe().split(" ")[0];
async function shareOut(title,text,url,msg){
  if(navigator.share){try{await navigator.share({title,text,url});return}catch(e){if(e&&e.name==="AbortError")return}}
  copy(text+"\n"+url,msg||"Länken är kopierad. Klistra in den i sms, WhatsApp eller mejl.");
}
function needLogin(h,p){if(!authOn()){toast("Det här fungerar på den publicerade sajten med inloggning.");return true}if(!AUTH.user||!AUTH.rt){openLogin("in",{h,p});return true}return false}

/* ===== 1. Delade listor ===== */
const listSynced={};
async function pubList(L,silent){
  if(needLogin("Logga in för att dela listan.","Då kan gästerna öppna listan, köpa glas och se vad som redan är köpt."))return;
  const rt=AUTH.rt;if(!L.pub){L.pub=id10();save()}
  try{await rt.set(rt.ref("listor/"+L.pub+"/meta"),{owner:AUTH.user.uid,ownerName:firstName(),name:L.name,type:L.type||"egen",items:L.items,ts:Date.now()});listSynced[L.pub]=JSON.stringify([L.name,L.items]);
    track("share",{method:"lank",content_type:"lista"});
    if(!silent)shareOut(L.name,`${L.name}: här är glasen jag önskar mig hos SKÅL & CO. Du ser vad som redan är köpt.`,shareLink("lista-"+L.pub));
  }catch(e){gErr(e)}
}
/* Håll den delade listan i takt med ändringar i Mitt glasskåp */
onState(()=>{if(!AUTH.user||!AUTH.rt)return;(S.lists||[]).forEach(L=>{if(!L.pub)return;const k=JSON.stringify([L.name,L.items]);if(listSynced[L.pub]!==undefined&&listSynced[L.pub]!==k){listSynced[L.pub]=k;AUTH.rt.update(AUTH.rt.ref("listor/"+L.pub+"/meta"),{name:L.name,items:L.items,ts:Date.now()}).catch(()=>{})}else if(listSynced[L.pub]===undefined)listSynced[L.pub]=k})});
const LKOPT={};
function listBought(pub){/* antal köpta, hämtas i bakgrunden */
  if(!AUTH.rt||!pub)return null;const c=LKOPT[pub];
  if(!c||Date.now()-c.t>30000){LKOPT[pub]={n:c?c.n:null,t:Date.now()};AUTH.rt.get(AUTH.rt.ref("listor/"+pub+"/kopt")).then(s=>{const n=s.exists()?Object.keys(s.val()).length:0;const old=LKOPT[pub].n;LKOPT[pub]={n,t:Date.now()};if(old!==n&&curView==="glasskap")renderGlasskap()}).catch(()=>{})}
  return LKOPT[pub].n;
}
let LV=null,listPending=null;
function openList(id){
  const el=$("#listaV");if(!el)return;
  if(LV&&LV.id===id)return;
  if(LV&&LV.off)try{LV.off()}catch(e){}LV=null;
  if(!authOn()){el.innerHTML=`<div class="lv-empty"><h1>Listan kan inte visas här.</h1><p class="lead">Öppna länken på den publicerade sajten.</p></div>`;return}
  if(!AUTH.rt){listPending=id;el.innerHTML=`<p class="ai-note" style="padding:40px 0"><i class="spin"></i>Hämtar listan</p>`;return}
  listPending=null;LV={id,meta:null,kopt:{}};
  LV.off=AUTH.rt.onValue(AUTH.rt.ref("listor/"+id),s=>{if(!LV||LV.id!==id)return;const v=s.val();if(!v||!v.meta){el.innerHTML=`<div class="lv-empty"><span class="mono">Önskelista</span><h1>Vi hittar inte listan.</h1><p class="lead">Länken kan vara fel, eller så har listan tagits bort.</p><a class="btn btn-ghost" href="handla/">Titta på glasen</a></div>`;return}
    LV.meta=v.meta;LV.kopt=v.kopt||{};renderListView()},e=>{el.innerHTML=`<div class="lv-empty"><h1>Listan kunde inte hämtas.</h1><p class="lead">Prova att ladda om sidan.</p></div>`;console.warn(e)});
}
function renderListView(){
  const el=$("#listaV"),m=LV.meta,k=LV.kopt,mine=AUTH.user&&AUTH.user.uid===m.owner;
  document.title="SKÅL & CO · "+m.name;
  const items=(m.items||[]).map(id=>byId[id]).filter(Boolean),n=items.filter(p=>k[p.id]).length;
  el.innerHTML=`<header class="page-head lv-head"><span class="mono">${m.type==="brollop"?"Bröllopslista":"Önskelista"}</span><h1>${esc(m.name)}</h1><p class="lead">${mine?"Det här är din lista. Dela länken, så ser gästerna vad som redan är köpt.":esc(m.ownerName||"Någon")+" önskar sig de här glasen. Köp ett och markera det, så köper ingen annan samma."}</p>
    <div class="lv-prog"><span><b>${n}</b> av ${items.length} köpta</span><i style="--w:${items.length?Math.round(n/items.length*100):0}%"></i></div>
    ${mine?`<div class="pdp-actions"><button class="btn btn-primary" data-lvshare>Dela listan</button><a class="btn btn-ghost" href="glasskap/" data-gtab="sparat">Ändra i Mitt glasskåp</a></div>`:""}</header>
  <div class="lv-grid">${items.map(p=>{const b=k[p.id];return `<article class="lv-item${b?" bought":""}"><div class="lv-img" data-open="${p.id}"><img src="${img(p,true)}" data-pimg="${p.id}" alt="${esc(p.name)}" loading="lazy">${b?`<span class="lv-tag">${mine?"Köpt av "+esc(b.name):"Redan köpt"}</span>`:""}</div>
    <div class="lv-body"><b>${esc(p.name)}</b><small>${esc(p.mat)} · ${packTxt(p)} · ${kr(p.price)}</small>
    <div class="pdp-actions">${b?(mine?`<button class="small-btn" data-lvundo="${p.id}">Ångra köpt</button>`:`<span class="note" style="margin:0">Tack, den är redan köpt.</span>`):`<button class="small-btn" data-add="${p.id}">Lägg i varukorgen</button><button class="small-btn" data-lvbuy="${p.id}">Jag har köpt den</button>`}</div></div></article>`}).join("")||'<p class="lead">Listan är tom än så länge.</p>'}</div>
  <p class="note" style="margin-top:24px">Visningsversion: inget köp görs på riktigt.</p>`;
}
function markBought(pid){
  const p=byId[pid];if(!p||!LV)return;
  openModal(`<div class="co"><span class="mono">Markera som köpt</span><h2 style="margin:8px 0 10px">${esc(p.name)}</h2><p class="lead" style="font-size:17px">Då ser alla andra att den redan är köpt. ${esc(LV.meta.ownerName||"Den som önskar")} kan se ditt namn.</p>
    <form id="lvForm" style="display:grid;gap:10px;margin-top:14px"><label class="note" for="lvName" style="margin:0">Ditt namn</label><input class="field" id="lvName" maxlength="40" value="${esc(gMe())}" autocomplete="name" required><button class="btn btn-primary">Markera som köpt</button></form></div>`,"Markera som köpt","lvbuy");
  $("#lvForm").addEventListener("submit",async e=>{e.preventDefault();const name=$("#lvName").value.trim().slice(0,40);if(!name){toast("Skriv ditt namn");return}
    try{await AUTH.rt.set(AUTH.rt.ref("listor/"+LV.id+"/kopt/"+pid),{name,ts:Date.now()});closeModal();toast("Tack! Den är markerad som köpt.");track("tool_use",{tool:"delad-lista",action:"kopt"})}
    catch(x){closeModal();toast(/permission/i.test(String(x&&(x.code||x.message)))?"Någon hann markera den före dig.":"Det gick inte. Prova igen.")}});
}

/* ===== 2. Rösta på en dukning ===== */
let BV=null,bordPending=null;
async function shareBord(){
  if(needLogin("Logga in för att dela dukningen.","Då kan familj och vänner rösta och kommentera, och du ser svaren i Mitt glasskåp."))return;
  const id=id10(),title=`${SEASONS[T.season][0]} för ${T.guests}, ${STY[T.style][0].toLowerCase()}`,data={season:T.season,style:T.style,guests:T.guests,on:[...T.on],pick:{...T.pick},table:T.table};
  try{await AUTH.rt.set(AUTH.rt.ref("bord/"+id+"/meta"),{owner:AUTH.user.uid,ownerName:firstName(),title,data,ts:Date.now()});
    S.saved.unshift({type:"dukning",title,data,bord:id,ts:Date.now()});save();
    track("share",{method:"lank",content_type:"dukning"});
    history.replaceState(null,"",urlFor("bord-"+id));openBord(id);
    shareOut("Vad tycker du om dukningen?",`Vad tycker du om dukningen till ${title.toLowerCase()}? Rösta och kommentera hos SKÅL & CO.`,shareLink("bord-"+id));
  }catch(e){gErr(e)}
}
function openBord(id){
  const el=$("#bordVote");if(!el)return;el.hidden=false;
  if(BV&&BV.id===id)return;
  if(BV&&BV.off)try{BV.off()}catch(e){}BV=null;
  if(!authOn()){el.innerHTML=`<p class="lead">Röstning fungerar på den publicerade sajten.</p>`;return}
  if(!AUTH.user||!AUTH.rt){bordPending=id;el.innerHTML=`<div class="bv"><div><span class="mono">Rösta på dukningen</span><h2>Någon vill veta vad du tycker.</h2><p class="lead" style="font-size:17px">Logga in med Google eller e-post så ser du bordet och kan rösta.</p></div><div class="pdp-actions"><button class="btn btn-google" data-login="google">${GSVG} Fortsätt med Google</button><button class="btn btn-ghost" data-login="in">E-post</button></div></div>`;
    if(AUTH.ready&&AUTH.api&&!AUTH.user&&!bordAsked){bordAsked=true;openLogin("in",{h:"Vad tycker du om dukningen?",p:"Logga in så ser du bordet och kan rösta och kommentera."})}return}
  bordPending=null;BV={id,meta:null,rost:{},loaded:false};
  BV.off=AUTH.rt.onValue(AUTH.rt.ref("bord/"+id),s=>{if(!BV||BV.id!==id)return;const v=s.val();
    if(!v||!v.meta){el.innerHTML=`<div class="bv"><div><h2>Vi hittar inte dukningen.</h2><p class="lead" style="font-size:17px">Länken kan vara fel.</p></div><button class="small-btn" data-bvclose>Stäng</button></div>`;return}
    BV.meta=v.meta;BV.rost=v.rost||{};if(!BV.loaded){BV.loaded=true;if(v.meta.data){loadDukning(v.meta.data);if(v.meta.data.table&&TABLES[v.meta.data.table]){T.table=v.meta.data.table;renderTable()}}}
    renderBordVote()},e=>{gErr(e)});
}
let bordAsked=false;
function renderBordVote(){
  const el=$("#bordVote"),m=BV.meta,uid=AUTH.user.uid,mine=uid===m.owner,R=Object.entries(BV.rost).map(([u,r])=>({u,...r})).sort((a,b)=>b.ts-a.ts),me=BV.rost[uid];
  const up=R.filter(r=>r.v>0).length,dn=R.filter(r=>r.v<0).length;
  el.innerHTML=`<div class="bv"><div class="bv-main"><span class="mono">${mine?"Din delade dukning":"Rösta på dukningen"}</span><h2>${mine?esc(m.title):esc(m.ownerName||"Någon")+" vill veta vad du tycker."}</h2>
    ${mine?`<p class="lead" style="font-size:17px">Dela länken med familj och vänner. Rösterna syns här direkt.</p>`:`<p class="lead" style="font-size:17px">${esc(m.title)}. Titta på bordet nedanför, byt gärna glas och säg vad du tycker.</p>
    <form id="bvForm"><div class="bv-vote" role="group" aria-label="Din röst"><button type="button" data-bvv="1" aria-pressed="${me?me.v>0:false}">Snyggt, kör på det</button><button type="button" data-bvv="-1" aria-pressed="${me?me.v<0:false}">Jag skulle byta något</button></div>
    <label class="note" for="bvC">Kommentar, om du vill</label><textarea class="field" id="bvC" maxlength="200" placeholder="Till exempel: ta coupe i stället för flöjt">${esc(me&&me.c||"")}</textarea><button class="btn btn-primary">${me?"Uppdatera min röst":"Skicka min röst"}</button></form>`}
    </div>
    <div class="bv-side"><div class="bv-tally"><div><b>${up}</b><small>gillar</small></div><div><b>${dn}</b><small>vill byta</small></div></div>
      <ul class="bv-list">${R.map(r=>`<li><span class="g-av" aria-hidden="true">${esc((r.name||"?")[0].toUpperCase())}</span><div><b>${esc(r.u===uid?"Du":r.name||"Gäst")}</b> <small>${r.v>0?"gillar":"vill byta"}</small>${r.c?`<p>${esc(r.c)}</p>`:""}</div></li>`).join("")||'<li class="note">Inga röster än.</li>'}</ul>
      <div class="pdp-actions">${mine?'<button class="small-btn" data-bvshare>Dela igen</button>':""}<button class="small-btn" data-bvclose>Stäng röstningen</button></div></div></div>`;
}
let bvPick=null;
document.addEventListener("click",e=>{
  if(e.target.closest("#tShare")){shareBord();return}
  const v=e.target.closest("[data-bvv]");if(v){bvPick=+v.dataset.bvv;$$("[data-bvv]").forEach(b=>b.setAttribute("aria-pressed",String(b===v)));return}
  if(e.target.closest("[data-bvshare]")&&BV){shareOut("Vad tycker du om dukningen?",`Vad tycker du om dukningen till ${BV.meta.title.toLowerCase()}? Rösta hos SKÅL & CO.`,shareLink("bord-"+BV.id));return}
  if(e.target.closest("[data-bvclose]")){if(BV&&BV.off)try{BV.off()}catch(x){}BV=null;$("#bordVote").hidden=true;$("#bordVote").innerHTML="";history.replaceState(null,"",urlFor("dukning"));return}
  if(e.target.closest("[data-lvshare]")&&LV){const L=S.lists.find(l=>l.pub===LV.id);if(L)pubList(L);else shareOut(LV.meta.name,LV.meta.name+" hos SKÅL & CO",shareLink("lista-"+LV.id));return}
  const lb=e.target.closest("[data-lvbuy]");if(lb){markBought(lb.dataset.lvbuy);return}
  const lu=e.target.closest("[data-lvundo]");if(lu&&LV){AUTH.rt.remove(AUTH.rt.ref("listor/"+LV.id+"/kopt/"+lu.dataset.lvundo)).catch(gErr);return}
  const lp=e.target.closest("[data-lpub]");if(lp){const L=S.lists.find(l=>l.id===lp.dataset.lpub);if(L)pubList(L);return}
  if(e.target.closest("[data-glist]")&&G){const st=gStats(),ids=(st.matches.length?st.matches:st.ranked).slice(0,8).map(x=>x.p.id);if(!ids.length){toast("Swipea lite först, så finns det något att lägga i listan.");return}
    const name=(G.meta.name||"Vår lista").slice(0,40),L={id:"l"+Date.now(),name,type:/bröllop/i.test(name)?"brollop":"egen",items:ids};S.lists.push(L);save();pubList(L);return}
  const rm=e.target.closest("[data-gremind]");if(rm&&G){const f=(G.folk||{})[rm.dataset.gremind],left=G.deck.filter(c=>!(f&&f.votes&&f.votes[c.p.id]!=null)).length;
    if(AUTH.user&&G.meta.host===AUTH.user.uid)AUTH.rt.set(AUTH.rt.ref("rum/"+G.code+"/paminn/"+rm.dataset.gremind),Date.now()).catch(()=>{});
    shareOut("Swipea glas med oss",`Hej ${String(f&&f.name||"").split(" ")[0]}! Du har ${left} glas kvar att swipea i ${G.meta.name||"vår grupp"}. Det tar en minut.`,gLink(G.code),"Påminnelsen är kopierad. Skicka den i sms eller WhatsApp.");return}
});
document.addEventListener("submit",async e=>{
  if(e.target.id!=="bvForm"||!BV)return;e.preventDefault();
  const me=BV.rost[AUTH.user.uid],v=bvPick||(me&&me.v);if(!v){toast("Välj om du gillar dukningen eller vill byta något");return}
  try{await AUTH.rt.set(AUTH.rt.ref("bord/"+BV.id+"/rost/"+AUTH.user.uid),{name:firstName(),v,c:$("#bvC").value.trim().slice(0,200),ts:Date.now()});toast("Tack för din röst!");track("tool_use",{tool:"dukning-rost"})}catch(x){gErr(x)}
});

/* ===== 4. Påminnelser och "alla är klara" ===== */
let roomsChecked=false;
function seenGet(){try{return JSON.parse(localStorage.getItem("skal-rum-sett")||"{}")}catch(e){return {}}}
function seenSet(o){try{localStorage.setItem("skal-rum-sett",JSON.stringify(o))}catch(e){}}
async function checkRooms(){
  if(roomsChecked||!AUTH.user||!AUTH.rt||!(S.rooms||[]).length)return;roomsChecked=true;
  const uid=AUTH.user.uid,seen=seenGet(),notes=[];
  for(const r of S.rooms.slice(0,6)){
    try{const s=await AUTH.rt.get(AUTH.rt.ref("rum/"+r.code));if(!s.exists())continue;const v=s.val(),deck=(v.meta&&v.meta.deck)||[],folk=v.folk||{},me=folk[uid];if(!me)continue;
      const left=f=>deck.filter(id=>!(f.votes&&f.votes[id]!=null)).length,myLeft=left(me),ppl=Object.values(folk),allDone=ppl.length>=2&&ppl.every(f=>left(f)===0);
      const pm=v.paminn&&v.paminn[uid],sn=seen[r.code]||{};
      const matches=allDone?deck.filter(id=>ppl.every(f=>f.votes&&f.votes[id]>0)).length:0;
      if(pm&&myLeft&&pm>(sn.pm||0)){notes.push({code:r.code,k:"pm",v:pm,t:`${esc((v.meta&&v.meta.hostName)||"Någon")} påminner dig: ${myLeft} glas kvar i ${esc(v.meta.name)}.`,b:"Swipea nu"});continue}
      if(allDone&&!sn.done){notes.push({code:r.code,k:"done",v:1,t:`Alla i ${esc(v.meta.name)} är klara. ${matches?(matches===1?"Ni matchar på ett glas.":"Ni matchar på "+matches+" glas."):"Se vad ni gillar mest."}`,b:"Se resultatet"});continue}
      if(myLeft&&myLeft<deck.length&&!sessionStorage.getItem("skal-rum-left-"+r.code))notes.push({code:r.code,k:"left",v:1,t:`Du har ${myLeft} glas kvar i ${esc(v.meta.name)}.`,b:"Fortsätt"});
    }catch(e){}
  }
  if(notes.length)showNotis(notes[0]);
}
function showNotis(n){
  let el=$("#notis");if(!el){el=document.createElement("div");el.id="notis";el.className="notis";el.setAttribute("role","status");document.body.appendChild(el)}
  el.innerHTML=`<span class="mono">Swipea tillsammans</span><p>${n.t}</p><div class="pdp-actions"><a class="btn btn-primary btn-sm" href="#rum-${esc(n.code)}" data-notisok>${n.b}</a><button class="small-btn" data-notisx>Senare</button></div>`;
  requestAnimationFrame(()=>el.classList.add("on"));
  const done=()=>{const s=seenGet();s[n.code]=s[n.code]||{};if(n.k==="pm")s[n.code].pm=n.v;if(n.k==="done")s[n.code].done=true;seenSet(s);if(n.k==="left")try{sessionStorage.setItem("skal-rum-left-"+n.code,"1")}catch(e){}el.classList.remove("on")};
  $("[data-notisok]",el).addEventListener("click",done);$("[data-notisx]",el).addEventListener("click",done);
}
/* Väntande länkar och påminnelser när inloggningen är klar */
onState(()=>{
  if(listPending&&AUTH.rt)openList(listPending);
  if(bordPending&&AUTH.user&&AUTH.rt)openBord(bordPending);else if(bordPending&&AUTH.ready&&AUTH.api&&!AUTH.user&&curView==="dukning")openBord(bordPending);
  if(AUTH.user&&AUTH.rt&&!roomsChecked)setTimeout(checkRooms,1500);
});
