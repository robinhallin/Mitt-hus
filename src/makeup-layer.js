import {PALETTES} from './state.js';
import {FACE_ZONES} from './touch.js';
const decimal=n=>Number(n.toFixed(4));
export function pathData(points,w=1,h=1){return points.map((p,i)=>`${i?'L':'M'}${decimal(p.x*w)} ${decimal(p.y*h)}`).join(' ');}
const width=tool=>({cheeks:.085,lips:.035,eyes:.035,sparkles:.055,eraser:.12,draw:.025})[tool]||.04;
const color=stroke=>stroke.tool==='cheeks'?['#ed8fa5','#e7aa91','#dba2b7','#ecb3aa'][stroke.color]:['sparkles','hearts','flowers'].includes(stroke.tool)?['#e4bf70','#dca3bd','#c0acdb','#9fc7bd'][stroke.color]:PALETTES[stroke.tool]?.[stroke.color]||'#e8a8be';
export function makeupDefinitions(prefix='face'){
 return `<defs>${Object.entries(FACE_ZONES).map(([key,zones])=>`<clipPath id="${prefix}-${key}">${zones.map(z=>`<ellipse cx="${z.x}" cy="${z.y}" rx="${z.rx}" ry="${z.ry}"/>`).join('')}</clipPath>`).join('')}</defs>`;
}
function strokePath(s,erase=false){return `<path d="${pathData(s.points)}" fill="none" stroke="${erase?'black':color(s)}" stroke-width="${width(s.tool)*([.65,1.2,1.8][s.size]||1)}" stroke-linecap="round" stroke-linejoin="round" opacity="${erase?1:s.tool==='cheeks'?.48:s.tool==='sparkles'?.8:.65}"/>`;}
export function makeupPaint(s,live=null,prefix='face'){
 const list=[...s.touch.paint,...(live&&live.points.length>1?[live]:[])];let out='';
 for(const tool of ['cheeks','lips','eyes'])if(s.makeup[tool]!==null&&!list.some(v=>v.tool===tool)){const legacy={tool,color:s.makeup[tool]};out+=`<g clip-path="url(#${prefix}-${tool})"><rect width="1" height="1" fill="${color(legacy)}" opacity=".28"/></g>`;}
 list.forEach((stroke,i)=>{if(stroke.tool==='eraser'){const mask=`${prefix}-erase-${i}`;out=`<defs><mask id="${mask}" maskUnits="userSpaceOnUse" x="0" y="0" width="1" height="1"><rect width="1" height="1" fill="white"/>${strokePath(stroke,true)}</mask></defs><g mask="url(#${mask})">${out}</g>`;}else out+=`<g clip-path="url(#${prefix}-${stroke.tool})">${['sparkles','hearts','flowers'].includes(stroke.tool)?stampTrail(stroke):strokePath(stroke)}</g>`;});return out;
}

function stampTrail(stroke){const points=[];let previous=null;for(const p of stroke.points){if(!previous||Math.hypot(p.x-previous.x,p.y-previous.y)>.055){points.push(p);previous=p;}}return points.map(p=>{const size=[.65,1,1.4][stroke.size]||1;const stamp=stroke.tool==='hearts'?'<path d="M0 .025L-.022 .004Q-.034-.025-.014-.025Q0-.025 0-.012Q.014-.038.028-.017Q.041 0 0 .025Z"/>':stroke.tool==='flowers'?Array.from({length:5},(_,i)=>`<ellipse cy="-.019" rx=".011" ry=".018" transform="rotate(${i*72})"/>`).join('')+'<circle r=".009" fill="#f2ce68"/>':'<path d="M0-.025L.007-.007 .025 0 .007 .007 0 .025-.007 .007-.025 0-.007-.007Z"/>';return `<g transform="translate(${p.x} ${p.y}) scale(${size})" fill="${color(stroke)}" opacity=".8">${stamp}</g>`;}).join('');}
