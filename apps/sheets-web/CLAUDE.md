# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands
- **Dev Server**: `npm run dev`
- **Production Build**: `npm run build`
- **Linting**: `npm run lint`
- **Interactive Tests**: `npm run test`
- **Single Test Run**: `npm run test:run`

## Architecture & Structure
The `sheets-web` application is a React-based library for viewing "source sheets" (educational content) provided in Markdown or HTML formats.

### High-Level Flow
1. **Catalog Loading**: The app fetches a static JSON catalog (`/data/sheets/catalog.json`) containing summaries and metadata for all available sheets.
2. **Filtering**: Users can filter the catalog by search query, topic, or tag using `src/lib/filterSheets.ts`.
3. **Rendering**: When a sheet is selected, the app fetches the raw file and processes it via `src/lib/renderSheet.ts`:
   - **Markdown**: Parsed using `marked`.
   - **HTML**: Passed through directly.
   - **Sanitization**: All output HTML is sanitized using `dompurify`.
   - **Directionality**: The app automatically detects RTL (Right-to-Left) vs LTR (Left-to-Right) based on Hebrew character detection or specified preferences.

### Key Directory Structure
- `src/App.tsx`: Primary application logic, state management for the catalog and selected sheets.
- `src/lib/`: Core business logic (filtering and rendering).
- `src/types.ts`: Shared TypeScript interfaces for `SheetSummary` and `RenderedSheet`.
- `public/data/sheets/`: (Referenced via `/data/sheets/`) Storage for the catalog JSON and content files.

## Design Patterns
- **Static Data-Driven**: The app relies on a static manifest (`catalog.json`) rather than a backend API.
- **Pure Logic Separation**: Filtering and rendering logic are decoupled from React components in `src/lib/` and thoroughly tested with Vitest.
- **Directional Awareness**: Explicit handling of `dir="rtl"` and `dir="ltr"` for bilingual support.
