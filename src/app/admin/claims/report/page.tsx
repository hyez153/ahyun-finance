'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Receipt, ClaimBatch } from '@/types/database'
import { formatKRW, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer, Download, Loader2 } from 'lucide-react'

const GROUP_ORDER = ['목회', '양육', '사역', '행사'] as const
type GroupName = (typeof GROUP_ORDER)[number]

const GROUP_BUDGET_SECTION: Record<GroupName, { gwan: string; hang: string }> = {
  '목회': { gwan: '경상비', hang: '목회 행정비' },
  '양육': { gwan: '경상비', hang: '양육 훈련비' },
  '사역': { gwan: '경상비', hang: '사역 지원비' },
  '행사': { gwan: '경상비', hang: '행사 운영비' },
}

type BudgetCategory = {
  id: number
  group_name: string
  category_name: string
  annual_budget: number
}

export default function ClaimReportPage() {
  const searchParams = useSearchParams()
  const batchId = searchParams.get('batchId')
  const [batch, setBatch] = useState<ClaimBatch | null>(null)
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([])
  const [prevClaimedByGroup, setPrevClaimedByGroup] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [pdfLoading, setPdfLoading] = useState(false)
  const pageRefs = useRef<(HTMLDivElement | null)[]>([])

  // A4 높이(mm)를 px로 변환 (약 1123px at 96dpi), 여백 제외
  const A4_HEIGHT_PX = 1050

  const fitPages = useCallback(() => {
    pageRefs.current.forEach(el => {
      if (!el) return
      el.style.transform = ''
      el.style.transformOrigin = 'top left'
      const contentHeight = el.scrollHeight
      if (contentHeight > A4_HEIGHT_PX) {
        const scale = A4_HEIGHT_PX / contentHeight
        el.style.transform = `scale(${scale})`
      }
    })
  }, [])

  useEffect(() => {
    if (!loading && batch) {
      // DOM 렌더 후 스케일 적용
      requestAnimationFrame(fitPages)
    }
  }, [loading, batch, fitPages])

  useEffect(() => {
    async function load() {
      if (!batchId) { setLoading(false); return }

      const [batchRes, receiptRes, budgetRes] = await Promise.all([
        supabase.from('claim_batches').select('*').eq('id', Number(batchId)).single(),
        supabase
          .from('receipts')
          .select('*, budget_categories(group_name, category_name)')
          .eq('claim_batch_id', Number(batchId))
          .order('receipt_date'),
        supabase.from('budget_categories').select('id, group_name, category_name, annual_budget'),
      ])

      const batchData = batchRes.data as ClaimBatch | null
      setBatch(batchData ?? null)
      setReceipts((receiptRes.data as Receipt[]) ?? [])
      setBudgetCategories((budgetRes.data as BudgetCategory[]) ?? [])

      // 이전 청구일 기준 정산 완료된 금액 (현재 배치 청구일 이전 영수증 합계)
      if (batchData) {
        const { data: prevReceipts } = await supabase
          .from('receipts')
          .select('amount, budget_categories(group_name)')
          .lt('receipt_date', batchData.claim_date)

        const grouped: Record<string, number> = {}
        for (const r of (prevReceipts ?? [])) {
          const g = (r as any).budget_categories?.group_name ?? '기타'
          grouped[g] = (grouped[g] || 0) + Number(r.amount ?? 0)
        }
        setPrevClaimedByGroup(grouped)
      }

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

  // Group receipts by group_name, then by category
  const groupedByGroup: Record<string, Record<string, Receipt[]>> = {}
  for (const r of receipts) {
    const groupName = r.budget_categories?.group_name ?? '기타'
    const catName = r.budget_categories?.category_name ?? '미분류'
    if (!groupedByGroup[groupName]) groupedByGroup[groupName] = {}
    if (!groupedByGroup[groupName][catName]) groupedByGroup[groupName][catName] = []
    groupedByGroup[groupName][catName].push(r)
  }

  async function downloadPDF() {
    setPdfLoading(true)
    try {
      // CDN에서 라이브러리 동적 로드
      const [html2canvasModule, jsPDFModule] = await Promise.all([
        import(/* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js' as any),
        import(/* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js' as any),
      ]).catch(async () => {
        // fallback: script 태그로 로드
        await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js')
        await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js')
        return [null, null]
      })

      const html2canvas = (window as any).html2canvas
      const jsPDF = (window as any).jspdf?.jsPDF

      if (!html2canvas || !jsPDF) throw new Error('라이브러리 로드 실패')

      const pages = document.querySelectorAll('[data-pdf-page]')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = 210
      const pdfHeight = 297

      for (let i = 0; i < pages.length; i++) {
        const el = pages[i] as HTMLElement
        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
        })

        const imgWidth = pdfWidth - 20 // 좌우 여백 10mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        const imgData = canvas.toDataURL('image/jpeg', 0.95)

        if (i > 0) pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 10, 10, imgWidth, Math.min(imgHeight, pdfHeight - 20))
      }

      const fileName = `지출결의서_${batch!.year}년${batch!.month}월_${formatDate(batch!.claim_date).replace(/\s/g, '')}.pdf`
      pdf.save(fileName)
    } catch (err) {
      console.error(err)
      alert('PDF 다운로드에 실패했습니다. 인쇄 기능을 이용해주세요.')
    } finally {
      setPdfLoading(false)
    }
  }

  function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
      const script = document.createElement('script')
      script.src = src
      script.onload = () => resolve()
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  const claimDateStr = `${batch.year}년 ${String(batch.month).padStart(2, '0')}월 ${formatDate(batch.claim_date).split(' ').pop()}`

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10 print:hidden">
        <div className="max-w-[210mm] mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/admin/claims">
              <ArrowLeft className="w-5 h-5 text-slate-500 cursor-pointer hover:text-slate-700" />
            </Link>
            <h1 className="font-semibold text-slate-800">지출결의서 인쇄</h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={downloadPDF} size="sm" className="gap-2" disabled={pdfLoading}>
              {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              PDF
            </Button>
            <Button onClick={() => window.print()} size="sm" variant="outline" className="gap-2">
              <Printer className="w-4 h-4" />
              인쇄
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-[210mm] mx-auto px-4 py-6 print:p-0 print:max-w-none">
        {GROUP_ORDER.filter(g => groupedByGroup[g]).map((groupName, pageIdx) => {
          const categories = groupedByGroup[groupName]
          const catNames = Object.keys(categories).sort((a, b) => a.localeCompare(b, 'ko'))
          const groupTotal = Object.values(categories).flat().reduce((s, r) => s + r.amount, 0)
          const section = GROUP_BUDGET_SECTION[groupName]

          // 해당 그룹의 연간 예산 합계 (소그룹_XX 리더별 카테고리는 소그룹 운영비에 포함되므로 제외)
          const groupBudget = budgetCategories
            .filter(bc => bc.group_name === groupName && !bc.category_name.match(/^소그룹_/))
            .reduce((s, bc) => s + Number(bc.annual_budget || 0), 0)
          // 이전 청구 기준 잔액
          const prevClaimed = prevClaimedByGroup[groupName] || 0
          const currentBalance = groupBudget - prevClaimed

          return (
            <div key={groupName} className={`bg-white print:bg-transparent ${pageIdx > 0 ? 'mt-8 print:mt-0' : ''}`} style={{ pageBreakBefore: pageIdx > 0 ? 'always' : 'auto' }}>
              <div
                ref={el => { pageRefs.current[pageIdx] = el }}
                data-pdf-page
                className="border-2 border-black p-5 print:p-6 origin-top-left"
              >
                {/* 제목 */}
                <h1 className="text-xl font-black text-center tracking-[0.3em] mb-4">지 출 결 의 서</h1>

                {/* 청구/결재 테이블 */}
                <div className="flex gap-3 mb-3">
                  <table className="border-collapse border border-black text-[10px] flex-1">
                    <tbody>
                      <tr>
                        <td rowSpan={2} className="border border-black px-1.5 py-0.5 font-bold bg-gray-50 text-center w-10">청구</td>
                        <td className="border border-black px-1.5 py-0.5 text-center">회계</td>
                        <td className="border border-black px-1.5 py-0.5 text-center">회장</td>
                        <td className="border border-black px-1.5 py-0.5 text-center">담당권사</td>
                        <td className="border border-black px-1.5 py-0.5 text-center">담당장로</td>
                        <td className="border border-black px-1.5 py-0.5 text-center">담당목사</td>
                      </tr>
                      <tr>
                        <td className="border border-black px-1.5 py-3"></td>
                        <td className="border border-black px-1.5 py-3"></td>
                        <td className="border border-black px-1.5 py-3"></td>
                        <td className="border border-black px-1.5 py-3"></td>
                        <td className="border border-black px-1.5 py-3"></td>
                      </tr>
                    </tbody>
                  </table>
                  <table className="border-collapse border border-black text-[10px] flex-1">
                    <tbody>
                      <tr>
                        <td rowSpan={2} className="border border-black px-1.5 py-0.5 font-bold bg-gray-50 text-center w-10">결재</td>
                        <td className="border border-black px-1.5 py-0.5 text-center">재무회계</td>
                        <td className="border border-black px-1.5 py-0.5 text-center">재무총무</td>
                        <td className="border border-black px-1.5 py-0.5 text-center">재무부장</td>
                        <td className="border border-black px-1.5 py-0.5 text-center">담임목사</td>
                      </tr>
                      <tr>
                        <td className="border border-black px-1.5 py-3"></td>
                        <td className="border border-black px-1.5 py-3"></td>
                        <td className="border border-black px-1.5 py-3"></td>
                        <td className="border border-black px-1.5 py-3"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 정보 테이블 */}
                <table className="border-collapse border border-black w-full text-[10px] mb-3">
                  <tbody>
                    <tr>
                      <td className="border border-black px-1.5 py-1 font-bold bg-gray-50 w-14 whitespace-nowrap">청구부서</td>
                      <td className="border border-black px-1.5 py-1 whitespace-nowrap text-xs" colSpan={3}>아현젊은이교회</td>
                      <td className="border border-black px-1.5 py-1 font-bold bg-gray-50 w-14 whitespace-nowrap">청구일자</td>
                      <td className="border border-black px-1.5 py-1 whitespace-nowrap">{formatDate(batch.claim_date)}</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1.5 py-1 font-bold bg-gray-50">예산금액</td>
                      <td className="border border-black px-1.5 py-1" colSpan={3}>{formatKRW(groupBudget)}</td>
                      <td className="border border-black px-1.5 py-1 font-bold bg-gray-50">예산확인</td>
                      <td className="border border-black px-1.5 py-1">행정간사 김연진 확인</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1.5 py-1 font-bold bg-gray-50">현재잔액</td>
                      <td className="border border-black px-1.5 py-1" colSpan={5}>{formatKRW(currentBalance)}</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1.5 py-1 font-bold bg-gray-50">청구금액</td>
                      <td className="border border-black px-1.5 py-1 font-bold text-sm" colSpan={5}>{formatKRW(groupTotal)}</td>
                    </tr>
                    <tr>
                      <td rowSpan={3} className="border border-black px-1.5 py-1 font-bold bg-gray-50 text-center">예산</td>
                      <td className="border border-black px-1.5 py-1 font-bold bg-gray-50 w-8 text-center">관</td>
                      <td className="border border-black px-1.5 py-1" colSpan={4}>{section.gwan}</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1.5 py-1 font-bold bg-gray-50 text-center">항</td>
                      <td className="border border-black px-1.5 py-1" colSpan={4}>{section.hang}</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1.5 py-1 font-bold bg-gray-50 text-center">목</td>
                      <td className="border border-black px-1.5 py-1" colSpan={4}></td>
                    </tr>
                  </tbody>
                </table>

                {/* 세부 내역 */}
                <table className="border-collapse border border-black w-full text-xs mb-3">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-black px-2 py-1 text-left w-7">No.</th>
                      <th className="border border-black px-2 py-1 text-left">항목</th>
                      <th className="border border-black px-2 py-1 text-left">내용</th>
                      <th className="border border-black px-2 py-1 text-left">결제자</th>
                      <th className="border border-black px-2 py-1 text-right w-24">금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catNames.map((catName, catIdx) => {
                      const catReceipts = categories[catName]
                      const catTotal = catReceipts.reduce((s, r) => s + r.amount, 0)

                      return (
                        <>
                          {/* 카테고리 소계 행 */}
                          <tr key={`cat-${catName}`} className="bg-gray-50">
                            <td className="border border-black px-2 py-0.5 font-bold">{catIdx + 1}</td>
                            <td className="border border-black px-2 py-0.5 font-bold">{catName}</td>
                            <td className="border border-black px-2 py-0.5 text-[10px] text-slate-500">{catReceipts.length}건</td>
                            <td className="border border-black px-2 py-0.5"></td>
                            <td className="border border-black px-2 py-0.5 text-right font-bold">{formatKRW(catTotal)}</td>
                          </tr>
                          {/* 개별 영수증 */}
                          {catReceipts.map((r) => (
                            <tr key={r.id}>
                              <td className="border border-black px-2 py-0.5 text-[10px] text-slate-400"></td>
                              <td className="border border-black px-2 py-0.5 text-[10px] text-slate-500">{catName}</td>
                              <td className="border border-black px-2 py-0.5 text-[10px]">{r.vendor_name}{r.memo ? ` - ${r.memo}` : ''}</td>
                              <td className="border border-black px-2 py-0.5 text-[10px]">{r.payer_name || r.submitter_name}</td>
                              <td className="border border-black px-2 py-0.5 text-[10px] text-right">{formatKRW(r.amount)}</td>
                            </tr>
                          ))}
                        </>
                      )
                    })}
                    {/* 합계 */}
                    <tr className="bg-gray-100">
                      <td className="border border-black px-2 py-1 font-bold" colSpan={4}>합계</td>
                      <td className="border border-black px-2 py-1 text-right font-bold text-sm">{formatKRW(groupTotal)}</td>
                    </tr>
                  </tbody>
                </table>

                {/* 하단 확인 */}
                <p className="text-center text-xs mt-4">
                  {formatDate(batch.claim_date)} 지급처리확인
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 8mm; size: A4; }
          thead { display: table-header-group; }
          tr { break-inside: avoid; }
          table { break-inside: auto; }
          [data-pdf-page] { page-break-after: always; page-break-inside: avoid; }
        }
      `}</style>
    </div>
  )
}
