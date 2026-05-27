document.addEventListener('DOMContentLoaded', () => {

  // ===== Seal Designs =====
  const sealDesigns = {
    heart:   { name:'하트',   w:52, h:48, clip:"path('M26 46C26 46 2 28 2 16C2 7 8 2 15 2C20 2 24 5 26 9C28 5 32 2 37 2C44 2 50 7 50 16C50 28 26 46 26 46Z')", bg:'radial-gradient(circle at 38% 35%,#e25555,#8B0000 55%,#5a0000)', mark:'♡' },
    star:    { name:'별',     w:52, h:50, clip:'polygon(50% 0%,62% 35%,100% 38%,70% 60%,80% 98%,50% 75%,20% 98%,30% 60%,0% 38%,38% 35%)', bg:'radial-gradient(circle at 38% 35%,#e8b830,#9A7B0A 55%,#5C4A00)', mark:'☆' },
    round:   { name:'원형',   w:52, h:52, clip:'circle(50%)', bg:'radial-gradient(circle at 38% 35%,#d44,#8B0000 55%,#5a0000)', mark:'✦' },
    flower:  { name:'꽃',     w:52, h:52, clip:'polygon(50% 0%,63% 12%,78% 4%,88% 18%,100% 34%,88% 50%,100% 66%,88% 82%,78% 96%,63% 88%,50% 100%,37% 88%,22% 96%,12% 82%,0% 66%,12% 50%,0% 34%,12% 18%,22% 4%,37% 12%)', bg:'radial-gradient(circle at 38% 35%,#F48FB1,#C2185B 55%,#880E4F)', mark:'❀' },
    diamond: { name:'다이아', w:48, h:52, clip:'polygon(50% 0%,100% 50%,50% 100%,0% 50%)', bg:'radial-gradient(circle at 38% 35%,#CE93D8,#7B1FA2 55%,#4A148C)', mark:'◇' },
    hexagon: { name:'육각',   w:52, h:52, clip:'polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)', bg:'radial-gradient(circle at 38% 35%,#66BB6A,#2E7D32 55%,#1B5E20)', mark:'♧' },
    shield:  { name:'방패',   w:48, h:54, clip:'polygon(50% 100%,5% 70%,0% 10%,15% 0%,85% 0%,100% 10%,95% 70%)', bg:'radial-gradient(circle at 38% 35%,#5A7599,#2C3E56 55%,#1a2a3a)', mark:'⛊' },
    octagon: { name:'팔각',   w:52, h:52, clip:'polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)', bg:'radial-gradient(circle at 38% 35%,#FFB74D,#E65100 55%,#BF360C)', mark:'☀' }
  };

  const stickerData = {
    love:   ['❤️','💕','💖','💗','💝','💘','💓','💞','💋','🥰','😘','🤗','💑','💏','🫶'],
    flower: ['🌸','🌷','🌹','🌺','🌻','🌼','💐','🌿','🍀','🍃','🌱','🪻','🪷','🌾','🍂','🍁','🎋','🌵'],
    animal: ['🦋','🐰','🐱','🐻','🐥','🦊','🐶','🐸','🦄','🕊️','🐝','🐞','🐧','🐨','🐹','🦢','🐇','🐻‍❄️'],
    sky:    ['⭐','🌙','✨','🌈','☁️','❄️','🌟','💫','⚡','🌞','🌠','🪐','🔥','🌊','☀️','🌤️','🫧','💧'],
    food:   ['☕','🍰','🧁','🍪','🍩','🍫','🎂','🍭','🍬','🧇','🍓','🍒','🫖','🍵','🥂','🍷','🧋','🍺'],
    deco:   ['🎀','🎁','🎊','🎉','🎈','🎗️','📮','💌','🏷️','🧸','🪆','🎐','🪩','🎠','🪄','🎭','📿','🎪'],
    symbol: ['♠️','♥️','♦️','♣️','🔮','🪞','🕯️','💎','👑','🗝️','🪶','📜','♾️','⚜️','🛡️','⚔️','🔔','🏹']
  };

  // ===== State =====
  const D = {
    to:'', body:'', from:'',
    envelopeColor:'#741518', paper:'cream', seal:'heart', font:'Nanum Pen Script',
    stickers: [],       // 봉투 스티커 [{emoji,x,y}, ...]
    letterStickers: []  // 편지지 스티커
  };
  let curTab = 'love';
  let decoTarget = 'envelope'; // 'envelope' | 'letter'

  function $(id){ return document.getElementById(id); }

  // ===== Pages =====
  const pages = document.querySelectorAll('.page');
  function showPage(id){
    pages.forEach(p=>p.classList.remove('active'));
    $(id).classList.add('active');
    window.scrollTo(0,0);
    if(id==='pageDecorate'){ renderStickerTab(curTab); refreshDecoCanvases(); }
  }

  // ===== Init =====
  function init(){
    const h=location.hash;
    if(h.startsWith('#letter=')){
      try{
        const bin=atob(h.slice(8));
        const bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));
        const data=JSON.parse(new TextDecoder().decode(bytes));
        Object.assign(D,data);
        if(!D.stickers) D.stickers=[];
        if(!D.letterStickers) D.letterStickers=[];
        showPage('pageReceive'); renderReceive(); return;
      }catch(e){}
    }
    showPage('pageLanding');
    renderSealPicker(); renderStickerTab('love');
  }

  // ===== Nav =====
  $('btnStart').onclick=()=>showPage('pageWrite');
  $('btnBackToLanding').onclick=()=>showPage('pageLanding');
  $('btnBackToWrite').onclick=()=>showPage('pageWrite');
  $('btnBackToDecorate').onclick=()=>showPage('pageDecorate');
  $('btnReplay').onclick=()=>renderSendPreview();
  $('btnToDecorate').onclick=()=>{
    D.to=$('recipientName').value.trim();
    D.body=$('letterContent').value.trim();
    D.from=$('senderName').value.trim();
    showPage('pageDecorate'); syncDecoPreview();
  };
  $('btnToPreview').onclick=()=>{ showPage('pageSend'); renderSendPreview(); };
  $('btnNewLetter').onclick=()=>{
    location.hash=''; $('recipientName').value=''; $('letterContent').value=''; $('senderName').value='';
    $('charCount').textContent='0'; $('btnToDecorate').disabled=true;
    D.stickers=[]; D.letterStickers=[];
    showPage('pageLanding');
  };
  $('btnReply').onclick=()=>{ location.hash=''; showPage('pageWrite'); };

  // ===== Validation =====
  function validate(){ $('btnToDecorate').disabled=!($('recipientName').value.trim()&&$('letterContent').value.trim()&&$('senderName').value.trim()); }
  $('recipientName').oninput=validate;
  $('senderName').oninput=validate;
  $('letterContent').oninput=()=>{ $('charCount').textContent=$('letterContent').value.length; validate(); };

  // ===== Pickers =====
  function picker(id,key,cb){
    $(id).addEventListener('click',e=>{
      const b=e.target.closest('button'); if(!b||!b.dataset[key]) return;
      $(id).querySelectorAll('button').forEach(x=>x.classList.remove('active'));
      b.classList.add('active'); cb(b.dataset[key]);
    });
  }
  picker('envelopeColors','color',c=>{ D.envelopeColor=c; applyColor(c); syncDecoPreview(); });
  picker('paperStyles','paper',p=>{ D.paper=p; refreshLetterPreview(); });
  picker('fontStyles','font',f=>{ D.font=f; refreshLetterPreview(); });

  function applyColor(hex){
    const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
    document.documentElement.style.setProperty('--env-color',hex);
    document.documentElement.style.setProperty('--env-light',`rgb(${Math.min(r+25,255)},${Math.min(g+8,255)},${Math.min(b+8,255)})`);
    document.documentElement.style.setProperty('--env-dark',`rgb(${Math.max(r-25,0)},${Math.max(g-8,0)},${Math.max(b-8,0)})`);
  }

  // ===== Seal Picker =====
  function renderSealPicker(){
    const w=$('sealShapes'); w.innerHTML='';
    Object.keys(sealDesigns).forEach(key=>{
      const d=sealDesigns[key];
      const btn=document.createElement('button');
      btn.className='seal-pick-btn'+(key===D.seal?' active':'');
      btn.dataset.seal=key;
      const sc=32/Math.max(d.w,d.h), mw=Math.round(d.w*sc), mh=Math.round(d.h*sc);
      const mini=document.createElement('div');
      mini.className='mini-seal';
      mini.style.cssText=`width:${mw}px;height:${mh}px;background:${d.bg};clip-path:${d.clip};font-size:${Math.round(mw*.3)}px;color:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;`;
      mini.textContent=d.mark;
      btn.appendChild(mini);
      btn.onclick=()=>{
        w.querySelectorAll('.seal-pick-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active'); D.seal=key; syncDecoPreview();
      };
      w.appendChild(btn);
    });
  }

  // ===== Deco Preview =====
  function syncDecoPreview(){
    const seal=$('decoSeal'), d=sealDesigns[D.seal]||sealDesigns.heart;
    const sc=36/Math.max(d.w,d.h);
    seal.style.cssText=`position:absolute;bottom:42px;left:50%;transform:translateX(-50%);width:${Math.round(d.w*sc)}px;height:${Math.round(d.h*sc)}px;background:${d.bg};clip-path:${d.clip};display:flex;align-items:center;justify-content:center;font-size:${Math.round(d.w*sc*.3)}px;color:rgba(255,255,255,.2);z-index:2;filter:drop-shadow(0 2px 4px rgba(0,0,0,.35));`;
    seal.textContent=d.mark;
    $('decoTo').textContent=D.to?'To. '+D.to:'To.';
  }

  function refreshLetterPreview(){
    const el=$('decoLetter');
    el.className='deco-letter paper-'+D.paper;
    el.style.fontFamily="'"+D.font+"',cursive";
    $('decoLetterTo').textContent=D.to+'에게';
    $('decoLetterBody').textContent=D.body;
    $('decoLetterFrom').textContent=D.from+' 올림';
  }

  function refreshDecoCanvases(){
    syncDecoPreview();
    refreshLetterPreview();
    restoreStickers($('decoCanvasEnvelope'), D.stickers);
    restoreStickers($('decoCanvasLetter'), D.letterStickers);
  }

  // ===== Deco Tabs (봉투/편지지 전환) =====
  document.querySelector('.deco-tab-bar').addEventListener('click',e=>{
    const tab=e.target.closest('.deco-tab'); if(!tab) return;
    document.querySelectorAll('.deco-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    decoTarget=tab.dataset.target;
    $('decoCanvasEnvelope').style.display=decoTarget==='envelope'?'':'none';
    $('decoCanvasLetter').style.display=decoTarget==='letter'?'':'none';
  });

  // ===== Sticker Tabs =====
  $('stickerTabs').addEventListener('click',e=>{
    const tab=e.target.closest('.sticker-tab'); if(!tab) return;
    $('stickerTabs').querySelectorAll('.sticker-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active'); curTab=tab.dataset.tab; renderStickerTab(curTab);
  });
  function renderStickerTab(name){
    $('stickerPalette').innerHTML=(stickerData[name]||[]).map(e=>'<button class="sticker-btn" data-sticker="'+e+'">'+e+'</button>').join('');
  }

  // ===== Sticker Placement =====
  $('stickerPalette').addEventListener('click',e=>{
    const btn=e.target.closest('.sticker-btn'); if(!btn) return;
    const emoji=btn.dataset.sticker;
    const arr = decoTarget==='envelope' ? D.stickers : D.letterStickers;
    const canvas = decoTarget==='envelope' ? $('decoCanvasEnvelope') : $('decoCanvasLetter');
    const x=15+Math.random()*65, y=15+Math.random()*60;
    arr.push({emoji,x,y});
    addSticker(canvas,emoji,x,y,arr.length-1,arr);
  });

  function addSticker(canvas,emoji,x,y,idx,arr){
    const el=document.createElement('span');
    el.className='placed-sticker'; el.textContent=emoji;
    el.style.left=x+'%'; el.style.top=y+'%';
    el.dataset.idx=idx;
    el.addEventListener('dblclick',e=>{ e.stopPropagation(); arr[idx]=null; el.remove(); });
    setupStickerDrag(el,canvas,arr);
    canvas.appendChild(el);
  }

  function restoreStickers(canvas,arr){
    canvas.querySelectorAll('.placed-sticker').forEach(s=>s.remove());
    arr.forEach((s,i)=>{ if(s) addSticker(canvas,s.emoji,s.x,s.y,i,arr); });
  }

  // ===== Drag & Drop =====
  function setupStickerDrag(el,canvas,arr){
    let dragging=false, ox=0, oy=0;

    function start(e){
      e.preventDefault(); e.stopPropagation();
      dragging=true; el.classList.add('dragging');
      const t=e.touches?e.touches[0]:e;
      const r=el.getBoundingClientRect();
      ox=t.clientX-r.left; oy=t.clientY-r.top;
    }
    function move(e){
      if(!dragging) return;
      e.preventDefault();
      const t=e.touches?e.touches[0]:e;
      const cr=canvas.getBoundingClientRect();
      let px=(t.clientX-cr.left-ox+el.offsetWidth/2)/cr.width*100;
      let py=(t.clientY-cr.top-oy+el.offsetHeight/2)/cr.height*100;
      px=Math.max(2,Math.min(96,px));
      py=Math.max(2,Math.min(96,py));
      el.style.left=px+'%'; el.style.top=py+'%';
    }
    function end(){
      if(!dragging) return;
      dragging=false; el.classList.remove('dragging');
      const idx=parseInt(el.dataset.idx);
      if(arr[idx]){ arr[idx].x=parseFloat(el.style.left); arr[idx].y=parseFloat(el.style.top); }
    }

    el.addEventListener('mousedown',start);
    el.addEventListener('touchstart',start,{passive:false});
    document.addEventListener('mousemove',move);
    document.addEventListener('touchmove',move,{passive:false});
    document.addEventListener('mouseup',end);
    document.addEventListener('touchend',end);
  }

  // ===== Build Envelope =====
  function sealStyle(key,size){
    const d=sealDesigns[key]||sealDesigns.heart;
    const sc=size/Math.max(d.w,d.h), w=Math.round(d.w*sc), h=Math.round(d.h*sc);
    return `width:${w}px;height:${h}px;background:${d.bg};clip-path:${d.clip};font-size:${Math.round(w*.3)}px;`;
  }

  function buildEnvelope(interactive){
    const el=document.createElement('div');
    el.className='envelope-full';

    const envSt=(D.stickers||[]).filter(Boolean).map(s=>
      '<span class="env-sticker" style="left:'+(s.x/100*300)+'px;top:'+(s.y/100*260)+'px">'+s.emoji+'</span>'
    ).join('');

    const letSt=(D.letterStickers||[]).filter(Boolean).map(s=>
      '<span class="letter-sticker" style="left:'+s.x+'%;top:'+s.y+'%">'+s.emoji+'</span>'
    ).join('');

    el.innerHTML=
      '<div class="env-inner"></div>'+
      '<div class="env-letter paper-'+D.paper+'" style="position:relative">'+
        '<div class="env-letter-content" style="font-family:\''+D.font+'\',cursive">'+
          '<p class="env-letter-greeting">'+esc(D.to)+'에게</p>'+
          '<p class="env-letter-body">'+esc(D.body)+'</p>'+
          '<p class="env-letter-closing">'+esc(D.from)+' 올림</p>'+
        '</div>'+
        letSt+
      '</div>'+
      '<div class="env-body"></div>'+
      '<div class="env-flap"><div class="env-flap-front"></div><div class="env-flap-back"></div></div>'+
      '<div class="env-seal" style="'+sealStyle(D.seal,52)+'">'+(sealDesigns[D.seal]||sealDesigns.heart).mark+'</div>'+
      '<div class="env-to">To. '+esc(D.to)+'</div>'+
      envSt;

    if(interactive) wireEnvelope(el);
    return el;
  }

  function wireEnvelope(el){
    let state='closed';
    el.addEventListener('click',()=>{
      if(state!=='closed') return;
      state='animating';
      const seal=el.querySelector('.env-seal');
      const flap=el.querySelector('.env-flap');
      const letter=el.querySelector('.env-letter');

      // 1. 실링 파괴
      spawnParticles(seal);
      seal.classList.add('cracked');

      // 2. 플랩 열림
      setTimeout(()=>flap.classList.add('open'),600);

      // 3. 편지 슬라이드 업
      setTimeout(()=>letter.classList.add('rising'),1600);

      // 4. 전체화면 전환
      setTimeout(()=>{
        state='open';
        letter.classList.remove('rising');
        letter.classList.add('expanded');
        const ov=document.createElement('div');
        ov.className='overlay';
        document.body.appendChild(ov);
        function close(){
          letter.classList.remove('expanded');
          ov.style.opacity='0'; ov.style.transition='opacity .4s';
          setTimeout(()=>{
            ov.remove(); letter.classList.add('rising');
            const rb=$('btnReply'); if(rb) rb.style.display='inline-block';
          },400);
        }
        ov.onclick=close;
        letter.onclick=e=>e.stopPropagation();
      },2800);
    });
  }

  // ===== Send Preview =====
  function renderSendPreview(){
    const w=$('sendPreview'); w.innerHTML=''; w.appendChild(buildEnvelope(true));
  }

  // ===== Copy Link =====
  $('btnCopyLink').onclick=()=>{
    const clean=Object.assign({},D,{stickers:(D.stickers||[]).filter(Boolean),letterStickers:(D.letterStickers||[]).filter(Boolean)});
    const bytes=new TextEncoder().encode(JSON.stringify(clean));
    let bin=''; bytes.forEach(b=>bin+=String.fromCharCode(b));
    const url=location.origin+location.pathname+'#letter='+btoa(bin);
    navigator.clipboard.writeText(url).then(toast).catch(()=>{
      const t=document.createElement('textarea'); t.value=url;
      document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); toast();
    });
  };
  function toast(){ const t=$('toast'); t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2500); }

  // ===== Receive =====
  function renderReceive(){
    applyColor(D.envelopeColor);
    $('receiveToText').textContent=D.to+'님에게 편지가 도착했습니다';
    const scene=$('receiveScene'); scene.innerHTML=''; scene.appendChild(buildEnvelope(true));
    $('receiveHint').addEventListener('click',function(){ this.classList.add('hidden'); },{once:true});
    scene.addEventListener('click',()=>$('receiveHint').classList.add('hidden'),{once:true});
  }

  // ===== Particles =====
  function spawnParticles(origin){
    const r=origin.getBoundingClientRect();
    const cx=r.left+r.width/2, cy=r.top+r.height/2;
    const d=sealDesigns[D.seal]||sealDesigns.heart;
    const m=d.bg.match(/#[0-9A-Fa-f]{6}/g);
    const color=m?m[1]||m[0]:'#8B0000';
    for(let i=0;i<12;i++){
      const p=document.createElement('div');
      p.className='wax-particle'; p.style.background=color;
      const a=(Math.PI*2*i)/12+(Math.random()-.5)*.6;
      const dist=20+Math.random()*50;
      p.style.left=cx+'px'; p.style.top=cy+'px';
      p.style.setProperty('--tx',Math.cos(a)*dist+'px');
      p.style.setProperty('--ty',Math.sin(a)*dist+'px');
      const s=(3+Math.random()*5)+'px'; p.style.width=s; p.style.height=s;
      document.body.appendChild(p);
      setTimeout(()=>p.remove(),700);
    }
  }

  function esc(s){ const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }

  init();
});
