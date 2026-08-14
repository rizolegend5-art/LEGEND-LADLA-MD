/**
 * .verify — Mark user as verified after joining channels
 * 𝙎𝙍 𝙇𝙀𝘼𝘿𝙀𝙍-𝙈𝘿
 */
const fs   = require('fs-extra');
const path = require('path');
const { BOT_NAME, CHANNELS, OWNER } = require('../lib/messageConfig');

const VERIFIED_FILE = path.join(__dirname, '../data/sr_verified.json');
function loadVerified() {
    try { return fs.readJsonSync(VERIFIED_FILE); } catch { return {}; }
}
function saveVerified(data) {
    fs.ensureFileSync(VERIFIED_FILE);
    fs.writeJsonSync(VERIFIED_FILE, data, { spaces: 2 });
}

module.exports = async function verifyCommand(sock, chatId, msg) {
    const senderId = msg.key.participant || chatId;

    // Mark as verified
    const verified = loadVerified();
    verified[senderId] = { at: new Date().toISOString() };
    saveVerified(verified);

    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    const mem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    const welcomeMsg =
        `╔══════════════════════════════╗\n` +
        `║  ✅  ${BOT_NAME}  ✅  ║\n` +
        `╚══════════════════════════════╝\n\n` +
        `*Verified! Khush Amdeed!* 🎉\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🤖 *Bot Name:*  ${BOT_NAME}\n` +
        `📱 *Platform:*  WhatsApp MD\n` +
        `🔧 *Library:*   Baileys (Latest)\n` +
        `📊 *Version:*   2.0.0\n` +
        `⏱️  *Uptime:*    ${h}h ${m}m ${s}s\n` +
        `💾 *Memory:*   ${mem} MB\n` +
        `👨‍💻 *Developer:* CHOTI DON × DON INSIDE\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `📋 *Commands list ke liye:*\n` +
        `   👉 *.menu*\n\n` +
        `${CHANNELS.whatsapp ? `📢 *WhatsApp Channel:*\n   ↪️ ${CHANNELS.whatsapp}\n\n` : ''}` +
        `📞 *Owner se contact karein:*\n` +
        `   ↪️ ${OWNER}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `_${BOT_NAME} — Always Here For You!_ 🚀`;

    // Try sending with bot DP
    try {
        let botPp = null;
        try { botPp = await sock.profilePictureUrl(sock.user.id, 'image'); } catch {}
        if (botPp) {
            await sock.sendMessage(chatId, { image: { url: botPp }, caption: welcomeMsg }, { quoted: msg });
        } else {
            await sock.sendMessage(chatId, { text: welcomeMsg }, { quoted: msg });
        }
    } catch {
        await sock.sendMessage(chatId, { text: welcomeMsg }, { quoted: msg });
    }
};
