import * as T from '../assets/vendor/room-three.js';
export function decorateRoom({state,content,group,box,sphere,rod,mesh,geo,textures,animated}){
 const cream='#fff5e3',gold='#d6ae72';
 // A stitched name plaque, paper bunting and a real wire of little lights.
 const sign=group(content,-2.55,2.68,-3.12);box(sign,1.12,.48,.055,'#f7e8cf',0,0,0,.12);
 for(const [a,b] of [[[-.35,.13,.04],[-.35,-.13,.04]],[[-.35,-.13,.04],[-.18,-.13,.04]],[[-.06,.13,.04],[-.06,-.13,.04]],[[-.06,.13,.04],[.1,.13,.04]],[[-.06,0,.04],[.07,0,.04]],[[-.06,-.13,.04],[.1,-.13,.04]],[[.2,-.13,.04],[.3,.13,.04]],[[.3,.13,.04],[.4,-.13,.04]],[[.24,-.03,.04],[.36,-.03,.04]]])rod(sign,a,b,.018,'#b3829c');
 const star=group(content);const v=[],ix=[];for(let i=0;i<10;i++){const a=i*Math.PI/5,r=i%2?.1:.21;v.push(Math.sin(a)*r,Math.cos(a)*r,0);}for(let i=1;i<9;i++)ix.push(0,i,i+1);const sg=new T.BufferGeometry();sg.setAttribute('position',new T.Float32BufferAttribute(v,3));sg.setIndex(ix);sg.computeVertexNormals();mesh(star,sg,'#f0c56e',0,0,0,null,{side:T.DoubleSide});sphere(star,'#fff0c9',-.06,.07,.015,.025);star.visible=false;animated.treasure=star;
 const lights=[];for(let i=0;i<12;i++){const x=-3.2+i*.58,y=3.04-Math.sin(i/11*Math.PI)*.13;if(i<11)rod(content,[x,y,-3.11],[x+.58,3.04-Math.sin((i+1)/11*Math.PI)*.13,-3.11],.009,'#b8a391');const lamp=sphere(content,cream,x,y-.045,-3.08,.038,.06,.038);lamp.material=lamp.material.clone();lamp.userData.noBatch=true;lights.push(lamp);}animated.stringLights=lights;
 for(let i=0;i<7;i++){const x=-3.52,z=-2+i*.64,y=2.97-Math.sin(i/6*Math.PI)*.22;if(i<6)rod(content,[x,y,z],[x,2.97-Math.sin((i+1)/6*Math.PI)*.22,z+.64],.008,'#b6a08a');const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute([0,0,-.16,0,0,.16,0,-.29,0],3));g.computeVertexNormals();mesh(content,g,['#d3a4bc','#b5c7b0','#dfc38e','#ada9cc'][i%4],x+.025,y,z,null,{side:T.DoubleSide});}
 // Bedside book, a woven basket, little slippers and a vase, all spatial models.
 box(content,.42,.055,.31,'#91afa9',1.08,.02,-.55,.02);box(content,.37,.028,.28,cream,1.08,.06,-.55,.01);box(content,.05,.015,.3,gold,1.12,.08,-.55,.005);
 const basket=group(content,-2.8,0,1.95);box(basket,.54,.38,.45,'#cba985',0,.2,0,.07);for(let i=0;i<5;i++)box(basket,.56,.018,.46,'#e1c29a',0,.06+i*.07,0,.007);for(const x of [-.23,.23])rod(basket,[x,.34,0],[x,.55,0],.02,'#b98e67');rod(basket,[-.23,.55,0],[.23,.55,0],.02,'#b98e67');sphere(basket,'#f1e5d1',0,.43,.01,.18,.13,.14);
 for(const x of [1.1,1.35]){box(content,.15,.065,.3,'#d6abc1',x,.04,.65,.03);sphere(content,cream,x,.095,.72,.05,.025,.04);}
 const butterfly=group(content,0,1.4,-2.3),wings=[];for(const side of [-1,1]){const wing=group(butterfly);sphere(wing,'#d2b4d8',side*.11,.04,0,.13,.1,.025);sphere(wing,'#efc1c9',side*.09,-.07,0,.1,.075,.025);wings.push(wing);}sphere(butterfly,'#b18d7f',0,0,.01,.023,.1,.025);butterfly.visible=false;animated.butterfly={root:butterfly,wings};
 if(globalThis.document?.createElement){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;const ctx=canvas.getContext?.('2d');if(ctx){for(const stroke of state.room.drawing){ctx.strokeStyle=['#d786a3','#ad9cc6','#91b5aa','#e8bd75','#9db5d4','#dfad91'][stroke.color]||'#bd9ab7';ctx.globalCompositeOperation=stroke.eraser?'destination-out':'source-over';ctx.lineWidth=stroke.eraser?32:7;ctx.lineCap='round';ctx.beginPath();stroke.points.forEach((p,i)=>i?ctx.lineTo(p.x*1024,p.y*512):ctx.moveTo(p.x*1024,p.y*512));ctx.stroke();}ctx.globalCompositeOperation='source-over';const icons={flower:'🌸',star:'⭐',heart:'💗',paw:'🐾',moon:'🌙',rainbow:'🌈',butterfly:'🦋',sun:'☀️',leaf:'🍃',music:'🎵',sparkles:'✨',cherry:'🍒'};ctx.font='48px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';for(const p of state.room.stickers)ctx.fillText(icons[p.icon]||'🌸',p.x/100*1024,p.y/100*512);const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;textures.push(texture);const material=new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false});const wall=new T.Mesh(geo('PlaneGeometry',[7.1,3.1]),material);wall.position.set(0,1.65,-3.16);content.add(wall);}}
}
export function detailLea({state,root,head,torso,arms,legs,hair,skin,group,box,sphere,rod,ring,cylinder}){
 const eyes=[],hairParts=[];
 // Embroidered collar, stitching, sock cuffs and tiny shoe bows.
 for(const side of [-1,1]){const collar=sphere(root,'#fff4e7',side*.085,1.19,.14,.09,.042,.024);collar.rotation.z=side*-.3;box(root,.012,.35,.012,'#e4b9bf',side*.14,.97,.142,.005);sphere(root,'#e6bd83',side*.1,1.12,.155,.018);const sock=cylinder(legs[side===-1?0:1],'#fff3e7',.071,.071,.08,0,-.22,0);for(const a of [-1,1])sphere(legs[side===-1?0:1],'#c18da8',a*.035,-.27,.12,.035,.018,.016);}
 for(let i=0;i<3;i++)sphere(root,'#fff0de',0,1.07-i*.075,.153,.014);
 // Real cloth patterns wrap around the garment instead of floating in front.
 const pattern=state.lea.pattern,cloth=group(root);if(pattern!=='plain'){for(let row=0;row<3;row++)for(let i=0;i<7;i++){const angle=(i-3)*.38,y=.88+row*.085,x=Math.sin(angle)*.219,z=Math.cos(angle)*.148;if(pattern==='stripes'){if(row===0)for(let j=0;j<3;j++){const line=ring(root,.22,.018,'#fff1e0',0,.91+j*.085,0);line.rotation.x=Math.PI/2;line.scale.y=.69;}}else if(pattern==='hearts'){for(const side of [-1,1])sphere(cloth,'#f5dce2',x+side*.012,y,z,.016,.018,.008);}else if(pattern==='stars'){const star=sphere(cloth,'#ffe7ad',x,y,z,.017,.027,.008);star.rotation.z=.6;}else sphere(cloth,'#fff0df',x,y,z,.018,.019,.008);if(pattern==='stripes')break;}}
 // Fine hair locks, warm ears, freckles, lashes and eyelids make the small face readable.
 for(let i=0;i<5;i++){const a=(i-2)*.23;const lock=sphere(head,hair,Math.sin(a)*.23,.3,.02+Math.cos(a)*.04,.008,.018,.008);lock.rotation.z=-a*.7;hairParts.push(lock);}
 for(const side of [-1,1]){sphere(head,'#dba99d',side*.25,-.03,.025,.02,.035,.013);for(let i=0;i<3;i++)sphere(head,'#c99b86',side*(.12+i*.018),-.061-i%2*.012,.244,.0035,.0035,.003);for(let i=0;i<2;i++)rod(head,[side*(.12+i*.012),.063,.258],[side*(.132+i*.013),.079,.255],.005,'#745d51');const lid=sphere(head,skin,side*.09,.026,.274,.051,.054,.014);lid.visible=false;eyes.push(lid);}
 return {eyes,hairParts,torso};
}

export function animateLea(lea,time,dt,{walking=false,pose='idle',look=0}={}){
 const dance=pose==='dance',wave=pose==='wave',jump=pose==='jump';
 lea.root.position.y=walking?Math.abs(Math.sin(time*10))*.025:jump?Math.abs(Math.sin(time*5))*.22:dance?Math.abs(Math.sin(time*5))*.055:0;
 lea.root.rotation.z=dance?Math.sin(time*4)*.075:0;
 lea.legs.forEach((leg,i)=>{leg.rotation.x=walking?Math.sin(time*10+i*Math.PI)*.36:dance?Math.sin(time*5+i*Math.PI)*.2:0;leg.rotation.z=jump?(i?-.12:.12):0;});
 lea.arms.forEach((arm,i)=>{arm.rotation.x=walking?Math.sin(time*10+i*Math.PI)*.3:dance?Math.sin(time*4+i)*.45:wave&&i===1?-.35:0;arm.rotation.z=dance?(i===0?.65:-.65)+Math.sin(time*5+i)*.2:wave&&i===1?-2.2+Math.sin(time*10)*.25:(i===0?-.16:.16);});
 lea.head.rotation.z=wave?Math.sin(time*3)*.05:dance?Math.sin(time*4)*.09:Math.sin(time*.8)*.026;
 lea.head.rotation.y+=(Math.max(-.45,Math.min(.45,look))-lea.head.rotation.y)*Math.min(1,dt*4);
 lea.eyes?.forEach(e=>e.visible=time%4.6<.13);lea.torso.scale.y=.26*(1+Math.sin(time*2)*.012);
 lea.hairParts?.forEach((p,i)=>p.rotation.x=Math.sin(time*(walking?10:2)+i*.3)*(walking?.06:.012));
}
