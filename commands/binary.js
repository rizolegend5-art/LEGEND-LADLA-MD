module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '💻 *Binary Converter*\n\nUsage:\n.binary encode <text>\n.binary decode <binary>\n\nExample:\n.binary encode Hi\n.binary decode 01001000 01101001' }, { quoted: msg });
    const parts = q.split(' ');
    const mode = parts[0].toLowerCase();
    const text = parts.slice(1).join(' ');
    if (!text) return sock.sendMessage(chatId, { text: '❌ Please provide text.' }, { quoted: msg });
    try {
        if (mode === 'encode') {
            const result = text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
            await sock.sendMessage(chatId, { text: `💻 *Text → Binary*\n\nText: ${text}\n\n\`\`\`${result}\`\`\`` }, { quoted: msg });
        } else if (mode === 'decode') {
            const result = text.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');
            await sock.sendMessage(chatId, { text: `💻 *Binary → Text*\n\nBinary: ${text}\n\nText: ${result}` }, { quoted: msg });
        } else {
            await sock.sendMessage(chatId, { text: '❌ Mode must be "encode" or "decode".' }, { quoted: msg });
        }
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Invalid input.' }, { quoted: msg });
    }
};
