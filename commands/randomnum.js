module.exports = async function (sock, chatId, msg, q) {
    let min = 1, max = 100;
    if (q) {
        const parts = q.trim().split(/\s+/);
        if (parts.length === 1) { max = parseInt(parts[0]); }
        else if (parts.length >= 2) { min = parseInt(parts[0]); max = parseInt(parts[1]); }
    }
    if (isNaN(min) || isNaN(max) || min >= max) return sock.sendMessage(chatId, { text: '🎲 *Random Number*\n\nUsage: .randomnum [max] OR .randomnum [min] [max]\nExample: .randomnum 50\nExample: .randomnum 10 99' }, { quoted: msg });
    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    await sock.sendMessage(chatId, {
        text: `🎲 *Random Number*\n\nRange: ${min} – ${max}\nResult: *${result}*`
    }, { quoted: msg });
};
