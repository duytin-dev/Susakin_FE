import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Home,
  LogOut,
  Sparkles,
  Star,
  User,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', icon: Home, label: 'Trang chủ' },
  { to: '/topics', icon: BookOpen, label: 'Chủ đề' },
  { to: '/word-bank', icon: Star, label: 'Từ vựng' },
  { to: '/profile', icon: User, label: 'Hồ sơ' },
]

export function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-purple-50 to-pink-50">
      <header className="sticky top-0 z-50 glass border-b border-white/30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-brand-800 leading-tight">
                Susakin
              </h1>
              <p className="text-xs text-brand-500 font-medium">
                Học tiếng Anh vui vẻ
              </p>
            </div>
          </NavLink>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold text-sm transition-all ${
                    isActive
                      ? 'bg-white text-brand-700 shadow-md'
                      : 'text-brand-600 hover:bg-white/50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-brand-800">{user?.name}</p>
              <p className="text-xs text-brand-500">Lớp {user?.grade}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-brand-500 hover:bg-white/60 hover:text-coral-500 transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-8">
        <Outlet />
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/30">
        <div className="flex justify-around py-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive ? 'text-brand-700' : 'text-brand-400'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
