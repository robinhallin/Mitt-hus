// One coordinate system for Sigge's illustration, care overlays and touch input.
export const DOG_SPRITE='./assets/characters/sigge.webp';
export const DOG_VIEW={w:1024,h:1024,aspect:1};
export const DOG_ZONES=[
 {id:'head',name:'Huvudet',x:.43,y:.055,rx:.13,ry:.045},
 {id:'chest',name:'Bröstet',x:.43,y:.58,rx:.18,ry:.17},
 {id:'left',name:'Vänster tass',x:.30,y:.93,rx:.075,ry:.055},
 {id:'right',name:'Höger tass',x:.47,y:.95,rx:.075,ry:.045},
 {id:'tail',name:'Svansen',x:.82,y:.82,rx:.12,ry:.09},
];
export const DOG_MOUTH={x:.40,y:.28,rx:.09,ry:.065};
export const dogImage=(attributes='')=>`<image href="${DOG_SPRITE}" width="${DOG_VIEW.w}" height="${DOG_VIEW.h}" ${attributes}/>`;
export const dogSilhouette=prefix=>`<mask id="${prefix}-silhouette" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024">${dogImage()}</mask>`;
