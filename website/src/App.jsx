import { useState } from 'react';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Journey from './components/Journey.jsx';
import Architecture from './components/Architecture.jsx';
import Integrations from './components/Integrations.jsx';
import ConversionCTA from './components/ConversionCTA.jsx';
import ContactSection from './components/ContactSection.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [navFocus, setNavFocus] = useState(false);

  return (
    <>
      <Nav onDropdownChange={setNavFocus} />

      {/* Focus scrim: softly blurs the page (only) while the Solutions
          dropdown is open. Sits below the nav (z-50) so the menu stays
          crisp, and blurs via backdrop-filter so nothing is removed. */}
      <div
        className={`pointer-events-none fixed inset-0 z-40 bg-text/5 backdrop-blur-[5px] transition-opacity duration-300 ${
          navFocus ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      <main>
        <Hero />
        <Integrations />
        <Journey />
        <Architecture />
        <ConversionCTA />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
