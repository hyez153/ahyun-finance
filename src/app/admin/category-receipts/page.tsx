'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ClaimBatch, BudgetCategory } from '@/types/database'
import { formatKRW, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Loader2, FileSearch, Image as ImageIcon } from 'lucide-react'
import { filterCategoryReceipts, chunk, AuditReceipt } from '@/lib/audit-report'
import { splitCategories } from '@/lib/receipt-rules'

const ROWS_PER_PAGE = 28

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const s = document.createElement('script')
    s.src = src; s.onload = () => resolve(); s.onerror = reject
    document.head.appendChild(s)
  })
}

export default function CategoryReceiptsPage() {
  const [categories, setCategories] = useState<BudgetCategory[]>([])
  const [batches, setBatches] = useState<ClaimBatch[]>([])
  const [receipts, setReceipts] = useState<AuditReceipt[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryId, setCategoryId] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [pdfLoading, setPdfLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const [catRes, batchRes] = await Promise.all([
        supabase.from('budget_categories').select('*'),
        supabase.from('claim_batches').select('*').eq('status', 'confirmed').order('claim_date'),
      ])
      const cats = (catRes.data as BudgetCategory[]) ?? []
      const confirmed = (batchRes.data as ClaimBatch[]) ?? []
      setCategories(cats)
      setBatches(confirmed)

      if (confirmed.length > 0) {
        setStartDate(confirmed[0].claim_date)
        setEndDate(confirmed[confirmed.length - 1].claim_date)

        const batchIds = confirmed.map(b => b.id)
        const claimDateOf = new Map(confirmed.map(b => [b.id, b.claim_date]))

        const { data: rcpt } = await supabase
          .from('receipts')
          .select('id, budget_category_id, amount, receipt_date, vendor_name, memo, submitter_name, payer_name, file_url, claim_batch_id, budget_categories(group_name, category_name)')
          .eq('is_claimed', true)
          .in('claim_batch_id', batchIds)

        const mapped: AuditReceipt[] = ((rcpt as unknown[]) ?? []).map((row) => {
          const r = row as {
            id: number; budget_category_id: number; amount: number; receipt_date: string
            vendor_name: string; memo: string | null; submitter_name: string; payer_name: string | null; file_url: string
            claim_batch_id: number; budget_categories?: { group_name?: string; category_name?: string }
          }
          return {
            id: r.id, budget_category_id: r.budget_category_id,
            amount: Number(r.amount) || 0, receipt_date: r.receipt_date,
            vendor_name: r.vendor_name, memo: r.memo,
            submitter_name: r.submitter_name, payer_name: r.payer_name,
            claim_date: claimDateOf.get(r.claim_batch_id) ?? '',
            group_name: r.budget_categories?.group_name ?? '기타',
            category_name: r.budget_categories?.category_name ?? '미분류',
            file_url: r.file_url,
          }
        })
        setReceipts(mapped)
      }
      setLoading(false)
    }
    load()
  }, [])

  const { leader, grouped } = useMemo(() => splitCategories(categories), [categories])
  const claimDates = useMemo(() => [...new Set(batches.map(b => b.claim_date))].sort(), [batches])

  const selectedCat = categories.find(c => String(c.id) === categoryId)

  const result = useMemo(() => {
    if (!categoryId || !startDate || !endDate) return null
    return filterCategoryReceipts(receipts, Number(categoryId), startDate, endDate)
  }, [receipts, categoryId, startDate, endDate])

  const rangeInvalid = startDate > endDate

  function catLabel(name: string) {
    return name.startsWith('소그룹_') ? name.replace('소그룹_', '') + ' 소그룹' : name
  }

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
      const maxH = 297 - 16
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i] as HTMLElement, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
        let imgWidth = 210 - 16
        let imgHeight = (canvas.height * imgWidth) / canvas.width
        if (imgHeight > maxH) { imgWidth = (imgWidth * maxH) / imgHeight; imgHeight = maxH }
        const imgData = canvas.toDataURL('image/jpeg', 0.92)
        if (i > 0) pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 8, 8, imgWidth, imgHeight)
      }
      pdf.save(`${catLabel(selectedCat?.category_name ?? '항목')}_${startDate}_${endDate}.pdf`)
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
        <FileSearch className="w-8 h-8 mx-auto mb-3 text-slate-300" />
        확정된 청구 배치가 아직 없습니다.
      </div>
    )
  }

  const pages = result ? chunk(result.rows, ROWS_PER_PAGE) : []
  // 영수증 사진은 A4 한 장에 6장(2열 x 3행)씩
  const photoPages = result ? chunk(result.rows, 6) : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">항목별 영수증 조회</h1>
          <p className="text-sm text-slate-500">예산 항목 하나를 골라 기간 내 청구완료된 영수증을 모아봅니다.</p>
        </div>
        <Button onClick={downloadPDF} size="sm" className="gap-2 shrink-0" disabled={pdfLoading || !result || result.count === 0}>
          {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          PDF 다운로드
        </Button>
      </div>

      {/* 항목 + 기간 선택 */}
      <div className="flex items-end gap-3 flex-wrap print:hidden">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500">예산 항목</label>
          <Select value={categoryId || null} onValueChange={v => setCategoryId(v ?? '')}>
            <SelectTrigger className="w-56"><SelectValue placeholder="항목 선택">{selectedCat ? catLabel(selectedCat.category_name) : null}</SelectValue></SelectTrigger>
            <SelectContent>
              {grouped.map(({ group, items }) => items.length > 0 ? (
                <SelectGroup key={group}>
                  <SelectLabel className="text-xs text-slate-400">{group}</SelectLabel>
                  {items.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.category_name}</SelectItem>)}
                </SelectGroup>
              ) : null)}
              {leader.length > 0 && (
                <SelectGroup>
                  <SelectLabel className="text-xs text-slate-400">소그룹 리더</SelectLabel>
                  {leader.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.category_name.replace('소그룹_', '')} 소그룹</SelectItem>)}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500">시작 청구일</label>
          <Select value={startDate || null} onValueChange={v => setStartDate(v ?? '')}>
            <SelectTrigger className="w-40"><SelectValue>{startDate ? formatDate(startDate) : '선택'}</SelectValue></SelectTrigger>
            <SelectContent>{claimDates.map(d => <SelectItem key={d} value={d}>{formatDate(d)}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <span className="text-slate-400 pb-2">~</span>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500">끝 청구일</label>
          <Select value={endDate || null} onValueChange={v => setEndDate(v ?? '')}>
            <SelectTrigger className="w-40"><SelectValue>{endDate ? formatDate(endDate) : '선택'}</SelectValue></SelectTrigger>
            <SelectContent>{claimDates.map(d => <SelectItem key={d} value={d}>{formatDate(d)}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      {rangeInvalid && <p className="text-sm text-red-500">시작 청구일이 끝 청구일보다 뒤입니다.</p>}
      {!categoryId && <p className="text-sm text-slate-400">항목을 선택하면 영수증이 표시됩니다.</p>}

      {result && !rangeInvalid && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600 flex items-center justify-between">
                <span>{catLabel(selectedCat?.category_name ?? '')} · {formatDate(startDate)} ~ {formatDate(endDate)}</span>
                <span className="text-base font-bold text-slate-800">{formatKRW(result.total)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-500">청구완료 {result.count}건</CardContent>
          </Card>

          {result.count === 0 ? (
            <p className="text-center text-sm text-slate-400 py-10">이 기간에 청구완료된 내역이 없습니다.</p>
          ) : (
            pages.map((rows, pageIdx) => {
              const isLast = pageIdx === pages.length - 1
              const startNo = pageIdx * ROWS_PER_PAGE
              return (
                <div key={pageIdx} data-pdf-page className="bg-white border-2 border-black p-6">
                  <h2 className="text-base font-black text-center tracking-[0.15em] mb-1">
                    {catLabel(selectedCat?.category_name ?? '')} 영수증
                  </h2>
                  <p className="text-center text-xs text-slate-600 mb-4">
                    아현젊은이교회 · {formatDate(startDate)} ~ {formatDate(endDate)} · 총 {result.count}건
                    {pages.length > 1 && ` · (${pageIdx + 1}/${pages.length})`}
                  </p>
                  <table className="border-collapse border border-black w-full text-[10px]">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-black px-1.5 py-1 text-left w-7">No.</th>
                        <th className="border border-black px-1.5 py-1 text-left w-24 whitespace-nowrap">청구일</th>
                        <th className="border border-black px-1.5 py-1 text-left w-24 whitespace-nowrap">사용일</th>
                        <th className="border border-black px-1.5 py-1 text-left">사용처 / 적요</th>
                        <th className="border border-black px-1.5 py-1 text-left w-16">결제자</th>
                        <th className="border border-black px-1.5 py-1 text-right w-20">금액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={r.id}>
                          <td className="border border-black px-1.5 py-0.5 text-slate-400">{startNo + i + 1}</td>
                          <td className="border border-black px-1.5 py-0.5 whitespace-nowrap">{formatDate(r.claim_date)}</td>
                          <td className="border border-black px-1.5 py-0.5 whitespace-nowrap">{formatDate(r.receipt_date)}</td>
                          <td className="border border-black px-1.5 py-0.5">{r.vendor_name}{r.memo ? ` - ${r.memo}` : ''}</td>
                          <td className="border border-black px-1.5 py-0.5">{r.payer_name || r.submitter_name}</td>
                          <td className="border border-black px-1.5 py-0.5 text-right">{formatKRW(r.amount)}</td>
                        </tr>
                      ))}
                      {isLast && (
                        <tr className="bg-gray-100">
                          <td className="border border-black px-1.5 py-1 font-bold text-right" colSpan={5}>합계</td>
                          <td className="border border-black px-1.5 py-1 text-right font-bold">{formatKRW(result.total)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )
            })
          )}

          {/* ===== 실제 영수증 사진 (페이지당 6장) ===== */}
          {result.count > 0 && photoPages.map((rows, pageIdx) => {
            const startNo = pageIdx * 6
            return (
              <div key={`photo-${pageIdx}`} data-pdf-page className="bg-white border-2 border-black p-6">
                <h2 className="text-base font-black text-center tracking-[0.15em] mb-1">
                  {catLabel(selectedCat?.category_name ?? '')} 영수증 사진
                </h2>
                <p className="text-center text-xs text-slate-600 mb-4">
                  {formatDate(startDate)} ~ {formatDate(endDate)}
                  {photoPages.length > 1 && ` · 사진 (${pageIdx + 1}/${photoPages.length})`}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {rows.map((r, i) => {
                    const isPhysical = r.file_url === '실물영수증제출'
                    return (
                      <div key={r.id} className="border border-slate-300 rounded overflow-hidden break-inside-avoid">
                        <div className="relative w-full bg-slate-50" style={{ aspectRatio: '3/4' }}>
                          {isPhysical || !r.file_url ? (
                            <div className="absolute inset-0 border-2 border-dashed border-amber-300 bg-amber-50/80 flex flex-col items-center justify-center">
                              <ImageIcon className="w-7 h-7 text-amber-300 mb-1.5" />
                              <span className="text-xs text-amber-600 font-semibold">실물영수증</span>
                            </div>
                          ) : (
                            <img src={r.file_url} alt={r.vendor_name} crossOrigin="anonymous"
                              className="absolute inset-0 w-full h-full object-contain" />
                          )}
                        </div>
                        <div className="px-2 py-1.5 border-t border-slate-200 text-[10px]">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-slate-700 truncate">{startNo + i + 1}. {r.vendor_name}</span>
                            <span className="font-bold text-slate-800 shrink-0">{formatKRW(r.amount)}</span>
                          </div>
                          <div className="text-slate-400">
                            청구 {formatDate(r.claim_date)} · {r.payer_name || r.submitter_name}
                            {r.memo ? ` · ${r.memo}` : ''}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
