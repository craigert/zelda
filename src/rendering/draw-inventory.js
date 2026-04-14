import { T, TL, CO, RO, W2, H2, HH } from '../constants.js';
import { hs } from '../utils/helpers.js';
import { dP } from './draw-player.js';
import { dH } from './draw-hud.js';
import { OW, OW_EN } from '../data/overworld.js';
import { DG, DE } from '../data/dungeons.js';

const FH=H2+HH;
const tCols={[T.GRASS]:"#4aaa3a",[T.WATER]:"#2266aa",[T.TREE]:"#1a5a1a",[T.SAND]:"#d4b060",[T.PATH]:"#a08050",[T.ROCK]:"#777",[T.FLOWER]:"#4aaa3a",[T.BUSH]:"#2a7a2a",[T.TALLGRASS]:"#3a9a3a",[T.BRIDGE]:"#8b6914",[T.ICE]:"#aaddff",[T.ENTRANCE]:"#c8a030",[T.WALL]:"#555",[T.CRACK]:"#666",[T.EMPTY]:"#181818",[T.STUMP]:"#5a3a1a",[T.FLOOR]:"#555",[T.NPC]:"#4aaa3a",[T.HEART_PIECE]:"#f66",[T.MASTER_KEY]:"#c070ff",[T.SPIKE]:"#888",[T.PIT]:"#222",[T.TORCH]:"#f80",[T.DOOR]:"#8a6a2a",[T.BOSS_DOOR]:"#a04040",[T.KEY]:"#fd3",[T.HEART]:"#f44",[T.BOMB]:"#88f",[T.RUPEE]:"#4f4",[T.TRIFORCE]:"#fd3",[T.BOW]:"#8a6a2a",[T.BOMB_BAG]:"#8a6a2a",[T.MASTER_SWORD]:"#88ccff",[T.BANANA]:"#fd3",[T.LEDGE_S]:"#444",[T.LEDGE_N]:"#444",[T.LEDGE_E]:"#444",[T.LEDGE_W]:"#444",[T.LEVER]:"#a66",[T.PLATE]:"#999",[T.PUSH]:"#777",[T.TSWITCH]:"#aa8",[T.STAIRS_UP]:"#aa8844",[T.LADDER]:"#8a6a3a",[T.LOW_FLOOR]:"#333",[T.HOT_SPRING]:"#40a8a0",[T.HOOKPOST]:"#5a5a6a"};

// ========== SHARED CHROME ==========
function drawFrame(c,t){
  // Dark background with parchment texture
  c.fillStyle="rgba(8,6,16,0.97)";c.fillRect(0,0,W2,FH);
  // Subtle texture dots
  for(let i=0;i<80;i++){
    const dx=hs(i,0,200)*W2,dy=hs(i,1,201)*FH;
    c.fillStyle=`rgba(40,35,25,${0.3+hs(i,2,202)*0.4})`;
    c.beginPath();c.arc(dx,dy,0.8+hs(i,3,203)*0.6,0,Math.PI*2);c.fill();
  }
  // Outer gold border
  c.strokeStyle="#b8962a";c.lineWidth=2;c.strokeRect(6,6,W2-12,FH-12);
  // Inner gold border
  c.strokeStyle="#7a621a";c.lineWidth=1;c.strokeRect(10,10,W2-20,FH-20);
  // Corner ornaments (L-shaped filigree)
  const corners=[[12,12,1,1],[W2-12,12,-1,1],[12,FH-12,1,-1],[W2-12,FH-12,-1,-1]];
  c.fillStyle="#b8962a";
  for(const[cx,cy,sx,sy]of corners){
    c.fillRect(cx,cy,8*sx,2*sy);c.fillRect(cx,cy,2*sx,8*sy);
    c.fillRect(cx+3*sx,cy+3*sy,1*sx,4*sy);c.fillRect(cx+3*sx,cy+3*sy,4*sx,1*sy);
  }
}

function drawTabs(c,s){
  const tabs=["MAP","GEAR"];
  for(let i=0;i<2;i++){
    const tx=18+i*84,ty=14,tw=78,th=20;
    const active=s.mapTab===i;
    if(active){
      const g=c.createLinearGradient(tx,ty,tx,ty+th);
      g.addColorStop(0,"#d4a820");g.addColorStop(1,"#a07810");
      c.fillStyle=g;
      c.beginPath();c.moveTo(tx+4,ty);c.lineTo(tx+tw-4,ty);c.quadraticCurveTo(tx+tw,ty,tx+tw,ty+4);
      c.lineTo(tx+tw,ty+th);c.lineTo(tx,ty+th);c.lineTo(tx,ty+4);c.quadraticCurveTo(tx,ty,tx+4,ty);c.fill();
      c.fillStyle="#1a1408";
    }else{
      c.strokeStyle="#7a621a";c.lineWidth=1;
      c.beginPath();c.moveTo(tx+4,ty);c.lineTo(tx+tw-4,ty);c.quadraticCurveTo(tx+tw,ty,tx+tw,ty+4);
      c.lineTo(tx+tw,ty+th);c.lineTo(tx,ty+th);c.lineTo(tx,ty+4);c.quadraticCurveTo(tx,ty,tx+4,ty);c.stroke();
      c.fillStyle="#b8962a";
    }
    c.font="bold 11px monospace";c.textAlign="center";c.fillText(tabs[i],tx+tw/2,ty+14);
  }
  // Close hint
  c.fillStyle="#555";c.font="8px monospace";c.textAlign="right";c.fillText("Tab/I to close  \u25c0 \u25b6 switch",W2-18,28);
  c.textAlign="left";
  // Divider line under tabs
  c.strokeStyle="#7a621a";c.lineWidth=1;c.beginPath();c.moveTo(14,36);c.lineTo(W2-14,36);c.stroke();
}

function drawDivider(c,y,label){
  c.strokeStyle="rgba(184,150,42,0.4)";c.lineWidth=1;
  if(label){
    c.font="bold 9px monospace";const tw=c.measureText(label).width;
    const cx=W2/2,hw=tw/2+12;
    c.beginPath();c.moveTo(20,y);c.lineTo(cx-hw,y);c.stroke();
    c.beginPath();c.moveTo(cx+hw,y);c.lineTo(W2-20,y);c.stroke();
    // Diamond
    c.fillStyle="#b8962a";
    c.beginPath();c.moveTo(cx-hw-4,y);c.lineTo(cx-hw,y-3);c.lineTo(cx-hw+4,y);c.lineTo(cx-hw,y+3);c.fill();
    c.beginPath();c.moveTo(cx+hw-4,y);c.lineTo(cx+hw,y-3);c.lineTo(cx+hw+4,y);c.lineTo(cx+hw,y+3);c.fill();
    c.fillStyle="#d4a820";c.textAlign="center";c.fillText(label,cx,y+3);c.textAlign="left";
  }else{
    c.beginPath();c.moveTo(20,y);c.lineTo(W2-20,y);c.stroke();
    // Center diamond
    c.fillStyle="#b8962a";c.beginPath();c.moveTo(W2/2-4,y);c.lineTo(W2/2,y-3);c.lineTo(W2/2+4,y);c.lineTo(W2/2,y+3);c.fill();
  }
}

function drawSectionTitle(c,y,text){
  c.textAlign="center";
  c.fillStyle="#fd3";c.font="bold 14px monospace";c.fillText(text,W2/2,y);
  // Decorative lines
  const tw=c.measureText(text).width/2+8;
  c.strokeStyle="rgba(253,211,51,0.3)";c.lineWidth=1;
  c.beginPath();c.moveTo(W2/2-tw-40,y-3);c.lineTo(W2/2-tw,y-3);c.stroke();
  c.beginPath();c.moveTo(W2/2+tw,y-3);c.lineTo(W2/2+tw+40,y-3);c.stroke();
  c.textAlign="left";
}

// ========== TAB 0: MAP ==========
function drawMapPage(c,s,t){
  // Evenly spaced: usable 36→406 (370px), 5 sections
  drawSectionTitle(c,50,"OVERWORLD");
  drawOverworldMap(c,s,t);// map at y=66, 136px tall → ends ~202, S label ~214
  drawDivider(c,220);
  drawQuickStats(c,s,226);
  drawDivider(c,258,"DUNGEONS");
  drawDungeonProgressPolished(c,s,t);
  drawDivider(c,340,"SECRETS");
  drawSecretsRow(c,s,t);
}

function drawOverworldMap(c,s,t){
  const owCoords=Object.keys(OW).map(k=>k.split(",").map(Number));
  const onX=Math.min(...owCoords.map(c2=>c2[0])),oxX=Math.max(...owCoords.map(c2=>c2[0]));
  const onY=Math.min(...owCoords.map(c2=>c2[1])),oxY=Math.max(...owCoords.map(c2=>c2[1]));
  const cols=oxX-onX+1,rows=oxY-onY+1;
  // Scale cells to fit within 440px wide, 140px tall
  const cW=Math.min(48,Math.floor(440/cols)),cH=Math.min(34,Math.floor(140/rows));
  const gW=cols*cW,gH=rows*cH;
  const omX=Math.floor(W2/2-gW/2),omY=66;

  // Map background with subtle border
  c.fillStyle="rgba(0,0,0,0.5)";c.fillRect(omX-4,omY-4,gW+8,gH+8);
  c.strokeStyle="rgba(184,150,42,0.4)";c.lineWidth=1;c.strokeRect(omX-4,omY-4,gW+8,gH+8);

  const owKeys=Object.keys(OW);
  for(const ok of owKeys){
    const[cx,cy]=ok.split(",").map(Number);
    const rx=omX+(cx-onX)*cW,ry=omY+(cy-onY)*cH;
    const tiles=OW[ok];
    if(tiles){
      // Draw 3px per tile for 16x12 = 48x36
      const tw=cW/16,th=cH/12;
      for(let ty2=0;ty2<12;ty2++)for(let tx2=0;tx2<16;tx2++){
        const tv=tiles[ty2]?.[tx2]??0;
        c.fillStyle=tCols[tv]||"#333";
        c.fillRect(rx+Math.floor(tx2*tw),ry+Math.floor(ty2*th),Math.ceil(tw),Math.ceil(th));
      }
    }else{
      c.fillStyle="#111";c.fillRect(rx,ry,cW,cH);
    }
    // Screen border
    c.strokeStyle="rgba(0,0,0,0.6)";c.lineWidth=0.5;c.strokeRect(rx,ry,cW,cH);
    // Current screen — subtle white pulse, no yellow box
    if(ok===s.loc.scr){
      const pa=0.2+Math.sin(t/400)*0.1;
      c.strokeStyle=`rgba(255,255,255,${pa})`;c.lineWidth=1;c.strokeRect(rx,ry,cW,cH);
    }
  }
  // Grid lines
  c.strokeStyle="rgba(184,150,42,0.08)";c.lineWidth=0.5;
  for(let gx=0;gx<=oxX-onX+1;gx++){const lx=omX+gx*cW;c.beginPath();c.moveTo(lx,omY);c.lineTo(lx,omY+gH);c.stroke();}
  for(let gy=0;gy<=oxY-onY+1;gy++){const ly=omY+gy*cH;c.beginPath();c.moveTo(omX,ly);c.lineTo(omX+gW,ly);c.stroke();}
  // Dungeon entrance markers
  for(let di=0;di<DE.length;di++){
    const de=DE[di];
    const[dx,dy]=de.s.split(",").map(Number);
    const ex=omX+(dx-onX)*cW+cW/2,ey=omY+(dy-onY)*cH+cH/2;
    const isOpen=di<3||s.finalOpen;
    // Castle/door icon
    c.fillStyle=isOpen?(di===3?"#f0f":"#fd3"):"#444";
    // Small house shape
    c.beginPath();c.moveTo(ex-4,ey+3);c.lineTo(ex-4,ey-1);c.lineTo(ex,ey-4);c.lineTo(ex+4,ey-1);c.lineTo(ex+4,ey+3);c.closePath();c.fill();
    c.fillStyle="rgba(0,0,0,0.5)";c.fillRect(ex-1,ey,2,3);
    // Label below
    const names=["D1","D2","D3","D4"];
    c.fillStyle=isOpen?"#fd3":"#555";c.font="bold 6px monospace";c.textAlign="center";
    c.fillText(names[di],ex,ey+10);
  }
  // Player position
  if(s.loc.ty==="ow"){
    const[px,py]=s.loc.scr.split(",").map(Number);
    const prx=omX+(px-onX)*cW+(s.p.x/(CO*TL))*cW;
    const pry=omY+(py-onY)*cH+(s.p.y/(RO*TL))*cH;
    const blink=Math.floor(t/300)%2===0;
    if(blink){
      // Arrow pointing in player's direction
      c.fillStyle="#fff";c.beginPath();
      const a=[0,-Math.PI/2,Math.PI/2,Math.PI,0][s.p.dir+1]||0;
      c.moveTo(prx+Math.cos(a)*4,pry+Math.sin(a)*4);
      c.lineTo(prx+Math.cos(a+2.3)*3,pry+Math.sin(a+2.3)*3);
      c.lineTo(prx+Math.cos(a-2.3)*3,pry+Math.sin(a-2.3)*3);
      c.fill();
      // Glow
      c.fillStyle="rgba(255,255,255,0.2)";c.beginPath();c.arc(prx,pry,5,0,Math.PI*2);c.fill();
    }
  }
  // Compass rose — outside the map
  c.fillStyle="rgba(184,150,42,0.5)";c.font="bold 7px monospace";c.textAlign="center";
  c.fillText("N",omX+gW/2,omY-8);c.fillText("S",omX+gW/2,omY+gH+12);
  c.textAlign="right";c.fillText("W",omX-8,omY+gH/2+3);
  c.textAlign="left";c.fillText("E",omX+gW+8,omY+gH/2+3);
  c.textAlign="left";
}

function drawDungeonMap(c,s,t){
  const dg=s.dg[s.loc.di];if(!dg)return;
  const rks=Object.keys(dg.rooms);const cds=rks.map(k=>k.split(",").map(Number));
  const nX=Math.min(...cds.map(c2=>c2[0])),xX=Math.max(...cds.map(c2=>c2[0]));
  const nY=Math.min(...cds.map(c2=>c2[1])),xY=Math.max(...cds.map(c2=>c2[1]));
  const ms=26,mp=8;
  const mW=(xX-nX+1)*ms+mp*2,mH=(xY-nY+1)*ms+mp*2;
  const mmX=W2/2-mW/2,mmY=62;

  c.fillStyle="rgba(0,0,0,0.5)";c.fillRect(mmX-3,mmY-3,mW+6,mH+6);
  c.strokeStyle="rgba(184,150,42,0.4)";c.lineWidth=1;c.strokeRect(mmX-3,mmY-3,mW+6,mH+6);

  // Draw connections between rooms
  c.strokeStyle="rgba(150,130,80,0.3)";c.lineWidth=2;
  for(const rk of rks){
    const[rx,ry]=rk.split(",").map(Number);
    const cx=mmX+mp+(rx-nX)*ms+ms/2,cy=mmY+mp+(ry-nY)*ms+ms/2;
    // Check adjacent rooms
    for(const[dx,dy]of[[1,0],[0,1]]){
      const nk=`${rx+dx},${ry+dy}`;
      if(dg.rooms[nk]){
        const nx=mmX+mp+(rx+dx-nX)*ms+ms/2,ny=mmY+mp+(ry+dy-nY)*ms+ms/2;
        c.beginPath();c.moveTo(cx,cy);c.lineTo(nx,ny);c.stroke();
      }
    }
  }

  for(const rk of rks){
    const[cx2,cy2]=rk.split(",").map(Number);
    const rx=mmX+mp+(cx2-nX)*ms,ry=mmY+mp+(cy2-nY)*ms;
    const cleared=s.cl.has(`dg:${s.loc.di}:${rk}`);
    const isCurrent=rk===s.loc.scr;
    // Room fill
    if(isCurrent){
      const g=c.createLinearGradient(rx,ry,rx+ms,ry+ms);
      g.addColorStop(0,"#fd3");g.addColorStop(1,"#c8a020");c.fillStyle=g;
    }else{
      c.fillStyle=cleared?"#3a5a2a":"#3a3a3a";
    }
    c.fillRect(rx+2,ry+2,ms-4,ms-4);
    // Room border
    c.strokeStyle=isCurrent?"#ffe866":"rgba(150,130,80,0.4)";c.lineWidth=isCurrent?1.5:0.5;
    c.strokeRect(rx+2,ry+2,ms-4,ms-4);
    // Boss room marker
    const rm=dg.rooms[rk];
    if(rm?.enemies?.some(e=>e.type==="boss")){
      c.fillStyle="#f44";
      // Skull icon
      c.beginPath();c.arc(rx+ms/2,ry+ms/2-1,4,0,Math.PI*2);c.fill();
      c.fillStyle="#000";c.fillRect(rx+ms/2-2,ry+ms/2-2,1.5,1.5);c.fillRect(rx+ms/2+1,ry+ms/2-2,1.5,1.5);
    }
    // Stairs marker
    if(rm?.tiles?.some(r=>r.includes(T.STAIRS_UP))){
      c.fillStyle="#aa8844";c.font="bold 8px monospace";c.textAlign="center";
      c.fillText("\u25b2",rx+ms/2,ry+ms/2+3);c.textAlign="left";
    }
    // Master key marker
    if(rm?.tiles?.some(r=>r.includes(T.MASTER_KEY))){
      const found=s.p.masterKey[s.loc.di];
      c.fillStyle=found?"#555":"#c070ff";
      if(!found){c.font="bold 8px monospace";c.textAlign="center";c.fillText("\u2605",rx+ms/2,ry+ms/2+3);c.textAlign="left";}
    }
  }
  // Current room blink
  if(Math.floor(t/400)%2===0){
    const[rx2,ry2]=s.loc.scr.split(",").map(Number);
    const bx=mmX+mp+(rx2-nX)*ms,by=mmY+mp+(ry2-nY)*ms;
    c.strokeStyle="rgba(255,255,255,0.6)";c.lineWidth=1;c.strokeRect(bx+1,by+1,ms-2,ms-2);
  }
}

function drawQuickStats(c,s,yPos){
  const y=yPos||222,p=s.p;
  c.fillStyle="rgba(0,0,0,0.3)";c.fillRect(20,y-2,W2-40,30);
  const stats=[
    {draw:(cx,cy)=>{c.fillStyle="#ee3333";dH(c,cx-6,cy-6,12);},val:`${Math.ceil(p.hp/2)}/${Math.ceil(p.mhp/2)}`,col:"#f44"},
    {draw:(cx,cy)=>{
      // Key icon
      c.fillStyle="#fd3";c.beginPath();c.arc(cx,cy-2,3,0,Math.PI*2);c.fill();
      c.fillRect(cx-1,cy+1,2,6);c.fillRect(cx,cy+4,3,1.5);c.fillRect(cx,cy+6,2,1.5);
    },val:`${p.keys}`,col:"#fd3"},
    {draw:(cx,cy)=>{
      // Bomb icon
      c.fillStyle="#335";c.beginPath();c.arc(cx,cy+1,4,0,Math.PI*2);c.fill();
      c.fillStyle="#88f";c.beginPath();c.arc(cx-1,cy,3,0,Math.PI*2);c.fill();
      c.strokeStyle="#fa3";c.lineWidth=1;c.beginPath();c.moveTo(cx+2,cy-3);c.lineTo(cx+3,cy-5);c.stroke();
    },val:`${p.bombs}`,col:"#8af"},
    {draw:(cx,cy)=>{
      // Rupee icon
      c.fillStyle="#4f4";c.beginPath();c.moveTo(cx,cy-5);c.lineTo(cx+3,cy);c.lineTo(cx,cy+5);c.lineTo(cx-3,cy);c.closePath();c.fill();
      c.fillStyle="rgba(255,255,255,0.3)";c.beginPath();c.moveTo(cx,cy-3);c.lineTo(cx+2,cy);c.lineTo(cx,cy);c.closePath();c.fill();
    },val:`${p.rupees}`,col:"#4f4"},
  ];
  const sw=W2-40,gap=sw/stats.length;
  c.font="bold 11px monospace";c.textAlign="center";
  for(let i=0;i<stats.length;i++){
    const cx=40+i*gap+gap/2,cy=y+12;
    stats[i].draw(cx-20,cy);
    c.fillStyle=stats[i].col;c.fillText(stats[i].val,cx+4,cy+4);
  }
  c.textAlign="left";
}

function drawDungeonProgressPolished(c,s,t){
  const y=266;
  const dungeons=[
    {name:"Forest Temple",col:"#3a8830",di:0},
    {name:"Fire Cavern",col:"#d84020",di:1},
    {name:"Shadow Keep",col:"#6060cc",di:2},
    {name:"Dark Sanctum",col:"#c040c0",di:3},
  ];
  const cellW=W2/4-18,startX=22;
  c.textAlign="center";
  for(let i=0;i<4;i++){
    const d=dungeons[i];
    const bx=startX+i*(cellW+8),cx2=bx+cellW/2;
    // Cell bg with gradient
    const bg=c.createLinearGradient(bx,y,bx,y+60);
    bg.addColorStop(0,"rgba(0,0,0,0.3)");bg.addColorStop(1,"rgba(0,0,0,0.15)");
    c.fillStyle=bg;c.fillRect(bx,y,cellW,60);
    // Color accent bar
    c.fillStyle=d.col;c.fillRect(bx,y,cellW,2);
    // Border
    c.strokeStyle=`${d.col}55`;c.lineWidth=0.5;c.strokeRect(bx,y,cellW,60);
    // Name
    c.fillStyle="#ddd";c.font="bold 7px monospace";c.fillText(d.name,cx2,y+13);
    // Icons row
    const iy=y+20;
    // Triforce (D1-D3)
    if(d.di<3){
      c.fillStyle=s.p.tri[d.di]?"#fd3":"#2a2a2a";
      c.beginPath();c.moveTo(cx2-18,iy);c.lineTo(cx2-13,iy+8);c.lineTo(cx2-23,iy+8);c.closePath();c.fill();
      if(s.p.tri[d.di]){c.fillStyle="#ffe866";c.beginPath();c.moveTo(cx2-18,iy+2);c.lineTo(cx2-15,iy+7);c.lineTo(cx2-21,iy+7);c.closePath();c.fill();}
    }else{// D4 — crown icon
      c.fillStyle=s.won?"#fd3":"#2a2a2a";c.font="9px monospace";c.fillText(s.won?"\u2654":"\u265a",cx2-18,iy+8);}
    // Master key
    c.fillStyle=s.p.masterKey[d.di]?"#c070ff":"#2a2a2a";
    c.beginPath();c.arc(cx2,iy+2,3,0,Math.PI*2);c.fill();
    c.fillRect(cx2-0.5,iy+5,1,5);if(s.p.masterKey[d.di]){c.fillRect(cx2,iy+7,2,1);c.fillRect(cx2,iy+9,1.5,1);}
    // Room progress bar
    const dg=s.dg[d.di];let cleared=0,total=0;
    if(dg){const rks=Object.keys(dg.rooms);total=rks.length;for(const rk of rks)if(s.cl.has(`dg:${d.di}:${rk}`))cleared++;}
    const barX=cx2+10,barW=cellW/2-16,barY=iy+2;
    c.fillStyle="rgba(0,0,0,0.4)";c.fillRect(barX,barY,barW,6);
    if(total>0){c.fillStyle=cleared===total?d.col:"#666";c.fillRect(barX,barY,barW*(cleared/total),6);}
    c.fillStyle="#999";c.font="6px monospace";c.fillText(`${cleared}/${total}`,cx2+10+barW/2,iy+16);
    // Labels
    c.fillStyle="#555";c.font="5px monospace";
    if(d.di<3)c.fillText("\u25b2",cx2-18,iy+16);
    c.fillText("\u2605",cx2,iy+16);
  }
  c.textAlign="left";
}

function drawSecretsRow(c,s,t){
  const y=348;
  const secrets=countSecrets(s);
  c.textAlign="center";
  // Count text
  c.fillStyle="#aaa";c.font="bold 9px monospace";c.fillText(`${secrets.found} / ${secrets.total}`,W2/2,y+12);
  // Dots below
  const dotW=secrets.total*16;const startX=W2/2-dotW/2;
  for(let i=0;i<secrets.total;i++){
    const dx=startX+i*16+8,dy=y+26;
    if(i<secrets.found){c.fillStyle="#fd3";c.beginPath();c.arc(dx,dy,4,0,Math.PI*2);c.fill();
      c.fillStyle="#ffe866";c.beginPath();c.arc(dx-1,dy-1,1.5,0,Math.PI*2);c.fill();
    }else{c.strokeStyle="#555";c.lineWidth=1;c.beginPath();c.arc(dx,dy,3,0,Math.PI*2);c.stroke();}
  }
  c.textAlign="left";
}

function countSecrets(s){
  let found=0;const total=10;
  // 8 heart pieces: base mhp=8, bosses add 2 each (tracked in heartContainers), pieces add 2 per 4 collected
  const bossContainers=(s.heartContainers||[]).length;
  const pieceContainers=Math.max(0,(s.p.mhp-8)/2-bossContainers);
  const hpFound=pieceContainers*4+s.p.heartPieces;
  found+=Math.min(8,hpFound);
  // Banana (or already traded for red armor)
  if(s.p.hasBanana||s.p.redArmor)found++;
  // Master Sword
  if(s.p.hasMasterSword)found++;
  return{found,total};
}

// ========== TAB 1: GEAR ==========
function drawGearPage(c,s,t){
  drawSectionTitle(c,50,"EQUIPMENT");
  drawPaperDoll(c,s,t);
  drawEquipGrid(c,s,t);
  drawDivider(c,234,"TRIFORCE & HEARTS");
  drawTriforceAndHearts(c,s,t);
}

// drawHeartProgress removed — merged into drawTriforceAndHearts

function drawPaperDoll(c,s,t){
  const px=30,py=62,pw=190,ph=160;
  // Background panel
  c.fillStyle="rgba(0,0,0,0.35)";c.fillRect(px,py,pw,ph);
  c.strokeStyle="rgba(184,150,42,0.3)";c.lineWidth=1;c.strokeRect(px,py,pw,ph);

  // Draw player at 3x scale, centered
  const pcx=px+pw/2,pcy=py+ph/2-10;
  c.save();
  c.translate(pcx-36,pcy-36);
  c.scale(3,3);
  dP(c,0,0,2,t,s.p.redArmor);
  c.restore();

  // Red armor glow if equipped
  if(s.p.redArmor){
    c.fillStyle="rgba(200,40,40,0.08)";
    c.beginPath();c.arc(pcx,pcy,30,0,Math.PI*2);c.fill();
  }

  // Equipment slots around the character
  const slots=[
    {x:pcx+48,y:pcy-20,label:"WEAPON",has:true,draw:(cx,cy)=>{
      if(s.p.hasMasterSword){
        c.fillStyle="#88ccff";c.fillRect(cx-1,cy-8,3,14);
        c.fillStyle="#ffd633";c.fillRect(cx-4,cy+4,9,3);
        // Glow
        c.fillStyle="rgba(136,204,255,0.3)";c.beginPath();c.arc(cx,cy,10,0,Math.PI*2);c.fill();
      }else{
        c.fillStyle="#b8b8c8";c.fillRect(cx-1,cy-7,3,12);
        c.fillStyle="#8a6830";c.fillRect(cx-3,cy+3,7,3);
      }
    }},
    {x:pcx-48,y:pcy-20,label:"M.SHIELD",has:s.hasShieldUp,draw:(cx,cy)=>{
      if(s.hasShieldUp){
        c.fillStyle="#4488ff";c.beginPath();c.moveTo(cx,cy-7);c.lineTo(cx+6,cy-3);c.lineTo(cx+5,cy+5);c.lineTo(cx,cy+8);c.lineTo(cx-5,cy+5);c.lineTo(cx-6,cy-3);c.closePath();c.fill();
        c.strokeStyle="#fd3";c.lineWidth=1;c.stroke();
        c.fillStyle="#fd3";c.beginPath();c.moveTo(cx,cy-2);c.lineTo(cx+3,cy+3);c.lineTo(cx-3,cy+3);c.closePath();c.fill();
      }else{
        c.strokeStyle="#444";c.lineWidth=1;c.beginPath();c.moveTo(cx,cy-6);c.lineTo(cx+5,cy-2);c.lineTo(cx+4,cy+4);c.lineTo(cx,cy+7);c.lineTo(cx-4,cy+4);c.lineTo(cx-5,cy-2);c.closePath();c.stroke();
        c.fillStyle="#444";c.font="bold 8px monospace";c.textAlign="center";c.fillText("?",cx,cy+3);c.textAlign="left";
      }
    }},
    {x:pcx,y:pcy+50,label:"ARMOR",has:s.p.redArmor,draw:(cx,cy)=>{
      if(s.p.redArmor){
        c.fillStyle="#cc3333";c.beginPath();c.moveTo(cx-5,cy-5);c.lineTo(cx+5,cy-5);c.lineTo(cx+6,cy+5);c.lineTo(cx-6,cy+5);c.closePath();c.fill();
        c.fillStyle="#ff4444";c.fillRect(cx-3,cy-3,6,4);
      }else{
        c.strokeStyle="#444";c.lineWidth=1;c.beginPath();c.moveTo(cx-5,cy-5);c.lineTo(cx+5,cy-5);c.lineTo(cx+6,cy+5);c.lineTo(cx-6,cy+5);c.closePath();c.stroke();
        c.fillStyle="#444";c.font="bold 8px monospace";c.textAlign="center";c.fillText("?",cx,cy+3);c.textAlign="left";
      }
    }},
    {x:pcx+48,y:pcy+20,label:"BOW",has:s.p.hasBow,draw:(cx,cy)=>{
      if(s.p.hasBow){
        c.strokeStyle="#8a6a2a";c.lineWidth=2;c.beginPath();c.arc(cx+2,cy,7,Math.PI*0.7,Math.PI*1.3);c.stroke();
        c.strokeStyle="#fd3";c.lineWidth=1;c.beginPath();c.moveTo(cx-3,cy-6);c.lineTo(cx-3,cy+6);c.stroke();
        // Arrow
        c.fillStyle="#aaa";c.fillRect(cx-6,cy-0.5,8,1);c.fillStyle="#f44";c.beginPath();c.moveTo(cx-6,cy);c.lineTo(cx-3,cy-2);c.lineTo(cx-3,cy+2);c.fill();
      }else{
        c.strokeStyle="#444";c.lineWidth=1;c.beginPath();c.arc(cx+2,cy,6,Math.PI*0.7,Math.PI*1.3);c.stroke();
        c.fillStyle="#444";c.font="bold 8px monospace";c.textAlign="center";c.fillText("?",cx,cy+3);c.textAlign="left";
      }
    }},
  ];

  for(const slot of slots){
    if(!slot.has)continue;// only show acquired equipment
    // Connecting line
    c.strokeStyle="rgba(184,150,42,0.2)";c.lineWidth=1;c.setLineDash([2,2]);
    c.beginPath();c.moveTo(pcx,pcy);c.lineTo(slot.x,slot.y);c.stroke();c.setLineDash([]);
    // Slot box
    c.fillStyle="rgba(253,211,51,0.08)";
    c.fillRect(slot.x-14,slot.y-14,28,28);
    c.strokeStyle="#7a621a";c.lineWidth=1;c.strokeRect(slot.x-14,slot.y-14,28,28);
    // Draw item
    slot.draw(slot.x,slot.y);
    // Label
    c.fillStyle="#b8962a";c.font="bold 6px monospace";c.textAlign="center";
    c.fillText(slot.label,slot.x,slot.y+20);c.textAlign="left";
  }
}

function drawEquipGrid(c,s,t){
  const gx=260,gy=62,gw=230,gh=160;
  c.fillStyle="rgba(0,0,0,0.35)";c.fillRect(gx,gy,gw,gh);
  c.strokeStyle="rgba(184,150,42,0.3)";c.lineWidth=1;c.strokeRect(gx,gy,gw,gh);

  const items=[
    {name:"Sword",has:true,draw:(cx,cy)=>{c.fillStyle="#b8b8c8";c.fillRect(cx-1,cy-6,3,10);c.fillStyle="#8a6830";c.fillRect(cx-3,cy+3,7,2);}},
    {name:"Bow",has:s.p.hasBow,draw:(cx,cy)=>{c.strokeStyle=s.p.hasBow?"#8a6a2a":"#444";c.lineWidth=1.5;c.beginPath();c.arc(cx+1,cy,5,Math.PI*0.7,Math.PI*1.3);c.stroke();}},
    {name:"Bombs",has:s.p.hasBombs,draw:(cx,cy)=>{const col=s.p.hasBombs?"#88f":"#444";c.fillStyle=col;c.beginPath();c.arc(cx,cy+1,4,0,Math.PI*2);c.fill();}},
    {name:"Lantern",has:s.hasLantern,draw:(cx,cy)=>{if(s.hasLantern){c.fillStyle="#fa3";c.beginPath();c.arc(cx,cy-2,3,0,Math.PI*2);c.fill();c.fillStyle="#8a6a2a";c.fillRect(cx-2,cy+1,4,5);}else{c.strokeStyle="#444";c.lineWidth=1;c.beginPath();c.arc(cx,cy-2,3,0,Math.PI*2);c.stroke();c.strokeRect(cx-2,cy+1,4,5);}}},
    {name:s.p.redArmor?"Red Armor":s.p.hasBanana?"Banana":"Armor",has:s.p.redArmor||s.p.hasBanana,draw:(cx,cy)=>{
      if(s.p.redArmor){c.fillStyle="#cc3333";c.beginPath();c.moveTo(cx-4,cy-4);c.lineTo(cx+4,cy-4);c.lineTo(cx+5,cy+4);c.lineTo(cx-5,cy+4);c.closePath();c.fill();}
      else if(s.p.hasBanana){c.fillStyle="#fd3";c.beginPath();c.arc(cx,cy,5,0.3,Math.PI-0.3);c.lineWidth=3;c.strokeStyle="#fa0";c.stroke();c.fillStyle="#e8b020";c.beginPath();c.arc(cx,cy,4,0.4,Math.PI-0.4);c.fill();}
      else{c.strokeStyle="#444";c.lineWidth=1;c.beginPath();c.moveTo(cx-4,cy-4);c.lineTo(cx+4,cy-4);c.lineTo(cx+5,cy+4);c.lineTo(cx-5,cy+4);c.closePath();c.stroke();}}},
    {name:"M.Sword",has:s.p.hasMasterSword,draw:(cx,cy)=>{if(s.p.hasMasterSword){c.fillStyle="#88ccff";c.fillRect(cx-1,cy-6,3,10);c.fillStyle="#ffd633";c.fillRect(cx-3,cy+3,7,2);c.fillStyle="rgba(136,204,255,0.3)";c.beginPath();c.arc(cx,cy,8,0,Math.PI*2);c.fill();}else{c.strokeStyle="#444";c.lineWidth=1;c.beginPath();c.moveTo(cx,cy-6);c.lineTo(cx,cy+4);c.stroke();c.beginPath();c.moveTo(cx-3,cy+3);c.lineTo(cx+3,cy+3);c.stroke();}}},
    {name:"M.Shield",has:s.hasShieldUp,draw:(cx,cy)=>{c.fillStyle=s.hasShieldUp?"#4488ff":"#444";c.beginPath();c.moveTo(cx,cy-5);c.lineTo(cx+4,cy-1);c.lineTo(cx+3,cy+4);c.lineTo(cx,cy+6);c.lineTo(cx-3,cy+4);c.lineTo(cx-4,cy-1);c.closePath();c.fill();if(s.hasShieldUp){c.fillStyle="#fd3";c.beginPath();c.moveTo(cx,cy-1);c.lineTo(cx+2,cy+3);c.lineTo(cx-2,cy+3);c.closePath();c.fill();}}},
    {name:"Jar",has:s.hasJar,draw:(cx,cy)=>{
      const col=s.hasJar?"#6a9abc":"#444";c.fillStyle=col;
      c.beginPath();c.moveTo(cx-4,cy-4);c.quadraticCurveTo(cx-5,cy+2,cx-3,cy+5);c.lineTo(cx+3,cy+5);c.quadraticCurveTo(cx+5,cy+2,cx+4,cy-4);c.closePath();c.fill();
      c.fillStyle=s.hasJar?"#4a7a9a":"#333";c.fillRect(cx-4,cy-5,8,2);
      if(s.hasJar&&s.springWater>0){c.fillStyle="rgba(100,220,255,0.5)";c.beginPath();c.arc(cx,cy+1,3,0,Math.PI*2);c.fill();
        c.fillStyle="#fff";c.font="bold 6px monospace";c.textAlign="center";c.fillText(s.springWater+"",cx,cy+6);c.textAlign="left";}
    }},
    // Bone slot becomes Hookshot once bone is given to dog
    s.dogDug?
    {name:"Hookshot",has:s.p.hasHookshot,draw:(cx,cy)=>{
      if(s.p.hasHookshot){c.strokeStyle="#8a8aaa";c.lineWidth=2;c.beginPath();c.moveTo(cx-4,cy+4);c.lineTo(cx+2,cy-4);c.stroke();
        c.fillStyle="#ccc";c.beginPath();c.moveTo(cx+4,cy-6);c.lineTo(cx,cy-3);c.lineTo(cx+2,cy-1);c.closePath();c.fill();}}}:
    {name:"Bone",has:s.p.hasBone,draw:(cx,cy)=>{
      if(s.p.hasBone){c.fillStyle="#e8dcc8";c.fillRect(cx-5,cy-1,10,3);c.beginPath();c.arc(cx-5,cy,2.5,0,Math.PI*2);c.fill();c.beginPath();c.arc(cx+5,cy,2.5,0,Math.PI*2);c.fill();}}},
  ];

  const cols=3,cellW=72,cellH=48;
  const startX=gx+10,startY=gy+10;
  for(let i=0;i<items.length;i++){
    const col=i%cols,row=Math.floor(i/cols);
    const cx=startX+col*cellW+cellW/2,cy=startY+row*cellH+18;
    const bx=startX+col*cellW+2,by=startY+row*cellH+2;

    if(!items[i].has){
      // Empty cell — subtle dark slot, no icon or label
      c.fillStyle="rgba(0,0,0,0.15)";c.fillRect(bx,by,cellW-4,cellH-4);
      c.strokeStyle="rgba(40,40,40,0.3)";c.lineWidth=0.5;c.strokeRect(bx,by,cellW-4,cellH-4);
    }else{
      // Owned item cell
      c.fillStyle="rgba(253,211,51,0.06)";c.fillRect(bx,by,cellW-4,cellH-4);
      c.strokeStyle="rgba(184,150,42,0.4)";c.lineWidth=0.5;c.strokeRect(bx,by,cellW-4,cellH-4);
      items[i].draw(cx,cy-4);
      c.fillStyle="#fd3";c.font="bold 7px monospace";c.textAlign="right";
      c.fillText("\u2713",bx+cellW-6,by+10);c.textAlign="left";
      c.fillStyle="#b8962a";c.font="7px monospace";c.textAlign="center";
      c.fillText(items[i].name,cx,cy+cellH/2-8);c.textAlign="left";
    }
  }
}

function drawTriforceAndHearts(c,s,t){
  // Side by side: triforce left, heart pieces right, evenly spaced
  const cy=310,triS=45;
  const leftCx=W2/2-80,rightCx=W2/2+80;

  // ===== TRIFORCE (left) =====
  const allCollected=s.p.tri[0]&&s.p.tri[1]&&s.p.tri[2];
  const pieces=[
    {x:leftCx,y:cy-triS*0.5,idx:2,name:"Shadow"},
    {x:leftCx-triS*0.53,y:cy+triS*0.36,idx:0,name:"Forest"},
    {x:leftCx+triS*0.53,y:cy+triS*0.36,idx:1,name:"Fire"},
  ];
  const glow=Math.sin(t/800)*0.08+(allCollected?0.3:0.12);
  const gg=c.createRadialGradient(leftCx,cy,10,leftCx,cy,triS*2);
  gg.addColorStop(0,`rgba(253,211,51,${glow})`);gg.addColorStop(0.5,`rgba(253,211,51,${glow*0.3})`);gg.addColorStop(1,"rgba(253,211,51,0)");
  c.fillStyle=gg;c.beginPath();c.arc(leftCx,cy,triS*2,0,Math.PI*2);c.fill();
  c.strokeStyle=allCollected?"rgba(253,211,51,0.5)":"rgba(80,65,30,0.25)";c.lineWidth=allCollected?2:1;
  c.beginPath();c.moveTo(leftCx,cy-triS*1.02);c.lineTo(leftCx+triS*0.98,cy+triS*0.86);c.lineTo(leftCx-triS*0.98,cy+triS*0.86);c.closePath();c.stroke();
  if(allCollected){for(let i=0;i<6;i++){const a=t/1500+i*Math.PI/3;const sr=triS*1.1;
    const sp=Math.sin(t/300+i*1.5)*0.4+0.6;
    c.fillStyle=`rgba(255,240,180,${sp*0.2})`;c.beginPath();c.arc(leftCx+Math.cos(a)*sr,cy+Math.sin(a)*sr,2,0,Math.PI*2);c.fill();}}
  for(const piece of pieces){
    const collected=s.p.tri[piece.idx];
    c.globalAlpha=collected?Math.sin(t/600+piece.idx*2)*0.1+0.9:1;
    if(collected){
      const pg=c.createRadialGradient(piece.x,piece.y+5,4,piece.x,piece.y+5,triS*0.55);
      pg.addColorStop(0,"rgba(253,211,51,0.35)");pg.addColorStop(1,"rgba(253,211,51,0)");
      c.fillStyle=pg;c.beginPath();c.arc(piece.x,piece.y+5,triS*0.55,0,Math.PI*2);c.fill();
      const tg=c.createLinearGradient(piece.x,piece.y-triS*0.4,piece.x,piece.y+triS*0.4);
      tg.addColorStop(0,"#ffe866");tg.addColorStop(0.35,"#ffd633");tg.addColorStop(1,"#a07014");
      c.fillStyle=tg;
    }else{c.fillStyle="#141414";}
    c.beginPath();c.moveTo(piece.x,piece.y-triS*0.4);
    c.lineTo(piece.x+triS*0.38,piece.y+triS*0.4);
    c.lineTo(piece.x-triS*0.38,piece.y+triS*0.4);c.closePath();c.fill();
    if(!collected){c.strokeStyle="#2a2a2a";c.lineWidth=1;c.stroke();}
    else{
      c.fillStyle="rgba(255,245,200,0.35)";c.beginPath();
      c.moveTo(piece.x,piece.y-triS*0.18);c.lineTo(piece.x+triS*0.16,piece.y+triS*0.18);
      c.lineTo(piece.x-triS*0.16,piece.y+triS*0.18);c.closePath();c.fill();
      c.strokeStyle="rgba(255,230,130,0.25)";c.lineWidth=1.5;
      c.beginPath();c.moveTo(piece.x,piece.y-triS*0.4);c.lineTo(piece.x-triS*0.38,piece.y+triS*0.4);c.stroke();
      const sp2=Math.sin(t/250+piece.idx*2.5)*0.5+0.5;
      c.fillStyle=`rgba(255,255,230,${sp2})`;c.beginPath();c.arc(piece.x-triS*0.06,piece.y-triS*0.08,2.5,0,Math.PI*2);c.fill();
    }
    c.globalAlpha=1;
  }
  const count=s.p.tri.filter(Boolean).length;
  c.fillStyle=allCollected?"#fd3":"#777";c.font="bold 11px monospace";c.textAlign="center";
  c.fillText(`${count} / 3`,leftCx,cy+triS+28);
  if(allCollected){c.fillStyle="#d4a820";c.font="bold 8px monospace";c.fillText("POWER OF THE GODS",leftCx,cy+triS+40);}

  // ===== HEART PIECES (right, same scale as triforce) =====
  const hsz=58,hx=rightCx-hsz/2,hy=cy-hsz/2-4;
  const hp=s.p.heartPieces;
  // Glow
  const hglow=Math.sin(t/800)*0.06+0.1;
  const hgg=c.createRadialGradient(rightCx,cy,5,rightCx,cy,hsz*1.5);
  hgg.addColorStop(0,`rgba(238,51,51,${hglow})`);hgg.addColorStop(1,"rgba(238,51,51,0)");
  c.fillStyle=hgg;c.beginPath();c.arc(rightCx,cy,hsz*1.5,0,Math.PI*2);c.fill();
  // 4 quadrants
  for(let q=0;q<4;q++){
    c.save();
    if(q===0)c.beginPath(),c.rect(hx,hy,hsz/2,hsz/2),c.clip();
    else if(q===1)c.beginPath(),c.rect(hx+hsz/2,hy,hsz/2,hsz/2),c.clip();
    else if(q===2)c.beginPath(),c.rect(hx,hy+hsz/2,hsz/2,hsz/2),c.clip();
    else c.beginPath(),c.rect(hx+hsz/2,hy+hsz/2,hsz/2,hsz/2),c.clip();
    c.fillStyle=q<hp?"#ee3333":"#222";dH(c,hx,hy,hsz);
    c.restore();
  }
  // Outline
  c.strokeStyle="#666";c.lineWidth=1.5;
  c.beginPath();c.moveTo(hx+hsz/2,hy+hsz*.85);
  c.bezierCurveTo(hx,hy+hsz*.5,hx,hy,hx+hsz/2,hy+hsz*.2);
  c.bezierCurveTo(hx+hsz,hy,hx+hsz,hy+hsz*.5,hx+hsz/2,hy+hsz*.85);c.stroke();
  // Quarter lines
  c.strokeStyle="rgba(100,100,100,0.4)";c.lineWidth=0.8;
  c.beginPath();c.moveTo(hx+hsz/2,hy+4);c.lineTo(hx+hsz/2,hy+hsz-4);c.stroke();
  c.beginPath();c.moveTo(hx+6,hy+hsz/2);c.lineTo(hx+hsz-6,hy+hsz/2);c.stroke();
  // Shine
  if(hp>0){c.fillStyle="rgba(255,150,150,0.2)";c.beginPath();c.arc(hx+hsz*0.35,hy+hsz*0.3,hsz*0.15,0,Math.PI*2);c.fill();}
  // Label
  c.fillStyle="#aaa";c.font="bold 11px monospace";
  c.fillText(`${hp} / 4`,rightCx,cy+hsz/2+16);
  c.textAlign="left";
}

function drawDungeonProgress(c,s,t){
  const y=336;
  const dungeons=[
    {name:"Forest",col:"#3a8830",th:"forest",di:0},
    {name:"Fire",col:"#d84020",th:"fire",di:1},
    {name:"Shadow",col:"#6060cc",th:"shadow",di:2},
    {name:"Sanctum",col:"#c040c0",th:"final",di:3},
  ];
  const cellW=112,startX=W2/2-dungeons.length*cellW/2;
  for(let i=0;i<dungeons.length;i++){
    const d=dungeons[i];
    const cx=startX+i*cellW+cellW/2,bx=startX+i*cellW+4;
    // Cell background
    c.fillStyle="rgba(0,0,0,0.25)";c.fillRect(bx,y,cellW-8,36);
    c.strokeStyle="rgba(184,150,42,0.2)";c.lineWidth=0.5;c.strokeRect(bx,y,cellW-8,36);
    // Dungeon name
    c.fillStyle=d.col;c.font="bold 8px monospace";c.textAlign="center";
    c.fillText(d.name,cx,y+10);
    // Master key icon
    c.fillStyle=s.p.masterKey[d.di]?"#c070ff":"#333";
    c.font="8px monospace";c.fillText(s.p.masterKey[d.di]?"\u2605":"\u2606",cx-15,y+24);
    // Triforce icon (not for D4)
    if(d.di<3){
      c.fillStyle=s.p.tri[d.di]?"#fd3":"#333";
      c.beginPath();c.moveTo(cx+2,y+17);c.lineTo(cx+7,y+25);c.lineTo(cx-3,y+25);c.closePath();c.fill();
    }
    // Room count
    const dg=s.dg[d.di];if(dg){
      const rks=Object.keys(dg.rooms);
      const cleared=rks.filter(rk=>s.cl.has(`dg:${d.di}:${rk}`)).length;
      c.fillStyle="#666";c.font="7px monospace";
      c.fillText(`${cleared}/${rks.length}`,cx+15,y+24);
    }
  }
  c.textAlign="left";
}


// ========== MAIN EXPORT ==========
export function drawInventoryScreen(c,s,t){
  drawFrame(c,t);
  drawTabs(c,s);
  if(s.mapTab===0){drawMapPage(c,s,t);}
  else{drawGearPage(c,s,t);}
}
