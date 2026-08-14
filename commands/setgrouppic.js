// setgrouppic.js — Set group profile picture from replied image
function getQuotedMessage(m) {
    if (!m) return null;
    const types = ['extendedTextMessage', 'imageMessage', 'videoMessage', 'stickerMessage', 'audioMessage', 'documentMessage'];
    for (const t of types) {
        if (m[t]?.contextInfo?.quotedMessage) return m[t].contextInfo.quotedMessage;
    }
    if (m.ephemeralMessage?.message) return getQuotedMessage(m.ephemeralMessage.message);
    if (m.viewOnceMessage?.message) return getQuotedMessage(m.viewOnceMessage.message);
    if (m.viewOnceMessageV2?.message) return getQuotedMessage(m.viewOnceMessageV2.message);
    return null;
}

module.exports = async function (sock, chatId, msg, isAdmin) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Sirf group mein use karo.' }, { quoted: msg });
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Sirf admins group picture set kar sakte hain.' }, { quoted: msg });

    const groupMeta = await sock.groupMetadata(chatId);
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botAdmin = groupMeta.participants.find(p => p.id === botId)?.admin;
    if (!botAdmin) return sock.sendMessage(chatId, { text: '❌ Bot ko admin banana parhega.' }, { quoted: msg });

    const quoted = getQuotedMessage(msg.message);
    const imgMsg = quoted?.imageMessage || msg.message?.imageMessage;
    if (!imgMsg) return sock.sendMessage(chatId, { text: '❌ Kisi *image* ko reply karo aur phir .setgrouppic likho.' }, { quoted: msg });

    try {
        const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

        const stream = await downloadContentFromMessage(imgMsg, 'image');
        let buffer = Buffer.alloc(0);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        await sock.updateProfilePicture(chatId, buffer);
        await sock.sendMessage(chatId, { text: '✅ *Group picture update ho gaya!* 🖼️' }, { quoted: msg });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ Picture set fail: ${e.message}` }, { quoted: msg });
    }
};
