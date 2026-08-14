module.exports = async function (sock, chatId, msg, isOwner, q) {
    if (!isOwner) return sock.sendMessage(chatId, { text: '❌ Only the bot owner can use this command.' }, { quoted: msg });
    if (!q) return sock.sendMessage(chatId, { text: '❌ Usage: .broadcast <message>' }, { quoted: msg });
    try {
        const chats = await sock.groupFetchAllParticipating();
        const groupIds = Object.keys(chats);
        let sent = 0;
        for (const gid of groupIds) {
            try {
                await sock.sendMessage(gid, { text: `📢 *Broadcast Message*\n\n${q}` });
                sent++;
                await new Promise(r => setTimeout(r, 500));
            } catch {}
        }
        await sock.sendMessage(chatId, { text: `✅ Broadcast sent to *${sent}* groups!` }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to broadcast.' }, { quoted: msg });
    }
};
