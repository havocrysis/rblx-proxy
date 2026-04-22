const express = require("express");
const app = express();
app.use(express.json());
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.sendStatus(200); return; }
  next();
});

async function getXsrfToken() {
  var r = await fetch("https://auth.roblox.com/v2/logout", { method: "POST", headers: { "Content-Type": "application/json" } });
  return r.headers.get("x-csrf-token") || "";
}

app.get("/catalog", async function(req, res) {
  try {
    var q = new URLSearchParams(req.query).toString();
    var r = await fetch("https://catalog.roblox.com/v1/search/items?" + q);
    var data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/details", async function(req, res) {
  try {
    var token = await getXsrfToken();
    var r = await fetch("https://catalog.roblox.com/v1/catalog/items/details", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": token },
      body: JSON.stringify(req.body)
    });
    var data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/testdetails", async function(req, res) {
  try {
    var token = await getXsrfToken();
    var payload = {items:[{itemType:"Asset",id:6984763785}]};
    var r = await fetch("https://catalog.roblox.com/v1/catalog/items/details", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": token },
      body: JSON.stringify(payload)
    });
    var data = await r.json();
    res.json({ status: r.status, token: token ? "got it" : "none", data: data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/", function(req, res) {
  res.json({ status: "running" });
});
var PORT = process.env.PORT || 3000;
app.listen(PORT);
