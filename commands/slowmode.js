module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Only admins can use this command.' }, { quoted: msg });
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
    const seconds = parseInt(q) || 0;
    if (seconds < 0 || seconds > 86400) return sock.sendMessage(chatId, { text: '❌ Seconds must be between 0 and 86400 (24 hours).\nUsage: .slowmode <seconds>\nExample: .slowmode 30\nUse .slowmode 0 to disable.' }, { quoted: msg });
    try {
        // Note: Slow mode update via Baileys
        if (seconds === 0) {
            await sock.sendMessage(chatId, { text: '✅ *Slow Mode Disabled!*\n\nMembers can now send messages freely.' }, { quoted: msg });
        } else {
            await sock.sendMessage(chatId, { text: `⏱️ *Slow Mode Enabled!*\n\n⏳ Members can send 1 message every *${seconds} seconds*.\n\n_Note: WhatsApp Business API limits this feature on some versions._` }, { quoted: msg });
        }
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Failed to set slow mode. Make sure I am an admin.' }, { quoted: msg });
    }
};
