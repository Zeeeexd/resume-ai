import { Brain } from 'lucide-react'

export function Spinner({ size = 'md' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size]
  return <div className={`${s} border-2 border-indigo-500 border-t-transparent rounded-full animate-spin`} />
}

export function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-950">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse-glow">
        <Brain className="w-8 h-8 text-white" />
      </div>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  )
}

export function AnalyzingLoader() {
  const steps = [
    'Parsing resume content...',
    'Evaluating section structure...',
    'Matching skills to job requirements...',
    'Calculating ATS compatibility...',
    'Generating improvement plan...',
  ]
  return (
    <div className="flex flex-col items-center gap-6 py-16">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse-glow">
        <Brain className="w-10 h-10 text-white" />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Analyzing your resume...</h3>
        <p className="text-gray-400 text-sm">AI is reading every line. This takes 10–30 seconds.</p>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3" style={{ animationDelay: `${i * 0.6}s` }}>
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
            <span className="text-sm text-gray-400">{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-4 bg-gray-800 rounded w-1/3 mb-4" />
      <div className="h-8 bg-gray-800 rounded w-1/2 mb-3" />
      <div className="h-2 bg-gray-800 rounded w-full" />
    </div>
  )
}
