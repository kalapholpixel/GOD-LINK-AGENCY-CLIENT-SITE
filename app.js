const DEFAULT_CONTENT = window.siteContent || {};

const DEFAULT_CONTENT_API_URL = 'https://admin-api.godlinkproperties.com/api/data';
const DEFAULT_EVENTS_URL = 'https://admin-api.godlinkproperties.com/api/events';

const ADMIN_CONTENT_STORAGE_KEYS = [
  'godLinkSiteContent',
  'godLinkAdminContent',
  'siteContent',
  'adminSiteContent'
];

const ADMIN_PROPERTIES_STORAGE_KEYS = [
  'godLinkProperties',
  'godLinkListings',
  'properties',
  'listings'
];

const ENQUIRY_EMAIL = 'godlinkagency@gmail.com';
const ENQUIRY_QUEUE_KEY = 'godLinkEnquiries';

const DEFAULT_SITE_CONFIG = {
  adminDomain: '',
  adminDataUrl: '',
  adminEventsUrl: '',
  enquiryEndpoint: '',
  adminApiKey: '',
  adminAuthToken: '',
  allowedAdminOrigins: [],
  sseReconnectDelayMs: 3000,
  openMailClientOnSubmit: false,
  requestCredentials: 'omit'
};

const state = {
  content: { ...DEFAULT_CONTENT },
  properties: []
};

let contentRefreshPromise = null;
let eventSource = null;
let eventReconnectTimer = null;

function getSiteConfig() {
  return {
    ...DEFAULT_SITE_CONFIG,
    ...(window.siteContentConfig || {})
  };
}

function sanitizeUrl(url) {
  return typeof url === 'string' ? url.trim() : '';
}

function buildAbsoluteUrl(url, fallbackBase) {
  const safeUrl = sanitizeUrl(url);
  const safeBase = sanitizeUrl(fallbackBase);
  if (!safeUrl) return '';

  try {
    return new URL(safeUrl, safeBase || window.location.origin).toString();
  } catch (error) {
    console.warn('Invalid URL in site config.', error);
    return '';
  }
}

function getAdminOrigin() {
  const config = getSiteConfig();
  const adminDomain = sanitizeUrl(config.adminDomain);
  if (!adminDomain) return '';

  try {
    return new URL(adminDomain).origin;
  } catch (error) {
    return '';
  }
}

function getAllowedAdminOrigins() {
  const config = getSiteConfig();
  const configured = Array.isArray(config.allowedAdminOrigins) ? config.allowedAdminOrigins : [];
  const explicit = configured
    .map((origin) => sanitizeUrl(origin))
    .filter(Boolean);
  const adminOrigin = getAdminOrigin();

  return adminOrigin && !explicit.includes(adminOrigin)
    ? [...explicit, adminOrigin]
    : explicit;
}

function isAllowedAdminOrigin(origin) {
  const allowedOrigins = getAllowedAdminOrigins();
  if (!allowedOrigins.length) return true;
  return allowedOrigins.includes(origin);
}

function getAdminRequestHeaders(extraHeaders) {
  const config = getSiteConfig();
  const headers = {
    Accept: 'application/json',
    ...(extraHeaders || {})
  };

  if (config.adminApiKey) {
    headers['x-api-key'] = config.adminApiKey;
  }
  if (config.adminAuthToken) {
    headers.Authorization = `Bearer ${config.adminAuthToken}`;
  }

  return headers;
}

function getContent() {
  return state.content || {};
}

function getProperties() {
  return state.properties || [];
}

function parseStoredJson(raw) {
  if (!raw || typeof raw !== 'string') return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Ignoring invalid JSON from storage.', error);
    return null;
  }
}

function readStorageValue(keys) {
  for (const key of keys) {
    const fromLocal = parseStoredJson(window.localStorage?.getItem(key));
    if (fromLocal) return fromLocal;
    const fromSession = parseStoredJson(window.sessionStorage?.getItem(key));
    if (fromSession) return fromSession;
  }
  return null;
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeProperty(property, index) {
  const fallbackId = index + 1;
  const image = property?.image || toArray(property?.gallery)[0] || '';
  const features = toArray(property?.features);

  return {
    id: property?.id ?? fallbackId,
    image,
    gallery: toArray(property?.gallery).length ? toArray(property?.gallery) : (image ? [image] : []),
    type: property?.type || 'Residential',
    title: property?.title || 'Property listing',
    location: property?.location || 'Location unavailable',
    price: property?.price || 'Price on request',
    status: property?.status || 'Available',
    beds: property?.beds ?? null,
    baths: property?.baths ?? null,
    area: property?.area || '',
    parking: property?.parking || '',
    desc: property?.desc || 'Details will be shared during viewing.',
    features: features.length ? features : ['Details shared on request']
  };
}

function extractContentPayload(payload) {
  if (!payload || typeof payload !== 'object') return null;
  if (payload.siteContent && typeof payload.siteContent === 'object') return payload.siteContent;
  if (payload.data && typeof payload.data === 'object') return payload.data;
  return payload;
}

function getContentApiUrl() {
  const params = new URLSearchParams(window.location.search);
  const config = getSiteConfig();

  return sanitizeUrl(params.get('adminDataUrl') || config.adminDataUrl || DEFAULT_CONTENT_API_URL);
}

function getEventsApiUrl() {
  const params = new URLSearchParams(window.location.search);
  const config = getSiteConfig();

  return sanitizeUrl(params.get('adminEventsUrl') || config.adminEventsUrl || DEFAULT_EVENTS_URL);
}

function getEnquiryEndpoint() {
  const params = new URLSearchParams(window.location.search);
  const config = getSiteConfig();
  const adminOrigin = getAdminOrigin();

  const rawUrl = (
    params.get('enquiryEndpoint')
    || config.enquiryEndpoint
    || window.localStorage?.getItem('godLinkEnquiryEndpoint')
    || window.sessionStorage?.getItem('godLinkEnquiryEndpoint')
    || ''
  );

  return buildAbsoluteUrl(rawUrl, adminOrigin);
}

function shouldOpenMailClientOnSubmit() {
  const params = new URLSearchParams(window.location.search);
  const fromParam = params.get('openMailClientOnSubmit');
  if (fromParam === 'true') return true;
  if (fromParam === 'false') return false;

  return Boolean(getSiteConfig().openMailClientOnSubmit);
}

function getSseReconnectDelayMs() {
  const configValue = Number(getSiteConfig().sseReconnectDelayMs);
  if (!Number.isFinite(configValue) || configValue < 1000) {
    return 3000;
  }
  return configValue;
}

async function fetchJson(url, options) {
  const config = getSiteConfig();
  const response = await fetch(url, {
    cache: 'no-store',
    credentials: config.requestCredentials || 'omit',
    ...(options || {})
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return {};
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return {};
  }

  return response.json();
}

function validateIntegrationConfig() {
  const config = getSiteConfig();
  const adminUrl = getContentApiUrl();
  const eventsUrl = getEventsApiUrl();
  const enquiryUrl = getEnquiryEndpoint();

  if (!config.adminDomain) {
    console.warn('Integration warning: adminDomain is not configured in site-config.js');
  }
  if (!adminUrl) {
    console.warn('Integration warning: adminDataUrl is missing; site content cannot load.');
  }
  if (!eventsUrl) {
    console.warn('Integration warning: adminEventsUrl is missing; live content updates are disabled.');
  }
  if (!enquiryUrl) {
    console.warn('Integration warning: enquiryEndpoint is missing; enquiries will be queued locally.');
  }
}

async function loadAdminContentFromApi() {
  const url = getContentApiUrl();
  if (!url) return null;

  try {
    const payload = await fetchJson(url, {
      method: 'GET',
      headers: getAdminRequestHeaders()
    });
    return extractContentPayload(payload);
  } catch (error) {
    console.warn('Unable to fetch admin content.', error);
    return null;
  }
}

function syncAppState() {
  const safeContent = state.content && typeof state.content === 'object' ? state.content : {};
  const normalized = toArray(safeContent.properties).map(normalizeProperty);

  state.content = {
    ...DEFAULT_CONTENT,
    ...safeContent,
    properties: normalized
  };
  state.properties = normalized;

  window.siteContent = state.content;
}

function setAppContent(adminContent) {
  if (adminContent && typeof adminContent === 'object') {
    state.content = {
      ...DEFAULT_CONTENT,
      ...extractContentPayload(adminContent)
    };
  } else {
    state.content = { ...DEFAULT_CONTENT };
  }

  syncAppState();
}

async function bootstrapContent() {
  const apiContent = await loadAdminContentFromApi();
  setAppContent(apiContent || DEFAULT_CONTENT);
}

function applyAdminContentUpdate(payload) {
  const incoming = extractContentPayload(payload);
  if (!incoming || typeof incoming !== 'object') return;

  setAppContent({
    ...getContent(),
    ...incoming
  });

  renderAll();
}

async function refreshContent(renderAfterUpdate) {
  if (contentRefreshPromise) {
    await contentRefreshPromise;
    if (renderAfterUpdate) renderAll();
    return;
  }

  contentRefreshPromise = (async () => {
    const latest = await loadAdminContentFromApi();
    if (latest) {
      setAppContent(latest);
      if (renderAfterUpdate) renderAll();
    }
  })();

  try {
    await contentRefreshPromise;
  } finally {
    contentRefreshPromise = null;
  }
}

function scheduleEventReconnect() {
  if (eventReconnectTimer) return;

  eventReconnectTimer = window.setTimeout(() => {
    eventReconnectTimer = null;
    initAdminContentSync();
  }, getSseReconnectDelayMs());
}

function initAdminContentSync() {
  const url = getEventsApiUrl();
  if (!url || typeof window.EventSource !== 'function') return;

  if (eventSource) {
    eventSource.close();
  }

  eventSource = new EventSource(url, { withCredentials: getSiteConfig().requestCredentials === 'include' });

  eventSource.addEventListener('content-updated', () => {
    refreshContent(true);
  });

  eventSource.onmessage = (event) => {
    if ((event.data || '').trim() === 'content-updated') {
      refreshContent(true);
    }
  };

  eventSource.onerror = () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    scheduleEventReconnect();
  };
}

function createCard(property) {
  return `
    <article class="listing-card">
      <div class="thumb">
        <img src="${property.image}" alt="${property.title}" loading="lazy" />
      </div>
      <div class="body">
        <div class="tag">${property.type}</div>
        <div class="price">${property.price}</div>
        <div class="title">${property.title}</div>
        <div class="meta">${property.location}</div>
        <a class="btn btn-outline" href="property.html?id=${property.id}">View details</a>
      </div>
    </article>
  `;
}

function renderFeaturedProperties() {
  const container = document.getElementById('featured-grid');
  if (!container) return;
  const properties = getProperties();
  container.innerHTML = properties.slice(0, 3).map(createCard).join('');
}

function renderListings() {
  const container = document.getElementById('property-grid');
  const count = document.getElementById('listing-count');
  if (!container) return;

  const filter = document.querySelector('.filter-btn.active')?.dataset.filter || 'All';
  const properties = getProperties();
  const filtered = filter === 'All' ? properties : properties.filter((item) => item.type === filter);
  container.innerHTML = filtered.map(createCard).join('');
  if (count) count.textContent = `${filtered.length} listing${filtered.length === 1 ? '' : 's'}`;
}

function renderFilters() {
  const container = document.getElementById('filter-bar');
  if (!container) return;

  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'All';

  const categories = getContent().propertyCategories || [
    { value: 'All', label: 'All' },
    { value: 'Residential', label: 'Residential' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Land', label: 'Land' }
  ];

  container.innerHTML = categories.map((category, index) => `
    <button class="filter-btn ${(activeFilter === category.value || (!activeFilter && index === 0)) ? 'active' : ''}" data-filter="${category.value}">${category.label}</button>
  `).join('') + '<span id="listing-count">0 listings</span>';

  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      renderListings();
    });
  });
}

function renderPropertyPage() {
  const container = document.getElementById('property-details');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const properties = getProperties();
  const selected = properties.find((item) => String(item.id) === params.get('id'));

  if (!selected) {
    container.innerHTML = '<p>Property not found.</p>';
    return;
  }

  const gallery = selected.gallery || [selected.image];
  const slides = gallery.map((src, index) => `
    <div class="gallery-slide${index === 0 ? ' active' : ''}" data-index="${index}">
      <img src="${src}" alt="${selected.title} photo ${index + 1}" />
    </div>
  `).join('');

  const thumbnails = gallery.map((src, index) => `
      <button class="gallery-thumb${index === 0 ? ' active' : ''}" data-index="${index}" aria-label="View photo ${index + 1}">
        <img src="${src}" alt="Thumbnail ${index + 1}" />
      </button>
  `).join('');

  container.innerHTML = `
    <div class="detail-card">
      <div class="gallery">
        <div class="gallery-slides">${slides}</div>
        <div class="gallery-controls">
          <button class="gallery-prev" type="button" aria-label="Previous photo">‹</button>
          <button class="gallery-next" type="button" aria-label="Next photo">›</button>
        </div>
        <div class="gallery-thumbs">${thumbnails}</div>
      </div>
      <div class="body">
        <div class="tag">${selected.type}</div>
        <h1>${selected.title}</h1>
        <div class="meta">${selected.location}</div>
        <p>${selected.desc}</p>
        <div class="specs">
          ${selected.beds ? `<span class="spec-chip">${selected.beds} beds</span>` : ''}
          ${selected.baths ? `<span class="spec-chip">${selected.baths} baths</span>` : ''}
          ${selected.area ? `<span class="spec-chip">${selected.area}</span>` : ''}
          ${selected.parking ? `<span class="spec-chip">${selected.parking}</span>` : ''}
        </div>
        <div class="section-title">Highlights</div>
        <ul>${(selected.features || []).map((feature) => `<li>${feature}</li>`).join('')}</ul>
      </div>
    </div>
    <aside class="detail-card checkout-card">
      <div class="price">${selected.price}</div>
      <div class="status ${selected.status === 'Sold' ? 'sold' : 'available'}">${selected.status}</div>
      <a class="btn btn-primary" href="contact.html">Book a viewing</a>
    </aside>
  `;

  initGallery();
}

function initGallery() {
  const slides = document.querySelectorAll('.gallery-slide');
  const thumbs = document.querySelectorAll('.gallery-thumb');
  const prev = document.querySelector('.gallery-prev');
  const next = document.querySelector('.gallery-next');
  const gallery = document.querySelector('.gallery');
  if (!slides.length || !thumbs.length || !prev || !next || !gallery) return;

  let current = 0;
  let startX = 0;
  let isTouching = false;

  const updateGallery = (index) => {
    current = index;
    slides.forEach((slide) => slide.classList.toggle('active', Number(slide.dataset.index) === index));
    thumbs.forEach((thumb) => thumb.classList.toggle('active', Number(thumb.dataset.index) === index));
  };

  const changeSlide = (offset) => {
    const nextIndex = (current + offset + slides.length) % slides.length;
    updateGallery(nextIndex);
  };

  prev.addEventListener('click', () => changeSlide(-1));
  next.addEventListener('click', () => changeSlide(1));
  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => updateGallery(Number(thumb.dataset.index)));
  });

  gallery.addEventListener('touchstart', (event) => {
    isTouching = true;
    startX = event.touches[0].clientX;
  }, { passive: true });

  gallery.addEventListener('touchmove', (event) => {
    if (!isTouching) return;
    const currentX = event.touches[0].clientX;
    const diff = currentX - startX;
    if (Math.abs(diff) > 40) {
      changeSlide(diff < 0 ? 1 : -1);
      isTouching = false;
    }
  }, { passive: true });

  gallery.addEventListener('touchend', () => {
    isTouching = false;
  });
}

function renderTheme() {
  const theme = getContent().theme;
  if (!theme) return;
  const root = document.documentElement;
  const aliases = {
    'ink-2': theme.ink2,
    'paper-2': theme.paper2,
    'paper-3': theme.paper3,
    gold: theme.primary,
    'gold-soft': theme.primarySoft,
    green: theme.success,
    'green-soft': theme.successSoft,
    red: theme.danger,
    'red-soft': theme.dangerSoft,
    background: theme.background,
    overlay: theme.overlay,
    'overlay-light': theme.overlayLight,
    shadow: theme.shadow
  };

  Object.entries(theme).forEach(([key, value]) => {
    if (value) root.style.setProperty(`--${key}`, value);
  });
  Object.entries(aliases).forEach(([key, value]) => {
    if (value) root.style.setProperty(`--${key}`, value);
  });
}

function renderLogo() {
  const content = getContent();
  const brand = document.querySelector('.brand');
  if (!brand) return;

  if (content.logo?.src) {
    brand.innerHTML = `
      <img class="brand-logo" src="${content.logo.src}" alt="${content.logo.alt || content.siteName}" />
      <span class="brand-text">${content.siteName || ''}</span>
    `;
    return;
  }

  brand.textContent = content.siteName || '';
}

function renderFooter() {
  const content = getContent();
  const footerBrand = document.querySelector('.site-footer strong');
  const footerNote = document.querySelector('.site-footer .footer-inner > div:first-child p');
  const footerCredit = document.querySelector('.site-footer .footer-credit');
  const footerEmail = document.querySelector('.site-footer .footer-inner > div:last-child p:nth-of-type(1)');
  const footerPhone = document.querySelector('.site-footer .footer-inner > div:last-child p:nth-of-type(2)');

  if (footerBrand) footerBrand.textContent = content.siteName || footerBrand.textContent;
  if (footerNote) footerNote.textContent = content.footer?.note || footerNote.textContent;
  if (footerCredit) footerCredit.textContent = content.footer?.credit || footerCredit.textContent;
  if (footerEmail) footerEmail.textContent = content.footer?.email || footerEmail.textContent;
  if (footerPhone) footerPhone.textContent = content.footer?.phone || footerPhone.textContent;
}

function renderPageMeta() {
  const content = getContent();
  const pathname = window.location.pathname.split('/').pop() || 'index.html';
  const pageKey = pathname === 'listings.html' ? 'listings' : pathname === 'contact.html' ? 'contact' : pathname === 'property.html' ? 'property' : 'home';
  const meta = content.pageMeta?.[pageKey] || {};

  document.title = meta.title || content.siteName || 'God Link Agency';

  let descriptionTag = document.querySelector('meta[name="description"]');
  if (!descriptionTag) {
    descriptionTag = document.createElement('meta');
    descriptionTag.setAttribute('name', 'description');
    document.head.appendChild(descriptionTag);
  }

  descriptionTag.setAttribute('content', meta.description || content.siteTagline || '');
}

function renderListingsPageContent() {
  const content = getContent();
  const title = document.querySelector('.page-title h1');
  const description = document.querySelector('.page-title p');

  if (title) title.textContent = content.pageMeta?.listings?.title || content.siteName || '';
  if (description) description.textContent = content.pageMeta?.listings?.description || content.siteTagline || '';
}

function renderHomePageContent() {
  const content = getContent();
  const heroCard = document.querySelector('.hero-card');
  if (!heroCard) return;

  const heroTitle = document.querySelector('.hero-copy h1');
  const heroDesc = document.querySelector('.hero-copy p');
  const heroEyebrow = document.querySelector('.eyebrow');
  const statPills = document.querySelectorAll('.stat-pill');
  const reasons = document.querySelector('.feature-grid');

  if (heroTitle) heroTitle.textContent = content.hero?.title || '';
  if (heroDesc) heroDesc.textContent = content.hero?.description || content.siteTagline || '';
  if (heroEyebrow) heroEyebrow.textContent = content.hero?.eyebrow || content.siteTagline || '';
  if (statPills.length) statPills.forEach((pill, index) => { pill.textContent = content.hero?.stats?.[index] || ''; });
  if (reasons) {
    reasons.innerHTML = (content.reasons || []).map((item) => `
      <article class="feature-card">
        <div class="icon">${item.icon}</div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </article>
    `).join('');
  }
  heroCard.innerHTML = `
      <img src="${content.hero?.image || ''}" alt="${content.hero?.highlightTitle || content.siteName || 'Featured property'}" />
      <div class="hero-card-body">
        <h3>${content.hero?.highlightTitle || ''}</h3>
        <p>${content.hero?.highlightCopy || ''}</p>
      </div>
    `;
}

function renderContactPageContent() {
  const content = getContent();
  const contactCard = document.querySelector('.contact-card');
  if (!contactCard) return;

  const heroTitle = document.querySelector('.hero-copy h1');
  const heroDesc = document.querySelector('.hero-copy p');
  const heroEyebrow = document.querySelector('.eyebrow');

  if (heroEyebrow) heroEyebrow.textContent = content.contact?.heading || '';
  if (heroTitle) heroTitle.textContent = content.contact?.heading || '';
  if (heroDesc) heroDesc.textContent = content.contact?.description || '';
}

function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  const setOpen = (isOpen) => {
    links.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  };

  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    setOpen(!links.classList.contains('open'));
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      setOpen(false);
    });
  });

  document.addEventListener('click', (event) => {
    if (!links.contains(event.target) && event.target !== toggle) {
      setOpen(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 800) {
      setOpen(false);
    }
  });
}

function pushEnquiryToLocalQueue(payload) {
  const currentQueue = getQueuedEnquiries();
  currentQueue.push({
    ...payload,
    queueId: payload.queueId || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    retries: Number(payload.retries || 0),
    lastAttemptAt: payload.lastAttemptAt || null
  });
  saveQueuedEnquiries(currentQueue);
}

function getQueuedEnquiries() {
  const existing = parseStoredJson(window.localStorage?.getItem(ENQUIRY_QUEUE_KEY));
  return Array.isArray(existing) ? existing : [];
}

function saveQueuedEnquiries(queue) {
  window.localStorage?.setItem(ENQUIRY_QUEUE_KEY, JSON.stringify(queue));
}

function buildEnquiryMailtoLink(payload) {
  const subject = `Property enquiry from ${payload.name}`;
  const body = [
    'Hello God Link Agency,',
    '',
    'A new enquiry was submitted with the following details:',
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email}`,
    '',
    'Message:',
    payload.message,
    '',
    `Submitted at: ${payload.createdAt}`,
    `Page: ${payload.page}`
  ].join('\n');

  return `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function openEnquiryMailClient(payload) {
  const mailtoLink = buildEnquiryMailtoLink(payload);
  window.location.href = mailtoLink;
}

async function sendEnquiryToApi(payload) {
  const endpoint = getEnquiryEndpoint();
  if (!endpoint) return { ok: false, queued: true };

  await fetchJson(endpoint, {
    method: 'POST',
    headers: getAdminRequestHeaders({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(payload)
  });

  return { ok: true, queued: false };
}

async function submitEnquiry(payload) {
  const shouldOpenMail = shouldOpenMailClientOnSubmit();
  if (shouldOpenMail) {
    openEnquiryMailClient(payload);
  }

  try {
    return await sendEnquiryToApi(payload);
  } catch (error) {
    pushEnquiryToLocalQueue({
      ...payload,
      retries: Number(payload.retries || 0) + 1,
      lastAttemptAt: new Date().toISOString()
    });
    return { ok: false, queued: true, error };
  }
}

async function flushQueuedEnquiries() {
  const queue = getQueuedEnquiries();
  if (!queue.length) return;

  const remaining = [];
  for (const enquiry of queue) {
    try {
      const result = await sendEnquiryToApi(enquiry);
      if (!result.ok) {
        remaining.push(enquiry);
      }
    } catch (error) {
      remaining.push({
        ...enquiry,
        retries: Number(enquiry.retries || 0) + 1,
        lastAttemptAt: new Date().toISOString()
      });
    }
  }

  saveQueuedEnquiries(remaining);
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('contact-feedback');
  if (!form || !feedback) return;

  const submitButton = form.querySelector('button[type="submit"]');

  const setFeedback = (message, type) => {
    feedback.textContent = message;
    feedback.className = `form-feedback ${type}`;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      createdAt: new Date().toISOString(),
      page: window.location.href
    };

    if (!payload.name || !payload.phone || !payload.email || !payload.message) {
      setFeedback('Please fill in all required fields before submitting.', 'error');
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    try {
      const result = await submitEnquiry(payload);
      if (result.ok && !result.queued) {
        setFeedback('Thank you. Your enquiry has been sent successfully.', 'success');
      } else {
        setFeedback('Thank you. Your enquiry has been received and we will contact you shortly.', 'success');
      }
      form.reset();
    } catch (error) {
      console.error(error);
      pushEnquiryToLocalQueue(payload);
      setFeedback('We are processing your enquiry. If you do not hear back soon, please contact us directly.', 'warning');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send enquiry';
      }
    }
  });
}

function renderAll() {
  renderPageMeta();
  renderTheme();
  renderLogo();
  renderFooter();
  renderHomePageContent();
  renderListingsPageContent();
  renderContactPageContent();
  renderFeaturedProperties();
  renderFilters();
  renderListings();
  renderPropertyPage();
}

window.addEventListener('DOMContentLoaded', async () => {
  validateIntegrationConfig();
  await bootstrapContent();
  initAdminContentSync();
  renderAll();
  initContactForm();
  initMobileMenu();
  await flushQueuedEnquiries();
});

window.addEventListener('online', () => {
  flushQueuedEnquiries();
});
