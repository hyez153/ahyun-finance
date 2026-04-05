'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { ClaimBatch, Receipt } from '@/types/database'
import { formatKRW, formatDate, getSecondWeekSaturday, getSecondWeekSunday } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Loader2, Plus, CheckCircle2, Clock } from 'lucide-react'

export default function ClaimsPage() {
  const [batches, setBatches] = useState<ClaimBatch[]>([])
  const [selectedBatch, setSelectedBatch] = useState<ClaimBatch | null>(null)
  const [batchReceipts, setBatchReceipts] = useState<Receipt[]>([])
  const [pendingReceipts, setPendingReceipts] = useState<Receipt[]>([])
  const [creating, setCreating] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const loadBatches = useCallback(async () => {
    const { data } = await supabase.from('claim_batches').select('*').order('year', { ascending: false }).order('month', { ascending: false })
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
        .lte('submitted_at', batch.submission_deadline)
      setPendingReceipts((data as Receipt[]) ?? [])
      setPendingReceipts((pending as Receipt[]) ?? [])
    }
  }

  async function createBatch() {
    const now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1

    const existing = batches.find(b => b.year === year && b.month === month)
    if (existing) return toast.error(`${month}월 배치가 이미 존재합니다.`)

    setCreating(true)
    const deadline = getSecondWeekSaturday(year, month)
    const claimDate = getSecondWeekSunday(year, month)

    const { error } = await supabase.from('claim_batches').insert({
      year,
      month,
      submission_deadline: deadline.toISOString(),
      claim_date: claimDate.toISOString().split('T')[0],
      status: 'draft',
      total_amount: 0,
    })

    if (error) { toast.error('배치 생성 실패'); setCreating(false); return }
    toast.success(`${month}월 청구 배치 생성 완료`)
    await loadBatches()
    setCreating(false)
  }

  async function confirmBatch() {
    if (!selectedBatch) return
    setConfirming(true)

    // 1. 미청구 영수증 배치에 연결
    const receiptIds = pendingReceipts.map(r => r.id)
    if (receiptIds.length > 0) {
      await supabase.from('receipts').update({
        claim_batch_id: selectedBatch.id,
        is_claimed: true,
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
      memo: `${selectedBatch.year}년 ${selectedBatch.month}월 청구 확정`,
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">청구 배치 관리</h2>
          <p className="text-xs text-slate-400">월별 청구를 생성하고 확정합니다</p>
        </div>
        <Button onClick={createBatch} disabled={creating} size="sm">
          {creating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
          이번 달 배치 생성
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
                  <CardTitle className="text-sm">{b.year}년 {b.month}월</CardTitle>
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
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {selectedBatch.year}년 {selectedBatch.month}월 청구
                  </CardTitle>
                  {selectedBatch.status === 'draft' && (
                    <Button onClick={confirmBatch} disabled={confirming || pendingReceipts.length === 0} size="sm" className="bg-purple-600 hover:bg-purple-700">
                      {confirming ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
                      청구 확정 ({pendingReceipts.length}건)
                    </Button>
                  )}
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
                          <TableHead>제출자</TableHead>
                          <TableHead>항목</TableHead>
                          <TableHead>사용처</TableHead>
                          <TableHead className="text-right">금액</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingReceipts.map(r => (
                          <TableRow key={r.id}>
                            <TableCell className="text-sm">{r.submitter_name}</TableCell>
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
                            <TableHead>제출자</TableHead>
                            <TableHead>항목</TableHead>
                            <TableHead>사용처</TableHead>
                            <TableHead className="text-right">금액</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {batchReceipts.map(r => (
                            <TableRow key={r.id}>
                              <TableCell className="text-sm">{r.submitter_name}</TableCell>
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
