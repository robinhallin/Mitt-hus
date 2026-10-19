import * as T from '../assets/vendor/room-three.js';

// Small, seeded textures stay offline and are shared by every matching material.
export function roomTexture(kind,color,textures){
 const canvas=globalThis.document?.createElement?.('canvas');
 const ctx=canvas?.getContext?.('2d');if(!ctx)return null;
 canvas.width=canvas.height=256;ctx.fillStyle=color;ctx.fillRect(0,0,256,256);
 let seed=813;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 if(kind==='wood'){
  for(let i=0;i<310;i++){const x=random()*256;ctx.strokeStyle=i%3?'#59371613':'#fff6d823';ctx.lineWidth=.3+random()*1.3;ctx.beginPath();ctx.moveTo(x,0);for(let y=0;y<=256;y+=8)ctx.lineTo(x+Math.sin(y*.025+i)*2,y);ctx.stroke();}
 }else if(kind==='wall'){
  for(let x=12;x<256;x+=32){ctx.fillStyle='#ffffff10';ctx.fillRect(x,0,9,256);ctx.fillStyle='#5a514b08';ctx.fillRect(x+10,0,1,256);}
  for(let y=16;y<256;y+=32)for(let x=16;x<256;x+=32){ctx.fillStyle='#ffffff35';ctx.beginPath();ctx.ellipse(x,y,2,4,0,0,Math.PI*2);ctx.fill();}
 }else{
  for(let i=0;i<14000;i++){ctx.fillStyle=i%2?'#ffffff20':'#493e3015';ctx.fillRect(random()*256,random()*256,kind==='cloth'?1:1.5,kind==='cloth'?2:1);}
  if(kind==='cloth'){ctx.fillStyle='#fff5e411';for(let y=0;y<256;y+=4)ctx.fillRect(0,y,256,1);}
 }
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;textures.push(texture);return texture;
}
