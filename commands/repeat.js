module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '🔁 *Repeat Text*\n\nUsage: .repeat <times> <text>\nExample: .repeat 3 Hello World!' }, { quoted: msg });
    const parts = q.split(' ');
    const times = parseInt(parts[0]);
    const text = parts.slice(1).join(' ');
    if (isNaN(times) || times < 1 || times > 20) return sock.sendMessage(chatId, { text: '❌ Times must be between 1 and 20.' }, { quoted: msg });
    if (!text) return sock.sendMessage(chatId, { text: '❌ Please provide text to repeat.' }, { quoted: msg });
    const result = Array(times).fill(text).join('\n');
    await sock.sendMessage(chatId, { text: result }, { quoted: msg });
};
