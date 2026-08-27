import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
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
    <div className="flex items-center gap-2.5 group select-none">
      {/* Small Logo Icon */}
      <div className={`relative ${badgeSizes} bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 dark:from-warm-100 dark:via-warm-200 dark:to-warm-50 flex items-center justify-center text-warm-50 dark:text-stone-950 font-serif font-bold shadow-sm group-hover:scale-105 transition-transform`}>
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5 fill-current">
          <path d="M 24 28 L 48 74 C 49 76 51 76 52 74 L 76 28 C 77.5 25 74.5 24 72 24 L 62 24 C 60 24 59 25 58.5 26.5 L 50 52 L 41.5 26.5 C 41 25 40 24 38 24 L 28 24 C 25.5 24 22.5 25 24 28 Z" />
          <circle cx="74" cy="22" r="7" className="fill-amber-500 dark:fill-amber-600" />
        </svg>
      </div>

      {/* Brand Name Text */}
      {showText && (
        <span className={`font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100 ${textSizes}`}>
          Vellora
        </span>
      )}
    </div>
  );
};
