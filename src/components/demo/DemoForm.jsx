import { useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { LEAD_STORAGE_KEY, THANK_YOU_PATH } from '../../data/demo';
import { submitDemoRequest } from '../../utils/hubspot';
import './demo.css';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate({ name, email }) {
  const errors = {};
  if (name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL.test(email.trim())) errors.email = 'Please enter a valid email address.';
  return errors;
}

// Step one of booking a demo: a name and an email. Sending passes them to
// HubSpot and moves on to the thank-you page to pick a time. If HubSpot
// can't be reached the visitor still goes on, since booking matters most.
export default function DemoForm({ titleId, onDone }) {
  const navigate = useNavigate();
  const base = useId();
  const formRef = useRef(null);
  const [values, setValues] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [sending, setSending] = useState(false);

  const change = (field) => (event) => {
    const next = { ...values, [field]: event.target.value };
    setValues(next);
    if (attempted) setErrors(validate(next));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (sending) return;
    const found = validate(values);
    setErrors(found);
    setAttempted(true);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      formRef.current?.elements.namedItem(firstInvalid)?.focus();
      return;
    }

    const lead = { name: values.name.trim(), email: values.email.trim() };
    setSending(true);
    try {
      await submitDemoRequest(lead);
    } catch (error) {
      console.warn('The demo request could not be sent to HubSpot.', error);
    }
    try {
      sessionStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(lead));
    } catch {
      // Storage blocked: the scheduler just starts without the name filled in.
    }
    setSending(false);
    onDone?.();
    navigate(THANK_YOU_PATH, { state: { lead } });
  };

  const fieldProps = (field) => ({
    id: `${base}-${field}`,
    name: field,
    value: values[field],
    onChange: change(field),
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `${base}-${field}-error` : undefined,
  });

  return (
    <div className="dm-form-wrap">
      <ol className="dm-steps" aria-label="Booking steps">
        <li className="is-on" aria-current="step">
          <span>1</span> Your details
        </li>
        <li>
          <span>2</span> Pick a time
        </li>
      </ol>
      <h2 className="dm-title" id={titleId}>
        Book a demo
      </h2>
      <p className="dm-text">Tell us who you are, then choose a time that suits you in our calendar.</p>

      <form ref={formRef} className="dm-form" noValidate onSubmit={submit}>
        <div className="dm-field">
          <label htmlFor={`${base}-name`}>Name</label>
          <input {...fieldProps('name')} type="text" autoComplete="name" placeholder="Your full name" />
          {errors.name && (
            <p className="dm-error" id={`${base}-name-error`}>
              {errors.name}
            </p>
          )}
        </div>
        <div className="dm-field">
          <label htmlFor={`${base}-email`}>Work email</label>
          <input {...fieldProps('email')} type="email" autoComplete="email" inputMode="email" placeholder="you@company.com" />
          {errors.email && (
            <p className="dm-error" id={`${base}-email-error`}>
              {errors.email}
            </p>
          )}
        </div>
        <button type="submit" className="dm-submit" disabled={sending}>
          {sending ? (
            <>
              <Loader2 size={18} className="dm-spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              Continue to booking <ArrowRight size={18} aria-hidden="true" />
            </>
          )}
        </button>
        <p className="dm-note">We&rsquo;ll use these details only to arrange your demo.</p>
      </form>
    </div>
  );
}
