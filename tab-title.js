(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
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
