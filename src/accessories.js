export const ACCESSORY_ATLAS='./assets/characters/accessories.webp';
export const ACCESSORIES={
  sunhat:{label:'Solhatt',emoji:'👒',cell:0},crown:{label:'Prinsesskrona',emoji:'👑',cell:1},
  flowers:{label:'Blomsterband',emoji:'🌼',cell:2},unicorn:{label:'Enhörning',emoji:'🦄',cell:3},
  bow:{label:'Rosett',emoji:'🎀',cell:4},butterfly:{label:'Fjäril',emoji:'🦋',cell:5},starclip:{label:'Stjärnspänne',emoji:'⭐',cell:6},cat:{label:'Kattöron',emoji:'🐱',cell:7},
  round:{label:'Runda glasögon',emoji:'👓',cell:8},hearts:{label:'Solglasögon',emoji:'🕶️',cell:9},
  pearls:{label:'Pärlhalsband',emoji:'🦪',cell:10},star:{label:'Stjärnhalsband',emoji:'🌟',cell:11},
  heartbag:{label:'Hjärtväska',emoji:'💗',cell:12},flowerbag:{label:'Blomväska',emoji:'🌸',cell:13},
  bandana:{label:'Halsduk',emoji:'🧣',cell:14},bowtie:{label:'Fluga',emoji:'🎀',cell:15}
};
export const ACCESSORY_SLOTS={
 headwear:['none','sunhat','crown','flowers','unicorn','cat'],
 hairclip:['none','bow','butterfly','starclip'],eyewear:['none','round','hearts'],
 necklace:['none','pearls','star'],bag:['none','heartbag','flowerbag']
};
// Tight source bounds are populated from the atlas's alpha; all placements use artwork units.
export const ATLAS_SIZE=1254;
export const ACCESSORY_BOXES={"sunhat": [9, 101, 340, 228], "crown": [364, 95, 247, 155], "flowers": [652, 76, 261, 214], "unicorn": [970, 27, 266, 280], "bow": [37, 378, 265, 234], "butterfly": [365, 392, 252, 187], "starclip": [678, 413, 225, 144], "cat": [954, 360, 286, 242], "round": [16, 712, 306, 121], "hearts": [337, 714, 297, 118], "pearls": [663, 686, 254, 165], "star": [976, 648, 240, 221], "heartbag": [37, 876, 281, 327], "flowerbag": [373, 894, 227, 309], "bandana": [655, 930, 267, 279], "bowtie": [947, 1010, 287, 138]};
export function accessoryPicture(id,attributes=''){
 const item=Object.hasOwn(ACCESSORIES,id)?ACCESSORIES[id]:null;if(!item)return '';
 if(id==='round')return `<svg class="accessory-picture" viewBox="44 134 1686 611" overflow="hidden" ${attributes} xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><image href="./assets/characters/round-glasses.webp" width="1774" height="887"/></svg>`;
 const cell=ATLAS_SIZE/4,b=ACCESSORY_BOXES[id]||[(item.cell%4)*cell,Math.floor(item.cell/4)*cell,cell,cell];
 return `<svg class="accessory-picture" viewBox="${b.join(' ')}" overflow="hidden" ${attributes} xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><image href="${ACCESSORY_ATLAS}" width="${ATLAS_SIZE}" height="${ATLAS_SIZE}"/></svg>`;
}
function placed(id,x,y,w,h,angle=0){return `<g data-accessory="${id}" transform="translate(${x} ${y}) rotate(${angle})">${accessoryPicture(id,`x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" style="width:${w}px;height:${h}px;overflow:hidden" preserveAspectRatio="none"`)}</g>`;}
export function leaAccessories(c,{layer='all'}={}){let out='';
 const head={sunhat:[532,60,460,309,0],crown:[545,20,310,190,11],flowers:[545,120,370,300,11],unicorn:[545,30,370,360,11],cat:[545,85,370,310,11]}[c.headwear];
 if(head&&layer!=='body')out+=placed(c.headwear,...head);
 const clip=c.hairclip||(c.bow?'bow':'none');
 if(clip!=='none'&&layer!=='body'){
   if(c.headwear==='sunhat')out+=placed(clip,685,330,60,50,12);
   else if(c.hairstyle==='pigtails')out+=placed(clip,394,165,65,52,-15)+placed(clip,660,215,65,52,15);
   else if(c.hairstyle==='ponytail')out+=placed(clip,605,54,78,62,15);
   else out+=placed(clip,654,154,82,64,15);
 }
 if(layer!=='body'&&c.eyewear!=='none'&&c.eyewear)out+=c.eyewear==='round'?placed('round',536,214,220,80,10.5):placed(c.eyewear,529,219,210,83,10.5);
 if(layer!=='head'&&c.necklace!=='none'&&c.necklace)out+=placed(c.necklace,511,428,162,122,6);
 if(layer!=='head'&&c.bag!=='none'&&c.bag)out+=placed(c.bag,c.bag==='heartbag'?530:744,c.bag==='heartbag'?660:1000,c.bag==='heartbag'?330:150,c.bag==='heartbag'?375:190,0);
 return out;
}
export function dogAccessories(c){return c.accessory==='bandana'?placed('bandana',425,512,300,300,0):c.accessory==='bowtie'?placed('bowtie',432,430,220,108,0):'';}
export function chooseAccessory(s,slot,id){if(!Array.isArray(ACCESSORY_SLOTS[slot])||!ACCESSORY_SLOTS[slot].includes(id))return false;s.lea[slot]=id;if(slot==='hairclip')s.lea.bow=id==='bow';return true;}
