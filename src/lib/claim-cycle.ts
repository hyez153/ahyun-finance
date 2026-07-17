/**
 * 청구 주기: 매주 토요일 22:00 마감, 다음날(일요일) 청구
 *
 * 토요일 22:00~24:00은 회계가 청구를 정리하는 시간이라 영수증 등록이 막힌다.
 * 그래서 실질 마감이 22:00이고, 일요일 0시부터 다음 주 접수가 열린다.
 *
 * 배치 식별자는 (year, month, week_no).
 * week_no는 "해당 월의 N번째 토요일"이며, 모든 토요일은 정확히 한 달에만
 * 속하므로 이 조합은 중복도 누락도 없다. 월에 따라 4주 또는 5주가 된다.
 *
 * ※ 이 파일의 시각 판단은 모두 기기의 시간대를 따른다(브라우저 = 사용자 폰).
 *   폰 시계가 틀리거나 시간대가 다르면 어긋날 수 있으므로, 진짜 차단은
 *   DB 트리거(reject_upload_during_blackout)가 서버 시계(KST)로 한다.
 *   여기 있는 건 어디까지나 화면 안내용이다.
 */

const WEEK_LABELS = ['첫째주', '둘째주', '셋째주', '넷째주', '다섯째주']

/** 토요일 마감 시각 (24시간제) */
export const DEADLINE_HOUR = 22

/** 토요일 요일 번호 (0=일요일) */
const SATURDAY = 6

/** week_no(1~5) → 표시용 라벨 */
export function getWeekLabel(weekNo: number): string {
  return WEEK_LABELS[weekNo - 1] ?? `${weekNo}주차`
}

/** 해당 월의 모든 마감일(토요일 22:00). 월에 따라 4개 또는 5개 */
export function getMonthDeadlines(year: number, month: number): Date[] {
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay()
  const firstSaturday = 1 + ((SATURDAY - firstDayOfWeek + 7) % 7)
  const daysInMonth = new Date(year, month, 0).getDate()

  const deadlines: Date[] = []
  for (let day = firstSaturday; day <= daysInMonth; day += 7) {
    deadlines.push(new Date(year, month - 1, day, DEADLINE_HOUR, 0, 0))
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
  return `현재 청구 마감: ${month}월 ${day}일 (토) ${DEADLINE_HOUR}:00`
}

/** 청구 주기 설명 */
export function getCycleDescription(): string {
  return `매주 토요일 ${DEADLINE_HOUR}:00 마감 · 다음날 일요일 청구`
}

/**
 * 지금이 업로드 차단 시간대인가 (토요일 22:00 ~ 24:00).
 *
 * 이 시간에 회계가 청구 배치를 만든다. 정리 중에 영수증이 새로 들어오면
 * 배치에 들어갈지 말지가 애매해지므로 아예 접수를 닫는다.
 *
 * 화면 안내용 판단이다. 진짜 차단은 DB 트리거가 서버 시계로 한다.
 */
export function isUploadBlocked(now: Date = new Date()): boolean {
  return now.getDay() === SATURDAY && now.getHours() >= DEADLINE_HOUR
}

/** 차단이 풀리는 시각 (다음 일요일 0시). 차단 중이 아닐 때 부르면 의미 없다. */
export function getUploadReopenAt(now: Date = new Date()): Date {
  const sunday = new Date(now)
  sunday.setDate(now.getDate() + 1)
  sunday.setHours(0, 0, 0, 0)
  return sunday
}

/** 차단 배너에 띄울 안내 문구 */
export function getUploadBlockedMessage(): string {
  return `토요일 ${DEADLINE_HOUR}:00 ~ 24:00은 청구 정리 시간입니다`
}
