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

let isConnected = false;
async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return true;
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
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

// In-Memory Seed Fallback Stories
const memoryStories = [
  {
    _id: '1',
    title: 'The Solitude of Rainy Afternoons',
    slug: 'the-solitude-of-rainy-afternoons',
    excerpt: 'There is a quiet rhythm to rainfall against windowpanes that invites reflection...',
    content: '<p>There is a quiet rhythm to rainfall against windowpanes that invites reflection and stillness in a noisy world.</p>',
    featuredImage: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80',
    language: 'en',
    fontFamily: 'georgia',
    category: 'Reflections',
    tags: ['rain', 'solitude', 'life'],
    status: 'PUBLIC',
    readingTime: 3,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    title: 'पुरानी किताबों की महक',
    slug: 'purani-kitabon-ki-mahak',
    excerpt: 'कागज़ की सुगंध में बीते हुए ज़माने की यादें छुपी होती हैं...',
    content: '<p>कागज़ की सुगंध में बीते हुए ज़माने की यादें छुपी होती हैं, जो हमें अतीत की पगडंडियों पर ले जाती हैं।</p>',
    featuredImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    language: 'hi',
    fontFamily: 'rozha',
    category: 'यादें',
    tags: ['किताबें', 'हिंदी', 'अतीत'],
    status: 'PUBLIC',
    readingTime: 4,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

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
      return res.json({ stories });
    } catch (err) {
      console.error('DB fetch error:', err.message);
    }
  }
  return res.json({ stories: memoryStories });
});

// --- SINGLE STORY DETAIL ---
app.get(['/api/stories/:slug', '/stories/:slug'], async (req, res) => {
  const dbOk = await connectDB();
  if (dbOk) {
    try {
      const story = await Story.findOne({ slug: req.params.slug, status: 'PUBLIC' });
      if (story) return res.json(story);
    } catch (err) {
      console.error('DB findOne error:', err.message);
    }
  }
  const found = memoryStories.find(s => s.slug === req.params.slug);
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

// --- ADMIN STORIES ---
app.get(['/api/admin/stories', '/admin/stories'], authMiddleware, async (req, res) => {
  const dbOk = await connectDB();
  if (dbOk) {
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
      
      return res.json({ stories, stats: { total, published, drafts, private: privateCount } });
    } catch (err) {
      console.error('Admin stories error:', err.message);
    }
  }
  return res.json({ stories: memoryStories, stats: { total: memoryStories.length, published: memoryStories.length, drafts: 0, private: 0 } });
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
