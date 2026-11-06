# Tasks: compact list tab sync

Based on spec.md, plan.md, research.md, data-model.md, contracts/ui.md, and quickstart.md in this directory. No `.specify/` installation, hooks, or constitution exist; documentation follows the repo's `docs/<feature>/` approach. Implementation is not started; all tasks remain unchecked.

## Phase 1: Setup

- [ ] T001 Review the working tree and confirm the event-tabs feature is in place: `src/pages/events/eventFilters.ts` exports `filterEventCards` and `EventTab`, `src/pages/events/index.tsx` holds the controlled `activeTab`/`selectedDay` state and `cardsByTab`, and `node scripts/check-event-tabs.mjs` passes. Preserve unrelated working-tree changes (root tasks.md deletion, react-grab entries, the `.gitignore` line, untracked tool-config directories); do not stage them.

## Phase 2: US1 (P1) — Left list follows the active tab

Goal: the compact left list and its heading always show the active tab's events, matching the right cards.
Independent acceptance: switching All/Past/Upcoming updates the left list and heading to the same set the right cards show; the date tab shows the selected day's events; clearing falls back per data-model.md; compact markup, links, and the hidden mobile pane are unchanged.

- [ ] T002 [US1] In `src/pages/events/index.tsx`, render the left compact list from `cardsByTab[activeTab]` instead of the selectedDay-only `compactEvents` derivation, reusing the existing record as the single source of truth. Update the left heading so `all` shows `All Events`, `past` shows `Past Events`, `upcoming` shows `Upcoming Events`, and `date` shows `Events on MMM dd, yyyy`. Keep the `No events found.` empty state, both clearing gestures, and the shared layout boundary; add no new state or component. Add short, direct comments for each changed block and keep names readable for human.
- [ ] T003 [US1] Validate every scenario in `docs/compact-list-sync/quickstart.md` (tab switching, date selection/clearing, mobile hidden pane, links). Run `node scripts/check-event-tabs.mjs` under the default, `Asia/Singapore`, and `America/Los_Angeles` timezones, `npx eslint src/pages/events/index.tsx`, `npx tsc --noEmit`, `npm run build`, and `npm run lint`. Record actual results and any pre-existing failures in `docs/compact-list-sync/tasks.md`.

## Phase 3: Polish and delivery

- [ ] T004 Review the changed blocks in `src/pages/events/index.tsx` for human readability and short, direct comments; remove any duplication without introducing abstractions. Re-run the quickstart automated checks, stage only `src/pages/events/index.tsx` and `docs/compact-list-sync/tasks.md`, and commit as `feat(events): sync compact list with card tabs`. Mark tasks complete only after their implementation and checks pass.

## Dependencies and parallel opportunities

Execution: T001 → T002 → T003 → T004. All tasks touch the same page or its validation, so no task carries [P]. Within T003, the timezone-varying assertion runs can proceed alongside the manual tab-switching scenarios.

## Implementation strategy

MVP checkpoint: T002–T003 — one derivation for both panes plus the synced heading, fully validated. T004 is the final readability pass and delivery commit. The filter module and both panes' existing behavior are untouched, so the feature is one small integration change, not an incremental build.

Commits follow plan.md: planning documents are separate commits, and the single feature commit carries the implementation and its recorded validation. Preserve unrelated working-tree changes throughout.

## Planning validation

4 tasks: 1 setup, 2 US1, 1 polish. All use checkbox + sequential ID + story label when applicable + file path.
