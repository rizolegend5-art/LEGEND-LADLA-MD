const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

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

async function vvCommand(sock, from, msg) {
    const loadEmojis = ['⏳', '🔓', '👁️'];
    for (const emoji of loadEmojis) {
        await sock.sendMessage(from, { react: { text: emoji, key: msg.key } });
    }
    const quoted = getQuotedMessage(msg.message);
    if (!quoted) return await sock.sendMessage(from, { text: "❌ Please reply to a View-Once message." }, { quoted: msg });

    const viewOnce = quoted.viewOnceMessageV2 || quoted.viewOnceMessage;
    const message = viewOnce ? viewOnce.message : quoted;
    let vType = Object.keys(message)[0];

    if (['imageMessage', 'videoMessage', 'audioMessage'].includes(vType)) {
        try {
            const stream = await downloadContentFromMessage(message[vType], vType.replace('Message', ''));
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
            
            if (vType === 'imageMessage') await sock.sendMessage(from, { image: buffer, caption: "✅ View-Once Image Downloaded" }, { quoted: msg });
            else if (vType === 'videoMessage') await sock.sendMessage(from, { video: buffer, caption: "✅ View-Once Video Downloaded" }, { quoted: msg });
            else if (vType === 'audioMessage') await sock.sendMessage(from, { audio: buffer, mimetype: 'audio/mp4' }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(from, { text: "❌ Failed to download View-Once media." }, { quoted: msg });
        }
    } else {
        await sock.sendMessage(from, { text: "❌ Not a View-Once media message." }, { quoted: msg });
    }
}

module.exports = vvCommand;
