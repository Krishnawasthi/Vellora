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
      <article className="group relative rounded-2xl overflow-hidden bg-cream-100/90 dark:bg-chocolate-900/70 border border-cream-300 dark:border-chocolate-800 transition-all duration-300 hover:shadow-lg grid grid-cols-1 md:grid-cols-12 gap-0 mb-8 max-w-4xl mx-auto">
        {/* Image side - Sleek proportion */}
        <div className="md:col-span-5 relative h-52 sm:h-64 md:h-auto overflow-hidden bg-cream-200 dark:bg-chocolate-800">
          <Link to={`/story/${story.slug}`} className="block w-full h-full">
            {story.featuredImage ? (
              <img
                src={story.featuredImage}
                alt={story.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-chocolate-500 dark:text-cream-400 font-serif text-xl font-semibold">
                Vellora
              </div>
            )}
          </Link>

          {/* High-Contrast Image Badges */}
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-950/80 text-cream-50 border border-white/20 backdrop-blur-md shadow-md">
              {story.category || 'Featured'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-950/80 text-amber-300 border border-white/20 backdrop-blur-md flex items-center gap-1 shadow-md">
              <Globe className="w-3 h-3 text-amber-400" />
              {languageLabel}
            </span>
          </div>
        </div>

        {/* Content side */}
        <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-xs text-chocolate-700 dark:text-cream-300 mb-2 font-semibold">
              <span>{formatDate(story.publishedAt || story.createdAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                {formatReadingTime(story.readingTime)}
              </span>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-chocolate-950 dark:text-cream-50 hover:text-chocolate-700 dark:hover:text-amber-200 transition-colors leading-snug mb-2">
              <Link to={`/story/${story.slug}`}>
                {story.title}
              </Link>
            </h2>

            <p className="text-chocolate-800 dark:text-cream-200 text-xs sm:text-sm line-clamp-3 font-normal leading-relaxed">
              {story.excerpt}
            </p>
          </div>

          {/* Prominent Read Story Button */}
          <div className="mt-4 pt-3 border-t border-cream-300/80 dark:border-chocolate-800 flex items-center justify-between">
            <Link
              to={`/story/${story.slug}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-chocolate-900 text-cream-50 dark:bg-cream-100 dark:text-chocolate-950 font-bold text-xs hover:scale-105 transition-all shadow-md"
            >
              Read Story →
            </Link>
            {story.tags && story.tags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {story.tags.slice(0, 2).map((tag, idx) => (
                  <span key={idx} className="text-[11px] text-chocolate-600 dark:text-cream-400 font-serif italic">
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
    <article className="group relative flex flex-col rounded-2xl overflow-hidden bg-cream-100/90 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 hover:border-chocolate-400 dark:hover:border-chocolate-600 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Featured Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-cream-200 dark:bg-chocolate-800">
        <Link to={`/story/${story.slug}`} className="block w-full h-full">
          {story.featuredImage ? (
            <img
              src={story.featuredImage}
              alt={story.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-chocolate-500 dark:text-cream-400 font-serif text-base">
              Vellora
            </div>
          )}
        </Link>
        <div className="absolute top-2.5 left-2.5 flex gap-1.5 z-10">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-950/80 text-cream-50 border border-white/20 backdrop-blur-md shadow-md">
            {story.category}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-chocolate-700 dark:text-cream-300 mb-1.5 font-semibold">
            <span>{formatDate(story.publishedAt || story.createdAt)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              {formatReadingTime(story.readingTime)}
            </span>
            <span>•</span>
            <span className="text-chocolate-900 dark:text-cream-100 font-bold">
              {languageLabel}
            </span>
          </div>

          <h3 className="font-serif text-base sm:text-lg font-bold text-chocolate-950 dark:text-cream-50 hover:text-chocolate-700 dark:hover:text-amber-200 transition-colors leading-snug mb-1.5">
            <Link to={`/story/${story.slug}`}>
              {story.title}
            </Link>
          </h3>

          <p className="text-chocolate-800 dark:text-cream-200 text-xs line-clamp-2 leading-relaxed">
            {story.excerpt}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-cream-300/60 dark:border-chocolate-800 flex items-center justify-between text-xs">
          <Link
            to={`/story/${story.slug}`}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-chocolate-900 text-cream-50 dark:bg-cream-100 dark:text-chocolate-950 font-bold text-xs hover:scale-105 transition-all shadow-sm"
          >
            Read Story →
          </Link>
        </div>
      </div>
    </article>
  );
};
