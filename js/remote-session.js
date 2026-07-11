import{createClient}from"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/+esm";
export const SUPABASE_URL="https://szvoxyzycankhkxvxlmf.supabase.co";
export const SUPABASE_KEY="sb_publishable_Mj1GAgHUT4Zcfr26xUjztw_3hyaeo3E";
export function createPairingToken(){
 const bytes=new Uint8Array(16);crypto.getRandomValues(bytes);
 return Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join("");
}
export function normalizeToken(value=""){return value.toLowerCase().replace(/[^a-f0-9]/g,"").slice(0,32)}
export function displayToken(token){return token.match(/.{1,4}/g)?.join("-")||""}
export class RemoteSession{
 constructor(token,{onCommand=()=>{},onStatus=()=>{}}={}){
  this.token=normalizeToken(token);this.onCommand=onCommand;this.onStatus=onStatus;
  this.client=createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
  this.channel=null;this.connected=false;
 }
 async connect(){
  if(this.token.length!==32)throw Error("invalid_pairing_token");
  this.channel=this.client.channel("temple:"+this.token,{config:{broadcast:{ack:true,self:false}}});
  this.channel.on("broadcast",{event:"command"},({payload})=>this.onCommand(payload));
  this.channel.on("broadcast",{event:"status"},({payload})=>this.onStatus(payload));
  this.channel.on("broadcast",{event:"request-status"},()=>this.onCommand({action:"reportStatus"}));
  return new Promise((resolve,reject)=>{
   const timeout=setTimeout(()=>reject(Error("realtime_timeout")),12000);
   this.channel.subscribe((status,error)=>{
    if(status==="SUBSCRIBED"){clearTimeout(timeout);this.connected=true;resolve(this)}
    if(status==="CHANNEL_ERROR"||status==="TIMED_OUT"){clearTimeout(timeout);reject(error||Error(status))}
   });
  });
 }
 send(event,payload={}){if(!this.channel||!this.connected)return Promise.reject(Error("not_connected"));return this.channel.send({type:"broadcast",event,payload})}
 disconnect(){if(this.channel)this.client.removeChannel(this.channel);this.connected=false}
}