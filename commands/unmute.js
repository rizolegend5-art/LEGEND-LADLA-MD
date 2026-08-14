module.exports = async function (sock, chatId, msg, isAdmin) {
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Only admins can use this command.' }, { quoted: msg });
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
    try {
        await sock.groupSettingUpdate(chatId, 'not_announcement');
        await sock.sendMessage(chatId, { text: '🔊 *Group Unmuted!*\n\nAll members can send messages now.' }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to unmute group. Make sure I am an admin.' }, { quoted: msg });
    }
};
