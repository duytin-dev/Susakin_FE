import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Sparkles, UserPlus } from 'lucide-react'
import { ApiError } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'

export function RegisterPage() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [grade, setGrade] = useState(3)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register({ name, email, password, grade })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">Tạo tài khoản</h1>
        </div>

        <Card padding="lg">
          <div className="flex items-center gap-2 mb-6">
            <UserPlus className="w-5 h-5 text-brand-600" />
            <h2 className="text-xl font-black text-brand-800">Đăng ký</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Họ tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
              required
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
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

            {error && (
              <div className="p-3 rounded-xl bg-coral-500/10 text-coral-600 text-sm font-semibold">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" loading={loading} className="w-full">
              Đăng ký
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-brand-600 font-bold hover:underline">
              Đăng nhập
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
