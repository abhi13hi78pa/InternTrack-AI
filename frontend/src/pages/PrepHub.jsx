import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { BrainCircuit, Sparkles, Target, CalendarDays, Loader2, ArrowRight, X } from 'lucide-react';
import PrepCompanyInsights from '../components/PrepCompanyInsights';
import PrepRoadmapTimeline from '../components/PrepRoadmapTimeline';
import PrepStudyMaterials from '../components/PrepStudyMaterials';
import { parseApiResponse } from '../utils/api';

function PrepHub() {
  const { token } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    timeRemaining: '2 weeks',
    skills: ''
  });

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const res = await fetch('/api/ai/roadmaps', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await parseApiResponse(res, 'Failed to load prep roadmaps');
      setRoadmaps(data);
      if (data.length > 0 && !activeRoadmap) {
        setActiveRoadmap(data[0]);
      }
    } catch (err) {
      toast.error('Failed to load prep roadmaps');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const newRoadmap = await parseApiResponse(res, 'Failed to generate roadmap');
      setRoadmaps(prev => [newRoadmap, ...prev]);
      setActiveRoadmap(newRoadmap);
      setShowForm(false);
      setFormData({ company: '', role: '', timeRemaining: '2 weeks', skills: '' });
      toast.success('AI Roadmap Generated Successfully!');
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setGenerating(false);
    }
  };

  const deleteRoadmap = async (id) => {
    if (!window.confirm('Are you sure you want to delete this roadmap?')) return;
    try {
      const res = await fetch(`/api/ai/roadmaps/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await parseApiResponse(res, 'Failed to delete roadmap');
      setRoadmaps(roadmaps.filter(r => r._id !== id));
      if (activeRoadmap?._id === id) {
        setActiveRoadmap(null);
      }
      toast.success('Roadmap deleted');
    } catch (err) {
      toast.error('Failed to delete roadmap');
    }
  };

  const updateTaskStatus = async (taskId, completed) => {
    try {
      const res = await fetch(`/api/ai/roadmaps/${activeRoadmap._id}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed })
      });
      
      const updated = await parseApiResponse(res, 'Failed to update task');
      setActiveRoadmap(updated);
      setRoadmaps(roadmaps.map(r => r._id === updated._id ? updated : r));
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Selector */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-300" /> AI Prep Hub
            </h1>
            <p className="text-indigo-100 mt-1">Your personalized, AI-powered interview preparation ecosystem.</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-white text-indigo-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-50 transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
          >
            <BrainCircuit className="w-5 h-5" /> Generate New Plan
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm transition-colors relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X size={20}/></button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            Configure Your Target
          </h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Company</label>
                <input required type="text" placeholder="e.g. Google, Amazon, TCS" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Role</label>
                <input required type="text" placeholder="e.g. SDE Intern, Data Scientist" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Remaining</label>
                <select value={formData.timeRemaining} onChange={e => setFormData({...formData, timeRemaining: e.target.value})} className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white">
                  <option>1 week</option>
                  <option>2 weeks</option>
                  <option>1 month</option>
                  <option>3 months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Current Skills (Optional)</label>
                <input type="text" placeholder="e.g. React, Node, basic DSA" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white" />
              </div>
            </div>
            <button disabled={generating} type="submit" className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 disabled:opacity-70 flex items-center justify-center gap-2">
              {generating ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Company Data...</> : <><Sparkles className="w-5 h-5" /> Generate AI Roadmap</>}
            </button>
          </form>
        </div>
      )}

      {roadmaps.length > 0 && !showForm && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {roadmaps.map(rm => (
            <button 
              key={rm._id} 
              onClick={() => setActiveRoadmap(rm)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${activeRoadmap?._id === rm._id ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
            >
              <Target size={16} /> {rm.company} - {rm.role}
            </button>
          ))}
        </div>
      )}

      {!activeRoadmap && !showForm && !loading && (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800">
          <BrainCircuit className="w-16 h-16 text-indigo-200 dark:text-indigo-900 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Prep Plans Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">Generate an AI roadmap tailored to your target company and get a complete preparation strategy.</p>
          <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 inline-flex items-center gap-2">
            Get Started <ArrowRight size={18} />
          </button>
        </div>
      )}

      {activeRoadmap && !showForm && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm transition-colors flex items-center justify-between">
               <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Target className="text-indigo-500" /> {activeRoadmap.company}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">{activeRoadmap.role} • {activeRoadmap.timeRemaining} Prep Plan</p>
               </div>
               <div className="text-right">
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{activeRoadmap.overallReadiness}%</div>
                  <div className="text-xs text-gray-500 uppercase font-semibold mt-1 tracking-wider">Readiness</div>
               </div>
            </div>

            <PrepRoadmapTimeline tasks={activeRoadmap.tasks} onUpdateTask={updateTaskStatus} />
            <PrepStudyMaterials materials={activeRoadmap.studyMaterials} />
          </div>
          
          <div className="space-y-6">
            <PrepCompanyInsights insights={activeRoadmap.companyInsights} gapAnalysis={activeRoadmap.skillGapAnalysis} />
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-red-200 dark:border-red-900/30 p-6 shadow-sm transition-colors text-center">
              <button onClick={() => deleteRoadmap(activeRoadmap._id)} className="text-red-600 dark:text-red-400 hover:text-red-700 text-sm font-medium">
                Delete this Roadmap
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default PrepHub;
