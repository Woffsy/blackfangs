const usernameInput = document.getElementById("username");
const searchButton = document.getElementById("search-button");
const playerResult = document.getElementById("player-result");
const searchForm = document.getElementById("search-form");
const urlParams = new URLSearchParams(window.location.search);
const urlUsername = urlParams.get("username");

// please forgive me for this
const colours = {
    "Nest of the Grootslangs": "76, 175, 80",
    "Orphion's Nexus of Light": "188, 169, 3",
    "The Nameless Anomaly": "82, 39, 176",
    "The Canyon Colossus": "115, 115, 115",
    "The Wartorn Palace": "152, 0, 0",
    "Decrepit Sewers": "96, 125, 139",
    "Lost Sanctuary": "0, 150, 32",
    "Underworld Crypt": "145, 139, 139",
    "Timelost Sanctum": "179, 74, 195",
    "Infested Pit": "121, 85, 72",
    "Sand-Swept Tomb": "211, 194, 0",
    "Ice Barrows": "55, 192, 255",
    "Undergrowth Ruins": "0, 150, 136",
    "Galleon's Graveyard": "65, 0, 178",
    "Fallen Factory": "255, 140, 0",
    "Eldritch Outlook": "85, 0, 96",
    "Corrupted Decrepit Sewers": "255, 61, 61",
    "Corrupted Infested Pit": "255, 34, 34",
    "Corrupted Lost Sanctuary": "255, 0, 0",
    "Corrupted Underworld Crypt": "208, 0, 0",
    "Corrupted Sand-Swept Tomb": "175, 0, 0",
    "Corrupted Ice Barrows": "149, 0, 0",
    "Corrupted Undergrowth Ruins": "96, 0, 0",
    "Corrupted Galleon's Graveyard": "61, 0, 0"
};

function colouredEntry(name, value) {
    const colour = colours[name] || "inherit";
    return `<div class="entry" style="background: rgba(${colour}, 0.45);">${name}: ${privacy(value)}</div>`;
}

function privacy(value) {
    return (value === undefined || value === null)
        ? "N/A"
        : value;
}

function formatRank(rank, supportRank) {
    if (rank == null) return "";
    if (!rank || !supportRank) return "";

    const supportRanks = {
        "N/A": "",
        "vip": "VIP",
        "vipplus": "VIP+",
        "hero": "HERO",
        "heroplus": "HERO+",
        "champion": "CHAMPION"
    };

    const ranks = {
        "Player": "",
        "Media": "MEDIA",
        "Moderator": "MODERATOR",
        "Administrator": "ADMIN",
        "Builder": "BUILDER",
        "Game Master": "GAME MASTER",
        "QA": "QA",
        "Item": "ITEM",
        "Music": "MUSIC",
        "Art": "ART",
        "Hybrid": "CT"
    }

    if (rank == "Player") {
        return supportRanks[supportRank.toLowerCase()] || supportRank;
    } else {
        return ranks[rank] || rank;
    }
}

function formatStars(star) {
    if (star == null) return "";
    if (!star) return "N/A";

    const stars = {
        "null": "",
        "★★★★★": "★★★★★",
        "★★★★": "★★★★",
        "★★★": "★★★",
        "★★": "★★",
        "★": "★"
    };

    return stars[star.toLowerCase()] || star;
}

function formatPlaytime(playtime) {
    if (playtime == "N/A") return "N/A";
    const days = Math.floor(playtime / 24);
    const hours = Math.floor(playtime % 24);
    return days.toString() + "d " + hours.toString() + "h (" + Math.floor(playtime).toString() + "h)";
}

function formatGuild(guild, rank, stars) {
    if (!guild || !rank) return "No guild";
    return `${privacy(rank)} ${formatStars(stars)} of ${privacy(guild)}`
}

async function searchPlayer() {
    const username = usernameInput.value.trim();
    if (!username) {
        return;
    }

    window.history.pushState({}, "", `player-info.html?username=${encodeURIComponent(username)}`);

    playerResult.innerHTML = "<p>Loading...</p>";

    try {
        const response = await fetch(`/api/player/${encodeURIComponent(username)}`);
        const player = await response.json();

        if (!response.ok) {
            playerResult.innerHTML = `<p>${player.error}</p>`;
            return;
        }

        playerResult.innerHTML = `
            <div class="player-header">
                <h2>${formatRank(player.rank, player.supportRank)} ${privacy(player.username)}</h2>
                <p>${formatGuild(player.guild?.name, player.guild?.rank, player.guild?.rankStars)}</p>
            </div>
            <div class="category-grid">
                <div class="category-box">
                    <h2>Raids</h2>
                    <div class="category-list">
                        <div class="entry">Total Raids: ${privacy(player.globalData?.raids?.total)}</div>
                        ${Object.entries(player.globalData?.raids?.list || {}).map(([raid, count]) => colouredEntry(raid, count)).join("")}
                        <div class="entry guild-raids">Guild Raids: ${privacy(player.globalData?.guildRaids?.total)}</div>
                        ${Object.entries(player.globalData?.guildRaids?.list || {}).map(([raid, count]) => colouredEntry(raid, count)).join("")}
                    </div>
                </div>
                <div class="category-box">
                    <h2>Dungeons</h2>
                    <div class="category-list">
                        <div class="entry">Total Dungeons: ${privacy(player.globalData?.dungeons?.total)}</div>
                        ${Object.entries(player.globalData?.dungeons?.list || {}).map(([dungeon, count]) => colouredEntry(dungeon, count)).join("")}
                    </div>
                </div>
                <div class="category-box">
                    <h2>General</h2>
                    <div class="category-list">
                        <div class="entry">Playtime: ${formatPlaytime(privacy(player.playtime))}</div>
                        <div class="entry">Total Level: ${privacy(player.globalData?.totalLevel)}</div>
                        <div class="entry">Mobs Killed: ${privacy(player.globalData?.mobsKilled)}</div>
                        <div class="entry">Quests Completed: ${privacy(player.globalData?.completedQuests)}</div>
                        <div class="entry">Chests Found: ${privacy(player.globalData?.chestsFound)}</div>
                        <div class="entry">Wars: ${privacy(player.globalData?.wars)}</div>
                        <div class="entry">World Events: ${privacy(player.globalData?.worldEvents)}</div>
                        <div class="entry">Lootruns: ${privacy(player.globalData?.lootruns)}</div>
                        <div class="entry">Caves: ${privacy(player.globalData?.caves)}</div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        playerResult.innerHTML = "<p>Something went wrong!</p>"
    }
}

searchButton.addEventListener("click", searchPlayer);

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = usernameInput.value.trim();
    if (username === "") {
        return;
    }
    searchPlayer();
});

if (urlUsername) {
    usernameInput.value = urlUsername;
    searchPlayer();
}