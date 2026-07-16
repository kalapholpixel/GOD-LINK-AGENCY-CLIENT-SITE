(function setupSiteConfig() {
  const apiDomain = 'https://godlinkproperties.com';

  window.siteContentConfig = {
    adminDomain: apiDomain,
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
