module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '🏛️ *Roman Numeral Converter*\n\nUsage: .roman <number>\nExample: .roman 2024' }, { quoted: msg });
    const num = parseInt(q.trim());
    if (isNaN(num) || num < 1 || num > 3999) return sock.sendMessage(chatId, { text: '❌ Please enter a number between 1 and 3999.' }, { quoted: msg });
    const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
    const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
    let result = '';
    let n = num;
    for (let i = 0; i < vals.length; i++) {
        while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
    }
    await sock.sendMessage(chatId, {
        text: `🏛️ *Roman Numerals*\n\n🔢 ${num} → *${result}*`
    }, { quoted: msg });
};
