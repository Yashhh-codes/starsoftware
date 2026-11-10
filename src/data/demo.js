// The "Book a demo" flow: every demo button links to DEMO_PATH. A click
// opens the short form over the page (src/components/demo/DemoDialog.jsx);
// opening the address directly shows the same form as a page. Sending it
// passes the name and email to HubSpot, then goes to THANK_YOU_PATH, where
// the scheduler below is embedded to book a slot.
export const DEMO_PATH = '/book-a-demo';
export const THANK_YOU_PATH = '/book-a-demo/thank-you';

// HubSpot's form submission API needs only the account's Hub ID (portal ID)
// and the form's ID; both are public (any HubSpot form embed shows them),
// so they live here rather than in a secret. The form needs First name,
// Last name and Email fields. Until both are filled in, nothing is sent and
// the flow goes straight on to the scheduler.
export const HUBSPOT_PORTAL_ID = '';
export const HUBSPOT_FORM_ID = '';

// The booking calendar on the thank-you page. A Calendly link, or a HubSpot
// meetings link (https://meetings.hubspot.com/...); the name and email from
// the form are filled in for either.
export const SCHEDULER_URL = 'https://calendly.com/robinstar/15min';

// Where the form's details wait for the thank-you page (this browser tab
// only), so they never go into the address bar.
export const LEAD_STORAGE_KEY = 'star-demo-lead';
