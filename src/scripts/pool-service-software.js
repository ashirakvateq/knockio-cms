/**
 * Pool industry page interactions.
 * Scoped to #pool-industry-page. Exits if root is absent.
 * - Quick summary open/close
 * - Sticky capability tabs (desktop scroll + mobile click)
 * FAQ accordion is handled by the shared home.js loaded in KnockioHomeLayout.
 */
(function () {
  "use strict";

  const root = document.getElementById("pool-industry-page");
  if (!root) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ---------- Quick summary ---------- */
  const summaryBtn = root.querySelector("#kioSummaryBtn");
  const summaryPanel = root.querySelector("#kioSummaryPanel");

  if (summaryBtn && summaryPanel) {
    summaryBtn.addEventListener("click", () => {
      const isOpen = summaryPanel.classList.toggle("is-open");
      summaryBtn.classList.toggle("is-open", isOpen);
      summaryBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  /* ---------- Capability sticky tabs ---------- */
  const track = root.querySelector("#poolCapScrollTrack");
  const tabButtons = Array.from(root.querySelectorAll("[data-pool-tab]"));
  const panels = Array.from(root.querySelectorAll(".hp-panel"));
  const compactQuery = window.matchMedia("(max-width: 1023px)");
  let activeIndex = 0;
  let ticking = false;

  if (!track || !tabButtons.length || !panels.length) return;

  function isCompact() {
    return compactQuery.matches;
  }

  function setActiveTab(index, shouldCenter = true) {
    index = Math.max(0, Math.min(index, panels.length - 1));

    if (activeIndex === index && panels[index].classList.contains("is-active")) {
      return;
    }
    activeIndex = index;

    tabButtons.forEach((btn, btnIndex) => {
      const isActive = btnIndex === index;
      btn.classList.toggle("is-active", isActive);
      btn.classList.toggle("border-primary-500", isActive);
      btn.classList.toggle("border-solid", isActive);
      btn.classList.toggle("border-dashed", !isActive);
      btn.classList.toggle("border-neutral-300", !isActive);
      btn.classList.toggle("text-primary-500", isActive);
      btn.classList.toggle("text-neutral-700", !isActive);
      btn.classList.toggle("bg-[#f9fff8]", isActive);
      btn.classList.toggle("bg-white", !isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    panels.forEach((panel, panelIndex) => {
      panel.classList.toggle("is-active", panelIndex === index);
    });

    if (shouldCenter && isCompact()) {
      const activeButton = tabButtons[index];
      const nav = activeButton.closest("#poolTabsNav");
      if (nav) {
        const scrollLeft =
          activeButton.offsetLeft -
          nav.clientWidth / 2 +
          activeButton.offsetWidth / 2;
        nav.scrollTo({
          left: scrollLeft,
          behavior: reduceMotion ? "auto" : "smooth",
        });
      }
    }
  }

  function getScrollIndex() {
    if (isCompact()) return activeIndex;

    const rect = track.getBoundingClientRect();
    const trackTop = window.scrollY + rect.top;
    const scrollable = Math.max(0, track.offsetHeight - window.innerHeight);

    if (scrollable <= 0) return 0;

    const y = window.scrollY;
    const start = trackTop;
    const end = trackTop + scrollable;

    if (y <= start) return 0;
    if (y >= end) return panels.length - 1;

    const progress = (y - start) / scrollable;
    return Math.min(
      panels.length - 1,
      Math.round(progress * (panels.length - 1)),
    );
  }

  function scrollToStep(index) {
    if (isCompact()) {
      setActiveTab(index);
      return;
    }

    const rect = track.getBoundingClientRect();
    const trackTop = window.scrollY + rect.top;
    const scrollable = Math.max(0, track.offsetHeight - window.innerHeight);
    const stepSize = scrollable / Math.max(1, panels.length - 1);
    const target = trackTop + stepSize * index;

    window.scrollTo({
      top: target,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  function onScroll() {
    if (isCompact()) return;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        setActiveTab(getScrollIndex(), false);
        ticking = false;
      });
      ticking = true;
    }
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.poolTab || 0);
      setActiveTab(index);
      scrollToStep(index);
    });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => setActiveTab(activeIndex));

  setActiveTab(0, false);
})();
