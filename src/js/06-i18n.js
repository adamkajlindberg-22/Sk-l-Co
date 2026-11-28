
/* ---------- Språk: svenska och engelska ----------
   Svenska är grundspråket i all kod. Väljer besökaren engelska hämtas ordlistan
   (docs/assets/i18n-en.json, byggd av scripts/i18n-merge.py) och varje text som visas byts ut,
   även text som funktionerna skapar senare. Originalet sparas, så att det går att byta tillbaka.
   Siffror, glasnamn, veckodagar och månader blir platshållare ({n0}, {p0}, {d0}, {m0}),
   samma regler som i scripts/i18n-keys.py. Saknas en text visas den på svenska. */
const LANG_KEY="skal-lang";
let lang="sv";try{lang=localStorage.getItem(LANG_KEY)==="en"?"en":"sv"}catch(e){}
let I18N=null,i18nLoading=null;
const I18N_ATTR=["placeholder","aria-label","title","alt"];
const tOrig=new WeakMap(),tDone=new WeakMap(),aOrig=new WeakMap();
const NAMES_RE=new RegExp(P.map(p=>p.name).sort((a,b)=>b.length-a.length).map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|"),"g");
const NUM_RE=/\d+(?:[  ]\d{3})*(?:,\d+)?/g;
const DAYS={måndag:"Monday",tisdag:"Tuesday",onsdag:"Wednesday",torsdag:"Thursday",fredag:"Friday",lördag:"Saturday",söndag:"Sunday"};
const MONTHS={januari:"January",februari:"February",mars:"March",april:"April",maj:"May",juni:"June",juli:"July",augusti:"August",september:"September",oktober:"October",november:"November",december:"December"};
const DAY_RE=new RegExp("\\b("+Object.keys(DAYS).join("|")+")\\b"),MONTH_RE=new RegExp("\\b("+Object.keys(MONTHS).join("|")+")\\b");
// 1 398 blir 1,398 och 4,9 blir 4.9
const enNum=x=>x.replace(/[  ](?=\d{3}\b)/g,",").replace(/,(\d{1,2})$/,".$1");
function tKey(s){
  const v={n:[],p:[],d:null,m:null};
  let k=s.replace(NUM_RE,x=>"{n"+(v.n.push(x)-1)+"}");
  k=k.replace(DAY_RE,x=>{v.d=x;return "{d0}"}).replace(MONTH_RE,x=>{v.m=x;return "{m0}"});
  k=k.replace(NAMES_RE,x=>"{p"+(v.p.push(x)-1)+"}");
  return [k,v];
}
const tFill=(t,v)=>t.replace(/\{([npdm])(\d+)\}/g,(_,c,i)=>c==="n"?enNum(v.n[+i]||""):c==="p"?(v.p[+i]||""):c==="d"?(DAYS[v.d]||v.d||""):(MONTHS[v.m]||v.m||""));
function tOne(s){
  const [k,v]=tKey(s);
  const hit=I18N.full[k]||I18N.parts[k];
  if(hit)return tFill(hit,v);
  if(!/[A-Za-zÅÄÖåäö]/.test(k.replace(/\{[npdm]\d+\}|\b(kr|cl|cm|ml|st|min|pack|D)\b/g,"")))return tFill(k,v);
  if(/\.$/.test(k)){const h=I18N.full[k.slice(0,-1)]||I18N.parts[k.slice(0,-1)];if(h)return tFill(h,v)+"."}
  return null;
}
// Hela texten först, annars delarna vid " · " och vid meningsslut
function translate(s){
  const t=tOne(s);if(t!=null)return t;
  // Ingen lookbehind i regexen: den saknas i Safari före 16.4
  const seg=s.split(/( · |\. )/);
  if(seg.length>1){let any=false;const out=seg.map(x=>{if(x===" · "||x===". "||!x.trim())return x;const end=x.endsWith(".");const y=tOne(end?x.slice(0,-1):x);if(y!=null){any=true;return y+(end?".":"")}return x});if(any)return out.join("")}
  if(s.includes(", ")){const parts=s.split(", ").map(tOne);if(parts.every(x=>x!=null))return parts.join(", ")}
  return null;
}
function tText(n){
  const cur=n.nodeValue;
  if(tDone.get(n)===cur)return;               // vår egen översättning
  const src=cur;if(!src.trim()||!/[A-Za-zÅÄÖåäö\d]/.test(src)){return}
  tOrig.set(n,src);
  if(lang!=="en"||!I18N)return;
  const m=src.match(/^(\s*)([\s\S]*?)(\s*)$/),t=translate(m[2].replace(/\s+/g," "));
  if(t!=null&&t!==m[2]){const out=m[1]+t+m[3];tDone.set(n,out);n.nodeValue=out}
  else if(t==null)(window.__i18nMiss=window.__i18nMiss||new Set).add(m[2].replace(/\s+/g," "));
}
function tAttr(el,a){
  const v=el.getAttribute(a);if(!v)return;
  let o=aOrig.get(el);if(!o){o={};aOrig.set(el,o)}
  if(o[a]&&o[a].en===v)return;
  o[a]={sv:v};
  if(lang!=="en"||!I18N)return;
  const t=translate(v.replace(/\s+/g," ").trim());
  if(t!=null&&t!==v){o[a].en=t;el.setAttribute(a,t)}
}
function tWalk(n){
  if(n.nodeType===3){const p=n.parentElement;if(p&&!/^(SCRIPT|STYLE|TEXTAREA)$/i.test(p.tagName)&&!p.closest("[data-notr]"))tText(n);return}
  if(n.nodeType!==1||n.hasAttribute("data-notr"))return;
  for(const a of I18N_ATTR)if(n.hasAttribute(a))tAttr(n,a);
  n.childNodes.forEach(tWalk);
}
// Tillbaka till svenska: originalen läggs tillbaka
function tRestore(n){
  if(n.nodeType===3){const o=tOrig.get(n);if(o!=null&&tDone.get(n)===n.nodeValue){n.nodeValue=o;tDone.delete(n)}return}
  if(n.nodeType!==1)return;
  const o=aOrig.get(n);if(o)for(const a in o)if(o[a].en&&n.getAttribute(a)===o[a].en){n.setAttribute(a,o[a].sv);delete o[a].en}
  n.childNodes.forEach(tRestore);
}
let tTitleSv=document.title;
function tTitle(){
  const cur=document.title;
  if(lang==="en"&&I18N){if(cur===tTitleEn)return;tTitleSv=cur;const t=translate(cur);if(t){tTitleEn=t;document.title=t}}
  else tTitleSv=cur;
}
let tTitleEn="";
new MutationObserver(ms=>{for(const m of ms){
  if(m.type==="characterData")tText(m.target);
  else if(m.type==="attributes")tAttr(m.target,m.attributeName);
  else m.addedNodes.forEach(tWalk);
}}).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:I18N_ATTR});
const titleEl=$("title");if(titleEl)new MutationObserver(tTitle).observe(titleEl,{childList:true,characterData:true,subtree:true});
function loadI18n(){
  if(I18N)return Promise.resolve();
  if(!i18nLoading)i18nLoading=fetch("assets/i18n-en.json?v=1").then(r=>{if(!r.ok)throw new Error("i18n "+r.status);return r.json()}).then(j=>{I18N=j});
  return i18nLoading;
}
async function setLang(l,quiet){
  lang=l==="en"?"en":"sv";try{localStorage.setItem(LANG_KEY,lang)}catch(e){}
  root.lang=lang;
  // Knappen visar alltid språket man byter till, på det språket
  $$("[data-lang]").forEach(b=>{b.textContent=b.hasAttribute("data-long")?(lang==="en"?"På svenska":"In English"):(lang==="en"?"SV":"EN");b.setAttribute("aria-label",b.hasAttribute("data-long")?(lang==="en"?"På svenska":"In English"):(lang==="en"?"SV, på svenska":"EN, in English"));b.setAttribute("lang",lang==="en"?"sv":"en")});
  if(lang==="en"){
    try{await loadI18n()}catch(e){lang="sv";root.lang="sv";root.classList.remove("lang-wait");if(!quiet)toast("Översättningen kunde inte laddas.");return}
    tWalk(document.body);tTitle();
  }else{tRestore(document.body);if(tTitleEn&&document.title===tTitleEn)document.title=tTitleSv}
  root.classList.remove("lang-wait");
  if(!quiet)track("language",{language:lang});
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-lang]");if(!b)return;e.preventDefault();closeMenu();setLang(lang==="en"?"sv":"en")});
setLang(lang,true);
setTimeout(()=>root.classList.remove("lang-wait"),2500);
})();
