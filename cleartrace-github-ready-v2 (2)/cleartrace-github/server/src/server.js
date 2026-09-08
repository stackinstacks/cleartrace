import 'dotenv/config';
import express from 'express';
import { runResearch } from './pipeline.js';

const app = express();
app.use(express.json({ limit: '32kb' }));
app.use(express.static(new URL('../public', import.meta.url).pathname));

app.use((req, res, next) => {
  const origin = process.env.FRONTEND_ORIGIN;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'cleartrace-server' }));

async function researchHandler(req, res) {
  const { name, city, region, sources, depth, scope } = req.body || {};
  if (!name || typeof name !== 'string' || name.trim().length < 2) return res.status(400).json({ error: 'A name is required.' });
  try {
    const report = await runResearch({ name: name.trim(), city, region, sources, depth, scope });
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Research pipeline failed.' });
  }
}

app.post('/api/research', researchHandler);
app.post('/api/research/social', (req, res) => { req.body = { ...(req.body || {}), scope: 'social' }; return researchHandler(req, res); });

const port = Number(process.env.PORT || 8787);
app.listen(port, () => console.log(`ClearTrace server listening on port ${port}`));
