export function Tag({ children, color = 'blue', icon: Icon }) {
  const colorMap = {
    blue: 'bg-blue-900/50 text-blue-300 border-blue-700/50',
    green: 'bg-emerald-900/50 text-emerald-300 border-emerald-700/50',
    red: 'bg-rose-900/50 text-rose-300 border-rose-700/50',
    amber: 'bg-amber-900/50 text-amber-300 border-amber-700/50',
    purple: 'bg-purple-900/50 text-purple-300 border-purple-700/50',
    slate: 'bg-slate-800 text-slate-400 border-slate-700',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${colorMap[color] || colorMap.slate}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  )
}
