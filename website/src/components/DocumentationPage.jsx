import { useEffect, useRef, useState } from 'react';
import ScratchNav from './ScratchNav.jsx';
import {
  IconArrow,
  IconCheck,
  IconChevron,
  IconClose,
  IconMenu,
} from './Icons.jsx';
import {
  docsUrl,
  documentationGroups,
  documentationOrder,
  documentationPages,
} from './documentationContent.jsx';

function CopyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function DocumentIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v5h5M9 13h6M9 17h5" />
    </svg>
  );
}

function LinkIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2" />
    </svg>
  );
}

async function copyToClipboard(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('Copy failed');
}

function resolvePageSlug() {
  const queryPage = new URLSearchParams(window.location.search).get('page');
  if (queryPage && documentationPages[queryPage]) return queryPage;

  const parts = window.location.pathname.split('/').filter(Boolean);
  let candidate = parts.at(-1) || 'introduction';
  if (candidate === 'index.html') candidate = parts.at(-2) || 'introduction';
  if (candidate.endsWith('.html')) candidate = candidate.slice(0, -5);
  if (candidate === 'documentation') candidate = 'introduction';
  return documentationPages[candidate] ? candidate : 'introduction';
}

function DocumentationSidebar({ currentSlug, open, onClose, query, onQueryChange, searchRef }) {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredGroups = documentationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const page = documentationPages[item.slug];
        return `${item.label} ${page?.summary || ''}`.toLowerCase().includes(normalizedQuery);
      }),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside className={`docs-sidebar ${open ? 'is-open' : ''}`} id="documentation-sidebar" aria-label="Documentation navigation">
      <div className="docs-sidebar-heading">
        <span>Documentation</span>
        <button type="button" onClick={onClose} aria-label="Close documentation navigation">
          <IconClose aria-hidden="true" />
        </button>
      </div>

      <label className="docs-search">
        <SearchIcon aria-hidden="true" />
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search documentation..."
          aria-label="Search documentation navigation"
        />
        <kbd>Ctrl K</kbd>
      </label>

      <nav className="docs-sidebar-nav">
        {filteredGroups.map((group) => (
          <section className="docs-nav-group" key={group.label}>
            <h2>{group.label}</h2>
            <div>
              {group.items.map((item) => {
                const current = item.slug === currentSlug;
                return (
                  <a
                    className={`docs-nav-link ${current ? 'is-current' : ''}`}
                    href={docsUrl(item.slug)}
                    aria-current={current ? 'page' : undefined}
                    key={item.slug}
                    onClick={onClose}
                  >
                    <span>{item.label}</span>
                    {item.nested ? <IconChevron aria-hidden="true" /> : null}
                  </a>
                );
              })}
            </div>
          </section>
        ))}
        {filteredGroups.length === 0 ? (
          <p className="docs-search-empty">No documentation pages match “{query}”.</p>
        ) : null}
      </nav>

      <div className="docs-sidebar-footer">
        <span className="docs-status-dot" aria-hidden="true" />
        <span>All systems operational</span>
      </div>
    </aside>
  );
}

export default function DocumentationPage() {
  const currentSlug = resolvePageSlug();
  const page = documentationPages[currentSlug];
  const pageIndex = documentationOrder.findIndex((item) => item.slug === currentSlug);
  const previousPage = pageIndex > 0 ? documentationOrder[pageIndex - 1] : null;
  const nextPage = pageIndex < documentationOrder.length - 1 ? documentationOrder[pageIndex + 1] : null;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState(page.sections[0]?.id || '');
  const [pageCopied, setPageCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const searchRef = useRef(null);
  const proseRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSidebarOpen(true);
        window.setTimeout(() => searchRef.current?.focus(), 0);
      }
      if (event.key === 'Escape') setSidebarOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    document.title = `${page.title} | Nevian Documentation`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', page.summary);
  }, [page]);

  useEffect(() => {
    setActiveSection(page.sections[0]?.id || '');
    const sections = page.sections
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-18% 0px -68% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [page]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 880px)');
    const syncSidebar = (event) => {
      if (!event.matches) setSidebarOpen(false);
    };
    media.addEventListener('change', syncSidebar);
    return () => media.removeEventListener('change', syncSidebar);
  }, []);

  const copyPage = async () => {
    try {
      const body = proseRef.current?.innerText?.trim() || '';
      await copyToClipboard(`# ${page.title}\n\n${page.summary}\n\n${body}`);
      setPageCopied(true);
      window.setTimeout(() => setPageCopied(false), 1800);
    } catch {
      setPageCopied(false);
    }
  };

  return (
    <main className="scratch-page documentation-page">
      <ScratchNav />

      <div className="docs-mobile-toolbar">
        <button
          type="button"
          aria-controls="documentation-sidebar"
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen(true)}
        >
          <IconMenu aria-hidden="true" />
          <span>Sections</span>
        </button>
        <span>{page.title}</span>
      </div>

      <div className="docs-shell">
        {sidebarOpen ? (
          <button className="docs-sidebar-scrim" type="button" aria-label="Close documentation navigation" onClick={() => setSidebarOpen(false)} />
        ) : null}

        <DocumentationSidebar
          currentSlug={currentSlug}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          query={searchQuery}
          onQueryChange={setSearchQuery}
          searchRef={searchRef}
        />

        <article className="docs-article">
          <header className="docs-article-header">
            <p className="docs-eyebrow"><span aria-hidden="true" /> {page.group}</p>
            <div className="docs-title-row">
              <div>
                <h1>{page.title}</h1>
                <p>{page.summary}</p>
              </div>
              <button className="docs-copy-page" type="button" onClick={copyPage}>
                {pageCopied ? <IconCheck aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
                <span>{pageCopied ? 'Copied' : 'Copy page'}</span>
              </button>
            </div>
          </header>

          <div className="docs-prose" ref={proseRef}>
            {page.sections.map((section) => (
              <section className="docs-section docs-anchor" id={section.id} key={section.id}>
                {section.step ? <p className="docs-step-label">{section.step}</p> : null}
                <h2>
                  <a href={`#${section.id}`} aria-label={`Link to ${section.title}`}><LinkIcon aria-hidden="true" /></a>
                  {section.title}
                </h2>
                {section.content}
              </section>
            ))}
          </div>

          <nav className="docs-page-nav" aria-label="Documentation pagination">
            {previousPage ? (
              <a href={docsUrl(previousPage.slug)}>
                <span>Previous</span>
                <strong>{previousPage.label}</strong>
              </a>
            ) : null}
            {nextPage ? (
              <a href={docsUrl(nextPage.slug)} className="is-next">
                <span>Next</span>
                <strong>{nextPage.label}</strong>
              </a>
            ) : null}
          </nav>

          <div className="docs-feedback">
            <span>{feedback ? 'Thanks for the feedback.' : 'Was this page helpful?'}</span>
            <div>
              <button className={feedback === 'yes' ? 'is-selected' : ''} type="button" onClick={() => setFeedback('yes')} aria-pressed={feedback === 'yes'}>Yes</button>
              <button className={feedback === 'no' ? 'is-selected' : ''} type="button" onClick={() => setFeedback('no')} aria-pressed={feedback === 'no'}>No</button>
            </div>
          </div>
        </article>

        <aside className="docs-toc" aria-label="On this page">
          <p>On this page</p>
          <nav>
            {page.sections.map((section) => (
              <a className={activeSection === section.id ? 'is-active' : ''} href={`#${section.id}`} key={section.id}>
                {section.title}
              </a>
            ))}
          </nav>
          <div className="docs-toc-help">
            <DocumentIcon aria-hidden="true" />
            <strong>Need help?</strong>
            <span>Talk to the Nevian team about your deployment.</span>
            <a href="/#contact">Contact support <IconArrow aria-hidden="true" /></a>
          </div>
        </aside>
      </div>
    </main>
  );
}
