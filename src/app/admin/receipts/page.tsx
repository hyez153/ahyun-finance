'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Receipt } from '@/types/database'
import { formatKRW, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Printer, Image as ImageIcon, Trash2 } from 'lucide-react'

const STATUS_MAP = {
  draft: { label: '임시저장', variant: 'secondary' as const },
  submitted: { label: '제출됨', variant: 'default' as const },
  approved: { label: '승인됨', variant: 'outline' as const },
}

export default function AdminReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [claimFilter, setClaimFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('all')
  const [deleting, setDeleting] = useState<number | null>(null)

  async function handleDelete(id: number) {
    const receipt = receipts.find(r => r.id === id)
    if (!receipt) return

    const msg = receipt.claim_batch_id
      ? '이 영수증은 청구 배치에 포함되어 있습니다. 삭제하면 배치에서도 제거됩니다. 삭제하시겠습니까?'
      : '이 영수증을 삭제하시겠습니까?'
    if (!window.confirm(msg)) return

    setDeleting(id)

    // 배치에 연결된 경우 배치 total_amount 갱신
    if (receipt.claim_batch_id) {
      const { data: batchData } = await supabase
        .from('claim_batches')
        .select('total_amount')
        .eq('id', receipt.claim_batch_id)
        .single()
      if (batchData) {
        await supabase.from('claim_batches').update({
          total_amount: Math.max(0, (batchData.total_amount || 0) - receipt.amount),
        }).eq('id', receipt.claim_batch_id)
      }
    }

    const { error } = await supabase.from('receipts').delete().eq('id', id)
    if (error) {
      alert('삭제 실패: ' + error.message)
    } else {
      setReceipts(prev => prev.filter(r => r.id !== id))
    }
    setDeleting(null)
  }

  useEffect(() => {
    supabase
      .from('receipts')
      .select('*, budget_categories(group_name, category_name), claim_batches(claim_date)')
      .order('receipt_date', { ascending: false })
      .then(({ data }) => {
        setReceipts((data as Receipt[]) ?? [])
        setLoading(false)
      })
  }, [])

  // 청구주기: 배치 연결 시 claim_date, 미배정(마이그레이션)은 receipt_date
  const getClaimDate = (r: Receipt) => (r as any).claim_batches?.claim_date ?? r.receipt_date
  const periodDates = [...new Set(receipts.map(getClaimDate).filter(Boolean) as string[])].sort().reverse()

  const filtered = receipts.filter(r => {
    const matchSearch =
      r.submitter_name.includes(search) ||
      r.vendor_name.includes(search) ||
      r.budget_categories?.category_name?.includes(search)
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    const matchClaim =
      claimFilter === 'all' ||
      (claimFilter === 'unclaimed' && !r.is_claimed) ||
      (claimFilter === 'claimed' && r.is_claimed)
    const claimDate = getClaimDate(r)
    const matchPeriod = periodFilter === 'all' || claimDate === periodFilter
    return matchSearch && matchStatus && matchClaim && matchPeriod
  })

  const totalAmount = filtered.reduce((s, r) => s + r.amount, 0)

  // 카테고리별 그룹핑
  const groupedByCategory: Record<string, { group: string; receipts: Receipt[] }> = {}
  for (const r of filtered) {
    const catName = r.budget_categories?.category_name ?? '미분류'
    const groupName = r.budget_categories?.group_name ?? ''
    if (!groupedByCategory[catName]) {
      groupedByCategory[catName] = { group: groupName, receipts: [] }
    }
    groupedByCategory[catName].receipts.push(r)
  }

  const categoryOrder = Object.keys(groupedByCategory).sort((a, b) => a.localeCompare(b, 'ko'))

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h2 className="text-lg font-bold text-slate-800">영수증 목록</h2>
          <p className="text-xs text-slate-400">{filtered.length}건 · 합계 {formatKRW(totalAmount)}</p>
        </div>
        <Button onClick={() => window.print()} size="sm" variant="outline" className="gap-2">
          <Printer className="w-4 h-4" />
          인쇄
        </Button>
      </div>

      {/* 필터 */}
      <div className="flex gap-2 flex-wrap print:hidden">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="이름, 사용처, 항목 검색" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={periodFilter} onValueChange={v => setPeriodFilter(v ?? 'all')}>
          <SelectTrigger className="w-44">
            <span className="truncate">
              {periodFilter === 'all'
                ? '청구일 전체'
                : new Date(periodFilter).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">청구일 전체</SelectItem>
            {periodDates.map(d => (
              <SelectItem key={d} value={d}>
                {new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={v => setStatusFilter(v ?? 'all')}>
          <SelectTrigger className="w-36">
            <span className="truncate">
              {{ all: '처리상태 전체', draft: '임시저장', submitted: '제출됨', approved: '승인됨' }[statusFilter]}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">처리상태 전체</SelectItem>
            <SelectItem value="draft">임시저장</SelectItem>
            <SelectItem value="submitted">제출됨</SelectItem>
            <SelectItem value="approved">승인됨</SelectItem>
          </SelectContent>
        </Select>
        <Select value={claimFilter} onValueChange={v => setClaimFilter(v ?? 'all')}>
          <SelectTrigger className="w-36">
            <span className="truncate">
              {{ all: '청구여부 전체', unclaimed: '미청구', claimed: '청구완료' }[claimFilter]}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">청구여부 전체</SelectItem>
            <SelectItem value="unclaimed">미청구</SelectItem>
            <SelectItem value="claimed">청구완료</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 인쇄용 제목 (화면에서는 숨김) */}
      <div className="hidden print:block text-center mb-6 pb-4 border-b-2">
        <h1 className="text-2xl font-bold text-slate-900">
          아현젊은이 교회 영수증 내역
          {periodFilter !== 'all' && (
            <span className="text-lg font-normal text-slate-500 ml-2">
              ({new Date(periodFilter).toLocaleDateString('ko-KR')})
            </span>
          )}
        </h1>
        <p className="text-sm text-slate-500 mt-2">{filtered.length}건 · 합계 {formatKRW(totalAmount)}</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 text-sm">불러오는 중...</div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-400 text-sm">영수증이 없습니다.</CardContent></Card>
      ) : (
        <div className="space-y-6">
          {categoryOrder.map(catName => {
            const { group, receipts: catReceipts } = groupedByCategory[catName]
            const catTotal = catReceipts.reduce((s, r) => s + r.amount, 0)

            return (
              <div key={catName} className="print:break-inside-avoid">
                {/* 카테고리 헤더 */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{group}</span>
                    <h3 className="text-sm font-bold text-slate-800">{catName}</h3>
                    <span className="text-xs text-slate-400">{catReceipts.length}건</span>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{formatKRW(catTotal)}</span>
                </div>

                {/* 영수증 카드 목록 */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3">
                  {catReceipts.map(r => {
                    const isPhysical = r.file_url === '실물영수증제출'
                    return (
                      <Card key={r.id} className="overflow-hidden print:break-inside-avoid print:shadow-none print:border">
                        <CardContent className="p-0">
                          {/* 영수증 이미지 영역 — 세로 비율 */}
                          <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
                            {isPhysical ? (
                              <div className="absolute inset-0 border-2 border-dashed border-amber-300 bg-amber-50/80 flex flex-col items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-amber-300 mb-2" />
                                <span className="text-sm text-amber-600 font-semibold">실물영수증</span>
                                <span className="text-xs text-amber-500 mt-0.5">별도 제출</span>
                              </div>
                            ) : (
                              <img
                                src={r.file_url}
                                alt={r.vendor_name}
                                className="absolute inset-0 w-full h-full object-contain bg-slate-50 border-b border-slate-100"
                              />
                            )}
                          </div>

                          {/* 상세 정보 */}
                          <div className="p-3">
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <p className="text-sm font-semibold text-slate-800 truncate">{r.vendor_name}</p>
                              <p className="text-sm font-bold text-slate-800 shrink-0">{formatKRW(r.amount)}</p>
                            </div>
                            <p className="text-xs text-slate-500">
                              {r.submitter_name}
                              {r.memo?.match(/^\[(\d{4}-\d{2}-\d{2})\]/) ? (
                                <>
                                  {' · '}결제 {formatDate(r.memo.match(/^\[(\d{4}-\d{2}-\d{2})\]/)![1])}
                                  {' · '}<span className="text-blue-500">청구 {formatDate(r.receipt_date)}</span>
                                </>
                              ) : (
                                <>
                                  {' · '}결제 {formatDate(r.receipt_date)}
                                  {(r as any).claim_batches?.claim_date && (
                                    <>{' · '}<span className="text-blue-500">청구 {formatDate((r as any).claim_batches.claim_date)}</span></>
                                  )}
                                </>
                              )}
                            </p>
                            {r.memo && (
                              <p className="text-xs text-slate-400 mt-1 truncate">
                                {r.memo.replace(/^\[\d{4}-\d{2}-\d{2}\]\s*/, '')}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-2 print:hidden">
                              <div className="flex items-center gap-1.5">
                                <Badge variant={STATUS_MAP[r.status].variant} className="text-xs">
                                  {STATUS_MAP[r.status].label}
                                </Badge>
                                {r.is_claimed ? (
                                  <Badge variant="outline" className="text-xs text-green-600 border-green-200">청구완료</Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-xs">미청구</Badge>
                                )}
                              </div>
                              <button
                                onClick={() => handleDelete(r.id)}
                                disabled={deleting === r.id}
                                className="p-1.5 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                title="삭제"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <style jsx>{`
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 15mm; size: A4; }
        }
      `}</style>
    </div>
  )
}
