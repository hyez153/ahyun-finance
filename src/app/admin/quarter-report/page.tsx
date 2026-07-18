'use client'

import { Fragment, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatKRW } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Loader2 } from 'lucide-react'
import {
  buildQuarterReport,
  quarterOptions,
  txnInRange,
  QuarterCategory,
  QuarterTxn,
} from '@/lib/quarter-report'

const YEAR = 2026
const MEMO_KEY = 'ahyun_quarter_memo'

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const s = document.createElement('script')
    s.src = src; s.onload = () => resolve(); s.onerror = reject
    document.head.appendChild(s)
  })
}

function pct(v: number) {
  return `${v.toFixed(2)}%`
}

export default function QuarterReportPage() {
  const [cats, setCats] = useState<QuarterCategory[]>([])
  const [txns, setTxns] = useState<(QuarterTxn & { transaction_date: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [quarterKey, setQuarterKey] = useState('q1')
  const [memos, setMemos] = useState<Record<string, string>>({})
  const [pdfLoading, setPdfLoading] = useState(false)

  const options = useMemo(() => quarterOptions(YEAR), [])
  const current = options.find(o => o.key === quarterKey)!

  useEffect(() => {
    try {
      const saved = localStorage.getItem(MEMO_KEY)
      if (saved) setMemos(JSON.parse(saved))
    } catch { /* 무시 */ }
  }, [])

  useEffect(() => {
    async function load() {
      const [catRes, txRes] = await Promise.all([
        supabase.from('budget_categories').select('id, group_name, category_name, annual_budget'),
        supabase.from('budget_transactions').select('budget_category_id, amount, transaction_date'),
      ])
      setCats((catRes.data as QuarterCategory[]) ?? [])
      setTxns((txRes.data as (QuarterTxn & { transaction_date: string })[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const report = useMemo(() => {
    const qtx = txns.filter(t => txnInRange(t.transaction_date, current.start, current.end))
    return buildQuarterReport(cats, qtx, current.quartersElapsed)
  }, [cats, txns, current])

  // 연초부터 해당 분기 끝까지 누적 집행 (1년예산 대비 누적 사용비율용).
  // 1분기·상반기는 누적 = 이번 분기라 값이 같고, 2~4분기 단독 선택 시 달라진다.
  const cumulative = useMemo(() => {
    const cutx = txns.filter(t => txnInRange(t.transaction_date, `${YEAR}-01-01`, current.end))
    return buildQuarterReport(cats, cutx, current.quartersElapsed)
  }, [cats, txns, current])

  function cumUsed(group: string, category?: string): number {
    const g = cumulative.groups.find(x => x.group_name === group)
    if (!g) return 0
    if (!category) return g.used
    return g.rows.find(r => r.category_name === category)?.used ?? 0
  }
  function cumPct(used: number, budget: number): string {
    return budget ? `${((used / budget) * 100).toFixed(2)}%` : '0.00%'
  }

  function memoOf(group: string) {
    return memos[`${quarterKey}:${group}`] ?? ''
  }
  function setMemo(group: string, text: string) {
    setMemos(prev => {
      const next = { ...prev, [`${quarterKey}:${group}`]: text }
      try { localStorage.setItem(MEMO_KEY, JSON.stringify(next)) } catch { /* 무시 */ }
      return next
    })
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
        let w = 210 - 16
        let h = (canvas.height * w) / canvas.width
        if (h > maxH) { w = (w * maxH) / h; h = maxH }
        const img = canvas.toDataURL('image/jpeg', 0.92)
        if (i > 0) pdf.addPage()
        pdf.addImage(img, 'JPEG', 8, 8, w, h)
      }
      pdf.save(`젊은이교회_${current.label}_예산집행보고_${YEAR}.pdf`)
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

  const rangeLabel = `${current.start.replace(/-/g, '.')} ~ ${current.end.replace(/-/g, '.')}`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">분기 예산 집행 보고</h1>
          <p className="text-sm text-slate-500">청구완료 기준 · 소그룹은 운영비로 합산 · 분기 목표 = 1년 예산 ÷ 4</p>
        </div>
        <Button onClick={downloadPDF} size="sm" className="gap-2 shrink-0" disabled={pdfLoading}>
          {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          PDF 다운로드
        </Button>
      </div>

      {/* 분기 선택 버튼 */}
      <div className="flex gap-2 flex-wrap print:hidden">
        {options.map(o => (
          <button
            key={o.key}
            onClick={() => setQuarterKey(o.key)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
              quarterKey === o.key ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* ===== PDF 1장: 표지 + 대분류 요약 ===== */}
      <div data-pdf-page className="bg-white border-2 border-black p-6 space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-black tracking-wide">젊은이교회 {current.label} 예산 집행 보고</h2>
          <p className="text-xs text-slate-600 mt-1">( {rangeLabel} 청구기준 )</p>
        </div>

        {/* 총계 */}
        <table className="border-collapse border border-black w-full text-sm">
          <tbody>
            <tr>
              <td className="border border-black px-3 py-1.5 font-bold bg-gray-50 whitespace-nowrap w-40">총예산</td>
              <td className="border border-black px-3 py-1.5 text-right font-semibold whitespace-nowrap">{formatKRW(report.totalBudget)}</td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-1.5 font-bold bg-gray-50 whitespace-nowrap">└ {current.label} 집행 합계</td>
              <td className="border border-black px-3 py-1.5 text-right font-bold whitespace-nowrap">
                {formatKRW(report.totalUsed)} <span className="text-slate-500 font-normal">(집행률 {pct(report.useRate)})</span>
              </td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-1.5 font-bold bg-gray-50 whitespace-nowrap">└ 연초부터 누적 집행</td>
              <td className="border border-black px-3 py-1.5 text-right font-bold whitespace-nowrap">
                {formatKRW(cumulative.totalUsed)} <span className="text-slate-500 font-normal">(누적 사용비율 {cumPct(cumulative.totalUsed, cumulative.totalBudget)})</span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* 대분류 요약 (A/B/C/비율) */}
        <table className="border-collapse border border-black w-full text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black px-2 py-1 text-left">항목</th>
              <th className="border border-black px-2 py-1 text-right">이번 분기<br/>사용금액</th>
              <th className="border border-black px-2 py-1 text-right">1년 예산</th>
              <th className="border border-black px-2 py-1 text-right">분기 목표<br/>(예산÷4)</th>
              <th className="border border-black px-2 py-1 text-right">1년예산 내<br/>사용비율</th>
              <th className="border border-black px-2 py-1 text-right">분기내<br/>사용비율</th>
              <th className="border border-black px-2 py-1 text-right bg-amber-50">연초부터 누적<br/>사용비율</th>
            </tr>
          </thead>
          <tbody>
            {report.groups.map(g => (
              <tr key={g.group_name}>
                <td className="border border-black px-2 py-1 font-bold bg-gray-50">{g.group_name}</td>
                <td className="border border-black px-2 py-1 text-right">{formatKRW(g.used)}</td>
                <td className="border border-black px-2 py-1 text-right">{formatKRW(g.budget)}</td>
                <td className="border border-black px-2 py-1 text-right text-slate-500">{formatKRW(Math.round(g.quarterBudget))}</td>
                <td className="border border-black px-2 py-1 text-right font-medium">{pct(g.useRate)}</td>
                <td className="border border-black px-2 py-1 text-right font-medium">{pct(g.quarterRate)}</td>
                <td className="border border-black px-2 py-1 text-right font-bold bg-amber-50">{cumPct(cumUsed(g.group_name), g.budget)}</td>
              </tr>
            ))}
            <tr className="bg-gray-100">
              <td className="border border-black px-2 py-1 font-bold">합계</td>
              <td className="border border-black px-2 py-1 text-right font-bold">{formatKRW(report.totalUsed)}</td>
              <td className="border border-black px-2 py-1 text-right font-bold">{formatKRW(report.totalBudget)}</td>
              <td className="border border-black px-2 py-1"></td>
              <td className="border border-black px-2 py-1 text-right font-bold">{pct(report.useRate)}</td>
              <td className="border border-black px-2 py-1"></td>
              <td className="border border-black px-2 py-1 text-right font-bold bg-amber-50">{cumPct(cumulative.totalUsed, cumulative.totalBudget)}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-[10px] text-slate-400">* 분기 목표 = 1년 예산의 1/4(단순 4등분). 상반기 누적은 1년 예산의 1/2로 계산됩니다.<br/>* 1년예산 내 사용비율 = 사용금액÷1년예산 · 분기내 사용비율 = 사용금액÷분기 목표</p>

        {/* 전체 총평 메모 */}
        {memoOf('전체') && (
          <div className="text-xs text-slate-700 whitespace-pre-wrap border-t pt-3 leading-relaxed">{memoOf('전체')}</div>
        )}
      </div>

      {/* 전체 총평 입력 (화면 편집용) */}
      <Card className="print:hidden">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-600">총평 메모 (선택)</CardTitle></CardHeader>
        <CardContent>
          <textarea
            value={memoOf('전체')}
            onChange={e => setMemo('전체', e.target.value)}
            placeholder="예) 분기 목표 집행률(25%)에 근접하나 사역·소그룹 예산 집행이 저조하여..."
            rows={3}
            className="w-full text-sm border rounded-lg p-2.5 resize-y"
          />
        </CardContent>
      </Card>

      {/* ===== PDF 2장~: 대분류별 세부 ===== */}
      {report.groups.map(g => (
        <Fragment key={g.group_name}>
          <div data-pdf-page className="bg-white border-2 border-black p-6 space-y-3">
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-black">{g.group_name} <span className="text-sm font-normal text-slate-500">· 분기내 사용비율 {pct(g.quarterRate)} · 1년예산 내 사용비율 {pct(g.useRate)}</span></h3>
              <span className="text-sm font-bold">{formatKRW(g.used)} / {formatKRW(g.budget)}</span>
            </div>
            <table className="border-collapse border border-black w-full text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black px-2 py-1 text-left">항목</th>
                  <th className="border border-black px-2 py-1 text-right">이번 분기<br/>사용금액</th>
                  <th className="border border-black px-2 py-1 text-right">1년 예산</th>
                  <th className="border border-black px-2 py-1 text-right">분기 목표<br/>(예산÷4)</th>
                  <th className="border border-black px-2 py-1 text-right">1년예산 내<br/>사용비율</th>
                  <th className="border border-black px-2 py-1 text-right">분기내<br/>사용비율</th>
                  <th className="border border-black px-2 py-1 text-right bg-amber-50">연초부터 누적<br/>사용비율</th>
                </tr>
              </thead>
              <tbody>
                {g.rows.map(r => (
                  <tr key={r.category_name} className={r.used === 0 ? 'text-slate-400' : ''}>
                    <td className="border border-black px-2 py-1">{r.category_name}</td>
                    <td className="border border-black px-2 py-1 text-right">{formatKRW(r.used)}</td>
                    <td className="border border-black px-2 py-1 text-right">{formatKRW(r.budget)}</td>
                    <td className="border border-black px-2 py-1 text-right text-slate-400">{formatKRW(Math.round(r.quarterBudget))}</td>
                    <td className="border border-black px-2 py-1 text-right">{pct(r.useRate)}</td>
                    <td className="border border-black px-2 py-1 text-right">{pct(r.quarterRate)}</td>
                    <td className="border border-black px-2 py-1 text-right font-medium bg-amber-50">{cumPct(cumUsed(g.group_name, r.category_name), r.budget)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="border border-black px-2 py-1 font-bold">소계</td>
                  <td className="border border-black px-2 py-1 text-right font-bold">{formatKRW(g.used)}</td>
                  <td className="border border-black px-2 py-1 text-right font-bold">{formatKRW(g.budget)}</td>
                  <td className="border border-black px-2 py-1"></td>
                  <td className="border border-black px-2 py-1 text-right font-bold">{pct(g.useRate)}</td>
                  <td className="border border-black px-2 py-1 text-right font-bold">{pct(g.quarterRate)}</td>
                  <td className="border border-black px-2 py-1 text-right font-bold bg-amber-50">{cumPct(cumUsed(g.group_name), g.budget)}</td>
                </tr>
              </tbody>
            </table>
            {memoOf(g.group_name) && (
              <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed border-t pt-2">{memoOf(g.group_name)}</div>
            )}
          </div>

          {/* 그룹 메모 입력 (화면 편집용) */}
          <div className="print:hidden -mt-2 px-1">
            <textarea
              value={memoOf(g.group_name)}
              onChange={e => setMemo(g.group_name, e.target.value)}
              placeholder={`${g.group_name} 코멘트 (예: 수련회 제외 시 실사용률 낮음, 특정 팀 활동 확인 필요 등)`}
              rows={2}
              className="w-full text-sm border rounded-lg p-2.5 resize-y bg-slate-50/50"
            />
          </div>
        </Fragment>
      ))}
    </div>
  )
}
