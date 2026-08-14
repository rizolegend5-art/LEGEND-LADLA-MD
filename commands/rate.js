module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '⭐ *Rate Anything*\n\nUsage: .rate <thing>\nExample: .rate Pizza' }, { quoted: msg });
    const score = Math.floor(Math.random() * 101);
    const stars = '⭐'.repeat(Math.round(score / 20));
    let comment;
    if (score >= 90) comment = 'Absolutely incredible! 🔥';
    else if (score >= 70) comment = 'Pretty great! 👍';
    else if (score >= 50) comment = 'Not bad, could be better. 🤷';
    else if (score >= 30) comment = 'Hmm, needs improvement. 😐';
    else comment = 'Oh no... that\'s rough. 💀';
    await sock.sendMessage(chatId, {
        text: `⭐ *Rating: ${q}*\n\n${stars}\n\nScore: *${score}/100*\n\n${comment}`
    }, { quoted: msg });
};
