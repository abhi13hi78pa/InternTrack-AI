import React from 'react';
import { BookOpen, PlayCircle, FileText, Link, Database, Code, Globe } from 'lucide-react';

function PrepStudyMaterials({ materials }) {
  if (!materials || materials.length === 0) return null;

  const getIcon = (type) => {
    switch(type) {
      case 'Video': return <PlayCircle size={18} className="text-red-500" />;
      case 'Article': return <FileText size={18} className="text-blue-500" />;
      case 'Platform': return <Code size={18} className="text-emerald-500" />;
      case 'Documentation': return <Database size={18} className="text-amber-500" />;
      case 'Repository': return <Globe size={18} className="text-gray-600 dark:text-gray-400" />;
      default: return <Link size={18} className="text-indigo-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
        <BookOpen className="text-indigo-500" /> Recommended Study Materials
      </h3>

      <div className="grid sm:grid-cols-2 gap-4">
        {materials.map((item, i) => (
          <a
            key={i}
            href={item.url && item.url.startsWith('http') ? item.url : `https://www.google.com/search?q=${encodeURIComponent(item.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:shadow-md transition-all group"
          >
            <div className="mt-0.5 p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700/50 group-hover:scale-110 transition-transform">
              {getIcon(item.type)}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                {item.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {item.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                  {item.type}
                </span>
                {item.category && (
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-500">
                    {item.category}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default PrepStudyMaterials;
