module.exports = async function (sock, chatId, msg) {
    const target = msg.message?.extendedTextMessage?.contextInfo?.participant ||
                   msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
                   msg.key?.remoteJid;
    try {
        const status = await sock.fetchStatus(target);
        const bio = status?.status || 'No bio set.';
        await sock.sendMessage(chatId, {
            text: `📝 *Bio / Status*\n\n👤 @${target.split('@')[0]}\n\n💬 ${bio}`,
            mentions: [target]
        }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Could not fetch bio. The user may have privacy settings enabled.' }, { quoted: msg });
    }
};
