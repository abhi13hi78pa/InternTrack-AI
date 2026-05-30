import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'

const statusStyles = {
  Applied: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  Interview: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50',
  Offer: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50',
  Rejected: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50',
}

function RecentApplications({ applications = [], loading = false }) {
  const [openMenuIndex, setOpenMenuIndex] = useState(null)

  const toggleMenu = (index) => {
    setOpenMenuIndex((current) => (current === index ? null : index))
  }

  const closeMenu = () => {
    setOpenMenuIndex(null)
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 transition-colors">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between transition-colors">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white transition-colors">Recent Applications</h2>
        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View all</button>
      </div>

      {loading ? (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">No applications found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 transition-colors">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
              {applications.map((app, i) => (
                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300 transition-colors">
                        {app.company?.[0] || '?'}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-200 transition-colors">{app.company}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 transition-colors">{app.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 transition-colors">{new Date(app.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[app.status]}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 relative">
                    <button
                      className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                      onClick={() => toggleMenu(i)}
                      aria-expanded={openMenuIndex === i}
                      aria-label="Open actions"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </button>
                    {openMenuIndex === i && (
                      <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg z-20 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => {
                            closeMenu()
                            window.alert(`Status: ${app.status}\nNotes: ${app.notes || 'No notes available'}`)
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          View details
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            closeMenu()
                            navigator.clipboard.writeText(app.company || '')
                            window.alert('Company name copied to clipboard.')
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          Copy company
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default RecentApplications