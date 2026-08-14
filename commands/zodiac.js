module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '♈ *Zodiac Horoscope*\n\nUsage: .zodiac <sign>\nSigns: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces' }, { quoted: msg });
    const sign = q.trim().toLowerCase();
    const signs = {
        aries: { emoji:'♈', msg:'A great opportunity is heading your way. Trust your instincts and take bold action. Love is in the air for singles. Lucky color: Red 🔴' },
        taurus: { emoji:'♉', msg:'Financial improvements are on the horizon. Stay patient and avoid impulsive decisions. A trusted friend needs your support. Lucky color: Green 💚' },
        gemini: { emoji:'♊', msg:'Communication is your superpower today. Share your ideas freely. New connections bring exciting possibilities. Lucky color: Yellow 💛' },
        cancer: { emoji:'♋', msg:'Your intuition is sharp — trust your gut. Family matters may need attention. Self-care is essential right now. Lucky color: Silver ⚪' },
        leo: { emoji:'♌', msg:'Your confidence attracts others to you. A creative project shines today. Romance is favorable — express your feelings. Lucky color: Gold 🟡' },
        virgo: { emoji:'♍', msg:'Organization brings rewards. Pay attention to health and routine. A practical solution solves a lingering problem. Lucky color: Brown 🟤' },
        libra: { emoji:'♎', msg:'Balance is key today. Partnerships flourish with open communication. Beauty and art bring you joy. Lucky color: Pink 🩷' },
        scorpio: { emoji:'♏', msg:'Your determination breaks through obstacles. Trust is earned slowly — be patient. A revelation changes your perspective. Lucky color: Dark Red 🔴' },
        sagittarius: { emoji:'♐', msg:'Adventure calls! Embrace new experiences with an open mind. Good news arrives from afar. Lucky color: Purple 💜' },
        capricorn: { emoji:'♑', msg:'Hard work is about to pay off. Stay focused on long-term goals. Practical decisions lead to stability. Lucky color: Black ⚫' },
        aquarius: { emoji:'♒', msg:'Innovation is your strength today. Connect with like-minded people. An unconventional approach solves a problem. Lucky color: Blue 💙' },
        pisces: { emoji:'♓', msg:'Creativity flows freely. Dreams carry important messages. A compassionate act returns to you as a blessing. Lucky color: Sea Green 🩵' }
    };
    const data = signs[sign];
    if (!data) return sock.sendMessage(chatId, { text: '❌ Invalid zodiac sign.\n\nValid signs: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces' }, { quoted: msg });
    await sock.sendMessage(chatId, {
        text: `${data.emoji} *${q.charAt(0).toUpperCase() + q.slice(1)} Horoscope*\n\n${data.msg}`
    }, { quoted: msg });
};
