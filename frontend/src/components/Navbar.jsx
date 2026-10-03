import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Brain, LayoutDashboard, Upload, Clock, PenLine, Target, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const navLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analyze', icon: Upload, label: 'Analyze' },
  { to: '/history', icon: Clock, label: 'History' },
  { to: '/rewrite', icon: PenLine, label: 'Rewriter' },
  { to: '/skills', icon: Target, label: 'Skills' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-white">ResumeAI</span>
        </Link>

        {/* Desktop nav */}
        {user && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === to
                    ? 'bg-indigo-600/20 text-indigo-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:block text-sm text-gray-400">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4" /> <span className="hidden sm:block">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm py-2 px-4">Sign in</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">Get started</Link>
            </>
          )}
          {user && (
            <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {open && user && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-3 flex flex-col gap-1">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                location.pathname === to
                  ? 'bg-indigo-600/20 text-indigo-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
