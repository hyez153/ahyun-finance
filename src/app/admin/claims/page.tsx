'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { ClaimBatch, Receipt } from '@/types/database'
import { formatKRW, formatDate } from '@/lib/utils'
import { getMonthDeadlines, getClaimDate, getWeekLabel } from '@/lib/claim-cycle'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Loader2, Plus, CheckCircle2, Clock, Printer, FileText, Trash2, Wallet } from 'lucide-react'

export default function ClaimsPage() {
  const [batches, setBatches] = useState<ClaimBatch[]>([])
  const [selectedBatch, setSelectedBatch] = useState<ClaimBatch | null>(null)
  const [batchReceipts, setBatchReceipts] = useState<Receipt[]>([])
  const [pendingReceipts, setPendingReceipts] = useState<Receipt[]>([])
  const [creating, setCreating] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [deletingBatch, setDeletingBatch] = useState(false)

  const loadBatches = useCallback(async () => {
    const { data } = await supabase
      .from('claim_batches')
      .select('*')
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .order('week_no', { ascending: false })
    setBatches((data as ClaimBatch[]) ?? [])
  }, [])

  useEffect(() => { loadBatches() }, [loadBatches])

  async function loadBatchDetails(batch: ClaimBatch) {
    setSelectedBatch(batch)
    const { data } = await supabase
      .from('receipts')
      .select('*, budget_categories(group_name, category_name)')
      .eq('claim_batch_id', batch.id)
    setBatchReceipts((data as Receipt[]) ?? [])

    if (batch.status === 'draft') {
      const { data: pending } = await supabase
        .from('receipts')
        .select('*, budget_categories(group_name, category_name)')
        .eq('is_claimed', false)
        .eq('status', 'submitted')
      setPendingReceipts((pending as Receipt[]) ?? [])
    }
  }

  /** 해당 월에서 아직 배치가 없고 생성 기한도 안 지난 첫 주차 */
  function findOpenSlot(year: number, month: number, now: Date) {
    const deadlines = getMonthDeadlines(year, month)

    for (let i = 0; i < deadlines.length; i++) {
      const weekNo = i + 1
      if (batches.some(b => b.year === year && b.month === month && b.week_no === weekNo)) continue

      // 청구일(일요일) + 3일 = 수요일까지만 배치 생성 가능
      const cutoff = getClaimDate(deadlines[i])
      cutoff.setDate(cutoff.getDate() + 3)
      if (now <= cutoff) return { year, month, week_no: weekNo }
    }
    return null
  }

  /** 다음 생성할 배치(week_no) 결정 — 청구일(일요일) 기준 3일 지나면 건너뜀 */
  function getNextBatchSlot(): { year: number; month: number; week_no: number } | null {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    const thisMonth = findOpenSlot(year, month, now)
    if (thisMonth) return thisMonth

    // 이번 달 모두 지남 → 다음 달 첫 주
    const nextMonth = month === 12 ? 1 : month + 1
    const nextYear = month === 12 ? year + 1 : year
    const hasNext1 = batches.some(b => b.year === nextYear && b.month === nextMonth && b.week_no === 1)
    if (!hasNext1) return { year: nextYear, month: nextMonth, week_no: 1 }

    return null
  }

  async function createBatch() {
    const slot = getNextBatchSlot()
    if (!slot) return toast.error('생성 가능한 배치가 없습니다.')

    setCreating(true)
    const { year, month, week_no } = slot

    const deadline = getMonthDeadlines(year, month)[week_no - 1]
    const claimSunday = getClaimDate(deadline)

    // 로컬 시간 기준 날짜 문자열 (UTC 변환 방지)
    const toLocalDate = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

    const { error } = await supabase.from('claim_batches').insert({
      year,
      month,
      week_no,
      submission_deadline: toLocalDate(deadline),
      claim_date: toLocalDate(claimSunday),
      status: 'draft',
      total_amount: 0,
    })

    if (error) { toast.error('배치 생성 실패'); setCreating(false); return }
    toast.success(`${month}월 ${getWeekLabel(week_no)} 청구 배치 생성 완료`)
    await loadBatches()
    setCreating(false)
  }

  async function confirmBatch() {
    if (!selectedBatch) return
    setConfirming(true)

    // 1. 미청구 영수증 배치에 연결 + 승인 처리
    const receiptIds = pendingReceipts.map(r => r.id)
    if (receiptIds.length > 0) {
      await supabase.from('receipts').update({
        claim_batch_id: selectedBatch.id,
        is_claimed: true,
        status: 'approved',
      }).in('id', receiptIds)
    }

    // 2. 배치 확정
    const totalAmount = pendingReceipts.reduce((s, r) => s + r.amount, 0)
    await supabase.from('claim_batches').update({
      status: 'confirmed',
      total_amount: totalAmount,
    }).eq('id', selectedBatch.id)

    // 3. budget_transactions 생성
    const txRows = pendingReceipts.map(r => ({
      budget_category_id: r.budget_category_id,
      transaction_type: 'monthly_claim' as const,
      amount: -r.amount,
      transaction_date: selectedBatch.claim_date,
      source_type: 'claim_batch' as const,
      source_id: selectedBatch.id,
      memo: `${selectedBatch.year}년 ${selectedBatch.month}월 ${getWeekLabel(selectedBatch.week_no)} 청구 확정`,
    }))

    if (txRows.length > 0) {
      await supabase.from('budget_transactions').insert(txRows)
    }

    toast.success('청구가 확정되었습니다.')
    await loadBatches()
    setSelectedBatch(null)
    setBatchReceipts([])
    setPendingReceipts([])
    setConfirming(false)
  }

  async function deleteBatch() {
    if (!selectedBatch) return

    const msg = selectedBatch.status === 'confirmed'
      ? `이 청구(${selectedBatch.year}년 ${selectedBatch.month}월 ${getWeekLabel(selectedBatch.week_no)})를 삭제하면 포함된 영수증 ${batchReceipts.length}건의 청구 상태가 초기화됩니다. 삭제하시겠습니까?`
      : `이 청구 배치를 삭제하시겠습니까?`

    if (!window.confirm(msg)) return
    setDeletingBatch(true)

    // 1. 확정된 배치면 연결된 영수증의 claim_batch_id, is_claimed, status 초기화
    if (selectedBatch.status === 'confirmed' && batchReceipts.length > 0) {
      const receiptIds = batchReceipts.map(r => r.id)
      await supabase.from('receipts').update({
        claim_batch_id: null,
        is_claimed: false,
        status: 'submitted',
      }).in('id', receiptIds)

      // budget_transactions 도 삭제
      await supabase.from('budget_transactions')
        .delete()
        .eq('source_type', 'claim_batch')
        .eq('source_id', selectedBatch.id)
    }

    // 2. 배치 삭제
    const { error } = await supabase.from('claim_batches').delete().eq('id', selectedBatch.id)
    if (error) {
      toast.error('삭제 실패: ' + error.message)
    } else {
      toast.success('청구 배치가 삭제되었습니다.')
      setSelectedBatch(null)
      setBatchReceipts([])
      setPendingReceipts([])
      await loadBatches()
    }
    setDeletingBatch(false)
  }

  const nextSlot = getNextBatchSlot()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">청구 배치 관리</h2>
          <p className="text-xs text-slate-400">매주 청구를 생성하고 확정합니다</p>
        </div>
        <Button onClick={createBatch} disabled={creating || !nextSlot} size="sm">
          {creating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
          {nextSlot
            ? `${nextSlot.month}월 ${getWeekLabel(nextSlot.week_no)} 배치 생성`
            : '이번 달 완료'}
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          {batches.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-sm text-slate-400">배치가 없습니다.</CardContent></Card>
          ) : batches.map(b => (
            <Card
              key={b.id}
              className={`cursor-pointer hover:shadow-sm transition-all ${selectedBatch?.id === b.id ? 'ring-2 ring-purple-400' : ''}`}
              onClick={() => loadBatchDetails(b)}
            >
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">
                    {b.year}년 {b.month}월 {getWeekLabel(b.week_no)}
                  </CardTitle>
                  <Badge variant={b.status === 'confirmed' ? 'outline' : 'default'} className="text-xs">
                    {b.status === 'confirmed' ? '확정됨' : '진행 중'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">
                  마감 {formatDate(b.submission_deadline)} · {formatKRW(b.total_amount)}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="md:col-span-2">
          {!selectedBatch ? (
            <Card>
              <CardContent className="py-16 text-center text-sm text-slate-400">
                왼쪽에서 배치를 선택하세요
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">
                    {selectedBatch.year}년 {selectedBatch.month}월 {getWeekLabel(selectedBatch.week_no)} 청구
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {selectedBatch.status === 'confirmed' && (
                      <>
                        <Button
                          onClick={() => window.open(`/admin/claims/print?batchId=${selectedBatch.id}`, '_blank')}
                          size="sm"
                          variant="outline"
                        >
                          <Printer className="w-4 h-4 mr-1" />
                          영수증 인쇄
                        </Button>
                        <Button
                          onClick={() => window.open(`/admin/claims/report?batchId=${selectedBatch.id}`, '_blank')}
                          size="sm"
                          variant="outline"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          지출결의서
                        </Button>
                      </>
                    )}
                    {selectedBatch.status === 'draft' && (
                      <Button onClick={confirmBatch} disabled={confirming || pendingReceipts.length === 0} size="sm" className="bg-purple-600 hover:bg-purple-700">
                        {confirming ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
                        청구 확정 ({pendingReceipts.length}건)
                      </Button>
                    )}
                    <Button
                      onClick={deleteBatch}
                      disabled={deletingBatch}
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      {deletingBatch ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1" />}
                      삭제
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>마감: {formatDate(selectedBatch.submission_deadline)}</span>
                  <span>청구일: {formatDate(selectedBatch.claim_date)}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedBatch.status === 'draft' && pendingReceipts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium">청구 대상 ({pendingReceipts.length}건)</span>
                      <span className="text-sm font-bold text-slate-700 ml-auto">
                        {formatKRW(pendingReceipts.reduce((s, r) => s + r.amount, 0))}
                      </span>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>결제자</TableHead>
                          <TableHead>항목</TableHead>
                          <TableHead>사용처</TableHead>
                          <TableHead className="text-right">금액</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingReceipts.map(r => (
                          <TableRow key={r.id}>
                            <TableCell className="text-sm">{r.payer_name || r.submitter_name}</TableCell>
                            <TableCell className="text-sm">{r.budget_categories?.category_name}</TableCell>
                            <TableCell className="text-sm">{r.vendor_name}</TableCell>
                            <TableCell className="text-right text-sm font-medium">{formatKRW(r.amount)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {batchReceipts.length > 0 && (
                  <>
                    {selectedBatch.status === 'draft' && pendingReceipts.length > 0 && <Separator />}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">확정된 영수증 ({batchReceipts.length}건)</span>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>결제자</TableHead>
                            <TableHead>항목</TableHead>
                            <TableHead>사용처</TableHead>
                            <TableHead className="text-right">금액</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {batchReceipts.map(r => (
                            <TableRow key={r.id}>
                              <TableCell className="text-sm">{r.payer_name || r.submitter_name}</TableCell>
                              <TableCell className="text-sm">{r.budget_categories?.category_name}</TableCell>
                              <TableCell className="text-sm">{r.vendor_name}</TableCell>
                              <TableCell className="text-right text-sm font-medium">{formatKRW(r.amount)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}


                {/* 결제자별 정산 금액 */}
                {batchReceipts.length > 0 && (() => {
                  const payerMap: Record<string, number> = {}
                  for (const r of batchReceipts) {
                    const payer = r.payer_name || r.submitter_name
                    payerMap[payer] = (payerMap[payer] || 0) + r.amount
                  }
                  const payerList = Object.entries(payerMap).sort((a, b) => b[1] - a[1])
                  const totalAmount = payerList.reduce((s, [, a]) => s + a, 0)

                  return (
                    <>
                      <Separator />
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Wallet className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">결제자별 정산 금액</span>
                          <span className="text-sm font-bold text-slate-700 ml-auto">{formatKRW(totalAmount)}</span>
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>결제자</TableHead>
                              <TableHead className="text-right">금액</TableHead>
                              <TableHead className="text-right">입금 확인</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {payerList.map(([payer, amount]) => (
                              <TableRow key={payer}>
                                <TableCell className="text-sm font-medium">{payer}</TableCell>
                                <TableCell className="text-right text-sm font-bold text-blue-600">{formatKRW(amount)}</TableCell>
                                <TableCell className="text-right text-xs text-slate-400">—</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  )
                })()}

                {selectedBatch.status === 'confirmed' && batchReceipts.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">포함된 영수증이 없습니다.</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
