export const PALETTE=[['#d4cfc6','Varmgrå'],['#f2f0e9','Kritvit'],['#c4b49c','Sand'],['#899c86','Salvia'],['#647b88','Blågrå'],['#bc8871','Terrakotta'],['#4b5454','Kolgrå']];
export const COLORS=['#ddd8cc','#80908b','#455f6b','#c69263','#ae7768','#424749','#eeeae1'];
export const FLOORS=[['oak','Ek'],['light','Ljus ek'],['dark','Valnöt'],['tile','Klinker'],['carpet','Heltäckningsmatta']];
export const CATALOG={
 sofa:{name:'Soffa',w:2.65,d:1.15,color:'#77868a',icon:'🛋️'},armchair:{name:'Fåtölj',w:.88,d:.85,color:'#c29c7a',icon:'🪑'},
 bed:{name:'Dubbelsäng',w:1.8,d:2.1,color:'#e6dfd2',icon:'🛏️'},cot:{name:'Spjälsäng',w:.75,d:1.3,color:'#eeece5',icon:'🛏️'},childbed:{name:'Hussäng',w:1,d:1.9,color:'#ceaa78',icon:'🛏️'},
 table:{name:'Soffbord',w:1.1,d:.7,color:'#b99366',icon:'◯'},dining:{name:'Matbord',w:1.8,d:1,color:'#373c3b',icon:'▤'},chair:{name:'Stol',w:.5,d:.52,color:'#454d48',icon:'🪑'},
 cabinet:{name:'Byrå',w:1.5,d:.47,color:'#e6e4dc',icon:'▤'},shelf:{name:'Bokhylla',w:1.4,d:.38,color:'#e5e6df',icon:'▥'},desk:{name:'Skrivbord',w:1.5,d:.65,color:'#e8e7de',icon:'▤'},
 rug:{name:'Matta',w:2.5,d:1.8,color:'#b6bbb4',icon:'▱',flat:true},plant:{name:'Grön växt',w:.45,d:.45,color:'#d2c4aa',icon:'🪴'},lamp:{name:'Golvlampa',w:.45,d:.45,color:'#d8c7a1',icon:'💡'},tv:{name:'TV-bänk',w:1.5,d:.4,color:'#e4e5e0',icon:'▣'},
 bath:{name:'Badkar',w:1.75,d:.8,color:'#eeeee8',icon:'🛁',fixed:true},shower:{name:'Dusch',w:.9,d:1,color:'#455358',icon:'🚿',fixed:true},toilet:{name:'Toalett',w:.45,d:.72,color:'#eeeee8',icon:'◯',fixed:true},vanity:{name:'Kommod',w:.85,d:.48,color:'#e5e5df',icon:'▤',fixed:true},
 kitchen:{name:'Köksinredning',w:4.5,d:2.35,color:'#e9e7dd',icon:'▤',fixed:true},bench:{name:'Bastulav',w:1.8,d:.65,color:'#c79c67',icon:'▤',fixed:true},heater:{name:'Bastuaggregat',w:.45,d:.45,color:'#535a59',icon:'▥',fixed:true}
};
Object.assign(CATALOG,{
 wardrobe:{name:'Skjutdörrsgarderob',w:2.0,d:.65,color:'#eeeae2',icon:'▥',fixed:true},
 toybin:{name:'Leksaksförvaring',w:1.65,d:.45,color:'#c9a779',icon:'▤'},
 toyshelf:{name:'Hushylla',w:1.0,d:.35,color:'#eeeae4',icon:'⌂'},
 clothes:{name:'Klädstång',w:1.35,d:.45,color:'#d0c8bb',icon:'▥'}
});
CATALOG.builtins={name:'Platsbyggd bokhylla',w:3.45,d:.42,color:'#eeeae1',icon:'▥',fixed:true};
CATALOG.ovalcot={name:'Oval spjälsäng',w:.72,d:1.15,color:'#eeece5',icon:'🛏️'};
CATALOG.officechair={name:'Kontorsstol',w:.58,d:.6,color:'#929896',icon:'🪑'};
CATALOG.pedestal={name:'Runt sidobord',w:.55,d:.55,color:'#eeece5',icon:'◯'};
CATALOG.kitchen.w=3.55;CATALOG.kitchen.d=2.8;
CATALOG.cabinet.w=1.05;
CATALOG.bench.w=1.6;
let serial=0;
function o(type,x,z,rotation=0,color){return {id:'original-'+(++serial),type,x,z,rotation,color:color||CATALOG[type].color,scale:1};}
// Metres. One shared coordinate system; photographs support the connections,
// while dimensions and the unseen exterior envelope are estimates.
const room=(id,name,floor,x0,z0,x1,z1,extra)=>({id,name,floor,x:(x0+x1)/2,z:(z0+z1)/2,w:x1-x0,d:z1-z0,wall:'#e6e3db',flooring:'oak',doors:[],windows:[],objects:[],...extra});
export const ROOMS=[
 room('kitchen','Kök & matplats',0,4.2,0,8,7.2,{photos:['kitchen-1','kitchen-2'],wall:'#d5d0c6',windows:[{edge:'e',offset:-2.05,width:1.4},{edge:'e',offset:1.4,width:2.5,bottom:.12}],objects:[o('kitchen',0,-2.15,0),o('dining',.2,1.25,Math.PI/2),o('chair',-.65,.7,-Math.PI/2),o('chair',-.65,1.8,-Math.PI/2),o('chair',1.05,.7,Math.PI/2),o('chair',1.05,1.8,Math.PI/2),o('rug',.2,1.25,Math.PI/2,'#d4cdbc'),o('builtins',0,3.32,Math.PI),o('cabinet',-1.59,-1.3,Math.PI/2)]}),
 room('hall','Hall & trappa',0,0,2.3,4.2,5.6,{photos:['hall-1','hall-2'],objects:[o('wardrobe',-1.54,1.0,Math.PI/2)]}),
 room('playroom','Lekrum',0,0,0,4.2,2.3,{photos:['playroom-1','playroom-2'],flooring:'carpet',wall:'#c6bdb2',windows:[{edge:'w',offset:0,width:1.15}],objects:[o('toybin',1.54,0,Math.PI/2),o('toyshelf',-.9,-.9),o('wardrobe',-1.72,0,Math.PI/2,'#a5a6a2')]}),
 room('living','Vardagsrum',0,0,5.6,4.2,11,{photos:['living-1','living-2'],windows:[{edge:'w',offset:.1,width:2.3},{edge:'s',offset:0,width:1.8}],objects:[o('sofa',-.35,.0,0,'#e2ded1'),o('armchair',1.2,.9,-Math.PI/2,'#e4dece'),o('table',-.35,1.0,0,'#ddd8c8'),o('rug',-.35,1.0,0,'#d1d0c4'),o('tv',-.35,2.42,Math.PI),o('plant',.4,1.5)]}),
 room('alcove','Sovalkov',1,0,0,4.2,2.3,{photos:['alcove-1','alcove-2'],slope:'n',windows:[{edge:'w',offset:0,width:1.05}],objects:[o('bed',-.55,-.01,-Math.PI/2,'#ece9e0'),o('ovalcot',1.42,-.4,0,'#eceae2'),o('pedestal',-1.65,.68)]}),
 room('allrum','Allrum',1,0,3.4,4.2,7.2,{photos:['allrum-1','allrum-2','allrum-3'],windows:[{edge:'w',offset:0,width:2.65,bottom:.15}],objects:[o('sofa',-.4,-1.18,0,'#78858b'),o('table',-.4,.04),o('rug',-.4,.05,0,'#aaaead'),o('tv',-.9,1.64,Math.PI),o('plant',-1.83,1.5)]}),
 room('landing','Övre hall',1,4.2,0,5.4,7.2,{photos:['landing-1','landing-2'],objects:[]}),
 room('kids','Barnrum',1,5.4,0,8,3.6,{photos:['kids-1','kids-2'],wall:'#ddcfc6',slope:'e',windows:[{edge:'n',offset:0,width:1.1}],objects:[o('childbed',.69,-.4,0,'#dcc299'),o('cabinet',.55,1.47,Math.PI),o('rug',0,-.25,0,'#d2bfb0')]}),
 room('office','Kontor',1,5.4,3.6,8,5.4,{photos:['office-1','office-2'],flooring:'carpet',wall:'#d2cec6',slope:'e',objects:[o('desk',.1,-.54),o('officechair',.1,.17,Math.PI,'#929896'),o('clothes',.99,.1,Math.PI/2)]}),
 room('bedroom','Sovrum',1,0,7.2,3.4,11,{photos:['bedroom-1','bedroom-2','bedroom-3'],wall:'#cbc5ba',slope:'w',windows:[{edge:'s',offset:0,width:1.05}],objects:[o('bed',.56,.5,-Math.PI/2,'#d5c5b7'),o('cot',1.3,-1,0),o('cabinet',-.85,-1.6,0)]}),
 room('bathroom','Badrum',1,3.4,7.2,6.2,11,{photos:['bathroom-1','bathroom-2','bathroom-3'],wall:'#ebece7',flooring:'tile',slope:'e',windows:[{edge:'s',offset:-.35,width:1.0}],objects:[o('bath',.28,1.36),o('shower',.88,-.42,Math.PI/2),o('vanity',-1.1,-.58,Math.PI/2),o('toilet',-1.03,.86,Math.PI),o('plant',1.12,.64)]}),
 room('sauna','Bastu',1,6.2,7.2,8,9.3,{photos:['sauna-1'],wall:'#bc9564',flooring:'tile',slope:'e',objects:[o('bench',.5,.13,Math.PI/2),o('heater',-.55,.67)]})
];
// Openings are shared: geometry and collision use this exact list.
// x1=z1/x2=z2 describe the centre line of a wall opening in world metres.
export const OPENINGS=[
 {a:'hall',b:'playroom',axis:'z',at:2.3,lo:2.82,hi:3.82},
 {a:'hall',b:'kitchen',axis:'x',at:4.2,lo:3.45,hi:4.85},
 {a:'living',b:'kitchen',axis:'x',at:4.2,lo:5.7,hi:6.85},
 {a:'hall',b:'living',axis:'z',at:5.6,lo:2.1,hi:4.2,open:true},
 {a:'alcove',b:'landing',axis:'x',at:4.2,lo:.2,hi:2.3,open:true},
 {a:'allrum',b:'landing',axis:'x',at:4.2,lo:3.4,hi:7.2,open:true},
 {a:'landing',b:'kids',axis:'x',at:5.4,lo:2.4,hi:3.4},
 {a:'landing',b:'office',axis:'x',at:5.4,lo:3.85,hi:4.8},
 {a:'allrum',b:'bedroom',axis:'z',at:7.2,lo:2.05,hi:3.05},
 {a:'landing',b:'bathroom',axis:'z',at:7.2,lo:4.3,hi:5.25},
 {a:'bathroom',b:'sauna',axis:'x',at:6.2,lo:7.35,hi:8.25}
];
export const LEVEL_HEIGHT=2.85;
export const STAIR={x0:.5,x1:4.2,z0:2.3,z1:3.4,bottomZ:4.35,turnX:1.55,turnHeight:.66};
// Photograph anchors: looking UP the stairs, glass/sofa LEFT and alcove RIGHT.
// Looking from the playroom towards the living room, kitchen RIGHT, entry LEFT.
// Version 2 reversed this handedness. Correct the model coordinates themselves.
export const mirrorX=x=>8-x;
for(const r of ROOMS){
 r.sourceX=r.x;r.x=mirrorX(r.x);
 for(const obj of r.objects){obj.x=-obj.x;obj.rotation=-obj.rotation;obj.mirrored=true;}
 for(const w of r.windows){if(w.edge==='e')w.edge='w';else if(w.edge==='w')w.edge='e';else w.offset=-w.offset;}
 if(r.slope==='e')r.slope='w';else if(r.slope==='w')r.slope='e';
}
// IMG_0093: head of alcove bed against the full-height left wall when
// looking towards its window; the eave is on the right, beside the half-wall.
const alcove=ROOMS.find(r=>r.id==='alcove');alcove.slope='s';
Object.assign(alcove.objects.find(o=>o.type==='bed'),{x:.45,z:0,rotation:0});
ROOMS.find(r=>r.id==='allrum').slope='n';
for(const d of OPENINGS){if(d.axis==='x')d.at=mirrorX(d.at);else {const oldLo=d.lo;d.lo=mirrorX(d.hi);d.hi=mirrorX(oldLo);}}
for(const r of ROOMS){
 for(const d of OPENINGS.filter(d=>d.a===r.id||d.b===r.id)){
  const edge=d.axis==='x'?(d.at<r.x?'w':'e'):(d.at<r.z?'n':'s');
  r.doors.push({edge,offset:(d.lo+d.hi)/2-(d.axis==='x'?r.z:r.x),width:d.hi-d.lo,to:d.a===r.id?d.b:d.a,open:d.open});
 }
}
export const clone=value=>JSON.parse(JSON.stringify(value));
export const DEFAULT_STATE=Object.fromEntries(ROOMS.map(r=>[r.id,{wall:r.wall,flooring:r.flooring,objects:clone(r.objects)}]));
export function dimensions(obj){const c=CATALOG[obj.type];const sin=Math.abs(Math.sin(obj.rotation)),cos=Math.abs(Math.cos(obj.rotation));return {w:(c.w*cos+c.d*sin)*obj.scale,d:(c.w*sin+c.d*cos)*obj.scale};}
export function constrain(obj,room){const unscaled=dimensions({...obj,scale:1});obj.scale=Math.min(obj.scale,(room.w-.16)/unscaled.w,(room.d-.16)/unscaled.d);const d=dimensions(obj);obj.x=Math.max(-room.w/2+d.w/2+.08,Math.min(room.w/2-d.w/2-.08,obj.x));obj.z=Math.max(-room.d/2+d.d/2+.08,Math.min(room.d/2-d.d/2-.08,obj.z));return obj;}
export function blocked(x,z,room,objects){if(Math.abs(x)>room.w/2-.19||Math.abs(z)>room.d/2-.19)return true;return objects.some(o=>{if(CATALOG[o.type].flat)return false;const d=dimensions(o);return Math.abs(x-o.x)<d.w/2+.13&&Math.abs(z-o.z)<d.d/2+.13;});}
export function doorPosition(door,room,inset=0){const {edge,offset}=door;if(edge==='n')return {x:offset,z:-room.d/2+inset,yaw:Math.PI};if(edge==='s')return {x:offset,z:room.d/2-inset,yaw:0};if(edge==='e')return {x:room.w/2-inset,z:offset,yaw:Math.PI/2};return {x:-room.w/2+inset,z:offset,yaw:-Math.PI/2};}
export function safeSpawn(room,objects,from){const door=room.doors.find(d=>d.to===from)||room.doors[0];const start=door?doorPosition(door,room,.65):{x:0,z:0,yaw:0};if(!blocked(start.x,start.z,room,objects))return start;for(let radius=.4;radius<6;radius+=.3){for(let a=0;a<Math.PI*2;a+=.3){const x=start.x+Math.sin(a)*radius,z=start.z+Math.cos(a)*radius;if(!blocked(x,z,room,objects))return {x,z,yaw:start.yaw};}}return {x:0,z:0,yaw:0};}
export function findPlacement(room,objects,type){const proto={type,rotation:0,scale:1,x:0,z:0};for(let radius=0;radius<7;radius+=.25){for(let a=0;a<Math.PI*2;a+=.5){const candidate=constrain({...proto,x:Math.sin(a)*radius,z:Math.cos(a)*radius},room);const d=dimensions(candidate);if(!objects.some(o=>{if(CATALOG[o.type].flat||CATALOG[type].flat)return false;const b=dimensions(o);return Math.abs(candidate.x-o.x)<(d.w+b.w)/2+.06&&Math.abs(candidate.z-o.z)<(d.d+b.d)/2+.06;}))return candidate;}}return null;}
export function validateState(value){if(!value||value.version!==4||!value.rooms)return null;const rooms=clone(DEFAULT_STATE);for(const room of ROOMS){const s=value.rooms[room.id];if(!s||!/^#[a-f\d]{6}$/i.test(s.wall)||!FLOORS.some(f=>f[0]===s.flooring)||!Array.isArray(s.objects)||s.objects.length>80)return null;const ids=new Set();for(const obj of s.objects){if(!obj||!Object.hasOwn(CATALOG,obj.type)||typeof obj.id!=='string'||!/^[-a-z0-9]{1,80}$/i.test(obj.id)||ids.has(obj.id)||![obj.x,obj.z,obj.rotation,obj.scale].every(Number.isFinite)||obj.scale<.5||obj.scale>1.6||!/^#[a-f\d]{6}$/i.test(obj.color))return null;ids.add(obj.id);constrain(obj,room);}rooms[room.id]=clone(s);}return rooms;}
