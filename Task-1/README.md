# Accessible Multi-page Portfolio

A small, responsive, semantic HTML5 portfolio starter.

## Pages
- `index.html` — Home
- `about.html` — About and skills
- `projects.html` — Selected projects
- `contact.html` — Accessible contact form

## Run locally
Open `index.html` directly in a browser, or run a local static server from this folder using Node or Python:

```bash
# Using Node.js
npx serve .

# Or using Python (if installed)
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Accessibility features
- Semantic landmarks: `header`, `nav`, `main`, `section`, `article`, `aside`, and `footer`
- Skip-to-content link
- Keyboard-operable navigation toggle with `aria-expanded` and `aria-controls`
- Visible keyboard focus indicators
- Correct heading hierarchy and page-specific document titles
- Explicit form labels, native validation, autocomplete hints, and live status feedback
- Reduced-motion preference support
- Responsive layout and readable text contrast

## Before publishing
1. Replace the sample bio, projects, email, and social links with your own content.
2. Replace `https://example.com/...` canonical URLs with the real deployed URLs.
3. Connect the contact form to a secure backend or form provider. The current form is a front-end demo only.
4. Test all pages using keyboard-only navigation and a screen reader.
5. Run Lighthouse on the deployed site. A 100 score cannot be guaranteed by source code alone; hosting, content, browser conditions, and audit versions also affect scores.
