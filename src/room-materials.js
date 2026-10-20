import * as T from '../assets/vendor/room-three.js';

// Original repeatable artwork, generated once per material; no network assets.
export function roomTexture(kind,color,textures){
 const canvas=globalThis.document?.createElement?.('canvas'),ctx=canvas?.getContext?.('2d');if(!ctx)return null;
 const size=kind==='parquet'||kind==='wall'?1024:512;canvas.width=canvas.height=size;
 ctx.fillStyle=color;ctx.fillRect(0,0,size,size);
 let seed=813;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const flower=(x,y,r)=>{ctx.fillStyle='#f8eee1';for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ctx.beginPath();ctx.ellipse(x+Math.cos(a)*r*.65,y+Math.sin(a)*r*.65,r*.46,r*.34,a,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#d3a957';ctx.beginPath();ctx.arc(x,y,r*.23,0,Math.PI*2);ctx.fill();};
 if(kind==='wood'){
  const g=ctx.createLinearGradient(0,0,size,0);g.addColorStop(0,'#ffffff10');g.addColorStop(.5,'#63452e08');g.addColorStop(1,'#fff4d010');ctx.fillStyle=g;ctx.fillRect(0,0,size,size);
  for(let i=0;i<100;i++){const x=random()*size;ctx.strokeStyle=i%3?'#6144240b':'#fff3d514';ctx.lineWidth=.4+random()*.6;ctx.beginPath();ctx.moveTo(x,0);for(let y=0;y<=size;y+=16)ctx.lineTo(x+Math.sin(y*.016+i)*3,y);ctx.stroke();}
 }else if(kind==='parquet'){
  ctx.fillStyle='#b58a5d';ctx.fillRect(0,0,size,size);ctx.save();ctx.translate(size/2,size/2);ctx.rotate(Math.PI/4);
  const w=25,L=4,h=w*L;
  for(let row=-55;row<55;row++)for(let col=-12;col<12;col++){
   const x=(col*2*L-row)*w,y=row*w;
   for(const vertical of [false,true]){
    ctx.save();ctx.translate(x,y);if(vertical){ctx.translate(h,0);ctx.rotate(Math.PI/2);ctx.translate(0,-w);}
    const l=61+random()*5;ctx.fillStyle='hsl(33 34% '+l+'%)';ctx.fillRect(.45,.45,h-.9,w-.9);
    ctx.strokeStyle='#fff4dd20';ctx.lineWidth=.45;ctx.strokeRect(1.2,1.2,h-2.4,w-2.4);
    for(let i=0;i<4;i++){ctx.strokeStyle=i%2?'#704b2a0a':'#fff3d316';ctx.beginPath();const gy=3+random()*(w-6);ctx.moveTo(3,gy);ctx.bezierCurveTo(h*.3,gy+1,h*.7,gy-1,h-3,gy);ctx.stroke();}
    ctx.restore();
   }
  }ctx.restore();
 }else if(kind==='wall'){
  // Tiny botanical sprigs and paper grain remain quiet behind the furniture.
  ctx.fillStyle='#fff9e2a8';ctx.fillRect(0,0,size,size);
  for(let row=0;row<9;row++)for(let col=0;col<20;col++){const x=col*55+(row%2?27:0),y=row*122+25;ctx.strokeStyle='#879d803d';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x,y+19);ctx.quadraticCurveTo(x-7,y,x+1,y-18);ctx.stroke();for(const side of [-1,1]){ctx.fillStyle='#92a88b40';ctx.beginPath();ctx.ellipse(x+side*6,y+side*6,6,2.8,side*.6,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#cf9da642';ctx.beginPath();ctx.arc(x+1,y-19,3,0,Math.PI*2);ctx.fill();}
 }else if(kind==='rug'){
  ctx.fillStyle='#fff1d8';ctx.strokeStyle='#fff1d8';ctx.lineWidth=12;ctx.strokeRect(22,22,size-44,size-44);ctx.lineWidth=2;ctx.strokeRect(39,39,size-78,size-78);
  for(let row=0;row<5;row++)for(let col=0;col<6;col++)flower(68+col*76+(row%2?12:0),72+row*88,12);
 }else if(kind==='quilt'){
  for(let y=0;y<size;y+=85)for(let x=0;x<size;x+=85){ctx.fillStyle=(x/85+y/85)%2?'#fff4e720':'#69517e08';ctx.fillRect(x,y,85,85);ctx.strokeStyle='#fff7e36b';ctx.lineWidth=1;ctx.strokeRect(x+3,y+3,79,79);flower(x+42,y+42,9);}
 }else if(kind==='garden'){
  const g=ctx.createLinearGradient(0,0,0,size);g.addColorStop(0,'#96c9d2');g.addColorStop(.62,'#e6eed8');g.addColorStop(1,'#809e6e');ctx.fillStyle=g;ctx.fillRect(0,0,size,size);
  ctx.fillStyle='#fff9dc';ctx.beginPath();ctx.arc(372,83,34,0,Math.PI*2);ctx.fill();
  for(let i=0;i<9;i++){const x=i*75-50,y=320+Math.sin(i)*30;ctx.fillStyle=i%2?'#759b77':'#91ae7c';ctx.beginPath();ctx.ellipse(x,y,90,94,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#6b8561';ctx.fillRect(x-3,y+10,6,170);}
  ctx.fillStyle='#d3dfb5';ctx.beginPath();ctx.ellipse(256,512,400,135,0,0,Math.PI*2);ctx.fill();
 }else if(kind==='mirror'){
  const g=ctx.createLinearGradient(0,0,size,size);g.addColorStop(0,'#8fa6a4');g.addColorStop(.45,'#cdd8d0');g.addColorStop(.46,'#e7e7d9');g.addColorStop(1,'#a7bab4');ctx.fillStyle=g;ctx.fillRect(0,0,size,size);ctx.fillStyle='#ffffff50';ctx.save();ctx.rotate(-.4);ctx.fillRect(40,0,28,800);ctx.fillRect(88,0,7,800);ctx.restore();
 }
 if(['cloth','quilt','rug'].includes(kind)){for(let i=0;i<18000;i++){ctx.fillStyle=i%2?'#ffffff0d':'#44382c08';ctx.fillRect(random()*size,random()*size,1,2);}ctx.strokeStyle='#fff9ee16';ctx.lineWidth=.5;for(let y=0;y<size;y+=3){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(size,y);ctx.stroke();}}
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;textures.push(texture);return texture;
}
