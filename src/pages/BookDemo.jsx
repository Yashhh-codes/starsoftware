import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DemoForm from '../components/demo/DemoForm';
import DemoAside from '../components/demo/DemoAside';
import '../components/demo/demo.css';

// /book-a-demo: the demo form as a page, for when the address is opened
// directly (a shared link, an email, a new tab). A click on a demo button
// opens the same form over the current page instead (DemoDialog).
export default function BookDemo() {
  useEffect(() => {
    const previous = document.title;
    document.title = 'Book a demo | Star Software';
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <div className="dm-page">
      <Navbar variant="solid" />
      <main className="dm-page-main">
        <header className="dm-page-head">
          <p className="dm-eyebrow">Book a demo</p>
          <h1 className="dm-page-title">See Star Software on your own documents</h1>
        </header>
        <div className="dm-shell">
          <DemoAside />
          <div className="dm-main">
            <DemoForm titleId="dm-page-form-title" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
