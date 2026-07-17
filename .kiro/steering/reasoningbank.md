---
inclusion: always
---

# ReasoningBank — Shared Agent Memory

A team-shared, Kiro-native adaptation of the ReasoningBank framework
(Google Research, https://arxiv.org/abs/2509.25140). Instead of repeating the
same strategic mistakes across sessions and coworkers, Kiro reads distilled
lessons from this file before acting, and appends new lessons after.

This file is committed to the repo, so every coworker's Kiro sessions share the
same accumulating memory.

## Operating protocol (retrieve → act → self-judge → extract → consolidate)

1. **Retrieve** — Before starting a non-trivial task, scan the Memory Bank below
   for items relevant to the task. Apply the ones that match.
2. **Act** — Do the work as normal.
3. **Self-judge** — When the task finishes, briefly assess: did it succeed, and
   what actually caused success or failure? Judgment does not need to be perfect.
4. **Extract** — Distill a *generalizable* strategy or pitfall, not a one-off
   fact. Capture failures as preventative guardrails ("always verify X before Y"),
   not just successes.
5. **Consolidate** — Append a new memory item under the Memory Bank using the
   schema below. If it duplicates or refines an existing item, edit that item
   instead of adding a near-copy. Keep the bank tight and high-signal.

## Memory item schema

Each item has three parts:
- **Title** — concise identifier for the strategy.
- **Description** — one-line summary of when it applies.
- **Content** — the distilled reasoning, decision rationale, or guardrail.

Format:

```
### <Title>
- **When:** <Description — the trigger/context>
- **Lesson:** <Content — the generalizable strategy or pitfall to avoid>
- **Source:** <success | failure> · <date> · <optional short reference>
```

## What to store vs. skip

- STORE: transferable strategies, recurring pitfalls, build/deploy gotchas,
  conventions discovered the hard way.
- SKIP: one-off facts, secrets, verbose action logs, anything already obvious
  from the codebase or other steering files.

---

# Memory Bank

<!-- Append new items below. Newest at the bottom. Keep entries generalizable. -->

### Deploy target is GitHub Pages, build lives in /website
- **When:** Building, deploying, or debugging the published site.
- **Lesson:** The deployable app is the Vite/React project under `website/`, published
  via `.github/workflows/pages.yml`. Run build/lint commands from `website/`, not the
  repo root. A `public/.nojekyll` and `public/CNAME` are intentional for Pages — do not remove them.
- **Source:** success · 2026-07-16 · initial seed

### Impeccable was installed at global scope
- **When:** A coworker expects the impeccable design skill but Kiro doesn't apply it.
- **Lesson:** Impeccable was first installed to `~/.kiro` (global, machine-local), so it is
  NOT shared via the repo. For team-wide availability, reinstall at project scope so it
  commits under `.kiro/skills`.
- **Source:** failure · 2026-07-16 · initial seed

### Adapt research frameworks to native tooling, don't clone code that won't fit
- **When:** Asked to "implement" a research paper, framework, or external tool into this project.
- **Lesson:** First read the source and classify it: is it a runnable product or a research technique tied to a different runtime? If the published code targets a different environment (e.g. Python benchmark agents), porting it verbatim adds noise. Extract the core concept and map it onto the project's native mechanisms (here: Kiro steering + hooks) instead. State the limitations of the adaptation explicitly.
- **Source:** success · 2026-07-16 · ReasoningBank setup

### Honor the team writing rules in all generated text
- **When:** Producing any text in this project: UI copy, docs, comments, commit messages, or replies.
- **Lesson:** Team writing rules live in `.kiro/steering/writing-rules.md` and are numbered with lower numbers winning on conflict. Currently: never use the em dash character, and always use plain natural language. Check that file before writing text, since coworkers may add rules over time.
- **Source:** success · 2026-07-16 · writing-rules setup

### Two Node projects; only website/ needs npm install
- **When:** Installing dependencies, building, or fixing vulnerabilities.
- **Lesson:** `website/` holds the real deps (React 18, Vite 5, Tailwind 3) and its build outputs to `dist/`. `aws/lambda/` declares no dependencies and needs no install, since it relies on AWS SDK v3 built into the Node 20 Lambda runtime. The only reported vulnerabilities come from esbuild via Vite 5 and are dev-server only; the sole npm fix forces a breaking jump to Vite 8, so do not run `npm audit fix --force` without a planned, tested upgrade.
- **Source:** success · 2026-07-16 · dependency install

### Journey section is driven by per-frame scroll progress, not CSS scroll animations
- **When:** Animating or editing the workflow/Journey section. NOTE: the home page renders `website/src/components/Journey.jsx` ("Nevian workflow", Report/Triage/Context). `ProcessJourney.jsx` is a different hover-based section ("How we get Nevian running"). Confirm which component matches the screenshot before editing.
- **Lesson:** The section runs a rAF loop that eases a continuous `selectedFloat` scroll value and writes visuals via refs inside `updateVisuals`; scroll decides WHICH step is active (`activeIndex` via `Math.round`, which swaps at the midpoint between titles). CONTENT TRANSITION — the important design lesson: do NOT map copy opacity directly to scroll position. Mapping opacity to `selectedFloat` reads as a janky scroll event (its speed is the user's scroll speed) and fading one element out then back in looks like a blink. The user rejected that approach twice. Instead trigger a real, TIME-BASED crossfade when `activeIndex` changes, fully decoupled from scroll speed: keep the previous step mounted for one transition (state `{ index, id }`, cleared on `onAnimationEnd`), render two `.nevian-journey-copy-layer` divs where the incoming one animates in (fade + rise + blur clearing, ~0.44s, ease-out-expo `cubic-bezier(.16,1,.3,1)`) while the outgoing one animates out over it (absolute/inset:0, fade + drift up + blur, ~0.28s, ease-in). Exit shorter than enter. Reduced motion = plain quick opacity crossfade, no movement/blur. PACING: dwell per step = track height minus sticky stage height (`@media (min-width:1024px)` `.nevian-journey-track` vs `.nevian-journey-stage` 100vh); grow track height to space steps out when the overall section can become longer, not `STEP_SPACING` (which is label spacing/travel speed). If the track boundaries must stay fixed, extra distance cannot be added to every interval. Use a monotonic piecewise desktop progress map to spend part of the final hold on earlier transitions, and use the inverse mapping for hash and navigation jumps. Keep mobile pacing unchanged unless requested.
- **Source:** failure→success · 2026-07-16 · scroll-mapped opacity rejected twice; reworked into a time-based two-layer crossfade (per impeccable brand/animate guidance)

### Get a "poppy/jumpy" feel without dated bounce/elastic easing
- **When:** A user asks for a bouncy, jumpy, or poppy animation, but bounce/elastic cubic-beziers are banned (they read as dated).
- **Lesson:** Build the overshoot into the keyframes, not the easing curve. Use a normal ease-out (`cubic-bezier(.22,1,.3,1)`) and add a mid-keyframe that overshoots past the resting state (e.g. `55% { transform: scale(1.05) translateY(-4px) }` then `100% { scale(1) translateY(0) }`). Add liveliness with a short stagger across sibling elements (~70ms apart via `nth-child` animation-delays). Let a parent layer own the group fade/blur while children own the transform pop, so the two compose. Always neutralize both the layer and child animations under `prefers-reduced-motion` (plain crossfade).
- **Source:** success · 2026-07-16 · Journey copy pop-in

### Site nav is sticky ("follows the user") and carries a fading black scrim
- **When:** Editing the top navigation (`.site-nav` in `website/src/index.css`).
- **Lesson:** "Follow the user" meant the nav should STAY VISIBLE while scrolling, i.e. `position: sticky; top: 0` (with `z-index: 60`), NOT scroll away in normal flow. (An earlier read of "don't make it stick to the top" as "keep it non-sticky" was wrong and the user rejected it — when phrasing is contradictory, confirm the intent rather than guessing.) The standalone contact page overrides back to `position: relative; top: auto` via `html.contact-route .site-nav` because that route uses `overflow: hidden`; keep that override. The nav also has a black-to-transparent gradient behind it via `.site-nav::before` (linear-gradient scrim, `pointer-events: none`, `z-index: 0` beneath inner content at `z-index: 3`); sticky positioning also serves as the containing block for that pseudo-element.
- **Source:** failure→success · 2026-07-16 · nav made sticky after non-sticky was rejected

### Reproduce before changing working code; the password demo freezes under reduced motion
- **When:** An animation "doesn't work" — especially the password-reset demo (`website/src/components/PasswordResetDemo.jsx`).
- **Lesson:** FIRST check `prefers-reduced-motion`. This demo intentionally jumps to a static `setPhase(13)` (no typing/cursor/Microsoft panels, just "I forgot my password" → "You're all set" → "Perfect, thank you!" with "Reset ready" lit) when the OS/browser reports reduce-motion; there is also a CSS `@media (prefers-reduced-motion: reduce) { .password-demo-section * ... }` rule. If a screenshot shows that exact static state, it is almost certainly reduce-motion, not a code bug. PROCESS PITFALL (learned the hard way, churned and angered the user): do NOT rewrite working code on a guess. The demo's trigger observer (`intersectionRatio >= .22`, `threshold:[0,.22,.5]`) was fine; I swapped it to `rootMargin:'0px 0px -20% 0px'`, which is actively WRONG for a section near the page bottom — a negative bottom rootMargin means the element may never scroll into the shrunk root, so it never triggers. Reverted. Rule: reproduce the issue and confirm the mechanism before editing; if you cannot run it, ask a diagnostic question rather than changing logic speculatively.
- **Source:** failure · 2026-07-16 · misdiagnosed demo; reverted speculative observer change

### Separate layered preview layout from pointer interaction
- **When:** Moving rich product context behind marketing copy while revealing it locally around the cursor.
- **Lesson:** Track pointer coordinates on a stable parent, keep real controls separate, and use an ambient layer plus a cursor-clipped spotlight layer. Keep the ambient copy outline-led, while the spotlight restores brightness locally. A radial mask can still become rectangular near an element boundary even after removing `overflow: hidden`, because the masked element has a finite border box. Give the spotlight an oversized outer bleed canvas, offset its mask and reticle coordinates by that bleed, and place the real panels in an inset inner canvas so their layout does not move. For cross-section continuity, publish the cursor position on a shared ancestor and let the receiving sibling render its own continuation glow. Subtle connector flow, beacon pulses, waveform motion, and a breathing reticle add depth when they run only during hover and are disabled under reduced motion.
- **Source:** success · 2026-07-17 · edge-free bleed canvas with restrained diagnostic motion

### Move diagram nodes and connection geometry together
- **When:** Repositioning a node in a diagram where CSS-positioned elements sit over SVG connector paths.
- **Lesson:** Treat the node and every attached route as one layout unit. Update the node coordinate, SVG path endpoints, junction markers, and animated motion paths together. If the destination node stays fixed, reroute the connector between the new source and the unchanged destination instead of shifting the whole branch.
- **Source:** failure→success · 2026-07-17 · architecture core repositioning

### Use a custom control when native select menus break the visual system
- **When:** A branded form needs styled option menus, intentional chevron placement, and a real unselected placeholder state.
- **Lesson:** Native select popups are controlled by the browser or operating system and cannot be styled reliably. Use an accessible combobox and listbox for the visible interaction, backed by a synchronized native select for required validation and `FormData`. Browser validation bubbles are also controlled by the browser locale and visual system. Add `noValidate`, inspect the constraint validation API during submission, focus the first invalid control, and show project-styled messages without removing required attributes. Preserve keyboard navigation, outside-click closing, invalid focus, and form reset behavior so the visual upgrade does not weaken the form.
- **Source:** failure to success · 2026-07-17 · contact form dropdowns and validation

### Build mega menus from live information architecture, not reference labels
- **When:** Adapting a visual navigation reference into an existing marketing site.
- **Lesson:** First map every card to a real section or route and add missing anchors before styling the panel. Use a button for the disclosure trigger and ordinary links inside the destination grid instead of ARIA menu roles, then support click, hover, outside click, Escape, ArrowDown focus, hidden-state tab control, and reduced motion. Give each card a content-specific preview so the menu communicates the product rather than copying the reference literally. When the mega menu becomes the main discovery surface, remove overlapping sibling flyouts instead of making every nav item expandable. Treat the brand accent as an orientation signal, not a surface treatment: keep panels, cards, borders, and shadows neutral, then reserve accent color for the current location or one meaningful status.
- **Source:** success · 2026-07-17 · Platform mega menu

### Apply decorative fades to the artwork layer, not the content wrapper
- **When:** Fading a section background into the next surface while interactive diagrams or cards sit above it.
- **Lesson:** A foreground gradient on the shared content wrapper will dim nodes, labels, connectors, and controls along with the artwork. Put the mask or gradient on the background pseudo-element itself, and ensure the background image covers the section so its physical edge never appears. Keep semantic and interactive content in a separate unfaded layer.
- **Source:** failure to success · 2026-07-17 · architecture bottom fade