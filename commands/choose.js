// choose.js — Randomly choose from options
module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!q) return sock.sendMessage(chatId, { text: '❌ Usage: .choose option1 | option2 | option3\nMisaal: .choose chai | coffee | juice' }, { quoted: msg });
    const options = q.split('|').map(o => o.trim()).filter(Boolean);
    if (options.length < 2) return sock.sendMessage(chatId, { text: '❌ Kam se kam 2 options dein, | se alag kar ke.' }, { quoted: msg });
    const chosen = options[Math.floor(Math.random() * options.length)];
    await sock.sendMessage(chatId, {
        text:
            `🎯 *Random Choice*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `📋 Options:\n${options.map((o,i)=>`  ${i+1}. ${o}`).join('\n')}\n\n` +
            `✅ *Meri Choice:* *${chosen}* 🎉`,
    }, { quoted: msg });
};
