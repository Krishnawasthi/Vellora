import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 py-12 bg-cream-100/60 dark:bg-chocolate-950/60 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-chocolate-700 dark:text-cream-300">
        
        {/* Left Side */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <Logo size="sm" />
          <span className="hidden sm:inline text-chocolate-400 dark:text-chocolate-600">•</span>
          <span className="font-serif italic text-chocolate-700 dark:text-cream-200">
            A quiet, warm corner of the internet for stories and thoughts.
          </span>
        </div>

        {/* Right Side Links (Pure Public Links Only) */}
        <div className="flex items-center gap-6 text-xs font-medium">
          <Link to="/" className="hover:text-chocolate-950 dark:hover:text-cream-50 transition-colors">
            Home
          </Link>
          <Link to="/stories" className="hover:text-chocolate-950 dark:hover:text-cream-50 transition-colors">
            All Stories
          </Link>
          <Link to="/about" className="hover:text-chocolate-950 dark:hover:text-cream-50 transition-colors">
            About
          </Link>
          <a 
            href="/sitemap.xml" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-chocolate-950 dark:hover:text-cream-50 transition-colors"
          >
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  );
};
