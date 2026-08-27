import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Check, 
  Globe, 
  Type as TypeIcon, 
  Image as ImageIcon, 
  Lock,
  Upload,
  X,
  Send
} from 'lucide-react';
import { Story, LanguageType, StatusType, FontType } from '../../types';
import { AdminService } from '../../services/api';
import { QuillEditor } from '../../components/QuillEditor';
import { FONT_OPTIONS, getFontClass } from '../../utils/fonts';

export const StoryEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  // Story state
  const [storyId, setStoryId] = useState<string | null>(id || null);
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [excerpt, setExcerpt] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [language, setLanguage] = useState<LanguageType>('en');
  const [fontFamily, setFontFamily] = useState<FontType>('georgia');
  const [category, setCategory] = useState<string>('General');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [status, setStatus] = useState<StatusType>('DRAFT');

  // Autosave & UI state
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const initialLoadedRef = useRef<boolean>(false);

  // Fetch story if editing
  useEffect(() => {
    if (isEditMode && id) {
      AdminService.getStoryById(id)
        .then((s: Story) => {
          setTitle(s.title || '');
          setSlug(s.slug || '');
          setExcerpt(s.excerpt || '');
          setContent(s.content || '');
          setFeaturedImage(s.featuredImage || '');
          setLanguage(s.language || 'en');
          setFontFamily(s.fontFamily || 'georgia');
          setCategory(s.category || 'General');
          setTagsInput((s.tags || []).join(', '));
          setStatus(s.status || 'DRAFT');
          initialLoadedRef.current = true;
        })
        .catch((err) => console.error('Error fetching story:', err));
    } else {
      initialLoadedRef.current = true;
    }
  }, [id, isEditMode]);

  // Debounced Autosave function
  const saveStory = async (overrideStatus?: StatusType) => {
    if (!initialLoadedRef.current) return;
    setAutosaveStatus('saving');

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title || 'Untitled Story',
      slug,
      excerpt,
      content,
      featuredImage,
      language,
      fontFamily,
      category,
      tags: tagsArray,
      status: overrideStatus || status,
    };

    try {
      if (storyId) {
        const updated = await AdminService.updateStory(storyId, payload);
        if (updated.slug) setSlug(updated.slug);
      } else {
        const created = await AdminService.createStory(payload);
        setStoryId(created._id);
        if (created.slug) setSlug(created.slug);
        window.history.replaceState(null, '', `/admin/stories/${created._id}/edit`);
      }
      setAutosaveStatus('saved');
    } catch (err) {
      console.error('Autosave error:', err);
      setAutosaveStatus('error');
    }
  };

  // Debounce helper
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerAutosave = useCallback(() => {
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }
    setAutosaveStatus('saving');
    autosaveTimeoutRef.current = setTimeout(() => {
      saveStory();
    }, 1500);
  }, [title, slug, excerpt, content, featuredImage, language, fontFamily, category, tagsInput, status, storyId]);

  // Image Upload for Featured Image
  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        const res = await AdminService.uploadImage(e.target.files[0]);
        setFeaturedImage(res.url);
        saveStory();
      } catch (err) {
        alert('Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handlePublish = async () => {
    setStatus('PUBLIC');
    await saveStory('PUBLIC');
    alert('Story published successfully!');
    navigate('/admin');
  };

  const handleMakePrivate = async () => {
    setStatus('PRIVATE');
    await saveStory('PRIVATE');
  };

  const fontClass = getFontClass(fontFamily);

  return (
    <div className="min-h-screen pb-24 space-y-8">
      
      {/* Sticky Header Bar */}
      <div className="sticky top-0 z-40 bg-cream-50/95 dark:bg-chocolate-950/95 backdrop-blur-md border-b border-cream-300 dark:border-chocolate-800 py-3">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="p-2 rounded-xl text-chocolate-700 hover:text-chocolate-950 dark:text-cream-300 dark:hover:text-cream-50 hover:bg-cream-200/60 dark:hover:bg-chocolate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-serif text-lg font-bold text-chocolate-950 dark:text-cream-50 line-clamp-1">
                {title || 'Untitled Story'}
              </h1>
              {/* Autosave Status indicator */}
              <div className="flex items-center gap-1.5 text-[11px]">
                {autosaveStatus === 'saving' && (
                  <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    Saving...
                  </span>
                )}
                {autosaveStatus === 'saved' && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Saved just now
                  </span>
                )}
                {autosaveStatus === 'error' && (
                  <span className="text-red-500 font-medium">Autosave failed</span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="px-3.5 py-1.5 rounded-xl border border-cream-300 dark:border-chocolate-700 text-xs font-bold text-chocolate-800 dark:text-cream-200 hover:bg-cream-200/60 dark:hover:bg-chocolate-900 transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>

            <button
              type="button"
              onClick={() => saveStory('DRAFT')}
              className="px-3.5 py-1.5 rounded-xl border border-cream-300 dark:border-chocolate-700 text-xs font-bold text-chocolate-800 dark:text-cream-200 hover:bg-cream-200/60 dark:hover:bg-chocolate-900 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Draft
            </button>

            {status === 'PUBLIC' ? (
              <button
                type="button"
                onClick={handleMakePrivate}
                className="px-4 py-1.5 rounded-xl bg-chocolate-200 text-chocolate-900 dark:bg-chocolate-800 dark:text-cream-100 text-xs font-bold hover:opacity-90 transition-opacity"
              >
                Make Private
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                className="px-4.5 py-1.5 rounded-xl bg-emerald-600 text-white dark:bg-emerald-500 text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-md hover:scale-105"
              >
                <Globe className="w-3.5 h-3.5" /> Publish Story
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Rich Text Writing Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Title Input */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Title of your story..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                triggerAutosave();
              }}
              className="w-full text-3xl sm:text-4xl font-serif font-bold bg-transparent border-b border-cream-300 dark:border-chocolate-800 pb-3 text-chocolate-950 dark:text-cream-50 placeholder-chocolate-400 focus:outline-none focus:border-chocolate-500"
            />
          </div>

          {/* Excerpt Input */}
          <div>
            <textarea
              placeholder="Write a short summary or teaser excerpt..."
              rows={2}
              value={excerpt}
              onChange={(e) => {
                setExcerpt(e.target.value);
                triggerAutosave();
              }}
              className="w-full text-sm font-serif italic bg-transparent border border-cream-300 dark:border-chocolate-800 rounded-xl p-3 text-chocolate-800 dark:text-cream-200 placeholder-chocolate-400 focus:outline-none"
            />
          </div>

          {/* Production Quill Editor */}
          <QuillEditor
            value={content}
            onChange={(html) => {
              setContent(html);
              triggerAutosave();
            }}
            fontClass={fontClass}
          />

          {/* Bottom Action & Publishing Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-cream-100/90 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-chocolate-700 dark:text-cream-300">Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                status === 'PUBLIC' 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                  : status === 'PRIVATE'
                  ? 'bg-chocolate-200 text-chocolate-900 dark:bg-chocolate-800 dark:text-cream-200'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {status}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => saveStory('DRAFT')}
                className="px-4 py-2.5 rounded-xl border border-cream-300 dark:border-chocolate-700 text-xs font-bold text-chocolate-800 dark:text-cream-200 hover:bg-cream-200/60 dark:hover:bg-chocolate-800 transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Draft
              </button>

              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="px-4 py-2.5 rounded-xl border border-cream-300 dark:border-chocolate-700 text-xs font-bold text-chocolate-800 dark:text-cream-200 hover:bg-cream-200/60 dark:hover:bg-chocolate-800 transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" /> Preview
              </button>

              <button
                type="button"
                onClick={handlePublish}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white dark:bg-emerald-500 font-bold text-xs hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-md hover:scale-105"
              >
                <Send className="w-4 h-4" />
                <span>Publish Story</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Settings & Metadata */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Featured Image Box */}
          <div className="p-5 rounded-2xl bg-cream-100/90 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 space-y-3">
            <label className="text-xs font-semibold text-chocolate-800 dark:text-cream-200 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-chocolate-500" /> Featured Image
            </label>

            {featuredImage ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-cream-300 dark:border-chocolate-700 group">
                <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setFeaturedImage('');
                    saveStory();
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-chocolate-900/80 text-white hover:bg-red-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-cream-300 dark:border-chocolate-700 rounded-xl p-6 text-center space-y-2 hover:border-chocolate-400 transition-colors">
                <Upload className="w-6 h-6 text-chocolate-400 mx-auto" />
                <p className="text-xs text-chocolate-500">Upload a cover image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="featured-upload-input"
                />
                <label
                  htmlFor="featured-upload-input"
                  className="inline-block px-3.5 py-1.5 rounded-lg bg-chocolate-900 text-cream-50 dark:bg-cream-100 dark:text-chocolate-950 text-xs font-bold cursor-pointer"
                >
                  {isUploading ? 'Uploading...' : 'Choose Image'}
                </label>
              </div>
            )}

            <input
              type="text"
              placeholder="Or paste image URL..."
              value={featuredImage}
              onChange={(e) => {
                setFeaturedImage(e.target.value);
                triggerAutosave();
              }}
              className="w-full px-3 py-1.5 rounded-xl bg-cream-50 dark:bg-chocolate-950 border border-cream-300 dark:border-chocolate-800 text-xs text-chocolate-800 dark:text-cream-200 focus:outline-none"
            />
          </div>

          {/* Typography / Font Selector */}
          <div className="p-5 rounded-2xl bg-cream-100/90 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 space-y-3">
            <label className="text-xs font-semibold text-chocolate-800 dark:text-cream-200 uppercase tracking-wider flex items-center gap-1.5">
              <TypeIcon className="w-4 h-4 text-chocolate-500" /> Story Font
            </label>
            <select
              value={fontFamily}
              onChange={(e) => {
                setFontFamily(e.target.value as FontType);
                triggerAutosave();
              }}
              className="w-full px-3 py-2 rounded-xl bg-cream-50 dark:bg-chocolate-950 border border-cream-300 dark:border-chocolate-800 text-xs text-chocolate-900 dark:text-cream-100 focus:outline-none"
            >
              <optgroup label="English Fonts">
                {FONT_OPTIONS.filter((f) => f.category === 'English').map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Hindi / Devanagari Fonts">
                {FONT_OPTIONS.filter((f) => f.category === 'Hindi / Devanagari').map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Language Selector */}
          <div className="p-5 rounded-2xl bg-cream-100/90 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 space-y-3">
            <label className="text-xs font-semibold text-chocolate-800 dark:text-cream-200 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-chocolate-500" /> Language
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'en', label: 'English' },
                { id: 'hi', label: 'हिंदी' },
                { id: 'mixed', label: 'Mixed' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.id as LanguageType);
                    triggerAutosave();
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-colors ${
                    language === lang.id
                      ? 'bg-chocolate-900 text-cream-50 dark:bg-cream-100 dark:text-chocolate-950 shadow-sm'
                      : 'bg-cream-50 dark:bg-chocolate-950 text-chocolate-700 dark:text-cream-300 border border-cream-300 dark:border-chocolate-800'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category & Tags */}
          <div className="p-5 rounded-2xl bg-cream-100/90 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-chocolate-700 dark:text-cream-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  triggerAutosave();
                }}
                className="w-full px-3 py-1.5 rounded-xl bg-cream-50 dark:bg-chocolate-950 border border-cream-300 dark:border-chocolate-800 text-xs text-chocolate-800 dark:text-cream-200 focus:outline-none"
                placeholder="e.g. Reflection, Travel, Chai..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-chocolate-700 dark:text-cream-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => {
                  setTagsInput(e.target.value);
                  triggerAutosave();
                }}
                className="w-full px-3 py-1.5 rounded-xl bg-cream-50 dark:bg-chocolate-950 border border-cream-300 dark:border-chocolate-800 text-xs text-chocolate-800 dark:text-cream-200 focus:outline-none"
                placeholder="Morning, Memory, Bengaluru..."
              />
            </div>
          </div>

          {/* Status Control */}
          <div className="p-5 rounded-2xl bg-cream-100/90 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 space-y-3">
            <label className="text-xs font-semibold text-chocolate-800 dark:text-cream-200 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-chocolate-500" /> Story Privacy Status
            </label>
            <div className="space-y-2">
              {[
                { id: 'DRAFT', label: 'DRAFT — Visible only in owner editor' },
                { id: 'PUBLIC', label: 'PUBLIC — Visible to everyone on site' },
                { id: 'PRIVATE', label: 'PRIVATE — Restricted to owner only' },
              ].map((st) => (
                <label key={st.id} className="flex items-center gap-2 text-xs text-chocolate-700 dark:text-cream-300 cursor-pointer font-medium">
                  <input
                    type="radio"
                    name="story-status-option"
                    value={st.id}
                    checked={status === st.id}
                    onChange={() => {
                      setStatus(st.id as StatusType);
                      saveStory(st.id as StatusType);
                    }}
                    className="text-chocolate-900"
                  />
                  <span>{st.label}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Live Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-chocolate-950/80 backdrop-blur-md p-4 sm:p-10 flex justify-center">
          <div className="w-full max-w-3xl bg-cream-50 dark:bg-chocolate-950 rounded-3xl p-6 sm:p-10 border border-cream-300 dark:border-chocolate-800 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-cream-200 dark:bg-chocolate-800 text-chocolate-800 dark:text-cream-200 hover:scale-105 transition-transform"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-chocolate-900 text-cream-50 dark:bg-cream-100 dark:text-chocolate-950">
                Preview Mode
              </span>
              <h1 className={`text-3xl sm:text-5xl font-bold ${fontClass} text-chocolate-950 dark:text-cream-50`}>
                {title || 'Untitled Story'}
              </h1>
            </div>

            {featuredImage && (
              <img src={featuredImage} alt="Cover" className="w-full aspect-video object-cover rounded-2xl shadow-md" />
            )}

            <div
              className={`prose prose-lg max-w-none text-chocolate-950 dark:text-cream-50 ${fontClass}`}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      )}

    </div>
  );
};
