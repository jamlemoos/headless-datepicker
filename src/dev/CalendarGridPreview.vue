<script setup lang="ts">
import { computed, ref } from 'vue'
import { buildCalendarGrid } from '../engine/index.js'
import { addMonths } from '../engine/index.js'

const TODAY = '2026-05-07'
const SELECTED = '2026-05-15'
const FOCUSED = '2026-05-20'
const MIN_DATE = '2026-05-03'
const MAX_DATE = '2026-05-28'

const viewISO = ref('2026-05-01')

const viewYear = computed(() => Number(viewISO.value.slice(0, 4)))
const viewMonth = computed(() => Number(viewISO.value.slice(5, 7)))

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const monthLabel = computed(() => `${MONTH_NAMES[viewMonth.value - 1]} ${viewYear.value}`)

const rows = computed(() =>
  buildCalendarGrid({
    viewYear: viewYear.value,
    viewMonth: viewMonth.value,
    today: TODAY,
    selectedDate: SELECTED,
    focusedDate: FOCUSED,
    minDate: MIN_DATE,
    maxDate: MAX_DATE,
    locale: 'en-US',
  })
)

function prev() {
  viewISO.value = addMonths(viewISO.value, -1)
}

function next() {
  viewISO.value = addMonths(viewISO.value, 1)
}
</script>

<template>
  <section class="cgp">
    <p class="cgp__badge">DEV PREVIEW — CalendarGridPreview</p>

    <div class="cgp__legend">
      <span class="cgp__dot cgp__dot--today" /> today ({{ TODAY }})
      <span class="cgp__dot cgp__dot--selected" /> selected ({{ SELECTED }})
      <span class="cgp__dot cgp__dot--focused" /> focused ({{ FOCUSED }})
      <span class="cgp__dot cgp__dot--disabled" /> disabled (min {{ MIN_DATE }} / max {{ MAX_DATE }})
      <span class="cgp__dot cgp__dot--outside" /> outside month
    </div>

    <div class="cgp__header">
      <button class="cgp__nav" @click="prev">‹</button>
      <span class="cgp__month-label">{{ monthLabel }}</span>
      <button class="cgp__nav" @click="next">›</button>
    </div>

    <div class="cgp__grid" role="grid" :aria-label="monthLabel">
      <div class="cgp__weekdays" role="row">
        <span v-for="wd in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="wd" class="cgp__weekday" role="columnheader">{{ wd }}</span>
      </div>
      <div v-for="(row, ri) in rows" :key="ri" class="cgp__row" role="row">
        <button
          v-for="cell in row"
          :key="cell.date"
          class="cgp__cell"
          :class="{
            'cgp__cell--outside':  cell.monthOffset !== 0,
            'cgp__cell--today':    cell.isToday,
            'cgp__cell--selected': cell.isSelected,
            'cgp__cell--focused':  cell.isFocused,
            'cgp__cell--disabled': cell.isDisabled,
          }"
          :aria-label="cell.ariaLabel"
          :aria-pressed="cell.isSelected"
          :aria-disabled="cell.isDisabled"
          :disabled="cell.isDisabled"
          type="button"
        >
          {{ cell.dayOfMonth }}
        </button>
      </div>
    </div>

    <details class="cgp__debug">
      <summary>Raw grid data (row 1)</summary>
      <pre>{{ JSON.stringify(rows[0], null, 2) }}</pre>
    </details>
  </section>
</template>

<style scoped>
.cgp {
  display: inline-block;
  border: 2px dashed #f59e0b;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
  font-family: system-ui, sans-serif;
  font-size: 14px;
}

.cgp__badge {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #92400e;
  background: #fef3c7;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 14px;
  display: inline-block;
}

.cgp__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
  font-size: 12px;
  color: #6b7280;
}

.cgp__dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 4px;
}
.cgp__dot--today    { background: #f59e0b; }
.cgp__dot--selected { background: #3b82f6; }
.cgp__dot--focused  { background: #8b5cf6; outline: 2px solid #8b5cf6; }
.cgp__dot--disabled { background: #e5e7eb; }
.cgp__dot--outside  { background: #e5e7eb; opacity: 0.5; }

.cgp__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.cgp__nav {
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 2px 10px;
  cursor: pointer;
  font-size: 18px;
  line-height: 1.4;
  color: #374151;
}
.cgp__nav:hover { background: #f3f4f6; }

.cgp__month-label {
  font-weight: 600;
  color: #111827;
}

.cgp__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 36px);
  margin-bottom: 4px;
}

.cgp__weekday {
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  padding: 4px 0;
}

.cgp__row {
  display: grid;
  grid-template-columns: repeat(7, 36px);
}

.cgp__cell {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 13px;
  color: #374151;
  transition: background 0.1s;
}
.cgp__cell:hover:not(:disabled) { background: #f3f4f6; }

.cgp__cell--outside  { color: #d1d5db; }
.cgp__cell--today    { background: #fef3c7; color: #92400e; font-weight: 700; }
.cgp__cell--selected { background: #3b82f6; color: #fff; font-weight: 700; }
.cgp__cell--focused  { outline: 2px solid #8b5cf6; outline-offset: -2px; }
.cgp__cell--disabled { color: #d1d5db; cursor: not-allowed; }

.cgp__cell--selected.cgp__cell--today { background: #3b82f6; color: #fff; }

.cgp__debug {
  margin-top: 16px;
  font-size: 11px;
  color: #6b7280;
}

.cgp__debug summary {
  cursor: pointer;
  user-select: none;
  margin-bottom: 8px;
}

.cgp__debug pre {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px;
  overflow: auto;
  max-height: 200px;
  font-size: 10px;
}
</style>
