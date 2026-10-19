import test from 'node:test';
import assert from 'node:assert/strict';
import {access} from 'node:fs/promises';
import {freshState,normalizeState} from '../src/state.js';
import {identityAvatar} from '../src/avatar.js';
import {paintFace} from '../src/paint-art.js';
import {leaSprite,LEA_FACE_SOURCE} from '../src/lea-appearance.js';
import {DOG_MOUTH,DOG_ZONES,DOG_VIEW} from '../src/character-layout.js';
import {createTouchController} from '../src/touch-controller.js';

test('all 180 outfit, hairstyle, hair color and headwear combinations have complete assets and consistent portraits',async()=>{
 const s=freshState();s.lea.bow=true;
 for(const outfit of ['skirt','trousers','dress','overalls','pajamas'])for(const hairstyle of ['loose','ponytail','pigtails'])for(let hair=0;hair<4;hair++)for(const headwear of ['none','crown','sunhat']){
 Object.assign(s.lea,{outfit,hairstyle,hair,headwear});const sprite=leaSprite(s.lea),avatar=identityAvatar(s),portrait=paintFace(s);
 assert.ok(avatar.includes(`href="${sprite}"`));assert.ok(portrait.includes(`href="${sprite}"`));assert.ok(avatar.includes(LEA_FACE_SOURCE));assert.ok(portrait.includes(LEA_FACE_SOURCE));assert.doesNotMatch(avatar+portrait,/undefined|NaN|extra-hair/);
 for(const path of new Set([...avatar.matchAll(/href="(\.\/[^\"]+)"/g)].map(v=>v[1])))await access(path);
 }
});
test('clothing and hairstyle changes preserve painted strokes and survive reload',()=>{
 const s=freshState();s.touch.paint=[{tool:'lips',color:2,points:[{x:.43,y:.615},{x:.54,y:.615}]}];
 Object.assign(s.lea,{outfit:'overalls',hairstyle:'ponytail',headwear:'sunhat',hair:2,bow:true});const n=normalizeState(JSON.parse(JSON.stringify(s)));
 assert.deepEqual(n.lea,s.lea);assert.deepEqual(n.touch.paint,s.touch.paint);assert.match(identityAvatar(n),/avatar-lips/);assert.match(paintFace(n),/face-lips/);
});
test('food must reach the new illustrated mouth, not an old body location or a stationary touch',()=>{
 const s=freshState(),w=600,h=w/DOG_VIEW.aspect,surface={dataset:{surface:'dog',aspect:String(DOG_VIEW.aspect)},getBoundingClientRect:()=>({left:0,top:0,width:w,height:h})},target={closest:()=>surface};
 const controller=createTouchController({getState:()=>s,getTool:()=>({tool:'food'})});
 const e=(x,y)=>({target,pointerId:1,button:0,clientX:x*w,clientY:y*h});
 controller.down(e(DOG_MOUTH.x,DOG_MOUTH.y));controller.up(e(DOG_MOUTH.x,DOG_MOUTH.y));assert.equal(s.dog.fed,false);
 const chest=DOG_ZONES[1];controller.down(e(chest.x-.08,chest.y));controller.move(e(chest.x+.08,chest.y));controller.up(e(chest.x+.08,chest.y));assert.equal(s.dog.fed,false);
 controller.down(e(DOG_MOUTH.x-.15,DOG_MOUTH.y));controller.move(e(DOG_MOUTH.x,DOG_MOUTH.y));controller.up(e(DOG_MOUTH.x,DOG_MOUTH.y));assert.equal(s.dog.fed,true);
});
