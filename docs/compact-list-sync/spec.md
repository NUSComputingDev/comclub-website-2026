# Compact list tab sync

## Scope and confirmed behavior

The compact event list in the left column must stay in sync with the line tabs on the right: the active tab decides which events the left list shows. For example, when Upcoming is selected on the right, the left list shows only upcoming events. This document authorizes planning only; implementation is a separate step.

- The left list uses the same filter as the right cards: All shows every event, including undated; Past shows dated events ending before the visitor's current local day; Upcoming shows dated events ending today or later, including ongoing events; the date tab shows events whose inclusive local day range covers the selected day.
- The left list heading reflects the active filter: `All Events`, `Past Events`, `Upcoming Events`, or `Events on MMM dd, yyyy` for the date tab.
- The active tab wins over the calendar selection for list contents: choosing All, Past, or Upcoming while a day is still selected switches the left list to that filter while keeping the calendar selection and the date tab label.
- Selecting a calendar day activates the date tab, so the left list again shows that day's events.
- Preserve both existing clearing gestures (outside-layout click, compact-list background click) and their fallback: clearing changes the active tab from date to All only.
- Preserve undated event handling (All only), newest-start-first ordering, compact item markup and links, the `No events found.` empty state, and the hidden right pane below `md` (768px).
- Use short, direct comments for each new or changed logical code block. Use readable names and ordinary control flow so the code stays readable by human.
- Make separate commits for coherent changes using `type(scope): short imperative description`, matching the existing commits.

## User stories

### US1 — Left list follows the active tab (P1)

As a visitor, the compact list on the left always agrees with the tab I selected on the right, so both panes never contradict each other.

Acceptance: switching All/Past/Upcoming immediately shows the matching set in the left list with the matching heading; the date tab shows that day's events in both panes; clearing a selection falls back per the state rules; calendar day dots and compact item markup are unchanged; at 375px the right pane is hidden and the left list keeps its current behavior.

## Non-goals

No filter-semantics change, no new state or component, no calendar dot syncing, no URL persistence, no mobile redesign, no styling change to `CompactEventList`, and no unrelated refactoring.
