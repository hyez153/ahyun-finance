'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type Step = 'name' | 'login' | 'register' | 'forgot'

// 요한계시록 22:1-2 (개역개정) — 배경 워터마크용 핵심 키워드
const VERSE_WATERMARK = [
  '수정 같이 맑은',
  '생명수의 강',
  '생명나무',
  '열두 가지 열매',
  '만국을 치료하기 위하여',
]

/** 글자를 한 글자씩 pop-in 애니메이션 (토도독). 공백은 &nbsp; */
function AnimatedText({
  text,
  startDelay = 0,
  stepMs = 40,
  className = '',
}: {
  text: string
  startDelay?: number
  stepMs?: number
  className?: string
}) {
  return (
    <span className={className} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className="ah-pop"
          style={{ animationDelay: `${startDelay + i * stepMs}ms` }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  )
}

function Sparkle({
  className = '',
  size = 14,
  delay = 0,
}: {
  className?: string
  size?: number
  delay?: number
}) {
  return (
    <span
      className={`ah-spark ah-float absolute ${className}`}
      style={{ animationDelay: `${delay}ms, ${delay + 800}ms` }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <path
          d="M12 1 L13.6 9 L22 12 L13.6 15 L12 23 L10.4 15 L2 12 L10.4 9 Z"
          fill="currentColor"
        />
      </svg>
    </span>
  )
}

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
    <main
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-start px-6 pt-14 pb-32 text-white"
      style={{
        background:
          'linear-gradient(160deg, #b3a0ec 0%, #c8b0ea 50%, #e6c4e9 100%)',
      }}
    >
      {/* 배경 블러 블롭 */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-60 rounded-full bg-white/35 blur-3xl mix-blend-screen" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-80 rounded-full bg-pink-200/45 blur-3xl mix-blend-screen" />
      <div className="pointer-events-none absolute top-1/3 -right-16 w-48 h-28 rounded-full bg-purple-100/50 blur-3xl mix-blend-screen" />

      {/* ───── 상단 로고 + 후광 ───── */}
      <div className="relative z-10 flex flex-col items-center mt-2 mb-8">
        <div className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] flex items-center justify-center">
          {/* 글로우 후광 */}
          <div
            className="ah-glow pointer-events-none absolute inset-[-14%] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,220,240,0.3) 40%, transparent 70%)',
              filter: 'blur(22px)',
            }}
          />

          {/* 떠다니는 보조 반짝이 (로고 위에 얹히는 것들) */}
          <Sparkle className="text-white/90 top-2 left-4" size={18} delay={900} />
          <Sparkle className="text-white/80 top-6 right-2" size={14} delay={1100} />
          <Sparkle className="text-white/70 bottom-8 left-2" size={12} delay={1300} />
          <Sparkle className="text-white/80 bottom-3 right-6" size={16} delay={1500} />

          {/* 실제 로고 이미지 */}
          <Image
            src="/ahyun-logo-mark.png"
            alt="AHYUN YOUTHS"
            width={560}
            height={560}
            priority
            className="ah-logo relative z-10 w-[88%] h-auto drop-shadow-[0_6px_24px_rgba(100,60,180,0.35)]"
          />
        </div>

        {/* 서브타이틀 — 토도독 */}
        <p className="mt-4 text-[11px] font-medium tracking-[0.35em] uppercase text-white/85">
          <AnimatedText text="아현젊은이 교회" startDelay={900} stepMs={45} />
        </p>
        <p className="mt-1.5 text-sm text-white/95">
          <AnimatedText text="재정관리 시스템" startDelay={1250} stepMs={50} />
        </p>
      </div>

      {/* ───── 로그인 카드 (폼 로직 100% 유지) ───── */}
      <div className="relative z-10 w-full max-w-sm ah-fade" style={{ animationDelay: '1600ms' }}>
        {step === 'name' && (
          <Card className="border-white/50 bg-white/92 backdrop-blur-md shadow-xl shadow-purple-900/15">
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
          <Card className="border-white/50 bg-white/92 backdrop-blur-md shadow-xl shadow-purple-900/15">
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
          <Card className="border-white/50 bg-white/92 backdrop-blur-md shadow-xl shadow-purple-900/15">
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
          <Card className="border-white/50 bg-white/92 backdrop-blur-md shadow-xl shadow-purple-900/15">
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

      {/* ───── 배경 말씀 워터마크 (z-0, 카드 뒤에 깔림) ───── */}
      <div
        className="pointer-events-none select-none absolute inset-x-[8%] top-[42%] bottom-[14%] z-0 flex items-center justify-center ah-fade"
        style={{
          animationDelay: '700ms',
          fontFamily: '"Nanum Myeongjo", "Apple SD Gothic Neo", serif',
        }}
      >
        <p
          className="text-center text-white/25 font-medium"
          style={{
            fontSize: 'clamp(22px, 6vw, 32px)',
            lineHeight: 1.55,
            filter: 'blur(1.2px)',
            letterSpacing: '0.02em',
          }}
        >
          {VERSE_WATERMARK.map((line, i) => (
            <span key={i}>
              {line}
              {i < VERSE_WATERMARK.length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>

      {/* ───── 하단에 아주 작은 출처 캡션만 ───── */}
      <div
        className="pointer-events-none select-none absolute bottom-5 left-0 right-0 z-10 text-center ah-fade"
        style={{ animationDelay: '2100ms' }}
      >
        <p className="text-[9.5px] tracking-[0.45em] text-white/55">
          요 한 계 시 록 · 22 : 1 – 2
        </p>
      </div>
    </main>
  )
}
