import * as Tone from 'tone';
import { MUSIC } from '../data/music-data.js';

// Orchestral audio engine — FM lead, sine pad, triangle bass, membrane drums.
export let au={i:false,p:false,c:null,synths:{},ps:[]};

export function initAu(){if(au.i)return;
  au.synths.lead=new Tone.FMSynth({harmonicity:2,modulationIndex:3,
    oscillator:{type:"sine"},modulation:{type:"sine"},
    envelope:{attack:0.04,decay:0.2,sustain:0.35,release:0.3},
    modulationEnvelope:{attack:0.02,decay:0.1,sustain:0.2,release:0.2},
    volume:-14}).toDestination();
  au.synths.pad=new Tone.Synth({oscillator:{type:"sine"},
    envelope:{attack:0.3,decay:0.5,sustain:0.7,release:0.8},volume:-22}).toDestination();
  au.synths.bass=new Tone.Synth({oscillator:{type:"triangle"},
    envelope:{attack:0.01,decay:0.15,sustain:0.4,release:0.15},volume:-16}).toDestination();
  au.synths.kick=new Tone.MembraneSynth({pitchDecay:0.05,octaves:6,
    envelope:{attack:0.001,decay:0.25,sustain:0,release:0.1},volume:-12}).toDestination();
  au.synths.snare=new Tone.NoiseSynth({noise:{type:"white"},
    envelope:{attack:0.001,decay:0.1,sustain:0,release:0.06},volume:-18}).toDestination();
  au.i=true;}

export function playTh(n){if(!au.i)initAu();if(au.c===n&&au.p)return;stopMu();const th=MUSIC[n];if(!th)return;
  Tone.getTransport().bpm.value=th.tempo;
  const mk=(sy,ns,dur)=>{const p=new Tone.Sequence((tm,nt)=>{if(nt&&sy)try{sy.triggerAttackRelease(nt,dur,tm)}catch(e){}},ns,"8n");p.loop=true;p.start(0);return p;};
  au.ps.push(mk(au.synths.lead,th.lead,"8n"));
  au.ps.push(mk(au.synths.pad,th.pad,"4n"));
  au.ps.push(mk(au.synths.bass,th.bass,"4n"));
  const dp=new Tone.Sequence((tm,nt)=>{if(!nt)return;try{
    if(nt==="K")au.synths.kick.triggerAttackRelease("C1","8n",tm);
    else if(nt==="S")au.synths.snare.triggerAttackRelease("16n",tm);
  }catch(e){}},th.drums,"8n");dp.loop=true;dp.start(0);au.ps.push(dp);
  Tone.getTransport().start();au.p=true;au.c=n;}

export function stopMu(){Tone.getTransport().stop();Tone.getTransport().position=0;Tone.getTransport().cancel();au.ps.forEach(p=>{try{p?.stop();p?.dispose();}catch(e){}});au.ps=[];au.p=false;au.c=null;}
