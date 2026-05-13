# Corner Company Beverage Emporium — Marketing Site Design

**Date:** 2026-05-13
**Status:** Approved, ready for implementation planning
**Purpose:** Demo site to pitch to Michael Peck (owner) as a prospective client. Goal is a credible online presence with menu visibility, not e-commerce.

## Business context

- **Name:** Corner Company Beverage Emporium (rebranded from "The Corner Cup" in fall 2024)
- **Owner:** Michael Peck
- **Location:** 148 E Main St, Jonesborough, TN 37659
- **Phone:** (423) 930-6575
- **Email:** cornercompanyjbo@gmail.com
- **Hours:** Mon–Sat 8am–3pm, Sun 8am–1pm (one source disagrees; defer to owner)
- **Socials:** Facebook (`/TheCornerCupCoffeeandTea`), Instagram (`@cornercompanyjbo`)
- **Reputation:** 4.5★ across ~157 reviews; featured in TN Vacation's "Romantic Getaway in Jonesborough"
- **Differentiators:** Locally roasted coffee (Doe River Roasters), Upton loose-leaf teas, house-made pastries, attached Maker's Market, historic-downtown location

## Goals & non-goals

**Goals**
- Establish a credible online presence beyond Facebook/Instagram
- Make the menu visible and easy to browse
- Drive in-person visits (hours, address, directions front and center)
- Look polished enough in a pitch meeting to win the client

**Non-goals**
- Online ordering, gift cards, beans-by-the-bag
- Events calendar, catering inquiry form, newsletter signup
- Live Instagram feed embed
- Custom domain (deferred until ownership transfers to Michael)
- CMS (menu edits via code/PR for now)
- Analytics (deferred to Phase 2)

## Site shape

Hybrid: single-page scroll for the home, plus a dedicated `/menu` route.

- `/` — one-page scroll: Header → Hero → AboutStrip → MenuPreview → VisitSection → SocialProof → Footer
- `/menu` — Header → MenuHero → MenuSection × 4 (Espresso/Coffee/Tea, Breakfast, Lunch, Pastries) → Footer

## Visual direction

Modern Apothecary / Vintage Emporium. Editorial, slow, intentional. Leans into the *Emporium* name and the historic-Jonesborough context.

### Palette

| Token | Hex | Use |
| --- | --- | --- |
| `bg-cream` | `#F4EFE6` | Primary background |
| `ink` | `#1F2A24` | Primary text |
| `forest` | `#2F4A3A` | Primary accent (links, primary buttons, monogram, category headings) |
| `cocoa` | `#7A5A3F` | Secondary accent (prices, footer rules) |
| `terracotta` | `#B4593A` | Sparing accent (badges, pull-quote glyphs) |
| `paper` | `#E9E2D2` | Striped section background |

Contrast targets: `ink` on `bg-cream` and `forest` on `bg-cream` both clear WCAG AA for normal text. `cocoa` on `bg-cream` is reserved for large text or non-essential decoration to stay above AA. Verified before merge.

### Typography

- **Display / Headlines:** Fraunces (variable, optical-size axis). Weight 500 default, italic for emphasis.
- **Body:** Inter (variable).
- **Menu prices / small caps:** Inter, all-caps, letter-spaced.
- Self-hosted via `@fontsource-variable/fraunces` and `@fontsource-variable/inter`.

### Monogram

- Circular badge SVG, ~120px display.
- Outer hairline ring + inner hairline ring in `forest`, small dot ornaments at 12 and 6 o'clock.
- Stacked "C" and "C" sharing a center vertical, Fraunces, with a small italic ampersand offset between them.
- "BEVERAGE EMPORIUM" set in spaced small caps along a ribbon arc beneath.
- Single-color, scalable. Used as logo, favicon source, OG image element, footer mark.

### Detail

- Optional 3%-opacity paper-grain SVG texture overlay on cream backgrounds.
- Dotted-leader lines in menu items, pure CSS.
- Section dividers: a hairline rule centered with a single monogram dot ornament.

## Pages and components

### Shared

- `BaseLayout.astro` — `<html>`, fonts, meta, header, footer, skip link, `prefers-reduced-motion` styles.
- `Header.astro` — sticky top bar. Monogram left, "Menu" + "Visit" nav. Transparent over hero, cream background after scroll (vanilla JS scroll listener).
- `Footer.astro` — monogram, hours, address/phone, social links, copyright.
- `Monogram.astro` — inline SVG component, accepts a `class` for size and color.
- `MenuList.astro` — renders an array of menu items in the editorial dotted-leader style. Used in both `MenuPreview` and `/menu`.

### Home (`/`)

1. **Hero** — full-bleed pastry-with-orange-slice photo, dark gradient overlay, centered serif headline (draft: *"Handcrafted coffee on Tennessee's oldest corner."*). Two CTAs: "See the menu" (primary, links to `/menu`), "Visit us" (ghost, anchors to `#visit`).
2. **AboutStrip** — narrow column, ~3 sentences. Locally-owned, locally-roasted, on the corner of Main in historic Jonesborough. No photos.
3. **MenuPreview** — heading "From the menu," 6 featured items in MenuList style, 2 food photos as asides. "See the full menu →" CTA.
4. **VisitSection** — id `#visit`. Left column: address, hours, phone, "Get directions" link (Google Maps deep-link). Right column: exterior photo. Below: lazy-loaded Google Maps iframe with descriptive `title` attribute.
5. **SocialProof** — single pull-quote from a real review, "4.5★ / ~157 reviews," "Featured in TN Vacation."
6. **Footer** — described above.

### Menu (`/menu`)

- **MenuHero** — slim banner, page title in Fraunces, one-line subtitle. No background photo.
- **MenuSection × 4** — *Espresso, Coffee & Tea / Breakfast / Lunch / Pastries*. Items in MenuList style. One photo per section as an alternating-side aside.
- **Footnote** — FDA "consuming raw/undercooked…" disclaimer from the printed menu.

## Content data

`src/data/menu.ts` exports a typed `MenuCategory[]`. Initial content seeded from the printed menu photo:

- **Espresso, Coffee & Tea:** Double Espresso $2.50, Cappuccino $3.50 (plus drip coffee from the chalkboard: Ethiopian Yirgacheffe, Congo Dark Roast — prices TBD from owner)
- **Breakfast (until 10:30):** Smoked Salmon & Herbed Cream Cheese $11, Quiche du Jour $6, "F" Is For Frankie $8, Greek Yogurt Parfait $5
- **Lunch:** Turkey and Cheese $10, Prosciutto and Arugula $7, Mediterranean $11
- **Pastries:** "Served all day" — specific items not yet supplied

Items marked as draft (with `// TODO: confirm with owner` comments) include drip coffee prices and the pastry list.

## Photography

**Real photos available (5):**
1. Pastry with orange slice → Hero background
2. Pastry on metal tray → MenuPreview aside or `/menu` Breakfast section
3. Drip coffee chalkboard → `/menu` Coffee & Tea section aside or AboutStrip accent
4. Exterior of the building → VisitSection
5. Printed menu photo → source data only, not displayed

**Unsplash placeholders (allowed, downloaded locally, marked in code):**
- 1 supplementary food/drink shot for MenuPreview second aside
- 1 atmospheric mood image for AboutStrip if needed
- OG share image composite (monogram on a dark photo background)

**Rules for Unsplash selection:** warm wood and cream tones only; no chrome/concrete modern-cafe shots; no recognizable faces; tight crops on hands/drinks/food, not wide interiors. Each placeholder gets a code comment marking it as such.

**Pipeline:** All images go through Astro's `<Image>` component (WebP, responsive `srcset`, lazy-loaded below the fold, eager + `fetchpriority="high"` on the hero). Stored in `src/assets/photos/`. Every image has descriptive alt text.

## Architecture

### Stack

- **Astro 5.x**, `output: 'static'`. No SSR.
- **Tailwind CSS v4** via the official `@tailwindcss/vite` plugin (Tailwind v4 ships a Vite plugin instead of the legacy Astro integration). Theme tokens declared in `src/styles/global.css` using the v4 `@theme` directive.
- **No JS framework.** A few lines of vanilla JS for sticky-nav scroll behavior.
- **TypeScript** for menu data and component props.

### Project structure

```
src/
  components/   # Header, Hero, AboutStrip, MenuPreview, MenuList, VisitSection, SocialProof, Footer, Monogram
  layouts/      # BaseLayout.astro
  pages/        # index.astro, menu.astro, 404.astro
  data/menu.ts
  styles/global.css
  assets/photos/
public/         # robots.txt, favicons, og-image
```

## Accessibility

Hard requirement: Lighthouse Accessibility ≥ 95. Soft target: Performance ≥ 90, Best Practices ≥ 95, SEO ≥ 95.

- Semantic landmarks: `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>` with `aria-labelledby`.
- Skip link as first focusable element.
- Visible `:focus-visible` styles on every interactive element.
- `prefers-reduced-motion` honored for the sticky-header transition and any scroll animations.
- Real alt text on every image. Decorative images use `alt=""` and `role="presentation"`.
- Google Maps iframe has a descriptive `title`.
- Color contrast verified AA for all text-on-background combinations.
- Keyboard-only navigation reaches every interactive element in source order.
- Manual axe-DevTools scan: zero critical or serious issues before merge.

## Deployment pipeline

### Local dev

- `npm run dev` → Astro dev server on `:4321`.
- Tailwind hot-reload.

### Production build

- `npm run build` → static output in `dist/`.

### Container

- `Dockerfile`, multi-stage:
  - Stage 1 `node:22-alpine`: `npm ci`, `npm run build`.
  - Stage 2 `nginx:1.27-alpine`: copy `dist/` into `/usr/share/nginx/html`, custom `nginx.conf` with gzip and cache headers.
- Target image size ~30 MB.

### GitHub Actions release workflow

File: `.github/workflows/release.yml`

- **Trigger:** `workflow_dispatch` with required `version` input (semver, no `v` prefix; the workflow prepends it).
- **Steps:**
  1. Checkout, Node 22 setup, `npm ci`, `npm run build`.
  2. Lighthouse CI against the local build. Gate: Accessibility ≥ 95 fails the workflow.
  3. Create and push annotated tag `v${{ inputs.version }}`.
  4. Log in to `ghcr.io` via `docker/login-action` with `GITHUB_TOKEN`.
  5. Build and push image with `docker/build-push-action` to two tags: `ghcr.io/<owner>/corner-company:v<version>` and `:latest`.
  6. Create a GitHub Release linked to the tag, auto-generated release notes.
  7. Install `@railway/cli`, authenticate with `RAILWAY_TOKEN`, run `railway redeploy --service corner-company --environment production --yes`.

### Railway

- Service configured to deploy a Docker image from GHCR.
- Image visibility: **public** (no auth required for Railway to pull).
- Image tag: `:latest` for the demo; pinning to specific versions is a Phase-2 hardening.
- Custom domain: deferred. Use the auto-assigned `*.up.railway.app` URL for the demo.
- Env vars: none.

### Prerequisites the user sets up before first release

1. Generate a Railway project token (Project → Settings → Tokens).
2. Add as a GitHub repo secret named `RAILWAY_TOKEN`.
3. Confirm the Railway service name (`corner-company` is the design's placeholder).

## Acceptance criteria

- `npm run build` succeeds with zero warnings.
- Lighthouse on production build: Accessibility ≥ 95, Performance ≥ 90, Best Practices ≥ 95, SEO ≥ 95.
- Manual axe-DevTools scan: zero critical or serious issues.
- Site renders correctly at 375px, 768px, 1280px, 1920px viewports.
- All images have meaningful alt text (audited).
- Keyboard-only navigation reaches every interactive element with visible focus.
- Release workflow end-to-end run: tag created, image pushed to GHCR (public), GitHub Release created, Railway redeploy fires, public Railway URL serves the new build.

## Open questions to surface with the owner during the pitch

1. Confirm Sunday hours.
2. Confirm current Instagram handle (`@cornercompanyjbo` vs. `@cornercojbo`).
3. Drip coffee prices and current pastry list.
4. Whether the attached Maker's Market should be mentioned on the site.
5. Whether the Facebook handle URL will eventually be updated from `TheCornerCupCoffeeandTea`.
