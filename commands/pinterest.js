const axios = require('axios');

module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '📌 *Pinterest Image Search*\n\nUsage: .pinterest <search query>\nExample: .pinterest aesthetic sunset' }, { quoted: msg });
    try {
        const res = await axios.get(`https://api.dreaded.site/api/pinterest?search=${encodeURIComponent(q)}`);
        const images = res.data?.result;
        if (!images || images.length === 0) throw new Error('No results');
        const img = images[Math.floor(Math.random() * Math.min(images.length, 10))];
        await sock.sendMessage(chatId, {
            image: { url: img },
            caption: `📌 *Pinterest: ${q}*`
        }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, {
            text: `📌 *Pinterest Search*\n\nSearch on Pinterest: https://pinterest.com/search/pins/?q=${encodeURIComponent(q)}`
        }, { quoted: msg });
    }
};
