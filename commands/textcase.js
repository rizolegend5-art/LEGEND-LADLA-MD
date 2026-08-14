module.exports = async function (sock, chatId, msg, q) {
    try {
        let t=q||''; await sock.sendMessage(chatId,{text:`UPPER: ${t.toUpperCase()}\nLOWER: ${t.toLowerCase()}`},{quoted:msg});
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Tool error: '+e.message }, { quoted: msg });
    }
};
