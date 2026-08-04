import Lenis from "lenis";
import { labelDemoControls } from "./demo-accessibility.js";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reducedMotion) {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.3,
    touchMultiplier: 0.3,
  });

  let smoothRunning = false;
  function smoothTick(time) {
    lenis.raf(time);
    if (lenis.isScrolling !== false) {
      requestAnimationFrame(smoothTick);
    } else {
      smoothRunning = false;
    }
  }
  function wakeSmooth() {
    if (!smoothRunning) {
      smoothRunning = true;
      requestAnimationFrame(smoothTick);
    }
  }
  window.addEventListener("wheel", wakeSmooth, { passive: true });
  window.addEventListener("touchmove", wakeSmooth, { passive: true });
  window.addEventListener("scroll", wakeSmooth, { passive: true });
  document.addEventListener(
    "click",
    function (e) {
      if (e.target.closest && e.target.closest('a[href*="#"]')) wakeSmooth();
    },
    { passive: true, capture: true }
  );
}

// ── 1. Product Demo (desktop only, IO-gated rotation) ───────────────────────
(function () {
  var TAB_DURATION = 5000;
  var MAP_ASSET_URL = "/assets/cfw/map-walnut-creek.webp";

  var I = function (name, cls) {
    var P = {
      house: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
      wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
      zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
      globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
      megaphone: '<path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14"/><path d="M8 6v8"/>',
      messagesSquare: '<path d="M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/><path d="M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1"/>',
      funnel: '<path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"/>',
      barChart3: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
      columns3: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/>',
      calendarDays: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
      compass: '<path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/><circle cx="12" cy="12" r="10"/>',
      route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
      star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
      headset: '<path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M21 16v2a4 4 0 0 1-4 4h-5"/>',
      chevronsLeft: '<path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/>',
      chevronDown: '<path d="m6 9 6 6 6-6"/>',
      map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
      list: '<path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/>',
      squareCheck: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/>',
      ellipsisVertical: '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
    };
    var attrs =
      'xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    return (
      "<svg " +
      attrs +
      ' class="lucide lucide-' +
      name +
      (cls ? " " + cls : "") +
      '">' +
      (P[name] || "") +
      "</svg>"
    );
  };

  function renderMapSvg(suffix) {
    var s = suffix || "a";
    return (
      '<svg class="pointer-events-none absolute inset-0 z-0 h-full w-full" viewBox="0 0 1200 650" preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
      "<defs>" +
      '<linearGradient id="kio-sky-' + s + '" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#eef3f8"/><stop offset="100%" stop-color="#e4ebe6"/></linearGradient>' +
      '<linearGradient id="kio-park-' + s + '" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#c8e6c9"/><stop offset="100%" stop-color="#a5d6a7"/></linearGradient>' +
      '<linearGradient id="kio-water-' + s + '" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#81d4fa"/><stop offset="100%" stop-color="#4fc3f7"/></linearGradient>' +
      "</defs>" +
      '<rect width="1200" height="650" fill="url(#kio-sky-' + s + ')"/>' +
      '<rect width="1200" height="650" fill="#ebe8e0" opacity="0.55"/>' +
      '<path d="M-20 80 Q200 40 420 70 T820 55 T1220 75 L1220 220 Q960 250 700 230 T280 240 T-20 210 Z" fill="url(#kio-park-' + s + ')" opacity="0.85"/>' +
      '<path d="M0 520 Q300 490 600 510 T1200 500 L1200 650 L0 650 Z" fill="url(#kio-park-' + s + ')" opacity="0.75"/>' +
      '<path d="M920 520 Q1020 500 1120 530 L1200 540 L1200 650 L880 650 Q900 590 920 520 Z" fill="url(#kio-water-' + s + ')" opacity="0.5"/>' +
      '<path d="M0 560 Q180 545 360 555 T720 548 T1200 558 L1200 620 Q800 635 400 625 T0 610 Z" fill="url(#kio-water-' + s + ')" opacity="0.4"/>' +
      '<g fill="#d5cfc4" opacity="0.9">' +
      '<rect x="180" y="140" width="55" height="40" rx="2"/><rect x="245" y="155" width="40" height="30" rx="2"/>' +
      '<rect x="420" y="120" width="70" height="50" rx="2"/><rect x="500" y="135" width="45" height="35" rx="2"/>' +
      '<rect x="680" y="150" width="60" height="45" rx="2"/><rect x="750" y="165" width="50" height="35" rx="2"/>' +
      '<rect x="320" y="280" width="65" height="48" rx="2"/><rect x="395" y="295" width="48" height="38" rx="2"/>' +
      '<rect x="560" y="270" width="72" height="52" rx="2"/><rect x="640" y="285" width="55" height="40" rx="2"/>' +
      "</g>" +
      '<g stroke="#ffffff" stroke-width="14" stroke-linecap="round" fill="none" opacity="0.95">' +
      '<path d="M0 250 L1200 250"/><path d="M600 0 L600 650"/>' +
      "</g>" +
      '<g stroke="#f9e076" stroke-width="9" stroke-linecap="round" fill="none" opacity="0.92">' +
      '<path d="M-20 360 L1220 360"/><path d="M280 0 L320 650"/>' +
      "</g>" +
      '<g stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.88">' +
      '<path d="M0 180 L1200 195"/><path d="M150 0 L170 650"/><path d="M450 0 L430 650"/><path d="M850 0 L870 650"/>' +
      "</g>" +
      '<g stroke="#d0d5d8" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.75">' +
      '<path d="M0 100 L1200 115"/><path d="M80 0 L95 650"/><path d="M380 0 L365 650"/><path d="M720 0 L735 650"/><path d="M980 0 L965 650"/>' +
      "</g>" +
      '<text x="540" y="242" font-family="Inter,Arial,sans-serif" font-size="11" fill="#737373" opacity="0.7">Mt Diablo Blvd</text>' +
      '<text x="615" y="120" font-family="Inter,Arial,sans-serif" font-size="10" fill="#737373" opacity="0.65" transform="rotate(90 615 120)">North Main St</text>' +
      '<text x="260" y="240" font-family="Inter,Arial,sans-serif" font-size="11" fill="#737373" opacity="0.65">Walnut Creek</text>' +
      "</svg>"
    );
  }

  function renderMapLayer(index) {
    return (
      '<div class="absolute inset-0 z-0 overflow-hidden">' +
      renderMapSvg(String(index)) +
      '<img class="kio-map-tile pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover opacity-0 transition-opacity duration-300" src="' +
      MAP_ASSET_URL +
      '" alt="" aria-hidden="true" loading="lazy"/>' +
      '<div class="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-white/[0.06] via-transparent to-white/[0.04]" aria-hidden="true"></div>' +
      "</div>"
    );
  }

  function renderSidebar(active) {
    function item(key, iconName, label, opts) {
      opts = opts || {};
      var isActive = key === active;
      var linkCls =
        "group flex h-[42px] items-center gap-3 rounded-[10px] px-3 text-[14px] font-medium transition " +
        (isActive ? "bg-primary-600 text-white" : "text-neutral-700 hover:bg-neutral-50");
      var iconColorCls =
        "w-[18px] shrink-0 text-center text-[15px] " +
        (isActive ? "text-white" : "text-primary-600 group-hover:text-primary-700");
      var badgeCls =
        "shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide " +
        (isActive ? "bg-white/20 text-white" : "bg-primary-50 text-primary-700");
      var chevronCls =
        "shrink-0 text-[10px] " + (isActive ? "text-neutral-200" : "text-neutral-400");
      var trail = "";
      if (opts.badge) trail += '<span class="' + badgeCls + '">' + opts.badge + "</span>";
      if (opts.chevron) trail += I("chevronDown", chevronCls + (opts.badge ? " ml-1" : ""));
      return (
        '<button type="button" data-nav="' + key + '" class="' + linkCls + '">' +
        I(iconName, iconColorCls) +
        '<span class="kio-nav-label min-w-0 flex-1 truncate">' + label + "</span>" +
        (trail ? '<span class="ml-auto flex shrink-0 items-center gap-1">' + trail + "</span>" : "") +
        "</button>"
      );
    }
    return (
      '<div class="flex h-[72px] shrink-0 items-center justify-between border-b border-solid border-neutral-200 bg-white px-5">' +
      '<img class="h-7 w-auto object-contain" src="/assets/cfw/knockio-logo.webp" alt="Knockio"/>' +
      '<button type="button" class="grid h-7 w-7 place-items-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600" data-toast-message="Sidebar collapsed" aria-label="Collapse sidebar">' +
      I("chevronsLeft", "text-[11px]") +
      "</button>" +
      "</div>" +
      '<div class="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">' +
      '<p class="mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400">Main menu</p>' +
      '<nav class="flex flex-col gap-0.5">' +
      item("dashboard", "house", "Dashboard") +
      item("financials", "wallet", "Financials", { chevron: true }) +
      item("automations", "zap", "Automations") +
      item("territories", "globe", "Territories") +
      item("campaigns", "megaphone", "Campaigns") +
      item("communications", "messagesSquare", "Communications") +
      item("leads", "funnel", "Leads", { chevron: true }) +
      item("reporting", "barChart3", "Reporting") +
      item("boards", "columns3", "Boards") +
      item("appointments", "calendarDays", "Appointments", { chevron: true }) +
      item("tracking", "compass", "Tracking") +
      item("routes", "route", "Routes") +
      item("leaderboard", "star", "Leaderboard") +
      "</nav>" +
      "</div>" +
      '<div class="shrink-0 border-t border-solid border-neutral-200 bg-white p-4">' +
      '<button type="button" class="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary-600 text-sm font-medium text-white transition hover:bg-primary-700" data-toast-message="Support chat opened">' +
      I("headset") +
      " Support</button>" +
      "</div>"
    );
  }

  function mountSidebars(root, showToast) {
    root.querySelectorAll("[data-kio-sidebar]").forEach(function (el) {
      var active = el.getAttribute("data-sidebar-active") || "leads";
      el.innerHTML = renderSidebar(active);
      el.querySelectorAll("[data-nav]").forEach(function (link) {
        link.addEventListener("click", function () {
          var labelEl = link.querySelector(".kio-nav-label");
          showToast("Opening " + (labelEl ? labelEl.textContent.trim() : link.textContent.trim()));
        });
      });
    });
  }

  function mountMaps(root) {
    root.querySelectorAll("[data-kio-map-host]").forEach(function (host, index) {
      host.insertAdjacentHTML("afterbegin", renderMapLayer(index));
      var tile = host.querySelector(".kio-map-tile");
      if (tile) {
        tile.addEventListener("error", function () { tile.remove(); });
        tile.addEventListener("load", function () {
          tile.classList.remove("opacity-0");
          tile.classList.add("opacity-100");
        });
      }
    });
  }

  var desktopQuery = window.matchMedia("(min-width: 1024px)");
  var demoInitialized = false;

  function initProductDemo() {
    if (demoInitialized) return;
    var root = document.querySelector(".kio-product-demo");
    if (!root) return;
    demoInitialized = true;

    var tabs = Array.from(root.querySelectorAll("[data-kio-tab]"));
    var panels = Array.from(root.querySelectorAll("[data-kio-panel]"));
    var progress = root.querySelector(".kio-progress-bar");
    var toast = root.querySelector("[data-toast]");
    var tabBar = root.querySelector("[data-kio-demo-tabs]");
    var appViewport = root.querySelector(".kio-app-viewport");
    var activeIndex = 0;
    var progressTimer = null;
    var hoverPaused = false;
    var offscreenPaused = true;
    var draggedCard = null;

    function paused() { return hoverPaused || offscreenPaused; }

    function showToast(message) {
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add("is-visible");
      setTimeout(function () { toast.classList.remove("is-visible"); }, 1700);
    }

    mountSidebars(root, showToast);
    mountMaps(root);
    labelDemoControls(root);

    function restartProgress() {
      if (!progress) return;
      progress.style.animation = "none";
      progress.offsetHeight;
      progress.style.animation = "kioProgress " + TAB_DURATION + "ms linear forwards";
      progress.style.animationPlayState = paused() ? "paused" : "running";
    }

    function activateTab(index) {
      activeIndex = index;
      var target = tabs[index].getAttribute("data-kio-tab");
      tabs.forEach(function (tab) { tab.classList.remove("is-active"); });
      panels.forEach(function (panel) { panel.classList.remove("is-active"); });
      tabs[index].classList.add("is-active");
      var activePanel = root.querySelector('[data-kio-panel="' + target + '"]');
      if (activePanel) {
        activePanel.classList.add("is-active");
        activePanel.querySelectorAll(".kio-flow-branch").forEach(function (el, i) {
          el.style.animationDelay = i * 0.12 + "s";
          el.classList.add("animate-kio-branch");
        });
      }
      restartProgress();
    }

    function scheduleNextTab() {
      clearTimeout(progressTimer);
      if (paused()) return;
      progressTimer = setTimeout(function () {
        activateTab((activeIndex + 1) % tabs.length);
        scheduleNextTab();
      }, TAB_DURATION);
    }

    function pauseDemo() {
      hoverPaused = true;
      clearTimeout(progressTimer);
      if (progress) progress.style.animationPlayState = "paused";
    }

    function resumeDemo() {
      hoverPaused = false;
      if (offscreenPaused) return;
      if (progress) progress.style.animationPlayState = "running";
      scheduleNextTab();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () { activateTab(index); scheduleNextTab(); });
      tab.addEventListener("mouseenter", pauseDemo);
    });

    if (tabBar) tabBar.addEventListener("mouseenter", pauseDemo);
    if (appViewport) appViewport.addEventListener("mouseenter", pauseDemo);
    root.addEventListener("mouseleave", resumeDemo);

    root.querySelectorAll(".kio-pin[data-name]").forEach(function (pin) {
      pin.addEventListener("click", function () {
        root.querySelectorAll(".kio-pin[data-name]").forEach(function (item) { item.classList.remove("is-active"); });
        pin.classList.add("is-active");
        var leadName = root.querySelector("[data-lead-name]");
        var leadAddress = root.querySelector("[data-lead-address]");
        if (leadName) leadName.textContent = pin.getAttribute("data-name");
        if (leadAddress) leadAddress.textContent = pin.getAttribute("data-address");
        showToast("Lead preview updated");
      });
    });

    root.querySelectorAll(".kio-board-card").forEach(function (card) {
      card.addEventListener("dragstart", function () { draggedCard = card; card.classList.add("kio-dragging"); });
      card.addEventListener("dragend", function () { card.classList.remove("kio-dragging"); draggedCard = null; });
    });

    root.querySelectorAll("[data-dropzone]").forEach(function (zone) {
      zone.addEventListener("dragover", function (event) { event.preventDefault(); zone.classList.add("kio-drop-active"); });
      zone.addEventListener("dragleave", function () { zone.classList.remove("kio-drop-active"); });
      zone.addEventListener("drop", function () {
        zone.classList.remove("kio-drop-active");
        if (!draggedCard) return;
        var holder = zone.querySelector(".kio-card-stack");
        if (holder) { holder.appendChild(draggedCard); showToast("Lead moved to new stage"); }
      });
    });

    var payButton = root.querySelector("[data-pay-invoice]");
    if (payButton) {
      payButton.addEventListener("click", function () {
        var paidAmount = root.querySelector("[data-paid-amount]");
        var balanceAmount = root.querySelector("[data-balance-amount]");
        var invoiceStatus = root.querySelector("[data-invoice-status]");
        var historyList = root.querySelector("[data-history-list]");
        if (paidAmount) paidAmount.textContent = "$1,880.00";
        if (balanceAmount) balanceAmount.textContent = "$0.00";
        if (invoiceStatus) {
          invoiceStatus.textContent = "Paid";
          invoiceStatus.classList.remove("border-orange-300", "bg-orange-50", "text-orange-500");
          invoiceStatus.classList.add("border-primary-300", "bg-primary-50", "text-primary-600", "animate-kio-paid");
        }
        if (historyList) {
          var item = document.createElement("div");
          item.className = "relative pl-8 animate-kio-branch";
          item.innerHTML =
            '<span class="absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 border-solid border-primary-600 bg-white"></span>' +
            '<h4 class="text-[13px] font-medium text-neutral-900">Payment Added</h4>' +
            '<p class="text-[11px] font-medium text-neutral-500">Just now</p>';
          historyList.appendChild(item);
        }
        showToast("Payment added successfully");
      });
    }

    root.querySelectorAll("[data-toast-message]").forEach(function (button) {
      button.addEventListener("click", function () {
        showToast(button.getAttribute("data-toast-message"));
      });
    });

    root.querySelectorAll("[data-add-action]").forEach(function (button) {
      button.addEventListener("click", function () {
        var branch = button.closest(".kio-flow-branch");
        if (!branch) { showToast("Action added"); return; }
        var emptyState = button.closest(".border-dashed.border-violet-300");
        if (emptyState) emptyState.classList.add("hidden");
        var insertBeforeEl = button.closest(".flex.flex-col.items-center") || emptyState || button;
        var block = document.createElement("div");
        block.className = "flex w-full flex-col items-center animate-kio-branch";
        block.innerHTML =
          '<div class="relative w-full rounded-lg border border-solid border-neutral-200 bg-white p-3 shadow-sm">' +
          '<span class="mb-1 inline-flex items-center gap-1 rounded bg-blue-500 px-2 py-0.5 text-[9px] font-medium text-white">' +
          I("squareCheck", "text-[8px]") +
          ' Action</span>' +
          '<h4 class="text-[12px] font-semibold text-neutral-900">Create Task</h4>' +
          '<p class="mt-1 text-[10px] font-medium text-neutral-500">Follow up with <span class="rounded-full bg-violet-600 px-1.5 py-0.5 text-[9px] text-white">@ Name</span></p>' +
          '<button type="button" class="absolute right-2 top-2 text-neutral-400">' +
          I("ellipsisVertical", "text-xs") +
          "</button>" +
          "</div>" +
          '<div class="flex flex-col items-center"><div class="h-4 w-0.5 bg-violet-400"></div></div>';
        branch.insertBefore(block, insertBeforeEl);
        showToast("Automation action added");
      });
    });

    var testRunBtn = root.querySelector("[data-test-run]");
    if (testRunBtn) {
      testRunBtn.addEventListener("click", function () {
        root.querySelectorAll(".kio-flow-card, .kio-flow-branch").forEach(function (el, i) {
          setTimeout(function () {
            el.classList.add("kio-test-highlight");
            setTimeout(function () { el.classList.remove("kio-test-highlight"); }, 600);
          }, i * 200);
        });
        showToast("Test run completed — 6 steps executed");
      });
    }

    var mapListToggle = root.querySelector("[data-map-list-toggle]");
    var mapView = root.querySelector("[data-leads-map-view]");
    var listView = root.querySelector("[data-leads-list-view]");
    if (mapListToggle && mapView && listView) {
      mapListToggle.addEventListener("click", function () {
        var showingMap = !mapView.classList.contains("hidden");
        mapView.classList.toggle("hidden", showingMap);
        listView.classList.toggle("hidden", !showingMap);
        mapListToggle.innerHTML = showingMap
          ? I("map", "mr-1") + " Map"
          : I("list", "mr-1") + " List";
        showToast(showingMap ? "Switched to list view" : "Switched to map view");
      });
    }

    var io = new IntersectionObserver(
      function (entries) {
        offscreenPaused = !entries[0].isIntersecting;
        if (!offscreenPaused && !hoverPaused) {
          if (progress) progress.style.animationPlayState = "running";
          scheduleNextTab();
        } else {
          clearTimeout(progressTimer);
          if (progress) progress.style.animationPlayState = "paused";
        }
      },
      { threshold: 0.15 }
    );
    io.observe(root);

    activateTab(0);
  }

  function maybeInitDemo() {
    if (!desktopQuery.matches) return;
    initProductDemo();
  }
  maybeInitDemo();
  desktopQuery.addEventListener("change", maybeInitDemo);
})();

// ── 2. Platform Capabilities Scroll Tabs (on-demand lerp) ────────────────────
(function () {
  var compactQuery = window.matchMedia("(max-width: 1023px)");

  function isCompact() { return compactQuery.matches; }

  function getTrackMetrics(track) {
    var rect = track.getBoundingClientRect();
    return { trackTop: window.scrollY + rect.top, scrollable: Math.max(0, track.offsetHeight - window.innerHeight) };
  }

  function getScrollStepRaw(track, steps) {
    if (!track || steps < 1) return 0;
    var m = getTrackMetrics(track);
    if (m.scrollable <= 0) return 0;
    var y = window.scrollY;
    if (y <= m.trackTop) return 0;
    if (y >= m.trackTop + m.scrollable) return steps - 1;
    return Math.max(0, Math.min(steps - 1, ((y - m.trackTop) / m.scrollable) * (steps - 1)));
  }

  function scrollToTrackStep(track, steps, index) {
    if (!track || steps < 1) return;
    var m = getTrackMetrics(track);
    if (m.scrollable <= 0) return;
    var stepSize = m.scrollable / Math.max(1, steps - 1);
    window.scrollTo({ top: m.trackTop + stepSize * index, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function hpTabs1MoveIndicator(btn) {
    var nav = document.getElementById("hpTabs1Nav");
    var indicator = document.getElementById("hpTabs1Indicator");
    if (!nav || !indicator || !btn) return;
    var navRect = nav.getBoundingClientRect();
    var btnRect = btn.getBoundingClientRect();
    indicator.style.width = btnRect.width + "px";
    indicator.style.height = btnRect.height + "px";
    indicator.style.transform = "translate(" + (btnRect.left - navRect.left + nav.scrollLeft) + "px, " + (btnRect.top - navRect.top) + "px)";
  }

  function centerActiveTabInNav(btn) {
    if (!btn || !isCompact()) return;
    var nav = document.getElementById("hpTabs1Nav");
    if (!nav) return;
    var scrollLeft = btn.offsetLeft - nav.clientWidth / 2 + btn.offsetWidth / 2;
    nav.scrollTo({ left: scrollLeft, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function setPanelVisible(panel, visible) {
    if (!panel) return;
    panel.classList.toggle("opacity-100", visible);
    panel.classList.toggle("visible", visible);
    panel.classList.toggle("pointer-events-auto", visible);
    panel.classList.toggle("opacity-0", !visible);
    panel.classList.toggle("invisible", !visible);
    panel.classList.toggle("pointer-events-none", !visible);
  }

  function setCardVisible(card, visible) {
    if (!card) return;
    card.classList.toggle("opacity-100", visible);
    card.classList.toggle("translate-y-0", visible);
    card.classList.toggle("opacity-0", !visible);
    card.classList.toggle("translate-y-3", !visible);
  }

  function setTabButtonState(btn, isActive) {
    if (!btn) return;
    btn.classList.toggle("text-primary-500", isActive);
    btn.classList.toggle("text-neutral-700", !isActive);
    btn.classList.toggle("border-dashed", !isActive);
    btn.classList.toggle("border-neutral-300", !isActive);
    btn.classList.toggle("border-transparent", isActive);
  }

  function animateCards(panel) {
    if (!panel) return;
    panel.querySelectorAll(".hp-cap-card").forEach(function (card) { setCardVisible(card, false); });
    panel.querySelectorAll(".hp-cap-card").forEach(function (card, index) {
      setTimeout(function () { setCardVisible(card, true); }, index * 60);
    });
  }

  function getCompactTabIndex(panels) {
    var nav = document.getElementById("hpTabs1Nav");
    var offset = (nav ? nav.offsetHeight : 0) + 24;
    var marker = window.scrollY + offset;
    var active = 0;
    panels.forEach(function (panel, i) {
      var top = window.scrollY + panel.getBoundingClientRect().top;
      var bottom = top + panel.offsetHeight;
      if (marker >= top && marker < bottom) active = i;
    });
    var lastPanel = panels[panels.length - 1];
    if (lastPanel) {
      var lastBottom = window.scrollY + lastPanel.getBoundingClientRect().top + lastPanel.offsetHeight;
      if (marker >= lastBottom) active = panels.length - 1;
    }
    return active;
  }

  function scrollToCompactPanel(panel) {
    if (!panel) return;
    var nav = document.getElementById("hpTabs1Nav");
    var offset = (nav ? nav.offsetHeight : 0) + 16;
    var top = window.scrollY + panel.getBoundingClientRect().top - offset;
    window.scrollTo({ top: top, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function initPlatformScrollScrolly() {
    var track = document.getElementById("hpCapScrollTrack");
    if (!track) return;
    var panels = track.querySelectorAll(".hpTabs1_content");
    var navItems = document.querySelectorAll("#hpTabs1Nav .hpTabs1_btn");
    var steps = panels.length;
    var currentIndex = -1;
    var compactMode = isCompact() && !reducedMotion;
    var header = document.querySelector(".kh-header");
    var HEADER_HIDE_OFFSET = 68;
    var lerpTarget = 0;
    var lerpCurrent = 0;
    var LERP_FACTOR = 0.12;
    var lerpRunning = false;

    function manageHeaderVisibility() {
      if (!header) return;
      var trackRect = track.getBoundingClientRect();
      var trackTop = trackRect.top;
      var trackBottom = trackRect.bottom;
      if (trackTop <= HEADER_HIDE_OFFSET && trackBottom > 0) {
        header.classList.add("kh-header-hidden");
      } else {
        header.classList.remove("kh-header-hidden");
      }
    }

    function setTabOnly(index) {
      if (index < 0 || index >= steps || index === currentIndex) return;
      currentIndex = index;
      navItems.forEach(function (btn, i) { setTabButtonState(btn, i === index); });
      hpTabs1MoveIndicator(navItems[index]);
      centerActiveTabInNav(navItems[index]);
    }

    function setDesktopStep(index) {
      if (index < 0 || index >= steps || index === currentIndex) return;
      currentIndex = index;
      panels.forEach(function (panel, i) { setPanelVisible(panel, i === index); });
      navItems.forEach(function (btn, i) { setTabButtonState(btn, i === index); });
      hpTabs1MoveIndicator(navItems[index]);
      animateCards(panels[index]);
    }

    function lerpTick() {
      var diff = lerpTarget - lerpCurrent;
      if (Math.abs(diff) < 0.01) {
        lerpCurrent = lerpTarget;
        setDesktopStep(Math.round(lerpCurrent));
        lerpRunning = false;
        return;
      }
      lerpCurrent += diff * LERP_FACTOR;
      setDesktopStep(Math.round(lerpCurrent));
      requestAnimationFrame(lerpTick);
    }
    function wakeLerp() {
      if (!lerpRunning) {
        lerpRunning = true;
        requestAnimationFrame(lerpTick);
      }
    }

    function updateDesktop() {
      var t = getScrollStepRaw(track, steps);
      if (t !== lerpTarget) { lerpTarget = t; wakeLerp(); }
    }

    function updateCompact() { setTabOnly(getCompactTabIndex(panels)); }
    function update() { if (compactMode) updateCompact(); else if (!reducedMotion) updateDesktop(); }

    if (reducedMotion) {
      panels.forEach(function (panel) {
        setPanelVisible(panel, true);
        panel.querySelectorAll(".hp-cap-card").forEach(function (card) { setCardVisible(card, true); });
      });
      navItems.forEach(function (btn, i) { setTabButtonState(btn, i === 0); });
      hpTabs1MoveIndicator(navItems[0]);
      return;
    }

    if (compactMode) {
      panels.forEach(function (panel) {
        setPanelVisible(panel, true);
        panel.querySelectorAll(".hp-cap-card").forEach(function (card) { setCardVisible(card, true); });
      });
    }

    navItems.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var index = parseInt(btn.getAttribute("data-hp-scroll-step"), 10);
        if (isNaN(index)) return;
        if (compactMode) {
          currentIndex = index;
          lerpTarget = index;
          lerpCurrent = index;
          setTabButtonState(btn, true);
          navItems.forEach(function (other, i) { if (i !== index) setTabButtonState(other, false); });
          hpTabs1MoveIndicator(btn);
          centerActiveTabInNav(btn);
          scrollToCompactPanel(panels[index]);
        } else {
          lerpTarget = index;
          lerpCurrent = index;
          scrollToTrackStep(track, steps, index);
        }
      });
    });

    var ticking = false;
    function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(function () { update(); manageHeaderVisibility(); ticking = false; }); }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
      var wasCompact = compactMode;
      compactMode = isCompact() && !reducedMotion;
      if (compactMode) {
        panels.forEach(function (panel) {
          setPanelVisible(panel, true);
          panel.querySelectorAll(".hp-cap-card").forEach(function (card) { setCardVisible(card, true); });
        });
      } else if (wasCompact) {
        panels.forEach(function (panel, i) { setPanelVisible(panel, i === 0); });
        currentIndex = -1;
      }
      onScroll();
      var activeBtn = navItems[currentIndex >= 0 ? currentIndex : 0];
      hpTabs1MoveIndicator(activeBtn);
      centerActiveTabInNav(activeBtn);
    });
    update();
    manageHeaderVisibility();
    if (compactMode) { setTabOnly(0); centerActiveTabInNav(navItems[0]); }
    else { hpTabs1MoveIndicator(navItems[0]); lerpCurrent = 0; lerpTarget = 0; }
  }

  initPlatformScrollScrolly();
})();

// ── 3. Workflow Scroll Steps ─────────────────────────────────────────────────
(function () {
  var track = document.getElementById("workflowScrollTrack");
  if (!track) return;
  var mobileQuery = window.matchMedia("(max-width: 1023px)");
  var panels = track.querySelectorAll(".workflow-step-panel");
  var navItems = document.querySelectorAll("#workflowStepsNav .step-item");
  var stage = document.getElementById("workflow-scroll-stage");
  var header = document.getElementById("workflowHeaderSticky");
  var steps = panels.length;
  var currentIndex = -1;
  var HEADER_HIDE_RANGE = 320;

  function isMobile() { return mobileQuery.matches; }

  function resetScrollyState() {
    currentIndex = -1;
    if (stage) { stage.style.setProperty("--wf-header-progress", "0"); stage.classList.remove("is-intro-done", "is-header-hidden"); }
    if (header) { header.style.visibility = "visible"; header.setAttribute("aria-hidden", "false"); }
  }

  function getTrackMetrics() {
    var rect = track.getBoundingClientRect();
    return { trackTop: window.scrollY + rect.top, scrollable: Math.max(0, track.offsetHeight - window.innerHeight) };
  }

  function getScrollStepIndex() {
    if (steps < 1) return 0;
    var m = getTrackMetrics();
    if (m.scrollable <= 0) return 0;
    var y = window.scrollY;
    if (y <= m.trackTop) return 0;
    if (y >= m.trackTop + m.scrollable) return steps - 1;
    return Math.min(steps - 1, Math.round(((y - m.trackTop) / m.scrollable) * (steps - 1)));
  }

  function scrollToTrackStep(index) {
    var m = getTrackMetrics();
    if (m.scrollable <= 0) return;
    window.scrollTo({ top: m.trackTop + (m.scrollable / Math.max(1, steps - 1)) * index, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function setNavItemActive(item, active) {
    if (!item) return;
    item.classList.toggle("is-nav-active", active);
    item.setAttribute("aria-current", active ? "step" : "false");
  }

  function animatePanel(panel) {
    if (!panel) return;
    var parts = panel.querySelectorAll(".wf-step-text, .wf-step-media");
    if (reducedMotion) { parts.forEach(function (el) { el.classList.add("wf-in"); }); return; }
    parts.forEach(function (el) { el.classList.remove("wf-in"); });
    parts.forEach(function (el, i) { setTimeout(function () { el.classList.add("wf-in"); }, i * 80); });
  }

  function setStep(index) {
    if (index < 0 || index >= steps || index === currentIndex) return;
    currentIndex = index;
    panels.forEach(function (panel, i) {
      panel.classList.toggle("is-active", i === index);
      if (i !== index) panel.querySelectorAll(".wf-step-text, .wf-step-media").forEach(function (el) { el.classList.remove("wf-in"); });
    });
    navItems.forEach(function (item, i) { setNavItemActive(item, i === index); });
    animatePanel(panels[index]);
  }

  function updateHeaderState() {
    if (!stage || !header) return;
    if (isMobile()) {
      stage.style.setProperty("--wf-header-progress", "0");
      header.style.visibility = "visible";
      stage.classList.remove("is-intro-done", "is-header-hidden");
      return;
    }
    var m = getTrackMetrics();
    var y = window.scrollY;
    var inSection = y >= m.trackTop && y <= m.trackTop + m.scrollable + window.innerHeight * 0.1;
    var progress = !inSection ? (y < m.trackTop ? 0 : 1) : (reducedMotion ? (y > m.trackTop + 120 ? 1 : 0) : Math.min(1, Math.max(0, (y - m.trackTop) / HEADER_HIDE_RANGE)));
    stage.style.setProperty("--wf-header-progress", String(progress));
    var hidden = progress >= 0.995;
    header.style.visibility = hidden ? "hidden" : "visible";
    header.setAttribute("aria-hidden", hidden ? "true" : "false");
    stage.classList.toggle("is-header-hidden", hidden);
  }

  function update() {
    if (reducedMotion || isMobile()) return;
    updateHeaderState();
    setStep(getScrollStepIndex());
  }

  if (reducedMotion || isMobile()) {
    resetScrollyState();
    panels.forEach(function (p, i) {
      p.classList.add("is-active");
      p.querySelectorAll(".wf-step-text, .wf-step-media").forEach(function (el) { el.classList.add("wf-in"); });
      setNavItemActive(navItems[i], i === 0);
    });
    return;
  }

  navItems.forEach(function (item) {
    item.addEventListener("click", function () {
      var index = parseInt(item.getAttribute("data-hp-scroll-step"), 10);
      if (!isNaN(index)) scrollToTrackStep(index);
    });
  });

  mobileQuery.addEventListener("change", function () { resetScrollyState(); if (!isMobile() && !reducedMotion) { setStep(0); update(); } });
  var ticking = false;
  window.addEventListener("scroll", function () { if (ticking) return; ticking = true; requestAnimationFrame(function () { update(); ticking = false; }); }, { passive: true });
  window.addEventListener("resize", function () { if (isMobile()) resetScrollyState(); update(); });
  resetScrollyState(); setStep(0); update();
})();

// ── 4. Calculator + Checkout ─────────────────────────────────────────────────
(function () {
  function getParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }
  function getSource() {
    var source = getParam("source");
    var utmSource = getParam("utm_source");
    if (source) return source;
    if (utmSource) return utmSource;
    return "direct";
  }
  function buildCheckoutUrl(packageId) {
    var url = new URL("https://checkout.knockio.com/");
    var gclid = getParam("gclid");
    var source = getSource();
    url.searchParams.set("users", "5");
    if (packageId) url.searchParams.set("package", packageId);
    if (gclid) url.searchParams.set("gclid", gclid);
    if (source) url.searchParams.set("source", source);
    return url.toString();
  }
  document.addEventListener("click", function (e) {
    var button = e.target.closest(".knockio-checkout-btn");
    if (!button) return;
    e.preventDefault();
    var packageId = button.getAttribute("data-package");
    window.location.href = buildCheckoutUrl(packageId);
  });

  var RATES = {
    prospect: { rate_1_4: 25, rate_5p: 20 },
    organise: { rate_1_4: 35, rate_5p: 30 },
    growth: { rate_1_4: 60, rate_5p: 45 },
  };
  var ENGAGE_RATE = 15;

  function fmt(n) {
    return "$" + (Math.round(n * 100) / 100).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  function calculateCalculator(calcEl) {
    var usersInput = calcEl.querySelector("[data-kio-users]");
    var planInput = calcEl.querySelector("[data-kio-plan]");
    var linesInput = calcEl.querySelector("[data-kio-lines]");
    var totalEl = calcEl.querySelector("[data-kio-total]");
    var breakdownEl = calcEl.querySelector("[data-kio-breakdown]");
    if (!usersInput || !planInput || !linesInput || !totalEl || !breakdownEl) return;

    var usersRaw = usersInput.value.trim();
    var linesRaw = linesInput.value.trim();
    var plan = planInput.value;

    var usersEmpty = usersRaw === "";
    var linesEmpty = linesRaw === "";
    var users = usersEmpty ? 0 : Math.max(0, parseInt(usersRaw, 10) || 0);
    var lines = linesEmpty ? 0 : Math.max(0, parseInt(linesRaw, 10) || 0);

    if (usersEmpty) {
      totalEl.textContent = "$25 / mo";
      breakdownEl.textContent = "1 user × $25";
      return;
    }

    var rate = users >= 5 ? RATES[plan].rate_5p : RATES[plan].rate_1_4;
    var total = users * rate + lines * ENGAGE_RATE;
    totalEl.textContent = fmt(total) + " / mo";

    var breakdown = users + " user" + (users === 1 ? "" : "s") + " × " + fmt(rate);
    if (lines > 0) breakdown += " + " + lines + " phone number" + (lines === 1 ? "" : "s") + " × " + fmt(ENGAGE_RATE);
    breakdownEl.textContent = breakdown;
  }

  function initCalculator(calcEl) {
    calcEl.querySelectorAll("[data-kio-users], [data-kio-plan], [data-kio-lines]").forEach(function (field) {
      field.addEventListener("input", function () { calculateCalculator(calcEl); });
      field.addEventListener("change", function () { calculateCalculator(calcEl); });
    });
    calculateCalculator(calcEl);
  }

  document.querySelectorAll("[data-kio-calc]").forEach(initCalculator);
})();

// ── 5. FAQ Accordion ─────────────────────────────────────────────────────────
(function () {
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var button = item.querySelector(".faq-button");
    if (!button) return;

    button.addEventListener("click", function () {
      var isOpen = item.hasAttribute("data-open");

      document.querySelectorAll(".faq-item").forEach(function (other) {
        other.removeAttribute("data-open");
        var content = other.querySelector(".faq-content");
        if (content) content.style.maxHeight = null;
      });

      if (!isOpen) {
        item.setAttribute("data-open", "");
        var content = item.querySelector(".faq-content");
        if (content) content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
})();
