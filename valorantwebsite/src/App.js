import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [region, setRegion] = useState("na");
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [mmrData, setMmrData] = useState(null);
  const [matchHistory, setMatchHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const backend = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const getRankIcon = (tier) => {
    return `https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${tier}/largeicon.png`;
  };

  const getMapImage = (mapName) => {
    const formatted = mapName.toLowerCase().replace(/\s+/g, "");
    return `https://media.valorant-api.com/maps/${formatted}/splash.png`;
  };

  const fetchData = async () => {
    setError(null);
    setLoading(true);
    try {
      const mmrRes = await fetch(
        `${backend}/api/mmr?region=${region}&name=${encodeURIComponent(
          name
        )}&tag=${tag}`
      );
      if (mmrRes.status === 429) {
        throw new Error("API rate limit exceeded. Try again in 1 minute.");
      }
      const mmrJson = await mmrRes.json();
      if (!mmrJson.data || !mmrJson.data.current_data) {
        throw new Error("Invalid MMR data");
      }
      setMmrData(mmrJson.data);

      const historyRes = await fetch(
        `${backend}/api/mmr-history?region=${region}&name=${encodeURIComponent(
          name
        )}&tag=${tag}`
      );
      if (historyRes.status === 429) {
        throw new Error("API rate limit exceeded. Try again in 1 minute.");
      }
      const historyJson = await historyRes.json();
      if (!historyJson.data) {
        throw new Error("No match history found");
      }

      const topMatches = historyJson.data.slice(0, 10);

      const detailedMatches = await Promise.all(
        topMatches.map(async (match) => {
          try {
            const matchDetailRes = await fetch(
              `${backend}/api/match?region=${region}&matchid=${match.match_id}`
            );
            if (matchDetailRes.status === 429) {
              throw new Error(
                "API rate limit exceeded. Try again in 1 minute."
              );
            }
            const matchDetailJson = await matchDetailRes.json();
            const players = matchDetailJson?.data?.players;
            if (!players) return match;

            const playerStats = players.find(
              (p) =>
                p.name.toLowerCase() === name.toLowerCase() &&
                p.tag.toLowerCase() === tag.toLowerCase()
            );

            return {
              ...match,
              stats: playerStats?.stats ?? null,
            };
          } catch (err) {
            return match;
          }
        })
      );

      setMatchHistory(detailedMatches);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="App">
      <h1>Valorant Career Tracker</h1>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="na">NA</option>
          <option value="eu">EU</option>
          <option value="ap">AP</option>
          <option value="kr">KR</option>
        </select>
        <button type="submit">Submit</button>
      </form>

      {loading && (
        <div className="loading">
          <p>Fetching data...</p>
          <div className="loading-bar-container">
            <div className="loading-bar"></div>
          </div>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {mmrData && (
        <div className="profile">
          <img
            src={getRankIcon(mmrData.current_data.currenttier)}
            alt="Rank Icon"
            className="rank-icon"
          />
          <h2>
            {mmrData.current_data.currenttierpatched ??
              `Tier ${mmrData.current_data.currenttier}`}
          </h2>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{
                width: `${mmrData.current_data.ranking_in_tier}%`,
              }}
            ></div>
          </div>
          <p>{mmrData.current_data.ranking_in_tier}/100 RR</p>
        </div>
      )}

      {matchHistory.length > 0 && (
        <div className="matches">
          <h2>Last 10 Matches</h2>
          {matchHistory.map((match, i) => {
            const rrChange = match.mmr_change_to_last_game ?? 0;

            return (
              <div
                key={i}
                className={`match-card ${
                  rrChange > 0 ? "win" : rrChange < 0 ? "loss" : "draw"
                }`}
              >
                <img
                  src={getMapImage(match.map?.id || "Unknown")}
                  alt={match.map?.name}
                  className="map-img"
                />
                <div className="match-info">
                  <p>
                    <strong>Map:</strong> {match.map?.name || "Unknown"}
                  </p>
                  <p>
                    <strong>Rank:</strong>{" "}
                    {match.currenttierpatched ?? "Unknown"}
                  </p>
                  <p>
                    <strong>KDA:</strong>{" "}
                    {match.stats
                      ? `${match.stats.kills}/${match.stats.deaths}/${match.stats.assists}`
                      : "Unknown"}
                  </p>
                  <p
                    className={
                      rrChange > 0
                        ? "rr-up"
                        : rrChange < 0
                        ? "rr-down"
                        : "rr-draw"
                    }
                  >
                    <strong>RR Change:</strong> {rrChange}
                  </p>
                  <p>
                    <strong>RR After Game:</strong> {match.ranking_in_tier}/100
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {match.date_raw
                      ? new Date(match.date_raw * 1000).toLocaleString(
                          "en-US",
                          {
                            timeZone: "America/New_York",
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )
                      : "Unknown"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
