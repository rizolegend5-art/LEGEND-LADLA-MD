function getQuotedMessage(m) {
    if (!m) return null;
    const types = ['extendedTextMessage', 'imageMessage', 'videoMessage', 'stickerMessage', 'audioMessage', 'documentMessage'];
    for (const t of types) {
        if (m[t]?.contextInfo?.quotedMessage) return m[t].contextInfo.quotedMessage;
    }
    if (m.ephemeralMessage?.message) return getQuotedMessage(m.ephemeralMessage.message);
    if (m.viewOnceMessage?.message) return getQuotedMessage(m.viewOnceMessage.message);
    if (m.viewOnceMessageV2?.message) return getQuotedMessage(m.viewOnceMessageV2.message);
    return null;
}

module.exports = async function (sock, chatId, msg) {
    try {
        const quoted = getQuotedMessage(msg.message);
        const imageMsg = quoted?.imageMessage || msg.message?.imageMessage;
        if (!imageMsg) return sock.sendMessage(chatId, { text: '📌 *Image to Sticker*\n\nReply to an image with .sticker to convert it to a sticker!' }, { quoted: msg });
        const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
        const stream = await downloadContentFromMessage(imageMsg, 'image');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);
        await sock.sendMessage(chatId, { sticker: buffer }, { quoted: msg });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Failed to create sticker. Please reply to an image.' }, { quoted: msg });
    }
};
