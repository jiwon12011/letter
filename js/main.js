document.addEventListener('DOMContentLoaded', () => {

  // ===== Seal Designs (원형 왁스, 색상+마크) =====
  const sealDesigns = {
    classic:  { name:'클래식',  bg:'radial-gradient(circle at 38% 32%,#d44,#8B0000 50%,#5a0000)', mark:'✦' },
    heart:    { name:'하트',    bg:'radial-gradient(circle at 38% 32%,#e25555,#9B1818 50%,#5a0000)', mark:'♡' },
    gold:     { name:'골드',    bg:'radial-gradient(circle at 38% 32%,#e8b830,#9A7B0A 50%,#5C4A00)', mark:'☆' },
    rose:     { name:'로즈',    bg:'radial-gradient(circle at 38% 32%,#F06292,#C2185B 50%,#880E4F)', mark:'❀' },
    navy:     { name:'네이비',  bg:'radial-gradient(circle at 38% 32%,#5C8DB5,#1E3A5F 50%,#0D1F33)', mark:'⚓' },
    forest:   { name:'포레스트',bg:'radial-gradient(circle at 38% 32%,#5DAE61,#2E7D32 50%,#1B5E20)', mark:'♧' },
    purple:   { name:'퍼플',    bg:'radial-gradient(circle at 38% 32%,#BA68C8,#7B1FA2 50%,#4A148C)', mark:'◇' },
    bronze:   { name:'브론즈',  bg:'radial-gradient(circle at 38% 32%,#CD8C52,#8B5E3C 50%,#5C3A1E)', mark:'✣' },
    charcoal: { name:'차콜',    bg:'radial-gradient(circle at 38% 32%,#777,#3a3a3a 50%,#1a1a1a)', mark:'✧' },
    sky:      { name:'하늘',    bg:'radial-gradient(circle at 38% 32%,#64B5F6,#1976D2 50%,#0D47A1)', mark:'☁' },
    peach:    { name:'피치',    bg:'radial-gradient(circle at 38% 32%,#FFAB91,#E64A19 50%,#BF360C)', mark:'❋' },
    mint:     { name:'민트',    bg:'radial-gradient(circle at 38% 32%,#80CBC4,#00796B 50%,#004D40)', mark:'✿' }
  };

  const stickerData = {
    love:   ['❤️','💕','💖','💗','💝','💘','💓','💞','💋','🥰','😘','🤗','💑','💏','🫶'],
    flower: ['🌸','🌷','🌹','🌺','🌻','🌼','💐','🌿','🍀','🍃','🌱','🪻','🪷','🌾','🍂','🍁','🎋','🌵'],
    animal: ['🦋','🐰','🐱','🐻','🐥','🦊','🐶','🐸','🦄','🕊️','🐝','🐞','🐧','🐨','🐹','🦢','🐇','🐻‍❄️'],
    sky:    ['⭐','🌙','✨','🌈','☁️','❄️','🌟','💫','⚡','🌞','🌠','🪐','🔥','🌊','☀️','🌤️','🫧','💧'],
    food:   ['☕','🍰','🧁','🍪','🍩','🍫','🎂','🍭','🍬','🧇','🍓','🍒','🫖','🍵','🥂','🍷','🧋','🍺'],
    face:   ['😊','😂','🥹','😍','🤩','😎','🥺','😢','😤','🫠','😇','🤪','😴','🥳','🤔','😈','👻','💀'],
    travel: ['✈️','🗼','🏖️','🗺️','🧳','⛩️','🏔️','🚂','🎡','⛵','🏕️','🌅','🚀','🎢','🏰','🗽','🧭','🌍'],
    season: ['🎄','🎅','⛄','🎃','👻','🌊','🏖️','🍉','🌸','🌱','🍂','🍁','❄️','☃️','🎆','🎇','🪻','🌻'],
    deco:   ['🎀','🎁','🎊','🎉','🎈','🎗️','📮','💌','🏷️','🧸','🪆','🎐','🪩','🎠','🪄','🎭','📿','🎪'],
    text:   ['🅰️','🅱️','🆎','🔤','💯','‼️','❓','❗','🔣','🏷️','📝','✉️','📌','📎','🔖','💬','💭','🗨️'],
    symbol: ['♠️','♥️','♦️','♣️','🔮','🪞','🕯️','💎','👑','🗝️','🪶','📜','♾️','⚜️','🛡️','⚔️','🔔','🏹']
  };

  // ===== State =====
  const D = {
    to:'', body:'', from:'',
    envelopeColor:'#741518', paperColor:'#FFF8E7', inkColor:'#2C1810',
    paper:'none', seal:'classic', font:'Nanum Pen Script',
    texture:'smooth', letterBorder:'none',
    stickers:[], letterStickers:[],
    photos:[], letterPhotos:[]  // {dataUrl, x%, y%, rot}

  };
  let curTab='love', decoTarget='envelope';

  function $(id){ return document.getElementById(id); }

  const pages=document.querySelectorAll('.page');
  function showPage(id){
    pages.forEach(p=>p.classList.remove('active'));
    $(id).classList.add('active'); window.scrollTo(0,0);
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
        if(!D.photos) D.photos=[];
        if(!D.letterPhotos) D.letterPhotos=[];
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
    D.to=$('recipientName').value.trim(); D.body=$('letterContent').value.trim(); D.from=$('senderName').value.trim();
    showPage('pageDecorate'); syncDecoPreview();
  };
  $('btnToPreview').onclick=()=>{ showPage('pageSend'); renderSendPreview(); };
  $('btnNewLetter').onclick=()=>{
    location.hash=''; $('recipientName').value=''; $('letterContent').value=''; $('senderName').value='';
    $('charCount').textContent='0'; $('btnToDecorate').disabled=true;
    D.stickers=[]; D.letterStickers=[]; D.photos=[]; D.letterPhotos=[]; showPage('pageLanding');
  };
  $('btnReply').onclick=()=>{ location.hash=''; showPage('pageWrite'); };

  function validate(){ $('btnToDecorate').disabled=!($('recipientName').value.trim()&&$('letterContent').value.trim()&&$('senderName').value.trim()); }
  $('recipientName').oninput=validate; $('senderName').oninput=validate;
  $('letterContent').oninput=()=>{ $('charCount').textContent=$('letterContent').value.length; validate(); };

  // ===== Pickers =====
  $('envColorPicker').oninput=function(){ D.envelopeColor=this.value; applyColor(this.value); syncDecoPreview(); };
  $('paperColorPicker').oninput=function(){ D.paperColor=this.value; refreshLetterPreview(); };
  $('inkColorPicker').oninput=function(){ D.inkColor=this.value; refreshLetterPreview(); };

  function applyColor(hex){
    const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
    document.documentElement.style.setProperty('--env-color',hex);
    document.documentElement.style.setProperty('--env-light',`rgb(${Math.min(r+25,255)},${Math.min(g+8,255)},${Math.min(b+8,255)})`);
    document.documentElement.style.setProperty('--env-dark',`rgb(${Math.max(r-25,0)},${Math.max(g-8,0)},${Math.max(b-8,0)})`);
  }

  function pick(id,key,cb){
    $(id).addEventListener('click',e=>{
      const b=e.target.closest('button'); if(!b||!b.dataset[key]) return;
      $(id).querySelectorAll('button').forEach(x=>x.classList.remove('active'));
      b.classList.add('active'); cb(b.dataset[key]);
    });
  }
  pick('paperStyles','paper',p=>{ D.paper=p; refreshLetterPreview(); });
  pick('fontStyles','font',f=>{ D.font=f; refreshLetterPreview(); });
  pick('envTextures','texture',t=>{ D.texture=t; syncDecoPreview(); });
  pick('letterBorders','border',b=>{ D.letterBorder=b; refreshLetterPreview(); });

  // ===== Seal Picker =====
  function renderSealPicker(){
    const w=$('sealShapes'); w.innerHTML='';
    Object.keys(sealDesigns).forEach(key=>{
      const d=sealDesigns[key];
      const btn=document.createElement('button');
      btn.className='seal-pick-btn'+(key===D.seal?' active':'');
      btn.style.background=d.bg;
      btn.textContent=d.mark;
      btn.title=d.name;
      btn.onclick=()=>{
        w.querySelectorAll('.seal-pick-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active'); D.seal=key; syncDecoPreview();
      };
      w.appendChild(btn);
    });
  }

  // ===== Deco Preview =====
  function syncDecoPreview(){
    // Seal
    const seal=$('decoSeal'), d=sealDesigns[D.seal]||sealDesigns.classic;
    seal.style.background=d.bg;
    seal.textContent=d.mark;
    $('decoTo').textContent=D.to?'To. '+D.to:'To.';
    // Texture on deco envelope body
    const body=$('decoEnvelope').querySelector('.deco-env-body');
    const texMap={smooth:'',linen:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,.03) 2px,rgba(255,255,255,.03) 4px),repeating-linear-gradient(90deg,transparent,transparent 2px,rgba(255,255,255,.03) 2px,rgba(255,255,255,.03) 4px)',felt:'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'.6\' fill=\'rgba(255,255,255,0.04)\'/%3E%3C/svg%3E")',leather:'repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(0,0,0,.04) 3px,rgba(0,0,0,.04) 6px)',kraft:'repeating-linear-gradient(120deg,transparent,transparent 2px,rgba(255,255,255,.02) 2px,rgba(255,255,255,.02) 5px)',silk:'linear-gradient(135deg,rgba(255,255,255,.05) 0%,transparent 40%,rgba(255,255,255,.03) 60%,transparent 100%)',canvas:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.03) 3px,rgba(0,0,0,.03) 4px),repeating-linear-gradient(90deg,transparent,transparent 4px,rgba(0,0,0,.02) 4px,rgba(0,0,0,.02) 5px)',velvet:'radial-gradient(circle at 50% 50%,rgba(255,255,255,.06) 0%,transparent 70%)'};
    body.style.backgroundImage=texMap[D.texture]||'';
  }

  function refreshLetterPreview(){
    const el=$('decoLetter');
    el.style.background=D.paperColor;
    el.style.fontFamily="'"+D.font+"',cursive";
    el.style.color=D.inkColor;
    const patterns={none:'',lined:'repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(0,0,0,.06) 28px,rgba(0,0,0,.06) 29px)',dot:'radial-gradient(circle,rgba(0,0,0,.06) 1px,transparent 1px)',grid:'linear-gradient(rgba(0,0,0,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.05) 1px,transparent 1px)'};
    el.style.backgroundImage=patterns[D.paper]||'';
    el.style.backgroundSize=D.paper==='dot'?'16px 16px':D.paper==='grid'?'18px 18px':'';
    // Border
    el.className='deco-letter'+(D.letterBorder!=='none'?' border-'+D.letterBorder:'');
    $('decoLetterTo').textContent=D.to+'에게'; $('decoLetterTo').style.color=D.inkColor;
    $('decoLetterBody').textContent=D.body;
    $('decoLetterFrom').textContent=D.from+' 올림'; $('decoLetterFrom').style.color=D.inkColor;
  }

  function refreshDecoCanvases(){
    syncDecoPreview(); refreshLetterPreview();
    $('envColorPicker').value=D.envelopeColor;
    $('paperColorPicker').value=D.paperColor;
    $('inkColorPicker').value=D.inkColor;
    restoreStickers($('decoCanvasEnvelope'),D.stickers);
    restoreStickers($('decoCanvasLetter'),D.letterStickers);
    restorePhotos($('decoCanvasEnvelope'),D.photos);
    restorePhotos($('decoCanvasLetter'),D.letterPhotos);
  }

  // ===== Photo Upload =====
  $('photoInput').addEventListener('change',function(){
    Array.from(this.files).forEach(file=>{
      if(!file.type.startsWith('image/')) return;
      const reader=new FileReader();
      reader.onload=function(e){
        const dataUrl=e.target.result;
        const arr=decoTarget==='envelope'?D.photos:D.letterPhotos;
        const canvas=decoTarget==='envelope'?$('decoCanvasEnvelope'):$('decoCanvasLetter');
        const x=15+Math.random()*50, y=15+Math.random()*45;
        const rot=Math.round((Math.random()-.5)*12);
        arr.push({dataUrl,x,y,rot});
        addPhoto(canvas,dataUrl,x,y,rot,arr.length-1,arr);
      };
      reader.readAsDataURL(file);
    });
    this.value='';
  });

  function addPhoto(canvas,dataUrl,x,y,rot,idx,arr){
    const el=document.createElement('div');
    el.className='placed-photo';
    el.style.left=x+'%'; el.style.top=y+'%';
    el.style.setProperty('--rot',rot+'deg');
    el.dataset.idx=idx;
    const img=document.createElement('img');
    img.src=dataUrl;
    el.appendChild(img);
    el.addEventListener('dblclick',e=>{ e.stopPropagation(); arr[idx]=null; el.remove(); });
    setupDrag(el,canvas,arr);
    canvas.appendChild(el);
  }

  function restorePhotos(canvas,arr){
    canvas.querySelectorAll('.placed-photo').forEach(p=>p.remove());
    arr.forEach((p,i)=>{ if(p) addPhoto(canvas,p.dataUrl,p.x,p.y,p.rot||0,i,arr); });
  }

  // ===== Deco Tabs =====
  document.querySelector('.deco-tab-bar').addEventListener('click',e=>{
    const tab=e.target.closest('.deco-tab'); if(!tab) return;
    document.querySelectorAll('.deco-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active'); decoTarget=tab.dataset.target;
    $('decoCanvasEnvelope').style.display=decoTarget==='envelope'?'':'none';
    $('decoCanvasLetter').style.display=decoTarget==='letter'?'':'none';
  });

  // ===== Sticker Tabs + Placement =====
  $('stickerTabs').addEventListener('click',e=>{
    const tab=e.target.closest('.sticker-tab'); if(!tab) return;
    $('stickerTabs').querySelectorAll('.sticker-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active'); curTab=tab.dataset.tab; renderStickerTab(curTab);
  });
  function renderStickerTab(name){
    $('stickerPalette').innerHTML=(stickerData[name]||[]).map(e=>'<button class="sticker-btn" data-sticker="'+e+'">'+e+'</button>').join('');
  }

  $('stickerPalette').addEventListener('click',e=>{
    const btn=e.target.closest('.sticker-btn'); if(!btn) return;
    const emoji=btn.dataset.sticker;
    const arr=decoTarget==='envelope'?D.stickers:D.letterStickers;
    const canvas=decoTarget==='envelope'?$('decoCanvasEnvelope'):$('decoCanvasLetter');
    const x=15+Math.random()*65, y=15+Math.random()*60;
    arr.push({emoji,x,y}); addSticker(canvas,emoji,x,y,arr.length-1,arr);
  });

  function addSticker(canvas,emoji,x,y,idx,arr){
    const el=document.createElement('span'); el.className='placed-sticker'; el.textContent=emoji;
    el.style.left=x+'%'; el.style.top=y+'%'; el.dataset.idx=idx;
    el.addEventListener('dblclick',e=>{ e.stopPropagation(); arr[idx]=null; el.remove(); });
    setupDrag(el,canvas,arr); canvas.appendChild(el);
  }
  function restoreStickers(canvas,arr){
    canvas.querySelectorAll('.placed-sticker').forEach(s=>s.remove());
    arr.forEach((s,i)=>{ if(s) addSticker(canvas,s.emoji,s.x,s.y,i,arr); });
  }

  function setupDrag(el,canvas,arr){
    let dragging=false,ox=0,oy=0;
    function start(e){ e.preventDefault(); e.stopPropagation(); dragging=true; el.classList.add('dragging');
      const t=e.touches?e.touches[0]:e,r=el.getBoundingClientRect(); ox=t.clientX-r.left; oy=t.clientY-r.top; }
    function move(e){ if(!dragging)return; e.preventDefault();
      const t=e.touches?e.touches[0]:e,cr=canvas.getBoundingClientRect();
      let px=(t.clientX-cr.left-ox+el.offsetWidth/2)/cr.width*100;
      let py=(t.clientY-cr.top-oy+el.offsetHeight/2)/cr.height*100;
      el.style.left=Math.max(2,Math.min(96,px))+'%'; el.style.top=Math.max(2,Math.min(96,py))+'%'; }
    function end(){ if(!dragging)return; dragging=false; el.classList.remove('dragging');
      const idx=parseInt(el.dataset.idx);
      if(arr[idx]){ arr[idx].x=parseFloat(el.style.left); arr[idx].y=parseFloat(el.style.top); } }
    el.addEventListener('mousedown',start); el.addEventListener('touchstart',start,{passive:false});
    document.addEventListener('mousemove',move); document.addEventListener('touchmove',move,{passive:false});
    document.addEventListener('mouseup',end); document.addEventListener('touchend',end);
  }

  // ===== Build Envelope =====
  function buildEnvelope(interactive){
    const el=document.createElement('div');
    el.className='envelope-full tex-'+D.texture;
    const d=sealDesigns[D.seal]||sealDesigns.classic;

    const envSt=(D.stickers||[]).filter(Boolean).map(s=>
      '<span class="env-sticker" style="left:'+(s.x/100*300)+'px;top:'+(s.y/100*180)+'px">'+s.emoji+'</span>'
    ).join('');
    const envPh=(D.photos||[]).filter(Boolean).map(p=>
      '<div class="env-photo" style="left:'+(p.x/100*300)+'px;top:'+(p.y/100*180)+'px;transform:rotate('+(p.rot||0)+'deg)"><img src="'+p.dataUrl+'"></div>'
    ).join('');
    const letSt=(D.letterStickers||[]).filter(Boolean).map(s=>
      '<span class="letter-sticker" style="left:'+s.x+'%;top:'+s.y+'%">'+s.emoji+'</span>'
    ).join('');
    const letPh=(D.letterPhotos||[]).filter(Boolean).map(p=>
      '<div class="letter-photo" style="left:'+p.x+'%;top:'+p.y+'%;transform:rotate('+(p.rot||0)+'deg)"><img src="'+p.dataUrl+'"></div>'
    ).join('');

    const patCSS={none:'',lined:'background-image:repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(0,0,0,.06) 28px,rgba(0,0,0,.06) 29px);',dot:'background-image:radial-gradient(circle,rgba(0,0,0,.06) 1px,transparent 1px);background-size:16px 16px;',grid:'background-image:linear-gradient(rgba(0,0,0,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.05) 1px,transparent 1px);background-size:18px 18px;'};
    const borderCls=D.letterBorder!=='none'?' border-'+D.letterBorder:'';

    el.innerHTML=
      '<div class="env-inner"></div>'+
      '<div class="env-letter'+borderCls+'" style="background:'+D.paperColor+';'+(patCSS[D.paper]||'')+'position:relative">'+
        '<div class="env-letter-content" style="font-family:\''+D.font+'\',cursive;color:'+D.inkColor+'">'+
          '<p class="env-letter-greeting" style="color:'+D.inkColor+'">'+esc(D.to)+'에게</p>'+
          '<p class="env-letter-body">'+esc(D.body)+'</p>'+
          '<p class="env-letter-closing" style="color:'+D.inkColor+'">'+esc(D.from)+' 올림</p>'+
        '</div>'+letSt+letPh+
      '</div>'+
      '<div class="env-body"></div>'+
      '<div class="env-flap"><div class="env-flap-front"></div><div class="env-flap-back"></div></div>'+
      '<div class="env-seal" style="background:'+d.bg+'"><span class="seal-ring"></span><span class="seal-mark">'+d.mark+'</span></div>'+
      '<div class="env-to">To. '+esc(D.to)+'</div>'+envSt+envPh;

    if(interactive) wireEnvelope(el);
    return el;
  }

  function wireEnvelope(el){
    let state='closed';
    el.addEventListener('click',()=>{
      if(state!=='closed') return; state='animating';
      const seal=el.querySelector('.env-seal'), flap=el.querySelector('.env-flap'), letter=el.querySelector('.env-letter');
      spawnParticles(seal); seal.classList.add('cracked');
      setTimeout(()=>{ el.querySelector('.env-inner').classList.add('show'); flap.classList.add('open'); },600);
      setTimeout(()=>letter.classList.add('rising'),1600);
      setTimeout(()=>{
        state='open'; letter.classList.remove('rising'); letter.classList.add('expanded');
        const ov=document.createElement('div'); ov.className='overlay'; document.body.appendChild(ov);
        function close(){ letter.classList.remove('expanded'); ov.style.opacity='0'; ov.style.transition='opacity .4s';
          setTimeout(()=>{ ov.remove(); letter.classList.add('rising');
            const rb=$('btnReply'); if(rb) rb.style.display='inline-block'; },400); }
        ov.onclick=close; letter.onclick=e=>e.stopPropagation();
      },2800);
    });
  }

  function renderSendPreview(){ const w=$('sendPreview'); w.innerHTML=''; w.appendChild(buildEnvelope(true)); }

  $('btnCopyLink').onclick=()=>{
    const clean=Object.assign({},D,{stickers:(D.stickers||[]).filter(Boolean),letterStickers:(D.letterStickers||[]).filter(Boolean),photos:(D.photos||[]).filter(Boolean),letterPhotos:(D.letterPhotos||[]).filter(Boolean)});
    const bytes=new TextEncoder().encode(JSON.stringify(clean));
    let bin=''; bytes.forEach(b=>bin+=String.fromCharCode(b));
    const url=location.origin+location.pathname+'#letter='+btoa(bin);
    navigator.clipboard.writeText(url).then(toast).catch(()=>{
      const t=document.createElement('textarea'); t.value=url;
      document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); toast();
    });
  };
  function toast(){ const t=$('toast'); t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2500); }

  function renderReceive(){
    applyColor(D.envelopeColor);
    $('receiveToText').textContent=D.to+'님에게 편지가 도착했습니다';
    const scene=$('receiveScene'); scene.innerHTML=''; scene.appendChild(buildEnvelope(true));
    scene.addEventListener('click',()=>$('receiveHint').classList.add('hidden'),{once:true});
  }

  function spawnParticles(origin){
    const r=origin.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
    const d=sealDesigns[D.seal]||sealDesigns.classic;
    const m=d.bg.match(/#[0-9A-Fa-f]{6}/g); const color=m?m[1]||m[0]:'#8B0000';
    for(let i=0;i<12;i++){
      const p=document.createElement('div'); p.className='wax-particle'; p.style.background=color;
      const a=(Math.PI*2*i)/12+(Math.random()-.5)*.6,dist=20+Math.random()*50;
      p.style.left=cx+'px'; p.style.top=cy+'px';
      p.style.setProperty('--tx',Math.cos(a)*dist+'px'); p.style.setProperty('--ty',Math.sin(a)*dist+'px');
      const s=(3+Math.random()*5)+'px'; p.style.width=s; p.style.height=s;
      document.body.appendChild(p); setTimeout(()=>p.remove(),700);
    }
  }

  function esc(s){ const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }

  init();
});
