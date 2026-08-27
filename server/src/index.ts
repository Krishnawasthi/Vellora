import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import sitemapRoutes from './routes/sitemapRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads directory for images
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Routes
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/', sitemapRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', name: 'Vellora API', time: new Date().toISOString() });
});

// Connect DB, seed data and start server in standalone environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  connectDB().then(async () => {
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`  Vellora Server running on http://localhost:${PORT}`);
      console.log(`=======================================================`);
    });
  });
}

export default app;
