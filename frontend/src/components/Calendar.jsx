import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, Briefcase, Send, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

function Calendar({ applications = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('All');

  // Month and Day helpers
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate grid days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);

  const days = [];

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true
    });
  }

  // Next month leading days (fill to complete weeks, usually 42 cells total for 6 rows)
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false
    });
  }

  // Group applications by date string
  const applicationsByDate = useMemo(() => {
    const grouped = {};
    applications.forEach((app) => {
      if (statusFilter !== 'All' && app.status !== statusFilter) return;
      
      const appDate = new Date(app.date);
      // Create a local date string key 'YYYY-MM-DD'
      const dateKey = `${appDate.getFullYear()}-${String(appDate.getMonth() + 1).padStart(2, '0')}-${String(appDate.getDate()).padStart(2, '0')}`;
      
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(app);
    });
    return grouped;
  }, [applications, statusFilter]);

  // Navigation
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Styling helpers
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Applied': return { cellBg: 'bg-blue-50/50 dark:bg-blue-900/20', bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', icon: Send };
      case 'Interview': return { cellBg: 'bg-amber-50/50 dark:bg-amber-900/20', bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', icon: MessageSquare };
      case 'Offer': return { cellBg: 'bg-emerald-50/50 dark:bg-emerald-900/20', bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', icon: CheckCircle };
      case 'Rejected': return { cellBg: 'bg-red-50/50 dark:bg-red-900/20', bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800', icon: XCircle };
      default: return { cellBg: 'bg-gray-50/50 dark:bg-slate-800/30', bg: 'bg-gray-100 dark:bg-slate-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-slate-700', icon: Briefcase };
    }
  };

  const today = new Date();

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[600px] bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors relative">
      
      {/* SaaS Toolbar Header */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-slate-900/50 transition-colors">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
              {monthNames[month]} {year}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track your application deadlines</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="relative flex items-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-1.5 transition-colors shadow-sm">
            <Filter size={14} className="text-gray-400 mr-2" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none appearance-none pr-4 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 hidden sm:block"></div>

          <button 
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            Today
          </button>
          <div className="flex border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-sm transition-colors">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400 transition-colors border-r border-gray-200 dark:border-slate-700"
              title="Previous Month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400 transition-colors"
              title="Next Month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-slate-900 transition-colors">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
          {dayNames.map((day) => (
            <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="flex-1 grid grid-cols-7 grid-rows-6 auto-rows-fr bg-gray-200 dark:bg-slate-800 gap-px">
          {days.map((dayObj, idx) => {
            const dateStr = `${dayObj.date.getFullYear()}-${String(dayObj.date.getMonth() + 1).padStart(2, '0')}-${String(dayObj.date.getDate()).padStart(2, '0')}`;
            const dayApps = applicationsByDate[dateStr] || [];
            
            const isToday = dayObj.date.toDateString() === today.toDateString();
            const isCurrentMonth = dayObj.isCurrentMonth;

            let cellClasses = 'bg-white dark:bg-slate-900';
            if (!isCurrentMonth) {
              cellClasses = 'bg-gray-50/50 dark:bg-slate-900/50 opacity-70';
            } else if (dayApps.length > 0) {
              // Priority sorting to color cell by the most "important" status if multiple exist
              const statusPriority = { 'Offer': 4, 'Interview': 3, 'Applied': 2, 'Rejected': 1, 'All': 0 };
              const highestPriorityApp = [...dayApps].sort((a, b) => statusPriority[b.status] - statusPriority[a.status])[0];
              cellClasses = getStatusConfig(highestPriorityApp.status).cellBg;
            }

            return (
              <div
                key={idx}
                className={`flex flex-col relative p-2 hover:brightness-95 dark:hover:brightness-110 transition-all overflow-hidden group ${cellClasses}`}
              >
                {/* Date Number Header */}
                <div className="flex items-center justify-between mb-1">
                  <span className={`
                    w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium transition-colors z-10
                    ${isToday ? 'bg-indigo-600 text-white shadow-md' : ''}
                    ${!isToday && isCurrentMonth ? 'text-gray-900 dark:text-gray-200' : ''}
                    ${!isToday && !isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : ''}
                  `}>
                    {dayObj.date.getDate()}
                  </span>
                </div>

                {/* Events/Applications */}
                <div className="flex-1 overflow-y-auto space-y-1.5 hide-scrollbar">
                  {dayApps.map((app) => {
                    const config = getStatusConfig(app.status);
                    const StatusIcon = config.icon;
                    return (
                      <div
                        key={app._id}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-medium cursor-pointer hover:shadow-sm transition-all ${config.bg} ${config.text} ${config.border}`}
                        title={`${app.company} - ${app.role} (${app.status})`}
                      >
                        <StatusIcon size={12} className="shrink-0 opacity-70" />
                        <span className="truncate">{app.company}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
