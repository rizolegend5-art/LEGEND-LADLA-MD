// alive2.js — Bot alive check with full status
const { BOT_NAME, CHANNELS, OWNER } = require('../lib/messageConfig');
module.exports = async function (sock, chatId, msg) {
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const mn = Math.floor((uptime % 3600) / 60);
    const s  = Math.floor(uptime % 60);
    const mem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    await sock.sendMessage(chatId, {
        text:
            `╔══════════════════════════╗\n` +
            `║  🤖  ${BOT_NAME}  🤖  ║\n` +
            `╚══════════════════════════╝\n\n` +
            `✅ *Main Zinda Hoon! Hamesha Online!*\n\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `⏱️  Uptime:  *${h}h ${mn}m ${s}s*\n` +
            `💾  Memory: *${mem} MB*\n` +
            `🟢  Status:  *Active & Running*\n` +
            `📡  Network: *Connected*\n` +
            `🔧  Node.js: *${process.version}*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `${CHANNELS.whatsapp ? `📢 WhatsApp Channel: ${CHANNELS.whatsapp}\n` : ''}` +
            `👨‍💻 Owner: ${OWNER}`,
    }, { quoted: msg });
};
