# Reader UI LLD

## Responsibility
Render selected source sheets with clear, responsive typography and bilingual usability.

## Inputs
- Selected sheet metadata and file contents.
- Viewport size.

## Processing
- Fetch selected sheet content file from static assets.
- Parse Markdown to HTML when format is markdown.
- Render trusted static HTML with consistent visual styles.
- Apply direction and typography cues for Hebrew/English readability.

## Outputs
- Readable sheet view with metadata context.

## Decisions and Alternatives
| Decision | Status | Rationale |
|---|---|---|
| Parse Markdown client-side | Accepted | Keep authoring format flexible without build-time preprocessing |
| Responsive split-to-stack layout | Accepted | Preserves usability across desktop and mobile |
