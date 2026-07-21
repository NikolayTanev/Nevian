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
- **Lesson:** The section runs a rAF loop that eases a continuous `selectedFloat` scroll value and writes visuals via refs inside `updateVisuals`; scroll decides WHICH step is active (`activeIndex` via `Math.round`, which swaps at the midpoint between titles). CONTENT TRANSITION — the important design lesson: do NOT map copy opacity directly to scroll position. Mapping opacity to `selectedFloat` reads as a janky scroll event (its speed is the user's scroll speed) and fading one element out then back in looks like a blink. The user rejected that approach twice. Instead trigger a real, TIME-BASED crossfade when `activeIndex` changes, fully decoupled from scroll speed: keep the previous step mounted for one transition (state `{ index, id }`, cleared on `onAnimationEnd`), render two `.nevian-journey-copy-layer` divs where the incoming one animates in (fade + rise + blur clearing, ~0.44s, ease-out-expo `cubic-bezier(.16,1,.3,1)`) while the outgoing one animates out over it (absolute/inset:0, fade + drift up + blur, ~0.28s, ease-in). Exit shorter than enter. Reduced motion = plain quick opacity crossfade, no movement/blur. PACING: dwell per step = track height minus sticky stage height (`@media (min-width:1024px)` `.nevian-journey-track` vs `.nevian-journey-stage` 100vh); grow track height to space steps out when the overall section can become longer, not `STEP_SPACING` (which is label spacing/travel speed). If the track boundaries must stay fixed, extra distance cannot be added to every interval. Use a monotonic piecewise desktop progress map to spend part of the final hold on earlier transitions, and use the inverse mapping for hash and navigation jumps. For mobile, the requested design is now a natural-height stack of complete step cards, not a sticky rail or scroll-driven active step. Each card contains its own phase, headline, metric, description, and tags; keep the desktop rAF journey isolated behind the 1024px breakpoint.
- **Source:** failure→success · 2026-07-16 · scroll-mapped opacity rejected twice; reworked into a time-based two-layer crossfade (per impeccable brand/animate guidance)

### Get a "poppy/jumpy" feel without dated bounce/elastic easing
- **When:** A user asks for a bouncy, jumpy, or poppy animation, or for a cycling deck to feel alive without dated bounce easing or visible resets.
- **Lesson:** Build overshoot into the keyframes, not the easing curve. Use a normal ease-out (`cubic-bezier(.22,1,.3,1)`) and add a restrained mid-keyframe past the resting state, then settle. Add liveliness with short sibling staggers, and let parent and child layers own different transform properties so animations compose. For a tightly overlapping deck of same-sized cards, do not combine large 3D exit arcs, alternating fan positions, and simultaneous slot advancement. The cards will visually cut through one another even if their z-index values are technically correct. Prefer a simpler shared timeline: fade and slightly lift only the top card, reset it to the rear while fully invisible, and move every remaining card forward along the same straight offset vector. Keep rear layers bright enough to read, and always provide a clear static stack under `prefers-reduced-motion`.
- **Source:** failure · 2026-07-21 · 3D hero deck paths crossed during simultaneous slot changes

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
- **Lesson:** Track pointer coordinates on a stable parent, keep real controls separate, and use an ambient layer plus a cursor-clipped spotlight layer. Keep the ambient copy outline-led, while the spotlight restores brightness locally. A radial mask can still become rectangular near an element boundary even after removing `overflow: hidden`, because the masked element has a finite border box. Give the spotlight an oversized outer bleed canvas, offset its mask and reticle coordinates by that bleed, and place the real panels in an inset inner canvas so their layout does not move. For cross-section continuity, publish the cursor position on a shared ancestor and let the receiving sibling render its own continuation glow. Subtle connector flow, beacon pulses, waveform motion, and a breathing reticle add depth when they run only during hover and are disabled under reduced motion. Gate the entire pointer-driven composition by both sufficient width and `hover: hover` with `pointer: fine`; a width-only tablet breakpoint can replace usable mobile content with oversized decorative layers on touch devices. When adapting a reference composition, keep spotlight coordinates on the stable full-surface parent even if cards and copy move into new columns. Reposition every SVG connector endpoint with the cards so the visual reads as one system rather than layered pieces that drift apart. A requested 2 by 2 composition does not require rigid rows: stagger card size and vertical position when the visual is illustrative rather than tabular. If an experimental reveal becomes distracting, disable the spotlight layer in CSS and strengthen the ambient layer instead of deleting the interaction code, so it can be restored without reconstruction.
- **Source:** failure to success · 2026-07-20 · mobile adaptation and split desktop hero iterations

### Move diagram nodes and connection geometry together
- **When:** Repositioning or responsively scaling a node in a diagram where CSS-positioned elements sit over SVG connector paths.
- **Lesson:** Treat the node and every attached route as one layout unit. Update the node coordinate, SVG path endpoints, junction markers, and animated motion paths together. If the destination node stays fixed, reroute the connector between the new source and the unchanged destination instead of shifting the whole branch. For compact desktops, preserve readability before preserving composition: if a side-by-side layout truncates labels or shrinks nodes too far, stack the heading above the diagram and only apply modest uniform scaling. When uniform scaling is still appropriate, use a shared origin and compensate the layout width so nodes, connectors, and motion stay aligned. Give every visible route its own motion path; style stationary junctions differently from moving markers so they do not look like failed animations.
- **Source:** failure to success · 2026-07-20 · architecture positioning, compact scaling, and flow motion

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


### Avoid generic cyber motifs in Nevian marketing surfaces
- **When:** Designing CTA panels, section backgrounds, or decorative brand moments for the Nevian site.
- **Lesson:** Circuit traces, dot matrices, neon corner glows, and dense technical decoration make the brand feel generically cybernetic and disconnected from the rest of the site. Rounded cards are still part of the desired visual language, so keep the contained panel and soft corners when they help the composition. Simplify the treatment instead: use restrained black and green surfaces, one soft directional light source, subtle grain, and typography-led hierarchy. Let the product diagrams carry the technical detail.
- **Source:** failure to success · 2026-07-20 · closing CTA redesign and card correction


### Keep labels outside horizontally scrolling mobile controls
- **When:** Converting a desktop sidebar, tab list, or navigation column into a horizontal mobile strip.
- **Lesson:** Do not leave a sticky section label inside the horizontal scroll track. It consumes scarce width and can overlap the first interactive item. Hide it or place it in a separate row, then let only equal-width controls scroll with clear snap points while the selected content stays full width below.
- **Source:** failure to success · 2026-07-20 · mobile hero ticket strip


### Align responsive fixes with the actual layout mode
- **When:** A site switches to compact navigation or mobile composition at one breakpoint, while individual components still use narrower phone-only breakpoints.
- **Lesson:** Treat the breakpoint that changes the overall layout mode as the mobile boundary, even when it includes tablets. Apply simplified components consistently through that range so intermediate widths do not retain squeezed desktop fragments. Audit every section transition as one shared boundary: avoid stacking an outgoing fade, incoming fade, and large padding together. Prefer a shared surface color, one short transition treatment, and modest spacing.
- **Source:** failure to success · 2026-07-20 · mobile hero and section transition cleanup


### Scope contrast changes to text, not icon containers
- **When:** Increasing label contrast in diagrams or controls that use SVG icons with `currentColor`.
- **Lesson:** A broad `color` override on a node or icon container can recolor both copy and SVG strokes, while image filters can also flatten branded marks. When the request names text, target text-bearing elements such as headings, labels, and tooltip copy directly. Preserve icon colors and logo filters unless the user explicitly asks to change them.
- **Source:** failure to success · 2026-07-20 · architecture text contrast correction


### Let preview motion and composition explain the feature
- **When:** Adding hover motion or adapting a rich preview style to navigation cards, feature cards, or larger product illustrations.
- **Lesson:** Do not apply one generic lift or pulse to every preview, and do not copy only the reference surface treatment. Map motion to meaning: scan context bars, activate workflow steps in order, confirm security with restrained rings, and connect integrations with a stagger. Carry over the reference's information architecture too, such as a substantial visual preview above a clearly separated title-and-description footer. A large card with one small cluster of content in the middle feels empty even when its borders, glow, and colors match. Use the available area to tell one legible product story, trigger the same feedback on keyboard focus, keep motion subtle, and disable it under `prefers-reduced-motion`.
- **Source:** failure to success · 2026-07-21 · Platform previews and hero deck content rebuild

### Anchor in-flow hero visuals to explicit grid areas
- **When:** Replacing an absolutely positioned hero illustration with an in-flow interactive component inside a multi-column grid.
- **Lesson:** Grid auto-placement follows DOM order, so a visual inserted before the copy can silently take the first column and swap the intended composition. Put the copy before the visual for matching reading order, assign both elements explicit grid columns and rows, and size the visual from its grid track rather than `vw`, which can overflow into the neighboring copy. For an expanding-card stack that must always show tabs on both sides, derive fixed left and right preview slots from the active card instead of splitting tabs solely by array index.
- **Source:** failure to success · 2026-07-21 · interactive hero stack positioning

### Avoid hover-intent delays on narrow moving targets
- **When:** A small tab, rail, or collapsed card expands on hover and changes the surrounding layout.
- **Lesson:** A hover-intent timeout is unreliable when the target is only a few pixels wide and begins shifting neighboring elements. Pointer leave can cancel activation before the timeout fires, making the control appear broken. Activate immediately on pointer enter and let the visual transition provide the pacing. Bind the handler directly to the visible control as well as supporting focus and click for keyboard and deliberate activation.
- **Source:** failure to success · 2026-07-21 · expanding hero card tabs
