import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Journey from './components/Journey.jsx';
import Architecture from './components/Architecture.jsx';
import Integrations from './components/Integrations.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <Nav />

      <main>
        <Hero />
        <Integrations />
        <Journey />
        <Architecture />
      </main>
      <Footer />
    </>
  );
}
