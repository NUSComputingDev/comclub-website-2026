# Tasks: Mobile filter tabs for the events page

Feature: On mobile, make the filter tabs (All / Past / Upcoming / Date) visible
between the calendar and the compact event list so the user can tap them to
filter the list. Desktop is unchanged. Code only.

Tech stack: React 18 + TypeScript + Vite + Tailwind 3.4 + base-ui Tabs
(`@base-ui/react/tabs`). Component library: base-ui Tabs. Styling: Tailwind
classes inline plus `src/pages/events/index.css` (`@apply`). Breakpoint `md` =
768px.

Single source of truth (already in place): `activeTab`/`selectedDay` state and
`cardsByTab` in `src/pages/events/index.tsx`. The compact list reads
`activeEvents = cardsByTab[activeTab]` and the heading uses
`formatCompactHeading(activeTab, selectedDay)`, so filtering already follows the
tabs — the only missing piece is exposing the tabs control on mobile.

## Phase 1: Setup

- [X] T001 Review the working tree and confirm the events feature is in place:
  `src/pages/events/eventFilters.ts` exports `filterEventCards` and `EventTab`,
  `src/pages/events/index.tsx` holds the controlled `activeTab`/`selectedDay`
  state and `cardsByTab`, and `node scripts/check-event-tabs.mjs` passes.
  Preserve unrelated working-tree changes (deleted root `tasks.md`, the
  `.agents/`, `.aider-desk/`, `.claude/`, `.junie/`, `.kiro/` directories, the
  modified `.gitignore`/`package.json`/`package-lock.json`/`src/main.jsx`); do
  not stage them.

## Phase 2: Foundational (baseline)

- [X] T002 Establish a green starting point before changing anything: run
  `npx tsc --noEmit`, `npx eslint src/pages/events/index.tsx`, and
  `node scripts/check-event-tabs.mjs` under the default, `Asia/Singapore`, and
  `America/Los_Angeles` timezones. Record results here; block further work only
  if a genuinely new failure appears.

Results:
- `npx tsc --noEmit`: ✓ PASS (no errors)
- `npx eslint src/pages/events/index.tsx`: ✓ PASS (no errors)
- `node scripts/check-event-tabs.mjs`: ✓ PASS (default, Asia/Singapore, America/Los_Angeles)

## Phase 3: US1 (P1) — Extract filter tabs into a reusable component

Goal: move the four filter triggers out of the desktop pane into a small
`EventTabs` component so the same bar can be reused on mobile.
Independent acceptance: the desktop pane renders identically; tsc/eslint/build
stay green.

- [X] T003 [US1] In `src/pages/events/index.tsx`, add an `EventTabs` component
  that renders a line `<TabsList variant='line'>` with exactly four
  `<TabsTrigger>`s: `all` (All), `past` (Past), `upcoming` (Upcoming), and
  `date` disabled when `!selectedDay` (`disabled={!selectedDay}`) whose label is
  `selectedDay ? format(selectedDay, 'MMM dd, yyyy') : 'Selected Date'`. Props:
  `selectedDay: Date | null`, `ariaLabel: string`, optional `className?: string`.
  Add short, direct comments and keep names readable for humans.
- [X] T004 [US1] Replace the inline `<TabsList>…</TabsList>` inside the
  `.events-cards` section with `<EventTabs selectedDay={selectedDay}
  ariaLabel='Filter event cards' />`. Make no behavior or layout change; the
  existing `.events .events-cards [data-slot='tabs-list']` CSS still styles it.
  Commit as `refactor(events): extract filter tabs into EventTabs`.

## Phase 4: US2 (P1) — Mobile filter tabs between calendar and compact list

Goal: expose the same filter bar on mobile between the calendar and the compact
list, bound to the shared `activeTab` so tapping it filters the list.
Independent acceptance: below 768px the tab bar appears between the calendar and
the compact list; tapping All/Past/Upcoming/Date updates the list and heading;
the desktop tab keeps working at ≥768px.

- [X] T005 [US2] In `src/pages/events/index.tsx`, insert a mobile-only
  `<Tabs value={activeTab} onValueChange={setActiveTab} className='mb-4
  md:hidden'>` containing
  `<EventTabs selectedDay={selectedDay} ariaLabel='Filter event cards (mobile)'
  className='w-full max-w-full pt-1.5 pb-2' />` between the `<Calendar/>`
  element and the `.events-results` section. The two `<Tabs>` roots are both
  controlled by the same `activeTab`/`setActiveTab`, so a mobile tap filters the
  same list the desktop pane filters. Add short, direct comments. Commit as
  `feat(events): show filter tabs between calendar and compact list on mobile`.
- [X] T006 [US2] Confirm the mobile bar stretches to the column (`w-full
  max-w-full`, giving each trigger room for a single line) and reserves the
  active-underline slot (`pt-1.5` = 6px top, `pb-2` = 8px bottom) purely through
  the className, so no new CSS rule is required for this phase.

## Phase 5: US3 (P2) — Wrap long labels instead of scrolling

Goal: on very narrow widths the date label should wrap rather than overflow.
Independent acceptance: at a narrow width the date label wraps into a second
line; no horizontal scroll appears.

- [X] T007 [US3] In `src/pages/events/index.css`, add a rule scoped to the
  mobile list only — `.events .events-left [data-slot='tabs-list']
  [data-slot='tabs-trigger'] { @apply whitespace-normal; }` — so long labels
  (e.g. the date) wrap. Only the mobile list lives in `.events-left`. Commit as
  `style(events): wrap mobile filter tab labels instead of scrolling`.

## Phase 6: Polish & delivery

- [X] T008 Review the changed blocks in `src/pages/events/index.tsx` for human
  readability and short, direct comments; remove duplication without introducing
  abstractions.
- [X] T009 Validate end-to-end: re-run `npx tsc --noEmit`,
  `npx eslint src/pages/events/index.tsx`,
  `node scripts/check-event-tabs.mjs` (default + `TZ=Asia/Singapore` +
  `America/Los_Angeles`), `npm run build`, and `npm run lint`. Then open
  `/events` at ~375px: the filter tabs sit between the calendar and the compact
  list, the right card pane is hidden, tapping All/Past/Upcoming/Date updates the
  list and heading (All Events / Past Events / Upcoming Events / Events on
  `MMM dd, yyyy`), the date tab is disabled until a day is picked, the
  `No events found.` empty state and its heading appear correctly, the date
  label wraps (no horizontal scroll), and there are no console errors. Record
  actual results and any pre-existing failures below.
- [X] T010 Stage only `src/pages/events/index.tsx` and
  `src/pages/events/index.css`; confirm the unrelated modified/untracked files
  remain unstaged and are not committed.

## Dependencies

Strictly sequential (all work touches at most two files, so there is no parallel
work):

```
T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010
```

Each commit depends on the previous one: the `EventTabs` component (T003) must
exist before the desktop pane uses it (T004), the desktop refactor (T004) must
exist before the mobile bar reuses it (T005), and the style rule (T007) is
meaningful only after the mobile bar exists (T005).

## Parallel opportunities

None — every task modifies `src/pages/events/index.tsx` or `src/pages/events/index.css`,
and the commits build on each other in order.

## Independent test criteria

- US1 (T003–T004): desktop pane is byte-for-byte unchanged; `tsc`/`eslint`/`build`
  green; no console errors at ≥768px.
- US2 (T005–T006): at <768px the filter bar appears between the calendar and the
  compact list; each tap filters the list and heading; the desktop tab still
  works at ≥768px.
- US3 (T007): at a narrow width the date label wraps rather than horizontally
  overflowing.

## MVP scope

US1 + US2 (T003–T006) is the working minimum: desktop unchanged and the mobile
tabs are clickable and synced to the compact list. US3 (T007) is polish for very
narrow widths and can be delivered immediately after.

## Implementation strategy

MVP first: extract the component (US1), reuse it on the desktop pane, then add
the mobile tab bar bound to the shared state (US2). Ship the label-wrapping
polish (US3) last. Stage and commit each change separately in the order above,
using the repo's conventional-commit style and leaving unrelated files unstaged.

## Validation results

_(Fill in during T009.)_

### Automated checks

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | |
| `npx eslint src/pages/events/index.tsx` | |
| `node scripts/check-event-tabs.mjs` (default TZ) | |
| `TZ=Asia/Singapore node scripts/check-event-tabs.mjs` | |
| `TZ=America/Los_Angeles node scripts/check-event-tabs.mjs` | |
| `npm run build` | |
| `npm run lint` | |

### Interactive scenarios (viewport ~375px, below the 768px `md` breakpoint)

1. Load: filter tabs visible between calendar and compact list; right pane hidden.
2. Tap All → compact list shows all events; heading `All Events`.
3. Tap Past → list + heading `Past Events`.
4. Tap Upcoming → list + heading `Upcoming Events` (`No events found.`).
5. Pick a calendar day, tap Date → list + heading `Events on <day>`.
6. Date tab disabled (`Selected Date`) until a day is picked.
7. Long date label wraps; no horizontal scroll.
8. At ≥768px the desktop tab and right pane are unchanged.

## Format validation

All tasks use the required checklist format: `- [ ]` + sequential ID + optional
`[P]` (none here — no parallel tasks) + story label where applicable + exact
file path.
