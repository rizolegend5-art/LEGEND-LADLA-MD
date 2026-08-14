// unlockgroup.js — Unlock group so all members can send messages
module.exports = async function (sock, chatId, msg, isAdmin) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Sirf group mein use karo.' }, { quoted: msg });
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Sirf admins group unlock kar sakte hain.' }, { quoted: msg });

    const groupMeta = await sock.groupMetadata(chatId);
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botAdmin = groupMeta.participants.find(p => p.id === botId)?.admin;
    if (!botAdmin) return sock.sendMessage(chatId, { text: '❌ Bot ko admin banana parhega.' }, { quoted: msg });

    try {
        await sock.groupSettingUpdate(chatId, 'not_announcement'); // All members can send
        await sock.sendMessage(chatId, {
            text: `🔓 *GROUP UNLOCKED*\n\n━━━━━━━━━━━━━━━━━━━━\n✅ Sab members message kar sakte hain\n🎉 Group normal mode mein hai\n\n🔒 Lock karne ke liye: *.lockgroup*\n━━━━━━━━━━━━━━━━━━━━`
        }, { quoted: msg });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ Group unlock fail: ${e.message}` }, { quoted: msg });
    }
};
