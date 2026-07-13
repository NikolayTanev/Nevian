/* ------------------------------------------------------------------
 * particles.js — procedural LINE geometry for the product cards.
 *
 * buildWavesPx generates a bundle of horizontal lines in a SHARED
 * pixel-space that spans the whole card "stage". Every card builds the
 * same field and views its own window into it (see CardGraphic), so the
 * waves line up across cards and only ever appear inside a card — the
 * gaps between cards are simply not drawn.
 *
 * Coordinates are y-up in pixels: worldY = stageH - pixelYFromTop.
 * The vertex shader adds the actual waving; here we only lay out the
 * flat baselines that bleed a little past every edge.
 * ------------------------------------------------------------------ */

function paletteColor(t, out, i, cols) {
  const [g, m, b] = cols;
  let r, gr, bl;
  if (t < 0.5) {
    const k = t / 0.5;
    r = g[0] + (m[0] - g[0]) * k; gr = g[1] + (m[1] - g[1]) * k; bl = g[2] + (m[2] - g[2]) * k;
  } else {
    const k = (t - 0.5) / 0.5;
    r = m[0] + (b[0] - m[0]) * k; gr = m[1] + (b[1] - m[1]) * k; bl = m[2] + (b[2] - m[2]) * k;
  }
  out[i] = r; out[i + 1] = gr; out[i + 2] = bl;
}

export function buildWavesPx(cols, { stageW, stageH, lineGap = 24, dx = 34, margin = 60 } = {}) {
  const yStart = -margin;
  const yEnd = stageH + margin;
  const xStart = -margin;
  const xEnd = stageW + margin;

  const lineCount = Math.max(2, Math.floor((yEnd - yStart) / lineGap) + 1);
  const nx = Math.max(2, Math.ceil((xEnd - xStart) / dx) + 1);
  const segsPerLine = nx - 1;
  const total = lineCount * segsPerLine;

  const position = new Float32Array(total * 2 * 3);
  const color = new Float32Array(total * 2 * 3);
  const aPhase = new Float32Array(total * 2);
  const aAlpha = new Float32Array(total * 2);

  let p = 0;
  for (let li = 0; li < lineCount; li++) {
    const baseYpx = yStart + li * lineGap;
    const baseYw = stageH - baseYpx;         // y-up
    const tint = Math.min(1, Math.max(0, baseYpx / stageH));
    const phase = li * 0.55;

    for (let j = 0; j < segsPerLine; j++) {
      for (let e = 0; e < 2; e++) {
        const x = xStart + (j + e) * dx;
        const o = p * 3;
        position[o] = x; position[o + 1] = baseYw; position[o + 2] = 0;
        paletteColor(tint, color, o, cols);
        aPhase[p] = phase;
        aAlpha[p] = 0.6;
        p++;
      }
    }
  }
  return { position, color, aPhase, aAlpha, count: total };
}
