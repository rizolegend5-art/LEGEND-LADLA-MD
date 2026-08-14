module.exports = async function (sock, chatId, msg, q) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
    const sender = msg.key?.participant || msg.key?.remoteJid;
    const reason = q || 'No reason provided';
    try {
        const groupMeta = await sock.groupMetadata(chatId);
        const admins = groupMeta.participants.filter(p => p.admin).map(p => p.id);
        for (const admin of admins) {
            await sock.sendMessage(admin, {
                text: `🚨 *Report from Group*\n\n📌 Group: ${groupMeta.subject}\n👤 Reporter: @${sender?.split('@')[0]}\n📝 Reason: ${reason}\n\nPlease take action!`
            });
        }
        await sock.sendMessage(chatId, { text: '✅ Your report has been sent to the admins!' }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to send report.' }, { quoted: msg });
    }
};
