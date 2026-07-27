import { useState } from 'react';
import PlatformMenu from './PlatformMenu.jsx';

const mobilePlatformLinks = [
  ['Platform overview', '/#features'],
  ['Workflow', '/#how'],
  ['Security', '/#password-reset'],
  ['Integrations', '/#integrations'],
];

// The dark/green Nevian navigation shared by the landing page and every
// dedicated feature page, so the header stays identical across the site.
export default function ScratchNav() {
  const [platformOpen, setPlatformOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePlatformOpen, setMobilePlatformOpen] = useState(false);

  return (
    <>
      <nav className="scratch-nav" aria-label="Primary navigation">
        <a className="scratch-brand" href="/" aria-label="Nevian home">
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
          <a href="/#contact">Contact</a>
        </div>
        <div className="scratch-nav-actions">
          <a className="scratch-signup" href="/#contact">Book a demo</a>
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
        <a href="/#contact">Contact</a>
      </div>
    </>
  );
}
