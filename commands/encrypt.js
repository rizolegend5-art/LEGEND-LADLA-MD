module.exports = async function (sock, chatId, msg, q) {
    try {
        let b=Buffer.from(q||'').toString('hex'); await sock.sendMessage(chatId,{text:b},{quoted:msg});
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Tool error: '+e.message }, { quoted: msg });
    }
};
