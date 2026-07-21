(function () {
	var cta = document.querySelector('[data-demo-ctas]');
	var ph = document.getElementById('my-cal-inline');
	if (!cta || !ph) return;

	if (ph.dataset.loaded === 'true') {
		cta.hidden = true;
		return;
	}

	var mo = new MutationObserver(function (muts) {
		muts.forEach(function (m) {
			if (m.attributeName === 'data-loaded' && ph.dataset.loaded === 'true') {
				cta.hidden = true;
				mo.disconnect();
			}
		});
	});
	mo.observe(ph, { attributes: true, attributeFilter: ['data-loaded'] });

	ph.addEventListener('click', function (e) {
		if (e.target.closest('[data-load-cal]')) cta.hidden = true;
	});
})();