module.exports = async function (sock, chatId, msg, q) {
    const sides = parseInt(q) || 6;
    if (sides < 2 || sides > 1000) return sock.sendMessage(chatId, { text: '🎲 Dice sides must be between 2 and 1000.\nUsage: .dice [sides]\nExample: .dice 20' }, { quoted: msg });
    const result = Math.floor(Math.random() * sides) + 1;
    await sock.sendMessage(chatId, {
        text: `🎲 *Dice Roll (d${sides})*\n\nYou rolled: *${result}*`
    }, { quoted: msg });
};
