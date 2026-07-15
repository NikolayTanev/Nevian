import { useState } from 'react';
import { IconArrow, IconCheck } from './Icons.jsx';

const footerGroups = [
  {
    title: 'Discover',
    links: [
      ['Home', '#top'],
      ['How it works', '#how'],
      ['Platform', '#features'],
      ['Contact', '#contact'],
    ],
  },
  {
    title: 'Product',
    links: [
      ['AI Ticketing', '#features'],
      ['Endpoint Agent', '#features'],
      ['Admin Dashboard', '#features'],
      ['Security & Automation', '#features'],
    ],
  },
  {
    title: 'Resources',
    links: [
      ['Workflow', '#how'],
      ['Integrations', '#how'],
      ['Book a walkthrough', '#contact'],
      ['Support', 'mailto:nevian.info@gmail.com'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About Nevian', '#top'],
      ['Contact us', '#contact'],
      ['Email', 'mailto:nevian.info@gmail.com'],
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const [newsletterStatus, setNewsletterStatus] = useState('');

  const subscribe = (event) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get('newsletterEmail');
    setNewsletterStatus('Your email draft is ready.');
    window.location.href = `mailto:nevian.info@gmail.com?subject=${encodeURIComponent('Nevian newsletter')}&body=${encodeURIComponent(`Please add ${email} to the Nevian newsletter.`)}`;
  };

  return (
    <footer id="footer" className="site-footer">
      <div className="site-footer-wrap">
        <section className="footer-cta" aria-labelledby="footer-cta-title">
          <svg className="footer-cta-circuit" viewBox="0 0 1200 460" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 145H92l36-36V0M0 350h68l36-36h322l31 31v115" />
            <path d="M1200 54h-62l-29 29v82l28 28v207l-47 47H920" />
            <path d="M700 0v83l30 30h148M118 0v121l-48 48v117" />
          </svg>
          <div className="footer-cta-content">
            <span>One platform. Less IT friction.</span>
            <h2 id="footer-cta-title">Ready to dive in?</h2>
            <p>See where Nevian can remove repetitive work from your support workflow.</p>
            <a href="#contact" className="footer-cta-button">
              Book a walkthrough <IconArrow aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="footer-newsletter" aria-labelledby="footer-newsletter-title">
          <div>
            <div className="footer-section-label"><i /> Subscribe to our newsletter</div>
            <h2 id="footer-newsletter-title">The latest IT support insights, product updates, and resources—in your inbox.</h2>
          </div>

          <form className="footer-newsletter-form" onSubmit={subscribe}>
            <label htmlFor="newsletter-email"><i /> Email</label>
            <div>
              <input id="newsletter-email" name="newsletterEmail" type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe <IconArrow aria-hidden="true" /></button>
            </div>
            <p aria-live="polite">
              {newsletterStatus && <><IconCheck aria-hidden="true" /> {newsletterStatus}</>}
            </p>
          </form>
        </section>

        <nav className="footer-navigation" aria-label="Footer navigation">
          <div className="footer-brand-column">
            <a href="#top" className="footer-brand">
              <img src="/assets/logo.png" alt="" />
              <span>Nevian</span>
            </a>
            <p>Context-rich IT support and safe automation for lean teams.</p>
          </div>

          {footerGroups.map((group) => (
            <div className="footer-link-group" key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.links.map(([label, href]) => (
                  <li key={label}><a href={href}>{label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="footer-bottom">
          <span>© {year} Nevian. All rights reserved.</span>
          <a href="mailto:nevian.info@gmail.com">nevian.info@gmail.com</a>
        </div>
      </div>
    </footer>
  );
}
