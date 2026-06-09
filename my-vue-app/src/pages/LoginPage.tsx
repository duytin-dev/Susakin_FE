import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, Sparkles } from 'lucide-react'
import { ApiError } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const [email, setEmail] = useState('demo@example.com')
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to={from} replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen min-h-[100dvh] gradient-bg flex items-center justify-center p-3 sm:p-4 relative overflow-hidden pt-safe pb-safe">
      <div className="hidden sm:block absolute top-10 left-10 text-6xl animate-float opacity-30 pointer-events-none">📚</div>
      <div className="hidden sm:block absolute bottom-20 right-10 text-5xl animate-float opacity-30 pointer-events-none" style={{ animationDelay: '1s' }}>⭐</div>
      <div className="hidden md:block absolute top-1/3 right-1/4 text-4xl animate-float opacity-20 pointer-events-none" style={{ animationDelay: '0.5s' }}>🎨</div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/20 backdrop-blur mb-4 shadow-xl">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Susakin</h1>
          <p className="text-white/80 font-medium">Học tiếng Anh thật vui!</p>
        </div>

        <Card padding="lg" className="shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-brand-600" />
            <h2 className="text-xl font-black text-brand-800">Đăng nhập</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
            <Input
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
            />

            {error && (
              <div className="p-3 rounded-xl bg-coral-500/10 text-coral-600 text-sm font-semibold">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" loading={loading} className="w-full">
              Bắt đầu học ngay!
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-brand-600 font-bold hover:underline">
              Đăng ký miễn phí
            </Link>
          </p>

          <div className="mt-4 p-3 rounded-xl bg-brand-50 text-xs text-brand-600 text-center">
            Demo: demo@example.com / 123456
          </div>
        </Card>
      </div>
    </div>
  )
}
