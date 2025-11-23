# Technical Documentation

## Overview
This project is a responsive single-page portfolio site built with HTML, CSS, and vanilla JavaScript. It showcases personal information, professional experience, awards, AI-focused projects and research, plus an enhanced contact form with inline validation, AI assistance, and dynamic feedback.

## Architecture
- `index.html` defines the semantic layout for About, Experience, Skills, Projects & Research, Awards, Spotlight, and Contact sections.
- `css/styles.css` styles the UI using CSS custom properties, Flexbox, and Grid to provide responsiveness, transitions, section reveals, and state styling. 
- `js/script.js` organizes interactive features into small modules that initialize after the DOM is loaded. 
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
- **Enhanced contact form:** Inline error messaging, `aria-invalid` states, and animated status feedback keep users informed.
- **Reveal animations:** Sections tagged with `data-animate` fade and slide in using `IntersectionObserver`.
- **Footer year:** Automatically injects the current year in the footer to keep content up to date.

All modules are initialized on the `DOMContentLoaded` event to ensure DOM elements are available before interaction.

## Accessibility Considerations
- Semantic HTML elements (`header`, `nav`, `main`, `section`, `footer`) support screen reader navigation.
- `aria-live` regions announce dynamic greeting, personalization notices, and form feedback updates.
- Spotlight toggles expose `role="tab"` semantics and tie buttons to panels through `aria-controls`.
- Project detail buttons manage `aria-expanded`, while inputs set `aria-invalid` when validation fails.
- Color contrast values were selected to retain readability in both light and dark modes, and focus states are visible on interactive elements.

## Running Locally
No build tools are required. Open `index.html` in any modern browser. For live reloading, serve the project directory with a lightweight HTTP server such as `python -m http.server` or VS Code Live Server.

## Testing and Validation
- Manually resized the browser window to verify responsive breakpoints.
- Tested personalization: stored a name, refreshed the page to confirm persistence, and cleared the preference.
- Exercised spotlight toggles and project accordions to ensure content hides/reveals correctly with keyboard and pointer inputs.
- Validated contact form behaviors (inline errors and success messaging) in desktop Chrome.
- Checked theme toggle persistence by reloading the page after toggling modes and verifying system preference sync.
