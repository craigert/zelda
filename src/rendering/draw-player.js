export function dP(c,x,y,d,t){
  const bob=Math.sin(t/150)*0.8;
  const armSwing=Math.sin(t/150)*1.5;
  // Shadow
  c.fillStyle="rgba(0,0,0,0.2)";c.beginPath();c.ellipse(x+12,y+23,8,3,0,0,Math.PI*2);c.fill();

  if(d===2){ // FACING DOWN — full front view
    // Boots
    c.fillStyle="#6a3a18";
    c.beginPath();c.arc(x+7,y+22+bob,3,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(x+17,y+22+bob,3,0,Math.PI*2);c.fill();
    // Legs
    c.fillStyle="#c8b080";c.fillRect(x+6,y+17+bob,4,5);c.fillRect(x+14,y+17+bob,4,5);
    // Tunic body
    const bg=c.createLinearGradient(x+4,y+8,x+20,y+18);bg.addColorStop(0,"#48aa48");bg.addColorStop(1,"#2a7a2a");
    c.fillStyle=bg;
    c.beginPath();c.moveTo(x+5,y+9+bob);c.lineTo(x+19,y+9+bob);c.lineTo(x+20,y+18+bob);c.lineTo(x+4,y+18+bob);c.closePath();c.fill();
    // Belt
    c.fillStyle="#8a6a2a";c.fillRect(x+4,y+15+bob,16,2);
    c.fillStyle="#d4b040";c.fillRect(x+10,y+15+bob,4,2);
    // Arms
    c.fillStyle="#48aa48";
    c.fillRect(x+1,y+10+armSwing,4,7);c.fillRect(x+19,y+10-armSwing,4,7);
    c.fillStyle="#f0c8a0";
    c.beginPath();c.arc(x+3,y+18+armSwing,2,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(x+21,y+18-armSwing,2,0,Math.PI*2);c.fill();
    // Head
    c.fillStyle="#f0c8a0";c.beginPath();c.arc(x+12,y+5+bob,6,0,Math.PI*2);c.fill();
    // Hair
    c.fillStyle="#c8a030";c.beginPath();c.arc(x+12,y+3+bob,6,Math.PI+0.3,Math.PI*2-0.3);c.fill();
    c.fillRect(x+5,y+2+bob,3,4);c.fillRect(x+16,y+2+bob,3,4);
    // Eyes
    c.fillStyle="#2244aa";c.beginPath();c.arc(x+9,y+5.5+bob,1.5,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(x+15,y+5.5+bob,1.5,0,Math.PI*2);c.fill();
    c.fillStyle="#fff";c.fillRect(x+9,y+4.5+bob,1,1);c.fillRect(x+15,y+4.5+bob,1,1);
    // Mouth
    c.strokeStyle="#aa6644";c.lineWidth=0.7;c.beginPath();c.arc(x+12,y+8+bob,2,0.2,Math.PI-0.2);c.stroke();
    // Hat
    const hg=c.createLinearGradient(x+4,y-4,x+20,y+3);hg.addColorStop(0,"#2a9a2a");hg.addColorStop(1,"#1a7a1a");
    c.fillStyle=hg;c.beginPath();c.moveTo(x+5,y+2+bob);c.lineTo(x+12,y-5+bob);c.lineTo(x+19,y+2+bob);c.closePath();c.fill();
    // Hat brim
    c.fillStyle="#22882a";c.beginPath();c.ellipse(x+12,y+2+bob,8,2,0,0,Math.PI*2);c.fill();

  }else if(d===0){ // FACING UP — back view
    c.fillStyle="#6a3a18";c.beginPath();c.arc(x+7,y+22+bob,3,0,Math.PI*2);c.fill();c.beginPath();c.arc(x+17,y+22+bob,3,0,Math.PI*2);c.fill();
    c.fillStyle="#c8b080";c.fillRect(x+6,y+17+bob,4,5);c.fillRect(x+14,y+17+bob,4,5);
    const bg=c.createLinearGradient(x+4,y+8,x+20,y+18);bg.addColorStop(0,"#48aa48");bg.addColorStop(1,"#2a7a2a");
    c.fillStyle=bg;c.beginPath();c.moveTo(x+5,y+9+bob);c.lineTo(x+19,y+9+bob);c.lineTo(x+20,y+18+bob);c.lineTo(x+4,y+18+bob);c.closePath();c.fill();
    c.fillStyle="#8a6a2a";c.fillRect(x+4,y+15+bob,16,2);
    c.fillStyle="#48aa48";c.fillRect(x+1,y+10-armSwing,4,7);c.fillRect(x+19,y+10+armSwing,4,7);
    // Sword on back (diagonal)
    c.strokeStyle="#b8b8c8";c.lineWidth=2;c.beginPath();c.moveTo(x+8,y+8+bob);c.lineTo(x+18,y+18+bob);c.stroke();
    c.fillStyle="#8a6830";c.fillRect(x+11,y+12+bob,3,3);
    // Head back — hair
    c.fillStyle="#c8a030";c.beginPath();c.arc(x+12,y+5+bob,6,0,Math.PI*2);c.fill();
    // Hat from behind
    const hg2=c.createLinearGradient(x+4,y-4,x+20,y+3);hg2.addColorStop(0,"#2a9a2a");hg2.addColorStop(1,"#1a7a1a");c.fillStyle=hg2;
    c.beginPath();c.moveTo(x+5,y+2+bob);c.lineTo(x+12,y-5+bob);c.lineTo(x+19,y+2+bob);c.closePath();c.fill();
    c.fillStyle="#22882a";c.beginPath();c.ellipse(x+12,y+2+bob,8,2,0,0,Math.PI*2);c.fill();
    // Flowing hat tail
    const tailSway=Math.sin(t/200)*3;
    c.fillStyle="#2a9a2a";c.beginPath();c.moveTo(x+12,y-4+bob);c.quadraticCurveTo(x+20+tailSway,y-2+bob,x+22+tailSway,y+4+bob);c.lineTo(x+18+tailSway,y+3+bob);c.quadraticCurveTo(x+17+tailSway*.5,y-1+bob,x+12,y-3+bob);c.fill();

  }else if(d===3){ // FACING LEFT
    c.fillStyle="#6a3a18";c.beginPath();c.arc(x+8,y+22+bob,3,0,Math.PI*2);c.fill();c.beginPath();c.arc(x+14,y+22+bob,3,0,Math.PI*2);c.fill();
    c.fillStyle="#c8b080";c.fillRect(x+7,y+17+bob,4,5);c.fillRect(x+12,y+17+bob,4,5);
    const bg=c.createLinearGradient(x+5,y+8,x+18,y+18);bg.addColorStop(0,"#48aa48");bg.addColorStop(1,"#2a7a2a");
    c.fillStyle=bg;c.beginPath();c.moveTo(x+6,y+9+bob);c.lineTo(x+17,y+9+bob);c.lineTo(x+18,y+18+bob);c.lineTo(x+5,y+18+bob);c.closePath();c.fill();
    c.fillStyle="#8a6a2a";c.fillRect(x+5,y+15+bob,13,2);
    // Arm forward
    c.fillStyle="#48aa48";c.fillRect(x+2,y+11+bob,4,6);
    c.fillStyle="#f0c8a0";c.beginPath();c.arc(x+4,y+18+bob,2,0,Math.PI*2);c.fill();
    // Head
    c.fillStyle="#f0c8a0";c.beginPath();c.arc(x+11,y+5+bob,6,0,Math.PI*2);c.fill();
    // Side hair
    c.fillStyle="#c8a030";c.beginPath();c.arc(x+13,y+4+bob,5,0,Math.PI*2);c.fill();
    // Eye
    c.fillStyle="#2244aa";c.beginPath();c.arc(x+8,y+5.5+bob,1.5,0,Math.PI*2);c.fill();
    c.fillStyle="#fff";c.fillRect(x+7.5,y+4.5+bob,1,1);
    // Hat
    const hg3=c.createLinearGradient(x+2,y-4,x+16,y+3);hg3.addColorStop(0,"#2a9a2a");hg3.addColorStop(1,"#1a7a1a");
    c.fillStyle=hg3;c.beginPath();c.moveTo(x+5,y+2+bob);c.lineTo(x+8,y-5+bob);c.lineTo(x+17,y+2+bob);c.closePath();c.fill();
    c.fillStyle="#22882a";c.beginPath();c.ellipse(x+11,y+2+bob,7,2,0,0,Math.PI*2);c.fill();
    const ts=Math.sin(t/200)*3;c.fillStyle="#2a9a2a";c.beginPath();c.moveTo(x+8,y-4+bob);c.quadraticCurveTo(x+16+ts,y-3+bob,x+20+ts,y+2+bob);c.lineTo(x+17+ts,y+1+bob);c.quadraticCurveTo(x+14+ts*.5,y-2+bob,x+9,y-3+bob);c.fill();

  }else{ // FACING RIGHT (d===1)
    c.fillStyle="#6a3a18";c.beginPath();c.arc(x+10,y+22+bob,3,0,Math.PI*2);c.fill();c.beginPath();c.arc(x+16,y+22+bob,3,0,Math.PI*2);c.fill();
    c.fillStyle="#c8b080";c.fillRect(x+9,y+17+bob,4,5);c.fillRect(x+14,y+17+bob,4,5);
    const bg=c.createLinearGradient(x+6,y+8,x+19,y+18);bg.addColorStop(0,"#2a7a2a");bg.addColorStop(1,"#48aa48");
    c.fillStyle=bg;c.beginPath();c.moveTo(x+7,y+9+bob);c.lineTo(x+18,y+9+bob);c.lineTo(x+19,y+18+bob);c.lineTo(x+6,y+18+bob);c.closePath();c.fill();
    c.fillStyle="#8a6a2a";c.fillRect(x+6,y+15+bob,13,2);
    // Arm forward
    c.fillStyle="#48aa48";c.fillRect(x+18,y+11+bob,4,6);
    c.fillStyle="#f0c8a0";c.beginPath();c.arc(x+20,y+18+bob,2,0,Math.PI*2);c.fill();
    // Head
    c.fillStyle="#f0c8a0";c.beginPath();c.arc(x+13,y+5+bob,6,0,Math.PI*2);c.fill();
    c.fillStyle="#c8a030";c.beginPath();c.arc(x+11,y+4+bob,5,0,Math.PI*2);c.fill();
    // Eye
    c.fillStyle="#2244aa";c.beginPath();c.arc(x+16,y+5.5+bob,1.5,0,Math.PI*2);c.fill();
    c.fillStyle="#fff";c.fillRect(x+16,y+4.5+bob,1,1);
    // Hat
    const hg4=c.createLinearGradient(x+8,y-4,x+22,y+3);hg4.addColorStop(0,"#1a7a1a");hg4.addColorStop(1,"#2a9a2a");
    c.fillStyle=hg4;c.beginPath();c.moveTo(x+7,y+2+bob);c.lineTo(x+16,y-5+bob);c.lineTo(x+19,y+2+bob);c.closePath();c.fill();
    c.fillStyle="#22882a";c.beginPath();c.ellipse(x+13,y+2+bob,7,2,0,0,Math.PI*2);c.fill();
    const ts2=Math.sin(t/200)*3;c.fillStyle="#2a9a2a";c.beginPath();c.moveTo(x+16,y-4+bob);c.quadraticCurveTo(x+8-ts2,y-3+bob,x+4-ts2,y+2+bob);c.lineTo(x+7-ts2,y+1+bob);c.quadraticCurveTo(x+10-ts2*.5,y-2+bob,x+15,y-3+bob);c.fill();
  }
}
