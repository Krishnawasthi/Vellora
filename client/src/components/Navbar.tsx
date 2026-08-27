import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, PenTool, LayoutDashboard, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 bg-cream-50/90 dark:bg-chocolate-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-2">
          <Logo size="md" />
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          {!isAdminPage ? (
            /* Pure Public Navigation - No Admin Links */
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link 
                to="/" 
                className={`transition-colors hover:text-chocolate-950 dark:hover:text-cream-50 ${
                  location.pathname === '/' 
                    ? 'text-chocolate-900 dark:text-cream-100 font-bold border-b-2 border-chocolate-800 dark:border-cream-200 py-1' 
                    : 'text-chocolate-700 dark:text-cream-300'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/stories" 
                className={`transition-colors hover:text-chocolate-950 dark:hover:text-cream-50 ${
                  location.pathname === '/stories' 
                    ? 'text-chocolate-900 dark:text-cream-100 font-bold border-b-2 border-chocolate-800 dark:border-cream-200 py-1' 
                    : 'text-chocolate-700 dark:text-cream-300'
                }`}
              >
                Stories
              </Link>
              <Link 
                to="/about" 
                className={`transition-colors hover:text-chocolate-950 dark:hover:text-cream-50 ${
                  location.pathname === '/about' 
                    ? 'text-chocolate-900 dark:text-cream-100 font-bold border-b-2 border-chocolate-800 dark:border-cream-200 py-1' 
                    : 'text-chocolate-700 dark:text-cream-300'
                }`}
              >
                About
              </Link>
            </nav>
          ) : (
            /* Internal Admin Workspace Navigation */
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link 
                to="/admin" 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-200/70 dark:hover:bg-chocolate-900 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link 
                to="/admin/stories/new" 
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-chocolate-900 text-cream-50 dark:bg-cream-100 dark:text-chocolate-900 hover:opacity-90 transition-opacity font-bold shadow-sm"
              >
                <PenTool className="w-4 h-4" />
                Write Story
              </Link>
              <Link 
                to="/admin/settings" 
                className="text-xs text-chocolate-600 hover:text-chocolate-900 dark:hover:text-cream-200 underline"
              >
                Settings
              </Link>
              <button 
                onClick={logout}
                className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:opacity-80 ml-2 font-bold"
                title="Logout from owner dashboard"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </nav>
          )}

          {/* Dark / Light Mode Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-chocolate-700 dark:text-cream-300 hover:text-chocolate-950 dark:hover:text-cream-50 hover:bg-cream-200/60 dark:hover:bg-chocolate-900 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-chocolate-800" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
