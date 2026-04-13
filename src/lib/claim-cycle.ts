/**
 * 청구 주기: 매월 첫째주 토요일 / 셋째주 토요일 마감
 * 마감 다음날(일요일) 청구
 */

/** N번째 토요일 구하기 (nth: 1 = 첫째, 2 = 둘째, 3 = 셋째 ...) */
function getNthSaturday(year: number, month: number, nth: number): Date {
  const firstDay = new Date(year, month - 1, 1)
  const firstDayOfWeek = firstDay.getDay()
  const firstSaturday = 1 + ((6 - firstDayOfWeek + 7) % 7)
  const target = firstSaturday + (nth - 1) * 7
  return new Date(year, month - 1, target, 23, 59, 59)
}

/** 해당 월의 두 마감일(첫째주 토요일, 셋째주 토요일) */
export function getMonthDeadlines(year: number, month: number): [Date, Date] {
  return [
    getNthSaturday(year, month, 1),
    getNthSaturday(year, month, 3),
  ]
}

/** 다음 마감일 */
export function getNextDeadline(): Date {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const [first, third] = getMonthDeadlines(year, month)

  if (now <= first) return first
  if (now <= third) return third

  // 이번 달 두 마감 모두 지남 → 다음 달 첫째주
  const nextMonth = month === 12 ? 1 : month + 1
  const nextYear = month === 12 ? year + 1 : year
  return getMonthDeadlines(nextYear, nextMonth)[0]
}

/** 다음 청구일(마감 다음날 일요일) */
export function getNextClaimDate(): Date {
  const deadline = getNextDeadline()
  const sunday = new Date(deadline)
  sunday.setDate(deadline.getDate() + 1)
  sunday.setHours(0, 0, 0, 0)
  return sunday
}

/** 현재 주기 라벨 */
export function getCurrentCycleLabel(): string {
  const deadline = getNextDeadline()
  const month = deadline.getMonth() + 1
  const day = deadline.getDate()
  return `현재 청구 마감: ${month}월 ${day}일 (토)`
}

/** 청구 주기 설명 */
export function getCycleDescription(): string {
  return '매월 첫째주·셋째주 토요일 23:59 마감 · 다음날 일요일 청구'
}
