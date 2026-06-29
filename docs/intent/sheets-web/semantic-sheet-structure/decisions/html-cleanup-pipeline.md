# HTML Cleanup Pipeline

## Status
Accepted

## Context
Source sheets arrive from external authoring tools (Google Docs, Sefaria exports) with markup that is unsuitable for consistent presentation:

- Google Docs exports hundreds of lines of opaque CSS classes (`.c0`, `.c1`, `.lst-kix_*`)
- Inline styles override site design tokens
- Empty paragraph tags create visual noise
- No semantic structure for discussion elements

## Decision
Apply a cleanup pipeline in `renderSheet.ts` that:

1. Removes the entire `<head>` section (strips source CSS)
2. Removes all `class` attributes from elements
3. Removes all `style` attributes from elements
4. Removes empty `<p>` tags

The cleaned HTML is then rendered with semantic classes applied by the author during import.

## Alternatives Considered

### Preserve source markup, override with CSS specificity
**Rejected** — Source-specific classes would still be present in the DOM, creating maintenance burden and potential conflicts.

### Require authors to manually clean HTML before import
**Rejected** — Too error-prone and time-consuming; authors would skip cleanup steps inconsistently.

### Build a Google Docs → semantic HTML converter
**Rejected** — Premature optimization; the cleanup pipeline handles current needs with less complexity.

## Consequences

### Positive
- All sheets render with consistent styling regardless of origin
- Import process is repeatable and auditable
- Source files remain untouched; cleanup is runtime-only
- Easy to extend with additional transformations

### Negative
- Authors must manually add semantic classes when preparing sheets
- No automatic detection of sheet structure (yet)

## Related
- [Semantic Sheet Structure LLD](../semantic-sheet-structure.md)
- [SHEETS-SS-001](../semantic-sheet-structure-specs.md)
