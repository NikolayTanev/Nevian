import { useEffect, useMemo, useRef, useState } from 'react';

// One thick line emerges just above the logo band, holds as a single solid
// stroke, sweeps up, then branches into a bundle of green streamlines that fan
// across the top-right toward both the top and right edges. Every coordinate
// is a fraction of the measured hero size, so it stays put at any screen size.

const LINE_COUNT = 58;
const SAMPLES = 128; // higher sampling = smoother, less faceted curves

const GREEN = '#63d89b';
const LIME = '#9dff73'; // bright accent, matching the section-below highlight

// Branching begins here (0..1 along each line). Must be well past the base so
// the line reads as a single solid stroke before it starts to fan.
const T_SPLIT = 0.56;

// Horizontal exit position as a fraction of width. Matches the Journey line's
// LINE_X (39.35%) so the hero trunk lines up with the line in the section
// below across the (unchanged) logo band. Both sections are full width, so the
// same fraction maps to the same screen x at every size. Keep these in sync.
const EXIT_X = 0.3935;

// Deterministic pseudo-random so paths are stable across renders.
function rand(seed) {
  const x = Math.sin(seed * 127.1 + 31.7) * 43758.5453;
  return x - Math.floor(x);
}

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function cubic(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  const a = mt * mt * mt;
  const b = 3 * mt * mt * t;
  const c = 3 * mt * t * t;
  const d = t * t * t;
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
  ];
}

function cubicDeriv(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  const a = 3 * mt * mt;
  const b = 6 * mt * t;
  const c = 3 * t * t;
  return [
    a * (p1[0] - p0[0]) + b * (p2[0] - p1[0]) + c * (p3[0] - p2[0]),
    a * (p1[1] - p0[1]) + b * (p2[1] - p1[1]) + c * (p3[1] - p2[1]),
  ];
}

function normalize(v) {
  const m = Math.hypot(v[0], v[1]) || 1;
  return [v[0] / m, v[1] / m];
}

function buildScene(W, H) {
  // Entry sits below the bottom edge so the line emerges from the seam with
  // the logo band. C1 sits almost directly above the entry so the very bottom
  // leaves vertically (clean exit point to continue below); the throat T is
  // where the fan opens.
  const P0 = [EXIT_X * W, 1.12 * H];
  // C1 sits just below the corner so the strand stays vertical almost all the
  // way up, then turns hard. T is the corner height where it breaks right.
  const C1 = [EXIT_X * W, 0.5 * H];
  const T = [0.44 * W, 0.45 * H];

  const lines = [];
  for (let i = 0; i < LINE_COUNT; i++) {
    const a = i / (LINE_COUNT - 1);
    // Wide, randomized fan-out: an even vertical base gives full coverage, a
    // large random jitter scatters the ends, and a randomized rightward depth
    // means some reach much further than others. Ends do not land on a line.
    const baseY = lerp(-0.18 * H, 1.32 * H, a);
    const endY = baseY + (rand(i * 23 + 7) - 0.5) * 0.6 * H;
    const endX = (0.98 + rand(i * 29 + 3) * 0.56) * W;
    const E = [endX, endY];
    // Control held right at the corner height so the strand leaves the bend
    // almost horizontally, making a tight, near-90-degree elbow.
    const C2 = [lerp(T[0], E[0], 0.5), lerp(T[1], E[1], 0.05)];

    const freq = 1.0 + rand(i * 3 + 1) * 1.8;
    const phase = rand(i * 5 + 2) * Math.PI * 2;
    const amp = 4 + rand(i * 7 + 3) * 10;

    let d = '';
    for (let k = 0; k <= SAMPLES; k++) {
      const t = k / SAMPLES;
      const p = cubic(P0, C1, C2, E, t);
      const der = normalize(cubicDeriv(P0, C1, C2, E, t));
      const perp = [-der[1], der[0]];
      let env = t <= T_SPLIT ? 0 : (t - T_SPLIT) / (1 - T_SPLIT);
      env = env * env * (3 - 2 * env); // smoothstep so waves ease in
      const wave = Math.sin(t * Math.PI * 2 * freq + phase) * amp * env;
      const x = p[0] + perp[0] * wave;
      const y = p[1] + perp[1] * wave;
      d += `${k === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
    }

    // Thickness variation: mostly fine, with the occasional bolder fiber.
    let width = 0.8 + rand(i * 11 + 4) * 1.1;
    if (rand(i * 13 + 6) > 0.82) width += 1.15;
    // Brighter through the dense middle of the fan, softer at the edges.
    const centerBias = 1 - Math.abs(a - 0.42) * 1.4;
    let opacity = clamp(0.34 + centerBias * 0.34, 0.2, 0.74);

    // Scatter a few brighter lime strands through the bundle as accents.
    const isLime = rand(i * 17 + 9) > 0.74;
    if (isLime) opacity = clamp(opacity + 0.12, 0.2, 0.86);

    lines.push({
      d: d.trim(),
      width: width.toFixed(2),
      opacity: opacity.toFixed(3),
      color: isLime ? LIME : GREEN,
    });
  }

  return lines;
}

export default function HeroFlowLines() {
  const ref = useRef(null);
  const [dims, setDims] = useState({ w: 1440, h: 820 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width && r.height) {
        setDims((prev) =>
          prev.w === Math.round(r.width) && prev.h === Math.round(r.height)
            ? prev
            : { w: Math.round(r.width), h: Math.round(r.height) }
        );
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const lines = useMemo(() => buildScene(dims.w, dims.h), [dims.w, dims.h]);

  return (
    <svg
      ref={ref}
      className="hero-flow-lines"
      viewBox={`0 0 ${dims.w} ${dims.h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g fill="none" strokeLinecap="round">
        {lines.map((l, i) => (
          <path
            key={i}
            d={l.d}
            stroke={l.color}
            strokeWidth={l.width}
            strokeOpacity={l.opacity}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
    </svg>
  );
}
