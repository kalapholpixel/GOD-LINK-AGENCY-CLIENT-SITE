const DEFAULT_CONTENT = window.siteContent || {
  siteName: 'God Link Agency',
  siteTagline: 'Premium property sales across Ghana',
  pageMeta: {
    home: { title: 'Premium Property Sales', description: 'Premium property sales across Ghana' },
    listings: { title: 'Properties', description: 'Explore homes, commercial spaces, and land opportunities that are ready for viewing and investment.' },
    contact: { title: 'Contact', description: 'Share a few details and we\'ll get in touch with available times, guidance, and the best next step.' },
    property: { title: 'Property Details', description: 'View full details, photos, and next steps for this property.' }
  },
  logo: { src: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=256&q=80', alt: 'God Link Agency logo' },
  theme: { ink: '#171717', ink2: '#57534e', paper: '#f8f5eb', paper2: '#efe8d8', paper3: '#e1d8c2', primary: '#b8890e', primarySoft: '#f8ebc8', success: '#1d6b44', successSoft: '#e0f5eb', danger: '#a23c3c', dangerSoft: '#fbeaea', background: '#fcfbf7', overlay: 'rgba(248, 245, 235, 0.9)', overlayLight: 'rgba(255,255,255,0.88)', shadow: '0 12px 30px rgba(252, 235, 235, 0.08)' },
  hero: { eyebrow: 'Premium real estate in Ghana', title: 'Find a home, office, or land investment that feels like the right next step.', description: 'We curate premium properties with a focus on location, quality, and long-term value so buying or investing feels calm and confident.', stats: ['8+ active listings', '3 property types', '5+ years of trust'], image: 'images/WhatsApp Image 2026-06-27 at 11.49.13 AM (2).jpeg', highlightTitle: 'Featured viewing this week', highlightCopy: 'A calm, spacious residence in East Legon with a garden, modern kitchen, and excellent security.' },
  reasons: [{ icon: '🏘️', title: 'Curated inventory', description: 'We show only properties that genuinely match the client\'s goals, budget, and lifestyle.' }, { icon: '🧭', title: 'Local insight', description: 'Our team understands the neighborhoods, amenities, and investment potential that matter.' }, { icon: '🤝', title: 'Personal support', description: 'From first enquiry to closing, we make the experience clear and easy to navigate.' }],
  contact: { heading: 'Let\'s arrange a viewing', description: 'Share a few details and we\'ll get in touch with available times, guidance, and the best next step.' },
  footer: { email: 'info@godlinkagency.com', phone: '+233 24 342 8752', note: 'Premium property sales across Ghana.', credit: 'Created by KL STUDIOS' },
  propertyCategories: [{ value: 'All', label: 'All' }, { value: 'Residential', label: 'Residential' }, { value: 'Commercial', label: 'Commercial' }, { value: 'Land', label: 'Land' }, { value: 'Luxury', label: 'Luxury' }, { value: 'Shortlet', label: 'Shortlet' }],
  properties: [
    { id: 1, image: 'images/1.jpeg', gallery: ['images/WhatsApp Image 2026-06-27 at 11.49.08 AM (1).jpeg', 'images/WhatsApp Image 2026-06-27 at 11.49.08 AM.jpeg', 'images/WhatsApp Image 2026-06-27 at 11.49.09 AM (1).jpeg', 'images/WhatsApp Image 2026-06-27 at 11.49.09 AM (2).jpeg', 'images/WhatsApp Image 2026-06-27 at 11.49.10 AM (2).jpeg', 'images/WhatsApp Image 2026-06-27 at 11.49.10 AM.jpeg', 'images/WhatsApp Image 2026-06-27 at 11.49.11 AM (2).jpeg', 'images/WhatsApp Image 2026-06-27 at 11.49.11 AM.jpeg', 'images/WhatsApp Image 2026-06-27 at 11.49.15 AM (1).jpeg', 'images/WhatsApp Image 2026-06-27 at 11.49.15 AM (2).jpeg', 'images/WhatsApp Image 2026-06-27 at 11.49.16 AM (2).jpeg'], type: 'Residential', title: '3-bedroom apartment', location: 'Airport', price: '$2,000/mo', status: 'Available', beds: 3, baths: 2, area: '', parking: '', desc: 'A polished apartment in a gated estate with a garden, modern kitchen, and security throughout.', features: ['Gated community', '24/7 security', 'Backup generator', 'Solar-ready'] },
    { id: 2, image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80', gallery: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1515165562835-cfdb7b42d6bd?auto=format&fit=crop&w=1200&q=80'], type: 'Commercial', title: 'Airport City Office Space', location: 'Airport City, Accra', price: '$1,750 / mo', status: 'Available', beds: null, baths: 2, area: '320 sqm', parking: '10 cars', desc: 'A premium office floor with fibre, conference rooms, and immediate access to the city\'s business hub.', features: ['Fibre internet', 'Conference room', 'Reception', 'CCTV'] },
    { id: 3, image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', gallery: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1516900557540-10b1cce2840b?auto=format&fit=crop&w=1200&q=80'], type: 'Land', title: 'Half-Acre Residential Plot', location: 'Adenta, Accra', price: '$41,000', status: 'Available', beds: null, baths: null, area: '0.5 acre', parking: null, desc: 'A titled plot in a fast-developing community, perfect for a modern residence or investment.', features: ['Titled land', 'Road access', 'Water connection', 'Ready documentation'] },
    { id: 4, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', gallery: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80'], type: 'Residential', title: '2-Bedroom Apartment', location: 'Cantonments, Accra', price: '$91,000', status: 'Available', beds: 2, baths: 2, area: '105 sqm', parking: '1 car', desc: 'A refined apartment with built-in wardrobes, a private balcony, and a calm residential setting.', features: ['Private balcony', 'Gym', 'Swimming pool', 'Concierge'] },
    { id: 5, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', gallery: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1533106418980-9314f6c5c140?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1531996356976-9e5d4d4ad391?auto=format&fit=crop&w=1200&q=80'], type: 'Commercial', title: 'Retail Shop — Ground Floor', location: 'Osu, Accra', price: '$1,200 / mo', status: 'Available', beds: null, baths: 1, area: '75 sqm', parking: '2 cars', desc: 'High footfall retail space in Osu with a glass frontage and excellent visibility.', features: ['High visibility', 'Storage room', 'Air conditioning', 'Signage ready'] },
    { id: 6, image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80', gallery: ['https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1509587584298-0da20e1c1ed0?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'], type: 'Land', title: '2-Acre Agricultural Land', location: 'Dodowa, Greater Accra', price: '$26,000', status: 'Available', beds: null, baths: null, area: '2 acres', parking: null, desc: 'A productive parcel of land ideal for agribusiness, farming, or future development.', features: ['Fertile soil', 'Stream access', 'Road access', 'Investment potential'] }
  ]
};

const DEFAULT_CONTENT_API_URL = '/api/public/site-content';
const DEFAULT_EVENTS_URL = '/api/events';
const FALLBACK_IMAGE_DATA_URI = "data:image/svg+xml," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'><rect width='1200' height='675' fill='#efe8d8'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Segoe UI, Arial, sans-serif' font-size='40' fill='#57534e'>Image unavailable</text></svg>");

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
const mediaPreloadCache = new Set();

function getSiteConfig() {
  return {
    ...DEFAULT_SITE_CONFIG,
    ...(window.siteContentConfig || {})
  };
}

function sanitizeUrl(url) {
  return typeof url === 'string' ? url.trim() : '';
}

function resolveOriginFromCandidates(candidates) {
  for (const candidate of candidates) {
    const safe = sanitizeUrl(candidate);
    if (!safe) continue;
    try {
      return new URL(safe, window.location.origin).origin;
    } catch (error) {
      continue;
    }
  }

  return '';
}

function resolveUrlFromCandidates(candidates) {
  for (const candidate of candidates) {
    const safe = sanitizeUrl(candidate);
    if (!safe) continue;
    try {
      return new URL(safe, window.location.origin);
    } catch (error) {
      continue;
    }
  }

  return null;
}

function joinPathSegments(...parts) {
  const clean = parts
    .map((part) => String(part || '').trim())
    .filter(Boolean)
    .map((part, index) => {
      if (index === 0) return part.replace(/\/+$/g, '');
      return part.replace(/^\/+|\/+$/g, '');
    })
    .filter(Boolean)
    .join('/');

  return clean.startsWith('/') ? clean : `/${clean}`;
}

function getAdminRuntimeUrl() {
  const config = getSiteConfig();
  const params = new URLSearchParams(window.location.search);

  return resolveUrlFromCandidates([
    params.get('adminDataUrl'),
    config.adminDataUrl,
    params.get('adminDomain'),
    config.adminDomain
  ]);
}

function getAdminBasePath() {
  const adminUrl = getAdminRuntimeUrl();
  if (!adminUrl) return '';

  const pathname = adminUrl.pathname || '/';
  const apiIndex = pathname.indexOf('/api');

  if (apiIndex >= 0) {
    const prefix = pathname.slice(0, apiIndex).replace(/\/+$/g, '');
    return prefix === '/' ? '' : prefix;
  }

  const trimmed = pathname.replace(/\/+$/g, '');
  return trimmed === '/' ? '' : trimmed;
}

function getMediaAssetOrigin() {
  const adminUrl = getAdminRuntimeUrl();
  return adminUrl ? adminUrl.origin : '';
}

function normalizeMediaUrl(url) {
  const clean = sanitizeUrl(url);
  if (!clean) return '';

  if (clean.startsWith('data:') || clean.startsWith('blob:')) {
    return clean;
  }

  if (/^https?:\/\//i.test(clean)) {
    try {
      const absolute = new URL(clean);
      const basePath = getAdminBasePath();
      const mediaOrigin = getMediaAssetOrigin();

      // Repair legacy absolute upload URLs that point to root /images/uploads
      // when admin is hosted under a subpath such as /admin.
      if (
        mediaOrigin
        && absolute.origin === mediaOrigin
        && absolute.pathname.startsWith('/images/uploads/')
        && basePath
        && !absolute.pathname.startsWith(`${basePath}/images/uploads/`)
      ) {
        absolute.pathname = joinPathSegments(basePath, absolute.pathname);
      }

      return absolute.toString();
    } catch (error) {
      return encodeURI(clean);
    }
  }

  // Preserve relative-path semantics while safely encoding spaces and symbols.
  const normalizedPath = clean.replace(/^\.\//, '').replace(/^\/+/, '');
  const encodedPath = encodeURI(normalizedPath);

  // Uploaded media paths are stored as images/uploads/... and should resolve to admin API origin.
  if (encodedPath.startsWith('images/uploads/')) {
    const mediaOrigin = getMediaAssetOrigin();
    if (mediaOrigin) {
      const basePath = getAdminBasePath();
      try {
        const target = new URL(mediaOrigin);
        target.pathname = joinPathSegments(basePath, encodedPath);
        return target.toString();
      } catch (error) {
        return joinPathSegments(basePath, encodedPath);
      }
    }
  }

  return encodedPath;
}

function escapeAttribute(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
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
  const params = new URLSearchParams(window.location.search);

  return resolveOriginFromCandidates([
    params.get('adminDomain'),
    config.adminDomain,
    params.get('adminDataUrl'),
    config.adminDataUrl
  ]);
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

function normalizeMediaList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || '').trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split('\n').map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function normalizeProperty(property, index) {
  const fallbackId = index + 1;
  const rawGallery = toArray(property?.gallery).map((item) => normalizeMediaUrl(item)).filter(Boolean);
  const image = normalizeMediaUrl(property?.image || rawGallery[0] || '');
  const features = toArray(property?.features);
  const videos = normalizeMediaList(property?.videos).map((item) => normalizeMediaUrl(item)).filter(Boolean);
  const video = normalizeMediaUrl(property?.video || property?.videoUrl || property?.videoSrc || videos[0] || '');

  return {
    id: property?.id ?? fallbackId,
    image,
    gallery: rawGallery.length ? rawGallery : (image ? [image] : []),
    video,
    videos,
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
  const hasVideo = Boolean(property.video || (property.videos && property.videos.length));
  const imageCandidates = [property.image, ...(property.gallery || [])].map((item) => normalizeMediaUrl(item)).filter(Boolean);
  const primaryImage = imageCandidates[0] || FALLBACK_IMAGE_DATA_URI;
  return `
    <article class="listing-card">
      <div class="thumb">
        <img src="${primaryImage}" alt="${property.title}" loading="lazy" data-media-fallback="${escapeAttribute(JSON.stringify(imageCandidates.slice(1)))}" />
      </div>
      <div class="body">
        <div class="tag">${property.type}</div>
        ${hasVideo ? '<div class="media-flag">Video tour</div>' : ''}
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

  const gallery = Array.from(new Set([selected.image, ...(selected.gallery || [])].map((item) => normalizeMediaUrl(item)).filter(Boolean)));
  const videoSources = Array.from(new Set([selected.video, ...(selected.videos || [])].map((item) => normalizeMediaUrl(item)).filter(Boolean)));
  preloadPropertyMedia(gallery, videoSources);
  const slides = gallery.map((src, index) => `
    <div class="gallery-slide${index === 0 ? ' active' : ''}" data-index="${index}">
      <img src="${src}" alt="${selected.title} photo ${index + 1}" loading="eager" data-media-fallback="${escapeAttribute(JSON.stringify(gallery.filter((_, i) => i !== index)))}" />
    </div>
  `).join('');

  const thumbnails = gallery.map((src, index) => `
      <button class="gallery-thumb${index === 0 ? ' active' : ''}" data-index="${index}" aria-label="View photo ${index + 1}">
        <img src="${src}" alt="Thumbnail ${index + 1}" loading="lazy" data-media-fallback="${escapeAttribute(JSON.stringify(gallery.filter((_, i) => i !== index)))}" />
      </button>
  `).join('');

  const videosMarkup = videoSources.length
    ? `
        <div class="section-title">Video tour${videoSources.length > 1 ? 's' : ''}</div>
        <div class="video-grid">
          ${videoSources.map((src, index) => `
            <div class="property-video-wrap">
              <video class="property-video" controls preload="metadata" playsinline>
                <source src="${src}" />
                Your browser does not support the video tag.
              </video>
              <span class="property-video-label">Video ${index + 1}</span>
            </div>
          `).join('')}
        </div>
      `
    : '';

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
        ${videosMarkup}
      </div>
    </div>
    <aside class="detail-card checkout-card">
      <div class="price">${selected.price}</div>
      <div class="status ${selected.status === 'Sold' ? 'sold' : 'available'}">${selected.status}</div>
      <a class="btn btn-primary" href="contact.html">Book a viewing</a>
    </aside>
  `;

  initGallery();
  initMediaResilience();
}

function parseFallbackList(raw) {
  try {
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed.map((item) => normalizeMediaUrl(item)).filter(Boolean) : [];
  } catch (error) {
    return [];
  }
}

function preloadImage(url) {
  const src = normalizeMediaUrl(url);
  if (!src || mediaPreloadCache.has(`img:${src}`)) return;

  mediaPreloadCache.add(`img:${src}`);
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
}

function preloadVideoMetadata(url) {
  const src = normalizeMediaUrl(url);
  if (!src || mediaPreloadCache.has(`video:${src}`)) return;

  mediaPreloadCache.add(`video:${src}`);
  const video = document.createElement('video');
  video.preload = 'metadata';
  video.muted = true;
  video.playsInline = true;
  video.src = src;
  video.load();
}

function preloadPropertyMedia(gallery, videoSources) {
  const firstImage = Array.isArray(gallery) ? gallery[0] : '';
  const secondImage = Array.isArray(gallery) ? gallery[1] : '';
  const firstVideo = Array.isArray(videoSources) ? videoSources[0] : '';

  preloadImage(firstImage);
  preloadImage(secondImage);
  preloadVideoMetadata(firstVideo);
}

function initMediaResilience() {
  document.querySelectorAll('img[data-media-fallback]').forEach((img) => {
    if (img.dataset.fallbackBound === '1') return;
    img.dataset.fallbackBound = '1';

    img.addEventListener('error', () => {
      const candidates = parseFallbackList(img.dataset.mediaFallback);
      if (candidates.length) {
        const next = candidates.shift();
        img.dataset.mediaFallback = JSON.stringify(candidates);
        img.src = next;
        return;
      }
      if (img.src !== FALLBACK_IMAGE_DATA_URI) {
        img.src = FALLBACK_IMAGE_DATA_URI;
      }
    });
  });

  document.querySelectorAll('.property-video').forEach((video) => {
    if (video.dataset.fallbackBound === '1') return;
    video.dataset.fallbackBound = '1';

    const source = video.querySelector('source');
    if (!source) return;
    const current = normalizeMediaUrl(source.getAttribute('src') || '');
    const siblings = Array.from(document.querySelectorAll('.property-video source'))
      .map((item) => normalizeMediaUrl(item.getAttribute('src') || ''))
      .filter(Boolean)
      .filter((item) => item !== current);

    video.dataset.videoFallback = JSON.stringify(siblings);
    video.addEventListener('error', () => {
      const nextSources = parseFallbackList(video.dataset.videoFallback);
      if (!nextSources.length) {
        video.controls = false;
        video.style.display = 'none';
        const wrap = video.closest('.property-video-wrap');
        if (wrap && !wrap.querySelector('.property-video-label-error')) {
          const note = document.createElement('span');
          note.className = 'property-video-label property-video-label-error';
          note.textContent = 'Video currently unavailable.';
          wrap.appendChild(note);
        }
        return;
      }

      const next = nextSources.shift();
      video.dataset.videoFallback = JSON.stringify(nextSources);
      source.setAttribute('src', next);
      video.load();
    });
  });
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

function renderFavicon() {
  const content = getContent();
  const iconHref = content.logo?.src;
  if (!iconHref) return;

  let icon = document.querySelector('link[rel="icon"]');
  if (!icon) {
    icon = document.createElement('link');
    icon.setAttribute('rel', 'icon');
    document.head.appendChild(icon);
  }

  icon.setAttribute('href', iconHref);
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
  renderFavicon();
  renderFooter();
  renderHomePageContent();
  renderListingsPageContent();
  renderContactPageContent();
  renderFeaturedProperties();
  renderFilters();
  renderListings();
  renderPropertyPage();
  initMediaResilience();
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
