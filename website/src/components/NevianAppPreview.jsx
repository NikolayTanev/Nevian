import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AppWindow,
  ArrowRight,
  ArrowUp,
  Cable,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Ellipsis,
  Globe,
  Headphones,
  House,
  KeyRound,
  Keyboard,
  Laptop,
  LayoutGrid,
  Monitor,
  Paperclip,
  Plus,
  Search,
  ShoppingCart,
  Smartphone,
  Star,
  Ticket,
} from 'lucide-react';
import '../app-preview.css';

const people = {
  linda: { name: 'Linda Mogridge', img: '/assets/female.jpg' },
  alex: { name: 'Alex Rivera', img: '/assets/male.jpg' },
  priya: { name: 'Priya Raman', initials: 'PR' },
  nevian: { name: 'Nevian', logo: true },
};

const statusMeta = {
  todo: { label: 'Todo', color: '#8a8f98' },
  progress: { label: 'In progress', color: '#e2b340' },
  approval: { label: 'Needs approval', color: '#8b93ff' },
  escalated: { label: 'Escalated', color: '#e8875b' },
  resolved: { label: 'Resolved', color: '#4cb782' },
};

const priorityLabels = ['No priority', 'Low', 'Medium', 'High'];

const device = { name: 'NEV-LT-042', os: 'Windows 11 23H2' };
const calmHealth = { cpu: 12, mem: 48, disk: 62 };

const initialTickets = [
  {
    id: 'NEV-0034',
    title: 'My laptop is slow',
    status: 'progress',
    priority: 2,
    assignee: 'nevian',
    updated: '4m ago',
    created: 'Today, 09:12',
    channel: 'Chat',
    labels: [['Performance', '#e2b340'], ['Windows', '#6e9bff']],
    health: { cpu: 38, mem: 71, disk: 96 },
    description: 'Everything takes ages to open since this morning. Teams freezes when I share my screen.',
    activity: [
      { type: 'event', who: 'linda', text: 'opened the ticket from chat', time: '6m ago' },
      { type: 'event', who: 'nevian', text: 'attached device context from NEV-LT-042', time: '6m ago' },
      {
        type: 'agent',
        duration: 'Worked for 14 sec',
        summary: 'Disk is at 96% and 14 apps launch at startup. I cleared temporary files and turned off startup apps that are not on your required list. A restart is scheduled for 12:30.',
        actions: ['Cleared 8.2 GB of temporary files', 'Disabled 6 startup apps', 'Restart scheduled for 12:30'],
        footer: 'policy endpoint-cleanup · auto-approved · 3 audit entries',
      },
      { type: 'comment', who: 'linda', text: '12:30 works for me. Thanks!', time: '2m ago' },
      { type: 'event', who: 'nevian', text: 'moved the ticket from Todo to In progress', time: 'just now' },
    ],
  },
  {
    id: 'NEV-0033',
    title: 'Need a new keyboard',
    status: 'approval',
    priority: 1,
    assignee: 'nevian',
    updated: '26m ago',
    created: 'Today, 08:51',
    channel: 'Catalog',
    labels: [['Hardware', '#8a8f98']],
    description: 'The space bar on my keyboard stopped working.',
    activity: [
      { type: 'event', who: 'linda', text: 'requested Keyboard and mouse from the catalog', time: '26m ago' },
      {
        type: 'agent',
        duration: 'Worked for 3 sec',
        summary: 'Matched the request to the standard wireless set. Hardware above the self-service limit needs a manager, so I sent it to Priya Raman.',
        actions: ['Catalog item matched: Keyboard and mouse', 'Approval requested from Priya Raman'],
        footer: 'policy hardware-request · waiting on approval',
      },
    ],
  },
  {
    id: 'NEV-0029',
    title: 'Access to Salesforce',
    status: 'approval',
    priority: 2,
    assignee: 'nevian',
    updated: '2h ago',
    created: 'Today, 06:40',
    channel: 'Chat',
    labels: [['Access', '#8b93ff']],
    description: 'I moved to the sales team and need Salesforce to update my accounts.',
    activity: [
      { type: 'event', who: 'linda', text: 'opened the ticket from chat', time: '2h ago' },
      {
        type: 'agent',
        duration: 'Worked for 6 sec',
        summary: 'Your new role is in the Sales group, which maps to a Sales Cloud seat. 3 licenses are free. I will assign one as soon as your manager approves.',
        actions: ['Group membership checked: Sales', 'License pool checked: 3 of 40 free', 'Approval requested from Priya Raman'],
        footer: 'policy app-access · manager approval',
      },
    ],
  },
  {
    id: 'NEV-0027',
    title: 'VPN keeps disconnecting',
    status: 'escalated',
    priority: 3,
    assignee: 'alex',
    updated: 'Yesterday',
    created: 'Oct 21, 16:05',
    channel: 'Chat',
    labels: [['Network', '#e8875b']],
    description: 'The VPN drops every few minutes when I work from home.',
    activity: [
      { type: 'event', who: 'linda', text: 'opened the ticket from chat', time: 'Yesterday' },
      {
        type: 'agent',
        duration: 'Worked for 22 sec',
        summary: 'Collected adapter and VPN client logs. The device certificate failed validation 11 times today, which needs an engineer. Handed off to Alex Rivera with everything attached.',
        actions: ['Network and VPN logs collected', 'Certificate validation errors found', 'Escalated to Alex Rivera'],
        footer: 'handoff · logs and device context attached',
      },
      { type: 'comment', who: 'alex', text: 'Thanks. The device certificate expired on this laptop. I pushed a renewed one, so you should stay connected after the next reconnect.', time: 'Yesterday' },
    ],
  },
  {
    id: 'NEV-0031',
    title: 'Reset my password',
    status: 'resolved',
    priority: 3,
    assignee: 'nevian',
    updated: '1h ago',
    created: 'Today, 07:58',
    channel: 'Chat',
    labels: [['Identity', '#8b93ff']],
    description: 'I forgot my password and I am locked out of Outlook.',
    activity: [
      { type: 'event', who: 'linda', text: 'opened the ticket from chat', time: '1h ago' },
      {
        type: 'agent',
        duration: 'Worked for 48 sec',
        summary: 'Verified Linda with an authenticator push, reset the password in Entra ID, and signed out old sessions. A new password is required at the next sign-in.',
        actions: ['Identity verified with authenticator push', 'Password reset in Entra ID', 'Signed out sessions on 2 devices'],
        footer: 'policy password-reset · mfa required · 4 audit entries',
      },
      { type: 'event', who: 'nevian', text: 'resolved the ticket', time: '1h ago' },
    ],
  },
  {
    id: 'NEV-0016',
    title: 'Hardware order: USB-C cable 1 m',
    status: 'resolved',
    priority: 1,
    assignee: 'nevian',
    updated: 'Oct 17',
    created: 'Oct 16, 10:20',
    channel: 'Catalog',
    labels: [['Hardware', '#8a8f98']],
    description: 'Ordered from the catalog.',
    activity: [
      { type: 'event', who: 'linda', text: 'requested USB-C cable from the catalog', time: 'Oct 16' },
      {
        type: 'agent',
        duration: 'Worked for 2 sec',
        summary: 'In stock and under the approval limit, so I placed the order right away. Pickup is at the Berlin office front desk.',
        actions: ['Stock checked: 42 available', 'Order placed'],
        footer: 'policy hardware-request · auto-approved',
      },
      { type: 'event', who: 'nevian', text: 'resolved the ticket', time: 'Oct 17' },
    ],
  },
];

const categories = [
  { id: 'all', label: 'All items', icon: LayoutGrid },
  { id: 'laptops', label: 'Laptops', icon: Laptop },
  { id: 'monitors', label: 'Monitors', icon: Monitor },
  { id: 'accessories', label: 'Accessories', icon: Keyboard },
  { id: 'mobile', label: 'Mobile', icon: Smartphone },
  { id: 'software', label: 'Software', icon: AppWindow },
  { id: 'access', label: 'Access', icon: KeyRound },
];

const kindByCategory = {
  laptops: 'Hardware',
  monitors: 'Hardware',
  accessories: 'Hardware',
  mobile: 'Hardware',
  software: 'Software',
  access: 'Access',
};

const catalogItems = [
  { id: 'laptop-14', name: 'Notebook 14"', category: 'laptops', icon: Laptop, description: 'Business laptop for office work, enrolled automatically.' },
  { id: 'monitor-27', name: 'Monitor 27"', category: 'monitors', icon: Monitor, description: 'QHD, height adjustable. Up to two per workplace.' },
  { id: 'phone', name: 'Mobile phone', category: 'mobile', icon: Smartphone, description: 'Company phone with a business plan, managed remotely.', approval: true },
  { id: 'dock', name: 'Docking station', category: 'accessories', icon: Cable, description: 'USB-C dock with two display outputs and network.' },
  { id: 'headset', name: 'Headset', category: 'accessories', icon: Headphones, description: 'Wired USB headset, certified for Teams.' },
  { id: 'keyboard', name: 'Keyboard and mouse', category: 'accessories', icon: Keyboard, description: 'Wireless set, US or German layout.' },
  { id: 'adobe', name: 'Adobe Creative Cloud', category: 'software', icon: AppWindow, description: 'Named license, assigned to your account.', approval: true },
  { id: 'salesforce', name: 'Salesforce access', category: 'access', icon: Globe, description: 'Sales Cloud seat. Your manager approves.', approval: true },
];

const suggestions = [
  { label: 'My laptop is slow', ticket: 'NEV-0034' },
  { label: 'I need access to Salesforce', ticket: 'NEV-0029' },
  { label: "VPN isn't working", ticket: 'NEV-0027' },
  { label: 'Request a monitor', category: 'monitors' },
];

function StatusIcon({ status }) {
  const { color } = statusMeta[status];

  if (status === 'todo') {
    return (
      <svg className="nva-status" viewBox="0 0 14 14" aria-hidden="true">
        <circle cx="7" cy="7" r="5.5" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2.2 1.9" />
      </svg>
    );
  }

  if (status === 'resolved') {
    return (
      <svg className="nva-status" viewBox="0 0 14 14" aria-hidden="true">
        <circle cx="7" cy="7" r="6.25" fill={color} />
        <path d="M4.4 7.2 6.2 9l3.4-3.6" fill="none" stroke="#111214" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  const fraction = { progress: 0.5, approval: 0.75, escalated: 0.25 }[status];
  const angle = fraction * Math.PI * 2;
  const endX = 7 + 3 * Math.sin(angle);
  const endY = 7 - 3 * Math.cos(angle);
  const largeArc = fraction > 0.5 ? 1 : 0;

  return (
    <svg className="nva-status" viewBox="0 0 14 14" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" fill="none" stroke={color} strokeWidth="1.5" />
      <path d={`M7 7 L7 4 A3 3 0 ${largeArc} 1 ${endX.toFixed(2)} ${endY.toFixed(2)} Z`} fill={color} />
    </svg>
  );
}

function PriorityIcon({ level }) {
  return (
    <svg className="nva-priority" viewBox="0 0 14 14" aria-hidden="true">
      {[0, 1, 2].map((bar) => (
        <rect key={bar} x={1.5 + bar * 4.25} y={9 - bar * 3} width="2.75" height={3.5 + bar * 3} rx="0.8" fill="currentColor" opacity={bar < level ? 1 : 0.28} />
      ))}
    </svg>
  );
}

function Avatar({ who, size = 18 }) {
  const person = people[who];
  const style = { width: size, height: size };

  if (person.logo) {
    return <span className="nva-avatar is-nevian" style={style}><img src="/assets/logo.png" alt="" /></span>;
  }
  if (person.img) {
    return <span className="nva-avatar" style={style}><img src={person.img} alt="" /></span>;
  }
  return <span className="nva-avatar is-initials" style={style}>{person.initials}</span>;
}

function ticketKind(item) {
  const kind = kindByCategory[item.category];
  if (kind === 'Software') return `Software request: ${item.name}`;
  if (kind === 'Access') return `Access request: ${item.name}`;
  return `Hardware order: ${item.name}`;
}

function Sidebar({ view, onNavigate, openCount, tickets, selectedId, onOpenTicket }) {
  const items = [
    { id: 'home', label: 'Home', icon: House },
    { id: 'catalog', label: 'Catalog', icon: LayoutGrid },
    { id: 'tickets', label: 'Tickets', icon: Ticket, count: openCount },
  ];

  return (
    <aside className="nva-side">
      <div className="nva-side-top">
        <button type="button" className="nva-workspace">
          <img src="/assets/logo.png" alt="" />
          Nevian
          <ChevronDown aria-hidden="true" />
        </button>
        <div className="nva-side-actions">
          <button type="button" className="nva-icon-btn" aria-label="Search"><Search aria-hidden="true" /></button>
        </div>
      </div>

      <nav className="nva-nav" aria-label="Workspace">
        {items.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            type="button"
            className={`nva-nav-item${view === id ? ' is-active' : ''}`}
            aria-current={view === id ? 'page' : undefined}
            onClick={() => onNavigate(id)}
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
            {count ? <em className="nva-nav-count">{count}</em> : null}
          </button>
        ))}
      </nav>

      <div className="nva-side-tickets">
        <span className="nva-side-label">Your tickets</span>
        <div className="nva-side-ticket-list">
          {tickets.map((ticket) => {
            const active = view === 'tickets' && ticket.id === selectedId;
            return (
              <button
                key={ticket.id}
                type="button"
                className={`nva-side-ticket${active ? ' is-active' : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={() => onOpenTicket(ticket.id)}
              >
                <StatusIcon status={ticket.status} />
                <span>{ticket.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="nva-side-user">
        <Avatar who="linda" size={26} />
        <span>
          <b>Linda Mogridge</b>
          <small>linda.mogridge@acme.com</small>
        </span>
      </div>
    </aside>
  );
}

function HomeView({ tickets, onOpenTicket, onOpenCatalog }) {
  const preview = catalogItems.slice(0, 6);

  const pick = (suggestion) => {
    if (suggestion.ticket) onOpenTicket(suggestion.ticket);
    else onOpenCatalog(suggestion.category);
  };

  return (
    <>
      <header className="nva-bar">
        <House aria-hidden="true" />
        <span>Home</span>
      </header>
      <div className="nva-scroll is-locked">
        <div className="nva-home">
          <div className="nva-home-hero">
            <h2>How can we help, Linda?</h2>
            <p>Describe the problem or ask for something. Nevian resolves what it can and opens a ticket when a person is needed.</p>
            <div className="nva-composer" aria-hidden="true">
              <span className="nva-round"><Plus /></span>
              <span className="nva-composer-placeholder">Ask anything</span>
              <span className="nva-round is-send"><ArrowUp /></span>
            </div>
            <div className="nva-chips">
              {suggestions.map((suggestion) => (
                <button key={suggestion.label} type="button" className="nva-chip" onClick={() => pick(suggestion)}>{suggestion.label}</button>
              ))}
            </div>
          </div>

          <div className="nva-home-grid">
            <section className="nva-card">
              <header className="nva-card-head">
                <Ticket aria-hidden="true" />
                <b>Your tickets</b>
                <button type="button" className="nva-link" onClick={() => onOpenTicket(tickets[0]?.id)}>View all <ArrowRight aria-hidden="true" /></button>
              </header>
              <div>
                {tickets.slice(0, 6).map((ticket) => (
                  <button key={ticket.id} type="button" className="nva-row" onClick={() => onOpenTicket(ticket.id)}>
                    <span className="nva-id">{ticket.id}</span>
                    <StatusIcon status={ticket.status} />
                    <span className="nva-row-title">{ticket.title}</span>
                    <time>{ticket.updated}</time>
                  </button>
                ))}
              </div>
            </section>

            <section className="nva-card">
              <header className="nva-card-head">
                <LayoutGrid aria-hidden="true" />
                <b>Catalog</b>
                <button type="button" className="nva-link" onClick={() => onOpenCatalog('all')}>Browse all <ArrowRight aria-hidden="true" /></button>
              </header>
              <div>
                {preview.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button key={item.id} type="button" className="nva-item-row" onClick={() => onOpenCatalog(item.category)}>
                      <span className="nva-tile"><Icon aria-hidden="true" /></span>
                      <span>
                        <b>{item.name}</b>
                        <small>{item.description}</small>
                      </span>
                      <ChevronRight aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

function CatalogView({ category, onCategory, requested, cart, onToggleCart, onOpenTicket, onCheckout }) {
  const [query, setQuery] = useState('');

  const counts = useMemo(() => {
    const result = { all: catalogItems.length };
    catalogItems.forEach((item) => { result[item.category] = (result[item.category] || 0) + 1; });
    return result;
  }, []);

  const needle = query.trim().toLowerCase();
  const items = catalogItems.filter((item) => (
    (category === 'all' || item.category === category)
    && (!needle || `${item.name} ${item.description}`.toLowerCase().includes(needle))
  ));
  const activeCategory = categories.find((entry) => entry.id === category);

  return (
    <>
      <header className="nva-bar">
        <LayoutGrid aria-hidden="true" />
        <span>Catalog</span>
        <ChevronRight className="nva-bar-sep" aria-hidden="true" />
        <span className="nva-bar-muted">{activeCategory.label}</span>
      </header>
      <div className="nva-scroll is-fit">
        <div className="nva-catalog-head">
          <div>
            <h2>Software and hardware</h2>
            <p>Request equipment, software, or access. Nevian checks stock and policy, then routes approvals for you.</p>
          </div>
          <button type="button" className={`nva-btn nva-cart-btn${cart.length ? ' has-items' : ''}`} onClick={onCheckout} disabled={!cart.length}>
            <ShoppingCart aria-hidden="true" />
            {cart.length ? 'Request items' : 'Cart is empty'}
            {cart.length ? <em>{cart.length}</em> : null}
          </button>
        </div>

        <div className="nva-catalog-body">
          <nav className="nva-cats" aria-label="Categories">
            <span className="nva-cats-label">Categories</span>
            {categories.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                className={`nva-cat${category === id ? ' is-active' : ''}`}
                aria-pressed={category === id}
                onClick={() => onCategory(id)}
              >
                <Icon aria-hidden="true" />
                <span>{label}</span>
                <em>{counts[id] || 0}</em>
              </button>
            ))}
          </nav>

          <div className="nva-catalog-main">
            <label className="nva-search">
              <Search aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search hardware, software, or access" />
            </label>

            <div className="nva-catalog-meta">
              <b>{activeCategory.label}</b>
              <span>{items.length} {items.length === 1 ? 'item' : 'items'}</span>
            </div>

            {items.length ? (
              <div className="nva-grid">
                {items.map((item) => {
                  const Icon = item.icon;
                  const ticketId = requested[item.id];
                  const inCart = cart.includes(item.id);
                  return (
                    <article key={item.id} className={`nva-product${inCart ? ' is-in-cart' : ''}`}>
                      <div className="nva-product-top">
                        <span className="nva-tile"><Icon aria-hidden="true" /></span>
                        <span className={`nva-stock${item.approval ? ' is-approval' : ''}`}>
                          {item.approval ? 'Approval' : 'In stock'}
                        </span>
                      </div>
                      <h3>{item.name}</h3>
                      <small>{kindByCategory[item.category]} · {categories.find((entry) => entry.id === item.category).label}</small>
                      <p>{item.description}</p>
                      <footer>
                        {ticketId ? (
                          <button type="button" className="nva-btn nva-cart-toggle is-done" onClick={() => onOpenTicket(ticketId)}>
                            <Check aria-hidden="true" /> Requested · {ticketId}
                          </button>
                        ) : (
                          <button type="button" className={`nva-btn nva-cart-toggle${inCart ? ' is-added' : ''}`} aria-pressed={inCart} onClick={() => onToggleCart(item.id)}>
                            {inCart ? <><Check aria-hidden="true" /> In cart</> : <><ShoppingCart aria-hidden="true" /> Add to cart</>}
                          </button>
                        )}
                      </footer>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="nva-empty">Nothing matches. Try another search or ask on Home.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function ActivityEntry({ entry }) {
  if (entry.type === 'event') {
    return (
      <div className="nva-event">
        <Avatar who={entry.who} size={16} />
        <span><b>{people[entry.who].name}</b> {entry.text}</span>
        <time>· {entry.time}</time>
      </div>
    );
  }

  if (entry.type === 'comment') {
    return (
      <div className="nva-comment">
        <header>
          <Avatar who={entry.who} size={18} />
          <b>{people[entry.who].name}</b>
          <time>{entry.time}</time>
        </header>
        <p>{entry.text}</p>
      </div>
    );
  }

  return (
    <div className="nva-comment nva-agent">
      <header>
        <Avatar who="nevian" size={18} />
        <b>Nevian</b>
        <span className="nva-tag">AI agent</span>
        <span className="nva-agent-meta">{entry.duration} <ChevronRight aria-hidden="true" /></span>
      </header>
      <p>{entry.summary}</p>
      {entry.actions?.length ? (
        <div className="nva-actions">
          <div className="nva-actions-head">
            <b>Actions</b>
            <span>{entry.actions.length} completed</span>
          </div>
          <ul>
            {entry.actions.map((action) => (
              <li key={action}><Check aria-hidden="true" /> {action}</li>
            ))}
          </ul>
          {entry.footer ? <code>{entry.footer}</code> : null}
        </div>
      ) : null}
    </div>
  );
}

function HealthBar({ label, value }) {
  return (
    <div className={`nva-health${value >= 90 ? ' is-warn' : ''}`}>
      <span>{label}</span>
      <i><b style={{ width: `${value}%` }} /></i>
      <em>{value}%</em>
    </div>
  );
}

function TicketsView({ tickets: ordered, selectedId, onSelect, starred, onToggleStar }) {
  const scrollRef = useRef(null);

  const index = Math.max(0, ordered.findIndex((ticket) => ticket.id === selectedId));
  const ticket = ordered[index];
  const health = ticket.health || calmHealth;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [ticket.id]);

  const step = (direction) => {
    const next = ordered[(index + direction + ordered.length) % ordered.length];
    onSelect(next.id);
  };

  return (
    <div className="nva-tickets">
      <section className="nva-detail" aria-label="Ticket detail">
        <header className="nva-bar">
          <StatusIcon status={ticket.status} />
          <span className="nva-bar-muted">{ticket.id}</span>
          <span className="nva-bar-title">{ticket.title}</span>
          <button type="button" className={`nva-icon-btn nva-star${starred[ticket.id] ? ' is-on' : ''}`} aria-label="Star ticket" aria-pressed={Boolean(starred[ticket.id])} onClick={() => onToggleStar(ticket.id)}>
            <Star aria-hidden="true" />
          </button>
          <button type="button" className="nva-icon-btn" aria-label="More actions"><Ellipsis aria-hidden="true" /></button>
          <div className="nva-bar-right">
            <span>{index + 1} / {ordered.length}</span>
            <button type="button" className="nva-icon-btn" aria-label="Previous ticket" onClick={() => step(-1)}><ChevronUp aria-hidden="true" /></button>
            <button type="button" className="nva-icon-btn" aria-label="Next ticket" onClick={() => step(1)}><ChevronDown aria-hidden="true" /></button>
          </div>
        </header>

        <div ref={scrollRef} className="nva-scroll">
          <div className="nva-detail-body">
            <h1>{ticket.title}</h1>
            <p className="nva-desc">{ticket.description}</p>

            <h4 className="nva-section-title">Activity</h4>
            <div className="nva-activity">
              {ticket.activity.map((entry, entryIndex) => (
                <ActivityEntry key={`${ticket.id}-${entryIndex}`} entry={entry} />
              ))}
            </div>
          </div>
        </div>

        <div className="nva-reply" aria-hidden="true">
          <span className="nva-composer-placeholder">Reply to Nevian...</span>
          <span className="nva-icon-btn"><Paperclip /></span>
          <span className="nva-round is-send"><ArrowUp /></span>
        </div>
      </section>

      <aside className="nva-props" aria-label="Ticket properties">
        <h4>Properties</h4>
        <dl>
          <div className="nva-prop"><dt>Status</dt><dd><StatusIcon status={ticket.status} /> {statusMeta[ticket.status].label}</dd></div>
          <div className="nva-prop"><dt>Priority</dt><dd><PriorityIcon level={ticket.priority} /> {priorityLabels[ticket.priority]}</dd></div>
          <div className="nva-prop"><dt>Assignee</dt><dd><Avatar who={ticket.assignee} size={16} /> {people[ticket.assignee].name}</dd></div>
          <div className="nva-prop"><dt>Requester</dt><dd><Avatar who="linda" size={16} /> Linda Mogridge</dd></div>
          <div className="nva-prop"><dt>Channel</dt><dd>{ticket.channel}</dd></div>
          <div className="nva-prop"><dt>Created</dt><dd>{ticket.created}</dd></div>
        </dl>

        {ticket.labels.length ? (
          <>
            <hr />
            <h4>Labels</h4>
            <div className="nva-labels">
              {ticket.labels.map(([label, color]) => (
                <span key={label} className="nva-label"><i style={{ background: color }} aria-hidden="true" /> {label}</span>
              ))}
            </div>
          </>
        ) : null}

        <hr />
        <h4>Device</h4>
        <div className="nva-device">
          <div className="nva-device-head">
            <span className="nva-tile"><Laptop aria-hidden="true" /></span>
            <span><b>{device.name}</b><small>{device.os}</small></span>
          </div>
          <HealthBar label="CPU" value={health.cpu} />
          <HealthBar label="Memory" value={health.mem} />
          <HealthBar label="Disk" value={health.disk} />
        </div>
      </aside>
    </div>
  );
}

export default function NevianAppPreview() {
  const [view, setView] = useState('home');
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedId, setSelectedId] = useState('NEV-0034');
  const [category, setCategory] = useState('all');
  const [requested, setRequested] = useState({ keyboard: 'NEV-0033' });
  const [starred, setStarred] = useState({});
  const [cart, setCart] = useState([]);
  const nextNumber = useRef(35);

  const ordered = useMemo(() => [
    ...tickets.filter((ticket) => ticket.status !== 'resolved'),
    ...tickets.filter((ticket) => ticket.status === 'resolved'),
  ], [tickets]);
  const openCount = tickets.filter((ticket) => ticket.status !== 'resolved').length;

  const openTicket = (id) => {
    if (id) setSelectedId(id);
    setView('tickets');
  };

  const openCatalog = (nextCategory) => {
    setCategory(nextCategory);
    setView('catalog');
  };

  const createTicket = (fields) => {
    const id = `NEV-${String(nextNumber.current).padStart(4, '0')}`;
    nextNumber.current += 1;
    setTickets((current) => [{
      id,
      priority: 2,
      assignee: 'nevian',
      updated: 'just now',
      created: 'Today, just now',
      labels: [],
      ...fields,
    }, ...current]);
    return id;
  };

  const toggleCart = (itemId) => {
    setCart((current) => (current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId]));
  };

  const checkout = () => {
    const items = catalogItems.filter((item) => cart.includes(item.id));
    if (!items.length) return;

    const needsApproval = items.filter((item) => item.approval);
    const names = items.map((item) => item.name);
    const title = items.length === 1 ? ticketKind(items[0]) : `Order: ${names.join(', ')}`;
    const actions = [`${items.length} catalog ${items.length === 1 ? 'item' : 'items'} matched`];
    if (items.length > needsApproval.length) actions.push(`Ordered: ${items.filter((item) => !item.approval).map((item) => item.name).join(', ')}`);
    if (needsApproval.length) actions.push(`Approval requested from Priya Raman for ${needsApproval.map((item) => item.name).join(', ')}`);

    const id = createTicket({
      title,
      status: needsApproval.length ? 'approval' : 'progress',
      priority: 1,
      channel: 'Catalog',
      labels: [...new Set(items.map((item) => kindByCategory[item.category]))].map((kind) => [kind, '#8a8f98']),
      description: `Requested from the catalog: ${names.join(', ')}.`,
      activity: [
        { type: 'event', who: 'linda', text: `requested ${items.length === 1 ? names[0] : `${items.length} items`} from the catalog`, time: 'just now' },
        {
          type: 'agent',
          duration: 'Worked for 2 sec',
          summary: needsApproval.length
            ? 'Items within your self-service limit are ordered. The rest need your manager, so I sent them to Priya Raman. You will get a message once they are approved.'
            : 'Everything is in stock and within your self-service limit, so I placed the order. You will get a message when it is ready.',
          actions,
          footer: needsApproval.length ? 'policy catalog-request · waiting on approval' : 'policy catalog-request · auto-approved',
        },
      ],
    });

    setRequested((current) => ({ ...current, ...Object.fromEntries(items.map((item) => [item.id, id])) }));
    setCart([]);
    openTicket(id);
  };

  return (
    <div className="nva" data-view={view}>
      <Sidebar
        view={view}
        onNavigate={setView}
        openCount={openCount}
        tickets={ordered}
        selectedId={selectedId}
        onOpenTicket={openTicket}
      />
      <main className="nva-panel">
        {view === 'home' && (
          <HomeView
            tickets={ordered}
            onOpenTicket={openTicket}
            onOpenCatalog={openCatalog}
          />
        )}
        {view === 'catalog' && (
          <CatalogView
            category={category}
            onCategory={setCategory}
            requested={requested}
            cart={cart}
            onToggleCart={toggleCart}
            onOpenTicket={openTicket}
            onCheckout={checkout}
          />
        )}
        {view === 'tickets' && (
          <TicketsView
            tickets={ordered}
            selectedId={selectedId}
            onSelect={setSelectedId}
            starred={starred}
            onToggleStar={(id) => setStarred((current) => ({ ...current, [id]: !current[id] }))}
          />
        )}
      </main>
    </div>
  );
}
