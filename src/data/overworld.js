import { T, TL, CO, RO } from '../constants.js';
import { oe } from '../utils/map-helpers.js';

// Overworld enemy definitions per screen
export const OW_EN={
  // Inner ring (hub area)
  "1,1":[],
  "0,0":[{x:3*TL,y:3*TL,hp:2,type:"skeleton"},{x:10*TL,y:8*TL,hp:2,type:"bat"}],
  "1,0":[{x:4*TL,y:6*TL,hp:1,type:"bat"},{x:11*TL,y:4*TL,hp:1,type:"bat"}],
  "2,0":[{x:5*TL,y:4*TL,hp:2,type:"skeleton"},{x:10*TL,y:8*TL,hp:2,type:"skeleton"}],
  "0,1":[{x:4*TL,y:4*TL,hp:2,type:"bat"},{x:11*TL,y:7*TL,hp:2,type:"skeleton"}],
  "2,1":[{x:3*TL,y:5*TL,hp:1,type:"bat"},{x:12*TL,y:7*TL,hp:1,type:"bat"}],
  "1,2":[{x:6*TL,y:4*TL,hp:1,type:"bat"},{x:9*TL,y:8*TL,hp:1,type:"bat"}],
  // Middle ring
  "3,0":[{x:6*TL,y:5*TL,hp:3,type:"skeleton"},{x:10*TL,y:7*TL,hp:2,type:"bat"}],
  "3,1":[{x:5*TL,y:4*TL,hp:3,type:"ghost"},{x:10*TL,y:7*TL,hp:3,type:"ghost"},{x:8*TL,y:5*TL,hp:4,type:"knight"}],
  "0,2":[{x:4*TL,y:5*TL,hp:2,type:"skeleton"},{x:11*TL,y:6*TL,hp:3,type:"skeleton"}],
  "2,2":[{x:5*TL,y:5*TL,hp:2,type:"bat"},{x:10*TL,y:7*TL,hp:2,type:"skeleton"}],
  "0,-1":[{x:5*TL,y:5*TL,hp:2,type:"skeleton"},{x:10*TL,y:7*TL,hp:2,type:"bat"}],
  "1,-1":[{x:4*TL,y:4*TL,hp:2,type:"bat"},{x:11*TL,y:8*TL,hp:3,type:"skeleton"}],
  // Outer ring
  "-1,0":[{x:4*TL,y:5*TL,hp:3,type:"ghost"},{x:10*TL,y:7*TL,hp:3,type:"archer"},{x:7*TL,y:3*TL,hp:2,type:"bat"}],
  "-1,1":[{x:5*TL,y:4*TL,hp:3,type:"ghost"},{x:10*TL,y:8*TL,hp:3,type:"ghost"}],
  "-1,-1":[{x:6*TL,y:5*TL,hp:3,type:"ghost"},{x:9*TL,y:8*TL,hp:4,type:"skeleton"}],
  "2,-1":[{x:5*TL,y:4*TL,hp:3,type:"skeleton"},{x:10*TL,y:7*TL,hp:3,type:"fire_bat"},{x:7*TL,y:5*TL,hp:2,type:"archer"}],
  "3,-1":[{x:4*TL,y:5*TL,hp:3,type:"fire_bat"},{x:11*TL,y:7*TL,hp:3,type:"ghost"}],
  "4,-1":[{x:5*TL,y:4*TL,hp:4,type:"fire_bat"},{x:10*TL,y:8*TL,hp:4,type:"ghost"}],
  "4,0":[{x:5*TL,y:5*TL,hp:3,type:"fire_bat"},{x:10*TL,y:7*TL,hp:3,type:"mage"},{x:7*TL,y:9*TL,hp:3,type:"bat"}],
  "4,1":[{x:4*TL,y:4*TL,hp:3,type:"fire_bat"},{x:11*TL,y:8*TL,hp:4,type:"fire_bat"}],
  "-1,2":[{x:5*TL,y:4*TL,hp:4,type:"knight"},{x:10*TL,y:7*TL,hp:4,type:"mage"},{x:7*TL,y:9*TL,hp:3,type:"fire_bat"}],
  "3,2":[{x:5*TL,y:5*TL,hp:3,type:"fire_bat"},{x:10*TL,y:6*TL,hp:3,type:"fire_bat"},{x:7*TL,y:8*TL,hp:3,type:"skeleton"}],
  "4,2":[{x:4*TL,y:4*TL,hp:4,type:"fire_bat"},{x:11*TL,y:7*TL,hp:5,type:"knight"},{x:7*TL,y:9*TL,hp:4,type:"fire_bat"}],
  // Eastern frontier (x=5)
  "5,-1":[{x:5*TL,y:5*TL,hp:5,type:"yeti"},{x:10*TL,y:7*TL,hp:4,type:"ghost"},{x:8*TL,y:3*TL,hp:4,type:"skeleton"}],
  "5,0":[{x:6*TL,y:5*TL,hp:5,type:"yeti"},{x:9*TL,y:6*TL,hp:5,type:"yeti"},{x:4*TL,y:8*TL,hp:4,type:"ghost"}],
  "5,1":[{x:5*TL,y:3*TL,hp:5,type:"ghost"},{x:10*TL,y:8*TL,hp:6,type:"knight"},{x:7*TL,y:6*TL,hp:5,type:"yeti"}],
  "5,2":[{x:5*TL,y:5*TL,hp:5,type:"fire_bat"},{x:10*TL,y:7*TL,hp:5,type:"mage"},{x:7*TL,y:4*TL,hp:6,type:"knight"},{x:12*TL,y:9*TL,hp:4,type:"fire_bat"}],
  // Shadow Forest frontier (x=6)
  "6,-1":[{x:6*TL,y:5*TL,hp:4,type:"skeleton"},{x:10*TL,y:7*TL,hp:4,type:"knight"},{x:8*TL,y:3*TL,hp:3,type:"bat"}],
  "6,0":[{x:5*TL,y:4*TL,hp:5,type:"blob"},{x:9*TL,y:7*TL,hp:5,type:"shimmer_ghoul"},{x:7*TL,y:5*TL,hp:5,type:"blob"},{x:11*TL,y:4*TL,hp:4,type:"ghost"}],
  "6,1":[{x:5*TL,y:5*TL,hp:6,type:"shimmer_ghoul"},{x:10*TL,y:7*TL,hp:5,type:"blob"},{x:7*TL,y:3*TL,hp:5,type:"shimmer_ghoul"}],
  "6,2":[{x:4*TL,y:4*TL,hp:6,type:"blob"},{x:11*TL,y:8*TL,hp:6,type:"shimmer_ghoul"},{x:7*TL,y:9*TL,hp:5,type:"blob"},{x:9*TL,y:4*TL,hp:6,type:"shimmer_ghoul"}],
};

export const OW={

// ===== ROW y=-1 (Northern highlands) =====

// Deep forest northwest — HEART_PIECE hidden among dense trees
"-1,-1":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
  for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
  // Dense forest interior
  m[1][1]=T.TREE;m[1][2]=T.TREE;m[1][3]=T.TREE;m[1][4]=T.TREE;m[1][10]=T.TREE;m[1][11]=T.TREE;m[1][12]=T.TREE;m[1][13]=T.TREE;m[1][14]=T.TREE;
  m[2][1]=T.TREE;m[2][2]=T.TREE;m[2][3]=T.TREE;m[2][10]=T.TREE;m[2][11]=T.TREE;m[2][12]=T.TREE;m[2][13]=T.TREE;m[2][14]=T.TREE;
  m[3][1]=T.TREE;m[3][2]=T.TREE;m[3][10]=T.TREE;m[3][11]=T.TREE;m[3][12]=T.TREE;m[3][13]=T.TREE;
  m[4][1]=T.TREE;m[4][2]=T.TREE;m[4][10]=T.TREE;m[4][11]=T.TREE;m[4][12]=T.TREE;
  m[5][1]=T.TREE;m[5][2]=T.TREE;m[5][10]=T.TREE;m[5][11]=T.TREE;
  m[6][1]=T.TREE;m[6][2]=T.TREE;m[6][10]=T.TREE;m[6][11]=T.TREE;
  m[7][1]=T.TREE;m[7][2]=T.TREE;m[7][3]=T.TREE;m[7][10]=T.TREE;m[7][11]=T.TREE;m[7][12]=T.TREE;
  m[8][1]=T.TREE;m[8][2]=T.TREE;m[8][3]=T.TREE;m[8][4]=T.TREE;m[8][10]=T.TREE;m[8][11]=T.TREE;m[8][12]=T.TREE;m[8][13]=T.TREE;
  m[9][1]=T.TREE;m[9][2]=T.TREE;m[9][3]=T.TREE;m[9][11]=T.TREE;m[9][12]=T.TREE;m[9][13]=T.TREE;
  m[10][1]=T.TREE;m[10][2]=T.TREE;m[10][3]=T.TREE;m[10][4]=T.TREE;m[10][10]=T.TREE;m[10][11]=T.TREE;m[10][12]=T.TREE;m[10][13]=T.TREE;
  // Narrow winding path to heart piece
  m[3][4]=T.PATH;m[3][5]=T.PATH;m[4][5]=T.PATH;m[5][5]=T.PATH;m[5][6]=T.PATH;
  m[6][6]=T.PATH;m[6][7]=T.PATH;m[6][8]=T.PATH;m[5][8]=T.PATH;m[4][8]=T.PATH;m[4][9]=T.PATH;
  m[5][3]=T.TALLGRASS;m[6][3]=T.TALLGRASS;m[4][4]=T.TALLGRASS;
  // Cracked earth hides a cave with a heart piece
  m[5][4]=T.CRACK;
  m[7][7]=T.FLOWER;m[7][8]=T.FLOWER;m[3][7]=T.STUMP;
  oe(m,"E");oe(m,"S");return m;})(),

// Northern forest clearing
"0,-1":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
  for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
  m[1][1]=T.TREE;m[1][2]=T.TREE;m[1][13]=T.TREE;m[1][14]=T.TREE;
  m[2][1]=T.TREE;m[10][1]=T.TREE;m[10][14]=T.TREE;m[2][14]=T.TREE;
  // Forest clearing with stumps
  m[4][4]=T.STUMP;m[4][11]=T.STUMP;m[7][4]=T.STUMP;m[7][11]=T.STUMP;
  m[3][6]=T.TALLGRASS;m[3][7]=T.TALLGRASS;m[3][8]=T.TALLGRASS;m[3][9]=T.TALLGRASS;
  m[8][6]=T.TALLGRASS;m[8][7]=T.TALLGRASS;m[8][8]=T.TALLGRASS;m[8][9]=T.TALLGRASS;
  m[5][5]=T.FLOWER;m[5][6]=T.FLOWER;m[6][5]=T.FLOWER;m[6][6]=T.FLOWER;
  m[5][9]=T.BUSH;m[5][10]=T.BUSH;m[6][9]=T.BUSH;m[6][10]=T.BUSH;
  m[9][3]=T.TREE;m[9][12]=T.TREE;
  oe(m,"W");oe(m,"E");oe(m,"S");return m;})(),

// Mountain foothills
"1,-1":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
  for(let i=0;i<CO;i++){m[0][i]=T.ROCK;m[RO-1][i]=T.ROCK;}for(let i=0;i<RO;i++){m[i][0]=T.ROCK;m[i][CO-1]=T.ROCK;}
  // Rocky terrain mixed with grass
  m[1][1]=T.ROCK;m[1][2]=T.ROCK;m[1][3]=T.ROCK;m[1][13]=T.ROCK;m[1][14]=T.ROCK;
  m[2][1]=T.ROCK;m[2][2]=T.ROCK;m[10][1]=T.ROCK;m[10][13]=T.ROCK;m[10][14]=T.ROCK;
  m[3][3]=T.ROCK;m[3][4]=T.ROCK;m[8][3]=T.ROCK;m[8][12]=T.ROCK;
  // Central rocky path
  for(let c=5;c<=10;c++){m[5][c]=T.PATH;m[6][c]=T.PATH;}
  m[3][7]=T.ROCK;m[3][8]=T.ROCK;m[8][7]=T.ROCK;m[8][8]=T.ROCK;
  m[4][5]=T.TALLGRASS;m[4][10]=T.TALLGRASS;m[7][5]=T.TALLGRASS;m[7][10]=T.TALLGRASS;
  m[2][7]=T.BUSH;m[9][7]=T.BUSH;m[9][8]=T.BUSH;
  oe(m,"W");oe(m,"E");oe(m,"S");return m;})(),

// Mountain peak — HEART_PIECE surrounded by rocks
"2,-1":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
  for(let i=0;i<CO;i++){m[0][i]=T.ROCK;m[RO-1][i]=T.ROCK;}for(let i=0;i<RO;i++){m[i][0]=T.ROCK;m[i][CO-1]=T.ROCK;}
  // Heavy rock coverage
  m[1][1]=T.ROCK;m[1][2]=T.ROCK;m[1][3]=T.ROCK;m[1][4]=T.ROCK;m[1][11]=T.ROCK;m[1][12]=T.ROCK;m[1][13]=T.ROCK;m[1][14]=T.ROCK;
  m[2][1]=T.ROCK;m[2][2]=T.ROCK;m[2][3]=T.ROCK;m[2][12]=T.ROCK;m[2][13]=T.ROCK;m[2][14]=T.ROCK;
  m[3][1]=T.ROCK;m[3][2]=T.ROCK;m[3][13]=T.ROCK;m[3][14]=T.ROCK;
  m[9][1]=T.ROCK;m[9][2]=T.ROCK;m[9][13]=T.ROCK;m[9][14]=T.ROCK;
  m[10][1]=T.ROCK;m[10][2]=T.ROCK;m[10][3]=T.ROCK;m[10][12]=T.ROCK;m[10][13]=T.ROCK;m[10][14]=T.ROCK;
  // 5x5 rocky ring around heart piece with rocks on right to push into
  // Top row — solid
  m[3][6]=T.ROCK;m[3][7]=T.ROCK;m[3][8]=T.ROCK;m[3][9]=T.ROCK;m[3][10]=T.ROCK;m[3][11]=T.ROCK;
  // Sides — extra rock on right for pushing into
  m[4][6]=T.ROCK;m[4][10]=T.ROCK;m[4][11]=T.ROCK;
  m[5][6]=T.ROCK;m[5][10]=T.ROCK;
  m[6][6]=T.ROCK;m[6][10]=T.ROCK;
  // Bottom row — middle 3 pushable, extra rock on right
  m[7][6]=T.ROCK;m[7][7]=T.PUSH;m[7][8]=T.PUSH;m[7][9]=T.PUSH;m[7][10]=T.ROCK;m[7][11]=T.ROCK;
  // Heart piece top-left inside
  m[4][7]=T.HEART_PIECE;
  // Floor inside ring
  m[4][8]=T.PATH;m[4][9]=T.PATH;
  m[5][7]=T.PATH;m[5][8]=T.PATH;m[5][9]=T.PATH;
  m[6][7]=T.PATH;m[6][8]=T.PATH;m[6][9]=T.PATH;
  // Scattered rocks below
  m[9][5]=T.ROCK;m[9][6]=T.ROCK;m[9][10]=T.ROCK;// push south
  m[3][5]=T.TALLGRASS;m[3][10]=T.TALLGRASS;m[8][4]=T.BUSH;m[8][11]=T.BUSH;
  // Scattered rocks elsewhere to make the area feel naturally rocky
  m[4][4]=T.ROCK;m[4][11]=T.ROCK;m[5][3]=T.ROCK;m[5][12]=T.ROCK;
  m[9][3]=T.ROCK;m[9][12]=T.ROCK;
  oe(m,"W");oe(m,"E");oe(m,"S");return m;})(),

// Snowy highland approach
"3,-1":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.ICE));
  for(let i=0;i<CO;i++){m[0][i]=T.ROCK;m[RO-1][i]=T.ROCK;}for(let i=0;i<RO;i++){m[i][0]=T.ROCK;m[i][CO-1]=T.ROCK;}
  m[1][1]=T.ROCK;m[1][2]=T.ROCK;m[1][13]=T.ROCK;m[1][14]=T.ROCK;
  m[10][1]=T.ROCK;m[10][2]=T.ROCK;m[10][13]=T.ROCK;m[10][14]=T.ROCK;
  // Ice fields with rock clusters
  m[3][3]=T.ROCK;m[3][4]=T.ROCK;m[4][3]=T.ROCK;
  m[3][11]=T.ROCK;m[3][12]=T.ROCK;m[4][12]=T.ROCK;
  m[8][3]=T.ROCK;m[8][4]=T.ROCK;m[8][11]=T.ROCK;m[8][12]=T.ROCK;
  // Central path through ice
  for(let c=5;c<=10;c++){m[5][c]=T.PATH;m[6][c]=T.PATH;}
  m[5][4]=T.PATH;m[6][4]=T.PATH;
  m[2][7]=T.ROCK;m[2][8]=T.ROCK;m[9][7]=T.ROCK;m[9][8]=T.ROCK;
  m[4][7]=T.STUMP;m[7][7]=T.STUMP;
  oe(m,"W",T.ICE);oe(m,"E",T.ICE);oe(m,"S",T.ICE);return m;})(),

// Icy peak — HEART_PIECE hidden near edge
"4,-1":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.ICE));
  for(let i=0;i<CO;i++){m[0][i]=T.ROCK;m[RO-1][i]=T.ROCK;}for(let i=0;i<RO;i++){m[i][0]=T.ROCK;m[i][CO-1]=T.ROCK;}
  // Heavy rock borders — icy wasteland
  m[1][1]=T.ROCK;m[1][2]=T.ROCK;m[1][3]=T.ROCK;m[1][4]=T.ROCK;m[1][11]=T.ROCK;m[1][12]=T.ROCK;m[1][13]=T.ROCK;m[1][14]=T.ROCK;
  m[2][1]=T.ROCK;m[2][2]=T.ROCK;m[2][3]=T.ROCK;m[2][13]=T.ROCK;m[2][14]=T.ROCK;
  m[3][1]=T.ROCK;m[3][2]=T.ROCK;m[3][13]=T.ROCK;m[3][14]=T.ROCK;
  m[9][1]=T.ROCK;m[9][2]=T.ROCK;m[9][13]=T.ROCK;m[9][14]=T.ROCK;
  m[10][1]=T.ROCK;m[10][2]=T.ROCK;m[10][3]=T.ROCK;m[10][4]=T.ROCK;m[10][11]=T.ROCK;m[10][12]=T.ROCK;m[10][13]=T.ROCK;m[10][14]=T.ROCK;
  // Frozen lake
  m[4][5]=T.WATER;m[4][6]=T.WATER;m[4][7]=T.WATER;m[4][8]=T.WATER;m[4][9]=T.WATER;m[4][10]=T.WATER;
  m[5][5]=T.WATER;m[5][6]=T.WATER;m[5][7]=T.WATER;m[5][8]=T.WATER;m[5][9]=T.WATER;m[5][10]=T.WATER;
  m[6][5]=T.WATER;m[6][6]=T.WATER;m[6][7]=T.WATER;m[6][8]=T.WATER;m[6][9]=T.WATER;m[6][10]=T.WATER;
  // Path leads to heart piece in corner alcove
  m[7][10]=T.PATH;m[7][11]=T.PATH;m[7][12]=T.PATH;
  m[8][12]=T.PATH;m[9][12]=T.PATH;
  m[9][11]=T.HEART_PIECE;// visible in the alcove
  m[7][4]=T.PATH;m[7][5]=T.PATH;m[8][4]=T.PATH;m[8][5]=T.PATH;
  m[9][7]=T.STUMP;m[3][7]=T.STUMP;
  // Banana cave — push boulder to reveal, guarded by yetis inside
  m[8][3]=T.ROCK;m[9][3]=T.ROCK;m[9][5]=T.ROCK;
  m[8][4]=T.PUSH;// beside rocks, push south to reveal cave
  oe(m,"W",T.ICE);oe(m,"S",T.ICE);oe(m,"E",T.ICE);return m;})(),

// ===== ROW y=0 (Main upper row) =====

// Deep forest west
"-1,0":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
  for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
  // Dense trees with clearings
  m[1][1]=T.TREE;m[1][2]=T.TREE;m[1][3]=T.TREE;m[1][11]=T.TREE;m[1][12]=T.TREE;m[1][13]=T.TREE;m[1][14]=T.TREE;
  m[2][1]=T.TREE;m[2][2]=T.TREE;m[2][12]=T.TREE;m[2][13]=T.TREE;m[2][14]=T.TREE;
  m[3][1]=T.TREE;m[3][2]=T.TREE;m[3][13]=T.TREE;
  m[8][1]=T.TREE;m[8][2]=T.TREE;m[8][13]=T.TREE;
  m[9][1]=T.TREE;m[9][2]=T.TREE;m[9][12]=T.TREE;m[9][13]=T.TREE;m[9][14]=T.TREE;
  m[10][1]=T.TREE;m[10][2]=T.TREE;m[10][3]=T.TREE;m[10][11]=T.TREE;m[10][12]=T.TREE;m[10][13]=T.TREE;m[10][14]=T.TREE;
  // Small pond
  m[4][4]=T.WATER;m[4][5]=T.WATER;m[5][4]=T.WATER;m[5][5]=T.WATER;
  // Winding path through forest
  m[5][6]=T.PATH;m[5][7]=T.PATH;m[5][8]=T.PATH;m[6][8]=T.PATH;m[6][9]=T.PATH;m[6][10]=T.PATH;
  m[4][7]=T.TALLGRASS;m[4][8]=T.TALLGRASS;m[7][5]=T.TALLGRASS;m[7][6]=T.TALLGRASS;
  m[6][4]=T.FLOWER;m[7][4]=T.FLOWER;m[3][9]=T.BUSH;m[3][10]=T.BUSH;
  m[7][10]=T.STUMP;m[8][10]=T.STUMP;
  oe(m,"N");oe(m,"E");oe(m,"S");return m;})(),

// Forest Temple screen — D0 entrance
"0,0":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
  for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
  m[1][1]=T.TREE;m[1][2]=T.TREE;m[1][13]=T.TREE;m[2][1]=T.TREE;m[10][1]=T.TREE;m[10][2]=T.TREE;m[2][14]=T.TREE;
  m[2][5]=T.TREE;m[2][6]=T.TREE;m[3][3]=T.TREE;m[3][4]=T.TREE;m[8][3]=T.TREE;m[9][4]=T.TREE;
  m[2][10]=T.TREE;m[3][11]=T.TREE;m[3][12]=T.TREE;m[8][12]=T.TREE;m[9][10]=T.TREE;
  m[3][6]=T.WATER;m[3][7]=T.WATER;m[4][5]=T.WATER;m[4][6]=T.WATER;m[4][7]=T.WATER;
  // D0 Forest Temple entrance
  m[5][7]=T.ENTRANCE;m[5][8]=T.ENTRANCE;m[6][7]=T.ENTRANCE;m[6][8]=T.ENTRANCE;
  m[4][6]=T.ROCK;m[4][9]=T.ROCK;m[7][6]=T.ROCK;m[7][9]=T.ROCK;
  m[7][7]=T.PATH;m[7][8]=T.PATH;m[8][7]=T.PATH;m[8][8]=T.PATH;
  m[6][3]=T.FLOWER;m[6][4]=T.FLOWER;m[7][11]=T.TALLGRASS;m[8][5]=T.TALLGRASS;
  oe(m,"W");oe(m,"E");oe(m,"N");oe(m,"S");return m;})(),

// Meadow with crack cave
"1,0":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
  for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
  m[3][5]=T.FLOWER;m[3][6]=T.FLOWER;m[4][5]=T.FLOWER;m[3][10]=T.FLOWER;m[4][10]=T.FLOWER;
  m[7][3]=T.TALLGRASS;m[7][4]=T.TALLGRASS;m[8][11]=T.TALLGRASS;m[8][12]=T.TALLGRASS;
  m[5][8]=T.BUSH;m[6][3]=T.BUSH;m[2][12]=T.STUMP;m[9][4]=T.STUMP;
  // Boulders near hidden cave — push bottom boulder south
  // Player approaches from north (row 2 clear), pushes south
  m[1][2]=T.ROCK;m[1][3]=T.ROCK;
  m[2][3]=T.ROCK;
  m[3][2]=T.PUSH;// cave entrance — push south to row 4 (clear grass)
  oe(m,"W");oe(m,"E");oe(m,"N");oe(m,"S");return m;})(),

// Desert border — sand meets grass
"2,0":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.SAND));
  for(let i=0;i<CO;i++){m[0][i]=T.ROCK;m[RO-1][i]=T.ROCK;}for(let i=0;i<RO;i++){m[i][0]=T.ROCK;m[i][CO-1]=T.ROCK;}
  m[1][5]=T.ROCK;m[1][10]=T.ROCK;m[9][4]=T.ROCK;m[9][11]=T.ROCK;
  m[3][3]=T.ROCK;m[4][3]=T.ROCK;m[3][12]=T.ROCK;m[8][12]=T.ROCK;
  m[7][10]=T.WATER;m[7][11]=T.WATER;m[8][10]=T.WATER;m[6][10]=T.BUSH;m[6][11]=T.TALLGRASS;
  // Central oasis path
  m[5][7]=T.PATH;m[5][8]=T.PATH;m[6][7]=T.PATH;m[6][8]=T.PATH;
  m[4][7]=T.PATH;m[4][8]=T.PATH;m[7][7]=T.PATH;m[7][8]=T.PATH;
  // Shop — always accessible entrance
  m[7][12]=T.ROCK;m[8][11]=T.ROCK;m[8][13]=T.ROCK;m[9][12]=T.ROCK;
  m[8][12]=T.ENTRANCE;// Shop cave entrance
  oe(m,"W",T.SAND);oe(m,"E",T.SAND);oe(m,"N",T.SAND);oe(m,"S",T.SAND);return m;})(),

// Desert ruins with crack cave
"3,0":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.SAND));
  for(let i=0;i<CO;i++){m[0][i]=T.ROCK;m[RO-1][i]=T.ROCK;}for(let i=0;i<RO;i++){m[i][0]=T.ROCK;m[i][CO-1]=T.ROCK;}
  m[2][3]=T.ROCK;m[2][4]=T.ROCK;m[3][3]=T.ROCK;m[2][11]=T.ROCK;m[2][12]=T.ROCK;m[3][12]=T.ROCK;
  m[8][3]=T.ROCK;m[8][4]=T.ROCK;m[9][3]=T.ROCK;m[8][11]=T.ROCK;m[8][12]=T.ROCK;m[9][12]=T.ROCK;
  m[5][6]=T.PATH;m[5][7]=T.PATH;m[5][8]=T.PATH;m[5][9]=T.PATH;m[6][6]=T.PATH;m[6][7]=T.PATH;m[6][8]=T.PATH;m[6][9]=T.PATH;
  // Crack cave
  m[4][10]=T.CRACK;m[3][10]=T.ROCK;
  m[2][7]=T.STUMP;m[9][7]=T.STUMP;
  oe(m,"W",T.SAND);oe(m,"E",T.SAND);oe(m,"N",T.SAND);oe(m,"S",T.SAND);return m;})(),

// Far east desert outpost
"4,0":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.SAND));
  for(let i=0;i<CO;i++){m[0][i]=T.ROCK;m[RO-1][i]=T.ROCK;}for(let i=0;i<RO;i++){m[i][0]=T.ROCK;m[i][CO-1]=T.ROCK;}
  m[1][1]=T.ROCK;m[1][2]=T.ROCK;m[1][13]=T.ROCK;m[1][14]=T.ROCK;
  m[10][1]=T.ROCK;m[10][2]=T.ROCK;m[10][13]=T.ROCK;m[10][14]=T.ROCK;
  // Ruined walls
  m[3][4]=T.ROCK;m[3][5]=T.ROCK;m[3][6]=T.ROCK;m[3][10]=T.ROCK;m[3][11]=T.ROCK;
  m[8][4]=T.ROCK;m[8][5]=T.ROCK;m[8][10]=T.ROCK;m[8][11]=T.ROCK;
  m[4][4]=T.ROCK;m[7][4]=T.ROCK;m[4][11]=T.ROCK;m[7][11]=T.ROCK;
  // Sandy courtyard
  m[5][7]=T.PATH;m[5][8]=T.PATH;m[6][7]=T.PATH;m[6][8]=T.PATH;
  m[4][7]=T.TORCH;m[4][8]=T.TORCH;m[7][7]=T.TORCH;m[7][8]=T.TORCH;
  m[2][7]=T.STUMP;m[9][8]=T.BUSH;
  m[8][5]=T.CRACK;// Bombable wall hides jar cave
  oe(m,"W",T.SAND);oe(m,"S",T.SAND);oe(m,"N",T.SAND);return m;})(),

// ===== ROW y=1 (Main middle row) =====

// Deep forest swamp edge — HEART_PIECE behind crack
"-1,1":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
  for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
  m[1][1]=T.TREE;m[1][2]=T.TREE;m[1][3]=T.TREE;m[1][12]=T.TREE;m[1][13]=T.TREE;m[1][14]=T.TREE;
  m[2][1]=T.TREE;m[2][2]=T.TREE;m[2][13]=T.TREE;m[2][14]=T.TREE;
  m[9][1]=T.TREE;m[9][2]=T.TREE;m[9][13]=T.TREE;m[9][14]=T.TREE;
  m[10][1]=T.TREE;m[10][2]=T.TREE;m[10][3]=T.TREE;m[10][12]=T.TREE;m[10][13]=T.TREE;m[10][14]=T.TREE;
  // Swampy water patches
  m[3][3]=T.WATER;m[3][4]=T.WATER;m[4][3]=T.WATER;m[4][4]=T.WATER;m[4][5]=T.WATER;
  m[7][9]=T.WATER;m[7][10]=T.WATER;m[8][9]=T.WATER;m[8][10]=T.WATER;m[8][11]=T.WATER;
  // Trees in corner
  m[3][10]=T.TREE;m[2][10]=T.TREE;m[2][11]=T.TREE;m[2][12]=T.TREE;
  m[4][11]=T.TREE;m[4][12]=T.TREE;
  // Paths
  m[5][5]=T.PATH;m[5][6]=T.PATH;m[6][6]=T.PATH;m[6][7]=T.PATH;m[6][8]=T.PATH;
  m[5][9]=T.TALLGRASS;m[6][3]=T.TALLGRASS;m[7][5]=T.TALLGRASS;m[7][6]=T.TALLGRASS;
  m[5][3]=T.FLOWER;m[3][7]=T.BUSH;
  // Boulders near hidden cave — pushable one below cluster
  m[6][11]=T.ROCK;m[6][12]=T.ROCK;m[6][13]=T.ROCK;m[7][13]=T.ROCK;
  m[8][12]=T.PUSH;// below cluster, push south
  oe(m,"N");oe(m,"E");oe(m,"S");return m;})(),

// Western forest hub
"0,1":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
  for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
  m[1][3]=T.TREE;m[1][4]=T.TREE;m[1][10]=T.TREE;m[1][11]=T.TREE;m[1][12]=T.TREE;
  m[2][2]=T.TREE;m[2][3]=T.TREE;m[2][12]=T.TREE;m[2][13]=T.TREE;
  m[3][2]=T.TREE;m[3][13]=T.TREE;m[4][2]=T.TREE;m[4][12]=T.TREE;
  m[7][2]=T.TREE;m[7][13]=T.TREE;m[8][2]=T.TREE;m[8][13]=T.TREE;
  m[9][2]=T.TREE;m[9][3]=T.TREE;m[9][12]=T.TREE;m[9][13]=T.TREE;
  m[10][3]=T.TREE;m[10][4]=T.TREE;m[10][10]=T.TREE;m[10][11]=T.TREE;
  // Ancient Tree grove — small cluster of trees with approach from south
  m[2][6]=T.TREE;m[2][7]=T.TREE;m[2][8]=T.TREE;
  m[3][5]=T.TREE;m[3][6]=T.TREE;m[3][8]=T.TREE;m[3][9]=T.TREE;
  m[4][5]=T.TREE;m[4][9]=T.TREE;
  // NPC at [7,4] — tiles around it are trees, south is open path
  // Safe paths winding through swamp — path leads to tree grove
  m[5][7]=T.PATH;m[5][8]=T.PATH;m[3][10]=T.PATH;m[3][11]=T.PATH;
  m[5][4]=T.PATH;m[5][5]=T.PATH;m[8][5]=T.PATH;m[8][6]=T.PATH;m[8][7]=T.PATH;m[8][8]=T.PATH;m[8][9]=T.PATH;m[8][10]=T.PATH;
  // Poisonous swamp clusters — clumped tallgrass patches
  // West swamp pool
  m[4][3]=T.TALLGRASS;m[4][4]=T.TALLGRASS;m[4][5]=T.TALLGRASS;
  m[5][3]=T.TALLGRASS;m[5][6]=T.TALLGRASS;
  m[6][3]=T.TALLGRASS;m[6][4]=T.TALLGRASS;m[6][5]=T.TALLGRASS;m[6][6]=T.TALLGRASS;
  m[7][3]=T.TALLGRASS;m[7][4]=T.TALLGRASS;
  // East swamp pool
  m[4][9]=T.TALLGRASS;m[4][10]=T.TALLGRASS;m[4][11]=T.TALLGRASS;
  m[5][9]=T.TALLGRASS;m[5][10]=T.TALLGRASS;m[5][11]=T.TALLGRASS;
  m[6][9]=T.TALLGRASS;m[6][10]=T.TALLGRASS;m[6][11]=T.TALLGRASS;
  m[7][9]=T.TALLGRASS;m[7][10]=T.TALLGRASS;m[7][11]=T.TALLGRASS;
  // Central area — path leads north to tree grove
  m[6][7]=T.PATH;m[6][8]=T.PATH;
  m[9][7]=T.BUSH;m[9][8]=T.BUSH;
  oe(m,"W");oe(m,"N");oe(m,"E");oe(m,"S");return m;})(),

// Central hub — peaceful crossroads
"1,1":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
  for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
  for(let c=2;c<=13;c++){m[5][c]=T.PATH;m[6][c]=T.PATH;}
  for(let r=1;r<=10;r++){m[r][7]=T.PATH;m[r][8]=T.PATH;}
  m[5][7]=T.WATER;m[5][8]=T.WATER;m[6][7]=T.WATER;m[6][8]=T.WATER;
  m[4][7]=T.ROCK;m[4][8]=T.ROCK;m[7][7]=T.ROCK;m[7][8]=T.ROCK;m[5][6]=T.ROCK;m[6][6]=T.ROCK;m[5][9]=T.ROCK;m[6][9]=T.ROCK;
  m[2][3]=T.FLOWER;m[2][4]=T.FLOWER;m[3][3]=T.FLOWER;m[3][12]=T.FLOWER;m[2][11]=T.FLOWER;m[2][12]=T.FLOWER;
  m[8][3]=T.BUSH;m[8][12]=T.BUSH;m[9][4]=T.STUMP;m[9][11]=T.STUMP;
  m[1][4]=T.TREE;m[1][11]=T.TREE;m[10][4]=T.TREE;m[10][11]=T.TREE;
  oe(m,"W");oe(m,"N");oe(m,"E");oe(m,"S");return m;})(),

// Lake crossing
"2,1":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
  for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
  for(let r=2;r<=9;r++)for(let c=5;c<=11;c++)m[r][c]=T.WATER;
  m[5][5]=T.BRIDGE;m[5][6]=T.BRIDGE;m[5][7]=T.BRIDGE;m[5][8]=T.BRIDGE;m[5][9]=T.BRIDGE;m[5][10]=T.BRIDGE;m[5][11]=T.BRIDGE;
  m[6][5]=T.BRIDGE;m[6][6]=T.BRIDGE;m[6][7]=T.BRIDGE;m[6][8]=T.BRIDGE;m[6][9]=T.BRIDGE;m[6][10]=T.BRIDGE;m[6][11]=T.BRIDGE;
  m[2][3]=T.TALLGRASS;m[9][3]=T.TALLGRASS;m[2][12]=T.BUSH;m[9][12]=T.BUSH;
  m[4][3]=T.FLOWER;m[7][12]=T.FLOWER;
  // Boulders by the lake — pushable one beside cluster
  m[8][1]=T.ROCK;m[8][2]=T.ROCK;m[8][3]=T.ROCK;m[9][1]=T.ROCK;m[10][2]=T.ROCK;
  m[9][3]=T.PUSH;// beside cluster, push east
  oe(m,"W");oe(m,"E");oe(m,"N");oe(m,"S");return m;})(),

// Eastern ruins
"3,1":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
  for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
  // Scattered boulder field
  m[3][4]=T.ROCK;m[3][5]=T.ROCK;m[3][10]=T.ROCK;m[3][11]=T.ROCK;
  m[8][4]=T.ROCK;m[8][5]=T.ROCK;m[8][10]=T.ROCK;m[8][11]=T.ROCK;
  m[4][4]=T.ROCK;m[4][11]=T.ROCK;m[7][4]=T.ROCK;m[7][11]=T.ROCK;
  m[5][7]=T.ROCK;m[5][8]=T.ROCK;m[6][7]=T.ROCK;m[6][8]=T.ROCK;
  m[4][6]=T.PATH;m[4][7]=T.PATH;m[4][8]=T.PATH;m[4][9]=T.PATH;
  m[7][6]=T.PATH;m[7][7]=T.PATH;m[7][8]=T.PATH;m[7][9]=T.PATH;
  m[2][7]=T.TORCH;m[2][8]=T.TORCH;m[9][7]=T.TORCH;m[9][8]=T.TORCH;
  // Extra boulders — denser field extending east
  m[2][10]=T.ROCK;m[2][11]=T.ROCK;m[2][12]=T.ROCK;
  m[3][12]=T.ROCK;m[3][13]=T.ROCK;
  m[4][12]=T.ROCK;m[4][13]=T.ROCK;
  m[5][10]=T.ROCK;m[5][11]=T.ROCK;m[5][12]=T.ROCK;
  m[6][10]=T.ROCK;m[6][11]=T.ROCK;m[6][12]=T.ROCK;
  m[7][12]=T.ROCK;m[7][13]=T.ROCK;
  m[8][12]=T.ROCK;m[8][13]=T.ROCK;
  m[9][10]=T.ROCK;m[9][11]=T.ROCK;m[9][12]=T.ROCK;
  m[5][3]=T.ROCK;m[6][3]=T.ROCK;m[9][5]=T.ROCK;m[2][5]=T.ROCK;
  oe(m,"W");oe(m,"E");oe(m,"N");oe(m,"S");
  // Cracked tile near east side — nestled in the boulder field
  m[5][12]=T.CRACK;
  return m;})(),

// D1 Fire Cavern — desert dungeon
"4,1":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.SAND));
  for(let i=0;i<CO;i++){m[0][i]=T.ROCK;m[RO-1][i]=T.ROCK;}for(let i=0;i<RO;i++){m[i][0]=T.ROCK;m[i][CO-1]=T.ROCK;}
  m[1][1]=T.ROCK;m[1][2]=T.ROCK;m[1][13]=T.ROCK;m[1][14]=T.ROCK;
  m[10][1]=T.ROCK;m[10][2]=T.ROCK;m[10][13]=T.ROCK;m[10][14]=T.ROCK;
  // D1 Fire Cavern entrance
  m[5][7]=T.ENTRANCE;m[5][8]=T.ENTRANCE;m[6][7]=T.ENTRANCE;m[6][8]=T.ENTRANCE;
  m[4][6]=T.ROCK;m[4][9]=T.ROCK;m[7][6]=T.ROCK;m[7][9]=T.ROCK;
  // Lava-like decoration
  m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[8][5]=T.TORCH;m[8][10]=T.TORCH;
  m[2][7]=T.TORCH;m[2][8]=T.TORCH;m[9][7]=T.TORCH;m[9][8]=T.TORCH;
  // Path leading to entrance
  m[7][7]=T.PATH;m[7][8]=T.PATH;m[8][7]=T.PATH;m[8][8]=T.PATH;m[9][7]=T.PATH;m[9][8]=T.PATH;
  m[4][7]=T.PATH;m[4][8]=T.PATH;m[3][7]=T.PATH;m[3][8]=T.PATH;
  oe(m,"W",T.SAND);oe(m,"N",T.SAND);oe(m,"S",T.SAND);return m;})(),

// ===== ROW y=2 (Southern row) =====

// Dark swamp clearing (Shadow Keep moved to 6,2)
"-1,2":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
  for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
  m[1][1]=T.TREE;m[1][2]=T.TREE;m[1][3]=T.TREE;m[1][12]=T.TREE;m[1][13]=T.TREE;m[1][14]=T.TREE;
  m[2][1]=T.TREE;m[2][2]=T.TREE;m[2][13]=T.TREE;m[2][14]=T.TREE;
  m[9][1]=T.TREE;m[9][2]=T.TREE;m[9][3]=T.TREE;m[9][12]=T.TREE;m[9][13]=T.TREE;m[9][14]=T.TREE;
  m[10][1]=T.TREE;m[10][2]=T.TREE;m[10][3]=T.TREE;m[10][4]=T.TREE;m[10][10]=T.TREE;m[10][11]=T.TREE;m[10][12]=T.TREE;m[10][13]=T.TREE;m[10][14]=T.TREE;
  // Swamp water
  m[3][3]=T.WATER;m[3][4]=T.WATER;m[3][5]=T.WATER;m[4][3]=T.WATER;m[4][4]=T.WATER;
  m[7][10]=T.WATER;m[7][11]=T.WATER;m[8][10]=T.WATER;m[8][11]=T.WATER;m[8][12]=T.WATER;
  m[3][10]=T.WATER;m[3][11]=T.WATER;m[4][11]=T.WATER;
  // Abandoned ruins where entrance used to be
  m[5][7]=T.ROCK;m[5][8]=T.ROCK;m[6][7]=T.ROCK;m[6][8]=T.ROCK;
  m[4][6]=T.ROCK;m[4][9]=T.ROCK;m[7][6]=T.ROCK;m[7][9]=T.ROCK;
  m[6][4]=T.TALLGRASS;m[6][5]=T.TALLGRASS;m[5][10]=T.TALLGRASS;m[5][11]=T.TALLGRASS;
  m[2][7]=T.TORCH;m[2][8]=T.TORCH;
  m[7][7]=T.PATH;m[7][8]=T.PATH;m[8][7]=T.PATH;m[8][8]=T.PATH;
  oe(m,"N");oe(m,"E");return m;})(),

// Southern forest — crack cave
"0,2":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
  for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
  m[1][3]=T.TREE;m[1][4]=T.TREE;m[2][2]=T.TREE;m[3][2]=T.TREE;m[1][11]=T.TREE;m[1][12]=T.TREE;
  m[9][2]=T.TREE;m[9][3]=T.TREE;m[10][12]=T.TREE;m[10][13]=T.TREE;
  m[5][5]=T.TALLGRASS;m[5][6]=T.TALLGRASS;m[6][9]=T.TALLGRASS;m[6][10]=T.TALLGRASS;
  // Boulders with hidden cave — pushable one beside cluster
  m[7][7]=T.ROCK;m[7][8]=T.ROCK;m[7][9]=T.ROCK;
  m[8][7]=T.ROCK;m[8][9]=T.ROCK;
  m[8][10]=T.PUSH;// beside cluster, push east
  m[3][7]=T.FLOWER;m[3][8]=T.FLOWER;m[4][9]=T.STUMP;m[7][4]=T.STUMP;
  oe(m,"W");oe(m,"N");oe(m,"E");return m;})(),

// Southern path — crack cave
"1,2":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
  for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
  for(let c=3;c<=12;c++){m[5][c]=T.PATH;m[6][c]=T.PATH;}
  m[3][4]=T.FLOWER;m[3][5]=T.FLOWER;m[3][10]=T.FLOWER;m[3][11]=T.FLOWER;
  m[8][4]=T.BUSH;m[8][5]=T.BUSH;m[8][10]=T.BUSH;m[8][11]=T.BUSH;
  m[2][7]=T.TALLGRASS;m[2][8]=T.TALLGRASS;m[9][7]=T.TALLGRASS;m[9][8]=T.TALLGRASS;
  // Boulders with hidden cave — pushable one beside cluster
  m[8][2]=T.ROCK;m[8][3]=T.ROCK;m[8][4]=T.ROCK;
  m[9][2]=T.ROCK;m[9][4]=T.ROCK;
  m[9][5]=T.PUSH;// beside cluster, push south
  oe(m,"N");oe(m,"W");oe(m,"E");return m;})(),

// Beach — sand and water coast
"2,2":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.SAND));
  for(let i=0;i<CO;i++){m[0][i]=T.ROCK;m[RO-1][i]=T.ROCK;}for(let i=0;i<RO;i++){m[i][0]=T.ROCK;m[i][CO-1]=T.ROCK;}
  // Healing hot spring — all water is walkable hot spring
  for(let r=7;r<=10;r++)for(let c=1;c<=14;c++)m[r][c]=T.HOT_SPRING;
  // Beach sand strip
  for(let c=1;c<=14;c++){m[6][c]=T.SAND;}
  // Dock/bridge into the spring
  m[6][7]=T.BRIDGE;m[6][8]=T.BRIDGE;m[7][7]=T.BRIDGE;m[7][8]=T.BRIDGE;
  m[3][9]=T.TALLGRASS;m[4][6]=T.FLOWER;m[5][4]=T.BUSH;m[5][11]=T.STUMP;
  m[2][7]=T.PATH;m[2][8]=T.PATH;m[3][7]=T.PATH;m[3][8]=T.PATH;m[4][7]=T.PATH;m[4][8]=T.PATH;m[5][7]=T.PATH;m[5][8]=T.PATH;
  oe(m,"W",T.SAND);oe(m,"N",T.SAND);oe(m,"E",T.SAND);return m;})(),

// D3 Dark Sanctum — final gate (ROCK blocks entrance, opened by game code)
"3,2":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.SAND));
  for(let i=0;i<CO;i++){m[0][i]=T.ROCK;m[RO-1][i]=T.ROCK;}for(let i=0;i<RO;i++){m[i][0]=T.ROCK;m[i][CO-1]=T.ROCK;}
  m[1][1]=T.ROCK;m[1][2]=T.ROCK;m[1][13]=T.ROCK;m[1][14]=T.ROCK;
  m[10][1]=T.ROCK;m[10][2]=T.ROCK;m[10][13]=T.ROCK;m[10][14]=T.ROCK;
  // Dark terrain accents
  m[3][3]=T.ROCK;m[4][3]=T.ROCK;m[3][12]=T.ROCK;m[4][12]=T.ROCK;
  m[8][3]=T.ROCK;m[9][3]=T.ROCK;m[8][12]=T.ROCK;m[9][12]=T.ROCK;
  // D3 blocked entrance — ROCK at entrance position, game code swaps to ENTRANCE
  m[5][7]=T.ROCK;m[5][8]=T.ROCK;m[6][7]=T.ROCK;m[6][8]=T.ROCK;
  m[4][6]=T.TORCH;m[4][9]=T.TORCH;m[7][6]=T.TORCH;m[7][9]=T.TORCH;
  // Path leading up to the sealed gate
  m[7][7]=T.PATH;m[7][8]=T.PATH;m[8][7]=T.PATH;m[8][8]=T.PATH;m[9][7]=T.PATH;m[9][8]=T.PATH;
  m[4][7]=T.PATH;m[4][8]=T.PATH;m[3][7]=T.PATH;m[3][8]=T.PATH;
  m[2][7]=T.TORCH;m[2][8]=T.TORCH;m[9][5]=T.TORCH;m[9][10]=T.TORCH;
  oe(m,"W",T.SAND);oe(m,"N",T.SAND);oe(m,"E",T.SAND);return m;})(),

// Volcanic southeast
"4,2":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.SAND));
  for(let i=0;i<CO;i++){m[0][i]=T.ROCK;m[RO-1][i]=T.ROCK;}for(let i=0;i<RO;i++){m[i][0]=T.ROCK;m[i][CO-1]=T.ROCK;}
  m[1][1]=T.ROCK;m[1][2]=T.ROCK;m[1][3]=T.ROCK;m[1][12]=T.ROCK;m[1][13]=T.ROCK;m[1][14]=T.ROCK;
  m[2][1]=T.ROCK;m[2][2]=T.ROCK;m[2][13]=T.ROCK;m[2][14]=T.ROCK;
  m[9][1]=T.ROCK;m[9][2]=T.ROCK;m[9][13]=T.ROCK;m[9][14]=T.ROCK;
  m[10][1]=T.ROCK;m[10][2]=T.ROCK;m[10][3]=T.ROCK;m[10][12]=T.ROCK;m[10][13]=T.ROCK;m[10][14]=T.ROCK;
  // Lava pools (water tiles used as lava visually)
  m[4][5]=T.WATER;m[4][6]=T.WATER;m[4][7]=T.WATER;m[5][5]=T.WATER;m[5][6]=T.WATER;
  m[7][9]=T.WATER;m[7][10]=T.WATER;m[8][9]=T.WATER;m[8][10]=T.WATER;m[8][11]=T.WATER;
  // Paths between lava
  m[5][7]=T.PATH;m[5][8]=T.PATH;m[6][5]=T.PATH;m[6][6]=T.PATH;m[6][7]=T.PATH;m[6][8]=T.PATH;m[6][9]=T.PATH;m[6][10]=T.PATH;
  m[7][7]=T.PATH;m[7][8]=T.PATH;
  m[3][8]=T.TORCH;m[3][9]=T.TORCH;m[9][5]=T.TORCH;m[9][6]=T.TORCH;
  m[3][4]=T.ROCK;m[8][4]=T.ROCK;m[3][11]=T.ROCK;
  oe(m,"W",T.SAND);oe(m,"N",T.SAND);oe(m,"E",T.SAND);return m;})(),

// ===== COLUMN x=5 (Eastern frontier — ice mountains + desert) =====

// Frozen Peak — treacherous ice mountain summit with heart piece
"5,-1":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.ICE));
  for(let i=0;i<CO;i++){m[0][i]=T.ROCK;m[RO-1][i]=T.ROCK;}for(let i=0;i<RO;i++){m[i][CO-1]=T.ROCK;}
  // Heavy mountain rock formations
  m[1][1]=T.ROCK;m[1][2]=T.ROCK;m[1][3]=T.ROCK;m[1][10]=T.ROCK;m[1][11]=T.ROCK;m[1][12]=T.ROCK;m[1][13]=T.ROCK;m[1][14]=T.ROCK;
  m[2][1]=T.ROCK;m[2][2]=T.ROCK;m[2][11]=T.ROCK;m[2][12]=T.ROCK;m[2][13]=T.ROCK;m[2][14]=T.ROCK;
  m[3][12]=T.ROCK;m[3][13]=T.ROCK;m[3][14]=T.ROCK;
  m[10][1]=T.ROCK;m[10][2]=T.ROCK;m[10][3]=T.ROCK;m[10][11]=T.ROCK;m[10][12]=T.ROCK;m[10][13]=T.ROCK;m[10][14]=T.ROCK;
  m[9][1]=T.ROCK;m[9][2]=T.ROCK;m[9][12]=T.ROCK;m[9][13]=T.ROCK;m[9][14]=T.ROCK;
  // Frozen crevasses (water = bottomless ice gaps)
  m[4][3]=T.WATER;m[4][4]=T.WATER;m[5][3]=T.WATER;m[5][4]=T.WATER;
  m[7][8]=T.WATER;m[7][9]=T.WATER;m[8][8]=T.WATER;m[8][9]=T.WATER;m[8][10]=T.WATER;
  // Winding ice path through the peaks
  m[3][4]=T.PATH;m[3][5]=T.PATH;m[3][6]=T.PATH;m[4][6]=T.PATH;m[5][6]=T.PATH;m[5][7]=T.PATH;
  m[6][7]=T.PATH;m[6][8]=T.PATH;m[6][9]=T.PATH;m[6][10]=T.PATH;m[6][11]=T.PATH;
  m[7][11]=T.PATH;m[8][11]=T.PATH;
  // Heart piece at the end of the treacherous path
  m[7][11]=T.HEART_PIECE;
  // Rock clusters for atmosphere
  m[5][10]=T.ROCK;m[5][11]=T.ROCK;m[4][9]=T.ROCK;m[4][10]=T.ROCK;
  m[7][3]=T.ROCK;m[7][4]=T.ROCK;m[8][3]=T.ROCK;
  m[3][8]=T.STUMP;m[9][6]=T.STUMP;
  oe(m,"W",T.ICE);oe(m,"S",T.ICE);return m;})(),

// Ice Mountain Pass — connects ice and desert, steep rocky terrain
"5,0":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.ICE));
  for(let i=0;i<CO;i++){m[0][i]=T.ROCK;m[RO-1][i]=T.ROCK;}for(let i=0;i<RO;i++){m[i][0]=T.ROCK;m[i][CO-1]=T.ROCK;}
  // Mountain walls on both sides with narrow pass
  m[1][1]=T.ROCK;m[1][2]=T.ROCK;m[1][3]=T.ROCK;m[1][4]=T.ROCK;m[1][11]=T.ROCK;m[1][12]=T.ROCK;m[1][13]=T.ROCK;m[1][14]=T.ROCK;
  m[2][1]=T.ROCK;m[2][2]=T.ROCK;m[2][3]=T.ROCK;m[2][12]=T.ROCK;m[2][13]=T.ROCK;m[2][14]=T.ROCK;
  m[3][1]=T.ROCK;m[3][2]=T.ROCK;m[3][13]=T.ROCK;m[3][14]=T.ROCK;
  m[9][1]=T.ROCK;m[9][2]=T.ROCK;m[9][13]=T.ROCK;m[9][14]=T.ROCK;
  m[10][1]=T.ROCK;m[10][2]=T.ROCK;m[10][3]=T.ROCK;m[10][12]=T.ROCK;m[10][13]=T.ROCK;m[10][14]=T.ROCK;
  // Central rock ridge dividing the pass
  m[5][5]=T.ROCK;m[5][6]=T.ROCK;m[6][5]=T.ROCK;m[6][6]=T.ROCK;
  m[5][9]=T.ROCK;m[5][10]=T.ROCK;m[6][9]=T.ROCK;m[6][10]=T.ROCK;
  // Ice bridge over frozen chasm
  m[4][7]=T.BRIDGE;m[4][8]=T.BRIDGE;m[5][7]=T.BRIDGE;m[5][8]=T.BRIDGE;
  m[6][7]=T.BRIDGE;m[6][8]=T.BRIDGE;m[7][7]=T.BRIDGE;m[7][8]=T.BRIDGE;
  // Frozen water below the bridge
  m[4][5]=T.WATER;m[4][6]=T.WATER;m[7][5]=T.WATER;m[7][6]=T.WATER;
  m[4][9]=T.WATER;m[4][10]=T.WATER;m[7][9]=T.WATER;m[7][10]=T.WATER;
  // Cracked wall hides a cave
  m[8][4]=T.CRACK;
  m[3][7]=T.STUMP;m[8][11]=T.STUMP;
  oe(m,"N",T.ICE);oe(m,"S",T.ICE);return m;})(),

// Frozen Cliffs — ice mountain with ledges and dangerous terrain
"5,1":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.ICE));
  for(let i=0;i<CO;i++){m[0][i]=T.ROCK;m[RO-1][i]=T.ROCK;}for(let i=0;i<RO;i++){m[i][0]=T.ROCK;m[i][CO-1]=T.ROCK;}
  // Mountain walls
  m[1][1]=T.ROCK;m[1][2]=T.ROCK;m[1][3]=T.ROCK;m[1][11]=T.ROCK;m[1][12]=T.ROCK;m[1][13]=T.ROCK;m[1][14]=T.ROCK;
  m[2][1]=T.ROCK;m[2][2]=T.ROCK;m[2][12]=T.ROCK;m[2][13]=T.ROCK;m[2][14]=T.ROCK;
  m[10][1]=T.ROCK;m[10][2]=T.ROCK;m[10][3]=T.ROCK;m[10][4]=T.ROCK;m[10][11]=T.ROCK;m[10][12]=T.ROCK;m[10][13]=T.ROCK;m[10][14]=T.ROCK;
  m[9][1]=T.ROCK;m[9][2]=T.ROCK;m[9][3]=T.ROCK;m[9][12]=T.ROCK;m[9][13]=T.ROCK;m[9][14]=T.ROCK;
  // Large frozen lake in the center
  m[4][4]=T.WATER;m[4][5]=T.WATER;m[4][6]=T.WATER;m[4][7]=T.WATER;m[4][8]=T.WATER;
  m[5][4]=T.WATER;m[5][5]=T.ICE;m[5][6]=T.ICE;m[5][7]=T.ICE;m[5][8]=T.WATER;
  m[6][4]=T.WATER;m[6][5]=T.ICE;m[6][6]=T.ICE;m[6][7]=T.ICE;m[6][8]=T.WATER;
  m[7][4]=T.WATER;m[7][5]=T.WATER;m[7][6]=T.WATER;m[7][7]=T.WATER;m[7][8]=T.WATER;
  // Ledges on the eastern cliff face
  m[3][10]=T.LEDGE_S;m[3][11]=T.LEDGE_S;
  m[5][10]=T.ROCK;m[5][11]=T.ROCK;m[6][10]=T.ROCK;m[6][11]=T.ROCK;
  m[8][10]=T.LEDGE_S;m[8][11]=T.LEDGE_S;
  // Paths around the lake
  m[3][4]=T.PATH;m[3][5]=T.PATH;m[3][6]=T.PATH;m[8][5]=T.PATH;m[8][6]=T.PATH;m[8][7]=T.PATH;
  m[4][9]=T.PATH;m[5][9]=T.PATH;m[6][9]=T.PATH;m[7][9]=T.PATH;
  // Pushable boulder hiding a cave
  m[9][7]=T.ROCK;m[9][8]=T.ROCK;m[9][9]=T.ROCK;
  m[9][6]=T.PUSH;
  oe(m,"N",T.ICE);oe(m,"S",T.ICE);oe(m,"E",T.ICE);return m;})(),

// Scorched Barrens — desert frontier, hostile and barren
"5,2":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.SAND));
  for(let i=0;i<CO;i++){m[0][i]=T.ROCK;m[RO-1][i]=T.ROCK;}for(let i=0;i<RO;i++){m[i][CO-1]=T.ROCK;}
  // Rocky desert outcrops
  m[1][1]=T.ROCK;m[1][2]=T.ROCK;m[1][3]=T.ROCK;m[1][12]=T.ROCK;m[1][13]=T.ROCK;m[1][14]=T.ROCK;
  m[2][1]=T.ROCK;m[2][2]=T.ROCK;m[2][13]=T.ROCK;m[2][14]=T.ROCK;
  m[10][1]=T.ROCK;m[10][2]=T.ROCK;m[10][3]=T.ROCK;m[10][12]=T.ROCK;m[10][13]=T.ROCK;m[10][14]=T.ROCK;
  m[9][1]=T.ROCK;m[9][2]=T.ROCK;m[9][13]=T.ROCK;m[9][14]=T.ROCK;
  // Dried lava channels (water = lava visually)
  m[3][5]=T.WATER;m[3][6]=T.WATER;m[4][6]=T.WATER;m[5][6]=T.WATER;m[5][7]=T.WATER;
  m[7][8]=T.WATER;m[7][9]=T.WATER;m[8][9]=T.WATER;m[8][10]=T.WATER;m[9][10]=T.WATER;
  // Ruined columns
  m[4][3]=T.ROCK;m[4][4]=T.ROCK;m[4][10]=T.ROCK;m[4][11]=T.ROCK;
  m[7][3]=T.ROCK;m[7][4]=T.ROCK;m[7][11]=T.ROCK;
  // Sandy paths between the ruins
  m[5][8]=T.PATH;m[5][9]=T.PATH;m[6][7]=T.PATH;m[6][8]=T.PATH;m[6][9]=T.PATH;m[6][10]=T.PATH;
  m[5][3]=T.PATH;m[5][4]=T.PATH;m[6][3]=T.PATH;m[6][4]=T.PATH;
  // Torches marking an ancient site
  m[3][8]=T.TORCH;m[3][9]=T.TORCH;m[8][5]=T.TORCH;m[8][6]=T.TORCH;
  m[5][11]=T.BUSH;m[6][11]=T.BUSH;m[9][5]=T.BUSH;
  oe(m,"W",T.SAND);oe(m,"N",T.SAND);return m;})(),

// ===== COLUMN x=6 (Shadow Forest frontier — accessible from 5,1 east) =====

// Stormcrag Summit — rocky mountain passage, not icy
"6,-1":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
  for(let i=0;i<CO;i++){m[0][i]=T.ROCK;m[RO-1][i]=T.ROCK;}for(let i=0;i<RO;i++){m[i][0]=T.ROCK;m[i][CO-1]=T.ROCK;}
  // Mountain terrain — rocky peaks and narrow paths
  m[1][1]=T.ROCK;m[1][2]=T.ROCK;m[1][3]=T.ROCK;m[1][11]=T.ROCK;m[1][12]=T.ROCK;m[1][13]=T.ROCK;m[1][14]=T.ROCK;
  m[2][1]=T.ROCK;m[2][2]=T.ROCK;m[2][12]=T.ROCK;m[2][13]=T.ROCK;m[2][14]=T.ROCK;
  m[10][1]=T.ROCK;m[10][2]=T.ROCK;m[10][3]=T.ROCK;m[10][12]=T.ROCK;m[10][13]=T.ROCK;m[10][14]=T.ROCK;
  m[9][1]=T.ROCK;m[9][2]=T.ROCK;m[9][13]=T.ROCK;m[9][14]=T.ROCK;
  // Rocky outcrops in center
  m[4][4]=T.ROCK;m[4][5]=T.ROCK;m[5][4]=T.ROCK;
  m[4][10]=T.ROCK;m[4][11]=T.ROCK;m[5][11]=T.ROCK;
  m[7][3]=T.ROCK;m[7][4]=T.ROCK;m[8][4]=T.ROCK;
  m[7][11]=T.ROCK;m[7][12]=T.ROCK;m[8][11]=T.ROCK;
  // Mountain paths
  m[3][7]=T.PATH;m[3][8]=T.PATH;m[4][7]=T.PATH;m[4][8]=T.PATH;
  m[5][6]=T.PATH;m[5][7]=T.PATH;m[5][8]=T.PATH;m[5][9]=T.PATH;
  m[6][5]=T.PATH;m[6][6]=T.PATH;m[6][7]=T.PATH;m[6][8]=T.PATH;m[6][9]=T.PATH;m[6][10]=T.PATH;
  m[7][7]=T.PATH;m[7][8]=T.PATH;m[8][7]=T.PATH;m[8][8]=T.PATH;
  m[3][6]=T.STUMP;m[8][10]=T.STUMP;m[2][8]=T.FLOWER;m[9][7]=T.FLOWER;
  oe(m,"S");return m;})(),

// Twilight Thicket — shadow forest, dense and dark
"6,0":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.TALLGRASS));
  for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
  // Dense shadow trees forming a maze
  m[1][1]=T.TREE;m[1][2]=T.TREE;m[1][3]=T.TREE;m[1][4]=T.TREE;m[1][10]=T.TREE;m[1][11]=T.TREE;m[1][12]=T.TREE;m[1][13]=T.TREE;m[1][14]=T.TREE;
  m[2][1]=T.TREE;m[2][2]=T.TREE;m[2][3]=T.TREE;m[2][12]=T.TREE;m[2][13]=T.TREE;m[2][14]=T.TREE;
  m[3][1]=T.TREE;m[3][2]=T.TREE;m[3][6]=T.TREE;m[3][7]=T.TREE;m[3][13]=T.TREE;m[3][14]=T.TREE;
  m[4][1]=T.TREE;m[4][6]=T.TREE;m[4][10]=T.TREE;m[4][14]=T.TREE;
  m[5][1]=T.TREE;m[5][5]=T.TREE;m[5][10]=T.TREE;m[5][14]=T.TREE;
  m[6][1]=T.TREE;m[6][5]=T.TREE;m[6][6]=T.TREE;m[6][10]=T.TREE;m[6][11]=T.TREE;m[6][14]=T.TREE;
  m[7][1]=T.TREE;m[7][2]=T.TREE;m[7][8]=T.TREE;m[7][13]=T.TREE;m[7][14]=T.TREE;
  m[8][1]=T.TREE;m[8][2]=T.TREE;m[8][3]=T.TREE;m[8][8]=T.TREE;m[8][9]=T.TREE;m[8][12]=T.TREE;m[8][13]=T.TREE;m[8][14]=T.TREE;
  m[9][1]=T.TREE;m[9][2]=T.TREE;m[9][3]=T.TREE;m[9][12]=T.TREE;m[9][13]=T.TREE;m[9][14]=T.TREE;
  m[10][1]=T.TREE;m[10][2]=T.TREE;m[10][3]=T.TREE;m[10][4]=T.TREE;m[10][10]=T.TREE;m[10][11]=T.TREE;m[10][12]=T.TREE;m[10][13]=T.TREE;m[10][14]=T.TREE;
  // Winding path through the dark forest
  m[3][4]=T.PATH;m[3][5]=T.PATH;m[4][4]=T.PATH;m[4][5]=T.PATH;m[5][4]=T.PATH;
  m[5][3]=T.PATH;m[6][3]=T.PATH;m[6][4]=T.PATH;m[7][4]=T.PATH;m[7][5]=T.PATH;m[7][6]=T.PATH;m[7][7]=T.PATH;
  m[6][7]=T.PATH;m[6][8]=T.PATH;m[6][9]=T.PATH;m[5][9]=T.PATH;m[4][9]=T.PATH;
  m[4][8]=T.PATH;m[4][7]=T.PATH;m[3][9]=T.PATH;m[3][10]=T.PATH;m[3][11]=T.PATH;
  m[8][6]=T.PATH;m[8][7]=T.PATH;m[9][7]=T.PATH;m[9][8]=T.PATH;m[9][9]=T.PATH;
  // Torches to light the way
  m[4][3]=T.TORCH;m[7][3]=T.TORCH;m[5][8]=T.TORCH;m[8][10]=T.TORCH;
  oe(m,"N");oe(m,"S");return m;})(),

// Shadow Crossing — entry point from 5,1, dark forest hub
"6,1":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.TALLGRASS));
  for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][CO-1]=T.TREE;}
  // Dense tree borders with clearing in center
  m[1][1]=T.TREE;m[1][2]=T.TREE;m[1][3]=T.TREE;m[1][11]=T.TREE;m[1][12]=T.TREE;m[1][13]=T.TREE;m[1][14]=T.TREE;
  m[2][1]=T.TREE;m[2][2]=T.TREE;m[2][13]=T.TREE;m[2][14]=T.TREE;
  m[10][1]=T.TREE;m[10][2]=T.TREE;m[10][3]=T.TREE;m[10][11]=T.TREE;m[10][12]=T.TREE;m[10][13]=T.TREE;m[10][14]=T.TREE;
  m[9][1]=T.TREE;m[9][2]=T.TREE;m[9][12]=T.TREE;m[9][13]=T.TREE;m[9][14]=T.TREE;
  // Shadow trees scattered
  m[4][4]=T.TREE;m[4][5]=T.TREE;m[4][10]=T.TREE;m[4][11]=T.TREE;
  m[7][4]=T.TREE;m[7][5]=T.TREE;m[7][10]=T.TREE;m[7][11]=T.TREE;
  m[5][3]=T.TREE;m[6][3]=T.TREE;m[5][12]=T.TREE;m[6][12]=T.TREE;
  // Central clearing with torches
  m[5][7]=T.PATH;m[5][8]=T.PATH;m[6][7]=T.PATH;m[6][8]=T.PATH;
  m[4][7]=T.TORCH;m[4][8]=T.TORCH;m[7][7]=T.TORCH;m[7][8]=T.TORCH;
  // Paths to all exits
  m[3][7]=T.PATH;m[3][8]=T.PATH;m[2][7]=T.PATH;m[2][8]=T.PATH;
  m[8][7]=T.PATH;m[8][8]=T.PATH;m[9][7]=T.PATH;m[9][8]=T.PATH;
  m[5][5]=T.PATH;m[5][6]=T.PATH;m[6][5]=T.PATH;m[6][6]=T.PATH;
  m[5][9]=T.PATH;m[5][10]=T.PATH;m[6][9]=T.PATH;m[6][10]=T.PATH;
  oe(m,"W",T.TALLGRASS);oe(m,"N");oe(m,"S");return m;})(),

// Shadow Keep Depths — D3 Shadow Keep entrance, deepest shadow forest
"6,2":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.TALLGRASS));
  for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
  // Heavy shadow forest borders
  m[1][1]=T.TREE;m[1][2]=T.TREE;m[1][3]=T.TREE;m[1][4]=T.TREE;m[1][10]=T.TREE;m[1][11]=T.TREE;m[1][12]=T.TREE;m[1][13]=T.TREE;m[1][14]=T.TREE;
  m[2][1]=T.TREE;m[2][2]=T.TREE;m[2][3]=T.TREE;m[2][12]=T.TREE;m[2][13]=T.TREE;m[2][14]=T.TREE;
  m[3][1]=T.TREE;m[3][2]=T.TREE;m[3][13]=T.TREE;m[3][14]=T.TREE;
  m[9][1]=T.TREE;m[9][2]=T.TREE;m[9][3]=T.TREE;m[9][12]=T.TREE;m[9][13]=T.TREE;m[9][14]=T.TREE;
  m[10][1]=T.TREE;m[10][2]=T.TREE;m[10][3]=T.TREE;m[10][4]=T.TREE;m[10][10]=T.TREE;m[10][11]=T.TREE;m[10][12]=T.TREE;m[10][13]=T.TREE;m[10][14]=T.TREE;
  // Swamp water around the entrance
  m[3][4]=T.WATER;m[3][5]=T.WATER;m[4][3]=T.WATER;m[4][4]=T.WATER;
  m[8][10]=T.WATER;m[8][11]=T.WATER;m[8][12]=T.WATER;m[7][11]=T.WATER;m[7][12]=T.WATER;
  m[3][10]=T.WATER;m[3][11]=T.WATER;
  // D3 Shadow Keep entrance
  m[5][7]=T.ENTRANCE;m[5][8]=T.ENTRANCE;m[6][7]=T.ENTRANCE;m[6][8]=T.ENTRANCE;
  m[4][6]=T.ROCK;m[4][9]=T.ROCK;m[7][6]=T.ROCK;m[7][9]=T.ROCK;
  // Paths to entrance
  m[4][7]=T.PATH;m[4][8]=T.PATH;m[7][7]=T.PATH;m[7][8]=T.PATH;
  m[8][7]=T.PATH;m[8][8]=T.PATH;m[8][9]=T.PATH;
  // Torches marking the dungeon
  m[3][6]=T.TORCH;m[3][9]=T.TORCH;m[8][5]=T.TORCH;m[8][10]=T.TORCH;
  m[2][7]=T.TORCH;m[2][8]=T.TORCH;
  m[5][4]=T.TALLGRASS;m[5][5]=T.TALLGRASS;m[6][10]=T.TALLGRASS;m[6][11]=T.TALLGRASS;
  oe(m,"N");return m;})(),

};
