// channel.js — Show bot official channels
const { BOT_NAME, CHANNELS, OWNER } = require('../lib/messageConfig');
module.exports = async function (sock, chatId, msg) {
    await sock.sendMessage(chatId, {
        text:
            `📢 *${BOT_NAME} — Official Channels*\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `📣 *WhatsApp Channel:*\n` +
            `${CHANNELS.whatsapp ? `   ↪️ ${CHANNELS.whatsapp}\n\n` : ''}` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `📞 *Owner:* ${OWNER}\n\n` +
            `_Join karo aur updates pao!_ 🚀`,
    }, { quoted: msg });
};
