
/* ---------- Öppna produkt via adress ---------- */
function showProduct(id){
  if(modal.classList.contains("open")&&modal.dataset.kind==="product"){history.replaceState(null,"","#p-"+id);openProduct(id)}
  else{openedByUs=true;location.hash="p-"+id}
}
document.addEventListener("click",e=>{const o=e.target.closest("[data-open]");if(!o||e.target.closest("[data-add],.cmp,[data-fav]"))return;e.preventDefault();showProduct(o.dataset.open)});

/* ---------- Glasguiden ---------- */
const FQ=[
 {k:"drink",q:"Vilken dryck ska glaset användas till?",o:[["vin","Rött vin"],["vitt","Vitt vin"],["champagne","Bubbel"],["whisky","Whisky"],["cocktail","Cocktail"],["vatten","Vatten"],["kaffe","Kaffe"],["te","Te"],["ol","Öl"],["dessert","Dessert"]]},
 {k:"occ",q:"Vad ska du främst använda dem till?",o:[["vardag","Vardag"],["middag","Middagsbjudning"],["fest","Fest"],["hemmabar","Hemmabar"],["present","Present"]]},
 {k:"style",q:"Vilken stil föredrar du?",o:[["skandinavisk","Skandinavisk"],["klassisk","Klassisk kristall"],["modern","Modern"],["lyx","Lyx"],["fargstark","Färgstarkt"]]},
 {k:"color",q:"Klart eller färgat glas?",o:[["klart","Klart"],["fargat","Färgat"],["spelar","Spelar ingen roll"]]},
 {k:"budget",q:"Vad får ett glas kosta?",o:[["150","Upp till 150 kr"],["300","150 till 300 kr"],["9999","Över 300 kr"]]},
 {k:"count",q:"Hur många glas behöver du?",o:[["2","2"],["4","4"],["6","6"],["12","12"]]}
];
const DRINKSHAPE={vin:["rott","Bourgogne"],vitt:["vitt","Tulpan"],champagne:["flojt","Flöjt, coupe eller tulpan"],whisky:["whisky","Provglas"],cocktail:["cocktail","Nick & Nora"],vatten:["tumbler","Tumbler"],kaffe:["dubbel","Dubbelväggat"],te:["te","Glaskopp"],ol:["ol","Tulpan för öl"],dessert:["dessert","Dessertskål"]};
let fs=0; const fa={};
$("#dots").innerHTML=FQ.map(()=>"<i></i>").join("");
function drawShape(key,label){
  const l=$("#gLine"),f=$("#gFill"),fl=FILL[key];
  l.setAttribute("d",SH[key]);f.setAttribute("d",fl?fl[0]:"");
  $$("#wine stop")[0].setAttribute("stop-color",fl?fl[1]:"#9a2a3a");$$("#wine stop")[1].setAttribute("stop-color",shade(fl?fl[1]:"#9a2a3a"));
  l.classList.remove("draw");f.classList.remove("on");void l.getBoundingClientRect();l.classList.add("draw");requestAnimationFrame(()=>f.classList.add("on"));
  $("#gLabel").textContent=label||"";
}
function shade(h){const n=parseInt(h.slice(1),16);return"#"+[(n>>16)&255,(n>>8)&255,n&255].map(v=>Math.round(v*.45).toString(16).padStart(2,"0")).join("")}
let finderRes=[];
function renderFinder(){
  $$("#dots i").forEach((d,i)=>d.classList.toggle("on",i<=fs));
  if(fs<FQ.length){
    const q=FQ[fs];
    $("#fq").innerHTML=`<div class="fq"><span class="mono">Fråga ${fs+1} av ${FQ.length}</span><h2 class="fq-h" style="margin-top:8px">${q.q}</h2><div class="chips">${q.o.map(o=>`<button class="chip" data-fa="${o[0]}" aria-pressed="${fa[q.k]===o[0]}">${o[1]}</button>`).join("")}</div><div class="fnav">${fs?'<button class="btn btn-ghost" id="fBack">Tillbaka</button>':""}</div></div>`;
  } else {
    const res=scoreFinder(), n=+fa.count;
    finderRes=res;
    S.finder={...fa,drink:fa.drink==="vitt"?"vin":fa.drink,ts:Date.now()};save(true);track("tool_complete",{tool:"glasguiden",results:res.length});
    $("#fq").innerHTML=`<div class="fq"><span class="mono">Dina förslag</span><h2 class="fq-h" style="margin-top:8px">${res.length?(res.length===1?"Ett glas passar dig.":res.length+" glas som passar dig."):"Inget passar exakt än."}</h2><div class="fres">${res.map(r=>{const packs=Math.ceil(n/r.p.pack);return `<div class="pick"><img src="${img(r.p,true)}" data-pimg="${r.p.id}" alt="" data-open="${r.p.id}" style="cursor:pointer"><div><b>${esc(r.p.name)}</b><p>${esc(r.why)}</p><p>${packs} × ${packTxt(r.p)} = ${kr(packs*r.p.price)}</p><label class="note" style="display:inline-flex;gap:6px;align-items:center;margin:4px 0 0;cursor:pointer"><input type="checkbox" data-cmp="${r.p.id}" ${cmpSet.has(r.p.id)?"checked":""}> Jämför</label></div><button class="round" data-add="${r.p.id}" data-qty="${packs}" aria-label="Lägg ${esc(r.p.name)} i varukorgen">+</button></div>`}).join("")||'<p class="lead">Vi har inte det glaset i visningsversionen. Fråga glassommelieren, så får du närmaste alternativ.</p>'}</div><div class="fnav"><button class="btn btn-ghost" id="fRestart">Börja om</button>${res.length?'<button class="btn btn-ghost" id="fSave">Spara förslagen</button><button class="btn btn-primary" id="fAll">Lägg alla i varukorgen</button>':""}</div></div>`;
  }
}
function scoreFinder(){
  const d=fa.drink==="vin"?"rott":fa.drink, budget=+fa.budget, lo=budget===300?150:budget===9999?300:0;
  return P.map(p=>{let s=0;const w=[];
    if(p.drinks.includes(d)||p.cat===d){s+=6;w.push(DRINKSHAPE[fa.drink][1]+"-form för "+FQ[0].o.find(o=>o[0]===fa.drink)[1].toLowerCase())}
    if(p.occ.includes(fa.occ)){s+=2;w.push("passar "+FQ[1].o.find(o=>o[0]===fa.occ)[1].toLowerCase())}
    if(p.style.includes(fa.style)){s+=2;w.push(FQ[2].o.find(o=>o[0]===fa.style)[1].toLowerCase()+" stil")}
    const col=p.props.includes("fargat");if(fa.color==="spelar"||(fa.color==="fargat")===col)s+=1;
    const pg=per(p);if(pg<=budget&&pg>lo){s+=2;w.push("inom budget, "+kr(pg)+" per glas")}else if(pg<=budget)s+=1;
    return {p,s,why:w.length?w.join(", ").replace(/^./,c=>c.toUpperCase())+".":""};
  }).filter(r=>r.s>=6&&r.p.cat!=="karaff").sort((a,b)=>b.s-a.s).slice(0,5);
}
$("#fq").addEventListener("click",e=>{
  const a=e.target.closest("[data-fa]");
  if(a){fa[FQ[fs].k]=a.dataset.fa;if(fs===0)drawShape(...DRINKSHAPE[a.dataset.fa]);fs++;renderFinder();return}
  if(e.target.closest("#fBack")){fs--;renderFinder();return}
  if(e.target.closest("#fRestart")){fs=0;for(const k in fa)delete fa[k];renderFinder();return}
  if(e.target.closest("#fSave")){S.saved.unshift({type:"guide",title:"Glasguiden: "+FQ[0].o.find(o=>o[0]===fa.drink)[1].toLowerCase()+", "+fa.count+" glas",data:{ids:finderRes.map(r=>r.p.id),count:+fa.count},ts:Date.now()});save();toast("Sparat i Mitt glasskåp");return}
  if(e.target.closest("#fAll")){finderRes.forEach(r=>addCart(r.p.id,Math.ceil(+fa.count/r.p.pack),true));toast("Dina förslag ligger i varukorgen")}
});

/* ---------- Glas-swipe ---------- */
const MOOD=[
 {mood:"l-middag",title:"Långa middagar",sub:"Levande ljus och kristall",t:{"s:klassisk":1,"s:lyx":.6,"d:vin":1}},
 {mood:"s-tre-glas",title:"Ren nordisk form",sub:"Enkla linjer, klart glas",t:{"s:skandinavisk":1,"s:modern":.8,"c:klar":.6}},
 {mood:"l-bar",title:"Hemmabaren",sub:"Whisky och mörkt trä",t:{"d:whisky":1,"d:cocktail":.6,"t:high":.5}},
 {mood:"l-kaffe",title:"Lugna morgnar",sub:"Kaffe i solen",t:{"d:kaffe":1,"s:skandinavisk":.5,"t:low":.5}},
 {mood:"s-ask",title:"Presenten som imponerar",sub:"Silkespapper och tung ask",t:{"s:lyx":1,"t:high":1}},
 {mood:"d-coupe",title:"1920-talets fest",sub:"Champagneskål och jazz",t:{"s:vintage":1,"d:champagne":1}}
];
const SWDECK=[];["bourgogne","coupe","whisky","kaffe","nora","bolja","perla","svavar","boljahigh","humle"].map(id=>byId[id]).forEach((p,i)=>{SWDECK.push({p});if(MOOD[i])SWDECK.push(MOOD[i])});
let swI=0,swW={},swLog=[];
const PROFNAME={skandinavisk:["Nordiskt ljus","enkel nordisk form"],klassisk:["Klassisk kristall","tidlös kristall"],modern:["Ren modern","moderna linjer"],fargstark:["Färgglad vardag","glas med färg"],vintage:["Vintagesalongen","vintage och 1920-tal"],lyx:["Kvällslyx","lyx och tyngd"],rustik:["Rustik värme","hantverk och struktur"]};
function tagsOf(c){if(c.t)return c.t;const p=c.p,t={};p.style.forEach(s=>t["s:"+s]=1);p.drinks.forEach(d=>t["d:"+d]=.8);t["t:"+tier(p)]=.7;t[p.props.includes("fargat")?"c:farg":"c:klar"]=.6;return t}
function renderDeck(){
  const deck=$("#deck");$("#sprog").style.width=(swI/SWDECK.length*100)+"%";
  if(swI>=SWDECK.length){finishSwipe();return}
  const show=SWDECK.slice(swI,swI+3).reverse();
  deck.innerHTML=show.map((c,k)=>{const top=k===show.length-1,depth=show.length-1-k;const src=c.p?img(c.p):"assets/"+c.mood+".webp";
    return `<div class="scard" data-top="${top}" style="transform:translateY(${depth*12}px) scale(${1-depth*.04});z-index:${k}" ${top?`tabindex="0" aria-label="${esc(c.p?c.p.name:c.title)}"`:"aria-hidden=\"true\""}><img src="${src}" alt=""><span class="stamp yes">GILLAR</span><span class="stamp no">NEJ</span><span class="stamp save">SPARA</span><div class="t"><b>${esc(c.p?c.p.name:c.title)}</b><span>${esc(c.p?c.p.mat+" · "+kr(per(c.p))+" per glas":c.sub)}</span></div></div>`}).join("");
  const el=$('.scard[data-top="true"]',deck);if(el)bindDrag(el);
  renderProfile(false);
}
function bindDrag(el){
  let sx=0,sy=0,dx=0,dy=0,on=false;
  const st=s=>$(".stamp."+s,el);
  el.addEventListener("pointerdown",e=>{on=true;sx=e.clientX;sy=e.clientY;el.setPointerCapture(e.pointerId);el.style.transition="none"});
  el.addEventListener("pointermove",e=>{if(!on)return;dx=e.clientX-sx;dy=e.clientY-sy;el.style.transform=`translate(${dx}px,${dy}px) rotate(${dx/18}deg)`;st("yes").style.opacity=Math.max(0,dx/110);st("no").style.opacity=Math.max(0,-dx/110);st("save").style.opacity=Math.max(0,-dy/110)*(Math.abs(dx)<60?1:0)});
  const end=()=>{if(!on)return;on=false;el.style.transition="";
    if(dx>110)swipe("yes");else if(dx<-110)swipe("no");else if(dy<-110)swipe("save");
    else{el.style.transform="";$$(".stamp",el).forEach(s=>s.style.opacity=0)}dx=dy=0};
  el.addEventListener("pointerup",end);el.addEventListener("pointercancel",end);
}
function swipe(kind){
  const c=SWDECK[swI];if(!c)return;
  const el=$('.scard[data-top="true"]');
  if(el){const x=kind==="yes"?600:kind==="no"?-600:0,y=kind==="save"?-700:40;el.style.transform=`translate(${x}px,${y}px) rotate(${x/20}deg)`;el.style.opacity=0;}
  const k=kind==="yes"?1:kind==="save"?1.5:-.6,t=tagsOf(c);
  for(const key in t)swW[key]=(swW[key]||0)+t[key]*k;
  swLog.push({kind,id:c.p?c.p.id:c.mood});
  if(kind==="save"&&c.p&&!isFav(c.p.id)){S.favs.unshift(c.p.id);save(true);refreshHearts()}
  swI++;setTimeout(renderDeck,reduce?0:260);
}
$("#sbtns").addEventListener("click",e=>{const b=e.target.closest("[data-sw]");if(b)swipe(b.dataset.sw)});
document.addEventListener("keydown",e=>{if(curView!=="upptack"||modal.classList.contains("open")||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
  if(e.key==="ArrowRight"){e.preventDefault();swipe("yes")}else if(e.key==="ArrowLeft"){e.preventDefault();swipe("no")}else if(e.key==="ArrowUp"){e.preventDefault();swipe("save")}});
function buildProfile(w){
  const styles=Object.keys(STYLEN).filter(s=>(w["s:"+s]||0)>0).sort((a,b)=>w["s:"+b]-w["s:"+a]);
  const drinks=Object.keys(DRINKN).filter(d=>(w["d:"+d]||0)>0).sort((a,b)=>w["d:"+b]-w["d:"+a]);
  const top=styles[0]||"skandinavisk";
  const summary=[styles.slice(0,2).map(s=>PROFNAME[s][1]).join(" och "),drinks.length?"gärna "+drinks.slice(0,2).map(d=>DRINKN[d].toLowerCase()).join(" och "):""].filter(Boolean).join(", ");
  return {name:PROFNAME[top][0],summary:summary||"öppen för det mesta",w:{...w},ts:Date.now()};
}
function renderProfile(done){
  const w=swW,keys=Object.keys(w).filter(k=>k.startsWith("s:")||k.startsWith("d:")).filter(k=>w[k]>0).sort((a,b)=>w[b]-w[a]).slice(0,4);
  const max=Math.max(1,...keys.map(k=>w[k]));
  const label=k=>k.startsWith("s:")?STYLEN[k.slice(2)]:DRINKN[k.slice(2)];
  const prof=done?buildProfile(w):null;
  $("#profile").innerHTML=done?`<span class="mono">Din stil</span><h2 class="pc-h">${esc(prof.name)}</h2><p class="lead" style="font-size:17px">Du gillar ${esc(prof.summary)}.</p><div class="bars">${keys.map(k=>`<div>${esc(label(k))}<i style="--w:${Math.round(w[k]/max*100)}%"></i></div>`).join("")}</div><span class="mono">Tre glas för dig</span><div class="gk-list">${recommend(3).map(r=>`<div class="gk-item" data-open="${r.p.id}" style="cursor:pointer"><img src="${img(r.p,true)}" data-pimg="${r.p.id}" alt=""><div><b>${esc(r.p.name)}</b><small>${esc(r.why||r.p.why)}</small></div><span>${kr(r.p.price)}</span></div>`).join("")}</div><div class="pdp-actions" style="margin-top:16px"><button class="small-btn" id="swShare">Kopiera min stil</button><button class="small-btn" id="swAgain">Swipea igen</button><a class="small-btn" href="#glasskap">Mitt glasskåp</a></div>`
  :`<span class="mono">Din smak hittills</span><h2 class="pc-h">${swI?"Vi lär oss.":"Börja swipea."}</h2>${keys.length?`<div class="bars">${keys.map(k=>`<div>${esc(label(k))}<i style="--w:${Math.round(w[k]/max*100)}%"></i></div>`).join("")}</div>`:`<p class="note">Varje bild säger något om din stil. Efter ${SWDECK.length} bilder får du ett namn på din stil och tre glas som passar.</p>`}<p class="note">${swI} av ${SWDECK.length} bilder</p>`;
  if(done){
    $("#swAgain").addEventListener("click",()=>{swI=0;swW={};swLog=[];renderDeck()});
    $("#swShare").addEventListener("click",()=>copy(`Min glasstil hos SKÅL & CO: ${prof.name}. Jag gillar ${prof.summary}.`,"Din stil är kopierad"));
  }
}
function finishSwipe(){
  $("#deck").innerHTML=`<div class="scard" style="cursor:default;display:grid;place-items:center;text-align:center;padding:30px"><img src="assets/s-tre-glas.webp" alt=""><div class="t" style="position:relative;inset:auto"><b>Klart!</b><span>Din stil är sparad i Mitt glasskåp.</span></div></div>`;
  S.profile=buildProfile(swW);track("tool_complete",{tool:"glas-swipe",style:buildProfile(swW).name});S.saved.unshift({type:"swipe",title:"Glas-swipe: "+S.profile.name,data:{log:swLog.slice(-20)},ts:Date.now()});save();
  renderProfile(true);
}
async function copy(text,msg){track("share",{method:"kopiera"});try{await navigator.clipboard.writeText(text);toast(msg||"Kopierat")}catch(e){toast("Kunde inte kopiera här. Markera texten och kopiera själv.")}}

/* ---------- Glasväggen ---------- */
const WALLCATS=[["alla","Alla",()=>true],["vin","Vin och bubbel",p=>["vin","champagne"].includes(p.cat)],["bar","Bar",p=>["whisky","cocktail"].includes(p.cat)],["vardag","Vardag",p=>p.cat==="vatten"],["varmt","Kaffe och te",p=>["kaffe","te"].includes(p.cat)],["olds","Öl och dessert",p=>["ol","dessert"].includes(p.cat)],["karaff","Karaffer",p=>p.cat==="karaff"]];
const REFS=[["hand","Hand",8.5,19],["flaska","Vinflaska",7.5,30],["mobil","Mobil",7,15]];
let wallCat="alla",wallRef="hand";
$("#wallCats").innerHTML=WALLCATS.map(c=>`<button class="chip" data-wc="${c[0]}">${c[1]}</button>`).join("");
$("#wallRef").innerHTML=REFS.map(r=>`<button class="chip" data-wr="${r[0]}">${r[1]}</button>`).join("");
$("#wallCats").addEventListener("click",e=>{const b=e.target.closest("[data-wc]");if(b){wallCat=b.dataset.wc;renderWall()}});
$("#wallRef").addEventListener("click",e=>{const b=e.target.closest("[data-wr]");if(b){wallRef=wallRef===b.dataset.wr?"":b.dataset.wr;renderWall()}});
$("#shelf").addEventListener("input",e=>{$("#shelfOut").textContent=e.target.value+" cm";renderWall()});
function renderWall(){
  $$("[data-wc]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.wc===wallCat)));
  $$("[data-wr]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.wr===wallRef)));
  const L=P.filter(WALLCATS.find(c=>c[0]===wallCat)[2]);
  const ref=REFS.find(r=>r[0]===wallRef);
  const shelf=+$("#shelf").value, base=420, ppc=360/36;
  const items=[...(ref?[{ref}]:[]),...L];
  const gap=40;let x=60;
  const pos=items.map(it=>{const w=(it.ref?it.ref[2]:it.d)*ppc;const cx=x+w/2;x+=w+gap+30;return {it,cx,w}});
  const W=Math.max(1000,x+20);
  const col=getComputedStyle(root).getPropertyValue("--ink").trim(),mut=getComputedStyle(root).getPropertyValue("--muted").trim(),acc=getComputedStyle(root).getPropertyValue("--accent").trim();
  let svg=`<svg viewBox="0 0 ${W} 480" style="min-width:${Math.round(W*.6)}px" aria-label="Glas i skala"><line x1="20" y1="${base}" x2="${W-20}" y2="${base}" stroke="${mut}" stroke-width="1"/>`;
  for(let c=0;c<=35;c+=5)svg+=`<g opacity=".5"><line x1="20" y1="${base-c*ppc}" x2="34" y2="${base-c*ppc}" stroke="${mut}"/><text x="38" y="${base-c*ppc+4}" font-family="IBM Plex Mono,monospace" font-size="10" fill="${mut}">${c}</text></g>`;
  svg+=`<line x1="20" y1="${base-shelf*ppc}" x2="${W-20}" y2="${base-shelf*ppc}" stroke="${acc}" stroke-dasharray="6 6"/><text x="${W-24}" y="${base-shelf*ppc-8}" text-anchor="end" font-family="IBM Plex Mono,monospace" font-size="11" letter-spacing="1" fill="${acc}">HYLLA ${shelf} CM</text>`;
  pos.forEach(({it,cx,w})=>{
    if(it.ref){const [,name,rw,rh]=it.ref,h=rh*ppc;
      const shape=it.ref[0]==="flaska"?`<path d="M${cx-rw*ppc/2} ${base} L${cx-rw*ppc/2} ${base-h*.62} Q${cx-rw*ppc/2} ${base-h*.72} ${cx-rw*ppc*.18} ${base-h*.78} L${cx-rw*ppc*.18} ${base-h} L${cx+rw*ppc*.18} ${base-h} L${cx+rw*ppc*.18} ${base-h*.78} Q${cx+rw*ppc/2} ${base-h*.72} ${cx+rw*ppc/2} ${base-h*.62} L${cx+rw*ppc/2} ${base} Z"/>`:`<rect x="${cx-rw*ppc/2}" y="${base-h}" width="${rw*ppc}" height="${h}" rx="${it.ref[0]==="hand"?rw*ppc*.4:10}"/>`;
      svg+=`<g fill="none" stroke="${mut}" stroke-width="1.4" stroke-dasharray="${it.ref[0]==="hand"?"3 4":"0"}" opacity=".8">${shape}</g><text x="${cx}" y="${base+22}" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="11" letter-spacing="1" fill="${mut}">${esc(name.toUpperCase())} ${rh} CM</text>`;
      return}
    const p=it,tall=p.h>shelf;
    svg+=`<g class="g" data-open="${p.id}" tabindex="0" role="button"><g transform="${placeSil(p.shape,cx,base,p.d*ppc,p.h*ppc)}"><path d="${SH[p.shape]}" fill="none" stroke="${tall?"#d0475a":col}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" stroke-width="2"/></g><text x="${cx}" y="${base+22}" text-anchor="middle" font-family="Hanken Grotesk,sans-serif" font-size="14" fill="${col}">${esc(p.name)}</text><text x="${cx}" y="${base+40}" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="11" fill="${tall?"#d0475a":mut}">${esc(cm(p.h))}${tall?" · FÖR HÖG":""}</text></g>`;
  });
  svg+="</svg>";
  $("#wall").innerHTML=svg;
}
$("#wall").addEventListener("keydown",e=>{if(e.key==="Enter"){const g=e.target.closest("[data-open]");if(g)showProduct(g.dataset.open)}});

/* ---------- Dukningsstudion 2.0 ---------- */
const STY={skandinavisk:["Skandinavisk","#e9e1d4","#d9cdb9","#b48a5a","#2b2622",null],lyx:["Modern lyx","#191512","#2a221d","#0c0b0a","#e9dcc4","rgba(196,154,94,.18)"],naturlig:["Naturlig","#e6dfd0","#d6ccb8","#a88b62","#3d3a2c","rgba(109,113,86,.18)"],klassisk:["Klassisk","#f6f2ea","#ebe4d8","#fbf8f2","#3a332d",null],minimal:["Minimalistisk","#dcdad6","#cfccc7","#9a9894","#222222",null],fargstark:["Färgstark","#f1e7d6","#e5d6bd","#d8b98a","#2f5a3c","rgba(80,140,90,.28)"],vintage:["Vintage","#2b2118","#3a2c20","#4a3423","#d9a55a","rgba(217,165,90,.22)"]};
const ROLES=[["vatten","Vattenglas",["bolja","boljahigh"]],["vin","Vinglas",["bourgogne","vitvin"]],["bubbel","Bubbel",["perla","coupe","vitvin"]],["drink","Drink",["nora","coupe","boljahigh"]],["ol","Öl",["humle"]],["avec","Avec",["whisky"]],["dessert","Dessert",["svala"]],["karaff","Karaff",["karaff"]],["kaffe","Kaffe",["svavar","kaffe","anga"]]];
const TABLES={stil:["Stilens bord",null],ek:["Ek","#6b4a2f"],marmor:["Marmor","#e6e1d8"],linne:["Linneduk","#d8d0bf"],kol:["Kolsvart","#161311"]};
const SEASONS={middag:["Middag",{style:"lyx",guests:6,on:["vatten","vin","bubbel","karaff"]}],julbord:["Julbord",{style:"lyx",guests:12,on:["vatten","vin","bubbel","karaff","avec"]}],nyar:["Nyår",{style:"vintage",guests:8,on:["vatten","bubbel","drink"]}],midsommar:["Midsommar",{style:"fargstark",guests:10,on:["vatten","bubbel","avec"]}],krafta:["Kräftskiva",{style:"naturlig",guests:10,on:["vatten","ol","avec"]}],brollop:["Bröllop",{style:"klassisk",guests:12,on:["vatten","vin","bubbel","karaff","dessert","kaffe"]}]};
const T={season:"middag",style:"lyx",guests:6,on:new Set(SEASONS.middag[1].on),pick:{},view:"side",why:"",table:"stil"};
ROLES.forEach(r=>T.pick[r[0]]=r[2][0]);
$("#tSeason").innerHTML=Object.entries(SEASONS).map(([k,v])=>`<button class="chip" data-tse="${k}">${v[0]}</button>`).join("");
$("#tStyle").innerHTML=Object.entries(STY).map(([k,v])=>`<button class="chip" data-ts="${k}">${v[0]}</button>`).join("");
$("#tTable").innerHTML=Object.entries(TABLES).map(([k,v])=>`<button class="chip" data-tt="${k}">${v[0]}</button>`).join("");
$("#tTable").addEventListener("click",e=>{const b=e.target.closest("[data-tt]");if(b){T.table=b.dataset.tt;renderTable()}});
$("#tRoles").innerHTML=ROLES.map(r=>`<div class="role"><input type="checkbox" data-tr="${r[0]}" id="tr-${r[0]}" aria-label="${r[1]}"><select data-tp="${r[0]}" aria-label="Glas för ${r[1].toLowerCase()}">${r[2].map(id=>`<option value="${id}">${r[1]}: ${esc(byId[id].name)}</option>`).join("")}</select></div>`).join("");
function applySeason(k){const s=SEASONS[k];if(!s)return;T.season=k;T.style=s[1].style;T.guests=s[1].guests;T.table="stil";T.on=new Set(s[1].on);T.why="";renderTable()}
$("#tSeason").addEventListener("click",e=>{const b=e.target.closest("[data-tse]");if(b)applySeason(b.dataset.tse)});
$("#tStyle").addEventListener("click",e=>{const b=e.target.closest("[data-ts]");if(b){T.style=b.dataset.ts;renderTable()}});
$("#tRoles").addEventListener("change",e=>{const c=e.target.closest("[data-tr]");if(c){c.checked?T.on.add(c.dataset.tr):T.on.delete(c.dataset.tr);renderTable()}const s=e.target.closest("[data-tp]");if(s){T.pick[s.dataset.tp]=s.value;T.on.add(s.dataset.tp);renderTable()}});
$("#tView").addEventListener("click",e=>{const b=e.target.closest("[data-tv]");if(b){T.view=b.dataset.tv;renderTable()}});
$("#gMinus").addEventListener("click",()=>{T.guests=Math.max(2,T.guests-1);renderTable()});
$("#gPlus").addEventListener("click",()=>{T.guests=Math.min(12,T.guests+1);renderTable()});
function tableOrder(){return ROLES.filter(r=>T.on.has(r[0])).map(r=>{const p=byId[T.pick[r[0]]];const need=r[0]==="karaff"?Math.ceil(T.guests/6):T.guests;return {role:r,p,packs:Math.ceil(need/p.pack),need}})}
function renderTable(){
  $$("[data-tse]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.tse===T.season)));
  $$("[data-ts]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.ts===T.style)));
  $$("[data-tt]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.tt===T.table)));
  $$("[data-tr]").forEach(c=>c.checked=T.on.has(c.dataset.tr));
  $$("[data-tp]").forEach(s=>s.value=T.pick[s.dataset.tp]);
  $$("[data-tv]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.tv===T.view)));
  $("#gNum").textContent=T.guests;
  const s=[...STY[T.style]];if(TABLES[T.table][1])s[3]=TABLES[T.table][1];const items=tableOrder();
  $("#scene").style.background=`linear-gradient(180deg,${s[1]},${s[2]})`;
  $("#tableSvg").innerHTML=T.view==="side"?sideSvg(s,items):topSvg(s,items);
  $("#tableSvg").setAttribute("viewBox",T.view==="side"?"0 0 1000 420":"0 0 1000 560");
  const total=items.reduce((a,x)=>a+x.packs*x.p.price,0);
  $("#tTotal").textContent=items.length?kr(total):"Välj vad som ska stå på bordet";
  $("#tDetail").textContent=items.map(x=>`${x.packs} × ${x.p.name}`).join(" · ");
  $("#tAdd").disabled=!items.length;
  $("#tWhy").textContent=T.why;
}
function sideSvg(s,items){
  const glasses=items.filter(x=>!["karaff","kaffe","dessert"].includes(x.role[0])), side=items.filter(x=>["karaff","kaffe","dessert"].includes(x.role[0]));
  const plate=`<ellipse cx="0" cy="372" rx="70" ry="12" fill="${s[4]}" opacity=".08"/><ellipse cx="0" cy="368" rx="54" ry="8" fill="none" stroke="${s[4]}" stroke-opacity=".5" stroke-width="1.4"/>`;
  const glassG=(sh,cx,sc,i)=>`<g transform="translate(${cx-100*sc},${362-284*sc}) scale(${sc})"><g style="opacity:0;animation:fadeup .8s ${i*.06}s var(--ease) forwards">${FILL[sh]&&sh!=="tumbler"?`<path d="${FILL[sh][0]}" fill="${FILL[sh][1]}" opacity=".85"/>`:""}${s[5]?`<path d="${SH[sh]}" fill="${s[5]}" stroke="none"/>`:""}<path d="${SH[sh]}" fill="none" stroke="${s[4]}" stroke-width="${2.2/sc}" stroke-linecap="round" stroke-linejoin="round"/></g></g>`;
  let svg=`<style>@keyframes fadeup{from{opacity:0;transform:translateY(10px)}to{opacity:1}}</style><rect x="0" y="360" width="1000" height="60" fill="${s[3]}"/><rect x="0" y="358" width="1000" height="3" fill="${s[4]}" opacity=".12"/>`;
  const show=Math.min(T.guests,3), span=760/show; let i=0;
  const scale=p=>Math.max(.42,Math.min(.82,p.h/23.5*.78));
  for(let g=0;g<show;g++){const cx=120+span*g+span/2;svg+=`<g transform="translate(${cx},0)">${plate}</g>`;
    glasses.forEach((x,j)=>{svg+=glassG(x.p.shape,cx+(j-(glasses.length-1)/2)*Math.min(58,200/glasses.length),scale(x.p),i++)});}
  let r=0;side.forEach(x=>{const k=x.role[0]==="karaff";svg+=glassG(x.p.shape,k?62:940-(r++)*62,k?.95:.45,i++)});
  if(T.guests>3)svg+=`<text x="500" y="404" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="13" letter-spacing="2" fill="${s[4]}" opacity=".7">${T.guests} KUVERT · 3 VISAS FRÅN SIDAN</text>`;
  return svg;
}
function topSvg(s,items){
  const n=T.guests,perSide=Math.ceil(n/2),tx=110,tw=780,ty=150,th=260;
  const LIQ={vin:"#7a1f2b",champagne:"#d9b86a",whisky:"#b0702a",cocktail:"#d8d0b0",vatten:"#9fb7bd",kaffe:"#3a2416",te:"#a8742c",ol:"#c98a2a",dessert:"#e9dcc4"};
  let svg=`<rect x="${tx}" y="${ty}" width="${tw}" height="${th}" rx="26" fill="${s[3]}" stroke="${s[4]}" stroke-opacity=".25"/>`;
  const glasses=items.filter(x=>!["karaff"].includes(x.role[0]));
  for(let i=0;i<n;i++){
    const top=i<perSide,idx=top?i:i-perSide,cnt=top?perSide:n-perSide;
    const cx=tx+tw*(idx+.5)/cnt,cy=top?ty+62:ty+th-62,dir=top?1:-1;
    svg+=`<circle cx="${cx}" cy="${cy}" r="36" fill="${s[4]}" fill-opacity=".06" stroke="${s[4]}" stroke-opacity=".45" stroke-width="1.4"/><circle cx="${cx}" cy="${cy}" r="24" fill="none" stroke="${s[4]}" stroke-opacity=".25"/>`;
    svg+=`<path d="M${cx-48} ${cy-20} v40 M${cx+48} ${cy-20} v40" stroke="${s[4]}" stroke-opacity=".4" stroke-width="2" stroke-linecap="round"/>`;
    glasses.forEach((x,j)=>{const r=Math.max(7,x.p.d*1.3),gx=cx+30+j*22-(glasses.length>3?20:0),gy=cy-dir*(46+(j%2)*14);
      svg+=`<circle cx="${gx}" cy="${gy}" r="${r}" fill="${LIQ[x.p.drinks[0]]||"#9fb7bd"}" fill-opacity=".55" stroke="${s[4]}" stroke-opacity=".7" stroke-width="1.2"/>`});
  }
  items.filter(x=>x.role[0]==="karaff").forEach(x=>{for(let k=0;k<x.need;k++){const cx=tx+tw*(k+.5)/x.need;svg+=`<circle cx="${cx}" cy="${ty+th/2}" r="22" fill="#7a1f2b" fill-opacity=".5" stroke="${s[4]}" stroke-opacity=".8"/>`}});
  svg+=`<text x="500" y="${ty+th+70}" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="13" letter-spacing="2" fill="${s[4]}" opacity=".7">${n} KUVERT OVANIFRÅN</text>`;
  return svg;
}
$("#tAdd").addEventListener("click",()=>{track("tool_add_all",{tool:"dukning",guests:T.guests});tableOrder().forEach(x=>addCart(x.p.id,x.packs,true));toast("Hela dukningen ligger i varukorgen")});
$("#tSave").addEventListener("click",()=>{S.saved.unshift({type:"dukning",title:`${SEASONS[T.season][0]} för ${T.guests}, ${STY[T.style][0].toLowerCase()}`,data:{season:T.season,style:T.style,guests:T.guests,on:[...T.on],pick:{...T.pick}},ts:Date.now()});save();toast("Dukningen är sparad i Mitt glasskåp")});
$("#tCopy").addEventListener("click",()=>{const it=tableOrder();if(!it.length)return;const txt=`Dukning från SKÅL & CO: ${SEASONS[T.season][0]} för ${T.guests}\n`+it.map(x=>`${x.packs} × ${x.p.name} (${packTxt(x.p)}) ${kr(x.packs*x.p.price)}`).join("\n")+`\nTotalt ${kr(it.reduce((a,x)=>a+x.packs*x.p.price,0))}`;
  if(!S.pointsLog.some(l=>l.why==="Delad dukning"&&Date.now()-l.ts<864e5)){addPoints(25,"Delad dukning");save(true)}
  copy(txt,"Inköpslistan är kopierad. 25 skålpoäng för att du delar.")});
function loadDukning(d){T.season=d.season;T.style=d.style;T.guests=d.guests;T.on=new Set(d.on);Object.assign(T.pick,d.pick);T.why="";renderTable()}
$("#menuGo").addEventListener("click",async()=>{
  const q=$("#menuIn").value.trim();if(q.length<6){toast("Beskriv middagen med några ord");return}
  const note=$("#menuNote"),btn=$("#menuGo");btn.disabled=true;note.innerHTML='<i class="spin"></i>Tänker';
  let plan=null;
  const sample=await getSample();
  if(sample){try{
    const out=await sample.json(`Du hjälper en kund att duka i en svensk glasbutik. Kundens beskrivning: """${q.slice(0,500)}""". Välj roller bland ${JSON.stringify(ROLES.map(r=>r[0]))} (vatten=vattenglas, vin=vinglas, bubbel=champagne, drink=cocktail, ol=öl, avec=whisky eller avec, dessert=dessertskål, karaff=karaff, kaffe=kaffe efter maten). Välj stil bland ${JSON.stringify(Object.keys(STY))}. Svara bara med JSON: {"guests":heltal 2 till 12,"roles":[...],"style":"...","why":"en kort mening på svenska utan tankstreck"}.`,{modelTier:"quick"});
    if(out&&Array.isArray(out.roles))plan={guests:Math.min(12,Math.max(2,parseInt(out.guests)||6)),roles:out.roles.filter(r=>ROLES.some(x=>x[0]===r)),style:STY[out.style]?out.style:T.style,why:String(out.why||"").slice(0,200),ai:true};
  }catch(e){if(e&&e.code==="not_granted")aiOff=true}}
  if(!plan)plan=menuRules(q);track("tool_use",{tool:"beskriv-middagen",ai:!!plan.ai});
  T.guests=plan.guests;T.on=new Set(plan.roles.length?plan.roles:["vatten"]);T.style=plan.style;T.why=plan.why;
  renderTable();btn.disabled=false;note.textContent=plan.ai?"Förslag från Claude. Ändra det du vill.":"Förslag utifrån dina ord. Ändra det du vill.";
});
function menuRules(q){
  const t=q.toLowerCase(),NUMW={två:2,tre:3,fyra:4,fem:5,sex:6,sju:7,åtta:8,nio:9,tio:10,elva:11,tolv:12};
  let g=(t.match(/(\d+)\s*(pers|gäst|st|vuxna)/)||[])[1];if(!g)for(const [w,v] of Object.entries(NUMW))if(hasWord(t,w))g=v;
  const roles=["vatten"];const why=[];
  if(/vin|lamm|kött|oxfilé|vilt|ost|pasta|fisk|skaldjur/.test(t)){roles.push("vin");why.push("vinglas till maten")}
  if(/bubbel|champagne|cava|prosecco|skål|nyår|fördrink/.test(t)){roles.push("bubbel");why.push("bubbel till skålen")}
  if(/drink|cocktail|martini|gin/.test(t))roles.push("drink");
  if(/whisky|avec|cognac|snaps|kräft/.test(t)){roles.push("avec");why.push("avecglas")}
  if(/kaffe|espresso/.test(t)){roles.push("kaffe");why.push("kaffe efter maten")}
  if(/efterrätt|dessert|panna cotta|glass/.test(t)){roles.push("dessert");why.push("dessertskålar")}
  if(/(^|[^a-zåäö])öl|ipa|kräft|pilsner/.test(t)){roles.push("ol");why.push("ölglas")}
  if(roles.includes("vin")&&(+g||6)>=4)roles.push("karaff");
  const style=/jul|elegant|fin|lyx/.test(t)?"lyx":/sommar|midsommar|färg/.test(t)?"fargstark":/vintage|20-tal/.test(t)?"vintage":/enkel|vardag/.test(t)?"skandinavisk":T.style;
  return {guests:Math.min(12,Math.max(2,+g||6)),roles,style,why:why.length?"Vi lade till "+why.join(", ")+".":""};
}

/* ---------- Barstudion ---------- */
const KITS={whisky:["Whiskyentusiasten",[["whisky",2],["karaff",1]]],cocktail:["Cocktailälskaren",[["nora",2],["coupe",1],["bolja",1]]],bubbel:["Champagne och bubbel",[["coupe",3]]],klassisk:["Klassisk hemmabar",[["whisky",1],["bolja",1],["coupe",1],["karaff",1]]],ol:["Ölprovning",[["humle",2]]],gt:["Gin & tonic",[["boljahigh",1],["bourgogne",1]]],allt:["Kompletta hemmabaren",[["whisky",2],["nora",2],["coupe",2],["bolja",1],["karaff",1]]]};
let kit="whisky";
$("#barChips").innerHTML=Object.entries(KITS).map(([k,v])=>`<button class="chip" data-kit="${k}">${v[0]}</button>`).join("");
$("#barChips").addEventListener("click",e=>{const b=e.target.closest("[data-kit]");if(b){kit=b.dataset.kit;renderKit()}});
function renderKit(){$$("[data-kit]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.kit===kit)));
  const L=KITS[kit][1];const t=L.reduce((a,[id,q])=>a+q*byId[id].price,0);
  $("#kit").innerHTML=L.map(([id,q])=>{const p=byId[id];return `<div><span><b style="color:#eee5d6;font-weight:500">${esc(p.name)}</b> · ${q} × ${packTxt(p)}</span><span>${kr(q*p.price)}</span></div>`}).join("")+`<div><b style="color:#eee5d6">Totalt</b><b style="color:#eee5d6">${kr(t)}</b></div>`}
$("#kitAdd").addEventListener("click",()=>{track("tool_add_all",{tool:"barstudion",kit});KITS[kit][1].forEach(([id,q])=>addCart(id,q,true));toast(KITS[kit][0]+" ligger i varukorgen")});
$("#kitSave").addEventListener("click",()=>{S.saved.unshift({type:"kit",title:"Barstudion: "+KITS[kit][0],data:{kit},ts:Date.now()});save();toast("Kitet är sparat i Mitt glasskåp")});

/* ---------- Provlådan ---------- */
const trialSel=new Set();
function trialAdd(id){if(trialSel.has(id)){toast("Glaset ligger redan i provlådan");return}if(trialSel.size>=3){toast("Provlådan rymmer tre glas. Ta bort ett på sidan Provlådan.");return}trialSel.add(id);renderTrial();toast(`${byId[id].name} i provlådan, ${trialSel.size} av 3`)}
function renderTrial(){
  $("#trial").innerHTML=P.filter(p=>p.cat!=="karaff").map(p=>`<label><input type="checkbox" data-trial="${p.id}" ${trialSel.has(p.id)?"checked":""}><img src="${img(p,true)}" data-pimg="${p.id}" alt=""><span><b style="display:block;font-weight:500">${esc(p.name)}</b><small style="color:var(--muted)">${esc(p.mat)} · ${p.vol} cl</small></span></label>`).join("");
  $("#trialSum").textContent=trialSel.size===3?"Tre glas valda: "+[...trialSel].map(i=>byId[i].name).join(", "):`Välj ${3-trialSel.size} glas till`;
  $("#trialAdd").disabled=trialSel.size!==3;
}
$("#trial").addEventListener("change",e=>{const c=e.target.closest("[data-trial]");if(!c)return;if(c.checked){if(trialSel.size>=3){c.checked=false;toast("Provlådan rymmer tre glas");return}trialSel.add(c.dataset.trial)}else trialSel.delete(c.dataset.trial);renderTrial()});
$("#trialAdd").addEventListener("click",()=>{addCart("provlada",1,false,{items:[...trialSel]});trialSel.clear();renderTrial()});

/* ---------- Presentguiden ---------- */
function renderGift(){
  const who=$("#gWho").value, occ=$("#gOcc").value, bud=+$("#gBud").value;
  const pref={par:["bourgogne","perla","karaff"],vinalskare:["bourgogne","karaff","coupe"],whisky:["whisky","nora","karaff"],kaffe:["svavar","kaffe","bolja"],vardag:["bolja","anga","boljahigh"]}[who];
  let L=pref.map(id=>byId[id]).filter(p=>bud>=2000?p.price>400:p.price<=bud);
  if(occ==="brollop"&&!L.includes(byId.karaff)&&bud>=2000)L.unshift(byId.karaff);
  if(L.length<3)L=[...L,...P.filter(p=>!L.includes(p)&&(bud>=2000?p.price>400:p.price<=bud))].slice(0,3);
  $("#gRes").innerHTML=L.slice(0,3).map(p=>`<div class="g" data-open="${p.id}"><img src="${img(p,true)}" data-pimg="${p.id}" alt=""><div><b>${esc(p.name)}</b>${kr(p.price)}${p.props.includes("kristall")?'<small style="display:block;color:var(--muted)">Kan graveras</small>':""}</div></div>`).join("")||'<p class="lead">Höj budgeten lite, så hittar vi något.</p>';
}
["gWho","gOcc","gBud"].forEach(id=>$("#"+id).addEventListener("change",renderGift));
$("#dateForm").addEventListener("submit",e=>e.preventDefault());
$("#dateForm button").addEventListener("click",e=>{e.preventDefault();const n=$("#dName").value.trim(),d=$("#dDate").value;if(!n||!d){toast("Fyll i namn och datum");return}
  S.dates.push({name:n.slice(0,40),date:d,budget:+$("#gBud").value,who:$("#gWho").value});save();$("#dName").value="";$("#dDate").value="";toast("Datumet är sparat i Mitt glasskåp")});

/* ---------- Glasjournalen ---------- */
const ART=[
 ["vin","4 min","Vilka vinglas passar till vilka viner?","Två eller tre former räcker långt. Så väljer du dem.",["Börja med en bred kupa för röda viner med mycket doft, som Pinot Noir. Ytan låter vinet andas och den smalare kanten samlar doften.","Ett mindre tulpanglas fungerar för vitt, rosé och lättare röda. Det håller temperaturen bättre.","Har du bara plats för ett glas: välj ett universalglas runt 50 cl. Det klarar det mesta bra."]],
 ["kristall","3 min","Kristall eller vanligt glas?","Vad du märker i handen och i munnen, och när det är värt pengarna.",["Kristall går att blåsa tunnare, så kanten blir finare mot läppen. Det märks mest i vin och bubbel.","Vanligt glas är tåligare och billigare. Till vardag och vatten räcker det långt.","Fråga alltid om glaset tål diskmaskin. Det står på varje produkt hos oss, enligt tillverkaren."]],
 ["middag","5 min","Så dukar du ett elegant middagsbord","Ordningen på glasen, avstånden och vad som faktiskt behövs.",["Glasen står till höger om tallriken, i den ordning de används. Vattenglaset närmast.","Ett vinglas, ett vattenglas och ett bubbelglas räcker för de flesta middagar.","Prova Dukningsstudion, så räknar vi ut hur många förpackningar du behöver."]],
 ["whisky","4 min","Whiskyglas du bör ha hemma","Provglas, tumbler eller båda? Det beror på hur du dricker.",["Ett tulpanformat provglas samlar doften och passar när du vill smaka.","En tumbler passar is, drinkar och avslappnade kvällar.","En droppe vatten öppnar många whiskyer. Häll i provglaset och vänta en minut."]],
 ["skotsel","3 min","Så tar du hand om dina glas","Diskmaskin, handdisk och torkning som får glasen att hålla.",["Följ alltid tillverkarens råd. Munblåst glas diskas oftast för hand.","Torka med en luddfri linneduk direkt, så slipper du fläckar.","Håll i foten, inte kupan, när du torkar stjälkglas."]],
 ["champagne","4 min","Glas mot glas: flöjt eller coupe?","Två klassiker, olika styrkor. Så väljer du till din fest.",["Flöjten håller bubblorna längst eftersom ytan mot luften är liten. Den passar när du vill att bubblet ska hålla hela talet.","Coupen är festligast och fungerar till cocktails, men bubblorna försvinner fortare.","Vill du känna mest doft, prova ett vitvinsglas. Många sommelierer väljer det till fin champagne."]],
 ["servis","5 min","Fem glas varje hem bör ha","En grund som klarar nästan allt, från vardag till middag.",["Ett vattenglas som tål diskmaskin. Det används mest av allt.","Ett universalt vinglas runt 45 till 60 cl.","Ett bubbelglas, ett tumblerglas och ett par kaffeglas. Resten lägger du till när du bjuder oftare."]],
 ["vin","3 min","Den perfekta hällningen","Hur mycket ska det vara i glaset? Mindre än du tror.",["Rött vin: ungefär en tredjedel av kupan, ofta 12 till 15 cl. Då finns plats för doften.","Vitt vin och bubbel: lite mer, men aldrig ända upp. Bubbel hälls i två omgångar.","Whisky: 2 till 4 cl i ett provglas räcker. Prova fliken Form och storlek på produktsidan för att se hur det ser ut."]],
 ["servis","6 min","Bygg en komplett glasservis","Från fyra glas till en hel servis, steg för steg.",["Börja med det du använder mest: vattenglas och ett vinglas.","Lägg till bubbel och ett avecglas när du bjuder oftare.","Spara dina glas i Mitt glasskåp, så ser du vad som saknas i serien."]]
];
function artCard(a,i){return `<button class="art" data-art="${i}" style="text-align:left"><span class="mono">${a[1]}${S.read.includes(i)?" · läst":""}</span><h3>${a[2]}</h3><p>${a[3]}</p><span class="more">Läs guiden →</span></button>`}
function renderJournal(){$("#journalGrid").innerHTML=ART.map(artCard).join("");$("#journalHome").innerHTML=ART.slice(0,3).map(artCard).join("")}
document.addEventListener("click",e=>{const a=e.target.closest("[data-art]");if(!a)return;const i=+a.dataset.art,x=ART[i];
  if(!S.read.includes(i)){S.read.push(i);save(true)}
  const rel=P.filter(p=>p.cat===x[0]||p.drinks.includes(x[0])||(x[0]==="kristall"&&p.props.includes("kristall"))||(x[0]==="middag"&&p.occ.includes("middag"))).slice(0,3);
  openModal(`<article class="article"><span class="mono">Glasjournalen · ${x[1]}</span><h2>${x[2]}</h2>${x[4].map(t=>`<p>${t}</p>`).join("")}${rel.length?`<div class="story"><h3>Glas som passar</h3><div class="complete">${rel.map(p=>`<button data-open="${p.id}"><img src="${img(p,true)}" alt=""><b style="display:block;font-weight:500">${esc(p.name)}</b><span style="color:var(--muted)">${kr(p.price)}</span></button>`).join("")}</div></div>`:""}</article>`,x[2],"art");
});
$("#ugc").innerHTML=["l-middag","p-gron","l-kaffe","p-coupe","l-bar","s-tre-glas"].map(f=>`<img src="assets/${f}.webp" alt="" loading="lazy">`).join("");
const FAQ=[["Vad händer om ett glas kommer trasigt?","Ta en bild och skicka den till oss. Vi skickar ett nytt glas inom ett dygn. Har du glaset i Mitt glasskåp går det på två klick."],["Behöver jag ett konto?","Nej. Du kan handla som gäst. Mitt glasskåp sparar dina val i webbläsaren, och om du är inloggad via Claude följer det med mellan enheter."],["Varför kan min order komma i flera paket?","Många glas skickas direkt från glasbruket eller deras lager i Europa. Det går snabbare och glasen hanteras färre gånger. Du ser antal paket i varukorgen och får spårning för varje."],["Tål glasen diskmaskin?","Det står på varje glas, enligt tillverkarens egen information. Finns uppgiften inte skriver vi det, vi gissar aldrig."],["Kan jag köpa ett enstaka glas?","Ja, i de flesta serier. Bra när ett glas i setet har gått sönder."],["Hur fungerar Provlådan?","Du väljer tre glas och provar dem hemma i 14 dagar. Returen är förbetald och lådans pris dras av när du köper ett set."],["Vad är skålpoäng?","Du får poäng när du handlar, skriver recensioner och delar dukningar. Poängen kan bli gravyr eller presentinslagning. Värdet är ett exempel i visningsversionen."],["Vem ansvarar om något är fel?","Vi. Det är SKÅL & CO du handlar av, och det är oss du vänder dig till vid ånger, retur eller reklamation."],["Hur kan jag betala?","Klarna, Swish, kort, Apple Pay och Google Pay."]];
const faqHtml=L=>L.map(f=>`<details><summary>${f[0]}<i></i></summary><div class="a">${f[1]}</div></details>`).join("");
$("#faqHome").innerHTML=faqHtml(FAQ.slice(0,4));$("#faqAll").innerHTML=faqHtml(FAQ);
