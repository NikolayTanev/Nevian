import { useState } from 'react';
import { IconArrow } from './Icons.jsx';
import { useReveal } from '../hooks/useReveal.js';

const steps = [
  {
    title: 'Discovery',
    description: 'We begin by learning about your users, devices, and support workflow through a focused call or meeting.',
  },
  {
    title: 'Planning',
    description: 'We map the right rollout around your priorities, systems, and the work that slows your team down.',
  },
  {
    title: 'Development',
    description: 'Nevian is configured around your environment, with integrations and automation built in from day one.',
  },
  {
    title: 'Launch',
    description: 'We introduce the platform cleanly, validate every workflow, and give your team a calm path into production.',
  },
  {
    title: 'Support',
    description: 'We stay close after launch, monitor outcomes, and refine the system as your team and needs evolve.',
  },
];

function ProcessIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9.2 14.8 6.8 17.2a3.25 3.25 0 0 1-4.6-4.6l3.1-3.1a3.25 3.25 0 0 1 4.6 0" />
      <path d="m14.8 9.2 2.4-2.4a3.25 3.25 0 1 1 4.6 4.6l-3.1 3.1a3.25 3.25 0 0 1-4.6 0" />
      <path d="m8.5 15.5 7-7" />
    </svg>
  );
}

export default function ProcessJourney() {
  const [activeStep, setActiveStep] = useState(0);
  const [sectionRef, shown] = useReveal();

  return (
    <section
      ref={sectionRef}
      id="process"
      className={`process-journey ${shown ? 'process-journey-shown' : ''}`}
      aria-labelledby="process-journey-title"
    >
      <div className="process-journey-inner">
        <header className="process-journey-header">
          <div>
            <h2 id="process-journey-title">
              Begin <span>Your<br />Journey</span> with <span>Us</span>
            </h2>

            <div className="process-journey-label">
              <ProcessIcon />
              How it works
            </div>
          </div>

          <div className="process-journey-intro">
            <p>
              Working with us is simple and transparent. We start with a quick call to understand your goals and needs,
              then develop a tailored plan with clear timelines and solutions. Once approved, our team moves into
              deployment, keeping you updated at every stage. After launch, we ensure smooth delivery and offer ongoing
              support if needed.
            </p>
            <a href="/contact.html" className="process-journey-control">
              Take Control <IconArrow />
            </a>
          </div>
        </header>

        <ol
          className="process-journey-steps"
          style={{ '--glow-top': `${(activeStep + .5) * 20}%` }}
        >
          {steps.map((step, index) => {
            const active = activeStep === index;

            return (
              <li
                key={step.title}
                className={active ? 'is-active' : ''}
                tabIndex={0}
                onMouseEnter={() => setActiveStep(index)}
                onFocus={() => setActiveStep(index)}
                onClick={() => setActiveStep(index)}
                aria-current={active ? 'step' : undefined}
              >
                <span className="process-step-number">{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <div className="process-step-detail">
                  <p>{step.description}</p>
                  <a href="/contact.html">
                    Learn More <IconArrow />
                  </a>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
