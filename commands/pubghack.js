// commands/pubghack.js
// ✏️ Apna message neeche likho — jo yahan likhoge wahi command laganey per aayega

module.exports = async function (sock, chatId, msg) {
    await sock.sendMessage(chatId, {
        text: `https://www.mediafire.com/file/pobbgvu1w5ip088/PUBG_Mobile_Hack.7z/file`
    }, { quoted: msg });
};
