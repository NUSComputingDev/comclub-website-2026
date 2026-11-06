# Validation guide

## Setup

From the repository root, install the lockfile dependencies with `npm ci` if needed, then run `npm run dev`. Open `/events`. The right pane appears at widths of at least 768px. See contracts/ui.md for expected interaction and data-model.md for state rules.

## Automated validation after implementation

- `node scripts/check-event-tabs.mjs`: fixed-date assertions for past, today, future, ongoing, inclusive date endpoints, undated events, and unchanged input/order. Run with `TZ=Asia/Singapore` and `TZ=America/Los_Angeles` as well to verify local-day behavior.
- `npx eslint src/pages/events/index.tsx src/pages/events/eventFilters.ts src/components/ui/tabs.tsx scripts/check-event-tabs.mjs`: changed-code lint.
- `npx tsc --noEmit` and `npm run build`: types and production bundle.
- `npm run lint`: repository lint; distinguish pre-existing failures from regressions.

## Interactive scenarios

1. At 1440px, load Events: All is active, all cards retain order and links, date placeholder is disabled.
2. Switch Past/Upcoming. Compare against local-day boundaries; check empty results. Use temporary controlled data or the deterministic assertion fixtures to cover future and ongoing events; do not commit replacement article data.
3. Choose a date covered by a multi-day event. The date tab activates, label changes, and both date endpoints match. Choose an empty day and confirm the empty state.
4. Switch All/Past/Upcoming: date highlight, date label, and compact list stay unchanged. Return to date and recover matching cards.
5. Clear via outside-layout click and compact-list background separately. Date falls back to All; other active tabs remain active. The placeholder becomes disabled.
6. Activate cards and tabs: no selection clearing before navigation. Check arrow-key movement, keyboard activation, focus visibility, and accessible tab/panel associations.
7. Check 768px and 1440px: tab row and date label do not widen the page, underline is visible, and masonry gaps remain. At 375px the entire right pane is hidden and cannot receive focus; calendar/compact list retain behavior.

Record results and any environment limitations in tasks.md. Implementation is not complete until these checks are recorded; no runtime checks were performed during planning.
