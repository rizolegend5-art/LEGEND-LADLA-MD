module.exports = async function (sock, chatId, msg) {
    const questions = [
        { q: "What is the capital of France?", a: "Paris", opts: ["London", "Paris", "Berlin", "Rome"] },
        { q: "Which planet is known as the Red Planet?", a: "Mars", opts: ["Venus", "Jupiter", "Mars", "Saturn"] },
        { q: "What is 12 × 12?", a: "144", opts: ["124", "144", "132", "148"] },
        { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci", opts: ["Picasso", "Michelangelo", "Leonardo da Vinci", "Raphael"] },
        { q: "What is the largest ocean on Earth?", a: "Pacific Ocean", opts: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"] },
        { q: "How many sides does a hexagon have?", a: "6", opts: ["5", "6", "7", "8"] },
        { q: "What is the chemical symbol for Gold?", a: "Au", opts: ["Go", "Gd", "Au", "Ag"] },
        { q: "Which country has the most population?", a: "India", opts: ["China", "India", "USA", "Indonesia"] },
        { q: "What year did World War II end?", a: "1945", opts: ["1943", "1944", "1945", "1946"] },
        { q: "What is the fastest land animal?", a: "Cheetah", opts: ["Lion", "Horse", "Cheetah", "Leopard"] }
    ];
    const qz = questions[Math.floor(Math.random() * questions.length)];
    const optLabels = ['A', 'B', 'C', 'D'];
    const optsText = qz.opts.map((o, i) => `${optLabels[i]}. ${o}`).join('\n');
    const ansIdx = qz.opts.indexOf(qz.a);
    await sock.sendMessage(chatId, {
        text: `🧠 *Quiz Time!*\n\n❓ ${qz.q}\n\n${optsText}\n\n||Answer: ${optLabels[ansIdx]}. ${qz.a}||`
    }, { quoted: msg });
};
