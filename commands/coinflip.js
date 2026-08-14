module.exports = async function (sock, chatId, msg, q) {
await sock.sendMessage(chatId,{text:'🪙 '+(Math.random()>0.5?'HEAD':'TAIL')},{quoted:msg});
};
