import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [region, setRegion] = useState("na");
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [mmrData, setMmrData] = useState(null);
  const [matchHistory, setMatchHistory] = useState([]);
  const [error, setError] = useState(null);

  // Rank icon base URL
  const getRankIcon = (tier) => {
    return `https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${tier}/largeicon.png`;
  };

  // Fallback map image if needed
  const getMapImage = (mapName) => {
    const formatted = mapName.toLowerCase().replace(/\s+/g, "");
    return `https://media.valorant-api.com/maps/${formatted}/splash.png`;
  };

  const fetchData = async () => {
    setError(null);
    try {
      console.log("Fetching MMR...");
      const mmrRes = await fetch(
        `http://localhost:5000/api/mmr?region=${region}&name=${encodeURIComponent(
          name
        )}&tag=${tag}`
      );
      const mmrJson = await mmrRes.json();
      console.log("MMR JSON:", mmrJson);
      if (!mmrJson.data || !mmrJson.data.current_data)
        throw new Error("Invalid MMR data");
      setMmrData(mmrJson.data);

      console.log("Fetching match history...");
      const historyRes = await fetch(
        `http://localhost:5000/api/mmr-history?region=${region}&name=${encodeURIComponent(
          name
        )}&tag=${tag}`
      );
      const historyJson = await historyRes.json();
      console.log("Match History JSON:", historyJson);
      if (!historyJson.data) throw new Error("No match history found");

      const topMatches = historyJson.data.slice(0, 10);

      const detailedMatches = await Promise.all(
        topMatches.map(async (match) => {
          try {
            const matchDetailRes = await fetch(
              `http://localhost:5000/api/match?region=${region}&matchid=${match.match_id}`
            );
            const matchDetailJson = await matchDetailRes.json();

            console.log(
              `Match Detail for ID ${match.match_id}:`,
              matchDetailJson
            );
            const players = matchDetailJson?.data?.players;
            if (!players) {
              console.warn(
                `No 'players' found in match ${match.match_id}`,
                matchDetailJson?.data?.players
              );
              return match;
            }

            const playerStats = players.find(
              (p) =>
                p.name.toLowerCase() === name.toLowerCase() &&
                p.tag.toLowerCase() === tag.toLowerCase()
            );

            console.log(
              `Player stats for ${name}#${tag} in match ${match.match_id}:`,
              playerStats
            );

            return {
              ...match,
              stats: playerStats?.stats ?? null,
            };
          } catch (err) {
            console.warn(`Failed to fetch match ${match.match_id}`, err);
            return match;
          }
        })
      );

      setMatchHistory(detailedMatches);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please check your input.");
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
          {matchHistory.map((match, i) => (
            <div key={i} className="match-card">
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
                  <strong>Rank:</strong> {match.currenttierpatched ?? "Unknown"}
                </p>
                <p>
                  <strong>KDA:</strong>{" "}
                  {match.stats
                    ? `${match.stats.kills}/${match.stats.deaths}/${match.stats.assists}`
                    : "Unknown"}
                </p>
                <p>
                  <strong>RR Change:</strong>{" "}
                  {match.mmr_change_to_last_game ?? "?"}
                </p>
                <p>
                  <strong>RR After Game:</strong> {match.ranking_in_tier}/100
                </p>
                <p>
                  <strong>Date:</strong> {match.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
