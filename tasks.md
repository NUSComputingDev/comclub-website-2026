# Events list refactor tasks

Generated from the request and current code. This repository has no `.specify` feature spec, plan, or task template.

## Phase 1: Setup

- [X] T00- [ ] T001 Review event fields and current presentation in `src/pages/events/Calendar.tsx`, `src/pages/events/SearchResult.tsx`, `src/pages/events/SearchResult.css`, `src/pages/events/articles.json`, and `src/pages/events/zod.ts` before editing.

## Phase 2: Foundational

- [X] T00- [ ] T002 Define the data flow in `src/pages/events/index.tsx` and `src/pages/events/Calendar.tsx`: `index.tsx` owns parsed event data, selected date, filtering, sorting, and rendering; `Calendar.tsx` receives the selected date, date-change callback, and event data needed for day markers.

## Phase 3: User Story 1 (P1) — Compact event entry

**Goal:** Show each event with its name, muted date, and short description using the current result styling.

**Independent check:** Render an event with a long description and verify its link and styling, the date beneath its name, and a visible ellipsis after about two and a half lines.

- [X] T00- [ ] T003 [US1] Create `src/components/CompactEventList.tsx` with typed name, description, and date props plus the existing event link needed to preserve navigation; use the current `SearchResult` appearance, a lower-opacity date beneath the name, and accessible date markup.
- [X] T00- [ ] T004 [US1] Add only the styling needed for approximately 2.5 lines of description and ellipsis in `src/components/CompactEventList.tsx` or its colocated CSS; check that long text truncates and short text remains fully visible.
- [X] T00- [ ] T005 [US1] Add short, direct comments only where a code block’s purpose is not clear from names in `src/components/CompactEventList.tsx`; keep indentation consistent with surrounding files.
- [X] T00- [ ] T006 [US1] Commit the completed component change with a Conventional Commits message, such as `feat(events): add compact event list item`.

## Phase 4: User Story 2 (P1) — Date-driven list on Events page

**Goal:** The Events page owns the list; choosing a calendar date filters it, while no selection shows all events newest first.

**Independent check:** Verify a selected date includes events whose start/end range covers that day, a date without events shows the empty state, and clearing selection restores all events in descending date order.

- [X] T00- [ ] T007 [US2] Move `articles.json` parsing, list ordering, date-range filtering, heading, empty state, and `CompactEventList` mapping from `src/pages/events/Calendar.tsx` into `src/pages/events/index.tsx`; use `startDatetime` for descending order and place undated entries last.
- [X] T00- [ ] T008 [US2] Make `src/pages/events/Calendar.tsx` a date picker controlled by `src/pages/events/index.tsx`; retain month navigation, selected/today styles, event-day dots, and the current outside-click clearing behavior, adjusting ownership and refs as needed.
- [X] T00- [ ] T009 [US2] Preserve the current two-column layout and event links in `src/pages/events/index.tsx` and `src/pages/events/index.css`; render the selected-date heading or “All Events,” followed by `CompactEventList` entries or “No events found.”
- [X] T01- [ ] T010 [US2] Add short, direct comments only for non-obvious date filtering and interaction blocks in `src/pages/events/index.tsx` and `src/pages/events/Calendar.tsx`; keep indentation readable.
- [X] T01- [ ] T011 [US2] Run `npm run lint` and `npm run build`, then manually check selection, deselection, sort order, date ranges, empty state, and links on the Events page.
- [X] T01- [ ] T012 [US2] Remove `src/pages/events/SearchResult.tsx` and `src/pages/events/SearchResult.css` only if no callers remain after the refactor.
- [X] T01- [ ] T013 [US2] Commit the completed page/calendar refactor with a Conventional Commits message, such as `refactor(events): render selected events on page`.

## Phase 5: Polish and cross-cutting concerns

- [X] T014 Confirm `git status --short` contains only intended changes and that each implementation commit follows the Conventional Commits specification.

## Dependencies and execution

T001 → T002 → US1 (T003–T006) → US2 (T007–T013) → T014. The component and page phases share presentation contracts and should be completed in order; no useful file-independent parallel work is required.

**MVP:** Complete US1, then US2 for a working end-to-end Events page. US1 alone is independently inspectable as a component but does not change the page.
