/**
 * Advanced Portfolio Interactive Features
 * - Dynamic Light / Dark Mode Theme Switcher with LocalStorage & OS Sync
 * - Accessible Mobile Navigation Drawer with Outside-Click & Escape Handling
 * - Contact Form Validation & Live Status Announcements
 * - Dynamic Date Formatting
 */

(() => {
  "use strict";

  /* ==========================================================================
     1. Dynamic Light / Dark Theme Architecture
     ========================================================================== */
  const root = document.documentElement;
  const themeToggleBtns = document.querySelectorAll(".theme-toggle");
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  const THEME_STORAGE_KEY = "suraj_portfolio_theme";

  const getSystemTheme = () => (systemPrefersDark.matches ? "dark" : "light");

  const getActiveTheme = () => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "dark" || saved === "light" ? saved : getSystemTheme();
  };

  const updateThemeUI = (theme) => {
    root.setAttribute("data-theme", theme);

    // Update meta theme-color for mobile browser header bar
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", theme === "dark" ? "#090d16" : "#f8fafc");
    }

    // Update toggle buttons aria labels & titles
    const nextThemeLabel = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
    themeToggleBtns.forEach((btn) => {
      btn.setAttribute("aria-label", nextThemeLabel);
      btn.setAttribute("title", nextThemeLabel);
    });
  };

  const setTheme = (theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    updateThemeUI(theme);
  };

  // Initialize theme immediately
  const initialTheme = getActiveTheme();
  updateThemeUI(initialTheme);

  // Attach click listener to theme toggle buttons
  themeToggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || getActiveTheme();
      const nextTheme = current === "dark" ? "light" : "dark";
      setTheme(nextTheme);
    });
  });

  // Listen to OS-level theme preference changes in real time
  systemPrefersDark.addEventListener("change", (e) => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      updateThemeUI(e.matches ? "dark" : "light");
    }
  });

  /* ==========================================================================
     2. Responsive Navigation Toggle & Accessibility
     ========================================================================== */
  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.querySelector("#primary-navigation");
  const header = document.querySelector(".site-header");

  if (navToggle && primaryNav) {
    const closeNav = () => {
      navToggle.setAttribute("aria-expanded", "false");
      primaryNav.classList.remove("is-open");
    };

    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isExpanded));
      primaryNav.classList.toggle("is-open", !isExpanded);
    });

    // Close when clicking outside of the header
    document.addEventListener("click", (event) => {
      if (header && !header.contains(event.target) && primaryNav.classList.contains("is-open")) {
        closeNav();
      }
    });

    // Close when pressing the Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && primaryNav.classList.contains("is-open")) {
        closeNav();
        navToggle.focus();
      }
    });

    // Close mobile nav when clicking any link inside it
    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 900) {
          closeNav();
        }
      });
    });
  }

  /* ==========================================================================
     3. Footer Dynamic Year
     ========================================================================== */
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  /* ==========================================================================
     4. Contact Form Validation & Feedback Simulation
     ========================================================================== */
  const contactForm = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) {
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : "Send message";

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      // Simulate instantaneous accessible feedback
      setTimeout(() => {
        formStatus.textContent = "✓ Thank you! Your message was received successfully (front-end demo).";
        formStatus.style.color = "var(--status-success)";
        contactForm.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }

        setTimeout(() => {
          formStatus.textContent = "";
        }, 8000);
      }, 400);
    });
  }
})();
