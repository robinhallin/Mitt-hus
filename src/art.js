import {dogAccessories} from './accessories.js';
import {DOG_VIEW,dogImage} from './character-layout.js';
import {identityAvatar} from './avatar.js';
import {paintFace} from './paint-art.js';
import { PALETTES } from './state.js';
export const icons = {
 butterfly:'🦋',sun:'☀️',leaf:'🍃',music:'🎵',sparkles:'✨',cherry:'🍒',home:'🏡', dress:'👗', makeup:'🎨', tidy:'🧺', dog:'🐾', teeth:'🪥', craft:'🌈', album:'⭐', shirt:'👕', mirror:'🪞', paw:'🐾', drop:'🫧', tooth:'🦷', basket:'🧺', flower:'🌸', star:'⭐', heart:'💗', moon:'🌙', rainbow:'🌈', bear:'🧸', ball:'🏐', bow:'🎀', brush:'🪮', book:'📖', pencil:'🖍️', sound:'🔊', mute:'🔇', back:'←', check:'✓', food:'🦴'
};
export const icon = name => `<span class="emoji" aria-hidden="true">${icons[name] || '✨'}</span>`;
export function lea(s, face = false) { return face ? paintFace(s) : identityAvatar(s); }
export function dog(s,prefix='sigge') {
 const rgb=s.dog.collar.slice(1).match(/../g).map(v=>parseInt(v,16)/255/.5);
 return `<svg class="dog-art identity-dog" viewBox="0 0 ${DOG_VIEW.w} ${DOG_VIEW.h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sigge, samma golden retriever som på välkomstbilden"><defs>
 <filter id="collar-pixels" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 -6 6 0 0 0"/></filter>
 <mask id="sigge-collar" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024">${dogImage('filter="url(#collar-pixels)"')}</mask>
 <filter id="collar-tint" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${rgb.map(k=>`${.2126*k} ${.7152*k} ${.0722*k} 0 0`).join(' ')} 0 0 0 1 0"/></filter></defs>
 ${dogImage()}${s.dog.collar!=='#68a99d'?`<g mask="url(#sigge-collar)">${dogImage('filter="url(#collar-tint)"')}</g>`:''}${dogAccessories(s.dog)}</svg>`.replaceAll('collar-pixels',`${prefix}-pixels`).replaceAll('sigge-collar',`${prefix}-collar`).replaceAll('collar-tint',`${prefix}-tint`);
}
export function roomArt(s) {
 return `<svg class="room-background" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
 <defs><pattern id="wallpaper" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="2" fill="#fff" opacity=".6"/></pattern><linearGradient id="window" x2="0" y2="1"><stop stop-color="#cbe8e6"/><stop offset="1" stop-color="#f5f4ce"/></linearGradient></defs>
 <path fill="${PALETTES.walls[s.room.wall]}" d="M0 0h1200v720H0z"/><path fill="url(#wallpaper)" d="M0 0h1200v495H0z"/>
 <path d="M0 485H1200V720H0Z" fill="#e5c6aa"/><path d="M0 485h1200" stroke="#fff9ee" stroke-width="16"/><g stroke="#cda88c" stroke-width="2" opacity=".45"><path d="M0 563h1200M0 660h1200M300 490l-70 230M600 490v230M900 490l70 230"/></g>
 <rect x="450" y="65" width="280" height="285" rx="120" fill="#fff9ee"/><path d="M471 200Q471 80 590 84Q710 80 710 200V327H471Z" fill="url(#window)"/><circle cx="649" cy="152" r="34" fill="#fff6c7"/><path d="M471 288Q550 228 620 284Q678 240 710 270V327H471" fill="#a2c2a3"/><path d="M590 88v240M470 211h240" stroke="#fff9ee" stroke-width="13"/>
 <path d="M447 61Q408 193 434 348L480 348Q459 200 486 69Z M726 61Q775 211 744 348H703Q721 209 687 69Z" fill="#d9b5bf"/><path d="M435 61h301" stroke="#9e7c76" stroke-width="8" stroke-linecap="round"/>
 </svg>`;
}
