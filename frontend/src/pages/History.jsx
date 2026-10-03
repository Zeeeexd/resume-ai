import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Trash2, ExternalLink, Brain } from 'lucide-react'
import toast from 'react-hot-toast'
import { analysisAPI } from '../services/api'
import { PageLoader } from '../components/LoadingState'

export default function History() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    analysisAPI.history()
      .then(res => setAnalyses(res.data))
      .catch(() => toast.error('Could not load history'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this analysis? This cannot be undone.')) return
    setDeleting(id)
    try {
      await analysisAPI.delete(id)
      setAnalyses(prev => prev.filter(a => a.id !== id))
      toast.success('Analysis deleted')
    } catch { toast.error('Delete failed') }
    finally { setDeleting(null) }
  }

  const scoreColor = (s) => s >= 75 ? 'text-emerald-400' : s >= 50 ? 'text-amber-400' : 'text-red-400'
  const scoreBg = (s) => s >= 75 ? 'bg-emerald-500/10' : s >= 50 ? 'bg-amber-500/10' : 'bg-red-500/10'

  if (loading) return <PageLoader message="Loading history..." />

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Analysis History</h1>
            <p className="text-gray-400 mt-1">{analyses.length} {analyses.length === 1 ? 'analysis' : 'analyses'} saved</p>
          </div>
          <Link to="/analyze" className="btn-primary text-sm py-2 px-4">+ New Analysis</Link>
        </div>

        {analyses.length === 0 ? (
          <div className="card flex flex-col items-center py-16 text-center">
            <Brain className="w-14 h-14 text-gray-700 mb-4" />
            <p className="text-white font-semibold mb-2">No analyses yet</p>
            <p className="text-gray-500 text-sm mb-6">Upload your resume to get your first AI analysis</p>
            <Link to="/analyze" className="btn-primary text-sm py-2 px-5">Analyze My Resume</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-12 gap-3 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-4">Resume</div>
              <div className="col-span-3">Role</div>
              <div className="col-span-1 text-center">Score</div>
              <div className="col-span-1 text-center">ATS</div>
              <div className="col-span-1 text-center">Skill</div>
              <div className="col-span-2 text-right">Date</div>
            </div>

            {analyses.map(a => (
              <div key={a.id} className="card p-4 hover:border-indigo-500/30 transition-colors">
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-3 items-start sm:items-center">
                  {/* Name */}
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="text-sm font-medium text-white truncate">{a.resume_filename}</span>
                  </div>

                  {/* Role */}
                  <div className="col-span-3">
                    <span className="text-sm text-gray-400">{a.target_role}</span>
                  </div>

                  {/* Scores */}
                  <div className="col-span-1 text-center">
                    <span className={`text-sm font-bold ${scoreColor(a.overall_score)}`}>{a.overall_score}</span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className={`text-sm font-bold ${scoreColor(a.ats_score)}`}>{a.ats_score}</span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className={`text-sm font-bold ${scoreColor(a.skill_match)}`}>{a.skill_match}</span>
                  </div>

                  {/* Date & actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <span className="text-xs text-gray-500 hidden sm:block">
                      {new Date(a.created_at).toLocaleDateString()}
                    </span>
                    <Link to={`/analysis/${a.id}`} className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-indigo-600/10 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(a.id)}
                      disabled={deleting === a.id}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
