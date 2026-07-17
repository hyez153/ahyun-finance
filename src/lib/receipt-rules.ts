/**
 * 영수증 등록/수정에 함께 쓰는 규칙.
 *
 * 등록 화면(/receipts/new)과 수정 화면(/receipts/[id]/edit)이 같은 규칙을
 * 써야 한다. 한쪽에만 고치면 규칙이 갈라지므로 여기 모아둔다.
 */

import { BudgetCategory, Receipt } from '@/types/database'

export const GROUP_ORDER = ['목회', '양육', '사역', '행사'] as const

/** 생일 사용의 1인당 상한 */
export const BIRTHDAY_MAX = 10000

/** 생일/등반 구분이 붙는 카테고리 이름 */
export const BIRTHDAY_CLIMB_CATEGORY = '생일/등반'

export type BirthdayClimbType = '생일' | '등반' | ''

/**
 * 카테고리를 소그룹 리더용과 일반용으로 가른다.
 * 소그룹 리더 카테고리는 이름이 "소그룹_"로 시작한다.
 */
export function splitCategories(categories: BudgetCategory[]) {
  const leader = categories
    .filter(c => c.category_name.startsWith('소그룹_'))
    .sort((a, b) => a.category_name.localeCompare(b.category_name, 'ko'))
  const main = categories.filter(c => !c.category_name.startsWith('소그룹_'))
  const grouped = GROUP_ORDER.map(g => ({
    group: g,
    items: main.filter(c => c.group_name === g),
  }))
  return { leader, main, grouped }
}

/**
 * 생일/등반 구분은 적요 앞에 "[생일] " / "[등반] " 으로 붙여서 저장한다.
 * 수정 화면에서는 이걸 다시 떼어내 구분 버튼으로 되살려야 한다.
 */
export function parseMemo(memo: string | null): { type: BirthdayClimbType; text: string } {
  if (!memo) return { type: '', text: '' }
  // [\s\S]로 줄바꿈까지 잡는다 (s 플래그는 이 프로젝트 타깃에서 못 쓴다)
  const m = /^\[(생일|등반)\]\s*([\s\S]*)$/.exec(memo)
  if (!m) return { type: '', text: memo }
  return { type: m[1] as BirthdayClimbType, text: m[2] }
}

/** 구분 + 적요 → 저장할 문자열. 둘 다 비면 null. */
export function buildMemo(type: BirthdayClimbType, text: string): string | null {
  const prefix = type ? `[${type}] ` : ''
  return (prefix + (text || '')).trim() || null
}

/** "1,234" 같은 표시용 문자열 → 숫자 */
export function parseAmount(formatted: string): number {
  return Number(formatted.replace(/,/g, '')) || 0
}

/** 숫자 → "1,234" */
export function formatAmountInput(v: string): string {
  const raw = v.replace(/[^0-9]/g, '')
  return raw ? Number(raw).toLocaleString('ko-KR') : ''
}

export interface BudgetInfo {
  annual_budget: number
  confirmed: number
  pending: number
  remaining: number
}

/**
 * 이 영수증을 사용자가 고칠 수 있는가.
 *
 * 청구된 건은 확정된 회계 기록이라 손대면 안 된다.
 * (DB 트리거도 같은 규칙으로 막지만, 화면에서 먼저 걸러 버튼을 숨긴다)
 */
export function isEditable(receipt: Pick<Receipt, 'status' | 'is_claimed' | 'claim_batch_id'>): boolean {
  return receipt.status === 'submitted' && !receipt.is_claimed && receipt.claim_batch_id === null
}

/**
 * 이 사람이 이 영수증을 고치거나 지울 수 있는가.
 *
 * 제출자 본인 또는 관리자(회계)만. 결제자로 지정만 된 사람은 볼 수는 있어도
 * 남의 제출물을 고치지는 못한다.
 */
export function canModify(
  receipt: Pick<Receipt, 'submitter_name'>,
  userName: string,
  isAdmin: boolean
): boolean {
  return isAdmin || receipt.submitter_name === userName
}
