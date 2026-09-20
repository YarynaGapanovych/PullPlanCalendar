# Pull Plan Calendar – Gaps vs Eventra

Catalog of product gaps between this library and Eventra’s calendar needs. Each item has an **Ease** rating: Easy / Medium / Hard.

**Status legend:** Done = shipped in this package; Open = still a gap.

## Time grid and interaction

| Gap | Ease | Status | Why |
|-----|------|--------|-----|
| **Timed week view.** Week is day-columns with horizontal bars, not a 24-hour grid. | Hard | Open | Needs a full timed grid rewrite like DayView. |
| **Drag/resize that keeps clock time.** Week snaps to days; Day has no timed DnD. | Hard | Open | Week overwrites to day boundaries; Day has no timed move/resize yet. |
| **Click a timeslot to create.** | Medium | Done | Hour / grid click seeds create modal with timed range. |
| **Drop an unscheduled task onto a time.** | Medium | Done | Day drop uses Y + 15-min snap + `defaultDurationMinutes`. |
| **Overlapping timed events.** No columns/lanes. | Hard | Open | Column packing is new layout math. |
| **Now line and scroll-to-now in week view.** Day has now line + scroll-to-now. | Easy (day) / Hard (week) | Day done / week open | Week needs timed layout first. |
| **Workday window.** | Medium | Done | `workdayStart` / `workdayEnd` / `showFullDay` crop or dim DayView. |

## Navigation and controlled state

| Gap | Ease | Status | Why |
|-----|------|--------|-----|
| **Working view / date / events props.** | Easy | Done | Controlled + uncontrolled wired on Calendar. |
| **Day view opens on today.** | Easy | Done | Default focused date is now. |
| **Today button and stable date on refetch.** | Easy | Done | Today control + controlled `date`/`events`. |
| **Month/year year navigation.** | Medium / Easy | Done | Month wraps Dec↔Jan across years; Year grid keys off `currentYear`. |
| **Configurable week start.** | Medium | Done | `weekStartsOn` (0–6) on Calendar; dayjs locale + month/year headers/grids. |

## Event model the library does not carry

| Gap | Ease | Status | Why |
|-----|------|--------|-----|
| **`allDay` flag.** | Hard | Open | Still inferred from full-day span. |
| **Timezone.** | Hard | Open | No TZ on events or grid. |
| **Recurrence on the grid.** | Hard | Open | Single `{start, end}` bar only. |
| **Create payload beyond title + dates.** | Medium | Open | Default modal is still name + datetimes (`meta`/`color` allowed on type). |
| **Event color that actually paints.** | Easy | Done | Chips use `event.color` background. |
| **Times on the event chip.** | Easy | Done | Timed chips show start–end label. |

## Create / detail UI

| Gap | Ease | Status | Why |
|-----|------|--------|-----|
| **Event-shaped create/detail, not Task.** | Easy (copy) / Medium (full form) | Copy done | Default strings say Event; rich fields later. |
| **Custom detail modal in month/year.** | Easy | Done | `EventDetailModal` passed through Month/Year/`Week`. |
| **Persist create from month/year.** | Easy | Done | `onSubmit` + seeded dates. |
| **Slot for a single Add Event control.** | Easy | Done | Default `+` in month/year when slot omitted. |
| **Editable unscheduled-list copy.** | Easy | Done | `labels.unscheduledTitle` / `unscheduledHint`. |

## Eventra product features the grid does not know about

| Gap | Ease | Status | Why |
|-----|------|--------|-----|
| **Google vs Eventra vs task-block layers.** | Hard | Open | New product surface. |
| **Busy / overlap while dragging.** | Hard | Open | Outside current DnD. |
| **Settings: default duration, timezone, hide past done.** | Hard | Open | Duration prop exists for day create/drop; full settings contract not coupled. |
| **Reminders / guests / Meet on the surface.** | Hard | Open | Only in consumer modals. |
| **Dark mode / theme tokens.** | Hard | Open | Light hardcoded styles. |

## Smaller but real

| Gap | Ease | Status | Why |
|-----|------|--------|-----|
| **“+N more” per day in month view.** | Medium | Done | Per-day cap (`maxEventsPerDay`) + popover; no week-level overflow. |
| **Clicking “go to week” opens create.** | Easy | Done | → navigates only. |
| **Keyboard / a11y for time-grid DnD.** | Medium+ | Open | Slot-create has basic keyboard on hour labels; move/resize a11y still open. |
| **Live updates without remount.** | Easy | Done | Controlled `events`. |

---

## Shipped batches

### Easy wins
1. Controlled `view` / `date` / `events` (+ defaults).
2. Day view opens on today.
3. Persist create from month/year; go-to-week without create; `EventDetailModal` in month/year.
4. Paint `event.color` and show times on chips.
5. Today button + day scroll-to-now.
6. Unscheduled labels; default Add in month/year; Event copy; YearView `currentYear` grid.

### Navigation / month batch
1. `weekStartsOn` (Monday-start etc.).
2. Month year-wrap (`MMMM YYYY`).
3. Per-day `+N more` popover (`maxEventsPerDay`).

### Day time-grid batch
1. Click hour / timeslot to create (datetime-local modal + `defaultDurationMinutes`).
2. Drop unscheduled onto a clock time (15-min snap).
3. Workday window (`workdayStart` / `workdayEnd` / `showFullDay`).

### Still deferred (Hard / remaining Medium)

Timed week hour grid; clock-preserving week/day drag/resize; overlap columns; week now-line; `allDay` / TZ / RRULE; rich create payload; source layers; busy prompt; full settings coupling; reminders/Meet on surface; theme tokens; full time-grid a11y.
