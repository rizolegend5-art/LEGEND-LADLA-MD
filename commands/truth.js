module.exports = async function (sock, chatId, msg) {
    const truths = [
        "What is the most embarrassing thing you've ever done in public?",
        "Have you ever lied to your best friend? About what?",
        "What is your biggest fear?",
        "Have you ever cheated on a test or exam?",
        "What is the most childish thing you still do?",
        "Who was your first crush?",
        "Have you ever pretended to be sick to avoid something?",
        "What is one thing you regret most in your life?",
        "Have you ever blamed someone else for something you did?",
        "What is the worst gift you've ever received?",
        "Have you ever stalked someone on social media?",
        "What is the longest you've gone without showering?",
        "Have you ever eaten food off the floor?",
        "What is the most embarrassing song in your playlist?",
        "Have you ever lied about your age?"
    ];
    const t = truths[Math.floor(Math.random() * truths.length)];
    await sock.sendMessage(chatId, { text: `💬 *TRUTH*\n\n❓ ${t}` }, { quoted: msg });
};
