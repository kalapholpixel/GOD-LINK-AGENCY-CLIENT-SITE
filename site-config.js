(function setupSiteConfig() {
  const apiDomain = window.location.origin;

  window.siteContentConfig = {
    adminDomain: apiDomain,
    adminDataUrl: `${apiDomain}/api/public/site-content`,
    adminEventsUrl: `${apiDomain}/api/events`,
    enquiryEndpoint: `${apiDomain}/api/public/enquiries`,
    adminApiKey: '',
    adminAuthToken: '',
    requestCredentials: 'omit',
    openMailClientOnSubmit: false,
    sseReconnectDelayMs: 3000
  };
})();
