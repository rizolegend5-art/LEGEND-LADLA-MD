// cube.js — Calculate cube of a number
module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!q) return sock.sendMessage(chatId, { text: '❌ Usage: .cube <number>\nMisaal: .cube 5' }, { quoted: msg });
    const num = parseFloat(q);
    if (isNaN(num)) return sock.sendMessage(chatId, { text: '❌ Valid number dein.' }, { quoted: msg });
    await sock.sendMessage(chatId, {
        text:
            `🧊 *Cube Calculator*\n━━━━━━━━━━━━━━━━━━━━\n` +
            `🔢 Number:    *${num}*\n` +
            `📐 Cube (n³): *${Math.pow(num,3).toLocaleString()}*\n` +
            `📐 Square:    *${Math.pow(num,2).toLocaleString()}*\n` +
            `📐 Sqrt:      *${Math.sqrt(Math.abs(num)).toFixed(4)}*`,
    }, { quoted: msg });
};
