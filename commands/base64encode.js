module.exports = async function (sock, chatId, msg, q) {
    try {
        await sock.sendMessage(chatId,{text:Buffer.from(q||'').toString('base64')},{quoted:msg});
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Tool error: '+e.message }, { quoted: msg });
    }
};
