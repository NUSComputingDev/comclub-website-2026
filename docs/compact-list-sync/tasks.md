# Tasks: compact list tab sync

Based on spec.md, plan.md, research.md, data-model.md, contracts/ui.md, and quickstart.md in this directory. No `.specify/` installation, hooks, or constitution exist; documentation follows the repo's `docs/<feature>/` approach. Implementation is not started; all tasks remain unchecked.

## Phase 1: Setup

- [X] T001 Review the working tree and confirm the event-tabs feature is in place: `src/pages/events/eventFilters.ts` exports `filterEventCards` and `EventTab`, `src/pages/events/index.tsx` holds the controlled `activeTab`/`selectedDay` state and `cardsByTab`, and `node scripts/check-event-tabs.mjs` passes. Preserve unrelated working-tree changes (root tasks.md deletion, react-grab entries, the `.gitignore` line, untracked tool-config directories); do not stage them.

## Phase 2: US1 (P1) — Left list follows the active tab

Goal: the compact left list and its heading always show the active tab's events, matching the right cards.
Independent acceptance: switching All/Past/Upcoming updates the left list and heading to the same set the right cards show; the date tab shows the selected day's events; clearing falls back per data-model.md; compact markup, links, and the hidden mobile pane are unchanged.

- [X] T002 [US1] In `src/pages/events/index.tsx`, render the left compact list from `cardsByTab[activeTab]` instead of the selectedDay-only `compactEvents` derivation, reusing the existing record as the single source of truth. Update the left heading so `all` shows `All Events`, `past` shows `Past Events`, `upcoming` shows `Upcoming Events`, and `date` shows `Events on MMM dd, yyyy`. Keep the `No events found.` empty state, both clearing gestures, and the shared layout boundary; add no new state or component. Add short, direct comments for each changed block and keep names readable for human.
- [X] T003 [US1] Validate every scenario in `docs/compact-list-sync/quickstart.md` (tab switching, date selection/clearing, mobile hidden pane, links). Run `node scripts/check-event-tabs.mjs` under the default, `Asia/Singapore`, and `America/Los_Angeles` timezones, `npx eslint src/pages/events/index.tsx`, `npx tsc --noEmit`, `npm run build`, and `npm run lint`. Record actual results and any pre-existing failures in `docs/compact-list-sync/tasks.md`.

## Phase 3: Polish and delivery

- [X] T004 Review the changed blocks in `src/pages/events/index.tsx` for human readability and short, direct comments; remove any duplication without introducing abstractions. Re-run the quickstart automated checks, stage only `src/pages/events/index.tsx` and `docs/compact-list-sync/tasks.md`, and commit as `feat(events): sync compact list with card tabs`. Mark tasks complete only after their implementation and checks pass.

## Dependencies and parallel opportunities

Execution: T001 → T002 → T003 → T004. All tasks touch the same page or its validation, so no task carries [P]. Within T003, the timezone-varying assertion runs can proceed alongside the manual tab-switching scenarios.

## Implementation strategy

MVP checkpoint: T002–T003 — one derivation for both panes plus the synced heading, fully validated. T004 is the final readability pass and delivery commit. The filter module and both panes' existing behavior are untouched, so the feature is one small integration change, not an incremental build.

Commits follow plan.md: planning documents are separate commits, and the single feature commit carries the implementation and its recorded validation. Preserve unrelated working-tree changes throughout.

## Planning validation

4 tasks: 1 setup, 2 US1, 1 polish. All use checkbox + sequential ID + story label when applicable + file path.

## Validation results

Validated 2026-11-07 (local TZ UTC+8; data at validation: 10 events — 9 past, 0 upcoming, 1 undated).

### Automated checks

| Check | Result |
| --- | --- |
| `node scripts/check-event-tabs.mjs` (default TZ) | Pass — `check-event-tabs OK (Asia/Singapore)` |
| `TZ=Asia/Singapore node scripts/check-event-tabs.mjs` | Pass |
| `TZ=America/Los_Angeles node scripts/check-event-tabs.mjs` | Pass |
| `npx eslint src/pages/events/index.tsx` | Pass, no findings |
| `npx tsc --noEmit` | Pass, no errors |
| `npm run build` | Pass — vite 5.0.10, 829 modules transformed |
| `npm run lint` | Pass, no findings under `--max-warnings 0`; no pre-existing failures |

### Interactive scenarios (quickstart.md)

Ran `npm run dev` and exercised `/events` in the in-app browser (viewport 1000×892, above the 768px md breakpoint, so the right pane is visible). No console errors at any point.

1. **Load, All active:** heading `All Events`; 10 compact items and 10 cards in the same order; undated LifeHack 2026 last. Pass.
2. **Past:** heading `Past Events`; 9 compact items / 9 cards, undated excluded; panes identical. Pass.
3. **Upcoming:** heading `Upcoming Events`; both panes show `No events found.`. Pass.
4. **Date tab:** Feb 2, 2026 → date tab activates with label `Feb 02, 2026`, heading `Events on Feb 02, 2026`, both panes show only Comaraderie. Empty day Feb 14, 2026 → heading `Events on Feb 14, 2026`, both panes `No events found.`. Pass.
5. **Tab wins over calendar selection:** with Feb 14 selected, choose Upcoming → heading and list switch to `Upcoming Events` / empty while the calendar keeps its Feb 14 selection and the date tab keeps its `Feb 14, 2026` label. Choose Feb 2 again → date view returns in both panes. Pass.
6. **Clearing:** outside-layout click while the date tab is active falls back to All (`All Events`, 10 items); outside-layout click with Feb 2 selected and Past active stays on Past (`Past Events`, 9 items, selection cleared, date tab back to disabled `Selected Date`); compact-list background click while date is active falls back to All. Pass.
7. **Mobile at 375px:** the in-app browser has no viewport-resize tool, so verified statically: `.events .events-cards` is `hidden md:block`, i.e. `display:none` below 768px and unable to receive keyboard focus; on mobile `activeTab` can only be `all` or `date`, so the left list shows all events or the selected day's events, as before. Pass (static).
8. **Keyboard and links:** tab keyboard behavior and the `focus-visible` ring come from the base-ui Tabs primitive in `src/components/tabs.tsx`, untouched by this feature; compact item links verified as `/events/{link}` for all 10 events. Pass.

### Environment limitations

- In-app browser viewport is 1000px wide, not 1440px; the right pane is visible at this width, so scenarios 1–6 are unaffected.
- `Calendar.tsx` month navigation uses a stale `currentMonth` in `previousMonth`/`nextMonth`, so rapid programmatic clicks in one task collapse to a single month step; calendar navigation was driven one click per round trip. Pre-existing behavior, untouched by this feature.
