// All care progress is earned by travel on the character, never by pointerdown/click.
import {DOG_ZONES} from './character-layout.js';
export {DOG_ZONES} from './character-layout.js';
export const FACE_ZONES={
 cheeks:[{x:.28,y:.50,rx:.14,ry:.105},{x:.75,y:.56,rx:.135,ry:.105}],
 lips:[{x:.49,y:.615,rx:.125,ry:.055}],
 eyes:[{x:.405,y:.325,rx:.095,ry:.05},{x:.69,y:.385,rx:.1,ry:.05}],
 sparkles:[{x:.29,y:.5,rx:.17,ry:.12},{x:.76,y:.55,rx:.15,ry:.13}],
};
export const CARE_TOOLS=['brush','soap','rinse','dry','food'];
export const PAINT_TOOLS=['cheeks','lips','eyes','sparkles','eraser'];
export const inside=(p,z)=>((p.x-z.x)/z.rx)**2+((p.y-z.y)/z.ry)**2<=1;
export const distance=(a,b)=>Math.hypot(b.x-a.x,b.y-a.y);
const bound=(n,min=0,max=100)=>Math.max(min,Math.min(max,n));
export function freshTouch(){return{brush:Array(5).fill(0),soap:Array(5).fill(0),rinse:Array(5).fill(0),dry:Array(5).fill(0),teeth:Array(8).fill(0),paint:[]};}
export function normalizeTouch(raw,dog,teeth){const s=freshTouch();for(const key of ['brush','soap','rinse','dry','teeth']){const fallback=key==='brush'?Array(5).fill(dog.brushed):key==='teeth'?teeth.map(v=>v?100:0):dog.clean.map(v=>v?100:0);s[key]=s[key].map((_,i)=>Array.isArray(raw?.[key])&&Number.isFinite(raw[key][i])?bound(raw[key][i]):fallback[i]);}if(Array.isArray(raw?.paint))s.paint=raw.paint.slice(-100).filter(v=>v&&PAINT_TOOLS.includes(v.tool)&&Number.isInteger(v.color)&&v.color>=0&&v.color<4&&Array.isArray(v.points)).map(v=>({tool:v.tool,color:v.color,points:v.points.slice(0,96).filter(p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)).map(p=>({x:bound(p.x,0,1),y:bound(p.y,0,1)}))})).filter(v=>v.points.length>=2);return s;}
export function faceHit(tool,p){return tool==='eraser'?p.x>.14&&p.x<.88&&p.y>.1&&p.y<.8:(FACE_ZONES[tool]||[]).some(z=>inside(p,z));}
export function strokeSamples(a,b){const len=distance(a,b);if(!Number.isFinite(len)||len<.002||len>1.5)return[];const count=Math.max(1,Math.ceil(len/.012));return Array.from({length:count},(_,i)=>({x:a.x+(b.x-a.x)*(i+1)/count,y:a.y+(b.y-a.y)*(i+1)/count,travel:Math.min(len,.12)/count}));}
export function dogCare(s,tool,a,b){if(!CARE_TOOLS.includes(tool)||tool==='food')return{changed:false,blocked:false};const samples=strokeSamples(a,b);let changed=false,blocked=false;for(const p of samples){const candidates=DOG_ZONES.map((z,i)=>({z,i})).filter(({z})=>inside(p,z)).sort((u,v)=>((p.x-u.z.x)/u.z.rx)**2+((p.y-u.z.y)/u.z.ry)**2-((p.x-v.z.x)/v.z.rx)**2-((p.y-v.z.y)/v.z.ry)**2);if(!candidates.length)continue;const i=candidates[0].i;if(tool==='rinse'&&s.touch.soap[i]<100||tool==='dry'&&s.touch.rinse[i]<100){blocked=true;continue;}const key=tool==='brush'?'brush':tool,prior=s.touch[key][i];s.touch[key][i]=bound(prior+p.travel*(tool==='brush'?155:205));changed||=s.touch[key][i]!==prior;}s.dog.brushed=Math.floor(s.touch.brush.reduce((a,b)=>a+b,0)/5);s.dog.clean=s.touch.dry.map(v=>v>=100);return{changed,blocked};}
export function toothAt(p){if(p.x<.12||p.x>.88)return-1;const col=Math.min(3,Math.floor((p.x-.12)/.76*4));if(p.y>=.17&&p.y<=.43)return col;if(p.y>=.59&&p.y<=.85)return col+4;return-1;}
export function brushTeeth(s,a,b){let changed=false;for(const p of strokeSamples(a,b)){const i=toothAt(p);if(i<0)continue;const prior=s.touch.teeth[i];s.touch.teeth[i]=bound(prior+p.travel*230);changed||=prior!==s.touch.teeth[i];s.teeth[i]=s.touch.teeth[i]>=100;}return changed;}
export function paintTravel(tool,a,b){return strokeSamples(a,b).filter(p=>faceHit(tool,p)).reduce((n,p)=>n+p.travel,0);}
export function commitPaint(s,stroke){if(!PAINT_TOOLS.includes(stroke.tool)||stroke.points.length<2)return false;let travel=0;for(let i=1;i<stroke.points.length;i++)travel+=paintTravel(stroke.tool,stroke.points[i-1],stroke.points[i]);if(travel<.012)return false;s.touch.paint.push({tool:stroke.tool,color:stroke.color,points:stroke.points.slice(0,96).map(p=>({x:bound(p.x,0,1),y:bound(p.y,0,1)}))});if(s.touch.paint.length>100)s.touch.paint.shift();if(['cheeks','lips','eyes'].includes(stroke.tool))s.makeup[stroke.tool]=stroke.color;return true;}
export function resetCare(s){for(const key of ['brush','soap','rinse','dry'])s.touch[key]=Array(5).fill(0);s.dog.brushed=0;s.dog.clean=Array(5).fill(false);s.dog.fed=false;}
// Normalize a point in a contain-fitted image, including letterboxing.
export function surfacePoint(rect,clientX,clientY,aspect){if(!rect||rect.width<=0||rect.height<=0)return null;let w=rect.width,h=rect.height;if(w/h>aspect)w=h*aspect;else h=w/aspect;const x=(clientX-rect.left-(rect.width-w)/2)/w,y=(clientY-rect.top-(rect.height-h)/2)/h;return x>=0&&x<=1&&y>=0&&y<=1?{x,y}:null;}

export function normalizeDrawing(raw){return Array.isArray(raw)?raw.slice(-80).filter(v=>v&&Number.isInteger(v.color)&&v.color>=0&&v.color<6&&Array.isArray(v.points)).map(v=>({color:v.color,eraser:v.eraser===true,points:v.points.slice(0,96).filter(p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)).map(p=>({x:bound(p.x,0,1),y:bound(p.y,0,1)}))})).filter(v=>v.points.length>=2):[];}
