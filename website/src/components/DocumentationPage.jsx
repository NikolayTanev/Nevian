import { useEffect, useRef, useState } from 'react';
import ScratchNav from './ScratchNav.jsx';
import {
  IconArrow,
  IconBolt,
  IconCheck,
  IconChevron,
  IconClose,
  IconDevice,
  IconMenu,
  IconShield,
} from './Icons.jsx';

const sidebarGroups = [
  {
    label: 'Get started',
    items: [
      { label: 'Introduction', href: '#overview' },
      { label: 'Onboard your first device', href: '#overview', current: true },
      { label: 'Deployment checklist', href: '#requirements' },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'Devices', href: '#verify-device' },
      { label: 'Agent architecture', href: '#next-steps' },
      { label: 'Automations', href: '#next-steps', nested: true },
      { label: 'Identity & access', href: '#create-token' },
      { label: 'Audit trail', href: '#verify-device' },
    ],
  },
  {
    label: 'API & integrations',
    items: [
      { label: 'API overview', href: '#create-token' },
      { label: 'Authentication', href: '#create-token' },
      { label: 'Webhooks', href: '#next-steps', nested: true },
      { label: 'Rate limits', href: '#next-steps' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { label: 'Troubleshooting', href: '#troubleshooting' },
      { label: 'Security', href: '#security' },
      { label: 'Agent releases', href: '#next-steps' },
    ],
  },
];

const tableOfContents = [
  { id: 'overview', label: 'Overview' },
  { id: 'requirements', label: 'Before you begin' },
  { id: 'create-token', label: 'Create an enrollment token' },
  { id: 'install-agent', label: 'Install the Desk Agent' },
  { id: 'verify-device', label: 'Verify the device' },
  { id: 'next-steps', label: 'What happens next' },
];

const tokenRequest = [
  'curl --request POST \\',
  '  --url "$NEVIAN_API_URL/v1/enrollment-tokens" \\',
  '  --header "Authorization: Bearer $NEVIAN_API_KEY" \\',
  '  --header "Content-Type: application/json" \\',
  '  --data \'{"name":"Headquarters devices","expires_in":3600}\'',
].join('\n');

const tokenResponse = `{
  "id": "et_01JNV8J8SF",
  "token": "nvenr_example_replace_me",
  "expires_at": "2026-09-01T15:00:00Z",
  "remaining_uses": 25
}`;

const installCommand = [
  '$token = "nvenr_example_replace_me"',
  '$installer = ".\\NevianAgentSetup.exe"',
  'Start-Process $installer `',
  '  -ArgumentList "/quiet", "/enrollment-token=$token" `',
  '  -Wait',
].join('\n');

const verifyRequest = [
  'curl --request GET \\',
  '  --url "$NEVIAN_API_URL/v1/devices?status=online" \\',
  '  --header "Authorization: Bearer $NEVIAN_API_KEY"',
].join('\n');

const pageMarkdown = `# Onboard your first device

Connect a managed endpoint to your Nevian workspace by creating an enrollment token, installing the Desk Agent, and verifying the device.

## Before you begin
- Workspace permission to manage devices
- Outbound HTTPS access from the device
- The latest signed Desk Agent installer

## Steps
1. Create a short-lived enrollment token.
2. Install the Desk Agent on the target device.
3. Verify that the device reports online.`;

const codeTokenPattern = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|https?:\/\/[^\s"'\\]+|\$[A-Za-z_][\w:.-]*|--[\w-]+|\b(?:curl|POST|GET|Start-Process|true|false|null)\b|\b\d+(?:\.\d+)?\b)/g;

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

function InfoIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
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

function HighlightedCode({ code }) {
  return code.split('\n').map((line, lineIndex) => (
    <span className="docs-code-line" key={`${line}-${lineIndex}`}>
      {line.split(codeTokenPattern).map((token, tokenIndex) => {
        let tokenClass = '';
        if (/^["']/.test(token)) tokenClass = 'is-string';
        else if (/^\$/.test(token)) tokenClass = 'is-variable';
        else if (/^--/.test(token)) tokenClass = 'is-flag';
        else if (/^\d/.test(token)) tokenClass = 'is-number';
        else if (/^(curl|POST|GET|Start-Process|true|false|null)$/.test(token)) tokenClass = 'is-keyword';

        return tokenClass
          ? <span className={tokenClass} key={`${token}-${tokenIndex}`}>{token}</span>
          : token;
      })}
      {lineIndex < code.split('\n').length - 1 ? '\n' : ''}
    </span>
  ));
}

function CodeBlock({ code, language, label }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await copyToClipboard(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="docs-code-block">
      <div className="docs-code-header">
        <div className="docs-code-label">
          <span>{label}</span>
          <small>{language}</small>
        </div>
        <button type="button" onClick={copyCode} aria-label={`Copy ${label} code`}>
          {copied ? <IconCheck aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre tabIndex="0"><code><HighlightedCode code={code} /></code></pre>
    </div>
  );
}

function DocumentationSidebar({ open, onClose, query, onQueryChange, searchRef }) {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredGroups = sidebarGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.label.toLowerCase().includes(normalizedQuery)),
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
              {group.items.map((item) => (
                <a
                  className={`docs-nav-link ${item.current ? 'is-current' : ''}`}
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  key={item.label}
                  onClick={onClose}
                >
                  <span>{item.label}</span>
                  {item.nested ? <IconChevron aria-hidden="true" /> : null}
                </a>
              ))}
            </div>
          </section>
        ))}
        {filteredGroups.length === 0 ? (
          <p className="docs-search-empty">No navigation items match “{query}”.</p>
        ) : null}
      </nav>

      <div className="docs-sidebar-footer">
        <span className="docs-status-dot" aria-hidden="true" />
        <span>All systems operational</span>
      </div>
    </aside>
  );
}

function Requirement({ children }) {
  return (
    <li>
      <span><IconCheck aria-hidden="true" /></span>
      <p>{children}</p>
    </li>
  );
}

export default function DocumentationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [pageCopied, setPageCopied] = useState(false);
  const searchRef = useRef(null);

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
    const sections = tableOfContents
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
  }, []);

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
      await copyToClipboard(pageMarkdown);
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
        <span>Onboard your first device</span>
      </div>

      <div className="docs-shell">
        {sidebarOpen ? (
          <button className="docs-sidebar-scrim" type="button" aria-label="Close documentation navigation" onClick={() => setSidebarOpen(false)} />
        ) : null}

        <DocumentationSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          query={searchQuery}
          onQueryChange={setSearchQuery}
          searchRef={searchRef}
        />

        <article className="docs-article">
          <header className="docs-article-header docs-anchor" id="overview">
            <p className="docs-eyebrow"><span aria-hidden="true" /> Get started</p>
            <div className="docs-title-row">
              <div>
                <h1>Onboard your first device</h1>
                <p>Connect a managed endpoint to your Nevian workspace and confirm that it is ready to receive approved work.</p>
              </div>
              <button className="docs-copy-page" type="button" onClick={copyPage}>
                {pageCopied ? <IconCheck aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
                <span>{pageCopied ? 'Copied' : 'Copy page'}</span>
              </button>
            </div>
          </header>

          <div className="docs-prose">
            <p>
              Every device connects through the <strong>Nevian Desk Agent</strong>, a lightweight service that maintains an outbound-only encrypted channel to your workspace. A typical enrollment takes less than five minutes.
            </p>

            <aside className="docs-callout docs-callout-info">
              <InfoIcon aria-hidden="true" />
              <div>
                <strong>Use a short-lived token for every rollout</strong>
                <p>Enrollment tokens only authorize a device to join your workspace. They do not grant an operator or the agent standing administrative access.</p>
              </div>
            </aside>

            <section className="docs-section docs-anchor" id="requirements">
              <h2><a href="#requirements" aria-label="Link to Before you begin"><LinkIcon aria-hidden="true" /></a>Before you begin</h2>
              <p>Make sure the target device and your Nevian workspace are ready for enrollment.</p>
              <ul className="docs-requirements">
                <Requirement>Permission to create and manage devices in the destination workspace.</Requirement>
                <Requirement>Outbound HTTPS access from the device to your configured Nevian control plane.</Requirement>
                <Requirement>The latest signed Desk Agent installer for the target operating system.</Requirement>
              </ul>
            </section>

            <section className="docs-section docs-anchor" id="create-token">
              <p className="docs-step-label">Step 1</p>
              <h2><a href="#create-token" aria-label="Link to Create an enrollment token"><LinkIcon aria-hidden="true" /></a>Create an enrollment token</h2>
              <p>
                Create a scoped token from <strong>Settings → Devices → Enrollment</strong>, or request one through the API. Keep its lifetime and allowed uses as small as your rollout permits.
              </p>
              <CodeBlock code={tokenRequest} language="bash" label="Request" />
              <p>The response returns the token once. Store it only for the duration of the deployment.</p>
              <CodeBlock code={tokenResponse} language="json" label="Response" />
            </section>

            <section className="docs-section docs-anchor" id="install-agent">
              <p className="docs-step-label">Step 2</p>
              <h2><a href="#install-agent" aria-label="Link to Install the Desk Agent"><LinkIcon aria-hidden="true" /></a>Install the Desk Agent</h2>
              <p>
                Copy the signed installer to the endpoint, open an elevated PowerShell session, and pass the enrollment token to the unattended installer.
              </p>
              <CodeBlock code={installCommand} language="powershell" label="Windows PowerShell" />

              <aside className="docs-callout docs-callout-warning" id="security">
                <IconShield aria-hidden="true" />
                <div>
                  <strong>Treat enrollment tokens like temporary credentials</strong>
                  <p>Do not commit a token to source control, bake it into a reusable image, or paste it into ticket notes. Revoke unused tokens after the rollout.</p>
                </div>
              </aside>
            </section>

            <section className="docs-section docs-anchor" id="verify-device">
              <p className="docs-step-label">Step 3</p>
              <h2><a href="#verify-device" aria-label="Link to Verify the device"><LinkIcon aria-hidden="true" /></a>Verify the device</h2>
              <p>
                The new endpoint appears under <strong>Devices</strong> after its first successful heartbeat. You can also query all online devices through the API.
              </p>
              <CodeBlock code={verifyRequest} language="bash" label="List online devices" />

              <div className="docs-table-wrap">
                <table>
                  <thead>
                    <tr><th>Field</th><th>Expected value</th><th>What it means</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><code>status</code></td><td><span className="docs-online"><i />online</span></td><td>The control channel is active.</td></tr>
                    <tr><td><code>last_seen_at</code></td><td>Within 2 minutes</td><td>Heartbeats are arriving normally.</td></tr>
                    <tr><td><code>agent_version</code></td><td>Latest approved</td><td>The signed build matches policy.</td></tr>
                  </tbody>
                </table>
              </div>

              <aside className="docs-callout docs-callout-neutral" id="troubleshooting">
                <IconBolt aria-hidden="true" />
                <div>
                  <strong>Device not appearing?</strong>
                  <p>Confirm outbound connectivity, check that the token has not expired, and review the local agent service log before enrolling again.</p>
                </div>
              </aside>
            </section>

            <section className="docs-section docs-anchor" id="next-steps">
              <h2><a href="#next-steps" aria-label="Link to What happens next"><LinkIcon aria-hidden="true" /></a>What happens next</h2>
              <p>Once the device is online, Nevian begins collecting the scoped context your policy allows. Choose where to continue.</p>

              <div className="docs-next-grid">
                <a href="#verify-device">
                  <span className="docs-next-icon"><IconDevice aria-hidden="true" /></span>
                  <strong>Understand device context</strong>
                  <p>See what the agent reports and how context stays current.</p>
                  <span className="docs-card-link">Explore devices <IconArrow aria-hidden="true" /></span>
                </a>
                <a href="#create-token">
                  <span className="docs-next-icon"><DocumentIcon aria-hidden="true" /></span>
                  <strong>Authenticate with the API</strong>
                  <p>Create a scoped key and make your first API request.</p>
                  <span className="docs-card-link">View API basics <IconArrow aria-hidden="true" /></span>
                </a>
              </div>
            </section>
          </div>

          <nav className="docs-page-nav" aria-label="Documentation pagination">
            <a href="#overview">
              <span>Previous</span>
              <strong>Introduction</strong>
            </a>
            <a href="#create-token" className="is-next">
              <span>Next</span>
              <strong>API authentication</strong>
            </a>
          </nav>

          <div className="docs-feedback">
            <span>Was this page helpful?</span>
            <div>
              <button type="button" aria-label="This page was helpful">Yes</button>
              <button type="button" aria-label="This page was not helpful">No</button>
            </div>
          </div>
        </article>

        <aside className="docs-toc" aria-label="On this page">
          <p>On this page</p>
          <nav>
            {tableOfContents.map((item) => (
              <a className={activeSection === item.id ? 'is-active' : ''} href={`#${item.id}`} key={item.id}>
                {item.label}
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
