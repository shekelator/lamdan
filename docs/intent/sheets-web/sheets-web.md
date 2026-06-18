# Sheets Web Sub-HLD

## Responsibility
Define the user-facing web experience for discovering and reading source sheets.

## Components
- Catalog and Search: indexing metadata and interactive filtering.
- Reader UI: rendering selected sheet content with bilingual-friendly typography and responsive behavior.
- Static Data Model: JSON catalog plus Markdown/HTML sheet files.

## Data Flow
1. App loads catalog data from static JSON.
2. User enters query or selects filters.
3. Matching sheets are shown with metadata.
4. Selecting a sheet loads and renders its source content.

## Constraints
- Client-side only runtime.
- Works when deployed as static assets.
- Supports both Markdown and HTML sheet source formats.

## Decisions and Alternatives
| Decision | Status | Rationale |
|---|---|---|
| Use static JSON catalog for metadata | Accepted | Keeps deployment simple and search fast for initial scale |
| Client-side parsing/rendering | Accepted | No backend required for MVP |
| Add backend search service | Rejected for now | Premature for initial dataset size |
