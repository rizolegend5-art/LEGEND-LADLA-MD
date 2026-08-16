const { BOT_NAME, CHANNELS } = require('../lib/messageConfig');

module.exports = async function followChannelCommand(sock, chatId, msg) {
    const link = CHANNELS.whatsapp;
    const text = link
        ? `📢 *${BOT_NAME} Official Channel*\n\n${link}\n\nLink open karke apni marzi se Follow/Join karein. Bot bina permission ke aapke account ko follow nahi karega.`
        : '❌ Official channel link configured nahi hai. Admin se WHATSAPP_CHANNEL_URL set karwayen.';
    await sock.sendMessage(chatId, { text }, { quoted: msg });
};
