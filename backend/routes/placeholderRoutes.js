import express from 'express';
const router = express.Router();

router.get('/:width/:height', (req, res) => {
    const width = parseInt(req.params.width) || 300;
    const height = parseInt(req.params.height) || 300;

    const svg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    <rect width="100%" height="100%" fill="none" stroke="#e5e7eb" stroke-width="2"/>
    <text x="50%" y="50%" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="500" fill="#9ca3af" text-anchor="middle" dy=".3em">${width} x ${height}</text>
  </svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(svg);
});

export default router;
