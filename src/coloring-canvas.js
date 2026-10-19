import {buildColorRegions,pageAsset,COLOR_PALETTE,COLOR_SIZES} from './coloring.js';
export const COLOR_RESOLUTION=768;
const atlasCache=new Map();
const makeCanvas=(doc,size=COLOR_RESOLUTION)=>{const c=doc.createElement('canvas');c.width=c.height=size;return c;};
async function loadAtlas(id,doc){
 if(atlasCache.has(id))return atlasCache.get(id);
 const pending=(async()=>{const c=makeCanvas(doc),ctx=c.getContext('2d',{willReadFrequently:true});ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);const url=pageAsset(id);if(url){const img=new Image();img.src=url;await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('Bilden kunde inte laddas'));if(img.complete&&img.naturalWidth)resolve();});ctx.drawImage(img,0,0,c.width,c.height);}return {...buildColorRegions(ctx.getImageData(0,0,c.width,c.height).data,c.width,c.height),masks:new Map()};})();
 atlasCache.set(id,pending);while(atlasCache.size>2)atlasCache.delete(atlasCache.keys().next().value);
 try{return await pending;}catch(error){atlasCache.delete(id);throw error;}
}
function regionMask(atlas,point,doc){const region=atlas.regionAt(point);if(!region)return null;if(atlas.masks.has(region.id))return atlas.masks.get(region.id);const c=makeCanvas(doc,atlas.width);c.height=atlas.height;const ctx=c.getContext('2d'),pixels=ctx.createImageData(c.width,c.height);for(const i of atlas.regions[region.id]){const k=i*4;pixels.data[k]=pixels.data[k+1]=pixels.data[k+2]=pixels.data[k+3]=255;}ctx.putImageData(pixels,0,0);atlas.masks.set(region.id,c);while(atlas.masks.size>3)atlas.masks.delete(atlas.masks.keys().next().value);return c;}
export function paintColorAction(canvas,action,atlas,doc=globalThis.document,scratch=null){
 const ctx=canvas.getContext('2d'),size=canvas.width;if(action.type==='clear'){ctx.clearRect(0,0,size,size);return;}
 const layer=scratch||makeCanvas(doc,size),ink=layer.getContext('2d');ink.clearRect(0,0,size,size);ink.globalCompositeOperation='source-over';ink.fillStyle=ink.strokeStyle=COLOR_PALETTE[action.color];
 if(action.type==='fill'){ink.fillRect(0,0,size,size);}else{ink.lineWidth=COLOR_SIZES[action.size]*size;ink.lineCap=ink.lineJoin='round';const points=action.points;ink.beginPath();ink.moveTo(points[0].x*size,points[0].y*size);for(const p of points.slice(1))ink.lineTo(p.x*size,p.y*size);if(points.length===1){ink.arc(points[0].x*size,points[0].y*size,ink.lineWidth/2,0,Math.PI*2);ink.fill();}else ink.stroke();}
 if(action.seed){const mask=regionMask(atlas,action.seed,doc);if(!mask)return;ink.globalCompositeOperation='destination-in';ink.drawImage(mask,0,0,size,size);ink.globalCompositeOperation='source-over';}
 ctx.save();ctx.globalCompositeOperation=action.type==='eraser'?'destination-out':'source-over';ctx.drawImage(layer,0,0);ctx.restore();
}
export function replayColorPage(canvas,actions,atlas,doc=globalThis.document){canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);const scratch=makeCanvas(doc,canvas.width);for(const a of actions)paintColorAction(canvas,a,atlas,doc,scratch);}
// Detached canvases cannot receive results from an older, asynchronous image load.
export function createColoringPainter({getState,doc=globalThis.document,onError=()=>{}}){let generation=0,board=null,atlas=null,backup=null,layer=null,page=null,scheduled=null,latest=null;
 function draw(){scheduled=null;if(!latest||!board||!backup||!atlas)return;board.getContext('2d').clearRect(0,0,board.width,board.height);board.getContext('2d').drawImage(backup,0,0);paintColorAction(board,latest,atlas,doc,layer);}
 return {
 async mount(){const area=doc.querySelector('.color-paper-area'),paper=doc.querySelector('.color-paper');if(area?.clientWidth&&area?.clientHeight&&paper){const side=Math.floor(Math.min(area.clientWidth,area.clientHeight));paper.style.width=side+'px';paper.style.height=side+'px';}const mine=++generation;board=null;atlas=null;page=null;const canvas=doc.querySelector('[data-coloring-board]');if(canvas?.getContext){const id=canvas.dataset.coloringBoard;try{const data=await loadAtlas(id,doc);if(mine!==generation||!canvas.isConnected)return;board=canvas;atlas=data;page=id;backup=makeCanvas(doc);layer=makeCanvas(doc);replayColorPage(board,getState().coloring.pages[id].actions,atlas,doc);doc.querySelector('.color-loading')?.remove();}catch(error){if(mine===generation){const label=doc.querySelector('.color-loading');if(label){label.textContent='Bilden kunde inte laddas. Prova Välj bild igen.';label.classList.add('failed');}onError(error);}}}
 const previews=[...(doc.querySelectorAll?.('[data-coloring-preview]')||[])];for(const preview of previews){if(!getState().coloring.pages[preview.dataset.coloringPreview]?.actions.length)continue;try{const data=await loadAtlas(preview.dataset.coloringPreview,doc);if(mine!==generation||!preview.isConnected)return;const full=makeCanvas(doc);replayColorPage(full,getState().coloring.pages[preview.dataset.coloringPreview].actions,data,doc);preview.getContext('2d').drawImage(full,0,0,preview.width,preview.height);}catch{}}
 },
 ready:id=>!!board&&!!atlas&&page===id,
 regionSeed:p=>atlas?.regionAt(p)?.seed||null,
 begin(){latest=null;backup.getContext('2d').clearRect(0,0,backup.width,backup.height);backup.getContext('2d').drawImage(board,0,0);},
 preview(action){latest=action;if(scheduled===null){const raf=globalThis.requestAnimationFrame;if(raf)scheduled=raf(draw);else draw();}},
 commit(){if(scheduled!==null&&globalThis.cancelAnimationFrame)cancelAnimationFrame(scheduled);scheduled=null;draw();latest=null;},
 restore(){latest=null;if(board&&backup){board.getContext('2d').clearRect(0,0,board.width,board.height);board.getContext('2d').drawImage(backup,0,0);}},
 detach(){generation++;if(scheduled!==null&&globalThis.cancelAnimationFrame)cancelAnimationFrame(scheduled);scheduled=null;latest=null;board=atlas=backup=layer=null;page=null;}
 };
}

// Use the same saved operations for real framed canvases in the 3D room.
export async function renderColoringTexture(id,actions,doc=globalThis.document){const atlas=await loadAtlas(id,doc),paint=makeCanvas(doc);replayColorPage(paint,actions,atlas,doc);const out=makeCanvas(doc),ctx=out.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,out.width,out.height);ctx.drawImage(paint,0,0);const url=pageAsset(id);if(url){const img=new Image();img.src=url;await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;if(img.complete&&img.naturalWidth)resolve();});ctx.globalCompositeOperation='multiply';ctx.drawImage(img,0,0,out.width,out.height);ctx.globalCompositeOperation='source-over';}return out;}
