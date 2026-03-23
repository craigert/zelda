// Heart shape drawing helper
export function dH(c,x,y,s){c.beginPath();c.moveTo(x+s/2,y+s*.85);c.bezierCurveTo(x,y+s*.5,x,y,x+s/2,y+s*.2);c.bezierCurveTo(x+s,y,x+s,y+s*.5,x+s/2,y+s*.85);c.fill();}
