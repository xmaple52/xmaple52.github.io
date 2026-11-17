(() => {
  const dialog = document.getElementById('welcome-terminal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const storageKey = 'xmaple-terminal-entered';
  let entered = false;
  let closing = false;
  try { entered = sessionStorage.getItem(storageKey) === 'yes'; } catch {}

  function makeLeaf() {
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 250;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#fff';
    const base = { x: 120, y: 211 };
    const tips = [[24, 178], [18, 115], [63, 57], [120, 15], [177, 57], [222, 115], [216, 178]];
    tips.forEach(([x, y]) => {
      const dx = x - base.x;
      const dy = y - base.y;
      const length = Math.hypot(dx, dy);
      const normal = { x: -dy / length, y: dx / length };
      ctx.beginPath();
      ctx.moveTo(base.x, base.y);
      [1, -1].forEach(side => {
        for (let step = 0; step <= 20; step++) {
          const t = side === 1 ? step / 20 : 1 - step / 20;
          const tooth = step % 2 === 0 ? 1 : .65;
          const width = Math.sin(Math.PI * t) * length * .12 * tooth * side;
          ctx.lineTo(base.x + dx * t + normal.x * width, base.y + dy * t + normal.y * width);
        }
      });
      ctx.closePath();
      ctx.fill();
    });
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(120, 205);
    ctx.lineTo(120, 244);
    ctx.stroke();
    const pixels = ctx.getImageData(0, 0, 240, 250).data;
    const rows = [];
    const characters = ['·', ':', '+', '*'];
    for (let row = 0; row < 32; row++) {
      let line = '';
      for (let column = 0; column < 59; column++) {
        const x = Math.min(239, Math.round(column * 239 / 58));
        const y = Math.min(249, Math.round(row * 249 / 31));
        const alpha = pixels[(y * 240 + x) * 4 + 3];
        line += alpha > 100 ? characters[(column * 7 + row * 3) % characters.length] : ' ';
      }
      rows.push(line);
    }
    document.getElementById('terminal-leaf').textContent = rows.join('\n');
  }

  function finishEntry() {
    if (entered) return;
    entered = true;
    document.documentElement.classList.remove('intro-active');
    try { sessionStorage.setItem(storageKey, 'yes'); } catch {}
    document.dispatchEvent(new Event('xmaple:entered'));
  }

  function enterSite() {
    if (closing || !dialog.open) return;
    closing = true;
    if (reduceMotion.matches) {
      dialog.close();
    } else {
      dialog.classList.add('is-leaving');
      window.setTimeout(() => dialog.close(), 450);
    }
  }

  if (!entered && typeof dialog.showModal === 'function') {
    makeLeaf();
    document.documentElement.classList.add('intro-active');
    document.getElementById('terminal-enter').addEventListener('click', enterSite);
    document.getElementById('terminal-skip').addEventListener('click', enterSite);
    dialog.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        enterSite();
      }
    });
    dialog.addEventListener('close', finishEntry, { once: true });
    try {
      dialog.showModal();
      document.getElementById('terminal-enter').focus({ preventScroll: true });
    } catch {
      finishEntry();
    }
  }

  const originalTitle = document.title;
  const titles = ['@cryptoxmaple', 'xmaple52.github.io'];
  let phrase = 0;
  let position = 0;
  let deleting = false;
  let titleTimer;
  function tickTitle() {
    if (document.hidden || reduceMotion.matches) return;
    const text = titles[phrase];
    position += deleting ? -1 : 1;
    document.title = text.slice(0, Math.max(position, 0)) || '·';
    let delay = deleting ? 95 : 170;
    if (!deleting && position === text.length) {
      deleting = true;
      delay = 1700;
    } else if (deleting && position === 0) {
      deleting = false;
      phrase = (phrase + 1) % titles.length;
      delay = 420;
    }
    titleTimer = window.setTimeout(tickTitle, delay);
  }
  function updateTitleAnimation() {
    window.clearTimeout(titleTimer);
    if (document.hidden || reduceMotion.matches) {
      document.title = originalTitle;
    } else {
      titleTimer = window.setTimeout(tickTitle, 600);
    }
  }
  document.addEventListener('visibilitychange', updateTitleAnimation);
  reduceMotion.addEventListener('change', updateTitleAnimation);
  updateTitleAnimation();
})();
