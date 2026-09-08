// Export actual scene geometry for offline visual review; no replacement model.
import fs from 'node:fs';
import * as THREE from '../dist/vendor/three.module.js';
import {HouseWorld} from '../dist/world.js';
import {ROOMS,DEFAULT_STATE,clone} from '../dist/model.js';
global.document={createElement:()=>({width:256,height:256,getContext:()=>({fillRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){}})})};
const world=Object.create(HouseWorld.prototype);Object.assign(world,{mode:'walk',scene:new THREE.Scene(),camera:new THREE.PerspectiveCamera(68,1,.04,100),orbit:{target:new THREE.Vector3(),update(){}},objects:new Map(),rooms:new Map(),floorPlane:new THREE.Plane(new THREE.Vector3(0,1,0)),callbacks:{}});
world.load(ROOMS.find(r=>r.id==='hall'),clone(DEFAULT_STATE));world.scene.updateMatrixWorld(true);
const geometries={},materials={},meshes=[];
world.scene.traverse(o=>{if(!o.isMesh)return;const geo=o.geometry,m=o.material;if(Array.isArray(m))return;
if(!geometries[geo.uuid])geometries[geo.uuid]={positions:Array.from(geo.attributes.position.array),indices:geo.index?Array.from(geo.index.array):null};
if(!materials[m.uuid])materials[m.uuid]={color:m.color?.toArray()??[1,1,1],roughness:m.roughness??.8,metalness:m.metalness??0,opacity:m.opacity??1,emissive:m.emissive?.toArray()??[0,0,0],emissiveIntensity:m.emissiveIntensity??0};
const add=(matrix,color)=>meshes.push({geometry:geo.uuid,material:m.uuid,matrix:matrix.elements,color});
if(o.isInstancedMesh){for(let i=0;i<o.count;i++){const matrix=new THREE.Matrix4();o.getMatrixAt(i,matrix);let color=null;if(o.instanceColor){const c=new THREE.Color();o.getColorAt(i,c);color=c.toArray();}add(o.matrixWorld.clone().multiply(matrix),color);}}else add(o.matrixWorld);
});
fs.writeFileSync(process.argv[2],JSON.stringify({geometries,materials,meshes}));console.log('Exported',meshes.length,'actual scene meshes');
