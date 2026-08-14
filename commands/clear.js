// clear.js — Note about chat clearing
module.exports = async function (sock, chatId, msg, isAdmin, q, isOwner) {
    if (!isOwner) return sock.sendMessage(chatId, { text: '❌ Sirf owner clear command use kar sakta hai.' }, { quoted: msg });
    await sock.sendMessage(chatId, {
        text: '🗑️ *Chat Clear*\n\nWhatsApp API mein bulk delete support nahi hai.\nManually chat ko swipe karke clear karo.\n\n💡 _Ya phir specific message reply karke .delete command use karo._',
    }, { quoted: msg });
};
