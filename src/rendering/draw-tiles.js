import { T, TL, CO, RO } from '../constants.js';
import { hs } from '../utils/helpers.js';
import { dH } from './draw-hud.js';

export function dT(c,tl,px,py,iD,dg,t,ei){
  switch(tl){
    case T.GRASS:{
      // Lush multi-shade grass with sun-dappled look
      const g=c.createRadialGradient(px+16+hs(px,py,0)*14-7,py+16+hs(px,py,1)*14-7,2,px+16,py+16,26);
      const baseG=hs(px,py,0);
      g.addColorStop(0,baseG>.6?"#5cbd48":baseG>.3?"#4aaa3a":"#50b840");
      g.addColorStop(0.4,"#44a038");
      g.addColorStop(0.7,"#3a9430");
      g.addColorStop(1,"#328a2a");
      c.fillStyle=g;c.fillRect(px,py,TL,TL);
      // Darker patches for depth
      c.fillStyle="rgba(30,100,20,0.2)";
      const n2=2+((hs(px,py,50)*3)|0);
      for(let i=0;i<n2;i++){
        const dx=px+hs(px,py,51+i*3)*26+3,dy=py+hs(px,py,52+i*3)*26+3;
        c.beginPath();c.arc(dx,dy,4+hs(px,py,53+i*3)*4,0,Math.PI*2);c.fill();
      }
      // Lighter sun-dappled highlights
      c.fillStyle="rgba(100,200,70,0.18)";
      const hx=px+hs(px,py,70)*20+6,hy=py+hs(px,py,71)*16+4;
      c.beginPath();c.arc(hx,hy,5+hs(px,py,72)*5,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(120,210,80,0.12)";
      c.beginPath();c.arc(px+hs(px,py,73)*22+5,py+hs(px,py,74)*18+7,4+hs(px,py,75)*3,0,Math.PI*2);c.fill();
      // Swaying grass blades — animated with wind
      const tufts=4+((hs(px,py,80)*3)|0);
      const wind=Math.sin(t/1200+px/60)*1.5+Math.sin(t/800+py/50)*0.8;
      for(let i=0;i<tufts;i++){
        const tx=px+hs(px,py,81+i*4)*26+3,ty=py+hs(px,py,82+i*4)*20+8;
        const th=4+hs(px,py,83+i*4)*5;
        const tShade=hs(px,py,84+i*4);
        const sway=wind+Math.sin(t/600+tx/20+i*1.5)*1.8;
        c.strokeStyle=tShade>.6?"#2a7a1a":tShade>.3?"#348a24":"#40a030";
        c.lineWidth=1;c.lineCap="round";
        c.beginPath();c.moveTo(tx,ty+th);c.quadraticCurveTo(tx+sway*0.6,ty+th*0.4,tx+sway,ty);c.stroke();
        c.beginPath();c.moveTo(tx+3,ty+th);c.quadraticCurveTo(tx+3+sway*0.5,ty+th*0.3,tx+4+sway*0.8,ty+1);c.stroke();
      }
      c.lineCap="butt";
      // Tiny dark texture dots
      c.fillStyle="rgba(20,60,10,0.25)";
      for(let i=0;i<4;i++){
        c.beginPath();c.arc(px+hs(px,py,90+i)*28+2,py+hs(px,py,91+i)*28+2,0.6+hs(px,py,92+i)*0.6,0,Math.PI*2);c.fill();
      }
      break;}
    case T.WATER:{
      // Deep blue-green gradient water
      const wg=c.createRadialGradient(px+16+Math.sin(t/800+px/40)*4,py+16+Math.cos(t/700+py/40)*4,3,px+16,py+16,26);
      wg.addColorStop(0,"#3888cc");wg.addColorStop(0.3,"#3070b8");wg.addColorStop(0.6,"#2860a0");wg.addColorStop(0.85,"#1e5490");wg.addColorStop(1,"#184878");
      c.fillStyle=wg;c.fillRect(px,py,TL,TL);
      // Deeper color band at bottom
      c.fillStyle="rgba(15,40,80,0.15)";c.fillRect(px,py+24,TL,8);
      const w=Math.sin(t/600+px/30)*2.5,w2=Math.sin(t/500+py/25)*2,w3=Math.sin(t/450+px/20+py/35)*1.5;
      // Primary wave
      c.strokeStyle="rgba(100,170,230,0.35)";c.lineWidth=1.8;
      c.beginPath();c.moveTo(px-3,py+7+w);c.bezierCurveTo(px+8,py+4+w,px+20,py+10+w,px+35,py+7+w);c.stroke();
      // Secondary wave
      c.strokeStyle="rgba(80,150,210,0.28)";c.lineWidth=1.4;
      c.beginPath();c.moveTo(px-4,py+18+w2);c.bezierCurveTo(px+10,py+15+w2,px+22,py+21+w2,px+36,py+18+w2);c.stroke();
      // Tertiary subtle wave
      c.strokeStyle="rgba(60,130,190,0.18)";c.lineWidth=1;
      c.beginPath();c.moveTo(px-2,py+28+w3);c.bezierCurveTo(px+10,py+26+w3,px+22,py+30+w3,px+34,py+28+w3);c.stroke();
      // Shimmer highlights
      const sh=Math.sin(t/250+px/15+py/20)*.1+.08;
      c.fillStyle=`rgba(200,235,255,${sh})`;c.beginPath();c.arc(px+10+w,py+5,3.5,0,Math.PI*2);c.fill();
      c.fillStyle=`rgba(180,220,250,${sh*.8})`;c.beginPath();c.arc(px+24-w2,py+22,2.8,0,Math.PI*2);c.fill();
      c.fillStyle=`rgba(220,240,255,${sh*.5})`;c.beginPath();c.arc(px+18+w3,py+13,2,0,Math.PI*2);c.fill();
      // Sparkle reflections
      const sp2=Math.sin(t/180+px*0.3+py*0.2);
      if(sp2>0.6){c.fillStyle=`rgba(255,255,255,${(sp2-0.6)*2.2})`;c.beginPath();c.arc(px+16+w,py+14+w2,1.2,0,Math.PI*2);c.fill();}
      const sp3=Math.sin(t/220+px*0.2+py*0.35);
      if(sp3>0.7){c.fillStyle=`rgba(255,255,255,${(sp3-0.7)*2})`;c.beginPath();c.arc(px+8-w2,py+26,0.8,0,Math.PI*2);c.fill();}
      // Foam bubbles
      c.fillStyle=`rgba(200,230,255,${0.06+Math.sin(t/400+px*0.15)*0.04})`;
      for(let i=0;i<3;i++){
        const bx=px+hs(px,py,200+i)*24+4,by=py+hs(px,py,201+i)*24+4;
        const br=0.8+hs(px,py,202+i)*1.2;
        c.beginPath();c.arc(bx+Math.sin(t/600+i)*1.5,by,br,0,Math.PI*2);c.fill();
      }
      break;}
    case T.TREE:{
      // Draw grass base first
      const tgg=c.createRadialGradient(px+16+hs(px,py,0)*10-5,py+16+hs(px,py,1)*10-5,3,px+16,py+16,24);
      tgg.addColorStop(0,"#44a038");tgg.addColorStop(1,"#38982e");c.fillStyle=tgg;c.fillRect(px,py,TL,TL);
      // Ground shadow beneath tree
      c.fillStyle="rgba(0,0,0,0.13)";
      c.beginPath();c.ellipse(px+18,py+28,13,4,0.1,0,Math.PI*2);c.fill();
      const tv=((Math.floor(px/TL)*13+Math.floor(py/TL)*7)&3);
      if(tv===0){// Round oak — large canopy, thick trunk with bark
        // Thick trunk
        c.fillStyle="#4a2810";c.fillRect(px+11,py+18,10,14);
        // Bark texture lines
        c.fillStyle="#3a1c08";c.fillRect(px+13,py+20,1,10);c.fillRect(px+16,py+19,1,11);c.fillRect(px+19,py+21,1,9);
        // Bark highlight
        c.fillStyle="#5a3818";c.fillRect(px+14,py+20,1,8);c.fillRect(px+18,py+22,1,6);
        // Large round canopy with layered shading
        const tg=c.createRadialGradient(px+13,py+6,2,px+16,py+11,15);
        tg.addColorStop(0,"#4cb838");tg.addColorStop(0.4,"#3a9028");tg.addColorStop(0.7,"#1e6810");tg.addColorStop(1,"#145008");
        c.fillStyle=tg;c.beginPath();c.arc(px+16,py+10,15,0,Math.PI*2);c.fill();
        // Canopy highlight bumps
        c.fillStyle="rgba(70,160,50,0.45)";c.beginPath();c.arc(px+11,py+6,5,0,Math.PI*2);c.fill();
        c.fillStyle="rgba(80,180,55,0.3)";c.beginPath();c.arc(px+19,py+8,4,0,Math.PI*2);c.fill();
        c.fillStyle="rgba(60,140,40,0.35)";c.beginPath();c.arc(px+14,py+12,4.5,0,Math.PI*2);c.fill();
        // Dark leaf clusters on edge
        c.fillStyle="rgba(15,60,8,0.25)";c.beginPath();c.arc(px+6,py+14,4,0,Math.PI*2);c.fill();
        c.beginPath();c.arc(px+24,py+12,3.5,0,Math.PI*2);c.fill();
      }else if(tv===1){// Tall pine — triangular layers, thin trunk
        // Thin trunk
        c.fillStyle="#5a3818";c.fillRect(px+14,py+22,4,10);
        c.fillStyle="#4a2808";c.fillRect(px+15,py+23,1,8);
        // Bottom layer
        c.fillStyle="#1a5510";c.beginPath();c.moveTo(px+16,py+8);c.lineTo(px+27,py+22);c.lineTo(px+5,py+22);c.fill();
        // Middle layer
        c.fillStyle="#1e6012";c.beginPath();c.moveTo(px+16,py+4);c.lineTo(px+25,py+15);c.lineTo(px+7,py+15);c.fill();
        // Top layer
        c.fillStyle="#228818";c.beginPath();c.moveTo(px+16,py+0);c.lineTo(px+23,py+10);c.lineTo(px+9,py+10);c.fill();
        // Snow tip highlight
        c.fillStyle="rgba(220,240,220,0.35)";c.beginPath();c.moveTo(px+16,py+0);c.lineTo(px+18,py+3);c.lineTo(px+14,py+3);c.fill();
        // Layer edge highlights
        c.fillStyle="rgba(50,140,35,0.3)";
        c.beginPath();c.moveTo(px+16,py+4);c.lineTo(px+20,py+10);c.lineTo(px+12,py+10);c.fill();
        // Dark shadow on right side
        c.fillStyle="rgba(10,40,5,0.2)";
        c.beginPath();c.moveTo(px+16,py+8);c.lineTo(px+27,py+22);c.lineTo(px+16,py+22);c.fill();
      }else if(tv===2){// Wide canopy — spreading branches, dappled light
        // Trunk with visible branches
        c.fillStyle="#4a2810";c.fillRect(px+13,py+20,6,12);
        c.fillStyle="#3a1c08";c.fillRect(px+15,py+22,1,8);
        // Branch stubs
        c.fillStyle="#4a2810";
        c.fillRect(px+8,py+17,6,3);c.fillRect(px+18,py+15,6,3);
        // Wide elliptical canopy
        const tg2=c.createRadialGradient(px+12,py+8,3,px+16,py+12,16);
        tg2.addColorStop(0,"#3aaa28");tg2.addColorStop(0.5,"#2a8020");tg2.addColorStop(1,"#145008");
        c.fillStyle=tg2;c.beginPath();c.ellipse(px+16,py+11,16,11,0,0,Math.PI*2);c.fill();
        // Dappled light spots
        c.fillStyle="rgba(90,190,60,0.35)";c.beginPath();c.arc(px+10,py+8,4,0,Math.PI*2);c.fill();
        c.fillStyle="rgba(100,200,70,0.25)";c.beginPath();c.arc(px+20,py+10,3.5,0,Math.PI*2);c.fill();
        c.fillStyle="rgba(80,170,50,0.3)";c.beginPath();c.arc(px+14,py+14,3,0,Math.PI*2);c.fill();
        // Dark underside
        c.fillStyle="rgba(10,50,5,0.2)";c.beginPath();c.ellipse(px+16,py+18,12,4,0,0,Math.PI*2);c.fill();
      }else{// Birch — distinctive white/grey striped trunk, lighter leaves
        // White/grey trunk with bark stripes
        c.fillStyle="#e0d8c8";c.fillRect(px+13,py+10,5,22);
        // Bark stripe marks (dark horizontal)
        c.fillStyle="#888078";c.fillRect(px+13,py+13,5,1);c.fillRect(px+14,py+17,3,1.5);
        c.fillRect(px+13,py+22,5,1);c.fillRect(px+14,py+26,4,1);
        // Slight bark highlight
        c.fillStyle="#f0e8d8";c.fillRect(px+14,py+11,2,2);c.fillRect(px+15,py+19,2,2);
        // Light airy canopy
        const bg3=c.createRadialGradient(px+13,py+5,2,px+16,py+8,10);
        bg3.addColorStop(0,"#60c848");bg3.addColorStop(0.5,"#4aaa3a");bg3.addColorStop(1,"#30882a");
        c.fillStyle=bg3;c.beginPath();c.arc(px+16,py+8,10,0,Math.PI*2);c.fill();
        // Light leaf clusters
        c.fillStyle="rgba(100,210,70,0.35)";c.beginPath();c.arc(px+12,py+5,4.5,0,Math.PI*2);c.fill();
        c.fillStyle="rgba(110,220,80,0.25)";c.beginPath();c.arc(px+20,py+7,3.5,0,Math.PI*2);c.fill();
        c.fillStyle="rgba(90,200,60,0.3)";c.beginPath();c.arc(px+16,py+11,3,0,Math.PI*2);c.fill();
      }break;}
    case T.WALL:{const wg2=c.createLinearGradient(px,py,px,py+TL);const wclr=iD?dg.wc:"#4a3728";wg2.addColorStop(0,wclr);wg2.addColorStop(1,"rgba(0,0,0,0.3)");
      c.fillStyle=iD?dg.wc:"#4a3728";c.fillRect(px,py,TL,TL);c.fillStyle=wg2;c.fillRect(px,py,TL,TL);
      c.fillStyle="rgba(0,0,0,0.12)";c.fillRect(px,py+8,TL,1);c.fillRect(px,py+16,TL,1);c.fillRect(px,py+24,TL,1);
      c.fillRect(px+16,py,1,8);c.fillRect(px+8,py+8,1,8);c.fillRect(px+24,py+16,1,8);
      c.fillStyle="rgba(255,255,255,0.1)";c.fillRect(px,py,TL,2);break;}
    case T.ENTRANCE:{
      const di=ei?ei.di:-1,qx=ei?ei.qx:0,qy=ei?ei.qy:0;
      if(di===0){
        // D0: Forest Temple — ancient overgrown stone temple with stairs
        if(qy===0){
          if(qx===0){
            // Top-left: left pillar + left half of archway
            // Stone wall background
            const bg=c.createLinearGradient(px,py,px+TL,py+TL);bg.addColorStop(0,"#5a6a55");bg.addColorStop(1,"#3a4a35");
            c.fillStyle=bg;c.fillRect(px,py,TL,TL);
            // Left stone pillar — thick, weathered
            const plg=c.createLinearGradient(px,py,px+14,py);plg.addColorStop(0,"#6a7a65");plg.addColorStop(0.5,"#5a6a55");plg.addColorStop(1,"#4a5a45");
            c.fillStyle=plg;c.fillRect(px,py,14,TL);
            // Pillar cap stone
            c.fillStyle="#7a8a75";c.fillRect(px,py,16,5);
            c.fillStyle="rgba(0,0,0,0.15)";c.fillRect(px,py+5,16,1);
            // Weathered stone lines on pillar
            c.fillStyle="rgba(0,0,0,0.1)";c.fillRect(px+2,py+10,10,1);c.fillRect(px+2,py+18,10,1);c.fillRect(px+2,py+26,10,1);
            c.fillStyle="rgba(255,255,255,0.06)";c.fillRect(px+2,py+11,10,1);c.fillRect(px+2,py+19,10,1);
            // Moss on pillar
            c.fillStyle="rgba(50,130,35,0.55)";
            c.fillRect(px+1,py+7,5,4);c.fillRect(px,py+20,6,5);c.fillRect(px+3,py+28,4,3);
            c.fillStyle="rgba(70,150,50,0.4)";
            c.fillRect(px+2,py+14,4,3);c.fillRect(px+5,py+22,5,3);
            // Dark archway opening — left half
            const ag=c.createRadialGradient(px+TL,py+20,2,px+TL,py+18,22);
            ag.addColorStop(0,"#010401");ag.addColorStop(0.6,"#020803");ag.addColorStop(1,"#0a140a");
            c.fillStyle=ag;c.fillRect(px+14,py+5,TL-14,TL-5);
            // Archway stone top — curved lintel left portion
            c.fillStyle="#6a7a65";c.fillRect(px+14,py,TL-14,7);
            const alg=c.createLinearGradient(px+14,py,px+14,py+10);alg.addColorStop(0,"#7a8a78");alg.addColorStop(1,"#4a5a48");
            c.fillStyle=alg;
            c.beginPath();c.moveTo(px+14,py+7);c.quadraticCurveTo(px+22,py+4,px+TL,py+3);c.lineTo(px+TL,py+7);c.lineTo(px+14,py+7);c.fill();
            // Moss on lintel
            c.fillStyle="rgba(50,120,35,0.5)";c.fillRect(px+16,py+1,8,3);c.fillRect(px+20,py,6,2);
            // Hanging vines from archway
            const vs=Math.sin(t/900)*2;
            c.strokeStyle="rgba(35,100,25,0.75)";c.lineWidth=2;c.lineCap="round";
            c.beginPath();c.moveTo(px+18,py+7);c.quadraticCurveTo(px+17+vs,py+16,px+19+vs,py+24);c.stroke();
            c.strokeStyle="rgba(45,110,35,0.55)";c.lineWidth=1.5;
            c.beginPath();c.moveTo(px+25,py+5);c.quadraticCurveTo(px+26+vs*0.6,py+12,px+24+vs*0.6,py+18);c.stroke();
            c.lineCap="butt";
            // Vine leaves
            c.fillStyle="rgba(60,140,40,0.6)";
            c.beginPath();c.arc(px+19+vs,py+24,2,0,Math.PI*2);c.fill();
            c.beginPath();c.arc(px+17+vs*0.8,py+18,1.5,0,Math.PI*2);c.fill();
            // Green glow from within
            const gp=Math.sin(t/500)*.12+.18;
            const ig=c.createRadialGradient(px+TL,py+20,0,px+TL,py+18,20);
            ig.addColorStop(0,`rgba(40,180,60,${gp})`);ig.addColorStop(1,"rgba(0,0,0,0)");
            c.fillStyle=ig;c.fillRect(px+14,py+5,TL-14,TL-5);
          }else{
            // Top-right: right half of archway + right pillar
            const bg=c.createLinearGradient(px,py,px+TL,py+TL);bg.addColorStop(0,"#3a4a35");bg.addColorStop(1,"#5a6a55");
            c.fillStyle=bg;c.fillRect(px,py,TL,TL);
            // Right stone pillar
            const prg=c.createLinearGradient(px+TL-14,py,px+TL,py);prg.addColorStop(0,"#4a5a45");prg.addColorStop(0.5,"#5a6a55");prg.addColorStop(1,"#6a7a65");
            c.fillStyle=prg;c.fillRect(px+TL-14,py,14,TL);
            // Pillar cap
            c.fillStyle="#7a8a75";c.fillRect(px+TL-16,py,16,5);
            c.fillStyle="rgba(0,0,0,0.15)";c.fillRect(px+TL-16,py+5,16,1);
            // Weathered lines
            c.fillStyle="rgba(0,0,0,0.1)";c.fillRect(px+TL-12,py+10,10,1);c.fillRect(px+TL-12,py+18,10,1);c.fillRect(px+TL-12,py+26,10,1);
            c.fillStyle="rgba(255,255,255,0.06)";c.fillRect(px+TL-12,py+11,10,1);c.fillRect(px+TL-12,py+19,10,1);
            // Moss on right pillar
            c.fillStyle="rgba(50,130,35,0.55)";
            c.fillRect(px+TL-6,py+9,5,4);c.fillRect(px+TL-7,py+22,6,5);c.fillRect(px+TL-5,py+30,4,2);
            c.fillStyle="rgba(70,150,50,0.4)";
            c.fillRect(px+TL-8,py+15,5,3);
            // Dark archway — right half
            const ag=c.createRadialGradient(px,py+20,2,px,py+18,22);
            ag.addColorStop(0,"#010401");ag.addColorStop(0.6,"#020803");ag.addColorStop(1,"#0a140a");
            c.fillStyle=ag;c.fillRect(px,py+5,TL-14,TL-5);
            // Archway stone top right
            c.fillStyle="#6a7a65";c.fillRect(px,py,TL-14,7);
            const alg=c.createLinearGradient(px,py,px,py+10);alg.addColorStop(0,"#7a8a78");alg.addColorStop(1,"#4a5a48");
            c.fillStyle=alg;
            c.beginPath();c.moveTo(px,py+3);c.quadraticCurveTo(px+10,py+4,px+TL-14,py+7);c.lineTo(px,py+7);c.fill();
            // Moss on lintel
            c.fillStyle="rgba(50,120,35,0.5)";c.fillRect(px+2,py,8,3);c.fillRect(px+8,py+1,6,2);
            // Hanging vines
            const vs=Math.sin(t/900)*2;
            c.strokeStyle="rgba(35,100,25,0.75)";c.lineWidth=2;c.lineCap="round";
            c.beginPath();c.moveTo(px+12,py+6);c.quadraticCurveTo(px+13+vs*0.8,py+14,px+11+vs*0.8,py+22);c.stroke();
            c.strokeStyle="rgba(45,110,35,0.55)";c.lineWidth=1.5;
            c.beginPath();c.moveTo(px+5,py+5);c.quadraticCurveTo(px+4+vs*0.5,py+10,px+6+vs*0.5,py+16);c.stroke();
            c.lineCap="butt";
            // Vine leaves
            c.fillStyle="rgba(60,140,40,0.6)";
            c.beginPath();c.arc(px+11+vs*0.8,py+22,2,0,Math.PI*2);c.fill();
            // Green glow
            const gp=Math.sin(t/500)*.12+.18;
            const ig=c.createRadialGradient(px,py+20,0,px,py+18,20);
            ig.addColorStop(0,`rgba(40,180,60,${gp})`);ig.addColorStop(1,"rgba(0,0,0,0)");
            c.fillStyle=ig;c.fillRect(px,py+5,TL-14,TL-5);
          }
        }else{
          if(qx===0){
            // Bottom-left: left pillar base + stone stairs left half
            const bg=c.createLinearGradient(px,py,px,py+TL);bg.addColorStop(0,"#3a4a35");bg.addColorStop(1,"#4a6040");
            c.fillStyle=bg;c.fillRect(px,py,TL,TL);
            // Left pillar base continues
            const plg=c.createLinearGradient(px,py,px+14,py);plg.addColorStop(0,"#6a7a65");plg.addColorStop(0.5,"#5a6a55");plg.addColorStop(1,"#4a5a45");
            c.fillStyle=plg;c.fillRect(px,py,14,TL);
            // Pillar base stone (wider)
            c.fillStyle="#7a8a75";c.fillRect(px,py+TL-6,16,6);
            c.fillStyle="rgba(0,0,0,0.12)";c.fillRect(px,py+TL-7,16,1);
            // Moss on lower pillar
            c.fillStyle="rgba(50,130,35,0.5)";
            c.fillRect(px+1,py+4,5,4);c.fillRect(px,py+14,6,5);c.fillRect(px+2,py+22,4,3);
            // Stone stairs — left half, ascending
            c.fillStyle="#5a6a58";c.fillRect(px+14,py,TL-14,8);
            c.fillStyle="#4a5a48";c.fillRect(px+14,py+8,TL-14,8);
            c.fillStyle="#3a4a38";c.fillRect(px+14,py+16,TL-14,8);
            c.fillStyle="#2a3a28";c.fillRect(px+14,py+24,TL-14,8);
            // Stair edges (light highlight on top of each step)
            c.fillStyle="rgba(255,255,255,0.1)";
            c.fillRect(px+14,py,TL-14,1);c.fillRect(px+14,py+8,TL-14,1);c.fillRect(px+14,py+16,TL-14,1);c.fillRect(px+14,py+24,TL-14,1);
            c.fillStyle="rgba(0,0,0,0.15)";
            c.fillRect(px+14,py+7,TL-14,1);c.fillRect(px+14,py+15,TL-14,1);c.fillRect(px+14,py+23,TL-14,1);c.fillRect(px+14,py+31,TL-14,1);
            // Grass creeping on stairs
            c.fillStyle="rgba(60,140,40,0.45)";
            c.fillRect(px+14,py+6,4,3);c.fillRect(px+14,py+22,5,3);c.fillRect(px+14,py+14,3,2);
            // Tree roots at base
            c.fillStyle="#3a2810";c.strokeStyle="#3a2810";c.lineWidth=2;
            c.beginPath();c.moveTo(px+14,py+TL);c.quadraticCurveTo(px+16,py+26,px+20,py+TL);c.fill();
          }else{
            // Bottom-right: right pillar base + stone stairs right half
            const bg=c.createLinearGradient(px,py,px,py+TL);bg.addColorStop(0,"#3a4a35");bg.addColorStop(1,"#4a6040");
            c.fillStyle=bg;c.fillRect(px,py,TL,TL);
            // Right pillar base
            const prg=c.createLinearGradient(px+TL-14,py,px+TL,py);prg.addColorStop(0,"#4a5a45");prg.addColorStop(0.5,"#5a6a55");prg.addColorStop(1,"#6a7a65");
            c.fillStyle=prg;c.fillRect(px+TL-14,py,14,TL);
            // Pillar base stone
            c.fillStyle="#7a8a75";c.fillRect(px+TL-16,py+TL-6,16,6);
            c.fillStyle="rgba(0,0,0,0.12)";c.fillRect(px+TL-16,py+TL-7,16,1);
            // Moss on lower right pillar
            c.fillStyle="rgba(50,130,35,0.5)";
            c.fillRect(px+TL-6,py+6,5,4);c.fillRect(px+TL-7,py+16,6,4);c.fillRect(px+TL-5,py+24,4,3);
            // Stone stairs — right half
            c.fillStyle="#5a6a58";c.fillRect(px,py,TL-14,8);
            c.fillStyle="#4a5a48";c.fillRect(px,py+8,TL-14,8);
            c.fillStyle="#3a4a38";c.fillRect(px,py+16,TL-14,8);
            c.fillStyle="#2a3a28";c.fillRect(px,py+24,TL-14,8);
            // Stair edge highlights
            c.fillStyle="rgba(255,255,255,0.1)";
            c.fillRect(px,py,TL-14,1);c.fillRect(px,py+8,TL-14,1);c.fillRect(px,py+16,TL-14,1);c.fillRect(px,py+24,TL-14,1);
            c.fillStyle="rgba(0,0,0,0.15)";
            c.fillRect(px,py+7,TL-14,1);c.fillRect(px,py+15,TL-14,1);c.fillRect(px,py+23,TL-14,1);c.fillRect(px,py+31,TL-14,1);
            // Grass creeping on stairs
            c.fillStyle="rgba(60,140,40,0.45)";
            c.fillRect(px+TL-18,py+6,4,3);c.fillRect(px+TL-18,py+20,5,3);c.fillRect(px+TL-17,py+14,3,2);
            // Tree roots at base
            c.fillStyle="#3a2810";
            c.beginPath();c.moveTo(px+TL-14,py+TL);c.quadraticCurveTo(px+TL-16,py+26,px+TL-20,py+TL);c.fill();
          }
        }
      }else if(di===1){
        // D1: Fire Cavern — jagged rocky cave mouth with warm glow
        if(qy===0){
          if(qx===0){
            // Top-left: left rocky wall + cave opening with stalactites
            // Rocky mountain backdrop
            const bg=c.createLinearGradient(px,py,px+TL,py+TL);bg.addColorStop(0,"#5a4a3a");bg.addColorStop(1,"#3a2a1a");
            c.fillStyle=bg;c.fillRect(px,py,TL,TL);
            // Left jagged rock wall
            c.fillStyle="#4a3a2a";
            c.beginPath();c.moveTo(px,py);c.lineTo(px+16,py);c.lineTo(px+14,py+6);c.lineTo(px+18,py+12);c.lineTo(px+12,py+18);c.lineTo(px+16,py+24);c.lineTo(px+14,py+TL);c.lineTo(px,py+TL);c.fill();
            // Rock texture
            c.fillStyle="rgba(90,70,50,0.5)";
            c.fillRect(px+2,py+5,6,3);c.fillRect(px+4,py+15,5,2);c.fillRect(px+1,py+24,7,3);
            c.fillStyle="rgba(0,0,0,0.15)";
            c.fillRect(px+3,py+9,4,1);c.fillRect(px+2,py+20,5,1);
            // Dark cave opening — left half
            const cg=c.createRadialGradient(px+TL,py+22,3,px+TL,py+20,24);
            cg.addColorStop(0,"#080200");cg.addColorStop(0.5,"#0c0400");cg.addColorStop(1,"#1a0a04");
            c.fillStyle=cg;c.fillRect(px+12,py+6,TL-12,TL-6);
            // Stalactites hanging from top
            c.fillStyle="#4a3a28";
            c.beginPath();c.moveTo(px+14,py);c.lineTo(px+16,py+10);c.lineTo(px+18,py);c.fill();
            c.beginPath();c.moveTo(px+22,py);c.lineTo(px+23,py+7);c.lineTo(px+25,py);c.fill();
            c.beginPath();c.moveTo(px+28,py);c.lineTo(px+30,py+12);c.lineTo(px+TL,py);c.fill();
            c.fillStyle="#3a2a18";
            c.beginPath();c.moveTo(px+19,py);c.lineTo(px+20,py+5);c.lineTo(px+21,py);c.fill();
            // Warm orange glow from within
            const gp=Math.sin(t/400)*.15+.25;
            const ig=c.createRadialGradient(px+TL,py+24,2,px+TL,py+22,28);
            ig.addColorStop(0,`rgba(255,120,20,${gp})`);ig.addColorStop(0.5,`rgba(200,60,10,${gp*0.4})`);ig.addColorStop(1,"rgba(0,0,0,0)");
            c.fillStyle=ig;c.fillRect(px+12,py+6,TL-12,TL-6);
            // Ember particles
            const ep1=(Math.sin(t/200+1)*0.5+0.5);
            const ep2=(Math.sin(t/170+2)*0.5+0.5);
            c.fillStyle=`rgba(255,180,40,${ep1*0.7})`;c.beginPath();c.arc(px+20,py+14-ep1*3,1.2,0,Math.PI*2);c.fill();
            c.fillStyle=`rgba(255,100,20,${ep2*0.5})`;c.beginPath();c.arc(px+28,py+10-ep2*4,0.8,0,Math.PI*2);c.fill();
          }else{
            // Top-right: cave opening + right rocky wall
            const bg=c.createLinearGradient(px,py,px+TL,py+TL);bg.addColorStop(0,"#3a2a1a");bg.addColorStop(1,"#5a4a3a");
            c.fillStyle=bg;c.fillRect(px,py,TL,TL);
            // Right jagged rock wall
            c.fillStyle="#4a3a2a";
            c.beginPath();c.moveTo(px+TL,py);c.lineTo(px+TL-16,py);c.lineTo(px+TL-14,py+8);c.lineTo(px+TL-18,py+14);c.lineTo(px+TL-12,py+20);c.lineTo(px+TL-16,py+26);c.lineTo(px+TL-14,py+TL);c.lineTo(px+TL,py+TL);c.fill();
            // Rock texture
            c.fillStyle="rgba(90,70,50,0.5)";
            c.fillRect(px+TL-8,py+6,6,3);c.fillRect(px+TL-7,py+17,5,2);c.fillRect(px+TL-9,py+26,7,3);
            c.fillStyle="rgba(0,0,0,0.15)";
            c.fillRect(px+TL-7,py+11,4,1);c.fillRect(px+TL-6,py+22,5,1);
            // Cave opening — right half
            const cg=c.createRadialGradient(px,py+22,3,px,py+20,24);
            cg.addColorStop(0,"#080200");cg.addColorStop(0.5,"#0c0400");cg.addColorStop(1,"#1a0a04");
            c.fillStyle=cg;c.fillRect(px,py+6,TL-12,TL-6);
            // Stalactites
            c.fillStyle="#4a3a28";
            c.beginPath();c.moveTo(px,py);c.lineTo(px+2,py+11);c.lineTo(px+4,py);c.fill();
            c.beginPath();c.moveTo(px+7,py);c.lineTo(px+8,py+6);c.lineTo(px+10,py);c.fill();
            c.beginPath();c.moveTo(px+14,py);c.lineTo(px+16,py+9);c.lineTo(px+18,py);c.fill();
            c.fillStyle="#3a2a18";
            c.beginPath();c.moveTo(px+11,py);c.lineTo(px+12,py+4);c.lineTo(px+13,py);c.fill();
            // Warm glow
            const gp=Math.sin(t/400)*.15+.25;
            const ig=c.createRadialGradient(px,py+24,2,px,py+22,28);
            ig.addColorStop(0,`rgba(255,120,20,${gp})`);ig.addColorStop(0.5,`rgba(200,60,10,${gp*0.4})`);ig.addColorStop(1,"rgba(0,0,0,0)");
            c.fillStyle=ig;c.fillRect(px,py+6,TL-12,TL-6);
            // Embers
            const ep1=(Math.sin(t/200+3)*0.5+0.5);
            const ep2=(Math.sin(t/170+4)*0.5+0.5);
            c.fillStyle=`rgba(255,180,40,${ep1*0.6})`;c.beginPath();c.arc(px+6,py+12-ep1*3,1,0,Math.PI*2);c.fill();
            c.fillStyle=`rgba(255,100,20,${ep2*0.5})`;c.beginPath();c.arc(px+14,py+16-ep2*4,0.8,0,Math.PI*2);c.fill();
          }
        }else{
          if(qx===0){
            // Bottom-left: rocky ground + boulders, left side
            const bg=c.createLinearGradient(px,py,px,py+TL);bg.addColorStop(0,"#3a2a1a");bg.addColorStop(1,"#4a3a28");
            c.fillStyle=bg;c.fillRect(px,py,TL,TL);
            // Left rock wall continues down
            c.fillStyle="#4a3a2a";
            c.beginPath();c.moveTo(px,py);c.lineTo(px+14,py);c.lineTo(px+16,py+8);c.lineTo(px+12,py+16);c.lineTo(px+14,py+TL);c.lineTo(px,py+TL);c.fill();
            // Rocky ground / boulders
            c.fillStyle="#5a4a38";
            c.beginPath();c.arc(px+22,py+24,5,0,Math.PI*2);c.fill();
            c.fillStyle="#4a3a28";
            c.beginPath();c.arc(px+28,py+20,3.5,0,Math.PI*2);c.fill();
            c.fillStyle="#6a5a48";
            c.beginPath();c.arc(px+18,py+28,4,0,Math.PI*2);c.fill();
            // Rough ground texture
            c.fillStyle="rgba(0,0,0,0.12)";
            for(let i=0;i<6;i++){const bx=px+14+hs(px,py,i+20)*18,by=py+hs(px,py,i+30)*TL;c.fillRect(bx,by,3,1);}
            // Warm glow on ground
            const gp=Math.sin(t/400)*.1+.15;
            const ig=c.createRadialGradient(px+TL,py,2,px+TL,py+4,20);
            ig.addColorStop(0,`rgba(255,100,20,${gp})`);ig.addColorStop(1,"rgba(0,0,0,0)");
            c.fillStyle=ig;c.fillRect(px+14,py,TL-14,TL);
            // Scattered small rocks
            c.fillStyle="#5a4838";c.fillRect(px+20,py+8,3,2);c.fillRect(px+26,py+12,2,2);
          }else{
            // Bottom-right: rocky ground + boulders, right side
            const bg=c.createLinearGradient(px,py,px,py+TL);bg.addColorStop(0,"#3a2a1a");bg.addColorStop(1,"#4a3a28");
            c.fillStyle=bg;c.fillRect(px,py,TL,TL);
            // Right rock wall continues down
            c.fillStyle="#4a3a2a";
            c.beginPath();c.moveTo(px+TL,py);c.lineTo(px+TL-14,py);c.lineTo(px+TL-16,py+10);c.lineTo(px+TL-12,py+18);c.lineTo(px+TL-14,py+TL);c.lineTo(px+TL,py+TL);c.fill();
            // Boulders
            c.fillStyle="#5a4a38";
            c.beginPath();c.arc(px+10,py+22,5,0,Math.PI*2);c.fill();
            c.fillStyle="#4a3a28";
            c.beginPath();c.arc(px+4,py+18,3,0,Math.PI*2);c.fill();
            c.fillStyle="#6a5a48";
            c.beginPath();c.arc(px+14,py+28,4,0,Math.PI*2);c.fill();
            // Ground texture
            c.fillStyle="rgba(0,0,0,0.12)";
            for(let i=0;i<6;i++){const bx=px+hs(px,py,i+40)*18,by=py+hs(px,py,i+50)*TL;c.fillRect(bx,by,3,1);}
            // Warm glow on ground
            const gp=Math.sin(t/400)*.1+.15;
            const ig=c.createRadialGradient(px,py,2,px,py+4,20);
            ig.addColorStop(0,`rgba(255,100,20,${gp})`);ig.addColorStop(1,"rgba(0,0,0,0)");
            c.fillStyle=ig;c.fillRect(px,py,TL-14,TL);
            // Scattered small rocks
            c.fillStyle="#5a4838";c.fillRect(px+6,py+10,3,2);c.fillRect(px+2,py+6,2,2);
          }
        }
      }else if(di===2){
        // D2: Shadow Keep — crumbling gothic ruins with purple energy
        if(qy===0){
          if(qx===0){
            // Top-left: broken left pillar + dark archway left half
            const bg=c.createLinearGradient(px,py,px+TL,py+TL);bg.addColorStop(0,"#2a2030");bg.addColorStop(1,"#1a1020");
            c.fillStyle=bg;c.fillRect(px,py,TL,TL);
            // Cracked left pillar
            const plg=c.createLinearGradient(px,py,px+12,py);plg.addColorStop(0,"#3a3040");plg.addColorStop(0.5,"#2a2030");plg.addColorStop(1,"#1a1020");
            c.fillStyle=plg;c.fillRect(px,py,12,TL);
            // Pillar cap — broken/chipped
            c.fillStyle="#4a4050";c.fillRect(px,py,14,4);
            c.fillStyle="#3a3040";
            c.beginPath();c.moveTo(px+12,py);c.lineTo(px+14,py+4);c.lineTo(px+10,py+4);c.fill(); // chip
            // Cracks in pillar
            c.strokeStyle="rgba(0,0,0,0.4)";c.lineWidth=1;
            c.beginPath();c.moveTo(px+4,py+8);c.lineTo(px+6,py+14);c.lineTo(px+3,py+20);c.stroke();
            c.beginPath();c.moveTo(px+8,py+16);c.lineTo(px+6,py+22);c.lineTo(px+9,py+28);c.stroke();
            // Dark archway opening — left half
            const ag=c.createRadialGradient(px+TL,py+20,2,px+TL,py+18,24);
            ag.addColorStop(0,"#020008");ag.addColorStop(0.5,"#040010");ag.addColorStop(1,"#0a0618");
            c.fillStyle=ag;c.fillRect(px+12,py+4,TL-12,TL-4);
            // Gothic archway top — pointed arch left half
            c.fillStyle="#3a3040";
            c.beginPath();c.moveTo(px+12,py+8);c.quadraticCurveTo(px+20,py-2,px+TL,py-4);c.lineTo(px+TL,py+8);c.lineTo(px+12,py+8);c.fill();
            c.fillStyle="#2a2030";c.fillRect(px+12,py+6,TL-12,3);
            // Purple energy wisps floating
            const wp=Math.sin(t/350)*0.3+0.5;
            const ws1=Math.sin(t/600)*4,ws2=Math.cos(t/500)*3;
            c.fillStyle=`rgba(140,50,220,${wp*0.5})`;
            c.beginPath();c.arc(px+20+ws1,py+14+ws2*0.5,2.5,0,Math.PI*2);c.fill();
            c.fillStyle=`rgba(180,80,255,${wp*0.35})`;
            c.beginPath();c.arc(px+26-ws1*0.6,py+22-ws2*0.6,1.8,0,Math.PI*2);c.fill();
            c.fillStyle=`rgba(120,40,200,${wp*0.25})`;
            c.beginPath();c.arc(px+18+ws2,py+28+ws1*0.3,1.5,0,Math.PI*2);c.fill();
            // Violet glow from within
            const gp=Math.sin(t/450)*.15+.2;
            const ig=c.createRadialGradient(px+TL,py+20,0,px+TL,py+18,22);
            ig.addColorStop(0,`rgba(130,50,220,${gp})`);ig.addColorStop(0.6,`rgba(80,20,160,${gp*0.4})`);ig.addColorStop(1,"rgba(0,0,0,0)");
            c.fillStyle=ig;c.fillRect(px+12,py+4,TL-12,TL-4);
          }else{
            // Top-right: dark archway right half + broken right pillar
            const bg=c.createLinearGradient(px,py,px+TL,py+TL);bg.addColorStop(0,"#1a1020");bg.addColorStop(1,"#2a2030");
            c.fillStyle=bg;c.fillRect(px,py,TL,TL);
            // Cracked right pillar
            const prg=c.createLinearGradient(px+TL-12,py,px+TL,py);prg.addColorStop(0,"#1a1020");prg.addColorStop(0.5,"#2a2030");prg.addColorStop(1,"#3a3040");
            c.fillStyle=prg;c.fillRect(px+TL-12,py,12,TL);
            // Broken pillar cap — more damaged
            c.fillStyle="#4a4050";c.fillRect(px+TL-14,py,14,4);
            // Missing chunk from top of pillar
            c.fillStyle="#1a1020";c.fillRect(px+TL-12,py,4,6);
            // Cracks
            c.strokeStyle="rgba(0,0,0,0.4)";c.lineWidth=1;
            c.beginPath();c.moveTo(px+TL-5,py+10);c.lineTo(px+TL-7,py+16);c.lineTo(px+TL-4,py+22);c.stroke();
            c.beginPath();c.moveTo(px+TL-9,py+18);c.lineTo(px+TL-7,py+24);c.lineTo(px+TL-10,py+30);c.stroke();
            // Dark archway — right half
            const ag=c.createRadialGradient(px,py+20,2,px,py+18,24);
            ag.addColorStop(0,"#020008");ag.addColorStop(0.5,"#040010");ag.addColorStop(1,"#0a0618");
            c.fillStyle=ag;c.fillRect(px,py+4,TL-12,TL-4);
            // Gothic arch right half
            c.fillStyle="#3a3040";
            c.beginPath();c.moveTo(px,py-4);c.quadraticCurveTo(px+12,py-2,px+TL-12,py+8);c.lineTo(px,py+8);c.fill();
            c.fillStyle="#2a2030";c.fillRect(px,py+6,TL-12,3);
            // Purple energy wisps
            const wp=Math.sin(t/350)*0.3+0.5;
            const ws1=Math.sin(t/600)*4,ws2=Math.cos(t/500)*3;
            c.fillStyle=`rgba(140,50,220,${wp*0.45})`;
            c.beginPath();c.arc(px+8-ws1*0.7,py+16+ws2*0.4,2,0,Math.PI*2);c.fill();
            c.fillStyle=`rgba(180,80,255,${wp*0.3})`;
            c.beginPath();c.arc(px+14+ws1*0.5,py+24-ws2*0.5,1.5,0,Math.PI*2);c.fill();
            // Violet glow
            const gp=Math.sin(t/450)*.15+.2;
            const ig=c.createRadialGradient(px,py+20,0,px,py+18,22);
            ig.addColorStop(0,`rgba(130,50,220,${gp})`);ig.addColorStop(0.6,`rgba(80,20,160,${gp*0.4})`);ig.addColorStop(1,"rgba(0,0,0,0)");
            c.fillStyle=ig;c.fillRect(px,py+4,TL-12,TL-4);
          }
        }else{
          if(qx===0){
            // Bottom-left: rubble + cracked stone floor left
            const bg=c.createLinearGradient(px,py,px,py+TL);bg.addColorStop(0,"#1a1020");bg.addColorStop(1,"#222030");
            c.fillStyle=bg;c.fillRect(px,py,TL,TL);
            // Left pillar base — crumbled
            c.fillStyle="#3a3040";c.fillRect(px,py,12,TL);
            c.fillStyle="#4a4050";c.fillRect(px,py+TL-5,14,5);
            // Rubble pieces scattered
            c.fillStyle="#4a4050";
            c.beginPath();c.moveTo(px+14,py+20);c.lineTo(px+18,py+18);c.lineTo(px+20,py+22);c.lineTo(px+16,py+24);c.fill();
            c.fillStyle="#3a3040";
            c.beginPath();c.arc(px+24,py+26,3,0,Math.PI*2);c.fill();
            c.fillStyle="#5a5060";
            c.fillRect(px+16,py+28,4,3);c.fillRect(px+22,py+22,3,2);
            // Cracked stone floor
            c.strokeStyle="rgba(0,0,0,0.3)";c.lineWidth=0.8;
            c.beginPath();c.moveTo(px+14,py+14);c.lineTo(px+20,py+18);c.lineTo(px+TL,py+16);c.stroke();
            c.beginPath();c.moveTo(px+18,py+6);c.lineTo(px+22,py+10);c.lineTo(px+28,py+8);c.stroke();
            // Purple energy on ground
            const gp=Math.sin(t/450)*.12+.15;
            c.fillStyle=`rgba(100,40,180,${gp})`;
            c.beginPath();c.arc(px+22,py+12,6,0,Math.PI*2);c.fill();
          }else{
            // Bottom-right: rubble + cracked stone floor right
            const bg=c.createLinearGradient(px,py,px,py+TL);bg.addColorStop(0,"#1a1020");bg.addColorStop(1,"#222030");
            c.fillStyle=bg;c.fillRect(px,py,TL,TL);
            // Right pillar base — crumbled
            c.fillStyle="#3a3040";c.fillRect(px+TL-12,py,12,TL);
            c.fillStyle="#4a4050";c.fillRect(px+TL-14,py+TL-5,14,5);
            // Rubble
            c.fillStyle="#4a4050";
            c.beginPath();c.moveTo(px+TL-20,py+22);c.lineTo(px+TL-16,py+18);c.lineTo(px+TL-14,py+22);c.lineTo(px+TL-18,py+26);c.fill();
            c.fillStyle="#3a3040";
            c.beginPath();c.arc(px+8,py+28,3,0,Math.PI*2);c.fill();
            c.fillStyle="#5a5060";
            c.fillRect(px+10,py+24,4,3);c.fillRect(px+4,py+20,3,2);
            // Cracked stone floor
            c.strokeStyle="rgba(0,0,0,0.3)";c.lineWidth=0.8;
            c.beginPath();c.moveTo(px,py+14);c.lineTo(px+8,py+18);c.lineTo(px+TL-14,py+16);c.stroke();
            c.beginPath();c.moveTo(px+4,py+8);c.lineTo(px+10,py+12);c.lineTo(px+16,py+6);c.stroke();
            // Purple energy on ground
            const gp=Math.sin(t/450)*.12+.15;
            c.fillStyle=`rgba(100,40,180,${gp})`;
            c.beginPath();c.arc(px+10,py+10,6,0,Math.PI*2);c.fill();
          }
        }
      }else if(di===3){
        // D3: Dark Sanctum — volcanic temple with lava veins and flame braziers
        if(qy===0){
          if(qx===0){
            // Top-left: left basalt pillar + imposing doorway left half with brazier
            const bg=c.createLinearGradient(px,py,px+TL,py+TL);bg.addColorStop(0,"#2a2020");bg.addColorStop(1,"#1a0c0c");
            c.fillStyle=bg;c.fillRect(px,py,TL,TL);
            // Left basalt pillar — dark, massive
            const plg=c.createLinearGradient(px,py,px+14,py);plg.addColorStop(0,"#3a2828");plg.addColorStop(0.5,"#2a1a1a");plg.addColorStop(1,"#1a0c0c");
            c.fillStyle=plg;c.fillRect(px,py,14,TL);
            // Pillar cap with carved pattern
            c.fillStyle="#4a3030";c.fillRect(px,py,16,5);
            c.fillStyle="#3a2020";c.fillRect(px+2,py+1,3,2);c.fillRect(px+8,py+1,3,2);
            // Lava veins in pillar
            const lp=Math.sin(t/300)*.2+.6;
            c.strokeStyle=`rgba(255,80,10,${lp})`;c.lineWidth=1.2;
            c.beginPath();c.moveTo(px+5,py+8);c.lineTo(px+7,py+16);c.lineTo(px+4,py+24);c.lineTo(px+6,py+30);c.stroke();
            c.strokeStyle=`rgba(255,160,30,${lp*0.6})`;c.lineWidth=0.8;
            c.beginPath();c.moveTo(px+9,py+12);c.lineTo(px+8,py+18);c.lineTo(px+10,py+22);c.stroke();
            // Dark doorway — left half
            const dg2=c.createRadialGradient(px+TL,py+20,2,px+TL,py+18,24);
            dg2.addColorStop(0,"#080000");dg2.addColorStop(0.5,"#0c0200");dg2.addColorStop(1,"#1a0804");
            c.fillStyle=dg2;c.fillRect(px+14,py+5,TL-14,TL-5);
            // Imposing doorway lintel left half
            c.fillStyle="#3a2020";c.fillRect(px+14,py,TL-14,7);
            c.fillStyle="#4a2828";c.fillRect(px+14,py,TL-14,3);
            // Flame brazier on left pillar top
            const fp=Math.sin(t/150)*0.15+0.85;
            // Brazier bowl
            c.fillStyle="#4a3020";
            c.beginPath();c.moveTo(px+3,py+5);c.lineTo(px+11,py+5);c.lineTo(px+10,py+9);c.lineTo(px+4,py+9);c.fill();
            // Flame
            const fh=Math.sin(t/120)*2;
            c.fillStyle=`rgba(255,160,30,${fp})`;
            c.beginPath();c.moveTo(px+7,py-2+fh);c.quadraticCurveTo(px+4,py+2,px+5,py+5);c.lineTo(px+9,py+5);c.quadraticCurveTo(px+10,py+2,px+7,py-2+fh);c.fill();
            c.fillStyle=`rgba(255,220,80,${fp*0.7})`;
            c.beginPath();c.moveTo(px+7,py+fh);c.quadraticCurveTo(px+5,py+3,px+6,py+5);c.lineTo(px+8,py+5);c.quadraticCurveTo(px+9,py+3,px+7,py+fh);c.fill();
            // Fire glow
            const fg=c.createRadialGradient(px+7,py+2,1,px+7,py+4,12);
            fg.addColorStop(0,`rgba(255,120,20,${fp*0.3})`);fg.addColorStop(1,"rgba(0,0,0,0)");
            c.fillStyle=fg;c.fillRect(px,py-4,16,16);
            // Red glow from within
            const gp=Math.sin(t/400)*.12+.2;
            const ig=c.createRadialGradient(px+TL,py+22,2,px+TL,py+20,24);
            ig.addColorStop(0,`rgba(255,50,10,${gp})`);ig.addColorStop(0.5,`rgba(200,20,0,${gp*0.4})`);ig.addColorStop(1,"rgba(0,0,0,0)");
            c.fillStyle=ig;c.fillRect(px+14,py+5,TL-14,TL-5);
          }else{
            // Top-right: imposing doorway right half + right basalt pillar with brazier
            const bg=c.createLinearGradient(px,py,px+TL,py+TL);bg.addColorStop(0,"#1a0c0c");bg.addColorStop(1,"#2a2020");
            c.fillStyle=bg;c.fillRect(px,py,TL,TL);
            // Right basalt pillar
            const prg=c.createLinearGradient(px+TL-14,py,px+TL,py);prg.addColorStop(0,"#1a0c0c");prg.addColorStop(0.5,"#2a1a1a");prg.addColorStop(1,"#3a2828");
            c.fillStyle=prg;c.fillRect(px+TL-14,py,14,TL);
            // Pillar cap
            c.fillStyle="#4a3030";c.fillRect(px+TL-16,py,16,5);
            c.fillStyle="#3a2020";c.fillRect(px+TL-13,py+1,3,2);c.fillRect(px+TL-7,py+1,3,2);
            // Lava veins
            const lp=Math.sin(t/300)*.2+.6;
            c.strokeStyle=`rgba(255,80,10,${lp})`;c.lineWidth=1.2;
            c.beginPath();c.moveTo(px+TL-6,py+10);c.lineTo(px+TL-8,py+18);c.lineTo(px+TL-5,py+26);c.lineTo(px+TL-7,py+32);c.stroke();
            c.strokeStyle=`rgba(255,160,30,${lp*0.6})`;c.lineWidth=0.8;
            c.beginPath();c.moveTo(px+TL-10,py+14);c.lineTo(px+TL-9,py+20);c.lineTo(px+TL-11,py+24);c.stroke();
            // Dark doorway — right half
            const dg2=c.createRadialGradient(px,py+20,2,px,py+18,24);
            dg2.addColorStop(0,"#080000");dg2.addColorStop(0.5,"#0c0200");dg2.addColorStop(1,"#1a0804");
            c.fillStyle=dg2;c.fillRect(px,py+5,TL-14,TL-5);
            // Doorway lintel right half
            c.fillStyle="#3a2020";c.fillRect(px,py,TL-14,7);
            c.fillStyle="#4a2828";c.fillRect(px,py,TL-14,3);
            // Flame brazier on right pillar top
            const fp=Math.sin(t/150+1)*0.15+0.85;
            c.fillStyle="#4a3020";
            c.beginPath();c.moveTo(px+TL-11,py+5);c.lineTo(px+TL-3,py+5);c.lineTo(px+TL-4,py+9);c.lineTo(px+TL-10,py+9);c.fill();
            const fh=Math.sin(t/120+1)*2;
            c.fillStyle=`rgba(255,160,30,${fp})`;
            c.beginPath();c.moveTo(px+TL-7,py-2+fh);c.quadraticCurveTo(px+TL-10,py+2,px+TL-9,py+5);c.lineTo(px+TL-5,py+5);c.quadraticCurveTo(px+TL-4,py+2,px+TL-7,py-2+fh);c.fill();
            c.fillStyle=`rgba(255,220,80,${fp*0.7})`;
            c.beginPath();c.moveTo(px+TL-7,py+fh);c.quadraticCurveTo(px+TL-9,py+3,px+TL-8,py+5);c.lineTo(px+TL-6,py+5);c.quadraticCurveTo(px+TL-5,py+3,px+TL-7,py+fh);c.fill();
            // Fire glow
            const fg=c.createRadialGradient(px+TL-7,py+2,1,px+TL-7,py+4,12);
            fg.addColorStop(0,`rgba(255,120,20,${fp*0.3})`);fg.addColorStop(1,"rgba(0,0,0,0)");
            c.fillStyle=fg;c.fillRect(px+TL-16,py-4,16,16);
            // Red glow
            const gp=Math.sin(t/400)*.12+.2;
            const ig=c.createRadialGradient(px,py+22,2,px,py+20,24);
            ig.addColorStop(0,`rgba(255,50,10,${gp})`);ig.addColorStop(0.5,`rgba(200,20,0,${gp*0.4})`);ig.addColorStop(1,"rgba(0,0,0,0)");
            c.fillStyle=ig;c.fillRect(px,py+5,TL-14,TL-5);
          }
        }else{
          if(qx===0){
            // Bottom-left: dark stone stairs left half with lava veins
            const bg=c.createLinearGradient(px,py,px,py+TL);bg.addColorStop(0,"#1a0c0c");bg.addColorStop(1,"#2a1818");
            c.fillStyle=bg;c.fillRect(px,py,TL,TL);
            // Left pillar base
            c.fillStyle="#2a1a1a";c.fillRect(px,py,14,TL);
            c.fillStyle="#3a2828";c.fillRect(px,py+TL-5,16,5);
            // Dark basalt stairs left half
            c.fillStyle="#2a1818";c.fillRect(px+14,py,TL-14,8);
            c.fillStyle="#221414";c.fillRect(px+14,py+8,TL-14,8);
            c.fillStyle="#1a0c0c";c.fillRect(px+14,py+16,TL-14,8);
            c.fillStyle="#140808";c.fillRect(px+14,py+24,TL-14,8);
            // Step edge highlights
            c.fillStyle="rgba(255,255,255,0.06)";
            c.fillRect(px+14,py,TL-14,1);c.fillRect(px+14,py+8,TL-14,1);c.fillRect(px+14,py+16,TL-14,1);c.fillRect(px+14,py+24,TL-14,1);
            // Lava veins across stairs
            const lp=Math.sin(t/300)*.2+.6;
            c.strokeStyle=`rgba(255,60,10,${lp})`;c.lineWidth=1;
            c.beginPath();c.moveTo(px+16,py+4);c.lineTo(px+22,py+10);c.lineTo(px+18,py+18);c.lineTo(px+24,py+26);c.stroke();
            c.strokeStyle=`rgba(255,140,20,${lp*0.5})`;c.lineWidth=0.6;
            c.beginPath();c.moveTo(px+26,py+2);c.lineTo(px+28,py+8);c.lineTo(px+24,py+14);c.stroke();
            // Lava glow on pillar base
            const pg=Math.sin(t/300+1)*.1+.12;
            c.fillStyle=`rgba(255,60,10,${pg})`;c.fillRect(px+10,py+10,4,12);
          }else{
            // Bottom-right: dark stone stairs right half with lava veins
            const bg=c.createLinearGradient(px,py,px,py+TL);bg.addColorStop(0,"#1a0c0c");bg.addColorStop(1,"#2a1818");
            c.fillStyle=bg;c.fillRect(px,py,TL,TL);
            // Right pillar base
            c.fillStyle="#2a1a1a";c.fillRect(px+TL-14,py,14,TL);
            c.fillStyle="#3a2828";c.fillRect(px+TL-16,py+TL-5,16,5);
            // Dark basalt stairs right half
            c.fillStyle="#2a1818";c.fillRect(px,py,TL-14,8);
            c.fillStyle="#221414";c.fillRect(px,py+8,TL-14,8);
            c.fillStyle="#1a0c0c";c.fillRect(px,py+16,TL-14,8);
            c.fillStyle="#140808";c.fillRect(px,py+24,TL-14,8);
            // Step edge highlights
            c.fillStyle="rgba(255,255,255,0.06)";
            c.fillRect(px,py,TL-14,1);c.fillRect(px,py+8,TL-14,1);c.fillRect(px,py+16,TL-14,1);c.fillRect(px,py+24,TL-14,1);
            // Lava veins
            const lp=Math.sin(t/300)*.2+.6;
            c.strokeStyle=`rgba(255,60,10,${lp})`;c.lineWidth=1;
            c.beginPath();c.moveTo(px+TL-18,py+2);c.lineTo(px+TL-22,py+12);c.lineTo(px+TL-16,py+20);c.lineTo(px+TL-20,py+28);c.stroke();
            c.strokeStyle=`rgba(255,140,20,${lp*0.5})`;c.lineWidth=0.6;
            c.beginPath();c.moveTo(px+4,py+6);c.lineTo(px+8,py+14);c.lineTo(px+4,py+22);c.stroke();
            // Lava glow on pillar base
            const pg=Math.sin(t/300+2)*.1+.12;
            c.fillStyle=`rgba(255,60,10,${pg})`;c.fillRect(px+TL-14,py+10,4,12);
          }
        }
      }else{
        // Fallback: generic dark entrance (no ei or unknown dungeon)
        const eg=c.createRadialGradient(px+16,py+20,1,px+16,py+18,16);
        eg.addColorStop(0,"#040404");eg.addColorStop(0.5,"#020202");eg.addColorStop(1,"#000000");
        c.fillStyle=eg;c.fillRect(px,py,TL,TL);
        // Simple stone frame
        c.fillStyle="#4a4a4a";c.fillRect(px,py,5,TL);c.fillRect(px+TL-5,py,5,TL);c.fillRect(px,py,TL,5);
        c.fillStyle="rgba(0,0,0,0.2)";c.fillRect(px+5,py+5,TL-10,TL-5);
        // Subtle glow
        const gp=Math.sin(t/500)*.1+.15;
        const ig=c.createRadialGradient(px+16,py+16,0,px+16,py+16,12);
        ig.addColorStop(0,`rgba(200,200,200,${gp})`);ig.addColorStop(1,"rgba(0,0,0,0)");
        c.fillStyle=ig;c.fillRect(px+5,py+5,TL-10,TL-5);
      }
      break;}
    case T.FLOOR:{const fc2=iD?(dg.fc||dg.color):"#8b7355";c.fillStyle=fc2;c.fillRect(px,py,TL,TL);
      if(iD){const fg=c.createRadialGradient(px+16,py+16,2,px+16,py+16,20);fg.addColorStop(0,"rgba(255,255,255,0.03)");fg.addColorStop(1,"rgba(0,0,0,0.03)");c.fillStyle=fg;c.fillRect(px,py,TL,TL);
        c.strokeStyle="rgba(255,255,255,0.025)";c.strokeRect(px+1,py+1,TL-2,TL-2);}break;}
    case T.DOOR:case T.BOSS_DOOR:{const bo=tl===T.BOSS_DOOR;c.fillStyle=bo?"#4a1515":"#5a3820";c.fillRect(px,py,TL,TL);c.fillStyle=bo?"#3a0a0a":"#4a2810";c.fillRect(px+4,py+2,10,TL-4);c.fillRect(px+18,py+2,10,TL-4);c.fillStyle="#c8a020";c.fillRect(px+11,py+12,10,10);c.fillStyle="#333";c.fillRect(px+15,py+16,2,4);if(bo){c.fillStyle="#e83030";c.fillRect(px+10,py+2,12,8);}break;}
    case T.KEY:{c.fillStyle=iD?(dg.fc||dg.color):"#2d6a1e";c.fillRect(px,py,TL,TL);const kg=Math.sin(t/300)*.15+.2;c.fillStyle=`rgba(253,211,51,${kg})`;c.beginPath();c.arc(px+16,py+14,10,0,Math.PI*2);c.fill();c.fillStyle="#ffd633";c.beginPath();c.arc(px+14,py+9,4,0,Math.PI*2);c.fill();c.fillStyle="#e8b820";c.fillRect(px+11,py+11,4,14);c.fillRect(px+11,py+21,8,3);c.fillRect(px+11,py+16,6,3);break;}
    case T.MASTER_KEY:{c.fillStyle=iD?(dg.fc||dg.color):"#2d6a1e";c.fillRect(px,py,TL,TL);
      const mg=Math.sin(t/200)*.2+.3;c.fillStyle=`rgba(180,100,255,${mg})`;c.beginPath();c.arc(px+16,py+14,13,0,Math.PI*2);c.fill();
      c.fillStyle=`rgba(255,200,50,${mg*0.5})`;c.beginPath();c.arc(px+16,py+14,16,0,Math.PI*2);c.fill();
      c.fillStyle="#c070ff";c.beginPath();c.arc(px+15,py+7,5.5,0,Math.PI*2);c.fill();
      c.fillStyle="#a050dd";c.beginPath();c.arc(px+15,py+7,3,0,Math.PI*2);c.fill();
      c.fillStyle="#d090ff";c.fillRect(px+12,py+11,5,15);c.fillRect(px+12,py+22,9,3);c.fillRect(px+12,py+17,7,3);c.fillRect(px+12,py+13,7,3);
      c.fillStyle="#ffd633";c.beginPath();c.moveTo(px+16,py+1);c.lineTo(px+19,py+5);c.lineTo(px+13,py+5);c.fill();break;}
    case T.HEART_PIECE:{c.fillStyle=iD?(dg.fc||dg.color):"#2d6a1e";c.fillRect(px,py,TL,TL);
      const hpb=Math.sin(t/400)*1.5;
      // Glow
      const hpg=Math.sin(t/300)*.15+.2;c.fillStyle=`rgba(255,80,120,${hpg})`;c.beginPath();c.arc(px+16,py+16,11,0,Math.PI*2);c.fill();
      // Draw full heart then clip to bottom-left quarter
      c.save();c.beginPath();c.rect(px,py+14,16,18);c.clip();
      c.fillStyle="#ee3333";dH(c,px+6,py+6,20);
      c.fillStyle="#ff6666";dH(c,px+9,py+8,12);
      c.restore();
      // Dashed heart outline showing the missing 3/4
      c.save();c.strokeStyle="rgba(255,100,100,0.35)";c.fillStyle="rgba(0,0,0,0)";c.lineWidth=1;c.setLineDash([2,2]);
      const hx=px+6,hy=py+6,hs=20;c.beginPath();c.moveTo(hx+hs/2,hy+hs*.85);c.bezierCurveTo(hx,hy+hs*.5,hx,hy,hx+hs/2,hy+hs*.2);c.bezierCurveTo(hx+hs,hy,hx+hs,hy+hs*.5,hx+hs/2,hy+hs*.85);c.stroke();c.setLineDash([]);c.restore();
      // Sparkle
      c.fillStyle="#ffd633";c.beginPath();c.arc(px+10,py+8+hpb,1.5,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(px+22,py+10-hpb,1.5,0,Math.PI*2);c.fill();break;}
    case T.BOW:{c.fillStyle=iD?(dg.fc||dg.color):"#2d6a1e";c.fillRect(px,py,TL,TL);
      const bg2=Math.sin(t/300)*.15+.25;c.fillStyle=`rgba(253,211,51,${bg2})`;c.beginPath();c.arc(px+16,py+16,12,0,Math.PI*2);c.fill();
      // Bow body (arc)
      c.strokeStyle="#8B5A2B";c.lineWidth=2.5;c.beginPath();c.arc(px+14,py+16,10,-Math.PI*0.4,Math.PI*0.4);c.stroke();
      // Bowstring
      c.strokeStyle="#ddd";c.lineWidth=1;c.beginPath();
      c.moveTo(px+14+Math.cos(-Math.PI*0.4)*10,py+16+Math.sin(-Math.PI*0.4)*10);
      c.lineTo(px+14+Math.cos(Math.PI*0.4)*10,py+16+Math.sin(Math.PI*0.4)*10);c.stroke();
      // Arrow
      c.strokeStyle="#a06820";c.lineWidth=1.5;c.beginPath();c.moveTo(px+10,py+16);c.lineTo(px+26,py+16);c.stroke();
      c.fillStyle="#aaa";c.beginPath();c.moveTo(px+26,py+16);c.lineTo(px+23,py+14);c.lineTo(px+23,py+18);c.fill();
      // Fletching
      c.fillStyle="#fd3";c.beginPath();c.moveTo(px+10,py+16);c.lineTo(px+13,py+14);c.lineTo(px+13,py+18);c.fill();break;}
    case T.BOMB_BAG:{c.fillStyle=iD?(dg.fc||dg.color):"#2d6a1e";c.fillRect(px,py,TL,TL);
      const bbg=Math.sin(t/300)*.15+.25;c.fillStyle=`rgba(100,100,255,${bbg})`;c.beginPath();c.arc(px+16,py+16,12,0,Math.PI*2);c.fill();
      // Bag body
      c.fillStyle="#8B6B3A";c.beginPath();c.moveTo(px+10,py+10);c.lineTo(px+8,py+24);c.lineTo(px+24,py+24);c.lineTo(px+22,py+10);c.closePath();c.fill();
      // Bag tie
      c.fillStyle="#a07840";c.beginPath();c.moveTo(px+12,py+10);c.lineTo(px+11,py+7);c.lineTo(px+16,py+5);c.lineTo(px+21,py+7);c.lineTo(px+20,py+10);c.closePath();c.fill();
      c.strokeStyle="#6a4a2a";c.lineWidth=1;c.beginPath();c.moveTo(px+12,py+10);c.lineTo(px+20,py+10);c.stroke();
      // Bomb icon on bag
      c.fillStyle="#333";c.beginPath();c.arc(px+16,py+18,5,0,Math.PI*2);c.fill();
      c.fillStyle="#555";c.beginPath();c.arc(px+16,py+17,4,0,Math.PI*2);c.fill();
      // Fuse
      c.strokeStyle="#f80";c.lineWidth=1.5;c.beginPath();c.moveTo(px+16,py+13);c.lineTo(px+18,py+10);c.stroke();
      const spk2=Math.sin(t/100);c.fillStyle=spk2>0?"#f80":"#fd3";c.beginPath();c.arc(px+18,py+9,2,0,Math.PI*2);c.fill();break;}
    case T.MASTER_SWORD:{c.fillStyle=iD?(dg.fc||dg.color):"#2d6a1e";c.fillRect(px,py,TL,TL);
      const msg=Math.sin(t/250)*.2+.35;c.fillStyle=`rgba(130,180,255,${msg})`;c.beginPath();c.arc(px+16,py+14,13,0,Math.PI*2);c.fill();
      // Blade
      c.fillStyle="#c0d8ff";c.beginPath();c.moveTo(px+16,py+2);c.lineTo(px+13,py+18);c.lineTo(px+16,py+20);c.lineTo(px+19,py+18);c.closePath();c.fill();
      // Blade edge highlight
      c.fillStyle="#e0f0ff";c.beginPath();c.moveTo(px+16,py+3);c.lineTo(px+14.5,py+16);c.lineTo(px+16,py+18);c.closePath();c.fill();
      // Guard (crossguard)
      c.fillStyle="#fd3";c.fillRect(px+9,py+18,14,3);
      c.fillStyle="#c8a020";c.fillRect(px+9,py+20,14,1);
      // Grip
      c.fillStyle="#6a4a2a";c.fillRect(px+14,py+21,4,6);
      // Pommel
      c.fillStyle="#fd3";c.beginPath();c.arc(px+16,py+28,2.5,0,Math.PI*2);c.fill();
      // Sparkles
      const sp1=Math.sin(t/200)*2,sp2=Math.cos(t/170)*2;
      c.fillStyle="#fff";c.beginPath();c.arc(px+10+sp1,py+8,1.5,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(px+22-sp1,py+12,1.2,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(px+13,py+5+sp2,1,0,Math.PI*2);c.fill();break;}
    case T.HEART:{c.fillStyle=iD?(dg.fc||dg.color):"#2d6a1e";c.fillRect(px,py,TL,TL);const hg=Math.sin(t/400)*.15+.2;c.fillStyle=`rgba(255,50,50,${hg})`;c.beginPath();c.arc(px+16,py+16,12,0,Math.PI*2);c.fill();c.fillStyle="#ee3333";dH(c,px+6,py+6,20);c.fillStyle="#ff6666";dH(c,px+9,py+8,12);break;}
    case T.TRIFORCE:{c.fillStyle=iD?(dg.fc||dg.color):"#2d6a1e";c.fillRect(px,py,TL,TL);const tg=Math.sin(t/250)*.2+.3;c.fillStyle=`rgba(253,211,51,${tg})`;c.beginPath();c.arc(px+16,py+16,14,0,Math.PI*2);c.fill();c.fillStyle="#ffd633";c.beginPath();c.moveTo(px+16,py+4);c.lineTo(px+27,py+26);c.lineTo(px+5,py+26);c.fill();c.fillStyle="#ffe866";c.beginPath();c.moveTo(px+16,py+8);c.lineTo(px+23,py+22);c.lineTo(px+9,py+22);c.fill();break;}
    case T.STAIRS_UP:{c.fillStyle="#444";c.fillRect(px,py,TL,TL);for(let i=0;i<4;i++){c.fillStyle=`rgb(${80+i*20},${80+i*20},${80+i*20})`;c.fillRect(px+3,py+3+i*7,TL-6,5);}c.fillStyle="#6c6";c.font="bold 9px monospace";c.fillText("EXIT",px+5,py+20);break;}
    case T.SAND:{
      // Warm multi-band sand with dune appearance
      const sg=c.createRadialGradient(px+16+hs(px,py,0)*10-5,py+16+hs(px,py,1)*10-5,4,px+16,py+16,26);
      sg.addColorStop(0,"#ecd880");sg.addColorStop(0.3,"#e4cc70");sg.addColorStop(0.6,"#dcc468");sg.addColorStop(0.85,"#d0b858");sg.addColorStop(1,"#c8b050");
      c.fillStyle=sg;c.fillRect(px,py,TL,TL);
      // Color bands for dune look
      c.fillStyle="rgba(200,170,80,0.15)";c.fillRect(px,py+4+hs(px,py,40)*4,TL,3);
      c.fillStyle="rgba(180,150,60,0.12)";c.fillRect(px,py+14+hs(px,py,41)*4,TL,2);
      c.fillStyle="rgba(210,180,90,0.1)";c.fillRect(px,py+24+hs(px,py,42)*3,TL,2);
      // Wind ripple lines (curved) — more visible
      c.strokeStyle="rgba(160,130,60,0.3)";c.lineWidth=1.2;
      const wr=hs(px,py,80)*8;
      c.beginPath();c.moveTo(px,py+9+wr);c.quadraticCurveTo(px+16,py+7+wr,px+32,py+9+wr);c.stroke();
      c.strokeStyle="rgba(155,125,55,0.25)";c.lineWidth=1;
      c.beginPath();c.moveTo(px,py+20+wr*.5);c.quadraticCurveTo(px+16,py+18+wr*.5,px+32,py+20+wr*.5);c.stroke();
      c.beginPath();c.moveTo(px+4,py+28+wr*.3);c.quadraticCurveTo(px+18,py+26+wr*.3,px+30,py+28+wr*.3);c.stroke();
      // Scattered grain dots and tiny rocks
      c.fillStyle="rgba(180,150,70,0.35)";
      for(let i=0;i<4;i++){c.beginPath();c.arc(px+hs(px,py,i*5+1)*26+3,py+hs(px,py,i*5+2)*26+3,0.8+hs(px,py,i*5+3)*0.8,0,Math.PI*2);c.fill();}
      // Tiny rock dots
      c.fillStyle="rgba(120,100,60,0.3)";
      if(hs(px,py,100)>0.6){c.beginPath();c.arc(px+hs(px,py,101)*20+6,py+hs(px,py,102)*20+6,1.2,0,Math.PI*2);c.fill();}
      if(hs(px,py,103)>0.7){c.beginPath();c.arc(px+hs(px,py,104)*22+5,py+hs(px,py,105)*22+5,0.9,0,Math.PI*2);c.fill();}
      break;}
    case T.BRIDGE:{
      // Water underneath peeking through
      c.fillStyle="#1a4878";c.fillRect(px,py,TL,TL);
      // Water shimmer below
      const bw=Math.sin(t/600+px/20)*1.5;
      c.fillStyle="rgba(40,100,160,0.4)";c.fillRect(px,py+3,TL,2);c.fillRect(px,py+14,TL,1.5);c.fillRect(px,py+26,TL,1.5);
      // Main plank surface
      c.fillStyle="#7a5230";c.fillRect(px+1,py,TL-2,TL);
      // Individual plank lines
      const plankY=[0,5,10,15,20,25,30];
      for(let i=0;i<plankY.length-1;i++){
        const py2=py+plankY[i];const ph=plankY[i+1]-plankY[i];
        // Alternate plank shade
        const shade=i%2===0?"#6b4226":"#7a5030";
        c.fillStyle=shade;c.fillRect(px+2,py2,TL-4,ph-1);
        // Gap between planks
        c.fillStyle="rgba(15,40,70,0.6)";c.fillRect(px+2,py2+ph-1,TL-4,1);
        // Wood grain texture
        c.strokeStyle="rgba(90,55,25,0.3)";c.lineWidth=0.5;
        c.beginPath();c.moveTo(px+3,py2+ph*0.3);c.lineTo(px+TL-3,py2+ph*0.4);c.stroke();
        c.beginPath();c.moveTo(px+4,py2+ph*0.7);c.lineTo(px+TL-4,py2+ph*0.6);c.stroke();
      }
      // Nail marks at edges
      c.fillStyle="rgba(80,80,80,0.5)";
      for(let i=0;i<6;i++){
        c.beginPath();c.arc(px+3,py+2+i*5.5,0.8,0,Math.PI*2);c.fill();
        c.beginPath();c.arc(px+TL-3,py+2+i*5.5,0.8,0,Math.PI*2);c.fill();
      }
      // Side rails
      c.fillStyle="#5a3216";c.fillRect(px,py,2,TL);c.fillRect(px+TL-2,py,2,TL);
      // Rail highlight
      c.fillStyle="rgba(150,100,50,0.2)";c.fillRect(px,py,1,TL);c.fillRect(px+TL-1,py,1,TL);
      break;}
    case T.FLOWER:{
      // Grass base
      const fg=c.createRadialGradient(px+16+hs(px,py,0)*10-5,py+16+hs(px,py,1)*10-5,3,px+16,py+16,24);
      fg.addColorStop(0,"#48a83a");fg.addColorStop(1,"#38982e");c.fillStyle=fg;c.fillRect(px,py,TL,TL);
      // Grass texture
      c.fillStyle="rgba(30,100,20,0.15)";
      c.beginPath();c.arc(px+hs(px,py,50)*20+6,py+hs(px,py,51)*20+6,4,0,Math.PI*2);c.fill();
      // 2-3 flowers at different positions
      const numFlowers=2+((hs(px,py,60)>0.5)?1:0);
      const fColors=["#e84444","#e8d844","#d844e8","#44c8e8","#ff8844","#ff66aa","#88ddff"];
      for(let f=0;f<numFlowers;f++){
        const fx=px+6+hs(px,py,61+f*10)*18;
        const fy=py+8+hs(px,py,62+f*10)*14;
        const fci=((Math.floor(px/TL)*7+Math.floor(py/TL)*13+f*3)%fColors.length);
        const fc=fColors[fci];
        const sw=Math.sin(t/900+fx/40+f*1.3)*1.8+Math.sin(t/1200+fy/50)*0.6;
        const fSize=2+hs(px,py,63+f*10)*1.5;
        // Stem
        c.strokeStyle="#2a6a18";c.lineWidth=1;c.lineCap="round";
        c.beginPath();c.moveTo(fx+sw*0.3,fy+fSize+1);c.lineTo(fx,fy+fSize+8+hs(px,py,64+f*10)*4);c.stroke();
        // Small leaf on stem
        if(hs(px,py,65+f*10)>0.4){
          c.fillStyle="#3a8a28";
          const lx=fx+(hs(px,py,66+f*10)>0.5?2:-2);
          const ly=fy+fSize+4;
          c.beginPath();c.ellipse(lx,ly,2.5,1.2,hs(px,py,66+f*10)>0.5?0.4:-0.4,0,Math.PI*2);c.fill();
        }
        // Petals — vary shape based on hash
        const pStyle=hs(px,py,67+f*10);
        c.fillStyle=fc;
        if(pStyle<0.33){
          // Dot cluster petals
          for(let p=0;p<5;p++){
            const a=p*Math.PI*2/5;
            c.beginPath();c.arc(fx+Math.cos(a)*fSize*0.7+sw,fy+Math.sin(a)*fSize*0.7,fSize*0.45,0,Math.PI*2);c.fill();
          }
        }else if(pStyle<0.66){
          // Cross/plus shape
          c.fillRect(fx-fSize*0.3+sw,fy-fSize,fSize*0.6,fSize*2);
          c.fillRect(fx-fSize+sw,fy-fSize*0.3,fSize*2,fSize*0.6);
        }else{
          // Small circle petals
          c.beginPath();c.arc(fx+sw,fy,fSize,0,Math.PI*2);c.fill();
          c.fillStyle=fc;c.globalAlpha=0.6;
          c.beginPath();c.arc(fx+sw-fSize*0.6,fy-fSize*0.4,fSize*0.5,0,Math.PI*2);c.fill();
          c.beginPath();c.arc(fx+sw+fSize*0.6,fy-fSize*0.4,fSize*0.5,0,Math.PI*2);c.fill();
          c.globalAlpha=1;
        }
        // Center dot
        c.fillStyle=hs(px,py,68+f*10)>0.5?"#ffe844":"#fff";
        c.beginPath();c.arc(fx+sw,fy,fSize*0.3,0,Math.PI*2);c.fill();
      }
      c.lineCap="butt";
      break;}
    case T.PATH:{
      // Warm brown dirt path
      const pg=c.createRadialGradient(px+16+hs(px,py,5)*10-5,py+16+hs(px,py,6)*10-5,4,px+16,py+16,24);
      pg.addColorStop(0,"#d8c498");pg.addColorStop(0.4,"#c8b480");pg.addColorStop(0.7,"#bca870");pg.addColorStop(1,"#b09860");
      c.fillStyle=pg;c.fillRect(px,py,TL,TL);
      // Warmer tone overlay
      c.fillStyle="rgba(180,140,80,0.08)";c.fillRect(px,py,TL,TL);
      // Dirt patches
      c.fillStyle="rgba(130,110,70,0.35)";
      c.beginPath();c.arc(px+hs(px,py,1)*20+6,py+hs(px,py,2)*20+6,4+hs(px,py,3)*3,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(190,170,120,0.25)";
      c.beginPath();c.arc(px+hs(px,py,10)*18+7,py+hs(px,py,11)*18+7,3+hs(px,py,12)*3,0,Math.PI*2);c.fill();
      // Footprint impressions (subtle dark ovals)
      if(hs(px,py,55)>0.5){
        c.fillStyle="rgba(100,80,50,0.15)";
        const fpx=px+hs(px,py,56)*16+8,fpy=py+hs(px,py,57)*16+8;
        c.beginPath();c.ellipse(fpx,fpy,2.5,4,hs(px,py,58)*0.5-0.25,0,Math.PI*2);c.fill();
        if(hs(px,py,59)>0.4){
          c.beginPath();c.ellipse(fpx+6,fpy+3,2,3.5,hs(px,py,60)*0.4,0,Math.PI*2);c.fill();
        }
      }
      // Pebbles scattered
      if(hs(px,py,60)>.5){c.fillStyle="rgba(140,135,125,0.55)";
        for(let i=0;i<3;i++){c.beginPath();c.arc(px+hs(px,py,61+i*5)*24+4,py+hs(px,py,62+i*5)*24+4,1.2+hs(px,py,63+i*5)*1.2,0,Math.PI*2);c.fill();}}
      // Small stones
      if(hs(px,py,80)>0.6){
        c.fillStyle="rgba(120,115,105,0.4)";
        c.beginPath();c.ellipse(px+hs(px,py,81)*20+6,py+hs(px,py,82)*20+6,2,1.5,hs(px,py,83),0,Math.PI*2);c.fill();
      }
      // Grass peek-through at edges
      c.fillStyle="rgba(60,140,40,0.12)";
      c.fillRect(px,py,TL,2);c.fillRect(px,py+TL-2,TL,2);c.fillRect(px,py,2,TL);c.fillRect(px+TL-2,py,2,TL);
      break;}
    case T.ROCK:{
      // Grass base underneath
      const rbg=iD?(dg.fc||dg.color):"#3a9830";
      c.fillStyle=rbg;c.fillRect(px,py,TL,TL);
      if(!iD){
        // Grass texture on base
        c.fillStyle="rgba(50,120,30,0.2)";
        c.beginPath();c.arc(px+8,py+8,4,0,Math.PI*2);c.fill();
        c.beginPath();c.arc(px+24,py+24,3,0,Math.PI*2);c.fill();
      }
      // Ground shadow beneath rock
      c.fillStyle="rgba(0,0,0,0.18)";
      c.beginPath();c.ellipse(px+18,py+24,12,4,0.1,0,Math.PI*2);c.fill();
      // Main rock body — bigger, rounder, 3D
      const rg=c.createRadialGradient(px+13,py+11,3,px+16,py+16,15);
      rg.addColorStop(0,"#aaa8a0");rg.addColorStop(0.3,"#908880");rg.addColorStop(0.6,"#787068");rg.addColorStop(1,"#585048");
      c.fillStyle=rg;c.beginPath();c.ellipse(px+16,py+15,14,11,0,0,Math.PI*2);c.fill();
      // Bright highlight top-left (clear light source)
      c.fillStyle="rgba(255,255,255,0.2)";
      c.beginPath();c.ellipse(px+11,py+10,6,4,-.4,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(255,255,255,0.12)";
      c.beginPath();c.ellipse(px+9,py+8,3,2,-.3,0,Math.PI*2);c.fill();
      // Mid highlight
      c.fillStyle="rgba(200,195,185,0.15)";
      c.beginPath();c.ellipse(px+14,py+13,4,3,0,0,Math.PI*2);c.fill();
      // Dark shadow bottom-right
      c.fillStyle="rgba(0,0,0,0.25)";
      c.beginPath();c.ellipse(px+20,py+20,8,5,0.2,0,Math.PI*2);c.fill();
      // Subtle crack/texture lines
      c.strokeStyle="rgba(0,0,0,0.1)";c.lineWidth=0.5;
      c.beginPath();c.moveTo(px+10,py+14);c.lineTo(px+18,py+16);c.stroke();
      c.beginPath();c.moveTo(px+14,py+10);c.lineTo(px+16,py+18);c.stroke();
      break;}
    case T.BUSH:{
      // Grass base
      c.fillStyle="#2d6a1e";c.fillRect(px,py,TL,TL);
      c.fillStyle="rgba(50,120,30,0.15)";c.beginPath();c.arc(px+10,py+10,5,0,Math.PI*2);c.fill();
      // Shadow on ground
      c.fillStyle="rgba(0,0,0,0.15)";c.beginPath();c.ellipse(px+16,py+28,13,3.5,0,0,Math.PI*2);c.fill();
      // Layered bush body for depth — dark base
      c.fillStyle="#165a08";c.beginPath();c.arc(px+16,py+19,12,0,Math.PI*2);c.fill();
      // Mid layer
      c.fillStyle="#1e7010";c.beginPath();c.arc(px+16,py+17,10,0,Math.PI*2);c.fill();
      // Bright top layer
      c.fillStyle="#268a18";c.beginPath();c.arc(px+16,py+15,9,0,Math.PI*2);c.fill();
      // Highlight on top
      c.fillStyle="#32a024";c.beginPath();c.arc(px+14,py+13,5.5,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(60,180,40,0.3)";c.beginPath();c.arc(px+12,py+11,3.5,0,Math.PI*2);c.fill();
      // Shadow on bottom
      c.fillStyle="rgba(10,40,5,0.3)";c.beginPath();c.ellipse(px+16,py+22,9,4,0,0,Math.PI*2);c.fill();
      // Leaf texture highlights
      c.fillStyle="#3aaa2a";c.fillRect(px+10,py+12,3,2);c.fillRect(px+18,py+14,3,2);c.fillRect(px+14,py+10,2,2);
      // Optional berry spots
      if(hs(px,py,50)>0.45){
        c.fillStyle="#cc3333";
        c.beginPath();c.arc(px+10,py+19,1.5,0,Math.PI*2);c.fill();
        c.beginPath();c.arc(px+21,py+17,1.5,0,Math.PI*2);c.fill();
        c.fillStyle="#dd4444";
        c.beginPath();c.arc(px+10,py+18.5,0.8,0,Math.PI*2);c.fill();
        c.beginPath();c.arc(px+21,py+16.5,0.8,0,Math.PI*2);c.fill();
        if(hs(px,py,51)>0.5){
          c.fillStyle="#cc3333";c.beginPath();c.arc(px+15,py+21,1.3,0,Math.PI*2);c.fill();
        }
      }
      break;}
    case T.TALLGRASS:{c.fillStyle="#2d6a1e";c.fillRect(px,py,TL,TL);
      const windTG=Math.sin(t/1000+px/50)*1.5+Math.sin(t/700+py/40)*0.8;
      // Multiple layers of swaying grass blades
      c.lineCap="round";
      c.strokeStyle="#2a7020";c.lineWidth=2;
      for(let i=0;i<6;i++){const gx=px+3+i*5+hs(px,py,i*3)*3;const gh=14+hs(px,py,i*3+1)*10;
        const sw3=windTG+Math.sin(t/500+gx/15+i*1.2)*2;
        c.beginPath();c.moveTo(gx,py+TL);c.quadraticCurveTo(gx+sw3*0.6,py+TL-gh*0.5,gx+sw3,py+TL-gh);c.stroke();}
      c.strokeStyle="#3a9030";c.lineWidth=1.5;
      for(let i=0;i<4;i++){const gx=px+5+i*7+hs(px,py,i*5+20)*4;const gh=10+hs(px,py,i*5+21)*8;
        const sw3=windTG*0.8+Math.sin(t/450+gx/12+i*1.8)*1.5;
        c.beginPath();c.moveTo(gx,py+TL);c.quadraticCurveTo(gx+sw3*0.5,py+TL-gh*0.4,gx+sw3*0.7,py+TL-gh);c.stroke();}
      c.strokeStyle="#4aa040";c.lineWidth=1;
      for(let i=0;i<3;i++){const gx=px+7+i*9+hs(px,py,i*7+40)*5;const gh=7+hs(px,py,i*7+41)*6;
        const sw3=windTG*0.5+Math.sin(t/600+gx/18+i*2.5)*1;
        c.beginPath();c.moveTo(gx,py+TL);c.quadraticCurveTo(gx+sw3*0.4,py+TL-gh*0.5,gx+sw3*0.6,py+TL-gh);c.stroke();}
      c.lineCap="butt";break;}
    case T.STUMP:{c.fillStyle="#2d6a1e";c.fillRect(px,py,TL,TL);
      // Grass underneath
      c.fillStyle="#348a24";c.fillRect(px+6,py+24,2,4);c.fillRect(px+22,py+22,2,4);
      const sv=hs(px,py,99)>0.5; // stump or mushroom
      if(sv){// Tree stump with rings
        c.fillStyle="#5a3818";c.fillRect(px+7,py+12,18,18);
        c.fillStyle="#6a4828";c.fillRect(px+8,py+10,16,4);
        c.fillStyle="#4a2808";c.beginPath();c.arc(px+16,py+14,8,0,Math.PI*2);c.fill();
        c.fillStyle="#5a3818";c.beginPath();c.arc(px+16,py+14,5,0,Math.PI*2);c.fill();
        c.fillStyle="#6a4020";c.beginPath();c.arc(px+16,py+14,2,0,Math.PI*2);c.fill();
      }else{// Mushroom cluster
        c.fillStyle="#c8b8a8";c.fillRect(px+9,py+18,3,10);c.fillRect(px+19,py+20,3,8);
        c.fillStyle="#cc4444";c.beginPath();c.arc(px+10,py+16,6,Math.PI,0);c.fill();
        c.fillStyle="#aa3333";c.beginPath();c.arc(px+20,py+18,5,Math.PI,0);c.fill();
        c.fillStyle="#fff";c.fillRect(px+8,py+13,2,2);c.fillRect(px+12,py+12,2,2);c.fillRect(px+19,py+15,2,2);
      }break;}
    case T.TORCH:{c.fillStyle=iD?(dg.fc||dg.color):"#8b7355";c.fillRect(px,py,TL,TL);c.fillStyle="#5a3818";c.fillRect(px+13,py+12,6,18);
      const flicker=Math.sin(t/100)*2;const fg2=Math.sin(t/80)*0.15+0.35;
      c.fillStyle=`rgba(255,150,30,${fg2})`;c.beginPath();c.arc(px+16,py+10,10,0,Math.PI*2);c.fill();
      c.fillStyle="#ff8820";c.fillRect(px+12+flicker,py+4,8,10);c.fillStyle="#ffcc44";c.fillRect(px+13+flicker,py+6,6,6);c.fillStyle="#ffe888";c.fillRect(px+14+flicker*.5,py+7,4,4);break;}
    case T.CRACK:{// Cracked wall — looks like wall but with visible cracks
      c.fillStyle=iD?dg.wc:"#4a3728";c.fillRect(px,py,TL,TL);
      c.fillStyle="rgba(0,0,0,0.15)";c.fillRect(px,py+8,TL,1);c.fillRect(px,py+16,TL,1);c.fillRect(px,py+24,TL,1);
      c.fillStyle="rgba(255,255,255,0.08)";c.fillRect(px,py,TL,2);c.fillStyle="rgba(0,0,0,0.25)";c.fillRect(px,py+TL-3,TL,3);
      // Visible cracks
      c.strokeStyle="rgba(0,0,0,0.5)";c.lineWidth=1;
      c.beginPath();c.moveTo(px+8,py+4);c.lineTo(px+14,py+12);c.lineTo(px+10,py+20);c.lineTo(px+16,py+28);c.stroke();
      c.beginPath();c.moveTo(px+22,py+2);c.lineTo(px+18,py+10);c.lineTo(px+24,py+18);c.stroke();
      c.beginPath();c.moveTo(px+12,py+14);c.lineTo(px+20,py+16);c.stroke();
      // Subtle highlight on cracks
      c.strokeStyle="rgba(255,200,100,0.15)";c.lineWidth=1;
      c.beginPath();c.moveTo(px+9,py+4);c.lineTo(px+15,py+12);c.stroke();
      break;}
    case T.BOMB:{// Bomb pickup on floor
      c.fillStyle=iD?(dg.fc||dg.color):"#2d6a1e";c.fillRect(px,py,TL,TL);
      if(iD){c.strokeStyle="rgba(255,255,255,0.03)";c.strokeRect(px+1,py+1,TL-2,TL-2);}
      // Bomb glow
      const bg2=Math.sin(t/350)*.12+.18;c.fillStyle=`rgba(100,100,255,${bg2})`;c.beginPath();c.arc(px+16,py+16,10,0,Math.PI*2);c.fill();
      // Bomb body
      c.fillStyle="#333";c.beginPath();c.arc(px+16,py+18,7,0,Math.PI*2);c.fill();
      c.fillStyle="#444";c.beginPath();c.arc(px+16,py+17,5,0,Math.PI*2);c.fill();
      // Fuse
      c.strokeStyle="#a88";c.lineWidth=2;c.beginPath();c.moveTo(px+16,py+11);c.quadraticCurveTo(px+20,py+6,px+22,py+8);c.stroke();
      // Spark
      const sp=Math.sin(t/120);
      if(sp>0){c.fillStyle="#ff8";c.fillRect(px+21,py+6,3,3);}
      break;}
    case T.PUSH:{// Pushable block
      const pbg=c.createLinearGradient(px,py,px+TL,py+TL);pbg.addColorStop(0,"#7a7a88");pbg.addColorStop(1,"#5a5a68");
      c.fillStyle=pbg;c.fillRect(px+2,py+2,TL-4,TL-4);
      c.fillStyle="rgba(255,255,255,0.15)";c.fillRect(px+2,py+2,TL-4,3);c.fillRect(px+2,py+2,3,TL-4);
      c.fillStyle="rgba(0,0,0,0.2)";c.fillRect(px+2,py+TL-5,TL-4,3);c.fillRect(px+TL-5,py+2,3,TL-4);
      // Arrow marks showing it can be pushed
      c.fillStyle="rgba(255,255,150,0.3)";c.font="10px monospace";c.textAlign="center";c.fillText("\u2B26",px+16,py+19);c.textAlign="left";
      break;}
    case T.LEVER:{// Lever switch on floor
      c.fillStyle=iD?(dg.fc||dg.color):"#38982e";c.fillRect(px,py,TL,TL);
      if(iD){c.strokeStyle="rgba(255,255,255,0.03)";c.strokeRect(px+1,py+1,TL-2,TL-2);}
      // Base plate
      c.fillStyle="#555";c.beginPath();c.ellipse(px+16,py+22,10,5,0,0,Math.PI*2);c.fill();
      // Lever arm
      c.strokeStyle="#888";c.lineWidth=3;c.lineCap="round";
      c.beginPath();c.moveTo(px+16,py+20);c.lineTo(px+16,py+6);c.stroke();
      // Handle
      c.fillStyle="#c44";c.beginPath();c.arc(px+16,py+5,4,0,Math.PI*2);c.fill();
      c.fillStyle="#e66";c.beginPath();c.arc(px+15,py+4,2,0,Math.PI*2);c.fill();
      c.lineCap="butt";break;}
    case T.PLATE:{// Pressure plate on floor
      c.fillStyle=iD?(dg.fc||dg.color):"#38982e";c.fillRect(px,py,TL,TL);
      if(iD){c.strokeStyle="rgba(255,255,255,0.03)";c.strokeRect(px+1,py+1,TL-2,TL-2);}
      c.fillStyle="#666";c.fillRect(px+6,py+6,TL-12,TL-12);
      c.fillStyle="#777";c.fillRect(px+8,py+8,TL-16,TL-16);
      const pp=Math.sin(t/500)*0.2+0.3;c.fillStyle=`rgba(255,200,50,${pp})`;c.fillRect(px+10,py+10,TL-20,TL-20);
      break;}
    case T.PIT:{// Bottomless pit
      c.fillStyle="#040408";c.fillRect(px,py,TL,TL);
      // Dark gradient edges to show depth
      const pg2=c.createRadialGradient(px+16,py+16,2,px+16,py+16,18);
      pg2.addColorStop(0,"#000004");pg2.addColorStop(0.7,"#080810");pg2.addColorStop(1,iD?(dg.fc||"#1a1a2a"):"#2a3a28");
      c.fillStyle=pg2;c.fillRect(px,py,TL,TL);
      // Inner shadow ring
      c.strokeStyle="rgba(0,0,0,0.5)";c.lineWidth=2;c.strokeRect(px+3,py+3,TL-6,TL-6);
      break;}
    case T.SPIKE:{// Spike trap — toggles on/off
      c.fillStyle=iD?(dg.fc||dg.color):"#38982e";c.fillRect(px,py,TL,TL);
      if(iD){c.strokeStyle="rgba(255,255,255,0.03)";c.strokeRect(px+1,py+1,TL-2,TL-2);}
      const spUp=Math.sin(t/750)>0;
      if(spUp){// Spikes extended
        c.fillStyle="#888";
        for(let sx2=0;sx2<3;sx2++)for(let sy2=0;sy2<3;sy2++){const spx=px+5+sx2*10,spy=py+5+sy2*10;
          c.beginPath();c.moveTo(spx,spy+6);c.lineTo(spx+3,spy);c.lineTo(spx+6,spy+6);c.fill();}
        c.fillStyle="rgba(200,200,200,0.3)";
        for(let sx2=0;sx2<3;sx2++)for(let sy2=0;sy2<3;sy2++){const spx=px+5+sx2*10,spy=py+5+sy2*10;
          c.beginPath();c.moveTo(spx+1,spy+4);c.lineTo(spx+3,spy);c.lineTo(spx+3,spy+4);c.fill();}
      }else{// Spikes retracted — just holes
        c.fillStyle="rgba(0,0,0,0.3)";
        for(let sx2=0;sx2<3;sx2++)for(let sy2=0;sy2<3;sy2++){c.beginPath();c.arc(px+8+sx2*10,py+8+sy2*10,2,0,Math.PI*2);c.fill();}}
      break;}
    case T.ICE:{
      // Base
      c.fillStyle=iD?(dg.fc||dg.color):"#38982e";c.fillRect(px,py,TL,TL);
      // Crystalline ice surface
      const ig2=c.createRadialGradient(px+14,py+14,2,px+16,py+16,22);
      ig2.addColorStop(0,"#d0f0ff");ig2.addColorStop(0.3,"#b0e0f8");ig2.addColorStop(0.6,"#90c8e8");ig2.addColorStop(1,"#68a8d0");
      c.fillStyle=ig2;c.fillRect(px+1,py+1,TL-2,TL-2);
      // Prismatic color highlights
      c.fillStyle="rgba(255,220,255,0.15)";c.beginPath();c.ellipse(px+8,py+8,4,3,-0.3,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(220,255,220,0.1)";c.beginPath();c.ellipse(px+22,py+12,3,2,0.2,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(220,220,255,0.12)";c.beginPath();c.ellipse(px+14,py+22,4,2.5,0.1,0,Math.PI*2);c.fill();
      // Main shine highlight
      c.fillStyle="rgba(255,255,255,0.35)";c.beginPath();c.ellipse(px+10,py+9,6,4,-0.3,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(255,255,255,0.15)";c.beginPath();c.ellipse(px+8,py+7,3,2,-0.3,0,Math.PI*2);c.fill();
      // Crack patterns — more detailed
      c.strokeStyle="rgba(255,255,255,0.25)";c.lineWidth=0.7;
      c.beginPath();c.moveTo(px+6,py+4);c.lineTo(px+14,py+16);c.lineTo(px+26,py+20);c.stroke();
      c.beginPath();c.moveTo(px+20,py+6);c.lineTo(px+16,py+14);c.stroke();
      c.beginPath();c.moveTo(px+14,py+16);c.lineTo(px+10,py+26);c.stroke();
      c.beginPath();c.moveTo(px+14,py+16);c.lineTo(px+22,py+28);c.stroke();
      // Reflection sparkles
      const iceSpk=Math.sin(t/200+px*0.2+py*0.3);
      if(iceSpk>0.3){
        c.fillStyle=`rgba(255,255,255,${(iceSpk-0.3)*0.8})`;
        c.beginPath();c.arc(px+20,py+8,1.5,0,Math.PI*2);c.fill();
      }
      const iceSpk2=Math.sin(t/250+px*0.15+py*0.25);
      if(iceSpk2>0.4){
        c.fillStyle=`rgba(255,255,255,${(iceSpk2-0.4)*0.7})`;
        c.beginPath();c.arc(px+8,py+24,1,0,Math.PI*2);c.fill();
      }
      const iceSpk3=Math.sin(t/180+px*0.25+py*0.15);
      if(iceSpk3>0.5){
        c.fillStyle=`rgba(255,255,255,${(iceSpk3-0.5)*0.9})`;
        c.beginPath();c.arc(px+26,py+22,1.2,0,Math.PI*2);c.fill();
      }
      break;}
    case T.TSWITCH:{// Timed switch — glowing pressure plate
      c.fillStyle=iD?(dg.fc||dg.color):"#38982e";c.fillRect(px,py,TL,TL);
      if(iD){c.strokeStyle="rgba(255,255,255,0.03)";c.strokeRect(px+1,py+1,TL-2,TL-2);}
      c.fillStyle="#555";c.fillRect(px+4,py+4,TL-8,TL-8);
      c.fillStyle="#666";c.fillRect(px+6,py+6,TL-12,TL-12);
      const tp=Math.sin(t/300)*0.3+0.5;
      c.fillStyle=`rgba(255,100,50,${tp})`;c.fillRect(px+8,py+8,TL-16,TL-16);
      // Hourglass icon
      c.fillStyle=`rgba(255,200,100,${tp*0.8})`;c.font="10px monospace";c.textAlign="center";c.fillText("\u23F1",px+16,py+20);c.textAlign="left";
      break;}
    case T.RUPEE:{// Rupee pickup on floor — Zelda hexagonal shape
      c.fillStyle=iD?(dg.fc||dg.color):"#2d6a1e";c.fillRect(px,py,TL,TL);
      const rg2=Math.sin(t/300)*.15+.2;c.fillStyle=`rgba(50,255,50,${rg2})`;c.beginPath();c.arc(px+16,py+16,10,0,Math.PI*2);c.fill();
      const rx2=px+16,ry2=py+16;
      c.fillStyle="#4f4";c.beginPath();c.moveTo(rx2,ry2-8);c.lineTo(rx2+5,ry2-3);c.lineTo(rx2+5,ry2+3);c.lineTo(rx2,ry2+8);c.lineTo(rx2-5,ry2+3);c.lineTo(rx2-5,ry2-3);c.closePath();c.fill();
      c.fillStyle="#8f8";c.beginPath();c.moveTo(rx2,ry2-6);c.lineTo(rx2+4,ry2-2);c.lineTo(rx2,ry2);c.lineTo(rx2-4,ry2-2);c.closePath();c.fill();
      break;}
    case T.LEDGE_S:case T.LEDGE_N:case T.LEDGE_E:case T.LEDGE_W:{
      // Base floor (upper level)
      const lfc2=iD?(dg.fc||dg.color):"#2d6a1e";
      c.fillStyle=lfc2;c.fillRect(px,py,TL,TL);
      // Natural stone cliff face — no arrows, just realistic rock wall
      const cw=11;
      const h1=hs(px,py,90),h2=hs(px,py,91),h3=hs(px,py,92);
      if(tl===T.LEDGE_S){
        // Dark cliff face at top edge — looks like a wall viewed from above
        const cg=c.createLinearGradient(px,py,px,py+cw);
        cg.addColorStop(0,"#0e0e0e");cg.addColorStop(0.15,"#1a1815");cg.addColorStop(0.4,"#2a2620");cg.addColorStop(0.7,"#3a3530");cg.addColorStop(1,lfc2);
        c.fillStyle=cg;c.fillRect(px,py,TL,cw);
        // Stone block mortar lines
        c.strokeStyle="rgba(0,0,0,0.35)";c.lineWidth=0.6;
        c.beginPath();c.moveTo(px,py+4);c.lineTo(px+TL,py+4);c.stroke();
        c.beginPath();c.moveTo(px+8+h1*4,py);c.lineTo(px+8+h1*4,py+4);c.stroke();
        c.beginPath();c.moveTo(px+24-h2*4,py);c.lineTo(px+24-h2*4,py+4);c.stroke();
        c.beginPath();c.moveTo(px+16+h3*3,py+4);c.lineTo(px+16+h3*3,py+cw-1);c.stroke();
        c.beginPath();c.moveTo(px+5,py+4);c.lineTo(px+5,py+cw-2);c.stroke();
        c.beginPath();c.moveTo(px+27,py+4);c.lineTo(px+27,py+cw-2);c.stroke();
        // Lit top edge highlight
        c.fillStyle="rgba(255,255,220,0.06)";c.fillRect(px,py,TL,1);
        // Soft drop shadow below cliff
        const sh=c.createLinearGradient(px,py+cw,px,py+cw+6);
        sh.addColorStop(0,"rgba(0,0,0,0.15)");sh.addColorStop(1,"rgba(0,0,0,0)");
        c.fillStyle=sh;c.fillRect(px,py+cw,TL,6);
        // Tiny moss/lichen patches on rock face
        if(h1>0.4){c.fillStyle="rgba(50,80,40,0.2)";c.beginPath();c.arc(px+6+h2*8,py+2+h3*3,1.5+h1,0,Math.PI*2);c.fill();}
        if(h3>0.5){c.fillStyle="rgba(40,70,35,0.15)";c.beginPath();c.arc(px+20+h1*6,py+5+h2*2,1+h3,0,Math.PI*2);c.fill();}
      }else if(tl===T.LEDGE_N){
        const cg=c.createLinearGradient(px,py+TL,px,py+TL-cw);
        cg.addColorStop(0,"#0e0e0e");cg.addColorStop(0.15,"#1a1815");cg.addColorStop(0.4,"#2a2620");cg.addColorStop(0.7,"#3a3530");cg.addColorStop(1,lfc2);
        c.fillStyle=cg;c.fillRect(px,py+TL-cw,TL,cw);
        c.strokeStyle="rgba(0,0,0,0.35)";c.lineWidth=0.6;
        c.beginPath();c.moveTo(px,py+TL-4);c.lineTo(px+TL,py+TL-4);c.stroke();
        c.beginPath();c.moveTo(px+8+h1*4,py+TL-4);c.lineTo(px+8+h1*4,py+TL);c.stroke();
        c.beginPath();c.moveTo(px+24-h2*4,py+TL-4);c.lineTo(px+24-h2*4,py+TL);c.stroke();
        c.beginPath();c.moveTo(px+16+h3*3,py+TL-cw+1);c.lineTo(px+16+h3*3,py+TL-4);c.stroke();
        c.fillStyle="rgba(255,255,220,0.06)";c.fillRect(px,py+TL-1,TL,1);
        const sh=c.createLinearGradient(px,py+TL-cw-6,px,py+TL-cw);
        sh.addColorStop(0,"rgba(0,0,0,0)");sh.addColorStop(1,"rgba(0,0,0,0.15)");
        c.fillStyle=sh;c.fillRect(px,py+TL-cw-6,TL,6);
        if(h1>0.4){c.fillStyle="rgba(50,80,40,0.2)";c.beginPath();c.arc(px+6+h2*8,py+TL-3-h3*3,1.5+h1,0,Math.PI*2);c.fill();}
      }else if(tl===T.LEDGE_E){
        const cg=c.createLinearGradient(px,py,px+cw,py);
        cg.addColorStop(0,"#0e0e0e");cg.addColorStop(0.15,"#1a1815");cg.addColorStop(0.4,"#2a2620");cg.addColorStop(0.7,"#3a3530");cg.addColorStop(1,lfc2);
        c.fillStyle=cg;c.fillRect(px,py,cw,TL);
        c.strokeStyle="rgba(0,0,0,0.35)";c.lineWidth=0.6;
        c.beginPath();c.moveTo(px+4,py);c.lineTo(px+4,py+TL);c.stroke();
        c.beginPath();c.moveTo(px,py+8+h1*4);c.lineTo(px+4,py+8+h1*4);c.stroke();
        c.beginPath();c.moveTo(px,py+24-h2*4);c.lineTo(px+4,py+24-h2*4);c.stroke();
        c.beginPath();c.moveTo(px+4,py+16+h3*3);c.lineTo(px+cw-1,py+16+h3*3);c.stroke();
        c.fillStyle="rgba(255,255,220,0.06)";c.fillRect(px,py,1,TL);
        const sh=c.createLinearGradient(px+cw,py,px+cw+6,py);
        sh.addColorStop(0,"rgba(0,0,0,0.15)");sh.addColorStop(1,"rgba(0,0,0,0)");
        c.fillStyle=sh;c.fillRect(px+cw,py,6,TL);
        if(h2>0.5){c.fillStyle="rgba(50,80,40,0.2)";c.beginPath();c.arc(px+2+h1*3,py+10+h3*8,1.5+h2,0,Math.PI*2);c.fill();}
      }else{// LEDGE_W
        const cg=c.createLinearGradient(px+TL,py,px+TL-cw,py);
        cg.addColorStop(0,"#0e0e0e");cg.addColorStop(0.15,"#1a1815");cg.addColorStop(0.4,"#2a2620");cg.addColorStop(0.7,"#3a3530");cg.addColorStop(1,lfc2);
        c.fillStyle=cg;c.fillRect(px+TL-cw,py,cw,TL);
        c.strokeStyle="rgba(0,0,0,0.35)";c.lineWidth=0.6;
        c.beginPath();c.moveTo(px+TL-4,py);c.lineTo(px+TL-4,py+TL);c.stroke();
        c.beginPath();c.moveTo(px+TL-4,py+8+h1*4);c.lineTo(px+TL,py+8+h1*4);c.stroke();
        c.beginPath();c.moveTo(px+TL-4,py+24-h2*4);c.lineTo(px+TL,py+24-h2*4);c.stroke();
        c.beginPath();c.moveTo(px+TL-cw+1,py+16+h3*3);c.lineTo(px+TL-4,py+16+h3*3);c.stroke();
        c.fillStyle="rgba(255,255,220,0.06)";c.fillRect(px+TL-1,py,1,TL);
        const sh=c.createLinearGradient(px+TL-cw-6,py,px+TL-cw,py);
        sh.addColorStop(0,"rgba(0,0,0,0)");sh.addColorStop(1,"rgba(0,0,0,0.15)");
        c.fillStyle=sh;c.fillRect(px+TL-cw-6,py,6,TL);
        if(h2>0.5){c.fillStyle="rgba(50,80,40,0.2)";c.beginPath();c.arc(px+TL-3-h1*3,py+10+h3*8,1.5+h2,0,Math.PI*2);c.fill();}
      }
      break;}
    case T.BANANA:{c.fillStyle=iD?(dg.fc||dg.color):"#2d6a1e";c.fillRect(px,py,TL,TL);
      // Mysterious golden glow
      const bg3=Math.sin(t/250)*.15+.3;c.fillStyle=`rgba(253,211,51,${bg3})`;c.beginPath();c.arc(px+16,py+16,12,0,Math.PI*2);c.fill();
      // Banana shape — crescent curve
      c.strokeStyle="#ffd633";c.lineWidth=3;c.lineCap="round";
      c.beginPath();c.arc(px+16,py+20,8,-Math.PI*0.8,-Math.PI*0.15);c.stroke();
      c.strokeStyle="#ffe866";c.lineWidth=2;
      c.beginPath();c.arc(px+16,py+20,8,-Math.PI*0.7,-Math.PI*0.2);c.stroke();
      // Stem
      c.fillStyle="#8a6a30";c.fillRect(px+20,py+10,2,4);
      // Sparkle
      const sp3=Math.sin(t/180)*2;c.fillStyle="#fff";
      c.beginPath();c.arc(px+10+sp3,py+10,1.5,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(px+22-sp3,py+14,1,0,Math.PI*2);c.fill();
      break;}
    case T.LADDER:{// Ladder — climbable tile to get back up ledges
      // Sunken floor underneath
      const ldc=iD?(dg.fc||dg.color):"#1a2a16";
      c.fillStyle=ldc;c.fillRect(px,py,TL,TL);
      c.fillStyle="rgba(0,0,0,0.18)";c.fillRect(px,py,TL,TL);
      // Side rails — thick wooden beams with bevel
      const railW=4,railL=px+8,railR=px+TL-12;
      // Rail shadows (depth)
      c.fillStyle="#2a1a08";c.fillRect(railL+1,py,railW,TL);c.fillRect(railR+1,py,railW,TL);
      // Rails with wood grain gradient
      const rg=c.createLinearGradient(railL,py,railL+railW,py);
      rg.addColorStop(0,"#9a7a44");rg.addColorStop(0.3,"#b0904e");rg.addColorStop(0.7,"#8a6a34");rg.addColorStop(1,"#6a5024");
      c.fillStyle=rg;c.fillRect(railL,py,railW,TL);c.fillRect(railR,py,railW,TL);
      // Wood grain streaks on rails
      c.strokeStyle="rgba(60,40,15,0.3)";c.lineWidth=0.4;
      for(let g=0;g<3;g++){const gy=py+4+g*10+hs(px,py,93+g)*4;
        c.beginPath();c.moveTo(railL+1,gy);c.lineTo(railL+3,gy+8);c.stroke();
        c.beginPath();c.moveTo(railR+1,gy);c.lineTo(railR+3,gy+8);c.stroke();}
      // Rungs with wood texture
      for(let r=0;r<4;r++){
        const ry=py+4+r*7;
        c.fillStyle="#4a3518";c.fillRect(railL+railW-1,ry+1,railR-railL-railW+2,3);
        const rung=c.createLinearGradient(px,ry,px,ry+3);
        rung.addColorStop(0,"#b0904e");rung.addColorStop(0.5,"#9a7a3e");rung.addColorStop(1,"#7a5a2a");
        c.fillStyle=rung;c.fillRect(railL+railW-1,ry,railR-railL-railW+2,2.5);
        // Worn center
        c.fillStyle="rgba(180,150,100,0.15)";c.fillRect(railL+railW+2,ry+0.5,railR-railL-railW-4,1);
      }
      // Nail/bolt dots at rung intersections
      c.fillStyle="#666";
      for(let r=0;r<4;r++){const ry=py+4+r*7;
        c.beginPath();c.arc(railL+railW,ry+1.2,0.9,0,Math.PI*2);c.fill();
        c.beginPath();c.arc(railR,ry+1.2,0.9,0,Math.PI*2);c.fill();}
      // Subtle highlight at top (light catching the wood)
      c.fillStyle="rgba(200,180,120,0.08)";c.fillRect(railL,py,railW,2);c.fillRect(railR,py,railW,2);
      break;}
    case T.LOW_FLOOR:{// Sunken floor — darker, depressed area with 3D indentation
      const lfc=iD?(dg.fc||dg.color):"#1a2a16";
      c.fillStyle=lfc;c.fillRect(px,py,TL,TL);
      // Heavy darken for sunken look
      c.fillStyle="rgba(0,0,0,0.35)";c.fillRect(px,py,TL,TL);
      // Inner shadow edges — thick gradient shadows on top+left (light comes from top-left)
      const shTop=c.createLinearGradient(px,py,px,py+8);
      shTop.addColorStop(0,"rgba(0,0,0,0.45)");shTop.addColorStop(1,"rgba(0,0,0,0)");
      c.fillStyle=shTop;c.fillRect(px,py,TL,8);
      const shLeft=c.createLinearGradient(px,py,px+8,py);
      shLeft.addColorStop(0,"rgba(0,0,0,0.35)");shLeft.addColorStop(1,"rgba(0,0,0,0)");
      c.fillStyle=shLeft;c.fillRect(px,py,8,TL);
      // Light catch on bottom+right edges (opposite = lit)
      const lgBot=c.createLinearGradient(px,py+TL-6,px,py+TL);
      lgBot.addColorStop(0,"rgba(0,0,0,0)");lgBot.addColorStop(1,"rgba(200,180,140,0.08)");
      c.fillStyle=lgBot;c.fillRect(px,py+TL-6,TL,6);
      const lgRight=c.createLinearGradient(px+TL-6,py,px+TL,py);
      lgRight.addColorStop(0,"rgba(0,0,0,0)");lgRight.addColorStop(1,"rgba(200,180,140,0.06)");
      c.fillStyle=lgRight;c.fillRect(px+TL-6,py,6,TL);
      // Cracked stone texture — multiple random cracks
      c.strokeStyle="rgba(0,0,0,0.2)";c.lineWidth=0.5;
      const h1=hs(px,py,60),h2=hs(px,py,61),h3=hs(px,py,62);
      c.beginPath();c.moveTo(px+6+h1*10,py+4+h2*6);c.lineTo(px+14+h1*6,py+12+h2*8);c.stroke();
      c.beginPath();c.moveTo(px+18+h3*8,py+8+h1*6);c.lineTo(px+26+h2*4,py+18+h3*8);c.stroke();
      c.beginPath();c.moveTo(px+10+h2*6,py+20+h3*4);c.lineTo(px+20+h1*6,py+26+h2*4);c.stroke();
      // Occasional puddle/moss spots
      if(h1>0.5){c.fillStyle="rgba(40,60,40,0.15)";c.beginPath();c.arc(px+10+h2*12,py+12+h3*10,3+h1*2,0,Math.PI*2);c.fill();}
      if(h3>0.6){c.fillStyle="rgba(30,50,60,0.12)";c.beginPath();c.ellipse(px+20+h1*6,py+20+h2*6,4,2.5,h3,0,Math.PI*2);c.fill();}
      break;}
    case T.STAIRS_DOWN:{// Dark stairway descending into the floor
      const sfc=iD?(dg.fc||dg.color):"#2d6a1e";
      c.fillStyle=sfc;c.fillRect(px,py,TL,TL);
      // Dark hole
      c.fillStyle="#060606";c.fillRect(px+4,py+4,TL-8,TL-8);
      // Stone border with 3D bevel
      c.fillStyle="#555";c.fillRect(px+3,py+3,TL-6,2);c.fillRect(px+3,py+3,2,TL-6);// top+left lit
      c.fillStyle="#222";c.fillRect(px+3,py+TL-5,TL-6,2);c.fillRect(px+TL-5,py+3,2,TL-6);// bottom+right shadow
      // Descending steps (getting darker as they go down)
      for(let i=0;i<4;i++){
        const sy=py+6+i*5,sw=TL-12-i*2,sx=px+6+i;
        c.fillStyle=`rgb(${50-i*10},${45-i*8},${40-i*8})`;
        c.fillRect(sx,sy,sw,3);
      }
      // Subtle glow from below (mysterious)
      const sg=Math.sin(t/600)*0.08+0.12;
      const sg2=c.createRadialGradient(px+16,py+20,2,px+16,py+16,14);
      sg2.addColorStop(0,`rgba(180,140,80,${sg})`);sg2.addColorStop(1,"rgba(180,140,80,0)");
      c.fillStyle=sg2;c.fillRect(px+4,py+4,TL-8,TL-8);
      break;}
    case T.EMPTY:c.fillStyle="#080808";c.fillRect(px,py,TL,TL);break;
    default:c.fillStyle=iD?(dg.fc||dg.color):"#2d6a1e";c.fillRect(px,py,TL,TL);
  }
}
