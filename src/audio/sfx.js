import * as Tone from 'tone';

let sfxReady=false,sfxSynths={},lastPlay={};
const MIN_INTERVAL=50; // ms between same sfx

function makePool(factory,n){const pool=[];for(let i=0;i<n;i++)pool.push(factory());let idx=0;return{trigger:(...args)=>{pool[idx].triggerAttackRelease(...args);idx=(idx+1)%pool.length;}};}

export function initSfx(){if(sfxReady)return;
  // === SWORD SLASH — classic Zelda "hyah" swish ===
  // Layer 1: Fast high-pitched downward sweep (the signature slash sound)
  sfxSynths.swordSweep=makePool(()=>{
    const s=new Tone.Synth({oscillator:{type:"sawtooth"},envelope:{attack:0.001,decay:0.07,sustain:0,release:0.03},volume:-16});
    s.toDestination();return s;},3);
  // Layer 2: Short sharp noise burst (air whoosh)
  sfxSynths.swordWhip=makePool(()=>{
    const n=new Tone.NoiseSynth({noise:{type:"white"},envelope:{attack:0.001,decay:0.05,sustain:0,release:0.02},volume:-18});
    const hp=new Tone.Filter({frequency:4000,type:"highpass"});
    n.connect(hp);hp.toDestination();return n;},3);

  // === ENEMY HIT — classic Zelda "thwack" ===
  // Layer 1: Sharp percussive knock (the initial impact)
  sfxSynths.hitKnock=makePool(()=>{
    const s=new Tone.Synth({oscillator:{type:"square"},envelope:{attack:0.001,decay:0.04,sustain:0,release:0.02},volume:-12});
    s.toDestination();return s;},3);
  // Layer 2: Quick filtered noise (flesh/armor crunch)
  sfxSynths.hitCrunch=makePool(()=>{
    const n=new Tone.NoiseSynth({noise:{type:"pink"},envelope:{attack:0.001,decay:0.05,sustain:0,release:0.02},volume:-12});
    const bp=new Tone.Filter({frequency:1200,type:"bandpass",Q:2});
    n.connect(bp);bp.toDestination();return n;},3);

  // Legacy aliases for compatibility
  sfxSynths.hit=new Tone.PolySynth(Tone.Synth,{maxPolyphony:4,voice:Tone.Synth,options:{oscillator:{type:"sawtooth"},envelope:{attack:0.001,decay:0.05,sustain:0,release:0.03},volume:-12}}).toDestination();
  sfxSynths.pickup=new Tone.PolySynth(Tone.Synth,{maxPolyphony:4,voice:Tone.Synth,options:{oscillator:{type:"square"},envelope:{attack:0.001,decay:0.12,sustain:0.1,release:0.1},volume:-14}}).toDestination();
  sfxSynths.hurt=new Tone.PolySynth(Tone.Synth,{maxPolyphony:2,voice:Tone.Synth,options:{oscillator:{type:"square"},envelope:{attack:0.001,decay:0.15,sustain:0,release:0.1},volume:-10}}).toDestination();
  sfxSynths.fanfare=new Tone.PolySynth(Tone.Synth,{maxPolyphony:6,voice:Tone.Synth,options:{oscillator:{type:"square"},envelope:{attack:0.01,decay:0.2,sustain:0.3,release:0.3},volume:-12}}).toDestination();
  sfxSynths.door=makePool(()=>new Tone.NoiseSynth({noise:{type:"brown"},envelope:{attack:0.01,decay:0.3,sustain:0,release:0.1},volume:-14}).toDestination(),2);
  sfxSynths.dooropenTone=new Tone.PolySynth(Tone.Synth,{maxPolyphony:6,voice:Tone.Synth,options:{oscillator:{type:"square"},envelope:{attack:0.005,decay:0.18,sustain:0.15,release:0.2},volume:-10}}).toDestination();
  sfxSynths.bomb=makePool(()=>new Tone.NoiseSynth({noise:{type:"white"},envelope:{attack:0.001,decay:0.4,sustain:0.05,release:0.2},volume:-8}).toDestination(),3);
  sfxReady=true;}

export function sfx(name,note){if(!sfxReady)return;
  const now=performance.now();if(lastPlay[name]&&now-lastPlay[name]<MIN_INTERVAL)return;lastPlay[name]=now;
  try{
  if(name==="sword"){
    // Classic Zelda slash: fast descending pitch sweep + air whoosh
    const t=Tone.now();
    sfxSynths.swordSweep.trigger("C6","32n",t);// high start
    sfxSynths.swordSweep.trigger("F5","32n",t+0.015);// quick drop
    sfxSynths.swordSweep.trigger("C5","32n",t+0.03);// low end
    sfxSynths.swordWhip.trigger("32n",t);// air whoosh
  }
  else if(name==="hit"){
    // Classic Zelda hit: short sharp knock + crunch
    const t=Tone.now();
    sfxSynths.hitKnock.trigger(note||"G4","32n",t);// sharp knock
    sfxSynths.hitKnock.trigger("C4","32n",t+0.02);// lower follow
    sfxSynths.hitCrunch.trigger("32n",t);// crunch
  }
  else if(name==="pickup"){const t=Tone.now();sfxSynths.pickup.triggerAttackRelease("E5","16n",t);sfxSynths.pickup.triggerAttackRelease("G5","16n",t+0.08);sfxSynths.pickup.triggerAttackRelease("C6","8n",t+0.16);}
  else if(name==="door")sfxSynths.door.trigger("8n");
  else if(name==="dooropen"){const t=Tone.now();sfxSynths.dooropenTone.triggerAttackRelease("G4","8n",t);sfxSynths.dooropenTone.triggerAttackRelease("B4","8n",t+0.08);sfxSynths.dooropenTone.triggerAttackRelease("D5","8n",t+0.16);sfxSynths.dooropenTone.triggerAttackRelease("G5","4n",t+0.24);}
  else if(name==="bomb")sfxSynths.bomb.trigger("4n");
  else if(name==="hurt")sfxSynths.hurt.triggerAttackRelease("E2","8n");
  else if(name==="kill"){const t=Tone.now();sfxSynths.hitKnock.trigger("A4","16n",t);sfxSynths.hitKnock.trigger("E4","16n",t+0.06);}
  else if(name==="bossdeath"){const t=Tone.now();["D5","F#5","A5","D6"].forEach((n2,i)=>sfxSynths.fanfare.triggerAttackRelease(n2,"8n",t+i*0.15));}
  else if(name==="triforce"){const t=Tone.now();["A4","C#5","E5","A5","C#6","E6"].forEach((n2,i)=>sfxSynths.fanfare.triggerAttackRelease(n2,"8n",t+i*0.12));}
  else if(name==="itemget"){const t=Tone.now();["C5","E5","G5","C6","E6"].forEach((n2,i)=>sfxSynths.fanfare.triggerAttackRelease(n2,"8n",t+i*0.1));}
  else if(name==="heartpiece"){const t=Tone.now();["F5","A5","C6","F6"].forEach((n2,i)=>sfxSynths.fanfare.triggerAttackRelease(n2,"8n.",t+i*0.14));sfxSynths.fanfare.triggerAttackRelease("F6","4n",t+0.56);}
  else if(name==="secret"){const t=Tone.now();["G4","A4","B4","C5","D5","E5","F#5","G5"].forEach((n2,i)=>sfxSynths.fanfare.triggerAttackRelease(n2,"16n",t+i*0.07));sfxSynths.fanfare.triggerAttackRelease("G5","4n",t+0.56);}
  else if(name==="cursor"){sfxSynths.pickup.triggerAttackRelease("E5","32n");}
  else if(name==="select"){const t=Tone.now();sfxSynths.pickup.triggerAttackRelease("G5","16n",t);sfxSynths.pickup.triggerAttackRelease("C6","16n",t+0.06);sfxSynths.pickup.triggerAttackRelease("E6","8n",t+0.12);}
  else if(name==="delete"){const t=Tone.now();sfxSynths.hurt.triggerAttackRelease("G4","16n",t);sfxSynths.hurt.triggerAttackRelease("E4","16n",t+0.08);sfxSynths.hurt.triggerAttackRelease("C4","8n",t+0.16);}
  }catch(e){}}
