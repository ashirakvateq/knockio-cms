(function () {
	var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var els = document.querySelectorAll('.rv');
	if (reduce || !('IntersectionObserver' in window)) {
		els.forEach(function (el) { el.classList.add('in'); });
		return;
	}
	var io = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				entry.target.classList.add('in');
				io.unobserve(entry.target);
			}
		});
	}, { threshold: 0.12 });
	els.forEach(function (el) { io.observe(el); });
})();
