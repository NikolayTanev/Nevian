/* ------------------------------------------------------------------
 * AnimatedRibbon.js — the controller (scene, loop, IO, parallax, perf).
 *
 * Vanilla-JS equivalent of the requested:
 *   <AnimatedRibbon width height colors={{primary,secondary,highlight}}
 *                   speed lineCount intensity glowStrength mouseInteraction />
 *
 * Usage:
 *   import * as THREE from 'three';
 *   const ribbon = new AnimatedRibbon(THREE, container, options);
 *   ribbon.dispose();
 *
 * Responsibilities:
 *   - build geometry + materials, mount a WebGL canvas in `container`
 *   - drive the animator each frame with a requestAnimationFrame loop
 *   - pause when offscreen (IntersectionObserver)
 *   - freeze to a single static frame under prefers-reduced-motion
 *   - degrade quality on slow GPUs (adaptive pixel ratio)
 *   - subtle mouse parallax (a few px lean, heavily damped)
 *   - handle resize (ResizeObserver) and full teardown (dispose)
 * ------------------------------------------------------------------ */

import { SimplexNoise } from './noise.js';
import { buildRibbon, reflowRibbonWidth } from './geometry.js';
import { createAnimator } from './animation.js';
import { makeColors, lineColor, makeLineMaterial, lineOpacity } from './material.js';

const DEFAULTS = {
  colors: { primary: '#34c08a', secondary: '#2bb4c4', highlight: '#eafaf2' },
  speed: 0.12,          // slow ocean current
  lineCount: 90,        // 60–120
  intensity: 1,         // wave amplitude multiplier
  glowStrength: 0.5,    // base line opacity
  mouseInteraction: true,
  additive: true,       // additive glow (dark bg) vs normal blend (light bg)
  vertsPerLine: 200,    // 150–250
  height: 1.5,          // world band height
  waist: 0.34,          // center pinch
  layers: 3,            // depth layers (speed + z separation)
  depth: 0.6,
};

export class AnimatedRibbon {
  constructor(THREE, container, options = {}) {
    this.THREE = THREE;
    this.container = container;
    this.opts = { ...DEFAULTS, ...options, colors: { ...DEFAULTS.colors, ...(options.colors || {}) } };

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Adaptive quality: start high, drop if the first second is choppy.
    this.pixelRatioCap = 1.75;
    this._fpsSamples = [];
    this._quality = 1;

    this._pointer = { x: 0, y: 0 };
    this._pointerTarget = { x: 0, y: 0 };
    this._visible = true;
    this._running = false;
    this._time = 0;
    this._lastTs = 0;

    this._initScene();
    this._buildRibbon();
    this._initInteraction();
    this._initObservers();

    if (this.reducedMotion) {
      // Static, elegant single frame — no loop.
      this._animator(0);
      this._render();
    } else {
      this._start();
    }
  }

  /* ---- scene / renderer ---------------------------------------- */
  _initScene() {
    const THREE = this.THREE;
    const { clientWidth: w, clientHeight: h } = this.container;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.pixelRatioCap));
    this.renderer.setSize(w, h, false);
    this.renderer.setClearColor(0x000000, 0);

    const canvas = this.renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    this.container.appendChild(canvas);

    this.scene = new THREE.Scene();

    const aspect = w / h || 1;
    this.camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, -10, 10);
    this.camera.position.z = 2;

    this.group = new THREE.Group();
    this.scene.add(this.group);
  }

  _worldWidth() {
    const aspect = (this.container.clientWidth / this.container.clientHeight) || 1;
    return 2 * aspect * 1.18; // bleed off both edges
  }

  /* ---- geometry + materials ------------------------------------ */
  _buildRibbon() {
    const THREE = this.THREE;
    const o = this.opts;

    const lineCount = Math.max(8, Math.round(o.lineCount * this._quality));
    const vertsPerLine = Math.max(80, Math.round(o.vertsPerLine * this._quality));

    this.noise = new SimplexNoise(1337);
    this.ribbon = buildRibbon({
      lineCount,
      vertsPerLine,
      width: this._worldWidth(),
      height: o.height,
      waist: o.waist,
      depth: o.depth,
      layers: o.layers,
    });

    const palette = makeColors(THREE, o.colors);
    this._materials = [];
    this._lineObjects = [];

    this.ribbon.lines.forEach((line, i) => {
      // A few evenly-spaced fibers pick up a faint white highlight.
      const isHighlight = i % 11 === 0;
      const color = lineColor(THREE, palette, line.ni, isHighlight ? 0.5 : 0);
      const opacity = lineOpacity(line.ni, o.glowStrength) * (isHighlight ? 1.25 : 1);

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(line.positions, 3));
      line.geometry = geometry;

      const material = makeLineMaterial(THREE, color, opacity, o.additive);
      const obj = new THREE.Line(geometry, material);
      obj.frustumCulled = false;

      this.group.add(obj);
      this._materials.push(material);
      this._lineObjects.push(obj);
    });

    this._animator = createAnimator(this.ribbon, this.noise, {
      speed: o.speed,
      amplitude: 0.13 * o.intensity,
      height: o.height,
      noiseScaleX: 1.6,
      noiseScaleY: 1.1,
      breathe: 0.05,
    });
  }

  _disposeRibbon() {
    if (!this._lineObjects) return;
    for (const obj of this._lineObjects) {
      this.group.remove(obj);
      obj.geometry.dispose();
    }
    for (const m of this._materials) m.dispose();
    this._lineObjects = null;
    this._materials = null;
  }

  /* ---- interaction (subtle parallax) --------------------------- */
  _initInteraction() {
    if (!this.opts.mouseInteraction || this.reducedMotion) return;
    this._onPointerMove = (e) => {
      const r = this.container.getBoundingClientRect();
      // -1..1 relative to the panel center.
      this._pointerTarget.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      this._pointerTarget.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener('pointermove', this._onPointerMove, { passive: true });
  }

  /* ---- observers (visibility + resize) ------------------------- */
  _initObservers() {
    if ('IntersectionObserver' in window) {
      this._io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) this._visible = entry.isIntersecting;
          if (this._visible && !this.reducedMotion) this._start();
          else this._stop();
        },
        { threshold: 0 }
      );
      this._io.observe(this.container);
    }

    if ('ResizeObserver' in window) {
      this._ro = new ResizeObserver(() => this._onResize());
      this._ro.observe(this.container);
    } else {
      this._onResizeBound = () => this._onResize();
      window.addEventListener('resize', this._onResizeBound);
    }
  }

  _onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (!w || !h) return;

    this.renderer.setSize(w, h, false);
    const aspect = w / h;
    this.camera.left = -aspect;
    this.camera.right = aspect;
    this.camera.updateProjectionMatrix();

    reflowRibbonWidth(this.ribbon, this._worldWidth());
    for (const line of this.ribbon.lines) line.geometry.attributes.position.needsUpdate = true;

    if (this.reducedMotion) this._render();
  }

  /* ---- loop ---------------------------------------------------- */
  _start() {
    if (this._running || this.reducedMotion) return;
    this._running = true;
    this._lastTs = performance.now();
    this._raf = requestAnimationFrame(this._tick);
  }

  _stop() {
    this._running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = 0;
  }

  _tick = (ts) => {
    if (!this._running) return;
    this._raf = requestAnimationFrame(this._tick);

    const dt = Math.min(0.05, (ts - this._lastTs) / 1000); // clamp big gaps
    this._lastTs = ts;
    this._time += dt;

    this._maybeDegrade(dt);

    // Damped pointer parallax → a few px of lean.
    const p = this._pointer;
    const target = this._pointerTarget;
    p.x += (target.x - p.x) * 0.04;
    p.y += (target.y - p.y) * 0.04;
    this.group.position.x = p.x * 0.05;
    this.group.position.y = -p.y * 0.03;
    this.group.rotation.z = p.x * 0.01;

    this._animator(this._time);
    this._render();
  };

  _render() {
    this.renderer.render(this.scene, this.camera);
  }

  /* ---- adaptive quality ---------------------------------------- */
  _maybeDegrade(dt) {
    if (this._degraded || this._time > 1.5) return; // only judge the first ~1.5s
    this._fpsSamples.push(1 / dt);
    if (this._fpsSamples.length < 30) return;

    const avg = this._fpsSamples.reduce((a, b) => a + b, 0) / this._fpsSamples.length;
    this._degraded = true;
    if (avg < 45) {
      // Drop pixel ratio first (cheapest), then rebuild with fewer lines.
      this.renderer.setPixelRatio(1);
      if (avg < 32 && this._quality > 0.6) {
        this._quality = 0.6;
        this._disposeRibbon();
        this._buildRibbon();
      }
    }
  }

  /* ---- public API ---------------------------------------------- */
  /** Live-update options (colors, speed, glowStrength, intensity...). */
  setOptions(next = {}) {
    Object.assign(this.opts, next, { colors: { ...this.opts.colors, ...(next.colors || {}) } });
    this._disposeRibbon();
    this._buildRibbon();
    if (this.reducedMotion) {
      this._animator(this._time);
      this._render();
    }
  }

  dispose() {
    this._stop();
    if (this._io) this._io.disconnect();
    if (this._ro) this._ro.disconnect();
    if (this._onResizeBound) window.removeEventListener('resize', this._onResizeBound);
    if (this._onPointerMove) window.removeEventListener('pointermove', this._onPointerMove);
    this._disposeRibbon();
    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
