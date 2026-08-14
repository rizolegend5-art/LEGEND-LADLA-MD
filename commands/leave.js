const settings = require('../settings');

module.exports = async function (sock, chatId, msg, isOwner) {
    if (!isOwner) return sock.sendMessage(chatId, { text: '❌ Only the bot owner can use this command.' }, { quoted: msg });
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
    await sock.sendMessage(chatId, { text: '👋 *Leaving group. Goodbye!*' });
    try {
        await sock.groupLeave(chatId);
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to leave the group.' }, { quoted: msg });
    }
};
