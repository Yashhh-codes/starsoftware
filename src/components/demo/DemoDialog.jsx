import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { DEMO_PATH } from '../../data/demo';
import DemoForm from './DemoForm';
import DemoAside from './DemoAside';
import './demo.css';

// Every "Book a demo" button on the site links to DEMO_PATH. A plain click
// on one opens the form here, over the page the visitor is on; a click with
// a modifier (new tab, new window) follows the link to the form's own page.
// Mounted once, in App.
export default function DemoDialog() {
  const dialogRef = useRef(null);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Watch clicks before the router does, so its links are caught too.
  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest?.('a[href]');
      if (!link || (link.target && link.target !== '_self')) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== DEMO_PATH) return;
      // On the form's own page there's nothing to open.
      if (window.location.pathname === DEMO_PATH) return;
      event.preventDefault();
      setOpen(true);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // A new page closes it.
  useEffect(() => {
    setOpen(false);
  }, [location.key]);

  // The native dialog: focus kept inside, Escape closes, focus goes back to
  // the button that opened it. The page behind doesn't scroll meanwhile.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (open && !dialog.open) {
      dialog.showModal();
      // Straight into the name field with a mouse; on a touchscreen that
      // would throw up the keyboard before the form's been read.
      if (window.matchMedia('(pointer: fine)').matches) dialog.querySelector('input')?.focus();
    }
    if (!open && dialog.open) dialog.close();
    document.documentElement.classList.toggle('dm-locked', open);
    return () => document.documentElement.classList.remove('dm-locked');
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="dm-dialog"
      aria-labelledby="dm-dialog-title"
      onClose={() => setOpen(false)}
      // A click on the backdrop (the dialog itself, outside its panel) closes it.
      onClick={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      {open && (
        <div className="dm-panel">
          <button type="button" className="dm-close" aria-label="Close" onClick={() => setOpen(false)}>
            <X size={20} aria-hidden="true" />
          </button>
          <DemoAside />
          <div className="dm-main">
            <DemoForm titleId="dm-dialog-title" onDone={() => setOpen(false)} />
          </div>
        </div>
      )}
    </dialog>
  );
}
