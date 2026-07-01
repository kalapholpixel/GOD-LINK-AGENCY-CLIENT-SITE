# Cross-Domain Integration Guide

This client site is now ready to connect to an admin site hosted on a different domain.

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
