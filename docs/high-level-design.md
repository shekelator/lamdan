# High Level Design

## Product Goal
Build a client-side web application that presents study source sheets stored as Markdown or HTML files, with fast discovery by topic and tags, a responsive reading experience across desktop and mobile devices, and shareable links that open an individual sheet directly.

## Scope
- In scope: static hosting compatibility, client-side search/filter, bilingual presentation (English/Hebrew), responsive layout, local content catalog, URL-routed views with shareable per-sheet links, randomized sheet selection, preservation of discovery state across navigation, consistent sheet presentation via semantic HTML structure.
- Out of scope (initial): authentication, authoring workflow, server-side indexing, collaborative editing.

## Primary Users
- Learners looking for a source sheet by topic or tag, or arriving via a shared sheet link.
- Teachers preparing sessions across devices and sharing sheets with students by link.

## Success Criteria
- Users can find sheets by topic/tag in under a few interactions.
- Users can share individual source sheets with a stable link that points directly to the sheet, opening the reader on any device and after refresh.
- Sheets render cleanly on mobile and desktop.
- Hebrew and English text are readable and directionally correct.
- Discovery state (search query, topic filter, tag filter, scroll position) is restored when a user navigates from the reader back to discovery.
- Build output is static-host deployable (for CloudFront or equivalent), with SPA-fallback configured so deep links resolve to the application shell.

## Tenets
- Discovery and reading are separate modes, not a simultaneous workspace. The discovery view omits reading chrome; the reader view omits discovery controls.
- Reach for a library when hand-rolling would repeat work or risk correctness. Standard concerns (routing, browser history, deep links) are served by a router, not bespoke wiring.
- Route count is expected to grow over time; the shell and router scale to additional views without restructuring.
- Sheet consistency is a core value: all sheets render with uniform typography, spacing, and visual treatment regardless of origin.

## Architecture Overview
- Static React app loads a JSON catalog and sheet files from static assets.
- Search and filtering run entirely in the browser.
- Sheet renderer supports Markdown and HTML content.
- The application is organized into URL-routed views. A Discovery view presents the catalog, search, topic/tag filters, and a randomized selection control; a Reader view presents a single selected sheet. A client-side router (react-router-dom) maps URLs to views and owns browser history, so per-sheet links are shareable, deep-linkable, and survive refresh and the browser back/forward controls. The selected sheet is represented by the URL rather than ephemeral component state.
- A shared application shell lifts cross-view state above the views. Discovery filters and scroll position live in the shell, so navigating from the reader back to discovery restores the user's prior state. The views are otherwise presentational and independently tunable.
- Additional views can be added as routes without restructuring the shell.
- Requirement traceability maintained through EARS IDs and @spec annotations in code/tests.

## Decisions and Alternatives
| Decision | Status | Rationale |
|---|---|---|
| Use static JSON catalog for metadata | Accepted | Keeps deployment simple and search fast for initial scale |
| Client-side parsing/rendering | Accepted | No backend required for MVP |
| Add backend search service | Rejected for now | Premature for initial dataset size |
| Two separate URL-routed views (Discovery + Reader) | Accepted | Lets each view be tuned independently and makes per-sheet links shareable; replaces the prior two-pane layout |
| Single two-pane layout (discovery and reader shown simultaneously) | Rejected | Discovery and reading are separate modes; coupling their layout prevented independent tuning and shareable per-sheet links |
| In-app view state without a router (Option A) | Rejected | Cannot satisfy stable shareable per-sheet links without reinventing URL routing ad hoc |
| Hand-rolled hash routing without a dependency (Option B) | Rejected | Satisfies sharing but anticipates additional views and standard routing concerns (history, deep links); a router serves these more robustly than bespoke hash wiring |
| react-router-dom with BrowserRouter (Option C) | Accepted | Robust, standard routing with clean shareable URLs and native browser history; scales to additional views without restructuring. Requires SPA-fallback on the static host so deep links resolve |
| react-router HashRouter | Rejected (fallback) | Avoids host SPA-fallback config but yields hash-prefixed URLs and duplicates router capability BrowserRouter already provides; revert to this only if host-side fallback proves infeasible |