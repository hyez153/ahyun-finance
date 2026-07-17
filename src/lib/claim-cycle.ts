/**
 * 청구 주기: 매주 토요일 23:59 마감, 다음날(일요일) 청구
 *
 * 배치 식별자는 (year, month, week_no).
 * week_no는 "해당 월의 N번째 토요일"이며, 모든 토요일은 정확히 한 달에만
 * 속하므로 이 조합은 중복도 누락도 없다. 월에 따라 4주 또는 5주가 된다.
 */

const WEEK_LABELS = ['첫째주', '둘째주', '셋째주', '넷째주', '다섯째주']

/** week_no(1~5) → 표시용 라벨 */
export function getWeekLabel(weekNo: number): string {
  return WEEK_LABELS[weekNo - 1] ?? `${weekNo}주차`
}

/** 해당 월의 모든 마감일(토요일 23:59). 월에 따라 4개 또는 5개 */
export function getMonthDeadlines(year: number, month: number): Date[] {
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay()
  const firstSaturday = 1 + ((6 - firstDayOfWeek + 7) % 7)
  const daysInMonth = new Date(year, month, 0).getDate()

  const deadlines: Date[] = []
  for (let day = firstSaturday; day <= daysInMonth; day += 7) {
    deadlines.push(new Date(year, month - 1, day, 23, 59, 59))
  }
  return deadlines
}

/** 청구일(마감 다음날 일요일) */
export function getClaimDate(deadline: Date): Date {
  const sunday = new Date(deadline)
  sunday.setDate(deadline.getDate() + 1)
  sunday.setHours(0, 0, 0, 0)
  return sunday
}

/** 다음 마감일 */
export function getNextDeadline(): Date {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const upcoming = getMonthDeadlines(year, month).find(d => now <= d)
  if (upcoming) return upcoming

  // 이번 달 마감 모두 지남 → 다음 달 첫 주
  const nextMonth = month === 12 ? 1 : month + 1
  const nextYear = month === 12 ? year + 1 : year
  return getMonthDeadlines(nextYear, nextMonth)[0]
}

/** 다음 청구일(마감 다음날 일요일) */
export function getNextClaimDate(): Date {
  return getClaimDate(getNextDeadline())
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
  return '매주 토요일 23:59 마감 · 다음날 일요일 청구'
}
