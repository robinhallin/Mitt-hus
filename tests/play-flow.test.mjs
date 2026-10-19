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
test('pointer dragging sorts an object and a cancelled drag leaves it in play',()=>{
 click('go','tidy');click('reset','tidy');
 const drop={dataset:{drop:'toys'},classList:{add(){},remove(){}}};
 document.elementFromPoint=()=>({closest:s=>s==='[data-drop]'?drop:null});
 const target={closest:s=>s==='[data-draggable]'?{dataset:{draggable:'bear'}}:null};
 handlers.pointerdown({target,clientX:10,clientY:10});
 handlers.pointermove({target,clientX:80,clientY:120,preventDefault(){}});
 const pending=[],timer=globalThis.setTimeout;globalThis.setTimeout=f=>{pending.push(f);return 0;};
 try{windowHandlers.pointerup({clientX:80,clientY:120});}finally{globalThis.setTimeout=timer;}
 pending.forEach(fn=>fn());assert.deepEqual(saved().tidy,['bear']);
 handlers.pointerdown({target:{closest:s=>s==='[data-draggable]'?{dataset:{draggable:'ball'}}:null},clientX:10,clientY:10});
 handlers.pointercancel?.({});windowHandlers.pointercancel();assert.deepEqual(saved().tidy,['bear']);
 document.elementFromPoint=()=>null;
});
test('scrubbing resolves the tooth under a captured touch pointer',()=>{
 click('go','teeth');click('reset','teeth');
 let hitIndex=1;const stage={dataset:{scrub:'teeth'}};
 document.elementFromPoint=()=>({closest:s=>s==='[data-scrub]'?stage:s==='[data-action="tooth"]'?{dataset:{value:String(hitIndex)}}:null});
 const staleTarget={closest:()=>null},now=Date.now;let tick=10000;Date.now=()=>tick+=150;
 try{handlers.pointermove({target:staleTarget,buttons:1,clientX:100,clientY:150});hitIndex=2;handlers.pointermove({target:staleTarget,buttons:1,clientX:130,clientY:150});}finally{Date.now=now;document.elementFromPoint=()=>null;}
 assert.equal(saved().teeth[1],true);assert.equal(saved().teeth[2],true);assert.equal(saved().teeth[0],false);
});
test('expanded wardrobe renders real patterns and accessories',()=>{click('go','dress');click('outfit','overalls');click('bottom','4');click('pattern','stars');click('headwear','sunhat');assert.equal(saved().lea.outfit,'overalls');assert.equal(saved().lea.bottom,4);assert.equal(saved().lea.pattern,'stars');assert.equal(saved().lea.headwear,'sunhat');assert.match(app.innerHTML,/clothing-pattern/);assert.match(app.innerHTML,/#e9d1a0/);for(const scene of ['furnish','adventures','garden']){click('go',scene);assert.doesNotMatch(app.innerHTML,/undefined|NaN/);}});
test('furniture can be added, moved without dragging, recolored, flipped, removed and restored',()=>{click('go','furnish');const n=saved().room.furniture.length;click('add-furniture','chair');assert.equal(saved().room.furniture.length,n+1);const id=saved().room.furniture.at(-1).id;click('furniture-color','2');click('flip-furniture');click('nudge-furniture','left');let item=saved().room.furniture.find(v=>v.id===id);assert.equal(item.color,2);assert.equal(item.flip,true);assert.equal(item.x,47);click('remove-furniture');assert.equal(saved().room.furniture.length,n);click('undo-furniture');assert.equal(saved().room.furniture.length,n+1);click('go','home');assert.match(app.innerHTML,/placed-furniture/);});
test('picnic flows through clothes, garden, food and finale; replay keeps the memory',()=>{click('choose-adventure','picnic');click('continue-adventure');assert.match(app.innerHTML,/Min garderob/);click('finish-outfit');assert.equal(saved().adventures.progress.picnic.step,1);click('continue-adventure');assert.match(app.innerHTML,/garden-scene/);for(const id of ['apple','ball','flower'])click('garden-find',id);assert.equal(saved().adventures.progress.picnic.step,2);click('continue-adventure');click('pet');assert.equal(saved().adventures.progress.picnic.step,3);click('continue-adventure');click('finish-adventure');assert.ok(saved().adventures.completed.includes('picnic'));assert.match(app.innerHTML,/Ni hittar en skön plats/);click('replay-adventure','picnic');assert.equal(saved().adventures.progress.picnic.step,0);assert.ok(saved().adventures.completed.includes('picnic'));});
test('party flows through decorating, brushing, clothes and celebration',()=>{click('choose-adventure','party');click('continue-adventure');click('place-sticker');assert.equal(saved().adventures.progress.party.step,1);click('continue-adventure');assert.equal(saved().dog.brushed,0);for(let i=0;i<10;i++)click('pet');assert.equal(saved().adventures.progress.party.step,2);click('continue-adventure');click('finish-outfit');click('continue-adventure');click('finish-adventure');assert.ok(saved().adventures.completed.includes('party'));});
test('evening flows through sorting, furnishing, teeth and bedtime without losing earlier memories',()=>{click('choose-adventure','evening');click('continue-adventure');assert.equal(saved().tidy.length,0);for(const toy of TOYS){click('toy',toy.id);click('box',toy.box);}assert.equal(saved().adventures.progress.evening.step,1);click('continue-adventure');const id=saved().room.furniture[0].id;click('select-furniture',id);click('nudge-furniture','right');assert.equal(saved().adventures.progress.evening.step,2);click('continue-adventure');assert.ok(saved().teeth.every(v=>!v));for(let i=0;i<8;i++)click('tooth',String(i));assert.equal(saved().adventures.progress.evening.step,3);click('continue-adventure');click('finish-adventure');assert.deepEqual(saved().adventures.completed,['picnic','party','evening']);click('go','album');assert.match(app.innerHTML,/äventyrsminne/);});
test('furniture drag preserves grab offset, saves on release, supports undo and cancels safely',()=>{
 click('go','furnish');const item=saved().room.furniture[0],original=document.querySelector,element={style:{}};
 document.querySelector=s=>s==='.furnish-canvas'?{getBoundingClientRect:()=>({left:0,top:0,width:1000,height:500})}:s===`[data-furniture="${item.id}"]`?element:original(s);
 const target={closest:s=>s==='[data-furniture]'?{dataset:{furniture:item.id}}:null};
 handlers.pointerdown({target,clientX:100,clientY:100});handlers.pointermove({target,clientX:200,clientY:120,preventDefault(){}});
 assert.equal(saved().room.furniture[0].x,item.x);assert.equal(element.style.left,(item.x+10)+'%');
 const callbacks=[],timer=globalThis.setTimeout;globalThis.setTimeout=f=>{callbacks.push(f);return 0;};
 try{windowHandlers.pointerup({clientX:200,clientY:120});}finally{globalThis.setTimeout=timer;}
 callbacks.forEach(fn=>fn());assert.equal(saved().room.furniture[0].x,item.x+10);assert.equal(saved().room.furniture[0].y,item.y+4);
 click('undo-furniture');assert.deepEqual(saved().room.furniture[0],item);
 handlers.pointerdown({target,clientX:100,clientY:100});handlers.pointermove({target,clientX:200,clientY:120,preventDefault(){}});windowHandlers.pointercancel();
 assert.deepEqual(saved().room.furniture[0],item);document.querySelector=original;
});
