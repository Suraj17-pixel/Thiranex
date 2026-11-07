# Advanced CSS3 & Responsive Architecture Portfolio

A visually stunning, pixel-perfect, accessible multi-page portfolio built with modern CSS3 layout architectures, mobile-first responsive design, dynamic custom property theming, and semantic HTML5.

## Key Architectural Features

### 1. Complex Two-Dimensional CSS Grid Layouts
- **Hero Section Grid**: 2D asymmetric grid pairing introductory copy with an interactive code/metrics showcase card (`.hero-grid`).
- **Stats & Metrics Grid**: Responsive 4-column 2D grid utilizing `repeat(auto-fit, minmax(...))` for core performance indicators.
- **Bento Grid Architecture (`about.html`)**: Two-dimensional Bento grid with multi-column card spans showcasing personal approach, specializations, skills cloud, and core values.
- **Projects Showcase Grid (`projects.html`)**: 2D split-column layout for project cards featuring deep architectural notes alongside CSS-crafted browser mockup wireframes.
- **Asymmetrical Contact Layout (`contact.html`)**: 2-column desktop grid pairing an accessible form with an interactive "Direct Connection" card.

### 2. Flexbox for Localized Component Alignment
- Sticky navigation header with brand, navigation links, dynamic theme switcher, and mobile drawer toggle.
- Button rows and action links with aligned SVG icons.
- Tag list pills (`.tag-list`) with dynamic wrapping, hover states, and padding.
- Card metadata alignment (numbers, category badges, links with animated arrow indicators).
- Form field headers with aligned labels and required asterisks.

### 3. Mobile-First Responsive Breakpoints
- **Base styles (< 480px)**: Compact single-column layout optimized for mobile screens.
- **480px (`min-width: 480px`)**: Small tablets and phablets adjustments.
- **640px (`min-width: 640px`)**: Tablet landscape with 2-column card grids.
- **768px (`min-width: 768px`)**: Large tablets with expanded Bento grids.
- **900px (`min-width: 900px`)**: Full desktop layout, inline horizontal navigation bar, multi-column 2D grids, and asymmetrical layouts.
- **1200px+ (`min-width: 1200px`)**: High-resolution display tuning with max-width boundaries and fluid padding.

### 4. Dynamic Light / Dark Theming with CSS Custom Variables
- Structured design token palette in `:root` and `:root[data-theme="dark"]` / `:root[data-theme="light"]`.
- Accessible header theme switcher button with rotating Sun/Moon SVG icons.
- Synchronized with `localStorage` and real-time OS `prefers-color-scheme` media query listeners.
- Dynamic `<meta name="theme-color">` updates for mobile browser chrome bars.

### 5. Advanced CSS3 Visual Polish & Accessibility
- Fluid typography utilizing CSS `clamp()` (`clamp(2.35rem, 5.5vw + 1rem, 4.25rem)`).
- Frosted glassmorphism navigation header with `backdrop-filter: blur(16px)`.
- Subtle radial ambient glow gradients on page canvas.
- Pulsating status badge with `@keyframes pulse` animation ("Available for new projects").
- Full WCAG 2.1 AA color contrast compliance in both light and dark modes.
- `prefers-reduced-motion` media queries for motion-sensitive users.
- Print stylesheets for clean document printing.

---

## Pages
- `index.html` — Home & featured project cards
- `about.html` — Bento grid approach, skills cloud, and values
- `projects.html` — Deep-dive 2D project cards with browser mockups
- `contact.html` — Asymmetrical form grid & quick connection details

---

## Run Locally

Open `index.html` directly in any modern browser, or launch a local static server:

```bash
# Using Node.js:
npx serve .

# Or using Python (if available):
python -m http.server 8000
```

Then visit `http://localhost:8000` (or the port reported by your server).
