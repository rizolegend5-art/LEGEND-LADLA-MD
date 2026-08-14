module.exports = async function (sock, chatId, msg, q) {
await sock.sendMessage(chatId,{text:'📅 '+new Date().toLocaleDateString()},{quoted:msg});
};
