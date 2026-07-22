import { useEffect, useState } from 'react';
import PasswordResetDemo from './components/PasswordResetDemo.jsx';
import PlatformMenu from './components/PlatformMenu.jsx';

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4" /></svg>;
}

const mobilePlatformLinks = [
  ['Platform overview', '/#features'],
  ['Workflow', '/#how'],
  ['Security', '/#password-reset'],
  ['Integrations', '/#integrations'],
];

export default function ScratchLanding() {
  const [platformOpen, setPlatformOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePlatformOpen, setMobilePlatformOpen] = useState(false);
  const [demoRun, setDemoRun] = useState(0);
  const [workloadReduction, setWorkloadReduction] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setWorkloadReduction(60);
      return undefined;
    }

    const duration = 1400;
    const startedAt = performance.now();
    let frame = 0;

    const update = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - ((1 - progress) ** 3);
      setWorkloadReduction(Math.round(60 * eased));
      if (progress < 1) frame = window.requestAnimationFrame(update);
    };

    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <main className="scratch-page">
      <nav className="scratch-nav" aria-label="Primary navigation">
        <a className="scratch-brand" href="/scratch.html" aria-label="Nevian home">
          <img src="/assets/logo.png" alt="" />
          <span>Nevian</span>
        </a>
        <div className="scratch-links">
          <a href="/#top">Home</a>
          <a href="/#how">Workflow</a>
          <PlatformMenu
            active={false}
            open={platformOpen}
            onOpenChange={setPlatformOpen}
            onNavigate={() => setPlatformOpen(false)}
          />
          <a href="/process.html">Process</a>
          <a href="/contact.html">Contact</a>
        </div>
        <div className="scratch-nav-actions">
          <a className="scratch-signup" href="/contact.html">Book a demo</a>
          <button
            className={`scratch-menu ${mobileOpen ? 'is-open' : ''}`}
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          ><i /><i /></button>
        </div>
      </nav>

      <div className={`scratch-mobile-nav ${mobileOpen ? 'is-open' : ''}`} aria-hidden={!mobileOpen}>
        <a href="/#top">Home</a>
        <a href="/#how">Workflow</a>
        <button type="button" aria-expanded={mobilePlatformOpen} onClick={() => setMobilePlatformOpen((open) => !open)}>
          Platform <span>⌄</span>
        </button>
        <div className={`scratch-mobile-platform ${mobilePlatformOpen ? 'is-open' : ''}`}>
          {mobilePlatformLinks.map(([label, href]) => <a href={href} key={label}>{label}</a>)}
        </div>
        <a href="/process.html">Process</a>
        <a href="/contact.html">Contact</a>
      </div>

      <section className="scratch-hero" id="product">
        <a className="scratch-release scratch-release-mobile" href="#demo">Nevian AI <span>See it resolve a request</span><ArrowIcon /></a>
        <div className="scratch-hero-copy">
          <h1 aria-label="Cut routine IT workload by up to 60%">Cut routine IT workload by up to <strong aria-hidden="true">{workloadReduction}%</strong></h1>
          <p>Nevian combines identity, endpoint context, and policy-aware automation to resolve repetitive requests safely before they enter your team&apos;s queue.</p>
          <div className="scratch-actions">
            <a className="scratch-primary" href="/contact.html">Book a demo</a>
          </div>
        </div>
        <a className="scratch-release scratch-release-desktop" href="#demo"><b>Nevian AI</b> Password reset, start to finish <ArrowIcon /></a>
      </section>

      <section className="scratch-stage" id="demo" aria-label="Nevian password reset demo">
        <div className="scratch-browser">
          <div className="scratch-browser-bar">
            <div className="scratch-browser-dots"><i /><i /><i /></div>
            <div className="scratch-browser-address"><span aria-hidden="true">⌕</span> your-company.nevian-info.com/support</div>
            <div className="scratch-browser-tools">
              <button type="button" onClick={() => setDemoRun((run) => run + 1)} aria-label="Restart demo" title="Restart demo">
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M15.5 6.5A6 6 0 1 0 16 12M15.5 3v3.5H12" /></svg>
              </button>
              <a href="/contact.html" aria-label="Open support" title="Open support">
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M11 4h5v5M16 4l-7 7M15 11v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" /></svg>
              </a>
            </div>
          </div>
          <div className="scratch-demo"><PasswordResetDemo key={demoRun} /></div>
        </div>
      </section>
    </main>
  );
}