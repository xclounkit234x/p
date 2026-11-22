(()=>{"use strict";
const KEY="__ELEMENT_SNIPER_GUN__";
if(window[KEY]){window[KEY].destroy();return;}
const VERSION="2.1";
const host=document.createElement("div");host.id="__element_sniper_gun_host__";
host.style.cssText="position:fixed;inset:0;z-index:2147483647;pointer-events:none";
(document.documentElement||document.body).appendChild(host);
const root=host.attachShadow({mode:"open"});
root.innerHTML=`
<style>
:host{all:initial}*{box-sizing:border-box}
.hud{position:fixed;right:16px;top:16px;width:260px;padding:14px;color:#e9faff;background:linear-gradient(145deg,#101b2bfa,#07111df5);border:1px solid #38dfff;border-radius:14px;box-shadow:0 0 28px #00cfff35;font:12px/1.4 system-ui,sans-serif;pointer-events:auto;backdrop-filter:blur(12px)}
.brand{display:flex;align-items:center;justify-content:space-between;font-weight:900;letter-spacing:2px;color:#62eaff}.ver{font-size:10px;color:#8aa7b9;letter-spacing:0}
.status{margin:12px 0 8px;padding:9px;background:#142a3b;border:1px solid #24485d;border-radius:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#8cecff}
.stats,.actions{display:flex;gap:8px;justify-content:space-between}.stats{color:#91aebe;margin:9px 0}.stats b{color:#fff}
button{font:700 11px system-ui;letter-spacing:.5px;color:#eaffff;background:#15364a;border:1px solid #3186a3;border-radius:7px;padding:9px 10px;cursor:pointer}button:hover{background:#1b536c}button:focus-visible{outline:2px solid #fff;outline-offset:2px}.actions button{flex:1}
.hint{margin-top:10px;color:#7795a9;font-size:10px}
.reticle{position:fixed;width:34px;height:34px;left:0;top:0;transform:translate(-50%,-50%);border:1.5px solid #52eaff;border-radius:50%;pointer-events:none;filter:drop-shadow(0 0 5px #00dfff)}
.reticle:before,.reticle:after{content:"";position:absolute;background:#52eaff}.reticle:before{width:48px;height:1px;left:-9px;top:15px}.reticle:after{height:48px;width:1px;top:-9px;left:15px}
.reticle.lock{border-color:#ff535d;filter:drop-shadow(0 0 7px #ff304c)}.reticle.lock:before,.reticle.lock:after{background:#ff535d}
.gun{position:fixed;left:0;top:0;width:154px;height:88px;transform-origin:140px 43px;pointer-events:none;filter:drop-shadow(0 5px 8px #00101dcc);will-change:transform,left,top}
.gun.recoil{animation:recoil .19s ease-out}@keyframes recoil{0%{translate:0 0}35%{translate:-12px 5px}100%{translate:0 0}}
.projectile{position:fixed;width:15px;height:4px;border-radius:100%;background:#fff;box-shadow:0 0 7px 3px #42eaff;pointer-events:none}
.flash{position:fixed;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 0 24px 12px #ffbd45;animation:fade .2s forwards;pointer-events:none}
.impact{position:fixed;width:25px;height:25px;border:2px solid #ffd15a;border-radius:50%;animation:pop .36s ease-out forwards;pointer-events:none}
@keyframes fade{to{opacity:0;transform:scale(2.5)}}@keyframes pop{to{opacity:0;transform:scale(2.8)}}
.toast{position:fixed;left:50%;top:18%;transform:translateX(-50%);padding:9px 14px;border:1px solid #42dcff;border-radius:30px;background:#071827ed;color:#dffaff;font:800 12px system-ui;letter-spacing:1px;animation:toast .8s forwards;pointer-events:none}@keyframes toast{0%,65%{opacity:1}100%{opacity:0;transform:translate(-50%,-14px)}}
</style>
<div class="hud"><div class="brand"><span>✦ ELEMENT SNIPER</span><span class="ver">v${VERSION}</span></div>
<div class="status" id="target">SCANNING · MOVE TO ACQUIRE</div>
<div class="stats"><span>SCORE <b id="score">00000</b></span><span>HITS <b id="hits">0</b></span><span>MODE <b id="mode">AUTO</b></span></div>
<div class="actions"><button id="multi">MULTI: ON</button><button id="undo">↶ UNDO</button><button id="exit">EXIT</button></div>
<div class="hint">MOVE TO LOCK · CLICK TO FIRE · ESC TO EXIT<br>UNDO RESTORES THE LAST TARGET</div></div>
<div class="reticle" id="reticle"></div>
<svg class="gun" id="gun" viewBox="0 0 160 90" aria-hidden="true">
<defs><linearGradient id="body" x2="0" y2="1"><stop stop-color="#b9fbff"/><stop offset=".38" stop-color="#3289b7"/><stop offset="1" stop-color="#10233c"/></linearGradient><linearGradient id="glow"><stop stop-color="#eaffff"/><stop offset="1" stop-color="#21dfff"/></linearGradient></defs>
<path d="M10 25h77l20 10h42v15h-43L91 62H62l-7 21H34l5-25-29-9z" fill="url(#body)" stroke="#b5f8ff" stroke-width="2"/>
<path d="M18 30h64l13 9H18z" fill="#102a42"/><path d="M27 34h48" stroke="url(#glow)" stroke-width="3"/><path d="M111 37h28v10h-28z" fill="#092239"/><circle cx="120" cy="42" r="4" fill="#66f4ff"/><path d="M66 61h22l-8 19H59z" fill="#244966"/><path d="M147 36h9v13h-9z" fill="#d9ffff"/>
</svg>`;
const $=id=>root.getElementById(id);
let active=true,multi=true,score=0,hits=0,current=null,raf=0,lastPointer={x:innerWidth*.55,y:innerHeight*.45},angle=0;
const undoStack=[];
const ignored=e=>!e||e===host||host.contains(e)||e===document.documentElement||e===document.body;
function deepElementAt(x,y){
 let el=null,doc=document;
 try{el=doc.elementFromPoint(x,y)}catch{}
 for(let i=0;i<12&&el&&el.shadowRoot;i++){
  let inner=null;try{inner=el.shadowRoot.elementFromPoint?el.shadowRoot.elementFromPoint(x,y):null}catch{}
  if(!inner||inner===el)break;el=inner;
 }
 return el;
}
function normalizeTarget(node){
 if(node&&node.nodeType===Node.TEXT_NODE)node=node.parentElement;
 if(!(node instanceof Element))return null;
 if(ignored(node))return null;
 if(node.closest&&node.closest("#__element_sniper_gun_host__"))return null;
 return node;
}
function eventTarget(e){
 const path=e.composedPath?e.composedPath():[];
 for(const n of path){const el=normalizeTarget(n);if(el)return el;}
 return normalizeTarget(deepElementAt(e.clientX,e.clientY));
}
function describe(el){
 if(!el)return "SCANNING · MOVE TO ACQUIRE";
 let s=el.localName||el.tagName.toLowerCase();
 if(el.id)s+="#"+el.id;
 if(typeof el.className==="string"&&el.className.trim())s+="."+el.className.trim().split(/\s+/).slice(0,2).join(".");
 return s.length>42?s.slice(0,39)+"…":s;
}
function positionGun(x,y){
 const gun=$("gun"),dx=x-lastPointer.gunX||0,dy=y-lastPointer.gunY||0;
 const startX=x-175,startY=y+38;
 const desired=Math.atan2(y-startY,x-startX)*180/Math.PI;
 angle=desired;
 gun.style.left=(startX-140)+"px";gun.style.top=(startY-43)+"px";
 gun.style.transform="rotate("+angle+"deg)";
 lastPointer.gunX=x;lastPointer.gunY=y;
}
function move(e){
 if(!active)return;
 const x=e.clientX,y=e.clientY;lastPointer.x=x;lastPointer.y=y;
 $("reticle").style.left=x+"px";$("reticle").style.top=y+"px";
 positionGun(x,y);
 const el=normalizeTarget(deepElementAt(x,y));
 current=el;$("target").textContent=describe(el);
 $("reticle").classList.toggle("lock",!!el);
}
function fx(cls,x,y,duration=500){
 const n=document.createElement("div");n.className=cls;n.style.left=x+"px";n.style.top=y+"px";root.appendChild(n);setTimeout(()=>n.remove(),duration);
}
function toast(text){const n=document.createElement("div");n.className="toast";n.textContent=text;root.appendChild(n);setTimeout(()=>n.remove(),850)}
function fire(e){
 if(!active||host.contains(e.target))return;
 const el=eventTarget(e)||current;if(!el)return;
 e.preventDefault();e.stopImmediatePropagation();
 const gun=$("gun"),rect=gun.getBoundingClientRect();
 const rad=angle*Math.PI/180;
 const sx=rect.left+140*Math.cos(rad),sy=rect.top+43+140*Math.sin(rad);
 const x=e.clientX,y=e.clientY;
 gun.classList.remove("recoil");void gun.offsetWidth;gun.classList.add("recoil");
 fx("flash",sx-9,sy-9,250);
 const b=document.createElement("div");b.className="projectile";b.style.left=sx+"px";b.style.top=sy+"px";root.appendChild(b);
 const dist=Math.hypot(x-sx,y-sy),duration=Math.min(260,Math.max(90,dist*.35));
 const anim=b.animate([{transform:"translate(0,0) rotate(0deg)"},{transform:"translate("+(x-sx)+"px,"+(y-sy)+"px) rotate(0deg)"}],{duration,easing:"cubic-bezier(.2,.7,.3,1)"});
 anim.onfinish=()=>{
  b.remove();if(!active||!el.isConnected)return;
  fx("impact",x-12,y-12,450);
  const oldStyle=el.getAttribute("style"),oldHidden=el.hidden;
  undoStack.push({el,style:oldStyle,hidden:oldHidden});
  el.hidden=true;el.style.setProperty("display","none","important");
  score+=100;hits++;$("score").textContent=String(score).padStart(5,"0");$("hits").textContent=hits;
  toast("TARGET CLEARED  +100");
  current=null;$("target").textContent="TARGET CLEARED";
  if(!multi)cleanup();
 };
}
function undo(){
 const item=undoStack.pop();if(!item)return;
 if(item.el.isConnected){if(item.style===null)item.el.removeAttribute("style");else item.el.setAttribute("style",item.style);item.el.hidden=item.hidden;}
 score=Math.max(0,score-100);hits=Math.max(0,hits-1);
 $("score").textContent=String(score).padStart(5,"0");$("hits").textContent=hits;toast("TARGET RESTORED");
}
function key(e){if(e.key==="Escape")cleanup();else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){e.preventDefault();undo()}}
function cleanup(){
 if(!active)return;active=false;
 document.removeEventListener("pointermove",move,true);document.removeEventListener("click",fire,true);document.removeEventListener("keydown",key,true);
 cancelAnimationFrame(raf);host.remove();delete window[KEY];
}
$("multi").onclick=()=>{multi=!multi;$("multi").textContent="MULTI: "+(multi?"ON":"OFF");$("mode").textContent=multi?"AUTO":"SINGLE"};
$("undo").onclick=undo;$("exit").onclick=cleanup;
document.addEventListener("pointermove",move,true);document.addEventListener("click",fire,true);document.addEventListener("keydown",key,true);
window[KEY]={destroy:cleanup,undo};
positionGun(lastPointer.x,lastPointer.y);
})();