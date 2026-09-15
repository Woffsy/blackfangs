// const inputField = document.getElementById("MessageContent")
// const searchButton = document.getElementById("search-button")
// const searchForm = document.getElementById("search-form")
// const sendStatus = document.getElementById("status")

const inactiveUntil = document.getElementById("inactive-until");
const inactiveReason = document.getElementById("inactive-reason");
const inactiveNotes = document.getElementById("inactive-notes");
const inactiveForm = document.getElementById("inactivity-form");

// async function sendMessage() {
//     const messageContent = inputField.value

//     const response = await fetch("/bot/sendmessage", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ content: messageContent })
//     })

//     if (!response.ok) {
//         console.error("Failed to send message:", response.status, await response.text())
//     }
// }

// searchForm.addEventListener("submit", (event) => {
//     sendStatus.innerHTML = "Pending" 
//     event.preventDefault()
//     sendMessage()
//     sendStatus.innerHTML = "Sent"
// });

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
    sendInactivityReport();
});