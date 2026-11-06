# Event card tabs

## Scope and confirmed behavior

Add line-style tabs to the right event card pane: All, Past, Upcoming, Selected Date. Filter only the right pane. The calendar and compact list keep their existing behavior. This document authorizes planning only; implementation is a separate step.

- Default to All, including undated events.
- Past includes dated events whose end falls before the visitor's current local day.
- Upcoming includes dated events ending today or later, including ongoing events.
- Compare calendar days, not the current clock time. Interpret timestamps in the visitor's local timezone, consistently with the existing calendar.
- Undated events appear only in All.
- Initially show a disabled Selected Date tab. After selection, replace its label with the existing `MMM dd, yyyy` date format and automatically activate it.
- Date results include events spanning the selected day, with both endpoints inclusive.
- Switching to All, Past, or Upcoming retains the calendar selection and the date tab's label.
- Clearing the calendar disables the date tab and restores its placeholder. If the date tab was active, activate All; otherwise keep the active tab.
- Preserve existing clearing gestures: outside-layout clicks and compact-list-background clicks.
- Retain newest-start-first ordering, cards, links, date labels, masonry gaps, and `No events found.` empty states.
- Preserve the current responsive rule: the right pane and its tabs are hidden below `md` (768px).
- Use short, direct comments for each new or changed logical code block. Use readable names and ordinary control flow.
- Make separate commits for coherent changes using `type(scope): short imperative description`.

## User stories

### US1 — Browse all event cards (P1)

As a visitor, I can use an accessible line-style tab bar above the cards, initially on All, without changing the compact calendar list.

Acceptance: All shows every event in existing order; a disabled date placeholder is visible; keyboard focus and tab/panel associations work; card navigation and layout are unchanged.

### US2 — Browse past and upcoming events (P1)

As a visitor, I can distinguish ended events from today's, ongoing, and future events using my local date.

Acceptance: Past contains only events ending before today; Upcoming contains events ending today or later; neither contains undated events. Changing tabs does not change the compact list or calendar selection.

### US3 — Browse a calendar date (P1)

As a visitor, choosing a calendar date activates its named tab and shows matching cards, while I can return to other filters without losing that date.

Acceptance: selecting/changing dates updates the label and results; inclusive multi-day matches work; clearing selection restores the disabled placeholder and falls back to All only when necessary.

## Non-goals

No mobile pane redesign, URL persistence, new event schema, new filtering dependency, header navigation changes, or unrelated refactoring. No background midnight timer: evaluate today on render and subsequent interaction; a continuously idle page refreshes on its next interaction or reload.
