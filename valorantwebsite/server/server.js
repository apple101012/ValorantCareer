const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Fetch MMR Details
app.get("/api/mmr", async (req, res) => {
  const { region, name, tag } = req.query;
  console.log("MMR request received with:", { region, name, tag });

  if (!region || !name || !tag) {
    return res.status(400).json({ error: "Missing region, name, or tag" });
  }

  const url = `https://api.henrikdev.xyz/valorant/v2/mmr/${region}/${encodeURIComponent(
    name
  )}/${tag}`;
  try {
    const response = await fetch(url, {
      headers: { Authorization: process.env.HENRIK_API_KEY },
    });

    if (response.status === 429) {
      return res.status(429).json({
        error: "Rate limit exceeded. Please try again in about 1 minute.",
      });
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch MMR History
app.get("/api/mmr-history", async (req, res) => {
  const { region, name, tag } = req.query;
  console.log("MMR History request received with:", { region, name, tag });

  if (!region || !name || !tag) {
    return res.status(400).json({ error: "Missing region, name, or tag" });
  }

  const url = `https://api.henrikdev.xyz/valorant/v1/mmr-history/${region}/${encodeURIComponent(
    name
  )}/${tag}`;
  try {
    const response = await fetch(url, {
      headers: { Authorization: process.env.HENRIK_API_KEY },
    });

    if (response.status === 429) {
      return res.status(429).json({
        error: "Rate limit exceeded. Please try again in about 1 minute.",
      });
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch Match List
app.get("/api/matches", async (req, res) => {
  const { region, name, tag } = req.query;
  console.log("Match List request received with:", { region, name, tag });

  if (!region || !name || !tag) {
    return res.status(400).json({ error: "Missing region, name, or tag" });
  }

  const url = `https://api.henrikdev.xyz/valorant/v1/matches/${region}/${encodeURIComponent(
    name
  )}/${tag}`;
  try {
    const response = await fetch(url, {
      headers: { Authorization: process.env.HENRIK_API_KEY },
    });

    if (response.status === 429) {
      return res.status(429).json({
        error: "Rate limit exceeded. Please try again in about 1 minute.",
      });
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch Single Match
app.get("/api/match", async (req, res) => {
  const { region, matchid } = req.query;
  console.log("Single Match request received with:", { region, matchid });

  if (!region || !matchid) {
    return res.status(400).json({ error: "Missing region or match ID" });
  }

  const url = `https://api.henrikdev.xyz/valorant/v4/match/${region}/${matchid}`;
  try {
    const response = await fetch(url, {
      headers: { Authorization: process.env.HENRIK_API_KEY },
    });

    if (response.status === 429) {
      return res.status(429).json({
        error: "Rate limit exceeded. Please try again in about 1 minute.",
      });
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ ValorantCareer API server running on port ${PORT}`);
});
