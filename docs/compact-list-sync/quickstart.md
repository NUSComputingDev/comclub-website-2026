# Validation guide

## Setup

From the repository root, install the lockfile dependencies with `npm ci` if needed, then run `npm run dev`. Open `/events`. The right pane appears at widths of at least 768px. See contracts/ui.md for expected interaction and data-model.md for state rules.

Data at validation time (2026-11-07): 10 events — 9 past, 0 upcoming, 1 undated. Upcoming therefore shows the empty state in both panes; verify upcoming inclusion with the fixed-date assertions instead of live data.

## Automated validation after implementation

- `node scripts/check-event-tabs.mjs`: regression for the shared filter; also under `TZ=Asia/Singapore` and `TZ=America/Los_Angeles`.
- `npx eslint src/pages/events/index.tsx`: changed-code lint.
- `npx tsc --noEmit` and `npm run build`: types and production bundle.
- `npm run lint`: repository lint; distinguish pre-existing failures from regressions.

## Interactive scenarios

1. At 1440px load Events: All is active, the left heading reads `All Events`, and the left list and right cards show the same 10 events in the same order (compact vs card markup).
2. Choose Past: left heading `Past Events`; the left list shows the 9 dated events (undated excluded) and the right cards match.
3. Choose Upcoming: left heading `Upcoming Events`; both panes show `No events found.` with the current data.
4. Choose a day covered by a multi-day event (Feb 2, 2026): the date tab activates, the left heading reads `Events on Feb 02, 2026`, and both panes show the covering events. Choose an empty day and confirm both empty states.
5. With a date selected, choose Upcoming: the left list and heading switch to the upcoming filter while the calendar keeps its selection and the date tab keeps its label. Choose a day again and confirm the date view returns in both panes.
6. Clear via outside-layout click and compact-list background separately while date is active (falls back to All) and while Past is active (stays on Past). Heading and list follow the active tab after clearing.
7. At 375px: the right pane and its tabs are hidden; the left list shows All, and selecting a calendar day filters it to that day as before.
8. Keyboard and links: tab keyboard behavior is unchanged; compact item links still open `/events/{link}`; focus indicators stay visible.

Record results and any environment limitations in tasks.md. Implementation is not complete until these checks are recorded; no runtime checks were performed during planning.
