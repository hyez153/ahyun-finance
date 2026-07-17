import {
  parseMemo,
  buildMemo,
  parseAmount,
  formatAmountInput,
  isEditable,
  canModify,
  splitCategories,
} from './receipt-rules'
import { BudgetCategory } from '@/types/database'

let pass = 0
let fail = 0

function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (ok) { pass++; console.log(`  ✓ ${name}`) }
  else { fail++; console.log(`  ✗ ${name}\n      기대: ${JSON.stringify(expected)}\n      실제: ${JSON.stringify(actual)}`) }
}

// ── 1. 적요 왕복 (생일/등반 구분 보존) ─────────────────────
// 등록 화면이 "[생일] 메모"로 저장 → 수정 화면이 다시 분리 → 저장하면 원상복구.
// 여기서 어긋나면 수정 한 번에 구분 태그가 사라지거나 중첩된다.
console.log('\n[1] 적요 왕복 (parse → build)')
{
  check('[생일] 분리', parseMemo('[생일] 김철수 생일'), { type: '생일', text: '김철수 생일' })
  check('[등반] 분리', parseMemo('[등반] 북한산'), { type: '등반', text: '북한산' })
  check('태그 없는 메모', parseMemo('그냥 메모'), { type: '', text: '그냥 메모' })
  check('빈 메모', parseMemo(null), { type: '', text: '' })

  // 왕복: 저장된 값 → 분리 → 다시 저장 = 원래 값
  const roundtrip = (memo: string | null) => {
    const { type, text } = parseMemo(memo)
    return buildMemo(type, text)
  }
  check('왕복: [생일] 보존', roundtrip('[생일] 김철수 생일'), '[생일] 김철수 생일')
  check('왕복: [등반] 보존', roundtrip('[등반] 북한산'), '[등반] 북한산')
  check('왕복: 태그 없음', roundtrip('그냥 메모'), '그냥 메모')
  check('왕복: null → null', roundtrip(null), null)
}

// ── 2. buildMemo ───────────────────────────────────────────
console.log('\n[2] 적요 조립')
{
  check('구분 + 메모', buildMemo('생일', '홍길동'), '[생일] 홍길동')
  check('구분만, 메모 없음', buildMemo('등반', ''), '[등반]')
  check('메모만, 구분 없음', buildMemo('', '회식비'), '회식비')
  check('둘 다 없음 → null', buildMemo('', ''), null)
}

// ── 3. 금액 파싱/포맷 ──────────────────────────────────────
console.log('\n[3] 금액 파싱/포맷')
{
  check('"33,500" → 33500', parseAmount('33,500'), 33500)
  check('빈 문자열 → 0', parseAmount(''), 0)
  check('"1234567" → "1,234,567"', formatAmountInput('1234567'), '1,234,567')
  check('숫자 아닌 것 제거', formatAmountInput('1a2b3c'), '123')
  check('빈 입력 → 빈 문자열', formatAmountInput(''), '')
}

// ── 4. 수정 가능 여부 (청구 상태) ──────────────────────────
console.log('\n[4] isEditable — 청구된 건 잠금')
{
  check('제출됨 + 미청구 → 가능', isEditable({ status: 'submitted', is_claimed: false, claim_batch_id: null }), true)
  check('청구완료 → 불가', isEditable({ status: 'approved', is_claimed: true, claim_batch_id: 5 }), false)
  check('배치에 묶임 → 불가', isEditable({ status: 'submitted', is_claimed: false, claim_batch_id: 5 }), false)
  check('is_claimed만 true → 불가', isEditable({ status: 'submitted', is_claimed: true, claim_batch_id: null }), false)
  check('승인됨(청구 대기) → 불가', isEditable({ status: 'approved', is_claimed: false, claim_batch_id: null }), false)
}

// ── 5. 수정 권한 (제출자 또는 관리자) ──────────────────────
console.log('\n[5] canModify — 제출자 또는 관리자')
{
  const r = { submitter_name: '홍길동' }
  check('제출자 본인 → 가능', canModify(r, '홍길동', false), true)
  check('남 → 불가', canModify(r, '김철수', false), false)
  check('결제자였어도 제출자 아니면 불가', canModify(r, '김철수', false), false)
  check('관리자 → 남의 것도 가능', canModify(r, '김철수', true), true)
}

// ── 6. 카테고리 분리 ───────────────────────────────────────
console.log('\n[6] splitCategories — 소그룹 리더 분리')
{
  const cats = [
    { id: 1, group_name: '목회', category_name: '심방비', annual_budget: 0, created_at: '' },
    { id: 2, group_name: '양육', category_name: '소그룹_홍길동', annual_budget: 0, created_at: '' },
    { id: 3, group_name: '양육', category_name: '소그룹_김철수', annual_budget: 0, created_at: '' },
    { id: 4, group_name: '행사', category_name: '크리스마스', annual_budget: 0, created_at: '' },
  ] as BudgetCategory[]
  const { leader, main } = splitCategories(cats)
  check('리더 2개', leader.length, 2)
  check('리더는 가나다순 (김철수 먼저)', leader[0].category_name, '소그룹_김철수')
  check('일반 2개', main.length, 2)
  check('일반에 소그룹_ 없음', main.some(c => c.category_name.startsWith('소그룹_')), false)
}

console.log(`\n${'─'.repeat(50)}`)
console.log(`통과 ${pass} / 실패 ${fail}`)
process.exit(fail > 0 ? 1 : 0)
