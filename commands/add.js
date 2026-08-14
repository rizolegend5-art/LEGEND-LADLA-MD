// add.js — Add member to group
module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!chatId.endsWith('@g.us'))
        return sock.sendMessage(chatId, { text: '❌ Sirf group mein use karo.' }, { quoted: msg });
    if (!isAdmin)
        return sock.sendMessage(chatId, { text: '❌ Sirf admins member add kar sakte hain.' }, { quoted: msg });
    if (!q)
        return sock.sendMessage(chatId, { text: '❌ Usage: .add 923XXXXXXXXX' }, { quoted: msg });
    const number = q.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    try {
        const res = await sock.groupParticipantsUpdate(chatId, [number], 'add');
        const status = res?.[0]?.status;
        if (status === '200') {
            await sock.sendMessage(chatId, {
                text: `✅ @${number.split('@')[0]} ko group mein add kar diya!`,
                mentions: [number],
            }, { quoted: msg });
        } else if (status === '403') {
            await sock.sendMessage(chatId, { text: '❌ User ki privacy ON hai — directly add nahi ho sakta.' }, { quoted: msg });
        } else {
            await sock.sendMessage(chatId, { text: `⚠️ Add response: ${status}` }, { quoted: msg });
        }
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ Error: ${e.message}` }, { quoted: msg });
    }
};
