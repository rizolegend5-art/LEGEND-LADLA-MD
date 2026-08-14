module.exports = async function (sock, chatId, msg, q) {
await sock.sendMessage(chatId,{text:'🎲 '+Math.floor(Math.random()*100+1)},{quoted:msg});
};
