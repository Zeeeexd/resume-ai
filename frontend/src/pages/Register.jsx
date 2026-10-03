import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Brain, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { authAPI } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { Spinner } from '../components/LoadingState'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm_password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm_password) e.confirm_password = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await authAPI.register(form)
      login(res.data.access_token, res.data.user)
      toast.success('Account created! Welcome to ResumeAI.')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const F = ({ field, label, type = 'text', icon: Icon, placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type={field === 'password' || field === 'confirm_password' ? (showPwd ? 'text' : 'password') : type}
          value={form[field]}
          onChange={e => setForm({ ...form, [field]: e.target.value })}
          placeholder={placeholder}
          className={`input pl-10 ${errors[field] ? 'border-red-500' : ''}`}
        />
        {(field === 'password') && (
          <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-950 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-3">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-gray-400 text-sm mt-1">Start analyzing your resume for free</p>
        </div>

        <form onSubmit={handleSubmit} className="card flex flex-col gap-5">
          <F field="name" label="Full Name" icon={User} placeholder="John Doe" />
          <F field="email" label="Email" type="email" icon={Mail} placeholder="you@example.com" />
          <F field="password" label="Password" icon={Lock} placeholder="••••••••" />
          <F field="confirm_password" label="Confirm Password" icon={Lock} placeholder="••••••••" />

          <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 mt-1">
            {loading ? <Spinner size="sm" /> : null}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
