import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    key: 'Report',
    phase: 'Request received',
    headline: 'Start with a normal conversation.',
    stat: '0',
    statLabel: 'forms to fill',
    desc: 'People can describe the problem in their own words. Nevian turns that message into a support request without sending them through a portal.',
    tags: ['Plain language', 'Any channel', 'Quick reply'],
  },
  {
    key: 'Triage',
    phase: 'Request reviewed',
    headline: 'The next step is clear from the start.',
    stat: '1.2s',
    statLabel: 'to review the request',
    desc: 'Nevian checks what the request is about, how urgent it looks, and who should handle it before it reaches the queue.',
    tags: ['Request type', 'Urgency', 'Routing'],
  },
  {
    key: 'Context',
    phase: 'Device checked',
    headline: 'Device details arrive with the request.',
    stat: 'Live',
    statLabel: 'device details',
    desc: 'The ticket includes the operating system, hardware, storage, network, recent errors, and policy status, so nobody has to ask for them later.',
    tags: ['Device health', 'Recent errors', 'Network state'],
  },
  {
    key: 'Automate',
    phase: 'Fix approved',
    headline: 'Routine fixes run under your rules.',
    stat: '100%',
    statLabel: 'of actions recorded',
    desc: 'Nevian runs approved jobs inside your environment and records every command and result for your team to review.',
    tags: ['Signed jobs', 'Outbound connection', 'Complete record'],
  },
  {
    key: 'Resolve',
    phase: 'Work completed',
    headline: 'The user gets an answer and IT gets the record.',
    stat: '1.4s',
    statLabel: 'for a common reset',
    desc: 'Nevian confirms the result, writes down what changed, and closes the request. Anything unusual stays with your team.',
    tags: ['User follow up', 'Recorded result', 'Human handoff'],
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
// Widen the early and middle step intervals without changing the track bounds.
const DESKTOP_STEP_TRANSITIONS = [.14, .41, .68, .94];

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function desktopStepFloatFromProgress(progress) {
  const boundedProgress = clamp(progress);
  let lowerProgress = 0;
  let lowerStepFloat = 0;

  for (let index = 0; index < DESKTOP_STEP_TRANSITIONS.length; index += 1) {
    const upperProgress = DESKTOP_STEP_TRANSITIONS[index];
    const upperStepFloat = index + .5;

    if (boundedProgress <= upperProgress) {
      const segmentProgress = (boundedProgress - lowerProgress) / (upperProgress - lowerProgress);
      return lowerStepFloat + segmentProgress * (upperStepFloat - lowerStepFloat);
    }

    lowerProgress = upperProgress;
    lowerStepFloat = upperStepFloat;
  }

  const segmentProgress = (boundedProgress - lowerProgress) / (1 - lowerProgress);
  return lowerStepFloat + segmentProgress * (steps.length - 1 - lowerStepFloat);
}

function desktopProgressForStep(index) {
  if (index <= 0) return 0;
  if (index >= steps.length - 1) return 1;
  return (DESKTOP_STEP_TRANSITIONS[index - 1] + DESKTOP_STEP_TRANSITIONS[index]) / 2;
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
const MOBILE_STEP_REGIONS = [
  { start: 0, size: 25 },
  { start: 25, size: 25 },
  { start: 50, size: 25 },
  { start: 75, size: 24 },
  { start: 99, size: 1 },
];

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
  const [outgoing, setOutgoing] = useState(null);
  const prevActiveRef = useRef(0);
  const transitionSeq = useRef(0);
  const trackRef = useRef(null);
  const highlightPathRef = useRef(null);
  const markerMaskRef = useRef(null);
  const labelsRef = useRef(null);
  const labelItemsRef = useRef([]);
  const mobileLabelItemsRef = useRef([]);
  const mobileLabelsRef = useRef(null);
  const mobileRailRef = useRef(null);
  const mobileTicksRef = useRef(null);
  const mobileSentinelsRef = useRef(null);
  const minorTicksRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nativeMobileTimeline = !desktop.matches
      && typeof CSS !== 'undefined'
      && CSS.supports?.('animation-timeline: view()');
    let current = 0;
    let target = 0;
    let frame = 0;
    let mobileFrame = 0;
    let mobileObserver = null;
    let lastTime = performance.now();
    let lastBroadcastIndex = -1;
    let lastMobileTickKey = -1;
    let trackTop = 0;
    let scrollRange = 1;
    let mobileSpacing = 0;
    let mobileSpacingPercent = 14.5;
    let mobileRailWidth = 0;

    const updateVisuals = (progress) => {
      const selectedFloat = desktop.matches
        ? desktopStepFloatFromProgress(progress)
        : progress * (steps.length - 1);
      const travel = selectedFloat * STEP_SPACING;
      let nextIndex = desktop.matches
        ? clamp(Math.round(selectedFloat), 0, steps.length - 1)
        : clamp(Math.floor(selectedFloat + .002), 0, steps.length - 1);

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
        if (!nativeMobileTimeline) {
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
        if (!label) return;
        if (nativeMobileTimeline) label.style.removeProperty('top');
        else label.style.top = `calc(50% + ${index * mobileSpacing}px)`;
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

    const observeNativeMobileSteps = () => {
      if (!nativeMobileTimeline || !mobileSentinelsRef.current || !('IntersectionObserver' in window)) return;

      mobileObserver = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (!visible.length) return;
        const closest = visible.sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
        const index = Number(closest.target.dataset.stepIndex);
        target = index / (steps.length - 1);
        current = target;
        updateVisuals(current);
      }, { rootMargin: '0px 0px -98% 0px', threshold: 0 });

      mobileSentinelsRef.current.querySelectorAll('[data-step-index]').forEach((sentinel) => {
        mobileObserver.observe(sentinel);
      });
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
        const progress = desktop.matches
          ? desktopProgressForStep(index)
          : index / (steps.length - 1);
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
    if (nativeMobileTimeline) observeNativeMobileSteps();
    else window.addEventListener('scroll', onScroll, { passive: true });
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
      mobileObserver?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('nevian:workflow-step', onStepRequest);
      window.removeEventListener('hashchange', onWorkflowHash);
    };
  }, []);

  // When the active step changes (at the scroll midpoint), keep the previous
  // step mounted for one transition so it can animate out while the new one
  // animates in. This is a real time-based crossfade, independent of scroll speed.
  useEffect(() => {
    if (prevActiveRef.current === activeIndex) return;
    const fromIndex = prevActiveRef.current;
    prevActiveRef.current = activeIndex;
    transitionSeq.current += 1;
    setOutgoing({ index: fromIndex, id: transitionSeq.current });
  }, [activeIndex]);

  const activeStep = steps[activeIndex];

  const renderStep = (step) => (
    <>
      <div className="nevian-journey-brand">
        <span className="nevian-journey-brand-mark">
          <img src="/assets/logo.png" alt="" />
        </span>
        <span>Nevian workflow</span>
      </div>

      <h2>{step.headline}</h2>

      <div className="nevian-journey-metric">
        <strong>{step.stat}</strong>
        <span>{step.statLabel}</span>
      </div>

      <p>{step.desc}</p>
    </>
  );

  const initialPath = createCurvePath(CENTER_Y, BASE_BULGE);
  const initialHighlightPath = createLeftHighlightPath(createCurveSamples(CENTER_Y, BASE_BULGE));
  const initialMarkerClip = createMarkerClip(CENTER_Y, BASE_BULGE);
  const initialTickPath = createTickPaths(CENTER_Y, BASE_BULGE, 0);

  return (
    <section id="how" className="nevian-journey">
      <div ref={trackRef} className="nevian-journey-track">
        <div ref={mobileSentinelsRef} className="nevian-journey-mobile-sentinels" aria-hidden="true">
          {MOBILE_STEP_REGIONS.map((region, index) => (
            <i
              key={steps[index].key}
              data-step-index={index}
              style={{ '--region-start': `${region.start}%`, '--region-size': `${region.size}%` }}
            />
          ))}
        </div>
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
              {outgoing && (
                <div
                  key={`out-${outgoing.id}`}
                  className="nevian-journey-copy-layer is-exiting"
                  aria-hidden="true"
                  onAnimationEnd={(event) => {
                    if (event.target !== event.currentTarget) return;
                    setOutgoing((current) => (current && current.id === outgoing.id ? null : current));
                  }}
                >
                  {renderStep(steps[outgoing.index])}
                </div>
              )}
              <div key={`in-${activeIndex}`} className="nevian-journey-copy-layer is-entering">
                {renderStep(activeStep)}
              </div>
            </article>
          </div>

          <div className="nevian-journey-mobile">
            <div className="nevian-journey-mobile-cards">
              {steps.map((step, index) => (
                <article
                  key={step.key}
                  className="nevian-journey-mobile-card"
                  data-workflow-card={index}
                >
                  <header className="nevian-journey-mobile-card-header">
                    <div className="nevian-journey-mobile-brand">
                      <img src="/assets/logo.png" alt="" />
                      <span>Nevian workflow</span>
                    </div>
                    <span>{String(index + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</span>
                  </header>

                  <div className="nevian-journey-mobile-card-phase">
                    <strong>{step.key}</strong>
                    <span>{step.phase}</span>
                  </div>

                  <h2>{step.headline}</h2>

                  <div className="nevian-journey-mobile-card-metric">
                    <strong>{step.stat}</strong>
                    <span>{step.statLabel}</span>
                  </div>

                  <p>{step.desc}</p>

                  <ul>
                    {step.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div className="nevian-journey-grain" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
