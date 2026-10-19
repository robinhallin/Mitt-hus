export const ROOM_COLORS=['#c9badb','#d4aebd','#a5bdb0','#d7b991','#a9bed4','#e5d5bc'];
export const OUTFITS=['skirt','trousers','dress','overalls','pajamas'];
export const PATTERNS=['plain','dots','stripes','stars','hearts'];
export const HEADWEAR=['none','sunhat','crown'];
export const FURNITURE={
 wardrobe:{name:'Garderob',emoji:'🚪',w:17,h:48,scene:'dress'},
 vanity:{name:'Sminkbord',emoji:'🪞',w:17,h:38,scene:'makeup'},
 bed:{name:'Säng',emoji:'🛏️',w:26,h:28,scene:'adventures'},
 shelf:{name:'Bokhylla',emoji:'📚',w:21,h:18,wall:true,scene:'craft'},
 rug:{name:'Matta',emoji:'🌼',w:36,h:18,low:true,scene:'craft'},
 dogbed:{name:'Sigges bädd',emoji:'🐾',w:20,h:14,low:true,scene:'dog'},
 chair:{name:'Fåtölj',emoji:'🪑',w:15,h:25,scene:'adventures'},
 plant:{name:'Växt',emoji:'🌱',w:10,h:24,scene:'craft'}
};
export function defaultFurniture(){return[
 {id:'item-1',type:'wardrobe',x:14,y:72,color:1,flip:false},
 {id:'item-2',type:'vanity',x:33,y:72,color:3,flip:false},
 {id:'item-3',type:'bed',x:83,y:76,color:0,flip:false},
 {id:'item-4',type:'shelf',x:82,y:31,color:3,flip:false},
 {id:'item-5',type:'rug',x:50,y:94,color:1,flip:false},
 {id:'item-6',type:'dogbed',x:80,y:94,color:2,flip:false}
 ];}
export function constrainFurniture(item){const c=FURNITURE[item.type];if(!c)return null;const x=Number.isFinite(item.x)?item.x:50,y=Number.isFinite(item.y)?item.y:80;return{...item,x:Math.max(c.w/2+2,Math.min(98-c.w/2,x)),y:Math.max(c.wall?c.h+4:70,Math.min(c.wall?57:96,y))};}
export function normalizeFurniture(raw){if(!Array.isArray(raw))return defaultFurniture();const ids=new Set();return raw.slice(0,12).filter(v=>v&&Object.hasOwn(FURNITURE,v.type)&&typeof v.id==='string'&&/^item-\d{1,6}$/.test(v.id)&&!ids.has(v.id)&&ids.add(v.id)).map(v=>constrainFurniture({id:v.id,type:v.type,x:v.x,y:v.y,color:Number.isInteger(v.color)&&v.color>=0&&v.color<6?v.color:0,flip:v.flip===true}));}
export function addFurniture(s,type){if(!Object.hasOwn(FURNITURE,type)||s.room.furniture.length>=12)return null;let n=1;while(s.room.furniture.some(v=>v.id===`item-${n}`))n++;const item=constrainFurniture({id:`item-${n}`,type,x:50,y:FURNITURE[type].wall?36:84,color:0,flip:false});s.room.furniture.push(item);return item;}
export function moveFurniture(s,id,x,y){const i=s.room.furniture.findIndex(v=>v.id===id);if(i<0||!Number.isFinite(x)||!Number.isFinite(y))return false;s.room.furniture[i]=constrainFurniture({...s.room.furniture[i],x,y});return true;}
export const ADVENTURES=[
 {id:'picnic',title:'Picknick med Sigge',emoji:'🧺',intro:'Solen skiner! Ska vi packa en liten picknick?',ending:'Ni hittar en skön plats i gräset. Sigge rullar på filten och ni delar en mysig stund.',steps:[
 {event:'outfit',scene:'dress',title:'Välj picknickkläder',hint:'Välj det du gillar och tryck på klar.'},
 {event:'garden',scene:'garden',title:'Hitta picknicksakerna',hint:'Kan du hitta äpplet, bollen och blomman i trädgården?'},
 {event:'feed',scene:'dog',title:'Något gott till Sigge',hint:'Välj Mums och tryck på Sigge.'},
 {event:'finale',scene:'adventures',title:'Dags för picknick!',hint:'Rulla ut filten och njut tillsammans.'}]},
 {id:'party',title:'Sigges lilla kalas',emoji:'🎈',intro:'Sigge vill ha ett kalas med sin allra bästa vän!',ending:'Musiken spelar och Sigges svans går som en propeller. Vilket härligt kalas ni ordnade!',steps:[
 {event:'craft',scene:'craft',title:'Pynta till kalaset',hint:'Sätt ett klistermärke på väggen.'},
 {event:'brush',scene:'dog',title:'En fluffig festkompis',hint:'Borsta Sigges päls mjuk och skön.'},
 {event:'outfit',scene:'dress',title:'Dina egna kalaskläder',hint:'Välj en festlig stil som känns kul.'},
 {event:'finale',scene:'adventures',title:'Nu börjar kalaset!',hint:'Fira med Sigge och alla gosedjuren.'}]},
 {id:'evening',title:'En mysig kväll',emoji:'🌙',intro:'Det börjar bli kväll. Gör plats för en skön stund tillsammans.',ending:'Lea och Sigge kryper ner i ett mysigt rum. En lugn stund och en riktigt god natt.',steps:[
 {event:'tidy',scene:'tidy',title:'Plats för kvällsmys',hint:'Hjälp de sex sakerna att hitta sina lådor.'},
 {event:'furnish',scene:'furnish',title:'Gör en myshörna',hint:'Flytta eller lägg till något i rummet.'},
 {event:'teeth',scene:'teeth',title:'Ett rent litet leende',hint:'Borsta alla åtta tänderna.'},
 {event:'finale',scene:'adventures',title:'God natt, Sigge!',hint:'Tänd stjärnorna och kryp upp med din vän.'}]}
];
export const GARDEN_FINDS=[{id:'apple',emoji:'🍎',name:'Äpplet',x:24,y:62},{id:'ball',emoji:'🏐',name:'Bollen',x:72,y:79},{id:'flower',emoji:'🌼',name:'Blomman',x:57,y:48}];
export function freshAdventures(){return{active:null,progress:Object.fromEntries(ADVENTURES.map(a=>[a.id,{step:0,prepared:false,found:[]}])),completed:[]};}
export function normalizeAdventures(raw){const s=freshAdventures();if(!raw||typeof raw!=='object')return s;if(ADVENTURES.some(a=>a.id===raw.active))s.active=raw.active;for(const a of ADVENTURES){const r=raw.progress?.[a.id];if(!r)continue;s.progress[a.id]={step:Number.isInteger(r.step)?Math.max(0,Math.min(a.steps.length,r.step)):0,prepared:r.prepared===true,found:GARDEN_FINDS.filter(f=>Array.isArray(r.found)&&r.found.includes(f.id)).map(f=>f.id)};}s.completed=ADVENTURES.filter(a=>Array.isArray(raw.completed)&&raw.completed.includes(a.id)).map(a=>a.id);return s;}
export function activeAdventure(s){const story=ADVENTURES.find(a=>a.id===s.adventures.active);if(!story)return null;const progress=s.adventures.progress[story.id];return{story,progress,step:story.steps[progress.step],finished:progress.step===story.steps.length};}
export function chooseAdventure(s,id,replay=false){if(!ADVENTURES.some(a=>a.id===id))return false;s.adventures.active=id;if(replay)s.adventures.progress[id]={step:0,prepared:false,found:[]};return true;}
export function prepareAdventureStep(s){const a=activeAdventure(s);if(!a?.step||a.progress.prepared)return false;switch(a.step.event){case 'tidy':s.tidy=[];break;case 'teeth':s.teeth=Array(8).fill(false);break;case 'brush':s.dog.brushed=0;break;case 'feed':s.dog.fed=false;break;}a.progress.prepared=true;return true;}
export function advanceAdventure(s,event){const a=activeAdventure(s);if(!a?.step||a.step.event!==event)return null;a.progress.step++;a.progress.prepared=false;if(a.progress.step===a.story.steps.length&&!s.adventures.completed.includes(a.story.id))s.adventures.completed.push(a.story.id);return{title:a.story.title,finished:a.progress.step===a.story.steps.length,next:a.story.steps[a.progress.step]};}
export function findGardenItem(s,id){const a=activeAdventure(s);if(!a||a.step?.event!=='garden'||!GARDEN_FINDS.some(f=>f.id===id)||a.progress.found.includes(id))return false;a.progress.found.push(id);return true;}
