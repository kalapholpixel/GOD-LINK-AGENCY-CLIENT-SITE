# Cross-Domain Integration Guide

This client site is now ready to connect to an admin site hosted on a different domain.

## Status Checklist

Completed in this client repository:

- Cross-domain config support via `site-config.js`
- API content sync on load + SSE-triggered refresh
- API-first enquiry submission with offline queue fallback
- Queue retries on page load and browser `online`

Admin/API package included in this repository:

- Ready-to-upload PHP API in `hostinger-admin/`
- `GET /api/data`
- `GET /api/events`
- `POST /api/public/enquiries.php`
- Built-in CORS + optional API key support

## 1) Configure client endpoints

Edit `site-config.js`:

- `adminDomain`: admin site root domain
- `adminDataUrl`: published listings/content endpoint
- `adminEventsUrl`: SSE endpoint that emits `content-updated`
- `enquiryEndpoint`: enquiry submission endpoint
- `adminApiKey` / `adminAuthToken`: optional auth headers
- `sseReconnectDelayMs`: delay before reconnecting EventSource after an error
- `requestCredentials`: set `include` only if using cookie auth with CORS

## 2) Required admin API contracts

### GET published content

Endpoint: `adminDataUrl`

Accepted response formats:

```json
{ "siteContent": { "properties": [] } }
```

or

```json
{ "data": { "properties": [] } }
```

or direct object payload.

### GET content update events

Endpoint: `adminEventsUrl`

Expected behavior:

- Server-Sent Events stream remains open.
- Fires a `content-updated` event when content changes.
- Client re-fetches `adminDataUrl` when that event is received.
- Client closes and reconnects the stream after errors.

### POST enquiry submission

Endpoint: `enquiryEndpoint`

Request body:

```json
{
  "name": "Client Name",
  "phone": "+233...",
  "email": "client@email.com",
  "message": "Client message",
  "createdAt": "2026-07-01T00:00:00.000Z",
  "page": "https://client-domain/contact.html"
}
```

Success response: any `2xx`.

## 3) CORS requirements on admin API

Allow origin: your client domain (e.g. `https://www.godlinkagency.com`)

Allow methods:

- `GET`
- `POST`
- `OPTIONS`

For the events endpoint, also ensure SSE responses are allowed from the client origin.

Allow headers:

- `Content-Type`
- `Accept`
- `x-api-key` (if used)
- `Authorization` (if used)

If using cookies, also set:

- `Access-Control-Allow-Credentials: true`
- client `requestCredentials: 'include'`

## 4) Runtime behavior now implemented

- Client fetches content from admin API on load.
- Client opens an EventSource connection to `adminEventsUrl`.
- Client re-fetches content when a `content-updated` event is received.
- Client reconnects the EventSource automatically after errors.
- Failed enquiries are queued in localStorage key `godLinkEnquiries`.
- Queue is retried on next load and when browser goes online.
- Optional mail client open can be enabled with `openMailClientOnSubmit`.

## 5) Production recommendations

- Keep `openMailClientOnSubmit` set to `false` in production.
- Prefer token or API key auth over open public write endpoints.
- Add rate limiting and spam protection on admin enquiry endpoint.

## 6) Hostinger deployment instructions

Use this when deploying client and admin sites on different domains (or subdomains) in Hostinger.

### A) Recommended domain layout

- Client site: `https://www.godlinkagency.com`
- Admin/API site: `https://admin.godlinkagency.com`

### B) Deploy the client site in Hostinger hPanel

1. In Hostinger hPanel, open your client domain and enable SSL.
2. Open File Manager for the client domain.
3. Upload this repository files to `public_html`.
4. Confirm these files are present in the web root:
  - `index.html`
  - `listings.html`
  - `property.html`
  - `contact.html`
  - `app.js`
  - `site-config.js`
  - `styles.css`
  - `images/`
5. Edit `site-config.js` with your production admin URLs:
  - `adminDomain`
  - `adminDataUrl`
  - `adminEventsUrl`
  - `enquiryEndpoint`

Example:

```js
window.siteContentConfig = {
  adminDomain: 'https://admin-api.godlinkproperties.com',
  adminDataUrl: 'https://admin-api.godlinkproperties.com/api/data',
  adminEventsUrl: 'https://admin-api.godlinkproperties.com/api/events',
  enquiryEndpoint: 'https://admin-api.godlinkproperties.com/api/public/enquiries.php',
  allowedAdminOrigins: ['https://admin-api.godlinkproperties.com'],
  sseReconnectDelayMs: 3000,
  openMailClientOnSubmit: false,
  requestCredentials: 'omit',
  adminApiKey: '',
  adminAuthToken: ''
};
```

### C) Deploy admin/API on Hostinger

You can deploy the included API package from this repository:

1. Upload the folder `hostinger-admin/` contents to your admin domain `public_html`.
2. Ensure these files exist on admin domain:
  - `api/config.php`
  - `api/bootstrap.php`
  - `api/data`
  - `api/events`
  - `api/public/enquiries.php`
  - `data/site-content.json`
  - `data/enquiries.json`
3. Edit `api/config.php`:
  - set `allowed_origin` to your client domain
  - set `api_key` if you want header auth
4. Make sure `data/` is writable by PHP.

The admin side can also be hosted on:

- Hostinger Web Hosting (PHP-based API)
- Hostinger VPS/Cloud (Node, Django, Laravel, etc.)

Required endpoints:

- `GET /api/data`
- `GET /api/events`
- `POST /api/public/enquiries.php`

Required CORS response headers from admin API:

- `Access-Control-Allow-Origin: https://www.godlinkagency.com`
- `Access-Control-Allow-Methods: GET,POST,OPTIONS`
- `Access-Control-Allow-Headers: Content-Type,Accept,x-api-key,Authorization`

If using cookies/sessions across domains:

- `Access-Control-Allow-Credentials: true`
- Set `requestCredentials: 'include'` in `site-config.js`

### D) DNS and SSL checklist in Hostinger

1. Point client domain/subdomain to client hosting.
2. Point admin subdomain/domain to admin hosting.
3. Enable SSL for both domains in hPanel.
4. Wait for DNS and SSL propagation before testing (can take minutes to hours).

### E) Post-deploy verification

1. Open client site and confirm listings load from API (Network tab: `site-content` request returns `200`).
2. Confirm the EventSource connection to `/api/events` stays open and triggers a content refresh after admin saves.
3. Submit contact form and confirm `enquiries.php` request returns `2xx`.
4. If API is temporarily unavailable, confirm enquiry queues and retries after reconnect.
5. Confirm browser console has no CORS errors.

### F) Cache and update notes (Hostinger)

- If changes do not appear, clear browser cache and Hostinger cache/CDN (if enabled).
- Keep version query strings on scripts (`?v=...`) when deploying updates.
