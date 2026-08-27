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
    <article className="min-h-screen pb-24 space-y-8 max-w-4xl mx-auto px-4 sm:px-6 pt-6">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-cream-300/60 dark:border-chocolate-800/60">
        <Link
          to="/stories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-chocolate-700 hover:text-chocolate-950 dark:text-cream-300 dark:hover:text-cream-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to stories
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-100 dark:bg-chocolate-900 border border-cream-300 dark:border-chocolate-800 text-xs font-semibold text-chocolate-900 dark:text-cream-100 hover:scale-105 transition-all shadow-xs"
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

      {/* Main Side-by-Side Reading Section */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        
        {/* Left Column: Small Featured Image */}
        {story.featuredImage && (
          <div className="w-full md:w-72 sm:w-60 flex-shrink-0">
            <div className="relative aspect-[4/3] md:aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-cream-300 dark:border-chocolate-800">
              <img
                src={story.featuredImage}
                alt={story.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        )}

        {/* Right Column: Title, Metadata & Story Text */}
        <div className="flex-1 space-y-4 w-full">
          
          {/* Category & Language Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-chocolate-900 text-cream-50 dark:bg-cream-100 dark:text-chocolate-950 shadow-xs">
              {story.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cream-100 dark:bg-chocolate-900 text-chocolate-900 dark:text-cream-100 border border-cream-300 dark:border-chocolate-800 flex items-center gap-1 shadow-xs">
              <Globe className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              {languageLabel}
            </span>
          </div>

          {/* Title */}
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-chocolate-950 dark:text-cream-50 leading-tight ${fontClass}`}>
            {story.title}
          </h1>

          {/* Metadata */}
          <div className="flex items-center gap-2.5 text-xs text-chocolate-700 dark:text-cream-300 font-serif italic pb-2 border-b border-cream-300/60 dark:border-chocolate-800/60">
            <span>{formatDate(story.publishedAt || story.createdAt)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              {formatReadingTime(story.readingTime)}
            </span>
          </div>

          {/* Rich HTML Content */}
          <div 
            className={`prose prose-sm sm:prose max-w-none space-y-4 leading-relaxed text-chocolate-950 dark:text-cream-50 ${fontClass}
              [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mt-6 [&>h1]:mb-3 [&>h1]:text-chocolate-950 [&>h1]:dark:text-cream-50
              [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-5 [&>h2]:mb-2 [&>h2]:text-chocolate-950 [&>h2]:dark:text-cream-50
              [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mt-4 [&>h3]:mb-2 [&>h3]:text-chocolate-950 [&>h3]:dark:text-cream-50
              [&>p]:text-sm [&>p]:sm:text-base [&>p]:leading-relaxed [&>p]:mb-4 [&>p]:text-chocolate-950 [&>p]:dark:text-cream-50
              [&>blockquote]:border-l-4 [&>blockquote]:border-chocolate-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-4 [&>blockquote]:text-chocolate-900 [&>blockquote]:dark:text-cream-200
              [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ul]:mb-4
              [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5 [&>ol]:mb-4
              [&>img]:rounded-xl [&>img]:my-4 [&>img]:shadow-md [&>img]:max-w-md [&>img]:mx-auto`}
            dangerouslySetInnerHTML={{ __html: story.content }}
          />

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t border-cream-300/80 dark:border-chocolate-800 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-chocolate-600 dark:text-cream-400 uppercase tracking-wider">Tags:</span>
              {story.tags.map((tag, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded-md text-[11px] bg-cream-100 dark:bg-chocolate-900 text-chocolate-800 dark:text-cream-200 border border-cream-300 dark:border-chocolate-800 font-serif italic">
                  #{tag}
                </span>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Footer Return Link */}
      <div className="text-center pt-8 border-t border-cream-300/60 dark:border-chocolate-800/60">
        <p className="font-serif italic text-chocolate-700 dark:text-cream-300 text-xs">
          Thank you for taking the time to read.
        </p>
        <Link
          to="/stories"
          className="inline-block mt-2 text-xs font-bold text-chocolate-900 dark:text-cream-100 underline hover:opacity-80"
        >
          ← Read another story
        </Link>
      </div>

    </article>
  );
};
