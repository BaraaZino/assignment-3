# AI Usage Report

## Tools Used
- **ChatGPT-5 Codex:** Primary collaborator for ideation, code generation, debugging, accessibility checks, and documentation review.

All AI interactions took place during February 2025 while building the Assignment 2 enhancements.

## Detailed Log

### 1. Spotlight Section Copy & Interaction Plan
- **Tool:** ChatGPT-5 Codex  
- **Prompt:** “Suggest an interactive way to let visitors switch between different focus areas on my portfolio front page. Provide button labels, short descriptions, and any accessibility considerations.”  
- **AI Output (excerpt):**
  > Use three pill-style buttons (About Me, Projects, Goals). Each button should toggle a short paragraph. Bind `aria-controls`/`aria-selected` for accessibility and animate the content transition for clarity.
- **Edits & Integration:** I adopted the button labels and copy as the default text in `index.html`, then coded the toggles in `js/script.js` (`Spotlight` module) with custom styling in `css/styles.css`.  
- **What I Learned:** Reinforced how to wire accessible tab patterns (matching buttons to panels with `aria` attributes) and animate content changes smoothly.

### 2. Contact Form Validation Flow
- **Tool:** ChatGPT-5 Codex  
- **Prompt:** “Help me upgrade a contact form: I need inline validation errors, `aria-invalid` support, and animated feedback that highlights success versus error states.”  
- **AI Output (excerpt):**
  > Use `aria-invalid` when fields fail `checkValidity()`, surface error text near each input, and animate the status banner so users notice it without resorting to intrusive alerts.
- **Edits & Integration:** Implemented the inline error system, `aria-invalid` styling, and animated feedback as suggested. I adapted the recommended copy to match my tone and kept the logic modular for future enhancements.  
- **What I Learned:** Picked up a cleaner pattern for keeping validation logic modular and discovered how a quick animation on status messages dramatically improves perceived responsiveness.

### 3. Documentation & Comment Placeholders
- **Tool:** ChatGPT-5 Codex  
- **Prompt:** “Draft an outline for the README and technical documentation that highlights new Assignment 2 features. Include reminders to add personal comments later.”  
- **AI Output (excerpt):**
  > Add sections for Assignment 2 enhancements, mention `localStorage` data handling, and call out where comment placeholders exist so graders know they’re intentional.
- **Edits & Integration:** Expanded the README and `docs/technical-documentation.md` with customized text, elaborated on testing details.  
- **What I Learned:** Better appreciation for documenting interactive features explicitly and making it clear how AI participated in the workflow.

## Benefits
- Accelerated ideation for UI/UX flows without sacrificing accessibility.
- Saved time drafting copy (spotlight blurbs, AI suggestions, documentation scaffolding).
- Reduced back-and-forth debugging by validating approaches before coding.

## Challenges
- Needed to adapt AI suggestions to fit existing styling conventions and naming schemes.
- Balancing automated guidance with personal understanding took deliberate review to avoid treating outputs as black boxes.

## Learning Outcomes
- Strengthened knowledge of accessible tab patterns, accordions, and inline validation strategies.
- Practiced turning AI-assisted drafts into production-ready copy and code while leaving space for personal commentary.
- Documented AI usage in a reproducible format that links prompts, outputs, and final edits for transparency.
