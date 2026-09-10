const { Client, GatewayIntentBits } = require('discord.js');
require("dotenv").config(); //this is to make it possible to load stuff from the .env file

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, // required to fetch members by ID
    ],
});

let readyPromise = null;

function ensureReady() {
    if (!readyPromise) {
        readyPromise = new Promise((resolve, reject) => {
            client.once('ready', () => {
                console.log(`[roleChecker] Logged in as ${client.user.tag}`);
                resolve();
            });
            client.login(process.env.DISCORD_BOT_TOKEN).catch(reject);
        });
    }
    return readyPromise;
}


const GUILD_ID = '962855308932317204'; //Black Fangs discord
const ROLE_ID = '1168775281117499485'; //Black Fangs Member role BFS discord

async function checkUserRole(userId) {
    if (!/^\d{17,20}$/.test(userId)) {
        throw new Error('Invalid Discord user ID format.');
    }
 
    await ensureReady();
 
    const guild = await client.guilds.fetch(GUILD_ID);
 
    try {
        const member = await guild.members.fetch(userId);
        return {
            found: true,
            hasRole: member.roles.cache.has(ROLE_ID),
            displayName: member.user.tag,
        };
    } catch (error) {
        if (error.code === 10007) {
            // Unknown Member — not in this server
            return { found: false, hasRole: false };
        }
        if (error.code === 10013) {
            throw new Error('Unknown Discord user (invalid ID).');
        }
        throw error;
    }
}
 
module.exports = { checkUserRole };
