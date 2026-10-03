export default function ScoreCard({ label, score, icon: Icon, description }) {
  const color = score >= 75 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400'
  const bg = score >= 75 ? 'bg-emerald-500/10' : score >= 50 ? 'bg-amber-500/10' : 'bg-red-500/10'
  const border = score >= 75 ? 'border-emerald-500/20' : score >= 50 ? 'border-amber-500/20' : 'border-red-500/20'

  return (
    <div className={`card border ${border} flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
          )}
          <span className="text-sm font-medium text-gray-400">{label}</span>
        </div>
        <span className={`text-2xl font-bold ${color}`}>{score}</span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            score >= 75 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  )
}
