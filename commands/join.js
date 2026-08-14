module.exports = async function (sock, chatId, msg, isOwner, q) {
    if (!isOwner) return sock.sendMessage(chatId, { text: '❌ Only the bot owner can use this command.' }, { quoted: msg });
    if (!q) return sock.sendMessage(chatId, { text: '❌ Usage: .join <group invite link>\nExample: .join https://chat.whatsapp.com/XXXXX' }, { quoted: msg });
    const match = q.match(/chat\.whatsapp\.com\/([A-Za-z0-9]+)/);
    if (!match) return sock.sendMessage(chatId, { text: '❌ Invalid WhatsApp group invite link.' }, { quoted: msg });
    const code = match[1];
    try {
        await sock.groupAcceptInvite(code);
        await sock.sendMessage(chatId, { text: '✅ Successfully joined the group!' }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to join group. Link may be invalid or expired.' }, { quoted: msg });
    }
};
