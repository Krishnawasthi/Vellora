import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { login, getMe, updateSettings } from '../controllers/authController.js';
import {
  getAdminStories,
  getAdminStoryById,
  createStory,
  updateStory,
  deleteStory,
  toggleStoryStatus
} from '../controllers/storyController.js';

const router = Router();

// Public auth login route
router.post('/login', login);

// All subsequent admin routes require authentication
router.use(requireAdmin as any);

// Admin Profile & Settings
router.get('/me', getMe as any);
router.put('/settings', updateSettings as any);

// Story CRUD Operations
router.get('/stories', getAdminStories as any);
router.get('/stories/:id', getAdminStoryById as any);
router.post('/stories', createStory as any);
router.put('/stories/:id', updateStory as any);
router.delete('/stories/:id', deleteStory as any);
router.patch('/stories/:id/status', toggleStoryStatus as any);

// Image Upload Endpoint
router.post('/upload', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    message: 'Image uploaded successfully'
  });
});

export default router;
