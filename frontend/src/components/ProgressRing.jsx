export default function ProgressRing({ score, size = 120, strokeWidth = 10, label = '' }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#1f2937" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center" style={{ marginTop: -(size / 2 + 16) }}>
        {/* Score is rendered via the parent */}
      </div>
      {label && <span className="text-xs text-gray-400 font-medium">{label}</span>}
    </div>
  )
}
