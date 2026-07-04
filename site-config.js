(function setupSiteConfig() {
  const adminDomain = 'https://glinkadmin.netlify.app';
  const apiDomain = 'https://admin-api.godlinkproperties.com';

  window.siteContentConfig = {
    adminDomain,

    adminDataUrl: `${apiDomain}/api/data`,

    adminEventsUrl: `${apiDomain}/api/events`,

    enquiryEndpoint: `${apiDomain}/api/enquiries`,

    adminApiKey: '',
    adminAuthToken: '',

    allowedAdminOrigins: [adminDomain],

    sseReconnectDelayMs: 3000,

    openMailClientOnSubmit: false,

    requestCredentials: 'omit'
  };
})();
