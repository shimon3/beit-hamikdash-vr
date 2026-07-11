import{MODES,TOUR,HOTSPOTS,SAFE_VIEWS}from"./data.js";
import{detectCapabilities,capabilityMarkup,requestOrientation}from"./compatibility.js";
const $=id=>document.getElementById(id),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const ui={loading:$("loading"),fatal:$("fatal"),menu:$("main-menu"),onboarding:$("onboarding"),top:$("topbar"),hint:$("hint"),tour:$("tour-controls"),panel:$("education-panel"),tools:$("explore-tools"),settings:$("settings"),stereoExit:$("stereo-exit")};
let caps,renderer,scene,camera,eyeL,eyeR,clock,raf=0,mode="menu",quality="balanced",paused=false,tourIndex=0,tourPlaying=true,viewIndex=0,stereo=false,ipd=.064;
let theta=.55,phi=1.04,radius=145,dTheta=0,dPhi=0,dRadius=0,target,fromPos,fromLook,toPos,toLook,transition=1,lastCaption="",hotspots=[],occluders=[],raycaster,pointer,gyroEnabled=false,tourDwell=0,hotspotIndex=-1;
const tmp={q:null,e:null,q0:null,q1:null,axis:null,off:null,pos:null,next:null};
const gyro={a:0,b:0,g:0,o:0,ok:false};
function show(el,on=true){el.classList.toggle("hidden",!on)}
function hint(text,ms=2600){ui.hint.textContent=text;show(ui.hint,!!text);clearTimeout(hint.t);if(ms)hint.t=setTimeout(()=>show(ui.hint,false),ms)}
function fail(message){cancelAnimationFrame(raf);show(ui.loading,false);show(ui.fatal);$("fatal-message").textContent=message}
window.addEventListener("error",e=>{console.error(e.error||e.message);if(!renderer)fail("אירעה שגיאה בזמן בניית התצוגה. נסו לטעון מחדש.")});
window.addEventListener("unhandledrejection",e=>console.error("Unhandled promise",e.reason));

async function waitForThree(){for(let i=0;i<80&&!window.THREE;i++)await sleep(50);if(!window.THREE)throw Error("Three.js CDN unavailable")}
async function boot(){
 try{
  $("loading-text").textContent="בודקים את המכשיר";caps=await detectCapabilities();
  if(!caps.webgl)throw Error("WebGL unavailable");
  await waitForThree();quality=localStorage.getItem("temple-quality")||caps.recommended;
  $("quality").value=quality;$("compat-summary").textContent=caps.weak?"נבחרה איכות חסכונית למכשיר זה":"המכשיר מוכן לחוויה";
  $("capabilities").innerHTML=capabilityMarkup(caps);buildScene();bindUI();applyQuality(quality);animate();
  show(ui.loading,false);show(ui.menu);
 }catch(e){console.error(e);fail(e.message==="WebGL unavailable"?"WebGL אינו זמין. אפשר לנסות דפדפן מעודכן או להפעיל האצת חומרה.":"Three.js לא נטען. בדקו את החיבור ונסו שוב.")}
}
function mat(color,rough=.8,metal=0){return new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal})}
function addBox(w,h,d,m,x,y,z,parent=scene){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;parent.add(o);occluders.push(o);return o}
function addCyl(r,h,m,x,y,z,seg=12,parent=scene){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,seg),m);o.position.set(x,y,z);o.castShadow=true;parent.add(o);occluders.push(o);return o}
function buildScene(){
 renderer=new THREE.WebGLRenderer({canvas:$("scene"),antialias:quality!=="low",powerPreference:"high-performance"});
 renderer.outputEncoding=THREE.sRGBEncoding;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 scene=new THREE.Scene();scene.background=new THREE.Color(0x9eb6d1);scene.fog=new THREE.Fog(0xdccfae,220,620);
 camera=new THREE.PerspectiveCamera(64,innerWidth/innerHeight,.1,1000);eyeL=camera.clone();eyeR=camera.clone();
 target=new THREE.Vector3(0,14,-5);fromPos=new THREE.Vector3();fromLook=new THREE.Vector3();toPos=new THREE.Vector3();toLook=new THREE.Vector3();
 raycaster=new THREE.Raycaster();pointer=new THREE.Vector2();
 tmp.q=new THREE.Quaternion();tmp.e=new THREE.Euler();tmp.q0=new THREE.Quaternion();tmp.q1=new THREE.Quaternion(-Math.sqrt(.5),0,0,Math.sqrt(.5));tmp.axis=new THREE.Vector3(0,0,1);tmp.off=new THREE.Vector3();tmp.dir=new THREE.Vector3();tmp.pos=new THREE.Vector3();tmp.next=new THREE.Vector3();
 clock=new THREE.Clock();
 scene.add(new THREE.HemisphereLight(0xfff1cd,0x766348,.8));const sun=new THREE.DirectionalLight(0xffdfaa,1.2);sun.position.set(120,170,90);sun.castShadow=true;sun.shadow.mapSize.set(quality==="high"?2048:1024,quality==="high"?2048:1024);scene.add(sun);
 const stone=mat(0xd8c79d),white=mat(0xf0eadc,.65),gold=mat(0xd2aa37,.28,.85),dark=mat(0x20170f),bronze=mat(0x98643a,.4,.7);
 addCyl(420,8,mat(0xb6a477),0,-8,0,40);addBox(286,8,206,stone,0,-2,0);
 for(const z of[-98,98]){addBox(280,2,8,stone,0,8,z);for(let x=-132;x<=132;x+=14)addCyl(1.25,13,white,x,1,z)}
 for(const x of[-138,138]){addBox(8,2,190,stone,x,8,0);for(let z=-88;z<=88;z+=14)addCyl(1.25,13,white,x,1,z)}
 addBox(84,7,120,stone,0,3,-22);addBox(58,44,10,white,0,29,-38);addBox(35,39,45,white,0,26,-64);addBox(62,2,12,gold,0,52,-38);
 addBox(14,22,3,gold,0,23,-32);addBox(10,18,4,dark,0,21,-30);
 for(let x=-22;x<=22;x+=11)if(x)addCyl(1.1,37,gold,x,29,-31,10);
 for(let i=0;i<15;i++)addBox(38-i*1.2,.45,2.3,white,0,7+i*.45,5-i*1.15);
 addBox(18,3,18,stone,14,9,10);addBox(16,3,16,stone,14,12,10);addBox(14,3,14,stone,14,15,10);addBox(15,.3,15,mat(0x8d2c2c),14,13,10);
 const ramp=addBox(25,1.6,8,stone,34,11,10);ramp.rotation.z=.34;
 const fire=new THREE.Group();fire.name="fire";for(let i=0;i<8;i++){const f=new THREE.Mesh(new THREE.ConeGeometry(.7+Math.random()*.5,3+Math.random()*2,7),new THREE.MeshBasicMaterial({color:[0xffd66b,0xff8b22,0xef4c16][i%3],transparent:true,opacity:.85}));f.position.set((Math.random()-.5)*5,2,(Math.random()-.5)*5);f.userData.phase=Math.random()*6;fire.add(f)}fire.position.set(14,18,10);scene.add(fire);
 addCyl(2.4,2.2,bronze,-7,8,-12,18);addCyl(1,2,bronze,-7,6,-12);
 for(let i=0;i<12;i++)makePerson(-26+Math.random()*50,6.5,10+Math.random()*45,i===0);
 buildHotspots();resize();
 const el=renderer.domElement;let down=false,moved=false,lastX=0,lastY=0,startX=0,startY=0,pinch=0;
 el.addEventListener("pointerdown",e=>{down=true;moved=false;lastX=startX=e.clientX;lastY=startY=e.clientY;el.setPointerCapture?.(e.pointerId);interruptTransition()});
 el.addEventListener("pointermove",e=>{if(!down)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.hypot(e.clientX-startX,e.clientY-startY)>8)moved=true;dTheta-=dx*.005;dPhi-=dy*.005;lastX=e.clientX;lastY=e.clientY});
 el.addEventListener("pointerup",e=>{down=false;if(!moved)selectHotspot(e)});
 el.addEventListener("wheel",e=>{dRadius+=e.deltaY*.06;interruptTransition()},{passive:true});
 el.addEventListener("touchstart",e=>{if(e.touches.length===2)pinch=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)},{passive:true});
 el.addEventListener("touchmove",e=>{if(e.touches.length===2){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);dRadius+=(pinch-d)*.35;pinch=d}},{passive:true});
 addEventListener("deviceorientation",e=>{if(e.alpha==null)return;gyro.a=THREE.MathUtils.degToRad(e.alpha);gyro.b=THREE.MathUtils.degToRad(e.beta);gyro.g=THREE.MathUtils.degToRad(e.gamma);gyro.ok=true});
 addEventListener("orientationchange",orientation);screen.orientation?.addEventListener?.("change",orientation);orientation();
}
function makePerson(x,y,z,gadol=false){const g=new THREE.Group(),robe=addCyl(.5,1.55,mat(gadol?0x31558d:0xf5f1e6),0,.9,0,10,g);addCyl(.24,.45,mat(0xc99265),0,1.9,0,10,g);g.position.set(x,y,z);g.userData.baseY=y;g.userData.phase=Math.random()*6;scene.add(g)}
function buildHotspots(){for(const h of HOTSPOTS){const s=new THREE.Mesh(new THREE.SphereGeometry(1.05,12,10),new THREE.MeshBasicMaterial({color:0xf1cf60,transparent:true,opacity:.9}));s.position.fromArray(h.look);s.userData.info=h;s.userData.hotspot=true;scene.add(s);hotspots.push(s)}}
function selectHotspot(e){if(mode!=="explore")return;const r=renderer.domElement.getBoundingClientRect();pointer.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(hotspots,false)[0];if(hit){openInfo(hit.object.userData.info);focus(hit.object.userData.info)}}
function openInfo(info){$("panel-kicker").textContent=info.kicker;$("panel-title").textContent=info.title;$("panel-copy").textContent=info.copy;show(ui.panel)}
function focus(info){fromPos.copy(camera.position);fromLook.copy(target);toPos.fromArray(info.p);toLook.fromArray(info.look);transition=0}
function interruptTransition(){transition=1;if(mode==="tour")tourPlaying=false;updateTourUI()}
function updateTourUI(){if(mode!=="tour")return;const t=TOUR[tourIndex];$("tour-counter").textContent=`${tourIndex+1} / ${TOUR.length}`;$("tour-progress").value=tourIndex+1;$("tour-pause").textContent=tourPlaying?"השהיה":"המשך";if(lastCaption!==t.id){openInfo(t);lastCaption=t.id}}
function goTour(i){tourIndex=(i+TOUR.length)%TOUR.length;tourPlaying=true;tourDwell=0;focus(TOUR[tourIndex]);updateTourUI()}
function orientation(){gyro.o=THREE.MathUtils.degToRad(Number(screen.orientation?.angle??window.orientation??0))}
function applyQuality(q){quality=q;localStorage.setItem("temple-quality",q);if(!renderer)return;const cfg={low:{dpr:1,shadow:false},balanced:{dpr:1.5,shadow:true},high:{dpr:2,shadow:true}}[q];renderer.setPixelRatio(Math.min(devicePixelRatio,cfg.dpr));renderer.shadowMap.enabled=cfg.shadow;scene?.getObjectByName("fire")?.children.forEach((f,i)=>f.visible=q!=="low"||i<4);resize()}
function resize(){if(!renderer)return;const w=innerWidth,h=innerHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}
function renderStereo(){const w=innerWidth,h=innerHeight,sep=ipd/2;renderer.setScissorTest(true);camera.updateMatrixWorld();[[eyeL,0,-sep],[eyeR,w/2,sep]].forEach(([eye,x,off])=>{eye.aspect=w/2/h;eye.fov=camera.fov;eye.updateProjectionMatrix();eye.position.copy(camera.position);eye.quaternion.copy(camera.quaternion);eye.translateX(off);renderer.setViewport(x,0,w/2,h);renderer.setScissor(x,0,w/2,h);renderer.render(scene,eye)});renderer.setScissorTest(false);renderer.setViewport(0,0,w,h)}
let frames=0,fpsTime=0;
function animate(){
 raf=requestAnimationFrame(animate);if(document.hidden)return;const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;frames++;fpsTime+=dt;if(fpsTime>=.5){$("fps").textContent=Math.round(frames/fpsTime)+" FPS";frames=0;fpsTime=0}
 const fire=scene.getObjectByName("fire");fire.children.forEach(f=>{const s=.8+.2*Math.sin(t*8+f.userData.phase);f.scale.set(s,1+.25*Math.sin(t*10+f.userData.phase),s)});
 scene.children.filter(o=>o.userData.baseY!==undefined).forEach(o=>o.position.y=o.userData.baseY+Math.sin(t*2+o.userData.phase)*.025);
 if(transition<1){transition=Math.min(1,transition+dt/.9);const k=transition*transition*(3-2*transition);camera.position.lerpVectors(fromPos,toPos,k);target.lerpVectors(fromLook,toLook,k)}
 else if(mode==="tour"&&tourPlaying){tourDwell+=dt;if(tourDwell>6)goTour(tourIndex+1);camera.lookAt(target)}
 else if(gyroEnabled&&gyro.ok){tmp.e.set(gyro.b,gyro.a,-gyro.g,"YXZ");tmp.q.setFromEuler(tmp.e).multiply(tmp.q1).multiply(tmp.q0.setFromAxisAngle(tmp.axis,-gyro.o));camera.quaternion.slerp(tmp.q,.45)}
 else{theta+=dTheta;phi+=dPhi;radius+=dRadius;dTheta*=.82;dPhi*=.82;dRadius*=.75;phi=Math.max(.18,Math.min(1.46,phi));radius=Math.max(18,Math.min(300,radius));camera.position.set(target.x+radius*Math.sin(phi)*Math.sin(theta),target.y+radius*Math.cos(phi),target.z+radius*Math.sin(phi)*Math.cos(theta));camera.lookAt(target)}
 hotspots.forEach(h=>{h.visible=mode==="explore";if(h.visible){h.scale.setScalar(1+.12*Math.sin(t*3+h.position.x));tmp.off.copy(h.position).sub(camera.position);tmp.dir.copy(tmp.off).normalize();raycaster.set(camera.position,tmp.dir);const block=raycaster.intersectObjects(occluders,true)[0];h.visible=!block||block.distance>=tmp.off.length()-.5}});
 if(stereo)renderStereo();else renderer.render(scene,camera)
}
function enterMode(next){mode=next;show(ui.menu,false);show(ui.onboarding,false);show(ui.top);show(ui.tools,next==="explore");show(ui.tour,next==="tour");show(ui.stereoExit,next==="stereo");show(ui.panel,next==="tour");$("mode-name").textContent=MODES[next].title;stereo=next==="stereo";if(stereo){applyQuality("low");startStereo()}if(next==="tour")goTour(0);else{target.set(0,14,-5);theta=.55;phi=1.04;radius=145;hint(next==="explore"?"גררו לסיבוב · צבטו או גללו לזום":"הזיזו את הראש או גררו כדי להביט")}}
async function startStereo(){gyroEnabled=await requestOrientation();if(!gyroEnabled)hint("חיישני תנועה אינם זמינים — אפשר לגרור את התצוגה",4000);try{await document.documentElement.requestFullscreen?.()}catch{}try{await screen.orientation?.lock?.("landscape")}catch{hint("לא ניתן לנעול לרוחב; סובבו את הטלפון ידנית",4000)}}
function exitMode(){mode="menu";stereo=gyroEnabled=false;show(ui.top,false);show(ui.tools,false);show(ui.tour,false);show(ui.panel,false);show(ui.stereoExit,false);show(ui.menu);try{if(document.fullscreenElement)document.exitFullscreen()}catch{}try{screen.orientation?.unlock?.()}catch{}}
class AudioAtmosphere{constructor(){this.ctx=null;this.master=null;this.nodes={};this.on=false}async toggle(){if(this.on){this.stop();return false}const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;this.ctx=new C;await this.ctx.resume();this.master=this.ctx.createGain();this.master.gain.value=+$("volume").value;this.master.connect(this.ctx.destination);for(const [name,freq,vol]of[["ambience",85,.025],["fire",190,.018],["crowd",125,.012],["narration",260,0]]){const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=name==="fire"?"sawtooth":"sine";o.frequency.value=freq;g.gain.value=vol;o.connect(g).connect(this.master);o.start();this.nodes[name]={o,g,vol}}this.on=true;return true}stop(){Object.values(this.nodes).forEach(n=>n.o.stop());this.ctx?.close();this.nodes={};this.on=false}channel(n,on){if(this.nodes[n])this.nodes[n].g.gain.value=on?this.nodes[n].vol:0}volume(v){if(this.master)this.master.gain.value=v}}
const audio=new AudioAtmosphere();
function bindUI(){
 document.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{const m=b.dataset.mode,o=MODES[m];$("onboarding-kicker").textContent=o.kicker;$("onboarding-title").textContent=o.title;$("onboarding-copy").textContent=o.copy;$("onboarding-list").innerHTML=o.tips.map(x=>"<li>"+x+"</li>").join("");$("start-mode").dataset.mode=m;show(ui.onboarding)});
 $("start-mode").onclick=e=>enterMode(e.currentTarget.dataset.mode);document.querySelector(".close-onboarding").onclick=()=>show(ui.onboarding,false);$("back-menu").onclick=exitMode;$("stereo-exit").onclick=exitMode;
 $("tour-prev").onclick=()=>goTour(tourIndex-1);$("tour-next").onclick=()=>goTour(tourIndex+1);$("tour-exit").onclick=exitMode;$("tour-pause").onclick=()=>{tourPlaying=!tourPlaying;if(tourPlaying&&transition>=1)goTour(tourIndex);updateTourUI()};
 $("close-panel").onclick=()=>show(ui.panel,false);$("overview").onclick=()=>focus({p:[135,78,155],look:[0,15,-10]});$("next-view").onclick=()=>{viewIndex=(viewIndex+1)%SAFE_VIEWS.length;const v=SAFE_VIEWS[viewIndex];focus(v);hint("נקודת מבט: "+v.name)};$("next-hotspot").onclick=()=>{hotspotIndex=(hotspotIndex+1)%HOTSPOTS.length;const h=HOTSPOTS[hotspotIndex];openInfo(h);focus(h)};
 const openSettings=()=>show(ui.settings);$("open-settings").onclick=openSettings;$("settings-button").onclick=openSettings;$("close-settings").onclick=()=>show(ui.settings,false);
 $("quality").onchange=e=>applyQuality(e.target.value);$("show-fps").onchange=e=>show($("fps"),e.target.checked);$("ipd").oninput=e=>{ipd=e.target.value/1000;$("ipd-value").value=e.target.value};
 $("audio-toggle").onclick=async e=>{const on=await audio.toggle();e.target.textContent=on?"השתקת האווירה":"הפעלת אווירה";if(!on&&!window.AudioContext&&!window.webkitAudioContext)hint("הדפדפן אינו תומך בצליל זה")};$("volume").oninput=e=>audio.volume(+e.target.value);document.querySelectorAll("[data-channel]").forEach(c=>c.onchange=e=>audio.channel(e.target.dataset.channel,e.target.checked));
 $("retry").onclick=()=>location.reload();addEventListener("resize",resize);addEventListener("keydown",e=>{if(mode==="menu")return;if(e.key==="Escape")exitMode();if(mode==="tour"&&e.key==="ArrowLeft")goTour(tourIndex+1);if(mode==="tour"&&e.key==="ArrowRight")goTour(tourIndex-1);if(e.key===" "&&mode==="tour"){$("tour-pause").click();e.preventDefault()}});
 document.addEventListener("visibilitychange",()=>{if(!document.hidden)clock.getDelta()});
}
boot();