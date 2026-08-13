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

    // Cal.com inserts its iframe before its own spinner has finished. Keep our
    // copy visible until that iframe has actually loaded, not merely inserted.
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

function loadCalendar() {
  const target = document.getElementById('my-cal-inline');
  if (!target || target.dataset.loaded === 'true') return;

  target.dataset.loaded = 'true';
  setCalendarState(target, 'loading');
  target.replaceChildren();
  clearCalendarLoadingState(target);
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

function initCalInline() {
  const target = document.getElementById('my-cal-inline');
  if (!target) return;

  // Landing pages render their content as direct body sections. The exact
  // boundary after the second section is the established Cal.com load gate.
  const topLevelSections = Array.from(document.body.children).filter(
    (element) => element.tagName === 'SECTION',
  );
  const secondSection = topLevelSections[2];

  // Booking CTAs must beat the normal anchor jump so the calendar begins
  // loading as soon as a visitor asks for it.
  document
    .querySelectorAll('a[href="#cal-sec"], a[href="#landing-calender"]')
    .forEach((link) => {
      link.addEventListener('pointerdown', loadCalendar, { once: true });
      link.addEventListener('click', loadCalendar, { once: true });
    });

  if (window.location.hash === '#cal-sec' || window.location.hash === '#landing-calender') {
    loadCalendar();
    return;
  }

  if (!secondSection) return;

  const boundary = document.createElement('span');
  boundary.setAttribute('aria-hidden', 'true');
  boundary.style.cssText =
    'display:block;height:1px;width:1px;margin-top:-1px;overflow:hidden;';
  secondSection.after(boundary);

  let observer;
  const startCalendar = () => {
    observer?.disconnect();
    loadCalendar();
  };
  const hasPassedBoundary = () => boundary.getBoundingClientRect().top <= window.innerHeight;
  const loadIfBoundaryIsAlreadyPassed = () => {
    if (hasPassedBoundary()) startCalendar();
  };

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      startCalendar();
    }, { threshold: 0.01 });
    observer.observe(boundary);
  } else {
    // Old-browser fallback: use scroll, not wheel, so touch, keyboard, and
    // restored scroll positions are handled consistently.
    const onScroll = () => {
      if (!hasPassedBoundary()) return;
      window.removeEventListener('scroll', onScroll);
      loadCalendar();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Browser scroll restoration can complete after the deferred loader runs.
  // Recheck after layout and on pageshow so a reload past this exact boundary
  // always starts Cal.com without another user scroll.
  loadIfBoundaryIsAlreadyPassed();
  window.requestAnimationFrame(loadIfBoundaryIsAlreadyPassed);
  window.addEventListener('pageshow', loadIfBoundaryIsAlreadyPassed, { once: true });
}

initCalInline();
