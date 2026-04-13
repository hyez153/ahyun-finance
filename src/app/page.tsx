'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Receipt, List, LayoutDashboard, LogOut, Loader2 } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const { user, loading, isAdmin, logout } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-1">
          <p className="text-xs font-medium text-slate-400 tracking-widest uppercase">아현젊은이 교회</p>
          <h1 className="text-3xl font-bold text-slate-800">재정관리 시스템</h1>
          <p className="text-sm text-slate-500 mt-2">
            {user.name}님 환영합니다
            {isAdmin && <span className="ml-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">관리자</span>}
          </p>
        </div>

        <div className="grid gap-3">
          <Link href="/receipts/new">
            <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
              <CardHeader className="flex flex-row items-center gap-4 py-4">
                <div className="p-2.5 bg-blue-100 rounded-xl">
                  <Receipt className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-sm font-semibold">영수증 등록</CardTitle>
                  <CardDescription className="text-xs mt-0.5">지출 영수증을 제출합니다</CardDescription>
                </div>
                <Button size="sm" className="shrink-0">등록하기</Button>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/receipts">
            <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
              <CardHeader className="flex flex-row items-center gap-4 py-4">
                <div className="p-2.5 bg-emerald-100 rounded-xl">
                  <List className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-sm font-semibold">제출 내역 조회</CardTitle>
                  <CardDescription className="text-xs mt-0.5">내가 제출한 영수증을 확인합니다</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="shrink-0">내역 보기</Button>
              </CardHeader>
            </Card>
          </Link>

          {isAdmin && (
            <Link href="/admin">
              <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border-purple-100">
                <CardHeader className="flex flex-row items-center gap-4 py-4">
                  <div className="p-2.5 bg-purple-100 rounded-xl">
                    <LayoutDashboard className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-sm font-semibold">관리자</CardTitle>
                    <CardDescription className="text-xs mt-0.5">예산 현황 및 청구 관리</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0">관리자</Button>
                </CardHeader>
              </Card>
            </Link>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">
            매월 첫째주·셋째주 토요일 23:59 마감 · 다음날 일요일 청구
          </p>
          <button
            onClick={() => { logout(); router.replace('/login') }}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            로그아웃
          </button>
        </div>
      </div>
    </main>
  )
}
