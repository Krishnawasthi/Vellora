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
    <div className="min-h-screen space-y-10 pb-12">
      
      {/* Sleek Hero Banner Section */}
      <section className="relative pt-8 pb-6 bg-gradient-to-b from-cream-100/70 to-transparent dark:from-chocolate-900/50">
        <div className="max-w-3xl mx-auto text-center space-y-4 px-4">
          
          <div className="flex items-center justify-center">
            <Logo size="md" />
          </div>

          <p className="font-noto-serif-devanagari font-serif text-lg sm:text-2xl text-chocolate-950 dark:text-cream-50 max-w-xl mx-auto italic font-medium leading-snug">
            “यहाँ मैं अपने विचार, कहानियाँ और अनुभव साझा करता हूँ”
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cream-200/80 dark:bg-chocolate-800/90 text-chocolate-800 dark:text-cream-200 border border-cream-300 dark:border-chocolate-700/60 shadow-xs text-xs font-serif italic">
            <Coffee className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Warm coffee, quiet thoughts, and reflections in English & हिंदी</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-7 h-7 border-2 border-chocolate-800 dark:border-cream-200 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-xs text-chocolate-600 dark:text-cream-300">Opening journal pages...</p>
          </div>
        ) : stories.length === 0 ? (
          /* Empty State */
          <div className="py-14 text-center max-w-md mx-auto space-y-3 bg-cream-100/90 dark:bg-chocolate-900/60 p-6 rounded-2xl border border-cream-300 dark:border-chocolate-800 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-cream-200 dark:bg-chocolate-800 flex items-center justify-center mx-auto text-chocolate-700 dark:text-cream-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-chocolate-900 dark:text-cream-100">
              Nothing here yet.
            </h3>
            <p className="text-xs text-chocolate-700 dark:text-cream-300">
              Every story starts with a blank page. Check back soon for new reflections!
            </p>
          </div>
        ) : (
          <>
            {/* Featured Story */}
            {featuredStory && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-serif text-[11px] uppercase tracking-widest font-bold text-chocolate-600 dark:text-cream-300">
                    Featured Reflection
                  </h2>
                </div>
                <StoryCard story={featuredStory} featured={true} />
              </section>
            )}

            {/* Recent Stories Grid */}
            {recentStories.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between pb-1">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-chocolate-900 dark:text-cream-100">
                    More Stories & Thoughts
                  </h2>
                  <Link
                    to="/stories"
                    className="group flex items-center gap-1 text-xs font-bold text-chocolate-800 dark:text-cream-200 hover:text-chocolate-950 dark:hover:text-cream-50 transition-colors"
                  >
                    Browse All Stories
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recentStories.map((story) => (
                    <StoryCard key={story._id} story={story} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Thought Note Footer Card */}
        <section className="p-6 sm:p-8 rounded-2xl bg-chocolate-900 text-cream-50 dark:bg-cream-100 dark:text-chocolate-950 border border-chocolate-800 dark:border-cream-200 text-center space-y-2.5 shadow-md">
          <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
            Stories are meant to linger.
          </h3>
          <p className="text-cream-200 dark:text-chocolate-800 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Thank you for stepping into this quiet corner of the internet. Bookmark this page or return whenever you need a peaceful, comforting break.
          </p>
        </section>

      </div>
    </div>
  );
};
