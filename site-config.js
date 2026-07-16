(function setupSiteConfig() {
  const apiDomain = 'https://godlinkproperties.com/admin';

  window.siteContentConfig = {
    adminDomain: apiDomain,
    adminDataUrl: `${apiDomain}/api/public/site-content.php`,
    adminEventsUrl: `${apiDomain}/api/events`,
    enquiryEndpoint: `${apiDomain}/api/public/enquiries.php`,
    adminApiKey: '',
    adminAuthToken: '',
    requestCredentials: 'omit',
    openMailClientOnSubmit: false,
    sseReconnectDelayMs: 3000
  };
})();
