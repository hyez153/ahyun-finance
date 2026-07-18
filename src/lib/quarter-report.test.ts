import { buildQuarterReport, quarterOptions, txnInRange, QuarterCategory, QuarterTxn } from './quarter-report'

let pass = 0, fail = 0
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (ok) { pass++; console.log(`  ✓ ${name}`) }
  else { fail++; console.log(`  ✗ ${name}\n      기대: ${JSON.stringify(expected)}\n      실제: ${JSON.stringify(actual)}`) }
}

// ── 1. 목회 항목 — 사용자 1분기 예시 그대로 재현 ────────────
// 감사 보고서라 비율(A/B, A/C)이 소수점까지 정확해야 한다.
console.log('\n[1] 목회 1분기 — 예시 숫자·비율 재현')
{
  const cats: QuarterCategory[] = [
    { id: 1, group_name: '목회', category_name: '예배준비비', annual_budget: 1200000 },
    { id: 2, group_name: '목회', category_name: '심방비', annual_budget: 4800000 },
    { id: 3, group_name: '목회', category_name: '목회지원비', annual_budget: 1500000 },
    { id: 4, group_name: '목회', category_name: '행정물품비', annual_budget: 1700000 },
  ]
  const txns: QuarterTxn[] = [
    { budget_category_id: 1, amount: 846320 },
    { budget_category_id: 2, amount: 1104480 },
    { budget_category_id: 3, amount: 290300 },
    { budget_category_id: 4, amount: 381590 },
  ]
  const rep = buildQuarterReport(cats, txns, 1) // 1분기
  const 목회 = rep.groups.find(g => g.group_name === '목회')!

  // 그룹 집행 = 세부 항목 합. (이 시험의 세부 4개 합 = 2,622,690)
  check('목회 집행 = 세부 합 2,622,690', 목회.used, 2622690)
  check('목회 예산 = 9,200,000', 목회.budget, 9200000)
  check('목회 A/B = 28.51%', 목회.useRate, 28.51)
  check('목회 A/C = 114.03%', 목회.quarterRate, 114.03)

  const 예배 = 목회.rows.find(r => r.category_name === '예배준비비')!
  check('예배준비비 C = 예산/4 = 300,000', 예배.quarterBudget, 300000)
  check('예배준비비 A/B = 70.53%', 예배.useRate, 70.53)
  check('예배준비비 A/C = 282.11%', 예배.quarterRate, 282.11)

  const 심방 = 목회.rows.find(r => r.category_name === '심방비')!
  check('심방비 A/B = 23.01%', 심방.useRate, 23.01)
  check('심방비 A/C = 92.04%', 심방.quarterRate, 92.04)
}

// ── 2. 소그룹 롤업 — 리더 개별은 빼고 '소그룹 운영비' 하나로 ──
console.log('\n[2] 소그룹 롤업 (이중계상 방지)')
{
  const cats: QuarterCategory[] = [
    { id: 10, group_name: '양육', category_name: '리더 모임', annual_budget: 2000000 },
    { id: 11, group_name: '양육', category_name: '소그룹 운영비', annual_budget: 8100000 },
    { id: 12, group_name: '양육', category_name: '소그룹_정연우', annual_budget: 540000 },
    { id: 13, group_name: '양육', category_name: '소그룹_김철수', annual_budget: 540000 },
  ]
  const txns: QuarterTxn[] = [
    { budget_category_id: 10, amount: 215400 },
    { budget_category_id: 12, amount: 500000 }, // 정연우
    { budget_category_id: 13, amount: 391880 }, // 김철수 → 리더합 891,880
    // 소그룹 운영비 항목(11)엔 직접 tx 없음
  ]
  const rep = buildQuarterReport(cats, txns, 1)
  const 양육 = rep.groups.find(g => g.group_name === '양육')!

  check('세부에 소그룹_XX 안 나옴', 양육.rows.some(r => r.category_name.startsWith('소그룹_')), false)
  const 운영비 = 양육.rows.find(r => r.category_name === '소그룹 운영비')!
  check('소그룹 운영비 = 리더합 891,880', 운영비.used, 891880)
  check('양육 집행 = 리더모임 215,400 + 소그룹 891,880 = 1,107,280', 양육.used, 1107280)
  check('양육 예산엔 소그룹_XX 개별 예산 미포함 (2,000,000 + 8,100,000)', 양육.budget, 10100000)
}

// ── 3. 총예산도 소그룹_XX 제외 ─────────────────────────────
console.log('\n[3] 총예산 = 소그룹_XX 개별 예산 제외')
{
  const cats: QuarterCategory[] = [
    { id: 1, group_name: '목회', category_name: '심방비', annual_budget: 4800000 },
    { id: 11, group_name: '양육', category_name: '소그룹 운영비', annual_budget: 8100000 },
    { id: 12, group_name: '양육', category_name: '소그룹_정연우', annual_budget: 540000 },
  ]
  const rep = buildQuarterReport(cats, [], 1)
  check('총예산 = 4,800,000 + 8,100,000 (소그룹_정연우 제외)', rep.totalBudget, 12900000)
}

// ── 4. C 계산 — 분기별 목표 ────────────────────────────────
console.log('\n[4] 분기 목표 C = 예산 × 경과분기/4')
{
  const cats: QuarterCategory[] = [{ id: 1, group_name: '목회', category_name: '심방비', annual_budget: 4800000 }]
  const q1 = buildQuarterReport(cats, [{ budget_category_id: 1, amount: 1200000 }], 1)
  check('1분기: C = 예산/4 = 1,200,000', q1.groups[0].rows[0].quarterBudget, 1200000)
  check('1분기: A/C = 100% (120만/120만)', q1.groups[0].rows[0].quarterRate, 100)

  const h1 = buildQuarterReport(cats, [{ budget_category_id: 1, amount: 1200000 }], 2)
  check('상반기: C = 예산/2 = 2,400,000', h1.groups[0].rows[0].quarterBudget, 2400000)
  check('상반기: A/C = 50%', h1.groups[0].rows[0].quarterRate, 50)
}

// ── 5. 예산 0 항목 (0으로 나누기 방지) ─────────────────────
console.log('\n[5] 예산 0 항목은 비율 0')
{
  const cats: QuarterCategory[] = [{ id: 1, group_name: '행사', category_name: '야외예배', annual_budget: 0 }]
  const rep = buildQuarterReport(cats, [], 1)
  check('예산 0 → A/B = 0', rep.groups[0].rows[0].useRate, 0)
  check('예산 0 → A/C = 0', rep.groups[0].rows[0].quarterRate, 0)
}

// ── 6. 그룹 순서 + 빈 그룹 제외 ────────────────────────────
console.log('\n[6] 그룹 순서 목회·양육·사역·행사')
{
  const cats: QuarterCategory[] = [
    { id: 1, group_name: '행사', category_name: '크리스마스', annual_budget: 1200000 },
    { id: 2, group_name: '목회', category_name: '심방비', annual_budget: 4800000 },
    { id: 3, group_name: '사역', category_name: '전도팀', annual_budget: 1200000 },
  ]
  const rep = buildQuarterReport(cats, [], 1)
  check('순서 = 목회,사역,행사 (양육 없으면 빠짐)', rep.groups.map(g => g.group_name), ['목회', '사역', '행사'])
}

// ── 7. 분기 옵션 + 거래일 필터 ─────────────────────────────
console.log('\n[7] 분기 구간·거래일 필터')
{
  const opts = quarterOptions(2026)
  const q1 = opts.find(o => o.key === 'q1')!
  check('1분기 = 1/1~3/31, 경과 1', [q1.start, q1.end, q1.quartersElapsed], ['2026-01-01', '2026-03-31', 1])
  const h1 = opts.find(o => o.key === 'h1')!
  check('상반기 = 1/1~6/30, 경과 2', [h1.start, h1.end, h1.quartersElapsed], ['2026-01-01', '2026-06-30', 2])

  check('3/31 → 1분기 포함', txnInRange('2026-03-31', q1.start, q1.end), true)
  check('4/1 → 1분기 제외', txnInRange('2026-04-01', q1.start, q1.end), false)
}

console.log(`\n${'─'.repeat(50)}`)
console.log(`통과 ${pass} / 실패 ${fail}`)
process.exit(fail > 0 ? 1 : 0)
