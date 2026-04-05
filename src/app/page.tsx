import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Receipt, List, LayoutDashboard } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-1">
          <p className="text-xs font-medium text-slate-400 tracking-widest uppercase">두나미스 교회 아현부</p>
          <h1 className="text-3xl font-bold text-slate-800">재정 관리</h1>
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
        </div>

        <p className="text-center text-xs text-slate-400">
          매월 2째주 토요일 23:59 마감 · 2째주 일요일 청구
        </p>
      </div>
    </main>
  )
}
