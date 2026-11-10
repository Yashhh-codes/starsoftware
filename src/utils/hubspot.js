import { HUBSPOT_FORM_ID, HUBSPOT_PORTAL_ID } from '../data/demo';

const TIMEOUT_MS = 8000;

// "Ada Lovelace King" -> first name "Ada", last name "Lovelace King".
export function splitName(name) {
  const [first = '', ...rest] = name.trim().split(/\s+/);
  return { first, last: rest.join(' ') };
}

// Sends a demo request to the HubSpot form (its submission API, which takes
// no key). Resolves { sent: false } while the IDs in src/data/demo.js are
// empty; rejects if HubSpot refuses or doesn't answer in time.
export async function submitDemoRequest({ name, email }) {
  if (!HUBSPOT_PORTAL_ID || !HUBSPOT_FORM_ID) return { sent: false };

  const { first, last } = splitName(name);
  const contact = (field, value) => ({ objectTypeId: '0-1', name: field, value });
  const fields = [contact('firstname', first), ...(last ? [contact('lastname', last)] : []), contact('email', email)];

  // HubSpot's visitor cookie, when its tracking code is on the site, ties
  // the request to the visitor's earlier page views.
  const hutk = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/)?.[1];
  const context = { pageUri: window.location.href, pageName: document.title, ...(hutk ? { hutk } : {}) };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields, context }),
        signal: controller.signal,
      }
    );
    if (!response.ok) throw new Error(`HubSpot answered ${response.status}`);
    return { sent: true };
  } finally {
    clearTimeout(timer);
  }
}
