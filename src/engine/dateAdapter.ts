import type { ISODateString } from './types.js'

export function todayISO(): ISODateString {
  const d = new Date()
  return toISO(d.getFullYear(), d.getMonth() + 1, d.getDate())
}

export function parseISO(iso: string): { year: number; month: number; day: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number]
  if (!isValidDate(y, m, d)) return null
  return { year: y, month: m, day: d }
}

export function toISO(year: number, month: number, day: number): ISODateString {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function isValidDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1) return false
  const d = new Date(year, month - 1, day)
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

export function dayOfWeek(year: number, month: number, day: number): number {
  return new Date(year, month - 1, day).getDay()
}

export function addDays(iso: ISODateString, delta: number): ISODateString {
  const p = parseISO(iso)
  if (!p) return iso
  const d = new Date(p.year, p.month - 1, p.day + delta)
  return toISO(d.getFullYear(), d.getMonth() + 1, d.getDate())
}

export function addMonths(iso: ISODateString, delta: number): ISODateString {
  const p = parseISO(iso)
  if (!p) return iso
  let year = p.year
  let month = p.month + delta
  while (month > 12) { month -= 12; year++ }
  while (month < 1) { month += 12; year-- }
  const day = Math.min(p.day, daysInMonth(year, month))
  return toISO(year, month, day)
}

export function compareDates(a: ISODateString, b: ISODateString): -1 | 0 | 1 {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}
