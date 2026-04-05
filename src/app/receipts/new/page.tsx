'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { BudgetCategory } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Upload, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const GROUP_ORDER = ['목회', '양육', '사역', '행사'] as const

export default function NewReceiptPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<BudgetCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const [form, setForm] = useState({
    submitter_name: '',
    budget_category_id: '',
    amount: '',
    receipt_date: new Date().toISOString().split('T')[0],
    vendor_name: '',
    memo: '',
  })

  useEffect(() => {
    supabase.from('budget_categories').select('*').order('group_name').then(({ data }) => {
      setCategories((data as BudgetCategory[]) ?? [])
    })
  }, [])

  const grouped = GROUP_ORDER.map(g => ({
    group: g,
    items: categories.filter(c => c.group_name === g),
  }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return toast.error('영수증 파일을 첨부해주세요.')
    if (!form.budget_category_id) return toast.error('예산 항목을 선택해주세요.')

    setLoading(true)
    try {
      const ext = file.name.split('.').pop()
      const filePath = `${Date.now()}-${form.submitter_name}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('receipts').getPublicUrl(filePath)

      const { error: insertError } = await supabase.from('receipts').insert({
        submitter_name: form.submitter_name,
        budget_category_id: Number(form.budget_category_id),
        amount: Number(form.amount.replace(/,/g, '')),
        receipt_date: form.receipt_date,
        vendor_name: form.vendor_name,
        memo: form.memo || null,
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

      <div className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label>예산 항목 *</Label>
                <Select
                  value={form.budget_category_id}
                  onValueChange={v => setForm(f => ({ ...f, budget_category_id: v ?? '' }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="항목 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {grouped.map(({ group, items }) => (
                      items.length > 0 && (
                        <div key={group}>
                          <div className="px-2 py-1 text-xs font-semibold text-slate-400 bg-slate-50">{group}</div>
                          {items.map(c => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.category_name}
                            </SelectItem>
                          ))}
                        </div>
                      )
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="amount">금액 *</Label>
                  <Input
                    id="amount"
                    placeholder="0"
                    value={form.amount}
                    onChange={e => handleAmountChange(e.target.value)}
                    inputMode="numeric"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="receipt_date">사용일 *</Label>
                  <Input
                    id="receipt_date"
                    type="date"
                    value={form.receipt_date}
                    onChange={e => setForm(f => ({ ...f, receipt_date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vendor_name">사용처 *</Label>
                <Input
                  id="vendor_name"
                  placeholder="예) 스타벅스 홍대점"
                  value={form.vendor_name}
                  onChange={e => setForm(f => ({ ...f, vendor_name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="memo">적요 (동반자 등)</Label>
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
            <CardContent>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <Upload className="w-6 h-6 text-slate-400 mb-2" />
                {file ? (
                  <span className="text-sm text-slate-700 font-medium">{file.name}</span>
                ) : (
                  <span className="text-sm text-slate-400">클릭하여 파일 선택</span>
                )}
                <span className="text-xs text-slate-300 mt-1">JPG, PNG, PDF 지원</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={e => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />제출 중...</> : '영수증 제출'}
          </Button>
        </form>
      </div>
    </div>
  )
}
