module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '📡 *Morse Code*\n\nUsage: .morse <text>\nExample: .morse Hello World' }, { quoted: msg });
    const morseMap = { A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.' };
    const morse = q.toUpperCase().split('').map(c => c === ' ' ? '/' : (morseMap[c] || c)).join(' ');
    await sock.sendMessage(chatId, {
        text: `📡 *Morse Code*\n\nText: ${q}\n\nMorse:\n\`\`\`${morse}\`\`\``
    }, { quoted: msg });
};
