// qrcreate.js — Generate a QR code for given text/URL
const { BOT_NAME } = require('../lib/messageConfig');
module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!q) return sock.sendMessage(chatId, { text: `❌ Usage: .qrcreate <text or URL>\nMisaal: .qrcreate https://t.me/srleadermdbot1` }, { quoted: msg });
    try {
        const QRCode = require('qrcode');
        const buffer = await QRCode.toBuffer(q);
        await sock.sendMessage(chatId, { image: buffer, caption: `✅ *QR Code Generated!*\n\n📝 Content: ${q}\n\n🤖 ${BOT_NAME}` }, { quoted: msg });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ QR generate nahi hua: ${e.message}` }, { quoted: msg });
    }
};
