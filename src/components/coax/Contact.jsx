import { useState } from 'react';
import { Mail, Upload } from 'lucide-react';
import { BOOKING_URL } from '../../data/coaLanding';
import { C_CONTACT } from '../../data/coaX';

const MAX_BYTES = 10 * 1024 * 1024;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const FIELDS = [
  { name: 'name', label: 'Full name', autoComplete: 'name', placeholder: 'Jane Cooper' },
  { name: 'email', label: 'Work email', autoComplete: 'email', type: 'email', placeholder: 'jane@company.com' },
];

// The sample form. The site has no form service, so sending opens the
// visitor's email app addressed to the team with the details filled in,
// and says to attach the file there, rather than claiming it was sent.
function SampleForm() {
  const d = C_CONTACT;
  const [values, setValues] = useState({ name: '', email: '', remarks: '', doctype: d.doctype });
  const [file, setFile] = useState(null);
  const [invalid, setInvalid] = useState({});
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [opened, setOpened] = useState(false);

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const bad = {};
    const missing = [];
    FIELDS.forEach((f) => {
      const value = values[f.name].trim();
      if (!value || (f.type === 'email' && !EMAIL.test(value))) {
        bad[f.name] = true;
        missing.push(f.label.toLowerCase());
      }
    });
    if (!values.doctype) {
      bad.doctype = true;
      missing.push('automation type');
    }
    setInvalid(bad);
    if (!file) missing.push('a document');
    else if (file.size > MAX_BYTES) {
      setError('That file is larger than 10 MB. Send a smaller file or a single page.');
      return;
    }
    if (missing.length) {
      setError(`Add ${missing.join(', ')} to send your sample.`);
      return;
    }
    setError('');
    const lines = [`Name: ${values.name.trim()}`, `Work email: ${values.email.trim()}`, `Automation type: ${values.doctype}`];
    if (values.remarks.trim()) lines.push(`Remarks: ${values.remarks.trim()}`);
    lines.push('', `Attached: ${file.name}`);
    window.location.href = `mailto:${d.mail}?subject=${encodeURIComponent(`Sample for a walkthrough: ${values.doctype}`)}&body=${encodeURIComponent(lines.join('\n'))}`;
    setOpened(true);
  };

  if (opened) {
    return (
      <div className="cxq-form">
        <div className="cxq-done" role="status">
          <span className="cxq-done-ic">
            <Mail size={22} aria-hidden="true" />
          </span>
          <h3>Attach your file and send</h3>
          <p>
            Your email app has opened with your details, addressed to <b>{d.mail}</b>. Attach <b>{file.name}</b> and send it, and we’ll email <b>{values.email}</b> to set up your walkthrough.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="cxq-form" onSubmit={onSubmit} noValidate>
      <div className="cxq-head">
        <p className="cxq-title">Send a sample</p>
        <p className="cxq-sub">One document is enough. We’ll reply with a walkthrough of what Star found.</p>
      </div>
      <div className="cxq-row">
        {FIELDS.map((f) => (
          <label key={f.name} className="cxq-f">
            <span>{f.label}</span>
            <input
              name={f.name}
              type={f.type || 'text'}
              autoComplete={f.autoComplete}
              placeholder={f.placeholder}
              value={values[f.name]}
              onChange={onChange}
              aria-invalid={invalid[f.name] || undefined}
              required
            />
          </label>
        ))}
      </div>
      <div className="cxq-row">
        <label className="cxq-f">
          <span>
            Remarks <small>(optional)</small>
          </span>
          <input name="remarks" placeholder="e.g. supplier or format" value={values.remarks} onChange={onChange} />
        </label>
        <label className="cxq-f">
          <span>Automation type</span>
          <select name="doctype" value={values.doctype} onChange={onChange} aria-invalid={invalid.doctype || undefined} required>
            <option value="">Choose one</option>
            {d.doctypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <label
        className={`cxq-drop${dragging ? ' is-drag' : ''}${file ? ' has-file' : ''}`}
        onDragEnter={() => setDragging(true)}
        onDragOver={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDrop={() => setDragging(false)}
      >
        <input type="file" name="file" accept=".pdf,.png,.jpg,.jpeg,.tif,.tiff" onChange={(e) => setFile(e.target.files[0] || null)} required />
        <span className="cxq-drop-ic">
          <Upload size={22} aria-hidden="true" />
        </span>
        <span className="cxq-drop-t">
          {file ? (
            file.name
          ) : (
            <>
              Drop your document here or <u>choose a file</u>
            </>
          )}
        </span>
        <span className="cxq-drop-s">PDF, PNG, JPG or TIFF, up to 10 MB</span>
      </label>
      <p className="cxq-error" role="alert">
        {error}
      </p>
      <button className="cxq-submit" type="submit">
        Send sample
      </button>
      <p className="cxq-note">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <path d="M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
        Your file is used only to prepare your walkthrough.
      </p>
    </form>
  );
}

// The closing invitation: what happens to a COA you send, beside the
// sample form.
export default function Contact() {
  const d = C_CONTACT;
  return (
    <section id="send" className="mx-sec cxq" aria-labelledby="cxq-title">
      <span id="contact" className="cxq-anchor" aria-hidden="true" />
      <div className="mt-wrap cxq-grid">
        <div className="cxq-copy">
          <h2 id="cxq-title" data-reveal>
            {d.title}
          </h2>
          <p data-reveal style={{ '--rv-delay': '80ms' }}>
            {d.text}
          </p>
          <ol className="cxq-steps" data-reveal style={{ '--rv-delay': '140ms' }}>
            {d.steps.map(([t, s], i) => (
              <li key={t}>
                <span>{i + 1}</span>
                <div>
                  <b>{t}</b>
                  {s}
                </div>
              </li>
            ))}
          </ol>
          <p className="cxq-docs" data-reveal style={{ '--rv-delay': '180ms' }}>
            <span>Works with</span>
            {d.docs.map((x) => (
              <i key={x}>{x}</i>
            ))}
          </p>
          <p className="cxq-alt" data-reveal style={{ '--rv-delay': '220ms' }}>
            Prefer a live walkthrough? <a href={BOOKING_URL}>Request a demo</a>
          </p>
        </div>
        <div data-reveal="scale" style={{ '--rv-delay': '120ms' }}>
          <SampleForm />
        </div>
      </div>
    </section>
  );
}
