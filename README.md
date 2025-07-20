# Valorant Career Tracker

A web application that allows players to track their Valorant rank, match history, and detailed stats using the HenrikDev API.

Live site: [https://valorantrr.onrender.com](https://valorantrr.onrender.com)

---

## Features

- Search any Valorant player by Riot ID and tagline
- View current rank and rating (RR) progress
- Track last 10 matches with:
  - Match outcome (win/loss)
  - Map played
  - Kills, deaths, assists (KDA)
  - Round score
- Animated rank icons and responsive layout
- Built-in error handling and clean user interface

---

## Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Express.js
- **API**: HenrikDev Valorant API
- **Hosting**: Render

---

## Setup Instructions

1. Clone the repository  
   ```bash
   git clone https://github.com/yourusername/valorant-career-tracker.git
   cd valorant-career-tracker
   ```

2. Install dependencies for both client and server  
   ```bash
   npm install
   cd client && npm install
   ```

3. Create a `.env` file in the root with your HenrikDev API key  
   ```
   HENRIK_API_KEY=your_api_key_here
   ```

4. Run the development servers  
   - For frontend:  
     ```bash
     cd client
     npm run dev
     ```
   - For backend:  
     ```bash
     npm run server
     ```

---

## Live Demo

Try it out now: [https://valorantrr.onrender.com](https://valorantrr.onrender.com)

---

## License

This project is licensed under the MIT License.
