import Link from 'next/link'
import { Receipt, CreditCard, BarChart3, Home } from 'lucide-react'

const NAV = [
  { href: '/admin', label: '홈', icon: Home },
  { href: '/admin/receipts', label: '영수증', icon: Receipt },
  { href: '/admin/claims', label: '청구', icon: CreditCard },
  { href: '/admin/budget', label: '예산', icon: BarChart3 },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">관리자</span>
            <h1 className="font-semibold text-slate-800">아현 재정 관리</h1>
          </div>
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-600">사용자 화면 →</Link>
        </div>
        <nav className="max-w-5xl mx-auto px-4 flex gap-1 pb-2">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  )
}
