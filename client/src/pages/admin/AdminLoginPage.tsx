import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('password123');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials. Please check your username and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-cream-100/90 dark:bg-chocolate-900/90 rounded-3xl border border-cream-300 dark:border-chocolate-800 p-8 shadow-xl space-y-6 backdrop-blur-md">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-chocolate-900 text-cream-50 dark:bg-cream-100 dark:text-chocolate-950 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-chocolate-950 dark:text-cream-50">
            Owner Sign In
          </h1>
          <p className="text-xs text-chocolate-700 dark:text-cream-300">
            Private portal for story creation, editing, and privacy management.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-chocolate-800 dark:text-cream-200 mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3 text-chocolate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 dark:bg-chocolate-950 border border-cream-300 dark:border-chocolate-800 text-sm text-chocolate-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-chocolate-400"
                placeholder="Enter owner username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-chocolate-800 dark:text-cream-200 mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-chocolate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 dark:bg-chocolate-950 border border-cream-300 dark:border-chocolate-800 text-sm text-chocolate-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-chocolate-400"
                placeholder="Enter owner password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-chocolate-900 text-cream-50 dark:bg-cream-100 dark:text-chocolate-950 font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-cream-50 dark:border-chocolate-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
