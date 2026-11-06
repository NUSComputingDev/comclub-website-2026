# Implementation plan: event card tabs

## Status and context

Planning complete; implementation not started. Branch at planning: `main`. The user approved `docs/event-tabs/` instead of initializing Spec Kit. `.specify/`, setup scripts, templates, constitution, and extension hooks are absent; the skill workflow is adapted to this repository's existing documentation approach.

React 18, TypeScript, Vite 5, Tailwind 3, date-fns 3, and the installed Base UI Tabs wrapper provide everything needed. Use `src/components/ui/tabs.tsx` with `TabsList variant='line'`. The wrapper and its package changes currently exist as uncommitted work from the preceding installation; preserve unrelated changes when committing them.

## Scope map

- `src/pages/events/index.tsx`: sole integration point; add controlled active-tab state, separate right-pane results, and synchronize both existing selection-clearing paths.
- `src/pages/events/eventFilters.ts`: small pure filtering module with explicit local-day boundaries and a supplied current date, shared by all card filters. Move the existing day-coverage helper here if needed rather than duplicate it.
- `src/pages/events/index.css`: scoped tab spacing/overflow only if necessary; retain pane visibility, masonry rules, and card gaps.
- `src/pages/events/Calendar.tsx`: existing callback contract is sufficient; no internal changes expected.
- `src/pages/events/zod.ts`, `articles.json`, `CompactEventList.tsx`, and `3DCard.tsx`: reuse existing model/data/renderers; no schema or content changes expected.
- `scripts/check-event-tabs.mjs`: small assert-based check using the existing build tooling to load the TypeScript helper; no test framework dependency.
- `src/components/ui/tabs.tsx`, `package.json`, `package-lock.json`: verify and separately commit only the prior Tabs installation changes required by this feature.

## Design

Keep stable tab values `all`, `past`, `upcoming`, and `date`; the displayed date label is not an identifier. Keep `selectedDay` independent of `activeTab`. Derive the left list from selectedDay as today; derive right cards from activeTab and the full sorted collection. Never intersect All/Past/Upcoming with the calendar selection.

Use one selection handler for choosing or clearing a date. Choosing a date activates date; clearing falls back to All only from date. Route outside-click and compact-background clearing through this handler, retaining listener cleanup and the shared layout boundary. Use functional state updates where necessary to avoid a stale active-tab value in the document listener.

Use the existing Tabs primitives with a properly associated TabsContent for each trigger. Reuse the existing card markup through a small local render function if needed to avoid four copies; do not introduce a general card-list abstraction. Keep ordinary empty-state rendering inside the panels.

Past uses end-of-event day < start-of-today; Upcoming uses end-of-event day >= start-of-today. This includes ongoing events. Date matches use the existing inclusive start/end day coverage. Missing dates are excluded outside All. Do not mutate the source array. Compute the boundary on render; no timer or new date library.

At narrow desktop widths, allow the tab row to scroll horizontally without widening the pane; retain visible focus and underline space. The right pane remains hidden on mobile.

## Gates and validation

No repository constitution exists. Pre-design and post-design checks pass: user-confirmed semantics, existing primitives reused, no dependency additions, no schema changes, no unrelated edits, accessibility preserved. No unresolved clarification remains.

New filter branches require the small assert-based check specified in tasks.md. Validate fixed-date boundaries, inclusive ranges, undated records, unchanged ordering, and timezone-sensitive cases. Run component/file lint, TypeScript, production build, and interactive scenarios in quickstart.md; record existing failures separately.

## Delivery and commits

1. `docs(events): plan event card tabs` — these design documents.
2. `docs(events): add event tab implementation tasks` — tasks.md.
3. `feat(components): add line-style tabs` — only prior Tabs installation files/hunks, after verification.
4. `feat(events): filter event cards by date` — pure filter helper and its check.
5. `feat(events): add event card filter tabs` — accessible integration, calendar transitions, necessary CSS, and recorded validation.

Keep implementation tasks unchecked until implemented and verified. Stage exact files/hunks; do not include existing unrelated changes or the root tasks.md deletion.
