module.exports = async function (sock, chatId, msg, q) {
    if (!q) {
        const secret = Math.floor(Math.random() * 100) + 1;
        await sock.sendMessage(chatId, {
            text: `🎮 *Guess the Number!*\n\nI'm thinking of a number between *1 and 100*!\n\nType: .guessnumber <your guess>\nExample: .guessnumber 42\n\n||Secret number: ${secret}||`
        }, { quoted: msg });
        return;
    }
    const guess = parseInt(q);
    if (isNaN(guess) || guess < 1 || guess > 100) return sock.sendMessage(chatId, { text: '❌ Guess must be between 1 and 100.' }, { quoted: msg });
    const secret = Math.floor(Math.random() * 100) + 1;
    let result;
    const diff = Math.abs(guess - secret);
    if (diff === 0) result = `🎉 *PERFECT!* You guessed it! The number was *${secret}*!`;
    else if (diff <= 5) result = `🔥 *So close!* The number was *${secret}*. You were only ${diff} away!`;
    else if (diff <= 15) result = `😮 *Not bad!* The number was *${secret}*. Try again!`;
    else if (diff <= 30) result = `😅 *Getting warmer!* The number was *${secret}*.`;
    else result = `❄️ *Cold!* The number was *${secret}*. Way off!`;
    await sock.sendMessage(chatId, {
        text: `🎮 *Guess the Number!*\n\n❓ Your guess: *${guess}*\n🎯 Secret: *${secret}*\n\n${result}`
    }, { quoted: msg });
};
