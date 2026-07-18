import { buildAuditReport, isInRange, distinctClaimDates, chunk, filterCategoryReceipts, AuditReceipt } from './audit-report'

let pass = 0
let fail = 0
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (ok) { pass++; console.log(`  ✓ ${name}`) }
  else { fail++; console.log(`  ✗ ${name}\n      기대: ${JSON.stringify(expected)}\n      실제: ${JSON.stringify(actual)}`) }
}

let seq = 0
function r(claim_date: string, group_name: string, category_name: string, amount: number, extra: Partial<AuditReceipt> = {}): AuditReceipt {
  seq += 1
  return {
    id: seq, budget_category_id: 0, amount, receipt_date: claim_date, vendor_name: `가게${seq}`,
    memo: null, submitter_name: '홍길동', payer_name: null,
    claim_date, group_name, category_name, ...extra,
  }
}

// ── 1. 구간 경계 (양끝 포함) ───────────────────────────────
// 감사자료에서 금액이 틀리면 안 된다. 시작·끝 청구일이 포함돼야 하고
// 하루라도 벗어나면 빠져야 한다.
console.log('\n[1] 구간 경계 — 양끝 포함')
{
  check('시작일 포함', isInRange('2026-03-01', '2026-03-01', '2026-05-31'), true)
  check('끝일 포함', isInRange('2026-05-31', '2026-03-01', '2026-05-31'), true)
  check('중간', isInRange('2026-04-15', '2026-03-01', '2026-05-31'), true)
  check('시작 하루 전 → 제외', isInRange('2026-02-28', '2026-03-01', '2026-05-31'), false)
  check('끝 하루 후 → 제외', isInRange('2026-06-01', '2026-03-01', '2026-05-31'), false)
}

// ── 2. 항목별 누적 합계 ────────────────────────────────────
console.log('\n[2] 항목별 누적 합계')
{
  const receipts = [
    r('2026-03-01', '목회', '심방비', 10000),
    r('2026-03-15', '목회', '심방비', 5000),      // 같은 항목 누적
    r('2026-03-15', '목회', '행정물품비', 3000),
    r('2026-04-05', '사역', '찬양팀', 20000),
    r('2026-06-01', '목회', '심방비', 99999),      // 구간 밖 → 빠져야 함
  ]
  const rep = buildAuditReport(receipts, '2026-03-01', '2026-05-31')

  check('총 4건 (구간 밖 1건 제외)', rep.grandCount, 4)
  check('총액 = 38000 (99999 제외)', rep.grandTotal, 38000)

  const 목회 = rep.groups.find(g => g.group_name === '목회')!
  check('목회 합계 = 18000', 목회.total, 18000)
  const 심방 = 목회.categories.find(c => c.category_name === '심방비')!
  check('심방비 누적 = 15000 (2건)', [심방.total, 심방.count], [15000, 2])
}

// ── 3. 그룹 순서 (목회/양육/사역/행사) ─────────────────────
console.log('\n[3] 그룹은 정해진 순서로')
{
  const receipts = [
    r('2026-03-01', '행사', '크리스마스', 1000),
    r('2026-03-01', '목회', '심방비', 1000),
    r('2026-03-01', '사역', '찬양팀', 1000),
    r('2026-03-01', '양육', '리더모임', 1000),
  ]
  const rep = buildAuditReport(receipts, '2026-01-01', '2026-12-31')
  check('순서 = 목회,양육,사역,행사', rep.groups.map(g => g.group_name), ['목회', '양육', '사역', '행사'])
}

// ── 4. 명세 정렬 (청구일 → 그룹 → 항목) ────────────────────
console.log('\n[4] 명세는 청구일 순으로 정렬')
{
  const receipts = [
    r('2026-05-03', '목회', '심방비', 1000),
    r('2026-03-01', '사역', '찬양팀', 2000),
    r('2026-03-01', '목회', '심방비', 3000),
  ]
  const rep = buildAuditReport(receipts, '2026-01-01', '2026-12-31')
  // 3/1 목회 → 3/1 사역 → 5/3 목회
  check('청구일 오름차순', rep.receipts.map(x => x.claim_date), ['2026-03-01', '2026-03-01', '2026-05-03'])
  check('같은 날은 그룹 순서', rep.receipts.slice(0, 2).map(x => x.group_name), ['목회', '사역'])
}

// ── 5. 빈 구간 ─────────────────────────────────────────────
console.log('\n[5] 구간에 아무것도 없으면 0')
{
  const receipts = [r('2026-01-01', '목회', '심방비', 5000)]
  const rep = buildAuditReport(receipts, '2026-06-01', '2026-06-30')
  check('총액 0', rep.grandTotal, 0)
  check('건수 0', rep.grandCount, 0)
  check('그룹 없음', rep.groups.length, 0)
}

// ── 6. 청구일 목록 (드롭다운용) ────────────────────────────
console.log('\n[6] 청구일 목록 — 중복 제거·정렬')
{
  const receipts = [
    { claim_date: '2026-05-03' }, { claim_date: '2026-03-01' },
    { claim_date: '2026-05-03' }, { claim_date: '2026-04-05' },
  ]
  check('중복 빠지고 정렬', distinctClaimDates(receipts), ['2026-03-01', '2026-04-05', '2026-05-03'])
}

// ── 7. 시작=끝 (하루짜리 = 청구일 하나) ────────────────────
console.log('\n[7] 시작=끝이면 그 청구일 하루만')
{
  const receipts = [
    r('2026-03-01', '목회', '심방비', 1000),
    r('2026-03-15', '목회', '심방비', 2000),
  ]
  const rep = buildAuditReport(receipts, '2026-03-01', '2026-03-01')
  check('3/1 하루만 = 1000', rep.grandTotal, 1000)
  check('1건', rep.grandCount, 1)
}

// ── 8. 명세 페이지 분할 (chunk) ────────────────────────────
// 한 장에 다 넣으면 A4 한 장 높이로 압축돼 글자가 안 보인다.
console.log('\n[8] 명세 페이지 분할')
{
  const nums = Array.from({ length: 100 }, (_, i) => i + 1)
  const pages = chunk(nums, 28)
  check('100건 / 28 = 4장', pages.length, 4)
  check('마지막 장은 16건', pages[3].length, 16)
  check('첫 장은 28건', pages[0].length, 28)
  check('쪼개도 총합 보존', pages.flat().length, 100)
  check('딱 나눠떨어지면 나머지 장 없음', chunk(Array(56).fill(0), 28).length, 2)
  check('빈 배열 → 빈 페이지 목록', chunk([], 28).length, 0)
  check('1건 → 1장', chunk([1], 28).length, 1)
}

// ── 9. 항목별 영수증 조회 (filterCategoryReceipts) ─────────
// 예: "소그룹_정연우"(id=10)의 3~5월 청구완료 영수증만.
console.log('\n[9] 항목별 영수증 조회')
{
  const receipts = [
    r('2026-03-01', '양육', '소그룹_정연우', 5000, { budget_category_id: 10 }),
    r('2026-03-15', '양육', '소그룹_정연우', 3000, { budget_category_id: 10 }),
    r('2026-03-01', '양육', '소그룹_김철수', 9999, { budget_category_id: 11 }), // 다른 항목
    r('2026-06-01', '양육', '소그룹_정연우', 7777, { budget_category_id: 10 }), // 구간 밖
  ]
  const res = filterCategoryReceipts(receipts, 10, '2026-03-01', '2026-05-31')
  check('정연우 항목만 = 2건', res.count, 2)
  check('합계 = 8000 (다른 항목·구간 밖 제외)', res.total, 8000)
  check('청구일 오름차순', res.rows.map(x => x.claim_date), ['2026-03-01', '2026-03-15'])
  check('다른 항목 안 섞임', res.rows.every(x => x.budget_category_id === 10), true)

  const empty = filterCategoryReceipts(receipts, 999, '2026-01-01', '2026-12-31')
  check('없는 항목 → 0건', empty.count, 0)
  check('없는 항목 → 합계 0', empty.total, 0)
}

console.log(`\n${'─'.repeat(50)}`)
console.log(`통과 ${pass} / 실패 ${fail}`)
process.exit(fail > 0 ? 1 : 0)
