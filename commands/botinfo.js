// botinfo.js — Detailed bot information
const { BOT_NAME, CHANNELS, OWNER } = require('../lib/messageConfig');
module.exports = async function (sock, chatId, msg) {
    const uptime = process.uptime();
    const hours   = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const mem = process.memoryUsage();
    const memMB = (mem.heapUsed / 1024 / 1024).toFixed(2);
    const fs = require('fs');
    const path = require('path');
    const cmdCount = fs.readdirSync(path.join(__dirname)).filter(f => f.endsWith('.js')).length;
    await sock.sendMessage(chatId, {
        text:
            `╔══════════════════════════════╗\n` +
            `║  🤖  ${BOT_NAME}  🤖  ║\n` +
            `╚══════════════════════════════╝\n\n` +
            `📛 *Name:*     ${BOT_NAME}\n` +
            `🔖 *Version:*  2.0.0\n` +
            `📡 *Platform:* WhatsApp MD\n` +
            `🌐 *Library:*  Baileys (Latest)\n` +
            `⚙️  *Runtime:*  Node.js ${process.version}\n` +
            `💾 *Memory:*   ${memMB} MB\n` +
            `⏱️  *Uptime:*   ${hours}h ${minutes}m ${seconds}s\n` +
            `📦 *Commands:* ${cmdCount}+\n` +
            `👨‍💻 *Developer:* CHOTI DON × DON INSIDE\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `${CHANNELS.whatsapp ? `📢 *WhatsApp Channel:*\n   ↪️ ${CHANNELS.whatsapp}\n\n` : ''}` +
            `📞 *Contact Owner:*\n` +
            `   ↪️ ${OWNER}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    }, { quoted: msg });
};
