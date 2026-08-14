module.exports = async function (sock, chatId, msg) {
    const wordList = [
        { word: 'elephant', hint: 'A large animal with a trunk' },
        { word: 'rainbow', hint: 'Appears after rain with colors' },
        { word: 'keyboard', hint: 'Used for typing' },
        { word: 'butterfly', hint: 'A flying insect with colorful wings' },
        { word: 'mountain', hint: 'A large natural elevation of earth' },
        { word: 'chocolate', hint: 'A sweet food made from cocoa' },
        { word: 'telephone', hint: 'A device for communication' },
        { word: 'adventure', hint: 'An exciting or unusual experience' },
        { word: 'universe', hint: 'All existing matter and space' },
        { word: 'waterfall', hint: 'Water flowing over a cliff' }
    ];
    const item = wordList[Math.floor(Math.random() * wordList.length)];
    const scrambled = item.word.split('').sort(() => Math.random() - 0.5).join('');
    await sock.sendMessage(chatId, {
        text: `🔀 *Word Scramble!*\n\n🔡 Scrambled: *${scrambled.toUpperCase()}*\n💡 Hint: _${item.hint}_\n\n_Unscramble the word!_\n\n||Answer: ${item.word}||`
    }, { quoted: msg });
};
