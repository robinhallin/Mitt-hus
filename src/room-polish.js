import * as T from '../assets/vendor/room-three.js';
import {FURNITURE_3D} from './dollhouse.js';

// Model-space ornamentation always travels with its furniture or character.
export function polishRoom({state,content,furniture,props,lea,dog,animated,group,box,sphere,cylinder,rod,ring,mesh,geo,surface,textures}){
 const cream='#f6eedc',brass='#b79759',wood='#b58b60';
 const softCanvas=globalThis.document?.createElement?.('canvas'),ctx=softCanvas?.getContext?.('2d');let shadowTexture=null;
 if(ctx){softCanvas.width=softCanvas.height=128;const g=ctx.createRadialGradient(64,64,2,64,64,62);g.addColorStop(0,'#3b302c80');g.addColorStop(.4,'#3b302c42');g.addColorStop(1,'#3b302c00');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);shadowTexture=new T.CanvasTexture(softCanvas);textures.push(shadowTexture);}
 const shadow=(root,w,d,y=.005)=>{if(!shadowTexture)return;const material=new T.MeshBasicMaterial({map:shadowTexture,transparent:true,opacity:.55,depthWrite:false});const m=new T.Mesh(geo('PlaneGeometry',[w,d]),material);m.rotation.x=-Math.PI/2;m.position.y=y;m.castShadow=m.receiveShadow=false;m.userData.contactShadow=true;root.add(m);return m;};
 for(const item of state.room.furniture){const g=furniture.get(item.id),cfg=FURNITURE_3D[item.type];if(item.type!=='shelf'&&item.type!=='rug')shadow(g,cfg.w*1.4,cfg.d*1.4);
  if(item.type==='wardrobe'){
   for(const x of [-.59,.59]){box(g,.055,2.05,.08,cream,x,1.13,.36,.015);sphere(g,brass,x,2.22,.36,.037);}
   box(g,1.32,.055,.75,cream,0,2.25,0,.015);box(g,1.27,.045,.7,'#d4bba1',0,2.3,0,.01);
   // A little woven hat box and ribbon above the wardrobe.
   cylinder(g,'#d9c3a1',.25,.25,.17,.19,2.4,0);cylinder(g,cream,.265,.265,.035,.19,2.5,0);box(g,.035,.19,.51,'#b98c9f',.19,2.41,0,.005);
  }
  if(item.type==='bed'){
   // Curved upholstered headboard and a soft folded quilt with piping.
   sphere(g,'#d9c4cd',0,.86,-.99,.63,.37,.065);
   for(const x of [-.36,0,.36])sphere(g,'#af8f9e',x,.92,-.91,.018,.018,.01);
   surface(g,1.34,.07,.38,cream,'cloth',0,.72,-.18,.025);
   for(const x of [-.65,.65])rod(g,[x,.7,-.12],[x,.7,.98],.012,'#ead9c4');
   // Low open footboard fits inside the saved bed footprint.
   box(g,1.33,.055,.055,cream,0,.48,1,.012);for(const x of [-.61,.61]){cylinder(g,wood,.035,.045,.42,x,.29,1);sphere(g,brass,x,.53,1,.045);}
  }
  if(item.type==='shelf'){
   for(let i=0;i<6;i++){const x=-.42+i*.13;for(const y of [.14,.32])box(g,.067,.012,.012,'#f6e2b7',x,y,.117,.003);}
   for(const x of [-.37,.37]){const support=box(g,.035,.32,.035,brass,x,-.14,-.01,.008);support.rotation.x=-.55;}
   sphere(g,'#cbb4a4',.31,.67,0,.1,.08,.09);cylinder(g,'#eddfc9',.05,.07,.12,.31,.77,0);for(const a of [-.3,0,.3])rod(g,[.31,.82,0],[.31+a*.15,1.02,0],.008,'#8d9f79');
  }
  if(item.type==='vanity'){
   // A powder compact, lipstick cap, comb and brush in their own tray.
   box(g,.38,.025,.2,brass,.29,.94,.04,.025);box(g,.34,.018,.16,cream,.29,.956,.04,.02);
   cylinder(g,'#b88595',.055,.055,.04,.22,.99,.04);cylinder(g,'#e7b7a3',.04,.04,.045,.22,1.01,.04);
   cylinder(g,brass,.025,.025,.12,.36,1.02,.04);sphere(g,'#bb6c79',.36,1.1,.04,.023,.035,.023);
   const brush=group(g,-.4,.96,.14);box(brush,.055,.025,.19,wood,0,0,0,.012);sphere(brush,'#967a6a',0,.025,-.07,.062,.035,.08);
  }
  if(item.type==='dogbed'){
   for(let i=0;i<4;i++){const a=i*Math.PI/2; sphere(g,'#d7be98',Math.cos(a)*.19,.201,Math.sin(a)*.12,.012,.007,.012);}
   box(g,.35,.09,.025,cream,0,.24,.397,.02);
  }
 }
 for(const p of state.dollhouse.props){const g=props.get(p.id);if(p.type==='table'||p.type==='bear')shadow(g,p.type==='table'?1.4:.5,p.type==='table'?1.15:.45);if(p.type==='pillow'){
  // Welt seams and a shallow tuft make the pillow read as soft upholstery.
  for(const z of [-.238,.238])rod(g,[-.27,.095,z],[.27,.095,z],.008,'#efdecd');sphere(g,'#d0b3b8',0,.166,0,.018,.006,.018);
 }if(p.type==='table'){
  for(const x of [-.32,.32]){cylinder(g,cream,.115,.115,.015,x,.65,.11);ring(g,.052,.012,brass,x+.075,.7,.11).rotation.y=Math.PI/2;}
  const plate=cylinder(g,cream,.13,.13,.012,.24,.66,-.22);for(const x of [.19,.28]){sphere(g,'#c79b62',x,.69,-.22,.038,.013,.033);for(let j=0;j<3;j++)sphere(g,'#785a3b',x-.017+j*.014,.704,-.22,.004);}
 }}
 // Narrow dirt shadows at the wall/floor junction and gentle daylight through the panes.
 for(const [x,z,w,d]of [[0,-3.03,7.1,.42],[-3.42,0,.42,6.2]]){const g=group(content,x,0,z);shadow(g,w,d,.006);}
 const dayPatches=[];for(let i=0;i<4;i++){const g=group(content,.6+(i%2)*.7,.009,-1.9+Math.floor(i/2)*.7);const p=mesh(g,geo('PlaneGeometry',[.63,.62]),'#fff2bf',0,0,0,null,{transparent:true,opacity:.17,depthWrite:false,side:T.DoubleSide});p.rotation.x=-Math.PI/2;g.rotation.y=-.22;p.castShadow=p.receiveShadow=false;dayPatches.push(g);}animated.dayPatches=dayPatches;
 // Fine sculpted details follow the animated rigs, including mouth-carried toys.
 for(const side of [-1,1]){
  for(let i=0;i<3;i++){const lock=sphere(dog.head,'#c99650',side*(.22+i*.018),-.15-i*.034,-.015,.045,.11-i*.013,.055);lock.rotation.z=side*(.15+i*.11);}
  sphere(dog.head,'#583f29',side*.1,.055,.24,.028,.032,.012);sphere(dog.head,'#fff5d7',side*.1-.009,.065,.252,.008);
  for(const leg of dog.legs.filter((_,i)=>side<0?i<2:i>=2))for(const dx of [-.027,.027])rod(leg,[dx,-.258,.1],[dx,-.252,.151],.003,'#b58a52');
  const cheek=sphere(lea.head,'#e6aa98',side*.14,-.08,.237,.035,.024,.008);cheek.material=cheek.material.clone();cheek.material.roughness=.6;
 }
 for(let i=0;i<5;i++){const tuft=sphere(dog.body,'#efcf96',-.12+i*.06,-.09,.34,.048,.14,.05);tuft.rotation.z=(i-2)*.12;}
 const base=group(content,0,-.36,0);const baseShadow=shadow(base,9,8,.001);if(baseShadow)baseShadow.material.opacity=.3;const dogShadow=shadow(content,.85,1.15),leaShadow=shadow(content,.65,.6);animated.contactActors={dog:dogShadow,lea:leaShadow};
}

// Ornament meshes share a material and parent. Merge only those leaves, never rigs or targets.
export function batchOrnaments(root){
 const byMaterial=new Map();for(const child of root.children){if(!child.isMesh||child.userData.contactShadow||child.userData.noBatch||child.material.transparent)continue;const key=child.material.uuid;if(!byMaterial.has(key))byMaterial.set(key,[]);byMaterial.get(key).push(child);}
 for(const list of byMaterial.values())if(list.length>2){const pos=[],normal=[],uv=[];for(const m of list){m.updateMatrix();const g=m.geometry,p=g.attributes.position,n=g.attributes.normal,u=g.attributes.uv,idx=g.index;for(let i=0;i<(idx?.count||p.count);i++){const k=idx?idx.getX(i):i,v=new T.Vector3(p.getX(k),p.getY(k),p.getZ(k)).applyMatrix4(m.matrix);pos.push(v.x,v.y,v.z);if(n){const v=new T.Vector3(n.getX(k),n.getY(k),n.getZ(k));v.set(v.x/m.scale.x,v.y/m.scale.y,v.z/m.scale.z).applyQuaternion(m.quaternion).normalize();normal.push(v.x,v.y,v.z);}if(u)uv.push(u.getX(k),u.getY(k));}}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));if(normal.length===pos.length)g.setAttribute('normal',new T.Float32BufferAttribute(normal,3));else g.computeVertexNormals();if(uv.length===pos.length/3*2)g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));const m=new T.Mesh(g,list[0].material);m.castShadow=m.receiveShadow=true;m.userData.ornamentBatch=true;list.forEach(c=>root.remove(c));root.add(m);
 }
}
