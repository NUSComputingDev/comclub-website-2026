# Event tabs UI contract

Within the existing right-hand event pane, render line tabs in order All, Past, Upcoming, Selected Date. After calendar selection the fourth label uses `MMM dd, yyyy`. Internal values remain all/past/upcoming/date.

All is initially selected. The date placeholder is visible but disabled until selection. Selecting a calendar day activates date, including empty dates. Other tabs retain the selected day. Existing clearing gestures restore the placeholder and switch date to All if needed.

All returns the full ordered collection. Past returns dated events ending before today's local day. Upcoming returns dated events ending today or later. Date returns events whose inclusive local day range covers the selected day. Empty panels display `No events found.`

Use Base UI trigger/list/panel associations and keyboard behavior. Give the tab list an accessible name such as `Filter event cards`. Disabled date cannot activate. Focus indicators and the active underline stay visible. Article links continue opening `/events/{link}`.

Tabs and cards stay within the existing layout outside-click boundary. No tab action filters or clears the compact list. Preserve hidden right pane below md; horizontal tab scrolling must not cause page overflow at narrow desktop widths. No URL, persistence, or external API contract is added.
