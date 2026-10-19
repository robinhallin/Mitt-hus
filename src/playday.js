// Persistent play, separate from transient animation. Old saves keep their version.
export const PACKING = [
  {id:'ball',emoji:'🎾',name:'Bollen',hint:'Kasta och hämta'},
  {id:'bubbles',emoji:'🫧',name:'Bubblor',hint:'Sigge jagar bubblor'},
  {id:'water',emoji:'🚿',name:'Vattenkannan',hint:'Väck blommorna'},
  {id:'bear',emoji:'🧸',name:'Nallen',hint:'En gäst på filten'},
  {id:'blanket',emoji:'🌈',name:'Regnbågsfilten',hint:'Fika i alla färger'},
];
export const DISCOVERIES = [
  {id:'chest',emoji:'🐚',name:'Skatten i lådan'},
  {id:'drawer',emoji:'🎀',name:'Den hemliga rosetten'},
  {id:'cushion',emoji:'🪶',name:'En mjuk liten fjäder'},
  {id:'flower',emoji:'🌸',name:'Min första blomma'},
  {id:'butterfly',emoji:'🦋',name:'En fjärilskompis'},
  {id:'sock',emoji:'🧦',name:'Sigges tokiga fynd'},
  {id:'bubbles',emoji:'🫧',name:'Bubbeljägaren'},
  {id:'mud',emoji:'🐾',name:'Ett lerigt äventyr'},
];
export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:a));
const count=(v,max=999)=>Math.floor(clamp(v,0,max));
const list=(raw,ids,max=ids.length)=>Array.isArray(raw)?[...new Set(raw.filter(v=>ids.includes(v)))].slice(0,max):[];
export function freshDay(){return {phase:'packing',packed:[],trips:0,discoveries:[],water:0,muddy:false,prints:[100,100,100,100,100],returns:0,popped:0,belly:0,parade:{background:'flowers',pose:'proud',music:'happy',x:.5},tea:{guest:'bear',cups:[0,0,0],snacks:[false,false,false]},picnic:[false,false],photos:[],nextPhotoId:1};}
export function normalizeDay(raw={},normalizePicture){
  const d=freshDay();if(!raw||typeof raw!=='object')return d;
  d.phase=['packing','garden','picnic','finished'].includes(raw.phase)?raw.phase:d.phase;
  d.packed=list(raw.packed,PACKING.map(v=>v.id),3);d.trips=count(raw.trips);
  d.discoveries=list(raw.discoveries,DISCOVERIES.map(v=>v.id));d.water=clamp(raw.water,0,100);
  d.muddy=raw.muddy===true;d.prints=d.prints.map((_,i)=>clamp(raw.prints?.[i]??100,0,100));
  for(const k of ['returns','popped','belly'])d[k]=count(raw[k]);
  const p=raw.parade||{};for(const [key,ids]of Object.entries({background:['flowers','rainbow','stars'],pose:['proud','dance','bow','jump'],music:['happy','dream','bounce']}))if(ids.includes(p[key]))d.parade[key]=p[key];d.parade.x=clamp(p.x??.5,.3,.68);
  d.tea.guest=['bear','bunny','cat'].includes(raw.tea?.guest)?raw.tea.guest:'bear';d.tea.cups=d.tea.cups.map((_,i)=>clamp(raw.tea?.cups?.[i],0,100));d.tea.snacks=d.tea.snacks.map((_,i)=>raw.tea?.snacks?.[i]===true);
  d.picnic=d.picnic.map((_,i)=>raw.picnic?.[i]===true);
  d.photos=Array.isArray(raw.photos)&&normalizePicture?raw.photos.slice(0,8).filter(v=>v&&/^photo-[0-9]{1,9}$/.test(v.id)&&['parade','tea','picnic'].includes(v.kind)).map(v=>({id:v.id,kind:v.kind,picture:normalizePicture(v.picture),settings:normalizePhotoSettings(v.settings)})).filter((v,i,a)=>a.findIndex(q=>q.id===v.id)===i):[];
  d.nextPhotoId=Math.max(count(raw.nextPhotoId,999999999)||1,...d.photos.map(v=>Number(v.id.slice(6))+1));return d;
}
function normalizePhotoSettings(v={}){return {cups:[0,1,2].map(i=>clamp(v?.cups?.[i],0,100)),snacks:[0,1,2].map(i=>v?.snacks?.[i]===true),picnic:[0,1].map(i=>v?.picnic?.[i]===true),background:['flowers','rainbow','stars'].includes(v?.background)?v.background:'flowers',pose:['proud','dance','bow','jump'].includes(v?.pose)?v.pose:'proud',x:clamp(v?.x??.5,.3,.68),guest:['bear','bunny','cat'].includes(v?.guest)?v.guest:'bear',blanket:v?.blanket===true,bear:v?.bear===true,muddy:v?.muddy===true};}
export function discover(s,id){if(!DISCOVERIES.some(v=>v.id===id)||s.day.discoveries.includes(id))return false;s.day.discoveries.push(id);return true;}
export function togglePack(s,id){if(s.day.phase!=='packing'||!PACKING.some(v=>v.id===id))return false;const p=s.day.packed,i=p.indexOf(id);if(i>=0)p.splice(i,1);else if(p.length<3)p.push(id);else return false;return true;}
export function startDay(s){if(s.day.phase!=='packing')return false;s.day.phase='garden';s.day.picnic=[false,false];return true;}
export function newDay(s){s.day.phase='packing';s.day.packed=[];s.day.picnic=[false,false];s.day.water=0;}
export function canPlay(s,mode,free=false){return free||!['ball','bubbles','water'].includes(mode)||s.day.packed.includes(mode);}
export function makeMuddy(s){if(s.day.muddy)return false;s.day.muddy=true;s.day.prints=Array(5).fill(0);for(const i of [2,3]){s.dog.clean[i]=false;for(const tool of ['soap','rinse','dry'])s.touch[tool][i]=0;}discover(s,'mud');return true;}
export function washDay(s){if(s.dog.clean.every(Boolean))s.day.muddy=false;}
export function wipePrints(s,p,travel){if(travel<=0)return false;let changed=false;s.day.prints.forEach((v,i)=>{if(Math.hypot(p.x-(.12+i*.19),p.y-.5)<.12&&v<100){s.day.prints[i]=clamp(v+travel*700,0,100);changed=true;}});return changed;}
export function waterPlant(s,amount){const before=s.day.water;s.day.water=clamp(before+Math.max(0,amount),0,100);if(s.day.water===100){discover(s,'flower');discover(s,'butterfly');}return before!==s.day.water;}
export function finishFetch(s){s.day.returns++;s.dog.played=Math.min(99,s.dog.played+1);const sock=s.day.returns%3===0;if(sock)discover(s,'sock');return sock?'sock':'ball';}
export function pourTea(s,index,amount){if(!Number.isInteger(index)||index<0||index>2)return false;const before=s.day.tea.cups[index];s.day.tea.cups[index]=clamp(before+Math.max(0,amount),0,100);return before!==s.day.tea.cups[index];}
export function finishPicnic(s){if(s.day.phase!=='picnic'||!s.day.picnic.every(Boolean))return false;s.day.phase='finished';s.day.trips=Math.min(999,s.day.trips+1);return true;}
export function takePhoto(s,kind){if(!['parade','tea','picnic'].includes(kind)||s.day.photos.length>=8)return false;const picture={lea:s.lea,makeup:s.makeup,touch:{paint:s.touch.paint},room:s.room,dog:s.dog};s.day.photos.push({id:`photo-${s.day.nextPhotoId++}`,kind,picture:structuredClone(picture),settings:normalizePhotoSettings({...s.day.parade,guest:s.day.tea.guest,cups:s.day.tea.cups,snacks:s.day.tea.snacks,picnic:s.day.picnic,blanket:s.day.packed.includes('blanket'),bear:s.day.packed.includes('bear'),muddy:s.day.muddy})});return true;}

// Deterministic motion is testable without a real clock. No reward until the return.
export function fetchFrame(target,elapsed){
  const origin={x:.22,y:.81},start={x:.2,y:.79},out=.85,run=1.1,grab=.25,back=1.35;
  const mix=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
  let dog={...origin},ball={...start},pose='sit',carry=false,facing=1,done=false;
  if(elapsed<out){const t=clamp(elapsed/out);ball=mix(start,target,t);ball.y-=Math.sin(t*Math.PI)*.27;}
  else if(elapsed<out+run){ball=target;dog=mix(origin,target,clamp((elapsed-out)/run));pose='run';facing=target.x>=origin.x?1:-1;}
  else if(elapsed<out+run+grab){ball=target;dog=target;pose='run';facing=target.x>=origin.x?1:-1;}
  else {const t=clamp((elapsed-out-run-grab)/back);dog=mix(target,origin,t);pose=t<1?'run':'sit';carry=t<1;ball=t<1?{x:dog.x+.075*(target.x>=origin.x?-1:1),y:dog.y-.11}:start;facing=target.x>=origin.x?-1:1;done=t>=1;}
  return {dog,ball,pose,carry,facing,frame:Math.floor(elapsed/.12)%4,done};
}
