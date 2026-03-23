import { useState, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";

// ========== CUSTOM DEFAULT MUSIC ==========
// Paste URLs here to auto-load custom music on startup.
// Supports any direct audio URL (MP3, OGG, WAV, M4A).
// Leave as null to use the built-in synthesized theme.
const DEFAULT_MUSIC = {
  title: null,
  overworld: null,
  forest: null,
  fire: null,
  shadow: null,
  triforce: null,  // plays when boss is defeated and triforce appears
};

// ============ MUSIC — 4 RICH THEMES, 3 VOICES EACH ============
const MUSIC = {
  // OVERWORLD — Heroic march, D major. FM strings lead, sine pad, triangle bass.
  overworld: { tempo: 138,
    lead: ["D5","E5","F#5","A5","F#5","D5","A4",null,"B4","C#5","D5","F#5","E5","D5",null,null,
      "A5","B5","A5","F#5","D5","E5","F#5",null,"G5","F#5","E5","D5","C#5","D5",null,null,
      "D5","F#5","A5","B5","A5","F#5","G5","F#5","E5","D5",null,null,"E5","F#5","G5","A5",
      "B5","A5","G5","F#5","E5","D5","E5","D5",null,null,null,null,null,null,null,null],
    pad: ["D4","D4","D4","D4","A3","A3","A3","A3","G3","G3","G3","G3","A3","A3","A3","A3",
      "D4","D4","D4","D4","B3","B3","B3","B3","G3","G3","G3","G3","A3","A3","A3","A3",
      "D4","D4","D4","D4","G3","G3","G3","G3","E4","E4","E4","E4","C4","C4","C4","C4",
      "G3","G3","G3","G3","A3","A3","A3","A3","D4","D4",null,null,null,null,null,null],
    bass: ["D2",null,"D3",null,"A1",null,"A2",null,"G2",null,"G3",null,"A2",null,"A2",null,
      "D2",null,"D3",null,"B1",null,"B2",null,"G2",null,"G2",null,"A2",null,"A2",null,
      "D2",null,"D3",null,"G2",null,"G3",null,"E2",null,"E2",null,"A1",null,"A2",null,
      "G2",null,"G2",null,"A2",null,"A1",null,"D2",null,null,null,null,null,null,null],
    drums: ["K",null,"S",null,"K",null,"S",null,"K",null,"S",null,"K",null,"S","K",
      "K",null,"S",null,"K",null,"S",null,"K",null,"S",null,"K","S","K","S",
      "K",null,"S",null,"K",null,"S",null,"K","K","S",null,"K",null,"S","K",
      "K",null,"S",null,"K",null,"S","S","K",null,null,null,null,null,null,null],
  },
  // FOREST — Ethereal A minor. Gentle FM lead, sustained pad, sparse bass.
  forest: { tempo: 96,
    lead: ["E4",null,"A4","B4","C5",null,"B4","A4","G4",null,"F4","E4","D4",null,null,null,
      "A4",null,"C5","D5","E5",null,"D5","C5","B4","A4","G4","A4",null,null,null,null,
      "E5",null,"D5","C5","B4","A4","G4","A4","B4",null,"C5","B4","A4",null,null,null,
      "C5","B4","A4","G4","F4","E4","D4","E4",null,null,null,null,null,null,null,null],
    pad: ["A3","A3","A3","A3","F3","F3","F3","F3","C3","C3","C3","C3","G3","G3","G3","G3",
      "A3","A3","A3","A3","F3","F3","F3","F3","E3","E3","E3","E3","A3","A3","A3","A3",
      "A3","A3","A3","A3","F3","F3","F3","F3","G3","G3","G3","G3","E3","E3","E3","E3",
      "F3","F3","E3","E3","D3","D3","G3","G3","A3","A3",null,null,null,null,null,null],
    bass: ["A1",null,null,null,"F2",null,null,null,"C2",null,null,null,"G1",null,null,null,
      "A1",null,null,null,"F2",null,null,null,"E2",null,null,null,"A1",null,null,null,
      "A1",null,null,null,"F2",null,null,null,"G2",null,null,null,"E2",null,null,null,
      "F2",null,"E2",null,"D2",null,"G1",null,"A1",null,null,null,null,null,null,null],
    drums: [null,null,null,null,null,null,"S",null,null,null,null,null,null,null,null,null,
      null,null,null,null,null,null,"S",null,null,null,null,null,null,null,null,null,
      null,null,null,null,"S",null,null,null,null,null,null,null,null,null,"S",null,
      null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  },
  // FIRE — Furious D minor. Aggressive FM lead, power pad, driving bass+drums.
  fire: { tempo: 160,
    lead: ["D5","F5","A5","G5","F5","E5","D5","C#5","D5","E5","F5","G5","A5","Bb5","A5","G5",
      "F5","E5","D5","C#5","D5","F5","A5",null,"Bb5","A5","G5","F5","E5","D5",null,null,
      "A5","Bb5","A5","G5","F5","A5","D6","A5","G5","F5","E5","D5","C#5","D5",null,null,
      "F5","E5","D5","C#5","D5","E5","F5","E5","D5",null,null,null,null,null,null,null],
    pad: ["D4","D4","D4","D4","Bb3","Bb3","A3","A3","D4","D4","D4","D4","Bb3","Bb3","A3","A3",
      "D4","D4","D4","D4","Bb3","Bb3","Bb3","Bb3","G3","G3","G3","G3","A3","A3","A3","A3",
      "D4","D4","D4","D4","Bb3","Bb3","Bb3","Bb3","G3","G3","A3","A3","D4","D4","D4","D4",
      "D4","D4","A3","A3","D4","D4","D4","D4","D4",null,null,null,null,null,null,null],
    bass: ["D2","D3","D2","D3","Bb1","Bb2","A1","A2","D2","D3","D2","D3","Bb1","Bb2","A1","A2",
      "D2","D3","D2","D3","Bb1","Bb2","Bb1","Bb2","G2","G3","G2","G3","A1","A2","A1","A2",
      "D2","D3","D2","D3","Bb1","Bb2","Bb1","Bb2","G2","G3","A1","A2","D2","D3","D2","D3",
      "D2","D3","A1","A2","D2","D3","D2","D3","D2",null,null,null,null,null,null,null],
    drums: ["K","S","K","S","K","S","K","S","K","S","K","S","K","S","K","S",
      "K","S","K","S","K","S","K","S","K","S","K","S","K","S","K","S",
      "K","S","K","S","K","S","K","S","K","K","S","S","K","S","K","S",
      "K","S","K","S","K","K","S","K","K",null,null,null,null,null,null,null],
  },
  // SHADOW — Doom dirge C minor. Slow organ pad, creeping FM lead, deep bass.
  shadow: { tempo: 62,
    lead: ["C4",null,null,"Eb4",null,null,"G4","F#4","G4",null,null,null,null,null,null,null,
      "Ab4",null,null,"G4","F4","Eb4","D4",null,null,null,null,null,null,null,null,null,
      "Eb4",null,"F4","F#4",null,null,"G4",null,"Ab4","Bb4","Ab4","G4","F4","Eb4","D4",null,
      "C4",null,"Eb4",null,"D4",null,"C4",null,null,null,null,null,null,null,null,null],
    pad: ["C3","C3","C3","C3","Ab2","Ab2","Ab2","Ab2","G2","G2","G2","G2","G2","G2","G2","G2",
      "Ab2","Ab2","Ab2","Ab2","Eb3","Eb3","G2","G2","C3","C3","C3","C3","C3","C3","C3","C3",
      "Eb3","Eb3","Eb3","Eb3","D3","D3","D3","D3","Ab2","Ab2","Bb2","Bb2","G2","G2","G2","G2",
      "C3","C3","C3","C3","G2","G2","C3","C3","C3",null,null,null,null,null,null,null],
    bass: ["C2",null,null,null,"Ab1",null,null,null,"G1",null,null,null,null,null,null,null,
      "Ab1",null,null,null,"Eb2",null,"G1",null,"C2",null,null,null,null,null,null,null,
      "Eb2",null,null,null,"D2",null,"F#1",null,"Ab1",null,"Bb1",null,"G1",null,null,null,
      "C2",null,"Ab1",null,"G1",null,"C2",null,null,null,null,null,null,null,null,null],
    drums: ["K",null,null,null,null,null,null,null,"K",null,null,null,null,null,null,null,
      "K",null,null,null,null,null,null,null,null,null,null,null,"S",null,null,null,
      "K",null,null,null,null,null,null,null,"K",null,null,null,"S",null,"K",null,
      "K",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  },
  // TITLE — Mystical and majestic, slow G major. Sets the tone for adventure.
  title: { tempo: 80,
    lead: ["G4",null,null,null,"B4",null,null,null,"D5",null,null,null,"G5",null,null,null,
      "F#5",null,null,null,"E5",null,null,null,"D5",null,"C5",null,"B4",null,null,null,
      "C5",null,null,null,"D5",null,null,null,"E5",null,"D5",null,"B4",null,null,null,
      "A4",null,"B4",null,"G4",null,null,null,null,null,null,null,null,null,null,null,
      "G4",null,"A4",null,"B4",null,null,null,"D5",null,"E5",null,"D5",null,"B4",null,
      "C5",null,null,null,"E5",null,null,null,"G5",null,"F#5",null,"E5",null,"D5",null,
      "E5",null,null,null,"D5",null,null,null,"B4",null,null,null,"A4",null,null,null,
      "G4",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    pad: ["G3","G3","G3","G3","G3","G3","G3","G3","D3","D3","D3","D3","G3","G3","G3","G3",
      "A3","A3","A3","A3","C4","C4","C4","C4","G3","G3","G3","G3","G3","G3","G3","G3",
      "C4","C4","C4","C4","D4","D4","D4","D4","E4","E4","E4","E4","G3","G3","G3","G3",
      "A3","A3","A3","A3","G3","G3","G3","G3","G3",null,null,null,null,null,null,null,
      "G3","G3","G3","G3","G3","G3","G3","G3","D4","D4","D4","D4","G3","G3","G3","G3",
      "C4","C4","C4","C4","E4","E4","E4","E4","G3","G3","G3","G3","D4","D4","D4","D4",
      "C4","C4","C4","C4","G3","G3","G3","G3","D3","D3","D3","D3","C3","C3","C3","C3",
      "G3","G3","G3","G3",null,null,null,null,null,null,null,null,null,null,null,null],
    bass: ["G1",null,null,null,null,null,null,null,"D2",null,null,null,null,null,null,null,
      "A1",null,null,null,null,null,null,null,"G1",null,null,null,null,null,null,null,
      "C2",null,null,null,null,null,null,null,"E2",null,null,null,null,null,null,null,
      "A1",null,null,null,"G1",null,null,null,null,null,null,null,null,null,null,null,
      "G1",null,null,null,null,null,null,null,"D2",null,null,null,null,null,null,null,
      "C2",null,null,null,null,null,null,null,"G1",null,null,null,"D2",null,null,null,
      "C2",null,null,null,"G1",null,null,null,"D2",null,null,null,"C2",null,null,null,
      "G1",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    drums: ["K",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
      null,null,null,null,null,null,null,null,"K",null,null,null,null,null,null,null,
      "K",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
      null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
      "K",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
      null,null,null,null,null,null,null,null,"K",null,null,null,"S",null,null,null,
      "K",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
      "K",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  },
  // TRIFORCE — Triumphant ascending fanfare, G major. Plays when triforce appears.
  triforce: { tempo: 100,
    lead: ["G4",null,"B4",null,"D5",null,"G5",null,"B5",null,null,null,"A5",null,"G5",null,
      "F#5",null,"G5",null,"A5",null,"B5",null,"D6",null,null,null,null,null,null,null,
      "B5",null,"A5",null,"G5",null,"F#5",null,"G5",null,null,null,"A5",null,"B5",null,
      "G5",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    pad: ["G3","G3","G3","G3","G3","G3","G3","G3","D4","D4","D4","D4","D4","D4","D4","D4",
      "C4","C4","C4","C4","D4","D4","D4","D4","G4","G4","G4","G4","G4","G4","G4","G4",
      "E4","E4","E4","E4","D4","D4","D4","D4","C4","C4","C4","C4","D4","D4","D4","D4",
      "G3","G3","G3","G3","G3","G3","G3","G3","G3",null,null,null,null,null,null,null],
    bass: ["G1",null,null,null,"G2",null,null,null,"D2",null,null,null,"D2",null,null,null,
      "C2",null,null,null,"D2",null,null,null,"G2",null,null,null,"G1",null,null,null,
      "E2",null,null,null,"D2",null,null,null,"C2",null,null,null,"D2",null,null,null,
      "G1",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    drums: ["K",null,null,null,"K",null,null,null,"K",null,"S",null,"K",null,null,null,
      "K",null,null,null,"K",null,"S",null,"K",null,"S",null,"K","S","K","S",
      "K",null,null,null,"K",null,null,null,null,null,null,null,null,null,"S",null,
      "K",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  },
};

// Orchestral audio engine — FM lead, sine pad, triangle bass, membrane drums. No effects chain.
let au={i:false,p:false,c:null,synths:{},ps:[]};
function initAu(){if(au.i)return;
  // Lead — FMSynth for warm string/brass tone
  au.synths.lead=new Tone.FMSynth({harmonicity:2,modulationIndex:3,
    oscillator:{type:"sine"},modulation:{type:"sine"},
    envelope:{attack:0.04,decay:0.2,sustain:0.35,release:0.3},
    modulationEnvelope:{attack:0.02,decay:0.1,sustain:0.2,release:0.2},
    volume:-14}).toDestination();
  // Pad — sustained sine for organ/choir feel
  au.synths.pad=new Tone.Synth({oscillator:{type:"sine"},
    envelope:{attack:0.3,decay:0.5,sustain:0.7,release:0.8},volume:-22}).toDestination();
  // Bass — triangle, punchy
  au.synths.bass=new Tone.Synth({oscillator:{type:"triangle"},
    envelope:{attack:0.01,decay:0.15,sustain:0.4,release:0.15},volume:-16}).toDestination();
  // Drums
  au.synths.kick=new Tone.MembraneSynth({pitchDecay:0.05,octaves:6,
    envelope:{attack:0.001,decay:0.25,sustain:0,release:0.1},volume:-12}).toDestination();
  au.synths.snare=new Tone.NoiseSynth({noise:{type:"white"},
    envelope:{attack:0.001,decay:0.1,sustain:0,release:0.06},volume:-18}).toDestination();
  au.i=true;}

function playTh(n){if(!au.i)initAu();if(au.c===n&&au.p)return;stopMu();const th=MUSIC[n];if(!th)return;
  Tone.getTransport().bpm.value=th.tempo;
  const mk=(sy,ns,dur)=>{const p=new Tone.Sequence((tm,nt)=>{if(nt&&sy)try{sy.triggerAttackRelease(nt,dur,tm)}catch(e){}},ns,"8n");p.loop=true;p.start(0);return p;};
  au.ps.push(mk(au.synths.lead,th.lead,"8n"));
  au.ps.push(mk(au.synths.pad,th.pad,"4n"));
  au.ps.push(mk(au.synths.bass,th.bass,"4n"));
  // Drums
  const dp=new Tone.Sequence((tm,nt)=>{if(!nt)return;try{
    if(nt==="K")au.synths.kick.triggerAttackRelease("C1","8n",tm);
    else if(nt==="S")au.synths.snare.triggerAttackRelease("16n",tm);
  }catch(e){}},th.drums,"8n");dp.loop=true;dp.start(0);au.ps.push(dp);
  Tone.getTransport().start();au.p=true;au.c=n;}

function stopMu(){Tone.getTransport().stop();Tone.getTransport().position=0;Tone.getTransport().cancel();au.ps.forEach(p=>{try{p?.stop();p?.dispose();}catch(e){}});au.ps=[];au.p=false;au.c=null;}


// ============ SOUND EFFECTS ============
let sfxReady=false,sfxSynths={};
function initSfx(){if(sfxReady)return;
  sfxSynths.hit=new Tone.Synth({oscillator:{type:"sawtooth"},envelope:{attack:0.001,decay:0.08,sustain:0,release:0.05},volume:-12}).toDestination();
  sfxSynths.sword=new Tone.NoiseSynth({noise:{type:"white"},envelope:{attack:0.001,decay:0.06,sustain:0,release:0.03},volume:-18}).toDestination();
  sfxSynths.pickup=new Tone.Synth({oscillator:{type:"square"},envelope:{attack:0.001,decay:0.12,sustain:0.1,release:0.1},volume:-14}).toDestination();
  sfxSynths.door=new Tone.NoiseSynth({noise:{type:"brown"},envelope:{attack:0.01,decay:0.3,sustain:0,release:0.1},volume:-14}).toDestination();
  sfxSynths.bomb=new Tone.NoiseSynth({noise:{type:"white"},envelope:{attack:0.001,decay:0.4,sustain:0.05,release:0.2},volume:-8}).toDestination();
  sfxSynths.hurt=new Tone.Synth({oscillator:{type:"square"},envelope:{attack:0.001,decay:0.15,sustain:0,release:0.1},volume:-10}).toDestination();
  sfxSynths.fanfare=new Tone.Synth({oscillator:{type:"square"},envelope:{attack:0.01,decay:0.2,sustain:0.3,release:0.3},volume:-12}).toDestination();
  sfxReady=true;}
function sfx(name,note){if(!sfxReady)return;try{
  if(name==="sword")sfxSynths.sword.triggerAttackRelease("16n");
  else if(name==="hit")sfxSynths.hit.triggerAttackRelease(note||"C3","16n");
  else if(name==="pickup"){sfxSynths.pickup.triggerAttackRelease("E5","16n");setTimeout(()=>{try{sfxSynths.pickup.triggerAttackRelease("G5","16n")}catch(e){}},80);setTimeout(()=>{try{sfxSynths.pickup.triggerAttackRelease("C6","8n")}catch(e){}},160);}
  else if(name==="door")sfxSynths.door.triggerAttackRelease("8n");
  else if(name==="bomb")sfxSynths.bomb.triggerAttackRelease("4n");
  else if(name==="hurt")sfxSynths.hurt.triggerAttackRelease("E2","8n");
  else if(name==="kill"){sfxSynths.hit.triggerAttackRelease("A4","16n");setTimeout(()=>{try{sfxSynths.hit.triggerAttackRelease("E4","16n")}catch(e){}},60);}
  else if(name==="bossdeath"){const ns=["D5","F#5","A5","D6"];ns.forEach((n2,i)=>setTimeout(()=>{try{sfxSynths.fanfare.triggerAttackRelease(n2,"8n")}catch(e){}},i*150));}
  else if(name==="triforce"){const ns=["A4","C#5","E5","A5","C#6","E6"];ns.forEach((n2,i)=>setTimeout(()=>{try{sfxSynths.fanfare.triggerAttackRelease(n2,"8n")}catch(e){}},i*120));}
}catch(e){}}

// ============ TILES ============
const T={EMPTY:0,WALL:1,GRASS:2,WATER:3,TREE:4,ENTRANCE:5,FLOOR:6,DOOR:7,KEY:8,HEART:9,BOSS_DOOR:10,
  STAIRS_UP:13,SAND:14,BRIDGE:15,FLOWER:16,PATH:17,ROCK:18,TRIFORCE:20,BUSH:21,TALLGRASS:22,STUMP:23,TORCH:24,CRACK:25,BOMB:26,PUSH:27,LEVER:28,PLATE:29,PIT:30,SPIKE:31};
const TL=32,CO=16,RO=12,W2=CO*TL,H2=RO*TL,HH=32,PS=24,ES=24,SR=30,SD=250,IFR=800;
const SOLID=new Set([T.WALL,T.WATER,T.TREE,T.ROCK,T.BUSH,T.CRACK,T.PUSH]);

function mr(cb){const m=Array.from({length:RO},()=>Array(CO).fill(T.FLOOR));for(let i=0;i<CO;i++){m[0][i]=T.WALL;m[RO-1][i]=T.WALL;}for(let i=0;i<RO;i++){m[i][0]=T.WALL;m[i][CO-1]=T.WALL;}cb?.(m);return m;}
function ae(m,exits){for(const ex of exits){const tp=ex.includes("D")?T.DOOR:ex.includes("B")?T.BOSS_DOOR:T.FLOOR;
  if(ex[0]==="N"){m[0][7]=tp;m[0][8]=tp;}if(ex[0]==="S"){m[RO-1][7]=tp;m[RO-1][8]=tp;}
  if(ex[0]==="E"){m[5][CO-1]=tp;m[6][CO-1]=tp;}if(ex[0]==="W"){m[5][0]=tp;m[6][0]=tp;}}}
function oe(m,s,t2){const t=t2||T.GRASS;
  // Clear the edge AND lay a visible path corridor leading to it
  if(s==="N"){for(let c=5;c<=10;c++){m[0][c]=t;m[1][c]=T.PATH;m[2][c]=T.PATH;}}
  if(s==="S"){for(let c=5;c<=10;c++){m[RO-1][c]=t;m[RO-2][c]=T.PATH;m[RO-3][c]=T.PATH;}}
  if(s==="W"){for(let r=3;r<=8;r++){m[r][0]=t;m[r][1]=T.PATH;m[r][2]=T.PATH;}}
  if(s==="E"){for(let r=3;r<=8;r++){m[r][CO-1]=t;m[r][CO-2]=T.PATH;m[r][CO-3]=T.PATH;}}}

// ============ OVERWORLD — 12 screens (4x3 grid), hidden caves, overworld enemies ============
// Layout:  0,0(forest) 1,0(plains) 2,0(desert) 3,0(canyon)
//          0,1(swamp)  1,1(spawn)  2,1(lake)   3,1(ruins)
//          0,2(deep)   1,2(south)  2,2(beach)  3,2(volcano)
// Overworld enemy definitions per screen
const OW_EN={
  "0,0":[{x:3*TL,y:3*TL,hp:2,type:"skeleton"},{x:10*TL,y:8*TL,hp:2,type:"bat"}],
  "1,0":[{x:4*TL,y:6*TL,hp:1,type:"bat"},{x:11*TL,y:4*TL,hp:1,type:"bat"}],
  "2,0":[{x:5*TL,y:4*TL,hp:2,type:"skeleton"},{x:10*TL,y:8*TL,hp:2,type:"skeleton"}],
  "3,0":[{x:6*TL,y:5*TL,hp:3,type:"skeleton"},{x:10*TL,y:7*TL,hp:2,type:"bat"}],
  "0,1":[{x:4*TL,y:4*TL,hp:2,type:"bat"},{x:11*TL,y:7*TL,hp:2,type:"skeleton"}],
  "1,1":[],
  "2,1":[{x:3*TL,y:5*TL,hp:1,type:"bat"}],
  "3,1":[{x:5*TL,y:4*TL,hp:3,type:"ghost"},{x:10*TL,y:7*TL,hp:3,type:"ghost"}],
  "0,2":[{x:4*TL,y:5*TL,hp:2,type:"skeleton"},{x:11*TL,y:6*TL,hp:3,type:"skeleton"}],
  "1,2":[{x:6*TL,y:4*TL,hp:1,type:"bat"},{x:9*TL,y:8*TL,hp:1,type:"bat"}],
  "2,2":[],
  "3,2":[{x:5*TL,y:5*TL,hp:3,type:"fire_bat"},{x:10*TL,y:6*TL,hp:3,type:"fire_bat"},{x:7*TL,y:8*TL,hp:3,type:"skeleton"}],
};
const OW={
  // 0,0: FOREST — Dungeon 1 entrance, dense trees, pond
  "0,0":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
    for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
    m[1][1]=T.TREE;m[1][2]=T.TREE;m[1][13]=T.TREE;m[2][1]=T.TREE;m[10][1]=T.TREE;m[10][2]=T.TREE;m[2][14]=T.TREE;
    m[2][5]=T.TREE;m[2][6]=T.TREE;m[3][3]=T.TREE;m[3][4]=T.TREE;m[8][3]=T.TREE;m[9][4]=T.TREE;
    m[2][10]=T.TREE;m[3][11]=T.TREE;m[3][12]=T.TREE;m[8][12]=T.TREE;m[9][10]=T.TREE;
    m[3][6]=T.WATER;m[3][7]=T.WATER;m[4][5]=T.WATER;m[4][6]=T.WATER;m[4][7]=T.WATER;
    m[5][7]=T.ENTRANCE;m[5][8]=T.ENTRANCE;m[6][7]=T.ENTRANCE;m[6][8]=T.ENTRANCE;
    m[4][6]=T.ROCK;m[4][9]=T.ROCK;m[7][6]=T.ROCK;m[7][9]=T.ROCK;
    m[7][7]=T.PATH;m[7][8]=T.PATH;m[8][7]=T.PATH;m[8][8]=T.PATH;
    m[6][3]=T.FLOWER;m[6][4]=T.FLOWER;m[7][11]=T.TALLGRASS;m[8][5]=T.TALLGRASS;
    oe(m,"E");oe(m,"S");return m;})(),
  // 1,0: PLAINS — Open grassland, flowers, gentle
  "1,0":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
    for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
    m[3][5]=T.FLOWER;m[3][6]=T.FLOWER;m[4][5]=T.FLOWER;m[3][10]=T.FLOWER;m[4][10]=T.FLOWER;
    m[7][3]=T.TALLGRASS;m[7][4]=T.TALLGRASS;m[8][11]=T.TALLGRASS;m[8][12]=T.TALLGRASS;
    m[5][8]=T.BUSH;m[6][3]=T.BUSH;m[2][12]=T.STUMP;m[9][4]=T.STUMP;
    // Hidden cave sealed by cracked rock at 2,3
    m[2][2]=T.TREE;m[2][3]=T.CRACK;
    oe(m,"W");oe(m,"E");oe(m,"S");return m;})(),
  // 2,0: DESERT — Sandy, rocks, Dungeon 3
  "2,0":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.SAND));
    for(let i=0;i<CO;i++){m[0][i]=T.ROCK;m[RO-1][i]=T.ROCK;}for(let i=0;i<RO;i++){m[i][0]=T.ROCK;m[i][CO-1]=T.ROCK;}
    m[1][5]=T.ROCK;m[1][10]=T.ROCK;m[9][4]=T.ROCK;m[9][11]=T.ROCK;
    m[3][3]=T.ROCK;m[4][3]=T.ROCK;m[3][12]=T.ROCK;m[8][12]=T.ROCK;
    m[7][10]=T.WATER;m[7][11]=T.WATER;m[8][10]=T.WATER;m[6][10]=T.BUSH;m[6][11]=T.TALLGRASS;
    m[5][7]=T.ENTRANCE;m[5][8]=T.ENTRANCE;m[6][7]=T.ENTRANCE;m[6][8]=T.ENTRANCE;
    m[4][7]=T.PATH;m[4][8]=T.PATH;m[7][7]=T.PATH;m[7][8]=T.PATH;
    oe(m,"W",T.SAND);oe(m,"E",T.SAND);oe(m,"S",T.SAND);return m;})(),
  // 3,0: CANYON — Rocky terrain, narrow paths
  "3,0":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.SAND));
    for(let i=0;i<CO;i++){m[0][i]=T.ROCK;m[RO-1][i]=T.ROCK;}for(let i=0;i<RO;i++){m[i][0]=T.ROCK;m[i][CO-1]=T.ROCK;}
    m[2][3]=T.ROCK;m[2][4]=T.ROCK;m[3][3]=T.ROCK;m[2][11]=T.ROCK;m[2][12]=T.ROCK;m[3][12]=T.ROCK;
    m[8][3]=T.ROCK;m[8][4]=T.ROCK;m[9][3]=T.ROCK;m[8][11]=T.ROCK;m[8][12]=T.ROCK;m[9][12]=T.ROCK;
    m[5][6]=T.PATH;m[5][7]=T.PATH;m[5][8]=T.PATH;m[5][9]=T.PATH;m[6][6]=T.PATH;m[6][7]=T.PATH;m[6][8]=T.PATH;m[6][9]=T.PATH;
    // Hidden cave sealed by cracked rock
    m[4][10]=T.CRACK;m[3][10]=T.ROCK;
    m[2][7]=T.STUMP;m[9][7]=T.STUMP;
    oe(m,"W",T.SAND);oe(m,"S",T.SAND);return m;})(),
  // 0,1: DEEP WOODS — Dungeon 2, dense forest
  "0,1":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
    for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
    m[1][3]=T.TREE;m[1][4]=T.TREE;m[1][10]=T.TREE;m[1][11]=T.TREE;m[1][12]=T.TREE;
    m[2][2]=T.TREE;m[2][3]=T.TREE;m[2][12]=T.TREE;m[2][13]=T.TREE;
    m[3][2]=T.TREE;m[3][13]=T.TREE;m[4][2]=T.TREE;m[4][12]=T.TREE;
    m[7][2]=T.TREE;m[7][13]=T.TREE;m[8][2]=T.TREE;m[8][13]=T.TREE;
    m[9][2]=T.TREE;m[9][3]=T.TREE;m[9][12]=T.TREE;m[9][13]=T.TREE;
    m[10][3]=T.TREE;m[10][4]=T.TREE;m[10][10]=T.TREE;m[10][11]=T.TREE;
    m[5][7]=T.ENTRANCE;m[5][8]=T.ENTRANCE;m[6][7]=T.ENTRANCE;m[6][8]=T.ENTRANCE;
    m[3][5]=T.PATH;m[3][6]=T.PATH;m[3][7]=T.PATH;m[3][8]=T.PATH;m[3][9]=T.PATH;m[3][10]=T.PATH;
    m[5][4]=T.PATH;m[5][5]=T.PATH;m[5][6]=T.PATH;m[6][4]=T.PATH;m[6][5]=T.PATH;m[6][6]=T.PATH;
    m[8][5]=T.PATH;m[8][6]=T.PATH;m[8][7]=T.PATH;m[8][8]=T.PATH;m[8][9]=T.PATH;m[8][10]=T.PATH;
    m[4][4]=T.TALLGRASS;m[7][10]=T.TALLGRASS;m[2][7]=T.BUSH;m[9][7]=T.BUSH;
    oe(m,"N");oe(m,"E");oe(m,"S");return m;})(),
  // 1,1: SPAWN VILLAGE — Central hub, fountain, safe
  "1,1":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
    for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
    for(let c2=2;c2<=13;c2++){m[5][c2]=T.PATH;m[6][c2]=T.PATH;}
    for(let r=1;r<=10;r++){m[r][7]=T.PATH;m[r][8]=T.PATH;}
    m[5][7]=T.WATER;m[5][8]=T.WATER;m[6][7]=T.WATER;m[6][8]=T.WATER;
    m[4][7]=T.ROCK;m[4][8]=T.ROCK;m[7][7]=T.ROCK;m[7][8]=T.ROCK;m[5][6]=T.ROCK;m[6][6]=T.ROCK;m[5][9]=T.ROCK;m[6][9]=T.ROCK;
    m[2][3]=T.FLOWER;m[2][4]=T.FLOWER;m[3][3]=T.FLOWER;m[3][12]=T.FLOWER;m[2][11]=T.FLOWER;m[2][12]=T.FLOWER;
    m[8][3]=T.BUSH;m[8][12]=T.BUSH;m[9][4]=T.STUMP;m[9][11]=T.STUMP;
    m[1][4]=T.TREE;m[1][11]=T.TREE;m[10][4]=T.TREE;m[10][11]=T.TREE;
    oe(m,"W");oe(m,"N");oe(m,"E");oe(m,"S");return m;})(),
  // 2,1: LAKE — Large water body, bridge crossing
  "2,1":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
    for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
    for(let r=2;r<=9;r++)for(let c2=5;c2<=11;c2++)m[r][c2]=T.WATER;
    m[5][5]=T.BRIDGE;m[5][6]=T.BRIDGE;m[5][7]=T.BRIDGE;m[5][8]=T.BRIDGE;m[5][9]=T.BRIDGE;m[5][10]=T.BRIDGE;m[5][11]=T.BRIDGE;
    m[6][5]=T.BRIDGE;m[6][6]=T.BRIDGE;m[6][7]=T.BRIDGE;m[6][8]=T.BRIDGE;m[6][9]=T.BRIDGE;m[6][10]=T.BRIDGE;m[6][11]=T.BRIDGE;
    m[2][3]=T.TALLGRASS;m[9][3]=T.TALLGRASS;m[2][12]=T.BUSH;m[9][12]=T.BUSH;
    m[4][3]=T.FLOWER;m[7][12]=T.FLOWER;
    oe(m,"W");oe(m,"E");oe(m,"N");oe(m,"S");return m;})(),
  // 3,1: RUINS — Ancient stone ruins, ghosts, Dungeon entrance appears here when all 3 triforce collected
  "3,1":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
    for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
    m[3][4]=T.ROCK;m[3][5]=T.ROCK;m[3][10]=T.ROCK;m[3][11]=T.ROCK;
    m[8][4]=T.ROCK;m[8][5]=T.ROCK;m[8][10]=T.ROCK;m[8][11]=T.ROCK;
    m[4][4]=T.ROCK;m[4][11]=T.ROCK;m[7][4]=T.ROCK;m[7][11]=T.ROCK;
    // Center area — final dungeon entrance placed dynamically
    m[5][7]=T.ROCK;m[5][8]=T.ROCK;m[6][7]=T.ROCK;m[6][8]=T.ROCK;
    m[4][6]=T.PATH;m[4][7]=T.PATH;m[4][8]=T.PATH;m[4][9]=T.PATH;
    m[7][6]=T.PATH;m[7][7]=T.PATH;m[7][8]=T.PATH;m[7][9]=T.PATH;
    m[2][7]=T.TORCH;m[2][8]=T.TORCH;m[9][7]=T.TORCH;m[9][8]=T.TORCH;
    oe(m,"W");oe(m,"S");return m;})(),
  // 0,2: DEEP SOUTH FOREST
  "0,2":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
    for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
    m[1][3]=T.TREE;m[1][4]=T.TREE;m[2][2]=T.TREE;m[3][2]=T.TREE;m[1][11]=T.TREE;m[1][12]=T.TREE;
    m[9][2]=T.TREE;m[9][3]=T.TREE;m[10][12]=T.TREE;m[10][13]=T.TREE;
    m[5][5]=T.TALLGRASS;m[5][6]=T.TALLGRASS;m[6][9]=T.TALLGRASS;m[6][10]=T.TALLGRASS;
    // Hidden cave sealed by cracked wall behind bush
    m[8][8]=T.CRACK;m[7][8]=T.BUSH;
    m[3][7]=T.FLOWER;m[3][8]=T.FLOWER;m[4][9]=T.STUMP;m[7][4]=T.STUMP;
    oe(m,"N");oe(m,"E");return m;})(),
  // 1,2: SOUTHERN PLAINS
  "1,2":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.GRASS));
    for(let i=0;i<CO;i++){m[0][i]=T.TREE;m[RO-1][i]=T.TREE;}for(let i=0;i<RO;i++){m[i][0]=T.TREE;m[i][CO-1]=T.TREE;}
    for(let c2=3;c2<=12;c2++){m[5][c2]=T.PATH;m[6][c2]=T.PATH;}
    m[3][4]=T.FLOWER;m[3][5]=T.FLOWER;m[3][10]=T.FLOWER;m[3][11]=T.FLOWER;
    m[8][4]=T.BUSH;m[8][5]=T.BUSH;m[8][10]=T.BUSH;m[8][11]=T.BUSH;
    m[2][7]=T.TALLGRASS;m[2][8]=T.TALLGRASS;m[9][7]=T.TALLGRASS;m[9][8]=T.TALLGRASS;
    // Hidden cave sealed by cracked rock
    m[9][3]=T.CRACK;m[8][3]=T.ROCK;
    oe(m,"N");oe(m,"W");oe(m,"E");return m;})(),
  // 2,2: BEACH — Sandy coast
  "2,2":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.SAND));
    for(let i=0;i<CO;i++){m[0][i]=T.ROCK;m[RO-1][i]=T.ROCK;}for(let i=0;i<RO;i++){m[i][0]=T.ROCK;m[i][CO-1]=T.ROCK;}
    for(let r=1;r<=10;r++)for(let c2=10;c2<=14;c2++)m[r][c2]=T.WATER;
    m[3][9]=T.TALLGRASS;m[7][9]=T.TALLGRASS;m[5][4]=T.BUSH;m[4][6]=T.FLOWER;m[8][5]=T.STUMP;
    oe(m,"W",T.SAND);oe(m,"N",T.SAND);oe(m,"E",T.SAND);return m;})(),
  // 3,2: VOLCANIC — Hot area, fire enemies
  "3,2":(()=>{const m=Array.from({length:RO},()=>Array(CO).fill(T.SAND));
    for(let i=0;i<CO;i++){m[0][i]=T.ROCK;m[RO-1][i]=T.ROCK;}for(let i=0;i<RO;i++){m[i][0]=T.ROCK;m[i][CO-1]=T.ROCK;}
    m[3][3]=T.ROCK;m[4][3]=T.ROCK;m[3][12]=T.ROCK;m[4][12]=T.ROCK;
    m[8][3]=T.ROCK;m[9][3]=T.ROCK;m[8][12]=T.ROCK;m[9][12]=T.ROCK;
    m[5][6]=T.WATER;m[5][7]=T.WATER;m[6][6]=T.WATER;m[6][7]=T.WATER; // lava (rendered as water)
    m[5][8]=T.WATER;m[6][8]=T.WATER;m[5][9]=T.WATER;m[6][9]=T.WATER;
    m[4][7]=T.ROCK;m[4][8]=T.ROCK;m[7][7]=T.ROCK;m[7][8]=T.ROCK;
    m[2][7]=T.PATH;m[2][8]=T.PATH;m[9][7]=T.PATH;m[9][8]=T.PATH;
    oe(m,"W",T.SAND);oe(m,"N",T.SAND);return m;})(),
};

// Hidden caves — overworld entrances that lead to small treasure rooms
const CAVES=[
  {s:"1,0",t:[[3,2]],room:{tiles:mr(m=>{m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[5][6]=T.HEART;m[5][7]=T.HEART;m[5][8]=T.BOMB;m[5][9]=T.BOMB;m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[7][5]=T.TORCH;m[7][10]=T.TORCH;}),enemies:[]}},
  {s:"3,0",t:[[10,4]],room:{tiles:mr(m=>{m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[5][7]=T.KEY;m[5][8]=T.HEART;m[6][7]=T.BOMB;m[6][8]=T.BOMB;m[3][7]=T.TORCH;m[8][7]=T.TORCH;}),enemies:[]}},
  {s:"0,2",t:[[8,8]],room:{tiles:mr(m=>{m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[4][7]=T.HEART;m[5][7]=T.HEART;m[5][8]=T.HEART;m[6][7]=T.BOMB;m[6][8]=T.BOMB;m[6][9]=T.BOMB;m[2][5]=T.TORCH;m[2][10]=T.TORCH;m[9][5]=T.TORCH;m[9][10]=T.TORCH;}),enemies:[]}},
  {s:"1,2",t:[[3,9]],room:{tiles:mr(m=>{m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[5][6]=T.KEY;m[5][7]=T.KEY;m[5][8]=T.HEART;m[5][9]=T.HEART;m[4][7]=T.TORCH;m[7][7]=T.TORCH;}),enemies:[]}},
];

// ============ DUNGEONS — 3 temples + final dungeon ============
const d1={name:"Forest Temple",color:"#1a3020",wc:"#3a6a3a",fc:"#2a4a28",th:"forest",rooms:{
  // Entry hall — narrow corridor widens into room
  "0,0":{tiles:mr(m=>{ae(m,["N","E"]);m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;
    // Narrow entry widens
    for(let y=8;y<11;y++){m[y][3]=T.WALL;m[y][12]=T.WALL;}
    m[3][3]=T.WALL;m[3][4]=T.WALL;m[3][11]=T.WALL;m[3][12]=T.WALL;
    m[5][5]=T.PIT;m[5][10]=T.PIT;m[6][5]=T.PIT;m[6][10]=T.PIT;
    m[5][3]=T.TORCH;m[5][12]=T.TORCH;m[5][7]=T.PUSH;m[6][7]=T.PLATE;}),enemies:[{x:6*TL,y:4*TL,hp:2,type:"skeleton"},{x:9*TL,y:7*TL,hp:2,type:"skeleton"}]},
  // East wing — L-shaped with spike corridor
  "1,0":{tiles:mr(m=>{ae(m,["W"]);
    // L-shape: wall blocks upper-right
    for(let x=8;x<=12;x++){m[2][x]=T.WALL;m[3][x]=T.WALL;}
    for(let y=2;y<=6;y++)m[y][8]=T.WALL;
    // Spike hallway along bottom
    m[8][4]=T.SPIKE;m[8][5]=T.SPIKE;m[8][6]=T.SPIKE;m[8][9]=T.SPIKE;m[8][10]=T.SPIKE;m[8][11]=T.SPIKE;
    m[5][4]=T.KEY;m[9][12]=T.HEART;m[4][2]=T.TORCH;m[7][13]=T.TORCH;}),enemies:[{x:4*TL,y:5*TL,hp:3,type:"skeleton"},{x:11*TL,y:8*TL,hp:3,type:"skeleton"},{x:6*TL,y:7*TL,hp:2,type:"bat"},{x:12*TL,y:5*TL,hp:2,type:"bat"}]},
  // Narrow bridge over pits
  "0,-1":{tiles:mr(m=>{ae(m,["S","E"]);m[0][7]=T.DOOR;m[0][8]=T.DOOR;
    // Pit field with narrow walkway
    for(let y=3;y<=8;y++)for(let x=2;x<=13;x++)m[y][x]=T.PIT;
    // Bridge path through pits
    for(let y=3;y<=8;y++){m[y][5]=T.FLOOR;m[y][10]=T.FLOOR;}
    m[5][5]=T.FLOOR;m[5][6]=T.FLOOR;m[5][7]=T.FLOOR;m[5][8]=T.FLOOR;m[5][9]=T.FLOOR;m[5][10]=T.FLOOR;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;m[9][12]=T.LEVER;}),enemies:[{x:5*TL,y:4*TL,hp:2,type:"bat"},{x:10*TL,y:4*TL,hp:2,type:"bat"},{x:7*TL,y:7*TL,hp:3,type:"skeleton"}]},
  // Push block puzzle room
  "1,-1":{tiles:mr(m=>{ae(m,["W"]);
    // Narrow corridors
    for(let y=2;y<=4;y++){m[y][4]=T.WALL;m[y][11]=T.WALL;}
    for(let y=7;y<=9;y++){m[y][4]=T.WALL;m[y][11]=T.WALL;}
    m[5][6]=T.PUSH;m[5][9]=T.PUSH;m[6][7]=T.PLATE;m[6][8]=T.PLATE;
    m[3][7]=T.KEY;m[5][CO-1]=T.CRACK;m[6][CO-1]=T.CRACK;}),enemies:[{x:6*TL,y:3*TL,hp:3,type:"bat"},{x:9*TL,y:3*TL,hp:3,type:"bat"},{x:7*TL,y:8*TL,hp:3,type:"skeleton"}]},
  // Secret treasure room
  "2,-1":{tiles:mr(m=>{m[5][0]=T.FLOOR;m[6][0]=T.FLOOR;m[5][6]=T.HEART;m[5][7]=T.HEART;m[5][8]=T.BOMB;m[5][9]=T.BOMB;m[3][5]=T.TORCH;m[3][10]=T.TORCH;m[7][5]=T.TORCH;m[7][10]=T.TORCH;}),enemies:[]},
  // Pre-boss gauntlet — spike-lined narrow hall
  "0,-2":{tiles:mr(m=>{m[RO-1][7]=T.FLOOR;m[RO-1][8]=T.FLOOR;m[0][7]=T.BOSS_DOOR;m[0][8]=T.BOSS_DOOR;
    // Narrow center corridor with spike walls
    for(let y=2;y<=9;y++){m[y][3]=T.WALL;m[y][12]=T.WALL;m[y][5]=T.SPIKE;m[y][10]=T.SPIKE;}
    m[4][7]=T.PIT;m[4][8]=T.PIT;m[7][7]=T.PIT;m[7][8]=T.PIT;
    m[9][7]=T.HEART;m[2][4]=T.TORCH;m[2][11]=T.TORCH;}),enemies:[{x:7*TL,y:3*TL,hp:3,type:"bat"},{x:8*TL,y:6*TL,hp:3,type:"skeleton"},{x:7*TL,y:9*TL,hp:3,type:"bat"}]},
  // Boss arena
  "0,-3":{tiles:mr(m=>{m[RO-1][7]=T.FLOOR;m[RO-1][8]=T.FLOOR;
    // Pillar layout
    m[3][4]=T.WALL;m[3][11]=T.WALL;m[8][4]=T.WALL;m[8][11]=T.WALL;
    m[5][3]=T.PIT;m[6][3]=T.PIT;m[5][12]=T.PIT;m[6][12]=T.PIT;
    m[4][7]=T.TORCH;m[4][8]=T.TORCH;m[7][7]=T.TORCH;m[7][8]=T.TORCH;}),enemies:[{x:7.5*TL,y:5*TL,hp:10,type:"boss",name:"Forest Guardian",pattern:"charge"}]},
}};
const d2={name:"Fire Cavern",color:"#2a1510",wc:"#6a3a2a",fc:"#4a2218",th:"fire",rooms:{
  // Entry — lava pits flanking narrow bridge
  "0,1":{tiles:mr(m=>{ae(m,["N","E"]);m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;
    for(let y=3;y<=8;y++){m[y][2]=T.PIT;m[y][3]=T.PIT;m[y][12]=T.PIT;m[y][13]=T.PIT;}
    m[5][6]=T.SPIKE;m[5][9]=T.SPIKE;m[6][6]=T.SPIKE;m[6][9]=T.SPIKE;
    m[3][2]=T.TORCH;m[3][13]=T.TORCH;m[8][5]=T.TORCH;m[8][10]=T.TORCH;}),enemies:[{x:5*TL,y:5*TL,hp:3,type:"fire_bat"},{x:10*TL,y:5*TL,hp:3,type:"fire_bat"}]},
  // East: winding corridor with spikes
  "1,1":{tiles:mr(m=>{ae(m,["W"]);
    // Zigzag walls
    for(let x=3;x<=7;x++)m[3][x]=T.WALL;for(let x=8;x<=12;x++)m[5][x]=T.WALL;
    for(let x=3;x<=7;x++)m[7][x]=T.WALL;for(let x=8;x<=12;x++)m[9][x]=T.WALL;
    m[4][6]=T.SPIKE;m[4][7]=T.SPIKE;m[6][9]=T.SPIKE;m[6][10]=T.SPIKE;m[8][6]=T.SPIKE;m[8][7]=T.SPIKE;
    m[4][10]=T.KEY;}),enemies:[{x:10*TL,y:3*TL,hp:3,type:"fire_bat"},{x:5*TL,y:6*TL,hp:3,type:"fire_bat"},{x:10*TL,y:8*TL,hp:3,type:"skeleton"}]},
  // Central hub — push blocks over pits
  "0,0":{tiles:mr(m=>{ae(m,["S","E","W"]);m[0][7]=T.DOOR;m[0][8]=T.DOOR;
    m[4][5]=T.PIT;m[4][6]=T.PIT;m[4][9]=T.PIT;m[4][10]=T.PIT;
    m[7][5]=T.PIT;m[7][6]=T.PIT;m[7][9]=T.PIT;m[7][10]=T.PIT;
    m[5][4]=T.WALL;m[6][4]=T.WALL;m[5][11]=T.WALL;m[6][11]=T.WALL;
    m[5][7]=T.PUSH;m[6][8]=T.PUSH;m[3][7]=T.PLATE;m[8][8]=T.PLATE;
    m[2][3]=T.TORCH;m[2][12]=T.TORCH;m[9][3]=T.TORCH;m[9][12]=T.TORCH;}),enemies:[{x:3*TL,y:3*TL,hp:3,type:"skeleton"},{x:12*TL,y:3*TL,hp:3,type:"skeleton"},{x:7*TL,y:8*TL,hp:3,type:"fire_bat"}]},
  // East: narrow double-corridor
  "1,0":{tiles:mr(m=>{ae(m,["W"]);
    // Two narrow hallways split by center wall
    for(let y=2;y<=9;y++){m[y][5]=T.WALL;m[y][10]=T.WALL;}
    m[5][5]=T.FLOOR;m[6][5]=T.FLOOR;m[5][10]=T.FLOOR;m[6][10]=T.FLOOR;// gaps to cross
    m[3][3]=T.SPIKE;m[3][12]=T.SPIKE;m[8][3]=T.SPIKE;m[8][12]=T.SPIKE;
    m[3][7]=T.HEART;m[8][8]=T.KEY;m[5][CO-1]=T.CRACK;m[6][CO-1]=T.CRACK;}),enemies:[{x:2*TL,y:3*TL,hp:4,type:"fire_bat"},{x:2*TL,y:8*TL,hp:4,type:"fire_bat"},{x:13*TL,y:3*TL,hp:4,type:"skeleton"},{x:13*TL,y:8*TL,hp:4,type:"skeleton"}]},
  // Secret room
  "2,0":{tiles:mr(m=>{m[5][0]=T.FLOOR;m[6][0]=T.FLOOR;m[4][7]=T.HEART;m[5][7]=T.HEART;m[6][7]=T.BOMB;m[6][8]=T.BOMB;m[3][6]=T.TORCH;m[3][9]=T.TORCH;m[8][6]=T.TORCH;m[8][9]=T.TORCH;m[5][8]=T.KEY;}),enemies:[]},
  // West wing — spike gauntlet
  "-1,0":{tiles:mr(m=>{ae(m,["E"]);
    // Spike path
    m[3][3]=T.SPIKE;m[3][6]=T.SPIKE;m[3][9]=T.SPIKE;m[3][12]=T.SPIKE;
    m[5][4]=T.SPIKE;m[5][7]=T.SPIKE;m[5][10]=T.SPIKE;
    m[7][3]=T.SPIKE;m[7][6]=T.SPIKE;m[7][9]=T.SPIKE;m[7][12]=T.SPIKE;
    m[5][13]=T.HEART;m[8][7]=T.HEART;m[2][2]=T.TORCH;m[2][13]=T.TORCH;}),enemies:[{x:3*TL,y:5*TL,hp:4,type:"fire_bat"},{x:12*TL,y:5*TL,hp:4,type:"fire_bat"}]},
  // Pre-boss — narrow bridge over pit
  "0,-1":{tiles:mr(m=>{m[RO-1][7]=T.FLOOR;m[RO-1][8]=T.FLOOR;ae(m,["WB"]);
    // Pit field with winding path
    for(let y=2;y<=9;y++)for(let x=2;x<=13;x++)m[y][x]=T.PIT;
    for(let y=2;y<=9;y++){m[y][7]=T.FLOOR;m[y][8]=T.FLOOR;}
    m[4][4]=T.FLOOR;m[4][5]=T.FLOOR;m[4][6]=T.FLOOR;m[7][9]=T.FLOOR;m[7][10]=T.FLOOR;m[7][11]=T.FLOOR;
    m[4][4]=T.SPIKE;m[7][11]=T.SPIKE;}),enemies:[{x:7*TL,y:3*TL,hp:3,type:"fire_bat"},{x:7*TL,y:6*TL,hp:3,type:"fire_bat"},{x:7*TL,y:9*TL,hp:3,type:"skeleton"}]},
  // Boss arena — pillared arena with pit border
  "-1,-1":{tiles:mr(m=>{m[5][CO-1]=T.FLOOR;m[6][CO-1]=T.FLOOR;
    for(let x=2;x<=13;x++){m[2][x]=T.PIT;m[9][x]=T.PIT;}
    for(let y=2;y<=9;y++){m[y][2]=T.PIT;m[y][13]=T.PIT;}
    m[4][5]=T.WALL;m[4][10]=T.WALL;m[7][5]=T.WALL;m[7][10]=T.WALL;
    m[3][7]=T.TORCH;m[3][8]=T.TORCH;m[8][7]=T.TORCH;m[8][8]=T.TORCH;}),enemies:[{x:7.5*TL,y:5*TL,hp:12,type:"boss",name:"Flame Wyrm",pattern:"spawn"}]},
}};
const d3={name:"Shadow Keep",color:"#12122a",wc:"#3a3a5e",fc:"#1e1e38",th:"shadow",rooms:{
  // Entry — maze-like with narrow passages
  "0,0":{tiles:mr(m=>{ae(m,["N","W"]);m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;
    // Maze walls
    for(let x=3;x<=6;x++)m[3][x]=T.WALL;for(let x=9;x<=12;x++)m[3][x]=T.WALL;
    for(let y=3;y<=6;y++)m[y][6]=T.WALL;for(let y=5;y<=8;y++)m[y][9]=T.WALL;
    m[6][3]=T.WALL;m[6][4]=T.WALL;m[8][11]=T.WALL;m[8][12]=T.WALL;
    m[2][7]=T.TORCH;m[9][7]=T.TORCH;}),enemies:[{x:4*TL,y:5*TL,hp:3,type:"ghost"},{x:11*TL,y:4*TL,hp:3,type:"ghost"},{x:7*TL,y:8*TL,hp:3,type:"skeleton"}]},
  // West: ghost corridor with pits
  "-1,0":{tiles:mr(m=>{ae(m,["E"]);
    // Narrow center with pit sides
    for(let y=2;y<=9;y++){m[y][2]=T.PIT;m[y][3]=T.PIT;m[y][12]=T.PIT;m[y][13]=T.PIT;}
    m[4][6]=T.SPIKE;m[4][9]=T.SPIKE;m[7][6]=T.SPIKE;m[7][9]=T.SPIKE;
    m[4][7]=T.KEY;m[7][8]=T.HEART;m[2][5]=T.TORCH;m[2][10]=T.TORCH;}),enemies:[{x:5*TL,y:4*TL,hp:3,type:"ghost"},{x:10*TL,y:7*TL,hp:3,type:"ghost"},{x:7*TL,y:9*TL,hp:3,type:"skeleton"}]},
  // North: lever puzzle with push blocks
  "0,-1":{tiles:mr(m=>{ae(m,["S","E"]);m[0][7]=T.DOOR;m[0][8]=T.DOOR;
    // Asymmetric walls creating chambers
    for(let y=3;y<=5;y++)m[y][5]=T.WALL;for(let y=6;y<=8;y++)m[y][10]=T.WALL;
    m[3][8]=T.WALL;m[3][9]=T.WALL;m[8][6]=T.WALL;m[8][7]=T.WALL;
    m[4][3]=T.PIT;m[7][12]=T.PIT;
    m[5][7]=T.PUSH;m[6][8]=T.PUSH;m[4][11]=T.LEVER;m[7][4]=T.PLATE;}),enemies:[{x:10*TL,y:3*TL,hp:3,type:"ghost"},{x:4*TL,y:6*TL,hp:3,type:"ghost"},{x:10*TL,y:8*TL,hp:3,type:"skeleton"}]},
  // East: trap hallway
  "1,-1":{tiles:mr(m=>{ae(m,["W"]);
    // Long narrow room with spike patterns
    for(let y=2;y<=3;y++)for(let x=3;x<=12;x++)m[y][x]=T.WALL;
    for(let y=8;y<=9;y++)for(let x=3;x<=12;x++)m[y][x]=T.WALL;
    // Spike zigzag in the corridor
    m[5][4]=T.SPIKE;m[5][6]=T.SPIKE;m[5][8]=T.SPIKE;m[5][10]=T.SPIKE;m[5][12]=T.SPIKE;
    m[6][3]=T.SPIKE;m[6][5]=T.SPIKE;m[6][7]=T.SPIKE;m[6][9]=T.SPIKE;m[6][11]=T.SPIKE;
    m[4][7]=T.KEY;m[7][8]=T.KEY;m[5][CO-1]=T.CRACK;m[6][CO-1]=T.CRACK;}),enemies:[{x:6*TL,y:5*TL,hp:4,type:"ghost"},{x:9*TL,y:6*TL,hp:4,type:"ghost"}]},
  // Secret room
  "2,-1":{tiles:mr(m=>{m[5][0]=T.FLOOR;m[6][0]=T.FLOOR;m[5][7]=T.BOMB;m[5][8]=T.BOMB;m[6][7]=T.HEART;m[6][8]=T.HEART;m[4][5]=T.TORCH;m[4][10]=T.TORCH;m[7][5]=T.TORCH;m[7][10]=T.TORCH;m[3][7]=T.KEY;}),enemies:[]},
  // Pre-boss: pit maze
  "0,-2":{tiles:mr(m=>{m[RO-1][7]=T.FLOOR;m[RO-1][8]=T.FLOOR;ae(m,["WD"]);
    // Checkerboard pits — must navigate carefully
    for(let y=2;y<=9;y++)for(let x=2;x<=13;x++)if((x+y)%3===0)m[y][x]=T.PIT;
    m[5][7]=T.HEART;m[5][8]=T.HEART;m[2][3]=T.TORCH;m[9][12]=T.TORCH;}),enemies:[{x:7*TL,y:4*TL,hp:5,type:"ghost"},{x:4*TL,y:7*TL,hp:5,type:"ghost"},{x:11*TL,y:7*TL,hp:5,type:"ghost"}]},
  // Boss key room
  "-1,-2":{tiles:mr(m=>{m[5][CO-1]=T.FLOOR;m[6][CO-1]=T.FLOOR;ae(m,["NB"]);
    // Four-pillar room
    m[3][4]=T.WALL;m[3][5]=T.WALL;m[4][4]=T.WALL;m[3][10]=T.WALL;m[3][11]=T.WALL;m[4][11]=T.WALL;
    m[7][4]=T.WALL;m[8][4]=T.WALL;m[8][5]=T.WALL;m[7][11]=T.WALL;m[8][10]=T.WALL;m[8][11]=T.WALL;
    m[5][7]=T.SPIKE;m[5][8]=T.SPIKE;m[6][7]=T.SPIKE;m[6][8]=T.SPIKE;}),enemies:[{x:7*TL,y:5*TL,hp:4,type:"ghost"},{x:3*TL,y:8*TL,hp:4,type:"ghost"},{x:12*TL,y:8*TL,hp:4,type:"skeleton"}]},
  // Boss arena — open with pit border
  "-1,-3":{tiles:mr(m=>{m[RO-1][7]=T.FLOOR;m[RO-1][8]=T.FLOOR;
    // Pit border
    for(let x=2;x<=13;x++){m[2][x]=T.PIT;m[9][x]=T.PIT;}
    for(let y=2;y<=9;y++){m[y][2]=T.PIT;m[y][13]=T.PIT;}
    m[4][5]=T.WALL;m[4][10]=T.WALL;m[7][5]=T.WALL;m[7][10]=T.WALL;
    m[3][7]=T.TORCH;m[3][8]=T.TORCH;m[8][7]=T.TORCH;m[8][8]=T.TORCH;}),enemies:[{x:7.5*TL,y:5*TL,hp:14,type:"boss",name:"Shadow Lord",pattern:"teleport"}]},
}};
// FINAL DUNGEON — Opens when all 3 triforce pieces collected
const d4={name:"Dark Sanctum",color:"#0a0a0a",wc:"#3a1a3a",fc:"#1a0a1a",th:"shadow",rooms:{
  "0,0":{tiles:mr(m=>{ae(m,["N"]);m[RO-1][7]=T.STAIRS_UP;m[RO-1][8]=T.STAIRS_UP;m[3][4]=T.WALL;m[3][5]=T.WALL;m[3][10]=T.WALL;m[3][11]=T.WALL;m[8][4]=T.WALL;m[8][5]=T.WALL;m[8][10]=T.WALL;m[8][11]=T.WALL;m[2][3]=T.TORCH;m[2][12]=T.TORCH;m[9][3]=T.TORCH;m[9][12]=T.TORCH;}),enemies:[{x:4*TL,y:5*TL,hp:5,type:"ghost"},{x:11*TL,y:5*TL,hp:5,type:"ghost"},{x:7*TL,y:3*TL,hp:5,type:"skeleton"},{x:7*TL,y:8*TL,hp:5,type:"skeleton"}]},
  "0,-1":{tiles:mr(m=>{ae(m,["S","E"]);m[0][7]=T.DOOR;m[0][8]=T.DOOR;m[3][3]=T.WALL;m[3][4]=T.WALL;m[3][11]=T.WALL;m[3][12]=T.WALL;m[5][5]=T.WALL;m[5][6]=T.WALL;m[5][9]=T.WALL;m[5][10]=T.WALL;m[8][5]=T.WALL;m[8][10]=T.WALL;m[6][7]=T.LEVER;m[4][7]=T.PUSH;m[7][12]=T.PUSH;}),enemies:[{x:3*TL,y:6*TL,hp:5,type:"fire_bat"},{x:12*TL,y:6*TL,hp:5,type:"fire_bat"},{x:7*TL,y:8*TL,hp:5,type:"ghost"}]},
  "1,-1":{tiles:mr(m=>{ae(m,["W"]);m[3][5]=T.WALL;m[3][6]=T.WALL;m[3][9]=T.WALL;m[3][10]=T.WALL;m[8][5]=T.WALL;m[8][6]=T.WALL;m[8][9]=T.WALL;m[8][10]=T.WALL;m[5][7]=T.KEY;m[6][8]=T.HEART;}),enemies:[{x:5*TL,y:5*TL,hp:6,type:"skeleton"},{x:10*TL,y:5*TL,hp:6,type:"skeleton"},{x:7*TL,y:3*TL,hp:5,type:"fire_bat"},{x:7*TL,y:8*TL,hp:5,type:"ghost"}]},
  "0,-2":{tiles:mr(m=>{m[RO-1][7]=T.FLOOR;m[RO-1][8]=T.FLOOR;m[0][7]=T.BOSS_DOOR;m[0][8]=T.BOSS_DOOR;m[3][3]=T.WALL;m[3][12]=T.WALL;m[5][5]=T.WALL;m[5][10]=T.WALL;m[6][5]=T.WALL;m[6][10]=T.WALL;m[8][3]=T.WALL;m[8][12]=T.WALL;m[5][7]=T.HEART;m[5][8]=T.HEART;m[2][7]=T.TORCH;m[9][7]=T.TORCH;}),enemies:[{x:4*TL,y:6*TL,hp:6,type:"ghost"},{x:11*TL,y:6*TL,hp:6,type:"ghost"},{x:7*TL,y:4*TL,hp:6,type:"fire_bat"},{x:7*TL,y:8*TL,hp:6,type:"skeleton"}]},
  "0,-3":{tiles:mr(m=>{m[RO-1][7]=T.FLOOR;m[RO-1][8]=T.FLOOR;m[3][3]=T.WALL;m[3][12]=T.WALL;m[8][3]=T.WALL;m[8][12]=T.WALL;m[4][7]=T.TORCH;m[4][8]=T.TORCH;m[7][7]=T.TORCH;m[7][8]=T.TORCH;}),enemies:[{x:7.5*TL,y:5*TL,hp:20,type:"boss",name:"Dark King",pattern:"all"}]},
}};

const DG=[d1,d2,d3,d4];
const DE=[{s:"0,0",t:[[7,5],[8,5],[7,6],[8,6]],d:0},{s:"0,1",t:[[7,5],[8,5],[7,6],[8,6]],d:1},{s:"2,0",t:[[7,5],[8,5],[7,6],[8,6]],d:2},{s:"3,1",t:[[7,5],[8,5],[7,6],[8,6]],d:3}];


function dc(o){return JSON.parse(JSON.stringify(o));}
function hs(x,y,s){let h=(x*374761393+y*668265263+s*1274126177)&0x7fffffff;h=((h>>13)^h)*1274126177&0x7fffffff;return(h&0xff)/255;}

// ============ DRAW ============
function dP(c,x,y,d,t){
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
function dSw(c,px,py,d,tm){
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

function dSk(c,x,y,sz,fl,t){c.fillStyle="rgba(0,0,0,0.2)";c.beginPath();c.ellipse(x+sz/2,y+sz-2,sz/2-2,3,0,0,Math.PI*2);c.fill();
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
function dBt(c,x,y,sz,fl,t,fi){const f=Math.sin(t/80)*6;
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
function dGh(c,x,y,sz,fl,t){const b=Math.sin(t/400)*3;
  const gg=c.createRadialGradient(x+sz/2,y+sz*.35+b,sz*.1,x+sz/2,y+sz*.45+b,sz*.45);
  gg.addColorStop(0,fl?"rgba(255,255,255,0.95)":"rgba(200,210,240,0.6)");
  gg.addColorStop(0.7,fl?"rgba(255,255,255,0.7)":"rgba(160,170,210,0.35)");
  gg.addColorStop(1,"rgba(100,110,180,0)");
  c.fillStyle=gg;c.beginPath();c.arc(x+sz/2,y+sz*.35+b,sz*.38,Math.PI,0);
  c.lineTo(x+sz*.88,y+sz*.7+b);for(let i=0;i<4;i++){const bx=x+sz*.88-i*(sz*.76/4);c.quadraticCurveTo(bx-sz*.05,y+sz*.8+Math.sin(t/200+i)*3+b,bx-sz*.19,y+sz*.7+b);}c.fill();
  c.fillStyle=fl?"#444":"rgba(30,30,80,0.8)";c.beginPath();c.arc(x+sz*.36,y+sz*.3+b,2.5,0,Math.PI*2);c.fill();c.beginPath();c.arc(x+sz*.64,y+sz*.3+b,2.5,0,Math.PI*2);c.fill();
  if(!fl){c.fillStyle="rgba(100,120,200,0.15)";c.beginPath();c.arc(x+sz*.36,y+sz*.3+b,1,0,Math.PI*2);c.fill();c.beginPath();c.arc(x+sz*.64,y+sz*.3+b,1,0,Math.PI*2);c.fill();}}
function dBo(c,x,y,sz,fl,t,hp,mh,di){
  c.fillStyle="rgba(0,0,0,0.3)";c.beginPath();c.ellipse(x+sz/2,y+sz-1,sz/2+2,5,0,0,Math.PI*2);c.fill();
  const eg=Math.sin(t/200)*2;
  if(di===0){// FOREST GUARDIAN — hulking treant
    const bark=fl?"#fff":"#3a5a28";c.fillStyle=bark;
    c.beginPath();c.moveTo(x+sz*.2,y+sz*.9);c.lineTo(x+sz*.15,y+sz*.3);c.bezierCurveTo(x+sz*.2,y+sz*.1,x+sz*.8,y+sz*.1,x+sz*.85,y+sz*.3);c.lineTo(x+sz*.8,y+sz*.9);c.fill();
    if(!fl){c.strokeStyle="rgba(20,40,10,0.5)";c.lineWidth=1.5;
      for(let i=0;i<4;i++){const by2=y+sz*(.25+i*.15);c.beginPath();c.moveTo(x+sz*(.2+i*.02),by2);c.bezierCurveTo(x+sz*.4,by2+3,x+sz*.6,by2-3,x+sz*(.8-i*.02),by2);c.stroke();}}
    c.fillStyle=fl?"#eee":"#4a6a30";
    c.beginPath();c.moveTo(x+sz*.15,y+sz*.35);c.lineTo(x-4,y+sz*.15);c.lineTo(x+sz*.05,y+sz*.1);c.lineTo(x+sz*.25,y+sz*.28);c.fill();
    c.beginPath();c.moveTo(x+sz*.85,y+sz*.35);c.lineTo(x+sz+4,y+sz*.15);c.lineTo(x+sz*.95,y+sz*.1);c.lineTo(x+sz*.75,y+sz*.28);c.fill();
    c.fillStyle=fl?"#dfd":"#2a8a18";
    for(let i=0;i<5;i++){const lx=x+sz*(.25+i*.12),ly=y+sz*(.05+Math.sin(t/300+i)*0.03);
      c.beginPath();c.ellipse(lx,ly,sz*.1,sz*.07,i*.5,0,Math.PI*2);c.fill();}
    c.fillStyle=fl?"#333":"#4f4";c.shadowColor="#0f0";c.shadowBlur=fl?0:6;
    c.beginPath();c.arc(x+sz*.35,y+sz*.3+eg,3,0,Math.PI*2);c.fill();c.beginPath();c.arc(x+sz*.65,y+sz*.3+eg,3,0,Math.PI*2);c.fill();
    c.shadowBlur=0;
    if(!fl){c.fillStyle="#afa";c.beginPath();c.arc(x+sz*.35,y+sz*.3+eg,1.2,0,Math.PI*2);c.fill();c.beginPath();c.arc(x+sz*.65,y+sz*.3+eg,1.2,0,Math.PI*2);c.fill();}
  }else if(di===1){// FLAME WYRM — serpentine fire dragon
    const phase=t/150;
    for(let i=5;i>=0;i--){const seg=i/5,bx=x+sz/2+Math.sin(phase+i*.8)*sz*.15,by=y+sz*(.2+seg*.6);
      const sr2=sz*(.2+(.5-Math.abs(seg-.5))*.35);
      const sg=fl?"#fff":c.createRadialGradient(bx,by,1,bx,by,sr2);
      if(!fl){sg.addColorStop(0,"#ff6600");sg.addColorStop(0.6,"#cc2200");sg.addColorStop(1,"#881100");}
      c.fillStyle=sg;c.beginPath();c.ellipse(bx,by,sr2,sr2*.7,0,0,Math.PI*2);c.fill();}
    const hx=x+sz/2+Math.sin(phase)*sz*.12,hy=y+sz*.15;
    const hg=fl?"#fff":c.createRadialGradient(hx,hy,2,hx,hy,sz*.22);
    if(!fl){hg.addColorStop(0,"#ffaa00");hg.addColorStop(1,"#cc3300");}
    c.fillStyle=hg;c.beginPath();c.ellipse(hx,hy,sz*.22,sz*.18,0,0,Math.PI*2);c.fill();
    c.fillStyle=fl?"#eee":"#ff4400";
    c.beginPath();c.moveTo(hx-sz*.12,hy-sz*.08);c.lineTo(hx-sz*.2,hy-sz*.25);c.lineTo(hx-sz*.05,hy-sz*.05);c.fill();
    c.beginPath();c.moveTo(hx+sz*.12,hy-sz*.08);c.lineTo(hx+sz*.2,hy-sz*.25);c.lineTo(hx+sz*.05,hy-sz*.05);c.fill();
    c.fillStyle=fl?"#333":"#ff0";c.beginPath();c.arc(hx-sz*.08,hy+eg*.5,2.5,0,Math.PI*2);c.fill();c.beginPath();c.arc(hx+sz*.08,hy+eg*.5,2.5,0,Math.PI*2);c.fill();
    if(!fl){c.fillStyle="#f00";c.beginPath();c.arc(hx-sz*.08,hy+eg*.5,1.2,0,Math.PI*2);c.fill();c.beginPath();c.arc(hx+sz*.08,hy+eg*.5,1.2,0,Math.PI*2);c.fill();}
    if(!fl){for(let i=0;i<6;i++){const fx=x+sz*(.2+Math.random()*.6),fy=y+sz*(.1+Math.random()*.7);
      c.fillStyle=`rgba(255,${150+Math.random()*100|0},0,${0.3+Math.random()*0.3})`;c.beginPath();c.arc(fx,fy-Math.sin(t/100+i)*3,1.5+Math.random()*2,0,Math.PI*2);c.fill();}}
  }else if(di===2){// SHADOW LORD — spectral wraith
    const drift=Math.sin(t/400)*3;
    c.fillStyle=fl?"#fff":"#1a1a3a";
    c.beginPath();c.moveTo(x+sz*.5,y+sz*.1);c.bezierCurveTo(x+sz*.1,y+sz*.3,x+sz*.05,y+sz*.7,x+sz*.15,y+sz*.95);
    for(let i=0;i<5;i++){c.lineTo(x+sz*(.2+i*.15),y+sz*(.88+Math.sin(t/200+i*1.5)*.05));}
    c.bezierCurveTo(x+sz*.95,y+sz*.7,x+sz*.9,y+sz*.3,x+sz*.5,y+sz*.1);c.fill();
    if(!fl){const cg=c.createRadialGradient(x+sz*.5,y+sz*.5,sz*.1,x+sz*.5,y+sz*.5,sz*.4);
      cg.addColorStop(0,"rgba(80,40,120,0.5)");cg.addColorStop(1,"rgba(20,10,40,0)");c.fillStyle=cg;
      c.beginPath();c.ellipse(x+sz/2,y+sz*.5,sz*.3,sz*.35,0,0,Math.PI*2);c.fill();}
    c.fillStyle=fl?"#ccc":"#d0c8b8";c.beginPath();c.ellipse(x+sz/2,y+sz*.28+drift*.3,sz*.16,sz*.18,0,0,Math.PI*2);c.fill();
    c.fillStyle=fl?"#333":"#000";c.beginPath();c.ellipse(x+sz*.4,y+sz*.26+drift*.3+eg,sz*.04,sz*.05,0,0,Math.PI*2);c.fill();
    c.beginPath();c.ellipse(x+sz*.6,y+sz*.26+drift*.3+eg,sz*.04,sz*.05,0,0,Math.PI*2);c.fill();
    if(!fl){c.fillStyle="#a060ff";c.shadowColor="#8040ff";c.shadowBlur=8;
      c.beginPath();c.arc(x+sz*.4,y+sz*.26+drift*.3+eg,2,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(x+sz*.6,y+sz*.26+drift*.3+eg,2,0,Math.PI*2);c.fill();c.shadowBlur=0;}
    if(!fl){c.fillStyle="#222";c.beginPath();c.ellipse(x+sz*.5,y+sz*.35+drift*.3,sz*.06,sz*.03,0,0,Math.PI*2);c.fill();}
    if(!fl){for(let i=0;i<4;i++){const wx=x+sz*(.2+i*.2),wy=y+sz*(.6+Math.sin(t/300+i*2)*.1);
      c.strokeStyle=`rgba(100,60,180,${0.2+Math.sin(t/250+i)*0.1})`;c.lineWidth=1.5;
      c.beginPath();c.moveTo(wx,wy);c.bezierCurveTo(wx-5,wy+10,wx+5,wy+15,wx+Math.sin(t/200+i)*8,wy+20);c.stroke();}}
  }else{// DARK KING
    const bc=fl?"#fff":"#440044";
    const bg=c.createRadialGradient(x+sz*.4,y+sz*.3,2,x+sz/2,y+sz*.5,sz*.4);
    bg.addColorStop(0,fl?"#fff":"#880088");bg.addColorStop(1,bc);
    c.fillStyle=bg;c.beginPath();c.ellipse(x+sz/2,y+sz*.45,sz*.38,sz*.4,0,0,Math.PI*2);c.fill();
    c.fillStyle=fl?"#eee":"#fd3";
    c.beginPath();c.moveTo(x+sz*.2,y+sz*.15);c.lineTo(x+sz*.15,y-2);c.lineTo(x+sz*.3,y+sz*.08);c.lineTo(x+sz*.4,y-4);c.lineTo(x+sz*.5,y+sz*.08);
    c.lineTo(x+sz*.6,y-4);c.lineTo(x+sz*.7,y+sz*.08);c.lineTo(x+sz*.85,y-2);c.lineTo(x+sz*.8,y+sz*.15);c.fill();
    if(!fl){c.strokeStyle="rgba(255,200,50,0.3)";c.lineWidth=1.5;c.beginPath();c.moveTo(x+sz*.22,y+sz*.4);c.lineTo(x+sz*.78,y+sz*.4);c.stroke();
      c.beginPath();c.moveTo(x+sz*.28,y+sz*.55);c.lineTo(x+sz*.72,y+sz*.55);c.stroke();}
    c.fillStyle=fl?"#333":"#f0f";c.shadowColor="#f0f";c.shadowBlur=fl?0:6;
    c.beginPath();c.arc(x+sz*.35,y+sz*.3+eg,3.5,0,Math.PI*2);c.fill();c.beginPath();c.arc(x+sz*.65,y+sz*.3+eg,3.5,0,Math.PI*2);c.fill();
    c.shadowBlur=0;
    if(!fl){c.fillStyle="#fff";c.beginPath();c.arc(x+sz*.35,y+sz*.3+eg,1.5,0,Math.PI*2);c.fill();c.beginPath();c.arc(x+sz*.65,y+sz*.3+eg,1.5,0,Math.PI*2);c.fill();}
  }
  const bw=sz+8;c.fillStyle="rgba(0,0,0,0.7)";c.beginPath();c.arc(x-4+4,y-14+4,4,Math.PI,Math.PI*1.5);c.arc(x+bw-4,y-14+4,4,Math.PI*1.5,0);c.arc(x+bw-4,y-14+8-4,4,0,Math.PI*.5);c.arc(x-4+4,y-14+8-4,4,Math.PI*.5,Math.PI);c.fill();
  const hpW=bw*(hp/mh);const hpColor=di===0?"#22aa22":di===1?"#cc2222":di===2?"#6622cc":"#cc22cc";
  c.fillStyle=hpColor;c.fillRect(x-3,y-13,Math.max(0,hpW-2),6);
  c.fillStyle="rgba(255,255,255,0.2)";c.fillRect(x-3,y-13,Math.max(0,hpW-2),3);}
function dH(c,x,y,s){c.beginPath();c.moveTo(x+s/2,y+s*.85);c.bezierCurveTo(x,y+s*.5,x,y,x+s/2,y+s*.2);c.bezierCurveTo(x+s,y,x+s,y+s*.5,x+s/2,y+s*.85);c.fill();}

function dT(c,tl,px,py,iD,dg,t){
  switch(tl){
    case T.GRASS:{const g=c.createRadialGradient(px+16+hs(px,py,0)*12-6,py+16+hs(px,py,1)*12-6,3,px+16,py+16,24);
      g.addColorStop(0,hs(px,py,0)>.5?"#4aaa3a":"#40b838");g.addColorStop(1,"#38982e");c.fillStyle=g;c.fillRect(px,py,TL,TL);
      // Organic grass clumps (circles instead of rects)
      c.fillStyle="#3a9028";const n=4+((hs(px,py,50)*4)|0);
      for(let i=0;i<n;i++){const gx=px+hs(px,py,i*10+1)*28+2,gy=py+hs(px,py,i*10+2)*26+3;
        c.beginPath();c.arc(gx,gy,1+hs(px,py,i*10+3)*1.5,0,Math.PI*2);c.fill();}
      // Subtle color variation patches
      c.fillStyle="rgba(40,130,30,0.2)";const cx2=px+hs(px,py,70)*20+6,cy2=py+hs(px,py,71)*20+6;
      c.beginPath();c.arc(cx2,cy2,5+hs(px,py,72)*4,0,Math.PI*2);c.fill();
      break;}
    case T.WATER:{const wg=c.createRadialGradient(px+16+Math.sin(t/800+px/40)*4,py+16+Math.cos(t/700+py/40)*4,4,px+16,py+16,24);
      wg.addColorStop(0,"#3070b8");wg.addColorStop(0.6,"#2860a0");wg.addColorStop(1,"#205088");c.fillStyle=wg;c.fillRect(px,py,TL,TL);
      const w=Math.sin(t/600+px/30)*2,w2=Math.sin(t/500+py/25)*2;
      // Flowing wave curves
      c.strokeStyle="rgba(80,150,210,0.3)";c.lineWidth=1.5;
      c.beginPath();c.moveTo(px-2,py+8+w);c.bezierCurveTo(px+8,py+5+w,px+20,py+11+w,px+34,py+8+w);c.stroke();
      c.strokeStyle="rgba(70,130,190,0.25)";
      c.beginPath();c.moveTo(px-4,py+20+w2);c.bezierCurveTo(px+10,py+17+w2,px+22,py+23+w2,px+36,py+20+w2);c.stroke();
      // Shimmer highlights
      const sh=Math.sin(t/250+px/15+py/20)*.08+.06;
      c.fillStyle=`rgba(200,230,255,${sh})`;c.beginPath();c.arc(px+10+w,py+6,3,0,Math.PI*2);c.fill();
      c.fillStyle=`rgba(180,210,245,${sh*.7})`;c.beginPath();c.arc(px+22-w2,py+24,2.5,0,Math.PI*2);c.fill();
      const sp2=Math.sin(t/180+px*0.3+py*0.2);if(sp2>0.7){c.fillStyle=`rgba(255,255,255,${(sp2-0.7)*2})`;c.beginPath();c.arc(px+16+w,py+14+w2,1,0,Math.PI*2);c.fill();}
      break;}
    case T.TREE:{c.fillStyle="#38982e";c.fillRect(px,py,TL,TL);
      const tv=((Math.floor(px/TL)*13+Math.floor(py/TL)*7)&3); // 4 tree varieties
      if(tv===0){// Round oak
        c.fillStyle="#4a2810";c.fillRect(px+12,py+20,8,12);c.fillStyle="#5a3818";c.fillRect(px+14,py+22,2,8);
        const tg=c.createRadialGradient(px+14,py+8,2,px+16,py+12,13);tg.addColorStop(0,"#3a9028");tg.addColorStop(0.6,"#1a6010");tg.addColorStop(1,"#145008");
        c.fillStyle=tg;c.beginPath();c.arc(px+16,py+11,13,0,Math.PI*2);c.fill();
        c.fillStyle="rgba(60,140,40,0.4)";c.beginPath();c.arc(px+13,py+8,5,0,Math.PI*2);c.fill();
      }else if(tv===1){// Tall pine
        c.fillStyle="#5a3818";c.fillRect(px+14,py+20,4,12);
        c.fillStyle="#1a5010";c.beginPath();c.moveTo(px+16,py+1);c.lineTo(px+26,py+14);c.lineTo(px+6,py+14);c.fill();
        c.fillStyle="#1a5510";c.beginPath();c.moveTo(px+16,py+6);c.lineTo(px+24,py+20);c.lineTo(px+8,py+20);c.fill();
        c.fillStyle="#228018";c.beginPath();c.moveTo(px+16,py+3);c.lineTo(px+22,py+12);c.lineTo(px+10,py+12);c.fill();
      }else if(tv===2){// Wide canopy
        c.fillStyle="#4a2810";c.fillRect(px+13,py+22,6,10);
        const tg2=c.createRadialGradient(px+12,py+10,3,px+16,py+14,14);tg2.addColorStop(0,"#2a8020");tg2.addColorStop(1,"#145008");
        c.fillStyle=tg2;c.beginPath();c.ellipse(px+16,py+12,14,10,0,0,Math.PI*2);c.fill();
        c.fillStyle="rgba(50,130,30,0.4)";c.beginPath();c.arc(px+11,py+9,5,0,Math.PI*2);c.fill();
      }else{// Birch
        c.fillStyle="#d8d0c0";c.fillRect(px+14,py+12,4,20);c.fillStyle="#b8b0a0";c.fillRect(px+14,py+16,4,2);c.fillRect(px+14,py+24,4,2);
        const bg3=c.createRadialGradient(px+14,py+6,2,px+16,py+9,9);bg3.addColorStop(0,"#4aaa3a");bg3.addColorStop(1,"#2a8020");
        c.fillStyle=bg3;c.beginPath();c.arc(px+16,py+9,9,0,Math.PI*2);c.fill();
        c.fillStyle="rgba(80,180,60,0.3)";c.beginPath();c.arc(px+13,py+6,4,0,Math.PI*2);c.fill();
      }break;}
    case T.WALL:{const wg2=c.createLinearGradient(px,py,px,py+TL);const wclr=iD?dg.wc:"#4a3728";wg2.addColorStop(0,wclr);wg2.addColorStop(1,"rgba(0,0,0,0.3)");
      c.fillStyle=iD?dg.wc:"#4a3728";c.fillRect(px,py,TL,TL);c.fillStyle=wg2;c.fillRect(px,py,TL,TL);
      c.fillStyle="rgba(0,0,0,0.12)";c.fillRect(px,py+8,TL,1);c.fillRect(px,py+16,TL,1);c.fillRect(px,py+24,TL,1);
      c.fillRect(px+16,py,1,8);c.fillRect(px+8,py+8,1,8);c.fillRect(px+24,py+16,1,8);
      c.fillStyle="rgba(255,255,255,0.1)";c.fillRect(px,py,TL,2);break;}
    case T.ENTRANCE:{
      // Deep darkness inside
      const eg=c.createRadialGradient(px+16,py+20,1,px+16,py+18,16);
      eg.addColorStop(0,"#0a0008");eg.addColorStop(0.5,"#050005");eg.addColorStop(1,"#020002");
      c.fillStyle=eg;c.fillRect(px,py,TL,TL);
      // Descending stairs into the dark
      c.fillStyle="#1a1a20";c.fillRect(px+5,py+6,22,4);
      c.fillStyle="#141418";c.fillRect(px+5,py+12,22,4);
      c.fillStyle="#0e0e14";c.fillRect(px+5,py+18,22,4);
      c.fillStyle="#080810";c.fillRect(px+5,py+24,22,4);
      // Ornate stone archway — outer pillars with gradient
      const plg=c.createLinearGradient(px,py,px+6,py);plg.addColorStop(0,"#6a6a70");plg.addColorStop(1,"#4a4a50");
      c.fillStyle=plg;c.fillRect(px,py,5,TL); // left pillar
      const prg=c.createLinearGradient(px+TL-5,py,px+TL,py);prg.addColorStop(0,"#4a4a50");prg.addColorStop(1,"#6a6a70");
      c.fillStyle=prg;c.fillRect(px+TL-5,py,5,TL); // right pillar
      // Pillar detail — carved grooves
      c.fillStyle="rgba(0,0,0,0.3)";
      c.fillRect(px+2,py+6,1,TL-8);c.fillRect(px+TL-3,py+6,1,TL-8);
      // Stone lintel across top with keystone
      const lg=c.createLinearGradient(px,py,px,py+5);lg.addColorStop(0,"#7a7a80");lg.addColorStop(1,"#5a5a60");
      c.fillStyle=lg;c.fillRect(px,py,TL,5);
      // Keystone arch
      c.fillStyle="#8a8a90";
      c.beginPath();c.moveTo(px+12,py);c.lineTo(px+16,py-3);c.lineTo(px+20,py);c.fill();
      c.fillStyle="#9a9a9a";c.fillRect(px+14,py,4,2);
      // Pillar caps
      c.fillStyle="#7a7a80";
      c.fillRect(px-1,py+TL-4,6,4);c.fillRect(px+TL-5,py+TL-4,6,4);
      c.fillRect(px-1,py+4,6,3);c.fillRect(px+TL-5,py+4,6,3);
      // Eerie glow from within
      const glowPulse=Math.sin(t/500)*.15+.2;
      const ig=c.createRadialGradient(px+16,py+16,0,px+16,py+16,14);
      ig.addColorStop(0,`rgba(100,60,160,${glowPulse})`);ig.addColorStop(1,"rgba(0,0,0,0)");
      c.fillStyle=ig;c.fillRect(px+4,py+4,TL-8,TL-8);
      // Skull/rune decoration above door
      c.fillStyle=`rgba(180,140,255,${glowPulse*0.8})`;
      c.beginPath();c.arc(px+16,py+2,2,0,Math.PI*2);c.fill();
      c.fillRect(px+10,py+1,2,1);c.fillRect(px+20,py+1,2,1);
      break;}
    case T.FLOOR:{const fc2=iD?(dg.fc||dg.color):"#8b7355";c.fillStyle=fc2;c.fillRect(px,py,TL,TL);
      if(iD){const fg=c.createRadialGradient(px+16,py+16,2,px+16,py+16,20);fg.addColorStop(0,"rgba(255,255,255,0.03)");fg.addColorStop(1,"rgba(0,0,0,0.03)");c.fillStyle=fg;c.fillRect(px,py,TL,TL);
        c.strokeStyle="rgba(255,255,255,0.025)";c.strokeRect(px+1,py+1,TL-2,TL-2);}break;}
    case T.DOOR:case T.BOSS_DOOR:{const bo=tl===T.BOSS_DOOR;c.fillStyle=bo?"#4a1515":"#5a3820";c.fillRect(px,py,TL,TL);c.fillStyle=bo?"#3a0a0a":"#4a2810";c.fillRect(px+4,py+2,10,TL-4);c.fillRect(px+18,py+2,10,TL-4);c.fillStyle="#c8a020";c.fillRect(px+11,py+12,10,10);c.fillStyle="#333";c.fillRect(px+15,py+16,2,4);if(bo){c.fillStyle="#e83030";c.fillRect(px+10,py+2,12,8);}break;}
    case T.KEY:{c.fillStyle=iD?(dg.fc||dg.color):"#2d6a1e";c.fillRect(px,py,TL,TL);const kg=Math.sin(t/300)*.15+.2;c.fillStyle=`rgba(253,211,51,${kg})`;c.beginPath();c.arc(px+16,py+14,10,0,Math.PI*2);c.fill();c.fillStyle="#ffd633";c.beginPath();c.arc(px+14,py+9,4,0,Math.PI*2);c.fill();c.fillStyle="#e8b820";c.fillRect(px+11,py+11,4,14);c.fillRect(px+11,py+21,8,3);c.fillRect(px+11,py+16,6,3);break;}
    case T.HEART:{c.fillStyle=iD?(dg.fc||dg.color):"#2d6a1e";c.fillRect(px,py,TL,TL);const hg=Math.sin(t/400)*.15+.2;c.fillStyle=`rgba(255,50,50,${hg})`;c.beginPath();c.arc(px+16,py+16,12,0,Math.PI*2);c.fill();c.fillStyle="#ee3333";dH(c,px+6,py+6,20);c.fillStyle="#ff6666";dH(c,px+9,py+8,12);break;}
    case T.TRIFORCE:{c.fillStyle=iD?(dg.fc||dg.color):"#2d6a1e";c.fillRect(px,py,TL,TL);const tg=Math.sin(t/250)*.2+.3;c.fillStyle=`rgba(253,211,51,${tg})`;c.beginPath();c.arc(px+16,py+16,14,0,Math.PI*2);c.fill();c.fillStyle="#ffd633";c.beginPath();c.moveTo(px+16,py+4);c.lineTo(px+27,py+26);c.lineTo(px+5,py+26);c.fill();c.fillStyle="#ffe866";c.beginPath();c.moveTo(px+16,py+8);c.lineTo(px+23,py+22);c.lineTo(px+9,py+22);c.fill();break;}
    case T.STAIRS_UP:{c.fillStyle="#444";c.fillRect(px,py,TL,TL);for(let i=0;i<4;i++){c.fillStyle=`rgb(${80+i*20},${80+i*20},${80+i*20})`;c.fillRect(px+3,py+3+i*7,TL-6,5);}c.fillStyle="#6c6";c.font="bold 9px monospace";c.fillText("EXIT",px+5,py+20);break;}
    case T.SAND:{const sg=c.createRadialGradient(px+16+hs(px,py,0)*10-5,py+16+hs(px,py,1)*10-5,5,px+16,py+16,24);
      sg.addColorStop(0,"#e8d478");sg.addColorStop(0.5,"#dcc468");sg.addColorStop(1,"#d0b858");c.fillStyle=sg;c.fillRect(px,py,TL,TL);
      // Wind ripple lines (curved)
      c.strokeStyle="rgba(160,130,60,0.25)";c.lineWidth=1;
      const wr=hs(px,py,80)*8;
      c.beginPath();c.moveTo(px,py+10+wr);c.quadraticCurveTo(px+16,py+8+wr,px+32,py+10+wr);c.stroke();
      c.beginPath();c.moveTo(px,py+22+wr*.5);c.quadraticCurveTo(px+16,py+20+wr*.5,px+32,py+22+wr*.5);c.stroke();
      // Scattered grains
      c.fillStyle="rgba(180,150,70,0.3)";
      for(let i=0;i<3;i++){c.beginPath();c.arc(px+hs(px,py,i*5+1)*26+3,py+hs(px,py,i*5+2)*26+3,1+hs(px,py,i*5+3),0,Math.PI*2);c.fill();}
      break;}
    case T.BRIDGE:{c.fillStyle="#183858";c.fillRect(px,py,TL,TL);c.fillStyle="#6b4226";c.fillRect(px+2,py,TL-4,TL);c.fillStyle="#5a3216";c.fillRect(px+2,py+7,TL-4,2);c.fillRect(px+2,py+15,TL-4,2);c.fillRect(px+2,py+23,TL-4,2);break;}
    case T.FLOWER:{c.fillStyle="#2d6a1e";c.fillRect(px,py,TL,TL);
      // Grass detail
      c.fillStyle="#348a24";c.fillRect(px+hs(px,py,1)*24+2,py+hs(px,py,2)*20+6,1,3);c.fillRect(px+hs(px,py,3)*24+2,py+hs(px,py,4)*20+6,1,3);
      const fv=((Math.floor(px/TL)*7+Math.floor(py/TL)*13)%5);
      const fc=["#e84444","#e8d844","#d844e8","#44c8e8","#ff8844"][fv];
      const sw=Math.sin(t/800+px/50);
      // Stem
      c.fillStyle="#2a5a18";c.fillRect(px+15,py+16,2,14);
      // Leaves on stem
      c.fillStyle="#3a7a28";c.fillRect(px+11,py+20,4,3);c.fillRect(px+17,py+18,4,3);
      // Multi-petal flower head
      c.fillStyle=fc;
      const fcx=px+15+sw,fcy=py+11;
      c.fillRect(fcx-1,fcy-4,4,3);c.fillRect(fcx-4,fcy-1,3,4);c.fillRect(fcx+3,fcy-1,3,4);c.fillRect(fcx-1,fcy+3,4,3);
      // Center
      c.fillStyle=fv<2?"#ffe844":"#fff";c.fillRect(fcx,fcy,2,2);
      break;}
    case T.PATH:{const pg=c.createRadialGradient(px+16+hs(px,py,5)*10-5,py+16+hs(px,py,6)*10-5,5,px+16,py+16,22);
      pg.addColorStop(0,"#d4be90");pg.addColorStop(0.6,"#c0a878");pg.addColorStop(1,"#b09868");c.fillStyle=pg;c.fillRect(px,py,TL,TL);
      // Rounded dirt patches
      c.fillStyle="rgba(130,110,70,0.4)";
      c.beginPath();c.arc(px+hs(px,py,1)*20+6,py+hs(px,py,2)*20+6,4+hs(px,py,3)*3,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(190,170,120,0.3)";
      c.beginPath();c.arc(px+hs(px,py,10)*18+7,py+hs(px,py,11)*18+7,3+hs(px,py,12)*3,0,Math.PI*2);c.fill();
      // Pebbles
      if(hs(px,py,60)>.6){c.fillStyle="rgba(140,135,125,0.6)";
        for(let i=0;i<2;i++){c.beginPath();c.arc(px+hs(px,py,61+i*5)*24+4,py+hs(px,py,62+i*5)*24+4,1.5+hs(px,py,63+i*5),0,Math.PI*2);c.fill();}}
      break;}
    case T.ROCK:{const rbg=iD?(dg.fc||dg.color):"#245a18";c.fillStyle=rbg;c.fillRect(px,py,TL,TL);
      const rg=c.createRadialGradient(px+14,py+12,3,px+16,py+16,14);rg.addColorStop(0,"#999");rg.addColorStop(0.5,"#777");rg.addColorStop(1,"#555");
      c.fillStyle=rg;c.beginPath();c.ellipse(px+16,py+16,13,10,0,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(255,255,255,0.1)";c.beginPath();c.ellipse(px+13,py+12,6,4,-.3,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(0,0,0,0.2)";c.beginPath();c.ellipse(px+18,py+22,10,3,0,0,Math.PI*2);c.fill();break;}
    case T.BUSH:{c.fillStyle="#2d6a1e";c.fillRect(px,py,TL,TL);
      c.fillStyle="rgba(0,0,0,0.15)";c.beginPath();c.ellipse(px+16,py+28,12,3,0,0,Math.PI*2);c.fill(); // shadow
      c.fillStyle="#1a5a10";c.beginPath();c.arc(px+16,py+18,11,0,Math.PI*2);c.fill();
      c.fillStyle="#228a18";c.beginPath();c.arc(px+16,py+16,9,0,Math.PI*2);c.fill();
      c.fillStyle="#2a9a22";c.beginPath();c.arc(px+14,py+14,5,0,Math.PI*2);c.fill();
      c.fillStyle="#3aaa2a";c.fillRect(px+11,py+13,3,2);c.fillRect(px+19,py+15,3,2);
      // Occasional berries
      if(hs(px,py,50)>0.5){c.fillStyle="#cc3333";c.fillRect(px+10,py+19,3,3);c.fillRect(px+20,py+17,3,3);}
      break;}
    case T.TALLGRASS:{c.fillStyle="#2d6a1e";c.fillRect(px,py,TL,TL);
      const sw2=Math.sin(t/600+px/40)*2;
      // Multiple layers of grass at different heights/colors
      c.fillStyle="#2a7020";
      for(let i=0;i<6;i++){const gx=px+2+i*5+hs(px,py,i*3)*3+sw2;const gh=12+hs(px,py,i*3+1)*10;c.fillRect(gx,py+TL-gh,2,gh);}
      c.fillStyle="#3a9030";
      for(let i=0;i<4;i++){const gx=px+4+i*7+hs(px,py,i*5+20)*4+sw2*.7;const gh=8+hs(px,py,i*5+21)*8;c.fillRect(gx,py+TL-gh,2,gh);}
      c.fillStyle="#4aa040";
      for(let i=0;i<3;i++){const gx=px+6+i*8+hs(px,py,i*7+40)*5+sw2*.5;c.fillRect(gx,py+TL-8-hs(px,py,i*7+41)*6,1,6);}
      break;}
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
      const flicker=Math.sin(t/100)*2;const fg=Math.sin(t/80)*0.15+0.35;
      c.fillStyle=`rgba(255,150,30,${fg})`;c.beginPath();c.arc(px+16,py+10,10,0,Math.PI*2);c.fill();
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
      c.fillStyle="rgba(255,255,150,0.3)";c.font="10px monospace";c.textAlign="center";c.fillText("⬦",px+16,py+19);c.textAlign="left";
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
    case T.PIT:{c.fillStyle="#040408";c.fillRect(px,py,TL,TL);
      const pg=c.createRadialGradient(px+16,py+16,2,px+16,py+16,18);
      pg.addColorStop(0,"#000004");pg.addColorStop(0.7,"#080810");pg.addColorStop(1,iD?(dg.fc||"#1a1a2a"):"#2a3a28");
      c.fillStyle=pg;c.fillRect(px,py,TL,TL);
      c.strokeStyle="rgba(0,0,0,0.5)";c.lineWidth=2;c.strokeRect(px+3,py+3,TL-6,TL-6);break;}
    case T.SPIKE:{c.fillStyle=iD?(dg.fc||dg.color):"#38982e";c.fillRect(px,py,TL,TL);
      if(iD){c.strokeStyle="rgba(255,255,255,0.03)";c.strokeRect(px+1,py+1,TL-2,TL-2);}
      const spUp=Math.sin(t/750)>0;
      if(spUp){c.fillStyle="#888";
        for(let sx2=0;sx2<3;sx2++)for(let sy2=0;sy2<3;sy2++){const spx=px+5+sx2*10,spy=py+5+sy2*10;
          c.beginPath();c.moveTo(spx,spy+6);c.lineTo(spx+3,spy);c.lineTo(spx+6,spy+6);c.fill();}
        c.fillStyle="rgba(200,200,200,0.3)";
        for(let sx2=0;sx2<3;sx2++)for(let sy2=0;sy2<3;sy2++){const spx=px+5+sx2*10,spy=py+5+sy2*10;
          c.beginPath();c.moveTo(spx+1,spy+4);c.lineTo(spx+3,spy);c.lineTo(spx+3,spy+4);c.fill();}
      }else{c.fillStyle="rgba(0,0,0,0.3)";
        for(let sx2=0;sx2<3;sx2++)for(let sy2=0;sy2<3;sy2++){c.beginPath();c.arc(px+8+sx2*10,py+8+sy2*10,2,0,Math.PI*2);c.fill();}}
      break;}
    case T.EMPTY:c.fillStyle="#080808";c.fillRect(px,py,TL,TL);break;
    default:c.fillStyle=iD?(dg.fc||dg.color):"#2d6a1e";c.fillRect(px,py,TL,TL);
  }
}

// Organic terrain overlay — paints curved blobs and spline edges over the tile grid
function drawTerrainOverlay(c,m,t){
  if(!m)return;
  // For each tile, draw soft organic extensions that overlap neighbors of same type
  // This breaks up the grid pattern and creates flowing landscape feel
  const tColor=(tl)=>{
    if(tl===T.GRASS||tl===T.FLOWER||tl===T.TALLGRASS||tl===T.BUSH||tl===T.STUMP)return["#44aa38","#3ca030","#38982e"];
    if(tl===T.WATER)return["#3070b8","#2860a0","#205088"];
    if(tl===T.PATH||tl===T.BRIDGE)return["#d0b880","#c0a870","#b09860"];
    if(tl===T.SAND)return["#e0cc68","#d4c058","#c8b448"];
    if(tl===T.TREE)return["#2a8020","#248018","#1e7010"];
    return null;
  };
  const tGrp=(tl)=>{
    if(tl===T.WATER)return 1;
    if(tl===T.PATH||tl===T.BRIDGE)return 2;
    if(tl===T.SAND)return 3;
    if(tl===T.GRASS||tl===T.FLOWER||tl===T.TALLGRASS||tl===T.BUSH||tl===T.STUMP||tl===T.TREE)return 0;
    return-1;
  };
  // PASS 1: Organic same-type connections — draw soft blobs between adjacent same-type tiles
  for(let y=0;y<RO;y++)for(let x=0;x<CO;x++){
    const tl=m[y][x];const g=tGrp(tl);if(g<0)continue;
    const cols=tColor(tl);if(!cols)continue;
    const cx2=x*TL+TL/2,cy2=y*TL+TL/2;
    // Check each neighbor — if same group, draw connecting blob
    const dirs=[[1,0],[0,1],[1,1],[1,-1]];
    for(const[dx2,dy2]of dirs){
      const nx=x+dx2,ny=y+dy2;
      if(nx<0||nx>=CO||ny<0||ny>=RO)continue;
      if(tGrp(m[ny][nx])!==g)continue;
      // Draw organic connecting blob between tile centers
      const nx2=nx*TL+TL/2,ny2=ny*TL+TL/2;
      const mx2=(cx2+nx2)/2,my2=(cy2+ny2)/2;
      // Noise offset for organic feel
      const nox=hs(x*7+y*13,nx*11+ny*17,42)*8-4;
      const noy=hs(x*11+y*7,nx*17+ny*11,43)*8-4;
      const r=TL*0.45+hs(x*3+y*5,nx*5+ny*3,44)*6;
      c.fillStyle=cols[1];c.globalAlpha=0.3;
      c.beginPath();c.arc(mx2+nox,my2+noy,r,0,Math.PI*2);c.fill();
    }
  }
  c.globalAlpha=1;
  // PASS 2: Soft boundary transitions — curved gradient edges between different types
  for(let y=0;y<RO;y++)for(let x=0;x<CO;x++){
    const tl=m[y][x];const g=tGrp(tl);if(g<0)continue;
    const cols=tColor(tl);if(!cols)continue;
    const px2=x*TL,py2=y*TL;
    // Check right and bottom neighbors for different terrain
    for(const[dx2,dy2]of[[1,0],[0,1]]){
      const nx=x+dx2,ny=y+dy2;
      if(nx<0||nx>=CO||ny<0||ny>=RO)continue;
      const ng=tGrp(m[ny][nx]);
      if(ng===g||ng<0)continue;
      const ncols=tColor(m[ny][nx]);if(!ncols)continue;
      // Draw 5-7 overlapping soft circles along the border creating curved edge
      const count=5+((hs(x,y,99)*3)|0);
      for(let i=0;i<count;i++){
        const frac=i/(count-1);
        // Position along the shared edge with noise offset
        let bx,by;
        if(dx2===1){// right edge
          bx=px2+TL;by=py2+frac*TL;
        }else{// bottom edge
          bx=px2+frac*TL;by=py2+TL;
        }
        // Noise perpendicular to edge
        const nPerp=(hs(x*13+y*7+i*31,dx2*19+dy2*23,50+i)*12-6);
        const nAlong=(hs(x*7+y*13+i*37,dx2*23+dy2*19,60+i)*6-3);
        if(dx2===1){bx+=nPerp;by+=nAlong;}else{bx+=nAlong;by+=nPerp;}
        const r=4+hs(x*11+y*17+i*41,0,70+i)*5;
        // Draw blob of current terrain type extending into neighbor
        c.fillStyle=cols[0];c.globalAlpha=0.25+hs(x,y,80+i)*0.15;
        c.beginPath();c.arc(bx-dx2*2,by-dy2*2,r,0,Math.PI*2);c.fill();
        // And neighbor extending back
        c.fillStyle=ncols[0];c.globalAlpha=0.25+hs(nx,ny,80+i)*0.15;
        c.beginPath();c.arc(bx+dx2*2,by+dy2*2,r,0,Math.PI*2);c.fill();
      }
    }
  }
  c.globalAlpha=1;
  // PASS 3: Organic grass detail — scattered blades and clumps as small curved strokes
  for(let y=0;y<RO;y++)for(let x=0;x<CO;x++){
    const tl=m[y][x];
    if(tl===T.GRASS||tl===T.TALLGRASS){
      const px2=x*TL,py2=y*TL;
      const count=3+((hs(x,y,200)*4)|0);
      for(let i=0;i<count;i++){
        const gx=px2+hs(x,y,210+i*3)*28+2;
        const gy=py2+hs(x,y,211+i*3)*24+4;
        const gh=3+hs(x,y,212+i*3)*4;
        const sway=Math.sin(t/800+gx/40+gy/30)*1.5;
        c.strokeStyle=`rgba(60,160,40,${0.3+hs(x,y,213+i*3)*0.3})`;
        c.lineWidth=1;c.lineCap="round";
        c.beginPath();c.moveTo(gx,gy+gh);c.quadraticCurveTo(gx+sway,gy+gh/2,gx+sway*1.5,gy);c.stroke();
      }
    }
    // Water surface detail — flowing curves
    if(tl===T.WATER){
      const px2=x*TL,py2=y*TL;
      const w1=Math.sin(t/700+px2/35)*2.5;
      const w2=Math.sin(t/550+py2/30)*2;
      c.strokeStyle="rgba(80,160,220,0.2)";c.lineWidth=1.2;c.lineCap="round";
      c.beginPath();c.moveTo(px2-4,py2+10+w1);
      c.bezierCurveTo(px2+8,py2+7+w1,px2+20,py2+13+w1,px2+TL+4,py2+10+w1);c.stroke();
      c.strokeStyle="rgba(60,140,200,0.15)";
      c.beginPath();c.moveTo(px2-2,py2+22+w2);
      c.bezierCurveTo(px2+10,py2+19+w2,px2+22,py2+25+w2,px2+TL+2,py2+22+w2);c.stroke();
      // Shimmer
      const sh=Math.sin(t/250+px2/18+py2/22)*0.06+0.04;
      c.fillStyle=`rgba(200,235,255,${sh})`;
      c.beginPath();c.arc(px2+10+w1*2,py2+6,2.5,0,Math.PI*2);c.fill();
    }
    // Path surface detail — pebbles and wear marks
    if(tl===T.PATH){
      const px2=x*TL,py2=y*TL;
      for(let i=0;i<2;i++){
        c.fillStyle=`rgba(160,140,100,${0.15+hs(x,y,300+i)*0.15})`;
        const px3=px2+hs(x,y,301+i*5)*24+4,py3=py2+hs(x,y,302+i*5)*24+4;
        c.beginPath();c.arc(px3,py3,2+hs(x,y,303+i*5)*2,0,Math.PI*2);c.fill();
      }
    }
    // Sand ripple curves
    if(tl===T.SAND){
      const px2=x*TL,py2=y*TL;
      c.strokeStyle="rgba(170,140,60,0.15)";c.lineWidth=0.8;
      const wr=hs(x,y,400)*6;
      c.beginPath();c.moveTo(px2-2,py2+11+wr);
      c.bezierCurveTo(px2+10,py2+8+wr,px2+22,py2+14+wr,px2+TL+2,py2+11+wr);c.stroke();
      c.beginPath();c.moveTo(px2-2,py2+23+wr*0.5);
      c.bezierCurveTo(px2+10,py2+20+wr*0.5,px2+22,py2+26+wr*0.5,px2+TL+2,py2+23+wr*0.5);c.stroke();
    }
  }
  c.lineCap="butt";
}

// ============ GAME ============
export default function ZeldaGame(){
  const cvR=useRef(null),stR=useRef(null),kyR=useRef(new Set()),anR=useRef(null),ltR=useRef(0);
  const tcR=useRef({dir:null,atk:false});const[muOn,setMu]=useState(true);const ltRef=useRef(null);
  const[customMu,setCustomMu]=useState({...DEFAULT_MUSIC});
  const[showMuPicker,setShowMuPicker]=useState(false);
  const customAuRef=useRef(null);
  const wrapRef=useRef(null);const[isFS,setIsFS]=useState(false);
  const trR=useRef({active:false,alpha:0,dir:0}); // screen transition fade

  const init=useCallback(()=>({
    p:{x:7*TL,y:9*TL,dir:2,hp:8,mhp:8,keys:0,bombs:3,spd:2.8,ifr:0,tri:[false,false,false]},
    sw:{a:false,t:0},loc:{ty:"ow",scr:"1,1",di:-1},
    en:[],pk:new Set(),dr:new Set(),cl:new Set(),
    msg:{text:"",t:0},go:false,won:false,dg:dc(DG),pt:[],ec:0,
    // New polish state
    title:true, // title screen active
    fade:{a:false,alpha:0,dir:1,cb:null,t:0}, // screen transition fade
    shake:{x:0,y:0,t:0}, // camera shake
    drops:[], // enemy item drops (bouncing hearts/bombs)
    death:{a:false,t:0,spin:0}, // death animation
    lowHp:0, // low HP warning timer
    paused:false, // pause state
    dmgNums:[], // floating damage numbers
    freeze:0, // freeze frame timer (ms)
    roomFlash:0, // room cleared flash
    respawn:{ty:"ow",scr:"1,1",di:-1,x:7*TL,y:9*TL}, // last safe position
    heartContainers:[], // bosses that already gave heart containers
    finalOpen:false, // whether final dungeon is accessible
    triMu:false, // triforce music playing (overrides area music)
    bProj:[], // boss projectiles
    gt:0, // game time for spike timing
  }),[]);

  useEffect(()=>{stR.current=init();
    const playTitleMu=()=>{if(ltRef.current==="title")return;
      if(customMu.title){const a=new Audio(customMu.title);a.loop=true;a.volume=0.5;
        a.play().then(()=>{ltRef.current="title";customAuRef.current=a;}).catch(()=>{});}
      else{Tone.start().then(()=>{if(!au.i)initAu();playTh("title");ltRef.current="title";}).catch(()=>{});}};
    playTitleMu();
    let auUnlocked=false;
    const kd=e=>{kyR.current.add(e.key.toLowerCase());if(["arrowup","arrowdown","arrowleft","arrowright"," "].includes(e.key.toLowerCase()))e.preventDefault();
      const s=stR.current;
      if(!auUnlocked){auUnlocked=true;Tone.start().then(()=>{initSfx();initAu();});playTitleMu();
        if(s&&s.title)return;}
      if(s&&s.title&&(e.key===" "||e.key==="Enter"||e.key==="z")&&ltRef.current==="title"){
        s.title=false;le(s);ltRef.current=null;}
      if(e.key.toLowerCase()==="p"&&s&&!s.title&&!s.go&&!s.won){s.paused=!s.paused;}
      if(e.key.toLowerCase()==="m"){Tone.start().then(()=>{initSfx();});setMu(p=>!p);}};
    const ku=e=>kyR.current.delete(e.key.toLowerCase());
    const unlockClick=()=>{if(!auUnlocked){auUnlocked=true;Tone.start().then(()=>{initSfx();initAu();});playTitleMu();}};
    window.addEventListener("keydown",kd);window.addEventListener("keyup",ku);
    window.addEventListener("click",unlockClick);window.addEventListener("touchstart",unlockClick);
    const lp=t=>{const dt=Math.min(t-ltR.current,33);ltR.current=t;upd(dt);drw(t);anR.current=requestAnimationFrame(lp);};
    anR.current=requestAnimationFrame(lp);
    return()=>{window.removeEventListener("keydown",kd);window.removeEventListener("keyup",ku);cancelAnimationFrame(anR.current);stopMu();
      window.removeEventListener("click",unlockClick);window.removeEventListener("touchstart",unlockClick);};
  },[]);

  useEffect(()=>{
    if(!muOn){stopMu();if(customAuRef.current){customAuRef.current.pause();customAuRef.current=null;}ltRef.current=null;return;}
    const ck=()=>{const s=stR.current;if(!s)return;
      let th=s.title?"title":s.triMu?"triforce":(s.loc.ty==="ow"?"overworld":(s.loc.ty==="cave"?"forest":s.dg[s.loc.di].th));
      if(th!==ltRef.current){
        stopMu();if(customAuRef.current){customAuRef.current.pause();customAuRef.current=null;}
        if(customMu[th]){
          const a=new Audio(customMu[th]);a.loop=true;a.volume=0.5;
          a.play().then(()=>{ltRef.current=th;customAuRef.current=a;}).catch(()=>{});
        }else{
          Tone.start().then(()=>{if(!au.i)initAu();playTh(th);ltRef.current=th;}).catch(()=>{});
        }
      }};
    ck();const iv=setInterval(ck,500);return()=>{clearInterval(iv);};},[muOn,customMu]);

  function le(s){s.bProj=[];const rk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}`;if(s.cl.has(rk)){s.en=[];return;}
    if(s.loc.ty==="dg"){const rm=s.dg[s.loc.di].rooms[s.loc.scr];s.en=rm?.enemies?rm.enemies.map(e=>({...e,mhp:e.hp,fl:0,mt:Math.random()*2000,st:"patrol",stT:0,hx:e.x,hy:e.y})):[];}
    else if(s.loc.ty==="cave"){const cv=CAVES[s.loc.di];s.en=cv?.room?.enemies?cv.room.enemies.map(e=>({...e,mhp:e.hp,fl:0,mt:Math.random()*2000,st:"patrol",stT:0,hx:e.x,hy:e.y})):[];}
    else{const oe2=OW_EN[s.loc.scr];s.en=oe2?oe2.map(e=>({...e,mhp:e.hp,fl:0,mt:Math.random()*2000,st:"patrol",stT:0,hx:e.x,hy:e.y})):[];}}

  function gm(s){if(s.loc.ty==="ow")return OW[s.loc.scr]||null;if(s.loc.ty==="cave")return CAVES[s.loc.di]?.room?.tiles||null;return s.dg[s.loc.di].rooms[s.loc.scr]?.tiles||null;}

  function gts(s,ns,tx,ty){let m;if(s.loc.ty==="ow")m=OW[ns];else m=s.dg[s.loc.di].rooms[ns]?.tiles;
    if(!m||ty<0||ty>=RO||tx<0||tx>=CO)return T.WALL;return m[ty][tx];}

  function iS(s,tx,ty){const m=gm(s);if(!m)return true;
    // Caves are single rooms — all edges are walls
    if(s.loc.ty==="cave"){if(tx<0||tx>=CO||ty<0||ty>=RO)return true;
      const tl=m[ty][tx];return SOLID.has(tl);}
    const[sx,sy]=s.loc.scr.split(",").map(Number);
    if(tx<0){return SOLID.has(gts(s,`${sx-1},${sy}`,CO+tx,ty));}
    if(tx>=CO){return SOLID.has(gts(s,`${sx+1},${sy}`,tx-CO,ty));}
    if(ty<0){return SOLID.has(gts(s,`${sx},${sy-1}`,tx,RO+ty));}
    if(ty>=RO){return SOLID.has(gts(s,`${sx},${sy+1}`,tx,ty-RO));}
    const tl=m[ty][tx];if(SOLID.has(tl))return true;
    if(tl===T.DOOR||tl===T.BOSS_DOOR){const dk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${tx},${ty}`;
      if(s.dr.has(dk))return false;if(s.p.keys>0){s.p.keys--;s.dr.add(dk);s.msg={text:tl===T.BOSS_DOOR?"Boss door opened!":"Door opened!",t:1500};sfx("door");
        s.pt.push(...Array.from({length:8},()=>({x:tx*TL+16,y:ty*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:500,c:"#fd3"})));return false;}return true;}
    return false;}

  // Enemy is blocked by wall at tile check
  function eSolid(s,tx,ty){const m=gm(s);if(!m||tx<0||tx>=CO||ty<0||ty>=RO)return true;return SOLID.has(m[ty][tx])||m[ty][tx]===T.DOOR||m[ty][tx]===T.BOSS_DOOR;}

  function cPk(s){const p=s.p,m=gm(s);if(!m)return;const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const tx=ptx+dx,ty=pty+dy;if(ty<0||ty>=RO||tx<0||tx>=CO)continue;
      const tl=m[ty][tx],pk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${tx},${ty}`;if(s.pk.has(pk))continue;
      const cx=tx*TL,cy=ty*TL;if(!(p.x<cx+TL&&p.x+PS>cx&&p.y<cy+TL&&p.y+PS>cy))continue;
      if(tl===T.KEY){s.pk.add(pk);p.keys++;s.msg={text:"Got a key!",t:1500};sfx("pickup");s.pt.push(...Array.from({length:6},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:600,c:"#fd3"})));}
      else if(tl===T.BOMB){s.pk.add(pk);p.bombs+=3;s.msg={text:"Got bombs!",t:1500};sfx("pickup");s.pt.push(...Array.from({length:6},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:600,c:"#88f"})));}
      else if(tl===T.HEART){s.pk.add(pk);p.hp=Math.min(p.hp+2,p.mhp);s.msg={text:"Heart restored!",t:1500};sfx("pickup");s.pt.push(...Array.from({length:6},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*3,dy:-Math.random()*2,l:500,c:"#f66"})));}
      else if(tl===T.TRIFORCE){s.pk.add(pk);p.tri[s.loc.di]=true;const c2=p.tri.filter(Boolean).length;sfx("triforce");
        s.pt.push(...Array.from({length:20},()=>({x:cx+16,y:cy+16,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:1000,c:"#fd3"})));
        if(c2>=3){s.won=true;s.msg={text:"All Triforce pieces! YOU WIN!",t:99999};}else s.msg={text:`Triforce piece ${c2}/3!`,t:2500};}}}

  function cTr(s){const p=s.p,loc=s.loc;
    if(loc.ty==="ow"){
      if(s.ec<=0){
        // Dungeon entries
        for(const ent of DE){if(ent.s!==loc.scr)continue;
          if(ent.d===3&&!s.finalOpen)continue; // final dungeon locked
          for(const[tx,ty]of ent.t){if(p.x<tx*TL+TL&&p.x+PS>tx*TL&&p.y<ty*TL+TL&&p.y+PS>ty*TL){
            loc.ty="dg";loc.di=ent.d;const dg=s.dg[ent.d];let er="0,0";for(const rk of Object.keys(dg.rooms))if(dg.rooms[rk].tiles.some(r=>r.includes(T.STAIRS_UP))){er=rk;break;}
            s.respawn={ty:"dg",scr:er,di:ent.d,x:7*TL,y:9*TL};
            loc.scr=er;p.x=7*TL;p.y=9*TL;le(s);s.msg={text:dg.name,t:2000};return;}}}
        // Cave entries
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
      if(p.y<-4){const ns=`${rx},${ry-1}`;if(dg.rooms[ns]){loc.scr=ns;p.y=H2-PS-8;le(s);}else p.y=-4;}
      if(p.y>H2-PS+4){const ns=`${rx},${ry+1}`;if(dg.rooms[ns]){loc.scr=ns;p.y=8;le(s);}else p.y=H2-PS+4;}
      if(p.x<-4){const ns=`${rx-1},${ry}`;if(dg.rooms[ns]){loc.scr=ns;p.x=W2-PS-8;le(s);}else p.x=-4;}
      if(p.x>W2-PS+4){const ns=`${rx+1},${ry}`;if(dg.rooms[ns]){loc.scr=ns;p.x=8;le(s);}else p.x=W2-PS+4;}}}

  function upd(dt){const s=stR.current;if(!s||s.title||s.paused)return;s.gt+=dt;
    // Freeze frame (boss kill pause)
    if(s.freeze>0){s.freeze-=dt;return;}
    // Death animation
    if(s.death.a){s.death.t+=dt;s.death.spin+=dt*0.015;if(s.death.t>1500&&!s.go){s.go=true;s.msg={text:"Press R to respawn",t:99999};}return;}
    if(s.go||s.won){if(kyR.current.has("r")){
      if(s.won){stR.current=init();stR.current.title=false;le(stR.current);return;}
      // Respawn: keep keys, triforce, cleared rooms, opened doors, picked items
      const old=s;const ns=init();ns.title=false;ns.p.keys=old.p.keys;ns.p.bombs=old.p.bombs;ns.p.tri=[...old.p.tri];ns.p.mhp=old.p.mhp;ns.p.hp=ns.p.mhp;
      ns.pk=old.pk;ns.dr=old.dr;ns.cl=old.cl;ns.dg=old.dg;ns.heartContainers=[...old.heartContainers];ns.finalOpen=old.finalOpen;
      ns.loc.ty=old.respawn.ty;ns.loc.scr=old.respawn.scr;ns.loc.di=old.respawn.di;ns.p.x=old.respawn.x;ns.p.y=old.respawn.y;
      stR.current=ns;le(ns);}return;}
    // Fade transition
    if(s.fade.a){s.fade.t+=dt;s.fade.alpha=Math.min(1,s.fade.t/250);
      if(s.fade.alpha>=1&&s.fade.cb){s.fade.cb();s.fade.cb=null;s.fade.dir=-1;s.fade.t=0;}
      if(s.fade.dir===-1){s.fade.alpha=Math.max(0,1-s.fade.t/250);if(s.fade.alpha<=0)s.fade.a=false;}return;}
    // Camera shake decay
    if(s.shake.t>0){s.shake.t-=dt;const intensity=s.shake.t/300*4;s.shake.x=(Math.random()-.5)*intensity;s.shake.y=(Math.random()-.5)*intensity;}
    else{s.shake.x=0;s.shake.y=0;}
    // Low HP warning
    if(s.p.hp<=2)s.lowHp+=dt;else s.lowHp=0;

    const ky=kyR.current,p=s.p,tc=tcR.current;let dx=0,dy=0;
    if(ky.has("arrowup")||ky.has("w")){dy=-1;p.dir=0;}if(ky.has("arrowdown")||ky.has("s")){dy=1;p.dir=2;}
    if(ky.has("arrowleft")||ky.has("a")){dx=-1;p.dir=3;}if(ky.has("arrowright")||ky.has("d")){dx=1;p.dir=1;}
    if(tc.dir==="up"){dy=-1;p.dir=0;}if(tc.dir==="down"){dy=1;p.dir=2;}
    if(tc.dir==="left"){dx=-1;p.dir=3;}if(tc.dir==="right"){dx=1;p.dir=1;}
    if(dx&&dy){dx*=.707;dy*=.707;}const sp=p.spd*(dt/16);
    // Collision uses a narrower hitbox (inset 6px sides, 4px top, feet at bottom)
    const HB={x:6,y:4,w:PS-12,h:PS-4};
    const tm=(px2,py2)=>{const l=Math.floor((px2+HB.x)/TL),r=Math.floor((px2+HB.x+HB.w-1)/TL),t2=Math.floor((py2+HB.y)/TL),b=Math.floor((py2+HB.y+HB.h-1)/TL);
      for(let ty=t2;ty<=b;ty++)for(let tx=l;tx<=r;tx++)if(iS(s,tx,ty))return false;return true;};
    const moved=dx!==0||dy!==0;
    // Try full movement, then each axis separately for wall sliding
    if(tm(p.x+dx*sp,p.y+dy*sp)){p.x+=dx*sp;p.y+=dy*sp;}
    else{if(tm(p.x+dx*sp,p.y))p.x+=dx*sp;if(tm(p.x,p.y+dy*sp))p.y+=dy*sp;}
    // Corner nudging — if blocked on one axis and near a tile edge, nudge to slide around
    if(moved&&dx!==0&&!tm(p.x+dx*sp*2,p.y)){const cy=p.y+HB.y+HB.h/2,tcy=Math.round(cy/TL)*TL;const off=cy-tcy;
      if(Math.abs(off)<10&&tm(p.x+dx*sp,p.y-Math.sign(off)*2))p.y-=Math.sign(off)*1.5*(dt/16);}
    if(moved&&dy!==0&&!tm(p.x,p.y+dy*sp*2)){const cx=p.x+HB.x+HB.w/2,tcx=Math.round(cx/TL)*TL;const off=cx-tcx;
      if(Math.abs(off)<10&&tm(p.x-Math.sign(off)*2,p.y+dy*sp))p.x-=Math.sign(off)*1.5*(dt/16);}
    // Proximity door opening — check tile player is facing
    {const m2=gm(s);if(m2){
      const pcx=Math.floor((p.x+PS/2)/TL),pcy=Math.floor((p.y+PS/2)/TL);
      const ftx=pcx+(p.dir===1?1:p.dir===3?-1:0),fty=pcy+(p.dir===0?-1:p.dir===2?1:0);
      if(ftx>=0&&ftx<CO&&fty>=0&&fty<RO){const ft=m2[fty][ftx];
        if(ft===T.DOOR||ft===T.BOSS_DOOR){const dk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${ftx},${fty}`;
          if(!s.dr.has(dk)&&p.keys>0){p.keys--;s.dr.add(dk);sfx("door");
            s.msg={text:ft===T.BOSS_DOOR?"Boss door opened!":"Door opened!",t:1500};
            s.pt.push(...Array.from({length:8},()=>({x:ftx*TL+16,y:fty*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:500,c:"#fd3"})));}}}
    }}
    // PUSH BLOCK — push when walking into it
    if(moved){const m2=gm(s);if(m2){
      const pcx=Math.floor((p.x+PS/2)/TL),pcy=Math.floor((p.y+PS/2)/TL);
      const ftx=pcx+(dx>0?1:dx<0?-1:0),fty=pcy+(dy>0?1:dy<0?-1:0);
      if(ftx>=0&&ftx<CO&&fty>=0&&fty<RO&&m2[fty][ftx]===T.PUSH&&!s.pushCd){
        // Check if space behind block is open
        const bx=ftx+(dx>0?1:dx<0?-1:0),by=fty+(dy>0?1:dy<0?-1:0);
        if(bx>=0&&bx<CO&&by>=0&&by<RO&&!SOLID.has(m2[by][bx])&&m2[by][bx]!==T.DOOR&&m2[by][bx]!==T.BOSS_DOOR){
          // Check if landing on a pressure plate
          const wasPlate=m2[by][bx]===T.PLATE;
          m2[by][bx]=T.PUSH;m2[fty][ftx]=T.FLOOR;
          s.pushCd=true;setTimeout(()=>{if(stR.current)stR.current.pushCd=false;},300);
          sfx("door");s.pt.push(...Array.from({length:4},()=>({x:ftx*TL+16,y:fty*TL+16,dx:(Math.random()-.5)*2,dy:(Math.random()-.5)*2,l:300,c:"#aaa"})));
          // Pressure plate trigger — spawn key or open sealed door
          if(wasPlate){sfx("pickup");s.msg={text:"Something opened!",t:1500};s.shake.t=200;
            // Find any DOOR in this room and open it, or spawn a KEY
            let opened=false;
            for(let yy=0;yy<RO;yy++)for(let xx=0;xx<CO;xx++){if(m2[yy][xx]===T.DOOR){
              const dk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${xx},${yy}`;s.dr.add(dk);opened=true;
              s.pt.push(...Array.from({length:6},()=>({x:xx*TL+16,y:yy*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:500,c:"#fd3"})));}}
            if(!opened){// Spawn a key in center of room
              m2[5][7]=T.KEY;s.pt.push(...Array.from({length:8},()=>({x:7*TL+16,y:5*TL+16,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:600,c:"#fd3"})));}}
        }}}}
    // LEVER — activate by attacking it (sword swing while facing)
    if(s.sw.a&&s.sw.t>SD*0.5){const m2=gm(s);if(m2&&!s.leverCd){
      const pcx=Math.floor((p.x+PS/2)/TL),pcy=Math.floor((p.y+PS/2)/TL);
      const ftx=pcx+(p.dir===1?1:p.dir===3?-1:0),fty=pcy+(p.dir===0?-1:p.dir===2?1:0);
      if(ftx>=0&&ftx<CO&&fty>=0&&fty<RO&&m2[fty][ftx]===T.LEVER){
        m2[fty][ftx]=T.FLOOR;s.leverCd=true;setTimeout(()=>{if(stR.current)stR.current.leverCd=false;},1000);
        sfx("pickup");s.msg={text:"Lever pulled!",t:1500};s.shake.t=200;
        s.pt.push(...Array.from({length:8},()=>({x:ftx*TL+16,y:fty*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:500,c:"#f88"})));
        // Find DOOR or spawn KEY
        let opened=false;
        for(let yy=0;yy<RO;yy++)for(let xx=0;xx<CO;xx++){if(m2[yy][xx]===T.DOOR){
          const dk=`${s.loc.ty}:${s.loc.di}:${s.loc.scr}:${xx},${yy}`;s.dr.add(dk);opened=true;
          s.pt.push(...Array.from({length:6},()=>({x:xx*TL+16,y:yy*TL+16,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:500,c:"#fd3"})));}}
        if(!opened){m2[5][8]=T.KEY;s.pt.push(...Array.from({length:8},()=>({x:8*TL+16,y:5*TL+16,dx:(Math.random()-.5)*4,dy:-Math.random()*3,l:600,c:"#fd3"})));}}}}
    // Spike trap damage — spikes toggle on/off every 1.5s
    {const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);const m2=gm(s);
      if(m2&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO){
        if(m2[pty][ptx]===T.SPIKE&&Math.sin(s.gt/750)>0&&p.ifr<=0){p.hp--;p.ifr=IFR;sfx("hurt");s.shake.t=200;
          s.pt.push(...Array.from({length:3},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*2,dy:(Math.random()-.5)*2,l:300,c:"#888"})));
          if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}
        // Pit fall — take damage and teleport to room entrance
        if(m2[pty][ptx]===T.PIT&&p.ifr<=0){p.hp--;p.ifr=IFR;sfx("hurt");s.shake.t=400;
          s.pt.push(...Array.from({length:8},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:500,c:"#444"})));
          let ex=7*TL,ey=9*TL;
          for(let ty2=RO-1;ty2>=0;ty2--)for(let tx2=0;tx2<CO;tx2++){if(m2[ty2][tx2]===T.STAIRS_UP||m2[ty2][tx2]===T.FLOOR&&ty2>8){ex=tx2*TL;ey=ty2*TL;ty2=-1;break;}}
          p.x=ex;p.y=ey;s.msg={text:"Fell into a pit!",t:1000};
          if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}}}
    // Footstep dust on path/sand
    if(moved&&Math.random()<0.15){const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);const m2=gm(s);
      if(m2&&pty>=0&&pty<RO&&ptx>=0&&ptx<CO){const ft=m2[pty][ptx];
        if(ft===T.PATH||ft===T.SAND)s.pt.push({x:p.x+PS/2+(Math.random()-0.5)*6,y:p.y+PS-2,dx:(Math.random()-.5)*0.5,dy:-Math.random()*0.8,l:400,c:ft===T.SAND?"#c8b060":"#a89060"});}}
    if((ky.has(" ")||ky.has("z")||tc.atk)&&!s.sw.a){s.sw.a=true;s.sw.t=SD;sfx("sword");}if(tc.atk)tc.atk=false;
    // Bomb usage
    if(ky.has("b")&&p.bombs>0&&!s.bombCd){
      const ftx=Math.floor((p.x+PS/2)/TL)+(p.dir===1?1:p.dir===3?-1:0);
      const fty=Math.floor((p.y+PS/2)/TL)+(p.dir===0?-1:p.dir===2?1:0);
      const mp2=gm(s);
      if(mp2&&fty>=0&&fty<RO&&ftx>=0&&ftx<CO&&mp2[fty][ftx]===T.CRACK){
        p.bombs--;s.bombCd=true;setTimeout(()=>{if(stR.current)stR.current.bombCd=false;},500);
        sfx("bomb");s.shake.t=400;
        // Check if this crack hides a cave entrance
        let isCave=false;
        if(s.loc.ty==="ow"){for(const cv of CAVES){if(cv.s===s.loc.scr){for(const[cx2,cy2]of cv.t){if(cx2===ftx&&cy2===fty){isCave=true;break;}}if(isCave)break;}}}
        mp2[fty][ftx]=isCave?T.ENTRANCE:T.FLOOR;
        s.msg={text:isCave?"A hidden cave!":"Secret passage!",t:2000};
        s.pt.push(...Array.from({length:15},()=>({x:ftx*TL+16,y:fty*TL+16,dx:(Math.random()-.5)*6,dy:(Math.random()-.5)*6,l:700,c:["#fa3","#f83","#ff3","#aaa"][Math.random()*4|0]})));
      }
    }
    if(s.sw.a){s.sw.t-=dt;if(s.sw.t<=0)s.sw.a=false;}if(p.ifr>0)p.ifr-=dt;
    for(let i=s.pt.length-1;i>=0;i--){const pt=s.pt[i];pt.x+=pt.dx*(dt/16);pt.y+=pt.dy*(dt/16);pt.l-=dt;if(pt.l<=0)s.pt.splice(i,1);}
    // Update damage numbers
    for(let i=s.dmgNums.length-1;i>=0;i--){const dn=s.dmgNums[i];dn.y-=1.2*(dt/16);dn.t-=dt;if(dn.t<=0)s.dmgNums.splice(i,1);}
    // Room clear flash decay
    if(s.roomFlash>0)s.roomFlash-=dt;
    // Update drops (bouncing items) — MAGNETIC when close
    for(let i=s.drops.length-1;i>=0;i--){const d2=s.drops[i];d2.t+=dt;d2.y+=d2.vy*(dt/16);d2.vy+=0.15*(dt/16);
      if(d2.y>d2.ground){d2.y=d2.ground;d2.vy*=-0.5;if(Math.abs(d2.vy)<0.3)d2.vy=0;}
      // Magnetic pull when within 40px
      const mdx=p.x+PS/2-d2.x,mdy=p.y+PS/2-d2.y,mdist=Math.hypot(mdx,mdy);
      if(mdist<40&&mdist>1){const pull=2.5*(1-mdist/40);d2.x+=mdx/mdist*pull*(dt/16);d2.y+=mdy/mdist*pull*(dt/16);}
      // Collect drops
      if(Math.abs(p.x+PS/2-d2.x)<14&&Math.abs(p.y+PS/2-d2.y)<14){
        if(d2.type==="heart"){p.hp=Math.min(p.hp+1,p.mhp);sfx("pickup");}
        else if(d2.type==="bomb"){p.bombs++;sfx("pickup");}
        else if(d2.type==="heartcontainer"){p.mhp+=2;p.hp=p.mhp;sfx("triforce");s.msg={text:"Heart Container! Max HP up!",t:2500};}
        else if(d2.type==="triforce"){p.tri[s.loc.di]=true;sfx("triforce");s.shake.t=500;s.triMu=false;
          const tc=p.tri.filter(Boolean).length;
          if(tc>=3&&!s.finalOpen){s.finalOpen=true;s.msg={text:"The Dark Sanctum has opened!",t:3000};
            // Open final dungeon entrance at 3,1
            const fm=OW["3,1"];if(fm){fm[5][7]=T.ENTRANCE;fm[5][8]=T.ENTRANCE;fm[6][7]=T.ENTRANCE;fm[6][8]=T.ENTRANCE;}
          }else{s.msg={text:`Triforce piece ${tc}/3!`,t:2000};}
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
      let es=e.type==="boss"?1.0:e.type==="ghost"?1.3:(e.type==="bat"||e.type==="fire_bat")?1.2:1.0;
      let moveX=0,moveY=0;
      if(e.st==="chase"||e.type==="boss"){const ang=Math.atan2(pcy-ecy,pcx-ecx);
        if(e.type==="ghost"||e.type==="bat"||e.type==="fire_bat"){const w=Math.sin(e.mt/250)*.6;moveX=Math.cos(ang+w)*es;moveY=Math.sin(ang+w)*es;}
        else if(e.type==="boss"){
          const ang=Math.atan2(pcy-ecy,pcx-ecx);
          if(e.pattern==="charge"){// Forest Guardian — charges, pauses, fires root burst
            const phase=Math.floor(e.mt/2000)%3;
            if(phase===2){const bsp=es*3;moveX=Math.cos(ang)*bsp;moveY=Math.sin(ang)*bsp;} // charge!
            else if(phase===1){moveX=0;moveY=0;
              if(Math.floor(e.mt/2000)!==Math.floor((e.mt-dt)/2000)){
                for(let a=0;a<4;a++){const ra=a*Math.PI/2;s.bProj.push({x:ecx,y:ecy,dx:Math.cos(ra)*2.5,dy:Math.sin(ra)*2.5,type:"root",l:800});}
                sfx("bomb");}}
            else{const bsp=es*0.6;moveX=Math.cos(ang)*bsp;moveY=Math.sin(ang)*bsp;} // stalk
          }else if(e.pattern==="spawn"){// Flame Wyrm — circles, spawns fire_bats, shoots fireballs
            const ca=e.mt/800;moveX=Math.cos(ca)*es*1.2;moveY=Math.sin(ca)*es*1.2;
            if(Math.floor(e.mt/3000)!==Math.floor((e.mt-dt)/3000)&&s.en.length<8){
              s.en.push({x:e.x,y:e.y,hp:2,mhp:2,type:"fire_bat",fl:0,mt:0,st:"chase",stT:0,hx:e.x,hy:e.y});}
            if(Math.floor(e.mt/1500)!==Math.floor((e.mt-dt)/1500)){
              const fa=Math.atan2(pcy-ecy,pcx-ecx);s.bProj.push({x:ecx,y:ecy,dx:Math.cos(fa)*3,dy:Math.sin(fa)*3,type:"fire",l:1200});sfx("bomb");}
          }else if(e.pattern==="teleport"){// Shadow Lord — teleports, fires shadow orbs
            const bsp=es*(1+Math.sin(e.mt/400)*.4);moveX=Math.cos(ang)*bsp;moveY=Math.sin(ang)*bsp;
            if(Math.floor(e.mt/4000)!==Math.floor((e.mt-dt)/4000)){
              e.x=TL*2+Math.random()*(W2-TL*4);e.y=TL*2+Math.random()*(H2-TL*4);
              for(let a=0;a<8;a++){const sa=a*Math.PI/4;s.bProj.push({x:e.x+ES/2,y:e.y+ES/2,dx:Math.cos(sa)*2,dy:Math.sin(sa)*2,type:"shadow",l:1000});}
              s.pt.push(...Array.from({length:8},()=>({x:e.x+ES/2,y:e.y+ES/2,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:400,c:"#a0a0ff"})));sfx("bomb");}
            if(Math.floor(e.mt/2000)!==Math.floor((e.mt-dt)/2000)){
              const sa=Math.atan2(pcy-ecy,pcx-ecx);s.bProj.push({x:ecx,y:ecy,dx:Math.cos(sa)*1.8,dy:Math.sin(sa)*1.8,type:"shadow",l:1500});}
          }else if(e.pattern==="all"){// Dark King — all patterns combined
            const phase=Math.floor(e.mt/3000)%4;
            if(phase===0){const bsp=es*2.5;moveX=Math.cos(ang)*bsp;moveY=Math.sin(ang)*bsp;} // charge
            else if(phase===1){const ca=e.mt/600;moveX=Math.cos(ca)*es*1.5;moveY=Math.sin(ca)*es*1.5;
              if(Math.floor(e.mt/2500)!==Math.floor((e.mt-dt)/2500)&&s.en.length<6){
                s.en.push({x:e.x,y:e.y,hp:3,mhp:3,type:"ghost",fl:0,mt:0,st:"chase",stT:0,hx:e.x,hy:e.y});}} // spawn
            else if(phase===2){moveX=0;moveY=0;
              if(Math.floor(e.mt/3000)!==Math.floor((e.mt-dt)/3000)){
                e.x=TL*2+Math.random()*(W2-TL*4);e.y=TL*2+Math.random()*(H2-TL*4);}} // teleport
            else{const bsp=es*(1+Math.sin(e.mt/300)*.5);moveX=Math.cos(ang)*bsp;moveY=Math.sin(ang)*bsp;} // aggressive
          }else{const bsp=es*(1+Math.sin(e.mt/400)*.4);moveX=Math.cos(ang)*bsp;moveY=Math.sin(ang)*bsp;}
        }else{moveX=Math.cos(ang)*es;moveY=Math.sin(ang)*es;}
      }else if(e.st==="patrol"){const ang=Math.sin(e.mt/1200)*Math.PI*2;moveX=Math.cos(ang)*es*.4;moveY=Math.sin(ang)*es*.4;}
      else if(e.st==="retreat"){const ang=Math.atan2(e.hy-ecy,e.hx-ecx);moveX=Math.cos(ang)*es*.6;moveY=Math.sin(ang)*es*.6;}
      const nx=e.x+moveX*(dt/16),ny=e.y+moveY*(dt/16);
      const em=4; // enemy hitbox margin
      const eCanX=!eSolid(s,Math.floor((nx+em)/TL),Math.floor((e.y+em)/TL))&&!eSolid(s,Math.floor((nx+ES-em)/TL),Math.floor((e.y+em)/TL))&&!eSolid(s,Math.floor((nx+em)/TL),Math.floor((e.y+ES-em)/TL))&&!eSolid(s,Math.floor((nx+ES-em)/TL),Math.floor((e.y+ES-em)/TL));
      const eCanY=!eSolid(s,Math.floor((e.x+em)/TL),Math.floor((ny+em)/TL))&&!eSolid(s,Math.floor((e.x+ES-em)/TL),Math.floor((ny+em)/TL))&&!eSolid(s,Math.floor((e.x+em)/TL),Math.floor((ny+ES-em)/TL))&&!eSolid(s,Math.floor((e.x+ES-em)/TL),Math.floor((ny+ES-em)/TL));
      if(eCanX)e.x=nx;if(eCanY)e.y=ny;
      e.x=Math.max(TL,Math.min(W2-TL-ES,e.x));e.y=Math.max(TL,Math.min(H2-TL-ES,e.y));
      if(s.sw.a){const sOff=SR*0.7,sR=SR*0.85;let sx2=p.x+PS/2,sy2=p.y+PS/2;if(p.dir===0)sy2-=sOff;if(p.dir===2)sy2+=sOff;if(p.dir===3)sx2-=sOff;if(p.dir===1)sx2+=sOff;
        const sDist=Math.hypot(sx2-ecx,sy2-ecy);
        if(sDist<sR+ES*0.4&&e.fl<=0){e.hp--;e.fl=300;const kb=e.type==="boss"?10:18,kba=Math.atan2(ecy-pcy,ecx-pcx);e.x+=Math.cos(kba)*kb;e.y+=Math.sin(kba)*kb;
          sfx("hit",e.type==="boss"?"E2":"C3");
          s.dmgNums.push({x:ecx,y:ecy-8,t:600,val:1,c:e.type==="boss"?"#ff4":"#fff"});
          s.pt.push(...Array.from({length:5},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*4,dy:(Math.random()-.5)*4,l:300,c:"#fff"})));}}
      if(e.hp<=0){s.en.splice(i,1);
        s.pt.push(...Array.from({length:12},()=>({x:ecx,y:ecy,dx:(Math.random()-.5)*5,dy:(Math.random()-.5)*5,l:500,c:e.type==="boss"?"#fd3":"#f88"})));
        // Enemy drops + boss rewards
        if(e.type==="boss"){sfx("bossdeath");s.shake.t=600;s.freeze=400;
          s.drops.push({x:ecx,y:ecy-8,vy:-4,ground:ecy,type:"heart",t:0},{x:ecx-10,y:ecy-8,vy:-3.5,ground:ecy,type:"heart",t:0},{x:ecx+10,y:ecy-8,vy:-3.5,ground:ecy,type:"bomb",t:0});
          const bossId=`${s.loc.di}:${e.name}`;
          if(!s.heartContainers.includes(bossId)){s.heartContainers.push(bossId);
            s.drops.push({x:ecx,y:ecy-12,vy:-5,ground:ecy,type:"heartcontainer",t:0});}
          // Triforce drops from sky (dungeons 0-2 only)
          if(s.loc.di>=0&&s.loc.di<3&&!p.tri[s.loc.di]){
            s.drops.push({x:ecx,y:-20,vy:0.5,ground:ecy-8,type:"triforce",t:0});
            s.triMu=true; // trigger triforce music
          }
          // Final boss victory
          if(s.loc.di===3){s.won=true;s.msg={text:"The Dark King is defeated! Peace restored!",t:99999};}
        }else{sfx("kill");
          if(Math.random()<0.35)s.drops.push({x:ecx,y:ecy-4,vy:-3,ground:ecy,type:Math.random()<0.7?"heart":"bomb",t:0});}
        if(e.type==="boss")s.msg={text:`${e.name||"Boss"} defeated!`,t:2000};
        if(s.en.length===0){s.cl.add(rk);s.roomFlash=500;sfx("pickup");}
        continue;}
      if(p.ifr<=0&&dist<(PS+ES)*0.38){p.hp--;p.ifr=IFR;sfx("hurt");s.shake.t=300;
        // Knockback player away from enemy
        const hkb=8,hka=Math.atan2(pcy-ecy,pcx-ecx);if(tm(p.x+Math.cos(hka)*hkb,p.y+Math.sin(hka)*hkb)){p.x+=Math.cos(hka)*hkb;p.y+=Math.sin(hka)*hkb;}
        s.pt.push(...Array.from({length:4},()=>({x:pcx,y:pcy,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:300,c:"#f44"})));
        if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}}
    // Boss projectiles
    for(let i=s.bProj.length-1;i>=0;i--){const bp=s.bProj[i];bp.x+=bp.dx*(dt/16);bp.y+=bp.dy*(dt/16);bp.l-=dt;
      if(bp.l<=0||bp.x<0||bp.x>W2||bp.y<0||bp.y>H2){s.bProj.splice(i,1);continue;}
      if(p.ifr<=0&&Math.hypot(p.x+PS/2-bp.x,p.y+PS/2-bp.y)<14){
        p.hp--;p.ifr=IFR;sfx("hurt");s.shake.t=300;s.bProj.splice(i,1);
        const hka=Math.atan2(p.y+PS/2-bp.y,p.x+PS/2-bp.x);if(tm(p.x+Math.cos(hka)*6,p.y+Math.sin(hka)*6)){p.x+=Math.cos(hka)*6;p.y+=Math.sin(hka)*6;}
        s.pt.push(...Array.from({length:4},()=>({x:p.x+PS/2,y:p.y+PS/2,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,l:300,c:bp.type==="fire"?"#f80":bp.type==="root"?"#4a2":"#80f"})));
        if(p.hp<=0){s.death.a=true;s.death.t=0;s.death.spin=0;}}}
    cPk(s);cTr(s);if(s.msg.t>0)s.msg.t-=dt;if(s.ec>0)s.ec-=dt;}

  function drw(t){const cv=cvR.current;if(!cv)return;const c=cv.getContext("2d");const s=stR.current;if(!s)return;
    const FH=H2+HH; // full canvas height
    c.setTransform(4,0,0,4,0,0);
    c.fillStyle="#060610";c.fillRect(0,0,W2,FH);
    // ===== TITLE SCREEN — Anime hero on cliff overlooking the land =====
    if(s.title){
      const W=W2,H=FH;
      // SKY — warm sunset gradient
      const sky=c.createLinearGradient(0,0,0,H*0.6);
      sky.addColorStop(0,"#1a1040");sky.addColorStop(0.25,"#3a2060");sky.addColorStop(0.45,"#c05030");
      sky.addColorStop(0.55,"#e8a040");sky.addColorStop(0.65,"#f0d060");sky.addColorStop(0.75,"#d0a838");sky.addColorStop(1,"#2a5020");
      c.fillStyle=sky;c.fillRect(0,0,W,H);
      // SUN — low on horizon
      const sunY=H*0.52;const sunG=c.createRadialGradient(W*0.35,sunY,5,W*0.35,sunY,80);
      sunG.addColorStop(0,"rgba(255,240,200,0.9)");sunG.addColorStop(0.3,"rgba(255,200,100,0.5)");sunG.addColorStop(1,"rgba(255,150,50,0)");
      c.fillStyle=sunG;c.beginPath();c.arc(W*0.35,sunY,80,0,Math.PI*2);c.fill();
      c.fillStyle="rgba(255,230,180,0.8)";c.beginPath();c.arc(W*0.35,sunY,20,0,Math.PI*2);c.fill();
      // STARS — randomly scattered across upper sky
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
      // SHOOTING STAR — streaks across every ~8 seconds
      {const cycle=8000,phase=(t%cycle)/cycle;
        if(phase<0.15){const p2=phase/0.15; // 0→1 over streak duration
          const sx1=W*0.8,sy1=H*0.05,sx2=W*0.15,sy2=H*0.35;
          const cx2=sx1+(sx2-sx1)*p2,cy2=sy1+(sy2-sy1)*p2;
          // Trail
          for(let i=0;i<8;i++){const tp=Math.max(0,p2-i*0.015);
            const tx2=sx1+(sx2-sx1)*tp,ty2=sy1+(sy2-sy1)*tp;
            c.fillStyle=`rgba(255,255,220,${(1-i/8)*0.6*(1-p2*0.5)})`;c.beginPath();c.arc(tx2,ty2,1.5-i*0.15,0,Math.PI*2);c.fill();}
          // Head
          c.fillStyle=`rgba(255,255,240,${0.9*(1-p2*0.3)})`;c.beginPath();c.arc(cx2,cy2,2,0,Math.PI*2);c.fill();
          c.fillStyle=`rgba(255,255,200,${0.4*(1-p2)})`;c.beginPath();c.arc(cx2,cy2,5,0,Math.PI*2);c.fill();}}
      // CLOUDS drifting
      for(let i=0;i<5;i++){const cx2=((t/40+i*130)%((W+120)))-60,cy2=H*0.15+i*25+Math.sin(i*2)*15;
        const cg=c.createRadialGradient(cx2,cy2,5,cx2,cy2,35+i*8);
        cg.addColorStop(0,`rgba(200,150,120,${0.15+i*0.02})`);cg.addColorStop(1,"rgba(200,150,120,0)");
        c.fillStyle=cg;c.beginPath();c.ellipse(cx2,cy2,40+i*10,15+i*3,0,0,Math.PI*2);c.fill();}
      // DISTANT MOUNTAINS
      c.fillStyle="#2a4038";c.beginPath();c.moveTo(0,H*0.55);
      c.lineTo(W*0.08,H*0.42);c.lineTo(W*0.18,H*0.48);c.lineTo(W*0.28,H*0.38);c.lineTo(W*0.4,H*0.46);
      c.lineTo(W*0.5,H*0.40);c.lineTo(W*0.58,H*0.44);c.lineTo(W*0.65,H*0.5);c.lineTo(W,H*0.55);
      c.lineTo(W,H*0.6);c.lineTo(0,H*0.6);c.fill();
      c.fillStyle="#1a3028";c.beginPath();c.moveTo(0,H*0.55);
      c.lineTo(W*0.1,H*0.48);c.lineTo(W*0.22,H*0.52);c.lineTo(W*0.35,H*0.46);c.lineTo(W*0.45,H*0.50);
      c.lineTo(W*0.55,H*0.53);c.lineTo(W*0.62,H*0.56);c.lineTo(W,H*0.58);c.lineTo(W,H*0.62);c.lineTo(0,H*0.62);c.fill();
      // ROLLING GREEN LAND below
      const landG=c.createLinearGradient(0,H*0.55,0,H);landG.addColorStop(0,"#3a8830");landG.addColorStop(0.4,"#2a6820");landG.addColorStop(1,"#1a4a14");
      c.fillStyle=landG;c.beginPath();c.moveTo(0,H*0.58);
      c.bezierCurveTo(W*0.2,H*0.55,W*0.4,H*0.62,W*0.6,H*0.58);
      c.bezierCurveTo(W*0.75,H*0.55,W*0.85,H*0.6,W,H*0.56);c.lineTo(W,H);c.lineTo(0,H);c.fill();
      // Tiny trees on landscape
      for(let i=0;i<12;i++){const tx2=W*0.05+i*W*0.07+hs(i,0,10)*20,ty2=H*0.56+hs(i,0,11)*H*0.15;
        const ts=3+hs(i,0,12)*4;c.fillStyle="#1a5010";c.beginPath();c.arc(tx2,ty2,ts,0,Math.PI*2);c.fill();
        c.fillStyle="#3a2010";c.fillRect(tx2-1,ty2+ts-1,2,ts);}
      // River winding through landscape
      c.strokeStyle="rgba(60,140,200,0.4)";c.lineWidth=3;c.beginPath();
      c.moveTo(W*0.15,H*0.62);c.bezierCurveTo(W*0.25,H*0.65,W*0.3,H*0.60,W*0.45,H*0.67);
      c.bezierCurveTo(W*0.55,H*0.72,W*0.5,H*0.63,W*0.6,H*0.70);c.stroke();
      // CLIFF — right side, hero stands on it
      const cliffX=W*0.62,cliffY=H*0.50;
      // Cliff face
      const cliffG=c.createLinearGradient(cliffX,cliffY,cliffX+W*0.4,H);
      cliffG.addColorStop(0,"#5a5040");cliffG.addColorStop(0.5,"#4a4030");cliffG.addColorStop(1,"#3a3020");
      c.fillStyle=cliffG;c.beginPath();c.moveTo(cliffX,cliffY);c.lineTo(cliffX+20,cliffY+5);
      c.lineTo(W,cliffY+30);c.lineTo(W,H);c.lineTo(cliffX-20,H);c.lineTo(cliffX-15,cliffY+40);c.closePath();c.fill();
      // Cliff top grass
      c.fillStyle="#3a8830";c.beginPath();c.moveTo(cliffX-18,cliffY+2);
      c.bezierCurveTo(cliffX,cliffY-5,cliffX+40,cliffY-2,W,cliffY+25);
      c.lineTo(W,cliffY+35);c.bezierCurveTo(cliffX+40,cliffY+8,cliffX,cliffY+5,cliffX-18,cliffY+12);c.fill();
      // Additional grass below cliff top
      c.fillStyle="#2a6820";c.fillRect(cliffX-20,cliffY+10,W-cliffX+20,H-cliffY-10);
      // Rock texture on cliff
      c.strokeStyle="rgba(0,0,0,0.1)";c.lineWidth=1;
      for(let i=0;i<6;i++){c.beginPath();c.moveTo(cliffX-5+i*15,cliffY+20+i*20);c.lineTo(cliffX+10+i*20,cliffY+50+i*25);c.stroke();}
      // ===== HERO ON CLIFF — anime style =====
      const hx2=W*0.72,hy2=cliffY-45;
      const windSway=Math.sin(t/600)*2;const capeSway=Math.sin(t/400)*8;
      // Shadow under hero
      c.fillStyle="rgba(0,0,0,0.2)";c.beginPath();c.ellipse(hx2,cliffY-1,14,4,0,0,Math.PI*2);c.fill();
      // CAPE — flowing behind in wind
      const capeG=c.createLinearGradient(hx2,hy2+10,hx2-25+capeSway,hy2+50);
      capeG.addColorStop(0,"#1a6a1a");capeG.addColorStop(1,"#0a4a0a");
      c.fillStyle=capeG;c.beginPath();c.moveTo(hx2-4,hy2+8);c.bezierCurveTo(hx2-15,hy2+25,hx2-25+capeSway,hy2+40,hx2-20+capeSway*1.2,hy2+52);
      c.lineTo(hx2-10+capeSway*0.5,hy2+48);c.bezierCurveTo(hx2-8,hy2+35,hx2-2,hy2+20,hx2+2,hy2+10);c.fill();
      // Cape edge highlight
      c.strokeStyle="rgba(100,200,80,0.3)";c.lineWidth=1;c.beginPath();
      c.moveTo(hx2-4,hy2+8);c.bezierCurveTo(hx2-15,hy2+25,hx2-25+capeSway,hy2+40,hx2-20+capeSway*1.2,hy2+52);c.stroke();
      // BOOTS
      c.fillStyle="#5a3018";c.beginPath();c.ellipse(hx2-5,cliffY-4,5,4,0,0,Math.PI*2);c.fill();
      c.beginPath();c.ellipse(hx2+5,cliffY-4,5,4,0,0,Math.PI*2);c.fill();
      // LEGS
      c.fillStyle="#c8b080";c.fillRect(hx2-6,hy2+32,5,14);c.fillRect(hx2+1,hy2+32,5,14);
      // TUNIC body
      const tunicG=c.createLinearGradient(hx2-10,hy2+10,hx2+10,hy2+34);
      tunicG.addColorStop(0,"#48bb48");tunicG.addColorStop(1,"#2a8a2a");
      c.fillStyle=tunicG;c.beginPath();c.moveTo(hx2-10,hy2+12);c.lineTo(hx2+10,hy2+12);
      c.lineTo(hx2+9,hy2+34);c.lineTo(hx2-9,hy2+34);c.fill();
      // Belt
      c.fillStyle="#a87a2a";c.fillRect(hx2-9,hy2+26,18,3);c.fillStyle="#d4b040";c.fillRect(hx2-3,hy2+26,6,3);
      // ARMS — one forward (looking out)
      c.fillStyle="#48bb48";c.fillRect(hx2+9,hy2+14,5,12);c.fillRect(hx2-14,hy2+16+windSway,5,10);
      // Hands
      c.fillStyle="#f0c8a0";c.beginPath();c.arc(hx2+11,hy2+27,3,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(hx2-12,hy2+27+windSway,3,0,Math.PI*2);c.fill();
      // SWORD in right hand — gleaming
      c.strokeStyle="#c0c0d8";c.lineWidth=2.5;c.lineCap="round";
      c.beginPath();c.moveTo(hx2+12,hy2+25);c.lineTo(hx2+14,hy2+5);c.stroke();
      c.strokeStyle="#fff";c.lineWidth=1;c.beginPath();c.moveTo(hx2+12,hy2+24);c.lineTo(hx2+14,hy2+8);c.stroke();
      // Sword guard
      c.strokeStyle="#b8862a";c.lineWidth=2.5;c.beginPath();c.moveTo(hx2+8,hy2+25);c.lineTo(hx2+16,hy2+25);c.stroke();
      // Sword glint
      const glint=Math.sin(t/300)*0.5+0.5;
      c.fillStyle=`rgba(255,255,220,${glint*0.8})`;c.beginPath();c.arc(hx2+14,hy2+7,2,0,Math.PI*2);c.fill();
      // HEAD
      c.fillStyle="#f0c8a0";c.beginPath();c.arc(hx2,hy2+4,9,0,Math.PI*2);c.fill();
      // HAIR — blonde, windswept
      const hairG=c.createLinearGradient(hx2-8,hy2-6,hx2+8,hy2+2);
      hairG.addColorStop(0,"#e8c040");hairG.addColorStop(1,"#c8a030");
      c.fillStyle=hairG;c.beginPath();c.arc(hx2,hy2+1,9,Math.PI+0.4,Math.PI*2-0.4);c.fill();
      // Wind-blown hair strands
      c.fillStyle="#d8b030";c.beginPath();c.moveTo(hx2-7,hy2);
      c.bezierCurveTo(hx2-14,hy2-2+windSway,hx2-18,hy2+5+windSway,hx2-15,hy2+10+windSway*1.5);
      c.lineTo(hx2-12,hy2+8+windSway);c.bezierCurveTo(hx2-14,hy2+3+windSway,hx2-10,hy2+1,hx2-6,hy2+2);c.fill();
      c.fillStyle="#c8a028";c.beginPath();c.moveTo(hx2-5,hy2-2);
      c.bezierCurveTo(hx2-10,hy2-5+windSway*0.7,hx2-16,hy2+2+windSway,hx2-12,hy2+7+windSway);
      c.lineTo(hx2-10,hy2+5+windSway);c.bezierCurveTo(hx2-12,hy2,hx2-8,hy2-3,hx2-4,hy2);c.fill();
      // HAT — pointed, flowing
      c.fillStyle="#2aaa2a";c.beginPath();c.moveTo(hx2-8,hy2);c.lineTo(hx2,hy2-12);c.lineTo(hx2+8,hy2);
      c.bezierCurveTo(hx2+4,hy2-2,hx2-4,hy2-2,hx2-8,hy2);c.fill();
      // Hat tail flowing in wind
      c.fillStyle="#28992a";c.beginPath();c.moveTo(hx2,hy2-11);
      c.bezierCurveTo(hx2-8+capeSway*0.6,hy2-14,hx2-15+capeSway*0.8,hy2-8,hx2-18+capeSway,hy2-4);
      c.lineTo(hx2-14+capeSway*0.7,hy2-6);c.bezierCurveTo(hx2-10+capeSway*0.4,hy2-10,hx2-5,hy2-12,hx2+1,hy2-10);c.fill();
      // FACE — looking out at landscape (3/4 view left)
      c.fillStyle="#2244aa";c.beginPath();c.arc(hx2-3,hy2+3,2,0,Math.PI*2);c.fill();
      c.fillStyle="#fff";c.fillRect(hx2-3.5,hy2+2,1,1);
      // Determined expression
      c.strokeStyle="#aa6644";c.lineWidth=0.8;c.beginPath();c.moveTo(hx2-4,hy2+7);c.lineTo(hx2-1,hy2+7.5);c.stroke();
      // Ear
      c.fillStyle="#e8c0a0";c.beginPath();c.ellipse(hx2+7,hy2+4,2,3.5,0.2,0,Math.PI*2);c.fill();
      // ===== TITLE TEXT in sky =====
      c.textAlign="center";const glow=Math.sin(t/400)*0.3+0.7;
      // Title — clean golden text
      const titleG=c.createLinearGradient(0,H*0.10,0,H*0.18);titleG.addColorStop(0,"#ffd633");titleG.addColorStop(1,"#e8a020");
      c.fillStyle=titleG;c.font="bold 28px monospace";c.fillText("THE LEGEND OF LINK",W/2,H*0.14);
      // Subtitle
      c.fillStyle="rgba(255,220,180,0.7)";c.font="12px monospace";c.fillText("Quest for the Triforce",W/2,H*0.20);
      // SPINNING TRIFORCE — large, each piece rotates independently
      const triCX=W/2,triCY=H*0.28,triS=24;
      const triFade=Math.sin(t/1200)*0.4+0.6;
      const drawTriPiece=(cx2,cy2,s2)=>{
        c.save();c.translate(cx2,cy2);c.globalAlpha=triFade;
        // Glow
        const pg=c.createRadialGradient(0,0,s2*0.3,0,0,s2*1.5);
        pg.addColorStop(0,`rgba(253,211,51,${glow*0.3})`);pg.addColorStop(1,"rgba(253,211,51,0)");
        c.fillStyle=pg;c.beginPath();c.arc(0,0,s2*1.5,0,Math.PI*2);c.fill();
        // Triangle
        c.fillStyle="#ffd633";c.beginPath();c.moveTo(0,-s2);c.lineTo(s2*0.866,s2*0.5);c.lineTo(-s2*0.866,s2*0.5);c.fill();
        // Inner highlight
        const is2=s2*0.6;c.fillStyle="#ffe866";c.beginPath();c.moveTo(0,-is2);c.lineTo(is2*0.866,is2*0.5);c.lineTo(-is2*0.866,is2*0.5);c.fill();
        // Sparkle center
        c.fillStyle=`rgba(255,255,220,${glow*0.6})`;c.beginPath();c.arc(0,2,3,0,Math.PI*2);c.fill();
        c.globalAlpha=1;c.restore();
      };
      // Top piece
      drawTriPiece(triCX,triCY-triS*0.6,triS*0.7);
      // Bottom-left
      drawTriPiece(triCX-triS*0.7,triCY+triS*0.4,triS*0.7);
      // Bottom-right
      drawTriPiece(triCX+triS*0.7,triCY+triS*0.4,triS*0.7);
      // Connecting light beams between pieces
      c.strokeStyle=`rgba(253,220,80,${triFade*0.25})`;c.lineWidth=2;
      c.beginPath();c.moveTo(triCX,triCY-triS*0.6);c.lineTo(triCX-triS*0.7,triCY+triS*0.4);
      c.lineTo(triCX+triS*0.7,triCY+triS*0.4);c.closePath();c.stroke();
      // PRESS START
      // Dark gradient at bottom
      const bottomG=c.createLinearGradient(0,H*0.82,0,H);bottomG.addColorStop(0,"rgba(0,0,0,0)");bottomG.addColorStop(1,"rgba(0,0,0,0.6)");
      c.fillStyle=bottomG;c.fillRect(0,H*0.82,W,H*0.2);
      if(Math.sin(t/500)>0){c.fillStyle="#fff";c.font="bold 14px monospace";c.fillText("TAP OR PRESS SPACE",W/2,H*0.92);}
      c.fillStyle="rgba(255,255,255,0.3)";c.font="9px monospace";c.fillText("WASD move \u00b7 Space attack \u00b7 B bomb \u00b7 M music",W/2,H*0.97);
      c.textAlign="left";c.lineCap="butt";return;}
    // ===== HUD (drawn in top HH pixels, above game) =====
    const p=s.p;
    c.fillStyle="#111";c.fillRect(0,0,W2,HH);
    c.fillStyle="rgba(60,60,60,0.5)";c.fillRect(0,HH-1,W2,1);
    for(let i=0;i<p.mhp/2;i++){const hx=8+i*22,hy=8;
      if(p.hp>=(i+1)*2){c.fillStyle="#ee3333";dH(c,hx,hy,16);}
      else if(p.hp>=i*2+1){c.save();c.beginPath();c.rect(hx,hy,8,16);c.clip();c.fillStyle="#ee3333";dH(c,hx,hy,16);c.restore();c.save();c.beginPath();c.rect(hx+8,hy,8,16);c.clip();c.fillStyle="#444";dH(c,hx,hy,16);c.restore();}
      else{c.fillStyle="#444";dH(c,hx,hy,16);}}
    if(p.hp<=2&&p.hp>0&&Math.sin(s.lowHp/200)>0.3){c.fillStyle="rgba(255,50,50,0.15)";c.fillRect(0,0,W2,HH);}
    c.fillStyle="#fd3";c.font="bold 13px monospace";c.fillText(`\ud83d\udd11${p.keys}`,W2-110,21);c.fillStyle="#8af";c.fillText(`\ud83d\udca3${p.bombs}`,W2-60,21);
    for(let i=0;i<3;i++){c.fillStyle=p.tri[i]?"#fd3":"#333";c.font="14px monospace";c.fillText("\u25b2",W2-180+i*20,21);}
    const iD2=s.loc.ty==="dg"||s.loc.ty==="cave";
    if(iD2){const dgn=s.loc.ty==="dg"?s.dg[s.loc.di].name:"Hidden Cave";c.fillStyle="#999";c.font="bold 11px monospace";c.fillText(dgn,p.mhp/2*22+16,21);}
    // ===== GAME AREA (offset by HH) =====
    c.save();c.translate(0,HH);
    // Camera shake
    if(s.shake.t>0)c.translate(s.shake.x,s.shake.y);
    const m=gm(s),loc=s.loc,iD=loc.ty==="dg"||loc.ty==="cave",dg=loc.ty==="dg"?s.dg[loc.di]:(loc.ty==="cave"?{color:"#1a2a18",wc:"#3a5a3a",fc:"#2a3a28",name:"Hidden Cave"}:null);
    c.fillStyle=iD?dg.color:"#2a3a28";c.fillRect(0,0,W2,H2);
    if(m)for(let y=0;y<RO;y++)for(let x=0;x<CO;x++){let tl=m[y][x];const px=x*TL,py=y*TL;
      const pk=`${loc.ty}:${loc.di}:${loc.scr}:${x},${y}`;
      if((tl===T.KEY||tl===T.HEART||tl===T.TRIFORCE||tl===T.BOMB)&&s.pk.has(pk))tl=iD?T.FLOOR:T.GRASS;
      if((tl===T.DOOR||tl===T.BOSS_DOOR)&&s.dr.has(pk))tl=T.FLOOR;dT(c,tl,px,py,iD,dg,t);}
    // Organic terrain overlay — curved mesh blending
    if(!iD)drawTerrainOverlay(c,m,t);
    // Dynamic torch lighting in dungeons
    if(iD&&m){const torches=[];for(let y=0;y<RO;y++)for(let x=0;x<CO;x++)if(m[y][x]===T.TORCH)torches.push([x*TL+16,y*TL+16]);
      if(torches.length>0){for(const[tx2,ty2]of torches){
        const flk=Math.sin(t/200+tx2)*0.08+Math.sin(t/130+ty2)*0.05;
        const r2=90+Math.sin(t/180+tx2*0.1)*15;
        const tg=c.createRadialGradient(tx2,ty2,4,tx2,ty2,r2);
        tg.addColorStop(0,`rgba(255,200,100,${0.18+flk})`);tg.addColorStop(0.5,`rgba(255,150,50,${0.06+flk*0.3})`);tg.addColorStop(1,"rgba(255,100,30,0)");
        c.fillStyle=tg;c.fillRect(tx2-r2,ty2-r2,r2*2,r2*2);}}}
    // Dungeon dust motes
    if(iD){for(let i=0;i<15;i++){const dx2=hs(i,3,77)*W2,dy2=(hs(i,7,88)*H2+t/20)%H2;
      const da=0.15+Math.sin(t/600+i*2)*0.1;c.fillStyle=`rgba(200,180,140,${da})`;c.beginPath();c.arc(dx2+Math.sin(t/400+i)*8,dy2,0.8+hs(i,1,99)*0.8,0,Math.PI*2);c.fill();}}
    // Enemies with enhanced shadows
    for(const e of s.en){const fl=e.fl>0&&Math.floor(e.fl/50)%2,sz=e.type==="boss"?ES*1.5:ES,ex=e.x+(ES-sz)/2,ey=e.y+(ES-sz)/2;
      c.fillStyle="rgba(0,0,0,0.15)";c.beginPath();c.ellipse(e.x+ES/2+3,e.y+ES-1,sz/2+1,4,0.1,0,Math.PI*2);c.fill();
      if(e.type==="ghost")dGh(c,ex,ey,sz,fl,t);else if(e.type==="boss")dBo(c,ex,ey,sz,fl,t,e.hp,e.mhp,loc.di);
      else if(e.type==="bat"||e.type==="fire_bat")dBt(c,ex,ey,sz,fl,t,e.type==="fire_bat");else dSk(c,ex,ey,sz,fl,t);}
    // ===== BOSS PROJECTILES =====
    for(const bp of s.bProj){
      if(bp.type==="root"){c.fillStyle="#3a6a18";c.beginPath();c.arc(bp.x,bp.y,5,0,Math.PI*2);c.fill();
        c.fillStyle="#5a9a28";c.beginPath();c.arc(bp.x-1,bp.y-1,3,0,Math.PI*2);c.fill();
        c.fillStyle="rgba(58,106,24,0.3)";c.beginPath();c.arc(bp.x-bp.dx*2,bp.y-bp.dy*2,3,0,Math.PI*2);c.fill();
      }else if(bp.type==="fire"){const fg=c.createRadialGradient(bp.x,bp.y,1,bp.x,bp.y,6);
        fg.addColorStop(0,"#ff8");fg.addColorStop(0.5,"#f60");fg.addColorStop(1,"rgba(200,0,0,0)");c.fillStyle=fg;c.beginPath();c.arc(bp.x,bp.y,6,0,Math.PI*2);c.fill();
        c.fillStyle="rgba(255,100,0,0.3)";c.beginPath();c.arc(bp.x-bp.dx*2,bp.y-bp.dy*2,4,0,Math.PI*2);c.fill();
      }else if(bp.type==="shadow"){const sg=c.createRadialGradient(bp.x,bp.y,1,bp.x,bp.y,5);
        sg.addColorStop(0,"#c8f");sg.addColorStop(0.6,"#60c");sg.addColorStop(1,"rgba(40,0,80,0)");c.fillStyle=sg;c.beginPath();c.arc(bp.x,bp.y,5,0,Math.PI*2);c.fill();
        c.fillStyle="rgba(100,0,200,0.3)";c.beginPath();c.arc(bp.x-bp.dx*2,bp.y-bp.dy*2,3,0,Math.PI*2);c.fill();}}
    // ===== DROPS =====
    for(const d2 of s.drops){const bob2=Math.sin(t/200)*2;
      if(d2.type==="heart"){c.fillStyle="#ee3333";dH(c,d2.x-6,d2.y-6+bob2,12);c.fillStyle="#ff8888";dH(c,d2.x-3,d2.y-4+bob2,6);}
      else if(d2.type==="heartcontainer"){
        // Glowing big heart
        const hcg=Math.sin(t/150)*0.2+0.4;c.fillStyle=`rgba(255,50,50,${hcg})`;c.beginPath();c.arc(d2.x,d2.y+bob2,12,0,Math.PI*2);c.fill();
        c.fillStyle="#ff2222";dH(c,d2.x-8,d2.y-8+bob2,16);c.fillStyle="#ff8888";dH(c,d2.x-4,d2.y-5+bob2,8);
        c.fillStyle="#fff";dH(c,d2.x-2,d2.y-3+bob2,4);}
      else if(d2.type==="triforce"){
        const tg2=Math.sin(t/150)*0.3+0.7;c.fillStyle=`rgba(253,211,51,${tg2*0.3})`;c.beginPath();c.arc(d2.x,d2.y+bob2,14,0,Math.PI*2);c.fill();
        c.fillStyle="#ffd633";c.beginPath();c.moveTo(d2.x,d2.y-8+bob2);c.lineTo(d2.x+10,d2.y+8+bob2);c.lineTo(d2.x-10,d2.y+8+bob2);c.fill();
        c.fillStyle="#ffe866";c.beginPath();c.moveTo(d2.x,d2.y-5+bob2);c.lineTo(d2.x+6,d2.y+5+bob2);c.lineTo(d2.x-6,d2.y+5+bob2);c.fill();}
      else{c.fillStyle="#444";c.beginPath();c.arc(d2.x,d2.y+bob2,5,0,Math.PI*2);c.fill();c.fillStyle="#666";c.beginPath();c.arc(d2.x,d2.y-1+bob2,4,0,Math.PI*2);c.fill();}}
    // ===== PLAYER (with death animation) =====
    if(s.death.a){const da=Math.min(1,s.death.t/1500);c.globalAlpha=1-da;
      c.save();c.translate(p.x+PS/2,p.y+PS/2);c.rotate(s.death.spin);c.translate(-PS/2,-PS/2);
      dP(c,0,0,p.dir,t);c.restore();c.globalAlpha=1;
    }else{const vis=p.ifr<=0||Math.floor(p.ifr/80)%2;
      if(vis){
        c.fillStyle="rgba(0,0,0,0.18)";c.beginPath();c.ellipse(p.x+PS/2+2,p.y+PS-1,10,3,0.08,0,Math.PI*2);c.fill();
        dP(c,p.x,p.y,p.dir,t);
        if(m&&!iD){const ptx=Math.floor((p.x+PS/2)/TL),pty=Math.floor((p.y+PS/2)/TL);
          for(let dy2=-1;dy2<=1;dy2++)for(let dx2=-1;dx2<=1;dx2++){const gx=ptx+dx2,gy=pty+dy2;
            if(gx>=0&&gx<CO&&gy>=0&&gy<RO&&(m[gy][gx]===T.TALLGRASS||m[gy][gx]===T.GRASS)){
              const dist=Math.hypot(p.x+PS/2-gx*TL-16,p.y+PS/2-gy*TL-16);
              if(dist<30){const sway=Math.sin(t/100+gx*3)*3*(1-dist/30);
                c.fillStyle=m[gy][gx]===T.TALLGRASS?"rgba(80,180,50,0.4)":"rgba(60,160,40,0.2)";
                c.beginPath();c.moveTo(gx*TL+8+sway,gy*TL+4);c.lineTo(gx*TL+16,gy*TL+TL-4);c.lineTo(gx*TL+24+sway,gy*TL+4);c.fill();}}}}
      }}
    if(s.sw.a)dSw(c,p.x,p.y,p.dir,s.sw.t);
    // Enhanced particles with glow
    for(const pt of s.pt){const pa=Math.min(1,pt.l/500);c.globalAlpha=pa;
      const psz=1+pt.l/800;
      c.fillStyle=pt.c;c.globalAlpha=pa*0.3;c.beginPath();c.arc(pt.x,pt.y,psz*2.5,0,Math.PI*2);c.fill();
      c.globalAlpha=pa;c.beginPath();c.arc(pt.x,pt.y,psz,0,Math.PI*2);c.fill();
      c.fillStyle="#fff";c.globalAlpha=pa*0.5;c.beginPath();c.arc(pt.x,pt.y,psz*0.4,0,Math.PI*2);c.fill();}c.globalAlpha=1;
    // Damage numbers
    for(const dn of s.dmgNums){c.globalAlpha=Math.min(1,dn.t/300);c.fillStyle=dn.c;c.font="bold 12px monospace";c.textAlign="center";c.fillText(dn.val,dn.x,dn.y);c.textAlign="left";}c.globalAlpha=1;
    // Room clear flash
    if(s.roomFlash>0){c.fillStyle=`rgba(255,255,200,${s.roomFlash/500*0.25})`;c.fillRect(0,0,W2,H2);}
    // Ambient outdoor light
    if(!iD){const amb=Math.sin(t/15000)*0.03;
      c.fillStyle=amb>0?`rgba(255,200,100,${amb})`:`rgba(100,150,255,${-amb})`;c.fillRect(0,0,W2,H2);}
    // Enhanced vignette
    const vig=c.createRadialGradient(W2/2,H2/2,W2*0.3,W2/2,H2/2,W2*0.75);
    vig.addColorStop(0,"rgba(0,0,0,0)");vig.addColorStop(0.7,iD?"rgba(0,0,0,0.15)":"rgba(0,0,0,0)");vig.addColorStop(1,iD?"rgba(0,0,0,0.4)":"rgba(0,0,10,0.12)");
    c.fillStyle=vig;c.fillRect(0,0,W2,H2);
    // Minimap (in game space, bottom-right)
    if(iD){const rks=Object.keys(dg.rooms),cds=rks.map(k=>k.split(",").map(Number));
      const nX=Math.min(...cds.map(c2=>c2[0])),xX=Math.max(...cds.map(c2=>c2[0])),nY=Math.min(...cds.map(c2=>c2[1])),xY=Math.max(...cds.map(c2=>c2[1]));
      const ms=12,mp=5,mW=(xX-nX+1)*ms+mp*2,mH=(xY-nY+1)*ms+mp*2,mmX=W2-mW-8,mmY=H2-mH-8;
      c.fillStyle="rgba(0,0,0,0.75)";c.fillRect(mmX-1,mmY-1,mW+2,mH+2);c.strokeStyle="rgba(255,255,255,0.15)";c.strokeRect(mmX-1,mmY-1,mW+2,mH+2);
      for(const rk of rks){const[cx,cy]=rk.split(",").map(Number);c.fillStyle=rk===loc.scr?"#fd3":"#555";c.fillRect(mmX+mp+(cx-nX)*ms+1,mmY+mp+(cy-nY)*ms+1,ms-2,ms-2);}}
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
    // Message (in game space)
    if(s.msg.t>0){c.font="bold 14px monospace";const mw=Math.min(c.measureText(s.msg.text).width+48,W2-32),my=H2-56;
      c.fillStyle="rgba(0,0,0,0.85)";const r2=8;c.beginPath();c.moveTo(W2/2-mw/2+r2,my);c.lineTo(W2/2+mw/2-r2,my);c.quadraticCurveTo(W2/2+mw/2,my,W2/2+mw/2,my+r2);c.lineTo(W2/2+mw/2,my+32-r2);c.quadraticCurveTo(W2/2+mw/2,my+32,W2/2+mw/2-r2,my+32);c.lineTo(W2/2-mw/2+r2,my+32);c.quadraticCurveTo(W2/2-mw/2,my+32,W2/2-mw/2,my+32-r2);c.lineTo(W2/2-mw/2,my+r2);c.quadraticCurveTo(W2/2-mw/2,my,W2/2-mw/2+r2,my);c.fill();
      c.strokeStyle="rgba(253,211,51,0.5)";c.stroke();c.fillStyle="#fff";c.textAlign="center";c.fillText(s.msg.text,W2/2,my+20);c.textAlign="left";}
    c.restore(); // end game area offset
    // ===== FULL-CANVAS OVERLAYS (drawn in un-translated space) =====
    const FH2=H2+HH;
    if(s.fade.a){c.fillStyle=`rgba(0,0,0,${s.fade.alpha})`;c.fillRect(0,0,W2,FH2);}
    if(s.paused){c.fillStyle="rgba(0,0,0,0.6)";c.fillRect(0,0,W2,FH2);
      c.fillStyle="#fff";c.font="bold 28px monospace";c.textAlign="center";c.fillText("PAUSED",W2/2,FH2/2-10);
      c.fillStyle="#aaa";c.font="13px monospace";c.fillText("Press P to resume",W2/2,FH2/2+20);c.textAlign="left";}
    if(s.go){c.fillStyle="rgba(10,0,0,0.75)";c.fillRect(0,0,W2,FH2);c.fillStyle="#e33";c.font="bold 36px monospace";c.textAlign="center";c.fillText("GAME OVER",W2/2,FH2/2-20);c.fillStyle="#ccc";c.font="16px monospace";c.fillText("Press R to respawn",W2/2,FH2/2+25);c.textAlign="left";}
    if(s.won){c.fillStyle="rgba(0,0,0,0.75)";c.fillRect(0,0,W2,FH2);c.fillStyle="#fd3";c.font="bold 36px monospace";c.textAlign="center";c.fillText("VICTORY!",W2/2,FH2/2-30);c.fillStyle="#fff";c.font="15px monospace";c.fillText("All Triforce pieces collected!",W2/2,FH2/2+10);c.fillText("Press R to play again",W2/2,FH2/2+35);c.textAlign="left";}}

  const dp=d=>{tcR.current.dir=d},de=()=>{tcR.current.dir=null},at=()=>{tcR.current.atk=true};
  const toggleFS=useCallback(()=>{
    const el=wrapRef.current;if(!el)return;
    if(!document.fullscreenElement){el.requestFullscreen?.().catch(()=>{el.webkitRequestFullscreen?.();});}
    else{document.exitFullscreen?.().catch(()=>{document.webkitExitFullscreen?.();});}
  },[]);
  useEffect(()=>{
    const h=()=>setIsFS(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange",h);document.addEventListener("webkitfullscreenchange",h);
    return()=>{document.removeEventListener("fullscreenchange",h);document.removeEventListener("webkitfullscreenchange",h);};
  },[]);

  return(
    <div ref={wrapRef} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"linear-gradient(180deg,#060608 0%,#0a0c10 100%)",fontFamily:"monospace",color:"#ccc",padding:16,userSelect:"none",WebkitUserSelect:"none"}}>
      <h1 style={{fontSize:24,color:"#fd3",margin:"0 0 4px 0",textShadow:"0 0 20px rgba(253,211,51,0.3), 0 2px 4px rgba(0,0,0,0.5)",letterSpacing:6,fontWeight:"900"}}>THE LEGEND OF LINK</h1>
      <p style={{fontSize:11,color:"#666",margin:"0 0 10px 0",textAlign:"center",letterSpacing:1}}>WASD / Arrows · Space attack · B bomb · P pause · M music</p>
      <canvas ref={cvR} width={W2*4} height={(H2+HH)*4} onClick={()=>{const s=stR.current;if(s&&s.title){if(ltRef.current!=="title")return;s.title=false;le(s);ltRef.current=null;return;}if(s&&s.paused)s.paused=false;}} style={{border:"2px solid #222",borderRadius:6,width:W2,height:H2+HH,maxWidth:"100%",boxShadow:"0 0 60px rgba(0,0,0,0.9), 0 0 10px rgba(253,211,51,0.05)"}}/>
      <div style={{display:"flex",gap:48,marginTop:14,alignItems:"center"}}>
        <div style={{position:"relative",width:104,height:104}}>
          {[["up",36,0,"▲"],["down",36,70,"▼"],["left",0,35,"◀"],["right",70,35,"▶"]].map(([d,l,tt,ch])=>(
            <button key={d} onTouchStart={e=>{e.preventDefault();dp(d)}} onTouchEnd={e=>{e.preventDefault();de()}}
              onMouseDown={()=>dp(d)} onMouseUp={de} onMouseLeave={de}
              style={{position:"absolute",left:l,top:tt,width:34,height:34,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:6,color:"#777",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",touchAction:"none"}}>{ch}</button>))}
        </div>
        <button onTouchStart={e=>{e.preventDefault();at()}} onMouseDown={at}
          style={{width:60,height:60,borderRadius:"50%",background:"radial-gradient(circle,rgba(200,50,50,0.3),rgba(150,30,30,0.15))",border:"2px solid rgba(200,50,50,0.4)",color:"#e88",fontSize:13,fontFamily:"monospace",cursor:"pointer",touchAction:"none",fontWeight:"bold",letterSpacing:1,boxShadow:"0 0 15px rgba(200,50,50,0.1)"}}>ATK</button>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <button onTouchStart={e=>{e.preventDefault();const s2=stR.current;if(s2)s2.paused=!s2.paused;}} onMouseDown={()=>{const s2=stR.current;if(s2)s2.paused=!s2.paused;}}
            style={{width:36,height:36,borderRadius:6,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:"#888",fontSize:10,fontFamily:"monospace",cursor:"pointer",touchAction:"none"}}>| |</button>
          <button onTouchStart={e=>{e.preventDefault();kyR.current.add("b");setTimeout(()=>kyR.current.delete("b"),100);}} onMouseDown={()=>{kyR.current.add("b");setTimeout(()=>kyR.current.delete("b"),100);}}
            style={{width:36,height:36,borderRadius:6,background:"rgba(100,100,255,0.1)",border:"1px solid rgba(100,100,255,0.2)",color:"#8af",fontSize:10,fontFamily:"monospace",cursor:"pointer",touchAction:"none"}}>BMB</button>
        </div>
      </div>
      <div style={{display:"flex",gap:12,marginTop:10,fontSize:10,color:"#444",letterSpacing:1,alignItems:"center",flexWrap:"wrap",justifyContent:"center"}}>
        <button onClick={()=>{Tone.start().then(()=>{initSfx();});setMu(p=>!p);}}
          style={{background:muOn?"rgba(253,211,51,0.2)":"rgba(255,255,255,0.06)",border:`1px solid ${muOn?"rgba(253,211,51,0.4)":"rgba(255,255,255,0.12)"}`,borderRadius:4,color:muOn?"#fd3":"#666",fontSize:11,padding:"3px 10px",cursor:"pointer",fontFamily:"monospace",letterSpacing:1}}>{muOn?"♪ ON":"♪ OFF"}</button>
        <button onClick={()=>setShowMuPicker(p=>!p)}
          style={{background:showMuPicker?"rgba(100,200,255,0.15)":"rgba(255,255,255,0.06)",border:`1px solid ${showMuPicker?"rgba(100,200,255,0.3)":"rgba(255,255,255,0.12)"}`,borderRadius:4,color:showMuPicker?"#8cf":"#666",fontSize:11,padding:"3px 10px",cursor:"pointer",fontFamily:"monospace",letterSpacing:1}}>🎵 MP3</button>
        <button onClick={toggleFS}
          style={{background:isFS?"rgba(100,255,100,0.15)":"rgba(255,255,255,0.06)",border:`1px solid ${isFS?"rgba(100,255,100,0.3)":"rgba(255,255,255,0.12)"}`,borderRadius:4,color:isFS?"#8f8":"#666",fontSize:11,padding:"3px 10px",cursor:"pointer",fontFamily:"monospace",letterSpacing:1}}>{isFS?"⛶ EXIT":"⛶ FULL"}</button>
      </div>
      {showMuPicker&&<div style={{background:"rgba(0,0,0,0.85)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,padding:12,marginTop:8,maxWidth:480,width:"100%"}}>
        <div style={{color:"#aaa",fontSize:11,fontFamily:"monospace",marginBottom:8,textAlign:"center"}}>CUSTOM MUSIC — Pick files or paste URLs</div>
        {[["title","🎬 Title Screen"],["overworld","🌍 Overworld"],["forest","🌲 Forest Temple"],["fire","🔥 Fire Cavern"],["shadow","👻 Shadow Keep"],["triforce","✨ Triforce Moment"]].map(([key,label])=>
          <div key={key} style={{marginBottom:8,padding:6,background:"rgba(255,255,255,0.02)",borderRadius:4}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{color:"#888",fontSize:10,fontFamily:"monospace",width:100,flexShrink:0}}>{label}</span>
              {customMu[key]&&<span style={{color:"#4a4",fontSize:9,fontFamily:"monospace"}}>✓ loaded</span>}
              {customMu[key]&&<button onClick={()=>{
                if(customMu[key]?.startsWith("blob:"))URL.revokeObjectURL(customMu[key]);
                setCustomMu(prev=>({...prev,[key]:null}));ltRef.current=null;
              }} style={{background:"rgba(255,50,50,0.15)",border:"1px solid rgba(255,50,50,0.3)",borderRadius:3,color:"#f66",fontSize:9,padding:"1px 6px",cursor:"pointer",fontFamily:"monospace",marginLeft:"auto"}}>✕ clear</button>}
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <label style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:3,color:"#888",fontSize:9,padding:"3px 8px",cursor:"pointer",fontFamily:"monospace",flexShrink:0}}>
                📁 File<input type="file" accept="audio/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f){
                  const url=URL.createObjectURL(f);setCustomMu(prev=>({...prev,[key]:url}));ltRef.current=null;}}}/>
              </label>
              <input type="text" placeholder="or paste audio URL..." onKeyDown={e=>{if(e.key==="Enter"&&e.target.value.trim()){
                setCustomMu(prev=>({...prev,[key]:e.target.value.trim()}));ltRef.current=null;e.target.value="";}}}
                style={{flex:1,minWidth:0,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:3,color:"#aaa",fontSize:9,padding:"3px 6px",fontFamily:"monospace",outline:"none"}}/>
            </div>
          </div>)}
        <div style={{color:"#555",fontSize:9,fontFamily:"monospace",textAlign:"center",marginTop:4}}>Files loop automatically · Press Enter to load URLs · Turn music ON to hear</div>
      </div>}
    </div>);
}
