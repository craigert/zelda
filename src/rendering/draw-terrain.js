import { T, TL, CO, RO } from '../constants.js';
import { hs } from '../utils/helpers.js';

export function drawTerrainOverlay(c,m,t){
  if(!m)return;
  // For each tile, draw soft organic extensions that overlap neighbors of same type
  // This breaks up the grid pattern and creates flowing landscape feel
  const tColor=(tl)=>{
    if(tl===T.GRASS||tl===T.FLOWER||tl===T.TALLGRASS||tl===T.BUSH||tl===T.STUMP)return["#44aa38","#3ca030","#38982e"];
    if(tl===T.WATER)return["#3070b8","#2860a0","#205088"];
    if(tl===T.PATH||tl===T.BRIDGE)return["#d0b880","#c0a870","#b09860"];
    if(tl===T.SAND)return["#e0cc68","#d4c058","#c8b448"];
    if(tl===T.TREE)return["#2a8020","#248018","#1e7010"];
    return null;
  };
  const tGrp=(tl)=>{
    if(tl===T.WATER)return 1;
    if(tl===T.PATH||tl===T.BRIDGE)return 2;
    if(tl===T.SAND)return 3;
    if(tl===T.GRASS||tl===T.FLOWER||tl===T.TALLGRASS||tl===T.BUSH||tl===T.STUMP||tl===T.TREE)return 0;
    return-1;
  };
  const isWater=(tl)=>tl===T.WATER;
  const isLand=(tl)=>tl!==T.WATER&&tl!==undefined;

  // PASS 0: Water shoreline transitions
  for(let y=0;y<RO;y++)for(let x=0;x<CO;x++){
    const tl=m[y][x];
    if(!isWater(tl))continue;
    const px2=x*TL,py2=y*TL;
    // Check all 8 neighbors for land tiles
    const dirs=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]];
    let hasLandNeighbor=false;
    for(const[dx,dy]of dirs){
      const nx=x+dx,ny=y+dy;
      if(nx<0||nx>=CO||ny<0||ny>=RO)continue;
      if(isLand(m[ny][nx])){hasLandNeighbor=true;break;}
    }
    if(!hasLandNeighbor)continue;
    // Draw shoreline edges from land into water
    // Check cardinal neighbors
    const top=(y>0&&isLand(m[y-1][x]));
    const bot=(y<RO-1&&isLand(m[y+1][x]));
    const lft=(x>0&&isLand(m[y][x-1]));
    const rgt=(x<CO-1&&isLand(m[y][x+1]));
    // Check diagonals
    const tl2=(y>0&&x>0&&isLand(m[y-1][x-1]));
    const tr=(y>0&&x<CO-1&&isLand(m[y-1][x+1]));
    const bl=(y<RO-1&&x>0&&isLand(m[y+1][x-1]));
    const br=(y<RO-1&&x<CO-1&&isLand(m[y+1][x+1]));

    c.save();
    // Sandy shore color
    const shoreW=7; // shore width in pixels
    // Top edge
    if(top){
      const grad=c.createLinearGradient(px2,py2,px2,py2+shoreW+2);
      grad.addColorStop(0,"rgba(196,166,104,0.7)");
      grad.addColorStop(0.4,"rgba(168,148,90,0.5)");
      grad.addColorStop(0.7,"rgba(138,122,80,0.25)");
      grad.addColorStop(1,"rgba(138,122,80,0)");
      c.fillStyle=grad;
      // Irregular shape with arcs
      c.beginPath();c.moveTo(px2,py2);
      const n1=hs(x,y,500)*2,n2=hs(x,y,501)*2,n3=hs(x,y,502)*2;
      c.lineTo(px2+TL,py2);
      c.lineTo(px2+TL,py2+shoreW+n3);
      c.quadraticCurveTo(px2+TL*0.75,py2+shoreW-1+n2,px2+TL*0.5,py2+shoreW+1+n1);
      c.quadraticCurveTo(px2+TL*0.25,py2+shoreW+2+n2,px2,py2+shoreW+n1);
      c.fill();
    }
    // Bottom edge
    if(bot){
      const grad=c.createLinearGradient(px2,py2+TL,px2,py2+TL-shoreW-2);
      grad.addColorStop(0,"rgba(196,166,104,0.7)");
      grad.addColorStop(0.4,"rgba(168,148,90,0.5)");
      grad.addColorStop(0.7,"rgba(138,122,80,0.25)");
      grad.addColorStop(1,"rgba(138,122,80,0)");
      c.fillStyle=grad;
      c.beginPath();c.moveTo(px2,py2+TL);
      const n1=hs(x,y,510)*2,n2=hs(x,y,511)*2,n3=hs(x,y,512)*2;
      c.lineTo(px2+TL,py2+TL);
      c.lineTo(px2+TL,py2+TL-shoreW-n3);
      c.quadraticCurveTo(px2+TL*0.75,py2+TL-shoreW+1-n2,px2+TL*0.5,py2+TL-shoreW-1-n1);
      c.quadraticCurveTo(px2+TL*0.25,py2+TL-shoreW-2-n2,px2,py2+TL-shoreW-n1);
      c.fill();
    }
    // Left edge
    if(lft){
      const grad=c.createLinearGradient(px2,py2,px2+shoreW+2,py2);
      grad.addColorStop(0,"rgba(196,166,104,0.7)");
      grad.addColorStop(0.4,"rgba(168,148,90,0.5)");
      grad.addColorStop(0.7,"rgba(138,122,80,0.25)");
      grad.addColorStop(1,"rgba(138,122,80,0)");
      c.fillStyle=grad;
      c.beginPath();c.moveTo(px2,py2);
      const n1=hs(x,y,520)*2,n2=hs(x,y,521)*2,n3=hs(x,y,522)*2;
      c.lineTo(px2,py2+TL);
      c.lineTo(px2+shoreW+n3,py2+TL);
      c.quadraticCurveTo(px2+shoreW-1+n2,py2+TL*0.75,px2+shoreW+1+n1,py2+TL*0.5);
      c.quadraticCurveTo(px2+shoreW+2+n2,py2+TL*0.25,px2+shoreW+n1,py2);
      c.fill();
    }
    // Right edge
    if(rgt){
      const grad=c.createLinearGradient(px2+TL,py2,px2+TL-shoreW-2,py2);
      grad.addColorStop(0,"rgba(196,166,104,0.7)");
      grad.addColorStop(0.4,"rgba(168,148,90,0.5)");
      grad.addColorStop(0.7,"rgba(138,122,80,0.25)");
      grad.addColorStop(1,"rgba(138,122,80,0)");
      c.fillStyle=grad;
      c.beginPath();c.moveTo(px2+TL,py2);
      const n1=hs(x,y,530)*2,n2=hs(x,y,531)*2,n3=hs(x,y,532)*2;
      c.lineTo(px2+TL,py2+TL);
      c.lineTo(px2+TL-shoreW-n3,py2+TL);
      c.quadraticCurveTo(px2+TL-shoreW+1-n2,py2+TL*0.75,px2+TL-shoreW-1-n1,py2+TL*0.5);
      c.quadraticCurveTo(px2+TL-shoreW-2-n2,py2+TL*0.25,px2+TL-shoreW-n1,py2);
      c.fill();
    }
    // Diagonal corners — small rounded corner fill
    const cornerR=5;
    if(tl2&&!top&&!lft){
      c.fillStyle="rgba(196,166,104,0.45)";
      c.beginPath();c.arc(px2,py2,cornerR+hs(x,y,540)*2,0,Math.PI*0.5);c.lineTo(px2,py2);c.fill();
    }
    if(tr&&!top&&!rgt){
      c.fillStyle="rgba(196,166,104,0.45)";
      c.beginPath();c.arc(px2+TL,py2,cornerR+hs(x,y,541)*2,Math.PI*0.5,Math.PI);c.lineTo(px2+TL,py2);c.fill();
    }
    if(bl&&!bot&&!lft){
      c.fillStyle="rgba(196,166,104,0.45)";
      c.beginPath();c.arc(px2,py2+TL,cornerR+hs(x,y,542)*2,Math.PI*1.5,Math.PI*2);c.lineTo(px2,py2+TL);c.fill();
    }
    if(br&&!bot&&!rgt){
      c.fillStyle="rgba(196,166,104,0.45)";
      c.beginPath();c.arc(px2+TL,py2+TL,cornerR+hs(x,y,543)*2,Math.PI,Math.PI*1.5);c.lineTo(px2+TL,py2+TL);c.fill();
    }
    c.restore();
  }

  // PASS 1: Organic same-type connections — draw soft blobs between adjacent same-type tiles
  for(let y=0;y<RO;y++)for(let x=0;x<CO;x++){
    const tl=m[y][x];const g=tGrp(tl);if(g<0)continue;
    const cols=tColor(tl);if(!cols)continue;
    const cx2=x*TL+TL/2,cy2=y*TL+TL/2;
    // Check each neighbor — if same group, draw connecting blob
    const dirs=[[1,0],[0,1],[1,1],[1,-1]];
    for(const[dx2,dy2]of dirs){
      const nx=x+dx2,ny=y+dy2;
      if(nx<0||nx>=CO||ny<0||ny>=RO)continue;
      if(tGrp(m[ny][nx])!==g)continue;
      // Draw organic connecting blob between tile centers
      const nx2=nx*TL+TL/2,ny2=ny*TL+TL/2;
      const mx2=(cx2+nx2)/2,my2=(cy2+ny2)/2;
      // Noise offset for organic feel
      const nox=hs(x*7+y*13,nx*11+ny*17,42)*8-4;
      const noy=hs(x*11+y*7,nx*17+ny*11,43)*8-4;
      const r=TL*0.45+hs(x*3+y*5,nx*5+ny*3,44)*6;
      c.fillStyle=cols[1];c.globalAlpha=0.3;
      c.beginPath();c.arc(mx2+nox,my2+noy,r,0,Math.PI*2);c.fill();
    }
  }
  c.globalAlpha=1;
  // PASS 2: Soft boundary transitions — curved gradient edges between different types
  for(let y=0;y<RO;y++)for(let x=0;x<CO;x++){
    const tl=m[y][x];const g=tGrp(tl);if(g<0)continue;
    const cols=tColor(tl);if(!cols)continue;
    const px2=x*TL,py2=y*TL;
    // Check right and bottom neighbors for different terrain
    for(const[dx2,dy2]of[[1,0],[0,1]]){
      const nx=x+dx2,ny=y+dy2;
      if(nx<0||nx>=CO||ny<0||ny>=RO)continue;
      const ng=tGrp(m[ny][nx]);
      if(ng===g||ng<0)continue;
      const ncols=tColor(m[ny][nx]);if(!ncols)continue;
      // Draw 5-7 overlapping soft circles along the border creating curved edge
      const count=5+((hs(x,y,99)*3)|0);
      for(let i=0;i<count;i++){
        const frac=i/(count-1);
        // Position along the shared edge with noise offset
        let bx,by;
        if(dx2===1){// right edge
          bx=px2+TL;by=py2+frac*TL;
        }else{// bottom edge
          bx=px2+frac*TL;by=py2+TL;
        }
        // Noise perpendicular to edge
        const nPerp=(hs(x*13+y*7+i*31,dx2*19+dy2*23,50+i)*12-6);
        const nAlong=(hs(x*7+y*13+i*37,dx2*23+dy2*19,60+i)*6-3);
        if(dx2===1){bx+=nPerp;by+=nAlong;}else{bx+=nAlong;by+=nPerp;}
        const r=4+hs(x*11+y*17+i*41,0,70+i)*5;
        // Draw blob of current terrain type extending into neighbor
        c.fillStyle=cols[0];c.globalAlpha=0.25+hs(x,y,80+i)*0.15;
        c.beginPath();c.arc(bx-dx2*2,by-dy2*2,r,0,Math.PI*2);c.fill();
        // And neighbor extending back
        c.fillStyle=ncols[0];c.globalAlpha=0.25+hs(nx,ny,80+i)*0.15;
        c.beginPath();c.arc(bx+dx2*2,by+dy2*2,r,0,Math.PI*2);c.fill();
      }
    }
  }
  c.globalAlpha=1;

  // PASS 2.5: Tree shadows — soft dark ellipses on ground beneath trees
  for(let y=0;y<RO;y++)for(let x=0;x<CO;x++){
    if(m[y][x]!==T.TREE)continue;
    const px2=x*TL,py2=y*TL;
    // Shadow offset slightly to bottom-right
    c.fillStyle="rgba(0,0,0,0.12)";
    c.beginPath();c.ellipse(px2+18,py2+27,14,5,0.08,0,Math.PI*2);c.fill();
    // Softer outer shadow
    c.fillStyle="rgba(0,0,0,0.06)";
    c.beginPath();c.ellipse(px2+19,py2+28,16,6,0.08,0,Math.PI*2);c.fill();
  }

  // PASS 3: Organic grass detail — scattered blades and clumps as small curved strokes
  for(let y=0;y<RO;y++)for(let x=0;x<CO;x++){
    const tl=m[y][x];
    if(tl===T.GRASS||tl===T.TALLGRASS){
      const px2=x*TL,py2=y*TL;
      const count=3+((hs(x,y,200)*4)|0);
      for(let i=0;i<count;i++){
        const gx=px2+hs(x,y,210+i*3)*28+2;
        const gy=py2+hs(x,y,211+i*3)*24+4;
        const gh=3+hs(x,y,212+i*3)*4;
        const sway=Math.sin(t/800+gx/40+gy/30)*1.5;
        c.strokeStyle=`rgba(60,160,40,${0.3+hs(x,y,213+i*3)*0.3})`;
        c.lineWidth=1;c.lineCap="round";
        c.beginPath();c.moveTo(gx,gy+gh);c.quadraticCurveTo(gx+sway,gy+gh/2,gx+sway*1.5,gy);c.stroke();
      }
    }
    // Water surface detail — flowing curves
    if(tl===T.WATER){
      const px2=x*TL,py2=y*TL;
      const w1=Math.sin(t/700+px2/35)*2.5;
      const w2=Math.sin(t/550+py2/30)*2;
      c.strokeStyle="rgba(80,160,220,0.2)";c.lineWidth=1.2;c.lineCap="round";
      c.beginPath();c.moveTo(px2-4,py2+10+w1);
      c.bezierCurveTo(px2+8,py2+7+w1,px2+20,py2+13+w1,px2+TL+4,py2+10+w1);c.stroke();
      c.strokeStyle="rgba(60,140,200,0.15)";
      c.beginPath();c.moveTo(px2-2,py2+22+w2);
      c.bezierCurveTo(px2+10,py2+19+w2,px2+22,py2+25+w2,px2+TL+2,py2+22+w2);c.stroke();
      // Shimmer
      const sh=Math.sin(t/250+px2/18+py2/22)*0.06+0.04;
      c.fillStyle=`rgba(200,235,255,${sh})`;
      c.beginPath();c.arc(px2+10+w1*2,py2+6,2.5,0,Math.PI*2);c.fill();
    }
    // Path surface detail — pebbles and wear marks
    if(tl===T.PATH){
      const px2=x*TL,py2=y*TL;
      for(let i=0;i<2;i++){
        c.fillStyle=`rgba(160,140,100,${0.15+hs(x,y,300+i)*0.15})`;
        const px3=px2+hs(x,y,301+i*5)*24+4,py3=py2+hs(x,y,302+i*5)*24+4;
        c.beginPath();c.arc(px3,py3,2+hs(x,y,303+i*5)*2,0,Math.PI*2);c.fill();
      }
    }
    // Sand ripple curves
    if(tl===T.SAND){
      const px2=x*TL,py2=y*TL;
      c.strokeStyle="rgba(170,140,60,0.15)";c.lineWidth=0.8;
      const wr=hs(x,y,400)*6;
      c.beginPath();c.moveTo(px2-2,py2+11+wr);
      c.bezierCurveTo(px2+10,py2+8+wr,px2+22,py2+14+wr,px2+TL+2,py2+11+wr);c.stroke();
      c.beginPath();c.moveTo(px2-2,py2+23+wr*0.5);
      c.bezierCurveTo(px2+10,py2+20+wr*0.5,px2+22,py2+26+wr*0.5,px2+TL+2,py2+23+wr*0.5);c.stroke();
    }
  }
  // PASS 4: Organic tile edge softening — break up square borders
  for(let y=0;y<RO;y++)for(let x=0;x<CO;x++){
    const tl=m[y][x];const px2=x*TL,py2=y*TL;

    // Grass/tallgrass — irregular tufts extending past tile edges
    if(tl===T.GRASS||tl===T.TALLGRASS||tl===T.FLOWER){
      for(let i=0;i<4;i++){const sd=x*17+y*31+i*53;
        const side=i;// 0=top,1=right,2=bottom,3=left
        const nx=x+(side===1?1:side===3?-1:0),ny=y+(side===0?-1:side===2?1:0);
        if(nx<0||nx>=CO||ny<0||ny>=RO)continue;
        const ntl=m[ny][nx];if(ntl===tl||ntl===T.GRASS||ntl===T.TALLGRASS||ntl===T.FLOWER)continue;
        // Draw organic grass tufts spilling over the edge
        const count=2+((hs(x,y,700+i)*3)|0);
        for(let j=0;j<count;j++){
          const along=hs(sd,j,710)*TL;const depth=2+hs(sd,j,711)*5;
          const sway=Math.sin(t/600+sd+j)*1.5;
          let bx,by;
          if(side===0){bx=px2+along;by=py2-depth;}
          else if(side===1){bx=px2+TL+depth;by=py2+along;}
          else if(side===2){bx=px2+along;by=py2+TL+depth;}
          else{bx=px2-depth;by=py2+along;}
          c.fillStyle=`rgba(60,150,35,${0.2+hs(sd,j,712)*0.15})`;
          c.beginPath();c.ellipse(bx+sway,by,2+hs(sd,j,713)*2,1+hs(sd,j,714),hs(sd,j,715)*Math.PI,0,Math.PI*2);c.fill();
        }
      }
    }

    // Rock tiles — rough irregular edges
    if(tl===T.ROCK||tl===T.WALL){
      for(const[dx2,dy2,si]of[[1,0,0],[0,1,1],[-1,0,2],[0,-1,3]]){
        const nx=x+dx2,ny=y+dy2;
        if(nx<0||nx>=CO||ny<0||ny>=RO)continue;
        const ntl=m[ny][nx];if(ntl===T.ROCK||ntl===T.WALL||ntl===T.TREE)continue;
        // Rough stone edges — irregular bumps
        const sd=x*23+y*37+si*67;
        for(let j=0;j<3;j++){
          const along=4+hs(sd,j,720)*24;const depth=1+hs(sd,j,721)*3;
          let bx,by;
          if(si===0){bx=px2+TL+depth;by=py2+along;}
          else if(si===1){bx=px2+along;by=py2+TL+depth;}
          else if(si===2){bx=px2-depth;by=py2+along;}
          else{bx=px2+along;by=py2-depth;}
          c.fillStyle=`rgba(100,90,80,${0.25+hs(sd,j,722)*0.15})`;
          c.beginPath();c.arc(bx,by,2+hs(sd,j,723)*2,0,Math.PI*2);c.fill();
        }
      }
    }

    // Ice tiles — crystalline edge frost
    if(tl===T.ICE){
      for(const[dx2,dy2,si]of[[1,0,0],[0,1,1],[-1,0,2],[0,-1,3]]){
        const nx=x+dx2,ny=y+dy2;
        if(nx<0||nx>=CO||ny<0||ny>=RO)continue;
        if(m[ny][nx]===T.ICE)continue;
        const sd=x*19+y*41+si*59;
        for(let j=0;j<2;j++){
          const along=6+hs(sd,j,730)*20;const depth=1+hs(sd,j,731)*4;
          let bx,by;
          if(si===0){bx=px2+TL+depth;by=py2+along;}
          else if(si===1){bx=px2+along;by=py2+TL+depth;}
          else if(si===2){bx=px2-depth;by=py2+along;}
          else{bx=px2+along;by=py2-depth;}
          c.fillStyle=`rgba(180,220,255,${0.15+hs(sd,j,732)*0.1})`;
          c.beginPath();c.ellipse(bx,by,3+hs(sd,j,733)*2,1.5,hs(sd,j,734)*Math.PI,0,Math.PI*2);c.fill();
        }
      }
    }

    // Water tiles — organic bleed edges into non-water neighbors
    if(tl===T.WATER){
      for(const[dx2,dy2,si]of[[1,0,0],[0,1,1],[-1,0,2],[0,-1,3]]){
        const nx=x+dx2,ny=y+dy2;
        if(nx<0||nx>=CO||ny<0||ny>=RO)continue;
        if(m[ny][nx]===T.WATER)continue;
        const sd=x*29+y*43+si*71;
        // Wavy water edge — multiple overlapping ellipses
        for(let j=0;j<4;j++){
          const along=3+hs(sd,j,740)*26;const depth=1+hs(sd,j,741)*5;
          const wave=Math.sin(t/600+sd+j*2)*1.5;
          let bx,by;
          if(si===0){bx=px2+TL+depth+wave;by=py2+along;}
          else if(si===1){bx=px2+along;by=py2+TL+depth+wave;}
          else if(si===2){bx=px2-depth-wave;by=py2+along;}
          else{bx=px2+along;by=py2-depth-wave;}
          c.fillStyle=`rgba(40,100,180,${0.15+hs(sd,j,742)*0.1})`;
          c.beginPath();c.ellipse(bx,by,3+hs(sd,j,743)*2,1.5+hs(sd,j,744),hs(sd,j,745)*Math.PI,0,Math.PI*2);c.fill();
        }
      }
    }
  }

  // PASS 5: Organic grass clumps — larger irregular shaped patches on grass tiles
  for(let y=0;y<RO;y++)for(let x=0;x<CO;x++){
    const tl=m[y][x];
    if(tl===T.GRASS||tl===T.TALLGRASS||tl===T.FLOWER){
      const px2=x*TL,py2=y*TL;const sd=x*43+y*67;
      // Irregular clump — blob of slightly different green
      if(hs(x,y,800)>0.55){
        const cx2=px2+6+hs(x,y,801)*20,cy2=py2+6+hs(x,y,802)*20;
        const rx=4+hs(x,y,803)*6,ry=3+hs(x,y,804)*4;
        const rot=hs(x,y,805)*Math.PI;
        c.fillStyle=`rgba(50,140,35,${0.12+hs(x,y,806)*0.08})`;
        c.beginPath();c.ellipse(cx2,cy2,rx,ry,rot,0,Math.PI*2);c.fill();
        // Second smaller clump nearby
        c.fillStyle=`rgba(70,160,45,${0.1+hs(x,y,807)*0.06})`;
        c.beginPath();c.ellipse(cx2+hs(x,y,808)*8-4,cy2+hs(x,y,809)*6-3,rx*0.6,ry*0.6,rot+0.5,0,Math.PI*2);c.fill();
      }
    }
  }
  c.lineCap="butt";
}
