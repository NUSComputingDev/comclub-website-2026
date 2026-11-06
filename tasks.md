# Calendar and event pane layout

## Phase 1: Setup

- [X] T001 Inspect the current layout classes and wrappers in `src/pages/events/index.tsx` and `src/pages/events/index.css`.

## Phase 2: Foundational

No shared prerequisites are needed for this layout-only change.

## Phase 3: User Story 1 (P1) — Calendar at the left with events below

**Goal:** Place the calendar at the left edge of the Events content and stack the event pane directly beneath it at every viewport width.

**Independent check:** On narrow and wide viewports, the calendar is left-aligned, the event pane begins below it, neither pane overflows horizontally, and date selection still updates the list.

- [X] T002 [US1] Replace the responsive two-column grid and divider in `src/pages/events/index.tsx` with a vertical layout; remove fixed calendar height and desktop left padding/minimum width that keep the event pane beside the calendar.
- [ ] T003 [US1] Adjust the Events content alignment and width in `src/pages/events/index.tsx` and `src/pages/events/index.css` so the calendar sits at the left edge of the content area and the event heading and list align below it.
- [ ] T004 [US1] Verify the layout at mobile and desktop widths and check date selection, outside-click clearing, event links, and empty state in `src/pages/events/index.tsx`; run `npm run lint` and `npm run build`.

## Phase 4: Polish and cross-cutting concerns

- [ ] T005 Check the final diff for unintended changes in `src/pages/events/index.tsx` and `src/pages/events/index.css`.

## Dependencies and execution

T001 → T002 → T003 → T004 → T005. These tasks affect the same layout, so there are no useful parallel tasks. US1 is the MVP and the complete requested change.
