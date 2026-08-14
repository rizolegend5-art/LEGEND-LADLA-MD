// count.js — Show group member count
module.exports = async function (sock, chatId, msg) {
    if (!chatId.endsWith('@g.us'))
        return sock.sendMessage(chatId, { text: '❌ Sirf group mein use karo.' }, { quoted: msg });
    try {
        const meta    = await sock.groupMetadata(chatId);
        const total   = meta.participants.length;
        const admins  = meta.participants.filter(p => p.admin).length;
        await sock.sendMessage(chatId, {
            text:
                `👥 *Group Stats — ${meta.subject}*\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `🧑‍🤝‍🧑 *Total Members:*  ${total}\n` +
                `👮 *Admins:*          ${admins}\n` +
                `👤 *Regular Members:* ${total - admins}\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `📅 Created: ${new Date(meta.creation * 1000).toDateString()}`,
        }, { quoted: msg });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ Error: ${e.message}` }, { quoted: msg });
    }
};
