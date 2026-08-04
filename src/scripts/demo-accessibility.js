// Accessible names for the interactive controls inside the product demo.
// The demo is shared by the production homepage and its test clone. Some
// controls are generated after the document is parsed, so keeping the naming
// rules next to the demo behaviour prevents the two versions from drifting.

const TOAST_LABELS = {
  "Layers toggled": "Toggle map layers",
  "Satellite view": "Show satellite map",
  "Center on location": "Center map on location",
  Fullscreen: "Open map in fullscreen",
  "Center on route": "Center map on route",
};

function subjectFor(button) {
  const card = button.closest("article, [data-flow-block]");
  const heading = card?.querySelector("h3, h4");
  return heading?.textContent?.trim() || "this item";
}

function hasIcon(button, selector) {
  return Boolean(button.querySelector(selector));
}

function getLabel(button) {
  const leadName = button.getAttribute("data-name");
  if (leadName) return `View lead details for ${leadName}`;

  const toastMessage = button.getAttribute("data-toast-message");
  if (toastMessage && TOAST_LABELS[toastMessage]) {
    return TOAST_LABELS[toastMessage];
  }

  if (button.matches("[data-add-action]")) return "Add action";
  if (button.matches(".kio-pin")) return "View lead details";
  if (button.querySelector(".hidden") && /smart tv/i.test(button.textContent)) {
    return "Choose display";
  }

  if (hasIcon(button, ".fa-bell, .lucide-bell")) return "View notifications";
  if (hasIcon(button, ".fa-magnifying-glass, .lucide-search")) return "Search";
  if (hasIcon(button, ".fa-layer-group, .lucide-layers")) return "Toggle map layers";
  if (hasIcon(button, ".fa-satellite, .lucide-satellite")) return "Show satellite map";
  if (hasIcon(button, ".fa-location-crosshairs, .lucide-locate-fixed")) return "Center map on location";
  if (hasIcon(button, ".fa-expand, .lucide-maximize")) return "Open map in fullscreen";
  if (hasIcon(button, ".fa-phone, .lucide-phone")) return `Call ${subjectFor(button)}`;
  if (hasIcon(button, ".fa-envelope, .lucide-mail")) return `Email ${subjectFor(button)}`;
  if (hasIcon(button, ".fa-note-sticky, .lucide-sticky-note")) return `View notes for ${subjectFor(button)}`;
  if (hasIcon(button, ".fa-clock-rotate-left, .lucide-history")) return "View activity history";
  if (hasIcon(button, ".fa-xmark, .lucide-x")) return "Close panel";
  if (hasIcon(button, ".fa-ellipsis, .lucide-ellipsis, .fa-ellipsis-vertical, .lucide-ellipsis-vertical")) {
    return `More actions for ${subjectFor(button)}`;
  }
  if (hasIcon(button, ".fa-plus, .lucide-plus")) return "Add item";

  // The round account control uses a single initial as its visual content.
  if (/^[A-Z]$/.test(button.textContent.trim())) return "Open account menu";
  return "";
}

export function labelDemoControls(root) {
  root.querySelectorAll("button").forEach((button) => {
    if (button.hasAttribute("aria-label") || button.hasAttribute("aria-labelledby")) return;

    const visibleText = button.textContent.trim();
    const label = getLabel(button);

    // Buttons with actual words already have a discernible name. Icon-only
    // controls and the one-letter account control receive a precise label.
    if (!visibleText || /^[A-Z]$/.test(visibleText) || button.querySelector(".hidden")) {
      if (label) button.setAttribute("aria-label", label);
    }
  });
}

function labelInitialDemo() {
  const root = document.querySelector(".kio-product-demo");
  if (root) labelDemoControls(root);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", labelInitialDemo, { once: true });
} else {
  labelInitialDemo();
}
