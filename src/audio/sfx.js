import * as Tone from 'tone';

let sfxReady=false,sfxSynths={},lastPlay={};
const MIN_INTERVAL=50; // ms between same sfx

function makePool(factory,n){const pool=[];for(let i=0;i<n;i++)pool.push(factory());let idx=0;return{trigger:(...args)=>{pool[idx].triggerAttackRelease(...args);idx=(idx+1)%pool.length;}};}

export function initSfx(){if(sfxReady)return;
  // Tonal synths — use PolySynth for overlapping notes
  // Hit tonal — sharp metallic clang
  sfxSynths.hit=new Tone.PolySynth(Tone.Synth,{maxPolyphony:4,voice:Tone.Synth,options:{oscillator:{type:"sawtooth"},envelope:{attack:0.001,decay:0.05,sustain:0,release:0.03},volume:-12}}).toDestination();
  // Hit crunch — punchy noise burst for impact
  sfxSynths.hitNoise=makePool(()=>{
    const n=new Tone.NoiseSynth({noise:{type:"white"},envelope:{attack:0.001,decay:0.08,sustain:0,release:0.04},volume:-8});
    const filt=new Tone.Filter({frequency:2000,type:"lowpass",Q:2});n.connect(filt);filt.toDestination();return n;},3);
  // Hit thud — low-end body for meaty impact
  sfxSynths.hitThud=makePool(()=>new Tone.Synth({oscillator:{type:"sine"},envelope:{attack:0.001,decay:0.1,sustain:0,release:0.05},volume:-10}).toDestination(),3);
  sfxSynths.pickup=new Tone.PolySynth(Tone.Synth,{maxPolyphony:4,voice:Tone.Synth,options:{oscillator:{type:"square"},envelope:{attack:0.001,decay:0.12,sustain:0.1,release:0.1},volume:-14}}).toDestination();
  sfxSynths.hurt=new Tone.PolySynth(Tone.Synth,{maxPolyphony:2,voice:Tone.Synth,options:{oscillator:{type:"square"},envelope:{attack:0.001,decay:0.15,sustain:0,release:0.1},volume:-10}}).toDestination();
  sfxSynths.fanfare=new Tone.PolySynth(Tone.Synth,{maxPolyphony:6,voice:Tone.Synth,options:{oscillator:{type:"square"},envelope:{attack:0.01,decay:0.2,sustain:0.3,release:0.3},volume:-12}}).toDestination();
  // Sword swing — layered whoosh: filtered noise sweep + metallic ring
  sfxSynths.sword=makePool(()=>{
    const n=new Tone.NoiseSynth({noise:{type:"pink"},envelope:{attack:0.005,decay:0.15,sustain:0,release:0.08},volume:-14});
    const filt=new Tone.Filter({frequency:3000,type:"bandpass",Q:1.5});
    const lfo=new Tone.LFO({frequency:40,min:1500,max:5000}).start();
    lfo.connect(filt.frequency);n.connect(filt);filt.toDestination();return n;},3);
  // Metallic ring on sword swing
  sfxSynths.swordRing=makePool(()=>new Tone.Synth({oscillator:{type:"sine"},envelope:{attack:0.001,decay:0.08,sustain:0,release:0.06},volume:-22}).toDestination(),3);
  sfxSynths.door=makePool(()=>new Tone.NoiseSynth({noise:{type:"brown"},envelope:{attack:0.01,decay:0.3,sustain:0,release:0.1},volume:-14}).toDestination(),2);
  // Door unlock — bright ascending chime (accomplishment feel)
  sfxSynths.dooropenTone=new Tone.PolySynth(Tone.Synth,{maxPolyphony:6,voice:Tone.Synth,options:{oscillator:{type:"square"},envelope:{attack:0.005,decay:0.18,sustain:0.15,release:0.2},volume:-10}}).toDestination();
  sfxSynths.bomb=makePool(()=>new Tone.NoiseSynth({noise:{type:"white"},envelope:{attack:0.001,decay:0.4,sustain:0.05,release:0.2},volume:-8}).toDestination(),3);
  sfxReady=true;}

export function sfx(name,note){if(!sfxReady)return;
  const now=performance.now();if(lastPlay[name]&&now-lastPlay[name]<MIN_INTERVAL)return;lastPlay[name]=now;
  try{
  if(name==="sword"){sfxSynths.sword.trigger("16n");
    sfxSynths.swordRing.trigger("B5","32n");}// whoosh + metallic ring
  else if(name==="hit"){const t=Tone.now();
    // Metallic clang + crunch + low thud for meaty impact
    sfxSynths.hit.triggerAttackRelease(note||"F4","32n",t);
    sfxSynths.hit.triggerAttackRelease("C4","32n",t+0.01);
    sfxSynths.hitNoise.trigger("16n");
    sfxSynths.hitThud.trigger("E2","16n");}
  else if(name==="pickup"){const t=Tone.now();sfxSynths.pickup.triggerAttackRelease("E5","16n",t);sfxSynths.pickup.triggerAttackRelease("G5","16n",t+0.08);sfxSynths.pickup.triggerAttackRelease("C6","8n",t+0.16);}
  else if(name==="door")sfxSynths.door.trigger("8n");
  else if(name==="dooropen"){const t=Tone.now();sfxSynths.dooropenTone.triggerAttackRelease("G4","8n",t);sfxSynths.dooropenTone.triggerAttackRelease("B4","8n",t+0.08);sfxSynths.dooropenTone.triggerAttackRelease("D5","8n",t+0.16);sfxSynths.dooropenTone.triggerAttackRelease("G5","4n",t+0.24);}
  else if(name==="bomb")sfxSynths.bomb.trigger("4n");
  else if(name==="hurt")sfxSynths.hurt.triggerAttackRelease("E2","8n");
  else if(name==="kill"){const t=Tone.now();sfxSynths.hit.triggerAttackRelease("A4","16n",t);sfxSynths.hit.triggerAttackRelease("E4","16n",t+0.06);}
  else if(name==="bossdeath"){const t=Tone.now();["D5","F#5","A5","D6"].forEach((n2,i)=>sfxSynths.fanfare.triggerAttackRelease(n2,"8n",t+i*0.15));}
  else if(name==="triforce"){const t=Tone.now();["A4","C#5","E5","A5","C#6","E6"].forEach((n2,i)=>sfxSynths.fanfare.triggerAttackRelease(n2,"8n",t+i*0.12));}
  else if(name==="itemget"){const t=Tone.now();["C5","E5","G5","C6","E6"].forEach((n2,i)=>sfxSynths.fanfare.triggerAttackRelease(n2,"8n",t+i*0.1));}
  else if(name==="heartpiece"){const t=Tone.now();["F5","A5","C6","F6"].forEach((n2,i)=>sfxSynths.fanfare.triggerAttackRelease(n2,"8n.",t+i*0.14));sfxSynths.fanfare.triggerAttackRelease("F6","4n",t+0.56);}
  else if(name==="secret"){const t=Tone.now();["G4","A4","B4","C5","D5","E5","F#5","G5"].forEach((n2,i)=>sfxSynths.fanfare.triggerAttackRelease(n2,"16n",t+i*0.07));sfxSynths.fanfare.triggerAttackRelease("G5","4n",t+0.56);}
  else if(name==="cursor"){sfxSynths.pickup.triggerAttackRelease("E5","32n");}
  else if(name==="select"){const t=Tone.now();sfxSynths.pickup.triggerAttackRelease("G5","16n",t);sfxSynths.pickup.triggerAttackRelease("C6","16n",t+0.06);sfxSynths.pickup.triggerAttackRelease("E6","8n",t+0.12);}
  else if(name==="delete"){const t=Tone.now();sfxSynths.hurt.triggerAttackRelease("G4","16n",t);sfxSynths.hurt.triggerAttackRelease("E4","16n",t+0.08);sfxSynths.hurt.triggerAttackRelease("C4","8n",t+0.16);}
  }catch(e){}}
