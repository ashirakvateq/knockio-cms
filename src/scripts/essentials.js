(function () {
  'use strict';

  /* ── Smooth-scroll for hash links ─────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Header scroll state (if kh-header exists) ── */
  var header = document.getElementById('mainNavbar');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('kh-scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
