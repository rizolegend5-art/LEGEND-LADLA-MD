module.exports = async function (sock, chatId, msg, q) {
    try {
        const c='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'; let p=Array.from({length:16},()=>c[Math.floor(Math.random()*c.length)]).join(''); await sock.sendMessage(chatId,{text:'🔐 Password: '+p},{quoted:msg});
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Tool error: '+e.message }, { quoted: msg });
    }
};
