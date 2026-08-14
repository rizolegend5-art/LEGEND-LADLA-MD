// check.js — Check if a number is registered on WhatsApp
module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!q) return sock.sendMessage(chatId, { text: '❌ Usage: .check 923XXXXXXXXX' }, { quoted: msg });
    const clean = q.replace(/[^0-9]/g, '');
    try {
        const [result] = await sock.onWhatsApp(clean);
        if (result?.exists) {
            await sock.sendMessage(chatId, {
                text:
                    `✅ *Number Check*\n` +
                    `━━━━━━━━━━━━━━━━━━━━\n` +
                    `📱 *Number:* +${clean}\n` +
                    `🟢 *Status:* WhatsApp par registered hai!`,
            }, { quoted: msg });
        } else {
            await sock.sendMessage(chatId, {
                text:
                    `❌ *Number Check*\n` +
                    `━━━━━━━━━━━━━━━━━━━━\n` +
                    `📱 *Number:* +${clean}\n` +
                    `🔴 *Status:* WhatsApp par nahi hai.`,
            }, { quoted: msg });
        }
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ Check fail: ${e.message}` }, { quoted: msg });
    }
};
