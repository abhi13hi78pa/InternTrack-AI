import React from 'react';
import { Building2, FileQuestion, Users, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

function PrepCompanyInsights({ insights, gapAnalysis }) {
  if (!insights) return null;

  return (
    <div className="space-y-6">
      
      {/* Skill Gap Analysis */}
      {gapAnalysis && (gapAnalysis.missingSkills?.length > 0 || gapAnalysis.recommendations?.length > 0) && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-3xl border border-amber-200 dark:border-amber-800/30 p-6 transition-colors">
          <h3 className="text-lg font-bold text-amber-900 dark:text-amber-500 flex items-center gap-2 mb-4">
            <AlertCircle size={20} /> Skill Gap Analysis
          </h3>
          
          {gapAnalysis.missingSkills?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-2">Missing Skills to Focus On:</h4>
              <div className="flex flex-wrap gap-2">
                {gapAnalysis.missingSkills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-md text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {gapAnalysis.recommendations?.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-2">Recommendations:</h4>
              <ul className="space-y-1.5">
                {gapAnalysis.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-amber-900 dark:text-amber-200 flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span> {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Company Insights */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
          <Building2 className="text-indigo-500" size={20} /> Company Insights
        </h3>

        <div className="space-y-6">
          {insights.overview && (
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Overview</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{insights.overview}</p>
            </div>
          )}

          {insights.hiringProcess && (
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <Users size={16} className="text-gray-400" /> Hiring Process
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{insights.hiringProcess}</p>
            </div>
          )}

          {insights.interviewRounds?.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-gray-400" /> Expected Rounds
              </h4>
              <ul className="space-y-2">
                {insights.interviewRounds.map((round, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2 bg-gray-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-gray-100 dark:border-slate-700/50">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">R{i+1}:</span> {round}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {insights.commonQuestions?.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileQuestion size={16} className="text-gray-400" /> Common Questions
              </h4>
              <ul className="space-y-2">
                {insights.commonQuestions.map((q, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 pl-3 border-l-2 border-indigo-200 dark:border-indigo-800 py-1">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {insights.resumeTips?.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText size={16} className="text-gray-400" /> Resume Tips
              </h4>
              <ul className="space-y-1.5 list-disc pl-4">
                {insights.resumeTips.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PrepCompanyInsights;
