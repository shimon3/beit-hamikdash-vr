export function webglAvailable(){
 try{const c=document.createElement("canvas");return !!(window.WebGLRenderingContext&&(c.getContext("webgl")||c.getContext("experimental-webgl")));}catch{return false;}
}
export async function detectCapabilities(){
 const mobile=/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
 const memory=navigator.deviceMemory||4;
 const cores=navigator.hardwareConcurrency||4;
 const weak=mobile&&(memory<=3||cores<=4);
 let webxr=false;
 try{webxr=!!(navigator.xr&&await navigator.xr.isSessionSupported("immersive-vr"));}catch{}
 return {
  webgl:webglAvailable(),orientation:"DeviceOrientationEvent" in window,
  fullscreen:!!document.documentElement.requestFullscreen,
  orientationLock:!!screen.orientation?.lock,webxr,mobile,weak,
  recommended:weak?"low":mobile?"balanced":"high"
 };
}
export function capabilityMarkup(c){
 const row=(ok,label)=>`<div>${ok?"✓":"–"} ${label}</div>`;
 return row(c.webgl,"WebGL")+row(c.orientation,"חיישני תנועה")+row(c.fullscreen,"מסך מלא")+row(c.orientationLock,"נעילת כיוון")+row(c.webxr,"WebXR immersive-vr");
}
export async function requestOrientation(){
 if(!("DeviceOrientationEvent" in window))return false;
 try{
  if(typeof DeviceOrientationEvent.requestPermission==="function")return (await DeviceOrientationEvent.requestPermission())==="granted";
  return true;
 }catch{return false;}
}