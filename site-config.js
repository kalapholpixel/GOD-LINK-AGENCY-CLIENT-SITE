(function setupSiteConfig() {
  const apiDomain = 'https://admin-api.godlinkproperties.com';

  window.siteContentConfig = {
    adminDataUrl: `${apiDomain}/api/public/site-content.php`,
    adminEventsUrl: '',
    enquiryEndpoint: `${apiDomain}/api/public/enquiries.php`,
    adminApiKey: '',
    adminAuthToken: '',
    requestCredentials: 'omit',
    openMailClientOnSubmit: false,
    sseReconnectDelayMs: 3000
  };
})();
