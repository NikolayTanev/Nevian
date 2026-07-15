import { useReveal } from '../hooks/useReveal.js';
import { IconCheck } from './Icons.jsx';

const points = [
  'Live fleet inventory with health at a glance',
  'Ticket operations, SLAs, and AI suggestions in one view',
  'Automation runs and audit trail, always visible',
];

export default function Showcase() {
  const [ref, shown] = useReveal();
  return (
    <section className="py-20">
      <div className="wrap">
        <div ref={ref} className={`grid items-center gap-10 lg:grid-cols-2 ${shown ? 'animate-fade-up' : 'opacity-0'}`}>
          <div>
            <span className="eyebrow">Admin dashboard</span>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">One command center for the work IT actually does.</h2>
            <p className="mt-3 text-lg text-dim">
              Tickets, devices, and automation in a single calm view — with the metrics that tell you where time goes.
            </p>
            <ul className="mt-6 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex gap-3 text-dim">
                  <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  {p}
                </li>
              ))}
            </ul>
            <a href="#contact" className="btn btn-primary mt-8 text-base">Book a demo</a>
          </div>

          <div className="relative">
            {/* soft AI-rendered accent behind the screenshot */}
            <img
              src="/assets/AI_Assets/Frosted_glass_card_on_ring_202607082251.jpeg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 -top-8 -z-10 hidden w-64 rotate-6 rounded-3xl opacity-60 blur-[1px] lg:block"
            />
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lift">
              <img src="/assets/dashboard-preview.png" alt="Nevian admin dashboard" className="w-full" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
