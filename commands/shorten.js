const axios = require('axios');

module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '🔗 *URL Shortener*\n\nUsage: .shorten <URL>\nExample: .shorten https://www.youtube.com/watch?v=dQw4w9WgXcQ' }, { quoted: msg });
    const url = q.trim();
    if (!/^https?:\/\//i.test(url)) return sock.sendMessage(chatId, { text: '❌ Please provide a valid URL starting with http:// or https://' }, { quoted: msg });
    try {
        const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        await sock.sendMessage(chatId, {
            text: `🔗 *URL Shortener*\n\n📎 Original: ${url}\n✂️ Shortened: *${res.data}*`
        }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to shorten URL. Please check the URL and try again.' }, { quoted: msg });
    }
};
