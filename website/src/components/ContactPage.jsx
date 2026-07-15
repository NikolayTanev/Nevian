import { useState } from 'react';
import Nav from './Nav.jsx';
import { IconArrow, IconCheck } from './Icons.jsx';

const ENDPOINT = 'https://fcbttikoce.execute-api.eu-central-1.amazonaws.com/contact';
const EMAIL = 'nevian.info@gmail.com';

const details = [
  'A focused 30-minute walkthrough',
  'A practical fit check for your environment',
  'A reply within one business day',
];

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ message: '', kind: '' });

  const openEmailFallback = (data) => {
    const subject = `Nevian contact: ${data.company || data.firstName || 'New request'}`;
    const body = [
      `Name: ${data.firstName || ''} ${data.lastName || ''}`,
      `Work email: ${data.email || ''}`,
      `Company: ${data.company || ''}`,
      `Company size: ${data.companySize || ''}`,
      `Managed devices: ${data.devices || ''}`,
      `Goal: ${data.goal || ''}`,
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
      form.reset();
      setStatus({ message: 'Thanks. We received your request.', kind: 'success' });
      return;
    }

    setSending(true);
    setStatus({ message: 'Sending your request...', kind: '' });

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
      setStatus({ message: 'Opening your email app instead...', kind: 'success' });
      openEmailFallback(data);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Nav current="contact" />

      <main className="contact-page">
        <section className="contact-page-section">
          <div className="contact-page-shell">
            <div className="contact-page-copy">
              <div className="contact-page-eyebrow">Contact Nevian</div>
              <h1>Let&apos;s make IT support feel lighter.</h1>
              <p>
                Tell us where support work slows your team down. We&apos;ll show you where Nevian can add context,
                remove repetitive work, and keep every action visible.
              </p>

              <ul className="contact-page-details">
                {details.map((detail) => (
                  <li key={detail}><IconCheck aria-hidden="true" /> {detail}</li>
                ))}
              </ul>

              <a className="contact-page-email" href={`mailto:${EMAIL}`}>
                Prefer email? <strong>{EMAIL}</strong>
              </a>
            </div>

            <form className="contact-page-form" onSubmit={handleSubmit}>
              <div className="contact-page-form-header">
                <div>
                  <span>Start a conversation</span>
                  <h2>Tell us about your team.</h2>
                </div>
                <div className="contact-page-private"><i /> Private by default</div>
              </div>

              <div className="contact-page-fields">
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
                  <span>Company</span>
                  <input name="company" type="text" autoComplete="organization" placeholder="Company Inc." required />
                </label>
                <label>
                  <span>Company size</span>
                  <select name="companySize" defaultValue="1-25 employees" required>
                    <option>1-25 employees</option>
                    <option>26-100 employees</option>
                    <option>101-500 employees</option>
                    <option>501-1,000 employees</option>
                    <option>1,000+ employees</option>
                  </select>
                </label>
                <label>
                  <span>Managed devices</span>
                  <select name="devices" defaultValue="Under 25" required>
                    <option>Under 25</option>
                    <option>25-100</option>
                    <option>101-500</option>
                    <option>501-1,000</option>
                    <option>1,000+</option>
                  </select>
                </label>
                <label className="contact-page-field-wide">
                  <span>What are you looking to improve?</span>
                  <select name="goal" defaultValue="Faster ticket resolution" required>
                    <option>Faster ticket resolution</option>
                    <option>Better endpoint visibility</option>
                    <option>Safe IT automation</option>
                    <option>A unified admin workflow</option>
                    <option>Something else</option>
                  </select>
                </label>
                <label className="contact-page-field-wide">
                  <span>Message</span>
                  <textarea name="message" rows="5" placeholder="Tell us a little about your current IT support setup..." required />
                </label>
              </div>

              <div className="contact-page-honeypot" aria-hidden="true">
                <label>Leave empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
              </div>

              <button className="contact-page-submit" type="submit" disabled={sending}>
                {sending ? 'Sending...' : 'Send request'} <IconArrow aria-hidden="true" />
              </button>

              <div className={`contact-page-status ${status.kind === 'success' ? 'is-success' : ''}`} aria-live="polite">
                {status.message}
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="contact-page-footer">
        <a href="/" className="contact-page-footer-brand"><img src="/assets/logo.png" alt="" /> Nevian</a>
        <span>AI-powered IT support for lean teams.</span>
        <span>© {new Date().getFullYear()} Nevian</span>
      </footer>
    </>
  );
}
