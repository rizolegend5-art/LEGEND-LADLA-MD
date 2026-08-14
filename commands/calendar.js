module.exports = async function (sock, chatId, msg, q) {
    try {
        await sock.sendMessage(chatId,{text:new Date().toDateString()},{quoted:msg});
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Tool error: '+e.message }, { quoted: msg });
    }
};
