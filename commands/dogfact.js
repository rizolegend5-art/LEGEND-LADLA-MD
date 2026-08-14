const axios = require('axios');

module.exports = async function (sock, chatId, msg) {
    try {
        const res = await axios.get('https://dogapi.dog/api/v2/facts?limit=1');
        const fact = res.data.data[0].attributes.body;
        await sock.sendMessage(chatId, { text: `🐕 *Dog Fact!*\n\n${fact}` }, { quoted: msg });
    } catch {
        const facts = [
            'Dogs have a sense of smell 10,000–100,000 times stronger than humans. 👃',
            'The Labrador Retriever is the world\'s most popular dog breed.',
            'Dogs can understand up to 250 words and gestures.',
            'A dog\'s nose print is as unique as a human fingerprint.',
            'Dogs dream just like humans — their brain waves during sleep are similar.',
            'Puppies are born blind, deaf, and toothless.',
            'Dogs have three eyelids including a "third eyelid" called a nictitating membrane.'
        ];
        await sock.sendMessage(chatId, { text: `🐕 *Dog Fact!*\n\n${facts[Math.floor(Math.random() * facts.length)]}` }, { quoted: msg });
    }
};
