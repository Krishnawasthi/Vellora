import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Globe, Share2, Check } from 'lucide-react';
import { Story } from '../../types';
import { PublicService } from '../../services/api';
import { formatDate, formatReadingTime } from '../../utils/formatters';
import { getFontClass } from '../../utils/fonts';

export const StoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchStory = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const data = await PublicService.getStoryBySlug(slug);
        setStory(data);
        // Update document title for SEO
        if (data.title) {
          document.title = `${data.title} — Vellora`;
        }
      } catch (err: any) {
        setError('This story is either private or does not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-32 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-chocolate-800 dark:border-cream-200 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-serif text-sm text-chocolate-600 dark:text-cream-300">Unfolding story...</p>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <h2 className="font-serif text-3xl font-bold text-chocolate-950 dark:text-cream-50">
          Story Not Found
        </h2>
        <p className="text-chocolate-800 dark:text-cream-200 text-sm leading-relaxed">
          {error || 'The story you are looking for is unavailable.'}
        </p>
        <Link
          to="/stories"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-chocolate-900 text-cream-50 dark:bg-cream-100 dark:text-chocolate-950 text-xs font-bold shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Return to All Stories
        </Link>
      </div>
    );
  }

  const fontClass = getFontClass(story.fontFamily);

  const languageLabel = {
    en: 'English',
    hi: 'हिंदी',
    mixed: 'English & हिंदी',
  }[story.language] || 'English';

  return (
    <article className="min-h-screen pb-24 space-y-10">
      
      {/* Top Header Navigation */}
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <div className="flex items-center justify-between">
          <Link
            to="/stories"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-chocolate-700 hover:text-chocolate-950 dark:text-cream-300 dark:hover:text-cream-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to stories
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-100 dark:bg-chocolate-900 border border-cream-300 dark:border-chocolate-800 text-xs font-semibold text-chocolate-900 dark:text-cream-100 hover:scale-105 transition-all shadow-sm"
            title="Copy story link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Story Header */}
      <header className="max-w-3xl mx-auto px-4 space-y-6 text-center">
        {/* Category & Language Pill */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-chocolate-900 text-cream-50 dark:bg-cream-100 dark:text-chocolate-950 shadow-sm">
            {story.category}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cream-100 dark:bg-chocolate-900 text-chocolate-900 dark:text-cream-100 border border-cream-300 dark:border-chocolate-800 flex items-center gap-1 shadow-sm">
            <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            {languageLabel}
          </span>
        </div>

        {/* Story Title */}
        <h1 className={`text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-chocolate-950 dark:text-cream-50 leading-[1.15] ${fontClass}`}>
          {story.title}
        </h1>

        {/* Metadata */}
        <div className="flex items-center justify-center gap-3 text-xs sm:text-sm text-chocolate-700 dark:text-cream-300 font-serif italic pt-2">
          <span>{formatDate(story.publishedAt || story.createdAt)}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            {formatReadingTime(story.readingTime)}
          </span>
        </div>
      </header>

      {/* Featured Image */}
      {story.featuredImage && (
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-xl border border-cream-300 dark:border-chocolate-800">
            <img
              src={story.featuredImage}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Main Reading Container */}
      <div className={`max-w-2xl mx-auto px-4 sm:px-6 py-6 text-chocolate-950 dark:text-cream-50 ${fontClass}`}>
        
        {/* Render Rich HTML Content */}
        <div 
          className="prose prose-lg max-w-none space-y-6 leading-relaxed text-chocolate-950 dark:text-cream-50
            [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mt-10 [&>h1]:mb-4 [&>h1]:text-chocolate-950 [&>h1]:dark:text-cream-50
            [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:text-chocolate-950 [&>h2]:dark:text-cream-50
            [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mt-6 [&>h3]:mb-2 [&>h3]:text-chocolate-950 [&>h3]:dark:text-cream-50
            [&>p]:text-base [&>p]:sm:text-lg [&>p]:leading-relaxed [&>p]:mb-6 [&>p]:text-chocolate-950 [&>p]:dark:text-cream-50
            [&>blockquote]:border-l-4 [&>blockquote]:border-chocolate-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-6 [&>blockquote]:text-chocolate-900 [&>blockquote]:dark:text-cream-200
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul]:mb-6
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>ol]:mb-6
            [&>img]:rounded-2xl [&>img]:my-8 [&>img]:shadow-lg [&>img]:w-full"
          dangerouslySetInnerHTML={{ __html: story.content }}
        />

        {/* Tags */}
        {story.tags && story.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-cream-300/80 dark:border-chocolate-800 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-chocolate-600 dark:text-cream-400 uppercase tracking-wider">Tags:</span>
            {story.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg text-xs bg-cream-100 dark:bg-chocolate-900 text-chocolate-800 dark:text-cream-200 border border-cream-300 dark:border-chocolate-800 font-serif italic">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Serene Footer Prompt */}
      <div className="max-w-2xl mx-auto px-4 text-center pt-8 border-t border-cream-300/60 dark:border-chocolate-800/60">
        <p className="font-serif italic text-chocolate-700 dark:text-cream-300 text-sm">
          Thank you for taking the time to read.
        </p>
        <Link
          to="/stories"
          className="inline-block mt-4 text-xs font-bold text-chocolate-900 dark:text-cream-100 underline hover:opacity-80"
        >
          ← Read another story
        </Link>
      </div>

    </article>
  );
};
