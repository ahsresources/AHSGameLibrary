(function () {
  // Step order matches the numbering: assets/img/stepN.png thumbnails, assets/N.mp4 videos (steps 4-5 use assets/4.jpg and 5.jpg)
  var STEPS = [
    'Look at price',
    'Take out money',
    'Walk to cashier',
    'Stand in line.<br>Wait for turn',
    'Put items on<br>conveyor belt',
    'Give money to cashier',
    'Take receipt and change (if any)',
    'Keep receipt and change in wallet',
    'Take your items'
  ];
  // Steps shown as a still picture instead of a video: step number -> file
  var STILLS = { 4: 'assets/4.jpg', 5: 'assets/5.jpg' };
  var plain = function (s) { return s.replace(/<br>/g, ' '); };

  var list = document.getElementById('steps');
  var dlg = document.getElementById('player');
  var video = document.getElementById('p-video');
  var missing = document.getElementById('p-missing');
  var still = document.getElementById('p-still');
  var current = 0, lastTrigger = null;

  var PLAY = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

  STEPS.forEach(function (label, i) {
    var n = i + 1;
    var li = document.createElement('li');
    li.className = 'step';
    li.innerHTML =
      '<button type="button" data-i="' + i + '" aria-label="Step ' + n + ': ' + plain(label) + '. Play video">' +
      '<span class="num" aria-hidden="true">' + n + '</span>' +
      '<span class="label">' + label + '</span>' +
      '<span class="pic"><img src="assets/img/step' + n + '.png" alt="" loading="lazy"></span>' +
      '<span class="play" aria-hidden="true"><span>' + PLAY + '</span></span>' +
      '</button>';
    list.appendChild(li);
  });

  var dots = document.getElementById('p-dots');
  STEPS.forEach(function () { dots.appendChild(document.createElement('i')); });

  function load(i) {
    current = i;
    var n = i + 1;
    document.getElementById('p-num').textContent = n;
    document.getElementById('p-title').textContent = plain(STEPS[i]);
    document.getElementById('p-prev').disabled = i === 0;
    document.getElementById('p-next').disabled = i === STEPS.length - 1;
    Array.prototype.forEach.call(dots.children, function (d, k) { d.classList.toggle('on', k === i); });

    missing.classList.remove('show');
    still.classList.remove('show');
    still.onerror = null; still.removeAttribute('src');
    video.onerror = null;
    video.pause(); video.removeAttribute('src'); video.load();

    if (STILLS[n]) {
      video.style.visibility = 'hidden';
      still.onerror = showMissing;
      still.alt = plain(STEPS[i]);
      still.src = STILLS[n];
      still.classList.add('show');
      return;
    }
    video.style.visibility = 'visible';
    video.src = 'assets/' + n + '.mp4';
    video.onerror = showMissing;
    var p = video.play();
    if (p && p.catch) p.catch(function () { /* autoplay blocked: controls remain */ });
  }

  function showMissing() {
    var n = current + 1;
    document.getElementById('p-missing-img').src = 'assets/img/step' + n + '.png';
    document.getElementById('p-missing-f').textContent = STILLS[n] || 'assets/' + n + '.mp4';
    document.getElementById('p-missing-t').textContent = STILLS[n] ? 'Picture coming soon' : 'Video coming soon';
    still.classList.remove('show');
    missing.classList.add('show');
    video.style.visibility = 'hidden';
  }

  list.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-i]');
    if (!b) return;
    lastTrigger = b;
    load(+b.dataset.i);
    if (!dlg.open) dlg.showModal();
  });

  document.getElementById('p-prev').addEventListener('click', function () { if (current > 0) load(current - 1); });
  document.getElementById('p-next').addEventListener('click', function () { if (current < STEPS.length - 1) load(current + 1); });
  document.getElementById('p-close').addEventListener('click', function () { dlg.close(); });

  // Click on the backdrop closes the dialog
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  dlg.addEventListener('close', function () {
    video.pause();
    video.removeAttribute('src');
    video.load();
    if (lastTrigger) lastTrigger.focus();
  });

  dlg.addEventListener('keydown', function (e) {
    if (e.target === video) return;
    if (e.key === 'ArrowRight' && current < STEPS.length - 1) load(current + 1);
    if (e.key === 'ArrowLeft' && current > 0) load(current - 1);
  });
})();
