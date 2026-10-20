import * as T from '../assets/vendor/room-three.js';

export function sculptHair({head,color,style,mesh,sphere,geo}){
 const points=[],uv=[],indices=[],nx=64,ny=22;
 for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
  const p=i/nx*Math.PI*2,front=Math.cos(p),edge=1.23+(1-front)*.66,t=j/ny*edge;
  const wave=Math.sin(p*9+t*2)*.002;
  points.push(Math.sin(t)*Math.sin(p)*(.267+wave),Math.cos(t)*.314+.043,Math.sin(t)*Math.cos(p)*(.275+wave)-.015);uv.push(i/nx,j/ny);
 }
 for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i;indices.push(a,a+1,a+nx+1,a+1,a+nx+2,a+nx+1);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();mesh(head,g,color,0,0,0,null,{side:T.DoubleSide});
 const lock=(path,radius,tint=color)=>{
  const pos=[],ix=[],n=28,sides=10;
  const at=t=>{const q=1-t;return new T.Vector3(...path[0]).multiplyScalar(q*q*q).addScaledVector(new T.Vector3(...path[1]),3*q*q*t).addScaledVector(new T.Vector3(...path[2]),3*q*t*t).addScaledVector(new T.Vector3(...path[3]),t*t*t);};
  for(let j=0;j<=n;j++){const t=j/n,p=at(t),a=at(Math.max(0,t-.003)),b=at(Math.min(1,t+.003)),dir=b.sub(a).normalize(),u=new T.Vector3(0,0,1).cross(dir).normalize(),v=dir.clone().cross(u).normalize(),r=radius*(.65+Math.sin(t*Math.PI)*.35)*(1-t*.86);for(let k=0;k<=sides;k++){const angle=k/sides*Math.PI*2,pt=p.clone().addScaledVector(u,Math.cos(angle)*r).addScaledVector(v,Math.sin(angle)*r);pos.push(pt.x,pt.y,pt.z);}}
  for(let j=0;j<n;j++)for(let k=0;k<sides;k++){const a=j*(sides+1)+k;ix.push(a,a+1,a+sides+1,a+1,a+sides+2,a+sides+1);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(ix);g.computeVertexNormals();return mesh(head,g,tint,0,0,0,null,{side:T.DoubleSide});
 };
 // A sweeping fringe follows the forehead rather than a row of separate blobs.
 lock([[.12,.29,.11],[.03,.3,.25],[-.13,.21,.27],[-.23,.055,.15]],.05);
 lock([[.15,.28,.1],[.2,.24,.2],[.23,.16,.19],[.23,.03,.11]],.042);
 for(const side of [-1,1]){
  if(style==='loose')for(let i=0;i<4;i++)lock([[side*(.22+i*.01),.14,-.04],[side*(.28+i*.009),-.06,-.07],[side*(.29+i*.006),-.25,-.08],[side*(.22+i*.009),-.39,-.025]],.048);
  if(style==='pigtails'){sphere(head,'#c48a9d',side*.27,.04,-.08,.045);for(let i=0;i<3;i++)lock([[side*.28,.05,-.09],[side*(.4+i*.018),.03,-.12],[side*(.34+i*.02),-.22,-.1],[side*(.38-i*.014),-.31,.015]],.047);}
 }
 if(style==='ponytail')for(let i=0;i<4;i++)lock([[.02+i*.015,.13,-.27],[.2,.05,-.36],[.13,-.16,-.36],[.12+i*.014,-.32,-.2]],.058);
 return {lock};
}
