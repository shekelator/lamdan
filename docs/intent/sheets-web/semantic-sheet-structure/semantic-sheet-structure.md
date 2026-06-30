# Semantic Sheet Structure (LLD)

## Parent Node
[Sheets Web Sub-HLD](../sheets-web.md)

## Responsibility
Define a consistent semantic HTML structure for source sheets that ensures visual consistency across the library and enables reliable import of new sheets from external sources (Google Docs, Sefaria, etc.).

## Motivation
Source sheets arrive from varied authoring tools (Google Docs, Sefaria exports, Markdown authors) with inconsistent markup:
- Google Docs exports inline styles and opaque class names (`.c0`, `.c1`, `.lst-kix_*`)
- Hand-authored Markdown lacks semantic structure for discussion elements
- No standard way to identify introductions, sources, quotes, or discussion questions

This LLD defines semantic classes that:
1. Strip away source-specific styling noise
2. Provide consistent visual presentation across all sheets
3. Make the import/cleanup process repeatable and auditable
4. Enable future enhancements (e.g., structured exports, print layouts)

## Structural Elements

### Root Wrapper
| Class | Element | Purpose |
|---|---|---|
| `.havruta-sheet` | `<article>` | Root wrapper for a complete sheet |

### Header Section
| Class | Element | Purpose |
|---|---|---|
| `.sheet-header` | `<header>` | Contains title and author metadata |
| `.sheet-title` | `<h1>` | Main sheet title |
| `.sheet-author` | `<p>` | Author byline |

### Introduction
| Class | Element | Purpose |
|---|---|---|
| `.introduction` | `<section>` | Opening explanatory text that frames the sheet's topic |

### Source Sections
| Class | Element | Purpose |
|---|---|---|
| `.source` | `<section>` | A complete source unit (header + text + questions) |
| `.source-header` | `<h2>` | Source title/citation (e.g., "Pirkei Avot 3:14") |
| `.source-text` | `<div>` | The source content itself |
| `.source-quote` | `<blockquote>` | A blockquoted excerpt within a source |
| `.hebrew-text` | `<p>` | Hebrew/Aramaic text blocks (styled RTL) |

### Discussion Questions
| Class | Element | Purpose |
|---|---|---|
| `.question-block` | `<div>` | A "Read and Discuss" section with related questions |
| `.question-block-title` | `<h3>` | The discussion section heading |
| `.question` | `<p>` | An individual discussion question |

## HTML Cleanup Pipeline

When HTML sheets are loaded, the `renderSheet.ts` module applies cleanup transformations:

1. **Remove `<head>` section** — Strips Google Docs CSS
2. **Remove `class` attributes** — Eliminates opaque source classes
3. **Remove `style` attributes** — Eliminates inline styles
4. **Remove empty `<p>` tags** — Cleans up artifacts

This ensures the semantic classes defined above are the *only* styling hooks present.

## Visual Design Principles

1. **Consistency** — All sheets use the same typography, spacing, and color palette
2. **Clarity** — Distinct visual treatment for different element types (sources vs. questions)
3. **Bilingual support** — Hebrew text has dedicated RTL styling
4. **Responsive** — Layout works across mobile and desktop viewports
5. **Artistic learning aesthetic** — Warm, inviting tones that reflect the Lamdan brand

## Data Flow

1. User selects a sheet from the catalog
2. App fetches the raw HTML/Markdown file
3. `renderSheet.ts` applies cleanup transformations (HTML only)
4. Sanitized HTML is rendered with semantic CSS classes
5. Styles from `index.css` provide consistent presentation

## Constraints

- Cleanup must preserve all *content* — only markup changes
- Semantic classes must be self-documenting (no opaque abbreviations)
- Styles must inherit from the site's design tokens (CSS variables)

## Decisions and Alternatives

| Decision | Status | Rationale |
|---|---|---|
| Semantic classes over source-specific markup | Accepted | Enables consistent styling regardless of origin |
| Cleanup pipeline in renderSheet.ts | Accepted | Centralizes transformation logic; keeps source files intact |
| Blockquote element for source quotes | Accepted | Native HTML semantics; accessible by default |
| Dedicated `.hebrew-text` class | Accepted | Explicit RTL + visual distinction for Hebrew sources |
| Question blocks as distinct visual units | Accepted | Makes discussion sections scannable and printable |
