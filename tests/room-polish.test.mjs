import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../src/state.js';
import {createDollhouseWorld,T} from '../src/dollhouse-art.js';
import {batchOrnaments} from '../src/room-polish.js';

test('decoration batching preserves transformed vertices, normals and movable groups',()=>{
 const root=new T.Group(),material=new T.MeshStandardMaterial({color:'#bf9c6d'}),g=new T.BoxGeometry(1,1,1),expected=[];
 for(let i=0;i<4;i++){const m=new T.Mesh(g,material);m.position.set(i*.3,.2,i*.15);m.scale.set(1,.5+i*.2,1.3);m.rotation.y=i*.4;m.updateMatrix();root.add(m);const p=g.attributes.position;for(let j=0;j<p.count;j++)expected.push(new T.Vector3(p.getX(j),p.getY(j),p.getZ(j)).applyMatrix4(m.matrix));}
 const moving=new T.Group();root.add(moving);batchOrnaments(root);assert.equal(root.children.length,2);assert.equal(moving.parent,root);const batch=root.children.find(o=>o.isMesh),positions=batch.geometry.attributes.position;
 for(const point of expected){let found=false;for(let i=0;i<positions.count;i++)if(new T.Vector3(positions.getX(i),positions.getY(i),positions.getZ(i)).distanceTo(point)<1e-6){found=true;break;}assert.equal(found,true);}
 for(const n of batch.geometry.attributes.normal.array)assert.ok(Number.isFinite(n));batch.geometry.dispose();g.dispose();material.dispose();
});

test('daylight responds to night and curtains and new decoration remains attached to moved furniture',()=>{
 const s=freshState(),w=createDollhouseWorld(s),bed=w.furniture.get('item-3');w.updateEnvironment(1);assert.ok(w.animated.dayPatches.every(o=>o.visible));s.dollhouse.night=true;w.updateEnvironment(1);assert.ok(w.animated.dayPatches.every(o=>!o.visible));s.dollhouse.night=false;s.dollhouse.curtains=true;w.updateEnvironment(1);assert.ok(w.animated.dayPatches.every(o=>!o.visible));
 w.scene.updateMatrixWorld(true);const child=bed.children.find(o=>o.isMesh),before=child.getWorldPosition(new T.Vector3());bed.position.x+=.5;w.scene.updateMatrixWorld(true);assert.ok(Math.abs(child.getWorldPosition(new T.Vector3()).x-before.x-.5)<1e-6);
 for(const key of ['teaStream','teapot'])assert.ok(w.animated[key].parent);assert.ok(w.animated.doors.every(o=>o.g.parent));assert.ok(w.animated.drawers.every(o=>o.g.parent));w.dispose();
});
