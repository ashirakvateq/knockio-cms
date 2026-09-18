(function () {
  var gtmId = 'GTM-MG8F3DS9';
  (function (w, d, s, l, i) {
    var loaded = false;
    function loadGtm() {
      console.log("GTM loading .....");
      if (loaded) return;
      loaded = true;
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    }
    var events = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    function onFirst() {
      events.forEach(function (e) {
        w.removeEventListener(e, onFirst);
      });
      loadGtm();
    }
    events.forEach(function (e) {
      w.addEventListener(e, onFirst, { passive: true });
    });
    if ('requestIdleCallback' in w) {
      w.requestIdleCallback(loadGtm, { timeout: 15000 });
    } else {
      w.setTimeout(loadGtm, 8000);
    }
  })(window, document, 'script', 'dataLayer', gtmId);
})();

(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* theme toggle */
  var root = document.documentElement,
    tb = document.getElementById('themeToggle');
  tb.addEventListener('click', function () {
    var cur = root.getAttribute('data-theme');
    if (!cur) {
      cur = matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    root.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
  });

  /* reveal the fixed nav once the hero is fully scrolled past */
  var navEl = document.querySelector('nav');
  var heroEl = document.querySelector('header.hero');
  function navScroll() {
    var past = heroEl
      ? heroEl.getBoundingClientRect().bottom <= 0
      : window.scrollY > 500;
    navEl.classList.toggle('scrolled', past);
  }
  window.addEventListener('scroll', navScroll, { passive: true });
  window.addEventListener('resize', navScroll);
  navScroll();

  /* scroll reveal */
  var io = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll('.reveal').forEach(function (el) {
    io.observe(el);
  });

  /* count-up */
  document.querySelectorAll('.n[data-count]').forEach(function (el) {
    var target = +el.getAttribute('data-count'),
      suffix = el.querySelector('small');
    var sfx = suffix ? suffix.outerHTML : '';
    if (reduce) {
      el.innerHTML = target.toLocaleString() + sfx;
      return;
    }
    var seen = false;
    var o = new IntersectionObserver(
      function (x) {
        x.forEach(function (e) {
          if (e.isIntersecting && !seen) {
            seen = true;
            var t0 = performance.now();
            (function step(t) {
              var p = Math.min(1, (t - t0) / 1100);
              var v = Math.round(target * (1 - Math.pow(1 - p, 3)));
              el.innerHTML = v.toLocaleString() + sfx;
              if (p < 1) requestAnimationFrame(step);
            })(t0);
          }
        });
      },
      { threshold: 0.5 },
    );
    o.observe(el);
  });

  /* pricing toggle */
  var t5 = document.getElementById('tier5'),
    t1 = document.getElementById('tier1');
  function setTier(five) {
    t5.setAttribute('aria-pressed', five ? 'true' : 'false');
    t1.setAttribute('aria-pressed', five ? 'false' : 'true');
    document.querySelectorAll('.pv').forEach(function (el) {
      el.textContent = el.getAttribute(five ? 'data-p5' : 'data-p1');
    });
  }
  t5.addEventListener('click', function () {
    setTier(true);
  });
  t1.addEventListener('click', function () {
    setTier(false);
  });

  /* ---- hero territory map (Canvas) ---- */
  var cv = document.getElementById('map'),
    ctx = cv ? cv.getContext('2d') : null;
  var css = getComputedStyle(document.documentElement);
  function col(n) {
    return css.getPropertyValue(n).trim();
  }
  var W, H, dpr;
  function size() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    var r = cv.getBoundingClientRect();
    W = r.width;
    H = r.height || 380;
    cv.width = W * dpr;
    cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  /* two-territory map — verified against mock-canvas harness (no runtime errors) */
  var VROADS = [0.14, 0.34, 0.66, 0.86];
  var HROADS = [0.26, 0.5, 0.74];
  var TERR_A = [
    [0.05, 0.13],
    [0.44, 0.11],
    [0.45, 0.8],
    [0.06, 0.84],
  ];
  var TERR_B = [
    [0.56, 0.11],
    [0.95, 0.13],
    [0.94, 0.84],
    [0.55, 0.8],
  ];
  var doorsA = [],
    doorsB = [],
    routeA = [],
    routeB = [];
  function mRnd(seed) {
    return function () {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
  }
  function inPoly(x, y, pl) {
    var c = false;
    for (var i = 0, j = pl.length - 1; i < pl.length; j = i++) {
      var xi = pl[i][0] * W,
        yi = pl[i][1] * H,
        xj = pl[j][0] * W,
        yj = pl[j][1] * H;
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
        c = !c;
    }
    return c;
  }
  function cX(pl) {
    var x = 0;
    for (var i = 0; i < pl.length; i++) x += pl[i][0];
    return (x / pl.length) * W;
  }
  function walk(pts, cap) {
    if (!pts.length) return [];
    var rem = pts.slice().sort(function (a, b) {
      return a.y - b.y || a.x - b.x;
    });
    var p = [rem.shift()];
    while (rem.length && p.length < cap) {
      var L = p[p.length - 1],
        bi = 0,
        bd = 1e9;
      for (var i = 0; i < rem.length; i++) {
        var dx = rem[i].x - L.x,
          dy = rem[i].y - L.y,
          d = dx * dx + dy * dy;
        if (d < bd) {
          bd = d;
          bi = i;
        }
      }
      p.push(rem.splice(bi, 1)[0]);
    }
    return p;
  }
  function build() {
    doorsA = [];
    doorsB = [];
    var rnd = mRnd(9);
    for (var vi = 0; vi < VROADS.length; vi++)
      for (var hi = 0; hi < HROADS.length; hi++) {
        for (var k = 0; k < 2; k++) {
          var x = (VROADS[vi] + (rnd() - 0.5) * 0.07) * W,
            y = (HROADS[hi] + (rnd() - 0.5) * 0.12) * H,
            dr = { x: x, y: y, t: rnd() };
          if (inPoly(x, y, TERR_A)) doorsA.push(dr);
          else if (inPoly(x, y, TERR_B)) doorsB.push(dr);
        }
      }
    routeA = walk(doorsA, 7);
    routeB = walk(doorsB, 7);
  }
  function rrect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function ppath(pl) {
    ctx.beginPath();
    for (var i = 0; i < pl.length; i++) {
      var X = pl[i][0] * W,
        Y = pl[i][1] * H;
      if (i) ctx.lineTo(X, Y);
      else ctx.moveTo(X, Y);
    }
    ctx.closePath();
  }
  function street(x1, y1, x2, y2, wc, wf, cc, cf) {
    ctx.lineCap = 'round';
    ctx.strokeStyle = cc;
    ctx.lineWidth = wc;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.strokeStyle = cf;
    ctx.lineWidth = wf;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  function tchip(cx, cy, txt, color) {
    ctx.font = '700 10px ui-monospace,Menlo,Consolas,monospace';
    var w = ctx.measureText(txt).width + 16;
    rrect(cx - w / 2, cy - 9, w, 18, 5);
    ctx.fillStyle = col('--panel');
    ctx.globalAlpha = 0.95;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(txt, cx, cy);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }
  function repRoute(rt, color, now, phase) {
    if (rt.length < 2) return;
    var per = 4200,
      t = reduce ? 1 : Math.max(0, Math.min(1, (now - phase) / per));
    ctx.save();
    ctx.setLineDash([2, 5]);
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(rt[0].x, rt[0].y);
    for (var i = 1; i < rt.length; i++) ctx.lineTo(rt[i].x, rt[i].y);
    ctx.stroke();
    ctx.restore();
    var tot = rt.length - 1,
      up = t * tot;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.6;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(rt[0].x, rt[0].y);
    for (var j = 1; j < rt.length; j++) {
      if (up >= j) ctx.lineTo(rt[j].x, rt[j].y);
      else {
        var f = up - (j - 1);
        if (f > 0)
          ctx.lineTo(
            rt[j - 1].x + (rt[j].x - rt[j - 1].x) * f,
            rt[j - 1].y + (rt[j].y - rt[j - 1].y) * f,
          );
        break;
      }
    }
    ctx.stroke();
    var s = Math.floor(up),
      f2 = up - s,
      pt = rt[s + 1]
        ? {
            x: rt[s].x + (rt[s + 1].x - rt[s].x) * f2,
            y: rt[s].y + (rt[s + 1].y - rt[s].y) * f2,
          }
        : rt[rt.length - 1];
    if (!reduce) {
      var pr = ((now + phase) % 1300) / 1300;
      ctx.globalAlpha = (1 - pr) * 0.55;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 7 + pr * 14, 0, 7);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 6, 0, 7);
    ctx.fill();
    ctx.strokeStyle = col('--panel');
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 6, 0, 7);
    ctx.stroke();
  }
  function draw(now) {
    now = now || 0;
    var land = col('--panel-2'),
      rf = col('--panel'),
      rc = col('--line'),
      fld = col('--field'),
      br = col('--brass'),
      ink3 = col('--ink-3');
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = land;
    ctx.fillRect(0, 0, W, H);
    rrect(W * 0.6, H * 0.55, W * 0.16, H * 0.24, 8);
    ctx.fillStyle = 'rgba(56,158,88,0.18)';
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(W * 0.24, H * 0.3, W * 0.05, H * 0.08, 0, 0, 7);
    ctx.fillStyle = 'rgba(72,132,182,0.20)';
    ctx.fill();
    var wc = Math.max(6, H * 0.026),
      wf = Math.max(3, H * 0.014);
    for (var v = 0; v < VROADS.length; v++)
      street(VROADS[v] * W, -6, VROADS[v] * W, H + 6, wc, wf, rc, rf);
    for (var h = 0; h < HROADS.length; h++)
      street(-6, HROADS[h] * H, W + 6, HROADS[h] * H, wc, wf, rc, rf);
    street(0.5 * W, -6, 0.5 * W, H + 6, wc + 3, wf + 3, rc, rf);
    ppath(TERR_A);
    ctx.fillStyle = fld;
    ctx.globalAlpha = 0.12;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.setLineDash([7, 5]);
    ctx.strokeStyle = fld;
    ctx.globalAlpha = 0.75;
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
    ppath(TERR_B);
    ctx.fillStyle = br;
    ctx.globalAlpha = 0.12;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.setLineDash([7, 5]);
    ctx.strokeStyle = br;
    ctx.globalAlpha = 0.75;
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
    function drawDoors(arr) {
      var ap = reduce ? 1 : Math.min(1, now / 1400);
      for (var i = 0; i < arr.length; i++) {
        var d = arr[i],
          a = reduce ? 1 : Math.max(0, Math.min(1, ap * arr.length - i));
        if (a <= 0) continue;
        var c = d.t > 0.68 ? fld : d.t > 0.38 ? br : ink3;
        ctx.fillStyle = c;
        ctx.globalAlpha = a * (d.t > 0.68 ? 1 : 0.85);
        ctx.beginPath();
        ctx.arc(d.x, d.y, 4.2 * a, 0, 7);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    drawDoors(doorsA);
    drawDoors(doorsB);
    repRoute(routeA, fld, now, 0);
    repRoute(routeB, br, now, 1900);
    tchip(cX(TERR_A), H * 0.075, 'WEST · REP A', fld);
    tchip(cX(TERR_B), H * 0.075, 'EAST · REP B', br);
  }
  var raf;
  function loop(t) {
    draw(t);
    raf = requestAnimationFrame(loop);
  }
  function start() {
    size();
    build();
    cancelAnimationFrame(raf);
    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }
  }
  window.addEventListener('resize', function () {
    if (!cv) return;
    size();
    build();
    if (reduce) draw(0);
  });
  if (cv) start();

  /* subtle knock ripples on final CTA bg */
  var kb = document.getElementById('knockBg'),
    kctx = kb && kb.getContext('2d');
  if (kb && !reduce) {
    function ksize() {
      var r = kb.parentElement.getBoundingClientRect();
      kb.width = r.width;
      kb.height = r.height;
    }
    ksize();
    window.addEventListener('resize', ksize);
    var ripples = [];
    function spawn() {
      ripples.push({
        x: Math.random() * kb.width,
        y: Math.random() * kb.height,
        r: 0,
        a: 1,
      });
      if (ripples.length > 7) ripples.shift();
    }
    var last = 0;
    function kloop(t) {
      if (t - last > 620) {
        spawn();
        last = t;
      }
      kctx.clearRect(0, 0, kb.width, kb.height);
      ripples.forEach(function (p) {
        p.r += 0.7;
        p.a *= 0.985;
        kctx.beginPath();
        kctx.arc(p.x, p.y, p.r, 0, 7);
        kctx.strokeStyle = 'rgba(255,255,255,' + p.a + ')';
        kctx.lineWidth = 2;
        kctx.stroke();
      });
      requestAnimationFrame(kloop);
    }
    requestAnimationFrame(kloop);
  }

  /* ============================================================
     EMAIL CAPTURE → CRM → CAL.COM MODAL
     Set these two values to go live:
     ============================================================ */
  var CONFIG = {
    // Lead spreadsheet destination. The endpoint must be a deployed Google Apps Script Web App.
    // The Google account/sheet permissions belong on the Apps Script side; never put service-account credentials here.
    spreadsheetOwner: '',
    // Matches the live embed on https://knockio.com/book-a-demo/
    calLink: 'knockio-demo/30-minute', // Cal.com booking slug (org/event)
    calNamespace: '30-minute', // Cal.com embed namespace
    calOrigin: 'https://cal.com',
    crmEndpoint:
      'https://script.google.com/macros/s/AKfycbzUuE9qea7uf3KQdUIVPPYSqNT4jwt-FTfIG_sLJU8dCK04dSQmw467mZvpACdEPxE3aA/exec',
    checkoutLink: 'https://knockio.com/signup', // TODO: your self-serve signup / checkout URL
  };

  /* ---- Official Cal.com embed loader (same as knockio.com/book-a-demo/) ---- */
  (function (C, A, L) {
    var p = function (a, ar) {
      a.q.push(ar);
    };
    var d = C.document;
    C.Cal =
      C.Cal ||
      function () {
        var cal = C.Cal,
          ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement('script')).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          var api = function () {
              p(api, arguments);
            },
            namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ['initNamespace', namespace]);
          } else {
            p(cal, ar);
          }
          return;
        }
        p(cal, ar);
      };
  })(window, 'https://app.cal.com/embed/embed.js', 'init');
  Cal('init', CONFIG.calNamespace, { origin: CONFIG.calOrigin });

  /* Forward gclid / utm params to Cal exactly like the live booking page */
  function calTrackingQuery() {
    var out = new URLSearchParams(),
      sp = new URLSearchParams(window.location.search);
    function pick(names) {
      for (var i = 0; i < names.length; i++) {
        var v = sp.get(names[i]);
        if (v) return v;
      }
      var lower = names.map(function (n) {
        return n.toLowerCase();
      });
      var it = sp.entries();
      var e;
      while (!(e = it.next()).done) {
        if (lower.indexOf(e.value[0].toLowerCase()) > -1) return e.value[1];
      }
      return '';
    }
    var gclid = pick(['gclid', 'GCLID', 'custom_gclid']);
    var us = pick(['utm_source']),
      um = pick(['utm_medium']),
      uc = pick(['utm_campaign']);
    if (gclid) out.set('custom_gclid', gclid);
    if (us) out.set('utm_source', us);
    if (um) out.set('utm_medium', um);
    if (uc) out.set('utm_campaign', uc);
    return out.toString();
  }

  /* Fire the demo booking as a conversion, same signal as the live page */
  var _calBound = false;
  function bindCalConversion() {
    if (_calBound || !window.Cal || !Cal.ns || !Cal.ns[CONFIG.calNamespace])
      return;
    _calBound = true;
    Cal.ns[CONFIG.calNamespace]('on', {
      action: 'bookingSuccessful',
      callback: function () {
        try {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'demo_booked',
            lead_email: leadEmail,
          });
        } catch (e) {}
        if (leadEmail) sendToCRM(leadEmail, true);
        console.log(
          '[Knockio] demo booked →',
          leadEmail || '(no email captured)',
        );
      },
    });
  }

  function sendToCRM(email, booked = false) {
    console.log('sending to CRM: ', email);
    if (!CONFIG.crmEndpoint || !email) return;

    const formData = new FormData();

    formData.append('Email', email);
    formData.append('Source', 'Knockio');
    formData.append('Page', 'knockio-door-knocking-lp');
    formData.append('Booked', booked ? 'Yes' : 'No');

    fetch(CONFIG.crmEndpoint, {
      method: 'POST',
      body: formData,
      mode: 'no-cors',
      keepalive: true,
    }).catch((error) => {
      console.error('Failed to save lead:', error);
    });
  }

  var leadEmail = '';
  var lastFocus = null;
  function trap(e, m) {
    if (e.key !== 'Tab') return;
    var f = m.querySelectorAll(
      'a[href],button:not([disabled]),input,select,textarea,iframe,[tabindex]:not([tabindex="-1"])',
    );
    f = Array.prototype.filter.call(f, function (el) {
      return (
        el.offsetWidth > 0 || el.offsetHeight > 0 || el.tagName === 'IFRAME'
      );
    });
    if (!f.length) return;
    var first = f[0],
      last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  var modal = document.getElementById('calModal');
  function openModal(email) {
    lastFocus = document.activeElement;
    // Render the official Cal.com inline embed into the modal (same as /book-a-demo/)
    var wrap = document.getElementById('calWrap');
    wrap.innerHTML = ''; // clear any previous instance
    var params = calTrackingQuery();
    if (email)
      params += (params ? '&' : '') + 'email=' + encodeURIComponent(email);
    var link = CONFIG.calLink + (params ? '?' + params : '');
    Cal.ns[CONFIG.calNamespace]('inline', {
      elementOrSelector: '#calWrap',
      config: { layout: 'month_view', theme: 'light' },
      calLink: link,
    });
    bindCalConversion();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var c = modal.querySelector('.modal-close');
    if (c) c.focus();
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.getElementById('calWrap').innerHTML = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function handleForm(e) {
    e.preventDefault();
    var input = e.target.querySelector('input[type="email"]');
    var email = (input.value || '').trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      input.setAttribute('aria-invalid', 'true');
      input.setCustomValidity('Please enter a valid work email');
      input.reportValidity();
      return;
    }
    input.setAttribute('aria-invalid', 'false');
    input.setCustomValidity('');
    leadEmail = email;
    console.log('email captured: ', email);
    sendToCRM(email);
    openModal(email); // capture email, then open the Cal.com demo calendar
    e.target.reset();
  }
  document.querySelectorAll('.email-form').forEach(function (f) {
    f.addEventListener('submit', handleForm);
  });
  document.querySelectorAll('[data-demo-email]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var f = a.closest('form');
      if (f) handleForm({ preventDefault: function () {}, target: f });
    });
  });
  document.querySelectorAll('[data-demo-scroll]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var id = (a.getAttribute('href') || '').replace(/^#/, '');
      var t = id && document.getElementById(id);
      if (t)
        t.scrollIntoView({
          behavior: reduce ? 'auto' : 'smooth',
          block: 'start',
        });
    });
  });
  document.querySelectorAll('[data-demo]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      openModal('');
    });
  });
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') {
        closeModal();
      } else {
        trap(e, modal);
      }
    });
  }

  /* ---- pricing modal ---- */
  var priceModal = document.getElementById('pricingModal');
  function openPrice() {
    lastFocus = document.activeElement;
    priceModal.classList.add('open');
    priceModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var c = priceModal.querySelector('.modal-close');
    if (c) c.focus();
  }
  function closePrice() {
    priceModal.classList.remove('open');
    priceModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.querySelectorAll('[data-pricing]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'open_pricing_modal',
          plan: 'solo_25',
          cta: 'solo_25_link',
        });
      } catch (err) {}
      openPrice();
    });
  });
  var CHECKOUT_PKG = { prospect: '4', growth: '6' }; // Knockio checkout package IDs
  function buildCheckout(plan) {
    var sp = new URLSearchParams(location.search);
    function pick(names) {
      for (var i = 0; i < names.length; i++) {
        var v = sp.get(names[i]);
        if (v) return v;
      }
      var lower = names.map(function (n) {
        return n.toLowerCase();
      });
      var it = sp.entries(),
        e;
      while (!(e = it.next()).done) {
        if (lower.indexOf(e.value[0].toLowerCase()) > -1) return e.value[1];
      }
      return '';
    }
    var u = new URL('https://checkout.knockio.com/');
    var t5 = document.getElementById('tier5');
    u.searchParams.set(
      'users',
      t5 && t5.getAttribute('aria-pressed') === 'true' ? '5' : '1',
    );
    if (CHECKOUT_PKG[plan]) u.searchParams.set('package', CHECKOUT_PKG[plan]);
    var g = pick(['gclid', 'GCLID', 'custom_gclid']);
    if (g) u.searchParams.set('gclid', g);
    u.searchParams.set('source', pick(['source', 'utm_source']) || 'direct');
    return u.toString();
  }
  function refreshCheckoutLinks() {
    document.querySelectorAll('[data-checkout]').forEach(function (b) {
      b.setAttribute('href', buildCheckout(b.getAttribute('data-checkout')));
      b.setAttribute('target', '_blank');
      b.setAttribute('rel', 'noopener');
    });
  }
  refreshCheckoutLinks();
  ['tier1', 'tier5'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el)
      el.addEventListener('click', function () {
        setTimeout(refreshCheckoutLinks, 0);
      });
  });
  if (priceModal) {
    priceModal.addEventListener('click', function (e) {
      if (e.target === priceModal) closePrice();
    });
    priceModal
      .querySelector('.modal-close')
      .addEventListener('click', closePrice);
    document.addEventListener('keydown', function (e) {
      if (!priceModal.classList.contains('open')) return;
      if (e.key === 'Escape') {
        closePrice();
      } else {
        trap(e, priceModal);
      }
    });
  }

  /* ---- always-on inline calendar (lazy-mounted on scroll to protect page load) ---- */
  (function () {
    var el = document.getElementById('calInline');
    if (!el) return;
    var mounted = false;
    function waitForCal(fn) {
      if (window.Cal && Cal.ns) {
        fn();
        return;
      }
      var tries = 0;
      var timer = setInterval(function () {
        if (window.Cal && Cal.ns) {
          clearInterval(timer);
          fn();
        } else if (++tries > 100) {
          clearInterval(timer);
        }
      }, 100);
    }
    function mount() {
      if (mounted) return;
      mounted = true;
      var params = calTrackingQuery();
      var link = CONFIG.calLink + (params ? '?' + params : '');
      Cal('init', 'demo-inline', { origin: CONFIG.calOrigin });
      Cal.ns['demo-inline']('inline', {
        elementOrSelector: '#calInline',
        config: { layout: 'month_view', theme: 'light' },
        calLink: link,
      });
      Cal.ns['demo-inline']('on', {
        action: 'bookingSuccessful',
        callback: function () {
          try {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              event: 'demo_booked',
              source: 'inline_section',
            });
          } catch (e) {}
          console.log('[Knockio] demo booked → inline section');
        },
      });
    }
    function mountWhenReady() {
      waitForCal(mount);
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (es) {
          es.forEach(function (e) {
            if (e.isIntersecting) {
              mountWhenReady();
              io.disconnect();
            }
          });
        },
        { rootMargin: '300px 0px' },
      );
      io.observe(el);
    } else {
      mountWhenReady();
    }
  })();
})();
