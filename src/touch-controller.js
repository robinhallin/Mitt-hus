import {portraitToFace} from './portrait-geometry.js';
import {DOG_MOUTH,DOG_ZONES} from './character-layout.js';
import {surfacePoint,dogCare,brushTeeth,commitPaint,paintTravel,strokeSamples,inside,guidePaintPoint} from './touch.js';
export function createTouchController({getState,getTool,onProgress,onHover,onEnd,onBlocked}){
 let active=null;
 const cursorPoint=(el,e)=>{const r=el.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height};};
 const point=(el,e)=>{const r=el.getBoundingClientRect();const p=surfacePoint(r,e.clientX,e.clientY,Number(el.dataset.aspect)||r.width/r.height);return p&&el.dataset.coordinateFrame==='portrait'?guidePaintPoint(getTool(el.dataset.surface).tool,portraitToFace(p)):p;};
 function release(g){if(g?.el?.hasPointerCapture?.(g.id))try{g.el.releasePointerCapture(g.id);}catch{}}
 function end(e,cancelled=false){if(!active||(e.pointerId??1)!==active.id)return false;const g=active;active=null;release(g);onHover?.(null);let changed=g.changed;
 if(g.kind==='makeup'&&g.stroke.points.length>=2)changed=commitPaint(getState(),g.stroke)||changed;
 if(g.kind==='drawing'&&g.stroke.points.length>=2&&g.travel>.012){const list=getState().room.drawing;list.push({color:g.stroke.color,eraser:g.tool==='eraser',points:g.stroke.points.slice(0,96)});if(list.length>80)list.shift();changed=true;}
 onEnd?.({kind:g.kind,tool:g.tool,changed,cancelled});return true;}
 function hover(e){if(e.isPrimary===false||e.pointerType==='touch')return false;const el=e.target?.closest?.('[data-surface]'),p=el&&point(el,e);if(!p){onHover?.(null);return false;}const kind=el.dataset.surface;onHover?.({kind,tool:getTool(kind).tool,point:p,cursorPoint:cursorPoint(el,e),surface:el,pressed:false});return true;}
 return {
 down(e){const el=e.target.closest?.('[data-surface]');if(!el)return false;if(active||e.isPrimary===false||e.button>0)return true;const p=point(el,e);if(!p)return true;const kind=el.dataset.surface,selection=getTool(kind);active={el,id:e.pointerId??1,kind,tool:selection.tool,color:selection.color??0,last:p,changed:false,travel:0,stroke:{tool:selection.tool,color:selection.color??0,...(Number.isInteger(selection.size)?{size:selection.size}:{}),points:[p]}};try{el.setPointerCapture?.(active.id);}catch{}e.preventDefault?.();onProgress?.({kind,tool:active.tool,point:p,cursorPoint:cursorPoint(el,e),stroke:null,surface:el,pressed:true});return true;},
 move(e){if(!active)return hover(e);if((e.pointerId??1)!==active.id)return true;e.preventDefault?.();const events=e.getCoalescedEvents?.()||[e];let lastPoint=null,lastEvent=e;
 for(const sample of events.length?events:[e]){const p=point(active.el,sample);if(!p){active.last=null;continue;}if(!active.last){active.last=p;continue;}const a=active.last;active.last=p;lastPoint=p;lastEvent=sample;const s=getState();
 if(active.kind==='dog'){
 if(active.tool==='pet'){const travel=strokeSamples(a,p).filter(v=>DOG_ZONES.some(z=>inside(v,z))).reduce((n,v)=>n+v.travel,0);if(travel){s.dog.affection=Math.min(100,s.dog.affection+travel*100);active.changed=true;}}
 else if(active.tool==='ball'){const samples=strokeSamples(a,p);active.travel+=samples.reduce((n,v)=>n+v.travel,0);if(!active.claimed&&active.travel>.15&&samples.some(v=>inside(v,DOG_MOUTH))){s.dog.played=Math.min(99,s.dog.played+1);active.claimed=true;active.changed=true;}}
 else if(active.tool==='food'){const samples=strokeSamples(a,p);active.travel+=samples.reduce((n,v)=>n+v.travel,0);if(active.travel>.03&&samples.some(v=>inside(v,DOG_MOUTH))&&!s.dog.fed){s.dog.fed=true;active.changed=true;}}
 else{const result=dogCare(s,active.tool,a,p);active.changed||=result.changed;if(result.blocked&&!active.warned){active.warned=true;onBlocked?.(active.tool);}}}
 else if(active.kind==='teeth')active.changed=brushTeeth(s,a,p)||active.changed;
 else if(active.kind==='makeup'){const length=paintTravel(active.tool,a,p);active.travel+=length;if(strokeSamples(a,p).length){active.stroke.points.push(p);if(active.stroke.points.length>=96){active.changed=commitPaint(s,active.stroke)||active.changed;active.stroke={tool:active.tool,color:active.color,...(Number.isInteger(active.stroke.size)?{size:active.stroke.size}:{}),points:[p]};}}}
 else if(active.kind==='drawing'){const samples=strokeSamples(a,p);active.travel+=samples.reduce((n,v)=>n+v.travel,0);if(samples.length){active.stroke.points.push(p);if(active.stroke.points.length>=96){s.room.drawing.push({color:active.color,eraser:active.tool==='eraser',points:active.stroke.points});if(s.room.drawing.length>80)s.room.drawing.shift();active.changed=true;active.stroke={tool:active.tool,color:active.color,...(Number.isInteger(active.stroke.size)?{size:active.stroke.size}:{}),points:[p]};}}}
 }
 if(lastPoint)onProgress?.({kind:active.kind,tool:active.tool,point:lastPoint,cursorPoint:cursorPoint(active.el,lastEvent),stroke:['makeup','drawing'].includes(active.kind)?active.stroke:null,surface:active.el,pressed:true});
 else onHover?.(null);return true;},
 up(e){if(active&&(e.pointerId??1)===active.id&&Number.isFinite(e.clientX))this.move(e);return end(e);},cancel:e=>end(e,true),
 leave(e){const from=e.target?.closest?.('[data-surface]'),to=e.relatedTarget?.closest?.('[data-surface]');if(!active&&from!==to)onHover?.(null);},
 finish(){if(active)end({pointerId:active.id},true);onHover?.(null);},
 get active(){return active!==null;}
 };
}
