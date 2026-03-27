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
      <div v-for="[key,label] in [['title','🎬 Title Screen'],['overworld','🌍 Overworld'],['forest','🌲 Forest Temple'],['fire','🔥 Fire Cavern'],['shadow','👻 Shadow Keep'],['guardian','⚔️ Boss Battle'],['sanctum','🏰 Dark Sanctum'],['finalbattle','💀 Final Battle'],['triforce','✨ Triforce Moment'],['end','🏆 End Credits']]" :key="key"
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
import { dSk, dBt, dGh, dBo, dAr, dMg, dKn, dMs, dWm, dVc, dSf, dYt } from '../rendering/draw-enemies.js';
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
    p:{x:7*TL,y:9*TL,dir:2,hp:8,mhp:8,keys:0,bombs:0,rupees:0,masterKey:[false,false,false,false],spd:2.8,ifr:0,tri:[false,false,false],burn:0,freeze:0,poison:0,poisonTick:0,burnTick:0,shield:false,heartPieces:0,hasBow:false,hasBombs:false,hasMasterSword:false,redArmor:false,hasBanana:false},
    sw:{a:false,t:0},loc:{ty:"ow",scr:"1,1",di:-1},
    en:[],pk:new Set(),dr:new Set(),cl:new Set(),bc:new Set(),// bc = bombed cracks "ty:di:scr:x,y" → replacement tile id
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
    hasLantern:false,hasShieldUp:false,hasJar:false,springWater:0,shopVisited:false, // shop upgrades + jar
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
    ledgeHop:0, // timer for hop animation when dropping off a ledge
    litTorches:new Set(), // "x,y" keys of torches lit by sword in current room
    combatLock:false, // true when room has enemies and exits are sealed
    ss:null, // side-scroll passage state: {vy,grounded,onLadder,jumping,facing,pi}
    bossWarp:null, // {x,y,t,ready,di} — warp portal after boss death (temporary animation)
    bossWarps:[], // persistent: [{di,bossScr,bossX,bossY,entryScr}] — cleared dungeon portals
    pushAnim:null, // {fx,fy,tx,ty,t,dur,reveal,rx,ry,isDg} — smooth block slide
    endScreen:null, // {t:0} end credits cinematic
  };
}

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
  if (!s || s.title || s.saveSelect || s.go || s.won) return;
  try {
    const data = {
      v: 1,
      p: { x: s.p.x, y: s.p.y, dir: s.p.dir, hp: s.p.hp, mhp: s.p.mhp, keys: s.p.keys, bombs: s.p.bombs, rupees: s.p.rupees, masterKey: [...s.p.masterKey], tri: [...s.p.tri], heartPieces: s.p.heartPieces, hasBow: s.p.hasBow, hasBombs: s.p.hasBombs, hasMasterSword: s.p.hasMasterSword, redArmor: s.p.redArmor, hasBanana: s.p.hasBanana },
      loc: { ...s.loc },
      pk: [...s.pk],
      dr: [...s.dr],
      cl: [...s.cl].filter(k=>!k.startsWith("ow:")),
      bc: [...(s.bc||[])],
      heartContainers: [...s.heartContainers],
      finalOpen: s.finalOpen,
      respawn: { ...s.respawn },
      hasLantern: s.hasLantern, hasShieldUp: s.hasShieldUp, hasJar: s.hasJar, springWater: s.springWater, shopVisited: s.shopVisited,
      bossWarps: s.bossWarps||[]
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
  s.p.masterKey = [...save.p.masterKey]; s.p.tri = [...save.p.tri]; s.p.heartPieces = save.p.heartPieces || 0; s.p.hasBow = save.p.hasBow || false; s.p.hasBombs = save.p.hasBombs || false; s.p.hasMasterSword = save.p.hasMasterSword || false; s.p.redArmor = save.p.redArmor || false; s.p.hasBanana = save.p.hasBanana || false;
  s.loc.ty = save.loc.ty; s.loc.scr = save.loc.scr; s.loc.di = save.loc.di;
  s.pk = new Set(save.pk); s.dr = new Set(save.dr); s.cl = new Set(save.cl);
  s.bc = new Set(save.bc||[]);
  s.heartContainers = [...save.heartContainers];
  s.finalOpen = save.finalOpen; s.hasLantern = save.hasLantern || false; s.hasShieldUp = save.hasShieldUp || false; s.hasJar = save.hasJar || false; s.springWater = save.springWater || 0; s.shopVisited = save.shopVisited || false;
  s.respawn = { ...save.respawn };
  s.bossWarps = save.bossWarps ? [...save.bossWarps] : [];
  if (s.finalOpen) {
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
function le(s){s.bProj=[];s.pArrows=[];s.chest=null;s.activeBombs=[];s.shop=null;s.shopGround=null;s.fireTrails=[];s.bossFight=false;
  // Restore lit torches for this room (persists between visits)
  if(!s.litTorchesAll)s.litTorchesAll={};
  const trk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}`;
  s.litTorches=s.litTorchesAll[trk]||(s.litTorchesAll[trk]=new Set());const rk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}`;
  // Always load NPCs for overworld (even if room is cleared of enemies)
  const npcs=s.loc.ty==="ow"?NPC_DATA[s.loc.scr]:null;
  s.npcState=npcs?npcs.map(n=>({x:n.tx*TL,y:n.ty*TL,hx:n.tx*TL,hy:n.ty*TL,dir:2,mt:Math.random()*3000,st:"idle",wait:1000+Math.random()*2000,fixed:!!n.fixed||n.name.includes("Tree")||n.name==="Sign"})):[];
  // Always load blade traps for dungeons (even if room is cleared)
  s.bladeTraps=[];
  if(s.loc.ty==="dg"){const rm2=s.dg[s.loc.di].rooms[s.loc.scr];
    if(rm2?.traps)s.bladeTraps=rm2.traps.map(tr=>({x:tr.x*TL,y:tr.y*TL,hx:tr.x*TL,hy:tr.y*TL,dir:tr.dir,range:tr.range*TL,st:"idle",vel:0,wait:0}));}
  if(s.cl.has(rk)){s.en=[];s.combatLock=false;
    // Re-spawn uncollected boss drops when re-entering a cleared boss room
    if(s.loc.ty==="dg"){const di2=s.loc.di;const rm2b=s.dg[di2]?.rooms[s.loc.scr];const boss=rm2b?.enemies?.find(e=>e.type==="boss");
      if(boss&&di2>=0&&di2<3){const bossId=`${di2}:${boss.name}`;const cx=W2/2,cy=H2/2;
        const alreadyHC=s.drops.some(d2=>d2.type==="heartcontainer");
        const alreadyTF=s.drops.some(d2=>d2.type==="triforce");
        if(!s.heartContainers.includes(bossId)&&!alreadyHC)s.drops.push({x:cx-20,y:cy,vy:0,ground:cy,type:"heartcontainer",t:0,spin:0,bossId});
        if(!s.p.tri[di2]&&!alreadyTF)s.drops.push({x:cx+20,y:cy,vy:0,ground:cy,type:"triforce",t:0,spin:0});}}
    return;}
  const sp=(e,i)=>({...e,mhp:e.hp,fl:0,mt:Math.random()*2000,st:"patrol",stT:0,hx:e.x,hy:e.y,spawnT:400+i*120});
  if(s.loc.ty==="passage"){const pi2=s.ss?.pi??-1;const pg=PASSAGES[pi2];s.en=pg?.enemies?pg.enemies.map(sp):[];s.combatLock=false;return;}
  if(s.loc.ty==="dg"){const rm=s.dg[s.loc.di].rooms[s.loc.scr];s.en=rm?.enemies?rm.enemies.map(sp):[];}
  else if(s.loc.ty==="cave"){const cv=CAVES[s.loc.di];s.en=cv?.room?.enemies?cv.room.enemies.map(sp):[];}
  else{const oe2=OW_EN[s.loc.scr];s.en=oe2?oe2.map(sp):[];}
  // Boss intro -- cinematic sequence if room has a boss
  // Combat lock -- only for reward/boss/miniboss rooms, blocks transitions only (not collision)
  const isDg=s.loc.ty==="dg"||s.loc.ty==="cave";
  const roomData2=isDg&&s.loc.ty==="dg"?s.dg[s.loc.di]?.rooms[s.loc.scr]:null;
  s.combatLock=isDg&&s.en.length>0&&(
    roomData2?.reward||roomData2?.lock||s.en.some(e=>e.type==="boss"||e.type==="miniboss"));
  if(isDg&&s.en.length>0){
    const boss=s.en.find(e=>e.type==="boss");
    if(boss){s._pendingBoss={name:boss.name||"???",bx:boss.x+ES/2,by:boss.y+ES/2};s.bossFight=true;
      ltRef.value=null;}
  }
}

function gm(s){if(s.loc.ty==="ow")return OW[s.loc.scr]||null;if(s.loc.ty==="cave")return CAVES[s.loc.di]?.room?.tiles||null;if(s.loc.ty==="passage")return null;return s.dg[s.loc.di].rooms[s.loc.scr]?.tiles||null;}

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
    if(tl===T.BOSS_DOOR){if(s.p.masterKey[s.loc.di]){s.dr.add(dk);openPair(tx,ty);s.msg={text:"Master key used! Boss door opened!",t:1500};sfx("door");
      s.pt.push(...Array.from({length:12},()=>({x:tx*TL+16,y:ty*TL+16,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:600,c:Math.random()>.5?"#c070ff":"#fd3"})));return false;}
      s.msg={text:"Locked! Find the Master Key...",t:1500};return true;}
    if(s.p.keys>0){s.p.keys--;s.dr.add(dk);openPair(tx,ty);s.msg={text:"Door opened!",t:1500};sfx("door");
      s.pt.push(...Array.from({length:8},()=>({x:tx*TL+16,y:ty*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:500,c:"#fd3"})));return false;}return true;}
  return false;}

function eSolid(s,tx,ty){const m=gm(s);if(!m||tx<0||tx>=CO||ty<0||ty>=RO)return true;const tl=m[ty][tx];return SOLID.has(tl)||tl===T.DOOR||tl===T.BOSS_DOOR||tl===T.LEDGE_S||tl===T.LEDGE_N||tl===T.LEDGE_E||tl===T.LEDGE_W;}

function cPk(s){const p=s.p,m=gm(s);if(!m)return;const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const tx=ptx+dx,ty=pty+dy;if(ty<0||ty>=RO||tx<0||tx>=CO)continue;
    const tl=m[ty][tx],pk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${tx},${ty}`;if(s.pk.has(pk))continue;
    const cx=tx*TL,cy=ty*TL;if(!(p.x<cx+TL&&p.x+PS>cx&&p.y<cy+TL&&p.y+PS>cy))continue;
    if(tl===T.RUPEE){s.pk.add(pk);p.rupees+=5;s.msg={text:"Got rupees!",t:1000};sfx("pickup");s.pt.push(...Array.from({length:6},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:600,c:"#4f4"})));}
    else if(tl===T.MASTER_KEY){s.pk.add(pk);if(s.loc.di>=0)p.masterKey[s.loc.di]=true;s.msg={text:"Got the Master Key!",t:2000};sfx("pickup");s.shake.t=300;
      s.pt.push(...Array.from({length:12},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:800,c:Math.random()>.5?"#c070ff":"#ffd633"})));}
    else if(tl===T.KEY){s.pk.add(pk);p.keys++;s.msg={text:"Got a key!",t:1500};sfx("pickup");s.pt.push(...Array.from({length:6},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:600,c:"#fd3"})));}
    else if(tl===T.BOMB){if(!p.hasBombs){s.msg={text:"Need a Bomb Bag first!",t:1500};}else{s.pk.add(pk);p.bombs+=3;s.msg={text:"Got bombs!",t:1500};sfx("pickup");s.pt.push(...Array.from({length:6},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:600,c:"#88f"})));}}
    else if(tl===T.HEART_PIECE){s.pk.add(pk);p.heartPieces++;sfx("heartpiece");s.freeze=500;
      if(p.heartPieces>=4){p.heartPieces=0;p.mhp+=2;p.hp=p.mhp;sfx("triforce");s.shake.t=400;s.msg={text:"Heart Piece (4/4)! New heart container!",t:2500};}
      else{s.msg={text:`Heart Piece (${p.heartPieces}/4)`,t:2000};}
      s.pt.push(...Array.from({length:10},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:600,c:Math.random()>.5?"#ff3366":"#ffd633"})));}
    else if(tl===T.BANANA){s.pk.add(pk);p.hasBanana=true;sfx("itemget");s.shake.t=400;s.msg={text:"Got the Golden Banana! The shopkeeper might want this...",t:3500};
      s.pt.push(...Array.from({length:15},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:800,c:Math.random()>.5?"#fd3":"#fa0"})));}
    else if(tl===T.BOW){s.pk.add(pk);p.hasBow=true;sfx("itemget");s.shake.t=400;s.msg={text:"Got the Bow! Press C to shoot (costs 1 rupee)",t:3000};
      s.pt.push(...Array.from({length:15},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:800,c:Math.random()>.5?"#fd3":"#a06820"})));}
    else if(tl===T.BOMB_BAG){s.pk.add(pk);p.hasBombs=true;p.bombs+=5;sfx("triforce");s.shake.t=400;s.msg={text:"Got Bomb Bag! Press B to place bombs",t:3000};
      s.pt.push(...Array.from({length:15},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:800,c:Math.random()>.5?"#88f":"#f80"})));}
    else if(tl===T.JAR){s.pk.add(pk);s.hasJar=true;sfx("itemget");s.shake.t=400;s.msg={text:"Got the Magic Jar! Carry spring water to heal!",t:3000};
      s.pt.push(...Array.from({length:15},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:800,c:Math.random()>.5?"#8af":"#4cf"})));}
    else if(tl===T.MASTER_SWORD){s.pk.add(pk);p.hasMasterSword=true;sfx("itemget");s.shake.t=600;s.freeze=500;s.msg={text:"Master Sword! Double damage!",t:3000};
      s.pt.push(...Array.from({length:20},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*6,dy:(Math.random()-.5)*6,l:1000,c:Math.random()>.5?"#8af":"#fff"})));}
    else if(tl===T.HEART){s.pk.add(pk);p.hp=Math.min(p.hp+2,p.mhp);s.msg={text:"Heart restored!",t:1500};sfx("pickup");s.pt.push(...Array.from({length:6},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*3,dy:-Math.random()*2,l:500,c:"#f66"})));}
    else if(tl===T.TRIFORCE){s.pk.add(pk);p.tri[s.loc.di]=true;const c2=p.tri.filter(Boolean).length;sfx("triforce");
      s.pt.push(...Array.from({length:20},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:1000,c:"#fd3"})));
      if(c2>=3){s.won=true;s.endScreen={t:0};s.msg={text:"",t:0};}else s.msg={text:`Triforce piece ${c2}/3!`,t:2500};}}}

function cTr(s){const p=s.p,loc=s.loc;
  if(loc.ty==="ow"){
    if(s.ec<=0){
      for(const ent of DE){if(ent.s!==loc.scr)continue;
        if(ent.d===3&&!s.finalOpen)continue;
        for(const[tx,ty]of ent.t){if(p.x<tx*TL+TL&&p.x+PS>tx*TL&&p.y<ty*TL+TL&&p.y+PS>ty*TL){
          s.fade={a:true,alpha:0,dir:1,t:0,spd:500,cb:()=>{
            loc.ty="dg";loc.di=ent.d;const dg2=s.dg[ent.d];let er="0,0";for(const rk of Object.keys(dg2.rooms))if(dg2.rooms[rk].tiles.some(r=>r.includes(T.STAIRS_UP))){er=rk;break;}
            s.respawn={ty:"dg",scr:er,di:ent.d,x:7*TL,y:9*TL};
            loc.scr=er;p.x=7*TL;p.y=9*TL;s.shop=null;le(s);s.dgTitle={text:dg2.name,t:3000};}};sfx("door");return;}}}
      for(let ci=0;ci<CAVES.length;ci++){const cv=CAVES[ci];if(cv.s!==loc.scr)continue;
        const owm=OW[loc.scr];
        for(const[tx,ty]of cv.t){if(owm&&owm[ty][tx]!==T.ENTRANCE)continue;if(p.x<tx*TL+TL&&p.x+PS>tx*TL&&p.y<ty*TL+TL&&p.y+PS>ty*TL){
          s.fade={a:true,alpha:0,dir:1,t:0,spd:500,cb:()=>{
            loc.ty="cave";loc.di=ci;loc.scr="0";p.x=7*TL;p.y=2*TL;s.ec=500;le(s);
            if(cv.shop){s.shopVisited=true;
              s.shopGround=[
                {tx:5,ty:7,name:"Key",cost:20,action:s2=>{s2.p.keys++;},collected:false},
                {tx:7,ty:7,name:"Bombs x5",cost:15,req:"hasBombs",action:s2=>{s2.p.bombs+=5;},collected:false},
                {tx:8,ty:7,name:"Lantern",cost:30,once:"hasLantern",action:s2=>{s2.hasLantern=true;},collected:false},
                {tx:10,ty:7,name:"Shield+",cost:50,once:"hasShieldUp",action:s2=>{s2.hasShieldUp=true;},collected:false},
              ];
              if(s.p.hasBanana&&!s.p.redArmor){
                s.shopGround.push({tx:7,ty:9,name:"Red Armor",cost:100,action:s2=>{s2.p.redArmor=true;s2.p.hasBanana=false;s2.msg={text:"Red Armor forged! Half damage taken!",t:3000};},collected:false});
              }
              // Mark already-purchased once items
              for(const si of s.shopGround){if(si.once&&s[si.once])si.collected=true;}
              s.msg={text:s.p.hasBanana&&!s.p.redArmor?"I can forge Red Armor for that banana!":"Welcome! Walk over items to buy!",t:2000};
            }
            else{s.msg={text:"Hidden Cave!",t:1500};}}};sfx("door");return;}}}
    }
    const[sx,sy]=loc.scr.split(",").map(Number);
    if(p.x<-4){const ns=`${sx-1},${sy}`;if(OW[ns]){const ps=loc.scr;loc.scr=ns;p.x=W2-PS-8;le(s);s.slide={a:true,dx:-1,dy:0,t:0,dur:200,prevScr:ps};}else p.x=-4;}
    if(p.x>W2-PS+4){const ns=`${sx+1},${sy}`;if(OW[ns]){const ps=loc.scr;loc.scr=ns;p.x=8;le(s);s.slide={a:true,dx:1,dy:0,t:0,dur:200,prevScr:ps};}else p.x=W2-PS+4;}
    if(p.y<-4){const ns=`${sx},${sy-1}`;if(OW[ns]){const ps=loc.scr;loc.scr=ns;p.y=H2-PS-8;le(s);s.slide={a:true,dx:0,dy:-1,t:0,dur:200,prevScr:ps};}else p.y=-4;}
    if(p.y>H2-PS+4){const ns=`${sx},${sy+1}`;if(OW[ns]){const ps=loc.scr;loc.scr=ns;p.y=8;le(s);s.slide={a:true,dx:0,dy:1,t:0,dur:200,prevScr:ps};}else p.y=H2-PS+4;}
  }else if(loc.ty==="cave"){const m=gm(s);
    // Safety: if cave has no valid tiles, warp back to overworld
    if(!m){const cv2=CAVES[loc.di];if(cv2){loc.ty="ow";loc.scr=cv2.s;loc.di=-1;p.x=7*TL;p.y=9*TL;le(s);}return;}
    const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);
    if(m&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO&&m[pty][ptx]===T.STAIRS_UP){
      const ci2=loc.di;s.fade={a:true,alpha:0,dir:1,t:0,spd:500,cb:()=>{
        const cv=CAVES[ci2];loc.ty="ow";loc.scr=cv.s;loc.di=-1;
        p.x=cv.t[0][0]*TL;p.y=(cv.t[0][1]+2)*TL;s.ec=500;le(s);}};sfx("door");return;}
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
  // End screen cinematic — just advance timer
  if(s.endScreen){s.endScreen.t+=dt;return;}
  // Freeze gameplay during chest presentation
  if(s.chest&&s.chest.state==="presenting"){s.chest.t+=dt;s.chest.itemY=Math.min(40,(s.chest.itemY||0)+2.5*(dt/16));
    if(s.chest.t>=1500){s.chest.state="open";s.chest.t=0;
      if(s.chest.reward){s.drops.push({x:s.chest.x+12,y:s.chest.y-(s.chest.itemY||0),vy:-1,ground:s.chest.y,type:s.chest.reward,t:0});}
      const itemNames={bow:"Bow",bomb_bag:"Bomb Bag",master_sword:"Master Sword",master_key:"Master Key",heart:"Heart",rupee_blue:"Rupees",rupee_green:"Rupees"};
      const isSpecial=["bow","bomb_bag","master_sword","master_key"].includes(s.chest.reward);
      sfx(isSpecial?"itemget":"pickup");
      s.msg={text:itemNames[s.chest.reward]?`You got the ${itemNames[s.chest.reward]}!`:"Treasure!",t:2000};}
    // Still update particles during freeze
    for(let i=s.pt.length-1;i>=0;i--){const pt=s.pt[i];pt.x+=pt.dx*(dt/16);pt.y+=pt.dy*(dt/16);pt.l-=dt;if(pt.l<=0)s.pt.splice(i,1);}
    return;}
  // Deferred boss intro — trigger if no slide was active (e.g. entering via fade/stairs)
  if(s._pendingBoss&&!s.slide.a){const pb=s._pendingBoss;s._pendingBoss=null;
    s.bossIntro={name:pb.name,t:0,dur:3000,bx:pb.bx,by:pb.by};sfx("bossdeath");}
  // Boss intro sequence -- freeze gameplay, animate camera
  if(s.bossIntro){s.bossIntro.t+=dt;
    if(s.bossIntro.t>=s.bossIntro.dur||s.bossIntro.t>5000){s.bossIntro=null;}
    return;}
  // Triforce/item hold-up animation
  if(s.triforceHold){s.triforceHold.t+=dt;
    if(s.triforceHold.t>2000&&!s.triforceHold.warp){s.triforceHold.warp=true;sfx("door");
      const tc3=s.p.tri.filter(Boolean).length;
      s.msg={text:tc3>=3?"The Dark Sanctum has opened!":`Triforce piece ${tc3}/3!`,t:2000};}
    // Only warp after portal appeared and 500ms passed
    if(s.triforceHold.warp&&s.triforceHold.t>=s.triforceHold.dur){
      const di2=s.loc.di;const dg3=s.dg[di2];if(dg3){
        for(const rk3 of Object.keys(dg3.rooms)){if(dg3.rooms[rk3].tiles?.some(r=>r.includes(T.STAIRS_UP))){
          s.loc.scr=rk3;s.p.x=7*TL;s.p.y=9*TL;le(s);break;}}}
      s.triforceHold=null;}
    // Update particles + drops during hold (so player can pick up remaining items)
    for(let i=s.pt.length-1;i>=0;i--){const pt=s.pt[i];pt.x+=pt.dx*(dt/16);pt.y+=pt.dy*(dt/16);pt.l-=dt;if(pt.l<=0)s.pt.splice(i,1);}
    // Allow drop collection during hold
    for(let i=s.drops.length-1;i>=0;i--){const d2=s.drops[i];d2.t+=dt;
      if(d2.type==="triforce"||d2.type==="heartcontainer"||d2.type==="key_drop"){d2.vy=Math.min(d2.vy+0.02*(dt/16),0.8);d2.y+=d2.vy*(dt/16);if(d2.y>d2.ground){d2.y=d2.ground;d2.vy=0;}}
      if(Math.abs(s.p.x+PS/2-d2.x)<16&&Math.abs(s.p.y+PS/2-d2.y)<16){
        if(d2.type==="heartcontainer"){s.p.mhp+=2;s.p.hp=s.p.mhp;sfx("itemget");s.msg={text:"Heart Container!",t:1500};}
        s.drops.splice(i,1);}}
    return;}
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
    if(s.fade.dir===-1){s.fade.alpha=Math.max(0,1-s.fade.t/fs);if(s.fade.alpha<=0)s.fade.a=false;}return;}
  // Shop ground items — player walks over to buy
  if(s.shopGround){const p=s.p;
    for(const si of s.shopGround){
      if(si.collected)continue;if(si.once&&s[si.once]){si.collected=true;continue;}
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
    s.npcTalk.charIdx=Math.min(s.npcTalk.lines[s.npcTalk.idx].length,Math.floor(s.npcTalk.timer/30));
    const ky=kyR.value;
    if(ky.has(" ")||ky.has("enter")||ky.has("e")||ky.has("z")||s.respawnClick){
      s.respawnClick=false;
      if(s.npcTalk.charIdx>=s.npcTalk.lines[s.npcTalk.idx].length){
        s.npcTalk.idx++;
        if(s.npcTalk.idx>=s.npcTalk.lines.length){s.npcTalk=null;
          for(const ns3 of s.npcState)if(ns3.wait>5000)ns3.wait=2000;}
        else{s.npcTalk.charIdx=0;s.npcTalk.timer=0;}
      }else{s.npcTalk.charIdx=s.npcTalk.lines[s.npcTalk.idx].length;s.npcTalk.timer=99999;}
      ky.delete(" ");ky.delete("enter");ky.delete("e");ky.delete("z");
    }
    return;
  }
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
  if(s.go||s.won){if(kyR.value.has("r")||kyR.value.has(" ")||kyR.value.has("enter")||s.respawnClick){s.respawnClick=false;
    if(s.won){stopMu();if(customAuRef.value){customAuRef.value.pause();customAuRef.value=null;}
      const ns=init();ns.title=true;stR.value=ns;ltRef.value=null;return;}
    const old=s;const ns=init();ns.title=false;ns.p.keys=old.p.keys;ns.p.bombs=old.p.bombs;ns.p.rupees=old.p.rupees;ns.p.tri=[...old.p.tri];ns.p.masterKey=[...old.p.masterKey];ns.p.mhp=old.p.mhp;ns.p.hp=ns.p.mhp;ns.p.heartPieces=old.p.heartPieces;ns.p.hasBow=old.p.hasBow;ns.p.hasBombs=old.p.hasBombs;ns.p.hasMasterSword=old.p.hasMasterSword;ns.p.redArmor=old.p.redArmor;ns.p.hasBanana=old.p.hasBanana;
    ns.pk=old.pk;ns.dr=old.dr;ns.cl=old.cl;ns.bc=old.bc;ns.dg=old.dg;ns.heartContainers=[...old.heartContainers];ns.finalOpen=old.finalOpen;ns.bossWarps=[...(old.bossWarps||[])];ns.hasLantern=old.hasLantern;ns.hasShieldUp=old.hasShieldUp;ns.hasJar=old.hasJar;ns.springWater=old.springWater||0;ns.shopVisited=old.shopVisited;
    ns.loc.ty=old.respawn.ty;ns.loc.scr=old.respawn.scr;ns.loc.di=old.respawn.di;ns.p.x=old.respawn.x;ns.p.y=old.respawn.y;
    ns.respawn={...old.respawn};// preserve respawn point for subsequent deaths
    stR.value=ns;le(ns);saveGame(ns);}return;}
  if(s.slide.a){s.slide.t+=dt;if(s.slide.t>=s.slide.dur){s.slide.a=false;
    // Trigger boss intro after room transition completes
    if(s._pendingBoss){const pb=s._pendingBoss;s._pendingBoss=null;
      s.bossIntro={name:pb.name,t:0,dur:3000,bx:pb.bx,by:pb.by};sfx("bossdeath");}}return;}
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
        // Open all DOOR tiles in the room temporarily
        for(let yy=0;yy<RO;yy++)for(let xx=0;xx<CO;xx++){if(m2[yy][xx]===T.DOOR){
          const dk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${xx},${yy}`;s.dr.add(dk);
          s.pt.push(...Array.from({length:4},()=>({x:xx*TL+16,y:yy*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:400,c:"#fd3"})));}}
        s.timedDoors.push({key:tk,t:5000,scr:s.loc.scr,di:s.loc.di,ty:s.loc.ty});}}}
  for(let i=s.timedDoors.length-1;i>=0;i--){const td=s.timedDoors[i];td.t-=dt;
    if(td.t<=0){// Re-lock all DOOR tiles in the room
      const m2=td.ty==="dg"?s.dg[td.di]?.rooms[td.scr]?.tiles:null;
      if(m2){for(let yy=0;yy<RO;yy++)for(let xx=0;xx<CO;xx++){if(m2[yy][xx]===T.DOOR){
        const dk=`${td.ty}:${td.di}:${td.scr}:${xx},${yy}`;s.dr.delete(dk);}}}
      s.timedDoors.splice(i,1);sfx("door");s.msg={text:"Doors closed!",t:1000};}}
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
          if(ft===T.BOSS_DOOR){if(p.masterKey[s.loc.di]){s.dr.add(dk);openPair2();sfx("door");s.msg={text:"Master key used! Boss door opened!",t:1500};
            s.pt.push(...Array.from({length:12},()=>({x:ftx*TL+16,y:fty*TL+16,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:600,c:Math.random()>.5?"#c070ff":"#fd3"})));}
            else{s.msg={text:"Locked! Find the Master Key...",t:1500};}}
          else if(p.keys>0){p.keys--;s.dr.add(dk);openPair2();sfx("door");s.msg={text:"Door opened!",t:1500};
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
        // Check if all pits in room are now filled -- if so, drop a key
        let pitsLeft=false;for(let yy=0;yy<RO;yy++)for(let xx=0;xx<CO;xx++)if(m2[yy][xx]===T.PIT)pitsLeft=true;
        if(!pitsLeft){sfx("itemget");s.shake.t=300;s.msg={text:"A key appeared!",t:1500};
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
        m2[by][bx]=T.PUSH;// destination tile becomes push block immediately (collision)
        m2[fty][ftx]=T.FLOOR;// temp clear source for rendering (animation overlays)
        const pushDur=s.loc.ty==="ow"?800:250;
        s.pushAnim={fx:ftx*TL,fy:fty*TL,tx:bx*TL,ty:by*TL,t:0,dur:pushDur,
          reveal:revealTile,rx:ftx,ry:fty,isDg:s.loc.ty==="dg",wasPlate};
        s.pushCd=true;
        if(s.loc.ty==="ow")s.freeze=pushDur;
        sfx("door");s.pt.push(...Array.from({length:4},()=>({x:ftx*TL+16,y:fty*TL+16,dx:(Math.random()-.5)*2,dy:(Math.random()-.5)*2,l:300,c:"#aaa"})));
        if(wasPlate){s.shake.t=200;
          // Check if room has stairsReveal — if so, reveal STAIRS_DOWN instead of key
          const roomD3=s.loc.ty==="dg"?s.dg[s.loc.di]?.rooms[s.loc.scr]:null;
          if(roomD3?.stairsReveal){const[srx,sry]=roomD3.stairsReveal;
            m2[sry][srx]=T.STAIRS_DOWN;sfx("secret");s.msg={text:"A stairway appeared!",t:2000};
            s.pt.push(...Array.from({length:12},()=>({x:srx*TL+16,y:sry*TL+16,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:800,c:Math.random()>.5?"#fa0":"#fd3"})));
          }else{sfx("pickup");s.msg={text:"A key appeared!",t:1500};
            m2[5][7]=T.KEY;s.pt.push(...Array.from({length:8},()=>({x:7*TL+16,y:5*TL+16,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:600,c:"#fd3"})));}}
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
      }
      s.pushCd=false;s.pushAnim=null;
    }
  }
  {const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);const m2=gm(s);
    if(m2&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO){
      if(m2[pty][ptx]===T.SPIKE&&Math.sin(s.gt/750)>0&&p.ifr<=0){if(!p.redArmor||Math.random()>0.5)p.hp--;p.ifr=IFR;sfx("hurt");s.shake.t=200;
        s.pt.push(...Array.from({length:3},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*2,dy:(Math.random()-.5)*2,l:300,c:"#888"})));
        if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}
      if(m2[pty][ptx]===T.PIT&&p.ifr<=0&&!s.pitFall.a){
        s.pitFall={a:true,t:0,x:p.x,y:p.y};sfx("hurt");}}}
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
      // Fill jar with spring water
      if(s.hasJar&&s.springWater<3){s.springWater=3;s.msg={text:"Jar filled with spring water!",t:1500};}
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
          s.npcTalk={name:npc.name,lines:npc.lines,idx:0,charIdx:0,timer:0};sfx("pickup");npcHit=true;
          ns2.st="idle";ns2.wait=9999;// Stop wandering during talk
          // NPC faces player
          ns2.dir=Math.abs(ndx)>Math.abs(ndy)?(ndx>0?3:1):(ndy>0?0:2);
          break;}}}}
    if(!npcHit){s.sw.a=true;s.sw.t=SD;sfx("sword");
      // Light torches with sword -- only in dark rooms
      const isDkRoom=s.loc.ty==="dg"&&s.dg[s.loc.di]?.rooms[s.loc.scr]?.dark;
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
      else if(d2.type==="rupee_purple"){p.rupees+=10;sfx("pickup");s.dmgNums.push({x:p.x+PS/2,y:p.y,t:800,val:"+10",c:"#a4f"});}
      else if(d2.type==="rupee_red"){p.rupees+=20;sfx("pickup");s.dmgNums.push({x:p.x+PS/2,y:p.y,t:800,val:"+20",c:"#f44"});}
      else if(d2.type==="bow"){p.hasBow=true;sfx("itemget");s.shake.t=400;s.msg={text:"Got the Bow! Press C to shoot (costs 1 rupee)",t:3000};
        s.pt.push(...Array.from({length:15},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:800,c:Math.random()>.5?"#fd3":"#a06820"})));}
      else if(d2.type==="bomb_bag"){p.hasBombs=true;p.bombs+=5;sfx("itemget");s.shake.t=400;s.msg={text:"Got Bomb Bag! Press B to place bombs",t:3000};
        s.pt.push(...Array.from({length:15},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:800,c:Math.random()>.5?"#88f":"#f80"})));}
      else if(d2.type==="master_sword"){p.hasMasterSword=true;sfx("itemget");s.shake.t=600;s.freeze=500;s.msg={text:"Master Sword! Double damage!",t:3000};
        s.pt.push(...Array.from({length:20},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*6,dy:(Math.random()-.5)*6,l:1000,c:Math.random()>.5?"#8af":"#fff"})));}
      else if(d2.type==="master_key"){if(s.loc.di>=0)p.masterKey[s.loc.di]=true;sfx("itemget");s.shake.t=400;s.msg={text:"Got the Master Key!",t:2500};
        s.pt.push(...Array.from({length:12},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:800,c:Math.random()>.5?"#c070ff":"#fd3"})));}
      else if(d2.type==="heartcontainer"){p.mhp+=2;p.hp=p.mhp;sfx("itemget");s.msg={text:"Heart Container! Max HP up!",t:2500};
        if(d2.bossId&&!s.heartContainers.includes(d2.bossId))s.heartContainers.push(d2.bossId);}
      else if(d2.type==="triforce"){p.tri[s.loc.di]=true;sfx("itemget");s.shake.t=500;s.triMu=false;
        const tc2=p.tri.filter(Boolean).length;
        if(tc2>=3&&!s.finalOpen){s.finalOpen=true;
          const fm=OW["3,2"];if(fm){fm[5][7]=T.ENTRANCE;fm[5][8]=T.ENTRANCE;fm[6][7]=T.ENTRANCE;fm[6][8]=T.ENTRANCE;}}
        // Hold-up animation + warp portal
        s.triforceHold={t:0,dur:2500,piece:tc2,px:p.x,py:p.y,warp:false};
        s.pt.push(...Array.from({length:20},()=>({x:p.x+PS/2+(Math.random()-.5)*30,y:p.y+PS/2+(Math.random()-.5)*30,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:800,c:"#fd3"})));}
      s.drops.splice(i,1);continue;}
    if(d2.t>8000&&!["triforce","heartcontainer","key_drop","bow","bomb_bag","master_sword","master_key","banana"].includes(d2.type))s.drops.splice(i,1);}
  // Boss warp portal — appears after boss death, warps player to overworld
  if(s.bossWarp){s.bossWarp.t+=dt;
    if(!s.bossWarp.ready&&s.bossWarp.t>3000){
      // Portal appears after 3 seconds (time for drops to land)
      s.bossWarp.ready=true;sfx("secret");s.msg={text:"A warp portal appeared!",t:2500};
      const wx=s.bossWarp.x,wy=s.bossWarp.y;
      s.pt.push(...Array.from({length:20},()=>({x:wx*TL+16,y:wy*TL+16,dx:(Math.random()-.5)*6,dy:(Math.random()-.5)*6,l:1000,c:Math.random()>.5?"#8af":"#fff"})));
    }
    if(s.bossWarp.ready){
      const wx=s.bossWarp.x*TL,wy=s.bossWarp.y*TL;
      // Check if player stepped on the portal
      if(p.x+PS/2>wx&&p.x+PS/2<wx+TL&&p.y+PS/2>wy&&p.y+PS/2<wy+TL){
        const di=s.bossWarp.di;const bx=s.bossWarp.x,by=s.bossWarp.y;
        const bossScr=s.loc.scr;
        // Find the dungeon entry room (the one with STAIRS_UP)
        const dg2=s.dg[di];let entryScr="0,0";
        for(const rk of Object.keys(dg2.rooms)){if(dg2.rooms[rk].tiles?.some(r=>r.includes(T.STAIRS_UP))){entryScr=rk;break;}}
        // Make this warp permanent
        if(!s.bossWarps.find(w=>w.di===di)){
          s.bossWarps.push({di,bossScr,bossX:bx,bossY:by,entryScr});
        }
        s.bossWarp=null;
        // Warp to dungeon entrance room
        s.fade={a:true,alpha:0,dir:1,t:0,cb:()=>{
          s.loc.scr=entryScr;p.x=7*TL;p.y=9*TL;
          s.triMu=false;s.ec=500;le(s);s.msg={text:"Warped to dungeon entrance!",t:1500};
        }};
      }
    }
  }
  // Persistent warp portals — check if player steps on one
  if(s.loc.ty==="dg"&&s.bossWarps.length>0&&!s.bossWarp){
    const di=s.loc.di;const scr=s.loc.scr;
    for(const w of s.bossWarps){if(w.di!==di)continue;
      let wx=-1,wy=-1,destScr=null;
      if(scr===w.bossScr){wx=w.bossX;wy=w.bossY;destScr=w.entryScr;}
      else if(scr===w.entryScr){wx=7;wy=5;destScr=w.bossScr;} // portal at center of entry room
      if(wx>=0&&destScr&&p.x+PS/2>wx*TL&&p.x+PS/2<(wx+1)*TL&&p.y+PS/2>wy*TL&&p.y+PS/2<(wy+1)*TL){
        s.fade={a:true,alpha:0,dir:1,t:0,cb:()=>{
          s.loc.scr=destScr;
          if(destScr===w.entryScr){p.x=7*TL;p.y=9*TL;}
          else{p.x=w.bossX*TL;p.y=(w.bossY+1)*TL;}
          s.ec=500;le(s);sfx("door");
          s.msg={text:destScr===w.entryScr?"Warped to entrance!":"Warped to boss room!",t:1500};
        }};break;
      }
    }
  }
  // Chest update -- requires action button to open
  if(s.chest){const ch=s.chest;ch.t+=dt;const ky=kyR.value;
    if(ch.state==="closed"){const cdx=p.x+PS/2-(ch.x+12),cdy=p.y+PS/2-(ch.y+12);
      ch.near=Math.abs(cdx)<24&&Math.abs(cdy)<24;
      if(ch.near&&(ky.has(" ")||ky.has("enter")||ky.has("e")||ky.has("z"))){ch.state="opening";ch.t=0;sfx("door");s.shake.t=200;}}
    else if(ch.state==="opening"&&ch.t>=600){ch.state="presenting";ch.t=0;ch.itemY=0;sfx("door");
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
          s.msg={text:isCave?"A hidden cave!":(s.loc.ty==="dg"?"Bombed a wall! Secret passage!":"Secret passage!"),t:2000};}}
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
      if(Math.abs(nx2-ns2.hx)<wander&&Math.abs(ny2-ns2.hy)<wander&&nx2>TL&&nx2<W2-TL*2&&ny2>TL&&ny2<H2-TL*2){ns2.x=nx2;ns2.y=ny2;}
      ns2.wait-=dt;if(ns2.wait<=0){ns2.st="idle";ns2.wait=isDog?300+Math.random()*800:1500+Math.random()*3000;}}}}
  const rk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}`;
  for(let i=s.en.length-1;i>=0;i--){const e=s.en[i];
    if(e.spawnT>0){e.spawnT-=dt;continue;}
    e.mt+=dt;if(e.fl>0)e.fl-=dt;
    const pcx=p.x+PS/2,pcy=p.y+PS/2,ecx=e.x+ES/2,ecy=e.y+ES/2,dist=Math.hypot(pcx-ecx,pcy-ecy);
    e.stT+=dt;const isBossLike=e.type==="boss"||e.type==="miniboss";
    const alwaysChase=e.type==="wallmaster"||e.type==="magma_slug"||e.type==="vine_creeper"||e.type==="stalfos";
    const detectRange=isBossLike?250:alwaysChase?300:160;const loseRange=250;
    if(e.st==="patrol"&&dist<detectRange)e.st="chase";
    if(e.st==="chase"&&dist>loseRange&&!isBossLike&&!alwaysChase)e.st="retreat";
    if(e.st==="retreat"&&e.stT>2000){e.st="patrol";e.stT=0;}
    let es=e.type==="boss"?1.0:e.type==="miniboss"?1.2:e.type==="ghost"?1.3:(e.type==="bat"||e.type==="fire_bat")?1.2:e.type==="archer"?0.8:e.type==="mage"?0.6:e.type==="knight"?1.1:e.type==="magma_slug"?0.4:e.type==="vine_creeper"?0.5:e.type==="stalfos"?1.0:1.0;
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
            // Teleport to dungeon entrance
            const dg3=s.dg[s.loc.di];if(dg3){for(const rk3 of Object.keys(dg3.rooms)){if(dg3.rooms[rk3].tiles?.some(r=>r.includes(T.STAIRS_UP))){s.loc.scr=rk3;p.x=7*TL;p.y=9*TL;le(s);break;}}}
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
        // Mini-boss: charge pattern -- circle, then lunge
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
    const flies=e.type==="ghost"||e.type==="bat"||e.type==="fire_bat";
    if(flies){e.x=nx;e.y=ny;}else{
    const eCanX=!eSolid(s,Math.floor((nx+em)/TL),Math.floor((e.y+em)/TL))&&!eSolid(s,Math.floor((nx+ES-em)/TL),Math.floor((e.y+em)/TL))&&!eSolid(s,Math.floor((nx+em)/TL),Math.floor((e.y+ES-em)/TL))&&!eSolid(s,Math.floor((nx+ES-em)/TL),Math.floor((e.y+ES-em)/TL));
    const eCanY=!eSolid(s,Math.floor((e.x+em)/TL),Math.floor((ny+em)/TL))&&!eSolid(s,Math.floor((e.x+ES-em)/TL),Math.floor((ny+em)/TL))&&!eSolid(s,Math.floor((e.x+em)/TL),Math.floor((ny+ES-em)/TL))&&!eSolid(s,Math.floor((e.x+ES-em)/TL),Math.floor((ny+ES-em)/TL));
    if(eCanX)e.x=nx;if(eCanY)e.y=ny;}
    e.x=Math.max(TL,Math.min(W2-TL-ES,e.x));e.y=Math.max(TL,Math.min(H2-TL-ES,e.y));
    if(s.sw.a){const sOff=SR*0.7,sR2=SR*0.85;let sx2=p.x+PS/2,sy2=p.y+PS/2;if(p.dir===0)sy2-=sOff;if(p.dir===2)sy2+=sOff;if(p.dir===3)sx2-=sOff;if(p.dir===1)sx2+=sOff;
      const sDist=Math.hypot(sx2-ecx,sy2-ecy);
      if(sDist<sR2+ES*0.4&&e.fl<=0){
        // Shadow form — boss is invulnerable, sword passes through
        if(e.shadowForm){e.fl=200;
          s.pt.push(...Array.from({length:3},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:200,c:"#606"})));
          s.dmgNums.push({x:ecx,y:ecy-8,t:600,val:"SHADOW!",c:"#a060ff"});
          continue;}
        if(e.type==="knight"&&e.shieldDir!==undefined){
          const atkAng=Math.atan2(ecy-pcy,ecx-pcx);
          const shieldDiff=Math.abs(((atkAng-e.shieldDir+Math.PI*3)%(Math.PI*2))-Math.PI);
          if(shieldDiff>Math.PI*0.6){e.fl=200;sfx("door");
            s.pt.push(...Array.from({length:3},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:200,c:"#aaf"})));
            s.dmgNums.push({x:ecx,y:ecy-8,t:600,val:"BLOCK",c:"#88f"});
            continue;}}
        // Yetis are immune to sword — only arrows damage them
        if(e.type==="yeti"){e.fl=200;sfx("door");
          s.pt.push(...Array.from({length:3},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:200,c:"#8cf"})));
          s.dmgNums.push({x:ecx,y:ecy-8,t:800,val:"USE BOW",c:"#8af"});
          continue;}
        const sdmg=p.hasMasterSword?2:1;e.hp-=sdmg;e.fl=300;const kb=isBossLike?10:18,kba=Math.atan2(ecy-pcy,ecx-pcx);e.x+=Math.cos(kba)*kb;e.y+=Math.sin(kba)*kb;
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
        if(s.loc.di===3){s.won=true;s.endScreen={t:0};s.msg={text:"",t:0};}
        // Spawn warp portal after boss death (delayed so drops land first)
        if(s.loc.di<3){const wTx=Math.floor(ecx/TL),wTy=Math.floor(ecy/TL);
          s.bossWarp={x:wTx,y:wTy,t:0,ready:false,di:s.loc.di};}
      }else if(e.type==="miniboss"){sfx("bossdeath");s.shake.t=400;s.freeze=300;
        s.drops.push({x:ecx,y:ecy-8,vy:-4,ground:ecy,type:"heart",t:0},{x:ecx-10,y:ecy-8,vy:-3.5,ground:ecy,type:"heart",t:0});
        s.msg={text:`${e.name||"Mini-Boss"} defeated!`,t:2000};
      }else{sfx("kill");
        const dr2=Math.random();
        if(dr2<0.40){const dt2=Math.random();
          s.drops.push({x:ecx,y:ecy-4,vy:-3,ground:ecy,type:dt2<0.45?"heart":dt2<0.65?"bomb":dt2<0.85?"rupee_green":"rupee_blue",t:0});}}
      if(e.type==="boss")s.msg={text:`${e.name||"Boss"} defeated!`,t:2000};
      if(s.en.length===0){s.cl.add(rk);s.roomFlash=500;
        // Track respawn timer for overworld screens (30s)
        if(s.loc.ty==="ow"){if(!s.respawnTimers)s.respawnTimers={};s.respawnTimers[rk]=30000;}
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
      if(e.type==="ghost"){p.freeze=2500;s.msg={text:"Frozen!",t:1000};}
      s.pt.push(...Array.from({length:4},()=>({x:pcx,y:pcy,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:300,c:e.type==="fire_bat"?"#f80":e.type==="ghost"?"#8af":"#f44"})));
      if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}}
  for(let i=s.bProj.length-1;i>=0;i--){const bp=s.bProj[i];bp.x+=bp.dx*(dt/16);bp.y+=bp.dy*(dt/16);bp.l-=dt;
    if(bp.l<=0||bp.x<0||bp.x>W2||bp.y<0||bp.y>H2){s.bProj.splice(i,1);continue;}
    if(s.p.shield&&Math.hypot(p.x+PS/2-bp.x,p.y+PS/2-bp.y)<22){
      // Block if projectile is coming from the direction player faces
      const ba=Math.atan2(bp.y-(p.y+PS/2),bp.x-(p.x+PS/2));
      const pf=p.dir===0?-Math.PI/2:p.dir===2?Math.PI/2:p.dir===3?Math.PI:0;
      const diff=Math.abs(((ba-pf+Math.PI*3)%(Math.PI*2))-Math.PI);
      if(diff<Math.PI*(s.hasShieldUp?0.85:0.6)){sfx("door");s.bProj.splice(i,1);
        s.pt.push(...Array.from({length:6},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:300,c:"#88f"})));
        s.dmgNums.push({x:p.x+PS/2,y:p.y,t:500,val:"BLOCK",c:"#8af"});
        continue;}}
    if(p.ifr<=0&&Math.hypot(p.x+PS/2-bp.x,p.y+PS/2-bp.y)<14){
      if(!p.redArmor||Math.random()>0.5)p.hp--;p.ifr=IFR;sfx("hurt");s.shake.t=300;s.bProj.splice(i,1);
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
        // Arrows pass through shadow form
        if(e.shadowForm){s.pt.push({x:pa.x,y:pa.y,dx:0,dy:-1,l:200,c:"#606"});continue;}
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
  for(let i=0;i<3;i++){const tx=W2/2-22+i*22,ty=iD2?16:8;
    c.fillStyle=p.tri[i]?"#ffd633":"#333";c.beginPath();c.moveTo(tx+8,ty);c.lineTo(tx+16,ty+14);c.lineTo(tx,ty+14);c.closePath();c.fill();
    if(p.tri[i]){c.fillStyle="#ffe866";c.beginPath();c.moveTo(tx+8,ty+4);c.lineTo(tx+12,ty+11);c.lineTo(tx+4,ty+11);c.closePath();c.fill();}}
  // Status effects -- below triforce if in dungeon
  if(p.burn>0||p.freeze>0||p.poison>0){let stx=W2/2-40;c.font="bold 8px monospace";
    if(p.burn>0){c.fillStyle="#f80";c.fillText("BURN",stx,26);stx+=35;}
    if(p.freeze>0){c.fillStyle="#8cf";c.fillText("FREEZE",stx,26);stx+=40;}
    if(p.poison>0){c.fillStyle="#4a4";c.fillText("POISON",stx,26);}}
  c.textAlign="left";
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
        if((tl2===T.KEY||tl2===T.MASTER_KEY||tl2===T.HEART||tl2===T.HEART_PIECE||tl2===T.TRIFORCE||tl2===T.BOMB||tl2===T.RUPEE||tl2===T.BOW||tl2===T.BOMB_BAG||tl2===T.MASTER_SWORD||tl2===T.JAR)&&s.pk.has(opk))tl2=iD?T.FLOOR:T.GRASS;
        if((tl2===T.DOOR||tl2===T.BOSS_DOOR)&&s.dr.has(opk))tl2=T.FLOOR;
        dT(c,tl2,x2*TL,y2*TL,iD,dg,t,null);}
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
    if((tl===T.KEY||tl===T.MASTER_KEY||tl===T.HEART||tl===T.HEART_PIECE||tl===T.TRIFORCE||tl===T.BOMB||tl===T.RUPEE||tl===T.BOW||tl===T.BOMB_BAG||tl===T.MASTER_SWORD||tl===T.BANANA||tl===T.JAR)&&s.pk.has(pk))tl=iD?T.FLOOR:T.GRASS;
    if((tl===T.DOOR||tl===T.BOSS_DOOR)&&s.dr.has(pk))tl=T.FLOOR;
    let ei=null;
    if(tl===T.ENTRANCE&&!iD){for(const de of DE){if(de.s===loc.scr){for(const tp of de.t){if(tp[0]===x&&tp[1]===y){ei={di:de.d,qx:x-de.t[0][0],qy:y-de.t[0][1]};break;}}if(ei)break;}}}
    dT(c,tl,px,py,iD,dg,s.gt,ei);}
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
      // Draw miniboss -- armored skeleton, larger, with HP bar and aura
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
    else if(e.type==="magma_slug")dMs(c,ex,ey,sz,fl,t);
    else if(e.type==="wallmaster")dWm(c,ex,ey,sz,fl,t);
    else if(e.type==="vine_creeper")dVc(c,ex,ey,sz,fl,t);
    else if(e.type==="stalfos")dSf(c,ex,ey,sz,fl,t);
    else if(e.type==="yeti")dYt(c,ex,ey,sz,fl,t);
    else dSk(c,ex,ey,sz,fl,t);}
  // Draw push block slide animation
  if(s.pushAnim){const pa=s.pushAnim,pr=Math.min(1,pa.t/pa.dur);
    // Ease-out curve for smooth deceleration
    const ep=1-Math.pow(1-pr,2);
    const ax=pa.fx+(pa.tx-pa.fx)*ep,ay=pa.fy+(pa.ty-pa.fy)*ep;
    // Draw the sliding block at interpolated position
    if(!iD){
      // Overworld boulder (same as ROCK rendering)
      c.fillStyle="rgba(0,0,0,0.18)";c.beginPath();c.ellipse(ax+18,ay+24,12,4,0.1,0,Math.PI*2);c.fill();
      const prg2=c.createRadialGradient(ax+13,ay+11,3,ax+16,ay+16,15);
      prg2.addColorStop(0,"#aaa8a0");prg2.addColorStop(0.3,"#908880");prg2.addColorStop(0.6,"#787068");prg2.addColorStop(1,"#585048");
      c.fillStyle=prg2;c.beginPath();c.ellipse(ax+16,ay+15,14,11,0,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(255,255,255,0.2)";c.beginPath();c.ellipse(ax+11,ay+10,6,4,-.4,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(0,0,0,0.25)";c.beginPath();c.ellipse(ax+20,ay+20,8,5,0.2,0,Math.PI*2);c.fill();
    }else{
      // Dungeon push block
      const pbg2=c.createLinearGradient(ax,ay,ax+TL,ay+TL);pbg2.addColorStop(0,"#7a7a88");pbg2.addColorStop(1,"#5a5a68");
      c.fillStyle=pbg2;c.fillRect(ax+2,ay+2,TL-4,TL-4);
      c.fillStyle="rgba(255,255,255,0.15)";c.fillRect(ax+2,ay+2,TL-4,3);c.fillRect(ax+2,ay+2,3,TL-4);
      c.fillStyle="rgba(0,0,0,0.2)";c.fillRect(ax+2,ay+TL-5,TL-4,3);c.fillRect(ax+TL-5,ay+2,3,TL-4);
    }
    // Dust particles while sliding
    if(pr<0.8&&Math.random()<0.4){s.pt.push({x:ax+16+(Math.random()-.5)*10,y:ay+TL-2,dx:(Math.random()-.5)*1.5,dy:-Math.random()*1,l:200,c:iD?"#888":"#a89060"});}
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
  // Persistent warp portals
  if(s.loc.ty==="dg"&&s.bossWarps.length>0&&!s.bossWarp){
    for(const w of s.bossWarps){if(w.di!==s.loc.di)continue;
      let pwx=-1,pwy=-1;
      if(s.loc.scr===w.bossScr){pwx=w.bossX;pwy=w.bossY;}
      else if(s.loc.scr===w.entryScr){pwx=7;pwy=5;}
      if(pwx>=0){const wx2=pwx*TL+16,wy2=pwy*TL+16;
        const pulse2=Math.sin(s.gt/200)*0.2+0.8;const spin2=s.gt/500;
        const wg2=c.createRadialGradient(wx2,wy2,4,wx2,wy2,18);
        wg2.addColorStop(0,`rgba(100,180,255,${0.4*pulse2})`);wg2.addColorStop(0.5,`rgba(60,120,255,${0.25*pulse2})`);wg2.addColorStop(1,"rgba(40,60,200,0)");
        c.fillStyle=wg2;c.beginPath();c.arc(wx2,wy2,18,0,Math.PI*2);c.fill();
        c.strokeStyle=`rgba(150,200,255,${0.6*pulse2})`;c.lineWidth=1.5;
        c.beginPath();c.arc(wx2,wy2,8+Math.sin(s.gt/300)*2,spin2,spin2+Math.PI*1.5);c.stroke();
        c.fillStyle=`rgba(220,240,255,${0.5*pulse2})`;c.beginPath();c.arc(wx2,wy2,3,0,Math.PI*2);c.fill();
        c.fillStyle=`rgba(255,255,255,${0.7*pulse2})`;c.beginPath();c.arc(wx2,wy2,1.5,0,Math.PI*2);c.fill();
        for(let i=0;i<3;i++){const a=spin2*2+i*Math.PI*2/3,r=10+Math.sin(s.gt/200+i)*3;
          c.fillStyle=`rgba(200,230,255,${0.4*pulse2})`;c.beginPath();c.arc(wx2+Math.cos(a)*r,wy2+Math.sin(a)*r,1.2,0,Math.PI*2);c.fill();}
      }
    }
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
    else if(d2.type==="key_drop"){// Falling key
      const ky3=d2.y+bob2;c.fillStyle=`rgba(253,211,51,${0.2+Math.sin(t/200)*0.1})`;c.beginPath();c.arc(d2.x,ky3,10,0,Math.PI*2);c.fill();
      c.fillStyle="#fd3";c.beginPath();c.arc(d2.x,ky3-3,4,0,Math.PI*2);c.fill();
      c.fillRect(d2.x-1,ky3+1,2,7);c.fillRect(d2.x,ky3+5,3,2);c.fillRect(d2.x,ky3+7,2,1.5);}
    else if(d2.type==="banana"){// Golden banana
      const bn2=d2.y+bob2;c.fillStyle=`rgba(253,211,51,${0.2+Math.sin(t/200)*0.1})`;c.beginPath();c.arc(d2.x,bn2,10,0,Math.PI*2);c.fill();
      c.strokeStyle="#ffd633";c.lineWidth=3;c.lineCap="round";c.beginPath();c.arc(d2.x,bn2+3,6,-Math.PI*0.8,-Math.PI*0.15);c.stroke();c.lineCap="butt";}
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
    // Warp portal
    if(th2.warp){const wp2=Math.min(1,(th2.t-2000)/500);
      const wcx=W2/2,wcy=H2/2;const wr=wp2*20;
      c.strokeStyle=`rgba(100,180,255,${wp2*0.6})`;c.lineWidth=3;
      c.beginPath();c.arc(wcx,wcy,wr,0,Math.PI*2);c.stroke();
      c.fillStyle=`rgba(80,150,255,${wp2*0.2})`;c.beginPath();c.arc(wcx,wcy,wr,0,Math.PI*2);c.fill();
      for(let i=0;i<6;i++){const a=t/300+i*Math.PI/3;
        c.fillStyle=`rgba(150,200,255,${wp2*0.5})`;c.beginPath();c.arc(wcx+Math.cos(a)*wr,wcy+Math.sin(a)*wr,2,0,Math.PI*2);c.fill();}}
  }else if(s.pitFall&&s.pitFall.a){// Falling into pit -- shrink + spin
    const fp=Math.min(1,s.pitFall.t/600);const sc=1-fp*0.9;const spin=fp*Math.PI*3;
    const fx=s.pitFall.x+PS/2,fy=s.pitFall.y+PS/2;
    c.save();c.translate(fx,fy);c.rotate(spin);c.scale(sc,sc);c.globalAlpha=1-fp;
    dP(c,-PS/2,-PS/2,p.dir,t,p.redArmor);c.restore();
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
        const plr=(s.hasLantern?100:40)+litT2*8;const pg=c.createRadialGradient(p.x+PS/2,p.y+PS/2,0,p.x+PS/2,p.y+PS/2,plr);
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
      let col="#3a5a2a";if(ok===loc.scr)col="#fd3";
      c.fillStyle=col;c.fillRect(omX+op+(cx2-onX)*os+1,omY+op+(cy2-onY)*os+1,os-2,os-2);
      for(const de2 of DE){if(de2.s===ok){c.fillStyle=ok===loc.scr?"#000":"#222";c.fillRect(omX+op+(cx2-onX)*os+os/2-2,omY+op+(cy2-onY)*os+os/2-2,4,4);}}}
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
      c.fillText("- DUNGEON BOSS -",W2/2,FH2/2+18);
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
    // Draw ground items with price tags
    for(const si of s.shopGround){
      if(si.collected)continue;
      const ix=si.tx*TL,iy=si.ty*TL;
      // Draw item sprite based on name
      if(si.name==="Key"){
        c.fillStyle="#fd3";c.fillRect(ix+12,iy+10,8,4);c.fillRect(ix+18,iy+8,4,8);c.fillRect(ix+12,iy+12,4,6);
      }else if(si.name.includes("Bomb")){
        c.fillStyle="#335";c.beginPath();c.arc(ix+16,iy+18,7,0,Math.PI*2);c.fill();
        c.fillStyle="#555";c.fillRect(ix+14,iy+8,4,6);c.fillStyle="#f80";c.fillRect(ix+15,iy+6,2,4);
      }else if(si.name==="Lantern"){
        c.fillStyle="#654321";c.fillRect(ix+14,iy+8,4,10);
        c.fillStyle="#fa0";c.beginPath();c.arc(ix+16,iy+22,6,0,Math.PI*2);c.fill();
        c.fillStyle="#ff8";c.beginPath();c.arc(ix+16,iy+21,3,0,Math.PI*2);c.fill();
      }else if(si.name.includes("Shield")){
        c.fillStyle="#4466cc";c.beginPath();c.moveTo(ix+8,iy+8);c.lineTo(ix+24,iy+8);c.lineTo(ix+24,iy+22);c.lineTo(ix+16,iy+28);c.lineTo(ix+8,iy+22);c.fill();
        c.fillStyle="#6688ee";c.beginPath();c.moveTo(ix+11,iy+11);c.lineTo(ix+21,iy+11);c.lineTo(ix+21,iy+20);c.lineTo(ix+16,iy+24);c.lineTo(ix+11,iy+20);c.fill();
        c.fillStyle="#fd3";c.beginPath();c.arc(ix+16,iy+16,3,0,Math.PI*2);c.fill();
      }else if(si.name.includes("Red Armor")){
        c.fillStyle="#aa2222";c.beginPath();c.moveTo(ix+8,iy+10);c.lineTo(ix+24,iy+10);c.lineTo(ix+24,iy+26);c.lineTo(ix+16,iy+30);c.lineTo(ix+8,iy+26);c.fill();
        c.fillStyle="#cc4444";c.fillRect(ix+11,iy+12,10,6);
        c.fillStyle="#fd3";c.beginPath();c.arc(ix+16,iy+20,2,0,Math.PI*2);c.fill();
      }
      // Price tag above item
      const bob=Math.sin(t/400+si.tx)*2;
      c.font="bold 7px monospace";c.textAlign="center";
      c.fillStyle=s.p.rupees>=si.cost?"#4f4":"#f66";
      c.fillText(`${si.cost}r`,ix+16,iy+bob);
      // Item name below
      c.fillStyle="#aaa";c.font="5px monospace";
      c.fillText(si.name,ix+16,iy+TL+6);
    }
    c.textAlign="left";
  }
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
    const ctrls=["WASD / Arrows \u2014 Move","Space \u2014 Attack","B \u2014 Bomb","C \u2014 Bow (1 rupee)","X / Shift \u2014 Shield","I / Tab \u2014 Map & Inventory","P / Esc \u2014 Pause","M \u2014 Toggle Music"];
    for(let i=0;i<ctrls.length;i++)c.fillText(ctrls[i],W2/2,cy2+30+i*13);
    c.textAlign="left";}
  if(s.mapOpen){drawInventoryScreen(c,s,t);}
  if(s.go){c.fillStyle="rgba(10,0,0,0.75)";c.fillRect(0,0,W2,FH2);c.fillStyle="#e33";c.font="bold 36px monospace";c.textAlign="center";c.fillText("GAME OVER",W2/2,FH2/2-20);c.fillStyle="#ccc";c.font="16px monospace";c.fillText("Tap to respawn",W2/2,FH2/2+25);c.textAlign="left";}
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
    // ===== HERO — back to camera, holding sword aloft =====
    const hx=W2*0.55,hy=cliffY-50;
    const wind=Math.sin(t/500)*2;const capeSway=Math.sin(t/350)*10;
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
      {text:"Thank you for playing!",font:"bold 13px monospace",color:"rgba(255,255,255,0.6)",gap:30},
      {text:"Press Space to return",font:"10px monospace",color:"rgba(255,255,255,0.3)",gap:0},
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
    let th = (s.title||s.saveSelect) ? "title" : s.endScreen ? "end" : s.triMu ? "triforce" : s.bossFight ? (s.loc.di===3?"finalbattle":"guardian") : (s.loc.ty === "ow" ? "overworld" : (s.loc.ty === "cave" ? "forest" : (s.loc.ty === "passage" ? (s.dg[PASSAGES[s.ss?.pi]?.di]?.th||"forest") : s.dg[s.loc.di].th)));
    if (th !== ltRef.value) {
      stopMu();
      if (customAuRef.value) { customAuRef.value.pause(); customAuRef.value = null; }
      ltRef.value = th;
      const gen = ++_muGen; // capture generation for async check
      if (customMu.value[th]) {
        const a = new Audio(customMu.value[th]); a.loop = true; a.volume = (stR.value?.volume??80)/100;
        a.play().then(() => { if(_muGen===gen)customAuRef.value = a; else a.pause(); }).catch(() => { if(_muGen===gen)ltRef.value = null; });
      } else {
        Tone.start().then(() => { if(_muGen!==gen)return; if (!au.i) initAu(); playTh(th); }).catch(() => { if(_muGen===gen)ltRef.value = null; });
      }
    }
  };
  ck();
  _musicInterval = setInterval(ck, 500);
}, { immediate: true });
</script>

<style scoped>
/* No additional scoped styles needed -- all styling is inline */
</style>
