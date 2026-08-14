const axios = require('axios');

module.exports = async function (sock, chatId, msg) {
    try {
        const res = await axios.get('https://catfact.ninja/fact');
        await sock.sendMessage(chatId, { text: `🐱 *Cat Fact!*\n\n${res.data.fact}` }, { quoted: msg });
    } catch {
        const facts = [
            'Cats spend 70% of their lives sleeping. 😴',
            'A cat has 5 toes on front paws but only 4 on back paws.',
            'Cats can jump up to 6 times their own height.',
            'A group of cats is called a clowder.',
            'Cats have 32 muscles in each ear.',
            'The oldest cat ever lived to be 38 years old.',
            'Cats can rotate their ears 180 degrees.'
        ];
        await sock.sendMessage(chatId, { text: `🐱 *Cat Fact!*\n\n${facts[Math.floor(Math.random() * facts.length)]}` }, { quoted: msg });
    }
};
