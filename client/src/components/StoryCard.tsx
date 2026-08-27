import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Globe } from 'lucide-react';
import { Story } from '../types';
import { formatDate, formatReadingTime } from '../utils/formatters';

interface StoryCardProps {
  story: Story;
  featured?: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, featured = false }) => {
  const languageLabel = {
    en: 'English',
    hi: 'हिंदी',
    mixed: 'English & हिंदी',
  }[story.language] || 'English';

  if (featured) {
    return (
      <article className="group relative rounded-xl overflow-hidden bg-cream-100/90 dark:bg-chocolate-900/70 border border-cream-300 dark:border-chocolate-800 transition-all duration-300 hover:shadow-md grid grid-cols-1 md:grid-cols-12 gap-0 mb-4 max-w-4xl mx-auto md:h-40">
        {/* Ultra-compact image thumbnail */}
        <div className="md:col-span-4 relative h-36 md:h-full overflow-hidden bg-cream-200 dark:bg-chocolate-800">
          <Link to={`/story/${story.slug}`} className="block w-full h-full">
            {story.featuredImage ? (
              <img
                src={story.featuredImage}
                alt={story.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-chocolate-500 dark:text-cream-400 font-serif text-sm font-semibold">
                Vellora
              </div>
            )}
          </Link>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1 z-10">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-stone-950/85 text-cream-50 border border-white/20 backdrop-blur-md shadow-xs">
              {story.category || 'Featured'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-stone-950/85 text-amber-300 border border-white/20 backdrop-blur-md flex items-center gap-1 shadow-xs">
              <Globe className="w-2.5 h-2.5 text-amber-400" />
              {languageLabel}
            </span>
          </div>
        </div>

        {/* Ultra-compact content side */}
        <div className="md:col-span-8 p-3 sm:p-4 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] text-chocolate-700 dark:text-cream-300 mb-1 font-semibold">
              <span>{formatDate(story.publishedAt || story.createdAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                {formatReadingTime(story.readingTime)}
              </span>
            </div>

            <h2 className="font-serif text-base font-bold text-chocolate-950 dark:text-cream-50 hover:text-chocolate-700 dark:hover:text-amber-200 transition-colors leading-snug mb-1 line-clamp-1">
              <Link to={`/story/${story.slug}`}>
                {story.title}
              </Link>
            </h2>

            <p className="text-chocolate-800 dark:text-cream-200 text-xs line-clamp-2 font-normal leading-relaxed">
              {story.excerpt}
            </p>
          </div>

          <div className="mt-2 pt-2 border-t border-cream-300/80 dark:border-chocolate-800 flex items-center justify-between">
            <Link
              to={`/story/${story.slug}`}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-chocolate-900 text-cream-50 dark:bg-cream-100 dark:text-chocolate-950 font-bold text-[11px] hover:scale-105 transition-all shadow-xs"
            >
              Read Story →
            </Link>
            {story.tags && story.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {story.tags.slice(0, 2).map((tag, idx) => (
                  <span key={idx} className="text-[9px] text-chocolate-600 dark:text-cream-400 font-serif italic">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex flex-col rounded-xl overflow-hidden bg-cream-100/90 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 hover:border-chocolate-400 dark:hover:border-chocolate-600 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
      {/* Compact Featured Image */}
      <div className="relative aspect-[16/8] overflow-hidden bg-cream-200 dark:bg-chocolate-800">
        <Link to={`/story/${story.slug}`} className="block w-full h-full">
          {story.featuredImage ? (
            <img
              src={story.featuredImage}
              alt={story.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-chocolate-500 dark:text-cream-400 font-serif text-xs">
              Vellora
            </div>
          )}
        </Link>
        <div className="absolute top-1.5 left-1.5 flex gap-1 z-10">
          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-stone-950/85 text-cream-50 border border-white/20 backdrop-blur-md shadow-xs">
            {story.category}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 text-[9px] text-chocolate-700 dark:text-cream-300 mb-0.5 font-semibold">
            <span>{formatDate(story.publishedAt || story.createdAt)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
              {formatReadingTime(story.readingTime)}
            </span>
          </div>

          <h3 className="font-serif text-xs font-bold text-chocolate-950 dark:text-cream-50 hover:text-chocolate-700 dark:hover:text-amber-200 transition-colors leading-snug mb-0.5 line-clamp-1">
            <Link to={`/story/${story.slug}`}>
              {story.title}
            </Link>
          </h3>

          <p className="text-chocolate-800 dark:text-cream-200 text-[10px] line-clamp-1 leading-normal">
            {story.excerpt}
          </p>
        </div>

        <div className="mt-2 pt-1.5 border-t border-cream-300/60 dark:border-chocolate-800 flex items-center justify-between">
          <Link
            to={`/story/${story.slug}`}
            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-chocolate-900 text-cream-50 dark:bg-cream-100 dark:text-chocolate-950 font-bold text-[10px] hover:scale-105 transition-all shadow-xs"
          >
            Read Story →
          </Link>
        </div>
      </div>
    </article>
  );
};
