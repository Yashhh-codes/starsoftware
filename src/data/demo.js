// The "Book a demo" flow: every demo button links to DEMO_PATH. A click
// opens the short form over the page (src/components/demo/DemoDialog.jsx);
// opening the address directly shows the same form as a page. Sending it
// passes the name and email to HubSpot, then goes to THANK_YOU_PATH: the
// scheduler below to book a slot when there is one, otherwise a note that
// the team will be in touch.
export const DEMO_PATH = '/book-a-demo';
export const THANK_YOU_PATH = '/book-a-demo/thank-you';

// HubSpot's form submission API needs only the account's Hub ID (portal ID)
// and the form's ID; both are public (any HubSpot form embed shows them),
// so they live here rather than in a secret. The form needs First name,
// Last name and Email fields. Until both are filled in nothing is sent, and
// the thank-you page points the visitor to the contact page instead of
// saying the team will be in touch.
// The client's form "F001 - Website - Book a demo" (HubSpot region na2).
export const HUBSPOT_PORTAL_ID = '245515479';
export const HUBSPOT_FORM_ID = '4f29edd1-56e7-493b-87e3-b8506eada4a9';

// The booking calendar on the thank-you page, once one is confirmed: a
// Calendly link, or a HubSpot meetings link (https://meetings.hubspot.com/...);
// the name and email from the form are filled in for either. Empty, there's
// no calendar: the form asks for a request and the team arranges the time.
export const SCHEDULER_URL = 'https://calendly.com/robinstar/15min';

// The site's contact page ("Talk to us", and the way through when a request
// couldn't be passed on).
export const CONTACT_URL = 'https://starsoftware.co/contact/';

// Where the form's details wait for the thank-you page (this browser tab
// only), so they never go into the address bar.
export const LEAD_STORAGE_KEY = 'star-demo-lead';
