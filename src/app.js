import {freshDollhouse,rotateFurniture3d,guideFortPiece,unpackFort,setFrame,roomDiscover} from './dollhouse.js';
import {dollhouseView,dollhousePanel} from './dollhouse-views.js';
import {createDollhouseController} from './dollhouse-controller.js';
import {COLOR_PAGES,COLOR_PALETTE,COLOR_SIZES,selectColorPage,clearColorPage,undoColorPage,frameColorPage,addColorAction,createColoringController} from './coloring.js';
import {coloringView,coloringAlbum} from './coloring-views.js';
import {createColoringPainter} from './coloring-canvas.js';
import {PACKING,togglePack,startDay,newDay,canPlay,discover,finishPicnic,takePhoto,washDay} from './playday.js';
import {createPlayController} from './play-controller.js';
import {dayStrip,packingView,meadowView,meadowLayer,paradeView,teaView,picnicView,photoAlbum,discoveryProps,footprints,PLAY_HINTS} from './playday-views.js';
import {wardrobeView,tryPlayLook,lookCards} from './wardrobe.js';
import {chooseAccessory,ACCESSORY_SLOTS} from './accessories.js';
import { PALETTES, TASKS, TOYS, STICKERS, load, persist, saveLook, wearLook, complete, sortToy, washSpot, brushDog, cleanTooth } from './state.js';
import { icon, icons, lea, dog, roomArt } from './art.js';
import { FURNITURE, ROOM_COLORS, ADVENTURES, PATTERNS, HEADWEAR, addFurniture, moveFurniture, activeAdventure, chooseAdventure, tryRoomIdea, prepareAdventureStep, advanceAdventure, findGardenItem } from './world.js';
import { roomFurniture } from './play-art.js';
import { createTouchController } from './touch-controller.js';
import { resetCare } from './touch.js';
import { makeupTouchView, dogTouchView, teethTouchView, drawingCanvas, teethPaint, toolIcon } from './touch-views.js';
import { makeupPaint, drawingPaint } from './paint-art.js';
import { furnishView, wardrobeExtras, storyStrip, adventureView, gardenView } from './play-views.js';
const app = document.querySelector('#app');
let storage; try { storage = window.localStorage; } catch { storage = {getItem:()=>null,setItem:()=>{throw Error('Unavailable')}}; }
let state = load(storage), scene = 'home', makeupTool='cheeks', makeupColor=0, dogTool='brush', selectedToy=null, sticker='flower', toastTimer, saved=true;
let selectedFurniture=null, furnitureDrag=null, furnitureHistory=[], suppressClick=false;
let showWelcome=typeof location!=='undefined' && new URLSearchParams(location.search).get('start')==='1';
let craftMode='stickers',drawingTool='draw',drawingColor=0,installOpen=false,deferredInstall=null;
let stickerHistory=[];
let roomUI={selection:null,tab:'play',edit:false};
let colorTool='brush',colorColor=0,colorSize=1,colorPicker=true,colorRedo=Object.fromEntries(COLOR_PAGES.map(p=>[p.id,[]]));
let playMode='pet',freePlay=false,musicTimer=null,musicNote=0;
let furnishTab='things';
let wardrobeTab='clothes',accessorySlot='headwear',salonTab='makeup',makeupSize=1,salonPreview=false,dogTab='care',coachVisible=false,selectedSticker=null,stickerDrag=null;
let drag=null, audioContext, lastScrub=0, dogRenderTimer;
const scenes = {
 coloring:{name:'Leas rithörna',hint:'Välj en bild. Färglägg med fingret, precis som du vill.',icon:'pencil'},
 packing:{name:'Vår picknickdag',hint:'Välj sakerna som du vill leka med.',icon:'basket'},
 meadow:{name:'Lea & Sigges trädgård',hint:'Lek med fingret, i din egen takt.',icon:'flower'},
 picnic:{name:'På picknickfilten',hint:'Bjud Lea och Sigge på något gott.',icon:'heart'},
 parade:{name:'Min fantasiparad',hint:'Din stil får en egen scen!',icon:'star'},
 tea:{name:'En liten tebjudning',hint:'Bjud Sigge och en gäst på låtsaste.',icon:'bear'},
 furnish:{name:'Inred mitt rum',hint:'Flytta möblerna precis som du vill.',icon:'craft'},
 adventures:{name:'Våra små äventyr',hint:'Vad vill du och Sigge hitta på?',icon:'book'},
 garden:{name:'Ut i trädgården',hint:'Hitta de tre picknicksakerna.',icon:'flower'},
 home:{name:'Mitt rum',hint:'Vad vill du hitta på?',icon:'home'},
 dress:{name:'Min garderob',hint:'Vilken stil vill du ha idag?',icon:'dress'},
 makeup:{name:'Vid spegeln',hint:'Välj färg och måla med fingret på Lea.',icon:'makeup'},
 craft:{name:'Pyssla & inred',hint:'Gör rummet precis som du vill.',icon:'craft'},
 tidy:{name:'Hitta hem',hint:'Hjälp sakerna till rätt låda.',icon:'tidy'},
 dog:{name:'Hej, Sigge!',hint:'En mysig stund med din bästa vän.',icon:'dog'},
 teeth:{name:'Tandborstkalas',hint:'Borsta med små cirklar över tänderna.',icon:'teeth'},
 album:{name:'Mina små minnen',hint:'Här bor allt du har provat.',icon:'album'}
};
const btn=(text,action,value='',className='',extra='')=>`<button type="button" class="${className}" data-action="${action}" data-value="${value}" ${extra}>${text}</button>`;
const selected=(yes)=>`aria-pressed="${!!yes}"`;
const dots=(values,action,current)=>`<div class="swatches">${values.map((c,i)=>btn(`<span style="background:${c}"></span>${current===i?'<b>✓</b>':''}`,action,i,'swatch',`aria-label="Färg ${i+1}" ${selected(current===i)}`)).join('')}</div>`;
const heading=(label,sub='')=>`<div class="tray-heading"><h2>${label}</h2>${sub?`<p>${sub}</p>`:''}</div>`;
const group=(title,content)=>`<section class="control-group"><h3>${title}</h3>${content}</section>`;
const choice=(label,emoji,action,value,active)=>btn(`<span aria-hidden="true">${emoji}</span><span>${label}</span>`,action,value,'choice',selected(active));
function save(){ saved=persist(storage,state); document.querySelector('.save-note')?.replaceChildren(document.createTextNode(saved?'Sparas automatiskt på den här enheten':'Det går inte att spara just nu')); }
function speak(text){if(!state.sound||!('speechSynthesis'in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='sv-SE';u.rate=.87;const voice=window.speechSynthesis.getVoices().find(v=>v.lang.startsWith('sv'));if(voice)u.voice=voice;window.speechSynthesis.speak(u);}
function chime(){if(!state.sound)return;try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();audioContext.resume();[523.25,659.25,783.99].forEach((f,i)=>{const o=audioContext.createOscillator(),g=audioContext.createGain(),t=audioContext.currentTime+i*.09;o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.075,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+.32);o.connect(g);g.connect(audioContext.destination);o.start(t);o.stop(t+.34);});}catch{}}
function toast(text,voice=false){const t=document.querySelector('#toast');t.textContent=text;t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),2800);if(voice)speak(text);}
function celebrate(text){chime();toast(text,true);const p=document.querySelector('#particles');for(let i=0;i<18;i++){const n=document.createElement('span');n.textContent=['🌸','✨','💗','⭐'][i%4];n.style.cssText=`left:${10+Math.random()*80}%;--drift:${Math.random()*160-80}px;animation-delay:${Math.random()*.3}s`;p.append(n);setTimeout(()=>n.remove(),2500);}}
function storyEvent(event){const change=advanceAdventure(state,event);if(change)toast(change.finished?'Ett nytt äventyrsminne!':`Nästa lilla steg: ${change.next.title}`,true);return change;}
function finish(id,text){if(complete(state,id))celebrate(text);storyEvent(id);save();}
function go(next){if(!scenes[next])return;dollController.detach();save();colorController.finish();colorPainter.detach();playController.stop();stopMusic();touchController.finish();if(stickerDrag){state.room.stickers=stickerDrag.before;stickerDrag=null;save();}selectedSticker=null;scene=next;if(next==='furnish')roomUI.edit=true;if(next==='meadow'&&!canPlay(state,playMode,freePlay))playMode='pet';if(next==='dog')dogTab=['soap','rinse','dry'].includes(dogTool)?'bath':'care';selectedToy=null;drag=null;furnitureDrag=null;render();if(next==='parade')startMusic();speak(scenes[next].hint);document.querySelector('h1')?.focus({preventScroll:true});}
function stickerMarkup(interactive=false){return state.room.stickers.map((v,i)=>`<${interactive?'button':'span'} ${interactive?`type="button" data-action="select-sticker" data-sticker="${i}" data-value="${i}" aria-label="Flytta ${icons[v.icon]}"`:''} class="wall-sticker ${interactive&&selectedSticker===i?'sticker-selected':''}" style="left:${v.x}%;top:${v.y}%">${icon(v.icon)}</${interactive?'button':'span'}>`).join('');}
function installPanel(){return installOpen?`<div class="install-overlay" role="dialog" aria-modal="true" aria-label="Spela som app"><div class="install-card"><span>🏡</span><h2>Leas spel på hemskärmen</h2><p>På iPad: öppna spelet i Safari, välj <strong>Dela</strong> och sedan <strong>Lägg till på hemskärmen</strong>. Starta därefter med den nya ikonen.</p><p>Spelet sparas på den här enheten. Ett första besök med internet laddar ner spelfilerna; svenska röster och privat inloggning kan behöva internet.</p>${deferredInstall?btn('Installera spelet','native-install','','primary full'):''}${btn('Tillbaka till Lea & Sigge','close-install','','secondary full')}</div></div>`:'';}
function welcome(){return `<main class="welcome">${installPanel()}<div class="welcome-copy"><div class="eyebrow"><span></span> EN VÄRLD BARA FÖR DIG</div><h1>Lea <span>&</span> Sigge<span class="title-flower">✿</span></h1><p class="welcome-subtitle">Små äventyr.<br>Stora fantasier.</p><p class="welcome-description">Ditt rum, din stil och din allra bästa vän.<br>Vad ska ni hitta på idag?</p>${btn(`Nu leker vi! <span aria-hidden="true">→</span>`,'enter','','primary play')}<p class="quiet">${icon('heart')} Skapat för Lea, med kärlek.</p>${btn('Till vuxen: spela som app','install','','install-help-button')}</div><div class="welcome-art"><span class="orbit orbit-one">✦</span><span class="orbit orbit-two">✿</span><span class="orbit orbit-three">✧</span><div class="welcome-blob"></div><img src="./assets/lea-sigge.webp" alt="Lea tillsammans med sin golden retriever Sigge" fetchpriority="high"><span class="name-tag lea-tag">Hej, Lea! <span>♡</span></span><span class="name-tag sigge-tag">Och Sigge! 🐾</span></div></main>`;}
function room2d(){return `<div class="home-world"><section class="room scene-pop" aria-label="Leas rum">${roomArt(state)}${roomFurniture(state)}<div class="home-stickers">${drawingCanvas(state)}${stickerMarkup()}</div><div class="room-banner"><span>VÄLKOMMEN HEM</span><h2>En liten värld av möjligheter.</h2></div>${btn('✥ Inred rummet','go','furnish','room-edit-button')}${btn(lea(state),'go','dress','room-lea','aria-label="Välj kläder till Lea"')}${btn(dog(state),'go','dog','room-dog','aria-label="Lek med Sigge"')}${btn(`${icon('tidy')} Plocka & sortera`,'go','tidy','room-tidy-button')}${discoveryProps(state)}${footprints(state)}<div class="room-play-links">${btn('🖍️ Rithörnan','go','coloring')}${btn('🧺 Picknickdag','resume-day')}${btn('🌟 Parad','go','parade')}${btn('🫖 Tebjudning','go','tea')}${state.day.muddy?btn('🐾 Leriga tassar!','bath-day'):''}</div></section>${dayStrip(state)}</div>`;}

function room(){return dollhouseView(state,roomUI,room2d());}

function dress(){return withPlayLink(wardrobeView(state,{tab:wardrobeTab,slot:accessorySlot}),'parade');}
function makeup(){return withPlayLink(makeupTouchView(state,makeupTool,makeupColor,{tab:salonTab,size:makeupSize,preview:salonPreview,guide:true}),'parade');}
function dogView(){return withPlayLink(dogTouchView(state,dogTool,{tab:dogTab}),'meadow');}
function tidy(){const boxes=[{id:'toys',name:'Leksaker',icon:'bear',items:'🧸 🏐'},{id:'accessories',name:'Fina saker',icon:'bow',items:'🎀 🪮'},{id:'books',name:'Läsa & rita',icon:'book',items:'📖 🖍️'}];const done=state.tidy.length===TOYS.length;return `<div class="tidy-view scene-pop"><div class="tidy-tip">${icon(done?'star':'basket')} <span>${done?'Allt har hittat hem. Vad mysigt!':selectedToy?'Tryck på lådan som passar.':'Tryck på en sak och sedan på rätt låda. Du kan också dra!'}</span><b>${state.tidy.length} / ${TOYS.length}</b></div><div class="tidy-playfield" aria-label="Saker att sortera">${done?`<div class="tidy-success">${icon('heart')}<h2>Vilket mysigt rum!</h2>${btn('Häll ut & lek igen','reset','tidy','primary')}</div>`:TOYS.filter(t=>!state.tidy.includes(t.id)).map(t=>btn(`${icon(t.icon)}<span>${t.name}</span>`,'toy',t.id,`toy ${selectedToy===t.id?'picked':''}`,`style="left:${t.x}%;top:${t.y}%" ${selected(selectedToy===t.id)} data-draggable="${t.id}"`)).join('')}<div class="tidy-rug"></div></div><div class="sorting-boxes">${boxes.map(b=>btn(`<span class="box-pictures" aria-hidden="true">${b.items}</span><strong>${b.name}</strong><span class="box-items">${TOYS.filter(t=>t.box===b.id&&state.tidy.includes(t.id)).map(t=>icons[t.icon]).join(' ')||'♡'}</span>`,'box',b.id,'sorting-box',`data-drop="${b.id}" aria-label="Lägg i lådan ${b.name}"`)).join('')}</div></div>`;}
function teeth(){return teethTouchView(state);}

function craft(){return `<div class="activity scene-pop"><div class="stage craft-stage"><div class="craft-wall" ${craftMode==='paint'?'data-surface="drawing" data-aspect="stretch"':'data-action="place-sticker"'} tabindex="0" aria-label="Sätt valt klistermärke på väggen" style="background-color:${PALETTES.walls[state.room.wall]}"><div class="wall-shelf"><span>🌱</span><span>📚</span><span>🧸</span></div><div class="wall-frame">Leas<br><i>lilla värld</i><span>♡</span></div>${drawingCanvas(state)}${craftMode==='paint'?'<span class="finger-tool" aria-hidden="true">🖍️</span>':''}${stickerMarkup(craftMode!=='paint')}${!state.room.stickers.length&&craftMode!=='paint'?'<div class="craft-prompt">☝️<span>Tryck här och sätt<br>ditt första klistermärke!</span></div>':''}</div><div class="stage-caption">${craftMode==='paint'?'Rita med fingret på väggen. Din bild följer med till rummet.':'Dra ett märke för att flytta det. Välj ett nytt i lådan.'}</div></div><aside class="tray">${heading('Lite mer du.','Ditt rum får se ut precis som du vill.')}<div class="choices compact craft-mode">${choice('Klistermärken','🌈','craft-mode','stickers',craftMode==='stickers')}${choice('Rita fritt','🖍️','craft-mode','paint',craftMode==='paint')}</div>${craftMode==='paint'?`${group('Rita med fingret',dots(PALETTES.tops,'drawing-color',drawingColor))}<div class="touch-actions">${btn(drawingTool==='eraser'?'🖍️ Penna':'🫧 Sudd','drawing-tool','','secondary')}${btn('↶ Ångra','undo-drawing','','secondary')}</div>`:''}${btn('🖍️ Till Leas rithörna','go','coloring','primary full')}${btn('🛋️ Flytta & färga möbler','go','furnish','secondary full')}${group('Måla väggen',dots(PALETTES.walls,'wall',state.room.wall))}${craftMode==='stickers'?group('Välj klistermärke',`<div class="sticker-palette">${STICKERS.map(v=>btn(icon(v),'sticker',v,'sticker-choice',`aria-label="Välj ${({flower:'blomma',star:'stjärna',heart:'hjärta',paw:'tass',moon:'måne',rainbow:'regnbåge',butterfly:'fjäril',sun:'sol',leaf:'löv',music:'musiknot',sparkles:'glitter',cherry:'körsbär'})[v]}" ${selected(sticker===v)}`)).join('')}</div>`):''}<div class="instruction"><span>☝️</span><p>${craftMode==='paint'?'Välj en färg och rita med fingret.<br>Byt till suddet om du vill ändra.':'Välj ett klistermärke.<br>Tryck på väggen för att fästa det!'}</p></div><p class="sticker-count">${state.room.stickers.length} / 24 klistermärken</p>${craftMode==='stickers'?`<div class="touch-actions">${btn('↶ Ångra märke','undo-sticker','','secondary')}${selectedSticker!==null?btn('🗑 Ta bort märket','remove-sticker',selectedSticker,'secondary'):''}</div>`:''}${btn('Tillbaka till mitt rum →','go','home','primary full')}</aside></div>`;}
function album(){return `<section class="album-view scene-pop"><div class="album-intro"><span>🌼</span><h2>Små stunder att bli glad av.</h2><p>Det finns inget rätt sätt att leka. Här samlas sådant du har provat.</p></div>${coloringAlbum(state)}${photoAlbum(state)}${state.looks.length?`<h2 class="saved-looks-title">📸 Mina stilar</h2>${lookCards(state)}`:''}<div class="memory-grid">${ADVENTURES.map(a=>`<article class="memory adventure-memory ${state.adventures.completed.includes(a.id)?'earned':''}"><span class="emoji">${a.emoji}</span><h3>${a.title}</h3><p>${state.adventures.completed.includes(a.id)?'Ett eget äventyrsminne. ♡':'En berättelse att upptäcka tillsammans.'}</p>${btn('Öppna äventyret →','choose-adventure',a.id,'text-button')}</article>`).join('')}${TASKS.map(t=>`<article class="memory ${state.done.includes(t.id)?'earned':''}">${icon(t.icon)}<h3>${t.label}</h3><p>${state.done.includes(t.id)?'Ett fint litet minne. ♡':t.hint}</p>${btn(state.done.includes(t.id)?'Lek igen →':'Upptäck →','go',t.scene,'text-button')}</article>`).join('')}</div></section>`;}

function render(){dollController.detach();colorPainter.detach();if(showWelcome||!state.entered){app.innerHTML=welcome();return;}const meta=scenes[scene];app.innerHTML=`<div class="game-shell"><header class="topbar">${btn(`<span class="brand-symbol">🏡</span><span>Hem</span>`,'go','home','brand','aria-label="Gå till mitt rum"')}<div class="view-title"><h1 tabindex="-1">${meta.name}</h1><p>${meta.hint}</p></div><div class="header-tools">${btn(`${icon('album')}<span>${state.done.length+state.adventures.completed.length}<small>/${TASKS.length+ADVENTURES.length}</small></span>`,'go','album','memories-count','aria-label="Visa mina minnen"')}${btn(icon(state.sound?'sound':'mute'),'sound','','round-button',`aria-label="${state.sound?'Stäng av':'Slå på'} ljud" ${selected(state.sound)}`)}${btn('🧺','resume-day','','round-button','aria-label="Vår picknickdag"')}${btn('📖','go','adventures','round-button adventures-button','aria-label="Välj ett äventyr med Sigge"')}${btn('☝️','help','','round-button','aria-label="Läs upp hjälp"')}</div></header>${!['home','adventures'].includes(scene)&&activeAdventure(state)?storyStrip(state):''}<main class="game-content">${coachVisible?`<div class="child-coach" role="status"><span>☝️</span><p>${coachText()}</p>${btn('✓','help','','','aria-label="Stäng hjälpen"')}</div>`:''}${({coloring:()=>coloringView(state,{tool:colorTool,color:colorColor,size:colorSize,showPages:colorPicker,canRedo:!!colorRedo[state.coloring.selected].length}),packing:()=>packingView(state),meadow:()=>meadowView(state,playMode,freePlay),picnic:()=>picnicView(state),parade:()=>paradeView(state),tea:()=>teaView(state),home:room,dress,makeup,tidy,dog:dogView,teeth,craft,album,furnish:()=>dollhouseView(state,{...roomUI,edit:true},withPlayLink(furnishView(state,selectedFurniture,{tab:furnishTab}),'tea')),adventures:()=>adventureView(state),garden:()=>gardenView(state)}[scene])()}</main><footer><nav class="dock" aria-label="Välj lek">${Object.entries(scenes).filter(([id])=>['home','dress','makeup','coloring','craft','tidy','dog','teeth'].includes(id)).map(([id,m])=>btn(`${icon(m.icon)}<span>${({home:'Mitt rum',dress:'Kläder',makeup:'Smink',coloring:'Rithörna',craft:'Pyssel',tidy:'Plocka',dog:'Sigge',teeth:'Tänder'})[id]}</span>`,'go',id,`dock-item ${scene===id?'active':''}`,scene===id?'aria-current="page"':'')).join('')}</nav><p class="save-note">${saved?'Sparas automatiskt på den här enheten':'Det går inte att spara just nu'}</p></footer></div>`;colorPainter.mount();if(['home','furnish'].includes(scene))dollController.mount();}
function coachText(){if(scene==='coloring')return colorTool==='fill'?'Välj en färg och tryck i den yta som du vill fylla.':'Välj färg och dra fingret över målarbilden. Börja i en yta. Du kan sudda och ångra.';if(scene==='makeup')return salonPreview?'Här är hela din stil. Tryck på Måla mer för att fortsätta.':({cheeks:'Välj en färg. Svep sedan på kinderna.',lips:'Välj en färg. Måla längs Leas leende.',eyes:'Svep försiktigt ovanför ögonen.',sparkles:'Välj färg och dra ett glittrande spår på kinden.',hearts:'Svep över kinden så växer små hjärtan fram.',flowers:'Svep över kinden och måla små blommor.',eraser:'Svep med svampen där färgen ska bort.'})[makeupTool];if(scene==='dress')return 'Välj en bild. Lea provar direkt. Kameran sparar din stil.';if(scene==='dog')return dogTool==='ball'?'Dra bollen till Sigges mun. Han fångar den!':dogTool==='pet'?'Klappa med mjuka svep över pälsen.':dogTool==='food'?'Dra benet till Sigges mun.':'Välj ett verktyg. Svep över den del som glittrar. För bad: svamp, dusch och handduk.';if(scene==='teeth')return 'Borsta med små cirklar på tanden som lyser. Det går också bra att välja en annan tand.';if(scene==='craft')return craftMode==='paint'?'Välj färg och rita med fingret. Du kan sudda och ångra.':'Välj ett märke. Tryck där det ska sitta. Dra märket om du vill flytta det.';if(scene==='tidy')return 'Välj en sak. Titta på bilderna på lådorna. Dra saken eller tryck på rätt låda.';if(scene==='furnish')return 'Välj en möbel. Dra den till en plats du gillar. Du kan också använda pilarna.';return scenes[scene].hint;}
function applyMakeup(){toast('Dra fingret över ansiktet för att måla.',true);}
function sortInto(box){if(!selectedToy){toast('Välj en sak först.',true);return;}const before=state.done.includes('tidy');if(sortToy(state,selectedToy,box)){selectedToy=null;save();if(state.tidy.length===TOYS.length){storyEvent('tidy');save();}if(!before&&state.done.includes('tidy'))celebrate('Allt har hittat hem. Vad fint ni har det!');else chime();render();}else toast('Den saken vill bo i en annan låda. Prova igen!',true);}
function rememberStickers(){stickerHistory.push(structuredClone(state.room.stickers));if(stickerHistory.length>20)stickerHistory.shift();}
function placeSticker(event){if(state.room.stickers.length>=24&&selectedSticker===null){toast('Väggen är full! Ta bort ett märke om du vill byta.');return;}const el=event.target.closest('.craft-wall'),r=el.getBoundingClientRect();rememberStickers();const position={icon:sticker,x:Math.max(8,Math.min(92,((event.clientX||r.left+r.width/2)-r.left)/r.width*100)),y:Math.max(10,Math.min(90,((event.clientY||r.top+r.height/2)-r.top)/r.height*100))};if(selectedSticker!==null&&state.room.stickers[selectedSticker]){const item=state.room.stickers[selectedSticker];item.x=position.x;item.y=position.y;}else state.room.stickers.push(position);finish('craft','Ett alldeles eget rum. Vilken härlig fantasi!');render();}
function rememberFurniture(){furnitureHistory.push(JSON.parse(JSON.stringify(state.room.furniture)));if(furnitureHistory.length>20)furnitureHistory.shift();}
function furnitureChanged(){storyEvent('furnish');save();render();}
function act(action,value,event){
 if(dollAction(action,value))return;
 if(colorAction(action,value))return;
 if(playAction(action,value))return;
 switch(action){
 case 'enter':showWelcome=false;state.entered=true;save();render();speak('Hej Lea! Välkommen till ditt rum. Vad vill du och Sigge hitta på idag?');break;
 case 'go':go(value);break;
 case 'sound':state.sound=!state.sound;stopMusic();if(state.sound&&scene==='parade')startMusic();if(!state.sound&&'speechSynthesis'in window)window.speechSynthesis.cancel();save();render();if(state.sound)speak('Nu är ljudet på.');break;
 case 'help':case 'coach':coachVisible=!coachVisible;toast(coachText(),true);render();if(scene==='tidy')speak('Välj en sak. Tryck sedan på lådan där den ska bo. Du kan också dra saken till lådan.');break;
 case 'bottom':case 'top':case 'hair':case 'shoes':state.lea[action]=Number(value);save();render();break;
 case 'outfit':case 'hairstyle':state.lea[action]=value;save();render();break;
 case 'bow':chooseAccessory(state,'hairclip',state.lea.bow?'none':'bow');save();render();break;
 case 'finish-outfit':finish('outfit','Din egen favoritstil! Vad roligt att välja själv.');go('home');break;
 case 'makeup-tool':touchController.finish();makeupTool=value;salonPreview=false;render();speak(coachText());break;
 case 'makeup-size':touchController.finish();makeupSize=Math.max(0,Math.min(2,Number(value)||0));render();break;
 case 'salon-tab':touchController.finish();salonTab=value==='play'?'play':'makeup';makeupTool=salonTab==='play'?'sparkles':'cheeks';salonPreview=false;render();break;
 case 'salon-preview':touchController.finish();salonPreview=!salonPreview;render();break;
 case 'wardrobe-tab':if(['clothes','hair','accessories','looks'].includes(value)){wardrobeTab=value;render();}break;
 case 'accessory-slot':if(ACCESSORY_SLOTS[value]){accessorySlot=value;render();}break;
 case 'accessory':{const [slot,id]=value.split(':');if(chooseAccessory(state,slot,id)){save();render();}break;}
 case 'play-look':if(tryPlayLook(state,value)){save();render();chime();}break;
 case 'save-look':if(saveLook(state)){save();toast('Din stil finns i fotoalbumet!',true);chime();}else toast('Sex stilar är sparade. Ta bort en i Mina stilar om du vill byta.',true);render();break;
 case 'wear-look':if(wearLook(state,value)){save();go('dress');}break;
 case 'delete-look':state.looks=state.looks.filter(l=>l.id!==value);save();render();break;
 case 'makeup-color':touchController.finish();makeupColor=Number(value);salonPreview=false;render();break;
 case 'apply-makeup':applyMakeup();break;
 case 'clear-makeup':state.touch.paint=[];state.makeup={lips:null,cheeks:null,eyes:null};save();render();toast('En ren målarduk. Vad vill du prova nu?');break;
 case 'dog-tab':dogTab=['care','bath','style'].includes(value)?value:'care';if(dogTab==='bath')dogTool=state.touch.soap.every(v=>v>=100)?state.touch.rinse.every(v=>v>=100)?'dry':'rinse':'soap';else if(dogTab==='care')dogTool='brush';render();break;
 case 'dog-accessory':if(['none','bandana','bowtie'].includes(value)){state.dog.accessory=value;save();render();}break;
 case 'dog-tool':touchController.finish();dogTool=value==='wash'?'soap':value;render();speak(({brush:'Rör fingret över olika delar av Sigges päls.',soap:'Gnid svampen över leran tills det bubblar.',rinse:'Svep duschen över de tvålade delarna.',dry:'Torka med handduken genom att röra fingret.',food:'För fingret med benet till Sigges mun.',pet:'Klappa Sigge med mjuka svep över pälsen.',ball:'Dra bollen till Sigge så fångar han den.'})[dogTool]);break;
 case 'pet':toast('Dra fingret över Sigge. Verktyget följer med!',true);break;
 case 'mud':dogTool='soap';render();break;
 case 'collar':state.dog.collar=['#68a99d','#ca7da2','#9293cf','#d8a652'][Number(value)];save();render();break;
 case 'toy':selectedToy=value;render();speak('Vilken låda vill saken bo i?');break;
 case 'box':sortInto(value);break;
 case 'tooth':toast('Borsta med små cirklar med fingret.',true);break;
 case 'wall':state.room.wall=Number(value);save();render();break;
 case 'sticker':sticker=value;selectedSticker=null;render();break;
 case 'select-sticker':selectedSticker=Number(value);render();break;
 case 'undo-sticker':if(stickerHistory.length){state.room.stickers=stickerHistory.pop();selectedSticker=null;save();render();}break;
 case 'place-sticker':placeSticker(event);break;
 case 'remove-sticker':rememberStickers();state.room.stickers.splice(Number(value),1);selectedSticker=null;save();render();break;
 case 'pattern':if(PATTERNS.includes(value)){state.lea.pattern=value;save();render();}break;
 case 'headwear':if(HEADWEAR.includes(value)){state.lea.headwear=value;save();render();}break;
 case 'furnish-tab':if(['things','move','ideas'].includes(value)){furnishTab=value;render();}break;
 case 'room-idea':rememberFurniture();if(tryRoomIdea(state,value)){state.dollhouse.positions={};state.dollhouse.turns={};state.dollhouse.fort=false;selectedFurniture=null;furnitureChanged();}else furnitureHistory.pop();break;
 case 'select-furniture':selectedFurniture=value;furnishTab='move';render();break;
 case 'add-furniture':{rememberFurniture();const item=addFurniture(state,value);if(item){selectedFurniture=item.id;furnishTab='move';furnitureChanged();}else{furnitureHistory.pop();toast('Rummet har plats för tolv möbler. Ta bort en om du vill byta.');}break;}
 case 'furniture-color':{const item=state.room.furniture.find(f=>f.id===selectedFurniture);const n=Number(value);if(item&&Number.isInteger(n)&&ROOM_COLORS[n]){rememberFurniture();item.color=n;furnitureChanged();}break;}
 case 'flip-furniture':{const item=state.room.furniture.find(f=>f.id===selectedFurniture);if(item){rememberFurniture();item.flip=!item.flip;furnitureChanged();}break;}
 case 'remove-furniture':if(selectedFurniture){rememberFurniture();state.room.furniture=state.room.furniture.filter(f=>f.id!==selectedFurniture);selectedFurniture=null;furnitureChanged();}break;
 case 'nudge-furniture':{const item=state.room.furniture.find(f=>f.id===selectedFurniture),delta={up:[0,-3],down:[0,3],left:[-3,0],right:[3,0]}[value];if(item&&delta){rememberFurniture();moveFurniture(state,item.id,item.x+delta[0],item.y+delta[1]);furnitureChanged();}break;}
 case 'furniture-center':if(selectedFurniture){rememberFurniture();moveFurniture(state,selectedFurniture,50,84);furnitureChanged();}break;
 case 'place-furniture':if(selectedFurniture){const canvas=event.target.closest('.furnish-canvas');if(canvas){const r=canvas.getBoundingClientRect();rememberFurniture();moveFurniture(state,selectedFurniture,Number.isFinite(event.clientX)?(event.clientX-r.left)/r.width*100:50,Number.isFinite(event.clientY)?(event.clientY-r.top)/r.height*100:84);furnitureChanged();}}else toast('Välj en möbel först.',true);break;
 case 'undo-furniture':if(furnitureHistory.length){state.room.furniture=furnitureHistory.pop();if(!state.room.furniture.some(f=>f.id===selectedFurniture))selectedFurniture=null;save();render();toast('Den senaste möbeländringen är ångrad.');}else toast('Det finns inget att ångra ännu.');break;
 case 'choose-adventure':if(chooseAdventure(state,value)){save();go('adventures');}break;
 case 'replay-adventure':if(chooseAdventure(state,value,true)){save();go('adventures');}break;
 case 'continue-adventure':{const a=activeAdventure(state);if(a?.step){prepareAdventureStep(state);if(a.step.event==='feed')dogTool='food';if(a.step.event==='brush')dogTool='brush';save();go(a.step.scene);}else go('adventures');break;}
 case 'finish-adventure':{const a=activeAdventure(state);if(a?.step?.event==='finale'){storyEvent('finale');save();render();celebrate('Ett nytt fint minne med Sigge!');}break;}
 case 'garden-find':if(findGardenItem(state,value)){const a=activeAdventure(state);if(a.progress.found.length===3){storyEvent('garden');chime();}else toast('Hittad! Lägg den i picknickkorgen.',true);save();render();}break;
 case 'undo-makeup':state.touch.paint.pop();state.makeup={lips:null,cheeks:null,eyes:null};save();render();break;
 case 'craft-mode':touchController.finish();craftMode=value;render();break;
 case 'drawing-color':drawingColor=Number(value);drawingTool='draw';render();break;
 case 'drawing-tool':drawingTool=drawingTool==='draw'?'eraser':'draw';render();break;
 case 'undo-drawing':state.room.drawing.pop();save();render();break;
 case 'install':installOpen=true;render();break;
 case 'close-install':installOpen=false;render();break;
 case 'native-install':if(deferredInstall){deferredInstall.prompt();deferredInstall=null;}break;
 case 'reset':touchController.finish();if(value==='tidy')state.tidy=[];if(value==='teeth'){state.teeth=Array(8).fill(false);state.touch.teeth=Array(8).fill(0);}if(value==='dog'){resetCare(state);dogTool='brush';}save();render();toast('En ny lekstund. Nu kör vi!');break;
 }
}
function updateTouch({kind,tool,point,cursorPoint,stroke}){
 point=cursorPoint||point;
 const cursor=document.querySelector('.finger-tool');if(cursor&&point){cursor.style.left=(point.x*100)+'%';cursor.style.top=(point.y*100)+'%';cursor.classList?.add('moving');cursor.textContent=toolIcon(kind==='teeth'?'teeth':tool);}
 if(kind==='makeup'){const layer=document.querySelector('.makeup-paint-layer');if(layer)layer.innerHTML=makeupPaint(state,stroke);}
 if(kind==='drawing'){const layer=document.querySelector('.drawing-paint-layer');if(layer)layer.innerHTML=drawingPaint(state.room.drawing,stroke);}
 if(kind==='teeth'){const layer=document.querySelector('.teeth-paint-layer');if(layer)layer.innerHTML=teethPaint(state);const p=document.querySelector('.wide-progress');if(p)p.value=state.touch.teeth.reduce((a,b)=>a+b,0)/8;const n=document.querySelector('.tooth-counter b');if(n)n.textContent=state.teeth.filter(Boolean).length;}
 if(kind==='dog'){for(let i=0;i<5;i++){for(const [selector,opacity] of [['.brush-guide',1-state.touch.brush[i]/100],['.dirt-layer',1-state.touch.rinse[i]/100],['.soap-layer',state.touch.soap[i]/100*(1-state.touch.rinse[i]/100)],['.wet-layer',state.touch.rinse[i]/100*(1-state.touch.dry[i]/100)],['.dry-spark',state.touch.dry[i]/100]]){const el=document.querySelector(`[data-care-zone="${i}"] ${selector}`);if(el)el.style.opacity=opacity;}const value=tool==='food'?(state.dog.fed?100:0):tool==='pet'?state.dog.affection:tool==='ball'?Math.min(100,state.dog.played/3*100):state.touch[tool][i],progress=document.querySelector(`[data-zone-progress="${i}"]`),done=document.querySelector(`[data-zone-done="${i}"]`);if(progress)progress.value=value;if(done)done.textContent=value>=100?'✓':'♡';}const n=tool==='food'?(state.dog.fed?100:0):tool==='pet'?Math.floor(state.dog.affection):tool==='ball'?Math.min(100,Math.floor(state.dog.played/3*100)):Math.floor(state.touch[tool].reduce((a,b)=>a+b,0)/5),p=document.querySelector('.care-total progress'),label=document.querySelector('.care-total span');if(p)p.value=n;if(label)label.textContent=n+'%';}
}
const touchController=createTouchController({getState:()=>state,getTool:kind=>kind==='makeup'?{tool:makeupTool,color:makeupColor,size:makeupSize}:kind==='drawing'?{tool:drawingTool,color:drawingColor}:kind==='dog'?{tool:dogTool}:{tool:'teeth'},onProgress:updateTouch,onBlocked:tool=>toast(tool==='rinse'?'Tvåla den här delen först. Svampen är din vän!':'Skölj den här delen först, sedan tar vi handduken.',true),onEnd:({kind,tool,changed})=>{
 document.querySelector('.finger-tool')?.classList?.remove('moving');if(!changed)return;
 if(kind==='makeup'&&tool!=='eraser')finish('makeup','Vilken härlig färglek, Lea!');
 if(kind==='drawing')finish('craft','Du har skapat en alldeles egen bild!');
 if(kind==='dog'){
 if(tool==='brush'&&state.dog.brushed===100){if(complete(state,'brush'))celebrate('Sigge är mjuk och fluffig överallt!');storyEvent('brush');}
 if(tool==='soap'&&state.touch.soap.every(v=>v>=100)){dogTool='rinse';toast('Så bubbligt! Nu sköljer vi med duschen.',true);}
 if(tool==='rinse'&&state.touch.rinse.every(v=>v>=100)){dogTool='dry';toast('All lera är borta! Nu tar vi handduken.',true);}
 if(tool==='dry'&&state.dog.clean.every(Boolean)){washDay(state);if(complete(state,'wash'))celebrate('Ren, torr och mysig. Tack, Lea!');}
 if(tool==='pet')toast('Sigge njuter av dina mjuka klappar. 💗');
 if(tool==='ball') {chime();toast('Fångad! En gång till? 🎾',true);}
 if(tool==='food'&&state.dog.fed){storyEvent('feed');celebrate('Mums! Sigge tackar med en svansviftning.');}
 }
 if(kind==='teeth'&&state.teeth.every(Boolean)){if(complete(state,'teeth'))celebrate('Alla tänder glittrar. Vilket härligt leende!');storyEvent('teeth');}
 save();render();
}});



function updateRoomControls(){for(const [action,text]of [['room-lamp',state.dollhouse.lamp?'💡 Släck':'💡 Tänd'],['room-night',state.dollhouse.night?'☀️ Dag':'🌙 Kväll'],['room-curtains',state.dollhouse.curtains?'🪟 Öppna':'🪟 Dra för'],['room-mode',roomUI.edit?'✓ Lek i rummet':'✥ Flytta möbler']]){const el=document.querySelector('.room-bottom-controls [data-action="'+action+'"]');if(el)el.textContent=text;}}
function updateRoomPanel(){updateRoomControls();const panel=document.querySelector('.dollhouse-panel');if(panel)panel.innerHTML=dollhousePanel(state,roomUI);colorPainter.mount();}
function dollAction(action,value){if(!action.startsWith('room-'))return false;const d=state.dollhouse;switch(action){
 case 'room-mode':roomUI.edit=value==='edit';roomUI.tab='play';if(scene==='furnish'&&!roomUI.edit){scene='home';}render();break;
 case 'room-tab':if(['play','furniture','pictures'].includes(value)){roomUI.tab=value;if(value==='furniture')roomUI.edit=true;updateRoomPanel();}break;
 case 'room-camera':dollController.command('camera',value);break;
 case 'room-lamp':d.lamp=!d.lamp;save();render();break;
 case 'room-night':d.night=!d.night;save();render();if(d.night)toast('Nu blir det kvällsmys. Tänd lampan om du vill.',true);break;
 case 'room-curtains':d.curtains=!d.curtains;save();updateRoomControls();break;
 case 'room-add':{const item=addFurniture(state,value);if(item){roomUI.selection=item.id;roomUI.edit=true;roomUI.tab='play';save();render();}else toast('Det finns plats för tolv möbler. Ta bort en om du vill byta.',true);break;}
 case 'room-remove':state.room.furniture=state.room.furniture.filter(i=>i.id!==value);delete d.positions[value];delete d.turns[value];delete d.open[value];roomUI.selection=null;save();render();break;
 case 'room-rotate':if(rotateFurniture3d(state,value)){save();render();}else toast('Möbeln behöver lite mer plats för att vändas.',true);break;
 case 'room-color':{const [id,n]=value.split(':');const item=state.room.furniture.find(i=>i.id===id);if(item&&ROOM_COLORS[Number(n)]){item.color=Number(n);save();render();}break;}
 case 'room-frame':{const [index,page]=value.split(':');if(setFrame(state,Number(index),page==='none'?null:page)){save();render();chime();}break;}
 case 'room-fort':if(d.fort){roomUI.selection='fort';roomUI.tab='play';updateRoomPanel();dollController.command('fort');}else if(guideFortPiece(state)){save();render();if(d.fort){roomUI.selection='fort';updateRoomPanel();dollController.command('fort');celebrate('Du byggde en koja! Sigge vill också komma in.');}else toast('Där kom en del på plats! Dra nästa kudde eller filten till mattan.',true);}break;
 case 'room-unpack':unpackFort(state);roomUI.selection=null;save();render();break;
 case 'room-fort-light':if(!d.fort){toast('Bygg en koja av kuddarna och filten först.',true);break;}d.fortLight=!d.fortLight;save();break;
 case 'room-dog':dollController.command('dog',value);break;
 case 'room-water':d.plant=Math.min(100,d.plant+25);if(d.plant===100){roomDiscover(state,'flower');celebrate('En liten blomma! Vad fint du vattnade.');}else toast('Blomman fick en liten klunk. 🚿',true);save();break;
 case 'room-story':if(!d.fort){toast('Vi bygger en mysig koja att läsa i!',true);dollAction('room-fort','');break;}d.fortLight=true;roomDiscover(state,'story');const card=document.querySelector('.room-story-card');if(card)card.hidden=false;dollController.command('fort');speak('Sigge nosade på filten. Vem gömde sig där? Lea tände ficklampan. Där låg nallen och väntade på sina bästa vänner.');save();break;
 case 'room-close-story':{const card=document.querySelector('.room-story-card');if(card)card.hidden=true;break;}
 default:return false;}return true;}
const dollController=createDollhouseController({getState:()=>state,getUI:()=>roomUI,onSave:()=>{save();updateRoomControls();},onMessage:t=>toast(t,true),onSelect:id=>{roomUI.selection=id;roomUI.tab='play';updateRoomPanel();},onArrival:g=>{if(g.goal==='tea')go('tea');}});
function updateColorControls(){const page=state.coloring.pages[state.coloring.selected];const undo=document.querySelector('[data-action="color-undo"]'),redo=document.querySelector('[data-action="color-redo"]'),clear=document.querySelector('[data-action="color-clear"]');if(undo)undo.disabled=!page.actions.length;if(redo)redo.disabled=!colorRedo[state.coloring.selected].length;if(clear)clear.disabled=!page.actions.length;}
function colorAction(action,value){if(!['color-pages','color-page','open-color-page','color-tool','color-color','color-size','color-inside','color-undo','color-redo','color-clear','color-frame'].includes(action))return false;colorController.finish();const id=state.coloring.selected;switch(action){
 case 'color-pages':colorPicker=!colorPicker;render();if(colorPicker)document.querySelector('.color-close')?.focus?.();break;
 case 'color-page':case 'open-color-page':if(selectColorPage(state,value)){colorPicker=false;save();if(scene!=='coloring')go('coloring');else render();}break;
 case 'color-tool':if(['brush','fill','eraser'].includes(value)){colorTool=value;render();speak(coachText());}break;
 case 'color-color':if(Number.isInteger(Number(value))&&COLOR_PALETTE[Number(value)]){colorColor=Number(value);if(colorTool==='eraser')colorTool='brush';render();}break;
 case 'color-size':if(Number.isInteger(Number(value))&&COLOR_SIZES[Number(value)]){colorSize=Number(value);render();}break;
 case 'color-inside':state.coloring.inside=!state.coloring.inside;save();render();break;
 case 'color-undo':{const last=undoColorPage(state,id);if(last){colorRedo[id].push(last);save();render();}break;}
 case 'color-redo':{const last=colorRedo[id].pop();if(last&&addColorAction(state,id,last)){save();render();}break;}
 case 'color-clear':if(clearColorPage(state,id)){colorRedo[id]=[];save();render();toast('Ett rent papper! Ångra tar tillbaka dina färger.',true);}break;
 case 'color-frame':if(frameColorPage(state,id)){save();celebrate('Din fina bild finns i albumet!');}else toast('Måla lite på bilden först. Sedan får den en plats i albumet.',true);break;
 }return true;}
const colorPainter=createColoringPainter({getState:()=>state,onError:()=>toast('Prova att välja bilden igen när den har laddat.',true)});
const colorController=createColoringController({getState:()=>state,getTool:()=>({tool:colorTool,color:colorColor,size:colorSize}),painter:colorPainter,onSave:save,onChange:id=>{colorRedo[id]=[];updateColorControls();},onLimit:()=>toast('Det finns många färger på bilden! Du kan ångra eller välja ett nytt motiv.',true)});
function withPlayLink(html,target){return html.replace('</aside>',`<div class="play-launch">${btn(target==='parade'?'🌟 Visa stilen på paraden':target==='tea'?'🫖 Bjud på te i ditt rum':'🌳 Lek ute med Sigge',target==='meadow'?'free-play':'go',target)}</div></aside>`);}
function stopMusic(){clearInterval(musicTimer);musicTimer=null;}
function startMusic(){stopMusic();if(!state.sound||scene!=='parade')return;const tune={happy:[523,659,784,659,587,698,784,0],dream:[392,0,494,0,587,0,494,0],bounce:[262,392,330,523,262,392,659,523]};musicNote=0;const note=()=>{try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();audioContext.resume();const f=tune[state.day.parade.music][musicNote++%8];if(!f)return;const o=audioContext.createOscillator(),g=audioContext.createGain(),t=audioContext.currentTime;o.type=state.day.parade.music==='bounce'?'triangle':'sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.04,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.3);o.connect(g);g.connect(audioContext.destination);o.start(t);o.stop(t+.32);}catch{}};note();musicTimer=setInterval(note,state.day.parade.music==='dream'?450:300);}
function playAction(action,value){switch(action){
 case 'resume-day':freePlay=false;go(({packing:'packing',garden:'meadow',picnic:'picnic',finished:'picnic'})[state.day.phase]);break;
 case 'free-play':freePlay=true;playMode='pet';go('meadow');break;
 case 'pack':if(togglePack(state,value)){save();render();chime();}else toast('Korgen har tre platser. Tryck på en sak för att lägga tillbaka den.',true);break;
 case 'start-day':if(startDay(state)){freePlay=false;playMode=state.day.packed.includes('ball')?'ball':state.day.packed.includes('bubbles')?'bubbles':state.day.packed.includes('water')?'water':'pet';save();go('meadow');}break;
 case 'play-mode':if(['ball','pet','bubbles','water','mud'].includes(value)&&canPlay(state,value,freePlay)){playController.stop();playMode=value;render();speak(PLAY_HINTS[value]);}break;
 case 'picnic-time':playController.stop();if(state.day.phase==='garden'){state.day.phase='picnic';save();}go('picnic');break;
 case 'bath-day':dogTool='soap';go('dog');break;
 case 'new-day':newDay(state);freePlay=false;save();go('packing');break;
 case 'finish-day':if(state.day.phase==='picnic'&&state.day.picnic.every(Boolean)){if(takePhoto(state,'picnic')){finishPicnic(state);save();render();celebrate('Vilken fin dag! Bilden finns i ditt album.');}else toast('Albumet har åtta bilder. Ta bort en bild för att spara en ny.',true);}break;
 case 'take-photo':if(takePhoto(state,value)){save();chime();toast('Klick! Din bild finns i albumet. 📸',true);}else toast('Albumet har åtta bilder. Ta bort en bild för att spara en ny.',true);break;
 case 'delete-photo':state.day.photos=state.day.photos.filter(v=>v.id!==value);save();render();break;
 case 'parade-background':if(['flowers','rainbow','stars'].includes(value)){state.day.parade.background=value;save();render();}break;
 case 'parade-pose':if(['proud','dance','bow','jump'].includes(value)){state.day.parade.pose=value;save();render();}break;
 case 'parade-music':if(['happy','dream','bounce'].includes(value)){state.day.parade.music=value;save();render();startMusic();}break;
 case 'tea-guest':if(['bear','bunny','cat'].includes(value)){state.day.tea.guest=value;save();render();chime();}break;
 case 'reset-tea':state.day.tea.cups=[0,0,0];state.day.tea.snacks=[false,false,false];save();render();break;
 case 'discover':if(discover(state,value)){save();chime();render();speak('Titta, vad gömde sig där?');}else{chime();toast('Där är din lilla skatt! ✨',true);}break;
 default:return false;}return true;}
function updatePlay(frame){
 if(scene==='meadow'){const layer=document.querySelector('.live-play-layer');if(layer)layer.innerHTML=meadowLayer(state,playMode,frame);const plant=document.querySelector('.growing-plant');if(plant?.style?.setProperty)plant.style.setProperty('--growth',state.day.water/100);if(plant?.classList?.toggle)plant.classList.toggle('bloomed',state.day.water>=100);const flower=plant?.querySelector?.('span');if(flower)flower.textContent=state.day.water>=100?'🌸':'🌱';const progress=plant?.querySelector?.('progress');if(progress)progress.value=state.day.water;}
 if(scene==='parade'){const el=document.querySelector('.parade-lea');if(el)el.style.left=(state.day.parade.x*100)+'%';}
 if(scene==='tea'){document.querySelectorAll('.tea-cup').forEach((el,i)=>el.style.setProperty('--fill',state.day.tea.cups[i]+'%'));const ghost=document.querySelector('.tea-drag');if(ghost){ghost.textContent=frame.drag==='pot'?'🫖':frame.drag==='snack'?'🍓':'';if(frame.cursor){ghost.style.left=frame.cursor.x*100+'%';ghost.style.top=frame.cursor.y*100+'%';}}const pot=document.querySelector('.tea-pot');if(pot)pot.style.opacity=frame.drag==='pot'?'0':'1';}
 if(scene==='home')document.querySelectorAll('.footprints>span').forEach((el,i)=>el.style.opacity=1-state.day.prints[i]/100);
 if(scene==='packing'){const ghost=document.querySelector('.pack-ghost');if(ghost){ghost.textContent=frame.drag==='pack'?(PACKING.find(v=>v.id===frame.pack)?.emoji||'🧺'):'';if(frame.cursor){ghost.style.left=frame.cursor.x*100+'%';ghost.style.top=frame.cursor.y*100+'%';}}}
 if(scene==='picnic'){const ghost=document.querySelector('.picnic-surface .play-cursor');if(ghost){ghost.textContent=frame.drag==='fruit'?'🍎 🦴':'';if(frame.cursor){ghost.style.left=frame.cursor.x*100+'%';ghost.style.top=frame.cursor.y*100+'%';}}}
}
const playController=createPlayController({getState:()=>state,getScene:()=>scene,getMode:()=>playMode,getFree:()=>freePlay,getNose:()=>{const d=document.querySelector('.moving-sigge')?.getBoundingClientRect?.(),r=document.querySelector('.meadow-surface')?.getBoundingClientRect?.();return d&&r?{x:-.1*d.width/r.width,y:-.72*d.height/r.height}:{x:-.023,y:-.2};},onFrame:updatePlay,onSave:()=>{save();if(scene==='meadow'&&state.day.muddy){const title=document.querySelector('.meadow-surface .play-heading h2');if(title)title.textContent='Oj, vilka leriga tassar!';if(!document.querySelector('.toolbar-next [data-action="bath-day"]'))document.querySelector('.toolbar-next')?.insertAdjacentHTML?.('beforeend',btn('🛁 Bada Sigge','bath-day','','secondary'));}},onMessage:text=>toast(text,true),onEnd:(kind,result)=>{if(result==='drag'){suppressClick=true;setTimeout(()=>suppressClick=false,0);}if(kind==='fetch'){chime();}else if(result==='drag'&&['packing','home','tea','picnic'].includes(scene))render();}});
document.addEventListener?.('visibilitychange',()=>{if(document.hidden){dollController.detach();colorController.finish();playController.stop();touchController.finish();stopMusic();save();}else if(state.entered&&!showWelcome&&['home','furnish'].includes(scene))dollController.mount();});
window.addEventListener('blur',()=>{dollController.detach();colorController.finish();playController.stop();touchController.finish();stopMusic();save();});
window.addEventListener('resize',()=>{dollController.detach();colorController.finish();colorPainter.detach();playController.stop();touchController.finish();if(state.entered&&!showWelcome)render();});
app.addEventListener('click',event=>{const el=event.target.closest('[data-action]');if(el&&!drag?.moved&&!suppressClick)act(el.dataset.action,el.dataset.value,event);});
app.addEventListener('keydown',event=>{if(event.key==='Escape'&&scene==='coloring'&&colorPicker){colorPicker=false;render();return;}if((event.key==='Enter'||event.key===' ')&&event.target.matches('.craft-wall, .furnish-canvas')){event.preventDefault();if(event.target.matches('.craft-wall'))placeSticker(event);else act('place-furniture','',event);}});
// Pointer events work with a finger, a mouse and a stylus. Sorting never needs a drag.
app.addEventListener('pointerdown',event=>{if(dollController.down(event))return;if(colorController.down(event))return;if(playController.down(event))return;if(touchController.down(event))return;if(event.isPrimary===false||event.button>0)return;const stamp=event.target.closest('[data-sticker]');if(stamp&&scene==='craft'&&craftMode==='stickers'){const i=Number(stamp.dataset.sticker),item=state.room.stickers[i];if(item){selectedSticker=i;stickerDrag={i,x:event.clientX,y:event.clientY,originX:item.x,originY:item.y,moved:false,before:structuredClone(state.room.stickers)};}return;}const furniture=event.target.closest('[data-furniture]');if(furniture){selectedFurniture=furniture.dataset.furniture;const initial=state.room.furniture.find(f=>f.id===selectedFurniture);furnitureDrag={id:selectedFurniture,x:event.clientX,y:event.clientY,originX:initial.x,originY:initial.y,moved:false,before:JSON.parse(JSON.stringify(state.room.furniture))};}const toy=event.target.closest('[data-draggable]');if(toy){drag={id:toy.dataset.draggable,startX:event.clientX,startY:event.clientY,moved:false};}if(event.target.closest('[data-scrub]'))lastScrub=0;});
app.addEventListener('pointermove',event=>{
 if(dollController.move(event))return;if(colorController.move(event))return;if(playController.move(event))return;if(touchController.move(event))return;if(event.isPrimary===false)return;
 if(stickerDrag){const d=stickerDrag;if(Math.hypot(event.clientX-d.x,event.clientY-d.y)>8)d.moved=true;if(d.moved){event.preventDefault();const r=document.querySelector('.craft-wall').getBoundingClientRect(),item=state.room.stickers[d.i],el=document.querySelector(`[data-sticker="${d.i}"]`);item.x=Math.max(8,Math.min(92,d.originX+(event.clientX-d.x)/r.width*100));item.y=Math.max(10,Math.min(90,d.originY+(event.clientY-d.y)/r.height*100));if(el){el.style.left=item.x+'%';el.style.top=item.y+'%';}}return;}
 if(furnitureDrag){const d=furnitureDrag;if(!d.moved&&Math.hypot(event.clientX-d.x,event.clientY-d.y)>8)d.moved=true;if(d.moved){event.preventDefault();const canvas=document.querySelector('.furnish-canvas'),r=canvas.getBoundingClientRect();moveFurniture(state,d.id,d.originX+(event.clientX-d.x)/r.width*100,d.originY+(event.clientY-d.y)/r.height*100);const item=state.room.furniture.find(f=>f.id===d.id),el=document.querySelector(`[data-furniture="${d.id}"]`);if(el){el.style.left=item.x+'%';el.style.top=item.y+'%';}}return;}
 if(drag){if(!drag.moved&&Math.hypot(event.clientX-drag.startX,event.clientY-drag.startY)>10){drag.moved=true;selectedToy=drag.id;const ghost=document.createElement('div');ghost.id='drag-ghost';ghost.textContent=icons[TOYS.find(t=>t.id===drag.id).icon];document.body.append(ghost);}if(drag.moved){event.preventDefault();const ghost=document.querySelector('#drag-ghost');ghost.style.left=event.clientX+'px';ghost.style.top=event.clientY+'px';document.querySelectorAll('[data-drop]').forEach(n=>n.classList.remove('drop-ready'));document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-drop]')?.classList.add('drop-ready');}return;}

});
window.addEventListener('pointerup',event=>{if(dollController.up(event))return;if(colorController.up(event))return;if(playController.up(event))return;if(touchController.up(event))return;if(event.isPrimary===false)return;if(stickerDrag){const d=stickerDrag;stickerDrag=null;if(d.moved){stickerHistory.push(d.before);if(stickerHistory.length>20)stickerHistory.shift();save();suppressClick=true;render();setTimeout(()=>suppressClick=false,0);}return;}if(furnitureDrag){const d=furnitureDrag;furnitureDrag=null;if(d.moved){furnitureHistory.push(d.before);if(furnitureHistory.length>20)furnitureHistory.shift();suppressClick=true;furnitureChanged();setTimeout(()=>suppressClick=false,0);}return;}if(!drag)return;const previous=drag;document.querySelector('#drag-ghost')?.remove();document.querySelectorAll('.drop-ready').forEach(n=>n.classList.remove('drop-ready'));if(previous.moved){const box=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-drop]');if(box)sortInto(box.dataset.drop);else{render();toast('Du kan också trycka på saken och sedan lådan.');}setTimeout(()=>drag=null,0);}else drag=null;});
app.addEventListener('lostpointercapture',event=>{dollController.cancel(event);colorController.cancel(event);playController.cancel(event);});
window.addEventListener('pointercancel',event=>{if(dollController.cancel(event||{}))return;if(colorController.cancel(event||{}))return;if(playController.cancel(event||{}))return;if(touchController.cancel(event||{}))return;if(event?.isPrimary===false)return;if(stickerDrag){state.room.stickers=stickerDrag.before;stickerDrag=null;save();render();}if(furnitureDrag){state.room.furniture=furnitureDrag.before;furnitureDrag=null;save();render();}drag=null;document.querySelector('#drag-ghost')?.remove();document.querySelectorAll('.drop-ready').forEach(n=>n.classList.remove('drop-ready'));});
window.addEventListener('pageshow',()=>{if(state.entered&&!showWelcome)colorPainter.mount();if(['home','furnish'].includes(scene))dollController.mount();});
window.addEventListener('pagehide',()=>{dollController.detach();colorController.finish();colorPainter.detach();playController.stop();stopMusic();touchController.finish();save();window.speechSynthesis?.cancel();});
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstall=event;});
render();
if('serviceWorker'in navigator&&/^https?:$/.test(location.protocol))navigator.serviceWorker.register('./sw.js').catch(()=>{});
