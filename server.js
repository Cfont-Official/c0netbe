import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Proxy endpoint for DuckDuckGo search
app.get('/search', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).send('Missing query');
  const ddgUrl = `https://duckduckgo.com/html/?q=site:youtube.com+\"watch?v=\"+${encodeURIComponent(q)}`;
  try {
    const r = await fetch(ddgUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ddg-proxy/1.0)' }
    });
    const html = await r.text();
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch results');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));