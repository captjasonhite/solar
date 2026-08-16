/* =========================================================
   60-Minute Full-Body Massage — guided session
   Vanilla JS, no backend.
   ========================================================= */
'use strict';

/* ---------------- settings ---------------- */
const DEFAULTS = { voice:false, sound:true, haptics:true, motion:false, awake:true };
let settings = Object.assign({}, DEFAULTS, loadJSON('massage.settings', {}));

function loadJSON(k, fb){ try{ return Object.assign({}, fb, JSON.parse(localStorage.getItem(k)||'{}')); }catch(e){ return Object.assign({}, fb); } }
function saveSettings(){ try{ localStorage.setItem('massage.settings', JSON.stringify(settings)); }catch(e){} }

/* ---------------- segment data ----------------
   Total duration must equal 3600 s (60 min). */
const SEGMENTS = [
  /* ---------- PHASE 1 — PRONE (30 min) ---------- */
  { id:'touch', phase:1, region:'FULL BODY', pos:'prone',
    title:'Initial Touch & Compressions', technique:'Broad Compression',
    instruction:'Gentle broad-palm compressions over the sheet or blanket. Move across the back, hips, and legs to establish contact and rhythm.',
    pressure:['Very light',1], direction:'Across back, hips, legs',
    dur:120, view:'body-prone-touch', animLabel:'GROUND • ASSESS • ESTABLISH RHYTHM',
    voice:'Session beginning. Gentle broad palm compressions over the sheet, across the back, hips and legs. Establish a calm rhythm.',
    intro:{ kicker:'PHASE 1', title:'PRONE POSITION', text:'Client lies face down.' } },

  { id:'back-eff', phase:1, region:'BACK & SHOULDERS', pos:'prone',
    title:'Back Effleurage', technique:'Long Effleurage',
    instruction:'Use broad, slow strokes upward along the back to distribute warm oil and establish a smooth rhythm.',
    pressure:['Gentle',2], direction:'Lower back → shoulders',
    dur:180, view:'back-effleurage', animLabel:'EFFLURAGE • TOWARD SHOULDERS',
    voice:'Back effleurage. Broad slow strokes from the lower back up toward the shoulders.' },

  { id:'back-pet', phase:1, region:'BACK & SHOULDERS', pos:'prone',
    title:'Back Petrissage', technique:'Petrissage',
    instruction:'Use comfortable kneading pressure through the larger back muscles. Work gradually rather than digging sharply into tissue.',
    pressure:['Moderate',3], direction:'Knead, lats • rhomboids • lower back',
    dur:180, view:'back-petrissage', animLabel:'PETRISSAGE • LATISSIMUS / RHOMBOIDS',
    voice:'Back petrissage. Comfortable kneading through the larger back muscles. Gradual, not sharp.' },

  { id:'traps', phase:1, region:'BACK & SHOULDERS', pos:'prone',
    title:'Upper Trapezius', technique:'Kneading & Compression',
    instruction:'Knead the upper trapezius between the neck and shoulders. Keep pressure controlled and comfortable.',
    pressure:['Moderate',3], direction:'Neck → shoulder',
    dur:120, view:'traps', animLabel:'KNEAD • UPPER TRAPEZIUS',
    voice:'Upper trapezius. Knead between the neck and shoulders with controlled pressure.' },

  { id:'neck-girdle', phase:1, region:'NECK & SHOULDERS', pos:'prone',
    title:'Neck & Shoulder Girdle', technique:'Gentle Directional Strokes',
    instruction:'Work around the sides of the neck and shoulder girdle with gentle strokes. Avoid direct pressure on the spine.',
    pressure:['Light',2], direction:'Around neck sides',
    dur:120, view:'neck-girdle', animLabel:'GENTLE STROKES • AROUND THE NECK',
    safety:'Avoid direct pressure on the spine or the front of the neck.',
    voice:'Neck and shoulder girdle. Gentle strokes around the sides of the neck only. No pressure on the spine.' },

  { id:'leg-post-l', phase:1, region:'LEFT LEG', pos:'prone', side:'L',
    title:'Left Hamstring & Calf', technique:'Effleurage → Petrissage',
    instruction:'Use long strokes from the lower leg toward the thigh, followed by comfortable kneading through the hamstrings and calf.',
    pressure:['Moderate',3], direction:'Ankle → thigh',
    dur:180, view:'leg-post', animLabel:'EFFLURAGE + KNEAD • TOWARD THIGH',
    voice:'Left posterior leg. Long strokes from the calf toward the thigh, then comfortable kneading.' },

  { id:'achilles-l', phase:1, region:'LEFT ANKLE', pos:'prone', side:'L',
    title:'Achilles & Ankle', technique:'Gentle Surrounding Strokes',
    instruction:'Use light strokes around the heel and ankle. Keep the Achilles tendon itself free of direct pressure.',
    pressure:['Light',2], direction:'Around the heel',
    dur:120, view:'ankle-post', animLabel:'GENTLE • AROUND THE ACHILLES',
    safety:'No direct compression on the Achilles tendon.',
    voice:'Left ankle. Light strokes around the heel. No direct pressure on the Achilles tendon.' },

  { id:'foot-l', phase:1, region:'LEFT FOOT', pos:'prone', side:'L',
    title:'Left Foot', technique:'Thumb Pressure',
    instruction:'Use controlled thumb pressure along the plantar surface, staying within comfortable pressure limits.',
    pressure:['Moderate',3], direction:'Heel → ball of foot',
    dur:60, view:'foot-sole', animLabel:'THUMB PRESSURE • PLANTAR SURFACE',
    voice:'Left foot. Controlled thumb pressure along the sole, within comfortable limits.' },

  { id:'leg-post-r', phase:1, region:'RIGHT LEG', pos:'prone', side:'R',
    title:'Right Hamstring & Calf', technique:'Effleurage → Petrissage',
    instruction:'Mirror the left leg: long strokes from the lower leg toward the thigh, then comfortable kneading through hamstrings and calf.',
    pressure:['Moderate',3], direction:'Ankle → thigh',
    dur:180, view:'leg-post', animLabel:'EFFLURAGE + KNEAD • TOWARD THIGH',
    voice:'Right posterior leg. Long strokes toward the thigh, then comfortable kneading.' },

  { id:'achilles-r', phase:1, region:'RIGHT ANKLE', pos:'prone', side:'R',
    title:'Achilles & Ankle', technique:'Gentle Surrounding Strokes',
    instruction:'Use light strokes around the heel and ankle. Keep the Achilles tendon itself free of direct pressure.',
    pressure:['Light',2], direction:'Around the heel',
    dur:120, view:'ankle-post', animLabel:'GENTLE • AROUND THE ACHILLES',
    safety:'No direct compression on the Achilles tendon.',
    voice:'Right ankle. Light strokes around the heel, avoiding the Achilles tendon.' },

  { id:'foot-r', phase:1, region:'RIGHT FOOT', pos:'prone', side:'R',
    title:'Right Foot', technique:'Thumb Pressure',
    instruction:'Use controlled thumb pressure along the plantar surface, staying within comfortable pressure limits.',
    pressure:['Moderate',3], direction:'Heel → ball of foot',
    dur:60, view:'foot-sole', animLabel:'THUMB PRESSURE • PLANTAR SURFACE',
    voice:'Right foot. Controlled thumb pressure along the sole.' },

  { id:'glutes', phase:1, region:'GLUTES & LOWER BACK', pos:'prone',
    title:'Gluteal Region & Lower Back', technique:'Broad Palm & Forearm',
    instruction:'Use broad pressure through the gluteal muscles and connect the work into long flowing strokes toward the lower back and shoulders.',
    pressure:['Firm',4], direction:'Leg → glute → lower back → shoulder',
    dur:240, view:'glutes', animLabel:'INTEGRATION • LEG → GLUTE → BACK → SHOULDER',
    safety:'No direct deep pressure over the sacrum, coccyx, or spine.',
    voice:'Gluteal region. Broad pressure through the glutes, flowing into long strokes toward the lower back and shoulders.' },

  { id:'transition', phase:1, region:'TRANSITION', pos:'prone', type:'transition',
    title:'Draping & Flip Transition', technique:'Transition',
    instruction:'Pause the massage and allow the client to turn face-up. Maintain complete draping and visual privacy throughout the transition.',
    pressure:['—',0], direction:'—',
    dur:120, view:'transition', animLabel:'PRIVACY • FULL DRAPE',
    voice:'Transition. Pause the massage and allow the client to turn face up, with complete draping and privacy.' },

  /* ---------- PHASE 2 — SUPINE (30 min) ---------- */
  { id:'quad-l', phase:2, region:'LEFT LEG', pos:'supine', side:'L',
    title:'Left Quadriceps', technique:'Long Effleurage',
    instruction:'Use broad upward strokes along the front of the thigh to warm the quadriceps.',
    pressure:['Gentle',2], direction:'Knee → hip',
    dur:120, view:'leg-ant', animLabel:'EFFLURAGE • TOWARD HIP',
    voice:'Phase two, supine. Left quadriceps. Broad strokes along the front of the thigh toward the hip.',
    intro:{ kicker:'PHASE 2', title:'SUPINE POSITION', text:'Client lies face up.' } },

  { id:'shin-l', phase:2, region:'LEFT SHIN', pos:'supine', side:'L',
    title:'Tibialis Anterior', technique:'Gentle Stripping',
    instruction:'Work the muscle beside the shin with light strokes. Keep pressure off the shin bone itself.',
    pressure:['Light',1], direction:'Ankle → knee',
    dur:60, view:'shin', animLabel:'LIGHT • MUSCLE BESIDE THE SHIN',
    safety:'No deep pressure directly on the shin bone.',
    voice:'Left shin. Light strokes on the muscle beside the shin bone only.' },

  { id:'ankle-mob-l', phase:2, region:'LEFT ANKLE & FOOT', pos:'supine', side:'L',
    title:'Ankle & Foot', technique:'Joint Mobilization',
    instruction:'Use gentle strokes around the lower leg followed by comfortable ankle and foot movement. Never force the joint through its range.',
    pressure:['Light',2], direction:'Small circles around joint',
    dur:120, view:'ankle-mob', animLabel:'MOBILIZATION • WITHIN COMFORT RANGE',
    voice:'Left ankle and foot. Gentle strokes, then comfortable ankle movement within its natural range.' },

  { id:'quad-r', phase:2, region:'RIGHT LEG', pos:'supine', side:'R',
    title:'Right Quadriceps', technique:'Long Effleurage',
    instruction:'Mirror the left leg with broad strokes along the front of the thigh.',
    pressure:['Gentle',2], direction:'Knee → hip',
    dur:120, view:'leg-ant', animLabel:'EFFLURAGE • TOWARD HIP',
    voice:'Right quadriceps. Broad strokes along the front of the thigh.' },

  { id:'shin-r', phase:2, region:'RIGHT SHIN', pos:'supine', side:'R',
    title:'Tibialis Anterior', technique:'Gentle Stripping',
    instruction:'Work the muscle beside the shin with light strokes. Keep pressure off the shin bone itself.',
    pressure:['Light',1], direction:'Ankle → knee',
    dur:60, view:'shin', animLabel:'LIGHT • MUSCLE BESIDE THE SHIN',
    safety:'No deep pressure directly on the shin bone.',
    voice:'Right shin. Light strokes on the muscle beside the shin bone.' },

  { id:'ankle-mob-r', phase:2, region:'RIGHT ANKLE & FOOT', pos:'supine', side:'R',
    title:'Ankle & Foot', technique:'Joint Mobilization',
    instruction:'Gentle strokes around the lower leg followed by comfortable ankle and foot movement. Never force the joint through its range.',
    pressure:['Light',2], direction:'Small circles around joint',
    dur:120, view:'ankle-mob', animLabel:'MOBILIZATION • WITHIN COMFORT RANGE',
    voice:'Right ankle and foot. Gentle strokes and comfortable ankle movement.' },

  { id:'arm-upper-l', phase:2, region:'LEFT ARM', pos:'supine', side:'L',
    title:'Upper Arm', technique:'Long Effleurage',
    instruction:'Use broad strokes traveling along the upper arm, from shoulder toward the elbow.',
    pressure:['Gentle',2], direction:'Shoulder → elbow',
    dur:120, view:'arm-upper', animLabel:'EFFLURAGE • DOWN THE ARM',
    voice:'Left arm. Broad strokes along the upper arm from shoulder toward the elbow.' },

  { id:'forearm-flex-l', phase:2, region:'LEFT FOREARM', pos:'supine', side:'L',
    title:'Forearm Flexors', technique:'Stripping (thumb)',
    instruction:'Palm side up. Move the thumb slowly along the flexor muscles from the wrist toward the elbow.',
    pressure:['Moderate',3], direction:'Wrist → elbow',
    dur:60, view:'forearm-flex', animLabel:'PALM SIDE — FLEXORS • TOWARD ELBOW',
    voice:'Left forearm, palm side. Thumb stripping along the flexors toward the elbow.' },

  { id:'forearm-ext-l', phase:2, region:'LEFT FOREARM', pos:'supine', side:'L',
    title:'Forearm Extensors', technique:'Stripping (thumb)',
    instruction:'Turn the forearm to the back side. Move the thumb slowly along the extensor muscles toward the elbow.',
    pressure:['Moderate',3], direction:'Wrist → elbow',
    dur:60, view:'forearm-ext', animLabel:'BACK SIDE — EXTENSORS • TOWARD ELBOW',
    voice:'Left forearm, back side. Thumb stripping along the extensors toward the elbow.' },

  { id:'hand-l', phase:2, region:'LEFT HAND', pos:'supine', side:'L',
    title:'Hand & Palm', technique:'Friction & Compression',
    instruction:'Finish with slow palm circles and gentle finger compression.',
    pressure:['Light',2], direction:'Small circles over palm',
    dur:60, view:'hand-palm', animLabel:'CIRCLES • THENAR / HYPOTHENAR / FINGERS',
    voice:'Left hand. Slow palm circles and gentle finger compression.' },

  { id:'arm-upper-r', phase:2, region:'RIGHT ARM', pos:'supine', side:'R',
    title:'Upper Arm', technique:'Long Effleurage',
    instruction:'Mirror the left arm with broad strokes from shoulder toward the elbow.',
    pressure:['Gentle',2], direction:'Shoulder → elbow',
    dur:120, view:'arm-upper', animLabel:'EFFLURAGE • DOWN THE ARM',
    voice:'Right arm. Broad strokes along the upper arm.' },

  { id:'forearm-flex-r', phase:2, region:'RIGHT FOREARM', pos:'supine', side:'R',
    title:'Forearm Flexors', technique:'Stripping (thumb)',
    instruction:'Palm side up. Move the thumb slowly along the flexor muscles from the wrist toward the elbow.',
    pressure:['Moderate',3], direction:'Wrist → elbow',
    dur:60, view:'forearm-flex', animLabel:'PALM SIDE — FLEXORS • TOWARD ELBOW',
    voice:'Right forearm, palm side. Thumb stripping along the flexors toward the elbow.' },

  { id:'forearm-ext-r', phase:2, region:'RIGHT FOREARM', pos:'supine', side:'R',
    title:'Forearm Extensors', technique:'Stripping (thumb)',
    instruction:'Turn the forearm to the back side. Move the thumb slowly along the extensor muscles toward the elbow.',
    pressure:['Moderate',3], direction:'Wrist → elbow',
    dur:60, view:'forearm-ext', animLabel:'BACK SIDE — EXTENSORS • TOWARD ELBOW',
    voice:'Right forearm, back side. Thumb stripping along the extensors.' },

  { id:'hand-r', phase:2, region:'RIGHT HAND', pos:'supine', side:'R',
    title:'Hand & Palm', technique:'Friction & Compression',
    instruction:'Finish with slow palm circles and gentle finger compression.',
    pressure:['Light',2], direction:'Small circles over palm',
    dur:60, view:'hand-palm', animLabel:'CIRCLES • THENAR / HYPOTHENAR / FINGERS',
    voice:'Right hand. Slow palm circles and gentle finger compression.' },

  { id:'chest', phase:2, region:'CHEST', pos:'supine',
    title:'Chest / Pectoral Region', technique:'Gentle Effleurage',
    instruction:'With the client fully draped, use gentle strokes beneath and along the clavicle through the upper pectoral area.',
    pressure:['Light',2], direction:'Along, beneath the clavicle',
    dur:180, view:'chest', animLabel:'GENTLE • BENEATH THE CLAVICLE',
    safety:'Keep full draping. No pressure directly over the clavicle.',
    voice:'Chest region, fully draped. Gentle strokes along and beneath the clavicle only.' },

  { id:'suboccipital', phase:2, region:'HEAD & NECK', pos:'supine',
    title:'Suboccipital Release', technique:'Stationary Hold',
    instruction:'Place fingertips beneath the occipital ridge at the base of the skull and hold gently and still. Breathe slowly.',
    pressure:['Light',2], direction:'Stationary hold',
    dur:120, view:'suboccipital', animLabel:'GENTLE HOLD • BASE OF SKULL',
    safety:'No forceful neck manipulation. Stop if dizziness or tingling occurs.',
    voice:'Suboccipital release. Fingertips beneath the base of the skull, a gentle stationary hold.' },

  { id:'neck-traction', phase:2, region:'NECK', pos:'supine',
    title:'Neck Traction', technique:'Gentle Traction',
    instruction:'Gentle traction only. Never force or sharply rotate the neck.',
    pressure:['Very light',1], direction:'Subtle lengthening',
    dur:60, view:'neck-traction', animLabel:'VERY GENTLE LENGTHENING',
    safety:'Gentle traction only. Never force or sharply rotate the neck. Stop if dizziness occurs.',
    voice:'Neck traction. Very gentle lengthening only. Never force the neck.' },

  { id:'scalp', phase:2, region:'SCALP', pos:'supine',
    title:'Scalp Massage', technique:'Fingertip Circles',
    instruction:'Use fingertips to make slow small circles across the scalp. No oil on hair unless requested.',
    pressure:['Light',2], direction:'Small circles across scalp',
    dur:60, view:'scalp', animLabel:'CIRCLES • FINGERTIPS',
    voice:'Scalp massage. Slow fingertip circles across the scalp.' },

  { id:'feather', phase:2, region:'FULL BODY', pos:'supine',
    title:'Feather-Light Strokes', technique:'Feather Effleurage',
    instruction:'Use extremely light, slow strokes traveling down the limbs to close out the session.',
    pressure:['Feather',1], direction:'Light strokes down limbs',
    dur:60, view:'feather', animLabel:'FEATHER-LIGHT • CLOSING',
    voice:'Closing strokes. Feather light strokes down the limbs.' },

  { id:'grounding', phase:2, region:'SHOULDERS', pos:'supine',
    title:'Shoulder Grounding Hold', technique:'Grounding Hold',
    instruction:'Rest both hands gently on the shoulders. No movement. Let the client breathe and settle.',
    pressure:['Very light',1], direction:'Stationary',
    dur:60, view:'grounding', animLabel:'STILLNESS • BREATHING',
    voice:'Shoulder grounding hold. Rest your hands gently on the shoulders. No movement.' },

  { id:'closure', phase:2, region:'CLOSE', pos:'supine',
    title:'Closure', technique:'Closure',
    instruction:'Allow the client to take their time getting dressed and transitioning upright.',
    pressure:['—',0], direction:'—',
    dur:60, view:'closure', animLabel:'COMPLETE',
    voice:'The session is complete. Allow the client to take their time getting up.' },
];

const TOTAL_MS = SEGMENTS.reduce((a,s)=>a+s.dur,0) * 1000; // 3,600,000 ms

/* ---------------- SVG diagram system ---------------- */
const VB = 'viewBox="0 0 400 300"';

function hand(x,y,rot=0,s=1,cls='h-hand anim-press',delay=0){
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <g class="${cls}" style="animation-delay:${delay}s">
      <rect x="-21" y="-14" width="42" height="28" rx="13"></rect>
      <rect x="-17" y="-26" width="7.5" height="15" rx="3.7"></rect>
      <rect x="-7" y="-28" width="7.5" height="17" rx="3.7"></rect>
      <rect x="3" y="-27" width="7.5" height="16" rx="3.7"></rect>
      <rect x="12.5" y="-23" width="6.5" height="12" rx="3.2"></rect>
      <rect x="-26" y="-8" width="10" height="16" rx="5" transform="rotate(-28 -21 0)"></rect>
    </g></g>`;
}
function thumb(x,y,rot=0,cls='h-thumb',delay=0){
  return `<g transform="translate(${x} ${y}) rotate(${rot})"><ellipse class="${cls}" style="animation-delay:${delay}s" rx="15" ry="9"></ellipse></g>`;
}
function finger(x,y,rot=0){
  return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect class="h-thumb" x="-4" y="-14" width="8" height="22" rx="4"></rect></g>`;
}
function arrow(x1,y1,x2,y2,cls='a-arrow',mk='url(#ah-amber)'){
  return `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="${mk}"></line>`;
}
function arcPath(cx,cy,r,a1,a2){
  const p=a=>[cx+r*Math.cos(a*Math.PI/180), cy+r*Math.sin(a*Math.PI/180)];
  const [x1,y1]=p(a1), [x2,y2]=p(a2);
  const large=Math.abs(a2-a1)>180?1:0, sweep=a2>a1?1:0;
  return `M${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large} ${sweep} ${x2.toFixed(1)},${y2.toFixed(1)}`;
}
function arc(cx,cy,r,a1,a2,cls='a-arc',mk='url(#ah-amber)'){
  return `<path class="${cls}" d="${arcPath(cx,cy,r,a1,a2)}" marker-end="${mk}"></path>`;
}
function halo(x,y,r,cls='a-halo anim-halo',delay=0){
  return `<circle class="${cls}" style="animation-delay:${delay}s" cx="${x}" cy="${y}" r="${r}"></circle>`;
}
function noZone(x,y,w,h,rx=6){
  return `<rect class="z-nozone" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"></rect>`;
}
function label(x,y,t,anchor='middle'){
  return `<text class="z-label" x="${x}" y="${y}" text-anchor="${anchor}">${t}</text>`;
}
function badge(x,y,txt){
  return `<circle class="z-badge-bg" cx="${x}" cy="${y}" r="15"></circle><text class="z-badge" x="${x}" y="${y+4.5}" text-anchor="middle">${txt}</text>`;
}
function wrap(inner, extra=''){
  return `<svg ${VB} ${extra} preserveAspectRatio="xMidYMid meet">${inner}</svg>`;
}
function flipG(flip, inner){
  return flip ? `<g transform="translate(400 0) scale(-1 1)">${inner}</g>` : inner;
}

/* horizontal body silhouette (head left) */
function bodySil(pos, covered=false){
  const g = `
    <rect class="z-sheet" x="18" y="88" width="364" height="124" rx="34"></rect>
    <circle class="z-body" cx="58" cy="150" r="21"></circle>
    <rect class="z-body" x="80" y="124" width="118" height="52" rx="26"></rect>
    <rect class="z-body" x="188" y="132" width="44" height="36" rx="15"></rect>
    <rect class="z-body" x="228" y="133" width="128" height="16" rx="8"></rect>
    <rect class="z-body" x="228" y="157" width="128" height="16" rx="8"></rect>
    <rect class="z-body" x="88" y="106" width="94" height="11" rx="5.5"></rect>
    <rect class="z-body" x="88" y="184" width="94" height="11" rx="5.5"></rect>`;
  const cover = covered
    ? `<rect class="z-sheet" x="80" y="100" width="290" height="100" rx="30" fill="rgba(232,184,120,0.16)"></rect>`
    : '';
  return g + cover;
}

/* vertical back (head up) */
function backBase(){
  return `
    <circle class="z-body" cx="200" cy="42" r="24"></circle>
    <rect class="z-body" x="187" y="60" width="26" height="16" rx="8"></rect>
    <path class="z-body" d="M114,96 Q200,68 286,96 L274,236 Q268,264 200,264 Q132,264 126,236 Z"></path>
    <rect class="z-body" x="146" y="258" width="108" height="26" rx="13"></rect>`;
}
function spineNoZone(){
  return noZone(193,84,14,176,7);
}

/* vertical leg (thigh up, foot down) */
function legBase(){
  return `
    <path class="z-body" d="M168,26 Q200,14 232,26 L236,128 Q236,142 200,142 Q164,142 164,128 Z"></path>
    <circle class="z-body" cx="200" cy="152" r="17"></circle>
    <path class="z-body" d="M172,168 Q162,196 172,226 Q180,248 200,250 Q220,248 228,226 Q238,196 228,168 Q200,158 172,168 Z"></path>
    <path class="z-body" d="M182,250 L178,272 Q178,284 200,284 Q222,284 222,272 L218,250 Q200,258 182,250 Z"></path>`;
}

/* ---------------- diagram builders ---------------- */
const DIAGRAMS = {

  'body-prone-touch'(){
    let hands = `
      ${hand(130,128,8,1,'h-palm anim-press',0)}
      ${hand(172,180,-6,1,'h-palm anim-press',.5)}
      ${hand(258,136,5,1,'h-palm anim-press',1)}
      ${hand(304,176,-8,1,'h-palm anim-press',1.5)}
      ${halo(130,150,26,'a-halo anim-halo',0)}
      ${halo(258,158,26,'a-halo anim-halo',1)}
      ${halo(304,196,24,'a-halo anim-halo',.5)}`;
    return { svg: wrap(bodySil('prone') + hands), aria:'Full body prone with broad palm compressions' };
  },

  'back-effleurage'(){
    const inner = `
      ${backBase()}
      <path class="z-hl" d="M124,104 Q200,80 276,104 L266,232 Q262,254 200,254 Q138,254 134,232 Z"></path>
      ${spineNoZone()}
      ${arrow(150,236,150,116)}
      ${arrow(250,236,250,116)}
      <g style="--dy:-118px;--spd:3.4s">${hand(162,214,0,1,'h-palm anim-stroke',0)}</g>
      <g style="--dy:-118px;--spd:3.4s">${hand(238,214,0,1,'h-palm anim-stroke',1.7)}</g>
      ${label(150,268,'LOWER BACK')}
      ${label(200,30,'SHOULDERS')}`;
    return { svg: wrap(inner), aria:'Prone back, long strokes from lower back toward shoulders' };
  },

  'back-petrissage'(){
    const inner = `
      ${backBase()}
      <path class="z-hl-core" d="M128,112 Q158,100 172,116 L164,224 Q146,236 130,224 Z"></path>
      <path class="z-hl-core" d="M272,112 Q242,100 228,116 L236,224 Q254,236 270,224 Z"></path>
      <path class="z-hl-core" d="M176,104 L224,104 L210,168 L190,168 Z"></path>
      <rect class="z-hl-core" x="152" y="226" width="96" height="26" rx="13"></rect>
      ${spineNoZone()}
      <g transform="translate(150 168)">${arc(0,0,26,-150,-30)}</g>
      <g transform="translate(250 168)">${arc(0,0,26,-30,150)}</g>
      ${hand(150,168,0,1,'h-palm anim-knead',0)}
      ${hand(250,168,0,1,'h-palm anim-knead',.75)}
      ${hand(200,238,0,.9,'h-palm anim-knead',.4)}
      ${label(120,196,'LATS')}
      ${label(200,140,'RHOMBOIDS')}
      ${label(200,278,'LOWER BACK')}`;
    return { svg: wrap(inner), aria:'Prone back with kneading through lats, rhomboids and lower back' };
  },

  'traps'(){
    const inner = `
      ${backBase()}
      <path class="z-hl-core" d="M186,80 L122,102 Q134,124 152,128 L194,102 Z"></path>
      <path class="z-hl-core" d="M214,80 L278,102 Q266,124 248,128 L206,102 Z"></path>
      ${spineNoZone()}
      <g transform="translate(150 112)">${arc(0,0,24,-140,-40)}</g>
      <g transform="translate(250 112)">${arc(0,0,24,-140,40)}</g>
      ${hand(148,114,-18,.9,'h-palm anim-knead',0)}
      ${hand(252,114,18,.9,'h-palm anim-knead',.75)}
      ${label(128,152,'UPPER TRAPS')}`;
    return { svg: wrap(inner), aria:'Upper trapezius kneading between neck and shoulders' };
  },

  'neck-girdle'(){
    const inner = `
      <circle class="z-body" cx="200" cy="66" r="34"></circle>
      <rect class="z-body" x="182" y="94" width="36" height="26" rx="10"></rect>
      <path class="z-body" d="M104,140 Q200,104 296,140 L286,268 Q200,296 114,268 Z"></path>
      <path class="z-hl-core" d="M176,104 Q160,128 168,158 Q182,170 196,160 Q190,128 196,108 Z"></path>
      <path class="z-hl-core" d="M224,104 Q240,128 232,158 Q218,170 204,160 Q210,128 204,108 Z"></path>
      <path class="z-hl" d="M104,140 Q150,122 176,124 L172,160 Q140,160 116,172 Z"></path>
      <path class="z-hl" d="M296,140 Q250,122 224,124 L228,160 Q260,160 284,172 Z"></path>
      ${noZone(192,100,16,120,8)}
      ${arrow(166,196,178,130,'a-arrow-soft')}
      ${arrow(234,196,222,130,'a-arrow-soft')}
      <g style="--dy:-52px;--spd:3s">${hand(168,186,-10,.8,'h-palm anim-stroke',0)}</g>
      <g style="--dy:-52px;--spd:3s">${hand(232,186,10,.8,'h-palm anim-stroke',1.5)}</g>
      ${label(200,44,'HEAD')}
      ${label(96,236,'SHOULDER GIRDLE')}
      ${label(304,236,'SHOULDER GIRDLE')}`;
    return { svg: wrap(inner), aria:'Gentle strokes around the sides of the neck and shoulder girdle, avoiding the spine' };
  },

  'leg-post'(side){
    const flip = side==='R';
    const shapes = `
      ${legBase()}
      <path class="z-hl-core" d="M172,34 Q200,24 228,34 L231,124 Q200,136 169,124 Z"></path>
      <path class="z-hl-core" d="M176,172 Q168,196 176,222 Q190,238 200,238 Q210,238 224,222 Q232,196 224,172 Q200,164 176,172 Z"></path>
      ${noZone(192,246,16,26,5)}
      <g style="--dy:-118px;--spd:3.2s">${hand(200,242,0,.95,'h-palm anim-stroke',0)}</g>
      ${arrow(244,240,244,140)}
      <g transform="translate(186 90)">${arc(0,0,20,-150,-30)}</g>
      <g transform="translate(214 90)">${arc(0,0,20,-30,150)}</g>
      ${hand(188,90,0,.8,'h-palm anim-knead',.6)}
      ${hand(212,90,0,.8,'h-palm anim-knead',1.2)}
      ${label(150,80,'HAMSTRING')}
      ${label(258,196,'CALF')}
      ${label(200,296,'ACHILLES — NO PRESSURE')}`;
    return { svg: wrap(flipG(flip, shapes) + badge(36,36,side) + label(36,62, side==='L'?'LEFT':'RIGHT')),
             aria:`${side==='L'?'Left':'right'} posterior leg, strokes toward thigh and kneading` };
  },

  'ankle-post'(side){
    const flip = side==='R';
    const shapes = `
      <path class="z-body" d="M150,20 Q146,80 158,120 Q170,150 200,152 Q230,150 242,120 Q254,80 250,20 Q200,40 150,20 Z"></path>
      <path class="z-body" d="M164,148 Q150,180 154,214 Q158,248 200,250 Q242,248 246,214 Q250,180 236,148 Q200,166 164,148 Z"></path>
      <path class="z-hl" d="M164,150 Q150,182 154,214 Q158,246 196,248 L196,160 Q178,152 164,150 Z"></path>
      <path class="z-hl" d="M236,150 Q250,182 246,214 Q242,246 204,248 L204,160 Q222,152 236,150 Z"></path>
      ${noZone(190,150,20,96,8)}
      ${arc(200,200,52,-160,-20,'a-arc','url(#ah-amber)')}
      ${arc(200,200,52,20,160,'a-arc','url(#ah-amber)')}
      ${hand(148,200,-70,.8,'h-palm anim-press',0)}
      ${hand(252,200,70,.8,'h-palm anim-press',.8)}
      ${label(200,288,'ACHILLES — NO PRESSURE')}
      ${label(200,12,'LOWER LEG')}`;
    return { svg: wrap(flipG(flip, shapes) + badge(36,36,side) + label(36,62, side==='L'?'LEFT':'RIGHT')),
             aria:`${side==='L'?'Left':'right'} ankle, gentle strokes around the heel, avoiding the Achilles tendon` };
  },

  'foot-sole'(side){
    const flip = side==='R';
    const shapes = `
      <path class="z-body" d="M150,40 Q138,90 148,140 Q154,178 150,210 Q146,258 200,262 Q254,258 250,210 Q246,178 252,140 Q262,90 250,40 Q200,20 150,40 Z"></path>
      <path class="z-hl" d="M162,52 Q152,100 160,150 Q164,186 160,212 Q158,248 200,252 Q242,248 240,212 Q236,186 240,150 Q248,100 238,52 Q200,34 162,52 Z"></path>
      <path class="z-line" d="M176,238 Q170,160 196,80"></path>
      <path class="a-arrow-soft" d="M196,236 Q186,160 210,84" marker-end="url(#ah-light)" style="stroke-dasharray:5 7"></path>
      <g transform="translate(206 150)">${arc(0,0,26,0,320,'a-arc','url(#ah-amber)')}</g>
      <g transform="translate(206 150)"><g class="anim-orbit" style="--spd:2.4s"><ellipse class="h-thumb" cx="0" cy="-14" rx="13" ry="8.5"></ellipse></g></g>
      ${label(200,290,'PLANTAR FASCIA')}
      ${label(120,90,'HEEL')}`;
    return { svg: wrap(flipG(flip, shapes) + badge(36,36,side) + label(36,62, side==='L'?'LEFT':'RIGHT')),
             aria:`${side==='L'?'Left':'right'} foot sole, thumb circles along the plantar surface` };
  },

  'glutes'(){
    const inner = `
      <rect class="z-body" x="120" y="18" width="160" height="52" rx="26"></rect>
      <path class="z-body" d="M112,72 Q200,58 288,72 L292,150 Q200,170 108,150 Z"></path>
      <path class="z-hl-core" d="M120,96 Q162,84 188,98 Q196,132 184,158 Q148,166 124,148 Q114,120 120,96 Z"></path>
      <path class="z-hl-core" d="M280,96 Q238,84 212,98 Q204,132 216,158 Q252,166 276,148 Q286,120 280,96 Z"></path>
      ${noZone(186,92,28,74,10)}
      <rect class="z-body" x="118" y="164" width="66" height="120" rx="26"></rect>
      <rect class="z-body" x="216" y="164" width="66" height="120" rx="26"></rect>
      <path class="a-path anim-dash" d="M151,286 Q148,200 172,166 Q196,140 200,120 Q204,96 200,60" marker-end="url(#ah-amber)"></path>
      <path class="a-path anim-dash" d="M249,286 Q252,220 232,180 Q212,152 208,120" marker-end="url(#ah-amber)" style="animation-delay:.5s"></path>
      ${hand(152,230,0,.85,'h-palm anim-press',0)}
      ${hand(248,230,0,.85,'h-palm anim-press',.7)}
      ${label(200,130,'SACRUM — NO PRESSURE')}
      ${label(200,48,'LOWER BACK → SHOULDER')}`;
    return { svg: wrap(inner), aria:'Gluteal region with flowing integration path from legs through glutes to lower back and shoulders' };
  },

  'transition'(){
    const inner = `
      <rect class="z-sheet" x="26" y="70" width="348" height="160" rx="40"></rect>
      <circle class="z-body" cx="66" cy="150" r="22"></circle>
      <rect class="z-body" x="90" y="118" width="270" height="64" rx="32" fill="rgba(232,184,120,0.14)"></rect>
      <rect class="z-line" x="90" y="118" width="270" height="64" rx="32"></rect>
      ${arc(200,150,96,200,340,'a-arc','url(#ah-amber)')}
      ${label(200,262,'FULL DRAPE MAINTAINED')}
      ${label(200,52,'CLIENT TURNS FACE-UP')}`;
    return { svg: wrap(inner), aria:'Fully draped client preparing to turn face up' };
  },

  'leg-ant'(side){
    const flip = side==='R';
    const shapes = `
      ${legBase()}
      <path class="z-hl-core" d="M172,34 Q200,24 228,34 L231,124 Q200,136 169,124 Z"></path>
      <rect class="z-hl" x="192" y="170" width="14" height="72" rx="7"></rect>
      ${noZone(208,168,12,78,6)}
      <g style="--dy:-96px;--spd:3.2s">${hand(200,244,0,.9,'h-palm anim-stroke',0)}</g>
      ${arrow(240,238,240,146)}
      ${label(146,80,'QUADRICEPS')}
      ${label(262,208,'TIBIA — NO PRESSURE')}
      ${label(200,296,'ANKLE')}`;
    return { svg: wrap(flipG(flip, shapes) + badge(36,36,side) + label(36,62, side==='L'?'LEFT':'RIGHT')),
             aria:`${side==='L'?'Left':'right'} front of leg, broad strokes up the quadriceps` };
  },

  'shin'(side){
    const flip = side==='R';
    const shapes = `
      <path class="z-body" d="M164,20 Q158,110 170,190 Q178,236 200,240 Q222,236 230,190 Q242,110 236,20 Q200,36 164,20 Z"></path>
      ${noZone(194,40,12,180,6)}
      <rect class="z-hl-core" x="172" y="52" width="16" height="150" rx="8"></rect>
      <g style="--dy:-120px;--spd:3s">${hand(180,196,0,.8,'h-palm anim-stroke',0)}</g>
      ${arrow(150,200,150,80,'a-arrow-soft')}
      ${label(200,278,'TIBIA — NO PRESSURE')}
      ${label(120,120,'TIBIALIS ANT.')}`;
    return { svg: wrap(flipG(flip, shapes) + badge(36,36,side) + label(36,62, side==='L'?'LEFT':'RIGHT')),
             aria:`${side==='L'?'Left':'right'} shin, light strokes on the muscle beside the tibia` };
  },

  'ankle-mob'(side){
    const flip = side==='R';
    const shapes = `
      <path class="z-body" d="M170,20 Q164,90 176,140 Q186,168 200,170 Q214,168 224,140 Q236,90 230,20 Q200,34 170,20 Z"></path>
      <path class="z-body" d="M172,166 Q158,200 162,232 Q168,262 200,264 Q232,262 238,232 Q242,200 228,166 Q200,184 172,166 Z"></path>
      <circle class="z-hl-core" cx="200" cy="176" r="24"></circle>
      <circle class="a-dot" cx="200" cy="176" r="5"></circle>
      ${arc(200,176,44,-200,-80)}
      ${arc(200,176,44,-40,80)}
      ${hand(150,176,-80,.75,'h-palm anim-press',0)}
      ${hand(250,176,80,.75,'h-palm anim-press',.8)}
      ${label(200,292,'SMALL CIRCLES • WITHIN RANGE')}`;
    return { svg: wrap(flipG(flip, shapes) + badge(36,36,side) + label(36,62, side==='L'?'LEFT':'RIGHT')),
             aria:`${side==='L'?'Left':'right'} ankle joint mobilization with small circles within comfortable range` };
  },

  'arm-upper'(side){
    const flip = side==='R';
    const shapes = `
      <circle class="z-body" cx="200" cy="44" r="30"></circle>
      <path class="z-hl-core" d="M178,52 Q164,84 174,116 Q190,132 200,132 Q210,132 226,116 Q236,84 222,52 Q200,40 178,52 Z"></path>
      <path class="z-body" d="M180,128 Q172,170 180,210 L184,236 Q192,246 200,246 Q208,246 216,236 L220,210 Q228,170 220,128 Q200,142 180,128 Z"></path>
      <path class="z-hl" d="M184,136 Q178,172 185,206 L188,228 Q194,236 200,236 Q206,236 212,228 L215,206 Q222,172 216,136 Q200,148 184,136 Z"></path>
      <rect class="z-body" x="190" y="244" width="20" height="40" rx="10"></rect>
      <g style="--dy:96px;--spd:3s">${hand(200,120,180,.85,'h-palm anim-stroke',0)}</g>
      ${arrow(248,120,248,224)}
      ${label(150,70,'DELTOID')}
      ${label(252,180,'UPPER ARM')}`;
    return { svg: wrap(flipG(flip, shapes) + badge(36,36,side) + label(36,62, side==='L'?'LEFT':'RIGHT')),
             aria:`${side==='L'?'Left':'right'} upper arm, broad strokes from shoulder toward elbow` };
  },

  'forearm-flex'(side){
    const flip = side==='R';
    const shapes = `
      <circle class="z-body" cx="200" cy="44" r="24"></circle>
      <path class="z-body" d="M176,62 Q166,120 176,170 Q182,204 194,226 L206,226 Q218,204 224,170 Q234,120 224,62 Q200,50 176,62 Z"></path>
      <path class="z-hl-core" d="M186,70 Q180,120 187,162 Q193,188 197,206 L200,206 L200,72 Q193,68 186,70 Z"></path>
      <path class="z-hl-core" d="M214,70 Q220,120 213,162 Q207,188 203,206 L200,206 L200,72 Q207,68 214,70 Z"></path>
      <rect class="z-body" x="192" y="224" width="16" height="44" rx="8"></rect>
      ${arrow(246,236,246,96)}
      <g style="--dy:-118px;--spd:2.8s">${thumb(200,220,0,'h-thumb anim-stroke',0)}</g>
      ${label(200,288,'WRIST')}
      ${label(140,120,'FLEXORS')}`;
    return { svg: wrap(flipG(flip, shapes) + badge(36,36,side) + label(36,62, side==='L'?'LEFT':'RIGHT') + label(200,12,'PALM SIDE — FLEXORS')),
             aria:`${side==='L'?'Left':'right'} forearm palm side, thumb stripping along flexors toward the elbow` };
  },

  'forearm-ext'(side){
    const flip = side==='R';
    const shapes = `
      <circle class="z-body" cx="200" cy="44" r="24"></circle>
      <path class="z-body" d="M176,62 Q166,120 176,170 Q182,204 194,226 L206,226 Q218,204 224,170 Q234,120 224,62 Q200,50 176,62 Z"></path>
      <path class="z-hl-core" d="M184,72 Q178,124 186,168 Q192,192 197,208 L203,208 Q208,192 214,168 Q222,124 216,72 Q200,64 184,72 Z"></path>
      <rect class="z-body" x="192" y="224" width="16" height="44" rx="8"></rect>
      ${arrow(246,236,246,96)}
      <g style="--dy:-118px;--spd:2.8s">${thumb(200,220,0,'h-thumb anim-stroke',0)}</g>
      ${label(200,288,'WRIST')}
      ${label(140,120,'EXTENSORS')}`;
    return { svg: wrap(flipG(flip, shapes) + badge(36,36,side) + label(36,62, side==='L'?'LEFT':'RIGHT') + label(200,12,'BACK SIDE — EXTENSORS')),
             aria:`${side==='L'?'Left':'right'} forearm back side, thumb stripping along extensors toward the elbow` };
  },

  'hand-palm'(side){
    const flip = side==='R';
    const shapes = `
      <rect class="z-body" x="140" y="120" width="120" height="130" rx="34"></rect>
      <rect class="z-body" x="146" y="36" width="20" height="96" rx="10"></rect>
      <rect class="z-body" x="174" y="24" width="21" height="108" rx="10.5"></rect>
      <rect class="z-body" x="203" y="28" width="21" height="104" rx="10.5"></rect>
      <rect class="z-body" x="232" y="44" width="19" height="88" rx="9.5"></rect>
      <rect class="z-body" x="112" y="150" width="34" height="66" rx="16" transform="rotate(-24 129 183)"></rect>
      <path class="z-hl-core" d="M146,214 Q146,242 172,246 Q190,248 194,230 Q196,210 178,204 Q158,200 146,214 Z"></path>
      <path class="z-hl-core" d="M254,214 Q254,242 228,246 Q210,248 206,230 Q204,210 222,204 Q242,200 254,214 Z"></path>
      <g transform="translate(200 176)">${arc(0,0,30,0,320,'a-arc','url(#ah-amber)')}</g>
      <g transform="translate(200 176)"><g class="anim-orbit" style="--spd:2.4s"><ellipse class="h-thumb" cx="0" cy="-16" rx="13" ry="8.5"></ellipse></g></g>
      ${label(162,272,'THENAR')}
      ${label(238,272,'HYPOTHENAR')}`;
    return { svg: wrap(flipG(flip, shapes) + badge(36,36,side) + label(36,62, side==='L'?'LEFT':'RIGHT')),
             aria:`${side==='L'?'Left':'right'} palm with slow thumb circles over thenar and hypothenar` };
  },

  'chest'(){
    const inner = `
      <circle class="z-body" cx="200" cy="40" r="30"></circle>
      <rect class="z-body" x="184" y="66" width="32" height="20" rx="8"></rect>
      <path class="z-body" d="M104,110 Q200,84 296,110 L290,236 Q200,262 110,236 Z"></path>
      <path class="z-hl" d="M136,132 Q200,116 264,132 L262,176 Q200,190 138,176 Z"></path>
      ${noZone(128,118,144,12,6)}
      ${arrow(150,168,250,168,'a-arrow-soft')}
      <g style="--dx:84px;--dy:0px;--spd:3.2s">${hand(152,156,90,.8,'h-palm anim-stroke',0)}</g>
      <g style="--dx:84px;--dy:0px;--spd:3.2s">${hand(152,182,90,.8,'h-palm anim-stroke',1.6)}</g>
      <rect class="z-sheet" x="96" y="196" width="208" height="94" rx="26" fill="rgba(232,184,120,0.14)"></rect>
      <rect class="z-line" x="96" y="196" width="208" height="94" rx="26"></rect>
      ${label(200,244,'DRAPE')}
      ${label(200,108,'CLAVICLE — NO PRESSURE')}`;
    return { svg: wrap(inner), aria:'Draped upper chest with gentle strokes along and beneath the clavicle' };
  },

  'suboccipital'(){
    const inner = `
      <path class="z-body" d="M120,120 Q120,52 200,48 Q276,52 280,124 Q282,168 252,186 L244,246 Q240,268 208,268 L188,268 Q170,268 168,246 L162,190 Q122,170 120,120 Z"></path>
      <path class="z-line" d="M124,128 Q120,150 132,168"></path>
      <path class="z-hl-core" d="M244,168 Q262,158 266,136 Q276,158 268,184 Q258,196 242,192 Z"></path>
      ${finger(240,196,18)}
      ${finger(252,192,30)}
      ${finger(262,184,42)}
      ${halo(252,178,30,'a-halo anim-halo',0)}
      ${halo(252,178,44,'a-halo anim-halo',1.3)}
      ${label(150,110,'HEAD')}
      ${label(300,240,'BASE OF SKULL')}
      ${label(200,292,'GENTLE STATIONARY HOLD')}`;
    return { svg: wrap(inner), aria:'Side view of head and neck, fingertips held gently beneath the base of the skull' };
  },

  'neck-traction'(){
    const inner = `
      <path class="z-body" d="M120,120 Q120,52 200,48 Q276,52 280,124 Q282,168 252,186 L244,246 Q240,268 208,268 L188,268 Q170,268 168,246 L162,190 Q122,170 120,120 Z"></path>
      <path class="a-path" d="M228,262 Q236,220 240,196" style="stroke-dasharray:4 8;stroke-width:2.5" marker-end="url(#ah-light)"></path>
      <g transform="translate(222 250)"><g class="anim-breathe"><circle class="a-halo" cx="0" cy="0" r="16"></circle></g></g>
      ${label(200,292,'VERY SUBTLE LENGTHENING')}
      ${label(140,100,'GENTLE TRACTION ONLY')}`;
    return { svg: wrap(inner), aria:'Side profile of head and neck with a very subtle lengthening arrow' };
  },

  'scalp'(){
    const dots = [[200,96],[150,130],[250,130],[130,178],[270,178],[200,214],[160,236],[240,236]];
    let inner = `
      <circle class="z-body" cx="200" cy="160" r="96"></circle>
      <path class="z-line" d="M116,140 Q200,96 284,140"></path>
      <path class="z-hl" d="M132,132 Q200,98 268,132 Q276,160 268,178 Q200,214 132,178 Q124,160 132,132 Z" opacity=".5"></path>`;
    dots.forEach((d,i)=>{
      inner += `<g transform="translate(${d[0]} ${d[1]})"><g class="anim-orbit" style="--spd:${2+i%3*0.4}s"><circle class="a-dot" cx="0" cy="-9" r="5"></circle></g></g>`;
    });
    inner += `
      <g transform="translate(200 160)">${arc(0,0,34,0,320,'a-arc','url(#ah-amber)')}</g>
      ${label(200,286,'NO OIL ON HAIR UNLESS REQUESTED')}`;
    return { svg: wrap(inner), aria:'Top view of head with fingertip circles across the scalp' };
  },

  'feather'(){
    const inner = `
      ${bodySil('supine')}
      <g style="--dx:70px;--dy:0px;--spd:3.8s">${hand(120,112,90,.7,'h-palm anim-feather',0)}</g>
      <g style="--dx:70px;--dy:0px;--spd:3.8s">${hand(120,188,90,.7,'h-palm anim-feather',1.9)}</g>
      <g style="--dx:60px;--dy:0px;--spd:3.8s">${hand(240,138,90,.7,'h-palm anim-feather',.9)}</g>
      <g style="--dx:60px;--dy:0px;--spd:3.8s">${hand(240,162,90,.7,'h-palm anim-feather',2.8)}</g>
      ${arrow(110,100,180,100,'a-arrow-soft')}
      ${arrow(240,126,300,126,'a-arrow-soft')}
      ${label(200,250,'FEATHER-LIGHT STROKES • TOWARD HANDS AND FEET')}`;
    return { svg: wrap(inner), aria:'Supine full body with feather-light strokes down the limbs' };
  },

  'grounding'(){
    const inner = `
      <circle class="z-body" cx="200" cy="66" r="36"></circle>
      <rect class="z-body" x="184" y="98" width="32" height="22" rx="9"></rect>
      <g class="anim-breathe">
        <path class="z-body" d="M104,150 Q200,112 296,150 L288,268 Q200,296 112,268 Z"></path>
      </g>
      ${hand(152,152,12,1.05,'h-palm',0)}
      ${hand(248,152,-12,1.05,'h-palm',0)}
      ${halo(152,152,40,'a-halo anim-halo',0)}
      ${halo(248,152,40,'a-halo anim-halo',1.3)}
      ${label(200,292,'STILL • BREATHE')}`;
    return { svg: wrap(inner), aria:'Two hands resting still on the shoulders with a breathing halo' };
  },

  'closure'(){
    const inner = `
      ${bodySil('supine', true)}
      ${halo(200,150,80,'a-halo anim-halo',0)}
      ${halo(200,150,110,'a-halo anim-halo',1.4)}
      ${label(200,250,'SESSION COMPLETE')}`;
    return { svg: wrap(inner), aria:'Fully draped client at rest, session complete' };
  },
};

/* ---------------- state ---------------- */
const state = {
  segIndex:0, remaining:0, elapsed:0,
  running:false, waiting:false, done:false,
  lastTick:0, warned30:false, introShown:{},
};
let wakeLock = null;

/* ---------------- dom ---------------- */
const $ = id => document.getElementById(id);
const els = {
  start:$('screen-start'), session:$('screen-session'), complete:$('screen-complete'),
  tbRegion:$('tb-region'), tbTimer:$('tb-timer'), tbElapsed:$('tb-elapsed'),
  progressFill:$('progress-fill'), diagram:$('diagram'), caption:$('diagram-caption'),
  region:$('info-region'), title:$('info-title'), instr:$('info-instr'),
  pressure:$('info-pressure'), direction:$('info-direction'), time:$('info-time'),
  next:$('info-next'), safety:$('info-safety'),
  btnPause:$('btn-pause'),
  ovTransition:$('ov-transition'), ovTransitionDiagram:$('ov-transition-diagram'),
  ovTransitionText:$('ov-transition-text'), ovPause:$('ov-pause'), ovPauseTimer:$('ov-pause-timer'),
  ovPhase:$('ov-phase'), ovPhaseKicker:$('ov-phase-kicker'), ovPhaseTitle:$('ov-phase-title'), ovPhaseText:$('ov-phase-text'),
  ovSettings:$('ov-settings'), ovConfirm:$('ov-confirm'),
  confirmTitle:$('confirm-title'), confirmText:$('confirm-text'),
};

/* ---------------- utils ---------------- */
function fmt(ms){
  ms = Math.max(0, Math.round(ms/1000));
  const m = Math.floor(ms/60), s = ms%60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function pressureDots([lbl, level]){
  if(level===0) return lbl;
  return '●'.repeat(level) + '○'.repeat(5-level) + ' ' + lbl;
}

/* ---------------- audio / haptics / voice / wake lock ---------------- */
let actx = null;
function chime(){
  if(!settings.sound) return;
  try{
    actx = actx || new (window.AudioContext||window.webkitAudioContext)();
    if(actx.state==='suspended') actx.resume();
    [[659.25,0],[880,0.16]].forEach(([f,t])=>{
      const o=actx.createOscillator(), g=actx.createGain();
      o.type='sine'; o.frequency.value=f;
      const t0=actx.currentTime+t;
      g.gain.setValueAtTime(0.0001,t0);
      g.gain.linearRampToValueAtTime(0.11,t0+0.04);
      g.gain.exponentialRampToValueAtTime(0.0001,t0+1.1);
      o.connect(g); g.connect(actx.destination);
      o.start(t0); o.stop(t0+1.2);
    });
  }catch(e){}
}
function vib(pattern){
  if(settings.haptics && navigator.vibrate){ try{ navigator.vibrate(pattern); }catch(e){} }
}
function speak(seg){
  if(!settings.voice || !('speechSynthesis' in window)) return;
  try{
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(seg.voice);
    u.rate = 0.98; u.pitch = 1; u.volume = 0.9;
    speechSynthesis.speak(u);
  }catch(e){}
}
async function acquireWakeLock(){
  if(!settings.awake || !('wakeLock' in navigator)) return;
  try{
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', ()=>{ wakeLock = null; });
  }catch(e){}
}
function releaseWakeLock(){
  if(wakeLock){ try{ wakeLock.release(); }catch(e){} wakeLock = null; }
}
document.addEventListener('visibilitychange', ()=>{
  if(document.visibilityState==='visible' && state.running) acquireWakeLock();
});

/* ---------------- rendering ---------------- */
function renderSegment(){
  const seg = SEGMENTS[state.segIndex];
  const pos = seg.type==='transition' ? 'TRANSITION' : seg.pos.toUpperCase();
  els.tbRegion.textContent = `${pos} • ${seg.region}`;
  els.region.textContent = seg.region + (seg.side ? ` (${seg.side})` : '');
  els.title.textContent = seg.title;
  els.instr.textContent = seg.instruction;
  els.pressure.textContent = pressureDots(seg.pressure);
  els.direction.textContent = seg.direction;
  els.time.textContent = fmt(seg.dur*1000);
  const n = SEGMENTS[state.segIndex+1];
  els.next.innerHTML = n ? `Next: <b>${n.title}</b>${n.side?` (${n.side})`:''}` : 'Final segment';
  if(seg.safety){ els.safety.textContent = '⚠ ' + seg.safety; els.safety.classList.remove('hidden'); }
  else els.safety.classList.add('hidden');

  const d = DIAGRAMS[seg.view](seg.side);
  els.diagram.innerHTML = `<div class="anim-fadein">${d.svg}</div>`;
  els.diagram.setAttribute('aria-label', d.aria);
  els.caption.textContent = seg.animLabel || '';
  renderTimers();
}

function renderTimers(){
  els.tbTimer.textContent = fmt(state.remaining);
  els.tbElapsed.textContent = fmt(state.elapsed);
  els.progressFill.style.width = Math.min(100, state.elapsed/TOTAL_MS*100) + '%';
  if(!els.ovPause.classList.contains('hidden')) els.ovPauseTimer.textContent = fmt(state.remaining);
}

/* ---------------- navigation ---------------- */
function gotoSegment(i){
  i = Math.max(0, Math.min(SEGMENTS.length-1, i));
  state.segIndex = i;
  const seg = SEGMENTS[i];
  state.remaining = seg.dur * 1000;
  state.warned30 = false;
  hide(els.ovTransition); hide(els.ovPause);
  renderSegment();

  if(seg.type === 'transition'){
    state.running = false; state.waiting = true;
    show(els.ovTransition);
    els.ovTransitionDiagram.innerHTML = DIAGRAMS['transition']().svg;
    els.ovTransitionText.textContent = seg.instruction;
    vib(20);
    return;
  }
  if(seg.intro && !state.introShown[seg.phase]){
    state.introShown[seg.phase] = true;
    state.running = false; state.waiting = true;
    els.ovPhaseKicker.textContent = seg.intro.kicker;
    els.ovPhaseTitle.textContent = seg.intro.title;
    els.ovPhaseText.textContent = seg.intro.text;
    show(els.ovPhase);
    return;
  }
  state.waiting = false;
  state.running = true;
  state.lastTick = Date.now();
  speak(seg);
  vib(15);
}

function endSegment(){
  chime();
  vib([30,60,30]);
  if(state.segIndex >= SEGMENTS.length-1){ complete(); return; }
  gotoSegment(state.segIndex+1);
}

function complete(){
  state.running = false; state.done = true;
  if('speechSynthesis' in window) speechSynthesis.cancel();
  chime(); vib([40,80,40]);
  releaseWakeLock();
  hide(els.session); show(els.complete);
}

function startSession(){
  Object.assign(state, { segIndex:0, elapsed:0, running:false, waiting:false, done:false, warned30:false, introShown:{} });
  hide(els.start); hide(els.complete); show(els.session);
  updatePauseBtn();
  acquireWakeLock();
  gotoSegment(0);
}

function pauseSession(){
  if(!state.running) return;
  state.running = false;
  if('speechSynthesis' in window) speechSynthesis.cancel();
  show(els.ovPause);
  updatePauseBtn();
  renderTimers();
}
function resumeSession(){
  hide(els.ovPause);
  state.running = true;
  state.lastTick = Date.now();
  updatePauseBtn();
  acquireWakeLock();
}
function updatePauseBtn(){
  els.btnPause.textContent = state.running ? 'PAUSE' : 'RESUME';
  els.btnPause.classList.toggle('paused', !state.running && !state.waiting && !state.done);
}

/* ---------------- timer engine ---------------- */
function tick(){
  if(!state.running || state.done) return;
  const now = Date.now();
  let dt = now - state.lastTick;
  state.lastTick = now;
  if(dt > 3000) dt = 3000; // clamp big background gaps
  state.remaining -= dt;
  state.elapsed += dt;
  const seg = SEGMENTS[state.segIndex];
  if(!state.warned30 && state.remaining <= 30000 && state.remaining > 0){
    state.warned30 = true;
    vib(25);
  }
  if(state.remaining <= 0){
    state.remaining = 0;
    renderTimers();
    endSegment();
    return;
  }
  renderTimers();
}
setInterval(tick, 250);

/* ---------------- confirm dialog ---------------- */
let confirmCb = null;
function confirmDialog(title, text, cb){
  els.confirmTitle.textContent = title;
  els.confirmText.textContent = text;
  confirmCb = cb;
  show(els.ovConfirm);
}
$('confirm-yes').addEventListener('click', ()=>{ hide(els.ovConfirm); if(confirmCb) confirmCb(); confirmCb=null; });
$('confirm-no').addEventListener('click', ()=>{ hide(els.ovConfirm); confirmCb=null; });

/* ---------------- settings ui ---------------- */
function bindToggle(id, key, after){
  const el = $(id);
  const sync = ()=>{
    el.textContent = settings[key] ? 'ON' : 'OFF';
    el.classList.toggle('on', !!settings[key]);
    el.setAttribute('aria-checked', String(!!settings[key]));
  };
  el.addEventListener('click', ()=>{
    settings[key] = !settings[key];
    saveSettings(); sync();
    if(after) after();
  });
  sync();
}
function openSettings(){ show(els.ovSettings); }
function closeSettings(){ hide(els.ovSettings); }

/* ---------------- wiring ---------------- */
function show(el){ el.classList.remove('hidden'); }
function hide(el){ el.classList.add('hidden'); }

$('btn-start').addEventListener('click', startSession);
$('btn-settings-open').addEventListener('click', openSettings);
$('btn-settings').addEventListener('click', openSettings);
$('btn-settings-close').addEventListener('click', closeSettings);

$('btn-pause').addEventListener('click', ()=>{
  if(state.waiting) return;
  state.running ? pauseSession() : resumeSession();
});
$('btn-resume').addEventListener('click', resumeSession);
$('btn-home').addEventListener('click', ()=>{
  confirmDialog('End session?', 'The session will stop and return to the start screen.', ()=>{
    state.running = false; state.done = true;
    if('speechSynthesis' in window) speechSynthesis.cancel();
    releaseWakeLock();
    hide(els.session); hide(els.ovPause); hide(els.start); show(els.start);
  });
});
$('btn-prev').addEventListener('click', ()=>{ if(state.segIndex>0) gotoSegment(state.segIndex-1); });
$('btn-next').addEventListener('click', ()=>{
  if(state.waiting){ // ready from transition
    hide(els.ovTransition);
    gotoSegment(state.segIndex+1);
    return;
  }
  if(state.segIndex < SEGMENTS.length-1) gotoSegment(state.segIndex+1);
});
$('btn-ready').addEventListener('click', ()=>{
  hide(els.ovTransition);
  gotoSegment(state.segIndex+1);
});
$('btn-add30').addEventListener('click', ()=>{ state.remaining += 30000; renderTimers(); vib(10); });
$('btn-add60').addEventListener('click', ()=>{ state.remaining += 60000; renderTimers(); vib(10); });
$('btn-restart-seg').addEventListener('click', ()=>{
  state.remaining = SEGMENTS[state.segIndex].dur * 1000;
  state.warned30 = false;
  renderTimers(); vib(10);
});

els.ovPhase.addEventListener('click', ()=>{
  if(state.waiting && !els.ovPhase.classList.contains('hidden')){
    hide(els.ovPhase);
    state.waiting = false;
    state.running = true;
    state.lastTick = Date.now();
    speak(SEGMENTS[state.segIndex]);
    vib(15);
  }
});

$('btn-again').addEventListener('click', ()=>{
  confirmDialog('Start again?', 'A new 60-minute session will begin from the start.', startSession);
});
$('btn-return').addEventListener('click', ()=>{
  hide(els.complete); show(els.start);
});

$('btn-restart-all').addEventListener('click', ()=>{
  confirmDialog('Restart session?', 'The entire massage will restart from the beginning.', ()=>{
    closeSettings();
    startSession();
  });
});

bindToggle('tg-voice','voice', ()=>{ if(!settings.voice && 'speechSynthesis' in window) speechSynthesis.cancel(); });
bindToggle('tg-sound','sound');
bindToggle('tg-haptics','haptics');
bindToggle('tg-motion','motion', ()=>{ document.body.classList.toggle('reduced-motion', settings.motion); });
bindToggle('tg-awake','awake', ()=>{ state.running ? acquireWakeLock() : releaseWakeLock(); });

if(settings.motion) document.body.classList.add('reduced-motion');

/* ---------------- service worker (optional, best-effort) ---------------- */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
}
