
/* ---------- Shopify: priser, lager och kassa ----------
   Används bara när SHOPIFY i 01-core.js är ifyllt. Annars är allt som förut (visningsversion).
   Produkternas handle i Shopify = id i P (till exempel "bourgogne"). Skapa dem med npm run shopify:csv.
   Tillägg säljs som egna produkter: "gravyr" och "presentinslagning". Provlådan heter "provlada".
   Kassan är Shopifys egen. Vi tar aldrig emot kortuppgifter i den här koden. */
const SHOP_ADDON={grav:"gravyr",wrap:"presentinslagning"};
const shopVar={};      // handle -> variant-id
let shopReady=false;

async function sf(query,variables){
  const r=await fetch(`https://${SHOPIFY.domain}/api/${SHOPIFY.version}/graphql.json`,{
    method:"POST",
    headers:{"Content-Type":"application/json","X-Shopify-Storefront-Access-Token":SHOPIFY.token},
    body:JSON.stringify({query,variables})
  });
  if(!r.ok)throw new Error("Shopify svarade "+r.status);
  const j=await r.json();
  if(j.errors&&j.errors.length)throw new Error(j.errors.map(e=>e.message).join("; "));
  return j.data;
}

// Hämtar pris, jämförpris och lagerstatus för alla produkter och skriver in dem i P
async function syncShop(){
  let after=null,n=0;
  do{
    const d=await sf(`query($after:String){products(first:100,after:$after){pageInfo{hasNextPage endCursor}nodes{handle availableForSale variants(first:1){nodes{id availableForSale price{amount currencyCode}compareAtPrice{amount}}}}}}`,{after});
    for(const node of d.products.nodes){
      const v=node.variants.nodes[0];if(!v)continue;
      shopVar[node.handle]=v.id;
      const p=byId[node.handle];if(!p)continue;
      if(v.price.currencyCode!=="SEK")continue;
      p.price=Math.round(+v.price.amount);
      p.was=v.compareAtPrice&&+v.compareAtPrice.amount>+v.price.amount?Math.round(+v.compareAtPrice.amount):undefined;
      p.avail=!!(node.availableForSale&&v.availableForSale);n++;
    }
    after=d.products.pageInfo.hasNextPage?d.products.pageInfo.endCursor:null;
  }while(after);
  // Glas som inte finns i Shopify går inte att köpa
  P.forEach(p=>{if(!shopVar[p.id])p.avail=false});
  shopReady=true;
  renderCart();if(viewHooks[curView])viewHooks[curView]();
  const k=keyOf(location.href)||"";
  if(k.startsWith("p-")&&modal.classList.contains("open")&&modal.dataset.kind==="product")openProduct(k.slice(2));
  return n;
}

// Skapar en Shopify-varukorg och skickar kunden till Shopifys kassa
async function shopCheckout(){
  const lines=[],missing=[];
  const add=(handle,quantity,attributes)=>{const id=shopVar[handle];if(!id){missing.push(handle);return}lines.push({merchandiseId:id,quantity,...(attributes?{attributes}:{})})};
  for(const l of cart){
    if(l.id==="provlada"){add("provlada",l.q,[{key:"Glas",value:(l.items||[]).map(i=>byId[i]?.name).filter(Boolean).join(", ")}]);continue}
    add(l.id,l.q,l.grav?[{key:"Gravyr",value:l.grav}]:null);
    if(l.grav)add(SHOP_ADDON.grav,l.q,[{key:"Till",value:byId[l.id].name}]);
    if(l.wrap)add(SHOP_ADDON.wrap,l.q,[{key:"Till",value:byId[l.id].name}]);
  }
  if(missing.length){toast("Det här går inte att beställa just nu: "+[...new Set(missing)].map(h=>byId[h]?.name||h).join(", ")+". Ta bort det ur varukorgen.");return}
  const d=await sf(`mutation($input:CartInput!){cartCreate(input:$input){cart{checkoutUrl}userErrors{message}}}`,{input:{lines,buyerIdentity:{countryCode:"SE"}}});
  const res=d.cartCreate;
  if(res.userErrors&&res.userErrors.length)throw new Error(res.userErrors.map(e=>e.message).join("; "));
  track("begin_checkout",{value:cartTotal(),currency:"SEK"});
  location.href=res.cart.checkoutUrl;
}

if(shopOn()){
  // Kassan går till Shopify i stället för visningskassan
  $("#checkout").addEventListener("click",e=>{
    e.stopImmediatePropagation();
    if(!cart.length)return;
    if(!shopReady){toast("Vi hämtar priserna. Försök igen om en sekund.");return}
    const b=e.currentTarget;b.disabled=true;
    shopCheckout().catch(err=>{console.warn(err);toast("Kassan svarar inte just nu. Din varukorg finns kvar.")}).finally(()=>{b.disabled=false});
  },true);
  syncShop().catch(err=>{console.warn("Shopify",err);toast("Priserna kunde inte hämtas. Det som visas kan vara inaktuellt.")});
}
