'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { formatKRW } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Receipt, CreditCard, BarChart3, AlertTriangle } from 'lucide-react'

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalReceipts: 0,
    pendingReceipts: 0,
    totalBudget: 0,
    usedBudget: 0,
    activeBatch: null as { year: number; month: number; status: string } | null,
  })

  useEffect(() => {
    async function load() {
      const [receiptsRes, categoriesRes, transactionsRes, batchRes] = await Promise.all([
        supabase.from('receipts').select('id, status, is_claimed, amount'),
        supabase.from('budget_categories').select('annual_budget'),
        supabase.from('budget_transactions').select('amount'),
        supabase.from('claim_batches').select('year, month, status').order('year', { ascending: false }).order('month', { ascending: false }).limit(1),
      ])

      const receipts = receiptsRes.data ?? []
      const categories = categoriesRes.data ?? []
      const transactions = transactionsRes.data ?? []

      setStats({
        totalReceipts: receipts.length,
        pendingReceipts: receipts.filter(r => r.status === 'submitted' && !r.is_claimed).length,
        totalBudget: categories.reduce((s, c) => s + (c.annual_budget ?? 0), 0),
        usedBudget: Math.abs(transactions.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0)),
        activeBatch: batchRes.data?.[0] ?? null,
      })
    }
    load()
  }, [])

  const usageRate = stats.totalBudget > 0 ? Math.round((stats.usedBudget / stats.totalBudget) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">대시보드</h2>
        <p className="text-sm text-slate-400">2026년 재정 현황</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-500" />
              <CardTitle className="text-xs text-slate-500">전체 영수증</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-slate-800">{stats.totalReceipts}</p>
            <p className="text-xs text-slate-400">건</p>
          </CardContent>
        </Card>

        <Card className={stats.pendingReceipts > 0 ? 'border-amber-200' : ''}>
          <CardHeader className="pb-1 pt-4 px-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <CardTitle className="text-xs text-slate-500">미청구</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-amber-600">{stats.pendingReceipts}</p>
            <p className="text-xs text-slate-400">건 처리 대기</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              <CardTitle className="text-xs text-slate-500">예산 사용률</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-slate-800">{usageRate}%</p>
            <p className="text-xs text-slate-400">{formatKRW(stats.usedBudget)} 사용</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-500" />
              <CardTitle className="text-xs text-slate-500">청구 배치</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {stats.activeBatch ? (
              <>
                <p className="text-2xl font-bold text-slate-800">{stats.activeBatch.month}월</p>
                <Badge variant={stats.activeBatch.status === 'confirmed' ? 'outline' : 'default'} className="text-xs mt-0.5">
                  {stats.activeBatch.status === 'confirmed' ? '확정됨' : '진행 중'}
                </Badge>
              </>
            ) : (
              <p className="text-sm text-slate-400 pt-1">없음</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { href: '/admin/receipts', label: '영수증 전체 목록', desc: '제출된 영수증 확인 및 관리', icon: Receipt, color: 'blue' },
          { href: '/admin/claims', label: '청구 배치 관리', desc: '월별 청구 생성 및 확정', icon: CreditCard, color: 'purple' },
          { href: '/admin/budget', label: '예산 대시보드', desc: '항목별 사용액 및 잔액', icon: BarChart3, color: 'emerald' },
        ].map(({ href, label, desc, icon: Icon, color }) => (
          <Link key={href} href={href}>
            <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer h-full">
              <CardHeader className="pb-2">
                <div className={`w-8 h-8 rounded-lg bg-${color}-100 flex items-center justify-center mb-2`}>
                  <Icon className={`w-4 h-4 text-${color}-600`} />
                </div>
                <CardTitle className="text-sm">{label}</CardTitle>
                <p className="text-xs text-slate-400">{desc}</p>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
