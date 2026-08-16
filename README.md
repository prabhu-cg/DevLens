# DevLens

**From pixels to implementation clarity.**

DevLens is a browser-based, local-first design documentation and developer handoff tool for UX/UI/Product designers. It reads an imported Figma file, surfaces ambiguity, and helps a designer turn their intent into documentation a developer can build from — with no backend, no accounts, and no data leaving the browser.

This repository currently contains the **Phase 1A production foundation**: architecture, design tokens, routing, and reusable UI primitives. The Figma import pipeline, documentation engine, audit engine, readiness scoring, and export are not yet implemented.

## Stack

React, TypeScript (strict), Vite, React Router, Zustand, React Hook Form, Zod, Dexie.js, CSS Modules, Radix UI, Lucide, Vitest, React Testing Library, Playwright, ESLint, Prettier.

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Script                 | Description                          |
| ----------------------- | ------------------------------------ |
| `npm run dev`            | Start the Vite dev server            |
| `npm run build`          | Type-check and build for production  |
| `npm run preview`        | Preview the production build         |
| `npm run typecheck`      | Run `tsc -b` across all projects     |
| `npm run lint`           | Run ESLint                           |
| `npm run lint:fix`       | Run ESLint with autofix              |
| `npm run format`         | Format the codebase with Prettier    |
| `npm run format:check`   | Check formatting without writing     |
| `npm test`               | Run the Vitest unit test suite       |
| `npm run test:watch`     | Run Vitest in watch mode             |
| `npm run test:e2e`       | Run the Playwright e2e suite         |

## Project structure

```text
src/
├── app/            # App shell, router
├── components/
│   ├── ui/         # Reusable accessible primitives
│   ├── layout/     # Header, footer, app layout, not-found
│   └── marketing/  # Landing page sections
├── features/        # landing, projects, documentation, audit, export
├── domain/           # Project, Design, Documentation, Audit interfaces
├── services/         # storage, figma, export contracts
├── store/             # Zustand stores
├── hooks/
├── schemas/           # Zod validation schemas
├── types/
├── utils/
└── styles/            # tokens.css, global.css
```

## Principles

Browser-based, local-first, free to use, privacy-first, offline-capable after import, portable, accessible, responsive. No AI, no cloud storage, no accounts, no subscriptions, no analytics, no team collaboration.
