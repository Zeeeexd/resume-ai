import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, Clock, PenLine, Target, TrendingUp, Brain, ArrowRight, FileText } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { userAPI, analysisAPI } from '../services/api'
import { SkeletonCard } from '../components/LoadingState'
import ScoreCard from '../components/ScoreCard'
import toast from 'react-hot-toast'

const quickActions = [
  { to: '/analyze', icon: Upload, label: 'Analyze Resume', desc: 'Upload & analyze a new resume', color: 'indigo' },
  { to: '/rewrite', icon: PenLine, label: 'Rewrite Bullet', desc: 'Improve a weak bullet point', color: 'purple' },
  { to: '/skills', icon: Target, label: 'Skill Gap', desc: 'Find missing skills for your role', color: 'emerald' },
  { to: '/history', icon: Clock, label: 'View History', desc: 'Browse past analyses', color: 'amber' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([userAPI.profile(), analysisAPI.history()])
      .then(([profileRes, historyRes]) => {
        setStats(profileRes.data.stats)
        setRecent(historyRes.data.slice(0, 5))
      })
      .catch(() => toast.error('Could not load dashboard data'))
      .finally(() => setLoading(false))
  }, [])

  const scoreColor = (s) => s >= 75 ? 'text-emerald-400' : s >= 50 ? 'text-amber-400' : 'text-red-400'

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 mt-1">Here's an overview of your resume analyses</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {loading ? (
            [1, 2, 3].map(i => <SkeletonCard key={i} />)
          ) : (
            <>
              <div className="card text-center">
                <p className="text-sm text-gray-400 mb-1">Total Analyses</p>
                <p className="text-3xl font-bold text-white">{stats?.total_analyses ?? 0}</p>
              </div>
              <div className="card text-center">
                <p className="text-sm text-gray-400 mb-1">Avg Resume Score</p>
                <p className={`text-3xl font-bold ${scoreColor(stats?.avg_overall_score ?? 0)}`}>
                  {stats?.avg_overall_score ?? 0}<span className="text-lg text-gray-500">/100</span>
                </p>
              </div>
              <div className="card text-center">
                <p className="text-sm text-gray-400 mb-1">Avg ATS Score</p>
                <p className={`text-3xl font-bold ${scoreColor(stats?.avg_ats_score ?? 0)}`}>
                  {stats?.avg_ats_score ?? 0}<span className="text-lg text-gray-500">/100</span>
                </p>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick actions */}
          <div className="lg:col-span-1">
            <h2 className="section-title">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              {quickActions.map(({ to, icon: Icon, label, desc }) => (
                <Link key={to} to={to} className="card hover:border-indigo-500/30 transition-colors flex items-center gap-4 group p-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/15 flex items-center justify-center shrink-0 group-hover:bg-indigo-600/25 transition-colors">
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="text-xs text-gray-500 truncate">{desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors ml-auto shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent analyses */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title mb-0">Recent Analyses</h2>
              <Link to="/history" className="text-sm text-indigo-400 hover:text-indigo-300">View all</Link>
            </div>

            {loading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : recent.length === 0 ? (
              <div className="card flex flex-col items-center py-12 text-center">
                <Brain className="w-12 h-12 text-gray-700 mb-3" />
                <p className="text-gray-400 font-medium mb-2">No analyses yet</p>
                <p className="text-gray-600 text-sm mb-6">Upload your resume to get started</p>
                <Link to="/analyze" className="btn-primary text-sm py-2 px-5">Analyze My Resume</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recent.map(a => (
                  <Link key={a.id} to={`/analysis/${a.id}`} className="card hover:border-indigo-500/30 transition-colors p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white truncate">{a.resume_filename}</p>
                      <p className="text-xs text-gray-500">{a.target_role} · {new Date(a.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-3 shrink-0 text-center">
                      <div>
                        <p className={`text-lg font-bold ${scoreColor(a.overall_score)}`}>{a.overall_score}</p>
                        <p className="text-xs text-gray-600">Score</p>
                      </div>
                      <div>
                        <p className={`text-lg font-bold ${scoreColor(a.ats_score)}`}>{a.ats_score}</p>
                        <p className="text-xs text-gray-600">ATS</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
