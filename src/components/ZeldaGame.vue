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
    p:{x:7*TL,y:9*TL,dir:2,hp:8,mhp:8,keys:0,bombs:3,rupees:0,masterKey:[false,false,false,false],spd:2.8,ifr:0,tri:[false,false,false],burn:0,freeze:0,poison:0,poisonTick:0,burnTick:0,shield:false},
    sw:{a:false,t:0},loc:{ty:"ow",scr:"1,1",di:-1},
    en:[],pk:new Set(),dr:new Set(),cl:new Set(),
    msg:{text:"",t:0},go:false,won:false,dg:dc(DG),pt:[],ec:0,
    title:true,
    fade:{a:false,alpha:0,dir:1,cb:null,t:0},
    shake:{x:0,y:0,t:0},
    drops:[],
    death:{a:false,t:0,spin:0},
    lowHp:0,
    paused:false,
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
      p: { x: s.p.x, y: s.p.y, dir: s.p.dir, hp: s.p.hp, mhp: s.p.mhp, keys: s.p.keys, bombs: s.p.bombs, rupees: s.p.rupees, masterKey: [...s.p.masterKey], tri: [...s.p.tri] },
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
  s.p.masterKey = [...save.p.masterKey]; s.p.tri = [...save.p.tri];
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
function le(s){s.bProj=[];s.pArrows=[];const rk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}`;if(s.cl.has(rk)){s.en=[];return;}
  if(s.loc.ty==="dg"){const rm=s.dg[s.loc.di].rooms[s.loc.scr];s.en=rm?.enemies?rm.enemies.map(e=>({...e,mhp:e.hp,fl:0,mt:Math.random()*2000,st:"patrol",stT:0,hx:e.x,hy:e.y})):[];}
  else if(s.loc.ty==="cave"){const cv=CAVES[s.loc.di];s.en=cv?.room?.enemies?cv.room.enemies.map(e=>({...e,mhp:e.hp,fl:0,mt:Math.random()*2000,st:"patrol",stT:0,hx:e.x,hy:e.y})):[];}
  else{const oe2=OW_EN[s.loc.scr];s.en=oe2?oe2.map(e=>({...e,mhp:e.hp,fl:0,mt:Math.random()*2000,st:"patrol",stT:0,hx:e.x,hy:e.y})):[];}}

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
    else if(tl===T.HEART_PIECE){s.pk.add(pk);p.mhp+=2;p.hp=p.mhp;sfx("triforce");s.shake.t=400;s.msg={text:"Heart Piece! Max HP up!",t:2500};
      s.pt.push(...Array.from({length:15},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:800,c:Math.random()>.5?"#ff3366":"#ffd633"})));}
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
        for(const[tx,ty]of cv.t){if(p.x<tx*TL+TL&&p.x+PS>tx*TL&&p.y<ty*TL+TL&&p.y+PS>ty*TL){
          loc.ty="cave";loc.di=ci;loc.scr="0";p.x=7*TL;p.y=2*TL;s.ec=500;le(s);s.msg={text:"Hidden Cave!",t:1500};sfx("door");return;}}}
    }
    const[sx,sy]=loc.scr.split(",").map(Number);
    if(p.x<-4){const ns=`${sx-1},${sy}`;if(OW[ns]){loc.scr=ns;p.x=W2-PS-8;le(s);}else p.x=-4;}
    if(p.x>W2-PS+4){const ns=`${sx+1},${sy}`;if(OW[ns]){loc.scr=ns;p.x=8;le(s);}else p.x=W2-PS+4;}
    if(p.y<-4){const ns=`${sx},${sy-1}`;if(OW[ns]){loc.scr=ns;p.y=H2-PS-8;le(s);}else p.y=-4;}
    if(p.y>H2-PS+4){const ns=`${sx},${sy+1}`;if(OW[ns]){loc.scr=ns;p.y=8;le(s);}else p.y=H2-PS+4;}
  }else if(loc.ty==="cave"){const m=gm(s);const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);
    if(m&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO&&m[pty][ptx]===T.STAIRS_UP){
      const cv=CAVES[loc.di];loc.ty="ow";loc.scr=cv.s;loc.di=-1;
      p.x=cv.t[0][0]*TL;p.y=(cv.t[0][1]+2)*TL;s.ec=500;le(s);return;}
  }else{const[rx,ry]=loc.scr.split(",").map(Number),m=gm(s);
    const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);
    if(m&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO&&m[pty][ptx]===T.STAIRS_UP){
      const ent=DE[loc.di];loc.ty="ow";loc.scr=ent.s;loc.di=-1;
      const mxTy=Math.max(...ent.t.map(t2=>t2[1]));p.x=ent.t[0][0]*TL;p.y=(mxTy+2)*TL;s.ec=500;le(s);return;}
    const dg=s.dg[loc.di];
    if(p.y<-4){const ns=`${rx},${ry-1}`;if(dg.rooms[ns]){loc.scr=ns;p.y=H2-TL-PS-4;le(s);}else p.y=-4;}
    if(p.y>H2-PS+4){const ns=`${rx},${ry+1}`;if(dg.rooms[ns]){loc.scr=ns;p.y=TL+4;le(s);}else p.y=H2-PS+4;}
    if(p.x<-4){const ns=`${rx-1},${ry}`;if(dg.rooms[ns]){loc.scr=ns;p.x=W2-TL-PS-4;le(s);}else p.x=-4;}
    if(p.x>W2-PS+4){const ns=`${rx+1},${ry}`;if(dg.rooms[ns]){loc.scr=ns;p.x=TL+4;le(s);}else p.x=W2-PS+4;}}
  saveGame(s);}

function upd(dt){const s=stR.value;if(!s||s.title||s.paused)return;s.gt+=dt;
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
    const old=s;const ns=init();ns.title=false;ns.p.keys=old.p.keys;ns.p.bombs=old.p.bombs;ns.p.rupees=old.p.rupees;ns.p.tri=[...old.p.tri];ns.p.masterKey=[...old.p.masterKey];ns.p.mhp=old.p.mhp;ns.p.hp=ns.p.mhp;
    ns.pk=old.pk;ns.dr=old.dr;ns.cl=old.cl;ns.dg=old.dg;ns.heartContainers=[...old.heartContainers];ns.finalOpen=old.finalOpen;
    ns.loc.ty=old.respawn.ty;ns.loc.scr=old.respawn.scr;ns.loc.di=old.respawn.di;ns.p.x=old.respawn.x;ns.p.y=old.respawn.y;
    stR.value=ns;le(ns);saveGame(ns);}return;}
  if(s.fade.a){s.fade.t+=dt;s.fade.alpha=Math.min(1,s.fade.t/250);
    if(s.fade.alpha>=1&&s.fade.cb){s.fade.cb();s.fade.cb=null;s.fade.dir=-1;s.fade.t=0;}
    if(s.fade.dir===-1){s.fade.alpha=Math.max(0,1-s.fade.t/250);if(s.fade.alpha<=0)s.fade.a=false;}return;}
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
      if(s.iceSlide.active){const isp=sp*1.5;const nx=p.x+s.iceSlide.dx*isp,ny=p.y+s.iceSlide.dy*isp;
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
    if(!npcHit){s.sw.a=true;s.sw.t=SD;sfx("sword");}}if(tc.atk)tc.atk=false;
  if(ky.has("b")&&p.bombs>0&&!s.bombCd){
    const ftx=Math.floor((p.x+PS/2)/TL)+(p.dir===1?1:p.dir===3?-1:0);
    const fty=Math.floor((p.y+PS/2)/TL)+(p.dir===0?-1:p.dir===2?1:0);
    const mp2=gm(s);
    if(mp2&&fty>=0&&fty<RO&&ftx>=0&&ftx<CO&&mp2[fty][ftx]===T.CRACK){
      p.bombs--;s.bombCd=true;setTimeout(()=>{if(stR.value)stR.value.bombCd=false;},500);
      sfx("bomb");s.shake.t=400;
      let isCave=false;
      if(s.loc.ty==="ow"){for(const cv of CAVES){if(cv.s===s.loc.scr){for(const[cx2,cy2]of cv.t){if(cx2===ftx&&cy2===fty){isCave=true;break;}}if(isCave)break;}}}
      mp2[fty][ftx]=isCave?T.ENTRANCE:T.FLOOR;
      s.msg={text:isCave?"A hidden cave!":(s.loc.ty==="dg"?"Bombed a wall! Secret passage!":"Secret passage!"),t:2000};
      s.pt.push(...Array.from({length:15},()=>({x:ftx*TL+16,y:fty*TL+16,dx:(Math.random()-.5)*6,dy:(Math.random()-.5)*6,l:700,c:["#fa3","#f83","#ff3","#aaa"][Math.random()*4|0]})));
    }
  }
  if((ky.has("c"))&&!s.bowCd&&p.rupees>0&&s.pArrows.length<3){
    p.rupees--;s.bowCd=true;setTimeout(()=>{if(stR.value)stR.value.bowCd=false;},400);
    sfx("sword");
    const adx=p.dir===1?5:p.dir===3?-5:0,ady=p.dir===0?-5:p.dir===2?5:0;
    s.pArrows.push({x:p.x+PS/2,y:p.y+PS/2,dx:adx,dy:ady,l:800});
  }
  if(s.sw.a){s.sw.t-=dt;if(s.sw.t<=0)s.sw.a=false;}if(p.ifr>0)p.ifr-=dt;
  for(let i=s.pt.length-1;i>=0;i--){const pt=s.pt[i];pt.x+=pt.dx*(dt/16);pt.y+=pt.dy*(dt/16);pt.l-=dt;if(pt.l<=0)s.pt.splice(i,1);}
  for(let i=s.dmgNums.length-1;i>=0;i--){const dn=s.dmgNums[i];dn.y-=1.2*(dt/16);dn.t-=dt;if(dn.t<=0)s.dmgNums.splice(i,1);}
  if(s.roomFlash>0)s.roomFlash-=dt;
  for(let i=s.drops.length-1;i>=0;i--){const d2=s.drops[i];d2.t+=dt;d2.y+=d2.vy*(dt/16);d2.vy+=0.15*(dt/16);
    if(d2.y>d2.ground){d2.y=d2.ground;d2.vy*=-0.5;if(Math.abs(d2.vy)<0.3)d2.vy=0;}
    const mdx=p.x+PS/2-d2.x,mdy=p.y+PS/2-d2.y,mdist=Math.hypot(mdx,mdy);
    if(mdist<40&&mdist>1){const pull=2.5*(1-mdist/40);d2.x+=mdx/mdist*pull*(dt/16);d2.y+=mdy/mdist*pull*(dt/16);}
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
  const rk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}`;
  for(let i=s.en.length-1;i>=0;i--){const e=s.en[i];e.mt+=dt;if(e.fl>0)e.fl-=dt;
    const pcx=p.x+PS/2,pcy=p.y+PS/2,ecx=e.x+ES/2,ecy=e.y+ES/2,dist=Math.hypot(pcx-ecx,pcy-ecy);
    e.stT+=dt;const detectRange=e.type==="boss"?250:120;const loseRange=180;
    if(e.st==="patrol"&&dist<detectRange)e.st="chase";
    if(e.st==="chase"&&dist>loseRange&&e.type!=="boss")e.st="retreat";
    if(e.st==="retreat"&&e.stT>2000){e.st="patrol";e.stT=0;}
    let es=e.type==="boss"?1.0:e.type==="ghost"?1.3:(e.type==="bat"||e.type==="fire_bat")?1.2:e.type==="archer"?0.8:e.type==="mage"?0.6:e.type==="knight"?1.1:1.0;
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
        e.hp--;e.fl=300;const kb=e.type==="boss"?10:18,kba=Math.atan2(ecy-pcy,ecx-pcx);e.x+=Math.cos(kba)*kb;e.y+=Math.sin(kba)*kb;
        sfx("hit",e.type==="boss"?"E2":"C3");
        s.dmgNums.push({x:ecx,y:ecy-8,t:600,val:1,c:e.type==="boss"?"#ff4":"#fff"});
        s.pt.push(...Array.from({length:5},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:300,c:"#fff"})));}}
    if(e.hp<=0){s.en.splice(i,1);
      s.pt.push(...Array.from({length:12},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:500,c:e.type==="boss"?"#fd3":"#f88"})));
      if(e.type==="boss"){sfx("bossdeath");s.shake.t=600;s.freeze=400;
        s.drops.push({x:ecx,y:ecy-8,vy:-4,ground:ecy,type:"heart",t:0},{x:ecx-10,y:ecy-8,vy:-3.5,ground:ecy,type:"heart",t:0},{x:ecx+10,y:ecy-8,vy:-3.5,ground:ecy,type:"bomb",t:0});
        const bossId=`${s.loc.di}:${e.name}`;
        if(!s.heartContainers.includes(bossId)){s.heartContainers.push(bossId);
          s.drops.push({x:ecx,y:ecy-12,vy:-5,ground:ecy,type:"heartcontainer",t:0});}
        if(s.loc.di>=0&&s.loc.di<3&&!p.tri[s.loc.di]){
          s.drops.push({x:ecx,y:-20,vy:0.5,ground:ecy-8,type:"triforce",t:0});
          s.triMu=true;}
        if(s.loc.di===3){s.won=true;s.msg={text:"The Dark King is defeated! Peace restored!",t:99999};}
      }else{sfx("kill");
        const dr2=Math.random();
        if(dr2<0.40){const dt2=Math.random();
          s.drops.push({x:ecx,y:ecy-4,vy:-3,ground:ecy,type:dt2<0.45?"heart":dt2<0.65?"bomb":dt2<0.85?"rupee_green":"rupee_blue",t:0});}}
      if(e.type==="boss")s.msg={text:`${e.name||"Boss"} defeated!`,t:2000};
      if(s.en.length===0){s.cl.add(rk);s.roomFlash=500;sfx("pickup");}
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
  const iR=W2-60;// rightmost item position
  c.font="bold 13px monospace";
  c.fillStyle="#8af";c.fillText(`\ud83d\udca3${p.bombs}`,iR-0,21);
  c.fillStyle="#fd3";c.fillText(`\ud83d\udd11${p.keys}`,iR-50,21);
  c.fillStyle="#4f4";c.fillText(`\ud83d\udc8e${p.rupees}`,iR-105,21);
  c.fillStyle="#fd3";c.font="bold 11px monospace";c.fillText("\ud83c\udff9",iR-130,21);c.font="bold 13px monospace";
  if(s.loc.ty==="dg"&&s.loc.di>=0){c.fillStyle=p.masterKey[s.loc.di]?"#c070ff":"#555";c.fillText(p.masterKey[s.loc.di]?"\ud83d\udddd\ufe0f":"\ud83d\udd12",iR+50,21);}
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
  c.fillStyle=iD?dg.color:"#2a3a28";c.fillRect(0,0,W2,H2);
  if(m)for(let y=0;y<RO;y++)for(let x=0;x<CO;x++){let tl=m[y][x];const px=x*TL,py=y*TL;
    const pk=`${loc.ty}:${loc.di}:${loc.scr}:${x},${y}`;
    if((tl===T.KEY||tl===T.MASTER_KEY||tl===T.HEART||tl===T.HEART_PIECE||tl===T.TRIFORCE||tl===T.BOMB||tl===T.RUPEE)&&s.pk.has(pk))tl=iD?T.FLOOR:T.GRASS;
    if((tl===T.DOOR||tl===T.BOSS_DOOR)&&s.dr.has(pk))tl=T.FLOOR;
    let ei=null;
    if(tl===T.ENTRANCE&&!iD){for(const de of DE){if(de.s===loc.scr){for(const tp of de.t){if(tp[0]===x&&tp[1]===y){ei={di:de.d,qx:x-de.t[0][0],qy:y-de.t[0][1]};break;}}if(ei)break;}}}
    dT(c,tl,px,py,iD,dg,t,ei);}
  if(!iD)drawTerrainOverlay(c,m,t);
  if(iD&&m){const torches=[];for(let y=0;y<RO;y++)for(let x=0;x<CO;x++)if(m[y][x]===T.TORCH)torches.push([x*TL+16,y*TL+16]);
    if(torches.length>0){for(const[tx2,ty2]of torches){
      const flk=Math.sin(t/200+tx2)*0.08+Math.sin(t/130+ty2)*0.05;
      const r2=90+Math.sin(t/180+tx2*0.1)*15;
      const tg=c.createRadialGradient(tx2,ty2,4,tx2,ty2,r2);
      tg.addColorStop(0,`rgba(255,200,100,${0.18+flk})`);tg.addColorStop(0.5,`rgba(255,150,50,${0.06+flk*0.3})`);tg.addColorStop(1,"rgba(255,100,30,0)");
      c.fillStyle=tg;c.fillRect(tx2-r2,ty2-r2,r2*2,r2*2);}}}
  if(iD){for(let i=0;i<15;i++){const dx2=hs(i,3,77)*W2,dy2=(hs(i,7,88)*H2+t/20)%H2;
    const da=0.15+Math.sin(t/600+i*2)*0.1;c.fillStyle=`rgba(200,180,140,${da})`;c.beginPath();c.arc(dx2+Math.sin(t/400+i)*8,dy2,0.8+hs(i,1,99)*0.8,0,Math.PI*2);c.fill();}}
  for(const e of s.en){const fl=e.fl>0&&Math.floor(e.fl/50)%2,sz=e.type==="boss"?ES*1.5:ES,ex=e.x+(ES-sz)/2,ey=e.y+(ES-sz)/2;
    c.fillStyle="rgba(0,0,0,0.15)";c.beginPath();c.ellipse(e.x+ES/2+3,e.y+ES-1,sz/2+1,4,0.1,0,Math.PI*2);c.fill();
    if(e.type==="ghost")dGh(c,ex,ey,sz,fl,t);else if(e.type==="boss")dBo(c,ex,ey,sz,fl,t,e.hp,e.mhp,loc.di);
    else if(e.type==="bat"||e.type==="fire_bat")dBt(c,ex,ey,sz,fl,t,e.type==="fire_bat");
    else if(e.type==="archer")dAr(c,ex,ey,sz,fl,t);
    else if(e.type==="mage")dMg(c,ex,ey,sz,fl,t);
    else if(e.type==="knight")dKn(c,ex,ey,sz,fl,t);
    else dSk(c,ex,ey,sz,fl,t);}
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
  for(const d2 of s.drops){const bob2=Math.sin(t/200)*2;
    if(d2.type==="heart"){c.fillStyle="#ee3333";dH(c,d2.x-6,d2.y-6+bob2,12);c.fillStyle="#ff8888";dH(c,d2.x-3,d2.y-4+bob2,6);}
    else if(d2.type==="heartcontainer"){
      const hcg=Math.sin(t/150)*0.2+0.4;c.fillStyle=`rgba(255,50,50,${hcg})`;c.beginPath();c.arc(d2.x,d2.y+bob2,12,0,Math.PI*2);c.fill();
      c.fillStyle="#ff2222";dH(c,d2.x-8,d2.y-8+bob2,16);c.fillStyle="#ff8888";dH(c,d2.x-4,d2.y-5+bob2,8);
      c.fillStyle="#fff";dH(c,d2.x-2,d2.y-3+bob2,4);}
    else if(d2.type==="triforce"){
      const tg2=Math.sin(t/150)*0.3+0.7;c.fillStyle=`rgba(253,211,51,${tg2*0.3})`;c.beginPath();c.arc(d2.x,d2.y+bob2,14,0,Math.PI*2);c.fill();
      c.fillStyle="#ffd633";c.beginPath();c.moveTo(d2.x,d2.y-8+bob2);c.lineTo(d2.x+10,d2.y+8+bob2);c.lineTo(d2.x-10,d2.y+8+bob2);c.fill();
      c.fillStyle="#ffe866";c.beginPath();c.moveTo(d2.x,d2.y-5+bob2);c.lineTo(d2.x+6,d2.y+5+bob2);c.lineTo(d2.x-6,d2.y+5+bob2);c.fill();}
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
  if(!iD){const amb=Math.sin(t/15000)*0.03;
    c.fillStyle=amb>0?`rgba(255,200,100,${amb})`:`rgba(100,150,255,${-amb})`;c.fillRect(0,0,W2,H2);}
  const vig=c.createRadialGradient(W2/2,H2/2,W2*0.3,W2/2,H2/2,W2*0.75);
  vig.addColorStop(0,"rgba(0,0,0,0)");vig.addColorStop(0.7,iD?"rgba(0,0,0,0.15)":"rgba(0,0,0,0)");vig.addColorStop(1,iD?"rgba(0,0,0,0.4)":"rgba(0,0,10,0.12)");
  c.fillStyle=vig;c.fillRect(0,0,W2,H2);
  if(iD&&dg&&dg.rooms){const rks=Object.keys(dg.rooms),cds=rks.map(k=>k.split(",").map(Number));
    const nX=Math.min(...cds.map(c2=>c2[0])),xX=Math.max(...cds.map(c2=>c2[0])),nY=Math.min(...cds.map(c2=>c2[1])),xY=Math.max(...cds.map(c2=>c2[1]));
    const ms=20,mp=8,mW=(xX-nX+1)*ms+mp*2,mH=(xY-nY+1)*ms+mp*2,mmX=W2-mW-6,mmY=6;
    // Background
    c.fillStyle="rgba(0,0,0,0.9)";c.fillRect(mmX-3,mmY-3,mW+6,mH+6);
    c.strokeStyle="#fd3";c.lineWidth=2;c.strokeRect(mmX-3,mmY-3,mW+6,mH+6);
    // Dungeon name
    c.fillStyle="#fd3";c.font="bold 8px monospace";c.textAlign="center";c.fillText(dg.name,mmX+mW/2,mmY+mH+12);c.textAlign="left";
    // Rooms
    for(const rk of rks){const[cx,cy]=rk.split(",").map(Number);
      const rx=mmX+mp+(cx-nX)*ms+1,ry=mmY+mp+(cy-nY)*ms+1,rw=ms-2,rh=ms-2;
      if(rk===loc.scr){c.fillStyle="#fd3";c.fillRect(rx,ry,rw,rh);c.strokeStyle="#fff";c.lineWidth=2;c.strokeRect(rx-1,ry-1,rw+2,rh+2);}
      else{c.fillStyle=s.cl.has(`dg:${loc.di}:${rk}`)?"#5a8a5a":"#336";c.fillRect(rx,ry,rw,rh);c.strokeStyle="rgba(255,255,255,0.2)";c.lineWidth=1;c.strokeRect(rx,ry,rw,rh);}}}
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
  c.restore();
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
  if(s.paused&&!s.mapOpen){c.fillStyle="rgba(0,0,0,0.6)";c.fillRect(0,0,W2,FH2);
    c.fillStyle="#fff";c.font="bold 28px monospace";c.textAlign="center";c.fillText("PAUSED",W2/2,FH2/2-10);
    c.fillStyle="#aaa";c.font="13px monospace";c.fillText("Press P to resume",W2/2,FH2/2+20);c.textAlign="left";}
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
      {icon:"\ud83d\udca3",label:"Bombs",val:p.bombs,col:"#8af"},
      {icon:"\ud83d\udc8e",label:"Rupees",val:p.rupees,col:"#4f4"},
      {icon:"\u2764\ufe0f",label:"HP",val:`${p.hp}/${p.mhp}`,col:"#f44"},
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
    if (e.key.toLowerCase() === "p" && s && !s.title && !s.go && !s.won) { s.paused = !s.paused; }
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
