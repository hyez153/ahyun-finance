'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Receipt } from '@/types/database'
import { formatKRW, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, Search } from 'lucide-react'

const STATUS_LABEL: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: '임시저장', variant: 'secondary' },
  submitted: { label: '제출됨', variant: 'default' },
  approved: { label: '승인됨', variant: 'outline' },
}

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('receipts')
      .select('*, budget_categories(group_name, category_name)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setReceipts((data as Receipt[]) ?? [])
        setLoading(false)
      })
  }, [])

  const filtered = receipts.filter(r =>
    r.submitter_name.includes(search) ||
    r.vendor_name.includes(search) ||
    r.budget_categories?.category_name.includes(search)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/"><ArrowLeft className="w-5 h-5 text-slate-500" /></Link>
          <h1 className="font-semibold text-slate-800 flex-1">제출 내역</h1>
          <Link href="/receipts/new">
            <Button size="sm"><Plus className="w-4 h-4 mr-1" />등록</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="이름, 사용처, 항목으로 검색"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-lg animate-pulse border" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-slate-400 text-sm">
              {search ? '검색 결과가 없습니다.' : '제출된 영수증이 없습니다.'}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filtered.map(r => (
              <Card key={r.id} className="hover:shadow-sm transition-shadow">
                <CardHeader className="py-3 px-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{r.budget_categories?.group_name}</span>
                        <span className="text-xs font-medium text-slate-600">{r.budget_categories?.category_name}</span>
                      </div>
                      <CardTitle className="text-sm">{r.vendor_name}</CardTitle>
                      <p className="text-xs text-slate-400">
                        {r.submitter_name} · {formatDate(r.receipt_date)}
                        {r.memo && ` · ${r.memo}`}
                      </p>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <p className="font-semibold text-slate-800">{formatKRW(r.amount)}</p>
                      <div className="flex items-center gap-1 justify-end">
                        <Badge variant={STATUS_LABEL[r.status].variant} className="text-xs">
                          {STATUS_LABEL[r.status].label}
                        </Badge>
                        {r.is_claimed && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-200">청구완료</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
