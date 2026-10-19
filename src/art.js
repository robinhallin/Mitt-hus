import { PALETTES } from './state.js';
export const icons = {
 home:'🏡', dress:'👗', makeup:'🎨', tidy:'🧺', dog:'🐾', teeth:'🪥', craft:'🌈', album:'⭐', shirt:'👕', mirror:'🪞', paw:'🐾', drop:'🫧', tooth:'🦷', basket:'🧺', flower:'🌸', star:'⭐', heart:'💗', moon:'🌙', rainbow:'🌈', bear:'🧸', ball:'🏐', bow:'🎀', brush:'🪮', book:'📖', pencil:'🖍️', sound:'🔊', mute:'🔇', back:'←', check:'✓', food:'🦴'
};
export const icon = name => `<span class="emoji" aria-hidden="true">${icons[name] || '✨'}</span>`;
export function lea(s, face = false) {
 const c = s.lea, m = s.makeup, hair = PALETTES.hair[c.hair];
 const top = PALETTES.tops[c.top], shoes = ['#f7e5ed','#9caad6','#e6b063','#7daf9e'][c.shoes];
 const blush = m.cheeks !== null ? ['#ed8fa5','#e7aa91','#dba2b7','#ecb3aa'][m.cheeks] : '#efb6aa';
 return `<svg class="lea-art ${face?'closeup':''}" viewBox="${face?'72 0 255 270':'0 0 400 610'}" xmlns="http://www.w3.org/2000/svg" aria-label="Lea med dina valda kläder och färger" role="img">
 <defs><linearGradient id="hair" x2=".9" y2="1"><stop stop-color="${hair}"/><stop offset=".5" stop-color="#dab27a"/><stop offset="1" stop-color="${hair}"/></linearGradient><linearGradient id="skin" x2="1" y2="1"><stop stop-color="#ffdfbf"/><stop offset="1" stop-color="#f3bb98"/></linearGradient></defs>
 <ellipse cx="201" cy="587" rx="95" ry="14" fill="#69526d" opacity=".12"/>
 ${c.hairstyle==='pigtails'?'<path d="M107 109Q34 80 53 242Q81 266 108 213M287 109Q365 80 346 242Q320 266 287 213" fill="url(#hair)"/>':''}
 ${c.hairstyle==='ponytail'?'<path d="M286 73Q368 68 336 237Q293 262 285 191" fill="url(#hair)"/>':''}
 <path d="M99 157Q75 31 180 22Q297 -3 305 126L310 276Q258 310 87 273Z" fill="url(#hair)" stroke="#ac7e50" stroke-width="2"/>
 <path d="M167 211v54h67v-54" fill="url(#skin)"/>
 <path d="M147 260Q105 261 99 317L77 414Q80 437 98 431L129 346L130 423H272L272 347L301 426Q316 440 325 419L304 318Q294 265 253 260Z" fill="url(#skin)" stroke="#d99d7c" stroke-width="2"/>
 <path d="M134 404L143 548Q150 564 168 550L182 448H215L232 549Q246 561 261 549L268 403Z" fill="url(#skin)" stroke="#dda584" stroke-width="2"/>
 ${c.outfit==='trousers'?`<path d="M130 390L139 542H174L199 449L228 542H265L272 390Z" fill="#99b6d2"/><path d="M199 412v37" stroke="#7797b8" stroke-width="3"/>`:`<path d="M134 374Q121 424 104 454Q194 485 287 454L266 374Z" fill="${c.outfit==='dress'?top:'#b4a0d8'}" stroke="#947cae" stroke-width="2"/><path d="M144 398L133 457M176 403L172 465M224 402L228 465M254 398L267 457" stroke="#fff" opacity=".35" stroke-width="5"/>`}
 <path d="M148 253Q196 278 248 253L284 274L301 321L266 337L259 392Q201 410 138 392L132 336L99 323L115 279Z" fill="${top}" stroke="#fff" stroke-opacity=".4" stroke-width="3"/>
 <path d="M169 262Q199 291 231 263" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="4"/>
 <path d="M145 540L133 558Q114 579 135 585H176L177 546Z M231 542L228 582H276Q290 578 271 558L260 542Z" fill="${shoes}" stroke="#c19eaa" stroke-width="2"/><path d="M143 563h24M241 563h24" stroke="white" stroke-width="4"/>
 <ellipse cx="106" cy="150" rx="16" ry="25" fill="url(#skin)"/><ellipse cx="288" cy="150" rx="16" ry="25" fill="url(#skin)"/>
 <path d="M105 113Q107 57 197 57Q280 59 289 115L280 182Q259 240 200 244Q142 240 116 185Z" fill="url(#skin)" stroke="#d9a080" stroke-width="2"/>
 <path d="M99 133Q91 56 169 35Q239 8 284 71L295 144Q267 131 259 74Q195 116 113 107Z" fill="url(#hair)"/>
 <path d="M111 107Q174 99 239 54M113 82Q159 56 208 42" stroke="#f5d39d" stroke-width="4" fill="none" opacity=".55"/>
 <path d="M128 130Q148 120 166 130M227 130Q248 120 267 131" stroke="#ac8059" stroke-width="5" stroke-linecap="round" fill="none"/>
 ${m.eyes!==null?`<path d="M126 146Q149 121 170 146M225 146Q248 121 270 146" stroke="${PALETTES.eyes[m.eyes]}" stroke-width="12" fill="none"/>`:''}
 <ellipse cx="150" cy="149" rx="19" ry="13" fill="white"/><ellipse cx="248" cy="149" rx="19" ry="13" fill="white"/><g fill="#79a6bb"><ellipse cx="153" cy="149" rx="10" ry="12"/><ellipse cx="245" cy="149" rx="10" ry="12"/></g><g fill="#31495b"><ellipse cx="154" cy="150" rx="5" ry="8"/><ellipse cx="244" cy="150" rx="5" ry="8"/></g><g fill="white"><circle cx="150" cy="145" r="4"/><circle cx="241" cy="145" r="4"/></g>
 <path d="M129 145Q149 132 168 144M229 143Q248 132 267 145" stroke="#64483b" stroke-width="3" fill="none" stroke-linecap="round"/>
 <ellipse cx="135" cy="180" rx="20" ry="11" fill="${blush}" opacity="${m.cheeks!==null?'.65':'.35'}"/><ellipse cx="263" cy="180" rx="20" ry="11" fill="${blush}" opacity="${m.cheeks!==null?'.65':'.35'}"/>
 <path d="M196 160l-5 20q8 6 16 0" fill="none" stroke="#d89b80" stroke-width="3" stroke-linecap="round"/>
 <path d="M171 200Q200 214 228 199Q202 239 171 200Z" fill="${m.lips!==null?PALETTES.lips[m.lips]:'#ba6f6b'}"/><path d="M180 204Q201 212 220 203L214 213H186Z" fill="white"/>
 ${c.bow?'<g transform="translate(269 78) rotate(20)"><path d="M0 0L-29 -16Q-41 2 -26 20L0 8L28 22Q40 1 28 -16Z" fill="#e797b1" stroke="#c57194" stroke-width="2"/><circle cx="0" cy="5" r="9" fill="#f0b1c8"/></g>':''}
 </svg>`;
}
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
 <rect x="862" y="333" width="280" height="180" rx="22" fill="#faf3e4" stroke="#cdb4a0" stroke-width="5"/><rect x="874" y="363" width="256" height="143" rx="15" fill="#c9badb"/><path d="M880 416h245M880 465h245" stroke="#b3a0c9" stroke-width="2"/><rect x="879" y="342" width="95" height="56" rx="15" fill="#fff9ee"/><rect x="866" y="500" width="14" height="52" rx="6" fill="#cdb4a0"/><rect x="1124" y="500" width="14" height="52" rx="6" fill="#cdb4a0"/>
 <rect x="66" y="125" width="190" height="372" rx="22" fill="#f1ded4" stroke="#c6a598" stroke-width="5"/><path d="M161 135v347" stroke="#c6a598" stroke-width="3"/><rect x="84" y="144" width="60" height="310" rx="23" fill="#f7eae2"/><rect x="179" y="144" width="60" height="310" rx="23" fill="#f7eae2"/><circle cx="146" cy="315" r="6" fill="#b88b6d"/><circle cx="177" cy="315" r="6" fill="#b88b6d"/>
 <path d="M298 378h145v20H298Z" fill="#d4b19b"/><path d="M311 398l-9 100M430 398l10 100" stroke="#c39b82" stroke-width="12" stroke-linecap="round"/><ellipse cx="371" cy="282" rx="64" ry="85" fill="#fff6e7" stroke="#d4b19b" stroke-width="10"/><ellipse cx="371" cy="282" rx="48" ry="67" fill="#deece9"/><path d="M345 252l30-22" stroke="#fff" stroke-width="10" stroke-linecap="round"/>
 <rect x="328" y="355" width="15" height="24" rx="4" fill="#c781a0"/><rect x="395" y="348" width="18" height="30" rx="4" fill="#a4bba3"/>
 <path d="M822 130h280" stroke="#c5a489" stroke-width="13" stroke-linecap="round"/><path d="M840 130V79h22v51M871 130V62h22v68M902 130V83h19v47" stroke="#b9a1ce" stroke-width="3" fill="#b9a1ce"/><path d="M985 128V99Q958 81 972 64Q995 66 990 93Q1004 68 1024 79Q1025 101 997 105v23" fill="#90b392"/><path d="M970 113h42l-7 17h-28" fill="#d79e87"/>
 <ellipse cx="600" cy="601" rx="267" ry="91" fill="#f5e9d8"/><ellipse cx="600" cy="601" rx="241" ry="72" fill="none" stroke="#dfc7c3" stroke-width="4" stroke-dasharray="6 9"/>
 <rect x="72" y="550" width="133" height="91" rx="14" fill="#b3c5b1"/><path d="M75 574h126" stroke="#9fb09b" stroke-width="5"/><path d="M121 550v-12q19-18 37 0v12" stroke="#9fb09b" stroke-width="7" fill="none"/>
 <g transform="translate(1028 553)"><path d="M0 40Q-20 10 0-15Q12-23 19-10Q45-34 53-9Q66-1 50 21L23 48Z" fill="#db9baf"/><path d="M15 45l17-28" stroke="#bb7c94" stroke-width="3"/></g>
 </svg>`;
}
