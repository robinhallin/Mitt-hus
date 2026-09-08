import assert from 'node:assert/strict';
import {ROOMS,DEFAULT_STATE,LEVEL_HEIGHT,OPENINGS,validateState,clone} from '../dist/model.js';
import {walkTarget,spawnIn,stairHeight} from '../dist/navigation.js';
const state=validateState({version:2,rooms:clone(DEFAULT_STATE)}),step=.1,key=p=>`${Math.round(p.x/step)},${Math.round(p.z/step)},${Math.round(p.y*100)}`;
function flood(start){const q=[start],seen=new Set([key(start)]),rooms=new Map(),prev=new Map();for(let n=0;n<q.length;n++){const p=q[n];if(p.room)rooms.set(p.room,(rooms.get(p.room)||0)+1);for(const [dx,dz] of [[step,0],[-step,0],[0,step],[0,-step]]){const next=walkTarget(Math.round((p.x+dx)*10)/10,Math.round((p.z+dz)*10)/10,p.y,state);if(!next)continue;const k=key(next);if(seen.has(k))continue;seen.add(k);prev.set(k,p);q.push(next);}}return {seen,q,rooms,prev};}
const start=walkTarget(3.3,4.5,0,state);assert(start);const out=flood(start);console.log('Reachable metres-grid cells',out.q.length,'rooms',Object.fromEntries(out.rooms));
for(const r of ROOMS){assert(out.rooms.has(r.id),`Unreachable room ${r.id}`);const s=spawnIn(r,state);assert(walkTarget(s.x,s.z,s.y,state),`Invalid spawn ${r.id}`);}
// Find a continuous route to the upstairs landing, then walk it backwards.
const end=out.q.find(p=>p.room==='landing'&&p.y===LEVEL_HEIGHT);assert(end,'Staircase never reaches upper floor');let route=[end],p=end;while(out.prev.has(key(p))){p=out.prev.get(key(p));route.push(p);}route.reverse();for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i];assert(walkTarget(b.x,b.z,a.y,state),'Blocked ascent');assert(walkTarget(a.x,a.z,b.y,state),'Blocked descent');assert(Math.abs(a.y-b.y)<.21,'Height jump');}console.log('Stair route: both directions pass,',route.length,'steps.');
// Shared door endpoints are genuinely on both room boundaries.
for(const d of OPENINGS)for(const id of [d.a,d.b]){const r=ROOMS.find(r=>r.id===id),center=d.axis==='x'?r.x:r.z,span=d.axis==='x'?r.w:r.d;assert(Math.abs(Math.abs(d.at-center)-span/2)<1e-8,`Door outside ${id}`);}
console.log('All shared door boundaries match.');
