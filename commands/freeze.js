// freeze.js — Freeze/Unfreeze group with on/off toggle
module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Sirf group mein use karo.' }, { quoted: msg });
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Sirf admins freeze/unfreeze kar sakte hain.' }, { quoted: msg });

    const groupMeta = await sock.groupMetadata(chatId);
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botAdmin = groupMeta.participants.find(p => p.id === botId)?.admin;
    if (!botAdmin) return sock.sendMessage(chatId, { text: '❌ Bot ko admin banana parhega.' }, { quoted: msg });

    const action = (q || '').toLowerCase();
    if (action === 'on') {
        const reason = q?.split(' ').slice(1).join(' ') || 'Admin ne freeze kiya hai';
        try {
            await sock.groupSettingUpdate(chatId, 'announcement');
            await sock.sendMessage(chatId, {
                text: `❄️ *GROUP FROZEN*\n\n${'━'.repeat(28)}\n🚨 *Reason:* ${reason}\n\n🔇 Sab messages band hain\n👮 Sirf admins bol sakte hain\n⏳ Unfreeze hone tak wait karo\n${'━'.repeat(28)}\n\n🔓 Unfreeze: *.freeze off*`
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: `❌ Freeze fail: ${e.message}` }, { quoted: msg });
        }
    } else if (action === 'off') {
        try {
            await sock.groupSettingUpdate(chatId, 'not_announcement');
            await sock.sendMessage(chatId, {
                text: `🔓 *GROUP UNFROZEN*\n\n✅ Ab sab members message kar sakte hain!\n🟢 Group normally chal raha hai.`
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: `❌ Unfreeze fail: ${e.message}` }, { quoted: msg });
        }
    } else {
        await sock.sendMessage(chatId, { text: '❌ Usage:\n.freeze on — Group freeze karo\n.freeze off — Group unfreeze karo' }, { quoted: msg });
    }
};
