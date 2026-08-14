module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Only admins can use this command.' }, { quoted: msg });
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
    try {
        const meta = await sock.groupMetadata(chatId);
        const members = meta.participants.map(p => p.id);
        const mentions = members.map(m => `@${m.split('@')[0]}`).join(' ');
        const message = q ? `📢 *${q}*\n\n${mentions}` : `📢 *Attention Everyone!*\n\n${mentions}`;
        await sock.sendMessage(chatId, { text: message, mentions: members }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to tag everyone.' }, { quoted: msg });
    }
};
