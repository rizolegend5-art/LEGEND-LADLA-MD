module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '⏳ *Countdown*\n\nUsage: .countdown <DD-MM-YYYY> [Event Name]\nExample: .countdown 01-01-2026 New Year!' }, { quoted: msg });
    const parts = q.split(' ');
    const datePart = parts[0];
    const event = parts.slice(1).join(' ') || 'Your Event';
    const [day, month, year] = datePart.split('-').map(Number);
    const target = new Date(year, month - 1, day);
    if (isNaN(target.getTime())) return sock.sendMessage(chatId, { text: '❌ Invalid date. Use DD-MM-YYYY format.\nExample: .countdown 01-01-2026 New Year' }, { quoted: msg });
    const now = new Date();
    const diff = target - now;
    if (diff < 0) return sock.sendMessage(chatId, { text: `⌛ *${event}* has already passed!` }, { quoted: msg });
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const bar = '█'.repeat(Math.max(0, Math.min(10, Math.floor((1 - days / 365) * 10)))) + '░'.repeat(Math.max(0, 10 - Math.floor((1 - days / 365) * 10)));
    await sock.sendMessage(chatId, {
        text: `⏳ *Countdown to ${event}*\n\n📅 Target: *${day}-${month}-${year}*\n\n[${bar}]\n\n⏱️ *${days} days, ${hours} hours, ${minutes} minutes* remaining!`
    }, { quoted: msg });
};
