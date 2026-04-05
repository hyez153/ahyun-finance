'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Receipt } from '@/types/database'
import { formatKRW, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, ExternalLink } from 'lucide-react'

const STATUS_MAP = {
  draft: { label: '임시저장', variant: 'secondary' as const },
  submitted: { label: '제출됨', variant: 'default' as const },
  approved: { label: '승인됨', variant: 'outline' as const },
}

export default function AdminReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [claimFilter, setClaimFilter] = useState('all')

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

  const filtered = receipts.filter(r => {
    const matchSearch =
      r.submitter_name.includes(search) ||
      r.vendor_name.includes(search) ||
      r.budget_categories?.category_name?.includes(search)
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    const matchClaim =
      claimFilter === 'all' ||
      (claimFilter === 'unclaimed' && !r.is_claimed) ||
      (claimFilter === 'claimed' && r.is_claimed)
    return matchSearch && matchStatus && matchClaim
  })

  const totalAmount = filtered.reduce((s, r) => s + r.amount, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">영수증 목록</h2>
          <p className="text-xs text-slate-400">{filtered.length}건 · 합계 {formatKRW(totalAmount)}</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="이름, 사용처, 항목 검색" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={v => setStatusFilter(v ?? 'all')}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="submitted">제출됨</SelectItem>
            <SelectItem value="approved">승인됨</SelectItem>
            <SelectItem value="draft">임시저장</SelectItem>
          </SelectContent>
        </Select>
        <Select value={claimFilter} onValueChange={v => setClaimFilter(v ?? 'all')}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="청구" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="unclaimed">미청구</SelectItem>
            <SelectItem value="claimed">청구완료</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">불러오는 중...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">영수증이 없습니다.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제출자</TableHead>
                  <TableHead>항목</TableHead>
                  <TableHead>사용처</TableHead>
                  <TableHead>사용일</TableHead>
                  <TableHead className="text-right">금액</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>청구</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.submitter_name}</TableCell>
                    <TableCell>
                      <div className="text-xs text-slate-400">{r.budget_categories?.group_name}</div>
                      <div className="text-sm">{r.budget_categories?.category_name}</div>
                    </TableCell>
                    <TableCell>
                      <div>{r.vendor_name}</div>
                      {r.memo && <div className="text-xs text-slate-400 truncate max-w-32">{r.memo}</div>}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">{formatDate(r.receipt_date)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatKRW(r.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_MAP[r.status].variant} className="text-xs">
                        {STATUS_MAP[r.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {r.is_claimed ? (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-200">완료</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">미청구</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
