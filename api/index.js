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

// Serverless Mongoose Singleton Connection Cache
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log('MongoDB Atlas Connected Successfully');
      return m;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB Atlas Connection Error:', e.message);
    throw e;
  }
  return cached.conn;
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

// Slug Generator Helper
function generateSlug(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || `story-${Date.now()}`;
}

// Admin Auth Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// --- HEALTH CHECK ---
app.all(['/', '/api/health', '/health'], async (req, res) => {
  try {
    await connectDB();
    res.json({
      status: 'OK',
      name: 'Vellora Vercel API',
      database: 'Connected to MongoDB Atlas',
      time: new Date().toISOString()
    });
  } catch (err) {
    res.json({
      status: 'OK',
      name: 'Vellora Vercel API',
      database: 'Connection Error',
      error: err.message
    });
  }
});

// --- PUBLIC STORIES (STRICT REAL-TIME MONGODB ATLAS QUERY) ---
app.get(['/api/stories', '/stories'], async (req, res) => {
  try {
    await connectDB();
    const { category, search, language } = req.query;
    const query = { status: { $ne: 'PRIVATE' } };
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
    console.error('Error fetching public stories:', err.message);
    return res.status(500).json({ error: 'Failed to fetch stories from database.', details: err.message });
  }
});

// --- SINGLE STORY DETAIL ---
app.get(['/api/stories/:slug', '/stories/:slug'], async (req, res) => {
  try {
    await connectDB();
    const story = await Story.findOne({ slug: req.params.slug });
    if (story) return res.json(story);
    return res.status(404).json({ error: 'Story not found.' });
  } catch (err) {
    console.error('Error fetching story detail:', err.message);
    return res.status(500).json({ error: 'Failed to fetch story from database.' });
  }
});

// --- ADMIN LOGIN ---
app.post(['/api/admin/login', '/admin/login'], async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required.' });

  const cleanUsername = String(username).trim().toLowerCase();

  try {
    await connectDB();
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
    return res.status(401).json({ error: 'Invalid username or password.' });
  } catch (err) {
    console.error('Admin login error:', err.message);
    // Standalone Fallback if DB fails
    if (cleanUsername === 'admin' && password === 'password123') {
      const token = jwt.sign({ id: 'owner_admin_1', username: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, admin: { id: 'owner_admin_1', username: 'admin', name: 'Aarav Sharma' } });
    }
    return res.status(500).json({ error: 'Login failed.' });
  }
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
  try {
    await connectDB();
    const { status, search } = req.query;
    const query = {};
    if (status && status !== 'ALL') query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }
    const stories = await Story.find(query).sort({ createdAt: -1, updatedAt: -1 });
    const total = await Story.countDocuments();
    const published = await Story.countDocuments({ status: { $ne: 'PRIVATE' } });
    const drafts = await Story.countDocuments({ status: 'DRAFT' });
    const privateCount = await Story.countDocuments({ status: 'PRIVATE' });
    
    return res.json({ stories, stats: { total, published, drafts, private: privateCount } });
  } catch (err) {
    console.error('Error fetching admin stories:', err.message);
    return res.status(500).json({ error: 'Failed to fetch admin stories.' });
  }
});

// --- CREATE NEW STORY (POST) ---
app.post(['/api/admin/stories', '/admin/stories'], authMiddleware, async (req, res) => {
  const { title, content, excerpt, featuredImage, language, fontFamily, category, tags, status } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title is required.' });

  const slug = generateSlug(title);
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

  try {
    await connectDB();
    const created = await Story.create(storyData);
    return res.json({ story: created });
  } catch (err) {
    console.error('Error creating story in MongoDB:', err.message);
    return res.status(500).json({ error: 'Failed to save story to MongoDB Atlas.', details: err.message });
  }
});

// --- GET SINGLE ADMIN STORY BY ID ---
app.get(['/api/admin/stories/:id', '/admin/stories/:id'], authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await connectDB();
    if (mongoose.Types.ObjectId.isValid(id)) {
      const story = await Story.findById(id);
      if (story) return res.json({ story });
    }
    const storyBySlug = await Story.findOne({ slug: id });
    if (storyBySlug) return res.json({ story: storyBySlug });
    return res.status(404).json({ error: 'Story not found.' });
  } catch (err) {
    console.error('Error fetching story by ID:', err.message);
    return res.status(500).json({ error: 'Database error.' });
  }
});

// --- UPDATE STORY (PUT) ---
app.put(['/api/admin/stories/:id', '/admin/stories/:id'], authMiddleware, async (req, res) => {
  const { id } = req.params;
  const updates = req.body || {};
  if (updates.title && !updates.slug) {
    updates.slug = generateSlug(updates.title);
  }
  updates.updatedAt = new Date();
  if (updates.status === 'PUBLIC' && !updates.publishedAt) {
    updates.publishedAt = new Date();
  }

  try {
    await connectDB();
    if (mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Story.findByIdAndUpdate(id, updates, { new: true });
      if (updated) return res.json({ story: updated });
    }
    const updatedBySlug = await Story.findOneAndUpdate({ slug: id }, updates, { new: true });
    if (updatedBySlug) return res.json({ story: updatedBySlug });
    return res.status(404).json({ error: 'Story not found.' });
  } catch (err) {
    console.error('Error updating story:', err.message);
    return res.status(500).json({ error: 'Failed to update story in database.' });
  }
});

// --- DELETE STORY (DELETE) ---
app.delete(['/api/admin/stories/:id', '/admin/stories/:id'], authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await connectDB();
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Story.findByIdAndDelete(id);
    } else {
      await Story.findOneAndDelete({ slug: id });
    }
    return res.json({ success: true, id });
  } catch (err) {
    console.error('Error deleting story:', err.message);
    return res.status(500).json({ error: 'Failed to delete story.' });
  }
});

// --- TOGGLE STORY STATUS (PATCH) ---
app.patch(['/api/admin/stories/:id/status', '/admin/stories/:id/status'], authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  const updates = { status, updatedAt: new Date() };
  if (status === 'PUBLIC') updates.publishedAt = new Date();

  try {
    await connectDB();
    if (mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Story.findByIdAndUpdate(id, updates, { new: true });
      if (updated) return res.json({ story: updated });
    }
    const updatedBySlug = await Story.findOneAndUpdate({ slug: id }, updates, { new: true });
    if (updatedBySlug) return res.json({ story: updatedBySlug });
    return res.status(404).json({ error: 'Story not found.' });
  } catch (err) {
    console.error('Error patching story status:', err.message);
    return res.status(500).json({ error: 'Failed to patch story status.' });
  }
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
