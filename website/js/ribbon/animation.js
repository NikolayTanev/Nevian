/* ------------------------------------------------------------------
 * animation.js — per-frame vertex motion (pure logic, no Three.js).
 *
 * Given the static ribbon descriptors and a noise source, this writes
 * fresh Y values into each line's position buffer. Motion is layered
 * simplex noise (two octaves) plus a very slow global "breathing"
 * term, so neighbouring lines drift together like flowing fibers and
 * the whole thing loops without an obvious period.
 * ------------------------------------------------------------------ */

/**
 * @param {object} ribbon  result of buildRibbon()
 * @param {SimplexNoise} noise
 * @param {object} params
 * @param {number} params.speed          base time scale (higher = faster)
 * @param {number} params.amplitude      world-space wave height
 * @param {number} params.height         band height (matches geometry)
 * @param {number} params.noiseScaleX    noise frequency along the line
 * @param {number} params.noiseScaleY    noise frequency across lines
 * @param {number} params.breathe        breathing depth (0..1, small)
 */
export function createAnimator(ribbon, noise, params) {
  const lines = ribbon.lines;

  return function update(time) {
    const { speed, amplitude, height, noiseScaleX, noiseScaleY, breathe } = params;

    // ~10s breathing cycle that gently swells and settles the band.
    const breatheFactor = 1 + Math.sin(time * 0.6) * breathe;

    for (let li = 0; li < lines.length; li++) {
      const L = lines[li];
      const pos = L.positions;
      const nxs = L.nx;
      const waistEnv = L.waistEnv;
      const ampEnv = L.ampEnv;
      const ni = L.ni;
      const phase = L.phase;
      // Each depth layer drifts at a slightly different speed.
      const layerSpeed = speed * (1 + L.layer * 0.09);
      const tBase = time * layerSpeed;

      for (let j = 0; j < nxs.length; j++) {
        const t = nxs[j];
        const baseY = ni * height * waistEnv[j] * breatheFactor;

        const n1 = noise.noise3D(t * noiseScaleX + phase, ni * noiseScaleY, tBase);
        const n2 = noise.noise3D(
          t * noiseScaleX * 2.1 + phase,
          ni * noiseScaleY * 1.7 + 10,
          tBase * 1.3 + 5
        );
        const n = (n1 + n2 * 0.5) / 1.5;

        pos[j * 3 + 1] = baseY + n * amplitude * ampEnv[j];
      }

      if (L.geometry) L.geometry.attributes.position.needsUpdate = true;
    }
  };
}
