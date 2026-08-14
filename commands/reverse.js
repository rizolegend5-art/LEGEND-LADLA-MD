module.exports = async function (sock, chatId, msg, q) {
if(!q)return sock.sendMessage(chatId,{text:'Usage: .reverse text'},{quoted:msg}); await sock.sendMessage(chatId,{text:q.split('').reverse().join('')},{quoted:msg});
};
