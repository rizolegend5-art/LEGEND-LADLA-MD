// commands/fakeeasypaisa.js
// ✏️ Apna message neeche likho — jo yahan likhoge wahi command laganey per aayega

module.exports = async function (sock, chatId, msg) {
    await sock.sendMessage(chatId, {
        text: `Apna message yahan likho`
    }, { quoted: msg });
};
