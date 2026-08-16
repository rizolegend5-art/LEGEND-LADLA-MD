// channel.js — Show bot official channels
const { BOT_NAME, CHANNELS, OWNER } = require('../lib/messageConfig');
module.exports = async function (sock, chatId, msg) {
    await sock.sendMessage(chatId, {
        text:
            `📢 *${BOT_NAME} — Official Channels*\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `📣 *WhatsApp Channel:*\n` +
            `${CHANNELS.whatsapp ? `   ↪️ ${CHANNELS.whatsapp}\n\n` : '   Channel link abhi configured nahi hai.\n\n'}` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `📞 *Owner:* ${OWNER}\n\n` +
            `_Link par tap karke apni marzi se Follow/Join karein. Bot aapki permission ke baghair follow nahi karega._`,
    }, { quoted: msg });
};
