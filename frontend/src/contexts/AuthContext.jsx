import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If token exists, we can optionally fetch user profile or validate it
    // For now, we'll just set user state based on token existence
    if (token) {
      setUser({ token });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data);
      toast.success('Logged in successfully');
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data);
      toast.success('Registered successfully');
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const loginWithGoogle = async (credentialToken) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Google login failed');

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data);
      toast.success('Logged in with Google');
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const loginWithGithub = async (code) => {
    try {
      const res = await fetch('/api/auth/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'GitHub login failed');

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data);
      toast.success('Logged in with GitHub');
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    token,
    login,
    register,
    loginWithGoogle,
    loginWithGithub,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
