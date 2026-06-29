# Spec Test Matrix

## Automated

- SHEETS-CAT-001 -> apps/sheets-web/src/lib/filterSheets.test.ts
- SHEETS-CAT-002 -> apps/sheets-web/src/lib/filterSheets.test.ts
- SHEETS-CAT-003 -> apps/sheets-web/src/lib/filterSheets.test.ts
- SHEETS-CAT-004 -> apps/sheets-web/src/lib/filterSheets.test.ts
- SHEETS-READ-001 -> apps/sheets-web/src/App.test.tsx
- SHEETS-READ-002 -> apps/sheets-web/src/lib/renderSheet.test.ts
- SHEETS-READ-003 -> apps/sheets-web/src/lib/renderSheet.test.ts
- SHEETS-READ-005 -> apps/sheets-web/src/App.test.tsx
- SHEETS-WEB-001 -> apps/sheets-web/src/App.test.tsx
- SHEETS-WEB-003 -> apps/sheets-web/src/App.test.tsx
- SHEETS-WEB-004 -> apps/sheets-web/src/lib/renderSheet.test.ts
- SHEETS-VS-001 -> apps/sheets-web/src/App.test.tsx
- SHEETS-VS-002 -> apps/sheets-web/src/App.test.tsx
- SHEETS-VS-003 -> apps/sheets-web/src/App.test.tsx
- SHEETS-VS-004 -> apps/sheets-web/src/App.test.tsx
- SHEETS-VS-005 -> apps/sheets-web/src/App.test.tsx
- SHEETS-VS-006 -> apps/sheets-web/src/lib/pickRandom.test.ts, apps/sheets-web/src/App.test.tsx
- SHEETS-VS-007 -> apps/sheets-web/src/App.test.tsx
- SHEETS-VS-009 -> apps/sheets-web/src/App.test.tsx
- SHEETS-SS-001 -> apps/sheets-web/src/lib/renderSheet.test.ts
- SHEETS-SS-002 -> apps/sheets-web/src/lib/renderSheet.test.ts
- SHEETS-SS-003 -> apps/sheets-web/src/lib/renderSheet.test.ts
- SHEETS-SS-004 -> Verified via CSS `.hebrew-text { direction: rtl; unicode-bidi: isolate; }`
- SHEETS-SS-005 -> apps/sheets-web/src/lib/renderSheet.test.ts
- SHEETS-SS-006 -> apps/sheets-web/src/lib/renderSheet.test.ts
- SHEETS-SS-007 -> apps/sheets-web/src/lib/renderSheet.test.ts

## Manual

- SHEETS-WEB-002: Verified via responsive layout with no horizontal overflow at <= 900px on both Discovery and Reader views.
- SHEETS-VS-008: Verified via browser refresh and back/forward navigation on a deep-linked `/s/:id` URL (page refresh cannot be exercised in jsdom).