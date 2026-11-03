/* =========================================================
   Aurora & Co. — Wedding Planner Website
   JavaScript: navigation, DOM manipulation, filtering,
   counters, reveal animations and form handling
   ========================================================= */

(function () {
  "use strict";

  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------------------------------------------------------
     1. Current year in the footer
     ------------------------------------------------------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* -------------------------------------------------------
     2. Mobile navigation (hamburger)
     ------------------------------------------------------- */
  const navToggle = $("#navToggle");
  const primaryNav = $("#primaryNav");

  function setNav(open) {
    if (!navToggle || !primaryNav) return;
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close main menu" : "Open main menu");
    primaryNav.classList.toggle("is-open", open);
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      setNav(navToggle.getAttribute("aria-expanded") !== "true");
    });

    // Close after choosing a section
    primaryNav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setNav(false);
    });

    // Close on Escape and return focus to the toggle
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        setNav(false);
        navToggle.focus();
      }
    });

    // Close when resizing back to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) setNav(false);
    });
  }

  /* -------------------------------------------------------
     3. Sticky header shadow + back-to-top button
     ------------------------------------------------------- */
  const header = $(".site-header");
  const toTop = $("#toTop");

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-stuck", y > 12);
    if (toTop) toTop.hidden = y < 500;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* -------------------------------------------------------
     4. Scroll spy — highlight the active nav link
     ------------------------------------------------------- */
  const navLinks = $$(".primary-nav a[href^='#']").filter((a) => a.hash);
  const sections = navLinks
    .map((a) => document.getElementById(a.hash.slice(1)))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            const active = link.hash === "#" + entry.target.id;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((sec) => spy.observe(sec));
  }

  /* -------------------------------------------------------
     5. Reveal-on-scroll animation
     ------------------------------------------------------- */
  const revealTargets = $$(".section-head, .skill-card, .project-card, .timeline-item, .quote-card, .profile-portrait, .section-body, .contact-info, .contact-form");

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    revealTargets.forEach((el) => el.classList.add("reveal"));
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  /* -------------------------------------------------------
     6. Animated hero counters
     ------------------------------------------------------- */
  const counters = $$("[data-count]");

  function animateCounter(el) {
    const target = Number(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || "";
    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  if (counters.length) {
    if ("IntersectionObserver" in window) {
      const counterObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((el) => counterObserver.observe(el));
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* -------------------------------------------------------
     7. Projects filter (DOM manipulation)
     ------------------------------------------------------- */
  const filterButtons = $$(".filter-btn");
  const projectCards = $$(".project-card");
  const filterStatus = $("#filterStatus");

  function applyFilter(category) {
    let visible = 0;

    projectCards.forEach((card) => {
      const match = category === "all" || card.dataset.category === category;
      card.hidden = !match;
      if (match) visible++;
    });

    filterButtons.forEach((btn) => {
      const active = btn.dataset.filter === category;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    if (filterStatus) {
      const label = category === "all" ? "all " + visible + " projects" : visible + " " + category + " project" + (visible === 1 ? "" : "s");
      filterStatus.textContent = "Showing " + label;
    }
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
  });

  /* -------------------------------------------------------
     8. Contact form — validation & handling
     ------------------------------------------------------- */
  const form = $("#contactForm");
  const formStatus = $("#formStatus");

  const validators = {
    fullName: (v) => (v.trim().length >= 2 ? "" : "Please enter your full name (at least 2 characters)."),
    email: (v) => {
      if (!v.trim()) return "Please enter your email address.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "That email doesn't look right — try name@example.com.";
    },
    phone: (v) => {
      if (!v.trim()) return "";
      return /^[\d\s()+.\-]{7,20}$/.test(v.trim()) ? "" : "Enter a valid phone number, or leave it blank.";
    },
    eventType: (v) => (v ? "" : "Please choose an event type."),
    eventDate: (v) => {
      if (!v) return "";
      const chosen = new Date(v + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return chosen >= today ? "" : "The date must be in the future.";
    },
    guestCount: (v) => {
      if (!v.trim()) return "";
      const n = Number(v);
      return Number.isFinite(n) && n >= 1 && n <= 100000 ? "" : "Enter a guest count between 1 and 100,000.";
    },
    message: (v) => (v.trim().length >= 15 ? "" : "Tell me a little more — 15 characters minimum."),
    consent: (_, field) => (field.checked ? "" : "Please tick the box so I can reply to you.")
  };

  function fieldOf(input) {
    return input.closest(".field") || input.parentElement;
  }

  function showError(input, message) {
    const errEl = document.getElementById("err-" + input.id);
    const wrap = fieldOf(input);
    if (wrap) {
      wrap.classList.toggle("is-invalid", Boolean(message));
      wrap.classList.toggle("is-valid", !message && Boolean(input.value || (input.type === "checkbox" && input.checked)));
    }
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (errEl) errEl.textContent = message;
    return !message;
  }

  function validateField(input) {
    const rule = validators[input.id];
    if (!rule) return true;
    return showError(input, rule(input.value, input));
  }

  if (form) {
    const inputs = $$("input, select, textarea", form).filter((el) => validators[el.id]);

    // Validate on blur; clear/re-validate while typing after the first error
    inputs.forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.getAttribute("aria-invalid") === "true") validateField(input);
      });
      input.addEventListener("change", () => validateField(input));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const results = inputs.map(validateField);
      const firstInvalid = inputs.find((input) => input.getAttribute("aria-invalid") === "true");

      if (results.includes(false)) {
        if (formStatus) {
          formStatus.className = "form-status is-error";
          formStatus.textContent = "Please fix the highlighted fields and try again.";
        }
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // All valid — simulate submission
      const submitBtn = $("#submitBtn");
      const originalLabel = submitBtn ? submitBtn.textContent : "";

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }
      if (formStatus) {
        formStatus.className = "form-status";
        formStatus.textContent = "";
      }

      window.setTimeout(() => {
        const name = $("#fullName").value.trim().split(" ")[0];
        if (formStatus) {
          formStatus.className = "form-status is-success";
          formStatus.textContent =
            "Thank you, " + name + "! Your enquiry has been received — you'll hear back within two business days.";
        }

        try {
          const submissions = JSON.parse(localStorage.getItem("auroraEnquiries") || "[]");
          submissions.push({
            name: $("#fullName").value.trim(),
            email: $("#email").value.trim(),
            eventType: $("#eventType").value,
            message: $("#message").value.trim(),
            sentAt: new Date().toISOString()
          });
          localStorage.setItem("auroraEnquiries", JSON.stringify(submissions));
        } catch (err) {
          /* storage unavailable — the confirmation still stands */
        }

        form.reset();
        inputs.forEach((input) => showError(input, ""));
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      }, 700);
    });
  }

  /* -------------------------------------------------------
     9. Smooth-scroll fallback for older browsers
     ------------------------------------------------------- */
  if (!("scrollBehavior" in document.documentElement.style)) {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const target = document.getElementById(link.hash.slice(1));
        if (!target) return;
        e.preventDefault();
        window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 80);
      });
    });
  }
})();
