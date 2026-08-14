// botbrand.js — Display bot branding info
const { BOT_NAME, CHANNELS, OWNER } = require('../lib/messageConfig');
module.exports = async function (sock, chatId, msg) {
    await sock.sendMessage(chatId, {
        text:
            `╔══════════════════════════════╗\n` +
            `║   🌟  BOT BRANDING  🌟      ║\n` +
            `╚══════════════════════════════╝\n\n` +
            `🤖 *Bot Name:* ${BOT_NAME}\n` +
            `🏷️  *Brand:*   MASOOM X MASOOMA\n` +
            `👨‍💻 *Owner:*   CHOTI DON × DON INSIDE\n` +
            `📱 *Type:*    WhatsApp MD Bot\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `${CHANNELS.whatsapp ? `📢 *WhatsApp Channel:*\n   ↪️ ${CHANNELS.whatsapp}\n\n` : ''}` +
            `📞 *Owner Contact:*\n` +
            `   ↪️ ${OWNER}`,
    }, { quoted: msg });
};
