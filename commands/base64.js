module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '🔢 *Base64 Encoder/Decoder*\n\nUsage:\n.base64 encode <text>\n.base64 decode <text>\n\nExample:\n.base64 encode Hello World\n.base64 decode SGVsbG8gV29ybGQ=' }, { quoted: msg });
    const parts = q.split(' ');
    const mode = parts[0].toLowerCase();
    const text = parts.slice(1).join(' ');
    if (!text) return sock.sendMessage(chatId, { text: '❌ Please provide text to encode/decode.' }, { quoted: msg });
    try {
        if (mode === 'encode') {
            const result = Buffer.from(text, 'utf8').toString('base64');
            await sock.sendMessage(chatId, { text: `🔢 *Base64 Encoded*\n\nInput: \`${text}\`\nOutput:\n\`\`\`${result}\`\`\`` }, { quoted: msg });
        } else if (mode === 'decode') {
            const result = Buffer.from(text, 'base64').toString('utf8');
            await sock.sendMessage(chatId, { text: `🔢 *Base64 Decoded*\n\nInput: \`${text}\`\nOutput:\n\`\`\`${result}\`\`\`` }, { quoted: msg });
        } else {
            await sock.sendMessage(chatId, { text: '❌ Mode must be "encode" or "decode".\nExample: .base64 encode Hello' }, { quoted: msg });
        }
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to process. Make sure the text is valid.' }, { quoted: msg });
    }
};
