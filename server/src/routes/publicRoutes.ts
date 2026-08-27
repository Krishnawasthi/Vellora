import { Router } from 'express';
import {
  getPublicStories,
  getPublicStoryBySlug,
  getPublicCategories
} from '../controllers/storyController.js';

const router = Router();

router.get('/stories', getPublicStories);
router.get('/stories/:slug', getPublicStoryBySlug);
router.get('/categories', getPublicCategories);

export default router;
