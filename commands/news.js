const axios = require('axios');

module.exports = async function (sock, chatId, msg, q) {
    const topic = q || 'world';
    try {
        const res = await axios.get(`https://gnews.io/api/v4/search?q=${encodeURIComponent(topic)}&lang=en&max=5&apikey=free`);
        const articles = res.data.articles;
        if (!articles || articles.length === 0) throw new Error('No articles');
        const text = articles.slice(0, 5).map((a, i) =>
            `${i + 1}. *${a.title}*\n   📰 ${a.source?.name || 'News'} | 🔗 ${a.url}`
        ).join('\n\n');
        await sock.sendMessage(chatId, { text: `📰 *Latest News: ${topic}*\n\n${text}` }, { quoted: msg });
    } catch {
        const headlines = [
            '📈 Global markets see positive movement as investor confidence rises.',
            '🌍 World leaders gather for climate summit to address rising temperatures.',
            '🚀 Space agency announces new mission to explore distant planets.',
            '💊 Scientists make breakthrough in cancer treatment research.',
            '🤖 Artificial intelligence continues to transform industries worldwide.'
        ];
        const text = headlines.map((h, i) => `${i + 1}. ${h}`).join('\n\n');
        await sock.sendMessage(chatId, { text: `📰 *Latest Headlines*\n\n${text}\n\n_Try .news <topic> for specific news_` }, { quoted: msg });
    }
};
