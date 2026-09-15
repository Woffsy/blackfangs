const inactiveUntil = document.getElementById("inactive-until");
const inactiveReason = document.getElementById("inactive-reason");
const inactiveNotes = document.getElementById("inactive-notes");
const inactiveForm = document.getElementById("inactivity-form");

let discordName = null;
fetch("/api/me").then(response => response.json()).then(user => {
                        discordName = user.serverDisplayName;
                });

async function sendInactivityReport() {
    const date = inactiveUntil.value || "No date provided";
    const reason = inactiveReason.value || "No reason provided";
    const notes = inactiveNotes.value || "No notes provided";

    const messageContent = {
        username: discordName,
        date: date,
        reason: reason,
        notes: notes
    };

    const response = await fetch("/bot/sendmessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageContent })
    })

    if (!response.ok) {
        console.error("Failed to send message:", response.status, await response.text())
    }
}

inactiveForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;

    if (!dateRegex.test(inactiveUntil.value.trim())) {
        alert("Please enter a valid date in the fromat DD/MM/YYYY");
        return;
    }

    if (!inactiveReason.value) {
        alert("Please choose a reason.");
        return;
    }
    sendInactivityReport();
});