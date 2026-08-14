module.exports = async function (sock, chatId, msg, q) {
    if (!q || !q.includes('+')) return sock.sendMessage(chatId, { text: '💞 *Ship*\n\nUsage: .ship Name1 + Name2\nExample: .ship Ali + Sana' }, { quoted: msg });
    const parts = q.split('+');
    const n1 = parts[0].trim();
    const n2 = parts[1].trim();
    if (!n1 || !n2) return sock.sendMessage(chatId, { text: '❌ Please provide two names.' }, { quoted: msg });
    const pct = Math.floor(Math.random() * 101);
    const shipName = n1.substring(0, Math.ceil(n1.length / 2)) + n2.substring(Math.floor(n2.length / 2));
    const hearts = '❤️'.repeat(Math.round(pct / 20));
    let verdict;
    if (pct >= 90) verdict = '💍 SOULMATES! Perfect match made in heaven!';
    else if (pct >= 70) verdict = '💖 Amazing chemistry! You two are great together!';
    else if (pct >= 50) verdict = '💛 A good match! Work on it and it could be great!';
    else if (pct >= 30) verdict = '💚 Friendship zone for now! Maybe something more later?';
    else verdict = '💔 Not the best match... but hey, anything is possible!';
    await sock.sendMessage(chatId, {
        text: `💞 *Shipping: ${n1} × ${n2}*\n\n🚢 Ship Name: *${shipName}*\n\n${hearts} *${pct}%*\n\n${verdict}`
    }, { quoted: msg });
};
