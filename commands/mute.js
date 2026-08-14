module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Only admins can use this command.' }, { quoted: msg });
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ This command can only be used in groups.' }, { quoted: msg });

    const action = (q || '').toLowerCase();
    if (action === 'on') {
        try {
            await sock.groupSettingUpdate(chatId, 'announcement');
            await sock.sendMessage(chatId, { text: '🔇 *Group Muted!*\n\nOnly admins can send messages now.\n\n🔓 Unmute: *.mute off* or *.unmute*' }, { quoted: msg });
        } catch {
            await sock.sendMessage(chatId, { text: '❌ Failed to mute group. Make sure I am an admin.' }, { quoted: msg });
        }
    } else if (action === 'off') {
        try {
            await sock.groupSettingUpdate(chatId, 'not_announcement');
            await sock.sendMessage(chatId, { text: '🔊 *Group Unmuted!*\n\nAb sab members message kar sakte hain!\n🟢 Group normally chal raha hai.' }, { quoted: msg });
        } catch {
            await sock.sendMessage(chatId, { text: '❌ Failed to unmute group.' }, { quoted: msg });
        }
    } else {
        await sock.sendMessage(chatId, { text: '❌ Usage:\n.mute on — Group mute karo\n.mute off — Group unmute karo' }, { quoted: msg });
    }
};
