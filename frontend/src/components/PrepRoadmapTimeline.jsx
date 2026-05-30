import React from 'react';
import { CalendarDays, CheckCircle2, Circle } from 'lucide-react';

function PrepRoadmapTimeline({ tasks, onUpdateTask }) {
  if (!tasks || tasks.length === 0) return null;

  // Group tasks by day
  const tasksByDay = tasks.reduce((acc, task) => {
    if (!acc[task.day]) acc[task.day] = [];
    acc[task.day].push(task);
    return acc;
  }, {});

  const getCategoryColor = (category) => {
    switch(category) {
      case 'DSA': return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300';
      case 'System Design': return 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300';
      case 'Behavioral': return 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300';
      case 'Mock Interview': return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300';
      case 'Resume': return 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300';
      default: return 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
        <CalendarDays className="text-indigo-500" /> Actionable Roadmap
      </h3>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
        {Object.keys(tasksByDay).sort((a, b) => Number(a) - Number(b)).map((day) => (
          <div key={day} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold text-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
              D{day}
            </div>

            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-gray-100 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-800/30 shadow-sm transition-colors">
              <div className="space-y-3">
                {tasksByDay[day].map(task => (
                  <div key={task.id} className="flex gap-3">
                    <button 
                      onClick={() => onUpdateTask(task.id, !task.completed)}
                      className="mt-0.5 shrink-0 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {task.completed ? <CheckCircle2 className="text-emerald-500" size={20} /> : <Circle size={20} />}
                    </button>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${getCategoryColor(task.category)}`}>
                          {task.category}
                        </span>
                        <h4 className={`text-sm font-semibold transition-colors ${task.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                          {task.title}
                        </h4>
                      </div>
                      <p className={`text-xs leading-relaxed transition-colors ${task.completed ? 'text-gray-400 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'}`}>
                        {task.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrepRoadmapTimeline;
