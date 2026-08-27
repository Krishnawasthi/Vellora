import { Router, Request, Response } from 'express';
import { Story } from '../models/Story.js';

const router = Router();

router.get('/sitemap.xml', async (req: Request, res: Response) => {
  try {
    const stories = await Story.find({ status: 'PUBLIC' }).select('slug updatedAt publishedAt');

    const baseUrl = req.protocol + '://' + req.get('host');

    const urls = stories.map((story) => {
      const lastMod = (story.updatedAt || story.publishedAt || new Date()).toISOString();
      return `
        <url>
          <loc>${baseUrl}/story/${story.slug}</loc>
          <lastmod>${lastMod}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `;
    }).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>${baseUrl}/</loc>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
        <url>
          <loc>${baseUrl}/stories</loc>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>
        <url>
          <loc>${baseUrl}/about</loc>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
        </url>
        ${urls}
      </urlset>
    `;

    res.header('Content-Type', 'application/xml');
    return res.send(xml.trim());
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return res.status(500).send('Error generating sitemap');
  }
});

export default router;
