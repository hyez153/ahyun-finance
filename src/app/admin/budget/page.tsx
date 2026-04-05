'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { BudgetSummary, GroupName } from '@/types/database'
import { formatKRW } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const GROUPS: GroupName[] = ['목회', '양육', '사역', '행사']

export default function BudgetPage() {
  const [summaries, setSummaries] = useState<BudgetSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: categoriesRaw } = await supabase.from('budget_categories').select('*')
      const { data: transactionsRaw } = await supabase.from('budget_transactions').select('budget_category_id, amount')

      const categories = (categoriesRaw ?? []) as import('@/types/database').BudgetCategory[]
      const txList = (transactionsRaw ?? []) as { budget_category_id: number; amount: number }[]

      if (categories.length === 0) return

      const usedMap: Record<number, number> = {}
      for (const tx of txList) {
        usedMap[tx.budget_category_id] = (usedMap[tx.budget_category_id] ?? 0) + Math.abs(tx.amount)
      }

      const result: BudgetSummary[] = categories.map(c => {
        const used = usedMap[c.id] ?? 0
        const budget = c.annual_budget ?? 0
        return {
          id: c.id,
          group_name: c.group_name as GroupName,
          category_name: c.category_name,
          annual_budget: budget,
          used_amount: used,
          remaining: budget - used,
          usage_rate: budget > 0 ? Math.round((used / budget) * 100) : 0,
        }
      })

      setSummaries(result)
      setLoading(false)
    }
    load()
  }, [])

  const totalBudget = summaries.reduce((s, c) => s + c.annual_budget, 0)
  const totalUsed = summaries.reduce((s, c) => s + c.used_amount, 0)
  const totalRate = totalBudget > 0 ? Math.round((totalUsed / totalBudget) * 100) : 0

  function groupSummary(group: GroupName) {
    const items = summaries.filter(s => s.group_name === group)
    return {
      items,
      totalBudget: items.reduce((s, c) => s + c.annual_budget, 0),
      totalUsed: items.reduce((s, c) => s + c.used_amount, 0),
    }
  }

  if (loading) {
    return <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white rounded-lg animate-pulse border" />)}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">예산 대시보드</h2>
        <p className="text-xs text-slate-400">2026년 연간 예산 현황</p>
      </div>

      {/* 전체 요약 */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-slate-600">전체 예산</CardTitle>
            <span className="text-sm font-bold text-slate-800">{totalRate}%</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={totalRate} className="h-3" />
          <div className="flex justify-between text-xs text-slate-500">
            <span>사용 {formatKRW(totalUsed)}</span>
            <span>잔액 {formatKRW(totalBudget - totalUsed)}</span>
            <span>예산 {formatKRW(totalBudget)}</span>
          </div>
        </CardContent>
      </Card>

      {/* 그룹별 탭 */}
      <Tabs defaultValue="목회">
        <TabsList className="w-full">
          {GROUPS.map(g => (
            <TabsTrigger key={g} value={g} className="flex-1 text-xs">
              {g}
            </TabsTrigger>
          ))}
        </TabsList>

        {GROUPS.map(g => {
          const { items, totalBudget: gBudget, totalUsed: gUsed } = groupSummary(g)
          const gRate = gBudget > 0 ? Math.round((gUsed / gBudget) * 100) : 0

          return (
            <TabsContent key={g} value={g} className="space-y-3 mt-4">
              {/* 그룹 소계 */}
              <Card className="bg-slate-50">
                <CardContent className="py-3 px-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">{g} 소계</span>
                    <span className="text-sm font-bold">{gRate}%</span>
                  </div>
                  <Progress value={gRate} className="h-2" />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>사용 {formatKRW(gUsed)}</span>
                    <span>잔액 {formatKRW(gBudget - gUsed)}</span>
                    <span>예산 {formatKRW(gBudget)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* 항목별 */}
              <div className="space-y-2">
                {items.map(item => {
                  const isOver = item.remaining < 0
                  return (
                    <Card key={item.id} className={isOver ? 'border-red-200' : ''}>
                      <CardContent className="py-3 px-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-700">{item.category_name}</span>
                            {isOver && <Badge variant="destructive" className="text-xs">예산 초과</Badge>}
                          </div>
                          <span className={`text-sm font-bold ${isOver ? 'text-red-600' : 'text-slate-700'}`}>
                            {item.usage_rate}%
                          </span>
                        </div>
                        <Progress
                          value={Math.min(item.usage_rate, 100)}
                          className={`h-1.5 ${isOver ? '[&>div]:bg-red-500' : ''}`}
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                          <span>사용 {formatKRW(item.used_amount)}</span>
                          <span className={isOver ? 'text-red-500 font-medium' : ''}>
                            잔액 {formatKRW(item.remaining)}
                          </span>
                          <span>예산 {formatKRW(item.annual_budget)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
