module.exports = async function (sock, chatId, msg) {
    try {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const stickerMsg = quoted?.stickerMessage;
        if (!stickerMsg) return sock.sendMessage(chatId, { text: '😈 *Steal Sticker*\n\nReply to any sticker with .stealsticker to save it!' }, { quoted: msg });
        const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
        const stream = await downloadContentFromMessage(stickerMsg, 'sticker');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);
        await sock.sendMessage(chatId, { sticker: buffer }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to steal sticker. Reply to a sticker with this command.' }, { quoted: msg });
    }
};
