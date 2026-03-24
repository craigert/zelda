<template>
  <div ref="wrapRef" :style="{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#060608',fontFamily:'monospace',color:'#ccc',padding:0,width:'100%',height:'100vh',overflow:'hidden',userSelect:'none',WebkitUserSelect:'none'}">
    <canvas ref="cvRef" :width="W2*4" :height="(H2+HH)*4" @click="onCanvasClick" :style="{border:'none',width:'100%',maxHeight:'70vh',aspectRatio:`${W2}/${H2+HH}`}"/>
    <div :style="{display:'flex',gap:'48px',marginTop:'14px',alignItems:'center'}">
      <div :style="{position:'relative',width:'104px',height:'104px'}">
        <button v-for="[d,l,tt,ch] in [['up',36,0,'▲'],['down',36,70,'▼'],['left',0,35,'◀'],['right',70,35,'▶']]" :key="d"
          @touchstart.prevent="dp(d)" @touchend.prevent="de()"
          @mousedown="dp(d)" @mouseup="de()" @mouseleave="de()"
          :style="{position:'absolute',left:l+'px',top:tt+'px',width:'34px',height:'34px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'6px',color:'#777',fontSize:'16px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',touchAction:'none'}">{{ ch }}</button>
      </div>
      <button @touchstart.prevent="at()" @mousedown="at()"
        :style="{width:'60px',height:'60px',borderRadius:'50%',background:'radial-gradient(circle,rgba(200,50,50,0.3),rgba(150,30,30,0.15))',border:'2px solid rgba(200,50,50,0.4)',color:'#e88',fontSize:'13px',fontFamily:'monospace',cursor:'pointer',touchAction:'none',fontWeight:'bold',letterSpacing:'1px',boxShadow:'0 0 15px rgba(200,50,50,0.1)'}">ATK</button>
      <div :style="{display:'flex',flexDirection:'column',gap:'8px'}">
        <button @touchstart.prevent="onPauseBtn()" @mousedown="onPauseBtn()"
          :style="{width:'36px',height:'36px',borderRadius:'6px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',color:'#888',fontSize:'10px',fontFamily:'monospace',cursor:'pointer',touchAction:'none'}">| |</button>
        <button @touchstart.prevent="onBombBtn()" @mousedown="onBombBtn()"
          :style="{width:'36px',height:'36px',borderRadius:'6px',background:'rgba(100,100,255,0.1)',border:'1px solid rgba(100,100,255,0.2)',color:'#8af',fontSize:'10px',fontFamily:'monospace',cursor:'pointer',touchAction:'none'}">BMB</button>
        <button @touchstart.prevent="onShieldDown()" @touchend.prevent="onShieldUp()" @mousedown="onShieldDown()" @mouseup="onShieldUp()" @mouseleave="onShieldUp()"
          :style="{width:'36px',height:'36px',borderRadius:'6px',background:'rgba(100,100,255,0.15)',border:'1px solid rgba(100,100,255,0.3)',color:'#88f',fontSize:'10px',fontFamily:'monospace',cursor:'pointer',touchAction:'none'}">SHD</button>
        <button @touchstart.prevent="onBowBtn()" @mousedown="onBowBtn()"
          :style="{width:'36px',height:'36px',borderRadius:'6px',background:'rgba(255,200,50,0.1)',border:'1px solid rgba(255,200,50,0.2)',color:'#fd3',fontSize:'10px',fontFamily:'monospace',cursor:'pointer',touchAction:'none'}">BOW</button>
        <button @touchstart.prevent="onMapBtn()" @mousedown="onMapBtn()"
          :style="{width:'36px',height:'36px',borderRadius:'6px',background:'rgba(100,255,100,0.1)',border:'1px solid rgba(100,255,100,0.2)',color:'#8f8',fontSize:'10px',fontFamily:'monospace',cursor:'pointer',touchAction:'none'}">MAP</button>
      </div>
    </div>
    <div :style="{display:'flex',gap:'12px',marginTop:'10px',fontSize:'10px',color:'#444',letterSpacing:'1px',alignItems:'center',flexWrap:'wrap',justifyContent:'center'}">
      <button ref="muBtnRef" @click="onMuToggle"
        :style="{background:muOn?'rgba(253,211,51,0.2)':'rgba(255,255,255,0.06)',border:`1px solid ${muOn?'rgba(253,211,51,0.4)':'rgba(255,255,255,0.12)'}`,borderRadius:'4px',color:muOn?'#fd3':'#666',fontSize:'11px',padding:'3px 10px',cursor:'pointer',fontFamily:'monospace',letterSpacing:'1px'}">{{ muOn ? '♪ ON' : '♪ OFF' }}</button>
      <button @click="showMuPicker=!showMuPicker"
        :style="{background:showMuPicker?'rgba(100,200,255,0.15)':'rgba(255,255,255,0.06)',border:`1px solid ${showMuPicker?'rgba(100,200,255,0.3)':'rgba(255,255,255,0.12)'}`,borderRadius:'4px',color:showMuPicker?'#8cf':'#666',fontSize:'11px',padding:'3px 10px',cursor:'pointer',fontFamily:'monospace',letterSpacing:'1px'}">🎵 MP3</button>
      <button @click="toggleFS"
        :style="{background:isFS?'rgba(100,255,100,0.15)':'rgba(255,255,255,0.06)',border:`1px solid ${isFS?'rgba(100,255,100,0.3)':'rgba(255,255,255,0.12)'}`,borderRadius:'4px',color:isFS?'#8f8':'#666',fontSize:'11px',padding:'3px 10px',cursor:'pointer',fontFamily:'monospace',letterSpacing:'1px'}">{{ isFS ? '⛶ EXIT' : '⛶ FULL' }}</button>
    </div>
    <div v-if="showMuPicker" :style="{background:'rgba(0,0,0,0.85)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'8px',padding:'12px',marginTop:'8px',maxWidth:'480px',width:'100%'}">
      <div :style="{color:'#aaa',fontSize:'11px',fontFamily:'monospace',marginBottom:'8px',textAlign:'center'}">CUSTOM MUSIC — Pick files or paste URLs</div>
      <div v-for="[key,label] in [['title','🎬 Title Screen'],['overworld','🌍 Overworld'],['forest','🌲 Forest Temple'],['fire','🔥 Fire Cavern'],['shadow','👻 Shadow Keep'],['triforce','✨ Triforce Moment']]" :key="key"
        :style="{marginBottom:'8px',padding:'6px',background:'rgba(255,255,255,0.02)',borderRadius:'4px'}">
        <div :style="{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}">
          <span :style="{color:'#888',fontSize:'10px',fontFamily:'monospace',width:'100px',flexShrink:0}">{{ label }}</span>
          <span v-if="customMu[key]" :style="{color:'#4a4',fontSize:'9px',fontFamily:'monospace'}">✓ loaded</span>
          <button v-if="customMu[key]" @click="clearCustomMu(key)"
            :style="{background:'rgba(255,50,50,0.15)',border:'1px solid rgba(255,50,50,0.3)',borderRadius:'3px',color:'#f66',fontSize:'9px',padding:'1px 6px',cursor:'pointer',fontFamily:'monospace',marginLeft:'auto'}">✕ clear</button>
        </div>
        <div :style="{display:'flex',gap:'6px',alignItems:'center'}">
          <label :style="{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'3px',color:'#888',fontSize:'9px',padding:'3px 8px',cursor:'pointer',fontFamily:'monospace',flexShrink:0}">
            📁 File<input type="file" accept="audio/*" style="display:none" @change="onFileChange($event, key)"/>
          </label>
          <input type="text" placeholder="or paste audio URL..." @keydown="onUrlKeydown($event, key)"
            :style="{flex:1,minWidth:0,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'3px',color:'#aaa',fontSize:'9px',padding:'3px 6px',fontFamily:'monospace',outline:'none'}"/>
        </div>
      </div>
      <div :style="{color:'#555',fontSize:'9px',fontFamily:'monospace',textAlign:'center',marginTop:'4px'}">Files loop automatically · Press Enter to load URLs · Turn music ON to hear</div>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted, onUnmounted, watch } from 'vue';
import * as Tone from 'tone';
import { T, TL, CO, RO, W2, H2, HH, PS, ES, SR, SD, IFR, SOLID } from '../constants.js';
import { DEFAULT_MUSIC, MUSIC } from '../data/music-data.js';
import { OW, OW_EN } from '../data/overworld.js';
import { CAVES } from '../data/caves.js';
import { DG, DE } from '../data/dungeons.js';
import { au, initAu, playTh, stopMu } from '../audio/music-engine.js';
import { initSfx, sfx } from '../audio/sfx.js';
import { dc, hs } from '../utils/helpers.js';
import { dP } from '../rendering/draw-player.js';
import { dSw } from '../rendering/draw-sword.js';
import { dSk, dBt, dGh, dBo, dAr, dMg, dKn } from '../rendering/draw-enemies.js';
import { dH } from '../rendering/draw-hud.js';
import { dT } from '../rendering/draw-tiles.js';
import { drawTerrainOverlay } from '../rendering/draw-terrain.js';
import { NPC_DATA } from '../data/npcs.js';

// --- Refs ---
const cvRef = ref(null);
const stR = shallowRef(null);
const kyR = ref(new Set());
const anR = ref(null);
const ltR = ref(0);
const tcR = ref({dir:null,atk:false});
const muOn = ref(true);
const ltRef = ref(null);
const customMu = ref({...DEFAULT_MUSIC});
const showMuPicker = ref(false);
const customAuRef = ref(null);
const wrapRef = ref(null);
const isFS = ref(false);
const muBtnRef = ref(null);
const trR = ref({active:false,alpha:0,dir:0});

// --- Init ---
function init() {
  return {
    p:{x:7*TL,y:9*TL,dir:2,hp:8,mhp:8,keys:0,bombs:0,rupees:0,masterKey:[false,false,false,false],spd:2.8,ifr:0,tri:[false,false,false],burn:0,freeze:0,poison:0,poisonTick:0,burnTick:0,shield:false,heartPieces:0,hasBow:false,hasBombs:false,hasMasterSword:false},
    sw:{a:false,t:0},loc:{ty:"ow",scr:"1,1",di:-1},
    en:[],pk:new Set(),dr:new Set(),cl:new Set(),
    msg:{text:"",t:0},go:false,won:false,dg:dc(DG),pt:[],ec:0,
    title:true,
    fade:{a:false,alpha:0,dir:1,cb:null,t:0},
    shake:{x:0,y:0,t:0},
    drops:[],
    death:{a:false,t:0,spin:0},
    lowHp:0,
    paused:false,pauseSel:0,volume:80,
    dmgNums:[],
    freeze:0,
    roomFlash:0,
    respawn:{ty:"ow",scr:"1,1",di:-1,x:7*TL,y:9*TL},
    heartContainers:[],
    finalOpen:false,
    triMu:false,
    bProj:[],
    gt:0,
    dgTitle:{text:"",t:0}, // dungeon title overlay
    mapOpen:false,
    timedDoors:[],
    iceSlide:{active:false,dx:0,dy:0},
    npcTalk:null,
    pArrows:[],
    chest:null, // {x,y,state:"closed"|"opening"|"open",t:0,reward:null}
    slide:{a:false,dx:0,dy:0,t:0,dur:200,prevScr:null},
    activeBombs:[], // {x,y,t:0,fuse:1500,exploded:false}
    bladeTraps:[], // {x,y,hx,hy,dir,range,st:"idle"|"lunge"|"retract",vel:0}
    litTorches:new Set(), // "x,y" keys of torches lit by sword in current room
    combatLock:false, // true when room has enemies and exits are sealed
  };
}

// --- Canvas click handler ---
function onCanvasClick() {
  const s = stR.value;
  if (s && s.npcTalk) { s.respawnClick = true; return; }
  if (s && s.title) {
    if (ltRef.value === "title") {
      s.title = false;
      const save = loadGame();
      if (save && applySave(s, save)) {
        le(s); s.msg = { text: "Game loaded!", t: 1500 };
      } else { le(s); }
      ltRef.value = null;
    }
    return;
  }
  if (s && (s.go || s.won)) { s.respawnClick = true; return; }
  if (s && s.mapOpen) { s.mapOpen = false; s.paused = false; return; }
  if (s && s.paused) s.paused = false;
}

// --- Touch/button helpers ---
function dp(d) { tcR.value.dir = d; }
function de() { tcR.value.dir = null; }
function at() { tcR.value.atk = true; }

function onPauseBtn() { const s2 = stR.value; if (s2) s2.paused = !s2.paused; }
function onBombBtn() { kyR.value.add("b"); setTimeout(() => kyR.value.delete("b"), 100); }
function onShieldDown() { kyR.value.add("x"); }
function onShieldUp() { kyR.value.delete("x"); }
function onBowBtn() { kyR.value.add("c"); setTimeout(() => kyR.value.delete("c"), 100); }
function onMapBtn() { const s2 = stR.value; if (s2) { s2.mapOpen = !s2.mapOpen; s2.paused = s2.mapOpen; } }

function onMuToggle() {
  Tone.start().then(() => { initSfx(); });
  muOn.value = !muOn.value;
}

function toggleFS() {
  const el = wrapRef.value; if (!el) return;
  if (!document.fullscreenElement) { el.requestFullscreen?.().catch(() => { el.webkitRequestFullscreen?.(); }); }
  else { document.exitFullscreen?.().catch(() => { document.webkitExitFullscreen?.(); }); }
}

// --- Music picker helpers ---
function clearCustomMu(key) {
  if (customMu.value[key]?.startsWith("blob:")) URL.revokeObjectURL(customMu.value[key]);
  customMu.value = { ...customMu.value, [key]: null };
  ltRef.value = null;
}

function onFileChange(e, key) {
  const f = e.target.files?.[0];
  if (f) {
    const url = URL.createObjectURL(f);
    customMu.value = { ...customMu.value, [key]: url };
    ltRef.value = null;
  }
}

function onUrlKeydown(e, key) {
  if (e.key === "Enter" && e.target.value.trim()) {
    customMu.value = { ...customMu.value, [key]: e.target.value.trim() };
    ltRef.value = null;
    e.target.value = "";
  }
}

// --- Save/Load ---
function saveGame(s) {
  if (!s || s.title || s.go || s.won) return;
  try {
    const data = {
      v: 1,
      p: { x: s.p.x, y: s.p.y, dir: s.p.dir, hp: s.p.hp, mhp: s.p.mhp, keys: s.p.keys, bombs: s.p.bombs, rupees: s.p.rupees, masterKey: [...s.p.masterKey], tri: [...s.p.tri], heartPieces: s.p.heartPieces, hasBow: s.p.hasBow, hasBombs: s.p.hasBombs, hasMasterSword: s.p.hasMasterSword },
      loc: { ...s.loc },
      pk: [...s.pk],
      dr: [...s.dr],
      cl: [...s.cl],
      heartContainers: [...s.heartContainers],
      finalOpen: s.finalOpen,
      respawn: { ...s.respawn }
    };
    localStorage.setItem('zelda_save', JSON.stringify(data));
  } catch (e) {}
}

function loadGame() {
  try {
    const raw = localStorage.getItem('zelda_save');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

function applySave(s, save) {
  if (!save || save.v !== 1) return false;
  s.p.x = save.p.x; s.p.y = save.p.y; s.p.dir = save.p.dir;
  s.p.hp = save.p.hp; s.p.mhp = save.p.mhp; s.p.keys = save.p.keys;
  s.p.bombs = save.p.bombs; s.p.rupees = save.p.rupees;
  s.p.masterKey = [...save.p.masterKey]; s.p.tri = [...save.p.tri]; s.p.heartPieces = save.p.heartPieces || 0; s.p.hasBow = save.p.hasBow || false; s.p.hasBombs = save.p.hasBombs || false; s.p.hasMasterSword = save.p.hasMasterSword || false;
  s.loc.ty = save.loc.ty; s.loc.scr = save.loc.scr; s.loc.di = save.loc.di;
  s.pk = new Set(save.pk); s.dr = new Set(save.dr); s.cl = new Set(save.cl);
  s.heartContainers = [...save.heartContainers];
  s.finalOpen = save.finalOpen;
  s.respawn = { ...save.respawn };
  if (s.finalOpen) {
    const fm = OW["3,2"];
    if (fm) { fm[5][7] = T.ENTRANCE; fm[5][8] = T.ENTRANCE; fm[6][7] = T.ENTRANCE; fm[6][8] = T.ENTRANCE; }
  }
  return true;
}

function hasSave() {
  try { return !!localStorage.getItem('zelda_save'); } catch(e) { return false; }
}

// --- Game logic functions ---
function le(s){s.bProj=[];s.pArrows=[];s.chest=null;s.activeBombs=[];s.litTorches=new Set();const rk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}`;if(s.cl.has(rk)){s.en=[];s.combatLock=false;return;}
  const sp=(e,i)=>({...e,mhp:e.hp,fl:0,mt:Math.random()*2000,st:"patrol",stT:0,hx:e.x,hy:e.y,spawnT:400+i*120});
  if(s.loc.ty==="dg"){const rm=s.dg[s.loc.di].rooms[s.loc.scr];s.en=rm?.enemies?rm.enemies.map(sp):[];}
  else if(s.loc.ty==="cave"){const cv=CAVES[s.loc.di];s.en=cv?.room?.enemies?cv.room.enemies.map(sp):[];}
  else{const oe2=OW_EN[s.loc.scr];s.en=oe2?oe2.map(sp):[];}
  // Combat lock — seal exits in dungeons/caves when enemies present
  const isDg=s.loc.ty==="dg"||s.loc.ty==="cave";
  if(isDg&&s.en.length>0){s.combatLock=true;sfx("door");s.shake.t=200;}
  else{s.combatLock=false;}
  // Load blade traps from room data
  s.bladeTraps=[];
  if(s.loc.ty==="dg"){const rm=s.dg[s.loc.di].rooms[s.loc.scr];
    if(rm?.traps)s.bladeTraps=rm.traps.map(tr=>({x:tr.x*TL,y:tr.y*TL,hx:tr.x*TL,hy:tr.y*TL,dir:tr.dir,range:tr.range*TL,st:"idle",vel:0,wait:0}));}}

function gm(s){if(s.loc.ty==="ow")return OW[s.loc.scr]||null;if(s.loc.ty==="cave")return CAVES[s.loc.di]?.room?.tiles||null;return s.dg[s.loc.di].rooms[s.loc.scr]?.tiles||null;}

function gts(s,ns,tx,ty){let m;if(s.loc.ty==="ow")m=OW[ns];else m=s.dg[s.loc.di].rooms[ns]?.tiles;
  if(!m||ty<0||ty>=RO||tx<0||tx>=CO)return T.WALL;return m[ty][tx];}

function iS(s,tx,ty){const m=gm(s);if(!m)return true;
  if(s.loc.ty==="cave"){if(tx<0||tx>=CO||ty<0||ty>=RO)return true;
    const tl=m[ty][tx];return SOLID.has(tl);}
  const[sx,sy]=s.loc.scr.split(",").map(Number);
  if(tx<0){return SOLID.has(gts(s,`${sx-1},${sy}`,CO+tx,ty));}
  if(tx>=CO){return SOLID.has(gts(s,`${sx+1},${sy}`,tx-CO,ty));}
  if(ty<0){return SOLID.has(gts(s,`${sx},${sy-1}`,tx,RO+ty));}
  if(ty>=RO){return SOLID.has(gts(s,`${sx},${sy+1}`,tx,ty-RO));}
  const tl=m[ty][tx];if(SOLID.has(tl))return true;
  // Combat lock — exits act as walls
  if(s.combatLock&&tl===T.FLOOR&&((ty===0&&(tx===7||tx===8))||(ty===RO-1&&(tx===7||tx===8))||(tx===0&&(ty===5||ty===6))||(tx===CO-1&&(ty===5||ty===6))))return true;
  if(s.loc.ty==="ow"){const npcs=NPC_DATA[s.loc.scr];if(npcs){for(const npc of npcs){if(tx===npc.tx&&ty===npc.ty)return true;}}}
  if(tl===T.DOOR||tl===T.BOSS_DOOR){const dk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${tx},${ty}`;
    if(s.dr.has(dk))return false;
    if(tl===T.BOSS_DOOR){if(s.p.masterKey[s.loc.di]){s.dr.add(dk);s.msg={text:"Master key used! Boss door opened!",t:1500};sfx("door");
      s.pt.push(...Array.from({length:12},()=>({x:tx*TL+16,y:ty*TL+16,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:600,c:Math.random()>.5?"#c070ff":"#fd3"})));return false;}
      s.msg={text:"Locked! Find the Master Key...",t:1500};return true;}
    if(s.p.keys>0){s.p.keys--;s.dr.add(dk);s.msg={text:"Door opened!",t:1500};sfx("door");
      s.pt.push(...Array.from({length:8},()=>({x:tx*TL+16,y:ty*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:500,c:"#fd3"})));return false;}return true;}
  return false;}

function eSolid(s,tx,ty){const m=gm(s);if(!m||tx<0||tx>=CO||ty<0||ty>=RO)return true;return SOLID.has(m[ty][tx])||m[ty][tx]===T.DOOR||m[ty][tx]===T.BOSS_DOOR;}

function cPk(s){const p=s.p,m=gm(s);if(!m)return;const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const tx=ptx+dx,ty=pty+dy;if(ty<0||ty>=RO||tx<0||tx>=CO)continue;
    const tl=m[ty][tx],pk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${tx},${ty}`;if(s.pk.has(pk))continue;
    const cx=tx*TL,cy=ty*TL;if(!(p.x<cx+TL&&p.x+PS>cx&&p.y<cy+TL&&p.y+PS>cy))continue;
    if(tl===T.RUPEE){s.pk.add(pk);p.rupees+=5;s.msg={text:"Got rupees!",t:1000};sfx("pickup");s.pt.push(...Array.from({length:6},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:600,c:"#4f4"})));}
    else if(tl===T.MASTER_KEY){s.pk.add(pk);if(s.loc.di>=0)p.masterKey[s.loc.di]=true;s.msg={text:"Got the Master Key!",t:2000};sfx("pickup");s.shake.t=300;
      s.pt.push(...Array.from({length:12},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:800,c:Math.random()>.5?"#c070ff":"#ffd633"})));}
    else if(tl===T.KEY){s.pk.add(pk);p.keys++;s.msg={text:"Got a key!",t:1500};sfx("pickup");s.pt.push(...Array.from({length:6},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:600,c:"#fd3"})));}
    else if(tl===T.BOMB){s.pk.add(pk);p.bombs+=3;s.msg={text:"Got bombs!",t:1500};sfx("pickup");s.pt.push(...Array.from({length:6},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:600,c:"#88f"})));}
    else if(tl===T.HEART_PIECE){s.pk.add(pk);p.heartPieces++;sfx("pickup");
      if(p.heartPieces>=4){p.heartPieces=0;p.mhp+=2;p.hp=p.mhp;sfx("triforce");s.shake.t=400;s.msg={text:"Heart Piece (4/4)! New heart container!",t:2500};}
      else{s.msg={text:`Heart Piece (${p.heartPieces}/4)`,t:2000};}
      s.pt.push(...Array.from({length:10},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:600,c:Math.random()>.5?"#ff3366":"#ffd633"})));}
    else if(tl===T.BOW){s.pk.add(pk);p.hasBow=true;sfx("triforce");s.shake.t=400;s.msg={text:"Got the Bow! Press C to shoot (costs 1 rupee)",t:3000};
      s.pt.push(...Array.from({length:15},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:800,c:Math.random()>.5?"#fd3":"#a06820"})));}
    else if(tl===T.BOMB_BAG){s.pk.add(pk);p.hasBombs=true;p.bombs+=5;sfx("triforce");s.shake.t=400;s.msg={text:"Got Bomb Bag! Press B to place bombs",t:3000};
      s.pt.push(...Array.from({length:15},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:800,c:Math.random()>.5?"#88f":"#f80"})));}
    else if(tl===T.MASTER_SWORD){s.pk.add(pk);p.hasMasterSword=true;sfx("triforce");s.shake.t=600;s.freeze=500;s.msg={text:"Master Sword! Double damage!",t:3000};
      s.pt.push(...Array.from({length:20},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*6,dy:(Math.random()-.5)*6,l:1000,c:Math.random()>.5?"#8af":"#fff"})));}
    else if(tl===T.HEART){s.pk.add(pk);p.hp=Math.min(p.hp+2,p.mhp);s.msg={text:"Heart restored!",t:1500};sfx("pickup");s.pt.push(...Array.from({length:6},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*3,dy:-Math.random()*2,l:500,c:"#f66"})));}
    else if(tl===T.TRIFORCE){s.pk.add(pk);p.tri[s.loc.di]=true;const c2=p.tri.filter(Boolean).length;sfx("triforce");
      s.pt.push(...Array.from({length:20},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:1000,c:"#fd3"})));
      if(c2>=3){s.won=true;s.msg={text:"All Triforce pieces! YOU WIN!",t:99999};}else s.msg={text:`Triforce piece ${c2}/3!`,t:2500};}}}

function cTr(s){const p=s.p,loc=s.loc;
  if(loc.ty==="ow"){
    if(s.ec<=0){
      for(const ent of DE){if(ent.s!==loc.scr)continue;
        if(ent.d===3&&!s.finalOpen)continue;
        for(const[tx,ty]of ent.t){if(p.x<tx*TL+TL&&p.x+PS>tx*TL&&p.y<ty*TL+TL&&p.y+PS>ty*TL){
          loc.ty="dg";loc.di=ent.d;const dg=s.dg[ent.d];let er="0,0";for(const rk of Object.keys(dg.rooms))if(dg.rooms[rk].tiles.some(r=>r.includes(T.STAIRS_UP))){er=rk;break;}
          s.respawn={ty:"dg",scr:er,di:ent.d,x:7*TL,y:9*TL};
          loc.scr=er;p.x=7*TL;p.y=9*TL;le(s);s.dgTitle={text:dg.name,t:3000};return;}}}
      for(let ci=0;ci<CAVES.length;ci++){const cv=CAVES[ci];if(cv.s!==loc.scr)continue;
        const owm=OW[loc.scr];
        for(const[tx,ty]of cv.t){if(owm&&owm[ty][tx]!==T.ENTRANCE)continue;if(p.x<tx*TL+TL&&p.x+PS>tx*TL&&p.y<ty*TL+TL&&p.y+PS>ty*TL){
          loc.ty="cave";loc.di=ci;loc.scr="0";p.x=7*TL;p.y=2*TL;s.ec=500;le(s);s.msg={text:"Hidden Cave!",t:1500};sfx("door");return;}}}
    }
    const[sx,sy]=loc.scr.split(",").map(Number);
    if(p.x<-4){const ns=`${sx-1},${sy}`;if(OW[ns]){const ps=loc.scr;loc.scr=ns;p.x=W2-PS-8;le(s);s.slide={a:true,dx:-1,dy:0,t:0,dur:200,prevScr:ps};}else p.x=-4;}
    if(p.x>W2-PS+4){const ns=`${sx+1},${sy}`;if(OW[ns]){const ps=loc.scr;loc.scr=ns;p.x=8;le(s);s.slide={a:true,dx:1,dy:0,t:0,dur:200,prevScr:ps};}else p.x=W2-PS+4;}
    if(p.y<-4){const ns=`${sx},${sy-1}`;if(OW[ns]){const ps=loc.scr;loc.scr=ns;p.y=H2-PS-8;le(s);s.slide={a:true,dx:0,dy:-1,t:0,dur:200,prevScr:ps};}else p.y=-4;}
    if(p.y>H2-PS+4){const ns=`${sx},${sy+1}`;if(OW[ns]){const ps=loc.scr;loc.scr=ns;p.y=8;le(s);s.slide={a:true,dx:0,dy:1,t:0,dur:200,prevScr:ps};}else p.y=H2-PS+4;}
  }else if(loc.ty==="cave"){const m=gm(s);const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);
    if(!s.combatLock&&m&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO&&m[pty][ptx]===T.STAIRS_UP){
      const cv=CAVES[loc.di];loc.ty="ow";loc.scr=cv.s;loc.di=-1;
      p.x=cv.t[0][0]*TL;p.y=(cv.t[0][1]+2)*TL;s.ec=500;le(s);return;}
  }else{const[rx,ry]=loc.scr.split(",").map(Number),m=gm(s);
    const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);
    if(!s.combatLock&&m&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO&&m[pty][ptx]===T.STAIRS_UP){
      const ent=DE[loc.di];loc.ty="ow";loc.scr=ent.s;loc.di=-1;
      const mxTy=Math.max(...ent.t.map(t2=>t2[1]));p.x=ent.t[0][0]*TL;p.y=(mxTy+2)*TL;s.ec=500;le(s);return;}
    const dg=s.dg[loc.di];
    if(s.combatLock){// Block exits during combat lock
      if(p.y<2)p.y=2;if(p.y>H2-PS-2)p.y=H2-PS-2;if(p.x<2)p.x=2;if(p.x>W2-PS-2)p.x=W2-PS-2;
    }else{
    if(p.y<-4){const ns=`${rx},${ry-1}`;if(dg.rooms[ns]){const ps=loc.scr;loc.scr=ns;p.y=H2-TL-PS-4;le(s);s.slide={a:true,dx:0,dy:-1,t:0,dur:200,prevScr:ps};}else p.y=-4;}
    if(p.y>H2-PS+4){const ns=`${rx},${ry+1}`;if(dg.rooms[ns]){const ps=loc.scr;loc.scr=ns;p.y=TL+4;le(s);s.slide={a:true,dx:0,dy:1,t:0,dur:200,prevScr:ps};}else p.y=H2-PS+4;}
    if(p.x<-4){const ns=`${rx-1},${ry}`;if(dg.rooms[ns]){const ps=loc.scr;loc.scr=ns;p.x=W2-TL-PS-4;le(s);s.slide={a:true,dx:-1,dy:0,t:0,dur:200,prevScr:ps};}else p.x=-4;}
    if(p.x>W2-PS+4){const ns=`${rx+1},${ry}`;if(dg.rooms[ns]){const ps=loc.scr;loc.scr=ns;p.x=TL+4;le(s);s.slide={a:true,dx:1,dy:0,t:0,dur:200,prevScr:ps};}else p.x=W2-PS+4;}}}
  saveGame(s);}

function upd(dt){const s=stR.value;if(!s||s.title||s.paused)return;s.gt+=dt;
  // Freeze gameplay during chest presentation
  if(s.chest&&s.chest.state==="presenting"){s.chest.t+=dt;s.chest.itemY=Math.min(40,(s.chest.itemY||0)+2.5*(dt/16));
    if(s.chest.t>=1500){s.chest.state="open";s.chest.t=0;
      if(s.chest.reward){s.drops.push({x:s.chest.x+12,y:s.chest.y-(s.chest.itemY||0),vy:-1,ground:s.chest.y,type:s.chest.reward,t:0});}
      s.msg={text:"Treasure!",t:1500};}
    // Still update particles during freeze
    for(let i=s.pt.length-1;i>=0;i--){const pt=s.pt[i];pt.x+=pt.dx*(dt/16);pt.y+=pt.dy*(dt/16);pt.l-=dt;if(pt.l<=0)s.pt.splice(i,1);}
    return;}
  if(s.npcTalk){
    s.npcTalk.timer+=dt;
    s.npcTalk.charIdx=Math.min(s.npcTalk.lines[s.npcTalk.idx].length,Math.floor(s.npcTalk.timer/30));
    const ky=kyR.value;
    if(ky.has(" ")||ky.has("enter")||ky.has("e")||ky.has("z")||s.respawnClick){
      s.respawnClick=false;
      if(s.npcTalk.charIdx>=s.npcTalk.lines[s.npcTalk.idx].length){
        s.npcTalk.idx++;
        if(s.npcTalk.idx>=s.npcTalk.lines.length){s.npcTalk=null;}
        else{s.npcTalk.charIdx=0;s.npcTalk.timer=0;}
      }else{s.npcTalk.charIdx=s.npcTalk.lines[s.npcTalk.idx].length;s.npcTalk.timer=99999;}
      ky.delete(" ");ky.delete("enter");ky.delete("e");ky.delete("z");
    }
    return;
  }
  if(s.freeze>0){s.freeze-=dt;return;}
  if(s.death.a){s.death.t+=dt;s.death.spin+=dt*0.015;if(s.death.t>1500&&!s.go){s.go=true;s.msg={text:"Tap to respawn",t:99999};}if(!s.go)return;}
  if(s.go||s.won){if(kyR.value.has("r")||s.respawnClick){s.respawnClick=false;
    if(s.won){stR.value=init();stR.value.title=false;le(stR.value);return;}
    const old=s;const ns=init();ns.title=false;ns.p.keys=old.p.keys;ns.p.bombs=old.p.bombs;ns.p.rupees=old.p.rupees;ns.p.tri=[...old.p.tri];ns.p.masterKey=[...old.p.masterKey];ns.p.mhp=old.p.mhp;ns.p.hp=ns.p.mhp;ns.p.heartPieces=old.p.heartPieces;ns.p.hasBow=old.p.hasBow;ns.p.hasBombs=old.p.hasBombs;ns.p.hasMasterSword=old.p.hasMasterSword;
    ns.pk=old.pk;ns.dr=old.dr;ns.cl=old.cl;ns.dg=old.dg;ns.heartContainers=[...old.heartContainers];ns.finalOpen=old.finalOpen;
    ns.loc.ty=old.respawn.ty;ns.loc.scr=old.respawn.scr;ns.loc.di=old.respawn.di;ns.p.x=old.respawn.x;ns.p.y=old.respawn.y;
    stR.value=ns;le(ns);saveGame(ns);}return;}
  if(s.fade.a){s.fade.t+=dt;s.fade.alpha=Math.min(1,s.fade.t/250);
    if(s.fade.alpha>=1&&s.fade.cb){s.fade.cb();s.fade.cb=null;s.fade.dir=-1;s.fade.t=0;}
    if(s.fade.dir===-1){s.fade.alpha=Math.max(0,1-s.fade.t/250);if(s.fade.alpha<=0)s.fade.a=false;}return;}
  if(s.slide.a){s.slide.t+=dt;if(s.slide.t>=s.slide.dur)s.slide.a=false;return;}
  if(s.shake.t>0){s.shake.t-=dt;const intensity=s.shake.t/300*4;s.shake.x=(Math.random()-.5)*intensity;s.shake.y=(Math.random()-.5)*intensity;}
  else{s.shake.x=0;s.shake.y=0;}
  if(s.p.hp<=2)s.lowHp+=dt;else s.lowHp=0;

  const ky=kyR.value,p=s.p,tc=tcR.value;let dx=0,dy=0;
  if(ky.has("arrowup")||ky.has("w")){dy=-1;p.dir=0;}if(ky.has("arrowdown")||ky.has("s")){dy=1;p.dir=2;}
  if(ky.has("arrowleft")||ky.has("a")){dx=-1;p.dir=3;}if(ky.has("arrowright")||ky.has("d")){dx=1;p.dir=1;}
  if(tc.dir==="up"){dy=-1;p.dir=0;}if(tc.dir==="down"){dy=1;p.dir=2;}
  if(tc.dir==="left"){dx=-1;p.dir=3;}if(tc.dir==="right"){dx=1;p.dir=1;}
  if(dx&&dy){dx*=.707;dy*=.707;}
  const shieldUp=(ky.has("x")||ky.has("shift"))&&!s.sw.a;
  s.p.shield=shieldUp;
  if(shieldUp){dx*=0.4;dy*=0.4;}
  const fzMult=p.freeze>0?0.4:1.0;const sp=p.spd*fzMult*(dt/16);
  const HB={x:6,y:4,w:PS-12,h:PS-4};
  const tm=(px2,py2)=>{const l=Math.floor((px2+HB.x)/TL),r=Math.floor((px2+HB.x+HB.w-1)/TL),t2=Math.floor((py2+HB.y)/TL),b=Math.floor((py2+HB.y+HB.h-1)/TL);
    for(let ty=t2;ty<=b;ty++)for(let tx=l;tx<=r;tx++)if(iS(s,tx,ty))return false;return true;};
  // Safety: if player is stuck inside a wall, push them out
  if(!tm(p.x,p.y)){const cx=Math.floor((p.x+PS/2)/TL)*TL+TL/2-PS/2,cy=Math.floor((p.y+PS/2)/TL)*TL+TL/2-PS/2;
    for(let r=1;r<=3;r++){for(const[ox,oy]of[[0,-1],[0,1],[-1,0],[1,0]]){if(tm(cx+ox*TL*r,cy+oy*TL*r)){p.x=cx+ox*TL*r;p.y=cy+oy*TL*r;break;}}if(tm(p.x,p.y))break;}}
  const moved=dx!==0||dy!==0;
  if(tm(p.x+dx*sp,p.y+dy*sp)){p.x+=dx*sp;p.y+=dy*sp;}
  else{if(tm(p.x+dx*sp,p.y))p.x+=dx*sp;if(tm(p.x,p.y+dy*sp))p.y+=dy*sp;}
  if(moved&&dx!==0&&!tm(p.x+dx*sp*2,p.y)){const cy=p.y+HB.y+HB.h/2,tcy=Math.round(cy/TL)*TL;const off=cy-tcy;
    if(Math.abs(off)<10&&tm(p.x+dx*sp,p.y-Math.sign(off)*2))p.y-=Math.sign(off)*1.5*(dt/16);}
  if(moved&&dy!==0&&!tm(p.x,p.y+dy*sp*2)){const cx=p.x+HB.x+HB.w/2,tcx=Math.round(cx/TL)*TL;const off=cx-tcx;
    if(Math.abs(off)<10&&tm(p.x-Math.sign(off)*2,p.y+dy*sp))p.x-=Math.sign(off)*1.5*(dt/16);}
  // Footstep particles by terrain
  if(moved&&s.gt%6<2){const ftx2=Math.floor((p.x+PS/2)/TL),fty2=Math.floor((p.y+PS-2)/TL),mp3=gm(s);
    if(mp3&&fty2>=0&&fty2<RO&&ftx2>=0&&ftx2<CO){const ft=mp3[fty2][ftx2],fx=p.x+PS/2+(Math.random()-.5)*6,fy=p.y+PS-2;
      if(ft===T.GRASS||ft===T.TALLGRASS||ft===T.FLOWER)s.pt.push({x:fx,y:fy,dx:(Math.random()-.5)*1.5,dy:-Math.random()*1.2,l:250,c:Math.random()>.5?"#5a5":"#7b7"});
      else if(ft===T.SAND)s.pt.push({x:fx,y:fy,dx:(Math.random()-.5)*2,dy:-Math.random()*0.8,l:300,c:Math.random()>.5?"#d4b060":"#c8a848"});
      else if(ft===T.WATER||ft===T.BRIDGE)s.pt.push({x:fx,y:fy,dx:(Math.random()-.5)*2,dy:-Math.random()*1.5,l:200,c:Math.random()>.5?"#6af":"#8cf"});
      else if(ft===T.ICE)s.pt.push({x:fx,y:fy,dx:(Math.random()-.5)*2.5,dy:-Math.random()*1,l:300,c:Math.random()>.5?"#cef":"#fff"});
      else if(ft===T.PATH)s.pt.push({x:fx,y:fy,dx:(Math.random()-.5)*1,dy:-Math.random()*0.5,l:200,c:"#8a7050"});
      else if(ft===T.FLOOR&&s.loc.ty!=="ow")s.pt.push({x:fx,y:fy,dx:(Math.random()-.5)*1,dy:-Math.random()*0.5,l:200,c:"rgba(150,150,150,0.5)"});}}
  if(p.burn>0){p.burn-=dt;p.burnTick+=dt;if(p.burnTick>=500){p.burnTick=0;if(p.ifr<=0){p.hp--;sfx("hurt");
    s.pt.push(...Array.from({length:3},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*2,dy:-Math.random()*2,l:400,c:"#f80"})));
    if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}}}
  if(p.poison>0){p.poison-=dt;p.poisonTick+=dt;if(p.poisonTick>=600){p.poisonTick=0;if(p.ifr<=0&&p.hp>1){p.hp--;sfx("hurt");
    s.pt.push(...Array.from({length:3},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*2,dy:-Math.random()*2,l:400,c:"#4a2"})));
    }}}
  if(p.freeze>0){p.freeze-=dt;}
  const spdMult=p.freeze>0?0.4:1.0;
  {const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);const m2=gm(s);
    if(m2&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO&&m2[pty][ptx]===T.ICE){
      if(!s.iceSlide.active&&(dx!==0||dy!==0)){s.iceSlide={active:true,dx:dx>0?1:dx<0?-1:0,dy:dy>0?1:dy<0?-1:0};}
      if(s.iceSlide.active){const isp=sp*1.1;const nx=p.x+s.iceSlide.dx*isp,ny=p.y+s.iceSlide.dy*isp;
        if(tm(nx,ny)){p.x=nx;p.y=ny;}else{s.iceSlide.active=false;s.iceSlide.dx=0;s.iceSlide.dy=0;}}
    }else{s.iceSlide.active=false;s.iceSlide.dx=0;s.iceSlide.dy=0;}}
  {const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);const m2=gm(s);
    if(m2&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO&&m2[pty][ptx]===T.TSWITCH){
      const tk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:tswitch`;
      if(!s.timedDoors.find(td=>td.key===tk)){
        sfx("pickup");s.msg={text:"Timed switch! Hurry!",t:1500};s.shake.t=200;
        for(let yy=0;yy<RO;yy++)for(let xx=0;xx<CO;xx++){if(m2[yy][xx]===T.DOOR){
          const dk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${xx},${yy}`;s.dr.add(dk);
          s.pt.push(...Array.from({length:4},()=>({x:xx*TL+16,y:yy*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:400,c:"#fd3"})));}}
        s.timedDoors.push({key:tk,t:5000,scr:s.loc.scr,di:s.loc.di,ty:s.loc.ty});}}}
  for(let i=s.timedDoors.length-1;i>=0;i--){const td=s.timedDoors[i];td.t-=dt;
    if(td.t<=0){const m2=td.ty==="dg"?s.dg[td.di]?.rooms[td.scr]?.tiles:null;
      if(m2){for(let yy=0;yy<RO;yy++)for(let xx=0;xx<CO;xx++){if(m2[yy][xx]===T.DOOR){
        const dk=`${td.ty}:${td.di}:${td.scr}:${xx},${yy}`;s.dr.delete(dk);}}}
      s.timedDoors.splice(i,1);sfx("door");}}
  {const m2=gm(s);if(m2){
    const pcx=Math.floor((p.x+PS/2)/TL),pcy=Math.floor((p.y+PS/2)/TL);
    const ftx=pcx+(p.dir===1?1:p.dir===3?-1:0),fty=pcy+(p.dir===0?-1:p.dir===2?1:0);
    if(ftx>=0&&ftx<CO&&fty>=0&&fty<RO){const ft=m2[fty][ftx];
      if(ft===T.DOOR||ft===T.BOSS_DOOR){const dk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${ftx},${fty}`;
        if(!s.dr.has(dk)){
          if(ft===T.BOSS_DOOR){if(p.masterKey[s.loc.di]){s.dr.add(dk);sfx("door");s.msg={text:"Master key used! Boss door opened!",t:1500};
            s.pt.push(...Array.from({length:12},()=>({x:ftx*TL+16,y:fty*TL+16,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:600,c:Math.random()>.5?"#c070ff":"#fd3"})));}
            else{s.msg={text:"Locked! Find the Master Key...",t:1500};}}
          else if(p.keys>0){p.keys--;s.dr.add(dk);sfx("door");s.msg={text:"Door opened!",t:1500};
            s.pt.push(...Array.from({length:8},()=>({x:ftx*TL+16,y:fty*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:500,c:"#fd3"})));}}}}
  }}
  if(moved){const m2=gm(s);if(m2){
    const pcx=Math.floor((p.x+PS/2)/TL),pcy=Math.floor((p.y+PS/2)/TL);
    const ftx=pcx+(dx>0?1:dx<0?-1:0),fty=pcy+(dy>0?1:dy<0?-1:0);
    if(ftx>=0&&ftx<CO&&fty>=0&&fty<RO&&m2[fty][ftx]===T.PUSH&&!s.pushCd){
      const bx=ftx+(dx>0?1:dx<0?-1:0),by=fty+(dy>0?1:dy<0?-1:0);
      if(bx>=0&&bx<CO&&by>=0&&by<RO&&!SOLID.has(m2[by][bx])&&m2[by][bx]!==T.DOOR&&m2[by][bx]!==T.BOSS_DOOR){
        const wasPlate=m2[by][bx]===T.PLATE;
        m2[by][bx]=T.PUSH;m2[fty][ftx]=T.FLOOR;
        s.pushCd=true;setTimeout(()=>{if(stR.value)stR.value.pushCd=false;},300);
        sfx("door");s.pt.push(...Array.from({length:4},()=>({x:ftx*TL+16,y:fty*TL+16,dx:(Math.random()-.5)*2,dy:(Math.random()-.5)*2,l:300,c:"#aaa"})));
        if(wasPlate){sfx("pickup");s.msg={text:"Something opened!",t:1500};s.shake.t=200;
          let opened=false;
          for(let yy=0;yy<RO;yy++)for(let xx=0;xx<CO;xx++){if(m2[yy][xx]===T.DOOR){
            const dk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${xx},${yy}`;s.dr.add(dk);opened=true;
            s.pt.push(...Array.from({length:6},()=>({x:xx*TL+16,y:yy*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:500,c:"#fd3"})));}}
          if(!opened){m2[5][7]=T.KEY;s.pt.push(...Array.from({length:8},()=>({x:7*TL+16,y:5*TL+16,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:600,c:"#fd3"})));}}
      }}}}
  if(s.sw.a&&s.sw.t>SD*0.5){const m2=gm(s);if(m2&&!s.leverCd){
    const pcx=Math.floor((p.x+PS/2)/TL),pcy=Math.floor((p.y+PS/2)/TL);
    const ftx=pcx+(p.dir===1?1:p.dir===3?-1:0),fty=pcy+(p.dir===0?-1:p.dir===2?1:0);
    if(ftx>=0&&ftx<CO&&fty>=0&&fty<RO&&m2[fty][ftx]===T.LEVER){
      m2[fty][ftx]=T.FLOOR;s.leverCd=true;setTimeout(()=>{if(stR.value)stR.value.leverCd=false;},1000);
      sfx("pickup");s.msg={text:"Lever pulled!",t:1500};s.shake.t=200;
      s.pt.push(...Array.from({length:8},()=>({x:ftx*TL+16,y:fty*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:500,c:"#f88"})));
      let opened=false;
      for(let yy=0;yy<RO;yy++)for(let xx=0;xx<CO;xx++){if(m2[yy][xx]===T.DOOR){
        const dk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${xx},${yy}`;s.dr.add(dk);opened=true;
        s.pt.push(...Array.from({length:6},()=>({x:xx*TL+16,y:yy*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:500,c:"#fd3"})));}}
      if(!opened){m2[5][8]=T.KEY;s.pt.push(...Array.from({length:8},()=>({x:8*TL+16,y:5*TL+16,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:600,c:"#fd3"})));}}}}
  {const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);const m2=gm(s);
    if(m2&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO){
      if(m2[pty][ptx]===T.SPIKE&&Math.sin(s.gt/750)>0&&p.ifr<=0){p.hp--;p.ifr=IFR;sfx("hurt");s.shake.t=200;
        s.pt.push(...Array.from({length:3},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*2,dy:(Math.random()-.5)*2,l:300,c:"#888"})));
        if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}
      if(m2[pty][ptx]===T.PIT&&p.ifr<=0){p.hp--;p.ifr=IFR;sfx("hurt");s.shake.t=400;
        s.pt.push(...Array.from({length:8},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:500,c:"#444"})));
        let ex=7*TL,ey=9*TL;
        for(let ty2=RO-1;ty2>=0;ty2--)for(let tx2=0;tx2<CO;tx2++){if(m2[ty2][tx2]===T.STAIRS_UP||m2[ty2][tx2]===T.FLOOR&&ty2>8){ex=tx2*TL;ey=ty2*TL;ty2=-1;break;}}
        p.x=ex;p.y=ey;s.msg={text:"Fell into a pit!",t:1000};
        if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}}}
  {const m2=gm(s);const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);
    if(s.loc.ty==="ow"&&s.loc.scr==="0,1"&&m2&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO&&m2[pty][ptx]===T.TALLGRASS&&p.poison<=0){
      p.poison=3000;p.poisonTick=0;s.msg={text:"Poisonous swamp!",t:1000};}}
  if(moved&&Math.random()<0.15){const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);const m2=gm(s);
    if(m2&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO){const ft=m2[pty][ptx];
      if(ft===T.PATH||ft===T.SAND)s.pt.push({x:p.x+PS/2+(Math.random()-0.5)*6,y:p.y+PS-2,dx:(Math.random()-.5)*0.5,dy:-Math.random()*0.8,l:400,c:ft===T.SAND?"#c8b060":"#a89060"});}}
  if((ky.has(" ")||ky.has("z")||tc.atk)&&!s.sw.a){
    let npcHit=false;
    if(s.loc.ty==="ow"&&!s.npcTalk){const npcs=NPC_DATA[s.loc.scr];if(npcs){
      const pcx2=Math.floor((p.x+PS/2)/TL),pcy2=Math.floor((p.y+PS/2)/TL);
      const ftx2=pcx2+(p.dir===1?1:p.dir===3?-1:0),fty2=pcy2+(p.dir===0?-1:p.dir===2?1:0);
      for(const npc of npcs){if(Math.abs(ftx2-npc.tx)<=1&&Math.abs(fty2-npc.ty)<=1){
        s.npcTalk={name:npc.name,lines:npc.lines,idx:0,charIdx:0,timer:0};sfx("pickup");npcHit=true;break;}}}}
    if(!npcHit){s.sw.a=true;s.sw.t=SD;sfx("sword");
      // Light torches with sword
      if(s.loc.ty==="dg"||s.loc.ty==="cave"){const m2=gm(s);
        const ftx3=Math.floor((p.x+PS/2)/TL)+(p.dir===1?1:p.dir===3?-1:0);
        const fty3=Math.floor((p.y+PS/2)/TL)+(p.dir===0?-1:p.dir===2?1:0);
        const tk=`${ftx3},${fty3}`;
        if(m2&&fty3>=0&&fty3<RO&&ftx3>=0&&ftx3<CO&&m2[fty3][ftx3]===T.TORCH&&!s.litTorches.has(tk)){
          s.litTorches.add(tk);sfx("pickup");
          s.pt.push(...Array.from({length:8},()=>({x:ftx3*TL+16,y:fty3*TL+16,dx:(Math.random()-.5)*3,dy:-Math.random()*3,l:500,c:Math.random()>.5?"#f80":"#fd3"})));
          // Check if all torches are now lit
          let allLit=true,totalT=0;
          for(let yy=0;yy<RO;yy++)for(let xx=0;xx<CO;xx++)if(m2[yy][xx]===T.TORCH){totalT++;if(!s.litTorches.has(`${xx},${yy}`))allLit=false;}
          if(allLit&&totalT>0){sfx("triforce");s.shake.t=300;s.roomFlash=500;s.msg={text:"All torches lit!",t:1500};
            // Open any locked doors in the room
            for(let yy=0;yy<RO;yy++)for(let xx=0;xx<CO;xx++)if(m2[yy][xx]===T.DOOR){
              const dk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${xx},${yy}`;s.dr.add(dk);
              s.pt.push(...Array.from({length:6},()=>({x:xx*TL+16,y:yy*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:500,c:"#fd3"})));}}
        }}
    }}if(tc.atk)tc.atk=false;
  if(ky.has("b")&&p.hasBombs&&p.bombs>0&&!s.bombCd&&s.activeBombs.length<2){
    const ftx=Math.floor((p.x+PS/2)/TL)+(p.dir===1?1:p.dir===3?-1:0);
    const fty=Math.floor((p.y+PS/2)/TL)+(p.dir===0?-1:p.dir===2?1:0);
    p.bombs--;s.bombCd=true;setTimeout(()=>{if(stR.value)stR.value.bombCd=false;},800);
    s.activeBombs.push({x:ftx*TL+TL/2,y:fty*TL+TL/2,t:0,fuse:1500,exploded:false});sfx("pickup");
  }
  if((ky.has("c"))&&p.hasBow&&!s.bowCd&&p.rupees>0&&s.pArrows.length<3){
    p.rupees--;s.bowCd=true;setTimeout(()=>{if(stR.value)stR.value.bowCd=false;},400);
    sfx("sword");
    const adx=p.dir===1?5:p.dir===3?-5:0,ady=p.dir===0?-5:p.dir===2?5:0;
    s.pArrows.push({x:p.x+PS/2,y:p.y+PS/2,dx:adx,dy:ady,l:800});
  }
  if(s.sw.a){s.sw.t-=dt;if(s.sw.t<=0)s.sw.a=false;}if(p.ifr>0)p.ifr-=dt;
  for(let i=s.pt.length-1;i>=0;i--){const pt=s.pt[i];pt.x+=pt.dx*(dt/16);pt.y+=pt.dy*(dt/16);pt.l-=dt;if(pt.l<=0)s.pt.splice(i,1);}
  for(let i=s.dmgNums.length-1;i>=0;i--){const dn=s.dmgNums[i];dn.y-=1.2*(dt/16);dn.t-=dt;if(dn.t<=0)s.dmgNums.splice(i,1);}
  if(s.roomFlash>0)s.roomFlash-=dt;
  for(let i=s.drops.length-1;i>=0;i--){const d2=s.drops[i];d2.t+=dt;
    if(d2.type==="triforce"){
      // Slow descent with gentle gravity cap
      d2.vy=Math.min(d2.vy+0.02*(dt/16),0.8);d2.y+=d2.vy*(dt/16);
      if(d2.spin!=null)d2.spin+=2.5*(dt/16);
      if(d2.y>d2.ground){d2.y=d2.ground;d2.vy=0;}
      // Trailing sparkles during fall
      if(d2.y<d2.ground&&d2.t%3<1)s.pt.push({x:d2.x+(Math.random()-.5)*10,y:d2.y+8,dx:(Math.random()-.5)*1.5,dy:Math.random()*0.5,l:400,c:Math.random()>.5?"#fd3":"#fff"});
    }else{d2.y+=d2.vy*(dt/16);d2.vy+=0.15*(dt/16);
    if(d2.y>d2.ground){d2.y=d2.ground;d2.vy*=-0.5;if(Math.abs(d2.vy)<0.3)d2.vy=0;}}
    const mdx=p.x+PS/2-d2.x,mdy=p.y+PS/2-d2.y,mdist=Math.hypot(mdx,mdy);
    if(d2.type==="triforce"&&d2.y<d2.ground){/* no magnet pull while falling */}
    else if(mdist<40&&mdist>1){const pull=2.5*(1-mdist/40);d2.x+=mdx/mdist*pull*(dt/16);d2.y+=mdy/mdist*pull*(dt/16);}
    if(Math.abs(p.x+PS/2-d2.x)<14&&Math.abs(p.y+PS/2-d2.y)<14){
      if(d2.type==="heart"){p.hp=Math.min(p.hp+1,p.mhp);sfx("pickup");}
      else if(d2.type==="bomb"){p.bombs++;sfx("pickup");}
      else if(d2.type==="rupee_green"){p.rupees+=1;sfx("pickup");}
      else if(d2.type==="rupee_blue"){p.rupees+=5;sfx("pickup");}
      else if(d2.type==="rupee_red"){p.rupees+=20;sfx("pickup");}
      else if(d2.type==="heartcontainer"){p.mhp+=2;p.hp=p.mhp;sfx("triforce");s.msg={text:"Heart Container! Max HP up!",t:2500};}
      else if(d2.type==="triforce"){p.tri[s.loc.di]=true;sfx("triforce");s.shake.t=500;s.triMu=false;
        const tc2=p.tri.filter(Boolean).length;
        if(tc2>=3&&!s.finalOpen){s.finalOpen=true;s.msg={text:"The Dark Sanctum has opened!",t:3000};
          const fm=OW["3,2"];if(fm){fm[5][7]=T.ENTRANCE;fm[5][8]=T.ENTRANCE;fm[6][7]=T.ENTRANCE;fm[6][8]=T.ENTRANCE;}
        }else{s.msg={text:`Triforce piece ${tc2}/3!`,t:2000};}
        s.pt.push(...Array.from({length:20},()=>({x:p.x+PS/2+(Math.random()-.5)*30,y:p.y+PS/2+(Math.random()-.5)*30,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:800,c:"#fd3"})));}
      s.drops.splice(i,1);continue;}
    if(d2.t>8000)s.drops.splice(i,1);}
  // Chest update — requires action button to open
  if(s.chest){const ch=s.chest;ch.t+=dt;const ky=kyR.value;
    if(ch.state==="closed"){const cdx=p.x+PS/2-(ch.x+12),cdy=p.y+PS/2-(ch.y+12);
      ch.near=Math.abs(cdx)<24&&Math.abs(cdy)<24;
      if(ch.near&&(ky.has(" ")||ky.has("enter")||ky.has("e")||ky.has("z"))){ch.state="opening";ch.t=0;sfx("door");s.shake.t=200;}}
    else if(ch.state==="opening"&&ch.t>=600){ch.state="presenting";ch.t=0;ch.itemY=0;sfx("triforce");
      s.pt.push(...Array.from({length:12},()=>({x:ch.x+12,y:ch.y+8,dx:(Math.random()-.5)*5,dy:-Math.random()*4-1,l:600,c:"#fd3"})));}
    else if(ch.state==="open"&&ch.t>2000)s.chest=null;}
  // Active bombs update
  for(let i=s.activeBombs.length-1;i>=0;i--){const b=s.activeBombs[i];b.t+=dt;
    if(b.t>=b.fuse&&!b.exploded){b.exploded=true;sfx("bomb");s.shake.t=500;
      // Explosion particles
      s.pt.push(...Array.from({length:25},()=>({x:b.x,y:b.y,dx:(Math.random()-.5)*8,dy:(Math.random()-.5)*8,l:800,c:["#fa3","#f83","#ff3","#fff","#aaa"][Math.random()*5|0]})));
      // Break nearby crack walls (2 tile radius)
      const mp2=gm(s),bx2=Math.floor(b.x/TL),by2=Math.floor(b.y/TL);
      for(let dy2=-2;dy2<=2;dy2++)for(let dx2=-2;dx2<=2;dx2++){const cx2=bx2+dx2,cy2=by2+dy2;
        if(mp2&&cy2>=0&&cy2<RO&&cx2>=0&&cx2<CO&&mp2[cy2][cx2]===T.CRACK){
          let isCave=false;
          if(s.loc.ty==="ow"){for(const cv of CAVES){if(cv.s===s.loc.scr){for(const[cvx,cvy]of cv.t){if(cvx===cx2&&cvy===cy2){isCave=true;break;}}if(isCave)break;}}}
          mp2[cy2][cx2]=isCave?T.ENTRANCE:T.FLOOR;
          s.msg={text:isCave?"A hidden cave!":(s.loc.ty==="dg"?"Bombed a wall! Secret passage!":"Secret passage!"),t:2000};}}
      // Damage nearby enemies (3 tile radius)
      const blastR=TL*3;
      for(const e of s.en){const ed=Math.hypot(e.x+ES/2-b.x,e.y+ES/2-b.y);
        if(ed<blastR){const bdmg=ed<TL?3:2;e.hp-=bdmg;e.fl=400;
          const ka=Math.atan2(e.y+ES/2-b.y,e.x+ES/2-b.x);e.x+=Math.cos(ka)*20;e.y+=Math.sin(ka)*20;
          s.dmgNums.push({x:e.x+ES/2,y:e.y-8,t:600,val:bdmg,c:"#f80"});}}
      // Hurt player if too close
      const pd=Math.hypot(p.x+PS/2-b.x,p.y+PS/2-b.y);
      if(pd<TL*1.5&&p.ifr<=0){p.hp--;p.ifr=IFR;sfx("hurt");s.shake.t=300;}
    }
    if(b.exploded&&b.t>=b.fuse+400)s.activeBombs.splice(i,1);}
  // Blade traps update
  for(const bt of s.bladeTraps){const pcx=p.x+PS/2,pcy=p.y+PS/2,bcx=bt.x+TL/2,bcy=bt.y+TL/2;
    if(bt.st==="idle"){bt.wait-=dt;if(bt.wait>0)continue;
      // Detect player in line of sight (same row or column, within range)
      if(bt.dir==="h"){if(Math.abs(pcy-bcy)<TL*0.8){
        const dx2=pcx-bcx;if(Math.abs(dx2)<bt.range+TL){bt.st="lunge";bt.vel=dx2>0?7:-7;}}}
      else{if(Math.abs(pcx-bcx)<TL*0.8){
        const dy2=pcy-bcy;if(Math.abs(dy2)<bt.range+TL){bt.st="lunge";bt.vel=dy2>0?7:-7;}}}}
    else if(bt.st==="lunge"){
      if(bt.dir==="h"){bt.x+=bt.vel*(dt/16);
        const d2=bt.x-bt.hx;if(Math.abs(d2)>=bt.range){bt.x=bt.hx+(d2>0?bt.range:-bt.range);bt.st="retract";bt.vel=0;}}
      else{bt.y+=bt.vel*(dt/16);
        const d2=bt.y-bt.hy;if(Math.abs(d2)>=bt.range){bt.y=bt.hy+(d2>0?bt.range:-bt.range);bt.st="retract";bt.vel=0;}}}
    else if(bt.st==="retract"){
      const dx3=bt.hx-bt.x,dy3=bt.hy-bt.y,dd=Math.hypot(dx3,dy3);
      if(dd<1){bt.x=bt.hx;bt.y=bt.hy;bt.st="idle";bt.wait=500;}
      else{const rsp=1.2*(dt/16);bt.x+=dx3/dd*rsp;bt.y+=dy3/dd*rsp;}}
    // Player collision
    if(p.ifr<=0&&Math.abs(pcx-bt.x-TL/2)<TL*0.7&&Math.abs(pcy-bt.y-TL/2)<TL*0.7){
      p.hp--;p.ifr=IFR;sfx("hurt");s.shake.t=300;
      const ka=Math.atan2(pcy-bcy,pcx-bcx);if(tm(p.x+Math.cos(ka)*12,p.y+Math.sin(ka)*12)){p.x+=Math.cos(ka)*12;p.y+=Math.sin(ka)*12;}
      if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}}
  const rk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}`;
  for(let i=s.en.length-1;i>=0;i--){const e=s.en[i];
    if(e.spawnT>0){e.spawnT-=dt;continue;}
    e.mt+=dt;if(e.fl>0)e.fl-=dt;
    const pcx=p.x+PS/2,pcy=p.y+PS/2,ecx=e.x+ES/2,ecy=e.y+ES/2,dist=Math.hypot(pcx-ecx,pcy-ecy);
    e.stT+=dt;const isBossLike=e.type==="boss"||e.type==="miniboss";
    const detectRange=isBossLike?250:120;const loseRange=180;
    if(e.st==="patrol"&&dist<detectRange)e.st="chase";
    if(e.st==="chase"&&dist>loseRange&&!isBossLike)e.st="retreat";
    if(e.st==="retreat"&&e.stT>2000){e.st="patrol";e.stT=0;}
    let es=e.type==="boss"?1.0:e.type==="miniboss"?1.2:e.type==="ghost"?1.3:(e.type==="bat"||e.type==="fire_bat")?1.2:e.type==="archer"?0.8:e.type==="mage"?0.6:e.type==="knight"?1.1:1.0;
    let moveX=0,moveY=0;
    if(e.st==="chase"||e.type==="boss"){const ang=Math.atan2(pcy-ecy,pcx-ecx);
      if(e.type==="ghost"||e.type==="bat"||e.type==="fire_bat"){const w=Math.sin(e.mt/250)*.6;moveX=Math.cos(ang+w)*es;moveY=Math.sin(ang+w)*es;}
      else if(e.type==="boss"){
        const ang2=Math.atan2(pcy-ecy,pcx-ecx);
        if(e.pattern==="charge"){const phase=Math.floor(e.mt/2000)%3;
          if(phase===2){const bsp=es*3;moveX=Math.cos(ang2)*bsp;moveY=Math.sin(ang2)*bsp;}
          else if(phase===1){moveX=0;moveY=0;
            if(Math.floor(e.mt/2000)!==Math.floor((e.mt-dt)/2000)){
              for(let a=0;a<4;a++){const ra=a*Math.PI/2;s.bProj.push({x:ecx,y:ecy,dx:Math.cos(ra)*2.5,dy:Math.sin(ra)*2.5,type:"root",l:800});}
              sfx("bomb");}}
          else{const bsp=es*0.6;moveX=Math.cos(ang2)*bsp;moveY=Math.sin(ang2)*bsp;}
        }else if(e.pattern==="spawn"){const ca=e.mt/800;moveX=Math.cos(ca)*es*1.2;moveY=Math.sin(ca)*es*1.2;
          if(Math.floor(e.mt/3000)!==Math.floor((e.mt-dt)/3000)&&s.en.length<8){
            s.en.push({x:e.x,y:e.y,hp:2,mhp:2,type:"fire_bat",fl:0,mt:0,st:"chase",stT:0,hx:e.x,hy:e.y});}
          if(Math.floor(e.mt/1500)!==Math.floor((e.mt-dt)/1500)){
            const fa=Math.atan2(pcy-ecy,pcx-ecx);s.bProj.push({x:ecx,y:ecy,dx:Math.cos(fa)*3,dy:Math.sin(fa)*3,type:"fire",l:1200});sfx("bomb");}
        }else if(e.pattern==="teleport"){const bsp=es*(1+Math.sin(e.mt/400)*.4);moveX=Math.cos(ang2)*bsp;moveY=Math.sin(ang2)*bsp;
          if(Math.floor(e.mt/4000)!==Math.floor((e.mt-dt)/4000)){
            e.x=TL*2+Math.random()*(W2-TL*4);e.y=TL*2+Math.random()*(H2-TL*4);
            for(let a=0;a<8;a++){const sa=a*Math.PI/4;s.bProj.push({x:e.x+ES/2,y:e.y+ES/2,dx:Math.cos(sa)*2,dy:Math.sin(sa)*2,type:"shadow",l:1000});}
            s.pt.push(...Array.from({length:8},()=>({x:e.x+ES/2,y:e.y+ES/2,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:400,c:"#a0a0ff"})));sfx("bomb");}
          if(Math.floor(e.mt/2000)!==Math.floor((e.mt-dt)/2000)){
            const sa=Math.atan2(pcy-ecy,pcx-ecx);s.bProj.push({x:ecx,y:ecy,dx:Math.cos(sa)*1.8,dy:Math.sin(sa)*1.8,type:"shadow",l:1500});}
        }else if(e.pattern==="all"){const phase=Math.floor(e.mt/3000)%4;
          if(phase===0){const bsp=es*2.5;moveX=Math.cos(ang2)*bsp;moveY=Math.sin(ang2)*bsp;}
          else if(phase===1){const ca=e.mt/600;moveX=Math.cos(ca)*es*1.5;moveY=Math.sin(ca)*es*1.5;
            if(Math.floor(e.mt/2500)!==Math.floor((e.mt-dt)/2500)&&s.en.length<6){
              s.en.push({x:e.x,y:e.y,hp:3,mhp:3,type:"ghost",fl:0,mt:0,st:"chase",stT:0,hx:e.x,hy:e.y});}}
          else if(phase===2){moveX=0;moveY=0;
            if(Math.floor(e.mt/3000)!==Math.floor((e.mt-dt)/3000)){
              e.x=TL*2+Math.random()*(W2-TL*4);e.y=TL*2+Math.random()*(H2-TL*4);}}
          else{const bsp=es*(1+Math.sin(e.mt/300)*.5);moveX=Math.cos(ang2)*bsp;moveY=Math.sin(ang2)*bsp;}
        }else{const bsp=es*(1+Math.sin(e.mt/400)*.4);moveX=Math.cos(ang2)*bsp;moveY=Math.sin(ang2)*bsp;}
      }else if(e.type==="archer"){
        if(dist<80){moveX=-Math.cos(ang)*es*1.5;moveY=-Math.sin(ang)*es*1.5;}
        else if(dist>160){moveX=Math.cos(ang)*es;moveY=Math.sin(ang)*es;}
        else{moveX=Math.cos(ang+Math.PI/2)*es*0.5;moveY=Math.sin(ang+Math.PI/2)*es*0.5;}
        if(Math.floor(e.mt/2000)!==Math.floor((e.mt-dt)/2000)){
          const aa=Math.atan2(pcy-ecy,pcx-ecx);
          s.bProj.push({x:ecx,y:ecy,dx:Math.cos(aa)*3.5,dy:Math.sin(aa)*3.5,type:"arrow",l:1000});sfx("sword");}
      }else if(e.type==="mage"){
        const ca=e.mt/1000;moveX=Math.cos(ca)*es;moveY=Math.sin(ca)*es;
        if(Math.floor(e.mt/3000)!==Math.floor((e.mt-dt)/3000)){
          e.x=e.hx+Math.random()*96-48;e.y=e.hy+Math.random()*96-48;
          e.x=Math.max(TL,Math.min(W2-TL-ES,e.x));e.y=Math.max(TL,Math.min(H2-TL-ES,e.y));
          s.pt.push(...Array.from({length:6},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:400,c:"#a060ff"})));}
        if(Math.floor(e.mt/1500)!==Math.floor((e.mt-dt)/1500)){
          const ma=Math.atan2(pcy-ecy,pcx-ecx);const mt2=["fire","shadow","root"][Math.floor(e.mt/1500)%3];
          s.bProj.push({x:ecx,y:ecy,dx:Math.cos(ma)*2.5,dy:Math.sin(ma)*2.5,type:mt2,l:1200});sfx("bomb");}
      }else if(e.type==="knight"){
        e.shieldDir=Math.atan2(pcy-ecy,pcx-ecx);
        const phase=Math.floor(e.mt/2500)%3;
        if(phase===2){const bsp=es*3;moveX=Math.cos(ang)*bsp;moveY=Math.sin(ang)*bsp;}
        else{const ca=e.mt/800+Math.PI/2;moveX=Math.cos(ang+ca*0.3)*es*0.4;moveY=Math.sin(ang+ca*0.3)*es*0.4;}
      }else if(e.type==="miniboss"){
        // Mini-boss: charge pattern — circle, then lunge
        const mbPhase=Math.floor(e.mt/2500)%3;
        if(mbPhase===2){const bsp=es*2.8;moveX=Math.cos(ang)*bsp;moveY=Math.sin(ang)*bsp;}
        else if(mbPhase===1){moveX=0;moveY=0;
          if(Math.floor(e.mt/2500)!==Math.floor((e.mt-dt)/2500)){sfx("door");s.shake.t=150;}}
        else{const ca=e.mt/600;moveX=Math.cos(ang+Math.sin(ca)*0.8)*es*0.7;moveY=Math.sin(ang+Math.sin(ca)*0.8)*es*0.7;}
      }else{moveX=Math.cos(ang)*es;moveY=Math.sin(ang)*es;}
    }else if(e.st==="patrol"){const ang=Math.sin(e.mt/1200)*Math.PI*2;moveX=Math.cos(ang)*es*.4;moveY=Math.sin(ang)*es*.4;}
    else if(e.st==="retreat"){const ang=Math.atan2(e.hy-ecy,e.hx-ecx);moveX=Math.cos(ang)*es*.6;moveY=Math.sin(ang)*es*.6;}
    const nx=e.x+moveX*(dt/16),ny=e.y+moveY*(dt/16);
    const em=4;
    const eCanX=!eSolid(s,Math.floor((nx+em)/TL),Math.floor((e.y+em)/TL))&&!eSolid(s,Math.floor((nx+ES-em)/TL),Math.floor((e.y+em)/TL))&&!eSolid(s,Math.floor((nx+em)/TL),Math.floor((e.y+ES-em)/TL))&&!eSolid(s,Math.floor((nx+ES-em)/TL),Math.floor((e.y+ES-em)/TL));
    const eCanY=!eSolid(s,Math.floor((e.x+em)/TL),Math.floor((ny+em)/TL))&&!eSolid(s,Math.floor((e.x+ES-em)/TL),Math.floor((ny+em)/TL))&&!eSolid(s,Math.floor((e.x+em)/TL),Math.floor((ny+ES-em)/TL))&&!eSolid(s,Math.floor((e.x+ES-em)/TL),Math.floor((ny+ES-em)/TL));
    if(eCanX)e.x=nx;if(eCanY)e.y=ny;
    e.x=Math.max(TL,Math.min(W2-TL-ES,e.x));e.y=Math.max(TL,Math.min(H2-TL-ES,e.y));
    if(s.sw.a){const sOff=SR*0.7,sR2=SR*0.85;let sx2=p.x+PS/2,sy2=p.y+PS/2;if(p.dir===0)sy2-=sOff;if(p.dir===2)sy2+=sOff;if(p.dir===3)sx2-=sOff;if(p.dir===1)sx2+=sOff;
      const sDist=Math.hypot(sx2-ecx,sy2-ecy);
      if(sDist<sR2+ES*0.4&&e.fl<=0){
        if(e.type==="knight"&&e.shieldDir!==undefined){
          const atkAng=Math.atan2(ecy-pcy,ecx-pcx);
          const shieldDiff=Math.abs(((atkAng-e.shieldDir+Math.PI*3)%(Math.PI*2))-Math.PI);
          if(shieldDiff>Math.PI*0.6){e.fl=200;sfx("door");
            s.pt.push(...Array.from({length:3},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:200,c:"#aaf"})));
            s.dmgNums.push({x:ecx,y:ecy-8,t:600,val:"BLOCK",c:"#88f"});
            continue;}}
        const sdmg=p.hasMasterSword?2:1;e.hp-=sdmg;e.fl=300;const kb=isBossLike?10:18,kba=Math.atan2(ecy-pcy,ecx-pcx);e.x+=Math.cos(kba)*kb;e.y+=Math.sin(kba)*kb;
        sfx("hit",e.type==="boss"?"E2":"C3");
        s.dmgNums.push({x:ecx,y:ecy-8,t:600,val:sdmg,c:p.hasMasterSword?"#8af":e.type==="boss"?"#ff4":"#fff"});
        s.pt.push(...Array.from({length:p.hasMasterSword?8:5},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:300,c:p.hasMasterSword?"#8af":"#fff"})));}}
    if(e.hp<=0){s.en.splice(i,1);
      s.pt.push(...Array.from({length:12},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:500,c:e.type==="boss"?"#fd3":"#f88"})));
      if(e.type==="boss"){sfx("bossdeath");s.shake.t=600;s.freeze=400;
        s.drops.push({x:ecx,y:ecy-8,vy:-4,ground:ecy,type:"heart",t:0},{x:ecx-10,y:ecy-8,vy:-3.5,ground:ecy,type:"heart",t:0},{x:ecx+10,y:ecy-8,vy:-3.5,ground:ecy,type:"bomb",t:0});
        const bossId=`${s.loc.di}:${e.name}`;
        if(!s.heartContainers.includes(bossId)){s.heartContainers.push(bossId);
          s.drops.push({x:ecx,y:ecy-12,vy:-5,ground:ecy,type:"heartcontainer",t:0});}
        if(s.loc.di>=0&&s.loc.di<3&&!p.tri[s.loc.di]){
          s.drops.push({x:ecx,y:-20,vy:0.35,ground:ecy-8,type:"triforce",t:0,spin:0});
          s.triMu=true;}
        if(s.loc.di===3){s.won=true;s.msg={text:"The Dark King is defeated! Peace restored!",t:99999};}
      }else if(e.type==="miniboss"){sfx("bossdeath");s.shake.t=400;s.freeze=300;
        s.drops.push({x:ecx,y:ecy-8,vy:-4,ground:ecy,type:"heart",t:0},{x:ecx-10,y:ecy-8,vy:-3.5,ground:ecy,type:"heart",t:0});
        s.msg={text:`${e.name||"Mini-Boss"} defeated!`,t:2000};
      }else{sfx("kill");
        const dr2=Math.random();
        if(dr2<0.40){const dt2=Math.random();
          s.drops.push({x:ecx,y:ecy-4,vy:-3,ground:ecy,type:dt2<0.45?"heart":dt2<0.65?"bomb":dt2<0.85?"rupee_green":"rupee_blue",t:0});}}
      if(e.type==="boss")s.msg={text:`${e.name||"Boss"} defeated!`,t:2000};
      if(s.en.length===0){s.cl.add(rk);s.roomFlash=500;
        // Combat unlock — open exits with fanfare
        if(s.combatLock){s.combatLock=false;sfx("triforce");s.shake.t=300;
          // Particles at all exit positions
          const m3=gm(s);if(m3){
            const exits=[[7,0],[8,0],[7,RO-1],[8,RO-1],[0,5],[0,6],[CO-1,5],[CO-1,6]];
            for(const[ex,ey]of exits){if(m3[ey]&&(m3[ey][ex]===T.FLOOR||m3[ey][ex]===T.DOOR||m3[ey][ex]===T.BOSS_DOOR))
              s.pt.push(...Array.from({length:4},()=>({x:ex*TL+16,y:ey*TL+16,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:500,c:"#fd3"})));}}
        }else{sfx("pickup");}
        // Spawn reward chest only if room has key items or dungeon treasures
        const rm2=gm(s);const hasTreasure=rm2&&rm2.some(row=>row.some(tl=>tl===T.KEY||tl===T.MASTER_KEY||tl===T.BOW||tl===T.BOMB_BAG||tl===T.MASTER_SWORD||tl===T.HEART_PIECE));
        if(hasTreasure){const chx=W2/2-12,chy=H2/2-12;
          const rw=Math.random();const reward=rw<0.35?"heart":rw<0.55?"bomb":rw<0.75?"rupee_blue":"rupee_green";
          s.chest={x:chx,y:chy,state:"closed",t:0,reward};}}
      continue;}
    if(p.ifr<=0&&dist<(PS+ES)*0.38){p.hp--;p.ifr=IFR;sfx("hurt");s.shake.t=300;
      const hkb=8,hka=Math.atan2(pcy-ecy,pcx-ecx);if(tm(p.x+Math.cos(hka)*hkb,p.y+Math.sin(hka)*hkb)){p.x+=Math.cos(hka)*hkb;p.y+=Math.sin(hka)*hkb;}
      if(e.type==="fire_bat"){p.burn=3000;p.burnTick=0;s.msg={text:"Burning!",t:1000};}
      if(e.type==="ghost"){p.freeze=2500;s.msg={text:"Frozen!",t:1000};}
      s.pt.push(...Array.from({length:4},()=>({x:pcx,y:pcy,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:300,c:e.type==="fire_bat"?"#f80":e.type==="ghost"?"#8af":"#f44"})));
      if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}}
  for(let i=s.bProj.length-1;i>=0;i--){const bp=s.bProj[i];bp.x+=bp.dx*(dt/16);bp.y+=bp.dy*(dt/16);bp.l-=dt;
    if(bp.l<=0||bp.x<0||bp.x>W2||bp.y<0||bp.y>H2){s.bProj.splice(i,1);continue;}
    if(s.p.shield&&Math.hypot(p.x+PS/2-bp.x,p.y+PS/2-bp.y)<20){
      const ba=Math.atan2(bp.y-(p.y+PS/2),bp.x-(p.x+PS/2));
      const pf=p.dir===0?-Math.PI/2:p.dir===2?Math.PI/2:p.dir===3?Math.PI:0;
      const diff=Math.abs(((ba-pf+Math.PI*3)%(Math.PI*2))-Math.PI);
      if(diff>Math.PI*0.5){sfx("door");s.bProj.splice(i,1);
        s.pt.push(...Array.from({length:4},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:300,c:"#88f"})));
        s.dmgNums.push({x:p.x+PS/2,y:p.y,t:500,val:"BLOCK",c:"#8af"});
        continue;}}
    if(p.ifr<=0&&Math.hypot(p.x+PS/2-bp.x,p.y+PS/2-bp.y)<14){
      p.hp--;p.ifr=IFR;sfx("hurt");s.shake.t=300;s.bProj.splice(i,1);
      const hka=Math.atan2(p.y+PS/2-bp.y,p.x+PS/2-bp.x);if(tm(p.x+Math.cos(hka)*6,p.y+Math.sin(hka)*6)){p.x+=Math.cos(hka)*6;p.y+=Math.sin(hka)*6;}
      if(bp.type==="fire"){p.burn=3000;p.burnTick=0;}
      if(bp.type==="shadow"){p.freeze=2000;}
      if(bp.type==="root"){p.poison=4000;p.poisonTick=0;}
      s.pt.push(...Array.from({length:4},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:300,c:bp.type==="fire"?"#f80":bp.type==="root"?"#4a2":"#80f"})));
      if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}}
  for(let i=s.pArrows.length-1;i>=0;i--){const pa=s.pArrows[i];pa.x+=pa.dx*(dt/16);pa.y+=pa.dy*(dt/16);pa.l-=dt;
    if(pa.l<=0||pa.x<0||pa.x>W2||pa.y<0||pa.y>H2){s.pArrows.splice(i,1);continue;}
    for(let j=s.en.length-1;j>=0;j--){const e=s.en[j];
      if(Math.hypot(pa.x-(e.x+ES/2),pa.y-(e.y+ES/2))<ES*0.5){
        if(e.type==="knight"&&e.shieldDir!==undefined){
          const atkAng=Math.atan2(pa.dy,pa.dx);
          const shieldDiff=Math.abs(((atkAng-e.shieldDir+Math.PI*3)%(Math.PI*2))-Math.PI);
          if(shieldDiff<Math.PI*0.6){e.fl=200;sfx("door");s.pArrows.splice(i,1);
            s.pt.push(...Array.from({length:3},()=>({x:e.x+ES/2,y:e.y+ES/2,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:200,c:"#aaf"})));break;}}
        e.hp-=2;e.fl=300;sfx("hit");
        const kb=12,kba=Math.atan2(pa.dy,pa.dx);e.x+=Math.cos(kba)*kb;e.y+=Math.sin(kba)*kb;
        s.dmgNums.push({x:e.x+ES/2,y:e.y-8,t:600,val:2,c:"#fd3"});
        s.pt.push(...Array.from({length:5},()=>({x:e.x+ES/2,y:e.y+ES/2,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:300,c:"#fd3"})));
        s.pArrows.splice(i,1);break;}}}
  cPk(s);cTr(s);if(s.msg.t>0)s.msg.t-=dt;if(s.dgTitle.t>0)s.dgTitle.t-=dt;if(s.ec>0)s.ec-=dt;}

function drw(t){const cv=cvRef.value;if(!cv)return;const c=cv.getContext("2d");const s=stR.value;if(!s)return;
  const FH=H2+HH;
  c.setTransform(4,0,0,4,0,0);
  c.fillStyle="#060610";c.fillRect(0,0,W2,FH);
  if(s.title){
    const W=W2,H=FH;
    const sky=c.createLinearGradient(0,0,0,H*0.6);
    sky.addColorStop(0,"#1a1040");sky.addColorStop(0.25,"#3a2060");sky.addColorStop(0.45,"#c05030");
    sky.addColorStop(0.55,"#e8a040");sky.addColorStop(0.65,"#f0d060");sky.addColorStop(0.75,"#d0a838");sky.addColorStop(1,"#2a5020");
    c.fillStyle=sky;c.fillRect(0,0,W,H);
    const sunY=H*0.52;const sunG=c.createRadialGradient(W*0.35,sunY,5,W*0.35,sunY,80);
    sunG.addColorStop(0,"rgba(255,240,200,0.9)");sunG.addColorStop(0.3,"rgba(255,200,100,0.5)");sunG.addColorStop(1,"rgba(255,150,50,0)");
    c.fillStyle=sunG;c.beginPath();c.arc(W*0.35,sunY,80,0,Math.PI*2);c.fill();
    c.fillStyle="rgba(255,230,180,0.8)";c.beginPath();c.arc(W*0.35,sunY,20,0,Math.PI*2);c.fill();
    {let seed=12345;const sr=()=>{seed=(seed*16807+0)%2147483647;return(seed&0xffff)/0xffff;};
    for(let i=0;i<40;i++){
      const sx=W*0.05+sr()*W*0.9;
      const sy=sr()*H*0.45;
      const rate=400+sr()*800;
      const blink=Math.sin(t/rate+i*1.7)*0.35;
      const baseBr=0.3+sr()*0.6;
      const br=Math.min(1,baseBr+blink);
      const sz=0.5+sr()*1.5;
      c.fillStyle=`rgba(255,255,${210+(sr()*45|0)},${br})`;c.beginPath();c.arc(sx,sy,sz,0,Math.PI*2);c.fill();
      if(br>0.75&&sz>1.2){c.strokeStyle=`rgba(255,255,255,${(br-0.6)*1.2})`;c.lineWidth=0.3;
        c.beginPath();c.moveTo(sx-3,sy);c.lineTo(sx+3,sy);c.stroke();c.beginPath();c.moveTo(sx,sy-3);c.lineTo(sx,sy+3);c.stroke();}}}
    {const cycle=8000,phase=(t%cycle)/cycle;
      if(phase<0.15){const p2=phase/0.15;
        const sx1=W*0.8,sy1=H*0.05,sx2=W*0.15,sy2=H*0.35;
        const cx2=sx1+(sx2-sx1)*p2,cy2=sy1+(sy2-sy1)*p2;
        for(let i=0;i<8;i++){const tp=Math.max(0,p2-i*0.015);
          const tx2=sx1+(sx2-sx1)*tp,ty2=sy1+(sy2-sy1)*tp;
          c.fillStyle=`rgba(255,255,220,${(1-i/8)*0.6*(1-p2*0.5)})`;c.beginPath();c.arc(tx2,ty2,1.5-i*0.15,0,Math.PI*2);c.fill();}
        c.fillStyle=`rgba(255,255,240,${0.9*(1-p2*0.3)})`;c.beginPath();c.arc(cx2,cy2,2,0,Math.PI*2);c.fill();
        c.fillStyle=`rgba(255,255,200,${0.4*(1-p2)})`;c.beginPath();c.arc(cx2,cy2,5,0,Math.PI*2);c.fill();}}
    for(let i=0;i<5;i++){const cx2=((t/40+i*130)%((W+120)))-60,cy2=H*0.15+i*25+Math.sin(i*2)*15;
      const cg=c.createRadialGradient(cx2,cy2,5,cx2,cy2,35+i*8);
      cg.addColorStop(0,`rgba(200,150,120,${0.15+i*0.02})`);cg.addColorStop(1,"rgba(200,150,120,0)");
      c.fillStyle=cg;c.beginPath();c.ellipse(cx2,cy2,40+i*10,15+i*3,0,0,Math.PI*2);c.fill();}
    c.fillStyle="#2a4038";c.beginPath();c.moveTo(0,H*0.55);
    c.lineTo(W*0.08,H*0.42);c.lineTo(W*0.18,H*0.48);c.lineTo(W*0.28,H*0.38);c.lineTo(W*0.4,H*0.46);
    c.lineTo(W*0.5,H*0.40);c.lineTo(W*0.58,H*0.44);c.lineTo(W*0.65,H*0.5);c.lineTo(W,H*0.55);
    c.lineTo(W,H*0.6);c.lineTo(0,H*0.6);c.fill();
    c.fillStyle="#1a3028";c.beginPath();c.moveTo(0,H*0.55);
    c.lineTo(W*0.1,H*0.48);c.lineTo(W*0.22,H*0.52);c.lineTo(W*0.35,H*0.46);c.lineTo(W*0.45,H*0.50);
    c.lineTo(W*0.55,H*0.53);c.lineTo(W*0.62,H*0.56);c.lineTo(W,H*0.58);c.lineTo(W,H*0.62);c.lineTo(0,H*0.62);c.fill();
    const landG=c.createLinearGradient(0,H*0.55,0,H);landG.addColorStop(0,"#3a8830");landG.addColorStop(0.4,"#2a6820");landG.addColorStop(1,"#1a4a14");
    c.fillStyle=landG;c.beginPath();c.moveTo(0,H*0.58);
    c.bezierCurveTo(W*0.2,H*0.55,W*0.4,H*0.62,W*0.6,H*0.58);
    c.bezierCurveTo(W*0.75,H*0.55,W*0.85,H*0.6,W,H*0.56);c.lineTo(W,H);c.lineTo(0,H);c.fill();
    for(let i=0;i<12;i++){const tx2=W*0.05+i*W*0.07+hs(i,0,10)*20,ty2=H*0.56+hs(i,0,11)*H*0.15;
      const ts=3+hs(i,0,12)*4;c.fillStyle="#1a5010";c.beginPath();c.arc(tx2,ty2,ts,0,Math.PI*2);c.fill();
      c.fillStyle="#3a2010";c.fillRect(tx2-1,ty2+ts-1,2,ts);}
    c.strokeStyle="rgba(60,140,200,0.4)";c.lineWidth=3;c.beginPath();
    c.moveTo(W*0.15,H*0.62);c.bezierCurveTo(W*0.25,H*0.65,W*0.3,H*0.60,W*0.45,H*0.67);
    c.bezierCurveTo(W*0.55,H*0.72,W*0.5,H*0.63,W*0.6,H*0.70);c.stroke();
    const cliffX=W*0.62,cliffY=H*0.50;
    const cliffG=c.createLinearGradient(cliffX,cliffY,cliffX+W*0.4,H);
    cliffG.addColorStop(0,"#5a5040");cliffG.addColorStop(0.5,"#4a4030");cliffG.addColorStop(1,"#3a3020");
    c.fillStyle=cliffG;c.beginPath();c.moveTo(cliffX,cliffY);c.lineTo(cliffX+20,cliffY+5);
    c.lineTo(W,cliffY+30);c.lineTo(W,H);c.lineTo(cliffX-20,H);c.lineTo(cliffX-15,cliffY+40);c.closePath();c.fill();
    c.fillStyle="#3a8830";c.beginPath();c.moveTo(cliffX-18,cliffY+2);
    c.bezierCurveTo(cliffX,cliffY-5,cliffX+40,cliffY-2,W,cliffY+25);
    c.lineTo(W,cliffY+35);c.bezierCurveTo(cliffX+40,cliffY+8,cliffX,cliffY+5,cliffX-18,cliffY+12);c.fill();
    c.fillStyle="#2a6820";c.fillRect(cliffX-20,cliffY+10,W-cliffX+20,H-cliffY-10);
    c.strokeStyle="rgba(0,0,0,0.1)";c.lineWidth=1;
    for(let i=0;i<6;i++){c.beginPath();c.moveTo(cliffX-5+i*15,cliffY+20+i*20);c.lineTo(cliffX+10+i*20,cliffY+50+i*25);c.stroke();}
    const hx2=W*0.72,hy2=cliffY-45;
    const windSway=Math.sin(t/600)*2;const capeSway=Math.sin(t/400)*8;
    c.fillStyle="rgba(0,0,0,0.2)";c.beginPath();c.ellipse(hx2,cliffY-1,14,4,0,0,Math.PI*2);c.fill();
    const capeG=c.createLinearGradient(hx2,hy2+10,hx2-25+capeSway,hy2+50);
    capeG.addColorStop(0,"#1a6a1a");capeG.addColorStop(1,"#0a4a0a");
    c.fillStyle=capeG;c.beginPath();c.moveTo(hx2-4,hy2+8);c.bezierCurveTo(hx2-15,hy2+25,hx2-25+capeSway,hy2+40,hx2-20+capeSway*1.2,hy2+52);
    c.lineTo(hx2-10+capeSway*0.5,hy2+48);c.bezierCurveTo(hx2-8,hy2+35,hx2-2,hy2+20,hx2+2,hy2+10);c.fill();
    c.strokeStyle="rgba(100,200,80,0.3)";c.lineWidth=1;c.beginPath();
    c.moveTo(hx2-4,hy2+8);c.bezierCurveTo(hx2-15,hy2+25,hx2-25+capeSway,hy2+40,hx2-20+capeSway*1.2,hy2+52);c.stroke();
    c.fillStyle="#5a3018";c.beginPath();c.ellipse(hx2-5,cliffY-4,5,4,0,0,Math.PI*2);c.fill();
    c.beginPath();c.ellipse(hx2+5,cliffY-4,5,4,0,0,Math.PI*2);c.fill();
    c.fillStyle="#c8b080";c.fillRect(hx2-6,hy2+32,5,14);c.fillRect(hx2+1,hy2+32,5,14);
    const tunicG=c.createLinearGradient(hx2-10,hy2+10,hx2+10,hy2+34);
    tunicG.addColorStop(0,"#48bb48");tunicG.addColorStop(1,"#2a8a2a");
    c.fillStyle=tunicG;c.beginPath();c.moveTo(hx2-10,hy2+12);c.lineTo(hx2+10,hy2+12);
    c.lineTo(hx2+9,hy2+34);c.lineTo(hx2-9,hy2+34);c.fill();
    c.fillStyle="#a87a2a";c.fillRect(hx2-9,hy2+26,18,3);c.fillStyle="#d4b040";c.fillRect(hx2-3,hy2+26,6,3);
    c.fillStyle="#48bb48";c.fillRect(hx2+9,hy2+14,5,12);c.fillRect(hx2-14,hy2+16+windSway,5,10);
    c.fillStyle="#f0c8a0";c.beginPath();c.arc(hx2+11,hy2+27,3,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(hx2-12,hy2+27+windSway,3,0,Math.PI*2);c.fill();
    c.strokeStyle="#c0c0d8";c.lineWidth=2.5;c.lineCap="round";
    c.beginPath();c.moveTo(hx2+12,hy2+25);c.lineTo(hx2+14,hy2+5);c.stroke();
    c.strokeStyle="#fff";c.lineWidth=1;c.beginPath();c.moveTo(hx2+12,hy2+24);c.lineTo(hx2+14,hy2+8);c.stroke();
    c.strokeStyle="#b8862a";c.lineWidth=2.5;c.beginPath();c.moveTo(hx2+8,hy2+25);c.lineTo(hx2+16,hy2+25);c.stroke();
    const glint=Math.sin(t/300)*0.5+0.5;
    c.fillStyle=`rgba(255,255,220,${glint*0.8})`;c.beginPath();c.arc(hx2+14,hy2+7,2,0,Math.PI*2);c.fill();
    c.fillStyle="#f0c8a0";c.beginPath();c.arc(hx2,hy2+4,9,0,Math.PI*2);c.fill();
    const hairG=c.createLinearGradient(hx2-8,hy2-6,hx2+8,hy2+2);
    hairG.addColorStop(0,"#e8c040");hairG.addColorStop(1,"#c8a030");
    c.fillStyle=hairG;c.beginPath();c.arc(hx2,hy2+1,9,Math.PI+0.4,Math.PI*2-0.4);c.fill();
    c.fillStyle="#d8b030";c.beginPath();c.moveTo(hx2-7,hy2);
    c.bezierCurveTo(hx2-14,hy2-2+windSway,hx2-18,hy2+5+windSway,hx2-15,hy2+10+windSway*1.5);
    c.lineTo(hx2-12,hy2+8+windSway);c.bezierCurveTo(hx2-14,hy2+3+windSway,hx2-10,hy2+1,hx2-6,hy2+2);c.fill();
    c.fillStyle="#c8a028";c.beginPath();c.moveTo(hx2-5,hy2-2);
    c.bezierCurveTo(hx2-10,hy2-5+windSway*0.7,hx2-16,hy2+2+windSway,hx2-12,hy2+7+windSway);
    c.lineTo(hx2-10,hy2+5+windSway);c.bezierCurveTo(hx2-12,hy2,hx2-8,hy2-3,hx2-4,hy2);c.fill();
    c.fillStyle="#2aaa2a";c.beginPath();c.moveTo(hx2-8,hy2);c.lineTo(hx2,hy2-12);c.lineTo(hx2+8,hy2);
    c.bezierCurveTo(hx2+4,hy2-2,hx2-4,hy2-2,hx2-8,hy2);c.fill();
    c.fillStyle="#28992a";c.beginPath();c.moveTo(hx2,hy2-11);
    c.bezierCurveTo(hx2-8+capeSway*0.6,hy2-14,hx2-15+capeSway*0.8,hy2-8,hx2-18+capeSway,hy2-4);
    c.lineTo(hx2-14+capeSway*0.7,hy2-6);c.bezierCurveTo(hx2-10+capeSway*0.4,hy2-10,hx2-5,hy2-12,hx2+1,hy2-10);c.fill();
    c.fillStyle="#2244aa";c.beginPath();c.arc(hx2-3,hy2+3,2,0,Math.PI*2);c.fill();
    c.fillStyle="#fff";c.fillRect(hx2-3.5,hy2+2,1,1);
    c.strokeStyle="#aa6644";c.lineWidth=0.8;c.beginPath();c.moveTo(hx2-4,hy2+7);c.lineTo(hx2-1,hy2+7.5);c.stroke();
    c.fillStyle="#e8c0a0";c.beginPath();c.ellipse(hx2+7,hy2+4,2,3.5,0.2,0,Math.PI*2);c.fill();
    c.textAlign="center";const glow=Math.sin(t/400)*0.3+0.7;
    const titleG=c.createLinearGradient(0,H*0.10,0,H*0.18);titleG.addColorStop(0,"#ffd633");titleG.addColorStop(1,"#e8a020");
    c.fillStyle=titleG;c.font="bold 28px monospace";c.fillText("THE LEGEND OF LINK",W/2,H*0.14);
    c.fillStyle="rgba(255,220,180,0.7)";c.font="12px monospace";c.fillText("Quest for the Triforce",W/2,H*0.20);
    const triCX=W/2,triCY=H*0.28,triS=24;
    const triFade=Math.sin(t/1200)*0.4+0.6;
    const drawTriPiece=(cx2,cy2,s2)=>{
      c.save();c.translate(cx2,cy2);c.globalAlpha=triFade;
      const pg=c.createRadialGradient(0,0,s2*0.3,0,0,s2*1.5);
      pg.addColorStop(0,`rgba(253,211,51,${glow*0.3})`);pg.addColorStop(1,"rgba(253,211,51,0)");
      c.fillStyle=pg;c.beginPath();c.arc(0,0,s2*1.5,0,Math.PI*2);c.fill();
      c.fillStyle="#ffd633";c.beginPath();c.moveTo(0,-s2);c.lineTo(s2*0.866,s2*0.5);c.lineTo(-s2*0.866,s2*0.5);c.fill();
      const is2=s2*0.6;c.fillStyle="#ffe866";c.beginPath();c.moveTo(0,-is2);c.lineTo(is2*0.866,is2*0.5);c.lineTo(-is2*0.866,is2*0.5);c.fill();
      c.fillStyle=`rgba(255,255,220,${glow*0.6})`;c.beginPath();c.arc(0,2,3,0,Math.PI*2);c.fill();
      c.globalAlpha=1;c.restore();
    };
    drawTriPiece(triCX,triCY-triS*0.6,triS*0.7);
    drawTriPiece(triCX-triS*0.7,triCY+triS*0.4,triS*0.7);
    drawTriPiece(triCX+triS*0.7,triCY+triS*0.4,triS*0.7);
    c.strokeStyle=`rgba(253,220,80,${triFade*0.25})`;c.lineWidth=2;
    c.beginPath();c.moveTo(triCX,triCY-triS*0.6);c.lineTo(triCX-triS*0.7,triCY+triS*0.4);
    c.lineTo(triCX+triS*0.7,triCY+triS*0.4);c.closePath();c.stroke();
    const bottomG=c.createLinearGradient(0,H*0.82,0,H);bottomG.addColorStop(0,"rgba(0,0,0,0)");bottomG.addColorStop(1,"rgba(0,0,0,0.6)");
    c.fillStyle=bottomG;c.fillRect(0,H*0.82,W,H*0.2);
    if(ltRef.value==="title"){
      const bw=120,bh=30,bx=W/2-bw/2,by=H*0.86;
      const hover=Math.sin(t/300)*0.1+0.9;
      const hs2=hasSave();
      c.fillStyle=`rgba(253,211,51,${hover*0.25})`;c.strokeStyle=`rgba(253,211,51,${hover})`;c.lineWidth=2;
      c.beginPath();c.moveTo(bx+8,by);c.lineTo(bx+bw-8,by);c.quadraticCurveTo(bx+bw,by,bx+bw,by+8);c.lineTo(bx+bw,by+bh-8);c.quadraticCurveTo(bx+bw,by+bh,bx+bw-8,by+bh);c.lineTo(bx+8,by+bh);c.quadraticCurveTo(bx,by+bh,bx,by+bh-8);c.lineTo(bx,by+8);c.quadraticCurveTo(bx,by,bx+8,by);c.fill();c.stroke();
      c.fillStyle="#fff";c.font="bold 16px monospace";c.fillText(hs2?"CONTINUE":"START",W/2,by+bh/2+6);
      if(hs2){c.fillStyle="rgba(255,255,255,0.4)";c.font="10px monospace";c.fillText("Press N for New Game",W/2,by+bh+14);}
    }else if(Math.sin(t/500)>0){c.fillStyle="#fff";c.font="bold 14px monospace";c.fillText("PRESS SPACE OR CLICK",W/2,H*0.92);}
    c.fillStyle="rgba(255,255,255,0.3)";c.font="9px monospace";c.fillText("WASD move \u00b7 Space atk \u00b7 B bomb \u00b7 X shield \u00b7 C bow \u00b7 Tab map",W/2,H*0.97);
    c.textAlign="left";c.lineCap="butt";return;}
  // ===== HUD =====
  const p=s.p;
  c.fillStyle="#111";c.fillRect(0,0,W2,HH);
  c.fillStyle="rgba(60,60,60,0.5)";c.fillRect(0,HH-1,W2,1);
  const hc=p.mhp/2,hsz=hc>6?12:16,hsp=hc>6?16:22;
  for(let i=0;i<hc;i++){const hx=8+i*hsp,hy=hc>6?10:8;
    if(p.hp>=(i+1)*2){c.fillStyle="#ee3333";dH(c,hx,hy,hsz);}
    else if(p.hp>=i*2+1){c.save();c.beginPath();c.rect(hx,hy,hsz/2,hsz);c.clip();c.fillStyle="#ee3333";dH(c,hx,hy,hsz);c.restore();c.save();c.beginPath();c.rect(hx+hsz/2,hy,hsz/2,hsz);c.clip();c.fillStyle="#444";dH(c,hx,hy,hsz);c.restore();}
    else{c.fillStyle="#444";dH(c,hx,hy,hsz);}}
  if(p.hp<=2&&p.hp>0&&Math.sin(s.lowHp/200)>0.3){c.fillStyle="rgba(255,50,50,0.15)";c.fillRect(0,0,W2,HH);}
  // Items — right side, spaced to avoid triforce overlap
  const iR=W2-10;// rightmost item edge
  c.font="bold 12px monospace";
  let ix=iR;
  if(s.loc.ty==="dg"&&s.loc.di>=0){ix-=18;c.fillStyle=p.masterKey[s.loc.di]?"#c070ff":"#555";c.fillText(p.masterKey[s.loc.di]?"\ud83d\udddd\ufe0f":"\ud83d\udd12",ix,21);}
  if(p.hasBombs){ix-=35;c.fillStyle="#8af";c.fillText(`\ud83d\udca3${p.bombs}`,ix,21);}
  ix-=35;c.fillStyle="#fd3";c.fillText(`\ud83d\udd11${p.keys}`,ix,21);
  ix-=40;c.fillStyle="#4f4";c.fillText(`\ud83d\udc8e${p.rupees}`,ix,21);
  if(p.hasBow){ix-=18;c.fillStyle="#fd3";c.font="bold 11px monospace";c.fillText("\ud83c\udff9",ix,21);c.font="bold 12px monospace";}
  const iD2=s.loc.ty==="dg"||s.loc.ty==="cave";
  let sx2=p.mhp/2*22+16;if(iD2)sx2+=80;
  if(p.burn>0){c.fillStyle="#f80";c.font="bold 10px monospace";c.fillText("\ud83d\udd25BURN",sx2,20);sx2+=55;}
  if(p.freeze>0){c.fillStyle="#8cf";c.font="bold 10px monospace";c.fillText("\u2744\ufe0fFREEZE",sx2,20);sx2+=65;}
  if(p.poison>0){c.fillStyle="#4a4";c.font="bold 10px monospace";c.fillText("\u2620\ufe0fPOISON",sx2,20);sx2+=65;}
  // Triforce pieces — after hearts, before items
  for(let i=0;i<3;i++){c.fillStyle=p.tri[i]?"#fd3":"#333";c.font="14px monospace";c.fillText("\u25b2",hc*hsp+20+i*18,21);}
  if(iD2){const dgn=s.loc.ty==="dg"?s.dg[s.loc.di].name:"Hidden Cave";c.fillStyle="#999";c.font="bold 11px monospace";c.fillText(dgn,p.mhp/2*22+16,21);}
  // ===== GAME AREA =====
  c.save();c.translate(0,HH);
  if(s.shake.t>0)c.translate(s.shake.x,s.shake.y);
  const m=gm(s),loc=s.loc,iD=loc.ty==="dg"||loc.ty==="cave",dg=loc.ty==="dg"?s.dg[loc.di]:(loc.ty==="cave"?{color:"#1a2a18",wc:"#3a5a3a",fc:"#2a3a28",name:"Hidden Cave"}:null);
  // Clip game area for slide transitions
  c.save();c.beginPath();c.rect(0,0,W2,H2);c.clip();
  // Slide: render old screen sliding out
  if(s.slide.a&&s.slide.prevScr){const sl=s.slide,prog=Math.min(1,sl.t/sl.dur);
    const ease=1-(1-prog)*(1-prog); // ease-out
    const oldM=loc.ty==="ow"?OW[sl.prevScr]:(loc.ty==="dg"?s.dg[loc.di].rooms[sl.prevScr]?.tiles:null);
    if(oldM){const ox=-ease*W2*sl.dx,oy=-ease*H2*sl.dy;
      c.save();c.translate(ox,oy);
      c.fillStyle=iD&&dg?dg.color:"#2a3a28";c.fillRect(0,0,W2,H2);
      for(let y2=0;y2<RO;y2++)for(let x2=0;x2<CO;x2++){let tl2=oldM[y2]?oldM[y2][x2]:T.EMPTY;
        const opk=`${loc.ty}:${loc.di}:${sl.prevScr}:${x2},${y2}`;
        if((tl2===T.KEY||tl2===T.MASTER_KEY||tl2===T.HEART||tl2===T.HEART_PIECE||tl2===T.TRIFORCE||tl2===T.BOMB||tl2===T.RUPEE||tl2===T.BOW||tl2===T.BOMB_BAG||tl2===T.MASTER_SWORD)&&s.pk.has(opk))tl2=iD?T.FLOOR:T.GRASS;
        if((tl2===T.DOOR||tl2===T.BOSS_DOOR)&&s.dr.has(opk))tl2=T.FLOOR;
        dT(c,tl2,x2*TL,y2*TL,iD,dg,t,null);}
      c.restore();}
    // Offset new screen
    c.translate((1-ease)*W2*sl.dx,(1-ease)*H2*sl.dy);}
  c.fillStyle=iD?dg.color:"#2a3a28";c.fillRect(0,0,W2,H2);
  if(m)for(let y=0;y<RO;y++)for(let x=0;x<CO;x++){let tl=m[y][x];const px=x*TL,py=y*TL;
    const pk=`${loc.ty}:${loc.di}:${loc.scr}:${x},${y}`;
    if((tl===T.KEY||tl===T.MASTER_KEY||tl===T.HEART||tl===T.HEART_PIECE||tl===T.TRIFORCE||tl===T.BOMB||tl===T.RUPEE||tl===T.BOW||tl===T.BOMB_BAG||tl===T.MASTER_SWORD)&&s.pk.has(pk))tl=iD?T.FLOOR:T.GRASS;
    if((tl===T.DOOR||tl===T.BOSS_DOOR)&&s.dr.has(pk))tl=T.FLOOR;
    let ei=null;
    if(tl===T.ENTRANCE&&!iD){for(const de of DE){if(de.s===loc.scr){for(const tp of de.t){if(tp[0]===x&&tp[1]===y){ei={di:de.d,qx:x-de.t[0][0],qy:y-de.t[0][1]};break;}}if(ei)break;}}}
    dT(c,tl,px,py,iD,dg,t,ei);}
  // Ambient dungeon decorations — theme-aware, deterministic per tile
  if(iD&&m){const th=dg?.th||"forest";
    for(let y=1;y<RO-1;y++)for(let x=1;x<CO-1;x++){
    const tl2=m[y][x];if(tl2!==T.FLOOR)continue;
    const h1=hs(x,y,42),h2=hs(x,y,73),h3=hs(x,y,101),h4=hs(x,y,137),px2=x*TL,py2=y*TL;
    if(h1<0.05){// Skull with crossbones
      const sx2=px2+8+h2*14,sy2=py2+8+h3*14;
      c.fillStyle="rgba(200,190,170,0.4)";c.beginPath();c.arc(sx2,sy2,4.5,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(180,170,150,0.35)";c.beginPath();c.arc(sx2,sy2+1,3.5,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(20,10,10,0.5)";c.beginPath();c.arc(sx2-1.5,sy2-0.5,1.2,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(sx2+1.5,sy2-0.5,1.2,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(20,10,10,0.3)";c.fillRect(sx2-1,sy2+2,2,1.5);
      // Crossbones
      c.strokeStyle="rgba(180,170,150,0.25)";c.lineWidth=1.2;
      c.beginPath();c.moveTo(sx2-5,sy2+4);c.lineTo(sx2+5,sy2+8);c.moveTo(sx2+5,sy2+4);c.lineTo(sx2-5,sy2+8);c.stroke();
    }else if(h1<0.10){// Cracked floor — spider web pattern
      const cx3=px2+8+h2*16,cy3=py2+8+h3*16;
      c.strokeStyle="rgba(0,0,0,0.12)";c.lineWidth=0.7;
      for(let r=0;r<5;r++){const a=h2*6+r*1.3,l=5+h3*8;
        c.beginPath();c.moveTo(cx3,cy3);c.lineTo(cx3+Math.cos(a)*l,cy3+Math.sin(a)*l);c.stroke();}
      c.beginPath();c.arc(cx3,cy3,3+h3*3,0,Math.PI*2);c.stroke();
    }else if(h1<0.16){// Theme-specific decoration
      if(th==="forest"){// Mushroom cluster
        const mx=px2+6+h2*18,my=py2+18+h3*8;
        c.fillStyle="rgba(180,60,60,0.35)";c.beginPath();c.arc(mx,my-2,3.5,Math.PI,0);c.fill();
        c.fillStyle="rgba(160,140,100,0.3)";c.fillRect(mx-1,my-1,2,5);
        c.fillStyle="rgba(200,80,80,0.25)";c.beginPath();c.arc(mx+6,my,2.5,Math.PI,0);c.fill();
        c.fillStyle="rgba(160,140,100,0.2)";c.fillRect(mx+5,my,2,4);
        c.fillStyle="rgba(255,255,255,0.2)";c.beginPath();c.arc(mx-1,my-3,1,0,Math.PI*2);c.fill();
      }else if(th==="fire"){// Embers/scorch marks
        c.fillStyle="rgba(40,20,10,0.2)";c.beginPath();c.ellipse(px2+16+h2*8-4,py2+16+h3*8,6+h2*4,4+h3*2,h4,0,Math.PI*2);c.fill();
        const ea=Math.sin(t/400+x*3+y*7)*0.3+0.3;
        c.fillStyle=`rgba(255,120,20,${ea*0.3})`;c.beginPath();c.arc(px2+14+h2*8,py2+14+h3*8,1.5,0,Math.PI*2);c.fill();
        c.fillStyle=`rgba(255,200,50,${ea*0.2})`;c.beginPath();c.arc(px2+18+h3*6,py2+12+h2*10,1,0,Math.PI*2);c.fill();
      }else if(th==="shadow"){// Ethereal wisps
        const wa=Math.sin(t/500+x*5+y*3)*3,wb=Math.cos(t/600+y*4)*2;
        c.fillStyle=`rgba(120,80,200,${0.12+Math.sin(t/300+h2*10)*0.06})`;
        c.beginPath();c.arc(px2+14+h2*10+wa,py2+14+h3*10+wb,3+h2*2,0,Math.PI*2);c.fill();
        c.fillStyle=`rgba(180,140,255,${0.08+Math.sin(t/400+h3*8)*0.04})`;
        c.beginPath();c.arc(px2+18+h3*8-wa,py2+18+h2*6-wb,2,0,Math.PI*2);c.fill();
      }else{// Generic dungeon — cobwebs
        c.strokeStyle="rgba(200,200,200,0.12)";c.lineWidth=0.5;
        const wx=px2+4+h2*10,wy=py2+4+h3*6;
        c.beginPath();c.moveTo(wx,wy);c.quadraticCurveTo(wx+6,wy+4,wx+12,wy);
        c.moveTo(wx,wy);c.quadraticCurveTo(wx+3,wy+6,wx,wy+10);
        c.moveTo(wx,wy);c.quadraticCurveTo(wx+8,wy+8,wx+10,wy+12);c.stroke();
      }
    }else if(h1<0.21){// Scattered rubble/debris
      c.fillStyle=th==="fire"?"rgba(80,40,30,0.25)":"rgba(100,90,80,0.2)";
      const rx=px2+4+h2*20,ry=py2+16+h3*12;
      c.beginPath();c.moveTo(rx,ry);c.lineTo(rx+4+h2*3,ry-2);c.lineTo(rx+6+h3*2,ry+3);c.lineTo(rx+1,ry+3);c.fill();
      c.fillStyle=th==="fire"?"rgba(60,30,20,0.2)":"rgba(80,70,60,0.18)";
      c.beginPath();c.moveTo(rx+8,ry+2);c.lineTo(rx+11,ry-1);c.lineTo(rx+13,ry+4);c.lineTo(rx+9,ry+4);c.fill();
    }else if(h1<0.26){// Puddle with reflection
      const pc2=th==="fire"?"rgba(140,50,20,0.12)":th==="shadow"?"rgba(40,30,60,0.18)":"rgba(50,70,110,0.18)";
      const prx=px2+10+h2*12,pry=py2+18+h3*8;
      c.fillStyle=pc2;c.beginPath();c.ellipse(prx,pry,6+h2*4,3+h3*2,h4*0.5,0,Math.PI*2);c.fill();
      // Shimmer highlight
      c.fillStyle=th==="fire"?"rgba(255,150,50,0.08)":"rgba(180,200,255,0.1)";
      c.beginPath();c.ellipse(prx-1,pry-1,3+h2*2,1.5,h4,0,Math.PI*2);c.fill();
    }else if(h1<0.30){// Broken pot / urn
      const bpx=px2+10+h2*12,bpy=py2+14+h3*10;
      c.fillStyle="rgba(140,100,60,0.35)";
      c.beginPath();c.moveTo(bpx-4,bpy+6);c.lineTo(bpx-3,bpy-2);c.quadraticCurveTo(bpx,bpy-5,bpx+3,bpy-2);c.lineTo(bpx+4,bpy+6);c.fill();
      // Broken rim
      c.fillStyle="rgba(160,120,70,0.3)";c.beginPath();c.moveTo(bpx-3,bpy-2);c.lineTo(bpx-1,bpy-4);c.lineTo(bpx+2,bpy-2);c.fill();
      // Shard nearby
      c.fillStyle="rgba(130,90,50,0.25)";c.beginPath();c.moveTo(bpx+7,bpy+2);c.lineTo(bpx+10,bpy-1);c.lineTo(bpx+11,bpy+4);c.fill();
    }else if(h1<0.33){// Bone fragments
      c.fillStyle="rgba(200,190,170,0.2)";c.lineWidth=1.5;c.strokeStyle="rgba(200,190,170,0.2)";
      const bx2=px2+6+h2*16,by2=py2+20+h3*8;
      c.beginPath();c.moveTo(bx2,by2);c.lineTo(bx2+8+h2*4,by2+2-h3*3);c.stroke();
      c.beginPath();c.moveTo(bx2+3,by2+4);c.lineTo(bx2+6+h3*5,by2+6+h2*2);c.stroke();
      c.fillStyle="rgba(200,190,170,0.15)";c.beginPath();c.arc(bx2+9+h2*3,by2+1,1.5,0,Math.PI*2);c.fill();
    }
    // Wall decorations (adjacent to north wall)
    if(y>0&&m[y-1][x]===T.WALL){
      if(h1>0.88){// Hanging chains
        c.strokeStyle="rgba(150,150,150,0.3)";c.lineWidth=1.5;
        const cx4=px2+6+h2*20;c.beginPath();
        for(let i=0;i<5;i++){const cy4=py2+1+i*4;c.moveTo(cx4+(i%2?-2:2),cy4);c.arc(cx4,cy4+2,2,i%2?Math.PI:0,i%2?0:Math.PI);}
        c.stroke();
        // Chain end — ring or hook
        c.strokeStyle="rgba(140,140,140,0.25)";c.beginPath();c.arc(cx4,py2+22,2.5,0,Math.PI*2);c.stroke();
      }else if(h1>0.82){// Wall crack/damage
        c.strokeStyle="rgba(0,0,0,0.1)";c.lineWidth=0.8;
        const wx2=px2+4+h2*24;c.beginPath();c.moveTo(wx2,py2);c.lineTo(wx2+3,py2+6);c.lineTo(wx2-2,py2+12);c.stroke();
      }else if(h1>0.78){// Moss drip from wall
        const mc2=th==="fire"?"rgba(60,40,20,0.15)":"rgba(30,70,25,0.2)";
        c.fillStyle=mc2;c.beginPath();c.moveTo(px2+8+h2*16,py2);c.lineTo(px2+6+h2*16,py2+6+h3*4);
        c.lineTo(px2+12+h2*16,py2+4+h3*6);c.lineTo(px2+10+h2*16,py2);c.fill();
      }}
    // Floor edge detail near walls (south)
    if(y<RO-2&&m[y+1][x]===T.WALL&&h4>0.8){
      c.fillStyle="rgba(0,0,0,0.06)";c.fillRect(px2+1,py2+TL-4,TL-2,3);
    }}}
  // Combat lock bars — iron gates over exits
  if(s.combatLock&&m){
    const drawBars=(bx,by,bw,bh,vert)=>{
      c.fillStyle="#444";c.fillRect(bx,by,bw,bh);
      c.fillStyle="#555";const bars=vert?4:5;
      for(let i=0;i<bars;i++){
        if(vert){const yy=by+4+i*(bh-8)/(bars-1);c.fillRect(bx+2,yy-1,bw-4,3);}
        else{const xx=bx+4+i*(bw-8)/(bars-1);c.fillRect(xx-1,by+2,3,bh-4);}}
      c.fillStyle="#333";c.fillRect(bx,by,bw,2);c.fillRect(bx,by,2,bh);
      c.fillStyle="#666";c.fillRect(bx+bw-2,by,2,bh);c.fillRect(bx,by+bh-2,bw,2);};
    // Check which exits exist and draw bars
    if(m[0][7]===T.FLOOR||m[0][7]===T.DOOR)drawBars(7*TL,0,TL*2,TL,false);
    if(m[RO-1][7]===T.FLOOR||m[RO-1][7]===T.DOOR)drawBars(7*TL,(RO-1)*TL,TL*2,TL,false);
    if(m[5][0]===T.FLOOR||m[5][0]===T.DOOR)drawBars(0,5*TL,TL,TL*2,true);
    if(m[5][CO-1]===T.FLOOR||m[5][CO-1]===T.DOOR)drawBars((CO-1)*TL,5*TL,TL,TL*2,true);}
  if(!iD)drawTerrainOverlay(c,m,t);
  if(iD&&m){
    // Darken unlit torches (only in dark rooms)
    const isDkRm=loc.ty==="dg"&&s.dg[loc.di]?.rooms[loc.scr]?.dark;
    if(isDkRm)for(let y=0;y<RO;y++)for(let x=0;x<CO;x++){if(m[y][x]===T.TORCH&&!s.litTorches.has(`${x},${y}`)){
      // Draw dark overlay to make the flame look extinguished
      c.fillStyle="rgba(0,0,0,0.6)";c.fillRect(x*TL+10,y*TL+2,12,14);
      c.fillStyle="#333";c.fillRect(x*TL+12,y*TL+4,8,8);
      // Subtle smoke wisp
      const sw2=Math.sin(t/300+x*7)*3;c.fillStyle="rgba(120,120,120,0.3)";
      c.beginPath();c.arc(x*TL+16+sw2,y*TL+2-Math.sin(t/400+y)*3,2.5,0,Math.PI*2);c.fill();}}
    // Collect torch positions and lit state
    const torches=[];let totalTorches=0;
    for(let y=0;y<RO;y++)for(let x=0;x<CO;x++)if(m[y][x]===T.TORCH){totalTorches++;const lit=isDkRm?s.litTorches.has(`${x},${y}`):true;torches.push([x*TL+16,y*TL+16,lit]);}
    // Lit torches glow
    for(const[tx2,ty2,lit]of torches){if(!lit)continue;
      const flk=Math.sin(t/200+tx2)*0.08+Math.sin(t/130+ty2)*0.05;
      const r2=90+Math.sin(t/180+tx2*0.1)*15;
      const tg=c.createRadialGradient(tx2,ty2,4,tx2,ty2,r2);
      tg.addColorStop(0,`rgba(255,200,100,${0.18+flk})`);tg.addColorStop(0.5,`rgba(255,150,50,${0.06+flk*0.3})`);tg.addColorStop(1,"rgba(255,100,30,0)");
      c.fillStyle=tg;c.fillRect(tx2-r2,ty2-r2,r2*2,r2*2);}}
  if(iD){for(let i=0;i<15;i++){const dx2=hs(i,3,77)*W2,dy2=(hs(i,7,88)*H2+t/20)%H2;
    const da=0.15+Math.sin(t/600+i*2)*0.1;c.fillStyle=`rgba(200,180,140,${da})`;c.beginPath();c.arc(dx2+Math.sin(t/400+i)*8,dy2,0.8+hs(i,1,99)*0.8,0,Math.PI*2);c.fill();}}
  for(const e of s.en){const fl=e.fl>0&&Math.floor(e.fl/50)%2,sz=e.type==="boss"?ES*1.5:e.type==="miniboss"?ES*1.3:ES;
    if(e.spawnT>0){
      // Spawn animation — smoke puff and scale-in
      const sp=e.spawnT/400,ease=1-sp;const cx3=e.x+ES/2,cy3=e.y+ES/2;
      // Smoke puffs
      for(let j=0;j<5;j++){const sa=j*Math.PI*2/5+sp*3,sr=12*(1-ease*0.5);
        const ga=0.4*sp;c.fillStyle=`rgba(200,200,200,${ga})`;
        c.beginPath();c.arc(cx3+Math.cos(sa)*sr,cy3+Math.sin(sa)*sr,5+sp*4,0,Math.PI*2);c.fill();}
      // Enemy scaling in
      c.save();c.translate(cx3,cy3);c.scale(ease,ease);c.globalAlpha=ease;c.translate(-cx3,-cy3);
      const ex=e.x+(ES-sz)/2,ey=e.y+(ES-sz)/2;
      if(e.type==="ghost")dGh(c,ex,ey,sz,false,t);else if(e.type==="boss")dBo(c,ex,ey,sz,false,t,e.hp,e.mhp,loc.di);
      else if(e.type==="miniboss")dSk(c,ex,ey,sz,false,t);
      else if(e.type==="bat"||e.type==="fire_bat")dBt(c,ex,ey,sz,false,t,e.type==="fire_bat");
      else if(e.type==="archer")dAr(c,ex,ey,sz,false,t);
      else if(e.type==="mage")dMg(c,ex,ey,sz,false,t);
      else if(e.type==="knight")dKn(c,ex,ey,sz,false,t);
      else dSk(c,ex,ey,sz,false,t);
      c.globalAlpha=1;c.restore();continue;}
    const ex=e.x+(ES-sz)/2,ey=e.y+(ES-sz)/2;
    c.fillStyle="rgba(0,0,0,0.15)";c.beginPath();c.ellipse(e.x+ES/2+3,e.y+ES-1,sz/2+1,4,0.1,0,Math.PI*2);c.fill();
    if(e.type==="ghost")dGh(c,ex,ey,sz,fl,t);else if(e.type==="boss")dBo(c,ex,ey,sz,fl,t,e.hp,e.mhp,loc.di);
    else if(e.type==="miniboss"){
      // Draw miniboss — armored skeleton, larger, with HP bar and aura
      const mbPh=Math.floor(e.mt/2500)%3;const charging=mbPh===2;
      const auraA=charging?0.25:0.1+Math.sin(t/300)*0.05;
      c.fillStyle=`rgba(200,50,50,${auraA})`;c.beginPath();c.arc(ex+sz/2,ey+sz/2,sz*0.7,0,Math.PI*2);c.fill();
      dSk(c,ex,ey,sz,fl,t);
      // Armor overlay
      c.fillStyle=fl?"#fff":"#8a4a2a";c.fillRect(ex+sz*0.15,ey+sz*0.3,sz*0.7,sz*0.25);
      c.fillStyle=fl?"#fff":"#666";c.fillRect(ex+sz*0.35,ey+sz*0.05,sz*0.3,sz*0.15);
      // Glowing eyes
      if(!fl){c.fillStyle=charging?"#f33":"#fa3";c.beginPath();c.arc(ex+sz*0.35,ey+sz*0.18,2,0,Math.PI*2);c.fill();
        c.beginPath();c.arc(ex+sz*0.65,ey+sz*0.18,2,0,Math.PI*2);c.fill();}
      // HP bar
      const hbw=sz+6,hbx=ex-3,hby=ey-8;c.fillStyle="#000";c.fillRect(hbx,hby,hbw,4);
      c.fillStyle=e.hp>e.mhp*0.3?"#f80":"#f22";c.fillRect(hbx+1,hby+1,Math.max(0,(hbw-2)*e.hp/e.mhp),2);
    }
    else if(e.type==="bat"||e.type==="fire_bat")dBt(c,ex,ey,sz,fl,t,e.type==="fire_bat");
    else if(e.type==="archer")dAr(c,ex,ey,sz,fl,t);
    else if(e.type==="mage")dMg(c,ex,ey,sz,fl,t);
    else if(e.type==="knight")dKn(c,ex,ey,sz,fl,t);
    else dSk(c,ex,ey,sz,fl,t);}
  // Draw blade traps
  for(const bt of s.bladeTraps){const bx=bt.x,by=bt.y,lunging=bt.st==="lunge";
    // Shadow
    c.fillStyle="rgba(0,0,0,0.3)";c.beginPath();c.ellipse(bx+TL/2+2,by+TL-2,TL/2,4,0,0,Math.PI*2);c.fill();
    // Metal body
    c.fillStyle=lunging?"#888":"#666";c.fillRect(bx+2,by+2,TL-4,TL-4);
    c.fillStyle=lunging?"#999":"#777";c.fillRect(bx+4,by+4,TL-8,TL-8);
    // Cross pattern
    c.fillStyle=lunging?"#aaa":"#555";c.fillRect(bx+TL/2-2,by+4,4,TL-8);c.fillRect(bx+4,by+TL/2-2,TL-8,4);
    // Spikes on edges
    c.fillStyle=lunging?"#ccc":"#888";
    const sp2=[[TL/2,1],[TL/2,TL-3],[1,TL/2],[TL-3,TL/2],[4,4],[TL-6,4],[4,TL-6],[TL-6,TL-6]];
    for(const[sx2,sy2]of sp2){c.beginPath();c.arc(bx+sx2,by+sy2,2.5,0,Math.PI*2);c.fill();}
    // Red eye when lunging
    if(lunging){c.fillStyle="#f33";c.beginPath();c.arc(bx+TL/2,by+TL/2,3,0,Math.PI*2);c.fill();
      c.fillStyle="#fff";c.beginPath();c.arc(bx+TL/2-1,by+TL/2-1,1,0,Math.PI*2);c.fill();}
    // Border
    c.strokeStyle=lunging?"#aaa":"#555";c.lineWidth=1.5;c.strokeRect(bx+2,by+2,TL-4,TL-4);}
  // Draw NPCs
  if(!iD){const npcs=NPC_DATA[loc.scr];if(npcs){for(const npc of npcs){
    const nx=npc.tx*TL,ny=npc.ty*TL;
    c.fillStyle="rgba(0,0,0,0.15)";c.beginPath();c.ellipse(nx+16,ny+28,10,3,0,0,Math.PI*2);c.fill();
    const robe=npc.name.includes("Witch")?"#6a2a8a":npc.name.includes("Fire")?"#aa3322":npc.name.includes("Dark")?"#444":npc.name.includes("Fisher")?"#3366aa":"#336633";
    c.fillStyle=robe;c.beginPath();c.moveTo(nx+8,ny+12);c.lineTo(nx+24,ny+12);c.lineTo(nx+26,ny+30);c.lineTo(nx+6,ny+30);c.fill();
    c.fillStyle="#f0c8a0";c.beginPath();c.arc(nx+16,ny+10,7,0,Math.PI*2);c.fill();
    if(npc.name.includes("Sage")||npc.name.includes("Hermit")){
      c.fillStyle="#ccc";c.beginPath();c.arc(nx+16,ny+8,8,Math.PI,0);c.fill();
      c.fillStyle="#888";c.fillRect(nx+13,ny+14,6,2);
    }else if(npc.name.includes("Witch")){
      c.fillStyle="#333";c.beginPath();c.moveTo(nx+8,ny+8);c.lineTo(nx+16,ny-4);c.lineTo(nx+24,ny+8);c.fill();
    }else{c.fillStyle="#654321";c.beginPath();c.arc(nx+16,ny+7,7,Math.PI+0.3,-0.3);c.fill();}
    c.fillStyle="#222";c.beginPath();c.arc(nx+13,ny+10,1.5,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(nx+19,ny+10,1.5,0,Math.PI*2);c.fill();
    const bob=Math.sin(t/300)*3;
    c.fillStyle="#fd3";c.font="bold 10px monospace";c.textAlign="center";
    c.fillText("!",nx+16,ny-4+bob);c.textAlign="left";}}}
  for(const bp of s.bProj){
    if(bp.type==="root"){c.fillStyle="#3a6a18";c.beginPath();c.arc(bp.x,bp.y,5,0,Math.PI*2);c.fill();
      c.fillStyle="#5a9a28";c.beginPath();c.arc(bp.x-1,bp.y-1,3,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(58,106,24,0.3)";c.beginPath();c.arc(bp.x-bp.dx*2,bp.y-bp.dy*2,3,0,Math.PI*2);c.fill();
    }else if(bp.type==="fire"){const fg=c.createRadialGradient(bp.x,bp.y,1,bp.x,bp.y,6);
      fg.addColorStop(0,"#ff8");fg.addColorStop(0.5,"#f60");fg.addColorStop(1,"rgba(200,0,0,0)");c.fillStyle=fg;c.beginPath();c.arc(bp.x,bp.y,6,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(255,100,0,0.3)";c.beginPath();c.arc(bp.x-bp.dx*2,bp.y-bp.dy*2,4,0,Math.PI*2);c.fill();
    }else if(bp.type==="shadow"){const sg=c.createRadialGradient(bp.x,bp.y,1,bp.x,bp.y,5);
      sg.addColorStop(0,"#c8f");sg.addColorStop(0.6,"#60c");sg.addColorStop(1,"rgba(40,0,80,0)");c.fillStyle=sg;c.beginPath();c.arc(bp.x,bp.y,5,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(100,0,200,0.3)";c.beginPath();c.arc(bp.x-bp.dx*2,bp.y-bp.dy*2,3,0,Math.PI*2);c.fill();
    }else if(bp.type==="arrow"){
      const aa=Math.atan2(bp.dy,bp.dx);
      c.save();c.translate(bp.x,bp.y);c.rotate(aa);
      c.strokeStyle="#8a6a30";c.lineWidth=2;c.beginPath();c.moveTo(-8,0);c.lineTo(6,0);c.stroke();
      c.fillStyle="#aaa";c.beginPath();c.moveTo(6,0);c.lineTo(4,-2);c.lineTo(4,2);c.fill();
      c.restore();}}
  for(const pa of s.pArrows){
    const aa=Math.atan2(pa.dy,pa.dx);
    c.save();c.translate(pa.x,pa.y);c.rotate(aa);
    c.strokeStyle="#fd3";c.lineWidth=2;c.beginPath();c.moveTo(-10,0);c.lineTo(8,0);c.stroke();
    c.fillStyle="#fff";c.beginPath();c.moveTo(8,0);c.lineTo(5,-3);c.lineTo(5,3);c.fill();
    c.fillStyle="rgba(253,211,51,0.3)";c.beginPath();c.moveTo(-10,0);c.lineTo(-18,3);c.lineTo(-18,-3);c.fill();
    c.restore();}
  // Draw active bombs
  for(const ab of s.activeBombs){const prog=ab.t/ab.fuse;
    if(!ab.exploded){
      // Bomb body — grows slightly as fuse burns
      const sc=1+prog*0.3,bsz=8*sc;
      const flash=prog>0.7&&Math.sin(ab.t/(prog>0.9?40:80))>0;
      // Shadow
      c.fillStyle="rgba(0,0,0,0.3)";c.beginPath();c.ellipse(ab.x+1,ab.y+bsz+2,bsz*0.8,3,0,0,Math.PI*2);c.fill();
      // Body
      c.fillStyle=flash?"#fff":"#333";c.beginPath();c.arc(ab.x,ab.y,bsz,0,Math.PI*2);c.fill();
      if(!flash){c.fillStyle="#444";c.beginPath();c.arc(ab.x-bsz*0.2,ab.y-bsz*0.2,bsz*0.6,0,Math.PI*2);c.fill();}
      // Fuse
      const fuseLen=8*(1-prog);
      c.strokeStyle="#8B6B3A";c.lineWidth=2;c.beginPath();c.moveTo(ab.x,ab.y-bsz);
      c.quadraticCurveTo(ab.x+4,ab.y-bsz-fuseLen*0.5,ab.x+2,ab.y-bsz-fuseLen);c.stroke();
      // Spark at fuse tip
      const spSz=2+Math.sin(ab.t/30)*1.5;
      c.fillStyle="#fd3";c.beginPath();c.arc(ab.x+2,ab.y-bsz-fuseLen,spSz,0,Math.PI*2);c.fill();
      c.fillStyle="#fff";c.beginPath();c.arc(ab.x+2,ab.y-bsz-fuseLen,spSz*0.4,0,Math.PI*2);c.fill();
      // Smoke wisps from fuse
      if(prog>0.2){const sm=Math.sin(ab.t/100)*3;
        c.fillStyle="rgba(180,180,180,0.3)";c.beginPath();c.arc(ab.x+2+sm,ab.y-bsz-fuseLen-6,3+prog*2,0,Math.PI*2);c.fill();}
      // Warning ring when about to explode
      if(prog>0.8){const ra=((prog-0.8)/0.2)*0.6;
        c.strokeStyle=`rgba(255,100,0,${ra})`;c.lineWidth=2;c.setLineDash([4,4]);
        c.beginPath();c.arc(ab.x,ab.y,TL*3,0,Math.PI*2);c.stroke();c.setLineDash([]);}
    }else{
      // Explosion flash
      const et=ab.t-ab.fuse,ep=Math.min(1,et/400);
      const er=TL*3*(0.5+ep*0.5);
      c.globalAlpha=1-ep;
      c.fillStyle="#fff";c.beginPath();c.arc(ab.x,ab.y,er*0.3*(1-ep*0.5),0,Math.PI*2);c.fill();
      c.fillStyle=`rgba(255,150,0,${0.6*(1-ep)})`;c.beginPath();c.arc(ab.x,ab.y,er*0.6,0,Math.PI*2);c.fill();
      c.fillStyle=`rgba(255,80,0,${0.3*(1-ep)})`;c.beginPath();c.arc(ab.x,ab.y,er,0,Math.PI*2);c.fill();
      c.globalAlpha=1;}}
  // Draw chest
  if(s.chest){const ch=s.chest,cx2=ch.x,cy2=ch.y;
    if(ch.state==="closed"){
      // Shadow
      c.fillStyle="rgba(0,0,0,0.25)";c.beginPath();c.ellipse(cx2+12,cy2+24,14,4,0,0,Math.PI*2);c.fill();
      // Chest body
      c.fillStyle="#8B5A2B";c.fillRect(cx2,cy2+8,24,16);
      c.fillStyle="#6B3A1B";c.fillRect(cx2,cy2+8,24,3);
      // Lid
      c.fillStyle="#A0682C";c.fillRect(cx2-1,cy2+2,26,8);c.fillRect(cx2,cy2,24,4);
      // Metal trim
      c.fillStyle="#ffd633";c.fillRect(cx2+10,cy2+12,4,8);c.fillRect(cx2+9,cy2+13,6,3);
      // Highlight
      c.fillStyle="rgba(255,255,255,0.12)";c.fillRect(cx2+2,cy2+4,20,2);
      // Glow pulse
      const cgl=Math.sin(t/300)*0.15+0.2;c.fillStyle=`rgba(253,211,51,${cgl})`;c.beginPath();c.arc(cx2+12,cy2+12,16,0,Math.PI*2);c.fill();
      // Action prompt when near
      if(ch.near){const pa=Math.sin(t/300)*0.3+0.7;c.fillStyle=`rgba(255,255,255,${pa})`;c.font="bold 9px monospace";c.textAlign="center";
        c.fillText("OPEN",cx2+12,cy2-6);c.fillStyle=`rgba(253,211,51,${pa*0.6})`;c.fillText("[SPACE]",cx2+12,cy2+34);c.textAlign="left";}
    }else if(ch.state==="opening"){
      const p2=Math.min(1,ch.t/600),ease=1-(1-p2)*(1-p2);
      // Shadow
      c.fillStyle="rgba(0,0,0,0.25)";c.beginPath();c.ellipse(cx2+12,cy2+24,14,4,0,0,Math.PI*2);c.fill();
      // Chest body
      c.fillStyle="#8B5A2B";c.fillRect(cx2,cy2+8,24,16);
      c.fillStyle="#6B3A1B";c.fillRect(cx2,cy2+8,24,3);
      // Lid opening — rotates up
      c.save();c.translate(cx2,cy2+10);c.rotate(-ease*Math.PI*0.4);c.translate(-cx2,-(cy2+10));
      c.fillStyle="#A0682C";c.fillRect(cx2-1,cy2+2,26,8);c.fillRect(cx2,cy2,24,4);
      c.fillStyle="rgba(255,255,255,0.12)";c.fillRect(cx2+2,cy2+4,20,2);
      c.restore();
      // Metal trim
      c.fillStyle="#ffd633";c.fillRect(cx2+10,cy2+12,4,8);c.fillRect(cx2+9,cy2+13,6,3);
      // Glow burst growing as it opens
      const bg=ease*0.6;c.fillStyle=`rgba(253,211,51,${bg})`;c.beginPath();c.arc(cx2+12,cy2+4,8+ease*12,0,Math.PI*2);c.fill();
      // Light rays
      for(let r=0;r<6;r++){const ra=r*Math.PI/3+t/500;const rl=ease*20;
        c.strokeStyle=`rgba(253,211,51,${ease*0.4})`;c.lineWidth=2;
        c.beginPath();c.moveTo(cx2+12,cy2+4);c.lineTo(cx2+12+Math.cos(ra)*rl,cy2+4+Math.sin(ra)*rl);c.stroke();}
    }else if(ch.state==="presenting"){
      // Open chest with item rising above
      c.fillStyle="rgba(0,0,0,0.2)";c.beginPath();c.ellipse(cx2+12,cy2+24,14,4,0,0,Math.PI*2);c.fill();
      c.fillStyle="#7A4A1B";c.fillRect(cx2,cy2+8,24,16);
      c.fillStyle="#5B2A0B";c.fillRect(cx2+2,cy2+10,20,12);
      c.fillStyle="#8A582C";c.fillRect(cx2-1,cy2-2,26,6);
      c.fillStyle="#cc9922";c.fillRect(cx2+10,cy2+12,4,6);
      // Light column from chest
      const iy=ch.itemY||0;
      c.fillStyle="rgba(253,211,51,0.12)";c.beginPath();c.moveTo(cx2+4,cy2);c.lineTo(cx2+20,cy2);c.lineTo(cx2+16,cy2-iy-10);c.lineTo(cx2+8,cy2-iy-10);c.fill();
      // Rising reward icon
      const rix=cx2+12,riy=cy2-iy;const bob3=Math.sin(t/150)*2;
      c.fillStyle=`rgba(253,211,51,0.4)`;c.beginPath();c.arc(rix,riy+bob3,10,0,Math.PI*2);c.fill();
      // Draw reward type icon
      if(ch.reward==="heart"){c.fillStyle="#ee3333";dH(c,rix-6,riy-6+bob3,12);}
      else if(ch.reward==="bomb"){c.fillStyle="#333";c.beginPath();c.arc(rix,riy+bob3,5,0,Math.PI*2);c.fill();c.fillStyle="#f80";c.beginPath();c.arc(rix+2,riy-5+bob3,2,0,Math.PI*2);c.fill();}
      else if(ch.reward==="rupee_blue"||ch.reward==="rupee_green"){const rc=ch.reward==="rupee_blue"?"#44f":"#4f4";c.fillStyle=rc;c.beginPath();c.moveTo(rix,riy-5+bob3);c.lineTo(rix+4,riy+bob3);c.lineTo(rix,riy+5+bob3);c.lineTo(rix-4,riy+bob3);c.fill();}
      else{c.fillStyle="#fd3";c.beginPath();c.arc(rix,riy+bob3,6,0,Math.PI*2);c.fill();}
    }else{
      // Open chest (empty)
      c.fillStyle="rgba(0,0,0,0.2)";c.beginPath();c.ellipse(cx2+12,cy2+24,14,4,0,0,Math.PI*2);c.fill();
      c.fillStyle="#7A4A1B";c.fillRect(cx2,cy2+8,24,16);
      c.fillStyle="#5B2A0B";c.fillRect(cx2+2,cy2+10,20,12);
      c.fillStyle="#8A582C";c.fillRect(cx2-1,cy2-2,26,6);
      c.fillStyle="#cc9922";c.fillRect(cx2+10,cy2+12,4,6);}}
  for(const d2 of s.drops){const bob2=Math.sin(t/200)*2;
    if(d2.type==="heart"){c.fillStyle="#ee3333";dH(c,d2.x-6,d2.y-6+bob2,12);c.fillStyle="#ff8888";dH(c,d2.x-3,d2.y-4+bob2,6);}
    else if(d2.type==="heartcontainer"){
      const hcg=Math.sin(t/150)*0.2+0.4;c.fillStyle=`rgba(255,50,50,${hcg})`;c.beginPath();c.arc(d2.x,d2.y+bob2,12,0,Math.PI*2);c.fill();
      c.fillStyle="#ff2222";dH(c,d2.x-8,d2.y-8+bob2,16);c.fillStyle="#ff8888";dH(c,d2.x-4,d2.y-5+bob2,8);
      c.fillStyle="#fff";dH(c,d2.x-2,d2.y-3+bob2,4);}
    else if(d2.type==="triforce"){const falling=d2.y<d2.ground;
      const tg2=Math.sin(t/150)*0.3+0.7;
      // Light beam from above while falling
      if(falling){c.fillStyle=`rgba(253,211,51,${0.08+Math.sin(t/200)*0.03})`;
        c.beginPath();c.moveTo(d2.x-6,-10);c.lineTo(d2.x+6,-10);c.lineTo(d2.x+14,d2.y+10);c.lineTo(d2.x-14,d2.y+10);c.fill();}
      // Larger glow
      const gr=falling?20:14;c.fillStyle=`rgba(253,211,51,${tg2*0.3})`;c.beginPath();c.arc(d2.x,d2.y+bob2,gr,0,Math.PI*2);c.fill();
      if(falling){c.fillStyle=`rgba(255,255,200,${0.15})`;c.beginPath();c.arc(d2.x,d2.y+bob2,gr+8,0,Math.PI*2);c.fill();}
      // Spinning triangle
      c.save();c.translate(d2.x,d2.y+bob2);
      if(d2.spin!=null&&falling)c.rotate(d2.spin*Math.PI/180);
      c.fillStyle="#ffd633";c.beginPath();c.moveTo(0,-10);c.lineTo(12,10);c.lineTo(-12,10);c.fill();
      c.fillStyle="#ffe866";c.beginPath();c.moveTo(0,-6);c.lineTo(7,6);c.lineTo(-7,6);c.fill();
      c.fillStyle="#fff";c.globalAlpha=0.4;c.beginPath();c.moveTo(0,-4);c.lineTo(3,2);c.lineTo(-3,2);c.fill();c.globalAlpha=1;
      c.restore();}
    else if(d2.type==="rupee_green"||d2.type==="rupee_blue"||d2.type==="rupee_red"){
      const rc=d2.type==="rupee_green"?"#4f4":d2.type==="rupee_blue"?"#44f":"#f44";
      const rg=Math.sin(t/200)*0.2+0.3;c.fillStyle=rc.replace("4","8").replace("f","a");c.globalAlpha=rg;c.beginPath();c.arc(d2.x,d2.y+bob2,8,0,Math.PI*2);c.fill();c.globalAlpha=1;
      c.fillStyle=rc;c.beginPath();c.moveTo(d2.x,d2.y-5+bob2);c.lineTo(d2.x+4,d2.y+bob2);c.lineTo(d2.x,d2.y+5+bob2);c.lineTo(d2.x-4,d2.y+bob2);c.closePath();c.fill();
      c.fillStyle="#fff";c.globalAlpha=0.4;c.beginPath();c.moveTo(d2.x,d2.y-3+bob2);c.lineTo(d2.x+2,d2.y+bob2);c.lineTo(d2.x,d2.y+bob2);c.closePath();c.fill();c.globalAlpha=1;}
    else{c.fillStyle="#444";c.beginPath();c.arc(d2.x,d2.y+bob2,5,0,Math.PI*2);c.fill();c.fillStyle="#666";c.beginPath();c.arc(d2.x,d2.y-1+bob2,4,0,Math.PI*2);c.fill();}}
  if(s.death.a){const da=Math.min(1,s.death.t/1500);c.globalAlpha=1-da;
    c.save();c.translate(p.x+PS/2,p.y+PS/2);c.rotate(s.death.spin);c.translate(-PS/2,-PS/2);
    dP(c,0,0,p.dir,t);c.restore();c.globalAlpha=1;
  }else{const vis=p.ifr<=0||Math.floor(p.ifr/80)%2;
    if(vis){
      c.fillStyle="rgba(0,0,0,0.18)";c.beginPath();c.ellipse(p.x+PS/2+2,p.y+PS-1,10,3,0.08,0,Math.PI*2);c.fill();
      dP(c,p.x,p.y,p.dir,t);
      if(s.p.shield){
        const sx=p.x+PS/2,sy=p.y+PS/2;
        const sd=p.dir,so=12;
        const sdx=sd===1?so:sd===3?-so:0,sdy=sd===0?-so:sd===2?so:0;
        const sg=c.createRadialGradient(sx+sdx,sy+sdy,2,sx+sdx,sy+sdy,10);
        sg.addColorStop(0,"#8888cc");sg.addColorStop(0.6,"#5555aa");sg.addColorStop(1,"#333388");
        c.fillStyle=sg;
        if(sd===0||sd===2){c.beginPath();c.ellipse(sx+sdx,sy+sdy,8,5,0,0,Math.PI*2);c.fill();}
        else{c.beginPath();c.ellipse(sx+sdx,sy+sdy,5,8,0,0,Math.PI*2);c.fill();}
        c.strokeStyle="rgba(200,200,255,0.5)";c.lineWidth=1;
        if(sd===0||sd===2){c.beginPath();c.ellipse(sx+sdx,sy+sdy,8,5,0,0,Math.PI*2);c.stroke();}
        else{c.beginPath();c.ellipse(sx+sdx,sy+sdy,5,8,0,0,Math.PI*2);c.stroke();}}
      if(m&&!iD){const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);
        for(let dy2=-1;dy2<=1;dy2++)for(let dx2=-1;dx2<=1;dx2++){const gx=ptx+dx2,gy=pty+dy2;
          if(gx>=0&&gx<CO&&gy>=0&&gy<RO&&(m[gy][gx]===T.TALLGRASS||m[gy][gx]===T.GRASS)){
            const dist=Math.hypot(p.x+PS/2-gx*TL-16,p.y+PS/2-gy*TL-16);
            if(dist<30){const sway=Math.sin(t/100+gx*3)*3*(1-dist/30);
              c.fillStyle=m[gy][gx]===T.TALLGRASS?"rgba(80,180,50,0.4)":"rgba(60,160,40,0.2)";
              c.beginPath();c.moveTo(gx*TL+8+sway,gy*TL+4);c.lineTo(gx*TL+16,gy*TL+TL-4);c.lineTo(gx*TL+24+sway,gy*TL+4);c.fill();}}}}
    }}
  if(p.burn>0){const ba=Math.sin(t/100)*0.3+0.4;
    for(let i=0;i<3;i++){const fx=p.x+PS/2+(Math.random()-.5)*16,fy=p.y+4+Math.random()*12;
      c.fillStyle=`rgba(255,${100+Math.random()*100|0},0,${ba})`;c.beginPath();c.arc(fx,fy-Math.sin(t/80+i)*4,2+Math.random()*2,0,Math.PI*2);c.fill();}}
  if(p.freeze>0){const fa=Math.min(1,p.freeze/1000)*0.35;
    c.fillStyle=`rgba(100,180,255,${fa})`;c.beginPath();c.arc(p.x+PS/2,p.y+PS/2,PS*0.7,0,Math.PI*2);c.fill();
    for(let i=0;i<4;i++){const cx2=p.x+PS/2+Math.cos(t/200+i*1.5)*12,cy2=p.y+PS/2+Math.sin(t/200+i*1.5)*12;
      c.fillStyle=`rgba(200,230,255,${fa*1.5})`;c.fillRect(cx2-1,cy2-1,3,3);}}
  if(p.poison>0){const pa=Math.sin(t/200)*0.2+0.3;
    c.fillStyle=`rgba(80,200,40,${pa})`;c.beginPath();c.arc(p.x+PS/2,p.y+PS/2,PS*0.6,0,Math.PI*2);c.fill();
    for(let i=0;i<2;i++){const bx=p.x+PS/2+(Math.random()-.5)*12,by=p.y+PS/2-Math.sin(t/150+i*2)*8;
      c.fillStyle=`rgba(60,180,30,${pa*1.2})`;c.beginPath();c.arc(bx,by,1.5,0,Math.PI*2);c.fill();}}
  if(s.sw.a)dSw(c,p.x,p.y,p.dir,s.sw.t);
  for(const pt of s.pt){const pa=Math.min(1,pt.l/500);c.globalAlpha=pa;
    const psz=1+pt.l/800;
    c.fillStyle=pt.c;c.globalAlpha=pa*0.3;c.beginPath();c.arc(pt.x,pt.y,psz*2.5,0,Math.PI*2);c.fill();
    c.globalAlpha=pa;c.beginPath();c.arc(pt.x,pt.y,psz,0,Math.PI*2);c.fill();
    c.fillStyle="#fff";c.globalAlpha=pa*0.5;c.beginPath();c.arc(pt.x,pt.y,psz*0.4,0,Math.PI*2);c.fill();}c.globalAlpha=1;
  for(const dn of s.dmgNums){c.globalAlpha=Math.min(1,dn.t/300);c.fillStyle=dn.c;c.font="bold 12px monospace";c.textAlign="center";c.fillText(dn.val,dn.x,dn.y);c.textAlign="left";}c.globalAlpha=1;
  if(s.roomFlash>0){c.fillStyle=`rgba(255,255,200,${s.roomFlash/500*0.25})`;c.fillRect(0,0,W2,H2);}
  // Dungeon darkness — dark until torches are lit
  // Only dark rooms flagged with dark:true in room data
  const isDarkRoom=loc.ty==="dg"&&s.dg[loc.di]?.rooms[loc.scr]?.dark;
  if(iD&&m&&isDarkRoom){let totalT2=0,litT2=0;
    for(let y=0;y<RO;y++)for(let x=0;x<CO;x++)if(m[y][x]===T.TORCH){totalT2++;if(s.litTorches.has(`${x},${y}`))litT2++;}
    if(totalT2>0){const darkPct=1-litT2/totalT2;const darkness=darkPct*0.55;
      if(darkness>0.01){
        // Draw darkness layer
        c.fillStyle=`rgba(0,0,0,${darkness})`;c.fillRect(0,0,W2,H2);
        // Cut light circles around player and lit torches
        c.save();c.globalCompositeOperation="destination-out";
        // Player light (small personal glow)
        const plr=40+litT2*8;const pg=c.createRadialGradient(p.x+PS/2,p.y+PS/2,0,p.x+PS/2,p.y+PS/2,plr);
        pg.addColorStop(0,`rgba(0,0,0,${darkness*0.9})`);pg.addColorStop(0.7,`rgba(0,0,0,${darkness*0.4})`);pg.addColorStop(1,"rgba(0,0,0,0)");
        c.fillStyle=pg;c.fillRect(p.x+PS/2-plr,p.y+PS/2-plr,plr*2,plr*2);
        // Lit torch lights
        for(let y=0;y<RO;y++)for(let x=0;x<CO;x++){if(m[y][x]===T.TORCH&&s.litTorches.has(`${x},${y}`)){
          const tx3=x*TL+16,ty3=y*TL+16,tr=80+Math.sin(t/200+x)*10;
          const tgg=c.createRadialGradient(tx3,ty3,0,tx3,ty3,tr);
          tgg.addColorStop(0,`rgba(0,0,0,${darkness})`);tgg.addColorStop(0.6,`rgba(0,0,0,${darkness*0.5})`);tgg.addColorStop(1,"rgba(0,0,0,0)");
          c.fillStyle=tgg;c.fillRect(tx3-tr,ty3-tr,tr*2,tr*2);}}
        c.restore();}}}
  if(!iD){const amb=Math.sin(t/15000)*0.03;
    c.fillStyle=amb>0?`rgba(255,200,100,${amb})`:`rgba(100,150,255,${-amb})`;c.fillRect(0,0,W2,H2);}
  const vig=c.createRadialGradient(W2/2,H2/2,W2*0.3,W2/2,H2/2,W2*0.75);
  vig.addColorStop(0,"rgba(0,0,0,0)");vig.addColorStop(0.7,iD?"rgba(0,0,0,0.15)":"rgba(0,0,0,0)");vig.addColorStop(1,iD?"rgba(0,0,0,0.4)":"rgba(0,0,10,0.12)");
  c.fillStyle=vig;c.fillRect(0,0,W2,H2);
  if(iD){
    // Simple minimap — always show when in dungeon or cave
    const dgRooms=dg&&dg.rooms?Object.keys(dg.rooms).filter(k=>{const p2=k.split(",");return p2.length===2&&!isNaN(+p2[0])&&!isNaN(+p2[1]);}):[];
    if(dgRooms.length>0){
      const cds=dgRooms.map(k=>k.split(",").map(Number));
      const nX=Math.min(...cds.map(c2=>c2[0])),xX=Math.max(...cds.map(c2=>c2[0])),nY=Math.min(...cds.map(c2=>c2[1])),xY=Math.max(...cds.map(c2=>c2[1]));
      const ms=12,mp=4,mW=(xX-nX+1)*ms+mp*2,mH=(xY-nY+1)*ms+mp*2;
      const mmX=W2-mW-4,mmY=4;
      c.globalAlpha=0.6;
      c.fillStyle="rgba(0,0,0,0.5)";c.fillRect(mmX-2,mmY-2,mW+4,mH+4);
      c.strokeStyle="rgba(253,211,51,0.5)";c.lineWidth=1;c.strokeRect(mmX-2,mmY-2,mW+4,mH+4);
      for(const rk of dgRooms){const[cx,cy]=rk.split(",").map(Number);
        const rx=mmX+mp+(cx-nX)*ms,ry=mmY+mp+(cy-nY)*ms;
        if(rk===loc.scr){c.fillStyle="#fd3";c.fillRect(rx+1,ry+1,ms-2,ms-2);}
        else{c.fillStyle="#335";c.fillRect(rx+1,ry+1,ms-2,ms-2);}
        c.strokeStyle="rgba(255,255,255,0.15)";c.lineWidth=1;c.strokeRect(rx+1,ry+1,ms-2,ms-2);}
      c.globalAlpha=1;
    }}
  if(!iD){const owKeys=Object.keys(OW);const owC=owKeys.map(k=>k.split(",").map(Number));
    const onX=Math.min(...owC.map(c2=>c2[0])),oxX=Math.max(...owC.map(c2=>c2[0])),onY=Math.min(...owC.map(c2=>c2[1])),oxY=Math.max(...owC.map(c2=>c2[1]));
    const os=14,op=4,oW=(oxX-onX+1)*os+op*2,oH=(oxY-onY+1)*os+op*2,omX=W2-oW-8,omY=H2-oH-8;
    c.fillStyle="rgba(0,0,0,0.65)";c.fillRect(omX-1,omY-1,oW+2,oH+2);c.strokeStyle="rgba(255,255,255,0.1)";c.strokeRect(omX-1,omY-1,oW+2,oH+2);
    for(const ok of owKeys){const[cx2,cy2]=ok.split(",").map(Number);
      let col="#3a5a2a";if(ok==="2,0")col="#8a7a40";if(ok===loc.scr)col="#fd3";
      c.fillStyle=col;c.fillRect(omX+op+(cx2-onX)*os+1,omY+op+(cy2-onY)*os+1,os-2,os-2);
      for(const de2 of DE){if(de2.s===ok){c.fillStyle=ok===loc.scr?"#000":"#222";c.fillRect(omX+op+(cx2-onX)*os+os/2-2,omY+op+(cy2-onY)*os+os/2-2,4,4);}}}
    const pcx2=p.x+PS/2,pcy2=p.y+PS/2;let nearD=null,nearDist=Infinity;
    for(let di=0;di<3;di++){if(p.tri[di])continue;const de2=DE[di];
      const[dsx,dsy]=de2.s.split(",").map(Number);const[csx,csy]=loc.scr.split(",").map(Number);
      const ddx=(dsx-csx)*W2+de2.t[0][0]*TL-pcx2,ddy=(dsy-csy)*H2+de2.t[0][1]*TL-pcy2;
      const dd=Math.hypot(ddx,ddy);if(dd<nearDist){nearDist=dd;nearD={dx:ddx,dy:ddy};}}
    if(nearD){const ang=Math.atan2(nearD.dy,nearD.dx);const cr=8;const ccx=omX+oW/2,ccy=omY-12;
      c.fillStyle="#fd3";c.beginPath();c.moveTo(ccx+Math.cos(ang)*cr,ccy+Math.sin(ang)*cr);
      c.lineTo(ccx+Math.cos(ang+2.5)*cr*0.5,ccy+Math.sin(ang+2.5)*cr*0.5);
      c.lineTo(ccx+Math.cos(ang-2.5)*cr*0.5,ccy+Math.sin(ang-2.5)*cr*0.5);c.fill();}
  }
  if(s.timedDoors.length>0){const td=s.timedDoors[0];const pct=td.t/5000;
    c.fillStyle="rgba(0,0,0,0.7)";c.fillRect(W2/2-60,4,120,10);
    c.fillStyle=pct>0.3?"#f80":"#f22";c.fillRect(W2/2-58,6,Math.max(0,116*pct),6);
    c.fillStyle="#fff";c.font="bold 8px monospace";c.textAlign="center";c.fillText("TIMED!",W2/2,12);c.textAlign="left";}
  if(s.msg.t>0){c.font="bold 14px monospace";const mw=Math.min(c.measureText(s.msg.text).width+48,W2-32),my=H2-56;
    c.fillStyle="rgba(0,0,0,0.85)";const r2=8;c.beginPath();c.moveTo(W2/2-mw/2+r2,my);c.lineTo(W2/2+mw/2-r2,my);c.quadraticCurveTo(W2/2+mw/2,my,W2/2+mw/2,my+r2);c.lineTo(W2/2+mw/2,my+32-r2);c.quadraticCurveTo(W2/2+mw/2,my+32,W2/2+mw/2-r2,my+32);c.lineTo(W2/2-mw/2+r2,my+32);c.quadraticCurveTo(W2/2-mw/2,my+32,W2/2-mw/2,my+32-r2);c.lineTo(W2/2-mw/2,my+r2);c.quadraticCurveTo(W2/2-mw/2,my,W2/2-mw/2+r2,my);c.fill();
    c.strokeStyle="rgba(253,211,51,0.5)";c.stroke();c.fillStyle="#fff";c.textAlign="center";c.fillText(s.msg.text,W2/2,my+20);c.textAlign="left";}
  // NPC Dialogue box
  if(s.npcTalk){const dlg=s.npcTalk;
    const bx2=16,by2=H2-80,bw2=W2-32,bh2=70;
    c.fillStyle="rgba(0,0,20,0.92)";const r3=6;
    c.beginPath();c.moveTo(bx2+r3,by2);c.lineTo(bx2+bw2-r3,by2);c.quadraticCurveTo(bx2+bw2,by2,bx2+bw2,by2+r3);
    c.lineTo(bx2+bw2,by2+bh2-r3);c.quadraticCurveTo(bx2+bw2,by2+bh2,bx2+bw2-r3,by2+bh2);
    c.lineTo(bx2+r3,by2+bh2);c.quadraticCurveTo(bx2,by2+bh2,bx2,by2+bh2-r3);
    c.lineTo(bx2,by2+r3);c.quadraticCurveTo(bx2,by2,bx2+r3,by2);c.fill();
    c.strokeStyle="rgba(253,211,51,0.6)";c.lineWidth=2;
    c.beginPath();c.moveTo(bx2+r3,by2);c.lineTo(bx2+bw2-r3,by2);c.quadraticCurveTo(bx2+bw2,by2,bx2+bw2,by2+r3);
    c.lineTo(bx2+bw2,by2+bh2-r3);c.quadraticCurveTo(bx2+bw2,by2+bh2,bx2+bw2-r3,by2+bh2);
    c.lineTo(bx2+r3,by2+bh2);c.quadraticCurveTo(bx2,by2+bh2,bx2,by2+bh2-r3);
    c.lineTo(bx2,by2+r3);c.quadraticCurveTo(bx2,by2,bx2+r3,by2);c.stroke();
    c.lineWidth=1;
    c.fillStyle="#fd3";c.font="bold 11px monospace";c.textAlign="left";
    c.fillText(dlg.name,bx2+10,by2+16);
    c.fillStyle="#fff";c.font="12px monospace";
    const line=dlg.lines[dlg.idx];const shown=line.substring(0,dlg.charIdx);
    c.fillText(shown,bx2+10,by2+36);
    c.fillStyle="#888";c.font="9px monospace";c.textAlign="right";
    c.fillText(`${dlg.idx+1}/${dlg.lines.length}`,bx2+bw2-10,by2+16);
    if(dlg.charIdx>=line.length){const blink2=Math.sin(t/300)>0;
      if(blink2){c.fillStyle="#fd3";c.font="bold 10px monospace";c.textAlign="center";c.fillText("\u25bc",bx2+bw2/2,by2+bh2-8);}}
    c.textAlign="left";}
  c.restore(); // end clip
  c.restore(); // end game area offset
  const FH2=H2+HH;
  // Dungeon title overlay — fades in then out over 3 seconds
  if(s.dgTitle.t>0){const dt2=3000-s.dgTitle.t;// time elapsed
    let alpha=1;if(dt2<400)alpha=dt2/400;// fade in
    else if(s.dgTitle.t<800)alpha=s.dgTitle.t/800;// fade out
    // Dark backdrop
    c.fillStyle=`rgba(0,0,0,${alpha*0.5})`;c.fillRect(0,FH2*0.35,W2,FH2*0.3);
    // Title text
    c.globalAlpha=alpha;c.textAlign="center";
    c.fillStyle="#fd3";c.font="bold 28px monospace";c.fillText(s.dgTitle.text,W2/2,FH2/2);
    // Decorative line
    const lw=Math.min(c.measureText(s.dgTitle.text).width+40,W2-40);
    c.strokeStyle="rgba(253,211,51,0.5)";c.lineWidth=1;
    c.beginPath();c.moveTo(W2/2-lw/2,FH2/2+12);c.lineTo(W2/2+lw/2,FH2/2+12);c.stroke();
    c.textAlign="left";c.globalAlpha=1;}
  if(s.fade.a){c.fillStyle=`rgba(0,0,0,${s.fade.alpha})`;c.fillRect(0,0,W2,FH2);}
  if(s.paused&&!s.mapOpen){c.fillStyle="rgba(0,0,0,0.7)";c.fillRect(0,0,W2,FH2);
    c.textAlign="center";
    // Title
    c.fillStyle="#fd3";c.font="bold 24px monospace";c.fillText("PAUSED",W2/2,FH2/2-90);
    c.fillStyle="rgba(253,211,51,0.3)";c.fillRect(W2/2-80,FH2/2-82,160,1);
    // Menu items
    const mi=["Volume","Music","Save Game","Save & Quit"];
    const my=FH2/2-50;
    for(let i=0;i<mi.length;i++){const iy=my+i*32,sel=s.pauseSel===i;
      // Selection highlight
      if(sel){c.fillStyle="rgba(253,211,51,0.1)";c.fillRect(W2/2-120,iy-12,240,26);
        c.fillStyle="#fd3";c.font="bold 13px monospace";c.fillText("\u25b6",W2/2-110,iy+5);}
      c.fillStyle=sel?"#fff":"#888";c.font=sel?"bold 13px monospace":"13px monospace";
      if(i===0){
        // Volume slider
        c.fillText("Volume",W2/2-40,iy+5);
        const bx=W2/2+10,bw=80,by2=iy-3,bh2=10;
        c.fillStyle="#333";c.fillRect(bx,by2,bw,bh2);
        c.fillStyle=sel?"#fd3":"#666";c.fillRect(bx,by2,bw*s.volume/100,bh2);
        c.strokeStyle=sel?"#fd3":"#555";c.lineWidth=1;c.strokeRect(bx,by2,bw,bh2);
        c.fillStyle=sel?"#fff":"#888";c.font="10px monospace";c.fillText(`${s.volume}%`,bx+bw+16,iy+5);
        if(sel){c.fillStyle="#888";c.font="9px monospace";c.fillText("\u25c0 \u25b6",W2/2+60,iy+20);}
      }else if(i===1){c.fillText(`Music: ${muOn.value?"ON":"OFF"}`,W2/2,iy+5);
      }else{c.fillText(mi[i],W2/2,iy+5);}}
    // Controls reference
    const cy2=my+mi.length*32+16;
    c.fillStyle="rgba(255,255,255,0.15)";c.fillRect(W2/2-120,cy2,240,1);
    c.fillStyle="#666";c.font="10px monospace";
    c.fillText("CONTROLS",W2/2,cy2+16);
    c.fillStyle="#555";c.font="9px monospace";
    const ctrls=["WASD / Arrows \u2014 Move","Space \u2014 Attack","B \u2014 Bomb","C \u2014 Bow (1 rupee)","X / Shift \u2014 Shield","Tab \u2014 Map & Inventory","P \u2014 Pause","M \u2014 Toggle Music"];
    for(let i=0;i<ctrls.length;i++)c.fillText(ctrls[i],W2/2,cy2+30+i*13);
    c.textAlign="left";}
  if(s.mapOpen){c.fillStyle="rgba(0,0,10,0.92)";c.fillRect(0,0,W2,FH2);
    c.textAlign="center";
    c.fillStyle="#fd3";c.font="bold 18px monospace";c.fillText("MAP & INVENTORY",W2/2,24);
    c.fillStyle="rgba(253,211,51,0.3)";c.fillRect(W2/2-100,28,200,1);
    const mapY=40,mapH=160;
    if(s.loc.ty==="ow"||s.loc.ty==="cave"){
      const owKeys=Object.keys(OW);
      const onX=-1,oxX=4,onY=-1,oxY=2;
      const cW=32,cH=24,op=8,gW=(oxX-onX+1)*cW,gH=(oxY-onY+1)*cH;
      const oW=gW+op*2,oH=gH+op*2;
      const omX=W2/2-oW/2,omY=mapY+10;
      c.fillStyle="rgba(0,0,0,0.6)";c.fillRect(omX-2,omY-2,oW+4,oH+4);
      c.strokeStyle="rgba(253,211,51,0.3)";c.strokeRect(omX-2,omY-2,oW+4,oH+4);
      const tCols={[T.GRASS]:"#4aaa3a",[T.WATER]:"#2266aa",[T.TREE]:"#1a5a1a",[T.SAND]:"#d4b060",[T.PATH]:"#a08050",[T.ROCK]:"#777",[T.FLOWER]:"#4aaa3a",[T.BUSH]:"#2a7a2a",[T.TALLGRASS]:"#3a9a3a",[T.BRIDGE]:"#8b6914",[T.ICE]:"#aaddff",[T.ENTRANCE]:"#fd3",[T.WALL]:"#555",[T.CRACK]:"#666",[T.EMPTY]:"#222",[T.STUMP]:"#5a3a1a",[T.FLOOR]:"#555"};
      for(const ok of owKeys){
        const[cx2,cy2]=ok.split(",").map(Number);
        const rx=omX+op+(cx2-onX)*cW,ry=omY+op+(cy2-onY)*cH;
        const tiles=OW[ok];
        if(tiles){
          for(let ty2=0;ty2<12;ty2++)for(let tx2=0;tx2<16;tx2++){
            const tv=tiles[ty2]?.[tx2]??0;
            c.fillStyle=tCols[tv]||"#333";
            c.fillRect(rx+tx2*2,ry+ty2*2,2,2);
            if(tv===T.FLOWER){c.fillStyle=((tx2+ty2)%3===0)?"#f66":((tx2+ty2)%3===1)?"#ff6":"#f6f";c.fillRect(rx+tx2*2,ry+ty2*2,1,1);}
          }
        }else{c.fillStyle="#222";c.fillRect(rx,ry,cW,cH);}
        if(ok===s.loc.scr){c.strokeStyle="#fd3";c.lineWidth=2;c.strokeRect(rx-1,ry-1,cW+2,cH+2);c.lineWidth=1;}
      }
      c.strokeStyle="rgba(253,211,51,0.12)";c.lineWidth=1;
      for(let gx=0;gx<=oxX-onX+1;gx++){const lx=omX+op+gx*cW;c.beginPath();c.moveTo(lx,omY+op);c.lineTo(lx,omY+op+gH);c.stroke();}
      for(let gy=0;gy<=oxY-onY+1;gy++){const ly=omY+op+gy*cH;c.beginPath();c.moveTo(omX+op,ly);c.lineTo(omX+op+gW,ly);c.stroke();}
      for(const de2 of DE){const[dx,dy]=de2.s.split(",").map(Number);
        const ex=omX+op+(dx-onX)*cW+cW/2,ey=omY+op+(dy-onY)*cH+cH/2;
        c.fillStyle=de2.d===3?(s.finalOpen?"#f0f":"#444"):"#ff4";
        c.beginPath();c.arc(ex,ey,3,0,Math.PI*2);c.fill();}
      if(s.loc.ty==="ow"){
        const[px,py]=s.loc.scr.split(",").map(Number);
        const prx=omX+op+(px-onX)*cW+(s.p.x/(CO*TL))*cW;
        const pry=omY+op+(py-onY)*cH+(s.p.y/(RO*TL))*cH;
        const blink=Math.floor(Date.now()/300)%2===0;
        if(blink){c.fillStyle="#fff";c.beginPath();c.arc(prx,pry,2,0,Math.PI*2);c.fill();}
      }
      c.fillStyle="#aaa";c.font="10px monospace";c.fillText("OVERWORLD",W2/2,omY+oH+14);
    }else if(s.loc.ty==="dg"){
      const dg2=s.dg[s.loc.di];const rks=Object.keys(dg2.rooms);const cds=rks.map(k=>k.split(",").map(Number));
      const nX=Math.min(...cds.map(c2=>c2[0])),xX=Math.max(...cds.map(c2=>c2[0])),nY=Math.min(...cds.map(c2=>c2[1])),xY=Math.max(...cds.map(c2=>c2[1]));
      const ms=22,mp=8,mW=(xX-nX+1)*ms+mp*2,mH=(xY-nY+1)*ms+mp*2;
      const mmX=W2/2-mW/2,mmY=mapY+10;
      c.fillStyle="rgba(0,0,0,0.5)";c.fillRect(mmX-2,mmY-2,mW+4,mH+4);
      c.strokeStyle="rgba(253,211,51,0.3)";c.strokeRect(mmX-2,mmY-2,mW+4,mH+4);
      for(const rk2 of rks){const[cx2,cy2]=rk2.split(",").map(Number);
        const rx=mmX+mp+(cx2-nX)*ms,ry=mmY+mp+(cy2-nY)*ms;
        const cleared=s.cl.has(`dg:${s.loc.di}:${rk2}`);
        c.fillStyle=rk2===s.loc.scr?"#fd3":cleared?"#4a4":"#444";
        c.fillRect(rx+1,ry+1,ms-2,ms-2);
        const rm=dg2.rooms[rk2];if(rm?.enemies?.some(e2=>e2.type==="boss")){c.fillStyle="#f44";c.beginPath();c.arc(rx+ms/2,ry+ms/2,3,0,Math.PI*2);c.fill();}
      }
      c.fillStyle="#aaa";c.font="10px monospace";c.fillText(dg2.name,W2/2,mmY+mH+14);
    }
    const invY=mapY+mapH+20;
    c.fillStyle="rgba(255,255,255,0.1)";c.fillRect(30,invY,W2-60,1);
    c.fillStyle="#ccc";c.font="bold 12px monospace";c.fillText("INVENTORY",W2/2,invY+16);
    const items=[
      {icon:"\ud83d\udd11",label:"Keys",val:p.keys,col:"#fd3"},
      {icon:"\ud83d\udddd\ufe0f",label:"Master Keys",val:p.masterKey.filter(Boolean).length+"/4",col:"#c070ff"},
      ...(p.hasBombs?[{icon:"\ud83d\udca3",label:"Bombs",val:p.bombs,col:"#8af"}]:[]),
      {icon:"\ud83d\udc8e",label:"Rupees",val:p.rupees,col:"#4f4"},
      {icon:"\u2764\ufe0f",label:"HP",val:`${p.hp}/${p.mhp}`,col:"#f44"},
      ...(p.hasBow?[{icon:"\ud83c\udff9",label:"Bow",val:"C",col:"#fd3"}]:[]),
      ...(p.hasMasterSword?[{icon:"\u2694\ufe0f",label:"M.Sword",val:"2x",col:"#8af"}]:[]),
    ];
    const iw=90,ix=W2/2-(items.length*iw)/2;
    for(let i=0;i<items.length;i++){const it=items[i];
      c.fillStyle="rgba(255,255,255,0.04)";c.fillRect(ix+i*iw+4,invY+24,iw-8,42);
      c.strokeStyle="rgba(255,255,255,0.1)";c.strokeRect(ix+i*iw+4,invY+24,iw-8,42);
      c.font="16px monospace";c.fillStyle="#fff";c.fillText(it.icon,ix+i*iw+iw/2,invY+42);
      c.font="bold 11px monospace";c.fillStyle=it.col;c.fillText(it.val,ix+i*iw+iw/2,invY+58);
      c.font="8px monospace";c.fillStyle="#888";c.fillText(it.label,ix+i*iw+iw/2,invY+70);}
    const triY=invY+82;
    c.fillStyle="#ccc";c.font="bold 12px monospace";c.fillText("TRIFORCE",W2/2,triY);
    const triNames=["Forest","Fire","Shadow"];
    for(let i=0;i<3;i++){const tx2=W2/2-60+i*60;
      c.fillStyle=p.tri[i]?"#fd3":"#333";
      c.beginPath();c.moveTo(tx2,triY+6);c.lineTo(tx2+12,triY+24);c.lineTo(tx2-12,triY+24);c.closePath();c.fill();
      if(p.tri[i]){c.fillStyle="#ffe866";c.beginPath();c.moveTo(tx2,triY+10);c.lineTo(tx2+8,triY+22);c.lineTo(tx2-8,triY+22);c.closePath();c.fill();}
      c.font="8px monospace";c.fillStyle=p.tri[i]?"#fd3":"#666";c.fillText(triNames[i],tx2,triY+34);}
    const seY=triY+44;
    const effects=[];
    if(p.burn>0)effects.push({name:"BURN",col:"#f80",t:p.burn,max:3000});
    if(p.freeze>0)effects.push({name:"FREEZE",col:"#8cf",t:p.freeze,max:2500});
    if(p.poison>0)effects.push({name:"POISON",col:"#4a4",t:p.poison,max:4000});
    if(effects.length>0){c.fillStyle="#ccc";c.font="bold 10px monospace";c.fillText("STATUS",W2/2,seY);
      for(let i=0;i<effects.length;i++){const ef=effects[i];
        const ex2=W2/2-effects.length*40+i*80;
        c.fillStyle=ef.col;c.font="bold 9px monospace";c.fillText(ef.name,ex2+40,seY+14);
        c.fillStyle="rgba(0,0,0,0.5)";c.fillRect(ex2+10,seY+18,60,4);
        c.fillStyle=ef.col;c.fillRect(ex2+10,seY+18,60*(ef.t/ef.max),4);}}
    c.fillStyle="#555";c.font="9px monospace";c.fillText("Press TAB to close",W2/2,FH2-10);
    c.textAlign="left";}
  if(s.go){c.fillStyle="rgba(10,0,0,0.75)";c.fillRect(0,0,W2,FH2);c.fillStyle="#e33";c.font="bold 36px monospace";c.textAlign="center";c.fillText("GAME OVER",W2/2,FH2/2-20);c.fillStyle="#ccc";c.font="16px monospace";c.fillText("Tap to respawn",W2/2,FH2/2+25);c.textAlign="left";}
  if(s.won){c.fillStyle="rgba(0,0,0,0.75)";c.fillRect(0,0,W2,FH2);c.fillStyle="#fd3";c.font="bold 36px monospace";c.textAlign="center";c.fillText("VICTORY!",W2/2,FH2/2-30);c.fillStyle="#fff";c.font="15px monospace";c.fillText("All Triforce pieces collected!",W2/2,FH2/2+10);c.fillText("Tap to play again",W2/2,FH2/2+35);c.textAlign="left";}}

// --- Lifecycle ---
let _cleanup = null;

onMounted(() => {
  stR.value = init();
  let unlocked = false;
  const doUnlock = () => { if (unlocked) return; unlocked = true; Tone.start().then(() => { initSfx(); initAu();
    // Force music to start now that audio is unlocked
    const s = stR.value; if (!s || !muOn.value) return;
    const th = s.title ? "title" : s.triMu ? "triforce" : (s.loc.ty === "ow" ? "overworld" : (s.loc.ty === "cave" ? "forest" : s.dg[s.loc.di].th));
    stopMu(); if (customAuRef.value) { customAuRef.value.pause(); customAuRef.value = null; }
    ltRef.value = th;
    if (customMu.value[th]) { const a = new Audio(customMu.value[th]); a.loop = true; a.volume = 0.5; a.play().then(() => { customAuRef.value = a; }).catch(() => { ltRef.value = null; }); }
    else { playTh(th); }
  }); };
  const kd = e => {
    kyR.value.add(e.key.toLowerCase());
    if (["arrowup","arrowdown","arrowleft","arrowright"," "].includes(e.key.toLowerCase())) e.preventDefault();
    const s = stR.value;
    doUnlock();
    if (s && s.title && (e.key === " " || e.key === "Enter" || e.key === "z")) {
      if (ltRef.value === "title") {
        s.title = false;
        const save = loadGame();
        if (save && applySave(s, save)) {
          le(s); s.msg = { text: "Game loaded!", t: 1500 };
        } else { le(s); }
        ltRef.value = null;
      }
      return;
    }
    if (s && s.title && e.key.toLowerCase() === "n") {
      if (ltRef.value === "title") {
        try { localStorage.removeItem('zelda_save'); } catch(e2) {}
        s.title = false; le(s); ltRef.value = null;
        s.msg = { text: "New game started!", t: 1500 };
      }
      return;
    }
    if (e.key.toLowerCase() === "p" && s && !s.title && !s.go && !s.won) { s.paused = !s.paused; if(s.paused)s.pauseSel=0; }
    if (s && s.paused && !s.mapOpen) {
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") { s.pauseSel = (s.pauseSel - 1 + 4) % 4; e.preventDefault(); }
      if (k === "arrowdown" || k === "s") { s.pauseSel = (s.pauseSel + 1) % 4; e.preventDefault(); }
      if (k === "arrowleft" || k === "a") { if (s.pauseSel === 0) { s.volume = Math.max(0, s.volume - 10); try{Tone.getDestination().volume.value=s.volume<=0?-Infinity:-30+s.volume*0.3;}catch(e2){} } }
      if (k === "arrowright" || k === "d") { if (s.pauseSel === 0) { s.volume = Math.min(100, s.volume + 10); try{Tone.getDestination().volume.value=-30+s.volume*0.3;}catch(e2){} } }
      if (k === " " || k === "enter") {
        if (s.pauseSel === 1) { muOn.value = !muOn.value; }
        else if (s.pauseSel === 2) { saveGame(s); s.msg = { text: "Game saved!", t: 1500 }; s.paused = false; }
        else if (s.pauseSel === 3) { saveGame(s); s.paused = false; s.title = true; s.msg = { text: "", t: 0 }; }
        e.preventDefault();
      }
    }
    if (e.key === "Tab" && s && !s.title && !s.go && !s.won) { e.preventDefault(); s.mapOpen = !s.mapOpen; s.paused = s.mapOpen; }
    if (e.key.toLowerCase() === "m") { Tone.start().then(() => { initSfx(); }); muOn.value = !muOn.value; }
  };
  const ku = e => kyR.value.delete(e.key.toLowerCase());
  const clickUnlock = () => { doUnlock(); };
  window.addEventListener("keydown", kd);
  window.addEventListener("keyup", ku);
  window.addEventListener("click", clickUnlock);
  window.addEventListener("touchstart", clickUnlock);
  const lp = t => {
    const dt = Math.min(t - ltR.value, 33);
    ltR.value = t;
    upd(dt);
    drw(t);
    anR.value = requestAnimationFrame(lp);
  };
  anR.value = requestAnimationFrame(lp);

  // Fullscreen listeners
  const fsHandler = () => { isFS.value = !!document.fullscreenElement; };
  document.addEventListener("fullscreenchange", fsHandler);
  document.addEventListener("webkitfullscreenchange", fsHandler);

  _cleanup = () => {
    window.removeEventListener("keydown", kd);
    window.removeEventListener("keyup", ku);
    window.removeEventListener("click", clickUnlock);
    window.removeEventListener("touchstart", clickUnlock);
    cancelAnimationFrame(anR.value);
    stopMu();
    document.removeEventListener("fullscreenchange", fsHandler);
    document.removeEventListener("webkitfullscreenchange", fsHandler);
  };
});

onUnmounted(() => {
  if (_cleanup) _cleanup();
});

// --- Music watcher ---
let _musicInterval = null;
watch([muOn, customMu], () => {
  if (_musicInterval) { clearInterval(_musicInterval); _musicInterval = null; }
  if (!muOn.value) {
    stopMu();
    if (customAuRef.value) { customAuRef.value.pause(); customAuRef.value = null; }
    ltRef.value = null;
    return;
  }
  const ck = () => {
    const s = stR.value; if (!s) return;
    let th = s.title ? "title" : s.triMu ? "triforce" : (s.loc.ty === "ow" ? "overworld" : (s.loc.ty === "cave" ? "forest" : s.dg[s.loc.di].th));
    if (th !== ltRef.value) {
      stopMu();
      if (customAuRef.value) { customAuRef.value.pause(); customAuRef.value = null; }
      ltRef.value = th; // set immediately to prevent duplicate plays from next ck() tick
      if (customMu.value[th]) {
        const a = new Audio(customMu.value[th]); a.loop = true; a.volume = 0.5;
        a.play().then(() => { customAuRef.value = a; }).catch(() => { ltRef.value = null; }); // reset on failure so ck() retries
      } else {
        Tone.start().then(() => { if (!au.i) initAu(); playTh(th); }).catch(() => { ltRef.value = null; });
      }
    }
  };
  ck();
  _musicInterval = setInterval(ck, 500);
}, { immediate: true });

// Clean up music interval on unmount
onUnmounted(() => {
  if (_musicInterval) { clearInterval(_musicInterval); _musicInterval = null; }
});
</script>

<style scoped>
/* No additional scoped styles needed — all styling is inline */
</style>
