(function setupSiteConfig() {
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const apiDomain = isLocal ? window.location.origin : 'https://godlinkproperties.com';

  window.siteContentConfig = {
    adminDomain: `${apiDomain}`,
    adminDataUrl: `${apiDomain}/api/data`,
    adminEventsUrl: `${apiDomain}/api/events`,
    enquiryEndpoint: `${apiDomain}/api/public/enquiries.php`,
    adminApiKey: '',
    adminAuthToken: '',
    requestCredentials: 'omit',
    openMailClientOnSubmit: false,
    sseReconnectDelayMs: 3000
  };
})();
