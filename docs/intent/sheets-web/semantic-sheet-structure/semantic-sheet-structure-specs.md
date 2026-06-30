# Semantic Sheet Structure Specs (EARS)

- [ ] SHEETS-SS-001: When an HTML sheet is loaded, the system shall remove all Google Docs-style inline classes and styles before rendering.
- [ ] SHEETS-SS-002: When a sheet is rendered, the system shall apply semantic class names to structural elements (header, introduction, source, question-block).
- [ ] SHEETS-SS-003: When a source contains a blockquoted excerpt, the system shall render it with the `.source-quote` class for distinct visual treatment.
- [ ] SHEETS-SS-004: When a source contains Hebrew or Aramaic text, the system shall render it with the `.hebrew-text` class with RTL directionality.
- [ ] SHEETS-SS-005: When a source contains discussion questions, the system shall group them within a `.question-block` container with a distinct title.
- [ ] SHEETS-SS-006: When a sheet is rendered, all semantic elements shall inherit typography and color values from the site's design tokens (CSS variables).
- [ ] SHEETS-SS-007: When a new sheet is imported from Google Docs or similar sources, the cleanup pipeline shall preserve all content text while removing source-specific markup.
