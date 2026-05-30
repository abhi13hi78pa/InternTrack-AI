import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, ArrowRight, Github } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useGoogleLogin } from '@react-oauth/google';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, loginWithGithub } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  // Google Login Hook
  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      const success = await loginWithGoogle(tokenResponse.access_token);
      setLoading(false);
      if (success) navigate('/');
    },
    onError: () => {
      toast.error('Google login failed');
    }
  });

  // GitHub Login Handler
  const githubLoginHandler = () => {
    // Redirect to GitHub OAuth
    const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || 'dummy-client-id';
    const redirectUri = window.location.origin + '/login';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email`;
  };

  // Handle GitHub Redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      // Clear code from URL
      window.history.replaceState({}, document.title, '/login');
      const authenticateGithub = async () => {
        setLoading(true);
        const success = await loginWithGithub(code);
        setLoading(false);
        if (success) navigate('/');
      };
      authenticateGithub();
    }
  }, [loginWithGithub, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
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
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Welcome back</h1>
            <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Sign in to your account to continue tracking your applications.
            </p>
          </div>

          {/* Social Logins */}
          <div className="space-y-3">
            <button onClick={() => googleLoginHandler()} disabled={loading} type="button" className={`w-full flex items-center justify-center gap-3 px-4 py-2.5 border rounded-xl font-medium transition-colors ${darkMode ? 'bg-slate-900 border-slate-700 hover:bg-slate-800' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
            <button onClick={githubLoginHandler} disabled={loading} type="button" className={`w-full flex items-center justify-center gap-3 px-4 py-2.5 border rounded-xl font-medium transition-colors ${darkMode ? 'bg-slate-900 border-slate-700 hover:bg-slate-800' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${darkMode ? 'bg-slate-950 text-gray-500' : 'bg-white text-gray-500'}`}>Or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                required
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${darkMode ? 'bg-slate-900 border-slate-700 placeholder-gray-500' : 'bg-gray-50 border-gray-200 placeholder-gray-400'}`}
                placeholder="@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium" htmlFor="password">Password</label>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Forgot password?</a>
              </div>
              <input
                id="password"
                type="password"
                required
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${darkMode ? 'bg-slate-900 border-slate-700 placeholder-gray-500' : 'bg-gray-50 border-gray-200 placeholder-gray-400'}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-all shadow-sm shadow-indigo-600/20"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Don't have an account? <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Create one now</Link>
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
              Land Your Dream Internship.
            </h2>
            <p className="text-lg text-indigo-100 font-medium leading-relaxed">
              InternTrack is the smartest way to manage your applications, track deadlines, and generate AI-powered preparation roadmaps. 
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

export default Login;
