import React, { useState } from "react";
import "./App.css";

function App() {
  const [region, setRegion] = useState("na");
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [mmrData, setMmrData] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const mmrRes = await fetch(
        `http://localhost:5000/api/mmr?region=${region}&name=${name}&tag=${tag}`
      );
      const mmrJson = await mmrRes.json();

      if (!mmrJson.data || !mmrJson.data.current_data) {
        throw new Error("Invalid or missing MMR data");
      }

      const historyRes = await fetch(
        `http://localhost:5000/api/mmr-history?region=${region}&name=${name}&tag=${tag}`
      );
      const historyJson = await historyRes.json();

      if (!Array.isArray(historyJson.data)) {
        throw new Error("Invalid match history data");
      }

      setMmrData(mmrJson.data);
      setHistory(historyJson.data);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch player data. Check name, tag, and region.");
      setMmrData(null);
      setHistory([]);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Valorant Career Tracker</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tagline"
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

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {mmrData && (
        <div className="profile">
          <h2>
            {mmrData.name}#{mmrData.tag} -{" "}
            {mmrData.current_data.currenttier_patched}
          </h2>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${mmrData.current_data.ranking_in_tier}%` }}
            ></div>
            <span>{mmrData.current_data.ranking_in_tier}/100 RR</span>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="history">
          <h3>Last 10 Matches</h3>
          <div className="match-cards">
            {history.slice(0, 10).map((match, index) => (
              <div className="match-card" key={index}>
                <img
                  className="map-img"
                  src={`https://media.valorant-api.com/maps/${match.map.id}/splash.png`}
                  alt={match.map.name}
                />
                <p>
                  <strong>Map:</strong> {match.map.name}
                </p>
                <p>
                  <strong>Rank:</strong> {match.currenttier_patched}
                </p>
                <p>
                  <strong>RR Change:</strong> {match.mmr_change_to_last_game} RR
                </p>
                <p>
                  <strong>ELO:</strong> {match.elo}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(match.date_raw * 1000).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
