import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원'
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getSecondWeekSaturday(year: number, month: number): Date {
  const firstDay = new Date(year, month - 1, 1)
  const firstDayOfWeek = firstDay.getDay()
  const firstSaturday = 1 + ((6 - firstDayOfWeek + 7) % 7)
  const secondSaturday = firstSaturday + 7
  return new Date(year, month - 1, secondSaturday, 23, 59, 59)
}

export function getSecondWeekSunday(year: number, month: number): Date {
  const saturday = getSecondWeekSaturday(year, month)
  const sunday = new Date(saturday)
  sunday.setDate(saturday.getDate() + 1)
  sunday.setHours(0, 0, 0, 0)
  return sunday
}

export function getUsageRate(used: number, budget: number): number {
  if (budget === 0) return used > 0 ? 100 : 0
  return Math.round((used / budget) * 100)
}
