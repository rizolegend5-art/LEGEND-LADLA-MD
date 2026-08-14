// compatibility.js — Love compatibility checker
module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!q || !q.includes('|'))
        return sock.sendMessage(chatId, { text: '❌ Usage: .compatibility Name1 | Name2\nMisaal: .compatibility Ali | Sara' }, { quoted: msg });
    const [name1, name2] = q.split('|').map(n => n.trim());
    if (!name1 || !name2) return sock.sendMessage(chatId, { text: '❌ Dono names dein.' }, { quoted: msg });
    const seed = (name1 + name2).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const pct  = (seed % 51) + 50;
    const hearts = '❤️'.repeat(Math.round(pct / 10)) + '🖤'.repeat(10 - Math.round(pct / 10));
    const result = pct >= 90 ? '💍 Perfect match! Shaadi kar lo!' : pct >= 75 ? '😍 Bohot acha match!' : pct >= 60 ? '😊 Acha match — try karo!' : '😅 Thoda mushkil hai...';
    await sock.sendMessage(chatId, {
        text:
            `💑 *Love Compatibility*\n━━━━━━━━━━━━━━━━━━━━\n` +
            `❤️ *${name1}* + *${name2}*\n\n${hearts}\n` +
            `🔢 *Score:* ${pct}%\n\n💬 *Result:* ${result}`,
    }, { quoted: msg });
};
