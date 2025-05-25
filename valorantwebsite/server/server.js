const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Fetch MMR Details
app.get("/api/mmr", async (req, res) => {
  const { region, name, tag } = req.query;
  console.log("MMR request received with:", { region, name, tag });

  if (!region || !name || !tag) {
    console.warn("Missing required parameters for MMR");
    return res.status(400).json({ error: "Missing region, name, or tag" });
  }

  const url = `https://api.henrikdev.xyz/valorant/v2/mmr/${region}/${encodeURIComponent(
    name
  )}/${tag}`;
  console.log("Fetching MMR data from URL:", url);

  try {
    const response = await fetch(url, {
      headers: { Authorization: process.env.HENRIK_API_KEY },
    });
    console.log(`MMR API responded with status: ${response.status}`);

    const data = await response.json();
    console.log(
      "MMR data received:",
      JSON.stringify(data, null, 2).slice(0, 300) + "..."
    );
    res.status(response.status).json(data);
  } catch (error) {
    console.error("MMR Fetch Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch MMR History
app.get("/api/mmr-history", async (req, res) => {
  const { region, name, tag } = req.query;
  console.log("MMR History request received with:", { region, name, tag });

  if (!region || !name || !tag) {
    console.warn("Missing required parameters for MMR History");
    return res.status(400).json({ error: "Missing region, name, or tag" });
  }

  const url = `https://api.henrikdev.xyz/valorant/v1/mmr-history/${region}/${encodeURIComponent(
    name
  )}/${tag}`;
  console.log("Fetching MMR History from URL:", url);

  try {
    const response = await fetch(url, {
      headers: { Authorization: process.env.HENRIK_API_KEY },
    });
    console.log(`MMR History API responded with status: ${response.status}`);

    const data = await response.json();
    console.log(
      "MMR History data received:",
      JSON.stringify(data, null, 2).slice(0, 300) + "..."
    );
    res.status(response.status).json(data);
  } catch (error) {
    console.error("MMR History Fetch Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch Match List
app.get("/api/matches", async (req, res) => {
  const { region, name, tag } = req.query;
  console.log("Match List request received with:", { region, name, tag });

  if (!region || !name || !tag) {
    console.warn("Missing required parameters for Match List");
    return res.status(400).json({ error: "Missing region, name, or tag" });
  }

  const url = `https://api.henrikdev.xyz/valorant/v1/matches/${region}/${encodeURIComponent(
    name
  )}/${tag}`;
  console.log("Fetching Match List from URL:", url);

  try {
    const response = await fetch(url, {
      headers: { Authorization: process.env.HENRIK_API_KEY },
    });
    console.log(`Match List API responded with status: ${response.status}`);

    const data = await response.json();
    console.log(
      "Match List data received:",
      JSON.stringify(data, null, 2).slice(0, 300) + "..."
    );
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Match List Fetch Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch Single Match
app.get("/api/match", async (req, res) => {
  const { region, matchid } = req.query;
  console.log("Single Match request received with:", { region, matchid });

  if (!region || !matchid) {
    console.warn("Missing required parameters for Single Match");
    return res.status(400).json({ error: "Missing region or match ID" });
  }

  const url = `https://api.henrikdev.xyz/valorant/v4/match/${region}/${matchid}`;
  console.log("Fetching Match Detail from URL:", url);

  try {
    const response = await fetch(url, {
      headers: { Authorization: process.env.HENRIK_API_KEY },
    });
    console.log(`Match Detail API responded with status: ${response.status}`);

    const data = await response.json();
    console.log(
      "Match Detail data received:",
      JSON.stringify(data, null, 2).slice(0, 300) + "..."
    );
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Single Match Fetch Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ ValorantCareer API server running on port ${PORT}`);
});
