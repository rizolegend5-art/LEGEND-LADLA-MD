const axios = require('axios');

module.exports = async function (sock, chatId, msg, q) {
    const search = q || 'funny';
    try {
        const res = await axios.get(`https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=${encodeURIComponent(search)}&limit=10&rating=g`);
        const gifs = res.data.data;
        if (!gifs || gifs.length === 0) throw new Error('No results');
        const gif = gifs[Math.floor(Math.random() * gifs.length)];
        const url = gif.images.original.url;
        await sock.sendMessage(chatId, {
            video: { url },
            caption: `🎬 *GIF: ${search}*`,
            gifPlayback: true
        }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: `❌ Could not find GIF for "${search}". Try a different search!` }, { quoted: msg });
    }
};
