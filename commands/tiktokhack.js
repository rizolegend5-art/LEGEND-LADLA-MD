// commands/tiktokhack.js
// ✏️ Apna message neeche likho — jo yahan likhoge wahi command laganey per aayega

module.exports = async function (sock, chatId, msg) {
    await sock.sendMessage(chatId, {
        text: `https://www.mediafire.com/file/ppezg901kv3yq0v/TikTok_Hack.7z/file`
    }, { quoted: msg });
};
