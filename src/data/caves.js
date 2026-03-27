import { T, TL, RO } from '../constants.js';
import { mr } from '../utils/map-helpers.js';

// Hidden caves — overworld entrances that lead to small treasure rooms
export const CAVES=[
  {s:"1,0",t:[[3,2]],room:{tiles:mr(m=>{m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[5][7]=T.HEART_PIECE;m[3][6]=T.TORCH;m[3][9]=T.TORCH;m[7][6]=T.TORCH;m[7][9]=T.TORCH;m[4][5]=T.RUPEE;m[4][10]=T.RUPEE;m[6][5]=T.RUPEE;m[6][10]=T.RUPEE;}),enemies:[]}},
  {s:"3,0",t:[[10,4]],room:{tiles:mr(m=>{m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[5][7]=T.KEY;m[5][8]=T.HEART;m[6][7]=T.BOMB;m[6][8]=T.BOMB;m[3][7]=T.TORCH;m[8][7]=T.TORCH;}),enemies:[]}},
  {s:"0,2",t:[[8,8]],room:{tiles:mr(m=>{m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[4][7]=T.HEART;m[5][7]=T.HEART;m[5][8]=T.HEART;m[6][7]=T.BOMB;m[6][8]=T.BOMB;m[6][9]=T.BOMB;m[2][5]=T.TORCH;m[2][10]=T.TORCH;m[9][5]=T.TORCH;m[9][10]=T.TORCH;}),enemies:[]}},
  {s:"1,2",t:[[3,9]],room:{tiles:mr(m=>{m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[5][6]=T.KEY;m[5][7]=T.KEY;m[5][8]=T.HEART;m[5][9]=T.HEART;m[4][7]=T.TORCH;m[7][7]=T.TORCH;}),enemies:[]}},
  {s:"-1,-1",t:[[4,5]],room:{tiles:mr(m=>{m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[5][6]=T.HEART;m[5][7]=T.HEART;m[5][8]=T.BOMB;m[5][9]=T.BOMB;m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[7][5]=T.TORCH;m[7][10]=T.TORCH;}),enemies:[]}},
  {s:"4,-1",t:[[4,8]],room:{tiles:mr(m=>{m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[5][7]=T.BANANA;m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[7][5]=T.TORCH;m[7][10]=T.TORCH;m[4][7]=T.RUPEE;m[6][7]=T.RUPEE;m[4][8]=T.RUPEE;m[6][8]=T.RUPEE;}),enemies:[{x:5*32,y:4*32,hp:6,type:"yeti"},{x:10*32,y:6*32,hp:6,type:"yeti"}]}},
  {s:"2,0",t:[[12,8]],shop:true,room:{tiles:mr(m=>{m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[2][5]=T.TORCH;m[2][10]=T.TORCH;m[8][5]=T.TORCH;m[8][10]=T.TORCH;}),enemies:[]}},
  {s:"4,0",t:[[5,8]],room:{tiles:mr(m=>{m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[5][7]=T.JAR;m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[7][5]=T.TORCH;m[7][10]=T.TORCH;m[4][7]=T.RUPEE;m[6][7]=T.RUPEE;m[4][8]=T.RUPEE;m[6][8]=T.RUPEE;}),enemies:[]}},
  {s:"-1,1",t:[[12,7]],room:{tiles:mr(m=>{m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[5][7]=T.HEART_PIECE;m[3][6]=T.TORCH;m[3][9]=T.TORCH;m[7][6]=T.TORCH;m[7][9]=T.TORCH;m[4][6]=T.RUPEE;m[4][9]=T.RUPEE;m[6][6]=T.RUPEE;m[6][9]=T.RUPEE;}),enemies:[]}},
  {s:"2,1",t:[[2,9]],room:{tiles:mr(m=>{m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[4][7]=T.BOMB;m[4][8]=T.BOMB;m[5][7]=T.HEART;m[5][8]=T.HEART;m[6][7]=T.RUPEE;m[6][8]=T.RUPEE;m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[8][5]=T.TORCH;m[8][10]=T.TORCH;}),enemies:[]}},
];
