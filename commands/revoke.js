module.exports = async function (sock, chatId, msg, isAdmin) {
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Only admins can use this command.' }, { quoted: msg });
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
    try {
        await sock.groupRevokeInvite(chatId);
        await sock.sendMessage(chatId, { text: '🔄 *Group Link Revoked!*\n\nThe old invite link has been reset. Use .link to get the new link.' }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to revoke group link. Make sure I am an admin.' }, { quoted: msg });
    }
};
