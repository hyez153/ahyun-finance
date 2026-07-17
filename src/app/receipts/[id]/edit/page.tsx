'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { BudgetCategory, Receipt } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { isUploadBlocked } from '@/lib/claim-cycle'
import {
  BIRTHDAY_MAX,
  BIRTHDAY_CLIMB_CATEGORY,
  BirthdayClimbType,
  BudgetInfo,
  splitCategories,
  parseMemo,
  buildMemo,
  parseAmount,
  formatAmountInput,
  isEditable,
  canModify,
} from '@/lib/receipt-rules'

export default function EditReceiptPage() {
  const router = useRouter()
  const params = useParams()
  const receiptId = Number(params.id)
  const { user, loading: authLoading, isAdmin } = useAuth()

  const [categories, setCategories] = useState<BudgetCategory[]>([])
  const [original, setOriginal] = useState<Receipt | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [budgetInfo, setBudgetInfo] = useState<BudgetInfo | null>(null)
  const [budgetLoading, setBudgetLoading] = useState(false)
  const [showLeaderSelect, setShowLeaderSelect] = useState(false)
  const [birthdayClimbType, setBirthdayClimbType] = useState<BirthdayClimbType>('')
  const [blocked, setBlocked] = useState(false)

  const [form, setForm] = useState({
    submitter_name: '',
    payer_name: '',
    budget_category_id: '',
    amount: '',
    receipt_date: '',
    vendor_name: '',
    memo: '',
  })

  // 토요일 22:00이 되면 수정도 잠근다 (등록과 같은 규칙).
  useEffect(() => {
    const check = () => setBlocked(isUploadBlocked())
    check()
    const timer = setInterval(check, 20_000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [authLoading, user, router])

  useEffect(() => {
    supabase.from('budget_categories').select('*').order('group_name').then(({ data }) => {
      setCategories((data as BudgetCategory[]) ?? [])
    })
  }, [])

  // 영수증 불러오기 + 수정 가능 여부 검사
  useEffect(() => {
    if (!user || Number.isNaN(receiptId)) return

    supabase.from('receipts').select('*').eq('id', receiptId).single().then(({ data, error }) => {
      setPageLoading(false)
      if (error || !data) {
        setLoadError('영수증을 찾을 수 없습니다.')
        return
      }
      const r = data as Receipt

      if (!canModify(r, user.name, isAdmin)) {
        setLoadError('이 영수증을 수정할 권한이 없습니다.')
        return
      }
      if (!isEditable(r)) {
        setLoadError('이미 청구된 영수증은 수정할 수 없습니다.')
        return
      }

      const { type, text } = parseMemo(r.memo)
      setBirthdayClimbType(type)
      setOriginal(r)
      setForm({
        submitter_name: r.submitter_name,
        payer_name: r.payer_name ?? '',
        budget_category_id: String(r.budget_category_id),
        amount: r.amount.toLocaleString('ko-KR'),
        receipt_date: r.receipt_date,
        vendor_name: r.vendor_name,
        memo: text,
      })

      // 불러온 카테고리가 소그룹 리더용이면 리더 선택 UI를 펼쳐둔다.
      if (categories.length > 0) {
        const cat = categories.find(c => c.id === r.budget_category_id)
        if (cat?.category_name.startsWith('소그룹_')) setShowLeaderSelect(true)
      }
    })
  }, [user, isAdmin, receiptId, categories])

  const { leader: leaderCategories, main: mainCategories, grouped } = splitCategories(categories)

  // 카테고리 선택 시 잔액 조회 (등록 화면과 동일하되, 수정 중인 이 영수증은 빼고 계산)
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
      supabase.from('receipts').select('id, amount').eq('budget_category_id', catId).eq('status', 'submitted').eq('is_claimed', false),
    ]).then(([txRes, receiptRes]) => {
      const confirmed = (txRes.data ?? []).reduce((s: number, t: { amount: number }) => s + Math.abs(t.amount), 0)
      // 지금 수정 중인 영수증은 청구 대기 합계에서 뺀다 — 자기 금액과 중복 계산 방지.
      const pending = (receiptRes.data ?? [])
        .filter((r: { id: number }) => r.id !== receiptId)
        .reduce((s: number, r: { amount: number }) => s + Number(r.amount), 0)
      setBudgetInfo({
        annual_budget: cat.annual_budget,
        confirmed,
        pending,
        remaining: cat.annual_budget - confirmed - pending,
      })
      setBudgetLoading(false)
    })
  }, [form.budget_category_id, categories, receiptId])

  const selectedCat = categories.find(c => String(c.id) === form.budget_category_id)
  const isBirthdayClimbCategory = selectedCat?.category_name === BIRTHDAY_CLIMB_CATEGORY

  const rawAmount = parseAmount(form.amount)
  const isOverBudget = budgetInfo !== null && rawAmount > budgetInfo.remaining
  const isBirthdayOverMax = isBirthdayClimbCategory && birthdayClimbType === '생일' && rawAmount > BIRTHDAY_MAX

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!original) return
    if (isUploadBlocked()) {
      setBlocked(true)
      return toast.error('토요일 22:00~24:00은 청구 정리 시간입니다. 일요일 0시부터 수정해주세요.')
    }
    if (!form.budget_category_id) return toast.error('예산 항목을 선택해주세요.')
    if (isBirthdayClimbCategory && !birthdayClimbType) return toast.error('생일/등반 중 사용 구분을 선택해주세요.')
    if (isBirthdayOverMax) return toast.error(`생일은 최대 ${BIRTHDAY_MAX.toLocaleString('ko-KR')}원까지 가능합니다.`)
    if (isOverBudget) return toast.error('잔액을 초과하는 금액은 제출할 수 없습니다.')

    setLoading(true)
    try {
      const { error } = await supabase.from('receipts').update({
        submitter_name: form.submitter_name,
        payer_name: form.payer_name.trim() || null,
        budget_category_id: Number(form.budget_category_id),
        amount: rawAmount,
        receipt_date: form.receipt_date,
        vendor_name: form.vendor_name,
        memo: buildMemo(birthdayClimbType, form.memo),
      }).eq('id', original.id)

      if (error) {
        // 청구됨/정리시간 트리거(P0001)는 DB가 준 한국어 안내를 그대로 보여준다.
        if (error.code === 'P0001') {
          setBlocked(isUploadBlocked())
          toast.error(error.message)
          return
        }
        throw error
      }

      toast.success('영수증이 수정되었습니다.')
      router.push('/receipts')
    } catch (err) {
      console.error(err)
      toast.error('수정 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || pageLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <Link href="/receipts"><ArrowLeft className="w-5 h-5 text-slate-500" /></Link>
            <h1 className="font-semibold text-slate-800">영수증 수정</h1>
          </div>
        </header>
        <div className="max-w-lg mx-auto px-4 py-12 text-center">
          <p className="text-sm text-slate-500">{loadError}</p>
          <Link href="/receipts">
            <Button variant="outline" className="mt-4">제출 내역으로</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/receipts"><ArrowLeft className="w-5 h-5 text-slate-500" /></Link>
          <h1 className="font-semibold text-slate-800">영수증 수정</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4">
        {blocked && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-800">토요일 22:00~24:00은 청구 정리 시간이라 수정할 수 없어요</p>
            <p className="text-xs text-red-600 mt-1">일요일 0시부터 다시 수정할 수 있어요</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="submitter_name">제출자 이름 *</Label>
                  <Input id="submitter_name" value={form.submitter_name}
                    onChange={e => setForm(f => ({ ...f, submitter_name: e.target.value }))} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="payer_name">결제자 이름</Label>
                  <Input id="payer_name" placeholder="제출자와 같으면 비워두세요" value={form.payer_name}
                    onChange={e => setForm(f => ({ ...f, payer_name: e.target.value }))} />
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
                    if (cat?.category_name !== BIRTHDAY_CLIMB_CATEGORY) setBirthdayClimbType('')
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
                            <SelectItem key={c.id} value={String(c.id)}>{c.category_name}</SelectItem>
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
                  <Select value={form.budget_category_id || null}
                    onValueChange={(val) => setForm(f => ({ ...f, budget_category_id: val ?? '' }))} required>
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
                        <SelectItem key={c.id} value={String(c.id)}>{c.category_name.replace('소그룹_', '')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {isBirthdayClimbCategory && (
                <div className="space-y-1.5">
                  <Label>사용 구분 *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setBirthdayClimbType('생일')}
                      className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${birthdayClimbType === '생일' ? 'border-purple-400 bg-purple-50 text-purple-700 ring-2 ring-purple-200' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      🎂 생일<span className="block text-xs font-normal mt-0.5 text-slate-400">최대 {BIRTHDAY_MAX.toLocaleString('ko-KR')}원</span>
                    </button>
                    <button type="button" onClick={() => setBirthdayClimbType('등반')}
                      className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${birthdayClimbType === '등반' ? 'border-purple-400 bg-purple-50 text-purple-700 ring-2 ring-purple-200' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      ⛰️ 등반<span className="block text-xs font-normal mt-0.5 text-slate-400">잔액 내 자유</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="amount">금액 *</Label>
                  <Input id="amount" placeholder="0" value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: formatAmountInput(e.target.value) }))}
                    inputMode="numeric" required
                    className={(isOverBudget || isBirthdayOverMax) ? 'border-red-400 focus-visible:ring-red-400' : ''} />
                  {budgetLoading && <p className="text-xs text-slate-400">잔액 조회 중...</p>}
                  {isBirthdayOverMax && (
                    <p className="text-xs font-medium text-red-500">생일은 최대 {BIRTHDAY_MAX.toLocaleString('ko-KR')}원까지 가능합니다</p>
                  )}
                  {budgetInfo && !budgetLoading && (
                    <p className={`text-xs font-medium ${isOverBudget ? 'text-red-500' : 'text-slate-500'}`}>
                      잔액: {budgetInfo.remaining.toLocaleString('ko-KR')}원{isOverBudget && ' (초과!)'}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="receipt_date">사용일 *</Label>
                  <Input id="receipt_date" type="date" value={form.receipt_date}
                    onChange={e => setForm(f => ({ ...f, receipt_date: e.target.value }))} required />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vendor_name">사용처 *</Label>
                <Input id="vendor_name" placeholder="예) 스타벅스 홍대점" value={form.vendor_name}
                  onChange={e => setForm(f => ({ ...f, vendor_name: e.target.value }))} required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="memo">적요</Label>
                <Textarea id="memo" value={form.memo}
                  onChange={e => setForm(f => ({ ...f, memo: e.target.value }))} rows={2} />
              </div>
            </CardContent>
          </Card>

          {original?.file_url && original.file_url !== '실물영수증제출' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-600">영수증 파일</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-400 mb-2">사진은 이 화면에서 바꿀 수 없어요. 사진을 다시 올려야 하면 삭제 후 새로 등록해주세요.</p>
                <img src={original.file_url} alt={original.vendor_name}
                  className="rounded-md border border-slate-200 object-contain bg-slate-50" style={{ maxHeight: '200px' }} />
              </CardContent>
            </Card>
          )}

          <Button type="submit" className="w-full" disabled={loading || blocked || isOverBudget || isBirthdayOverMax}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />저장 중...</> : blocked ? '청구 정리 시간 — 수정 불가' : isBirthdayOverMax ? '생일 상한 초과 — 저장 불가' : isOverBudget ? '잔액 초과 — 저장 불가' : '수정 저장'}
          </Button>
        </form>
      </div>
    </div>
  )
}
