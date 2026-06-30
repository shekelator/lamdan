# Reader UI LLD

## Responsibility
Render a selected source sheet with clear, responsive typography, bilingual usability, and a compact reading-mode header.

## Inputs
- Selected sheet id, provided by the View Shell from the URL.
- Selected sheet metadata and file contents.
- Viewport size.

## Processing
- Receive the selected sheet id from the View Shell; the View Shell owns loading the catalog and resolving the id to metadata.
- Fetch the selected sheet content file from static assets.
- Parse Markdown to HTML when format is markdown.
- Render trusted static HTML with consistent visual styles.
- Apply direction and typography cues for Hebrew/English readability.
- Render within a compact header bar showing the sheet title and a Back affordance to Discovery; no discovery controls appear in this view.

## Outputs
- Readable sheet view with a compact header and a return path to Discovery.

## Decisions and Alternatives
| Decision | Status | Rationale |
|---|---|---|
| Parse Markdown client-side | Accepted | Keep authoring format flexible without build-time preprocessing |
| Responsive single-column reading view | Accepted | Reader is a dedicated view, responsive across desktop and mobile |
| Compact reader header (title + Back, minimal controls) | Accepted | Reading is a focused mode; chrome minimized per intent |
| Instructional placeholder when no sheet is selected | Rejected (retire) | Discovery is now the no-selection state; there is no reader pane to hold a placeholder |