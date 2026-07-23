import { useState } from 'react';
import { IconArrow, IconCheck } from './Icons.jsx';
import SelectField from './SelectField.jsx';

const ENDPOINT = 'https://fcbttikoce.execute-api.eu-central-1.amazonaws.com/contact';
const EMAIL = 'nevian.info@gmail.com';

export default function ContactSection() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ message: '', kind: '' });

  const openEmailFallback = (data) => {
    const subject = `Nevian walkthrough request: ${data.company || data.firstName || 'New request'}`;
    const body = [
      `Name: ${data.firstName || ''} ${data.lastName || ''}`,
      `Work email: ${data.email || ''}`,
      `Company: ${data.company || ''}`,
      `Company size: ${data.companySize || ''}`,
      `Number of devices: ${data.devices || ''}`,
      `Looking to improve: ${data.goal || ''}`,
      '',
      data.message || '',
    ].join('\n');
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    if (data.website) {
      // honeypot
      form.reset();
      setStatus({ message: 'Thanks. We received your request.', kind: 'success' });
      return;
    }

    setSending(true);
    setStatus({ message: 'Sending your request…', kind: '' });
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Request failed');
      form.reset();
      setStatus({ message: 'Thanks. We will get back to you shortly.', kind: 'success' });
    } catch {
      setStatus({ message: 'Opening your email app instead…', kind: 'success' });
      openEmailFallback(data);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-shell">
        <div className="contact-intro">
          <h2>See whether Nevian fits your team.</h2>
          <p>Tell us how support works today. We&apos;ll show you what Nevian could take on and where your team would stay involved.</p>

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
              <h3>Tell us about your setup.</h3>
            </div>
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
              <SelectField
                name="companySize"
                defaultValue="1 to 25 employees"
                required
                options={[
                  '1 to 25 employees',
                  '26 to 100 employees',
                  '101 to 500 employees',
                  '501 to 1,000 employees',
                  '1,000+ employees',
                ]}
              />
            </label>
            <label>
              <span>Number of devices</span>
              <SelectField
                name="devices"
                defaultValue="Under 25"
                required
                options={['Under 25', '25 to 100', '101 to 500', '501 to 1,000', '1,000+']}
              />
            </label>
            <label className="contact-field-wide">
              <span>What are you looking to improve?</span>
              <SelectField
                name="goal"
                defaultValue="Faster ticket resolution"
                required
                options={[
                  'Faster ticket resolution',
                  'Better endpoint visibility',
                  'Safe IT automation',
                  'A unified admin workflow',
                  'Something else',
                ]}
              />
            </label>
            <label className="contact-field-wide">
              <span>Message</span>
              <textarea name="message" rows="5" placeholder="Tell us a little about your current IT support setup…" required />
            </label>
          </div>

          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
            <label>Leave empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
          </div>

          <button type="submit" className="contact-submit" disabled={sending}>
            {sending ? 'Sending…' : 'Send request'} <IconArrow aria-hidden="true" />
          </button>

          <div className="contact-form-footer" aria-live="polite">
            <span>Your details are only used to respond to this request.</span>
            {status.message && <strong><IconCheck aria-hidden="true" /> {status.message}</strong>}
          </div>
        </form>
      </div>
    </section>
  );
}
