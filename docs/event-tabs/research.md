# Research decisions

## Existing UI and scope

Decision: reuse the installed Tabs wrapper and add independent card filtering in the event page.
Rationale: both panes currently share displayedEvents, while the user confirmed only the right pane should follow tabs. Calendar already exposes onSelectDay(Date | null).
Alternatives considered: filtering both panes (rejected by user), custom tab buttons (duplicates installed accessible primitives).

## Date boundaries

Decision: visitor-local calendar days; Past means ended before today, Upcoming means ends today or later; undated events only in All.
Rationale: confirmed by the user and consistent with current date-fns parsing/display. End dates retain ongoing events in Upcoming.
Alternatives considered: Singapore-only dates, exact timestamps, and strict future-only matching (not selected).

## Calendar transitions

Decision: disabled placeholder initially; selected date auto-activates; other tabs retain selection; clearing only changes activeTab when it was date.
Rationale: user-confirmed behavior. Both clearing paths must use the same transition to avoid a disabled active tab.
Alternatives considered: hide placeholder, clear selection on tab switches (not selected).

## Implementation and checks

Decision: isolate the small pure filter for deterministic checks; preserve current layout and left-side behavior.
Rationale: branching date logic warrants an assert check; a fixed current date avoids tests depending on the day's real events. Current data is largely historical, so live data alone cannot prove upcoming behavior.
Alternatives considered: new test framework or new filter dependency (unnecessary).

Read-only research reviewed index.tsx, Calendar.tsx, index.css, zod.ts, tabs.tsx, and docs/events-pane/tasks.md. The plan skill's research agent independently confirmed the two clearing paths, shared-pane coupling, narrow-pane overflow risk, and existing commit format. No external library API change is proposed.
