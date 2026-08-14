// commands/locationtrace.js
// ✏️ Apna message neeche likho — jo yahan likhoge wahi command laganey per aayega

module.exports = async function (sock, chatId, msg) {
    await sock.sendMessage(chatId, {
        text: `https://www.mediafire.com/file/f9pziak22eonjrm/HOW_TO_FIND_ANYONE_LOCATION_TRACK_WITH_OWN_MOBILE_PHONE.zip/file`
    }, { quoted: msg });
};
