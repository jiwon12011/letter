document.addEventListener('DOMContentLoaded', () => {

  // ===== Seal Designs =====
  const sealDesigns = {
    heart: {
      name: '하트',
      w: 56, h: 52,
      clip: "path('M28 50C28 50 3 30 3 17C3 8 9 2 17 2C22 2 26 5 28 10C30 5 34 2 39 2C47 2 53 8 53 17C53 30 28 50 28 50Z')",
      bg: 'radial-gradient(circle at 38% 35%, #e25555, #8B0000 55%, #5a0000)',
      mark: '♡'
    },
    star: {
      name: '별',
      w: 56, h: 54,
      clip: 'polygon(50% 0%, 62% 35%, 100% 38%, 70% 60%, 80% 98%, 50% 75%, 20% 98%, 30% 60%, 0% 38%, 38% 35%)',
      bg: 'radial-gradient(circle at 38% 35%, #e8b830, #9A7B0A 55%, #5C4A00)',
      mark: '☆'
    },
    moon: {
      name: '달',
      w: 44, h: 52,
      clip: "path('M34 2C43 8 48 18 48 30C48 42 40 52 28 52C33 46 36 38 36 30C36 18 30 8 20 3C25 1 30 0 34 2Z')",
      bg: 'radial-gradient(circle at 42% 30%, #B8C9E0, #5A7599 55%, #2C3E56)',
      mark: '☽'
    },
    flower: {
      name: '꽃',
      w: 56, h: 56,
      clip: 'polygon(50% 0%, 64% 10%, 80% 2%, 90% 18%, 100% 35%, 90% 50%, 100% 65%, 90% 82%, 78% 98%, 62% 88%, 50% 100%, 38% 88%, 22% 98%, 10% 82%, 0% 65%, 10% 50%, 0% 35%, 10% 18%, 20% 2%, 36% 10%)',
      bg: 'radial-gradient(circle at 38% 35%, #F48FB1, #C2185B 55%, #880E4F)',
      mark: '❀'
    },
    diamond: {
      name: '다이아',
      w: 50, h: 58,
      clip: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      bg: 'radial-gradient(circle at 38% 35%, #CE93D8, #7B1FA2 55%, #4A148C)',
      mark: '◇'
    },
    clover: {
      name: '클로버',
      w: 54, h: 54,
      clip: "path('M27 0C31 0 35 5 35 12C41 5 47 5 50 9C53 14 50 20 44 23C50 26 53 32 50 37C47 41 41 41 35 34C35 41 31 46 27 46C23 46 19 41 19 34C13 41 7 41 4 37C1 32 4 26 10 23C4 20 1 14 4 9C7 5 13 5 19 12C19 5 23 0 27 0Z')",
      bg: 'radial-gradient(circle at 38% 35%, #66BB6A, #2E7D32 55%, #1B5E20)',
      mark: '♧'
    },
    cross: {
      name: '십자',
      w: 54, h: 54,
      clip: 'polygon(33% 0%, 67% 0%, 67% 33%, 100% 33%, 100% 67%, 67% 67%, 67% 100%, 33% 100%, 33% 67%, 0% 67%, 0% 33%, 33% 33%)',
      bg: 'radial-gradient(circle at 38% 35%, #d44, #8B0000 55%, #5a0000)',
      mark: '✚'
    },
    sun: {
      name: '태양',
      w: 58, h: 58,
      clip: 'polygon(50% 0%, 58% 20%, 75% 5%, 70% 26%, 93% 20%, 80% 38%, 100% 42%, 82% 52%, 95% 70%, 75% 65%, 80% 88%, 62% 76%, 55% 100%, 45% 76%, 30% 92%, 25% 70%, 5% 75%, 18% 55%, 0% 42%, 20% 36%, 5% 22%, 25% 26%, 22% 5%, 38% 22%)',
      bg: 'radial-gradient(circle at 38% 35%, #FFD54F, #F9A825 55%, #E65100)',
      mark: '☀'
    }
  };

  // ===== State =====
  const letterData = {
    to: '', body: '', from: '',
    envelopeColor: '#741518',
    paper: 'cream', seal: 'heart', font: 'Nanum Pen Script',
    stickers: []
  };

  const stickerData = {
    love: ['❤️','💕','💖','💗','💝','💘','💓','💞','💋','🥰','😘','🤗','💑','💏','🫶'],
    flower: ['🌸','🌷','🌹','🌺','🌻','🌼','💐','🌿','🍀','🍃','🌱','🪻','🪷','🌾','🍂','🍁','🎋','🌵'],
    animal: ['🦋','🐰','🐱','🐻','🐥','🦊','🐶','🐸','🦄','🕊️','🐝','🐞','🐧','🐨','🐹','🦢','🐇','🐻‍❄️'],
    sky: ['⭐','🌙','✨','🌈','☁️','❄️','🌟','💫','⚡','🌞','🌠','🪐','🔥','🌊','☀️','🌤️','🫧','💧'],
    food: ['☕','🍰','🧁','🍪','🍩','🍫','🎂','🍭','🍬','🧇','🍓','🍒','🫖','🍵','🥂','🍷','🧋','🍺'],
    deco: ['🎀','🎁','🎊','🎉','🎈','🎗️','📮','💌','🏷️','🧸','🪆','🎐','🪩','🎠','🪄','🎭','📿','🎪'],
    symbol: ['♠️','♥️','♦️','♣️','🔮','🪞','🕯️','💎','👑','🗝️','🪶','📜','♾️','⚜️','🛡️','⚔️','🔔','🏹']
  };

  let currentTab = 'love';

  function $(id) { return document.getElementById(id); }

  // ===== Pages =====
  const pages = document.querySelectorAll('.page');
  function showPage(id) {
    pages.forEach(p => p.classList.remove('active'));
    $(id).classList.add('active');
    window.scrollTo(0,0);
    if (id === 'pageDecorate') { renderStickerTab(currentTab); restoreStickers(); }
  }

  // ===== Init =====
  function init() {
    const h = location.hash;
    if (h.startsWith('#letter=')) {
      try {
        const bin = atob(h.slice(8));
        const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
        const data = JSON.parse(new TextDecoder().decode(bytes));
        Object.assign(letterData, data);
        if (!letterData.stickers) letterData.stickers = [];
        showPage('pageReceive');
        renderReceive();
        return;
      } catch(e) {}
    }
    showPage('pageLanding');
    renderSealPicker();
    renderStickerTab('love');
  }

  // ===== Nav =====
  $('btnStart').onclick = () => showPage('pageWrite');
  $('btnBackToLanding').onclick = () => showPage('pageLanding');
  $('btnBackToWrite').onclick = () => showPage('pageWrite');
  $('btnBackToDecorate').onclick = () => showPage('pageDecorate');
  $('btnReplay').onclick = () => renderSendPreview();

  $('btnToDecorate').onclick = () => {
    letterData.to   = $('recipientName').value.trim();
    letterData.body  = $('letterContent').value.trim();
    letterData.from  = $('senderName').value.trim();
    showPage('pageDecorate');
    syncDecoPreview();
  };

  $('btnToPreview').onclick = () => { showPage('pageSend'); renderSendPreview(); };

  $('btnNewLetter').onclick = () => {
    location.hash = '';
    $('recipientName').value = '';
    $('letterContent').value = '';
    $('senderName').value = '';
    $('charCount').textContent = '0';
    $('btnToDecorate').disabled = true;
    letterData.stickers = [];
    showPage('pageLanding');
  };

  $('btnReply').onclick = () => { location.hash = ''; showPage('pageWrite'); };

  // ===== Validation =====
  function validate() {
    $('btnToDecorate').disabled =
      !($('recipientName').value.trim() && $('letterContent').value.trim() && $('senderName').value.trim());
  }
  $('recipientName').oninput = validate;
  $('senderName').oninput = validate;
  $('letterContent').oninput = () => {
    $('charCount').textContent = $('letterContent').value.length;
    validate();
  };

  // ===== Pickers =====
  function picker(id, key, cb) {
    $(id).addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !b.dataset[key]) return;
      $(id).querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      cb(b.dataset[key]);
    });
  }

  picker('envelopeColors','color', c => { letterData.envelopeColor = c; applyColor(c); syncDecoPreview(); });
  picker('paperStyles','paper', p => { letterData.paper = p; });
  picker('fontStyles','font', f => { letterData.font = f; });

  function applyColor(hex) {
    const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
    document.documentElement.style.setProperty('--env-color', hex);
    document.documentElement.style.setProperty('--env-light',
      `rgb(${Math.min(r+25,255)},${Math.min(g+8,255)},${Math.min(b+8,255)})`);
    document.documentElement.style.setProperty('--env-dark',
      `rgb(${Math.max(r-25,0)},${Math.max(g-8,0)},${Math.max(b-8,0)})`);
  }

  // ===== Seal Picker =====
  function renderSealPicker() {
    const wrap = $('sealShapes');
    wrap.innerHTML = '';
    Object.keys(sealDesigns).forEach(key => {
      const d = sealDesigns[key];
      const btn = document.createElement('button');
      btn.className = 'seal-pick-btn' + (key === letterData.seal ? ' active' : '');
      btn.dataset.seal = key;

      const mini = document.createElement('div');
      mini.className = 'mini-seal';
      const scale = 32 / Math.max(d.w, d.h);
      const mw = Math.round(d.w * scale);
      const mh = Math.round(d.h * scale);
      mini.style.cssText = `width:${mw}px;height:${mh}px;background:${d.bg};clip-path:${d.clip};font-size:${Math.round(mw*0.35)}px;color:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;`;
      mini.textContent = d.mark;
      btn.appendChild(mini);

      btn.onclick = () => {
        wrap.querySelectorAll('.seal-pick-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        letterData.seal = key;
        syncDecoPreview();
      };

      wrap.appendChild(btn);
    });
  }

  // ===== Deco Preview =====
  function syncDecoPreview() {
    const seal = $('decoSeal');
    const d = sealDesigns[letterData.seal] || sealDesigns.heart;
    const scale = 36 / Math.max(d.w, d.h);
    seal.style.cssText = `
      position:absolute; bottom:42px; left:50%; transform:translateX(-50%);
      width:${Math.round(d.w*scale)}px; height:${Math.round(d.h*scale)}px;
      background:${d.bg}; clip-path:${d.clip};
      display:flex; align-items:center; justify-content:center;
      font-size:${Math.round(d.w*scale*0.3)}px; color:rgba(255,255,255,.2);
      z-index:2; filter:drop-shadow(0 2px 4px rgba(0,0,0,.35));
    `;
    seal.textContent = d.mark;
    $('decoTo').textContent = letterData.to ? 'To. ' + letterData.to : 'To.';
  }

  // ===== Sticker Tabs =====
  $('stickerTabs').addEventListener('click', e => {
    const tab = e.target.closest('.sticker-tab');
    if (!tab) return;
    $('stickerTabs').querySelectorAll('.sticker-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentTab = tab.dataset.tab;
    renderStickerTab(currentTab);
  });

  function renderStickerTab(name) {
    $('stickerPalette').innerHTML = (stickerData[name]||[]).map(e =>
      '<button class="sticker-btn" data-sticker="'+e+'">'+e+'</button>'
    ).join('');
  }

  // ===== Sticker Placement =====
  $('stickerPalette').addEventListener('click', e => {
    const btn = e.target.closest('.sticker-btn');
    if (!btn) return;
    const emoji = btn.dataset.sticker;
    const canvas = $('decorateCanvas');
    const x = 8 + Math.random()*78, y = 5 + Math.random()*82;
    letterData.stickers.push({ emoji, x, y });
    addSticker(canvas, emoji, x, y, letterData.stickers.length-1);
  });

  function addSticker(canvas, emoji, x, y, idx) {
    const el = document.createElement('span');
    el.className = 'placed-sticker';
    el.textContent = emoji;
    el.style.left = x+'%'; el.style.top = y+'%';
    el.onclick = e => { e.stopPropagation(); letterData.stickers[idx]=null; el.remove(); };
    canvas.appendChild(el);
  }

  function restoreStickers() {
    $('decorateCanvas').querySelectorAll('.placed-sticker').forEach(s => s.remove());
    letterData.stickers.forEach((s,i) => { if(s) addSticker($('decorateCanvas'),s.emoji,s.x,s.y,i); });
  }

  // ===== Build Envelope =====
  function applySealStyle(el, sealKey, size) {
    const d = sealDesigns[sealKey] || sealDesigns.heart;
    const scale = size / Math.max(d.w, d.h);
    const w = Math.round(d.w * scale);
    const h = Math.round(d.h * scale);
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    el.style.background = d.bg;
    el.style.clipPath = d.clip;
    el.style.fontSize = Math.round(w * 0.3) + 'px';
    el.textContent = d.mark;
  }

  function buildEnvelope(interactive) {
    const el = document.createElement('div');
    el.className = 'envelope-full';

    const stickers = (letterData.stickers||[]).filter(Boolean);
    const stickerEls = stickers.map(s =>
      '<span class="env-sticker" style="left:'+(s.x/100*300)+'px;top:'+(s.y/100*210)+'px">'+s.emoji+'</span>'
    ).join('');

    el.innerHTML =
      '<div class="env-inner"></div>' +
      '<div class="env-letter paper-'+letterData.paper+'">' +
        '<div class="env-letter-content" style="font-family:\''+letterData.font+'\',cursive">' +
          '<p class="env-letter-greeting">'+esc(letterData.to)+'에게</p>' +
          '<p class="env-letter-body">'+esc(letterData.body)+'</p>' +
          '<p class="env-letter-closing">'+esc(letterData.from)+' 올림</p>' +
        '</div>' +
      '</div>' +
      '<div class="env-body"></div>' +
      '<div class="env-flap"><div class="env-flap-front"></div><div class="env-flap-back"></div></div>' +
      '<div class="env-seal"></div>' +
      '<div class="env-to">To. '+esc(letterData.to)+'</div>' +
      stickerEls;

    applySealStyle(el.querySelector('.env-seal'), letterData.seal, 54);

    if (interactive) wireEnvelope(el);
    return el;
  }

  function wireEnvelope(el) {
    let state = 'closed';
    el.addEventListener('click', () => {
      if (state !== 'closed') return;
      state = 'animating';
      const seal = el.querySelector('.env-seal');
      const flap = el.querySelector('.env-flap');
      const letter = el.querySelector('.env-letter');

      spawnParticles(seal);
      seal.classList.add('cracked');
      setTimeout(() => flap.classList.add('open'), 500);
      setTimeout(() => letter.classList.add('rising'), 1400);
      setTimeout(() => {
        state = 'open';
        letter.classList.remove('rising');
        letter.classList.add('expanded');
        const ov = document.createElement('div');
        ov.className = 'overlay';
        document.body.appendChild(ov);
        function close() {
          letter.classList.remove('expanded');
          ov.style.opacity='0'; ov.style.transition='opacity .4s';
          setTimeout(() => {
            ov.remove(); letter.classList.add('rising');
            const rb=$('btnReply'); if(rb) rb.style.display='inline-block';
          }, 400);
        }
        ov.onclick = close;
        letter.onclick = e => e.stopPropagation();
      }, 2500);
    });
  }

  // ===== Send Preview =====
  function renderSendPreview() {
    const w=$('sendPreview'); w.innerHTML=''; w.appendChild(buildEnvelope(true));
  }

  // ===== Copy Link =====
  $('btnCopyLink').onclick = () => {
    const clean = Object.assign({}, letterData, { stickers:(letterData.stickers||[]).filter(Boolean) });
    const bytes = new TextEncoder().encode(JSON.stringify(clean));
    let bin=''; bytes.forEach(b => bin+=String.fromCharCode(b));
    const url = location.origin+location.pathname+'#letter='+btoa(bin);
    navigator.clipboard.writeText(url).then(toast).catch(() => {
      const t=document.createElement('textarea'); t.value=url;
      document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); toast();
    });
  };

  function toast() { const t=$('toast'); t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2500); }

  // ===== Receive =====
  function renderReceive() {
    applyColor(letterData.envelopeColor);
    $('receiveToText').textContent = letterData.to+'님에게 편지가 도착했습니다';
    const scene=$('receiveScene'); scene.innerHTML=''; scene.appendChild(buildEnvelope(true));
    const hint=$('receiveHint');
    scene.addEventListener('click', ()=>hint.classList.add('hidden'), {once:true});
  }

  // ===== Particles =====
  function spawnParticles(origin) {
    const r=origin.getBoundingClientRect();
    const cx=r.left+r.width/2, cy=r.top+r.height/2;
    const d = sealDesigns[letterData.seal] || sealDesigns.heart;
    const bgMatch = d.bg.match(/#[0-9A-Fa-f]{6}/g);
    const color = bgMatch ? bgMatch[1] || bgMatch[0] : '#8B0000';
    for(let i=0;i<12;i++){
      const p=document.createElement('div');
      p.className='wax-particle';
      p.style.background = color;
      const a=(Math.PI*2*i)/12+(Math.random()-.5)*.6;
      const dist=20+Math.random()*45;
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
