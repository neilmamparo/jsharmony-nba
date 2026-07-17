require("dotenv").config()


const sqlite3 = require("sqlite3").verbose();
const { BalldontlieAPI } = require("@balldontlie/sdk")

const api = new BalldontlieAPI({
    apiKey: process.env.BALLDONTLIE_API_KEY.trim()
});

const db = new sqlite3.Database("/Users/neil/Documents/jsharmony-nba/data/db/project.db")

async function getAllActivePlayers() {
    const allPlayers = [];
    let cursor;

    do {
        const parameters = {
            per_page: 100
        };
        if (cursor !== undefined && cursor !== null) {
            parameters.cursor = cursor;
        }

        const response = await api.nba.getActivePlayers(parameters);

        for (const player of response.data) {
            allPlayers.push(player);
        }

        console.log(`Fetched ${response.data.length} players; ${allPlayers.length} total`);

        cursor = response.meta.next_cursor;
    } while (cursor);

    return allPlayers;
}

async function main() {
    const players = await getAllActivePlayers();

    const sql = ` INSERT INTO player (player_api_id, player_name, team_id, player_position)
                  VALUES (?, ?, ?, ?)
                  ON CONFLICT (player_api_id) 
                  DO UPDATE SET
                      player_name = excluded.player_name,
                      team_id = excluded.team_id,
                      player_position = excluded.player_position
                  `;

    const values = [];

    for (const player of players) {
        db.run(sql, [
            player.id,
            `${player.first_name} ${player.last_name}`.trim(),
            player.team?.id,
            player.position || null
        ]);
    }
    console.log(`Imported ${players.length} players`);
    db.close();
}

main().catch(error => {
    console.error('Error occurred while fetching players:', error);
    process.exitCode = 1;
});