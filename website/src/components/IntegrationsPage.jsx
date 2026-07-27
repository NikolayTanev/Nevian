import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import ScratchNav from './ScratchNav.jsx';
import ContactSection from './ContactSection.jsx';
import Footer from './Footer.jsx';

gsap.registerPlugin(ScrollToPlugin);

// `wordmark` logos already contain the brand name, so no text label is added.
const integrations = [
  { id: 'jira', name: 'Jira', wordmark: true, desc: 'If your team runs Jira, Nevian works right inside it: open, update, and close issues, and push changes or exports over to ServiceNow and other tools.' },
  { id: 'servicenow', name: 'ServiceNow', wordmark: true, desc: 'Use ServiceNow? Nevian keeps incidents and requests in sync, and moves service changes or exports between it and Jira or other providers.' },
  { id: 'microsoft-6', name: 'Microsoft 365', wordmark: true, desc: 'Reset passwords, manage mailboxes, and handle account tasks across Microsoft 365.' },
  { id: 'azure-active-directory', name: 'Microsoft Entra ID', wordmark: false, desc: 'Verify identity and manage access against your Entra directory.' },
  { id: 'azure-2', name: 'Microsoft Azure', wordmark: false, desc: 'Read device state and act on cloud resources in Azure.' },
  { id: 'powershell', name: 'PowerShell', wordmark: false, desc: 'Run approved PowerShell on endpoints as SYSTEM, with no SSH.' },
  { id: 'windows-server', name: 'Windows Server', wordmark: true, desc: 'Run maintenance, checks, and fixes on Windows Server remotely.' },
  { id: 'windows-darkblue-2012-svg', name: 'Windows', wordmark: true, desc: 'Manage Windows endpoints: patches, services, and routine fixes.' },
  { id: 'more', name: 'Request an integration', cta: true, desc: 'Running something else? If your team uses it, we can plug Nevian into it. Just ask.' },
];

export default function IntegrationsPage() {
  // Clean "/integrations" in the address bar.
  useEffect(() => {
    if (window.location.pathname.endsWith('/integrations.html')) {
      const clean = window.location.pathname.replace(/\.html$/, '');
      window.history.replaceState(null, '', clean + window.location.hash);
    }
  }, []);

  // Smooth-scroll same-page anchors (e.g. cards / "Book a demo" -> contact).
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const handleClick = (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;
      const raw = link.getAttribute('href') || '';
      if (!raw.startsWith('#')) return;
      const target = document.querySelector(raw);
      if (!target) return;
      event.preventDefault();
      gsap.to(window, {
        duration: reduce ? 0 : 0.9,
        ease: 'power2.inOut',
        scrollTo: { y: target, offsetY: 68 },
      });
      window.history.pushState(null, '', raw);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <main className="scratch-page feature-page">
      <ScratchNav />

      <section className="feature-hero">
        <a className="feature-eyebrow" href="/">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12 5l-5 5 5 5" /></svg>
          Home
        </a>
        <h1>Works with the tools<br />your team already uses</h1>
        <div className="feature-hero-actions">
          <a className="scratch-primary" href="#contact">Book a demo</a>
          <a className="scratch-secondary" href="#contact">Request an integration</a>
        </div>
      </section>

      <section className="intg-section" aria-label="Nevian integrations">
        <div className="intg-grid">
          {integrations.map((item) => (
            <a className={`intg-card ${item.cta ? 'is-cta' : ''}`} href="#contact" key={item.id}>
              <p className="intg-desc">{item.desc}</p>
              <div className="intg-foot">
                {item.cta ? (
                  <span className="intg-brand-cta">{item.name}</span>
                ) : (
                  <span className="intg-brand">
                    <img className={`intg-logo ${item.wordmark ? 'is-word' : 'is-icon'}`} data-logo={item.id} src={`/assets/integrations/${item.id}.svg`} alt={item.name} />
                    {!item.wordmark && <b>{item.name}</b>}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      </section>

      <ContactSection />
      <Footer showCta={false} />
    </main>
  );
}
