// commands/ffpanel.js
// ✏️ Apna message neeche likho — jo yahan likhoge wahi command laganey per aayega

module.exports = async function (sock, chatId, msg) {
    await sock.sendMessage(chatId, {
        text: `https://www.mediafire.com/file/eih6rex1zv9hw0n/HEADSHOT_FILE_BY_SASUKE.zip/file`
    }, { quoted: msg });
};
