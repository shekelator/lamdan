# Lamdan

Lamdan is a static, client-side source-sheet web app for browsing and reading Markdown and HTML learning sheets with topic and tag search, responsive layout, and Hebrew and English support.

## Project Layout

- docs/: Linked-Intent design and specification docs
- apps/sheets-web/: Vite + React + TypeScript app

## Run Locally

1. Install dependencies:

   npm install --prefix apps/sheets-web

2. Start the dev server:

   npm run dev --prefix apps/sheets-web

3. Open the local URL shown in the terminal.

## Test

Run the test suite:

npm run test:run --prefix apps/sheets-web

Optional watch mode:

npm run test --prefix apps/sheets-web

## Build

Create a production build:

npm run build --prefix apps/sheets-web

Preview the production build locally:

npm run preview --prefix apps/sheets-web

## Linked-Intent Next Steps

Follow the arrow for every change:

HLD -> LLDs -> EARS -> Tests -> Code

Suggested next steps:

1. Review docs/high-level-design.md and docs/intent/sheets-web/ for any scope or behavior changes.
2. Update the relevant LLD and EARS specs before implementation when new features or fixes are needed.
3. Add or update tests mapped to spec IDs and keep traceability current in docs/intent/sheets-web/spec-test-matrix.md.
4. Implement code changes with matching @spec annotations where applicable.
5. Re-run tests and build, then mark specs complete only after verification.