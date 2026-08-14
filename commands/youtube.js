const axios = require('axios');

module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '▶️ *YouTube Search*\n\nUsage: .youtube <search query>\nExample: .youtube Dua Lipa Levitating' }, { quoted: msg });
    try {
        const res = await axios.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&sp=EgIQAQ%253D%253D`);
        const matches = res.data.match(/"videoId":"([^"]+)","thumbnail".*?"title":{"runs":\[{"text":"([^"]+)"}\].*?"viewCountText":{"simpleText":"([^"]+)"}/g);
        if (!matches || matches.length === 0) throw new Error('No results');
        const results = matches.slice(0, 5).map((m, i) => {
            const idMatch = m.match(/"videoId":"([^"]+)"/);
            const titleMatch = m.match(/"text":"([^"]+)"/);
            if (!idMatch || !titleMatch) return null;
            return `${i + 1}. *${titleMatch[1]}*\n   🔗 https://youtu.be/${idMatch[1]}`;
        }).filter(Boolean);
        await sock.sendMessage(chatId, {
            text: `▶️ *YouTube Results for "${q}"*\n\n${results.join('\n\n')}`
        }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, {
            text: `▶️ *YouTube Search*\n\nSearch: https://www.youtube.com/results?search_query=${encodeURIComponent(q)}\n\nCopy the link above to search YouTube!`
        }, { quoted: msg });
    }
};
