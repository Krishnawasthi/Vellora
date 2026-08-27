import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const navigate = useNavigate();

  const badgeSizes = {
    sm: 'w-7 h-7 text-xs rounded-xl',
    md: 'w-9 h-9 text-base rounded-xl',
    lg: 'w-12 h-12 text-xl rounded-2xl',
  }[size];

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  }[size];

  return (
    <div 
      onDoubleClick={() => navigate('/admin/login')}
      className="flex items-center gap-2.5 group select-none cursor-pointer"
      title="Vellora"
    >
      {/* Small Logo Icon */}
      <div className={`relative ${badgeSizes} bg-gradient-to-br from-chocolate-900 via-chocolate-800 to-chocolate-950 dark:from-cream-100 dark:via-cream-200 dark:to-cream-50 flex items-center justify-center text-cream-50 dark:text-chocolate-950 font-serif font-bold shadow-sm group-hover:scale-105 transition-transform`}>
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5 fill-current">
          <path d="M 24 28 L 48 74 C 49 76 51 76 52 74 L 76 28 C 77.5 25 74.5 24 72 24 L 62 24 C 60 24 59 25 58.5 26.5 L 50 52 L 41.5 26.5 C 41 25 40 24 38 24 L 28 24 C 25.5 24 22.5 25 24 28 Z" />
          <circle cx="74" cy="22" r="7" className="fill-amber-500 dark:fill-amber-600" />
        </svg>
      </div>

      {/* Brand Name Text */}
      {showText && (
        <span className={`font-serif font-bold tracking-tight text-chocolate-950 dark:text-cream-50 ${textSizes}`}>
          Vellora
        </span>
      )}
    </div>
  );
};
