import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    key: 'Report',
    phase: 'Frictionless intake',
    headline: 'A request starts with a conversation.',
    stat: '0',
    statLabel: 'forms to fill',
    desc: 'Users describe the problem in plain language. Nevian understands the request without portals, dropdowns, or rigid scripts.',
    tags: ['Plain-language intake', 'Any channel', 'Instant response'],
  },
  {
    key: 'Triage',
    phase: 'AI classification',
    headline: 'Every ticket gets the right next step.',
    stat: '1.2s',
    statLabel: 'to full triage',
    desc: 'Nevian classifies urgency, identifies intent, and prepares the next action before a technician even opens the queue.',
    tags: ['Intent detection', 'Priority scoring', 'Smart routing'],
  },
  {
    key: 'Context',
    phase: 'Endpoint intelligence',
    headline: 'The full device picture is already there.',
    stat: 'Live',
    statLabel: 'endpoint context',
    desc: 'OS, hardware, disk, network, recent errors, and policy state arrive with the ticket automatically—ready for action.',
    tags: ['Device health', 'Recent errors', 'Network state'],
  },
  {
    key: 'Automate',
    phase: 'Secure execution',
    headline: 'Routine fixes happen safely in the background.',
    stat: '100%',
    statLabel: 'audited actions',
    desc: 'Signed, outbound-only jobs execute approved fixes inside your network. Every command and result stays visible.',
    tags: ['Signed jobs', 'Outbound only', 'Full audit trail'],
  },
  {
    key: 'Resolve',
    phase: 'Closed-loop support',
    headline: 'Users get answers. IT gets its time back.',
    stat: '1.4s',
    statLabel: 'to resolution',
    desc: 'Nevian confirms the outcome, documents the work, and closes the loop. Your team only sees what truly needs a human.',
    tags: ['Automatic follow-up', 'Documented outcome', 'Human escalation'],
  },
];

const STEP_SPACING = 17.4;
const STEP_ANCHOR = 40;
const LINE_X = 39.35;
const CENTER_Y = STEP_ANCHOR;
const BASE_BULGE = 3.1;
const CURVE_HALF_HEIGHT = 20;
const CURVE_OUTER_CONTROL = 14;
const CURVE_INNER_CONTROL = 6;

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function workflowIndexFromHash(hash = window.location.hash) {
  const match = hash.match(/^#workflow-(report|triage|context|automate|resolve)$/i);
  if (!match) return -1;
  return steps.findIndex((step) => step.key.toLowerCase() === match[1].toLowerCase());
}

function createCurvePath(center, bulge) {
  const upper = center - CURVE_HALF_HEIGHT;
  const lower = center + CURVE_HALF_HEIGHT;
  const bendX = LINE_X - bulge;

  return `M ${LINE_X} -5 L ${LINE_X} ${upper} C ${LINE_X} ${center - CURVE_OUTER_CONTROL}, ${bendX} ${center - CURVE_INNER_CONTROL}, ${bendX} ${center} C ${bendX} ${center + CURVE_INNER_CONTROL}, ${LINE_X} ${center + CURVE_OUTER_CONTROL}, ${LINE_X} ${lower} L ${LINE_X} 105`;
}

function cubicPoint(start, controlA, controlB, end, t) {
  const inverse = 1 - t;
  return inverse ** 3 * start
    + 3 * inverse ** 2 * t * controlA
    + 3 * inverse * t ** 2 * controlB
    + t ** 3 * end;
}

function createCurveSamples(center, bulge) {
  const upper = center - CURVE_HALF_HEIGHT;
  const lower = center + CURVE_HALF_HEIGHT;
  const bendX = LINE_X - bulge;
  const samples = [{ x: LINE_X, y: 0 }, { x: LINE_X, y: upper }];

  for (let index = 1; index <= 8; index += 1) {
    const t = index / 8;
    samples.push({
      x: cubicPoint(LINE_X, LINE_X, bendX, bendX, t),
      y: cubicPoint(upper, center - CURVE_OUTER_CONTROL, center - CURVE_INNER_CONTROL, center, t),
    });
  }

  for (let index = 1; index <= 8; index += 1) {
    const t = index / 8;
    samples.push({
      x: cubicPoint(bendX, bendX, LINE_X, LINE_X, t),
      y: cubicPoint(center, center + CURVE_INNER_CONTROL, center + CURVE_OUTER_CONTROL, lower, t),
    });
  }

  samples.push({ x: LINE_X, y: 100 });
  return samples;
}

function createLeftCurveClip(center, bulge, gap = 0) {
  const boundary = createCurveSamples(center, bulge).map(({ x, y }) => `${x - gap}% ${y}%`);
  boundary.push('0% 100%', '0% 0%');
  return `polygon(${boundary.join(', ')})`;
}

function createMarkerClip(center, bulge) {
  return createLeftCurveClip(center, bulge, .52);
}

function createLeftHighlightPath(samples) {
  const bandWidth = 7.2;
  const curveEdge = samples.map(({ x, y }) => `${x} ${y}`);
  const softEdge = [...samples].reverse().map(({ x, y }) => `${x - bandWidth} ${y}`);
  return `M ${curveEdge.join(' L ')} L ${softEdge.join(' L ')} Z`;
}

function curveXAtY(y, samples) {
  if (y <= samples[0].y || y >= samples[samples.length - 1].y) return LINE_X;

  for (let index = 1; index < samples.length; index += 1) {
    const previous = samples[index - 1];
    const next = samples[index];
    if (y <= next.y) {
      const range = Math.max(.0001, next.y - previous.y);
      const progress = (y - previous.y) / range;
      return previous.x + (next.x - previous.x) * progress;
    }
  }

  return LINE_X;
}

function calculateMobileCurveX(y) {
  const distance = (y - 50) / 14.5;
  return 88 - 17 * Math.exp(-(distance ** 2));
}

const MOBILE_CURVE_LOOKUP = Array.from({ length: 105 }, (_, index) => calculateMobileCurveX(index - 2));

function mobileCurveXAtY(y) {
  const bounded = clamp(y, -2, 102) + 2;
  const lower = Math.floor(bounded);
  const upper = Math.min(MOBILE_CURVE_LOOKUP.length - 1, lower + 1);
  const mix = bounded - lower;
  return MOBILE_CURVE_LOOKUP[lower] + (MOBILE_CURVE_LOOKUP[upper] - MOBILE_CURVE_LOOKUP[lower]) * mix;
}

function createMobileTickPath(selectedFloat, spacingPercent) {
  const travel = selectedFloat * spacingPercent;
  const stepRows = steps.map((_, index) => 50 + index * spacingPercent - travel);
  const finalStepY = stepRows[stepRows.length - 1];
  const finalSourceY = 50 + (steps.length - 1) * spacingPercent;
  const segments = [];

  const tickSpacing = spacingPercent / 5;
  for (let sourceY = -24; sourceY <= finalSourceY; sourceY += tickSpacing) {
    const y = sourceY - travel;
    if (y < -2 || y > 102 || y > finalStepY) continue;
    if (stepRows.some((stepY) => Math.abs(stepY - y) < 1.05)) continue;
    const right = mobileCurveXAtY(y) - 1.2;
    segments.push(`M ${right - 8.2} ${y} H ${right}`);
  }

  return segments.join(' ');
}

function createTickPaths(center, bulge, travel) {
  const samples = createCurveSamples(center, bulge);
  const stepRows = steps.map((_, index) => STEP_ANCHOR + index * STEP_SPACING - travel);
  const finalStepY = stepRows[stepRows.length - 1];
  const segments = [];

  for (let sourceY = -20; sourceY <= 220; sourceY += 2.3) {
    const y = sourceY - travel;
    if (y < -2 || y > 102) continue;
    if (y > finalStepY) continue;
    if (stepRows.some((stepY) => Math.abs(stepY - y) < .9)) continue;
    const right = curveXAtY(y, samples) - .78;
    segments.push(`M ${right - 1.55} ${y} H ${right}`);
  }

  return segments.join(' ');
}

export default function Journey() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const trackRef = useRef(null);
  const highlightPathRef = useRef(null);
  const markerMaskRef = useRef(null);
  const labelsRef = useRef(null);
  const labelItemsRef = useRef([]);
  const mobileLabelItemsRef = useRef([]);
  const mobileLabelsRef = useRef(null);
  const mobileRailRef = useRef(null);
  const mobileTicksRef = useRef(null);
  const minorTicksRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = 0;
    let target = 0;
    let frame = 0;
    let mobileFrame = 0;
    let lastTime = performance.now();
    let lastBroadcastIndex = -1;
    let lastMobileTickKey = -1;
    let trackTop = 0;
    let scrollRange = 1;
    let mobileSpacing = 0;
    let mobileSpacingPercent = 14.5;
    let mobileRailWidth = 0;

    const updateVisuals = (progress) => {
      const selectedFloat = progress * (steps.length - 1);
      const travel = selectedFloat * STEP_SPACING;
      let nextIndex = desktop.matches
        ? activeIndexRef.current
        : clamp(Math.floor(selectedFloat + .002), 0, steps.length - 1);

      if (desktop.matches) {
        while (selectedFloat >= nextIndex + 1 && nextIndex < steps.length - 1) nextIndex += 1;
        while (selectedFloat <= nextIndex - 1 && nextIndex > 0) nextIndex -= 1;
      }

      if (desktop.matches) {
        const wave = Math.sin(selectedFloat * Math.PI);
        const center = CENTER_Y;
        const bulge = BASE_BULGE + Math.abs(wave) * .55;
        const curvePath = createCurvePath(center, bulge);
        const curveSamples = createCurveSamples(center, bulge);
        const highlightPath = createLeftHighlightPath(curveSamples);
        const markerClip = createMarkerClip(center, bulge);
        const tickPath = createTickPaths(center, bulge, travel);

        if (labelsRef.current) labelsRef.current.style.transform = `translate3d(0, -${travel}vh, 0)`;
        labelItemsRef.current.forEach((label, index) => {
          if (!label) return;
          const labelY = STEP_ANCHOR + index * STEP_SPACING - travel;
          const displacement = curveXAtY(labelY, curveSamples) - LINE_X;
          label.style.transform = `translate3d(${displacement}vw, -50%, 0)`;
        });
        minorTicksRef.current?.setAttribute('d', tickPath);
        pathRef.current?.setAttribute('d', curvePath);
        highlightPathRef.current?.setAttribute('d', highlightPath);
        if (markerMaskRef.current) {
          markerMaskRef.current.style.clipPath = markerClip;
          markerMaskRef.current.style.webkitClipPath = markerClip;
        }
      } else {
        if (mobileLabelsRef.current) {
          mobileLabelsRef.current.style.transform = `translate3d(0, ${-selectedFloat * mobileSpacing}px, 0)`;
        }
        mobileLabelItemsRef.current.forEach((label, index) => {
          if (!label) return;
          const labelY = 50 + (index - selectedFloat) * mobileSpacingPercent;
          const displacement = ((88 - mobileCurveXAtY(labelY)) / 100) * mobileRailWidth;
          label.style.transform = `translate3d(${-displacement}px, -50%, 0)`;
        });
        const mobileTickKey = Math.round(selectedFloat * 48);
        if (mobileTickKey !== lastMobileTickKey) {
          lastMobileTickKey = mobileTickKey;
          mobileTicksRef.current?.setAttribute('d', createMobileTickPath(mobileTickKey / 48, mobileSpacingPercent));
        }
      }

      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      }

      if (nextIndex !== lastBroadcastIndex) {
        lastBroadcastIndex = nextIndex;
        window.dispatchEvent(new CustomEvent('nevian:workflow-active', {
          detail: { index: nextIndex, slug: steps[nextIndex].key.toLowerCase() },
        }));
      }
    };

    const tick = (time) => {
      const elapsed = Math.min(48, time - lastTime);
      const delta = target - current;
      const easing = reduceMotion ? 1 : 1 - Math.exp(-elapsed / 26);
      lastTime = time;
      current += delta * easing;

      if (Math.abs(delta) < 0.00012) {
        current = target;
        updateVisuals(current);
        frame = 0;
        return;
      }

      updateVisuals(current);
      frame = requestAnimationFrame(tick);
    };

    const requestTick = () => {
      if (frame) return;
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const measureTrack = () => {
      const track = trackRef.current;
      if (!track) return;
      trackTop = track.getBoundingClientRect().top + window.scrollY;
      scrollRange = Math.max(1, track.offsetHeight - window.innerHeight);
      mobileSpacing = Math.min(window.innerHeight * .145, 118);
      mobileSpacingPercent = (mobileSpacing / Math.max(1, window.innerHeight)) * 100;
      mobileRailWidth = mobileRailRef.current?.offsetWidth || 0;
      mobileLabelItemsRef.current.forEach((label, index) => {
        if (label) label.style.top = `calc(50% + ${index * mobileSpacing}px)`;
      });
    };

    const readProgress = () => {
      return clamp((window.scrollY - trackTop) / scrollRange);
    };

    const onScroll = () => {
      const nextTarget = readProgress();

      if (!desktop.matches) {
        target = nextTarget;
        if (!mobileFrame) {
          mobileFrame = requestAnimationFrame(() => {
            mobileFrame = 0;
            current = target;
            updateVisuals(current);
          });
        }
        return;
      }

      if (Math.abs(nextTarget - target) < 0.00012 && Math.abs(nextTarget - current) < 0.00012) return;
      target = nextTarget;

      if (reduceMotion) {
        current = target;
        updateVisuals(current);
      } else if (Math.abs(target - current) > 0.00012) {
        requestTick();
      }
    };

    const onResize = () => {
      if (frame) cancelAnimationFrame(frame);
      if (mobileFrame) cancelAnimationFrame(mobileFrame);
      frame = 0;
      mobileFrame = 0;
      lastMobileTickKey = -1;
      measureTrack();
      const measuredProgress = readProgress();
      target = measuredProgress;
      current = target;
      updateVisuals(current);
    };

    const scrollToStep = (index, behavior = 'smooth') => {
      if (!Number.isInteger(index) || index < 0 || index >= steps.length) return;

      window.requestAnimationFrame(() => {
        measureTrack();
        const progress = index / (steps.length - 1);
        window.scrollTo({ top: trackTop + scrollRange * progress, behavior });
      });
    };

    const onStepRequest = (event) => {
      const index = Number(event.detail?.index);
      scrollToStep(index);
    };

    const onWorkflowHash = () => {
      const index = workflowIndexFromHash();
      if (index >= 0) scrollToStep(index);
    };

    measureTrack();
    const initialProgress = readProgress();
    target = initialProgress;
    current = target;
    updateVisuals(current);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('nevian:workflow-step', onStepRequest);
    window.addEventListener('hashchange', onWorkflowHash);

    const initialIndex = workflowIndexFromHash();
    if (initialIndex >= 0) {
      window.requestAnimationFrame(() => scrollToStep(initialIndex, 'auto'));
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (mobileFrame) cancelAnimationFrame(mobileFrame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('nevian:workflow-step', onStepRequest);
      window.removeEventListener('hashchange', onWorkflowHash);
    };
  }, []);

  const activeStep = steps[activeIndex];
  const initialPath = createCurvePath(CENTER_Y, BASE_BULGE);
  const initialHighlightPath = createLeftHighlightPath(createCurveSamples(CENTER_Y, BASE_BULGE));
  const initialMarkerClip = createMarkerClip(CENTER_Y, BASE_BULGE);
  const initialTickPath = createTickPaths(CENTER_Y, BASE_BULGE, 0);

  return (
    <section id="how" className="nevian-journey">
      <div ref={trackRef} className="nevian-journey-track">
        <div className="nevian-journey-stage">
          <div className="nevian-journey-base" />
          <div className="nevian-journey-grid nevian-journey-grid-top" />
          <div className="nevian-journey-grid nevian-journey-grid-bottom" />
          <div className="nevian-journey-vignette" />

          <div className="nevian-journey-desktop">
            <svg className="nevian-journey-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="nevianLineGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#45494e" stopOpacity=".2" />
                  <stop offset=".34" stopColor="#64d99c" stopOpacity=".28" />
                  <stop offset=".49" stopColor="#8dff6a" />
                  <stop offset=".66" stopColor="#17b378" stopOpacity=".58" />
                  <stop offset="1" stopColor="#34383e" stopOpacity=".14" />
                </linearGradient>
              </defs>
              <path ref={pathRef} className="nevian-journey-path" d={initialPath} />
            </svg>

            <svg className="nevian-journey-highlight" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <radialGradient id="nevianLeftHighlightGradient" cx="100%" cy="50%" r="76%" fx="100%" fy="50%">
                  <stop offset="0" stopColor="#54dc93" stopOpacity=".2" />
                  <stop offset=".34" stopColor="#35bc7b" stopOpacity=".115" />
                  <stop offset=".72" stopColor="#17895a" stopOpacity=".025" />
                  <stop offset="1" stopColor="#17895a" stopOpacity="0" />
                </radialGradient>
              </defs>
              <path ref={highlightPathRef} d={initialHighlightPath} />
            </svg>

            <svg className="nevian-journey-ticks" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path ref={minorTicksRef} className="nevian-journey-tick-path nevian-journey-tick-path-minor" d={initialTickPath} />
            </svg>

            <div
              ref={markerMaskRef}
              className="nevian-journey-marker-mask"
              style={{ clipPath: initialMarkerClip, WebkitClipPath: initialMarkerClip }}
            >
              <div ref={labelsRef} className="nevian-journey-labels">
                {steps.map((step, index) => (
                  <div
                    key={step.key}
                    ref={(node) => { labelItemsRef.current[index] = node; }}
                    className={`nevian-journey-label ${index === activeIndex ? 'is-active' : ''}`}
                    aria-current={index === activeIndex ? 'step' : undefined}
                    style={{ top: `${STEP_ANCHOR + index * STEP_SPACING}%` }}
                  >
                    <span>{step.key}</span>
                  </div>
                ))}
              </div>
            </div>

            <article className="nevian-journey-copy">
              <div key={activeIndex} className="nevian-journey-copy-enter">
                <div className="nevian-journey-brand">
                  <span className="nevian-journey-brand-mark">
                    <img src="/assets/logo.png" alt="" />
                  </span>
                  <span>Nevian workflow</span>
                </div>

                <div className="nevian-journey-phase">
                  Step {String(activeIndex + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')} · {activeStep.phase}
                </div>
                <h2>{activeStep.headline}</h2>

                <div className="nevian-journey-metric">
                  <strong>{activeStep.stat}</strong>
                  <span>{activeStep.statLabel}</span>
                </div>

                <p>{activeStep.desc}</p>

                <ul className="nevian-journey-tags" aria-label={`${activeStep.key} capabilities`}>
                  {activeStep.tags.map((tag) => (
                    <li key={tag}>
                      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8.2 3 3L13 4.8" /></svg>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>

          <div className="nevian-journey-mobile">
            <div ref={mobileRailRef} className="nevian-journey-mobile-rail" aria-hidden="true">
              <svg className="nevian-journey-mobile-line" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="nevianMobileHighlightGradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0" stopColor="#0b5234" stopOpacity="0" />
                    <stop offset=".62" stopColor="#19794e" stopOpacity=".035" />
                    <stop offset="1" stopColor="#43c681" stopOpacity=".17" />
                  </linearGradient>
                  <linearGradient id="nevianMobileLineGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#263a31" stopOpacity=".3" />
                    <stop offset=".36" stopColor="#4eba82" stopOpacity=".65" />
                    <stop offset=".5" stopColor="#8dff6a" />
                    <stop offset=".66" stopColor="#1e9d69" stopOpacity=".72" />
                    <stop offset="1" stopColor="#24352e" stopOpacity=".24" />
                  </linearGradient>
                </defs>
                <path className="nevian-journey-mobile-highlight-shape" d="M 88 -5 L 88 31 C 88 40 71 43 71 50 C 71 57 88 60 88 69 L 88 105 L 0 105 L 0 -5 Z" />
                <path d="M 88 -5 L 88 31 C 88 40 71 43 71 50 C 71 57 88 60 88 69 L 88 105" />
              </svg>

              <svg className="nevian-journey-mobile-ticks" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path ref={mobileTicksRef} d={createMobileTickPath(0, 14.5)} />
              </svg>

              <div ref={mobileLabelsRef} className="nevian-journey-mobile-labels">
                {steps.map((step, index) => (
                  <div
                    key={step.key}
                    ref={(node) => { mobileLabelItemsRef.current[index] = node; }}
                    className={`nevian-journey-mobile-label ${index === activeIndex ? 'is-active' : ''}`}
                    aria-current={index === activeIndex ? 'step' : undefined}
                  >
                    <span>{step.key}</span>
                    <i />
                  </div>
                ))}
              </div>
            </div>

            <article className="nevian-journey-mobile-copy">
              <div key={activeIndex} className="nevian-journey-mobile-copy-enter">
                <div className="nevian-journey-mobile-brand">
                  <img src="/assets/logo.png" alt="" />
                  <span>Nevian workflow</span>
                </div>
                <div className="nevian-journey-mobile-phase">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')} · {activeStep.phase}
                </div>
                <h2>{activeStep.headline}</h2>
                <div className="nevian-journey-mobile-metric">
                  <strong>{activeStep.stat}</strong>
                  <span>{activeStep.statLabel}</span>
                </div>
                <p>{activeStep.desc}</p>
                <ul>
                  {activeStep.tags.slice(0, 2).map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </div>
            </article>

            <div className="nevian-journey-mobile-progress" aria-hidden="true">
              <span>{String(activeIndex + 1).padStart(2, '0')}</span>
              <i><b style={{ transform: `scaleX(${(activeIndex + 1) / steps.length})` }} /></i>
              <span>{String(steps.length).padStart(2, '0')}</span>
            </div>
          </div>

          <div className="nevian-journey-grain" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
