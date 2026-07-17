import { parseReceiptFields, OcrField } from './receipt-parser'

/**
 * 진짜 CLOVA가 영수증을 쪼개는 방식을 흉내낸다.
 *
 * 핵심: CLOVA는 "합계"(왼쪽)와 "33,500"(오른쪽)을 **각각 다른 조각**으로 주고
 * 둘 다 lineBreak: true를 붙인다. 라벨과 값은 좌표로만 이어져 있다.
 * (실제 응답에서 확인: 합계 y=618 x=44 / 33,500 y=620 x=630)
 */
type Row =
  | { label: string; value: string }   // 왼쪽 라벨 + 오른쪽 값 (기둥이 갈림)
  | { center: string }                  // 가운데 한 덩어리 (상호, 날짜 등)

function mkFields(rows: Row[], confidence = 0.99, skew = 0): OcrField[] {
  const fields: OcrField[] = []
  let y = 50

  const box = (x: number, yTop: number, w: number, h: number) => ({
    vertices: [
      { x, y: yTop },
      { x: x + w, y: yTop },
      { x: x + w, y: yTop + h },
      { x, y: yTop + h },
    ],
  })

  for (const row of rows) {
    // 사진이 기울어진 상황을 흉내내려고 줄마다 y를 조금씩 흔든다.
    const jitter = skew ? Math.round((y / 100) * skew) : 0

    if ('center' in row) {
      // 가운데 덩어리는 어절 단위로 쪼갠다 (CLOVA가 실제로 그렇게 준다).
      let x = 240
      const parts = row.center.split(' ').filter(Boolean)
      parts.forEach((p, i) => {
        fields.push({
          inferText: p,
          inferConfidence: confidence,
          lineBreak: i === parts.length - 1,
          boundingPoly: box(x, y + jitter, p.length * 22, 30),
        })
        x += p.length * 22 + 12
      })
    } else {
      // 라벨: 왼쪽 끝 / 값: 오른쪽 끝. 각각 독립된 조각 + lineBreak true.
      fields.push({
        inferText: row.label,
        inferConfidence: confidence,
        lineBreak: true,
        boundingPoly: box(44, y + jitter, row.label.length * 22, 30),
      })
      fields.push({
        inferText: row.value,
        inferConfidence: confidence,
        lineBreak: true,
        // 값은 y가 1~2px 어긋나는 게 보통이다 (실제 응답에서 관찰됨).
        boundingPoly: box(640, y + jitter + 2, row.value.length * 16, 30),
      })
    }
    y += 38
  }
  return fields
}

const TODAY = new Date(2026, 6, 17) // 2026-07-17

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

// ── 1. 카드 영수증 ─────────────────────────────────────────
console.log('\n[1] 카드 영수증')
{
  const r = parseReceiptFields(mkFields([
    { center: '스타벅스 홍대점' },
    { center: '서울특별시 마포구 양화로 141' },
    { center: '사업자번호 : 201-81-21515' },
    { center: '2026-07-15 14:32:11' },
    { label: '아이스 아메리카노 x 3', value: '13,500' },
    { label: '과세물품가액', value: '30,455' },
    { label: '부가세', value: '3,045' },
    { label: '합계', value: '33,500' },
    { label: '받은금액', value: '33,500' },
  ]), TODAY)
  check('금액 = 33500', r.amount, 33500)
  check('날짜 = 2026-07-15', r.receiptDate, '2026-07-15')
  check('상호 = 스타벅스 홍대점', r.vendorName, '스타벅스 홍대점')
  check('금액을 라벨로 찾음 (확신도 높음)', (r.confidence.amount ?? 0) > 0.9, true)
}

// ── 2. 현금 영수증 — 받은금액이 합계보다 큰 함정 ────────────
// 이게 진짜 클로바 응답에서 발견된 버그다. 라벨과 값이 다른 조각으로 오기 때문에
// 좌표로 줄을 복원하지 않으면 "50,000"이 라벨 없는 외톨이가 되어 총액으로 뽑힌다.
console.log('\n[2] 현금 영수증 — 받은금액(50,000) > 합계(37,800)')
{
  const r = parseReceiptFields(mkFields([
    { center: '이마트 성수점' },
    { center: '2026-07-01' },
    { label: '과세물품가액', value: '34,364' },
    { label: '부가세', value: '3,436' },
    { label: '합계', value: '37,800' },
    { label: '받은금액', value: '50,000' },
    { label: '거스름돈', value: '12,200' },
  ]), TODAY)
  check('금액 = 37800 (50,000 아님!)', r.amount, 37800)
  check('라벨로 찾음', (r.confidence.amount ?? 0) > 0.9, true)
}

// ── 3. 공급가액 함정 ───────────────────────────────────────
console.log('\n[3] 공급가액을 총액으로 집으면 안 됨')
{
  const r = parseReceiptFields(mkFields([
    { center: '김밥천국' },
    { center: '2026.07.10' },
    { label: '공급가액', value: '20,000' },
    { label: '부가세', value: '2,000' },
    { label: '합계', value: '22,000' },
  ]), TODAY)
  check('금액 = 22000', r.amount, 22000)
}

// ── 4. 승인번호/카드번호 함정 ──────────────────────────────
console.log('\n[4] 승인번호(30291847)를 금액으로 집으면 안 됨')
{
  const r = parseReceiptFields(mkFields([
    { center: '가게' },
    { center: '2026-07-16' },
    { label: '카드번호', value: '5310-45**-****-1029' },
    { label: '승인번호', value: '30291847' },
    { label: '합계', value: '3,000' },
  ]), TODAY)
  check('금액 = 3000', r.amount, 3000)
}

// ── 5. 날짜 표기 변형 ──────────────────────────────────────
console.log('\n[5] 날짜 표기 변형')
{
  const a = parseReceiptFields(mkFields([{ center: '가게' }, { center: '2026년 7월 3일' }, { label: '합계', value: '1,000' }]), TODAY)
  check('2026년 7월 3일', a.receiptDate, '2026-07-03')

  const b = parseReceiptFields(mkFields([{ center: '가게' }, { center: '2026.12.25' }, { label: '합계', value: '1,000' }]), new Date(2027, 0, 5))
  check('2026.12.25', b.receiptDate, '2026-12-25')

  const c = parseReceiptFields(mkFields([{ center: '가게' }, { center: '26-07-09' }, { label: '합계', value: '1,000' }]), TODAY)
  check('26-07-09 (두 자리 연도)', c.receiptDate, '2026-07-09')
}

// ── 6. 말 안 되는 날짜 ─────────────────────────────────────
console.log('\n[6] 미래 날짜는 버린다')
{
  const r = parseReceiptFields(mkFields([{ center: '가게' }, { center: '2030-01-01' }, { label: '합계', value: '1,000' }]), TODAY)
  check('미래 날짜 → null', r.receiptDate, null)
}

// ── 7. 라벨 없는 영수증 → 추측 + 확신도 하락 ────────────────
console.log('\n[7] 합계 라벨이 없으면 추측하되 확신도를 깎는다')
{
  const r = parseReceiptFields(mkFields([
    { center: '동네슈퍼' },
    { center: '2026-07-16' },
    { label: '콜라', value: '1,500' },
    { label: '과자', value: '2,300' },
    { center: '9,800' },
  ]), TODAY)
  check('가장 큰 값 추측 = 9800', r.amount, 9800)
  check('확신도 0.5 이하 (확인해주세요 유도)', (r.confidence.amount ?? 1) <= 0.5, true)
}

// ── 8. 상호 라벨 우선 ──────────────────────────────────────
console.log('\n[8] 상호 라벨이 있으면 그걸 쓴다')
{
  const r = parseReceiptFields(mkFields([
    { center: '신용카드 매출전표' },
    { center: '상호 : 파리바게뜨 연남점' },
    { center: '2026-07-14' },
    { label: '합계', value: '8,900' },
  ]), TODAY)
  check('상호 = 파리바게뜨 연남점', r.vendorName, '파리바게뜨 연남점')
}

// ── 9. 기울어진 사진 ───────────────────────────────────────
console.log('\n[9] 사진이 기울어져도 줄이 안 깨진다')
{
  const r = parseReceiptFields(mkFields([
    { center: '스타벅스 홍대점' },
    { center: '2026-07-15' },
    { label: '과세물품가액', value: '30,455' },
    { label: '부가세', value: '3,045' },
    { label: '합계', value: '33,500' },
    { label: '받은금액', value: '50,000' },
  ], 0.99, 6), TODAY) // skew: 줄마다 y가 조금씩 밀린다
  check('기울어져도 금액 = 33500', r.amount, 33500)
  check('기울어져도 라벨로 찾음', (r.confidence.amount ?? 0) > 0.9, true)
}

// ── 10. 확신도 낮은 인식은 그대로 전달 ─────────────────────
console.log('\n[10] CLOVA 확신도가 낮으면 그대로 반영한다')
{
  const r = parseReceiptFields(mkFields([{ center: '가게' }, { center: '2026-07-16' }, { label: '합계', value: '5,000' }], 0.42), TODAY)
  check('금액 확신도 = 0.42', r.confidence.amount, 0.42)
}

// ── 11. 아무것도 못 읽는 경우 ──────────────────────────────
console.log('\n[11] 못 읽으면 null (앱이 안 죽어야 함)')
{
  const r = parseReceiptFields(mkFields([{ center: '@@@' }, { center: '###' }]), TODAY)
  check('금액 null', r.amount, null)
  check('날짜 null', r.receiptDate, null)
}

// ── 12. 좌표가 없으면 lineBreak로 되돌아간다 ───────────────
console.log('\n[12] boundingPoly가 없어도 죽지 않는다 (대비책)')
{
  const noBox: OcrField[] = [
    { inferText: '가게', inferConfidence: 0.99, lineBreak: true },
    { inferText: '2026-07-16', inferConfidence: 0.99, lineBreak: true },
    { inferText: '합계', inferConfidence: 0.99 },
    { inferText: '7,700', inferConfidence: 0.99, lineBreak: true },
  ]
  const r = parseReceiptFields(noBox, TODAY)
  check('좌표 없이도 금액 = 7700', r.amount, 7700)
}

console.log(`\n${'─'.repeat(50)}`)
console.log(`통과 ${pass} / 실패 ${fail}`)
process.exit(fail > 0 ? 1 : 0)
