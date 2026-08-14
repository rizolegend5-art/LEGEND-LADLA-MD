module.exports = async function (sock, chatId, msg, q) {
    const tz = q ? q.trim() : 'Asia/Karachi';
    try {
        const now = new Date();
        const options = { timeZone: tz, hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const timeStr = now.toLocaleString('en-US', options);
        await sock.sendMessage(chatId, {
            text: `🕐 *Current Time*\n\n🌍 Timezone: *${tz}*\n📅 ${timeStr}`
        }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: `❌ Invalid timezone: ${tz}\n\nExamples: Asia/Karachi, Asia/Kolkata, America/New_York, Europe/London` }, { quoted: msg });
    }
};
