/* ------------------------------------------------------------------
 * index.js — bootstrap for the product-card particle graphics.
 *
 * Mounts a CardGraphic on every [data-cardfx] element (desktop only,
 * ≥ 64rem). Three.js is lazy-imported so smaller screens never pay for
 * it. Config is read from data-* attributes.
 *
 *   <div class="sc-fx" data-cardfx="dust"
 *        data-focus="-0.6,0" data-spread="1.7" data-density="1"></div>
 *
 * Three.js resolves via the import map declared in index.html.
 * ------------------------------------------------------------------ */

const DESKTOP_QUERY = '(min-width: 64rem)';

function readOptions(el) {
  const d = el.dataset;
  const opts = {
    stageEl: el.closest('.sc-stage'),
    cardEl: el.closest('.sc-card'),
  };
  if (d.opacity) opts.opacity = parseFloat(d.opacity);
  const colors = {};
  if (d.primary) colors.primary = d.primary;
  if (d.mid) colors.mid = d.mid;
  if (d.secondary) colors.secondary = d.secondary;
  if (Object.keys(colors).length) opts.colors = colors;
  return opts;
}

function setup(el) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  let instance = null;

  const mount = async () => {
    if (instance || !mq.matches) return;
    const opts = readOptions(el);
    if (!opts.stageEl || !opts.cardEl) return;
    try {
      const THREE = await import('three');
      const { CardGraphic } = await import('./CardGraphic.js');
      if (!mq.matches) return;
      instance = new CardGraphic(THREE, el, opts);
    } catch (err) {
      console.warn('[cardfx] init failed', err);
    }
  };
  const unmount = () => {
    if (!instance) return;
    instance.dispose();
    instance = null;
  };

  const onChange = () => (mq.matches ? mount() : unmount());
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else if (mq.addListener) mq.addListener(onChange);
  mount();
}

function init() {
  document.querySelectorAll('[data-cardfx]').forEach(setup);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
