import assert from 'node:assert/strict';
import {ROOMS,STAIR,mirrorX} from '../dist/model.js';
const r=id=>ROOMS.find(r=>r.id===id);
// Screen-right component for a horizontal viewing direction: (-forwardZ, forwardX).
const right=(dx,dz,fx,fz)=>dx*(-fz)+dz*fx;
const up={x:mirrorX(STAIR.x1)-mirrorX(STAIR.turnX),z:0};
assert(right(0,r('allrum').z-(STAIR.z0+STAIR.z1)/2,up.x,up.z)<0,'Sofa/glass must be LEFT looking upstairs (0090)');
assert(right(0,r('alcove').z-(STAIR.z0+STAIR.z1)/2,up.x,up.z)>0,'Alcove must be RIGHT looking upstairs (0090)');
assert(right(r('kitchen').x-r('hall').x,0,0,1)>0,'Kitchen must be RIGHT from playroom towards living room (0087)');
assert(r('kitchen').windows.every(w=>w.edge==='w'),'Kitchen windows must be LEFT looking from dining towards kitchen (0074)');
const bedroom=r('bedroom'),bed=bedroom.objects.find(o=>o.type==='bed');
assert(right(bed.x,0,0,1)>0,'Bedroom bed must be RIGHT looking towards its window (0109)');
assert.equal(r('alcove').slope,'s');assert.equal(r('alcove').objects.find(o=>o.type==='bed').rotation,0);
console.log('Photo orientation anchors pass: staircase, kitchen, bedroom and alcove.');
