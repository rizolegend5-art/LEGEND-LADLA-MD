// cm.js — Send custom message as bot (owner only)
module.exports = async function (sock, chatId, msg, isAdmin, q, isOwner) {
    if (!isOwner) return sock.sendMessage(chatId, { text: '❌ Sirf owner yeh command use kar sakta hai.' }, { quoted: msg });
    if (!q) return sock.sendMessage(chatId, { text: '❌ Usage: .cm <message>' }, { quoted: msg });
    await sock.sendMessage(chatId, { text: q });
};
