import { describe, expect, it } from 'vitest';
import {
  addDays,
  addMonths,
  compareDates,
  dayOfWeek,
  daysInMonth,
  isValidDate,
  parseISO,
  todayISO,
  toISO,
} from './dateAdapter.js';

describe('dateAdapter', () => {
  describe('when working with ISO dates', () => {
    it('should format dates using zero-padded ISO format', () => {
      expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(toISO(2026, 5, 7)).toBe('2026-05-07');
    });

    it('should parse a valid ISO date', () => {
      expect(parseISO('2026-05-07')).toEqual({
        year: 2026,
        month: 5,
        day: 7,
      });
    });

    it('should reject malformed or impossible ISO dates', () => {
      expect(parseISO('2026/05/07')).toBeNull();
      expect(parseISO('2026-02-31')).toBeNull();
      expect(parseISO('2025-02-29')).toBeNull();
      expect(parseISO('2026-13-01')).toBeNull();
      expect(parseISO('2026-01-00')).toBeNull();
    });
  });

  describe('when validating calendar dates', () => {
    it('should handle regular dates, leap years, and impossible dates', () => {
      expect(isValidDate(2026, 5, 7)).toBe(true);
      expect(isValidDate(2024, 2, 29)).toBe(true);
      expect(isValidDate(2025, 2, 29)).toBe(false);
      expect(isValidDate(2026, 4, 31)).toBe(false);
    });
  });

  describe('when reading month and weekday metadata', () => {
    it('should return the correct number of days for common month lengths', () => {
      expect(daysInMonth(2025, 2)).toBe(28);
      expect(daysInMonth(2024, 2)).toBe(29);
      expect(daysInMonth(2026, 4)).toBe(30);
      expect(daysInMonth(2026, 5)).toBe(31);
    });

    it('should use Sunday as the first weekday index', () => {
      expect(dayOfWeek(2026, 5, 3)).toBe(0);
      expect(dayOfWeek(2026, 5, 2)).toBe(6);
      expect(dayOfWeek(2026, 5, 7)).toBe(4);
    });
  });

  describe('when moving dates', () => {
    it('should move across day, month, and year boundaries', () => {
      expect(addDays('2026-05-07', 1)).toBe('2026-05-08');
      expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
      expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
      expect(addDays('2025-12-31', 1)).toBe('2026-01-01');
    });

    it('should move across months and clamp invalid target days', () => {
      expect(addMonths('2026-05-07', 1)).toBe('2026-06-07');
      expect(addMonths('2025-12-15', 1)).toBe('2026-01-15');
      expect(addMonths('2025-01-31', 1)).toBe('2025-02-28');
      expect(addMonths('2024-01-31', 1)).toBe('2024-02-29');
    });
  });

  describe('when comparing dates', () => {
    it('should compare ISO dates chronologically', () => {
      expect(compareDates('2026-05-07', '2026-05-08')).toBe(-1);
      expect(compareDates('2026-05-08', '2026-05-07')).toBe(1);
      expect(compareDates('2026-05-07', '2026-05-07')).toBe(0);
    });
  });
});