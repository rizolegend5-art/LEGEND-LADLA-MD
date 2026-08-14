// creator.js — Show creator / developer info
const { BOT_NAME, CHANNELS, OWNER } = require('../lib/messageConfig');
module.exports = async function (sock, chatId, msg) {
    await sock.sendMessage(chatId, {
        text:
            `👨‍💻 *Creator / Developer Info*\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `🏷️  *Bot Name:*   ${BOT_NAME}\n` +
            `👤  *Creator:*    CHOTI DON × DON INSIDE\n` +
            `📱  *Platform:*   WhatsApp MD\n` +
            `🔧  *Tech Stack:* Node.js + Baileys\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `${CHANNELS.whatsapp ? `📢 *WhatsApp Channel:*\n   ↪️ ${CHANNELS.whatsapp}\n\n` : ''}` +
            `📞 *Contact Owner:*\n` +
            `   ↪️ ${OWNER}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `_All Rights Reserved © LEGEND LADLA LEGEND LADLI MD_`,
    }, { quoted: msg });
};
