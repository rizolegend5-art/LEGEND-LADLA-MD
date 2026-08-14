module.exports = async function (sock, chatId, msg, q) {
    try {
        let t=q||''; await sock.sendMessage(chatId,{text:`Words: ${t.trim()?t.trim().split(/\s+/).length:0}`},{quoted:msg});
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Tool error: '+e.message }, { quoted: msg });
    }
};
