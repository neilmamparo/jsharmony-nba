require("dotenv").config()

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("/Users/neil/Documents/jsharmony-nba/data/db/project.db");

// select helper
function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// insert/update/delete helper
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

function delay(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

// function that gets all player ids from database
async function getPlayerIds() {
    const rows = await query("SELECT player_api_id FROM player");
    return rows.map(row => row.player_api_id);
}

// function that gets all player stats from the API
async function getPlayerStats(playerId) {
    const allStats = [];
    let cursor;

    do {
        let url = (`https://api.balldontlie.io/v1/stats?player_ids[]=${playerId}&seasons[]=2025&postseason=false&per_page=100`);
        if (cursor) {
            url += `&cursor=${cursor}`;
        }
        const response = await fetch(url, {
            headers: {
                Authorization: process.env.BALLDONTLIE_API_KEY.trim()
            }
        });
        if (!response.ok) {
            throw new Error(`Request failed ${response.status}`);
        }
        const result = await response.json();
        allStats.push(...result.data);
        cursor = result.meta?.next_cursor;
        if (cursor) {
            await delay(1000);
        }
    } while (cursor)

    return allStats;
}

// function that calculates season averages
function calculateAverages(stats) {
    if (stats.length === 0) {
        return {
            gamesPlayed: 0,
            ppg: 0,
            apg: 0,
            rpg: 0
        };
    }

    let totalPoints = 0;
    let totalAssists = 0;
    let totalRebounds = 0;

    for (const stat of stats) {
        totalPoints += Number(stat.pts) || 0;
        totalAssists += Number(stat.ast) || 0;
        totalRebounds += Number(stat.reb) || 0;
    }

    const gamesPlayed = stats.length;

    return {
        gamesPlayed,
        ppg: totalPoints / gamesPlayed,
        apg: totalAssists / gamesPlayed,
        rpg: totalRebounds / gamesPlayed
    };
}

// main function
async function main() {
    const playerIds = await getPlayerIds();

    // put player stats in database
    for (const id of playerIds) {
        // importing player message
        console.log(`Importing player ${id}...`);
        const stats = await getPlayerStats(id);
        const playedGames = stats.filter(stat => {
            return Number.parseInt(stat.min, 10) > 0;
        });

        const averages = calculateAverages(playedGames);
        await run(`UPDATE player SET player_ppg = ?, player_apg = ?, player_rpg = ?, games_played = ? WHERE player_api_id = ?`, [Number(averages.ppg.toFixed(1)), Number(averages.apg.toFixed(1)), Number(averages.rpg.toFixed(1)), averages.gamesPlayed, id]);
        console.log(`Updated player ${id}: ` + `${averages.gamesPlayed} GP, ` + `${averages.ppg.toFixed(1)} PPG, ` + `${averages.apg.toFixed(1)} APG, ` + `${averages.rpg.toFixed(1)} RPG `);
        await delay(1000);
    }
}

main()
    .catch(error => {
        console.error("Error importing player stats:", error);
    })
    .finally(() => {
        db.close();
    });
