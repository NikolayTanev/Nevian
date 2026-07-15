import { useEffect, useState } from 'react';
import { IconMenu, IconClose } from './Icons.jsx';

const navigation = [
  { label: 'Home', href: '/#top', key: 'home' },
  { label: 'Workflow', href: '/#how', key: 'workflow' },
  { label: 'Platform', href: '/#features', key: 'platform' },
  { label: 'Process', href: '/process.html', key: 'process' },
  { label: 'Contact', href: '/contact.html', key: 'contact' },
];

const trackedSections = [
  { id: 'top', key: 'home' },
  { id: 'how', key: 'workflow' },
  { id: 'features', key: 'platform' },
];

export default function Nav({ current = 'home' }) {
  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState(current);

  useEffect(() => {
    if (current !== 'home') {
      setActive(current);
      return undefined;
    }

    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      const navHeight = document.querySelector('.site-nav')?.getBoundingClientRect().height || 72;
      const probe = window.scrollY + navHeight + Math.min(190, window.innerHeight * .28);
      let next = 'home';

      trackedSections.forEach(({ id, key }) => {
        const section = document.getElementById(id);
        const sectionTop = section ? section.getBoundingClientRect().top + window.scrollY : Infinity;
        if (sectionTop <= probe) next = key;
      });

      setActive((value) => (value === next ? value : next));
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [current]);

  const navigate = (event, href) => {
    setMobile(false);

    const hash = href.startsWith('/#') ? href.slice(1) : '';
    const onHomepage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html');
    if (!hash || !onHomepage) return;

    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    window.requestAnimationFrame(() => {
      const navHeight = document.querySelector('.site-nav')?.getBoundingClientRect().height || 72;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.history.pushState(null, '', hash);
      window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
    });
  };

  return (
    <header className="site-nav sticky top-0 z-50">
      <div className="site-nav-inner wrap flex h-[4.5rem] items-center gap-4">
        <a href="/#top" className="site-nav-brand flex items-center gap-2.5 font-display text-lg font-extrabold">
          <img src="/assets/logo.png" alt="Nevian" className="h-8 w-8 object-contain" />
          <span>Nevian</span>
        </a>

        <nav className="ml-2 hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navigation.map(({ label, href, key }) => (
            <a
              key={label}
              href={href}
              onClick={(event) => navigate(event, href)}
              className={`site-nav-link ${active === key ? 'is-current' : ''}`}
              aria-current={active === key ? 'location' : undefined}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="site-nav-spacer" />

        <a href="/contact.html" className="site-nav-cta hidden text-sm sm:inline-flex">
          Book a demo
        </a>

        <button
          className="site-nav-toggle inline-flex h-10 w-10 items-center justify-center rounded-xl lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobile}
          aria-controls="site-mobile-navigation"
          onClick={() => setMobile((value) => !value)}
        >
          {mobile ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
        </button>
      </div>

      {mobile && (
        <div className="wrap lg:hidden" id="site-mobile-navigation">
          <nav className="site-nav-mobile-menu mt-2 flex flex-col gap-1 rounded-2xl p-3" aria-label="Mobile navigation">
            {navigation.map(({ label, href, key }) => (
              <a
                key={label}
                href={href}
                onClick={(event) => navigate(event, href)}
                className={`site-nav-mobile-link ${active === key ? 'is-current' : ''}`}
                aria-current={active === key ? 'location' : undefined}
              >
                {label}
              </a>
            ))}
            <a href="/contact.html" onClick={() => setMobile(false)} className="site-nav-cta mt-2 flex w-full">
              Book a demo
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
