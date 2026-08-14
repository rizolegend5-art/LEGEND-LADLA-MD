const axios = require('axios');

module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '🐦 *Twitter/X Downloader*\n\nUsage: .twitter <tweet URL>\nExample: .twitter https://twitter.com/user/status/123456' }, { quoted: msg });
    const isUrl = /twitter\.com|x\.com/i.test(q);
    if (!isUrl) return sock.sendMessage(chatId, { text: '❌ Please provide a valid Twitter/X URL.' }, { quoted: msg });
    try {
        const res = await axios.get(`https://api.dreaded.site/api/twitter?url=${encodeURIComponent(q)}`);
        const data = res.data;
        if (data?.result?.media?.[0]?.url) {
            const mediaUrl = data.result.media[0].url;
            await sock.sendMessage(chatId, { video: { url: mediaUrl }, caption: '🐦 Downloaded from Twitter/X' }, { quoted: msg });
        } else {
            throw new Error('No media');
        }
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to download Twitter/X media. Make sure the tweet contains media and the URL is correct.' }, { quoted: msg });
    }
};
