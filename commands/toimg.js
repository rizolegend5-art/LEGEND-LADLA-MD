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
        const stickerMsg = quoted?.stickerMessage || msg.message?.stickerMessage;
        if (!stickerMsg) return sock.sendMessage(chatId, { text: '🖼️ *Sticker to Image*\n\nReply to a sticker with .toimg to convert it to an image!' }, { quoted: msg });
        const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
        const stream = await downloadContentFromMessage(stickerMsg, 'sticker');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);
        await sock.sendMessage(chatId, { image: buffer, caption: '🖼️ Here is your image!' }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to convert sticker. Please reply to a sticker.' }, { quoted: msg });
    }
};
