/* ---------- Swipea tillsammans: grupper i Firebase Realtime Database ----------
   rum/{KOD}/meta  {host, hostName, name, theme, deck:[id], ts}   skrivs bara av den som skapade gruppen
   rum/{KOD}/folk/{uid}  {name, ts, votes:{produktid: 2|1|-1}}     varje deltagare skriver bara sin egen rad
   Alla inloggade som har koden kan läsa gruppen. Reglerna finns i README-avsnittet i CLAUDE.md. */
const GTHEMES={alla:["Allt i sortimentet","Vin, bar, vardag och kaffe",p=>p.cat!=="karaff"],middag:["Middag och fest","Vin, bubbel, dessert och karaff",p=>["vin","champagne","dessert","karaff"].includes(p.cat)],bar:["Hemmabaren","Whisky, cocktail och öl",p=>["whisky","cocktail","ol"].includes(p.cat)],vardag:["Vardag","Vatten, kaffe och te",p=>["vatten","kaffe","te"].includes(p.cat)]};
let swMode="solo",G=null,gPending=null,gTheme="alla";
try{gPending=sessionStorage.getItem("skal-rum")||null}catch(e){}
const gOn=()=>authOn()&&FIREBASE_DB==="rtdb";
const gCodeOk=c=>/^[A-Z0-9]{6}$/.test(c||"");
const gMe=()=>AUTH.user?(AUTH.user.displayName||(AUTH.user.email||"").split("@")[0]||"Gäst").slice(0,30):"";
const gLink=c=>location.origin+location.pathname+"#rum-"+c;
function gErr(e){console.warn("Gruppen",e);toast(/permission/i.test(String(e&&(e.code||e.message)))?"Grupper är inte påslagna i databasen än. Reglerna behöver uppdateras.":"Något gick fel med gruppen. Prova igen.")}
function setSwMode(m){
  swMode=m;$$("[data-swmode]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.swmode===m)));
  const grp=m==="group",inRoom=grp&&G;
  $("#swLobby").hidden=!grp||!!inRoom;$("#swWrap").hidden=grp&&!inRoom;
  if(grp&&!inRoom)renderLobby();else renderDeck();
}
function renderLobby(){
  const el=$("#swLobby");if(!el)return;
  const steps=`<ol class="g-steps"><li><b>Skapa en grupp</b><span>Ge den ett namn och välj vilka glas ni ska swipea.</span></li><li><b>Skicka länken</b><span>Till familj, vänner eller den du ska gifta dig med.</span></li><li><b>Se era matchningar</b><span>Glasen alla gillar visas direkt, medan ni swipear.</span></li></ol>`;
  if(!gOn()){el.innerHTML=`<div class="g-lobby"><div><span class="mono">Swipea tillsammans</span><h2>Välj glas ihop med andra.</h2><p class="lead">${window.claude?"Grupper fungerar på den publicerade sajten, där man loggar in med Google eller e-post.":"Grupper kopplas på snart."}</p>${steps}</div></div>`;return}
  if(!AUTH.user){el.innerHTML=`<div class="g-lobby"><div><span class="mono">Swipea tillsammans</span><h2>Välj glas ihop med andra.</h2><p class="lead">Bjud in familj och vänner. Alla swipear samma glas i sin egen mobil, och ni ser direkt vilka ni alla gillar. Gruppen sparas på era konton.</p>${steps}</div>
    <div class="g-card"><h3>Logga in för att börja</h3><p class="note">Alla i gruppen behöver ett konto, så att era val sparas och syns för de andra.</p><button class="btn btn-google" data-login="google">${GSVG} Fortsätt med Google</button><button class="btn btn-ghost" data-login="in" style="margin-top:10px;width:100%">Logga in med e-post</button></div></div>`;return}
  const mine=(S.rooms||[]).slice(0,6);
  el.innerHTML=`<div class="g-lobby"><div><span class="mono">Swipea tillsammans</span><h2>Välj glas ihop med andra.</h2><p class="lead">Skapa en grupp och skicka länken. Alla swipear samma glas, och ni ser direkt vilka ni alla gillar.</p>${steps}
      ${mine.length?`<div class="g-mine"><span class="mono">Dina grupper</span>${mine.map(r=>`<a class="g-room" href="#rum-${esc(r.code)}"><span><b>${esc(r.name)}</b><small>${esc(GTHEMES[r.theme]?.[0]||"")} · kod ${esc(r.code)}</small></span><span aria-hidden="true">→</span></a>`).join("")}</div>`:""}</div>
    <div class="g-card"><form id="gNew"><h3>Ny grupp</h3><label class="note" for="gName">Vad ska ni välja glas till?</label><input class="field" id="gName" maxlength="40" placeholder="Till exempel Bröllopet eller Julbordet" autocomplete="off">
      <span class="note" style="display:block;margin:14px 0 8px">Vilka glas ska ni swipea?</span><div class="g-themes" role="group" aria-label="Vilka glas">${Object.entries(GTHEMES).map(([k,t])=>`<button type="button" class="g-theme" data-gtheme="${k}" aria-pressed="${gTheme===k}"><b>${t[0]}</b><small>${t[1]}</small></button>`).join("")}</div>
      <button class="btn btn-primary" style="width:100%;margin-top:16px">Skapa grupp och bjud in</button></form>
      <div class="or"><span>eller gå med i en grupp</span></div>
      <form id="gJoin" class="inline-form" style="margin:0"><input class="field" id="gCode" maxlength="6" placeholder="Kod, till exempel K7MQ2P" aria-label="Gruppens kod" autocomplete="off" style="text-transform:uppercase"><button class="small-btn">Gå med</button></form></div></div>`;
}
async function gCreate(name,theme){
  if(!AUTH.user||!AUTH.rt){openLogin("in");return}
  const A="ABCDEFGHJKMNPQRSTUVWXYZ23456789";let code="";for(let i=0;i<6;i++)code+=A[Math.floor(Math.random()*A.length)];
  const deck=P.filter(GTHEMES[theme][2]).sort((a,b)=>b.pop-a.pop).map(p=>p.id);
  try{await AUTH.rt.set(AUTH.rt.ref("rum/"+code+"/meta"),{host:AUTH.user.uid,hostName:gMe(),name:name.slice(0,40),theme,deck,ts:Date.now()});
    track("tool_use",{tool:"swipea-tillsammans",action:"skapa"});
    await gOpen(code,true);
  }catch(e){gErr(e)}
}
async function gOpen(code,isNew){
  if(!gCodeOk(code)){toast("Koden ska vara sex tecken.");return}
  setSwMode("group");
  if(!gOn()){renderLobby();return}
  if(!AUTH.user||!AUTH.rt){gPending=code;try{sessionStorage.setItem("skal-rum",code)}catch(e){}
    if(AUTH.ready&&AUTH.api&&!AUTH.user)openLogin("in",{h:"Du är inbjuden att swipea glas tillsammans.",p:"Logga in med Google eller e-post så är du med direkt. Ni ser vilka glas ni alla gillar."});
    return}
  gPending=null;try{sessionStorage.removeItem("skal-rum")}catch(e){}
  if(G&&G.code===code){setSwMode("group");return}
  gLeave(true);
  const rt=AUTH.rt,uid=AUTH.user.uid;
  try{
    const m=await rt.get(rt.ref("rum/"+code+"/meta"));
    if(!m.exists()){toast("Vi hittar ingen grupp med koden "+code+".");history.replaceState(null,"","#upptack");return}
    await rt.update(rt.ref("rum/"+code+"/folk/"+uid),{name:gMe(),ts:Date.now()});
    const meta=m.val();
    G={code,meta,folk:{},deck:(meta.deck||[]).map(id=>byId[id]).filter(Boolean).map(p=>({p})),i:0,ready:false};
    S.rooms=[{code,name:meta.name,theme:meta.theme,ts:Date.now()},...(S.rooms||[]).filter(r=>r.code!==code)].slice(0,10);save();
    history.replaceState(null,"","#rum-"+code);
    G.off=rt.onValue(rt.ref("rum/"+code),snap=>{
      if(!G||G.code!==code)return;const v=snap.val()||{};G.meta=v.meta||G.meta;G.folk=v.folk||{};
      if(!G.ready){const mv=(G.folk[uid]&&G.folk[uid].votes)||{};G.i=G.deck.findIndex(c=>mv[c.p.id]==null);if(G.i<0)G.i=G.deck.length;G.ready=true;setSwMode("group")}
      else if(G.i>=G.deck.length)gDone();else renderGroupPanel();
    },gErr);
    if(isNew)setTimeout(gInvite,400);
  }catch(e){gErr(e)}
}
function gLeave(quiet){if(G&&G.off)try{G.off()}catch(e){}G=null;if(!quiet){history.replaceState(null,"","#upptack");setSwMode("group")}}
function gSwipe(kind){
  const rt=AUTH.rt,uid=AUTH.user&&AUTH.user.uid;if(!rt||!uid)return;
  const path=p=>rt.ref("rum/"+G.code+"/folk/"+uid+"/votes/"+p.id);
  if(kind==="undo"){if(G.i<=0)return;G.i--;rt.remove(path(G.deck[G.i].p)).catch(gErr);renderDeck();return}
  const c=G.deck[G.i];if(!c)return;
  flyCard(kind);
  rt.set(path(c.p),kind==="save"?2:kind==="yes"?1:-1).catch(gErr);
  if(kind==="save"&&!isFav(c.p.id)){S.favs.unshift(c.p.id);save(true);refreshHearts()}
  G.i++;setTimeout(renderDeck,reduce?0:260);
}
function gStats(){
  const people=Object.entries(G.folk||{}).map(([uid,f])=>({uid,name:String(f.name||"Gäst"),votes:f.votes||{},me:AUTH.user&&uid===AUTH.user.uid}));
  const n=people.length,len=G.deck.length,w={};
  const items=G.deck.map(({p})=>{let yes=0,love=0,no=0;const who=[],lovers=[];
    people.forEach(f=>{const v=f.votes[p.id];if(v==null)return;const t=tagsOf({p}),k=v===2?1.5:v>0?1:-.6;for(const key in t)w[key]=(w[key]||0)+t[key]*k;
      if(v>0){yes++;who.push(f.me?"dig":f.name.split(" ")[0])}if(v===2){love++;lovers.push(f.me?"du":f.name.split(" ")[0])}if(v<0)no++});
    return {p,yes,love,no,who,lovers,score:yes+love*.6-no*.4}});
  return {people,n,len,items,matches:n>=2?items.filter(x=>x.yes===n).sort((a,b)=>b.love-a.love):[],ranked:items.filter(x=>x.yes>0).sort((a,b)=>b.score-a.score),prof:Object.keys(w).length?buildProfile(w):null};
}
const lista=a=>a.length<2?a.join(""):a.slice(0,-1).join(", ")+" och "+a[a.length-1];
function renderGroupPanel(){
  const el=$("#profile");if(!el||!G)return;
  const st=gStats(),prog=f=>G.deck.filter(c=>f.votes[c.p.id]!=null).length;
  const row=x=>`<div class="gk-item" data-open="${x.p.id}" style="cursor:pointer"><img src="${img(x.p,true)}" data-pimg="${x.p.id}" alt=""><div><b>${esc(x.p.name)}</b><small>${kr(per(x.p))} per glas${x.who.length?" · gillas av "+esc(lista(x.who)):""}${x.lovers.length?" · "+esc(lista(x.lovers))+" sparade det":""}</small></div></div>`;
  el.innerHTML=`<span class="mono">Swipea tillsammans</span><h2 class="pc-h">${esc(G.meta.name||"Vår grupp")}</h2>
  <div class="g-code"><span>Kod <b>${esc(G.code)}</b></span><button class="small-btn" data-ginvite>Bjud in</button></div>
  <ul class="g-folk">${st.people.sort((a,b)=>b.me-a.me).map(f=>{const n=prog(f);return `<li><span class="g-av" aria-hidden="true">${esc((f.name[0]||"?").toUpperCase())}</span><span class="g-nm">${esc(f.me?"Du":f.name)}${G.meta.host&&f.uid===G.meta.host?' <small>skapade gruppen</small>':""}</span><span class="g-pr"><i style="--w:${Math.round(n/st.len*100)}%"></i></span><small>${n===st.len?"Klar":f.me?n+" av "+st.len:`<button class="linkbtn" data-gremind="${esc(f.uid)}" aria-label="Påminn ${esc(f.name)}">${n} av ${st.len} · påminn</button>`}</small></li>`}).join("")}</ul>
  ${st.n>=2&&st.people.every(f=>prog(f)===st.len)?`<div class="g-alldone"><b>Alla är klara!</b> ${st.matches.length?(st.matches.length===1?"Ni matchar på ett glas.":"Ni matchar på "+st.matches.length+" glas."):"Här är det ni gillar mest."}</div>`:""}
  ${st.n<2?`<p class="note">Bjud in någon för att se vad ni matchar på. Länken går att skicka i sms, WhatsApp eller mejl.</p>`:""}
  <span class="mono" style="display:block;margin-top:18px">${st.matches.length?"Alla gillar":"Matchningar"}</span>
  ${st.matches.length?`<div class="gk-list g-match">${st.matches.map(row).join("")}</div>`:`<p class="note">${st.n<2?"Matchningarna visas när ni är minst två.":"Inga glas som alla gillar än. Fortsätt swipea."}</p>`}
  ${st.ranked.filter(x=>!st.matches.includes(x)).length?`<span class="mono" style="display:block;margin-top:18px">Flest gillar</span><div class="gk-list">${st.ranked.filter(x=>!st.matches.includes(x)).slice(0,4).map(row).join("")}</div>`:""}
  ${st.prof&&st.n>=2?`<p class="g-prof">Er gemensamma stil: <b>${esc(st.prof.name)}</b>. Ni gillar ${esc(st.prof.summary)}.</p>`:""}
  <div class="pdp-actions" style="margin-top:16px">${st.ranked.length?'<button class="small-btn" data-glist>Gör en önskelista att dela</button><button class="small-btn" data-gsave>Spara i Mitt glasskåp</button>':""}<button class="small-btn" data-gleave>Lämna gruppvyn</button></div>`;
}
function gDone(){
  if(!G)return;const st=gStats(),wait=st.people.filter(f=>!f.me&&G.deck.some(c=>f.votes[c.p.id]==null));
  $("#sprog").style.width="100%";
  $("#deck").innerHTML=`<div class="scard g-done" style="cursor:default"><div><span class="mono">Du är klar</span><h3>${st.matches.length?(st.matches.length===1?"Ni matchar på ett glas.":"Ni matchar på "+st.matches.length+" glas."):st.n<2?"Nu väntar vi på fler.":"Inga gemensamma favoriter än."}</h3><p>${wait.length?esc(wait.map(f=>f.name.split(" ")[0]).join(", "))+" swipear fortfarande. Listan uppdateras direkt.":st.n<2?"Bjud in någon så ser ni vad ni har gemensamt.":"Alla är klara. Se listan bredvid."}</p>${st.n<2?'<button class="btn btn-primary" data-ginvite>Bjud in</button>':""}</div></div>`;
  renderGroupPanel();
}
async function gInvite(){
  if(!G)return;const url=gLink(G.code),text=`Hjälp mig välja glas till ${G.meta.name||"vår grupp"}. Swipea med mig hos SKÅL & CO, så ser vi vilka glas vi båda gillar.`;
  track("share",{method:navigator.share?"dela":"kopiera",content_type:"grupp"});
  if(navigator.share){try{await navigator.share({title:"Swipea glas tillsammans",text,url});return}catch(e){if(e&&e.name==="AbortError")return}}
  copy(text+"\n"+url,"Länken är kopierad. Klistra in den i sms, WhatsApp eller mejl.");
}
document.addEventListener("click",e=>{
  const m=e.target.closest("[data-swmode]");if(m){if(m.dataset.swmode==="solo"&&G)history.replaceState(null,"","#upptack");setSwMode(m.dataset.swmode);return}
  const t=e.target.closest("[data-gtheme]");if(t){gTheme=t.dataset.gtheme;$$("[data-gtheme]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));return}
  if(e.target.closest("[data-ginvite]")){gInvite();return}
  if(e.target.closest("[data-gleave]")){gLeave();return}
  if(e.target.closest("[data-gsave]")&&G){const st=gStats();S.saved.unshift({type:"grupp",title:"Tillsammans: "+(G.meta.name||G.code),data:{code:G.code,ids:(st.matches.length?st.matches:st.ranked).slice(0,6).map(x=>x.p.id)},ts:Date.now()});save();toast("Sparat i Mitt glasskåp");return}
});
document.addEventListener("submit",e=>{
  if(e.target.id==="gNew"){e.preventDefault();const n=$("#gName").value.trim();if(!n){toast("Ge gruppen ett namn");$("#gName").focus();return}gCreate(n,gTheme)}
  if(e.target.id==="gJoin"){e.preventDefault();const c=$("#gCode").value.trim().toUpperCase();if(!gCodeOk(c)){toast("Koden ska vara sex tecken.");return}gOpen(c)}
});
/* Kom någon via en inbjudan innan inloggningen var klar, gå med så fort den är det. */
let gAsked=false;
onState(()=>{if(gPending&&AUTH.user&&AUTH.rt){const c=gPending;gPending=null;gOpen(c)}else if(gPending&&AUTH.ready&&AUTH.api&&!AUTH.user&&!gAsked&&curView==="upptack"){gAsked=true;openLogin("in",{h:"Du är inbjuden att swipea glas tillsammans.",p:"Logga in med Google eller e-post så är du med direkt. Ni ser vilka glas ni alla gillar."})}else if(swMode==="group"&&!G&&curView==="upptack")renderLobby()});
