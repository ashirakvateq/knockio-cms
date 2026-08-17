/**
 * Fiber industry page interactions.
 * Scoped to #fiber-industry-page. Exits if root is absent.
 * - Quick summary open/close
 * - Sticky capability tabs (desktop scroll + mobile click)
 * FAQ accordion is handled by the shared home.js loaded in KnockioHomeLayout.
 */
(function () {
  "use strict";

  const root = document.getElementById("industry-page");
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

})();
