import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Coffee } from 'lucide-react';
import { Story } from '../../types';
import { PublicService } from '../../services/api';
import { StoryCard } from '../../components/StoryCard';
import { Logo } from '../../components/Logo';

export const HomePage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHomeStories = async () => {
      try {
        const data = await PublicService.getStories({ limit: 7 });
        setStories(data.stories || []);
      } catch (err) {
        console.error('Error fetching home stories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeStories();
  }, []);

  const featuredStory = stories.length > 0 ? stories[0] : null;
  const recentStories = stories.length > 1 ? stories.slice(1) : [];

  return (
    <div className="min-h-screen space-y-16 pb-12">
      
      {/* Editorial Hero Section - Borderless */}
      <section className="relative pt-12 pb-12 bg-gradient-to-b from-cream-100/60 to-transparent dark:from-chocolate-900/40">
        <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-chocolate-800 text-cream-50 dark:bg-cream-100 dark:text-chocolate-900 shadow-sm text-xs font-semibold tracking-wide">
            <Coffee className="w-3.5 h-3.5 text-amber-300 dark:text-amber-700" />
            <span>A Personal Journal & Reflection Space</span>
          </div>

          <div className="flex items-center justify-center pt-2">
            <Logo size="lg" />
          </div>

          <p className="font-noto-serif-devanagari font-serif text-xl sm:text-3xl text-chocolate-900 dark:text-cream-100 max-w-2xl mx-auto italic font-medium leading-relaxed">
            “यहाँ मैं अपने विचार, कहानियाँ और अनुभव साझा करता हूँ”
          </p>

          {/* Slogan Badge */}
          <div className="pt-3 max-w-xl mx-auto">
            <p className="text-xs sm:text-sm font-serif italic text-chocolate-700 dark:text-cream-200 bg-cream-200/70 dark:bg-chocolate-800/80 py-2.5 px-6 rounded-full border border-cream-300 dark:border-chocolate-700/60 shadow-sm inline-block">
              ☕ Warm coffee, quiet thoughts, and timeless reflections written in English & हिंदी.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-8 h-8 border-2 border-chocolate-800 dark:border-cream-200 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-sm text-chocolate-600 dark:text-cream-300">Opening journal pages...</p>
          </div>
        ) : stories.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center max-w-md mx-auto space-y-4 bg-cream-100/90 dark:bg-chocolate-900/60 p-8 rounded-3xl border border-cream-300 dark:border-chocolate-800 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-cream-200 dark:bg-chocolate-800 flex items-center justify-center mx-auto text-chocolate-700 dark:text-cream-200">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-chocolate-900 dark:text-cream-100">
              Nothing here yet.
            </h3>
            <p className="text-sm text-chocolate-700 dark:text-cream-300">
              Every story starts with a blank page. Check back soon for new reflections!
            </p>
          </div>
        ) : (
          <>
            {/* Featured Story */}
            {featuredStory && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xs uppercase tracking-widest font-bold text-chocolate-600 dark:text-cream-300">
                    Latest Reflection
                  </h2>
                </div>
                <StoryCard story={featuredStory} featured={true} />
              </section>
            )}

            {/* Recent Stories Grid */}
            {recentStories.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center justify-between pb-2">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900 dark:text-cream-100">
                    More Stories & Thoughts
                  </h2>
                  <Link
                    to="/stories"
                    className="group flex items-center gap-1.5 text-xs font-bold text-chocolate-800 dark:text-cream-200 hover:text-chocolate-950 dark:hover:text-cream-50 transition-colors"
                  >
                    Browse All Stories
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentStories.map((story) => (
                    <StoryCard key={story._id} story={story} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Thought Note Footer Card */}
        <section className="p-8 sm:p-10 rounded-3xl bg-chocolate-900 text-cream-50 dark:bg-cream-100 dark:text-chocolate-950 border border-chocolate-800 dark:border-cream-200 text-center space-y-4 shadow-lg">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
            Stories are meant to linger.
          </h3>
          <p className="text-cream-200 dark:text-chocolate-800 text-sm max-w-xl mx-auto leading-relaxed">
            Thank you for stepping into this quiet corner of the internet. Bookmark this page or return whenever you need a peaceful, comforting break.
          </p>
        </section>

      </div>
    </div>
  );
};
