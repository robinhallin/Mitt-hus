import {DOG_ZONES,DOG_MOUTH,DOG_VIEW} from './character-layout.js';
import {inside} from './touch.js';

export const CARE_LABELS={brush:'Borsta pälsen',soap:'Tvåla in',rinse:'Skölj rent',dry:'Torka mjukt',food:'Mums, Sigge!',pet:'Mysiga klappar',ball:'Fånga bollen'};
export const isCare=tool=>['brush','soap','rinse','dry'].includes(tool);
export function careTarget(s,tool,p){
 const zones=['food','ball'].includes(tool)?[DOG_MOUTH]:DOG_ZONES;
 const hits=zones.map((z,i)=>({z,i})).filter(({z})=>inside(p,z)).sort((a,b)=>Math.hypot((p.x-a.z.x)/a.z.rx,(p.y-a.z.y)/a.z.ry)-Math.hypot((p.x-b.z.x)/b.z.rx,(p.y-b.z.y)/b.z.ry));
 const i=hits[0]?.i??-1;
 return {index:i,ready:i>=0&&(tool!=='rinse'||s.touch.soap[i]>=100)&&(tool!=='dry'||s.touch.rinse[i]>=100)};
}
export function careGuidance(s,tool){
 const care=isCare(tool),mouth=['food','ball'].includes(tool),next=care?s.touch[tool].findIndex(n=>n<100):-1;
 return `<svg class="care-guidance" viewBox="0 0 ${DOG_VIEW.w} ${DOG_VIEW.h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${(mouth?[DOG_MOUTH]:DOG_ZONES).map((z,i)=>`<g data-care-target="${i}" class="care-target ${mouth||i===next?'is-next':''} ${care&&s.touch[tool][i]>=100?'is-done':''}" transform="translate(${z.x*1024} ${z.y*1024})"><ellipse rx="${z.rx*1024}" ry="${z.ry*1024}"/><g class="care-target-badge" transform="translate(0 ${-z.ry*680})"><circle r="21"/><text text-anchor="middle" dominant-baseline="central">${care&&s.touch[tool][i]>=100?'✓':mouth?'♡':i+1}</text></g></g>`).join('')}</svg>`;
}
// Small, platform-independent tools. The working point stays at the crosshair;
// the handle sits beside it so a mouse or fingertip does not cover the result.
export function toolPicture(tool){
 const brush=`<path d="M31 27 17 51q-4 6 2 8 4 1 7-4l14-23" fill="#d6a16e"/><rect x="25" y="5" width="27" height="30" rx="10" fill="#9fbcb0"/><path d="M30 10v20m6-21v22m6-21v20m6-17v15" stroke="#fff8df" stroke-width="3"/>`;
 const paint=`<path d="m25 38 22-31q3-3 6 0t0 6L32 44" fill="#c39b73"/><path d="M31 33q-13-1-12 10 1 6-9 9 21 5 25-10Z" fill="var(--tool-color,#d38baa)"/>`;
 const shapes={
  hearts:'<path d="m32 44-19-18Q1 9 18 7q9-1 14 9 8-16 21-6 10 9-1 20Z" fill="var(--tool-color,#dc9db7)"/><path d="m28 40-9 17" stroke="#c59d79" stroke-width="7" stroke-linecap="round"/>',
  flowers:'<path d="m30 32-8 25" stroke="#9cae86" stroke-width="5"/><g fill="var(--tool-color,#d9adca)"><ellipse cx="33" cy="14" rx="8" ry="12"/><ellipse cx="45" cy="26" rx="12" ry="8"/><ellipse cx="33" cy="38" rx="8" ry="12"/><ellipse cx="21" cy="26" rx="12" ry="8"/></g><circle cx="33" cy="26" r="8" fill="#f0d78d"/>',
  sparkles:'<path d="m25 39 18-24" stroke="#c5a27e" stroke-width="7" stroke-linecap="round"/><path d="m43 4 5 9 10 2-7 8 1 11-10-5-9 5 1-11-7-8 11-2Z" fill="var(--tool-color,#e4bf70)"/><path d="M13 11v10M8 16h10m36 28v8m-4-4h8" stroke="#d1b175" stroke-width="2"/>',
  draw:'<path d="m16 42 25-32 14 11-25 32Z" fill="var(--tool-color,#d38baa)"/><path d="m16 42-4 17 18-6Z" fill="#ddbc91"/><path d="m12 59 3-9 7 5Z" fill="#6e5867"/><path d="m36 16 13 10" stroke="#fff8df" stroke-width="3"/>',
  brush,
  soap:'<rect x="10" y="22" width="44" height="29" rx="12" fill="#efcc7b"/><path d="M14 40h36" stroke="#d5a859" stroke-width="3"/><g fill="#f5ffff" stroke="#9cc7cc"><circle cx="20" cy="20" r="10"/><circle cx="35" cy="17" r="13"/><circle cx="48" cy="24" r="8"/></g>',
  rinse:'<path d="M45 54V30Q47 11 29 12" fill="none" stroke="#a6aeba" stroke-width="9"/><path d="m17 12 18 7-4 9-23-9Z" fill="#b9d9d7"/><path d="m12 28-5 10m14-7-5 11m14-7-5 10" stroke="#62bad5" stroke-width="3" stroke-linecap="round"/>',
  dry:'<path d="M12 14h38v39H12Z" fill="#ebc6ce"/><path d="M12 14q15-10 20 0v39q-8-7-20 0Z" fill="#f8dde1"/><path d="M17 22v22m5-23v21m15-19h9m-9 6h9m-9 6h9" stroke="#d7a2b5" stroke-width="2"/>',
  food:'<path d="M19 23q-8-17-15-6-4 7 6 14-9 10-2 15 8 6 15-8l18 4q4 14 13 8 8-7-1-14 11-6 6-13-7-10-16 4Z" fill="#e8c28a" stroke="#bd9464" stroke-width="2"/>',
  ball:'<circle cx="32" cy="32" r="23" fill="#c9d978" stroke="#98ae55" stroke-width="2"/><path d="M15 16q28 9 9 37m24-37q-27 9-10 37" stroke="#fff8d5" stroke-width="4" fill="none"/>',
  pet:'<path d="M32 51 12 32Q-1 13 18 11q10-1 14 9 9-18 22-5 8 8-2 19Z" fill="#df96b0"/><path d="m43 7 3-4m8 8 5-1" stroke="#e8c36f" stroke-width="3" stroke-linecap="round"/>',
  teeth:'<path d="m24 28 24 26q4 5 8 0 2-3-2-7L31 22" fill="#a3bdb8"/><rect x="7" y="11" width="29" height="16" rx="6" transform="rotate(35 21 19)" fill="#eac0c8"/><path d="m12 8 17 12m-13-18 18 12" stroke="#fffdf1" stroke-width="5"/>',
  eraser:'<path d="m12 35 21-25q4-5 9-1l15 12q4 4 0 9L40 52H23Z" fill="#ecc5cf" stroke="#c397ad" stroke-width="2"/><path d="m12 35 16-19 24 21-12 15H23Z" fill="#fff7e8"/>',
  lips:'<path d="m12 44 23-25 17 14-22 25Z" fill="#b599ba"/><path d="m34 20 10-13q3-4 7-1l8 7-8 20Z" fill="var(--tool-color,#d58ca5)"/><path d="m18 42 15 12" stroke="#f2dfcb" stroke-width="4"/>',
 };
 return `<svg class="tool-picture" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${shapes[tool]||paint}</svg>`;
}
