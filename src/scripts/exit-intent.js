const CAL_SCRIPT_URL = 'https://app.cal.com/embed/embed.js';
const CAL_LINK = 'knockio-demo/30-minute';
const CAL_NAMESPACE = 'knockio-exit-demo';
const THANK_YOU_URL = '/thank-you/';
const ENABLE_DELAY_MS = 3000;
const MOVEMENT_THRESHOLD_PX = 300;
const OUTSIDE_CLICK_WINDOW_MS = 1000;
const MOBILE_TABLET_AUTO_DELAY = 30000;
const ALLOWED_CAL_ORIGINS = new Set(['https://cal.com', 'https://app.cal.com']);

const desktopQuery = window.matchMedia(
  '(hover: hover) and (pointer: fine) and (min-width: 1024px)',
);
const mobileTabletQuery = window.matchMedia(
  '(hover: none), (pointer: coarse), (max-width: 1024px)',
);

let modal;
let modalOpen = false;
let modalShownThisView = false;
let calLoaded = false;
let exitDetectionEnabled = false;
let desktopArmed = false;
let mobileArmed = false;
let lastPointerExitAt = 0;
let autoPopupTimer = 0;
let lastFocused = null;

function isMobileOrTablet() {
  return mobileTabletQuery.matches;
}

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

function getTrackingQuery() {
  const params = new URLSearchParams();
  const customGclid = getParamCaseInsensitive(['gclid', 'GCLID', 'custom_gclid']);
  const customFbclid = getParamCaseInsensitive(['fbclid', 'custom_fbclid']);
  const customMsclkid = getParamCaseInsensitive(['msclkid', 'custom_msclkid']);
  const utmSource = getParamCaseInsensitive(['utm_source']);
  const utmMedium = getParamCaseInsensitive(['utm_medium']);
  const utmCampaign = getParamCaseInsensitive(['utm_campaign']);

  if (customGclid) params.set('custom_gclid', customGclid);
  if (customFbclid) params.set('custom_fbclid', customFbclid);
  if (customMsclkid) params.set('custom_msclkid', customMsclkid);
  if (utmSource) params.set('utm_source', utmSource);
  if (utmMedium) params.set('utm_medium', utmMedium);
  if (utmCampaign) params.set('utm_campaign', utmCampaign);

  return params.toString();
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

  (function (C, A, L) {
    const queue = function (api, args) {
      api.q.push(args);
    };
    const doc = C.document;

    C.Cal = C.Cal || function () {
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
        const api = function () {
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

function setCalendarState(target, state) {
  target.dataset.calState = state;
  target.setAttribute('aria-busy', String(state === 'loading'));
  target.closest('.cal-shell')?.setAttribute('data-cal-state', state);
}

function clearCalendarLoadingState(target) {
  let observer;

  const finishLoading = () => {
    setCalendarState(target, 'ready');
    observer?.disconnect();
  };
  const bindFrameLoad = () => {
    const frame = target.querySelector('iframe');
    if (!frame) return false;

    frame.addEventListener('load', finishLoading, { once: true });
    return true;
  };

  if (bindFrameLoad() || !('MutationObserver' in window)) return;

  observer = new MutationObserver(() => {
    if (!bindFrameLoad()) return;
    observer.disconnect();
  });

  observer.observe(target, { childList: true, subtree: true });
}

function loadCalEmbedOnce() {
  if (calLoaded) return;
  calLoaded = true;

  const target = document.getElementById('knockio-exit-cal-inline');
  if (!target) return;

  setCalendarState(target, 'loading');
  clearCalendarLoadingState(target);
  addPreconnect('https://app.cal.com');
  addPreconnect('https://cal.com');
  ensureCalQueue();

  window.Cal('init', CAL_NAMESPACE, { origin: 'https://cal.com' });
  bindCalBookingEvents();

  const query = getTrackingQuery();
  const calLink = query ? `${CAL_LINK}?${query}` : CAL_LINK;

  window.Cal.ns[CAL_NAMESPACE]('inline', {
    elementOrSelector: '#knockio-exit-cal-inline',
    config: {
      layout: 'month_view',
      theme: 'light',
    },
    calLink,
  });
}

function openExitModal() {
  if (modalOpen || modalShownThisView) return;

  modalOpen = true;
  modalShownThisView = true;

  if (autoPopupTimer) {
    clearTimeout(autoPopupTimer);
    autoPopupTimer = 0;
  }

  lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');

  document.documentElement.classList.add('overflow-hidden');
  document.body.classList.add('overflow-hidden');

  requestAnimationFrame(() => {
    modal.classList.add('knockio-open');
  });

  modal.querySelector('[data-knockio-exit-close]')?.focus({ preventScroll: true });

  setTimeout(loadCalEmbedOnce, 150);
}

function closeExitModal() {
  if (!modalOpen) return;

  modalOpen = false;
  modal.classList.remove('knockio-open');

  setTimeout(() => {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');

    document.documentElement.classList.remove('overflow-hidden');
    document.body.classList.remove('overflow-hidden');

    lastFocused?.focus();
    lastFocused = null;
  }, 250);
}

function onDocumentFocusIn(event) {
  if (!modalOpen || !modal) return;
  if (modal.contains(event.target)) return;

  modal.querySelector('[data-knockio-exit-close]')?.focus();
}

function armExitDetection() {
  const startedAt = Date.now();
  let accumulated = 0;
  let lastX = null;
  let lastY = null;

  const onMove = (event) => {
    if (lastX !== null) {
      accumulated += Math.abs(event.clientX - lastX) + Math.abs(event.clientY - lastY);
    }
    lastX = event.clientX;
    lastY = event.clientY;

    if (accumulated < MOVEMENT_THRESHOLD_PX) return;
    if (Date.now() - startedAt < ENABLE_DELAY_MS) return;

    exitDetectionEnabled = true;
    document.removeEventListener('mousemove', onMove);
  };

  document.addEventListener('mousemove', onMove, { passive: true });
}

function onDocumentMouseLeave(event) {
  if (isMobileOrTablet()) return;
  if (!exitDetectionEnabled || modalOpen) return;

  lastPointerExitAt = Date.now();
  if (event.clientY <= 8) openExitModal();
}

function onWindowBlur() {
  if (isMobileOrTablet()) return;
  if (!exitDetectionEnabled || modalOpen) return;

  if (Date.now() - lastPointerExitAt <= OUTSIDE_CLICK_WINDOW_MS) openExitModal();
}

function armDesktop() {
  if (desktopArmed) return;
  desktopArmed = true;

  armExitDetection();
  document.documentElement.addEventListener('mouseleave', onDocumentMouseLeave);
  window.addEventListener('blur', onWindowBlur);
}

function armMobileBackButton() {
  if (!history.pushState) return;

  history.pushState({ knockioExitTrap: true }, '', '');

  window.addEventListener('popstate', (event) => {
    if (event.state && event.state.knockioExitTrap) return;
    if (modalOpen || modalShownThisView) return;

    history.pushState({ knockioExitTrap: true }, '', '');
    openExitModal();
  });
}

function armMobileAutoPopup() {
  autoPopupTimer = setTimeout(() => {
    autoPopupTimer = 0;
    if (!modalOpen) openExitModal();
  }, MOBILE_TABLET_AUTO_DELAY);
}

function armMobile() {
  if (mobileArmed) return;
  mobileArmed = true;

  armMobileBackButton();
  armMobileAutoPopup();
}

function initExitIntent() {
  modal = document.getElementById('knockio-exit-modal');
  if (!modal) return;

  if (isMobileOrTablet()) {
    armMobile();
  } else {
    armDesktop();
  }

  mobileTabletQuery.addEventListener?.('change', () => {
    if (isMobileOrTablet()) {
      armMobile();
    } else {
      armDesktop();
    }
  });

  modal.querySelectorAll('[data-knockio-exit-close]').forEach((button) => {
    button.addEventListener('click', closeExitModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeExitModal();
  });

  document.addEventListener('focusin', onDocumentFocusIn);
}

function scheduleInit() {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(initExitIntent, { timeout: 2000 });
  } else {
    window.setTimeout(initExitIntent, 500);
  }
}

if (document.readyState === 'complete') {
  scheduleInit();
} else {
  window.addEventListener('load', scheduleInit, { once: true });
}
