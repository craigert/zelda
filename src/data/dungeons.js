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
    m[5][7]=T.PUSH;
  }),enemies:[{x:6*TL,y:4*TL,hp:2,type:"vine_creeper"},{x:9*TL,y:7*TL,hp:2,type:"skeleton"}]},

  // East wing — spike corridor with key
  "1,0":{tiles:mr(m=>{ae(m,["W","N","E"]);
    for(let x=8;x<=12;x++){m[2][x]=T.WALL;m[3][x]=T.WALL;}
    for(let y=2;y<=6;y++)m[y][8]=T.WALL;
    m[8][4]=T.SPIKE;m[8][5]=T.SPIKE;m[8][6]=T.SPIKE;m[8][9]=T.SPIKE;m[8][10]=T.SPIKE;m[8][11]=T.SPIKE;
    m[5][4]=T.KEY;m[9][12]=T.HEART;m[4][2]=T.TORCH;m[7][13]=T.TORCH;
  }),enemies:[{x:4*TL,y:5*TL,hp:3,type:"archer"},{x:11*TL,y:8*TL,hp:3,type:"skeleton"},{x:6*TL,y:7*TL,hp:2,type:"bat"},{x:12*TL,y:5*TL,hp:2,type:"bat"}]},

  // East wing upper — lever puzzle room
  "1,-1":{tiles:mr(m=>{ae(m,["S","E","W"]);
    for(let y=2;y<=4;y++){m[y][4]=T.WALL;m[y][11]=T.WALL;}
    for(let y=7;y<=9;y++){m[y][4]=T.WALL;m[y][11]=T.WALL;}
    m[5][6]=T.PUSH;m[5][9]=T.PUSH;
    m[3][7]=T.RUPEE;
    m[2][2]=T.TORCH;m[2][13]=T.TORCH;m[9][2]=T.TORCH;m[9][13]=T.TORCH;
  }),enemies:[{x:6*TL,y:3*TL,hp:3,type:"bat"},{x:9*TL,y:3*TL,hp:3,type:"bat"},{x:7*TL,y:8*TL,hp:3,type:"skeleton"}]},

  // Master key vault — guarded by tough enemies (east of 1,-1)
  "2,-1":{tiles:mr(m=>{ae(m,["W"]);
    for(let y=3;y<=8;y++){m[y][4]=T.WALL;m[y][11]=T.WALL;}
    m[5][4]=T.FLOOR;m[6][4]=T.FLOOR;m[5][11]=T.FLOOR;m[6][11]=T.FLOOR;
    m[3][7]=T.TORCH;m[8][7]=T.TORCH;m[3][5]=T.TORCH;m[3][10]=T.TORCH;
    m[8][5]=T.TORCH;m[8][10]=T.TORCH;
    m[4][6]=T.RUPEE;m[4][9]=T.RUPEE;m[7][6]=T.RUPEE;m[7][9]=T.RUPEE;
  }),enemies:[{x:6*TL,y:5*TL,hp:4,type:"skeleton"},{x:9*TL,y:5*TL,hp:4,type:"skeleton"},{x:7*TL,y:7*TL,hp:4,type:"bat"}],reward:"master_key"},

  // East far room — sunken pit with ledges and ladder (east of 1,0)
  "2,0":{tiles:mr(m=>{ae(m,["W"]);
    // Upper walkway around the edges
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;m[2][3]=T.TORCH;m[9][12]=T.TORCH;
    // Ledges surrounding the sunken area — drop in from any side
    for(let x=4;x<=11;x++){m[3][x]=T.LEDGE_S;m[8][x]=T.LEDGE_N;}
    for(let y=4;y<=7;y++){m[y][4]=T.LEDGE_E;m[y][11]=T.LEDGE_W;}
    // Sunken lower floor
    for(let y=4;y<=7;y++)for(let x=5;x<=10;x++)m[y][x]=T.LOW_FLOOR;
    // Treasure in the pit
    m[5][7]=T.HEART;m[6][8]=T.RUPEE;
    // Ladder on east side to climb back out
    m[7][11]=T.LADDER;m[3][11]=T.LADDER;
  }),enemies:[{x:6*TL,y:5*TL,hp:3,type:"vine_creeper"},{x:9*TL,y:6*TL,hp:2,type:"bat"}]},

  // Central north — pit maze with bridges
  "0,-1":{tiles:mr(m=>{ae(m,["S","N","E"]);
    for(let y=3;y<=8;y++)for(let x=2;x<=13;x++)m[y][x]=T.PIT;
    for(let y=3;y<=8;y++){m[y][5]=T.FLOOR;m[y][10]=T.FLOOR;}
    m[5][5]=T.FLOOR;m[5][6]=T.FLOOR;m[5][7]=T.FLOOR;m[5][8]=T.FLOOR;m[5][9]=T.FLOOR;m[5][10]=T.FLOOR;
    m[6][5]=T.FLOOR;m[6][6]=T.FLOOR;m[6][7]=T.FLOOR;m[6][8]=T.FLOOR;m[6][9]=T.FLOOR;m[6][10]=T.FLOOR;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;
  }),enemies:[{x:5*TL,y:4*TL,hp:2,type:"bat"},{x:10*TL,y:4*TL,hp:3,type:"vine_creeper"},{x:7*TL,y:7*TL,hp:3,type:"skeleton"}]},

  // East of north corridor — lever and plate room with U-shaped walkway (east of 0,-2)
  "1,-2":{tiles:mr(m=>{ae(m,["W"]);
    // U-shaped corridor: pits in center, walkable rim
    for(let y=3;y<=7;y++)for(let x=5;x<=10;x++)m[y][x]=T.PIT;
    // Bridge across the U
    m[5][5]=T.FLOOR;m[5][6]=T.FLOOR;m[5][7]=T.FLOOR;m[5][8]=T.FLOOR;m[5][9]=T.FLOOR;m[5][10]=T.FLOOR;
    m[3][3]=T.WALL;m[3][12]=T.WALL;m[8][3]=T.WALL;m[8][12]=T.WALL;
    m[5][7]=T.HEART;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;m[9][12]=T.HEART;
  }),enemies:[{x:5*TL,y:5*TL,hp:3,type:"archer"},{x:10*TL,y:6*TL,hp:3,type:"skeleton"}]},

  // North corridor — spiked hallway with blade traps
  "0,-2":{tiles:mr(m=>{ae(m,["S","ND","W","E"]);
    for(let y=2;y<=9;y++){m[y][3]=T.WALL;m[y][12]=T.WALL;}
    m[5][3]=T.FLOOR;m[6][3]=T.FLOOR;m[5][12]=T.FLOOR;m[6][12]=T.FLOOR;
    m[4][5]=T.SPIKE;m[4][10]=T.SPIKE;m[7][5]=T.SPIKE;m[7][10]=T.SPIKE;
    m[4][7]=T.PIT;m[4][8]=T.PIT;m[7][7]=T.PIT;m[7][8]=T.PIT;
    // One-way ledge drop with ladder to climb back up
    m[6][6]=T.LEDGE_S;m[6][7]=T.LEDGE_S;m[6][8]=T.LEDGE_S;m[6][9]=T.LEDGE_S;
    m[7][10]=T.LADDER;// ladder on right side to climb back up
    m[9][7]=T.HEART;m[2][4]=T.TORCH;m[2][11]=T.TORCH;
  }),enemies:[{x:7*TL,y:3*TL,hp:3,type:"bat"},{x:8*TL,y:6*TL,hp:3,type:"skeleton"},{x:7*TL,y:9*TL,hp:3,type:"bat"}],
  traps:[{x:4,y:3,dir:"h",range:6},{x:10,y:2,dir:"v",range:6}]},

  // West wing — dark room with torches (light them to reveal the path)
  "-1,-2":{dark:true,tiles:mr(m=>{ae(m,["E","N"]);
    for(let y=3;y<=8;y++){m[y][3]=T.PIT;m[y][12]=T.PIT;}
    m[3][6]=T.WALL;m[3][9]=T.WALL;m[8][6]=T.WALL;m[8][9]=T.WALL;
    m[5][5]=T.TORCH;m[5][10]=T.TORCH;m[6][5]=T.TORCH;m[6][10]=T.TORCH;
    m[5][7]=T.RUPEE;m[6][8]=T.RUPEE;
    m[RO-1][5]=T.CRACK;m[RO-1][6]=T.CRACK;
  }),enemies:[{x:7*TL,y:4*TL,hp:3,type:"bat"},{x:7*TL,y:7*TL,hp:3,type:"bat"},{x:4*TL,y:6*TL,hp:3,type:"skeleton"}]},

  // Secret room (bomb south wall of -1,-2) — treasure cache
  "-1,-1":{tiles:mr(m=>{
    m[0][5]=T.FLOOR;m[0][6]=T.FLOOR;
    m[5][7]=T.HEART;m[5][8]=T.HEART;
    m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[8][5]=T.TORCH;m[8][10]=T.TORCH;
    m[4][6]=T.RUPEE;m[4][9]=T.RUPEE;m[7][6]=T.RUPEE;m[7][9]=T.RUPEE;
    m[6][7]=T.BOMB;m[6][8]=T.BOMB;
  }),enemies:[]},

  // Northwest passage — Vine Guardian mini-boss guards the Bow
  "-1,-3":{tiles:mr(m=>{ae(m,["S"]);
    m[3][4]=T.WALL;m[3][5]=T.WALL;m[3][10]=T.WALL;m[3][11]=T.WALL;
    m[5][6]=T.SPIKE;m[5][9]=T.SPIKE;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;m[2][4]=T.TORCH;m[2][11]=T.TORCH;
  }),enemies:[{x:7*TL,y:6*TL,hp:8,type:"miniboss",name:"Vine Guardian"},{x:4*TL,y:4*TL,hp:2,type:"bat"},{x:11*TL,y:4*TL,hp:2,type:"bat"}],reward:"bow"},

  // North chamber — key guarded by enemies
  "0,-3":{tiles:mr(m=>{ae(m,["S","NB","E"]);
    m[3][4]=T.WALL;m[3][11]=T.WALL;m[8][4]=T.WALL;m[8][11]=T.WALL;
    m[5][3]=T.PIT;m[6][3]=T.PIT;
    m[4][7]=T.TORCH;m[4][8]=T.TORCH;m[7][7]=T.TORCH;m[7][8]=T.TORCH;
    m[5][7]=T.HEART;m[9][5]=T.HEART;
  }),enemies:[{x:6*TL,y:5*TL,hp:4,type:"knight"},{x:9*TL,y:5*TL,hp:4,type:"archer"},{x:7*TL,y:8*TL,hp:3,type:"bat"}]},

  // Spike arena — central island surrounded by spikes (east of 0,-3)
  "1,-3":{tiles:mr(m=>{ae(m,["W"]);
    // Ring of spikes around a safe center island
    for(let x=3;x<=12;x++){m[3][x]=T.SPIKE;m[8][x]=T.SPIKE;}
    for(let y=4;y<=7;y++){m[y][4]=T.SPIKE;m[y][11]=T.SPIKE;}
    m[5][7]=T.FLOOR;m[5][8]=T.FLOOR;m[6][7]=T.FLOOR;m[6][8]=T.FLOOR;
    // Diagonal spike pillars
    m[4][5]=T.SPIKE;m[4][10]=T.SPIKE;m[7][5]=T.SPIKE;m[7][10]=T.SPIKE;
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
    m[2][8]=T.FLOOR;
  }),enemies:[{x:7.5*TL,y:5*TL,hp:12,type:"boss",name:"Forest Guardian",pattern:"charge"}]},
}};

// ═══════════════════════════════════════════════════════════════
// DUNGEON 2 — Fire Cavern (14 rooms)
// ═══════════════════════════════════════════════════════════════
const d2={name:"Fire Cavern",color:"#2a1510",wc:"#6a3a2a",fc:"#4a2218",th:"fire",rooms:{

  // Entry room — lava pits flanking path
  "0,1":{tiles:mr(m=>{ae(m,["N","E","W"]);
    m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;
    for(let y=3;y<=8;y++){m[y][2]=T.PIT;m[y][3]=T.PIT;m[y][12]=T.PIT;m[y][13]=T.PIT;}
    m[5][6]=T.SPIKE;m[5][9]=T.SPIKE;m[6][6]=T.SPIKE;m[6][9]=T.SPIKE;
    m[3][2]=T.TORCH;m[3][13]=T.TORCH;m[8][5]=T.TORCH;m[8][10]=T.TORCH;
  }),enemies:[{x:5*TL,y:5*TL,hp:3,type:"fire_bat"},{x:10*TL,y:5*TL,hp:3,type:"fire_bat"}]},

  // East of entry — zigzag spike room
  "1,1":{tiles:mr(m=>{ae(m,["W","N","E"]);
    for(let x=3;x<=7;x++)m[3][x]=T.WALL;for(let x=8;x<=12;x++)m[5][x]=T.WALL;
    for(let x=3;x<=7;x++)m[7][x]=T.WALL;for(let x=8;x<=12;x++)m[9][x]=T.WALL;
    m[4][6]=T.SPIKE;m[4][7]=T.SPIKE;m[6][9]=T.SPIKE;m[6][10]=T.SPIKE;m[8][6]=T.SPIKE;m[8][7]=T.SPIKE;
    m[4][10]=T.HEART;m[2][7]=T.TORCH;
    m[9][12]=T.KEY;
  }),enemies:[{x:10*TL,y:3*TL,hp:3,type:"fire_bat"},{x:5*TL,y:6*TL,hp:4,type:"magma_slug"},{x:10*TL,y:8*TL,hp:3,type:"skeleton"}]},

  // Upper east — timed switch room
  "1,0":{tiles:mr(m=>{ae(m,["S","W"]);
    for(let y=2;y<=9;y++){m[y][5]=T.WALL;m[y][10]=T.WALL;}
    m[5][5]=T.FLOOR;m[6][5]=T.FLOOR;m[5][10]=T.FLOOR;m[6][10]=T.FLOOR;
    m[3][3]=T.SPIKE;m[3][12]=T.SPIKE;m[8][3]=T.SPIKE;m[8][12]=T.SPIKE;
    m[3][7]=T.HEART;m[8][8]=T.HEART;
    m[5][CO-1]=T.CRACK;m[6][CO-1]=T.CRACK;
    m[2][2]=T.TORCH;m[2][13]=T.TORCH;
  }),enemies:[{x:2*TL,y:3*TL,hp:4,type:"fire_bat"},{x:2*TL,y:8*TL,hp:4,type:"fire_bat"},{x:13*TL,y:3*TL,hp:4,type:"mage"},{x:13*TL,y:8*TL,hp:4,type:"skeleton"}]},

  // Secret room (crack east wall of 1,0) — treasure cache
  "2,0":{tiles:mr(m=>{
    m[5][0]=T.FLOOR;m[6][0]=T.FLOOR;
    m[5][7]=T.RUPEE;m[5][8]=T.RUPEE;
    m[4][7]=T.HEART;m[6][7]=T.BOMB;m[6][8]=T.BOMB;
    m[3][6]=T.TORCH;m[3][9]=T.TORCH;m[8][6]=T.TORCH;m[8][9]=T.TORCH;
  }),enemies:[]},

  // Central hub — push block puzzle
  "0,0":{tiles:mr(m=>{ae(m,["S","E","W"]);m[0][7]=T.DOOR;m[0][8]=T.DOOR;
    m[4][5]=T.PIT;m[4][6]=T.PIT;m[4][9]=T.PIT;m[4][10]=T.PIT;
    m[7][5]=T.PIT;m[7][6]=T.PIT;m[7][9]=T.PIT;m[7][10]=T.PIT;
    m[5][4]=T.WALL;m[6][4]=T.WALL;m[5][11]=T.WALL;m[6][11]=T.WALL;
    m[5][7]=T.SPIKE;m[6][8]=T.SPIKE;m[5][8]=T.SPIKE;m[6][7]=T.SPIKE;
    m[2][3]=T.TORCH;m[2][12]=T.TORCH;m[9][3]=T.TORCH;m[9][12]=T.TORCH;
  }),enemies:[{x:3*TL,y:3*TL,hp:3,type:"mage"},{x:12*TL,y:3*TL,hp:3,type:"skeleton"},{x:7*TL,y:8*TL,hp:3,type:"fire_bat"}]},

  // East of zigzag — divided chambers with water channel (east of 1,1)
  "2,1":{tiles:mr(m=>{ae(m,["W"]);
    // Central water channel dividing the room
    for(let y=2;y<=9;y++)m[y][7]=T.WALL;
    m[5][7]=T.FLOOR;m[6][7]=T.FLOOR;
    m[3][4]=T.SPIKE;m[3][10]=T.SPIKE;m[8][4]=T.SPIKE;m[8][10]=T.SPIKE;
    m[5][4]=T.RUPEE;m[6][11]=T.HEART;
    m[2][3]=T.TORCH;m[2][12]=T.TORCH;m[9][3]=T.TORCH;m[9][12]=T.TORCH;
  }),enemies:[{x:4*TL,y:5*TL,hp:4,type:"fire_bat"},{x:11*TL,y:5*TL,hp:4,type:"fire_bat"}]},

  // West branch — first locked door with blade traps
  "-1,0":{tiles:mr(m=>{ae(m,["E","WD"]);
    m[3][3]=T.SPIKE;m[3][6]=T.SPIKE;m[3][9]=T.SPIKE;m[3][12]=T.SPIKE;
    m[5][4]=T.SPIKE;m[5][7]=T.SPIKE;m[5][10]=T.SPIKE;
    m[7][3]=T.SPIKE;m[7][6]=T.SPIKE;m[7][9]=T.SPIKE;m[7][12]=T.SPIKE;
    m[5][13]=T.HEART;m[2][2]=T.TORCH;m[2][13]=T.TORCH;
    m[8][7]=T.KEY;
  }),enemies:[{x:3*TL,y:5*TL,hp:4,type:"fire_bat"},{x:12*TL,y:5*TL,hp:4,type:"fire_bat"}],
  traps:[{x:2,y:4,dir:"h",range:10},{x:7,y:2,dir:"v",range:7}]},

  // MASTER_KEY room — behind second locked door, timed switch puzzle
  "-2,0":{tiles:mr(m=>{
    m[5][CO-1]=T.DOOR;m[6][CO-1]=T.DOOR;
    m[3][3]=T.TSWITCH;m[3][12]=T.TSWITCH;
    for(let x=4;x<=11;x++){m[5][x]=T.SPIKE;m[6][x]=T.SPIKE;}
    m[5][7]=T.FLOOR;m[5][8]=T.FLOOR;m[6][7]=T.FLOOR;m[6][8]=T.FLOOR;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;m[2][4]=T.TORCH;m[2][11]=T.TORCH;
    m[9][4]=T.TORCH;m[9][11]=T.TORCH;
    m[4][3]=T.RUPEE;m[4][12]=T.RUPEE;
  }),enemies:[{x:7*TL,y:3*TL,hp:4,type:"fire_bat"},{x:7*TL,y:8*TL,hp:4,type:"fire_bat"}],reward:"master_key"},

  // North door — lava crossing (crack west to bomb room)
  "0,-1":{tiles:mr(m=>{m[RO-1][7]=T.FLOOR;m[RO-1][8]=T.FLOOR;ae(m,["N","E","W"]);
    for(let y=2;y<=9;y++)for(let x=2;x<=13;x++)m[y][x]=T.PIT;
    for(let y=2;y<=9;y++){m[y][7]=T.FLOOR;m[y][8]=T.FLOOR;}
    m[4][4]=T.FLOOR;m[4][5]=T.FLOOR;m[4][6]=T.FLOOR;m[7][9]=T.FLOOR;m[7][10]=T.FLOOR;m[7][11]=T.FLOOR;
    m[4][4]=T.SPIKE;m[7][11]=T.SPIKE;
    // One-way ledge drop with ladder
    m[6][7]=T.LEDGE_S;m[6][8]=T.LEDGE_S;m[7][9]=T.LADDER;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;
  }),enemies:[{x:7*TL,y:3*TL,hp:3,type:"fire_bat"},{x:7*TL,y:6*TL,hp:4,type:"magma_slug"},{x:7*TL,y:9*TL,hp:3,type:"skeleton"}]},

  // Bomb bag room — west of lava crossing, accessible without bombs
  "-1,-1":{tiles:mr(m=>{ae(m,["E"]);
    for(let y=2;y<=9;y++){m[y][3]=T.WALL;m[y][12]=T.WALL;}
    m[5][3]=T.FLOOR;m[6][3]=T.FLOOR;m[5][12]=T.FLOOR;m[6][12]=T.FLOOR;
    m[3][5]=T.PIT;m[3][10]=T.PIT;m[8][5]=T.PIT;m[8][10]=T.PIT;
    m[4][6]=T.SPIKE;m[4][9]=T.SPIKE;m[7][6]=T.SPIKE;m[7][9]=T.SPIKE;
    m[2][4]=T.TORCH;m[2][11]=T.TORCH;m[9][4]=T.TORCH;m[9][11]=T.TORCH;
    m[3][7]=T.RUPEE;m[8][7]=T.RUPEE;m[3][8]=T.RUPEE;m[8][8]=T.RUPEE;
  }),enemies:[{x:5*TL,y:4*TL,hp:4,type:"fire_bat"},{x:10*TL,y:4*TL,hp:4,type:"fire_bat"},{x:7*TL,y:5*TL,hp:10,type:"miniboss",name:"Flame Sentinel"}],reward:"bomb_bag"},

  // East of lava crossing — timed switch & ice
  "1,-1":{tiles:mr(m=>{ae(m,["W"]);
    m[9][3]=T.TSWITCH;m[9][12]=T.TSWITCH;
    for(let x=4;x<=11;x++){m[4][x]=T.SPIKE;m[7][x]=T.SPIKE;}
    m[5][5]=T.ICE;m[5][6]=T.ICE;m[5][7]=T.ICE;m[5][8]=T.ICE;m[5][9]=T.ICE;m[5][10]=T.ICE;
    m[6][5]=T.ICE;m[6][6]=T.ICE;m[6][7]=T.ICE;m[6][8]=T.ICE;m[6][9]=T.ICE;m[6][10]=T.ICE;
    m[2][7]=T.HEART;m[2][8]=T.HEART;
    m[2][5]=T.TORCH;m[2][10]=T.TORCH;m[8][5]=T.TORCH;m[8][10]=T.TORCH;
  }),enemies:[{x:7*TL,y:5*TL,hp:4,type:"fire_bat"},{x:9*TL,y:6*TL,hp:4,type:"fire_bat"}]},

  // North — pre-boss corridor with spikes
  "0,-2":{tiles:mr(m=>{ae(m,["S","WB"]);
    for(let y=2;y<=9;y++){m[y][4]=T.SPIKE;m[y][11]=T.SPIKE;}
    m[3][7]=T.WALL;m[3][8]=T.WALL;m[8][7]=T.WALL;m[8][8]=T.WALL;
    m[5][7]=T.KEY;m[6][8]=T.HEART;
    m[2][3]=T.TORCH;m[2][12]=T.TORCH;m[9][3]=T.TORCH;m[9][12]=T.TORCH;
  }),enemies:[{x:7*TL,y:5*TL,hp:4,type:"mage"},{x:3*TL,y:4*TL,hp:4,type:"fire_bat"},{x:12*TL,y:7*TL,hp:4,type:"fire_bat"}]},

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
    m[2][7]=T.FLOOR;
  }),enemies:[{x:7.5*TL,y:5*TL,hp:14,type:"boss",name:"Flame Wyrm",pattern:"spawn"}]},

  // South treasure (crack south wall of entry room)
  "0,2":{tiles:mr(m=>{m[0][7]=T.FLOOR;m[0][8]=T.FLOOR;
    m[4][6]=T.RUPEE;m[4][7]=T.RUPEE;m[4][8]=T.RUPEE;m[5][7]=T.RUPEE;m[6][7]=T.HEART;m[6][8]=T.HEART;
    m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[8][5]=T.TORCH;m[8][10]=T.TORCH;
  }),enemies:[]},

  // West of entry — optional lava island challenge (west of 0,1)
  "-1,1":{tiles:mr(m=>{ae(m,["E"]);
    // Central island surrounded by lava pits
    for(let y=3;y<=8;y++)for(let x=3;x<=12;x++)m[y][x]=T.PIT;
    // Stepping-stone islands
    m[4][5]=T.FLOOR;m[4][6]=T.FLOOR;m[4][9]=T.FLOOR;m[4][10]=T.FLOOR;
    m[7][5]=T.FLOOR;m[7][6]=T.FLOOR;m[7][9]=T.FLOOR;m[7][10]=T.FLOOR;
    // Center platform
    m[5][7]=T.FLOOR;m[6][7]=T.FLOOR;m[5][8]=T.FLOOR;m[6][8]=T.FLOOR;
    m[5][6]=T.FLOOR;m[6][6]=T.FLOOR;m[5][9]=T.FLOOR;m[6][9]=T.FLOOR;
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
  }),enemies:[{x:4*TL,y:5*TL,hp:3,type:"ghost"},{x:11*TL,y:4*TL,hp:3,type:"knight"},{x:7*TL,y:8*TL,hp:3,type:"skeleton"}]},

  // Secret room (crack east wall of 0,0) — treasure cache
  "1,0":{tiles:mr(m=>{
    m[5][0]=T.FLOOR;m[6][0]=T.FLOOR;
    m[5][7]=T.RUPEE;m[5][8]=T.RUPEE;
    m[4][7]=T.RUPEE;m[6][7]=T.BOMB;m[6][8]=T.RUPEE;
    m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[8][5]=T.TORCH;m[8][10]=T.TORCH;
  }),enemies:[]},

  // West wing — sunken center with ghosts
  "-1,0":{tiles:mr(m=>{ae(m,["E","N"]);
    // Ledges around a sunken center
    for(let x=5;x<=10;x++){m[3][x]=T.LEDGE_S;m[8][x]=T.LEDGE_N;}
    for(let y=4;y<=7;y++){m[y][5]=T.LEDGE_E;m[y][10]=T.LEDGE_W;}
    // Sunken lower floor
    for(let y=4;y<=7;y++)for(let x=6;x<=9;x++)m[y][x]=T.LOW_FLOOR;
    m[5][7]=T.RUPEE;m[6][8]=T.HEART;
    // Ladder on east wall of pit — replaces LEDGE_W so player can climb out
    m[7][10]=T.LADDER;m[4][10]=T.LADDER;
    m[2][5]=T.TORCH;m[2][10]=T.TORCH;m[9][5]=T.TORCH;m[9][10]=T.TORCH;
  }),enemies:[{x:7*TL,y:5*TL,hp:4,type:"ghost"},{x:8*TL,y:6*TL,hp:4,type:"ghost"},{x:3*TL,y:7*TL,hp:4,type:"wallmaster"}]},

  // Northwest — ghost gauntlet (dark room)
  "-1,-1":{dark:true,tiles:mr(m=>{ae(m,["S","E","W"]);
    m[3][4]=T.WALL;m[3][5]=T.WALL;m[3][10]=T.WALL;m[3][11]=T.WALL;
    m[8][4]=T.WALL;m[8][5]=T.WALL;m[8][10]=T.WALL;m[8][11]=T.WALL;
    m[5][7]=T.HEART;m[6][8]=T.HEART;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;
  }),enemies:[{x:4*TL,y:5*TL,hp:4,type:"ghost"},{x:11*TL,y:5*TL,hp:4,type:"ghost"},{x:7*TL,y:3*TL,hp:3,type:"bat"},{x:7*TL,y:8*TL,hp:3,type:"bat"}]},

  // North — push blocks into pits to get key
  "0,-1":{pitPuzzle:true,tiles:mr(m=>{ae(m,["S","N","E","W"]);m[0][7]=T.DOOR;m[0][8]=T.DOOR;
    for(let y=3;y<=5;y++)m[y][5]=T.WALL;for(let y=6;y<=8;y++)m[y][10]=T.WALL;
    m[3][8]=T.WALL;m[3][9]=T.WALL;m[8][6]=T.WALL;m[8][7]=T.WALL;
    // Push blocks + pits — fill both pits to get a key
    m[5][8]=T.PIT;m[6][7]=T.PIT;
    m[5][7]=T.PUSH;m[6][8]=T.PUSH;
  }),enemies:[{x:10*TL,y:3*TL,hp:3,type:"ghost"},{x:4*TL,y:6*TL,hp:3,type:"knight"},{x:10*TL,y:8*TL,hp:3,type:"ghost"}]},

  // Far west ghost room — pit-flanked corridor (west of -1,-1)
  "-2,-1":{tiles:mr(m=>{ae(m,["E"]);
    // Horizontal pit bands creating a narrow walkway
    for(let y=3;y<=4;y++)for(let x=3;x<=12;x++)m[y][x]=T.PIT;
    for(let y=7;y<=8;y++)for(let x=3;x<=12;x++)m[y][x]=T.PIT;
    m[5][5]=T.TORCH;m[5][10]=T.TORCH;m[6][5]=T.TORCH;m[6][10]=T.TORCH;
    m[5][7]=T.HEART;m[2][7]=T.HEART;
  }),enemies:[{x:7*TL,y:5*TL,hp:4,type:"ghost"},{x:9*TL,y:6*TL,hp:4,type:"ghost"}]},

  // East of north — spike corridor with key
  "1,-1":{tiles:mr(m=>{ae(m,["W"]);
    for(let y=2;y<=3;y++)for(let x=3;x<=12;x++)m[y][x]=T.WALL;
    for(let y=8;y<=9;y++)for(let x=3;x<=12;x++)m[y][x]=T.WALL;
    m[5][4]=T.SPIKE;m[5][6]=T.SPIKE;m[5][8]=T.SPIKE;m[5][10]=T.SPIKE;m[5][12]=T.SPIKE;
    m[6][3]=T.SPIKE;m[6][5]=T.SPIKE;m[6][7]=T.SPIKE;m[6][9]=T.SPIKE;m[6][11]=T.SPIKE;
    m[4][7]=T.RUPEE;m[7][8]=T.RUPEE;
    m[5][CO-1]=T.CRACK;m[6][CO-1]=T.CRACK;
  }),enemies:[{x:6*TL,y:5*TL,hp:4,type:"ghost"},{x:9*TL,y:6*TL,hp:4,type:"ghost"}],
  traps:[{x:3,y:5,dir:"h",range:8},{x:8,y:2,dir:"v",range:7}]},

  // Secret room east of spike corridor — bombs and supplies
  "2,-1":{tiles:mr(m=>{
    m[5][0]=T.FLOOR;m[6][0]=T.FLOOR;
    m[5][7]=T.BOMB;m[5][8]=T.BOMB;m[6][7]=T.HEART;m[6][8]=T.HEART;
    m[4][5]=T.TORCH;m[4][10]=T.TORCH;m[7][5]=T.TORCH;m[7][10]=T.TORCH;
    m[3][7]=T.RUPEE;
  }),enemies:[]},

  // North depth — scattered pits with ghosts (crack east to master sword)
  "0,-2":{tiles:mr(m=>{ae(m,["S","W","N"]);
    for(let y=2;y<=9;y++)for(let x=2;x<=13;x++)if((x+y)%3===0)m[y][x]=T.PIT;
    m[5][7]=T.HEART;m[5][8]=T.HEART;m[2][3]=T.TORCH;m[9][12]=T.TORCH;
    m[5][CO-1]=T.CRACK;m[6][CO-1]=T.CRACK;
  }),enemies:[{x:7*TL,y:4*TL,hp:5,type:"ghost"},{x:4*TL,y:7*TL,hp:5,type:"wallmaster"},{x:11*TL,y:7*TL,hp:5,type:"ghost"}]},

  // Hidden master sword room — hard ghost gauntlet
  "1,-2":{tiles:mr(m=>{
    m[5][0]=T.FLOOR;m[6][0]=T.FLOOR;
    for(let y=2;y<=9;y++){m[y][4]=T.WALL;m[y][11]=T.WALL;}
    m[5][4]=T.FLOOR;m[6][4]=T.FLOOR;m[5][11]=T.FLOOR;m[6][11]=T.FLOOR;
    m[3][6]=T.SPIKE;m[3][9]=T.SPIKE;m[8][6]=T.SPIKE;m[8][9]=T.SPIKE;
    m[4][5]=T.PIT;m[4][10]=T.PIT;m[7][5]=T.PIT;m[7][10]=T.PIT;
    m[2][5]=T.TORCH;m[2][10]=T.TORCH;m[9][5]=T.TORCH;m[9][10]=T.TORCH;
    m[3][7]=T.TORCH;m[8][7]=T.TORCH;
  }),enemies:[{x:6*TL,y:3*TL,hp:5,type:"ghost"},{x:9*TL,y:8*TL,hp:5,type:"ghost"},{x:7*TL,y:5*TL,hp:12,type:"miniboss",name:"Shadow Knight"}],reward:"master_sword"},

  // West of depth — spike+ghost gauntlet leading to master key
  "-1,-2":{tiles:mr(m=>{ae(m,["E","W"]);
    m[3][4]=T.WALL;m[3][5]=T.WALL;m[4][4]=T.WALL;m[3][10]=T.WALL;m[3][11]=T.WALL;m[4][11]=T.WALL;
    m[7][4]=T.WALL;m[8][4]=T.WALL;m[8][5]=T.WALL;m[7][11]=T.WALL;m[8][10]=T.WALL;m[8][11]=T.WALL;
    m[5][7]=T.SPIKE;m[5][8]=T.SPIKE;m[6][7]=T.SPIKE;m[6][8]=T.SPIKE;
    m[9][7]=T.KEY;
  }),enemies:[{x:7*TL,y:3*TL,hp:5,type:"ghost"},{x:3*TL,y:6*TL,hp:5,type:"knight"},{x:12*TL,y:8*TL,hp:4,type:"ghost"}]},

  // Master key room — spike gauntlet with ghost guards (west of -1,-2)
  "-2,-2":{tiles:mr(m=>{ae(m,["E"]);
    for(let x=3;x<=12;x++){m[3][x]=T.SPIKE;m[8][x]=T.SPIKE;}
    m[5][5]=T.SPIKE;m[5][10]=T.SPIKE;m[6][5]=T.SPIKE;m[6][10]=T.SPIKE;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;m[4][4]=T.TORCH;m[4][11]=T.TORCH;
    m[7][4]=T.TORCH;m[7][11]=T.TORCH;
  }),enemies:[{x:7*TL,y:4*TL,hp:5,type:"ghost"},{x:7*TL,y:7*TL,hp:5,type:"ghost"}],reward:"master_key"},

  // Deep north — ice room
  "0,-3":{tiles:mr(m=>{ae(m,["S","W"]);
    for(let y=2;y<=9;y++)for(let x=2;x<=13;x++)m[y][x]=T.ICE;
    m[3][5]=T.WALL;m[3][10]=T.WALL;m[5][7]=T.WALL;m[5][8]=T.WALL;
    m[8][5]=T.WALL;m[8][10]=T.WALL;
    m[4][4]=T.SPIKE;m[4][11]=T.SPIKE;m[7][4]=T.SPIKE;m[7][11]=T.SPIKE;
    m[6][6]=T.TSWITCH;m[2][7]=T.HEART;m[9][8]=T.HEART;
    m[2][3]=T.TORCH;m[2][12]=T.TORCH;m[9][3]=T.TORCH;m[9][12]=T.TORCH;
  }),enemies:[{x:10*TL,y:5*TL,hp:4,type:"ghost"},{x:5*TL,y:7*TL,hp:4,type:"ghost"}]},

  // Pre-boss — west from ice room (ledge drop shortcut)
  "-1,-3":{tiles:mr(m=>{ae(m,["E","NB"]);
    m[3][4]=T.WALL;m[3][11]=T.WALL;m[8][4]=T.WALL;m[8][11]=T.WALL;
    m[5][5]=T.SPIKE;m[5][10]=T.SPIKE;m[6][5]=T.SPIKE;m[6][10]=T.SPIKE;
    // One-way ledges with ladders to climb back
    m[4][7]=T.LEDGE_E;m[4][8]=T.LEDGE_E;m[3][9]=T.LADDER;
    m[7][7]=T.LEDGE_W;m[7][8]=T.LEDGE_W;m[8][6]=T.LADDER;
    m[5][7]=T.HEART;m[5][8]=T.HEART;
    m[2][3]=T.TORCH;m[2][12]=T.TORCH;m[9][3]=T.TORCH;m[9][12]=T.TORCH;
  }),enemies:[{x:7*TL,y:4*TL,hp:5,type:"ghost"},{x:4*TL,y:7*TL,hp:5,type:"knight"},{x:11*TL,y:7*TL,hp:5,type:"ghost"}]},

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
    m[2][12]=T.FLOOR;
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
    m[5][7]=T.PUSH;
  }),enemies:[{x:4*TL,y:5*TL,hp:5,type:"stalfos"},{x:11*TL,y:5*TL,hp:5,type:"ghost"},{x:7*TL,y:3*TL,hp:5,type:"stalfos"},{x:7*TL,y:8*TL,hp:5,type:"skeleton"}]},

  // East wing — dark spike room
  "1,0":{dark:true,tiles:mr(m=>{ae(m,["W","N"]);
    for(let y=3;y<=8;y++){m[y][4]=T.SPIKE;m[y][11]=T.SPIKE;}
    m[3][7]=T.WALL;m[3][8]=T.WALL;m[8][7]=T.WALL;m[8][8]=T.WALL;
    m[5][7]=T.KEY;m[6][8]=T.HEART;
    m[2][3]=T.TORCH;m[2][12]=T.TORCH;m[9][3]=T.TORCH;m[9][12]=T.TORCH;
    m[5][CO-1]=T.CRACK;m[6][CO-1]=T.CRACK;
  }),enemies:[{x:6*TL,y:5*TL,hp:5,type:"mage"},{x:9*TL,y:6*TL,hp:5,type:"ghost"},{x:3*TL,y:7*TL,hp:4,type:"knight"}]},

  // Secret room (crack east wall of 1,0) — treasure cache
  "2,0":{tiles:mr(m=>{
    m[5][0]=T.FLOOR;m[6][0]=T.FLOOR;
    m[5][7]=T.RUPEE;m[5][8]=T.RUPEE;
    m[4][6]=T.RUPEE;m[4][9]=T.RUPEE;m[6][6]=T.BOMB;m[6][9]=T.BOMB;
    m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[8][5]=T.TORCH;m[8][10]=T.TORCH;
  }),enemies:[]},

  // East upper — ghost arena (east leads to master key)
  "1,-1":{tiles:mr(m=>{ae(m,["S","W","E"]);
    m[3][3]=T.WALL;m[3][4]=T.WALL;m[3][11]=T.WALL;m[3][12]=T.WALL;
    m[8][3]=T.WALL;m[8][4]=T.WALL;m[8][11]=T.WALL;m[8][12]=T.WALL;
    m[5][5]=T.PIT;m[5][10]=T.PIT;m[6][5]=T.PIT;m[6][10]=T.PIT;
    m[5][7]=T.HEART;m[6][8]=T.HEART;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;
  }),enemies:[{x:4*TL,y:5*TL,hp:6,type:"knight"},{x:11*TL,y:6*TL,hp:6,type:"mage"},{x:7*TL,y:3*TL,hp:5,type:"fire_bat"}]},

  // MASTER_KEY room (east of 1,-1)
  "2,-1":{tiles:mr(m=>{ae(m,["W"]);
    for(let x=4;x<=11;x++){m[3][x]=T.SPIKE;m[8][x]=T.SPIKE;}
    m[5][5]=T.WALL;m[5][10]=T.WALL;m[6][5]=T.WALL;m[6][10]=T.WALL;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;m[4][4]=T.TORCH;m[4][11]=T.TORCH;
    m[7][4]=T.TORCH;m[7][11]=T.TORCH;
  }),enemies:[{x:7*TL,y:4*TL,hp:8,type:"ghost"},{x:7*TL,y:7*TL,hp:8,type:"ghost"},{x:4*TL,y:5*TL,hp:6,type:"ghost"}],reward:"master_key"},

  // North room — lever & push puzzle
  "0,-1":{tiles:mr(m=>{ae(m,["S","E","W"]);m[0][7]=T.DOOR;m[0][8]=T.DOOR;
    m[3][3]=T.WALL;m[3][4]=T.WALL;m[3][11]=T.WALL;m[3][12]=T.WALL;
    m[5][5]=T.WALL;m[5][6]=T.WALL;m[5][9]=T.WALL;m[5][10]=T.WALL;
    m[8][5]=T.WALL;m[8][10]=T.WALL;
    m[6][7]=T.HEART;m[4][7]=T.PUSH;m[7][12]=T.PUSH;
  }),enemies:[{x:3*TL,y:6*TL,hp:5,type:"fire_bat"},{x:12*TL,y:6*TL,hp:5,type:"fire_bat"},{x:7*TL,y:8*TL,hp:5,type:"ghost"}]},

  // West wing — ice floor challenge
  "-1,-1":{tiles:mr(m=>{ae(m,["E","N","W"]);
    for(let y=2;y<=9;y++)for(let x=2;x<=13;x++)m[y][x]=T.ICE;
    m[3][5]=T.WALL;m[3][10]=T.WALL;m[8][5]=T.WALL;m[8][10]=T.WALL;
    m[5][7]=T.WALL;m[6][7]=T.WALL;
    m[4][4]=T.SPIKE;m[4][11]=T.SPIKE;m[7][4]=T.SPIKE;m[7][11]=T.SPIKE;
    m[2][7]=T.HEART;m[9][8]=T.HEART;
    m[2][3]=T.TORCH;m[2][12]=T.TORCH;m[9][3]=T.TORCH;m[9][12]=T.TORCH;
  }),enemies:[{x:5*TL,y:5*TL,hp:5,type:"ghost"},{x:10*TL,y:6*TL,hp:5,type:"ghost"}]},

  // Far west ambush — skeleton ambush with alternating floor/spike (west of -1,-1)
  "-2,-1":{tiles:mr(m=>{ae(m,["E"]);
    // Alternating spike/floor checkerboard pattern
    for(let y=3;y<=8;y++)for(let x=3;x<=12;x++){
      if((x+y)%2===0)m[y][x]=T.SPIKE;
    }
    // Safe path down the center
    for(let y=2;y<=9;y++){m[y][7]=T.FLOOR;m[y][8]=T.FLOOR;}
    m[5][7]=T.RUPEE;m[6][8]=T.HEART;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;m[2][4]=T.TORCH;m[2][11]=T.TORCH;
  }),enemies:[{x:5*TL,y:5*TL,hp:6,type:"skeleton"},{x:10*TL,y:5*TL,hp:6,type:"skeleton"},{x:7*TL,y:3*TL,hp:5,type:"fire_bat"},{x:7*TL,y:8*TL,hp:5,type:"ghost"}]},

  // North depth — locked door passage
  "0,-2":{tiles:mr(m=>{m[RO-1][7]=T.FLOOR;m[RO-1][8]=T.FLOOR;ae(m,["N","E","W"]);
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
    m[8][7]=T.HEART;m[8][8]=T.BOMB;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;
  }),enemies:[{x:4*TL,y:5*TL,hp:6,type:"ghost"},{x:11*TL,y:6*TL,hp:6,type:"ghost"}],
  traps:[{x:3,y:2,dir:"v",range:7},{x:12,y:2,dir:"v",range:7}]},

  // Northwest — ghost patrol
  "-1,-2":{tiles:mr(m=>{ae(m,["E","N","S"]);
    for(let y=3;y<=4;y++)for(let x=3;x<=5;x++)m[y][x]=T.PIT;
    for(let y=3;y<=4;y++)for(let x=10;x<=12;x++)m[y][x]=T.PIT;
    for(let y=7;y<=8;y++)for(let x=3;x<=5;x++)m[y][x]=T.PIT;
    for(let y=7;y<=8;y++)for(let x=10;x<=12;x++)m[y][x]=T.PIT;
    m[5][5]=T.TORCH;m[5][10]=T.TORCH;m[6][5]=T.TORCH;m[6][10]=T.TORCH;
    m[5][7]=T.HEART;m[6][8]=T.HEART;
  }),enemies:[{x:7*TL,y:3*TL,hp:6,type:"ghost"},{x:7*TL,y:8*TL,hp:6,type:"mage"},{x:4*TL,y:5*TL,hp:5,type:"knight"},{x:11*TL,y:6*TL,hp:5,type:"archer"}]},

  // Deep north — pre-boss gauntlet
  "0,-3":{tiles:mr(m=>{ae(m,["S","NB","W"]);
    m[3][3]=T.WALL;m[3][12]=T.WALL;m[8][3]=T.WALL;m[8][12]=T.WALL;
    for(let x=5;x<=10;x++){m[4][x]=T.SPIKE;m[7][x]=T.SPIKE;}
    m[5][4]=T.PIT;m[5][11]=T.PIT;m[6][4]=T.PIT;m[6][11]=T.PIT;
    m[5][7]=T.HEART;m[5][8]=T.HEART;
    m[4][7]=T.TORCH;m[4][8]=T.TORCH;m[7][7]=T.TORCH;m[7][8]=T.TORCH;
  }),enemies:[{x:7*TL,y:5*TL,hp:7,type:"ghost"},{x:4*TL,y:6*TL,hp:7,type:"ghost"},{x:11*TL,y:5*TL,hp:6,type:"skeleton"}]},

  // North further — ghost corridor
  "-1,-3":{tiles:mr(m=>{ae(m,["S","E","W"]);
    for(let y=2;y<=9;y++){m[y][3]=T.PIT;m[y][12]=T.PIT;}
    m[5][5]=T.SPIKE;m[5][10]=T.SPIKE;m[6][5]=T.SPIKE;m[6][10]=T.SPIKE;
    m[5][7]=T.HEART;m[9][7]=T.BOMB;m[9][8]=T.BOMB;
    m[2][5]=T.TORCH;m[2][10]=T.TORCH;m[9][5]=T.TORCH;m[9][10]=T.TORCH;
  }),enemies:[{x:7*TL,y:4*TL,hp:6,type:"stalfos"},{x:7*TL,y:7*TL,hp:6,type:"ghost"},{x:5*TL,y:8*TL,hp:5,type:"stalfos"}],
  traps:[{x:4,y:2,dir:"v",range:7},{x:11,y:2,dir:"v",range:7}]},

  // Far west — ghost treasure room with pit moat (west of -1,-3)
  "-2,-3":{tiles:mr(m=>{ae(m,["E"]);
    // Pit moat around treasure platform
    for(let y=3;y<=8;y++)for(let x=4;x<=11;x++)m[y][x]=T.PIT;
    // Central treasure island
    for(let y=5;y<=6;y++)for(let x=6;x<=9;x++)m[y][x]=T.FLOOR;
    // Bridge from east
    m[5][10]=T.FLOOR;m[5][11]=T.FLOOR;m[6][10]=T.FLOOR;m[6][11]=T.FLOOR;
    m[5][7]=T.RUPEE;m[6][7]=T.RUPEE;m[6][8]=T.RUPEE;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;m[2][3]=T.TORCH;m[2][12]=T.TORCH;
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
    m[2][7]=T.FLOOR;
  }),enemies:[{x:7.5*TL,y:5*TL,hp:24,type:"boss",name:"Dark King",pattern:"all"}]},
}};

export const DG=[d1,d2,d3,d4];
export const DE=[
  {s:"0,0",t:[[7,5],[8,5],[7,6],[8,6]],d:0},
  {s:"4,1",t:[[7,5],[8,5],[7,6],[8,6]],d:1},
  {s:"-1,2",t:[[7,5],[8,5],[7,6],[8,6]],d:2},
  {s:"3,2",t:[[7,5],[8,5],[7,6],[8,6]],d:3}
];
