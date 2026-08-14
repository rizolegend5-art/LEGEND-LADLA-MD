const axios = require('axios');

module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '🎵 *Spotify Search*\n\nUsage: .spotify <song name>\nExample: .spotify Blinding Lights' }, { quoted: msg });
    try {
        const res = await axios.get(`https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=5`);
        const tracks = res.data.data;
        if (!tracks || tracks.length === 0) throw new Error('No results');
        const list = tracks.map((t, i) =>
            `${i + 1}. 🎵 *${t.title}*\n   👤 ${t.artist.name}\n   💿 ${t.album.title}\n   ⏱️ ${Math.floor(t.duration / 60)}:${String(t.duration % 60).padStart(2, '0')}`
        ).join('\n\n');
        await sock.sendMessage(chatId, {
            text: `🎵 *Music Search: "${q}"*\n\n${list}\n\n_Powered by Deezer_`
        }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: `❌ No results found for "${q}". Try a different search.` }, { quoted: msg });
    }
};
