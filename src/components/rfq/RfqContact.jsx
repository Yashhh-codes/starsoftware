import { useState } from 'react';
import { Icon } from '../mtr-campaign/icons';

const MAX_BYTES = 10 * 1024 * 1024;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const FIELDS = [
  { name: 'name', label: 'Full name', autoComplete: 'name' },
  { name: 'email', label: 'Work email', autoComplete: 'email', type: 'email' },
];

// The sample form, checked as the reference checks it. The site has no
// form service, so sending opens the visitor's email app addressed to the
// team with the details filled in, and says to attach the file there,
// rather than claiming a sample was sent.
function SampleForm({ contact }) {
  const [values, setValues] = useState({ name: '', email: '', remarks: '', doctype: contact.doctype });
  const [file, setFile] = useState(null);
  const [invalid, setInvalid] = useState({});
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [opened, setOpened] = useState(false);

  const onChange = (event) => setValues((v) => ({ ...v, [event.target.name]: event.target.value }));

  const onSubmit = (event) => {
    event.preventDefault();
    const bad = {};
    const missing = [];
    FIELDS.forEach((field) => {
      const value = values[field.name].trim();
      if (!value || (field.type === 'email' && !EMAIL.test(value))) {
        bad[field.name] = true;
        missing.push(field.label.toLowerCase());
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
    const subject = `Sample for a walkthrough: ${values.doctype}`;
    const lines = [`Name: ${values.name.trim()}`, `Work email: ${values.email.trim()}`, `Automation type: ${values.doctype}`];
    if (values.remarks.trim()) lines.push(`Remarks: ${values.remarks.trim()}`);
    lines.push('', `Attached: ${file.name}`);
    const body = lines.join('\n');
    window.location.href = `mailto:${contact.mail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  if (opened) {
    return (
      <div className="sample-form">
        <div className="form-done" role="status">
          <span className="done-ico">
            <Icon name="mail" />
          </span>
          <h3>Attach your file and send</h3>
          <p>
            {'Your email app has opened with your details, addressed to '}
            <b>{contact.mail}</b>
            {'. Attach '}
            <b>{file.name}</b>
            {' and send it, and we’ll email '}
            <b>{values.email}</b>
            {' to set up your walkthrough.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="sample-form" onSubmit={onSubmit} noValidate>
      <div className="f-row">
        {FIELDS.map((field) => (
          <label key={field.name} className="f">
            <span>{field.label}</span>
            <input
              name={field.name}
              type={field.type || 'text'}
              autoComplete={field.autoComplete}
              value={values[field.name]}
              onChange={onChange}
              aria-invalid={invalid[field.name] || undefined}
              required
            />
          </label>
        ))}
      </div>
      <div className="f-row">
        <label className="f">
          <span>
            {'Remarks '}
            <small>(optional)</small>
          </span>
          <input name="remarks" value={values.remarks} onChange={onChange} />
        </label>
        <label className="f">
          <span>Automation type</span>
          <select name="doctype" value={values.doctype} onChange={onChange} aria-invalid={invalid.doctype || undefined} required>
            <option value="">Choose one</option>
            {contact.doctypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
      </div>
      <label
        className={`sf-drop${dragging ? ' drag' : ''}${file ? ' has-file' : ''}`}
        onDragEnter={() => setDragging(true)}
        onDragOver={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDrop={() => setDragging(false)}
      >
        <input type="file" name="file" accept=".pdf,.png,.jpg,.jpeg,.tif,.tiff" onChange={(e) => setFile(e.target.files[0] || null)} required />
        <Icon name="upload" />
        <span className="drop-t">
          {file ? (
            file.name
          ) : (
            <>
              {'Drop your document here or '}
              <u>choose a file</u>
            </>
          )}
        </span>
        <span className="drop-s">PDF, PNG, JPG or TIFF, up to 10 MB</span>
      </label>
      <p className="f-error" role="alert">
        {error}
      </p>
      <button className="btn btn-primary btn-block" type="submit">
        Send sample
      </button>
      <p className="f-note">Your file is used only to prepare your walkthrough.</p>
    </form>
  );
}

export default function RfqContact({ contact }) {
  return (
    <section className="sec sec-dark cta" id="contact">
      <span id="demo" className="anchor" aria-hidden="true" />
      <div className="wrap cta-grid">
        <div className="cta-copy">
          <h2>{contact.heading}</h2>
          <p>{contact.text}</p>
          <p className="cta-alt">
            {'Prefer a live walkthrough? '}
            <a href={contact.demoUrl}>Request a demo</a>
          </p>
        </div>
        <SampleForm contact={contact} />
      </div>
    </section>
  );
}
