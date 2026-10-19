import test from 'node:test';
import assert from 'node:assert/strict';
import { SAVE_KEY, TOYS } from '../src/state.js';
// Exercise the real application event handlers and rendered markup without a browser dependency.
const handlers={},windowHandlers={},data=new Map();
const app={innerHTML:'',addEventListener:(k,fn)=>handlers[k]=fn};
const dummy={textContent:'',classList:{add(){},remove(){}},style:{},append(){},remove(){},focus(){},replaceChildren(){}};
globalThis.document={querySelector:s=>s==='#app'?app:dummy,querySelectorAll:()=>[],createElement:()=>({...dummy,style:{}}),createTextNode:x=>x,body:{append(){}},elementFromPoint:()=>null};
globalThis.window={localStorage:{getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)},addEventListener:(k,fn)=>windowHandlers[k]=fn};
const originalSetTimeout=globalThis.setTimeout;
globalThis.setTimeout=()=>0;
await import('../src/app.js');
globalThis.setTimeout=originalSetTimeout;
// Test-time animations finish immediately; game state and handler code stay real.
function click(action,value='',other={}){
 const el={dataset:{action,value}};
 const target={closest:selector=>selector==='[data-action]'?el:selector==='.craft-wall'?{getBoundingClientRect:()=>({left:0,top:0,width:500,height:500})}:null};
 const timer=globalThis.setTimeout;globalThis.setTimeout=()=>0;
 try{handlers.click({target,clientX:200,clientY:200,...other});}finally{globalThis.setTimeout=timer;}
}
const saved=()=>JSON.parse(data.get(SAVE_KEY));
test('welcome enters the real room and all seven navigation views render',()=>{assert.match(app.innerHTML,/Nu leker vi/);click('enter');assert.match(app.innerHTML,/VÄLKOMMEN HEM/);for(const scene of ['dress','makeup','craft','tidy','dog','teeth','album','home']){click('go',scene);assert.match(app.innerHTML,/game-shell/);assert.doesNotMatch(app.innerHTML,/undefined|NaN/);}assert.equal(saved().entered,true);});
test('wardrobe choices change SVG colors, hair, outfit and saved character',()=>{click('go','dress');click('top','2');click('outfit','trousers');click('hairstyle','pigtails');click('hair','3');click('bow');click('shoes','2');assert.match(app.innerHTML,/#71b5ac/);assert.equal(saved().lea.outfit,'trousers');assert.equal(saved().lea.hairstyle,'pigtails');assert.equal(saved().lea.bow,true);click('finish-outfit');assert.ok(saved().done.includes('outfit'));});
test('makeup requires applying the selected color and can be washed off',()=>{click('go','makeup');click('makeup-tool','lips');click('makeup-color','3');assert.equal(saved().makeup.lips,null);click('apply-makeup');assert.equal(saved().makeup.lips,3);assert.ok(saved().done.includes('makeup'));click('clear-makeup');assert.deepEqual(saved().makeup,{lips:null,cheeks:null,eyes:null});});
test('tap sorting rejects the wrong destination and completes all six objects',()=>{click('go','tidy');click('toy','bear');click('box','books');assert.equal(saved().tidy.length,0);for(const toy of TOYS){click('toy',toy.id);click('box',toy.box);}assert.ok(saved().done.includes('tidy'));assert.match(app.innerHTML,/Vilket mysigt rum/);click('reset','tidy');assert.equal(saved().tidy.length,0);assert.ok(saved().done.includes('tidy'));});
test('all dog activities and collars update through the UI',()=>{click('go','dog');click('dog-tool','brush');for(let i=0;i<10;i++)click('pet');assert.equal(saved().dog.brushed,100);click('dog-tool','wash');for(let i=0;i<5;i++)click('mud',String(i));assert.ok(saved().dog.clean.every(Boolean));click('dog-tool','food');click('pet');assert.equal(saved().dog.fed,true);click('collar','2');assert.equal(saved().dog.collar,'#9293cf');click('reset','dog');assert.equal(saved().dog.brushed,0);assert.ok(saved().done.includes('wash'));});
test('teeth complete and replay preserves the earned memory',()=>{click('go','teeth');for(let i=0;i<8;i++)click('tooth',String(i));assert.ok(saved().teeth.every(Boolean));assert.ok(saved().done.includes('teeth'));click('reset','teeth');assert.ok(saved().teeth.every(v=>!v));assert.ok(saved().done.includes('teeth'));});
test('room decorations are placed, bounded, saved and removable',()=>{click('go','craft');click('wall','3');click('sticker','rainbow');click('place-sticker');assert.equal(saved().room.wall,3);assert.deepEqual(saved().room.stickers,[{icon:'rainbow',x:40,y:40}]);assert.ok(saved().done.includes('craft'));click('go','home');assert.match(app.innerHTML,/wall-sticker/);click('go','craft');click('remove-sticker','0');assert.deepEqual(saved().room.stickers,[]);});
test('sound and help controls are usable without speech services',()=>{click('sound');assert.equal(saved().sound,false);click('help');click('sound');assert.equal(saved().sound,true);});
