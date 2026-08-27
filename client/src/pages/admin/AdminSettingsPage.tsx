import React, { useState } from 'react';
import { User, KeyRound, Save, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminService } from '../../services/api';

export const AdminSettingsPage: React.FC = () => {
  const { adminUser, updateUser } = useAuth();

  const [name, setName] = useState<string>(adminUser?.name || '');
  const [bio, setBio] = useState<string>(adminUser?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState<string>(adminUser?.avatarUrl || '');

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await AdminService.updateSettings({
        name,
        bio,
        avatarUrl,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });

      if (res.admin) {
        updateUser(res.admin);
      }
      setMessage('Profile settings updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update settings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">
          Owner Settings & Security
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Customize your author profile and security credentials.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-warm-100/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
          <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <User className="w-4 h-4 text-stone-500" /> Author Details
          </h2>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Author Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-warm-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Author Bio / Reflection statement
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-warm-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Avatar Image URL
            </label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-warm-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Security Card */}
        <div className="p-6 rounded-2xl bg-warm-100/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
          <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-stone-500" /> Change Password
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-warm-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 focus:outline-none"
                placeholder="Required to change password"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-warm-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 focus:outline-none"
                placeholder="At least 6 characters"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-xl bg-stone-900 text-warm-50 dark:bg-stone-100 dark:text-stone-900 font-semibold text-xs hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-warm-50 dark:border-stone-900 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};
