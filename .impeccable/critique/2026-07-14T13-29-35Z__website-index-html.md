---
target: the homepage (website/index.html)
total_score: 34
p0_count: 0
p1_count: 0
timestamp: 2026-07-14T13-29-35Z
slug: website-index-html
---
# Critique (re-run) — Nevian landing page (website/index.html)

Method: dual-agent (A: design-review · B: detector+evidence)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Motion now reduced-motion gated; interactive states clear |
| 2 | Match System / Real World | 3 | Plain-language scenarios land; minor product jargon |
| 3 | User Control and Freedom | 3 | Tablist keyboard nav added; "Try Nevian" still not keyboard-reachable |
| 4 | Consistency and Standards | 4 | All nav/footer links resolve; dead links gone |
| 5 | Error Prevention | 3 | Form has required fields + fallback; email not format-validated |
| 6 | Recognition Rather Than Recall | 4 | Labeled nav dropdown, visible options, strong progressive disclosure |
| 7 | Flexibility and Efficiency | 3 | Clear primary CTA; fine for marketing |
| 8 | Aesthetic and Minimalist Design | 3 | Cohesive light system; a couple of generated-asset tells remain |
| 9 | Error Recovery | 4 | Form status messages + mailto fallback |
| 10 | Help and Documentation | 3 | Journey teaches well; no explicit help/FAQ |
| **Total** | | **34/40** | **Good — up from 29/40** |

## Anti-Patterns Verdict

**Does this look AI-generated? Mostly reads as a real product page now.**

Genuine, earned improvement since the last run. Gradient text is gone (hero "AI" and stat numbers are solid accent), the dark-green CTA slabs and feature bands are replaced with the light `.closer` / `.lightpanel` treatment, eyebrows are thinned to two, the fabricated 90% stat is gone, and Hanken Grotesk gives the headings a distinct voice against Inter body.

Residual tells (all minor): the AI-rendered imagery in `/AI_Assets` (hero marble render, frosted-glass behind the journey), the buzzword-cycling `.node-flow` topology diagram (the strongest remaining "generated" signal), and one reused accent icon-chip recipe.

**Deterministic scan (detect.mjs):** 1 finding — `overused-font` on Inter (line 33). Expected and deliberate: Inter is intentionally retained for body/UI while Hanken Grotesk carries the headings. Reported, not a defect.

**Visual overlays:** unavailable — no browser automation in this session.

## Overall Impression

The structural problems are resolved. The page now has a real information architecture (nav dropdown into four detail pages), a proper persuasion peak before the form, and a consistent light visual system. What's left is polish, not repair.

## What's Working

1. **Peak-end fixed.** The page closes on the `.closer` end-cap (outcome headline + reassurance chips) before the form, instead of dumping onto a bare form.
2. **Consistency restored.** Every nav and footer link resolves; the Product dropdown gives the four detail pages a real home.
3. **Cohesive light system + display type.** Removing gradient text and dark-green slabs, plus the Hanken/Inter split, makes it read like a designed product rather than a template.

## Remaining Issues

- **[P2] "Try Nevian" affordance is a bare `<span>`.** It's now always visible (good) but it's a `<span>` with a click handler, so it's not keyboard-focusable or announced to assistive tech. *Fix:* make it a real `<button>` (or add `role="button"` + `tabindex="0"` + key handling). → /impeccable clarify
- **[P3] The `.node-flow` topology diagram reads as filler.** Its buzzword-cycling nodes are the strongest remaining "AI-generated" signal. *Fix:* ground it in a concrete, real architecture or replace with a simpler honest visual. → /impeccable distill
- **[P3] Dead code / loose ends.** Three hidden `deferred-section` blocks remain, `.cta-band` / `.green-panel` CSS is now unused, the `.hero-mock` parallax in main.js targets an element that no longer exists, and the dark theme is unreachable. *Fix:* prune. → /impeccable distill
- **[P3] Small form + hero gaps.** The hero has no supporting subhead under the H1, and the email field isn't format-validated (`novalidate`). *Fix:* add a one-line hero subhead; add lightweight email validation. → /impeccable clarify

No P0 or P1 issues remain — the prior P0 (dead links) and P1 (no end-cap) are both resolved.

## Persona Red Flags

**Time-pressed IT manager:** now reaches Security and Admin Dashboard from the nav, sees honest stats, and gets a reassurance close before the form. Main residual doubt: the abstract node-flow diagram.
**Keyboard/AT user:** tablist is now navigable, but the "Try Nevian" span is skipped.
**Mobile visitor:** hover-only affordance fixed; reduced-motion respected.

## Minor Observations

- Hero H1 stands alone with no subhead; a single supporting line would strengthen the opening.
- `theme-color` now has light/dark variants though the theme itself is light-only (harmless).
- Consider grounding or simplifying the node-flow diagram's rotating labels.

## Questions to Consider

- What real architecture could the node-flow diagram show instead of rotating buzzwords?
- Would a one-line hero subhead sharpen the value prop before the interactive demo?
- Is there a lightweight proof point (a logo, a number you can stand behind) that would strengthen the mid-page?
