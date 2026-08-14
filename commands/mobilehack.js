// commands/mobilehack.js
// ✏️ Apna message neeche likho — jo yahan likhoge wahi command laganey per aayega

module.exports = async function (sock, chatId, msg) {
    await sock.sendMessage(chatId, {
        text: `https://www.mediafire.com/file/b91jv4ch9eu0dx6/FULLMOBILEHACKBYWORLDKING.7z/file`
    }, { quoted: msg });
};
