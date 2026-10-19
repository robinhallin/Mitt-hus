export const COLOR_PAGES=[
 {id:'garden',name:'I blomsterträdgården',emoji:'🌸'},
 {id:'picnic',name:'Picknick med Sigge',emoji:'🧺'},
 {id:'bubbles',name:'Sigges bubbeljakt',emoji:'🫧'},
 {id:'parade',name:'Leas fantasiparad',emoji:'👑'},
 {id:'bath',name:'Ett bubbligt hundbad',emoji:'🛁'},
 {id:'room',name:'Mys i Leas rum',emoji:'🧸'},
 {id:'blank',name:'Mitt eget papper',emoji:'🖍️'},
];
export const COLOR_PALETTE=['#ed6b82','#f29d59','#f4cf5d','#a6ce73','#57ae9b','#75bdda','#7d9fdc','#ad88ce','#d69dc0','#f6c4b7','#f0d7a7','#c39c77','#88674f','#d5b7a1','#b7dcca','#d9c8ee','#59535f','#ffffff'];
export const COLOR_SIZES=[.016,.035,.065];
export const COLOR_LIMIT=160;
const point=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)?{x:Math.round(Math.max(0,Math.min(1,p.x))*10000)/10000,y:Math.round(Math.max(0,Math.min(1,p.y))*10000)/10000}:null;
export const pageAsset=id=>COLOR_PAGES.some(p=>p.id===id)&&id!=='blank'?`./assets/coloring/${id}.webp`:null;
export function freshColoring(){return {selected:'garden',inside:true,pages:Object.fromEntries(COLOR_PAGES.map(p=>[p.id,{actions:[],framed:false}]))};}
export function normalizeAction(a){if(!a||!['brush','eraser','fill','clear'].includes(a.type))return null;if(a.type==='clear')return {type:'clear'};const color=Number.isInteger(a.color)&&COLOR_PALETTE[a.color]?a.color:0,size=Number.isInteger(a.size)&&COLOR_SIZES[a.size]?a.size:1,seed=point(a.seed);if(a.type==='fill')return seed?{type:'fill',color,seed}:null;const points=Array.isArray(a.points)?a.points.slice(0,128).map(point).filter(Boolean):[];if(!points.length)return null;return {type:a.type,color,size,points,...(a.type==='brush'&&seed?{seed}:{})};}
export function normalizeColoring(raw){const s=freshColoring();if(!raw||typeof raw!=='object')return s;if(COLOR_PAGES.some(p=>p.id===raw.selected))s.selected=raw.selected;s.inside=raw.inside!==false;for(const p of COLOR_PAGES){const r=raw.pages?.[p.id];s.pages[p.id]={actions:Array.isArray(r?.actions)?r.actions.slice(0,COLOR_LIMIT).map(normalizeAction).filter(Boolean):[],framed:r?.framed===true};}return s;}
export function selectColorPage(s,id){if(!COLOR_PAGES.some(p=>p.id===id))return false;s.coloring.selected=id;return true;}
export function addColorAction(s,id,raw){if(!COLOR_PAGES.some(p=>p.id===id))return false;const p=s.coloring.pages[id],a=normalizeAction(raw);if(!p||!a||p.actions.length>=COLOR_LIMIT)return false;p.actions.push(a);return true;}
export function clearColorPage(s,id){const p=s.coloring.pages[id];if(!p||!p.actions.length||p.actions.at(-1).type==='clear')return false;return addColorAction(s,id,{type:'clear'});}
export function undoColorPage(s,id){return s.coloring.pages[id]?.actions.pop()||null;}
export function frameColorPage(s,id){const p=s.coloring.pages[id];if(!p||!p.actions.some(a=>['brush','fill'].includes(a.type)))return false;p.framed=true;return true;}
export function colorPoint(rect,x,y){const side=Math.min(rect.width,rect.height),left=rect.left+(rect.width-side)/2,top=rect.top+(rect.height-side)/2;if(side<=0||x<left||y<top||x>left+side||y>top+side)return null;return {x:Math.max(0,Math.min(1,(x-left)/side)),y:Math.max(0,Math.min(1,(y-top)/side))};}
// Connected regions use only the original line art. Painted colors cannot change boundaries.
export function buildColorRegions(rgba,width,height){
 const length=width*height,blocked=new Uint8Array(length),closed=new Uint8Array(length),labels=new Int32Array(length),queue=new Int32Array(length),regions=[new Uint32Array(0)];
 for(let i=0;i<length;i++){const k=i*4;if(rgba[k+3]>100&&(rgba[k]*.2126+rgba[k+1]*.7152+rgba[k+2]*.0722)<190)blocked[i]=1;}
 for(let i=0;i<length;i++)if(blocked[i]){closed[i]=1;if(i%width)closed[i-1]=1;if(i%width<width-1)closed[i+1]=1;if(i>=width)closed[i-width]=1;if(i+width<length)closed[i+width]=1;}
 for(let i=0;i<length;i++){if(closed[i]||labels[i])continue;const id=regions.length;let head=0,tail=1;queue[0]=i;labels[i]=id;while(head<tail){const n=queue[head++],x=n%width;for(const q of [x?n-1:-1,x<width-1?n+1:-1,n>=width?n-width:-1,n+width<length?n+width:-1])if(q>=0&&!closed[q]&&!labels[q]){labels[q]=id;queue[tail++]=q;}}regions.push(new Uint32Array(queue.slice(0,tail)));}
 function regionAt(p){const x=Math.min(width-1,Math.floor(p.x*width)),y=Math.min(height-1,Math.floor(p.y*height)),n=y*width+x;if(labels[n])return {id:labels[n],seed:{x:(x+.5)/width,y:(y+.5)/height}};for(let r=1;r<=8;r++)for(let dy=-r;dy<=r;dy++)for(const dx of [-r,r]){const a=x+dx,b=y+dy;if(a>=0&&b>=0&&a<width&&b<height&&labels[b*width+a])return {id:labels[b*width+a],seed:{x:(a+.5)/width,y:(b+.5)/height}};}return null;}
 return {width,height,labels,regions,regionAt};
}
export function createColoringController({getState,getTool,painter,onSave=()=>{},onLimit=()=>{},onChange=()=>{}}){let active=null;
 function end(e={}){if(!active||(e.pointerId!==undefined&&e.pointerId!==active.id))return false;const g=active;active=null;try{g.surface.releasePointerCapture?.(g.id);}catch{}if(addColorAction(getState(),g.page,g.action)){painter.commit?.();onSave();onChange(g.page);}else painter.restore?.();return true;}
 function move(e){if(!active)return false;if((e.pointerId??1)!==active.id)return true;e.preventDefault?.();if(active.action.type==='fill')return true;const events=e.getCoalescedEvents?.()||[e];for(const v of events.length?events:[e]){const p=colorPoint(active.surface.getBoundingClientRect(),v.clientX,v.clientY);if(!p)continue;const a=active.action.points,last=a.at(-1);if(Math.hypot(p.x-last.x,p.y-last.y)<.001)continue;if(a.length>=128)active.action.points=a.filter((_,i)=>i%2===0);active.action.points.push(p);}painter.preview?.(active.action);return true;}
 return {
 down(e){const surface=e.target.closest?.('[data-coloring-surface]');if(!surface)return false;if(active||e.isPrimary===false||e.button>0)return true;const s=getState(),page=s.coloring.selected,p=colorPoint(surface.getBoundingClientRect(),e.clientX,e.clientY);if(!p||painter.ready?.(page)===false)return true;if(s.coloring.pages[page].actions.length>=COLOR_LIMIT){onLimit();return true;}const tool=getTool(),seed=painter.regionSeed?.(p)||null;if(tool.tool!=='eraser'&&s.coloring.inside&&page!=='blank'&&!seed)return true;const action={type:tool.tool,color:tool.color,size:tool.size,...(tool.tool==='fill'?{seed:seed||p}:{points:[p],...(s.coloring.inside&&page!=='blank'&&seed&&tool.tool!=='eraser'?{seed}:{})})};active={id:e.pointerId??1,surface,page,action};try{surface.setPointerCapture?.(active.id);}catch{}e.preventDefault?.();painter.begin?.();painter.preview?.(action);return true;},
 move,up(e){if(active&&e.pointerId===active.id&&Number.isFinite(e.clientX))move(e);return end(e);},cancel:e=>end(e||{}),finish:()=>end(),get active(){return !!active;}
 };
}
