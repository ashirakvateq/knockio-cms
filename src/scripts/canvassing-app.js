const CHECKOUT_BASE = 'https://checkout.knockio.com/';
const CAL_SCRIPT_URL = 'https://app.cal.com/embed/embed.js';
const CAL_LINK = 'knockio-demo/30-minute';
const THANK_YOU_URL = '/thank-you/';
const ALLOWED_CAL_ORIGINS = new Set(['https://cal.com', 'https://app.cal.com']);

function getParamCaseInsensitive(names) {
  const params = new URLSearchParams(window.location.search);

  for (const name of names) {
    const value = params.get(name);
    if (value) return value;
  }

  const normalized = names.map((name) => name.toLowerCase());
  for (const [key, value] of params.entries()) {
    if (normalized.includes(key.toLowerCase())) return value;
  }

  return '';
}

function getLeadSource() {
  const utmSource = getParamCaseInsensitive(['utm_source']);
  const source = getParamCaseInsensitive(['source']);
  if (utmSource) return utmSource.toLowerCase();
  if (source) return source.toLowerCase();

  if (!document.referrer) return 'direct';

  const referrer = document.referrer.toLowerCase();
  const sources = [
    ['facebook', ['facebook.com', 'fb.com']],
    ['instagram', ['instagram.com']],
    ['tiktok', ['tiktok.com']],
    ['linkedin', ['linkedin.com']],
    ['twitter', ['twitter.com', 'x.com']],
    ['youtube', ['youtube.com']],
    ['google', ['google.']],
    ['bing', ['bing.com']],
    ['reddit', ['reddit.com']],
  ];

  const match = sources.find(([, domains]) => domains.some((domain) => referrer.includes(domain)));
  if (match) return match[0];

  try {
    return new URL(document.referrer).hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
}

function buildCheckoutUrl(packageId) {
  const url = new URL(CHECKOUT_BASE);
  const gclid = getParamCaseInsensitive(['gclid', 'GCLID', 'custom_gclid']);
  const source = getParamCaseInsensitive(['source', 'utm_source']) || 'direct';

  url.searchParams.set('users', '5');
  if (packageId) url.searchParams.set('package', packageId);
  if (gclid) url.searchParams.set('gclid', gclid);
  if (source) url.searchParams.set('source', source);

  return url.toString();
}

function bindCheckoutButtons() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-checkout-package]');
    if (!button) return;

    event.preventDefault();
    window.location.href = buildCheckoutUrl(button.dataset.checkoutPackage);
  });
}

function addPreconnect(href) {
  if (document.querySelector(`link[rel="preconnect"][href="${href}"]`)) return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = href;
  link.crossOrigin = '';
  document.head.appendChild(link);
}

function ensureCalQueue() {
  if (window.Cal && window.Cal.loaded) return;

  (function(C, A, L) {
    const queue = function(api, args) {
      api.q.push(args);
    };
    const doc = C.document;

    C.Cal = C.Cal || function() {
      const cal = C.Cal;
      const args = arguments;

      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        const script = doc.createElement('script');
        script.src = A;
        script.async = true;
        doc.head.appendChild(script);
        cal.loaded = true;
      }

      if (args[0] === L) {
        const api = function() {
          queue(api, arguments);
        };
        const namespace = args[1];
        api.q = api.q || [];

        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api;
          queue(cal.ns[namespace], args);
          queue(cal, ['initNamespace', namespace]);
        } else {
          queue(cal, args);
        }

        return;
      }

      queue(cal, args);
    };
  })(window, CAL_SCRIPT_URL, 'init');
}

function getTrackingQuery() {
  const params = new URLSearchParams();
  const customGclid = getParamCaseInsensitive(['gclid', 'GCLID', 'custom_gclid']);
  const utmSource = getParamCaseInsensitive(['utm_source']);
  const utmMedium = getParamCaseInsensitive(['utm_medium']);
  const utmCampaign = getParamCaseInsensitive(['utm_campaign']);

  if (customGclid) params.set('custom_gclid', customGclid);
  if (utmSource) params.set('utm_source', utmSource);
  if (utmMedium) params.set('utm_medium', utmMedium);
  if (utmCampaign) params.set('utm_campaign', utmCampaign);

  return params.toString();
}

function emptyBookingData() {
  return {
    isLoggedIn: false,
    id: '',
    email: '',
    phone_number: '',
    first_name: '',
    last_name: '',
    business_name: '',
    street: '',
    city: '',
    region: '',
    country: '',
    postal_code: '',
  };
}

function extractBookingData(data = {}) {
  const booking = data.booking || data;
  const attendee = booking.attendees && booking.attendees[0] ? booking.attendees[0] : {};
  const responses = booking.responses || {};
  const userData = emptyBookingData();
  const fullName = booking.name || attendee.name || '';
  const nameParts = fullName.split(' ').filter(Boolean);

  userData.id = booking.id || '';
  userData.email = booking.email || attendee.email || '';
  userData.phone_number =
    booking['Phone-Number'] ||
    booking['phone-number'] ||
    booking.phone ||
    responses['Phone Number'] ||
    responses['Phone-Number'] ||
    responses.phone ||
    '';
  userData.first_name = nameParts[0] || '';
  userData.last_name = nameParts.slice(1).join(' ');
  userData.business_name =
    booking['Business-Name'] ||
    booking.businessName ||
    responses['Business Name'] ||
    responses['Business-Name'] ||
    responses.businessName ||
    '';

  return userData;
}

function pushBooking(bookingData, bookingSource) {
  if (window.__knockioBookingProcessed) return;
  window.__knockioBookingProcessed = true;
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: 'user_data',
    user_data: bookingData,
  });

  window.dataLayer.push({
    event: 'generate_lead',
    lead_source: getLeadSource(),
    booking_source: bookingSource,
    currency: 'USD',
    value: 1,
  });

  window.setTimeout(() => {
    window.location.href = THANK_YOU_URL;
  }, 3000);
}

function bindCalBookingEvents() {
  if (window.__knockioCalEventsBound) return;
  window.__knockioCalEventsBound = true;

  window.Cal('on', {
    action: 'bookingSuccessful',
    callback(event) {
      pushBooking(extractBookingData(event.detail), 'cal.com-api');
    },
  });

  window.addEventListener('message', (event) => {
    if (!ALLOWED_CAL_ORIGINS.has(event.origin)) return;
    if (!event.data || event.data.type !== 'bookingSuccessful') return;

    const booking = event.data.data && event.data.data.booking ? event.data.data.booking : event.data.data;
    pushBooking(extractBookingData(booking), 'cal.com-message');
  });
}

function loadCalendar() {
  const target = document.getElementById('my-cal-inline');
  if (!target || target.dataset.loaded === 'true') return;

  target.dataset.loaded = 'true';
  target.innerHTML = '';
  addPreconnect('https://app.cal.com');
  addPreconnect('https://cal.com');
  ensureCalQueue();

  window.Cal('init', '30-minute', { origin: 'https://cal.com' });
  bindCalBookingEvents();

  const query = getTrackingQuery();
  const calLink = query ? `${CAL_LINK}?${query}` : CAL_LINK;

  window.Cal.ns['30-minute']('inline', {
    elementOrSelector: '#my-cal-inline',
    config: {
      layout: 'month_view',
      theme: 'light',
    },
    calLink,
  });
}

function initLazyCalendar() {
  const target = document.getElementById('my-cal-inline');
  const manualButton = document.querySelector('[data-load-cal]');
  if (!target) return;

  manualButton?.addEventListener('click', loadCalendar, { once: true });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        loadCalendar();
      },
      { rootMargin: '760px 0px' },
    );

    observer.observe(target);
    return;
  }

  window.setTimeout(loadCalendar, 1800);
}

function initFaqAnalytics() {
  document.querySelectorAll('[data-faq-item]').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'faq_open',
        faq_question: item.dataset.faqItem,
      });
    });
  });
}

function scheduleInit(fn) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(fn, { timeout: 4000 });
  } else {
    window.setTimeout(fn, 0);
  }
}

function initAosAnimations() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  elements.forEach((el) => observer.observe(el));
}

scheduleInit(function() {
  bindCheckoutButtons();
  initLazyCalendar();
  initFaqAnalytics();
  initAosAnimations();
});
