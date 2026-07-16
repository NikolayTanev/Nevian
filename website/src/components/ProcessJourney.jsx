import { useState } from 'react';
import { IconArrow } from './Icons.jsx';
import { useReveal } from '../hooks/useReveal.js';

const steps = [
  {
    title: 'Discovery',
    description: 'We look at the requests your team receives most often, the devices they manage, and how support works today.',
  },
  {
    title: 'Planning',
    description: 'Together, we choose a useful first rollout and agree on what success should look like.',
  },
  {
    title: 'Setup',
    description: 'We connect Nevian to the systems it needs and configure the approved support work.',
  },
  {
    title: 'Launch',
    description: 'We test each workflow with your team, fix any gaps, and then make it available to users.',
  },
  {
    title: 'Support',
    description: 'After launch, we review the results with you and adjust the setup as your needs change.',
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
            <h2 id="process-journey-title">How we get Nevian running</h2>
          </div>

          <div className="process-journey-intro">
            <p>
              We start by looking at the requests your team handles most often and the systems behind them. From there,
              we agree on a useful first rollout, configure it with your team, and test it before anyone depends on it.
            </p>
            <a href="/contact.html" className="process-journey-control">
              Talk to us <IconArrow />
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
