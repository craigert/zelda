export function dSk(c,x,y,sz,fl,t){c.fillStyle="rgba(0,0,0,0.2)";c.beginPath();c.ellipse(x+sz/2,y+sz-2,sz/2-2,3,0,0,Math.PI*2);c.fill();
  const sc=fl?"#fff":"#c8b888";
  // Body
  const bg=c.createLinearGradient(x+sz*.3,y+sz*.15,x+sz*.7,y+sz*.7);bg.addColorStop(0,fl?"#fff":"#d8c898");bg.addColorStop(1,fl?"#eee":"#a89060");
  c.fillStyle=bg;c.beginPath();c.ellipse(x+sz/2,y+sz*.4,sz*.2,sz*.28,0,0,Math.PI*2);c.fill();
  // Skull
  const sg=c.createRadialGradient(x+sz*.45,y+sz*.15,1,x+sz/2,y+sz*.2,sz*.22);sg.addColorStop(0,fl?"#fff":"#e8d8a8");sg.addColorStop(1,fl?"#eee":"#b8a878");
  c.fillStyle=sg;c.beginPath();c.arc(x+sz/2,y+sz*.2,sz*.22,0,Math.PI*2);c.fill();
  if(!fl){c.fillStyle="#1a0800";c.beginPath();c.arc(x+sz*.37,y+sz*.18,2,0,Math.PI*2);c.fill();c.beginPath();c.arc(x+sz*.63,y+sz*.18,2,0,Math.PI*2);c.fill();
    c.fillStyle="#220800";c.fillRect(x+sz*.38,y+sz*.32,sz*.24,1.5);}
  const w=Math.sin(t/300)*2;c.fillStyle=sc;c.fillRect(x+sz*.1,y+sz*.28+w,sz*.18,2.5);c.fillRect(x+sz*.72,y+sz*.28-w,sz*.18,2.5);}
export function dBt(c,x,y,sz,fl,t,fi){const f=Math.sin(t/80)*6;
  c.fillStyle="rgba(0,0,0,0.15)";c.beginPath();c.ellipse(x+sz/2,y+sz-1,sz/3,2,0,0,Math.PI*2);c.fill();
  const bc=fl?"#fff":(fi?"#d84020":"#5a3c83");
  const bg=c.createRadialGradient(x+sz/2,y+sz*.4,2,x+sz/2,y+sz*.4,sz*.25);
  bg.addColorStop(0,fl?"#fff":(fi?"#f86040":"#7a5ca3"));bg.addColorStop(1,bc);
  c.fillStyle=bg;c.beginPath();c.ellipse(x+sz/2,y+sz*.4,sz*.2,sz*.18,0,0,Math.PI*2);c.fill();
  // Wings
  c.fillStyle=bc;
  c.beginPath();c.moveTo(x+sz*.3,y+sz*.35);c.quadraticCurveTo(x-2+f,y+sz*.25,x-4+f,y+sz*.4);c.quadraticCurveTo(x+f,y+sz*.55,x+sz*.3,y+sz*.5);c.fill();
  c.beginPath();c.moveTo(x+sz*.7,y+sz*.35);c.quadraticCurveTo(x+sz+2-f,y+sz*.25,x+sz+4-f,y+sz*.4);c.quadraticCurveTo(x+sz-f,y+sz*.55,x+sz*.7,y+sz*.5);c.fill();
  c.fillStyle=fl?"#ddd":(fi?"#ff0":"#f44");c.beginPath();c.arc(x+sz*.38,y+sz*.36,2,0,Math.PI*2);c.fill();c.beginPath();c.arc(x+sz*.62,y+sz*.36,2,0,Math.PI*2);c.fill();}
export function dGh(c,x,y,sz,fl,t){const b=Math.sin(t/400)*3;
  const gg=c.createRadialGradient(x+sz/2,y+sz*.35+b,sz*.1,x+sz/2,y+sz*.45+b,sz*.45);
  gg.addColorStop(0,fl?"rgba(255,255,255,0.95)":"rgba(200,210,240,0.6)");
  gg.addColorStop(0.7,fl?"rgba(255,255,255,0.7)":"rgba(160,170,210,0.35)");
  gg.addColorStop(1,"rgba(100,110,180,0)");
  c.fillStyle=gg;c.beginPath();c.arc(x+sz/2,y+sz*.35+b,sz*.38,Math.PI,0);
  c.lineTo(x+sz*.88,y+sz*.7+b);for(let i=0;i<4;i++){const bx=x+sz*.88-i*(sz*.76/4);c.quadraticCurveTo(bx-sz*.05,y+sz*.8+Math.sin(t/200+i)*3+b,bx-sz*.19,y+sz*.7+b);}c.fill();
  c.fillStyle=fl?"#444":"rgba(30,30,80,0.8)";c.beginPath();c.arc(x+sz*.36,y+sz*.3+b,2.5,0,Math.PI*2);c.fill();c.beginPath();c.arc(x+sz*.64,y+sz*.3+b,2.5,0,Math.PI*2);c.fill();
  if(!fl){c.fillStyle="rgba(100,120,200,0.15)";c.beginPath();c.arc(x+sz*.36,y+sz*.3+b,1,0,Math.PI*2);c.fill();c.beginPath();c.arc(x+sz*.64,y+sz*.3+b,1,0,Math.PI*2);c.fill();}}
export function dBo(c,x,y,sz,fl,t,hp,mh,di){
  c.fillStyle="rgba(0,0,0,0.3)";c.beginPath();c.ellipse(x+sz/2,y+sz-1,sz/2+2,5,0,0,Math.PI*2);c.fill();
  const eg=Math.sin(t/200)*2;
  if(di===0){// FOREST GUARDIAN — hulking treant with mossy bark and glowing green eyes
    const bark=fl?"#fff":"#3a5a28";c.fillStyle=bark;
    // Trunk body
    c.beginPath();c.moveTo(x+sz*.2,y+sz*.9);c.lineTo(x+sz*.15,y+sz*.3);c.bezierCurveTo(x+sz*.2,y+sz*.1,x+sz*.8,y+sz*.1,x+sz*.85,y+sz*.3);c.lineTo(x+sz*.8,y+sz*.9);c.fill();
    // Bark texture
    if(!fl){c.strokeStyle="rgba(20,40,10,0.5)";c.lineWidth=1.5;
      for(let i=0;i<4;i++){const by2=y+sz*(.25+i*.15);c.beginPath();c.moveTo(x+sz*(.2+i*.02),by2);c.bezierCurveTo(x+sz*.4,by2+3,x+sz*.6,by2-3,x+sz*(.8-i*.02),by2);c.stroke();}}
    // Branch arms
    c.fillStyle=fl?"#eee":"#4a6a30";
    c.beginPath();c.moveTo(x+sz*.15,y+sz*.35);c.lineTo(x-4,y+sz*.15);c.lineTo(x+sz*.05,y+sz*.1);c.lineTo(x+sz*.25,y+sz*.28);c.fill();
    c.beginPath();c.moveTo(x+sz*.85,y+sz*.35);c.lineTo(x+sz+4,y+sz*.15);c.lineTo(x+sz*.95,y+sz*.1);c.lineTo(x+sz*.75,y+sz*.28);c.fill();
    // Leaves on top
    c.fillStyle=fl?"#dfd":"#2a8a18";
    for(let i=0;i<5;i++){const lx=x+sz*(.25+i*.12),ly=y+sz*(.05+Math.sin(t/300+i)*0.03);
      c.beginPath();c.ellipse(lx,ly,sz*.1,sz*.07,i*.5,0,Math.PI*2);c.fill();}
    // Glowing eyes
    c.fillStyle=fl?"#333":"#4f4";c.shadowColor="#0f0";c.shadowBlur=fl?0:6;
    c.beginPath();c.arc(x+sz*.35,y+sz*.3+eg,3,0,Math.PI*2);c.fill();c.beginPath();c.arc(x+sz*.65,y+sz*.3+eg,3,0,Math.PI*2);c.fill();
    c.shadowBlur=0;
    if(!fl){c.fillStyle="#afa";c.beginPath();c.arc(x+sz*.35,y+sz*.3+eg,1.2,0,Math.PI*2);c.fill();c.beginPath();c.arc(x+sz*.65,y+sz*.3+eg,1.2,0,Math.PI*2);c.fill();}
    // Mossy glow aura
    if(!fl){const ag=c.createRadialGradient(x+sz/2,y+sz/2,sz*.2,x+sz/2,y+sz/2,sz*.6);
      ag.addColorStop(0,"rgba(50,200,50,0)");ag.addColorStop(1,`rgba(50,200,50,${0.05+Math.sin(t/500)*0.03})`);c.fillStyle=ag;c.fillRect(x-4,y-4,sz+8,sz+8);}
  }else if(di===1){// FLAME WYRM — serpentine fire dragon with flickering flames
    const phase=t/150;
    // Sinuous body segments
    for(let i=5;i>=0;i--){const seg=i/5,bx=x+sz/2+Math.sin(phase+i*.8)*sz*.15,by=y+sz*(.2+seg*.6);
      const sr2=sz*(.2+(.5-Math.abs(seg-.5))*.35);
      const sg=fl?"#fff":c.createRadialGradient(bx,by,1,bx,by,sr2);
      if(!fl){sg.addColorStop(0,"#ff6600");sg.addColorStop(0.6,"#cc2200");sg.addColorStop(1,"#881100");}
      c.fillStyle=sg;c.beginPath();c.ellipse(bx,by,sr2,sr2*.7,0,0,Math.PI*2);c.fill();}
    // Head
    const hx=x+sz/2+Math.sin(phase)*sz*.12,hy=y+sz*.15;
    const hg=fl?"#fff":c.createRadialGradient(hx,hy,2,hx,hy,sz*.22);
    if(!fl){hg.addColorStop(0,"#ffaa00");hg.addColorStop(1,"#cc3300");}
    c.fillStyle=hg;c.beginPath();c.ellipse(hx,hy,sz*.22,sz*.18,0,0,Math.PI*2);c.fill();
    // Horns
    c.fillStyle=fl?"#eee":"#ff4400";
    c.beginPath();c.moveTo(hx-sz*.12,hy-sz*.08);c.lineTo(hx-sz*.2,hy-sz*.25);c.lineTo(hx-sz*.05,hy-sz*.05);c.fill();
    c.beginPath();c.moveTo(hx+sz*.12,hy-sz*.08);c.lineTo(hx+sz*.2,hy-sz*.25);c.lineTo(hx+sz*.05,hy-sz*.05);c.fill();
    // Eyes
    c.fillStyle=fl?"#333":"#ff0";c.beginPath();c.arc(hx-sz*.08,hy+eg*.5,2.5,0,Math.PI*2);c.fill();c.beginPath();c.arc(hx+sz*.08,hy+eg*.5,2.5,0,Math.PI*2);c.fill();
    if(!fl){c.fillStyle="#f00";c.beginPath();c.arc(hx-sz*.08,hy+eg*.5,1.2,0,Math.PI*2);c.fill();c.beginPath();c.arc(hx+sz*.08,hy+eg*.5,1.2,0,Math.PI*2);c.fill();}
    // Flame particles around body
    if(!fl){for(let i=0;i<6;i++){const fx=x+sz*(.2+Math.random()*.6),fy=y+sz*(.1+Math.random()*.7);
      c.fillStyle=`rgba(255,${150+Math.random()*100|0},0,${0.3+Math.random()*0.3})`;c.beginPath();c.arc(fx,fy-Math.sin(t/100+i)*3,1.5+Math.random()*2,0,Math.PI*2);c.fill();}}
    // Fire aura
    if(!fl){const ag=c.createRadialGradient(x+sz/2,y+sz/2,sz*.15,x+sz/2,y+sz/2,sz*.65);
      ag.addColorStop(0,"rgba(255,100,0,0)");ag.addColorStop(1,`rgba(255,80,0,${0.06+Math.sin(t/300)*0.03})`);c.fillStyle=ag;c.fillRect(x-6,y-6,sz+12,sz+12);}
  }else if(di===2){// SHADOW LORD — spectral wraith with flowing cloak and skull face
    const drift=Math.sin(t/400)*3;
    // Dark cloak body — flowing shape
    c.fillStyle=fl?"#fff":"#1a1a3a";
    c.beginPath();c.moveTo(x+sz*.5,y+sz*.1);c.bezierCurveTo(x+sz*.1,y+sz*.3,x+sz*.05,y+sz*.7,x+sz*.15,y+sz*.95);
    for(let i=0;i<5;i++){c.lineTo(x+sz*(.2+i*.15),y+sz*(.88+Math.sin(t/200+i*1.5)*.05));}
    c.bezierCurveTo(x+sz*.95,y+sz*.7,x+sz*.9,y+sz*.3,x+sz*.5,y+sz*.1);c.fill();
    // Inner cloak gradient
    if(!fl){const cg=c.createRadialGradient(x+sz*.5,y+sz*.5,sz*.1,x+sz*.5,y+sz*.5,sz*.4);
      cg.addColorStop(0,"rgba(80,40,120,0.5)");cg.addColorStop(1,"rgba(20,10,40,0)");c.fillStyle=cg;
      c.beginPath();c.ellipse(x+sz/2,y+sz*.5,sz*.3,sz*.35,0,0,Math.PI*2);c.fill();}
    // Skull face
    c.fillStyle=fl?"#ccc":"#d0c8b8";c.beginPath();c.ellipse(x+sz/2,y+sz*.28+drift*.3,sz*.16,sz*.18,0,0,Math.PI*2);c.fill();
    // Hollow eyes
    c.fillStyle=fl?"#333":"#000";c.beginPath();c.ellipse(x+sz*.4,y+sz*.26+drift*.3+eg,sz*.04,sz*.05,0,0,Math.PI*2);c.fill();
    c.beginPath();c.ellipse(x+sz*.6,y+sz*.26+drift*.3+eg,sz*.04,sz*.05,0,0,Math.PI*2);c.fill();
    // Eye glow
    if(!fl){c.fillStyle="#a060ff";c.shadowColor="#8040ff";c.shadowBlur=8;
      c.beginPath();c.arc(x+sz*.4,y+sz*.26+drift*.3+eg,2,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(x+sz*.6,y+sz*.26+drift*.3+eg,2,0,Math.PI*2);c.fill();c.shadowBlur=0;}
    // Mouth
    if(!fl){c.fillStyle="#222";c.beginPath();c.ellipse(x+sz*.5,y+sz*.35+drift*.3,sz*.06,sz*.03,0,0,Math.PI*2);c.fill();}
    // Shadow wisps
    if(!fl){for(let i=0;i<4;i++){const wx=x+sz*(.2+i*.2),wy=y+sz*(.6+Math.sin(t/300+i*2)*.1);
      c.strokeStyle=`rgba(100,60,180,${0.2+Math.sin(t/250+i)*0.1})`;c.lineWidth=1.5;
      c.beginPath();c.moveTo(wx,wy);c.bezierCurveTo(wx-5,wy+10,wx+5,wy+15,wx+Math.sin(t/200+i)*8,wy+20);c.stroke();}}
    // Dark aura
    if(!fl){const ag=c.createRadialGradient(x+sz/2,y+sz/2+drift,sz*.15,x+sz/2,y+sz/2+drift,sz*.6);
      ag.addColorStop(0,"rgba(80,40,160,0)");ag.addColorStop(1,`rgba(60,20,120,${0.08+Math.sin(t/600)*0.04})`);c.fillStyle=ag;c.fillRect(x-6,y-6,sz+12,sz+12);}
  }else{// DARK KING (dungeon 3) — Ganon-like demon king with cape and trident
    const cx=x+sz/2,cy=y+sz/2;
    // Dark pulsing aura
    if(!fl){const ag=c.createRadialGradient(cx,cy,sz*.1,cx,cy,sz*.8);
      ag.addColorStop(0,"rgba(180,0,180,0)");ag.addColorStop(0.6,`rgba(120,0,80,${0.12+Math.sin(t/300)*0.06})`);ag.addColorStop(1,"rgba(60,0,40,0)");
      c.fillStyle=ag;c.fillRect(x-10,y-10,sz+20,sz+20);}
    // Cape billowing
    if(!fl){const capeS=Math.sin(t/350)*3;
      c.fillStyle="#2a0030";c.beginPath();c.moveTo(x+sz*.2,y+sz*.3);
      c.bezierCurveTo(x+sz*.1,y+sz*.6,x+sz*.05+capeS,y+sz*.85,x+sz*.15+capeS,y+sz);
      c.lineTo(x+sz*.85-capeS,y+sz);c.bezierCurveTo(x+sz*.95-capeS,y+sz*.85,x+sz*.9,y+sz*.6,x+sz*.8,y+sz*.3);c.fill();
      c.fillStyle="#3a0040";c.beginPath();c.moveTo(x+sz*.25,y+sz*.35);
      c.bezierCurveTo(x+sz*.18,y+sz*.6,x+sz*.15+capeS*.5,y+sz*.8,x+sz*.22+capeS*.5,y+sz*.95);
      c.lineTo(x+sz*.78-capeS*.5,y+sz*.95);c.bezierCurveTo(x+sz*.85-capeS*.5,y+sz*.8,x+sz*.82,y+sz*.6,x+sz*.75,y+sz*.35);c.fill();}
    // Body — large imposing torso
    const bodyG=c.createRadialGradient(cx,y+sz*.4,2,cx,y+sz*.45,sz*.3);
    bodyG.addColorStop(0,fl?"#fff":"#1a4a1a");bodyG.addColorStop(1,fl?"#ddd":"#0a2a0a");
    c.fillStyle=bodyG;c.beginPath();c.ellipse(cx,y+sz*.45,sz*.32,sz*.3,0,0,Math.PI*2);c.fill();
    // Armor plate
    if(!fl){c.fillStyle="#2a1a00";c.beginPath();c.moveTo(x+sz*.25,y+sz*.28);c.lineTo(x+sz*.75,y+sz*.28);
      c.lineTo(x+sz*.72,y+sz*.58);c.lineTo(x+sz*.28,y+sz*.58);c.fill();
      c.strokeStyle="#fd3";c.lineWidth=1;c.beginPath();c.moveTo(x+sz*.28,y+sz*.3);c.lineTo(x+sz*.72,y+sz*.3);c.stroke();
      c.beginPath();c.moveTo(x+sz*.3,y+sz*.42);c.lineTo(x+sz*.7,y+sz*.42);c.stroke();
      // Gold emblem
      c.fillStyle="#fd3";c.beginPath();c.arc(cx,y+sz*.36,3,0,Math.PI*2);c.fill();}
    // Head — pig-like snout (Ganon)
    const hg=c.createRadialGradient(cx,y+sz*.18,2,cx,y+sz*.2,sz*.16);
    hg.addColorStop(0,fl?"#fff":"#2a6a2a");hg.addColorStop(1,fl?"#ddd":"#1a4a1a");
    c.fillStyle=hg;c.beginPath();c.ellipse(cx,y+sz*.2,sz*.18,sz*.16,0,0,Math.PI*2);c.fill();
    // Snout
    if(!fl){c.fillStyle="#1a5a1a";c.beginPath();c.ellipse(cx,y+sz*.26,sz*.08,sz*.05,0,0,Math.PI*2);c.fill();
      c.fillStyle="#0a3a0a";c.beginPath();c.arc(cx-3,y+sz*.26,1.5,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(cx+3,y+sz*.26,1.5,0,Math.PI*2);c.fill();}
    // Horns
    c.fillStyle=fl?"#ccc":"#8a6a20";
    c.beginPath();c.moveTo(x+sz*.3,y+sz*.1);c.lineTo(x+sz*.18,y-4);c.lineTo(x+sz*.35,y+sz*.14);c.fill();
    c.beginPath();c.moveTo(x+sz*.7,y+sz*.1);c.lineTo(x+sz*.82,y-4);c.lineTo(x+sz*.65,y+sz*.14);c.fill();
    // Eyes — burning red
    c.fillStyle=fl?"#333":"#ff2200";c.shadowColor="#ff0000";c.shadowBlur=fl?0:8;
    c.beginPath();c.arc(x+sz*.38,y+sz*.18+eg,3,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(x+sz*.62,y+sz*.18+eg,3,0,Math.PI*2);c.fill();c.shadowBlur=0;
    if(!fl){c.fillStyle="#ff8800";c.beginPath();c.arc(x+sz*.38,y+sz*.18+eg,1.5,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(x+sz*.62,y+sz*.18+eg,1.5,0,Math.PI*2);c.fill();}
    // Trident/spear in hand
    if(!fl){const spX=x+sz*.85,spY=y+sz*.1;
      c.strokeStyle="#888";c.lineWidth=2;c.beginPath();c.moveTo(spX,spY);c.lineTo(spX,y+sz*.75);c.stroke();
      c.fillStyle="#aaa";c.beginPath();c.moveTo(spX,spY-2);c.lineTo(spX-4,spY+8);c.lineTo(spX,spY+5);c.lineTo(spX+4,spY+8);c.fill();
      c.fillStyle="#ccc";c.beginPath();c.moveTo(spX-6,spY+2);c.lineTo(spX-3,spY-4);c.lineTo(spX-2,spY+4);c.fill();
      c.beginPath();c.moveTo(spX+6,spY+2);c.lineTo(spX+3,spY-4);c.lineTo(spX+2,spY+4);c.fill();}
  }
  // HP bar (all bosses)
  const bw=sz+8;c.fillStyle="rgba(0,0,0,0.7)";c.beginPath();c.arc(x-4+4,y-14+4,4,Math.PI,Math.PI*1.5);c.arc(x+bw-4,y-14+4,4,Math.PI*1.5,0);c.arc(x+bw-4,y-14+8-4,4,0,Math.PI*.5);c.arc(x-4+4,y-14+8-4,4,Math.PI*.5,Math.PI);c.fill();
  const hpW=bw*(hp/mh);const hpColor=di===0?"#22aa22":di===1?"#cc2222":di===2?"#6622cc":"#cc22cc";
  c.fillStyle=hpColor;c.fillRect(x-3,y-13,Math.max(0,hpW-2),6);
  c.fillStyle="rgba(255,255,255,0.2)";c.fillRect(x-3,y-13,Math.max(0,hpW-2),3);}
export function dAr(c,x,y,sz,fl,t){
  c.fillStyle="rgba(0,0,0,0.2)";c.beginPath();c.ellipse(x+sz/2,y+sz-2,sz/2-2,3,0,0,Math.PI*2);c.fill();
  const col=fl?"#fff":"#5a6a4a";
  c.fillStyle=fl?"#eee":"#4a5a3a";
  c.beginPath();c.moveTo(x+sz*.3,y+sz*.2);c.lineTo(x+sz*.7,y+sz*.2);c.lineTo(x+sz*.75,y+sz*.75);c.lineTo(x+sz*.25,y+sz*.75);c.fill();
  const hg=c.createRadialGradient(x+sz/2,y+sz*.15,2,x+sz/2,y+sz*.2,sz*.2);
  hg.addColorStop(0,fl?"#fff":"#5a6a4a");hg.addColorStop(1,fl?"#eee":"#3a4a2a");
  c.fillStyle=hg;c.beginPath();c.arc(x+sz/2,y+sz*.18,sz*.18,0,Math.PI*2);c.fill();
  if(!fl){
    c.fillStyle="#ff4";c.beginPath();c.arc(x+sz*.4,y+sz*.17,1.5,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(x+sz*.6,y+sz*.17,1.5,0,Math.PI*2);c.fill();
  }
  c.strokeStyle=fl?"#ddd":"#8a6a30";c.lineWidth=1.5;
  const bowX=x+sz*0.8,bowY=y+sz*0.35;
  c.beginPath();c.arc(bowX,bowY,sz*0.2,-Math.PI*0.6,Math.PI*0.6);c.stroke();
  c.strokeStyle=fl?"#ccc":"#aaa";c.lineWidth=0.5;
  c.beginPath();c.moveTo(bowX+Math.cos(-Math.PI*0.6)*sz*0.2,bowY+Math.sin(-Math.PI*0.6)*sz*0.2);
  c.lineTo(bowX+Math.cos(Math.PI*0.6)*sz*0.2,bowY+Math.sin(Math.PI*0.6)*sz*0.2);c.stroke();
}
export function dMg(c,x,y,sz,fl,t){
  c.fillStyle="rgba(0,0,0,0.2)";c.beginPath();c.ellipse(x+sz/2,y+sz-2,sz/2-2,3,0,0,Math.PI*2);c.fill();
  const rg=c.createLinearGradient(x+sz*.3,y+sz*.15,x+sz*.7,y+sz*.8);
  rg.addColorStop(0,fl?"#fff":"#2a1a4a");rg.addColorStop(1,fl?"#eee":"#1a0a3a");
  c.fillStyle=rg;c.beginPath();c.moveTo(x+sz*.3,y+sz*.2);c.lineTo(x+sz*.7,y+sz*.2);
  c.lineTo(x+sz*.8,y+sz*.85);c.lineTo(x+sz*.2,y+sz*.85);c.fill();
  c.fillStyle=fl?"#fff":"#c0a080";c.beginPath();c.arc(x+sz/2,y+sz*.18,sz*.16,0,Math.PI*2);c.fill();
  c.fillStyle=fl?"#eee":"#2a1a5a";
  c.beginPath();c.moveTo(x+sz*.3,y+sz*.12);c.lineTo(x+sz/2,y-sz*.1);c.lineTo(x+sz*.7,y+sz*.12);c.fill();
  c.fillStyle="#ff8";const stx=x+sz*.52,sty=y+sz*.02;
  c.beginPath();c.arc(stx,sty,2,0,Math.PI*2);c.fill();
  if(!fl){c.fillStyle="#a060ff";c.beginPath();c.arc(x+sz*.42,y+sz*.17,1.5,0,Math.PI*2);c.fill();c.beginPath();c.arc(x+sz*.58,y+sz*.17,1.5,0,Math.PI*2);c.fill();}
  c.strokeStyle=fl?"#ddd":"#8a6a30";c.lineWidth=2;
  c.beginPath();c.moveTo(x+sz*.2,y+sz*.3);c.lineTo(x+sz*.15,y+sz*.9);c.stroke();
  const orbGlow=Math.sin(t/200)*0.3+0.7;
  const og=c.createRadialGradient(x+sz*.2,y+sz*.28,1,x+sz*.2,y+sz*.28,5);
  og.addColorStop(0,`rgba(160,80,255,${orbGlow})`);og.addColorStop(1,"rgba(80,0,200,0)");
  c.fillStyle=og;c.beginPath();c.arc(x+sz*.2,y+sz*.28,5,0,Math.PI*2);c.fill();
  c.fillStyle="#c080ff";c.beginPath();c.arc(x+sz*.2,y+sz*.28,2.5,0,Math.PI*2);c.fill();
}
export function dKn(c,x,y,sz,fl,t){
  c.fillStyle="rgba(0,0,0,0.25)";c.beginPath();c.ellipse(x+sz/2,y+sz-2,sz/2,4,0,0,Math.PI*2);c.fill();
  const ag=c.createLinearGradient(x+sz*.3,y+sz*.2,x+sz*.7,y+sz*.7);
  ag.addColorStop(0,fl?"#fff":"#8a8a9a");ag.addColorStop(1,fl?"#eee":"#5a5a6a");
  c.fillStyle=ag;c.beginPath();c.moveTo(x+sz*.25,y+sz*.22);c.lineTo(x+sz*.75,y+sz*.22);
  c.lineTo(x+sz*.8,y+sz*.75);c.lineTo(x+sz*.2,y+sz*.75);c.fill();
  const hg=c.createRadialGradient(x+sz/2,y+sz*.15,2,x+sz/2,y+sz*.18,sz*.2);
  hg.addColorStop(0,fl?"#fff":"#9a9aaa");hg.addColorStop(1,fl?"#eee":"#6a6a7a");
  c.fillStyle=hg;c.beginPath();c.arc(x+sz/2,y+sz*.18,sz*.2,0,Math.PI*2);c.fill();
  if(!fl){c.fillStyle="#220000";c.fillRect(x+sz*.35,y+sz*.16,sz*.3,3);}
  c.fillStyle=fl?"#fcc":"#cc2222";c.beginPath();c.moveTo(x+sz/2,y);c.quadraticCurveTo(x+sz*.7,y+sz*.05,x+sz/2,y+sz*.12);c.fill();
  const sg=c.createLinearGradient(x+sz*.05,y+sz*.25,x+sz*.35,y+sz*.65);
  sg.addColorStop(0,fl?"#eee":"#7a7aaa");sg.addColorStop(0.5,fl?"#ddd":"#5a5a8a");sg.addColorStop(1,fl?"#ccc":"#4a4a7a");
  c.fillStyle=sg;
  c.beginPath();c.moveTo(x+sz*.1,y+sz*.25);c.lineTo(x+sz*.4,y+sz*.25);c.lineTo(x+sz*.4,y+sz*.6);
  c.lineTo(x+sz*.25,y+sz*.7);c.lineTo(x+sz*.1,y+sz*.6);c.fill();
  c.fillStyle=fl?"#fdd":"#dd4444";c.beginPath();c.arc(x+sz*.25,y+sz*.42,4,0,Math.PI*2);c.fill();
  c.strokeStyle=fl?"#fff":"#ccc";c.lineWidth=2;
  c.beginPath();c.moveTo(x+sz*.7,y+sz*.3);c.lineTo(x+sz*.75,y+sz*.65);c.stroke();
  c.strokeStyle=fl?"#eee":"#aa8833";c.lineWidth=3;
  c.beginPath();c.moveTo(x+sz*.65,y+sz*.3);c.lineTo(x+sz*.8,y+sz*.3);c.stroke();
}
// Vine Creeper — green plant creature with tendrils
export function dVc(c,x,y,sz,fl,t){
  const sway=Math.sin(t/400)*2;
  c.fillStyle="rgba(0,0,0,0.2)";c.beginPath();c.ellipse(x+sz/2,y+sz-2,sz/2,3,0,0,Math.PI*2);c.fill();
  // Body — leafy bulb
  c.fillStyle=fl?"#fff":"#2a6a18";c.beginPath();c.arc(x+sz/2,y+sz*0.5,sz*0.3,0,Math.PI*2);c.fill();
  c.fillStyle=fl?"#efe":"#3a8a28";c.beginPath();c.arc(x+sz*0.45,y+sz*0.45,sz*0.2,0,Math.PI*2);c.fill();
  // Vine tendrils extending outward
  c.strokeStyle=fl?"#cfc":"#1a5a10";c.lineWidth=2;c.lineCap="round";
  c.beginPath();c.moveTo(x+sz*0.3,y+sz*0.5);c.quadraticCurveTo(x+sz*0.1+sway,y+sz*0.3,x+sway*1.5,y+sz*0.15);c.stroke();
  c.beginPath();c.moveTo(x+sz*0.7,y+sz*0.5);c.quadraticCurveTo(x+sz*0.9-sway,y+sz*0.3,x+sz+(-sway)*1.5,y+sz*0.15);c.stroke();
  c.beginPath();c.moveTo(x+sz*0.5,y+sz*0.7);c.quadraticCurveTo(x+sz*0.3+sway,y+sz*0.85,x+sz*0.2+sway,y+sz);c.stroke();
  c.lineCap="butt";
  // Eyes
  if(!fl){c.fillStyle="#ff0";c.beginPath();c.arc(x+sz*0.4,y+sz*0.42,2,0,Math.PI*2);c.fill();
  c.beginPath();c.arc(x+sz*0.58,y+sz*0.42,2,0,Math.PI*2);c.fill();
  c.fillStyle="#000";c.beginPath();c.arc(x+sz*0.4,y+sz*0.42,1,0,Math.PI*2);c.fill();
  c.beginPath();c.arc(x+sz*0.58,y+sz*0.42,1,0,Math.PI*2);c.fill();}
}
// Stalfos Knight — armored skeleton, glowing red eyes
export function dSf(c,x,y,sz,fl,t){
  dSk(c,x,y,sz,fl,t);// base skeleton
  // Armor overlay
  c.fillStyle=fl?"#fff":"#6a6a7a";c.fillRect(x+sz*0.15,y+sz*0.25,sz*0.7,sz*0.3);
  c.fillStyle=fl?"#eee":"#8a8a9a";c.fillRect(x+sz*0.3,y+sz*0.05,sz*0.4,sz*0.18);
  // Red eyes
  if(!fl){c.fillStyle="#f22";c.beginPath();c.arc(x+sz*0.35,y+sz*0.15,2.5,0,Math.PI*2);c.fill();
  c.beginPath();c.arc(x+sz*0.65,y+sz*0.15,2.5,0,Math.PI*2);c.fill();
  c.fillStyle="#fff";c.beginPath();c.arc(x+sz*0.35,y+sz*0.14,1,0,Math.PI*2);c.fill();
  c.beginPath();c.arc(x+sz*0.65,y+sz*0.14,1,0,Math.PI*2);c.fill();}
  // Sword
  c.fillStyle=fl?"#ddd":"#aaa";c.save();c.translate(x+sz*0.8,y+sz*0.3);c.rotate(Math.sin(t/300)*0.3);
  c.fillRect(-1,-10,2,14);c.fillStyle="#fd3";c.fillRect(-3,-1,6,2);c.restore();
}
// Magma Slug — glowing orange slug with molten body
export function dMs(c,x,y,sz,fl,t){
  const bob=Math.sin(t/300)*1.5,pulse=Math.sin(t/200)*0.15+0.85;
  // Shadow
  c.fillStyle="rgba(0,0,0,0.3)";c.beginPath();c.ellipse(x+sz/2,y+sz-2,sz/2,3,0,0,Math.PI*2);c.fill();
  // Fire glow underneath
  c.fillStyle=`rgba(255,100,0,${0.15+Math.sin(t/150)*0.08})`;c.beginPath();c.ellipse(x+sz/2,y+sz*0.7,sz*0.5,sz*0.3,0,0,Math.PI*2);c.fill();
  // Body — elongated blob
  const bg=c.createRadialGradient(x+sz*0.45,y+sz*0.45,2,x+sz/2,y+sz*0.5,sz*0.4);
  bg.addColorStop(0,fl?"#fff":"#ff8800");bg.addColorStop(0.5,fl?"#fcc":"#cc4400");bg.addColorStop(1,fl?"#faa":"#881100");
  c.fillStyle=bg;
  c.beginPath();c.moveTo(x+sz*0.2,y+sz*0.65+bob);
  c.quadraticCurveTo(x+sz*0.15,y+sz*0.35,x+sz*0.35,y+sz*0.25+bob);
  c.quadraticCurveTo(x+sz*0.5,y+sz*0.15+bob,x+sz*0.7,y+sz*0.3+bob);
  c.quadraticCurveTo(x+sz*0.85,y+sz*0.45,x+sz*0.75,y+sz*0.7+bob);
  c.quadraticCurveTo(x+sz*0.5,y+sz*0.8,x+sz*0.2,y+sz*0.65+bob);c.fill();
  // Molten cracks
  c.strokeStyle=`rgba(255,200,50,${pulse*0.6})`;c.lineWidth=1;
  c.beginPath();c.moveTo(x+sz*0.35,y+sz*0.4+bob);c.lineTo(x+sz*0.5,y+sz*0.5+bob);c.lineTo(x+sz*0.6,y+sz*0.4+bob);c.stroke();
  // Eyes — glowing yellow
  if(!fl){c.fillStyle="#ff0";c.beginPath();c.arc(x+sz*0.38,y+sz*0.35+bob,2,0,Math.PI*2);c.fill();
  c.beginPath();c.arc(x+sz*0.55,y+sz*0.35+bob,2,0,Math.PI*2);c.fill();
  c.fillStyle="#000";c.beginPath();c.arc(x+sz*0.38,y+sz*0.35+bob,1,0,Math.PI*2);c.fill();
  c.beginPath();c.arc(x+sz*0.55,y+sz*0.35+bob,1,0,Math.PI*2);c.fill();}
  // Antennae/stalks
  c.strokeStyle=fl?"#fcc":"#cc6600";c.lineWidth=1.5;
  c.beginPath();c.moveTo(x+sz*0.35,y+sz*0.3+bob);c.quadraticCurveTo(x+sz*0.3,y+sz*0.15+bob,x+sz*0.25,y+sz*0.1+bob);c.stroke();
  c.beginPath();c.moveTo(x+sz*0.55,y+sz*0.3+bob);c.quadraticCurveTo(x+sz*0.6,y+sz*0.15+bob,x+sz*0.65,y+sz*0.1+bob);c.stroke();
}
// Wallmaster — giant shadow hand
export function dWm(c,x,y,sz,fl,t){
  const grab=Math.sin(t/200)*0.15;const breathe=Math.sin(t/400)*0.03;
  // Shadow beneath
  if(!fl){c.fillStyle="rgba(0,0,0,0.2)";c.beginPath();c.ellipse(x+sz/2,y+sz*0.85,sz*0.35,sz*0.08,0,0,Math.PI*2);c.fill();}
  // Dark aura
  if(!fl){const ag=c.createRadialGradient(x+sz/2,y+sz*0.5,sz*0.1,x+sz/2,y+sz*0.5,sz*0.5);
    ag.addColorStop(0,"rgba(60,20,80,0)");ag.addColorStop(1,`rgba(40,10,60,${0.15+Math.sin(t/300)*0.05})`);
    c.fillStyle=ag;c.fillRect(x-4,y-4,sz+8,sz+8);}
  // Palm — gradient for depth
  const pg=fl?null:c.createRadialGradient(x+sz*0.45,y+sz*0.45,sz*0.05,x+sz/2,y+sz*0.55,sz*0.3);
  if(pg){pg.addColorStop(0,"#4a3a5a");pg.addColorStop(1,"#2a1a3a");}
  c.fillStyle=fl?"#fff":(pg||"#2a1a3a");
  c.beginPath();c.ellipse(x+sz/2,y+sz*(0.55+breathe),sz*(0.36+breathe),sz*0.26,0,0,Math.PI*2);c.fill();
  // Fingers — each animated independently with curl
  const fingers=[[0.15,0.18,0.4],[0.3,0.08,0.7],[0.5,0.03,1.0],[0.7,0.08,0.7],[0.85,0.18,0.4]];
  for(let i=0;i<fingers.length;i++){const[fx,fy,curl]=fingers[i];
    const fGrab=grab*curl;const fWave=Math.sin(t/250+i*0.8)*0.02*curl;
    const fg=fl?null:c.createLinearGradient(x+sz*fx,y+sz*(fy+fGrab),x+sz*fx,y+sz*(fy+fGrab+0.22));
    if(fg){fg.addColorStop(0,"#4a3a5a");fg.addColorStop(1,"#2a1a3a");}
    c.fillStyle=fl?"#eee":(fg||"#3a2a4a");
    // Finger segment 1 (base)
    c.beginPath();c.ellipse(x+sz*(fx+fWave),y+sz*(fy+fGrab+0.08),sz*0.07,sz*0.1,0,0,Math.PI*2);c.fill();
    // Finger segment 2 (tip)
    c.beginPath();c.ellipse(x+sz*(fx+fWave*1.5),y+sz*(fy+fGrab-0.02),sz*0.06,sz*0.09,0,0,Math.PI*2);c.fill();
    // Fingernail
    if(!fl){c.fillStyle="#1a0a2a";c.beginPath();c.ellipse(x+sz*(fx+fWave*1.5),y+sz*(fy+fGrab-0.08),sz*0.04,sz*0.03,0,0,Math.PI*2);c.fill();}}
  // Knuckle wrinkles
  if(!fl){c.strokeStyle="rgba(80,50,100,0.4)";c.lineWidth=0.8;
    c.beginPath();c.moveTo(x+sz*0.22,y+sz*0.42);c.quadraticCurveTo(x+sz*0.5,y+sz*0.38,x+sz*0.78,y+sz*0.42);c.stroke();
    c.beginPath();c.moveTo(x+sz*0.28,y+sz*0.5);c.quadraticCurveTo(x+sz*0.5,y+sz*0.47,x+sz*0.72,y+sz*0.5);c.stroke();}
  // Glowing eye in palm center
  const eyeGlow=0.6+Math.sin(t/250)*0.3;
  c.fillStyle=fl?"#fff":`rgba(160,64,255,${eyeGlow})`;
  c.shadowColor="#a040ff";c.shadowBlur=fl?0:6;
  c.beginPath();c.arc(x+sz*0.5,y+sz*0.52,3.5,0,Math.PI*2);c.fill();c.shadowBlur=0;
  if(!fl){c.fillStyle="#d080ff";c.beginPath();c.arc(x+sz*0.5,y+sz*0.51,1.5,0,Math.PI*2);c.fill();}
}
export function dYt(c,x,y,sz,fl,t){
  // Shadow
  c.fillStyle="rgba(0,0,0,0.2)";c.beginPath();c.ellipse(x+sz/2,y+sz-2,sz/2,4,0,0,Math.PI*2);c.fill();
  // Large furry body
  const sway=Math.sin(t/500)*1.5;
  const bg=c.createRadialGradient(x+sz*.4,y+sz*.3,2,x+sz/2,y+sz*.45,sz*.4);
  bg.addColorStop(0,fl?"#fff":"#e8e8f0");bg.addColorStop(1,fl?"#ddd":"#b0b8c8");
  c.fillStyle=bg;c.beginPath();c.ellipse(x+sz/2,y+sz*.45,sz*.38,sz*.4,0,0,Math.PI*2);c.fill();
  // Fur texture
  if(!fl){c.strokeStyle="rgba(160,170,190,0.5)";c.lineWidth=0.8;
    for(let i=0;i<6;i++){const fx=x+sz*0.25+i*sz*0.1,fy=y+sz*0.25+Math.sin(i+t/300)*2;
      c.beginPath();c.moveTo(fx,fy);c.lineTo(fx+sway,fy+sz*0.15);c.stroke();}}
  // Arms
  c.fillStyle=fl?"#ddd":"#c0c8d8";
  c.beginPath();c.ellipse(x+sz*0.15+sway,y+sz*0.5,sz*0.1,sz*0.2,0.3,0,Math.PI*2);c.fill();
  c.beginPath();c.ellipse(x+sz*0.85-sway,y+sz*0.5,sz*0.1,sz*0.2,-0.3,0,Math.PI*2);c.fill();
  // Head
  const hg=c.createRadialGradient(x+sz*.45,y+sz*.1,1,x+sz/2,y+sz*.15,sz*.2);
  hg.addColorStop(0,fl?"#fff":"#e0e4f0");hg.addColorStop(1,fl?"#eee":"#b8c0d0");
  c.fillStyle=hg;c.beginPath();c.arc(x+sz/2,y+sz*.15,sz*.2,0,Math.PI*2);c.fill();
  // Horns
  if(!fl){c.fillStyle="#8890a0";
    c.beginPath();c.moveTo(x+sz*0.32,y+sz*0.05);c.lineTo(x+sz*0.25,y-sz*0.08);c.lineTo(x+sz*0.38,y+sz*0.08);c.fill();
    c.beginPath();c.moveTo(x+sz*0.68,y+sz*0.05);c.lineTo(x+sz*0.75,y-sz*0.08);c.lineTo(x+sz*0.62,y+sz*0.08);c.fill();}
  // Eyes — glowing blue
  if(!fl){c.fillStyle="#4488ff";c.beginPath();c.arc(x+sz*0.4,y+sz*0.14,2,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(x+sz*0.6,y+sz*0.14,2,0,Math.PI*2);c.fill();
    c.fillStyle="#88ccff";c.beginPath();c.arc(x+sz*0.4,y+sz*0.13,1,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(x+sz*0.6,y+sz*0.13,1,0,Math.PI*2);c.fill();}
  // Mouth
  if(!fl){c.strokeStyle="#6a7080";c.lineWidth=1;c.beginPath();c.arc(x+sz/2,y+sz*0.22,3,0.2,Math.PI-0.2);c.stroke();}
  // Ice crystals (showing it's an ice creature)
  const sparkle=Math.sin(t/200)*0.4+0.6;
  c.fillStyle=`rgba(150,200,255,${sparkle*0.4})`;
  c.beginPath();c.arc(x+sz*0.2,y+sz*0.3,2,0,Math.PI*2);c.fill();
  c.beginPath();c.arc(x+sz*0.8,y+sz*0.35,1.5,0,Math.PI*2);c.fill();
}
