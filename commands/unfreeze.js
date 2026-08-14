// unfreeze.js — Unfreeze group (restore all members' messaging rights)
module.exports = async function (sock, chatId, msg, isAdmin) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Sirf group mein use karo.' }, { quoted: msg });
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Sirf admins group unfreeze kar sakte hain.' }, { quoted: msg });

    const groupMeta = await sock.groupMetadata(chatId);
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botAdmin = groupMeta.participants.find(p => p.id === botId)?.admin;
    if (!botAdmin) return sock.sendMessage(chatId, { text: '❌ Bot ko admin banana parhega.' }, { quoted: msg });

    try {
        await sock.groupSettingUpdate(chatId, 'not_announcement');
        await sock.sendMessage(chatId, {
            text: `🌡️ *GROUP UNFROZEN*\n\n${'━'.repeat(28)}\n✅ Group normal ho gaya!\n💬 Sab members ab message kar sakte hain\n🎉 Welcome back everyone!\n${'━'.repeat(28)}`
        }, { quoted: msg });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ Unfreeze fail: ${e.message}` }, { quoted: msg });
    }
};
