import { useEffect, useRef, useState } from 'react';
import { IconChevron, IconMenu, IconClose, IconChat, IconDevice, IconGrid, IconShield } from './Icons.jsx';

const solutions = [
  { title: 'AI Ticketing', desc: 'Plain-language intake & triage', Icon: IconChat, href: '#features' },
  { title: 'Endpoint Agent', desc: 'Live device context on every ticket', Icon: IconDevice, href: '#features' },
  { title: 'Admin Dashboard', desc: 'One command center for IT', Icon: IconGrid, href: '#features' },
  { title: 'Security & Automation', desc: 'Signed, audited outbound jobs', Icon: IconShield, href: '#features' },
];

export default function Nav({ onDropdownChange }) {
  const [open, setOpen] = useState(false); // dropdown
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => {
    onDropdownChange?.(open);
  }, [open, onDropdownChange]);

  const enter = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const leave = () => {
    // small grace period so crossing the gap doesn't flicker
    closeTimer.current = setTimeout(() => setOpen(false), 90);
  };

  const links = (
    <>
      <a href="#how" className="site-nav-mobile-link">
        How it works
      </a>
      <a href="#features" className="site-nav-mobile-link">
        Features
      </a>
      <a href="#contact" className="site-nav-mobile-link">
        Contact
      </a>
    </>
  );

  return (
    <header className="site-nav sticky top-0 z-50">
      <div className="site-nav-inner wrap flex h-[4.5rem] items-center gap-4">
        <a href="#top" className="site-nav-brand flex items-center gap-2.5 font-display text-lg font-extrabold">
          <img src="/assets/logo.png" alt="Nevian" className="h-8 w-8 object-contain" />
          <span>Nevian</span>
        </a>

        {/* Desktop links */}
        <nav className="ml-2 hidden items-center gap-1 lg:flex" aria-label="Primary">
          <a href="#how" className="site-nav-link is-current">
            How it works
          </a>

          <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
            <button
              className="site-nav-link flex items-center gap-1.5"
              aria-expanded={open}
              aria-haspopup="true"
              onClick={() => setOpen((v) => !v)}
            >
              Solutions
              <IconChevron className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {/* Menu */}
            <div
              className={`absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3 transition ${
                open ? 'visible opacity-100' : 'invisible opacity-0'
              }`}
            >
              {/* invisible bridge fills the gap so hover stays alive */}
              <div
                className={`site-nav-dropdown grid gap-1 rounded-2xl p-2 transition-transform duration-200 ${
                  open ? 'translate-y-0 scale-100' : '-translate-y-2 scale-95'
                }`}
              >
                {solutions.map(({ title, desc, Icon, href }) => (
                  <a
                    key={title}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="site-nav-dropdown-item group flex items-start gap-3 rounded-xl p-2.5 transition"
                  >
                    <span className="site-nav-dropdown-icon mt-0.5 transition">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="site-nav-dropdown-title block text-sm font-bold">{title}</span>
                      <span className="site-nav-dropdown-desc block text-xs">{desc}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <a href="#features" className="site-nav-link">
            Features
          </a>
          <a href="#contact" className="site-nav-link">
            Contact
          </a>
        </nav>

        <div className="site-nav-spacer" />

        <a href="#contact" className="site-nav-cta hidden text-sm sm:inline-flex">
          Book a demo
        </a>

        <button
          className="site-nav-toggle inline-flex h-10 w-10 items-center justify-center rounded-xl lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobile}
          onClick={() => setMobile((v) => !v)}
        >
          {mobile ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobile && (
        <div className="wrap lg:hidden">
          <div className="site-nav-mobile-menu mt-2 flex flex-col gap-1 rounded-2xl p-3">
            <div className="flex flex-col" onClick={() => setMobile(false)}>
              {links}
            </div>
            <div className="site-nav-mobile-solutions mt-1 border-t pt-2">
              <span className="site-nav-mobile-label px-4 text-xs font-bold uppercase tracking-wider">Solutions</span>
              {solutions.map(({ title, href }) => (
                <a key={title} href={href} onClick={() => setMobile(false)} className="site-nav-mobile-link block rounded-lg px-4 py-2 text-sm font-medium">
                  {title}
                </a>
              ))}
            </div>
            <a href="#contact" onClick={() => setMobile(false)} className="site-nav-cta mt-2 flex w-full">
              Book a demo
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
