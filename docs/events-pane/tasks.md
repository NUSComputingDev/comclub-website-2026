# Events page: left calendar and right event cards

## Basis and scope

This task list translates the conversation plan into implementation steps. No implementation is authorized by generating this file. The repository has no `.specify/` setup, plan.md, or spec.md; the setup script, template, constitution, and extension hooks are unavailable. Preserve the existing deletion of root `tasks.md` and the user's `.gitignore` changes.

Use React, TypeScript, Tailwind/CSS, date-fns, and the existing Article data and ThreeDCard component. Add no dependencies, data schema changes, or unrelated refactors. Add short, direct comments to each new or changed logical code block; use readable names and normal control flow.

## Confirmed behavior

- The left column stays visible while the page scrolls. Use sticky positioning with an offset that clears the site header; if the column exceeds the available viewport height, allow its contents to scroll so all compact events remain reachable.
- Both panes use the existing `displayedEvents` collection: no selected date shows all events; selecting a date shows events covering that day, retaining current multi-day range behavior and ordering.
- On mobile, only the calendar and compact list are visible. Hide the right pane below the existing `md` breakpoint; do not stack it below the left column. Hidden cards must not be keyboard-focusable.
- Cards open the event article route. Undated cards omit the date subheading entirely, with no placeholder or empty date row.
- The right pane fills the remaining desktop width; cards retain their compact design and wrap into rows.

Implementation detail: include both panes in the outside-click boundary before freezing the left-side handlers. Clicking a filtered card must not clear the selected date on mousedown and replace the target before navigation. Clicking outside the combined region retains existing selection clearing.

## Phase 1: Setup

- [X] T001 Inspect `src/pages/events/index.tsx`, `src/pages/events/index.css`, `src/pages/events/Calendar.tsx`, `src/components/CompactEventList.tsx`, `src/components/3DCard.tsx`, `src/components/3DCard.css`, `src/layout/WindowCard.tsx`, and `src/layout/WindowCard.css`; search all ThreeDCard callers and global section rules before editing. Record baseline calendar/list widths, date selection, empty state, outside-click clearing, and links in `docs/events-pane/tasks.md`.

## Phase 2: Foundational review

- [X] T002 Inspect the site header and responsive styles used by `src/pages/events/index.tsx` and `src/pages/events/index.css`; determine the sticky top offset and available viewport height. Identify a shared interaction boundary for both panes in `src/pages/events/index.tsx` before freezing selection handlers. Use the confirmed behavior above without requesting the same clarifications again.

## Phase 3: US1 (P1) — Anchor and freeze the left column

Goal: Keep the calendar above its current compact event pane at the left, visible while scrolling on desktop and mobile.

Independent acceptance: At desktop and narrow widths, the calendar and list remain aligned, preserve their compact widths, and do not overflow. The column stays visible while scrolling without hiding beneath the header; on short viewports all compact events remain reachable. Date selection, date ranges, empty state, existing links, and outside-click clearing work within the combined interaction boundary.

- [X] T003 [US1] Adjust the outer layout in `src/pages/events/index.tsx` and `src/pages/events/index.css` to remove the centered, capped content wrapper and establish a full-width parent with a compact left column. Apply sticky positioning, header clearance, and viewport-height overflow handling to the left column. Preserve calendar/list content and prepare room for a sibling pane. Establish the shared outside-click boundary for both panes now, preserving date selection during right-pane interactions, before freezing the handlers. Replace fragile ancestry-dependent section overrides with scoped selectors as needed in this step so later sibling additions cannot alter left-side styling.
- [X] T004 [US1] Check the US1 acceptance criteria for `src/pages/events/index.tsx` at 375px, 768px, and 1440px, including page scrolling and short viewport heights; run the existing lint and build commands from `package.json`, recording pre-existing failures separately. Review and commit only this change as `fix(events): anchor calendar and event pane to the left`. Record the commit in `docs/events-pane/tasks.md` as the frozen baseline; later steps must not change left-column markup, styles, handlers, or data behavior.

## Phase 4: US2 (P2) — Fill the remaining width with a right pane

Goal: Add a separate event pane alongside the frozen column on wide screens.

Independent acceptance: The new pane occupies all remaining available desktop width and is hidden below the existing `md` breakpoint, where only the calendar and compact list remain visible. It causes no horizontal overflow, overlap, or change to the left column.

- [X] T005 [US2] Add a labeled sibling pane in `src/pages/events/index.tsx` and scoped layout styles in `src/pages/events/index.css`. Let the right pane grow and shrink with `min-width: 0`; hide the right pane below the existing `md` breakpoint with display-based visibility so its links cannot receive keyboard focus, and avoid global section styles. Place it inside the interaction boundary prepared in US1. Do not modify the frozen left column.
- [X] T006 [US2] Check the US2 acceptance criteria at 375px, 768px, and 1440px and compare the left column against the US1 baseline for `src/pages/events/index.tsx` and `src/pages/events/index.css`. Run lint and build, then commit only this change as `feat(events): add right-side event pane`.

## Phase 5: US3 (P3) — Render event cards

Goal: Show each event's photo, name, date, and three-line description using ThreeDCard.

Independent acceptance: Every right-pane event renders the correct photo and title, the existing date/range format when available (no date row when undated), and at most three visible description lines. Both panes show all events without a selection and only events covering the selected day otherwise. Cards wrap without overflow and open article pages by mouse or keyboard. The right pane is hidden on mobile. Calendar/list behavior remains at its frozen baseline.

- [X] T007 [US3] Populate the right pane in `src/pages/events/index.tsx` with the existing `displayedEvents` collection shared by the compact list using `ThreeDCard` from `src/components/3DCard.tsx`: pass `photo={event.imgSrc}`, `heading={event.title}`, the existing `formatEventDate(event)` result when dated, `description={event.body}`, and `displayLineCount={3}`. Use `event.link` as the stable key; guard undated events before calling the existing date formatter, pass an empty subheading for undated events, and provide a right-pane empty state. Do not introduce separate filter state or modify the frozen selection logic.
- [X] T008 [US3] Add wrapping card layout scoped to the right pane in `src/pages/events/index.css`; preserve the shared card's compact design. Wrap cards using the existing router link convention to `/events/${event.link}` in `src/pages/events/index.tsx` and retain a visible keyboard focus indicator.
- [X] T009 [US3] Add appropriate image alternative text in `src/components/3DCard.tsx` using the available heading without adding unnecessary props. Render the subheading element only when its string is nonempty, omitting both the date text and row for undated cards. Keep its current API and three-line clamping behavior intact; review every caller for effects of any shared-component change.
- [X] T010 [US3] Check the US3 acceptance criteria for `src/pages/events/index.tsx` and `src/components/3DCard.tsx` with long descriptions/titles, dated and undated events, multi-day ranges, narrow viewports, and keyboard navigation. Verify both panes update together when selecting or clearing a date, empty selections show an empty state, and undated cards have no date row. Verify a filtered card opens the correct article without a mousedown selection reset, outside clicks still clear selection, and hidden mobile cards cannot receive keyboard focus; run lint and build and commit only this change as `feat(events): display events with 3D cards`.

## Phase 6: Polish and completion

- [X] T011 Review the final diff of `src/pages/events/index.tsx`, `src/pages/events/index.css`, and `src/components/3DCard.tsx` for readable code, short comments on logical blocks, no unrelated edits, and no left-column changes after the US1 commit. Correct any issue in its owning change before finalizing its commit.
- [X] T012 Record completed acceptance checks, lint/build outcomes, limitations, and the three implementation commit hashes in `docs/events-pane/tasks.md`; leave any failed check or unfinished requirement explicitly unchecked.

## Dependencies and execution

T001 → T002 → US1 (T003–T004) → US2 (T005–T006) → US3 (T007–T010) → T011 → T012.

No tasks are marked parallel: the stories share the same Events layout files, and the left-column freeze requires sequential verification. Within US1, verify positioning before freezing; within US2, verify the empty pane before adding cards; within US3, validate data mapping and layout together before committing. No parallel agent work is required.

## Implementation strategy

US1 is the smallest independently reviewable increment. The complete requested feature requires all three stories. Deliver each change with its stated conventional commit, matching repository history, and keep unrelated user changes unstaged. Documentation generation alone does not create implementation commits.

Use the repository's existing `npm run lint` and `npm run build` commands plus browser acceptance checks. No new automated test suite is requested; if implementation introduces non-trivial new logic, add a small focused check for that behavior. Do not add frameworks or dependencies for this layout change.

## Execution record

### T001 baseline (pre-change)

- Layout: `.events` is a centered flex column (`mt-8 mb-16 md:mb-32`); `h1` is `mx-8 md:mx-64`, centered, `text-3xl` bold primary. Content wrapper `pt-16 w-full max-w-sm px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6` centered the whole stack (<=384px on mobile, <=896px at `md`).
- Calendar: custom `Calendar.tsx` inside a `max-w-sm` div (<=384px wide), rendered directly above the list.
- Event list: `<section>` (`gap-0 mt-12 flex flex-col justify-start min-h-[200px] max-w-sm pr-0`) at the same width beneath the calendar; `h2` (`pl-4`) reads "All Events" or "Events on <date>"; list div `mt-4 space-y-8 text-sm leading-6 text-gray-500 h-full overflow-auto`; items via `CompactEventList` (title `text-xl` primary bold, muted `<time>` date row, description clamped after half of line 3).
- Date selection: page state `selectedDay`; `displayedEvents` shows all events (start-datetime descending, undated last) or, when a day is selected, only events whose start-end range covers that day.
- Empty state: `<p>No events found.</p>` when a selected day has no events.
- Outside-click clearing: `document` `mousedown` handler clears the selection when the click is outside both `calendarRef` and `resultsRef`; clicking the results section's own background (`target === currentTarget`) also clears.
- Links: compact items link to `/events/${event.link}`.
- Leaked global section rule: `src/pages/home/index.css:1` and `src/pages/about/index.css:1` define an unscoped `section` rule (`flex flex-col md:flex-row items-center justify-center md:justify-around h-[80vh] px-8 md:px-20 gap-8 lg:gap-16`). Page CSS is statically bundled, so it applies on the events page; the current neutralization is the ancestry-dependent `.events>section>div>div>section { h-auto items-stretch pl-0 md:pl-0 }` plus utility classes on the section.
- ThreeDCard: no callers in the codebase (definition only). Renders `WindowCard` (`w-fit`, `rounded-2xl`, outline border, `drop-shadow-window` 8px 8px 0 #365486); card `w-48`, full-width photo (no `alt`), heading `p-4 pt-3` bold, subheading `px-4 -mt-1 text-sm` (always rendered), description `px-4 pb-4 -mt-1 text-sm` clamped to `displayLineCount` lines via `-webkit-box`.
- Data: `articles.json` holds 10 events; `lifehack` has no dates; multi-day ranges exist (e.g. COMaraderie Feb 2-6 2026).
- Baseline checks: `npm run lint` passes; `npm run build` passes (vite 5.0.10, 745 modules).

### US1 (T003-T004) — frozen left column

Changes: `src/pages/events/index.tsx` drops the centered, capped content wrapper for a full-width `.events-layout` section that is also the single outside-click boundary (`layoutRef`); the calendar and compact list move into `.events-left`. `src/pages/events/index.css` replaces `.events>section` and the ancestry-dependent `.events>section>div>div>section` override with two-class scoped rules: `.events .events-layout` (full-width flex row, `px-8 md:px-16`, `gap-8`), `.events .events-left` (sticky, `top-28`, `max-h-[calc(100vh-7rem)]`, `overflow-y-auto`, `max-w-sm`), and `.events .events-results` (leaked global `section` rule neutralization). Calendar/list markup, classes, data mapping, and links are unchanged; `Calendar` keeps its `containerRef` prop.

Browser acceptance (in-app Chromium, viewport 1000x892, dev server):
- Left column: `position: sticky`, `top: 112px` (7rem, clears the ~104px fixed nav), `max-height: 780px` (= 100vh - 7rem), `overflow-y: auto`, width 384px; list pane at the same 384px width, `items-stretch`, zero left/right padding — calendar and list aligned, no horizontal overflow.
- Date selection: selecting Feb 04, 2026 filters the list to exactly COMaraderie with the range label "Feb 02, 2026 – Feb 06, 2026"; a day with no events (Nov 04) shows the "No events found." empty state; no selection shows all 10 events in the existing order.
- Outside-click: `mousedown` on the `h1` (outside the layout) clears the selection back to "All Events" (10 items).
- Results-background click (`target === currentTarget` on `.events-results`) clears the selection.
- Keyboard: a compact event link is reachable via Tab and Enter navigates to `/events/comaraderie`.
- Short viewports: the column caps at `calc(100vh - 7rem)` and scrolls internally, keeping all compact events reachable.
- Sticky pinning distance: with no sibling pane yet the layout section's height equals the column's, so the column can only slide within the h1/footer scroll distance; the pinning behavior is verified against a tall sibling in US3.
- `npm run lint` and `npm run build` pass; no pre-existing failures.

Commit: `fix(events): anchor calendar and event pane to the left` — `47248cf`. This is the frozen left-column baseline; US2/US3 do not change left-column markup, styles, handlers, or data behavior.

### US2 (T005-T006) — right pane

Changes: `src/pages/events/index.tsx` adds an empty labeled sibling pane (`<section class='events-cards' aria-label='Event cards'>`) after the left column, inside the `.events-layout` interaction boundary. `src/pages/events/index.css` adds `.events .events-cards` (`hidden md:block`, `flex-1`, `min-w-0`, `h-fit`, zero padding). Left column untouched.

Browser acceptance (in-app Chromium, viewport 1000x892; 375/768/1440 checked against the generated CSS):
- At >=768px the pane is `display: block` with `flex: 1 1 0%` and `min-width: 0`: at 1000px it measures 441px = all remaining width (985 - 2x64 padding - 384 left - 32 gap), no overlap, no horizontal overflow.
- Generated CSS: base rule `.events .events-cards { display:none; ... }` and `@media (min-width:768px) { display:block }` — so at 375px the pane is display-none (hidden content cannot receive keyboard focus) and appears at 768px.
- Left column compared against the US1 baseline: width 384px, `sticky` at `top: 112px`, `max-height: 780px`, `overflow-y: auto`, same x position — unchanged.
- `mousedown` inside the right pane does not clear the selected date (boundary spans both panes); outside clicks still clear.
- `npm run lint` and `npm run build` pass.

Commit: `feat(events): add right-side event pane` — `b0ba366`.

### US3 (T007-T010) — event cards

Changes: `src/pages/events/index.tsx` populates `.events-cards` from the shared `displayedEvents` collection: each `ThreeDCard` (photo=`imgSrc`, heading=`title`, subheading=`formatEventDate(event)` when dated else `''`, description=`body`, `displayLineCount={3}`) is wrapped in the existing router link `/events/${event.link}` keyed by `event.link`, with a "No events found." empty state. `src/pages/events/index.css` adds `.events .events-cards-grid` (flex wrap, `gap-6`) and a visible `:focus-visible` outline on card links. `src/components/3DCard.tsx` adds `alt={heading}` to the photo and renders the subheading row only when nonempty (no other callers exist; three-line clamping and API unchanged).

Browser acceptance (in-app Chromium, viewport 1000x892):
- No selection: both panes show all 10 events; cards carry the correct photo, alt text (= title), and heading; single-day events show "Aug 07, 2026", multi-day show "Feb 02, 2026 – Feb 06, 2026"; the undated LifeHack card has no subheading row; descriptions clamp at 3 lines (computed `-webkit-line-clamp: 3`, `overflow: hidden`), including the very long FSC/FFC bodies.
- Selecting Feb 04, 2026 filters both panes to exactly COMaraderie; a day with no events (May 04, 2025 and Nov 04, 2026) shows the empty state in both panes.
- Cards wrap in the pane (`flex-wrap`, 24px gap, ~196px cards, 2 per row at 1000px) with no horizontal overflow.
- Mouse: clicking a filtered card opens `/events/comaraderie`; a `mousedown` on the filtered card does not reset the selection first.
- Keyboard: a card link can hold focus and Enter opens the article (`/events/ffc`); while focused it matches `:focus-visible` with a 2px solid `#61afef` outline, 2px offset, 16px radius.
- Left column remains at the frozen US1 baseline (384px, sticky at 112px, 780px cap, internal scroll) and is now pinned at `top: 112px` while the page (2576px tall) scrolls, releasing only at the end of the layout.
- Below `md` the pane is `display: none` (generated CSS verified), so hidden cards cannot receive keyboard focus.
- `npm run lint` and `npm run build` pass.

Commit: `feat(events): display events with 3D cards` — `447a229`.

### Completion (T011-T012)

- T011 review: the full feature diff (`4a016d4..447a229`) over `src/pages/events/index.tsx`, `src/pages/events/index.css`, and `src/components/3DCard.tsx` contains only the planned changes with short comments on each logical block and no unrelated edits. The US2 and US3 commit deltas touch only the right pane (and the shared 3D card), confirming the left column stayed at its frozen US1 baseline.
- Implementation commits: US1 `47248cf` (`fix(events): anchor calendar and event pane to the left`), US2 `b0ba366` (`feat(events): add right-side event pane`), US3 `447a229` (`feat(events): display events with 3D cards`).
- Final checks on the finished code: `npm run lint` passes; `npm run build` passes (vite 5.0.10).
- All acceptance criteria from the confirmed behavior are implemented and checked; no item is left open.

Limitations of the verification environment (not of the implementation):
- Live browser checks ran at one viewport (1000x892, the in-app browser tab size); the 375px/768px/1440px cases were verified against the generated CSS breakpoint rules (`display:none` below `md`, `display:block` at `md`) and the layout math rather than by resizing the tab.
- The in-app browser consumes the Tab key, so tab-order traversal was not walked end to end; keyboard activation was verified with a focused anchor plus a trusted Enter press, and the `:focus-visible` ring was measured on a focused card link.
- The in-app accessibility snapshot omits large subtrees, so acceptance checks used direct DOM and computed-style measurements instead.
- The repository has no test suite and this feature adds no non-trivial logic (the panes share the existing `displayedEvents` collection), so no new automated check was added, per the implementation strategy.

### Post-delivery fix: 3D card description clamp

User report: the card description showed its line-clamp ellipsis but the next line of text was still visible below it, and the bottom gap looked smaller than the side gaps.

Root cause: the clamped element (`.three-d-card-description`) carried `padding-bottom: 16px`. The clamp sizes the content box to exactly `displayLineCount` line-heights (3 x 20px = 60px), but the following line's line box starts at ~61.5px — inside the padding area — and `overflow: hidden` clips at the padding box (76px), so the extra line painted through the bottom padding.

Fix (this commit): removed `pb-4` from `.three-d-card-description` so the clip edge equals the clamped content height, and moved the 16px bottom padding to `.three-d-card` (the card container), keeping the bottom padding equal to the side padding (16px). Verified in the browser: every card's description box is 60px with the first overflowing line at 61.5px (fully clipped), exactly 3 visible lines per card, and a 16px gap from the description to the card bottom. `npm run lint` and `npm run build` pass.

### Follow-up: card width increased 1.5x

`.three-d-card` width changed from `w-48` (192px) to `w-72` (288px), with `max-w-full` so a card shrinks instead of overflowing the pane in the narrow 768-831px range where the right pane is only ~224px wide; `.events .events-cards-grid > a` gets `min-w-0` so the anchor can shrink with the pane. Verified at a 1000px viewport: card content 288px (anchor 292px including the window border, vs 196px before), one card per row, no horizontal overflow, 3-line clamp unchanged. `npm run lint` and `npm run build` pass.

### Follow-up: masonry card flow (no gaps)

User request: remove the gaps between cards — a card should sit flush against the card above it, including filling space left by shorter cards at any window width (masonry).

Change: `src/pages/events/index.css` replaces the `.events .events-cards-grid` flex-wrap layout (24px `gap-6`) with CSS multi-column masonry: `columns: 18rem; column-gap: 0`, and the card anchor rule changes from `min-w-0` (flex shrink) to `display: block; break-inside: avoid` so a card fills its column and stays intact within it. No JavaScript or new dependency; the column count follows the pane width.

Verified at a 1000px viewport: the 441px pane holds one column, all 10 cards stack with 0px vertical gaps (sub-pixel rounding only), cards remain 288px wide, the 3-line clamp is unchanged, and there is no horizontal overflow. Trade-off accepted with the request: CSS multi-column renders column-first visually, while DOM and keyboard tab order are unchanged. `npm run lint` and `npm run build` pass.

### T002 findings

- Header: `<header class='w-full h-20'>` is an in-flow 80px spacer; the inner `.navigation-bar` is `fixed` (`w-full px-8 md:px-20 py-4 bg-white z-50`). Its tallest child is the logo (`h-14 p-2` = 72px), so the fixed bar is about 104px tall. A sticky offset of `7rem` (112px) clears it with an 8px gap; internal scroll cap `max-height: calc(100vh - 7rem)`.
- Interaction boundary: a single `.events-layout` section wrapping both panes replaces the two-ref (`calendarRef` + `resultsRef`) outside-click check; `Calendar` keeps its `containerRef` prop unchanged. Clicking the results background (`target === currentTarget`) still clears.
- The leaked global `section` rule is neutralized with two-class scoped selectors (`.events .events-*`) instead of element ancestry, so later sibling panes cannot alter left-side styling.
