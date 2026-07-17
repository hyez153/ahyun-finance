'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Receipt, ClaimBatch } from '@/types/database'
import { formatKRW, formatDate } from '@/lib/utils'
import { getWeekLabel } from '@/lib/claim-cycle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Printer, Loader2 } from 'lucide-react'

function ClaimPrintContent() {
  const searchParams = useSearchParams()
  const batchId = searchParams.get('batchId')
  const [batch, setBatch] = useState<ClaimBatch | null>(null)
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!batchId) {
        setLoading(false)
        return
      }

      const [batchRes, receiptRes] = await Promise.all([
        supabase.from('claim_batches').select('*').eq('id', Number(batchId)).single(),
        supabase
          .from('receipts')
          .select('*, budget_categories(group_name, category_name)')
          .eq('claim_batch_id', Number(batchId))
          .order('receipt_date'),
      ])

      setBatch((batchRes.data as ClaimBatch) ?? null)
      setReceipts((receiptRes.data as Receipt[]) ?? [])
      setLoading(false)
    }
    load()
  }, [batchId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!batch) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500">청구 데이터를 찾을 수 없습니다.</p>
        <Link href="/admin/claims">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />돌아가기</Button>
        </Link>
      </div>
    )
  }

  // Group receipts by category
  const groupedByCategory: Record<string, Receipt[]> = {}
  for (const receipt of receipts) {
    const categoryName = receipt.budget_categories?.category_name || '미분류'
    if (!groupedByCategory[categoryName]) {
      groupedByCategory[categoryName] = []
    }
    groupedByCategory[categoryName].push(receipt)
  }

  const categoryOrder = Object.keys(groupedByCategory).sort()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10 print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/admin/claims">
              <ArrowLeft className="w-5 h-5 text-slate-500 cursor-pointer hover:text-slate-700" />
            </Link>
            <h1 className="font-semibold text-slate-800">{batch.year}년 {batch.month}월 {getWeekLabel(batch.week_no)} 청구 내역 인쇄</h1>
          </div>
          <Button onClick={() => window.print()} size="sm" className="gap-2">
            <Printer className="w-4 h-4" />
            인쇄
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white print:bg-transparent">
          {/* Print header */}
          <div className="text-center mb-6 pb-6 border-b-2">
            <h1 className="text-2xl font-bold text-slate-900">{batch.year}년 {batch.month}월 {getWeekLabel(batch.week_no)} 청구 명세</h1>
            <p className="text-sm text-slate-500 mt-2">청구 기간: {formatDate(batch.submission_deadline)} ~ {formatDate(batch.claim_date)}</p>
            <p className="text-lg font-bold text-slate-800 mt-4">
              합계: {formatKRW(receipts.reduce((sum, r) => sum + r.amount, 0))}
            </p>
          </div>

          {/* Receipts by category */}
          <div className="space-y-8">
            {categoryOrder.map(categoryName => {
              const categoryReceipts = groupedByCategory[categoryName]
              const categoryTotal = categoryReceipts.reduce((sum, r) => sum + r.amount, 0)

              return (
                <div key={categoryName}>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b">
                    <h2 className="text-lg font-semibold text-slate-800">{categoryName}</h2>
                    <span className="font-bold text-slate-700">{formatKRW(categoryTotal)}</span>
                  </div>

                  <div className="space-y-3">
                    {categoryReceipts.map((receipt, idx) => (
                      <div key={receipt.id} className="flex gap-3 pb-3 border-b border-slate-100 print:page-break-inside-avoid">
                        {/* Receipt image */}
                        {receipt.file_url && (
                          <div className="shrink-0">
                            {receipt.file_url === '실물영수증제출' ? (
                              <div className="h-24 w-24 rounded border-2 border-dashed border-amber-300 bg-amber-50 flex flex-col items-center justify-center">
                                <span className="text-xs text-amber-600 font-medium text-center leading-tight">실물영수증<br />제출</span>
                              </div>
                            ) : (
                              <img
                                src={receipt.file_url}
                                alt={receipt.vendor_name}
                                className="h-24 w-24 object-cover rounded border border-slate-200"
                              />
                            )}
                          </div>
                        )}

                        {/* Receipt details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div>
                              <p className="font-semibold text-slate-800">{receipt.vendor_name}</p>
                              <p className="text-xs text-slate-500">
                                결제: {receipt.payer_name || receipt.submitter_name} · {formatDate(receipt.receipt_date)}
                              </p>
                            </div>
                            <p className="font-bold text-slate-800 shrink-0">{formatKRW(receipt.amount)}</p>
                          </div>

                          {receipt.memo && (
                            <p className="text-xs text-slate-600 mt-1">{receipt.memo}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          body {
            background: white;
          }
          .max-w-4xl {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default function ClaimPrintPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    }>
      <ClaimPrintContent />
    </Suspense>
  )
}
