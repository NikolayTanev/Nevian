import Nav from './Nav.jsx';
import ProcessJourney from './ProcessJourney.jsx';
import Footer from './Footer.jsx';

export default function ProcessPage() {
  return (
    <>
      <Nav current="process" />
      <main>
        <ProcessJourney />
      </main>
      <Footer showCta={false} />
    </>
  );
}
