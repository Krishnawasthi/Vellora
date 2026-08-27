import { Request, Response } from 'express';
import slugify from 'slugify';
import { Story, IStory } from '../models/Story.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

// Utility to calculate reading time in minutes
const calculateReadingTime = (content: string): number => {
  const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText.split(' ').filter(Boolean).length;
  const minutes = Math.ceil(wordCount / 200);
  return minutes > 0 ? minutes : 1;
};

// Generate unique slug
const generateUniqueSlug = async (title: string, currentId?: string): Promise<string> => {
  let baseSlug = slugify(title || 'untitled-story', { lower: true, strict: true, trim: true });
  if (!baseSlug) baseSlug = 'story-' + Date.now();
  
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const existing = await Story.findOne({ slug });
    if (!existing || (currentId && existing._id.toString() === currentId)) {
      break;
    }
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
};

// --- PUBLIC CONTROLLERS ---

export const getPublicStories = async (req: Request, res: Response) => {
  try {
    const { search, category, language, sort = 'newest', page = '1', limit = '10' } = req.query;

    const query: any = { status: 'PUBLIC' };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (language && language !== 'All') {
      query.language = language;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { excerpt: searchRegex },
        { tags: searchRegex }
      ];
    }

    const sortOption: any = sort === 'oldest' ? { publishedAt: 1, createdAt: 1 } : { publishedAt: -1, createdAt: -1 };

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [stories, total] = await Promise.all([
      Story.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .select('-content'), // Exclude full content for card list view
      Story.countDocuments(query)
    ]);

    return res.json({
      stories,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching public stories:', error);
    return res.status(500).json({ error: 'Failed to load stories' });
  }
};

export const getPublicStoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const story = await Story.findOne({ slug, status: 'PUBLIC' });

    if (!story) {
      return res.status(404).json({ error: 'Story not found or is private.' });
    }

    return res.json({ story });
  } catch (error) {
    return res.status(500).json({ error: 'Error loading story details' });
  }
};

export const getPublicCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Story.distinct('category', { status: 'PUBLIC' });
    return res.json({ categories: categories.filter(Boolean) });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load categories' });
  }
};


// --- ADMIN CONTROLLERS ---

export const getAdminStories = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search, status, language, sort = 'newest' } = req.query;

    const query: any = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (language && language !== 'ALL') {
      query.language = language;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { excerpt: searchRegex }];
    }

    const sortOption: any = sort === 'oldest' ? { createdAt: 1 } : { updatedAt: -1 };

    const stories = await Story.find(query).sort(sortOption);

    // Also return aggregate dashboard metrics
    const [totalCount, publishedCount, draftCount, privateCount] = await Promise.all([
      Story.countDocuments({}),
      Story.countDocuments({ status: 'PUBLIC' }),
      Story.countDocuments({ status: 'DRAFT' }),
      Story.countDocuments({ status: 'PRIVATE' })
    ]);

    return res.json({
      stories,
      stats: {
        total: totalCount,
        published: publishedCount,
        drafts: draftCount,
        private: privateCount
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load admin stories' });
  }
};

export const getAdminStoryById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    return res.json({ story });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching story' });
  }
};

export const createStory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      title,
      slug: customSlug,
      excerpt,
      content,
      featuredImage,
      images,
      language,
      fontFamily,
      category,
      tags,
      status
    } = req.body;

    const slug = customSlug
      ? await generateUniqueSlug(customSlug)
      : await generateUniqueSlug(title || 'untitled-story');

    const readingTime = calculateReadingTime(content || '');

    const publishedAt = status === 'PUBLIC' ? new Date() : undefined;

    const newStory = new Story({
      title: title || 'Untitled Story',
      slug,
      excerpt: excerpt || '',
      content: content || '',
      featuredImage: featuredImage || '',
      images: images || [],
      language: language || 'en',
      fontFamily: fontFamily || 'georgia',
      category: category || 'General',
      tags: tags || [],
      status: status || 'DRAFT',
      readingTime,
      publishedAt
    });

    await newStory.save();
    return res.status(201).json({ story: newStory, message: 'Story created successfully' });
  } catch (error: any) {
    console.error('Error creating story:', error);
    return res.status(500).json({ error: error.message || 'Failed to create story' });
  }
};

export const updateStory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug: customSlug,
      excerpt,
      content,
      featuredImage,
      images,
      language,
      fontFamily,
      category,
      tags,
      status
    } = req.body;

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (title !== undefined) story.title = title;
    
    if (customSlug && customSlug !== story.slug) {
      story.slug = await generateUniqueSlug(customSlug, id);
    } else if (title && !story.slug) {
      story.slug = await generateUniqueSlug(title, id);
    }

    if (excerpt !== undefined) story.excerpt = excerpt;
    if (content !== undefined) {
      story.content = content;
      story.readingTime = calculateReadingTime(content);
    }
    if (featuredImage !== undefined) story.featuredImage = featuredImage;
    if (images !== undefined) story.images = images;
    if (language !== undefined) story.language = language;
    if (fontFamily !== undefined) story.fontFamily = fontFamily;
    if (category !== undefined) story.category = category;
    if (tags !== undefined) story.tags = tags;

    if (status !== undefined && status !== story.status) {
      story.status = status;
      if (status === 'PUBLIC' && !story.publishedAt) {
        story.publishedAt = new Date();
      }
    }

    await story.save();
    return res.json({ story, message: 'Story updated successfully' });
  } catch (error: any) {
    console.error('Error updating story:', error);
    return res.status(500).json({ error: 'Failed to update story' });
  }
};

export const deleteStory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const story = await Story.findByIdAndDelete(id);

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    return res.json({ message: 'Story deleted successfully', id });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete story' });
  }
};

export const toggleStoryStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'DRAFT' | 'PUBLIC' | 'PRIVATE'

    if (!['DRAFT', 'PUBLIC', 'PRIVATE'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    story.status = status;
    if (status === 'PUBLIC' && !story.publishedAt) {
      story.publishedAt = new Date();
    }

    await story.save();
    return res.json({ story, message: `Story status changed to ${status}` });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update story status' });
  }
};
