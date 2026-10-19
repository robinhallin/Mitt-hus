import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,normalizeState,saveLook,wearLook} from '../src/state.js';
import {chooseAccessory,ACCESSORY_SLOTS,leaAccessories} from '../src/accessories.js';
import {PORTRAIT_ASPECT,faceToPortrait,portraitToFace,MAKEUP_VIEW,LEA_FACE_FRAME} from '../src/portrait-geometry.js';
import {createTouchController} from '../src/touch-controller.js';
import {lookCards,tryPlayLook} from '../src/wardrobe.js';
import {resetCare,commitPaint} from '../src/touch.js';
import {makeupPaint} from '../src/paint-art.js';

test('full-head mirror preserves facial coordinates under tablet rotation and letterboxing',()=>{
 for(const rect of [{left:13,top:25,width:900,height:400},{left:20,top:10,width:330,height:650}]){
 const s=freshState(),el={dataset:{surface:'makeup',aspect:String(PORTRAIT_ASPECT),coordinateFrame:'portrait'},getBoundingClientRect:()=>rect};
 const controller=createTouchController({getState:()=>s,getTool:()=>({tool:'lips',color:2,size:2})});
 let w=rect.width,h=rect.height;if(w/h>PORTRAIT_ASPECT)w=h*PORTRAIT_ASPECT;else h=w/PORTRAIT_ASPECT;
 const event=p=>{const q=faceToPortrait(p);return{target:{closest:()=>el},pointerId:1,button:0,clientX:rect.left+(rect.width-w)/2+q.x*w,clientY:rect.top+(rect.height-h)/2+q.y*h};};
 controller.down(event({x:.43,y:.615}));controller.move(event({x:.54,y:.615}));controller.up(event({x:.54,y:.615}));
 assert.equal(s.touch.paint.length,1);assert.ok(Math.abs(s.touch.paint[0].points[0].x-.43)<1e-10);assert.equal(s.touch.paint[0].size,2);
 }
 for(const p of [{x:0,y:0},{x:.5,y:.5},{x:1,y:1}]){const q=portraitToFace(faceToPortrait(p));assert.ok(Math.abs(q.x-p.x)<1e-12&&Math.abs(q.y-p.y)<1e-12);}
 assert.ok(MAKEUP_VIEW.y<0);assert.ok(MAKEUP_VIEW.y+MAKEUP_VIEW.h>LEA_FACE_FRAME.y+LEA_FACE_FRAME.h);
});
test('all accessory slots are validated, can be removed and round-trip with old bow saves',()=>{
 const s=freshState();for(const [slot,ids] of Object.entries(ACCESSORY_SLOTS)){for(const id of ids){assert.equal(chooseAccessory(s,slot,id),true);assert.equal(normalizeState(s).lea[slot],id);}assert.equal(chooseAccessory(s,slot,'<script>'),false);}
 assert.equal(chooseAccessory(s,'__proto__','sunhat'),false);
 const old=normalizeState({version:1,lea:{bow:true}});assert.equal(old.lea.hairclip,'bow');assert.equal(old.lea.bow,true);chooseAccessory(old,'hairclip','none');assert.equal(normalizeState(old).lea.bow,false);
});
test('six saved styles are independent snapshots and restore the complete painted look',()=>{
 const s=freshState();tryPlayLook(s,'party');commitPaint(s,{tool:'flowers',color:2,size:2,points:[{x:.24,y:.5},{x:.34,y:.5}]});assert.equal(saveLook(s),true);
 const id=s.looks[0].id,first=structuredClone(s.looks[0]);s.lea.headwear='cat';s.touch.paint[0].points[0].x=.6;assert.deepEqual(s.looks[0],first);
 assert.equal(wearLook(s,id),true);assert.equal(s.lea.headwear,'crown');assert.equal(s.touch.paint[0].points[0].x,.24);
 for(let i=0;i<5;i++)assert.equal(saveLook(s),true);assert.equal(saveLook(s),false);const n=normalizeState(s);assert.deepEqual(n.looks,s.looks);assert.equal(n.nextLookId,s.nextLookId);
 s.looks=s.looks.filter(v=>v.id!==id);assert.equal(wearLook(s,id),false);
});
test('saved style thumbnails have independent SVG definitions and local references',()=>{
 const s=freshState();for(const id of ['flowers','party','picnic','cozy']){tryPlayLook(s,id);saveLook(s);}const html=lookCards(s),ids=[...html.matchAll(/id="([^"]+)"/g)].map(v=>v[1]);assert.equal(new Set(ids).size,ids.length);for(const ref of html.matchAll(/url\(#([^)]+)\)/g))assert.ok(ids.includes(ref[1]),ref[1]);assert.doesNotMatch(html,/undefined|NaN/);
});
test('decorative paint keeps real gesture positions, size and local erasing after reload',()=>{
 const s=freshState();assert.equal(commitPaint(s,{tool:'hearts',size:0,color:1,points:[{x:.23,y:.5},{x:.34,y:.5}]}),true);assert.equal(commitPaint(s,{tool:'flowers',size:2,color:2,points:[{x:.45,y:.18},{x:.55,y:.18}]}),true);assert.equal(commitPaint(s,{tool:'eraser',size:2,color:0,points:[{x:.24,y:.5},{x:.29,y:.5}]}),true);const n=normalizeState(s);assert.deepEqual(n.touch.paint,s.touch.paint);assert.match(makeupPaint(n),/face-hearts/);assert.match(makeupPaint(n),/mask=/);
});
test('new play session resets cuddling and ball play while preserving Sigge accessories',()=>{const s=freshState();s.dog.affection=100;s.dog.played=5;s.dog.accessory='bandana';resetCare(s);assert.equal(s.dog.affection,0);assert.equal(s.dog.played,0);assert.equal(s.dog.accessory,'bandana');});
test('untrusted saved styles are bounded and cannot inject accessory markup',()=>{const n=normalizeState({version:1,looks:[{id:'evil',lea:{}},...Array.from({length:12},(_,i)=>({id:`look-${i+1}`,lea:{headwear:'<svg>',bag:'__proto__'},paint:[{tool:'<script>',color:0,points:[]}]}))]});assert.ok(n.looks.length<=6);for(const look of n.looks){assert.equal(look.lea.headwear,'none');assert.equal(look.lea.bag,'none');assert.equal(look.paint.length,0);assert.doesNotMatch(leaAccessories(look.lea),/script|__proto__/);}});

test('all room ideas use existing furniture, respect placement limits and survive reload',async()=>{const {ROOM_IDEAS,tryRoomIdea}=await import('../src/world.js');for(const id of Object.keys(ROOM_IDEAS)){const s=freshState();assert.equal(tryRoomIdea(s,id),true);assert.equal(s.room.furniture.length,ROOM_IDEAS[id].items.length);assert.deepEqual(normalizeState(s).room.furniture,s.room.furniture);}const s=freshState(),before=structuredClone(s.room.furniture);assert.equal(tryRoomIdea(s,'__proto__'),false);assert.deepEqual(s.room.furniture,before);});

test('small-feature guidance accepts nearby finger strokes without painting distant parts',async()=>{const {guidePaintPoint,faceHit}=await import('../src/touch.js');const near={x:.49,y:.695},guided=guidePaintPoint('lips',near);assert.equal(faceHit('lips',near),false);assert.equal(faceHit('lips',guided),true);const far={x:.1,y:.1};assert.deepEqual(guidePaintPoint('lips',far),far);assert.deepEqual(guidePaintPoint('eraser',near),near);});
