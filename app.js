const DEFAULT_CONTENT = window.siteContent || { properties: [] };

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

const state = {
  content: { ...DEFAULT_CONTENT },
  properties: []
};

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

function getAdminApiUrl() {
  const params = new URLSearchParams(window.location.search);
  const config = window.siteContentConfig || {};
  return (
    params.get('adminDataUrl')
    || config.adminDataUrl
    || window.localStorage?.getItem('godLinkAdminDataUrl')
    || window.sessionStorage?.getItem('godLinkAdminDataUrl')
    || ''
  );
}

async function loadAdminContentFromApi() {
  const url = getAdminApiUrl();
  if (!url) return null;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.warn(`Admin data request failed with status ${response.status}.`);
      return null;
    }

    const payload = await response.json();
    return extractContentPayload(payload);
  } catch (error) {
    console.warn('Unable to fetch admin content. Falling back to local data.', error);
    return null;
  }
}

function loadAdminContentFromStorage() {
  const contentPayload = readStorageValue(ADMIN_CONTENT_STORAGE_KEYS);
  const propertiesPayload = readStorageValue(ADMIN_PROPERTIES_STORAGE_KEYS);

  if (!contentPayload && !propertiesPayload) return null;

  const extractedContent = extractContentPayload(contentPayload) || {};
  const extractedProperties = toArray(propertiesPayload?.properties || propertiesPayload);

  if (!toArray(extractedContent.properties).length && extractedProperties.length) {
    extractedContent.properties = extractedProperties;
  }

  return extractedContent;
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
  const storageContent = loadAdminContentFromStorage();
  setAppContent(apiContent || storageContent || DEFAULT_CONTENT);
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

function initAdminContentSync() {
  window.addEventListener('storage', (event) => {
    if (!event.key) return;
    if (!ADMIN_CONTENT_STORAGE_KEYS.includes(event.key) && !ADMIN_PROPERTIES_STORAGE_KEYS.includes(event.key)) return;

    const latest = loadAdminContentFromStorage();
    if (latest) applyAdminContentUpdate(latest);
  });

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || typeof data !== 'object') return;
    if (data.type !== 'GOD_LINK_SITE_CONTENT_UPDATED') return;

    applyAdminContentUpdate(data.payload || data.siteContent);
  });

  if (window.BroadcastChannel) {
    const channel = new BroadcastChannel('god-link-admin');
    channel.addEventListener('message', (event) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type !== 'site-content-updated') return;
      applyAdminContentUpdate(data.payload || data.siteContent);
    });
  }
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

  const categories = getContent().propertyCategories || [
    { value: 'All', label: 'All' },
    { value: 'Residential', label: 'Residential' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Land', label: 'Land' }
  ];

  container.innerHTML = categories.map((category, index) => `
    <button class="filter-btn ${index === 0 ? 'active' : ''}" data-filter="${category.value}">${category.label}</button>
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
  if (!brand || !content.logo?.src) return;

  brand.innerHTML = `
    <img class="brand-logo" src="${content.logo.src}" alt="${content.logo.alt || content.siteName}" />
    <span class="brand-text">${content.siteName}</span>
  `;
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

  document.title = `${content.siteName || 'God Link Agency'}${meta.title ? ` | ${meta.title}` : ''}`;

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

  if (title) title.textContent = content.pageMeta?.listings?.title || title.textContent;
  if (description) description.textContent = content.pageMeta?.listings?.description || content.siteTagline || description.textContent;
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

  if (heroTitle) heroTitle.innerHTML = content.hero?.title?.replace('the right next step', '<span>the right next step</span>') || heroTitle.innerHTML;
  if (heroDesc) heroDesc.textContent = content.hero?.description || content.siteTagline || heroDesc.textContent;
  if (heroEyebrow) heroEyebrow.textContent = content.hero?.eyebrow || content.siteTagline || heroEyebrow.textContent;
  if (statPills.length) statPills.forEach((pill, index) => { pill.textContent = content.hero?.stats?.[index] || pill.textContent; });
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
      <img src="${content.hero?.image || ''}" alt="Featured property" />
      <div class="hero-card-body">
        <h3>${content.hero?.highlightTitle || 'What makes us different'}</h3>
        <p>${content.hero?.highlightCopy || 'A calm, spacious residence in East Legon with a garden, modern kitchen, and excellent security.'}</p>
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

  if (heroEyebrow) heroEyebrow.textContent = content.contact?.heading || heroEyebrow.textContent;
  if (heroTitle) heroTitle.textContent = content.contact?.heading || heroTitle.textContent;
  if (heroDesc) heroDesc.textContent = content.contact?.description || heroDesc.textContent;
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
  const key = 'godLinkEnquiries';
  const existing = parseStoredJson(window.localStorage?.getItem(key));
  const queue = Array.isArray(existing) ? existing : [];
  queue.push(payload);
  window.localStorage?.setItem(key, JSON.stringify(queue));
}

function getEnquiryEndpoint() {
  const params = new URLSearchParams(window.location.search);
  const config = window.siteContentConfig || {};
  return (
    params.get('enquiryEndpoint')
    || config.enquiryEndpoint
    || window.localStorage?.getItem('godLinkEnquiryEndpoint')
    || window.sessionStorage?.getItem('godLinkEnquiryEndpoint')
    || ''
  );
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

async function submitEnquiry(payload) {
  openEnquiryMailClient(payload);

  const endpoint = getEnquiryEndpoint();
  if (!endpoint) {
    pushEnquiryToLocalQueue(payload);
    return { ok: true, queued: true };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Enquiry request failed with status ${response.status}`);
  }

  return { ok: true, queued: false };
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
      if (result.queued) {
        setFeedback('Thank you. Your enquiry has been received and we will contact you shortly.', 'success');
      } else {
        setFeedback('Thank you. Your enquiry has been sent successfully.', 'success');
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
  await bootstrapContent();
  initAdminContentSync();
  renderAll();
  initContactForm();
  initMobileMenu();
});
