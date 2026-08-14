module.exports = async function (sock, chatId, msg, q) {
    const name = q || msg.pushName || 'You';
    const compliments = [
        `${name}, you have the most amazing smile that can light up any room! 😊`,
        `${name} is genuinely one of the most kind-hearted people I know! 💖`,
        `${name}, your positivity is truly contagious and makes everyone around you feel better! ✨`,
        `${name} has a brilliant mind and an even bigger heart! 🧠❤️`,
        `${name}, you make the world a better place just by being in it! 🌍`,
        `${name}, your creativity and passion are truly inspiring! 🎨`,
        `${name} is the kind of person who makes everyone feel welcome and valued! 🤗`,
        `${name}, you handle everything with grace and style! 👑`,
        `${name}, your laugh is absolutely contagious! 😂`,
        `${name} is proof that amazing people do exist! 🌟`
    ];
    const c = compliments[Math.floor(Math.random() * compliments.length)];
    await sock.sendMessage(chatId, { text: `💝 *Compliment*\n\n${c}` }, { quoted: msg });
};
