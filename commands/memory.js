module.exports = async function (sock, chatId, msg) {
    const sequences = [
        ['🔴','🔵','🟢','🟡'],
        ['⭐','🌙','☀️','❄️'],
        ['🎵','🎶','🎸','🎹'],
        ['🐶','🐱','🐭','🐹'],
        ['🍕','🍔','🍟','🌮']
    ];
    const seq = sequences[Math.floor(Math.random() * sequences.length)];
    const shuffled = [...seq].sort(() => Math.random() - 0.5);
    const pattern = Array.from({ length: 5 }, () => seq[Math.floor(Math.random() * seq.length)]);
    const patternStr = pattern.join(' ');
    await sock.sendMessage(chatId, {
        text: `🧠 *Memory Test!*\n\nMemorize this sequence:\n\n*${patternStr}*\n\nEmojis used: ${shuffled.join(' ')}\n\n_Reply with the sequence in order to test your memory!_\n\n||Answer: ${patternStr}||`
    }, { quoted: msg });
};
