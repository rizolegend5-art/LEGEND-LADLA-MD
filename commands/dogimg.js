const axios = require('axios');

module.exports = async function (sock, chatId, msg) {
    try {
        const res = await axios.get('https://dog.ceo/api/breeds/image/random');
        const url = res.data.message;
        await sock.sendMessage(chatId, { image: { url }, caption: '🐕 *Here\'s an adorable dog for you!*' }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to fetch dog image. Try again!' }, { quoted: msg });
    }
};
