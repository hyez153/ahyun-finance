'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { Receipt } from '@/types/database'
import { formatKRW, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, Search, Loader2 } from 'lucide-react'

const STATUS_LABEL: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: '임시저장', variant: 'secondary' },
  submitted: { label: '제출됨', variant: 'default' },
  approved: { label: '승인됨', variant: 'outline' },
}

export default function ReceiptsPage() {
  const router = useRouter()
  const { user, loading: authLoading, isAdmin } = useAuth()
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (!user) return

    let query = supabase
      .from('receipts')
      .select('*, budget_categories(group_name, category_name)')
      .order('created_at', { ascending: false })

    // 일반 사용자: 본인이 제출했거나 결제자로 지정된 영수증
    if (!isAdmin) {
      query = query.or(`submitter_name.eq.${user.name},payer_name.eq.${user.name}`)
    }

    query.then(({ data }) => {
      setReceipts((data as Receipt[]) ?? [])
      setLoading(false)
    })
  }, [user, isAdmin])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    )
  }

  const filtered = receipts.filter(r =>
    r.submitter_name.includes(search) ||
    (r.payer_name ?? '').includes(search) ||
    r.vendor_name.includes(search) ||
    r.budget_categories?.category_name?.includes(search)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/"><ArrowLeft className="w-5 h-5 text-slate-500" /></Link>
          <h1 className="font-semibold text-slate-800 flex-1">
            {isAdmin ? '전체 제출 내역' : `${user.name}님의 제출 내역`}
          </h1>
          <Link href="/receipts/new">
            <Button size="sm"><Plus className="w-4 h-4 mr-1" />등록</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder={isAdmin ? '이름, 결제자, 사용처, 항목 검색' : '결제자, 사용처, 항목 검색'}
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
              <Card key={r.id} className="hover:shadow-sm transition-shadow overflow-hidden">
                <CardHeader className="py-3 px-4">
                  <div className="flex items-start justify-between gap-3">
                    {r.file_url && (
                      <div className="shrink-0" style={{ width: '72px' }}>
                        {r.file_url === '실물영수증제출' ? (
                          <div className="rounded-md border border-dashed border-amber-300 bg-amber-50 flex flex-col items-center justify-center" style={{ width: '72px', height: '96px' }}>
                            <span className="text-xs text-amber-600 font-medium text-center leading-tight px-1">실물영수증<br />제출</span>
                          </div>
                        ) : (
                          <img
                            src={r.file_url}
                            alt={r.vendor_name}
                            className="rounded-md border border-slate-200 object-contain bg-slate-50"
                            style={{ width: '72px', height: '96px' }}
                          />
                        )}
                      </div>
                    )}
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{r.budget_categories?.group_name}</span>
                        <span className="text-xs font-medium text-slate-600">{r.budget_categories?.category_name}</span>
                      </div>
                      <CardTitle className="text-sm">{r.vendor_name}</CardTitle>
                      <p className="text-xs text-slate-400">
                        {r.submitter_name}
                        {r.payer_name && r.payer_name !== r.submitter_name && (
                          <span className="text-blue-500"> (결제: {r.payer_name})</span>
                        )}
                        {' · '}{formatDate(r.receipt_date)}
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
