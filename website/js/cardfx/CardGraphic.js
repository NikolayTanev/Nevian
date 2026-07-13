/* ------------------------------------------------------------------
 * CardGraphic.js — one card's window into a SHARED flowing-line field.
 *
 * All cards build the same wave field (in stage-relative pixel space)
 * and set an orthographic camera to the sub-rectangle their card
 * occupies within the stage. Because the field and the time origin are
 * shared, the wavy lines line up perfectly from card to card — yet each
 * canvas is clipped to its own card, so the gaps between cards stay
 * empty. The result reads as continuous lines only visible inside the
 * cards.
 *
 * THREE is injected. Layout comes from the card's offset within the
 * stage (offsetLeft/Top, which ignore reveal transforms).
 * ------------------------------------------------------------------ */

import { buildWavesPx } from './particles.js';

// Shared clock so every card samples the same wave at the same moment.
const EPOCH = performance.now();

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const VERT = `
  attribute float aPhase;
  attribute float aAlpha;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uAmp;
  uniform float uFreq;
  uniform float uFreq2;
  uniform float uOpacity;
  uniform float uCenterX;
  uniform float uCenterY;
  uniform float uHalfW;
  uniform float uMinEnv;
  uniform float uSlope;
  uniform float uStageW;
  uniform float uStageH;
  uniform float uEdgeX;
  uniform float uEdgeY;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = color;
    float x = position.x;
    float off = position.y - uCenterY;              // signed distance from band center

    // Waist: bunch the lines toward the horizontal center, spread them
    // toward the ends.
    float e = clamp(abs(x - uCenterX) / uHalfW, 0.0, 1.0);
    float env = uMinEnv + (1.0 - uMinEnv) * pow(e, 1.3);

    float y = uCenterY + off * env;
    // Global uptrend: bottom-left → top-right.
    y += (x - uCenterX) * uSlope;
    // Flow (calmer where the bundle is tight in the middle).
    float w = (0.45 + 0.55 * env) * uAmp;
    y += sin(x * uFreq + uTime * uSpeed + aPhase) * w;
    y += sin(x * uFreq2 - uTime * uSpeed * 1.3 + aPhase * 1.7) * w * 0.45;

    // Fade toward the outer edges of the whole field.
    float fx = smoothstep(0.0, uEdgeX, x) * (1.0 - smoothstep(uStageW - uEdgeX, uStageW, x));
    float fy = smoothstep(0.0, uEdgeY, position.y) * (1.0 - smoothstep(uStageH - uEdgeY, uStageH, position.y));
    // Drifting fade along each line so they break up here and there.
    float al = 0.28 + 0.72 * (0.5 + 0.5 * sin(x * 0.0052 + aPhase * 4.0 + uTime * 0.22));

    vAlpha = aAlpha * uOpacity * fx * fy * al;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, 0.0, 1.0);
  }
`;

const FRAG = `
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;
  void main() { gl_FragColor = vec4(vColor, vAlpha); }
`;

// Field constants are identical for every card → continuity.
const FIELD = {
  lineGap: 26, amp: 14, freq: 0.006, freq2: 0.013, speed: 0.45,
  minEnv: 0.4,   // center band as a fraction of the end band (waist)
  slope: 0.16,   // global uptrend (bottom-left → top-right)
};

const DEFAULTS = {
  colors: { primary: '#17a06b', mid: '#2aa0a8', secondary: '#3b7fd4' },
  opacity: 0.6,
};

export class CardGraphic {
  constructor(THREE, fxEl, options = {}) {
    this.THREE = THREE;
    this.el = fxEl;
    this.stageEl = options.stageEl;
    this.cardEl = options.cardEl;
    this.opts = { ...DEFAULTS, ...options, colors: { ...DEFAULTS.colors, ...(options.colors || {}) } };
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this._running = false;

    this._measure();
    this._init();
    this._build();
    this._updateCamera();
    this._observe();

    if (this.reduced) this._render();
    else this._start();
  }

  _measure() {
    this.stageW = this.stageEl.clientWidth || 1;
    this.stageH = this.stageEl.clientHeight || 1;
    this.offX = this.cardEl.offsetLeft;
    this.offY = this.cardEl.offsetTop;
    this.cardW = this.cardEl.offsetWidth || 1;
    this.cardH = this.cardEl.offsetHeight || 1;
  }

  _init() {
    const THREE = this.THREE;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.setSize(this.cardW, this.cardH, false);
    this.renderer.setClearColor(0x000000, 0);
    const c = this.renderer.domElement;
    c.style.width = '100%'; c.style.height = '100%'; c.style.display = 'block';
    this.el.appendChild(c);

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(0, 1, 1, 0, -1000, 1000);
  }

  _build() {
    const THREE = this.THREE;
    const o = this.opts;
    const cols = [hexToRgb(o.colors.primary), hexToRgb(o.colors.mid), hexToRgb(o.colors.secondary)];

    // Extend the vertical range so the slope + waves never leave empty
    // corners once the shader tilts everything.
    const margin = 60 + FIELD.amp + FIELD.slope * (this.stageW / 2);
    // Fine sampling so the waved lines stay smooth (no visible kinks).
    const data = buildWavesPx(cols, { stageW: this.stageW, stageH: this.stageH, lineGap: FIELD.lineGap, dx: 14, margin });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(data.position, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(data.color, 3));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(data.aPhase, 1));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(data.aAlpha, 1));
    this.geometry = geo;

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: FIELD.speed },
        uAmp: { value: FIELD.amp },
        uFreq: { value: FIELD.freq },
        uFreq2: { value: FIELD.freq2 },
        uOpacity: { value: o.opacity },
        uCenterX: { value: this.stageW / 2 },
        uCenterY: { value: this.stageH / 2 },
        uHalfW: { value: this.stageW / 2 },
        uMinEnv: { value: FIELD.minEnv },
        uSlope: { value: FIELD.slope },
        uStageW: { value: this.stageW },
        uStageH: { value: this.stageH },
        uEdgeX: { value: Math.min(220, this.stageW * 0.16) },
        uEdgeY: { value: Math.min(150, this.stageH * 0.16) },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      vertexColors: true,
      blending: this.THREE.NormalBlending,
    });

    this.lines = new THREE.LineSegments(geo, this.material);
    this.lines.frustumCulled = false;
    this.scene.add(this.lines);
  }

  // Camera views exactly this card's rectangle within the global field.
  _updateCamera() {
    const c = this.camera;
    c.left = this.offX;
    c.right = this.offX + this.cardW;
    c.top = this.stageH - this.offY;
    c.bottom = this.stageH - (this.offY + this.cardH);
    c.updateProjectionMatrix();
  }

  _observe() {
    if ('IntersectionObserver' in window) {
      this._io = new IntersectionObserver((entries) => {
        this._visible = entries[0].isIntersecting;
        if (this._visible && !this.reduced) this._start();
        else this._stop();
      }, { threshold: 0 });
      this._io.observe(this.el);
    }
    if ('ResizeObserver' in window) {
      this._ro = new ResizeObserver(() => this._resize());
      this._ro.observe(this.stageEl);
    }
  }

  _resize() {
    this._measure();
    this.renderer.setSize(this.cardW, this.cardH, false);
    // Stage size may have changed → rebuild the shared field, re-window.
    this.scene.remove(this.lines);
    this.geometry.dispose();
    this.material.dispose();
    this._build();
    this._updateCamera();
    if (this.reduced) this._render();
  }

  _start() {
    if (this._running || this.reduced) return;
    this._running = true;
    this._raf = requestAnimationFrame(this._tick);
  }

  _stop() {
    this._running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
  }

  _tick = () => {
    if (!this._running) return;
    this._raf = requestAnimationFrame(this._tick);
    this.material.uniforms.uTime.value = (performance.now() - EPOCH) / 1000;
    this._render();
  };

  _render() {
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this._stop();
    if (this._io) this._io.disconnect();
    if (this._ro) this._ro.disconnect();
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
