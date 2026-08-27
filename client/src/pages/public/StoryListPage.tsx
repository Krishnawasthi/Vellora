import React, { useEffect, useState } from 'react';
import { Search, Filter, Globe, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Story } from '../../types';
import { PublicService } from '../../services/api';
import { StoryCard } from '../../components/StoryCard';

export const StoryListPage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('All');
  const [language, setLanguage] = useState<string>('All');
  const [sort, setSort] = useState<string>('newest');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Load categories once
  useEffect(() => {
    PublicService.getCategories()
      .then((cats) => setCategories(['All', ...cats]))
      .catch((err) => console.error(err));
  }, []);

  // Load stories on filter change
  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const data = await PublicService.getStories({
          search,
          category: category !== 'All' ? category : undefined,
          language: language !== 'All' ? language : undefined,
          sort,
          page,
        });
        setStories(data.stories || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
        }
      } catch (err) {
        console.error('Error loading story directory:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchStories();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category, language, sort, page]);

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setLanguage('All');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
          All Stories & Thoughts
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base font-serif italic">
          Explore public entries, reflections, and travel journals across English and Hindi.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-warm-100/70 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-4">
        
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Search stories by keyword, tag, or title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-warm-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-stone-500 hidden sm:inline" />
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-44 px-3 py-2 rounded-xl bg-warm-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-sm text-stone-800 dark:text-stone-200 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:w-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full md:w-36 px-3 py-2 rounded-xl bg-warm-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-sm text-stone-800 dark:text-stone-200 focus:outline-none"
            >
              <option value="newest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Language Pills & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-200/60 dark:border-stone-800/60 text-xs">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-stone-500 flex items-center gap-1 font-medium">
              <Globe className="w-3.5 h-3.5" /> Language:
            </span>
            {[
              { id: 'All', label: 'All Languages' },
              { id: 'en', label: 'English' },
              { id: 'hi', label: 'हिंदी' },
              { id: 'mixed', label: 'Mixed / Hinglish' },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  setLanguage(lang.id);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-full font-medium transition-colors ${
                  language === lang.id
                    ? 'bg-stone-900 text-warm-50 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                    : 'bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300/60 dark:hover:bg-stone-700'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {(search || category !== 'All' || language !== 'All' || sort !== 'newest') && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 font-medium"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid Results */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-7 h-7 border-2 border-stone-800 dark:border-stone-200 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-serif text-stone-500">Searching stories...</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-warm-100/50 dark:bg-stone-900/40 p-8 rounded-2xl border border-stone-200/60 dark:border-stone-800">
          <p className="font-serif text-lg font-bold text-stone-800 dark:text-stone-200">
            No public stories matched your filter criteria.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-stone-900 text-warm-50 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-xl bg-warm-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 disabled:opacity-30 text-stone-700 dark:text-stone-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-xl bg-warm-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 disabled:opacity-30 text-stone-700 dark:text-stone-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
