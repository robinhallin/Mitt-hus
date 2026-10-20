// Artwork coordinates stay fixed when the mirror or tablet changes size.
export const LEA_FACE_FRAME = {x:308, y:84, w:418, h:363};
export const MAKEUP_VIEW = {x:180, y:-220, w:660, h:930};
export const PORTRAIT_ASPECT = MAKEUP_VIEW.w / MAKEUP_VIEW.h;
export function portraitToFace(p) {
  return {x:(MAKEUP_VIEW.x+p.x*MAKEUP_VIEW.w-LEA_FACE_FRAME.x)/LEA_FACE_FRAME.w,
    y:(MAKEUP_VIEW.y+p.y*MAKEUP_VIEW.h-LEA_FACE_FRAME.y)/LEA_FACE_FRAME.h};
}
export function faceToPortrait(p) {
  return {x:(LEA_FACE_FRAME.x+p.x*LEA_FACE_FRAME.w-MAKEUP_VIEW.x)/MAKEUP_VIEW.w,
    y:(LEA_FACE_FRAME.y+p.y*LEA_FACE_FRAME.h-MAKEUP_VIEW.y)/MAKEUP_VIEW.h};
}
