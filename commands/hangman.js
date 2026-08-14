module.exports = async function (sock, chatId, msg) {
    const words = [
        { word: 'python', hint: 'A programming language 🐍' },
        { word: 'whatsapp', hint: 'A messaging app 💬' },
        { word: 'elephant', hint: 'A large mammal 🐘' },
        { word: 'keyboard', hint: 'Used for typing ⌨️' },
        { word: 'rainbow', hint: 'Appears after rain 🌈' },
        { word: 'diamond', hint: 'A precious gem 💎' },
        { word: 'laptop', hint: 'A portable computer 💻' },
        { word: 'football', hint: 'A popular sport ⚽' },
        { word: 'sunshine', hint: 'Natural light ☀️' },
        { word: 'chocolate', hint: 'A sweet treat 🍫' }
    ];
    const item = words[Math.floor(Math.random() * words.length)];
    const display = item.word.split('').map((c, i) => i === 0 || i === item.word.length - 1 ? c : '_').join(' ');
    const stages = ['```\n  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========```', '```\n  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========```', '```\n  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========```'];
    await sock.sendMessage(chatId, {
        text: `🎮 *HANGMAN GAME*\n\n${stages[0]}\n\n💡 Hint: _${item.hint}_\n\nWord: *${display}*\n(${item.word.length} letters)\n\n_Reply with letter guesses! The word is hidden below:_\n||Answer: ${item.word}||`
    }, { quoted: msg });
};
