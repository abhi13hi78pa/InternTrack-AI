import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await register(name, email, password);
    setLoading(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      
      {/* Left Panel: Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative z-10">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-indigo-600 p-2 rounded-xl text-white">
                <Briefcase size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight">InternTrack</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Create an account</h1>
            <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Join thousands of students landing their dream internships.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${darkMode ? 'bg-slate-950 text-gray-500' : 'bg-white text-gray-500'}`}>Register with email</span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                required
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${darkMode ? 'bg-slate-900 border-slate-700 placeholder-gray-500' : 'bg-gray-50 border-gray-200 placeholder-gray-400'}`}
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                required
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${darkMode ? 'bg-slate-900 border-slate-700 placeholder-gray-500' : 'bg-gray-50 border-gray-200 placeholder-gray-400'}`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${darkMode ? 'bg-slate-900 border-slate-700 placeholder-gray-500' : 'bg-gray-50 border-gray-200 placeholder-gray-400'}`}
                placeholder="your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-all shadow-sm shadow-indigo-600/20"
            >
              {loading ? 'Creating...' : 'Create Account'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Already have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Log in</Link>
          </p>
        </div>
      </div>

      {/* Right Panel: Promotional/Visual */}
      <div className="hidden lg:flex flex-1 relative bg-indigo-600 overflow-hidden">
        {/* Background Gradients & Abstract Shapes */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-800"></div>
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] right-[20%] w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-16 text-center">
          <div className="max-w-lg space-y-8 backdrop-blur-sm bg-white/10 p-10 rounded-3xl border border-white/20 shadow-2xl">
            <div className="inline-flex p-3 rounded-2xl bg-white/20 backdrop-blur-md mb-4 shadow-inner">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Start Your Journey.
            </h2>
            <p className="text-lg text-indigo-100 font-medium leading-relaxed">
              Join InternTrack today and unlock the smartest tools to manage applications, prep for interviews, and secure your offer.
            </p>
            <div className="flex items-center justify-center gap-3 pt-4">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-indigo-600" src="https://i.pravatar.cc/100?img=1" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-indigo-600" src="https://i.pravatar.cc/100?img=2" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-indigo-600" src="https://i.pravatar.cc/100?img=3" alt="User" />
              </div>
              <div className="text-sm text-indigo-100 text-left">
                <p className="font-bold">Join 10,000+ students</p>
                <p className="opacity-80">already tracking success</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Register;
