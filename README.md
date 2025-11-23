# Baraa Zino Portfolio

A single-page personal portfolio highlighting experience, projects, awards, and ways to connect. Assignment 2 builds on the previous deliverable with richer interactivity, personalization, and AI-assisted UX improvements.

## Features
- Responsive layout with sections for About, Experience, Projects, Awards, Skills, and Contact
- Theme toggle that honors the system preference, persists via `localStorage`, and syncs with OS changes
- Personalized hero greeting that remembers visitor names and updates dynamically
- Interactive spotlight section, animated scroll reveals, and expandable project details
- Contact form with inline validation, error messaging, and animated feedback
- Modular CSS using design tokens plus comment placeholders for you to document the code later

## Tech Stack
- HTML5 for layout and semantic structure (`index.html`)
- Modern CSS with custom properties and responsive grid utilities (`css/styles.css`)
- Vanilla JavaScript modules for theming, UI interactions, and form handling (`js/script.js`)

## Project Structure
```
.
├── assets/
│   └── images/
│       ├── baraa_zino_original.jpg
│       ├── DSC_5707_with_watermark_50.jpg
│       └── OCR.jpg
├── css/
│   └── styles.css
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
├── js/
│   └── script.js
└── index.html
```

## Assignment 2 Enhancements
- **Dynamic content:** Hero greeting personalizes itself using stored visitor names; spotlight tabs switch between focus areas without a page reload.
- **Data handling:** Visitor preferences persist in `localStorage`, and the contact form surfaces inline validation feedback.
- **Animations:** Sections marked with `data-animate` fade into view, and feedback messages animate so the user never misses a state change.
- **Error handling:** Inline error text, `aria-invalid` states, and focused alerts guide users to fix issues immediately.
- **AI integration:** AI-assisted planning and implementation steps are documented in `docs/ai-usage-report.md`, and the code keeps TODO placeholders ready for further AI-driven features.

## Getting Started
1. Clone the repository or download the project files.
2. Open `index.html` directly in your browser, or serve the folder with a simple HTTP server (for example `python3 -m http.server`).
3. Explore the spotlight toggles, expand project accordions, personalize the greeting, and try the AI suggestion button to see the new interactions.
4. Clear the browser’s `localStorage` if you want to test the personalization flow from a fresh state.

## Customization Tips
- **Content:** Update text in `index.html` to reflect new achievements or projects.
- **Spotlight copy:** Swap out the focus-area text inside the `spotlight` section or add more buttons/cards as needed.
- **Images:** Replace files in `assets/images/`.
- **Styling:** Adjust colors, spacing, or typography in `css/styles.css`. Design tokens at the top control the overall theme.
- **JavaScript:** Extend the modules in `js/script.js`. Each feature keeps a `// TODO` placeholder so you can add your own explanations later.

## AI Tools Summary
- ChatGPT-5 Codex assisted with brainstorming interactive flows, drafting spotlight and contact copy, and reviewing accessibility considerations. Full logs live in `docs/ai-usage-report.md`.

## Notes
- The contact form currently performs client-side validation only; connect it to a backend or service (e.g., Formspree, Netlify Forms) for real submissions.
- Supplementary write-ups and AI documentation for the assignment live under `docs/`.

## Deployed Webpage on GitHub
- https://baraazino.github.io/assignment-2/
