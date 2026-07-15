import { useReveal } from '../hooks/useReveal.js';
import { IconChat, IconDevice, IconShield, IconGrid } from './Icons.jsx';

const features = [
  {
    Icon: IconChat,
    title: 'AI Ticketing',
    text: 'Plain-language intake and one-second triage. Nevian classifies, prioritizes, and drafts a first response before a human even opens the ticket.',
  },
  {
    Icon: IconDevice,
    title: 'Endpoint Agent',
    text: 'A light Windows desk agent attaches live device context — OS, disk, network, recent errors — to every ticket automatically.',
  },
  {
    Icon: IconShield,
    title: 'Security & Automation',
    text: 'Outbound-only, signed automation jobs with an audit trail at every step. Powerful actions without opening inbound holes.',
  },
  {
    Icon: IconGrid,
    title: 'Admin Dashboard',
    text: 'One command center for tickets, devices, and automation — with the metrics that tell you where time actually goes.',
  },
];

export default function Features() {
  const [ref, shown] = useReveal();
  return (
    <section id="features" className="py-20">
      <div className="wrap">
        <div ref={ref} className={`max-w-2xl ${shown ? 'animate-fade-up' : 'opacity-0'}`}>
          <span className="eyebrow">One platform</span>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Everything a lean IT team actually needs</h2>
          <p className="mt-3 text-lg text-dim">
            Four pieces that work together out of the box — no sprawling suite, no six-week onboarding.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {features.map(({ Icon, title, text }) => (
            <article key={title} className="card">
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-accent-line bg-accent-soft text-accent-deep">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-1 text-sm text-dim">{text}</p>
            </article>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['70%', 'Less time on repeat tickets'],
            ['1s', 'Average AI triage time'],
            ['24/7', 'Always-on first response'],
            ['100%', 'Audited automation actions'],
          ].map(([num, label]) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="font-display text-4xl font-extrabold text-accent">{num}</div>
              <div className="mt-1.5 text-sm text-muted">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
