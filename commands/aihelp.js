// aihelp.js — Show AI command help
module.exports = async function (sock, chatId, msg) {
    await sock.sendMessage(chatId, {
        text:
            `🤖 *AI Commands Help*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n\n` +
            `*.ai <sawaal>*\n` +
            `   → AI se kuch bhi poochho\n` +
            `   Misaal: .ai Pakistan ka capital kya hai?\n\n` +
            `*.ai on/off*\n` +
            `   → Group mein AI auto-reply on/off karo\n\n` +
            `*.define <word>*\n` +
            `   → Kisi lafz ki dictionary definition\n\n` +
            `*.anime <naam>*\n` +
            `   → Anime info search karo\n\n` +
            `*.wiki <topic>*\n` +
            `   → Wikipedia se info lao\n\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `💡 AI commands internet pe dependent hain.`,
    }, { quoted: msg });
};
