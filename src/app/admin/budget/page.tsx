'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { GroupName } from '@/types/database'
import { formatKRW } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const GROUPS: GroupName[] = ['목회', '양육', '사역', '행사']

interface BudgetItem {
  id: number
  group_name: GroupName
  category_name: string
  annual_budget: number
  confirmed: number    // 정산 완료 (budget_transactions)
  pending: number      // 청구 대기 (submitted 영수증 중 미청구)
  remaining: number    // 남은 잔액
  usage_rate: number
  isLeader: boolean
}

interface ClaimPeriodData {
  date: string
  amount: number
  receiptCount: number
}

interface GroupClaimData {
  date: string
  목회: number
  양육: number
  사역: number
  행사: number
}

const GROUP_COLORS: Record<string, string> = {
  '목회': '#6366f1', // indigo
  '양육': '#10b981', // emerald
  '사역': '#f59e0b', // amber
  '행사': '#ef4444', // red
}

export default function BudgetPage() {
  const [items, setItems] = useState<BudgetItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [claimPeriods, setClaimPeriods] = useState<ClaimPeriodData[]>([])
  const [groupClaimData, setGroupClaimData] = useState<GroupClaimData[]>([])
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set(GROUPS))

  useEffect(() => {
    async function load() {
      const [catRes, txRes, receiptRes, claimedReceiptsRes] = await Promise.all([
        supabase.from('budget_categories').select('*'),
        supabase.from('budget_transactions').select('budget_category_id, amount'),
        supabase.from('receipts').select('budget_category_id, amount').eq('status', 'submitted').eq('is_claimed', false),
        supabase.from('receipts').select('budget_category_id, amount, receipt_date').eq('is_claimed', true),
      ])

      const categories = (catRes.data ?? []) as import('@/types/database').BudgetCategory[]
      const txList = (txRes.data ?? []) as { budget_category_id: number; amount: number }[]
      const receiptList = (receiptRes.data ?? []) as { budget_category_id: number; amount: number }[]

      if (categories.length === 0) return

      const confirmedMap: Record<number, number> = {}
      for (const tx of txList) {
        confirmedMap[tx.budget_category_id] = (confirmedMap[tx.budget_category_id] ?? 0) + Math.abs(tx.amount)
      }

      const pendingMap: Record<number, number> = {}
      for (const r of receiptList) {
        pendingMap[r.budget_category_id] = (pendingMap[r.budget_category_id] ?? 0) + Number(r.amount)
      }

      const result: BudgetItem[] = categories.map(c => {
        const confirmed = confirmedMap[c.id] ?? 0
        const pending = pendingMap[c.id] ?? 0
        const budget = c.annual_budget ?? 0
        const remaining = budget - confirmed - pending
        return {
          id: c.id,
          group_name: c.group_name as GroupName,
          category_name: c.category_name,
          annual_budget: budget,
          confirmed,
          pending,
          remaining,
          usage_rate: budget > 0 ? Math.round(((confirmed + pending) / budget) * 100) : 0,
          isLeader: c.category_name.startsWith('소그룹_'),
        }
      })

      setItems(result.sort((a, b) => a.category_name.localeCompare(b.category_name, 'ko')))

      // 청구된 영수증 기반으로 그룹별 청구일별 집계
      const claimedReceipts = (claimedReceiptsRes.data ?? []) as { budget_category_id: number; amount: number; receipt_date: string }[]
      const catMap = new Map(categories.map(c => [c.id, c.group_name as string]))

      const groupPeriodMap: Record<string, Record<string, number>> = {}
      const receiptCountMap: Record<string, number> = {}

      for (const r of claimedReceipts) {
        const date = r.receipt_date
        const group = catMap.get(r.budget_category_id) ?? '기타'
        const amt = Number(r.amount || 0)
        if (!groupPeriodMap[date]) groupPeriodMap[date] = {}
        groupPeriodMap[date][group] = (groupPeriodMap[date][group] ?? 0) + amt
        receiptCountMap[date] = (receiptCountMap[date] ?? 0) + 1
      }

      const periods = Object.keys(groupPeriodMap)
        .sort()
        .map(date => {
          const groups = groupPeriodMap[date]
          const total = Object.values(groups).reduce((s, v) => s + v, 0)
          return { date, amount: total, receiptCount: receiptCountMap[date] ?? 0 }
        })

      const groupData: GroupClaimData[] = Object.keys(groupPeriodMap)
        .sort()
        .map(date => ({
          date,
          목회: groupPeriodMap[date]['목회'] ?? 0,
          양육: groupPeriodMap[date]['양육'] ?? 0,
          사역: groupPeriodMap[date]['사역'] ?? 0,
          행사: groupPeriodMap[date]['행사'] ?? 0,
        }))

      setClaimPeriods(periods)
      setGroupClaimData(groupData)
      setLoading(false)
    }
    load()
  }, [])

  const mainItems = items.filter(i => !i.isLeader)
  const leaderItems = items.filter(i => i.isLeader)

  const totalBudget = mainItems.reduce((s, c) => s + c.annual_budget, 0)
  const totalConfirmed = mainItems.reduce((s, c) => s + c.confirmed, 0)
  const totalPending = mainItems.reduce((s, c) => s + c.pending, 0)
  const totalUsed = totalConfirmed + totalPending
  const totalRate = totalBudget > 0 ? Math.round((totalUsed / totalBudget) * 100) : 0

  function groupSummary(group: GroupName) {
    const groupItems = mainItems.filter(s => s.group_name === group)
    return {
      items: groupItems,
      totalBudget: groupItems.reduce((s, c) => s + c.annual_budget, 0),
      totalConfirmed: groupItems.reduce((s, c) => s + c.confirmed, 0),
      totalPending: groupItems.reduce((s, c) => s + c.pending, 0),
    }
  }

  function toggleExpand(name: string) {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
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

      {/* 예산 소진율 트렌드 차트 */}
      {groupClaimData.length > 0 && (() => {
        // 날짜순 누적 소진율 계산
        const budgetByGroup: Record<string, number> = {}
        for (const item of mainItems) {
          budgetByGroup[item.group_name] = (budgetByGroup[item.group_name] || 0) + item.annual_budget
        }

        const cumulative: Record<string, number> = {}
        const trendPoints = groupClaimData.map(period => {
          for (const g of GROUPS) {
            cumulative[g] = (cumulative[g] || 0) + (period[g] || 0)
          }
          const groups: Record<string, number> = {}
          for (const g of GROUPS) {
            const budget = budgetByGroup[g] || 1
            groups[g] = ((cumulative[g] || 0) / budget) * 100
          }
          const d = new Date(period.date)
          return { label: `${d.getMonth() + 1}/${d.getDate()}`, groups }
        })

        const W = 600, H = 260, PL = 40, PR = 16, PT = 24, PB = 40
        const chartW = W - PL - PR, chartH = H - PT - PB
        const maxY = 110
        const yTicks = [0, 25, 50, 75, 100]
        const xStep = trendPoints.length > 1 ? chartW / (trendPoints.length - 1) : 0
        const toX = (i: number) => PL + i * xStep
        const toY = (v: number) => PT + chartH - (v / maxY) * chartH

        return (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-600">예산 소진율 트렌드 (%)</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 280 }}>
                {yTicks.map(v => (
                  <g key={v}>
                    <line x1={PL} y1={toY(v)} x2={W - PR} y2={toY(v)} stroke="#e2e8f0" strokeWidth={1} />
                    <text x={PL - 6} y={toY(v) + 4} textAnchor="end" fontSize={10} fill="#94a3b8">{v}%</text>
                  </g>
                ))}
                {trendPoints.map((d, i) => (
                  <text key={i} x={toX(i)} y={H - 8} textAnchor="middle" fontSize={10} fill="#94a3b8">{d.label}</text>
                ))}
                {GROUPS.filter(g => selectedGroups.has(g)).map(group => {
                  const color = GROUP_COLORS[group]
                  const points = trendPoints.map((d, i) => `${toX(i)},${toY(Math.min(d.groups[group] ?? 0, 120))}`)
                  return (
                    <g key={group}>
                      <polyline points={points.join(' ')} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                      {trendPoints.map((d, i) => {
                        const val = d.groups[group] ?? 0
                        const activeGroups = GROUPS.filter(g => selectedGroups.has(g))
                        const entries = activeGroups.map(g => ({
                          group: g,
                          val: trendPoints[i].groups[g] ?? 0,
                          y: toY(Math.min(trendPoints[i].groups[g] ?? 0, 120)),
                        })).sort((a, b) => a.y - b.y)
                        const minGap = 11
                        const resolved: Record<string, number> = {}
                        for (let j = 0; j < entries.length; j++) {
                          let labelY = entries[j].y - 9
                          if (j > 0) {
                            const prevY = resolved[entries[j - 1].group]
                            if (labelY - prevY < minGap) labelY = prevY + minGap
                          }
                          resolved[entries[j].group] = labelY
                        }
                        return (
                          <g key={i}>
                            <circle cx={toX(i)} cy={toY(Math.min(val, 120))} r={4} fill="white" stroke={color} strokeWidth={2} />
                            {(i === trendPoints.length - 1 || trendPoints.length <= 6) && (
                              <text x={toX(i) + (i === trendPoints.length - 1 ? 18 : 0)} y={resolved[group] + 4} textAnchor={i === trendPoints.length - 1 ? 'start' : 'middle'} fontSize={9} fill={color} fontWeight="bold">
                                {Math.round(val)}%
                              </text>
                            )}
                          </g>
                        )
                      })}
                    </g>
                  )
                })}
              </svg>
              <div className="flex items-center justify-center gap-2 mt-2">
                {GROUPS.map(g => {
                  const isActive = selectedGroups.has(g)
                  return (
                    <button
                      key={g}
                      onClick={() => {
                        setSelectedGroups(prev => {
                          const next = new Set(prev)
                          if (next.has(g)) {
                            if (next.size > 1) next.delete(g) // 최소 1개는 선택
                          } else {
                            next.add(g)
                          }
                          return next
                        })
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                        isActive
                          ? 'text-white shadow-sm'
                          : 'text-slate-400 bg-slate-100'
                      }`}
                      style={isActive ? { backgroundColor: GROUP_COLORS[g] } : undefined}
                    >
                      {g}
                    </button>
                  )
                })}
              </div>

              {/* 청구일별 상세 금액 */}
              <div className="mt-4 space-y-2 border-t pt-3">
                {groupClaimData.map((period, idx) => {
                  const d = new Date(period.date)
                  const total = period.목회 + period.양육 + period.사역 + period.행사
                  return (
                    <div key={idx}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-600">
                          {d.getFullYear()}. {d.getMonth() + 1}. {d.getDate()}.
                        </span>
                        <span className="text-xs text-slate-400">({claimPeriods.find(p => p.date === period.date)?.receiptCount ?? 0}건)</span>
                        <span className="text-xs font-bold text-slate-700 ml-auto">{formatKRW(total)}</span>
                      </div>
                      <div className="flex gap-3 flex-wrap pl-2">
                        {GROUPS.map(g => {
                          const val = period[g as keyof GroupClaimData] as number
                          if (val === 0) return null
                          return (
                            <span key={g} className="text-xs font-medium" style={{ color: GROUP_COLORS[g] }}>
                              {g} {formatKRW(val)}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })()}

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
            <span>정산완료 {formatKRW(totalConfirmed)}</span>
            {totalPending > 0 && <span className="text-amber-500">청구대기 {formatKRW(totalPending)}</span>}
            <span>잔액 {formatKRW(totalBudget - totalUsed)}</span>
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
          const { items: gItems, totalBudget: gBudget, totalConfirmed: gConfirmed, totalPending: gPending } = groupSummary(g)
          const gUsed = gConfirmed + gPending
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
                    <span>정산 {formatKRW(gConfirmed)}</span>
                    {gPending > 0 && <span className="text-amber-500">대기 {formatKRW(gPending)}</span>}
                    <span>잔액 {formatKRW(gBudget - gUsed)}</span>
                    <span>예산 {formatKRW(gBudget)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* 항목별 */}
              <div className="space-y-2">
                {gItems.map(item => {
                  const totalUsedItem = item.confirmed + item.pending
                  const isOver = item.remaining < 0
                  const isSogroupParent = item.category_name === '소그룹 운영비'
                  const isExpanded = expandedGroups.has(item.category_name)

                  return (
                    <div key={item.id}>
                      <Card
                        className={`${isOver ? 'border-red-200' : ''} ${isSogroupParent ? 'cursor-pointer' : ''}`}
                        onClick={isSogroupParent ? () => toggleExpand(item.category_name) : undefined}
                      >
                        <CardContent className="py-3 px-4">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-700">
                                {isSogroupParent ? (isExpanded ? '▼ ' : '▶ ') : ''}
                                {item.category_name}
                              </span>
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
                            <span>정산 {formatKRW(item.confirmed)}</span>
                            {item.pending > 0 && <span className="text-amber-500">대기 {formatKRW(item.pending)}</span>}
                            <span className={isOver ? 'text-red-500 font-medium' : ''}>
                              잔액 {formatKRW(item.remaining)}
                            </span>
                            <span>예산 {formatKRW(item.annual_budget)}</span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* 소그룹 리더 펼치기 */}
                      {isSogroupParent && isExpanded && (
                        <div className="ml-4 mt-1 space-y-1">
                          {leaderItems.map(leader => (
                            <Card key={leader.id} className="bg-slate-50/50">
                              <CardContent className="py-2 px-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-slate-600">
                                    {leader.category_name.replace('소그룹_', '')}
                                  </span>
                                  <span className="text-xs text-slate-500">{leader.usage_rate}%</span>
                                </div>
                                <Progress value={Math.min(leader.usage_rate, 100)} className="h-1 mt-1" />
                                <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                                  <span>정산 {formatKRW(leader.confirmed)}</span>
                                  {leader.pending > 0 && <span className="text-amber-500">대기 {formatKRW(leader.pending)}</span>}
                                  <span>잔액 {formatKRW(leader.remaining)}</span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
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
