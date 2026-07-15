import { useState } from 'react';
import { IconArrow, IconCheck } from './Icons.jsx';

const fitSteps = [
  ['01', 'Share the environment', 'Users, devices, and the workflow slowing your team down.'],
  ['02', 'Map the right fit', 'We connect Nevian’s context and automation to the way you already work.'],
  ['03', 'Leave with a rollout path', 'A focused next step—without a six-month implementation plan.'],
];

export default function ContactSection() {
  const [status, setStatus] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = [
      `Name: ${data.get('firstName')} ${data.get('lastName')}`,
      `Work email: ${data.get('email')}`,
      `Company: ${data.get('company')}`,
      `Company size: ${data.get('companySize')}`,
      `Number of devices: ${data.get('devices')}`,
      `Looking to improve: ${data.get('goal')}`,
      '',
      'Message:',
      data.get('message'),
    ];

    setStatus('Your request is ready in your email app.');
    window.location.href = `mailto:nevian.info@gmail.com?subject=${encodeURIComponent('Nevian walkthrough request')}&body=${encodeURIComponent(lines.join('\n'))}`;
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-shell">
        <div className="contact-intro">
          <div className="contact-eyebrow">Talk to our team</div>
          <h2>See how Nevian could fit your team.</h2>
          <p>Tell us about your users, devices, and support workflow. We’ll show you where Nevian can make a practical difference.</p>

          <div className="contact-fit-map" aria-label="What happens next">
            {fitSteps.map(([number, title, description]) => (
              <article key={number}>
                <span>{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="contact-response-note">
            <IconCheck aria-hidden="true" />
            Usually replies within one business day
          </div>
          <a className="contact-email-link" href="mailto:nevian.info@gmail.com">
            Prefer email? <strong>nevian.info@gmail.com</strong>
          </a>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form-heading">
            <div>
              <span>Contact request</span>
              <h3>Tell us about your setup.</h3>
            </div>
            <div className="contact-form-status">Private by default</div>
          </div>

          <div className="contact-form-grid">
            <label>
              <span>First name</span>
              <input name="firstName" type="text" autoComplete="given-name" placeholder="Jordan" required />
            </label>
            <label>
              <span>Last name</span>
              <input name="lastName" type="text" autoComplete="family-name" placeholder="Smith" required />
            </label>
            <label>
              <span>Work email</span>
              <input name="email" type="email" autoComplete="email" placeholder="jordan@company.com" required />
            </label>
            <label>
              <span>Company name</span>
              <input name="company" type="text" autoComplete="organization" placeholder="Company Inc." required />
            </label>
            <label>
              <span>Company size</span>
              <div className="contact-select">
                <select name="companySize" defaultValue="1–25 employees" required>
                  <option>1–25 employees</option>
                  <option>26–100 employees</option>
                  <option>101–500 employees</option>
                  <option>501–1,000 employees</option>
                  <option>1,000+ employees</option>
                </select>
              </div>
            </label>
            <label>
              <span>Number of devices</span>
              <div className="contact-select">
                <select name="devices" defaultValue="Under 25" required>
                  <option>Under 25</option>
                  <option>25–100</option>
                  <option>101–500</option>
                  <option>501–1,000</option>
                  <option>1,000+</option>
                </select>
              </div>
            </label>
            <label className="contact-field-wide">
              <span>What are you looking to improve?</span>
              <div className="contact-select">
                <select name="goal" defaultValue="Faster ticket resolution" required>
                  <option>Faster ticket resolution</option>
                  <option>Better endpoint visibility</option>
                  <option>Safe IT automation</option>
                  <option>A unified admin workflow</option>
                  <option>Something else</option>
                </select>
              </div>
            </label>
            <label className="contact-field-wide">
              <span>Message</span>
              <textarea name="message" rows="5" placeholder="Tell us a little about your current IT support setup…" required />
            </label>
          </div>

          <button type="submit" className="contact-submit">
            Send request <IconArrow aria-hidden="true" />
          </button>

          <div className="contact-form-footer" aria-live="polite">
            <span>Your details are only used to respond to this request.</span>
            {status && <strong><IconCheck aria-hidden="true" /> {status}</strong>}
          </div>
        </form>
      </div>
    </section>
  );
}
