'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from './supabase'
import { UserRole } from '@/types/database'

interface AuthUser {
  id: number
  name: string
  role: UserRole
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (name: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (name: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'ahyun_auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // 자동 로그인: localStorage에서 복원
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { id: number; name: string; password: string }
        // DB에서 검증
        supabase
          .from('users')
          .select('id, name, role')
          .eq('name', parsed.name)
          .eq('password', parsed.password)
          .single()
          .then(({ data }) => {
            if (data) {
              setUser({ id: data.id, name: data.name, role: data.role as UserRole })
            } else {
              localStorage.removeItem(STORAGE_KEY)
            }
            setLoading(false)
          })
      } catch {
        localStorage.removeItem(STORAGE_KEY)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  async function login(name: string, password: string) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, role')
      .eq('name', name)
      .eq('password', password)
      .single()

    if (error || !data) {
      return { ok: false, error: '이름 또는 비밀번호가 일치하지 않습니다.' }
    }

    const authUser: AuthUser = { id: data.id, name: data.name, role: data.role as UserRole }
    setUser(authUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: data.id, name, password }))
    return { ok: true }
  }

  async function register(name: string, password: string) {
    // 이미 존재하는지 확인
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('name', name)
      .single()

    if (existing) {
      return { ok: false, error: '이미 등록된 이름입니다. 로그인해주세요.' }
    }

    const { data, error } = await supabase
      .from('users')
      .insert({ name, password, role: 'user' })
      .select('id, name, role')
      .single()

    if (error || !data) {
      return { ok: false, error: '등록 중 오류가 발생했습니다.' }
    }

    const authUser: AuthUser = { id: data.id, name: data.name, role: data.role as UserRole }
    setUser(authUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: data.id, name, password }))
    return { ok: true }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
