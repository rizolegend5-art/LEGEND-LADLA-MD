module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '🧮 *Calculator*\n\nUsage: .calc <expression>\nExample: .calc 25 * 4 + 10' }, { quoted: msg });
    try {
        // Safe eval using Function (only allows math expressions)
        const sanitized = q.replace(/[^0-9+\-*/.() %]/g, '');
        if (!sanitized) throw new Error('Invalid expression');
        // eslint-disable-next-line no-new-func
        const result = Function('"use strict"; return (' + sanitized + ')')();
        if (!isFinite(result)) throw new Error('Result is not finite');
        await sock.sendMessage(chatId, {
            text: `🧮 *Calculator*\n\n📝 Expression: \`${q}\`\n✅ Result: *${result}*`
        }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Invalid math expression.\nExample: .calc 25 * 4 + 10' }, { quoted: msg });
    }
};
