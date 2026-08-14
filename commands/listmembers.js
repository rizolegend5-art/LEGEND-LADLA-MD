module.exports = async function (sock, chatId, msg) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
    try {
        const meta = await sock.groupMetadata(chatId);
        const members = meta.participants;
        const mentions = members.map(m => m.id);
        const list = members.map((m, i) => {
            const tag = m.admin === 'superadmin' ? '👑' : m.admin === 'admin' ? '⭐' : '👤';
            return `${i + 1}. ${tag} @${m.id.split('@')[0]}`;
        }).join('\n');
        const chunks = [];
        const lines = list.split('\n');
        for (let i = 0; i < lines.length; i += 30) {
            chunks.push(lines.slice(i, i + 30).join('\n'));
        }
        await sock.sendMessage(chatId, {
            text: `👥 *Group Members (${members.length})*\n\n${chunks[0]}${chunks.length > 1 ? '\n\n_...continued_' : ''}`,
            mentions
        }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to fetch member list.' }, { quoted: msg });
    }
};
