import type { ISODateString, CalendarDay, CalendarGridOptions } from './types.js'
import { dayOfWeek, daysInMonth, toISO, compareDates, formatLongDate } from './dateAdapter.js'

const DAYS_IN_WEEK = 7
const WEEKS_IN_GRID = 6
const CELLS_IN_GRID = DAYS_IN_WEEK * WEEKS_IN_GRID

type CellContext = Pick<
  CalendarGridOptions,
  'today' | 'selectedDate' | 'focusedDate' | 'minDate' | 'maxDate'
> & { formatter: Intl.DateTimeFormat }

export function buildCalendarGrid(options: CalendarGridOptions): CalendarDay[][] {
  const {
    viewYear,
    viewMonth,
    today,
    selectedDate,
    focusedDate,
    minDate,
    maxDate,
    locale,
  } = options

  const firstDow = dayOfWeek(viewYear, viewMonth, 1)
  const currentDays = daysInMonth(viewYear, viewMonth)

  const prevMonth = viewMonth === 1 ? 12 : viewMonth - 1
  const prevYear = viewMonth === 1 ? viewYear - 1 : viewYear
  const prevMonthDays = daysInMonth(prevYear, prevMonth)

  const nextMonth = viewMonth === 12 ? 1 : viewMonth + 1
  const nextYear = viewMonth === 12 ? viewYear + 1 : viewYear

  const formatter = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const context: CellContext = { today, selectedDate, focusedDate, minDate, maxDate, formatter }
  const cells: CalendarDay[] = []

  for (let i = firstDow - 1; i >= 0; i--) {
    const day = prevMonthDays - i
    cells.push(makeCell(toISO(prevYear, prevMonth, day), day, -1, context))
  }

  for (let day = 1; day <= currentDays; day++) {
    cells.push(makeCell(toISO(viewYear, viewMonth, day), day, 0, context))
  }

  let nextDay = 1
  while (cells.length < CELLS_IN_GRID) {
    cells.push(makeCell(toISO(nextYear, nextMonth, nextDay), nextDay, 1, context))
    nextDay++
  }

  const rows: CalendarDay[][] = []
  for (let week = 0; week < WEEKS_IN_GRID; week++) {
    rows.push(cells.slice(week * DAYS_IN_WEEK, week * DAYS_IN_WEEK + DAYS_IN_WEEK))
  }
  return rows
}

function isDateOutsideRange(
  date: ISODateString,
  minDate: ISODateString | null,
  maxDate: ISODateString | null,
): boolean {
  return (
    (minDate !== null && compareDates(date, minDate) < 0) ||
    (maxDate !== null && compareDates(date, maxDate) > 0)
  )
}

function makeCell(
  date: ISODateString,
  dayOfMonth: number,
  monthOffset: -1 | 0 | 1,
  context: CellContext,
): CalendarDay {
  const { today, selectedDate, focusedDate, minDate, maxDate, formatter } = context

  return {
    date,
    dayOfMonth,
    monthOffset,
    isToday: date === today,
    isSelected: date === selectedDate,
    isFocused: date === focusedDate,
    isDisabled: isDateOutsideRange(date, minDate, maxDate),
    ariaLabel: formatLongDate(date, formatter),
  }
}
