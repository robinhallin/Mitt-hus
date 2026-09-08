import * as THREE from './vendor/three.module.js';
import {OrbitControls} from './vendor/OrbitControls.js';
import {RoundedBoxGeometry} from './vendor/RoundedBoxGeometry.js';
import {CATALOG,ROOMS,LEVEL_HEIGHT as H,STAIR,constrain} from './model.js';
import {wallHoles,walkTarget,spawnIn,roomAt,stairHeight} from './navigation.js';

const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.78,...extra});
const white=mat('#efeee7'),wood=mat('#b7905e'),black=mat('#303a3c'),metal=mat('#abb8b9',{metalness:.65,roughness:.3}),leaf=mat('#54765c');
const baseGeo=new THREE.BoxGeometry(1,1,1),ballGeo=new THREE.SphereGeometry(1,12,8);
function box(g,x,y,z,w,h,d,m,r=0){const mesh=new THREE.Mesh(r?new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/3,h/3,d/3)):baseGeo,m);if(!r)mesh.scale.set(w,h,d);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh;}
function batchMeshes(root){
 for(const child of [...root.children])if(child.isGroup)batchMeshes(child);
 const groups=new Map();for(const child of root.children){if(!child.isMesh||child.isInstancedMesh||![baseGeo,ballGeo].includes(child.geometry))continue;const key=child.geometry.uuid+child.material.uuid;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(child);}
 for(const list of groups.values()){if(list.length<3)continue;const batch=new THREE.InstancedMesh(list[0].geometry,list[0].material,list.length);batch.castShadow=list[0].castShadow;batch.receiveShadow=list[0].receiveShadow;list.forEach((mesh,i)=>{mesh.updateMatrix();batch.setMatrixAt(i,mesh.matrix);root.remove(mesh);});batch.computeBoundingSphere();root.add(batch);}
}
function cylinder(g,x,y,z,rt,rb,h,m,n=20){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,n),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh;}
function ellipsoid(g,x,y,z,sx,sy,sz,m){const mesh=new THREE.Mesh(ballGeo,m);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;g.add(mesh);return mesh;}
function legs(g,w,d,h,m=wood){for(const x of [-1,1])for(const z of [-1,1])box(g,x*(w/2-.09),h/2,z*(d/2-.08),.055,h,.055,m);}
function label(text){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;const ctx=canvas.getContext('2d');ctx.fillStyle='#243b40';ctx.fillRect(0,0,512,96);ctx.fillStyle='#f5f7ec';ctx.font='500 35px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,50,480);const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(.86,.16),new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide}));return mesh;}
export function furniture(obj){const c=CATALOG[obj.type],g=new THREE.Group(),m=mat(obj.color),w=c.w,d=c.d;
 switch(obj.type){
 case 'sofa':case 'armchair':{
  legs(g,w,d,.2,black);box(g,0,.34,0,w,.32,d,m,.08);box(g,0,.72,-d/2+.1,w,.69,.24,m,.07);
  const count=obj.type==='sofa'?3:1;for(let i=0;i<count;i++)box(g,-w/2+.2+(w-.4)*(i+.5)/count,.57,.07,(w-.45)/count-.02,.19,d-.29,m,.055);
  for(const x of [-1,1])box(g,x*(w/2-.1),.66,.01,.21,.55,d,m,.055);
  if(obj.type==='sofa'){const p1=box(g,-w/2+.5,.8,-.22,.36,.36,.13,mat('#d5c6a9'),.045);p1.rotation.z=.2;const p2=box(g,w/2-.5,.8,-.22,.36,.36,.13,mat('#bac3b4'),.045);p2.rotation.z=-.2;}
  break;}
 case 'officechair':{
 cylinder(g,0,.26,0,.03,.035,.4,metal);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;beam(g,[0,.1,0],[Math.sin(a)*.29,.07,Math.cos(a)*.29],.035,metal);ellipsoid(g,Math.sin(a)*.29,.04,Math.cos(a)*.29,.035,.04,.035,black);}box(g,0,.48,0,.55,.13,.52,m,.06);const back=box(g,0,.75,-.22,.53,.6,.1,m,.05);back.rotation.x=-.12;break;}
 case 'pedestal':{cylinder(g,0,.56,0,.275,.275,.025,m,40);cylinder(g,0,.28,0,.028,.045,.54,m);cylinder(g,0,.025,0,.2,.21,.035,m,32);break;}
 case 'ovalcot':{
 const rim=(y)=>{const points=[];for(let i=0;i<=64;i++){const a=i*Math.PI*2/64;points.push(new THREE.Vector3(Math.cos(a)*w/2,y,Math.sin(a)*d/2));}const curve=new THREE.CatmullRomCurve3(points);const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,64,.02,6,false),m);g.add(mesh);};rim(.23);rim(.85);for(let i=0;i<30;i++){const a=i*Math.PI*2/30;box(g,Math.cos(a)*w/2,.54,Math.sin(a)*d/2,.018,.62,.018,m);}const mattress=cylinder(g,0,.29,0,.5,.5,.09,white,48);mattress.scale.set(w,1,d);legs(g,w*.8,d*.8,.22,m);break;}
 case 'bed':{
  legs(g,w,d,.15);box(g,0,.28,0,w,.35,d,m,.055);box(g,0,.49,0,w-.04,.2,d-.04,white,.08);box(g,0,.615,.24,w-.07,.12,d-.62,m,.07);box(g,0,.49,-d/2+.05,w,.5,.07,white,.02);
  for(const side of [-1,1])for(let z=-d/2+.025;z<d/2;z+=.04)box(g,side*(w/2+.004),.27,z,.024,.4,.026,white,.006);
  for(let x=-w/2;x<w/2;x+=.04)box(g,x,.27,d/2,.026,.4,.024,white,.006);
  const duvetGeo=new THREE.PlaneGeometry(w-.08,d-.45,36,42),positions=duvetGeo.attributes.position;
  for(let i=0;i<positions.count;i++){const x=positions.getX(i),z=positions.getY(i);positions.setXYZ(i,x,z,.035*Math.sin(x*17+z*7)+.024*Math.sin(z*23-x*5)+.018*Math.cos(x*31));}duvetGeo.computeVertexNormals();const duvet=new THREE.Mesh(duvetGeo,m);duvet.rotation.x=-Math.PI/2;duvet.position.set(0,.7,.17);duvet.castShadow=duvet.receiveShadow=true;g.add(duvet);
  for(const x of [-.45,.45])box(g,x,.65,-.64,.68,.16,.4,white,.07);break;}
 case 'cot':case 'childbed':{
  const child=obj.type==='childbed';const h=child?.46:.87;legs(g,w,d,.2);box(g,0,.24,0,w,.14,d,m,.02);box(g,0,.36,0,w-.07,.1,d-.08,white,.035);
  for(const x of [-1,1]){box(g,x*(w/2-.025),h,0,.05,.055,d,m,.013);for(let z=-d/2+.08;z<d/2;z+=.12)box(g,x*(w/2-.025),(h+.29)/2,z,.018,h-.29,.02,m);}
  for(const z of [-1,1])box(g,0,h/2+.12,z*(d/2-.025),w,h-.2,.05,m,.018);
  if(child){for(const z of [-1,1]){for(const x of [-1,1]){box(g,x*(w/2-.025),.91,z*(d/2-.025),.04,1.3,.04,m);const beam=box(g,x*w/4,1.72,z*(d/2-.025),.045,.72,.045,m);beam.rotation.z=x*Math.PI/4;} }box(g,0,1.97,0,.05,.05,d,m);}
  break;}
 case 'table':case 'dining':case 'desk':{
  const h=obj.type==='table'?.43:.76;legs(g,w,d,h-.055,obj.type==='dining'?black:wood);
  if(obj.type==='table'){const top=cylinder(g,0,h,0,.55,.55,.05,m,40);top.scale.z=.65;}else box(g,0,h,0,w,.065,d,m,.03);
  if(obj.type==='desk'){box(g,0,1.06,-.17,.68,.41,.04,black,.01);box(g,0,.82,-.17,.035,.15,.035,metal);box(g,0,.8,-.15,.26,.018,.18,metal);box(g,0,.804,.14,.42,.015,.13,black,.01);box(g,.62,.92,-.1,.12,.24,.12,white,.04);}
  if(obj.type==='dining'){cylinder(g,0,.88,0,.1,.085,.2,mat('#7c9b9a'));for(let i=0;i<5;i++){const a=i*2.4;box(g,Math.sin(a)*.05,1.04,Math.cos(a)*.05,.012,.22,.012,leaf);ellipsoid(g,Math.sin(a)*.1,1.13,Math.cos(a)*.1,.065,.07,.065,mat('#b8a385'));}}
  break;}
 case 'chair':{legs(g,w,d,.44,black);box(g,0,.46,0,w,.08,d,m,.035);box(g,0,.91,-d/2+.04,w,.06,.055,m,.02);for(let i=0;i<5;i++)box(g,-w/2+.055+i*(w-.11)/4,.7,-d/2+.04,.023,.4,.025,m);break;}
 case 'cabinet':case 'vanity':{
  box(g,0,.48,0,w,.82,d,m,.015);box(g,0,.91,0,w+.035,.035,d+.03,obj.type==='vanity'?white:m);
  for(let i=0;i<3;i++){box(g,0,.22+i*.26,d/2+.009,w-.04,.245,.021,m,.005);box(g,0,.31+i*.26,d/2+.024,.17,.018,.018,black);}
  if(obj.type==='vanity'){const basin=cylinder(g,0,.958,0,.28,.23,.075,white,32);basin.scale.z=.62;cylinder(g,0,1.025,-.16,.018,.018,.22,metal);box(g,0,1.12,-.1,.035,.035,.14,metal);box(g,0,1.5,-.19,.66,.7,.035,metal,.015);}break;}
 case 'builtins':{
  box(g,0,1.28,-.2,w,2.56,.035,m);
  for(let i=0;i<4;i++)box(g,-w/2+i*w/3,1.28,0,.035,2.56,.42,m);
  for(let i=0;i<3;i++){const x=-w/3+i*w/3;box(g,x,.43,.17,w/3-.05,.78,.055,m);box(g,x,.43,.205,w/3-.18,.6,.02,white);cylinder(g,x+.34,.67,.23,.022,.022,.025,metal);
   for(let j=0;j<4;j++){box(g,x,.87+j*.53,0,w/3,.032,.42,m);for(let k=0;k<4;k++)box(g,x-.39+k*.095,1.06+j*.53,.025,.07,.3,.21,mat(['#dad4bc','#898e83','#b3a18c','#ebe7db'][k]));}}
  box(g,0,2.59,0,w+.08,.08,.48,m);break;}
 case 'shelf':{box(g,0,1.1,-d/2,w,2.2,.025,m);for(const x of [-1,1])box(g,x*w/2,1.1,0,.04,2.2,d,m);for(let i=0;i<5;i++)box(g,0,i*.54+.03,0,w,.035,d,m);for(let j=0;j<4;j++)for(let i=0;i<4;i++){const book=mat(['#9e8771','#677d81','#cbc1a4','#a0aa8d'][i]);box(g,-w/2+.12+i*.085,j*.54+.23,-.015,.065,.34-i*.035,.21,book);}for(const j of [1,3])cylinder(g,.38,j*.54+.14,.02,.08,.1,.2,mat('#e1d6bf'));break;}
 case 'rug':{box(g,0,.022,0,w,.032,d,m,.01);const edge=mat(new THREE.Color(obj.color).multiplyScalar(.87));for(const x of [-1,1])box(g,x*(w/2-.045),.04,0,.025,.005,d-.1,edge);for(const z of [-1,1])box(g,0,.04,z*(d/2-.045),w-.1,.005,.025,edge);break;}
 case 'plant':{cylinder(g,0,.2,0,.19,.145,.4,m,24);cylinder(g,0,.66,0,.021,.03,.83,wood,8);for(let i=0;i<11;i++){const a=i*2.399;const y=.55+i*.066;const stem=box(g,Math.sin(a)*.11,y,Math.cos(a)*.11,.013,.3,.014,leaf);stem.rotation.z=Math.sin(a)*.7;const l=ellipsoid(g,Math.sin(a)*.22,y+.12,Math.cos(a)*.22,.13,.055,.26,leaf);l.rotation.y=a;l.rotation.z=.25;}break;}
 case 'lamp':{cylinder(g,0,.026,0,.22,.23,.04,black);cylinder(g,0,.79,0,.014,.014,1.55,metal);cylinder(g,0,1.5,0,.19,.3,.38,m,28);cylinder(g,0,1.3,0,.27,.27,.009,mat('#ffe7ab',{emissive:'#f3ce74',emissiveIntensity:.65}));break;}
 case 'tv':{for(const y of [.11,.41,.71])box(g,0,y,0,w,.035,d,m);for(const x of [-1,1]){box(g,x*(w/2-.13),.48,-d/2+.04,.018,.94,.018,metal);box(g,x*(w/2-.13),.48,d/2-.04,.018,.94,.018,metal);}box(g,0,1.13,-.035,w*.86,.75,.045,black,.012);box(g,0,1.13,-.009,w*.82,.7,.008,mat('#26333a',{roughness:.25}));for(const x of [-1,1])box(g,x*.42,.75,-.01,.03,.08,.2,black);for(let i=0;i<3;i++)box(g,-.4+i*.15,.23,.02,.095,.2,.18,mat(['#d2c5ad','#788889','#e4e4da'][i]));break;}
 case 'bath':{
  const pts=[[.04,0],[.34,.025],[.44,.12],[.5,.54],[.51,.59],[.47,.61],[.43,.55],[.36,.13],[.04,.12]].map(p=>new THREE.Vector2(...p));
  const tub=new THREE.Mesh(new THREE.LatheGeometry(pts,48),m);tub.scale.set(1.72,1,.8);tub.position.y=.02;tub.castShadow=true;tub.receiveShadow=true;g.add(tub);cylinder(g,.15,.67,-.36,.025,.025,.3,metal);box(g,.15,.8,-.27,.05,.05,.23,metal);break;}
 case 'shower':{box(g,0,.03,0,w,.06,d,m);box(g,0,1,-d/2,w,2,.035,m);const glass=mat('#b8d3d3',{transparent:true,opacity:.16,roughness:.15,depthWrite:false});box(g,-w/2,1.03,0,.025,2.05,d,glass);box(g,0,1.19,-d/2+.075,.024,1.58,.024,metal);box(g,0,1.96,-.25,.03,.03,.45,metal);cylinder(g,0,1.95,-.08,.17,.17,.022,metal);box(g,0,.94,-.4,.36,.045,.08,metal);break;}
 case 'toilet':{ellipsoid(g,0,.28,.07,.21,.22,.3,m);cylinder(g,0,.17,0,.15,.18,.32,m);const seat=cylinder(g,0,.47,.06,.22,.21,.04,white,28);seat.scale.z=1.25;box(g,0,.62,-.22,.4,.45,.15,m,.04);break;}
 case 'kitchen':{
  const top=mat('#cac7bb');
  const cabinet=(x,z,rot=0)=>{const cg=new THREE.Group();cg.position.set(x,0,z);cg.rotation.y=rot;g.add(cg);box(cg,0,.44,0,.58,.83,.6,m);box(cg,0,.06,0,.54,.12,.53,mat('#ada99f'));box(cg,0,.48,.306,.55,.71,.035,m);box(cg,0,.48,.329,.43,.58,.012,mat('#f3f0e7'));box(cg,.14,.73,.35,.16,.018,.024,metal);box(cg,0,.895,0,.6,.045,.65,top);};
  for(let i=0;i<5;i++)cabinet(-1.4+i*.6,-1.05);
  for(let i=0;i<3;i++)cabinet(1.45,-.45+i*.6,-Math.PI/2);
  for(let i=0;i<3;i++)cabinet(.1+i*.6,1.05,Math.PI);
  box(g,.62,.905,1.05,2.18,.055,.72,top,.14);
  // Twin brushed steel fridge/freezer and oven tower on the back wall.
  box(g,-1.14,1.09,-1.05,1.2,2.18,.65,metal,.01);
  for(const x of [-1.44,-.84]){box(g,x,1.08,-.705,.565,2.1,.025,metal,.01);box(g,x+.19,1.18,-.67,.022,.62,.028,black);}
  box(g,-.22,1.09,-1.05,.6,2.18,.65,m);
  for(const y of [.87,1.48]){box(g,-.22,y,-.704,.53,.42,.035,black,.01);box(g,-.22,y+.14,-.674,.43,.025,.045,metal);box(g,-.22,y-.05,-.68,.43,.25,.012,mat('#253239'));}
  const corner=new THREE.Group();corner.position.set(1.25,0,-1.03);corner.rotation.y=-Math.PI/4;g.add(corner);
  box(corner,0,.925,0,.58,.026,.55,black);for(const x of [-.16,.16])for(const z of [-.15,.15])cylinder(corner,x,.942,z,.1,.1,.008,metal,20);
  box(corner,0,1.73,-.07,.77,.055,.55,metal);box(corner,0,2.02,-.22,.3,.55,.3,metal);
  box(g,1.45,.93,.12,.47,.03,.6,black,.03);
  box(g,1.13,.45,-.44,.018,.77,.57,metal);box(g,1.1,.77,-.44,.022,.028,.43,black);
  box(corner,0,.45,.1,.61,.81,.57,m);for(let i=0;i<3;i++){box(corner,0,.23+i*.25,.398,.57,.22,.025,m);box(corner,0,.3+i*.25,.42,.28,.018,.025,metal);}
box(g,1.45,.947,.12,.37,.008,.48,black,.03);cylinder(g,1.71,1.08,.12,.018,.018,.3,black);box(g,1.61,1.22,.12,.22,.025,.025,black);
  break;}
 case 'wardrobe':{
  box(g,0,1.2,0,w,2.4,d,m);for(const x of [-w/4,w/4]){box(g,x,1.2,d/2+.025,w/2-.035,2.31,.045,m);for(let y=.14;y<2.36;y+=.15)box(g,x,y,d/2+.052,w/2-.045,.009,.005,mat('#c8c6bd'));cylinder(g,x+(x<0?.32:-.32),1.1,d/2+.065,.025,.025,.02,metal);}
  break;}
 case 'toybin':{
  box(g,0,.39,0,w,.76,d,m);for(let i=0;i<4;i++){const x=-w/2+.23+i*.4;box(g,x,.31,d/2,.34,.45,.035,white,.025);box(g,x,.53,d/2+.03,.17,.025,.025,mat('#8d8c81'));}for(let i=0;i<4;i++){const x=-w/2+.23+i*.4;box(g,x,1.53,-.05,.37,.4,.32,m);box(g,x,1.52,.13,.29,.3,.028,mat('#625e59'));}break;}
 case 'toyshelf':{
  for(const x of [-1,1])box(g,x*w/2,.63,0,.035,1.2,d,m);for(const y of [.04,.45,.86])box(g,0,y,0,w,.035,d,m);for(const x of [-1,1]){const roof=box(g,x*.25,1.4,0,.035,.71,d,m);roof.rotation.z=x*Math.PI/4;}for(let i=0;i<6;i++)box(g,-.35+i*.12,.23,.015,.085,.33,.18,mat(['#c89c87','#98aaa1','#cfbc8e'][i%3]));break;}
 case 'clothes':{
  for(const x of [-1,1])box(g,x*(w/2-.04),.95,0,.035,1.9,.035,metal);box(g,0,1.85,0,w,.03,.03,metal);box(g,0,.12,0,w,.04,d,m);for(let i=0;i<9;i++){const color=mat(['#bec0ba','#e5dfd4','#656b6b','#ab9885'][i%4]);box(g,-w/2+.13+i*.14,1.28,0,.085,.88,.38,color,.03);}break;}
 case 'bench':{for(let i=0;i<6;i++)box(g,0,.53,-d/2+.065+i*.1,w,.055,.087,m,.008);for(const x of [-1,1])box(g,x*(w/2-.1),.26,0,.07,.52,d-.15,m);for(let i=0;i<6;i++)box(g,0,.72+i*.1,-d/2+.045,w,.08,.04,m,.005);break;}
 case 'heater':{box(g,0,.39,0,.43,.69,.43,metal,.025);for(let i=0;i<5;i++)box(g,0,.17+i*.09,.223,.37,.015,.01,black);for(let i=0;i<10;i++)ellipsoid(g,Math.sin(i*2.4)*.14,.75+(i%2)*.035,Math.cos(i*2.4)*.14,.07,.05,.07,black);break;}
 }
 batchMeshes(g);g.position.set(obj.x,0,obj.z);g.rotation.y=obj.rotation;g.scale.set(obj.mirrored?-obj.scale:obj.scale,obj.scale,obj.scale);g.userData.objectId=obj.id;g.traverse(ch=>{if(ch.isMesh)ch.userData.objectId=obj.id;});return g;
}

const textures=new Map();
function surfaceTexture(kind){if(textures.has(kind))return textures.get(kind);const cv=document.createElement('canvas');cv.width=cv.height=256;const ctx=cv.getContext('2d');let seed=91;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};ctx.fillStyle=kind==='carpet'?'#b8b3a8':'#c4a078';ctx.fillRect(0,0,256,256);
 for(let i=0;i<2200;i++){const a=rnd();ctx.strokeStyle=`rgba(${a>.5?'255,244,221':'70,48,30'},${kind==='carpet'?.13:.065})`;ctx.lineWidth=kind==='carpet'?1:rnd()*1.5;const x=rnd()*256,y=rnd()*256;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+rnd()*2,y+(kind==='carpet'?2:rnd()*100));ctx.stroke();}
 const t=new THREE.CanvasTexture(cv);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;textures.set(kind,t);return t;}
function beam(g,a,b,width,m){const p=new THREE.Vector3(...a),q=new THREE.Vector3(...b);const mesh=box(g,...p.clone().add(q).multiplyScalar(.5).toArray(),width,p.distanceTo(q),width,m);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),q.sub(p).normalize());return mesh;}
function disposeGroup(root){root.traverse(o=>{if(!o.isMesh&&!o.isLineSegments)return;if(o.isInstancedMesh)o.dispose();if(o.geometry!==baseGeo&&o.geometry!==ballGeo)o.geometry?.dispose();for(const m of [].concat(o.material||[])){if(![white,wood,black,metal,leaf].includes(m))m.dispose();}});}
export class HouseWorld{
 constructor(container,callbacks){this.container=container;this.callbacks=callbacks;this.mode='overview';this.objects=new Map();this.rooms=new Map();this.keys={};this.joy={x:0,y:0};this.yaw=0;this.pitch=0;this.feet=0;this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#cbd7da');this.camera=new THREE.PerspectiveCamera(68,1,.04,100);this.camera.rotation.order='YXZ';this.renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.08;container.appendChild(this.renderer.domElement);
 this.orbit=new OrbitControls(this.camera,this.renderer.domElement);Object.assign(this.orbit,{enableDamping:true,dampingFactor:.08,minDistance:3,maxDistance:35,minPolarAngle:.05,maxPolarAngle:Math.PI/2.1,enablePan:true});
 this.ambient=new THREE.HemisphereLight('#f7f4ed','#a7a39a',2.7);this.scene.add(this.ambient);this.sun=new THREE.DirectionalLight('#fff0d7',2.4);this.sun.position.set(-4,12,4);this.sun.target.position.set(4,1,5);this.sun.castShadow=true;this.sun.shadow.mapSize.set(2048,2048);Object.assign(this.sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:.1,far:35});this.sun.shadow.normalBias=.025;this.scene.add(this.sun,this.sun.target);this.fill=new THREE.DirectionalLight('#e2edf4',1.1);this.fill.position.set(8,7,12);this.scene.add(this.fill);
 this.ground=box(this.scene,4,-.22,5.5,40,.15,40,mat('#b9c2b0'));this.ray=new THREE.Raycaster();this.pointer=new THREE.Vector2();this.floorPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);this.installEvents();new ResizeObserver(()=>this.resize()).observe(container);this.resize();this.lastTime=performance.now();this.renderer.setAnimationLoop(now=>this.frame(now));
 }
 referenceView(p,floor){this.photoMode=true;this.feet=floor*H;this.camera.position.set(8-p[0],floor*H+1.58,p[1]);this.yaw=Math.atan2(-(p[0]-p[2]),-(p[3]-p[1]));this.pitch=-.06;this.camera.fov=74;this.camera.updateProjectionMatrix();this.keys={};this.camera.rotation.set(this.pitch,this.yaw,0,'YXZ');}
 resize(){const {width,height}=this.container.getBoundingClientRect();if(!width||!height)return;this.camera.aspect=width/height;if(this.mode==='walk'&&!this.photoMode)this.camera.fov=Math.min(74,2*Math.atan(Math.tan(41*Math.PI/180)/this.camera.aspect)*180/Math.PI);this.camera.updateProjectionMatrix();this.renderer.setSize(width,height);}
 load(room,state,from,preserveView=false){const view=preserveView&&this.root?{pos:this.camera.position.clone(),rot:this.camera.rotation.clone(),target:this.orbit.target.clone(),feet:this.feet,yaw:this.yaw,pitch:this.pitch}:null;
 if(this.root){this.scene.remove(this.root);disposeGroup(this.root);}this.allState=state;this.objects.clear();this.rooms.clear();this.walls=[];this.ceilings=[];this.root=new THREE.Group();this.scene.add(this.root);
 for(const r of ROOMS){const g=new THREE.Group();g.position.set(r.x,r.floor*H,r.z);this.root.add(g);const record={r,g,wallMat:mat(state[r.id].wall),objects:new Map()};this.rooms.set(r.id,record);this.buildRoom(record);for(const obj of state[r.id].objects)this.addObject(obj,r.id);}
 this.buildStairs();this.activate(room);this.selected=null;this.setMode(this.mode);if(this.mode==='walk'&&!view)this.spawn();if(view){this.camera.position.copy(view.pos);this.camera.rotation.copy(view.rot);this.orbit.target.copy(view.target);this.feet=view.feet;this.yaw=view.yaw;this.pitch=view.pitch;}this.visibility();
 }
 activate(r){this.room=r;this.state=this.allState[r.id];this.wallMat=this.rooms.get(r.id).wallMat;this.floorPlane.constant=-r.floor*H;}
 focus(r){this.activate(r);this.selected=null;if(this.mode==='walk')this.spawn();else this.center();this.visibility();this.updateSelector();}
 spawn(){const p=spawnIn(this.room,this.allState);this.feet=p.y;this.camera.position.set(p.x,p.y+1.62,p.z);this.yaw=p.yaw;this.pitch=-.025;this.camera.rotation.set(this.pitch,this.yaw,0,'YXZ');}
 floor(g,r,floor){box(g,0,-.1,0,r.w,.17,r.d,mat('#bcb9ae'));
 if(floor==='carpet'){const m=mat('#ddd8d0',{map:surfaceTexture('carpet')});box(g,0,.003,0,r.w,.025,r.d,m);return;}
 const tile=floor==='tile',pw=tile?.4:.085,pd=tile?.6:.62,cols=Math.ceil(r.w/pw),rows=Math.ceil(r.d/pd)+1,mesh=new THREE.InstancedMesh(baseGeo,mat('#ffffff',tile?{}:{map:surfaceTexture('wood')}),cols*rows);const matrix=new THREE.Matrix4(),color=new THREE.Color();let n=0;
 for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const lo=-r.d/2+j*pd-(tile?0:i%3*pd/3),hi=Math.min(r.d/2,lo+pd),start=Math.max(-r.d/2,lo);if(hi<=start)continue;const w=Math.min(pw,r.w-i*pw);matrix.compose(new THREE.Vector3(-r.w/2+i*pw+w/2,0,(start+hi)/2),new THREE.Quaternion(),new THREE.Vector3(w-.003,.022,hi-start-.003));mesh.setMatrixAt(n,matrix);color.set({oak:'#f3d3a2',light:'#fff4d8',dark:'#8f6e4f',tile:'#58636a'}[floor]||'#ffffff').multiplyScalar(.93+(i*17+j*31)%13/100);mesh.setColorAt(n++,color);}mesh.count=n;mesh.receiveShadow=true;g.add(mesh);
 }
 buildRoom(rec){const {r,g,wallMat:m}=rec;this.floor(g,r,this.allState[r.id].flooring);
 for(const edge of ['n','s','e','w']){const wg=new THREE.Group(),horizontal=edge==='n'||edge==='s',width=horizontal?r.w:r.d;wg.userData={edge,room:r.id};if(edge==='n')wg.position.z=-r.d/2+.025;if(edge==='s'){wg.position.z=r.d/2-.025;wg.rotation.y=Math.PI;}if(edge==='w'){wg.position.x=-r.w/2+.025;wg.rotation.y=Math.PI/2;}if(edge==='e'){wg.position.x=r.w/2-.025;wg.rotation.y=-Math.PI/2;}g.add(wg);this.walls.push({g:wg,r,edge});
 const rail=r.id==='alcove'&&edge==='s'||r.id==='allrum'&&edge==='n';
 if(rail){const half=r.id==='alcove';box(wg,0,half?.5:.54,0,width,half?1:.96,.08,half?m:mat('#d9e7e3',{transparent:true,opacity:.17,roughness:.14,depthWrite:false}));box(wg,0,1.025,0,width+.04,.065,.17,wood);for(let x=-width/2+.05;x<width/2;x+=.9)box(wg,x,.5,0,.035,1,.035,metal);}
 else {const holes=wallHoles(r,edge),wm=r.id==='bathroom'&&edge==='s'?mat('#424e56'):m;let at=-width/2;for(const h of holes){if(h.lo>at)this.wallPiece(wg,(at+h.lo)/2,h.lo-at,2.66,wm);const w=h.hi-h.lo,mid=(h.lo+h.hi)/2;if(h.bottom)box(wg,mid,h.bottom/2,0,w,h.bottom,.1,wm);if(h.top<2.66)box(wg,mid,(h.top+2.66)/2,0,w,2.66-h.top,.1,wm);
 if(h.kind==='window')this.window(wg,mid,w,h.bottom,h.top,r);
 if(h.kind==='door'&&h.top<2.6){for(const x of [h.lo,h.hi])box(wg,x,1.06,.02,.065,2.17,.16,white);box(wg,mid,2.15,.02,w+.12,.08,.16,white);box(wg,mid,.013,0,w,.025,.17,wood);}
 at=Math.max(at,h.hi);}if(at<width/2)this.wallPiece(wg,(at+width/2)/2,width/2-at,2.66,wm);}
 if(edge==='s'||edge==='w')for(const child of wg.children)child.position.x*=-1;
 if(r.id==='sauna')for(let y=.12;y<2.65;y+=.12)box(wg,0,y,.064,width,.008,.003,mat('#866542'));
 }
 const ceiling=new THREE.Group();g.add(ceiling);this.ceilings.push({g:ceiling,r});
 // The ground-floor stairwell is cut out of the ceiling, including the turn.
 if(r.id==='hall'){const strip=(x0,z0,x1,z1)=>box(ceiling,-((x0+x1)/2-r.sourceX),2.67,(z0+z1)/2-r.z,x1-x0,.08,z1-z0,white);strip(0,2.3,.5,5.6);strip(.5,4.35,4.2,5.6);strip(1.55,3.4,4.2,4.35);}
 else box(ceiling,0,2.67,0,r.w,.08,r.d,white);
 if(r.slope){const ew=r.slope==='e'||r.slope==='w',run=1.15,rise=1.25;const sl=box(ceiling,ew?(r.slope==='e'?1:-1)*(r.w/2-run/2):0,2.03,ew?0:(r.slope==='s'?1:-1)*(r.d/2-run/2),ew?Math.hypot(run,rise):r.w,.06,ew?r.d:Math.hypot(run,rise),white);if(ew)sl.rotation.z=(r.slope==='w'?1:-1)*Math.atan2(rise,run);else sl.rotation.x=(r.slope==='n'?-1:1)*Math.atan2(rise,run);}
 const details=new THREE.Group();details.scale.x=-1;g.add(details);this.details({...rec,g:details,r:{...r,x:r.sourceX}});batchMeshes(g);
 }
 wallPiece(g,x,w,h,m){box(g,x,h/2,0,w,h,.1,m);box(g,x,.065,.064,w,.13,.026,white);box(g,x,2.59,.06,w,.07,.04,white);}
 window(g,x,w,bottom,top,r){const h=top-bottom;box(g,x,(top+bottom)/2,-.012,w,h,.015,mat('#c2d4d4',{emissive:'#bed5d8',emissiveIntensity:.42,roughness:.2}));const parts=w>2?3:2;for(let i=0;i<=parts;i++)box(g,x-w/2+i*w/parts,(top+bottom)/2,.018,.045,h+.08,.08,white);for(const y of [bottom,top])box(g,x,y,.025,w+.1,.06,.13,white);box(g,x,bottom,.095,w+.18,.045,.27,white);
 if(w<2){for(const y of [(top+bottom)/2,...(r.id==='bathroom'?[bottom+(top-bottom)*.33,bottom+(top-bottom)*.67]:[])])box(g,x,y,.025,w,.027,.07,white);}
 if(r.id==='allrum'){box(g,x+w/6,.88,.025,w*2/3,.05,.1,white);box(g,x+w/6,.47,-.005,w*2/3,.77,.035,white);box(g,x+w/6,.45,.12,w*.58,.55,.12,white);for(let i=0;i<26;i++)box(g,x-w*.1+i*w*.021,.45,.187,.017,.47,.009,mat('#d4d4ce'));}
 if(['bedroom','kids','alcove'].includes(r.id))for(let y=top-.35;y<top;y+=.025)box(g,x,y,.045,w-.08,.016,.025,mat('#d4cec0'));

 if(r.id!=='bathroom'&&r.id!=='sauna'&&r.id!=='kitchen'){const curtain=mat(['bedroom','kids','alcove'].includes(r.id)?'#aaa69f':'#e8e4db');const sides=['alcove','bedroom'].includes(r.id)?[-1]:r.id==='kids'?[1]:[-1,1];for(const side of sides)for(let i=0;i<8;i++)cylinder(g,x+side*(w/2+.09)+i*.021,1.25,.14,.027,.03,2.38,curtain,8);beam(g,[x-w/2-.26,2.48,.17],[x+w/2+.3,2.48,.17],.018,metal);}
 if(bottom>.5&&r.id!=='bathroom'){box(g,x,.46,.13,w*.8,.55,.1,white,.015);for(let i=0;i<Math.floor(w*20);i++)box(g,x-w*.38+i*.04,.46,.189,.017,.48,.011,mat('#dbdcd6'));}
 }
 details({r,g}){
 if(['kitchen','playroom','kids'].includes(r.id)){const px=r.id==='kitchen'?.2:0,pz=r.id==='kitchen'?1.25:0;beam(g,[px,2.65,pz],[px,2.24,pz],.009,white);ellipsoid(g,px,2.13,pz,r.id==='kitchen'?.36:.23,r.id==='kitchen'?.17:.28,r.id==='kitchen'?.3:.23,mat('#f6f3e8',{emissive:'#e9d8ae',emissiveIntensity:.12}));}
 if(r.id==='office'){beam(g,[.8,.15,-.77],[.8,1.8,-.77],.075,metal);beam(g,[.8,1.8,-.77],[.1,2.35,-.77],.075,metal);}
 if(r.id==='hall'){
  const tile=mat('#e2e0d7'),dark=mat('#7c8483');for(let x=.15;x<1.9;x+=.27)for(let z=3.8;z<5.1;z+=.27){box(g,x-r.x,.017,z-r.z,.258,.018,.258,tile);const diamond=box(g,x-r.x,.028,z-r.z,.12,.002,.12,dark);diamond.rotation.y=Math.PI/4;}
  const entry=new THREE.Group();entry.position.set(.07-r.x,0,4.05-r.z);entry.rotation.y=Math.PI/2;g.add(entry);box(entry,0,1.05,0,.93,2.1,.09,white);for(const x of [-.62,.62])box(entry,x,1.05,-.02,.25,2.1,.025,mat('#b3c6ca',{emissive:'#b3c6ca',emissiveIntensity:.35}));for(const y of [.45,1.25])box(entry,0,y,.05,.68,.57,.035,mat('#dfded6'));box(entry,.32,1.03,.085,.14,.025,.035,metal);
 }
 if(r.id==='living'){for(const side of [-1,1])for(let i=0;i<16;i++)box(g,-.35+side*1.18+i*.034,1.32,r.d/2-.1,.021,2.64,.025,wood);}
 if(r.id==='bathroom'){for(let y=.3;y<2.6;y+=.3)for(const side of [-1,1])box(g,side*(r.w/2-.06),y,0,.004,.007,r.d,mat('#bac1bd'));
 const glass=mat('#bbcaca',{transparent:true,opacity:.4,roughness:.18});for(let j=0;j<10;j++)for(let i=0;i<2;i++)box(g,.64+i*.18,.12+j*.2,-1.03,.17,.19,.07,glass,.018);
 }
 if(r.id==='bedroom'){box(g,-.86,1.39,r.d/2-.11,.63,.4,.038,white,.01);box(g,-.86,1.39,r.d/2-.137,.57,.34,.015,black);}
 if(r.id==='kids'){const canopy=mat('#f6f2e9',{transparent:true,opacity:.35,side:THREE.DoubleSide,depthWrite:false});for(const side of [-1,1]){const cloth=box(g,.69+side*.24,1.69,-.4,.69,.008,1.85,canopy);cloth.rotation.z=-side*Math.PI/4;for(let i=0;i<7;i++)cylinder(g,.69+side*.48,.96,-1.24+i*.26,.027,.04,1.0,canopy,8);}for(let i=0;i<3;i++){box(g,-1.25,1.42,-.3+i*.47,.022,.32,.25,wood);box(g,-1.233,1.42,-.3+i*.47,.008,.26,.2,mat(['#dcc5b3','#a9b5a6','#bba69e'][i]));}}
 }
 buildStairs(){this.stairs=new THREE.Group();this.root.add(this.stairs);this.stairs.scale.x=-1;this.stairs.position.x=8;const g=this.stairs,s=STAIR,w=s.turnX-s.x0;
 for(let i=0;i<4;i++){const z=s.bottomZ-(i+.5)*(s.bottomZ-s.z1)/4;box(g,(s.x0+s.turnX)/2,(i+1)*s.lowerHeight/4-.03,z,w,.06,(s.bottomZ-s.z1)/4+.015,wood);}
 const cornerAngle=Math.atan2(s.z1-s.z0,s.turnX-s.x0);
 const rim=a=>{const cs=Math.cos(a),sn=Math.sin(a),radius=Math.min(cs>1e-9?w/cs:Infinity,sn>1e-9?(s.z1-s.z0)/sn:Infinity);return [s.turnX-cs*radius,s.z1-sn*radius];};
 for(let i=0;i<3;i++){const a=i*Math.PI/6,b=(i+1)*Math.PI/6,points=[[s.turnX,s.z1],rim(a),...(a<cornerAngle&&b>cornerAngle?[[s.x0,s.z0]]:[]),rim(b)],shape=new THREE.Shape();points.forEach(([x,z],j)=>j?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();const geo=new THREE.ExtrudeGeometry(shape,{depth:.055,bevelEnabled:false});geo.rotateX(-Math.PI/2);const step=new THREE.Mesh(geo,wood);step.position.y=s.lowerHeight+(i+1)*(s.turnHeight-s.lowerHeight)/3-.055;step.castShadow=step.receiveShadow=true;g.add(step);}

 const n=13;for(let i=0;i<n;i++){const x=s.turnX+(i+.5)*(s.x1-s.turnX)/n,y=s.turnHeight+(i+1)*(H-s.turnHeight)/n;box(g,x,y-.03,(s.z0+s.z1)/2,(s.x1-s.turnX)/n+.012,.06,s.z1-s.z0,wood);}
 for(const z of [s.z1-.025]){beam(g,[s.turnX,s.turnHeight-.09,z],[s.x1,H-.09,z],.1,white);beam(g,[s.turnX,s.turnHeight+.86,z],[s.x1,H+.86,z],.045,wood);for(let i=0;i<=4;i++){const x=s.turnX+(s.x1-s.turnX)*i/4,y=s.turnHeight+(H-s.turnHeight)*i/4;box(g,x,y+.43,z,.035,.9,.035,metal);}}
 const sideShape=new THREE.Shape();sideShape.moveTo(s.turnX,s.turnHeight-.12);sideShape.lineTo(s.x1,H-.12);sideShape.lineTo(s.x1,H+1);sideShape.lineTo(s.turnX,H+1);sideShape.closePath();const sideGeo=new THREE.ExtrudeGeometry(sideShape,{depth:.09,bevelEnabled:false}),side=new THREE.Mesh(sideGeo,white);side.position.z=s.z0-.045;side.castShadow=side.receiveShadow=true;g.add(side);

 // The upper baby gate is shown swung open so the route remains traversable.
 const gate=new THREE.Group();gate.position.set(s.x1,H,s.z0);gate.rotation.y=Math.PI/2;g.add(gate);for(const y of [.12,.76])box(gate,0,y,.48,.028,.035,.96,white);for(let z=.04;z<.97;z+=.105)box(gate,0,.44,z,.02,.64,.02,white);
 // Glass follows the inclined outer balustrade; landing rail continues by the sofa.
 const a=new THREE.Vector3(s.turnX,s.turnHeight+.43,s.z1),b=new THREE.Vector3(s.x1,H+.43,s.z1);const pane=box(g,...a.clone().add(b).multiplyScalar(.5).toArray(),Math.hypot(s.x1-s.turnX,H-s.turnHeight),.8,.018,mat('#cfdfda',{transparent:true,opacity:.14,depthWrite:false,roughness:.12}));pane.rotation.z=Math.atan2(H-s.turnHeight,s.x1-s.turnX);
 for(const x of [s.x0+.025,s.turnX-.025])beam(g,[x,.9,s.bottomZ],[x,s.lowerHeight+.9,s.z1],.04,wood);batchMeshes(g);
 }
 addObject(obj,roomId=this.room.id){const rec=this.rooms.get(roomId),g=furniture(obj);g.userData.roomId=roomId;g.traverse(ch=>{if(ch.isMesh)ch.userData.roomId=roomId;});rec.g.add(g);this.objects.set(obj.id,g);rec.objects.set(obj.id,g);}
 updateObject(obj,rebuild=false){const g=this.objects.get(obj.id);if(rebuild&&g){const id=g.userData.roomId;g.parent.remove(g);disposeGroup(g);this.addObject(obj,id);}else if(g){g.position.set(obj.x,0,obj.z);g.rotation.y=obj.rotation;g.scale.set(obj.mirrored?-obj.scale:obj.scale,obj.scale,obj.scale);}this.updateSelector();}
 removeObject(id){const g=this.objects.get(id);if(g){g.parent.remove(g);disposeGroup(g);this.rooms.get(g.userData.roomId).objects.delete(id);this.objects.delete(id);}this.select(null);}
 paint(color){this.wallMat.color.set(color);}
 select(id){this.selected=id;this.updateSelector();}
 updateSelector(){if(this.selector){this.scene.remove(this.selector);disposeGroup(this.selector);this.selector=null;}if(!this.selected||this.mode==='walk')return;const obj=this.state.objects.find(o=>o.id===this.selected);if(!obj)return;const c=CATALOG[obj.type],geo=new THREE.BoxGeometry(c.w*obj.scale+.07,.025,c.d*obj.scale+.07),s=new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:'#77a33c',depthTest:false}));geo.dispose();s.position.set(this.room.x+obj.x,this.room.floor*H+.07,this.room.z+obj.z);s.rotation.y=obj.rotation;s.renderOrder=10;this.selector=s;this.scene.add(s);}
 center(){const target=this.mode==='edit'?new THREE.Vector3(this.room.x,this.room.floor*H+.3,this.room.z):new THREE.Vector3(4,this.room.floor*H+.25,5.5);const size=this.mode==='edit'?Math.max(this.room.w,this.room.d)*1.8:17;const distance=Math.max(size,size/Math.max(.65,this.camera.aspect));this.orbit.target.copy(target);this.camera.position.copy(new THREE.Vector3(1,1.6,1.2).normalize().multiplyScalar(distance).add(target));this.orbit.update();}
 setMode(mode){const was=this.mode;this.mode=mode;this.orbit.enabled=mode!=='walk';this.camera.fov=mode==='walk'?Math.min(74,2*Math.atan(Math.tan(41*Math.PI/180)/this.camera.aspect)*180/Math.PI):45;this.camera.updateProjectionMatrix();if(mode==='walk'){if(was!=='walk'||!this.walkStarted){this.spawn();this.walkStarted=true;}}else this.center();this.visibility();this.updateSelector();}
 visibility(){if(!this.root)return;for(const {r,g} of this.rooms.values())g.visible=this.mode==='walk'||r.floor===this.room.floor;for(const {g} of this.ceilings)g.visible=this.mode==='walk';this.stairs.visible=true;}
 evening(on){this.ambient.intensity=on?1.35:2.7;this.sun.intensity=on?1.2:2.4;this.sun.color.set(on?'#ffbd7c':'#fff0d7');this.fill.intensity=on?.45:1.1;this.scene.background.set(on?'#65747e':'#cbd7da');}
 cast(e){const rect=this.renderer.domElement.getBoundingClientRect();this.pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);this.ray.setFromCamera(this.pointer,this.camera);}
 chooseHit(hit,panel){if(!hit)return;const r=ROOMS.find(r=>r.id===hit.object.userData.roomId);if(r.id!==this.room.id){this.activate(r);this.callbacks.roomChanged(r);}this.callbacks.select(hit.object.userData.objectId,panel);}
 installEvents(){const el=this.renderer.domElement;
 el.addEventListener('pointerdown',e=>{this.cast(e);this.down={x:e.clientX,y:e.clientY,id:e.pointerId,travel:0};if(this.mode==='walk'){el.setPointerCapture(e.pointerId);return;}if(this.mode!=='edit')return;const candidates=[...this.objects.values()].filter(g=>this.rooms.get(g.userData.roomId).r.floor===this.room.floor),hit=this.ray.intersectObjects(candidates,true)[0];if(hit){this.chooseHit(hit,false);const obj=this.state.objects.find(o=>o.id===hit.object.userData.objectId);if(obj&&!CATALOG[obj.type].fixed){const p=this.ray.ray.intersectPlane(this.floorPlane,new THREE.Vector3());if(p){this.drag={obj,dx:obj.x-(p.x-this.room.x),dz:obj.z-(p.z-this.room.z),started:false};this.orbit.enabled=false;el.setPointerCapture(e.pointerId);}}}else this.callbacks.select(null);},true);
 el.addEventListener('pointermove',e=>{if(!this.down||this.down.id!==e.pointerId)return;const dx=e.clientX-this.down.x,dy=e.clientY-this.down.y;this.down.travel+=Math.abs(dx)+Math.abs(dy);this.down.x=e.clientX;this.down.y=e.clientY;if(this.mode==='walk'){this.yaw-=dx*.004;this.pitch=Math.max(-1.25,Math.min(1.25,this.pitch-dy*.004));}else if(this.drag&&this.down.travel>5){if(!this.drag.started){this.callbacks.beforeChange();this.drag.started=true;}this.cast(e);const p=this.ray.ray.intersectPlane(this.floorPlane,new THREE.Vector3());if(p){this.drag.obj.x=p.x-this.room.x+this.drag.dx;this.drag.obj.z=p.z-this.room.z+this.drag.dz;constrain(this.drag.obj,this.room);this.updateObject(this.drag.obj);}}});
 const release=e=>{if(this.down?.id!==e.pointerId)return;if(this.drag?.started)this.callbacks.changed();if(this.down.travel<6&&this.mode==='edit'&&this.selected)this.callbacks.select(this.selected,true);if(this.down.travel<6&&this.mode==='overview'){this.cast(e);const visible=[...this.objects.values()].filter(g=>this.rooms.get(g.userData.roomId).r.floor===this.room.floor);this.chooseHit(this.ray.intersectObjects(visible,true)[0],true);}this.down=null;this.drag=null;this.orbit.enabled=this.mode!=='walk';};for(const name of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(name,release);
 window.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyQ','KeyE','ShiftLeft'].includes(e.code)&&this.mode==='walk'){e.preventDefault();this.keys[e.code]=true;}});window.addEventListener('keyup',e=>delete this.keys[e.code]);const reset=()=>{this.keys={};this.joy={x:0,y:0};this.down=null;this.drag=null;this.lastTime=performance.now();this.orbit.enabled=this.mode!=='walk';};window.addEventListener('blur',reset);document.addEventListener('visibilitychange',reset);
 }
 frame(now){const dt=Math.min((now-this.lastTime)/1000,.04);this.lastTime=now;if(!this.room)return;
 if(this.mode==='walk'){if(this.photoMode){this.camera.rotation.set(this.pitch,this.yaw,0,'YXZ');}else if(!document.querySelector('dialog[open]')&&!document.querySelector('.inspector.open')){let x=this.joy.x+(this.keys.KeyD||this.keys.ArrowRight?1:0)-(this.keys.KeyA||this.keys.ArrowLeft?1:0),z=this.joy.y+(this.keys.KeyS||this.keys.ArrowDown?1:0)-(this.keys.KeyW||this.keys.ArrowUp?1:0);const len=Math.hypot(x,z);if(len>1){x/=len;z/=len;}this.yaw+=((this.keys.KeyQ?1:0)-(this.keys.KeyE?1:0))*dt*1.6;const speed=this.keys.ShiftLeft?2.6:1.65,dx=(x*Math.cos(this.yaw)+z*Math.sin(this.yaw))*dt*speed,dz=(-x*Math.sin(this.yaw)+z*Math.cos(this.yaw))*dt*speed;
 const move=(nx,nz)=>{const next=walkTarget(nx,nz,this.feet,this.allState);if(!next)return;this.camera.position.x=next.x;this.camera.position.z=next.z;this.feet=next.y;if(!next.stairs&&next.room!==this.room.id){this.activate(ROOMS.find(r=>r.id===next.room));this.selected=null;this.callbacks.roomChanged(this.room);}};move(this.camera.position.x+dx,this.camera.position.z);move(this.camera.position.x,this.camera.position.z+dz);this.camera.position.y+=(this.feet+1.62-this.camera.position.y)*Math.min(1,dt*18);this.camera.rotation.set(this.pitch,this.yaw,0,'YXZ');}
 }else this.orbit.update();
 for(const {g,r,edge} of this.walls)g.visible=this.mode==='walk'||(edge==='n'?this.camera.position.z>r.z:edge==='s'?this.camera.position.z<r.z:edge==='e'?this.camera.position.x<r.x:this.camera.position.x>r.x);
 this.callbacks.position?.({x:this.camera.position.x,z:this.camera.position.z,y:this.feet,yaw:this.yaw});if(!document.hidden)this.renderer.render(this.scene,this.camera);
 }
}
