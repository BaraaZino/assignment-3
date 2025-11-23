# Baraa Zino Portfolio (Assignment 3)

A single-page portfolio that now meets the Assignment 3 rubric with live API data, complex UI logic, persistent state management, a graduation countdown, and transparent AI usage documentation.

## Highlights
- **GitHub API feed:** Pulls the five most recently updated repositories from the public GitHub API, caches responses client-side, and displays stars, forks, languages, and topics with graceful error handling.
- **Sort and hide projects:** Visitors can reorder the grid by newest/oldest/name and toggle the section visibility. Preferences persist in `localStorage` for a consistent experience across visits.
- **Contact safeguards:** Inline validation checks for empty fields, minimum character counts, and email format issues before revealing animated success states.
- **Graduation countdown:** A live counter tracks the days, hours, minutes, and seconds until April 2027 graduation to showcase multi-step logic and timers.
- **Theme & personalization:** Dark/light modes sync with system preferences, while personalized greetings and pre-filled form fields leverage saved visitor data.
- **Performance aware:** Lazy-loaded imagery, DOM updates via `DocumentFragment`, and cached API responses keep the page responsive without extra build tooling.

## Project Structure
```
assignment-3/
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── images/
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
└── .gitignore
```

## Getting Started
1. Clone this repository or download the source zip.
2. Open `index.html` in any modern browser **or** serve the folder with a simple HTTP server.

### Optional local server
```bash
cd assignment-3
python3 -m http.server 4173
```
Then visit `http://localhost:4173`.

No build tools are required—everything runs with plain HTML, CSS, and vanilla JavaScript.

## Feature Details
### API Integration
- `js/script.js` fetches `https://api.github.com/users/baraazino/repos?sort=updated&per_page=5` on load and whenever the refresh button is pressed.
- Responses are cached for three minutes to avoid rate limits and keep the UI snappy.
- Friendly status messaging covers loading, empty states, cached data, and network/API failures.

### Complex Logic & State Management
- The project grid supports sorting and visibility toggling backed by saved preferences (`localStorage`).
- The contact form enforces non-empty fields, custom error messages, and animated success/error feedback.
- Theme selection, preferred visitor names, and the project visibility state all persist between sessions.
- The countdown timer continuously updates the UI, handling the graduation date rollover gracefully.

### Performance & Accessibility
- Project imagery loads lazily with async decoding to reduce initial bandwidth.
- DOM mutations for the GitHub feed and project sorting use `DocumentFragment` to minimize layout thrash.
- Semantic landmarks, aria-labels, keyboard-accessible toggles, and reduced-motion-friendly animations keep the interface inclusive.

## Documentation & AI Usage
- **`docs/technical-documentation.md`** details the architecture, responsive strategy, interaction logic, and testing notes.
- **`docs/ai-usage-report.md`** records every AI-assisted action (tool, prompt, output, edits, and learning).
- A short AI summary also appears in this README per the assignment guidelines.

## Deployed Webpage on GitHub
- https://baraazino.github.io/assignment-3/
