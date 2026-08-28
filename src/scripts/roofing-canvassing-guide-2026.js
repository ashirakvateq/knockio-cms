(function () {
  "use strict";

  const form = document.getElementById("fluentform_4");
  const errorsContainer = document.getElementById("fluentform_4_errors");
  const PDF_URL = "/assets/cfw/The-Complete-Roofing-Canvassing-Guide-2026.pdf";

  // Smooth scroll and focus on form inputs when CTA buttons are clicked
  const ctaLinks = document.querySelectorAll('a[href="#form-canvassing"]');
  ctaLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.getElementById("form-canvassing");
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        const firstInput = form ? form.querySelector("input:not([type=hidden])") : null;
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 500);
        }
      }
    });
  });

  if (!form) return;

  function clearErrors() {
    if (errorsContainer) {
      errorsContainer.innerHTML = "";
    }
    const errorGroups = form.querySelectorAll(".ff-el-is-error");
    errorGroups.forEach((group) => group.classList.remove("ff-el-is-error"));
    const errorMessages = form.querySelectorAll(".ff-el-help-message.error");
    errorMessages.forEach((msg) => msg.remove());
  }

  function showError(input, message) {
    const group = input.closest(".ff-el-group");
    if (group) {
      group.classList.add("ff-el-is-error");
      const errorMsg = document.createElement("div");
      errorMsg.className = "ff-el-help-message error";
      errorMsg.textContent = message;
      group.appendChild(errorMsg);
    }
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    clearErrors();

    const firstName = form.querySelector('input[name="names[first_name]"]');
    const lastName = form.querySelector('input[name="names[last_name]"]');
    const email = form.querySelector('input[name="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');

    let hasError = false;

    if (firstName && !firstName.value.trim()) {
      showError(firstName, "This field is required");
      hasError = true;
    }

    if (lastName && !lastName.value.trim()) {
      showError(lastName, "This field is required");
      hasError = true;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email) {
      if (!email.value.trim()) {
        showError(email, "This field is required");
        hasError = true;
      } else if (!emailPattern.test(email.value.trim())) {
        showError(email, "This field must contain a valid email");
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }

    const originalBtnText = submitBtn ? submitBtn.textContent : "Get the Guide";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Getting the Guide...";
    }

    try {
      const formData = new FormData(form);
      const serializedParams = new URLSearchParams();
      for (const [key, value] of formData.entries()) {
        serializedParams.append(key, value);
      }

      const postBody = new URLSearchParams();
      postBody.append("action", "fluentform_submit");
      postBody.append("form_id", "4");
      postBody.append("data", serializedParams.toString());

      const response = await fetch("https://knockio.com/wp-admin/admin-ajax.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: postBody.toString(),
      });

      const data = await response.json().catch(() => null);

      if (data && data.success && data.data && data.data.result && data.data.result.redirectUrl) {
        window.location.href = data.data.result.redirectUrl;
        return;
      }

      if (data && data.errors) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
        for (const [field, msg] of Object.entries(data.errors)) {
          const inputEl = form.querySelector(`[name="${field}"]`);
          if (inputEl) {
            showError(inputEl, typeof msg === "object" ? Object.values(msg)[0] : msg);
          }
        }
        return;
      }

      // If success without explicit redirectUrl or generic success response
      window.location.href = PDF_URL;
    } catch {
      // Fallback redirect to PDF if network or CORS prevents ajax
      window.location.href = PDF_URL;
    }
  });
})();
