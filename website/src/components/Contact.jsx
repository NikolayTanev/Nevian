import { useState } from 'react';
import { useReveal } from '../hooks/useReveal.js';

const ENDPOINT = 'https://fcbttikoce.execute-api.eu-central-1.amazonaws.com/contact';
const EMAIL = 'nevian.info@gmail.com';

export default function Contact() {
  const [ref, shown] = useReveal();
  const [status, setStatus] = useState({ msg: '', kind: '' });
  const [sending, setSending] = useState(false);

  const mailtoFallback = (data) => {
    const subject = `Nevian contact: ${data.company || data.firstName || 'New lead'}`;
    const body = [
      `Name: ${data.firstName || ''} ${data.lastName || ''}`,
      `Email: ${data.email || ''}`,
      `Company: ${data.company || ''}`,
      `Company size: ${data.companySize || ''}`,
      `Devices: ${data.devices || ''}`,
      '',
      data.message || '',
    ].join('\n');
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    if (data.website) {
      // honeypot
      setStatus({ msg: 'Thanks. We received your request.', kind: 'ok' });
      form.reset();
      return;
    }
    if (!data.firstName || !data.lastName || !data.email) {
      setStatus({ msg: 'Please fill in your name and work email.', kind: 'err' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setStatus({ msg: 'Please enter a valid email address.', kind: 'err' });
      return;
    }

    setSending(true);
    setStatus({ msg: 'Sending your request…', kind: '' });
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        form.reset();
        setStatus({ msg: 'Thanks. We received your request and will get back to you shortly.', kind: 'ok' });
      } else {
        const payload = await res.json().catch(() => ({}));
        setStatus({ msg: payload.error || `Something went wrong. Please email ${EMAIL}.`, kind: 'err' });
      }
    } catch {
      // network/CORS failure — fall back to the visitor's email client
      setStatus({ msg: 'Opening your email app instead…', kind: 'ok' });
      mailtoFallback(data);
    } finally {
      setSending(false);
    }
  };

  const field = 'rounded-xl border border-border-2 bg-bg px-3.5 py-2.5 font-sans text-text outline-none transition focus:border-accent focus:ring-4 focus:ring-accent-soft';

  return (
    <section id="contact" className="py-20">
      <div className="wrap">
        <div ref={ref} className={`mx-auto max-w-2xl text-center ${shown ? 'animate-fade-up' : 'opacity-0'}`}>
          <h2 className="text-3xl font-extrabold sm:text-4xl">Tell us what your team needs</h2>
          <p className="mt-3 text-lg text-dim">Share a little about your setup and we&apos;ll reply shortly.</p>
        </div>

        <form onSubmit={onSubmit} noValidate className="mx-auto mt-8 max-w-2xl rounded-3xl border border-border bg-surface p-8 shadow-card">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-dim">First name</span>
              <input name="firstName" autoComplete="given-name" className={field} required />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-dim">Last name</span>
              <input name="lastName" autoComplete="family-name" className={field} required />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-dim">Work email</span>
              <input name="email" type="email" autoComplete="email" className={field} required />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-dim">Company</span>
              <input name="company" autoComplete="organization" className={field} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-dim">Company size</span>
              <select name="companySize" className={field} defaultValue="">
                <option value="">Select…</option>
                <option>1 to 10</option>
                <option>11 to 50</option>
                <option>51 to 200</option>
                <option>201 to 500</option>
                <option>500+</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-dim">Managed devices</span>
              <input name="devices" inputMode="numeric" placeholder="e.g. 120" className={field} />
            </label>
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-semibold text-dim">Message</span>
              <textarea name="message" rows={4} placeholder="Anything else we should know?" className={`${field} resize-y`} />
            </label>
          </div>

          {/* honeypot */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label>Do not fill<input tabIndex={-1} autoComplete="off" name="website" /></label>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button type="submit" disabled={sending} className="btn btn-primary text-base disabled:opacity-60">
              {sending ? 'Sending…' : 'Send request'}
            </button>
            {status.msg && (
              <span className={`text-sm ${status.kind === 'ok' ? 'text-accent-deep' : status.kind === 'err' ? 'text-danger' : 'text-muted'}`}>
                {status.msg}
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
