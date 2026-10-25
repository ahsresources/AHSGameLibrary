(() => {
  'use strict';

  const $ = s => document.querySelector(s);
  const state = {
    cat: null,          // id of open category
    group: null,        // id of open group
    picks: [],          // chosen items, in the order chosen
    photo: null,        // data URL
    speakTaps: true
  };

  const catById = id => CATEGORIES.find(c => c.id === id);
  const groupOf = (cat, id) => cat.groups.find(g => g.id === id);

  /* ------------------------------------------------------------ Theme */
  function applyTheme(c) {
    const r = document.documentElement.style;
    const bgL = c.bgL ?? 97, aL = c.aL ?? 62, sL = c.sL ?? 36;
    r.setProperty('--bg',     `hsl(${c.h} ${c.S}% ${bgL}%)`);
    r.setProperty('--soft',   `hsl(${c.h} ${c.S * .85}% ${bgL - 5}%)`);
    r.setProperty('--mid',    `hsl(${c.h} ${c.S * .7}% ${bgL - 15}%)`);
    r.setProperty('--accent', `hsl(${c.h} ${c.S * .6}% ${aL}%)`);
    r.setProperty('--strong', `hsl(${c.h} ${c.S * .5}% ${sL}%)`);
    r.setProperty('--btn',    `hsl(${c.h} ${c.S * .55}% ${sL + 8}%)`);
    const meta = document.querySelector('meta[name=theme-color]');
    if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue('--soft');
  }

  /* ------------------------------------------------------------ Speech */
  const synth = window.speechSynthesis;
  function pickVoice() {
    const v = synth ? synth.getVoices() : [];
    return v.find(x => /^en[-_]SG/i.test(x.lang)) ||
           v.find(x => /^en[-_](GB|AU)/i.test(x.lang)) ||
           v.find(x => /^en/i.test(x.lang)) || null;
  }
  function makeUtterance(text) {
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = 'en'; }
    u.rate = 0.9;
    return u;
  }
  function say(text) {
    if (!synth) return;
    synth.cancel();
    synth.speak(makeUtterance(text));
  }

  /* ------------------------------------------------------------ Toast */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
  }

  /* ------------------------------------------------------------ Icons */
  function iconEl(item) {
    const wrap = document.createElement('span');
    wrap.className = 'ico';
    const fallback = () => {
      wrap.textContent = '';
      if (item.swatch) {
        const s = document.createElement('span');
        s.className = 'swatch';
        s.style.background = item.swatch;
        wrap.appendChild(s);
      } else {
        wrap.textContent = item.emoji || '⭐';
      }
    };
    if (item.icon) {
      const img = new Image();
      img.alt = '';
      img.draggable = false;
      img.onerror = fallback;
      img.src = `${ICON_DIR}${item.icon}.${ICON_EXT}`;
      wrap.appendChild(img);
    } else {
      fallback();
    }
    return wrap;
  }

  /* ------------------------------------------------------------ Picks */
  const isPicked = (gid, id) => state.picks.some(p => p.gid === gid && p.id === id);

  function addPick(group, item) {
    const slot = item.slot || group.id;
    if (group.mode === 'single' || group.mode === 'colour') {
      state.picks = state.picks.filter(p => p.slot !== slot);
    }
    state.picks.push({
      gid: group.id, cat: group.cat, id: item.id, label: item.label + (group.listSuffix || ''),
      phrase: item.phrase || item.label.toLowerCase(),
      slot, icon: item.icon, emoji: item.emoji, swatch: item.swatch, custom: !!item.custom
    });
    if (group.mode === 'colour') applyTheme(item);
  }

  function removePick(p) {
    state.picks = state.picks.filter(x => x !== p);
    if (p.gid === 'colours') applyTheme(DEFAULT_THEME);
  }

  function togglePick(group, item) {
    const existing = state.picks.find(p => p.gid === group.id && p.id === item.id);
    if (existing) removePick(existing); else addPick(group, item);
  }

  /* ------------------------------------------------------------ Tiles */
  function tile(item, opts, onClick) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tile' + (opts.on ? ' on' : '') + (opts.big ? ' big' : '') + (opts.add ? ' add' : '');
    if (opts.toggle) b.setAttribute('aria-pressed', opts.on ? 'true' : 'false');
    b.appendChild(iconEl(item));

    const lbl = document.createElement('span');
    lbl.className = 'lbl';
    lbl.textContent = item.label;
    b.appendChild(lbl);
    if (item.sub) {
      const sub = document.createElement('span');
      sub.className = 'sub';
      sub.textContent = item.sub;
      b.appendChild(sub);
    }
    if (opts.on) {
      const c = document.createElement('span');
      c.className = 'check'; c.textContent = '✓'; c.setAttribute('aria-hidden', 'true');
      b.appendChild(c);
    } else if (opts.count) {
      const n = document.createElement('span');
      n.className = 'num'; n.textContent = opts.count; n.setAttribute('aria-label', `${opts.count} chosen`);
      b.appendChild(n);
    } else if (opts.arrow) {
      const a = document.createElement('span');
      a.className = 'arrow'; a.textContent = '›'; a.setAttribute('aria-hidden', 'true');
      b.appendChild(a);
    }
    b.addEventListener('click', () => {
      if (state.speakTaps) say(item.label);
      onClick();
    });
    return b;
  }

  /* ------------------------------------------------------------ Board */
  function fitGrid(grid) {
    const n = grid.children.length;
    const cols = n <= 4 ? 2 : n <= 9 ? 3 : n <= 12 ? 4 : n <= 20 ? 5 : 6;
    grid.style.setProperty('--cols', cols);
    grid.style.setProperty('--rows', Math.max(1, Math.ceil(n / cols)));
  }

  function render() {
    const grid = $('#grid');
    grid.textContent = '';
    const cat = state.cat ? catById(state.cat) : null;
    const group = cat && state.group ? groupOf(cat, state.group) : null;

    renderCrumbs(cat, group);
    $('#backBtn').hidden = !cat;

    if (!cat) {
      $('#boardTitle').textContent = 'Tell us about you! Tap a picture.';
      grid.className = 'grid home';
      CATEGORIES.forEach(c => {
        const count = state.picks.filter(p => p.cat === c.id).length;
        grid.appendChild(tile(c, { big: true, count }, () => openCat(c)));
      });
      fitGrid(grid);
      return;
    }

    if (!group) {
      $('#boardTitle').textContent = cat.label;
      grid.className = 'grid';
      cat.groups.forEach(g => {
        const count = state.picks.filter(p => p.gid === g.id).length;
        grid.appendChild(tile(g, { count, arrow: !count }, () => { state.group = g.id; render(); }));
      });
      fitGrid(grid);
      return;
    }

    $('#boardTitle').textContent = group.label;
    grid.className = 'grid';

    group.items.forEach(item => {
      const on = isPicked(group.id, item.id);
      grid.appendChild(tile(item, { toggle: true, on }, () => { togglePick(group, item); refresh(); }));
    });

    // words the person typed themselves
    state.picks.filter(p => p.gid === group.id && p.custom).forEach(p => {
      const item = { label: p.label, icon: null, emoji: group.other ? group.other.emoji : '✏️' };
      grid.appendChild(tile(item, { toggle: true, on: true }, () => { removePick(p); refresh(); }));
    });

    if (group.other) {
      const o = group.other;
      grid.appendChild(tile(o, { add: true }, () => openTypeDialog(group)));
    }
    fitGrid(grid);
  }

  function renderCrumbs(cat, group) {
    const nav = $('#crumbs');
    nav.textContent = '';
    if (!cat) return;
    const addBtn = (text, fn) => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = text; b.addEventListener('click', fn);
      nav.appendChild(b);
    };
    const addSep = () => { const s = document.createElement('span'); s.className = 'sep'; s.textContent = '›'; nav.appendChild(s); };
    const addHere = text => { const s = document.createElement('span'); s.className = 'here'; s.textContent = text; nav.appendChild(s); };

    addBtn('Home', goHome);
    addSep();
    const direct = cat.groups.length === 1;
    if (direct || !group) { addHere(cat.label); return; }
    addBtn(cat.label, () => { state.group = null; render(); });
    addSep();
    addHere(group.label);
  }

  function openCat(c) {
    state.cat = c.id;
    state.group = c.groups.length === 1 ? c.groups[0].id : null;
    render();
    scrollBoardIntoView();
  }
  function goHome() { state.cat = null; state.group = null; render(); }
  function goBack() {
    const cat = state.cat ? catById(state.cat) : null;
    if (!cat) return;
    if (state.group && cat.groups.length > 1) { state.group = null; render(); }
    else goHome();
  }
  function scrollBoardIntoView() {
    if (window.matchMedia('(max-width: 900px)').matches) {
      $('.board').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ------------------------------------------------------------ Tray */
  function renderTray() {
    const chips = $('#chips');
    chips.textContent = '';
    $('#trayCount').textContent = state.picks.length;

    if (!state.picks.length) {
      const h = document.createElement('span');
      h.className = 'hint';
      h.textContent = 'Tap the pictures. What you choose will show here.';
      chips.appendChild(h);
    }
    state.picks.forEach(p => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.appendChild(iconEl({ icon: p.icon, emoji: p.emoji, swatch: p.swatch }));
      const t = document.createElement('span');
      t.textContent = p.label;
      chip.appendChild(t);
      const x = document.createElement('button');
      x.type = 'button';
      x.textContent = '×';
      x.setAttribute('aria-label', `Remove ${p.label}`);
      x.addEventListener('click', () => { removePick(p); refresh(); });
      chip.appendChild(x);
      chips.appendChild(chip);
    });
    updateMakeBtn();
  }

  function updateMakeBtn() {
    const hasInfo = state.picks.length || $('#fName').value.trim() || $('#fAge').value || $('#fSchool').value.trim();
    $('#makeProfile').disabled = !hasInfo;
  }

  function refresh() { render(); renderTray(); }

  new ResizeObserver(() => {
    document.documentElement.style.setProperty('--tray-h', $('#tray').offsetHeight + 'px');
  }).observe($('#tray'));

  /* ------------------------------------------------------------ Type-in dialog */
  const typeDialog = $('#typeDialog');
  let typeGroup = null;

  function openTypeDialog(group) {
    typeGroup = group;
    $('#typeTitle').textContent = group.other.title;
    const input = $('#typeInput');
    input.placeholder = group.other.placeholder;
    input.value = '';
    $('#typeAdded').textContent = '';
    typeDialog.showModal();
    input.focus();
  }

  $('#typeForm').addEventListener('submit', e => {
    e.preventDefault();
    const raw = $('#typeInput').value.trim();
    if (!raw) { $('#typeInput').focus(); return; }
    const text = typeGroup.lowerCustom ? raw.toLowerCase() : raw;
    const id = 'custom:' + text.toLowerCase();
    if (!isPicked(typeGroup.id, id)) {
      addPick(typeGroup, { id, label: text.charAt(0).toUpperCase() + text.slice(1), phrase: text, custom: true });
      refresh();
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = '✓ ' + text;
      $('#typeAdded').appendChild(chip);
    }
    $('#typeInput').value = '';
    $('#typeInput').focus();
  });
  $('#typeDone').addEventListener('click', () => {
    // add whatever is typed, then close
    if ($('#typeInput').value.trim()) $('#typeForm').requestSubmit();
    typeDialog.close();
  });

  /* ------------------------------------------------------------ Photo */
  const cameraDialog = $('#cameraDialog');
  const video = $('#video');
  let stream = null;

  function setPhoto(url) {
    state.photo = url;
    const img = $('#photoImg');
    img.hidden = !url;
    if (url) img.src = url;
    $('#photoPlaceholder').style.display = url ? 'none' : '';
    $('#photoFrame').classList.toggle('has-photo', !!url);
    $('#removePhoto').hidden = !url;
  }

  function squareFrom(source, w, h) {
    const size = Math.min(w, h), max = 640;
    const out = Math.min(size, max);
    const c = document.createElement('canvas');
    c.width = c.height = out;
    c.getContext('2d').drawImage(source, (w - size) / 2, (h - size) / 2, size, size, 0, 0, out, out);
    return c.toDataURL('image/jpeg', 0.88);
  }

  function stopStream() {
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    video.srcObject = null;
  }

  async function openCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast('No camera here. Please choose a picture instead.');
      $('#cameraInput').click();
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false });
      video.srcObject = stream;
      cameraDialog.showModal();
    } catch (err) {
      stopStream();
      toast('Camera is not available. Please choose a picture instead.');
      $('#cameraInput').click();
    }
  }

  $('#takePhoto').addEventListener('click', openCamera);
  $('#uploadPhoto').addEventListener('click', () => $('#fileInput').click());
  $('#removePhoto').addEventListener('click', () => setPhoto(null));
  $('#camCancel').addEventListener('click', () => cameraDialog.close());
  cameraDialog.addEventListener('close', stopStream);
  $('#camShoot').addEventListener('click', () => {
    if (!video.videoWidth) return;
    setPhoto(squareFrom(video, video.videoWidth, video.videoHeight));
    cameraDialog.close();
  });

  function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast('Please choose a picture file.'); return; }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setPhoto(squareFrom(img, img.naturalWidth, img.naturalHeight));
      URL.revokeObjectURL(url);
    };
    img.onerror = () => { URL.revokeObjectURL(url); toast('Sorry, that picture could not be opened.'); };
    img.src = url;
  }
  $('#fileInput').addEventListener('change', handleFile);
  $('#cameraInput').addEventListener('change', handleFile);

  /* ------------------------------------------------------------ Profile */
  const profileDialog = $('#profileDialog');
  let reading = false, readToken = 0;

  function currentProfile() {
    return { name: $('#fName').value, age: $('#fAge').value, school: $('#fSchool').value };
  }

  function showProfile() {
    const prof = currentProfile();
    const sentences = buildProfile(prof, state.picks);

    $('#profileName').textContent = prof.name.trim();
    $('#profileName').hidden = !prof.name.trim();

    const ph = $('#profilePhoto');
    ph.textContent = '';
    if (state.photo) {
      const img = new Image();
      img.alt = prof.name.trim() ? `Picture of ${prof.name.trim()}` : 'My picture';
      img.src = state.photo;
      ph.appendChild(img);
    } else {
      ph.textContent = '😊';
    }

    const p = $('#profileText');
    p.textContent = '';
    sentences.forEach((s, i) => {
      const span = document.createElement('span');
      span.className = 's';
      span.textContent = s;
      p.appendChild(span);
      if (i < sentences.length - 1) p.appendChild(document.createTextNode(' '));
    });

    setReadBtn(false);
    profileDialog.showModal();
  }

  function setReadBtn(isReading) {
    reading = isReading;
    $('#readBtn').textContent = isReading ? '⏹ Stop' : '🔊 Read to me';
  }

  function stopReading() {
    readToken++;
    if (synth) synth.cancel();
    document.querySelectorAll('#profileText .s.now').forEach(s => s.classList.remove('now'));
    setReadBtn(false);
  }

  function startReading() {
    if (!synth) { toast('Reading out loud does not work in this browser.'); return; }
    stopReading();
    const token = ++readToken;
    const spans = [...document.querySelectorAll('#profileText .s')];
    setReadBtn(true);
    let i = 0;
    const next = () => {
      if (token !== readToken) return;
      spans.forEach(s => s.classList.remove('now'));
      if (i >= spans.length) { setReadBtn(false); return; }
      spans[i].classList.add('now');
      spans[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      const u = makeUtterance(spans[i].textContent);
      u.onend = () => { i++; next(); };
      u.onerror = () => { if (token === readToken) stopReading(); };
      synth.speak(u);
    };
    next();
  }

  $('#makeProfile').addEventListener('click', showProfile);
  $('#readBtn').addEventListener('click', () => (reading ? stopReading() : startReading()));
  $('#closeProfile').addEventListener('click', () => profileDialog.close());
  profileDialog.addEventListener('close', stopReading);
  // clicking the dimmed area outside the profile goes back to editing
  profileDialog.addEventListener('click', e => { if (e.target === profileDialog) profileDialog.close(); });
  $('#printBtn').addEventListener('click', () => window.print());
  $('#copyBtn').addEventListener('click', async () => {
    const prof = currentProfile();
    const text = buildProfile(prof, state.picks).join(' ');
    try { await navigator.clipboard.writeText(text); toast('Copied!'); }
    catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast('Copied!'); } catch (_) { toast('Sorry, could not copy.'); }
      ta.remove();
    }
  });

  /* ------------------------------------------------------------ Misc */
  $('#backBtn').addEventListener('click', goBack);
  $('#speakToggle').addEventListener('change', e => {
    state.speakTaps = e.target.checked;
    if (!state.speakTaps && synth) synth.cancel();
  });
  ['#fName', '#fAge', '#fSchool'].forEach(s => $(s).addEventListener('input', updateMakeBtn));

  $('#startOver').addEventListener('click', () => {
    if (!confirm('Start again? This will clear everything.')) return;
    state.picks = [];
    ['#fName', '#fAge', '#fSchool'].forEach(s => { $(s).value = ''; });
    setPhoto(null);
    applyTheme(DEFAULT_THEME);
    goHome();
    renderTray();
  });

  if (synth) synth.getVoices(); // warm up the voice list

  applyTheme(DEFAULT_THEME);
  setPhoto(null);
  render();
  renderTray();
})();
