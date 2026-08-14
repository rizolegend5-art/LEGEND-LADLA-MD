module.exports = async function (sock, chatId, msg, isAdmin) {
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Only admins can use this command.' }, { quoted: msg });
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
    try {
        const code = await sock.groupInviteCode(chatId);
        await sock.sendMessage(chatId, {
            text: `🔗 *Group Invite Link*\n\nhttps://chat.whatsapp.com/${code}\n\n_Share this link to invite people to the group!_`
        }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to get group link. Make sure I am an admin.' }, { quoted: msg });
    }
};
