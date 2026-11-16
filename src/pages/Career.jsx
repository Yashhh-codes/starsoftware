import { useEffect, useId, useState } from 'react';
import { ArrowRight, Briefcase, Clock, FileUp, HeartHandshake, Mail, MapPin, Sparkles, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { photo } from '../data/about';
import './Career.css';

// The career page (/career), from starsoftware.co/career: its culture
// statement and application. There are no listed openings there, so none
// are listed here; applicants name the role. Applying opens the visitor's
// email app addressed to the team with their details, to attach the CV.
const MAIL = 'info@starsoftware.co';
const MAX_BYTES = 10 * 1024 * 1024;

const REASONS = [
  {
    icon: Users,
    title: 'People first',
    text: 'Beyond our products and services, it is our people who make Star Software what it is. We have grown on their talents, strengths and loyalty.',
  },
  {
    icon: Sparkles,
    title: 'More than the job description',
    text: 'We hire people who can contribute above and beyond their technical or marketing skills, and who relate to the values we work by.',
  },
  {
    icon: HeartHandshake,
    title: 'Professional, and friendly',
    text: 'A professional, committed, focused and dedicated team, in a friendly, fun and family-oriented environment.',
  },
  {
    icon: Clock,
    title: 'Pay and flexibility',
    text: 'A competitive salary and benefits, with a flexible work schedule.',
  },
];

const OFFICES = [
  { country: 'India', city: 'Bhopal, Madhya Pradesh', line: '35, Sector A, Govindpura Industrial Area' },
  { country: 'Canada', city: 'Montreal, Quebec', line: '4333 St. Catherine West, Suite 201' },
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function ApplyForm() {
  const base = useId();
  const [values, setValues] = useState({ name: '', email: '', position: '' });
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState('');
  const [invalid, setInvalid] = useState({});
  const [opened, setOpened] = useState(false);

  const change = (event) => setValues((v) => ({ ...v, [event.target.name]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    const bad = {};
    const missing = [];
    if (!values.name.trim()) (bad.name = true), missing.push('your name');
    if (!EMAIL.test(values.email.trim())) (bad.email = true), missing.push('a valid email');
    if (!values.position.trim()) (bad.position = true), missing.push('the position');
    setInvalid(bad);
    if (file && file.size > MAX_BYTES) {
      setError('That file is larger than 10 MB. Please send a smaller CV.');
      return;
    }
    if (missing.length) {
      setError(`Add ${missing.length > 1 ? `${missing.slice(0, -1).join(', ')} and ${missing[missing.length - 1]}` : missing[0]} to apply.`);
      return;
    }
    setError('');
    const subject = `Application: ${values.position.trim()}`;
    const lines = [`Name: ${values.name.trim()}`, `Email: ${values.email.trim()}`, `Position: ${values.position.trim()}`];
    if (file) lines.push('', `CV attached: ${file.name}`);
    window.location.href = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    setOpened(true);
  };

  if (opened) {
    return (
      <div className="cr-form cr-done" role="status">
        <span className="cr-done-ic">
          <Mail size={24} aria-hidden="true" />
        </span>
        <h3>Attach your CV and send</h3>
        <p>
          Your email app has opened with your details, addressed to <b>{MAIL}</b>.
          {file ? (
            <>
              {' '}
              Attach <b>{file.name}</b> and send it.
            </>
          ) : (
            ' Attach your CV and send it.'
          )}{' '}
          If you are a good fit, we will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form className="cr-form" noValidate onSubmit={submit}>
      <p className="cr-form-h">Apply now</p>
      <p className="cr-form-sub">Submit your information, and if you are a good fit, we will be in touch soon. Fields marked <i aria-hidden="true">*</i> are required.</p>
      <div className="cr-row">
        <label className="cr-f" htmlFor={`${base}-name`}>
          <span>Name<i aria-hidden="true">*</i></span>
          <input id={`${base}-name`} name="name" required aria-required="true" autoComplete="name" placeholder="Your full name" value={values.name} onChange={change} aria-invalid={invalid.name || undefined} />
        </label>
        <label className="cr-f" htmlFor={`${base}-email`}>
          <span>Email<i aria-hidden="true">*</i></span>
          <input id={`${base}-email`} name="email" required aria-required="true" type="email" autoComplete="email" placeholder="you@email.com" value={values.email} onChange={change} aria-invalid={invalid.email || undefined} />
        </label>
      </div>
      <label className="cr-f" htmlFor={`${base}-position`}>
        <span>Position<i aria-hidden="true">*</i></span>
        <input id={`${base}-position`} name="position" required aria-required="true" placeholder="The role you are applying for" value={values.position} onChange={change} aria-invalid={invalid.position || undefined} />
      </label>
      <label
        className={`cr-drop${drag ? ' is-drag' : ''}${file ? ' has-file' : ''}`}
        onDragEnter={() => setDrag(true)}
        onDragOver={() => setDrag(true)}
        onDragLeave={() => setDrag(false)}
        onDrop={() => setDrag(false)}
      >
        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0] || null)} />
        <span className="cr-drop-ic">
          <FileUp size={20} aria-hidden="true" />
        </span>
        <b>{file ? file.name : <>Drop your CV here or <u>choose a file</u></>}</b>
        <small>PDF or Word, up to 10 MB</small>
      </label>
      <p className="cr-error" role="alert">
        {error}
      </p>
      <button type="submit" className="cr-submit">
        Apply now <ArrowRight size={18} aria-hidden="true" />
      </button>
    </form>
  );
}

export default function Career() {
  useEffect(() => {
    const previous = document.title;
    document.title = 'Career at Star Software: Where Talent Meets Culture';
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <div className="cr-page">
      <Navbar variant="solid" />
      <main>
        <section className="cr-hero">
          <div className="cr-wrap">
            <p className="cr-k">
              <Briefcase size={15} aria-hidden="true" /> Career at Star Software
            </p>
            <h1>
              Where talent <em>meets culture.</em>
            </h1>
            <p className="cr-lede">
              Our products and services are excellent, but it is our people who make Star Software the company it is.
              We look for people who relate to our values and want to build their career with us.
            </p>
            <a className="cr-cta" href="#apply">
              Apply now <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
          {/* People at work in the office (Unsplash), with two facts from the page. */}
          <div className="cr-collage" aria-hidden="true">
            <img className="cr-ph cr-ph-1" src={photo('photo-1552664730-d307ca884978', 720)} alt="" />
            <img className="cr-ph cr-ph-2" src={photo('photo-1543269865-cbf427effbad', 520)} alt="" />
            <img className="cr-ph cr-ph-3" src={photo('photo-1600880292203-757bb62b4baf', 520)} alt="" />
            <span className="cr-chip cr-chip-1">
              <Clock size={16} /> Flexible work schedule
            </span>
            <span className="cr-chip cr-chip-2">
              <MapPin size={16} /> Bhopal · Montreal
            </span>
          </div>
        </section>

        <section className="cr-sec">
          <div className="cr-wrap">
            <p className="cr-k">Why Star Software</p>
            <h2>A team you grow with.</h2>
            <div className="cr-reasons">
              {REASONS.map(({ icon: Icon, title, text }) => (
                <article key={title} className="cr-reason">
                  <span className="cr-ic">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cr-sec cr-sec-soft">
          <div className="cr-wrap cr-split">
            <div>
              <p className="cr-k">What we build</p>
              <h2>AI agents for the documents businesses run on.</h2>
              <p className="cr-p">
                Star Software builds AI agents that read, verify and act on business documents, from mill test reports
                and certificates of analysis to invoices, RFQs and onboarding files, and deliver the data into the ERP
                systems our customers already use.
              </p>
            </div>
            <div className="cr-offices">
              {OFFICES.map((o) => (
                <div key={o.country} className="cr-office">
                  <span className="cr-ic">
                    <MapPin size={18} aria-hidden="true" />
                  </span>
                  <div>
                    <b>{o.country}</b>
                    <span>{o.line}</span>
                    <span>{o.city}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cr-sec cr-apply" id="apply">
          <div className="cr-wrap cr-split">
            <div>
              <p className="cr-k">Open applications</p>
              <h2>Tell us the role you want.</h2>
              <p className="cr-p">
                We do not list fixed openings. Send your details and CV with the position you are interested in, and we
                will reach out if there is a fit.
              </p>
              <p className="cr-p cr-alt">
                Prefer email? Write to <a href={`mailto:${MAIL}`}>{MAIL}</a>.
              </p>
            </div>
            <ApplyForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
