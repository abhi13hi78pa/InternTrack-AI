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
import { useTheme } from '../contexts/ThemeContext'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function Dashboard() {
  const { darkMode } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [page, setPage] = useState('Dashboard')
  const [searchTerm, setSearchTerm] = useState('')
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
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Unable to save application')
      }

      const newApplication = await response.json()
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
        const response = await fetch('/api/applications')
        if (!response.ok) {
          throw new Error(`Unable to load applications (${response.status})`)
        }
        const data = await response.json()
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
    const query = searchTerm.trim().toLowerCase()
    if (!query) return true

    return [app.company, app.role, app.status, app.notes]
      .some((field) => String(field || '').toLowerCase().includes(query))
  })

  const statsData = [
    { label: 'Total', value: applications.length, icon: Briefcase, color: 'bg-blue-50 text-blue-600' },
    { label: 'Applied', value: applications.filter((app) => app.status === 'Applied').length, icon: Send, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Interview', value: applications.filter((app) => app.status === 'Interview').length, icon: MessageSquare, color: 'bg-amber-50 text-amber-600' },
    { label: 'Offer', value: applications.filter((app) => app.status === 'Offer').length, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Rejected', value: applications.filter((app) => app.status === 'Rejected').length, icon: XCircle, color: 'bg-red-50 text-red-600' }
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
      default:
        return 'Dashboard'
    }
  }

  const renderPageContent = () => {
    switch (page) {
      case 'Applications':
        return (
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">All Applications</h2>
              <RecentApplications applications={filteredApplications} loading={dataLoading} />
            </div>
          </div>
        )
      case 'Add Application':
        return (
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Application</h2>
            <p className="text-sm text-gray-600 mb-6">
              Enter a new application and save it. The data will be persisted to the backend and displayed in the application list.
            </p>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Company</span>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Company name"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Role</span>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Role"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Date</span>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-gray-700">Notes</span>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics</h2>
              <p className="text-sm text-gray-600 mb-6">
                Explore your application trends and status breakdown here.
              </p>
              <StatusChart segments={chartSegments} />
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Key metrics</h2>
              <StatsCards stats={statsData} />
            </div>
          </div>
        )
      default:
        return (
          <>
            <motion.div variants={itemVariants}>
              <StatsCards stats={statsData} />
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