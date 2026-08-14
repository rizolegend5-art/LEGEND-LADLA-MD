const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const settings = require('../settings');

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

async function vvdmCommand(sock, from, msg, isOwner) {
    if (!isOwner) return await sock.sendMessage(from, { text: "❌ Sirf bot owner ye command use kar sakta hai." }, { quoted: msg });

    // Loading reactions
    const loadEmojis = ['⏳', '🔓', '👁️', '📩'];
    for (const emoji of loadEmojis) {
        await sock.sendMessage(from, { react: { text: emoji, key: msg.key } });
    }

    const quoted = getQuotedMessage(msg.message);
    if (!quoted) return await sock.sendMessage(from, { text: "❌ Kisi View-Once message ko reply karo phir .vvdm type karo." }, { quoted: msg });

    const viewOnce = quoted.viewOnceMessageV2 || quoted.viewOnceMessage;
    const message = viewOnce ? viewOnce.message : quoted;
    let vType = Object.keys(message)[0];

    if (!['imageMessage', 'videoMessage', 'audioMessage'].includes(vType)) {
        return await sock.sendMessage(from, { text: "❌ Ye View-Once media nahi hai. Kisi View-Once image ya video ko reply karo." }, { quoted: msg });
    }

    const ownerJid = settings.ownerNumber + '@s.whatsapp.net';

    try {
        const stream = await downloadContentFromMessage(message[vType], vType.replace('Message', ''));
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        const caption = `📩 *View-Once Saved*\n\n` +
            `👤 From: ${msg.pushName || 'Unknown'}\n` +
            `📱 Number: ${msg.key.participant || msg.key.remoteJid}\n` +
            `📋 Type: ${vType.replace('Message', '').toUpperCase()}`;

        if (vType === 'imageMessage') {
            await sock.sendMessage(ownerJid, { image: buffer, caption });
        } else if (vType === 'videoMessage') {
            await sock.sendMessage(ownerJid, { video: buffer, caption });
        } else if (vType === 'audioMessage') {
            await sock.sendMessage(ownerJid, { audio: buffer, mimetype: 'audio/mp4', caption });
        }

        await sock.sendMessage(from, { text: `✅ *View-Once DM mein bhej diya gaya!*\n\n📩 Owner ke DM mein ${vType.replace('Message', '').toLowerCase()} save ho gaya.` }, { quoted: msg });
    } catch (e) {
        await sock.sendMessage(from, { text: `❌ View-Once DM mein bhej nahi hua: ${e.message}` }, { quoted: msg });
    }
}

module.exports = vvdmCommand;
