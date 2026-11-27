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
