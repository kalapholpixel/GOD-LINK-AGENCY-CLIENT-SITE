window.siteContentConfig = {
  // Admin domain where your admin backend/API is hosted.
  adminDomain: 'https://admin.godlinkagency.com',

  // Public endpoint used by the client site to fetch published site content/listings.
  // Example response: { "siteContent": { ... } } or { "data": { ... } }
  adminDataUrl: 'https://admin.godlinkagency.com/api/public/site-content',

  // Endpoint used by the client site to submit contact enquiries.
  enquiryEndpoint: 'https://admin.godlinkagency.com/api/public/enquiries',

  // Optional API authentication headers.
  adminApiKey: '',
  adminAuthToken: '',

  // Restrict postMessage updates to trusted admin origins.
  allowedAdminOrigins: ['https://admin.godlinkagency.com'],

  // Polling interval for pulling latest content from admin API.
  syncIntervalMs: 60000,

  // Set to true only if you want browser mail client to open on each enquiry submit.
  openMailClientOnSubmit: false,

  // Usually 'omit' for public APIs, or 'include' if admin API uses cookies + CORS credentials.
  requestCredentials: 'omit'
};
