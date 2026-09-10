async function loadMembers() {
    try {
        const response = await fetch("/api/guild");

        if (!response.ok) {
            throw new Error("API returned ${response.status}");
        }

        const guild = await response.json();
        const container = document.getElementById("members-container");
        const ranks = [
            ["owner", "Owner"],
            ["chief", "Chiefs"],
            ["strategist", "Strategists"],
            ["captain", "Captains"],
            ["recruiter", "Recruiters"],
            ["recruit", "Recruits"]
        ];

        container.innerHTML = "";

        for (const [rankId, rankName] of ranks) {
            const members = guild.members[rankId];
            if (!members || Object.keys(members).length === 0) {
                continue;
            }

            const section = document.createElement("section");
            section.className = "member-rank";

            const heading = document.createElement("h2");
            heading.textContent = rankName;

            section.appendChild(heading);

            const memberGrid = document.createElement("div");
            memberGrid.className = "member-grid";

            for (const [username, member] of Object.entries(members)) {

                const card = document.createElement("div");
                card.className = "member-card";
                
                const uuid = member.uuid;
                const head = document.createElement("img");
                head.src = "https://render.crafty.gg/2d/head/" + username.toLowerCase() + "?size=100";
                head.alt = "${username}'s head";
                head.className = "member-head";
                
                const rank = document.createElement("p");
                const starCount = {owner:5, chief:4, strategist:3, captain:2, recruiter:1, recruit:0};
                rank.textContent = "★".repeat(starCount[rankId]);
                rank.className = "member-stars";

                const name = document.createElement("h3");
                name.textContent = username;

                card.appendChild(name);
                card.appendChild(rank);
                card.appendChild(head);
                memberGrid.appendChild(card);
            }

            section.appendChild(memberGrid);
            container.appendChild(section);
        }
    } catch (error) {
        console.error("An oopsie occured when loading guild members");
        document.getElementById("members-container").innerHTML = "<p>Failed to load guild members.</p>";
    }
}

loadMembers();