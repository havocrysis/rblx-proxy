const express = require(‘express’);
const app = express();

app.use(express.json());

app.use(function(req, res, next) {
res.header(‘Access-Control-Allow-Origin’, ‘*’);
res.header(‘Access-Control-Allow-Methods’, ‘GET, POST, OPTIONS’);
res.header(‘Access-Control-Allow-Headers’, ‘Content-Type’);
if (req.method === ‘OPTIONS’) return res.sendStatus(200);
next();
});

app.get(’/test’, async function(req, res) {
try {
var url = ‘https://catalog.roblox.com/v1/search/items?category=Clothing&subcategory=ClassicShirts&sortType=3&sortAggregation=1&limit=10’;
var r = await fetch(url);
var data = await r.json();
res.json({ itemCount: data.data ? data.data.length : 0, raw: data });
} catch (e) {
res.status(500).json({ error: e.message });
}
});

app.get(’/catalog’, async function(req, res) {
try {
var q = new URLSearchParams(req.query).toString();
var r = await fetch(‘https://catalog.roblox.com/v1/search/items?’ + q);
var data = await r.json();
res.json(data);
} catch (e) {
res.status(500).json({ error: e.message });
}
});

app.post(’/details’, async function(req, res) {
try {
var r = await fetch(‘https://catalog.roblox.com/v1/catalog/items/details’, {
method: ‘POST’,
headers: { ‘Content-Type’: ‘application/json’ },
body: JSON.stringify(req.body)
});
var data = await r.json();
res.json(data);
} catch (e) {
res.status(500).json({ error: e.message });
}
});

app.get(’/’, function(req, res) {
res.json({ status: ‘RBLX proxy running’ });
});

var PORT = process.env.PORT || 3000;
app.listen(PORT);
