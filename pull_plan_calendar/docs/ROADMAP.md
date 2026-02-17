# Pull Plan Calendar – Roadmap

## Current state (investigation summary)

### Library (`src/`)
- **Framework-agnostic**: No imports from Next.js. Only React and standard deps (`dayjs`, `@dnd-kit/core`, `react-grid-layout`). `"use client"` is a React 18 directive and works in any React bundler.
- **Structure**: Core in `src/components/`, types in `src/types/`, utils in `src/utils/`, optional demo helper in `src/demo/` (CalendarContainer).
- **Build**: `npm run build:lib` (tsup) → `dist/` (ESM + CJS + types). Package.json already has `exports`, `main`, `module`, `types`.

### App (`app/`)
- **Uses the lib**: `app/page.tsx` imports from `"src"` (CalendarContainer, mapTaskToEvent, mapEventToTask) and from `@/app/mocks/*`. So the live demo runs on the library.
- **Dead code**: The entire `app/components/` tree (Calendar, CalendarContainer, WeekView, DayView, MonthView, YearView, Week, UI, tasks) is a duplicate that **nothing imports**. It still references `@/app/components` and mocks. Safe to remove.
- **Next.js**: Only used for the demo app (routing, layout, fonts, global CSS). Not required by the library.

### Conclusion
- You do **not** need to remove the app or Next.js to have a valid library.
- You **do** need to clean up: remove duplicate `app/components/` and keep the app as a minimal demo that only uses `src` + mocks.
- Splitting into **another repo** is optional and useful when you want a second consumer (e.g. real product app) or to publish the lib on npm and use it elsewhere.

---

## Recommendation: don’t remove app – slim it down

1. **Keep one repo** with:
   - **Library**: `src/` (and built `dist/` when you run `build:lib`).
   - **Demo app**: Minimal Next.js app (layout, one page, mocks, global styles). No duplicate calendar components.

2. **Optional later**:
   - **Monorepo**: Move lib to `packages/calendar` and demo to `apps/demo` (e.g. with npm/pnpm workspaces) so the lib package has zero Next dependency in its folder.
   - **Second repo**: Create a new repo (e.g. `pull-plan-calendar-demo` or your product app) that installs the lib via npm or `"pull-plan-calendar": "file:../pull_plan_calendar"` or git URL.

---

## Roadmap

### Phase 1 – Clean up this repo (do first)

| Step | Action |
|------|--------|
| 1.1 | **Remove duplicate app components** – Delete the entire `app/components/` directory (Calendar, CalendarContainer, WeekView, DayView, MonthView, YearView, Week, ui/, tasks/). The app already uses the lib from `src`; these are unused. |
| 1.2 | **Keep app minimal** – Leave only: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `app/calendar.css`, `app/mocks/`. Ensure `app/page.tsx` (and any other pages) import only from `"src"` and `@/app/mocks`. |
| 1.3 | **Verify** – Run `npm run dev` and `npm run build`. Fix any broken imports (e.g. if something still pointed at `@/app/components`). |

Result: Single source of truth in `src/`, app is a thin demo shell.

---

### Phase 2 – Library packaging (publish-ready)

| Step | Action |
|------|--------|
| 2.1 | **Peer dependencies** – In package.json, move `react`, `react-dom` (and optionally `dayjs`) to `peerDependencies`; keep them in `devDependencies` for the demo. Add `peerDependenciesMeta` for optional peer if needed. |
| 2.2 | **Next only for demo** – Move `next` to `devDependencies` so the published package doesn’t list Next as a dependency. |
| 2.3 | **CSS / sideEffects** – If the lib imports CSS (e.g. react-grid-layout), either document that consumers must include it, or ship a small entry that re-exports it and set `"sideEffects": ["**/*.css"]` (or drop `sideEffects: false`). |
| 2.4 | **Build and test consumption** – Run `npm run build:lib`, then in another local project add `"pull_plan_calendar": "file:../path/to/pull_plan_calendar"` and import `Calendar` / `CalendarContainer` to confirm the built package works. |

Result: Lib can be published or linked without pulling in Next or duplicating React.

---

### Phase 3 – Optional: separate demo or monorepo

Choose at most one path when you need it.

**Option A – Second repo (e.g. “pull-plan-calendar-demo”)**

| Step | Action |
|------|--------|
| 3A.1 | Create a new repo with Next.js (or Vite + React). |
| 3A.2 | Install the lib: `npm install pull_plan_calendar` (after publish) or `npm install git+https://...` or `"pull_plan_calendar": "file:../pull_plan_calendar"`. |
| 3A.3 | Copy over mocks (or fetch from API), one page that renders `CalendarContainer` / `Calendar` with your events. |
| 3A.4 | (Optional) Remove the demo from the **lib repo**: delete `app/`, Next, and demo-only deps from the lib repo so it becomes lib-only. |

**Option B – Monorepo in this repo**

| Step | Action |
|------|--------|
| 3B.1 | Restructure: e.g. `packages/calendar/` (current `src/` + package.json for the lib only), `apps/demo/` (current `app/` + Next config). Root package.json with `workspaces: ["packages/*", "apps/*"]`. |
| 3B.2 | In `apps/demo`, depend on `"pull_plan_calendar": "workspace:*"`. Remove `src/` from repo root; lib lives only under `packages/calendar`. |
| 3B.3 | Root scripts: `build` = build lib then app; `dev` = run demo dev server. |

Result: Clear boundary between “calendar package” and “demo app”; lib has no Next in its package.

---

### Phase 4 – Docs and quality

| Step | Action |
|------|--------|
| 4.1 | **README** – Document: install, minimal usage (e.g. `<Calendar events={...} onEventChange={...} />`), props, theming/customization, and that the repo includes a Next.js demo in `app/` (or in `apps/demo` if you did Phase 3B). |
| 4.2 | **Changelog** – Keep a CHANGELOG or release notes for versions. |
| 4.3 | **Tests** – Add unit tests for date/event helpers and, if useful, a simple render test for `Calendar` with mock events. |

---

## Quick decision guide

- **“I just want a clean repo and one place to demo”**  
  → Do **Phase 1** only. Keep app + Next as the demo; lib stays in `src/`.

- **“I want to publish the lib on npm”**  
  → Do **Phase 1 + Phase 2**. Optionally Phase 4 (README, tests).

- **“I want to use this lib in another project (different repo)”**  
  → Do **Phase 1 + Phase 2**, then create a **second repo** (Phase 3A) that depends on the published or linked package. You don’t have to remove the demo from the lib repo.

- **“I want the lib to live in a separate package folder with zero Next”**  
  → Do **Phase 1**, then **Phase 3B** (monorepo). Then Phase 2 in `packages/calendar`.

You do **not** need to remove the app or Next to have a proper library; slimming the app and packaging the lib is enough. Creating another repo is a next step when you have a second consumer or want a clean “lib-only” clone.
