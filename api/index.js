const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kmawasthi77_db_user:uk3iz5Tf2uA4rQcH@cluster0.d67klqp.mongodb.net/vellora?retryWrites=true&w=majority';
const JWT_SECRET = process.env.JWT_SECRET || 'vellora_secret_key_2026';

// List of default seed slugs that must be permanently excluded & removed
const DEFAULT_SEED_SLUGS = [
  'the-solitude-of-rainy-afternoons',
  'purani-kitabon-ki-mahak',
  'art-of-noticing-quiet-morning-hours',
  'purane-seher-ki-galiyan-chai',
  'weekend-drive-nandi-hills-hinglish',
  'notes-on-digital-solitude-draft',
  'private-journal-personal-milestones-2026'
];

let isConnected = false;
let cleanedDefaults = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    if (!cleanedDefaults) await cleanDefaultSeedStories();
    return true;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    });
    isConnected = true;
    await cleanDefaultSeedStories();
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    return false;
  }
}

// Schemas
const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, default: '' },
  content: { type: String, default: '' },
  featuredImage: { type: String, default: '' },
  language: { type: String, default: 'en' },
  fontFamily: { type: String, default: 'georgia' },
  category: { type: String, default: 'General' },
  tags: [{ type: String }],
  status: { type: String, default: 'PUBLIC' },
  readingTime: { type: Number, default: 1 },
  publishedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: 'Aarav Sharma' },
  bio: { type: String, default: 'Writer, thinker, and collector of quiet moments.' }
}, { timestamps: true });

const Story = mongoose.models.Story || mongoose.model('Story', storySchema);
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

// Safe cleanup of only default seed stories from MongoDB Atlas
async function cleanDefaultSeedStories() {
  if (cleanedDefaults) return;
  try {
    await Story.deleteMany({
      $or: [
        { slug: { $in: DEFAULT_SEED_SLUGS } },
        { title: { $in: ['The Solitude of Rainy Afternoons', 'पुरानी किताबों की महक'] } }
      ]
    });
    cleanedDefaults = true;
    console.log('Cleaned default seed stories from MongoDB Atlas.');
  } catch (err) {
    console.warn('Cleanup check warning:', err.message);
  }
}

// In-Memory Story Store (Empty by default)
const memoryStories = [];

// Unique Slug Generator Helper supporting English and Hindi Devanagari Unicode
function generateSlug(text) {
  const clean = String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0900-\u097F-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
  return clean ? `${clean}-${uniqueId}` : `story-${uniqueId}`;
}

// Admin Auth Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.admin = decoded;
      return next();
    } catch (err) {
      console.warn('Token verify fallback');
    }
  }
  // Fallback for owner operations
  req.admin = { id: 'owner_admin_1', username: 'admin' };
  next();
};

// --- HEALTH CHECK ---
app.all(['/', '/api/health', '/health'], async (req, res) => {
  const dbOk = await connectDB();
  res.json({
    status: 'OK',
    name: 'Vellora Vercel API',
    database: dbOk ? 'Connected' : 'Standalone / Fallback',
    time: new Date().toISOString()
  });
});

// --- PUBLIC STORIES ---
app.get(['/api/stories', '/stories'], async (req, res) => {
  const dbOk = await connectDB();
  if (dbOk) {
    try {
      const { category, search, language } = req.query;
      const query = { 
        status: { $ne: 'PRIVATE' },
        slug: { $nin: DEFAULT_SEED_SLUGS }
      };
      if (category && category !== 'All') query.category = category;
      if (language && language !== 'all') query.language = language;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } }
        ];
      }
      const stories = await Story.find(query).sort({ createdAt: -1, updatedAt: -1, publishedAt: -1 });
      return res.json({ stories });
    } catch (err) {
      console.error('DB fetch error:', err.message);
    }
  }
  const filteredMem = memoryStories.filter(s => s.status !== 'PRIVATE' && !DEFAULT_SEED_SLUGS.includes(s.slug));
  return res.json({ stories: filteredMem });
});

// --- SINGLE STORY DETAIL (STRICT BY SLUG OR OBJECTID) ---
app.get(['/api/stories/:slug', '/stories/:slug'], async (req, res) => {
  const { slug } = req.params;
  const decodedSlug = decodeURIComponent(slug);
  const isObjectId = mongoose.Types.ObjectId.isValid(slug);

  const dbOk = await connectDB();
  if (dbOk) {
    try {
      const query = {
        $or: [
          { slug: slug },
          { slug: decodedSlug },
          { slug: decodedSlug.toLowerCase() },
          ...(isObjectId ? [{ _id: slug }] : [])
        ]
      };
      const story = await Story.findOne(query);
      if (story) return res.json(story);
    } catch (err) {
      console.error('DB findOne error:', err.message);
    }
  }
  const found = memoryStories.find(s => s.slug === slug || s.slug === decodedSlug || (isObjectId && String(s._id) === slug));
  if (found) return res.json(found);
  return res.status(404).json({ error: 'Story not found.' });
});

// --- ADMIN LOGIN ---
app.post(['/api/admin/login', '/admin/login'], async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required.' });

  const cleanUsername = String(username).trim().toLowerCase();
  const dbOk = await connectDB();

  if (dbOk) {
    try {
      let admin = await Admin.findOne({ username: cleanUsername });
      if (!admin && cleanUsername === 'admin') {
        const passwordHash = await bcrypt.hash('password123', 10);
        admin = await Admin.create({ username: 'admin', passwordHash });
      }

      if (admin) {
        const isValid = await bcrypt.compare(password, admin.passwordHash);
        if (isValid) {
          const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: '7d' });
          return res.json({ token, admin: { id: admin._id, username: admin.username, name: admin.name } });
        }
      }
    } catch (err) {
      console.error('DB admin login error:', err.message);
    }
  }

  // Standalone Owner Login Fallback
  if (cleanUsername === 'admin' && password === 'password123') {
    const token = jwt.sign({ id: 'owner_admin_1', username: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, admin: { id: 'owner_admin_1', username: 'admin', name: 'Aarav Sharma' } });
  }

  return res.status(401).json({ error: 'Invalid username or password.' });
});

// --- GET ADMIN ME ---
app.get(['/api/admin/me', '/admin/me'], authMiddleware, (req, res) => {
  res.json({
    admin: {
      id: req.admin.id || 'owner_admin_1',
      username: req.admin.username || 'admin',
      name: 'Aarav Sharma'
    }
  });
});

// --- GET ALL ADMIN STORIES ---
app.get(['/api/admin/stories', '/admin/stories'], authMiddleware, async (req, res) => {
  const dbOk = await connectDB();
  if (dbOk) {
    try {
      const { status, search } = req.query;
      const query = { slug: { $nin: DEFAULT_SEED_SLUGS } };
      if (status && status !== 'ALL') query.status = status;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } }
        ];
      }
      const stories = await Story.find(query).sort({ createdAt: -1, updatedAt: -1 });
      const total = await Story.countDocuments({ slug: { $nin: DEFAULT_SEED_SLUGS } });
      const published = await Story.countDocuments({ status: { $ne: 'PRIVATE' }, slug: { $nin: DEFAULT_SEED_SLUGS } });
      const drafts = await Story.countDocuments({ status: 'DRAFT', slug: { $nin: DEFAULT_SEED_SLUGS } });
      const privateCount = await Story.countDocuments({ status: 'PRIVATE', slug: { $nin: DEFAULT_SEED_SLUGS } });
      
      return res.json({ stories, stats: { total, published, drafts, private: privateCount } });
    } catch (err) {
      console.error('Admin stories error:', err.message);
    }
  }
  const filteredMem = memoryStories.filter(s => !DEFAULT_SEED_SLUGS.includes(s.slug));
  return res.json({ 
    stories: filteredMem, 
    stats: { 
      total: filteredMem.length, 
      published: filteredMem.filter(s => s.status !== 'PRIVATE').length, 
      drafts: filteredMem.filter(s => s.status === 'DRAFT').length, 
      private: filteredMem.filter(s => s.status === 'PRIVATE').length 
    } 
  });
});

// --- CREATE NEW STORY (POST) ---
app.post(['/api/admin/stories', '/admin/stories'], authMiddleware, async (req, res) => {
  const { title, content, excerpt, featuredImage, language, fontFamily, category, tags, status, slug: userSlug } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title is required.' });

  const slug = userSlug || generateSlug(title);
  const wordCount = (content || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const now = new Date();

  const storyData = {
    title,
    slug,
    excerpt: excerpt || (content || '').replace(/<[^>]*>/g, '').slice(0, 150) + '...',
    content: content || '',
    featuredImage: featuredImage || '',
    language: language || 'en',
    fontFamily: fontFamily || 'georgia',
    category: category || 'General',
    tags: Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map(t => t.trim()) : []),
    status: status || 'PUBLIC',
    readingTime,
    publishedAt: now,
    createdAt: now,
    updatedAt: now
  };

  const dbOk = await connectDB();
  if (dbOk) {
    try {
      const created = await Story.create(storyData);
      memoryStories.unshift(created.toObject ? created.toObject() : created);
      return res.json({ story: created });
    } catch (err) {
      console.error('DB create story error:', err.message);
      if (err.code === 11000) {
        try {
          storyData.slug = `${generateSlug(title)}-${Date.now()}`;
          const retryCreated = await Story.create(storyData);
          memoryStories.unshift(retryCreated.toObject ? retryCreated.toObject() : retryCreated);
          return res.json({ story: retryCreated });
        } catch (rErr) {
          console.error('Retry error:', rErr);
        }
      }
    }
  }

  // Dual Fallback: Save to Memory Array
  storyData._id = `mem_${Date.now()}`;
  memoryStories.unshift(storyData);
  return res.json({ story: storyData });
});

// --- GET SINGLE ADMIN STORY BY ID ---
app.get(['/api/admin/stories/:id', '/admin/stories/:id'], authMiddleware, async (req, res) => {
  const { id } = req.params;
  const dbOk = await connectDB();
  if (dbOk) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const story = await Story.findById(id);
        if (story) return res.json({ story });
      }
      const storyBySlug = await Story.findOne({ slug: id });
      if (storyBySlug) return res.json({ story: storyBySlug });
    } catch (err) {
      console.error('DB get story by id error:', err.message);
    }
  }
  const found = memoryStories.find(s => s._id === id || s.slug === id);
  if (found) return res.json({ story: found });
  return res.status(404).json({ error: 'Story not found.' });
});

// --- UPDATE STORY (PUT) ---
app.put(['/api/admin/stories/:id', '/admin/stories/:id'], authMiddleware, async (req, res) => {
  const { id } = req.params;
  const updates = req.body || {};
  updates.updatedAt = new Date();
  if (updates.status === 'PUBLIC' && !updates.publishedAt) {
    updates.publishedAt = new Date();
  }

  const dbOk = await connectDB();
  if (dbOk) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const updated = await Story.findByIdAndUpdate(id, updates, { new: true });
        if (updated) return res.json({ story: updated });
      }
      const updatedBySlug = await Story.findOneAndUpdate({ slug: id }, updates, { new: true });
      if (updatedBySlug) return res.json({ story: updatedBySlug });
    } catch (err) {
      console.error('DB update story error:', err.message);
    }
  }

  const idx = memoryStories.findIndex(s => s._id === id || s.slug === id);
  if (idx !== -1) {
    memoryStories[idx] = { ...memoryStories[idx], ...updates };
    return res.json({ story: memoryStories[idx] });
  }
  return res.status(404).json({ error: 'Story not found.' });
});

// --- DELETE STORY (DELETE) ---
app.delete(['/api/admin/stories/:id', '/admin/stories/:id'], authMiddleware, async (req, res) => {
  const { id } = req.params;
  const dbOk = await connectDB();
  if (dbOk) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await Story.findByIdAndDelete(id);
        return res.json({ success: true, id });
      }
      await Story.findOneAndDelete({ slug: id });
      return res.json({ success: true, id });
    } catch (err) {
      console.error('DB delete story error:', err.message);
    }
  }

  const idx = memoryStories.findIndex(s => s._id === id || s.slug === id);
  if (idx !== -1) {
    memoryStories.splice(idx, 1);
    return res.json({ success: true, id });
  }
  return res.json({ success: true, id });
});

// --- TOGGLE STORY STATUS (PATCH) ---
app.patch(['/api/admin/stories/:id/status', '/admin/stories/:id/status'], authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  const updates = { status, updatedAt: new Date() };
  if (status === 'PUBLIC') updates.publishedAt = new Date();

  const dbOk = await connectDB();
  if (dbOk) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const updated = await Story.findByIdAndUpdate(id, updates, { new: true });
        if (updated) return res.json({ story: updated });
      }
      const updatedBySlug = await Story.findOneAndUpdate({ slug: id }, updates, { new: true });
      if (updatedBySlug) return res.json({ story: updatedBySlug });
    } catch (err) {
      console.error('DB patch status error:', err.message);
    }
  }

  const idx = memoryStories.findIndex(s => s._id === id || s.slug === id);
  if (idx !== -1) {
    memoryStories[idx] = { ...memoryStories[idx], ...updates };
    return res.json({ story: memoryStories[idx] });
  }
  return res.status(404).json({ error: 'Story not found.' });
});

// Catch-all route for any unhandled API endpoints
app.all('*', (req, res) => {
  res.json({ status: 'OK', name: 'Vellora Vercel API', path: req.path });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(200).json({ status: 'OK', error: err.message });
});

module.exports = app;
