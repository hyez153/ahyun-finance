import { NextRequest, NextResponse } from 'next/server'
import { parseReceiptFields, OcrField } from '@/lib/receipt-parser'

export const runtime = 'nodejs'
export const maxDuration = 30

/** CLOVA가 받는 포맷. 그 외는 거른다. */
const MIME_TO_FORMAT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/tiff': 'tiff',
  'application/pdf': 'pdf',
}

/** CLOVA 상한은 50MB지만, Vercel 요청 본문 한도(4.5MB)가 먼저 걸린다. */
const MAX_BYTES = 4 * 1024 * 1024

export async function POST(req: NextRequest) {
  const invokeUrl = process.env.CLOVA_OCR_INVOKE_URL
  const secret = process.env.CLOVA_OCR_SECRET

  // 키가 없으면 OCR만 조용히 꺼진다. 영수증 등록 자체는 계속 되게 한다.
  if (!invokeUrl || !secret) {
    return NextResponse.json({ error: 'OCR이 설정되지 않았습니다.' }, { status: 503 })
  }

  let file: File | null = null
  try {
    const formData = await req.formData()
    const f = formData.get('file')
    if (f instanceof File) file = f
  } catch {
    return NextResponse.json({ error: '파일을 읽지 못했습니다.' }, { status: 400 })
  }

  if (!file) {
    return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })
  }

  const format = MIME_TO_FORMAT[file.type]
  if (!format) {
    return NextResponse.json({ error: `지원하지 않는 형식입니다: ${file.type}` }, { status: 400 })
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: '파일이 너무 큽니다.' }, { status: 413 })
  }

  const base64 = Buffer.from(await file.arrayBuffer()).toString('base64')

  let clovaRes: Response
  try {
    clovaRes = await fetch(invokeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OCR-SECRET': secret,
      },
      body: JSON.stringify({
        version: 'V2',
        requestId: crypto.randomUUID(),
        timestamp: Date.now(),
        lang: 'ko',
        images: [{ format, name: 'receipt', data: base64 }],
      }),
      signal: AbortSignal.timeout(25_000),
    })
  } catch (err) {
    console.error('CLOVA 호출 실패:', err)
    return NextResponse.json({ error: 'OCR 서버에 연결하지 못했습니다.' }, { status: 502 })
  }

  if (!clovaRes.ok) {
    // 본문에 Secret Key가 섞여 나올 일은 없지만, 응답 전문은 서버 로그에만 남긴다.
    console.error('CLOVA 응답 오류:', clovaRes.status, await clovaRes.text().catch(() => ''))
    return NextResponse.json({ error: 'OCR 인식에 실패했습니다.' }, { status: 502 })
  }

  const body = await clovaRes.json()
  const image = body?.images?.[0]

  if (image?.inferResult !== 'SUCCESS') {
    console.error('CLOVA 인식 실패:', image?.inferResult, image?.message)
    return NextResponse.json({ error: '영수증을 읽지 못했습니다.' }, { status: 422 })
  }

  const fields: OcrField[] = image.fields ?? []
  if (fields.length === 0) {
    return NextResponse.json({ error: '글자를 찾지 못했습니다.' }, { status: 422 })
  }

  const parsed = parseReceiptFields(fields)

  return NextResponse.json({
    amount: parsed.amount,
    receiptDate: parsed.receiptDate,
    vendorName: parsed.vendorName,
    confidence: parsed.confidence,
  })
}
