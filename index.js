const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.get('/catalog', async (req, res) => {
  try {
    const q = new URLSearchParams(req.query).toString();
    const r = await fetch(`https://catalog.roblox.com/v1/search/items?${q}`, {
      headers: { 'Accept': 'application/json' }
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/details', async (req, res) => {
  try {
    const r = await fetch('https://catalog.roblox.com/v1/catalog/items/details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/', (req, res) => res.json({ status: 'RBLX proxy running ✓' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy live on port ${PORT}`));
