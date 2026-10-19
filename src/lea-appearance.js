import {PALETTES} from './state.js';
export const LEA_FACE_SOURCE='./assets/lea-sigge.webp';
export const LEA_SPRITE='./assets/characters/lea.webp';
export {LEA_FACE_FRAME} from './portrait-geometry.js';
export function leaSprite(c){const outfit=['trousers','overalls','pajamas'].includes(c.outfit)?`-${c.outfit}`:'',hair=['ponytail','pigtails'].includes(c.hairstyle)?`-${c.hairstyle}`:'';return `./assets/characters/lea${outfit}${hair}.webp`;}
export function tint(id,hex,base=.5){const c=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255/base);return `<filter id="${id}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${c.map(k=>`${.2126*k} ${.7152*k} ${.0722*k} 0 0`).join(' ')} 0 0 0 1 0"/></filter>`;}
// The original facial features are retained; the surrounding hair comes from a complete hairstyle sprite.
const FACE_PATCH='M390 166Q430 143 480 143Q520 143 544 166L555 205Q558 253 532 285Q505 310 473 312Q433 310 406 282Q386 255 383 219Z';
const HAIR_PATH={
 loose:'M260 0H770V520L622 525 563 475 495 455 436 480 345 443 260 430Z',
 ponytail:'M310 0H820V470L652 470 635 342 664 245 663 150 600 127 536 140 455 155 387 192 367 244 330 240Z',
 pigtails:'M200 0H820V540L645 540 635 355 675 252 650 155 600 127 536 140 455 155 387 192 369 290 389 410 350 540H200Z'
};
export function identityLayers(s,prefix='lea') {const c=s.lea;return `<defs><clipPath id="${prefix}-original-face"><path d="${FACE_PATCH}"/></clipPath><filter id="${prefix}-hair-pixels" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 6 -6 0 0"/></filter><clipPath id="${prefix}-hair-shape"><path d="${HAIR_PATH[c.hairstyle]||HAIR_PATH.loose}"/></clipPath><mask id="${prefix}-hair" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536"><image href="${leaSprite(c)}" width="1024" height="1536" filter="url(#${prefix}-hair-pixels)" clip-path="url(#${prefix}-hair-shape)"/><path d="M395 157Q467 125 534 130L615 158 645 215 636 302 599 358 563 381 562 413 585 455 455 457 422 410 430 360 389 312 376 247 373 201Z" fill="black"/></mask>${tint(prefix+'-hair-tint',PALETTES.hair[c.hair])}</defs><g transform="translate(0 -4) scale(1.1)"><image href="${LEA_FACE_SOURCE}" width="1254" height="1254" clip-path="url(#${prefix}-original-face)"/></g>${`<image class="foreground-hair" href="${leaSprite(c)}" width="1024" height="1536" mask="url(#${prefix}-hair)" ${c.hair!==3?`filter="url(#${prefix}-hair-tint)"`:''}/>`}`;}
export {leaAccessories} from './accessories.js';
