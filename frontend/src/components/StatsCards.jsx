import { Briefcase, Send, MessageSquare, CheckCircle, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

function StatsCards({ stats, onCardClick, activeStatus }) {
  const defaultStats = [
    { label: 'Total', value: 0, icon: Briefcase, color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', activeBorder: 'border-b-blue-500' },
    { label: 'Applied', value: 0, icon: Send, color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400', activeBorder: 'border-b-indigo-500' },
    { label: 'Interview', value: 0, icon: MessageSquare, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400', activeBorder: 'border-b-amber-500' },
    { label: 'Offer', value: 0, icon: CheckCircle, color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', activeBorder: 'border-b-emerald-500' },
    { label: 'Rejected', value: 0, icon: XCircle, color: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400', activeBorder: 'border-b-red-500' },
  ]
  const cards = stats && stats.length ? stats : defaultStats

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((stat) => {
        const isActive = activeStatus && activeStatus === stat.label;
        return (
          <motion.div 
            key={stat.label} 
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onCardClick && onCardClick(stat.label)}
            className={`
              bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 transition-all
              border border-gray-200 dark:border-slate-800
              ${onCardClick ? 'cursor-pointer hover:shadow-md' : ''}
              ${isActive 
                ? `border-b-4 ${stat.activeBorder} shadow-sm dark:bg-slate-800/50` 
                : ''
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs sm:text-sm font-medium transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1 transition-colors">{stat.value}</p>
              </div>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default StatsCards