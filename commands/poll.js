module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '📊 *Poll Creator*\n\nUsage: .poll Question | Option1 | Option2 | Option3\nExample: .poll Fav color? | Red | Blue | Green' }, { quoted: msg });
    const parts = q.split('|').map(p => p.trim()).filter(Boolean);
    if (parts.length < 3) return sock.sendMessage(chatId, { text: '❌ Need at least a question and 2 options.\nExample: .poll Best food? | Pizza | Burger | Biryani' }, { quoted: msg });
    const question = parts[0];
    const options = parts.slice(1, 9); // max 8 options
    const nums = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣'];
    const optText = options.map((o, i) => `${nums[i]} ${o}`).join('\n');
    await sock.sendMessage(chatId, {
        text: `📊 *POLL*\n\n❓ *${question}*\n\n${optText}\n\n_Vote by replying with the number!_`
    }, { quoted: msg });
};
