# Data and state

## Article (existing)

Reuse Article from `src/pages/events/zod.ts`: department, title, body, link, imgSrc, optional startDatetime/endDatetime. Existing validation accepts both valid date strings together or neither; no model migration. Preserve existing newest-start-first ordering and do not mutate input. Existing parser behavior remains unchanged.

## EventTab

Constraint: `EventTab is one of all, past, upcoming, date.`
Constraint: `activeTab initially equals all.`
Constraint: `selectedDay is Date | null and initially null.`
Constraint: `The date tab is disabled when selectedDay is null.`

No stored filtered array; derive results from Article[], activeTab, selectedDay, and the current local date. Only All contains undated records. Dates use local start-of-day boundaries.

## State transitions

| Action | selectedDay | activeTab |
| --- | --- | --- |
| Select calendar day | New day | date |
| Choose All/Past/Upcoming | Unchanged | Chosen tab |
| Choose enabled date tab | Unchanged | date |
| Clear while date active | null | all |
| Clear while another tab active | null | Unchanged |

Compact results depend only on selectedDay. Card results depend on activeTab; selectedDay matters only for date. Tab selection does not change the calendar month or selection.
