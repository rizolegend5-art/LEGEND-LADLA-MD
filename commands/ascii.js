// ascii.js — Convert text to block ASCII art
module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!q) return sock.sendMessage(chatId, { text: '❌ Usage: .ascii <text>\nMisaal: .ascii MASOOM' }, { quoted: msg });
    const text   = q.toUpperCase().slice(0, 20);
    const blocks = text.split('').map(c => c === ' ' ? '   ' : `[${c}]`).join('');
    await sock.sendMessage(chatId, {
        text:
            `🔤 *ASCII ART*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n\n` +
            `${blocks}\n\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `Input: "${q.slice(0, 20)}"`,
    }, { quoted: msg });
};
