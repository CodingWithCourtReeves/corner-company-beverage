# Corner Company Marketing Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static Astro marketing site for Corner Company Beverage Emporium with a one-page home (`/`) and a dedicated menu page (`/menu`), shipped via a Dockerized GHCR image deployed to Railway through a tag-and-release GitHub Actions workflow.

**Architecture:** Astro 5.x static-output project, Tailwind CSS v4 via `@tailwindcss/vite`, self-hosted Fraunces + Inter fonts via `@fontsource-variable`, TypeScript-typed menu data, multi-stage Docker build (Node build → nginx serve), release workflow with Lighthouse accessibility gate.

**Tech Stack:** Astro 5, Tailwind CSS v4, TypeScript, `@fontsource-variable/fraunces`, `@fontsource-variable/inter`, `@astrojs/sitemap`, `sharp` (for `<Image>`), nginx, Docker, GitHub Actions, GHCR, Railway CLI.

**Spec:** [`docs/superpowers/specs/2026-05-13-corner-company-marketing-site-design.md`](../specs/2026-05-13-corner-company-marketing-site-design.md)

---

## Testing Approach

This is a static marketing site. Traditional unit tests over component output add little value. The verification strategy is:

1. **Build verification:** `npm run build` succeeds with zero warnings after every component task.
2. **Visual verification:** dev server smoke check at the relevant route + responsive viewports (375 / 768 / 1280 / 1920).
3. **Integration gate:** Lighthouse CI run against the production build. Accessibility ≥ 95 is the hard gate; Performance ≥ 90, Best Practices ≥ 95, SEO ≥ 95 are soft targets.
4. **Manual accessibility audit:** axe-DevTools browser extension scan once the site is feature-complete; zero critical/serious findings before release.

Each task includes the verification step that fits the change.

---

## File Structure

```
.
├── .github/workflows/release.yml
├── .gitignore
├── .lighthouserc.json
├── Dockerfile
├── README.md
├── astro.config.mjs
├── nginx.conf
├── package.json
├── tsconfig.json
├── public/
│   ├── apple-touch-icon.png
│   ├── favicon-16.png
│   ├── favicon-32.png
│   ├── favicon.svg
│   ├── og-image.png
│   └── robots.txt
└── src/
    ├── assets/photos/        # real + unsplash placeholder JPGs
    ├── components/
    │   ├── AboutStrip.astro
    │   ├── Footer.astro
    │   ├── Header.astro
    │   ├── Hero.astro
    │   ├── MenuList.astro
    │   ├── MenuPreview.astro
    │   ├── Monogram.astro
    │   ├── SectionDivider.astro
    │   ├── SocialProof.astro
    │   └── VisitSection.astro
    ├── data/menu.ts
    ├── layouts/BaseLayout.astro
    ├── pages/
    │   ├── 404.astro
    │   ├── index.astro
    │   └── menu.astro
    └── styles/global.css
```

---

## Task 1: Scaffold Astro project with TypeScript

**Files:**
- Create: `package.json`, `tsconfig.json`, `astro.config.mjs`, `.gitignore`, `src/pages/index.astro`, `src/env.d.ts`

- [ ] **Step 1: Initialize a minimal Astro project with TypeScript**

Run (from `/Users/courtreeves/projects/corner-company-beverage`):

```bash
npm init -y
npm install --save-exact astro@^5.0.0
npm install --save-exact typescript@^5.6.0
npx astro telemetry disable
```

- [ ] **Step 2: Write `package.json` scripts**

Overwrite `package.json` with:

```json
{
  "name": "corner-company-beverage",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview --host 0.0.0.0 --port 4321",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "5.0.0"
  },
  "devDependencies": {
    "typescript": "5.6.0"
  }
}
```

Then run `npm install` to regenerate `package-lock.json`.

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": ["src/**/*", ".astro/types.d.ts"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Create `src/env.d.ts`**

```ts
/// <reference types="astro/client" />
```

- [ ] **Step 5: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://corner-company.up.railway.app',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
  },
});
```

- [ ] **Step 6: Create `.gitignore`**

```gitignore
node_modules
dist
.astro
.DS_Store
.env
.env.local
*.log
.lighthouseci
```

- [ ] **Step 7: Create a placeholder `src/pages/index.astro` so the project builds**

```astro
---
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Corner Company Beverage Emporium</title>
  </head>
  <body>
    <h1>Corner Company Beverage Emporium</h1>
  </body>
</html>
```

- [ ] **Step 8: Verify the project builds**

Run: `npm run build`
Expected: `dist/index.html` created, no errors.

- [ ] **Step 9: Commit**

```bash
git add .gitignore package.json package-lock.json tsconfig.json astro.config.mjs src/env.d.ts src/pages/index.astro
git commit -m "chore: scaffold Astro 5 project with TypeScript"
```

---

## Task 2: Add Tailwind CSS v4 + fonts + design tokens

**Files:**
- Modify: `astro.config.mjs`, `package.json`
- Create: `src/styles/global.css`

- [ ] **Step 1: Install Tailwind v4 (Vite plugin) and fonts**

```bash
npm install --save-exact tailwindcss@^4.0.0 @tailwindcss/vite@^4.0.0
npm install --save-exact @fontsource-variable/fraunces@^5.1.0 @fontsource-variable/inter@^5.1.0
```

- [ ] **Step 2: Wire the Tailwind Vite plugin into `astro.config.mjs`**

Replace the file with:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  site: 'https://corner-company.up.railway.app',
  trailingSlash: 'never',
  build: { inlineStylesheets: 'auto' },
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 3: Create `src/styles/global.css` with design tokens**

```css
@import "tailwindcss";
@import "@fontsource-variable/fraunces/index.css";
@import "@fontsource-variable/inter/index.css";

@theme {
  --color-cream: #F4EFE6;
  --color-paper: #E9E2D2;
  --color-ink: #1F2A24;
  --color-forest: #2F4A3A;
  --color-cocoa: #7A5A3F;
  --color-terracotta: #B4593A;

  --font-display: "Fraunces Variable", "Fraunces", ui-serif, Georgia, serif;
  --font-sans: "Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif;

  --tracking-emporium: 0.18em;
}

html {
  background-color: var(--color-cream);
  color: var(--color-ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  min-height: 100dvh;
}

:focus-visible {
  outline: 2px solid var(--color-forest);
  outline-offset: 3px;
  border-radius: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}

.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  padding: 0.75rem 1rem;
  background: var(--color-forest);
  color: var(--color-cream);
  text-decoration: none;
  z-index: 1000;
}
.skip-link:focus {
  left: 0;
}

.menu-leader {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}
.menu-leader > .name { flex: 0 0 auto; font-family: var(--font-display); font-weight: 500; }
.menu-leader > .dots {
  flex: 1 1 auto;
  border-bottom: 1px dotted color-mix(in oklab, var(--color-cocoa) 60%, transparent);
  transform: translateY(-0.25em);
}
.menu-leader > .price {
  flex: 0 0 auto;
  font-family: var(--font-sans);
  font-variant-numeric: tabular-nums;
  letter-spacing: var(--tracking-emporium);
  text-transform: uppercase;
  font-size: 0.85rem;
  color: var(--color-cocoa);
}
```

- [ ] **Step 4: Update `src/pages/index.astro` to import global styles**

```astro
---
import "../styles/global.css";
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Corner Company Beverage Emporium</title>
  </head>
  <body>
    <h1 class="font-display text-forest text-5xl p-12">Corner Company Beverage Emporium</h1>
  </body>
</html>
```

- [ ] **Step 5: Verify build and tokens work**

Run: `npm run build`
Expected: Build succeeds. Inspect `dist/index.html` and confirm the inlined CSS contains the Fraunces font face and the cream/forest color variables.

- [ ] **Step 6: Visual smoke test**

Run: `npm run dev`
Open `http://localhost:4321` — header should render in cream background, dark green serif text. Stop the dev server (Ctrl+C).

- [ ] **Step 7: Commit**

```bash
git add astro.config.mjs package.json package-lock.json src/styles/global.css src/pages/index.astro
git commit -m "feat: add Tailwind v4, fonts, and design tokens"
```

---

## Task 3: BaseLayout with SEO meta and skip link

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create `src/layouts/BaseLayout.astro`**

```astro
---
import "../styles/global.css";

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
}

const {
  title,
  description = "Handcrafted coffee, house-made pastries, and a curated menu on Tennessee's oldest corner. Corner Company Beverage Emporium in historic downtown Jonesborough.",
  ogImage = "/og-image.png",
  canonical,
} = Astro.props;

const siteName = "Corner Company Beverage Emporium";
const fullTitle = title === siteName ? title : `${title} — ${siteName}`;
const canonicalUrl = canonical ?? new URL(Astro.url.pathname, Astro.site).toString();
const ogImageUrl = new URL(ogImage, Astro.site).toString();
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalUrl} />

    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon-32.png" sizes="32x32" />
    <link rel="icon" href="/favicon-16.png" sizes="16x16" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:image" content={ogImageUrl} />
    <meta property="og:site_name" content={siteName} />
    <meta name="twitter:card" content="summary_large_image" />

    <meta name="theme-color" content="#F4EFE6" />
  </head>
  <body class="bg-cream text-ink">
    <a href="#main" class="skip-link">Skip to content</a>
    <slot name="header" />
    <main id="main">
      <slot />
    </main>
    <slot name="footer" />
  </body>
</html>
```

- [ ] **Step 2: Update `src/pages/index.astro` to use the layout**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout title="Corner Company Beverage Emporium">
  <h1 class="font-display text-forest text-5xl p-12">Corner Company Beverage Emporium</h1>
</BaseLayout>
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: Build succeeds. Inspect `dist/index.html` — should include `<a class="skip-link">`, canonical link, OG tags.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "feat: add BaseLayout with SEO meta and skip link"
```

---

## Task 4: Monogram SVG component

**Files:**
- Create: `src/components/Monogram.astro`

- [ ] **Step 1: Create `src/components/Monogram.astro`**

```astro
---
interface Props {
  class?: string;
  title?: string;
  variant?: "default" | "inverse";
}
const { class: className = "", title = "Corner Company Beverage Emporium monogram", variant = "default" } = Astro.props;
const stroke = variant === "inverse" ? "#F4EFE6" : "#2F4A3A";
const fill = variant === "inverse" ? "#F4EFE6" : "#2F4A3A";
---
<svg
  viewBox="0 0 120 120"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label={title}
  class={className}
>
  <title>{title}</title>
  <defs>
    <path id="ribbon-arc" d="M 18 78 A 50 50 0 0 0 102 78" fill="none" />
  </defs>

  <!-- outer ring -->
  <circle cx="60" cy="60" r="56" fill="none" stroke={stroke} stroke-width="1" />
  <!-- inner ring -->
  <circle cx="60" cy="60" r="50" fill="none" stroke={stroke} stroke-width="0.75" />
  <!-- ornament dots -->
  <circle cx="60" cy="8" r="1.5" fill={fill} />
  <circle cx="60" cy="112" r="1.5" fill={fill} />

  <!-- stacked C / & / C -->
  <text x="60" y="48" text-anchor="middle" font-family="Fraunces Variable, Fraunces, serif" font-size="34" font-weight="500" fill={fill}>C</text>
  <text x="60" y="62" text-anchor="middle" font-family="Fraunces Variable, Fraunces, serif" font-style="italic" font-size="14" fill={fill}>&amp;</text>
  <text x="60" y="80" text-anchor="middle" font-family="Fraunces Variable, Fraunces, serif" font-size="34" font-weight="500" fill={fill}>C</text>

  <!-- ribbon arc label -->
  <text font-family="Inter Variable, Inter, sans-serif" font-size="7" letter-spacing="2.5" fill={fill}>
    <textPath href="#ribbon-arc" startOffset="50%" text-anchor="middle">BEVERAGE EMPORIUM</textPath>
  </text>
</svg>
```

- [ ] **Step 2: Drop the monogram into the index page to preview it**

Replace `src/pages/index.astro` body content:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Monogram from "../components/Monogram.astro";
---
<BaseLayout title="Corner Company Beverage Emporium">
  <div class="p-12 flex gap-12 items-center">
    <Monogram class="w-32 h-32" />
    <Monogram class="w-32 h-32" variant="inverse" style="background: #2F4A3A; padding: 12px; border-radius: 100%;" />
  </div>
</BaseLayout>
```

- [ ] **Step 3: Visual check**

Run: `npm run dev` and open `http://localhost:4321`. Confirm the monogram renders: outer ring, two C's stacked with an italic ampersand between, "BEVERAGE EMPORIUM" curving along the bottom. Both forest-on-cream and cream-on-forest variants visible.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/Monogram.astro src/pages/index.astro
git commit -m "feat: add Monogram SVG badge component"
```

---

## Task 5: Header component

**Files:**
- Create: `src/components/Header.astro`

- [ ] **Step 1: Create `src/components/Header.astro`**

```astro
---
import Monogram from "./Monogram.astro";
interface Props {
  /** When true, header starts transparent and gains a cream background on scroll. */
  transparentAtTop?: boolean;
}
const { transparentAtTop = false } = Astro.props;
---
<header
  data-transparent={transparentAtTop ? "true" : "false"}
  class:list={[
    "fixed top-0 left-0 right-0 z-40 transition-colors duration-300",
    transparentAtTop ? "bg-transparent" : "bg-cream/95 backdrop-blur",
  ]}
>
  <nav aria-label="Primary" class="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
    <a href="/" class="flex items-center gap-3" aria-label="Corner Company home">
      <Monogram class="w-10 h-10" />
      <span class="font-display text-forest text-lg tracking-tight hidden sm:inline">Corner Company</span>
    </a>
    <ul class="flex items-center gap-6 text-sm font-medium uppercase tracking-[0.18em]">
      <li><a href="/menu" class="text-ink hover:text-forest">Menu</a></li>
      <li><a href="/#visit" class="text-ink hover:text-forest">Visit</a></li>
    </ul>
  </nav>
</header>

<script>
  // Toggle a scrolled state so transparent headers fade in a cream background.
  const header = document.querySelector("header[data-transparent='true']");
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 24) {
        header.classList.remove("bg-transparent");
        header.classList.add("bg-cream/95", "backdrop-blur", "shadow-[0_1px_0_0_rgba(31,42,36,0.08)]");
      } else {
        header.classList.add("bg-transparent");
        header.classList.remove("bg-cream/95", "backdrop-blur", "shadow-[0_1px_0_0_rgba(31,42,36,0.08)]");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
</script>
```

- [ ] **Step 2: Wire Header into `index.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/Header.astro";
---
<BaseLayout title="Corner Company Beverage Emporium">
  <Header slot="header" transparentAtTop />
  <div style="height: 200vh; padding-top: 6rem;">
    <p class="p-6">Scroll to test the header transition.</p>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Visual check**

Run: `npm run dev`. Confirm:
- Header is fixed at top, transparent over the cream page (so it appears cream-ish anyway — switch to a dark hero later).
- Scrolling adds a backdrop and a hairline shadow.
- Tab key reaches "Menu" and "Visit" with visible focus rings.
- Skip link appears when tabbed first.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.astro src/pages/index.astro
git commit -m "feat: add sticky Header with monogram and nav"
```

---

## Task 6: Footer component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create `src/components/Footer.astro`**

```astro
---
import Monogram from "./Monogram.astro";
---
<footer class="bg-forest text-cream mt-24">
  <div class="mx-auto max-w-6xl px-6 py-16 grid gap-12 md:grid-cols-3">
    <div class="flex flex-col gap-3">
      <Monogram class="w-16 h-16" variant="inverse" />
      <p class="font-display text-2xl leading-tight">Corner Company<br /><span class="italic">Beverage Emporium</span></p>
    </div>
    <div>
      <h2 class="text-xs uppercase tracking-[0.2em] mb-3 text-cream/70">Visit</h2>
      <address class="not-italic leading-relaxed">
        148 E Main St<br />
        Jonesborough, TN 37659<br />
        <a href="tel:+14239306575" class="underline-offset-4 hover:underline">(423) 930-6575</a>
      </address>
    </div>
    <div>
      <h2 class="text-xs uppercase tracking-[0.2em] mb-3 text-cream/70">Hours</h2>
      <dl class="leading-relaxed">
        <div class="flex justify-between"><dt>Mon–Sat</dt><dd>8am – 3pm</dd></div>
        <div class="flex justify-between"><dt>Sunday</dt><dd>8am – 1pm</dd></div>
      </dl>
      <h2 class="text-xs uppercase tracking-[0.2em] mt-6 mb-3 text-cream/70">Follow</h2>
      <ul class="flex gap-4">
        <li><a href="https://www.facebook.com/TheCornerCupCoffeeandTea/" target="_blank" rel="noopener" class="underline-offset-4 hover:underline">Facebook</a></li>
        <li><a href="https://www.instagram.com/cornercompanyjbo/" target="_blank" rel="noopener" class="underline-offset-4 hover:underline">Instagram</a></li>
      </ul>
    </div>
  </div>
  <div class="border-t border-cream/15">
    <p class="mx-auto max-w-6xl px-6 py-6 text-xs text-cream/60">© {new Date().getFullYear()} Corner Company Beverage Emporium. All rights reserved.</p>
  </div>
</footer>
```

- [ ] **Step 2: Wire Footer into `index.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
---
<BaseLayout title="Corner Company Beverage Emporium">
  <Header slot="header" transparentAtTop />
  <div style="height: 100vh; padding-top: 6rem;">Hero placeholder</div>
  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 3: Visual check**

Run: `npm run dev`. Confirm:
- Footer renders cream-on-forest at the bottom.
- Three columns on desktop, stacks on mobile (resize browser to 375px).
- Phone link, Facebook, Instagram links all keyboard-reachable with visible focus.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.astro src/pages/index.astro
git commit -m "feat: add Footer with address, hours, and socials"
```

---

## Task 7: Typed menu data

**Files:**
- Create: `src/data/menu.ts`

- [ ] **Step 1: Create `src/data/menu.ts`**

```ts
export interface MenuItem {
  name: string;
  description?: string;
  price?: string; // string so we can write "M.P." or omit for items without listed prices
  /** Set to true to highlight in the home-page preview. */
  featured?: boolean;
}

export interface MenuCategory {
  id: string;
  title: string;
  /** Optional fine print shown below the title (e.g., "served until 10:30"). */
  subtitle?: string;
  items: MenuItem[];
}

export const menu: MenuCategory[] = [
  {
    id: "coffee-tea",
    title: "Espresso, Coffee & Tea",
    items: [
      { name: "Double Espresso", price: "2.50", featured: true },
      { name: "Cappuccino", price: "3.50", featured: true },
      // TODO: confirm drip-coffee prices with owner
      { name: "Drip — Ethiopian Yirgacheffe", description: "Bright, citrus, floral.", featured: true },
      { name: "Drip — Congo Dark Roast", description: "Cocoa, walnut, deep finish." },
    ],
  },
  {
    id: "breakfast",
    title: "Breakfast",
    subtitle: "Served until 10:30",
    items: [
      {
        name: "Smoked Salmon & Herbed Cream Cheese",
        description: "Everything bagel with house-made dill-and-chive cream cheese, smoked salmon, capers, red onion, fresh dill.",
        price: "11",
        featured: true,
      },
      {
        name: "Quiche du Jour",
        description: "Ask staff for today's selection.",
        price: "6",
      },
      {
        name: '"F" Is for Frankie',
        description: "Canadian bacon, sharp cheddar, sunny-up egg on a house-made biscuit. Add hot honey +.50.",
        price: "8",
        featured: true,
      },
      {
        name: "Greek Yogurt Parfait",
        description: "Layered Greek yogurt, honey-almond granola, banana, chia seed.",
        price: "5",
      },
    ],
  },
  {
    id: "lunch",
    title: "Lunch",
    items: [
      {
        name: "Turkey and Cheese",
        description: "Smoked peppercorn turkey, arugula, sharp cheddar, basil pesto, hummus on multi-grain.",
        price: "10",
        featured: true,
      },
      {
        name: "Prosciutto and Arugula",
        description: "Sliced prosciutto, organic arugula, roasted red pepper spread on toasted ciabatta.",
        price: "7",
      },
      {
        name: "Mediterranean",
        description: "Roasted red pepper hummus, spinach, red onion, black olive, feta on toasted ciabatta.",
        price: "11",
        featured: true,
      },
    ],
  },
  {
    id: "pastries",
    title: "Pastries",
    subtitle: "Served all day",
    items: [
      // TODO: confirm current pastry rotation with owner
      { name: "Cheddar-Bacon Scone", description: "House-made, baked fresh each morning.", featured: true },
      { name: "Strawberry Scone", description: "Macerated strawberries, light glaze." },
      { name: "Blueberry Muffin" },
      { name: "Cranberry-Orange Scone" },
    ],
  },
];

export const featuredItems = menu.flatMap((c) => c.items.filter((i) => i.featured));
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/menu.ts
git commit -m "feat: add typed menu data seeded from printed menu"
```

---

## Task 8: MenuList component (editorial dotted-leader style)

**Files:**
- Create: `src/components/MenuList.astro`

- [ ] **Step 1: Create `src/components/MenuList.astro`**

```astro
---
import type { MenuItem } from "../data/menu.ts";
interface Props { items: MenuItem[]; }
const { items } = Astro.props;
---
<ul class="flex flex-col gap-5">
  {items.map((item) => (
    <li>
      <div class="menu-leader">
        <span class="name text-ink text-lg">{item.name}</span>
        <span class="dots" aria-hidden="true"></span>
        {item.price ? <span class="price">{item.price}</span> : <span class="price text-cocoa/60">—</span>}
      </div>
      {item.description && (
        <p class="mt-1 text-sm italic text-ink/70 max-w-prose">{item.description}</p>
      )}
    </li>
  ))}
</ul>
```

- [ ] **Step 2: Preview it on the index page**

Replace `src/pages/index.astro` body content:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import MenuList from "../components/MenuList.astro";
import { featuredItems } from "../data/menu.ts";
---
<BaseLayout title="Corner Company Beverage Emporium">
  <Header slot="header" />
  <section class="mx-auto max-w-3xl px-6 pt-32 pb-24">
    <h2 class="font-display text-3xl text-forest mb-8">Featured</h2>
    <MenuList items={featuredItems} />
  </section>
  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 3: Visual check**

Run: `npm run dev`. Confirm items render with name on the left, dotted leader connecting to the price on the right, italic description underneath. Dotted leaders align well at desktop and mobile widths.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/MenuList.astro src/pages/index.astro
git commit -m "feat: add MenuList with editorial dotted-leader style"
```

---

## Task 9: Photography assets

**Files:**
- Create: `src/assets/photos/hero-pastry.jpg`, `pastry-tray.jpg`, `drip-chalkboard.jpg`, `exterior.jpg`, `unsplash-coffee-pour.jpg`
- Modify: `package.json` (add `sharp` for `<Image>` optimization)

The five image files already provided in conversation correspond to:
- Image 1 (pastry with orange slice) → `hero-pastry.jpg`
- Image 2 (exterior building) → `exterior.jpg`
- Image 3 (pastry on metal tray) → `pastry-tray.jpg`
- Image 4 (drip coffee chalkboard) → `drip-chalkboard.jpg`
- Image 5 (printed menu, reference only — not stored)

- [ ] **Step 1: Install sharp**

```bash
npm install --save-exact sharp@^0.33.0
```

- [ ] **Step 2: Save the four real photos to `src/assets/photos/`**

The user has provided the originals as PNG files at `/Users/courtreeves/.claude/image-cache/b55e0c39-f606-4236-af05-4854f2497875/{1..5}.png`. Convert/copy them:

```bash
mkdir -p src/assets/photos
cp /Users/courtreeves/.claude/image-cache/b55e0c39-f606-4236-af05-4854f2497875/1.png src/assets/photos/hero-pastry.png
cp /Users/courtreeves/.claude/image-cache/b55e0c39-f606-4236-af05-4854f2497875/2.png src/assets/photos/exterior.png
cp /Users/courtreeves/.claude/image-cache/b55e0c39-f606-4236-af05-4854f2497875/3.png src/assets/photos/pastry-tray.png
cp /Users/courtreeves/.claude/image-cache/b55e0c39-f606-4236-af05-4854f2497875/4.png src/assets/photos/drip-chalkboard.png
```

Astro's `<Image>` handles PNG input fine; keeping `.png` extensions is OK.

- [ ] **Step 3: Download one Unsplash placeholder**

The MenuPreview needs a second aside image. Source one Unsplash photo matching the spec rules (warm wood tones, tight food/drink crop, no recognizable faces). Search "espresso pour" or "coffee shop pastry" on unsplash.com. Save as `src/assets/photos/unsplash-coffee-pour.jpg`. Note the photographer credit; we'll surface it as alt text + a small caption in MenuPreview.

```bash
# Example — replace the URL with the chosen Unsplash photo's direct download URL
curl -L -o src/assets/photos/unsplash-coffee-pour.jpg \
  "https://images.unsplash.com/photo-XXXXX?ixlib=rb-4.0.3&q=80&w=1600"
```

- [ ] **Step 4: Commit**

```bash
git add src/assets/photos package.json package-lock.json
git commit -m "feat: add real photography and unsplash placeholder"
```

---

## Task 10: Hero component

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Create `src/components/Hero.astro`**

```astro
---
import { Image } from "astro:assets";
import heroPastry from "../assets/photos/hero-pastry.png";
---
<section class="relative isolate min-h-[88vh] flex items-end overflow-hidden">
  <Image
    src={heroPastry}
    alt="Cheddar-bacon scone with a fresh blood-orange slice on a parchment-lined tray."
    widths={[768, 1280, 1920, 2400]}
    sizes="100vw"
    loading="eager"
    fetchpriority="high"
    class="absolute inset-0 -z-10 h-full w-full object-cover"
  />
  <div class="absolute inset-0 -z-10 bg-gradient-to-b from-black/10 via-black/30 to-black/70" aria-hidden="true"></div>

  <div class="mx-auto max-w-6xl px-6 pb-20 sm:pb-28 text-cream">
    <p class="font-sans uppercase tracking-[0.3em] text-xs sm:text-sm text-cream/85 mb-6">Jonesborough, Tennessee</p>
    <h1 class="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.05] max-w-3xl">
      Handcrafted coffee on <span class="italic">Tennessee's</span> oldest corner.
    </h1>
    <p class="mt-6 max-w-xl text-cream/90 text-lg">
      Locally roasted beans, loose-leaf teas, and house-made pastries — served slowly on the corner of Main Street since 2015.
    </p>
    <div class="mt-10 flex flex-wrap gap-4">
      <a href="/menu" class="inline-flex items-center gap-2 bg-cream text-forest px-6 py-3 font-medium uppercase tracking-[0.18em] text-xs hover:bg-cream/90">See the menu</a>
      <a href="#visit" class="inline-flex items-center gap-2 border border-cream/80 text-cream px-6 py-3 font-medium uppercase tracking-[0.18em] text-xs hover:bg-cream/10">Visit us</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Use Hero in `index.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import Hero from "../components/Hero.astro";
---
<BaseLayout title="Corner Company Beverage Emporium">
  <Header slot="header" transparentAtTop />
  <Hero />
  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 3: Build and visual check**

Run: `npm run build && npm run preview`. Open `http://localhost:4321`. Confirm:
- Hero image fills the viewport with the dark gradient overlay.
- Headline reads cleanly on top of the image.
- "See the menu" and "Visit us" both keyboard-reachable.
- Header is transparent at top and fades in cream on scroll.

Stop the preview server.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro
git commit -m "feat: add Hero with full-bleed photo and serif headline"
```

---

## Task 11: SectionDivider component

**Files:**
- Create: `src/components/SectionDivider.astro`

- [ ] **Step 1: Create `src/components/SectionDivider.astro`**

```astro
---
interface Props { class?: string; }
const { class: className = "" } = Astro.props;
---
<div class:list={["flex items-center gap-4 justify-center my-12", className]} aria-hidden="true">
  <span class="h-px bg-cocoa/40 flex-1 max-w-[120px]"></span>
  <span class="w-1.5 h-1.5 bg-cocoa/60 rounded-full"></span>
  <span class="h-px bg-cocoa/40 flex-1 max-w-[120px]"></span>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SectionDivider.astro
git commit -m "feat: add SectionDivider with hairline + dot ornament"
```

---

## Task 12: AboutStrip component

**Files:**
- Create: `src/components/AboutStrip.astro`

- [ ] **Step 1: Create `src/components/AboutStrip.astro`**

```astro
---
import SectionDivider from "./SectionDivider.astro";
---
<section class="bg-paper" aria-labelledby="about-heading">
  <div class="mx-auto max-w-2xl px-6 py-20 text-center">
    <p class="uppercase tracking-[0.3em] text-xs text-cocoa mb-6">About the Emporium</p>
    <h2 id="about-heading" class="font-display text-3xl sm:text-4xl text-ink leading-snug">
      A locally-owned café in Tennessee's oldest town — where tradition meets a small dose of mischief.
    </h2>
    <SectionDivider />
    <p class="text-ink/80 leading-relaxed">
      We pour locally-roasted beans from Doe River Roasters, brew Upton loose-leaf teas, and bake our pastries each morning.
      The biscuits are from scratch. The quiche is the owner's. The corner has been here longer than the state.
    </p>
  </div>
</section>
```

- [ ] **Step 2: Add to `index.astro` after Hero**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import Hero from "../components/Hero.astro";
import AboutStrip from "../components/AboutStrip.astro";
---
<BaseLayout title="Corner Company Beverage Emporium">
  <Header slot="header" transparentAtTop />
  <Hero />
  <AboutStrip />
  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 3: Visual check**

Run: `npm run dev`. Confirm paper-colored band, centered editorial copy, hairline divider with dot.

- [ ] **Step 4: Commit**

```bash
git add src/components/AboutStrip.astro src/pages/index.astro
git commit -m "feat: add AboutStrip with editorial brand statement"
```

---

## Task 13: MenuPreview component

**Files:**
- Create: `src/components/MenuPreview.astro`

- [ ] **Step 1: Create `src/components/MenuPreview.astro`**

```astro
---
import { Image } from "astro:assets";
import MenuList from "./MenuList.astro";
import { featuredItems } from "../data/menu.ts";
import pastryTray from "../assets/photos/pastry-tray.png";
import dripChalkboard from "../assets/photos/drip-chalkboard.png";
---
<section class="bg-cream" aria-labelledby="menu-preview-heading">
  <div class="mx-auto max-w-6xl px-6 py-24 grid gap-12 md:grid-cols-12 items-start">
    <div class="md:col-span-7">
      <p class="uppercase tracking-[0.3em] text-xs text-cocoa mb-4">From the menu</p>
      <h2 id="menu-preview-heading" class="font-display text-4xl text-forest mb-10">A few favorites.</h2>
      <MenuList items={featuredItems.slice(0, 6)} />
      <a href="/menu" class="mt-10 inline-flex items-center gap-2 text-forest font-medium uppercase tracking-[0.18em] text-xs underline underline-offset-8 decoration-cocoa/40 hover:decoration-forest">
        See the full menu →
      </a>
    </div>
    <div class="md:col-span-5 grid grid-cols-2 gap-4 md:sticky md:top-24">
      <figure class="rounded-sm overflow-hidden">
        <Image src={pastryTray} alt="A warm cheddar-bacon scone resting on a stainless tray, fresh from the oven." widths={[400, 800]} sizes="(min-width: 768px) 240px, 50vw" loading="lazy" class="w-full h-full object-cover aspect-[3/4]" />
      </figure>
      <figure class="rounded-sm overflow-hidden mt-12">
        <Image src={dripChalkboard} alt="A chalkboard listing today's drip coffee: Ethiopian Yirgacheffe and Congo Dark Roast." widths={[400, 800]} sizes="(min-width: 768px) 240px, 50vw" loading="lazy" class="w-full h-full object-cover aspect-[3/4]" />
      </figure>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add to `index.astro` after AboutStrip**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import Hero from "../components/Hero.astro";
import AboutStrip from "../components/AboutStrip.astro";
import MenuPreview from "../components/MenuPreview.astro";
---
<BaseLayout title="Corner Company Beverage Emporium">
  <Header slot="header" transparentAtTop />
  <Hero />
  <AboutStrip />
  <MenuPreview />
  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 3: Visual check**

Run: `npm run dev`. Confirm the menu list renders on the left, two photo asides on the right (offset), "See the full menu →" link styled and keyboard-reachable.

- [ ] **Step 4: Commit**

```bash
git add src/components/MenuPreview.astro src/pages/index.astro
git commit -m "feat: add MenuPreview with featured items and photo asides"
```

---

## Task 14: VisitSection component

**Files:**
- Create: `src/components/VisitSection.astro`

- [ ] **Step 1: Create `src/components/VisitSection.astro`**

```astro
---
import { Image } from "astro:assets";
import exterior from "../assets/photos/exterior.png";
---
<section id="visit" class="bg-paper" aria-labelledby="visit-heading">
  <div class="mx-auto max-w-6xl px-6 py-24 grid gap-12 md:grid-cols-2 items-center">
    <div>
      <p class="uppercase tracking-[0.3em] text-xs text-cocoa mb-4">Find us</p>
      <h2 id="visit-heading" class="font-display text-4xl text-forest mb-8">On the corner of East Main.</h2>
      <address class="not-italic text-lg leading-relaxed mb-6">
        148 E Main St<br />
        Jonesborough, TN 37659
      </address>
      <dl class="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 mb-8 text-ink/85">
        <dt class="font-medium">Mon–Sat</dt><dd>8am – 3pm</dd>
        <dt class="font-medium">Sunday</dt><dd>8am – 1pm</dd>
        <dt class="font-medium">Phone</dt><dd><a href="tel:+14239306575" class="underline-offset-4 hover:underline">(423) 930-6575</a></dd>
      </dl>
      <div class="flex flex-wrap gap-4">
        <a href="https://maps.google.com/?q=148+E+Main+St+Jonesborough+TN+37659" target="_blank" rel="noopener" class="inline-flex items-center gap-2 bg-forest text-cream px-6 py-3 font-medium uppercase tracking-[0.18em] text-xs hover:bg-forest/90">Get directions</a>
        <a href="tel:+14239306575" class="inline-flex items-center gap-2 border border-forest/70 text-forest px-6 py-3 font-medium uppercase tracking-[0.18em] text-xs hover:bg-forest/5">Call ahead</a>
      </div>
    </div>
    <figure>
      <Image src={exterior} alt="Corner Company Beverage Emporium's brick storefront on East Main Street, with white trim and a covered porch." widths={[640, 1024, 1280]} sizes="(min-width: 768px) 50vw, 100vw" loading="lazy" class="w-full h-auto rounded-sm" />
    </figure>
  </div>
  <div class="mx-auto max-w-6xl px-6 pb-16">
    <iframe
      title="Map showing Corner Company Beverage Emporium at 148 E Main St, Jonesborough, TN"
      src="https://www.google.com/maps?q=148+E+Main+St+Jonesborough+TN+37659&output=embed"
      width="100%"
      height="320"
      style="border:0;"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</section>
```

- [ ] **Step 2: Add to `index.astro` after MenuPreview**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import Hero from "../components/Hero.astro";
import AboutStrip from "../components/AboutStrip.astro";
import MenuPreview from "../components/MenuPreview.astro";
import VisitSection from "../components/VisitSection.astro";
---
<BaseLayout title="Corner Company Beverage Emporium">
  <Header slot="header" transparentAtTop />
  <Hero />
  <AboutStrip />
  <MenuPreview />
  <VisitSection />
  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 3: Visual check**

Run: `npm run dev`. Confirm:
- Visit section anchor link from header ("Visit") scrolls to this section.
- Map embeds and loads lazily.
- "Get directions" opens Google Maps in a new tab.
- All buttons keyboard-reachable.

- [ ] **Step 4: Commit**

```bash
git add src/components/VisitSection.astro src/pages/index.astro
git commit -m "feat: add VisitSection with address, hours, directions, map"
```

---

## Task 15: SocialProof component

**Files:**
- Create: `src/components/SocialProof.astro`

- [ ] **Step 1: Create `src/components/SocialProof.astro`**

```astro
---
---
<section class="bg-cream" aria-labelledby="social-proof-heading">
  <div class="mx-auto max-w-3xl px-6 py-24 text-center">
    <p class="uppercase tracking-[0.3em] text-xs text-cocoa mb-6">What guests are saying</p>
    <blockquote class="relative">
      <span class="absolute -left-2 -top-6 text-terracotta font-display text-6xl leading-none select-none" aria-hidden="true">“</span>
      <p id="social-proof-heading" class="font-display text-2xl sm:text-3xl italic leading-snug text-ink">
        Michael has outdone himself. The food is incredible — and it still feels like the same corner we've loved for years.
      </p>
    </blockquote>
    <p class="mt-8 uppercase tracking-[0.2em] text-xs text-cocoa">
      4.5★ · 150+ reviews · Featured in <span class="text-forest">TN Vacation</span>
    </p>
  </div>
</section>
```

- [ ] **Step 2: Add to `index.astro` between MenuPreview and VisitSection** (chronologically it reads better mid-page — but spec puts it after VisitSection; honor the spec):

Final `index.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import Hero from "../components/Hero.astro";
import AboutStrip from "../components/AboutStrip.astro";
import MenuPreview from "../components/MenuPreview.astro";
import VisitSection from "../components/VisitSection.astro";
import SocialProof from "../components/SocialProof.astro";
---
<BaseLayout title="Corner Company Beverage Emporium">
  <Header slot="header" transparentAtTop />
  <Hero />
  <AboutStrip />
  <MenuPreview />
  <VisitSection />
  <SocialProof />
  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 3: Visual check**

Run: `npm run dev`. Confirm pull-quote renders with terracotta opening quote glyph, italic Fraunces body, small-caps reputation line. Read it on mobile too.

- [ ] **Step 4: Commit**

```bash
git add src/components/SocialProof.astro src/pages/index.astro
git commit -m "feat: add SocialProof pull-quote and reputation line"
```

---

## Task 16: Menu page

**Files:**
- Create: `src/pages/menu.astro`

- [ ] **Step 1: Create `src/pages/menu.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import MenuList from "../components/MenuList.astro";
import SectionDivider from "../components/SectionDivider.astro";
import { Image } from "astro:assets";
import { menu } from "../data/menu.ts";
import pastryTray from "../assets/photos/pastry-tray.png";
import dripChalkboard from "../assets/photos/drip-chalkboard.png";

const sectionImages: Record<string, ImageMetadata | undefined> = {
  "coffee-tea": dripChalkboard,
  "breakfast": pastryTray,
};
const sectionAlt: Record<string, string> = {
  "coffee-tea": "Chalkboard listing today's drip coffee: Ethiopian Yirgacheffe and Congo Dark Roast.",
  "breakfast": "Warm cheddar-bacon scone fresh from the oven on a stainless tray.",
};
---
<BaseLayout title="Menu" description="Espresso, drip coffee, loose-leaf teas, house-made pastries, breakfast and lunch at Corner Company Beverage Emporium in Jonesborough, TN.">
  <Header slot="header" />
  <section class="pt-32 pb-16 text-center">
    <p class="uppercase tracking-[0.3em] text-xs text-cocoa mb-4">The full menu</p>
    <h1 class="font-display text-5xl sm:text-6xl text-forest">Today on the corner.</h1>
    <p class="mt-6 text-ink/70 max-w-xl mx-auto px-6">
      Pastries baked this morning. Coffee roasted in Elizabethton. Quiche from the kitchen. Everything below served at 148 E Main.
    </p>
  </section>

  {menu.map((category, idx) => (
    <section class:list={["py-12", idx % 2 === 0 ? "bg-cream" : "bg-paper"]} aria-labelledby={`section-${category.id}`}>
      <div class="mx-auto max-w-5xl px-6 grid gap-10 md:grid-cols-12 items-start">
        <div class:list={[idx % 2 === 0 ? "md:order-1" : "md:order-2", "md:col-span-7"]}>
          <h2 id={`section-${category.id}`} class="font-display text-3xl text-forest">{category.title}</h2>
          {category.subtitle && <p class="uppercase tracking-[0.2em] text-xs text-cocoa mt-2 mb-6">{category.subtitle}</p>}
          <div class="mt-6">
            <MenuList items={category.items} />
          </div>
        </div>
        {sectionImages[category.id] && (
          <figure class:list={[idx % 2 === 0 ? "md:order-2" : "md:order-1", "md:col-span-5"]}>
            <Image src={sectionImages[category.id]!} alt={sectionAlt[category.id]} widths={[400, 800]} sizes="(min-width: 768px) 360px, 100vw" loading="lazy" class="w-full h-auto rounded-sm aspect-[3/4] object-cover" />
          </figure>
        )}
      </div>
    </section>
  ))}

  <SectionDivider />
  <p class="mx-auto max-w-3xl px-6 pb-24 text-xs text-ink/55 leading-relaxed text-center">
    Consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of foodborne illness, especially if you have certain medical conditions.
  </p>

  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 2: Build and visual check**

Run: `npm run build && npm run preview`. Open `http://localhost:4321/menu`. Confirm:
- Header is solid cream (not transparent) — the menu page uses default Header.
- Categories alternate cream/paper backgrounds with images alternating left/right.
- FDA disclaimer renders at the bottom.
- "Menu" nav link from home scrolls/navigates correctly.

- [ ] **Step 3: Commit**

```bash
git add src/pages/menu.astro
git commit -m "feat: add /menu page with alternating sections"
```

---

## Task 17: 404 page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create `src/pages/404.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
---
<BaseLayout title="Page not found">
  <Header slot="header" />
  <section class="min-h-[70vh] flex items-center">
    <div class="mx-auto max-w-xl px-6 text-center">
      <p class="uppercase tracking-[0.3em] text-xs text-cocoa mb-6">404</p>
      <h1 class="font-display text-5xl text-forest mb-4">We can't find that page.</h1>
      <p class="text-ink/75 mb-8">But we can pour you a coffee. Head back to the home page or check out the menu.</p>
      <div class="flex justify-center gap-4 flex-wrap">
        <a href="/" class="bg-forest text-cream px-6 py-3 uppercase tracking-[0.18em] text-xs">Home</a>
        <a href="/menu" class="border border-forest/70 text-forest px-6 py-3 uppercase tracking-[0.18em] text-xs">Menu</a>
      </div>
    </div>
  </section>
  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 2: Build verify**

Run: `npm run build`. Confirm `dist/404.html` exists.

- [ ] **Step 3: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: add 404 page"
```

---

## Task 18: Sitemap, robots.txt, favicons, OG image

**Files:**
- Modify: `astro.config.mjs`, `package.json`
- Create: `public/robots.txt`, `public/favicon.svg`, `public/favicon-16.png`, `public/favicon-32.png`, `public/apple-touch-icon.png`, `public/og-image.png`

- [ ] **Step 1: Install sitemap integration**

```bash
npm install --save-exact @astrojs/sitemap@^3.2.0
```

- [ ] **Step 2: Add sitemap to `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://corner-company.up.railway.app',
  trailingSlash: 'never',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 3: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://corner-company.up.railway.app/sitemap-index.xml
```

- [ ] **Step 4: Create `public/favicon.svg` (monogram-derived, single C centered)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#F4EFE6"/>
  <circle cx="16" cy="16" r="14" fill="none" stroke="#2F4A3A" stroke-width="1"/>
  <text x="16" y="22" text-anchor="middle" font-family="Georgia, serif" font-size="18" font-weight="600" fill="#2F4A3A">C</text>
</svg>
```

- [ ] **Step 5: Generate PNG favicons + apple-touch-icon + OG image**

Write a one-off Node script `scripts/generate-images.mjs`:

```js
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { mkdirSync } from "node:fs";

const svg = readFileSync("public/favicon.svg");

mkdirSync("public", { recursive: true });
await sharp(svg).resize(16, 16).png().toFile("public/favicon-16.png");
await sharp(svg).resize(32, 32).png().toFile("public/favicon-32.png");
await sharp(svg).resize(180, 180).png().toFile("public/apple-touch-icon.png");

// OG image: 1200x630 cream background with the monogram centered + wordmark
const og = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#2F4A3A"/>
  <g transform="translate(600 240)">
    <circle r="120" fill="none" stroke="#F4EFE6" stroke-width="1.5"/>
    <circle r="108" fill="none" stroke="#F4EFE6" stroke-width="1"/>
    <text text-anchor="middle" y="-12" font-family="Georgia, serif" font-size="74" font-weight="500" fill="#F4EFE6">C</text>
    <text text-anchor="middle" y="20" font-family="Georgia, serif" font-style="italic" font-size="28" fill="#F4EFE6">&amp;</text>
    <text text-anchor="middle" y="64" font-family="Georgia, serif" font-size="74" font-weight="500" fill="#F4EFE6">C</text>
  </g>
  <text x="600" y="460" text-anchor="middle" font-family="Georgia, serif" font-size="56" fill="#F4EFE6">Corner Company</text>
  <text x="600" y="510" text-anchor="middle" font-family="Inter, sans-serif" font-size="22" letter-spacing="6" fill="#F4EFE6">BEVERAGE EMPORIUM</text>
  <text x="600" y="570" text-anchor="middle" font-family="Inter, sans-serif" font-size="18" letter-spacing="3" fill="#F4EFE6" opacity="0.7">JONESBOROUGH · TENNESSEE</text>
</svg>
`;
await sharp(Buffer.from(og)).png().toFile("public/og-image.png");

console.log("Generated favicons and OG image.");
```

Run it:

```bash
node scripts/generate-images.mjs
```

Expected: `public/favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `og-image.png` written.

- [ ] **Step 6: Build verify**

Run: `npm run build`. Confirm `dist/sitemap-index.xml`, `dist/sitemap-0.xml`, `dist/robots.txt`, and all favicon files exist.

- [ ] **Step 7: Commit**

```bash
git add astro.config.mjs package.json package-lock.json public scripts/generate-images.mjs
git commit -m "feat: add sitemap, robots.txt, favicons, and OG image"
```

---

## Task 19: README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create `README.md`**

```markdown
# Corner Company Beverage Emporium

Marketing site for Corner Company Beverage Emporium, 148 E Main St, Jonesborough, TN.

## Stack

- Astro 5 (static output)
- Tailwind CSS v4 via the official Vite plugin
- TypeScript-typed menu data (`src/data/menu.ts`)
- Self-hosted Fraunces + Inter via `@fontsource-variable`
- Dockerized nginx for production serving
- Deployed to Railway from a GHCR image, released via GitHub Actions

## Local development

```bash
npm install
npm run dev
```

Dev server: http://localhost:4321

## Production build

```bash
npm run build
npm run preview
```

## Releasing

Releases are cut from the `main` branch via the **Release** workflow in GitHub Actions:

1. Go to Actions → Release → Run workflow
2. Enter a semver string without the `v` prefix (e.g. `1.2.0`)
3. The workflow will:
   - Install, build, and run Lighthouse against the production build (accessibility ≥ 95 gate)
   - Tag the commit `v1.2.0`, create a GitHub Release
   - Build and push a Docker image to `ghcr.io/<owner>/corner-company:v1.2.0` and `:latest`
   - Trigger a Railway redeploy via the Railway CLI

### Required GitHub secrets

- `RAILWAY_TOKEN` — Railway project token (Project → Settings → Tokens)

### Required Railway setup

- Service named `corner-company` (or update the workflow to match) deploying the GHCR image.
- Public custom domain optional; Railway's `*.up.railway.app` URL works for the demo.

## Editing the menu

Edit `src/data/menu.ts`. The home page's Featured strip uses items with `featured: true`. The `/menu` page renders every item by category. Open a PR — every push to `main` is build-tested.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with local dev and release instructions"
```

---

## Task 20: Lighthouse CI configuration

**Files:**
- Create: `.lighthouserc.json`

- [ ] **Step 1: Create `.lighthouserc.json`**

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "url": [
        "http://localhost/index.html",
        "http://localhost/menu/index.html"
      ],
      "numberOfRuns": 3,
      "settings": {
        "preset": "desktop",
        "throttlingMethod": "devtools"
      }
    },
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:best-practices": ["warn", { "minScore": 0.95 }],
        "categories:seo": ["warn", { "minScore": 0.95 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

- [ ] **Step 2: Install Lighthouse CI for local runs**

```bash
npm install --save-dev --save-exact @lhci/cli@^0.14.0
```

- [ ] **Step 3: Add an npm script**

Update `package.json` `scripts`:

```json
"lhci": "lhci autorun"
```

- [ ] **Step 4: Run locally and verify accessibility ≥ 95**

```bash
npm run build
npm run lhci
```

Expected: Lighthouse runs on `/` and `/menu`. Each Accessibility score must be ≥ 0.95. If any assertion fails, address the violation (likely candidates: low-contrast text, missing alt text, missing landmarks) and re-run.

- [ ] **Step 5: Manual axe-DevTools scan**

Open `npm run preview`, install/open the axe-DevTools Chrome extension, scan `/` and `/menu`. Expected: zero critical or serious issues.

If any are found, fix in place and re-run Lighthouse.

- [ ] **Step 6: Commit**

```bash
git add .lighthouserc.json package.json package-lock.json
git commit -m "test: add Lighthouse CI config with accessibility gate"
```

---

## Task 21: Dockerfile and nginx config

**Files:**
- Create: `Dockerfile`, `nginx.conf`, `.dockerignore`

- [ ] **Step 1: Create `.dockerignore`**

```
node_modules
dist
.astro
.git
.github
docs
.lighthouseci
.DS_Store
*.log
```

- [ ] **Step 2: Create `nginx.conf`**

```nginx
worker_processes 1;

events { worker_connections 1024; }

http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;
  sendfile      on;
  keepalive_timeout 65;

  gzip on;
  gzip_types text/plain text/css application/javascript application/json image/svg+xml;
  gzip_min_length 1024;

  server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Long-cache hashed assets
    location /_astro/ {
      expires 1y;
      add_header Cache-Control "public, immutable";
      try_files $uri =404;
    }

    # Short-cache html
    location / {
      add_header Cache-Control "public, max-age=300";
      try_files $uri $uri/ $uri.html /404.html;
    }

    error_page 404 /404.html;
  }
}
```

- [ ] **Step 3: Create `Dockerfile`**

```dockerfile
# syntax=docker/dockerfile:1.7

# --- Stage 1: build ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Stage 2: serve ---
FROM nginx:1.27-alpine AS serve
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://localhost:8080/ || exit 1
```

- [ ] **Step 4: Local Docker smoke test**

```bash
docker build -t corner-company:dev .
docker run --rm -p 8080:8080 corner-company:dev
```

Open `http://localhost:8080`. Confirm:
- Home page loads.
- `/menu` resolves (try `http://localhost:8080/menu`).
- Static assets under `/_astro/` are served with long-cache headers (inspect Network tab).

Stop the container (Ctrl+C).

- [ ] **Step 5: Commit**

```bash
git add Dockerfile nginx.conf .dockerignore
git commit -m "feat: add Dockerfile and nginx config for production serving"
```

---

## Task 22: GitHub Actions release workflow

**Files:**
- Create: `.github/workflows/release.yml`

- [ ] **Step 1: Create `.github/workflows/release.yml`**

```yaml
name: Release

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Semver version (no v prefix, e.g. 1.2.0)'
        required: true
        type: string

permissions:
  contents: write
  packages: write

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Validate version
        run: |
          if [[ ! "${{ inputs.version }}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            echo "Version must be semver (e.g. 1.2.0)"
            exit 1
          fi

      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install
        run: npm ci

      - name: Build
        run: npm run build

      - name: Lighthouse CI (accessibility gate)
        run: npx --yes @lhci/cli@0.14.0 autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

      - name: Configure git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

      - name: Create tag
        run: |
          git tag -a "v${{ inputs.version }}" -m "Release v${{ inputs.version }}"
          git push origin "v${{ inputs.version }}"

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build and push image
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:v${{ inputs.version }}
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: v${{ inputs.version }}
          name: v${{ inputs.version }}
          generate_release_notes: true

      - name: Install Railway CLI
        run: npm install -g @railway/cli

      - name: Deploy to Railway
        run: railway redeploy --service corner-company --environment production --yes
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

- [ ] **Step 2: Make the GHCR package public**

After the first run pushes an image, go to GitHub → your profile/org → Packages → `corner-company` → Package settings → Change visibility → Public. This needs to be done once.

- [ ] **Step 3: Add the `RAILWAY_TOKEN` secret**

GitHub → repo → Settings → Secrets and variables → Actions → New repository secret:
- Name: `RAILWAY_TOKEN`
- Value: a project token from Railway (Project → Settings → Tokens → Create token)

- [ ] **Step 4: Verify locally that the workflow YAML is syntactically valid**

```bash
# Optional: install actionlint and lint the workflow
brew install actionlint 2>/dev/null || true
actionlint .github/workflows/release.yml
```

Expected: No errors. If actionlint isn't installed, skip this step.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/release.yml
git commit -m "ci: add release workflow with Lighthouse gate, GHCR push, Railway deploy"
```

---

## Task 23: First release dry run

**Files:** none.

- [ ] **Step 1: Push to GitHub**

If the repo doesn't have a remote yet, create one and push:

```bash
gh repo create corner-company-beverage --public --source=. --remote=origin --push
```

If the remote already exists:

```bash
git push -u origin main
```

- [ ] **Step 2: Configure Railway project**

In Railway:
1. New Project → Deploy from Docker Image
2. Image: `ghcr.io/<your-github-handle-or-org>/corner-company-beverage:latest` (lowercase the repo path — GHCR is case-sensitive)
3. Set the service name to `corner-company`
4. Set the port to `8080` (matches `nginx.conf`)
5. Skip the deploy for now (no image exists yet) or let it fail; the release workflow will trigger one.

Note the auto-assigned `*.up.railway.app` URL.

- [ ] **Step 3: Run the release workflow**

GitHub → Actions → Release → Run workflow → version `0.1.0` → Run.

Expected:
- All jobs succeed.
- Tag `v0.1.0` appears.
- GHCR shows `corner-company-beverage:v0.1.0` and `:latest`.
- A GitHub Release is created.
- Railway redeploys to the new image; the public URL serves the site.

- [ ] **Step 4: Smoke test the deployed site**

Visit the Railway URL. Confirm:
- Home page loads, hero image displays, fonts load, menu preview renders.
- `/menu` resolves correctly.
- 404 page works (visit a bogus URL).
- View source → OG image URL is correct.
- DevTools Lighthouse against the live URL: Accessibility ≥ 95.

- [ ] **Step 5: Update `astro.config.mjs` `site` to the real Railway URL if different from the placeholder**

If the assigned Railway URL differs from `https://corner-company.up.railway.app`, update `astro.config.mjs`:

```js
site: 'https://<actual>.up.railway.app',
```

Rebuild and run a second release (`0.1.1`) to regenerate the sitemap and OG canonical URLs with the correct domain.

```bash
git add astro.config.mjs
git commit -m "fix: set site URL to actual Railway domain"
git push
```

Then GitHub → Actions → Release → Run workflow → `0.1.1`.

---

## Done

After Task 23 completes successfully, the site is live and ready to demo to Michael. Items still open for the pitch conversation:

- Confirm Sunday hours (one source disagrees).
- Confirm current Instagram handle (`@cornercompanyjbo` vs `@cornercojbo`).
- Get drip-coffee prices and current pastry rotation from owner.
- Decide whether to mention the attached Maker's Market.
- Plan for migrating the Facebook handle URL post-rebrand.
