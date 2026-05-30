import { useState, useEffect, useRef } from 'react'
import { Search, Bell, Menu, Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const notifications = [
  { id: 1, message: 'New application reminder for today', time: '1m ago' },
  { id: 2, message: 'Interview status updated', time: '2h ago' },
  { id: 3, message: 'New note added to an application', time: '1d ago' },
]

function Navbar({ setSidebarOpen, searchTerm, setSearchTerm }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const menuRef = useRef(null)
  const { darkMode, toggleDarkMode } = useTheme()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6 relative transition-colors duration-300">
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden text-gray-500 hover:text-gray-700"
        aria-label="Open sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex flex-1 items-center justify-center lg:justify-start">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search applications..."
            className="w-full rounded-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4" ref={menuRef}>
        <button
          onClick={toggleDarkMode}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>

        <button
          type="button"
          className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          onClick={() => setShowNotifications((current) => !current)}
          aria-label="Toggle notifications"
        >
          <Bell className="h-6 w-6" />
          <span className="absolute -right-1 -top-1 inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
        </button>

        {showNotifications && (
          <div className="absolute right-6 top-16 z-30 w-72 rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl transition-colors">
            <div className="px-4 py-4 border-b border-gray-100 dark:border-slate-700 text-sm font-semibold text-gray-900 dark:text-white">
              Notifications
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.map((notification) => (
                <div key={notification.id} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer">
                  <div>{notification.message}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">{notification.time}</div>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">No new notifications</div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar