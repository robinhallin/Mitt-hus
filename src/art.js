import {identityAvatar} from './avatar.js';
import {paintFace} from './paint-art.js';
import { PALETTES } from './state.js';
export const icons = {
 home:'🏡', dress:'👗', makeup:'🎨', tidy:'🧺', dog:'🐾', teeth:'🪥', craft:'🌈', album:'⭐', shirt:'👕', mirror:'🪞', paw:'🐾', drop:'🫧', tooth:'🦷', basket:'🧺', flower:'🌸', star:'⭐', heart:'💗', moon:'🌙', rainbow:'🌈', bear:'🧸', ball:'🏐', bow:'🎀', brush:'🪮', book:'📖', pencil:'🖍️', sound:'🔊', mute:'🔇', back:'←', check:'✓', food:'🦴'
};
export const icon = name => `<span class="emoji" aria-hidden="true">${icons[name] || '✨'}</span>`;
export function lea(s, face = false) { return face ? paintFace(s) : identityAvatar(s); }
export function dog(s) {
 return `<svg class="dog-art" viewBox="0 0 480 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sigge, en glad golden retriever">
 <defs><linearGradient id="fur" x2=".8" y2="1"><stop stop-color="#f9dba1"/><stop offset="1" stop-color="#d49b4e"/></linearGradient></defs>
 <ellipse cx="240" cy="399" rx="162" ry="21" fill="#937762" opacity=".15"/>
 <path class="wag" d="M336 331Q448 259 439 343Q438 403 336 381" fill="url(#fur)" stroke="#c58d46" stroke-width="4"/>
 <path d="M147 218Q105 286 112 380Q144 410 177 384L198 319L230 388Q274 415 306 387Q330 298 288 218Z" fill="url(#fur)" stroke="#c18c49" stroke-width="3"/>
 <path d="M165 262L157 382Q181 401 205 383L212 275M264 265L259 384Q285 403 306 382L293 257" fill="url(#fur)" stroke="#c18c49" stroke-width="3"/>
 <path d="M124 114Q73 71 61 150Q54 240 123 249L156 167M301 114Q353 72 368 153Q378 229 306 249L280 172" fill="#d6a057" stroke="#bc8440" stroke-width="3"/>
 <path d="M114 132Q110 55 212 50Q318 48 316 136L311 188Q286 259 213 264Q143 261 117 195Z" fill="url(#fur)" stroke="#c18c49" stroke-width="3"/>
 <path d="M142 118Q165 100 183 117M245 116Q270 99 291 116" stroke="#bc884b" stroke-width="5" stroke-linecap="round" fill="none"/>
 <g fill="#4c382d"><ellipse cx="163" cy="141" rx="14" ry="17"/><ellipse cx="270" cy="141" rx="14" ry="17"/></g><g fill="white"><circle cx="159" cy="136" r="5"/><circle cx="266" cy="136" r="5"/></g>
 <ellipse cx="213" cy="186" rx="57" ry="42" fill="#f8dfb2"/><path d="M190 174Q213 160 236 174Q238 199 213 201Q189 198 190 174" fill="#594137"/><ellipse cx="206" cy="176" rx="10" ry="4" fill="#9f8270"/>
 <path d="M180 209Q212 239 248 208Q244 265 213 271Q183 258 180 209" fill="#6b4639"/><path d="M198 234Q216 225 233 236Q233 269 215 274Q194 270 198 234" fill="#e59e9b"/><path d="M216 240v23" stroke="#c98080" stroke-width="3"/>
 <path d="M140 240Q214 284 290 240L285 266Q215 305 145 265Z" fill="${s.dog.collar}" stroke="#4a877d" stroke-width="2"/><circle cx="217" cy="287" r="17" fill="#eec768" stroke="#c99a3d" stroke-width="3"/><path d="M211 286l5 5 8-10" stroke="#a87e36" stroke-width="3" fill="none"/>
 </svg>`;
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
