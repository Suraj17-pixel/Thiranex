(() => {
  "use strict";

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primary-navigation");

  if (toggle && nav) {
    const isOpen = () => toggle.getAttribute("aria-expanded") === "true";
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", () => setOpen(!isOpen()));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (isOpen() && !nav.contains(event.target) && !toggle.contains(event.target)) {
        setOpen(false);
      }
    });
  }

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");

  if (form && status) {
    // Keep native constraint validation for no-JS users; when JS is
    // available, show our own inline, screen-reader-friendly errors.
    form.noValidate = true;

    const messages = {
      name: { valueMissing: "Please enter your name." },
      email: {
        valueMissing: "Please enter your email address.",
        typeMismatch: "Please enter a valid email address, such as name@example.com."
      },
      message: { valueMissing: "Please enter a message." }
    };

    const errorElementFor = (field) => document.getElementById(`${field.id}-error`);

    const fields = Array.from(form.querySelectorAll("input, textarea")).filter(
      (field) => field.id && errorElementFor(field)
    );

    const clearError = (field) => {
      const error = errorElementFor(field);
      if (!error) return;
      error.textContent = "";
      field.removeAttribute("aria-invalid");
    };

    const showError = (field) => {
      const error = errorElementFor(field);
      if (!error) return;
      const reason = field.validity.valueMissing
        ? "valueMissing"
        : field.validity.typeMismatch
          ? "typeMismatch"
          : null;
      error.textContent = (messages[field.id] && messages[field.id][reason]) || "Please check this field.";
      field.setAttribute("aria-invalid", "true");
    };

    fields.forEach((field) => {
      field.addEventListener("input", () => {
        if (field.validity.valid) clearError(field);
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      let firstInvalid = null;
      fields.forEach((field) => {
        if (field.validity.valid) {
          clearError(field);
        } else {
          showError(field);
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (firstInvalid) {
        status.textContent = "";
        firstInvalid.focus();
        return;
      }

      status.textContent = "Thanks! This demo form is validated, but it is not connected to a message service yet.";
      form.reset();
      fields.forEach(clearError);
    });
  }
})();
