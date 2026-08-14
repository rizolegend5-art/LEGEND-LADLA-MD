module.exports = async function (sock, chatId, msg) {
    const board = [
        ['1️⃣','2️⃣','3️⃣'],
        ['4️⃣','5️⃣','6️⃣'],
        ['7️⃣','8️⃣','9️⃣']
    ];
    const display = board.map(row => row.join(' ')).join('\n');
    await sock.sendMessage(chatId, {
        text: `🎮 *TIC-TAC-TOE*\n\n${display}\n\n*You:* ❌  |  *Bot:* ⭕\n\n_Reply with a number (1-9) to place your ❌_\n_Bot will play ⭕ automatically_\n\nExample: Reply *5* to play center!`
    }, { quoted: msg });
};
