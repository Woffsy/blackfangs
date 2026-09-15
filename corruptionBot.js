const { Client, GatewayIntentBits } = require('discord.js');
require("dotenv").config(); //this is to make it possible to load stuff from the .env file

const discordTestServer = "1510326639521960006"
const discordTestChannel = "1511018624964366356"

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // required for slash commands and sending messages
        GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
    ],
});

let readyPromise = null;

function ensureReady() {
    if (!readyPromise) {
        readyPromise = new Promise((resolve, reject) => {
            client.once('ready', () => {
                console.log(`[corruptionBot] Logged in as ${client.user.tag}`);
                resolve();
            });
            client.login(process.env.DISCORD_BOT_TOKEN).catch(reject);
        });
    }
    return readyPromise;
}

async function sendMessage(content) {
    await ensureReady();
    const channel = await client.channels.fetch(discordTestChannel)
    await channel.send(content)
}

module.exports = { sendMessage }