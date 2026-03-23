export function dc(o){return JSON.parse(JSON.stringify(o));}
export function hs(x,y,s){let h=(x*374761393+y*668265263+s*1274126177)&0x7fffffff;h=((h>>13)^h)*1274126177&0x7fffffff;return(h&0xff)/255;}
