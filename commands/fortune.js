module.exports = async function (sock, chatId, msg) {
    const fortunes = [
        "🌟 Today is your lucky day — expect something unexpected and wonderful!",
        "💼 A great opportunity is coming your way. Be ready to grab it!",
        "🤝 A new friendship will bring joy and positivity into your life soon.",
        "💰 Financial success is on the horizon — stay patient and work hard.",
        "❤️ Love is closer than you think. Open your heart to possibilities.",
        "🌈 After every storm comes sunshine — better days are ahead for you!",
        "🧘 Peace of mind comes from accepting what you cannot change.",
        "🎯 Your next decision will be the most important one this month. Choose wisely.",
        "📚 Knowledge is your superpower — keep learning and growing.",
        "🛡️ Protect your energy. Not everyone deserves access to your life.",
        "🌻 You will find what you've been searching for when you stop looking.",
        "🔑 The key to your happiness already lies within you.",
        "✨ A small act of kindness today will return as a blessing tomorrow.",
        "🚀 Big dreams require big courage — take that first step!",
        "🌙 Your best chapter hasn't been written yet. Keep going."
    ];
    const f = fortunes[Math.floor(Math.random() * fortunes.length)];
    await sock.sendMessage(chatId, { text: `🥠 *Fortune Cookie Says...*\n\n${f}` }, { quoted: msg });
};
