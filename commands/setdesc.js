module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Only admins can use this command.' }, { quoted: msg });
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
    if (!q) return sock.sendMessage(chatId, { text: '❌ Usage: .setdesc <new description>' }, { quoted: msg });
    try {
        await sock.groupUpdateDescription(chatId, q);
        await sock.sendMessage(chatId, { text: `✅ *Group Description Updated!*\n\n📝 ${q}` }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to update description. Make sure I am an admin.' }, { quoted: msg });
    }
};
