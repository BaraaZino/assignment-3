const Theme = (() => {
  // Handles theme selection, persistence, and system preference sync.
  const STORAGE_KEY = "portfolio-theme";

  const getPreferredTheme = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return stored;
    }
    //  check light or dark
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  };
  // Apply the theme
  const applyTheme = (theme) => {
    document.body.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  };

  const toggleTheme = () => {
    // Swap between light and dark modes on demand.
    const next = document.body.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
  };

  const listenForSystemChanges = () => {
    if (!window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(event.matches ? "dark" : "light");
      }
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handler);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handler);
    }
  };

  const init = () => {
    applyTheme(getPreferredTheme());

    const toggleButton = document.querySelector(".theme-toggle");
    if (toggleButton) {
      // Let users flip the theme manually.
      toggleButton.addEventListener("click", toggleTheme);
    }

    listenForSystemChanges();
  };

  return { init };
})();
//this is for saving the name
const Personalization = (() => {
  const STORAGE_KEY = "portfolio-preferred-name";
  const EVENT_NAME = "portfolio:preferrednamechange";

  const safeGet = () => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "";
    } catch {
      return "";
    }
  };

  const safeSet = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Swallow quota or privacy mode errors silently.
    }
  };

  const safeClear = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore removal failures.
    }
  };

  const emit = (name) => {
    document.dispatchEvent(
      new CustomEvent(EVENT_NAME, {
        detail: name,
      }),
    );
  };

  const setStatus = (element, message, tone = "info") => {
    if (!element) {
      return;
    }

    element.textContent = message;
    element.dataset.tone = tone;
    element.style.color = tone === "success" ? "#16a34a" : "inherit";
  };

  const init = () => {
    const form = document.getElementById("name-preference");
    const input = document.getElementById("preferred-name");
    const status = document.getElementById("name-feedback");
    const clearButton = document.getElementById("clear-name");

    const syncFromStorage = () => {
      const stored = safeGet();

      if (input) {
        input.value = stored;
      }

      if (stored) {
        setStatus(status, `Hi ${stored}! We'll greet you by name next time.`, "success");
      } else {
        setStatus(status, "Enter your name so the greeting feels personal.");
      }

      emit(stored);
    };

    syncFromStorage();

    if (!form || !input) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const value = input.value.trim();
      if (!value) {
        safeClear();
        setStatus(status, "Got it! We'll keep the greeting general.");
        emit("");
        input.value = "";
        return;
      }

      safeSet(value);
      setStatus(status, `Nice to meet you, ${value}!`, "success");
      emit(value);
    });

    if (clearButton) {
      clearButton.addEventListener("click", () => {
        safeClear();
        emit("");
        input.value = "";
        setStatus(status, "Preference cleared. The greeting stays general.");
      });
    }
  };

  const getName = () => safeGet();

  return { init, getName, EVENT_NAME };
})();
// different greeting for different times in a dat
const Greeting = (() => {
  let greetingEl;
// get the hourse from Date()
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const render = (name) => {
    if (!greetingEl) {
      return;
    }

    const salutation = getGreeting();
    const suffix = name ? `${name}! Welcome back.` : "welcome to my portfolio.";
    greetingEl.textContent = `${salutation}, ${suffix}`;
  };

  const init = () => {
    greetingEl = document.getElementById("greeting");
    if (!greetingEl) {
      return;
    }

    render(Personalization.getName());

    document.addEventListener(Personalization.EVENT_NAME, (event) => {
      render(event.detail || "");
    });
  };

  return { init };
})();

const Spotlight = (() => {
  const init = () => {
    const toggles = Array.from(document.querySelectorAll(".spotlight-toggle"));
    if (!toggles.length) {
      return;
    }

    const cards = new Map();
    Array.from(document.querySelectorAll("[data-spotlight]")).forEach((card, index) => {
      if (!(card instanceof HTMLElement)) {
        return;
      }

      const key = card.dataset.spotlight;
      if (!key) {
        return;
      }

      if (!card.id) {
        card.id = `spotlight-card-${index + 1}`;
      }

      cards.set(key, card);
    });

    if (!cards.size) {
      return;
    }

    const select = (key) => {
      cards.forEach((card, cardKey) => {
        const isActive = cardKey === key;
        card.toggleAttribute("hidden", !isActive);
        card.classList.toggle("is-visible", isActive);
      });
    };

    toggles.forEach((button) => {
      const { target } = button.dataset;
      const card = target ? cards.get(target) : null;

      if (!target || !card) {
        return;
      }

      button.setAttribute("aria-controls", card.id);

      button.addEventListener("click", () => {
        toggles.forEach((toggleButton) => {
          const active = toggleButton === button;
          toggleButton.setAttribute("aria-selected", String(active));
          toggleButton.classList.toggle("is-active", active);
        });

        select(target);
      });
    });

    const activeButton = toggles.find((button) => button.classList.contains("is-active")) ?? toggles[0];
    if (activeButton) {
      const key = activeButton.dataset.target;
      if (key) {
        select(key);
      }
    }
  };

  return { init };
})();
// Here I have the project details function (using the button)
const ProjectDetails = (() => {
  const init = () => {
    const toggles = Array.from(document.querySelectorAll(".project-toggle"));
    if (!toggles.length) {
      return;
    }

    toggles.forEach((toggle, index) => {
      const details = toggle.nextElementSibling;
      if (!(details instanceof HTMLElement)) {
        return;
      }

      const detailsId = details.id || `project-details-${index + 1}`;
      details.id = detailsId;
      toggle.setAttribute("aria-controls", detailsId);

      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        details.hidden = expanded;
      });
    });
  };

  return { init };
})();
// displayed error to user depending of what is the error when trying to submit
const ContactForm = (() => {
  const FIELD_CONFIG = {
    name: {
      messages: {
        valueMissing: "Please let me know your name so I can address you properly.",
        tooShort: "A name that short looks accidental—mind adding a bit more?",
      },
    },
    email: {
      messages: {
        valueMissing: "Your email helps me get back to you.",
        typeMismatch: "That email format looks off. Can you double-check it?",
      },
    },
    message: {
      messages: {
        valueMissing: "Share a short message about what you need help with.",
        tooShort: "A few more details will help me respond thoughtfully.",
      },
      minLength: 10,
    },
  };

  const setFeedback = (element, message, tone = "info") => {
    if (!element) {
      return;
    }

    element.textContent = message;
    element.classList.remove("success", "error");
    if (tone !== "info") {
      element.classList.add(tone);
      element.style.color = tone === "success" ? "#16a34a" : "#dc2626";
    } else {
      element.style.color = "inherit";
    }

    element.classList.remove("is-active");
    void element.offsetWidth; // Trigger reflow so animations restart.
    element.classList.add("is-active");
  };

  const showFieldError = (field, message) => {
    const { input, error } = field;
    if (!input) {
      return;
    }

    input.setAttribute("aria-invalid", "true");
    if (error) {
      error.textContent = message;
    }
  };

  const clearFieldError = (field) => {
    const { input, error } = field;
    if (!input) {
      return;
    }

    input.removeAttribute("aria-invalid");
    if (error) {
      error.textContent = "";
    }
  };

  const resolveMessage = (input, messages) => {
    if (input.validity.valueMissing && messages.valueMissing) {
      return messages.valueMissing;
    }

    if (input.validity.typeMismatch && messages.typeMismatch) {
      return messages.typeMismatch;
    }

    if (input.validity.tooShort && messages.tooShort) {
      return messages.tooShort;
    }

    return "Please check this field.";
  };

  const init = () => {
    const form = document.getElementById("contact-form");
    const feedback = document.getElementById("form-feedback");

    if (!form || !feedback) {
      return;
    }

    const fields = Object.entries(FIELD_CONFIG).reduce((acc, [name, config]) => {
      const input = form.elements.namedItem(name);
      const error = document.getElementById(`${name}-error`);

      if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
        if (config.minLength) {
          input.minLength = config.minLength;
        }

        acc[name] = { input, error, config };

        input.addEventListener("input", () => {
          if (input.checkValidity()) {
            clearFieldError(acc[name]);
          }
        });
      }

      return acc;
    }, {});

    const primeNameField = (name) => {
      const field = fields.name;
      if (field && !field.input.value) {
        field.input.value = name;
      }
    };

    const storedName = Personalization.getName();
    if (storedName) {
      primeNameField(storedName);
    }

    document.addEventListener(Personalization.EVENT_NAME, (event) => {
      const incomingName = event.detail;
      if (typeof incomingName === "string" && incomingName) {
        primeNameField(incomingName);
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      let hasError = false;
      Object.values(fields).forEach((field) => {
        if (!field.input.checkValidity()) {
          hasError = true;
          const message = resolveMessage(field.input, field.config.messages);
          showFieldError(field, message);
        } else {
          clearFieldError(field);
        }
      });

      if (hasError) {
        setFeedback(feedback, "Please fix the highlighted fields before sending.", "error");
        return;
      }

      const formData = new FormData(form);
      const name = formData.get("name")?.toString().trim() || "there";

      setFeedback(feedback, `Thanks ${name}! Your message is on its way.`, "success");
      form.reset();

      if (fields.name) {
        fields.name.input.value = Personalization.getName();
      }
    });
  };

  return { init };
})();

const Footer = (() => {
  // Updates the footer year dynamically to keep the copyright current.
  const init = () => {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  };

  return { init };
})();

const Header = (() => {
  // Applies a scrolled state to the header after a small offset.
  const SCROLL_THRESHOLD = 16;

  const init = () => {
    const header = document.querySelector(".site-header");
    if (!header) {
      return;
    }

    const updateState = () => {
      header.classList.toggle("is-scrolled", window.scrollY > SCROLL_THRESHOLD);
    };

    updateState();
    window.addEventListener("scroll", updateState, { passive: true });
  };

  return { init };
})();

const RevealAnimations = (() => {
  const init = () => {
    const elements = document.querySelectorAll("[data-animate]");
    if (!elements.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    elements.forEach((element) => observer.observe(element));
  };

  return { init };
})();

// Kick off all modules once the DOM is ready.
window.addEventListener("DOMContentLoaded", () => {
  Theme.init();
  Personalization.init();
  Greeting.init();
  Spotlight.init();
  ProjectDetails.init();
  ContactForm.init();
  RevealAnimations.init();
  Footer.init();
  Header.init();
});
