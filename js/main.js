document.addEventListener('DOMContentLoaded', () => {

  // ===== 봉투 잠금 장식 =====
  const sealOptions = {
    'tape-pink':   {type:'tape', color:'rgba(245,180,190,0.7)', label:'핑크'},
    'tape-mint':   {type:'tape', color:'rgba(170,215,195,0.7)', label:'민트'},
    'tape-cream':  {type:'tape', color:'rgba(245,230,200,0.7)', label:'크림'},
    'tape-brown':  {type:'tape', color:'rgba(195,170,135,0.7)', label:'크래프트'},
    'tape-blue':   {type:'tape', color:'rgba(180,200,230,0.7)', label:'블루'},
    'tape-lavender':{type:'tape',color:'rgba(210,190,230,0.7)', label:'라벤더'},
    'tape-gold':   {type:'tape', color:'rgba(225,200,130,0.6)', label:'골드'},
    'tape-white':  {type:'tape', color:'rgba(255,255,255,0.6)', label:'화이트'},
    'sticker-heart':  {type:'sticker', emoji:'❤️', label:'하트'},
    'sticker-kiss':   {type:'sticker', emoji:'💋', label:'키스'},
    'sticker-star':   {type:'sticker', emoji:'⭐', label:'별'},
    'sticker-flower': {type:'sticker', emoji:'🌸', label:'벚꽃'},
    'sticker-bow':    {type:'sticker', emoji:'🎀', label:'리본'},
    'sticker-letter': {type:'sticker', emoji:'💌', label:'편지'},
    'sticker-bear':   {type:'sticker', emoji:'🧸', label:'곰돌이'},
    'sticker-clover': {type:'sticker', emoji:'🍀', label:'클로버'},
    'sticker-butterfly':{type:'sticker',emoji:'🦋', label:'나비'},
    'sticker-sparkle': {type:'sticker', emoji:'✨', label:'반짝'},
    'sticker-rose':   {type:'sticker', emoji:'🌹', label:'장미'},
    'sticker-moon':   {type:'sticker', emoji:'🌙', label:'달'},
    'label-love':     {type:'label', text:'LOVE', label:'LOVE'},
    'label-foryou':   {type:'label', text:'For You', label:'For You'},
    'label-xo':       {type:'label', text:'XO', label:'XO'},
    'label-merci':    {type:'label', text:'Merci', label:'Merci'},
    'label-thankyou': {type:'label', text:'Thank You', label:'Thank You'},
    'label-sealed':   {type:'label', text:'Sealed with ♡', label:'Sealed'},
    'none':           {type:'none', label:'없음'}
  };
  let sealTypeTab = 'tape';

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

  const D = {
    to:'', body:'', from:'',
    envelopeColor:'#741518', paperColor:'#FFF8E7', inkColor:'#2C1810',
    paper:'none', seal:'tape-pink', font:'Nanum Pen Script',
    texture:'smooth', letterBorder:'none',
    stickers:[], letterStickers:[], photos:[], letterPhotos:[]
  };
  let curTab='love', decoTarget='envelope';

  function $(id){ return document.getElementById(id); }

  const pages=document.querySelectorAll('.page');
  function showPage(id){
    pages.forEach(p=>p.classList.remove('active'));
    $(id).classList.add('active'); window.scrollTo(0,0);
    if(id==='pageDecorate'){ renderStickerTab(curTab); refreshDecoCanvases(); }
  }

  function init(){
    const h=location.hash;
    if(h.startsWith('#letter=')){
      try{
        const bin=atob(h.slice(8));
        const bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));
        const data=JSON.parse(new TextDecoder().decode(bytes));
        Object.assign(D,data);
        ['stickers','letterStickers','photos','letterPhotos'].forEach(k=>{ if(!D[k]) D[k]=[]; });
        showPage('pageReceive'); renderReceive(); return;
      }catch(e){}
    }
    showPage('pageLanding'); renderSealPicker(); renderStickerTab('love');
  }

  // Nav
  $('btnStart').onclick=()=>showPage('pageWrite');
  $('btnBackToLanding').onclick=()=>showPage('pageLanding');
  $('btnBackToWrite').onclick=()=>showPage('pageWrite');
  $('btnBackToDecorate').onclick=()=>showPage('pageDecorate');
  $('btnReplay').onclick=()=>renderSendPreview();
  $('btnToDecorate').onclick=()=>{
    D.to=$('recipientName').value.trim(); D.body=$('letterContent').value.trim(); D.from=$('senderName').value.trim();
    letterPreviewInited=false;
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

  // Color pickers
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

  // 잠금 장식 타입 탭
  document.querySelector('.seal-type-tabs').addEventListener('click',e=>{
    const tab=e.target.closest('.seal-type-tab'); if(!tab) return;
    document.querySelectorAll('.seal-type-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    sealTypeTab=tab.dataset.stype;
    if(sealTypeTab==='none'){ D.seal='none'; syncDecoPreview(); }
    renderSealPicker();
  });

  function renderSealPicker(){
    const w=$('sealPicker'); w.innerHTML='';
    if(sealTypeTab==='none') return;
    Object.keys(sealOptions).forEach(key=>{
      const o=sealOptions[key];
      if(o.type!==sealTypeTab) return;
      const btn=document.createElement('button');
      btn.className='seal-pick-btn seal-pick-btn--'+o.type+(key===D.seal?' active':'');
      if(o.type==='tape') btn.style.background=o.color;
      else if(o.type==='sticker') btn.textContent=o.emoji;
      else if(o.type==='label') btn.textContent=o.text;
      btn.title=o.label;
      btn.onclick=()=>{
        w.querySelectorAll('.seal-pick-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active'); D.seal=key; syncDecoPreview();
      };
      w.appendChild(btn);
    });
  }

  // Deco preview
  const texMap={smooth:'',linen:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,.03) 2px,rgba(255,255,255,.03) 4px),repeating-linear-gradient(90deg,transparent,transparent 2px,rgba(255,255,255,.03) 2px,rgba(255,255,255,.03) 4px)',felt:'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'.6\' fill=\'rgba(255,255,255,0.04)\'/%3E%3C/svg%3E")',leather:'repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(0,0,0,.04) 3px,rgba(0,0,0,.04) 6px)',kraft:'repeating-linear-gradient(120deg,transparent,transparent 2px,rgba(255,255,255,.02) 2px,rgba(255,255,255,.02) 5px)',silk:'linear-gradient(135deg,rgba(255,255,255,.05) 0%,transparent 40%,rgba(255,255,255,.03) 60%,transparent 100%)',canvas:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.03) 3px,rgba(0,0,0,.03) 4px),repeating-linear-gradient(90deg,transparent,transparent 4px,rgba(0,0,0,.02) 4px,rgba(0,0,0,.02) 5px)',velvet:'radial-gradient(circle at 50% 50%,rgba(255,255,255,.06) 0%,transparent 70%)',denim:'repeating-linear-gradient(30deg,transparent,transparent 1px,rgba(255,255,255,.03) 1px,rgba(255,255,255,.03) 3px),repeating-linear-gradient(150deg,transparent,transparent 1px,rgba(0,0,0,.03) 1px,rgba(0,0,0,.03) 3px)',wood:'repeating-linear-gradient(0deg,transparent,transparent 8px,rgba(0,0,0,.04) 8px,rgba(0,0,0,.04) 9px,transparent 9px,transparent 12px)',marble:'radial-gradient(ellipse at 20% 50%,rgba(255,255,255,.06),transparent 50%),radial-gradient(ellipse at 80% 20%,rgba(255,255,255,.04),transparent 40%)',corduroy:'repeating-linear-gradient(90deg,transparent,transparent 3px,rgba(0,0,0,.05) 3px,rgba(0,0,0,.05) 4px)',paper:'url("data:image/svg+xml,%3Csvg width=\'8\' height=\'8\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 4h8M4 0v8\' stroke=\'rgba(255,255,255,0.03)\' stroke-width=\'.5\'/%3E%3C/svg%3E")',knit:'repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(255,255,255,.03) 4px,rgba(255,255,255,.03) 5px),repeating-linear-gradient(90deg,transparent,transparent 6px,rgba(0,0,0,.02) 6px,rgba(0,0,0,.02) 7px)',sand:'url("data:image/svg+xml,%3Csvg width=\'5\' height=\'5\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'2\' cy=\'3\' r=\'.4\' fill=\'rgba(255,255,255,0.05)\'/%3E%3Ccircle cx=\'4\' cy=\'1\' r=\'.3\' fill=\'rgba(0,0,0,0.04)\'/%3E%3C/svg%3E")',noise:'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'1\' cy=\'1\' r=\'.5\' fill=\'rgba(255,255,255,0.04)\'/%3E%3Ccircle cx=\'4\' cy=\'4\' r=\'.4\' fill=\'rgba(0,0,0,0.03)\'/%3E%3C/svg%3E")'};

  function buildSealEl(sealKey) {
    const o = sealOptions[sealKey];
    if(!o || o.type==='none') return '';
    if(o.type==='tape')
      return '<div class="env-seal env-seal-tape" style="background:'+o.color+'"></div>';
    if(o.type==='sticker')
      return '<div class="env-seal env-seal-sticker">'+o.emoji+'</div>';
    if(o.type==='label')
      return '<div class="env-seal env-seal-label">'+o.text+'</div>';
    return '';
  }

  function renderDecoSeal(){
    const el=$('decoSeal');
    const o=sealOptions[D.seal];
    el.innerHTML='';
    el.style.cssText='position:absolute;left:50%;transform:translateX(-50%);z-index:2;';
    if(!o||o.type==='none') return;
    if(o.type==='tape'){
      el.style.top='80px';
      el.innerHTML='<div style="width:60px;height:16px;border-radius:2px;opacity:.85;background:'+o.color+';box-shadow:0 1px 2px rgba(0,0,0,.1);transform:rotate(-2deg)"></div>';
    } else if(o.type==='sticker'){
      el.style.top='70px';
      el.innerHTML='<div style="width:30px;height:30px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 1px 4px rgba(0,0,0,.12)">'+o.emoji+'</div>';
    } else if(o.type==='label'){
      el.style.top='80px';
      el.innerHTML='<div style="padding:3px 10px;background:#fff;border-radius:2px;font-size:8px;letter-spacing:1px;color:#777;box-shadow:0 1px 3px rgba(0,0,0,.1);font-family:Pretendard,sans-serif">'+o.text+'</div>';
    }
  }

  function syncDecoPreview(){
    renderDecoSeal();
    $('decoTo').textContent=D.to?'To. '+D.to:'To.';
    $('decoEnvelope').querySelector('.deco-env-body').style.backgroundImage=texMap[D.texture]||'';
  }

  const PAT={
    none:['',''], lined:['repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(0,0,0,.06) 28px,rgba(0,0,0,.06) 29px)',''],
    dot:['radial-gradient(circle,rgba(0,0,0,.06) 1px,transparent 1px)','16px 16px'],
    grid:['linear-gradient(rgba(0,0,0,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.05) 1px,transparent 1px)','18px 18px'],
    check:['linear-gradient(45deg,rgba(0,0,0,.04) 25%,transparent 25%,transparent 75%,rgba(0,0,0,.04) 75%),linear-gradient(45deg,rgba(0,0,0,.04) 25%,transparent 25%,transparent 75%,rgba(0,0,0,.04) 75%)','20px 20px'],
    diamond:['linear-gradient(45deg,rgba(0,0,0,.04) 25%,transparent 25%),linear-gradient(-45deg,rgba(0,0,0,.04) 25%,transparent 25%),linear-gradient(45deg,transparent 75%,rgba(0,0,0,.04) 75%),linear-gradient(-45deg,transparent 75%,rgba(0,0,0,.04) 75%)','16px 16px'],
    wave:['repeating-linear-gradient(0deg,transparent,transparent 14px,rgba(0,0,0,.04) 14px,rgba(0,0,0,.04) 15px)',''],
    cross:['url("data:image/svg+xml,%3Csvg width=\'16\' height=\'16\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M8 3v10M3 8h10\' stroke=\'rgba(0,0,0,0.05)\' stroke-width=\'.7\'/%3E%3C/svg%3E")','16px 16px'],
    zigzag:['url("data:image/svg+xml,%3Csvg width=\'20\' height=\'10\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 5l5-4 5 4 5-4 5 4\' fill=\'none\' stroke=\'rgba(0,0,0,0.05)\' stroke-width=\'.7\'/%3E%3C/svg%3E")','20px 10px'],
    star:['url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'10\' y=\'14\' text-anchor=\'middle\' font-size=\'8\' fill=\'rgba(0,0,0,0.04)\'%3E✦%3C/text%3E%3C/svg%3E")','20px 20px'],
    heart:['url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'10\' y=\'14\' text-anchor=\'middle\' font-size=\'8\' fill=\'rgba(0,0,0,0.04)\'%3E♡%3C/text%3E%3C/svg%3E")','20px 20px'],
    stripe:['repeating-linear-gradient(45deg,transparent,transparent 6px,rgba(0,0,0,.04) 6px,rgba(0,0,0,.04) 7px)','']
  };
  function patCSS(p){ const v=PAT[p]||PAT.none; return (v[0]?'background-image:'+v[0]+';':'')+(v[1]?'background-size:'+v[1]+';':''); }

  let letterPreviewInited = false;

  function refreshLetterPreview(){
    const el=$('decoLetter');
    el.style.background=D.paperColor;
    el.style.fontFamily="'"+D.font+"',cursive";
    el.style.color=D.inkColor;
    const v=PAT[D.paper]||PAT.none;
    el.style.backgroundImage=v[0]; el.style.backgroundSize=v[1];
    el.className='deco-letter'+(D.letterBorder!=='none'?' border-'+D.letterBorder:'');
    $('decoLetterTo').style.color=D.inkColor;
    $('decoLetterFrom').style.color=D.inkColor;

    if(!letterPreviewInited){
      $('decoLetterTo').textContent=D.to+'에게';
      $('decoLetterBody').textContent=D.body;
      $('decoLetterFrom').textContent=D.from+' 올림';
      letterPreviewInited=true;
    }
  }

  function syncLetterEdits(){
    const toText=$('decoLetterTo').textContent.replace(/에게$/,'').trim();
    const bodyText=$('decoLetterBody').textContent.trim();
    const fromText=$('decoLetterFrom').textContent.replace(/\s*올림$/,'').trim();
    if(toText) D.to=toText;
    if(bodyText) D.body=bodyText;
    if(fromText) D.from=fromText;
  }

  $('decoLetterTo').addEventListener('blur', syncLetterEdits);
  $('decoLetterBody').addEventListener('blur', syncLetterEdits);
  $('decoLetterFrom').addEventListener('blur', syncLetterEdits);

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

  // Photo upload
  $('photoInput').addEventListener('change',function(){
    Array.from(this.files).forEach(file=>{
      if(!file.type.startsWith('image/')) return;
      resizeImage(file,400,function(dataUrl){
        const arr=decoTarget==='envelope'?D.photos:D.letterPhotos;
        const canvas=decoTarget==='envelope'?$('decoCanvasEnvelope'):$('decoCanvasLetter');
        const x=15+Math.random()*50, y=15+Math.random()*45;
        const rot=Math.round((Math.random()-.5)*12);
        arr.push({dataUrl,x,y,rot});
        addPhoto(canvas,dataUrl,x,y,rot,arr.length-1,arr);
      });
    });
    this.value='';
  });

  function resizeImage(file,maxW,cb){
    const img=new Image();
    img.onload=function(){
      const c=document.createElement('canvas');
      let w=img.width, h=img.height;
      if(w>maxW){ h=Math.round(h*maxW/w); w=maxW; }
      c.width=w; c.height=h;
      c.getContext('2d').drawImage(img,0,0,w,h);
      cb(c.toDataURL('image/jpeg',0.7));
    };
    img.src=URL.createObjectURL(file);
  }

  function addPhoto(canvas,dataUrl,x,y,rot,idx,arr){
    const el=document.createElement('div');
    el.className='placed-photo'; el.style.left=x+'%'; el.style.top=y+'%';
    el.style.setProperty('--rot',rot+'deg'); el.dataset.idx=idx;
    const img=document.createElement('img'); img.src=dataUrl; el.appendChild(img);
    el.addEventListener('dblclick',e=>{ e.stopPropagation(); arr[idx]=null; el.remove(); });
    setupDrag(el,canvas,arr); canvas.appendChild(el);
  }

  function restorePhotos(canvas,arr){
    canvas.querySelectorAll('.placed-photo').forEach(p=>p.remove());
    arr.forEach((p,i)=>{ if(p) addPhoto(canvas,p.dataUrl,p.x,p.y,p.rot||0,i,arr); });
  }

  // Deco tabs
  document.querySelector('.deco-tab-bar').addEventListener('click',e=>{
    const tab=e.target.closest('.deco-tab'); if(!tab) return;
    document.querySelectorAll('.deco-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active'); decoTarget=tab.dataset.target;
    $('decoCanvasEnvelope').style.display=decoTarget==='envelope'?'':'none';
    $('decoCanvasLetter').style.display=decoTarget==='letter'?'':'none';
  });

  // Sticker tabs + placement
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
    const arr=decoTarget==='envelope'?D.stickers:D.letterStickers;
    const canvas=decoTarget==='envelope'?$('decoCanvasEnvelope'):$('decoCanvasLetter');
    const x=15+Math.random()*65, y=15+Math.random()*60;
    arr.push({emoji:btn.dataset.sticker,x,y}); addSticker(canvas,btn.dataset.sticker,x,y,arr.length-1,arr);
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

    const borderCls=D.letterBorder!=='none'?' border-'+D.letterBorder:'';

    el.innerHTML=
      '<div class="env-inner"></div>'+
      '<div class="env-letter'+borderCls+'" style="background:'+D.paperColor+';'+patCSS(D.paper)+'position:relative">'+
        '<div class="env-letter-content" style="font-family:\''+D.font+'\',cursive;color:'+D.inkColor+'">'+
          '<p class="env-letter-greeting" style="color:'+D.inkColor+'">'+esc(D.to)+'에게</p>'+
          '<p class="env-letter-body">'+esc(D.body)+'</p>'+
          '<p class="env-letter-closing" style="color:'+D.inkColor+'">'+esc(D.from)+' 올림</p>'+
        '</div>'+letSt+letPh+
      '</div>'+
      '<div class="env-body"></div>'+
      '<div class="env-flap"><div class="env-flap-front"></div></div>'+
      buildSealEl(D.seal)+
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
    const color=D.envelopeColor;
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
