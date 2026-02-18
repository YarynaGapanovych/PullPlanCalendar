# How to copy (vendor) packages into your project

This doc describes how to vendor **react-grid-layout** and **@dnd-kit/core** so they live under `vendor/` and the project uses those copies instead of npm. No import path changes are needed.

---

# react-grid-layout

---

## Step 1: Create the vendor folder

From the project root:

```bash
mkdir -p vendor/react-grid-layout
```

---

## Step 2: Copy the built files from node_modules

Copy the **dist** and **css** folders from the installed package:

```bash
cp -R node_modules/react-grid-layout/dist vendor/react-grid-layout/
cp -R node_modules/react-grid-layout/css vendor/react-grid-layout/
```

(On Windows use `xcopy` or copy the folders in File Explorer.)

---

## Step 3: Add a minimal package.json in the vendor package

Create `vendor/react-grid-layout/package.json` so Node and your bundler resolve the package correctly:

```json
{
  "name": "react-grid-layout",
  "version": "2.2.2",
  "private": true,
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "sideEffects": ["css/styles.css"]
}
```

---

## Step 4: Point your project to the vendor copy

In your **root** `package.json`:

1. Remove **react-grid-layout** from `dependencies`.
2. Add a **file dependency** so the project uses the vendor copy:

```json
"dependencies": {
  "@dnd-kit/core": "^6.3.1",
  "dayjs": "^1.11.19",
  "react-grid-layout": "file:./vendor/react-grid-layout"
}
```

---

## Step 5: Reinstall dependencies

Reinstall so the lockfile and `node_modules` use the vendor copy:

```bash
pnpm install
```

(Or `npm install` / `yarn install`.)

---

## Step 6: Keep using the same imports

Your code keeps importing from `"react-grid-layout"`; resolution now goes to `vendor/react-grid-layout`:

- `import { Responsive } from "react-grid-layout";`
- `import "react-grid-layout/css/styles.css";`

No changes are needed in `WeekView.tsx` or anywhere else.

---

## Step 7: Commit the vendor folder

Add and commit the vendored package so it lives in your repo:

```bash
git add vendor/react-grid-layout
git commit -m "Vendor react-grid-layout"
```

---

## Optional: Updating the vendored version later

When you want to upgrade:

1. Temporarily install the desired version from npm:
   ```bash
   pnpm add react-grid-layout@2.3.0
   ```
2. Copy again from `node_modules`:
   ```bash
   cp -R node_modules/react-grid-layout/dist vendor/react-grid-layout/
   cp -R node_modules/react-grid-layout/css vendor/react-grid-layout/
   ```
3. Update `version` in `vendor/react-grid-layout/package.json` to match.
4. Remove the temporary npm install:
   ```bash
   pnpm remove react-grid-layout
   ```
5. Restore the file dependency in root `package.json`:
   ```json
   "react-grid-layout": "file:./vendor/react-grid-layout"
   ```
6. Run `pnpm install` again.

---

## Summary

| Step | Action |
|------|--------|
| 1 | `mkdir -p vendor/react-grid-layout` |
| 2 | Copy `node_modules/react-grid-layout/dist` and `css` into `vendor/react-grid-layout/` |
| 3 | Create `vendor/react-grid-layout/package.json` with main, module, types, sideEffects |
| 4 | In root package.json: replace `"react-grid-layout": "^2.2.2"` with `"react-grid-layout": "file:./vendor/react-grid-layout"` |
| 5 | Run `pnpm install` |
| 6 | No code changes; imports stay the same |
| 7 | Commit `vendor/react-grid-layout` |

After this, the library lives inside your project and you can patch it or lock the version without relying on the npm package.

---

# @dnd-kit/core

## Step 1: Create the vendor folder (scoped package)

```bash
mkdir -p vendor/@dnd-kit/core
```

## Step 2: Copy the built files

```bash
cp -R node_modules/@dnd-kit/core/dist vendor/@dnd-kit/core/
```

## Step 3: Add package.json in the vendor package

Create `vendor/@dnd-kit/core/package.json`:

```json
{
  "name": "@dnd-kit/core",
  "version": "6.3.1",
  "private": true,
  "main": "dist/index.js",
  "module": "dist/core.esm.js",
  "typings": "dist/index.d.ts",
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  },
  "dependencies": {
    "@dnd-kit/accessibility": "^3.1.1",
    "@dnd-kit/utilities": "^3.2.2",
    "tslib": "^2.0.0"
  }
}
```

(The built dist still requires `@dnd-kit/utilities` and `@dnd-kit/accessibility` at runtime; listing them here keeps them installed when using the vendored core.)

## Step 4: Point your project to the vendor copy

In root `package.json`:

```json
"@dnd-kit/core": "file:./vendor/@dnd-kit/core"
```

## Step 5: Reinstall

```bash
pnpm install --no-frozen-lockfile
```

Imports stay the same: `import { DndContext, type DragEndEvent } from "@dnd-kit/core";`
