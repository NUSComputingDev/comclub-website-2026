# Implementation plan: compact list tab sync

## Status and context

Planning complete; implementation not started. Branch at planning: `main`. `.specify/`, setup scripts, templates, constitution, and extension hooks are absent; the plan follows this repository's established `docs/<feature>/` documentation approach, as used for `docs/event-tabs/`.

React 18, TypeScript, Vite 5, Tailwind 3, and date-fns 3. The preceding event-tabs feature already provides the shared pure filter (`filterEventCards` in `src/pages/events/eventFilters.ts`) and the controlled tab state (`activeTab`, `selectedDay`) in `src/pages/events/index.tsx`. This feature re-derives the left list from the same inputs; no new dependency, schema, or component is introduced.

## Scope map

- `src/pages/events/index.tsx`: sole code change. Replace the selectedDay-only `compactEvents` derivation with the active tab's results and sync the left list heading.
- `src/pages/events/eventFilters.ts`: reused unchanged; no new filter branch.
- `src/components/CompactEventList.tsx`, `src/pages/events/Calendar.tsx`, `src/pages/events/index.css`, `src/pages/events/zod.ts`, `articles.json`: reused unchanged.
- `scripts/check-event-tabs.mjs`: rerun as regression for the shared filter; no new assertions expected.
- `docs/compact-list-sync/`: these planning documents.

## Design

The right pane already computes `cardsByTab: Record<EventTab, Article[]>` from `filterEventCards(articlesData, tab, selectedDay, today)`. Reuse that record as the single source of truth: the left compact list renders `cardsByTab[activeTab]` instead of the selectedDay-only `compactEvents`. Both panes then agree by construction; there is no second filter call, no new state, and no midnight timer.

Derive the left heading from the active tab: `all` → `All Events`, `past` → `Past Events`, `upcoming` → `Upcoming Events`, `date` → `Events on MMM dd, yyyy`. The heading must not keep describing a cleared date while the active tab is Past or Upcoming.

The active tab always wins over the calendar selection for list contents: selecting a day still activates the date tab, and choosing All/Past/Upcoming preserves `selectedDay` (existing behavior) but switches both panes to the chosen filter. Clearing still routes through the single selection handler, so a cleared date falls back from date to All only.

Mobile: the right pane and its tabs are `display:none` below `md`, so `activeTab` cannot change there except through calendar date selection; the left list keeps its current mobile behavior (All, or the selected day).

## Gates and validation

No repository constitution exists. Pre-design and post-design checks pass: user-confirmed sync semantics, existing filter module and tab state reused, no dependency additions, no schema changes, no unrelated edits, accessibility preserved (the heading remains the existing `<h2>`; compact items, links, and tab keyboard behavior are unchanged). No unresolved clarification remains.

Validate with the scenarios in quickstart.md, `scripts/check-event-tabs.mjs` as regression (default TZ, Asia/Singapore, America/Los_Angeles), changed-file lint, `tsc --noEmit`, the production build, and repository lint.

## Coding standards

- Make one commit per coherent change, in the existing `type(scope): short imperative description` format.
- Write short, direct comments for each new or changed logical code block.
- Keep the code readable by human: descriptive names, ordinary control flow, no unnecessary abstractions.

## Delivery and commits

1. `docs(events): plan compact list tab sync` — these design documents.
2. `docs(events): add compact list sync implementation tasks` — tasks.md.
3. `feat(events): sync compact list with card tabs` — the index.tsx change and the recorded validation.

Keep implementation tasks unchecked until implemented and verified. Stage exact files/hunks; do not include existing unrelated changes (root tasks.md deletion, react-grab entries, the `.gitignore` line, untracked tool-config directories).
