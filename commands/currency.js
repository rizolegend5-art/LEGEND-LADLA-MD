const axios = require('axios');

module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '💱 *Currency Converter*\n\nUsage: .currency <amount> <FROM> <TO>\nExample: .currency 100 USD PKR\nExample: .currency 50 EUR USD' }, { quoted: msg });
    const parts = q.trim().split(' ');
    if (parts.length < 3) return sock.sendMessage(chatId, { text: '❌ Usage: .currency <amount> <FROM> <TO>\nExample: .currency 100 USD PKR' }, { quoted: msg });
    const amount = parseFloat(parts[0]);
    const from = parts[1].toUpperCase();
    const to = parts[2].toUpperCase();
    if (isNaN(amount)) return sock.sendMessage(chatId, { text: '❌ Invalid amount.' }, { quoted: msg });
    try {
        const res = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`);
        const rate = res.data.rates[to];
        if (!rate) throw new Error('Currency not found');
        const result = (amount * rate).toFixed(2);
        await sock.sendMessage(chatId, {
            text: `💱 *Currency Converter*\n\n💵 ${amount} ${from} = *${result} ${to}*\n\n📊 Rate: 1 ${from} = ${rate.toFixed(4)} ${to}`
        }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: `❌ Could not convert ${from} to ${to}. Check currency codes.\n\nExamples: USD, EUR, PKR, INR, GBP, AED, SAR` }, { quoted: msg });
    }
};
