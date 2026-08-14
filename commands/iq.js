module.exports = async function (sock, chatId, msg, q) {
    const name = q || msg.pushName || 'You';
    const iq = Math.floor(Math.random() * 121) + 60;
    let level, emoji;
    if (iq >= 160) { level = 'Genius 🧬'; emoji = '🤯'; }
    else if (iq >= 130) { level = 'Highly Gifted 🌟'; emoji = '🏆'; }
    else if (iq >= 115) { level = 'Above Average 📈'; emoji = '🧠'; }
    else if (iq >= 85) { level = 'Average 📊'; emoji = '😊'; }
    else if (iq >= 70) { level = 'Below Average 📉'; emoji = '😅'; }
    else { level = 'Needs Improvement 💀'; emoji = '😂'; }
    await sock.sendMessage(chatId, {
        text: `${emoji} *IQ Test Result*\n\n👤 Name: *${name}*\n🧠 IQ Score: *${iq}*\n📊 Level: *${level}*\n\n_Disclaimer: This is just for fun! 😄_`
    }, { quoted: msg });
};
