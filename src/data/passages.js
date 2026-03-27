import { TL } from '../constants.js';

// Side-scrolling underground passages — one per dungeon
// Each connects two rooms via a platforming section
// platforms: [x, y, width] in tile coords (one-way from above)
// ladders: [x, y, height] in tile coords (climbable vertically)
// enemies: [{x, y, type, hp}] in pixel coords

export const PASSAGES = [
  { // D0 Forest Temple: east wing shortcut
    // "1,-1" (central crossroads) ↔ "-1,-1" (hidden heart room, currently no exits)
    di: 0,
    from: { scr: "1,-1", tile: [7, 8] },     // Hidden under push block
    to:   { scr: "-1,-1", tile: [2, 9] },     // STAIRS_DOWN always present
    exitL: { scr: "1,-1", px: 7*TL, py: 7*TL },
    exitR: { scr: "-1,-1", px: 2*TL, py: 8*TL },
    platforms: [
      [2, 10, 12],   // main ground (gap at edges for ladders)
      [3, 8, 4],     // left mid platform
      [9, 8, 4],     // right mid platform
      [5, 6, 6],     // upper center bridge
    ],
    ladders: [[1, 5, 6], [14, 5, 6]],
    enemies: [
      { x: 6*TL, y: 9*TL, hp: 3, type: "bat" },
      { x: 10*TL, y: 7*TL, hp: 3, type: "skeleton" },
    ],
  },
  { // D1 Fire Cavern: connects east dead-end to west wing
    // "2,1" (isolated east room) ↔ "-1,0" (west lever room)
    di: 1,
    from: { scr: "2,1", tile: [12, 9] },
    to:   { scr: "-1,0", tile: [3, 9] },
    exitL: { scr: "2,1", px: 12*TL, py: 8*TL },
    exitR: { scr: "-1,0", px: 3*TL, py: 8*TL },
    platforms: [
      [2, 10, 5],    // left ground
      [9, 10, 5],    // right ground (gap in middle!)
      [5, 8, 6],     // mid bridge over lava gap
      [3, 6, 3],     // left upper
      [10, 6, 3],    // right upper
      [6, 4, 4],     // top center
    ],
    ladders: [[1, 4, 7], [14, 4, 7]],
    enemies: [
      { x: 7*TL, y: 9*TL, hp: 3, type: "fire_bat" },
      { x: 5*TL, y: 5*TL, hp: 3, type: "fire_bat" },
    ],
  },
  { // D2 Shadow Keep: east dead-end to west dead-end
    // "1,-1" (east room) ↔ "-2,-1" (far west room)
    di: 2,
    from: { scr: "1,-1", tile: [12, 9] },
    to:   { scr: "-2,-1", tile: [3, 9] },
    exitL: { scr: "1,-1", px: 12*TL, py: 8*TL },
    exitR: { scr: "-2,-1", px: 3*TL, py: 8*TL },
    platforms: [
      [2, 10, 12],   // full ground
      [4, 8, 3],     // left step
      [9, 8, 3],     // right step
      [6, 6, 4],     // center upper
      [2, 4, 3],     // far left high
      [11, 4, 3],    // far right high
    ],
    ladders: [[1, 3, 8], [14, 3, 8]],
    enemies: [
      { x: 7*TL, y: 9*TL, hp: 4, type: "ghost" },
      { x: 11*TL, y: 5*TL, hp: 4, type: "ghost" },
    ],
  },
  { // D3 Dark Sanctum: far east to far west bridge
    // "2,-1" (east dead-end) ↔ "-2,-1" (west dead-end)
    di: 3,
    from: { scr: "2,-1", tile: [12, 9] },
    to:   { scr: "-2,-1", tile: [3, 9] },
    exitL: { scr: "2,-1", px: 12*TL, py: 8*TL },
    exitR: { scr: "-2,-1", px: 3*TL, py: 8*TL },
    platforms: [
      [2, 10, 4],    // left ground
      [10, 10, 4],   // right ground
      [5, 9, 2],     // stepping stone left
      [9, 9, 2],     // stepping stone right
      [7, 8, 2],     // center stepping stone
      [4, 6, 3],     // left mid
      [9, 6, 3],     // right mid
      [6, 4, 4],     // top center
    ],
    ladders: [[1, 3, 8], [14, 3, 8]],
    enemies: [
      { x: 7*TL, y: 7*TL, hp: 5, type: "knight" },
      { x: 4*TL, y: 9*TL, hp: 4, type: "ghost" },
      { x: 11*TL, y: 5*TL, hp: 4, type: "fire_bat" },
    ],
  },
];
