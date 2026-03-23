import { T, TL, CO, RO } from '../constants.js';
import { mr, ae } from '../utils/map-helpers.js';

// ═══════════════════════════════════════════════════════════════
// DUNGEON 1 — Forest Temple (15 rooms)
// ═══════════════════════════════════════════════════════════════
const d1={name:"Forest Temple",color:"#1a3020",wc:"#3a6a3a",fc:"#2a4a28",th:"forest",rooms:{

  // Entry room — stairs up, exits N and E
  "0,0":{tiles:mr(m=>{ae(m,["N","E"]);
    m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;
    for(let y=8;y<11;y++){m[y][3]=T.WALL;m[y][12]=T.WALL;}
    m[3][3]=T.WALL;m[3][4]=T.WALL;m[3][11]=T.WALL;m[3][12]=T.WALL;
    m[5][5]=T.PIT;m[5][10]=T.PIT;m[6][5]=T.PIT;m[6][10]=T.PIT;
    m[5][3]=T.TORCH;m[5][12]=T.TORCH;
    m[5][7]=T.PUSH;m[6][7]=T.PLATE;
  }),enemies:[{x:6*TL,y:4*TL,hp:2,type:"skeleton"},{x:9*TL,y:7*TL,hp:2,type:"skeleton"}]},

  // East wing — spike corridor with key
  "1,0":{tiles:mr(m=>{ae(m,["W","N"]);
    for(let x=8;x<=12;x++){m[2][x]=T.WALL;m[3][x]=T.WALL;}
    for(let y=2;y<=6;y++)m[y][8]=T.WALL;
    m[8][4]=T.SPIKE;m[8][5]=T.SPIKE;m[8][6]=T.SPIKE;m[8][9]=T.SPIKE;m[8][10]=T.SPIKE;m[8][11]=T.SPIKE;
    m[5][4]=T.KEY;m[9][12]=T.HEART;m[4][2]=T.TORCH;m[7][13]=T.TORCH;
  }),enemies:[{x:4*TL,y:5*TL,hp:3,type:"skeleton"},{x:11*TL,y:8*TL,hp:3,type:"skeleton"},{x:6*TL,y:7*TL,hp:2,type:"bat"},{x:12*TL,y:5*TL,hp:2,type:"bat"}]},

  // East wing upper — lever puzzle room
  "1,-1":{tiles:mr(m=>{ae(m,["S","E"]);
    for(let y=2;y<=4;y++){m[y][4]=T.WALL;m[y][11]=T.WALL;}
    for(let y=7;y<=9;y++){m[y][4]=T.WALL;m[y][11]=T.WALL;}
    m[5][6]=T.PUSH;m[5][9]=T.PUSH;m[6][7]=T.PLATE;m[6][8]=T.PLATE;
    m[3][7]=T.KEY;
    m[5][CO-1]=T.CRACK;m[6][CO-1]=T.CRACK;
    m[2][2]=T.TORCH;m[2][13]=T.TORCH;m[9][2]=T.TORCH;m[9][13]=T.TORCH;
  }),enemies:[{x:6*TL,y:3*TL,hp:3,type:"bat"},{x:9*TL,y:3*TL,hp:3,type:"bat"},{x:7*TL,y:8*TL,hp:3,type:"skeleton"}]},

  // Secret room — MASTER_KEY (bomb crack wall from 1,-1 east)
  "2,-1":{tiles:mr(m=>{
    m[5][0]=T.FLOOR;m[6][0]=T.FLOOR;
    for(let y=3;y<=8;y++){m[y][4]=T.WALL;m[y][11]=T.WALL;}
    m[5][4]=T.FLOOR;m[6][4]=T.FLOOR;m[5][11]=T.FLOOR;m[6][11]=T.FLOOR;
    m[5][7]=T.MASTER_KEY;
    m[3][7]=T.TORCH;m[8][7]=T.TORCH;m[3][5]=T.TORCH;m[3][10]=T.TORCH;
    m[8][5]=T.TORCH;m[8][10]=T.TORCH;
    m[4][6]=T.RUPEE;m[4][9]=T.RUPEE;m[7][6]=T.RUPEE;m[7][9]=T.RUPEE;
  }),enemies:[]},

  // East far room — spike gauntlet with heart piece crack wall
  "2,-1b":{tiles:mr(m=>{ae(m,["W"]);
    for(let y=2;y<=9;y++)for(let x=3;x<=12;x++)m[y][x]=T.ICE;
    m[3][5]=T.PUSH;m[3][10]=T.PUSH;m[7][7]=T.PUSH;
    m[5][4]=T.PLATE;m[6][11]=T.PLATE;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;m[4][3]=T.WALL;m[7][12]=T.WALL;
    m[8][7]=T.KEY;
  }),enemies:[{x:6*TL,y:4*TL,hp:2,type:"bat"},{x:10*TL,y:7*TL,hp:2,type:"bat"}]},

  // Central north — pit maze with bridges
  "0,-1":{tiles:mr(m=>{ae(m,["S","N","E"]);
    for(let y=3;y<=8;y++)for(let x=2;x<=13;x++)m[y][x]=T.PIT;
    for(let y=3;y<=8;y++){m[y][5]=T.FLOOR;m[y][10]=T.FLOOR;}
    m[5][5]=T.FLOOR;m[5][6]=T.FLOOR;m[5][7]=T.FLOOR;m[5][8]=T.FLOOR;m[5][9]=T.FLOOR;m[5][10]=T.FLOOR;
    m[6][5]=T.FLOOR;m[6][6]=T.FLOOR;m[6][7]=T.FLOOR;m[6][8]=T.FLOOR;m[6][9]=T.FLOOR;m[6][10]=T.FLOOR;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;
    m[RO-1][5]=T.CRACK;m[RO-1][6]=T.CRACK;
  }),enemies:[{x:5*TL,y:4*TL,hp:2,type:"bat"},{x:10*TL,y:4*TL,hp:2,type:"bat"},{x:7*TL,y:7*TL,hp:3,type:"skeleton"}]},

  // East of pit maze — lever and plate room
  "1,-1b":{tiles:mr(m=>{ae(m,["W"]);
    m[3][3]=T.WALL;m[3][4]=T.WALL;m[3][11]=T.WALL;m[3][12]=T.WALL;
    m[8][3]=T.WALL;m[8][4]=T.WALL;m[8][11]=T.WALL;m[8][12]=T.WALL;
    m[5][7]=T.LEVER;m[6][8]=T.PLATE;
    m[4][6]=T.PIT;m[4][9]=T.PIT;m[7][6]=T.PIT;m[7][9]=T.PIT;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;m[9][12]=T.HEART;
  }),enemies:[{x:5*TL,y:5*TL,hp:3,type:"skeleton"},{x:10*TL,y:6*TL,hp:3,type:"skeleton"}]},

  // North corridor — spiked hallway
  "0,-2":{tiles:mr(m=>{ae(m,["S","N","W"]);
    for(let y=2;y<=9;y++){m[y][3]=T.WALL;m[y][12]=T.WALL;}
    m[5][3]=T.FLOOR;m[6][3]=T.FLOOR;
    m[4][5]=T.SPIKE;m[4][10]=T.SPIKE;m[7][5]=T.SPIKE;m[7][10]=T.SPIKE;
    m[4][7]=T.PIT;m[4][8]=T.PIT;m[7][7]=T.PIT;m[7][8]=T.PIT;
    m[9][7]=T.HEART;m[2][4]=T.TORCH;m[2][11]=T.TORCH;
  }),enemies:[{x:7*TL,y:3*TL,hp:3,type:"bat"},{x:8*TL,y:6*TL,hp:3,type:"skeleton"},{x:7*TL,y:9*TL,hp:3,type:"bat"}]},

  // West wing — dark room with torches
  "-1,-2":{tiles:mr(m=>{ae(m,["E","N"]);
    for(let y=3;y<=8;y++){m[y][3]=T.PIT;m[y][12]=T.PIT;}
    m[3][6]=T.WALL;m[3][9]=T.WALL;m[8][6]=T.WALL;m[8][9]=T.WALL;
    m[5][5]=T.TORCH;m[5][10]=T.TORCH;m[6][5]=T.TORCH;m[6][10]=T.TORCH;
    m[5][7]=T.KEY;m[6][8]=T.RUPEE;
    m[RO-1][5]=T.CRACK;m[RO-1][6]=T.CRACK;
  }),enemies:[{x:7*TL,y:4*TL,hp:3,type:"bat"},{x:7*TL,y:7*TL,hp:3,type:"bat"},{x:4*TL,y:6*TL,hp:3,type:"skeleton"}]},

  // HEART_PIECE secret room (bomb south wall of -1,-2)
  "-1,-1":{tiles:mr(m=>{
    m[0][5]=T.FLOOR;m[0][6]=T.FLOOR;
    m[5][7]=T.HEART_PIECE;
    m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[8][5]=T.TORCH;m[8][10]=T.TORCH;
    m[4][6]=T.RUPEE;m[4][9]=T.RUPEE;m[7][6]=T.RUPEE;m[7][9]=T.RUPEE;
    m[6][7]=T.HEART;m[6][8]=T.HEART;
  }),enemies:[]},

  // Northwest passage — push block puzzle
  "-1,-3":{tiles:mr(m=>{ae(m,["S"]);
    m[3][4]=T.WALL;m[3][5]=T.WALL;m[3][10]=T.WALL;m[3][11]=T.WALL;
    m[5][6]=T.PUSH;m[5][9]=T.PUSH;m[7][7]=T.PUSH;
    m[4][7]=T.PLATE;m[4][8]=T.PLATE;m[8][7]=T.PLATE;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;
    m[9][3]=T.BOMB;m[9][4]=T.BOMB;m[9][12]=T.HEART;
  }),enemies:[{x:5*TL,y:6*TL,hp:3,type:"skeleton"},{x:10*TL,y:6*TL,hp:3,type:"skeleton"}]},

  // North chamber — key guarded by enemies
  "0,-3":{tiles:mr(m=>{ae(m,["S","NB"]);
    m[3][4]=T.WALL;m[3][11]=T.WALL;m[8][4]=T.WALL;m[8][11]=T.WALL;
    m[5][3]=T.PIT;m[6][3]=T.PIT;m[5][12]=T.PIT;m[6][12]=T.PIT;
    m[4][7]=T.TORCH;m[4][8]=T.TORCH;m[7][7]=T.TORCH;m[7][8]=T.TORCH;
    m[5][7]=T.KEY;m[9][5]=T.LEVER;
  }),enemies:[{x:6*TL,y:5*TL,hp:4,type:"skeleton"},{x:9*TL,y:5*TL,hp:4,type:"skeleton"},{x:7*TL,y:8*TL,hp:3,type:"bat"}]},

  // Dungeon south treasure (bomb south wall of 0,-1)
  "0,1":{tiles:mr(m=>{
    m[0][5]=T.FLOOR;m[0][6]=T.FLOOR;
    m[5][5]=T.RUPEE;m[5][6]=T.HEART;m[5][7]=T.BOMB;m[5][8]=T.BOMB;m[5][9]=T.HEART;m[5][10]=T.RUPEE;
    m[3][4]=T.TORCH;m[3][11]=T.TORCH;m[7][4]=T.TORCH;m[7][11]=T.TORCH;
  }),enemies:[]},

  // Spike arena — pre-boss warm-up
  "0,-3b":{tiles:mr(m=>{ae(m,["S"]);
    for(let x=3;x<=12;x++){m[3][x]=T.SPIKE;m[8][x]=T.SPIKE;}
    m[5][4]=T.SPIKE;m[5][11]=T.SPIKE;m[6][4]=T.SPIKE;m[6][11]=T.SPIKE;
    m[5][7]=T.FLOOR;m[5][8]=T.FLOOR;m[6][7]=T.FLOOR;m[6][8]=T.FLOOR;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;m[2][3]=T.TORCH;m[2][12]=T.TORCH;
    m[4][7]=T.HEART;
  }),enemies:[{x:7*TL,y:5*TL,hp:4,type:"skeleton"},{x:8*TL,y:6*TL,hp:4,type:"skeleton"},{x:5*TL,y:5*TL,hp:3,type:"bat"},{x:10*TL,y:6*TL,hp:3,type:"bat"}]},

  // BOSS ROOM — Forest Guardian
  "0,-4":{tiles:mr(m=>{
    m[RO-1][7]=T.BOSS_DOOR;m[RO-1][8]=T.BOSS_DOOR;
    // Spike cross columns
    for(let y=2;y<=9;y++){m[y][4]=T.SPIKE;m[y][11]=T.SPIKE;}
    for(let x=2;x<=13;x++){m[5][x]=T.SPIKE;m[6][x]=T.SPIKE;}
    // Floor islands
    m[5][4]=T.FLOOR;m[6][4]=T.FLOOR;m[5][11]=T.FLOOR;m[6][11]=T.FLOOR;
    m[5][7]=T.FLOOR;m[5][8]=T.FLOOR;m[6][7]=T.FLOOR;m[6][8]=T.FLOOR;
    for(let y=3;y<=4;y++)for(let x=6;x<=9;x++)m[y][x]=T.FLOOR;
    for(let y=7;y<=8;y++)for(let x=6;x<=9;x++)m[y][x]=T.FLOOR;
    m[3][7]=T.FLOOR;m[3][8]=T.FLOOR;m[8][7]=T.FLOOR;m[8][8]=T.FLOOR;
    // Pit borders
    m[2][2]=T.PIT;m[2][3]=T.PIT;m[2][12]=T.PIT;m[2][13]=T.PIT;
    m[9][2]=T.PIT;m[9][3]=T.PIT;m[9][12]=T.PIT;m[9][13]=T.PIT;
    // Torches — light islands
    m[3][3]=T.TORCH;m[3][12]=T.TORCH;m[8][3]=T.TORCH;m[8][12]=T.TORCH;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;
    // Triforce reward
    m[2][8]=T.TRIFORCE;
  }),enemies:[{x:7.5*TL,y:5*TL,hp:12,type:"boss",name:"Forest Guardian",pattern:"charge"}]},
}};

// ═══════════════════════════════════════════════════════════════
// DUNGEON 2 — Fire Cavern (14 rooms)
// ═══════════════════════════════════════════════════════════════
const d2={name:"Fire Cavern",color:"#2a1510",wc:"#6a3a2a",fc:"#4a2218",th:"fire",rooms:{

  // Entry room — lava pits flanking path
  "0,1":{tiles:mr(m=>{ae(m,["N","E"]);
    m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;
    for(let y=3;y<=8;y++){m[y][2]=T.PIT;m[y][3]=T.PIT;m[y][12]=T.PIT;m[y][13]=T.PIT;}
    m[5][6]=T.SPIKE;m[5][9]=T.SPIKE;m[6][6]=T.SPIKE;m[6][9]=T.SPIKE;
    m[3][2]=T.TORCH;m[3][13]=T.TORCH;m[8][5]=T.TORCH;m[8][10]=T.TORCH;
  }),enemies:[{x:5*TL,y:5*TL,hp:3,type:"fire_bat"},{x:10*TL,y:5*TL,hp:3,type:"fire_bat"}]},

  // East of entry — zigzag spike room
  "1,1":{tiles:mr(m=>{ae(m,["W","N"]);
    for(let x=3;x<=7;x++)m[3][x]=T.WALL;for(let x=8;x<=12;x++)m[5][x]=T.WALL;
    for(let x=3;x<=7;x++)m[7][x]=T.WALL;for(let x=8;x<=12;x++)m[9][x]=T.WALL;
    m[4][6]=T.SPIKE;m[4][7]=T.SPIKE;m[6][9]=T.SPIKE;m[6][10]=T.SPIKE;m[8][6]=T.SPIKE;m[8][7]=T.SPIKE;
    m[4][10]=T.KEY;m[2][7]=T.TORCH;
  }),enemies:[{x:10*TL,y:3*TL,hp:3,type:"fire_bat"},{x:5*TL,y:6*TL,hp:3,type:"fire_bat"},{x:10*TL,y:8*TL,hp:3,type:"skeleton"}]},

  // Upper east — timed switch room
  "1,0":{tiles:mr(m=>{ae(m,["S"]);
    for(let y=2;y<=9;y++){m[y][5]=T.WALL;m[y][10]=T.WALL;}
    m[5][5]=T.FLOOR;m[6][5]=T.FLOOR;m[5][10]=T.FLOOR;m[6][10]=T.FLOOR;
    m[3][3]=T.SPIKE;m[3][12]=T.SPIKE;m[8][3]=T.SPIKE;m[8][12]=T.SPIKE;
    m[3][7]=T.HEART;m[8][8]=T.KEY;
    m[5][CO-1]=T.CRACK;m[6][CO-1]=T.CRACK;
    m[2][2]=T.TORCH;m[2][13]=T.TORCH;
  }),enemies:[{x:2*TL,y:3*TL,hp:4,type:"fire_bat"},{x:2*TL,y:8*TL,hp:4,type:"fire_bat"},{x:13*TL,y:3*TL,hp:4,type:"skeleton"},{x:13*TL,y:8*TL,hp:4,type:"skeleton"}]},

  // HEART_PIECE secret (crack east wall of 1,0)
  "2,0":{tiles:mr(m=>{
    m[5][0]=T.FLOOR;m[6][0]=T.FLOOR;
    m[5][7]=T.HEART_PIECE;
    m[4][7]=T.HEART;m[6][7]=T.BOMB;m[6][8]=T.BOMB;
    m[3][6]=T.TORCH;m[3][9]=T.TORCH;m[8][6]=T.TORCH;m[8][9]=T.TORCH;
  }),enemies:[]},

  // Central hub — push block puzzle
  "0,0":{tiles:mr(m=>{ae(m,["S","E","W"]);m[0][7]=T.DOOR;m[0][8]=T.DOOR;
    m[4][5]=T.PIT;m[4][6]=T.PIT;m[4][9]=T.PIT;m[4][10]=T.PIT;
    m[7][5]=T.PIT;m[7][6]=T.PIT;m[7][9]=T.PIT;m[7][10]=T.PIT;
    m[5][4]=T.WALL;m[6][4]=T.WALL;m[5][11]=T.WALL;m[6][11]=T.WALL;
    m[5][7]=T.PUSH;m[6][8]=T.PUSH;m[3][7]=T.PLATE;m[8][8]=T.PLATE;
    m[2][3]=T.TORCH;m[2][12]=T.TORCH;m[9][3]=T.TORCH;m[9][12]=T.TORCH;
  }),enemies:[{x:3*TL,y:3*TL,hp:3,type:"skeleton"},{x:12*TL,y:3*TL,hp:3,type:"skeleton"},{x:7*TL,y:8*TL,hp:3,type:"fire_bat"}]},

  // East of hub — divided chambers
  "1,0b":{tiles:mr(m=>{ae(m,["W"]);
    for(let y=2;y<=9;y++)m[y][7]=T.WALL;
    m[5][7]=T.FLOOR;m[6][7]=T.FLOOR;
    m[3][4]=T.SPIKE;m[3][10]=T.SPIKE;m[8][4]=T.SPIKE;m[8][10]=T.SPIKE;
    m[5][4]=T.KEY;m[6][11]=T.HEART;
    m[2][3]=T.TORCH;m[2][12]=T.TORCH;m[9][3]=T.TORCH;m[9][12]=T.TORCH;
  }),enemies:[{x:4*TL,y:5*TL,hp:4,type:"fire_bat"},{x:11*TL,y:5*TL,hp:4,type:"fire_bat"}]},

  // West branch — first locked door
  "-1,0":{tiles:mr(m=>{ae(m,["E","WD"]);
    m[3][3]=T.SPIKE;m[3][6]=T.SPIKE;m[3][9]=T.SPIKE;m[3][12]=T.SPIKE;
    m[5][4]=T.SPIKE;m[5][7]=T.SPIKE;m[5][10]=T.SPIKE;
    m[7][3]=T.SPIKE;m[7][6]=T.SPIKE;m[7][9]=T.SPIKE;m[7][12]=T.SPIKE;
    m[5][13]=T.HEART;m[2][2]=T.TORCH;m[2][13]=T.TORCH;
    m[8][7]=T.KEY;
  }),enemies:[{x:3*TL,y:5*TL,hp:4,type:"fire_bat"},{x:12*TL,y:5*TL,hp:4,type:"fire_bat"}]},

  // MASTER_KEY room — behind second locked door, timed switch puzzle
  "-2,0":{tiles:mr(m=>{
    m[5][CO-1]=T.DOOR;m[6][CO-1]=T.DOOR;
    m[3][3]=T.TSWITCH;m[3][12]=T.TSWITCH;
    for(let x=4;x<=11;x++){m[5][x]=T.SPIKE;m[6][x]=T.SPIKE;}
    m[5][7]=T.FLOOR;m[5][8]=T.FLOOR;m[6][7]=T.FLOOR;m[6][8]=T.FLOOR;
    m[8][7]=T.MASTER_KEY;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;m[2][4]=T.TORCH;m[2][11]=T.TORCH;
    m[9][4]=T.TORCH;m[9][11]=T.TORCH;
    m[4][3]=T.RUPEE;m[4][12]=T.RUPEE;
  }),enemies:[{x:7*TL,y:3*TL,hp:4,type:"fire_bat"},{x:7*TL,y:8*TL,hp:4,type:"fire_bat"}]},

  // North door — lava crossing
  "0,-1":{tiles:mr(m=>{m[RO-1][7]=T.FLOOR;m[RO-1][8]=T.FLOOR;ae(m,["N","E"]);
    for(let y=2;y<=9;y++)for(let x=2;x<=13;x++)m[y][x]=T.PIT;
    for(let y=2;y<=9;y++){m[y][7]=T.FLOOR;m[y][8]=T.FLOOR;}
    m[4][4]=T.FLOOR;m[4][5]=T.FLOOR;m[4][6]=T.FLOOR;m[7][9]=T.FLOOR;m[7][10]=T.FLOOR;m[7][11]=T.FLOOR;
    m[4][4]=T.SPIKE;m[7][11]=T.SPIKE;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;
  }),enemies:[{x:7*TL,y:3*TL,hp:3,type:"fire_bat"},{x:7*TL,y:6*TL,hp:3,type:"fire_bat"},{x:7*TL,y:9*TL,hp:3,type:"skeleton"}]},

  // East of lava crossing — timed switch & ice
  "1,-1":{tiles:mr(m=>{ae(m,["W"]);
    m[9][3]=T.TSWITCH;m[9][12]=T.TSWITCH;
    for(let x=4;x<=11;x++){m[4][x]=T.SPIKE;m[7][x]=T.SPIKE;}
    m[5][5]=T.ICE;m[5][6]=T.ICE;m[5][7]=T.ICE;m[5][8]=T.ICE;m[5][9]=T.ICE;m[5][10]=T.ICE;
    m[6][5]=T.ICE;m[6][6]=T.ICE;m[6][7]=T.ICE;m[6][8]=T.ICE;m[6][9]=T.ICE;m[6][10]=T.ICE;
    m[2][7]=T.HEART;m[2][8]=T.KEY;
    m[2][5]=T.TORCH;m[2][10]=T.TORCH;m[8][5]=T.TORCH;m[8][10]=T.TORCH;
  }),enemies:[{x:7*TL,y:5*TL,hp:4,type:"fire_bat"},{x:9*TL,y:6*TL,hp:4,type:"fire_bat"}]},

  // North — pre-boss corridor with spikes
  "0,-2":{tiles:mr(m=>{ae(m,["S","WB"]);
    for(let y=2;y<=9;y++){m[y][4]=T.SPIKE;m[y][11]=T.SPIKE;}
    m[3][7]=T.WALL;m[3][8]=T.WALL;m[8][7]=T.WALL;m[8][8]=T.WALL;
    m[5][7]=T.KEY;m[6][8]=T.HEART;
    m[2][3]=T.TORCH;m[2][12]=T.TORCH;m[9][3]=T.TORCH;m[9][12]=T.TORCH;
  }),enemies:[{x:7*TL,y:5*TL,hp:4,type:"skeleton"},{x:3*TL,y:4*TL,hp:4,type:"fire_bat"},{x:12*TL,y:7*TL,hp:4,type:"fire_bat"}]},

  // BOSS ROOM — Flame Wyrm (lava moat with ice bridges)
  "-1,-2":{tiles:mr(m=>{
    m[5][CO-1]=T.BOSS_DOOR;m[6][CO-1]=T.BOSS_DOOR;
    // Lava moat
    for(let y=2;y<=9;y++)for(let x=2;x<=13;x++)m[y][x]=T.PIT;
    // Cross bridges with ice
    for(let y=2;y<=9;y++){m[y][7]=T.ICE;m[y][8]=T.ICE;}
    for(let x=2;x<=13;x++){m[5][x]=T.ICE;m[6][x]=T.ICE;}
    // Floor platforms at corners
    m[3][4]=T.FLOOR;m[3][5]=T.FLOOR;m[3][10]=T.FLOOR;m[3][11]=T.FLOOR;
    m[8][4]=T.FLOOR;m[8][5]=T.FLOOR;m[8][10]=T.FLOOR;m[8][11]=T.FLOOR;
    // Torches at corners
    m[2][3]=T.TORCH;m[2][12]=T.TORCH;m[9][3]=T.TORCH;m[9][12]=T.TORCH;
    // Triforce reward
    m[2][7]=T.TRIFORCE;
  }),enemies:[{x:7.5*TL,y:5*TL,hp:14,type:"boss",name:"Flame Wyrm",pattern:"spawn"}]},

  // South treasure (crack south wall of entry room)
  "0,2":{tiles:mr(m=>{m[0][7]=T.FLOOR;m[0][8]=T.FLOOR;
    m[4][6]=T.RUPEE;m[4][7]=T.RUPEE;m[4][8]=T.RUPEE;m[5][7]=T.KEY;m[6][7]=T.HEART;m[6][8]=T.HEART;
    m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[8][5]=T.TORCH;m[8][10]=T.TORCH;
  }),enemies:[]},

  // West far — optional lava challenge
  "-1,0b":{tiles:mr(m=>{ae(m,["E"]);
    for(let y=3;y<=8;y++)for(let x=3;x<=12;x++)m[y][x]=T.PIT;
    m[4][5]=T.FLOOR;m[4][6]=T.FLOOR;m[4][9]=T.FLOOR;m[4][10]=T.FLOOR;
    m[7][5]=T.FLOOR;m[7][6]=T.FLOOR;m[7][9]=T.FLOOR;m[7][10]=T.FLOOR;
    m[5][7]=T.FLOOR;m[6][7]=T.FLOOR;m[5][8]=T.FLOOR;m[6][8]=T.FLOOR;
    m[5][7]=T.RUPEE;m[6][8]=T.BOMB;
    m[2][3]=T.TORCH;m[2][12]=T.TORCH;m[9][3]=T.TORCH;m[9][12]=T.TORCH;
  }),enemies:[{x:5*TL,y:4*TL,hp:4,type:"fire_bat"},{x:10*TL,y:7*TL,hp:4,type:"fire_bat"}]},
}};

// ═══════════════════════════════════════════════════════════════
// DUNGEON 3 — Shadow Keep (14 rooms)
// ═══════════════════════════════════════════════════════════════
const d3={name:"Shadow Keep",color:"#12122a",wc:"#3a3a5e",fc:"#1e1e38",th:"shadow",rooms:{

  // Entry room — shadowy foyer
  "0,0":{tiles:mr(m=>{ae(m,["N","W"]);
    m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;
    for(let x=3;x<=6;x++)m[3][x]=T.WALL;for(let x=9;x<=12;x++)m[3][x]=T.WALL;
    for(let y=3;y<=6;y++)m[y][6]=T.WALL;for(let y=5;y<=8;y++)m[y][9]=T.WALL;
    m[6][3]=T.WALL;m[6][4]=T.WALL;m[8][11]=T.WALL;m[8][12]=T.WALL;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;
    m[5][CO-1]=T.CRACK;m[6][CO-1]=T.CRACK;
  }),enemies:[{x:4*TL,y:5*TL,hp:3,type:"ghost"},{x:11*TL,y:4*TL,hp:3,type:"ghost"},{x:7*TL,y:8*TL,hp:3,type:"skeleton"}]},

  // HEART_PIECE secret room (crack east wall of 0,0)
  "1,0":{tiles:mr(m=>{
    m[5][0]=T.FLOOR;m[6][0]=T.FLOOR;
    m[5][7]=T.HEART_PIECE;
    m[4][7]=T.RUPEE;m[6][7]=T.BOMB;m[6][8]=T.KEY;
    m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[8][5]=T.TORCH;m[8][10]=T.TORCH;
  }),enemies:[]},

  // West wing — pit-flanked path
  "-1,0":{tiles:mr(m=>{ae(m,["E","N"]);
    for(let y=2;y<=9;y++){m[y][2]=T.PIT;m[y][3]=T.PIT;m[y][12]=T.PIT;m[y][13]=T.PIT;}
    m[4][6]=T.SPIKE;m[4][9]=T.SPIKE;m[7][6]=T.SPIKE;m[7][9]=T.SPIKE;
    m[4][7]=T.KEY;m[7][8]=T.HEART;m[2][5]=T.TORCH;m[2][10]=T.TORCH;
  }),enemies:[{x:5*TL,y:4*TL,hp:3,type:"ghost"},{x:10*TL,y:7*TL,hp:3,type:"ghost"},{x:7*TL,y:9*TL,hp:3,type:"skeleton"}]},

  // Northwest — ghost gauntlet
  "-1,-1":{tiles:mr(m=>{ae(m,["S","E"]);
    m[3][4]=T.WALL;m[3][5]=T.WALL;m[3][10]=T.WALL;m[3][11]=T.WALL;
    m[8][4]=T.WALL;m[8][5]=T.WALL;m[8][10]=T.WALL;m[8][11]=T.WALL;
    m[5][7]=T.LEVER;m[6][8]=T.KEY;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;
  }),enemies:[{x:4*TL,y:5*TL,hp:4,type:"ghost"},{x:11*TL,y:5*TL,hp:4,type:"ghost"},{x:7*TL,y:3*TL,hp:3,type:"bat"},{x:7*TL,y:8*TL,hp:3,type:"bat"}]},

  // North — push block + lever puzzle
  "0,-1":{tiles:mr(m=>{ae(m,["S","N","E"]);m[0][7]=T.DOOR;m[0][8]=T.DOOR;
    for(let y=3;y<=5;y++)m[y][5]=T.WALL;for(let y=6;y<=8;y++)m[y][10]=T.WALL;
    m[3][8]=T.WALL;m[3][9]=T.WALL;m[8][6]=T.WALL;m[8][7]=T.WALL;
    m[4][3]=T.PIT;m[7][12]=T.PIT;
    m[5][7]=T.PUSH;m[6][8]=T.PUSH;m[4][11]=T.LEVER;m[7][4]=T.PLATE;
  }),enemies:[{x:10*TL,y:3*TL,hp:3,type:"ghost"},{x:4*TL,y:6*TL,hp:3,type:"ghost"},{x:10*TL,y:8*TL,hp:3,type:"skeleton"}]},

  // Northeast ghost room from -1,-1 east
  "0,-1b":{tiles:mr(m=>{ae(m,["W"]);
    for(let y=3;y<=4;y++)for(let x=3;x<=12;x++)m[y][x]=T.PIT;
    for(let y=7;y<=8;y++)for(let x=3;x<=12;x++)m[y][x]=T.PIT;
    m[5][5]=T.TORCH;m[5][10]=T.TORCH;m[6][5]=T.TORCH;m[6][10]=T.TORCH;
    m[5][7]=T.KEY;m[2][7]=T.HEART;
  }),enemies:[{x:7*TL,y:5*TL,hp:4,type:"ghost"},{x:9*TL,y:6*TL,hp:4,type:"ghost"}]},

  // East of north — spike corridor with key
  "1,-1":{tiles:mr(m=>{ae(m,["W"]);
    for(let y=2;y<=3;y++)for(let x=3;x<=12;x++)m[y][x]=T.WALL;
    for(let y=8;y<=9;y++)for(let x=3;x<=12;x++)m[y][x]=T.WALL;
    m[5][4]=T.SPIKE;m[5][6]=T.SPIKE;m[5][8]=T.SPIKE;m[5][10]=T.SPIKE;m[5][12]=T.SPIKE;
    m[6][3]=T.SPIKE;m[6][5]=T.SPIKE;m[6][7]=T.SPIKE;m[6][9]=T.SPIKE;m[6][11]=T.SPIKE;
    m[4][7]=T.KEY;m[7][8]=T.KEY;
    m[5][CO-1]=T.CRACK;m[6][CO-1]=T.CRACK;
  }),enemies:[{x:6*TL,y:5*TL,hp:4,type:"ghost"},{x:9*TL,y:6*TL,hp:4,type:"ghost"}]},

  // Secret room east of spike corridor — bombs and supplies
  "2,-1":{tiles:mr(m=>{
    m[5][0]=T.FLOOR;m[6][0]=T.FLOOR;
    m[5][7]=T.BOMB;m[5][8]=T.BOMB;m[6][7]=T.HEART;m[6][8]=T.HEART;
    m[4][5]=T.TORCH;m[4][10]=T.TORCH;m[7][5]=T.TORCH;m[7][10]=T.TORCH;
    m[3][7]=T.KEY;
  }),enemies:[]},

  // North depth — scattered pits with ghosts
  "0,-2":{tiles:mr(m=>{ae(m,["S","W","N"]);
    for(let y=2;y<=9;y++)for(let x=2;x<=13;x++)if((x+y)%3===0)m[y][x]=T.PIT;
    m[5][7]=T.HEART;m[5][8]=T.HEART;m[2][3]=T.TORCH;m[9][12]=T.TORCH;
  }),enemies:[{x:7*TL,y:4*TL,hp:5,type:"ghost"},{x:4*TL,y:7*TL,hp:5,type:"ghost"},{x:11*TL,y:7*TL,hp:5,type:"ghost"}]},

  // West of depth — spike+ghost gauntlet leading to master key
  "-1,-2":{tiles:mr(m=>{ae(m,["E"]);
    m[3][4]=T.WALL;m[3][5]=T.WALL;m[4][4]=T.WALL;m[3][10]=T.WALL;m[3][11]=T.WALL;m[4][11]=T.WALL;
    m[7][4]=T.WALL;m[8][4]=T.WALL;m[8][5]=T.WALL;m[7][11]=T.WALL;m[8][10]=T.WALL;m[8][11]=T.WALL;
    m[5][7]=T.SPIKE;m[5][8]=T.SPIKE;m[6][7]=T.SPIKE;m[6][8]=T.SPIKE;
    m[5][CO-1]=T.CRACK;m[6][CO-1]=T.CRACK;
    m[9][7]=T.KEY;
  }),enemies:[{x:7*TL,y:3*TL,hp:5,type:"ghost"},{x:3*TL,y:6*TL,hp:5,type:"ghost"},{x:12*TL,y:8*TL,hp:4,type:"skeleton"}]},

  // Master key room — spike gauntlet with ghost guards
  "0,-2b":{tiles:mr(m=>{
    m[5][0]=T.FLOOR;m[6][0]=T.FLOOR;
    for(let x=3;x<=12;x++){m[3][x]=T.SPIKE;m[8][x]=T.SPIKE;}
    m[5][5]=T.SPIKE;m[5][10]=T.SPIKE;m[6][5]=T.SPIKE;m[6][10]=T.SPIKE;
    m[5][7]=T.MASTER_KEY;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;m[4][4]=T.TORCH;m[4][11]=T.TORCH;
    m[7][4]=T.TORCH;m[7][11]=T.TORCH;
  }),enemies:[{x:7*TL,y:4*TL,hp:5,type:"ghost"},{x:7*TL,y:7*TL,hp:5,type:"ghost"}]},

  // Deep north — ice room
  "0,-3":{tiles:mr(m=>{ae(m,["S","W"]);
    for(let y=2;y<=9;y++)for(let x=2;x<=13;x++)m[y][x]=T.ICE;
    m[3][5]=T.WALL;m[3][10]=T.WALL;m[5][7]=T.WALL;m[5][8]=T.WALL;
    m[8][5]=T.WALL;m[8][10]=T.WALL;
    m[4][4]=T.SPIKE;m[4][11]=T.SPIKE;m[7][4]=T.SPIKE;m[7][11]=T.SPIKE;
    m[6][6]=T.TSWITCH;m[2][7]=T.HEART;m[9][8]=T.KEY;
    m[2][3]=T.TORCH;m[2][12]=T.TORCH;m[9][3]=T.TORCH;m[9][12]=T.TORCH;
  }),enemies:[{x:10*TL,y:5*TL,hp:4,type:"ghost"},{x:5*TL,y:7*TL,hp:4,type:"ghost"}]},

  // Pre-boss — west from ice room
  "-1,-3":{tiles:mr(m=>{ae(m,["E","NB"]);
    m[3][4]=T.WALL;m[3][11]=T.WALL;m[8][4]=T.WALL;m[8][11]=T.WALL;
    m[5][5]=T.SPIKE;m[5][10]=T.SPIKE;m[6][5]=T.SPIKE;m[6][10]=T.SPIKE;
    m[5][7]=T.HEART;m[5][8]=T.HEART;
    m[2][3]=T.TORCH;m[2][12]=T.TORCH;m[9][3]=T.TORCH;m[9][12]=T.TORCH;
  }),enemies:[{x:7*TL,y:4*TL,hp:5,type:"ghost"},{x:4*TL,y:7*TL,hp:5,type:"ghost"},{x:11*TL,y:7*TL,hp:5,type:"skeleton"}]},

  // BOSS ROOM — Shadow Lord (checkerboard pit + floor islands)
  "-1,-4":{tiles:mr(m=>{
    m[RO-1][7]=T.BOSS_DOOR;m[RO-1][8]=T.BOSS_DOOR;
    // Checkerboard PIT pattern
    for(let y=2;y<=9;y++)for(let x=2;x<=13;x++){
      if((x+y)%2===0)m[y][x]=T.PIT;
    }
    // Floor islands (larger platforms)
    for(let y=3;y<=4;y++)for(let x=4;x<=5;x++)m[y][x]=T.FLOOR;
    for(let y=3;y<=4;y++)for(let x=10;x<=11;x++)m[y][x]=T.FLOOR;
    for(let y=7;y<=8;y++)for(let x=4;x<=5;x++)m[y][x]=T.FLOOR;
    for(let y=7;y<=8;y++)for(let x=10;x<=11;x++)m[y][x]=T.FLOOR;
    for(let y=5;y<=6;y++)for(let x=7;x<=8;x++)m[y][x]=T.FLOOR;
    // Spike borders
    m[2][7]=T.SPIKE;m[2][8]=T.SPIKE;m[9][7]=T.SPIKE;m[9][8]=T.SPIKE;
    m[5][2]=T.SPIKE;m[6][2]=T.SPIKE;m[5][13]=T.SPIKE;m[6][13]=T.SPIKE;
    // Torches
    m[3][3]=T.TORCH;m[3][12]=T.TORCH;m[8][3]=T.TORCH;m[8][12]=T.TORCH;
    // Triforce reward
    m[2][12]=T.TRIFORCE;
  }),enemies:[{x:7.5*TL,y:5*TL,hp:16,type:"boss",name:"Shadow Lord",pattern:"teleport"}]},
}};

// ═══════════════════════════════════════════════════════════════
// DUNGEON 4 — Dark Sanctum (15 rooms)
// ═══════════════════════════════════════════════════════════════
const d4={name:"Dark Sanctum",color:"#0a0a0a",wc:"#3a1a3a",fc:"#1a0a1a",th:"shadow",rooms:{

  // Entry room — ominous foyer
  "0,0":{tiles:mr(m=>{ae(m,["N","E"]);
    m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;
    m[3][4]=T.WALL;m[3][5]=T.WALL;m[3][10]=T.WALL;m[3][11]=T.WALL;
    m[8][4]=T.WALL;m[8][5]=T.WALL;m[8][10]=T.WALL;m[8][11]=T.WALL;
    m[2][3]=T.TORCH;m[2][12]=T.TORCH;m[9][3]=T.TORCH;m[9][12]=T.TORCH;
    m[5][7]=T.PUSH;m[6][7]=T.PLATE;
  }),enemies:[{x:4*TL,y:5*TL,hp:5,type:"ghost"},{x:11*TL,y:5*TL,hp:5,type:"ghost"},{x:7*TL,y:3*TL,hp:5,type:"skeleton"},{x:7*TL,y:8*TL,hp:5,type:"skeleton"}]},

  // East wing — dark spike room
  "1,0":{tiles:mr(m=>{ae(m,["W","N"]);
    for(let y=3;y<=8;y++){m[y][4]=T.SPIKE;m[y][11]=T.SPIKE;}
    m[3][7]=T.WALL;m[3][8]=T.WALL;m[8][7]=T.WALL;m[8][8]=T.WALL;
    m[5][7]=T.KEY;m[6][8]=T.HEART;
    m[2][3]=T.TORCH;m[2][12]=T.TORCH;m[9][3]=T.TORCH;m[9][12]=T.TORCH;
    m[5][CO-1]=T.CRACK;m[6][CO-1]=T.CRACK;
  }),enemies:[{x:6*TL,y:5*TL,hp:5,type:"ghost"},{x:9*TL,y:6*TL,hp:5,type:"ghost"},{x:3*TL,y:7*TL,hp:4,type:"skeleton"}]},

  // HEART_PIECE secret (crack east wall of 1,0)
  "2,0":{tiles:mr(m=>{
    m[5][0]=T.FLOOR;m[6][0]=T.FLOOR;
    m[5][7]=T.HEART_PIECE;
    m[4][6]=T.RUPEE;m[4][9]=T.RUPEE;m[6][6]=T.BOMB;m[6][9]=T.BOMB;
    m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[8][5]=T.TORCH;m[8][10]=T.TORCH;
  }),enemies:[]},

  // East upper — ghost arena
  "1,-1":{tiles:mr(m=>{ae(m,["S","W"]);
    m[3][3]=T.WALL;m[3][4]=T.WALL;m[3][11]=T.WALL;m[3][12]=T.WALL;
    m[8][3]=T.WALL;m[8][4]=T.WALL;m[8][11]=T.WALL;m[8][12]=T.WALL;
    m[5][5]=T.PIT;m[5][10]=T.PIT;m[6][5]=T.PIT;m[6][10]=T.PIT;
    m[5][7]=T.LEVER;m[6][8]=T.KEY;
    m[5][CO-1]=T.CRACK;m[6][CO-1]=T.CRACK;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;
  }),enemies:[{x:4*TL,y:5*TL,hp:6,type:"ghost"},{x:11*TL,y:6*TL,hp:6,type:"ghost"},{x:7*TL,y:3*TL,hp:5,type:"fire_bat"}]},

  // MASTER_KEY room (crack east from 1,-1; bomb wall then fight)
  "2,-1":{tiles:mr(m=>{
    m[5][0]=T.FLOOR;m[6][0]=T.FLOOR;
    for(let x=4;x<=11;x++){m[3][x]=T.SPIKE;m[8][x]=T.SPIKE;}
    m[5][5]=T.WALL;m[5][10]=T.WALL;m[6][5]=T.WALL;m[6][10]=T.WALL;
    m[5][7]=T.MASTER_KEY;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;m[4][4]=T.TORCH;m[4][11]=T.TORCH;
    m[7][4]=T.TORCH;m[7][11]=T.TORCH;
  }),enemies:[{x:7*TL,y:4*TL,hp:8,type:"ghost"},{x:7*TL,y:7*TL,hp:8,type:"ghost"},{x:4*TL,y:5*TL,hp:6,type:"ghost"}]},

  // North room — lever & push puzzle
  "0,-1":{tiles:mr(m=>{ae(m,["S","E","W"]);m[0][7]=T.DOOR;m[0][8]=T.DOOR;
    m[3][3]=T.WALL;m[3][4]=T.WALL;m[3][11]=T.WALL;m[3][12]=T.WALL;
    m[5][5]=T.WALL;m[5][6]=T.WALL;m[5][9]=T.WALL;m[5][10]=T.WALL;
    m[8][5]=T.WALL;m[8][10]=T.WALL;
    m[6][7]=T.LEVER;m[4][7]=T.PUSH;m[7][12]=T.PUSH;
    m[7][4]=T.PLATE;m[4][11]=T.PLATE;
  }),enemies:[{x:3*TL,y:6*TL,hp:5,type:"fire_bat"},{x:12*TL,y:6*TL,hp:5,type:"fire_bat"},{x:7*TL,y:8*TL,hp:5,type:"ghost"}]},

  // West wing — ice floor challenge
  "-1,-1":{tiles:mr(m=>{ae(m,["E","N"]);
    for(let y=2;y<=9;y++)for(let x=2;x<=13;x++)m[y][x]=T.ICE;
    m[3][5]=T.WALL;m[3][10]=T.WALL;m[8][5]=T.WALL;m[8][10]=T.WALL;
    m[5][7]=T.WALL;m[6][7]=T.WALL;
    m[4][4]=T.SPIKE;m[4][11]=T.SPIKE;m[7][4]=T.SPIKE;m[7][11]=T.SPIKE;
    m[2][7]=T.HEART;m[9][8]=T.KEY;
    m[2][3]=T.TORCH;m[2][12]=T.TORCH;m[9][3]=T.TORCH;m[9][12]=T.TORCH;
  }),enemies:[{x:5*TL,y:5*TL,hp:5,type:"ghost"},{x:10*TL,y:6*TL,hp:5,type:"ghost"}]},

  // East of north — skeleton ambush
  "1,-1b":{tiles:mr(m=>{ae(m,["W"]);
    m[3][5]=T.WALL;m[3][6]=T.WALL;m[3][9]=T.WALL;m[3][10]=T.WALL;
    m[8][5]=T.WALL;m[8][6]=T.WALL;m[8][9]=T.WALL;m[8][10]=T.WALL;
    m[5][7]=T.KEY;m[6][8]=T.HEART;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;
  }),enemies:[{x:5*TL,y:5*TL,hp:6,type:"skeleton"},{x:10*TL,y:5*TL,hp:6,type:"skeleton"},{x:7*TL,y:3*TL,hp:5,type:"fire_bat"},{x:7*TL,y:8*TL,hp:5,type:"ghost"}]},

  // North depth — locked door passage
  "0,-2":{tiles:mr(m=>{m[RO-1][7]=T.FLOOR;m[RO-1][8]=T.FLOOR;ae(m,["N","E"]);
    m[3][3]=T.WALL;m[3][12]=T.WALL;m[5][5]=T.WALL;m[5][10]=T.WALL;
    m[6][5]=T.WALL;m[6][10]=T.WALL;m[8][3]=T.WALL;m[8][12]=T.WALL;
    m[5][7]=T.HEART;m[5][8]=T.HEART;m[2][7]=T.TORCH;m[9][7]=T.TORCH;
    for(let x=6;x<=9;x++){m[4][x]=T.ICE;m[7][x]=T.ICE;}
    m[9][4]=T.TSWITCH;
  }),enemies:[{x:4*TL,y:6*TL,hp:6,type:"ghost"},{x:11*TL,y:6*TL,hp:6,type:"ghost"},{x:7*TL,y:4*TL,hp:6,type:"fire_bat"},{x:7*TL,y:8*TL,hp:6,type:"skeleton"}]},

  // East of depth — timed switch & spike gauntlet
  "1,-2":{tiles:mr(m=>{ae(m,["W"]);
    m[3][4]=T.TSWITCH;m[3][11]=T.TSWITCH;
    for(let x=5;x<=10;x++){m[5][x]=T.SPIKE;m[6][x]=T.SPIKE;}
    m[5][7]=T.FLOOR;m[5][8]=T.FLOOR;m[6][7]=T.FLOOR;m[6][8]=T.FLOOR;
    m[8][7]=T.KEY;m[8][8]=T.BOMB;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;
  }),enemies:[{x:4*TL,y:5*TL,hp:6,type:"ghost"},{x:11*TL,y:6*TL,hp:6,type:"ghost"}]},

  // Northwest — ghost patrol
  "-1,-2":{tiles:mr(m=>{ae(m,["E","N"]);
    for(let y=3;y<=4;y++)for(let x=3;x<=5;x++)m[y][x]=T.PIT;
    for(let y=3;y<=4;y++)for(let x=10;x<=12;x++)m[y][x]=T.PIT;
    for(let y=7;y<=8;y++)for(let x=3;x<=5;x++)m[y][x]=T.PIT;
    for(let y=7;y<=8;y++)for(let x=10;x<=12;x++)m[y][x]=T.PIT;
    m[5][5]=T.TORCH;m[5][10]=T.TORCH;m[6][5]=T.TORCH;m[6][10]=T.TORCH;
    m[5][7]=T.KEY;m[6][8]=T.HEART;
  }),enemies:[{x:7*TL,y:3*TL,hp:6,type:"ghost"},{x:7*TL,y:8*TL,hp:6,type:"ghost"},{x:4*TL,y:5*TL,hp:5,type:"skeleton"},{x:11*TL,y:6*TL,hp:5,type:"skeleton"}]},

  // Deep north — pre-boss gauntlet
  "0,-3":{tiles:mr(m=>{ae(m,["S","NB"]);
    m[3][3]=T.WALL;m[3][12]=T.WALL;m[8][3]=T.WALL;m[8][12]=T.WALL;
    for(let x=5;x<=10;x++){m[4][x]=T.SPIKE;m[7][x]=T.SPIKE;}
    m[5][4]=T.PIT;m[5][11]=T.PIT;m[6][4]=T.PIT;m[6][11]=T.PIT;
    m[5][7]=T.HEART;m[5][8]=T.HEART;
    m[4][7]=T.TORCH;m[4][8]=T.TORCH;m[7][7]=T.TORCH;m[7][8]=T.TORCH;
  }),enemies:[{x:7*TL,y:5*TL,hp:7,type:"ghost"},{x:4*TL,y:6*TL,hp:7,type:"ghost"},{x:11*TL,y:5*TL,hp:6,type:"skeleton"}]},

  // North further — ghost corridor
  "-1,-3":{tiles:mr(m=>{ae(m,["S","E"]);
    for(let y=2;y<=9;y++){m[y][3]=T.PIT;m[y][12]=T.PIT;}
    m[5][5]=T.SPIKE;m[5][10]=T.SPIKE;m[6][5]=T.SPIKE;m[6][10]=T.SPIKE;
    m[5][7]=T.LEVER;m[9][7]=T.BOMB;m[9][8]=T.BOMB;
    m[2][5]=T.TORCH;m[2][10]=T.TORCH;m[9][5]=T.TORCH;m[9][10]=T.TORCH;
  }),enemies:[{x:7*TL,y:4*TL,hp:6,type:"ghost"},{x:7*TL,y:7*TL,hp:6,type:"ghost"},{x:5*TL,y:8*TL,hp:5,type:"skeleton"}]},

  // Side room from -1,-2 north
  "-1,-3b":{tiles:mr(m=>{ae(m,["S"]);
    m[3][5]=T.WALL;m[3][10]=T.WALL;m[8][5]=T.WALL;m[8][10]=T.WALL;
    m[5][7]=T.KEY;m[6][7]=T.RUPEE;m[6][8]=T.RUPEE;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;
  }),enemies:[{x:5*TL,y:5*TL,hp:7,type:"ghost"},{x:10*TL,y:6*TL,hp:7,type:"ghost"}]},

  // BOSS ROOM — Dark King (everything: ice, spikes, pits, tswitch)
  "0,-4":{tiles:mr(m=>{
    m[RO-1][7]=T.BOSS_DOOR;m[RO-1][8]=T.BOSS_DOOR;
    // ICE floor sections
    for(let y=4;y<=7;y++)for(let x=5;x<=10;x++)m[y][x]=T.ICE;
    // Spike borders
    for(let x=3;x<=12;x++){m[2][x]=T.SPIKE;m[9][x]=T.SPIKE;}
    for(let y=3;y<=8;y++){m[y][3]=T.SPIKE;m[y][12]=T.SPIKE;}
    // PIT corners
    m[2][2]=T.PIT;m[2][3]=T.PIT;m[2][12]=T.PIT;m[2][13]=T.PIT;
    m[9][2]=T.PIT;m[9][3]=T.PIT;m[9][12]=T.PIT;m[9][13]=T.PIT;
    m[3][2]=T.PIT;m[3][13]=T.PIT;m[8][2]=T.PIT;m[8][13]=T.PIT;
    // Floor safe zone center
    m[5][7]=T.FLOOR;m[5][8]=T.FLOOR;m[6][7]=T.FLOOR;m[6][8]=T.FLOOR;
    // Timed switch to temporarily convert spikes to floor
    m[3][4]=T.TSWITCH;m[3][11]=T.TSWITCH;m[8][4]=T.TSWITCH;m[8][11]=T.TSWITCH;
    // Torches for atmosphere
    m[3][7]=T.TORCH;m[3][8]=T.TORCH;m[8][7]=T.TORCH;m[8][8]=T.TORCH;
    m[5][4]=T.TORCH;m[5][11]=T.TORCH;m[6][4]=T.TORCH;m[6][11]=T.TORCH;
    // Triforce reward
    m[2][7]=T.TRIFORCE;
  }),enemies:[{x:7.5*TL,y:5*TL,hp:24,type:"boss",name:"Dark King",pattern:"all"}]},
}};

export const DG=[d1,d2,d3,d4];
export const DE=[
  {s:"0,0",t:[[7,5],[8,5],[7,6],[8,6]],d:0},
  {s:"4,1",t:[[7,5],[8,5],[7,6],[8,6]],d:1},
  {s:"-1,2",t:[[7,5],[8,5],[7,6],[8,6]],d:2},
  {s:"3,2",t:[[7,5],[8,5],[7,6],[8,6]],d:3}
];
