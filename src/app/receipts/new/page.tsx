'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { BudgetCategory } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Upload, Loader2, Camera, ScanLine, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { getCurrentCycleLabel } from '@/lib/claim-cycle'
import { CONFIDENCE_THRESHOLD } from '@/lib/receipt-parser'

const GROUP_ORDER = ['목회', '양육', '사역', '행사'] as const

interface BudgetInfo {
  annual_budget: number
  confirmed: number
  pending: number
  remaining: number
}

/** OCR이 자동으로 채운 칸 — 확신도가 낮으면 "확인해주세요"를 띄운다. */
type OcrMark = 'confident' | 'uncertain'
type OcrMarks = Partial<Record<'amount' | 'receipt_date' | 'vendor_name', OcrMark>>

function markOf(confidence: number | null): OcrMark | undefined {
  if (confidence === null) return undefined
  return confidence >= CONFIDENCE_THRESHOLD ? 'confident' : 'uncertain'
}

/** OCR이 채운 칸 아래에 붙는 안내. 손대면 사라진다. */
function OcrHint({ mark }: { mark?: OcrMark }) {
  if (mark === 'uncertain') {
    return (
      <p className="flex items-center gap-1 text-xs font-medium text-amber-600">
        <AlertTriangle className="w-3 h-3 shrink-0" />
        잘못 읽었을 수 있어요 — 확인해주세요
      </p>
    )
  }
  if (mark === 'confident') {
    return (
      <p className="flex items-center gap-1 text-xs text-slate-400">
        <ScanLine className="w-3 h-3 shrink-0" />
        영수증에서 자동 입력 — 확인해주세요
      </p>
    )
  }
  return null
}

function ocrBorder(mark?: OcrMark): string {
  if (mark === 'uncertain') return 'border-amber-400 bg-amber-50/40 focus-visible:ring-amber-400'
  if (mark === 'confident') return 'border-blue-200 bg-blue-50/30'
  return ''
}

export default function NewReceiptPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [categories, setCategories] = useState<BudgetCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [budgetInfo, setBudgetInfo] = useState<BudgetInfo | null>(null)
  const [budgetLoading, setBudgetLoading] = useState(false)
  const [showLeaderSelect, setShowLeaderSelect] = useState(false)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrMarks, setOcrMarks] = useState<OcrMarks>({})
  // 사용자가 직접 고친 칸. OCR 응답이 늦게 와도 덮어쓰지 않도록 ref로 들고 있는다.
  const touchedRef = useRef<Set<string>>(new Set())

  const [birthdayClimbType, setBirthdayClimbType] = useState<'생일' | '등반' | ''>('')

  const [form, setForm] = useState({
    submitter_name: '',
    payer_name: '',
    budget_category_id: '',
    amount: '',
    receipt_date: new Date().toISOString().split('T')[0],
    vendor_name: '',
    memo: '',
  })

  // 로그인된 사용자 이름 자동 입력
  useEffect(() => {
    if (user && !form.submitter_name) {
      setForm(f => ({ ...f, submitter_name: user.name }))
    }
  }, [user])

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    supabase.from('budget_categories').select('*').order('group_name').then(({ data }) => {
      setCategories((data as BudgetCategory[]) ?? [])
    })
  }, [])

  // 카테고리 선택 시 잔액 조회
  useEffect(() => {
    if (!form.budget_category_id) {
      setBudgetInfo(null)
      return
    }
    const catId = Number(form.budget_category_id)
    const cat = categories.find(c => c.id === catId)
    if (!cat) return

    setBudgetLoading(true)
    Promise.all([
      supabase.from('budget_transactions').select('amount').eq('budget_category_id', catId),
      supabase.from('receipts').select('amount').eq('budget_category_id', catId).eq('status', 'submitted').eq('is_claimed', false),
    ]).then(([txRes, receiptRes]) => {
      const confirmed = (txRes.data ?? []).reduce((sum: number, t: { amount: number }) => sum + Math.abs(t.amount), 0)
      const pending = (receiptRes.data ?? []).reduce((sum: number, r: { amount: number }) => sum + Number(r.amount), 0)
      const remaining = cat.annual_budget - confirmed - pending

      setBudgetInfo({ annual_budget: cat.annual_budget, confirmed, pending, remaining })
      setBudgetLoading(false)
    })
  }, [form.budget_category_id, categories])

  // 소그룹 리더 카테고리와 일반 카테고리 분리
  const leaderCategories = categories
    .filter(c => c.category_name.startsWith('소그룹_'))
    .sort((a, b) => a.category_name.localeCompare(b.category_name, 'ko'))
  const mainCategories = categories.filter(c => !c.category_name.startsWith('소그룹_'))

  const grouped = GROUP_ORDER.map(g => ({
    group: g,
    items: mainCategories.filter(c => c.group_name === g),
  }))

  // 생일/등반 카테고리인지 판별
  const selectedCat = categories.find(c => String(c.id) === form.budget_category_id)
  const isBirthdayClimbCategory = selectedCat?.category_name === '생일/등반'

  const BIRTHDAY_MAX = 10000

  const rawAmount = Number(form.amount.replace(/,/g, '')) || 0
  const isOverBudget = budgetInfo !== null && rawAmount > budgetInfo.remaining
  const isBirthdayOverMax = isBirthdayClimbCategory && birthdayClimbType === '생일' && rawAmount > BIRTHDAY_MAX

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return toast.error('영수증 파일을 첨부해주세요.')
    if (!form.budget_category_id) return toast.error('예산 항목을 선택해주세요.')
    if (isBirthdayClimbCategory && !birthdayClimbType) return toast.error('생일/등반 중 사용 구분을 선택해주세요.')
    if (isBirthdayOverMax) return toast.error(`생일은 최대 ${BIRTHDAY_MAX.toLocaleString('ko-KR')}원까지 가능합니다.`)
    if (isOverBudget) return toast.error('잔액을 초과하는 금액은 제출할 수 없습니다.')

    setLoading(true)
    try {
      const ext = file.name.split('.').pop()
      const randomId = Math.random().toString(36).slice(2, 10)
      const filePath = `${Date.now()}-${randomId}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('receipts').getPublicUrl(filePath)

      // 생일/등반인 경우 서브타입을 메모 앞에 표시
      const memoPrefix = isBirthdayClimbCategory && birthdayClimbType ? `[${birthdayClimbType}] ` : ''
      const finalMemo = (memoPrefix + (form.memo || '')).trim() || null

      const { error: insertError } = await supabase.from('receipts').insert({
        submitter_name: form.submitter_name,
        payer_name: form.payer_name.trim() || null,
        budget_category_id: Number(form.budget_category_id),
        amount: Number(form.amount.replace(/,/g, '')),
        receipt_date: form.receipt_date,
        vendor_name: form.vendor_name,
        memo: finalMemo,
        file_url: urlData.publicUrl,
        file_path: filePath,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      })

      if (insertError) throw insertError

      toast.success('영수증이 제출되었습니다.')
      router.push('/receipts')
    } catch (err) {
      console.error(err)
      toast.error('제출 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 이미지 압축 함수 (최대 1280px, 품질 0.6)
  async function compressImage(file: File, maxWidth = 1280, quality = 0.6): Promise<File> {
    if (file.type === 'application/pdf') return file // PDF는 압축하지 않음

    return new Promise((resolve) => {
      const img = new Image()
      const reader = new FileReader()
      reader.onload = (e) => {
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let { width, height } = img
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, width, height)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressed = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' })
                resolve(compressed)
              } else {
                resolve(file)
              }
            },
            'image/jpeg',
            quality
          )
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  async function handleFileSelect(selectedFile: File) {
    const compressed = await compressImage(selectedFile)
    setFile(compressed)
    // 원본 대비 압축률 표시
    if (selectedFile.type !== 'application/pdf' && compressed.size < selectedFile.size) {
      const saved = Math.round((1 - compressed.size / selectedFile.size) * 100)
      toast.success(`이미지 압축 완료 (${saved}% 절약)`)
    }

    // OCR에는 저장본(1280px/품질 0.6)이 아니라 고화질본을 보낸다.
    // 저장본은 글자가 뭉개져 인식률이 떨어진다.
    const forOcr = await compressImage(selectedFile, 2048, 0.9)
    runOcr(forOcr)
  }

  async function runOcr(target: File) {
    setOcrLoading(true)
    try {
      const body = new FormData()
      body.append('file', target)
      const res = await fetch('/api/ocr', { method: 'POST', body })

      if (!res.ok) {
        // OCR이 실패해도 등록은 계속 되어야 한다. 손으로 채우면 그만이다.
        // 503은 OCR 미설정 — 사용자에게 알릴 필요 없다.
        if (res.status !== 503) {
          toast.info('영수증을 자동으로 읽지 못했어요. 직접 입력해주세요.')
        }
        return
      }

      applyOcr(await res.json())
    } catch {
      toast.info('영수증을 자동으로 읽지 못했어요. 직접 입력해주세요.')
    } finally {
      setOcrLoading(false)
    }
  }

  /** OCR 결과를 폼에 채운다. 사용자가 이미 손댄 칸은 건드리지 않는다. */
  function applyOcr(data: {
    amount: number | null
    receiptDate: string | null
    vendorName: string | null
    confidence: { amount: number | null; receiptDate: number | null; vendorName: number | null }
  }) {
    const marks: OcrMarks = {}
    const touched = touchedRef.current

    setForm(f => {
      const next = { ...f }
      if (data.amount !== null && !touched.has('amount')) {
        next.amount = data.amount.toLocaleString('ko-KR')
        marks.amount = markOf(data.confidence.amount)
      }
      if (data.receiptDate !== null && !touched.has('receipt_date')) {
        next.receipt_date = data.receiptDate
        marks.receipt_date = markOf(data.confidence.receiptDate)
      }
      if (data.vendorName !== null && !touched.has('vendor_name')) {
        next.vendor_name = data.vendorName
        marks.vendor_name = markOf(data.confidence.vendorName)
      }
      return next
    })

    setOcrMarks(marks)

    const filled = Object.keys(marks).length
    if (filled === 0) {
      toast.info('영수증에서 읽을 값을 찾지 못했어요. 직접 입력해주세요.')
      return
    }
    const uncertain = Object.values(marks).filter(m => m === 'uncertain').length
    if (uncertain > 0) {
      toast.warning(`${filled}개 칸을 채웠어요. 표시된 칸은 꼭 확인해주세요.`)
    } else {
      toast.success(`${filled}개 칸을 자동으로 채웠어요. 맞는지 확인해주세요.`)
    }
  }

  /** 사용자가 직접 고친 칸은 OCR이 덮어쓰지 않고, "확인해주세요" 표시도 지운다. */
  function markTouched(field: 'amount' | 'receipt_date' | 'vendor_name') {
    touchedRef.current.add(field)
    setOcrMarks(m => {
      if (!(field in m)) return m
      const next = { ...m }
      delete next[field]
      return next
    })
  }

  function handleAmountChange(v: string) {
    const raw = v.replace(/[^0-9]/g, '')
    const formatted = raw ? Number(raw).toLocaleString('ko-KR') : ''
    setForm(f => ({ ...f, amount: formatted }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/"><ArrowLeft className="w-5 h-5 text-slate-500" /></Link>
          <h1 className="font-semibold text-slate-800">영수증 등록</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-800">{getCurrentCycleLabel()}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="submitter_name">제출자 이름 *</Label>
                  <Input
                    id="submitter_name"
                    placeholder="예) 홍길동"
                    value={form.submitter_name}
                    onChange={e => setForm(f => ({ ...f, submitter_name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="payer_name">결제자 이름</Label>
                  <Input
                    id="payer_name"
                    placeholder="제출자와 같으면 비워두세요"
                    value={form.payer_name}
                    onChange={e => setForm(f => ({ ...f, payer_name: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>예산 항목 *</Label>
                <Select
                  value={showLeaderSelect ? String(mainCategories.find(c => c.category_name === '소그룹 운영비')?.id ?? '') || null : form.budget_category_id || null}
                  onValueChange={(val) => {
                    const cat = mainCategories.find(c => String(c.id) === val)
                    if (cat?.category_name === '소그룹 운영비') {
                      setShowLeaderSelect(true)
                      setForm(f => ({ ...f, budget_category_id: '' }))
                    } else {
                      setShowLeaderSelect(false)
                      setForm(f => ({ ...f, budget_category_id: val ?? '' }))
                    }
                    // 생일/등반이 아닌 카테고리로 변경 시 서브타입 초기화
                    if (cat?.category_name !== '생일/등반') {
                      setBirthdayClimbType('')
                    }
                  }}
                  required={!showLeaderSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="항목 선택">
                      {(() => {
                        if (showLeaderSelect) return '소그룹 운영비'
                        const selected = mainCategories.find(c => String(c.id) === form.budget_category_id)
                        return selected ? selected.category_name : null
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {grouped.map(({ group, items }) =>
                      items.length > 0 ? (
                        <SelectGroup key={group}>
                          <SelectLabel className="text-xs text-slate-400">{group}</SelectLabel>
                          {items.map(c => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.category_name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ) : null
                    )}
                  </SelectContent>
                </Select>
              </div>

              {showLeaderSelect && (
                <div className="space-y-1.5">
                  <Label>소그룹 리더 선택 *</Label>
                  <Select
                    value={form.budget_category_id || null}
                    onValueChange={(val) => setForm(f => ({ ...f, budget_category_id: val ?? '' }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="리더 선택">
                        {(() => {
                          const selected = leaderCategories.find(c => String(c.id) === form.budget_category_id)
                          return selected ? selected.category_name.replace('소그룹_', '') : null
                        })()}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {leaderCategories.map(c => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.category_name.replace('소그룹_', '')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* 생일/등반 서브타입 선택 */}
              {isBirthdayClimbCategory && (
                <div className="space-y-1.5">
                  <Label>사용 구분 *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBirthdayClimbType('생일')}
                      className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                        birthdayClimbType === '생일'
                          ? 'border-purple-400 bg-purple-50 text-purple-700 ring-2 ring-purple-200'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      🎂 생일
                      <span className="block text-xs font-normal mt-0.5 text-slate-400">
                        최대 {BIRTHDAY_MAX.toLocaleString('ko-KR')}원
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBirthdayClimbType('등반')}
                      className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                        birthdayClimbType === '등반'
                          ? 'border-purple-400 bg-purple-50 text-purple-700 ring-2 ring-purple-200'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      ⛰️ 등반
                      <span className="block text-xs font-normal mt-0.5 text-slate-400">
                        잔액 내 자유
                      </span>
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="amount">금액 *</Label>
                  <Input
                    id="amount"
                    placeholder="0"
                    value={form.amount}
                    onChange={e => {
                      markTouched('amount')
                      handleAmountChange(e.target.value)
                    }}
                    inputMode="numeric"
                    required
                    className={
                      // 잔액 초과 경고가 OCR 표시보다 중요하다 — 빨강이 이긴다.
                      (isOverBudget || isBirthdayOverMax)
                        ? 'border-red-400 focus-visible:ring-red-400'
                        : ocrBorder(ocrMarks.amount)
                    }
                  />
                  {!isOverBudget && !isBirthdayOverMax && <OcrHint mark={ocrMarks.amount} />}
                  {budgetLoading && (
                    <p className="text-xs text-slate-400">잔액 조회 중...</p>
                  )}
                  {isBirthdayOverMax && (
                    <p className="text-xs font-medium text-red-500">
                      생일은 최대 {BIRTHDAY_MAX.toLocaleString('ko-KR')}원까지 가능합니다
                    </p>
                  )}
                  {budgetInfo && !budgetLoading && (
                    <div className="space-y-0.5">
                      <p className={`text-xs font-medium ${isOverBudget ? 'text-red-500' : 'text-slate-500'}`}>
                        잔액: {budgetInfo.remaining.toLocaleString('ko-KR')}원
                        {isOverBudget && ' (초과!)'}
                      </p>
                      {budgetInfo.pending > 0 && (
                        <p className="text-xs text-amber-500">
                          청구 대기: {budgetInfo.pending.toLocaleString('ko-KR')}원
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="receipt_date">사용일 *</Label>
                  <Input
                    id="receipt_date"
                    type="date"
                    value={form.receipt_date}
                    onChange={e => {
                      markTouched('receipt_date')
                      setForm(f => ({ ...f, receipt_date: e.target.value }))
                    }}
                    required
                    className={ocrBorder(ocrMarks.receipt_date)}
                  />
                  <OcrHint mark={ocrMarks.receipt_date} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vendor_name">사용처 *</Label>
                <Input
                  id="vendor_name"
                  placeholder="예) 스타벅스 홍대점"
                  value={form.vendor_name}
                  onChange={e => {
                    markTouched('vendor_name')
                    setForm(f => ({ ...f, vendor_name: e.target.value }))
                  }}
                  required
                  className={ocrBorder(ocrMarks.vendor_name)}
                />
                <OcrHint mark={ocrMarks.vendor_name} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="memo">적요</Label>
                <Textarea
                  id="memo"
                  placeholder="예) 임형재 최예지 외 2명 / 소그룹 리더 모임"
                  value={form.memo}
                  onChange={e => setForm(f => ({ ...f, memo: e.target.value }))}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">영수증 파일 *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {file ? (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border">
                  {file.type.startsWith('image/') && (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="미리보기"
                      className="w-16 h-20 object-cover rounded border"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                    {ocrLoading ? (
                      <p className="flex items-center gap-1 text-xs font-medium text-blue-500">
                        <Loader2 className="w-3 h-3 shrink-0 animate-spin" />
                        영수증 읽는 중...
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null)
                      setOcrMarks({})
                    }}
                    className="text-xs text-red-400 hover:text-red-600 shrink-0"
                  >
                    삭제
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {/* 카메라 촬영 */}
                  <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-blue-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                    <Camera className="w-6 h-6 text-blue-400 mb-1.5" />
                    <span className="text-sm font-medium text-blue-500">카메라 촬영</span>
                    <span className="text-xs text-blue-300 mt-0.5">바로 찍어서 올리기</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={e => {
                        const f = e.target.files?.[0]
                        if (f) handleFileSelect(f)
                      }}
                    />
                  </label>
                  {/* 파일 선택 */}
                  <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                    <span className="text-sm font-medium text-slate-500">파일 선택</span>
                    <span className="text-xs text-slate-300 mt-0.5">JPG, PNG, PDF</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={e => {
                        const f = e.target.files?.[0]
                        if (f) handleFileSelect(f)
                      }}
                    />
                  </label>
                </div>
              )}
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={loading || isOverBudget || isBirthdayOverMax}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />제출 중...</> : isBirthdayOverMax ? '생일 상한 초과 — 제출 불가' : isOverBudget ? '잔액 초과 — 제출 불가' : '영수증 제출'}
          </Button>
        </form>
      </div>
    </div>
  )
}
