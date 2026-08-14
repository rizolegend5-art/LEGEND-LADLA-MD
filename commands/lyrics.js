const axios = require('axios');

module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '🎵 *Lyrics Finder*\n\nUsage: .lyrics <song name> - <artist>\nExample: .lyrics Blinding Lights - The Weeknd' }, { quoted: msg });
    try {
        let artist = '', title = q;
        if (q.includes(' - ')) { [title, artist] = q.split(' - ').map(s => s.trim()); }
        const searchUrl = artist
            ? `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
            : `https://api.lyrics.ovh/suggest/${encodeURIComponent(title)}`;
        if (artist) {
            const res = await axios.get(searchUrl);
            const lyrics = res.data.lyrics;
            const truncated = lyrics.length > 3000 ? lyrics.substring(0, 3000) + '\n...[truncated]' : lyrics;
            await sock.sendMessage(chatId, { text: `🎵 *Lyrics: ${title}*\n${artist ? `👤 ${artist}\n` : ''}\n${truncated}` }, { quoted: msg });
        } else {
            const res = await axios.get(searchUrl);
            const song = res.data.data[0];
            if (!song) throw new Error('Not found');
            const lRes = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(song.artist.name)}/${encodeURIComponent(song.title)}`);
            const lyrics = lRes.data.lyrics;
            const truncated = lyrics.length > 3000 ? lyrics.substring(0, 3000) + '\n...[truncated]' : lyrics;
            await sock.sendMessage(chatId, { text: `🎵 *Lyrics: ${song.title}*\n👤 ${song.artist.name}\n\n${truncated}` }, { quoted: msg });
        }
    } catch {
        await sock.sendMessage(chatId, { text: `❌ Lyrics not found for "${q}".\n\nTip: Try .lyrics Song Name - Artist Name` }, { quoted: msg });
    }
};
