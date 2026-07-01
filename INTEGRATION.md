# Cross-Domain Integration Guide

This client site is now ready to connect to an admin site hosted on a different domain.

## Status Checklist

Completed in this client repository:

- Cross-domain config support via `site-config.js`
- API content sync on load + scheduled polling
- Trusted-origin filtering for `postMessage` updates
- API-first enquiry submission with offline queue fallback
- Queue retries on page load and browser `online`

Admin/API package included in this repository:

- Ready-to-upload PHP API in `hostinger-admin/`
- `GET /api/public/site-content.php`
- `POST /api/public/enquiries.php`
- Built-in CORS + optional API key support

## 1) Configure client endpoints

Edit `site-config.js`:

- `adminDomain`: admin site root domain
- `adminDataUrl`: published listings/content endpoint
- `enquiryEndpoint`: enquiry submission endpoint
- `allowedAdminOrigins`: trusted origins for `postMessage`
- `adminApiKey` / `adminAuthToken`: optional auth headers
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
- Client polls admin API every `syncIntervalMs`.
- Client accepts live update events from trusted origins.
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
  - `content-template.js`
  - `site-config.js`
  - `styles.css`
  - `images/`
5. Edit `site-config.js` with your production admin URLs:
  - `adminDomain`
  - `adminDataUrl`
  - `enquiryEndpoint`
  - `allowedAdminOrigins`

Example:

```js
window.siteContentConfig = {
  adminDomain: 'https://admin.godlinkagency.com',
  adminDataUrl: 'https://admin.godlinkagency.com/api/public/site-content.php',
  enquiryEndpoint: 'https://admin.godlinkagency.com/api/public/enquiries.php',
  allowedAdminOrigins: ['https://admin.godlinkagency.com'],
  syncIntervalMs: 60000,
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
  - `api/public/site-content.php`
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

- `GET /api/public/site-content.php`
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
2. Submit contact form and confirm `enquiries.php` request returns `2xx`.
3. If API is temporarily unavailable, confirm enquiry queues and retries after reconnect.
4. Confirm browser console has no CORS errors.

### F) Cache and update notes (Hostinger)

- If changes do not appear, clear browser cache and Hostinger cache/CDN (if enabled).
- Keep version query strings on scripts (`?v=...`) when deploying updates.
