console.log("hi chat");

async function loadGuildStats() {
    try {
        const response = await fetch("/api/guild");

        if (!response.ok) {
            throw new Error("API returned ${response.status}");
        }

        const guild = await response.json();

        document.getElementById("guild-raids").textContent = guild.raids.toLocaleString();
        document.getElementById("guild-wars").textContent = guild.wars.toLocaleString();
        document.getElementById("guild-level").textContent = guild.level.toLocaleString();
        document.getElementById("guild-members").textContent = guild.members.total.toLocaleString();

    } catch (error) {
        console.error("oopsies occured")
    }
}

loadGuildStats();