const db=window.__fdb||(window.__fdb={data:{},subs:[]});
const gp=p=>p.split('/').reduce((o,k)=>o==null?undefined:o[k],db.data);
function notify(){db.subs.forEach(s=>setTimeout(()=>s.cb(snap(s.path)),0))}
function sp(p,v){const ks=p.split('/');let o=db.data;ks.slice(0,-1).forEach(k=>{o[k]=o[k]||{};o=o[k]});if(v==null)delete o[ks[ks.length-1]];else o[ks[ks.length-1]]=JSON.parse(JSON.stringify(v));notify()}
window.__fset=sp;
function snap(p){const v=gp(p);return {exists:()=>v!=null,val:()=>v==null?null:JSON.parse(JSON.stringify(v))}}
export function initializeApp(){return {}}
export function getAuth(){return {}}
export function onAuthStateChanged(au,cb){setTimeout(()=>cb(window.__fuser||null),50)}
export class GoogleAuthProvider{}
export async function signInWithPopup(){}
export async function signOut(){}
export function getDatabase(){return {}}
export function ref(d,path){return {path}}
export async function get(r){return snap(r.path)}
export async function set(r,v){sp(r.path,v)}
export async function update(r,o){for(const k in o)sp(r.path+'/'+k,o[k])}
export async function remove(r){sp(r.path,null)}
export function onValue(r,cb){const s={path:r.path,cb};db.subs.push(s);setTimeout(()=>cb(snap(r.path)),0);return ()=>{db.subs=db.subs.filter(x=>x!==s)}}
