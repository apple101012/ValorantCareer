const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = 5000;

app.get("/api/mmr", async (req, res) => {
  const { region, name, tag } = req.query;

  try {
    const response = await axios.get(
      `https://api.henrikdev.xyz/valorant/v2/mmr/${region}/${name}/${tag}`,
      {
        headers: {
          Authorization: process.env.HENRIK_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json({ error: "API fetch failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
