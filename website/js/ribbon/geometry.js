/* ------------------------------------------------------------------
 * geometry.js — procedural ribbon geometry (no rendering, no animation).
 *
 * Builds a bundle of horizontal polylines. Each line carries the static
 * per-vertex data the animator needs every frame:
 *   - nx        normalized position along the line (0..1)
 *   - waistEnv  band multiplier that pinches the bundle in the middle
 *               and widens it at the ends  ( >>>>>  ||  <<<<< )
 *   - ampEnv    amplitude envelope that calms the very tips so the
 *               silhouette stays clean and the loop reads seamlessly
 *   - ni        normalized line index (-0.5..0.5)
 *   - phase     tiny per-line phase offset for neighbour desync
 *   - layer     depth layer index (drives speed + z separation)
 * ------------------------------------------------------------------ */

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * @param {object} opts
 * @param {number} opts.lineCount     number of parallel lines
 * @param {number} opts.vertsPerLine  vertices per line
 * @param {number} opts.width         world width of the ribbon
 * @param {number} opts.height        world height of the band
 * @param {number} opts.waist         center width factor (0..1, smaller = tighter waist)
 * @param {number} opts.depth         total z spread across layers
 * @param {number} opts.layers        number of depth layers
 */
export function buildRibbon(opts) {
  const {
    lineCount,
    vertsPerLine,
    width,
    height,
    waist,
    depth,
    layers,
  } = opts;

  const lines = [];

  for (let i = 0; i < lineCount; i++) {
    const ni = lineCount > 1 ? i / (lineCount - 1) - 0.5 : 0; // -0.5..0.5
    const layer = i % layers;
    const z = layers > 1 ? (layer / (layers - 1) - 0.5) * depth : 0;

    const positions = new Float32Array(vertsPerLine * 3);
    const nx = new Float32Array(vertsPerLine);
    const waistEnv = new Float32Array(vertsPerLine);
    const ampEnv = new Float32Array(vertsPerLine);

    for (let j = 0; j < vertsPerLine; j++) {
      const t = vertsPerLine > 1 ? j / (vertsPerLine - 1) : 0; // 0..1
      const d = Math.abs(t - 0.5) * 2; // 0 at center, 1 at the ends
      const w = waist + (1 - waist) * Math.pow(d, 1.35);
      const amp = smoothstep(0, 0.12, t) * (1 - smoothstep(0.88, 1, t));

      nx[j] = t;
      waistEnv[j] = w;
      ampEnv[j] = amp;

      positions[j * 3] = (t - 0.5) * width;
      positions[j * 3 + 1] = ni * height * w;
      positions[j * 3 + 2] = z;
    }

    lines.push({
      ni,
      layer,
      z,
      phase: ni * Math.PI * 2,
      positions,
      nx,
      waistEnv,
      ampEnv,
    });
  }

  return { lines, opts };
}

/**
 * Recompute only the X (and Z) coordinates for a new world width — used
 * on resize so the ribbon keeps bleeding off both edges without a full
 * rebuild. Y is owned by the animator.
 */
export function reflowRibbonWidth(ribbon, width) {
  for (const line of ribbon.lines) {
    const pos = line.positions;
    for (let j = 0; j < line.nx.length; j++) {
      pos[j * 3] = (line.nx[j] - 0.5) * width;
    }
  }
  ribbon.opts.width = width;
}
