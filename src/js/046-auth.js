
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
