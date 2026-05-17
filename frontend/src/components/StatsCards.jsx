import { Briefcase, Send, MessageSquare, CheckCircle, XCircle } from 'lucide-react'

function StatsCards({ stats }) {
  const defaultStats = [
    { label: 'Total', value: 0, icon: Briefcase, color: 'bg-blue-50 text-blue-600' },
    { label: 'Applied', value: 0, icon: Send, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Interview', value: 0, icon: MessageSquare, color: 'bg-amber-50 text-amber-600' },
    { label: 'Offer', value: 0, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Rejected', value: 0, icon: XCircle, color: 'bg-red-50 text-red-600' },
  ]
  const cards = stats && stats.length ? stats : defaultStats

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards