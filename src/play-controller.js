import {clamp,fetchFrame,finishFetch,makeMuddy,waterPlant,discover,pourTea,wipePrints,togglePack,canPlay} from './playday.js';
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const near=(p,x,y,rx,ry=rx)=>((p.x-x)/rx)**2+((p.y-y)/ry)**2<=1;
export const TEA_CUPS=[{x:.26,y:.75},{x:.5,y:.75},{x:.74,y:.75}];
export const PICNIC_PLATES=[{x:.33,y:.76},{x:.69,y:.76}];

// One captured finger. Animations cannot grant a reward after navigation/cancellation.
export function createPlayController({getState,getScene,getMode,getFree=()=>false,getNose=()=>({x:-.023,y:-.2}),onFrame=()=>{},onSave=()=>{},onMessage=()=>{},onEnd=()=>{},requestFrame=globalThis.requestAnimationFrame?.bind(globalThis),cancelFrame=globalThis.cancelAnimationFrame?.bind(globalThis)}){
  let gesture=null,flight=null,bubbles=[],belly=false,rub=0,clock=null,last=null,frameId=null,serial=0,pops=0,animal={x:.22,y:.81},stopped=false,returned=null,nose={x:-.023,y:-.2};
  const view=()=>({dog:animal,pose:belly?'belly':'sit',ball:{x:.2,y:.79},frame:0,facing:1,bubbles,belly,pops,returned,carryKind:(getState().day.returns+1)%3===0?'sock':'ball',...(flight?fetchFrame(flight.target,flight.elapsed):{}),cursor:gesture?.point,drag:gesture?.drag,pack:gesture?.pack,butterfly:gesture?.point});
  function paint(){onFrame(view());}
  function queue(){if(frameId===null&&requestFrame&&!stopped)frameId=requestFrame(t=>{frameId=null;tick(t);});}
  function active(){return flight||bubbles.length||gesture?.drag==='pot';}
  function tick(time){if(stopped)return;const dt=last===null?0:clamp((time-last)/1000,0,.1);last=time;clock=time;
    if(flight){flight.elapsed+=dt;const f=fetchFrame(flight.target,flight.elapsed);animal=f.dog;if(flight.elapsed>=1.65&&!flight.mud&&near(flight.target,.77,.68,.14,.085)){flight.mud=true;if(makeMuddy(getState()))onSave();}if(f.done){const item=finishFetch(getState());flight=null;returned=item;onSave();onMessage(item==='sock'?'Men Sigge! Du hämtade en strumpa! 🧦':'Här är bollen igen! 🎾');onEnd('fetch',item);}}
    if(bubbles.length){const s=getState();const target=bubbles.find(v=>!v.pop);if(target){const dx=target.x-nose.x-animal.x;animal.x+=Math.sign(dx)*Math.min(Math.abs(dx),dt*.36);const dy=clamp(target.y-nose.y,.5,.94)-animal.y;animal.y+=Math.sign(dy)*Math.min(Math.abs(dy),dt*.3);}
      for(const v of bubbles){v.age+=dt;v.y-=dt*.035;v.x+=Math.sin(v.id+v.age)*dt*.012;if(!v.pop&&v.age>.5&&near(v,animal.x+nose.x,animal.y+nose.y,.07,.09)){v.pop=true;v.age=0;pops++;s.day.popped=Math.min(999,s.day.popped+1);discover(s,'bubbles');onSave();} }
      bubbles=bubbles.filter(v=>v.age<(v.pop?.9:7));}
    if(gesture?.drag==='pot'&&gesture.travel>.035){const i=TEA_CUPS.findIndex(p=>near(gesture.point,p.x,p.y,.105,.14));if(i>=0&&pourTea(getState(),i,dt*65)){gesture.changed=true;if(getState().day.tea.cups[i]===100&&!gesture.filled?.has(i)){(gesture.filled??=new Set()).add(i);onMessage(['En kopp till Lea!','En kopp till Sigge!','En kopp till din gäst!'][i]);}}}
    paint();if(active())queue();else last=null;
  }
  function point(event,surface){const r=surface.getBoundingClientRect();return {x:clamp((event.clientX-r.left)/r.width),y:clamp((event.clientY-r.top)/r.height)};}
  function down(event){if(gesture||event.isPrimary===false||event.button>0)return false;const surface=event.target.closest('[data-play-surface]');if(!surface)return false;const action=event.target.closest('[data-action]');if(action&&!['pack','discover'].includes(action.dataset.action))return false;stopped=false;nose=getNose()||nose;const p=point(event,surface),scene=getScene(),mode=getMode();let drag=null,pack=null;
    if(scene==='meadow'&&!canPlay(getState(),mode,getFree()))return true;
    if(scene==='packing'){pack=event.target.closest('[data-pack]')?.dataset.pack;if(!pack)return true;drag='pack';}
    if(surface.dataset?.discover)drag='discover';
    if(scene==='meadow'&&mode==='ball'){if(flight)return true;returned=null;if(!near(p,.2,.79,.12,.13)){onMessage('Hämta bollen med fingret. Dra ut den på gräset!');return true;}drag='ball';}
    if(scene==='tea'){if(near(p,.16,.43,.15,.2))drag='pot';else if(near(p,.5,.92,.25,.1))drag='snack';else return true;}
    if(scene==='picnic'){if(!near(p,.5,.91,.19,.12))return true;drag='fruit';}
    gesture={id:event.pointerId,surface,scene,mode,point:p,previous:p,travel:0,changed:false,drag,pack,discovery:surface.dataset?.discover};surface.setPointerCapture?.(event.pointerId);event.preventDefault?.();paint();return true;
  }
  function move(event){if(!gesture||event.pointerId!==gesture.id)return false;event.preventDefault?.();const g=gesture,p=point(event,g.surface),d=Math.min(.12,distance(p,g.previous));g.point=p;g.previous=p;g.travel+=d;const s=getState();
    if(g.scene==='meadow'){
      if(g.mode==='pet'&&near(p,.5,.65,.23,.3)&&d>0){rub+=d;g.changed=true;s.dog.affection=clamp(s.dog.affection+d*90,0,100);if(rub>.18&&!belly){belly=true;onMessage('Där kom magen fram! Klappa mjukt. 💗');}if(belly){s.day.belly=Math.min(999,s.day.belly+Math.round(d*40));}}
      if(g.mode==='bubbles'&&d>.009&&bubbles.length<12){bubbles.push({id:serial++,x:p.x,y:p.y,age:0,pop:false});g.changed=true;queue();}
      if(g.mode==='water'&&near(p,.78,.38,.15,.2)&&d>0){const before=s.day.water;g.changed=waterPlant(s,d*180)||g.changed;if(before<100&&s.day.water===100)onMessage('Du väckte blommorna! Fjärilen följer ditt finger. 🦋');}
      if(g.mode==='mud'&&near(p,.77,.68,.16,.13)&&d>.005){g.changed=makeMuddy(s)||g.changed;animal={x:p.x,y:.76};}
      if(g.mode==='bubbles')for(const b of bubbles)if(!b.pop&&b.age>.15&&distance(p,b)<.065){b.pop=true;b.age=0;pops++;s.day.popped=Math.min(999,s.day.popped+1);discover(s,'bubbles');g.changed=true;}
    }
    if(g.scene==='parade'&&near(p,p.x,.6,1,.5)&&d>0){s.day.parade.x=clamp(p.x,.3,.68);g.changed=true;}
    if(g.scene==='home')g.changed=wipePrints(s,p,d)||g.changed;
    if(g.drag==='pot'){last=null;queue();}
    paint();return true;
  }
  function release(event,cancelled=false){if(!gesture||event.pointerId!==undefined&&event.pointerId!==gesture.id)return false;if(!cancelled&&Number.isFinite(event.clientX)&&Number.isFinite(event.clientY))move(event);const g=gesture;gesture=null;try{g.surface.releasePointerCapture?.(g.id);}catch{}
    if(!cancelled&&g.travel>.04){const s=getState();if(g.drag==='pack'&&near(g.point,.73,.70,.22,.28)){g.changed=togglePack(s,g.pack)||g.changed;}if(g.drag==='discover'){g.changed=discover(s,g.discovery)||g.changed;}if(g.drag==='ball'){flight={target:{x:clamp(g.point.x,.35,.9),y:clamp(g.point.y,.64,.83)},elapsed:0,mud:false};last=null;queue();}
      if(g.drag==='snack'){const i=TEA_CUPS.findIndex(p=>near(g.point,p.x,p.y,.13,.17));if(i>=0){s.day.tea.snacks[i]=true;g.changed=true;onMessage('Varsågod! 🍓');}}
      if(g.drag==='fruit'){const i=PICNIC_PLATES.findIndex(p=>near(g.point,p.x,p.y,.16,.16));if(i>=0){s.day.picnic[i]=true;g.changed=true;onMessage(i?'Sigge fick ett hundkex! 🦴':'Lea fick ett äpple! 🍎');}}
    }
    if(g.changed)onSave();paint();onEnd(g.scene,cancelled?'cancel':g.travel>.04?'drag':'gesture');return true;
  }
  function stop(){if(gesture)release({pointerId:gesture.id},true);stopped=true;flight=null;bubbles=[];returned=null;belly=false;rub=0;animal={x:.22,y:.81};last=null;if(frameId!==null)cancelFrame?.(frameId);frameId=null;}
  return {down,move,up:e=>release(e),cancel:e=>release(e||{},true),stop,tick,view,resetBelly(){belly=false;rub=0;paint();}};
}
