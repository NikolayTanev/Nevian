import { useEffect, useState } from 'react';
import { IconMenu, IconClose } from './Icons.jsx';

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
              <div key={label}>
                <a
                  href={href}
                  onClick={(event) => navigate(event, href)}
                  className={`site-nav-mobile-link ${active === key ? 'is-current' : ''}`}
                  aria-current={active === key ? 'location' : undefined}
                >
                  {label}
                </a>
                {key === 'workflow' && (
                  <div className="site-nav-mobile-workflow" aria-label="Workflow steps">
                    {workflowSteps.map((step, index) => (
                      <a
                        key={step.slug}
                        href={`/#workflow-${step.slug}`}
                        onClick={(event) => navigateWorkflowStep(event, step, index)}
                      >
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        {step.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
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
