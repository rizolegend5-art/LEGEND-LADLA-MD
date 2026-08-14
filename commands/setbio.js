module.exports = async function (sock, chatId, msg, isOwner, q) {
    if (!isOwner) return sock.sendMessage(chatId, { text: '❌ Only the bot owner can use this command.' }, { quoted: msg });
    if (!q) return sock.sendMessage(chatId, { text: '❌ Usage: .setbio <new bio text>' }, { quoted: msg });
    try {
        await sock.updateProfileStatus(q);
        await sock.sendMessage(chatId, { text: `✅ *Bot Bio Updated!*\n\n📝 ${q}` }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to update bio.' }, { quoted: msg });
    }
};
