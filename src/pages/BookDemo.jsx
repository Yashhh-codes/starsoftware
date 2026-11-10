import { useEffect } from 'react';
import { CalendarCheck, FileSearch, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DemoForm from '../components/demo/DemoForm';
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
        <div className="dm-page-grid">
          <div className="dm-page-intro">
            <p className="dm-eyebrow">Book a demo</p>
            <h1 className="dm-page-title">See Star Software on your own documents</h1>
            <p className="dm-page-text">
              A short call with our team about the documents you process and how Star Software would read, check
              and move them into your systems.
            </p>
            <ul className="dm-points">
              <li>
                <Clock size={18} aria-hidden="true" /> Pick a time that suits you, straight after this form
              </li>
              <li>
                <FileSearch size={18} aria-hidden="true" /> Bring a sample document if you have one to hand
              </li>
              <li>
                <CalendarCheck size={18} aria-hidden="true" /> A calendar invite follows by email
              </li>
            </ul>
          </div>
          <div className="dm-card">
            <DemoForm titleId="dm-page-form-title" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
