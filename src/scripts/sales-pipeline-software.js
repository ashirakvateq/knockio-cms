/**
 * Sales pipeline page interactions.
 * Scoped to #sales-pipeline-page. Exits if root is absent.
 * - Quick summary open/close
 * - Proposal tab + sub-item visual swap (content from data-* attributes)
 * FAQ accordion is handled by the shared home.js loaded in KnockioHomeLayout.
 */
(function () {
  "use strict";

  const root = document.getElementById("sales-pipeline-page");
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

  /* ---------- Proposal tabs ---------- */
  const tabs = root.querySelectorAll(".proposal-tab");
  const subItems = root.querySelectorAll(".proposal-subitem");
  const visual = root.querySelector("#proposalVisual");
  const visualImage = root.querySelector("#proposalVisualImage");
  const visualTitle = root.querySelector("#proposalVisualTitle");
  const visualText = root.querySelector("#proposalVisualText");

  if (!tabs.length || !visual || !visualImage || !visualTitle || !visualText) {
    return;
  }

  const activeIndexByTab = {
    digital: 0,
    pricing: 0,
    tracking: 0,
    followup: 0,
  };

  function updateProposalVisual(item) {
    if (!item) return;

    const apply = () => {
      visualImage.src = item.dataset.image || visualImage.src;
      visualImage.alt = item.dataset.title || visualImage.alt;
      visualTitle.textContent = item.dataset.title || "";
      visualText.textContent = item.dataset.text || "";
    };

    if (reduceMotion) {
      apply();
      return;
    }

    visual.classList.add("is-changing");
    window.setTimeout(apply, 130);
    window.setTimeout(() => {
      visual.classList.remove("is-changing");
    }, 300);
  }

  function setActiveProposal(tabKey, itemIndex = 0) {
    activeIndexByTab[tabKey] = itemIndex;

    tabs.forEach((tab) => {
      const isActive = tab.dataset.tab === tabKey;
      tab.classList.toggle("is-active", isActive);
      const header = tab.querySelector(".proposal-tab-header");
      if (header) {
        header.setAttribute("aria-expanded", isActive ? "true" : "false");
      }
    });

    let activeItem = null;
    subItems.forEach((item) => {
      const isActive =
        item.dataset.tab === tabKey && Number(item.dataset.index) === itemIndex;
      item.classList.toggle("is-active", isActive);
      if (isActive) activeItem = item;
    });

    updateProposalVisual(activeItem);
  }

  root.querySelectorAll(".proposal-tab-header").forEach((header) => {
    header.addEventListener("click", () => {
      const tab = header.closest(".proposal-tab");
      if (!tab) return;
      const tabKey = tab.dataset.tab;
      setActiveProposal(tabKey, activeIndexByTab[tabKey] || 0);
    });
  });

  subItems.forEach((item) => {
    item.addEventListener("click", () => {
      const tabKey = item.dataset.tab;
      const itemIndex = Number(item.dataset.index);
      setActiveProposal(tabKey, itemIndex);
    });
  });

  setActiveProposal("digital", 0);
})();
