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

## Photography

All four photos in `src/assets/photos/` are currently **Unsplash placeholders**. See `src/assets/photos/README.md` for the swap process when real photos are available.
