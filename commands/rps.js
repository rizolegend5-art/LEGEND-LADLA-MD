module.exports = async function (sock, chatId, msg, q) {
    const choices = ['rock', 'paper', 'scissors'];
    const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
    const userChoice = q ? q.toLowerCase().trim() : null;
    if (!userChoice || !choices.includes(userChoice)) {
        return sock.sendMessage(chatId, { text: '🪨📄✂️ *Rock Paper Scissors*\n\nUsage: .rps rock | paper | scissors' }, { quoted: msg });
    }
    const botChoice = choices[Math.floor(Math.random() * 3)];
    let result;
    if (userChoice === botChoice) result = "🤝 It's a Tie!";
    else if ((userChoice === 'rock' && botChoice === 'scissors') || (userChoice === 'paper' && botChoice === 'rock') || (userChoice === 'scissors' && botChoice === 'paper')) result = '🎉 You Win!';
    else result = '🤖 Bot Wins!';
    await sock.sendMessage(chatId, {
        text: `🪨📄✂️ *Rock Paper Scissors*\n\nYou: ${emojis[userChoice]} ${userChoice}\nBot: ${emojis[botChoice]} ${botChoice}\n\n${result}`
    }, { quoted: msg });
};
