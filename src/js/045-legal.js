
/* ---------- Villkor: hopp till avsnitt ---------- */
document.addEventListener("click",e=>{
  const j=e.target.closest("[data-lj]");if(!j)return;e.preventDefault();
  const go=()=>{const t=$("#"+j.dataset.lj);if(t)t.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"})};
  if(curView!=="villkor"){goto("villkor");setTimeout(go,60)}else go();
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
