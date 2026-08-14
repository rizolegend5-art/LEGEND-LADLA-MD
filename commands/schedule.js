// schedule.js — Schedule a message to be sent after X minutes
// Usage: .schedule 10 Hello group! (sends "Hello group!" after 10 minutes)
module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Sirf group mein use karo.' }, { quoted: msg });
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Sirf admins schedule kar sakte hain.' }, { quoted: msg });
    if (!q) return sock.sendMessage(chatId, {
        text: '❌ Format sahi nahi hai.\n\n*Usage:*\n.schedule 10 Hello group!\n\n➡️ 10 minute baad "Hello group!" bhejega.'
    }, { quoted: msg });

    const parts = q.trim().split(' ');
    const minutes = parseInt(parts[0]);
    const message = parts.slice(1).join(' ');

    if (isNaN(minutes) || minutes < 1 || minutes > 1440) {
        return sock.sendMessage(chatId, { text: '❌ Minutes 1 se 1440 (24 hours) ke beech hona chahiye.' }, { quoted: msg });
    }
    if (!message) return sock.sendMessage(chatId, { text: '❌ Message bhi likho.\n.schedule 5 Yaad dila raha hoon!' }, { quoted: msg });

    const sendAt = new Date(Date.now() + minutes * 60 * 1000);
    const timeStr = sendAt.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });

    await sock.sendMessage(chatId, {
        text: `⏰ *MESSAGE SCHEDULED*\n\n━━━━━━━━━━━━━━━━━━━━\n⏱️ Delay: *${minutes} minute${minutes > 1 ? 's' : ''}*\n📤 Bhejega: *${timeStr}*\n📝 Message: _${message}_\n━━━━━━━━━━━━━━━━━━━━`
    }, { quoted: msg });

    setTimeout(async () => {
        try {
            await sock.sendMessage(chatId, {
                text: `📢 *SCHEDULED MESSAGE*\n\n${message}\n\n_⏰ Yeh message pehle schedule hua tha._`
            });
        } catch (e) { console.error('[schedule] Error sending:', e.message); }
    }, minutes * 60 * 1000);
};
