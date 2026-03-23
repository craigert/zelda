import * as Tone from 'tone';

let sfxReady=false,sfxSynths={};
export function initSfx(){if(sfxReady)return;
  sfxSynths.hit=new Tone.Synth({oscillator:{type:"sawtooth"},envelope:{attack:0.001,decay:0.08,sustain:0,release:0.05},volume:-12}).toDestination();
  sfxSynths.sword=new Tone.NoiseSynth({noise:{type:"white"},envelope:{attack:0.001,decay:0.06,sustain:0,release:0.03},volume:-18}).toDestination();
  sfxSynths.pickup=new Tone.Synth({oscillator:{type:"square"},envelope:{attack:0.001,decay:0.12,sustain:0.1,release:0.1},volume:-14}).toDestination();
  sfxSynths.door=new Tone.NoiseSynth({noise:{type:"brown"},envelope:{attack:0.01,decay:0.3,sustain:0,release:0.1},volume:-14}).toDestination();
  sfxSynths.bomb=new Tone.NoiseSynth({noise:{type:"white"},envelope:{attack:0.001,decay:0.4,sustain:0.05,release:0.2},volume:-8}).toDestination();
  sfxSynths.hurt=new Tone.Synth({oscillator:{type:"square"},envelope:{attack:0.001,decay:0.15,sustain:0,release:0.1},volume:-10}).toDestination();
  sfxSynths.fanfare=new Tone.Synth({oscillator:{type:"square"},envelope:{attack:0.01,decay:0.2,sustain:0.3,release:0.3},volume:-12}).toDestination();
  sfxReady=true;}
export function sfx(name,note){if(!sfxReady)return;try{
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
