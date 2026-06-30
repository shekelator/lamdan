# AGENTS.md

Project instructions for coding agents working in this repository. The file is named `AGENTS.md` per the emerging cross-tool convention; tools that look for other filenames (e.g. Claude Code's `CLAUDE.md`) find the same content via symlink — `CLAUDE.md` is a symlink to this file.

## Repository

Lamdan is a static, client-side **source-sheet web app** (Vite + React 19 + TypeScript) for browsing and reading Markdown/HTML learning sheets with topic/tag search and bilingual (English/Hebrew, RTL/LTR) support. The only application lives in `apps/sheets-web/`. `docs/` holds the Linked-Intent Development (LID) design tree. The build output is static-host deployable (CloudFront or equivalent).

> App-specific commands, module flow, and directory detail live in **`apps/sheets-web/CLAUDE.md`** — read it before working in the app. This file covers repo-level conventions, architecture, and the LID workflow.

## Commands

All commands run from the repo root against the app in `apps/sheets-web` (mirrors `README.md`):

```bash
npm install --prefix apps/sheets-web
npm run dev      --prefix apps/sheets-web      # Vite dev server
npm run build    --prefix apps/sheets-web      # tsc -b && vite build (static-host deployable)
npm run preview  --prefix apps/sheets-web      # preview the production build
npm run lint     --prefix apps/sheets-web      # eslint .
npm run test     --prefix apps/sheets-web      # vitest watch
npm run test:run --prefix apps/sheets-web      # vitest run (single pass)
```

Run a single test file or test name:

```bash
npm run test:run --prefix apps/sheets-web -- src/lib/filterSheets.test.ts
npm run test:run --prefix apps/sheets-web -- -t "filters by topic"
```

Tests use Vitest with jsdom (`vite.config.ts` → `test.environment: 'jsdom'`, globals on, setup in `src/test/setup.ts`).

## Architecture

Static, backend-less data flow, all in the browser:

1. **Catalog load** — `App.tsx` fetches `/data/sheets/catalog.json` (a static JSON array of `SheetSummary` entries; see `src/types.ts`). Each entry points to a content file under `public/data/sheets/`.
2. **Filter** — `src/lib/filterSheets.ts` narrows the catalog by query/topic/tag. Pure logic, fully unit-tested.
3. **Render** — selecting a sheet fetches its raw file and `src/lib/renderSheet.ts` processes it: Markdown via `marked`, HTML passed through, then **all output sanitized with `dompurify`**. Direction (`ltr`/`rtl`) is auto-detected from Hebrew content or the sheet's `preferredDirection`.

Two-pane layout (catalog + reader) on desktop (>900px), stacked on mobile — driven by CSS, verified manually (specs `SHEETS-WEB-002/003`). Filtering and rendering logic is deliberately decoupled from React components in `src/lib/` so it can be tested without the DOM where possible.

## Linked-Intent Development (MANDATORY)

**Consult the `linked-intent-dev` skill (Claude Code) or follow the workflow below (other tools) for ALL code changes.** All changes start with intent:

```
HLD → LLDs → EARS → Tests → Code
```

- **New features**: Full workflow (HLD → LLD → EARS → Tests → Code)
- **Bug fixes**: Walk the arrow like any other change — find where intent diverged, cascade from there. No short-circuit.
- **If unsure**: Use the full workflow.

**Docs carry current intent, written to be read cold.** Write each doc as if authored fresh today, from current intent alone — no narration of how it changed, no meaning that needs the conversation that produced it, no rebuttals to questions only a past discussion raised. Rationale, considered alternatives, and constraints a fresh author would independently write stay; record rejected alternatives and why in the LLD's Decisions & Alternatives table, not as asides in body prose.

**Memory vs. intent.** Before saving durable project knowledge to agent or tool memory, test whether it is project *intent* — would a fresh agent, in any tool, next session, need it to build this system correctly? If yes, record it in the arrow (HLD / LLD / EARS / decision doc), which travels and cascades — not in private, per-tool memory, where intent escapes the arrow. Knowledge about the user or how they like to work stays in memory.

### Navigation

| What you need | Where to look |
|---|---|
| High-level design | `docs/high-level-design.md` |
| Design tree (HLD's children: sub-HLDs, LLDs, their specs) | `docs/intent/` — one folder per node |
| EARS specs | `{node}-specs.md` beside each design doc in `docs/intent/` |
| Spec-to-test traceability | `docs/intent/sheets-web/spec-test-matrix.md` |
| Decision docs | `docs/decisions/` (project-level) and `docs/intent/<segment>/decisions/` |
| Arrow of intent overlay | `docs/arrows/index.yaml` and per-segment docs in `docs/arrows/` |

The app node is `docs/intent/sheets-web/`, with sub-nodes `catalog-search/` and `reader-ui/`.

### Terminology

- **HLD / LLD / sub-HLD**: the design layer is a recursive tree — the HLD is the root, leaf LLDs own EARS, and a component with internal depth becomes a sub-HLD (HLD-shaped, grouping child LLDs). "HLD" and "LLD" are roles by position; depth-2 (one HLD over flat LLDs) is the default. Design docs live in `docs/intent/`
- **EARS**: Easy Approach to Requirements Syntax — structured requirements living beside each design doc as `{node}-specs.md` in the node's folder under `docs/intent/`, with path-concatenated IDs (root-to-leaf, e.g. `SHEETS-WEB-001`, `SHEETS-CAT-001`, `SHEETS-READ-001`). Markers: `[x]` implemented, `[ ]` active gap, `[D]` deferred
- **Decision doc**: a standalone record of a decision that stays *live* for a cold reader of the landed result (rare), in a node's `decisions/` directory; owns no EARS and carries no status (presence is acceptance)
- **Arrow**: A traced dependency from HLD through code, tracked in `docs/arrows/`

### Code Annotations

Annotate code with `@spec` comments linking to EARS IDs:

```
// @spec SHEETS-WEB-001, SHEETS-READ-002
```

Place the annotation at the entry point of the behavior's implementation graph, not on every helper. Test files reference the same IDs for traceability, and the spec-test-matrix maps each ID to its verifying test.

## LID
- Mode: Full
- Version: 1.3.0