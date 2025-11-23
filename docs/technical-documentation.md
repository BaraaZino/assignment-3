# Technical Documentation

## Overview
This project is a responsive single-page portfolio site built with HTML, CSS, and vanilla JavaScript. Assignment 3 adds live GitHub API data, sortable project listings, stateful show/hide controls, and a graduation countdown on top of the personalized greeting and enhanced contact form deliverables from Assignment 2.

## Architecture
- `index.html` defines the semantic layout for About, Experience, Skills, Projects & Research, Awards, Spotlight, Contact, the GitHub activity feed, and the graduation countdown section.
- `css/styles.css` styles the UI using CSS custom properties, Flexbox, and Grid to provide responsiveness, transitions, section reveals, and state styling, plus new patterns for control panels, API cards, and the countdown.
- `js/script.js` organizes interactive features (theme, spotlight, personalization, project controls, GitHub fetch, countdown, etc.) into modules that initialize after the DOM is loaded. 
- `assets/images/` contains images that are used in the webpage.

## Responsive Design Strategy
- Uses CSS Grid for the project gallery, awards showcase, and experience cards, automatically fitting content based on available width.
- Applies Flexbox for header alignment, hero call-to-actions, and footer spacing.
- Media queries at 900px and 600px adjust layout: the hero collapses to a single column on tablets and navigation stacks vertically on mobile.
- Typography scales with `clamp()` to maintain readability on different viewports.

## JavaScript Features
- **Theme toggle:** Persisted light/dark mode via `localStorage`, with a fallback to the user's system preference.
- **Personalization module:** Stores a preferred visitor name in `localStorage`, updates the hero greeting on the fly, and provides reset controls.
- **Spotlight toggles:** Buttons switch between focus-area cards using accessible `aria-selected` and `aria-controls` bindings.
- **Project accordions:** Each project card includes an expandable detail section with `aria-expanded` state tracking.
- **Project controls:** Sorting logic reorders cards efficiently, while show/hide state persists so visitors can collapse the section entirely.
- **GitHub feed:** Fetches repositories from the GitHub API, caches results for three minutes, and surfaces status updates for loading/error states.
- **Graduation countdown:** Calculates the remaining time until April 2027 and updates the DOM each second, stopping gracefully once the date is reached.
- **Enhanced contact form:** Inline error messaging, `aria-invalid` states, and animated status feedback keep users informed.
- **Reveal animations:** Sections tagged with `data-animate` fade and slide in using `IntersectionObserver`.
- **Footer year:** Automatically injects the current year in the footer to keep content up to date.

All modules are initialized on the `DOMContentLoaded` event to ensure DOM elements are available before interaction.

## API Integration
- The `GitHubFeed` module requests `https://api.github.com/users/baraazino/repos?sort=updated&per_page=5` with the `application/vnd.github+json` accept header so metadata such as topics and languages are returned.
- Responses are cached for three minutes to avoid hitting rate limits; refresh requests within that window reuse cached data and show a status banner that informs the user.
- Error handling covers API failures, empty repositories, and offline states with friendly messaging in the UI instead of silent failures.

## Performance Considerations
- Project cards and supporting imagery use `loading="lazy"` plus async decoding so off-screen content does not block the hero section.
- DOM updates for both GitHub repositories and project sorting use `DocumentFragment` to minimize layout thrash and repaint cost.
- Project sorting logic works off `data-*` attributes and `DocumentFragment`, so no expensive re-rendering or templating is required.
- Cached API data, shared button styles, and CSS custom properties keep the bundle lightweight without additional tooling.

## Accessibility Considerations
- Semantic HTML elements (`header`, `nav`, `main`, `section`, `footer`) support screen reader navigation.
- `aria-live` regions announce dynamic greeting, personalization notices, and form feedback updates.
- Spotlight toggles expose `role="tab"` semantics and tie buttons to panels through `aria-controls`.
- Project detail buttons manage `aria-expanded`, while inputs set `aria-invalid` when validation fails.
- Color contrast values were selected to retain readability in both light and dark modes, and focus states are visible on interactive elements.

## Running Locally
No build tools are required. Open `index.html` in any modern browser. For live reloading, serve the project directory with a lightweight HTTP server such as `python -m http.server` or VS Code Live Server.

## Testing and Validation
- Manually resized the browser window to verify responsive breakpoints, countdown layout, and GitHub card wrapping.
- Tested personalization: stored a name, refreshed the page to confirm persistence, and cleared the preference.
- Exercised spotlight toggles, project accordions, and the sort/show controls with both keyboard and pointer inputs.
- Verified the GitHub API feed handles success, cached, and forced-refresh paths (with DevTools simulating offline conditions for the error message).
- Validated contact form behaviors (inline errors and success messaging) in desktop Chrome.
- Checked theme toggle persistence plus countdown accuracy by advancing the system clock to ensure it clamps at zero.
