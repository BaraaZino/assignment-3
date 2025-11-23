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

const ProjectControls = (() => {
  const VISIBILITY_KEY = "portfolio-project-grid-visible";
  const SORT_KEY = "portfolio-project-sort";

  const readPreference = (key, fallback) => {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  };

  const writePreference = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore localStorage quota/privacy issues.
    }
  };

  const init = () => {
    const grid = document.getElementById("project-grid");
    const sortSelect = document.getElementById("project-sort");
    const toggleButton = document.getElementById("project-grid-toggle");

    if (!grid || !sortSelect || !toggleButton) {
      return;
    }

    const cards = Array.from(grid.querySelectorAll(".project-card"));
    if (!cards.length) {
      return;
    }

    const reorderCards = (sortValue) => {
      const sorted = [...cards].sort((a, b) => {
        if (sortValue === "name") {
          return (a.dataset.title || "").localeCompare(b.dataset.title || "");
        }

        const aDate = new Date(a.dataset.date || "");
        const bDate = new Date(b.dataset.date || "");

        if (sortValue === "oldest") {
          return aDate - bDate;
        }

        return bDate - aDate;
      });

      const fragment = document.createDocumentFragment();
      sorted.forEach((card) => fragment.appendChild(card));
      grid.appendChild(fragment);
    };

    const setGridVisibility = (isVisible) => {
      grid.classList.toggle("is-hidden", !isVisible);
      toggleButton.textContent = isVisible ? "Hide project grid" : "Show project grid";
      toggleButton.setAttribute("aria-pressed", String(!isVisible));
      writePreference(VISIBILITY_KEY, String(isVisible));
    };

    const storedSort = readPreference(SORT_KEY, "newest");
    if (["newest", "oldest", "name"].includes(storedSort)) {
      sortSelect.value = storedSort;
    }

    reorderCards(sortSelect.value);

    sortSelect.addEventListener("change", () => {
      const selected = sortSelect.value;
      reorderCards(selected);
      writePreference(SORT_KEY, selected);
    });

    const storedVisibility = readPreference(VISIBILITY_KEY, "true") !== "false";
    setGridVisibility(storedVisibility);

    toggleButton.addEventListener("click", () => {
      const willBeVisible = grid.classList.contains("is-hidden");
      setGridVisibility(willBeVisible);
    });
  };

  return { init };
})();

const GitHubFeed = (() => {
  const USERNAME = "baraazino";
  const API_URL = `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=5`;
  const CACHE_WINDOW_MS = 3 * 60 * 1000;

  let reposContainer;
  let statusElement;
  let refreshButton;
  let cachedRepos = null;
  let lastFetched = 0;

  const formatDate = (timestamp) => {
    try {
      const formatter = new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return formatter.format(new Date(timestamp));
    } catch {
      return "";
    }
  };

  const setStatus = (message, tone = "info") => {
    if (!statusElement) {
      return;
    }

    statusElement.textContent = message;
    statusElement.dataset.tone = tone;
  };

  const createTopicChips = (topics = []) => {
    const fragment = document.createDocumentFragment();
    topics.slice(0, 3).forEach((topic) => {
      const chip = document.createElement("span");
      chip.className = "github-topic";
      chip.textContent = topic;
      fragment.appendChild(chip);
    });
    return fragment;
  };

  const createRepoElement = (repo) => {
    const article = document.createElement("article");
    article.className = "github-repo";

    const heading = document.createElement("h3");
    heading.className = "github-repo__name";
    const repoLink = document.createElement("a");
    repoLink.href = repo.html_url;
    repoLink.target = "_blank";
    repoLink.rel = "noopener";
    repoLink.textContent = repo.name;
    heading.appendChild(repoLink);

    const description = document.createElement("p");
    description.textContent = repo.description || "No description provided yet.";

    const meta = document.createElement("p");
    meta.className = "github-repo__meta";
    const language = repo.language ? repo.language : "Unknown";
    meta.textContent = `${language} • Updated ${formatDate(repo.updated_at)}`;

    const statLine = document.createElement("p");
    statLine.className = "github-repo__meta";
    statLine.textContent = `Stars: ${repo.stargazers_count} • Forks: ${repo.forks_count}`;

    article.appendChild(heading);
    article.appendChild(description);
    article.appendChild(meta);
    article.appendChild(statLine);

    if (Array.isArray(repo.topics) && repo.topics.length) {
      const topicsLine = document.createElement("div");
      topicsLine.className = "github-repo__topics";
      topicsLine.appendChild(createTopicChips(repo.topics));
      article.appendChild(topicsLine);
    }

    return article;
  };

  const renderRepos = (repos) => {
    if (!reposContainer) {
      return;
    }

    reposContainer.innerHTML = "";
    const fragment = document.createDocumentFragment();
    repos.slice(0, 5).forEach((repo) => {
      fragment.appendChild(createRepoElement(repo));
    });
    reposContainer.appendChild(fragment);
  };

  const fetchRepos = async (force = false) => {
    if (!reposContainer) {
      return;
    }

    const isCacheFresh = cachedRepos && Date.now() - lastFetched < CACHE_WINDOW_MS;
    if (!force && isCacheFresh) {
      renderRepos(cachedRepos);
      setStatus("Showing cached GitHub activity from the last sync.");
      return;
    }

    setStatus("Loading GitHub repositories...");
    try {
      const response = await fetch(API_URL, {
        headers: { Accept: "application/vnd.github+json" },
      });

      if (!response.ok) {
        throw new Error(`GitHub responded with ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data) || !data.length) {
        reposContainer.innerHTML = "";
        setStatus("No public repositories found right now.", "info");
        cachedRepos = [];
        lastFetched = Date.now();
        return;
      }

      cachedRepos = data;
      lastFetched = Date.now();
      renderRepos(cachedRepos);
      setStatus("Synced with GitHub moments ago.", "success");
    } catch (error) {
      console.error(error);
      reposContainer.innerHTML = "";
      setStatus("Unable to load GitHub activity. Please try again shortly.", "error");
    }
  };

  const init = () => {
    reposContainer = document.getElementById("github-repos");
    statusElement = document.getElementById("github-status");
    refreshButton = document.getElementById("github-refresh");

    if (!reposContainer || !statusElement) {
      return;
    }

    if (refreshButton) {
      refreshButton.addEventListener("click", () => fetchRepos(true));
    }

    fetchRepos();
  };

  return { init };
})();

const GraduationCountdown = (() => {
  const TARGET_DATE = new Date("2027-04-01T00:00:00+03:00");
  let timerId = null;
  let daysEl;
  let hoursEl;
  let minutesEl;
  let secondsEl;
  let messageEl;

  const setSegments = ({ days, hours, minutes, seconds }) => {
    if (daysEl) {
      daysEl.textContent = String(days);
    }
    if (hoursEl) {
      hoursEl.textContent = String(hours).padStart(2, "0");
    }
    if (minutesEl) {
      minutesEl.textContent = String(minutes).padStart(2, "0");
    }
    if (secondsEl) {
      secondsEl.textContent = String(seconds).padStart(2, "0");
    }
  };

  const updateCountdown = () => {
    const now = new Date();
    const distance = TARGET_DATE.getTime() - now.getTime();

    if (distance <= 0) {
      setSegments({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      if (messageEl) {
        messageEl.textContent = "It's graduation month! 🎓 Let's celebrate.";
      }
      if (timerId) {
        window.clearInterval(timerId);
      }
      return;
    }

    const totalSeconds = Math.floor(distance / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    setSegments({ days, hours, minutes, seconds });

    if (messageEl) {
      messageEl.textContent = `Only ${days} days left until I walk the stage.`;
    }
  };

  const init = () => {
    daysEl = document.getElementById("countdown-days");
    hoursEl = document.getElementById("countdown-hours");
    minutesEl = document.getElementById("countdown-minutes");
    secondsEl = document.getElementById("countdown-seconds");
    messageEl = document.getElementById("countdown-message");

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
      return;
    }

    updateCountdown();
    timerId = window.setInterval(updateCountdown, 1000);
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
  ProjectControls.init();
  GitHubFeed.init();
  GraduationCountdown.init();
  ContactForm.init();
  RevealAnimations.init();
  Footer.init();
  Header.init();
});
