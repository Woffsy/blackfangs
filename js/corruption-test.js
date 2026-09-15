const inputField = document.getElementById("MessageContent")
const searchButton = document.getElementById("search-button")
const searchForm = document.getElementById("search-form")
const sendStatus = document.getElementById("status")

async function sendMessage() {
    const messageContent = inputField.value

    const response = await fetch("/bot/sendmessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageContent })
    })

    if (!response.ok) {
        console.error("Failed to send message:", response.status, await response.text())
    }
}

searchForm.addEventListener("submit", (event) => {
    sendStatus.innerHTML = "Pending" 
    event.preventDefault()
    sendMessage()
    sendStatus.innerHTML = "Sent"
})