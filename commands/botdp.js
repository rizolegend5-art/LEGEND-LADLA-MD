// .botdp command — Owner only: change bot's profile picture
// Usage: Reply to an image with .botdp  OR  .botdp <image-url>

const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = async function (sock, from, msg, q) {
    try {
        // Reaction to show processing
        await sock.sendMessage(from, { react: { text: '⏳', key: msg.key } });

        let imgBuffer = null;

        // Priority 1: Replied image message
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (quoted) {
            const imgMsg = quoted.imageMessage || quoted.viewOnceMessage?.message?.imageMessage;
            if (imgMsg) {
                try {
                    const stream = await downloadContentFromMessage(imgMsg, 'image');
                    let buffer = Buffer.from([]);
                    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
                    imgBuffer = buffer;
                } catch (e) { /* try next method */ }
            }
        }

        // Priority 2: Direct image message
        if (!imgBuffer && msg.message?.imageMessage) {
            try {
                const stream = await downloadContentFromMessage(msg.message.imageMessage, 'image');
                let buffer = Buffer.from([]);
                for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
                imgBuffer = buffer;
            } catch (e) { /* try next method */ }
        }

        // Priority 3: URL provided in text
        if (!imgBuffer && q && q.startsWith('http')) {
            try {
                const axios = require('axios');
                const response = await axios.get(q.trim(), { responseType: 'arraybuffer' });
                imgBuffer = Buffer.from(response.data);
            } catch (e) {
                return await sock.sendMessage(from, { text: '❌ URL se image download nahi ho saki: ' + e.message }, { quoted: msg });
            }
        }

        if (!imgBuffer) {
            return await sock.sendMessage(from, {
                text: '❌ *Botdp Command Usage:*\n\n' +
                      '1️⃣ Kisi image ko reply karen `.botdp` likh kar\n' +
                      '2️⃣ Ya URL dain: `.botdp https://example.com/image.jpg`'
            }, { quoted: msg });
        }

        await sock.updateProfilePicture(sock.user.id, imgBuffer);
        await sock.sendMessage(from, { react: { text: '✅', key: msg.key } });
        await sock.sendMessage(from, { text: '✅ *Bot ki DP successfully update ho gayi!* 🎉' }, { quoted: msg });

    } catch (e) {
        await sock.sendMessage(from, { text: '❌ DP update fail: ' + e.message }, { quoted: msg });
    }
};
