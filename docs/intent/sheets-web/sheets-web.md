# Sheets Web Sub-HLD

## Responsibility
Define the user-facing web experience for discovering and reading source sheets, organized as URL-routed views.

## Components
- View Shell: routing, view composition, cross-view state retention, and randomized selection. Owns browser history and the shared state that survives navigation between views.
- Catalog and Search: indexing metadata and interactive filtering. Produces the filtered list consumed by the Discovery view and by randomized selection.
- Reader UI: rendering a selected sheet with bilingual-friendly typography and a compact reading-mode header.
- Static Data Model: JSON catalog plus Markdown/HTML sheet files.

## Data Flow
1. The View Shell loads the catalog from static JSON and holds it for the lifetime of the session.
2. The router maps the current URL to a view: `/` renders the Discovery view; `/s/:id` renders the Reader view for the sheet identified by the URL.
3. In the Discovery view the user enters a query or selects filters; matching sheets are shown with metadata. Filter state lives in the shell so it survives navigation.
4. Selecting a sheet (by card, by randomized pick, or by shared link) navigates to `/s/:id`, which the Reader view renders.
5. Returning from the Reader view restores the retained Discovery state (filters and scroll position).

## Constraints
- Client-side only runtime.
- Works when deployed as static assets, with SPA-fallback configured so deep links resolve to the application shell.
- Supports both Markdown and HTML sheet source formats.

## Decisions and Alternatives
| Decision | Status | Rationale |
|---|---|---|
| Use static JSON catalog for metadata | Accepted | Keeps deployment simple and search fast for initial scale |
| Client-side parsing/rendering | Accepted | No backend required for MVP |
| Add backend search service | Rejected for now | Premature for initial dataset size |
| URL-routed views via react-router-dom (BrowserRouter) | Accepted | Shareable per-sheet links, native history, scales to additional views; requires host SPA-fallback (see HLD) |
| Single two-pane layout | Rejected | Discovery and reading are separate modes; see HLD |