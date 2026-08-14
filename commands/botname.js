// .botname command — Owner only: change bot's WhatsApp display name
const settings = require('../settings');

module.exports = async function(sock, from, msg, q) {
    try {
        if (!q || !q.trim()) {
            return await sock.sendMessage(from, {
                text: '❌ *Botname Usage:*\n\n`.botname <naya naam>`\n\nExample: `.botname RIZO KING BOT`'
            }, { quoted: msg });
        }
        await sock.sendMessage(from, { react: { text: '⏳', key: msg.key } });
        await sock.updateProfileName(q.trim());
        await sock.sendMessage(from, { react: { text: '✅', key: msg.key } });
        await sock.sendMessage(from, {
            text: `✅ *Bot ka naam update ho gaya!*\n\n🤖 Naya Naam: *${q.trim()}*`
        }, { quoted: msg });
    } catch (e) {
        await sock.sendMessage(from, {
            text: '❌ Naam update fail: ' + e.message
        }, { quoted: msg });
    }
};
