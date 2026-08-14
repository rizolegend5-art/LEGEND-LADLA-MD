// divide.js — Divide two numbers
module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!q) return sock.sendMessage(chatId, { text: '❌ Usage: .divide <a> <b>\nMisaal: .divide 100 4' }, { quoted: msg });
    const [a, b] = q.split(/\s+/).map(Number);
    if (isNaN(a) || isNaN(b)) return sock.sendMessage(chatId, { text: '❌ Do valid numbers dein.' }, { quoted: msg });
    if (b === 0) return sock.sendMessage(chatId, { text: '❌ Zero se taqseem nahi hoti! 🚫' }, { quoted: msg });
    await sock.sendMessage(chatId, {
        text:
            `➗ *Division*\n━━━━━━━━━━━━━━━━━━━━\n` +
            `🔢 *${a} ÷ ${b}*\n✅ *Result: ${a/b}*\n📊 *Remainder: ${a%b}*`,
    }, { quoted: msg });
};
