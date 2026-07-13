/* ------------------------------------------------------------------
 * index.js — bootstrap for the animated ribbon background.
 *
 * - Finds every [data-ribbon] mount on the page.
 * - Only runs the WebGL version on desktop/laptop (>= 1024px). Below
 *   that, the static SVG fallback baked into the markup is shown and
 *   Three.js is never even downloaded (dynamic import inside mount()).
 * - Reads config from data-* attributes so colors/behaviour stay in
 *   the markup, matching the <AnimatedRibbon ... /> prop surface.
 * - Cleans up / re-mounts as the viewport crosses the breakpoint.
 *
 * Three.js is resolved through the import map declared in index.html.
 * ------------------------------------------------------------------ */

const DESKTOP_QUERY = '(min-width: 1024px)';
const THREE_URL = 'three';

function readOptions(el) {
  const d = el.dataset;
  const opts = {};
  if (d.speed) opts.speed = parseFloat(d.speed);
  if (d.lineCount) opts.lineCount = parseInt(d.lineCount, 10);
  if (d.intensity) opts.intensity = parseFloat(d.intensity);
  if (d.glow) opts.glowStrength = parseFloat(d.glow);
  if (d.mouse) opts.mouseInteraction = d.mouse !== 'false';
  if (d.additive) opts.additive = d.additive !== 'false';
  if (d.band) opts.height = parseFloat(d.band);
  const colors = {};
  if (d.primary) colors.primary = d.primary;
  if (d.secondary) colors.secondary = d.secondary;
  if (d.highlight) colors.highlight = d.highlight;
  if (Object.keys(colors).length) opts.colors = colors;
  return opts;
}

function setup(el) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  let instance = null;

  const mount = async () => {
    if (instance || !mq.matches) return;
    try {
      const THREE = await import(THREE_URL);
      const { AnimatedRibbon } = await import('./AnimatedRibbon.js');
      // Guard against a resize back to mobile while modules loaded.
      if (!mq.matches) return;
      instance = new AnimatedRibbon(THREE, el, readOptions(el));
      el.classList.add('is-live'); // CSS hides the static fallback
    } catch (err) {
      // Leave the static SVG fallback in place on any failure.
      console.warn('[ribbon] WebGL init failed, using static fallback.', err);
      el.classList.remove('is-live');
    }
  };

  const unmount = () => {
    if (!instance) return;
    instance.dispose();
    instance = null;
    el.classList.remove('is-live');
  };

  const onChange = () => (mq.matches ? mount() : unmount());
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else if (mq.addListener) mq.addListener(onChange); // older Safari

  mount();
}

function init() {
  document.querySelectorAll('[data-ribbon]').forEach(setup);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
