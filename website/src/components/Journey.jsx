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
const CENTER_Y = 49;
const BASE_BULGE = 3.1;
const CURVE_HALF_HEIGHT = 20;
const CURVE_OUTER_CONTROL = 14;
const CURVE_INNER_CONTROL = 6;

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
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

function createMarkerClip(center, bulge) {
  const gap = .52;
  const boundary = createCurveSamples(center, bulge).map(({ x, y }) => `${x - gap}% ${y}%`);
  boundary.push('0% 100%', '0% 0%');
  return `polygon(${boundary.join(', ')})`;
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

function createTickPaths(center, bulge, travel) {
  const samples = createCurveSamples(center, bulge);
  const stepRows = steps.map((_, index) => STEP_ANCHOR + index * STEP_SPACING - travel);
  const segments = [];

  for (let sourceY = -20; sourceY <= 220; sourceY += 2.3) {
    const y = sourceY - travel;
    if (y < -2 || y > 102) continue;
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
  const markerMaskRef = useRef(null);
  const labelsRef = useRef(null);
  const labelItemsRef = useRef([]);
  const minorTicksRef = useRef(null);
  const pathRef = useRef(null);
  const ghostPathRef = useRef(null);
  const mistRef = useRef(null);
  const contentRef = useRef(null);
  const leftGlowRef = useRef(null);
  const rightGlowRef = useRef(null);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = 0;
    let target = 0;
    let frame = 0;
    let lastTime = performance.now();

    const updateVisuals = (progress) => {
      const selectedFloat = progress * (steps.length - 1);
      const travel = selectedFloat * STEP_SPACING;
      const wave = Math.sin(selectedFloat * Math.PI);
      const center = CENTER_Y + wave * .8;
      const centerOffset = center - CENTER_Y;
      const bulge = BASE_BULGE + Math.abs(wave) * .55;
      const curvePath = createCurvePath(center, bulge);
      const curveSamples = createCurveSamples(center, bulge);
      const markerClip = createMarkerClip(center, bulge);
      const tickPath = createTickPaths(center, bulge, travel);
      const nextIndex = Math.round(selectedFloat);

      labelsRef.current.style.transform = `translate3d(0, -${travel}vh, 0)`;
      labelItemsRef.current.forEach((label, index) => {
        if (!label) return;
        const labelY = STEP_ANCHOR + index * STEP_SPACING - travel;
        const displacement = curveXAtY(labelY, curveSamples) - LINE_X;
        label.style.transform = `translate3d(${displacement}vw, -50%, 0)`;
      });
      minorTicksRef.current.setAttribute('d', tickPath);
      pathRef.current.setAttribute('d', curvePath);
      ghostPathRef.current.setAttribute('d', curvePath);
      markerMaskRef.current.style.clipPath = markerClip;
      markerMaskRef.current.style.webkitClipPath = markerClip;
      mistRef.current.style.transform = `translate3d(0, ${centerOffset}vh, 0)`;
      contentRef.current.style.transform = `translate3d(0, ${wave * 6}px, 0)`;
      leftGlowRef.current.style.transform = `translate3d(${wave * -0.7}vw, ${wave * -0.8}vh, 0)`;
      rightGlowRef.current.style.transform = `translate3d(${wave * -1.1}vw, 0, 0) scale(${1 + Math.abs(wave) * 0.025})`;

      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      }
    };

    const tick = (time) => {
      const elapsed = Math.min(48, time - lastTime);
      const delta = target - current;
      const easing = reduceMotion ? 1 : 1 - Math.exp(-elapsed / 32);
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

    const readProgress = () => {
      const track = trackRef.current;
      const total = Math.max(1, track.offsetHeight - window.innerHeight);
      return clamp(-track.getBoundingClientRect().top / total);
    };

    const onScroll = () => {
      if (!desktop.matches) return;
      target = readProgress();

      if (reduceMotion) {
        current = target;
        updateVisuals(current);
      } else if (Math.abs(target - current) > 0.00012) {
        requestTick();
      }
    };

    const onResize = () => {
      if (!desktop.matches) return;
      target = readProgress();
      current = target;
      updateVisuals(current);
    };

    target = desktop.matches ? readProgress() : 0;
    current = target;
    updateVisuals(current);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const activeStep = steps[activeIndex];
  const initialPath = createCurvePath(CENTER_Y, BASE_BULGE);
  const initialMarkerClip = createMarkerClip(CENTER_Y, BASE_BULGE);
  const initialTickPath = createTickPaths(CENTER_Y, BASE_BULGE, 0);

  return (
    <section id="how" className="nevian-journey">
      <div ref={trackRef} className="nevian-journey-track">
        <div className="nevian-journey-stage">
          <div className="nevian-journey-base" />
          <div ref={leftGlowRef} className="nevian-journey-glow nevian-journey-glow-left" />
          <div ref={rightGlowRef} className="nevian-journey-glow nevian-journey-glow-right" />
          <div className="nevian-journey-grid nevian-journey-grid-top" />
          <div className="nevian-journey-grid nevian-journey-grid-bottom" />
          <div className="nevian-journey-vignette" />

          <div className="nevian-journey-desktop">
            <div ref={mistRef} className="nevian-journey-mist" />

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
              <path ref={ghostPathRef} className="nevian-journey-path nevian-journey-path-ghost" d={initialPath} />
              <path ref={pathRef} className="nevian-journey-path" d={initialPath} />
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
                    style={{ top: `${STEP_ANCHOR + index * STEP_SPACING}%` }}
                  >
                    <span>{step.key}</span>
                  </div>
                ))}
              </div>
            </div>

            <article ref={contentRef} className="nevian-journey-copy">
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

          <div className="nevian-journey-mobile wrap">
            <div className="nevian-journey-mobile-heading">
              <span>How Nevian works</span>
              <h2>From first message to resolved ticket.</h2>
              <p>One connected workflow, with context and automation built into every step.</p>
            </div>

            <div className="nevian-journey-mobile-list">
              {steps.map((step, index) => (
                <article key={step.key}>
                  <div className="nevian-journey-mobile-number">{String(index + 1).padStart(2, '0')}</div>
                  <div>
                    <span>{step.key}</span>
                    <h3>{step.headline}</h3>
                    <p>{step.desc}</p>
                  </div>
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
