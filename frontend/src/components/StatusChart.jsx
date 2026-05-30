function StatusChart({ segments = [] }) {
  const total = segments.reduce((sum, d) => sum + d.value, 0)

  const activeSegments = segments.length
    ? segments
    : [
        { label: 'Applied', value: 0, color: '#6366f1' },
        { label: 'Interview', value: 0, color: '#f59e0b' },
        { label: 'Offer', value: 0, color: '#10b981' },
        { label: 'Rejected', value: 0, color: '#ef4444' },
      ]

  // Calculate conic gradient percentages
  let currentDeg = 0
  const gradientStops = activeSegments.map((d) => {
    const deg = total === 0 ? 0 : (d.value / total) * 360
    const stop = `${d.color} ${currentDeg}deg ${currentDeg + deg}deg`
    currentDeg += deg
    return stop
  })

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 transition-colors">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Status Breakdown</h2>

      <div className="flex items-center justify-center mb-6">
        <div
          className="w-40 h-40 rounded-full relative"
          style={{
            background: `conic-gradient(${gradientStops.join(', ')})`
          }}
        >
          <div className="absolute inset-4 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center transition-colors">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {segments.map((d) => (
          <div key={d.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{d.label}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white transition-colors">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatusChart