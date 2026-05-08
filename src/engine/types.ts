export type ISODateString = string

export interface DatePickerOptions {
  initialDate?: ISODateString | null
  minDate?: ISODateString | null
  maxDate?: ISODateString | null
  locale?: string
  today?: ISODateString
}

export interface CalendarDay {
  date: ISODateString
  dayOfMonth: number
  monthOffset: -1 | 0 | 1
  isToday: boolean
  isSelected: boolean
  isDisabled: boolean
  isFocused: boolean
  ariaLabel: string
}

export interface DatePickerState {
  viewYear: number
  viewMonth: number
  selectedDate: ISODateString | null
  inputValue: string
  isOpen: boolean
  focusedDate: ISODateString | null
  today: ISODateString
  minDate: ISODateString | null
  maxDate: ISODateString | null
  locale: string
}

export interface DatePickerInstance {
  getState(): Readonly<DatePickerState>
  getCalendarGrid(): CalendarDay[][]
  getMonthLabel(): string
  getWeekdayLabels(): string[]
  canNavigatePrev(): boolean
  canNavigateNext(): boolean
  select(date: ISODateString): void
  clearSelection(): void
  navigateMonth(delta: number): void
  navigateYear(delta: number): void
  setInputValue(displayText: string): void
  open(): void
  close(): void
  handleKeyDown(key: string): void
  syncModelValue(iso: ISODateString | null): void
  subscribe(listener: (state: Readonly<DatePickerState>) => void): () => void
}
