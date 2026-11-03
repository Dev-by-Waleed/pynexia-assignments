# Wedding Planner Website — Aurora & Co.

A responsive, single-page portfolio site for a wedding & commercial event planner, built with plain **HTML5 · CSS3 · JavaScript**.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Semantic page structure, sections, accessible contact form |
| `style.css` | Design tokens, responsive layout, mobile navigation, animations |
| `script.js` | DOM manipulation, scroll spy, project filtering, counters, form handling |
| `README.md` | This file |

Open `index.html` in any modern browser (or use the VS Code **Live Server** extension).

## Sections

1. **Sticky navigation** — logo, section links, mobile hamburger with `aria-expanded`, Escape-to-close, scroll-spy active state.
2. **Hero** — headline, calls-to-action, animated statistics counters.
3. **Profile** — portrait card, bio, checklist of services.
4. **Skills** — six service cards + toolkit pills.
5. **Projects** — filterable portfolio (All / Weddings / Receptions / Commercial) with a live `aria-live` status line.
6. **Education** — responsive timeline of degrees and certifications.
7. **Testimonials** — client quotes.
8. **Contact** — details panel + validated enquiry form.
9. **Footer** and back-to-top button.

## Skills demonstrated

- **Responsive design** — fluid `clamp()` typography, CSS Grid / Flexbox, breakpoints at 900px & 640px, mobile drawer menu.
- **UI/UX** — design tokens, hover/focus states, `:focus-visible` outlines, reduced-motion support, reveal-on-scroll.
- **DOM manipulation** — `IntersectionObserver` scroll spy, animated counters, project filtering, class toggling.
- **Form handling** — custom validators, inline error messages, `aria-invalid` / `aria-live`, focus management, simulated async submit with success state and `localStorage` persistence.
- **CSS styling** — variables, gradients, cards, timeline, glass-effect header, print styles.

## Contact form validation rules

| Field | Rule |
|-------|------|
| Full name | required, min 2 characters |
| Email | required, regex pattern |
| Phone | optional, numeric/`+()-.` characters |
| Event type | required select |
| Date | optional, must be today or later |
| Guests | optional, 1–100,000 |
| Message | required, min 15 characters |
| Consent | required checkbox |
