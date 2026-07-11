import{RemoteSession,normalizeToken,displayToken}from"./remote-session.js";
import{TOUR}from"./data.js";
const $=id=>document.getElementById(id);
let session=null,lastSeen=0,watchdog=0;
const params=new URLSearchParams(location.search),initial=normalizeToken(params.get("session")||"");
$("pair-token").value=displayToken(initial);
$("tour-stop").innerHTML=TOUR.map((t,i)=>`<option value="${i}">${i+1}. ${t.title}</option>`).join("");
function message(text,error=false){$("connection-message").textContent=text;$("connection-message").style.color=error?"#ff9b9b":""}
function setConnected(on){$("connection-dot").style.background=on?"#43d17a":"#e0a844";$("headset-status").textContent=on?"המשקפת מחוברת":"ממתינים למשקפת"}
function updateStatus(status={}){lastSeen=Date.now();setConnected(true);$("headset-mode").textContent=status.modeLabel||status.mode||"מחובר";if(Number.isInteger(status.tourIndex))$("tour-stop").value=String(status.tourIndex);if(status.quality)$("remote-quality").value=status.quality}
async function connect(){
 const token=normalizeToken($("pair-token").value);if(token.length!==32){message("קוד החיבור צריך להכיל 32 תווים.",true);return}
 $("connect").disabled=true;message("מתחברים…");
 try{session?.disconnect();session=new RemoteSession(token,{onStatus:updateStatus});await session.connect();history.replaceState(null,"","?session="+token);showControls();await send("controllerConnected");await session.send("request-status",{});message("השלט מחובר. אפשר להכניס את הטלפון למשקפת.")}
 catch(e){console.error(e);message("החיבור נכשל. בדקו אינטרנט וקוד חיבור.",true);$("connect").disabled=false}
}
function showControls(){document.getElementById("controls").classList.remove("hidden");$("connect").textContent="מחובר";setConnected(false);clearInterval(watchdog);watchdog=setInterval(()=>{if(Date.now()-lastSeen>10000)setConnected(false);session?.send("request-status",{}).catch(()=>{})},5000)}
async function send(action,value=null){if(!session)return;try{await session.send("command",{action,value,id:crypto.randomUUID(),sentAt:Date.now()})}catch{message("הפקודה לא נשלחה. מנסים להתחבר מחדש…",true)}}
$("connect").onclick=connect;document.querySelectorAll("[data-command]").forEach(button=>button.onclick=()=>send(button.dataset.command,button.dataset.value||null));
$("tour-stop").onchange=e=>send("tourStop",Number(e.target.value));
$("remote-quality").onchange=e=>send("quality",e.target.value);
$("remote-volume").oninput=e=>send("volume",Number(e.target.value));
$("pair-token").oninput=e=>{const token=normalizeToken(e.target.value);e.target.value=displayToken(token)};
if(initial)connect();