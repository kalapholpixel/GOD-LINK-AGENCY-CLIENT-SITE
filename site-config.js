(function setupSiteConfig() {
  const hostname = window.location.hostname || '';
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  const hostParts = hostname.split('.').filter(Boolean);

  let baseDomain = '';
  if (!isLocal && hostParts.length >= 2) {
    baseDomain = hostParts.slice(-2).join('.');
  }

  const adminDomain = baseDomain ? `https://admin.${baseDomain}` : '';

  window.siteContentConfig = {
    // Admin domain where your admin backend/API is hosted.
    adminDomain,

    // Public endpoint used by the client site to fetch published site content/listings.
    // Example response: { "siteContent": { ... } } or { "data": { ... } }
    adminDataUrl: adminDomain ? `${adminDomain}/api/public/site-content.php` : '',

    // Endpoint used by the client site to submit contact enquiries.
    enquiryEndpoint: adminDomain ? `${adminDomain}/api/public/enquiries.php` : '',

    // Optional API authentication headers.
    adminApiKey: '',
    adminAuthToken: '',

    // Restrict postMessage updates to trusted admin origins.
    allowedAdminOrigins: adminDomain ? [adminDomain] : [],

    // Polling interval for pulling latest content from admin API.
    syncIntervalMs: 60000,

    // Set to true only if you want browser mail client to open on each enquiry submit.
    openMailClientOnSubmit: false,

    // Usually 'omit' for public APIs, or 'include' if admin API uses cookies + CORS credentials.
    requestCredentials: 'omit'
  };
})();
