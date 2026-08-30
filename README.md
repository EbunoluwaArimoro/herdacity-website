# Herdacity Website

A modern, content-driven public website built with Next.js (App Router) and TypeScript. This repository contains the source for Herdacity's marketing site, composed of page routes, shared components, and small API routes.

## Tech stack

- Next.js (App Router) + TypeScript
- React 19
- PostCSS / Tailwind related tooling
- Framer Motion for animations

## Quick start

Prerequisites: Node.js (LTS) and npm (or pnpm/yarn).

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 and start editing pages in the [app/](app/) directory. The app uses the Next.js App Router — updates hot-reload during development.

## Scripts

Available scripts (from `package.json`):

- `npm run dev` — start development server (`next dev`)
- `npm run build` — build for production (`next build`)
- `npm run start` — start production server (`next start`)
- `npm run lint` — runs ESLint (`eslint`)

Run a production build locally:

```bash
npm run build
npm run start
```

## Project structure

- `app/` — pages and server routes (App Router). Entry: [app/page.tsx](app/page.tsx).
- `components/` — shared components and layout (`components/layout/Footer.tsx`, `components/layout/Navbar.tsx`).
- `sections/` — page sections used to compose pages (homepage sections, about, events, programs, voices).
- `context/` — React contexts (`context/ModalContext.tsx`).
- `public/` — static assets and images.
- `next.config.ts`, `tsconfig.json`, `postcss.config.mjs` — project configuration files.

Notable files:

- Subscription API route: [app/api/subscribe/route.ts](app/api/subscribe/route.ts)
- Homepage: [app/page.tsx](app/page.tsx)
- Example section components: [sections/Hero.tsx](sections/Hero.tsx), [sections/Programs.tsx](sections/Programs.tsx)

## Dependencies

Key dependencies (from `package.json`): `next`, `react`, `react-dom`, `framer-motion`, `clsx`, `lucide-react`, `react-masonry-css`, `tailwind-merge`.

Dev dependencies include TypeScript, ESLint, Tailwind/PostCSS tooling.

## Environment variables

If the project requires any runtime secrets or API keys, create a `.env.local` file at the repository root and add variables there. Example (if needed):

```env
# MAILER_API_KEY=your-key-here
# NEXT_PUBLIC_ANALYTICS_ID=xxxxx
```

Restart the dev server after changing environment variables.

## Deployment

This app is ready for deployment on Vercel (recommended). To deploy:

1. Push your code to GitHub (or connect your repository to Vercel).
2. Create a new project in Vercel and import the repo (use default Next.js settings).
3. Add any required environment variables in the Vercel dashboard.

Vercel will run `npm run build` during deployment.

## Contributing

- Create a branch from `main` (feature/my-change).
- Follow existing code style and component patterns.
- Run `npm run lint` and `npm run build` before opening a pull request.

If you'd like a contribution checklist or commit hooks (`husky`, `lint-staged`), I can add them.

## Troubleshooting

- Build fails on Vercel: verify TypeScript types and missing environment variables; check the server logs in Vercel.
- Local dev issues: remove `.next` and rerun `npm run dev` if stale cache causes problems.

## License

No license is included in this repository. If you want this project to be open source, add a `LICENSE` file (for example, MIT).

---
