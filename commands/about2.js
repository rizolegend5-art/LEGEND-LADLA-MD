// about2.js — About the bot
const { BOT_NAME, CHANNELS, OWNER } = require('../lib/messageConfig');
module.exports = async function (sock, chatId, msg) {
    await sock.sendMessage(chatId, {
        text:
            `╔══════════════════════════╗\n` +
            `║   ℹ️  ABOUT THE BOT  ℹ️   ║\n` +
            `╚══════════════════════════╝\n\n` +
            `🤖 *Name:*     ${BOT_NAME}\n` +
            `📱 *Platform:* WhatsApp MD\n` +
            `🔧 *Library:*  Baileys (Latest)\n` +
            `📊 *Version:*  2.0.0\n` +
            `👨‍💻 *Creator:*  CHOTI DON × DON INSIDE\n\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `🌟 *Features:*\n` +
            `  ▸ Group Management (ban, kick, promote...)\n` +
            `  ▸ Anti-Spam / Flood / Link / Tag\n` +
            `  ▸ Fun & Utility Commands (374+)\n` +
            `  ▸ Auto-Reactions & Auto-Replies\n` +
            `  ▸ AI Powered Commands\n` +
            `  ▸ Economy System (balance, daily)\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `${CHANNELS.whatsapp ? `📢 Channel: ${CHANNELS.whatsapp}\n` : ''}` +
            `📞 Owner:   ${OWNER}`,
    }, { quoted: msg });
};
