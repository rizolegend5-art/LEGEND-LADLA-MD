module.exports = async function (sock, chatId, msg) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
    try {
        const meta = await sock.groupMetadata(chatId);
        const admins = meta.participants.filter(p => p.admin);
        if (admins.length === 0) return sock.sendMessage(chatId, { text: '📋 No admins found in this group.' }, { quoted: msg });
        const mentions = admins.map(a => a.id);
        const list = admins.map((a, i) => `${i + 1}. @${a.id.split('@')[0]} ${a.admin === 'superadmin' ? '👑' : '⭐'}`).join('\n');
        await sock.sendMessage(chatId, {
            text: `👮 *Group Admins (${admins.length})*\n\n${list}`,
            mentions
        }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to fetch admin list.' }, { quoted: msg });
    }
};
