const usernameInput = document.getElementById("username");
const searchButton = document.getElementById("search-button");
const playerResult = document.getElementById("player-result");

async function searchPlayer() {
    const username = usernameInput.value.trim();
    if (!username) {
        return;
    }

    playerResult.innerHTML = "<p>Loading...</p>";

    try {
        const response = await fetch(`/api/player/${encodeURIComponent(username)}`);
        const player = await response.json();

        if (!response.ok) {
            playerResult.innerHTML = `<p>${player.error}</p>`;
        }

        playerResult.innerHTML = `
            <div class="player-card">
                <h2>${player.username}</h2>
                <div class="player-stat">
                    <span>Rank</span>
                    <p>${player.supportRank}</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        playerResult.innerHTML = "<p>Something went wrong!</p>"
    }
}

searchButton.addEventListener("click", searchPlayer);