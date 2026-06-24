# View Shell Specs (EARS)

- [x] SHEETS-VS-001: While the application URL is `/`, the system shall render the Discovery view.
- [x] SHEETS-VS-002: While the application URL is `/s/:id` for a sheet id present in the catalog, the system shall render the Reader view for that sheet.
- [x] SHEETS-VS-003: When the application URL is `/s/:id` and the catalog contains no sheet with that id, the system shall redirect to `/` and present a transient not-found status.
- [x] SHEETS-VS-004: While the catalog is loading and the application URL is `/s/:id`, the system shall present a loading state, then render the Reader view once the catalog resolves the sheet.
- [x] SHEETS-VS-005: When a user navigates from the Reader view back to the Discovery view using the in-app Back affordance, the system shall restore the retained discovery filter state (query, topic, tag) and scroll position.
- [x] SHEETS-VS-006: When the user activates the randomized selection control on the Discovery view and the filtered list is non-empty, the system shall select a sheet uniformly at random from the filtered list and navigate to `/s/:id` for that sheet.
- [x] SHEETS-VS-007: While the filtered list is empty, or the catalog is loading, or the catalog has failed to load, the system shall disable the randomized selection control.
- [x] SHEETS-VS-008: While a user views a sheet at `/s/:id`, the system shall preserve that view across page refresh and browser back/forward navigation.
- [x] SHEETS-VS-009: When the Discovery view is rendered and no prior discovery state has been retained, the system shall present default filters (empty query, 'all' topic, 'all' tag) and zero scroll position.