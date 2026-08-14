const axios = require('axios');

module.exports = async function (sock, chatId, msg) {
    try {
        const res = await axios.get('https://api.thecatapi.com/v1/images/search');
        const url = res.data[0].url;
        await sock.sendMessage(chatId, { image: { url }, caption: '🐱 *Here\'s a cute cat for you!*' }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to fetch cat image. Try again!' }, { quoted: msg });
    }
};
