document.addEventListener('DOMContentLoaded', () => {

  // ===== State =====
  const letterData = {
    to: '',
    body: '',
    from: '',
    envelopeColor: '#741518',
    paper: 'cream',
    seal: 'heart',
    font: 'Nanum Pen Script'
  };

  const sealMap = {
    heart: '❤',
    star: '★',
    moon: '☾',
    flower: '✷'
  };

  // ===== Elements =====
  const pages = document.querySelectorAll('.page');
  const btnStart = document.getElementById('btnStart');
  const btnBackToLanding = document.getElementById('btnBackToLanding');
  const btnToDecorate = document.getElementById('btnToDecorate');
  const btnBackToWrite = document.getElementById('btnBackToWrite');
  const btnToPreview = document.getElementById('btnToPreview');
  const btnBackToDecorate = document.getElementById('btnBackToDecorate');
  const btnCopyLink = document.getElementById('btnCopyLink');
  const btnReplay = document.getElementById('btnReplay');
  const btnNewLetter = document.getElementById('btnNewLetter');
  const btnReply = document.getElementById('btnReply');

  const recipientName = document.getElementById('recipientName');
  const letterContent = document.getElementById('letterContent');
  const senderName = document.getElementById('senderName');
  const charCount = document.getElementById('charCount');

  // ===== Routing =====
  function showPage(id) {
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
  }

  function init() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#letter=')) {
      const encoded = hash.slice('#letter='.length);
      try {
        const binary = atob(encoded);
        const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
        const json = new TextDecoder().decode(bytes);
        const data = JSON.parse(json);
        Object.assign(letterData, data);
        showPage('pageReceive');
        renderReceivePage();
        return;
      } catch (e) {
        // invalid hash, go to landing
      }
    }
    showPage('pageLanding');
  }

  // ===== Navigation =====
  btnStart.addEventListener('click', () => showPage('pageWrite'));
  btnBackToLanding.addEventListener('click', () => showPage('pageLanding'));

  btnToDecorate.addEventListener('click', () => {
    letterData.to = recipientName.value.trim();
    letterData.body = letterContent.value.trim();
    letterData.from = senderName.value.trim();
    showPage('pageDecorate');
    updatePreview();
  });

  btnBackToWrite.addEventListener('click', () => showPage('pageWrite'));

  btnToPreview.addEventListener('click', () => {
    showPage('pageSend');
    renderSendPreview();
  });

  btnBackToDecorate.addEventListener('click', () => showPage('pageDecorate'));
  btnNewLetter.addEventListener('click', () => {
    window.location.hash = '';
    recipientName.value = '';
    letterContent.value = '';
    senderName.value = '';
    charCount.textContent = '0';
    btnToDecorate.disabled = true;
    showPage('pageLanding');
  });

  btnReply.addEventListener('click', () => {
    window.location.hash = '';
    showPage('pageLanding');
    setTimeout(() => btnStart.click(), 100);
  });

  // ===== Write: validation =====
  function validateWrite() {
    const valid = recipientName.value.trim() && letterContent.value.trim() && senderName.value.trim();
    btnToDecorate.disabled = !valid;
  }

  recipientName.addEventListener('input', validateWrite);
  letterContent.addEventListener('input', () => {
    charCount.textContent = letterContent.value.length;
    validateWrite();
  });
  senderName.addEventListener('input', validateWrite);

  // ===== Decorate: options =====
  function setupPicker(containerId, activeClass, dataAttr, callback) {
    const container = document.getElementById(containerId);
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      callback(btn.dataset[dataAttr]);
    });
  }

  setupPicker('envelopeColors', 'active', 'color', (color) => {
    letterData.envelopeColor = color;
    applyEnvelopeColor(color);
    updatePreview();
  });

  setupPicker('paperStyles', 'active', 'paper', (paper) => {
    letterData.paper = paper;
    updatePreview();
  });

  setupPicker('sealShapes', 'active', 'seal', (seal) => {
    letterData.seal = seal;
    updatePreview();
  });

  setupPicker('fontStyles', 'active', 'font', (font) => {
    letterData.font = font;
  });

  function applyEnvelopeColor(color) {
    const r = parseInt(color.slice(1,3), 16);
    const g = parseInt(color.slice(3,5), 16);
    const b = parseInt(color.slice(5,7), 16);
    const light = `rgb(${Math.min(r+20,255)},${Math.min(g+5,255)},${Math.min(b+5,255)})`;
    const dark = `rgb(${Math.max(r-20,0)},${Math.max(g-5,0)},${Math.max(b-5,0)})`;
    document.documentElement.style.setProperty('--envelope-color', color);
    document.documentElement.style.setProperty('--envelope-light', light);
    document.documentElement.style.setProperty('--envelope-dark', dark);
  }

  function updatePreview() {
    const previewSeal = document.getElementById('previewSeal');
    const previewTo = document.getElementById('previewTo');
    previewSeal.textContent = sealMap[letterData.seal] || sealMap.heart;
    previewTo.textContent = letterData.to ? 'To. ' + letterData.to : 'To. ';
  }

  // ===== Build full envelope HTML =====
  function buildEnvelope(interactive) {
    const div = document.createElement('div');
    div.className = 'envelope-full';
    div.innerHTML = `
      <div class="env-letter paper-${letterData.paper}">
        <div class="env-letter-content" style="font-family:'${letterData.font}',cursive">
          <p class="env-letter-greeting">${letterData.to}에게</p>
          <p class="env-letter-body">${escapeHtml(letterData.body)}</p>
          <p class="env-letter-closing">${letterData.from} 올림</p>
        </div>
      </div>
      <div class="env-body"></div>
      <div class="env-flap"><div class="env-flap-back"></div></div>
      <div class="env-seal">${sealMap[letterData.seal] || sealMap.heart}</div>
      <div class="env-to">To. ${escapeHtml(letterData.to)}</div>
    `;

    if (interactive) {
      let state = 'closed';
      div.addEventListener('click', function handler() {
        if (state !== 'closed') return;
        state = 'opening';

        const seal = div.querySelector('.env-seal');
        const flap = div.querySelector('.env-flap');
        const letter = div.querySelector('.env-letter');

        spawnParticles(seal);
        setTimeout(() => seal.classList.add('cracked'), 100);
        setTimeout(() => flap.classList.add('open'), 500);
        setTimeout(() => letter.classList.add('rising'), 1200);
        setTimeout(() => {
          state = 'expanded';
          const overlay = document.createElement('div');
          overlay.className = 'overlay';
          document.body.appendChild(overlay);
          letter.classList.remove('rising');
          letter.classList.add('expanded');

          overlay.addEventListener('click', () => {
            letter.classList.remove('expanded');
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.4s';
            setTimeout(() => {
              overlay.remove();
              letter.classList.add('rising');
              const replyBtn = document.getElementById('btnReply');
              if (replyBtn) replyBtn.style.display = 'inline-block';
            }, 400);
          });
        }, 2200);
      });
    }
    return div;
  }

  function resetEnvelope(container) {
    container.innerHTML = '';
    const env = buildEnvelope(true);
    container.appendChild(env);
  }

  // ===== Send Preview =====
  function renderSendPreview() {
    const wrap = document.getElementById('sendPreview');
    wrap.innerHTML = '';
    const env = buildEnvelope(true);
    wrap.appendChild(env);
  }

  btnReplay.addEventListener('click', () => renderSendPreview());

  // ===== Copy Link =====
  btnCopyLink.addEventListener('click', () => {
    const payload = JSON.stringify(letterData);
    const bytes = new TextEncoder().encode(payload);
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    const encoded = btoa(binary);
    const base = window.location.origin + window.location.pathname;
    const url = base + '#letter=' + encoded;

    navigator.clipboard.writeText(url).then(() => {
      showToast();
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast();
    });
  });

  function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // ===== Receive Page =====
  function renderReceivePage() {
    applyEnvelopeColor(letterData.envelopeColor);

    const toText = document.getElementById('receiveToText');
    toText.textContent = letterData.to + '님에게 편지가 도착했습니다';

    const wrap = document.getElementById('receiveEnvelopeWrap');
    wrap.innerHTML = '';
    const env = buildEnvelope(true);
    wrap.appendChild(env);

    const hint = document.getElementById('receiveHint');
    env.addEventListener('click', () => hint.classList.add('hidden'), { once: true });
  }

  // ===== Particles =====
  function spawnParticles(origin) {
    const rect = origin.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
      const p = document.createElement('div');
      p.className = 'wax-particle';
      const angle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.5;
      const dist = 30 + Math.random() * 40;
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
      const size = (4 + Math.random() * 4) + 'px';
      p.style.width = size;
      p.style.height = size;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 600);
    }
  }

  // ===== Util =====
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ===== Init =====
  init();
});
