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

module.exports = async function (sock, chatId, msg, q) {
    if (!q) {
        const quoted = getQuotedMessage(msg.message);
        q = quoted?.conversation || quoted?.extendedTextMessage?.text || '';
    }
    if (!q) return sock.sendMessage(chatId, { text: '🔡 Usage: .lower <text> OR reply to a message with .lower' }, { quoted: msg });
    await sock.sendMessage(chatId, { text: `🔡 *lowercase:*\n\n${q.toLowerCase()}` }, { quoted: msg });
};
