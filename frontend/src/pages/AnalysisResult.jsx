import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from 'recharts'
import { Download, ArrowLeft, CheckCircle, AlertCircle, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { analysisAPI } from '../services/api'
import { PageLoader } from '../components/LoadingState'
import ScoreCard from '../components/ScoreCard'
import SkillChip from '../components/SkillChip'

const SECTION_COLORS = ['#6366f1','#8b5cf6','#ec4899','#10b981','#f59e0b','#3b82f6','#14b8a6','#f97316']

function PriorityItem({ text, level }) {
  const styles = {
    high:   { dot: 'bg-red-500',   label: 'High',   text: 'text-red-400' },
    medium: { dot: 'bg-amber-500', label: 'Medium', text: 'text-amber-400' },
    low:    { dot: 'bg-emerald-500',label: 'Low',   text: 'text-emerald-400' },
  }[level]
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-800 last:border-0">
      <span className={`mt-1.5 w-2 h-2 rounded-full ${styles.dot} shrink-0`} />
      <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
    </div>
  )
}

export default function AnalysisResult() {
  const { id } = useParams()
  const [analysis, setAnalysis] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    analysisAPI.get(id)
      .then(res => {
        setAnalysis(res.data)
        setData(JSON.parse(res.data.analysis_json))
      })
      .catch(() => toast.error('Could not load analysis'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const res = await analysisAPI.report(id)
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url; a.download = `resume_analysis_${id}.pdf`; a.click()
      URL.revokeObjectURL(url)
      toast.success('Report downloaded!')
    } catch { toast.error('Download failed') }
    finally { setDownloading(false) }
  }

  if (loading) return <PageLoader message="Loading analysis..." />
  if (!data) return <div className="min-h-screen bg-gray-950 pt-24 text-center text-gray-400">Analysis not found.</div>

  const radarData = [
    { subject: 'Skills',     A: data.skill_match },
    { subject: 'Experience', A: data.section_scores?.experience ?? 0 },
    { subject: 'Projects',   A: data.section_scores?.projects ?? 0 },
    { subject: 'ATS',        A: data.ats_score },
    { subject: 'Formatting', A: Math.round((data.section_scores?.contact ?? 50 + data.section_scores?.summary ?? 50) / 2) },
    { subject: 'Education',  A: data.section_scores?.education ?? 0 },
  ]

  const sectionData = Object.entries(data.section_scores || {}).map(([k, v]) => ({
    name: k.charAt(0).toUpperCase() + k.slice(1), score: v,
  }))

  const scoreColor = (s) => s >= 75 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/history" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to History
            </Link>
            <h1 className="text-2xl font-bold text-white">{analysis.resume_filename}</h1>
            <p className="text-gray-400 text-sm mt-1">Target: {analysis.target_role} · {new Date(analysis.created_at).toLocaleDateString()}</p>
          </div>
          <button onClick={handleDownload} disabled={downloading} className="btn-secondary flex items-center gap-2 shrink-0">
            <Download className="w-4 h-4" /> {downloading ? 'Downloading...' : 'Download PDF Report'}
          </button>
        </div>

        {/* Hero score */}
        <div className="card mb-6 flex flex-col items-center py-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 pointer-events-none" />
          <div className="relative w-36 h-36 mb-4">
            <svg className="-rotate-90 w-full h-full">
              <circle cx="50%" cy="50%" r="60" fill="none" stroke="#1f2937" strokeWidth="12" />
              <circle
                cx="50%" cy="50%" r="60" fill="none"
                stroke={scoreColor(data.overall_score)} strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 60}`}
                strokeDashoffset={`${2 * Math.PI * 60 * (1 - data.overall_score / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.5s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-white">{data.overall_score}</span>
              <span className="text-sm text-gray-400">/ 100</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Overall Resume Score</h2>
          <p className="text-gray-400 text-sm max-w-lg text-center">{data.summary?.slice(0, 180)}...</p>
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <ScoreCard label="ATS Compatibility" score={data.ats_score} />
          <ScoreCard label="Skill Match" score={data.skill_match} />
          <ScoreCard label="Overall Score" score={data.overall_score} />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Radar */}
          <div className="card">
            <h3 className="section-title">Resume Radar</h3>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Section scores bar */}
          <div className="card">
            <h3 className="section-title">Section Scores</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={sectionData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                  labelStyle={{ color: '#e5e7eb' }}
                  itemStyle={{ color: '#a5b4fc' }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {sectionData.map((_, i) => <Cell key={i} fill={SECTION_COLORS[i % SECTION_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <h3 className="section-title flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /> Strengths</h3>
            {data.strengths?.map((s, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-800 last:border-0">
                <span className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <p className="text-sm text-gray-300">{s}</p>
              </div>
            ))}
          </div>
          <div className="card">
            <h3 className="section-title flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-400" /> Weaknesses</h3>
            {data.weaknesses?.map((w, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-800 last:border-0">
                <span className="mt-1 w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <p className="text-sm text-gray-300">{w}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="card mb-6">
          <h3 className="section-title">Skills Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-3">Present Skills</p>
              <div className="flex flex-wrap gap-2">
                {data.skills_present?.map(s => <SkillChip key={s} label={s} variant="present" />)}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-3">Missing Skills</p>
              <div className="flex flex-wrap gap-2">
                {data.skills_missing?.map(s => <SkillChip key={s} label={s} variant="missing" />)}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-3">Recommended</p>
              <div className="flex flex-wrap gap-2">
                {data.recommended_skills?.map(s => <SkillChip key={s} label={s} variant="recommended" />)}
              </div>
            </div>
          </div>
        </div>

        {/* Improvement Plan */}
        <div className="card mb-6">
          <h3 className="section-title flex items-center gap-2"><Zap className="w-5 h-5 text-amber-400" /> Improvement Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-3">🔴 High Priority</p>
              {data.high_priority_actions?.map((a, i) => <PriorityItem key={i} text={a} level="high" />)}
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-3">🟡 Medium Priority</p>
              {data.medium_priority_actions?.map((a, i) => <PriorityItem key={i} text={a} level="medium" />)}
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-3">🟢 Low Priority</p>
              {data.low_priority_actions?.map((a, i) => <PriorityItem key={i} text={a} level="low" />)}
            </div>
          </div>
        </div>

        {/* AI Rewrites */}
        {data.rewrites?.length > 0 && (
          <div className="card">
            <h3 className="section-title">AI-Suggested Rewrites</h3>
            <div className="flex flex-col gap-4">
              {data.rewrites.map((r, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-red-500/8 border border-red-500/20">
                    <p className="text-xs font-semibold text-red-400 mb-2">Original</p>
                    <p className="text-sm text-gray-300">{r.original}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
                    <p className="text-xs font-semibold text-emerald-400 mb-2">AI Improved</p>
                    <p className="text-sm text-gray-300">{r.improved}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
