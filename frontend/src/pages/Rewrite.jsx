import { useState } from 'react'
import { PenLine, Copy, RefreshCw, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { analysisAPI } from '../services/api'
import { Spinner } from '../components/LoadingState'

export default function Rewrite() {
  const [bullet, setBullet] = useState('')
  const [context, setContext] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleRewrite = async () => {
    if (!bullet.trim()) { toast.error('Enter a bullet point first'); return }
    setLoading(true)
    try {
      const res = await analysisAPI.rewrite({ bullet_point: bullet, context: context || null })
      setResult(res.data)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Rewrite failed')
    } finally {
      setLoading(false)
    }
  }

  const copyImproved = () => {
    if (!result?.improved) return
    navigator.clipboard.writeText(result.improved)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <PenLine className="w-6 h-6 text-indigo-400" /> Bullet Point Rewriter
          </h1>
          <p className="text-gray-400 mt-1">Paste a weak resume bullet and AI will rewrite it into a powerful, ATS-friendly statement</p>
        </div>

        {/* Info banner */}
        <div className="card bg-amber-500/8 border-amber-500/20 mb-6">
          <p className="text-sm text-amber-300">
            ⚠️ The AI will not fabricate metrics or achievements. If your original bullet has no numbers,
            the improved version will be stronger in language only — you should add real numbers yourself.
          </p>
        </div>

        <div className="card mb-5">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Original Bullet Point</label>
            <textarea
              value={bullet}
              onChange={e => setBullet(e.target.value)}
              rows={4}
              placeholder="e.g. Worked on machine learning project using Python"
              className="input resize-none"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Context <span className="text-gray-500 font-normal">(optional — e.g. "AI/ML Engineer role")</span>
            </label>
            <input
              type="text"
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="e.g. Applying for Data Scientist position at a fintech company"
              className="input"
            />
          </div>

          <button
            onClick={handleRewrite}
            disabled={loading || !bullet.trim()}
            className="btn-primary flex items-center justify-center gap-2 w-full"
          >
            {loading ? <Spinner size="sm" /> : <PenLine className="w-4 h-4" />}
            {loading ? 'Rewriting...' : '✨ Rewrite with AI'}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="animate-fade-in-up flex flex-col gap-4">
            <div className="card border-red-500/20">
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-3">Original</p>
              <p className="text-gray-300 leading-relaxed">{result.original}</p>
            </div>

            <div className="card border-emerald-500/20">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">AI Improved Version</p>
                <div className="flex gap-2">
                  <button
                    onClick={copyImproved}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={handleRewrite}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                  </button>
                </div>
              </div>
              <p className="text-gray-100 leading-relaxed font-medium">{result.improved}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
