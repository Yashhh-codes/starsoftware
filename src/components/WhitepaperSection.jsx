import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Download, X } from 'lucide-react';
import { WHITEPAPERS } from '../data/whitepapersData';
import './WhitepaperSection.css';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  jobTitle: '',
  updates: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Keys are in on-screen order, so the first error is the first field to fix.
function validate(values) {
  const errors = {};
  if (!values.firstName.trim()) errors.firstName = 'Enter your first name.';
  if (!values.lastName.trim()) errors.lastName = 'Enter your last name.';
  if (!values.email.trim()) {
    errors.email = 'Enter your work email.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address, like name@company.com.';
  }
  if (!values.company.trim()) errors.company = 'Enter your company name.';
  return errors;
}

function WhitepaperCover({ whitepaper, compact = false }) {
  return (
    <div
      className={`rh-wp-cover rh-wp-cover--${whitepaper.tone}${compact ? ' rh-wp-cover--compact' : ''}`}
      aria-hidden="true"
    >
      <div className="rh-wp-cover-sheet">
        <span className="rh-wp-cover-kicker">Whitepaper</span>
        <span className="rh-wp-cover-category">{whitepaper.category}</span>
        <span className="rh-wp-cover-lines">
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  );
}

function TextField({ name, label, type = 'text', autoComplete, optional = false, value, error, onChange }) {
  const id = `wp-field-${name}`;
  const errorId = `${id}-error`;
  return (
    <div className="rh-wp-field">
      <label htmlFor={id} className="rh-wp-label">
        {label}
        {optional && <span className="rh-wp-optional"> (optional)</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        className="rh-wp-input"
        value={value}
        onChange={onChange}
        required={!optional}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p id={errorId} className="rh-wp-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default function WhitepaperSection() {
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const successHeadingRef = useRef(null);
  const [active, setActive] = useState(null);
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);
  // Once the form is filled in this visit, later downloads skip straight to
  // the file. Held in memory only: nothing is stored or sent yet.
  const [requester, setRequester] = useState(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (active && dialog && !dialog.open) dialog.showModal();
  }, [active]);

  useEffect(() => {
    if (active && requester) successHeadingRef.current?.focus();
  }, [active, requester]);

  const openFor = (whitepaper, event) => {
    triggerRef.current = event.currentTarget;
    setActive(whitepaper);
  };

  // Idempotent, because it can run twice: directly from closeDialog, then
  // again from the dialog's own `close` event.
  const finishClose = () => {
    setActive(null);
    setErrors({});
    setAttempted(false);
    triggerRef.current?.focus();
  };

  // Runs the cleanup itself rather than waiting on the `close` event: that
  // event can be delivered late, and the browser's own focus restore lands on
  // whatever was focused before opening — in Safari, which doesn't focus
  // buttons on click, that isn't the button that opened the dialog.
  const closeDialog = () => {
    dialogRef.current?.close();
    finishClose();
  };

  // A click whose target is the <dialog> itself landed on the backdrop, since
  // the inner panel covers all of the dialog's own box.
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) closeDialog();
  };

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    const next = { ...values, [name]: type === 'checkbox' ? checked : value };
    setValues(next);
    if (attempted) setErrors(validate(next));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    setAttempted(true);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      event.currentTarget.elements.namedItem(firstInvalid)?.focus();
      return;
    }
    // UI only for now — wire this to the lead-capture backend.
    setRequester({ firstName: values.firstName.trim() });
  };

  return (
    <section id="whitepapers" className="rh-wp-section" aria-labelledby="whitepapers-heading">
      <div className="rh-wp-head">
        <span className="rh-section-eyebrow rh-wp-eyebrow">Whitepapers</span>
        <h2 id="whitepapers-heading" className="rh-h2">
          In-depth guides for document automation teams
        </h2>
        <p className="rh-wp-copy">
          Practical frameworks on AP, CoA and MTR automation. Free to download after a short form.
        </p>
      </div>

      <ul className="rh-wp-grid">
        {WHITEPAPERS.map((whitepaper) => (
          <li key={whitepaper.id} className="rh-wp-card">
            <WhitepaperCover whitepaper={whitepaper} />
            <div className="rh-wp-card-body">
              <p className="rh-wp-meta">
                {whitepaper.category}
                <span aria-hidden="true"> · </span>
                PDF
              </p>
              <h3 id={`wp-title-${whitepaper.id}`} className="rh-wp-title">
                {whitepaper.title}
              </h3>
              <p className="rh-wp-summary">{whitepaper.summary}</p>
              <button
                type="button"
                className="rh-wp-btn rh-wp-btn--outline"
                aria-haspopup="dialog"
                aria-describedby={`wp-title-${whitepaper.id}`}
                onClick={(event) => openFor(whitepaper, event)}
              >
                Get the whitepaper
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="rh-wp-dialog"
        aria-labelledby="wp-dialog-title"
        onClose={finishClose}
        onClick={handleBackdropClick}
      >
        {active && (
          <div className="rh-wp-dialog-panel">
            <button type="button" className="rh-wp-close" aria-label="Close" onClick={closeDialog}>
              <X size={18} aria-hidden="true" />
            </button>

            <aside className="rh-wp-dialog-aside">
              <WhitepaperCover whitepaper={active} compact />
              <p className="rh-wp-meta">
                Whitepaper<span aria-hidden="true"> · </span>
                {active.category}
              </p>
              <h2 id="wp-dialog-title" className="rh-wp-dialog-title">
                {active.title}
              </h2>
              <p className="rh-wp-inside">What&rsquo;s inside</p>
              <ul className="rh-wp-highlights">
                {active.highlights.map((point) => (
                  <li key={point}>
                    <Check size={16} aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </aside>

            <div className="rh-wp-dialog-main">
              {requester ? (
                <div className="rh-wp-success">
                  <span className="rh-wp-success-icon" aria-hidden="true">
                    <Check size={22} />
                  </span>
                  <h3 ref={successHeadingRef} tabIndex={-1} className="rh-wp-success-title">
                    You&rsquo;re all set, {requester.firstName}.
                  </h3>
                  <p className="rh-wp-success-copy">Your copy of this whitepaper is ready.</p>
                  {active.file ? (
                    <a className="rh-wp-btn rh-wp-btn--primary" href={active.file} download>
                      <Download size={16} aria-hidden="true" />
                      Download PDF
                    </a>
                  ) : (
                    <>
                      <button type="button" className="rh-wp-btn rh-wp-btn--primary" disabled>
                        <Download size={16} aria-hidden="true" />
                        Download PDF
                      </button>
                      <p className="rh-wp-note">This whitepaper will be available to download soon.</p>
                    </>
                  )}
                </div>
              ) : (
                <form className="rh-wp-form" noValidate onSubmit={handleSubmit}>
                  <p className="rh-wp-form-intro">
                    Tell us a little about yourself to get your free copy.
                  </p>
                  <div className="rh-wp-row">
                    <TextField
                      name="firstName"
                      label="First name"
                      autoComplete="given-name"
                      value={values.firstName}
                      error={errors.firstName}
                      onChange={handleChange}
                    />
                    <TextField
                      name="lastName"
                      label="Last name"
                      autoComplete="family-name"
                      value={values.lastName}
                      error={errors.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <TextField
                    name="email"
                    label="Work email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    error={errors.email}
                    onChange={handleChange}
                  />
                  <div className="rh-wp-row">
                    <TextField
                      name="company"
                      label="Company"
                      autoComplete="organization"
                      value={values.company}
                      error={errors.company}
                      onChange={handleChange}
                    />
                    <TextField
                      name="jobTitle"
                      label="Job title"
                      autoComplete="organization-title"
                      optional
                      value={values.jobTitle}
                      onChange={handleChange}
                    />
                  </div>
                  <label className="rh-wp-check">
                    <input
                      type="checkbox"
                      name="updates"
                      checked={values.updates}
                      onChange={handleChange}
                    />
                    <span>Send me occasional product updates from Star Software (optional)</span>
                  </label>
                  <button type="submit" className="rh-wp-btn rh-wp-btn--primary rh-wp-submit">
                    Get the whitepaper
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
