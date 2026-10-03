export default function SkillChip({ label, variant = 'present' }) {
  const styles = {
    present: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    missing: 'bg-red-500/15 text-red-400 border border-red-500/30',
    recommended: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
    neutral: 'bg-gray-700/50 text-gray-300 border border-gray-600',
  }
  return (
    <span className={`skill-chip ${styles[variant] || styles.neutral}`}>
      {label}
    </span>
  )
}
