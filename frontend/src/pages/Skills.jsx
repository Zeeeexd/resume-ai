import { useState, useEffect } from 'react'
import { Target, ChevronDown } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import toast from 'react-hot-toast'
import { analysisAPI } from '../services/api'
import { Spinner } from '../components/LoadingState'
import SkillChip from '../components/SkillChip'

const ROLES = [
  'AI/ML Engineer', 'Software Developer', 'Data Scientist', 'Data Analyst',
  'Web Developer', 'Cybersecurity Analyst', 'Cloud Engineer',
  'DevOps Engineer', 'Backend Developer', 'Frontend Developer',
]

export default function Skills() {
  const [role, setRole] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!role.trim()) { toast.error('Please select a target role'); return }
    setLoading(true)
    try {
      const res = await analysisAPI.skillsGap({ target_role: role, job_description: jobDesc || null })
      setResult(res.data)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const pieData = result ? [
    { name: 'You have', value: 100 - result.skill_gap_percentage, color: '#10b981' },
    { name: 'Gap',      value: result.skill_gap_percentage,        color: '#6366f1' },
  ] : []

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-400" /> Skill Gap Analyzer
          </h1>
          <p className="text-gray-400 mt-1">Find out exactly which skills you're missing for your target role</p>
        </div>

        {/* Config */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Target Role</label>
              <div className="relative">
                <select value={role} onChange={e => setRole(e.target.value)} className="input appearance-none pr-10">
                  <option value="">-- Select a role --</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAnalyze}
                disabled={loading || !role}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? <Spinner size="sm" /> : <Target className="w-4 h-4" />}
                {loading ? 'Analyzing...' : 'Analyze Skill Gap'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job Description <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <textarea
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              rows={3}
              placeholder="Paste job description for more precise results..."
              className="input resize-none"
            />
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="animate-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Pie chart */}
              <div className="card flex flex-col items-center">
                <h3 className="section-title text-center">Skill Coverage</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                      formatter={(v) => [`${v}%`]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-400">{result.skill_gap_percentage}%</p>
                  <p className="text-sm text-gray-400">skill gap</p>
                </div>
              </div>

              {/* Current skills */}
              <div className="card">
                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-3">Current Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {result.current_skills?.length > 0
                    ? result.current_skills.map(s => <SkillChip key={s} label={s} variant="present" />)
                    : <p className="text-sm text-gray-500">No skills data — analyze a resume first to see your current skills.</p>
                  }
                </div>
              </div>

              {/* Missing */}
              <div className="card">
                <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-3">Missing Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missing_skills?.map(s => <SkillChip key={s} label={s} variant="missing" />)}
                </div>
              </div>
            </div>

            {/* Recommended & tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="section-title">Recommended Skills to Learn</h3>
                <div className="flex flex-wrap gap-2">
                  {result.recommended_skills?.map(s => <SkillChip key={s} label={s} variant="recommended" />)}
                </div>
              </div>
              <div className="card">
                <h3 className="section-title">Action Tips</h3>
                {result.tips?.map((t, i) => (
                  <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-800 last:border-0">
                    <span className="mt-1 w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <p className="text-sm text-gray-300">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
