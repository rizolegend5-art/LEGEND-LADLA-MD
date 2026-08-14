// commands/freefirehack.js
// ✏️ Apna message neeche likho — jo yahan likhoge wahi command laganey per aayega

module.exports = async function (sock, chatId, msg) {
    await sock.sendMessage(chatId, {
        text: `https://www.mediafire.com/file/00kpo7wj1ibpryu/ICE_SHOP_V14_MOD_MENU.apks/file`
    }, { quoted: msg });
};
