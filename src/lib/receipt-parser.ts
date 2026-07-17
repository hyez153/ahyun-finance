/**
 * CLOVA General OCR 응답에서 영수증 정보를 추출한다.
 *
 * 일반 OCR은 글자만 뱉고 "이게 총액이다"를 알려주지 않는다(영수증 특화 모델과 다름).
 * 그래서 키워드/패턴으로 직접 골라낸다. 확실하지 않은 값은 confidence를 낮게 주고,
 * 화면에서 "확인해주세요"로 표시해 사람이 고치게 한다.
 */

export interface Vertex {
  x: number
  y: number
}

export interface OcrField {
  inferText: string
  inferConfidence: number
  boundingPoly?: { vertices: Vertex[] }
  /**
   * CLOVA가 주는 줄바꿈 표시. 신뢰할 수 없어서 쓰지 않는다.
   * 영수증처럼 라벨(왼쪽)과 값(오른쪽)이 떨어져 있으면 CLOVA는 둘을 각각
   * 다른 "줄"로 끊어 버린다. 그래서 줄 복원은 y좌표로 직접 한다.
   */
  lineBreak?: boolean
}

export interface ParsedReceipt {
  amount: number | null
  receiptDate: string | null // yyyy-mm-dd
  vendorName: string | null
  /** 항목별 확신도 (0~1). 값이 null이면 확신도도 null. */
  confidence: {
    amount: number | null
    receiptDate: number | null
    vendorName: number | null
  }
  /** 디버깅/검증용 — 재구성된 줄 */
  lines: string[]
}

/** 합계로 볼 수 있는 라벨. 앞쪽일수록 우선순위 높음. */
const TOTAL_LABELS = [
  '결제대상금액',
  '결제금액',
  '청구금액',
  '받을금액',
  '총결제금액',
  '판매총액',
  '총구매액',
  '총합계',
  '합계금액',
  '총액',
  '합계',
]

/** 합계로 착각하기 쉬운 라벨 — 이 줄은 금액 후보에서 제외한다. */
const TOTAL_EXCLUSIONS = [
  '공급가액',
  '과세물품가액',
  '과세물품',
  '면세물품가액',
  '면세물품',
  '부가세',
  '부가가치세',
  '세액',
  '봉사료',
  '받은금액',
  '받은돈',
  '거스름',
  '잔돈',
  '거스름돈',
  '할인',
  '적립',
  '포인트',
  '쿠폰',
  '캐시백',
  '전화',
  '사업자',
  '카드번호',
  '승인번호',
]

/** 상호로 보기 어려운 줄 */
const VENDOR_EXCLUSIONS = [
  '영수증',
  '거래명세',
  '신용카드',
  '체크카드',
  '매출전표',
  '사업자',
  '대표자',
  '주소',
  '전화',
  'TEL',
  '가맹점',
  '승인',
  '금액',
  '합계',
  '부가세',
  '공급가',
  '과세',
  '면세',
]

interface Box {
  field: OcrField
  yCenter: number
  height: number
  xLeft: number
}

function toBox(f: OcrField): Box | null {
  const v = f.boundingPoly?.vertices
  if (!v || v.length === 0) return null
  const ys = v.map(p => p.y)
  const xs = v.map(p => p.x)
  const top = Math.min(...ys)
  const bottom = Math.max(...ys)
  return {
    field: f,
    yCenter: (top + bottom) / 2,
    height: Math.max(bottom - top, 1),
    xLeft: Math.min(...xs),
  }
}

function median(nums: number[]): number {
  const s = [...nums].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)]
}

/**
 * fields를 화면상의 가로줄 단위로 다시 꿰맨다.
 *
 * CLOVA의 lineBreak는 쓰지 않는다. 영수증은 "합계"(왼쪽 끝)와 "33,500"(오른쪽 끝)처럼
 * 라벨과 값이 멀리 떨어져 있는데, CLOVA는 이 둘을 각각 별개의 줄로 끊어서 준다.
 * 그대로 믿으면 "합계"는 숫자 없는 줄이 되고 "33,500"은 라벨 없는 외톨이가 되어,
 * 총액을 라벨로 찾을 수 없고 "받은금액 50,000" 같은 값이 거름망을 통과해 버린다.
 *
 * 그래서 y좌표로 직접 묶는다. 같은 높이에 있으면 같은 줄이다.
 */
export function rebuildLines(fields: OcrField[]): { text: string; confidence: number }[] {
  const boxes = fields.map(toBox).filter((b): b is Box => b !== null)

  // 좌표가 없으면(예전 응답 형식 등) lineBreak로 되돌아간다.
  if (boxes.length === 0) return rebuildLinesByLineBreak(fields)

  // 글자 높이의 절반을 같은 줄로 볼 허용 오차로 쓴다.
  // 사진이 살짝 기울어져도 버티게 하되, 옆줄까지 삼키지 않을 만큼만 준다.
  const tolerance = median(boxes.map(b => b.height)) * 0.6

  const sorted = [...boxes].sort((a, b) => a.yCenter - b.yCenter)
  const rows: Box[][] = []
  let current: Box[] = []
  let rowY = 0

  for (const box of sorted) {
    if (current.length === 0) {
      current = [box]
      rowY = box.yCenter
      continue
    }
    if (Math.abs(box.yCenter - rowY) <= tolerance) {
      current.push(box)
      // 줄이 기울어져도 따라가도록 기준선을 평균으로 갱신한다.
      rowY = current.reduce((s, b) => s + b.yCenter, 0) / current.length
    } else {
      rows.push(current)
      current = [box]
      rowY = box.yCenter
    }
  }
  if (current.length > 0) rows.push(current)

  return rows
    .map(row => {
      const ordered = [...row].sort((a, b) => a.xLeft - b.xLeft)
      return toLine(ordered.map(b => b.field))
    })
    .filter(l => l.text.length > 0)
}

/** 좌표가 없을 때의 대비책. */
function rebuildLinesByLineBreak(fields: OcrField[]): { text: string; confidence: number }[] {
  const lines: { text: string; confidence: number }[] = []
  let buf: OcrField[] = []
  for (const f of fields) {
    buf.push(f)
    if (f.lineBreak) {
      lines.push(toLine(buf))
      buf = []
    }
  }
  if (buf.length > 0) lines.push(toLine(buf))
  return lines.filter(l => l.text.length > 0)
}

function toLine(fields: OcrField[]): { text: string; confidence: number } {
  const text = fields.map(f => f.inferText).join(' ').replace(/\s+/g, ' ').trim()
  // 줄의 확신도는 가장 약한 조각을 따른다 — 한 글자만 틀려도 그 줄은 의심스럽다.
  const confidence = fields.length > 0 ? Math.min(...fields.map(f => f.inferConfidence)) : 0
  return { text, confidence }
}

/** "1,234원", "1 234", "₩1,234" 같은 표기에서 숫자만 뽑는다. */
function extractNumbers(text: string): number[] {
  const out: number[] = []
  // 3자리 콤마가 있거나, 숫자가 3자리 이상 연속인 것만 금액 후보로 본다.
  const re = /([0-9][0-9,\s]{2,})/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const raw = m[1].replace(/[,\s]/g, '')
    if (!/^\d+$/.test(raw)) continue
    const n = Number(raw)
    if (Number.isFinite(n) && n > 0) out.push(n)
  }
  return out
}

function hasAny(text: string, needles: string[]): boolean {
  const upper = text.toUpperCase()
  return needles.some(n => upper.includes(n.toUpperCase()))
}

/** 금액이 영수증 총액으로 말이 되는 범위인지. 카드번호·사업자번호 등을 걸러낸다. */
function isPlausibleAmount(n: number): boolean {
  return n >= 100 && n <= 100_000_000
}

function findAmount(
  lines: { text: string; confidence: number }[]
): { value: number | null; confidence: number | null } {
  // 1순위: 합계 라벨이 붙은 줄에서 뽑기. 라벨 우선순위 순으로 훑는다.
  for (const label of TOTAL_LABELS) {
    for (const line of lines) {
      const compact = line.text.replace(/\s/g, '')
      if (!compact.includes(label)) continue
      if (hasAny(compact, TOTAL_EXCLUSIONS)) continue

      const nums = extractNumbers(line.text).filter(isPlausibleAmount)
      if (nums.length === 0) continue
      // 라벨 뒤 숫자가 총액인 게 보통 — 줄의 마지막 숫자를 쓴다.
      return { value: nums[nums.length - 1], confidence: line.confidence }
    }
  }

  // 2순위: 라벨을 못 찾음. 제외 대상이 아닌 줄들 중 가장 큰 금액을 총액으로 추정한다.
  // 이건 어디까지나 추측이라 확신도를 깎아서 "확인해주세요"가 뜨게 한다.
  const candidates: { value: number; confidence: number }[] = []
  for (const line of lines) {
    if (hasAny(line.text, TOTAL_EXCLUSIONS)) continue
    if (looksLikeDate(line.text)) continue
    for (const n of extractNumbers(line.text)) {
      if (isPlausibleAmount(n)) candidates.push({ value: n, confidence: line.confidence })
    }
  }
  if (candidates.length === 0) return { value: null, confidence: null }

  const best = candidates.reduce((a, b) => (b.value > a.value ? b : a))
  // 추측이므로 확신도 상한을 0.5로 눌러 반드시 검토를 유도한다.
  return { value: best.value, confidence: Math.min(best.confidence, 0.5) }
}

function looksLikeDate(text: string): boolean {
  return /(20\d{2}|\d{2})\s*[-./년]\s*\d{1,2}\s*[-./월]\s*\d{1,2}/.test(text)
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** 오늘 기준으로 말이 되는 날짜인지 — 미래이거나 2년 넘게 과거면 버린다. */
function isPlausibleDate(y: number, m: number, d: number, today: Date): boolean {
  if (m < 1 || m > 12 || d < 1 || d > 31) return false
  const dt = new Date(y, m - 1, d)
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return false
  if (dt.getTime() > today.getTime() + 24 * 60 * 60 * 1000) return false
  const twoYearsAgo = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate())
  if (dt.getTime() < twoYearsAgo.getTime()) return false
  return true
}

function findDate(
  lines: { text: string; confidence: number }[],
  today: Date
): { value: string | null; confidence: number | null } {
  // 1순위: 네 자리 연도. 2026-07-17 / 2026.07.17 / 2026년 7월 17일 / 2026/07/17
  const four = /(20\d{2})\s*[-./년]\s*(\d{1,2})\s*[-./월]\s*(\d{1,2})/
  for (const line of lines) {
    const m = four.exec(line.text)
    if (!m) continue
    const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
    if (!isPlausibleDate(y, mo, d, today)) continue
    return { value: `${y}-${pad(mo)}-${pad(d)}`, confidence: line.confidence }
  }

  // 2순위: 두 자리 연도(26-07-17). 금액과 헷갈릴 수 있어 확신도를 깎는다.
  const two = /(?<!\d)(\d{2})\s*[-./]\s*(\d{1,2})\s*[-./]\s*(\d{1,2})(?!\d)/
  for (const line of lines) {
    const m = two.exec(line.text)
    if (!m) continue
    const [y, mo, d] = [2000 + Number(m[1]), Number(m[2]), Number(m[3])]
    if (!isPlausibleDate(y, mo, d, today)) continue
    return { value: `${y}-${pad(mo)}-${pad(d)}`, confidence: Math.min(line.confidence, 0.6) }
  }

  return { value: null, confidence: null }
}

function findVendor(
  lines: { text: string; confidence: number }[]
): { value: string | null; confidence: number | null } {
  // 1순위: "상호" / "가맹점명" 라벨이 붙은 줄
  const labelRe = /(?:상\s*호(?:명)?|가맹점명?|점\s*포\s*명)\s*[:：]?\s*(.+)/
  for (const line of lines) {
    const m = labelRe.exec(line.text)
    if (!m) continue
    const v = cleanVendor(m[1])
    if (v) return { value: v, confidence: line.confidence }
  }

  // 2순위: 영수증 맨 위쪽이 보통 상호다. 위에서 5줄만 본다.
  for (const line of lines.slice(0, 5)) {
    if (hasAny(line.text, VENDOR_EXCLUSIONS)) continue
    if (looksLikeDate(line.text)) continue
    // 숫자/기호만 있는 줄(전화번호, 사업자번호 등)은 상호가 아니다.
    if (!/[가-힣A-Za-z]/.test(line.text)) continue
    const v = cleanVendor(line.text)
    if (!v || v.length < 2) continue
    // 위치로 때려맞춘 거라 확신도를 눌러 검토를 유도한다.
    return { value: v, confidence: Math.min(line.confidence, 0.5) }
  }

  return { value: null, confidence: null }
}

function cleanVendor(text: string): string | null {
  const v = text
    .replace(/[|[\]()<>*_=]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return v.length > 0 ? v.slice(0, 60) : null
}

/**
 * CLOVA General OCR의 fields 배열 → 영수증 정보.
 *
 * @param today 날짜 타당성 검사 기준. 테스트에서 고정할 수 있게 주입받는다.
 */
export function parseReceiptFields(fields: OcrField[], today: Date = new Date()): ParsedReceipt {
  const lines = rebuildLines(fields)

  const amount = findAmount(lines)
  const date = findDate(lines, today)
  const vendor = findVendor(lines)

  return {
    amount: amount.value,
    receiptDate: date.value,
    vendorName: vendor.value,
    confidence: {
      amount: amount.confidence,
      receiptDate: date.confidence,
      vendorName: vendor.confidence,
    },
    lines: lines.map(l => l.text),
  }
}

/** 이 값 아래면 화면에서 "확인해주세요"를 띄운다. */
export const CONFIDENCE_THRESHOLD = 0.85
