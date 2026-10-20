import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState} from '../src/state.js';
import {createTouchController} from '../src/touch-controller.js';
import {undoPaint,DOG_ZONES} from '../src/touch.js';
import {careTarget,careGuidance} from '../src/care-studio.js';
import {dogTouchView,makeupTouchView} from '../src/touch-views.js';

function fixture(kind='dog',aspect='1',rect={left:0,top:0,width:100,height:100}){
 const state=freshState(),hover=[],progress=[],ends=[];let captured=false;
 const surface={dataset:{surface:kind,aspect},getBoundingClientRect:()=>rect,setPointerCapture(){captured=true;},hasPointerCapture:()=>captured,releasePointerCapture(){captured=false;controller.cancel({pointerId:1});}};
 const target={closest:s=>s==='[data-surface]'?surface:null};
 const controller=createTouchController({getState:()=>state,getTool:()=>({tool:kind==='dog'?'brush':'lips',color:2}),onHover:x=>hover.push(x),onProgress:x=>progress.push(x),onEnd:x=>ends.push(x)});
 const e=(x,y,extra={})=>({target,pointerId:1,pointerType:'mouse',isPrimary:true,button:0,clientX:x,clientY:y,preventDefault(){},...extra});
 return {state,hover,progress,ends,surface,target,controller,e};
}
test('mouse and hovering pen show their tool without a button press or any earned progress',()=>{
 for(const kind of ['dog','makeup','teeth','drawing']){const f=fixture(kind);f.controller.move(f.e(43,61.5));assert.equal(f.hover.at(-1).pressed,false);assert.equal(f.hover.at(-1).surface,f.surface);f.controller.move(f.e(44,61.5,{pointerType:'pen'}));assert.equal(f.hover.length,2);assert.equal(f.progress.length,0);assert.deepEqual(f.state,freshState());f.controller.leave({target:f.target,relatedTarget:{closest:()=>null}});assert.equal(f.hover.at(-1),null);}
});
test('hover ignores a second finger, touch hover, letterbox padding and unrelated surfaces',()=>{
 const f=fixture('dog','1',{left:10,top:20,width:1000,height:500});
 f.controller.move(f.e(510,270));assert.deepEqual(f.hover.at(-1).point,{x:.5,y:.5});assert.deepEqual(f.hover.at(-1).cursorPoint,{x:.5,y:.5});const n=f.hover.length;
 f.controller.move(f.e(510,270,{isPrimary:false}));f.controller.move(f.e(510,270,{pointerType:'touch'}));assert.equal(f.hover.length,n);
 f.controller.move(f.e(30,270));assert.equal(f.hover.at(-1),null);f.controller.move(f.e(510,270,{target:{closest:()=>null}}));assert.equal(f.hover.at(-1),null);
});
test('release records its final endpoint once even when capture release dispatches lostpointercapture',()=>{
 const f=fixture('makeup');f.controller.down(f.e(43,61.5));f.controller.up(f.e(54,61.5));assert.equal(f.state.touch.paint.length,1);assert.equal(f.ends.length,1);assert.equal(f.ends[0].cancelled,false);assert.equal(f.controller.active,false);assert.deepEqual(f.state.touch.paint[0].points.at(-1),{x:.54,y:.615});
});
test('a canceled gesture keeps useful work once and permits another finger gesture immediately',()=>{
 const f=fixture();const z=DOG_ZONES[1];f.controller.down(f.e((z.x-.04)*100,z.y*100));f.controller.move(f.e((z.x+.04)*100,z.y*100));f.controller.cancel({pointerId:1});const prior=f.state.touch.brush[1];assert.ok(prior>0);assert.equal(f.ends.length,1);f.controller.down(f.e((z.x-.04)*100,z.y*100));f.controller.up(f.e((z.x+.04)*100,z.y*100));assert.ok(f.state.touch.brush[1]>prior);assert.equal(f.ends.length,2);
});
test('care guides use the same exact character regions and point out the next unfinished part',()=>{
 const s=freshState();for(const tool of ['brush','soap','rinse','dry']){for(let i=0;i<5;i++){const z=DOG_ZONES[i];assert.equal(careTarget(s,tool,z).index,i);assert.match(careGuidance(s,tool),new RegExp('translate\\('+z.x*1024+' '+z.y*1024+'\\)'));}s.touch[tool][0]=100;assert.match(careGuidance(s,tool),/data-care-target="1" class="care-target is-next /);}
 assert.equal(careTarget(freshState(),'rinse',DOG_ZONES[0]).ready,false);assert.equal(careTarget(freshState(),'dry',DOG_ZONES[0]).ready,false);assert.equal(careTarget(s,'dry',DOG_ZONES[0]).ready,true);assert.equal(careTarget(s,'brush',{x:.01,y:.01}).index,-1);
});
test('undo preserves the colors of the remaining face strokes and guidance survives the first stroke',()=>{
 const s=freshState();s.touch.paint=[{tool:'lips',color:1,points:[{x:.45,y:.61},{x:.5,y:.61}]},{tool:'eyes',color:2,points:[{x:.4,y:.33},{x:.43,y:.33}]}];s.makeup={lips:1,eyes:2,cheeks:null};undoPaint(s);assert.deepEqual(s.makeup,{lips:1,eyes:null,cheeks:null});assert.match(makeupTouchView(s,'eyes',0),/class="face-guide"/);
});
test('all care tools have a visible illustrated tool; style mode offers no inactive care surface',()=>{
 const s=freshState();for(const tool of ['brush','soap','rinse','dry','food','pet','ball']){const html=dogTouchView(s,tool,{tab:['soap','rinse','dry'].includes(tool)?'bath':'care'});assert.match(html,/class="tool-picture"/);assert.match(html,/data-care-target="0"/);assert.match(html,/data-care-hint/);assert.doesNotMatch(html,/undefined|NaN/);}const style=dogTouchView(s,'brush',{tab:'style'});assert.doesNotMatch(style,/data-surface="dog"|class="finger-tool"|class="care-guidance"/);
 const css=['style.css','playful.css','care-studio.css'].map(p=>readFileSync(new URL('../src/'+p,import.meta.url),'utf8')).join('');assert.doesNotMatch(css,/cursor:\s*none/);
});
