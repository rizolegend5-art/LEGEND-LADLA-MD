const axios = require('axios');

module.exports = async function (sock, chatId, msg) {
    try {
        const res = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
        const item = res.data.results[0];
        const decode = s => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#039;/g, "'").replace(/&quot;/g, '"');
        const question = decode(item.question);
        const correct = decode(item.correct_answer);
        const all = [...item.incorrect_answers.map(decode), correct].sort(() => Math.random() - 0.5);
        const labels = ['A', 'B', 'C', 'D'];
        const optsText = all.map((o, i) => `${labels[i]}. ${o}`).join('\n');
        const ansIdx = all.indexOf(correct);
        await sock.sendMessage(chatId, {
            text: `🎯 *Trivia Question*\n📚 Category: ${decode(item.category)}\n⭐ Difficulty: ${item.difficulty}\n\n❓ ${question}\n\n${optsText}\n\n||Answer: ${labels[ansIdx]}. ${correct}||`
        }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, {
            text: '🎯 *Trivia*\n\n❓ What is the tallest mountain in the world?\n\nA. K2\nB. Mount Kilimanjaro\nC. Mount Everest\nD. Mont Blanc\n\n||Answer: C. Mount Everest||'
        }, { quoted: msg });
    }
};
