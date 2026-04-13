'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { formatKRW } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Receipt, CreditCard, BarChart3, AlertTriangle } from 'lucide-react'

type GroupName = '목회' | '양육' | '사역' | '행사'
interface GroupStat {
  group: GroupName
  budget: number
  used: number
}

const GROUP_COLORS: Record<GroupName, string> = {
  '목회': '#3b82f6',
  '양육': '#10b981',
  '사역': '#f59e0b',
  '행사': '#8b5cf6',
}

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalReceipts: 0,
    pendingReceipts: 0,
    totalBudget: 0,
    usedBudget: 0,
    activeBatch: null as { year: number; month: number; half: number; status: string } | null,
  })
  const [groupStats, setGroupStats] = useState<GroupStat[]>([])

  useEffect(() => {
    async function load() {
      const [receiptsRes, categoriesRes, transactionsRes, pendingReceiptsRes, batchRes] = await Promise.all([
        supabase.from('receipts').select('id, status, is_claimed, amount'),
        supabase.from('budget_categories').select('id, category_name, group_name, annual_budget'),
        supabase.from('budget_transactions').select('budget_category_id, amount'),
        supabase.from('receipts').select('budget_category_id, amount').eq('status', 'submitted').eq('is_claimed', false),
        supabase.from('claim_batches').select('year, month, half, status').order('year', { ascending: false }).order('month', { ascending: false }).order('half', { ascending: false }).limit(1),
      ])

      const receipts = receiptsRes.data ?? []
      const categories = (categoriesRes.data ?? []) as { id: number; category_name: string; group_name: GroupName; annual_budget: number }[]
      const transactions = (transactionsRes.data ?? []) as { budget_category_id: number; amount: number }[]
      const pendingReceipts = (pendingReceiptsRes.data ?? []) as { budget_category_id: number; amount: number }[]

      // 소그룹 리더 카테고리 제외 (예산 탭과 동일)
      const mainCategories = categories.filter(c => !c.category_name.startsWith('소그룹_'))
      const mainCatIds = new Set(mainCategories.map(c => c.id))

      const totalBudget = mainCategories.reduce((s, c) => s + (c.annual_budget ?? 0), 0)
      const confirmed = transactions
        .filter(t => mainCatIds.has(t.budget_category_id))
        .reduce((s, t) => s + Math.abs(t.amount), 0)
      const pending = pendingReceipts
        .filter(r => mainCatIds.has(r.budget_category_id))
        .reduce((s, r) => s + Number(r.amount), 0)

      setStats({
        totalReceipts: receipts.length,
        pendingReceipts: receipts.filter(r => r.status === 'submitted' && !r.is_claimed).length,
        totalBudget,
        usedBudget: confirmed + pending,
        activeBatch: batchRes.data?.[0] ?? null,
      })

      // 그룹별 통계
      const catIdToGroup = new Map<number, GroupName>()
      mainCategories.forEach(c => catIdToGroup.set(c.id, c.group_name))

      const groupBudget: Record<GroupName, number> = { '목회': 0, '양육': 0, '사역': 0, '행사': 0 }
      const groupUsed: Record<GroupName, number> = { '목회': 0, '양육': 0, '사역': 0, '행사': 0 }

      mainCategories.forEach(c => {
        groupBudget[c.group_name] = (groupBudget[c.group_name] || 0) + (c.annual_budget ?? 0)
      })
      transactions.forEach(t => {
        const g = catIdToGroup.get(t.budget_category_id)
        if (g) groupUsed[g] = (groupUsed[g] || 0) + Math.abs(t.amount)
      })
      pendingReceipts.forEach(r => {
        const g = catIdToGroup.get(r.budget_category_id)
        if (g) groupUsed[g] = (groupUsed[g] || 0) + Number(r.amount)
      })

      setGroupStats(
        (['목회', '양육', '사역', '행사'] as GroupName[]).map(g => ({
          group: g,
          budget: groupBudget[g] || 0,
          used: groupUsed[g] || 0,
        }))
      )
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
                <p className="text-2xl font-bold text-slate-800">{stats.activeBatch.month}월 {stats.activeBatch.half === 1 ? '첫째주' : '셋째주'}</p>
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

      {/* 그룹별 예산 사용 현황 차트 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-700">그룹별 예산 사용 현황</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {groupStats.map(({ group, budget, used }) => {
            const rate = budget > 0 ? Math.round((used / budget) * 100) : 0
            const barWidth = budget > 0 ? Math.min((used / budget) * 100, 100) : 0
            return (
              <div key={group} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: GROUP_COLORS[group] }}
                    />
                    <span className="font-medium text-slate-700">{group}</span>
                  </div>
                  <span className="text-slate-500">
                    {formatKRW(used)} / {formatKRW(budget)} ({rate}%)
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: rate > 90 ? '#ef4444' : GROUP_COLORS[group],
                    }}
                  />
                </div>
              </div>
            )
          })}
          {groupStats.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-4">데이터를 불러오는 중...</p>
          )}
        </CardContent>
      </Card>

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
