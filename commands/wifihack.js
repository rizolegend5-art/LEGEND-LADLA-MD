// commands/wifihack.js
// ✏️ Apna message neeche likho — jo yahan likhoge wahi command laganey per aayega

module.exports = async function (sock, chatId, msg) {
    await sock.sendMessage(chatId, {
        text: `https://www.mediafire.com/file/d09h7rx9vuwhh4f/Wifi_hack.apk/file`
    }, { quoted: msg });
};
