import { Clock, ChevronRight } from 'lucide-react'

const reminders = [
  { title: 'Google Interview', time: 'Today, 2:00 PM', type: 'interview' },
  { title: 'Follow up with Amazon', time: 'Tomorrow, 10:00 AM', type: 'followup' },
  { title: 'Microsoft OA Deadline', time: 'May 5, 2026', type: 'deadline' },
]

const typeStyles = {
  interview: 'bg-indigo-50 text-indigo-700',
  followup: 'bg-amber-50 text-amber-700',
  deadline: 'bg-red-50 text-red-700',
}

function UpcomingReminders() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Upcoming</h2>
        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">See all</button>
      </div>

      <div className="space-y-3">
        {reminders.map((reminder, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeStyles[reminder.type]}`}>
              <Clock className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{reminder.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{reminder.time}</p>
            </div>

            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0 mt-1" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingReminders