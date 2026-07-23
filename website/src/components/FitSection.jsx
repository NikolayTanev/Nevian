const fitCards = [
  {
    num: '001',
    title: 'Built for busy queues',
    body: 'High volumes of password resets, account unlocks, and growing support queues.',
  },
  {
    num: '002',
    title: 'Fits your stack',
    body: 'Microsoft 365 or hybrid, with identity verified before anything runs. Designed to follow and update your knowledge base.',
  },
  {
    num: '003',
    title: 'What happens next',
    body: 'Request a demo and we\u2019ll show where Nevian can safely automate your highest-volume requests. Around 30 minutes, tailored to you.',
    cta: { label: 'Book your walkthrough', href: '#contact' },
  },
];

export default function FitSection() {
  return (
    <section className="fit-section" aria-labelledby="fit-heading">
      <div className="fit-grid">
        <div className="fit-intro">
          <h2 id="fit-heading">Is Nevian right for your team?</h2>
          <p>
            Nevian is built for IT teams that want to eliminate repetitive support
            work without sacrificing security or control.
          </p>
        </div>

        {fitCards.map((card) => (
          <article className="fit-card" key={card.num}>
            <span className="fit-num">{card.num}</span>
            <h3 className="fit-card-title">{card.title}</h3>
            <div className="fit-card-body">
              {card.body && <p>{card.body}</p>}
              {card.cta && (
                <a className="fit-cta" href={card.cta.href}>
                  {card.cta.label} <span aria-hidden="true">↓</span>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
