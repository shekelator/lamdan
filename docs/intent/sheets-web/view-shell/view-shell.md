# View Shell LLD

## Responsibility
Own routing, view composition, cross-view state retention, and randomized sheet selection across the Discovery and Reader views.

## Inputs
- Catalog: the full list of `SheetSummary` entries, loaded once by the shell.
- URL location: `/` (Discovery) or `/s/:id` (Reader); any other path resolves to Discovery.
- Discovery filter state: query, topic, tag — owned by the shell and retained across navigation.
- Discovery scroll position — owned by the shell and retained across navigation.

## Processing
- Render the active view inside a shared shell. `/` renders the Discovery view; `/s/:id` renders the Reader view for the sheet identified by `:id`.
- The router owns browser history; back/forward and refresh preserve the current view and selected sheet.
- Resolve `/s/:id` against the catalog. While the catalog loads, show a loading state; once loaded, if the id is unknown, redirect to `/` and present a transient not-found status.
- Lift Discovery filter state and scroll position into the shell so navigating from the Reader back to Discovery restores them. Capture scroll position when leaving Discovery; restore it (clamped to the current list bounds) after the filtered list has rendered with the restored filters. When no prior discovery state exists (for example a user who arrived via a deep link), Discovery renders with default filters (empty query, 'all' topic, 'all' tag) and zero scroll.
- Randomized selection ("Just pick one"): choose a sheet uniformly at random from the currently filtered list and navigate to `/s/:id`. When the filtered list is empty the control is disabled; when it contains exactly one, that sheet is chosen. Selection is uniformly random with no repeat-avoidance: consecutive picks may select the same sheet.

## Outputs
- The active view rendered inside the shared shell.
- A stable, shareable URL representing the active view and (for Reader) the selected sheet.
- Restored Discovery state on return navigation.

## Decisions and Alternatives
| Decision | Status | Rationale |
|---|---|---|
| react-router-dom with BrowserRouter | Accepted | Clean shareable URLs, native history, scales to additional views. Requires host SPA-fallback (see HLD) |
| HashRouter | Rejected (fallback) | Avoids host config but yields hash URLs; revert only if SPA-fallback proves infeasible |
| Lift filter and scroll state into the shell | Accepted | Unmounting the Discovery view on navigation would lose its state; lifting preserves it across the view switch |
| Random selection draws from the filtered list | Accepted | A random pick honors the user's active discovery context, not the whole catalog |
| View Shell owns randomized selection | Accepted | Selection is a navigation trigger that consumes Catalog-and-Search output; its substance (navigation) lives here, with a cascade note to Catalog-and-Search |
| No repeat-avoidance for consecutive random picks | Accepted | Picks are uniformly random; avoiding the immediately-prior sheet is not worth the added state and non-uniform bias |

## Resolved Questions
- Unknown `/s/:id`: redirect to `/` with a transient not-found status (chosen over a dedicated not-found route).
- Consecutive "Just pick one" picks: uniformly random, no repeat-avoidance.
- Deep-link entry with no prior discovery state: Discovery renders with default filters (empty query, 'all' topic, 'all' tag) and zero scroll.
- Back-navigation scope: the in-app Back affordance deterministically navigates to `/`; browser back/forward follows real history and may exit the app for a deep-linked entry (per SHEETS-VS-008).
- Scroll restoration ordering: restore scroll after the filtered list has rendered with the restored filters, not in the same render tick.