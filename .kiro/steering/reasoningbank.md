---
inclusion: always
---

# ReasoningBank

A running memory of generalizable strategies and pitfalls learned while working
in this repo. Keep items concise, generalizable, and actionable. Refine existing
items rather than adding near-duplicates.

## Item schema

Each memory item uses this structure:

- **id**: short kebab-case identifier
- **title**: one-line summary of the lesson
- **trigger**: the situation/context where this applies
- **insight**: the generalizable strategy or pitfall
- **action**: what to do about it

## Memory Bank

### css-button-vertical-centering
- **trigger**: A button rendered as an `<a>` or inline element uses `min-height` (often with `padding: 0` vertically) and its label looks vertically off-center.
- **insight**: `min-height` alone does not vertically center text on inline/anchor elements; there is no layout context to align the label.
- **action**: Add `display: inline-flex; align-items: center; justify-content: center;` (and `line-height: 1`) to the button rule so the label centers regardless of height.

### css-aspect-ratio-in-fixed-container
- **trigger**: A component reused inside a scoped wrapper with a fixed height and `overflow: hidden` gets its bottom clipped or shows unwanted bars, especially when its base rule sets `aspect-ratio`.
- **insight**: An inherited `aspect-ratio` computes height from the element's (often wide) width, overriding the wrapper's intended height and pushing content past the clipping boundary; large `vw`/`clamp` insets add side bars.
- **action**: In the scoped override set `aspect-ratio: auto; height: 100%; min-height: 0` so the element matches the container, and tighten `vw`-based insets. Re-assert the original sizing inside media queries so the fix does not leak into other breakpoints.

### css-fixed-containing-block-transform-filter
- **trigger**: A `position: fixed` element (e.g. a dropdown/mega-menu) drifts off-center or moves as the viewport widens/zooms, and its `left`/`vw` offsets seem measured from an ancestor rather than the viewport.
- **insight**: An ancestor with `transform`, `filter`, `backdrop-filter`, `perspective`, `will-change`, or `contain` becomes the containing block for `position: fixed` descendants, so `left`/`top` (even with `vw`) are relative to that ancestor's box, not the viewport. When that ancestor is centered with a max-width, its growing side margins push the fixed child sideways.
- **action**: Center the fixed element on its real containing block with `left: 50%; transform: translateX(-50%)` (percent, not `vw`), or remove the ancestor's `backdrop-filter`/`transform`. Also note `height: 100%` collapses to 0 when any ancestor has auto height — prefer an explicit px height to match a fixed-size wrapper.

### css-hide-element-reclaim-reserved-space
- **trigger**: You `display: none` an absolutely/fixed-positioned element (e.g. a footer bar or overlay) but a gap or dead space remains where it used to be.
- **insight**: Out-of-flow elements don't reserve their own space; sibling elements often reserve it manually via `bottom`/`top`/`padding` insets. Hiding the element alone leaves that reserved gap behind.
- **action**: When hiding such an element, also shrink the inset/padding on whatever element reserved space for it (e.g. reduce a neighboring container's `bottom`) so the layout closes the gap.

### css-scale-anchor-corner
- **trigger**: A CSS `scale()` zoom crops or pushes a specific edge/corner out of view, and you want a chosen corner to stay fixed while the rest expands.
- **insight**: The point that stays put under `scale()` is the `transform-origin`; any accompanying `translate()` in the same transform shifts content and defeats the anchor, causing the crop.
- **action**: Set `transform-origin` to the corner to anchor (e.g. `100% 0` for top-right) and use a pure `scale()` with no translate, so content expands away from that corner (e.g. toward bottom-left).

### react-reuse-component-not-copy-markup
- **trigger**: User asks to copy a section/element "one-to-one" from one page into another in a component-based app (React/Vue/etc).
- **insight**: Rendering the existing component in the new page is a more faithful and maintainable "copy" than duplicating its markup, but only works if the new entry point already loads the same styles (shared CSS import, Tailwind pipeline) and the component's hooks/assets resolve.
- **action**: Import and render the original component at the target location; first confirm the target's entry file imports the needed stylesheet (e.g. `index.css`) so classes/utilities apply, then build to verify shared hooks/assets bundle correctly. The component may carry baked-in context styling (background color, `::after`/`::before` gradient overlays) that clashes with the new page — override these with a page-scoped selector (e.g. `.scratch-page .band`) instead of editing the shared rule, and remember to match pseudo-element gradients too, not just the base background.

### css-force-image-to-solid-color
- **trigger**: An `<img>`/SVG logo with a baked-in dark (or fixed) color is unreadable on its background, and you can't swap in a recolored asset.
- **insight**: `filter: brightness(0) invert(1)` collapses any image to a solid white silhouette (use `brightness(0)` alone for black); combined filters can recolor an image without editing it. Per-logo targeting is easy when items expose a `data-*` attribute (e.g. `img[data-logo="jira"]`).
- **action**: Apply the filter scoped to the specific image (via its `data-*` attr or class), typically on `:hover` or wherever the default treatment breaks readability, rather than changing the shared image styling for all items.
- **caveat**: A CSS `filter` recolors the ENTIRE image uniformly — it cannot recolor just part (e.g. whiten a wordmark while keeping a colored icon). When only part must change, edit the SVG source directly: change the `fill` on the specific path(s) (e.g. the wordmark letters from `#101214` to `#fff`) and leave the icon paths untouched, then remove any now-redundant hover filter.

### css-bento-grid-template-areas
- **trigger**: Recreating a "bento" / mixed-size card grid where cards span different numbers of columns/rows (e.g. one wide card, one tall card spanning two rows).
- **insight**: `grid-template-areas` expresses the spans declaratively and readably — repeat an area name across cells to span it — which is far easier to get right than juggling `grid-column`/`grid-row: span N` per card.
- **row-height pitfall**: Do NOT size rows with an unbounded `vh` (e.g. `minmax(220px, 44vh)`) — as the viewport/zoom grows, `vh` has no upper cap and the whole grid scales toward infinity. Instead define a capped unit like `--bento-unit: clamp(240px, 24vw, 340px)` and derive proportional rows with `calc()` (e.g. rows `unit / (unit/2) / (unit/2) / unit` makes quad rows half-height while a 2-row-spanning card equals one full unit). This keeps exact ratios AND bounds the size.
- **action**: Name each card an area, lay out the ASCII grid in `grid-template-areas`, assign `grid-area` per card, and for a user-populated layout leave an empty flex media region in each card with the label pinned via a bottom-padded footer. Collapse to one column at small widths with `grid-template-areas: none; grid-auto-rows: ...; grid-area: auto`.
- **connected variant**: For touching cards with hairline dividers and rounded corners ONLY on the outer 4 corners of the whole grid: set the grid `gap: 1px` with a light `background` (the gap bleeds through as divider lines), move `border` + `border-radius` + `overflow: hidden` + `box-shadow` onto the grid container, and strip per-card `border`/`border-radius`/`box-shadow`. `overflow: hidden` clips the inner square corners while the container radius rounds the outer ones; box-shadow on the container is not clipped.

### css-multi-edge-fade-and-bleed
- **trigger**: You want a preview/panel to look "cut off" and fade to the background on TWO edges at once (e.g. right + bottom), like a Framer bento card, without shrinking the content to fit.
- **insight**: A single `mask-image` gradient only fades one direction. Layer two gradients and combine with `mask-composite: intersect` (plus `-webkit-mask-composite: source-in`) so only the region opaque in BOTH masks stays visible — fading the other two edges. Fading to transparent reveals the container's background, so on a black page it reads as "fade to black". To get the cut-off, absolutely-position the inner panel anchored top-left with `height: auto` (and a `min-width`) inside an `overflow: hidden` card so extra rows/columns spill past and clip.
- **action**: Put the fade mask on the media wrapper (not the label), keep the card label as a separate absolutely-positioned element above the fade with its own z-index so it stays fully readable.
- **short-container caveat**: The aggressive bleed (`min-height: calc(100% + Npx)` pushing content past the edge) only looks good when the container is tall enough. In a short card it shoves the key content (e.g. a chart) out of view. There, instead FIT the panel to the container (`height: 100%`) and apply only a soft edge fade (mask stop ~85-90%, not 60-66%) so content stays visible with just a gentle blend at the very edge.

### port-vanilla-animation-to-react
- **trigger**: Turning a standalone HTML/CSS/JS animation (often click-triggered, with global class names) into a component that lives inside an existing app/page.
- **insight**: Direct copy risks global CSS leakage (bare classes like `.odd`/`.even`), keyframe-name collisions, and a trigger model (onclick) that doesn't fit a showcase context. The CSS transition/animation timings are the valuable part — preserve them; replace only the trigger and scope.
- **action**: Prefix every class and rename `@keyframes` to component-scoped names; dedupe repeated SVG/markup into a data array rendered by a small sub-component; drive looping with an `IntersectionObserver` (run only in view) plus chained timers matching the animation duration, toggling an `is-active` class rather than relying on click/`animationend`; add a `prefers-reduced-motion` branch that holds a calm end state; rebuild to confirm it bundles.

### css-loop-reset-flash
- **trigger**: A looping (or re-triggered) animation flashes an element for a single frame at the moment it resets — often when a previously faded-out child snaps back to its "ready"/visible state for the next cycle.
- **insight**: On reset, base styles reapply simultaneously: a parent may transition its opacity 1→0 over a few ms while a child group instantly returns to `opacity: 1`, so for one frame parent×child are both visible. The tiny (e.g. `1ms`) parent transition is enough to cause the overlap.
- **action**: Make the parent hide instantly (`transition: opacity 0s`) and delay the child's return-to-visible until after the parent is hidden (`transition: opacity 0s <delay>ms`), so the "ready" state is only restored while the parent already masks it.

### css-mixed-logo-row-sizing
- **trigger**: A row of brand logos mixes wide wordmarks (e.g. servicenow, Microsoft, Jira) with square/compact icons (e.g. Azure); with a fixed square size the wordmarks look tiny while the square icon fills its box.
- **insight**: Constraining logos to a fixed `width` + `height` square forces wide-viewBox wordmarks to shrink their glyphs to fit the height-limited square. Sizing by a shared HEIGHT with `width: auto` makes every logo render at the same cap height regardless of aspect ratio.
- **action**: Use a flex row and set the images to `height: <clamp>; width: auto; object-fit: contain` with a `max-width` cap so a very wide wordmark can't dominate. This is the same pattern marquee logo strips use.

### svg-node-graph-aligned-to-html-chips
- **trigger**: Building a small "flow/routing" diagram — HTML node chips connected by lines — that must stay aligned as the container resizes.
- **insight**: Position the chips with percentage `left/top` and draw the connectors in an SVG whose `viewBox="0 0 100 100"` with `preserveAspectRatio="none"` uses the SAME percentage coordinate space, so line endpoints and chips line up automatically at any size. `vector-effect: non-scaling-stroke` keeps stroke/dash width constant despite the stretch.
- **action**: End each connector a few units under the chip so the chip's solid background hides the join. Give each line its own origin height so segments don't overlap. For rounded right-angle elbows under `preserveAspectRatio="none"`, quadratic corners need a SMALLER x-radius than y-radius (≈ ratio of height:width) or they look stretched. Tuck-under + per-line origins + asymmetric corner radii = clean result.

### css-resize-panel-without-moving-centered-content
- **trigger**: You need to grow/shrink an absolutely-positioned panel on one side (e.g. extend it further down) but its centered content must stay visually in place.
- **insight**: Content centered with `justify-content: center` recenters whenever the box height changes, so moving the `bottom` inset drags the rows with it. The centered position depends on `(paddingTop + boxHeight - paddingBottom)`.
- **action**: When you change an inset by ΔH to resize the box, add the same ΔH to the padding on that side (reduce `bottom` by ΔH → increase `padding-bottom` by ΔH). The content area and its center stay constant while the panel edge extends.

### promote-sandbox-page-to-main-vite
- **trigger**: Promoting a sandbox/"scratch" page to become the primary page in a multi-page Vite app, replacing the old landing.
- **insight**: The swap is more than repointing one entry: the old page's entry (`main.jsx`), the multi-page `rollupOptions.input` map, page-relative links (e.g. brand `href="/scratch.html"` → `/`), and the initial inline `<style>`/theme-color in the host HTML all need updating, or you get a redundant duplicate page, a load-flash, or dead links.
- **action**: Repoint the main entry to render the new root + its CSS; remove the now-redundant page from `rollupOptions.input` and delete its `.html`/entry files; delete the unreferenced old root component; fix page-relative links to `/`; align the host HTML's inline background/theme-color to the new page. When two variants of a feature exist (e.g. a mailto-only form vs an API-backed one), carry over the one with real working integration. Build to confirm the other pages still emit.

### form-fetch-falls-back-to-mailto-is-cors
- **trigger**: A contact/lead form that POSTs to an API "isn't working" — it silently opens the email app (mailto fallback) instead of submitting, especially in local dev.
- **insight**: The `try { fetch(API) } catch { mailto }` pattern swallows CORS failures: if the current origin isn't in the API's allowlist the browser blocks the request, `fetch` throws, and the catch runs the fallback — looking like a form bug when the request never reached the server. Same code works on the production origin (which IS allowlisted), so "it worked before" usually means it was tested on the deployed domain.
- **action**: Check the API's CORS allowed-origins list (e.g. SAM `AllowedOrigins` / Lambda `ALLOWED_ORIGIN`) against the current origin+PORT. Vite defaults to 5173/4173; if the allowlist only has :8080, run dev/preview on the allowed port (`vite --port 8080 --strictPort`) or add the dev port and redeploy. Also verify form field `name`s match what the backend reads (e.g. backend read `improve` but the field was `goal`, so that value was silently dropped).

### gsap-scrollto-vs-css-smooth-and-anchor-offset
- **trigger**: Adding GSAP `ScrollToPlugin` smooth scrolling for in-page anchor/nav links.
- **insight**: GSAP animates scroll by setting the scroll position every frame; if CSS `html { scroll-behavior: smooth }` is also set, the browser re-animates each of those per-frame jumps and the motion becomes janky/laggy — the two smoothers fight. A sticky/fixed header also makes targets land underneath it unless you offset.
- **action**: Set `scroll-behavior: auto` when GSAP owns scrolling. Register the plugin once (`gsap.registerPlugin(ScrollToPlugin)`), delegate one document click listener for `a[href]` whose href contains `#` (accept `#x` and `/#x`, skip links to other pages by checking the part before `#` is empty or `/`), `preventDefault`, then `gsap.to(window, { scrollTo: { y: target, offsetY: headerHeight }, ease })`. Honor `prefers-reduced-motion` with `duration: 0`, and `history.pushState` the hash.
