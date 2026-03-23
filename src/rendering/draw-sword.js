import { SR, SD } from '../constants.js';

export function dSw(c,px,py,d,tm){
  const p2=1-tm/SD; // 0→1 over swing duration
  const cx=(px+PS/2)|0,cy=(py+PS/2)|0;
  // Sweeping arc: angle goes from -80deg to +80deg relative to facing
  const baseAng=d===0?-Math.PI/2:d===2?Math.PI/2:d===3?Math.PI:0;
  const swAng=((p2*160-80)*Math.PI/180); // -80 to +80
  const ang=baseAng+swAng;
  const reach=SR*(1+Math.sin(p2*Math.PI)*0.3); // slight reach pulse at peak
  const tipX=cx+Math.cos(ang)*reach,tipY=cy+Math.sin(ang)*reach;
  // Motion trail — draw 6 previous positions as fading arcs
  c.lineCap="round";
  for(let i=6;i>=0;i--){
    const tp=Math.max(0,p2-i*0.04);const ta=baseAng+((tp*160-80)*Math.PI/180);
    const tr=SR*(1+Math.sin(tp*Math.PI)*0.3);
    const alpha=(1-i/7)*0.25;const width=4-i*0.4;
    c.strokeStyle=`rgba(200,220,255,${alpha})`;c.lineWidth=Math.max(0.5,width);
    c.beginPath();c.moveTo(cx+Math.cos(ta)*8,cy+Math.sin(ta)*8);c.lineTo(cx+Math.cos(ta)*tr,cy+Math.sin(ta)*tr);c.stroke();
  }
  // Main blade — gradient from guard to tip
  const bg=c.createLinearGradient(cx,cy,tipX,tipY);
  bg.addColorStop(0,"#a0a0b8");bg.addColorStop(0.3,"#d0d0e8");bg.addColorStop(0.7,"#e8e8ff");bg.addColorStop(1,"#ffffff");
  c.strokeStyle=bg;c.lineWidth=4;c.lineCap="round";
  c.beginPath();c.moveTo(cx+Math.cos(ang)*8,cy+Math.sin(ang)*8);c.lineTo(tipX,tipY);c.stroke();
  // Bright edge highlight
  c.strokeStyle="rgba(255,255,255,0.7)";c.lineWidth=1.5;
  c.beginPath();c.moveTo(cx+Math.cos(ang)*10,cy+Math.sin(ang)*10);c.lineTo(tipX,tipY);c.stroke();
  // Guard (crossguard)
  const gAng=ang+Math.PI/2;
  c.strokeStyle="#b8862a";c.lineWidth=3;
  c.beginPath();c.moveTo(cx+Math.cos(gAng)*6+Math.cos(ang)*7,cy+Math.sin(gAng)*6+Math.sin(ang)*7);
  c.lineTo(cx-Math.cos(gAng)*6+Math.cos(ang)*7,cy-Math.sin(gAng)*6+Math.sin(ang)*7);c.stroke();
  // Tip sparkle burst at peak of swing
  if(p2>0.3&&p2<0.7){
    const sparkAlpha=(1-Math.abs(p2-0.5)/0.2)*0.8;
    c.fillStyle=`rgba(255,255,200,${sparkAlpha})`;
    for(let i=0;i<4;i++){const sa=ang+Math.PI*(i/2-1)*0.3;const sr=reach+3+Math.sin(p2*20+i)*4;
      c.beginPath();c.arc(cx+Math.cos(sa)*sr,cy+Math.sin(sa)*sr,1.5,0,Math.PI*2);c.fill();}
    // Arc glow at tip
    const glw=c.createRadialGradient(tipX,tipY,0,tipX,tipY,8);
    glw.addColorStop(0,`rgba(200,230,255,${sparkAlpha*0.6})`);glw.addColorStop(1,"rgba(200,230,255,0)");
    c.fillStyle=glw;c.beginPath();c.arc(tipX,tipY,8,0,Math.PI*2);c.fill();
  }
  c.lineCap="butt";
}
