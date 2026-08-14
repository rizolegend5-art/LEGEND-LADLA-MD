module.exports = async function (sock, chatId, msg) {
    const sender = msg.key?.participant || msg.key?.remoteJid;
    const name = msg.pushName || 'Unknown';
    const isGroup = chatId.endsWith('@g.us');
    let isAdmin = false;
    if (isGroup) {
        try {
            const meta = await sock.groupMetadata(chatId);
            const me = meta.participants.find(p => p.id === sender);
            isAdmin = !!(me && me.admin);
        } catch {}
    }
    await sock.sendMessage(chatId, {
        text: `👤 *Who Am I?*\n\n📛 Name: *${name}*\n📱 Number: *${sender?.split('@')[0]}*\n🌐 Chat Type: *${isGroup ? 'Group' : 'Private'}*${isGroup ? `\n🛡️ Admin: *${isAdmin ? 'Yes ✅' : 'No ❌'}*` : ''}`
    }, { quoted: msg });
};
