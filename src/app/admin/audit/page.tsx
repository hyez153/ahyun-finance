'use client'

import { Fragment, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ClaimBatch } from '@/types/database'
import { formatKRW, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Loader2, FileText } from 'lucide-react'
import { buildAuditReport, AuditReceipt } from '@/lib/audit-report'

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = reject
    document.head.appendChild(s)
  })
}

export default function AuditPage() {
  const [batches, setBatches] = useState<ClaimBatch[]>([])
  const [receipts, setReceipts] = useState<AuditReceipt[]>([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [pdfLoading, setPdfLoading] = useState(false)

  useEffect(() => {
    async function load() {
      // 확정된 배치의 청구일만 (draft 배치는 아직 청구완료가 아니다)
      const { data: batchData } = await supabase
        .from('claim_batches')
        .select('*')
        .eq('status', 'confirmed')
        .order('claim_date')
      const confirmed = (batchData as ClaimBatch[]) ?? []
      setBatches(confirmed)

      if (confirmed.length > 0) {
        // 기본 구간: 처음 ~ 마지막 청구일 (연초부터 지금까지 = 전체 누적)
        setStartDate(confirmed[0].claim_date)
        setEndDate(confirmed[confirmed.length - 1].claim_date)

        const batchIds = confirmed.map(b => b.id)
        const claimDateOf = new Map(confirmed.map(b => [b.id, b.claim_date]))

        // 청구완료된 영수증 + 항목 정보
        const { data: rcpt } = await supabase
          .from('receipts')
          .select('id, amount, receipt_date, vendor_name, memo, submitter_name, payer_name, claim_batch_id, budget_categories(group_name, category_name)')
          .eq('is_claimed', true)
          .in('claim_batch_id', batchIds)

        const mapped: AuditReceipt[] = ((rcpt as unknown[]) ?? []).map((row) => {
          const r = row as {
            id: number; amount: number; receipt_date: string; vendor_name: string
            memo: string | null; submitter_name: string; payer_name: string | null
            claim_batch_id: number
            budget_categories?: { group_name?: string; category_name?: string }
          }
          return {
            id: r.id,
            amount: Number(r.amount) || 0,
            receipt_date: r.receipt_date,
            vendor_name: r.vendor_name,
            memo: r.memo,
            submitter_name: r.submitter_name,
            payer_name: r.payer_name,
            claim_date: claimDateOf.get(r.claim_batch_id) ?? '',
            group_name: r.budget_categories?.group_name ?? '기타',
            category_name: r.budget_categories?.category_name ?? '미분류',
          }
        })
        setReceipts(mapped)
      }
      setLoading(false)
    }
    load()
  }, [])

  // 청구일 드롭다운 (확정 배치의 청구일, 중복 제거)
  const claimDates = useMemo(
    () => [...new Set(batches.map(b => b.claim_date))].sort(),
    [batches]
  )

  const report = useMemo(() => {
    if (!startDate || !endDate) return null
    return buildAuditReport(receipts, startDate, endDate)
  }, [receipts, startDate, endDate])

  async function downloadPDF() {
    setPdfLoading(true)
    try {
      await loadScript('https://cdn.jsdelivr.net/npm/html2canvas-pro@1.5.8/dist/html2canvas-pro.min.js')
      await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js')
      const html2canvas = (window as unknown as { html2canvas: (el: HTMLElement, o: object) => Promise<HTMLCanvasElement> }).html2canvas
      const jsPDF = (window as unknown as { jspdf?: { jsPDF: new (...a: unknown[]) => { addPage: () => void; addImage: (...a: unknown[]) => void; save: (n: string) => void } } }).jspdf?.jsPDF
      if (!html2canvas || !jsPDF) throw new Error('라이브러리 로드 실패')

      const pages = document.querySelectorAll('[data-pdf-page]')
      const pdf = new jsPDF('p', 'mm', 'a4')
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i] as HTMLElement, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
        const imgWidth = 210 - 16
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        const imgData = canvas.toDataURL('image/jpeg', 0.92)
        if (i > 0) pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 8, 8, imgWidth, Math.min(imgHeight, 297 - 16))
      }
      pdf.save(`감사자료_${startDate}_${endDate}.pdf`)
    } catch (err) {
      console.error(err)
      alert('PDF 다운로드에 실패했습니다.')
    } finally {
      setPdfLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
  }

  if (batches.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400 text-sm">
        <FileText className="w-8 h-8 mx-auto mb-3 text-slate-300" />
        확정된 청구 배치가 아직 없습니다.
      </div>
    )
  }

  const rangeInvalid = startDate > endDate

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">감사자료</h1>
          <p className="text-sm text-slate-500">청구일 구간을 고르면 그 기간에 청구완료된 금액을 항목별로 누적합니다.</p>
        </div>
        <Button onClick={downloadPDF} size="sm" className="gap-2 shrink-0" disabled={pdfLoading || !report || report.grandCount === 0}>
          {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          PDF 다운로드
        </Button>
      </div>

      {/* 기간 선택 */}
      <div className="flex items-end gap-3 flex-wrap print:hidden">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500">시작 청구일</label>
          <Select value={startDate || null} onValueChange={v => setStartDate(v ?? '')}>
            <SelectTrigger className="w-44"><SelectValue>{startDate ? formatDate(startDate) : '선택'}</SelectValue></SelectTrigger>
            <SelectContent>
              {claimDates.map(d => <SelectItem key={d} value={d}>{formatDate(d)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <span className="text-slate-400 pb-2">~</span>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500">끝 청구일</label>
          <Select value={endDate || null} onValueChange={v => setEndDate(v ?? '')}>
            <SelectTrigger className="w-44"><SelectValue>{endDate ? formatDate(endDate) : '선택'}</SelectValue></SelectTrigger>
            <SelectContent>
              {claimDates.map(d => <SelectItem key={d} value={d}>{formatDate(d)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {rangeInvalid && (
        <p className="text-sm text-red-500">시작 청구일이 끝 청구일보다 뒤입니다. 다시 선택해주세요.</p>
      )}

      {report && !rangeInvalid && (
        <>
          {/* 화면 요약 카드 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600 flex items-center justify-between">
                <span>{formatDate(startDate)} ~ {formatDate(endDate)} 누적</span>
                <span className="text-base font-bold text-slate-800">{formatKRW(report.grandTotal)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-500">
              청구완료 {report.grandCount}건
            </CardContent>
          </Card>

          {/* ===== PDF 1장: 항목별 누적 요약 ===== */}
          <div data-pdf-page className="bg-white border-2 border-black p-6">
            <h1 className="text-lg font-black text-center tracking-[0.25em] mb-1">감 사 자 료</h1>
            <p className="text-center text-xs text-slate-600 mb-5">
              아현젊은이교회 · {formatDate(startDate)} ~ {formatDate(endDate)} 누적 청구완료
            </p>

            {report.grandCount === 0 ? (
              <p className="text-center text-sm text-slate-400 py-10">이 기간에 청구완료된 내역이 없습니다.</p>
            ) : (
              <table className="border-collapse border border-black w-full text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black px-2 py-1 text-left">대분류</th>
                    <th className="border border-black px-2 py-1 text-left">항목</th>
                    <th className="border border-black px-2 py-1 text-right w-16">건수</th>
                    <th className="border border-black px-2 py-1 text-right w-28">누적 금액</th>
                  </tr>
                </thead>
                <tbody>
                  {report.groups.map(g => (
                    <Fragment key={g.group_name}>
                      {g.categories.map((c, i) => (
                        <tr key={g.group_name + c.category_name}>
                          {i === 0 && (
                            <td rowSpan={g.categories.length} className="border border-black px-2 py-1 font-bold bg-gray-50 align-top">{g.group_name}</td>
                          )}
                          <td className="border border-black px-2 py-1">{c.category_name}</td>
                          <td className="border border-black px-2 py-1 text-right text-slate-500">{c.count}</td>
                          <td className="border border-black px-2 py-1 text-right">{formatKRW(c.total)}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td className="border border-black px-2 py-1 font-bold text-right" colSpan={2}>{g.group_name} 소계</td>
                        <td className="border border-black px-2 py-1 text-right font-bold text-slate-500">{g.count}</td>
                        <td className="border border-black px-2 py-1 text-right font-bold">{formatKRW(g.total)}</td>
                      </tr>
                    </Fragment>
                  ))}
                  <tr className="bg-gray-200">
                    <td className="border border-black px-2 py-1.5 font-black" colSpan={2}>총 합계</td>
                    <td className="border border-black px-2 py-1.5 text-right font-black">{report.grandCount}</td>
                    <td className="border border-black px-2 py-1.5 text-right font-black text-sm">{formatKRW(report.grandTotal)}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          {/* ===== PDF 2장~: 영수증 전체 명세 ===== */}
          {report.grandCount > 0 && (
            <div data-pdf-page className="bg-white border-2 border-black p-6">
              <h2 className="text-base font-black text-center tracking-[0.2em] mb-1">영 수 증 명 세</h2>
              <p className="text-center text-xs text-slate-600 mb-4">
                {formatDate(startDate)} ~ {formatDate(endDate)} · 총 {report.grandCount}건
              </p>
              <table className="border-collapse border border-black w-full text-[10px]">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black px-1.5 py-1 text-left w-7">No.</th>
                    <th className="border border-black px-1.5 py-1 text-left w-24 whitespace-nowrap">청구일</th>
                    <th className="border border-black px-1.5 py-1 text-left w-24 whitespace-nowrap">사용일</th>
                    <th className="border border-black px-1.5 py-1 text-left w-24">항목</th>
                    <th className="border border-black px-1.5 py-1 text-left">사용처 / 적요</th>
                    <th className="border border-black px-1.5 py-1 text-left w-16">결제자</th>
                    <th className="border border-black px-1.5 py-1 text-right w-20">금액</th>
                  </tr>
                </thead>
                <tbody>
                  {report.receipts.map((r, i) => (
                    <tr key={r.id}>
                      <td className="border border-black px-1.5 py-0.5 text-slate-400">{i + 1}</td>
                      <td className="border border-black px-1.5 py-0.5 whitespace-nowrap">{formatDate(r.claim_date)}</td>
                      <td className="border border-black px-1.5 py-0.5 whitespace-nowrap">{formatDate(r.receipt_date)}</td>
                      <td className="border border-black px-1.5 py-0.5">{r.category_name}</td>
                      <td className="border border-black px-1.5 py-0.5">{r.vendor_name}{r.memo ? ` - ${r.memo}` : ''}</td>
                      <td className="border border-black px-1.5 py-0.5">{r.payer_name || r.submitter_name}</td>
                      <td className="border border-black px-1.5 py-0.5 text-right">{formatKRW(r.amount)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100">
                    <td className="border border-black px-1.5 py-1 font-bold text-right" colSpan={6}>합계</td>
                    <td className="border border-black px-1.5 py-1 text-right font-bold">{formatKRW(report.grandTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
