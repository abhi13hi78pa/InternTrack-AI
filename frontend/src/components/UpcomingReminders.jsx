import { Clock, ChevronRight } from 'lucide-react'

const reminders = [
  { title: 'Google Interview', time: 'Today, 2:00 PM', type: 'interview' },
  { title: 'Follow up with Amazon', time: 'Tomorrow, 10:00 AM', type: 'followup' },
  { title: 'Microsoft OA Deadline', time: 'May 5, 2026', type: 'deadline' },
]

const typeStyles = {
  interview: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
  followup: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  deadline: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400',
}

function UpcomingReminders() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white transition-colors">Upcoming</h2>
        <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">See all</button>
      </div>

      <div className="space-y-3">
        {reminders.map((reminder, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${typeStyles[reminder.type]}`}>
              <Clock className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate transition-colors">{reminder.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 transition-colors">{reminder.time}</p>
            </div>

            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors shrink-0 mt-1" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingReminders