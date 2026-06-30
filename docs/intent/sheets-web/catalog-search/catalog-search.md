# Catalog and Search LLD

## Responsibility
Provide client-side discovery of source sheets by free-text query, topics, and tags.

## Inputs
- Catalog JSON entries with fields: id, title, summary, topics[], tags[], languageSupport, filePath, format.
- User query string.
- Optional selected topic and selected tag filters.

## Processing
- Normalize text to lowercase for query matching.
- Match query against title, summary, topics, and tags.
- Apply topic and tag filters as logical AND with query results.
- Sort by title for deterministic presentation.

## Outputs
- Filtered list of sheet summaries suitable for card/list rendering.

## Decisions and Alternatives
| Decision | Status | Rationale |
|---|---|---|
| Single in-memory filter pass | Accepted | Simpler than introducing indexing for MVP scale |
| Topic/tag from finite sets in catalog | Accepted | Enables precise filtering controls |

## Cross-segment Notes
- Randomized selection (View Shell) consumes this segment's filtered list output. The `filteredSheets` contract is shared: its membership must remain stable for consumers that depend on it.
