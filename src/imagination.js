import {DOG_MOUTH,DOG_ZONES} from './character-layout.js';
import {COLOR_PAGES} from './coloring.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:a)),count=v=>Math.floor(clamp(v,0,999));
const page=id=>COLOR_PAGES.some(p=>p.id===id),point=p=>({x:clamp(p?.x,.06,.94),y:clamp(p?.y,.12,.84)});
export const MISCHIEF=['slipper','hide','sock','hide','slipper','sock'];
export const PLAYROOM_MODES=['blocks','car','music','clinic','cafe','camp','creations','puzzle'];
export const RECIPES=[['apple','berry'],['banana','berry'],['apple','banana']];
export function freshImagination(){return {mischief:{round:0,active:'none',resolved:0},blocks:Array.from({length:6},(_,id)=>({id,x:.14+id*.14,y:.79,level:0})),car:[],notes:[],clinic:{step:0,progress:0,rounds:0},cafe:{rounds:0,ingredients:[],mixed:0,poured:0,served:false},camp:{pieces:[],found:[],sleep:0,rounds:0},creations:{shirt:null,decor:null},puzzle:{page:'garden',slots:[-1,-1,-1,-1],rounds:0}};}
export function normalizeImagination(raw={}){const s=freshImagination(),r=raw&&typeof raw==='object'?raw:{};
 s.mischief={round:count(r.mischief?.round),active:MISCHIEF.includes(r.mischief?.active)?r.mischief.active:'none',resolved:count(r.mischief?.resolved)};
 if(Array.isArray(r.blocks)){const ids=new Set();for(const b of r.blocks.slice(0,6))if(Number.isInteger(b?.id)&&b.id>=0&&b.id<6&&!ids.has(b.id)){ids.add(b.id);s.blocks[b.id]={id:b.id,...point(b),level:Math.floor(clamp(b.level,0,6))};}}
 s.car=Array.isArray(r.car)?r.car.slice(0,160).filter(p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y)).map(point):[];
 s.notes=Array.isArray(r.notes)?r.notes.filter(n=>Number.isInteger(n)&&n>=0&&n<6).slice(-24):[];
 s.clinic={step:Math.floor(clamp(r.clinic?.step,0,4)),progress:clamp(r.clinic?.progress,0,1),rounds:count(r.clinic?.rounds)};
 s.cafe={rounds:count(r.cafe?.rounds),ingredients:[...new Set((Array.isArray(r.cafe?.ingredients)?r.cafe.ingredients:[]).filter(i=>['apple','banana','berry'].includes(i)))].slice(0,2),mixed:clamp(r.cafe?.mixed,0,1),poured:clamp(r.cafe?.poured,0,1),served:r.cafe?.served===true};
 s.camp={pieces:[...new Set((Array.isArray(r.camp?.pieces)?r.camp.pieces:[]).filter(i=>['pillow1','pillow2','roof'].includes(i)))],found:[...new Set((Array.isArray(r.camp?.found)?r.camp.found:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<3))],sleep:clamp(r.camp?.sleep,0,1),rounds:count(r.camp?.rounds)};
 for(const slot of ['shirt','decor']){const v=r.creations?.[slot];if(page(v?.page)&&typeof v.image==='string'&&v.image.length<90000&&/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(v.image))s.creations[slot]={page:v.page,image:v.image};}
 const placed=new Set();s.puzzle={page:page(r.puzzle?.page)?r.puzzle.page:'garden',slots:[0,1,2,3].map(i=>{const v=r.puzzle?.slots?.[i];if(v!==i||placed.has(v))return -1;placed.add(v);return v;}),rounds:count(r.puzzle?.rounds)};return s;}
export const imagination=s=>s.dollhouse.play.imagine;
export function startMischief(s){const m=imagination(s).mischief;if(m.active!=='none')return m.active;m.active=MISCHIEF[m.round%MISCHIEF.length];m.round=(m.round+1)%1000;return m.active;}
export function resolveMischief(s,action){const m=imagination(s).mischief;if(!({slipper:['trade','call'],hide:['blanket','call'],sock:['trade','pet']})[m.active]?.includes(action))return false;m.active='none';m.resolved=Math.min(999,m.resolved+1);return true;}
export function dropBlock(s,id,p){const blocks=imagination(s).blocks,b=blocks.find(v=>v.id===id);if(!b||!Number.isFinite(p?.x)||!Number.isFinite(p?.y))return false;if(blocks.some(v=>v.id!==id&&v.level>b.level&&Math.abs(v.x-b.x)<.07&&Math.abs(v.y-(b.y-(v.level-b.level)*.095))<.025))return false;
 const support=blocks.filter(v=>v.id!==id&&v.level>0&&Math.abs(v.x-p.x)<.09&&Math.abs(v.y-.095-p.y)<.12).sort((a,b)=>b.level-a.level)[0];
 if(support&&support.level<6){b.x=support.x;b.y=support.y-.095;b.level=support.level+1;}else{b.x=clamp(p.x,.09,.91);b.y=p.y>.73?.79:.68;b.level=p.y>.73?0:1;}return true;}
export function toppleBlocks(s){const b=imagination(s).blocks;if(!b.some(v=>v.level>1))return false;b.forEach((v,i)=>Object.assign(v,{x:.15+i*.14,y:.68+(i%2)*.04,level:1}));return true;}
export function storeCarPath(s,path){if(!Array.isArray(path))return false;const p=path.filter(p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y)).slice(0,160).map(point);let length=0;for(let i=1;i<p.length;i++)length+=Math.hypot(p[i].x-p[i-1].x,p[i].y-p[i-1].y);if(p.length<3||length<.16)return false;imagination(s).car=p;return true;}
export function addNote(s,n){if(!Number.isInteger(n)||n<0||n>5)return false;const a=imagination(s).notes;a.push(n);if(a.length>24)a.shift();return true;}
export function clinicAction(s,tool,amount=0){const c=imagination(s).clinic;if(c.step>=4)return false;const expected=['listen','plaster','blanket','food'][c.step];if(tool!==expected)return false;if(tool==='listen'){if(!Number.isFinite(amount)||amount<=0)return false;c.progress=clamp(c.progress+amount,0,1);if(c.progress<1)return 'progress';}c.step++;c.progress=0;if(c.step===4){c.rounds=Math.min(999,c.rounds+1);s.dog.fed=true;s.dollhouse.dog.affection=Math.min(100,s.dollhouse.dog.affection+25);return 'complete';}return 'next';}
export function cafeAction(s,tool,amount=0){const c=imagination(s).cafe;if(c.served)return false;const recipe=RECIPES[c.rounds%3];if(recipe.includes(tool)&&!c.ingredients.includes(tool)){c.ingredients.push(tool);return 'ingredient';}if(tool==='mix'&&recipe.every(i=>c.ingredients.includes(i))&&Number.isFinite(amount)&&amount>0){c.mixed=clamp(c.mixed+amount,0,1);return 'mix';}if(tool==='pot'&&c.mixed===1&&amount>0){c.poured=clamp(c.poured+amount,0,1);return 'pour';}if(tool==='serve'&&c.mixed===1&&c.poured===1){c.served=true;c.rounds=Math.min(999,c.rounds+1);return 'complete';}return false;}
export const FIREFLIES=[{x:.24,y:.3},{x:.76,y:.22},{x:.84,y:.58}];
export function campAction(s,tool,p,amount=0){const c=imagination(s).camp;if(c.sleep===1)return false;if(['pillow1','pillow2','roof'].includes(tool)&&!c.pieces.includes(tool)){if(tool==='roof'&&c.pieces.length<2)return false;c.pieces.push(tool);return 'build';}if(tool==='torch'&&c.pieces.length===3){const id=FIREFLIES.findIndex((v,i)=>!c.found.includes(i)&&Math.hypot(v.x-p.x,v.y-p.y)<.13);if(id>=0){c.found.push(id);return 'firefly';}}if(tool==='pet'&&c.found.length===3&&amount>0){c.sleep=clamp(c.sleep+amount,0,1);if(c.sleep===1){c.rounds=Math.min(999,c.rounds+1);return 'complete';}return 'sleep';}return false;}
export function resetPretend(s,mode){const i=imagination(s),fresh=freshImagination();if(!['clinic','cafe','camp'].includes(mode))return false;const rounds=i[mode].rounds;i[mode]={...fresh[mode],rounds};return true;}
export function startPuzzle(s,id){if(!page(id))return false;const p=imagination(s).puzzle;p.page=id;p.slots=[-1,-1,-1,-1];return true;}
export function dropPuzzle(s,piece,slot){const p=imagination(s).puzzle;if(!Number.isInteger(piece)||piece<0||piece>3||piece!==slot||p.slots[slot]===piece)return false;p.slots[slot]=piece;if(p.slots.every((v,i)=>v===i)){p.rounds=Math.min(999,p.rounds+1);return 'complete';}return true;}
export function useCreation(s,slot,id,image){if(!['shirt','decor'].includes(slot)||!page(id)||typeof image!=='string'||image.length>=90000||!/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(image))return false;imagination(s).creations[slot]={page:id,image};return true;}

export function clinicTargets(width,height,round=0){const aspect=width/height,w=Math.min(.44,.74/aspect),h=w*aspect,x=.3+(.44-w)/2,y=.02+(.74-h)/2,map=p=>({x:x+p.x*w,y:y+p.y*h});return{listen:map(DOG_ZONES[1]),plaster:map(DOG_ZONES[round%2?2:3]),blanket:map({x:.43,y:.68}),food:map(DOG_MOUTH)};}

export function puzzleGeometry(width,height){const side=Math.min(width*.44,height*.52);return{x:.5-side/width/2,y:.12,w:side/width,h:side/height};}
export function puzzleSlot(p,width,height){const g=puzzleGeometry(width,height);if(p.x<g.x||p.x>g.x+g.w||p.y<g.y||p.y>g.y+g.h)return -1;return(p.x<.5?0:1)+(p.y<g.y+g.h/2?0:2);}
