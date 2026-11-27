
/* ---------- Produktsida ---------- */
const POUR={vin:[["Vin, 15 cl",15],["Provsmakning, 8 cl",8]],champagne:[["Bubbel, 12 cl",12]],whisky:[["Whisky, 4 cl",4],["Whisky med vatten, 6 cl",6]],cocktail:[["Martini, 9 cl",9]],vatten:[["Vatten, 25 cl",25],["Gin & tonic, 20 cl",20]],kaffe:[["Espresso, 3 cl",3],["Kaffe, 15 cl",15],["Latte, 20 cl",20]],te:[["Te, 20 cl",20]],karaff:[["En flaska, 75 cl",75]]};
const pours=p=>{if(p.cat==="karaff")return POUR.karaff;const L=[];[p.cat,...p.drinks].forEach(d=>(POUR[d]||[]).forEach(x=>{if(!L.some(y=>y[0]===x[0])&&x[1]<=p.vol)L.push(x)}));return L.length?L:[["Halvfullt",p.vol/2]]};
const FAMILY={rott:"stjalk",vitt:"stjalk",flojt:"stjalk",coupe:"stjalk",cocktail:"stjalk",dessert:"stjalk",tumbler:"lag",whisky:"lag",kaffe:"varm",dubbel:"varm",te:"varm",karaff:"karaff",ol:"stjalk"};
/* Profiler för 3D och fyllnadsgrad: [radie 0..1, höjd 0..1], b = var skålen börjar */
const PROF={
 rott:{b:4,pts:[[.62,0],[.62,.012],[.07,.03],[.05,.4],[.18,.43],[.72,.5],[.98,.62],[1,.72],[.9,.88],[.76,1]]},
 vitt:{b:4,pts:[[.6,0],[.6,.012],[.07,.03],[.05,.42],[.2,.45],[.8,.55],[1,.7],[.92,.88],[.8,1]]},
 coupe:{b:4,pts:[[.58,0],[.58,.015],[.06,.04],[.05,.6],[.25,.64],[.75,.74],[.97,.88],[1,1]]},
 cocktail:{b:4,pts:[[.55,0],[.55,.015],[.06,.04],[.05,.56],[.2,.6],[.7,.8],[1,1]]},
 whisky:{b:3,pts:[[.85,0],[.85,.07],[.3,.1],[.28,.18],[.7,.32],[1,.52],[.86,.8],[.7,1]]},
 tumbler:{b:1,pts:[[.86,0],[.9,.04],[1,1]]},
 kaffe:{b:1,pts:[[.62,0],[.78,.05],[.94,.35],[1,1]]},
 dubbel:{b:1,pts:[[.82,0],[.95,.08],[1,1]]},
 karaff:{b:1,pts:[[.72,0],[.95,.08],[1,.28],[.75,.52],[.22,.68],[.16,.74],[.16,1]]}
};
const profOf=sh=>PROF[sh]||PROF.tumbler;
function rAt(pts,y){for(let i=1;i<pts.length;i++){const [r0,y0]=pts[i-1],[r1,y1]=pts[i];if(y>=y0&&y<=y1)return y1===y0?r1:r0+(r1-r0)*(y-y0)/(y1-y0)}return pts[pts.length-1][0]}
function fillY(sh,frac){/* höjd där vätskan står, givet andel av volymen */
  const {b,pts}=profOf(sh),y0=pts[b-1]?pts[b-1][1]:0,y1=pts[pts.length-1][1],N=120;
  const seg=[];let tot=0;for(let i=0;i<N;i++){const y=y0+(y1-y0)*(i+.5)/N,r=rAt(pts,y);tot+=r*r;seg.push(tot)}
  const goal=Math.min(.98,frac)*tot;const i=seg.findIndex(v=>v>=goal);return y0+(y1-y0)*((i<0?N:i)+1)/N;
}
function deliveryDate(days=3){const d=new Date();let n=0;while(n<days){d.setDate(d.getDate()+1);if(d.getDay()%6)n++}return d.toLocaleDateString("sv-SE",{weekday:"long",day:"numeric",month:"long"})}

const PAIRS={vin:["karaff","bolja","vitvin","bourgogne"],champagne:["vitvin","bolja","perla"],whisky:["karaff","bolja"],cocktail:["coupe","nora","boljahigh"],vatten:["boljahigh","karaff","bolja"],kaffe:["svavar","anga","kaffe"],te:["svavar","kaffe"],ol:["bolja","whisky"],dessert:["coupe","svavar"],karaff:["bourgogne","bolja"]};
const ROLEOF={vin:"vin",champagne:"bubbel",cocktail:"drink",whisky:"avec",vatten:"vatten",karaff:"karaff",kaffe:"kaffe",te:"kaffe",dessert:"dessert",ol:"ol"};
function qa(p){return [
 ["Tål glaset diskmaskin?",p.props.includes("diskmaskin")?"Ja, enligt tillverkaren. Ställ glasen så att de inte slår i varandra.":"Tillverkaren rekommenderar handdisk."],
 ["Hur många glas ingår?",p.pack===1?"En karaff.":`${p.pack} glas i förpackningen. Det blir ${kr(per(p))} per glas.`],
 ["Kan jag köpa ett enstaka glas?","Ja, i de flesta serier. Bra om ett glas går sönder. Har du glaset i Mitt glasskåp går det på två klick."],
 ["Är glaset blyfritt?","Den uppgiften visar vi först när den är verifierad i tillverkarens produktblad. Vi gissar aldrig."],
 ["Vad händer om det kommer trasigt?","Skicka en bild, så skickar vi ett nytt. Skärvorna behöver vi inte."]]}
let pState={};
function openProduct(id){
  const p=byId[id]; if(!p)return;
  pushRecent(id);track("view_item",{items:[itemOf(p)]});
  const fam=FAMILY[p.shape];
  const similar=P.filter(x=>x.id!==id&&FAMILY[x.shape]===fam).sort((a,b)=>Math.abs(per(a)-per(p))-Math.abs(per(b)-per(p))).slice(0,3);
  const complete=P.filter(x=>x.id!==id&&(x.series===p.series||x.occ.some(o=>p.occ.includes(o)))&&FAMILY[x.shape]!==fam).slice(0,4);
  const specs=[["Glastyp",p.mat],["Volym",p.vol+" cl ("+p.vol*10+" ml)"],["Prisnivå",TIERN[tier(p)]],["Vikt","Uppgift saknas än. Vi gissar aldrig."],["Tillverkningsland","Visas när uppgiften är verifierad"],["Höjd",cm(p.h)],["Diameter",cm(p.d)],["Förpackning",packTxt(p)],["Diskmaskin",p.props.includes("diskmaskin")?"Ja, enligt tillverkaren":"Nej, handdisk rekommenderas"],["Tillverkning",p.props.includes("munblast")?"Munblåst":"Maskintillverkat"],["Serie",p.series],["Produkt-ID","SK-"+p.id.toUpperCase()],["Tillverkare och ansvarig i EU","Visas när avtalet med glasbruket är klart"]];
  const mine=S.reviews.filter(r=>r.id===id);
  const watching=S.watches.some(w=>w.series===p.series);
  const owned=S.owned.some(o=>o.id===id);
  const canEngrave=p.props.includes("kristall");
  const series=P.filter(x=>x.id!==id&&x.series===p.series);
  const pairs=(PAIRS[p.cat]||[]).filter(x=>x!==id&&!series.some(y=>y.id===x)).map(x=>byId[x]).filter(Boolean).slice(0,2);
  pState={id,tab:"foto",lightOn:light(),pour:0,shot:0};
  openModal(`<div class="pdp">
  <div class="gal"><div class="mtabs" role="tablist">${[["foto","Foto"],["form","Form och storlek"],["3d","3D"]].map(([k,l])=>`<button role="tab" data-mt="${k}" aria-selected="${k==="foto"}">${l}</button>`).join("")}</div>
    <div class="mstage" id="mstage"></div>
    <div class="thumbs" id="pThumbs">${[["prod","Produktbild"],["scene","I miljö"],["pack","Så packas det"]].map(([k,l],i)=>`<button data-shot="${i}" aria-pressed="${i===0}" aria-label="${l}"><img src="${k==="prod"?img(p,true):k==="scene"?scene(p):"assets/s-ask.webp"}" alt=""></button>`).join("")}</div>
  </div>
  <div class="body"><span class="brand">${esc(p.mat)} · Serie ${esc(p.series)}</span><h2>${esc(p.name)}</h2><div class="stars">★★★★★<span>${p.rating} av 5 · ${p.reviews} omdömen</span></div>
  <div class="price" style="margin-top:14px"><b style="font-size:26px" id="pPrice">${kr(p.price)}</b>${p.pack>1?`<span>${kr(per(p))} per glas · ${p.pack} i förpackningen</span>`:""}</div>
  <div class="opts">
    ${canEngrave?`<label class="opt"><input type="checkbox" id="oGrav"> Gravyr på foten, +149 kr</label><label class="opt" id="oGravRow" hidden><input type="text" id="oGravTxt" maxlength="20" placeholder="Max 20 tecken, till exempel E &amp; J 2026" aria-label="Text för gravyr"></label>`:""}
    <label class="opt"><input type="checkbox" id="oWrap"> Presentinslagning med kort, +49 kr</label>
  </div>
  <div class="buy"><div class="pq" role="group" aria-label="Antal"><button type="button" id="qMinus" aria-label="Färre">−</button><output id="qN">1</output><button type="button" id="qPlus" aria-label="Fler">+</button></div><button class="btn btn-primary" id="pAdd">Lägg i varukorg</button><button class="small-btn" data-fav="${p.id}" aria-pressed="${isFav(p.id)}">${heartSvg} Spara</button><label class="small-btn" style="cursor:pointer"><input type="checkbox" data-cmp="${p.id}" ${cmpSet.has(p.id)?"checked":""}> Jämför</label></div>
  <p class="deliv"><i${STOCK[p.id]?' style="background:#d9a55a"':""}></i>${stockTxt(p)}. Beställ i dag, hemma senast ${deliveryDate(SUP[p.sup][1])}. Skickas med krossgaranti.</p>
  <div class="pdp-actions">
    <button class="small-btn" id="pTrial">${I.box.replace('viewBox="0 0 48 48"','viewBox="0 0 48 48" style="width:16px;height:16px;stroke-width:3"')} Lägg i provlådan</button>
    <button class="small-btn" id="pWatch" aria-pressed="${watching}">Bevaka serien ${esc(p.series)}</button>
    <button class="small-btn" id="pOwn" aria-pressed="${owned}">${owned?"Finns i mitt glasskåp":"Jag har detta glas"}</button>
    <button class="small-btn" id="pAsk">Fråga sommelieren</button>
    <button class="small-btn" id="pTable">Se i en dukning</button>
  </div>
  <div class="inline-form" style="margin-top:10px"><select id="pList" aria-label="Välj lista">${S.lists.map(l=>`<option value="${esc(l.id)}">${esc(l.name)}</option>`).join("")}<option value="__ny">Ny lista</option></select><input id="pListNew" placeholder="Namn på listan, till exempel Bröllop" hidden aria-label="Namn på ny lista"><button class="small-btn" id="pListGo">Spara i lista</button></div>
  <div class="story"><h3>Varför formen fungerar</h3><p>${esc(p.why)}</p></div>
  <div class="story"><h3>Berättelsen bakom glaset</h3><p>${esc(p.story)}</p></div>
  <div class="story"><h3>Skötselråd</h3><ul class="care">${care(p).map(c=>`<li>${c}</li>`).join("")}</ul></div>
  <table class="spectable">${specs.map(s=>`<tr><th>${s[0]}</th><td>${esc(s[1])}</td></tr>`).join("")}</table>
  ${similar.length?`<div class="story"><h3>Liknande form, annat pris</h3><div class="complete">${similar.map(x=>`<button data-open="${x.id}"><img src="${img(x,true)}" alt=""><b style="display:block;font-weight:500">${esc(x.name)}</b><span style="color:var(--muted)">${kr(per(x))} per glas · ${per(x)<per(p)?"billigare":"dyrare"}</span></button>`).join("")}</div></div>`:""}
  ${pairs.length?`<div class="story"><h3>Passar ihop med</h3><div class="pairs">${pairs.map(x=>`<label class="opt"><input type="checkbox" data-pair="${x.id}" checked><img src="${img(x,true)}" alt=""><span>${esc(x.name)}<small style="display:block;color:var(--muted)">${kr(x.price)}</small></span></label>`).join("")}</div><button class="small-btn" id="pPairs" style="margin-top:10px">Lägg ${esc(p.name)} och valda i varukorgen</button><p class="note">När butiken är igång bygger förslagen på vad andra faktiskt köper ihop.</p></div>`:""}
  ${series.length?`<div class="story"><h3>Hela serien ${esc(p.series)}</h3><p style="color:var(--ink2)">${[p,...series].map(x=>esc(x.name)).join(", ")}.</p><button class="small-btn" id="pSeries">Köp hela serien, ${kr([p,...series].reduce((a,x)=>a+x.price,0))}</button></div>`:""}
  <div class="story"><h3>Komplettera samlingen</h3><div class="complete">${complete.map(x=>`<button data-open="${x.id}"><img src="${img(x,true)}" alt=""><b style="display:block;font-weight:500">${esc(x.name)}</b><span style="color:var(--muted)">${kr(x.price)}</span></button>`).join("")}</div></div>
  <div class="reviews"><h3 style="font-family:var(--mono);font-weight:400;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent)">Omdömen</h3>
    <div id="pRevs">${mine.length?mine.map(r=>`<div style="padding:12px 0;border-bottom:1px solid var(--line)"><span style="color:var(--accent)">${"★".repeat(r.stars)}</span> <b>Din recension</b><p style="color:var(--ink2)">${esc(r.text)}</p><small class="note">Visas för andra efter verifierat köp.</small></div>`).join(""):`<p class="note">Här visar vi bara omdömen från verifierade köp. Betyget ovan är ett exempel i visningsversionen.</p>`}</div>
    <form class="revform" id="revForm"><div class="stars-in" role="radiogroup" aria-label="Betyg">${[1,2,3,4,5].map(n=>`<button type="button" data-star="${n}" aria-label="${n} av 5">★</button>`).join("")}</div><textarea id="revTxt" rows="3" placeholder="Hur fungerar glaset hos dig?" aria-label="Din recension"></textarea><button class="btn btn-ink" style="justify-self:start;padding:11px 18px">Skicka recension, +50 skålpoäng</button></form>
  </div>
  <div class="story"><h3>Frågor och svar</h3><div class="faq qa">${qa(p).map(([q,a])=>`<details><summary>${q}<i></i></summary><div class="a">${a}</div></details>`).join("")}</div><button class="small-btn" id="pQ" style="margin-top:10px">Ställ en egen fråga</button></div>
  <p class="note">Måtten och betygen är exempel i visningsversionen. I butiken kommer de från tillverkarens verifierade produktdata och verifierade köp.</p></div></div>
  <div class="buybar"><div><b>${kr(p.price)}</b><small class="note" style="display:block;margin:0">${packTxt(p)}</small></div><button class="btn btn-primary" data-pbuy>Lägg i varukorg</button></div>`,p.name,"product");
  renderStage();
  const mb=$("#mbody");
  $$("[data-mt]",mb).forEach(b=>b.addEventListener("click",()=>{pState.tab=b.dataset.mt;$$("[data-mt]",mb).forEach(x=>x.setAttribute("aria-selected",String(x===b)));renderStage()}));
  $$("[data-shot]",mb).forEach(b=>b.addEventListener("click",()=>{pState.shot=+b.dataset.shot;pState.tab="foto";$$("[data-mt]",mb).forEach(x=>x.setAttribute("aria-selected",String(x.dataset.mt==="foto")));$$("[data-shot]",mb).forEach(x=>x.setAttribute("aria-pressed",String(x===b)));renderStage()}));
  const upd=()=>{const g=$("#oGrav",mb)?.checked,w=$("#oWrap",mb).checked;if($("#oGravRow",mb))$("#oGravRow",mb).hidden=!g;$("#pPrice",mb).textContent=kr(p.price+(g?149:0)+(w?49:0))};
  $("#oGrav",mb)?.addEventListener("change",upd);$("#oWrap",mb).addEventListener("change",upd);
  let qty=1;const setQ=n=>{qty=Math.max(1,Math.min(24,n));$("#qN",mb).textContent=qty};
  $("#qMinus",mb).addEventListener("click",()=>setQ(qty-1));$("#qPlus",mb).addEventListener("click",()=>setQ(qty+1));
  const buy=()=>{const g=$("#oGrav",mb)?.checked,txt=($("#oGravTxt",mb)?.value||"").trim();if(g&&!txt){toast("Skriv texten för gravyren");$("#oGravTxt",mb).focus();return}addCart(p.id,qty,true,{grav:g?txt:"",wrap:$("#oWrap",mb).checked});toast(`${qty} × ${p.name} ligger i varukorgen`)};
  $("#pTable",mb).addEventListener("click",()=>{const role=ROLEOF[p.cat];if(role){T.pick[role]=p.id;T.on.add(role)}pendingSeason=null;closeModal();goto("dukning")});
  $("#pQ",mb).addEventListener("click",()=>openConc(`Jag har en fråga om ${p.name}: `));
  $("#pSeries",mb)?.addEventListener("click",()=>{[p,...series].forEach(x=>addCart(x.id,1,true));toast("Hela serien "+p.series+" ligger i varukorgen")});
  $("#pPairs",mb)?.addEventListener("click",()=>{addCart(p.id,qty,true);$$("[data-pair]",mb).filter(c=>c.checked).forEach(c=>addCart(c.dataset.pair,1,true));toast("Allt ligger i varukorgen")});
  $("#pAdd",mb).addEventListener("click",buy);$("[data-pbuy]",mb).addEventListener("click",buy);
  $("#pTrial",mb).addEventListener("click",()=>{trialAdd(p.id)});
  $("#pWatch",mb).addEventListener("click",e=>{const i=S.watches.findIndex(w=>w.series===p.series);if(i>=0){S.watches.splice(i,1);toast("Du bevakar inte längre "+p.series)}else{S.watches.push({series:p.series,id:p.id,price:p.price,ts:Date.now()});toast("Du får veta när det kommer nytt i serien "+p.series)}save();e.currentTarget.setAttribute("aria-pressed",String(i<0))});
  $("#pOwn",mb).addEventListener("click",e=>{if(!S.owned.some(o=>o.id===p.id)){S.owned.push({id:p.id,name:p.name,shape:p.shape,count:p.pack});save();toast(p.name+" finns nu i ditt glasskåp")}e.currentTarget.textContent="Finns i mitt glasskåp";e.currentTarget.setAttribute("aria-pressed","true")});
  $("#pAsk",mb).addEventListener("click",()=>openConc(`Berätta om ${p.name}. Vad passar det till och hur sköter jag det?`));
  $("#pList",mb).addEventListener("change",e=>{$("#pListNew",mb).hidden=e.target.value!=="__ny";if(e.target.value==="__ny")$("#pListNew",mb).focus()});
  $("#pListGo",mb).addEventListener("click",()=>{let lid=$("#pList",mb).value;
    if(lid==="__ny"){const name=$("#pListNew",mb).value.trim();if(!name){toast("Ge listan ett namn");return}lid="l"+Date.now();S.lists.push({id:lid,name:name.slice(0,40),type:/bröllop/i.test(name)?"brollop":"egen",items:[]})}
    const L=S.lists.find(l=>l.id===lid);if(!L.items.includes(p.id))L.items.push(p.id);save();toast(p.name+" sparad i "+L.name)});
  let stars=0;
  $$("[data-star]",mb).forEach(b=>b.addEventListener("click",()=>{stars=+b.dataset.star;$$("[data-star]",mb).forEach(x=>x.classList.toggle("on",+x.dataset.star<=stars))}));
  $("#revForm",mb).addEventListener("submit",e=>{e.preventDefault();const t=$("#revTxt",mb).value.trim();if(!stars||t.length<5){toast("Välj betyg och skriv några ord");return}
    S.reviews=S.reviews.filter(r=>r.id!==p.id);S.reviews.push({id:p.id,stars,text:t.slice(0,600),ts:Date.now()});addPoints(50,"Recension av "+p.name);save();toast("Tack! 50 skålpoäng tillagda");openProduct(p.id)});
}
function renderStage(){
  const p=byId[pState.id],st=$("#mstage");if(!st)return;stop3d();
  $("#pThumbs").hidden=pState.tab!=="foto";
  if(pState.tab==="foto"){
    const src=pState.shot===0?(pState.lightOn?"assets/d-"+p.img+".webp":"assets/p-"+p.img+".webp"):pState.shot===1?scene(p):"assets/s-ask.webp";
    st.innerHTML=`<img src="${src}" alt="${esc(p.name)}">${pState.shot===0?`<div class="lightsw" role="group" aria-label="Ljus"><button data-l="0" aria-pressed="${!pState.lightOn}">Kvällsljus</button><button data-l="1" aria-pressed="${pState.lightOn}">Dagsljus</button></div>`:""}`;
    $$("[data-l]",st).forEach(b=>b.addEventListener("click",()=>{pState.lightOn=b.dataset.l==="1";renderStage()}));
  } else if(pState.tab==="form"){
    const pl=pours(p),[lab,cl]=pl[pState.pour]||pl[0];
    const frac=Math.min(1,cl/p.vol);
    const H=360,ppc=H/34, gh=p.h*ppc, gw=p.d*ppc;
    st.innerHTML=`<div class="form" style="background:linear-gradient(180deg,#221c18,#141110);color:#eee5d6">
      <svg viewBox="0 0 400 470" role="img" aria-label="${esc(p.name)} i skala bredvid en hand">
        <line x1="20" y1="400" x2="380" y2="400" stroke="#6b5f52" stroke-width="1"/>
        <g transform="${placeSil(p.shape,150,400,p.d*ppc,gh)}"><path d="${SH[p.shape]}" fill="none" stroke="#eee5d6" stroke-width="2.4" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/></g>
        <line x1="${150-gw/2-12}" y1="${400-gh*fillY(p.shape,frac)}" x2="${150+gw/2+12}" y2="${400-gh*fillY(p.shape,frac)}" stroke="#c49a5e" stroke-dasharray="4 4"/>
        <g transform="translate(260,${400-19*ppc})" opacity=".55"><rect x="0" y="0" width="${8.5*ppc}" height="${19*ppc}" rx="${3*ppc}" fill="none" stroke="#a89c8c" stroke-width="1.4"/><text x="${4.25*ppc}" y="${19*ppc+18}" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="11" fill="#a89c8c" letter-spacing="1">HAND 19 CM</text></g>
        <text x="150" y="${400-gh-14}" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="12" fill="#c49a5e" letter-spacing="1">${esc(cm(p.h).toUpperCase())} · Ø ${esc(cm(p.d).toUpperCase())}</text>
        <text x="200" y="452" text-anchor="middle" font-family="Hanken Grotesk,sans-serif" font-size="15" fill="#d9cfbf">${esc(lab)} fyller ungefär ${Math.round(frac*100)} % av glaset</text>
      </svg></div>
      <div class="pourbar" role="group" aria-label="Häll upp">${pl.map((x,i)=>`<button data-pour="${i}" aria-pressed="${i===pState.pour}">${esc(x[0])}</button>`).join("")}</div>`;
    $$("[data-pour]",st).forEach(b=>b.addEventListener("click",()=>{pState.pour=+b.dataset.pour;renderStage()}));
  } else {
    st.innerHTML=`<p class="mnote">Förenklad 3D-modell byggd från måtten. Dra för att vrida.</p><div class="pourbar" role="group" aria-label="Häll upp">${pours(p).map((x,i)=>`<button data-pour="${i}" aria-pressed="${i===pState.pour}">${esc(x[0])}</button>`).join("")}</div>`;
    $$("[data-pour]",st).forEach(b=>b.addEventListener("click",()=>{pState.pour=+b.dataset.pour;$$("[data-pour]",st).forEach(x=>x.setAttribute("aria-pressed",String(x===b)));if(g3)g3.setFill()}));
    start3d(st,p).catch(err=>{console.warn(err);st.insertAdjacentHTML("beforeend",`<div class="form"><p style="color:#d9cfbf;max-width:30ch;text-align:center">3D kunde inte laddas här. Prova fliken Form och storlek.</p></div>`)});
  }
}

/* ---------- 3D med three.js ---------- */
let THREE=null,g3=null;
function stop3d(){if(g3){g3.stop();g3=null}}
async function start3d(st,p){
  if(!THREE)THREE=await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");
  if(!st.isConnected||pState.tab!=="3d")return;
  const T=THREE,W=st.clientWidth,H=st.clientHeight;
  const renderer=new T.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(2,devicePixelRatio||1));renderer.setSize(W,H);renderer.toneMapping=T.ACESFilmicToneMapping;
  st.prepend(renderer.domElement);
  const sc=new T.Scene();
  /* Egen miljö: varma ljusplattor i ett mörkt rum */
  const env=new T.Scene();env.background=new T.Color(0x16110e);
  const panel=(c,x,y,z,w,h,ry)=>{const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:c,side:T.DoubleSide}));m.position.set(x,y,z);m.rotation.y=ry||0;env.add(m)};
  panel(0xffe2b0,-4,2,0,3,6,Math.PI/2);panel(0xffc98a,4,1,1,2,5,-Math.PI/2);panel(0xfff4e0,0,5,0,6,1,0);panel(0x7c1e2c,0,-1,-4,8,2,0);
  const pm=new T.PMREMGenerator(renderer);sc.environment=pm.fromScene(env,.04).texture;
  const cam=new T.PerspectiveCamera(30,W/H,.1,100);
  const h=p.h/10,R=p.d/20,{pts,b}=profOf(p.shape);
  cam.position.set(0,h*.55,h*3.1+R*2);cam.lookAt(0,h*.45,0);
  const glassPts=pts.map(([r,y])=>new T.Vector2(Math.max(.002,r*R),y*h));
  const glassMat=new T.MeshPhysicalMaterial({color:0xf4ede2,metalness:0,roughness:.03,transparent:true,opacity:.2,side:T.DoubleSide,envMapIntensity:2.2,clearcoat:1,clearcoatRoughness:.03,depthWrite:false});
  if(p.mat==="Stengods"){glassMat.opacity=1;glassMat.depthWrite=true;glassMat.color.set(0x2a2320);glassMat.roughness=.5;glassMat.envMapIntensity=.6}
  const group=new T.Group();sc.add(group);
  const gm=new T.Mesh(new T.LatheGeometry(glassPts,64),glassMat);gm.renderOrder=2;group.add(gm);
  const liqCol={vin:0x6a1220,champagne:0xe0c27a,whisky:0xa8611e,cocktail:0xd8cfa8,vatten:0xcfe3e8,kaffe:0x2b170c,te:0x9a5d1e,karaff:0x6a1220}[p.drinks[0]]||0xcfe3e8;
  const liqMat=new T.MeshPhysicalMaterial({color:liqCol,roughness:.15,transparent:true,opacity:p.drinks[0]==="vatten"?.45:.88,envMapIntensity:.8});
  let liq=null;
  const setFill=()=>{
    if(liq){group.remove(liq);liq.geometry.dispose()}
    const pl=pours(p),[,cl]=pl[pState.pour]||pl[0],fy=fillY(p.shape,Math.min(1,cl/p.vol));
    const y0=pts[b-1]?pts[b-1][1]:0,L=[new T.Vector2(.001,y0*h+.003)];
    pts.slice(b-1).forEach(([r,y])=>{if(y<fy)L.push(new T.Vector2(Math.max(.002,r*R*.94),y*h+.003))});
    L.push(new T.Vector2(rAt(pts,fy)*R*.94,fy*h),new T.Vector2(.001,fy*h));
    liq=new T.Mesh(new T.LatheGeometry(L,64),liqMat);liq.renderOrder=0;group.add(liq);
  };
  if(p.mat!=="Stengods")setFill();
  const floor=new T.Mesh(new T.CircleGeometry(R*6,48),new T.MeshStandardMaterial({color:0x1d1714,roughness:.9}));floor.rotation.x=-Math.PI/2;sc.add(floor);
  sc.add(new T.HemisphereLight(0xfff1dc,0x1a1310,.6));const key=new T.DirectionalLight(0xffe0b0,1.2);key.position.set(-2,4,3);sc.add(key);
  let rot=.4,vel=reduce?0:.004,drag=false,lx=0,raf=0,alive=true;
  const cv=renderer.domElement;cv.style.touchAction="none";
  cv.addEventListener("pointerdown",e=>{drag=true;lx=e.clientX;cv.setPointerCapture(e.pointerId)});
  cv.addEventListener("pointermove",e=>{if(!drag)return;const d=(e.clientX-lx)*.01;lx=e.clientX;rot+=d;vel=d*.3});
  const up=()=>{drag=false};cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
  const loop=()=>{if(!alive)return;raf=requestAnimationFrame(loop);if(!drag){rot+=vel;vel=vel*.98+(reduce?0:.004)*.02}group.rotation.y=rot;renderer.render(sc,cam)};
  loop();
  g3={setFill:()=>{if(p.mat!=="Stengods")setFill()},stop(){alive=false;cancelAnimationFrame(raf);renderer.dispose();pm.dispose();cv.remove()}};
}

/* ---------- Varukorg ---------- */
let cart=[];
try{cart=JSON.parse(localStorage.getItem("skal-cart")||"[]").filter(l=>l.id==="provlada"||byId[l.id])}catch(e){}
const badge=$("#badge"), drawer=$("#drawer");
const unit=l=>l.id==="provlada"?149:byId[l.id].price+(l.grav?149:0)+(l.wrap?49:0);
const cartTotal=()=>cart.reduce((a,l)=>a+unit(l)*l.q,0);
function saveCart(){try{localStorage.setItem("skal-cart",JSON.stringify(cart))}catch(e){}}
function addCart(id,q=1,quiet,opt={}){
  const key=id+"|"+(opt.grav||"")+"|"+(opt.wrap?1:0)+(opt.items?"|"+opt.items.join(","):"");
  const L=cart.find(l=>l.key===key);
  if(id!=="provlada")track("add_to_cart",{items:[itemOf(byId[id],q)]});else track("add_to_cart",{items:[{item_id:"provlada",item_name:"Provlåda",price:149,quantity:1}]});
  if(L)L.q+=q;else cart.push({key,id,q,grav:opt.grav||"",wrap:!!opt.wrap,items:opt.items||null});
  saveCart();renderCart();badge.classList.remove("pop");void badge.offsetWidth;badge.classList.add("pop");
  if(!quiet)toast((id==="provlada"?"Provlådan":byId[id].name)+" ligger i varukorgen");
}
document.addEventListener("click",e=>{
  const a=e.target.closest("[data-add]");if(a){e.preventDefault();addCart(a.dataset.add,+(a.dataset.qty||1),false);return}
  const q=e.target.closest("[data-q]");if(q){const [k,d]=q.dataset.q.split("~");const L=cart.find(l=>l.key===k);if(L){L.q+=+d;if(+d<0&&byId[L.id])track("remove_from_cart",{items:[itemOf(byId[L.id],1)]});if(L.q<=0)cart=cart.filter(x=>x!==L)}saveCart();renderCart()}
  if(e.target.closest("[data-close]"))openCart(false);
});
$("#cartBtn").addEventListener("click",()=>openCart(true));
function openCart(on){drawer.classList.toggle("open",on);drawer.setAttribute("aria-hidden",String(!on));drawer.inert=!on;if(on){lastFocus=document.activeElement;$("[data-close].icon-btn",drawer).focus()}}
function renderCart(){
  let n=0;const sups=new Set();
  const rows=cart.map(l=>{n+=l.q;
    if(l.id==="provlada"){sups.add("A");return `<div class="line"><img src="assets/s-ask.webp" alt=""><div><b>Provlåda</b><span>${l.items.map(i=>byId[i]?.name).filter(Boolean).map(esc).join(", ")}</span><div class="qty"><button data-q="${esc(l.key)}~-1" aria-label="Ta bort">−</button>${l.q}<button data-q="${esc(l.key)}~1" aria-label="En till">+</button></div></div><span>${kr(149*l.q)}</span></div>`}
    const p=byId[l.id];sups.add(p.sup);
    return `<div class="line"><img src="${img(p,true)}" data-pimg="${p.id}" alt=""><div><b>${esc(p.name)}</b><span>${packTxt(p)}${l.grav?` · gravyr: ”${esc(l.grav)}”`:""}${l.wrap?" · presentinslagning":""}</span><div class="qty"><button data-q="${esc(l.key)}~-1" aria-label="En färre">−</button>${l.q}<button data-q="${esc(l.key)}~1" aria-label="En till">+</button></div></div><span>${kr(unit(l)*l.q)}</span></div>`});
  const t=cartTotal();
  badge.textContent=n;badge.classList.toggle("on",n>0);$("#cartBtn").setAttribute("aria-label",`Varukorg, ${n} varor`);
  $("#lines").innerHTML=(rows.join("")||'<p class="empty">Varukorgen är tom. Glasguiden eller Glas-swipe hjälper dig att hitta rätt.</p>')+(sups.size>1?`<p class="split">Din order skickas i ${sups.size} paket direkt från glasbruken. Du får spårning för varje paket.</p>`:"");
  $("#total").textContent=kr(t);
  const left=Math.max(0,799-t);
  $("#ship").innerHTML=(left?`Du har <b>${kr(left)}</b> kvar till fri frakt.`:"Du har fri frakt.")+`<div class="bar2"><i style="width:${Math.min(100,t/799*100)}%"></i></div>`;
  $("#checkout").disabled=!cart.length;
}

/* ---------- Kassa (visning) ---------- */
$("#checkout").addEventListener("click",()=>{
  if(!cart.length)return;openCart(false);track("begin_checkout",{value:cartTotal()});
  const t=cartTotal(),sups=new Set(cart.map(l=>l.id==="provlada"?"A":byId[l.id].sup));
  openModal(`<div class="co"><span class="mono">Kassa · visningsversion</span><h2 style="margin:8px 0 6px;font-size:clamp(28px,3vw,40px)">Nästan klart.</h2><p class="note" style="margin-bottom:10px">Inget köp genomförs och ingen betalning tas. Så här kommer kassan att fungera.</p>
  <form id="coForm" class="co-grid"><div>
    <h3>Dina uppgifter</h3><p class="note" style="margin:0 0 8px">Du kan handla som gäst. Konto behövs inte.</p>
    <input class="field" id="coMail" type="email" placeholder="E-post för orderbekräftelse" aria-label="E-post" style="margin-bottom:8px">
    <h3>Leverans</h3>
    ${[["ombud","Hämta hos ombud",t>=799?"0 kr":"49 kr"],["skap","Paketskåp",t>=799?"0 kr":"39 kr"],["hem","Hemleverans kväll","89 kr"]].map((o,i)=>`<label class="radio"><input type="radio" name="del" value="${o[0]}" ${i===0?"checked":""}> ${o[1]}<span>${o[2]}</span></label>`).join("")}
    <h3>Betalning</h3>
    ${[["klarna","Klarna, betala senare"],["swish","Swish"],["kort","Kort, Apple Pay eller Google Pay"]].map((o,i)=>`<label class="radio"><input type="radio" name="pay" value="${o[0]}" ${i===0?"checked":""}> ${o[1]}</label>`).join("")}
  </div><div>
    <h3>Din order</h3>
    ${cart.map(l=>`<div style="display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);font-size:15px"><span>${l.q} × ${l.id==="provlada"?"Provlåda":esc(byId[l.id].name)}</span><span>${kr(unit(l)*l.q)}</span></div>`).join("")}
    <div style="display:flex;justify-content:space-between;padding:14px 0;font-size:18px"><b>Totalt</b><b>${kr(t)}</b></div>
    ${sups.size>1?`<p class="split" style="margin:0 0 12px">Kommer i ${sups.size} paket, med spårning för varje.</p>`:""}
    <p class="note">Du får ${Math.floor(t/10)} skålpoäng för köpet.</p><p class="note">Du kan ångra köpet i 60 dagar med knappen Ångra avtalet här i sidfoten eller vid köpet i Mitt glasskåp. Läs <a href="villkor/" data-lj="l-kop">köpvillkoren</a>.</p>
    <button class="btn btn-primary" style="width:100%;margin-top:10px">Slutför köp (visning)</button>
  </div></form></div>`,"Kassa","co");
  $("#coForm").addEventListener("submit",e=>{e.preventDefault();
    const order={id:"SK"+String(Date.now()).slice(-6),ts:Date.now(),total:t,lines:cart.map(l=>({id:l.id,q:l.q,grav:l.grav,wrap:l.wrap,items:l.items}))};
    S.orders.unshift(order);
    cart.forEach(l=>{if(l.id==="provlada")return;const p=byId[l.id],o=S.owned.find(x=>x.id===p.id);if(o)o.count+=p.pack*l.q;else S.owned.push({id:p.id,name:p.name,shape:p.shape,count:p.pack*l.q})});
    addPoints(Math.floor(t/10),"Köp "+order.id);track("purchase",{transaction_id:order.id,value:t,currency:"SEK"});
    cart=[];saveCart();renderCart();save();
    $("#mbody").innerHTML=`<div class="co" style="text-align:center;padding:clamp(40px,6vw,80px)"><span class="mono">Order ${order.id} · visning</span><h2 style="margin:12px 0">Tack! Glasen är på väg.</h2><p class="lead" style="margin:0 auto">Glasen finns nu i Mitt glasskåp. Där kan du ersätta ett trasigt glas med två klick och se vad som saknas i serien.</p><div class="ctas" style="justify-content:center;margin-top:24px;display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn-primary" href="glasskap/" data-mclose>Öppna Mitt glasskåp</a><button class="btn btn-ghost" data-mclose>Fortsätt handla</button></div></div>`;
  });
});
