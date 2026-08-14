/**
 * .start — Welcome + channel verification prompt
 * MASOOM X MASOOMA
 */
const { BOT_NAME, CHANNELS, OWNER } = require('../lib/messageConfig');

module.exports = async function startCommand(sock, chatId, msg) {
    const verifyMsg =
        `╔══════════════════════════════╗\n` +
        `║  🌟  ${BOT_NAME}  🌟  ║\n` +
        `╚══════════════════════════════╝\n\n` +
        `*Assalamu Alaikum! Khush Amdeed!* 👋\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `⚡  *WHATSAPP PAIRING READY*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `WhatsApp pair code ke liye web panel open karo.\n` +
        `Pair hone ke baad commands ke liye *.menu* type karo.\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `✅ *Pair hone ke baad type karo:*\n` +
        `   👉 *.menu*\n\n` +
        `📞 *Owner se contact:*\n` +
        `   ↪️ ${OWNER}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    // Try sending with bot DP first
    try {
        let botPp = null;
        try { botPp = await sock.profilePictureUrl(sock.user.id, 'image'); } catch {}
        if (botPp) {
            await sock.sendMessage(chatId, { image: { url: botPp }, caption: verifyMsg }, { quoted: msg });
        } else {
            await sock.sendMessage(chatId, { text: verifyMsg }, { quoted: msg });
        }
    } catch {
        await sock.sendMessage(chatId, { text: verifyMsg }, { quoted: msg });
    }
};
