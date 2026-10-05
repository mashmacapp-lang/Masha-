let sb=null;const $=x=>document.getElementById(x);
function log(x){$("log").textContent+="\n"+x}
async function test(){
 $("log").textContent="";
 if(!window.supabase){log("ERROR: Supabase library sinakweza.");return}
 const url=$("url").value.trim(),key=$("key").value.trim();
 if(!url||!key){log("ERROR: Lembani Project URL ndi Publishable/anon key.");return}
 try{
  sb=window.supabase.createClient(url,key);log("OK: Supabase library yapezeka.");
  const {data,error}=await sb.auth.getSession();if(error)throw error;
  log("OK: Supabase connection yagwira ntchito.");
  log(data.session?"OK: Pali login session.":"OK: Palibe login session.");
  $("auth").classList.remove("hide");
  const {data:b,error:be}=await sb.storage.listBuckets();
  if(be)log("STORAGE ERROR: "+be.message);
  else if((b||[]).some(x=>x.name==="mashmac")){$("storage").classList.remove("hide");log("OK: Bucket 'mashmac' yapezeka.");}
  else log("STORAGE ERROR: Bucket 'mashmac' sapezeka.");
 }catch(e){log("ERROR: "+(e.message||e))}
}
$("save").onclick=()=>{localStorage.setItem("murl",$("url").value);localStorage.setItem("mkey",$("key").value);test()};
$("signup").onclick=async()=>{try{let r=await sb.auth.signUp({email:$("email").value.trim(),password:$("password").value});if(r.error)throw r.error;$("authmsg").textContent=r.data.session?"SUCCESS: Account yapangidwa.":"SUCCESS: Signup yatheka; yang'anani email confirmation."; }catch(e){$("authmsg").textContent="ERROR: "+e.message}};
$("login").onclick=async()=>{try{let r=await sb.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});if(r.error)throw r.error;$("authmsg").textContent="SUCCESS: Walowa bwino."}catch(e){$("authmsg").textContent="ERROR: "+e.message}};
$("upload").onclick=async()=>{try{let f=$("file").files[0];if(!f)throw Error("Sankhani file kaye.");let u=(await sb.auth.getUser()).data.user;if(!u)throw Error("Uyenera kulowa kaye.");let r=await sb.storage.from("mashmac").upload(u.id+"/"+Date.now()+"_"+f.name,f);if(r.error)throw r.error;$("storagemsg").textContent="SUCCESS: Upload yagwira ntchito."}catch(e){$("storagemsg").textContent="ERROR: "+e.message}};
$("url").value=localStorage.getItem("murl")||"";$("key").value=localStorage.getItem("mkey")||"";if($("url").value&&$("key").value)test();