module.exports = async function (sock, chatId, msg) {
    const result = Math.random() < 0.5 ? '🪙 HEADS' : '🪙 TAILS';
    await sock.sendMessage(chatId, {
        text: `🪙 *Coin Flip*\n\nFlipping... 🌀\n\nResult: *${result}*`
    }, { quoted: msg });
};
