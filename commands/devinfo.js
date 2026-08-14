// devinfo.js — Developer info
const { BOT_NAME, CHANNELS, OWNER } = require('../lib/messageConfig');
module.exports = async function (sock, chatId, msg) {
    await sock.sendMessage(chatId, {
        text:
            `👨‍💻 *Developer Information*\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `👤 *Name:*      CHOTI DON × DON INSIDE\n` +
            `🤖 *Bot Name:*  ${BOT_NAME}\n` +
            `💻 *Language:*  JavaScript (Node.js)\n` +
            `📱 *Platform:*  WhatsApp MD\n` +
            `🔧 *Library:*   @whiskeysockets/baileys\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `${CHANNELS.whatsapp ? `📢 *WhatsApp Channel:*\n   ↪️ ${CHANNELS.whatsapp}\n\n` : ''}` +
            `📞 *Contact Owner:*\n` +
            `   ↪️ ${OWNER}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `_${BOT_NAME} — Choti Don × Don Inside_`,
    }, { quoted: msg });
};
