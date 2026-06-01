import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // CORS — allow your portfolio origin (or * for open access)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET /api/comments — fetch latest 100 comments
  if (req.method === 'GET') {
    try {
      const raw = await kv.lrange('guestbook', 0, 99);
      const comments = raw.map(function(c) {
        return typeof c === 'string' ? JSON.parse(c) : c;
      });
      return res.status(200).json({ comments: comments });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }
  }

  // POST /api/comments — add a new comment
  if (req.method === 'POST') {
    try {
      var name    = (req.body.name    || '').toString().trim().slice(0, 50);
      var message = (req.body.message || '').toString().trim().slice(0, 500);

      if (!name || !message) {
        return res.status(400).json({ error: 'Name and message are required' });
      }

      var comment = {
        id:      Date.now().toString(),
        name:    name,
        message: message,
        date:    new Date().toISOString().split('T')[0]
      };

      // store newest first
      await kv.lpush('guestbook', JSON.stringify(comment));

      return res.status(201).json(comment);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Failed to save comment' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
