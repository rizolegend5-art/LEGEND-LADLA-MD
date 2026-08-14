function getReplyTarget(m) {
    if (!m) return null;
    const types = ['extendedTextMessage', 'imageMessage', 'videoMessage', 'stickerMessage', 'audioMessage', 'documentMessage'];
    for (const t of types) {
        if (m[t]?.contextInfo?.participant) return m[t].contextInfo.participant;
        if (m[t]?.contextInfo?.mentionedJid?.[0]) return m[t].contextInfo.mentionedJid[0];
    }
    if (m.ephemeralMessage?.message) return getReplyTarget(m.ephemeralMessage.message);
    if (m.viewOnceMessage?.message) return getReplyTarget(m.viewOnceMessage.message);
    if (m.viewOnceMessageV2?.message) return getReplyTarget(m.viewOnceMessageV2.message);
    return null;
}

module.exports = async function (sock, chatId, msg, isAdmin) {
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Only admins can use this command.' }, { quoted: msg });
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
    const target = getReplyTarget(msg.message);
    if (!target) return sock.sendMessage(chatId, { text: '❌ Please reply to or mention the user to promote.' }, { quoted: msg });
    try {
        await sock.groupParticipantsUpdate(chatId, [target], 'promote');
        await sock.sendMessage(chatId, { text: `✅ Successfully promoted @${target.split('@')[0]} to admin!`, mentions: [target] }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to promote. Make sure I am an admin.' }, { quoted: msg });
    }
};
