// MashMac setup: put your Supabase values in the two constants below.
const SUPABASE_URL = "https://xufqrewcdzwrxsplmyob.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_dGLMfCstvVtQ0KryZqssng_GLzmTfZy";
const BUCKET = "mashmac";

const authView=document.getElementById("authView"), appView=document.getElementById("appView");
const email=document.getElementById("email"), password=document.getElementById("password");
const authBtn=document.getElementById("authBtn"), switchBtn=document.getElementById("switchBtn");
const authTitle=document.getElementById("authTitle"), authMsg=document.getElementById("authMsg");
const logoutBtn=document.getElementById("logoutBtn"), fileInput=document.getElementById("fileInput");
const gallery=document.getElementById("gallery"), appMsg=document.getElementById("appMsg");
const progressWrap=document.getElementById("progressWrap"), progressBar=document.getElementById("progressBar");
let signUpMode=true, supabase=null;

function configured(){return !SUPABASE_URL.includes("PASTE_") && !SUPABASE_PUBLISHABLE_KEY.includes("PASTE_")}
function msg(el,t){el.textContent=t}
if(configured()) supabase=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
else msg(authMsg,"Open app.js and add your Supabase Project URL and Publishable key first.");

switchBtn.onclick=()=>{signUpMode=!signUpMode;authTitle.textContent=signUpMode?"Welcome to MashMac":"Welcome back";authBtn.textContent=signUpMode?"Create account":"Log in";switchBtn.textContent=signUpMode?"Already have an account? Log in":"Need an account? Sign up";msg(authMsg,"")};

authBtn.onclick=async()=>{
 if(!supabase)return;
 msg(authMsg,"");
 const e=email.value.trim(),p=password.value;
 if(!e||p.length<6){msg(authMsg,"Enter an email and a password of at least 6 characters.");return}
 const r=signUpMode?await supabase.auth.signUp({email:e,password:p}):await supabase.auth.signInWithPassword({email:e,password:p});
 if(r.error){msg(authMsg,r.error.message);return}
 if(signUpMode&&!r.data.session) msg(authMsg,"Account created. Check your email to confirm, then log in.");
 else showApp();
};
logoutBtn.onclick=async()=>{await supabase.auth.signOut();showAuth()};
fileInput.onchange=async()=>{const f=fileInput.files[0];if(f)await upload(f);fileInput.value=""};

async function upload(file){
 const {data:{user}}=await supabase.auth.getUser(); if(!user)return;
 const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,"_");
 const path=`${user.id}/${Date.now()}_${safe}`;
 progressWrap.classList.remove("hidden");progressBar.style.width="25%";msg(appMsg,"Uploading...");
 const {error}=await supabase.storage.from(BUCKET).upload(path,file,{contentType:file.type||"video/mp4",upsert:false});
 if(error){msg(appMsg,error.message);progressWrap.classList.add("hidden");return}
 progressBar.style.width="100%";msg(appMsg,"Upload complete.");setTimeout(()=>progressWrap.classList.add("hidden"),600);
 await loadVideos();
}

async function loadVideos(){
 gallery.innerHTML="<p class='muted'>Loading videos...</p>";
 const {data:{user}}=await supabase.auth.getUser();if(!user)return;
 const {data, error}=await supabase.storage.from(BUCKET).list(user.id,{limit:100,sortBy:{column:"name",order:"desc"}});
 if(error){gallery.innerHTML="";msg(appMsg,error.message);return}
 if(!data.length){gallery.innerHTML="<p class='muted'>No videos yet. Upload your first video.</p>";return}
 gallery.innerHTML="";
 for(const item of data){
   const path=`${user.id}/${item.name}`;
   const {data:urlData}=supabase.storage.from(BUCKET).getPublicUrl(path);
   const card=document.createElement("article");card.className="videoCard";
   card.innerHTML=`<video controls preload="metadata" src="${urlData.publicUrl}"></video><div class="meta"><strong>${escapeHtml(item.name)}</strong><button class="delete">Delete</button></div>`;
   card.querySelector(".delete").onclick=()=>removeVideo(path,card);
   gallery.appendChild(card);
 }
}
async function removeVideo(path,card){
 if(!confirm("Delete this video?"))return;
 const {error}=await supabase.storage.from(BUCKET).remove([path]);
 if(error){msg(appMsg,error.message);return} card.remove();msg(appMsg,"Video deleted.");
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
async function showApp(){authView.classList.add("hidden");appView.classList.remove("hidden");logoutBtn.classList.remove("hidden");await loadVideos()}
function showAuth(){authView.classList.remove("hidden");appView.classList.add("hidden");logoutBtn.classList.add("hidden")}
if(supabase){supabase.auth.getSession().then(({data})=>data.session?showApp():showAuth())}
