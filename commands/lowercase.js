module.exports = async function (sock, chatId, msg, q) {
if(!q)return sock.sendMessage(chatId,{text:'Usage: .lowercase text'},{quoted:msg}); await sock.sendMessage(chatId,{text:q.toLowerCase()},{quoted:msg});
};
