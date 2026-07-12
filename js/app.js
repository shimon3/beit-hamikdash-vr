import{SLIDES}from"./data.js";
import{RemoteSession,createPairingToken,displayToken}from"./remote-session.js";
const $=id=>document.getElementById(id);
const ui={menu:$("main-menu"),gallery:$("gallery-grid"),top:$("topbar"),hint:$("hint"),slideshow:$("slideshow"),tour:$("tour-controls"),panel:$("education-panel"),settings:$("settings")};
let mode="menu",tourIndex=0,tourPlaying=true,dwellTimer=0,remoteSession=null,remoteUrl="";
function show(el,on=true){if(el)el.classList.toggle("hidden",!on)}
function hint(text,ms=2600){ui.hint.textContent=text;show(ui.hint,!!text);clearTimeout(hint.t);if(ms)hint.t=setTimeout(()=>show(ui.hint,false),ms)}
function openInfo(s){$("panel-kicker").textContent=s.kicker;$("panel-title").textContent=s.title;$("panel-copy").textContent=s.copy}
function setSlideImage(s){const img=$("slide-image");img.classList.remove("visible");const next=new Image();next.onload=()=>{img.src=s.src;img.alt=s.title;requestAnimationFrame(()=>img.classList.add("visible"))};next.src=s.src}
function updateTourUI(){const s=SLIDES[tourIndex];$("tour-counter").textContent=`${tourIndex+1} / ${SLIDES.length}`;$("tour-progress").value=tourIndex+1;$("tour-pause").textContent=tourPlaying?"השהיה":"המשך";openInfo(s);setSlideImage(s)}
function scheduleDwell(){clearTimeout(dwellTimer);if(mode==="tour"&&tourPlaying)dwellTimer=setTimeout(()=>goTour(tourIndex+1),6000)}
function goTour(i){tourIndex=(i+SLIDES.length)%SLIDES.length;updateTourUI();scheduleDwell();reportRemoteStatus()}
function enterTour(startIndex=0){mode="tour";show(ui.menu,false);show(ui.gallery,false);show(ui.top);show(ui.tour);show(ui.panel);show(ui.slideshow);tourPlaying=true;goTour(startIndex)}
function buildGallery(){$("gallery-items").innerHTML=SLIDES.map((s,i)=>`<button class="gallery-item" data-index="${i}"><img src="${s.src}" alt="${s.title}" loading="lazy"><span>${s.title}</span></button>`).join("");$("gallery-items").querySelectorAll(".gallery-item").forEach(btn=>btn.onclick=()=>enterTour(Number(btn.dataset.index)))}
function openGallery(){mode="gallery";show(ui.menu,false);show(ui.top);show(ui.gallery);show(ui.tour,false);show(ui.panel,false);show(ui.slideshow,false);reportRemoteStatus()}
function exitToMenu(){mode="menu";clearTimeout(dwellTimer);show(ui.top,false);show(ui.gallery,false);show(ui.tour,false);show(ui.panel,false);show(ui.slideshow,false);show(ui.menu);reportRemoteStatus()}
function reportRemoteStatus(){if(!remoteSession?.connected)return;const labels={menu:"תפריט",tour:"סיור",gallery:"גלריה"};remoteSession.send("status",{mode,modeLabel:labels[mode]||mode,tourIndex,tourPlaying,at:Date.now()}).catch(()=>{})}
async function createRemote(){remoteSession?.disconnect();const token=createPairingToken();remoteUrl=new URL("./remote.html",location.href);remoteUrl.searchParams.set("session",token);$("remote-code").value=displayToken(token);$("open-remote-page").href=remoteUrl.href;$("remote-state").classList.remove("connected");$("remote-state-text").textContent="ממתינים לחיבור השלט";remoteSession=new RemoteSession(token,{onCommand:handleRemoteCommand});try{await remoteSession.connect();$("remote-state-text").textContent="הערוץ מוכן — פתחו את הקישור בשלט"}catch(e){console.error(e);$("remote-state-text").textContent="החיבור נכשל — בדקו את האינטרנט"}}
function handleRemoteCommand(command={}){const action=command.action,value=command.value;
 if(action==="controllerConnected"){$("remote-state").classList.add("connected");$("remote-state-text").textContent="השלט מחובר";reportRemoteStatus();return}
 if(action==="reportStatus"){reportRemoteStatus();return}
 if(action==="tour"){show($("remote-setup"),false);enterTour(0)}
 else if(action==="gallery"){show($("remote-setup"),false);openGallery()}
 else if(action==="menu")exitToMenu();
 else if(action==="tourPrev"&&mode==="tour")goTour(tourIndex-1);
 else if(action==="tourNext"&&mode==="tour")goTour(tourIndex+1);
 else if(action==="tourPause"&&mode==="tour")$("tour-pause").click();
 else if(action==="tourStop"&&mode==="tour"&&Number.isInteger(value)&&value>=0&&value<SLIDES.length)goTour(value);
 else if(action==="volume"){const v=Math.max(0,Math.min(1,Number(value)));$("volume").value=v;audio.volume(v)}
 else if(action==="audioToggle")$("audio-toggle").click();
 reportRemoteStatus()}
class AudioAtmosphere{constructor(){this.ctx=null;this.master=null;this.nodes=[];this.on=false}async toggle(){if(this.on){this.stop();return false}const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;this.ctx=new C;await this.ctx.resume();this.master=this.ctx.createGain();this.master.gain.value=+$("volume").value;this.master.connect(this.ctx.destination);for(const[freq,type,vol]of[[85,"sine",.025],[190,"sawtooth",.018],[125,"sine",.012]]){const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.value=vol;o.connect(g).connect(this.master);o.start();this.nodes.push(o)}this.on=true;return true}stop(){this.nodes.forEach(o=>o.stop());this.ctx?.close();this.nodes=[];this.on=false}volume(v){if(this.master)this.master.gain.value=v}}
const audio=new AudioAtmosphere();
function bindUI(){
 $("start-tour").onclick=()=>enterTour(0);
 $("open-gallery").onclick=openGallery;$("gallery-back").onclick=exitToMenu;
 $("back-menu").onclick=exitToMenu;
 $("tour-prev").onclick=()=>goTour(tourIndex-1);$("tour-next").onclick=()=>goTour(tourIndex+1);$("tour-exit").onclick=exitToMenu;
 $("tour-pause").onclick=()=>{tourPlaying=!tourPlaying;$("tour-pause").textContent=tourPlaying?"השהיה":"המשך";scheduleDwell();reportRemoteStatus()};
 $("open-remote").onclick=()=>{show($("remote-setup"));if(!remoteSession)createRemote()};$("close-remote").onclick=()=>show($("remote-setup"),false);$("create-remote").onclick=createRemote;
 $("copy-remote").onclick=async()=>{if(!remoteUrl)return;await navigator.clipboard.writeText(remoteUrl);hint("הקישור הועתק")};
 $("share-remote").onclick=async()=>{if(!remoteUrl)return;try{await navigator.share?.({title:"שלט בית המקדש",url:remoteUrl})}catch{}};
 $("settings-button").onclick=()=>show(ui.settings);$("close-settings").onclick=()=>show(ui.settings,false);
 $("audio-toggle").onclick=async e=>{const on=await audio.toggle();e.target.textContent=on?"השתקת האווירה":"הפעלת אווירה";if(!on&&!window.AudioContext&&!window.webkitAudioContext)hint("הדפדפן אינו תומך בצליל זה")};
 $("volume").oninput=e=>audio.volume(+e.target.value);
 addEventListener("keydown",e=>{if(mode==="menu"||mode==="gallery")return;if(e.key==="Escape")exitToMenu();if(e.key==="ArrowLeft")goTour(tourIndex+1);if(e.key==="ArrowRight")goTour(tourIndex-1);if(e.key===" "){$("tour-pause").click();e.preventDefault()}});
 let startX=0,dragging=false;const stage=$("slideshow");
 stage.addEventListener("pointerdown",e=>{startX=e.clientX;dragging=true});
 stage.addEventListener("pointerup",e=>{if(!dragging)return;dragging=false;const dx=e.clientX-startX;if(Math.abs(dx)<40)return;if(dx<0)goTour(tourIndex+1);else goTour(tourIndex-1)});
}
buildGallery();bindUI();show(ui.menu);
