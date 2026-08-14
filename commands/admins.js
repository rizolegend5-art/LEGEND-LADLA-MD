// admins.js — List all group admins
module.exports = async function (sock, chatId, msg) {
    if (!chatId.endsWith('@g.us'))
        return sock.sendMessage(chatId, { text: '❌ Yeh command sirf groups mein use hoti hai.' }, { quoted: msg });
    try {
        const meta   = await sock.groupMetadata(chatId);
        const admins = meta.participants.filter(p => p.admin);
        if (!admins.length)
            return sock.sendMessage(chatId, { text: '❌ Is group mein koi admin nahi mila.' }, { quoted: msg });
        const lines = admins.map((a, i) =>
            `${i + 1}. @${a.id.split('@')[0]} — ${a.admin === 'superadmin' ? '👑 Super Admin' : '🛡️ Admin'}`
        );
        await sock.sendMessage(chatId, {
            text:
                `👮 *Group Admins — ${meta.subject}*\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                lines.join('\n') +
                `\n━━━━━━━━━━━━━━━━━━━━\n` +
                `📊 Total: *${admins.length}* admins`,
            mentions: admins.map(a => a.id),
        }, { quoted: msg });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ Error: ${e.message}` }, { quoted: msg });
    }
};
