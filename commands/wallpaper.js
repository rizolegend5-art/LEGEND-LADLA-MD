const axios = require('axios');

module.exports = async function (sock, chatId, msg, q) {
    const search = q || 'nature landscape';
    try {
        const res = await axios.get(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(search)}&client_id=K7TFHjpfN5oGkT4qM_NkRCidpDnCVjNz--j-L_sTTSQ&count=1`);
        const photo = Array.isArray(res.data) ? res.data[0] : res.data;
        const url = photo.urls?.regular || photo.urls?.full;
        const credit = photo.user?.name || 'Unknown';
        await sock.sendMessage(chatId, {
            image: { url },
            caption: `🖼️ *Wallpaper: ${search}*\n📸 Photo by ${credit} on Unsplash`
        }, { quoted: msg });
    } catch {
        // fallback to picsum
        try {
            const seed = Math.floor(Math.random() * 1000);
            await sock.sendMessage(chatId, {
                image: { url: `https://picsum.photos/seed/${seed}/1080/1920` },
                caption: `🖼️ *Random Wallpaper*`
            }, { quoted: msg });
        } catch {
            await sock.sendMessage(chatId, { text: '❌ Could not fetch wallpaper. Try again!' }, { quoted: msg });
        }
    }
};
