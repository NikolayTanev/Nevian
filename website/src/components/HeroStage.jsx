import { memo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ArrowUp, Check, Laptop, Plus, ScrollText, UserRound } from 'lucide-react';
import NevianAppPreview from './NevianAppPreview.jsx';
import '../hero-stage.css';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

// Apple-style spring, same parameters as SwiftUI's
// .spring(response:dampingFraction:). `response` is the period of the
// undamped spring in seconds (lower = snappier); `damping` 1 settles with no
// overshoot, below 1 overshoots and settles (0.65-0.85 is the subtle range).
// Returns a GSAP ease plus the duration it takes to settle within 0.1%, so the
// tween ends exactly when the spring comes to rest.
function spring(response, damping) {
  const w0 = (2 * Math.PI) / response;
  const decay = damping * w0;
  const duration = Math.log(1000) / decay;
  if (damping >= 1) {
    return { duration, ease: (p) => (p >= 1 ? 1 : 1 - Math.exp(-w0 * p * duration) * (1 + w0 * p * duration)) };
  }
  const wd = w0 * Math.sqrt(1 - damping * damping);
  return {
    duration,
    ease: (p) => {
      if (p >= 1) return 1;
      const t = p * duration;
      return 1 - Math.exp(-decay * t) * (Math.cos(wd * t) + (decay / wd) * Math.sin(wd * t));
    },
  };
}

// Composer drop: overshoots the dock by ~3% (about 13px on the full size
// window) and springs back. Width and centring use the same response with no
// bounce, so only the vertical travel overshoots.
const DOCK_Y_SPRING = spring(0.5, 0.75);
const DOCK_X_SPRING = spring(0.5, 1);
const PRESS_SPRING = spring(0.3, 0.6); // send button popping back after the press

// The story only runs where the full window fits on screen and motion is welcome.
// Everywhere else the stage stays the plain interactive preview.
const STORY_QUERY = '(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)';
const PREVIEW_WIDTH = 1240;
const PREVIEW_HEIGHT = 722;
const NAV_HEIGHT = 56;
const STAGE_CHROME = NAV_HEIGHT + 44 + 48; // nav + skip row + top/bottom breathing room
const MAX_SCALE = 1.2;
const PX_PER_UNIT = 480; // scroll distance per story unit; higher reads slower
const DOCK_WIDTH = 560; // composer width once it moves to the bottom of the canvas
const DOCK_BOTTOM = 16;

// The scenario is approval-first on purpose: Nevian checks policy, asks the
// requester's manager, and only acts after a person approves.
const PROMPT = 'I need Adobe Creative Cloud for the spring campaign.';
const TYPE_AT = 0.6; // story time when typing starts and the story composer takes over
// Story time when typing has finished and the send plays on its own (see
// `handoff` in buildStory). Typing ends at 2.0.
const SEND_AT = 2.05;

// Resting states: [story time, hold length]. Each adds a stretch of scroll where
// nothing changes, so the state can be read before the next one starts.
const RESTS = [
  [4.85, 2.0], // request scoped
  [6.85, 2.0], // policy checked
  [7.8, 1.5], // approval requested
  [10.6, 2.4], // approved and deployed
  [11.8, 2.8], // ticket record
];

// Connector lines: [story time the line starts, base draw length]. Each line
// draws over twice its base length, and that extra length is inserted as
// scroll right after the line starts, so everything that follows (the card it
// leads to, the next step) moves later by the same amount and still lands as
// the line arrives.
const LINE_SCROLL = 4; // multiplier on scroll per line; 1 = base, 4 = four times
const LINES = {
  policy: [5.25, 0.55],
  approval: [6.95, 0.65],
  actions: [8.3, 0.55],
};
const LINE_STRETCH = Object.values(LINES).map(([at, base]) => [at, base * (LINE_SCROLL - 1)]);

// Ticket record entries: story time they start, and a multiplier on the scroll
// they take to appear (1 = base 0.6 units for all four, 2 = double).
const RECORD_AT = 11.05;
const RECORD_SCROLL = 2;
const RECORD_STRETCH = [[RECORD_AT, 0.6 * (RECORD_SCROLL - 1)]];

// Story time -> timeline time, with every earlier hold and line stretch inserted.
const warp = (time) => [...RESTS, ...LINE_STRETCH, ...RECORD_STRETCH].reduce((total, [at, hold]) => (time > at ? total + hold : total), time);

const policyRows = [
  ['Requester', 'Linda Mogridge · Marketing'],
  ['Device', 'NEV-LT-042 · compliant'],
  ['Licenses', '3 of 25 free'],
  ['Cost', '$54.99 per month'],
  ['Approval', 'Manager required', 'warn'],
];

const actions = [
  'Assigned Photoshop and Illustrator licenses',
  'Installed both apps on her laptop with Intune',
  'Sent Linda the install note in Teams',
];

const recordEntries = [
  ['09:14', 'Ticket opened from chat', 'Linda Mogridge'],
  ['09:15', 'Approval requested', 'Priya Raman, manager'],
  ['09:21', 'Approved', 'Priya Raman'],
  ['09:22', 'Licenses assigned, apps deployed', 'Intune · NEV-LT-042'],
];

// Audit entries that follow the scroll: [story time, count]. The approval and
// the deployment each add one more when their timed sequence finishes.
const auditSteps = [[3.0, 1], [7.3, 2]];

// Timed sequences (seconds of real time, not scroll). They start once the
// scroll reaches their card and then play on their own.
const APPROVAL = {
  startAt: 7.8, // story time: approval card fully in
  dueAt: 8.3, // story time: if the visitor scrolls this far first, it finishes 4x faster
  clickAt: 3.0, // "Nothing is installed until Priya answers" spins for 3 s, then Approve is clicked
  approvedAt: 4.0, // 1 s after the click, the approval lands
};
const DEPLOY = {
  startAt: 9.15, // story time: actions card fully in
  dueAt: 10.6,
  stepDone: [2.0, 4.0, 6.0], // each action spins for 2 s, one after the other
  resolvedAt: 6.2,
};

function NevianMark() {
  return <span className="nva-avatar is-nevian" style={{ width: 18, height: 18 }}><img src="/assets/logo.png" alt="" /></span>;
}

function ResolvedIcon() {
  return (
    <svg className="nvs-status-icon" viewBox="0 0 14 14" aria-hidden="true">
      <circle cx="7" cy="7" r="6.25" fill="#22b573" />
      <path d="M4.4 7.2 6.2 9l3.4-3.6" fill="none" stroke="#050505" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// The wrapper is what gets hidden once resolved (see `resolve` in
// buildStory); the inner <i> only runs the CSS rotation.
function Spinner() {
  return <span className="nvs-spin-wrap"><i className="nvs-spinner" /></span>;
}

function WorkState({ working = 'Working', done = 'Done' }) {
  return (
    <span className="nvs-swap nvs-state">
      <span><i className="nvs-spinner" /> {working}</span>
      <span className="is-done"><Check /> {done}</span>
    </span>
  );
}

// Scripted layer drawn over the main panel. The real sidebar stays visible
// around it, so the story reads as the actual product doing the work.
// Memoized: GSAP writes text and styles into it, so React must never re-render it.
const StoryOverlay = memo(function StoryOverlay() {
  return (
    <div className="nvs" aria-hidden="true">
      <div className="nvs-surface">
        <header className="nvs-bar">
          <span className="nvs-swap nvs-title">
            <span>
              <span className="nvs-swap nvs-title-icon"><Spinner /><ResolvedIcon /></span>
              <em>NEV-0035</em> Adobe Creative Cloud
            </span>
          </span>
          <span className="nvs-bar-center">
            <span className="nvs-pill">
              <span className="nvs-swap nvs-pill-icon">
                <Spinner />
                <Check />
              </span>
              <span className="nvs-swap nvs-pill-text">
                <span>Clarifying the request</span>
                <span>Checking the software policy</span>
                <span>Waiting for Priya Raman</span>
                <span>Approved, deploying to NEV-LT-042</span>
                <span>Resolved in 8 minutes</span>
              </span>
            </span>
          </span>
          <span className="nvs-audit"><ScrollText /> Audit entries <b className="nvs-count-audit">0</b></span>
        </header>

        <div className="nvs-canvas">
          <div className="nvs-world">
            <svg className="nvs-lines" viewBox="-600 0 1700 600" width="1700" height="600">
              <path className="nvs-line-policy" pathLength="1" d="M 214 144 H 286" />
              <path className="nvs-line-approval" pathLength="1" d="M 214 144 H 236 Q 248 144 248 156 V 384 Q 248 396 260 396 H 286" />
              <path className="nvs-line-actions" pathLength="1" d="M 570 144 H 582 Q 594 144 594 156 V 203 Q 594 215 606 215 H 616" />
              <path className="nvs-line-actions" pathLength="1" d="M 570 396 H 582 Q 594 396 594 384 V 227 Q 594 215 606 215 H 616" />
            </svg>

            <div className="nvs-context">
              <div className="nvs-node"><span><b>Linda Mogridge</b><small>Marketing · Entra ID</small></span><i><UserRound /></i></div>
              <div className="nvs-node"><span><b>NEV-LT-042</b><small>Managed device</small></span><i><Laptop /></i></div>
            </div>

            <div className="nvs-convo">
              <div className="nvs-msg">
                <small>Linda Mogridge · 09:14</small>
                <h3>{PROMPT}</h3>
              </div>
              <div className="nvs-q"><NevianMark /><p>Do you need the full suite, or only Photoshop and Illustrator?</p></div>
              {/* Linda's reply: same style and column as her first message. */}
              <div className="nvs-answer">
                <small>Linda Mogridge · 09:14</small>
                <h3>Only Photoshop and Illustrator.</h3>
              </div>
            </div>

            <div className="nvs-helper nvs-helper-policy">
              <div className="nvs-helper-label"><b>Software policy</b><WorkState /></div>
              <div className="nvs-window">
                <div className="nvs-window-bar"><i /><span>Policy · software-request</span></div>
                <ul className="nvs-policy">
                  {policyRows.map(([label, value, tone]) => (
                    <li key={label} className={tone === 'warn' ? 'is-warn' : undefined}>
                      <span>{label}</span>
                      <b>{value}</b>
                      {tone === 'warn'
                        ? <span className="nvs-swap nvs-policy-mark"><Spinner /><Check /></span>
                        : <Check />}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="nvs-helper nvs-helper-approval">
              <div className="nvs-helper-label"><b>Manager approval</b><WorkState working="Waiting" done="Approved" /></div>
              <div className="nvs-window">
                <div className="nvs-window-bar"><i /><span>Teams · Approvals</span></div>
                <div className="nvs-approval">
                  <div className="nvs-approver">
                    <span className="nva-avatar is-initials" style={{ width: 26, height: 26 }}>PR</span>
                    <span><b>Priya Raman</b><small>Linda&apos;s manager</small></span>
                  </div>
                  <p>Linda Mogridge asks for Photoshop and Illustrator. $54.99 per month on cost center Marketing 4100.</p>
                  <div className="nvs-approval-actions">
                    <span className="nvs-btn">Decline</span>
                    <span className="nvs-btn nvs-btn-approve">Approve</span>
                  </div>
                  <span className="nvs-swap nvs-approval-status">
                    <span><i className="nvs-spinner" /> Nothing is installed until Priya answers</span>
                    <span className="is-done"><Check /> Approved by Priya Raman at 09:21</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="nvs-result">
              <div className="nvs-helper-label"><b>Approved actions</b></div>
              <div className="nvs-window nvs-steps">
                <div className="nvs-steps-head"><b>Actions</b><span><b className="nvs-count-steps">0</b> of 3 completed</span></div>
                <ul>
                  {actions.map((action) => (
                    <li key={action} className="nvs-step">
                      <span className="nvs-swap nvs-step-mark"><Spinner /><Check /></span>
                      <span className="nvs-step-text">{action}</span>
                    </li>
                  ))}
                </ul>
                <code>approved by Priya Raman</code>
              </div>
            </div>
          </div>

          <div className="nvs-record">
            <header>
              <span className="nvs-record-id">NEV-0035</span>
              <b>Adobe Creative Cloud</b>
              <span className="nvs-record-status"><ResolvedIcon /> Resolved</span>
            </header>
            <p>Linda asked for Photoshop and Illustrator. The software policy needs her manager, so Nevian asked Priya Raman first and deployed the apps only after she approved.</p>
            <ol>
              {recordEntries.map(([time, what, meta]) => (
                <li key={what}>
                  <time>{time}</time>
                  <span><b>{what}</b><small>{meta}</small></span>
                  <Check />
                </li>
              ))}
            </ol>
            <code>policy software-request · manager approval · 4 audit entries</code>
          </div>
        </div>
      </div>

      {/* Starts exactly on top of the real Home composer, then docks at the bottom. */}
      <div className="nva-composer nvs-composer">
        <span className="nva-round"><Plus /></span>
        <span className="nvs-input">
          <span className="nva-composer-placeholder nvs-placeholder-ask">Ask anything</span>
          <span className="nvs-typed"><span className="nvs-typed-text" /><i className="nvs-caret" /></span>
          <span className="nva-composer-placeholder nvs-placeholder-reply">Reply to Nevian</span>
        </span>
        <span className="nva-round is-send nvs-send"><ArrowUp /></span>
      </div>
    </div>
  );
});

function buildStory(stage, navigateRef) {
  const q = gsap.utils.selector(stage);
  const one = (selector) => q(selector)[0];
  const app = one('.nva');
  const overlay = one('.nvs');
  const composer = one('.nvs-composer');

  // Scale the window so window + skip row always fit below the nav. Short
  // screens shrink it; large screens grow it a little (CSS widens the stage).
  const fit = () => {
    const pageWidth = document.documentElement.clientWidth - 72;
    const scale = Math.max(0.55, Math.min(
      MAX_SCALE,
      (window.innerHeight - STAGE_CHROME) / PREVIEW_HEIGHT,
      pageWidth / PREVIEW_WIDTH,
    ));
    stage.style.setProperty('--preview-scale', scale.toFixed(4));
  };

  // Place the story composer over the real Home composer (its start) and at the
  // bottom of the canvas (its dock). Layout offsets ignore the window's scale
  // transform, so the overlap is exact at any size.
  // Only one composer is ever visible: the real Home composer until typing
  // starts, then the story copy that sits on exactly the same spot. No two
  // translucent copies stacked during a fade.
  let homeComposer = null;
  const syncComposers = () => {
    const storyOwnsIt = tl.time() > warp(TYPE_AT);
    if (homeComposer) homeComposer.style.visibility = storyOwnsIt ? 'hidden' : '';
    // Before the send, the typing only ever shows on top of the real Home
    // composer. If the visitor opened another view, the copy stays hidden
    // until goHome has brought Home back and placeComposer has measured it.
    const placed = Boolean(homeComposer) || handoff.progress() > 0;
    composer.style.visibility = storyOwnsIt && placed ? '' : 'hidden';
  };

  const placeComposer = () => {
    const home = app.querySelector('.nva-home .nva-composer');
    if (homeComposer && homeComposer !== home) homeComposer.style.visibility = '';
    homeComposer = home;
    const width = overlay.offsetWidth;
    const height = overlay.offsetHeight;
    const dockWidth = Math.min(DOCK_WIDTH, width - 48);
    const composerHeight = home ? home.offsetHeight : composer.offsetHeight;
    const dock = { x: (width - dockWidth) / 2, y: height - DOCK_BOTTOM - composerHeight, w: dockWidth };
    const from = home
      ? { x: home.offsetLeft - overlay.offsetLeft, y: home.offsetTop - overlay.offsetTop, w: home.offsetWidth }
      : dock;
    const vars = { '--from-x': from.x, '--from-y': from.y, '--from-w': from.w, '--to-x': dock.x, '--to-y': dock.y, '--to-w': dock.w };
    Object.entries(vars).forEach(([name, value]) => composer.style.setProperty(name, `${value}px`));
    syncComposers();
  };

  // The story always starts from Home, wherever the visitor clicked to before.
  // Calls the preview's view setter directly: a synthetic click on the Home
  // nav item is lost while pinned (see navigateRef in NevianAppPreview).
  const goHome = () => {
    if (app.dataset.view === 'home') return;
    navigateRef.current?.('home');
  };
  const viewWatcher = new MutationObserver(() => requestAnimationFrame(placeComposer));

  stage.classList.add('is-story');
  fit();
  ScrollTrigger.addEventListener('refreshInit', fit);

  const titles = q('.nvs-title > *');
  const titleIcons = q('.nvs-title-icon > *');
  const pillTexts = q('.nvs-pill-text > *');
  const pillIcons = q('.nvs-pill-icon > *');
  const states = q('.nvs-state');
  const steps = q('.nvs-step');
  const policyItems = q('.nvs-policy li');

  // Everything that enters later starts hidden. gsap.matchMedia reverts these sets.
  gsap.set(overlay, { autoAlpha: 1 });
  gsap.set([
    one('.nvs-surface'), ...titles,
    ...states.map((state) => state.children[1]), ...steps.map((step) => step.querySelector('svg')),
    one('.nvs-approval-status').children[1], one('.nvs-policy-mark svg'),
    one('.nvs-placeholder-reply'), one('.nvs-pill'),
    one('.nvs-msg'), one('.nvs-q'), one('.nvs-answer'),
    ...q('.nvs-node'), one('.nvs-helper-policy'), one('.nvs-helper-approval'), ...policyItems,
    one('.nvs-result'), one('.nvs-record'), ...q('.nvs-record li'),
  ], { autoAlpha: 0 });

  const tl = gsap.timeline({ paused: true, defaults: { duration: 0.45, ease: 'power2.out' } });

  // All positions below are story times; warp() adds the reading holds.
  // fromTo with immediateRender: false keeps every step reversible while scrubbing.
  const show = (targets, at, vars = {}, from = { y: 12 }) => tl.fromTo(
    targets,
    { autoAlpha: 0, ...from },
    { autoAlpha: 1, x: 0, y: 0, scale: 1, immediateRender: false, ...vars },
    warp(at),
  );
  const hide = (targets, at, vars = {}) => tl.fromTo(targets, { autoAlpha: 1 }, { autoAlpha: 0, immediateRender: false, ...vars }, warp(at));
  const swap = (from, to, at) => {
    hide(from, at, { y: -6, duration: 0.25 });
    show(to, at + 0.15, { duration: 0.25 }, { y: 6 });
  };
  const tween = (targets, from, to, at, vars = {}) => tl.fromTo(targets, from, { ...to, immediateRender: false, ...vars }, warp(at));
  // autoRound: false is essential. GSAP rounds px values to whole pixels by
  // default, and with pathLength="1" the offset only runs 1 -> 0, so a rounded
  // tween jumps from hidden to fully drawn instead of drawing along the path.
  const draw = (targets, at, vars = {}) => tween(targets, { strokeDashoffset: 1 }, { strokeDashoffset: 0 }, at, { duration: 0.5, ease: 'power1.inOut', autoRound: false, ...vars });

  // Numbers and typed text are derived from the playhead on every update, so a
  // value driven in several segments is always correct, whichever direction or
  // distance the user scrubs.
  const readouts = [];
  const readout = (el, points, write = (node, value) => { node.textContent = value; }) => {
    readouts.push({ el, points: points.map(([time, value]) => [warp(time), value]), write, last: null });
  };
  const ramp = (time, points) => {
    if (time <= points[0][0]) return points[0][1];
    for (let i = 1; i < points.length; i += 1) {
      const [t1, v1] = points[i];
      const [t0, v0] = points[i - 1];
      if (time <= t1) return v0 + (v1 - v0) * ((time - t0) / (t1 - t0));
    }
    return points[points.length - 1][1];
  };
  const updateReadouts = () => {
    const time = tl.time();
    readouts.forEach((entry) => {
      const value = Math.round(ramp(time, entry.points));
      if (value === entry.last) return;
      entry.last = value;
      entry.write(entry.el, value);
    });
  };
  // Timed sequences for the approval and the deployment. They play on their
  // own clock once the scroll reaches them (see syncTimed); only these two
  // timelines touch the elements inside them.
  const timed = { defaults: { ease: 'power2.out', immediateRender: false }, paused: true };
  const approval = gsap.timeline(timed);
  const deploy = gsap.timeline(timed);

  // Status shown in the bar (pill text and icon, ticket icon, counters). It is
  // derived from the scroll position plus how far the timed sequences got, so
  // it is correct whichever way the visitor scrolls. Opacity changes fade via
  // the CSS transition on these elements.
  let scrollAudit = 0;
  const auditEl = one('.nvs-count-audit');
  const stepsCountEl = one('.nvs-count-steps');
  const showOnly = (els, index) => els.forEach((el, i) => { el.style.opacity = i === index ? '1' : '0'; });
  const renderStatus = () => {
    const time = tl.time();
    const approved = approval.time() >= APPROVAL.approvedAt;
    const resolved = deploy.time() >= DEPLOY.resolvedAt;
    const doneSteps = DEPLOY.stepDone.filter((at) => deploy.time() >= at).length;
    let pill = time < warp(5.0) ? 0 : time < warp(6.95) ? 1 : 2;
    if (approved) pill = 3;
    if (resolved) pill = 4;
    showOnly(pillTexts, pill);
    showOnly(pillIcons, resolved ? 1 : 0);
    showOnly(titleIcons, resolved ? 1 : 0);
    auditEl.textContent = scrollAudit + Number(approved) + Number(resolved);
    stepsCountEl.textContent = doneSteps;
  };

  // Start each sequence when the scroll reaches it; if the visitor scrolls past
  // its deadline first, speed it up so the story never gets ahead of it.
  // Scrolling back above it plays it backwards, 3x faster.
  const sequences = [];
  const syncTimed = () => {
    const time = tl.time();
    sequences.forEach((entry) => {
      const { chain } = entry;
      if (time >= warp(entry.startAt) && entry.ready()) {
        if (!entry.on || chain.reversed()) chain.timeScale(1).play();
        entry.on = true;
        if (time >= warp(entry.dueAt) && chain.progress() < 1) chain.timeScale(4);
      } else if (entry.on) {
        entry.on = false;
        chain.timeScale(3).reverse();
      }
    });
  };
  const sequence = (chain, { startAt, dueAt }, ready = () => true) => {
    sequences.push({ chain, startAt, dueAt, ready, on: false });
    chain.eventCallback('onUpdate', renderStatus);
    chain.eventCallback('onComplete', syncTimed);
  };

  tl.eventCallback('onUpdate', () => {
    // Until the request is sent the story needs Home on screen, so typing
    // never starts over Catalog or Tickets.
    const time = tl.time();
    if (time > 0 && time < warp(SEND_AT)) goHome();
    updateReadouts();
    syncComposers();
    syncHandoff();
    syncTimed();
    renderStatus();
  });
  const counter = (el, marks, write) => readout(el, marks.reduce((points, [at, value]) => (
    [...points, [at, value - 1], [at + 0.1, value]]
  ), [[0, 0]]), write);
  // Connectors draw from their left end to their right end, then the card they
  // lead to slides in from the left as the line arrives.
  const drawLine = (targets, name) => {
    const [at, base] = LINES[name];
    draw(targets, at, { duration: base * LINE_SCROLL });
  };
  const fromLeft = { x: -14, y: 0 };

  // 1. Linda types into the Home composer and sends.
  const typed = one('.nvs-typed-text');
  const askPlaceholder = one('.nvs-placeholder-ask');
  const caret = one('.nvs-caret');
  readout(typed, [[TYPE_AT, 0], [2.0, PROMPT.length]], (node, n) => {
    node.textContent = PROMPT.slice(0, n);
    askPlaceholder.style.opacity = n ? '0' : '1';
    // No caret until typing starts, so the copy matches the real composer.
    caret.style.visibility = n ? 'visible' : 'hidden';
  });
  // 2. Send and dock. This part is NOT scrubbed: once the scroll passes
  // SEND_AT it plays through on its own clock (and reverses on its own clock
  // when scrolling back above it), so it can never be left half-done with the
  // composer mid-way and the text half faded. Every property it animates is
  // owned only by this timeline, so the scrubbed story never fights it.
  const send = one('.nvs-send');
  const handoff = gsap.timeline({ paused: true, defaults: { ease: 'power2.out', immediateRender: false } });
  handoff
    .fromTo(send, { backgroundColor: '#242424', color: '#fafafa' }, { backgroundColor: '#fafafa', color: '#050505', duration: 0.12 }, 0)
    .fromTo(send, { scale: 1 }, { scale: 0.86, duration: 0.08, ease: 'power1.in' }, 0.12)
    .fromTo(send, { scale: 0.86 }, { scale: 1, ...PRESS_SPRING }, 0.2)
    .fromTo(send, { backgroundColor: '#fafafa', color: '#050505' }, { backgroundColor: '#242424', color: '#fafafa', duration: 0.2 }, 0.3)
    // The rest of Home is gone quickly, as the composer starts to move.
    .fromTo(one('.nvs-surface'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: 'power1.out' }, 0.2)
    .fromTo(one('.nvs-typed'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.12 }, 0.22)
    // Spring physics: the height travel overshoots and springs back into the
    // dock; width and centring settle on a critically damped spring.
    .fromTo(composer, { '--dock': 0 }, { '--dock': 1, ...DOCK_X_SPRING }, 0.22)
    .fromTo(composer, { '--dock-y': 0 }, { '--dock-y': 1, ...DOCK_Y_SPRING }, 0.22)
    .fromTo(one('.nvs-placeholder-reply'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.6);
  let handedOff = false;
  const syncHandoff = () => {
    const past = tl.time() >= warp(SEND_AT);
    if (past === handedOff) return;
    handedOff = past;
    if (past) handoff.play();
    else handoff.reverse();
  };
  show(titles[0], 2.85, { duration: 0.3 }, { y: 6 });
  show(one('.nvs-msg'), 2.9, { duration: 0.5 }, { y: 18 });
  show(q('.nvs-node'), 3.15, { stagger: 0.12 }, fromLeft);
  show(one('.nvs-pill'), 3.7, {}, { y: -8 });

  // 3. It asks before it guesses: only the apps she needs.
  show(one('.nvs-q'), 3.9);
  show(one('.nvs-answer'), 4.45, { duration: 0.5 }, { y: 18 });

  // 4. Policy check beside the request.
  tween(one('.nvs-world'), { x: 0 }, { x: -420 }, 4.9, { duration: 1.1, ease: 'power2.inOut' });
  hide(q('.nvs-node'), 4.9, { duration: 0.3 });
  tween(one('.nvs-convo'), { opacity: 1 }, { opacity: 0.45 }, 5.2, { duration: 0.5 });
  drawLine(one('.nvs-line-policy'), 'policy');
  show(one('.nvs-helper-policy'), 5.65, { duration: 0.5 }, fromLeft);
  show(policyItems, 5.9, { duration: 0.3, stagger: 0.14 }, { y: 6 });
  swap(states[0].children[0], states[0].children[1], 6.55);

  // 5. Manager approval: nothing runs until Priya answers.
  drawLine(one('.nvs-line-approval'), 'approval');
  show(one('.nvs-helper-approval'), 7.35, { duration: 0.45 }, fromLeft);

  // Timed: the request waits 3 s, Priya clicks Approve, 1 s later it lands.
  const markIn = (chain, el, at) => chain.fromTo(el, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.25 }, at);
  const markOut = (chain, el, at) => chain.fromTo(el, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -6, duration: 0.25 }, at);
  const approve = one('.nvs-btn-approve');
  const approvalStatus = one('.nvs-approval-status').children;
  const policyMark = one('.nvs-policy-mark');
  const { clickAt, approvedAt } = APPROVAL;
  approval
    .fromTo(approve, { backgroundColor: '#1a1a1a', color: '#d4d4d4' }, { backgroundColor: '#fafafa', color: '#050505', duration: 0.2 }, clickAt)
    .fromTo(approve, { scale: 1 }, { scale: 0.94, duration: 0.08, ease: 'power1.in' }, clickAt + 0.05)
    .fromTo(approve, { scale: 0.94 }, { scale: 1, ...PRESS_SPRING }, clickAt + 0.13);
  [approvalStatus, states[1].children].forEach(([waiting, done]) => {
    markOut(approval, waiting, approvedAt);
    markIn(approval, done, approvedAt + 0.1);
  });
  approval.fromTo(policyMark.querySelector('.nvs-spin-wrap'), { opacity: 1 }, { opacity: 0, duration: 0.2 }, approvedAt);
  markIn(approval, policyMark.querySelector('svg'), approvedAt + 0.1);
  approval.to({}, { duration: 0.1 }, approvedAt + 0.35);
  sequence(approval, APPROVAL);

  // 6. Only after approval: the actions, each spinning 2 s, one after another.
  drawLine(q('.nvs-line-actions'), 'actions');
  show(one('.nvs-result'), 8.65, { duration: 0.5 }, fromLeft);
  steps.forEach((step, index) => {
    const at = DEPLOY.stepDone[index];
    deploy
      .fromTo(step.querySelector('.nvs-spin-wrap'), { opacity: 1 }, { opacity: 0, duration: 0.2 }, at)
      .fromTo(step.querySelector('.nvs-step-text'), { color: '#616161' }, { color: '#d4d4d4', duration: 0.3 }, at);
    markIn(deploy, step.querySelector('svg'), at + 0.1);
  });
  deploy.to({}, { duration: 0.2 }, DEPLOY.resolvedAt);
  sequence(deploy, DEPLOY, () => approval.progress() === 1);
  counter(auditEl, auditSteps, (_, value) => {
    scrollAudit = value;
    renderStatus();
  });

  // 7. Every step on the record.
  tween(one('.nvs-world'), { opacity: 1 }, { opacity: 0.12 }, 10.7, { duration: 0.5 });
  show(one('.nvs-record'), 10.85, { duration: 0.5 }, { y: 24, scale: 0.97 });
  // The four entries reveal over RECORD_SCROLL times their base scroll; the
  // extra is inserted by RECORD_STRETCH in warp(), so the final hold still
  // starts after the last entry is in.
  show(q('.nvs-record li'), RECORD_AT, { duration: 0.3 * RECORD_SCROLL, stagger: 0.1 * RECORD_SCROLL }, { y: 6 });

  // The story ends on the record and stays there: the pin releases and the
  // page scrolls on with this final state, nothing reverts to Home.
  tl.to({}, { duration: 0.2 }, warp(11.85));
  tween(one('.scratch-story-progress b'), { scaleX: 0 }, { scaleX: 1 }, 0, { duration: tl.duration(), ease: 'none' });
  updateReadouts();
  renderStatus();

  // Pin with the window + skip row centred in the space below the nav.
  // pinType 'fixed' + pinReparent: while pinned, the stage moves to <body> and
  // is truly position: fixed. The default under ScrollSmoother is a per-frame
  // counter-transform, which can round differently from the page's own
  // transform on scaled displays and make the window shake by a pixel.
  // scrub 0.8: the story eases toward the scroll position over 0.8s, which
  // evens out wheel notches. It never runs past where the visitor stopped.
  const pinStart = () => `center ${(window.innerHeight + NAV_HEIGHT) / 2}px`;
  const trigger = ScrollTrigger.create({
    animation: tl,
    trigger: stage,
    start: pinStart,
    end: () => `+=${Math.round(tl.duration() * PX_PER_UNIT)}`,
    pin: true,
    pinType: 'fixed',
    pinReparent: true,
    scrub: true,
    anticipatePin: 1,
    onToggle: (self) => { if (self.isActive) goHome(); },
  });
  placeComposer();
  ScrollTrigger.addEventListener('refresh', placeComposer);
  viewWatcher.observe(app, { attributes: true, attributeFilter: ['data-view'] });

  return {
    trigger,
    cleanup: () => {
      viewWatcher.disconnect();
      ScrollTrigger.removeEventListener('refreshInit', fit);
      ScrollTrigger.removeEventListener('refresh', placeComposer);
      stage.classList.remove('is-story');
      stage.style.removeProperty('--preview-scale');
      composer.style.removeProperty('visibility');
      if (homeComposer) homeComposer.style.removeProperty('visibility');
    },
  };
}

function HeroStage() {
  const stageRef = useRef(null);
  const triggerRef = useRef(null);
  const navigateRef = useRef(null);

  // Passive effect on purpose: it runs after the page's layout effect has
  // created ScrollSmoother, so the triggers measure the smoothed page.
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(STORY_QUERY, () => {
      const story = buildStory(stageRef.current, navigateRef);
      triggerRef.current = story.trigger;
      return () => {
        triggerRef.current = null;
        story.cleanup();
      };
    });
    return () => mm.revert();
  }, []);

  const skip = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const y = trigger.end + 1;
    const smoother = ScrollSmoother.get();
    if (smoother) gsap.to(smoother, { scrollTop: y, duration: 1.2, ease: 'power2.inOut' });
    else gsap.to(window, { scrollTo: y, duration: 1.2, ease: 'power2.inOut' });
  };

  return (
    <section ref={stageRef} className="scratch-stage" id="how" aria-label="Nevian workspace preview">
      <div className="scratch-stage-clip">
        <div className="scratch-browser">
          <div className="scratch-demo">
            <NevianAppPreview navigateRef={navigateRef}><StoryOverlay /></NevianAppPreview>
          </div>
        </div>
      </div>
      <div className="scratch-story-row">
        <button type="button" className="scratch-story-skip" onClick={skip}>
          <span className="scratch-story-progress" aria-hidden="true"><b /></span>
          Skip the demo
        </button>
      </div>
    </section>
  );
}

export default memo(HeroStage);
