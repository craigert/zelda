import * as Tone from 'tone';

let sfxReady=false,sfxSynths={},lastPlay={};
const MIN_INTERVAL=50; // ms between same sfx

function makePool(factory,n){const pool=[];for(let i=0;i<n;i++)pool.push(factory());let idx=0;return{trigger:(...args)=>{pool[idx].triggerAttackRelease(...args);idx=(idx+1)%pool.length;}};}

export function initSfx(){if(sfxReady)return;
  // === SWORD SLASH — fast filtered noise whoosh ===
  // Pool with exposed filters for frequency sweep
  sfxSynths.swordPool=[];
  for(let i=0;i<3;i++){
    const n=new Tone.NoiseSynth({noise:{type:"white"},envelope:{attack:0.001,decay:0.13,sustain:0,release:0.07},volume:-10});
    const filt=new Tone.Filter({frequency:6000,type:"bandpass",Q:0.7});
    n.connect(filt);filt.toDestination();sfxSynths.swordPool.push({n,filt});}
  sfxSynths.swordIdx=0;
  // Lower body layer for weight
  sfxSynths.swordBody=makePool(()=>{
    const n=new Tone.NoiseSynth({noise:{type:"pink"},envelope:{attack:0.003,decay:0.1,sustain:0,release:0.05},volume:-14});
    const filt=new Tone.Filter({frequency:900,type:"lowpass"});
    n.connect(filt);filt.toDestination();return n;},3);

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

  // === HOOKSHOT — chain launch: metallic clank + rattling chain ===
  sfxSynths.hookLaunch=makePool(()=>{
    const n=new Tone.NoiseSynth({noise:{type:"white"},envelope:{attack:0.001,decay:0.03,sustain:0,release:0.01},volume:-10});
    const bp=new Tone.Filter({frequency:3000,type:"bandpass",Q:3});
    n.connect(bp);bp.toDestination();return n;},3);
  sfxSynths.hookChain=makePool(()=>{
    const s=new Tone.Synth({oscillator:{type:"triangle"},envelope:{attack:0.001,decay:0.06,sustain:0.02,release:0.04},volume:-14});
    s.toDestination();return s;},3);

  // === MIRROR SHIELD REFLECT — bright crystalline ping ===
  sfxSynths.reflectPing=new Tone.PolySynth(Tone.Synth,{maxPolyphony:4,voice:Tone.Synth,options:{oscillator:{type:"sine"},envelope:{attack:0.001,decay:0.15,sustain:0.05,release:0.1},volume:-12}}).toDestination();
  sfxSynths.reflectShimmer=makePool(()=>{
    const n=new Tone.NoiseSynth({noise:{type:"white"},envelope:{attack:0.001,decay:0.08,sustain:0,release:0.04},volume:-18});
    const hp=new Tone.Filter({frequency:6000,type:"highpass"});
    n.connect(hp);hp.toDestination();return n;},2);

  // Legacy aliases for compatibility
  sfxSynths.hit=new Tone.PolySynth(Tone.Synth,{maxPolyphony:4,voice:Tone.Synth,options:{oscillator:{type:"sawtooth"},envelope:{attack:0.001,decay:0.05,sustain:0,release:0.03},volume:-12}}).toDestination();
  sfxSynths.pickup=new Tone.PolySynth(Tone.Synth,{maxPolyphony:4,voice:Tone.Synth,options:{oscillator:{type:"square"},envelope:{attack:0.001,decay:0.12,sustain:0.1,release:0.1},volume:-14}}).toDestination();
  sfxSynths.hurt=new Tone.PolySynth(Tone.Synth,{maxPolyphony:2,voice:Tone.Synth,options:{oscillator:{type:"square"},envelope:{attack:0.001,decay:0.15,sustain:0,release:0.1},volume:-10}}).toDestination();
  sfxSynths.fanfare=new Tone.PolySynth(Tone.Synth,{maxPolyphony:6,voice:Tone.Synth,options:{oscillator:{type:"square"},envelope:{attack:0.01,decay:0.2,sustain:0.3,release:0.3},volume:-12}}).toDestination();

  // === ITEM-GET FANFARE — triumphant rising flourish + held chord + sparkle ===
  // Reverb gives the moment air and "magic"
  const igRev=new Tone.Reverb({decay:1.6,wet:0.28}).toDestination();
  // Lead: bright triangle for the rising arpeggio (cuts through clearly)
  sfxSynths.itemgetLead=new Tone.PolySynth(Tone.Synth,{maxPolyphony:6,voice:Tone.Synth,options:{oscillator:{type:"triangle"},envelope:{attack:0.005,decay:0.18,sustain:0.25,release:0.25},volume:-9}}).connect(igRev);
  // Sub-octave layer for warmth/body
  sfxSynths.itemgetSub=new Tone.PolySynth(Tone.Synth,{maxPolyphony:6,voice:Tone.Synth,options:{oscillator:{type:"sine"},envelope:{attack:0.005,decay:0.2,sustain:0.3,release:0.3},volume:-14}}).connect(igRev);
  // Held resolution chord: longer release for the "ahhhh" ring-out
  sfxSynths.itemgetChord=new Tone.PolySynth(Tone.Synth,{maxPolyphony:6,voice:Tone.Synth,options:{oscillator:{type:"triangle"},envelope:{attack:0.02,decay:0.5,sustain:0.5,release:1.2},volume:-10}}).connect(igRev);
  // Bell-like top sparkle on the final chord
  sfxSynths.itemgetBell=new Tone.PolySynth(Tone.Synth,{maxPolyphony:4,voice:Tone.Synth,options:{oscillator:{type:"sine"},envelope:{attack:0.001,decay:0.4,sustain:0,release:0.5},volume:-12}}).connect(igRev);
  // High shimmer noise for the sparkle dust
  sfxSynths.itemgetShimmer=makePool(()=>{
    const n=new Tone.NoiseSynth({noise:{type:"white"},envelope:{attack:0.005,decay:0.3,sustain:0.05,release:0.2},volume:-22});
    const hp=new Tone.Filter({frequency:8000,type:"highpass"});
    n.connect(hp);hp.connect(igRev);return n;},2);

  sfxSynths.door=makePool(()=>new Tone.NoiseSynth({noise:{type:"brown"},envelope:{attack:0.01,decay:0.3,sustain:0,release:0.1},volume:-14}).toDestination(),2);
  sfxSynths.dooropenTone=new Tone.PolySynth(Tone.Synth,{maxPolyphony:6,voice:Tone.Synth,options:{oscillator:{type:"square"},envelope:{attack:0.005,decay:0.18,sustain:0.15,release:0.2},volume:-10}}).toDestination();
  sfxSynths.bomb=makePool(()=>new Tone.NoiseSynth({noise:{type:"white"},envelope:{attack:0.001,decay:0.4,sustain:0.05,release:0.2},volume:-8}).toDestination(),3);
  sfxReady=true;}

export function sfx(name,note){if(!sfxReady)return;
  const now=performance.now();if(lastPlay[name]&&now-lastPlay[name]<MIN_INTERVAL)return;lastPlay[name]=now;
  try{
  if(name==="sword"){
    // Sword whoosh: white noise with bandpass sweep 8000→1500Hz
    const si=sfxSynths.swordPool[sfxSynths.swordIdx];
    sfxSynths.swordIdx=(sfxSynths.swordIdx+1)%3;
    const t=Tone.now();
    si.filt.frequency.setValueAtTime(8000,t);
    si.filt.frequency.exponentialRampToValueAtTime(1500,t+0.1);
    si.n.triggerAttackRelease("8n",t);
    sfxSynths.swordBody.trigger("8n");
  }
  else if(name==="hit"){
    // Classic Zelda hit: short sharp knock + crunch
    const t=Tone.now();
    sfxSynths.hitKnock.trigger(note||"G4","32n",t);// sharp knock
    sfxSynths.hitKnock.trigger("C4","32n",t+0.02);// lower follow
    sfxSynths.hitCrunch.trigger("32n",t);// crunch
  }
  else if(name==="hookshot"){
    // Chain launch: metallic clank + rapid rattling notes
    const t=Tone.now();
    sfxSynths.hookLaunch.trigger("32n",t);// initial clank
    sfxSynths.hookChain.trigger("E5","32n",t+0.02);// chain rattle
    sfxSynths.hookChain.trigger("G5","32n",t+0.05);
    sfxSynths.hookChain.trigger("E5","32n",t+0.08);
    sfxSynths.hookLaunch.trigger("32n",t+0.06);// second clank
  }
  else if(name==="reflect"){
    // Crystalline ping: bright ascending shimmer
    const t=Tone.now();
    sfxSynths.reflectPing.triggerAttackRelease("E6","16n",t);
    sfxSynths.reflectPing.triggerAttackRelease("G#6","16n",t+0.04);
    sfxSynths.reflectPing.triggerAttackRelease("B6","8n",t+0.08);
    sfxSynths.reflectShimmer.trigger("16n",t);
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
  else if(name==="itemfanfare"){
    // Triumphant fanfare for story items: rapid rising D-major arpeggio → held bright chord with bell + shimmer
    const t=Tone.now();
    const seq=[["D5",0],["F#5",0.07],["A5",0.14],["D6",0.21],["F#6",0.28]];
    seq.forEach(([n2,off])=>{
      sfxSynths.itemgetLead.triggerAttackRelease(n2,"16n",t+off);
      const subN=Tone.Frequency(n2).transpose(-12).toNote();
      sfxSynths.itemgetSub.triggerAttackRelease(subN,"16n",t+off);
    });
    const chordT=t+0.40;
    sfxSynths.itemgetChord.triggerAttackRelease(["D4","F#4","A4","D5","F#5","A5"],"2n",chordT);
    sfxSynths.itemgetBell.triggerAttackRelease(["D6","A6"],"4n",chordT+0.02);
    sfxSynths.itemgetBell.triggerAttackRelease(["F#6","D7"],"4n",chordT+0.18);
    sfxSynths.itemgetShimmer.trigger("8n",t+0.25);
    sfxSynths.itemgetShimmer.trigger("4n",chordT+0.05);
  }
  else if(name==="heartpiece"){const t=Tone.now();["F5","A5","C6","F6"].forEach((n2,i)=>sfxSynths.fanfare.triggerAttackRelease(n2,"8n.",t+i*0.14));sfxSynths.fanfare.triggerAttackRelease("F6","4n",t+0.56);}
  else if(name==="secret"){const t=Tone.now();["G4","A4","B4","C5","D5","E5","F#5","G5"].forEach((n2,i)=>sfxSynths.fanfare.triggerAttackRelease(n2,"16n",t+i*0.07));sfxSynths.fanfare.triggerAttackRelease("G5","4n",t+0.56);}
  else if(name==="cursor"){sfxSynths.pickup.triggerAttackRelease("E5","32n");}
  else if(name==="select"){const t=Tone.now();sfxSynths.pickup.triggerAttackRelease("G5","16n",t);sfxSynths.pickup.triggerAttackRelease("C6","16n",t+0.06);sfxSynths.pickup.triggerAttackRelease("E6","8n",t+0.12);}
  else if(name==="delete"){const t=Tone.now();sfxSynths.hurt.triggerAttackRelease("G4","16n",t);sfxSynths.hurt.triggerAttackRelease("E4","16n",t+0.08);sfxSynths.hurt.triggerAttackRelease("C4","8n",t+0.16);}
  }catch(e){}}
