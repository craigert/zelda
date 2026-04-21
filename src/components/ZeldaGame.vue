<template>
  <div ref="wrapRef" :style="{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#060608',fontFamily:'monospace',color:'#ccc',padding:0,width:'100%',height:'100vh',overflow:'hidden',userSelect:'none',WebkitUserSelect:'none'}">
    <canvas ref="cvRef" :width="W2*4" :height="(H2+HH)*4" @click="onCanvasClick" :style="{border:'none',maxWidth:'100%',maxHeight:'70vh',width:'auto',height:'auto',aspectRatio:`${W2}/${H2+HH}`}"/>
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
        <button @touchstart.prevent="onHookshotBtn()" @mousedown="onHookshotBtn()"
          :style="{width:'36px',height:'36px',borderRadius:'6px',background:'rgba(0,200,200,0.1)',border:'1px solid rgba(0,200,200,0.2)',color:'#0cc',fontSize:'10px',fontFamily:'monospace',cursor:'pointer',touchAction:'none'}">HSK</button>
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
    <div v-if="showMuPicker" :style="{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',zIndex:1000,background:'rgba(6,6,8,0.95)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'8px',padding:'12px',maxWidth:'480px',width:'90%',maxHeight:'80vh',overflowY:'auto'}">
      <div :style="{color:'#aaa',fontSize:'11px',fontFamily:'monospace',marginBottom:'8px',textAlign:'center'}">CUSTOM MUSIC -- Pick files or paste URLs</div>
      <div v-for="[key,label] in [['title','🎬 Title Screen'],['overworld','🌍 Overworld'],['nighttime','🌙 Nighttime'],['sword','🗡️ Sacred Lake'],['forest','🌲 Forest Temple'],['fire','🔥 Fire Cavern'],['shadow','👻 Shadow Keep'],['guardian','⚔️ Boss Battle'],['shop','🛒 Shop'],['sanctum','🏰 Dark Sanctum'],['finalbattle','💀 Final Battle'],['triforce','✨ Triforce Moment'],['end','🏆 End Credits']]" :key="key"
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
import { PASSAGES } from '../data/passages.js';
import { au, initAu, playTh, stopMu } from '../audio/music-engine.js';
import { initSfx, sfx } from '../audio/sfx.js';
import { dc, hs } from '../utils/helpers.js';
import { dP } from '../rendering/draw-player.js';
import { dSw } from '../rendering/draw-sword.js';
import { dSk, dBt, dGh, dBo, dAr, dMg, dKn, dMs, dWm, dVc, dSf, dYt, dBl, dSg } from '../rendering/draw-enemies.js';
import { dH } from '../rendering/draw-hud.js';
import { dT } from '../rendering/draw-tiles.js';
import { drawTerrainOverlay } from '../rendering/draw-terrain.js';
import { drawInventoryScreen } from '../rendering/draw-inventory.js';
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
const saveSlot = ref(0); // active save slot 0-2

// --- Init ---
function init() {
  return {
    p:{x:7*TL,y:9*TL,dir:2,hp:8,mhp:8,keys:0,bombs:0,rupees:0,masterKey:[false,false,false,false],compasses:[false,false,false,false],spd:2.8,ifr:0,tri:[false,false,false],burn:0,freeze:0,poison:0,poisonTick:0,burnTick:0,snare:0,shield:false,heartPieces:0,hasBow:false,hasBombs:false,hasMasterSword:false,redArmor:false,hasBanana:false,hasBone:false,hasHookshot:false},
    sw:{a:false,t:0},loc:{ty:"ow",scr:"1,1",di:-1},
    hookshot:null,// {tipX,tipY,dx,dy,st:"extend"|"hit"|"pull"|"retract",spd,maxDist,target,t}
    en:[],pk:new Set(),dr:new Set(),cl:new Set(),bc:new Set(),mb:new Set(),co:new Set(),// bc = bombed cracks, mb = moved boulders, co = chests opened
    msg:{text:"",t:0},go:false,won:false,dg:dc(DG),pt:[],ec:0,
    title:true,saveSelect:false,saveSelIdx:0,
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
    mapOpen:false,mapTab:0,
    timedDoors:[],
    iceSlide:{active:false,dx:0,dy:0},
    npcTalk:null,npcState:[],
    shop:null,shopGround:null, // active shop
    hasLantern:false,hasShieldUp:false,hasJar:false,springWater:0,shopVisited:false,dogDug:false,treeGift:false, // shop upgrades + jar + dog + tree
    pArrows:[],
    chest:null,
    slide:{a:false,dx:0,dy:0,t:0,dur:200,prevScr:null},
    activeBombs:[], // {x,y,t:0,fuse:1500,exploded:false}
    respawnTimers:{}, // overworld enemy respawn countdown per screen
    combatLockTime:0, // safety timer for combat lock
    bladeTraps:[], // {x,y,hx,hy,dir,range,st:"idle"|"lunge"|"retract",vel:0}
    bossIntro:null, // {name,t,dur,bx,by} -- cinematic boss intro sequence
    bossFight:false, // true while in a boss room with boss alive
    pitFall:{a:false,t:0,x:0,y:0}, // pit fall animation
    litTorchesAll:{}, // persisted lit torches per room
    triforceHold:null, // {t,dur,piece,px,py,warp} -- hold triforce above head
    itemGet:null, // {type,name,desc,t,dur,px,py,pdir} -- item-get pose ceremony
    ledgeHop:0, // timer for hop animation when dropping off a ledge
    litTorches:new Set(), // "x,y" keys of torches lit by sword in current room
    combatLock:false, // true when room has enemies and exits are sealed
    ss:null, // side-scroll passage state: {vy,grounded,onLadder,jumping,facing,pi}
    bossWarp:null, // {x,y,t,ready,di} — warp portal after boss death (temporary animation)
    bossWarps:[], // persistent: [{di,bossScr,bossX,bossY,entryScr}] — cleared dungeon portals
    pushAnim:null, // {fx,fy,tx,ty,t,dur,reveal,rx,ry,isDg} — smooth block slide
    endScreen:null, // {t:0} end credits cinematic
    finalDeath:null, // {t,dur,bx,by,flash,fallY,fadeAlpha} — final boss death cinematic
    sanctumReveal:null, // {t,dur} — dark sanctum rising cinematic
    sanctumRevealed:false, // true after the reveal has played
    sanctumDark:false, // true after sanctum rises — overworld 3,2 shrouded in darkness
    heroLand:null, // {t,dur} — hero landing animation after triforce warp
    weather:{drops:[],fog:0,type:"clear",wind:0,timer:0,nextChange:15000+Math.random()*30000,active:"clear",biomeWeather:{}}, // weather system state — biomeWeather tracks per-biome
  };
}

// --- Biome map: screen key → biome type ---
const BIOME_MAP={
  // Icy/snowy screens (northern highlands, mountain)
  "3,-1":"snow","4,-1":"snow","2,-1":"snow",
  "5,-1":"snow","5,0":"snow","5,1":"snow",
  // Forest screens
  "-1,-1":"forest","0,-1":"forest","1,-1":"forest",
  "0,0":"forest","0,1":"forest","-1,0":"forest","-1,1":"forest",
  // Swamp / Shadow area — heavy fog
  "-1,2":"forest",
  // Shadow forest — perpetual fog, dark and dangerous
  "6,0":"shadow_forest","6,1":"shadow_forest","6,2":"shadow_forest",
  // Mountain (non-ice)
  "6,-1":"meadow",
  // Fire/desert — clear & hot
  "4,0":"desert","4,1":"desert","4,2":"desert","3,2":"desert",
  "5,2":"desert",
  // Default (hub, meadows) gets rain
};
function getBiome(scr){return BIOME_MAP[scr]||"meadow";}

// --- Weather probabilities per biome: [clear, rain, fog, snow] ---
const WEATHER_ODDS={
  meadow:[0.65, 0.35, 0, 0],            // clear or rain, no fog
  forest:[0.45, 0.35, 0.20, 0],          // occasional fog in forests
  snow:  [0.30, 0.0, 0.15, 0.55],       // snow or fog on mountains
  desert:[0.90, 0.10, 0, 0],            // almost always clear
  shadow_forest:[0.0, 0.0, 1.0, 0],     // always foggy — lantern essential
};
function rollWeather(biome){
  const odds=WEATHER_ODDS[biome]||WEATHER_ODDS.meadow;
  const r=Math.random();let cum=0;
  const types=["clear","rain","fog","snow"];
  for(let i=0;i<4;i++){cum+=odds[i];if(r<cum)return types[i];}
  return "clear";
}

// --- Day/Night cycle: 10 min full cycle, smooth transitions ---
// Returns 0 (full day) to 1 (full night) with slow ease in/out
const DAY_CYCLE_MS=600000;// 10 minutes per full day/night cycle
function getNightAmount(timer){
  const phase=(timer%DAY_CYCLE_MS)/DAY_CYCLE_MS;// 0-1
  // Raw sine: peaks at 0.25 (midnight), troughs at 0.75 (noon)
  const raw=Math.sin(phase*Math.PI*2-Math.PI/2)*0.5+0.5;// 0-1
  // Smoothstep for gradual transitions (flattens the peaks/valleys)
  const clamped=Math.max(0,Math.min(1,raw));
  return clamped*clamped*(3-2*clamped);// smoothstep
}
// Hysteresis: once night starts (>0.35), stays night until it drops below 0.2
let _wasNight=false;
function isNightTime(s){
  const n=getNightAmount(s.weather.timer);
  if(_wasNight){_wasNight=n>0.2;}else{_wasNight=n>0.35;}
  return _wasNight;
}

// --- Night enemy spawns per biome ---
const NIGHT_ENEMIES={
  "meadow":[{type:"ghost",hp:4},{type:"skeleton",hp:4}],
  "forest":[{type:"ghost",hp:5},{type:"ghost",hp:4}],
  "snow":[{type:"ghost",hp:4},{type:"yeti",hp:6}],
  "desert":[{type:"fire_bat",hp:5},{type:"mage",hp:5}],
  "shadow_forest":[{type:"shimmer_ghoul",hp:6},{type:"blob",hp:5},{type:"shimmer_ghoul",hp:5}],
};

// --- Canvas click handler ---
function onCanvasClick() {
  const s = stR.value;
  if (s && s.npcTalk) { s.respawnClick = true; return; }
  if (s && s.title) {
    s.title = false; s.saveSelect = true; s.saveSelIdx = 0;
    return;
  }
  if (s && s.saveSelect) {
    startFromSlot(s, s.saveSelIdx);
    return;
  }
  if (s && (s.go || s.won)) { s.respawnClick = true; return; }
  if (s && s.mapOpen) {
    // Check if click is on tab bar area (scaled coordinates)
    const cv=cvRef.value;if(cv){const r=cv.getBoundingClientRect();const e2=window.event;
      if(e2){const cx=(e2.clientX-r.left)/r.width*W2,cy=(e2.clientY-r.top)/r.height*(H2+HH);
        if(cy>=14&&cy<=34){if(cx>=18&&cx<=96){s.mapTab=0;return;}if(cx>=102&&cx<=180){s.mapTab=1;return;}}}}
    s.mapOpen=false;s.paused=false;return;
  }
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
function onHookshotBtn() { kyR.value.add("v"); setTimeout(() => kyR.value.delete("v"), 100); }
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
// Migrate old single save to slot 0
try{const old=localStorage.getItem('zelda_save');if(old&&!localStorage.getItem('zelda_save_0')){localStorage.setItem('zelda_save_0',old);localStorage.removeItem('zelda_save');}}catch(e){}

function saveGame(s) {
  if (!s || s.title || s.saveSelect || s.go || s.won || s.loc.ty==="passage") return;
  try {
    const data = {
      v: 1,
      p: { x: s.p.x, y: s.p.y, dir: s.p.dir, hp: s.p.hp, mhp: s.p.mhp, keys: s.p.keys, bombs: s.p.bombs, rupees: s.p.rupees, masterKey: [...s.p.masterKey], compasses: [...s.p.compasses], tri: [...s.p.tri], heartPieces: s.p.heartPieces, hasBow: s.p.hasBow, hasBombs: s.p.hasBombs, hasMasterSword: s.p.hasMasterSword, redArmor: s.p.redArmor, hasBanana: s.p.hasBanana, hasBone: s.p.hasBone, hasHookshot: s.p.hasHookshot },
      loc: { ...s.loc },
      pk: [...s.pk],
      dr: [...s.dr],
      cl: [...s.cl].filter(k=>!k.startsWith("ow:")),
      bc: [...(s.bc||[])],mb: [...(s.mb||[])],mbV2:true,co: [...(s.co||[])],
      heartContainers: [...s.heartContainers],
      finalOpen: s.finalOpen,
      respawn: { ...s.respawn },
      hasLantern: s.hasLantern, hasShieldUp: s.hasShieldUp, hasJar: s.hasJar, springWater: s.springWater, shopVisited: s.shopVisited, dogDug: s.dogDug||false, treeGift: s.treeGift||false, sanctumRevealed: s.sanctumRevealed||false, sanctumDark: s.sanctumDark||false,
      bossWarps: s.bossWarps||[],
      weatherTimer: s.weather.timer||0
    };
    localStorage.setItem('zelda_save_'+saveSlot.value, JSON.stringify(data));
  } catch (e) {}
}

function loadSlot(idx) {
  try {
    const raw = localStorage.getItem('zelda_save_'+idx);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

function applySave(s, save) {
  if (!save || save.v !== 1) return false;
  s.p.x = save.p.x; s.p.y = save.p.y; s.p.dir = save.p.dir;
  s.p.hp = save.p.hp; s.p.mhp = save.p.mhp; s.p.keys = save.p.keys;
  s.p.bombs = save.p.bombs; s.p.rupees = save.p.rupees;
  s.p.masterKey = [...save.p.masterKey]; s.p.compasses = save.p.compasses ? [...save.p.compasses] : [false,false,false,false]; s.p.tri = [...save.p.tri]; s.p.heartPieces = save.p.heartPieces || 0; s.p.hasBow = save.p.hasBow || false; s.p.hasBombs = save.p.hasBombs || false; s.p.hasMasterSword = save.p.hasMasterSword || false; s.p.redArmor = save.p.redArmor || false; s.p.hasBanana = save.p.hasBanana || false; s.p.hasBone = save.p.hasBone || false; s.p.hasHookshot = save.p.hasHookshot || false;
  // If saved in a passage or invalid state, fall back to respawn point
  if(save.loc.ty==="passage"){
    s.loc.ty=save.respawn.ty;s.loc.scr=save.respawn.scr;s.loc.di=save.respawn.di;
    s.p.x=save.respawn.x;s.p.y=save.respawn.y;
  }else{s.loc.ty = save.loc.ty; s.loc.scr = save.loc.scr; s.loc.di = save.loc.di;}
  s.pk = new Set(save.pk||[]); s.dr = new Set(save.dr||[]); s.cl = new Set(save.cl||[]);
  s.cl.delete("dg:3:0,-4");// Always respawn Dark King on load
  s.bc = new Set(save.bc||[]);s.mb = new Set(save.mbV2?save.mb:[]);s.co = new Set(save.co||[]);// mbV2: clear stale boulder data from old saves
  s.heartContainers = [...save.heartContainers];
  s.finalOpen = save.finalOpen; s.hasLantern = save.hasLantern || false; s.hasShieldUp = save.hasShieldUp || false; s.hasJar = save.hasJar || false; s.springWater = save.springWater || 0; s.shopVisited = save.shopVisited || false; s.dogDug = save.dogDug || false; s.treeGift = save.treeGift || false; s.sanctumRevealed = save.sanctumRevealed || false; s.sanctumDark = save.sanctumDark || false;
  s.respawn = { ...save.respawn };
  s.bossWarps = save.bossWarps ? [...save.bossWarps] : [];
  if(save.weatherTimer)s.weather.timer=save.weatherTimer;
  // Instantly apply fog for shadow forest on load — no bright flash
  if(s.loc.ty==="ow"&&getBiome(s.loc.scr)==="shadow_forest"){
    s.weather.fog=0.50;s.weather.type="fog";s.weather.active="fog";
    if(!s.weather.biomeWeather.shadow_forest)s.weather.biomeWeather.shadow_forest={active:"fog",timer:99999};
  }
  if (s.finalOpen && s.sanctumRevealed) {
    const fm = OW["3,2"];
    if (fm) { fm[5][7] = T.ENTRANCE; fm[5][8] = T.ENTRANCE; fm[6][7] = T.ENTRANCE; fm[6][8] = T.ENTRANCE; }
  }
  // Re-apply bombed cracks to tile maps
  for(const bck of s.bc){const pts=bck.split(":");const[ty2,di2,scr2]=pts;const[tx2,ty3]=pts[3].split(",").map(Number);const repl=parseInt(pts[4]);
    let m2=null;
    if(ty2==="ow")m2=OW[scr2];
    else if(ty2==="dg"&&s.dg[parseInt(di2)])m2=s.dg[parseInt(di2)].rooms[scr2]?.tiles;
    if(m2&&ty3>=0&&ty3<RO&&tx2>=0&&tx2<CO)m2[ty3][tx2]=repl;
  }
  // Re-apply moved boulders to overworld maps
  for(const mbk of s.mb){const pts=mbk.split(":");const scr3=pts[0];
    const[fx,fy]=pts[1].split(",").map(Number);const[tx2,ty3]=pts[2].split(",").map(Number);const rev=parseInt(pts[3]);
    const m3=OW[scr3];
    if(m3){if(fy>=0&&fy<RO&&fx>=0&&fx<CO)m3[fy][fx]=rev;
      if(ty3>=0&&ty3<RO&&tx2>=0&&tx2<CO)m3[ty3][tx2]=T.ROCK;}}
  return true;
}

function startFromSlot(s, idx) {
  saveSlot.value = idx;
  const save = loadSlot(idx);
  const ns = init();
  ns.saveSelect = false; ns.title = false;
  if (save && applySave(ns, save)) {
    ns.msg = { text: "Game loaded!", t: 1500 };
  }
  // Stop any playing music before switching state
  stopMu();
  if (customAuRef.value) { customAuRef.value.pause(); customAuRef.value = null; }
  stR.value = ns;
  le(ns);
  ltRef.value = null;
}

function deleteSlot(idx) {
  try { localStorage.removeItem('zelda_save_'+idx); } catch(e) {}
}

// --- Volume helper ---
function applyVolume(vol){
  try{Tone.getDestination().volume.value=vol<=0?-Infinity:-30+vol*0.3;}catch(e){}
  if(customAuRef.value){try{customAuRef.value.volume=vol/100;}catch(e){}}
}

// --- Game logic functions ---
// --- Item-get pose definitions ---
const ITEM_GET={
  bow:{name:"Bow",desc:"Press C to fire arrows (1 rupee each).",dur:2800},
  bomb_bag:{name:"Bomb Bag",desc:"Press B to plant bombs.",dur:2800},
  master_sword:{name:"Master Sword",desc:"Doubles your sword damage.",dur:3000},
  master_key:{name:"Master Key",desc:"Opens the boss door of this dungeon.",dur:2600},
  hookshot:{name:"Hookshot",desc:"Press V to grapple metal posts.",dur:2800},
  compass:{name:"Compass",desc:"Boss and key rooms appear on the map.",dur:2800},
  banana:{name:"Golden Banana",desc:"The shopkeeper might want this...",dur:2800},
  bone:{name:"Bone",desc:"It looks valuable to someone.",dur:2500},
  jar:{name:"Magic Jar",desc:"Carry spring water to heal yourself.",dur:2800},
  heartcontainer:{name:"Heart Container",desc:"Maximum HP increased!",dur:2500},
};
function igTrig(s,type){const m=ITEM_GET[type];if(!m)return false;
  s.itemGet={type,name:m.name,desc:m.desc,t:0,dur:m.dur,px:s.p.x,py:s.p.y,pdir:s.p.dir};
  sfx("itemget");s.shake.t=200;
  // Sparkle burst around the player
  for(let i=0;i<14;i++){const a=Math.PI*2*i/14;
    s.pt.push({x:s.p.x+PS/2,y:s.p.y+PS/2,dx:Math.cos(a)*2.5,dy:Math.sin(a)*2-1.5,l:900,c:Math.random()>.5?"#fd3":"#fff"});}
  return true;}

function le(s){s.bProj=[];s.pArrows=[];s.chest=null;s.activeBombs=[];s.drops=[];s.shop=null;s.shopGround=null;s._shopClosed=false;s.fireTrails=[];s.bossFight=false;s._tswitchHit=null;s.hookshot=null;s.itemGet=null;
  // Instant fog when entering shadow forest
  if(s.loc.ty==="ow"&&getBiome(s.loc.scr)==="shadow_forest"){s.weather.fog=0.50;s.weather.type="fog";}
  // Restore lit torches for this room (persists between visits)
  if(!s.litTorchesAll)s.litTorchesAll={};
  const trk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}`;
  s.litTorches=s.litTorchesAll[trk]||(s.litTorchesAll[trk]=new Set());const rk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}`;
  // Always load NPCs for overworld (even if room is cleared of enemies)
  const npcs=s.loc.ty==="ow"?NPC_DATA[s.loc.scr]:null;
  s.npcState=npcs?npcs.map(n=>({x:n.tx*TL,y:n.ty*TL,hx:n.tx*TL,hy:n.ty*TL,dir:2,mt:Math.random()*3000,st:"idle",wait:1000+Math.random()*2000,fixed:!!n.fixed||n.name.includes("Tree")||n.name==="Sign"})):[];
  // Trigger Dark Sanctum reveal when entering screen 3,2 with all 3 triforce pieces
  if(s.loc.ty==="ow"&&s.loc.scr==="3,2"&&s.finalOpen&&!s.sanctumRevealed){
    s.sanctumRevealed=true;s.sanctumReveal={t:0,phase:"wait",dur:8000};}
  // Always load blade traps for dungeons (even if room is cleared)
  s.bladeTraps=[];
  if(s.loc.ty==="dg"){const rm2=s.dg[s.loc.di].rooms[s.loc.scr];
    if(rm2?.traps)s.bladeTraps=rm2.traps.map(tr=>({x:tr.x*TL,y:tr.y*TL,hx:tr.x*TL,hy:tr.y*TL,dir:tr.dir,range:tr.range*TL,st:"idle",vel:0,wait:0}));
    // Reset push blocks in square puzzle rooms if puzzle not yet solved
    if(rm2?.squarePuzzle&&rm2?.origPush&&rm2?.squarePlates&&rm2?.stairsReveal){
      const m2=rm2.tiles;const[srx,sry]=rm2.stairsReveal;
      if(m2&&m2[sry][srx]!==T.STAIRS_DOWN){s._squareSolved=false;
        for(let y=0;y<RO;y++)for(let x=0;x<CO;x++)if(m2[y][x]===T.PUSH)m2[y][x]=T.FLOOR;
        for(const[px,py]of rm2.origPush)m2[py][px]=T.PUSH;
        for(const[px,py]of rm2.squarePlates)if(m2[py][px]===T.FLOOR)m2[py][px]=T.PLATE;}}}
  if(s.cl.has(rk)){s.en=[];s.combatLock=false;
    // Re-spawn uncollected boss drops when re-entering a cleared boss room
    if(s.loc.ty==="dg"){const di2=s.loc.di;const rm2b=s.dg[di2]?.rooms[s.loc.scr];const boss=rm2b?.enemies?.find(e=>e.type==="boss");
      if(boss&&di2>=0&&di2<3){const bossId=`${di2}:${boss.name}`;const cx=W2/2,cy=H2/2;
        const alreadyHC=s.drops.some(d2=>d2.type==="heartcontainer");
        const alreadyTF=s.drops.some(d2=>d2.type==="triforce");
        if(!s.heartContainers.includes(bossId)&&!alreadyHC)s.drops.push({x:cx-20,y:cy,vy:0,ground:cy,type:"heartcontainer",t:0,spin:0,bossId});
        if(!s.p.tri[di2]&&!alreadyTF)s.drops.push({x:cx+20,y:cy,vy:0,ground:cy,type:"triforce",t:0,spin:0});}}
    // Re-spawn reward chest if room had one and it wasn't opened yet
    const chk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}`;
    if(s.loc.ty==="dg"&&!s.co.has(chk)){const rm2c=s.dg[s.loc.di]?.rooms[s.loc.scr];
      const reward2=rm2c?.reward||null;const m2c=gm(s);
      const hasTreasure2=reward2||m2c&&m2c.some(row=>row.some(tl=>tl===T.KEY||tl===T.HEART_PIECE));
      if(hasTreasure2){s.chest={x:W2/2-12,y:H2/2-12,state:"closed",t:0,reward:reward2||(Math.random()<0.5?"heart":"rupee_blue")};}}
    return;}
  const sp=(e,i)=>({...e,mhp:e.hp,fl:0,mt:Math.random()*2000,st:"patrol",stT:0,hx:e.x,hy:e.y,spawnT:400+i*120});
  if(s.loc.ty==="passage"){const pi2=s.ss?.pi??-1;const pg=PASSAGES[pi2];s.en=pg?.enemies?pg.enemies.map(sp):[];s.combatLock=false;return;}
  if(s.loc.ty==="dg"){const rm=s.dg[s.loc.di].rooms[s.loc.scr];s.en=rm?.enemies?rm.enemies.map(sp):[];}
  else if(s.loc.ty==="cave"){const cv=CAVES[s.loc.di];const cvRm=cv?.rooms?cv.rooms[s.loc.scr]:cv?.room;s.en=cvRm?.enemies?cvRm.enemies.map(sp):[];}
  else{const oe2=OW_EN[s.loc.scr];s.en=oe2?oe2.map(sp):[];
    // Night enemies — extra dangerous foes appear on the overworld at night
    if(isNightTime(s)&&s.loc.scr!=="1,1"&&s.loc.scr!=="-1,2"){// hub + sacred lake stay safe
      const biome=getBiome(s.loc.scr);const ne=NIGHT_ENEMIES[biome]||NIGHT_ENEMIES.meadow;
      const baseIdx=s.en.length;
      for(let ni=0;ni<ne.length;ni++){const proto=ne[ni];
        // Random position avoiding edges
        const nx=(2+Math.floor(Math.random()*12))*TL,ny=(2+Math.floor(Math.random()*8))*TL;
        s.en.push(sp({x:nx,y:ny,hp:proto.hp,type:proto.type,night:true},baseIdx+ni));}}}
  // Boss intro -- cinematic sequence if room has a boss
  // Combat lock -- only for reward/boss/miniboss rooms, blocks transitions only (not collision)
  const isDg=s.loc.ty==="dg"||s.loc.ty==="cave";
  const roomData2=isDg&&s.loc.ty==="dg"?s.dg[s.loc.di]?.rooms[s.loc.scr]:null;
  s.combatLock=isDg&&s.en.length>0&&(
    roomData2?.reward||roomData2?.lock||s.en.some(e=>e.type==="boss"||e.type==="miniboss"));
  if(isDg&&s.en.length>0){
    const boss=s.en.find(e=>e.type==="boss");
    const mini=!boss&&s.en.find(e=>e.type==="miniboss");
    if(boss){s._pendingBoss={name:boss.name||"???",bx:boss.x+ES/2,by:boss.y+ES/2,isMini:false};s.bossFight=true;
      ltRef.value=null;}
    else if(mini){s._pendingBoss={name:mini.name||"???",bx:mini.x+ES/2,by:mini.y+ES/2,isMini:true};s.bossFight=true;
      ltRef.value=null;}
  }
}

function gm(s){if(s.loc.ty==="ow")return OW[s.loc.scr]||null;if(s.loc.ty==="cave"){const cv=CAVES[s.loc.di];return cv?.rooms?cv.rooms[s.loc.scr]?.tiles||null:cv?.room?.tiles||null;}if(s.loc.ty==="passage")return null;return s.dg[s.loc.di].rooms[s.loc.scr]?.tiles||null;}

function gts(s,ns,tx,ty){let m;if(s.loc.ty==="ow")m=OW[ns];else m=s.dg[s.loc.di].rooms[ns]?.tiles;
  if(!m||ty<0||ty>=RO||tx<0||tx>=CO)return T.WALL;return m[ty][tx];}

function iS(s,tx,ty){const m=gm(s);if(!m)return true;
  if(s.loc.ty==="cave"){
    const cv=CAVES[s.loc.di];
    if(cv?.rooms){// Multi-room cave — allow cross-room transitions like dungeons
      const[sx,sy]=s.loc.scr.split(",").map(Number);
      if(tx<0){const ns=`${sx-1},${sy}`;return cv.rooms[ns]?SOLID.has((cv.rooms[ns].tiles[RO+ty]||[])[CO+tx]||T.WALL):true;}
      if(tx>=CO){const ns=`${sx+1},${sy}`;return cv.rooms[ns]?SOLID.has((cv.rooms[ns].tiles[ty]||[])[tx-CO]||T.WALL):true;}
      if(ty<0){const ns=`${sx},${sy-1}`;return cv.rooms[ns]?SOLID.has((cv.rooms[ns].tiles[RO+ty]||[])[tx]||T.WALL):true;}
      if(ty>=RO){const ns=`${sx},${sy+1}`;return cv.rooms[ns]?SOLID.has((cv.rooms[ns].tiles[ty-RO]||[])[tx]||T.WALL):true;}
    }else{if(tx<0||tx>=CO||ty<0||ty>=RO)return true;}
    const tl=m[ty][tx];return SOLID.has(tl);}
  const[sx,sy]=s.loc.scr.split(",").map(Number);
  if(tx<0){return SOLID.has(gts(s,`${sx-1},${sy}`,CO+tx,ty));}
  if(tx>=CO){return SOLID.has(gts(s,`${sx+1},${sy}`,tx-CO,ty));}
  if(ty<0){return SOLID.has(gts(s,`${sx},${sy-1}`,tx,RO+ty));}
  if(ty>=RO){return SOLID.has(gts(s,`${sx},${sy+1}`,tx,ty-RO));}
  const tl=m[ty][tx];if(SOLID.has(tl))return true;
  // Ledge tiles -- one-way drop (solid wall unless dropping in the correct direction)
  if(tl===T.LEDGE_S||tl===T.LEDGE_N||tl===T.LEDGE_E||tl===T.LEDGE_W){
    const ptx2=Math.floor((s.p.x+PS/2)/TL),pty2=Math.floor((s.p.y+PS/2)/TL);
    // Check if player is currently ON a ladder tile — ladders let you climb through the adjacent ledge
    const onLadder=m&&ptx2>=0&&ptx2<CO&&pty2>=0&&pty2<RO&&m[pty2][ptx2]===T.LADDER;
    if(onLadder){
      // Only pass through the ledge directly adjacent to this ladder
      const ldx=tx-ptx2,ldy=ty-pty2;
      if(Math.abs(ldx)+Math.abs(ldy)<=1)return false; // adjacent ledge — passable
    }
    // Check if player is on LOW_FLOOR — ledges are solid walls from below (can't jump back out)
    const onLowFloor=m&&ptx2>=0&&ptx2<CO&&pty2>=0&&pty2<RO&&m[pty2][ptx2]===T.LOW_FLOOR;
    if(onLowFloor)return true; // trapped in lower area, use ladder
    // Normal one-way: only passable in the drop direction
    const md=s._moveDir??0;
    if(tl===T.LEDGE_S&&md!==2)return true;
    if(tl===T.LEDGE_N&&md!==0)return true;
    if(tl===T.LEDGE_E&&md!==1)return true;
    if(tl===T.LEDGE_W&&md!==3)return true;
  }
  if(s.loc.ty==="ow"&&s.npcState){for(const ns2 of s.npcState){if(tx===Math.floor((ns2.x+16)/TL)&&ty===Math.floor((ns2.y+16)/TL))return true;}}
  if(tl===T.DOOR||tl===T.BOSS_DOOR){const dk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${tx},${ty}`;
    if(s.dr.has(dk)){
      if(tl===T.BOSS_DOOR&&s.bossFight)return true;
      return false;}
    // Find paired door tile (2-wide doors share one key)
    const openPair=(tx2,ty2)=>{
      const pairs=[[tx2-1,ty2],[tx2+1,ty2],[tx2,ty2-1],[tx2,ty2+1]];
      for(const[px2,py2]of pairs){if(px2>=0&&px2<CO&&py2>=0&&py2<RO&&m[py2][px2]===tl){
        s.dr.add(`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${px2},${py2}`);
        s.pt.push(...Array.from({length:6},()=>({x:px2*TL+16,y:py2*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:500,c:tl===T.BOSS_DOOR?"#c070ff":"#fd3"})));}}};
    if(tl===T.BOSS_DOOR){if(s.bossFight){s.msg={text:"The door won't budge during battle!",t:1500};return true;}
      if(s.p.masterKey[s.loc.di]){s.dr.add(dk);openPair(tx,ty);s.msg={text:"Master key used! Boss door opened!",t:1500};sfx("dooropen");
      s.pt.push(...Array.from({length:12},()=>({x:tx*TL+16,y:ty*TL+16,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:600,c:Math.random()>.5?"#c070ff":"#fd3"})));return false;}
      s.msg={text:"Locked! Find the Master Key...",t:1500};return true;}
    if(s.p.keys>0){s.p.keys--;s.dr.add(dk);openPair(tx,ty);s.msg={text:"Door opened!",t:1500};sfx("dooropen");
      s.pt.push(...Array.from({length:8},()=>({x:tx*TL+16,y:ty*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:500,c:"#fd3"})));return false;}return true;}
  return false;}

function eSolid(s,tx,ty){const m=gm(s);if(!m||tx<0||tx>=CO||ty<0||ty>=RO)return true;const tl=m[ty][tx];return SOLID.has(tl)||tl===T.DOOR||tl===T.BOSS_DOOR||tl===T.LEDGE_S||tl===T.LEDGE_N||tl===T.LEDGE_E||tl===T.LEDGE_W;}

function cPk(s){const p=s.p,m=gm(s);if(!m)return;const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const tx=ptx+dx,ty=pty+dy;if(ty<0||ty>=RO||tx<0||tx>=CO)continue;
    const tl=m[ty][tx],pk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${tx},${ty}`;if(s.pk.has(pk))continue;
    const cx=tx*TL,cy=ty*TL;if(!(p.x<cx+TL&&p.x+PS>cx&&p.y<cy+TL&&p.y+PS>cy))continue;
    if(tl===T.RUPEE){s.pk.add(pk);p.rupees+=5;s.msg={text:"Got rupees!",t:1000};sfx("pickup");s.pt.push(...Array.from({length:6},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:600,c:"#4f4"})));}
    else if(tl===T.MASTER_KEY){s.pk.add(pk);if(s.loc.di>=0)p.masterKey[s.loc.di]=true;igTrig(s,"master_key");}
    else if(tl===T.KEY){s.pk.add(pk);p.keys++;s.msg={text:"Got a key!",t:1500};sfx("pickup");s.pt.push(...Array.from({length:6},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:600,c:"#fd3"})));}
    else if(tl===T.BOMB){if(!p.hasBombs){s.msg={text:"Need a Bomb Bag first!",t:1500};}else{s.pk.add(pk);p.bombs+=1;s.msg={text:"Got a bomb!",t:1500};sfx("pickup");s.pt.push(...Array.from({length:6},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:600,c:"#88f"})));}}
    else if(tl===T.HEART_PIECE){s.pk.add(pk);p.heartPieces++;sfx("heartpiece");s.freeze=500;
      if(p.heartPieces>=4){p.heartPieces=0;p.mhp+=2;p.hp=p.mhp;sfx("triforce");s.shake.t=400;s.msg={text:"Heart Piece (4/4)! New heart container!",t:2500};}
      else{s.msg={text:`Heart Piece (${p.heartPieces}/4)`,t:2000};}
      s.pt.push(...Array.from({length:10},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:600,c:Math.random()>.5?"#ff3366":"#ffd633"})));}
    else if(tl===T.BANANA){s.pk.add(pk);p.hasBanana=true;igTrig(s,"banana");}
    else if(tl===T.BOW){s.pk.add(pk);p.hasBow=true;igTrig(s,"bow");}
    else if(tl===T.BOMB_BAG){s.pk.add(pk);p.hasBombs=true;p.bombs+=5;igTrig(s,"bomb_bag");}
    else if(tl===T.JAR){s.pk.add(pk);s.hasJar=true;igTrig(s,"jar");}
    else if(tl===T.MASTER_SWORD){s.pk.add(pk);p.hasMasterSword=true;igTrig(s,"master_sword");}
    else if(tl===T.COMPASS){s.pk.add(pk);if(s.loc.di>=0)p.compasses[s.loc.di]=true;igTrig(s,"compass");}
    else if(tl===T.HEART){s.pk.add(pk);p.hp=Math.min(p.hp+2,p.mhp);s.msg={text:"Heart restored!",t:1500};sfx("pickup");s.pt.push(...Array.from({length:6},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*3,dy:-Math.random()*2,l:500,c:"#f66"})));}
    else if(tl===T.TRIFORCE){s.pk.add(pk);p.tri[s.loc.di]=true;const c2=p.tri.filter(Boolean).length;sfx("triforce");
      s.pt.push(...Array.from({length:20},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:1000,c:"#fd3"})));
      if(c2>=3){s.won=true;s.endScreen={t:0};s.msg={text:"",t:0};}else s.msg={text:`Triforce piece ${c2}/3!`,t:2500};}}}

function cTr(s){const p=s.p,loc=s.loc;
  if(loc.ty==="ow"){
    if(s.ec<=0){
      for(const ent of DE){if(ent.s!==loc.scr)continue;
        if(ent.d===3&&!s.finalOpen)continue;
        // Gate dungeons: must beat previous dungeon's boss first
        if(ent.d===1&&!p.tri[0]){for(const[tx,ty]of ent.t){if(p.x<tx*TL+TL&&p.x+PS>tx*TL&&p.y<ty*TL+TL&&p.y+PS>ty*TL){s.msg={text:"A dark force blocks the way... Defeat the Forest Temple boss first!",t:2500};s.ec=300;}}continue;}
        if(ent.d===2&&!p.tri[1]){for(const[tx,ty]of ent.t){if(p.x<tx*TL+TL&&p.x+PS>tx*TL&&p.y<ty*TL+TL&&p.y+PS>ty*TL){s.msg={text:"Intense heat blocks the way... Defeat the Fire Cavern boss first!",t:2500};s.ec=300;}}continue;}
        for(const[tx,ty]of ent.t){if(p.x<tx*TL+TL&&p.x+PS>tx*TL&&p.y<ty*TL+TL&&p.y+PS>ty*TL){
          s.fade={a:true,alpha:0,dir:1,t:0,spd:500,cb:()=>{
            loc.ty="dg";loc.di=ent.d;const dg2=s.dg[ent.d];let er="0,0";for(const rk of Object.keys(dg2.rooms))if(dg2.rooms[rk].tiles.some(r=>r.includes(T.STAIRS_UP))){er=rk;break;}
            s.respawn={ty:"dg",scr:er,di:ent.d,x:7*TL,y:9*TL};
            loc.scr=er;p.x=7*TL;p.y=9*TL;s.shop=null;le(s);s.dgTitle={text:dg2.name,t:3000};}};sfx("door");return;}}}
      for(let ci=0;ci<CAVES.length;ci++){const cv=CAVES[ci];if(cv.s!==loc.scr)continue;
        const owm=OW[loc.scr];
        for(const[tx,ty]of cv.t){if(owm&&owm[ty][tx]!==T.ENTRANCE)continue;if(p.x<tx*TL+TL&&p.x+PS>tx*TL&&p.y<ty*TL+TL&&p.y+PS>ty*TL){
          s.fade={a:true,alpha:0,dir:1,t:0,spd:500,cb:()=>{
            loc.ty="cave";loc.di=ci;loc.scr=cv.rooms?"0,0":"0";p.x=7*TL;p.y=(RO-3)*TL;s.ec=500;le(s);
            if(cv.shop&&isNightTime(s)){
              // Shop is closed at night — shopkeeper is sleeping
              s.shopGround=null;s.shop=null;s._shopClosed=true;
              s.msg={text:"The shop is closed... The keeper sleeps at night.",t:2500};
            }
            else if(cv.shop){s.shopVisited=true;
              s.shopGround=[
                {tx:3,ty:7,name:"Key",cost:20,action:s2=>{s2.p.keys++;},collected:false},
                {tx:6,ty:7,name:"Bombs x5",cost:15,req:"hasBombs",action:s2=>{s2.p.bombs+=5;},collected:false},
                {tx:9,ty:7,name:"Lantern",cost:30,once:"hasLantern",action:s2=>{s2.hasLantern=true;},collected:false},
                {tx:12,ty:7,name:"Mirror Shield",cost:50,once:"hasShieldUp",action:s2=>{s2.hasShieldUp=true;},collected:false},
              ];
              // Mark already-purchased once items
              for(const si of s.shopGround){if(si.once&&s[si.once])si.collected=true;}
              if(s.p.hasBanana&&!s.p.redArmor){s.msg={text:"You found my lost Golden Banana!!!! Talk to me for the Red Armor!",t:4000};}
              else{s.msg={text:"Welcome! Walk over items to buy!",t:2000};}
            }
            else{s.msg={text:"Hidden Cave!",t:1500};}}};sfx("door");return;}}}
    }
    const[sx,sy]=loc.scr.split(",").map(Number);
    if(p.x<-4){const ns=`${sx-1},${sy}`;if(OW[ns]){const ps=loc.scr;loc.scr=ns;p.x=W2-PS-8;le(s);s.slide={a:true,dx:-1,dy:0,t:0,dur:200,prevScr:ps};}else p.x=-4;}
    if(p.x>W2-PS+4){const ns=`${sx+1},${sy}`;if(OW[ns]){const ps=loc.scr;loc.scr=ns;p.x=8;le(s);s.slide={a:true,dx:1,dy:0,t:0,dur:200,prevScr:ps};}else p.x=W2-PS+4;}
    if(p.y<-4){const ns=`${sx},${sy-1}`;if(OW[ns]){const ps=loc.scr;loc.scr=ns;p.y=H2-PS-8;le(s);s.slide={a:true,dx:0,dy:-1,t:0,dur:200,prevScr:ps};}else p.y=-4;}
    if(p.y>H2-PS+4){const ns=`${sx},${sy+1}`;if(OW[ns]){const ps=loc.scr;loc.scr=ns;p.y=8;le(s);s.slide={a:true,dx:0,dy:1,t:0,dur:200,prevScr:ps};}else p.y=H2-PS+4;}
  }else if(loc.ty==="cave"){const m=gm(s);const cv2=CAVES[loc.di];
    // Safety: if cave has no valid tiles, warp back to overworld
    if(!m){if(cv2){loc.ty="ow";loc.scr=cv2.s;loc.di=-1;p.x=7*TL;p.y=9*TL;le(s);}return;}
    const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);
    if(m&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO&&m[pty][ptx]===T.STAIRS_UP){
      const ci2=loc.di;s.fade={a:true,alpha:0,dir:1,t:0,spd:500,cb:()=>{
        const cv=CAVES[ci2];loc.ty="ow";loc.scr=cv.s;loc.di=-1;
        p.x=cv.t[0][0]*TL;p.y=(cv.t[0][1]+2)*TL;
        // Clear any boulder blocking the exit landing spot
        const owm=OW[cv.s];if(owm){const lx=cv.t[0][0],ly=cv.t[0][1]+2;
          for(let dy2=-1;dy2<=1;dy2++)for(let dx2=-1;dx2<=1;dx2++){
            const tx2=lx+dx2,ty2=ly+dy2;
            if(tx2>=0&&tx2<CO&&ty2>=0&&ty2<RO&&(owm[ty2][tx2]===T.ROCK||owm[ty2][tx2]===T.PUSH)){
              owm[ty2][tx2]=T.GRASS;}}}
        s.ec=500;le(s);}};sfx("door");return;}
    // Multi-room cave — screen transitions like dungeons
    if(cv2?.rooms){const[rx,ry]=loc.scr.split(",").map(Number);
      if(p.y<-4){const ns=`${rx},${ry-1}`;if(cv2.rooms[ns]){const ps=loc.scr;loc.scr=ns;p.y=H2-TL-PS-4;le(s);s.slide={a:true,dx:0,dy:-1,t:0,dur:200,prevScr:ps};}else p.y=-4;}
      if(p.y>H2-PS+4){const ns=`${rx},${ry+1}`;if(cv2.rooms[ns]){const ps=loc.scr;loc.scr=ns;p.y=TL+4;le(s);s.slide={a:true,dx:0,dy:1,t:0,dur:200,prevScr:ps};}else p.y=H2-PS+4;}
      if(p.x<-4){const ns=`${rx-1},${ry}`;if(cv2.rooms[ns]){const ps=loc.scr;loc.scr=ns;p.x=W2-TL-PS-4;le(s);s.slide={a:true,dx:-1,dy:0,t:0,dur:200,prevScr:ps};}else p.x=-4;}
      if(p.x>W2-PS+4){const ns=`${rx+1},${ry}`;if(cv2.rooms[ns]){const ps=loc.scr;loc.scr=ns;p.x=TL+4;le(s);s.slide={a:true,dx:1,dy:0,t:0,dur:200,prevScr:ps};}else p.x=W2-PS+4;}}
  }else{const[rx,ry]=loc.scr.split(",").map(Number),m=gm(s);
    const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);
    if(m&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO&&m[pty][ptx]===T.STAIRS_UP){
      const di2=loc.di;s.fade={a:true,alpha:0,dir:1,t:0,spd:500,cb:()=>{
        const ent=DE[di2];loc.ty="ow";loc.scr=ent.s;loc.di=-1;
        const mxTy=Math.max(...ent.t.map(t2=>t2[1]));p.x=ent.t[0][0]*TL;p.y=(mxTy+2)*TL;s.ec=500;le(s);}};sfx("door");return;}
    // STAIRS_DOWN → enter side-scroll passage
    if(m&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO&&m[pty][ptx]===T.STAIRS_DOWN&&s.ec<=0){
      const pi2=PASSAGES.findIndex(pg=>pg.di===loc.di&&(pg.from.scr===loc.scr||pg.to.scr===loc.scr));
      if(pi2>=0){const pg=PASSAGES[pi2];const isFrom=pg.from.scr===loc.scr;
        s.fade={a:true,alpha:0,dir:1,t:0,spd:500,cb:()=>{
          loc.ty="passage";loc.scr=`p${pi2}`;
          p.x=isFrom?2*TL:(W2-3*TL);p.y=9*TL-PS;
          s.ss={vy:0,grounded:false,onLadder:false,jumping:false,facing:isFrom?1:-1,pi:pi2};
          s.en=[];le(s);s.ec=500;
        }};sfx("door");return;}}
    const dg=s.dg[loc.di];
    if(s.combatLock){// Block room transitions but NOT movement/collision
      if(p.y<0)p.y=0;if(p.y>H2-PS)p.y=H2-PS;if(p.x<0)p.x=0;if(p.x>W2-PS)p.x=W2-PS;
    }else{
    if(p.y<-4){const ns=`${rx},${ry-1}`;if(dg.rooms[ns]){const ps=loc.scr;loc.scr=ns;p.y=H2-TL-PS-4;le(s);s.slide={a:true,dx:0,dy:-1,t:0,dur:200,prevScr:ps};}else p.y=-4;}
    if(p.y>H2-PS+4){const ns=`${rx},${ry+1}`;if(dg.rooms[ns]){const ps=loc.scr;loc.scr=ns;p.y=TL+4;le(s);s.slide={a:true,dx:0,dy:1,t:0,dur:200,prevScr:ps};}else p.y=H2-PS+4;}
    if(p.x<-4){const ns=`${rx-1},${ry}`;if(dg.rooms[ns]){const ps=loc.scr;loc.scr=ns;p.x=W2-TL-PS-4;le(s);s.slide={a:true,dx:-1,dy:0,t:0,dur:200,prevScr:ps};}else p.x=-4;}
    if(p.x>W2-PS+4){const ns=`${rx+1},${ry}`;if(dg.rooms[ns]){const ps=loc.scr;loc.scr=ns;p.x=TL+4;le(s);s.slide={a:true,dx:1,dy:0,t:0,dur:200,prevScr:ps};}else p.x=W2-PS+4;}}}
  saveGame(s);}

function upd(dt){const s=stR.value;if(!s||s.title||s.saveSelect||s.paused)return;s.gt+=dt;
  // Overworld enemy respawn timers
  if(s.respawnTimers){for(const rk2 in s.respawnTimers){s.respawnTimers[rk2]-=dt;
    if(s.respawnTimers[rk2]<=0){s.cl.delete(rk2);delete s.respawnTimers[rk2];}}}
  // End screen cinematic — advance timer, check for return to title
  if(s.endScreen){s.endScreen.t+=dt;
    if(s.endScreen.t>3000&&(kyR.value.has("tab")||kyR.value.has(" ")||kyR.value.has("enter")||kyR.value.has("r")||s.respawnClick)){
      s.respawnClick=false;stopMu();if(customAuRef.value){customAuRef.value.pause();customAuRef.value=null;}
      const ns=init();ns.title=true;stR.value=ns;ltRef.value=null;}
    return;}
  // Final boss death cinematic — slow-mo death, hero celebration, fade to end
  if(s.finalDeath){const fd=s.finalDeath;fd.t+=dt*0.4;// slow-mo (40% speed)
    fd.flash=Math.sin(fd.t/80)*0.5+0.5;// boss flashing
    if(fd.t>1500)fd.fallY=Math.min(20,(fd.t-1500)*0.015);// boss sinks
    if(fd.t>2500)fd.heroRaise=Math.min(1,(fd.t-2500)/800);// hero raises sword
    if(fd.t>5000)fd.fadeAlpha=Math.min(1,(fd.t-5000)/1500);// fade to black (after hold)
    // Particles from dying boss
    if(fd.t<2500&&Math.random()<0.3){s.pt.push({x:fd.bx+(Math.random()-.5)*20,y:fd.by-fd.fallY+(Math.random()-.5)*20,dx:(Math.random()-.5)*2,dy:-Math.random()*2,l:600,c:Math.random()>.5?"#f0f":"#fd3"});}
    // Transition to end screen
    if(fd.t>=fd.dur){
      // Save completed game — player returns to start with all items on next load
      // Clear the Dark Sanctum boss room so the boss respawns on replay
      s.cl.delete("dg:3:0,-4");
      s.loc.ty="ow";s.loc.scr="1,1";s.loc.di=-1;s.p.x=7*TL;s.p.y=9*TL;s.p.hp=s.p.mhp;
      s.respawn={ty:"ow",scr:"1,1",di:-1,x:7*TL,y:9*TL};
      saveGame(s);
      s.won=true;s.endScreen={t:0};s.finalDeath=null;}
    // Still update particles
    for(let i=s.pt.length-1;i>=0;i--){const pt=s.pt[i];pt.x+=pt.dx*(dt/16);pt.y+=pt.dy*(dt/16);pt.l-=dt;if(pt.l<=0)s.pt.splice(i,1);}
    return;}
  // Freeze gameplay during chest presentation
  if(s.chest&&s.chest.state==="presenting"){s.chest.t+=dt;s.chest.itemY=Math.min(40,(s.chest.itemY||0)+2.5*(dt/16));
    if(s.chest.t>=1500){s.chest.state="open";s.chest.t=0;
      if(s.chest.reward){s.drops.push({x:s.chest.x+12,y:s.chest.y-(s.chest.itemY||0),vy:-1,ground:s.chest.y,type:s.chest.reward,t:0});}
      const itemNames={heart:"Heart",rupee_blue:"Rupees",rupee_green:"Rupees"};
      // For ceremonial items, defer the announcement to the item-get pose triggered on pickup.
      // For minor rewards (heart/rupees/bomb), show a small message now.
      if(ITEM_GET[s.chest.reward]){sfx("pickup");}
      else{sfx("pickup");s.msg={text:itemNames[s.chest.reward]||"Treasure!",t:1800};}}
    // Still update particles during freeze
    for(let i=s.pt.length-1;i>=0;i--){const pt=s.pt[i];pt.x+=pt.dx*(dt/16);pt.y+=pt.dy*(dt/16);pt.l-=dt;if(pt.l<=0)s.pt.splice(i,1);}
    return;}
  // Item-get pose freeze -- player holds item aloft, name banner, dismissible after 800ms
  if(s.itemGet){s.itemGet.t+=dt;
    const ky=kyR.value;
    if(s.itemGet.t>800&&(ky.has(" ")||ky.has("enter")))s.itemGet.t=s.itemGet.dur;
    // Periodic sparkle around the held item
    if(Math.random()<0.4){const ang=Math.random()*Math.PI*2,r=10+Math.random()*8;
      s.pt.push({x:s.itemGet.px+PS/2+Math.cos(ang)*r,y:s.itemGet.py-12+Math.sin(ang)*r*0.6,dx:(Math.random()-.5)*0.6,dy:-Math.random()*0.5,l:600,c:Math.random()>.5?"#fff":"#fd3"});}
    if(s.itemGet.t>=s.itemGet.dur)s.itemGet=null;
    for(let i=s.pt.length-1;i>=0;i--){const pt=s.pt[i];pt.x+=pt.dx*(dt/16);pt.y+=pt.dy*(dt/16);pt.l-=dt;if(pt.l<=0)s.pt.splice(i,1);}
    return;}
  // Deferred boss intro — trigger if no slide was active (e.g. entering via fade/stairs)
  if(s._pendingBoss&&!s.slide.a){const pb=s._pendingBoss;s._pendingBoss=null;
    s.bossIntro={name:pb.name,t:0,dur:pb.isMini?2000:3000,bx:pb.bx,by:pb.by,isMini:pb.isMini};sfx("bossdeath");}
  // Boss intro sequence -- freeze gameplay, animate camera
  if(s.bossIntro){s.bossIntro.t+=dt;
    if(s.bossIntro.t>=s.bossIntro.dur||s.bossIntro.t>5000){s.bossIntro=null;}
    return;}
  // Hero landing animation after boss victory — descends like key drop
  if(s.heroLand){s.heroLand.t+=dt;
    // Slow majestic descent in pillar of light
    if(!s.heroLand.vy)s.heroLand.vy=0;
    if(!s.heroLand.landed){
      s.heroLand.vy=Math.min(s.heroLand.vy+0.018*(dt/16),0.8);// gentle but not too slow
      if(!s.heroLand.y&&s.heroLand.y!==0)s.heroLand.y=-40;
      s.heroLand.y+=s.heroLand.vy*(dt/16);
      if(s.heroLand.y>=s.p.y){s.heroLand.y=s.p.y;s.heroLand.landed=true;s.heroLand.landT=0;sfx("triforce");s.shake.t=200;
        // Landing burst particles
        for(let i=0;i<12;i++){const a=Math.PI*2*i/12;
          s.pt.push({x:s.p.x+PS/2,y:s.p.y+PS/2,dx:Math.cos(a)*2,dy:Math.sin(a)*1.5-1,l:600,c:Math.random()>.5?"#fd3":"#fff"});}}}
    else{s.heroLand.landT+=dt;
      if(s.heroLand.landT>=1000){s.heroLand=null;saveGame(s);}}
    for(let i=s.pt.length-1;i>=0;i--){const pt=s.pt[i];pt.x+=pt.dx*(dt/16);pt.y+=pt.dy*(dt/16);pt.l-=dt;if(pt.l<=0)s.pt.splice(i,1);}
    return;}
  // Triforce/item hold-up animation
  if(s.triforceHold){s.triforceHold.t+=dt;
    if(s.triforceHold.t>2000&&!s.triforceHold.warp){s.triforceHold.warp=true;sfx("door");
      const tc3=s.p.tri.filter(Boolean).length;
      s.msg={text:tc3>=3?"The Dark Sanctum has opened!":`Triforce piece ${tc3}/3!`,t:2000};}
    // After hold-up: warp only when boss defeated + triforce + heart container all collected
    if(s.triforceHold.warp&&s.triforceHold.t>=s.triforceHold.dur&&!s.triforceHold.fading){
      const hcRemain=s.drops.some(d2=>d2.type==="heartcontainer");
      if(!hcRemain&&s.bossVictory){
        // All 3 conditions met — fade to dungeon entrance
        s.triforceHold.fading=true;
        const di2=s.bossVictory.di;
        s.bossWarp=null;
        // Fade to black, then warp to overworld dungeon entrance
        s.fade={a:true,alpha:0,dir:1,t:0,spd:1500,cb:()=>{
          // Find the overworld entrance for this dungeon
          const de2=DE.find(d=>d.d===di2);
          if(de2){
            s.loc.ty="ow";s.loc.scr=de2.s;s.loc.di=-1;
            // Land below the dungeon entrance
            const landY=Math.max(...de2.t.map(t2=>t2[1]))+2;
            s.p.x=de2.t[0][0]*TL;s.p.y=landY*TL;
            s.respawn={ty:"ow",scr:de2.s,di:-1,x:s.p.x,y:s.p.y};
            s.ec=500;le(s);
          }
          // Queue hero descent — starts after fade-in completes
          // Hide player until descent begins
          s._heroLandPending=true;s._heroHidden=true;
          s.triforceHold=null;s.triMu=false;s.bossVictory=null;
          // Fade system auto-reverses (dir=-1) after cb
        }};
      }else{
        // Heart container not yet collected — end hold-up, let player collect it
        s.triforceHold=null;
        if(!s.bossVictory)s.triMu=false;}}
    // Update particles + drops during hold (so player can pick up remaining items)
    if(s.triforceHold&&!s.triforceHold.fading){
      for(let i=s.pt.length-1;i>=0;i--){const pt=s.pt[i];pt.x+=pt.dx*(dt/16);pt.y+=pt.dy*(dt/16);pt.l-=dt;if(pt.l<=0)s.pt.splice(i,1);}
      for(let i=s.drops.length-1;i>=0;i--){const d2=s.drops[i];d2.t+=dt;
        if(d2.type==="triforce"||d2.type==="heartcontainer"||d2.type==="key_drop"){d2.vy=Math.min(d2.vy+0.02*(dt/16),0.8);d2.y+=d2.vy*(dt/16);if(d2.y>d2.ground){d2.y=d2.ground;d2.vy=0;}}
        if(Math.abs(s.p.x+PS/2-d2.x)<16&&Math.abs(s.p.y+PS/2-d2.y)<16){
          if(d2.type==="heartcontainer"){s.p.mhp+=2;s.p.hp=s.p.mhp;sfx("itemget");s.msg={text:"Heart Container!",t:1500};
            if(d2.bossId&&!s.heartContainers.includes(d2.bossId))s.heartContainers.push(d2.bossId);}
          s.drops.splice(i,1);}}
      return;}}
  // Pit fall animation -- freeze gameplay, shrink player
  if(s.pitFall&&s.pitFall.a){s.pitFall.t+=dt;
    if(s.pitFall.t>=600){s.pitFall.a=false;
      const p=s.p;if(!p.redArmor||Math.random()>0.5)p.hp--;p.ifr=IFR;s.shake.t=300;
      const m3=gm(s);let ex=7*TL,ey=9*TL;
      if(m3)for(let ty2=RO-1;ty2>=0;ty2--)for(let tx2=0;tx2<CO;tx2++){if(m3[ty2][tx2]===T.STAIRS_UP||(m3[ty2][tx2]===T.FLOOR&&ty2>8)){ex=tx2*TL;ey=ty2*TL;ty2=-1;break;}}
      p.x=ex;p.y=ey;s.msg={text:"Fell into a pit!",t:1000};
      if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}
    return;}
  // Fade transition — must run before shop/NPC/freeze checks
  if(s.fade.a){const fs=s.fade.spd||250;s.fade.t+=dt;s.fade.alpha=Math.min(1,s.fade.t/fs);
    if(s.fade.alpha>=1&&s.fade.cb){try{s.fade.cb();}catch(e){console.error("Fade callback error:",e);}s.fade.cb=null;s.fade.dir=-1;s.fade.t=0;}
    if(s.fade.dir===-1){s.fade.alpha=Math.max(0,1-s.fade.t/fs);if(s.fade.alpha<=0){s.fade.a=false;
      // Start hero descent after fade-in completes
      if(s._heroLandPending){s._heroLandPending=false;s._heroHidden=false;s.heroLand={t:0,dur:3000,y:-40,vy:0,landed:false};}}}return;}
  // Shop ground items — player walks over to buy
  if(s.shopGround){const p=s.p;
    for(const si of s.shopGround){
      if(si.once&&s[si.once]){si.collected=true;continue;}
      // Consumables (no once flag) respawn after 2s
      if(si.collected&&!si.once){si._respawn=(si._respawn||0)+dt;if(si._respawn>=2000){si.collected=false;si._respawn=0;}else continue;}
      if(si.collected)continue;
      if(si._cd>0){si._cd-=dt;continue;}
      const cx=si.tx*TL,cy=si.ty*TL;
      if(p.x<cx+TL&&p.x+PS>cx&&p.y<cy+TL&&p.y+PS>cy){
        if(si.req&&!p[si.req]){s.msg={text:"Need equipment first!",t:1500};si._cd=1000;continue;}
        if(p.rupees>=si.cost){p.rupees-=si.cost;si.action(s);si.collected=true;
          sfx("triforce");s.shake.t=200;s.msg={text:`Bought ${si.name}!`,t:1500};
          s.pt.push(...Array.from({length:8},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:600,c:"#fd3"})));
        }else{s.msg={text:"Not enough rupees!",t:1000};si._cd=1000;}
      }
    }
  }
  if(s.npcTalk){
    s.npcTalk.timer+=dt;
    // Join all lines into one continuous text, typewriter through it
    if(!s.npcTalk.fullText)s.npcTalk.fullText=s.npcTalk.lines.join(" ");
    s.npcTalk.charIdx=Math.min(s.npcTalk.fullText.length,Math.floor(s.npcTalk.timer/25));
    const ky=kyR.value;
    if(ky.has(" ")||ky.has("enter")||ky.has("e")||ky.has("z")||s.respawnClick){
      s.respawnClick=false;
      if(s.npcTalk.charIdx>=s.npcTalk.fullText.length){
        const wasDogDig=s.npcTalk.dogDig;const wasTreeGift=s.npcTalk.treeGift;const wasShopTrade=s.npcTalk.shopTrade;s.npcTalk=null;
          for(const ns3 of s.npcState)if(ns3.wait>5000)ns3.wait=2000;
          // Dog dug up a heart piece!
          if(wasDogDig){const dx2=s.p.x+PS/2,dy2=s.p.y-TL;
            s.drops.push({x:dx2,y:dy2-20,vy:-3,ground:dy2,type:"heartpiece_drop",t:0});
            sfx("heartpiece");s.shake.t=400;s.msg={text:"The dog dug up a Heart Piece!",t:2500};
            s.pt.push(...Array.from({length:15},()=>({x:dx2,y:dy2,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:800,c:Math.random()>.5?"#ff3366":"#fd3"})));}
          // Shopkeeper trades banana + 100 rupees for Red Armor
          if(wasShopTrade){s.p.rupees-=100;s.p.redArmor=true;s.p.hasBanana=false;
            sfx("triforce");s.shake.t=400;s.msg={text:"Got Red Armor! Half damage taken!",t:3000};
            s.pt.push(...Array.from({length:15},()=>({x:s.p.x+PS/2,y:s.p.y+PS/2,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:800,c:Math.random()>.5?"#f44":"#fd3"})));}
          // Ancient Tree drops a heart piece from its canopy
          if(wasTreeGift){const dx2=s.p.x+PS/2,dy2=s.p.y-TL;
            s.drops.push({x:dx2,y:dy2-30,vy:-2,ground:dy2,type:"heartpiece_drop",t:0});
            sfx("heartpiece");s.shake.t=400;s.msg={text:"The Ancient Tree gave you a Heart Piece!",t:2500};
            s.pt.push(...Array.from({length:15},()=>({x:dx2,y:dy2-20,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:800,c:Math.random()>.5?"#2a6a18":"#fd3"})));}
      }else{s.npcTalk.charIdx=s.npcTalk.fullText.length;s.npcTalk.timer=99999;}
      ky.delete(" ");ky.delete("enter");ky.delete("e");ky.delete("z");
    }
    return;
  }
  // Dark Sanctum reveal — runs alongside gameplay then freezes for the big moment
  if(s.sanctumReveal){const sr=s.sanctumReveal;sr.t+=dt;const ecx=7.5*TL,ecy=5.5*TL;
    // Phase: wait (0-2s) — player walks around normally, tension builds
    if(sr.phase==="wait"&&sr.t>=2000){sr.phase="rumble";sr.t=0;sfx("bossdeath");s.freeze=6000;s.triMu=false;s.sanctumRising=true;
      // NPC panics
      for(const ns of s.npcState){ns.st="walk";ns.wait=8000;ns.dir=Math.random()<0.5?1:3;ns.panic=true;}}
    // Phase: rumble (0-1.5s) — ground shakes, small debris
    if(sr.phase==="rumble"){
      s.shake.t=Math.max(s.shake.t,50+Math.min(150,sr.t/10));
      if(Math.random()<0.3){s.pt.push({x:ecx+(Math.random()-.5)*TL*3,y:ecy+TL,dx:(Math.random()-.5)*2,dy:-Math.random()*2,l:400,c:"#887050"});}
      if(sr.t>=1500){sr.phase="crumble";sr.t=0;sfx("bomb");}}
    // Phase: crumble (0-2s) — rocks break apart, heavy shake, debris flies
    if(sr.phase==="crumble"){
      s.shake.t=Math.max(s.shake.t,180);
      // Rock debris particles
      if(Math.random()<0.7){s.pt.push({x:ecx+(Math.random()-.5)*TL*2,y:ecy+(Math.random()-.5)*TL,dx:(Math.random()-.5)*5,dy:-Math.random()*5-2,l:700,c:Math.random()>.5?"#887050":"#665040"});
        s.pt.push({x:ecx+(Math.random()-.5)*TL*3,y:ecy+TL,dx:(Math.random()-.5)*3,dy:-Math.random()*3,l:600,c:"#888"});}
      // At 1s — swap rocks to entrance tiles (temple revealed!)
      if(sr.t>=1000&&!sr.risen){sr.risen=true;sfx("secret");
        const fm=OW["3,2"];if(fm){fm[5][7]=T.ENTRANCE;fm[5][8]=T.ENTRANCE;fm[6][7]=T.ENTRANCE;fm[6][8]=T.ENTRANCE;}}
      if(sr.t>=2000){sr.phase="settle";sr.t=0;}}
    // Phase: settle (0-1.5s) — shake dies down, dust clears
    if(sr.phase==="settle"){
      const ease=1-sr.t/1500;s.shake.t=Math.max(s.shake.t,ease*80);
      if(Math.random()<0.2*ease){s.pt.push({x:ecx+(Math.random()-.5)*TL*2,y:ecy,dx:(Math.random()-.5)*1,dy:-Math.random()*1.5,l:500,c:"#aaa"});}
      if(sr.t>=1000&&!sr.textShown){sr.textShown=true;sfx("triforce");
        s.msg={text:"The Dark Sanctum has risen!",t:3000};}
      if(sr.t>=1500){s.sanctumReveal=null;s.freeze=0;s.sanctumRising=false;s.sanctumDark=true;}}
    // NPC panic running
    for(const ns of s.npcState){if(ns.panic){const nsp=2.5*(dt/16);
      if(ns.dir===1)ns.x+=nsp;else if(ns.dir===3)ns.x-=nsp;
      else if(ns.dir===0)ns.y-=nsp;else ns.y+=nsp;}}
    // Update particles
    for(let i=s.pt.length-1;i>=0;i--){const pt=s.pt[i];pt.x+=pt.dx*(dt/16);pt.y+=pt.dy*(dt/16);pt.l-=dt;if(pt.l<=0)s.pt.splice(i,1);}
    if(sr.phase!=="wait")return;}// freeze gameplay after wait phase
  if(s.freeze>0){s.freeze-=dt;
    // Still advance push animation during freeze (overworld boulder push)
    if(s.pushAnim){s.pushAnim.t+=dt;
      if(s.pushAnim.t>=s.pushAnim.dur){
        const pa=s.pushAnim,m3=gm(s);
        if(m3){m3[pa.ry][pa.rx]=pa.reveal;
          if(pa.reveal===T.STAIRS_DOWN){sfx("secret");s.shake.t=400;s.msg={text:"A hidden stairway!",t:2000};
            s.pt.push(...Array.from({length:15},()=>({x:pa.rx*TL+16,y:pa.ry*TL+16,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:900,c:Math.random()>.5?"#fa0":"#fd3"})));}
          else if(pa.reveal===T.ENTRANCE){sfx("secret");s.shake.t=400;s.msg={text:"A hidden cave entrance!",t:2000};
            s.pt.push(...Array.from({length:15},()=>({x:pa.rx*TL+16,y:pa.ry*TL+16,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:900,c:Math.random()>.5?"#fa0":"#fd3"})));}}
        s.pushCd=false;s.pushAnim=null;}}
    return;}
  if(s.death.a){s.death.t+=dt;s.death.spin+=dt*0.015;if(s.death.t>1500&&!s.go){s.go=true;s.msg={text:"Tap to respawn",t:99999};}if(!s.go)return;}
  if(s.go||s.won){if(kyR.value.has("r")||kyR.value.has(" ")||kyR.value.has("enter")||kyR.value.has("tab")||s.respawnClick){s.respawnClick=false;
    if(s.won){stopMu();if(customAuRef.value){customAuRef.value.pause();customAuRef.value=null;}
      const ns=init();ns.title=true;stR.value=ns;ltRef.value=null;return;}
    const old=s;const ns=init();ns.title=false;ns.p.keys=old.p.keys;ns.p.bombs=old.p.bombs;ns.p.rupees=old.p.rupees;ns.p.tri=[...old.p.tri];ns.p.masterKey=[...old.p.masterKey];ns.p.compasses=[...old.p.compasses];ns.p.mhp=old.p.mhp;ns.p.hp=ns.p.mhp;ns.p.heartPieces=old.p.heartPieces;ns.p.hasBow=old.p.hasBow;ns.p.hasBombs=old.p.hasBombs;ns.p.hasMasterSword=old.p.hasMasterSword;ns.p.redArmor=old.p.redArmor;ns.p.hasBanana=old.p.hasBanana;ns.p.hasBone=old.p.hasBone;ns.p.hasHookshot=old.p.hasHookshot;
    ns.pk=old.pk;ns.dr=old.dr;ns.cl=old.cl;ns.bc=old.bc;ns.co=old.co;ns.mb=old.mb;ns.dg=old.dg;ns.heartContainers=[...old.heartContainers];ns.finalOpen=old.finalOpen;ns.bossWarps=[...(old.bossWarps||[])];ns.hasLantern=old.hasLantern;ns.hasShieldUp=old.hasShieldUp;ns.hasJar=old.hasJar;ns.springWater=old.springWater||0;ns.shopVisited=old.shopVisited;ns.dogDug=old.dogDug;ns.treeGift=old.treeGift;
    ns.loc.ty=old.respawn.ty;ns.loc.scr=old.respawn.scr;ns.loc.di=old.respawn.di;ns.p.x=old.respawn.x;ns.p.y=old.respawn.y;
    ns.respawn={...old.respawn};// preserve respawn point for subsequent deaths
    stR.value=ns;le(ns);saveGame(ns);}return;}
  if(s.slide.a){s.slide.t+=dt;if(s.slide.t>=s.slide.dur){s.slide.a=false;
    // Trigger boss intro after room transition completes
    if(s._pendingBoss){const pb=s._pendingBoss;s._pendingBoss=null;
      s.bossIntro={name:pb.name,t:0,dur:pb.isMini?2000:3000,bx:pb.bx,by:pb.by,isMini:pb.isMini};sfx("bossdeath");}}return;}
  // ===== SIDE-SCROLL PASSAGE PHYSICS =====
  if(s.loc.ty==="passage"&&s.ss){
    const ky=kyR.value,tc=tcR.value,p=s.p,ss=s.ss;
    const pi=ss.pi;const psg=PASSAGES[pi];if(!psg){s.loc.ty="dg";s.ss=null;return;}
    const GRAV=0.18,JUMP=-4.2,TVEL=5.0,PLAT_H=6;
    // Input
    let dx2=0;
    if(ky.has("arrowleft")||ky.has("a")||tc.dir==="left"){dx2=-1;ss.facing=-1;}
    if(ky.has("arrowright")||ky.has("d")||tc.dir==="right"){dx2=1;ss.facing=1;}
    const upKey=ky.has("arrowup")||ky.has("w")||tc.dir==="up";
    const downKey=ky.has("arrowdown")||ky.has("s")||tc.dir==="down";
    const jumpKey=upKey; // Up/W to jump in side-scroll (Space/Z reserved for sword)
    // Horizontal movement
    const hspd=p.spd*1.2*(dt/16);
    p.x+=dx2*hspd;
    // Wall collision (left/right edges)
    if(p.x<1*TL)p.x=1*TL;if(p.x>W2-1*TL-PS)p.x=W2-1*TL-PS;
    // Ladder check
    let onAnyLadder=false;
    const pcx=p.x+PS/2,pcy=p.y+PS/2;
    for(const[lx,ly,lh]of psg.ladders){
      const lx1=lx*TL,ly1=ly*TL,lx2=lx1+TL,ly2=ly1+lh*TL;
      if(pcx>lx1+4&&pcx<lx2-4&&pcy>ly1&&pcy<ly2){onAnyLadder=true;break;}
    }
    if(onAnyLadder&&(upKey||downKey)){ss.onLadder=true;ss.vy=0;ss.grounded=false;}
    if(ss.onLadder&&!onAnyLadder)ss.onLadder=false;
    if(ss.onLadder){
      if(upKey)p.y-=hspd*0.8;if(downKey)p.y+=hspd*0.8;
      ss.vy=0;
      // Exit check — at top of any ladder (within 1 tile of ladder top)
      let atLadderTop=false;
      for(const[lx,ly]of psg.ladders){if(Math.abs(pcx-(lx*TL+TL/2))<TL&&p.y<=ly*TL+TL/2){atLadderTop=true;break;}}
      if(upKey&&atLadderTop){
        const isLeft=p.x<W2/2;
        const exit=isLeft?psg.exitL:psg.exitR;
        s.fade={a:true,alpha:0,dir:1,t:0,spd:400,cb:()=>{
          s.loc.ty="dg";s.loc.scr=exit.scr;s.loc.di=psg.di;
          p.x=exit.px;p.y=exit.py;s.ss=null;le(s);sfx("door");
        }};return;
      }
    }else{
      // Gravity
      ss.vy+=GRAV*(dt/16);if(ss.vy>TVEL)ss.vy=TVEL;
      // Jump
      if(jumpKey&&ss.grounded){ss.vy=JUMP;ss.grounded=false;ss.jumping=true;sfx("door");}
      // Apply vertical movement
      p.y+=ss.vy*(dt/16);
      ss.grounded=false;
      // Floor collision (bottom rows 10-11)
      if(p.y+PS>=10*TL&&ss.vy>=0){p.y=10*TL-PS;ss.vy=0;ss.grounded=true;ss.jumping=false;}
      // Ceiling collision (top row 0-1)
      if(p.y<1*TL&&ss.vy<0){p.y=1*TL;ss.vy=0;}
      // Platform collision (one-way from above)
      if(ss.vy>=0){for(const[px2,py2,pw]of psg.platforms){
        const ptop=py2*TL,pleft=px2*TL,pright=(px2+pw)*TL;
        if(pcx>pleft+2&&pcx<pright-2&&p.y+PS>=ptop&&p.y+PS<=ptop+PLAT_H+ss.vy*(dt/16)+2){
          p.y=ptop-PS;ss.vy=0;ss.grounded=true;ss.jumping=false;break;}
      }}
    }
    // Sword attack
    if((ky.has(" ")||ky.has("z")||tc.atk)&&!s.sw.a){s.sw.a=true;s.sw.t=SD;sfx("sword");}
    if(tc.atk)tc.atk=false;
    if(s.sw.a){s.sw.t-=dt;if(s.sw.t<=0)s.sw.a=false;}
    if(p.ifr>0)p.ifr-=dt;
    // Enemy AI + combat (simplified side-scroll)
    for(let i=s.en.length-1;i>=0;i--){const e=s.en[i];e.mt+=dt;if(e.fl>0)e.fl-=dt;
      const ecx=e.x+ES/2,ecy=e.y+ES/2,dist=Math.hypot(pcx-ecx,pcy-ecy);
      // Simple patrol: move back and forth on platforms
      if(e.type==="bat"||e.type==="fire_bat"){
        e.x+=Math.cos(e.mt/600)*1.2*(dt/16);e.y+=Math.sin(e.mt/400)*0.8*(dt/16);
      }else{
        if(!e._ssDir)e._ssDir=1;e.x+=e._ssDir*0.8*(dt/16);
        if(e.x<2*TL||e.x>W2-3*TL)e._ssDir*=-1;
        // Simple gravity for ground enemies
        let onPlat=false;
        for(const[px2,py2,pw]of psg.platforms){if(ecx>px2*TL&&ecx<(px2+pw)*TL&&Math.abs(e.y+ES-py2*TL)<4){onPlat=true;break;}}
        if(e.y+ES<10*TL&&!onPlat)e.y+=2*(dt/16);
        if(e.y+ES>=10*TL)e.y=10*TL-ES;
      }
      // Sword hit check
      if(s.sw.a){const sDir=ss.facing>0?1:3;let sx2=pcx,sy2=pcy;
        if(sDir===1)sx2+=SR*0.7;else sx2-=SR*0.7;
        if(Math.hypot(sx2-ecx,sy2-ecy)<SR+ES*0.3&&e.fl<=0){
          const dmg=p.hasMasterSword?2:1;e.hp-=dmg;e.fl=300;
          const kba=Math.atan2(ecy-pcy,ecx-pcx);e.x+=Math.cos(kba)*12;
          sfx("hit");s.dmgNums.push({x:ecx,y:ecy-8,t:600,val:dmg,c:"#fff"});
          s.pt.push(...Array.from({length:4},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:300,c:"#fff"})));
        }}
      if(e.hp<=0){s.en.splice(i,1);sfx("kill");
        s.pt.push(...Array.from({length:8},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:400,c:"#f88"})));
        if(Math.random()<0.4)s.drops.push({x:ecx,y:ecy-4,vy:-2,ground:ecy,type:Math.random()<0.5?"heart":"rupee_green",t:0});
        continue;}
      // Player damage
      if(p.ifr<=0&&dist<(PS+ES)*0.4){p.hp--;p.ifr=IFR;sfx("hurt");s.shake.t=200;
        const hka=Math.atan2(pcy-ecy,pcx-ecx);p.x+=Math.cos(hka)*6;
        if(e.type==="fire_bat"){p.burn=2000;p.burnTick=0;}
        if(e.type==="ghost"){p.freeze=1500;}
        if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}}
    // Drops
    for(let i=s.drops.length-1;i>=0;i--){const d2=s.drops[i];d2.t+=dt;d2.y+=d2.vy*(dt/16);d2.vy+=0.15*(dt/16);
      if(d2.y>d2.ground){d2.y=d2.ground;d2.vy*=-0.4;if(Math.abs(d2.vy)<0.3)d2.vy=0;}
      if(Math.abs(pcx-d2.x)<14&&Math.abs(pcy-d2.y)<14){
        if(d2.type==="heart"){p.hp=Math.min(p.hp+1,p.mhp);sfx("pickup");}
        else if(d2.type==="rupee_green"){p.rupees+=1;sfx("pickup");s.dmgNums.push({x:pcx,y:pcy,t:800,val:"+1",c:"#4f4"});}
        else if(d2.type==="rupee_blue"){p.rupees+=5;sfx("pickup");s.dmgNums.push({x:pcx,y:pcy,t:800,val:"+5",c:"#44f"});}
        else if(d2.type==="bomb"){if(p.hasBombs){p.bombs++;sfx("pickup");}}
        // Sparkle burst on pickup
        const spkC=d2.type==="heart"?"#f88":d2.type.includes("rupee")?"#8f8":"#88f";
        for(let si=0;si<8;si++){const ang=Math.PI*2*si/8;
          s.pt.push({x:d2.x,y:d2.y,dx:Math.cos(ang)*2.5,dy:Math.sin(ang)*2.5-1,l:500,c:spkC});
          s.pt.push({x:d2.x,y:d2.y,dx:Math.cos(ang+0.4)*1.2,dy:Math.sin(ang+0.4)*1.2-0.5,l:350,c:"#fff"});}
        s.drops.splice(i,1);continue;}
      if(d2.t>6000)s.drops.splice(i,1);}
    // Particles & damage numbers
    for(let i=s.pt.length-1;i>=0;i--){const pt=s.pt[i];pt.x+=pt.dx*(dt/16);pt.y+=pt.dy*(dt/16);pt.l-=dt;if(pt.l<=0)s.pt.splice(i,1);}
    for(let i=s.dmgNums.length-1;i>=0;i--){const dn=s.dmgNums[i];dn.y-=1.2*(dt/16);dn.t-=dt;if(dn.t<=0)s.dmgNums.splice(i,1);}
    if(s.msg.t>0)s.msg.t-=dt;
    if(p.burn>0){p.burn-=dt;p.burnTick+=dt;if(p.burnTick>=500){p.burnTick=0;if(p.ifr<=0){p.hp--;sfx("hurt");if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}}}
    return;
  }
  if(s.shake.t>0){s.shake.t-=dt;const intensity=s.shake.t/300*4;s.shake.x=(Math.random()-.5)*intensity;s.shake.y=(Math.random()-.5)*intensity;}
  else{s.shake.x=0;s.shake.y=0;}
  if(s.p.hp<=2)s.lowHp+=dt;else s.lowHp=0;

  // --- Weather system update ---
  {const w=s.weather;w.timer+=dt;
  if(s.loc.ty==="ow"){
    const biome=getBiome(s.loc.scr);
    // Per-biome weather: each biome has its own weather state + timer
    if(!w.biomeWeather[biome])w.biomeWeather[biome]={active:"clear",timer:20000+Math.random()*30000};
    const bw=w.biomeWeather[biome];
    bw.timer-=dt;
    if(bw.timer<=0){
      bw.active=rollWeather(biome);
      bw.timer=20000+Math.random()*40000;// 20-60s until next change
    }
    w.type=bw.active;
    // Wind oscillates slowly
    w.wind=Math.sin(w.timer/4000)*1.5;
    // Manage weather drop particles
    if(w.type==="rain"){
      const spawnRate=3;
      for(let i=0;i<spawnRate;i++){w.drops.push({x:Math.random()*W2+w.wind*20,y:-8-Math.random()*40,vy:5+Math.random()*2,vx:w.wind*2+0.5,l:1,sp:0.3+Math.random()*0.2});}
      w.fog=Math.min(0.08,w.fog+dt*0.00002);
    }else if(w.type==="snow"){
      const spawnRate=6;
      for(let i=0;i<spawnRate;i++){w.drops.push({x:Math.random()*(W2+40)-20,y:-4-Math.random()*30,vy:0.6+Math.random()*0.5,vx:w.wind+Math.sin(w.timer/600+i)*0.3,l:1,sp:1+Math.random()*2.5,wobble:Math.random()*Math.PI*2});}
      w.fog=Math.min(0.12,w.fog+dt*0.00003);
    }else if(w.type==="fog"){
      const isShadow=getBiome(s.loc.scr)==="shadow_forest";
      const fogMax=isShadow?0.50:0.25;
      if(isShadow){w.fog=fogMax;}// shadow forest: always full fog instantly
      else{w.fog=Math.min(fogMax,w.fog+dt*0.00005);}
      if(Math.random()<(isShadow?0.25:0.15)){w.drops.push({x:Math.random()*W2,y:-4,vy:3+Math.random(),vx:w.wind*0.5,l:1,sp:0.2});}
    }else{// clear — fog and drops fade out naturally
      w.fog=Math.max(0,w.fog-dt*0.0002);
    }
    // Update drops
    for(let i=w.drops.length-1;i>=0;i--){const d=w.drops[i];
      d.x+=d.vx*(dt/16);d.y+=d.vy*(dt/16);
      if(d.wobble!==undefined)d.x+=Math.sin(d.wobble+w.timer/300)*0.3;
      if(d.y>H2||d.x<-20||d.x>W2+20)w.drops.splice(i,1);}
    if(w.drops.length>400)w.drops.splice(0,w.drops.length-400);
  }else{
    // Indoors: no weather, fade fog out
    w.fog=Math.max(0,w.fog-dt*0.0003);
    w.drops.length=0;w.type="clear";
  }}

  const ky=kyR.value,p=s.p,tc=tcR.value;let dx=0,dy=0;
  if(!s.hookshot){// no movement input during hookshot
  if(ky.has("arrowup")||ky.has("w")){dy=-1;p.dir=0;}if(ky.has("arrowdown")||ky.has("s")){dy=1;p.dir=2;}
  if(ky.has("arrowleft")||ky.has("a")){dx=-1;p.dir=3;}if(ky.has("arrowright")||ky.has("d")){dx=1;p.dir=1;}
  if(tc.dir==="up"){dy=-1;p.dir=0;}if(tc.dir==="down"){dy=1;p.dir=2;}
  if(tc.dir==="left"){dx=-1;p.dir=3;}if(tc.dir==="right"){dx=1;p.dir=1;}}
  if(dx&&dy){dx*=.707;dy*=.707;}
  const shieldUp=(ky.has("x")||ky.has("shift"))&&!s.sw.a;
  s.p.shield=shieldUp;
  if(shieldUp){dx*=0.4;dy*=0.4;}
  if(p.snare>0)p.snare-=dt;
  const fzMult=p.snare>0?0:p.freeze>0?0.4:1.0;
  // Thick vegetation slowdown (tallgrass in dungeons)
  const ptm=gm(s);const ptx0=Math.floor((p.x+PS/2)/TL),pty0=Math.floor((p.y+PS/2)/TL);
  const vegSlow=(s.loc.ty==="dg"&&ptm&&pty0>=0&&pty0<RO&&ptx0>=0&&ptx0<CO&&ptm[pty0][ptx0]===T.TALLGRASS)?0.5:1;
  const sp=p.spd*fzMult*vegSlow*(dt/16);
  const HB={x:6,y:4,w:PS-12,h:PS-4};
  const tm=(px2,py2)=>{const l=Math.floor((px2+HB.x)/TL),r=Math.floor((px2+HB.x+HB.w-1)/TL),t2=Math.floor((py2+HB.y)/TL),b=Math.floor((py2+HB.y+HB.h-1)/TL);
    for(let ty=t2;ty<=b;ty++)for(let tx=l;tx<=r;tx++)if(iS(s,tx,ty))return false;return true;};
  // Safety: if player is stuck inside a wall, push them out (skip during hookshot pull)
  if(!s.hookshot&&!tm(p.x,p.y)){const cx=Math.floor((p.x+PS/2)/TL)*TL+TL/2-PS/2,cy=Math.floor((p.y+PS/2)/TL)*TL+TL/2-PS/2;
    for(let r=1;r<=6;r++){for(const[ox,oy]of[[0,-1],[0,1],[-1,0],[1,0],[1,-1],[-1,-1],[1,1],[-1,1]]){if(tm(cx+ox*TL*r,cy+oy*TL*r)){p.x=cx+ox*TL*r;p.y=cy+oy*TL*r;break;}}if(tm(p.x,p.y))break;}}
  const moved=dx!==0||dy!==0;
  // Set move direction for ledge collision checks
  s._moveDir=dy<0?0:dy>0?2:dx>0?1:dx<0?3:p.dir;
  if(tm(p.x+dx*sp,p.y+dy*sp)){p.x+=dx*sp;p.y+=dy*sp;}
  else{if(dx!==0){s._moveDir=dx>0?1:3;}if(tm(p.x+dx*sp,p.y))p.x+=dx*sp;if(dy!==0){s._moveDir=dy>0?2:0;}if(tm(p.x,p.y+dy*sp))p.y+=dy*sp;}
  if(moved&&dx!==0&&!tm(p.x+dx*sp*2,p.y)){const cy=p.y+HB.y+HB.h/2,tcy=Math.round(cy/TL)*TL;const off=cy-tcy;
    if(Math.abs(off)<10&&tm(p.x+dx*sp,p.y-Math.sign(off)*2))p.y-=Math.sign(off)*1.5*(dt/16);}
  if(moved&&dy!==0&&!tm(p.x,p.y+dy*sp*2)){const cx=p.x+HB.x+HB.w/2,tcx=Math.round(cx/TL)*TL;const off=cx-tcx;
    if(Math.abs(off)<10&&tm(p.x-Math.sign(off)*2,p.y+dy*sp))p.x-=Math.sign(off)*1.5*(dt/16);}
  // Ledge hop detection
  if(s.ledgeHop>0)s.ledgeHop-=dt;
  if(moved){const ptx3=Math.floor((p.x+PS/2)/TL),pty3=Math.floor((p.y+PS/2)/TL),m4=gm(s);
    if(m4&&pty3>=0&&pty3<RO&&ptx3>=0&&ptx3<CO){const ft2=m4[pty3][ptx3];
      if(ft2===T.LEDGE_S||ft2===T.LEDGE_N||ft2===T.LEDGE_E||ft2===T.LEDGE_W){
        if(s.ledgeHop<=0){s.ledgeHop=250;sfx("door");
          s.pt.push(...Array.from({length:4},()=>({x:p.x+PS/2,y:p.y+PS,dx:(Math.random()-.5)*2,dy:-Math.random()*1.5,l:300,c:"#aaa"})));}}}}
  // Footstep particles by terrain + running dust
  if(moved&&s.gt%6<2){const ftx2=Math.floor((p.x+PS/2)/TL),fty2=Math.floor((p.y+PS-2)/TL),mp3=gm(s);
    if(mp3&&fty2>=0&&fty2<RO&&ftx2>=0&&ftx2<CO){const ft=mp3[fty2][ftx2],fx=p.x+PS/2+(Math.random()-.5)*6,fy=p.y+PS-2;
      if(ft===T.GRASS||ft===T.TALLGRASS||ft===T.FLOWER)s.pt.push({x:fx,y:fy,dx:(Math.random()-.5)*1.5,dy:-Math.random()*1.2,l:250,c:Math.random()>.5?"#5a5":"#7b7"});
      else if(ft===T.SAND)s.pt.push({x:fx,y:fy,dx:(Math.random()-.5)*2,dy:-Math.random()*0.8,l:300,c:Math.random()>.5?"#d4b060":"#c8a848"});
      else if(ft===T.WATER||ft===T.BRIDGE)s.pt.push({x:fx,y:fy,dx:(Math.random()-.5)*2,dy:-Math.random()*1.5,l:200,c:Math.random()>.5?"#6af":"#8cf"});
      else if(ft===T.ICE)s.pt.push({x:fx,y:fy,dx:(Math.random()-.5)*2.5,dy:-Math.random()*1,l:300,c:Math.random()>.5?"#cef":"#fff"});
      else if(ft===T.PATH)s.pt.push({x:fx,y:fy,dx:(Math.random()-.5)*1,dy:-Math.random()*0.5,l:200,c:"#8a7050"});
      else if(ft===T.FLOOR&&s.loc.ty!=="ow")s.pt.push({x:fx,y:fy,dx:(Math.random()-.5)*1,dy:-Math.random()*0.5,l:200,c:"rgba(150,150,150,0.5)"});
      // Running dust puffs — small cloud behind player
      if(!shieldUp&&fzMult>=1){const ddx=p.dir===1?-1:p.dir===3?1:0,ddy=p.dir===0?1:p.dir===2?-1:0;
        s.pt.push({x:fx+ddx*4,y:fy+ddy*2,dx:ddx*0.8+(Math.random()-.5)*0.5,dy:-0.5-Math.random()*0.5,l:200,c:"rgba(180,170,150,0.4)"});
        if(Math.random()<0.3)s.pt.push({x:fx+ddx*6,y:fy+ddy*3,dx:ddx*1.2+(Math.random()-.5)*0.3,dy:-0.8-Math.random()*0.3,l:180,c:"rgba(160,150,130,0.3)"});}
      // Forest biome — kick up leaf particles
      if(s.loc.ty==="ow"&&getBiome(s.loc.scr)==="forest"&&(ft===T.GRASS||ft===T.TALLGRASS)&&Math.random()<0.25){
        const lc=Math.random()>.5?"rgba(120,170,50,0.6)":"rgba(90,140,30,0.5)";
        s.pt.push({x:fx+(Math.random()-.5)*4,y:fy-2,dx:(Math.random()-.5)*2,dy:-1-Math.random()*1.5,l:600,c:lc});}}}
  if(p.burn>0){p.burn-=dt;p.burnTick+=dt;if(p.burnTick>=500){p.burnTick=0;if(p.ifr<=0){p.hp--;sfx("hurt");
    s.pt.push(...Array.from({length:3},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*2,dy:-Math.random()*2,l:400,c:"#f80"})));
    if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}}}
  if(p.poison>0){p.poison-=dt;p.poisonTick+=dt;if(p.poisonTick>=600){p.poisonTick=0;if(p.ifr<=0&&p.hp>1){p.hp--;sfx("hurt");
    s.pt.push(...Array.from({length:3},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*2,dy:-Math.random()*2,l:400,c:"#4a2"})));
    }}}
  if(p.freeze>0){p.freeze-=dt;}
  const spdMult=p.snare>0?0:p.freeze>0?0.4:1.0;
  {const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);const m2=gm(s);
    if(m2&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO&&m2[pty][ptx]===T.ICE){
      if(!s.iceSlide.active&&(dx!==0||dy!==0)){s.iceSlide={active:true,dx:dx>0?1:dx<0?-1:0,dy:dy>0?1:dy<0?-1:0};}
      // Player can change direction while sliding
      if(s.iceSlide.active&&(dx!==0||dy!==0)){const nd=dx>0?1:dx<0?-1:0,ndy=dy>0?1:dy<0?-1:0;
        if(nd!==s.iceSlide.dx||ndy!==s.iceSlide.dy){s.iceSlide.dx=nd||s.iceSlide.dx;s.iceSlide.dy=ndy||s.iceSlide.dy;}}
      if(s.iceSlide.active){const isp=sp*0.55;const nx=p.x+s.iceSlide.dx*isp,ny=p.y+s.iceSlide.dy*isp;
        if(tm(nx,ny)){p.x=nx;p.y=ny;}else{s.iceSlide.active=false;s.iceSlide.dx=0;s.iceSlide.dy=0;}}
    }else{s.iceSlide.active=false;s.iceSlide.dx=0;s.iceSlide.dy=0;}}
  {const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);const m2=gm(s);
    if(m2&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO&&m2[pty][ptx]===T.TSWITCH){
      const tk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:tswitch`;
      const sk=`${tk}:${ptx},${pty}`;// per-tile switch key
      if(!s.timedDoors.find(td=>td.key===tk)){
        // Count total switches in room and track which have been triggered
        if(!s._tswitchHit)s._tswitchHit={};
        if(!s._tswitchHit[tk])s._tswitchHit[tk]=new Set();
        if(!s._tswitchHit[tk].has(sk)){
          s._tswitchHit[tk].add(sk);sfx("pickup");s.shake.t=200;
          let totalSwitches=0;
          for(let yy=0;yy<RO;yy++)for(let xx=0;xx<CO;xx++){if(m2[yy][xx]===T.TSWITCH)totalSwitches++;}
          s.pt.push(...Array.from({length:6},()=>({x:ptx*TL+16,y:pty*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:400,c:"#fd3"})));
          if(s._tswitchHit[tk].size<totalSwitches){
            s.msg={text:`Switch ${s._tswitchHit[tk].size}/${totalSwitches} activated!`,t:1500};
          }else{
            // All switches triggered — open doors and retract spikes
            s._tswitchHit[tk]=null;
            let hasDoors=false,hasSpikes=false;const spikePos=[];
            for(let yy=0;yy<RO;yy++)for(let xx=0;xx<CO;xx++){
              if(m2[yy][xx]===T.DOOR||m2[yy][xx]===T.BOSS_DOOR){hasDoors=true;
                const dk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${xx},${yy}`;s.dr.add(dk);
                s.pt.push(...Array.from({length:4},()=>({x:xx*TL+16,y:yy*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:400,c:"#fd3"})));}
              if(m2[yy][xx]===T.SPIKE){hasSpikes=true;spikePos.push([xx,yy]);
                m2[yy][xx]=T.FLOOR;
                s.pt.push({x:xx*TL+16,y:yy*TL+16,dx:(Math.random()-.5)*2,dy:-Math.random()*2,l:300,c:"#aaa"});}}
            if(hasDoors||hasSpikes)s.msg={text:hasDoors?"All switches hit! Hurry!":"Spikes retracted! Hurry!",t:1500};
            s.timedDoors.push({key:tk,t:5000,scr:s.loc.scr,di:s.loc.di,ty:s.loc.ty,spikes:spikePos});}}}}}
  for(let i=s.timedDoors.length-1;i>=0;i--){const td=s.timedDoors[i];td.t-=dt;
    if(td.t<=0){
      const m2=td.ty==="dg"?s.dg[td.di]?.rooms[td.scr]?.tiles:null;
      if(m2){// Re-lock doors
        for(let yy=0;yy<RO;yy++)for(let xx=0;xx<CO;xx++){if(m2[yy][xx]===T.DOOR){
          const dk=`${td.ty}:${td.di}:${td.scr}:${xx},${yy}`;s.dr.delete(dk);}}
        // Restore spikes
        if(td.spikes){for(const[sx2,sy2]of td.spikes)m2[sy2][sx2]=T.SPIKE;}}
      s.timedDoors.splice(i,1);sfx("door");
      s.msg={text:td.spikes?.length?"Spikes returned!":"Doors closed!",t:1000};}}
  {const m2=gm(s);if(m2){
    const pcx=Math.floor((p.x+PS/2)/TL),pcy=Math.floor((p.y+PS/2)/TL);
    const ftx=pcx+(p.dir===1?1:p.dir===3?-1:0),fty=pcy+(p.dir===0?-1:p.dir===2?1:0);
    if(ftx>=0&&ftx<CO&&fty>=0&&fty<RO){const ft=m2[fty][ftx];
      if(ft===T.DOOR||ft===T.BOSS_DOOR){const dk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${ftx},${fty}`;
        // Open paired door tile helper
        const openPair2=()=>{const pairs=[[ftx-1,fty],[ftx+1,fty],[ftx,fty-1],[ftx,fty+1]];
          for(const[px2,py2]of pairs){if(px2>=0&&px2<CO&&py2>=0&&py2<RO&&m2[py2][px2]===ft){
            s.dr.add(`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${px2},${py2}`);
            s.pt.push(...Array.from({length:6},()=>({x:px2*TL+16,y:py2*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:500,c:ft===T.BOSS_DOOR?"#c070ff":"#fd3"})));}}};
        if(!s.dr.has(dk)){
          if(ft===T.BOSS_DOOR){if(s.bossFight){s.msg={text:"The door won't budge during battle!",t:1500};}
            else if(p.masterKey[s.loc.di]){s.dr.add(dk);openPair2();sfx("dooropen");s.msg={text:"Master key used! Boss door opened!",t:1500};
            s.pt.push(...Array.from({length:12},()=>({x:ftx*TL+16,y:fty*TL+16,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:600,c:Math.random()>.5?"#c070ff":"#fd3"})));}
            else{s.msg={text:"Locked! Find the Master Key...",t:1500};}}
          else if(p.keys>0){p.keys--;s.dr.add(dk);openPair2();sfx("dooropen");s.msg={text:"Door opened!",t:1500};
            s.pt.push(...Array.from({length:8},()=>({x:ftx*TL+16,y:fty*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:500,c:"#fd3"})));}}}}
  }}
  if(moved){const m2=gm(s);if(m2){
    const pcx=Math.floor((p.x+PS/2)/TL),pcy=Math.floor((p.y+PS/2)/TL);
    const ftx=pcx+(dx>0?1:dx<0?-1:0),fty=pcy+(dy>0?1:dy<0?-1:0);
    if(ftx>=0&&ftx<CO&&fty>=0&&fty<RO&&m2[fty][ftx]===T.PUSH&&!s.pushCd){
      const bx=ftx+(dx>0?1:dx<0?-1:0),by=fty+(dy>0?1:dy<0?-1:0);
      // Special: push block into pit -- only in rooms flagged pitPuzzle
      const roomD=s.loc.ty==="dg"?s.dg[s.loc.di]?.rooms[s.loc.scr]:null;
      if(bx>=0&&bx<CO&&by>=0&&by<RO&&m2[by][bx]===T.PIT&&roomD?.pitPuzzle){
        m2[fty][ftx]=T.FLOOR;m2[by][bx]=T.FLOOR;// block falls into pit, both become floor
        s.pushCd=true;setTimeout(()=>{if(stR.value)stR.value.pushCd=false;},300);
        sfx("bomb");s.shake.t=200;s.pt.push(...Array.from({length:6},()=>({x:bx*TL+16,y:by*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:400,c:"#888"})));
        // Check if all pits in room are now filled -- if so, drop a key (once only)
        const pitRk=`pit:${s.loc.ty}:${s.loc.di}:${s.loc.scr}`;
        let pitsLeft=false;for(let yy=0;yy<RO;yy++)for(let xx=0;xx<CO;xx++)if(m2[yy][xx]===T.PIT)pitsLeft=true;
        if(!pitsLeft&&!s.co.has(pitRk)){s.co.add(pitRk);sfx("itemget");s.shake.t=300;s.msg={text:"A key appeared!",t:1500};
          s.drops.push({x:W2/2,y:-20,vy:0.5,ground:H2/2,type:"key_drop",t:0});}
      }
      else if(bx>=0&&bx<CO&&by>=0&&by<RO&&!SOLID.has(m2[by][bx])&&m2[by][bx]!==T.DOOR&&m2[by][bx]!==T.BOSS_DOOR&&m2[by][bx]!==T.SPIKE&&m2[by][bx]!==T.STAIRS_UP&&m2[by][bx]!==T.PIT&&m2[by][bx]!==T.STAIRS_DOWN&&m2[by][bx]!==T.LEVER&&m2[by][bx]!==T.TORCH){
        const wasPlate=m2[by][bx]===T.PLATE;
        // Determine what tile to reveal under the block
        let revealTile=s.loc.ty==="dg"?T.FLOOR:T.GRASS;
        const roomDSU=s.loc.ty==="dg"?s.dg[s.loc.di]?.rooms[s.loc.scr]:null;
        if(roomDSU?.stairsUnder&&roomDSU.stairsUnder[0]===ftx&&roomDSU.stairsUnder[1]===fty){
          revealTile=T.STAIRS_DOWN;
        }else if(s.loc.ty==="ow"){
          for(const cv of CAVES){if(cv.s===s.loc.scr){for(const[cx2,cy2]of cv.t){if(cx2===ftx&&cy2===fty){revealTile=T.ENTRANCE;break;}}if(revealTile===T.ENTRANCE)break;}}
        }
        // Start smooth slide animation
        m2[by][bx]=s.loc.ty==="ow"?T.ROCK:T.PUSH;// overworld: permanent; dungeon: still pushable
        m2[fty][ftx]=T.FLOOR;// temp clear source for rendering (animation overlays)
        const pushDur=s.loc.ty==="ow"?800:250;
        s.pushAnim={fx:ftx*TL,fy:fty*TL,tx:bx*TL,ty:by*TL,t:0,dur:pushDur,
          reveal:revealTile,rx:ftx,ry:fty,isDg:s.loc.ty==="dg",wasPlate};
        s.pushCd=true;
        if(s.loc.ty==="ow")s.freeze=pushDur;
        sfx("door");s.pt.push(...Array.from({length:4},()=>({x:ftx*TL+16,y:fty*TL+16,dx:(Math.random()-.5)*2,dy:(Math.random()-.5)*2,l:300,c:"#aaa"})));
        if(wasPlate){s.shake.t=200;
          const roomD3=s.loc.ty==="dg"?s.dg[s.loc.di]?.rooms[s.loc.scr]:null;
          if(roomD3?.squarePuzzle){sfx("pickup");}
          else{sfx("pickup");s.pushAnim.plateTriggered=true;}}// defer stairsReveal to after animation
      }}}}
  if(s.sw.a&&s.sw.t>SD*0.5){const m2=gm(s);if(m2&&!s.leverCd){
    const pcx=Math.floor((p.x+PS/2)/TL),pcy=Math.floor((p.y+PS/2)/TL);
    const ftx=pcx+(p.dir===1?1:p.dir===3?-1:0),fty=pcy+(p.dir===0?-1:p.dir===2?1:0);
    if(ftx>=0&&ftx<CO&&fty>=0&&fty<RO&&m2[fty][ftx]===T.LEVER){
      m2[fty][ftx]=T.FLOOR;s.leverCd=true;setTimeout(()=>{if(stR.value)stR.value.leverCd=false;},1000);
      s.shake.t=200;
      s.pt.push(...Array.from({length:8},()=>({x:ftx*TL+16,y:fty*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:500,c:"#f88"})));
      const roomD4=s.loc.ty==="dg"?s.dg[s.loc.di]?.rooms[s.loc.scr]:null;
      if(roomD4?.stairsReveal){const[srx,sry]=roomD4.stairsReveal;
        m2[sry][srx]=T.STAIRS_DOWN;sfx("secret");s.msg={text:"Lever pulled! A stairway appeared!",t:2000};
        s.pt.push(...Array.from({length:12},()=>({x:srx*TL+16,y:sry*TL+16,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:800,c:Math.random()>.5?"#fa0":"#fd3"})));
      }else{sfx("pickup");s.msg={text:"Lever pulled! A key appeared!",t:1500};
        m2[5][8]=T.KEY;s.pt.push(...Array.from({length:8},()=>({x:8*TL+16,y:5*TL+16,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:600,c:"#fd3"})));}}}}
  // Sword cuts bushes / tallgrass — chance to drop hearts/rupees
  if(s.sw.a&&s.sw.t>SD*0.5&&!s.bushCd){const mB=gm(s);if(mB){
    const pcxB=Math.floor((p.x+PS/2)/TL),pcyB=Math.floor((p.y+PS/2)/TL);
    const ftxB=pcxB+(p.dir===1?1:p.dir===3?-1:0),ftyB=pcyB+(p.dir===0?-1:p.dir===2?1:0);
    if(ftxB>=0&&ftxB<CO&&ftyB>=0&&ftyB<RO){const tlB=mB[ftyB][ftxB];
      if(tlB===T.BUSH||tlB===T.TALLGRASS){
        s.bushCd=true;setTimeout(()=>{if(stR.value)stR.value.bushCd=false;},300);
        mB[ftyB][ftxB]=s.loc.ty==="dg"?T.FLOOR:T.GRASS;
        sfx("pickup");
        // Leaf particles
        const leafCount=tlB===T.BUSH?10:6;
        for(let i=0;i<leafCount;i++)s.pt.push({x:ftxB*TL+16,y:ftyB*TL+16,dx:(Math.random()-.5)*3.5,dy:-Math.random()*2.5-0.5,l:600,c:Math.random()>.5?"#3aaa2a":"#5ac038"});
        // Chance to drop an item — bushes 18%, tallgrass 10%
        const dropChance=tlB===T.BUSH?0.18:0.10;
        if(Math.random()<dropChance){const r=Math.random();
          const dropType=r<0.55?"heart":r<0.85?"rupee_green":"rupee_blue";
          s.drops.push({x:ftxB*TL+16-6,y:ftyB*TL+16-8,vy:-2.5,ground:ftyB*TL+20,type:dropType,t:0});}
      }}}}
  // Push block slide animation
  if(s.pushAnim){s.pushAnim.t+=dt;
    if(s.pushAnim.t>=s.pushAnim.dur){
      // Animation complete — reveal tile under original position
      const pa=s.pushAnim,m3=gm(s);
      if(m3){
        m3[pa.ry][pa.rx]=pa.reveal;
        if(pa.reveal===T.STAIRS_DOWN){sfx("secret");s.shake.t=400;
          s.msg={text:"A hidden stairway!",t:2000};
          s.pt.push(...Array.from({length:15},()=>({x:pa.rx*TL+16,y:pa.ry*TL+16,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:900,c:Math.random()>.5?"#fa0":"#fd3"})));
        }else if(pa.reveal===T.ENTRANCE){sfx("secret");s.shake.t=400;
          s.msg={text:"A hidden cave entrance!",t:2000};
          s.pt.push(...Array.from({length:15},()=>({x:pa.rx*TL+16,y:pa.ry*TL+16,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:900,c:Math.random()>.5?"#fa0":"#fd3"})));
        }
        // Persist all overworld boulder moves permanently
        if(s.loc.ty==="ow"){
          const bScr=s.loc.scr;const bTx=Math.round(pa.tx/TL),bTy=Math.round(pa.ty/TL);
          s.mb.add(`${bScr}:${pa.rx},${pa.ry}:${bTx},${bTy}:${pa.reveal}`);
        }
      }
      // Deferred plate trigger — stairsReveal or key after push completes
      if(pa.plateTriggered&&m3&&s.loc.ty==="dg"){const roomD6=s.dg[s.loc.di]?.rooms[s.loc.scr];
        if(roomD6?.stairsReveal){const[srx,sry]=roomD6.stairsReveal;
          m3[sry][srx]=T.STAIRS_DOWN;sfx("secret");s.shake.t=400;s.msg={text:"A stairway appeared!",t:2000};
          s.pt.push(...Array.from({length:12},()=>({x:srx*TL+16,y:sry*TL+16,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:800,c:Math.random()>.5?"#fa0":"#fd3"})));
        }else{sfx("pickup");s.msg={text:"A key appeared!",t:1500};
          m3[5][7]=T.KEY;s.pt.push(...Array.from({length:8},()=>({x:7*TL+16,y:5*TL+16,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:600,c:"#fd3"})));}}
      s.pushCd=false;s.pushAnim=null;
      // Square puzzle: check if all plate positions have ROCK on them (pushed blocks)
      if(m3&&s.loc.ty==="dg"){const roomD5=s.dg[s.loc.di]?.rooms[s.loc.scr];
        if(roomD5?.squarePuzzle&&roomD5?.stairsReveal&&roomD5?.squarePlates&&!s._squareSolved){
          const allFilled=roomD5.squarePlates.every(([px2,py2])=>m3[py2][px2]===T.PUSH||m3[py2][px2]===T.ROCK);
          if(allFilled){s._squareSolved=true;
            const[srx,sry]=roomD5.stairsReveal;m3[sry][srx]=T.STAIRS_DOWN;
            sfx("secret");s.shake.t=500;s.msg={text:"The square is complete! A stairway appeared!",t:2500};
            s.pt.push(...Array.from({length:20},()=>({x:srx*TL+16,y:sry*TL+16,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:1000,c:Math.random()>.5?"#fa0":"#fd3"})));}}}
    }
  }
  {const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);const m2=gm(s);
    if(m2&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO&&!s.hookshot){// skip hazards during hookshot pull
      if(m2[pty][ptx]===T.SPIKE&&Math.sin(s.gt/750)>0&&p.ifr<=0){if(!p.redArmor||Math.random()>0.5)p.hp--;p.ifr=IFR;sfx("hurt");s.shake.t=200;
        s.pt.push(...Array.from({length:3},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*2,dy:(Math.random()-.5)*2,l:300,c:"#888"})));
        if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}
      if(m2[pty][ptx]===T.PIT&&p.ifr<=0&&!s.pitFall.a){
        const isLavaPit=s.loc.ty==="dg"&&s.dg[s.loc.di]?.th==="fire";
        if(isLavaPit){// Walk through lava — burn damage, no pit fall
          if(!p.redArmor||Math.random()>0.5)p.hp--;p.ifr=IFR;p.burn=2000;p.burnTick=0;
          sfx("hurt");s.shake.t=200;s.msg={text:"Lava burns!",t:800};
          s.pt.push(...Array.from({length:5},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*3,dy:-Math.random()*2,l:400,c:Math.random()>.5?"#f80":"#fa0"})));
          if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}
        }else{s.pitFall={a:true,t:0,x:p.x,y:p.y};sfx("hurt");}}}}
  // Pit fall animation -- handled in update freeze section
  {const m2=gm(s);const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);
    if(s.loc.ty==="ow"&&s.loc.scr==="0,1"&&m2&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO&&m2[pty][ptx]===T.TALLGRASS&&p.poison<=0){
      p.poison=3000;p.poisonTick=0;s.msg={text:"Poisonous swamp!",t:1000};}}
  // Hot spring healing — slowly restores HP
  {const m3=gm(s);const ptx3=Math.floor((p.x+PS/2)/TL),pty3=Math.floor((p.y+PS/2)/TL);
    if(m3&&pty3>=0&&pty3<RO&&ptx3>=0&&ptx3<CO&&m3[pty3][ptx3]===T.HOT_SPRING){
      if(!s._hotSpringT)s._hotSpringT=0;s._hotSpringT+=dt;
      if(s._hotSpringT>=1500&&p.hp<p.mhp){s._hotSpringT=0;p.hp++;sfx("pickup");
        s.pt.push(...Array.from({length:4},()=>({x:p.x+PS/2+(Math.random()-.5)*10,y:p.y+PS/2,dx:(Math.random()-.5)*1.5,dy:-Math.random()*2,l:400,c:Math.random()>.5?"#8ff":"#afa"})));
        if(p.hp>=p.mhp)s.msg={text:"Fully healed!",t:1000};
        else if(!s.msg.t||s.msg.t<=0)s.msg={text:"The warm water soothes you...",t:1200};}
      // Cure status effects
      if(p.burn>0){p.burn=0;s.msg={text:"The water cools your burns...",t:1200};}
      if(p.poison>0){p.poison=0;s.msg={text:"The water cleanses the poison...",t:1200};}
      if(p.freeze>0){p.freeze=0;s.msg={text:"The warm water thaws you...",t:1200};}
      if(p.snare>0){p.snare=0;s.msg={text:"The water washes away the vines...",t:1200};}
      // Fill jar with spring water
      if(s.hasJar&&s.springWater<3){s.springWater=3;s.msg={text:"Jar filled with spring water!",t:1500};}
      // Hidden heart piece in lower-left corner of hot spring (screen 2,2, tile 2,10)
      const hpk="ow:-1:2,2:2,10";
      if(s.loc.scr==="2,2"&&ptx3===2&&pty3===10&&!s.pk.has(hpk)){
        s.pk.add(hpk);p.heartPieces++;sfx("heartpiece");s.freeze=500;s.shake.t=400;
        if(p.heartPieces>=4){p.heartPieces=0;p.mhp+=2;p.hp=p.mhp;sfx("triforce");s.msg={text:"Heart Piece (4/4)! New heart container!",t:2500};}
        else{s.msg={text:`Found a hidden Heart Piece! (${p.heartPieces}/4)`,t:2000};}
        s.pt.push(...Array.from({length:12},()=>({x:ptx3*TL+16,y:pty3*TL+16,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:600,c:Math.random()>.5?"#ff3366":"#8ff"})));}
    }else{s._hotSpringT=0;}}
  if(moved&&Math.random()<0.15){const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);const m2=gm(s);
    if(m2&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO){const ft=m2[pty][ptx];
      if(ft===T.PATH||ft===T.SAND)s.pt.push({x:p.x+PS/2+(Math.random()-0.5)*6,y:p.y+PS-2,dx:(Math.random()-.5)*0.5,dy:-Math.random()*0.8,l:400,c:ft===T.SAND?"#c8b060":"#a89060"});}}
  if((ky.has(" ")||ky.has("z")||tc.atk)&&!s.sw.a){
    let npcHit=false;
    if(s.loc.ty==="ow"&&!s.npcTalk){const npcs=NPC_DATA[s.loc.scr];if(npcs){
      const pcx2=p.x+PS/2,pcy2=p.y+PS/2;
      for(let ni=0;ni<npcs.length;ni++){const npc=npcs[ni],ns2=s.npcState[ni];if(!ns2)continue;
        const ndx=pcx2-(ns2.x+16),ndy=pcy2-(ns2.y+16),ndist=Math.hypot(ndx,ndy);
        if(ndist<TL*1.2){// Close enough -- face NPC to talk
          // Dog + bone = dig up heart piece
          if(npc.name==="Dog"&&p.hasBone&&!s.dogDug){
            p.hasBone=false;s.dogDug=true;sfx("itemget");s.shake.t=400;
            s.npcTalk={name:"Dog",lines:["Arf!! *takes bone excitedly*","*sniff sniff* *digs furiously*","*digs up something shiny!*"],idx:0,charIdx:0,timer:0,dogDig:true};
            npcHit=true;ns2.st="idle";ns2.wait=9999;ns2.dir=Math.abs(ndx)>Math.abs(ndy)?(ndx>0?3:1):(ndy>0?0:2);break;}
          // Ancient Tree + Master Sword = heart piece gift
          if(npc.name==="Ancient Tree"&&p.hasMasterSword&&!s.treeGift){
            s.treeGift=true;sfx("itemget");s.shake.t=400;
            s.npcTalk={name:npc.name,lines:["...*creak*... You carry the Master Sword!","The blade of legend... I can feel its power.","You are truly the hero of Hyrule.","Take this gift I have guarded for ages..."],idx:0,charIdx:0,timer:0,treeGift:true};
            npcHit=true;ns2.st="idle";ns2.wait=9999;break;}
          s.npcTalk={name:npc.name,lines:npc.lines,idx:0,charIdx:0,timer:0};sfx("pickup");npcHit=true;
          ns2.st="idle";ns2.wait=9999;// Stop wandering during talk
          // NPC faces player
          ns2.dir=Math.abs(ndx)>Math.abs(ndy)?(ndx>0?3:1):(ndy>0?0:2);
          break;}}}}
    // Shopkeeper interaction in cave
    if(!npcHit&&s.loc.ty==="cave"&&s.shopGround&&!s.npcTalk){
      const skx=7*TL+16,sky=3*TL+16;const sdist=Math.hypot(p.x+PS/2-skx,p.y+PS/2-sky);
      if(sdist<TL*2){npcHit=true;
        if(p.hasBanana&&!p.redArmor&&p.rupees>=100){
          s.npcTalk={name:"Shopkeeper",lines:["You found my lost Golden Banana!!!!","I'll forge this into Red Armor for you!","That'll be 100 rupees for the crafting.","Here you go! Half damage from now on!"],idx:0,charIdx:0,timer:0,shopTrade:true};
        }else if(p.hasBanana&&!p.redArmor&&p.rupees<100){
          s.npcTalk={name:"Shopkeeper",lines:["My Golden Banana! You found it!","I can forge Red Armor for 100 rupees...","But you don't have enough rupees yet!"],idx:0,charIdx:0,timer:0};
        }else if(p.redArmor){
          s.npcTalk={name:"Shopkeeper",lines:["That Red Armor suits you well!","Come back anytime for supplies."],idx:0,charIdx:0,timer:0};
        }else{
          s.npcTalk={name:"Shopkeeper",lines:["Welcome to my shop!","Walk over items on the floor to buy.","I'm also looking for my lost Golden Banana..."],idx:0,charIdx:0,timer:0};
        }sfx("pickup");}}
    if(!npcHit){s.sw.a=true;s.sw.t=SD;sfx("sword");
      // Light torches with sword -- only in dark rooms
      const isDkRoom=(s.loc.ty==="dg"&&s.dg[s.loc.di]?.rooms[s.loc.scr]?.dark)||(s.loc.ty==="cave"&&CAVES[s.loc.di]?.rooms?.[s.loc.scr]?.dark);
      if(isDkRoom){const m2=gm(s);
        const ftx3=Math.floor((p.x+PS/2)/TL)+(p.dir===1?1:p.dir===3?-1:0);
        const fty3=Math.floor((p.y+PS/2)/TL)+(p.dir===0?-1:p.dir===2?1:0);
        const tk=`${ftx3},${fty3}`;
        if(m2&&fty3>=0&&fty3<RO&&ftx3>=0&&ftx3<CO&&m2[fty3][ftx3]===T.TORCH&&!s.litTorches.has(tk)){
          s.litTorches.add(tk);sfx("pickup");
          s.pt.push(...Array.from({length:8},()=>({x:ftx3*TL+16,y:fty3*TL+16,dx:(Math.random()-.5)*3,dy:-Math.random()*3,l:500,c:Math.random()>.5?"#f80":"#fd3"})));
          // Check if all torches are now lit
          let allLit=true,totalT=0;
          for(let yy=0;yy<RO;yy++)for(let xx=0;xx<CO;xx++)if(m2[yy][xx]===T.TORCH){totalT++;if(!s.litTorches.has(`${xx},${yy}`))allLit=false;}
          if(allLit&&totalT>0){sfx("triforce");s.shake.t=300;s.roomFlash=500;s.msg={text:"All torches lit! A chest appeared!",t:2000};
            // Spawn a chest as reward for lighting all torches
            s.chest={x:W2/2-12,y:H2/2-12,state:"closed",t:0,reward:"rupee_blue"};}
        }}
      // Read dungeon wall sign with sword
      if(s.loc.ty==="dg"){const rmS=s.dg[s.loc.di]?.rooms[s.loc.scr];
        if(rmS?.sign&&rmS?.signPos){const[sgx,sgy]=rmS.signPos;
          const ftx4=Math.floor((p.x+PS/2)/TL)+(p.dir===1?1:p.dir===3?-1:0);
          const fty4=Math.floor((p.y+PS/2)/TL)+(p.dir===0?-1:p.dir===2?1:0);
          if(ftx4===sgx&&fty4===sgy){sfx("pickup");s.msg={text:rmS.sign,t:3000};}}}
    }}if(tc.atk)tc.atk=false;
  if(ky.has("b")&&p.hasBombs&&p.bombs>0&&!s.bombCd&&s.activeBombs.length<2){
    const ftx=Math.floor((p.x+PS/2)/TL)+(p.dir===1?1:p.dir===3?-1:0);
    const fty=Math.floor((p.y+PS/2)/TL)+(p.dir===0?-1:p.dir===2?1:0);
    p.bombs--;s.bombCd=true;setTimeout(()=>{if(stR.value)stR.value.bombCd=false;},800);
    s.activeBombs.push({x:ftx*TL+TL/2,y:fty*TL+TL/2,t:0,fuse:1500,exploded:false});sfx("pickup");
  }
  if(!s.hookshot&&(ky.has("c"))&&p.hasBow&&!s.bowCd&&p.rupees>0&&s.pArrows.length<3){
    p.rupees--;s.bowCd=true;setTimeout(()=>{if(stR.value)stR.value.bowCd=false;},400);
    sfx("sword");
    const adx=p.dir===1?5:p.dir===3?-5:0,ady=p.dir===0?-5:p.dir===2?5:0;
    s.pArrows.push({x:p.x+PS/2,y:p.y+PS/2,dx:adx,dy:ady,l:800});
  }
  // Hookshot firing
  if(ky.has("v")&&p.hasHookshot&&!s.hookshot&&!s.hookshotCd){
    s.hookshotCd=true;setTimeout(()=>{if(stR.value)stR.value.hookshotCd=false;},600);
    sfx("hookshot");
    const hdx=p.dir===1?1:p.dir===3?-1:0,hdy=p.dir===0?-1:p.dir===2?1:0;
    s.hookshot={tipX:p.x+PS/2,tipY:p.y+PS/2,dx:hdx,dy:hdy,st:"extend",spd:6,maxDist:192,target:null,t:0};
  }
  // Hookshot update
  if(s.hookshot){const hs=s.hookshot;hs.t+=dt;
    if(hs.st==="extend"){
      const step=hs.spd*(dt/16);hs.tipX+=hs.dx*step;hs.tipY+=hs.dy*step;
      const dist=Math.hypot(hs.tipX-(p.x+PS/2),hs.tipY-(p.y+PS/2));
      if(dist>=hs.maxDist){hs.st="retract";}
      // Tile collision
      const htx=Math.floor(hs.tipX/TL),hty=Math.floor(hs.tipY/TL),hm=gm(s);
      if(hm&&htx>=0&&htx<CO&&hty>=0&&hty<RO){const htl=hm[hty][htx];
        if(htl===T.HOOKPOST){hs.target={type:"post",x:htx*TL+TL/2,y:hty*TL+TL/2};
          hs.tipX=htx*TL+TL/2;hs.tipY=hty*TL+TL/2;hs.st="hit";hs.t=0;sfx("door");}
        else if(htl===T.WALL||htl===T.DOOR||htl===T.BOSS_DOOR){hs.st="retract";sfx("door");}}
      if(hs.tipX<0||hs.tipX>W2||hs.tipY<0||hs.tipY>H2)hs.st="retract";
      // Enemy collision
      if(hs.st==="extend"){for(let j=0;j<s.en.length;j++){const e=s.en[j];
        if(e.hp<=0||e.shadowForm||e.burrowed||e.spawnT>0)continue;
        if(Math.hypot(hs.tipX-(e.x+ES/2),hs.tipY-(e.y+ES/2))<ES*0.5){
          e.hp-=1;e.fl=500;e.stun=e.type==="boss"?500:1500;sfx("hit");
          s.dmgNums.push({x:e.x+ES/2,y:e.y-8,t:600,val:1,c:"#0dd"});
          hs.st="retract";break;}}}
    }
    if(hs.st==="hit"){if(hs.t>100){hs.st="pull";hs.t=0;}}
    if(hs.st==="pull"&&hs.target?.type==="post"){
      const pullSpd=4.5*(dt/16);const dx2=hs.target.x-(p.x+PS/2),dy2=hs.target.y-(p.y+PS/2);
      const pullDist=Math.hypot(dx2,dy2);
      if(pullDist<pullSpd+4){// arrived
        p.x=hs.target.x-PS/2-hs.dx*TL;p.y=hs.target.y-PS/2-hs.dy*TL;
        const ftx2=Math.floor((p.x+PS/2)/TL),fty2=Math.floor((p.y+PS/2)/TL);
        if(iS(s,ftx2,fty2)){p.x=hs.target.x-PS/2;p.y=hs.target.y-PS/2;}
        s.hookshot=null;sfx("pickup");
      }else{p.x+=dx2/pullDist*pullSpd;p.y+=dy2/pullDist*pullSpd;}
    }
    if(hs.st==="retract"){const step=hs.spd*1.5*(dt/16);
      const toX=p.x+PS/2,toY=p.y+PS/2,retDist=Math.hypot(hs.tipX-toX,hs.tipY-toY);
      if(retDist<step){s.hookshot=null;}
      else{hs.tipX+=(toX-hs.tipX)/retDist*step;hs.tipY+=(toY-hs.tipY)/retDist*step;}}
  }
  if(s.sw.a){s.sw.t-=dt;if(s.sw.t<=0)s.sw.a=false;}if(p.ifr>0)p.ifr-=dt;
  for(let i=s.pt.length-1;i>=0;i--){const pt=s.pt[i];pt.x+=pt.dx*(dt/16);pt.y+=pt.dy*(dt/16);pt.l-=dt;if(pt.l<=0)s.pt.splice(i,1);}
  for(let i=s.dmgNums.length-1;i>=0;i--){const dn=s.dmgNums[i];dn.y-=1.2*(dt/16);dn.t-=dt;if(dn.t<=0)s.dmgNums.splice(i,1);}
  if(s.roomFlash>0)s.roomFlash-=dt;
  for(let i=s.drops.length-1;i>=0;i--){const d2=s.drops[i];d2.t+=dt;
    if(d2.type==="triforce"||d2.type==="heartcontainer"||d2.type==="key_drop"){
      // Slow descent with gentle gravity cap
      d2.vy=Math.min(d2.vy+0.02*(dt/16),0.8);d2.y+=d2.vy*(dt/16);
      if(d2.spin!=null)d2.spin+=2.5*(dt/16);
      if(d2.y>d2.ground){d2.y=d2.ground;d2.vy=0;}
      // Trailing sparkles during fall
      const sparkCol=d2.type==="triforce"?"#fd3":"#f44";
      if(d2.y<d2.ground&&d2.t%3<1)s.pt.push({x:d2.x+(Math.random()-.5)*10,y:d2.y+8,dx:(Math.random()-.5)*1.5,dy:Math.random()*0.5,l:400,c:Math.random()>.5?sparkCol:"#fff"});
    }else{d2.y+=d2.vy*(dt/16);d2.vy+=0.15*(dt/16);
    if(d2.y>d2.ground){d2.y=d2.ground;d2.vy*=-0.5;if(Math.abs(d2.vy)<0.3)d2.vy=0;}}
    const mdx=p.x+PS/2-d2.x,mdy=p.y+PS/2-d2.y,mdist=Math.hypot(mdx,mdy);
    if((d2.type==="triforce"||d2.type==="heartcontainer"||d2.type==="key_drop")&&d2.y<d2.ground){/* no magnet pull while falling */}
    else if(mdist<40&&mdist>1){const pull=2.5*(1-mdist/40);d2.x+=mdx/mdist*pull*(dt/16);d2.y+=mdy/mdist*pull*(dt/16);}
    if(Math.abs(p.x+PS/2-d2.x)<14&&Math.abs(p.y+PS/2-d2.y)<14){
      if(d2.type==="heart"){p.hp=Math.min(p.hp+1,p.mhp);sfx("pickup");}
      else if(d2.type==="bomb"){if(p.hasBombs){p.bombs++;sfx("pickup");}}
      else if(d2.type==="key_drop"){p.keys++;sfx("itemget");s.msg={text:"Got a key!",t:1500};
        s.pt.push(...Array.from({length:8},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:600,c:"#fd3"})));}
      else if(d2.type==="rupee_green"){p.rupees+=1;sfx("pickup");s.dmgNums.push({x:d2.x,y:d2.y-8,t:800,val:"+1",c:"#4f4"});}
      else if(d2.type==="rupee_blue"){p.rupees+=5;sfx("pickup");s.dmgNums.push({x:p.x+PS/2,y:p.y,t:800,val:"+5",c:"#44f"});}
      else if(d2.type==="heartpiece_drop"){p.heartPieces++;sfx("heartpiece");s.freeze=500;
        if(p.heartPieces>=4){p.heartPieces=0;p.mhp+=2;p.hp=p.mhp;sfx("triforce");s.shake.t=400;s.msg={text:"Heart Piece (4/4)! New heart container!",t:2500};}
        else{s.msg={text:`Heart Piece (${p.heartPieces}/4)`,t:2000};}
        s.pt.push(...Array.from({length:10},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:600,c:Math.random()>.5?"#ff3366":"#ffd633"})));}
      else if(d2.type==="bone"){p.hasBone=true;igTrig(s,"bone");}
      else if(d2.type==="rupee_purple"){p.rupees+=10;sfx("pickup");s.dmgNums.push({x:p.x+PS/2,y:p.y,t:800,val:"+10",c:"#a4f"});}
      else if(d2.type==="rupee_red"){p.rupees+=20;sfx("pickup");s.dmgNums.push({x:p.x+PS/2,y:p.y,t:800,val:"+20",c:"#f44"});}
      else if(d2.type==="bow"){p.hasBow=true;igTrig(s,"bow");}
      else if(d2.type==="bomb_bag"){p.hasBombs=true;p.bombs+=5;igTrig(s,"bomb_bag");}
      else if(d2.type==="master_sword"){p.hasMasterSword=true;igTrig(s,"master_sword");}
      else if(d2.type==="hookshot"){p.hasHookshot=true;igTrig(s,"hookshot");}
      else if(d2.type==="compass"){if(s.loc.di>=0)p.compasses[s.loc.di]=true;igTrig(s,"compass");}
      else if(d2.type==="master_key"){if(s.loc.di>=0)p.masterKey[s.loc.di]=true;igTrig(s,"master_key");}
      else if(d2.type==="heartcontainer"){p.mhp+=2;p.hp=p.mhp;igTrig(s,"heartcontainer");
        if(d2.bossId&&!s.heartContainers.includes(d2.bossId))s.heartContainers.push(d2.bossId);
        // Auto-warp to entrance if boss defeated + triforce already collected + HC just collected
        if(s.bossVictory&&p.tri[s.bossVictory.di]){
          s.bossVictory.fadeDelay=800;}}
      else if(d2.type==="triforce"){p.tri[s.loc.di]=true;sfx("itemget");s.shake.t=500;
        const tc2=p.tri.filter(Boolean).length;
        if(tc2>=3&&!s.finalOpen){s.finalOpen=true;}
        // Hold-up animation + warp portal
        s.triforceHold={t:0,dur:3500,piece:tc2,px:p.x,py:p.y,warp:false};
        s.pt.push(...Array.from({length:20},()=>({x:p.x+PS/2+(Math.random()-.5)*30,y:p.y+PS/2+(Math.random()-.5)*30,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:800,c:"#fd3"})));}
      s.drops.splice(i,1);continue;}
    if(d2.t>8000&&!["triforce","heartcontainer","key_drop","bow","bomb_bag","master_sword","master_key","banana","hookshot","compass"].includes(d2.type))s.drops.splice(i,1);}
  // Boss victory auto-warp — delayed fade to dungeon entrance after collecting all items
  if(s.bossVictory&&s.bossVictory.fadeDelay!=null){
    s.bossVictory.fadeDelay-=dt;
    if(s.bossVictory.fadeDelay<=0){
      const di2=s.bossVictory.di;const bossScr=s.loc.scr;
      s.bossWarp=null;
      s.fade={a:true,alpha:0,dir:1,t:0,spd:1000,cb:()=>{
        const dg3=s.dg[di2];if(dg3){let entryScr="0,0";
          for(const rk3 of Object.keys(dg3.rooms)){if(dg3.rooms[rk3].tiles?.some(r=>r.includes(T.STAIRS_UP))){entryScr=rk3;break;}}
          s.loc.scr=entryScr;p.x=7*TL;p.y=9*TL;s.ec=500;le(s);
          s.heroLand={t:0,dur:2500};}
        s.bossVictory=null;s.triMu=false;}};
    }
  }
  // Chest update -- requires action button to open
  if(s.chest){const ch=s.chest;ch.t+=dt;const ky=kyR.value;
    if(ch.state==="closed"){const cdx=p.x+PS/2-(ch.x+12),cdy=p.y+PS/2-(ch.y+12);
      ch.near=Math.abs(cdx)<24&&Math.abs(cdy)<24;
      if(ch.near&&(ky.has(" ")||ky.has("enter")||ky.has("e")||ky.has("z"))){ch.state="opening";ch.t=0;sfx("door");s.shake.t=200;}}
    else if(ch.state==="opening"&&ch.t>=600){ch.state="presenting";ch.t=0;ch.itemY=0;sfx("door");
      s.co.add(`${s.loc.ty}:${s.loc.di}:${s.loc.scr}`);
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
          const repl=isCave?T.ENTRANCE:T.FLOOR;
          mp2[cy2][cx2]=repl;
          s.bc.add(`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${cx2},${cy2}:${repl}`);
          sfx("secret");s.shake.t=300;
          s.msg={text:isCave?"A hidden cave!":(s.loc.ty==="dg"?"Bombed a wall! Secret passage!":"Secret passage!"),t:2000};
          s.pt.push(...Array.from({length:10},()=>({x:cx2*TL+16,y:cy2*TL+16,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:600,c:Math.random()>.5?"#fa0":"#fd3"})));}}
      // Damage nearby enemies (3 tile radius)
      const blastR=TL*3;
      for(const e of s.en){const ed=Math.hypot(e.x+ES/2-b.x,e.y+ES/2-b.y);
        if(ed<blastR){const bdmg=ed<TL?3:2;e.hp-=bdmg;e.fl=400;
          const ka=Math.atan2(e.y+ES/2-b.y,e.x+ES/2-b.x);e.x+=Math.cos(ka)*20;e.y+=Math.sin(ka)*20;
          s.dmgNums.push({x:e.x+ES/2,y:e.y-8,t:600,val:bdmg,c:"#f80"});}}
      // Hurt player if too close
      const pd=Math.hypot(p.x+PS/2-b.x,p.y+PS/2-b.y);
      if(pd<TL*1.5&&p.ifr<=0){if(!p.redArmor||Math.random()>0.5)p.hp--;p.ifr=IFR;sfx("hurt");s.shake.t=300;}
    }
    if(b.exploded&&b.t>=b.fuse+400)s.activeBombs.splice(i,1);}
  // Blade traps update
  if(s.loc.ty!=="dg")s.bladeTraps=[];
  for(const bt of s.bladeTraps){const pcx=p.x+PS/2,pcy=p.y+PS/2,bcx=bt.x+TL/2,bcy=bt.y+TL/2;
    if(bt.st==="idle"){bt.wait-=dt;if(bt.wait>0)continue;
      // Detect player in line of sight (same row or column, within range)
      if(bt.dir==="h"){if(Math.abs(pcy-bcy)<TL*0.8){
        const dx2=pcx-bcx;if(Math.abs(dx2)<bt.range+TL){bt.st="lunge";bt.vel=dx2>0?7:-7;}}}
      else{if(Math.abs(pcx-bcx)<TL*0.8){
        const dy2=pcy-bcy;if(Math.abs(dy2)<bt.range+TL){bt.st="lunge";bt.vel=dy2>0?7:-7;}}}}
    else if(bt.st==="lunge"){
      if(bt.dir==="h"){bt.x+=bt.vel*(dt/16);
        bt.x=Math.max(TL,Math.min(W2-TL*2,bt.x));
        // Stop if hitting a wall
        const btx=Math.floor((bt.x+(bt.vel>0?TL:0))/TL),bty2=Math.floor((bt.y+TL/2)/TL);
        if(eSolid(s,btx,bty2)){bt.x=bt.vel>0?(btx-1)*TL:btx*TL+TL;bt.st="retract";bt.vel=0;}
        const d2=bt.x-bt.hx;if(Math.abs(d2)>=bt.range){bt.x=bt.hx+(d2>0?bt.range:-bt.range);bt.st="retract";bt.vel=0;}}
      else{bt.y+=bt.vel*(dt/16);
        bt.y=Math.max(TL,Math.min(H2-TL*2,bt.y));
        const btx2=Math.floor((bt.x+TL/2)/TL),bty3=Math.floor((bt.y+(bt.vel>0?TL:0))/TL);
        if(eSolid(s,btx2,bty3)){bt.y=bt.vel>0?(bty3-1)*TL:bty3*TL+TL;bt.st="retract";bt.vel=0;}
        const d2=bt.y-bt.hy;if(Math.abs(d2)>=bt.range){bt.y=bt.hy+(d2>0?bt.range:-bt.range);bt.st="retract";bt.vel=0;}}}
    else if(bt.st==="retract"){
      const dx3=bt.hx-bt.x,dy3=bt.hy-bt.y,dd=Math.hypot(dx3,dy3);
      if(dd<1){bt.x=bt.hx;bt.y=bt.hy;bt.st="idle";bt.wait=500;}
      else{const rsp=1.2*(dt/16);bt.x+=dx3/dd*rsp;bt.y+=dy3/dd*rsp;
        bt.x=Math.max(TL,Math.min(W2-TL*2,bt.x));bt.y=Math.max(TL,Math.min(H2-TL*2,bt.y));}}
    // Player collision
    if(p.ifr<=0&&Math.abs(pcx-bt.x-TL/2)<TL*0.7&&Math.abs(pcy-bt.y-TL/2)<TL*0.7){
      if(!p.redArmor||Math.random()>0.5)p.hp--;p.ifr=IFR;sfx("hurt");s.shake.t=300;
      const ka=Math.atan2(pcy-bcy,pcx-bcx);if(tm(p.x+Math.cos(ka)*12,p.y+Math.sin(ka)*12)){p.x+=Math.cos(ka)*12;p.y+=Math.sin(ka)*12;}
      if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}}
  // Fire trails from magma slugs
  if(s.fireTrails){for(let i=s.fireTrails.length-1;i>=0;i--){const ft=s.fireTrails[i];ft.t-=dt;
    if(ft.t<=0){s.fireTrails.splice(i,1);continue;}
    // Damage player if touching fire
    if(p.ifr<=0&&Math.hypot(p.x+PS/2-ft.x,p.y+PS/2-ft.y)<14){
      if(!p.redArmor||Math.random()>0.5)p.hp--;p.ifr=IFR;sfx("hurt");p.burn=1500;p.burnTick=0;
      if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}}}
  // NPC wandering
  {const npcsD=s.loc.ty==="ow"?NPC_DATA[s.loc.scr]:null;
  for(let ni2=0;ni2<s.npcState.length;ni2++){const ns2=s.npcState[ni2];ns2.mt+=dt;if(ns2.fixed)continue;
    const isDog=npcsD&&npcsD[ni2]&&npcsD[ni2].name==="Dog";
    ns2.wait-=dt;
    if(ns2.st==="idle"&&ns2.wait<=0){ns2.st="walk";ns2.wait=isDog?400+Math.random()*600:800+Math.random()*1500;
      ns2.dir=[0,1,2,3][Math.random()*4|0];}
    else if(ns2.st==="walk"){const nsp=(isDog?1.5:0.5)*(dt/16);
      let nx2=ns2.x,ny2=ns2.y;
      if(ns2.dir===0)ny2-=nsp;if(ns2.dir===2)ny2+=nsp;if(ns2.dir===1)nx2+=nsp;if(ns2.dir===3)nx2-=nsp;
      const wander=isDog?TL*3:TL*2;
      // Check tile collision + wander bounds + screen bounds
      const ntx1=Math.floor((nx2+4)/TL),nty1=Math.floor((ny2+4)/TL),ntx2=Math.floor((nx2+28)/TL),nty2=Math.floor((ny2+28)/TL);
      const mm=gm(s);const blocked=!mm||ntx1<0||nty1<0||ntx2>=CO||nty2>=RO||SOLID.has(mm[nty1]?.[ntx1])||SOLID.has(mm[nty1]?.[ntx2])||SOLID.has(mm[nty2]?.[ntx1])||SOLID.has(mm[nty2]?.[ntx2]);
      if(!blocked&&Math.abs(nx2-ns2.hx)<wander&&Math.abs(ny2-ns2.hy)<wander&&nx2>TL&&nx2<W2-TL*2&&ny2>TL&&ny2<H2-TL*2){ns2.x=nx2;ns2.y=ny2;}
      else{ns2.st="idle";ns2.wait=500+Math.random()*1000;ns2.dir=[0,1,2,3][Math.random()*4|0];}// turn around if blocked
      ns2.wait-=dt;if(ns2.wait<=0){ns2.st="idle";ns2.wait=isDog?300+Math.random()*800:1500+Math.random()*3000;}}}}
  const rk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}`;
  for(let i=s.en.length-1;i>=0;i--){const e=s.en[i];
    if(e.spawnT>0){e.spawnT-=dt;continue;}
    if(e.stun>0){e.stun-=dt;e.fl=Math.max(e.fl,100);continue;}// stunned by hookshot
    e.mt+=dt;if(e.fl>0)e.fl-=dt;
    const pcx=p.x+PS/2,pcy=p.y+PS/2,ecx=e.x+ES/2,ecy=e.y+ES/2,dist=Math.hypot(pcx-ecx,pcy-ecy);
    e.stT+=dt;const isBossLike=e.type==="boss"||e.type==="miniboss";
    const alwaysChase=e.type==="wallmaster"||e.type==="magma_slug"||e.type==="vine_creeper"||e.type==="stalfos";
    const detectRange=isBossLike?250:alwaysChase?300:80;const loseRange=150;
    if(e.st==="patrol"&&dist<detectRange)e.st="chase";
    if(e.st==="chase"&&dist>loseRange&&!isBossLike&&!alwaysChase)e.st="retreat";
    if(e.st==="retreat"&&e.stT>2000){e.st="patrol";e.stT=0;}
    let es=e.type==="boss"?1.0:e.type==="miniboss"?1.5:e.type==="ghost"?1.3:(e.type==="bat"||e.type==="fire_bat")?1.2:e.type==="archer"?0.8:e.type==="mage"?0.6:e.type==="knight"?1.1:e.type==="magma_slug"?0.4:e.type==="vine_creeper"?0.5:e.type==="stalfos"?1.0:e.type==="blob"?0.7:e.type==="shimmer_ghoul"?1.4:1.0;
    let moveX=0,moveY=0;
    if(e.st==="chase"||e.type==="boss"){const ang=Math.atan2(pcy-ecy,pcx-ecx);
      if(e.type==="ghost"||e.type==="bat"||e.type==="fire_bat"||e.type==="shimmer_ghoul"){const w=Math.sin(e.mt/250)*.6;moveX=Math.cos(ang+w)*es;moveY=Math.sin(ang+w)*es;}
      else if(e.type==="miniboss"){
        const mn=e.name||"";
        if(mn==="Vine Guardian"){
          // Vine Guardian: roots in place, then burrows underground and pops up elsewhere
          // Phase cycle: rooted(3s) → burrow(1s) → emerge(0.5s) → rooted...
          if(!e.vinePhase){e.vinePhase="rooted";e.vineT=0;e.vineTarget=null;}
          e.vineT+=dt;
          if(e.vinePhase==="rooted"){
            // Stationary — gentle sway, shoots vine snares
            moveX=Math.sin(e.mt/600)*0.15;moveY=Math.cos(e.mt/800)*0.1;
            // Aimed snare every 1.6s
            if(Math.floor(e.mt/1600)!==Math.floor((e.mt-dt)/1600)){
              const pa2=Math.atan2(pcy-ecy,pcx-ecx);
              s.bProj.push({x:ecx,y:ecy,dx:Math.cos(pa2)*2.5,dy:Math.sin(pa2)*2.5,type:"root",l:1400,snare:true});sfx("bomb");}
            // 5-way burst every 4s
            if(Math.floor(e.mt/4000)!==Math.floor((e.mt-dt)/4000)){
              const ba=Math.atan2(pcy-ecy,pcx-ecx);
              for(let i=-2;i<=2;i++){s.bProj.push({x:ecx,y:ecy,dx:Math.cos(ba+i*0.3)*2,dy:Math.sin(ba+i*0.3)*2,type:"root",l:1000,snare:true});}sfx("bomb");}
            if(e.vineT>3000){e.vinePhase="burrow";e.vineT=0;
              // Pick a spot to flank the player
              const flankA=ang+Math.PI*(0.5+Math.random());const flankD=TL*2.5+Math.random()*TL*2;
              e.vineTarget={x:Math.max(TL*2,Math.min(W2-TL*2,pcx+Math.cos(flankA)*flankD-ES/2)),
                y:Math.max(TL*2,Math.min(H2-TL*2,pcy+Math.sin(flankA)*flankD-ES/2))};
              s.pt.push(...Array.from({length:8},()=>({x:ecx,y:ecy+8,dx:(Math.random()-.5)*3,dy:Math.random()*1,l:400,c:"#654"})));sfx("door");}
          }else if(e.vinePhase==="burrow"){
            // Sink into ground — move toward target while invisible
            e.burrowed=true;
            if(e.vineTarget){const tdx=e.vineTarget.x-e.x,tdy=e.vineTarget.y-e.y,td=Math.hypot(tdx,tdy);
              if(td>2){const bs=6*(dt/16);e.x+=tdx/td*bs;e.y+=tdy/td*bs;}}
            // Ground disturbance particles at travel position
            if(Math.random()<0.5)s.pt.push({x:ecx+(Math.random()-.5)*16,y:ecy+6,dx:(Math.random()-.5)*1,dy:-Math.random()*0.5,l:300,c:Math.random()>.5?"#654":"#483"});
            if(e.vineT>1000){e.vinePhase="emerge";e.vineT=0;e.burrowed=false;
              s.pt.push(...Array.from({length:12},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*3-1,l:500,c:Math.random()>.5?"#4a2":"#654"})));
              sfx("bomb");s.shake.t=200;}
          }else{// emerge — brief pause, then back to rooted
            moveX=0;moveY=0;
            if(e.vineT>500){e.vinePhase="rooted";e.vineT=0;}}
        }else if(mn==="Flame Sentinel"){
          // Flame Sentinel: slow melting lava monster, oozes toward player leaving lava trails
          if(!e.flamePhase){e.flamePhase="ooze";e.flameT=0;}
          e.flameT+=dt;
          if(e.flamePhase==="ooze"){
            // Slow creep toward player
            moveX=Math.cos(ang)*es*0.25;moveY=Math.sin(ang)*es*0.25;
            // Constant lava trail
            if(!e.trailT)e.trailT=0;e.trailT+=dt;
            if(e.trailT>300){e.trailT=0;if(!s.fireTrails)s.fireTrails=[];
              s.fireTrails.push({x:ecx,y:ecy,t:3500});}
            // Dripping lava particles
            if(Math.random()<0.4)s.pt.push({x:ecx+(Math.random()-.5)*12,y:ecy+(Math.random()-.5)*8,dx:(Math.random()-.5)*1,dy:-Math.random()*1,l:300,c:Math.random()>.5?"#f80":"#fa0"});
            // Lob exploding fireball every 2.5s
            if(Math.floor(e.mt/2500)!==Math.floor((e.mt-dt)/2500)){
              const pa2=Math.atan2(pcy-ecy,pcx-ecx);
              s.bProj.push({x:ecx,y:ecy,dx:Math.cos(pa2)*2.5,dy:Math.sin(pa2)*2.5,type:"fire",l:1200,explode:true});sfx("bomb");}
            // After 5s, pause to gather energy
            if(e.flameT>5000){e.flamePhase="gather";e.flameT=0;}
          }else if(e.flamePhase==="gather"){
            // Stop and pulse, gathering lava energy
            moveX=0;moveY=0;
            const spinR=6+e.flameT/60;
            for(let i=0;i<3;i++){const sa=e.mt/80+i*Math.PI*2/3;
              s.pt.push({x:ecx+Math.cos(sa)*spinR,y:ecy+Math.sin(sa)*spinR,dx:0,dy:0,l:250,c:Math.random()>.3?"#f80":"#ff0"});}
            // Eruption: ring of exploding fireballs
            if(e.flameT>1500){e.flamePhase="erupt";e.flameT=0;sfx("bomb");s.shake.t=300;
              for(let a=0;a<6;a++){const ra=a*Math.PI/3;
                s.bProj.push({x:ecx,y:ecy,dx:Math.cos(ra)*2,dy:Math.sin(ra)*2,type:"fire",l:1000,explode:true});}
              s.pt.push(...Array.from({length:12},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:500,c:Math.random()>.3?"#f80":"#ff0"})));}
          }else{// erupt pause, heavy lava trail, then back to ooze
            moveX=0;moveY=0;
            if(!s.fireTrails)s.fireTrails=[];
            if(Math.random()<0.5)s.fireTrails.push({x:ecx+(Math.random()-.5)*TL,y:ecy+(Math.random()-.5)*TL,t:4000});
            if(e.flameT>1200){e.flamePhase="ooze";e.flameT=0;}}
        }else{
          // Shadow Knight: eerie drifting with sudden blink-teleports and afterimages
          if(!e.shadowPhase){e.shadowPhase="drift";e.shadowT=0;e.afterimages=[];}
          e.shadowT+=dt;
          // Update afterimages (fade out)
          if(!e.afterimages)e.afterimages=[];
          for(let ai=e.afterimages.length-1;ai>=0;ai--){e.afterimages[ai].t-=dt;if(e.afterimages[ai].t<=0)e.afterimages.splice(ai,1);}
          if(e.shadowPhase==="drift"){
            // Slow menacing orbit — always keeping distance, circling
            const orbitA=e.mt/500;const keepDist=TL*3;
            const idealX=pcx+Math.cos(orbitA)*keepDist,idealY=pcy+Math.sin(orbitA)*keepDist;
            const tdx=idealX-ecx,tdy=idealY-ecy,td=Math.max(1,Math.hypot(tdx,tdy));
            moveX=tdx/td*es*0.8;moveY=tdy/td*es*0.8;
            // Shadow trail while drifting
            if(Math.random()<0.3)s.pt.push({x:ecx+(Math.random()-.5)*10,y:ecy+(Math.random()-.5)*10,dx:(Math.random()-.5)*0.5,dy:Math.random()*0.5,l:500,c:"rgba(80,40,140,0.5)"});
            // Summon shadow ghost every 3s (max 3)
            if(Math.floor(e.mt/3000)!==Math.floor((e.mt-dt)/3000)){
              const ghosts=s.en.filter(e2=>e2.type==="ghost"&&e2.summoned);
              if(ghosts.length<3){
                const sa=Math.random()*Math.PI*2,sr=TL*2;
                s.en.push({x:ecx+Math.cos(sa)*sr-ES/2,y:ecy+Math.sin(sa)*sr-ES/2,hp:2,mhp:2,type:"ghost",fl:0,mt:0,st:"chase",stT:0,hx:ecx,hy:ecy,spawnT:400,summoned:true});
                sfx("bomb");s.pt.push(...Array.from({length:8},()=>({x:ecx+Math.cos(sa)*sr,y:ecy+Math.sin(sa)*sr,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:400,c:"#80f"})));}}
            if(e.shadowT>3500){e.shadowPhase="blink";e.shadowT=0;}
          }else if(e.shadowPhase==="blink"){
            // Rapid blink-teleport behind player, leaving afterimages
            moveX=0;moveY=0;
            if(e.shadowT<100){
              // Save afterimage at current position
              e.afterimages.push({x:e.x,y:e.y,t:600});
              // Teleport behind player
              const behindA=ang+Math.PI;const behindD=TL*1.5;
              e.x=Math.max(TL,Math.min(W2-TL*2,pcx+Math.cos(behindA)*behindD-ES/2));
              e.y=Math.max(TL,Math.min(H2-TL*2,pcy+Math.sin(behindA)*behindD-ES/2));
              s.pt.push(...Array.from({length:10},()=>({x:e.x+ES/2,y:e.y+ES/2,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:300,c:"#a0f"})));sfx("door");}
            if(e.shadowT>400){e.shadowPhase="strike";e.shadowT=0;
              // Fire shadow bolt spread toward player from new position
              const sa=Math.atan2(pcy-(e.y+ES/2),pcx-(e.x+ES/2));
              for(let i=-1;i<=1;i++){s.bProj.push({x:e.x+ES/2,y:e.y+ES/2,dx:Math.cos(sa+i*0.25)*3,dy:Math.sin(sa+i*0.25)*3,type:"shadow",l:1200});}sfx("bomb");}
          }else if(e.shadowPhase==="strike"){
            // Quick lunge toward player after blink
            const bsp=es*3;moveX=Math.cos(ang)*bsp;moveY=Math.sin(ang)*bsp;
            s.pt.push({x:ecx+(Math.random()-.5)*8,y:ecy+(Math.random()-.5)*8,dx:-moveX*0.2,dy:-moveY*0.2,l:200,c:"#60a"});
            if(e.shadowT>800){e.shadowPhase="drift";e.shadowT=0;}}
        }
      }
      else if(e.type==="boss"){
        const ang2=Math.atan2(pcy-ecy,pcx-ecx);
        if(e.pattern==="charge"){const phase=Math.floor(e.mt/2500)%3;
          if(phase===2){// Moderate charge
            const bsp=es*2;moveX=Math.cos(ang2)*bsp;moveY=Math.sin(ang2)*bsp;}
          else if(phase===1){// Stop and unleash vine snare burst
            moveX=0;moveY=0;
            if(Math.floor(e.mt/2500)!==Math.floor((e.mt-dt)/2500)){
              for(let a=0;a<5;a++){const ra=a*Math.PI*2/5;s.bProj.push({x:ecx,y:ecy,dx:Math.cos(ra)*2,dy:Math.sin(ra)*2,type:"root",l:1200,snare:true});}
              sfx("bomb");}
            // Aimed vine snare at player every 1.5s
            if(Math.floor(e.mt/1500)!==Math.floor((e.mt-dt)/1500)){
              const pa2=Math.atan2(pcy-ecy,pcx-ecx);
              s.bProj.push({x:ecx,y:ecy,dx:Math.cos(pa2)*2.5,dy:Math.sin(pa2)*2.5,type:"root",l:1400,snare:true});}}
          else{const bsp=es*0.6;moveX=Math.cos(ang2)*bsp;moveY=Math.sin(ang2)*bsp;}
        }else if(e.pattern==="spawn"){const ca=e.mt/800;moveX=Math.cos(ca)*es*1.2;moveY=Math.sin(ca)*es*1.2;
          if(Math.floor(e.mt/3000)!==Math.floor((e.mt-dt)/3000)&&s.en.length<8){
            s.en.push({x:e.x,y:e.y,hp:2,mhp:2,type:"fire_bat",fl:0,mt:0,st:"chase",stT:0,hx:e.x,hy:e.y});}
          if(Math.floor(e.mt/1500)!==Math.floor((e.mt-dt)/1500)){
            const fa=Math.atan2(pcy-ecy,pcx-ecx);s.bProj.push({x:ecx,y:ecy,dx:Math.cos(fa)*3,dy:Math.sin(fa)*3,type:"fire",l:1200});sfx("bomb");}
        }else if(e.pattern==="teleport"){
          // Shadow Lord phases: 0=solid(hittable,3s), 1=shadow(invulnerable,2.5s), 2=teleport+burst(0.5s)
          const cycle=6000,ct=e.mt%cycle;
          if(ct<3000){// Phase 0: Solid — chase player, can be hit
            e.shadowForm=false;
            const bsp=es*(1.2+Math.sin(e.mt/400)*.4);moveX=Math.cos(ang2)*bsp;moveY=Math.sin(ang2)*bsp;
            // Shoot shadow bolts periodically
            if(Math.floor(e.mt/1800)!==Math.floor((e.mt-dt)/1800)){
              const sa=Math.atan2(pcy-ecy,pcx-ecx);s.bProj.push({x:ecx,y:ecy,dx:Math.cos(sa)*2,dy:Math.sin(sa)*2,type:"shadow",l:1500});}
          }else if(ct<5500){// Phase 1: Shadow form — invulnerable, fast, menacing
            e.shadowForm=true;
            const bsp=es*2.2;moveX=Math.cos(ang2)*bsp;moveY=Math.sin(ang2)*bsp;
            // Rapid shadow bolts in spiral
            if(Math.floor(e.mt/800)!==Math.floor((e.mt-dt)/800)){
              for(let a=0;a<4;a++){const sa=e.mt/300+a*Math.PI/2;
                s.bProj.push({x:ecx,y:ecy,dx:Math.cos(sa)*2.2,dy:Math.sin(sa)*2.2,type:"shadow",l:1200});}
              sfx("bomb");}
            // Shadow trail particles
            s.pt.push({x:ecx+(Math.random()-.5)*10,y:ecy+(Math.random()-.5)*10,dx:(Math.random()-.5)*1.5,dy:(Math.random()-.5)*1.5,l:400,c:"rgba(100,60,180,0.7)"});
          }else{// Phase 2: Teleport + burst
            e.shadowForm=false;
            moveX=0;moveY=0;
            if(Math.floor(ct/500)!==Math.floor((ct-dt)/500)){
              e.x=TL*3+Math.random()*(W2-TL*6);e.y=TL*3+Math.random()*(H2-TL*6);
              for(let a=0;a<8;a++){const sa=a*Math.PI/4;s.bProj.push({x:e.x+ES/2,y:e.y+ES/2,dx:Math.cos(sa)*2.5,dy:Math.sin(sa)*2.5,type:"shadow",l:1000});}
              s.pt.push(...Array.from({length:10},()=>({x:e.x+ES/2,y:e.y+ES/2,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:500,c:"#a0a0ff"})));sfx("bomb");}
          }
        }else if(e.pattern==="all"){
          // Dark King — Ganon-like: teleport, spear throw, fast dash, sword block
          if(!e.phase)e.phase="stalk";if(!e.phaseT)e.phaseT=0;e.phaseT+=dt;
          if(!e.blocking)e.blocking=0;if(e.blocking>0)e.blocking-=dt;
          if(!e.hitCount)e.hitCount=0;
          // Force vanish after 2 hits
          if(e.hitCount>=2&&e.phase!=="vanish"){e.phase="vanish";e.phaseT=0;e.hitCount=0;e.shadowForm=true;
            s.pt.push(...Array.from({length:15},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:600,c:"#606"})));sfx("bomb");}
          // Phase machine
          // Gets more aggressive below half HP
          const enraged=e.hp<e.mhp*0.5;
          if(e.phase==="stalk"){
            // Circle player menacingly
            const ca=e.mt/600;
            moveX=Math.cos(ca)*es*(enraged?1.2:0.8);moveY=Math.sin(ca)*es*(enraged?1.2:0.8);
            // Throw spears at player — faster when enraged
            const spearRate=enraged?1000:1500;
            if(Math.floor(e.mt/spearRate)!==Math.floor((e.mt-dt)/spearRate)){
              const sa=Math.atan2(pcy-ecy,pcx-ecx);
              s.bProj.push({x:ecx,y:ecy,dx:Math.cos(sa)*4.5,dy:Math.sin(sa)*4.5,type:"shadow",l:1200});
              // Enraged: throw a spread of 3
              if(enraged){for(let i=-1;i<=1;i+=2)s.bProj.push({x:ecx,y:ecy,dx:Math.cos(sa+i*0.25)*4,dy:Math.sin(sa+i*0.25)*4,type:"shadow",l:1000});}
              sfx("sword");}
            // Transition to vanish after 3s (was 4s)
            if(e.phaseT>(enraged?2000:3000)){e.phase="vanish";e.phaseT=0;e.shadowForm=true;
              s.pt.push(...Array.from({length:15},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:600,c:"#606"})));sfx("bomb");}
          }else if(e.phase==="vanish"){
            // Invisible — teleport to random spots, throw spears from darkness
            moveX=0;moveY=0;e.shadowForm=true;
            // Shadow trail
            s.pt.push({x:ecx+(Math.random()-.5)*20,y:ecy+(Math.random()-.5)*20,dx:(Math.random()-.5)*1,dy:(Math.random()-.5)*1,l:300,c:"rgba(100,0,150,0.5)"});
            // Teleport faster when enraged
            const tpRate=enraged?500:800;
            if(Math.floor(e.phaseT/tpRate)!==Math.floor((e.phaseT-dt)/tpRate)){
              e.x=TL*2+Math.random()*(W2-TL*5);e.y=TL*2+Math.random()*(H2-TL*5);
              s.pt.push(...Array.from({length:8},()=>({x:e.x+ES/2,y:e.y+ES/2,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:400,c:"#a0a"})));}
            // Triple spear from darkness
            const darkSpearRate=enraged?800:1200;
            if(Math.floor(e.phaseT/darkSpearRate)!==Math.floor((e.phaseT-dt)/darkSpearRate)){
              const sa=Math.atan2(pcy-(e.y+ES/2),pcx-(e.x+ES/2));
              for(let i=-1;i<=1;i++){s.bProj.push({x:e.x+ES/2,y:e.y+ES/2,dx:Math.cos(sa+i*0.2)*3.5,dy:Math.sin(sa+i*0.2)*3.5,type:"shadow",l:1500});}sfx("sword");}
            // Reappear after 3.5s
            if(e.phaseT>3500){e.phase="dash";e.phaseT=0;e.shadowForm=false;e.hitCount=0;
              // Reappear with 12-bolt burst
              for(let a=0;a<12;a++){const ra=a*Math.PI/6;s.bProj.push({x:ecx,y:ecy,dx:Math.cos(ra)*2.8,dy:Math.sin(ra)*2.8,type:"shadow",l:900});}
              s.pt.push(...Array.from({length:12},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*6,dy:(Math.random()-.5)*6,l:500,c:"#f0f"})));sfx("bomb");}
          }else if(e.phase==="dash"){
            // Fast aggressive charge at player
            const bsp=es*(enraged?4.5:3.5);moveX=Math.cos(ang2)*bsp;moveY=Math.sin(ang2)*bsp;
            // Block incoming sword strikes during dash
            e.blocking=200;
            // Trail particles
            s.pt.push({x:ecx+(Math.random()-.5)*6,y:ecy+(Math.random()-.5)*6,dx:-moveX*0.3,dy:-moveY*0.3,l:200,c:"#f0f"});
            // Spear thrust when close — wider spread when enraged
            if(dist<70&&Math.floor(e.phaseT/500)!==Math.floor((e.phaseT-dt)/500)){
              const sa=Math.atan2(pcy-ecy,pcx-ecx);const sp=enraged?5:3;
              for(let i=-(sp>>1);i<=(sp>>1);i++){s.bProj.push({x:ecx,y:ecy,dx:Math.cos(sa+i*0.2)*5,dy:Math.sin(sa+i*0.2)*5,type:"shadow",l:700});}sfx("bomb");}
            // Back to stalk after 2s (was 2.5s)
            if(e.phaseT>2000){e.phase="stalk";e.phaseT=0;e.blocking=0;}
          }
          // Spawn ghost minions more often — every 3.5s (was 5s)
          if(Math.floor(e.mt/3500)!==Math.floor((e.mt-dt)/3500)&&s.en.length<(enraged?6:4)){
            s.en.push({x:TL*2+Math.random()*(W2-TL*4),y:TL*2+Math.random()*(H2-TL*4),hp:3,mhp:3,type:"ghost",fl:0,mt:0,st:"chase",stT:0,hx:e.x,hy:e.y});}
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
      }else if(e.type==="vine_creeper"){
        // Slow chase, shoots vine tendril arcs periodically
        moveX=Math.cos(ang)*es;moveY=Math.sin(ang)*es;
        if(!e.vineT)e.vineT=0;e.vineT+=dt;
        if(e.vineT>2500&&dist<TL*5){e.vineT=0;sfx("sword");
          // Shoot 3 vine projectiles in a spread arc
          for(let v=-1;v<=1;v++){const va=ang+v*0.4;
            s.bProj.push({x:ecx,y:ecy,dx:Math.cos(va)*2,dy:Math.sin(va)*2,type:"root",l:800});}}
      }else if(e.type==="stalfos"){
        // Tough skeleton -- jumps back when hit, counterattacks
        if(e.fl>200){// Just got hit -- jump back
          const ka=Math.atan2(ecy-pcy,ecx-pcx);moveX=Math.cos(ka)*3;moveY=Math.sin(ka)*3;
        }else{// Normal chase with occasional lunge
          const phase=Math.floor(e.mt/2000)%3;
          if(phase===2){moveX=Math.cos(ang)*es*2.5;moveY=Math.sin(ang)*es*2.5;}
          else{moveX=Math.cos(ang)*es*0.6;moveY=Math.sin(ang)*es*0.6;}}
      }else if(e.type==="wallmaster"){
        // Drops from ceiling -- shadow warning, then grab
        if(!e.wmState)e.wmState="lurk";
        if(e.wmState==="lurk"){moveX=0;moveY=0;e.wmT=(e.wmT||0)+dt;
          // Teleport near player every 4s
          if(e.wmT>4000){e.wmState="shadow";e.wmT=0;e.wmTx=pcx;e.wmTy=pcy;e.x=pcx-ES/2;e.y=-30;}
        }else if(e.wmState==="shadow"){e.wmT+=dt;moveX=0;moveY=0;
          if(e.wmT>1200){e.wmState="drop";e.wmT=0;e.y=e.wmTy-ES/2;}
        }else if(e.wmState==="drop"){e.wmT+=dt;moveX=0;moveY=0;
          // Check if grabbed player
          if(Math.hypot(pcx-ecx,pcy-ecy)<20&&p.ifr<=0){
            if(!p.redArmor||Math.random()>0.5)p.hp--;p.ifr=IFR;sfx("hurt");s.shake.t=500;
            s.msg={text:"Wallmaster! Dragged to entrance!",t:2000};
            // Fade to entrance (deferred to avoid mid-loop le() crash)
            const di3=s.loc.di;
            s.fade={a:true,alpha:0,dir:1,t:0,spd:400,cb:()=>{
              const dg3=s.dg[di3];if(dg3){for(const rk3 of Object.keys(dg3.rooms)){
                if(dg3.rooms[rk3].tiles?.some(r=>r.includes(T.STAIRS_UP))){s.loc.scr=rk3;s.p.x=7*TL;s.p.y=9*TL;le(s);break;}}}}};
          }
          if(e.wmT>2000){e.wmState="lurk";e.wmT=0;e.x=e.hx;e.y=e.hy;}
        }
      }else if(e.type==="magma_slug"){
        // Slow chase, leaves burning trail
        moveX=Math.cos(ang)*es;moveY=Math.sin(ang)*es;
        if(!e.trailT)e.trailT=0;e.trailT+=dt;
        if(e.trailT>400){e.trailT=0;
          if(!s.fireTrails)s.fireTrails=[];
          s.fireTrails.push({x:ecx,y:ecy,t:3000});}
      }else if(e.type==="miniboss"){
        // Mini-boss non-chase: gentle idle movement
        const mn=e.name||"";
        if(mn==="Vine Guardian"){moveX=Math.sin(e.mt/600)*0.15;moveY=Math.cos(e.mt/800)*0.1;}
        else if(mn==="Flame Sentinel"){moveX=Math.cos(ang)*es*0.2;moveY=Math.sin(ang)*es*0.2;}
        else{const ca=e.mt/600;moveX=Math.cos(ca)*es*0.5;moveY=Math.sin(ca)*es*0.5;}
      }else{moveX=Math.cos(ang)*es;moveY=Math.sin(ang)*es;}
    }else if(e.st==="patrol"){const ang=Math.sin(e.mt/1200)*Math.PI*2;moveX=Math.cos(ang)*es*.4;moveY=Math.sin(ang)*es*.4;}
    else if(e.st==="retreat"){const ang=Math.atan2(e.hy-ecy,e.hx-ecx);moveX=Math.cos(ang)*es*.6;moveY=Math.sin(ang)*es*.6;}
    const nx=e.x+moveX*(dt/16),ny=e.y+moveY*(dt/16);
    const em=4;
    const flies=e.type==="ghost"||e.type==="bat"||e.type==="fire_bat"||e.type==="shimmer_ghoul";
    if(flies){e.x=nx;e.y=ny;}else{
    const eCanX=!eSolid(s,Math.floor((nx+em)/TL),Math.floor((e.y+em)/TL))&&!eSolid(s,Math.floor((nx+ES-em)/TL),Math.floor((e.y+em)/TL))&&!eSolid(s,Math.floor((nx+em)/TL),Math.floor((e.y+ES-em)/TL))&&!eSolid(s,Math.floor((nx+ES-em)/TL),Math.floor((e.y+ES-em)/TL));
    const eCanY=!eSolid(s,Math.floor((e.x+em)/TL),Math.floor((ny+em)/TL))&&!eSolid(s,Math.floor((e.x+ES-em)/TL),Math.floor((ny+em)/TL))&&!eSolid(s,Math.floor((e.x+em)/TL),Math.floor((ny+ES-em)/TL))&&!eSolid(s,Math.floor((e.x+ES-em)/TL),Math.floor((ny+ES-em)/TL));
    if(eCanX)e.x=nx;if(eCanY)e.y=ny;}
    e.x=Math.max(TL,Math.min(W2-TL-ES,e.x));e.y=Math.max(TL,Math.min(H2-TL-ES,e.y));
    if(s.sw.a){const sOff=SR*0.7,sR2=SR*0.85;let sx2=p.x+PS/2,sy2=p.y+PS/2;if(p.dir===0)sy2-=sOff;if(p.dir===2)sy2+=sOff;if(p.dir===3)sx2-=sOff;if(p.dir===1)sx2+=sOff;
      const sDist=Math.hypot(sx2-ecx,sy2-ecy);
      if(sDist<sR2+ES*0.4&&e.fl<=0){
        // Shadow form / burrowed — invulnerable, attacks pass through
        if(e.shadowForm||e.burrowed){e.fl=200;
          s.pt.push(...Array.from({length:3},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:200,c:e.burrowed?"#654":"#606"})));
          s.dmgNums.push({x:ecx,y:ecy-8,t:600,val:e.burrowed?"BURROWED!":"SHADOW!",c:e.burrowed?"#8a6":"#a060ff"});
          continue;}
        // Dark King blocks sword during dash
        if(e.type==="boss"&&e.blocking>0){e.fl=200;sfx("door");
          s.pt.push(...Array.from({length:4},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:250,c:"#f0f"})));
          s.dmgNums.push({x:ecx,y:ecy-8,t:700,val:"BLOCKED!",c:"#f0f"});continue;}
        if(e.type==="knight"&&e.shieldDir!==undefined){
          const atkAng=Math.atan2(ecy-pcy,ecx-pcx);
          const shieldDiff=Math.abs(((atkAng-e.shieldDir+Math.PI*3)%(Math.PI*2))-Math.PI);
          if(shieldDiff>Math.PI*0.6){e.fl=200;sfx("door");
            s.pt.push(...Array.from({length:3},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:200,c:"#aaf"})));
            s.dmgNums.push({x:ecx,y:ecy-8,t:600,val:"BLOCK",c:"#88f"});
            continue;}}
        // Yetis take reduced sword damage (half)
        if(e.type==="yeti"){const ydmg=p.hasMasterSword?1:1;e.hp-=ydmg;e.fl=300;sfx("hit");
          const kb2=12,kba2=Math.atan2(ecy-pcy,ecx-pcx);e.x+=Math.cos(kba2)*kb2;e.y+=Math.sin(kba2)*kb2;
          s.dmgNums.push({x:ecx,y:ecy-8,t:600,val:ydmg,c:"#8cf"});
          s.pt.push(...Array.from({length:3},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:200,c:"#8cf"})));
          continue;}
        const sdmg=p.hasMasterSword?2:1;e.hp-=sdmg;e.fl=300;const kb=isBossLike?10:18,kba=Math.atan2(ecy-pcy,ecx-pcx);e.x+=Math.cos(kba)*kb;e.y+=Math.sin(kba)*kb;
        if(e.type==="boss"&&e.pattern==="all"&&e.hitCount!==undefined)e.hitCount++;
        sfx("hit",e.type==="boss"?"E2":"C3");
        s.dmgNums.push({x:ecx,y:ecy-8,t:600,val:sdmg,c:p.hasMasterSword?"#8af":e.type==="boss"?"#ff4":"#fff"});
        s.pt.push(...Array.from({length:p.hasMasterSword?8:5},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:300,c:p.hasMasterSword?"#8af":"#fff"})));}}
    if(e.hp<=0){
      // Stalfos reforms once before dying
      if(e.type==="stalfos"&&!e.reformed){e.hp=e.mhp;e.reformed=true;e.fl=500;
        s.pt.push(...Array.from({length:8},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:400,c:"#aaa"})));
        s.dmgNums.push({x:ecx,y:ecy-12,t:800,val:"REFORM!",c:"#fa0"});sfx("door");continue;}
      s.en.splice(i,1);
      s.pt.push(...Array.from({length:12},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:500,c:e.type==="boss"?"#fd3":"#f88"})));
      if(e.type==="boss"){sfx("bossdeath");s.shake.t=600;s.freeze=400;s.bossFight=false;
        s.drops.push({x:ecx,y:ecy-8,vy:-4,ground:ecy,type:"heart",t:0},{x:ecx-10,y:ecy-8,vy:-3.5,ground:ecy,type:"heart",t:0},{x:ecx+10,y:ecy-8,vy:-3.5,ground:ecy,type:"bomb",t:0});
        const bossId=`${s.loc.di}:${e.name}`;
        if(s.loc.di<3&&!s.heartContainers.includes(bossId)){
          s.drops.push({x:W2/2,y:-20,vy:0.4,ground:H2/2,type:"heartcontainer",t:0,spin:0,bossId});}
        if(s.loc.di>=0&&s.loc.di<3&&!p.tri[s.loc.di]){
          s.drops.push({x:ecx,y:-20,vy:0.35,ground:ecy-8,type:"triforce",t:0,spin:0});
          s.triMu=true;}
        if(s.loc.di===3){s.triMu=true;s.finalDeath={t:0,dur:7000,bx:ecx,by:ecy,flash:0,fallY:0,fadeAlpha:0,heroRaise:0};s.msg={text:"",t:0};}
        // Track boss victory — auto-warp after triforce + heart container collected
        if(s.loc.di<3){s.bossVictory={di:s.loc.di};}
      }else if(e.type==="miniboss"){sfx("bossdeath");s.shake.t=400;s.freeze=300;s.bossFight=false;
        s.drops.push({x:ecx,y:ecy-8,vy:-4,ground:ecy,type:"heart",t:0},{x:ecx-10,y:ecy-8,vy:-3.5,ground:ecy,type:"heart",t:0});
        s.msg={text:`${e.name||"Mini-Boss"} defeated!`,t:2000};
      }else{sfx("kill");
        // Skeletons drop a bone (if player doesn't have one yet)
        if((e.type==="skeleton"||e.type==="stalfos"||e.type==="knight")&&!p.hasBone&&!s.dogDug&&p.tri.some(Boolean)&&Math.random()<0.3){
          s.drops.push({x:ecx,y:ecy-4,vy:-3,ground:ecy,type:"bone",t:0});}
        else{const dr2=Math.random();
        if(dr2<0.40){const dt2=Math.random();
          s.drops.push({x:ecx,y:ecy-4,vy:-3,ground:ecy,type:dt2<0.45?"heart":dt2<0.65?"bomb":dt2<0.85?"rupee_green":"rupee_blue",t:0});}}}
      if(e.type==="boss")s.msg={text:`${e.name||"Boss"} defeated!`,t:2000};
      if(s.en.length===0){s.cl.add(rk);s.roomFlash=500;
        // Track respawn timer for overworld screens (60s)
        if(s.loc.ty==="ow"){if(!s.respawnTimers)s.respawnTimers={};s.respawnTimers[rk]=60000;}
        if(s.combatLock){s.combatLock=false;sfx("triforce");s.shake.t=300;}else{sfx("pickup");}
        // Spawn reward chest -- room reward property or detect key/heart_piece tiles
        const rm2=gm(s);const roomData=s.loc.ty==="dg"?s.dg[s.loc.di].rooms[s.loc.scr]:null;
        const specialItem=roomData?.reward||null;
        const hasTreasure=specialItem||rm2&&rm2.some(row=>row.some(tl=>tl===T.KEY||tl===T.HEART_PIECE));
        if(hasTreasure){const chx=W2/2-12,chy=H2/2-12;
          const reward=specialItem||(Math.random()<0.5?"heart":"rupee_blue");
          s.chest={x:chx,y:chy,state:"closed",t:0,reward};}}
      continue;}
    if(p.ifr<=0&&dist<(PS+ES)*0.38){if(!p.redArmor||Math.random()>0.5)p.hp--;p.ifr=IFR;sfx("hurt");s.shake.t=300;
      const hkb=8,hka=Math.atan2(pcy-ecy,pcx-ecx);if(tm(p.x+Math.cos(hka)*hkb,p.y+Math.sin(hka)*hkb)){p.x+=Math.cos(hka)*hkb;p.y+=Math.sin(hka)*hkb;}
      if(e.type==="fire_bat"){p.burn=3000;p.burnTick=0;s.msg={text:"Burning!",t:1000};}
      if(e.type==="ghost"||e.type==="shimmer_ghoul"){p.freeze=e.type==="shimmer_ghoul"?3000:2500;s.msg={text:"Frozen!",t:1000};}
      if(e.type==="blob"){p.poison=3000;p.poisonTick=0;s.msg={text:"Poisoned!",t:1000};}
      s.pt.push(...Array.from({length:4},()=>({x:pcx,y:pcy,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:300,c:e.type==="fire_bat"?"#f80":e.type==="ghost"||e.type==="shimmer_ghoul"?"#c8f":e.type==="blob"?"#6a4":"#f44"})));
      if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}}
  for(let i=s.bProj.length-1;i>=0;i--){const bp=s.bProj[i];bp.x+=bp.dx*(dt/16);bp.y+=bp.dy*(dt/16);bp.l-=dt;
    if(bp.l<=0||bp.x<0||bp.x>W2||bp.y<0||bp.y>H2){
      // Exploding fireballs burst into ring of fire on expiry
      if(bp.explode&&bp.l<=0){sfx("bomb");s.shake.t=200;
        for(let a=0;a<6;a++){const ra=a*Math.PI/3;s.bProj.push({x:bp.x,y:bp.y,dx:Math.cos(ra)*2,dy:Math.sin(ra)*2,type:"fire",l:600});}
        s.pt.push(...Array.from({length:10},()=>({x:bp.x,y:bp.y,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:400,c:Math.random()>.5?"#f80":"#fa0"})));}
      s.bProj.splice(i,1);continue;}
    if(s.p.shield&&Math.hypot(p.x+PS/2-bp.x,p.y+PS/2-bp.y)<22){
      // Block if projectile is coming from the direction player faces
      const ba=Math.atan2(bp.y-(p.y+PS/2),bp.x-(p.x+PS/2));
      const pf=p.dir===0?-Math.PI/2:p.dir===2?Math.PI/2:p.dir===3?Math.PI:0;
      const diff=Math.abs(((ba-pf+Math.PI*3)%(Math.PI*2))-Math.PI);
      if(diff<Math.PI*(s.hasShieldUp?0.85:0.6)){
        if(s.hasShieldUp){// Mirror Shield — reflect projectile back
          bp.dx=-bp.dx;bp.dy=-bp.dy;bp.reflected=true;bp.l=Math.min(bp.l,1200);
          sfx("reflect");
          s.pt.push(...Array.from({length:8},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:400,c:Math.random()>.5?"#8af":"#fff"})));
          s.dmgNums.push({x:p.x+PS/2,y:p.y,t:500,val:"REFLECT",c:"#8cf"});
        }else{sfx("door");s.bProj.splice(i,1);
          s.pt.push(...Array.from({length:6},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:300,c:"#88f"})));
          s.dmgNums.push({x:p.x+PS/2,y:p.y,t:500,val:"BLOCK",c:"#8af"});}
        continue;}}
    // Reflected projectiles damage enemies
    if(bp.reflected){let hitEnemy=false;
      for(const e of s.en){const ed=Math.hypot(e.x+ES/2-bp.x,e.y+ES/2-bp.y);
        if(ed<ES*0.5){e.hp-=2;e.fl=300;sfx("hit");
          s.dmgNums.push({x:e.x+ES/2,y:e.y,t:600,val:2,c:"#8cf"});
          s.pt.push(...Array.from({length:4},()=>({x:bp.x,y:bp.y,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:300,c:"#8af"})));
          hitEnemy=true;break;}}
      if(hitEnemy){s.bProj.splice(i,1);continue;}}
    if(p.ifr<=0&&!bp.reflected&&Math.hypot(p.x+PS/2-bp.x,p.y+PS/2-bp.y)<14){
      if(!p.redArmor||Math.random()>0.5)p.hp--;p.ifr=IFR;sfx("hurt");s.shake.t=300;s.bProj.splice(i,1);
      const hka=Math.atan2(p.y+PS/2-bp.y,p.x+PS/2-bp.x);if(tm(p.x+Math.cos(hka)*6,p.y+Math.sin(hka)*6)){p.x+=Math.cos(hka)*6;p.y+=Math.sin(hka)*6;}
      if(bp.type==="fire"){p.burn=3000;p.burnTick=0;
        // Exploding fireballs also burst on hit
        if(bp.explode){sfx("bomb");s.shake.t=200;
          for(let a=0;a<6;a++){const ra=a*Math.PI/3;s.bProj.push({x:bp.x,y:bp.y,dx:Math.cos(ra)*2,dy:Math.sin(ra)*2,type:"fire",l:600});}
          s.pt.push(...Array.from({length:10},()=>({x:bp.x,y:bp.y,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:400,c:Math.random()>.5?"#f80":"#fa0"})));}}
      if(bp.type==="shadow"){p.freeze=2000;}
      if(bp.type==="root"){if(bp.snare){p.snare=1800;s.msg={text:"Ensnared by vines!",t:1000};
        s.pt.push(...Array.from({length:6},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*2,dy:(Math.random()-.5)*2,l:500,c:"#4a2"})));}
        else{p.poison=4000;p.poisonTick=0;}}
      s.pt.push(...Array.from({length:4},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:300,c:bp.type==="fire"?"#f80":bp.type==="root"?"#4a2":"#80f"})));
      if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}}
  for(let i=s.pArrows.length-1;i>=0;i--){const pa=s.pArrows[i];pa.x+=pa.dx*(dt/16);pa.y+=pa.dy*(dt/16);pa.l-=dt;
    if(pa.l<=0||pa.x<0||pa.x>W2||pa.y<0||pa.y>H2){s.pArrows.splice(i,1);continue;}
    for(let j=s.en.length-1;j>=0;j--){const e=s.en[j];
      if(Math.hypot(pa.x-(e.x+ES/2),pa.y-(e.y+ES/2))<ES*0.5){
        // Arrows pass through shadow form / burrowed
        if(e.shadowForm||e.burrowed){s.pt.push({x:pa.x,y:pa.y,dx:0,dy:-1,l:200,c:e.burrowed?"#654":"#606"});continue;}
        if(e.type==="knight"&&e.shieldDir!==undefined){
          const atkAng=Math.atan2(pa.dy,pa.dx);
          const shieldDiff=Math.abs(((atkAng-e.shieldDir+Math.PI*3)%(Math.PI*2))-Math.PI);
          if(shieldDiff<Math.PI*0.6){e.fl=200;sfx("door");s.pArrows.splice(i,1);
            s.pt.push(...Array.from({length:3},()=>({x:e.x+ES/2,y:e.y+ES/2,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:200,c:"#aaf"})));break;}}
        e.hp-=2;e.fl=300;sfx("hit");
        if(e.type==="boss"&&e.pattern==="all"&&e.hitCount!==undefined)e.hitCount++;
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
    const bottomG=c.createLinearGradient(0,H*0.78,0,H);bottomG.addColorStop(0,"rgba(0,0,0,0)");bottomG.addColorStop(1,"rgba(0,0,0,0.6)");
    c.fillStyle=bottomG;c.fillRect(0,H*0.78,W,H*0.22);
    if(Math.sin(t/500)>0){c.fillStyle="#fff";c.font="bold 14px monospace";c.fillText("PRESS SPACE OR CLICK",W/2,H*0.84);}
    c.fillStyle="rgba(255,255,255,0.25)";c.font="8px monospace";
    c.fillText("WASD move \u00b7 Space atk \u00b7 B bomb \u00b7 X shield",W/2,H*0.91);
    c.fillText("C bow \u00b7 I/Tab map \u00b7 Esc pause",W/2,H*0.95);
    c.textAlign="left";c.lineCap="butt";return;}
  // ===== SAVE SELECT SCREEN =====
  if(s.saveSelect){
    const W=W2,H=H2+HH;
    c.fillStyle="#0a0a14";c.fillRect(0,0,W,H);
    // Decorative border
    c.strokeStyle="rgba(253,211,51,0.15)";c.lineWidth=2;c.strokeRect(6,6,W-12,H-12);
    c.textAlign="center";
    // Title
    c.fillStyle="#ffd633";c.font="bold 20px monospace";c.fillText("SELECT FILE",W/2,34);
    c.strokeStyle="rgba(253,211,51,0.2)";c.lineWidth=1;
    c.beginPath();c.moveTo(W/2-60,40);c.lineTo(W/2+60,40);c.stroke();
    // Layout: 3 slots evenly in middle, back + instructions at bottom
    const slotH=80,slotGap=10,slotsTop=54;
    const bx=24,bw=W-48;
    for(let i=0;i<3;i++){
      const save=loadSlot(i);
      const by=slotsTop+i*(slotH+slotGap);
      const sel=s.saveSelIdx===i;
      // Slot background with rounded corners
      const r=6;
      c.fillStyle=sel?"rgba(253,211,51,0.10)":"rgba(255,255,255,0.025)";
      c.strokeStyle=sel?"rgba(253,211,51,0.5)":"rgba(255,255,255,0.08)";
      c.lineWidth=sel?2:1;
      c.beginPath();c.moveTo(bx+r,by);c.lineTo(bx+bw-r,by);c.quadraticCurveTo(bx+bw,by,bx+bw,by+r);
      c.lineTo(bx+bw,by+slotH-r);c.quadraticCurveTo(bx+bw,by+slotH,bx+bw-r,by+slotH);
      c.lineTo(bx+r,by+slotH);c.quadraticCurveTo(bx,by+slotH,bx,by+slotH-r);
      c.lineTo(bx,by+r);c.quadraticCurveTo(bx,by,bx+r,by);c.fill();c.stroke();
      // Selection cursor — pulsing arrow
      if(sel){const ca=Math.sin(t/200)*0.3+0.7;
        c.fillStyle=`rgba(253,211,51,${ca})`;
        const ax=bx+10,ay=by+slotH/2;
        c.beginPath();c.moveTo(ax,ay-6);c.lineTo(ax+8,ay);c.lineTo(ax,ay+6);c.closePath();c.fill();}
      // Left side: file label + location
      c.textAlign="left";
      c.font="bold 13px monospace";c.fillStyle=sel?"#ffd633":"#777";
      c.fillText("FILE "+(i+1),bx+24,by+28);
      if(save&&save.v===1){
        const locName=save.loc.ty==="ow"?"Overworld":save.loc.ty==="dg"?"Dungeon":"Cave";
        c.fillStyle=sel?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.25)";c.font="bold 12px monospace";
        c.fillText(locName,bx+24,by+46);
        // --- Center: hearts and triforce, vertically centered ---
        const mhp=save.p.mhp||8,hp=save.p.hp||0,hc=mhp/2;
        const tri=save.p.tri||[false,false,false];
        const hsz=14,tsz=16;
        const hGap=hsz+3,tGap=tsz+6,divGap=14;
        const totalW=hc*hGap+divGap+3*tGap;
        const rowX=bx+120+(bw-120-totalW)/2;
        const rowY=by+(slotH-hsz)/2;
        // Hearts
        for(let h=0;h<hc;h++){
          c.fillStyle=hp>=(h+1)*2?"#ee3333":hp>=h*2+1?"#993333":"#333";
          dH(c,rowX+h*hGap,rowY,hsz);}
        // Divider
        const divX=rowX+hc*hGap+divGap/2;
        c.strokeStyle=sel?"rgba(253,211,51,0.2)":"rgba(255,255,255,0.08)";
        c.lineWidth=1;c.beginPath();c.moveTo(divX,rowY-1);c.lineTo(divX,rowY+hsz+1);c.stroke();
        // Triforce
        const triX=rowX+hc*hGap+divGap;
        for(let ti=0;ti<3;ti++){const tx=triX+ti*tGap,ty=rowY-1;
          c.fillStyle=tri[ti]?"#ffd633":"#333";
          c.beginPath();c.moveTo(tx+tsz/2,ty);c.lineTo(tx+tsz,ty+tsz-2);c.lineTo(tx,ty+tsz-2);c.closePath();c.fill();
          if(tri[ti]){const is2=tsz*0.35;c.fillStyle="#ffe866";
            c.beginPath();c.moveTo(tx+tsz/2,ty+4);c.lineTo(tx+tsz/2+is2,ty+tsz-5);c.lineTo(tx+tsz/2-is2,ty+tsz-5);c.closePath();c.fill();}}
        // Master sword on far right
        if(save.p.hasMasterSword){const sx=bx+bw-22,sy=by+slotH/2;
          // Blade
          c.strokeStyle=sel?"#c0d0ff":"#8090aa";c.lineWidth=2.5;c.lineCap="round";
          c.beginPath();c.moveTo(sx,sy+14);c.lineTo(sx,sy-14);c.stroke();
          // Blade shine
          c.strokeStyle=sel?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.3)";c.lineWidth=1;
          c.beginPath();c.moveTo(sx,sy+12);c.lineTo(sx,sy-12);c.stroke();
          // Crossguard
          c.strokeStyle=sel?"#d4b040":"#8a6a2a";c.lineWidth=2.5;
          c.beginPath();c.moveTo(sx-6,sy+6);c.lineTo(sx+6,sy+6);c.stroke();
          // Grip
          c.strokeStyle=sel?"#6a3a18":"#4a2a10";c.lineWidth=3;
          c.beginPath();c.moveTo(sx,sy+7);c.lineTo(sx,sy+14);c.stroke();
          // Pommel
          c.fillStyle=sel?"#ffd633":"#8a6a2a";c.beginPath();c.arc(sx,sy+15,2,0,Math.PI*2);c.fill();
          // Tip glow
          const gl=Math.sin(t/300)*0.3+0.5;
          c.fillStyle=`rgba(200,220,255,${gl})`;c.beginPath();c.arc(sx,sy-14,2,0,Math.PI*2);c.fill();
          c.lineCap="butt";}
      }else{
        c.fillStyle=sel?"rgba(255,255,255,0.4)":"rgba(255,255,255,0.15)";c.font="12px monospace";
        c.textAlign="center";c.fillText("- Empty -",bx+bw/2,by+slotH/2+5);c.textAlign="left";
      }
    }
    // Back option
    const backY=slotsTop+3*(slotH+slotGap)+8;
    const sel4=s.saveSelIdx===3;
    c.textAlign="center";c.fillStyle=sel4?"#ffd633":"#666";c.font="bold 12px monospace";
    c.fillText("BACK",W/2,backY);
    if(sel4){const ca=Math.sin(t/200)*0.3+0.7;
      c.fillStyle=`rgba(253,211,51,${ca})`;
      c.beginPath();c.moveTo(W/2-34,backY-6);c.lineTo(W/2-26,backY);c.lineTo(W/2-34,backY+6);c.closePath();c.fill();}
    // Instructions
    c.fillStyle="rgba(255,255,255,0.2)";c.font="8px monospace";c.textAlign="center";
    c.fillText("\u2191\u2193 select \u00b7 Enter confirm \u00b7 Delete erase \u00b7 Esc back",W/2,H-8);
    c.textAlign="left";return;}
  // ===== HUD =====
  const p=s.p;
  c.fillStyle="#111";c.fillRect(0,0,W2,HH);
  c.fillStyle="rgba(60,60,60,0.5)";c.fillRect(0,HH-1,W2,1);
  // LEFT: Hearts
  const hc=p.mhp/2,hsz=hc>6?10:14,hsp=hc>6?14:18;
  for(let i=0;i<hc;i++){const hx=6+i*hsp,hy=hc>6?11:9;
    if(p.hp>=(i+1)*2){c.fillStyle="#ee3333";dH(c,hx,hy,hsz);}
    else if(p.hp>=i*2+1){c.save();c.beginPath();c.rect(hx,hy,hsz/2,hsz);c.clip();c.fillStyle="#ee3333";dH(c,hx,hy,hsz);c.restore();c.save();c.beginPath();c.rect(hx+hsz/2,hy,hsz/2,hsz);c.clip();c.fillStyle="#444";dH(c,hx,hy,hsz);c.restore();}
    else{c.fillStyle="#444";dH(c,hx,hy,hsz);}}
  if(p.hp<=2&&p.hp>0&&Math.sin(s.lowHp/200)>0.3){c.fillStyle="rgba(255,50,50,0.15)";c.fillRect(0,0,W2,HH);}
  // CENTER: Triforce pieces + dungeon name
  const iD2=s.loc.ty==="dg"||s.loc.ty==="cave";
  c.textAlign="center";
  if(iD2){const dgn=s.loc.ty==="dg"?s.dg[s.loc.di].name:"Hidden Cave";c.fillStyle="#888";c.font="bold 9px monospace";c.fillText(dgn,W2/2,11);}
  for(let i=0;i<3;i++){const tx=W2/2-30+i*22,ty=iD2?16:8;
    c.fillStyle=p.tri[i]?"#ffd633":"#333";c.beginPath();c.moveTo(tx+8,ty);c.lineTo(tx+16,ty+14);c.lineTo(tx,ty+14);c.closePath();c.fill();
    if(p.tri[i]){c.fillStyle="#ffe866";c.beginPath();c.moveTo(tx+8,ty+4);c.lineTo(tx+12,ty+11);c.lineTo(tx+4,ty+11);c.closePath();c.fill();}}
  // Status effects -- below triforce if in dungeon
  if(p.burn>0||p.freeze>0||p.poison>0||p.snare>0){let stx=W2/2-50;c.font="bold 8px monospace";
    if(p.burn>0){c.fillStyle="#f80";c.fillText("BURN",stx,26);stx+=35;}
    if(p.freeze>0){c.fillStyle="#8cf";c.fillText("FREEZE",stx,26);stx+=45;}
    if(p.poison>0){c.fillStyle="#4a4";c.fillText("POISON",stx,26);stx+=45;}
    if(p.snare>0){c.fillStyle="#6a4";c.fillText("SNARED",stx,26);}}
  c.textAlign="left";
  // Day/Night indicator — small sun or moon on HUD
  if(!iD2){const nA=getNightAmount(s.weather.timer);
    const dix=W2/2+52,diy=iD2?20:16;
    if(nA>0.3){// Moon
      c.fillStyle=`rgba(180,200,240,${0.5+nA*0.3})`;c.beginPath();c.arc(dix,diy,5,0,Math.PI*2);c.fill();
      c.fillStyle="#111";c.beginPath();c.arc(dix+2,diy-1,4,0,Math.PI*2);c.fill();// crescent cut
      // Stars around moon
      for(let si2=0;si2<3;si2++){const sx2=dix+8+si2*4,sy2=diy-3+si2*2;
        c.fillStyle=`rgba(200,220,255,${0.4+Math.sin(t/300+si2)*0.2})`;c.fillRect(sx2,sy2,1.5,1.5);}
    }else{// Sun
      c.fillStyle="rgba(253,211,51,0.7)";c.beginPath();c.arc(dix,diy,4,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(253,211,51,0.2)";c.beginPath();c.arc(dix,diy,7,0,Math.PI*2);c.fill();
      // Rays
      for(let ri=0;ri<6;ri++){const ra=ri*Math.PI/3+t/2000;
        c.strokeStyle="rgba(253,211,51,0.4)";c.lineWidth=0.8;c.beginPath();
        c.moveTo(dix+Math.cos(ra)*5,diy+Math.sin(ra)*5);c.lineTo(dix+Math.cos(ra)*8,diy+Math.sin(ra)*8);c.stroke();}
    }}
  // RIGHT: Items — evenly spaced, vertically centered
  {const hudItems=[];const midY=HH/2;
  // Build items list right-to-left
  if(s.loc.ty==="dg"&&s.loc.di>=0){const mk=p.masterKey[s.loc.di];
    hudItems.push({type:"emoji",icon:mk?"\ud83d\udddd\ufe0f":"\ud83d\udd12",val:"",col:mk?"#c070ff":"#444"});}
  if(p.hasBombs)hudItems.push({type:"emoji",icon:"\ud83d\udca3",val:`${p.bombs}`,col:"#8af"});
  hudItems.push({type:"rupee",val:`${p.rupees}`,col:"#4f4"});
  hudItems.push({type:"emoji",icon:"\ud83d\udd11",val:`${p.keys}`,col:"#fd3"});
  // Layout: fixed slot width, right-aligned
  const slotW=50,startX=W2-hudItems.length*slotW;
  c.font="bold 11px monospace";c.textBaseline="middle";
  for(let hi=0;hi<hudItems.length;hi++){
    const it=hudItems[hi],cx=startX+hi*slotW+slotW/2;
    if(it.type==="rupee"){
      // Custom hex rupee icon
      const rx=cx-12,ry=midY;
      c.fillStyle="#4f4";c.beginPath();c.moveTo(rx,ry-5);c.lineTo(rx+3,ry-2);c.lineTo(rx+3,ry+2);c.lineTo(rx,ry+5);c.lineTo(rx-3,ry+2);c.lineTo(rx-3,ry-2);c.closePath();c.fill();
      c.fillStyle="#8f8";c.beginPath();c.moveTo(rx,ry-3);c.lineTo(rx+2,ry-1);c.lineTo(rx,ry);c.lineTo(rx-2,ry-1);c.closePath();c.fill();
      c.fillStyle=it.col;c.textAlign="left";c.fillText(it.val,cx-6,midY);
    }else{
      c.fillStyle=it.col;c.textAlign="center";c.fillText(it.icon,cx-10,midY);
      if(it.val){c.textAlign="left";c.fillText(it.val,cx,midY);}
    }
  }
  c.textBaseline="alphabetic";c.textAlign="left";}
  // ===== GAME AREA =====
  c.save();c.translate(0,HH);
  if(s.shake.t>0)c.translate(s.shake.x,s.shake.y);
  const m=gm(s),loc=s.loc,iD=loc.ty==="dg"||loc.ty==="cave",dg=loc.ty==="dg"?s.dg[loc.di]:(loc.ty==="cave"?(CAVES[loc.di]?.style||{color:"#1a2a18",wc:"#3a5a3a",fc:"#2a3a28",name:"Hidden Cave"}):null);
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
        if((tl2===T.KEY||tl2===T.MASTER_KEY||tl2===T.HEART||tl2===T.HEART_PIECE||tl2===T.TRIFORCE||tl2===T.BOMB||tl2===T.RUPEE||tl2===T.BOW||tl2===T.BOMB_BAG||tl2===T.MASTER_SWORD||tl2===T.JAR||tl2===T.COMPASS)&&s.pk.has(opk))tl2=iD?T.FLOOR:T.GRASS;
        if((tl2===T.DOOR||tl2===T.BOSS_DOOR)&&s.dr.has(opk))tl2=T.FLOOR;
        dT(c,tl2,x2*TL,y2*TL,iD,dg,t,null);}
      // Apply day/night tint and fog to old screen during slide
      if(!iD){const slNight=getNightAmount(s.weather.timer);
        if(slNight>0.05){c.fillStyle=`rgba(8,8,35,${slNight*0.55})`;c.fillRect(0,0,W2,H2);}
        // Fog on old screen (match current weather)
        const oldBiome=getBiome(sl.prevScr);const isShadowOld=oldBiome==="shadow_forest";
        const fogAOld=isShadowOld?0.95:s.weather.fog>0.02?Math.min(0.92,s.weather.fog*(1+slNight*0.5)):0;
        if(fogAOld>0.02){const fogColOld=isShadowOld?"15,8,30":"100,110,120";
          c.fillStyle="rgba("+fogColOld+","+fogAOld+")";c.fillRect(0,0,W2,H2);}}
      c.restore();}
    // Offset new screen
    c.translate((1-ease)*W2*sl.dx,(1-ease)*H2*sl.dy);}
  // ===== SIDE-SCROLL PASSAGE RENDERING =====
  if(loc.ty==="passage"&&s.ss){
    const psg=PASSAGES[s.ss.pi];const dg2=s.dg[psg?.di]||{color:"#1a2a18",wc:"#3a5a3a",fc:"#2a3a28"};
    // Background — cave stone
    c.fillStyle=dg2.color;c.fillRect(0,0,W2,H2);
    // Ceiling (row 0) and floor (rows 10-11)
    const wc=dg2.wc||"#3a3a3a";
    for(let x=0;x<CO;x++){
      // Ceiling
      c.fillStyle=wc;c.fillRect(x*TL,0,TL,TL);
      c.strokeStyle="rgba(0,0,0,0.3)";c.lineWidth=0.5;
      c.beginPath();c.moveTo(x*TL,TL*0.5);c.lineTo((x+1)*TL,TL*0.5);c.stroke();
      c.beginPath();c.moveTo(x*TL+16,0);c.lineTo(x*TL+16,TL*0.5);c.stroke();
      // Floor
      c.fillStyle=wc;c.fillRect(x*TL,10*TL,TL,2*TL);
      c.strokeStyle="rgba(0,0,0,0.3)";c.lineWidth=0.5;
      c.beginPath();c.moveTo(x*TL,10*TL+TL*0.5);c.lineTo((x+1)*TL,10*TL+TL*0.5);c.stroke();
      c.beginPath();c.moveTo(x*TL+16,10*TL);c.lineTo(x*TL+16,10*TL+TL*0.5);c.stroke();
    }
    // Left and right walls
    for(let y=1;y<10;y++){
      c.fillStyle=wc;c.fillRect(0,y*TL,TL,TL);c.fillRect(15*TL,y*TL,TL,TL);
      c.strokeStyle="rgba(0,0,0,0.2)";c.lineWidth=0.5;
      c.beginPath();c.moveTo(TL*0.5,y*TL);c.lineTo(TL*0.5,(y+1)*TL);c.stroke();
      c.beginPath();c.moveTo(15*TL+TL*0.5,y*TL);c.lineTo(15*TL+TL*0.5,(y+1)*TL);c.stroke();
    }
    // Exit doorways at top of ladders
    for(const[lx,ly]of psg.ladders){
      c.fillStyle="rgba(180,150,80,0.15)";c.fillRect(lx*TL-4,ly*TL-TL,TL+8,TL+4);
      c.strokeStyle="rgba(180,150,80,0.3)";c.lineWidth=1.5;
      c.beginPath();c.moveTo(lx*TL-2,(ly-1)*TL);c.lineTo(lx*TL-2,ly*TL+4);c.stroke();
      c.beginPath();c.moveTo(lx*TL+TL+2,(ly-1)*TL);c.lineTo(lx*TL+TL+2,ly*TL+4);c.stroke();
      c.beginPath();c.moveTo(lx*TL-2,(ly-1)*TL);c.lineTo(lx*TL+TL+2,(ly-1)*TL);c.stroke();
      // Stair steps inside doorway
      for(let i=0;i<3;i++){c.fillStyle=`rgba(180,160,100,${0.1+i*0.04})`;c.fillRect(lx*TL+2,(ly-1)*TL+4+i*6,TL-4,4);}
      // "EXIT" label
      c.fillStyle="rgba(180,160,80,0.4)";c.font="bold 7px monospace";c.textAlign="center";
      c.fillText("\u25b2",lx*TL+TL/2,(ly-1)*TL+TL-4);c.textAlign="left";
    }
    // Platforms — stone slabs
    for(const[px2,py2,pw]of psg.platforms){
      const plx=px2*TL,ply=py2*TL,plw=pw*TL;
      // Platform body
      const pg=c.createLinearGradient(plx,ply,plx,ply+8);
      pg.addColorStop(0,wc);pg.addColorStop(0.4,dg2.fc||"#2a3a28");pg.addColorStop(1,"rgba(0,0,0,0.3)");
      c.fillStyle=pg;c.fillRect(plx,ply,plw,8);
      // Top highlight
      c.fillStyle="rgba(255,255,220,0.06)";c.fillRect(plx,ply,plw,1);
      // Bottom shadow
      c.fillStyle="rgba(0,0,0,0.15)";c.fillRect(plx+2,ply+8,plw-4,3);
      // Stone block lines
      c.strokeStyle="rgba(0,0,0,0.2)";c.lineWidth=0.5;
      for(let bx=plx+TL;bx<plx+plw;bx+=TL){c.beginPath();c.moveTo(bx,ply);c.lineTo(bx,ply+7);c.stroke();}
    }
    // Ladders
    for(const[lx,ly,lh]of psg.ladders){
      const lx1=lx*TL,ly1=ly*TL;
      // Rails
      c.fillStyle="#7a5a2a";c.fillRect(lx1+6,ly1,4,lh*TL);c.fillRect(lx1+TL-10,ly1,4,lh*TL);
      // Rungs
      for(let r=0;r<lh*4;r++){const ry=ly1+4+r*(TL/4);
        c.fillStyle="#8a6a3a";c.fillRect(lx1+10,ry,TL-20,2);}
    }
    // Background atmosphere — dust motes
    for(let i=0;i<8;i++){const dx2=hs(i,5,77)*W2,dy2=(hs(i,9,88)*H2+t/25)%H2;
      c.fillStyle=`rgba(200,180,140,${0.12+Math.sin(t/600+i*2)*0.08})`;
      c.beginPath();c.arc(dx2+Math.sin(t/400+i)*6,dy2,0.8+hs(i,1,99)*0.6,0,Math.PI*2);c.fill();}
    // Enemies
    for(const e of s.en){const fl=e.fl>0&&Math.floor(e.fl/50)%2,sz=ES;
      c.fillStyle="rgba(0,0,0,0.15)";c.beginPath();c.ellipse(e.x+ES/2+2,e.y+ES-1,ES/2,3,0,0,Math.PI*2);c.fill();
      if(e.type==="ghost")dGh(c,e.x,e.y,sz,fl,t);
      else if(e.type==="bat"||e.type==="fire_bat")dBt(c,e.x,e.y,sz,fl,t,e.type==="fire_bat");
      else dSk(c,e.x,e.y,sz,fl,t);}
    // Drops
    for(const d2 of s.drops){const bob2=Math.sin(t/200)*2;
      if(d2.type==="heart"){c.fillStyle="#ee3333";dH(c,d2.x-6,d2.y-6+bob2,12);}
      else{c.fillStyle="#4f4";c.beginPath();c.moveTo(d2.x,d2.y-4+bob2);c.lineTo(d2.x+3,d2.y+bob2);c.lineTo(d2.x,d2.y+4+bob2);c.lineTo(d2.x-3,d2.y+bob2);c.closePath();c.fill();}}
    // Player
    const p2=s.p,vis=p2.ifr<=0||Math.floor(p2.ifr/80)%2;
    if(vis&&!s.death.a){
      c.fillStyle="rgba(0,0,0,0.18)";c.beginPath();c.ellipse(p2.x+PS/2+2,p2.y+PS-1,10,3,0,0,Math.PI*2);c.fill();
      dP(c,p2.x,p2.y,s.ss.facing>0?1:3,t,s.p.redArmor);
    }
    if(s.sw.a)dSw(c,p2.x,p2.y,s.ss.facing>0?1:3,s.sw.t);
    // Particles
    for(const pt of s.pt){const pa=Math.min(1,pt.l/500);c.globalAlpha=pa;c.fillStyle=pt.c;c.beginPath();c.arc(pt.x,pt.y,1+pt.l/800,0,Math.PI*2);c.fill();}c.globalAlpha=1;
    for(const dn of s.dmgNums){c.globalAlpha=Math.min(1,dn.t/300);c.fillStyle=dn.c;c.font="bold 12px monospace";c.textAlign="center";c.fillText(dn.val,dn.x,dn.y);c.textAlign="left";}c.globalAlpha=1;
    // Vignette
    const vig2=c.createRadialGradient(W2/2,H2/2,W2*0.25,W2/2,H2/2,W2*0.7);
    vig2.addColorStop(0,"rgba(0,0,0,0)");vig2.addColorStop(0.7,"rgba(0,0,0,0.2)");vig2.addColorStop(1,"rgba(0,0,0,0.5)");
    c.fillStyle=vig2;c.fillRect(0,0,W2,H2);
    // HUD label
    c.fillStyle="rgba(0,0,0,0.6)";c.fillRect(W2/2-60,4,120,16);
    c.fillStyle="#ccc";c.font="bold 9px monospace";c.textAlign="center";c.fillText("UNDERGROUND PASSAGE",W2/2,15);c.textAlign="left";
    // Message
    if(s.msg.t>0){c.font="bold 14px monospace";const mw=Math.min(c.measureText(s.msg.text).width+48,W2-32),my=H2-56;
      c.fillStyle="rgba(0,0,0,0.85)";const r2=8;c.beginPath();c.moveTo(W2/2-mw/2+r2,my);c.lineTo(W2/2+mw/2-r2,my);c.quadraticCurveTo(W2/2+mw/2,my,W2/2+mw/2,my+r2);c.lineTo(W2/2+mw/2,my+32-r2);c.quadraticCurveTo(W2/2+mw/2,my+32,W2/2+mw/2-r2,my+32);c.lineTo(W2/2-mw/2+r2,my+32);c.quadraticCurveTo(W2/2-mw/2,my+32,W2/2-mw/2,my+32-r2);c.lineTo(W2/2-mw/2,my+r2);c.quadraticCurveTo(W2/2-mw/2,my,W2/2-mw/2+r2,my);c.fill();
      c.strokeStyle="rgba(253,211,51,0.5)";c.stroke();c.fillStyle="#fff";c.textAlign="center";c.fillText(s.msg.text,W2/2,my+20);c.textAlign="left";}
    // Death overlay
    if(s.death.a){const da=Math.min(1,s.death.t/1500);c.globalAlpha=1-da;
      c.save();c.translate(p2.x+PS/2,p2.y+PS/2);c.rotate(s.death.spin);c.translate(-PS/2,-PS/2);
      dP(c,0,0,2,t,s.p.redArmor);c.restore();c.globalAlpha=1;}
    c.restore();// clip
    c.restore();// translate
    // Fade
    if(s.fade.a){c.fillStyle=`rgba(0,0,0,${s.fade.alpha})`;c.fillRect(0,0,W2,H2+HH);}
    if(s.go){c.fillStyle="rgba(10,0,0,0.75)";c.fillRect(0,0,W2,H2+HH);c.fillStyle="#e33";c.font="bold 36px monospace";c.textAlign="center";c.fillText("GAME OVER",W2/2,(H2+HH)/2-20);c.fillStyle="#ccc";c.font="16px monospace";c.fillText("Tap to respawn",W2/2,(H2+HH)/2+25);c.textAlign="left";}
    return;
  }
  c.fillStyle=iD?dg.color:"#2a3a28";c.fillRect(0,0,W2,H2);
  if(m)for(let y=0;y<RO;y++)for(let x=0;x<CO;x++){let tl=m[y][x];const px=x*TL,py=y*TL;
    const pk=`${loc.ty}:${loc.di}:${loc.scr}:${x},${y}`;
    if((tl===T.KEY||tl===T.MASTER_KEY||tl===T.HEART||tl===T.HEART_PIECE||tl===T.TRIFORCE||tl===T.BOMB||tl===T.RUPEE||tl===T.BOW||tl===T.BOMB_BAG||tl===T.MASTER_SWORD||tl===T.BANANA||tl===T.JAR||tl===T.COMPASS)&&s.pk.has(pk))tl=iD?T.FLOOR:T.GRASS;
    if((tl===T.DOOR||tl===T.BOSS_DOOR)&&s.dr.has(pk))tl=T.FLOOR;
    let ei=null;
    if(tl===T.ENTRANCE&&!iD){for(const de of DE){if(de.s===loc.scr){for(const tp of de.t){if(tp[0]===x&&tp[1]===y){ei={di:de.d,qx:x-de.t[0][0],qy:y-de.t[0][1]};break;}}if(ei)break;}}}
    dT(c,tl,px,py,iD,dg,s.gt,ei);}
  // Shadow vault — fill PIT areas with dark fog and blinking eyes
  if(iD&&m&&loc.ty==="dg"){const rmSV=s.dg[loc.di]?.rooms[loc.scr];
    if(rmSV?.dark){
      for(let y=0;y<RO;y++)for(let x=0;x<CO;x++){
        if(m[y][x]===T.PIT){const px=x*TL,py=y*TL;
          // Dark swirling shadow fog
          const fog=c.createRadialGradient(px+16,py+16,2,px+16,py+16,18);
          fog.addColorStop(0,`rgba(20,0,30,${0.7+Math.sin(t/800+x*3+y*5)*0.15})`);
          fog.addColorStop(1,`rgba(10,0,15,${0.9+Math.sin(t/600+x*7)*0.1})`);
          c.fillStyle=fog;c.fillRect(px,py,TL,TL);
          // Wisps of shadow
          const wx=Math.sin(t/1000+x*2+y)*4,wy=Math.cos(t/1200+y*3)*3;
          c.fillStyle=`rgba(60,0,80,${0.15+Math.sin(t/500+x+y*2)*0.08})`;
          c.beginPath();c.arc(px+16+wx,py+16+wy,6+Math.sin(t/700+x)*2,0,Math.PI*2);c.fill();
        }}
      // Blinking eyes in the shadow — deterministic positions based on hash
      const eyeSeed=42;let eRng=eyeSeed;const eRn=()=>{eRng=(eRng*16807+1)%2147483647;return(eRng&0xffff)/0xffff;};
      for(let i=0;i<12;i++){
        const ex=1+Math.floor(eRn()*14),ey=1+Math.floor(eRn()*10);
        if(m[ey]&&m[ey][ex]===T.PIT){
          // Blink cycle: each eye pair has its own timing
          const blinkCycle=3000+eRn()*4000;const blinkPhase=eRn()*blinkCycle;
          const bt=(t+blinkPhase)%blinkCycle;
          const open=bt<blinkCycle*0.7;// eyes open 70% of time
          const blinkT=bt>blinkCycle*0.65&&bt<blinkCycle*0.7;// closing
          if(open){
            const px=ex*TL,py=ey*TL;
            const drift=Math.sin(t/900+i*2)*2;
            const eyeSize=blinkT?0.5:1.5;
            // Left eye
            c.fillStyle=`rgba(200,50,50,${0.6+Math.sin(t/400+i)*0.2})`;
            c.beginPath();c.arc(px+10+drift,py+16,eyeSize,0,Math.PI*2);c.fill();
            // Right eye
            c.beginPath();c.arc(px+22+drift,py+16,eyeSize,0,Math.PI*2);c.fill();
            // Faint glow
            c.fillStyle=`rgba(200,0,0,${0.04+Math.sin(t/400+i)*0.02})`;
            c.beginPath();c.arc(px+16+drift,py+16,8,0,Math.PI*2);c.fill();
          }
        }
      }
    }}
  // Faint heart piece outline hidden in hot spring (screen 2,2, tile 2,10)
  if(!iD&&loc.scr==="2,2"&&!s.pk.has("ow:-1:2,2:2,10")){
    const hpx=2*TL+16,hpy=10*TL+16;const ha=0.12+Math.sin(t/800)*0.05;
    c.fillStyle=`rgba(255,51,102,${ha})`;c.beginPath();
    c.moveTo(hpx,hpy+4);c.lineTo(hpx-5,hpy-1);c.arc(hpx-3,hpy-3,3,Math.PI,0);c.arc(hpx+3,hpy-3,3,Math.PI,0);c.lineTo(hpx+5,hpy-1);c.closePath();c.fill();}
  // Ambient dungeon decorations -- sparse, theme-aware, deterministic
  if(iD&&m){const th=dg?.th||"forest";
    for(let y=1;y<RO-1;y++)for(let x=1;x<CO-1;x++){
    const tl2=m[y][x];if(tl2!==T.FLOOR)continue;
    const h1=hs(x,y,42),h2=hs(x,y,73),h3=hs(x,y,101),h4=hs(x,y,137),px2=x*TL,py2=y*TL;
    // Theme-specific floor decorations -- sparse (each ~3-5% of tiles)
    if(th==="forest"){
      if(h1<0.04){// Vine tendrils creeping across floor
        c.strokeStyle="rgba(40,90,30,0.25)";c.lineWidth=1.2;const vx=px2+h2*20,vy=py2+10+h3*12;
        c.beginPath();c.moveTo(vx,vy);c.quadraticCurveTo(vx+10,vy-6+h3*8,vx+20,vy+2);c.stroke();
        c.fillStyle="rgba(50,110,30,0.2)";// tiny leaves
        c.beginPath();c.arc(vx+6,vy-2+h3*4,2,0,Math.PI*2);c.fill();
        c.beginPath();c.arc(vx+14,vy+h3*6,1.5,0,Math.PI*2);c.fill();
      }else if(h1<0.08){// Moss patch -- soft organic blobs
        c.fillStyle="rgba(35,80,25,0.2)";
        c.beginPath();c.arc(px2+10+h2*12,py2+20+h3*8,4+h2*3,0,Math.PI*2);c.fill();
        c.fillStyle="rgba(50,100,35,0.15)";
        c.beginPath();c.arc(px2+14+h2*8,py2+18+h3*6,2.5+h3*2,0,Math.PI*2);c.fill();
      }else if(h1<0.11){// Small fern/plant
        const fx2=px2+8+h2*16,fy2=py2+14+h3*10;
        c.fillStyle="rgba(40,100,30,0.3)";
        c.beginPath();c.moveTo(fx2,fy2+6);c.quadraticCurveTo(fx2-3,fy2,fx2-6,fy2-2);c.quadraticCurveTo(fx2-2,fy2+1,fx2,fy2+6);c.fill();
        c.beginPath();c.moveTo(fx2,fy2+6);c.quadraticCurveTo(fx2+4,fy2-1,fx2+7,fy2-3);c.quadraticCurveTo(fx2+3,fy2+2,fx2,fy2+6);c.fill();
      }else if(h1<0.14){// Small puddle
        c.fillStyle="rgba(40,60,90,0.15)";c.beginPath();c.ellipse(px2+14+h2*8,py2+20+h3*6,5+h2*3,2.5+h3,h4*.4,0,Math.PI*2);c.fill();
        c.fillStyle="rgba(140,170,200,0.08)";c.beginPath();c.ellipse(px2+13+h2*8,py2+19+h3*6,3,1.5,h4,0,Math.PI*2);c.fill();
      }else if(h1<0.16){// Mushroom (rare)
        const mx=px2+10+h2*14,my=py2+20+h3*6;
        c.fillStyle="rgba(170,60,50,0.3)";c.beginPath();c.arc(mx,my-2,3,Math.PI,0);c.fill();
        c.fillStyle="rgba(150,130,90,0.25)";c.fillRect(mx-1,my-1,2,4);
        c.fillStyle="rgba(255,255,255,0.15)";c.beginPath();c.arc(mx-1,my-3,0.8,0,Math.PI*2);c.fill();
      }
    }else if(th==="fire"){
      if(h1<0.04){// Scorch mark
        c.fillStyle="rgba(30,15,8,0.18)";c.beginPath();c.ellipse(px2+16+h2*8-4,py2+16+h3*8,5+h2*4,3+h3*2,h4,0,Math.PI*2);c.fill();
      }else if(h1<0.08){// Flickering ember
        const ea=Math.sin(t/400+x*3+y*7)*0.25+0.3;
        c.fillStyle=`rgba(255,120,20,${ea*0.25})`;c.beginPath();c.arc(px2+12+h2*12,py2+14+h3*10,1.5,0,Math.PI*2);c.fill();
      }else if(h1<0.11){// Ash pile
        c.fillStyle="rgba(60,55,50,0.15)";c.beginPath();c.ellipse(px2+14+h2*10,py2+22+h3*4,4+h2*3,2,0,0,Math.PI*2);c.fill();
      }
    }else if(th==="shadow"){
      if(h1<0.04){// Ethereal wisp
        const wa=Math.sin(t/500+x*5+y*3)*3,wb=Math.cos(t/600+y*4)*2;
        c.fillStyle=`rgba(120,80,200,${0.1+Math.sin(t/300+h2*10)*0.05})`;
        c.beginPath();c.arc(px2+14+h2*10+wa,py2+14+h3*10+wb,3+h2*2,0,Math.PI*2);c.fill();
      }else if(h1<0.07){// Shadow stain
        c.fillStyle="rgba(20,10,30,0.12)";c.beginPath();c.ellipse(px2+14+h2*10,py2+18+h3*8,5+h2*3,3+h3*2,h4,0,Math.PI*2);c.fill();
      }
    }else{// Generic
      if(h1<0.03){// Cobweb
        c.strokeStyle="rgba(200,200,200,0.1)";c.lineWidth=0.5;const wx=px2+4+h2*10,wy=py2+4+h3*6;
        c.beginPath();c.moveTo(wx,wy);c.quadraticCurveTo(wx+6,wy+4,wx+12,wy);
        c.moveTo(wx,wy);c.quadraticCurveTo(wx+3,wy+6,wx,wy+10);c.stroke();
      }else if(h1<0.06){// Small rubble
        c.fillStyle="rgba(90,80,70,0.15)";const rx=px2+6+h2*18,ry=py2+18+h3*10;
        c.beginPath();c.moveTo(rx,ry);c.lineTo(rx+3+h2*2,ry-1);c.lineTo(rx+5,ry+2);c.lineTo(rx+1,ry+2);c.fill();
      }
    }
    // Rare skull -- only in shadow/generic, very sparse
    if((th==="shadow"||th==="generic")&&h1>0.97){
      const sx2=px2+10+h2*12,sy2=py2+10+h3*12;
      c.fillStyle="rgba(180,170,150,0.25)";c.beginPath();c.arc(sx2,sy2,3.5,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(20,10,10,0.35)";c.beginPath();c.arc(sx2-1.2,sy2-0.5,1,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(sx2+1.2,sy2-0.5,1,0,Math.PI*2);c.fill();}
    // Wall decorations -- sparse (north wall adjacent)
    if(y>0&&m[y-1][x]===T.WALL){
      if(h1>0.92){// Hanging chains (shadow/fire only)
        if(th==="shadow"||th==="fire"){c.strokeStyle="rgba(140,140,140,0.2)";c.lineWidth=1.2;
        const cx4=px2+8+h2*16;c.beginPath();
        for(let i=0;i<4;i++){const cy4=py2+1+i*4;c.moveTo(cx4+(i%2?-2:2),cy4);c.arc(cx4,cy4+2,2,i%2?Math.PI:0,i%2?0:Math.PI);}
        c.stroke();}
      }else if(h1>0.88){// Moss/vine drip from wall
        const mc2=th==="fire"?"rgba(50,35,18,0.12)":"rgba(30,65,22,0.18)";
        c.fillStyle=mc2;c.beginPath();c.moveTo(px2+8+h2*16,py2);c.lineTo(px2+6+h2*16,py2+5+h3*3);
        c.lineTo(px2+11+h2*16,py2+3+h3*4);c.lineTo(px2+10+h2*16,py2);c.fill();
      }}}}
  // Simple bars over exits when combat locked
  if(s.combatLock&&iD){
    c.fillStyle="rgba(80,40,20,0.8)";
    if(m[0]&&(m[0][7]===T.FLOOR||m[0][7]===T.DOOR)){c.fillRect(7*TL,0,TL*2,4);c.fillRect(7*TL,TL-4,TL*2,4);}
    if(m[RO-1]&&(m[RO-1][7]===T.FLOOR||m[RO-1][7]===T.DOOR)){c.fillRect(7*TL,(RO-1)*TL,TL*2,4);c.fillRect(7*TL,RO*TL-4,TL*2,4);}
    if(m[5]&&(m[5][0]===T.FLOOR||m[5][0]===T.DOOR)){c.fillRect(0,5*TL,4,TL*2);c.fillRect(TL-4,5*TL,4,TL*2);}
    if(m[5]&&(m[5][CO-1]===T.FLOOR||m[5][CO-1]===T.DOOR)){c.fillRect((CO-1)*TL,5*TL,4,TL*2);c.fillRect(CO*TL-4,5*TL,4,TL*2);}}
  if(!iD)drawTerrainOverlay(c,m,t);
  // Overworld ambient effects
  if(!iD){
    // Day/Night cycle — compute night intensity for ambient effects
    const nightAmt=getNightAmount(s.weather.timer);
    // Night sky stars (only visible at night on overworld)
    if(nightAmt>0.2){const starA=Math.min(1,(nightAmt-0.2)/0.3);
      for(let i=0;i<20;i++){const sx2=hs(i,30,400)*W2,sy2=hs(i,31,401)*H2*0.6;
        const twinkle=Math.sin(t/300+i*2.7)*0.3+0.7;
        c.fillStyle=`rgba(255,255,220,${starA*twinkle*0.5})`;c.beginPath();c.arc(sx2,sy2,0.8+twinkle*0.4,0,Math.PI*2);c.fill();}
      // Fireflies at night (replace some pollen with glowing dots)
      for(let i=0;i<6;i++){const ffx=(hs(i,40,500)*W2+Math.sin(t/800+i*3)*20),ffy=hs(i,41,501)*H2+Math.sin(t/600+i*2)*15;
        const glow=Math.sin(t/400+i*4)*0.5+0.5;// pulse
        if(glow>0.3){c.fillStyle=`rgba(200,255,100,${starA*glow*0.5})`;c.beginPath();c.arc(ffx,ffy,1.5,0,Math.PI*2);c.fill();
          c.fillStyle=`rgba(180,255,80,${starA*glow*0.15})`;c.beginPath();c.arc(ffx,ffy,5,0,Math.PI*2);c.fill();}}}
    // Sacred Lake (-1,2) — magical wisps and sprites floating over the water
    if(loc.scr==="-1,2"){
      // Glowing wisps — slow orbiting lights with color shifts
      for(let i=0;i<8;i++){
        const seed=i*137.5;const orbitR=30+Math.sin(t/3000+seed)*20;
        const cx2=W2*0.15+hs(i,60,700)*W2*0.7;const cy2=H2*0.2+hs(i,61,701)*H2*0.6;
        const wx=cx2+Math.cos(t/2000+seed)*orbitR;const wy=cy2+Math.sin(t/2500+seed)*orbitR*0.6;
        const pulse=Math.sin(t/800+seed)*0.3+0.7;
        // Outer glow
        const hue=i%3===0?"180,230,255":i%3===1?"220,200,255":"200,255,220";
        c.fillStyle=`rgba(${hue},${pulse*0.12})`;c.beginPath();c.arc(wx,wy,8+Math.sin(t/600+i)*2,0,Math.PI*2);c.fill();
        // Core light
        c.fillStyle=`rgba(${hue},${pulse*0.5})`;c.beginPath();c.arc(wx,wy,2.5+Math.sin(t/400+i)*0.5,0,Math.PI*2);c.fill();
        // Bright center
        c.fillStyle=`rgba(255,255,255,${pulse*0.4})`;c.beginPath();c.arc(wx,wy,1,0,Math.PI*2);c.fill();
        // Trailing sparkle particles
        for(let j=0;j<3;j++){const age=j*0.3;const tx2=wx-Math.cos(t/2000+seed)*orbitR*age*0.4;
          const ty2=wy-Math.sin(t/2500+seed)*orbitR*0.6*age*0.4;
          c.fillStyle=`rgba(${hue},${pulse*(1-age)*0.2})`;c.beginPath();c.arc(tx2,ty2,1.5-age,0,Math.PI*2);c.fill();}
      }
      // Floating fairy sprites — tiny winged lights that drift and bob
      for(let i=0;i<4;i++){
        const fx2=(hs(i,70,800)*W2+Math.sin(t/4000+i*2.7)*40);
        const fy2=H2*0.3+hs(i,71,801)*H2*0.4+Math.sin(t/1500+i*3.1)*20;
        const wingFlap=Math.sin(t/60+i*4)*0.5;
        const glow2=Math.sin(t/500+i*2)*0.2+0.6;
        // Wings
        c.fillStyle=`rgba(200,240,255,${glow2*0.35})`;
        c.beginPath();c.ellipse(fx2-3,fy2,3,1.5+wingFlap,-.3,0,Math.PI*2);c.fill();
        c.beginPath();c.ellipse(fx2+3,fy2,3,1.5-wingFlap,.3,0,Math.PI*2);c.fill();
        // Body glow
        c.fillStyle=`rgba(220,250,255,${glow2*0.6})`;c.beginPath();c.arc(fx2,fy2,2,0,Math.PI*2);c.fill();
        c.fillStyle=`rgba(255,255,255,${glow2*0.4})`;c.beginPath();c.arc(fx2,fy2,1,0,Math.PI*2);c.fill();
        // Sparkle trail
        const trail=Math.sin(t/300+i)*3;
        c.fillStyle=`rgba(200,230,255,${glow2*0.15})`;c.beginPath();c.arc(fx2-trail,fy2+trail*0.5,1,0,Math.PI*2);c.fill();
      }
      // Shimmer on the water surface
      for(let i=0;i<12;i++){
        const sx2=3*TL+hs(i,80,900)*(9*TL);const sy2=3*TL+hs(i,81,901)*(5*TL);
        const shimmer=Math.sin(t/400+i*1.7)*0.15+0.15;
        c.fillStyle=`rgba(200,230,255,${shimmer})`;c.beginPath();c.arc(sx2,sy2,1+Math.sin(t/300+i)*0.5,0,Math.PI*2);c.fill();}
    }
    // Wind wisps -- mystical wisps with particle trails
    for(let i=0;i<5;i++){
      const wPhase=t/5000+i*1.3;const wActive=Math.sin(wPhase)>0.3;// visible ~40% of the time
      if(wActive){const wp=((Math.sin(wPhase)-0.3)/0.7);
        const wy=hs(i,20,300)*H2;const wx=(t/6+i*130)%(W2+80)-40;
        const wa=wp<0.2?wp/0.2:wp>0.8?(1-wp)/0.2:1;
        const wy2=wy+Math.sin(t/400+i*3)*8;
        // Curved wisp stroke
        c.strokeStyle=`rgba(210,225,255,${wa*0.18})`;c.lineWidth=1.5;
        c.beginPath();c.moveTo(wx,wy2);c.quadraticCurveTo(wx+25,wy2+Math.sin(t/300+i)*6-4,wx+50,wy2+Math.sin(t/350+i*2)*4);c.stroke();
        // Trailing particles -- staggered, shrinking, fading
        for(let j=0;j<6;j++){const age=j*0.17;
          const px3=wx-j*9+Math.sin(t/250+j+i)*4,py3=wy2+Math.sin(t/300+j*2+i)*5;
          const pa=wa*(1-age)*0.18,ps=2-age*1;
          c.fillStyle=`rgba(200,220,255,${pa})`;c.beginPath();c.arc(px3,py3,Math.max(0.5,ps),0,Math.PI*2);c.fill();}}}
    // Drifting leaves (slow diagonal movement)
    for(let i=0;i<6;i++){const lx=(hs(i,0,200)*W2+t/8+i*90)%W2,ly=(hs(i,1,201)*H2+t/12+i*60)%H2;
      const lr=Math.sin(t/400+i*2)*Math.PI;const la=0.12+Math.sin(t/600+i)*0.06;
      c.save();c.translate(lx,ly);c.rotate(lr);c.fillStyle=`rgba(100,160,40,${la})`;
      c.beginPath();c.ellipse(0,0,3,1.5,0,0,Math.PI*2);c.fill();c.restore();}
    // Tiny floating pollen/dust (very subtle)
    for(let i=0;i<8;i++){const dx2=hs(i,5,210)*W2,dy2=(hs(i,6,211)*H2+t/25+i*50)%H2;
      const da=0.08+Math.sin(t/500+i*3)*0.04;
      c.fillStyle=`rgba(255,255,200,${da})`;c.beginPath();c.arc(dx2+Math.sin(t/700+i*2)*6,dy2,0.8,0,Math.PI*2);c.fill();}
    // Butterflies near flowers (rare, only if flowers visible)
    if(m){for(let i=0;i<2;i++){const bx=hs(i,10,220)*W2,by=hs(i,11,221)*H2;
      const btx=Math.floor(bx/TL),bty=Math.floor(by/TL);
      if(btx>=0&&btx<CO&&bty>=0&&bty<RO&&m[bty][btx]===T.FLOWER){
        const bfx=bx+Math.sin(t/300+i*4)*12,bfy=by+Math.cos(t/350+i*3)*8-6;
        const wing=Math.sin(t/80+i*5)*0.4;
        c.fillStyle=`rgba(255,200,100,${0.3+Math.sin(t/200+i)*0.1})`;
        c.save();c.translate(bfx,bfy);
        c.beginPath();c.ellipse(-2,0,2.5,1.5+wing,0,0,Math.PI*2);c.fill();
        c.beginPath();c.ellipse(2,0,2.5,1.5-wing,0,0,Math.PI*2);c.fill();
        c.restore();}}}
    // Poisonous swamp -- purple mist over tallgrass tiles
    if(loc.scr==="0,1"&&m){for(let y=0;y<RO;y++)for(let x=0;x<CO;x++){
      if(m[y][x]===T.TALLGRASS){const px3=x*TL,py3=y*TL;
        // Purple mist layer
        const ma=0.12+Math.sin(t/600+x*3+y*5)*0.06;
        c.fillStyle=`rgba(100,40,140,${ma})`;c.beginPath();c.ellipse(px3+16,py3+16,18,14,0,0,Math.PI*2);c.fill();
        // Drifting mist wisps
        const wx=Math.sin(t/800+x*2+y)*6,wy=Math.cos(t/900+y*3)*4;
        c.fillStyle=`rgba(140,60,180,${ma*0.5})`;c.beginPath();c.ellipse(px3+10+wx,py3+8+wy,8,5,0,0,Math.PI*2);c.fill();
        c.fillStyle=`rgba(120,50,160,${ma*0.4})`;c.beginPath();c.ellipse(px3+22-wx,py3+20-wy,6,4,0,0,Math.PI*2);c.fill();
        // Tiny rising particles
        if(hs(x,y,55)>0.7){const py4=(py3-t/15+y*20)%H2;
          c.fillStyle=`rgba(160,80,200,${0.15+Math.sin(t/400+x)*0.08})`;
          c.beginPath();c.arc(px3+10+hs(x,y,56)*12,py4%32+py3,1.5,0,Math.PI*2);c.fill();}}}}}
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
      const ts2=tx2*0.37+ty2*0.53;// per-torch seed
      const flk=Math.sin(t/197+ts2)*0.06+Math.sin(t/131+ts2*1.3)*0.04+Math.sin(t/67+ts2*0.7)*0.03;
      const r2=85+Math.sin(t/173+ts2)*12+Math.sin(t/97+ts2*1.4)*8;
      const tg=c.createRadialGradient(tx2,ty2,4,tx2,ty2,r2);
      tg.addColorStop(0,`rgba(255,200,100,${0.18+flk})`);tg.addColorStop(0.5,`rgba(255,150,50,${0.06+flk*0.3})`);tg.addColorStop(1,"rgba(255,100,30,0)");
      c.fillStyle=tg;c.fillRect(tx2-r2,ty2-r2,r2*2,r2*2);}}
  if(iD){for(let i=0;i<15;i++){const dx2=hs(i,3,77)*W2,dy2=(hs(i,7,88)*H2+t/20)%H2;
    const da=0.15+Math.sin(t/600+i*2)*0.1;c.fillStyle=`rgba(200,180,140,${da})`;c.beginPath();c.arc(dx2+Math.sin(t/400+i)*8,dy2,0.8+hs(i,1,99)*0.8,0,Math.PI*2);c.fill();}}
  // Wallmaster shadow warnings
  for(const e of s.en){if(e.type==="wallmaster"&&e.wmState==="shadow"){
    const sa2=Math.min(1,(e.wmT||0)/1200);
    c.fillStyle=`rgba(40,0,60,${sa2*0.4})`;c.beginPath();c.ellipse(e.wmTx||0,e.wmTy||0,14+sa2*8,8+sa2*4,0,0,Math.PI*2);c.fill();
    c.fillStyle=`rgba(80,20,120,${sa2*0.2})`;c.beginPath();c.ellipse(e.wmTx||0,e.wmTy||0,8+sa2*4,4+sa2*2,0,0,Math.PI*2);c.fill();}}
  // Fire trails from magma slugs
  if(s.fireTrails){for(const ft of s.fireTrails){const fa=Math.min(1,ft.t/1000);
    c.fillStyle=`rgba(255,100,0,${fa*0.3})`;c.beginPath();c.arc(ft.x,ft.y,10,0,Math.PI*2);c.fill();
    c.fillStyle=`rgba(255,200,50,${fa*0.2+Math.sin(t/100+ft.x)*0.1})`;c.beginPath();c.arc(ft.x,ft.y,6,0,Math.PI*2);c.fill();
    c.fillStyle=`rgba(255,255,150,${fa*0.15})`;c.beginPath();c.arc(ft.x+(Math.sin(t/80+ft.y)*2),ft.y-2,3,0,Math.PI*2);c.fill();}}
  // Dungeon wall sign — mounted on the wall surface
  if(iD&&loc.ty==="dg"){const rmSign=s.dg[loc.di]?.rooms[loc.scr];
    if(rmSign?.sign&&rmSign?.signPos){const[sx,sy]=rmSign.signPos;const spx=sx*TL,spy=sy*TL;
      // Sign board mounted on bottom edge of wall tile
      c.fillStyle="#6a4a20";c.fillRect(spx+4,spy+20,24,12);// frame
      c.fillStyle="#8a6a30";c.fillRect(spx+5,spy+21,22,10);// board
      c.fillStyle="#a08040";c.fillRect(spx+6,spy+22,20,8);// face
      // Nails in corners
      c.fillStyle="#999";c.fillRect(spx+7,spy+22,2,2);c.fillRect(spx+23,spy+22,2,2);
      // Text on sign
      c.fillStyle="#543820";c.font="bold 5px monospace";c.textAlign="center";
      c.fillText("READ ME",spx+16,spy+28);
      c.textAlign="left";
      // Exclamation when player is within range (player is one tile below wall)
      const pdS=Math.hypot(p.x+PS/2-spx-16,p.y+PS/2-spy-TL);
      if(pdS<TL*2){const bob=Math.sin(t/300)*3;c.fillStyle="#fd3";c.font="bold 10px monospace";c.textAlign="center";c.fillText("!",spx+16,spy+18+bob);c.textAlign="left";}
    }}
  for(const e of s.en){const fl=e.fl>0&&Math.floor(e.fl/50)%2,sz=e.type==="boss"?ES*1.5:e.type==="miniboss"?ES*1.3:ES;
    if(e.spawnT>0){
      // Spawn animation -- smoke puff and scale-in
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
      else if(e.type==="magma_slug")dMs(c,ex,ey,sz,false,t);
      else if(e.type==="wallmaster")dWm(c,ex,ey,sz,false,t);
      else if(e.type==="yeti")dYt(c,ex,ey,sz,false,t);
      else if(e.type==="blob")dBl(c,ex,ey,sz,false,t);
      else if(e.type==="shimmer_ghoul")dSg(c,ex,ey,sz,false,t);
      else dSk(c,ex,ey,sz,false,t);
      c.globalAlpha=1;c.restore();continue;}
    const ex=e.x+(ES-sz)/2,ey=e.y+(ES-sz)/2;
    c.fillStyle="rgba(0,0,0,0.15)";c.beginPath();c.ellipse(e.x+ES/2+3,e.y+ES-1,sz/2+1,4,0.1,0,Math.PI*2);c.fill();
    if(e.type==="ghost")dGh(c,ex,ey,sz,fl,t);
    else if(e.type==="boss"){
      // Shadow form: translucent purple ghost effect
      if(e.shadowForm){
        c.globalAlpha=0.35+Math.sin(t/150)*0.15;
        c.fillStyle=`rgba(100,40,180,${0.2+Math.sin(t/200)*0.1})`;
        c.beginPath();c.arc(ex+sz/2,ey+sz/2,sz*0.8,0,Math.PI*2);c.fill();
      }
      dBo(c,ex,ey,sz,fl,t,e.hp,e.mhp,loc.di);
      if(e.shadowForm)c.globalAlpha=1;
    }
    else if(e.type==="miniboss"){
      // Draw miniboss -- unique appearance per dungeon
      const mbPh=Math.floor(e.mt/2500)%3;const charging=mbPh===2;
      const mn=e.name||"";
      // Shadow Knight afterimages — drawn before main sprite
      if(mn==="Shadow Knight"&&e.afterimages){for(const ai of e.afterimages){
        const aix=ai.x+(ES-sz)/2,aiy=ai.y+(ES-sz)/2,aia=Math.min(1,ai.t/300)*0.4;
        c.globalAlpha=aia;c.fillStyle="rgba(80,40,140,0.5)";c.beginPath();c.arc(aix+sz/2,aiy+sz/2,sz*0.5,0,Math.PI*2);c.fill();
        c.globalAlpha=1;}}
      // Vine Guardian — invisible when burrowed, just show ground disturbance
      if(mn==="Vine Guardian"&&e.burrowed){
        const rumble=Math.sin(t/60)*2;
        c.fillStyle="rgba(80,60,30,0.4)";c.beginPath();c.ellipse(ex+sz/2+rumble,ey+sz*0.8,sz*0.4,sz*0.12,0,0,Math.PI*2);c.fill();
        // Ground crack lines
        c.strokeStyle="rgba(60,40,15,0.3)";c.lineWidth=1;
        for(let i=0;i<3;i++){const ca=i*Math.PI*2/3+t/400;
          c.beginPath();c.moveTo(ex+sz/2,ey+sz*0.8);c.lineTo(ex+sz/2+Math.cos(ca)*sz*0.5,ey+sz*0.8+Math.sin(ca)*sz*0.15);c.stroke();}
      }else if(mn==="Vine Guardian"){
        // Forest miniboss — tangled vine creature with glowing core
        const pulse=Math.sin(t/250)*0.08;const sway=Math.sin(t/400)*3;
        c.fillStyle=`rgba(40,180,40,${charging?0.3:0.12+pulse})`;c.beginPath();c.arc(ex+sz/2,ey+sz/2,sz*0.7,0,Math.PI*2);c.fill();
        // Vine tendrils
        c.strokeStyle=fl?"#fff":"#2a6a18";c.lineWidth=3;
        for(let i=0;i<6;i++){const a=i*Math.PI/3+t/800,r1=sz*0.25,r2=sz*0.65+Math.sin(t/300+i)*4;
          c.beginPath();c.moveTo(ex+sz/2+Math.cos(a)*r1,ey+sz/2+Math.sin(a)*r1);
          c.quadraticCurveTo(ex+sz/2+Math.cos(a+0.3)*(r1+r2)/2+sway,ey+sz/2+Math.sin(a+0.3)*(r1+r2)/2,ex+sz/2+Math.cos(a)*r2,ey+sz/2+Math.sin(a)*r2);c.stroke();}
        // Woody body
        const vg=c.createRadialGradient(ex+sz*.45,ey+sz*.3,2,ex+sz/2,ey+sz*.4,sz*.25);
        vg.addColorStop(0,fl?"#fff":"#5a8a30");vg.addColorStop(1,fl?"#ddd":"#3a5a18");
        c.fillStyle=vg;c.beginPath();c.ellipse(ex+sz/2,ey+sz*.42,sz*.22,sz*.28,0,0,Math.PI*2);c.fill();
        // Bark texture lines
        if(!fl){c.strokeStyle="rgba(30,50,10,0.4)";c.lineWidth=1;
          c.beginPath();c.moveTo(ex+sz*.38,ey+sz*.25);c.lineTo(ex+sz*.42,ey+sz*.55);c.stroke();
          c.beginPath();c.moveTo(ex+sz*.58,ey+sz*.28);c.lineTo(ex+sz*.55,ey+sz*.52);c.stroke();}
        // Glowing eye knots
        if(!fl){c.fillStyle=charging?"#ff4":"#8f2";c.beginPath();c.arc(ex+sz*.38,ey+sz*.32,2.5,0,Math.PI*2);c.fill();
          c.beginPath();c.arc(ex+sz*.62,ey+sz*.32,2.5,0,Math.PI*2);c.fill();
          c.fillStyle=`rgba(${charging?'255,255,100':'140,255,40'},0.4)`;c.beginPath();c.arc(ex+sz*.38,ey+sz*.32,4,0,Math.PI*2);c.fill();
          c.beginPath();c.arc(ex+sz*.62,ey+sz*.32,4,0,Math.PI*2);c.fill();}
        // Leaf crown
        if(!fl){c.fillStyle="#3a8a20";
          for(let i=0;i<5;i++){const la=Math.PI+i*Math.PI/6+Math.sin(t/500+i)*0.15;
            c.beginPath();c.ellipse(ex+sz/2+Math.cos(la)*sz*.2,ey+sz*.18+Math.sin(la)*sz*.1,5,3,la+Math.PI/2,0,Math.PI*2);c.fill();}}
      }else if(mn==="Flame Sentinel"){
        // Fire miniboss — living flame with molten armor
        const flicker=Math.sin(t/100)*0.1;const blaze=Math.sin(t/150)*4;
        c.fillStyle=`rgba(255,100,20,${charging?0.35:0.15+flicker})`;c.beginPath();c.arc(ex+sz/2,ey+sz/2,sz*0.75,0,Math.PI*2);c.fill();
        // Flame body — layered fire shape
        const fg1=c.createRadialGradient(ex+sz*.45,ey+sz*.35,2,ex+sz/2,ey+sz*.45,sz*.3);
        fg1.addColorStop(0,fl?"#fff":"#ffe060");fg1.addColorStop(0.5,fl?"#fdd":"#f08020");fg1.addColorStop(1,fl?"#faa":"#c02000");
        c.fillStyle=fg1;
        c.beginPath();c.moveTo(ex+sz*.2,ey+sz*.65);c.quadraticCurveTo(ex+sz*.15,ey+sz*.3,ex+sz*.35+blaze*0.5,ey+sz*.05);
        c.quadraticCurveTo(ex+sz*.45,ey+sz*.2,ex+sz/2,ey-sz*.05+blaze);
        c.quadraticCurveTo(ex+sz*.55,ey+sz*.2,ex+sz*.65-blaze*0.5,ey+sz*.05);
        c.quadraticCurveTo(ex+sz*.85,ey+sz*.3,ex+sz*.8,ey+sz*.65);c.closePath();c.fill();
        // Inner white-hot core
        c.fillStyle=fl?"#fff":"rgba(255,255,200,0.6)";
        c.beginPath();c.ellipse(ex+sz/2,ey+sz*.4,sz*.12,sz*.15,0,0,Math.PI*2);c.fill();
        // Molten armor plates
        if(!fl){c.fillStyle="#8a2a08";c.fillRect(ex+sz*.2,ey+sz*.45,sz*.6,sz*.12);
          c.fillStyle="#6a1a04";c.fillRect(ex+sz*.25,ey+sz*.43,sz*.15,sz*.16);c.fillRect(ex+sz*.6,ey+sz*.43,sz*.15,sz*.16);
          // Glowing cracks in armor
          c.strokeStyle="rgba(255,160,40,0.7)";c.lineWidth=1;
          c.beginPath();c.moveTo(ex+sz*.35,ey+sz*.45);c.lineTo(ex+sz*.4,ey+sz*.55);c.stroke();
          c.beginPath();c.moveTo(ex+sz*.6,ey+sz*.46);c.lineTo(ex+sz*.55,ey+sz*.56);c.stroke();}
        // Ember eyes
        if(!fl){c.fillStyle=charging?"#fff":"#ff2";c.beginPath();c.arc(ex+sz*.38,ey+sz*.28,2.5,0,Math.PI*2);c.fill();
          c.beginPath();c.arc(ex+sz*.62,ey+sz*.28,2.5,0,Math.PI*2);c.fill();}
        // Floating embers
        if(!fl){for(let i=0;i<4;i++){const ea=t/200+i*1.5,er=sz*0.4+Math.sin(t/300+i)*8;
          const epx=ex+sz/2+Math.cos(ea)*er*0.5,epy=ey+sz*.2-Math.abs(Math.sin(ea))*er;
          c.fillStyle=`rgba(255,${150+Math.floor(Math.random()*80)},30,${0.4+Math.sin(t/200+i)*0.2})`;
          c.beginPath();c.arc(epx,epy,1.5,0,Math.PI*2);c.fill();}}
      }else{
        // Shadow Knight — dark spectral warrior with purple aura
        const pulse=Math.sin(t/300)*0.08;const drift=Math.sin(t/500)*2;
        c.fillStyle=`rgba(100,40,180,${charging?0.3:0.12+pulse})`;c.beginPath();c.arc(ex+sz/2,ey+sz/2,sz*0.7,0,Math.PI*2);c.fill();
        // Dark body with gradient
        const sg=c.createRadialGradient(ex+sz*.45,ey+sz*.3,2,ex+sz/2,ey+sz*.4,sz*.28);
        sg.addColorStop(0,fl?"#fff":"#4a3a6a");sg.addColorStop(1,fl?"#ddd":"#1a0a2a");
        c.fillStyle=sg;c.beginPath();c.ellipse(ex+sz/2,ey+sz*.42,sz*.22,sz*.3,0,0,Math.PI*2);c.fill();
        // Horned helm
        const hg=c.createLinearGradient(ex+sz*.3,ey,ex+sz*.7,ey+sz*.25);
        hg.addColorStop(0,fl?"#fff":"#3a2a4a");hg.addColorStop(1,fl?"#ddd":"#2a1a3a");
        c.fillStyle=hg;c.beginPath();c.arc(ex+sz/2,ey+sz*.2,sz*.22,0,Math.PI*2);c.fill();
        // Horns
        if(!fl){c.fillStyle="#2a1a3a";
          c.beginPath();c.moveTo(ex+sz*.25,ey+sz*.2);c.lineTo(ex+sz*.15,ey-sz*.05+drift);c.lineTo(ex+sz*.32,ey+sz*.12);c.fill();
          c.beginPath();c.moveTo(ex+sz*.75,ey+sz*.2);c.lineTo(ex+sz*.85,ey-sz*.05-drift);c.lineTo(ex+sz*.68,ey+sz*.12);c.fill();}
        // Dark armor with purple trim
        if(!fl){c.fillStyle="#2a1838";c.fillRect(ex+sz*.18,ey+sz*.32,sz*.64,sz*.22);
          c.strokeStyle="rgba(150,80,255,0.5)";c.lineWidth=1;
          c.strokeRect(ex+sz*.18,ey+sz*.32,sz*.64,sz*.22);
          // Shoulder plates
          c.fillStyle="#1a0828";c.beginPath();c.ellipse(ex+sz*.18,ey+sz*.35,sz*.1,sz*.07,0,0,Math.PI*2);c.fill();
          c.beginPath();c.ellipse(ex+sz*.82,ey+sz*.35,sz*.1,sz*.07,0,0,Math.PI*2);c.fill();}
        // Spectral eyes — slitted purple
        if(!fl){c.fillStyle=charging?"#f4f":"#a060ff";
          c.beginPath();c.ellipse(ex+sz*.37,ey+sz*.18,3,1.5,0,0,Math.PI*2);c.fill();
          c.beginPath();c.ellipse(ex+sz*.63,ey+sz*.18,3,1.5,0,0,Math.PI*2);c.fill();
          c.fillStyle=`rgba(${charging?'255,100,255':'160,100,255'},0.3)`;
          c.beginPath();c.arc(ex+sz*.37,ey+sz*.18,5,0,Math.PI*2);c.fill();
          c.beginPath();c.arc(ex+sz*.63,ey+sz*.18,5,0,Math.PI*2);c.fill();}
        // Shadow wisps
        if(!fl){c.strokeStyle="rgba(80,40,140,0.3)";c.lineWidth=2;
          for(let i=0;i<3;i++){const wa=t/600+i*2,wr=sz*0.35;
            c.beginPath();c.moveTo(ex+sz/2+Math.cos(wa)*wr*0.3,ey+sz*.6);
            c.quadraticCurveTo(ex+sz/2+Math.cos(wa)*wr,ey+sz*.7+Math.sin(wa)*5,ex+sz/2+Math.cos(wa+0.5)*wr*0.6,ey+sz*.85);c.stroke();}}
      }
      // HP bar (all minibosses — hidden when burrowed)
      if(!e.burrowed){const hbw=sz+6,hbx=ex-3,hby=ey-8;c.fillStyle="#000";c.fillRect(hbx,hby,hbw,4);
      const hpCol=mn==="Vine Guardian"?"#4c4":mn==="Flame Sentinel"?"#f80":"#a060ff";
      c.fillStyle=e.hp>e.mhp*0.3?hpCol:"#f22";c.fillRect(hbx+1,hby+1,Math.max(0,(hbw-2)*e.hp/e.mhp),2);}
    }
    else if(e.type==="bat"||e.type==="fire_bat")dBt(c,ex,ey,sz,fl,t,e.type==="fire_bat");
    else if(e.type==="archer")dAr(c,ex,ey,sz,fl,t);
    else if(e.type==="mage")dMg(c,ex,ey,sz,fl,t);
    else if(e.type==="knight")dKn(c,ex,ey,sz,fl,t);
    else if(e.type==="magma_slug")dMs(c,ex,ey,sz,fl,t);
    else if(e.type==="wallmaster")dWm(c,ex,ey,sz,fl,t);
    else if(e.type==="vine_creeper")dVc(c,ex,ey,sz,fl,t);
    else if(e.type==="stalfos")dSf(c,ex,ey,sz,fl,t);
    else if(e.type==="yeti")dYt(c,ex,ey,sz,fl,t);
    else if(e.type==="blob")dBl(c,ex,ey,sz,fl,t);
    else if(e.type==="shimmer_ghoul")dSg(c,ex,ey,sz,fl,t);
    else dSk(c,ex,ey,sz,fl,t);}
  // Draw push block slide animation
  if(s.pushAnim){const pa=s.pushAnim,pr=Math.min(1,pa.t/pa.dur);
    const isOW=!pa.isDg&&!iD;
    // Easing: heavy slow-start for overworld boulders, simple ease-out for dungeon blocks
    const ep=isOW?(pr<0.15?pr*pr*22.2:pr<0.85?0.05+(pr-0.15)*1.285:1-Math.pow(1-pr,3)*2.96):(1-Math.pow(1-pr,2));
    const ax=pa.fx+(pa.tx-pa.fx)*ep,ay=pa.fy+(pa.ty-pa.fy)*ep;
    // Screen rumble — overworld only (dungeon push is too fast)
    if(isOW&&pr>0.05&&pr<0.9){const rum=(1-Math.abs(pr-0.5)*2)*1.5;
      c.save();c.translate((Math.random()-.5)*rum,(Math.random()-.5)*rum);}
    if(isOW){
      // Shadow stretches during movement
      const shadowStr=1+Math.sin(pr*Math.PI)*0.3;
      c.fillStyle="rgba(0,0,0,0.18)";c.beginPath();c.ellipse(ax+18,ay+24,12*shadowStr,4,0.1,0,Math.PI*2);c.fill();
      // Overworld boulder
      const prg2=c.createRadialGradient(ax+13,ay+11,3,ax+16,ay+16,15);
      prg2.addColorStop(0,"#aaa8a0");prg2.addColorStop(0.3,"#908880");prg2.addColorStop(0.6,"#787068");prg2.addColorStop(1,"#585048");
      c.fillStyle=prg2;c.beginPath();c.ellipse(ax+16,ay+15,14,11,0,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(255,255,255,0.2)";c.beginPath();c.ellipse(ax+11,ay+10,6,4,-.4,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(0,0,0,0.25)";c.beginPath();c.ellipse(ax+20,ay+20,8,5,0.2,0,Math.PI*2);c.fill();
      // Scrape marks on ground behind boulder
      if(pr>0.1&&pr<0.95){const sx2=pa.fx+(pa.tx-pa.fx)*(ep*0.6),sy2=pa.fy+(pa.ty-pa.fy)*(ep*0.6);
        c.strokeStyle="rgba(80,60,30,0.3)";c.lineWidth=2;c.beginPath();c.moveTo(pa.fx+16,pa.fy+22);c.lineTo(sx2+16,sy2+22);c.stroke();}
    }else{
      // Dungeon push block — clean slide, no shake
      const pbg2=c.createLinearGradient(ax,ay,ax+TL,ay+TL);pbg2.addColorStop(0,"#7a7a88");pbg2.addColorStop(1,"#5a5a68");
      c.fillStyle=pbg2;c.fillRect(ax+2,ay+2,TL-4,TL-4);
      c.fillStyle="rgba(255,255,255,0.15)";c.fillRect(ax+2,ay+2,TL-4,3);c.fillRect(ax+2,ay+2,3,TL-4);
      c.fillStyle="rgba(0,0,0,0.2)";c.fillRect(ax+2,ay+TL-5,TL-4,3);c.fillRect(ax+TL-5,ay+2,3,TL-4);
    }
    // Restore from screen rumble (overworld only)
    if(isOW&&pr>0.05&&pr<0.9)c.restore();
    // Dust particles while sliding
    if(pr>0.05&&pr<0.9){
      if(Math.random()<(isOW?0.7:0.3)){const dx2=pa.tx-pa.fx,dy2=pa.ty-pa.fy;
        s.pt.push({x:ax+16+(Math.random()-.5)*12,y:ay+TL-2+Math.random()*4,dx:(Math.random()-.5)*2-(dx2>0?0.5:dx2<0?-0.5:0),dy:-Math.random()*1.5-0.5,l:300+Math.random()*200,c:iD?"#888":"#a89060"});}
      if(isOW&&Math.random()<0.2){s.pt.push({x:ax+16+(Math.random()-.5)*8,y:ay+TL,dx:(Math.random()-.5)*3,dy:-Math.random()*2-1,l:400,c:"#887050"});}}
  }
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
  if(!iD){const npcs=NPC_DATA[loc.scr];if(npcs){for(let ni=0;ni<npcs.length;ni++){const npc=npcs[ni],ns2=s.npcState[ni];if(!ns2)continue;
    const nx=ns2.x,ny=ns2.y,ndir=ns2.dir,walking=ns2.st==="walk";
    const walkBob=walking?Math.sin(ns2.mt/120)*1.5:0;
    // Special: Ancient Tree NPC
    if(npc.name.includes("Tree")){
      const sway=Math.sin(t/1500)*1.5;
      // Trunk
      c.fillStyle="#5a3a18";c.fillRect(nx+10,ny+10,12,22);c.fillStyle="#4a2a10";c.fillRect(nx+12,ny+12,3,18);
      // Canopy
      c.fillStyle="#2a6a18";c.beginPath();c.arc(nx+16,ny+6+sway,14,0,Math.PI*2);c.fill();
      c.fillStyle="#3a8a28";c.beginPath();c.arc(nx+12,ny+4+sway,9,0,Math.PI*2);c.fill();
      c.fillStyle="#4aa038";c.beginPath();c.arc(nx+20,ny+3+sway,8,0,Math.PI*2);c.fill();
      // Eyes in trunk
      c.fillStyle="#fd3";c.beginPath();c.arc(nx+13,ny+18,2,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(nx+19,ny+18,2,0,Math.PI*2);c.fill();
      c.fillStyle="#000";c.beginPath();c.arc(nx+13,ny+18,1,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(nx+19,ny+18,1,0,Math.PI*2);c.fill();
      // Exclamation when near
      const pdist2=Math.hypot(p.x+PS/2-nx-16,p.y+PS/2-ny-16);
      if(pdist2<TL*3){const bob=Math.sin(t/300)*3;c.fillStyle="#fd3";c.font="bold 10px monospace";c.textAlign="center";c.fillText("!",nx+16,ny-10+bob);c.textAlign="left";}
      continue;}
    // Sign post
    if(npc.name==="Sign"){
      // Post
      c.fillStyle="#5a3a18";c.fillRect(nx+14,ny+12,4,20);
      // Sign board
      c.fillStyle="#8a6a30";c.fillRect(nx+4,ny+4,24,14);
      c.fillStyle="#a08040";c.fillRect(nx+5,ny+5,22,12);
      // Nails
      c.fillStyle="#888";c.fillRect(nx+6,ny+6,2,2);c.fillRect(nx+24,ny+6,2,2);
      // Text hint
      c.fillStyle="#543820";c.font="bold 5px monospace";c.textAlign="center";
      c.fillText("!",nx+16,ny+13);c.textAlign="left";
      // Exclamation when near
      const pdist3=Math.hypot(p.x+PS/2-nx-16,p.y+PS/2-ny-16);
      if(pdist3<TL*2.5){const bob=Math.sin(t/300)*3;c.fillStyle="#fd3";c.font="bold 12px monospace";c.textAlign="center";c.fillText("!",nx+16,ny-4+bob);c.textAlign="left";}
      continue;}
    // Dog
    if(npc.name==="Dog"){
      const run=walking?Math.sin(ns2.mt/80):0;const tailWag=Math.sin(ns2.mt/100)*0.6;
      const flip=ndir===3?-1:1;const cx=nx+16;
      // Shadow
      c.fillStyle="rgba(0,0,0,0.12)";c.beginPath();c.ellipse(cx,ny+28,8,2.5,0,0,Math.PI*2);c.fill();
      // Body
      c.fillStyle="#b08040";c.beginPath();c.ellipse(cx,ny+20,8,5,0,0,Math.PI*2);c.fill();
      // Belly
      c.fillStyle="#d0a860";c.beginPath();c.ellipse(cx,ny+22,5,3,0,0,Math.PI*2);c.fill();
      // Legs
      c.fillStyle="#956830";
      const legF=walking?run*3:0;
      c.fillRect(cx-6,ny+23+legF,2,5-legF*0.3);c.fillRect(cx-2,ny+23-legF,2,5+legF*0.3);
      c.fillRect(cx+2,ny+23+legF,2,5-legF*0.3);c.fillRect(cx+5,ny+23-legF,2,5+legF*0.3);
      // Head
      const hx2=ndir===1?5:ndir===3?-5:0,hy2=ndir===0?-3:ndir===2?2:0;
      c.fillStyle="#b08040";c.beginPath();c.arc(cx+hx2,ny+14+hy2,5,0,Math.PI*2);c.fill();
      // Snout
      c.fillStyle="#c89850";c.beginPath();c.ellipse(cx+hx2+(ndir===1?3:ndir===3?-3:0),ny+16+hy2+(ndir===0?-2:ndir===2?2:0),3,2,0,0,Math.PI*2);c.fill();
      // Nose
      c.fillStyle="#222";c.beginPath();c.arc(cx+hx2+(ndir===1?5:ndir===3?-5:0),ny+15+hy2+(ndir===0?-3:ndir===2?3:0),1.2,0,Math.PI*2);c.fill();
      // Eyes
      c.fillStyle="#222";
      if(ndir===0||ndir===2){c.beginPath();c.arc(cx+hx2-2,ny+13+hy2,1,0,Math.PI*2);c.fill();c.beginPath();c.arc(cx+hx2+2,ny+13+hy2,1,0,Math.PI*2);c.fill();}
      else{const ex=ndir===1?2:-2;c.beginPath();c.arc(cx+hx2+ex,ny+13+hy2,1.2,0,Math.PI*2);c.fill();}
      // Ears
      c.fillStyle="#8a5a20";
      if(ndir===1||ndir===0||ndir===2){c.beginPath();c.ellipse(cx+hx2-3,ny+11+hy2,2,4,-.3,0,Math.PI*2);c.fill();}
      if(ndir===3||ndir===0||ndir===2){c.beginPath();c.ellipse(cx+hx2+3,ny+11+hy2,2,4,.3,0,Math.PI*2);c.fill();}
      // Tail
      c.strokeStyle="#b08040";c.lineWidth=2;c.beginPath();
      const tx2=ndir===1?-7:ndir===3?7:flip*-6;
      c.moveTo(cx+tx2,ny+17);c.quadraticCurveTo(cx+tx2+Math.sin(tailWag)*4,ny+10,cx+tx2+Math.sin(tailWag)*6,ny+12);c.stroke();
      continue;}
    // Shadow
    c.fillStyle="rgba(0,0,0,0.15)";c.beginPath();c.ellipse(nx+16,ny+29,10,3,0,0,Math.PI*2);c.fill();
    // Body/robe
    const robe=npc.name.includes("Witch")?"#6a2a8a":npc.name.includes("Fire")?"#aa3322":npc.name.includes("Dark")?"#444":npc.name.includes("Fisher")?"#3366aa":npc.name.includes("Wanderer")?"#8a6a30":"#336633";
    c.fillStyle=robe;c.beginPath();c.moveTo(nx+8,ny+13);c.lineTo(nx+24,ny+13);c.lineTo(nx+26,ny+30);c.lineTo(nx+6,ny+30);c.fill();
    // Robe trim
    c.fillStyle="rgba(255,255,255,0.1)";c.fillRect(nx+7,ny+28,18,2);
    // Arms (swing when walking)
    const armSwing=walking?Math.sin(ns2.mt/150)*3:0;
    c.fillStyle=robe;
    c.fillRect(nx+4,ny+16+armSwing,4,8);c.fillRect(nx+24,ny+16-armSwing,4,8);
    // Head
    c.fillStyle="#f0c8a0";c.beginPath();c.arc(nx+16,ny+10+walkBob,7,0,Math.PI*2);c.fill();
    // Direction-based face
    const faceX=ndir===1?2:ndir===3?-2:0,faceY=ndir===0?-1:ndir===2?1:0;
    // Hair/hat per character type
    if(npc.name.includes("Sage")||npc.name.includes("Hermit")){
      c.fillStyle="#ccc";c.beginPath();c.arc(nx+16,ny+8+walkBob,8,Math.PI,0);c.fill();
      c.fillStyle="#aaa";c.fillRect(nx+11,ny+14+walkBob,10,3);// beard
    }else if(npc.name.includes("Witch")){
      c.fillStyle="#333";c.beginPath();c.moveTo(nx+9,ny+8+walkBob);c.lineTo(nx+16,ny-5+walkBob);c.lineTo(nx+23,ny+8+walkBob);c.fill();
      c.fillStyle="#6a2a8a";c.fillRect(nx+10,ny+7+walkBob,12,2);
    }else if(npc.name.includes("Fisher")){
      c.fillStyle="#2255aa";c.beginPath();c.arc(nx+16,ny+6+walkBob,8,Math.PI+0.2,-0.2);c.fill();
      // Fishing rod
      c.strokeStyle="#8a6a30";c.lineWidth=1.5;c.beginPath();c.moveTo(nx+22,ny+14);c.lineTo(nx+30,ny+4);c.stroke();
    }else if(npc.name.includes("Wanderer")){
      c.fillStyle="#6a4a20";c.beginPath();c.arc(nx+16,ny+6+walkBob,8,Math.PI+0.1,-0.1);c.fill();
      c.fillStyle="#8a6a30";c.fillRect(nx+10,ny+5+walkBob,12,3);// headband
    }else if(npc.name.includes("Sentinel")||npc.name.includes("Dark")){
      c.fillStyle="#555";c.beginPath();c.arc(nx+16,ny+6+walkBob,8,Math.PI,0);c.fill();
      c.fillStyle="#333";c.fillRect(nx+10,ny+5+walkBob,12,4);// helmet visor
    }else{// Guide / generic
      c.fillStyle="#2a6a18";c.beginPath();c.arc(nx+16,ny+6+walkBob,7,Math.PI+0.3,-0.3);c.fill();
      c.fillStyle="#3a8a28";c.fillRect(nx+11,ny+5+walkBob,10,3);// cap brim
    }
    // Eyes (face direction)
    c.fillStyle="#222";c.beginPath();c.arc(nx+13+faceX,ny+10+faceY+walkBob,1.5,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(nx+19+faceX,ny+10+faceY+walkBob,1.5,0,Math.PI*2);c.fill();
    // Exclamation mark -- only when player is nearby
    const pdist=Math.hypot(p.x+PS/2-nx-16,p.y+PS/2-ny-16);
    if(pdist<TL*3){const bob=Math.sin(t/300)*3;
      c.fillStyle="#fd3";c.font="bold 10px monospace";c.textAlign="center";
      c.fillText("!",nx+16,ny-6+bob+walkBob);c.textAlign="left";}
    // Feet animation when walking
    if(walking){const step=Math.sin(ns2.mt/120)>0;
      c.fillStyle="#654321";c.fillRect(nx+9+(step?1:-1),ny+29,5,2);c.fillRect(nx+17+(step?-1:1),ny+29,5,2);}
    }}}
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
  // Hookshot chain rendering
  if(s.hookshot){const hs=s.hookshot,sx=p.x+PS/2,sy=p.y+PS/2;
    // Chain line
    c.strokeStyle="#8a8a9a";c.lineWidth=2;c.beginPath();c.moveTo(sx,sy);c.lineTo(hs.tipX,hs.tipY);c.stroke();
    // Chain links
    const cd=Math.hypot(hs.tipX-sx,hs.tipY-sy),links=Math.floor(cd/8);
    for(let i=1;i<=links;i++){const t2=i/(links+1),lx=sx+(hs.tipX-sx)*t2,ly=sy+(hs.tipY-sy)*t2;
      c.fillStyle=i%2===0?"#7a7a8a":"#9a9aaa";c.beginPath();c.arc(lx,ly,1.5,0,Math.PI*2);c.fill();}
    // Hook tip
    const ha=Math.atan2(hs.dy,hs.dx);c.save();c.translate(hs.tipX,hs.tipY);c.rotate(ha);
    c.fillStyle="#ccc";c.beginPath();c.moveTo(6,0);c.lineTo(0,-4);c.lineTo(2,0);c.lineTo(0,4);c.closePath();c.fill();
    c.fillStyle="rgba(255,255,255,0.3)";c.beginPath();c.arc(2,-1,2,0,Math.PI*2);c.fill();
    c.restore();}
  // Draw active bombs
  for(const ab of s.activeBombs){const prog=ab.t/ab.fuse;
    if(!ab.exploded){
      // Bomb body -- grows slightly as fuse burns
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
      // Lid opening -- rotates up
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
      else if(ch.reward==="rupee_blue"||ch.reward==="rupee_green"){const rc=ch.reward==="rupee_blue"?"#44f":"#4f4";
        c.fillStyle=rc;c.beginPath();c.moveTo(rix,riy-6+bob3);c.lineTo(rix+4,riy-2+bob3);c.lineTo(rix+4,riy+2+bob3);c.lineTo(rix,riy+6+bob3);c.lineTo(rix-4,riy+2+bob3);c.lineTo(rix-4,riy-2+bob3);c.closePath();c.fill();
        c.fillStyle="#fff";c.globalAlpha=0.3;c.beginPath();c.moveTo(rix,riy-4+bob3);c.lineTo(rix+3,riy-1+bob3);c.lineTo(rix,riy+bob3);c.lineTo(rix-3,riy-1+bob3);c.closePath();c.fill();c.globalAlpha=1;}
      else if(ch.reward==="bow"){// Bow icon
        c.strokeStyle="#8B5A2B";c.lineWidth=2;c.beginPath();c.arc(rix-2,riy+bob3,7,-Math.PI*0.4,Math.PI*0.4);c.stroke();
        c.strokeStyle="#ddd";c.lineWidth=1;c.beginPath();c.moveTo(rix-2+Math.cos(-Math.PI*0.4)*7,riy+bob3+Math.sin(-Math.PI*0.4)*7);c.lineTo(rix-2+Math.cos(Math.PI*0.4)*7,riy+bob3+Math.sin(Math.PI*0.4)*7);c.stroke();
        c.strokeStyle="#a06820";c.lineWidth=1.5;c.beginPath();c.moveTo(rix-4,riy+bob3);c.lineTo(rix+8,riy+bob3);c.stroke();}
      else if(ch.reward==="bomb_bag"){// Bomb bag icon
        c.fillStyle="#8B6B3A";c.beginPath();c.moveTo(rix-5,riy-1+bob3);c.lineTo(rix-6,riy+7+bob3);c.lineTo(rix+6,riy+7+bob3);c.lineTo(rix+5,riy-1+bob3);c.fill();
        c.fillStyle="#333";c.beginPath();c.arc(rix,riy+3+bob3,4,0,Math.PI*2);c.fill();}
      else if(ch.reward==="master_sword"){// Sword icon
        c.fillStyle="#c0d8ff";c.beginPath();c.moveTo(rix,riy-8+bob3);c.lineTo(rix-2,riy+3+bob3);c.lineTo(rix+2,riy+3+bob3);c.fill();
        c.fillStyle="#fd3";c.fillRect(rix-5,riy+2+bob3,10,2);c.fillStyle="#6a4a2a";c.fillRect(rix-1,riy+4+bob3,2,4);}
      else if(ch.reward==="master_key"){// Ornate key icon
        c.fillStyle="#c070ff";c.beginPath();c.arc(rix,riy-3+bob3,4,0,Math.PI*2);c.fill();
        c.fillStyle="#a050dd";c.fillRect(rix-1,riy+1+bob3,2,8);
        c.fillRect(rix,riy+5+bob3,4,2);c.fillRect(rix,riy+7+bob3,3,2);}
      else if(ch.reward==="compass"){// Compass icon
        c.fillStyle="#d8a840";c.beginPath();c.arc(rix,riy+bob3,6,0,Math.PI*2);c.fill();
        c.fillStyle="#f0ead8";c.beginPath();c.arc(rix,riy+bob3,4.5,0,Math.PI*2);c.fill();
        const cna=t/400;c.strokeStyle="#cc2222";c.lineWidth=1.2;
        c.beginPath();c.moveTo(rix,riy+bob3);c.lineTo(rix+Math.cos(cna-Math.PI/2)*4,riy+bob3+Math.sin(cna-Math.PI/2)*4);c.stroke();
        c.fillStyle="#333";c.beginPath();c.arc(rix,riy+bob3,1,0,Math.PI*2);c.fill();}
      else{c.fillStyle="#fd3";c.beginPath();c.arc(rix,riy+bob3,6,0,Math.PI*2);c.fill();}
    }else{
      // Open chest (empty)
      c.fillStyle="rgba(0,0,0,0.2)";c.beginPath();c.ellipse(cx2+12,cy2+24,14,4,0,0,Math.PI*2);c.fill();
      c.fillStyle="#7A4A1B";c.fillRect(cx2,cy2+8,24,16);
      c.fillStyle="#5B2A0B";c.fillRect(cx2+2,cy2+10,20,12);
      c.fillStyle="#8A582C";c.fillRect(cx2-1,cy2-2,26,6);
      c.fillStyle="#cc9922";c.fillRect(cx2+10,cy2+12,4,6);}}
  // Boss warp portal rendering
  if(s.bossWarp&&s.bossWarp.ready){const wx=s.bossWarp.x*TL+16,wy=s.bossWarp.y*TL+16;
    const pulse=Math.sin(s.gt/200)*0.2+0.8;const spin=s.gt/500;
    // Outer glow
    const wg=c.createRadialGradient(wx,wy,4,wx,wy,20);
    wg.addColorStop(0,`rgba(100,180,255,${0.5*pulse})`);wg.addColorStop(0.5,`rgba(60,120,255,${0.3*pulse})`);wg.addColorStop(1,"rgba(40,60,200,0)");
    c.fillStyle=wg;c.beginPath();c.arc(wx,wy,20,0,Math.PI*2);c.fill();
    // Swirling ring
    c.strokeStyle=`rgba(150,200,255,${0.7*pulse})`;c.lineWidth=2;
    c.beginPath();c.arc(wx,wy,10+Math.sin(s.gt/300)*2,spin,spin+Math.PI*1.5);c.stroke();
    c.strokeStyle=`rgba(200,230,255,${0.5*pulse})`;c.lineWidth=1.5;
    c.beginPath();c.arc(wx,wy,6+Math.sin(s.gt/250)*2,spin+Math.PI,spin+Math.PI*2.5);c.stroke();
    // Center bright core
    c.fillStyle=`rgba(220,240,255,${0.6*pulse})`;c.beginPath();c.arc(wx,wy,4,0,Math.PI*2);c.fill();
    c.fillStyle=`rgba(255,255,255,${0.8*pulse})`;c.beginPath();c.arc(wx,wy,2,0,Math.PI*2);c.fill();
    // Sparkle particles around portal
    for(let i=0;i<4;i++){const a=spin*2+i*Math.PI/2,r=12+Math.sin(s.gt/200+i)*4;
      c.fillStyle=`rgba(200,230,255,${0.5*pulse})`;c.beginPath();c.arc(wx+Math.cos(a)*r,wy+Math.sin(a)*r,1.5,0,Math.PI*2);c.fill();}
  }
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
    else if(d2.type==="rupee_green"||d2.type==="rupee_blue"||d2.type==="rupee_purple"||d2.type==="rupee_red"){
      const rc=d2.type==="rupee_green"?"#4f4":d2.type==="rupee_blue"?"#44f":d2.type==="rupee_purple"?"#a4f":"#f44";
      const rg=Math.sin(t/200)*0.2+0.3;c.fillStyle=rc.replace("4","8").replace("f","a");c.globalAlpha=rg;c.beginPath();c.arc(d2.x,d2.y+bob2,8,0,Math.PI*2);c.fill();c.globalAlpha=1;
      // Zelda hexagonal rupee shape
      const rx=d2.x,ry=d2.y+bob2;
      c.fillStyle=rc;c.beginPath();c.moveTo(rx,ry-6);c.lineTo(rx+4,ry-2);c.lineTo(rx+4,ry+2);c.lineTo(rx,ry+6);c.lineTo(rx-4,ry+2);c.lineTo(rx-4,ry-2);c.closePath();c.fill();
      c.fillStyle="#fff";c.globalAlpha=0.35;c.beginPath();c.moveTo(rx,ry-5);c.lineTo(rx+3,ry-2);c.lineTo(rx,ry);c.lineTo(rx-3,ry-2);c.closePath();c.fill();c.globalAlpha=1;}
    else if(d2.type==="master_key"){// Purple key
      const ky2=d2.y+bob2;c.fillStyle=`rgba(192,112,255,${0.2+Math.sin(t/200)*0.1})`;c.beginPath();c.arc(d2.x,ky2,10,0,Math.PI*2);c.fill();
      c.fillStyle="#c070ff";c.beginPath();c.arc(d2.x,ky2-3,4,0,Math.PI*2);c.fill();
      c.fillRect(d2.x-1,ky2+1,2,7);c.fillRect(d2.x,ky2+5,3,2);c.fillRect(d2.x,ky2+7,2,1.5);}
    else if(d2.type==="bow"){// Bow icon
      const by2=d2.y+bob2;c.fillStyle=`rgba(253,211,51,${0.2+Math.sin(t/200)*0.1})`;c.beginPath();c.arc(d2.x,by2,10,0,Math.PI*2);c.fill();
      c.strokeStyle="#8B5A2B";c.lineWidth=2;c.beginPath();c.arc(d2.x-2,by2,7,-Math.PI*0.4,Math.PI*0.4);c.stroke();
      c.strokeStyle="#ddd";c.lineWidth=1;c.beginPath();c.moveTo(d2.x-2+Math.cos(-Math.PI*0.4)*7,by2+Math.sin(-Math.PI*0.4)*7);c.lineTo(d2.x-2+Math.cos(Math.PI*0.4)*7,by2+Math.sin(Math.PI*0.4)*7);c.stroke();
      c.strokeStyle="#a06820";c.lineWidth=1.5;c.beginPath();c.moveTo(d2.x-4,by2);c.lineTo(d2.x+8,by2);c.stroke();}
    else if(d2.type==="bomb_bag"){// Brown bag
      const bg2=d2.y+bob2;c.fillStyle=`rgba(100,100,255,${0.15+Math.sin(t/200)*0.08})`;c.beginPath();c.arc(d2.x,bg2,10,0,Math.PI*2);c.fill();
      c.fillStyle="#8B6B3A";c.beginPath();c.moveTo(d2.x-5,bg2-1);c.lineTo(d2.x-6,bg2+7);c.lineTo(d2.x+6,bg2+7);c.lineTo(d2.x+5,bg2-1);c.fill();
      c.fillStyle="#333";c.beginPath();c.arc(d2.x,bg2+3,4,0,Math.PI*2);c.fill();}
    else if(d2.type==="master_sword"){// Blue blade
      const sy2=d2.y+bob2;c.fillStyle=`rgba(130,180,255,${0.2+Math.sin(t/200)*0.1})`;c.beginPath();c.arc(d2.x,sy2,10,0,Math.PI*2);c.fill();
      c.fillStyle="#c0d8ff";c.beginPath();c.moveTo(d2.x,sy2-8);c.lineTo(d2.x-2,sy2+3);c.lineTo(d2.x+2,sy2+3);c.fill();
      c.fillStyle="#fd3";c.fillRect(d2.x-5,sy2+2,10,2);c.fillStyle="#6a4a2a";c.fillRect(d2.x-1,sy2+4,2,4);}
    else if(d2.type==="compass"){// Compass drop
      const cy3=d2.y+bob2;c.fillStyle=`rgba(253,211,51,${0.2+Math.sin(t/200)*0.1})`;c.beginPath();c.arc(d2.x,cy3,10,0,Math.PI*2);c.fill();
      c.fillStyle="#d8a840";c.beginPath();c.arc(d2.x,cy3,6,0,Math.PI*2);c.fill();
      c.fillStyle="#f0ead8";c.beginPath();c.arc(d2.x,cy3,4.5,0,Math.PI*2);c.fill();
      const cna2=t/400;c.strokeStyle="#cc2222";c.lineWidth=1.2;
      c.beginPath();c.moveTo(d2.x,cy3);c.lineTo(d2.x+Math.cos(cna2-Math.PI/2)*4,cy3+Math.sin(cna2-Math.PI/2)*4);c.stroke();
      c.fillStyle="#333";c.beginPath();c.arc(d2.x,cy3,1,0,Math.PI*2);c.fill();}
    else if(d2.type==="key_drop"){// Falling key
      const ky3=d2.y+bob2;c.fillStyle=`rgba(253,211,51,${0.2+Math.sin(t/200)*0.1})`;c.beginPath();c.arc(d2.x,ky3,10,0,Math.PI*2);c.fill();
      c.fillStyle="#fd3";c.beginPath();c.arc(d2.x,ky3-3,4,0,Math.PI*2);c.fill();
      c.fillRect(d2.x-1,ky3+1,2,7);c.fillRect(d2.x,ky3+5,3,2);c.fillRect(d2.x,ky3+7,2,1.5);}
    else if(d2.type==="banana"){// Golden banana
      const bn2=d2.y+bob2;c.fillStyle=`rgba(253,211,51,${0.2+Math.sin(t/200)*0.1})`;c.beginPath();c.arc(d2.x,bn2,10,0,Math.PI*2);c.fill();
      c.strokeStyle="#ffd633";c.lineWidth=3;c.lineCap="round";c.beginPath();c.arc(d2.x,bn2+3,6,-Math.PI*0.8,-Math.PI*0.15);c.stroke();c.lineCap="butt";}
    else if(d2.type==="heartpiece_drop"){// Heart piece from dog
      const hpx=d2.x,hpy=d2.y+bob2;c.fillStyle="#ff3366";c.beginPath();c.moveTo(hpx,hpy+4);c.lineTo(hpx-5,hpy-2);c.arc(hpx-3,hpy-4,3,Math.PI,0);c.arc(hpx+3,hpy-4,3,Math.PI,0);c.lineTo(hpx+5,hpy-2);c.closePath();c.fill();
      c.fillStyle=`rgba(255,51,102,${0.3+Math.sin(t/200)*0.15})`;c.beginPath();c.arc(hpx,hpy-2,8,0,Math.PI*2);c.fill();}
    else if(d2.type==="bone"){// Bone drop
      const bx2=d2.x,by2=d2.y+bob2;
      c.fillStyle="#e8dcc8";c.fillRect(bx2-5,by2-1,10,3);c.beginPath();c.arc(bx2-5,by2,2.5,0,Math.PI*2);c.fill();c.beginPath();c.arc(bx2+5,by2,2.5,0,Math.PI*2);c.fill();}
    else{// Default -- render as green rupee
      const rx2=d2.x,ry2=d2.y+bob2;c.fillStyle="#4f4";c.beginPath();c.moveTo(rx2,ry2-5);c.lineTo(rx2+3,ry2-1);c.lineTo(rx2+3,ry2+1);c.lineTo(rx2,ry2+5);c.lineTo(rx2-3,ry2+1);c.lineTo(rx2-3,ry2-1);c.closePath();c.fill();}}
  if(s.death.a){const da=Math.min(1,s.death.t/1500);c.globalAlpha=1-da;
    c.save();c.translate(p.x+PS/2,p.y+PS/2);c.rotate(s.death.spin);c.translate(-PS/2,-PS/2);
    dP(c,0,0,p.dir,t,s.p.redArmor);c.restore();c.globalAlpha=1;
  }else if(s.triforceHold){// Holding triforce above head
    const th2=s.triforceHold,hp2=Math.min(1,th2.t/500);
    const hx=th2.px,hy=th2.py;
    // Screen flash on pickup
    if(th2.t<300){const fa=1-th2.t/300;c.fillStyle=`rgba(253,211,51,${fa*0.4})`;c.fillRect(0,0,W2,H2);}
    // Radial glow behind player
    const rg=c.createRadialGradient(hx+PS/2,hy+PS/2,5,hx+PS/2,hy+PS/2,60+Math.sin(t/200)*10);
    rg.addColorStop(0,`rgba(253,211,51,${0.15+Math.sin(t/150)*0.05})`);rg.addColorStop(1,"rgba(253,211,51,0)");
    c.fillStyle=rg;c.fillRect(hx-50,hy-50,PS+100,PS+100);
    // Draw player with arms raised
    const bob=0;
    // Shadow
    c.fillStyle="rgba(0,0,0,0.2)";c.beginPath();c.ellipse(hx+12,hy+23,8,3,0,0,Math.PI*2);c.fill();
    // Boots
    c.fillStyle="#6a3a18";c.beginPath();c.arc(hx+7,hy+22,3,0,Math.PI*2);c.fill();c.beginPath();c.arc(hx+17,hy+22,3,0,Math.PI*2);c.fill();
    // Legs
    c.fillStyle="#c8b080";c.fillRect(hx+6,hy+17,4,5);c.fillRect(hx+14,hy+17,4,5);
    // Tunic
    const bg=c.createLinearGradient(hx+4,hy+8,hx+20,hy+18);bg.addColorStop(0,"#48aa48");bg.addColorStop(1,"#2a7a2a");
    c.fillStyle=bg;c.beginPath();c.moveTo(hx+5,hy+9);c.lineTo(hx+19,hy+9);c.lineTo(hx+20,hy+18);c.lineTo(hx+4,hy+18);c.closePath();c.fill();
    // Belt
    c.fillStyle="#8a6a2a";c.fillRect(hx+4,hy+15,16,2);c.fillStyle="#d4b040";c.fillRect(hx+10,hy+15,4,2);
    // Arms raised up
    const armRaise=hp2*12;
    c.fillStyle="#48aa48";c.fillRect(hx+1,hy+5-armRaise,4,8);c.fillRect(hx+19,hy+5-armRaise,4,8);
    c.fillStyle="#f0c8a0";c.beginPath();c.arc(hx+3,hy+4-armRaise,2.5,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(hx+21,hy+4-armRaise,2.5,0,Math.PI*2);c.fill();
    // Head
    c.fillStyle="#f0c8a0";c.beginPath();c.arc(hx+12,hy+5,6,0,Math.PI*2);c.fill();
    // Hair
    c.fillStyle="#c8a030";c.beginPath();c.arc(hx+12,hy+3,6,Math.PI+0.3,Math.PI*2-0.3);c.fill();
    // Hat
    c.fillStyle="#48aa48";c.beginPath();c.moveTo(hx+6,hy+1);c.lineTo(hx+18,hy+1);c.lineTo(hx+22,hy-8);c.closePath();c.fill();
    // Eyes looking up
    c.fillStyle="#222";c.beginPath();c.arc(hx+10,hy+3,1,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(hx+14,hy+3,1,0,Math.PI*2);c.fill();
    // Triforce above head -- rises up then bobs
    const liftY=armRaise+8+Math.sin(t/200)*2;
    const tglow=Math.sin(t/150)*0.15+0.4;
    // Light column from triforce to sky
    const tx3=hx+PS/2,ty3=hy-liftY-6;
    c.fillStyle=`rgba(253,211,51,${0.08+Math.sin(t/200)*0.04})`;
    c.beginPath();c.moveTo(tx3-12,ty3);c.lineTo(tx3+12,ty3);c.lineTo(tx3+4,-10);c.lineTo(tx3-4,-10);c.fill();
    // Glow
    c.fillStyle=`rgba(253,211,51,${tglow})`;c.beginPath();c.arc(tx3,ty3,18,0,Math.PI*2);c.fill();
    // Triforce triangle
    c.fillStyle="#ffd633";c.beginPath();c.moveTo(tx3,ty3-10);c.lineTo(tx3+10,ty3+7);c.lineTo(tx3-10,ty3+7);c.closePath();c.fill();
    c.fillStyle="#ffe866";c.beginPath();c.moveTo(tx3,ty3-6);c.lineTo(tx3+5,ty3+4);c.lineTo(tx3-5,ty3+4);c.closePath();c.fill();
    // Sparkle particles around triforce
    for(let i=0;i<8;i++){const sa=t/400+i*Math.PI/4,sr=14+Math.sin(t/250+i)*4;
      const sx=tx3+Math.cos(sa)*sr,sy=ty3+Math.sin(sa)*sr;
      c.fillStyle=`rgba(255,255,200,${0.3+Math.sin(t/200+i)*0.2})`;c.beginPath();c.arc(sx,sy,1.5,0,Math.PI*2);c.fill();}
    // Golden glow intensifies when warp is ready
    if(th2.warp){const wp2=Math.min(1,(th2.t-2000)/500);
      c.fillStyle=`rgba(253,211,51,${wp2*0.08})`;c.fillRect(0,0,W2,H2);}
  }else if(s.itemGet){// Item-get pose: player frozen with arms raised, item floating overhead
    const ig=s.itemGet,igp=Math.min(1,ig.t/400);// arm-raise ramp
    const fadeOut=ig.t>ig.dur-300?(ig.dur-ig.t)/300:1;// fade out near end
    const hx=ig.px,hy=ig.py;
    // Vignette dim behind player to focus the moment
    const vg=c.createRadialGradient(hx+PS/2,hy+PS/2,40,hx+PS/2,hy+PS/2,Math.max(W2,H2));
    vg.addColorStop(0,"rgba(0,0,0,0)");vg.addColorStop(1,`rgba(0,0,0,${0.55*fadeOut})`);
    c.fillStyle=vg;c.fillRect(0,0,W2,H2);
    // Pickup flash
    if(ig.t<250){const fa=1-ig.t/250;c.fillStyle=`rgba(255,255,220,${fa*0.45})`;c.fillRect(0,0,W2,H2);}
    // Radial golden glow behind player
    const rg=c.createRadialGradient(hx+PS/2,hy+PS/2,5,hx+PS/2,hy+PS/2,55+Math.sin(t/200)*8);
    rg.addColorStop(0,`rgba(253,211,51,${(0.18+Math.sin(t/150)*0.05)*fadeOut})`);rg.addColorStop(1,"rgba(253,211,51,0)");
    c.fillStyle=rg;c.fillRect(hx-50,hy-50,PS+100,PS+100);
    // Player frozen, facing down, arms raised
    c.fillStyle="rgba(0,0,0,0.2)";c.beginPath();c.ellipse(hx+12,hy+23,8,3,0,0,Math.PI*2);c.fill();
    c.fillStyle="#6a3a18";c.beginPath();c.arc(hx+7,hy+22,3,0,Math.PI*2);c.fill();c.beginPath();c.arc(hx+17,hy+22,3,0,Math.PI*2);c.fill();
    c.fillStyle="#c8b080";c.fillRect(hx+6,hy+17,4,5);c.fillRect(hx+14,hy+17,4,5);
    const tL=p.redArmor?"#aa4848":"#48aa48",tD=p.redArmor?"#7a2a2a":"#2a7a2a";
    const hL=p.redArmor?"#9a2a2a":"#2a9a2a",hD=p.redArmor?"#7a1a1a":"#1a7a1a",hB=p.redArmor?"#882222":"#22882a";
    const igBg=c.createLinearGradient(hx+4,hy+8,hx+20,hy+18);igBg.addColorStop(0,tL);igBg.addColorStop(1,tD);
    c.fillStyle=igBg;c.beginPath();c.moveTo(hx+5,hy+9);c.lineTo(hx+19,hy+9);c.lineTo(hx+20,hy+18);c.lineTo(hx+4,hy+18);c.closePath();c.fill();
    c.fillStyle="#8a6a2a";c.fillRect(hx+4,hy+15,16,2);c.fillStyle="#d4b040";c.fillRect(hx+10,hy+15,4,2);
    const armRaise=igp*12;
    c.fillStyle=tL;c.fillRect(hx+1,hy+5-armRaise,4,8);c.fillRect(hx+19,hy+5-armRaise,4,8);
    c.fillStyle="#f0c8a0";c.beginPath();c.arc(hx+3,hy+4-armRaise,2.5,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(hx+21,hy+4-armRaise,2.5,0,Math.PI*2);c.fill();
    c.fillStyle="#f0c8a0";c.beginPath();c.arc(hx+12,hy+5,6,0,Math.PI*2);c.fill();
    c.fillStyle="#c8a030";c.beginPath();c.arc(hx+12,hy+3,6,Math.PI+0.3,Math.PI*2-0.3);c.fill();
    const igHg=c.createLinearGradient(hx+4,hy-4,hx+20,hy+3);igHg.addColorStop(0,hL);igHg.addColorStop(1,hD);
    c.fillStyle=igHg;c.beginPath();c.moveTo(hx+5,hy+2);c.lineTo(hx+12,hy-5);c.lineTo(hx+19,hy+2);c.closePath();c.fill();
    c.fillStyle=hB;c.beginPath();c.ellipse(hx+12,hy+2,8,2,0,0,Math.PI*2);c.fill();
    c.fillStyle="#222";c.beginPath();c.arc(hx+10,hy+4,1,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(hx+14,hy+4,1,0,Math.PI*2);c.fill();
    c.strokeStyle="#aa6644";c.lineWidth=0.7;c.beginPath();c.arc(hx+12,hy+8,2,0.2,Math.PI-0.2);c.stroke();
    // Item floating over head, with light column
    const liftY=armRaise+10+Math.sin(t/200)*1.8;
    const ix=hx+PS/2,iy=hy-liftY;
    c.fillStyle=`rgba(253,211,51,${(0.10+Math.sin(t/200)*0.04)*fadeOut})`;
    c.beginPath();c.moveTo(ix-12,hy);c.lineTo(ix+12,hy);c.lineTo(ix+5,iy-10);c.lineTo(ix-5,iy-10);c.fill();
    // Outer aura
    c.fillStyle=`rgba(253,211,51,${(0.35+Math.sin(t/150)*0.15)*fadeOut})`;c.beginPath();c.arc(ix,iy,14,0,Math.PI*2);c.fill();
    // Item icon (mirror chest reward switch)
    const bob=Math.sin(t/180)*1.5;const riy=iy+bob,rix=ix;
    if(ig.type==="bow"){
      c.strokeStyle="#8B5A2B";c.lineWidth=2;c.beginPath();c.arc(rix-2,riy,7,-Math.PI*0.4,Math.PI*0.4);c.stroke();
      c.strokeStyle="#ddd";c.lineWidth=1;c.beginPath();c.moveTo(rix-2+Math.cos(-Math.PI*0.4)*7,riy+Math.sin(-Math.PI*0.4)*7);c.lineTo(rix-2+Math.cos(Math.PI*0.4)*7,riy+Math.sin(Math.PI*0.4)*7);c.stroke();
      c.strokeStyle="#a06820";c.lineWidth=1.5;c.beginPath();c.moveTo(rix-4,riy);c.lineTo(rix+8,riy);c.stroke();
    }else if(ig.type==="bomb_bag"){
      c.fillStyle="#8B6B3A";c.beginPath();c.moveTo(rix-5,riy-1);c.lineTo(rix-6,riy+7);c.lineTo(rix+6,riy+7);c.lineTo(rix+5,riy-1);c.fill();
      c.fillStyle="#333";c.beginPath();c.arc(rix,riy+3,4,0,Math.PI*2);c.fill();
      c.fillStyle="#f80";c.beginPath();c.arc(rix+3,riy-2,1.5,0,Math.PI*2);c.fill();
    }else if(ig.type==="master_sword"){
      c.fillStyle="#c0d8ff";c.beginPath();c.moveTo(rix,riy-9);c.lineTo(rix-2,riy+4);c.lineTo(rix+2,riy+4);c.fill();
      c.fillStyle="#fd3";c.fillRect(rix-5,riy+3,10,2);c.fillStyle="#6a4a2a";c.fillRect(rix-1,riy+5,2,5);
      // Glow blade highlight
      c.fillStyle="rgba(255,255,255,0.5)";c.fillRect(rix-0.5,riy-8,1,12);
    }else if(ig.type==="master_key"){
      c.fillStyle="#c070ff";c.beginPath();c.arc(rix,riy-3,4,0,Math.PI*2);c.fill();
      c.fillStyle="#a050dd";c.fillRect(rix-1,riy+1,2,8);c.fillRect(rix,riy+5,4,2);c.fillRect(rix,riy+7,3,2);
    }else if(ig.type==="hookshot"){
      c.fillStyle="#aaa";c.fillRect(rix-2,riy-1,8,3);
      c.fillStyle="#444";c.fillRect(rix-5,riy-2,3,5);
      c.strokeStyle="#777";c.lineWidth=1;c.beginPath();c.moveTo(rix+6,riy);c.lineTo(rix-6,riy+1);c.lineTo(rix+6,riy+1);c.stroke();
      c.fillStyle="#0cc";c.beginPath();c.arc(rix+7,riy+0.5,1.8,0,Math.PI*2);c.fill();
    }else if(ig.type==="compass"){
      c.fillStyle="#d8a840";c.beginPath();c.arc(rix,riy,7,0,Math.PI*2);c.fill();
      c.fillStyle="#f0ead8";c.beginPath();c.arc(rix,riy,5.5,0,Math.PI*2);c.fill();
      const cna=t/350;c.strokeStyle="#cc2222";c.lineWidth=1.4;
      c.beginPath();c.moveTo(rix,riy);c.lineTo(rix+Math.cos(cna-Math.PI/2)*5,riy+Math.sin(cna-Math.PI/2)*5);c.stroke();
      c.fillStyle="#333";c.beginPath();c.arc(rix,riy,1.2,0,Math.PI*2);c.fill();
    }else if(ig.type==="banana"){
      c.fillStyle="#ffd633";c.beginPath();c.moveTo(rix-6,riy+2);c.quadraticCurveTo(rix,riy-8,rix+6,riy+2);c.quadraticCurveTo(rix,riy+5,rix-6,riy+2);c.fill();
      c.fillStyle="#a06820";c.fillRect(rix-7,riy+1,2,2);
    }else if(ig.type==="bone"){
      c.fillStyle="#e8dcc8";c.fillRect(rix-6,riy-1,12,3);
      c.beginPath();c.arc(rix-6,riy,3,0,Math.PI*2);c.fill();c.beginPath();c.arc(rix+6,riy,3,0,Math.PI*2);c.fill();
    }else if(ig.type==="jar"){
      c.fillStyle="rgba(140,200,240,0.85)";c.beginPath();c.moveTo(rix-4,riy-4);c.lineTo(rix+4,riy-4);c.lineTo(rix+5,riy+5);c.lineTo(rix-5,riy+5);c.fill();
      c.fillStyle="#aa8a3a";c.fillRect(rix-3,riy-5,6,2);
      c.fillStyle="rgba(255,255,255,0.4)";c.fillRect(rix-3,riy-2,1.5,5);
    }else if(ig.type==="heartcontainer"){
      c.fillStyle="#ee3333";dH(c,rix-7,riy-7,14);
      c.fillStyle="rgba(255,255,255,0.35)";c.fillRect(rix-4,riy-4,2,3);
    }else{
      c.fillStyle="#fd3";c.beginPath();c.arc(rix,riy,6,0,Math.PI*2);c.fill();}
    // Sparkle ring
    for(let i=0;i<8;i++){const sa=t/400+i*Math.PI/4,sr=14+Math.sin(t/250+i)*4;
      const sx=ix+Math.cos(sa)*sr,sy=iy+Math.sin(sa)*sr*0.85;
      c.fillStyle=`rgba(255,255,210,${(0.3+Math.sin(t/200+i)*0.2)*fadeOut})`;
      c.beginPath();c.arc(sx,sy,1.5,0,Math.PI*2);c.fill();}
    // Name banner near bottom of play area
    if(ig.t>250){const bp=Math.min(1,(ig.t-250)/300);
      const bx=W2/2,by=H2-66;
      c.fillStyle=`rgba(0,0,0,${0.65*bp*fadeOut})`;c.fillRect(0,by-2,W2,46);
      c.fillStyle=`rgba(253,211,51,${0.8*bp*fadeOut})`;c.fillRect(0,by-2,W2,1);c.fillRect(0,by+44,W2,1);
      c.textAlign="center";
      c.fillStyle=`rgba(255,236,160,${bp*fadeOut})`;c.font="bold 16px monospace";c.fillText(ig.name,bx,by+18);
      c.fillStyle=`rgba(230,230,230,${bp*fadeOut})`;c.font="10px monospace";c.fillText(ig.desc,bx,by+34);
      if(ig.t>1100){const pa=Math.sin(t/250)*0.3+0.55;
        c.fillStyle=`rgba(200,200,200,${pa*fadeOut})`;c.font="8px monospace";c.fillText("[SPACE] continue",bx,H2-8);}
      c.textAlign="left";}
  }else if(s.heroLand){// Hero descending from sky in pillar of light
    const hl=s.heroLand;
    const heroY=hl.landed?p.y:(hl.y!=null?hl.y:-40);
    const cx2=p.x+PS/2;
    // Distance and closeness to ground
    const distToGround=Math.max(0,p.y-heroY);const maxDist=p.y+40;
    const closeness=1-Math.min(1,distToGround/maxDist);
    // Shadow on ground — grows as hero descends
    const shadowW=3+closeness*10,shadowH=1+closeness*3;
    c.fillStyle=`rgba(0,0,0,${0.03+closeness*0.2})`;
    c.beginPath();c.ellipse(cx2+2,p.y+PS-1,shadowW,shadowH,0,0,Math.PI*2);c.fill();
    if(!hl.landed){
      // Pillar of light — wide beam from sky to hero
      const beamW=20+closeness*8;const beamA=0.25-closeness*0.15;
      const bg2=c.createLinearGradient(cx2,0,cx2,heroY+PS);
      bg2.addColorStop(0,`rgba(220,240,255,${beamA*0.3})`);
      bg2.addColorStop(0.5,`rgba(200,230,255,${beamA})`);
      bg2.addColorStop(1,`rgba(255,255,220,${beamA*0.6})`);
      c.fillStyle=bg2;c.beginPath();c.moveTo(cx2-beamW/2,0);c.lineTo(cx2+beamW/2,0);
      c.lineTo(cx2+10,heroY+PS);c.lineTo(cx2-10,heroY+PS);c.fill();
      // Inner bright core
      c.fillStyle=`rgba(255,255,240,${beamA*0.4})`;
      c.beginPath();c.moveTo(cx2-4,0);c.lineTo(cx2+4,0);c.lineTo(cx2+3,heroY+PS);c.lineTo(cx2-3,heroY+PS);c.fill();
      // Sparkle particles drifting down the beam
      for(let i=0;i<12;i++){const sy2=(t/3+i*35)%(heroY+PS+20)-10;
        const sx2=cx2+Math.sin(t/300+i*2.3)*(beamW*0.3);
        const sa2=0.3+Math.sin(t/200+i)*0.2;
        c.fillStyle=`rgba(255,255,200,${sa2})`;c.beginPath();c.arc(sx2,sy2,1+Math.sin(t/150+i)*0.5,0,Math.PI*2);c.fill();}
      // Ground glow where the beam meets the floor
      const gg=c.createRadialGradient(cx2,p.y+PS,0,cx2,p.y+PS,25+closeness*15);
      gg.addColorStop(0,`rgba(255,255,200,${0.15+closeness*0.1})`);gg.addColorStop(1,"rgba(255,255,200,0)");
      c.fillStyle=gg;c.fillRect(cx2-40,p.y+PS-20,80,40);
    }else{
      // Landing burst — flash and particles on touchdown
      if(hl.landT<300){const ba=1-hl.landT/300;
        const lg=c.createRadialGradient(cx2,p.y+PS/2,0,cx2,p.y+PS/2,40);
        lg.addColorStop(0,`rgba(255,255,200,${ba*0.3})`);lg.addColorStop(1,"rgba(255,255,200,0)");
        c.fillStyle=lg;c.fillRect(cx2-40,p.y+PS/2-40,80,80);}
    }
    // Small bounce on landing
    let drawY=heroY;
    if(hl.landed&&hl.landT<200){const bprog=hl.landT/200;drawY=p.y-Math.sin(bprog*Math.PI)*6;}
    dP(c,p.x,drawY,p.dir,t,p.redArmor);
  }else if(s.finalDeath){// Hero drawn by finalDeath overlay — skip normal draw
  }else if(s.pitFall&&s.pitFall.a){// Falling into pit -- shrink + spin
    const fp=Math.min(1,s.pitFall.t/600);const sc=1-fp*0.9;const spin=fp*Math.PI*3;
    const fx=s.pitFall.x+PS/2,fy=s.pitFall.y+PS/2;
    c.save();c.translate(fx,fy);c.rotate(spin);c.scale(sc,sc);c.globalAlpha=1-fp;
    dP(c,-PS/2,-PS/2,p.dir,t,p.redArmor);c.restore();
  }else if(s._heroHidden){// Hidden until descent begins
  }else{const vis=p.ifr<=0||Math.floor(p.ifr/80)%2;
    if(vis){
      const hopY=s.ledgeHop>0?-Math.sin(s.ledgeHop/250*Math.PI)*8:0;
      c.fillStyle="rgba(0,0,0,0.18)";c.beginPath();c.ellipse(p.x+PS/2+2,p.y+PS-1,10,3,0.08,0,Math.PI*2);c.fill();
      dP(c,p.x,p.y+hopY,p.dir,t,p.redArmor);
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
  if(p.snare>0){// Vine tendrils wrapped around hero
    const sa=Math.min(1,p.snare/600)*0.6;
    c.strokeStyle=`rgba(60,120,20,${sa})`;c.lineWidth=2;
    for(let i=0;i<5;i++){const va=t/400+i*Math.PI*2/5,vr=6+Math.sin(t/300+i)*2;
      c.beginPath();c.moveTo(p.x+PS/2+Math.cos(va)*3,p.y+PS-2);
      c.quadraticCurveTo(p.x+PS/2+Math.cos(va+0.5)*vr,p.y+PS/2+Math.sin(va)*4,p.x+PS/2+Math.cos(va)*2,p.y+4);c.stroke();}
    c.fillStyle=`rgba(40,100,15,${sa*0.4})`;c.beginPath();c.arc(p.x+PS/2,p.y+PS/2,PS*0.5,0,Math.PI*2);c.fill();}
  if(s.sw.a)dSw(c,p.x,p.y,p.dir,s.sw.t);
  for(const pt of s.pt){const pa=Math.min(1,pt.l/500);c.globalAlpha=pa;
    const psz=1+pt.l/800;
    c.fillStyle=pt.c;c.globalAlpha=pa*0.3;c.beginPath();c.arc(pt.x,pt.y,psz*2.5,0,Math.PI*2);c.fill();
    c.globalAlpha=pa;c.beginPath();c.arc(pt.x,pt.y,psz,0,Math.PI*2);c.fill();
    c.fillStyle="#fff";c.globalAlpha=pa*0.5;c.beginPath();c.arc(pt.x,pt.y,psz*0.4,0,Math.PI*2);c.fill();}c.globalAlpha=1;
  for(const dn of s.dmgNums){c.globalAlpha=Math.min(1,dn.t/300);c.fillStyle=dn.c;c.font="bold 12px monospace";c.textAlign="center";c.fillText(dn.val,dn.x,dn.y);c.textAlign="left";}c.globalAlpha=1;
  if(s.roomFlash>0){c.fillStyle=`rgba(255,255,200,${s.roomFlash/500*0.25})`;c.fillRect(0,0,W2,H2);}
  // Dungeon darkness -- dark until torches are lit
  // Only dark rooms flagged with dark:true in room data
  const isDarkRoom=(loc.ty==="dg"&&s.dg[loc.di]?.rooms[loc.scr]?.dark)||(loc.ty==="cave"&&CAVES[loc.di]?.rooms?.[loc.scr]?.dark);
  if(iD&&m&&isDarkRoom){let totalT2=0,litT2=0;
    for(let y=0;y<RO;y++)for(let x=0;x<CO;x++)if(m[y][x]===T.TORCH){totalT2++;if(s.litTorches.has(`${x},${y}`))litT2++;}
    if(totalT2>0){const darkPct=1-litT2/totalT2;
      // Lantern reduces overall darkness in dark rooms
      const darkness=darkPct*(s.hasLantern?0.35:0.55);
      if(darkness>0.01){
        // Draw darkness layer
        c.fillStyle=`rgba(0,0,0,${darkness})`;c.fillRect(0,0,W2,H2);
        // Cut light circles around player and lit torches
        c.save();c.globalCompositeOperation="destination-out";
        // Player light — lantern gives a wide warm glow
        const plr=(s.hasLantern?130:40)+litT2*8;const pg=c.createRadialGradient(p.x+PS/2,p.y+PS/2,0,p.x+PS/2,p.y+PS/2,plr);
        pg.addColorStop(0,`rgba(0,0,0,${darkness*0.9})`);pg.addColorStop(0.7,`rgba(0,0,0,${darkness*0.4})`);pg.addColorStop(1,"rgba(0,0,0,0)");
        c.fillStyle=pg;c.fillRect(p.x+PS/2-plr,p.y+PS/2-plr,plr*2,plr*2);
        // Lit torch lights
        for(let y=0;y<RO;y++)for(let x=0;x<CO;x++){if(m[y][x]===T.TORCH&&s.litTorches.has(`${x},${y}`)){
          const tx3=x*TL+16,ty3=y*TL+16,tr=80+Math.sin(t/200+x)*10;
          const tgg=c.createRadialGradient(tx3,ty3,0,tx3,ty3,tr);
          tgg.addColorStop(0,`rgba(0,0,0,${darkness})`);tgg.addColorStop(0.6,`rgba(0,0,0,${darkness*0.5})`);tgg.addColorStop(1,"rgba(0,0,0,0)");
          c.fillStyle=tgg;c.fillRect(tx3-tr,ty3-tr,tr*2,tr*2);}}
        c.restore();}}}
  // Sanctum darkness — overworld screen 3,2 shrouded after the Dark Sanctum rises
  if(!iD&&s.sanctumDark&&loc.ty==="ow"&&loc.scr==="3,2"){
    const sdAlpha=0.45;c.fillStyle=`rgba(10,0,20,${sdAlpha})`;c.fillRect(0,0,W2,H2);
    // Player glow so they can still see nearby
    c.save();c.globalCompositeOperation="destination-out";
    const plGlow=90;const pg2=c.createRadialGradient(p.x+PS/2,p.y+PS/2,0,p.x+PS/2,p.y+PS/2,plGlow);
    pg2.addColorStop(0,`rgba(0,0,0,${sdAlpha*0.8})`);pg2.addColorStop(0.6,`rgba(0,0,0,${sdAlpha*0.3})`);pg2.addColorStop(1,"rgba(0,0,0,0)");
    c.fillStyle=pg2;c.fillRect(p.x+PS/2-plGlow,p.y+PS/2-plGlow,plGlow*2,plGlow*2);
    // Eerie glow around the sanctum entrance
    const ecx2=7.5*TL,ecy2=5.5*TL,eGlow=60+Math.sin(t/800)*8;
    const eg=c.createRadialGradient(ecx2,ecy2,0,ecx2,ecy2,eGlow);
    eg.addColorStop(0,`rgba(0,0,0,${sdAlpha*0.5})`);eg.addColorStop(0.7,`rgba(0,0,0,${sdAlpha*0.15})`);eg.addColorStop(1,"rgba(0,0,0,0)");
    c.fillStyle=eg;c.fillRect(ecx2-eGlow,ecy2-eGlow,eGlow*2,eGlow*2);
    c.restore();}
  // --- Day/Night cycle tint ---
  // Full cycle: ~5 minutes real time. Phase: 0=noon, 0.5=midnight
  const nightAmount=getNightAmount(s.weather.timer);
  const isNight=nightAmount>0.3;
  if(!iD&&loc.scr!=="-1,2"){
    // Smooth continuous day/night tint — blends between warm day and cool night
    // Warm golden day tint (strongest at noon, fades as night approaches)
    const dayStr=(1-nightAmount);
    const dayAmb=dayStr*Math.sin(t/15000)*0.03;
    if(dayAmb>0){c.fillStyle=`rgba(255,200,100,${dayAmb})`;c.fillRect(0,0,W2,H2);}
    // Sunset/sunrise orange tint (peaks during transition)
    const sunsetStr=Math.sin(nightAmount*Math.PI)*0.08;// peaks at 0.5 nightAmount
    if(sunsetStr>0.01){c.fillStyle=`rgba(200,100,40,${sunsetStr})`;c.fillRect(0,0,W2,H2);}
    // Cool blue night tint (grows smoothly from 0 to full)
    if(nightAmount>0){c.fillStyle=`rgba(8,8,35,${nightAmount*0.55})`;c.fillRect(0,0,W2,H2);}
  }
  // --- Weather rendering (overworld only) ---
  if(!iD&&s.weather.type!=="clear"&&loc.scr!=="-1,2"){const w=s.weather;
    // Rain drops
    if(w.type==="rain"){
      c.strokeStyle="rgba(150,180,220,0.5)";c.lineWidth=1;
      for(const d of w.drops){c.beginPath();c.moveTo(d.x,d.y);c.lineTo(d.x+d.vx*2,d.y+d.vy*3);c.stroke();}
      // Splash particles when drops hit ground
      for(const d of w.drops){if(d.y>H2-8&&d.y<H2){
        c.fillStyle="rgba(150,190,230,0.3)";c.beginPath();c.arc(d.x,H2-2,1.5,0,Math.PI*2);c.fill();}}
      // Subtle rain ambient darkening
      c.fillStyle=`rgba(20,30,50,${0.06+nightAmount*0.04})`;c.fillRect(0,0,W2,H2);
    }
    // Snow flakes
    if(w.type==="snow"){
      for(const d of w.drops){const sz=d.sp||1.5;
        const sa=Math.min(1,Math.max(0.3,(H2-d.y)/H2+0.3));
        c.fillStyle=`rgba(230,240,255,${sa*0.7})`;c.beginPath();c.arc(d.x,d.y,sz,0,Math.PI*2);c.fill();
        // Subtle glow
        c.fillStyle=`rgba(200,220,255,${sa*0.15})`;c.beginPath();c.arc(d.x,d.y,sz*2.5,0,Math.PI*2);c.fill();}
      // Snow ground accumulation tint
      c.fillStyle="rgba(200,210,230,0.04)";c.fillRect(0,0,W2,H2);
    }
    // Fog — reduces visibility (built on offscreen canvas to avoid destination-out artifacts)
    if(w.fog>0.02){
      const isShadowBiome=loc.ty==="ow"&&getBiome(loc.scr)==="shadow_forest";
      const fogA=isShadowBiome?0.95:Math.min(0.92,w.fog*(1+nightAmount*0.5));
      const fogR=isShadowBiome?(s.hasLantern?90:24):(s.hasLantern?140:90);
      const fogCol=isShadowBiome?"15,8,30":"100,110,120";
      // Build fog with hole on offscreen canvas
      if(!s._fogCv){s._fogCv=document.createElement("canvas");s._fogCv.width=W2;s._fogCv.height=H2;}
      const fc=s._fogCv.getContext("2d");
      fc.clearRect(0,0,W2,H2);
      // Solid fog
      fc.fillStyle="rgba("+fogCol+","+fogA+")";fc.fillRect(0,0,W2,H2);
      // Feathered circular cutout — clear center, soft fade to dark
      fc.globalCompositeOperation="destination-out";
      const px2=p.x+PS/2,py2=p.y+PS/2;
      const fg=fc.createRadialGradient(px2,py2,0,px2,py2,fogR);
      fg.addColorStop(0,"rgba(0,0,0,1)");
      fg.addColorStop(0.5,"rgba(0,0,0,0.8)");
      fg.addColorStop(0.8,"rgba(0,0,0,0.3)");
      fg.addColorStop(1,"rgba(0,0,0,0)");
      fc.fillStyle=fg;fc.fillRect(px2-fogR,py2-fogR,fogR*2,fogR*2);
      fc.globalCompositeOperation="source-over";
      // Composite fog layer onto main canvas
      c.drawImage(s._fogCv,0,0);
      // Drifting nebulous fog blobs — slow, layered, shimmering
      const wispCount=isShadowBiome?10:5;
      for(let i=0;i<wispCount;i++){
        // Each blob drifts slowly with its own speed and wobble
        const spd=0.4+hs(i,50,600)*0.6;// varied drift speeds
        const fx=(t*spd/10+i*87+Math.sin(t/3000+i*1.7)*50)%(W2+200)-100;
        const fy=hs(i,51,601)*H2*0.9+Math.sin(t/2500+i*2.3)*30+H2*0.05;
        // Pulsing size — breathes in and out
        const breathe=Math.sin(t/1800+i*1.1)*0.3+1;
        const rx=(40+hs(i,52,602)*40)*breathe;
        const ry=(15+hs(i,53,603)*15)*breathe;
        // Shimmer: alpha oscillates slowly
        const shimmer=Math.sin(t/1200+i*2.7)*0.08;
        const baseA=isShadowBiome?fogA*0.35:fogA*0.2;
        const a=baseA+shimmer;
        // Layered rendering: soft outer halo + denser core
        const col=isShadowBiome?"50,30,80":"170,180,195";
        c.fillStyle=`rgba(${col},${a*0.4})`;
        c.beginPath();c.ellipse(fx,fy,rx*1.6,ry*1.6,Math.sin(t/4000+i)*0.3,0,Math.PI*2);c.fill();
        c.fillStyle=`rgba(${col},${a*0.7})`;
        c.beginPath();c.ellipse(fx+Math.sin(t/2200+i)*8,fy+Math.cos(t/2600+i)*5,rx,ry,Math.sin(t/3500+i*0.7)*0.2,0,Math.PI*2);c.fill();
        c.fillStyle=`rgba(${col},${a})`;
        c.beginPath();c.ellipse(fx+Math.sin(t/1900+i*1.3)*5,fy+Math.cos(t/2100+i*0.9)*3,rx*0.5,ry*0.5,0,0,Math.PI*2);c.fill();
        // Wispy tendrils trailing off the blob
        if(i%2===0){c.strokeStyle=`rgba(${col},${a*0.3})`;c.lineWidth=1.5;
          for(let j=0;j<3;j++){const ta=t/2000+i+j*2.1;
            c.beginPath();c.moveTo(fx+Math.cos(ta)*rx*0.4,fy+Math.sin(ta)*ry*0.4);
            c.quadraticCurveTo(fx+Math.cos(ta+0.5)*rx*1.2,fy+Math.sin(ta+0.5)*ry*1.8,
              fx+Math.cos(ta+1)*rx*0.8,fy+Math.sin(ta+1)*ry*2.2);c.stroke();}}
      }
    }
  }
  // Shadow forest — ALWAYS dark, independent of weather system
  if(!iD&&loc.ty==="ow"&&getBiome(loc.scr)==="shadow_forest"){
    const sfFogA=0.95;const sfR=s.hasLantern?90:24;
    if(!s._fogCv){s._fogCv=document.createElement("canvas");s._fogCv.width=W2;s._fogCv.height=H2;}
    const fc=s._fogCv.getContext("2d");
    fc.clearRect(0,0,W2,H2);
    fc.fillStyle="rgba(15,8,30,"+sfFogA+")";fc.fillRect(0,0,W2,H2);
    fc.globalCompositeOperation="destination-out";
    const px2=p.x+PS/2,py2=p.y+PS/2;
    const fg=fc.createRadialGradient(px2,py2,0,px2,py2,sfR);
    fg.addColorStop(0,"rgba(0,0,0,1)");fg.addColorStop(0.5,"rgba(0,0,0,0.8)");
    fg.addColorStop(0.8,"rgba(0,0,0,0.3)");fg.addColorStop(1,"rgba(0,0,0,0)");
    fc.fillStyle=fg;fc.fillRect(px2-sfR,py2-sfR,sfR*2,sfR*2);
    fc.globalCompositeOperation="source-over";
    c.drawImage(s._fogCv,0,0);
  }
  const vig=c.createRadialGradient(W2/2,H2/2,W2*0.3,W2/2,H2/2,W2*0.75);
  vig.addColorStop(0,"rgba(0,0,0,0)");vig.addColorStop(0.7,iD?"rgba(0,0,0,0.15)":"rgba(0,0,0,0)");vig.addColorStop(1,iD?"rgba(0,0,0,0.4)":"rgba(0,0,10,0.12)");
  c.fillStyle=vig;c.fillRect(0,0,W2,H2);
  if(iD){
    // Simple minimap -- always show when in dungeon or cave
    const dgRooms=dg&&dg.rooms?Object.keys(dg.rooms).filter(k=>{const p2=k.split(",");return p2.length===2&&!isNaN(+p2[0])&&!isNaN(+p2[1]);}):[];
    if(dgRooms.length>0){
      const cds=dgRooms.map(k=>k.split(",").map(Number));
      const nX=Math.min(...cds.map(c2=>c2[0])),xX=Math.max(...cds.map(c2=>c2[0])),nY=Math.min(...cds.map(c2=>c2[1])),xY=Math.max(...cds.map(c2=>c2[1]));
      const ms=12,mp=4,mW=(xX-nX+1)*ms+mp*2,mH=(xY-nY+1)*ms+mp*2;
      const mmX=W2-mW-4,mmY=4;
      c.globalAlpha=0.6;
      c.fillStyle="rgba(0,0,0,0.5)";c.fillRect(mmX-2,mmY-2,mW+4,mH+4);
      c.strokeStyle="rgba(253,211,51,0.5)";c.lineWidth=1;c.strokeRect(mmX-2,mmY-2,mW+4,mH+4);
      const hasCompass=loc.ty==="dg"&&s.p.compasses[loc.di];
      for(const rk of dgRooms){const[cx,cy]=rk.split(",").map(Number);
        const rx=mmX+mp+(cx-nX)*ms,ry=mmY+mp+(cy-nY)*ms;
        if(rk===loc.scr){c.fillStyle="#fd3";c.fillRect(rx+1,ry+1,ms-2,ms-2);}
        else{c.fillStyle="#335";c.fillRect(rx+1,ry+1,ms-2,ms-2);}
        c.strokeStyle="rgba(255,255,255,0.15)";c.lineWidth=1;c.strokeRect(rx+1,ry+1,ms-2,ms-2);
        if(hasCompass){const rmD=dg.rooms[rk];const cxI=rx+ms/2,cyI=ry+ms/2;
          const isBoss=rmD?.enemies?.some(e=>e.type==="boss");
          const isMK=rmD?.reward==="master_key";
          const isItem=rmD?.reward&&["bow","bomb_bag","master_sword","hookshot"].includes(rmD.reward);
          const hasKey=rmD?.tiles?.some(row=>row.includes(T.KEY));
          if(isBoss){c.fillStyle="#f44";c.beginPath();c.arc(cxI,cyI,2.5,0,Math.PI*2);c.fill();}
          else if(isMK){c.fillStyle="#c070ff";c.fillRect(cxI-1.5,cyI-1.5,3,3);}
          else if(isItem){c.fillStyle="#8cf";c.beginPath();c.arc(cxI,cyI,2,0,Math.PI*2);c.fill();}
          else if(hasKey){c.fillStyle="#fd3";c.fillRect(cxI-1,cyI-1,2,2);}}}
      c.globalAlpha=1;
    }}
  if(!iD){const owKeys=Object.keys(OW);const owC=owKeys.map(k=>k.split(",").map(Number));
    const onX=Math.min(...owC.map(c2=>c2[0])),oxX=Math.max(...owC.map(c2=>c2[0])),onY=Math.min(...owC.map(c2=>c2[1])),oxY=Math.max(...owC.map(c2=>c2[1]));
    const os=14,op=4,oW=(oxX-onX+1)*os+op*2,oH=(oxY-onY+1)*os+op*2,omX=W2-oW-8,omY=H2-oH-8;
    c.globalAlpha=0.8;
    c.fillStyle="rgba(0,0,0,0.65)";c.fillRect(omX-1,omY-1,oW+2,oH+2);c.strokeStyle="rgba(255,255,255,0.1)";c.strokeRect(omX-1,omY-1,oW+2,oH+2);
    for(const ok of owKeys){const[cx2,cy2]=ok.split(",").map(Number);
      let col="#3a5a2a";if(ok===loc.scr)col="#fd3";
      c.fillStyle=col;c.fillRect(omX+op+(cx2-onX)*os+1,omY+op+(cy2-onY)*os+1,os-2,os-2);
      for(const de2 of DE){if(de2.s===ok){c.fillStyle=ok===loc.scr?"#000":"#222";c.fillRect(omX+op+(cx2-onX)*os+os/2-2,omY+op+(cy2-onY)*os+os/2-2,4,4);}}}
    c.globalAlpha=1;
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
    const bx2=16,by2=H2-100,bw2=W2-32,bh2=92;const r3=6;
    c.fillStyle="rgba(0,0,20,0.92)";
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
    c.fillText(dlg.name,bx2+10,by2+14);
    // Typewriter through all text, word-wrapped
    c.fillStyle="#fff";c.font="11px monospace";
    const full=dlg.fullText||dlg.lines.join(" ");
    const shown=full.substring(0,dlg.charIdx);
    const maxW=bw2-20;const lineH=14;let curLine="",ly2=by2+30;
    const words=shown.split(" ");
    for(const w of words){const test=curLine?curLine+" "+w:w;
      if(c.measureText(test).width>maxW){c.fillText(curLine,bx2+10,ly2);ly2+=lineH;curLine=w;}
      else{curLine=test;}}
    if(curLine)c.fillText(curLine,bx2+10,ly2);
    // Blinking arrow when all text shown
    if(dlg.charIdx>=full.length){const blink2=Math.sin(t/300)>0;
      if(blink2){c.fillStyle="#fd3";c.font="bold 10px monospace";c.textAlign="center";c.fillText("\u25bc",bx2+bw2/2,by2+bh2-6);}}
    c.textAlign="left";}
  c.restore(); // end clip
  c.restore(); // end game area offset
  const FH2=H2+HH;
  // Dungeon title overlay -- fades in then out over 3 seconds
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
  // Boss intro cinematic overlay
  if(s.bossIntro){const bi=s.bossIntro,bp=bi.t/bi.dur;
    // Cinematic letterbox bars (slide in then out)
    const barH=bp<0.15?bp/0.15*40:bp>0.85?(1-(bp-0.85)/0.15)*40:40;
    c.fillStyle="#000";c.fillRect(0,0,W2,barH);c.fillRect(0,FH2-barH,W2,barH);
    // Darkened edges
    c.fillStyle=`rgba(0,0,0,${bp<0.1?bp/0.1*0.4:bp>0.8?(1-(bp-0.8)/0.2)*0.4:0.4})`;
    c.fillRect(0,0,W2,FH2);
    // Camera spotlight on boss -- bright circle
    if(bp>0.1&&bp<0.85){const sa=Math.min(1,(bp-0.1)/0.2);
      c.save();c.globalCompositeOperation="destination-out";
      const sr=60+sa*40;const sg=c.createRadialGradient(bi.bx,bi.by+HH,0,bi.bx,bi.by+HH,sr);
      sg.addColorStop(0,"rgba(0,0,0,0.4)");sg.addColorStop(0.7,"rgba(0,0,0,0.2)");sg.addColorStop(1,"rgba(0,0,0,0)");
      c.fillStyle=sg;c.fillRect(bi.bx-sr,bi.by+HH-sr,sr*2,sr*2);c.restore();}
    // Boss name text -- dramatic fade in
    if(bp>0.2&&bp<0.85){const ta=bp<0.35?(bp-0.2)/0.15:bp>0.7?(0.85-bp)/0.15:1;
      c.textAlign="center";c.globalAlpha=ta;
      // Name shadow
      c.fillStyle="#000";c.font="bold 22px monospace";
      c.fillText(bi.name.toUpperCase(),W2/2+2,FH2/2+2);
      // Name text
      c.fillStyle="#fd3";c.fillText(bi.name.toUpperCase(),W2/2,FH2/2);
      // Subtitle
      c.fillStyle="#c88";c.font="bold 11px monospace";
      c.fillText(bi.isMini?"- MINI-BOSS -":"- DUNGEON BOSS -",W2/2,FH2/2+18);
      // Decorative lines
      const lw2=c.measureText(bi.name.toUpperCase()).width+30;
      c.strokeStyle=`rgba(253,211,51,${ta*0.5})`;c.lineWidth=1;
      c.beginPath();c.moveTo(W2/2-lw2/2,FH2/2-12);c.lineTo(W2/2+lw2/2,FH2/2-12);c.stroke();
      c.beginPath();c.moveTo(W2/2-lw2/2,FH2/2+24);c.lineTo(W2/2+lw2/2,FH2/2+24);c.stroke();
      c.textAlign="left";c.globalAlpha=1;}
    // Screen shake on initial slam
    if(bi.t<200){const si=1-bi.t/200;c.save();c.translate((Math.random()-.5)*si*6,(Math.random()-.5)*si*6);c.restore();}}
  // Shop — draw shopkeeper behind counter and price tags on ground items
  if(s.shopGround){
    // Shopkeeper behind counter (drawn at tile 7-8, row 3)
    const skx=7*TL+16,sky=3*TL;
    // Shadow
    c.fillStyle="rgba(0,0,0,0.15)";c.beginPath();c.ellipse(skx,sky+29,10,3,0,0,Math.PI*2);c.fill();
    // Body/robe
    c.fillStyle="#8a5a2a";c.beginPath();c.moveTo(skx-8,sky+13);c.lineTo(skx+8,sky+13);c.lineTo(skx+10,sky+30);c.lineTo(skx-10,sky+30);c.fill();
    // Robe trim
    c.fillStyle="rgba(255,255,255,0.1)";c.fillRect(skx-9,sky+28,18,2);
    // Head
    c.fillStyle="#f0c8a0";c.beginPath();c.arc(skx,sky+10,7,0,Math.PI*2);c.fill();
    // Grey hair + beard (old man)
    c.fillStyle="#ccc";c.beginPath();c.arc(skx,sky+8,8,Math.PI,0);c.fill();
    c.fillStyle="#bbb";c.fillRect(skx-5,sky+14,10,4);// beard
    // Eyes (looking down at player)
    c.fillStyle="#222";c.beginPath();c.arc(skx-3,sky+11,1.5,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(skx+3,sky+11,1.5,0,Math.PI*2);c.fill();
    // "SHOP" sign above
    c.fillStyle="#fd3";c.font="bold 7px monospace";c.textAlign="center";c.fillText("SHOP",skx,sky-2);
    // Red Armor on display behind counter (if not yet purchased)
    if(!s.p.redArmor){const rax=9*TL,ray=3*TL;
      c.fillStyle="#992222";c.beginPath();c.moveTo(rax+5,ray+8);c.lineTo(rax+27,ray+8);c.lineTo(rax+27,ray+24);c.lineTo(rax+16,ray+30);c.lineTo(rax+5,ray+24);c.fill();
      c.fillStyle="#cc3333";c.fillRect(rax+9,ray+10,14,8);
      c.fillStyle="#fd3";c.beginPath();c.arc(rax+16,ray+22,2,0,Math.PI*2);c.fill();
      c.fillStyle="#aaa";c.font="bold 6px monospace";c.fillText("100r",rax+16,ray+6);}
    // Draw ground items with price tags
    for(const si of s.shopGround){
      if(si.collected)continue;
      const ix=si.tx*TL,iy=si.ty*TL,cx2=ix+16,cy2=iy+16;
      const bob=Math.sin(t/500+si.tx)*2;
      // Glow pedestal under item
      c.fillStyle="rgba(253,211,51,0.08)";c.beginPath();c.ellipse(cx2,iy+28,14,5,0,0,Math.PI*2);c.fill();
      // Draw item sprite based on name (larger, centered)
      if(si.name==="Key"){
        c.fillStyle="#fd3";c.fillRect(ix+9,iy+12+bob,6,5);c.fillRect(ix+14,iy+10+bob,6,9);
        c.fillStyle="#da0";c.fillRect(ix+9,iy+16+bob,4,5);c.fillRect(ix+9,iy+13+bob,3,3);
        c.fillStyle="rgba(255,255,255,0.4)";c.fillRect(ix+15,iy+11+bob,3,2);
      }else if(si.name.includes("Bomb")){
        c.fillStyle="#334";c.beginPath();c.arc(cx2,iy+20+bob,9,0,Math.PI*2);c.fill();
        c.fillStyle="#445";c.beginPath();c.arc(cx2-2,iy+18+bob,5,0,Math.PI*2);c.fill();
        c.fillStyle="#666";c.fillRect(ix+13,iy+8+bob,6,7);
        c.fillStyle="#f80";const ft=Math.sin(t/100)*0.5+1;c.beginPath();c.arc(cx2,iy+6+bob,2*ft,0,Math.PI*2);c.fill();
        c.fillStyle="#ff4";c.beginPath();c.arc(cx2,iy+6+bob,ft,0,Math.PI*2);c.fill();
      }else if(si.name==="Lantern"){
        c.fillStyle="#654321";c.fillRect(ix+13,iy+6+bob,6,14);
        c.fillStyle="#543210";c.fillRect(ix+11,iy+18+bob,10,4);
        const fg=c.createRadialGradient(cx2,iy+24+bob,1,cx2,iy+24+bob,8);
        fg.addColorStop(0,"#ff8");fg.addColorStop(0.4,"#fa0");fg.addColorStop(1,"rgba(255,160,0,0)");
        c.fillStyle=fg;c.beginPath();c.arc(cx2,iy+24+bob,8,0,Math.PI*2);c.fill();
      }else if(si.name.includes("Shield")){
        c.fillStyle="#3355bb";c.beginPath();c.moveTo(ix+5,iy+6+bob);c.lineTo(ix+27,iy+6+bob);c.lineTo(ix+27,iy+22+bob);c.lineTo(cx2,iy+29+bob);c.lineTo(ix+5,iy+22+bob);c.fill();
        c.fillStyle="#5577dd";c.beginPath();c.moveTo(ix+8,iy+9+bob);c.lineTo(ix+24,iy+9+bob);c.lineTo(ix+24,iy+20+bob);c.lineTo(cx2,iy+26+bob);c.lineTo(ix+8,iy+20+bob);c.fill();
        c.fillStyle="#fd3";c.beginPath();c.arc(cx2,iy+16+bob,4,0,Math.PI*2);c.fill();
        c.fillStyle="rgba(255,255,255,0.3)";c.fillRect(ix+8,iy+9+bob,6,3);
      }else if(si.name.includes("Red Armor")){
        c.fillStyle="#992222";c.beginPath();c.moveTo(ix+5,iy+8+bob);c.lineTo(ix+27,iy+8+bob);c.lineTo(ix+27,iy+24+bob);c.lineTo(cx2,iy+30+bob);c.lineTo(ix+5,iy+24+bob);c.fill();
        c.fillStyle="#cc3333";c.fillRect(ix+9,iy+10+bob,14,8);
        c.fillStyle="#fd3";c.beginPath();c.arc(cx2,iy+22+bob,3,0,Math.PI*2);c.fill();
        c.fillStyle="rgba(255,255,255,0.2)";c.fillRect(ix+9,iy+10+bob,5,3);
      }
      // Name label above item (larger font)
      c.font="bold 8px monospace";c.textAlign="center";
      c.fillStyle="#ddd";
      c.fillText(si.name,cx2,iy-4);
      // Price tag below item
      c.font="bold 9px monospace";
      c.fillStyle=s.p.rupees>=si.cost?"#4f4":"#f66";
      c.fillText(`${si.cost}r`,cx2,iy+TL+8);
    }
    c.textAlign="left";
  }
  // Sleeping shopkeeper at night (shop cave but closed)
  if(s._shopClosed&&!s.shopGround&&s.loc.ty==="cave"){
    const skx=7*TL+16,sky=3*TL;
    // Shadow
    c.fillStyle="rgba(0,0,0,0.15)";c.beginPath();c.ellipse(skx,sky+29,10,3,0,0,Math.PI*2);c.fill();
    // Body slumped on counter
    c.fillStyle="#8a5a2a";c.beginPath();c.moveTo(skx-8,sky+13);c.lineTo(skx+8,sky+13);c.lineTo(skx+10,sky+30);c.lineTo(skx-10,sky+30);c.fill();
    // Head — tilted/resting on counter
    c.fillStyle="#f0c8a0";c.beginPath();c.arc(skx+4,sky+14,7,0,Math.PI*2);c.fill();
    // Hair
    c.fillStyle="#ccc";c.beginPath();c.arc(skx+4,sky+12,8,Math.PI,0);c.fill();
    // Closed eyes (lines)
    c.strokeStyle="#222";c.lineWidth=1.5;
    c.beginPath();c.moveTo(skx,sky+15);c.lineTo(skx+4,sky+15);c.stroke();
    c.beginPath();c.moveTo(skx+5,sky+15);c.lineTo(skx+9,sky+15);c.stroke();
    // ZZZ floating
    const zb=Math.sin(t/400)*3;
    c.fillStyle="rgba(150,180,255,0.6)";c.font="bold 8px monospace";c.textAlign="center";
    c.fillText("z",skx+12,sky+4+zb);c.font="bold 10px monospace";c.fillText("Z",skx+18,sky-2+zb*0.7);c.font="bold 12px monospace";c.fillText("Z",skx+25,sky-8+zb*0.5);
    // "CLOSED" sign
    c.fillStyle="#a33";c.font="bold 7px monospace";c.fillText("CLOSED",skx,sky-2);
    c.textAlign="left";
  }
  // Sanctum reveal overlay
  if(s.sanctumReveal&&s.sanctumReveal.phase!=="wait"){const sr=s.sanctumReveal;
    const ecx=7.5*TL,ecy=5.5*TL;
    // Darken edges during rumble/crumble
    if(sr.phase==="rumble"||sr.phase==="crumble"){
      c.fillStyle=`rgba(20,0,30,${sr.phase==="crumble"?0.2:Math.min(0.15,sr.t/1500*0.15)})`;c.fillRect(0,0,W2,FH2);}
    // "The earth trembles..." text during rumble
    if(sr.phase==="rumble"&&sr.t>300){const ta=Math.min(1,(sr.t-300)/500);
      c.globalAlpha=ta;c.textAlign="center";c.fillStyle="#c080ff";c.font="bold 12px monospace";
      c.fillText("The earth trembles...",W2/2,H2*0.08);c.textAlign="left";c.globalAlpha=1;}
    // Crack lines radiating from center during crumble
    if(sr.phase==="crumble"){const cp=Math.min(1,sr.t/2000);
      c.strokeStyle=`rgba(180,80,220,${0.4*(1-cp*0.5)})`;c.lineWidth=1.5;
      for(let i=0;i<8;i++){const ca=i*Math.PI/4+sr.t/3000;const cl=cp*70;
        c.beginPath();c.moveTo(ecx,ecy);c.lineTo(ecx+Math.cos(ca)*cl,ecy+Math.sin(ca)*cl*0.5);c.stroke();}}
    // Dust clouds during crumble and settle
    if(sr.phase==="crumble"||sr.phase==="settle"){
      const da2=sr.phase==="settle"?1-sr.t/1500:Math.min(1,sr.t/500);
      if(da2>0){for(let i=0;i<4;i++){const dx2=ecx-TL+i*TL*0.7,dy2=ecy+TL+Math.sin(t/200+i)*3;
        c.fillStyle=`rgba(100,80,60,${da2*0.12})`;c.beginPath();c.arc(dx2+Math.sin(t/400+i*3)*5,dy2,8+da2*5,0,Math.PI*2);c.fill();}}}
    // Dark energy pulse when entrance revealed
    if(sr.phase==="settle"&&sr.t>200&&sr.t<1200){const pa2=Math.min(1,(sr.t-200)/800);
      c.strokeStyle=`rgba(150,50,200,${0.4*(1-pa2)})`;c.lineWidth=2;
      c.beginPath();c.arc(ecx,ecy,pa2*80,0,Math.PI*2);c.stroke();}}
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
    const ctrls=["WASD / Arrows \u2014 Move","Space \u2014 Attack","B \u2014 Bomb","C \u2014 Bow (1 rupee)","V \u2014 Hookshot","X / Shift \u2014 Shield","I / Tab \u2014 Map & Inventory","P / Esc \u2014 Pause","M \u2014 Toggle Music"];
    for(let i=0;i<ctrls.length;i++)c.fillText(ctrls[i],W2/2,cy2+30+i*13);
    c.textAlign="left";}
  if(s.mapOpen){drawInventoryScreen(c,s,t);}
  if(s.go){c.fillStyle="rgba(10,0,0,0.75)";c.fillRect(0,0,W2,FH2);c.fillStyle="#e33";c.font="bold 36px monospace";c.textAlign="center";c.fillText("GAME OVER",W2/2,FH2/2-20);c.fillStyle="#ccc";c.font="16px monospace";c.fillText("Tap to respawn",W2/2,FH2/2+25);c.textAlign="left";}
  // Final boss death cinematic overlay
  if(s.finalDeath){const fd=s.finalDeath,p2=s.p;
    // Darken screen edges (vignette)
    const vig=c.createRadialGradient(W2/2,H2/2,H2*0.2,W2/2,H2/2,H2*0.7);
    vig.addColorStop(0,"rgba(0,0,0,0)");vig.addColorStop(1,"rgba(0,0,0,0.6)");
    c.fillStyle=vig;c.fillRect(0,0,W2,FH2);
    // Boss — flashing and sinking
    if(fd.t<3000){
      const bAlpha=fd.t>2200?1-(fd.t-2200)/800:1;
      c.globalAlpha=bAlpha;
      // Flash between white and dark
      const fc=fd.flash>0.5?"rgba(255,255,255,0.7)":"rgba(150,0,150,0.5)";
      c.fillStyle=fc;c.beginPath();c.ellipse(fd.bx,fd.by+fd.fallY,14,12-fd.fallY*0.3,0,0,Math.PI*2);c.fill();
      // Burning red eyes fading
      if(fd.t<2200){c.fillStyle=`rgba(255,0,0,${bAlpha*0.8})`;
        c.beginPath();c.arc(fd.bx-5,fd.by-4+fd.fallY,2,0,Math.PI*2);c.fill();
        c.beginPath();c.arc(fd.bx+5,fd.by-4+fd.fallY,2,0,Math.PI*2);c.fill();}
      c.globalAlpha=1;
      // Disintegration particles
      if(fd.t>1800){const intensity=(fd.t-1800)/1200;
        if(Math.random()<intensity*0.6){s.pt.push({x:fd.bx+(Math.random()-.5)*24,y:fd.by+fd.fallY+(Math.random()-.5)*24,
          dx:(Math.random()-.5)*3,dy:-Math.random()*3-1,l:800,c:Math.random()>.5?"#f0f":"#fa0"});}}
    }
    // Hero raises sword in celebration — full body facing camera
    if(fd.heroRaise>0){const hx=p2.x+PS/2,hy=p2.y;
      const raise=fd.heroRaise;const red=p2.redArmor;
      const tL=red?"#aa4848":"#48aa48",tD=red?"#7a2a2a":"#2a7a2a";
      // Shadow
      c.fillStyle="rgba(0,0,0,0.2)";c.beginPath();c.ellipse(hx,hy+23,8,3,0,0,Math.PI*2);c.fill();
      // Boots
      c.fillStyle="#6a3a18";c.beginPath();c.arc(hx-5,hy+22,3,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(hx+5,hy+22,3,0,Math.PI*2);c.fill();
      // Legs
      c.fillStyle="#c8b080";c.fillRect(hx-6,hy+17,4,5);c.fillRect(hx+2,hy+17,4,5);
      // Tunic body
      const bg=c.createLinearGradient(hx-8,hy+8,hx+8,hy+18);bg.addColorStop(0,tL);bg.addColorStop(1,tD);
      c.fillStyle=bg;c.beginPath();c.moveTo(hx-7,hy+9);c.lineTo(hx+7,hy+9);c.lineTo(hx+8,hy+18);c.lineTo(hx-8,hy+18);c.closePath();c.fill();
      // Belt
      c.fillStyle="#8a6a2a";c.fillRect(hx-8,hy+15,16,2);c.fillStyle="#d4b040";c.fillRect(hx-2,hy+15,4,2);
      // Arms and sword — interpolate from resting at sides to raised straight up
      const armLen=10,handY=hy+10+armLen*(1-raise)-raise*20;// hand goes from hy+20 (side) to hy-10 (above head)
      const armTopY=hy+10;// shoulder stays fixed
      // Left arm + sword
      c.fillStyle=tL;c.fillRect(hx-6,Math.min(armTopY,handY),4,Math.abs(handY-armTopY));
      c.fillStyle="#f0c8a0";c.beginPath();c.arc(hx-4,handY,2.5,0,Math.PI*2);c.fill();
      // Sword pointing straight up from left hand
      const sLen=22;const swordTip=handY-sLen*raise;
      if(raise>0.1){
        c.strokeStyle=p2.hasMasterSword?"#88ccff":"#c0d8ff";c.lineWidth=3;c.lineCap="round";
        c.beginPath();c.moveTo(hx-4,handY);c.lineTo(hx-4,swordTip);c.stroke();
        // Blade shine
        c.strokeStyle="rgba(255,255,255,0.5)";c.lineWidth=1.5;
        c.beginPath();c.moveTo(hx-3.5,handY-2);c.lineTo(hx-3.5,swordTip+2);c.stroke();
        // Crossguard
        c.strokeStyle="#d4b040";c.lineWidth=2.5;
        c.beginPath();c.moveTo(hx-9,handY);c.lineTo(hx+1,handY);c.stroke();
        // Glow at tip
        const gl=Math.sin(t/200)*0.3+0.7;
        c.fillStyle=`rgba(200,220,255,${gl*0.6*raise})`;c.beginPath();c.arc(hx-4,swordTip,8*raise,0,Math.PI*2);c.fill();
        c.lineCap="butt";}
      // Right arm — raised fist
      c.fillStyle=tL;c.fillRect(hx+2,Math.min(armTopY,handY),4,Math.abs(handY-armTopY));
      c.fillStyle="#f0c8a0";c.beginPath();c.arc(hx+4,handY,2.5,0,Math.PI*2);c.fill();
      // Head
      c.fillStyle="#f0c8a0";c.beginPath();c.arc(hx,hy+5,6,0,Math.PI*2);c.fill();
      // Hair
      c.fillStyle="#c8a030";c.beginPath();c.arc(hx,hy+3,6,Math.PI+0.3,Math.PI*2-0.3);c.fill();
      c.fillRect(hx-7,hy+2,3,4);c.fillRect(hx+4,hy+2,3,4);
      // Hat
      c.fillStyle="#2a9a2a";c.beginPath();c.moveTo(hx-5,hy+1);c.lineTo(hx+2,hy-8);c.lineTo(hx+6,hy+2);c.fill();
      // Eyes — looking up triumphantly
      c.fillStyle="#2244aa";c.beginPath();c.arc(hx-3,hy+4,1.5,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(hx+3,hy+4,1.5,0,Math.PI*2);c.fill();
      c.fillStyle="#fff";c.fillRect(hx-3,hy+3,1,1);c.fillRect(hx+3,hy+3,1,1);
      // Mouth — triumphant smile
      c.strokeStyle="#aa6644";c.lineWidth=0.7;c.beginPath();c.arc(hx,hy+7,2,0.3,Math.PI-0.3);c.stroke();
    }
    // Fade to black
    if(fd.fadeAlpha>0){c.fillStyle=`rgba(0,0,0,${fd.fadeAlpha})`;c.fillRect(0,0,W2,FH2);}
    // "DARK KING DEFEATED" text
    if(fd.t>1000&&fd.t<3500){const ta=fd.t<1500?(fd.t-1000)/500:fd.t>3000?1-(fd.t-3000)/500:1;
      c.globalAlpha=ta;c.textAlign="center";c.fillStyle="#fd3";c.font="bold 16px monospace";
      c.fillText("DARK KING DEFEATED",W2/2,H2*0.2);
      c.fillStyle="rgba(253,211,51,0.3)";c.fillRect(W2/2-90,H2*0.2+4,180,1);
      c.textAlign="left";c.globalAlpha=1;}
  }
  if(s.won&&s.endScreen){const es=s.endScreen,et=es.t;
    const FH=FH2;
    // Fade in from white
    const fadeIn=Math.min(1,et/2000);
    c.fillStyle=`rgba(0,0,0,${fadeIn})`;c.fillRect(0,0,W2,FH);
    if(fadeIn<1){c.fillStyle=`rgba(255,255,240,${1-fadeIn})`;c.fillRect(0,0,W2,FH);}
    if(et<500){c.textAlign="left";return;}
    // ===== LANDSCAPE =====
    // Sky gradient — golden sunset
    const skyG=c.createLinearGradient(0,0,0,FH*0.55);
    skyG.addColorStop(0,"#1a1040");skyG.addColorStop(0.2,"#2a1850");
    skyG.addColorStop(0.4,"#804020");skyG.addColorStop(0.55,"#e8a040");
    skyG.addColorStop(0.7,"#f0d060");skyG.addColorStop(0.85,"#e8c040");
    skyG.addColorStop(1,"#80a040");
    c.fillStyle=skyG;c.fillRect(0,0,W2,FH*0.55);
    // Sun
    const sunX=W2*0.3,sunY=FH*0.32;
    const sunG=c.createRadialGradient(sunX,sunY,8,sunX,sunY,80);
    sunG.addColorStop(0,"rgba(255,240,200,0.9)");sunG.addColorStop(0.3,"rgba(255,200,100,0.4)");sunG.addColorStop(1,"rgba(255,150,50,0)");
    c.fillStyle=sunG;c.beginPath();c.arc(sunX,sunY,80,0,Math.PI*2);c.fill();
    c.fillStyle="rgba(255,230,180,0.7)";c.beginPath();c.arc(sunX,sunY,16,0,Math.PI*2);c.fill();
    // Stars (fading as scene brightens)
    const starAlpha=Math.max(0,0.6-et/15000);
    if(starAlpha>0){let seed=777;const sr=()=>{seed=(seed*16807)%2147483647;return(seed&0xffff)/0xffff;};
      for(let i=0;i<30;i++){const sx=sr()*W2,sy=sr()*FH*0.35;
        c.fillStyle=`rgba(255,255,220,${starAlpha*(0.3+sr()*0.7)})`;c.beginPath();c.arc(sx,sy,0.5+sr(),0,Math.PI*2);c.fill();}}
    // Distant mountains
    c.fillStyle="#2a4038";c.beginPath();c.moveTo(0,FH*0.50);
    c.lineTo(W2*0.1,FH*0.38);c.lineTo(W2*0.2,FH*0.42);c.lineTo(W2*0.35,FH*0.34);
    c.lineTo(W2*0.5,FH*0.40);c.lineTo(W2*0.65,FH*0.36);c.lineTo(W2*0.8,FH*0.42);
    c.lineTo(W2,FH*0.38);c.lineTo(W2,FH*0.55);c.lineTo(0,FH*0.55);c.fill();
    // Rolling green hills
    const landG=c.createLinearGradient(0,FH*0.48,0,FH);
    landG.addColorStop(0,"#3a8830");landG.addColorStop(0.3,"#2a6820");landG.addColorStop(1,"#1a4a14");
    c.fillStyle=landG;c.beginPath();c.moveTo(0,FH*0.50);
    c.bezierCurveTo(W2*0.2,FH*0.47,W2*0.4,FH*0.54,W2*0.6,FH*0.50);
    c.bezierCurveTo(W2*0.8,FH*0.46,W2*0.9,FH*0.52,W2,FH*0.48);
    c.lineTo(W2,FH);c.lineTo(0,FH);c.fill();
    // Trees in distance
    for(let i=0;i<8;i++){const tx=W2*0.05+i*W2*0.12+hs(i,0,10)*20,ty=FH*0.46+hs(i,0,11)*FH*0.06;
      const ts=3+hs(i,0,12)*3;c.fillStyle="#1a5010";c.beginPath();c.arc(tx,ty,ts,0,Math.PI*2);c.fill();
      c.fillStyle="#3a2010";c.fillRect(tx-0.8,ty+ts-1,1.6,ts*0.8);}
    // River
    c.strokeStyle="rgba(60,140,200,0.35)";c.lineWidth=4;c.beginPath();
    c.moveTo(W2*0.1,FH*0.58);c.bezierCurveTo(W2*0.3,FH*0.62,W2*0.5,FH*0.56,W2*0.7,FH*0.65);
    c.bezierCurveTo(W2*0.85,FH*0.72,W2*0.9,FH*0.60,W2,FH*0.68);c.stroke();
    // ===== CLIFF EDGE (hero stands on) =====
    const cliffY=FH*0.52;
    c.fillStyle="#5a5040";c.beginPath();
    c.moveTo(W2*0.35,cliffY);c.lineTo(W2*0.75,cliffY);c.lineTo(W2*0.78,FH);c.lineTo(W2*0.32,FH);c.fill();
    c.fillStyle="#3a8830";c.fillRect(W2*0.34,cliffY-2,W2*0.42,6);
    // ===== PRINCESS — standing beside hero, looking at sunset =====
    const px2=W2*0.48,py2=cliffY-46;
    const wind=Math.sin(t/500)*2;const capeSway=Math.sin(t/350)*10;
    const hairSway=Math.sin(t/400)*4;
    // Shadow
    c.fillStyle="rgba(0,0,0,0.15)";c.beginPath();c.ellipse(px2,cliffY-1,14,3.5,0,0,Math.PI*2);c.fill();
    // Dress
    const dressG=c.createLinearGradient(px2,py2+12,px2,cliffY);
    dressG.addColorStop(0,"#d8a0d8");dressG.addColorStop(0.5,"#c080c0");dressG.addColorStop(1,"#a060a0");
    c.fillStyle=dressG;c.beginPath();c.moveTo(px2-8,py2+14);c.lineTo(px2+8,py2+14);
    c.lineTo(px2+14,cliffY-2);c.lineTo(px2-14,cliffY-2);c.closePath();c.fill();
    // Dress trim
    c.fillStyle="rgba(255,255,255,0.15)";c.fillRect(px2-13,cliffY-4,26,2);
    // Bodice detail
    c.fillStyle="#b870b8";c.fillRect(px2-6,py2+14,12,8);
    c.fillStyle="#d4b040";c.fillRect(px2-6,py2+14,12,2);// gold trim
    // Arms at side
    c.fillStyle="#f0c8a0";
    c.fillRect(px2-12,py2+16+wind*0.2,4,10);c.fillRect(px2+8,py2+16-wind*0.2,4,10);
    // Hands
    c.beginPath();c.arc(px2-10,py2+27+wind*0.2,2.5,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(px2+10,py2+27-wind*0.2,2.5,0,Math.PI*2);c.fill();
    // Shoes
    c.fillStyle="#8060a0";c.beginPath();c.ellipse(px2-5,cliffY-2,4,3,0,0,Math.PI*2);c.fill();
    c.beginPath();c.ellipse(px2+5,cliffY-2,4,3,0,0,Math.PI*2);c.fill();
    // Head
    c.fillStyle="#f0c8a0";c.beginPath();c.arc(px2,py2+6,8,0,Math.PI*2);c.fill();
    // Long flowing hair
    const phG=c.createLinearGradient(px2-10,py2-4,px2+hairSway,py2+30);
    phG.addColorStop(0,"#c08030");phG.addColorStop(1,"#a06820");
    c.fillStyle=phG;c.beginPath();c.arc(px2,py2+4,9,0,Math.PI*2);c.fill();
    // Long hair strands flowing in wind
    c.fillStyle="#b07028";
    for(let i=0;i<3;i++){const sx=px2-4+i*4,sy=py2+2+i;
      c.beginPath();c.moveTo(sx,sy);
      c.bezierCurveTo(sx-6+hairSway,sy+10+i*3,sx-10+hairSway*1.5,sy+20+i*4,sx-8+hairSway*1.8,sy+28+i*4);
      c.lineTo(sx-6+hairSway*1.5,sy+26+i*4);
      c.bezierCurveTo(sx-7+hairSway,sy+16+i*3,sx-3+hairSway*.5,sy+6+i,sx+2,sy+1);c.fill();}
    // Tiara/crown
    c.fillStyle="#fd3";c.beginPath();
    c.moveTo(px2-7,py2);c.lineTo(px2-5,py2-4);c.lineTo(px2-2,py2-1);c.lineTo(px2,py2-5);
    c.lineTo(px2+2,py2-1);c.lineTo(px2+5,py2-4);c.lineTo(px2+7,py2);c.fill();
    // Tiara jewel
    c.fillStyle="#f44";c.beginPath();c.arc(px2,py2-3,1.5,0,Math.PI*2);c.fill();
    // ===== HERO — back to camera, holding sword aloft =====
    const hx=W2*0.58,hy=cliffY-50;
    // Shadow
    c.fillStyle="rgba(0,0,0,0.2)";c.beginPath();c.ellipse(hx,cliffY-1,16,4,0,0,Math.PI*2);c.fill();
    // Cape — billowing in wind
    const capeG=c.createLinearGradient(hx,hy+10,hx-30+capeSway,hy+55);
    capeG.addColorStop(0,"#1a6a1a");capeG.addColorStop(1,"#0a4a0a");
    c.fillStyle=capeG;c.beginPath();c.moveTo(hx-6,hy+10);
    c.bezierCurveTo(hx-18,hy+28,hx-30+capeSway,hy+42,hx-24+capeSway*1.2,hy+56);
    c.lineTo(hx-14+capeSway*0.5,hy+52);
    c.bezierCurveTo(hx-10,hy+38,hx-4,hy+22,hx+2,hy+12);c.fill();
    c.strokeStyle="rgba(100,200,80,0.2)";c.lineWidth=1;c.beginPath();
    c.moveTo(hx-6,hy+10);c.bezierCurveTo(hx-18,hy+28,hx-30+capeSway,hy+42,hx-24+capeSway*1.2,hy+56);c.stroke();
    // Right cape side
    c.fillStyle=capeG;c.beginPath();c.moveTo(hx+6,hy+10);
    c.bezierCurveTo(hx+14,hy+28,hx+22+capeSway*0.3,hy+42,hx+18+capeSway*0.4,hy+54);
    c.lineTo(hx+10+capeSway*0.2,hy+50);
    c.bezierCurveTo(hx+6,hy+36,hx+2,hy+22,hx+2,hy+12);c.fill();
    // Boots
    c.fillStyle="#5a3018";c.beginPath();c.ellipse(hx-6,cliffY-3,5,4,0,0,Math.PI*2);c.fill();
    c.beginPath();c.ellipse(hx+6,cliffY-3,5,4,0,0,Math.PI*2);c.fill();
    // Legs
    c.fillStyle="#c8b080";c.fillRect(hx-7,hy+35,5,14);c.fillRect(hx+2,hy+35,5,14);
    // Tunic body (back view)
    const tunicG=c.createLinearGradient(hx-12,hy+12,hx+12,hy+36);
    tunicG.addColorStop(0,"#48bb48");tunicG.addColorStop(1,"#2a8a2a");
    c.fillStyle=tunicG;c.beginPath();c.moveTo(hx-12,hy+14);c.lineTo(hx+12,hy+14);
    c.lineTo(hx+11,hy+36);c.lineTo(hx-11,hy+36);c.closePath();c.fill();
    // Belt
    c.fillStyle="#a87a2a";c.fillRect(hx-11,hy+28,22,3);c.fillStyle="#d4b040";c.fillRect(hx-3,hy+28,6,3);
    // Left arm (at side)
    c.fillStyle="#48aa48";c.fillRect(hx-16,hy+16+wind*0.3,5,12);
    c.fillStyle="#f0c8a0";c.beginPath();c.arc(hx-14,hy+29+wind*0.3,2.5,0,Math.PI*2);c.fill();
    // Right arm (raised holding sword)
    c.fillStyle="#48aa48";c.save();c.translate(hx+12,hy+16);c.rotate(-0.3);c.fillRect(0,-2,5,14);c.restore();
    c.fillStyle="#f0c8a0";c.beginPath();c.arc(hx+14,hy+4,3,0,Math.PI*2);c.fill();
    // Head (back of head)
    c.fillStyle="#f0c8a0";c.beginPath();c.arc(hx,hy+6,9,0,Math.PI*2);c.fill();
    // Hair — flowing in wind
    const hairG=c.createLinearGradient(hx-10,hy-4,hx+10,hy+4);
    hairG.addColorStop(0,"#e8c040");hairG.addColorStop(1,"#c8a030");
    c.fillStyle=hairG;c.beginPath();c.arc(hx,hy+4,9.5,0,Math.PI*2);c.fill();
    // Hair strands blowing in wind
    c.fillStyle="#d8b030";
    for(let i=0;i<4;i++){const sx=hx-6+i*4,sy=hy-2+i*1;
      c.beginPath();c.moveTo(sx,sy);
      c.bezierCurveTo(sx-8+wind*1.5,sy+4+i*2,sx-14+wind*2,sy+10+i*3,sx-12+wind*2.5,sy+16+i*3);
      c.lineTo(sx-10+wind*2,sy+14+i*3);
      c.bezierCurveTo(sx-10+wind*1.5,sy+8+i*2,sx-4+wind,sy+2+i,sx+2,sy+1);c.fill();}
    // Hat (green, pointy, blowing in wind)
    c.fillStyle="#2aaa2a";c.beginPath();c.moveTo(hx-8,hy+2);c.lineTo(hx+2,hy-10);
    c.bezierCurveTo(hx-12+wind*3,hy-16,hx-20+wind*4,hy-10,hx-22+wind*4.5,hy-6);c.fill();
    // ===== MASTER SWORD — held aloft =====
    const swordX=hx+14,swordBaseY=hy+4;
    // Blade
    c.strokeStyle="#c0d8ff";c.lineWidth=3;c.lineCap="round";
    c.beginPath();c.moveTo(swordX,swordBaseY);c.lineTo(swordX+2,swordBaseY-28);c.stroke();
    // Blade shine
    c.strokeStyle="rgba(255,255,255,0.6)";c.lineWidth=1.5;
    c.beginPath();c.moveTo(swordX+0.5,swordBaseY-2);c.lineTo(swordX+1.5,swordBaseY-26);c.stroke();
    // Crossguard
    c.strokeStyle="#d4b040";c.lineWidth=3;
    c.beginPath();c.moveTo(swordX-7,swordBaseY+2);c.lineTo(swordX+7,swordBaseY+2);c.stroke();
    // Grip
    c.strokeStyle="#6a3a18";c.lineWidth=3.5;
    c.beginPath();c.moveTo(swordX,swordBaseY+3);c.lineTo(swordX,swordBaseY+9);c.stroke();
    // Pommel
    c.fillStyle="#ffd633";c.beginPath();c.arc(swordX,swordBaseY+10,2.5,0,Math.PI*2);c.fill();
    // Sword glow
    const sGlow=Math.sin(t/200)*0.3+0.5;
    c.fillStyle=`rgba(180,210,255,${sGlow*0.4})`;c.beginPath();c.arc(swordX+2,swordBaseY-28,6,0,Math.PI*2);c.fill();
    // Light rays from sword tip
    for(let i=0;i<5;i++){const ra=t/800+i*Math.PI*2/5;const rl=12+Math.sin(t/300+i)*4;
      c.strokeStyle=`rgba(200,220,255,${sGlow*0.15})`;c.lineWidth=1;
      c.beginPath();c.moveTo(swordX+2,swordBaseY-28);c.lineTo(swordX+2+Math.cos(ra)*rl,swordBaseY-28+Math.sin(ra)*rl);c.stroke();}
    c.lineCap="butt";
    // ===== GOLDEN TRIFORCE above hero =====
    const triY=hy-40+Math.sin(t/600)*3;const triGlow=Math.sin(t/400)*0.15+0.5;
    c.fillStyle=`rgba(253,211,51,${triGlow*0.3})`;c.beginPath();c.arc(hx,triY,20,0,Math.PI*2);c.fill();
    c.fillStyle="#ffd633";c.beginPath();c.moveTo(hx,triY-12);c.lineTo(hx+12,triY+8);c.lineTo(hx-12,triY+8);c.closePath();c.fill();
    c.fillStyle="#ffe866";c.beginPath();c.moveTo(hx,triY-7);c.lineTo(hx+6,triY+4);c.lineTo(hx-6,triY+4);c.closePath();c.fill();
    // ===== VIGNETTE =====
    const vig=c.createRadialGradient(W2/2,FH/2,FH*0.2,W2/2,FH/2,FH*0.7);
    vig.addColorStop(0,"rgba(0,0,0,0)");vig.addColorStop(1,"rgba(0,0,0,0.4)");
    c.fillStyle=vig;c.fillRect(0,0,W2,FH);
    // ===== CREDITS — scroll up slowly =====
    c.textAlign="center";
    const credits=[
      {text:"THE LEGEND OF LINK",font:"bold 22px monospace",color:"#ffd633",gap:20},
      {text:"Quest for the Triforce",font:"13px monospace",color:"rgba(255,220,180,0.7)",gap:50},
      {text:"- CREDITS -",font:"bold 14px monospace",color:"#b8962a",gap:30},
      {text:"Producer",font:"bold 11px monospace",color:"#888",gap:4},
      {text:"Craig Boren",font:"bold 14px monospace",color:"#ddd",gap:28},
      {text:"Developer",font:"bold 11px monospace",color:"#888",gap:4},
      {text:"Craig Boren",font:"bold 14px monospace",color:"#ddd",gap:28},
      {text:"Music",font:"bold 11px monospace",color:"#888",gap:4},
      {text:"Craig Boren",font:"bold 14px monospace",color:"#ddd",gap:28},
      {text:"Testing",font:"bold 11px monospace",color:"#888",gap:4},
      {text:"Craig Boren",font:"bold 14px monospace",color:"#ddd",gap:6},
      {text:"Paul Boren",font:"bold 14px monospace",color:"#ddd",gap:28},
      {text:"Publishing",font:"bold 11px monospace",color:"#888",gap:4},
      {text:"Banana Corp",font:"bold 14px monospace",color:"#fd3",gap:50},
      {text:"Thank you for playing!",font:"bold 13px monospace",color:"rgba(255,255,255,0.6)",gap:0},
    ];
    const scrollSpeed=0.025;// pixels per ms
    const scrollStart=3000;// ms before credits start scrolling
    const scrollY=et>scrollStart?(et-scrollStart)*scrollSpeed:0;
    let cy=FH+40-scrollY;// start below screen
    for(const cr of credits){
      c.font=cr.font;c.fillStyle=cr.color;
      // Fade out near top and bottom edges
      const screenY=cy;
      if(screenY>10&&screenY<FH-5){
        const topFade=Math.min(1,(screenY-10)/40);
        const botFade=Math.min(1,(FH-5-screenY)/40);
        c.globalAlpha=Math.min(topFade,botFade);
        c.fillText(cr.text,W2/2,screenY);
        c.globalAlpha=1;
      }
      cy+=cr.gap+(cr.font.includes("22")?0:14);
    }
    // "The End" + blinking return message after credits scroll past
    const totalH=credits.reduce((a,cr)=>a+cr.gap+(cr.font.includes("22")?0:14),0);
    const creditsEnd=scrollStart+(FH+40+totalH)/scrollSpeed;
    if(et>creditsEnd){
      c.fillStyle="#fd3";c.font="bold 24px monospace";c.fillText("The End",W2/2,FH*0.42);
      c.fillStyle="rgba(253,211,51,0.3)";c.fillRect(W2/2-60,FH*0.42+6,120,1);
      // Blinking return message
      if(Math.floor(et/600)%2===0){
        c.fillStyle="rgba(255,255,255,0.5)";c.font="10px monospace";
        c.fillText("Press Tab or click to return to title screen",W2/2,FH*0.55);}}
    c.textAlign="left";
  }else if(s.won){c.fillStyle="rgba(0,0,0,0.75)";c.fillRect(0,0,W2,FH2);c.fillStyle="#fd3";c.font="bold 36px monospace";c.textAlign="center";c.fillText("VICTORY!",W2/2,FH2/2-30);c.fillStyle="#fff";c.font="15px monospace";c.fillText("Tap to play again",W2/2,FH2/2+25);c.textAlign="left";}}

// --- Lifecycle ---
let _cleanup = null;

onMounted(() => {
  stR.value = init();
  let unlocked = false;
  const doUnlock = () => { if (unlocked) return; unlocked = true; Tone.start().then(() => { initSfx(); initAu();
    // Apply saved volume level
    const s = stR.value; if(s)applyVolume(s.volume);
    // Reset ltRef so the music watcher picks up the correct theme on its next tick
    ltRef.value = null;
  }); };
  const kd = e => {
    kyR.value.add(e.key.toLowerCase());
    if (["arrowup","arrowdown","arrowleft","arrowright"," "].includes(e.key.toLowerCase())) e.preventDefault();
    if (e.key === "Tab" && stR.value && (stR.value.won || stR.value.go)) e.preventDefault();
    const s = stR.value;
    doUnlock();
    if (s && s.title && (e.key === " " || e.key === "Enter" || e.key === "z")) {
      s.title = false; s.saveSelect = true; s.saveSelIdx = 0;
      return;
    }
    if (s && s.saveSelect) {
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") { s.saveSelIdx = (s.saveSelIdx - 1 + 4) % 4; sfx("cursor"); e.preventDefault(); }
      if (k === "arrowdown" || k === "s") { s.saveSelIdx = (s.saveSelIdx + 1) % 4; sfx("cursor"); e.preventDefault(); }
      if (k === " " || k === "enter" || k === "z") {
        if (s.saveSelIdx < 3) { sfx("select"); startFromSlot(s, s.saveSelIdx); }
        else { sfx("cursor"); s.saveSelect = false; s.title = true; }
        e.preventDefault();
      }
      if (k === "escape") { s.saveSelect = false; s.title = true; }
      if (k === "x" || k === "delete" || k === "backspace") {
        if (s.saveSelIdx < 3 && loadSlot(s.saveSelIdx)) { deleteSlot(s.saveSelIdx); sfx("delete"); }
        e.preventDefault();
      }
      return;
    }
    if ((e.key.toLowerCase() === "p" || e.key === "Escape") && s && !s.title && !s.go && !s.won) {
      if(s.mapOpen){s.mapOpen=false;s.paused=false;}else{s.paused=!s.paused;if(s.paused)s.pauseSel=0;}
      if(e.key==="Escape")e.preventDefault();}
    if (s && s.paused && !s.mapOpen) {
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") { s.pauseSel = (s.pauseSel - 1 + 4) % 4; e.preventDefault(); }
      if (k === "arrowdown" || k === "s") { s.pauseSel = (s.pauseSel + 1) % 4; e.preventDefault(); }
      if (k === "arrowleft" || k === "a") { if (s.pauseSel === 0) { s.volume = Math.max(0, s.volume - 10); applyVolume(s.volume); } }
      if (k === "arrowright" || k === "d") { if (s.pauseSel === 0) { s.volume = Math.min(100, s.volume + 10); applyVolume(s.volume); } }
      if (k === " " || k === "enter") {
        if (s.pauseSel === 1) { muOn.value = !muOn.value; }
        else if (s.pauseSel === 2) { saveGame(s); s.msg = { text: "Game saved!", t: 1500 }; s.paused = false; }
        else if (s.pauseSel === 3) { saveGame(s); s.paused = false; s.title = true; s.saveSelect = false; s.msg = { text: "", t: 0 }; ltRef.value = null; }
        e.preventDefault();
      }
    }
    if ((e.key === "Tab" || e.key.toLowerCase() === "i") && s && !s.title && !s.go && !s.won) { e.preventDefault(); s.mapOpen = !s.mapOpen; s.paused = s.mapOpen; if(s.mapOpen)s.mapTab=0; }
    if (s && s.mapOpen) { if(e.key==="ArrowLeft"||e.key.toLowerCase()==="q"){s.mapTab=0;e.preventDefault();}if(e.key==="ArrowRight"||e.key.toLowerCase()==="e"){s.mapTab=1;e.preventDefault();}if(e.key==="Escape"){s.mapOpen=false;s.paused=false;e.preventDefault();} }
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
  if (_musicInterval) { clearInterval(_musicInterval); _musicInterval = null; }
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
  let _muGen = 0; // generation counter to invalidate stale async callbacks
  const ck = () => {
    const s = stR.value; if (!s) return;
    let th = s.sanctumRising ? "temple-rising" : (s.title||s.saveSelect) ? "title" : s.endScreen ? "end" : s.triMu ? "triforce" : s.bossFight ? (s.loc.di===3?"finalbattle":"guardian") : (s.loc.ty === "ow" ? (s.loc.scr==="-1,2"?"sword":isNightTime(s)?"nighttime":"overworld") : (s.loc.ty === "cave" ? (s.shopGround?"shop":(CAVES[s.loc.di]?.style?.th||"forest")) : (s.loc.ty === "passage" ? (s.dg[PASSAGES[s.ss?.pi]?.di]?.th||"forest") : s.dg[s.loc.di].th)));
    if (th !== ltRef.value) {
      ltRef.value = th;
      const gen = ++_muGen;
      const tryMp3 = customMu.value[th];
      const targetVol=(stR.value?.volume??80)/100;
      // Fade out current audio over ~1s, then start new track
      const oldAu=customAuRef.value;
      const hadOldAu=!!oldAu;
      if(oldAu){
        let vol=oldAu.volume;
        const fade=setInterval(()=>{vol-=0.03;if(vol<=0){clearInterval(fade);try{oldAu.pause();}catch(e){}}else{try{oldAu.volume=Math.max(0,vol);}catch(e){clearInterval(fade);}}},25);
        customAuRef.value=null;
      }
      // Fade out synth volume too (ramp down, will restore after stopMu)
      try{if(au.p)Tone.getDestination().volume.rampTo(-Infinity,1);}catch(e){}
      // Delay new track start to let old one fade
      const startDelay=hadOldAu||au.p?1000:0;
      const startNew=()=>{
        if(_muGen!==gen)return;
        stopMu();
        // Restore Tone destination volume so SFX still work
        applyVolume(stR.value?.volume??80);
        const playSynth = () => { Tone.start().then(() => { if(_muGen!==gen)return; if (!au.i) initAu(); playTh(th); applyVolume(stR.value?.volume??80); }).catch(() => { if(_muGen===gen)ltRef.value = null; }); };
        if (tryMp3) {
          const a = new Audio(tryMp3); a.loop = true; a.volume = 0.01;
          a.play().then(() => { if(_muGen!==gen){a.pause();return;} customAuRef.value = a;
            const fadeIn=setInterval(()=>{if(a.volume<targetVol-0.02){a.volume=Math.min(targetVol,a.volume+0.02);}else{a.volume=targetVol;clearInterval(fadeIn);}},25);
          }).catch((err) => { console.warn("MP3 play failed for",th,err); if(_muGen!==gen)return; if(MUSIC[th])playSynth(); else ltRef.value=null; });
      } else {
        playSynth();
      }
      };
      if(startDelay>0)setTimeout(startNew,startDelay);else startNew();
    }
  };
  ck();
  _musicInterval = setInterval(ck, 500);
}, { immediate: true });
</script>

<style scoped>
/* No additional scoped styles needed -- all styling is inline */
</style>
