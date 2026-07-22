import { useEffect, useRef } from 'react';
import { IconArrow, IconShield } from './Icons.jsx';

const platformCards = [
  {
    key: 'overview',
    title: 'Platform overview',
    description: 'See how Nevian connects context, policy, and action.',
    href: '/#features',
  },
  {
    key: 'workflow',
    title: 'Workflow',
    description: 'Follow a request from report through resolution.',
    href: '/#how',
  },
  {
    key: 'security',
    title: 'Security',
    description: 'Review verification, approval, and audit controls.',
    href: '/#password-reset',
  },
  {
    key: 'integrations',
    title: 'Integrations',
    description: 'Connect the tools your IT team already uses.',
    href: '/#integrations',
  },
];

function CardPreview({ kind }) {
  if (kind === 'overview') {
    return (
      <div className="site-platform-preview site-platform-preview-overview" aria-hidden="true">
        <div className="site-platform-query"><i /> Request + device context</div>
        <div className="site-platform-context"><span /><span /><span /></div>
      </div>
    );
  }

  if (kind === 'workflow') {
    return (
      <div className="site-platform-preview site-platform-preview-workflow" aria-hidden="true">
        <i /><span>Report</span><i /><span>Context</span><i /><span>Resolve</span>
      </div>
    );
  }

  if (kind === 'security') {
    return (
      <div className="site-platform-preview site-platform-preview-security" aria-hidden="true">
        <span><IconShield /></span>
      </div>
    );
  }

  return (
    <div className="site-platform-preview site-platform-preview-integrations" aria-hidden="true">
      <img src="/assets/integrations/servicenow.svg" alt="" />
      <img src="/assets/integrations/azure-2.svg" alt="" />
      <img src="/assets/integrations/powershell.svg" alt="" />
      <img src="/assets/integrations/jira.svg" alt="" />
    </div>
  );
}


export default function PlatformMenu({ active, open, onOpenChange, onNavigate }) {
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) onOpenChange(false);
    };
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return;
      onOpenChange(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('pointerdown', closeOutside);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [open, onOpenChange]);

  const focusFirstCard = () => {
    onOpenChange(true);
    window.requestAnimationFrame(() => rootRef.current?.querySelector('.site-platform-card')?.focus());
  };

  return (
    <div
      ref={rootRef}
      className={`site-nav-platform ${open ? 'is-open' : ''}`}
      onMouseEnter={() => onOpenChange(true)}
      onMouseLeave={() => onOpenChange(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onOpenChange(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`site-nav-link site-nav-platform-trigger ${active ? 'is-current' : ''}`}
        aria-expanded={open}
        aria-controls="site-platform-panel"
        onClick={() => onOpenChange(!open)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            focusFirstCard();
          }
        }}
      >
        Platform
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 4.5 3 3 3-3" /></svg>
      </button>

      <div
        className="site-platform-panel site-nav-dropdown"
        id="site-platform-panel"
        aria-hidden={!open}
      >
        <div className="site-platform-heading">
          <div>
            <h2>Explore the Nevian platform</h2>
            <p>Move from request to safe action without changing how your team works.</p>
          </div>
          <a href="/#features" tabIndex={open ? 0 : -1} onClick={(event) => onNavigate(event, '/#features')}>
            View platform <IconArrow />
          </a>
        </div>

        <nav className="site-platform-grid" aria-label="Platform navigation">
          {platformCards.map((card) => (
            <a
              className={`site-platform-card site-platform-card-${card.key}`}
              href={card.href}
              key={card.key}
              tabIndex={open ? 0 : -1}
              onClick={(event) => onNavigate(event, card.href)}
            >
              <CardPreview kind={card.key} />
              <div className="site-platform-card-copy">
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
                <IconArrow aria-hidden="true" />
              </div>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}