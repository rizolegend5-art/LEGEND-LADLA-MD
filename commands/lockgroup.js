// lockgroup.js — Lock/Unlock group with on/off toggle
module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Sirf group mein use karo.' }, { quoted: msg });
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Sirf admins lock/unlock kar sakte hain.' }, { quoted: msg });

    const groupMeta = await sock.groupMetadata(chatId);
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botAdmin = groupMeta.participants.find(p => p.id === botId)?.admin;
    if (!botAdmin) return sock.sendMessage(chatId, { text: '❌ Bot ko admin banana parhega.' }, { quoted: msg });

    const action = (q || '').toLowerCase();
    if (action === 'on') {
        try {
            await sock.groupSettingUpdate(chatId, 'announcement');
            await sock.sendMessage(chatId, {
                text: `🔒 *GROUP LOCKED*\n\n━━━━━━━━━━━━━━━━━━━━\n🚫 Sirf *Admins* message kar sakte hain\n👥 Regular members ke messages band hain\n\n📢 Unlock: *.lockgroup off* or *.unlockgroup*\n━━━━━━━━━━━━━━━━━━━━`
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: `❌ Lock fail: ${e.message}` }, { quoted: msg });
        }
    } else if (action === 'off') {
        try {
            await sock.groupSettingUpdate(chatId, 'not_announcement');
            await sock.sendMessage(chatId, {
                text: `🔓 *GROUP UNLOCKED*\n\n✅ Ab sab members message kar sakte hain!\n🟢 Group normally chal raha hai.`
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: `❌ Unlock fail: ${e.message}` }, { quoted: msg });
        }
    } else {
        await sock.sendMessage(chatId, { text: '❌ Usage:\n.lockgroup on — Group lock karo\n.lockgroup off — Group unlock karo' }, { quoted: msg });
    }
};
