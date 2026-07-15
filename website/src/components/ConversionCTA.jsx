import { IconArrow, IconCheck } from './Icons.jsx';

const benefits = [
  'Live in days, not quarters',
  'Outbound-only, audited automation',
  'One platform, not four',
  'A walkthrough built around your workflow',
];

export default function ConversionCTA() {
  return (
    <section id="ready" className="conversion-cta-section">
      <div className="conversion-cta-card">
        <div className="conversion-cta-content">
          <div className="conversion-cta-eyebrow">Ready when you are</div>

          <h2>Give your IT team context and automation—without the six-month rollout.</h2>

          <p>
            Tickets, endpoint visibility, and safe automation in one calm platform your team can start using this week.
            Book a walkthrough and we’ll map it to how your support actually works.
          </p>

          <div className="conversion-cta-actions">
            <a
              href="#contact"
              className="conversion-cta-button conversion-cta-button-primary"
            >
              Book a demo <IconArrow className="h-4 w-4" />
            </a>
            <a href="#how" className="conversion-cta-button conversion-cta-button-secondary">
              See how it works
            </a>
          </div>

          <ul className="conversion-cta-benefits" aria-label="Nevian rollout benefits">
            {benefits.map((benefit) => (
              <li key={benefit}>
                <IconCheck aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
