import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../src/state.js';
import {createDollhouseController} from '../src/dollhouse-controller.js';

function rig({fail=false,failFrame=false}={}){
 const s=freshState(),events={},queue=new Map(),nodes=new Map(),messages=[];let lost=false,created=0,disposed=0,forced=0,id=0;
 const canvas={hidden:false,getContext(){},getBoundingClientRect:()=>({left:0,top:0,width:1180,height:820}),addEventListener:(name,fn)=>events[name]=fn,removeEventListener:(name,fn)=>{if(events[name]===fn)delete events[name];},releasePointerCapture(){}};
 const node=()=>({hidden:true,textContent:'',style:{},remove(){}}),doc={querySelector:q=>{if(q==='[data-dollhouse-surface]')return canvas;if(!nodes.has(q))nodes.set(q,node());return nodes.get(q);}};
 const c=createDollhouseController({getState:()=>s,getUI:()=>({edit:false}),doc,onMessage:m=>messages.push(m),requestFrame:fn=>{queue.set(++id,fn);return id;},cancelFrame:id=>queue.delete(id),makeRenderer:()=>{created++;if(fail||lost)throw Error(fail?'deliberate renderer failure':'The WebGL context on this canvas has been lost');return{shadowMap:{},setPixelRatio(){},setSize(){},render(){if(failFrame)throw Error('deliberate first frame failure');},dispose(){disposed++;},forceContextLoss(){forced++;lost=true;}};}});
 return {c,s,canvas,events,queue,nodes,messages,get created(){return created;},get disposed(){return disposed;},get forced(){return forced;}};
}

test('a second pageshow mount keeps the existing renderer and never destroys its canvas context',()=>{
 const r=rig();r.c.mount();const w=r.c.world;r.c.mount();assert.equal(r.created,1);assert.equal(r.forced,0);assert.equal(r.c.world,w);assert.equal(r.queue.size,1);assert.equal(r.canvas.hidden,false);assert.equal(r.messages.length,0);r.c.detach();
});

test('window blur and focus pause and resume the same room without losing graphics resources',()=>{
 const r=rig();r.c.mount();const w=r.c.world;r.c.pause();assert.equal(r.queue.size,0);assert.equal(r.c.world,w);assert.equal(r.forced,0);r.c.resume();r.c.resume();assert.equal(r.created,1);assert.equal(r.queue.size,1);r.c.detach();assert.equal(r.queue.size,0);assert.equal(r.disposed,1);assert.equal(r.forced,1);assert.equal(Object.keys(r.events).length,0);
});

test('a real startup exception retains the original reason and stage instead of blaming the device',()=>{
 const r=rig({fail:true});r.c.mount();assert.equal(r.c.world,null);assert.equal(r.queue.size,0);assert.equal(r.canvas.hidden,true);assert.equal(r.nodes.get('.room-start-error').hidden,false);assert.match(r.nodes.get('[data-room-error]').textContent,/deliberate renderer failure/);assert.match(r.nodes.get('[data-room-error]').textContent,/renderer/);assert.equal(r.nodes.get('.room-fallback').hidden,false);r.c.detach();
});

test('context loss pauses the loop and restoration resumes one loop on the existing renderer',()=>{const r=rig();r.c.mount();let prevented=false;r.events.webglcontextlost({preventDefault(){prevented=true;}});assert.equal(prevented,true);assert.equal(r.queue.size,0);assert.equal(r.forced,0);r.events.webglcontextrestored();assert.equal(r.queue.size,1);assert.equal(r.created,1);assert.equal(r.nodes.get('.room-start-error').hidden,true);r.c.detach();});
test('a failure during the first frame cleans up all queued work and displays its original reason',()=>{const r=rig({failFrame:true});r.c.mount();assert.equal(r.c.world,null);assert.equal(r.queue.size,0);assert.match(r.nodes.get('[data-room-error]').textContent,/deliberate first frame failure/);assert.equal(r.disposed,1);r.c.detach();});
