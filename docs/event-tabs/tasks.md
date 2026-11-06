# Tasks: event card tabs

Based on spec.md, plan.md, research.md, data-model.md, contracts/ui.md, and quickstart.md in this directory. User approved this documentation location instead of a missing `.specify/` installation. No hooks or constitution exist. Implementation is not started; all tasks remain unchecked.

## Phase 1: Setup

- [X] T001 Review the working tree and the existing Tabs installation in `src/components/ui/tabs.tsx`, `package.json`, and `package-lock.json`; preserve unrelated changes, including the root tasks.md deletion. Confirm required dependencies and reuse the existing cn helper. Verify the installation, then commit only its files/hunks as `feat(components): add line-style tabs`.

## Phase 2: Foundation

- [X] T002 Create `src/pages/events/eventFilters.ts` with readable pure filtering and export its tab type. Enforce `EventTab is one of all, past, upcoming, date.` Accept the current date explicitly for deterministic checks. Preserve ordering and input data. All includes undated events; Past uses end day before local today; Upcoming uses end day today or later; date uses inclusive local start/end days. Reuse/move the existing eventCoversDay helper from `src/pages/events/index.tsx` without changing compact-list matching. Add short, direct comments for each logical block.
- [X] T003 Add and run `scripts/check-event-tabs.mjs` with node assertions and the existing esbuild loader: cover yesterday, today, future, ongoing multi-day events, both selected-date endpoints, empty dates, undated records, stable ordering, and unchanged input. Use a fixed local current date and offset-bearing timestamps; run in Asia/Singapore and America/Los_Angeles. Commit the helper and check as `feat(events): filter event cards by date`.

## Phase 3: US1 (P1) — Accessible All tab

Goal: line-style tabs above the right cards, with All as the initial view.
Independent acceptance: all cards and links remain available in current order, date is disabled initially, and tab/panel associations work without changing the compact list.

- [X] T004 [US1] Add controlled Tabs/TabsList/TabsTrigger/TabsContent composition in `src/pages/events/index.tsx` using `variant='line'` and an accessible list name. Enforce `activeTab initially equals all.`, `selectedDay is Date | null and initially null.`, and `The date tab is disabled when selectedDay is null.` Use stable values and properly associated panels; reuse card markup with a small local render function if needed, preserve empty states, and comment each logical block briefly.
- [X] T005 [US1] Adjust scoped tab spacing/overflow in `src/pages/events/index.css` only as needed; preserve hidden right pane below md, existing card spacing/masonry, and left-column dimensions. Verify All, disabled placeholder, keyboard/focus behavior, links, and narrow desktop overflow; record results in `docs/event-tabs/tasks.md`.

## Phase 4: US2 (P1) — Past and Upcoming

Goal: filter only the right cards by the visitor's current local day.
Independent acceptance: past excludes today; upcoming includes today and ongoing events; undated events appear only in All; calendar and compact list stay unchanged.

- [X] T006 [US2] Connect active-tab filtering in `src/pages/events/index.tsx` to `src/pages/events/eventFilters.ts`, supplying the current date on render. Keep compact results derived only from selectedDay and card results derived from the full sorted articlesData. All/Past/Upcoming must not intersect the calendar selection. Use readable names and short block comments; do not add a midnight timer.
- [X] T007 [US2] Validate the date categories, undated handling, empty states, and left-pane independence using fixed-date checks and the UI; record results in `docs/event-tabs/tasks.md` without modifying production event data.

## Phase 5: US3 (P1) — Selected date tab

Goal: calendar selection names and activates the fourth tab while other tabs preserve the chosen date.
Independent acceptance: select/change/clear transitions match data-model.md, inclusive range matching is retained, and card or tab interactions do not clear selection.

- [X] T008 [US3] In `src/pages/events/index.tsx`, route Calendar's onSelectDay and both existing clear paths through one selection handler. Choosing a date activates date; choosing another tab preserves selectedDay; clearing sets selectedDay to null and changes only an active date tab to all. Keep listener cleanup, avoid stale active state, retain the shared layout boundary, and display `MMM dd, yyyy` or the disabled Selected Date placeholder. Add short block comments.
- [X] T009 [US3] Verify selecting/changing dates, multi-day endpoint matching, empty dates, switching away/back, both clearing gestures, and card activation per `docs/event-tabs/quickstart.md`; record results in `docs/event-tabs/tasks.md`.

## Phase 6: Polish and delivery

- [X] T010 Review readability and short, direct comments across changed blocks in `src/pages/events/index.tsx`, `src/pages/events/eventFilters.ts`, `src/pages/events/index.css`, and `scripts/check-event-tabs.mjs`; remove duplication without introducing generic abstractions. Run the assertions, changed-file lint, TypeScript, build, and repository lint from `docs/event-tabs/quickstart.md`; record existing failures separately in `docs/event-tabs/tasks.md`.
- [X] T011 Check responsive and accessibility scenarios from `docs/event-tabs/quickstart.md` at 375px, 768px, and 1440px; record actual results/limitations in `docs/event-tabs/tasks.md`. Stage only feature changes in `src/pages/events/index.tsx`, `src/pages/events/index.css` if changed, and the validation record; commit as `feat(events): add event card filter tabs`. Mark tasks complete only after their implementation and checks pass.

## Dependencies and parallel opportunities

Execution: T001 → T002 → T003 → US1 (T004–T005) → US2 (T006–T007) → US3 (T008–T009) → T010 → T011.

All three stories touch the same page, so their edits are deliberately sequential and no task carries [P]. Within US1, CSS review can accompany keyboard verification after integration. Within US2, fixed-date assertions can run alongside manual pane-independence checks. Within US3, separate reviewers can check the two clearing gestures against the completed implementation. These are optional verification opportunities, not authorization to run concurrent source edits.

## Implementation strategy

MVP checkpoint: US1, an accessible All view using the existing cards and disabled date placeholder. Then complete temporal filters and calendar transitions before delivery; the MVP alone does not satisfy the request. Foundation logic gets one assert-based check as required for non-trivial branches, without adding a test framework.

Commits follow plan.md: prerequisite component installation, filter logic/check, then integrated UI. Planning documents are separate commits. Preserve unrelated working-tree changes throughout.

## Planning validation

11 tasks: 1 setup, 2 foundation, 2 US1, 2 US2, 2 US3, 2 polish. All use checkbox + sequential ID + story label when applicable + file path.

## Validation results

Recorded during implementation (2026-11-07) via the dev server and the in-app browser.

### Automated
- `node scripts/check-event-tabs.mjs`: PASS in the default TZ (Asia/Singapore), under `TZ=Asia/Singapore`, and under `TZ=America/Los_Angeles`. Covers yesterday/today/future/ongoing, both inclusive multi-day endpoints, undated excluded from Past/Upcoming/Date, empty day, null selection, stable ordering, and unchanged input.
- `npx eslint src/pages/events/index.tsx src/pages/events/eventFilters.ts src/components/tabs.tsx scripts/check-event-tabs.mjs`: PASS (0 errors/warnings).
- `npx tsc --noEmit`: PASS.
- `npm run build`: PASS (829 modules transformed, no errors).
- `npm run lint` (repo-wide): PASS; no pre-existing failures to separate out.

### US1 (T004–T005) — accessible All tab
- At ≥768px the line tab bar renders above the right cards; All is initially active and shows all 10 cards in existing newest-start-first order (undated LifeHack last). The date trigger shows the disabled "Selected Date" placeholder.
- ARIA: triggers are `role=tab` with `aria-selected`; the active trigger carries `aria-controls` matching the panel `id`; the panel is `role=tabpanel` with `aria-labelledby` pointing at the active trigger; the tab list has the accessible name "Filter event cards".
- Keyboard: arrow keys and Home move focus (Base UI default manual activation); Space and Enter (native `<button>`) activate; the disabled date tab cannot be activated.
- CSS change is scoped to the tab row (`.events-cards [data-slot='tabs-list']`); masonry `column-gap: 24px` and `columns: 18rem` are preserved; the compact list and left column are unchanged.

### US2 (T006–T007) — Past and Upcoming
- Past shows the 9 dated events (undated excluded). Upcoming shows "No events found." because every dated event (Feb–Aug 2026) ends before today (Nov 2026), per the local-day boundary.
- Card results derive from the full sorted collection; the compact list and calendar selection are independent of the active tab. No midnight timer; `today` is computed per render.

### US3 (T008–T009) — selected date tab
- Selecting a calendar day activates the date tab, sets its label to `MMM dd, yyyy`, and shows inclusive multi-day matches: COMaraderie (Feb 2–6) matched on Feb 2 and Feb 6; Feb 7 and Feb 1 were empty; Career Launchpad matched on Feb 10.
- Switching to All/Past/Upcoming retains the date selection and label; returning to the date tab recovers the matching cards.
- Clearing: both the outside-layout click and the compact-list background click clear the selection. Clearing while the date tab is active falls back to All; clearing while Past is active stays on Past. The placeholder reverts to the disabled "Selected Date".
- Card and tab interactions do not clear the selection (they sit inside the shared layout boundary).

### Responsive (T011)
- 1440px/1000px: full layout, all cards, masonry gaps intact.
- Narrow pane (forced to 240px to simulate a tight desktop): the tab row scrolls horizontally (`overflow-x:auto`; scrollWidth 255 > clientWidth 225) without widening the layout (layout width unchanged) and without page horizontal overflow.
- Below `md` (768px): `.events-cards` is `display:none` (confirmed in the compiled CSS media query), so the tabs and cards are hidden and cannot receive focus at 375px; the calendar and compact list retain behavior.
- Limitation: the in-app browser exposes no viewport-resize tool, so 375px/768px/1440px were verified through the compiled CSS media queries and by forcing the pane narrow, rather than by resizing the actual window.

### Notes
- The plan references `src/components/ui/tabs.tsx`; the installed wrapper actually lives at `src/components/tabs.tsx` and was reused in place (`cn` from `lib/utils`). No changes to the wrapper were required.
- Unrelated working-tree changes were preserved and not committed: the root `tasks.md` deletion, `react-grab` in `package.json`/`package-lock.json`/`src/main.jsx`, the `.specify/` line in `.gitignore`, and the untracked tool config directories.
