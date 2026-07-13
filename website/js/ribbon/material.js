/* ------------------------------------------------------------------
 * material.js — colors and line materials.
 *
 * Additive, depth-less line materials that layer into a soft glow.
 * Color is blended across the band from the primary (mint/teal) to the
 * secondary (subtle cyan); a few lines pick up a faint white highlight.
 * Per-line opacity is shaped so the core of the bundle reads brighter
 * than its edges — premium and understated, never neon.
 * ------------------------------------------------------------------ */

export function makeColors(THREE, colors) {
  return {
    primary: new THREE.Color(colors.primary),
    secondary: new THREE.Color(colors.secondary),
    highlight: new THREE.Color(colors.highlight),
  };
}

/**
 * Color for a single line based on its normalized index (-0.5..0.5).
 * `highlight` mixes in a touch of white for the occasional bright fiber.
 */
export function lineColor(THREE, palette, ni, highlightAmount) {
  const m = ni + 0.5; // 0..1 across the band
  const col = palette.primary.clone().lerp(palette.secondary, m);
  if (highlightAmount > 0) col.lerp(palette.highlight, highlightAmount);
  return col;
}

/**
 * One material per line (cheap at ~100 lines) so each can carry its own
 * color and opacity while still batching into an additive glow.
 */
export function makeLineMaterial(THREE, color, opacity, additive = true) {
  return new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    // Additive glow on dark backgrounds; normal blending so the lines
    // stay visible on light/white backgrounds.
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
}

/**
 * Opacity profile across the band: brighter toward the center, softer at
 * the edges. `glowStrength` scales the whole set.
 */
export function lineOpacity(ni, glowStrength) {
  const edge = 1 - Math.min(1, Math.abs(ni) * 2); // 1 center → 0 edge
  return glowStrength * (0.28 + 0.72 * edge * edge);
}
