import { describe, it, expect } from 'vitest'
import { buildCalendarGrid } from './calendar.js'
import type { CalendarGridOptions } from './types.js'

const BASE: CalendarGridOptions = {
  viewYear: 2026,
  viewMonth: 5,
  today: '2026-05-07',
  selectedDate: null,
  focusedDate: null,
  minDate: null,
  maxDate: null,
  locale: 'en-US',
}

describe('buildCalendarGrid', () => {
  describe('when building the grid structure', () => {
    it('should always return 6 rows of 7 cells totalling 42', () => {
      const rows = buildCalendarGrid(BASE)
      expect(rows).toHaveLength(6)
      expect(rows.every(r => r.length === 7)).toBe(true)
      expect(rows.flat()).toHaveLength(42)
    })
  })

  describe('when the month has leading and trailing days', () => {
    it('should fill leading days from the previous month', () => {
      const cells = buildCalendarGrid(BASE).flat()
      const leading = cells.filter(c => c.monthOffset === -1)
      expect(leading).toHaveLength(5)
      expect(leading[0].date).toBe('2026-04-26')
      expect(leading[4].date).toBe('2026-04-30')
    })

    it('should fill trailing days from the next month', () => {
      const cells = buildCalendarGrid(BASE).flat()
      const trailing = cells.filter(c => c.monthOffset === 1)
      expect(trailing).toHaveLength(6)
      expect(trailing[0].date).toBe('2026-06-01')
      expect(trailing[5].date).toBe('2026-06-06')
    })

    it('should mark all 31 current-month days with monthOffset 0', () => {
      const cells = buildCalendarGrid(BASE).flat()
      const current = cells.filter(c => c.monthOffset === 0)
      expect(current).toHaveLength(31)
      expect(current[0].date).toBe('2026-05-01')
      expect(current[30].date).toBe('2026-05-31')
    })
  })

  describe('when a month starts on Sunday', () => {
    it('should have no leading days', () => {
      const cells = buildCalendarGrid({ ...BASE, viewYear: 2026, viewMonth: 2, today: '2026-02-15' }).flat()
      expect(cells.filter(c => c.monthOffset === -1)).toHaveLength(0)
      expect(cells[0].date).toBe('2026-02-01')
    })
  })

  describe('when a month starts on Saturday', () => {
    it('should have 6 leading days', () => {
      const cells = buildCalendarGrid({ ...BASE, viewYear: 2026, viewMonth: 8, today: '2026-08-01' }).flat()
      const leading = cells.filter(c => c.monthOffset === -1)
      expect(leading).toHaveLength(6)
      expect(leading[0].date).toBe('2026-07-26')
    })
  })

  describe('when marking today, selected, and focused dates', () => {
    it('should mark exactly the matching cells', () => {
      const cells = buildCalendarGrid({
        ...BASE,
        today: '2026-05-07',
        selectedDate: '2026-05-15',
        focusedDate: '2026-05-20',
      }).flat()

      expect(cells.find(c => c.date === '2026-05-07')?.isToday).toBe(true)
      expect(cells.find(c => c.date === '2026-05-15')?.isSelected).toBe(true)
      expect(cells.find(c => c.date === '2026-05-20')?.isFocused).toBe(true)

      expect(cells.find(c => c.date === '2026-05-01')?.isToday).toBe(false)
      expect(cells.find(c => c.date === '2026-05-01')?.isSelected).toBe(false)
      expect(cells.find(c => c.date === '2026-05-01')?.isFocused).toBe(false)
    })
  })

  describe('when min and max dates are set', () => {
    it('should disable dates outside the range including outside-month days', () => {
      const cells = buildCalendarGrid({
        ...BASE,
        minDate: '2026-05-05',
        maxDate: '2026-05-25',
      }).flat()

      expect(cells.find(c => c.date === '2026-05-04')?.isDisabled).toBe(true)
      expect(cells.find(c => c.date === '2026-05-05')?.isDisabled).toBe(false)
      expect(cells.find(c => c.date === '2026-05-25')?.isDisabled).toBe(false)
      expect(cells.find(c => c.date === '2026-05-26')?.isDisabled).toBe(true)
      expect(cells.find(c => c.date === '2026-04-30')?.isDisabled).toBe(true)
    })
  })

  describe('when viewing February in a leap year', () => {
    it('should include 29 current-month days', () => {
      const cells = buildCalendarGrid({ ...BASE, viewYear: 2024, viewMonth: 2, today: '2024-02-01' }).flat()
      const current = cells.filter(c => c.monthOffset === 0)
      expect(current).toHaveLength(29)
      expect(current[28].date).toBe('2024-02-29')
    })
  })

  describe('when viewing December', () => {
    it('should use January of the next year for trailing days', () => {
      const cells = buildCalendarGrid({ ...BASE, viewYear: 2025, viewMonth: 12, today: '2025-12-01' }).flat()
      const trailing = cells.filter(c => c.monthOffset === 1)
      expect(trailing[0].date).toBe('2026-01-01')
    })
  })

  describe('when reading cell metadata', () => {
    it('should include a non-empty aria label for every cell', () => {
      const cells = buildCalendarGrid(BASE).flat()
      expect(cells.every(c => c.ariaLabel.length > 0)).toBe(true)
    })
  })
})
