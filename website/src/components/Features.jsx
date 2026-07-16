import { useReveal } from '../hooks/useReveal.js';
import { IconChat, IconDevice, IconShield, IconGrid } from './Icons.jsx';

const features = [
  {
    Icon: IconChat,
    title: 'Ticket handling',
    text: 'People write what is wrong in their own words. Nevian reviews the request and prepares a useful first response for the team.',
  },
  {
    Icon: IconDevice,
    title: 'Device details',
    text: 'The Windows agent adds the operating system, storage, network, and recent errors to the ticket automatically.',
  },
  {
    Icon: IconShield,
    title: 'Controlled automation',
    text: 'Approved jobs run through an outbound connection, and every action is recorded for review.',
  },
  {
    Icon: IconGrid,
    title: 'Team view',
    text: 'Tickets, devices, automation, and time spent are available in one place.',
  },
];

export default function Features() {
  const [ref, shown] = useReveal();
  return (
    <section id="features" className="py-20">
      <div className="wrap">
        <div ref={ref} className={`max-w-2xl ${shown ? 'animate-fade-up' : 'opacity-0'}`}>
          <h2 className="text-3xl font-extrabold sm:text-4xl">The parts your IT team will use every day</h2>
          <p className="mt-3 text-lg text-dim">
            Ticket handling, device context, safe automation, and a clear place to see the work.
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
