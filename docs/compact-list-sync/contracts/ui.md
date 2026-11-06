# Compact list sync UI contract

The left compact list and the right card pane display the same event set: the active tab (All/Past/Upcoming/date) decides it in both panes. The compact heading mirrors the active filter: `All Events`, `Past Events`, `Upcoming Events`, or `Events on MMM dd, yyyy` for the date tab.

Choosing All, Past, or Upcoming updates the left list immediately, even when a calendar day is still selected; the calendar selection and the date tab label are preserved. Selecting a calendar day activates the date tab, so the left list returns to that day's events.

Clearing (outside-layout click or compact-list background click) keeps its existing fallback: an active date tab falls back to All, any other active tab stays active. After clearing, the left list shows the active tab's set.

Undated events appear only in All. Empty results show `No events found.` in the left list as today. Compact item markup, links, ordering, and the hidden right pane below md are unchanged. No URL, persistence, or external API contract is added.
