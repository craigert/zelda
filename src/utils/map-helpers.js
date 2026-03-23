import { T, TL, CO, RO } from '../constants.js';

export function mr(cb){const m=Array.from({length:RO},()=>Array(CO).fill(T.FLOOR));for(let i=0;i<CO;i++){m[0][i]=T.WALL;m[RO-1][i]=T.WALL;}for(let i=0;i<RO;i++){m[i][0]=T.WALL;m[i][CO-1]=T.WALL;}cb?.(m);return m;}
export function ae(m,exits){for(const ex of exits){const tp=ex.includes("D")?T.DOOR:ex.includes("B")?T.BOSS_DOOR:T.FLOOR;
  if(ex[0]==="N"){m[0][7]=tp;m[0][8]=tp;}if(ex[0]==="S"){m[RO-1][7]=tp;m[RO-1][8]=tp;}
  if(ex[0]==="E"){m[5][CO-1]=tp;m[6][CO-1]=tp;}if(ex[0]==="W"){m[5][0]=tp;m[6][0]=tp;}}}
export function oe(m,s,t2){const t=t2||T.GRASS;
  if(s==="N"){for(let c=5;c<=10;c++){m[0][c]=t;m[1][c]=T.PATH;m[2][c]=T.PATH;}}
  if(s==="S"){for(let c=5;c<=10;c++){m[RO-1][c]=t;m[RO-2][c]=T.PATH;m[RO-3][c]=T.PATH;}}
  if(s==="W"){for(let r=3;r<=8;r++){m[r][0]=t;m[r][1]=T.PATH;m[r][2]=T.PATH;}}
  if(s==="E"){for(let r=3;r<=8;r++){m[r][CO-1]=t;m[r][CO-2]=T.PATH;m[r][CO-3]=T.PATH;}}}
