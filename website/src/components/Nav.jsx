import { useEffect, useState } from 'react';

const workflowSteps = [
  { label: 'Report', slug: 'report' },
  { label: 'Triage', slug: 'triage' },
  { label: 'Context', slug: 'context' },
  { label: 'Automate', slug: 'automate' },
  { label: 'Resolve', slug: 'resolve' },
];

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

const prefetchedPages = new Set();

function prefetchPage(href) {
  if (!href || typeof document === 'undefined') return;

  const url = new URL(href, window.location.href);
  url.hash = '';
  if (url.origin !== window.location.origin) return;
  if (url.pathname === window.location.pathname && url.search === window.location.search) return;

  const key = url.href;
  if (prefetchedPages.has(key)) return;
  prefetchedPages.add(key);

  const hint = document.createElement('link');
  hint.rel = 'prefetch';
  hint.href = key;
  hint.setAttribute('fetchpriority', 'low');
  document.head.appendChild(hint);
}

export default function Nav({ current = 'home' }) {
  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState(current);
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  useEffect(() => {
    const nav = document.querySelector('.site-nav');
    if (!nav) return undefined;

    const warmRoute = (event) => {
      const anchor = event.target.closest?.('a[href]');
      if (anchor && nav.contains(anchor)) prefetchPage(anchor.getAttribute('href'));
    };

    nav.addEventListener('pointerover', warmRoute, { passive: true });
    nav.addEventListener('focusin', warmRoute);
    nav.addEventListener('touchstart', warmRoute, { passive: true });

    return () => {
      nav.removeEventListener('pointerover', warmRoute);
      nav.removeEventListener('focusin', warmRoute);
      nav.removeEventListener('touchstart', warmRoute);
    };
  }, []);

  useEffect(() => {
    const updateWorkflowStep = (event) => {
      const index = Number(event.detail?.index);
      if (Number.isInteger(index) && index >= 0 && index < workflowSteps.length) {
        setActiveWorkflowStep(index);
      }
    };

    window.addEventListener('nevian:workflow-active', updateWorkflowStep);
    return () => window.removeEventListener('nevian:workflow-active', updateWorkflowStep);
  }, []);

  useEffect(() => {
    if (!mobile) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMobile(false);
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = (event) => {
      if (event.matches) setMobile(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    desktop.addEventListener('change', closeOnDesktop);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [mobile]);

  useEffect(() => {
    if (current !== 'home') {
      setActive(current);
      return undefined;
    }

    const sections = trackedSections
      .map(({ id, key }) => ({ element: document.getElementById(id), key }))
      .filter(({ element }) => element);

    const setInitialSection = () => {
      const navHeight = document.querySelector('.site-nav')?.getBoundingClientRect().height || 72;
      const probe = window.scrollY + navHeight + Math.min(190, window.innerHeight * .28);
      let next = 'home';

      sections.forEach(({ element, key }) => {
        const sectionTop = element.getBoundingClientRect().top + window.scrollY;
        if (sectionTop <= probe) next = key;
      });

      setActive((value) => (value === next ? value : next));
    };

    setInitialSection();

    if (!('IntersectionObserver' in window)) return undefined;

    // A narrow viewport band updates the indicator natively without running
    // layout reads in the scroll handler. This keeps iOS momentum scrolling free.
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (!visible.length) return;
      const match = sections.find(({ element }) => element === visible[visible.length - 1].target);
      if (match) setActive((value) => (value === match.key ? value : match.key));
    }, { rootMargin: '-18% 0px -72% 0px', threshold: 0 });

    sections.forEach(({ element }) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [current]);

  const navigate = (event, href) => {
    setMobile(false);
    setWorkflowOpen(false);

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

  const navigateWorkflowStep = (event, step, index) => {
    setMobile(false);
    setWorkflowOpen(false);
    setActiveWorkflowStep(index);

    const onHomepage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html');
    if (!onHomepage) return;

    event.preventDefault();
    const hash = `#workflow-${step.slug}`;
    window.history.pushState(null, '', hash);
    window.dispatchEvent(new CustomEvent('nevian:workflow-step', {
      detail: { index, slug: step.slug },
    }));
  };

  return (
    <header className={`site-nav ${current === 'home' ? 'site-nav--overlay' : ''} sticky top-0 z-50`}>
      <div className="site-nav-inner wrap flex h-[4.5rem] items-center gap-4">
        <a href="/#top" className="site-nav-brand flex items-center gap-2.5 font-display text-lg font-extrabold">
          <img src="/assets/logo.png" alt="Nevian" className="h-8 w-8 object-contain" />
          <span>Nevian</span>
        </a>

        <nav className="ml-2 hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navigation.map(({ label, href, key }) => {
            if (key !== 'workflow') {
              return (
                <a
                  key={label}
                  href={href}
                  onClick={(event) => navigate(event, href)}
                  className={`site-nav-link ${active === key ? 'is-current' : ''}`}
                  aria-current={active === key ? 'location' : undefined}
                >
                  {label}
                </a>
              );
            }

            return (
              <div
                key={label}
                className={`site-nav-workflow ${workflowOpen ? 'is-open' : ''}`}
                onMouseEnter={() => setWorkflowOpen(true)}
                onMouseLeave={() => setWorkflowOpen(false)}
                onFocus={() => setWorkflowOpen(true)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setWorkflowOpen(false);
                }}
              >
                <a
                  href={href}
                  onClick={(event) => navigate(event, href)}
                  className={`site-nav-link site-nav-workflow-trigger ${active === key ? 'is-current' : ''}`}
                  aria-current={active === key ? 'location' : undefined}
                  aria-haspopup="menu"
                  aria-expanded={workflowOpen}
                >
                  {label}
                  <svg viewBox="0 0 12 12" aria-hidden="true">
                    <path d="m3 4.5 3 3 3-3" />
                  </svg>
                </a>

                <div className="site-nav-dropdown site-nav-workflow-menu" role="menu" aria-label="Workflow steps">
                  <div className="site-nav-workflow-kicker">Jump to a step</div>
                  {workflowSteps.map((step, index) => (
                    <a
                      key={step.slug}
                      href={`/#workflow-${step.slug}`}
                      role="menuitem"
                      onClick={(event) => navigateWorkflowStep(event, step, index)}
                      className={`site-nav-workflow-item ${active === 'workflow' && activeWorkflowStep === index ? 'is-active' : ''}`}
                    >
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{step.label}</strong>
                      <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7h8m-3-3 3 3-3 3" /></svg>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="site-nav-spacer" />

        <a href="/contact.html" className="site-nav-cta hidden text-sm sm:inline-flex">
          Book a demo
        </a>

        <button
          className={`site-nav-toggle inline-flex h-11 w-11 items-center justify-center lg:hidden ${mobile ? 'is-open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={mobile}
          aria-controls="site-mobile-navigation"
          onClick={() => setMobile((value) => {
            const next = !value;
            if (next) setWorkflowOpen(false);
            return next;
          })}
        >
          <span className="site-nav-toggle-lines" aria-hidden="true"><i /><i /><i /></span>
        </button>
      </div>

      {mobile && (
        <div className="site-nav-mobile-layer lg:hidden" id="site-mobile-navigation">
          <button className="site-nav-mobile-backdrop" type="button" aria-label="Close navigation" onClick={() => setMobile(false)} />
          <nav className="site-nav-mobile-menu" aria-label="Mobile navigation">
            <div className="site-nav-mobile-head">
              <a href="/#top" className="site-nav-mobile-brand" onClick={(event) => navigate(event, '/#top')}>
                <img src="/assets/logo.png" alt="" />
                <span>Nevian</span>
              </a>
              <button type="button" className="site-nav-mobile-close" aria-label="Close menu" onClick={() => setMobile(false)}>
                <i /><i />
              </button>
            </div>

            <div className="site-nav-mobile-intro">
              <span>Navigation</span>
              <p>Explore the platform and jump directly into the workflow.</p>
            </div>

            <div className="site-nav-mobile-links">
              {navigation.map(({ label, href, key }, navIndex) => {
                if (key !== 'workflow') {
                  return (
                    <a
                      key={label}
                      href={href}
                      onClick={(event) => navigate(event, href)}
                      className={`site-nav-mobile-link ${active === key ? 'is-current' : ''}`}
                      aria-current={active === key ? 'location' : undefined}
                    >
                      <span>{String(navIndex + 1).padStart(2, '0')}</span>
                      <strong>{label}</strong>
                      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10m-4-4 4 4-4 4" /></svg>
                    </a>
                  );
                }

                return (
                  <div key={label} className={`site-nav-mobile-workflow-shell ${workflowOpen ? 'is-open' : ''}`}>
                    <div className="site-nav-mobile-workflow-row">
                      <a
                        href={href}
                        onClick={(event) => navigate(event, href)}
                        className={`site-nav-mobile-link ${active === key ? 'is-current' : ''}`}
                        aria-current={active === key ? 'location' : undefined}
                      >
                        <span>{String(navIndex + 1).padStart(2, '0')}</span>
                        <strong>{label}</strong>
                      </a>
                      <button type="button" aria-label="Toggle workflow steps" aria-expanded={workflowOpen} onClick={() => setWorkflowOpen((value) => !value)}>
                        <svg viewBox="0 0 14 14" aria-hidden="true"><path d="m3 5 4 4 4-4" /></svg>
                      </button>
                    </div>

                    <div className="site-nav-mobile-workflow" aria-label="Workflow steps">
                      {workflowSteps.map((step, index) => (
                        <a
                          key={step.slug}
                          href={`/#workflow-${step.slug}`}
                          onClick={(event) => navigateWorkflowStep(event, step, index)}
                          className={active === 'workflow' && activeWorkflowStep === index ? 'is-active' : ''}
                        >
                          <span>{String(index + 1).padStart(2, '0')}</span>
                          <strong>{step.label}</strong>
                          <i />
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="site-nav-mobile-footer">
              <a href="/contact.html" onClick={() => setMobile(false)} className="site-nav-mobile-cta">
                <span>Book a demo</span>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10m-4-4 4 4-4 4" /></svg>
              </a>
              <small>Nevian handles routine support work and keeps your team informed.</small>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
