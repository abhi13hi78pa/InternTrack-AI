import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, Send, MessageSquare, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import StatsCards from '../components/StatsCards'
import RecentApplications from '../components/RecentApplications'
import StatusChart from '../components/StatusChart'
import UpcomingReminders from '../components/UpcomingReminders'
import Calendar from '../components/Calendar'
import PrepHub from './PrepHub'
import { useTheme } from '../contexts/ThemeContext'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useAuth } from '../contexts/AuthContext'
import { apiFetch, parseApiResponse } from '../utils/api'

function Dashboard() {
  const { darkMode } = useTheme()
  const { token, logout, user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [page, setPage] = useState('Dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Total')
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    date: '',
    status: 'Applied',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      const response = await apiFetch('/api/applications', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.status === 401) {
        logout()
        return
      }

      const newApplication = await parseApiResponse(response, 'Unable to save application')
      setApplications((prev) => [newApplication, ...prev])
      setPage('Applications')
      setFormData({ company: '', role: '', date: '', status: 'Applied', notes: '' })
      toast.success('Application saved successfully')
    } catch (err) {
      toast.error(err.message || 'Could not save application')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    // Simulate UI loading
    const timer = setTimeout(() => setLoading(false), 1500)

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await apiFetch('/api/applications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.status === 401) {
          logout()
          return
        }
        const data = await parseApiResponse(response, 'Unable to load applications')
        setApplications(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setDataLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const filteredApplications = applications.filter((app) => {
    // Filter by search term
    const query = searchTerm.trim().toLowerCase()
    const matchesSearch = query === '' || [app.company, app.role, app.status, app.notes]
      .some((field) => String(field || '').toLowerCase().includes(query))
      
    // Filter by status (unless 'Total' is selected)
    const matchesStatus = statusFilter === 'Total' || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const statsData = [
    { label: 'Total', value: applications.length, icon: Briefcase, color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', activeBorder: 'border-b-blue-500' },
    { label: 'Applied', value: applications.filter((app) => app.status === 'Applied').length, icon: Send, color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400', activeBorder: 'border-b-indigo-500' },
    { label: 'Interview', value: applications.filter((app) => app.status === 'Interview').length, icon: MessageSquare, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400', activeBorder: 'border-b-amber-500' },
    { label: 'Offer', value: applications.filter((app) => app.status === 'Offer').length, icon: CheckCircle, color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', activeBorder: 'border-b-emerald-500' },
    { label: 'Rejected', value: applications.filter((app) => app.status === 'Rejected').length, icon: XCircle, color: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400', activeBorder: 'border-b-red-500' }
  ]


  const chartSegments = [
    { label: 'Applied', value: statsData[1].value, color: '#6366f1' },
    { label: 'Interview', value: statsData[2].value, color: '#f59e0b' },
    { label: 'Offer', value: statsData[3].value, color: '#10b981' },
    { label: 'Rejected', value: statsData[4].value, color: '#ef4444' }
  ]

  const renderPageHeader = () => {
    switch (page) {
      case 'Applications':
        return 'Applications'
      case 'Add Application':
        return 'Add Application'
      case 'Calendar':
        return 'Calendar'
      case 'Analytics':
        return 'Analytics'
      case 'AI Prep Hub':
        return 'AI Prep Hub'
      default:
        return 'Dashboard'
    }
  }

  const renderPageContent = () => {
    switch (page) {
      case 'Applications':
        return (
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors">All Applications</h2>
              <RecentApplications applications={filteredApplications} loading={dataLoading} />
            </div>
          </div>
        )
      case 'Add Application':
        return (
          <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Add New Application</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 transition-colors">
              Enter a new application and save it. The data will be persisted to the backend and displayed in the application list.
            </p>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Company</span>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
                  placeholder="Company name"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</span>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
                  placeholder="Role"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</span>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</span>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
                  placeholder="Add any notes or interview details"
                />
              </label>
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : 'Save application'}
                </button>
              </div>
            </form>
          </div>
        )
      case 'Calendar':
        return (
          <div className="space-y-6">
            <Calendar applications={applications} />
          </div>
        )
      case 'Analytics':
        return (
          <div className="space-y-6">
            {/* Top row: Metrics */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Performance Overview</h2>
              <StatsCards stats={statsData} />
            </div>

            {/* Bottom row: Charts & Insights */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Status Breakdown */}
              <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Status Breakdown</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Distribution of your applications across stages.</p>
                <div className="flex-1 flex items-center justify-center">
                  <StatusChart segments={chartSegments} />
                </div>
              </div>

              {/* Conversion Funnel */}
              <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Conversion Funnel</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">How effectively you're moving through the pipeline.</p>
                
                <div className="flex-1 space-y-6">
                  {[
                    { label: 'Total Applications', value: statsData[0].value, color: 'bg-blue-500' },
                    { label: 'Interviews Secured', value: statsData[2].value, color: 'bg-amber-500' },
                    { label: 'Offers Received', value: statsData[3].value, color: 'bg-emerald-500' }
                  ].map((stage, i, arr) => {
                    const percentage = arr[0].value === 0 ? 0 : Math.round((stage.value / arr[0].value) * 100);
                    return (
                      <div key={stage.label} className="relative">
                        <div className="flex justify-between text-sm font-medium mb-2">
                          <span className="text-gray-700 dark:text-gray-300">{stage.label}</span>
                          <span className="text-gray-900 dark:text-white font-bold">{stage.value} <span className="text-gray-400 dark:text-gray-500 text-xs font-normal ml-1">({percentage}%)</span></span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`h-full rounded-full ${stage.color}`}
                          />
                        </div>
                      </div>
                    )
                  })}

                  <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
                    <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-2">
                      <span className="text-lg">💡</span> Pro Tip
                    </h4>
                    <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed">
                      If your Interview-to-Offer rate is low, try generating a new preparation plan in the AI Prep Hub focusing on Mock Interviews.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'AI Prep Hub':
        return (
          <PrepHub />
        )
      default:
        return (
          <>
            <motion.div variants={itemVariants}>
              <StatsCards 
                stats={statsData} 
                onCardClick={setStatusFilter} 
                activeStatus={statusFilter} 
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8"
            >
              <motion.div
                variants={itemVariants}
                className="lg:col-span-2 order-2 lg:order-1"
              >
                <RecentApplications applications={filteredApplications} loading={dataLoading} />
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="space-y-4 md:space-y-6 order-1 lg:order-2"
              >
                <StatusChart segments={chartSegments} />
                <UpcomingReminders />
              </motion.div>
            </motion.div>
          </>
        )
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  }

  if (loading || dataLoading) {
    return (
      <div className={`flex h-screen ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="flex-1 flex flex-col">
          <div className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 flex items-center px-6">
            <Skeleton width={200} height={24} />
            <div className="ml-auto flex gap-2">
              <Skeleton width={40} height={40} circle />
              <Skeleton width={40} height={40} circle />
              <Skeleton width={40} height={40} circle />
            </div>
          </div>

          <div className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <Skeleton width={150} height={32} />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {Array(5).fill().map((_, i) => (
                  <Skeleton key={i} height={120} className="rounded-2xl" />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Skeleton height={400} className="rounded-2xl" />
                </div>
                <div className="space-y-6">
                  <Skeleton height={300} className="rounded-2xl" />
                  <Skeleton height={250} className="rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex h-screen transition-colors duration-300 ${
      darkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePage={page}
        onMenuSelect={setPage}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          setSidebarOpen={setSidebarOpen}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 overflow-y-auto p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <motion.h1
              variants={itemVariants}
              className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {renderPageHeader()}
            </motion.h1>

            {error && (
              <motion.div variants={itemVariants} className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              {renderPageContent()}
            </motion.div>
          </div>
        </motion.main>

        {/* Mobile Bottom Navigation */}
        <AnimatePresence>
          {isMobile && (
            <motion.nav
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className={`
                fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t p-4
                ${darkMode
                  ? 'bg-slate-800/90 border-slate-700/50'
                  : 'bg-white/90 border-gray-200/50'
                }
              `}
            >
              <div className="flex items-center justify-around">
                {[
                  { icon: '📊', label: 'Dashboard' },
                  { icon: '📄', label: 'Applications' },
                  { icon: '➕', label: 'Add Application' },
                  { icon: '📅', label: 'Calendar' },
                  { icon: '📈', label: 'Analytics' },
                  { icon: '✨', label: 'AI Prep Hub' },
                ].map((item) => {
                  const isActive = page === item.label
                  return (
                    <motion.button
                      key={item.label}
                      onClick={() => setPage(item.label)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        flex flex-col items-center gap-1 p-2 rounded-xl transition-colors
                        ${isActive
                          ? darkMode
                            ? 'text-indigo-400 bg-slate-700'
                            : 'text-indigo-600 bg-indigo-50'
                          : darkMode
                            ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-xs font-medium">{item.label}</span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Dashboard
