# Tasks: event card tabs

Based on spec.md, plan.md, research.md, data-model.md, contracts/ui.md, and quickstart.md in this directory. User approved this documentation location instead of a missing `.specify/` installation. No hooks or constitution exist. Implementation is not started; all tasks remain unchecked.

## Phase 1: Setup

- [ ] T001 Review the working tree and the existing Tabs installation in `src/components/ui/tabs.tsx`, `package.json`, and `package-lock.json`; preserve unrelated changes, including the root tasks.md deletion. Confirm required dependencies and reuse the existing cn helper. Verify the installation, then commit only its files/hunks as `feat(components): add line-style tabs`.

## Phase 2: Foundation

- [ ] T002 Create `src/pages/events/eventFilters.ts` with readable pure filtering and export its tab type. Enforce `EventTab is one of all, past, upcoming, date.` Accept the current date explicitly for deterministic checks. Preserve ordering and input data. All includes undated events; Past uses end day before local today; Upcoming uses end day today or later; date uses inclusive local start/end days. Reuse/move the existing eventCoversDay helper from `src/pages/events/index.tsx` without changing compact-list matching. Add short, direct comments for each logical block.
- [ ] T003 Add and run `scripts/check-event-tabs.mjs` with node assertions and the existing esbuild loader: cover yesterday, today, future, ongoing multi-day events, both selected-date endpoints, empty dates, undated records, stable ordering, and unchanged input. Use a fixed local current date and offset-bearing timestamps; run in Asia/Singapore and America/Los_Angeles. Commit the helper and check as `feat(events): filter event cards by date`.

## Phase 3: US1 (P1) — Accessible All tab

Goal: line-style tabs above the right cards, with All as the initial view.
Independent acceptance: all cards and links remain available in current order, date is disabled initially, and tab/panel associations work without changing the compact list.

- [ ] T004 [US1] Add controlled Tabs/TabsList/TabsTrigger/TabsContent composition in `src/pages/events/index.tsx` using `variant='line'` and an accessible list name. Enforce `activeTab initially equals all.`, `selectedDay is Date | null and initially null.`, and `The date tab is disabled when selectedDay is null.` Use stable values and properly associated panels; reuse card markup with a small local render function if needed, preserve empty states, and comment each logical block briefly.
- [ ] T005 [US1] Adjust scoped tab spacing/overflow in `src/pages/events/index.css` only as needed; preserve hidden right pane below md, existing card spacing/masonry, and left-column dimensions. Verify All, disabled placeholder, keyboard/focus behavior, links, and narrow desktop overflow; record results in `docs/event-tabs/tasks.md`.

## Phase 4: US2 (P1) — Past and Upcoming

Goal: filter only the right cards by the visitor's current local day.
Independent acceptance: past excludes today; upcoming includes today and ongoing events; undated events appear only in All; calendar and compact list stay unchanged.

- [ ] T006 [US2] Connect active-tab filtering in `src/pages/events/index.tsx` to `src/pages/events/eventFilters.ts`, supplying the current date on render. Keep compact results derived only from selectedDay and card results derived from the full sorted articlesData. All/Past/Upcoming must not intersect the calendar selection. Use readable names and short block comments; do not add a midnight timer.
- [ ] T007 [US2] Validate the date categories, undated handling, empty states, and left-pane independence using fixed-date checks and the UI; record results in `docs/event-tabs/tasks.md` without modifying production event data.

## Phase 5: US3 (P1) — Selected date tab

Goal: calendar selection names and activates the fourth tab while other tabs preserve the chosen date.
Independent acceptance: select/change/clear transitions match data-model.md, inclusive range matching is retained, and card or tab interactions do not clear selection.

- [ ] T008 [US3] In `src/pages/events/index.tsx`, route Calendar's onSelectDay and both existing clear paths through one selection handler. Choosing a date activates date; choosing another tab preserves selectedDay; clearing sets selectedDay to null and changes only an active date tab to all. Keep listener cleanup, avoid stale active state, retain the shared layout boundary, and display `MMM dd, yyyy` or the disabled Selected Date placeholder. Add short block comments.
- [ ] T009 [US3] Verify selecting/changing dates, multi-day endpoint matching, empty dates, switching away/back, both clearing gestures, and card activation per `docs/event-tabs/quickstart.md`; record results in `docs/event-tabs/tasks.md`.

## Phase 6: Polish and delivery

- [ ] T010 Review readability and short, direct comments across changed blocks in `src/pages/events/index.tsx`, `src/pages/events/eventFilters.ts`, `src/pages/events/index.css`, and `scripts/check-event-tabs.mjs`; remove duplication without introducing generic abstractions. Run the assertions, changed-file lint, TypeScript, build, and repository lint from `docs/event-tabs/quickstart.md`; record existing failures separately in `docs/event-tabs/tasks.md`.
- [ ] T011 Check responsive and accessibility scenarios from `docs/event-tabs/quickstart.md` at 375px, 768px, and 1440px; record actual results/limitations in `docs/event-tabs/tasks.md`. Stage only feature changes in `src/pages/events/index.tsx`, `src/pages/events/index.css` if changed, and the validation record; commit as `feat(events): add event card filter tabs`. Mark tasks complete only after their implementation and checks pass.

## Dependencies and parallel opportunities

Execution: T001 → T002 → T003 → US1 (T004–T005) → US2 (T006–T007) → US3 (T008–T009) → T010 → T011.

All three stories touch the same page, so their edits are deliberately sequential and no task carries [P]. Within US1, CSS review can accompany keyboard verification after integration. Within US2, fixed-date assertions can run alongside manual pane-independence checks. Within US3, separate reviewers can check the two clearing gestures against the completed implementation. These are optional verification opportunities, not authorization to run concurrent source edits.

## Implementation strategy

MVP checkpoint: US1, an accessible All view using the existing cards and disabled date placeholder. Then complete temporal filters and calendar transitions before delivery; the MVP alone does not satisfy the request. Foundation logic gets one assert-based check as required for non-trivial branches, without adding a test framework.

Commits follow plan.md: prerequisite component installation, filter logic/check, then integrated UI. Planning documents are separate commits. Preserve unrelated working-tree changes throughout.

## Planning validation

11 tasks: 1 setup, 2 foundation, 2 US1, 2 US2, 2 US3, 2 polish. All use checkbox + sequential ID + story label when applicable + file path. No implementation or runtime validation is claimed by this document.
