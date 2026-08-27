import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit3, 
  Trash2, 
  Globe, 
  Lock, 
  FileText, 
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Story, DashboardStats, StatusType } from '../../types';
import { AdminService } from '../../services/api';
import { formatDate } from '../../utils/formatters';
import { ConfirmationModal } from '../../components/ConfirmationModal';

export const DashboardPage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ total: 0, published: 0, drafts: 0, private: 0 });
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getStories({
        status: statusFilter,
        search,
      });
      setStories(data.stories || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching admin stories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [statusFilter, search]);

  const handleToggleStatus = async (id: string, newStatus: StatusType) => {
    try {
      await AdminService.toggleStatus(id, newStatus);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await AdminService.deleteStory(deleteId);
      setDeleteId(null);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to delete story.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-cream-300 dark:border-chocolate-800">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950 dark:text-cream-50 flex items-center gap-2">
            Welcome back 👋
          </h1>
          <p className="text-xs sm:text-sm text-chocolate-700 dark:text-cream-300 mt-1">
            Manage your personal collection of stories, thoughts, and reflections.
          </p>
        </div>

        <Link
          to="/admin/stories/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-chocolate-900 text-cream-50 dark:bg-cream-100 dark:text-chocolate-950 font-bold text-xs hover:scale-105 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Story</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-cream-100/90 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 space-y-1">
          <span className="text-xs font-bold text-chocolate-700 dark:text-cream-300 uppercase tracking-wider">
            Total Stories
          </span>
          <div className="text-3xl font-bold font-serif text-chocolate-950 dark:text-cream-50">
            {stats.total}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Published
          </span>
          <div className="text-3xl font-bold font-serif text-emerald-950 dark:text-emerald-100">
            {stats.published}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-1">
          <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Drafts
          </span>
          <div className="text-3xl font-bold font-serif text-amber-950 dark:text-amber-100">
            {stats.drafts}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-cream-200/60 dark:bg-chocolate-800/50 border border-cream-300 dark:border-chocolate-700 space-y-1">
          <span className="text-xs font-bold text-chocolate-700 dark:text-cream-300 uppercase tracking-wider flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> Private
          </span>
          <div className="text-3xl font-bold font-serif text-chocolate-950 dark:text-cream-50">
            {stats.private}
          </div>
        </div>
      </div>

      {/* Table Toolbar (Filter tabs & Search) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-cream-100/90 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Stories' },
            { id: 'PUBLIC', label: 'Published' },
            { id: 'DRAFT', label: 'Drafts' },
            { id: 'PRIVATE', label: 'Private' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-chocolate-900 text-cream-50 dark:bg-cream-100 dark:text-chocolate-950 shadow-sm'
                  : 'text-chocolate-800 dark:text-cream-200 hover:bg-cream-200/60 dark:hover:bg-chocolate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-chocolate-400" />
          <input
            type="text"
            placeholder="Search stories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-cream-50 dark:bg-chocolate-950 border border-cream-300 dark:border-chocolate-800 text-xs text-chocolate-900 dark:text-cream-100 focus:outline-none"
          />
        </div>
      </div>

      {/* Stories Table */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-7 h-7 border-2 border-chocolate-800 dark:border-cream-200 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-serif text-chocolate-600 dark:text-cream-300">Loading stories list...</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-cream-100/50 dark:bg-chocolate-900/40 p-8 rounded-2xl border border-cream-300 dark:border-chocolate-800">
          <FileText className="w-10 h-10 text-chocolate-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-chocolate-950 dark:text-cream-50">
            You haven't written anything here yet.
          </h3>
          <p className="text-xs text-chocolate-700 dark:text-cream-300 max-w-sm mx-auto">
            Start with your first story, thought, or journal entry.
          </p>
          <Link
            to="/admin/stories/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-chocolate-900 text-cream-50 dark:bg-cream-100 dark:text-chocolate-950 text-xs font-bold"
          >
            <Plus className="w-4 h-4" /> Start Writing
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-cream-300 dark:border-chocolate-800 bg-cream-50/50 dark:bg-chocolate-950/50 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-cream-300 dark:border-chocolate-800 bg-cream-100/90 dark:bg-chocolate-900/80 text-[11px] font-bold text-chocolate-700 dark:text-cream-300 uppercase tracking-wider">
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Language</th>
                <th className="py-3.5 px-4">Created</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-300/60 dark:divide-chocolate-800/60 text-xs">
              {stories.map((story) => {
                const statusBadge = {
                  PUBLIC: (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      <Globe className="w-3 h-3" /> PUBLIC
                    </span>
                  ),
                  DRAFT: (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      <Clock className="w-3 h-3" /> DRAFT
                    </span>
                  ),
                  PRIVATE: (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-chocolate-200 text-chocolate-900 dark:bg-chocolate-800 dark:text-cream-200 border border-cream-300 dark:border-chocolate-700">
                      <Lock className="w-3 h-3" /> PRIVATE
                    </span>
                  ),
                }[story.status];

                const languageText = {
                  en: 'English',
                  hi: 'हिंदी',
                  mixed: 'Mixed',
                }[story.language] || 'English';

                return (
                  <tr key={story._id} className="hover:bg-cream-100/70 dark:hover:bg-chocolate-900/40 transition-colors">
                    {/* Clickable Title & Excerpt */}
                    <td className="py-3.5 px-4">
                      <Link 
                        to={`/admin/stories/${story._id}/edit`}
                        className="font-serif font-bold text-chocolate-950 dark:text-cream-50 text-sm line-clamp-1 hover:text-chocolate-700 dark:hover:text-amber-300 hover:underline transition-colors block"
                      >
                        {story.title || 'Untitled Story'}
                      </Link>
                      <div className="text-[11px] text-chocolate-600 dark:text-cream-300 line-clamp-1 mt-0.5">
                        {story.excerpt || 'No excerpt written'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {statusBadge}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-chocolate-800 dark:text-cream-200 font-medium">
                      {languageText}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-chocolate-700 dark:text-cream-300">
                      {formatDate(story.createdAt)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1.5">
                      {/* View / Open Public Story */}
                      {story.status === 'PUBLIC' && (
                        <Link
                          to={`/story/${story.slug}`}
                          target="_blank"
                          className="p-1.5 inline-flex items-center gap-1 text-xs font-bold text-chocolate-800 dark:text-cream-200 hover:text-chocolate-950 dark:hover:text-cream-50 rounded-lg hover:bg-cream-200/80 dark:hover:bg-chocolate-800 transition-colors"
                          title="View public story page"
                        >
                          <Eye className="w-4 h-4" />
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </Link>
                      )}

                      {/* Edit Button */}
                      <Link
                        to={`/admin/stories/${story._id}/edit`}
                        className="p-1.5 inline-flex items-center gap-1 text-xs font-bold text-chocolate-800 dark:text-cream-200 hover:text-chocolate-950 dark:hover:text-cream-50 rounded-lg hover:bg-cream-200/80 dark:hover:bg-chocolate-800 transition-colors"
                        title="Edit story"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>

                      {/* Status Quick Toggle button */}
                      {story.status !== 'PUBLIC' ? (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(story._id, 'PUBLIC')}
                          className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 rounded-md border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200 transition-colors"
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(story._id, 'PRIVATE')}
                          className="px-2.5 py-1 text-[11px] font-bold text-chocolate-800 dark:text-cream-200 bg-cream-200/80 dark:bg-chocolate-800 rounded-md border border-cream-300 dark:border-chocolate-700 hover:bg-cream-300 transition-colors"
                        >
                          Make Private
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteId(story._id);
                          setDeleteTitle(story.title || 'Untitled Story');
                        }}
                        className="p-1.5 inline-block text-red-600 dark:text-red-400 hover:bg-red-100/60 dark:hover:bg-red-950/60 rounded-lg transition-colors"
                        title="Delete story"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteId}
        title="Delete Story"
        message={`Are you sure you want to delete "${deleteTitle}"? This action cannot be undone.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete Story'}
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

    </div>
  );
};
