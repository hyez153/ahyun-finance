/**
 * 분기 예산 집행 보고서 집계.
 *
 * 청구완료된 집행(budget_transactions)을 거래일 기준으로 분기별로 묶어,
 * 대분류(목회/양육/사역/행사) → 항목별로 예산 대비 집행률을 낸다.
 *
 * 소그룹 처리: 리더 개별 항목(소그룹_XX)은 빼고 "소그룹 운영비" 하나로
 * 롤업한다. 안 그러면 예산·집행이 이중계상된다(예산 화면과 같은 규칙).
 *
 * 표의 열:
 *   A = 사용금액(집행)
 *   B = 연간예산
 *   C = 분기 목표 = B × (경과분기 / 4)
 *   A/B = 예산 사용 비율(연간 대비)
 *   A/C = 분기내 사용 비율(분기 목표 대비)
 */

import { GroupName } from '@/types/database'

export const GROUP_ORDER: GroupName[] = ['목회', '양육', '사역', '행사']

const SUBGROUP_PREFIX = '소그룹_'
const SUBGROUP_PARENT = '소그룹 운영비'

export interface QuarterCategory {
  id: number
  group_name: string
  category_name: string
  annual_budget: number
}

export interface QuarterTxn {
  budget_category_id: number
  amount: number
}

export interface CategoryRow {
  category_name: string
  used: number // A
  budget: number // B
  quarterBudget: number // C = B × 경과분기/4
  useRate: number // A/B (%)
  quarterRate: number // A/C (%)
}

export interface GroupReport {
  group_name: string
  rows: CategoryRow[]
  used: number
  budget: number
  quarterBudget: number
  useRate: number
  quarterRate: number
}

export interface QuarterReport {
  totalBudget: number
  totalUsed: number
  useRate: number
  groups: GroupReport[]
  quartersElapsed: number
}

function rate(a: number, b: number): number {
  if (b === 0) return 0
  return Math.round((a / b) * 10000) / 100 // 소수 둘째 자리 %
}

/**
 * @param cats 전체 예산 항목
 * @param txns 이 분기에 해당하는 집행 거래 (거래일 필터는 호출 측에서)
 * @param quartersElapsed 경과 분기 수 (1분기·2분기=1, 상반기=2). 목표 C 계산에 쓴다.
 */
export function buildQuarterReport(
  cats: QuarterCategory[],
  txns: QuarterTxn[],
  quartersElapsed: number
): QuarterReport {
  // 항목별 집행 합 (음수 방지 위해 절댓값)
  const usedByCat = new Map<number, number>()
  for (const t of txns) {
    usedByCat.set(t.budget_category_id, (usedByCat.get(t.budget_category_id) ?? 0) + Math.abs(Number(t.amount) || 0))
  }

  // 소그룹 리더 개별 집행 합 → "소그룹 운영비"로 롤업
  const leaderIds = cats.filter(c => c.category_name.startsWith(SUBGROUP_PREFIX)).map(c => c.id)
  const leaderUsedSum = leaderIds.reduce((s, id) => s + (usedByCat.get(id) ?? 0), 0)

  const factor = quartersElapsed / 4

  // 리더 개별 항목은 제외하고 집계
  const mainCats = cats.filter(c => !c.category_name.startsWith(SUBGROUP_PREFIX))

  const groups: GroupReport[] = GROUP_ORDER
    .map(g => {
      const groupCats = mainCats
        .filter(c => c.group_name === g)
        .sort((a, b) => a.category_name.localeCompare(b.category_name, 'ko'))

      const rows: CategoryRow[] = groupCats.map(c => {
        // 소그룹 운영비 항목은 리더 롤업 합으로 대체
        const used = c.category_name === SUBGROUP_PARENT ? leaderUsedSum : (usedByCat.get(c.id) ?? 0)
        const budget = Number(c.annual_budget) || 0
        const quarterBudget = budget * factor
        return {
          category_name: c.category_name,
          used,
          budget,
          quarterBudget,
          useRate: rate(used, budget),
          quarterRate: rate(used, quarterBudget),
        }
      })

      const used = rows.reduce((s, r) => s + r.used, 0)
      const budget = rows.reduce((s, r) => s + r.budget, 0)
      const quarterBudget = budget * factor
      return {
        group_name: g,
        rows,
        used,
        budget,
        quarterBudget,
        useRate: rate(used, budget),
        quarterRate: rate(used, quarterBudget),
      }
    })
    .filter(g => g.rows.length > 0)

  const totalBudget = groups.reduce((s, g) => s + g.budget, 0)
  const totalUsed = groups.reduce((s, g) => s + g.used, 0)

  return {
    totalBudget,
    totalUsed,
    useRate: rate(totalUsed, totalBudget),
    groups,
    quartersElapsed,
  }
}

/** 분기 선택지 → 거래일 구간 + 경과 분기 수 */
export interface QuarterOption {
  key: string
  label: string
  start: string
  end: string
  quartersElapsed: number
}

export function quarterOptions(year: number): QuarterOption[] {
  return [
    { key: 'q1', label: '1분기', start: `${year}-01-01`, end: `${year}-03-31`, quartersElapsed: 1 },
    { key: 'q2', label: '2분기', start: `${year}-04-01`, end: `${year}-06-30`, quartersElapsed: 1 },
    { key: 'h1', label: '상반기 누적', start: `${year}-01-01`, end: `${year}-06-30`, quartersElapsed: 2 },
    { key: 'q3', label: '3분기', start: `${year}-07-01`, end: `${year}-09-30`, quartersElapsed: 1 },
    { key: 'q4', label: '4분기', start: `${year}-10-01`, end: `${year}-12-31`, quartersElapsed: 1 },
  ]
}

/** 거래일이 [start, end] 안인지 (YYYY-MM-DD 사전순 = 날짜순) */
export function txnInRange(transactionDate: string, start: string, end: string): boolean {
  return transactionDate >= start && transactionDate <= end
}
