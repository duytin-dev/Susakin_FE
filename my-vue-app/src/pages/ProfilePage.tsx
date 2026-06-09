import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Mail, Save, User } from 'lucide-react'
import { usersApi } from '../api/users'
import { useAuth } from '../context/AuthContext'
import { ApiError } from '../api/client'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

export function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [grade, setGrade] = useState(user?.grade || 3)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const { data: progress = [] } = useQuery({
    queryKey: ['my-progress'],
    queryFn: usersApi.getMyProgress,
  })

  const updateMutation = useMutation({
    mutationFn: () => usersApi.updateMe(name, grade),
    onSuccess: async () => {
      await refreshUser()
      setMessage('Đã cập nhật hồ sơ!')
      setError('')
      setTimeout(() => setMessage(''), 3000)
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : 'Cập nhật thất bại')
    },
  })

  const completed = progress.filter((p) => p.status === 'COMPLETED')

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-black text-brand-800">Hồ sơ của tôi</h2>
        <p className="text-gray-500 font-medium">Quản lý thông tin cá nhân</p>
      </div>

      <Card className="text-center bg-gradient-to-br from-brand-50 to-purple-50">
        <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4 shadow-lg">
          <User className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-black text-brand-800">{user?.name}</h3>
        <p className="text-gray-500 flex items-center justify-center gap-1 mt-1">
          <Mail className="w-4 h-4" />
          {user?.email}
        </p>
        <div className="mt-2">
          <Badge variant="info">Lớp {user?.grade}</Badge>
        </div>
      </Card>

      <Card>
        <h4 className="font-black text-brand-800 mb-4">Chỉnh sửa thông tin</h4>
        <div className="space-y-4">
          <Input
            label="Họ tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Lớp</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    grade === g
                      ? 'bg-brand-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-brand-50'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {message && (
            <div className="p-3 rounded-xl bg-mint-400/10 text-emerald-700 text-sm font-semibold">
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 rounded-xl bg-coral-500/10 text-coral-600 text-sm font-semibold">
              {error}
            </div>
          )}

          <Button
            onClick={() => updateMutation.mutate()}
            loading={updateMutation.isPending}
            className="w-full"
          >
            <Save className="w-4 h-4" />
            Lưu thay đổi
          </Button>
        </div>
      </Card>

      <Card>
        <h4 className="font-black text-brand-800 mb-4">Thống kê học tập</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-2xl bg-brand-50">
            <p className="text-3xl font-black text-brand-700">{completed.length}</p>
            <p className="text-sm text-gray-500 font-semibold">Bài hoàn thành</p>
          </div>
          <div className="text-center p-4 rounded-2xl bg-amber-50">
            <p className="text-3xl font-black text-sunny-500">
              {completed.length > 0
                ? Math.round(
                    completed.reduce((s, p) => s + (p.score ?? 0), 0) / completed.length,
                  )
                : 0}
            </p>
            <p className="text-sm text-gray-500 font-semibold">Điểm trung bình</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
