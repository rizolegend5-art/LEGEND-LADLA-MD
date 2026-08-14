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

module.exports = async function (sock, chatId, msg, isOwner) {
    if (!isOwner) return sock.sendMessage(chatId, { text: '❌ Only the bot owner can use this command.' }, { quoted: msg });
    const target = getReplyTarget(msg.message);
    if (!target) return sock.sendMessage(chatId, { text: '❌ Please reply to or mention the user to unblock.' }, { quoted: msg });
    try {
        await sock.updateBlockStatus(target, 'unblock');
        await sock.sendMessage(chatId, { text: `✅ *Unblocked*\n\n@${target.split('@')[0]} has been unblocked.`, mentions: [target] }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to unblock user.' }, { quoted: msg });
    }
};
