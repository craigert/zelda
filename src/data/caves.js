import { T, TL, CO, RO } from '../constants.js';
import { mr, ae } from '../utils/map-helpers.js';

// Hidden caves — overworld entrances that lead to small treasure rooms
export const CAVES=[
  // Mossy Cavern — 2-room cave with enemies guarding heart piece
  {s:"1,0",t:[[2,3]],style:{color:"#0a120a",wc:"#2a4a2a",fc:"#1a2a1a",name:"Mossy Cavern"},rooms:{
    "0,0":{tiles:mr(m=>{ae(m,["N"]);m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;
      m[4][5]=T.RUPEE;m[4][10]=T.RUPEE;m[6][5]=T.RUPEE;m[6][10]=T.RUPEE;
      m[3][6]=T.TORCH;m[3][9]=T.TORCH;m[8][6]=T.TORCH;m[8][9]=T.TORCH;
      // Rock obstacles
      m[5][4]=T.WALL;m[5][11]=T.WALL;m[6][4]=T.WALL;m[6][11]=T.WALL;
    }),enemies:[{x:6*TL,y:5*TL,hp:3,type:"bat"},{x:9*TL,y:6*TL,hp:3,type:"bat"}]},
    "0,-1":{tiles:mr(m=>{ae(m,["S"]);
      m[5][7]=T.HEART_PIECE;m[5][8]=T.HEART;
      m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[7][5]=T.TORCH;m[7][10]=T.TORCH;
      m[4][7]=T.RUPEE;m[4][8]=T.RUPEE;m[6][7]=T.RUPEE;m[6][8]=T.RUPEE;
    }),enemies:[]},
  }},
  {s:"3,0",t:[[10,4]],room:{tiles:mr(m=>{m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[5][7]=T.KEY;m[5][8]=T.HEART;m[6][7]=T.BOMB;m[6][8]=T.BOMB;m[3][7]=T.TORCH;m[8][7]=T.TORCH;}),enemies:[]}},
  // Undergrove — 3-room cave with skeleton guardians
  {s:"0,2",t:[[8,8]],style:{color:"#0c0c08",wc:"#3a3a28",fc:"#1e1e14",name:"Undergrove"},rooms:{
    "0,0":{tiles:mr(m=>{ae(m,["N"]);m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;
      m[3][4]=T.WALL;m[3][11]=T.WALL;m[7][4]=T.WALL;m[7][11]=T.WALL;
      m[5][3]=T.WALL;m[5][12]=T.WALL;m[6][3]=T.WALL;m[6][12]=T.WALL;
      m[2][5]=T.TORCH;m[2][10]=T.TORCH;m[9][5]=T.TORCH;m[9][10]=T.TORCH;
    }),enemies:[{x:5*TL,y:5*TL,hp:3,type:"skeleton"},{x:10*TL,y:6*TL,hp:3,type:"skeleton"}]},
    "0,-1":{tiles:mr(m=>{ae(m,["S","E"]);
      // Narrow corridor with spikes
      for(let y=2;y<=9;y++){m[y][1]=T.WALL;m[y][2]=T.WALL;m[y][13]=T.WALL;m[y][14]=T.WALL;}
      m[4][5]=T.SPIKE;m[4][10]=T.SPIKE;m[7][6]=T.SPIKE;m[7][9]=T.SPIKE;
      m[3][7]=T.TORCH;m[8][7]=T.TORCH;
    }),enemies:[{x:7*TL,y:5*TL,hp:4,type:"skeleton"}]},
    "1,-1":{tiles:mr(m=>{ae(m,["W"]);
      m[4][7]=T.HEART;m[5][7]=T.HEART;m[5][8]=T.HEART;
      m[6][7]=T.BOMB;m[6][8]=T.BOMB;m[6][9]=T.BOMB;
      m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[7][5]=T.TORCH;m[7][10]=T.TORCH;
    }),enemies:[]},
  }},
  {s:"1,2",t:[[3,9]],room:{tiles:mr(m=>{m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[5][6]=T.KEY;m[5][7]=T.KEY;m[5][8]=T.HEART;m[5][9]=T.HEART;m[4][7]=T.TORCH;m[7][7]=T.TORCH;}),enemies:[]}},
  {s:"-1,-1",t:[[4,5]],room:{tiles:mr(m=>{m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[5][7]=T.HEART_PIECE;m[5][6]=T.HEART;m[5][9]=T.BOMB;m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[7][5]=T.TORCH;m[7][10]=T.TORCH;}),enemies:[]}},
  // Yeti's Lair — 3-room ice cave, banana at the end
  {s:"4,-1",t:[[4,8]],style:{color:"#0a0e14",wc:"#3a4a5a",fc:"#1a2a3a",name:"Yeti's Lair"},rooms:{
    "0,0":{tiles:mr(m=>{ae(m,["N"]);m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;
      // Icy floor patches
      m[5][5]=T.ICE;m[5][6]=T.ICE;m[5][9]=T.ICE;m[5][10]=T.ICE;
      m[6][5]=T.ICE;m[6][6]=T.ICE;m[6][9]=T.ICE;m[6][10]=T.ICE;
      m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[8][5]=T.TORCH;m[8][10]=T.TORCH;
    }),enemies:[{x:5*TL,y:4*TL,hp:6,type:"yeti"}]},
    "0,-1":{tiles:mr(m=>{ae(m,["S","N"]);
      // Ice corridor with wall pillars
      m[3][3]=T.WALL;m[3][4]=T.WALL;m[3][11]=T.WALL;m[3][12]=T.WALL;
      m[7][3]=T.WALL;m[7][4]=T.WALL;m[7][11]=T.WALL;m[7][12]=T.WALL;
      for(let x=5;x<=10;x++){m[4][x]=T.ICE;m[5][x]=T.ICE;m[6][x]=T.ICE;m[7][x]=T.ICE;}
      m[2][7]=T.TORCH;m[9][7]=T.TORCH;
    }),enemies:[{x:6*TL,y:5*TL,hp:6,type:"yeti"},{x:9*TL,y:6*TL,hp:6,type:"yeti"}]},
    "0,-2":{tiles:mr(m=>{ae(m,["S"]);
      m[5][7]=T.BANANA;m[4][7]=T.RUPEE;m[6][7]=T.RUPEE;m[4][8]=T.RUPEE;m[6][8]=T.RUPEE;
      m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[7][5]=T.TORCH;m[7][10]=T.TORCH;
    }),enemies:[{x:7*TL,y:6*TL,hp:14,type:"yeti"},{x:4*TL,y:4*TL,hp:8,type:"yeti"},{x:10*TL,y:8*TL,hp:8,type:"yeti"}]},
  }},
  {s:"2,0",t:[[12,8]],shop:true,room:{tiles:mr(m=>{m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[2][5]=T.TORCH;m[2][10]=T.TORCH;m[8][5]=T.TORCH;m[8][10]=T.TORCH;for(let x=5;x<=10;x++)m[4][x]=T.WALL;}),enemies:[]}},
  {s:"4,0",t:[[5,8]],room:{tiles:mr(m=>{m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[5][7]=T.JAR;m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[7][5]=T.TORCH;m[7][10]=T.TORCH;m[4][7]=T.RUPEE;m[6][7]=T.RUPEE;m[4][8]=T.RUPEE;m[6][8]=T.RUPEE;}),enemies:[]}},
  // Hollow Depths — 2-room cave with ghost guardians
  {s:"-1,1",t:[[12,8]],style:{color:"#0a0a10",wc:"#2a2a3a",fc:"#161620",name:"Hollow Depths"},rooms:{
    "0,0":{tiles:mr(m=>{ae(m,["N"]);m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;
      m[4][4]=T.WALL;m[4][11]=T.WALL;m[7][4]=T.WALL;m[7][11]=T.WALL;
      m[5][3]=T.WALL;m[6][3]=T.WALL;m[5][12]=T.WALL;m[6][12]=T.WALL;
      m[3][6]=T.TORCH;m[3][9]=T.TORCH;m[8][6]=T.TORCH;m[8][9]=T.TORCH;
      m[5][7]=T.RUPEE;m[5][8]=T.RUPEE;m[6][7]=T.RUPEE;m[6][8]=T.RUPEE;
    }),enemies:[{x:6*TL,y:5*TL,hp:4,type:"ghost"},{x:9*TL,y:6*TL,hp:4,type:"ghost"}]},
    "0,-1":{tiles:mr(m=>{ae(m,["S"]);
      m[5][7]=T.HEART_PIECE;m[4][6]=T.RUPEE;m[4][9]=T.RUPEE;m[6][6]=T.RUPEE;m[6][9]=T.RUPEE;
      m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[7][5]=T.TORCH;m[7][10]=T.TORCH;
    }),enemies:[]},
  }},
  {s:"2,1",t:[[3,9]],room:{tiles:mr(m=>{m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[4][7]=T.BOMB;m[4][8]=T.BOMB;m[5][7]=T.HEART;m[5][8]=T.HEART;m[6][7]=T.RUPEE;m[6][8]=T.RUPEE;m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[8][5]=T.TORCH;m[8][10]=T.TORCH;}),enemies:[]}},
  // Shadow Grotto — dark winding corridors with pits, heart piece at the end
  {s:"3,1",t:[[12,5]],style:{color:"#0a0a12",wc:"#2a2a3a",fc:"#151520",name:"Shadow Grotto",th:"shadow"},rooms:{
    // Room 1 — dark entry corridor, winding path over pits
    "0,0":{dark:true,tiles:mr(m=>{ae(m,["N"]);
      m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;
      // Fill interior with pits
      for(let y=1;y<=10;y++)for(let x=1;x<=CO-2;x++)m[y][x]=T.PIT;
      // Winding path: bottom center → left → up → right → up → exit north
      // Segment 1: from stairs up through center
      for(let x=6;x<=9;x++){m[10][x]=T.FLOOR;m[9][x]=T.FLOOR;}
      // Segment 2: left corridor
      for(let x=2;x<=6;x++){m[8][x]=T.FLOOR;m[7][x]=T.FLOOR;}
      // Segment 3: up left side
      for(let y=5;y<=7;y++){m[y][2]=T.FLOOR;m[y][3]=T.FLOOR;}
      // Segment 4: across middle
      for(let x=3;x<=11;x++){m[4][x]=T.FLOOR;m[5][x]=T.FLOOR;}
      // Segment 5: up right side
      for(let y=2;y<=4;y++){m[y][11]=T.FLOOR;m[y][12]=T.FLOOR;}
      // Segment 6: to north exit
      for(let x=7;x<=12;x++){m[1][x]=T.FLOOR;m[2][x]=T.FLOOR;}
      // Sparse torches
      m[9][7]=T.TORCH;m[7][3]=T.TORCH;m[4][7]=T.TORCH;m[2][11]=T.TORCH;
    }),enemies:[{x:3*TL,y:7*TL,hp:5,type:"ghost"},{x:8*TL,y:4*TL,hp:5,type:"ghost"}]},
    // Room 2 — deeper dark corridor, tighter with more pits
    "0,-1":{dark:true,tiles:mr(m=>{ae(m,["S","N"]);
      // Fill interior with pits
      for(let y=1;y<=10;y++)for(let x=1;x<=CO-2;x++)m[y][x]=T.PIT;
      // Winding path: south entrance → right → up → left → up → right → north exit
      // From south entrance
      for(let x=6;x<=9;x++){m[10][x]=T.FLOOR;m[9][x]=T.FLOOR;}
      // Right corridor
      for(let x=9;x<=13;x++){m[8][x]=T.FLOOR;m[9][x]=T.FLOOR;}
      // Up right side
      for(let y=5;y<=8;y++){m[y][12]=T.FLOOR;m[y][13]=T.FLOOR;}
      // Across to left
      for(let x=3;x<=12;x++){m[5][x]=T.FLOOR;m[4][x]=T.FLOOR;}
      // Up left side
      for(let y=2;y<=4;y++){m[y][2]=T.FLOOR;m[y][3]=T.FLOOR;}
      // To north exit
      for(let x=3;x<=8;x++){m[1][x]=T.FLOOR;m[2][x]=T.FLOOR;}
      // Sparse torches
      m[9][8]=T.TORCH;m[8][12]=T.TORCH;m[5][7]=T.TORCH;m[2][4]=T.TORCH;
    }),enemies:[{x:12*TL,y:6*TL,hp:6,type:"ghost"},{x:5*TL,y:4*TL,hp:6,type:"ghost"},{x:3*TL,y:2*TL,hp:5,type:"bat"}]},
    // Room 3 — small lit reward room
    "0,-2":{tiles:mr(m=>{ae(m,["S"]);
      m[3][6]=T.TORCH;m[3][9]=T.TORCH;m[8][6]=T.TORCH;m[8][9]=T.TORCH;
      m[5][7]=T.HEART_PIECE;m[5][8]=T.HEART;
      m[4][7]=T.RUPEE;m[4][8]=T.RUPEE;m[6][7]=T.RUPEE;m[6][8]=T.RUPEE;
    }),enemies:[]},
  }},
];
