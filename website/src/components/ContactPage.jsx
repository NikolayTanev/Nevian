import { useEffect, useState } from 'react';
import Nav from './Nav.jsx';
import ContactSelect from './ContactSelect.jsx';
import { IconArrow, IconCheck } from './Icons.jsx';

const ENDPOINT = 'https://fcbttikoce.execute-api.eu-central-1.amazonaws.com/contact';
const EMAIL = 'nevian.info@gmail.com';

const details = [
  'A focused 30 minute walkthrough',
  'An honest look at whether Nevian fits your environment',
  'A reply within one business day',
];

const validationMessages = {
  firstName: 'Enter your first name.',
  lastName: 'Enter your last name.',
  email: 'Enter your work email.',
  company: 'Enter your company name.',
  companySize: 'Choose your company size.',
  devices: 'Choose a device count.',
  goal: 'Choose what you want to improve.',
  message: 'Add a short message.',
};

function findInvalidField(form) {
  return Array.from(form.elements).find((field) => field.willValidate && !field.validity.valid);
}

function validationMessageFor(field) {
  if (field.name === 'email' && field.validity.typeMismatch) return 'Enter a valid work email.';
  return validationMessages[field.name] || 'Check this field and try again.';
}

function focusInvalidField(field) {
  const customTrigger = field.closest('.contact-page-select')?.querySelector('.contact-page-select-trigger');
  (customTrigger || field).focus();
}

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ message: '', kind: '' });

  useEffect(() => {
    document.documentElement.classList.add('contact-route');
    return () => document.documentElement.classList.remove('contact-route');
  }, []);

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
      form.classList.remove('has-validation-errors');
      form.reset();
      setStatus({ message: 'Thanks. We received your request.', kind: 'success' });
      return;
    }

    const invalidField = findInvalidField(form);
    if (invalidField) {
      form.classList.add('has-validation-errors');
      setStatus({ message: validationMessageFor(invalidField), kind: 'error' });
      window.requestAnimationFrame(() => focusInvalidField(invalidField));
      return;
    }

    form.classList.remove('has-validation-errors');
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

  const handleInput = (event) => {
    const form = event.currentTarget;
    if (!form.classList.contains('has-validation-errors')) return;

    const invalidField = findInvalidField(form);
    if (invalidField) {
      setStatus({ message: validationMessageFor(invalidField), kind: 'error' });
      return;
    }

    form.classList.remove('has-validation-errors');
    setStatus({ message: '', kind: '' });
  };

  return (
    <>
      <Nav current="contact" />

      <main className="contact-page">
        <section className="contact-page-section">
          <div className="contact-page-shell">
            <div className="contact-page-copy">
              <h1>Let&apos;s talk about your support workload.</h1>
              <p>
                Tell us what takes up your team&apos;s time today. We&apos;ll explain how Nevian could handle the routine work
                and where your team would stay involved.
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

            <form className="contact-page-form" onSubmit={handleSubmit} onInput={handleInput} noValidate>
              <div className="contact-page-form-header">
                <div>
                  <h2>Tell us about your team.</h2>
                </div>
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
                <ContactSelect
                  name="companySize"
                  label="Company size"
                  placeholder="Select company size"
                  options={[
                    '1 to 25 employees',
                    '26 to 100 employees',
                    '101 to 500 employees',
                    '501 to 1,000 employees',
                    '1,000+ employees',
                  ]}
                />
                <ContactSelect
                  name="devices"
                  label="Managed devices"
                  placeholder="Select device count"
                  options={[
                    'Under 25',
                    '25 to 100',
                    '101 to 500',
                    '501 to 1,000',
                    '1,000+',
                  ]}
                />
                <ContactSelect
                  className="contact-page-field-wide"
                  name="goal"
                  label="What are you looking to improve?"
                  placeholder="Select a goal"
                  options={[
                    'Faster ticket resolution',
                    'Better endpoint visibility',
                    'Safe IT automation',
                    'A unified admin workflow',
                    'Something else',
                  ]}
                />
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

              <div className={`contact-page-status ${status.kind ? `is-${status.kind}` : ''}`} aria-live="polite">
                {status.message}
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="contact-page-footer">
        <a href="/" className="contact-page-footer-brand"><img src="/assets/logo.png" alt="" /> Nevian</a>
        <span>Nevian handles routine support work and keeps your team informed.</span>
        <span>© {new Date().getFullYear()} Nevian</span>
      </footer>
    </>
  );
}
