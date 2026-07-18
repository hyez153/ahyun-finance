/**
 * 감사자료 집계.
 *
 * 청구일자 구간(시작~끝)을 고르면, 그 구간에 청구완료된 영수증을
 * 예산 항목별로 누적 합계 낸다. 화면과 분리해 여기서만 계산한다.
 *
 * "청구완료"의 정의: 영수증이 확정 배치에 묶여 있는 것.
 * 배치의 claim_date가 [시작, 끝] 안에 들면 그 배치의 영수증을 포함한다.
 */

import { GroupName } from '@/types/database'

export const GROUP_ORDER: GroupName[] = ['목회', '양육', '사역', '행사']

/** 집계에 넘길 영수증 한 건 (조인된 항목 정보 포함) */
export interface AuditReceipt {
  id: number
  amount: number
  receipt_date: string
  vendor_name: string
  memo: string | null
  submitter_name: string
  payer_name: string | null
  claim_date: string // 소속 배치의 청구일 (YYYY-MM-DD)
  group_name: string
  category_name: string
}

export interface CategorySummary {
  category_name: string
  total: number
  count: number
}

export interface GroupSummary {
  group_name: string
  categories: CategorySummary[]
  total: number
  count: number
}

export interface AuditReport {
  groups: GroupSummary[]
  grandTotal: number
  grandCount: number
  /** 명세용: 청구일 → 항목 순으로 정렬된 전체 영수증 */
  receipts: AuditReceipt[]
}

/**
 * 청구일이 [start, end] 안에 드는지. 문자열 비교로 충분하다
 * (YYYY-MM-DD는 사전순 = 날짜순). 둘 다 포함(inclusive)이다.
 */
export function isInRange(claimDate: string, start: string, end: string): boolean {
  return claimDate >= start && claimDate <= end
}

/**
 * 구간에 든 영수증들을 항목별로 누적 집계한다.
 *
 * @param receipts 청구완료된 영수증 (호출 측에서 이미 is_claimed 필터를 거친 것)
 * @param start    시작 청구일 (YYYY-MM-DD, 포함)
 * @param end      끝 청구일 (YYYY-MM-DD, 포함)
 */
export function buildAuditReport(
  receipts: AuditReceipt[],
  start: string,
  end: string
): AuditReport {
  const inRange = receipts.filter(r => isInRange(r.claim_date, start, end))

  // group_name → category_name → 합계/건수
  const acc = new Map<string, Map<string, { total: number; count: number }>>()

  for (const r of inRange) {
    const g = r.group_name || '기타'
    const c = r.category_name || '미분류'
    if (!acc.has(g)) acc.set(g, new Map())
    const cats = acc.get(g)!
    const cur = cats.get(c) ?? { total: 0, count: 0 }
    cur.total += Number(r.amount) || 0
    cur.count += 1
    cats.set(c, cur)
  }

  // GROUP_ORDER 순으로, 그 외 그룹은 뒤에 가나다순
  const seenGroups = [...acc.keys()]
  const orderedGroupNames = [
    ...GROUP_ORDER.filter(g => seenGroups.includes(g)),
    ...seenGroups.filter(g => !GROUP_ORDER.includes(g as GroupName)).sort((a, b) => a.localeCompare(b, 'ko')),
  ]

  const groups: GroupSummary[] = orderedGroupNames.map(g => {
    const cats = acc.get(g)!
    const categories: CategorySummary[] = [...cats.entries()]
      .map(([category_name, v]) => ({ category_name, total: v.total, count: v.count }))
      .sort((a, b) => a.category_name.localeCompare(b.category_name, 'ko'))
    const total = categories.reduce((s, c) => s + c.total, 0)
    const count = categories.reduce((s, c) => s + c.count, 0)
    return { group_name: g, categories, total, count }
  })

  const grandTotal = groups.reduce((s, g) => s + g.total, 0)
  const grandCount = groups.reduce((s, g) => s + g.count, 0)

  // 명세: 청구일 → 그룹 순서 → 항목 → 사용일 순으로 정렬
  const groupRank = (g: string) => {
    const i = orderedGroupNames.indexOf(g)
    return i === -1 ? 999 : i
  }
  const sortedReceipts = [...inRange].sort((a, b) => {
    if (a.claim_date !== b.claim_date) return a.claim_date.localeCompare(b.claim_date)
    if (a.group_name !== b.group_name) return groupRank(a.group_name) - groupRank(b.group_name)
    if (a.category_name !== b.category_name) return a.category_name.localeCompare(b.category_name, 'ko')
    return a.receipt_date.localeCompare(b.receipt_date)
  })

  return { groups, grandTotal, grandCount, receipts: sortedReceipts }
}

/** 구간에 실제로 등장하는 청구일 목록 (드롭다운 채우기 편의용, 중복 제거·정렬) */
export function distinctClaimDates(receipts: Pick<AuditReceipt, 'claim_date'>[]): string[] {
  return [...new Set(receipts.map(r => r.claim_date))].sort()
}

/**
 * 배열을 size개씩 끊는다. 명세를 PDF 여러 장으로 나눌 때 쓴다.
 * 한 장에 다 넣으면 A4 한 장 높이로 압축돼서 글자가 깨알이 된다.
 */
export function chunk<T>(items: T[], size: number): T[][] {
  if (size < 1) return [items]
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size))
  }
  return out
}
