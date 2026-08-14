const axios = require('axios');

module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '📖 *Wikipedia Search*\n\nUsage: .wiki <topic>\nExample: .wiki Albert Einstein' }, { quoted: msg });
    try {
        const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);
        const data = res.data;
        if (data.type === 'disambiguation') throw new Error('disambiguation');
        const text = data.extract ? data.extract.substring(0, 800) + (data.extract.length > 800 ? '...' : '') : 'No summary available.';
        await sock.sendMessage(chatId, {
            text: `📖 *Wikipedia: ${data.title}*\n\n${text}\n\n🔗 ${data.content_urls?.desktop?.page || ''}`
        }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: `❌ No Wikipedia article found for "${q}". Try a different search term.` }, { quoted: msg });
    }
};
