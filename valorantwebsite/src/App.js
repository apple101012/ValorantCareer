import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [region, setRegion] = useState("eu");
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [mmrData, setMmrData] = useState(null);
  const [matchHistory, setMatchHistory] = useState([]);
  const [error, setError] = useState(null);

  const API_BASE = "https://api.henrikdev.xyz/valorant";

  async function fetchData() {
    try {
      setError(null);
      const mmrRes = await fetch(`${API_BASE}/v2/mmr/${region}/${name}/${tag}`);
      const mmrJson = await mmrRes.json();
      if (!mmrJson.data) throw new Error("MMR data not found");
      setMmrData(mmrJson.data);

      const historyRes = await fetch(
        `${API_BASE}/v1/mmr-history/${region}/${name}/${tag}`
      );
      const historyJson = await historyRes.json();
      setMatchHistory(historyJson.data || []);
    } catch (err) {
      setError("Failed to fetch data. Check username, tag, and region.");
      console.error(err);
    }
  }

  return (
    <div className="app">
      <h1>Valorant Career Tracker</h1>
      <div className="input-group">
        <input
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Tag (e.g. EUW3)"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="na">NA</option>
          <option value="eu">EU</option>
          <option value="ap">AP</option>
          <option value="kr">KR</option>
        </select>
        <button onClick={fetchData}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}

      {mmrData && (
        <div className="rank-section">
          <h2>Rank: {mmrData.current_data.currenttier_patched}</h2>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${mmrData.current_data.ranking_in_tier}%` }}
            >
              {mmrData.current_data.ranking_in_tier}/100 RR
            </div>
          </div>
        </div>
      )}

      {matchHistory.length > 0 && (
        <div className="history">
          <h2>Last 10 Competitive Games</h2>
          {matchHistory.slice(0, 10).map((match, idx) => (
            <div className="match-card" key={idx}>
              <h3>{match.map.name}</h3>
              <p>Rank: {match.currenttier_patched}</p>
              <p>RR Change: {match.mmr_change_to_last_game}</p>
              <p>ELO: {match.elo}</p>
              <p>Date: {match.date}</p>
              {/* Replace this with real map image URLs if available */}
              <img
                src={`/maps/${match.map.name.toLowerCase()}.jpg`}
                alt={match.map.name}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
