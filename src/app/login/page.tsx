'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type Step = 'name' | 'login' | 'register' | 'forgot'

export default function LoginPage() {
  const router = useRouter()
  const { login, register } = useAuth()
  const [step, setStep] = useState<Step>('name')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)

  async function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setChecking(true)
    // Supabase에서 이름 존재 여부 확인
    const { supabase } = await import('@/lib/supabase')
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('name', name.trim())
      .single()

    if (data) {
      setStep('login')
    } else {
      setStep('register')
    }
    setChecking(false)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const result = await login(name.trim(), password)
    if (result.ok) {
      toast.success(`${name.trim()}님, 환영합니다!`)
      router.push('/')
    } else {
      toast.error(result.error)
    }
    setLoading(false)
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 2) {
      return toast.error('비밀번호를 2자 이상 입력해주세요.')
    }
    if (password !== passwordConfirm) {
      return toast.error('비밀번호가 일치하지 않습니다.')
    }
    setLoading(true)
    const result = await register(name.trim(), password)
    if (result.ok) {
      toast.success(`${name.trim()}님, 등록 완료! 환영합니다!`)
      router.push('/')
    } else {
      toast.error(result.error)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <p className="text-xs font-medium text-slate-400 tracking-widest uppercase">아현젊은이 교회</p>
          <h1 className="text-2xl font-bold text-slate-800">재정관리 시스템</h1>
        </div>

        {step === 'name' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">로그인</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNameSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    placeholder="이름을 입력하세요"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoFocus
                    required
                  />
                  <p className="text-xs text-slate-400">처음 오신 분은 이름 입력 후 비밀번호를 설정합니다.</p>
                </div>
                <Button type="submit" className="w-full" disabled={checking || !name.trim()}>
                  {checking ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />확인 중...</> : '다음'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'login' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">
                <span className="text-purple-600 font-bold">{name}</span>님, 비밀번호를 입력해주세요
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />로그인 중...</> : '로그인'}
                </Button>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => { setStep('name'); setPassword('') }}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    다른 이름으로 로그인
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('forgot')}
                    className="text-xs text-slate-400 hover:text-purple-600"
                  >
                    비밀번호를 잊으셨나요?
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'forgot' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">비밀번호를 잊으셨나요?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-500">
                관리자에게 비밀번호 초기화를 요청해주세요.
                초기화 후 새 비밀번호로 로그인할 수 있습니다.
              </p>
              <button
                type="button"
                onClick={() => { setStep('name'); setPassword('') }}
                className="w-full text-xs text-slate-400 hover:text-slate-600"
              >
                ← 로그인으로 돌아가기
              </button>
            </CardContent>
          </Card>
        )}

        {step === 'register' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">
                <span className="text-purple-600 font-bold">{name}</span>님, 처음이시네요! 비밀번호를 설정해주세요
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-password">비밀번호</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="비밀번호를 설정하세요"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-confirm">비밀번호 확인</Label>
                  <Input
                    id="reg-confirm"
                    type="password"
                    placeholder="비밀번호를 한 번 더 입력하세요"
                    value={passwordConfirm}
                    onChange={e => setPasswordConfirm(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />등록 중...</> : '등록하고 시작'}
                </Button>
                <button
                  type="button"
                  onClick={() => { setStep('name'); setPassword(''); setPasswordConfirm('') }}
                  className="w-full text-xs text-slate-400 hover:text-slate-600"
                >
                  다른 이름으로 로그인
                </button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
