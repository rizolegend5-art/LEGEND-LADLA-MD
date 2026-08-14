module.exports = async function (sock, chatId, msg, q) {
    if (!q || !q.includes('+')) return sock.sendMessage(chatId, { text: '💕 *Love Calculator*\n\nUsage: .lovecalc Name1 + Name2\nExample: .lovecalc Ahmed + Sara' }, { quoted: msg });
    const parts = q.split('+');
    const name1 = parts[0].trim();
    const name2 = parts[1].trim();
    if (!name1 || !name2) return sock.sendMessage(chatId, { text: '❌ Please provide two names.\nExample: .lovecalc Ahmed + Sara' }, { quoted: msg });
    const percent = Math.floor(Math.random() * 101);
    let emoji, msg2;
    if (percent >= 90) { emoji = '💍'; msg2 = 'PERFECT MATCH! Get married already! 😍'; }
    else if (percent >= 70) { emoji = '❤️'; msg2 = 'Great chemistry! 😘'; }
    else if (percent >= 50) { emoji = '💛'; msg2 = 'There\'s a spark! Give it a chance. 😊'; }
    else if (percent >= 30) { emoji = '💚'; msg2 = 'Just friends for now! 🤝'; }
    else { emoji = '💔'; msg2 = 'Better luck next time! 😅'; }
    const bar = '█'.repeat(Math.floor(percent / 10)) + '░'.repeat(10 - Math.floor(percent / 10));
    await sock.sendMessage(chatId, {
        text: `${emoji} *Love Calculator*\n\n💑 ${name1} ❤️ ${name2}\n\n[${bar}] *${percent}%*\n\n${msg2}`
    }, { quoted: msg });
};
