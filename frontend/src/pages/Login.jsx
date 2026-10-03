import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Brain, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { authAPI } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { Spinner } from '../components/LoadingState'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await authAPI.login(form)
      login(res.data.access_token, res.data.user)
      toast.success(`Welcome back, ${res.data.user.name}!`)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-950">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-3">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Sign in to ResumeAI</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back</p>
        </div>

        {/* Demo hint */}
        <div className="card mb-6 bg-indigo-600/10 border-indigo-500/20">
          <p className="text-xs text-indigo-300">
            <strong>Demo credentials:</strong> demo@resumeai.com / demo1234
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card flex flex-col gap-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className={`input pl-10 ${errors.email ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className={`input pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 mt-1">
            {loading ? <Spinner size="sm" /> : null}
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">Create one</Link>
        </p>
      </div>
    </div>
  )
}
