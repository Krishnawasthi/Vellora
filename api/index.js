const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create Express App
const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Mongoose Connection Helper
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:password123@cluster0.mongodb.net/vellora?retryWrites=true&w=majority';
const JWT_SECRET = process.env.JWT_SECRET || 'vellora_secret_key_2026';

let isConnected = false;
async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return true;
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    return false;
  }
}

// Middleware to ensure DB connection before processing requests
app.use(async (req, res, next) => {
  if (req.path === '/api/health') return next();
  const connected = await connectDB();
  if (!connected && mongoose.connection.readyState !== 1) {
    return res.status(500).json({
      error: 'Database connection failed. Please check MONGODB_URI and ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0).'
    });
  }
  next();
});

// Schemas
const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, default: '' },
  content: { type: String, default: '' },
  featuredImage: { type: String, default: '' },
  language: { type: String, enum: ['en', 'hi', 'mixed'], default: 'en' },
  fontFamily: { type: String, default: 'georgia' },
  category: { type: String, default: 'General' },
  tags: [{ type: String }],
  status: { type: String, enum: ['DRAFT', 'PUBLIC', 'PRIVATE'], default: 'DRAFT' },
  readingTime: { type: Number, default: 1 },
  publishedAt: { type: Date }
}, { timestamps: true });

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: 'Aarav Sharma' },
  bio: { type: String, default: 'Writer, thinker, and collector of quiet moments.' }
}, { timestamps: true });

const Story = mongoose.models.Story || mongoose.model('Story', storySchema);
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

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

// --- PUBLIC ROUTES ---
app.get('/api/health', async (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ status: 'OK', name: 'Vellora Vercel API', dbState, time: new Date().toISOString() });
});

app.get('/api/stories', async (req, res) => {
  try {
    const { category, search, language } = req.query;
    const query = { status: 'PUBLIC' };
    if (category && category !== 'All') query.category = category;
    if (language && language !== 'all') query.language = language;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }
    const stories = await Story.find(query).sort({ publishedAt: -1, createdAt: -1 });
    res.json({ stories });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stories.' });
  }
});

app.get('/api/stories/:slug', async (req, res) => {
  try {
    const story = await Story.findOne({ slug: req.params.slug, status: 'PUBLIC' });
    if (!story) return res.status(404).json({ error: 'Story not found.' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch story.' });
  }
});

// --- ADMIN ROUTES ---
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password are required.' });
    
    let admin = await Admin.findOne({ username: username.trim().toLowerCase() });
    if (!admin && username === 'admin') {
      const passwordHash = await bcrypt.hash('password123', 10);
      admin = await Admin.create({ username: 'admin', passwordHash });
    }

    if (!admin) return res.status(401).json({ error: 'Invalid credentials.' });

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials.' });

    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, admin: { id: admin._id, username: admin.username, name: admin.name } });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Login failed.' });
  }
});

app.get('/api/admin/stories', authMiddleware, async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};
    if (status && status !== 'ALL') query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }
    const stories = await Story.find(query).sort({ updatedAt: -1 });
    const total = await Story.countDocuments();
    const published = await Story.countDocuments({ status: 'PUBLIC' });
    const drafts = await Story.countDocuments({ status: 'DRAFT' });
    const privateCount = await Story.countDocuments({ status: 'PRIVATE' });
    
    res.json({ stories, stats: { total, published, drafts, private: privateCount } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin stories.' });
  }
});

app.get('/api/admin/stories/:id', authMiddleware, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ error: 'Story not found.' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch story.' });
  }
});

app.post('/api/admin/stories', authMiddleware, async (req, res) => {
  try {
    const data = req.body;
    let baseSlug = (data.title || 'untitled-story').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'story';
    let slug = baseSlug;
    let count = 1;
    while (await Story.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }
    data.slug = slug;
    if (data.status === 'PUBLIC' && !data.publishedAt) data.publishedAt = new Date();
    const story = await Story.create(data);
    res.status(201).json(story);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create story.' });
  }
});

app.put('/api/admin/stories/:id', authMiddleware, async (req, res) => {
  try {
    const data = req.body;
    if (data.status === 'PUBLIC') {
      const existing = await Story.findById(req.params.id);
      if (existing && !existing.publishedAt) data.publishedAt = new Date();
    }
    const story = await Story.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update story.' });
  }
});

app.delete('/api/admin/stories/:id', authMiddleware, async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.json({ message: 'Story deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete story.' });
  }
});

app.patch('/api/admin/stories/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const updateData = { status };
    if (status === 'PUBLIC') updateData.publishedAt = new Date();
    const story = await Story.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update story status.' });
  }
});

module.exports = app;
