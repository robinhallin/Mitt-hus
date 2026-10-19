import {PALETTES} from './state.js';
import {makeupDefinitions,makeupPaint} from './makeup-layer.js';
import {leaSprite,identityLayers,leaAccessories,tint} from './lea-appearance.js';
export {LEA_SPRITE,LEA_FACE_SOURCE} from './lea-appearance.js';
export function avatarContent(s,prefix='avatar'){const c=s.lea,top=PALETTES.tops[c.top],bottom=PALETTES.tops[c.bottom],sprite=leaSprite(c),coolTop=c.outfit==='pajamas',bib=c.outfit==='overalls';
const patterns={plain:'',dots:'<circle cx="20" cy="20" r="7" fill="#fff9"/>',stripes:'<path d="M0 13h50" stroke="#fff8" stroke-width="10"/>',stars:'<path d="M25 4l6 14 15 2-11 10 3 15-13-7-13 7 3-15-11-10 15-2Z" fill="#fff8"/>',hearts:'<path d="M25 43L8 24Q-1 0 25 11Q51 0 42 24Z" fill="#fff8"/>'};
const image=(attrs='')=>`<image href="${sprite}" width="1024" height="1536" ${attrs}/>`;
const markup=`<defs>
<clipPath id="lea-top-area"><rect x="230" y="350" width="560" height="${coolTop?550:380}"/></clipPath><clipPath id="lea-bottom-area"><rect x="210" y="${bib?350:coolTop?830:690}" width="610" height="${bib?1030:coolTop?550:690}"/></clipPath><clipPath id="lea-shoes"><rect x="240" y="1320" width="555" height="215"/></clipPath>
<filter id="pink-fabric" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 8 -16 8 0 -2.4"/></filter><filter id="cool-fabric" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 -14 0 14 0 0"/></filter>
<filter id="shoe-pixels" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 4 4 -6 0 -1"/></filter><mask id="shoe-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536">${image('filter="url(#shoe-pixels)"')}</mask><mask id="pink-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536">${image('filter="url(#pink-fabric)"')}</mask><mask id="cool-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536">${image('filter="url(#cool-fabric)"')}</mask>
<pattern id="clothing-pattern" width="50" height="50" patternUnits="userSpaceOnUse">${patterns[c.pattern]||''}</pattern>${tint('top-tint',top,coolTop?.8:.5)}${tint('bottom-tint',c.outfit==='dress'?top:bottom,c.outfit==='trousers'||bib?.5:.8)}${tint('shoe-tint',['#f7e5ed','#9caad6','#e6b063','#7daf9e'][c.shoes],.92)}</defs>
${image()}
${c.top!==0||coolTop?`<g clip-path="url(#lea-top-area)" mask="url(#${coolTop?'cool':'pink'}-mask)">${image('filter="url(#top-tint)"')}</g>`:''}
${c.bottom!==(c.outfit==='trousers'||bib?4:1)||c.outfit==='dress'?`<g clip-path="url(#lea-bottom-area)" mask="url(#cool-mask)">${image('filter="url(#bottom-tint)"')}</g>`:''}
<g clip-path="url(#lea-top-area)" mask="url(#${coolTop?'cool':'pink'}-mask)"><rect x="230" y="350" width="560" height="${coolTop?550:380}" fill="url(#clothing-pattern)"/></g>
${c.outfit==='dress'?'<g clip-path="url(#lea-bottom-area)" mask="url(#cool-mask)"><rect x="210" y="690" width="610" height="690" fill="url(#clothing-pattern)" opacity=".65"/></g>':''}
${c.shoes!==0?`<g clip-path="url(#lea-shoes)" mask="url(#shoe-mask)">${image('filter="url(#shoe-tint)"')}</g>`:''}
${leaAccessories(c,{layer:'body'})}
${identityLayers(s,prefix)}
<g transform="translate(308 84) scale(418 363)">${makeupDefinitions(prefix)}<g class="makeup-paint-layer">${makeupPaint(s,null,prefix)}</g></g>
${leaAccessories(c,{layer:'head'})}
`;const ids=[...markup.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);return ids.filter(id=>!id.startsWith(prefix+'-')).reduce((out,id)=>out.replaceAll(`id="${id}"`,`id="${prefix}-${id}"`).replaceAll(`url(#${id})`,`url(#${prefix}-${id})`),markup);}

export function identityAvatar(s,prefix='avatar'){return `<svg class="lea-art identity-avatar" viewBox="180 -220 660 1756" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lea med din valda stil">${avatarContent(s,prefix)}</svg>`;}
