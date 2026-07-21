const CHECKOUT_BASE = 'https://checkout.knockio.com/';

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

function scheduleInit(fn) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(fn, { timeout: 2000 });
  } else {
    window.setTimeout(fn, 0);
  }
}

scheduleInit(function() {
  bindCheckoutButtons();
  initFaqAnalytics();
  initAosAnimations();
});
