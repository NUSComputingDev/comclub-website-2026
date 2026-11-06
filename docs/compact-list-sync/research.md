# Research decisions

## Single source of truth

Decision: render the left compact list from the same `cardsByTab[activeTab]` record that feeds the right cards.
Rationale: one derivation for both panes makes them agree by construction and removes the selectedDay-only `compactEvents` path; `filterEventCards` already implements every needed branch, including inclusive date matching.
Alternatives considered: a second `filterEventCards` call for the left list (duplicated derivation, risk of divergence); intersecting the active tab with the selected day for the left list (rejected: the user's example makes the active tab win).

## Heading sync

Decision: derive the left heading from the active tab (`All Events`, `Past Events`, `Upcoming Events`, `Events on MMM dd, yyyy`).
Rationale: keeping the old selectedDay-only heading would show `Events on …` or `All Events` above a filtered list, contradicting its contents.
Alternatives considered: leaving the heading unchanged (misleading); adding a filter description line (extra UI not requested).

## No new state or checks

Decision: no new component state, no new filter branch, no new test-framework dependency; rerun `scripts/check-event-tabs.mjs` as regression.
Rationale: the filter module is unchanged; the risk is integration-only, covered by the quickstart scenarios.
Alternatives considered: a component-level test harness (unnecessary for a derivation swap).

Read-only research reviewed `src/pages/events/index.tsx`, `eventFilters.ts`, `src/components/CompactEventList.tsx`, `src/pages/events/Calendar.tsx`, `index.css`, `articles.json`, and `docs/event-tabs/`. Data at planning time: 10 events, 9 past, 0 upcoming, 1 undated (2026-11-07), so Upcoming shows `No events found.` in both panes and future-date behavior must be verified through the fixed-date assertions rather than live data.
