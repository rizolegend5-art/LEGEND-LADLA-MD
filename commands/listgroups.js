module.exports = async function (sock, chatId, msg, isOwner) {
    if (!isOwner) return sock.sendMessage(chatId, { text: '❌ Only the bot owner can use this command.' }, { quoted: msg });
    try {
        const chats = await sock.groupFetchAllParticipating();
        const groups = Object.values(chats);
        if (groups.length === 0) return sock.sendMessage(chatId, { text: '📋 Bot is not in any groups.' }, { quoted: msg });
        const list = groups.map((g, i) => `${i + 1}. *${g.subject}* (${g.participants.length} members)`).join('\n');
        await sock.sendMessage(chatId, {
            text: `📋 *Bot's Groups (${groups.length})*\n\n${list}`
        }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to fetch groups.' }, { quoted: msg });
    }
};
