/* SKÅL & CO · visningsversion 3 */
(()=>{
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const kr=n=>Math.round(n).toLocaleString("sv-SE")+" kr";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cm=n=>String(n).replace(".",",")+" cm";
const root=document.documentElement;
const hasWord=(t,w)=>new RegExp("(^|[^a-zåäöé0-9])"+w+"($|[^a-zåäöé0-9])").test(t);

/* ---------- Glasformer, handritade (200 x 300) ---------- */
const SH={
  rott:"M62 282 Q100 272 138 282 M100 276 L100 184 M100 184 C60 184 42 150 44 115 C46 80 60 52 64 38 M100 184 C140 184 158 150 156 115 C154 80 140 52 136 38 M64 38 L136 38",
  vitt:"M66 282 Q100 273 134 282 M100 276 L100 192 M100 192 C72 192 60 165 61 135 C62 100 70 65 74 45 M100 192 C128 192 140 165 139 135 C138 100 130 65 126 45 M74 45 L126 45",
  flojt:"M72 282 Q100 274 128 282 M100 276 L100 182 M100 182 C84 182 79 150 80 110 C81 70 84 40 85 25 M100 182 C116 182 121 150 120 110 C119 70 116 40 115 25 M85 25 L115 25",
  coupe:"M68 282 Q100 274 132 282 M100 276 L100 150 M100 150 C70 148 48 132 44 110 L156 110 C152 132 130 148 100 150",
  whisky:"M70 282 L130 282 L126 252 L74 252 Z M80 252 C58 236 54 205 62 180 C70 156 84 140 86 122 M120 252 C142 236 146 205 138 180 C130 156 116 140 114 122 M86 122 L114 122",
  cocktail:"M70 282 Q100 274 130 282 M100 276 L100 168 M100 168 C78 166 56 150 52 118 L148 118 C144 150 122 166 100 168",
  tumbler:"M66 160 L72 270 Q100 278 128 270 L134 160 M66 160 L134 160 M80 175 L82 262 M93 175 L94 266 M107 175 L106 266 M120 175 L118 262",
  ol:"M68 282 Q100 274 132 282 M100 276 L100 216 M100 216 C66 214 56 185 58 150 C60 120 72 105 70 85 C68 65 66 50 66 40 M100 216 C134 214 144 185 142 150 C140 120 128 105 130 85 C132 65 134 50 134 40 M66 40 L134 40",
  kaffe:"M40 272 Q100 288 160 272 M58 170 L64 240 C66 258 80 266 100 266 C120 266 134 258 136 240 L142 170 M58 170 L142 170 M140 190 C172 186 174 232 134 238",
  dubbel:"M64 170 L68 262 Q100 274 132 262 L136 170 M64 170 L136 170 M76 186 C78 238 88 250 100 250 C112 250 122 238 124 186",
  te:"M62 150 L70 250 C72 266 84 272 100 272 C116 272 128 266 130 250 L138 150 M62 150 L138 150",
  karaff:"M90 30 L110 30 M93 30 L93 112 C44 150 30 232 60 264 Q100 284 140 264 C170 232 156 150 107 112 L107 30",
  dessert:"M70 282 Q100 274 130 282 M100 276 L100 200 M100 200 C70 198 54 170 56 130 L144 130 C146 170 130 198 100 200",
  highball:"M70 40 L75 270 Q100 278 125 270 L130 40 M70 40 L130 40 M84 60 L86 262 M100 60 L100 266 M116 60 L114 262"
};
const FILL={rott:["M46 132 C48 162 68 182 100 182 C132 182 152 162 154 132 Z","#9a2a3a"],vitt:["M62 150 C64 175 78 190 100 190 C122 190 136 175 138 150 Z","#c9a55a"],flojt:["M81 95 C80 140 84 180 100 180 C116 180 120 140 119 95 Z","#d9b86a"],coupe:["M50 118 L150 118 C145 136 128 147 100 148 C72 147 55 136 50 118 Z","#d9b86a"],whisky:["M60 205 C62 236 78 250 100 250 C122 250 138 236 140 205 Z","#b0702a"],cocktail:["M55 124 L145 124 C140 150 120 164 100 165 C80 164 60 150 55 124 Z","#d8d0b0"],tumbler:["M70 200 L73 268 Q100 275 127 268 L130 200 Z","#7da37a"],ol:["M58 150 C60 190 72 214 100 214 C128 214 140 190 142 150 C140 125 132 112 130 100 L70 100 C68 112 60 125 58 150 Z","#c98a2a"],kaffe:["M60 185 L64 238 C66 256 80 264 100 264 C120 264 134 256 136 238 L140 185 Z","#3a2416"],dubbel:["M78 200 C80 238 88 248 100 248 C112 248 120 238 122 200 Z","#4a2a14"],te:["M65 180 L70 250 C72 264 84 270 100 270 C116 270 128 264 130 250 L135 180 Z","#a8742c"],karaff:["M50 220 C52 250 70 270 100 272 C130 270 148 250 150 220 Z","#7a1f2b"],dessert:["M58 150 C62 178 78 196 100 197 C122 196 138 178 142 150 Z","#c9a56a"],highball:["M72 110 L76 268 Q100 275 124 268 L128 110 Z","#cfe0c0"]};
const SHNAME={rott:"Rödvinsglas",vitt:"Vitvinsglas",flojt:"Flöjt",coupe:"Champagneskål",whisky:"Whiskyglas",cocktail:"Cocktailglas",tumbler:"Tumbler",ol:"Ölglas",kaffe:"Kaffekopp",dubbel:"Dubbelväggat glas",te:"Teglas",karaff:"Karaff",dessert:"Dessertglas",highball:"Highball"};
const BOX={};for(const k in SH){const n=SH[k].match(/-?\d+(\.\d+)?/g).map(Number);let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(let i=0;i+1<n.length;i+=2){x0=Math.min(x0,n[i]);x1=Math.max(x1,n[i]);y0=Math.min(y0,n[i+1]);y1=Math.max(y1,n[i+1])}BOX[k]={x:x0,y:y0,w:x1-x0,h:y1-y0}}
const placeSil=(sh,cx,base,w,h)=>{const b=BOX[sh],sx=w/b.w,sy=h/b.h;return `translate(${cx-(b.x+b.w/2)*sx},${base-(b.y+b.h)*sy}) scale(${sx},${sy})`};
const sil=(sh,stroke="currentColor",w=5)=>`<svg viewBox="0 0 200 300" aria-hidden="true"><path d="${SH[sh]||SH.tumbler}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* ---------- Exempelsortiment ---------- */
const P=[
 {id:"bourgogne",name:"Kupa Bourgogne",mat:"Munblåst kristall",series:"Kupa",cat:"vin",shape:"rott",drinks:["vin","rott"],occ:["middag","fest","present"],style:["klassisk","skandinavisk","lyx"],props:["munblast","kristall","diskmaskin"],vol:62,h:23.5,d:11,pack:2,price:699,img:"bourgogne",tag:"Bästsäljare",rating:"4,9",reviews:212,isNew:false,pop:10,sup:"A",why:"En bred kupa ger vinet luft, och den smalare kanten samlar doften mot näsan.",story:"Varje glas blåses för hand och väger strax under 120 gram. Tunn kant, lång stjälk och en kupa som klarar både Pinot Noir och Nebbiolo."},
 {id:"coupe",name:"Sval Coupe",mat:"Kristall",series:"Sval",cat:"champagne",shape:"coupe",drinks:["champagne","cocktail"],occ:["fest","present","middag"],style:["klassisk","lyx","vintage"],props:["kristall","diskmaskin"],vol:23,h:16,d:11.5,pack:2,price:549,img:"coupe",tag:"Nyhet",rating:"4,8",reviews:87,isNew:true,pop:8,sup:"A",why:"Den breda skålen gör bubbel festligt och fungerar lika bra till cocktails.",story:"En nytolkning av 1920-talets champagneskål. Tunn kristall och en stjälk som är lätt att hålla."},
 {id:"whisky",name:"Näsa Provglas",mat:"Kristall",series:"Näsa",cat:"whisky",shape:"whisky",drinks:["whisky"],occ:["hemmabar","present"],style:["klassisk","modern"],props:["kristall","diskmaskin"],vol:19,h:11.5,d:6.5,pack:2,price:399,img:"whisky",tag:"Present",rating:"4,9",reviews:154,isNew:false,pop:9,sup:"B",why:"Tulpanformen samlar doften men tar udden av spriten.",story:"Byggd för att lukta och smaka, inte för att imponera. Den solida foten gör glaset stabilt och skönt i handen."},
 {id:"kaffe",name:"Glöd Kaffekopp",mat:"Stengods",series:"Glöd",cat:"kaffe",shape:"kaffe",drinks:["kaffe","te"],occ:["vardag","frukost","present"],style:["rustik","skandinavisk"],props:["diskmaskin"],vol:25,h:7.5,d:9,pack:2,price:449,img:"kaffe",tag:"Vardag",rating:"4,7",reviews:96,isNew:false,pop:7,sup:"C",why:"Tjock vägg håller värmen, och den rundade botten bevarar cremán.",story:"Handglaserat stengods i djup kol med varm kant. Varje kopp blir lite olika."},
 {id:"nora",name:"Nora Cocktailglas",mat:"Kristall",series:"Nora",cat:"cocktail",shape:"cocktail",drinks:["cocktail"],occ:["fest","hemmabar"],style:["lyx","vintage","klassisk"],props:["kristall"],vol:15,h:17,d:8.5,pack:2,price:459,img:"nicknora",tag:"Nyhet",rating:"4,8",reviews:41,isNew:true,pop:6,sup:"A",why:"Liten skål och lång stjälk. Drinken håller sig kall och spills inte.",story:"Klassisk Nick & Nora-form för martini och sours. Handdisk rekommenderas av tillverkaren."},
 {id:"bolja",name:"Bölja Tumbler",mat:"Färgat glas",series:"Bölja",cat:"vatten",shape:"tumbler",drinks:["vatten","cocktail"],occ:["vardag","frukost","middag"],style:["fargstark","skandinavisk","modern"],props:["diskmaskin","stapelbart","fargat"],vol:30,h:9,d:8,pack:4,price:379,img:"gron",tag:"Färg",rating:"4,8",reviews:133,isNew:false,pop:8,sup:"C",colors:["#6f8f5c","#b9853a","#6b6560"],why:"Räfflat glas i färg ger greppet och gör vardagsbordet roligare.",story:"Stapelbara och tåliga. Finns i grön, bärnsten och rök."},
 {id:"svavar",name:"Svävar Espressoglas",mat:"Borosilikat, dubbelväggat",series:"Svävar",cat:"kaffe",shape:"dubbel",drinks:["kaffe","te"],occ:["vardag","frukost"],style:["modern","skandinavisk"],props:["dubbelvaggat","diskmaskin"],vol:8,h:7,d:7,pack:2,price:299,was:349,img:"dubbel",tag:"Bästsäljare",rating:"4,6",reviews:208,isNew:false,pop:9,sup:"B",why:"Dubbla väggar håller kaffet varmt och fingrarna svala.",story:"Kaffet ser ut att sväva i glaset. Värmetåligt borosilikat."},
 {id:"vitvin",name:"Kupa Vitvin",mat:"Munblåst kristall",series:"Kupa",cat:"vin",shape:"vitt",drinks:["vin","vitt","champagne"],occ:["middag","fest","present"],style:["klassisk","skandinavisk","lyx"],props:["munblast","kristall","diskmaskin"],vol:42,h:22,d:8.5,pack:2,price:649,img:"vitvin",tag:"Nyhet",rating:"4,8",reviews:39,isNew:true,pop:7,sup:"A",why:"Den smalare tulpanen håller vitt vin svalt och samlar de lätta aromerna. Fungerar fint till bubbel också.",story:"Syskon till Kupa Bourgogne, blåst i samma glasbruk. Lika tunn kant, något mindre kupa."},
 {id:"perla",name:"Pärla Champagneflöjt",mat:"Kristall",series:"Pärla",cat:"champagne",shape:"flojt",drinks:["champagne"],occ:["fest","present","middag"],style:["klassisk","modern","lyx"],props:["kristall","diskmaskin"],vol:21,h:24,d:7,pack:2,price:499,img:"flojt",tag:"Fest",rating:"4,8",reviews:64,isNew:true,pop:8,sup:"A",why:"Den smala formen håller bubblorna längre och leder dem rakt upp mot näsan.",story:"En klassisk flöjt med lång stjälk och ett litet slipat märke i botten som får bubblorna att stiga i en jämn pärlrad."},
 {id:"svala",name:"Svala Dessertskål",mat:"Glas",series:"Svala",cat:"dessert",shape:"dessert",drinks:["dessert"],occ:["middag","fest","vardag"],style:["klassisk","vintage","skandinavisk"],props:["diskmaskin"],vol:25,h:12,d:10,pack:4,price:399,img:"dessert",tag:"Dessert",rating:"4,7",reviews:52,isNew:true,pop:6,sup:"C",why:"Låg fot och bred skål. Desserten syns och skeden når ända ner.",story:"Lika fin till panna cotta som till glass och räkcocktail. Tål diskmaskin enligt tillverkaren."},
 {id:"humle",name:"Humle Ölglas",mat:"Glas",series:"Humle",cat:"ol",shape:"ol",drinks:["ol"],occ:["hemmabar","fest","vardag"],style:["modern","skandinavisk"],props:["diskmaskin"],vol:40,h:18,d:8.5,pack:4,price:349,img:"ol",tag:"Öl",rating:"4,7",reviews:71,isNew:true,pop:6,sup:"B",why:"Tulpanformen håller skummet och samlar humlens doft. Bra till IPA och belgiska öl.",story:"Ett provglas för öl med kort fot. Rymmer en hel flaska med plats för skum."},
 {id:"anga",name:"Ånga Teglas",mat:"Borosilikat",series:"Ånga",cat:"te",shape:"te",drinks:["te","kaffe"],occ:["vardag","frukost","present"],style:["skandinavisk","modern"],props:["diskmaskin"],vol:25,h:8,d:9,pack:2,price:329,img:"te",tag:"Te",rating:"4,6",reviews:44,isNew:true,pop:6,sup:"B",why:"Klart värmetåligt glas visar teets färg, och fatet tar droppar och tepåse.",story:"Kopp och fat i borosilikatglas. Lätt, värmetåligt och fint till både te och latte."},
 {id:"boljahigh",name:"Bölja Highball",mat:"Färgat glas",series:"Bölja",cat:"cocktail",shape:"highball",drinks:["cocktail","vatten"],occ:["hemmabar","fest","vardag"],style:["fargstark","skandinavisk","modern"],props:["diskmaskin","stapelbart","fargat"],vol:40,h:15,d:7,pack:4,price:449,img:"high",tag:"Färg",rating:"4,8",reviews:58,isNew:true,pop:7,sup:"C",colors:["#6f8f5c","#b9853a"],why:"Högt och smalt håller kolsyran kvar. Räfflorna ger greppet när glaset är kallt.",story:"Samma räfflade glas som Bölja Tumbler, i högre form för gin och tonic, long drinks och vatten med is."},
 {id:"karaff",name:"Kupa Karaff",mat:"Munblåst kristall",series:"Kupa",cat:"karaff",shape:"karaff",drinks:["vin","vatten"],occ:["middag","fest","present"],style:["klassisk","lyx","skandinavisk"],props:["munblast","kristall"],vol:150,h:30,d:22,pack:1,price:899,img:"karaff",tag:"Kristall",rating:"4,9",reviews:58,isNew:true,pop:7,sup:"A",why:"Bred botten ger vinet stor yta mot luften, den smala halsen gör det lätt att hälla.",story:"Samma glasbruk och formspråk som Kupa Bourgogne. Diskas för hand."}
];
const byId=Object.fromEntries(P.map(p=>[p.id,p]));
const per=p=>p.price/p.pack;
const PROPS={munblast:"Munblåst",kristall:"Kristall",diskmaskin:"Tål diskmaskin",stapelbart:"Stapelbart",fargat:"Färgat",dubbelvaggat:"Dubbelväggat"};
const STYLEN={skandinavisk:"Skandinavisk",klassisk:"Klassisk kristall",modern:"Modern",fargstark:"Färgstarkt",vintage:"Vintage",lyx:"Lyx",rustik:"Rustikt"};
const DRINKN={vin:"Vin",champagne:"Champagne",whisky:"Whisky",cocktail:"Cocktail",vatten:"Vatten",kaffe:"Kaffe",te:"Te",ol:"Öl",dessert:"Dessert",karaff:"Karaffer"};
const light=()=>root.dataset.skin==="light";
const img=(p,small)=>`assets/${light()?"d-":"p-"}${p.img}${small?"-480":""}.webp`;
const altImg=p=>`assets/${light()?"p-":"d-"}${p.img}-480.webp`;
const scene=p=>p.cat==="kaffe"?"assets/l-kaffe.webp":(p.cat==="whisky"||p.cat==="cocktail")?"assets/l-bar.webp":"assets/l-middag.webp";
const SUP={A:[2,4],B:[3,5],C:[4,7]};
const STOCK={nora:"Få kvar",svala:"Få kvar"};
const stockTxt=p=>STOCK[p.id]||"I lager hos glasbruket";
const TIERN={low:"Vardag",mid:"Design",high:"Premium"};
const care=p=>[p.props.includes("diskmaskin")?"Tål diskmaskin enligt tillverkaren. Ställ glasen så att de inte slår i varandra.":"Diska för hand i ljummet vatten med lite diskmedel.","Torka direkt med en luddfri linneduk, så blir glaset blankt.",p.shape==="rott"||p.shape==="vitt"||p.shape==="flojt"||p.shape==="coupe"||p.shape==="cocktail"?"Håll i foten, inte kupan, när du torkar.":"Undvik snabba temperaturskiften."];
const packTxt=p=>p.pack===1?"1 st":p.pack+"-pack";

/* ---------- Lagring: webbläsaren först, sedan Claude-konto ---------- */
const KEY="skal-glasskap-v1";
const DEF=()=>({ts:0,favs:[],lists:[{id:"onske",name:"Önskelista",type:"onske",items:[]}],owned:[],saved:[],watches:[],dates:[],reviews:[],orders:[],points:0,pointsLog:[],profile:null,recent:[],finder:null,read:[],rooms:[]});
let S=DEF();
try{const raw=localStorage.getItem(KEY);if(raw)S=Object.assign(DEF(),JSON.parse(raw))}catch(e){}
const cloud={on:false,doc:null,name:"",writing:false,dirty:false,t:0};
const listeners=new Set();
function onState(fn){listeners.add(fn)}
function save(quiet){
  S.ts=Date.now();
  try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
  if(!quiet)listeners.forEach(fn=>{try{fn()}catch(e){console.error(e)}});
  if(cloud.on){cloud.dirty=true;clearTimeout(cloud.t);cloud.t=setTimeout(flush,900)}
}
async function flush(){
  if(cloud.writing||!cloud.dirty||!cloud.doc)return;
  cloud.writing=true;cloud.dirty=false;
  try{await cloud.doc.set(JSON.parse(JSON.stringify(S)))}catch(e){console.warn("Kunde inte spara till kontot",e)}
  cloud.writing=false;
  if(cloud.dirty)flush();
}
function mergeState(a,b){/* b = moln */
  const out=Object.assign(DEF(),(b.ts||0)>(a.ts||0)?b:a);
  out.favs=[...new Set([...(a.favs||[]),...(b.favs||[])])];
  out.recent=[...new Set([...(a.recent||[]),...(b.recent||[])])].slice(0,12);
  return out;
}
async function connectCloud(){
  if(!window.claude||typeof window.claude.use!=="function")return;
  try{
    const [db,user]=await Promise.all([claude.use("db"),claude.use("user")]);
    if(!db||!user)return;
    const id=await user.id(); if(!id)return;
    try{const me=await user.me();cloud.name=(me&&me.name)||""}catch(e){}
    const doc=db.doc("data/users/"+id+"/glasskap");
    const snap=await Promise.race([doc.get(),new Promise((_,no)=>setTimeout(()=>no(new Error("timeout")),10000))]);
    if(snap&&snap.exists){const remote=snap.data()||{};S=mergeState(S,remote)}
    cloud.doc=doc;cloud.on=true;
    try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
    listeners.forEach(fn=>{try{fn()}catch(e){}});
    if(!snap||!snap.exists){cloud.dirty=true;flush()}
  }catch(e){console.warn("Kontot svarade inte, sparar lokalt",e)}
}
function addPoints(n,why){S.points=(S.points||0)+n;S.pointsLog.unshift({n,why,ts:Date.now()});S.pointsLog=S.pointsLog.slice(0,30)}
function isFav(id){return S.favs.includes(id)}
function toggleFav(id){const i=S.favs.indexOf(id);if(i>=0)S.favs.splice(i,1);else{S.favs.unshift(id);toast(byId[id].name+" sparad i favoriter");track("add_to_wishlist",{items:[itemOf(byId[id])]});nudgeLogin("fav")}save()}
function pushRecent(id){S.recent=[id,...S.recent.filter(x=>x!==id)].slice(0,12);save(true);renderRecent()}

/* ---------- Toast ---------- */
let tt;function toast(m){const el=$("#toast");el.textContent=m;el.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>el.classList.remove("on"),2800)}

/* ---------- Produktkort ---------- */
const heartSvg=`<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>`;
function card(p,why,eager){
  const sw=p.colors?`<div class="swatches">${p.colors.map(c=>`<i style="background:${c}"></i>`).join("")}</div>`:"";
  return `<article class="card"><div class="ph" data-open="${p.id}"><img src="${img(p,true)}" data-pimg="${p.id}" alt="${esc(p.name)}, ${esc(p.mat.toLowerCase())}" ${eager?'fetchpriority="high"':'loading="lazy"'} width="480" height="600"><img class="alt" data-palt="${p.id}" alt="" aria-hidden="true"><span class="tag">${p.was?"Kampanj":p.tag}</span><button class="heart" data-fav="${p.id}" aria-pressed="${isFav(p.id)}" aria-label="Spara ${esc(p.name)} i favoriter">${heartSvg}</button><label class="cmp"><input type="checkbox" data-cmp="${p.id}" ${cmpSet.has(p.id)?"checked":""}> Jämför</label><button class="add" data-add="${p.id}">Lägg i varukorg</button></div>
  <div class="info" data-open="${p.id}"><div class="brand">${esc(p.mat)}</div><h3>${esc(p.name)}</h3><div class="spec">${p.vol} cl · ${packTxt(p)}${p.props.includes("diskmaskin")?" · tål diskmaskin":""}</div><div class="stars">★★★★★<span>${p.rating} (${p.reviews})</span></div>${sw}<div class="price"><b>${kr(p.price)}</b>${p.was?`<s>${kr(p.was)}</s>`:""}${p.pack>1?`<span>${kr(per(p))} per glas</span>`:""}</div><div class="stock${STOCK[p.id]?" low":""}">${stockTxt(p)}</div>${why?`<div class="why">${esc(why)}</div>`:""}</div></article>`;
}
const cmpSet=new Set();
function refreshHearts(){$$("[data-fav]").forEach(b=>b.setAttribute("aria-pressed",String(isFav(b.dataset.fav))));const n=S.favs.length,fb=$("#favBadge");fb.textContent=n;fb.classList.toggle("on",n>0);$("#favBtn").setAttribute("aria-label",`Favoriter, ${n} sparade`)}
document.addEventListener("pointerover",e=>{const ph=e.target.closest(".card .ph");if(!ph)return;const a=$("img.alt",ph);if(a&&!a.getAttribute("src"))a.src=altImg(byId[a.dataset.palt])});
function refreshImages(){$$("img[data-pimg]").forEach(i=>{const p=byId[i.dataset.pimg];if(p)i.src=img(p,i.closest(".card,.hit,.gk-item,.row-scroll,.tre,.mega-p,.pick,.trial")!==null)});$$("img[data-palt][src]").forEach(i=>{const p=byId[i.dataset.palt];if(p)i.src=altImg(p)})}
document.addEventListener("click",e=>{const h=e.target.closest("[data-fav]");if(!h)return;e.preventDefault();e.stopPropagation();toggleFav(h.dataset.fav);h.classList.remove("pop");void h.offsetWidth;h.classList.add("pop")});
onState(refreshHearts);

/* ---------- Sidor och adresser ---------- */
const VIEWS=$$("[data-view]").map(v=>v.dataset.view);
const nav=$("#nav");
let curView="hem", openedByUs=false;
const viewHooks={};
function route(){
  const h=decodeURIComponent(location.hash.slice(1));
  if(/^rum-[A-Za-z0-9]{6}$/.test(h)){showView("upptack");gOpen(h.slice(4).toUpperCase());return}
  if(/^lista-[A-Za-z0-9]{10}$/.test(h)){showView("lista");openList(h.slice(6));return}
  if(/^bord-[A-Za-z0-9]{10}$/.test(h)){showView("dukning");openBord(h.slice(5));return}
  if(h==="tillsammans"){showView("upptack");setSwMode("group");return}
  if(h.startsWith("p-")&&byId[h.slice(2)]){
    if(!$("[data-view]:not([hidden])"))showView("hem");
    openProduct(h.slice(2));return;
  }
  if(modal.classList.contains("open")&&modal.dataset.kind==="product")closeModal(true);
  const v=VIEWS.includes(h)?h:(h===""||h==="top"?"hem":null);
  if(!v){showView(curView||"hem");return}
  showView(v);
}
function showView(v){
  const changed=v!==curView||!$(`[data-view="${v}"]:not([hidden])`);
  $$("[data-view]").forEach(el=>el.hidden=el.dataset.view!==v);
  curView=v;
  document.body.classList.toggle("view-home",v==="hem");
  $$(".nav-links a,.mmenu a").forEach(a=>a.toggleAttribute("aria-current",a.getAttribute("href")==="#"+v)&&a.setAttribute("aria-current","page"));
  const titles={hem:"Rätt glas för varje skål",handla:"Handla glas",glasguiden:"Glasguiden",upptack:"Glas-swipe",glasvaggen:"Glasväggen",dukning:"Dukningsstudion",barstudion:"Barstudion",provladan:"Provlådan",present:"Presentguiden",glasskap:"Mitt glasskåp",journal:"Glasjournalen",om:"Om oss och kontakt",varumarken:"Varumärken A till Ö",lista:"Önskelista"};
  document.title="SKÅL & CO · "+(titles[v]||"");
  if(changed)window.scrollTo(0,0);
  if(viewHooks[v])viewHooks[v]();
  if(changed)track("page_view",{page:v});
  closeMenu();closeMega();onScroll();
}
addEventListener("hashchange",route);
function goto(v){if(location.hash==="#"+v)route();else location.hash=v}

/* ---------- Kategorier, kollektioner, verktyg ---------- */
const CATS=[["vin","Vinglas","Bourgogne, Bordeaux, vitt","assets/l-middag-800.webp"],["whisky","Whisky och sprit","Provglas, tumbler, cognac","assets/l-bar-800.webp"],["champagne","Champagneglas","Flöjt, coupe, tulpan","assets/p-coupe.webp"],["cocktail","Cocktail och drink","Nick & Nora, highball","assets/p-nicknora.webp"],["vatten","Vardagsglas","Vatten, tumbler, färgat","assets/p-gron.webp"],["kaffe","Kaffe","Espresso, latte, koppar","assets/l-kaffe-800.webp"],["te","Te","Teglas, koppar och fat","assets/p-te.webp"],["dessert","Dessertglas","Skålar och coupes","assets/p-dessert.webp"],["ol","Ölglas","IPA, provning, pilsner","assets/p-ol.webp"],["karaff","Karaffer","Vin och vatten","assets/p-karaff.webp"]];
$("#cats").innerHTML=CATS.map((c,i)=>`<a class="cat rv d${i%3}" href="#handla" data-go="dryck:${c[0]}"><img src="${c[3]}" alt="" loading="lazy"><span class="t"><b>${c[1]}</b><small>${c[2]}</small></span></a>`).join("");
$("#miniCats").innerHTML=[["egenskap:kristall","Kristallglas"],["egenskap:munblast","Handgjort glas"],["egenskap:fargat","Färgat glas"],["antal:4","Glas i set"],["tillfalle:present","Presenter"],["stil:vintage","Vintage"]].map(c=>`<a class="chip" href="#handla" data-go="${c[0]}" style="text-decoration:none">${c[1]}</a>`).join("");
const COLL=[["Whiskysamlingen","Hemmabar","assets/l-bar-800.webp","dryck:whisky"],["Skandinavisk glasdesign","Stil","assets/s-tre-glas-800.webp","stil:skandinavisk"],["Konsten att dricka vin","Vin","assets/l-middag-800.webp","dryck:vin"],["Vardagsfavoriter","Vardag","assets/p-gron.webp","tillfalle:vardag"],["Modern cocktailkultur","Cocktail","assets/p-nicknora.webp","dryck:cocktail"],["Kristallurvalet","Egenskap","assets/p-karaff.webp","egenskap:kristall"]];
$("#collections").innerHTML=COLL.map((c,i)=>`<a class="coll rv d${i%3}" href="#handla" data-go="${c[3]}"><img src="${c[2]}" alt="" loading="lazy"><span class="t"><span class="mono">${c[1]}</span><b>${c[0]}</b></span></a>`).join("");
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
$("#tools").innerHTML=TOOLS.map(t=>`<a class="tool" href="#${t[0]}">${I[t[1]]}<b>${t[2]}</b><span>${t[3]}</span><span class="go">Öppna →</span></a>`).join("");

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
  $("#season").innerHTML=`<div class="ph"><img src="${s[4]}" alt="" loading="lazy"></div><div class="txt"><span class="mono">Säsongen · ${s[0]}</span><h2>${s[2]}.</h2><p class="lead">${s[3]}</p><div><a class="btn btn-primary" href="#dukning" data-season="${s[1]}">Öppna dukningen</a></div></div>`;
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
  const one=F.dryck.size===1&&activeCount()===1?CATINTRO[[...F.dryck][0]]:null;
  $("#shopKicker").textContent=one?"Handla · "+one[0]:"Handla";
  $("#shopTitle").textContent=one?one[0]+". "+one[1]:"Handla som du vill.";
  $("#shopLead").textContent=one?one[2]:"Kombinera dryck, tillfälle, stil, egenskaper, prisnivå och storlek. Eller beskriv vad du letar efter i sökfältet.";
  $("#facets").innerHTML=FACETS.map(([k,label,opts,get])=>{
    return `<details ${F[k].size||["dryck","tillfalle","niva"].includes(k)?"open":""}><summary>${label}${F[k].size?` · ${F[k].size}`:""}</summary><div class="fl">${opts.map(([v,l])=>{const n=P.filter(p=>matchF(p,k)&&get(p).includes(v)).length;return `<button data-fk="${k}" data-fv="${v}" aria-pressed="${F[k].has(v)}" ${!n&&!F[k].has(v)?"disabled":""}><span>${esc(l)}</span><small>${n}</small></button>`}).join("")}</div></details>`}).join("")
    +`<p class="note" style="margin-top:16px">Varumärken hittar du under <a href="#varumarken">Varumärken A till Ö</a>.</p>`;
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
  $("#brandIdx").innerHTML="ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ".split("").map(l=>letters.includes(l)?`<a href="#varumarken" data-letter="${l}">${l}</a>`:`<span>${l}</span>`).join("");
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
  <div><span class="mono">Kategorier</span><ul>${CATS.map(c=>`<li><a href="#handla" data-go="dryck:${c[0]}">${c[1]}</a></li>`).join("")}</ul></div>
  <div><span class="mono">Handla efter</span><ul>${[["tillfalle:middag","Middagsbjudning"],["tillfalle:hemmabar","Hemmabar"],["tillfalle:present","Presenter"],["stil:skandinavisk","Skandinavisk stil"],["stil:lyx","Modern lyx"],["egenskap:kristall","Kristallglas"],["egenskap:munblast","Handgjort glas"],["egenskap:fargat","Färgat glas"],["antal:4","Glas i set"]].map(x=>`<li><a href="#handla" data-go="${x[0]}">${x[1]}</a></li>`).join("")}</ul></div>
  <div><span class="mono">Kollektioner</span><ul>${COLL.map(c=>`<li><a href="#handla" data-go="${c[3]}">${c[0]}</a></li>`).join("")}<li><a href="#varumarken">Varumärken A till Ö</a></li></ul></div>
  <div class="mega-feat"><a class="mega-card" href="#dukning" data-season="${seasonKey()}"><img src="assets/l-middag-800.webp" alt="" loading="lazy"><span><span class="mono">Säsongen</span><b>Duka ${seasonName().toLowerCase()} på tio minuter</b></span></a>
   <span class="mono" style="display:block;margin:16px 0 8px">Trendar nu</span>${trend.map(p=>`<a class="mega-p" href="#p-${p.id}" data-open="${p.id}"><img src="${img(p,true)}" data-pimg="${p.id}" alt=""><span><b>${esc(p.name)}</b><small>${kr(p.price)}</small></span></a>`).join("")}</div></div>`;
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
  if(wasProduct&&!fromRoute&&location.hash.startsWith("#p-")){
    if(openedByUs){openedByUs=false;history.back()}else history.replaceState(null,"","#"+curView);
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
  $("#pTable",mb).addEventListener("click",()=>{const role=ROLEOF[p.cat];if(role){T.pick[role]=p.id;T.on.add(role)}pendingSeason=null;closeModal();location.hash="dukning"});
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
  const q=e.target.closest("[data-q]");if(q){const [k,d]=q.dataset.q.split("~");const L=cart.find(l=>l.key===k);if(L){L.q+=+d;if(L.q<=0)cart=cart.filter(x=>x!==L)}saveCart();renderCart()}
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
    <p class="note">Du får ${Math.floor(t/10)} skålpoäng för köpet.</p><p class="note">Du kan ångra köpet i 60 dagar med knappen Ångra avtalet här i sidfoten eller vid köpet i Mitt glasskåp. Läs <a href="#villkor" data-lj="l-kop">köpvillkoren</a>.</p>
    <button class="btn btn-primary" style="width:100%;margin-top:10px">Slutför köp (visning)</button>
  </div></form></div>`,"Kassa","co");
  $("#coForm").addEventListener("submit",e=>{e.preventDefault();
    const order={id:"SK"+String(Date.now()).slice(-6),ts:Date.now(),total:t,lines:cart.map(l=>({id:l.id,q:l.q,grav:l.grav,wrap:l.wrap,items:l.items}))};
    S.orders.unshift(order);
    cart.forEach(l=>{if(l.id==="provlada")return;const p=byId[l.id],o=S.owned.find(x=>x.id===p.id);if(o)o.count+=p.pack*l.q;else S.owned.push({id:p.id,name:p.name,shape:p.shape,count:p.pack*l.q})});
    addPoints(Math.floor(t/10),"Köp "+order.id);track("purchase",{transaction_id:order.id,value:t,currency:"SEK"});
    cart=[];saveCart();renderCart();save();
    $("#mbody").innerHTML=`<div class="co" style="text-align:center;padding:clamp(40px,6vw,80px)"><span class="mono">Order ${order.id} · visning</span><h2 style="margin:12px 0">Tack! Glasen är på väg.</h2><p class="lead" style="margin:0 auto">Glasen finns nu i Mitt glasskåp. Där kan du ersätta ett trasigt glas med två klick och se vad som saknas i serien.</p><div class="ctas" style="justify-content:center;margin-top:24px;display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn-primary" href="#glasskap" data-mclose>Öppna Mitt glasskåp</a><button class="btn btn-ghost" data-mclose>Fortsätt handla</button></div></div>`;
  });
});

/* ---------- Öppna produkt via adress ---------- */
function showProduct(id){
  if(modal.classList.contains("open")&&modal.dataset.kind==="product"){history.replaceState(null,"","#p-"+id);openProduct(id)}
  else{openedByUs=true;location.hash="p-"+id}
}
document.addEventListener("click",e=>{const o=e.target.closest("[data-open]");if(!o||e.target.closest("[data-add],.cmp,[data-fav]"))return;e.preventDefault();showProduct(o.dataset.open)});

/* ---------- Glasguiden: flera drycker, stilar och krav. Ett glas per dryck. ---------- */
const FQ=[
 {k:"drinks",multi:true,max:5,need:true,q:"Vad vill du dricka ur glasen?",hint:"Välj en eller flera. Vi sätter ihop ett glas för varje.",o:[["rott","Rött vin"],["vitt","Vitt vin"],["champagne","Bubbel"],["whisky","Whisky"],["cocktail","Cocktail"],["ol","Öl"],["vatten","Vatten"],["kaffe","Kaffe"],["te","Te"],["dessert","Dessert"]]},
 {k:"occ",multi:true,q:"När ska glasen användas?",hint:"Välj allt som stämmer.",o:[["vardag","Vardag"],["frukost","Frukost"],["middag","Middagsbjudning"],["fest","Fest"],["hemmabar","Hemmabar"],["present","Som present"]]},
 {k:"styles",multi:true,max:3,q:"Vilka stilar dras du till?",hint:"Välj upp till tre. Har du swipeat använder vi din stil om du hoppar över.",o:Object.entries(STYLEN)},
 {k:"must",multi:true,q:"Vad är viktigt för dig?",hint:"Det du väljer här räknas som krav.",o:[["diskmaskin","Tål diskmaskin"],["munblast","Tunt och munblåst"],["kristall","Kristall"],["stapelbart","Stapelbart"],["fargat","Färgat glas"],["klart","Klart glas"]]},
 {k:"budget",q:"Vad får ett glas kosta?",o:[["150","Upp till 150 kr"],["300","150 till 300 kr"],["9999","Över 300 kr"],["0","Spelar ingen roll"]]},
 {k:"count",q:"Hur många glas av varje?",o:[["2","2"],["4","4"],["6","6"],["8","8"],["12","12"]]}
];
const DRINKSHAPE={rott:["rott","Bourgogne"],vin:["rott","Bourgogne"],vitt:["vitt","Tulpan"],champagne:["flojt","Flöjt eller coupe"],whisky:["whisky","Provglas"],cocktail:["cocktail","Nick & Nora"],vatten:["tumbler","Tumbler"],kaffe:["dubbel","Dubbelväggat"],te:["te","Glaskopp"],ol:["ol","Tulpan för öl"],dessert:["dessert","Dessertskål"]};
const FLAB=(k,v)=>(FQ.find(q=>q.k===k).o.find(o=>o[0]===v)||[])[1];
let fs=0; const fa={drinks:[],occ:[],styles:[],must:[]}; let fSwap={};
$("#dots").innerHTML=FQ.map(()=>"<i></i>").join("");
function drawShape(key,label){
  const l=$("#gLine"),f=$("#gFill"),fl=FILL[key];
  l.setAttribute("d",SH[key]);f.setAttribute("d",fl?fl[0]:"");
  $$("#wine stop")[0].setAttribute("stop-color",fl?fl[1]:"#9a2a3a");$$("#wine stop")[1].setAttribute("stop-color",shade(fl?fl[1]:"#9a2a3a"));
  l.classList.remove("draw");f.classList.remove("on");void l.getBoundingClientRect();l.classList.add("draw");requestAnimationFrame(()=>f.classList.add("on"));
  $("#gLabel").textContent=label||"";
}
function shade(h){const n=parseInt(h.slice(1),16);return"#"+[(n>>16)&255,(n>>8)&255,n&255].map(v=>Math.round(v*.45).toString(16).padStart(2,"0")).join("")}
function finderSummary(f){if(!f)return"";const ds=(f.drinks||[f.drink]).filter(Boolean).map(d=>FLAB("drinks",d)||DRINKN[d]||d);
  return [ds.join(", "),f.count?f.count+" av varje":"",(f.styles||[]).map(s=>STYLEN[s]).join(", ").toLowerCase()].filter(Boolean).join(" · ")}
/* Poäng för ett glas och en dryck. Krav som inte uppfylls räknas som miss. */
function scoreFor(p,d){
  const prim=p.cat===d||((d==="rott"||d==="vitt")&&p.cat==="vin"&&p.drinks.includes(d));
  if(!prim&&!p.drinks.includes(d))return null;
  const w=[];let s=prim?50:34,max=50;
  w.push((prim?DRINKSHAPE[d][1]+"-form, gjord för ":"Fungerar också till ")+FLAB("drinks",d).toLowerCase());
  if(fa.occ.length){max+=14;const hit=fa.occ.filter(o=>p.occ.includes(o));s+=Math.min(14,hit.length*8);if(hit.length)w.push("passar "+hit.map(o=>FLAB("occ",o).toLowerCase()).join(" och "))}
  const pw=(S.profile&&S.profile.w)||{};
  if(fa.styles.length){max+=20;const hit=fa.styles.filter(x=>p.style.includes(x));s+=Math.min(20,hit.length*10);if(hit.length)w.push(hit.map(x=>STYLEN[x].toLowerCase()).join(" och ")+" stil")}
  else if(S.profile){max+=12;const b=p.style.reduce((n,x)=>n+Math.max(0,pw["s:"+x]||0),0);s+=Math.min(12,b*4);if(b>.5)w.push("passar din stil "+S.profile.name)}
  let miss=0;
  fa.must.forEach(m=>{max+=6;const ok=m==="klart"?!p.props.includes("fargat"):p.props.includes(m);if(ok){s+=6;w.push(FLAB("must",m).toLowerCase())}else miss++});
  const b=+fa.budget||0,pg=per(p),lo=b===300?150:b===9999?300:0;
  if(b){max+=12;if(pg<=b&&pg>lo){s+=12;w.push(kr(pg)+" per glas, inom budget")}else if(pg<=b)s+=8;else if(pg<=b*1.25)s+=2;else{s-=10;miss++}}
  return {p,s,pct:Math.max(40,Math.min(99,Math.round(s/max*100))),miss,why:w.join(", ").replace(/^./,c=>c.toUpperCase())+"."};
}
function finderSet(){
  const used=new Set();
  return fa.drinks.map(d=>{
    const all=P.filter(p=>p.cat!=="karaff").map(p=>scoreFor(p,d)).filter(Boolean).sort((a,b)=>a.miss-b.miss||b.s-a.s);
    if(!all.length)return {d,all:[]};
    let i=all.findIndex(r=>!used.has(r.p.id)&&r.miss===all[0].miss&&r.s>=all[0].s-8);if(i<0)i=0;
    const ordered=[all[i],...all.filter((_,k)=>k!==i)];
    const pick=ordered[(fSwap[d]||0)%ordered.length];used.add(pick.p.id);
    return {d,all:ordered,pick};
  });
}
let finderRes=[];
function renderFinder(){
  $$("#dots i").forEach((d,i)=>d.classList.toggle("on",i<=fs));
  if(fs<FQ.length){
    const q=FQ[fs],val=fa[q.k];
    const on=o=>q.multi?val.includes(o):val===o;
    $("#fq").innerHTML=`<div class="fq"><span class="mono">Fråga ${fs+1} av ${FQ.length}</span><h2 class="fq-h" style="margin-top:8px">${q.q}</h2>${q.hint?`<p class="note" style="margin:-8px 0 16px">${q.hint}</p>`:""}<div class="chips" ${q.multi?`role="group" aria-label="${esc(q.q)}"`:""}>${q.o.map(o=>`<button class="chip${q.multi?" multi":""}" data-fa="${o[0]}" aria-pressed="${on(o[0])}">${o[1]}</button>`).join("")}</div>
    <div class="fnav">${fs?'<button class="btn btn-ghost" id="fBack">Tillbaka</button>':""}${q.multi?`${q.need?"":`<button class="btn btn-ghost" id="fSkip">${val.length?"Rensa och hoppa över":"Hoppa över"}</button>`}<button class="btn btn-primary" id="fNext" ${q.need&&!val.length?"disabled":""}>Nästa${val.length?" ("+val.length+")":""}</button>`:""}</div></div>`;
    return;
  }
  const set=finderSet(),n=+fa.count;finderRes=set.filter(r=>r.pick).map(r=>r.pick);
  S.finder={drinks:[...fa.drinks],drink:fa.drinks[0]==="rott"||fa.drinks[0]==="vitt"?"vin":fa.drinks[0],occ:fa.occ[0]||"",style:fa.styles[0]||"",styles:[...fa.styles],must:[...fa.must],budget:fa.budget,count:fa.count,picks:finderRes.map(r=>r.p.id),ts:Date.now()};save(true);
  track("tool_complete",{tool:"glasguiden",results:finderRes.length});
  const total=set.reduce((t,r)=>t+(r.pick?Math.ceil(n/r.pick.p.pack)*r.pick.p.price:0),0);
  const editChip=(k,i)=>{const q=FQ[i],v=fa[k];const t=q.multi?(v.length?v.map(x=>FLAB(k,x)).join(", "):"Inget valt"):FLAB(k,v);return `<button class="fsum-chip" data-fedit="${i}"><small>${esc(q.q.replace(/\?$/,""))}</small>${esc(t)}</button>`};
  const nd=set.length;
  $("#fq").innerHTML=`<div class="fq fres-wrap"><span class="mono">Dina förslag</span><h2 class="fq-h" style="margin-top:8px">${nd===1?"Ditt glas för "+esc(FLAB("drinks",set[0].d).toLowerCase())+".":["","","Två","Tre","Fyra","Fem"][nd]+" glas, ett för varje dryck."}</h2>
  <div class="fsum">${FQ.map((q,i)=>editChip(q.k,i)).join("")}</div>
  <div class="fquick" role="group" aria-label="Justera förslagen"><span class="note">Justera:</span>${[["billigare","Billigare"],["lyx","Mer lyx"],["disk","Bara diskmaskin"],["farg","Med färg"]].map(([k,t])=>`<button class="chip" data-fquick="${k}" aria-pressed="${k==="disk"?fa.must.includes("diskmaskin"):k==="farg"?fa.must.includes("fargat"):k==="lyx"?fa.styles.includes("lyx"):false}">${t}</button>`).join("")}</div>
  <div class="fres">${set.map(r=>{if(!r.pick)return `<div class="pick none"><div><span class="mono">${esc(FLAB("drinks",r.d))}</span><p>Vi har inget sådant glas i visningsversionen än.</p></div></div>`;
    const p=r.pick.p,packs=Math.ceil(n/p.pack);
    return `<article class="pick"><img src="${img(p,true)}" data-pimg="${p.id}" alt="" data-open="${p.id}" style="cursor:pointer"><div><span class="mono">${esc(FLAB("drinks",r.d))}<em class="match">${r.pick.pct} % match</em></span><b>${esc(p.name)}</b><p>${esc(r.pick.why)}</p>${r.pick.miss?`<p class="fmiss">Uppfyller inte alla dina krav. Det här är närmast.</p>`:""}<p>${packs} × ${packTxt(p)} = ${kr(packs*p.price)}</p>
      <div class="pick-acts">${r.all.length>1?`<button class="small-btn" data-fswap="${r.d}">Visa ett annat (${r.all.length-1})</button>`:""}<label class="note" style="display:inline-flex;gap:6px;align-items:center;margin:0;cursor:pointer"><input type="checkbox" data-cmp="${p.id}" ${cmpSet.has(p.id)?"checked":""}> Jämför</label></div></div><button class="round" data-add="${p.id}" data-qty="${packs}" aria-label="Lägg ${esc(p.name)} i varukorgen">+</button></article>`}).join("")}</div>
  ${finderRes.length?`<div class="ftotal"><span>Hela setet, ${finderRes.length*n} glas</span><b>${kr(total)}</b></div>`:""}
  <div class="fnav"><button class="btn btn-ghost" id="fRestart">Börja om</button>${finderRes.length?'<button class="btn btn-ghost" id="fShare">Dela</button><button class="btn btn-ghost" id="fSave">Spara</button><button class="btn btn-primary" id="fAll">Lägg hela setet i varukorgen</button>':""}</div></div>`;
}
/* Visa senaste förslagen direkt om de finns sparade */
if(S.finder&&S.finder.drinks&&S.finder.count){fa.drinks=[...S.finder.drinks];fa.occ=[...(S.finder.occ?[S.finder.occ]:[])];fa.styles=[...(S.finder.styles||[])];fa.must=[...(S.finder.must||[])];fa.budget=S.finder.budget;fa.count=S.finder.count;fs=FQ.length}
$("#fq").addEventListener("click",e=>{
  const a=e.target.closest("[data-fa]");
  if(a){const q=FQ[fs],v=a.dataset.fa;
    if(q.multi){const L=fa[q.k],i=L.indexOf(v);if(i>=0)L.splice(i,1);else{if(q.max&&L.length>=q.max){toast("Välj högst "+q.max);return}L.push(v)}
      if(q.k==="drinks"&&L.length)drawShape(...DRINKSHAPE[L[L.length-1]]);renderFinder();return}
    fa[q.k]=v;fs++;renderFinder();return}
  if(e.target.closest("#fNext")){fs++;renderFinder();return}
  if(e.target.closest("#fSkip")){fa[FQ[fs].k]=[];fs++;renderFinder();return}
  if(e.target.closest("#fBack")){fs--;renderFinder();return}
  const ed=e.target.closest("[data-fedit]");if(ed){fs=+ed.dataset.fedit;renderFinder();return}
  const sw=e.target.closest("[data-fswap]");if(sw){fSwap[sw.dataset.fswap]=(fSwap[sw.dataset.fswap]||0)+1;renderFinder();return}
  const qk=e.target.closest("[data-fquick]");if(qk){const k=qk.dataset.fquick,tog=(L,v)=>{const i=L.indexOf(v);i>=0?L.splice(i,1):L.push(v)};
    if(k==="billigare"){fa.budget=fa.budget==="9999"||fa.budget==="0"?"300":"150"}
    if(k==="lyx")tog(fa.styles,"lyx");if(k==="disk")tog(fa.must,"diskmaskin");
    if(k==="farg"){tog(fa.must,"fargat");fa.must=fa.must.filter(m=>m!=="klart")}
    fSwap={};renderFinder();return}
  if(e.target.closest("#fRestart")){fs=0;fa.drinks=[];fa.occ=[];fa.styles=[];fa.must=[];delete fa.budget;delete fa.count;fSwap={};renderFinder();return}
  if(e.target.closest("#fSave")){S.saved.unshift({type:"guide",title:"Glasguiden: "+finderSummary(S.finder),data:{ids:finderRes.map(r=>r.p.id),count:+fa.count},ts:Date.now()});save();nudgeLogin("sparat");toast("Sparat i Mitt glasskåp");return}
  if(e.target.closest("#fShare")){copy(`Mitt glasskåp från SKÅL & CO (${finderSummary(S.finder)}):\n`+finderRes.map(r=>`${r.p.name}, ${kr(per(r.p))} per glas`).join("\n")+`\n${location.origin+location.pathname}#glasguiden`,"Förslagen är kopierade. Klistra in dem var du vill.");return}
  if(e.target.closest("#fAll")){finderRes.forEach(r=>addCart(r.p.id,Math.ceil(+fa.count/r.p.pack),true));toast("Hela setet ligger i varukorgen")}
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
  const grp=swMode==="group"&&G&&G.deck,D=grp?G.deck:SWDECK,i=grp?G.i:swI;
  const deck=$("#deck");$("#sprog").style.width=(i/Math.max(1,D.length)*100)+"%";
  if(i>=D.length){grp?gDone():finishSwipe();return}
  const show=D.slice(i,i+3).reverse();
  deck.innerHTML=show.map((c,k)=>{const top=k===show.length-1,depth=show.length-1-k;const src=c.p?img(c.p):"assets/"+c.mood+".webp";
    return `<div class="scard" data-top="${top}" style="transform:translateY(${depth*12}px) scale(${1-depth*.04});z-index:${k}" ${top?`tabindex="0" aria-label="${esc(c.p?c.p.name:c.title)}"`:"aria-hidden=\"true\""}><img src="${src}" alt=""><span class="stamp yes">GILLAR</span><span class="stamp no">NEJ</span><span class="stamp save">SPARA</span><div class="t"><b>${esc(c.p?c.p.name:c.title)}</b><span>${esc(c.p?c.p.mat+" · "+kr(per(c.p))+" per glas":c.sub)}</span></div></div>`}).join("");
  const el=$('.scard[data-top="true"]',deck);if(el)bindDrag(el);
  grp?renderGroupPanel():renderProfile(false);
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
function flyCard(kind){const el=$('.scard[data-top="true"]');
  if(el){const x=kind==="yes"?600:kind==="no"?-600:0,y=kind==="save"?-700:40;el.style.transform=`translate(${x}px,${y}px) rotate(${x/20}deg)`;el.style.opacity=0;}}
const swK=kind=>kind==="yes"?1:kind==="save"?1.5:-.6;
function swipe(kind){
  if(swMode==="group"){if(G&&G.deck)gSwipe(kind);return}
  if(kind==="undo"){if(!swLog.length)return;const l=swLog.pop();swI--;const t=tagsOf(SWDECK[swI]);for(const key in t)swW[key]-=t[key]*swK(l.kind);renderDeck();return}
  const c=SWDECK[swI];if(!c)return;
  flyCard(kind);
  const k=swK(kind),t=tagsOf(c);
  for(const key in t)swW[key]=(swW[key]||0)+t[key]*k;
  swLog.push({kind,id:c.p?c.p.id:c.mood});
  if(kind==="save"&&c.p&&!isFav(c.p.id)){S.favs.unshift(c.p.id);save(true);refreshHearts()}
  swI++;setTimeout(renderDeck,reduce?0:260);
}
$("#sbtns").addEventListener("click",e=>{const b=e.target.closest("[data-sw]");if(b)swipe(b.dataset.sw)});
document.addEventListener("keydown",e=>{if(curView!=="upptack"||modal.classList.contains("open")||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
  if(e.key==="ArrowRight"){e.preventDefault();swipe("yes")}else if(e.key==="ArrowLeft"){e.preventDefault();swipe("no")}else if(e.key==="ArrowUp"){e.preventDefault();swipe("save")}else if(e.key==="Backspace"){e.preventDefault();swipe("undo")}});
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
  $("#deck").innerHTML=`<div class="scard" style="cursor:default;display:grid;place-items:center;text-align:center;padding:30px"><img src="assets/s-tre-glas.webp" alt=""><div class="t" style="position:relative;inset:auto"><b>Klart!</b><span>${authOn()&&!AUTH.user?"Logga in för att spara din stil på kontot.":"Din stil är sparad i Mitt glasskåp."}</span></div></div>`;
  S.profile=buildProfile(swW);track("tool_complete",{tool:"glas-swipe",style:buildProfile(swW).name});S.saved.unshift({type:"swipe",title:"Glas-swipe: "+S.profile.name,data:{log:swLog.slice(-20)},ts:Date.now()});save();nudgeLogin("stil");
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
$("#tSave").addEventListener("click",()=>{S.saved.unshift({type:"dukning",title:`${SEASONS[T.season][0]} för ${T.guests}, ${STY[T.style][0].toLowerCase()}`,data:{season:T.season,style:T.style,guests:T.guests,on:[...T.on],pick:{...T.pick}},ts:Date.now()});save();nudgeLogin("sparat");toast("Dukningen är sparad i Mitt glasskåp")});
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
$("#kitSave").addEventListener("click",()=>{S.saved.unshift({type:"kit",title:"Barstudion: "+KITS[kit][0],data:{kit},ts:Date.now()});save();nudgeLogin("sparat");toast("Kitet är sparat i Mitt glasskåp")});

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
  S.dates.push({name:n.slice(0,40),date:d,budget:+$("#gBud").value,who:$("#gWho").value});save();$("#dName").value="";$("#dDate").value="";nudgeLogin("sparat");toast("Datumet är sparat i Mitt glasskåp")});

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

/* ---------- Villkor: hopp till avsnitt ---------- */
document.addEventListener("click",e=>{
  const j=e.target.closest("[data-lj]");if(!j)return;e.preventDefault();
  const go=()=>{const t=$("#"+j.dataset.lj);if(t)t.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"})};
  if(curView!=="villkor"){location.hash="villkor";setTimeout(go,60)}else go();
});

/* ---------- Samtycke och mätpunkter ---------- */
const CONSENT_KEY="skal-consent";
let consent=null;try{consent=localStorage.getItem(CONSENT_KEY)}catch(e){}
const TRACKLOG=[];
/* Händelsenamn följer GA4:s e-handelsnamn, så att en statistiktjänst kan kopplas på utan ändringar.
   Inget skickas förrän besökaren har sagt ja OCH en tjänst är kopplad (till exempel Google Tag Manager som läser dataLayer). */
function track(name,params={}){
  const ev={event:name,...params,ts:new Date().toISOString(),view:curView};
  TRACKLOG.unshift(ev);if(TRACKLOG.length>80)TRACKLOG.pop();
  if(consent==="yes"){window.dataLayer=window.dataLayer||[];window.dataLayer.push(ev)}
}
const itemOf=(p,q=1)=>({item_id:p.id,item_name:p.name,item_category:p.cat,price:p.price,quantity:q});
function showConsent(on,focus=true){$("#consent").hidden=!on;if(on&&focus)setTimeout(()=>$("#consent [data-consent='no']").focus(),50)}
function setConsent(v){consent=v;try{localStorage.setItem(CONSENT_KEY,v)}catch(e){}showConsent(false);toast(v==="yes"?"Tack! Statistik är tillåten.":"Okej, vi mäter ingenting.");if(v==="yes")track("consent_granted")}
document.addEventListener("click",e=>{
  const c=e.target.closest("[data-consent]");if(c){setConsent(c.dataset.consent);return}
  if(e.target.closest("[data-consent-open]")){e.preventDefault();showConsent(true)}
});
$("#trackShow").addEventListener("click",()=>{
  openModal(`<div class="co"><span class="mono">Mätpunkter · visning</span><h2 style="margin:8px 0 10px">Det här skulle mätas.</h2><p class="lead" style="font-size:17px">Händelserna nedan finns bara i den här fliken. ${consent==="yes"?"Du har tillåtit statistik, så de läggs också i dataLayer för en framtida statistiktjänst.":"Du har inte tillåtit statistik, så de skickas ingenstans."} Ingen statistiktjänst är kopplad än.</p><div class="track-list" style="margin-top:16px">${TRACKLOG.map(ev=>`<div>${esc(ev.ts.slice(11,19))} · <b>${esc(ev.event)}</b> ${esc(JSON.stringify(Object.fromEntries(Object.entries(ev).filter(([k])=>!["event","ts"].includes(k)))))}</div>`).join("")||"<div>Inga händelser än. Klicka runt på sidan och öppna igen.</div>"}</div></div>`,"Mätpunkter","track");
});

/* ---------- Ångerfunktion ---------- */
function openAnger(orderId){
  const open=S.orders.filter(o=>!o.withdrawn&&Date.now()-o.ts<60*864e5);
  openModal(`<div class="co"><span class="mono">Ångerrätt</span><h2 style="margin:8px 0 10px">Ångra ett köp.</h2><p class="lead" style="font-size:17px">Du har 14 dagars ångerrätt enligt lag och 60 dagars öppet köp hos oss. Fyll i uppgifterna, så får du ett kvitto direkt.</p>
  <form id="angerForm" style="display:grid;gap:10px;margin-top:16px;max-width:520px">
    <label class="note" style="margin:0" for="aName">Ditt namn</label><input class="field" id="aName" autocomplete="name" required>
    <label class="note" style="margin:0" for="aOrder">Vilket köp</label>
    ${open.length?`<select class="field" id="aOrder">${open.map(o=>`<option value="${esc(o.id)}" ${o.id===orderId?"selected":""}>${esc(o.id)}, ${fmtDate(o.ts)}, ${kr(o.total)}</option>`).join("")}<option value="">Annat ordernummer</option></select>`:""}
    <input class="field" id="aOrderTxt" placeholder="Ordernummer, till exempel SK123456" ${open.length?"hidden":""} aria-label="Ordernummer">
    <fieldset style="border:0;display:grid;gap:6px"><legend class="note" style="margin:0 0 6px">Hur vill du få bekräftelsen?</legend>
      <label class="radio"><input type="radio" name="aForm" value="mail" checked> Med e-post</label>
      <label class="radio"><input type="radio" name="aForm" value="fil"> Som fil att spara</label></fieldset>
    <input class="field" id="aMail" type="email" autocomplete="email" placeholder="Din e-post" aria-label="E-post för bekräftelsen">
    <button class="btn btn-primary" style="justify-self:start">Fortsätt</button>
  </form></div>`,"Ångra ett köp","anger");
  const mb=$("#mbody");
  $("#aOrder",mb)?.addEventListener("change",e=>{$("#aOrderTxt",mb).hidden=!!e.target.value});
  $$("[name=aForm]",mb).forEach(r=>r.addEventListener("change",()=>{$("#aMail",mb).hidden=$("[name=aForm]:checked",mb).value!=="mail"}));
  $("#angerForm",mb).addEventListener("submit",e=>{e.preventDefault();
    const name=$("#aName",mb).value.trim(),oid=($("#aOrder",mb)?.value||$("#aOrderTxt",mb).value).trim(),form=$("[name=aForm]:checked",mb).value,mail=$("#aMail",mb).value.trim();
    if(!name||!oid){toast("Fyll i namn och ordernummer");return}
    if(form==="mail"&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)){toast("Skriv en giltig e-postadress");return}
    $("#mbody").innerHTML=`<div class="co"><span class="mono">Bekräfta</span><h2 style="margin:8px 0 12px">Vill du ångra köpet ${esc(oid)}?</h2><p class="lead" style="font-size:17px">${esc(name)}, när du bekräftar har du frånträtt avtalet. Du får sedan instruktioner för returen.</p><div class="pdp-actions" style="margin-top:18px"><button class="btn btn-primary" id="aYes">Bekräfta ånger</button><button class="btn btn-ghost" data-mclose>Avbryt</button></div></div>`;
    $("#aYes").addEventListener("click",()=>{
      const at=new Date(),stamp=at.toLocaleString("sv-SE",{dateStyle:"long",timeStyle:"short"});
      const o=S.orders.find(x=>x.id===oid);if(o){o.withdrawn=at.getTime();save(true)}
      track("refund_request",{transaction_id:oid});
      const receipt=`Bekräftelse på ånger\nSKÅL & CO AB\n\nNamn: ${name}\nOrder: ${oid}\nÅngern mottogs: ${stamp}\n\nSkicka tillbaka varan inom 14 dagar. Vi betalar tillbaka inom 14 dagar från i dag, men vi får vänta tills varan kommit tillbaka.\n\n(Visningsversion. Inget köp har gjorts.)`;
      let link="";if(form==="fil"){try{link=URL.createObjectURL(new Blob([receipt],{type:"text/plain;charset=utf-8"}))}catch(err){}}
      $("#mbody").innerHTML=`<div class="co"><span class="mono">Kvitto</span><h2 style="margin:8px 0 12px">Ångern är mottagen.</h2><p class="lead" style="font-size:17px">Vi tog emot din ånger för order ${esc(oid)} den ${esc(stamp)}.</p><p style="color:var(--ink2);margin-top:10px">Skicka tillbaka varan inom 14 dagar. Vi betalar tillbaka inom 14 dagar från i dag, men vi får vänta tills varan kommit tillbaka.</p>
      <p class="note">${form==="mail"?`Bekräftelsen skickas till ${esc(mail)}. Visningsversion: inget e-postmeddelande skickas.`:"Spara kvittot som fil nedan."}</p>
      <div class="pdp-actions" style="margin-top:16px">${link?`<a class="btn btn-primary" href="${link}" download="angerkvitto-${esc(oid)}.txt">Ladda ner kvittot</a>`:""}<button class="btn btn-ghost" data-mclose>Stäng</button></div></div>`;
    });
  });
}
document.addEventListener("click",e=>{const a=e.target.closest("[data-anger]");if(a){e.preventDefault();openAnger(a.dataset.anger||"")}});

/* ---------- Inloggning till Mitt glasskåp (Firebase: Google och e-post) ----------
   Fyll i FIREBASE_CONFIG från Firebase-konsolen (Projektinställningar, Dina appar).
   Nycklarna är offentliga. Firestore-reglerna gör att varje kund bara når sitt eget dokument: glasskap/{uid}.
   Inne i Claude används i stället claude.use("db") (se connectCloud i 01-core.js). */
const FIREBASE_CONFIG={apiKey:"AIzaSyAZHd10YjyhuzHkjAfHWhEoL1AOw4N3TwQ",authDomain:"skal-co.firebaseapp.com",databaseURL:"https://skal-co-default-rtdb.europe-west1.firebasedatabase.app",projectId:"skal-co",storageBucket:"skal-co.firebasestorage.app",messagingSenderId:"6206948818",appId:"1:6206948818:web:9884bc2ba941fbece7740b"};
const FIREBASE_DB="rtdb"; /* "firestore" eller "rtdb" */
const FB_VER="13.4.0";
const AUTH={user:null,ready:false,api:null,busy:false};
const authOn=()=>!!FIREBASE_CONFIG&&!(window.claude&&typeof window.claude.use==="function");
async function initAuth(){
  if(!authOn()){AUTH.ready=true;renderUserBtn();return}
  try{
    const base=`https://www.gstatic.com/firebasejs/${FB_VER}/`;
    /* Firestore som standard. Har projektet Realtime Database (databaseURL i konfigurationen och FIREBASE_DB="rtdb") används den. */
    const rt=FIREBASE_DB==="rtdb";
    const [app,auth,dbm]=await Promise.all([import(base+"firebase-app.js"),import(base+"firebase-auth.js"),import(base+(rt?"firebase-database.js":"firebase-firestore.js"))]);
    const a=app.initializeApp(FIREBASE_CONFIG),au=auth.getAuth(a);
    au.languageCode="sv";
    let store;
    if(rt){const db=dbm.getDatabase(a);const r=uid=>dbm.ref(db,"glasskap/"+uid);
      store={get:async uid=>{const s=await dbm.get(r(uid));return s.exists()?s.val():null},set:(uid,v)=>dbm.set(r(uid),v),del:uid=>dbm.remove(r(uid))};
      AUTH.rt={ref:path=>dbm.ref(db,path),get:dbm.get,set:dbm.set,update:dbm.update,remove:dbm.remove,onValue:dbm.onValue};}
    else{const db=dbm.getFirestore(a);const r=uid=>dbm.doc(db,"glasskap",uid);
      store={get:async uid=>{const s=await dbm.getDoc(r(uid));return s.exists()?s.data():null},set:(uid,v)=>dbm.setDoc(r(uid),v),del:uid=>dbm.deleteDoc(r(uid))};}
    AUTH.api={auth,au,store};
    auth.onAuthStateChanged(au,u=>onUser(u));
  }catch(e){console.warn("Inloggningen kunde inte laddas",e);AUTH.ready=true;AUTH.failed=true;renderUserBtn()}
}
async function onUser(u){
  AUTH.user=u;AUTH.ready=true;
  if(u){
    const {store}=AUTH.api;
    try{
      const d=await store.get(u.uid);
      if(d&&d.json){try{S=mergeState(S,JSON.parse(d.json))}catch(e){}}
      cloud.doc={set:obj=>store.set(u.uid,{json:JSON.stringify(obj),ts:Date.now()})};
      cloud.on=true;cloud.name=u.displayName||(u.email||"").split("@")[0];cloud.provider="firebase";
      try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
      cloud.dirty=true;flush();
      track("login",{method:u.providerData[0]?.providerId==="google.com"?"google":"e-post"});
    }catch(e){console.warn("Kunde inte läsa glasskåpet",e);toast("Inloggad, men glasskåpet kunde inte hämtas just nu.")}
  }else{cloud.on=false;cloud.doc=null;cloud.name="";}
  listeners.forEach(fn=>{try{fn()}catch(e){}});
  renderUserBtn();
}
function renderUserBtn(){
  const b=$("#userBtn");if(!b)return;
  const u=AUTH.user;
  b.setAttribute("aria-label",u?`Mitt glasskåp, inloggad som ${u.displayName||u.email}`:"Mitt glasskåp, logga in");
  b.classList.toggle("signed",!!u);
  $(".u-init",b).textContent=u?((u.displayName||u.email||"?").trim()[0]||"?").toUpperCase():"";
}
const AUTHERR={"auth/invalid-credential":"Fel e-post eller lösenord.","auth/wrong-password":"Fel e-post eller lösenord.","auth/user-not-found":"Det finns inget konto med den e-posten.","auth/email-already-in-use":"Det finns redan ett konto med den e-posten. Logga in i stället.","auth/weak-password":"Lösenordet behöver minst 6 tecken.","auth/invalid-email":"E-postadressen ser inte rätt ut.","auth/popup-closed-by-user":"Inloggningen avbröts.","auth/too-many-requests":"För många försök. Vänta en stund och prova igen.","auth/network-request-failed":"Ingen kontakt. Kontrollera uppkopplingen.","auth/requires-recent-login":"Logga in igen först, sedan kan du radera kontot."};
const authMsg=e=>AUTHERR[e&&e.code]||"Något gick fel. Prova igen.";
function openLogin(mode="in",ctx){
  if(!authOn()){toast(window.claude?"Här i Claude sparas glasskåpet på ditt Claude-konto.":"Inloggningen kopplas på snart. Ditt glasskåp sparas i webbläsaren så länge.");return}
  if(!AUTH.api){toast(AUTH.failed?"Inloggningen kunde inte laddas. Prova att ladda om sidan.":"Ett ögonblick, inloggningen laddas.");return}
  const g=`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.6 2.3 2.3 6.6 2.3 12s4.3 9.7 9.7 9.7c5.6 0 9.3-3.9 9.3-9.5 0-.6-.1-1.1-.2-1.6H12z"/></svg>`;
  openModal(`<div class="co login"><span class="mono">Mitt glasskåp</span><h2 style="margin:8px 0 8px">${ctx?esc(ctx.h):mode==="up"?"Skapa ditt glasskåp.":"Logga in."}</h2><p class="lead" style="font-size:17px">${ctx?esc(ctx.p):"Din stil, dina favoriter, listor, glas och köp följer med på alla dina enheter."}</p>
  <button class="btn btn-google" id="gLogin">${g} Fortsätt med Google</button>
  <div class="or"><span>eller med e-post</span></div>
  <div class="vtoggle" role="tablist" style="margin-bottom:14px"><button role="tab" data-lm="in" aria-pressed="${mode!=="up"}">Logga in</button><button role="tab" data-lm="up" aria-pressed="${mode==="up"}">Skapa konto</button></div>
  <form id="loginForm" style="display:grid;gap:10px" novalidate>
    ${mode==="up"?`<label class="note" for="lName" style="margin:0">Ditt förnamn</label><input class="field" id="lName" autocomplete="given-name">`:""}
    <label class="note" for="lMail" style="margin:0">E-post</label><input class="field" id="lMail" type="email" autocomplete="email" required>
    <label class="note" for="lPass" style="margin:0">Lösenord${mode==="up"?", minst 6 tecken":""}</label><input class="field" id="lPass" type="password" autocomplete="${mode==="up"?"new-password":"current-password"}" required minlength="6">
    <p class="login-err" id="lErr" role="alert"></p>
    <button class="btn btn-primary">${mode==="up"?"Skapa konto":"Logga in"}</button>
    ${mode==="up"?"":`<button type="button" class="small-btn" id="lReset" style="justify-self:start">Glömt lösenordet?</button>`}
  </form>
  ${ctx?`<button type="button" class="linkbtn" data-mclose style="margin-top:14px">Inte nu, fortsätt utan konto</button>`:""}
  <p class="note" style="margin-top:14px">Genom att skapa ett konto godkänner du att vi sparar ditt glasskåp enligt <a href="#villkor" data-lj="l-integritet" data-mclose>integritetspolicyn</a>.</p></div>`,"Logga in","login");
  const mb=$("#mbody"),err=m=>{$("#lErr",mb).textContent=m||""};
  $$("[data-lm]",mb).forEach(b=>b.addEventListener("click",()=>openLogin(b.dataset.lm,ctx)));
  $("#gLogin",mb).addEventListener("click",()=>googleLogin(err));
  $("#loginForm",mb).addEventListener("submit",async e=>{e.preventDefault();
    const mail=$("#lMail",mb).value.trim(),pass=$("#lPass",mb).value,{auth,au}=AUTH.api;
    if(!mail||pass.length<6){err("Fyll i e-post och ett lösenord på minst 6 tecken.");return}
    const btn=$("#loginForm .btn-primary",mb);btn.disabled=true;
    try{
      if(mode==="up"){const c=await auth.createUserWithEmailAndPassword(au,mail,pass);const n=($("#lName",mb).value||"").trim();if(n)await auth.updateProfile(c.user,{displayName:n.slice(0,40)});try{await auth.sendEmailVerification(c.user)}catch(x){}renderUserBtn();cloud.name=n||cloud.name;toast("Kontot är skapat. Vi skickade en länk för att bekräfta e-posten.")}
      else{await auth.signInWithEmailAndPassword(au,mail,pass);toast("Välkommen tillbaka!")}
      closeModal();if(curView==="glasskap")renderGlasskap();
    }catch(x){err(authMsg(x));btn.disabled=false}
  });
  $("#lReset",mb)?.addEventListener("click",async()=>{const mail=$("#lMail",mb).value.trim();if(!mail){err("Skriv din e-post först.");return}
    try{await AUTH.api.auth.sendPasswordResetEmail(AUTH.api.au,mail);err("");toast("Vi har skickat en länk för att välja nytt lösenord.")}catch(x){err(authMsg(x))}});
}
async function googleLogin(err){
  if(!authOn()||!AUTH.api){openLogin();return}
  const {auth,au}=AUTH.api,p=new auth.GoogleAuthProvider();
  try{await auth.signInWithPopup(au,p);if(modal.classList.contains("open")&&modal.dataset.kind==="login")closeModal();toast("Välkommen! Ditt glasskåp sparas nu på kontot.")}
  catch(e){if(e.code==="auth/popup-blocked"){auth.signInWithRedirect(au,p);return}(err||toast)(authMsg(e))}
}
async function logout(){
  if(!AUTH.api||!AUTH.user)return;
  await flush();
  await AUTH.api.auth.signOut(AUTH.api.au);
  S=DEF();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
  save();toast("Du är utloggad. Ditt glasskåp finns kvar på kontot.");
}
async function deleteAccount(){
  const u=AUTH.user;if(!u)return;
  openModal(`<div class="co"><span class="mono">Radera konto</span><h2 style="margin:8px 0 12px">Radera kontot och glasskåpet?</h2><p class="lead" style="font-size:17px">Kontot, favoriter, listor, glas, sparade val och poäng tas bort för gott. Kvitton för köp sparar vi ändå i sju år, eftersom bokföringslagen kräver det.</p><p class="login-err" id="dErr" role="alert"></p><div class="pdp-actions" style="margin-top:18px"><button class="btn btn-primary" id="dYes">Ja, radera kontot</button><button class="btn btn-ghost" data-mclose>Avbryt</button></div></div>`,"Radera konto","delacc");
  $("#dYes").addEventListener("click",async()=>{
    const {store,auth}=AUTH.api;
    try{await store.del(u.uid);await auth.deleteUser(u);S=DEF();cloud.on=false;cloud.doc=null;save();closeModal();toast("Kontot är raderat.")}
    catch(e){$("#dErr").textContent=authMsg(e)}
  });
}
document.addEventListener("click",e=>{
  const lg=e.target.closest("[data-login]");if(lg){e.preventDefault();if(lg.dataset.login==="google")googleLogin();else openLogin(lg.dataset.login||"in")}
  if(e.target.closest("[data-logout]")){e.preventDefault();logout()}
  if(e.target.closest("[data-delacc]")){e.preventDefault();deleteAccount()}
});
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
/* ---------- Delat: önskelistor gäster kan köpa från, dukningar man röstar på, påminnelser i grupper ----------
   listor/{ID}/meta {owner, ownerName, name, type, items:[id], ts}   ägaren skriver. Alla med länken kan läsa.
   listor/{ID}/kopt/{produktid} {name, ts}                           vem som helst kan markera köpt en gång. Ägaren kan ångra.
   bord/{ID}/meta {owner, ownerName, title, data, ts}                ägaren skriver. Inloggade med länken kan läsa.
   bord/{ID}/rost/{uid} {name, v: 1|-1, c, ts}                       var och en skriver sin egen röst.
   rum/{KOD}/paminn/{uid} tidpunkt                                    den som skapade gruppen kan påminna. */
const id10=()=>{const A="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";let s="";for(let i=0;i<10;i++)s+=A[Math.floor(Math.random()*A.length)];return s};
const idOk=s=>/^[A-Za-z0-9]{10}$/.test(s||"");
const shareLink=h=>location.origin+location.pathname+"#"+h;
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
  LV.off=AUTH.rt.onValue(AUTH.rt.ref("listor/"+id),s=>{if(!LV||LV.id!==id)return;const v=s.val();if(!v||!v.meta){el.innerHTML=`<div class="lv-empty"><span class="mono">Önskelista</span><h1>Vi hittar inte listan.</h1><p class="lead">Länken kan vara fel, eller så har listan tagits bort.</p><a class="btn btn-ghost" href="#handla">Titta på glasen</a></div>`;return}
    LV.meta=v.meta;LV.kopt=v.kopt||{};renderListView()},e=>{el.innerHTML=`<div class="lv-empty"><h1>Listan kunde inte hämtas.</h1><p class="lead">Prova att ladda om sidan.</p></div>`;console.warn(e)});
}
function renderListView(){
  const el=$("#listaV"),m=LV.meta,k=LV.kopt,mine=AUTH.user&&AUTH.user.uid===m.owner;
  document.title="SKÅL & CO · "+m.name;
  const items=(m.items||[]).map(id=>byId[id]).filter(Boolean),n=items.filter(p=>k[p.id]).length;
  el.innerHTML=`<header class="page-head lv-head"><span class="mono">${m.type==="brollop"?"Bröllopslista":"Önskelista"}</span><h1>${esc(m.name)}</h1><p class="lead">${mine?"Det här är din lista. Dela länken, så ser gästerna vad som redan är köpt.":esc(m.ownerName||"Någon")+" önskar sig de här glasen. Köp ett och markera det, så köper ingen annan samma."}</p>
    <div class="lv-prog"><span><b>${n}</b> av ${items.length} köpta</span><i style="--w:${items.length?Math.round(n/items.length*100):0}%"></i></div>
    ${mine?`<div class="pdp-actions"><button class="btn btn-primary" data-lvshare>Dela listan</button><a class="btn btn-ghost" href="#glasskap" data-gtab="sparat">Ändra i Mitt glasskåp</a></div>`:""}</header>
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
    history.replaceState(null,"","#bord-"+id);openBord(id);
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
  if(e.target.closest("[data-bvclose]")){if(BV&&BV.off)try{BV.off()}catch(x){}BV=null;$("#bordVote").hidden=true;$("#bordVote").innerHTML="";history.replaceState(null,"","#dukning");return}
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
let staticMode=reduce||matchMedia("(max-width: 820px), (pointer: coarse)").matches||(navigator.connection&&navigator.connection.saveData)||location.protocol==="file:";
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
  const res=await fetch((dw=>dw>=2200?"assets/hero-2560.mp4":dw>=1400?"assets/hero.mp4":"assets/hero-1280.mp4")(innerWidth*(devicePixelRatio||1))+"?v=4k");if(!res.ok)throw new Error("video "+res.status);
  const len=+res.headers.get("content-length")||0;let blob;
  if(res.body&&len){const rd=res.body.getReader(),parts=[];let got=0;for(;;){const {done,value}=await rd.read();if(done)break;parts.push(value);got+=value.length;bar.style.strokeDashoffset=113-113*got/len}blob=new Blob(parts,{type:"video/mp4"})}
  else blob=await res.blob();
  video.src=URL.createObjectURL(blob);
  await new Promise((ok,no)=>{video.addEventListener("loadeddata",ok,{once:true});video.addEventListener("error",no,{once:true})});
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
