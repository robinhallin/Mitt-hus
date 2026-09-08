import {ROOMS,CATALOG,LEVEL_HEIGHT as H,STAIR,dimensions,safeSpawn} from './model.js';
export const RADIUS=.17;
export const inside=(x,z,r,pad=0)=>x>=r.x-r.w/2+pad&&x<=r.x+r.w/2-pad&&z>=r.z-r.d/2+pad&&z<=r.z+r.d/2-pad;
export function stairHeight(x,z){const s=STAIR;
 if(x>=s.x0&&x<=s.turnX&&z>=s.z1&&z<=s.bottomZ)return (s.bottomZ-z)/(s.bottomZ-s.z1)*s.turnHeight;
 if(x>=s.x0&&x<=s.turnX&&z>=s.z0&&z<=s.z1)return s.turnHeight;
 if(x>=s.turnX&&x<=s.x1&&z>=s.z0&&z<=s.z1)return s.turnHeight+(x-s.turnX)/(s.x1-s.turnX)*(H-s.turnHeight);
 return null;
}
export function wallHoles(r,edge){const width=edge==='n'||edge==='s'?r.w:r.d;
 let holes=r.doors.filter(d=>d.edge===edge).map(d=>({lo:d.offset-d.width/2,hi:d.offset+d.width/2,bottom:0,top:d.open?2.68:2.12,kind:'door'}));
 holes.push(...r.windows.filter(d=>d.edge===edge).map(d=>({lo:d.offset-d.width/2,hi:d.offset+d.width/2,bottom:d.bottom??.87,top:2.2,kind:'window'})));
 if(r.id==='landing'&&edge==='w')holes.push({lo:2.3-r.z,hi:3.4-r.z,bottom:0,top:2.68,kind:'stair'});
 return holes.sort((a,b)=>a.lo-b.lo).map(h=>({...h,lo:Math.max(-width/2,h.lo),hi:Math.min(width/2,h.hi)}));
}
export function wallSegments(r,edge){const width=edge==='n'||edge==='s'?r.w:r.d;let at=-width/2,result=[];for(const h of wallHoles(r,edge)){if(h.bottom===0){if(h.lo>at)result.push([at,h.lo]);at=Math.max(at,h.hi);}}if(at<width/2)result.push([at,width/2]);return result;}
const walls=[];
for(const r of ROOMS)for(const edge of ['n','s','e','w'])for(const [lo,hi] of wallSegments(r,edge)){
 if((r.id==='hall'&&edge==='n'&&hi<0)||(r.id==='alcove'&&edge==='s')||(r.id==='allrum'&&edge==='n')){/* Rails use the same perimeter line as these walls. */}
 const horizontal=edge==='n'||edge==='s';walls.push({floor:r.floor,axis:horizontal?'z':'x',at:horizontal?r.z+(edge==='n'?-r.d/2:r.d/2):r.x+(edge==='w'?-r.w/2:r.w/2),lo:(horizontal?r.x:r.z)+lo,hi:(horizontal?r.x:r.z)+hi});
}
export const WALLS=walls;
function hitsSegment(x,z,w,radius){const along=w.axis==='x'?z:x,cross=w.axis==='x'?x:z;return Math.hypot(cross-w.at,along-Math.max(w.lo,Math.min(w.hi,along)))<radius+.055;}
export function roomAt(x,z,y){return ROOMS.find(r=>Math.abs(r.floor*H-y)<.22&&inside(x,z,r))||null;}
function objectHit(x,z,r,objects){return objects.some(o=>{if(CATALOG[o.type].flat)return false;
 const dx=x-r.x-o.x,dz=z-r.z-o.z,co=Math.cos(o.rotation),si=Math.sin(o.rotation),lx=(dx*co-dz*si)/o.scale,lz=(dx*si+dz*co)/o.scale,p=RADIUS/o.scale,c=CATALOG[o.type];
 // The U-shaped kitchen has a walkable centre, not one solid bounding box.
 if(o.type==='kitchen')return (lx>1.07-p&&lx<1.78+p&&lz>-1.4-p&&lz<1.4+p)||(Math.abs(lx)<1.78+p&&lz<-.73+p&&lz>-1.4-p)||(lx>-.48-p&&lx<1.78+p&&lz>.72-p&&lz<1.4+p);
 return Math.abs(lx)<c.w/2+p&&Math.abs(lz)<c.d/2+p;
 });}
export function walkTarget(x,z,feet,state,{ignoreObjects=false}={}){
 const sy=stairHeight(x,z);
 if(sy!==null&&Math.abs(sy-feet)<.21){
  const s=STAIR;
  // No entry through the side rail. Only the low end and upper landing connect.
  if(z<s.z0+RADIUS||x<s.x0+RADIUS)return null;
  if(x>s.turnX-RADIUS&&z>s.z1-RADIUS&&z<s.bottomZ&&x<s.x1)return null;
  if(x<s.turnX&&z>s.z1&&x>s.turnX-RADIUS)return null;
  return {x,z,y:sy,room:feet>H-.3?'landing':'hall',stairs:true};
 }
 const r=roomAt(x,z,feet);if(!r||sy!==null&&r.floor===0&&sy<1.88)return null;
 if(walls.some(w=>w.floor===r.floor&&hitsSegment(x,z,w,RADIUS)))return null;
 // Keep feet on this floor: crossing a slab edge is not a drop/teleport.
 if(Math.abs(feet-r.floor*H)>.21)return null;
 if(!ignoreObjects&&ROOMS.some(q=>q.floor===r.floor&&objectHit(x,z,q,state[q.id].objects)))return null;
 return {x,z,y:r.floor*H,room:r.id,stairs:false};
}
export function spawnIn(r,state){const p=safeSpawn(r,state[r.id].objects);for(let radius=0;radius<6;radius+=.14)for(let a=0;a<6.29;a+=.3){const x=r.x+p.x+Math.sin(a)*radius,z=r.z+p.z+Math.cos(a)*radius;if(!inside(x,z,r,.25))continue;const target=walkTarget(x,z,r.floor*H,state);if(target&&!target.stairs)return {...target,yaw:p.yaw};}throw Error('No walkable spawn in '+r.id);}
