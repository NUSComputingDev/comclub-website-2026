# Data and state

## Existing state (unchanged)

Constraint: `selectedDay is Date | null and initially null.`
Constraint: `activeTab is EventTab and initially equals all.`
Constraint: `EventTab is one of all, past, upcoming, date.`
Constraint: `The date tab is disabled when selectedDay is null.`

No new state. `today` is still computed per render; no midnight timer.

## Derived values

Both panes read one derived record: `cardsByTab[tab] = filterEventCards(articlesData, tab, selectedDay, today)`.

Constraint: `The left compact list renders cardsByTab[activeTab].`
Constraint: `The left heading is All Events, Past Events, or Upcoming Events for all, past, and upcoming, and Events on MMM dd, yyyy for date.`
Constraint: `Undated events appear only in the All results.`
Constraint: `Past uses end day before local today; Upcoming uses end day today or later; date uses inclusive local start/end day coverage.`

## State transitions

| Action | selectedDay | activeTab | Left list |
| --- | --- | --- | --- |
| Load | null | all | All events |
| Choose All/Past/Upcoming | Unchanged | Chosen tab | That tab's events |
| Select calendar day | New day | date | That day's events |
| Clear while date active | null | all | All events |
| Clear while another tab active | null | Unchanged | That tab's events |

Calendar day dots still derive from the full collection and are not tab-filtered.
