const axios = require('axios');

module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '📚 *Dictionary*\n\nUsage: .define <word>\nExample: .define serendipity' }, { quoted: msg });
    try {
        const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(q.trim())}`);
        const data = res.data[0];
        const word = data.word;
        const phonetic = data.phonetic || '';
        const meanings = data.meanings.slice(0, 2).map(m => {
            const defs = m.definitions.slice(0, 2).map((d, i) => `  ${i + 1}. ${d.definition}`).join('\n');
            return `📌 *${m.partOfSpeech}*\n${defs}`;
        }).join('\n\n');
        await sock.sendMessage(chatId, {
            text: `📚 *Definition: ${word}* ${phonetic}\n\n${meanings}`
        }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: `❌ No definition found for "${q}".` }, { quoted: msg });
    }
};
