import {
  getMonthDeadlines,
  getClaimDate,
  getWeekLabel,
  isUploadBlocked,
  getUploadReopenAt,
  DEADLINE_HOUR,
} from './claim-cycle'

let pass = 0
let fail = 0

function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (ok) {
    pass++
    console.log(`  ✓ ${name}`)
  } else {
    fail++
    console.log(`  ✗ ${name}\n      기대: ${JSON.stringify(expected)}\n      실제: ${JSON.stringify(actual)}`)
  }
}

/** 로컬 시간 기준으로 읽기 쉬운 문자열로 (Date 비교를 눈에 보이게) */
function fmt(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

const SAT = 6
const SUN = 0

// ── 1. 마감일은 그 달의 모든 토요일 22:00 ──────────────────
console.log('\n[1] 마감일 = 그 달의 모든 토요일 22:00')
{
  // 2026년 7월 토요일: 4, 11, 18, 25
  const d = getMonthDeadlines(2026, 7)
  check('7월 마감 4개', d.length, 4)
  check('전부 토요일', d.every(x => x.getDay() === SAT), true)
  check(`전부 ${DEADLINE_HOUR}:00`, d.every(x => x.getHours() === DEADLINE_HOUR && x.getMinutes() === 0), true)
  check('첫 마감 = 7/4 22:00', fmt(d[0]), '2026-07-04 22:00')
  check('마지막 마감 = 7/25 22:00', fmt(d[3]), '2026-07-25 22:00')
}

// ── 2. 5주짜리 달 ──────────────────────────────────────────
console.log('\n[2] 토요일이 5번인 달도 다 잡는다')
{
  // 2026년 1월 토요일: 3, 10, 17, 24, 31
  const d = getMonthDeadlines(2026, 1)
  check('1월 마감 5개', d.length, 5)
  check('마지막 = 1/31 22:00', fmt(d[4]), '2026-01-31 22:00')
}

// ── 3. 청구일은 마감 다음날 일요일 0시 ─────────────────────
console.log('\n[3] 청구일 = 마감 다음날 일요일 0시')
{
  const deadline = new Date(2026, 6, 18, DEADLINE_HOUR, 0, 0) // 토
  const claim = getClaimDate(deadline)
  check('7/18(토) 마감 → 7/19 00:00', fmt(claim), '2026-07-19 00:00')
  check('일요일이다', claim.getDay(), SUN)
}

// ── 4. 달을 넘어가는 청구일 ────────────────────────────────
console.log('\n[4] 달을 넘어가도 청구일이 맞다')
{
  const deadline = new Date(2026, 0, 31, DEADLINE_HOUR, 0, 0) // 1/31 토
  const claim = getClaimDate(deadline)
  check('1/31(토) 마감 → 2/1 00:00', fmt(claim), '2026-02-01 00:00')
  check('일요일이다', claim.getDay(), SUN)
}

// ── 5. 업로드 차단: 토요일 22:00 ~ 24:00 ───────────────────
// 이게 이번 변경의 핵심이다. 경계에서 틀리면 사람들이 못 올리거나
// 정리 중에 영수증이 새로 들어온다.
console.log('\n[5] 업로드 차단 시간대 (토 22:00~24:00)')
{
  const sat = (h: number, m = 0) => new Date(2026, 6, 18, h, m, 0) // 7/18 토
  check('토 21:59 → 안 막힘', isUploadBlocked(sat(21, 59)), false)
  check('토 22:00 정각 → 막힘', isUploadBlocked(sat(22, 0)), true)
  check('토 22:01 → 막힘', isUploadBlocked(sat(22, 1)), true)
  check('토 23:59 → 막힘', isUploadBlocked(sat(23, 59)), true)
  check('토 00:00 (새벽) → 안 막힘', isUploadBlocked(sat(0, 0)), false)
  check('토 12:00 (낮) → 안 막힘', isUploadBlocked(sat(12, 0)), false)
}

// ── 6. 다른 요일은 22시가 넘어도 안 막힌다 ─────────────────
console.log('\n[6] 토요일이 아니면 22시가 넘어도 안 막힌다')
{
  check('일 22:30 → 안 막힘', isUploadBlocked(new Date(2026, 6, 19, 22, 30)), false)
  check('금 23:00 → 안 막힘', isUploadBlocked(new Date(2026, 6, 17, 23, 0)), false)
  check('수 22:00 → 안 막힘', isUploadBlocked(new Date(2026, 6, 15, 22, 0)), false)
}

// ── 7. 차단이 풀리는 시각 = 일요일 0시 ─────────────────────
console.log('\n[7] 차단은 일요일 0시에 풀린다')
{
  const at = getUploadReopenAt(new Date(2026, 6, 18, 22, 30)) // 토 22:30
  check('토 22:30 → 7/19 00:00에 풀림', fmt(at), '2026-07-19 00:00')
  check('일요일이다', at.getDay(), SUN)
  check('그 시각엔 안 막힘', isUploadBlocked(at), false)
}

// ── 8. 달을 넘어가는 차단 해제 ─────────────────────────────
console.log('\n[8] 달을 넘어가도 해제 시각이 맞다')
{
  const at = getUploadReopenAt(new Date(2026, 0, 31, 23, 0)) // 1/31 토 23:00
  check('1/31 23:00 → 2/1 00:00에 풀림', fmt(at), '2026-02-01 00:00')
}

// ── 9. 주차 라벨 ───────────────────────────────────────────
console.log('\n[9] 주차 라벨')
{
  check('1 → 첫째주', getWeekLabel(1), '첫째주')
  check('5 → 다섯째주', getWeekLabel(5), '다섯째주')
  check('범위 밖은 숫자로', getWeekLabel(9), '9주차')
}

console.log(`\n${'─'.repeat(50)}`)
console.log(`통과 ${pass} / 실패 ${fail}`)
process.exit(fail > 0 ? 1 : 0)
