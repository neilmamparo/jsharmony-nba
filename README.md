# jsHarmony NBA

An NBA database application built with jsHarmony, Node.js, SQLite, and the BallDontLie API.

## Features

- Imports and updates active NBA teams and players from the BallDontLie API
- Automatically retrieves and calculates 2025 season player statistics
- Stores player and team data in a SQLite database
- Handles paginated API responses
- Implements rate limiting to respect API request limits
- Built using asynchronous JavaScript (async/await)

## Technologies

- jsHarmony
- Node.js
- JavaScript
- SQLite
- BallDontLie API

## Scripts

- `import-active-players.js` – Imports and updates active NBA players.
- `import-player-stats.js` – Retrieves player game statistics, calculates season averages, and updates the database.

## Future Improvements

- Add additional statistics such as shooting percentages, turnovers, steals, blocks, and +/-
- Schedule automated data refreshes throughout the NBA season
- Display player statistics within the jsHarmony web interface
