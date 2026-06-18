# High Level Design

## Product Goal
Build a client-side web application that presents study source sheets stored as Markdown or HTML files, with fast discovery by topic and tags, and a responsive reading experience across desktop and mobile devices.

## Scope
- In scope: static hosting compatibility, client-side search/filter, bilingual presentation (English/Hebrew), responsive layout, local content catalog.
- Out of scope (initial): authentication, authoring workflow, server-side indexing, collaborative editing.

## Primary Users
- Learners looking for a source sheet by topic or tag.
- Teachers preparing sessions across devices.

## Success Criteria
- Users can find sheets by topic/tag in under a few interactions.
- Sheets render cleanly on mobile and desktop.
- Hebrew and English text are readable and directionally correct.
- Build output is static-host deployable (for CloudFront or equivalent).

## Architecture Overview
- Static React app loads a JSON catalog and sheet files from static assets.
- Search and filtering run entirely in the browser.
- Sheet renderer supports Markdown and HTML content.
- Requirement traceability maintained through EARS IDs and @spec annotations in code/tests.
