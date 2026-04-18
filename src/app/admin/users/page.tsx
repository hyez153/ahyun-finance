'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Loader2, KeyRound, Search } from 'lucide-react'
import { toast } from 'sonner'

interface UserRow {
  id: number
  name: string
  role: string
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [resettingId, setResettingId] = useState<number | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    const { data } = await supabase
      .from('users')
      .select('id, name, role, created_at')
      .order('name')
    setUsers((data ?? []) as UserRow[])
    setLoading(false)
  }

  async function handleReset(userId: number, userName: string) {
    if (!newPassword.trim()) {
      return toast.error('새 비밀번호를 입력해주세요.')
    }
    if (newPassword.length < 2) {
      return toast.error('비밀번호를 2자 이상 입력해주세요.')
    }
    setSaving(true)
    const { error } = await supabase
      .from('users')
      .update({ password: newPassword.trim() })
      .eq('id', userId)

    if (error) {
      toast.error('비밀번호 변경 실패: ' + error.message)
    } else {
      toast.success(`${userName}님의 비밀번호가 변경되었습니다.`)
      setResettingId(null)
      setNewPassword('')
    }
    setSaving(false)
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">사용자 관리</h2>
        <p className="text-sm text-slate-500">비밀번호 초기화 등 사용자 계정을 관리합니다.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="이름 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-2">
        {filtered.map(user => (
          <Card key={user.id}>
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-800">{user.name}</span>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                    {user.role === 'admin' ? '관리자' : '사용자'}
                  </Badge>
                </div>
                {resettingId !== user.id ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setResettingId(user.id); setNewPassword('') }}
                    className="text-xs gap-1"
                  >
                    <KeyRound className="w-3 h-3" />
                    비밀번호 초기화
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input
                      type="password"
                      placeholder="새 비밀번호"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-36 h-8 text-sm"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => handleReset(user.id, user.name)}
                      disabled={saving}
                      className="text-xs"
                    >
                      {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : '변경'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setResettingId(null); setNewPassword('') }}
                      className="text-xs"
                    >
                      취소
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-8">검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  )
}
